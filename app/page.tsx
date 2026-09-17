import { siteConfig } from "@/config/site.config";
import { configToCss } from "@/lib/config";
import Image from "next/image";
import InquiryForm from "./components/InquiryForm";
import PushTokenExperience from "./components/PushTokenExperience";

function BranchMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "branch-mark branch-mark-compact" : "branch-mark"} aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img">
        <path d="M13 10v19c0 6 4 9 10 9h5c5 0 8-3 8-8V18" />
        <path d="m29 24 7-7 7 7" />
        <circle cx="13" cy="9" r="4" />
      </svg>
    </span>
  );
}

function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <span className={footer ? "brand brand-footer" : "brand"}>
      <BranchMark compact={!footer} />
      <span><strong>push</strong><b>2</b><strong>Start</strong></span>
    </span>
  );
}

function ProofCard({ item, index }: { item: (typeof siteConfig.proof.items)[number]; index: number }) {
  const content = (
    <>
      <div className="project-visual">
        {item.image ? <Image src={item.image} alt={`${item.title} website preview`} fill sizes="(max-width: 700px) 100vw, 50vw" /> : <span>{item.title.slice(0, 2)}</span>}
        <div className="project-code"><span>P2S/{String(index + 1).padStart(2, "0")}</span><i /> <i /> <i /></div>
      </div>
      <div className="project-copy">
        <p>{item.category}</p><h3>{item.title}</h3><span>{item.description}</span>{item.result && <strong>{item.result}<b>{item.href ? "↗" : "•"}</b></strong>}
      </div>
    </>
  );
  return item.href ? <a className="proof-card" href={item.href} target="_blank" rel="noreferrer" aria-label={`View ${item.title}`}>{content}</a> : <article className="proof-card proof-card-private">{content}</article>;
}

export default function Home() {
  const config = siteConfig;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": config.seo.businessType,
    name: config.business.name,
    description: config.business.shortDescription,
    areaServed: config.business.location,
    makesOffer: config.services.items.map((service) => ({
      "@type": "Offer",
      price: service.price?.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
      itemOffered: { "@type": "Service", name: service.name, description: service.description },
    })),
  };

  return (
    <div className="site" style={configToCss(config)}>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="header" id="top">
        <a className="wordmark" href="#top" aria-label="push2Start home"><Wordmark /></a>
        <nav aria-label="Primary navigation">
          <a href="#proof">Work</a>
          <a href="#services">Builds</a>
          <a href="#process">Process</a>
          <a href="#faq">Questions</a>
          <a href="/client">Client login</a>
        </nav>
        <a className="header-action" href="#start">Start a build <span>↗</span></a>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{config.hero.eyebrow}</p>
            <h1 id="hero-title">{config.hero.headline}<em>{config.hero.emphasizedLine}</em></h1>
            <p className="hero-body">{config.hero.body}</p>
            <div className="actions">
              {config.hero.actions.map((action) => (
                <a className={`button button-${action.kind ?? "secondary"}`} href={action.href} key={action.label}>{action.label}<span aria-hidden="true">↗</span></a>
              ))}
            </div>
          </div>
          <PushTokenExperience />
          <dl className="fact-strip">
            {config.hero.facts.map((fact, index) => <div key={fact.label}><dt>0{index + 1} / {fact.label}</dt><dd>{fact.value}</dd></div>)}
          </dl>
        </section>

        <section className="manifesto">
          <p>Not a page count.</p>
          <p>Not a borrowed theme.</p>
          <strong>A working first impression.</strong>
        </section>

        <section className="proof section" id="proof">
          <header className="section-heading">
            <p className="eyebrow">{config.proof.eyebrow}</p>
            <h2>{config.proof.heading}</h2>
            <p>{config.proof.intro}</p>
          </header>
          <div className="proof-grid">
            {config.proof.items.map((item, index) => (
              <ProofCard item={item} index={index} key={item.title} />
            ))}
          </div>
        </section>

        <section className="services section" id="services">
          <div className="section-heading services-heading">
            <p className="eyebrow">{config.services.eyebrow}</p>
            <h2>{config.services.heading}</h2>
            <p>{config.services.intro}</p>
          </div>
          <div className="service-list">
            {config.services.items.map((service, index) => (
              <article className="service-row" key={service.name}>
                <span>0{index + 1}</span>
                <div className="service-copy"><p>{index === 0 ? "Proof Page" : index === 1 ? "Booking Ready" : "Operations Site"}</p><h3>{service.name}</h3><strong>{service.note}</strong><span>{service.description}</span></div>
                <div className="service-meta">{service.price && <strong>{service.price}</strong>}{service.duration && <span>{service.duration}</span>}</div>
                <a href="#start" aria-label={`Ask about ${service.name}`}>Choose <b>↘</b></a>
              </article>
            ))}
          </div>
        </section>

        <section className="process section" id="process">
          <header>
            <p className="eyebrow">Production protocol</p>
            <h2>The clock starts when the work can.</h2>
            <p>READY_TO_BUILD protects the deadline on both sides. No invisible countdown while content, access, or decisions are still missing.</p>
          </header>
          <ol>
            {config.process.map((step, index) => <li className={index === 2 ? "ready-step" : ""} key={step.title}><span>{index === 2 ? "●" : `0${index + 1}`}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}
          </ol>
        </section>

        <section className="about section" id="about">
          <div className="system-card" aria-label="push2Start reusable foundation and custom identity model">
            <div><span>REPEATABLE</span><strong>the machinery</strong><p>Responsive structure<br />Access and forms<br />Launch verification<br />Owner handoff</p></div>
            <div><span>ORIGINAL</span><strong>the impression</strong><p>Brand direction<br />Voice and visuals<br />Customer journey<br />Signature interaction</p></div>
            <code>same standard ≠ same site</code>
          </div>
          <div className="about-copy"><p className="eyebrow">{config.about.eyebrow}</p><h2>{config.about.heading}</h2><p>{config.about.body}</p></div>
        </section>

        <section className="security section">
          <div>
            <p className="eyebrow">Access without exposure</p>
            <h2>Your passwords do not belong in a project message.</h2>
          </div>
          <div className="security-copy">
            <p>The public inquiry collects only enough context to scope the work. Stripe, Square, Shopify, domains, and similar provider access move through a separate secured authorization step after acceptance.</p>
            <div className="security-rule"><span>PUBLIC</span><strong>project context</strong><i>→</i><span>SECURED</span><strong>provider authorization</strong></div>
          </div>
        </section>

        <section className="faq section" id="faq">
          <header><p className="eyebrow">Before the first commit</p><h2>Clear answers make faster builds.</h2></header>
          <div>
            {config.faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}
          </div>
        </section>

        <section className="conversion section" id="start">
          <div className="conversion-intro">
            <p className="eyebrow">The first commit</p>
            <h2>{config.conversion.heading}</h2>
            <p>{config.conversion.intro}</p>
            <div className="availability"><span /><div><strong>{config.business.availability}</strong><small>{config.business.location}</small></div></div>
          </div>
          <InquiryForm config={config} />
        </section>
      </main>

      <footer>
        <a className="footer-name" href="#top"><Wordmark footer /></a>
        <p>{config.footerNote}</p>
        <div className="footer-links"><a href="/client">Client login</a>{config.business.socials?.map((social) => <a href={social.href} key={social.label} target="_blank" rel="noreferrer">{social.label}</a>)}<a href="#top" className="back-top">Back to top ↑</a></div>
      </footer>
      <a className="mobile-action" href="#start">{config.conversion.submitLabel}<span>→</span></a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
