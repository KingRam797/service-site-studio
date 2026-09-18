import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { configToCss } from "@/lib/config";
import { jsonLdProps, serviceSchema } from "@/lib/structured-data";
import InquiryForm from "./InquiryForm";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import TrackedLink from "./TrackedLink";
import "../brand.css";

export function getService(slug: string) {
  return siteConfig.services.items.find((item) => item.slug === slug);
}

/**
 * One indexable page per tier. Everything on it is composed from `siteConfig`,
 * so a tier page cannot drift from the pricing section it came from.
 */
export default function ServicePage({ slug }: { slug: string }) {
  const config = siteConfig;
  const service = getService(slug);
  if (!service) notFound();

  const schema = serviceSchema(slug);
  const others = config.services.items.filter((item) => item.slug !== slug);

  return (
    <div className="site" style={configToCss(config)}>
      <a className="skip-link" href="#main">Skip to main content</a>
      <SiteHeader />

      <main id="main">
        <section className="tier-hero section">
          <p className="eyebrow">{config.services.eyebrow}</p>
          <h1>{service.name} — business websites in Detroit, Michigan</h1>
          <p className="tier-note">{service.note}</p>
          <p className="tier-lede">{service.description}</p>
          <dl className="fact-strip tier-facts">
            <div><dt>01 / Price</dt><dd>{service.price}</dd></div>
            <div><dt>02 / Production window</dt><dd>{service.duration}</dd></div>
            <div><dt>03 / Build begins</dt><dd>At READY_TO_BUILD</dd></div>
          </dl>
          <div className="actions">
            <TrackedLink
              className="button button-primary"
              href="#start"
              event="start_build_click"
              properties={{ location: "hero", tier: service.name }}
            >
              Start a {service.name} build<span aria-hidden="true">↗</span>
            </TrackedLink>
          </div>
        </section>

        <section className="section tier-detail">
          <h2>How a {service.name} build runs</h2>
          <p className="tier-lede">
            The clock starts at READY_TO_BUILD, not at payment, and the payment rhythm is{" "}
            {config.business.paymentMethods}. What each step means:
          </p>
          <ol className="tier-steps">
            {config.process.map((step) => (
              <li key={step.title}><h3>{step.title}</h3><p>{step.description}</p></li>
            ))}
          </ol>
          <p className="tier-footnote">
            Scope, revision rounds, and the cancellation policy for this tier are set out in the{" "}
            <a href="/terms">terms</a>.
          </p>
        </section>

        <section className="section tier-detail">
          <h2>{config.about.heading}</h2>
          <p className="tier-lede">{config.about.body}</p>
          <p className="tier-footnote">
            {config.business.location}. Other builds:{" "}
            {others.map((other, index) => (
              <span key={other.slug}>
                {index > 0 && " · "}
                <a href={`/${other.slug}`}>{other.name}</a> ({other.price})
              </span>
            ))}
          </p>
        </section>

        <section className="conversion section" id="start">
          <div className="conversion-intro">
            <p className="eyebrow">The first commit</p>
            <h2>{config.conversion.heading}</h2>
            <p>{config.conversion.intro}</p>
            <div className="availability">
              <span />
              <div><strong>{config.business.availability}</strong><small>{config.business.location}</small></div>
            </div>
          </div>
          <InquiryForm config={config} preselectedService={service.name} />
        </section>
      </main>

      <SiteFooter />
      {schema && <script {...jsonLdProps(schema)} />}
    </div>
  );
}
