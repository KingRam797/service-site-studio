"use client";

import { FormEvent, useMemo, useState } from "react";
import type { SiteConfig } from "@/config/types";

const labels = {
  name: "Your name",
  email: "Email",
  phone: "Phone",
  service: "What do you need?",
  date: "Preferred date",
  time: "Preferred time",
  budget: "Working budget",
  guestCount: "Guest count or quantity",
  message: "Tell us about the work",
} as const;

export default function InquiryForm({ config }: { config: SiteConfig }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback">("idle");
  const services = useMemo(() => config.services.items.map((item) => item.name), [config.services.items]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("delivery unavailable");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("fallback");
      const summary = Object.entries(data).map(([key, value]) => `${labels[key as keyof typeof labels] ?? key}: ${value}`).join("\n");
      if (config.conversion.fallback === "sms" && config.business.phone) {
        window.location.href = `sms:${config.business.phone.replace(/[^+\d]/g, "")}?&body=${encodeURIComponent(summary)}`;
      } else if (config.business.email) {
        window.location.href = `mailto:${config.business.email}?subject=${encodeURIComponent(`New ${config.conversion.mode} request`)}&body=${encodeURIComponent(summary)}`;
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
      }
    }
  }

  return (
    <form className="inquiry-form" onSubmit={submit}>
      {config.conversion.fields.map((field) => {
        if (field === "message") return <label className="field field-wide" key={field}><span>{labels[field]}</span><textarea name={field} rows={5} required placeholder="What do you sell, how do customers act now, and what should change after launch?" /></label>;
        if (field === "service") return <label className="field" key={field}><span>{labels[field]}</span><select name={field} required defaultValue=""><option value="" disabled>Select a service</option>{services.map((service) => <option key={service}>{service}</option>)}</select></label>;
        const type = field === "email" ? "email" : field === "date" ? "date" : field === "time" ? "time" : field === "phone" ? "tel" : "text";
        return <label className="field" key={field}><span>{labels[field]}</span><input name={field} type={type} required={field === "name" || field === "email" || field === "phone"} /></label>;
      })}
      <div className="form-submit">
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : config.conversion.submitLabel}<span aria-hidden="true">↗</span></button>
        <p aria-live="polite">{status === "sent" ? config.conversion.successMessage : status === "fallback" ? (config.business.email || config.business.phone ? "Opening your preferred contact method to finish sending." : "Direct delivery is not connected yet. Your request has been copied so you can keep it.") : "Project context only. Never enter passwords or provider keys here."}</p>
      </div>
    </form>
  );
}
