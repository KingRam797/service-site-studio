/**
 * Canonical origin for metadata, sitemap, robots, and JSON-LD.
 *
 * `NEXT_PUBLIC_SITE_URL` wins so a custom domain needs no code change. The
 * fallback is the current production deployment, which keeps canonical and
 * sitemap URLs absolute even when the variable is unset — a relative
 * canonical is worse than a slightly stale absolute one.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://service-site-studio-five.vercel.app").replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
