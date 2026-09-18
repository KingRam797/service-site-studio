/**
 * Canonical origin for metadata, sitemap, robots, and JSON-LD.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — an explicit custom domain, always wins.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — set by Vercel to the project's own
 *      production domain. It follows a project rename, so canonical and
 *      sitemap URLs cannot silently rot the way a hardcoded host does.
 *   3. A literal fallback for local builds, so URLs stay absolute — a
 *      relative canonical is worse than a stale absolute one.
 *
 * Only referenced from server code; VERCEL_PROJECT_PRODUCTION_URL is not
 * NEXT_PUBLIC_ and would be undefined in the browser.
 */
const LOCAL_FALLBACK = "https://push2start.vercel.app";

/** Takes only the keys it reads, so tests can pass a bare object. */
export function resolveSiteUrl(env: Record<string, string | undefined> = process.env) {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const raw = explicit || (vercel ? `https://${vercel}` : LOCAL_FALLBACK);
  return raw.replace(/\/$/, "");
}

export const siteUrl = resolveSiteUrl();

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
