import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site.config";
import { clientKey, pruneRateLimits, rateLimit } from "@/lib/rate-limit";
import { deliverInquiry } from "@/lib/inquiry-delivery";

const allowedFields = new Set(siteConfig.conversion.fields);

/** Hidden field: a real person never fills it, most naive bots do. */
const HONEYPOT_FIELD = "company";
/** A human cannot read the form and complete it faster than this. */
const MIN_SUBMIT_MS = 3000;
const MAX_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

const MESSAGE_MIN = 20;
const MESSAGE_MAX = 4000;
const NAME_MAX = 120;

// Deliberately permissive: one @, a dot in the domain, no whitespace. Stricter
// patterns reject valid addresses far more often than they catch bad ones.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Accepted silently so a bot cannot tell rejection from success. */
function accepted() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid request." }, { status: 400 });
  }

  pruneRateLimits();
  const limit = rateLimit(clientKey(request), MAX_LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly, or email us directly." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } },
    );
  }

  if (clean(body[HONEYPOT_FIELD])) return accepted();

  const startedAt = Number(body.startedAt);
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_SUBMIT_MS) return accepted();

  const inquiry = Object.fromEntries(
    Object.entries(body)
      .filter(([key]) => allowedFields.has(key as never))
      .map(([key, value]) => [key, clean(value, key === "message" ? MESSAGE_MAX : NAME_MAX)]),
  );

  const errors: string[] = [];
  if (!inquiry.name) errors.push("a name");
  if (!inquiry.email || !emailPattern.test(inquiry.email)) errors.push("a valid email address");
  if (!inquiry.message || inquiry.message.length < MESSAGE_MIN) {
    errors.push(`a message of at least ${MESSAGE_MIN} characters`);
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: `Please include ${errors.join(", ")}.` }, { status: 400 });
  }

  const { delivered } = await deliverInquiry(inquiry);

  if (!delivered) return NextResponse.json({ error: "We could not deliver your request." }, { status: 503 });
  return accepted();
}
