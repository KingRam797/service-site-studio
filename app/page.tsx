import { siteConfig } from "@/config/site.config";
import { configToCss, hasDialablePhone, phoneHref } from "@/lib/config";
import Image from "next/image";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import InquiryForm from "./components/InquiryForm";
import Testimonials from "./components/Testimonials";
import TrackedLink from "./components/TrackedLink";
import { faqPageSchema, jsonLdProps } from "@/lib/structured-data";
import PushScrollWorld from "./components/PushScrollWorld";
import CinematicBackdrop from "./components/CinematicBackdrop";
import "./brand.css";
import { cinematicAssets } from "@/config/cinematic-assets";

function ProofCard({ item, index }: { item: (typeof siteConfig.proof.items)[number]; index: number }) {
  const content = (
    <>
      <div className="proof-browser-bar" aria-hidden="true"><i /><i /><i /><span>{item.href ? new URL(item.href).hostname : item.title}</span><b>↗</b></div>
      <div className="project-visual">
        {item.image ? <Image src={item.image} alt={item.imageAlt ?? `${item.title} website preview`} fill sizes="(max-width: 700px) 100vw, 50vw" /> : <span>{item.title.slice(0, 2)}</span>}
        <div className="project-code"><span>P2S/{String(index + 1).padStart(2, "0")}</span><i /> <i /> <i /></div>
      </div>
      <div className="project-copy">
        <p>{item.category}</p><h3>{item.title}</h3><span>{item.description}</span>{item.outcome && <span className="project-outcome">{item.outcome}</span>}{item.result && <strong>{item.result}<b>{item.href ? "↗" : "•"}</b></strong>}
      </div>
    </>
  );
  return item.href ? <a className="proof-card" href={item.href} target="_blank" rel="noreferrer">{content}</a> : <article className="proof-card proof-card-private">{content}</article>;
}

export default function Home() {
  const config = siteConfig;
  return (
    <div className="site" style={configToCss(config)}>
      <a className="skip-link" href="#main">Skip to main content</a>
      <SiteHeader home />

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{config.hero.eyebrow}</p>
            <h1 id="hero-title">{config.hero.headline}<em>{config.hero.emphasizedLine}</em></h1>
            <p className="hero-body">{config.hero.body}</p>
            <div className="actions">
              {config.hero.actions.map((action) => (
                <TrackedLink
                  className={`button button-${action.kind ?? "secondary"}`}
                  href={action.href}
                  key={action.label}
                  event={action.href === "#services" ? "compare_builds_click" : "start_build_click"}
                  properties={action.href === "#services" ? undefined : { location: "hero" }}
                >
                  {action.label}<span aria-hidden="true">↗</span>
                </TrackedLink>
              ))}
            </div>
          </div>
          <PushScrollWorld />
          <TrackedLink className="brand-terminal" href="#start" aria-label="Start your Push2Start build" event="start_build_click" properties={{ location: "hero_terminal" }}>
            <code aria-hidden="true"><span>$</span> <b>git push</b> origin main<span className="terminal-cursor"> ▌</span></code>
            <span className="terminal-caption" aria-hidden="true">ideas move here <b>→</b></span>
          </TrackedLink>
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

        <Testimonials />

        <section className="services section cinematic-section signal-stage" id="services">
          <CinematicBackdrop {...cinematicAssets.packages} className="packages-film" />
          <div className="section-heading services-heading">
            <p className="eyebrow">{config.services.eyebrow}</p>
            <h2>{config.services.heading}</h2>
            <p>{config.services.intro}</p>
          </div>
          <div className="service-list">
            {config.services.items.map((service, index) => (
              <article className="service-row" key={service.name}>
                <span>0{index + 1}</span>
                <div className="service-copy"><h3>{service.name}</h3><strong>{service.note}</strong><span>{service.description}</span></div>
                <div className="service-meta">{service.price && <strong>{service.price}</strong>}{service.duration && <span>{service.duration}</span>}</div>
                <TrackedLink href={`/${service.slug}`} aria-label={`Choose ${service.name}`} event="tier_select" properties={{ tier: service.name }}>Choose <b>↘</b></TrackedLink>
              </article>
            ))}
          </div>
        </section>

        <section className="process section cinematic-section signal-stage" id="process">
          <CinematicBackdrop {...cinematicAssets.process} className="process-film" />
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

        <section className="security section cinematic-section signal-stage">
          <CinematicBackdrop {...cinematicAssets.security} className="security-film" />
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

        <section className="conversion section cinematic-section signal-stage" id="start">
          <CinematicBackdrop {...cinematicAssets.launch} className="launch-film" />
          <div className="conversion-intro">
            <p className="eyebrow">The first commit</p>
            <h2>{config.conversion.heading}</h2>
            <p>{config.conversion.intro}</p>
            <div className="availability"><span /><div><strong>{config.business.availability}</strong><small>{config.business.location}</small></div></div>
            <ul className="contact-paths">
              {config.business.email && (
                <li><span>Email</span><a href={`mailto:${config.business.email}`}>{config.business.email}</a></li>
              )}
              <li>
                <span>Phone / text</span>
                {hasDialablePhone(config.business.phone)
                  ? <a href={phoneHref(config.business.phone)}>{config.business.phone}</a>
                  : <em>{config.business.phone}</em>}
              </li>
            </ul>
          </div>
          <InquiryForm config={config} />
        </section>
      </main>

      <SiteFooter home />
      <TrackedLink className="mobile-action" href="#start" event="start_build_click" properties={{ location: "footer" }}>{config.conversion.submitLabel}<span>→</span></TrackedLink>
      <script {...jsonLdProps(faqPageSchema())} />
    </div>
  );
}
