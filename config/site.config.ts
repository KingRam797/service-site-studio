import type { SiteConfig } from "./types";

// Total promotional allocation, not a live remaining-spots counter.
// Raise to at most 50 when expanding the offer; confirm allocations during review.
export const FREE_PROOF_PAGE_LIMIT = 15;
if (!Number.isInteger(FREE_PROOF_PAGE_LIMIT) || FREE_PROOF_PAGE_LIMIT < 1 || FREE_PROOF_PAGE_LIMIT > 50) {
  throw new Error("Free Proof Page allocation must be between 1 and 50.");
}
const proofPageOffer = `First ${FREE_PROOF_PAGE_LIMIT} Proof Pages free`;
const proofPageTerms = `The first ${FREE_PROOF_PAGE_LIMIT} customers confirmed for the offer receive a Proof Page build with the $499 build fee waived. Submit a Proof Page request; we confirm availability and scope during review. An inquiry does not reserve a spot. Domains, third-party subscriptions, transaction fees, licensed assets, and out-of-scope work remain separate. Booking Ready and Operations Site retain their regular prices.`;

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
    availability: proofPageOffer,
    paymentMethods: "50% · 25% · 25% for paid builds; no build-fee payments for confirmed free Proof Pages",
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
    eyebrow: proofPageOffer,
    headline: "Commit today.",
    emphasizedLine: "A brighter tomorrow.",
    body:
      "We turn the way your business actually works into a distinctive site customers can understand, trust, and act on—without a six-month agency process.",
    actions: [
      { label: "Request a free Proof Page", href: "/proof-page#start", kind: "primary" },
      { label: "Compare the builds", href: "#services", kind: "secondary" },
    ],
    facts: [
      { label: "Production window", value: "10–14 calendar days" },
      { label: "Build begins", value: "At READY_TO_BUILD" },
      { label: "Launch offer", value: proofPageOffer },
    ],
  },
  proof: {
    eyebrow: "Selected builds",
    heading: "The proof is in what ships.",
    intro:
      "Each build starts with the same standard and ends with a different identity. These projects shaped the push2Start production system.",
    items: [
      {
        title: "Dilla Den",
        category: "Creative portfolio · modeling, music and footwear",
        description: "Kameron Ingram’s modeling portfolio connects streetwear, editorial photography, runway motion, music, and custom footwear with a clear path for creative collaborations.",
        result: "A creative identity with room to grow",
        href: "https://www.kameron.space",
        image: "/work/dilla-den-site.jpg",
        imageAlt: "Dilla Den homepage with Kameron Ingram’s portrait, cream editorial layout and collection link",
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
      `${proofPageOffer}. Proof Page is normally $499; the build fee is waived for confirmed offer spots. Choose the package based on what your site needs to do.`,
    items: [
      {
        name: "Proof Page",
        slug: "proof-page",
        description: "A high-impact single page for one clear offer: positioning, services, real work, contact routing, essential search setup, and launch.",
        price: "$499",
        duration: "10–14 calendar days",
        note: `${proofPageOffer}. Normally $499. Offer availability confirmed during review; third-party costs separate.`,
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
    { title: "50% reserves production", description: "For paid builds, the opening payment secures production. Confirmed free Proof Pages have no build fee; we confirm the production window in writing." },
    { title: "READY_TO_BUILD", description: "The clock starts when required materials are complete and the opening payment or free Proof Page confirmation is in place." },
    { title: "Direction approved · 25%", description: "Approve the visual direction and working primary page before the full system is completed. The 25% payment applies to paid builds only." },
    { title: "Launch approved · 25%", description: "Approve launch, access transfer, and the operating handoff. The final 25% payment applies to paid builds only." },
  ],
  about: {
    eyebrow: "The push2Start standard",
    heading: "Reusable discipline. Unmistakable identity.",
    body:
      "The invisible foundation—responsive behavior, accessibility, forms, metadata, deployment checks, and handoff—should be repeatable. The part customers see should belong to one business alone. That is how we move quickly without making every client look the same.",
  },
  faqs: [
    { question: "How does the free Proof Page offer work?", answer: proofPageTerms },
    { question: "When does the 10–14-day window start?", answer: "Production takes 10–14 calendar days from our written READY_TO_BUILD confirmation: the opening 50% is handled or your free Proof Page spot is confirmed, required materials are gathered, and one decision-maker is ready to respond. Delays in materials or approvals pause the window." },
    { question: "What does the 50 / 25 / 25 structure mean?", answer: "Confirmed free Proof Pages have no build fee. For paid builds, 50% reserves the production window, 25% follows approval of the visual direction and working primary page, and the final 25% is due before production launch and transfer." },
    { question: "Will my site look like the other builds?", answer: "No. The operating foundation is reused; the typography, palette, composition, image rhythm, voice, and signature interaction are directed for your business." },
    { question: "Can you connect booking, payments, or store tools?", answer: "Yes. Booking, deposits, payments, availability, capacity, and fulfillment logic are scoped into Booking Ready or the Operations Site based on what the workflow needs to enforce." },
    { question: "Do I send passwords through the inquiry form?", answer: "Never. The inquiry collects project context only. Provider access and sensitive credentials use a separate secured authorization step after the project is accepted." },
  ],
  conversion: {
    mode: "quote",
    heading: "Make the first commit.",
    intro: `${proofPageOffer}. Select Proof Page and mention the free offer in your message. ${proofPageTerms} Tell us what your business sells and what you need the page to do.`,
    submitLabel: "Request a build review",
    successMessage: "Your build request is in. We will review fit, materials, and offer availability. Free Proof Page spots are confirmed separately.",
    fallback: "email",
    fields: ["name", "email", "phone", "service", "budget", "message"],
  },
  footerNote: "Built to move from good idea to working business system.",
};
