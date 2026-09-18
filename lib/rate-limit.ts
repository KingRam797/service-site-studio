/**
 * Best-effort fixed-window rate limiter held in module memory.
 *
 * Serverless instances are per-region and recycled, so this bounds abuse from
 * a single client against a single warm instance rather than enforcing a
 * global quota. It is deliberately dependency-free; move to a shared store
 * (Upstash, Vercel KV) if the inquiry volume ever justifies it.
 */
type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** `now` is injectable so window expiry can be tested without racing the clock. */
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const existing = windows.get(key);

  if (!existing || now >= existing.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** Drops windows that have already expired so the map cannot grow without bound. */
export function pruneRateLimits(now = Date.now()) {
  for (const [key, window] of windows) {
    if (now >= window.resetAt) windows.delete(key);
  }
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
