/* DRAFT — reviewed by King, not by counsel. Have an attorney review before relying on these. */
import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { configToCss } from "@/lib/config";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import "../brand.css";
import { AGREEMENT_PDF } from "@/lib/agreement";

export const metadata: Metadata = {
  title: "Terms of Service — push2Start",
  description:
    "Scope, the 50/25/25 payment schedule, READY_TO_BUILD, revisions, credential handling, ownership, and cancellation for push2Start builds.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  const config = siteConfig;
  return (
    <div className="site" style={configToCss(config)}>
      <a className="skip-link" href="#main">Skip to main content</a>
      <SiteHeader />
      <main id="main" className="legal section">
        <p className="eyebrow">Terms of service</p>
        <h1>What you are buying, and what we owe each other.</h1>
        <p className="legal-lede">
          Plain language, because a term you cannot read is a term you cannot rely on. These terms
          apply to every build unless a signed proposal says otherwise in writing. Last updated{" "}
          <time dateTime="2026-09-20">September 20, 2026</time>.
        </p>
        <p><a href={AGREEMENT_PDF}>Download this build agreement as a PDF</a></p>
        <p>Before paying or proceeding to materials, you must explicitly accept these terms and the agreed project scope in your client workspace. We record the agreement version, account, project, and acceptance time. A general inquiry does not accept a paid build. You may save the PDF before accepting.</p>

        <h2>1. Who these terms are between</h2>
        <p>
          These terms are between {config.business.legalEntity}, trading as {config.business.name}{" "}(&ldquo;we&rdquo;),
          and the business or person who engages us (&ldquo;you&rdquo;).
        </p>

        <h2>2. Scope of each build</h2>
        <p>
          Each tier buys a defined outcome, not an open-ended retainer. What is in scope is what the
          tier below lists and what the accepted proposal names.
        </p>
        <ul>
          {config.services.items.map((service) => (
            <li key={service.slug}>
              <strong>{service.name} — {service.price}.</strong> {service.description} Production
              window: {service.duration}.
            </li>
          ))}
        </ul>
        <p>
          <strong>Explicitly out of scope</strong> unless the proposal says otherwise: logo design and
          full brand identity creation; copywriting beyond editing what you supply; photography and
          videography; paid advertising management; ongoing SEO campaigns; third-party licence,
          subscription, domain and hosting fees; email and inbox migration; native mobile apps;
          accessibility remediation of content you supply after launch; and support or maintenance
          after handoff. Any of these can be quoted separately.
        </p>

        <h2>3. Payment: 50 / 25 / 25</h2>
        <p>What each payment reserves:</p>
        <ul>
          <li><strong>50% to begin.</strong> Reserves your production window on the calendar and the resources allocated to it. It is what takes the slot off the market.</li>
          <li><strong>25% at direction approval.</strong> Due when you approve the visual direction and the working primary page, before the rest of the system is completed.</li>
          <li><strong>25% before launch.</strong> Due before production launch, access transfer, and the operating handoff.</li>
        </ul>
        <p>
          Invoices are due on receipt. Work pauses on an invoice more than seven days overdue, and the
          pause follows the rule in section 5: the window moves, it does not compress.
        </p>

        <h2>4. READY_TO_BUILD</h2>
        <p>
          The production clock starts at READY_TO_BUILD, not at payment. READY_TO_BUILD is reached when
          all three are true: the opening 50% has cleared; the required materials are gathered
          (content, links, policies, approved images, and any provider access the build needs); and one
          named decision-maker is available to respond.
        </p>
        <p>
          We confirm READY_TO_BUILD in writing. Production takes 10–14 calendar days from that
          confirmation. This protects the deadline on both sides — there is no invisible countdown
          running while content or decisions are still missing.
        </p>

        <h2>5. When materials or approvals are late</h2>
        <p>
          The clock pauses. It does not compress. If we are waiting on you for three days, the delivery
          date moves by three days — we do not absorb the delay by cutting the time available to build.
          Where a pause pushes work past a reserved window, the build resumes in the next window we
          have available, and we will tell you when that is before it happens.
        </p>
        <p>
          If a project is unresponsive for more than 30 days, we may treat it as cancelled under
          section 9.
        </p>

        <h2>6. Revisions</h2>
        <p>Revision rounds included, each round being one consolidated set of changes:</p>
        <ul>
          <li><strong>Proof Page</strong> — one round.</li>
          <li><strong>Booking Ready</strong> — two rounds.</li>
          <li><strong>Operations Site</strong> — three rounds.</li>
        </ul>
        <p>
          Beyond the included rounds, and for changes that alter agreed scope or direction after
          approval, work is billed at $95 per hour, estimated and approved by you in writing before it
          starts. Fixing something we got wrong against the approved direction is never a revision
          round and is never billed.
        </p>

        <h2>7. Credentials and provider access</h2>
        <p>
          The public inquiry form collects project context only. Never send passwords or provider keys
          through it, and never in a project message.
        </p>
        <p>
          Provider access — Stripe, Square, Shopify, domain registrars, and similar — moves through a
          separate secured authorization step after the project is accepted. Wherever the provider
          supports it we use delegated access: an invitation to your account under our own login, scoped
          to what the work needs. We do not ask for, want, or store your personal passwords. Access we
          hold is used only to deliver your build, and you can revoke it at any time — including at
          handoff, which is the point at which you should.
        </p>

        <h2>8. Ownership and intellectual property</h2>
        <p>
          You own your content, your brand, and your data at all times. You confirm you have permission to supply the materials and authorize us to use them only to deliver the agreed project. On final payment, ownership of
          the site produced for you — its design, its copy as delivered, and its project-specific code
          — transfers to you, along with the accounts and access needed to run it.
        </p>
        <p>
          The reusable technical foundation stays ours: the underlying structure, components, patterns,
          and tooling that predate your project and that we carry from build to build. You get a
          perpetual, irrevocable licence to use that foundation as part of your site, including to
          modify it and to have someone else maintain it. What you cannot do is resell or redistribute
          the foundation itself as a product. This is the same standard ≠ the same site principle the
          site describes: the machinery is repeatable, the impression is yours alone.
        </p>
        <p>
          Unless you ask us in writing not to, we may show the finished work in our portfolio and name
          you as a client.
        </p>

        <h2>9. Cancellation and refunds</h2>
        <p>
          <strong>The opening 50% deposit is non-refundable once READY_TO_BUILD is confirmed.</strong>{" "}
          It reserves a window we then turn other work away to hold. Before READY_TO_BUILD is confirmed,
          the deposit is refundable in full, less any work already performed at your written request.
        </p>
        <p>
          You may cancel at any time in writing. On cancellation you owe for work completed to that
          point, and we will deliver what has been produced and paid for. Payments already made for
          completed milestones are not refunded. If we cancel for any reason other than your breach of
          these terms, we refund everything paid for work not yet delivered.
        </p>

        <h2>10. Warranty and liability</h2>
        <p>
          We will fix defects in what we built, at no charge, for 30 days after launch. Beyond that, the
          site is delivered as-is. We are not liable for third-party service outages, for changes you or
          another party make after handoff, or for indirect or consequential losses. Our total liability
          for any claim is limited to the amount you paid us for the build in question.
        </p>

        <h2>11. Governing law</h2>
        <p>
          These terms are governed by the laws of the State of Michigan, and the courts of Michigan have
          exclusive jurisdiction over any dispute.
        </p>

        <h2>12. Changes and contact</h2>
        <p>
          We may update these terms for future projects. The version in force for your build is the one
          you explicitly accepted before checkout or materials submission. Later changes require a new agreement; they do not automatically replace your accepted terms. Questions go to{" "}
          <a href={`mailto:${config.business.email}`}>{config.business.email}</a>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
