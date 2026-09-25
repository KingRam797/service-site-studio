import type { SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
  business: {
    name: "push2Start",
    owner: "Victor Emerson",
    legalEntity: "PainOrPane Professionals",
    location: "Detroit, Michigan · serving businesses remotely",
    phone: "586-224-2150",
    email: "pusher@push2startstudio.com",
    tagline: "Expert, enterprise-grade sites in 10–14 days.",
    shortDescription:
      "Distinctive business websites that connect brand, customer action, and the way the work actually gets done.",
    availability: "Now reviewing launch requests",
    paymentMethods: "50% · 25% · 25% production structure",
    socials: [{ label: "Instagram", href: "https://www.instagram.com/push2start888" }],
  },
  seo: {
    title: "push2Start — Business websites built to launch",
    description:
      "Distinctive, operations-ready business websites delivered in 10–14 calendar days from READY_TO_BUILD.",
    businessType: "ProfessionalService",
  },
  theme: {
    background: "#030506",
    surface: "#101518",
    ink: "#f0f3f5",
    muted: "#a4b0b6",
    accent: "#ceff00",
    accentAlt: "#00cdf0",
    displayFont: '"Arial Black", "Aptos Display", sans-serif',
    bodyFont: '"Aptos", "Segoe UI", sans-serif',
    radius: "soft",
    composition: "editorial",
    signature: "moving-rule",
  },
  hero: {
    eyebrow: "commit / build / ship",
    headline: "Commit today.",
    emphasizedLine: "A brighter tomorrow.",
    body:
      "We turn the way your business actually works into a distinctive site customers can understand, trust, and act on—without a six-month agency process.",
    actions: [
      { label: "Start a build", href: "#start", kind: "primary" },
      { label: "Compare the builds", href: "#services", kind: "secondary" },
    ],
    facts: [
      { label: "Production window", value: "10–14 calendar days" },
      { label: "Build begins", value: "At READY_TO_BUILD" },
      { label: "Payment rhythm", value: "50 / 25 / 25" },
    ],
  },
  proof: {
    eyebrow: "Selected builds",
    heading: "The proof is in what ships.",
    intro:
      "Each build starts with the same standard and ends with a different identity. These projects shaped the push2Start production system.",
    items: [
      {
        title: "Creative Impressions",
        category: "Event décor · inquiry system",
        description: "A visual service experience built around quote requests, date capacity, deposits, and Detroit-area credibility.",
        result: "Brand and operations in one path",
        href: "https://creative-impressions.vercel.app/",
        image: "/work/creative-impressions-site.webp",
        imageAlt: "Creative Impressions homepage with lavender event décor and event inquiry link",
      },
      {
        title: "Like That Cutz",
        category: "Barber · booking system",
        description: "A mobile-first booking direction connecting real portfolio work, service rules, buffers, and payment choice.",
        result: "Booking, buffers, and payment in one path",
        href: "https://like-that-cutz-one.vercel.app",
        image: "/work/like-that-cutz-site.webp",
        imageAlt: "Like That Cutz homepage with Damon, the private-studio offer and booking link",
      },
      {
        title: "NoKissing",
        category: "Artist platform · music and booking",
        description: "A chrome-and-amber artist world bringing music, visual identity, social discovery, and booking into one cohesive experience.",
        result: "An original identity built to travel",
        href: "https://no-kissing.vercel.app",
        image: "/work/nokissing-site.webp",
        imageAlt: "NoKissing homepage with chrome airplane emblem, amber portrait and music navigation",
      },
      {
        title: "Smile Now / Cry Later",
        category: "Recording studio · sessions",
        description: "An artist-led recording and creative-direction site built around Vision and Vybe studio sessions with Jayze.",
        result: "A studio offer with a point of view",
        href: "https://i-c-melodies.vercel.app/",
        image: "/work/sncl-site.webp",
        imageAlt: "Smile Now / Cry Later homepage with Jayze’s artist photography and studio identity",
      },
    ],
  },
  services: {
    eyebrow: "Choose the outcome",
    heading: "Three ways to get moving.",
    intro:
      "The package is based on what the site must do for the business—not how many decorative pages can be added to an estimate.",
    items: [
      {
        name: "Proof Page",
        slug: "proof-page",
        description: "A high-impact single page for one clear offer: positioning, services, real work, contact routing, essential search setup, and launch.",
        price: "$499",
        duration: "10–14 calendar days",
        note: "Great in a rush. Best when done right. Better in public.",
      },
      {
        name: "Booking Ready",
        slug: "booking-ready",
        description: "A build that takes real requests: custom intake, policies, richer proof, conversion tracking, and an owner-ready handoff.",
        price: "$999",
        duration: "10–14 calendar days",
        note: "Your Build. Your Brand. Your Kind.",
      },
      {
        name: "Operations Site",
        slug: "operations-site",
        description: "A site that runs the work: scoped payments, capacity rules, data-backed requests, notifications, and custom workflow logic.",
        price: "$1,799+",
        duration: "10–14 calendar days",
        note: "You Launch. We Land.",
      },
    ],
  },
  process: [
    { title: "Materials gathered", description: "Content, links, policies, approved images, and one decision-maker arrive in the workspace." },
    { title: "50% reserves production", description: "The opening payment secures the build window and necessary production resources." },
    { title: "READY_TO_BUILD", description: "The clock starts only when the required materials and opening payment are complete." },
    { title: "Direction approved · 25%", description: "Approve the visual direction and working primary page before the full system is completed." },
    { title: "Launch approved · 25%", description: "The final payment clears production launch, access transfer, and the operating handoff." },
  ],
  about: {
    eyebrow: "The push2Start standard",
    heading: "Reusable discipline. Unmistakable identity.",
    body:
      "The invisible foundation—responsive behavior, accessibility, forms, metadata, deployment checks, and handoff—should be repeatable. The part customers see should belong to one business alone. That is how we move quickly without making every client look the same.",
  },
  faqs: [
    { question: "When does the 10–14-day window start?", answer: "Production takes 10–14 calendar days from our written READY_TO_BUILD confirmation: the opening 50% is handled, required materials are gathered, and one decision-maker is ready to respond. Delays in materials or approvals pause the window." },
    { question: "What does the 50 / 25 / 25 structure mean?", answer: "50% reserves the production window, 25% follows approval of the visual direction and working primary page, and the final 25% is due before production launch and transfer." },
    { question: "Will my site look like the other builds?", answer: "No. The operating foundation is reused; the typography, palette, composition, image rhythm, voice, and signature interaction are directed for your business." },
    { question: "Can you connect booking, payments, or store tools?", answer: "Yes. Booking, deposits, payments, availability, capacity, and fulfillment logic are scoped into Booking Ready or the Operations Site based on what the workflow needs to enforce." },
    { question: "Do I send passwords through the inquiry form?", answer: "Never. The inquiry collects project context only. Provider access and sensitive credentials use a separate secured authorization step after the project is accepted." },
  ],
  conversion: {
    mode: "quote",
    heading: "Make the first commit.",
    intro: "Tell us what the business sells, how customers act today, and what a successful launch needs to change.",
    submitLabel: "Request a build review",
    successMessage: "Your build request is in. The next step is a fit and materials review.",
    fallback: "email",
    fields: ["name", "email", "phone", "service", "budget", "message"],
  },
  footerNote: "Built to move from good idea to working business system.",
};
