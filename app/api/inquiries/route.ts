import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site.config";

const allowedFields = new Set(siteConfig.conversion.fields);

function clean(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid request." }, { status: 400 });
  }

  const inquiry = Object.fromEntries(
    Object.entries(body)
      .filter(([key]) => allowedFields.has(key as never))
      .map(([key, value]) => [key, clean(value)]),
  );

  if (!inquiry.name || !inquiry.message || (!inquiry.email && !inquiry.phone)) {
    return NextResponse.json({ error: "Name, message, and contact information are required." }, { status: 400 });
  }

  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  let delivered = false;

  if (webhook) {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ source: siteConfig.business.name, receivedAt: new Date().toISOString(), ...inquiry }),
    });
    delivered ||= response.ok;
  }

  if (resendKey && process.env.INQUIRY_FROM_EMAIL) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.INQUIRY_FROM_EMAIL,
        to: [siteConfig.business.email],
        subject: `New ${siteConfig.conversion.mode} request from ${inquiry.name}`,
        text: Object.entries(inquiry).map(([key, value]) => `${key}: ${value}`).join("\n"),
      }),
    });
    delivered ||= response.ok;
  }

  if (!delivered) return NextResponse.json({ error: "Direct delivery is not configured." }, { status: 503 });
  return NextResponse.json({ ok: true });
}
