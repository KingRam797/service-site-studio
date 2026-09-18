// Relative, not the "@/" alias: this module is exercised by the Node test
// runner, which does not resolve tsconfig paths for runtime imports.
import { siteConfig } from "../config/site.config.ts";
import { databaseConfigured, getSql } from "./db.ts";

export type Inquiry = Record<string, string>;

/** Resend's shared test sender, which needs no verified domain of our own. */
const DEFAULT_FROM_EMAIL = "push2Start <onboarding@resend.dev>";

/**
 * Each delivery channel is independent and never throws: one unreachable
 * provider must not discard an inquiry another channel already captured.
 */
export async function storeInquiry(inquiry: Inquiry) {
  if (!databaseConfigured) return false;
  try {
    const sql = getSql();
    await sql`
      INSERT INTO build_inquiries (name, email, phone, service, budget, message)
      VALUES (
        ${inquiry.name},
        ${inquiry.email || null},
        ${inquiry.phone || null},
        ${inquiry.service || null},
        ${inquiry.budget || null},
        ${inquiry.message}
      )
    `;
    return true;
  } catch (error) {
    console.error("[inquiry] Database write failed:", error);
    return false;
  }
}

export async function postWebhook(inquiry: Inquiry) {
  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (!webhook) return false;
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ source: siteConfig.business.name, receivedAt: new Date().toISOString(), ...inquiry }),
    });
    if (!response.ok) console.error(`[inquiry] Webhook returned ${response.status}.`);
    return response.ok;
  } catch (error) {
    console.error("[inquiry] Webhook request failed:", error);
    return false;
  }
}

/**
 * Sends the request to the owner. Only RESEND_API_KEY is required.
 *
 * Recipient defaults to the public contact address in `siteConfig`, which is
 * usually right. INQUIRY_TO_EMAIL redirects notifications elsewhere without
 * changing the address the site publishes — needed while sending through
 * Resend's shared test sender, which only delivers to the address the Resend
 * account itself was registered with.
 *
 * INQUIRY_FROM_EMAIL overrides the sender once a domain is verified.
 */
export function inquiryRecipient() {
  return process.env.INQUIRY_TO_EMAIL || siteConfig.business.email;
}

export async function emailOwner(inquiry: Inquiry) {
  const resendKey = process.env.RESEND_API_KEY;
  const recipient = inquiryRecipient();
  if (!resendKey || !recipient) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.INQUIRY_FROM_EMAIL || DEFAULT_FROM_EMAIL,
        to: [recipient],
        reply_to: inquiry.email,
        subject: `New ${siteConfig.conversion.mode} request from ${inquiry.name}`,
        text: Object.entries(inquiry).map(([key, value]) => `${key}: ${value}`).join("\n"),
      }),
    });

    if (!response.ok) {
      // Resend's body names the cause — unverified domain, bad key, blocked
      // recipient — which is the difference between a five-minute fix and a
      // guess. It contains no inquiry content.
      const detail = await response.text().catch(() => "");
      console.error(`[inquiry] Resend returned ${response.status}: ${detail}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[inquiry] Resend request failed:", error);
    return false;
  }
}

/**
 * Fans the inquiry out to every configured channel. Returns which succeeded so
 * the caller can tell "nothing was configured" from "the owner was not
 * emailed" — the second still captured the lead.
 */
export async function deliverInquiry(inquiry: Inquiry) {
  const [stored, webhooked, emailed] = await Promise.all([
    storeInquiry(inquiry),
    postWebhook(inquiry),
    emailOwner(inquiry),
  ]);

  // Every build review request is meant to reach the owner's inbox. If it was
  // captured but not emailed, the lead is not lost but the owner will not know
  // it arrived, so say so loudly in the function logs.
  if (!emailed && (stored || webhooked)) {
    console.error(
      `[inquiry] Captured but NOT emailed to ${inquiryRecipient()}. ` +
        `Set RESEND_API_KEY in the Vercel project to enable direct delivery.`,
    );
  }

  return { stored, webhooked, emailed, delivered: stored || webhooked || emailed };
}
