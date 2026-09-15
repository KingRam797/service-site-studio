import type { SiteConfig } from "./types";

// This demo is intentionally honest: replace it with a real client's intake.
// The visual direction is a design decision, not a generic theme toggle.
export const siteConfig: SiteConfig = {
  business: {
    name: "Service Site Studio",
    owner: "Your Name",
    location: "Your City",
    phone: "+1 555 555 0147",
    email: "hello@example.com",
    tagline: "A first impression built to work.",
    shortDescription:
      "A conversion-ready service business site shaped around real work, real policies, and the way customers actually book.",
    availability: "Now booking select launches",
    paymentMethods: "Invoice · card · bank transfer",
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
    ],
  },
  seo: {
    title: "Service Site Studio — Conversion-ready business websites",
    description:
      "Distinctive mobile-first websites for independent service businesses, with booking, payments, policies, and deployment built around real operations.",
    businessType: "ProfessionalService",
  },
  theme: {
    background: "#f3f0e9",
    surface: "#fffdf8",
    ink: "#10243e",
    muted: "#5f6873",
    accent: "#e3482f",
    accentAlt: "#2b69ff",
    displayFont: '"Arial Narrow", "Aptos Display", sans-serif',
    bodyFont: '"Aptos", "Segoe UI", sans-serif',
    radius: "soft",
    composition: "workshop",
    signature: "offset-frame",
  },
  hero: {
    eyebrow: "Design × operations × launch",
    headline: "Your work already has a standard.",
    emphasizedLine: "Your website should prove it.",
    body:
      "We turn the way your business actually works—services, schedule, payments, policies, and proof—into one clear path from visitor to customer.",
    actions: [
      { label: "Plan a launch", href: "#start", kind: "primary" },
      { label: "See the system", href: "#services", kind: "secondary" },
    ],
    facts: [
      { label: "Built for", value: "service businesses" },
      { label: "Designed for", value: "mobile customers" },
      { label: "Delivered with", value: "a real handoff" },
    ],
  },
  proof: {
    eyebrow: "The proof layer",
    heading: "The site begins with what customers need to believe.",
    intro:
      "Use real work, specific service details, and visible operating rules. Replace these demo cards with client-approved photography and outcomes.",
    items: [
      {
        title: "The signature result",
        category: "Lead story",
        description: "The strongest piece of work opens the visual argument.",
        result: "Show, then explain",
      },
      {
        title: "The range",
        category: "Proof grid",
        description: "Different customers or services establish breadth without clutter.",
        result: "Earn trust quickly",
      },
      {
        title: "The person",
        category: "Founder credibility",
        description: "The owner and their process make the business feel accountable.",
        result: "Make contact human",
      },
    ],
  },
  services: {
    eyebrow: "The offer",
    heading: "Customers should know what they can choose.",
    intro:
      "Service cards are configured from one source and remain consistent in the page, form, and structured search data.",
    items: [
      {
        name: "Proof Page",
        description: "A distinctive one-page site with positioning, services, proof, contact routing, SEO setup, and deployment.",
        price: "from $499",
        duration: "5–7 business days",
        note: "Best for a clear offer",
      },
      {
        name: "Booking Ready",
        description: "Adds scheduling or quote intake, policies, richer proof, conversion tracking, and owner handoff.",
        price: "from $999",
        duration: "7–10 business days",
        note: "Best for appointments",
      },
      {
        name: "Operations Site",
        description: "Adds deposits or payments, capacity rules, database-backed requests, notifications, and custom workflow logic.",
        price: "from $1,799",
        duration: "10–15 business days",
        note: "Best for complex fulfillment",
      },
    ],
  },
  process: [
    { title: "Map the business", description: "Capture the offer, proof, policies, capacity, and customer path in one structured intake." },
    { title: "Direct the identity", description: "Choose one visual thesis rooted in the client's actual craft, audience, and materials." },
    { title: "Build the conversion", description: "Connect services, proof, booking or inquiry, and owner follow-up into one path." },
    { title: "Verify the launch", description: "Test mobile behavior, forms, links, metadata, accessibility, analytics, and deployment." },
  ],
  about: {
    eyebrow: "Why this system exists",
    heading: "A template should remove repetition, not identity.",
    body:
      "The shared architecture handles clarity, responsiveness, conversion, and delivery. The visible design is rebuilt around each client's own work so a decorator, barber, studio, and baker never emerge wearing the same costume.",
  },
  faqs: [
    { question: "Will the site look like the other sites?", answer: "No. The operating foundation is reused; the visual thesis, typography, composition, imagery, and signature interaction are chosen for your business." },
    { question: "What do I need before we start?", answer: "A completed intake, approved photos or assets, service information, policies, contact details, and timely feedback from one decision-maker." },
    { question: "Can it accept bookings or payments?", answer: "Yes. Booking links, request workflows, deposits, payments, availability, and capacity rules are scoped according to the package." },
    { question: "What happens after launch?", answer: "You receive deployment access, operating instructions, configuration notes, and a clear list of any recurring platform costs." },
  ],
  conversion: {
    mode: "quote",
    heading: "Start with the business—not a theme.",
    intro: "Tell us what you sell, how customers book, and where the current process breaks down.",
    submitLabel: "Send launch request",
    successMessage: "Your launch request is ready. Check your email or messages for the next step.",
    fallback: "email",
    fields: ["name", "email", "phone", "service", "budget", "message"],
  },
  footerNote: "Built from a reusable operating system. Directed for one business.",
};
