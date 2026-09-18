import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import { absoluteUrl } from "@/lib/site-url";

/**
 * Generated, not hand-written: the tier pages come from `siteConfig`, so
 * adding or renaming a tier updates the sitemap with it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    ...siteConfig.services.items.map((service) => ({
      url: absoluteUrl(`/${service.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/terms"), lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: absoluteUrl("/privacy"), lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
