import { siteConfig } from "@/config/site.config";
import { configToCss, phoneHref } from "@/lib/config";
import Image from "next/image";
import InquiryForm from "./components/InquiryForm";

function ProofVisual({ image, title, index }: { image?: string; title: string; index: number }) {
  return (
    <div className={`proof-visual proof-visual-${(index % 3) + 1}`}>
      {image ? <Image src={image} alt={title} fill sizes="(max-width: 850px) 100vw, 40vw" /> : <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>}
    </div>
  );
}

export default function Home() {
  const config = siteConfig;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": config.seo.businessType,
    name: config.business.name,
    description: config.business.shortDescription,
    areaServed: config.business.location,
    telephone: config.business.phone,
    email: config.business.email,
    makesOffer: config.services.items.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.name, description: service.description },
    })),
  };

  return (
    <div
      className="site"
      style={configToCss(config)}
      data-composition={config.theme.composition}
      data-signature={config.theme.signature}
    >
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="header" id="top">
        <a className="wordmark" href="#top" aria-label={`${config.business.name} home`}>
          <span>{config.business.name.charAt(0)}</span>
          {config.business.name}
        </a>
        <nav aria-label="Primary navigation">
          <a href="#proof">Proof</a>
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-action" href="#start">Start a project</a>
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
          <div className="hero-proof" aria-label="Service site operating system">
            <div className="hero-sheet hero-sheet-back"><span>POLICIES</span><strong>Clear before contact</strong></div>
            <div className="hero-sheet hero-sheet-mid"><span>PROOF</span><strong>Real work leads</strong></div>
            <div className="hero-sheet hero-sheet-front"><span>CONVERSION</span><strong>One next action</strong><i /></div>
          </div>
          <dl className="fact-strip">
            {config.hero.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
          </dl>
        </section>

        <section className="proof section" id="proof">
          <header className="section-heading">
            <p className="eyebrow">{config.proof.eyebrow}</p>
            <h2>{config.proof.heading}</h2>
            <p>{config.proof.intro}</p>
          </header>
          <div className="proof-grid">
            {config.proof.items.map((item, index) => (
              <article className="proof-card" key={item.title}>
                <ProofVisual image={item.image} title={item.title} index={index} />
                <div><p>{item.category}</p><h3>{item.title}</h3><span>{item.description}</span>{item.result && <strong>{item.result}</strong>}</div>
              </article>
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
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{service.name}</h3><p>{service.description}</p></div>
                <div className="service-meta">{service.price && <strong>{service.price}</strong>}{service.duration && <span>{service.duration}</span>}{service.note && <small>{service.note}</small>}</div>
                <a href="#start" aria-label={`Ask about ${service.name}`}>↘</a>
              </article>
            ))}
          </div>
        </section>

        <section className="process section" id="process">
          <header><p className="eyebrow">From intake to live</p><h2>Four decisions. One controlled launch.</h2></header>
          <ol>
            {config.process.map((step, index) => <li key={step.title}><span>{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}
          </ol>
        </section>

        <section className="about section" id="about">
          <div className="about-mark" aria-hidden="true"><span>80%</span><small>shared operating foundation</small><i>20%</i><small>client-specific direction</small></div>
          <div className="about-copy"><p className="eyebrow">{config.about.eyebrow}</p><h2>{config.about.heading}</h2><p>{config.about.body}</p></div>
        </section>

        <section className="faq section" id="faq">
          <header><p className="eyebrow">Before we begin</p><h2>Useful answers before the first call.</h2></header>
          <div>
            {config.faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}
          </div>
        </section>

        <section className="conversion section" id="start">
          <div className="conversion-intro"><p className="eyebrow">The next move</p><h2>{config.conversion.heading}</h2><p>{config.conversion.intro}</p><div className="contact-lines"><a href={phoneHref(config.business.phone)}>{config.business.phone}</a><a href={`mailto:${config.business.email}`}>{config.business.email}</a></div></div>
          <InquiryForm config={config} />
        </section>
      </main>

      <footer>
        <a className="footer-name" href="#top">{config.business.name}</a>
        <p>{config.footerNote}</p>
        <div>{config.business.socials?.map((social) => <a href={social.href} key={social.label} target="_blank" rel="noreferrer">{social.label}</a>)}</div>
      </footer>
      <a className="mobile-action" href="#start">{config.conversion.submitLabel}<span>→</span></a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  );
}
