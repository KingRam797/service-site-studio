import { siteConfig } from "@/config/site.config";
import { hasDialablePhone } from "@/lib/config";
import { absoluteUrl, siteUrl } from "@/lib/site-url";
import { testimonials } from "@/data/testimonials";

/** Strips "$1,799+" down to "1799" for schema's numeric price field. */
function numericPrice(price?: string) {
  return price?.replace(/[^0-9.]/g, "") ?? "";
}

export function professionalServiceSchema() {
  const config = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": config.seo.businessType,
    name: config.business.name,
    description: config.seo.description,
    url: siteUrl,
    // Placeholders are omitted rather than published: a TODO_FROM_KING token
    // in structured data is worse than an absent property.
    ...(config.business.email && { email: config.business.email }),
    ...(hasDialablePhone(config.business.phone) && { telephone: config.business.phone }),
    areaServed: [
      { "@type": "City", name: "Detroit" },
      { "@type": "State", name: "Michigan" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Detroit",
      addressRegion: "MI",
      addressCountry: "US",
    },
    priceRange: "$499-$1799+",
    makesOffer: config.services.items.map((service) => ({
      "@type": "Offer",
      name: service.name,
      price: numericPrice(service.price),
      priceCurrency: "USD",
      url: absoluteUrl(`/${service.slug}`),
      itemOffered: { "@type": "Service", name: service.name, description: service.description },
    })),
    // Review markup is emitted only for real testimonials. Never for an empty
    // array — that is a structured-data penalty risk.
    ...(testimonials.length > 0 && {
      review: testimonials.map((testimonial) => ({
        "@type": "Review",
        reviewBody: testimonial.quote,
        datePublished: testimonial.date,
        author: { "@type": "Person", name: testimonial.name },
      })),
    }),
    ...(config.business.socials?.length && {
      sameAs: config.business.socials.map((social) => social.href),
    }),
  };
}

/** Built from the FAQ entries already on the page — no new FAQ content. */
export function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: siteConfig.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function serviceSchema(slug: string) {
  const service = siteConfig.services.items.find((item) => item.slug === slug);
  if (!service) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: absoluteUrl(`/${service.slug}`),
    serviceType: "Website design and development",
    provider: { "@type": siteConfig.seo.businessType, name: siteConfig.business.name, url: siteUrl },
    areaServed: [
      { "@type": "City", name: "Detroit" },
      { "@type": "State", name: "Michigan" },
    ],
    offers: {
      "@type": "Offer",
      price: numericPrice(service.price),
      priceCurrency: "USD",
      url: absoluteUrl(`/${service.slug}`),
    },
  };
}

/** Single helper so every page emits JSON-LD the same way. */
export function jsonLdProps(schema: object) {
  return { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(schema) } } as const;
}
