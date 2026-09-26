// Relative, not the "@/" alias: this module is exercised by the Node test
// runner, which does not resolve tsconfig paths for runtime imports.
import { siteConfig } from "../config/site.config.ts";
import { databaseConfigured, getSql } from "./db.ts";

export type Inquiry = Record<string, string>;

/**
 * Sends from the business domain, verified in Resend by the DNS records in
 * docs/INQUIRY_EMAIL.md. Resend's shared onboarding@resend.dev sender cannot
 * reach the business inbox: it only delivers to the Resend account's own address.
 */
const DEFAULT_FROM_EMAIL = "push2Start <inquiries@push2startstudio.com>";

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
 * INQUIRY_FROM_EMAIL overrides the sender; it must be on a domain Resend
 * shows as verified, or Resend refuses the send.
 */
export function inquiryRecipient() {
  // Resend's shared sender compares the recipient with the account address
  // case-sensitively. Normalize delivery only; keep the public branding intact.
  return (process.env.INQUIRY_TO_EMAIL?.trim() || siteConfig.business.email).trim().toLowerCase();
}

function inquirySender() {
  return process.env.INQUIRY_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
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
        from: inquirySender(),
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

/**
 * Non-secret snapshot of why delivery would or would not work, for diagnosing
 * a live deployment without log access. It never returns the API key — only
 * whether one is present and what Resend says about it.
 */
export async function deliveryDiagnostics() {
  const resendKey = process.env.RESEND_API_KEY;
  const diagnostics = {
    resendKeyPresent: Boolean(resendKey),
    resendKeyLooksValid: null as boolean | null,
    resendAuthStatus: null as number | null,
    resendAuthDetail: null as string | null,
    recipient: inquiryRecipient(),
    sender: inquirySender(),
    senderIsSharedTestAddress: inquirySender().toLowerCase().includes("@resend.dev"),
    databaseConfigured,
    webhookConfigured: Boolean(process.env.INQUIRY_WEBHOOK_URL),
  };

  if (!resendKey) return diagnostics;

  try {
    // Cheapest authenticated read: 200 means the key is live, 401 means it is
    // missing, revoked, or mistyped.
    const response = await fetch("https://api.resend.com/domains", {
      headers: { authorization: `Bearer ${resendKey}` },
    });
    diagnostics.resendAuthStatus = response.status;
    diagnostics.resendKeyLooksValid = response.ok;
    if (!response.ok) diagnostics.resendAuthDetail = (await response.text().catch(() => "")).slice(0, 300);
  } catch (error) {
    diagnostics.resendKeyLooksValid = false;
    diagnostics.resendAuthDetail = error instanceof Error ? error.message : "request failed";
  }

  return diagnostics;
}

/**
 * Performs one real send and reports Resend's verbatim response.
 *
 * Auth succeeding says nothing about whether a send is permitted: Resend
 * accepts the key but refuses a sender whose domain is not verified (and its
 * shared test sender refuses any recipient but the account's own address),
 * and the refusal is only visible on the send call itself. Returns the status and body so the cause
 * is named rather than inferred. Never returns the API key.
 */
export async function sendTestEmail() {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return { attempted: false, reason: "RESEND_API_KEY is not set" };

  const payload = {
    from: inquirySender(),
    to: [inquiryRecipient()],
    subject: "push2Start delivery test",
    text: "This is a delivery test for the push2Start inquiry form. If you are reading it, direct delivery works.",
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return {
      attempted: true,
      ok: response.ok,
      status: response.status,
      // Resend names the cause here — an unverified sender, a recipient the
      // free tier will not accept, a malformed from address.
      body: (await response.text().catch(() => "")).slice(0, 600),
      sentFrom: payload.from,
      sentTo: payload.to,
    };
  } catch (error) {
    return { attempted: true, ok: false, error: error instanceof Error ? error.message : "request failed" };
  }
}
