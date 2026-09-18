"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
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

const NOTE = "Project context only. Never enter passwords or provider keys here.";

type Status = "idle" | "sending" | "sent" | "error";

export default function InquiryForm({
  config,
  preselectedService,
}: {
  config: SiteConfig;
  preselectedService?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const services = config.services.items.map((item) => item.name);
  // Set on mount, not render, so a prerendered page cannot ship a stale value.
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: startedAt.current }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Your request could not be delivered.");
      form.reset();
      startedAt.current = Date.now();
      setStatus("sent");
      // Fired on a confirmed 2xx only, never on click.
      try {
        track("inquiry_submit", { service: String(data.service ?? "unspecified") });
      } catch {
        // Analytics must never turn a delivered lead into an error state.
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Your request could not be delivered.");
      setStatus("error");
    }
  }

  return (
    <form className="inquiry-form" onSubmit={submit} noValidate>
      {config.conversion.fields.map((field) => {
        if (field === "message") {
          return (
            <label className="field field-wide" key={field}>
              <span>{labels[field]}</span>
              <textarea
                name={field}
                rows={5}
                required
                minLength={20}
                maxLength={4000}
                placeholder="What do you sell, how do customers act now, and what should change after launch?"
              />
            </label>
          );
        }
        if (field === "service") {
          return (
            <label className="field" key={field}>
              <span>{labels[field]}</span>
              <select name={field} required defaultValue={preselectedService ?? ""}>
                <option value="" disabled>Select a build</option>
                {services.map((service) => <option key={service}>{service}</option>)}
              </select>
            </label>
          );
        }
        const type = field === "email" ? "email" : field === "date" ? "date" : field === "time" ? "time" : field === "phone" ? "tel" : "text";
        return (
          <label className="field" key={field}>
            <span>{labels[field]}</span>
            <input name={field} type={type} required={field === "name" || field === "email"} maxLength={120} />
          </label>
        );
      })}

      {/* Honeypot: hidden from sight, from screen readers, and from the tab order. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company">Company (leave this field empty)</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-submit">
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : config.conversion.submitLabel}
          <span aria-hidden="true">↗</span>
        </button>
        <p aria-live="polite" className={status === "error" ? "form-note form-note-error" : "form-note"}>
          {status === "sent" ? (
            <>
              {config.conversion.successMessage}
              {config.conversion.replyWindow ? ` You can expect a reply ${config.conversion.replyWindow}.` : ""}
              {config.business.email ? (
                <> If you do not hear back, email <a href={`mailto:${config.business.email}`}>{config.business.email}</a>.</>
              ) : null}
            </>
          ) : status === "error" ? (
            <>
              {error}
              {config.business.email ? (
                <> Send it straight to <a href={`mailto:${config.business.email}`}>{config.business.email}</a> so it is not lost.</>
              ) : null}
            </>
          ) : (
            NOTE
          )}
        </p>
      </div>
    </form>
  );
}
