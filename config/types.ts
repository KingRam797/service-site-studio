export type HexColor = `#${string}`;

export type Theme = {
  background: HexColor;
  surface: HexColor;
  ink: HexColor;
  muted: HexColor;
  accent: HexColor;
  accentAlt: HexColor;
  displayFont: string;
  bodyFont: string;
  radius: "none" | "soft" | "round";
  composition: "editorial" | "cinematic" | "workshop" | "gallery";
  signature: "offset-frame" | "moving-rule" | "spotlight" | "color-block";
};

export type Action = {
  label: string;
  href: string;
  kind?: "primary" | "secondary";
};

export type ProofItem = {
  title: string;
  category: string;
  description: string;
  image?: string;
  /** Descriptive alt text for `image`. Falls back to a generic preview label. */
  imageAlt?: string;
  result?: string;
  /** One line on what the site does for the business. Omitted renders nothing. */
  outcome?: string;
  focalPoint?: string;
  href?: string;
};

export type Service = {
  name: string;
  slug: string;
  description: string;
  price?: string;
  duration?: string;
  note?: string;
};

export type FAQ = { question: string; answer: string };

export type ConversionConfig = {
  mode: "quote" | "appointment" | "order";
  heading: string;
  intro: string;
  submitLabel: string;
  successMessage: string;
  /** e.g. "within one business day". Unset renders no reply-window claim. */
  replyWindow?: string;
  fallback: "email" | "sms";
  depositLink?: string;
  externalBookingUrl?: string;
  fields: Array<
    | "name"
    | "email"
    | "phone"
    | "service"
    | "date"
    | "time"
    | "budget"
    | "guestCount"
    | "message"
  >;
};

export type SiteConfig = {
  business: {
    name: string;
    owner?: string;
    location: string;
    phone: string;
    email: string;
    tagline: string;
    shortDescription: string;
    availability?: string;
    paymentMethods?: string;
    socials?: Array<{ label: string; href: string }>;
  };
  seo: {
    title: string;
    description: string;
    businessType: string;
  };
  theme: Theme;
  hero: {
    eyebrow: string;
    headline: string;
    emphasizedLine: string;
    body: string;
    actions: Action[];
    facts: Array<{ label: string; value: string }>;
    image?: string;
    imageAlt?: string;
  };
  proof: { eyebrow: string; heading: string; intro: string; items: ProofItem[] };
  services: { eyebrow: string; heading: string; intro: string; items: Service[] };
  process: Array<{ title: string; description: string }>;
  about: { eyebrow: string; heading: string; body: string; image?: string; imageAlt?: string };
  faqs: FAQ[];
  conversion: ConversionConfig;
  footerNote: string;
};
