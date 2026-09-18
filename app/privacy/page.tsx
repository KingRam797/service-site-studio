/* DRAFT — reviewed by King, not by counsel. Have an attorney review before relying on these. */
import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { configToCss } from "@/lib/config";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import "../brand.css";

export const metadata: Metadata = {
  title: "Privacy Policy — push2Start",
  description:
    "What the push2Start inquiry form collects, where it is sent and stored, how long it is kept, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  const config = siteConfig;
  return (
    <div className="site" style={configToCss(config)}>
      <a className="skip-link" href="#main">Skip to main content</a>
      <SiteHeader />
      <main id="main" className="legal section">
        <p className="eyebrow">Privacy policy</p>
        <h1>What we collect, and what we do not.</h1>
        <p className="legal-lede">
          Short version: we collect what you type into the inquiry form, we use it to answer you, and we
          do not sell it to anyone. Last updated{" "}
          <time dateTime="2026-09-18">September 18, 2026</time>.
        </p>

        <h2>1. Who is responsible</h2>
        <p>
          TODO_FROM_KING, trading as {config.business.name}, based in Detroit, Michigan, is responsible
          for the information described here. Contact:{" "}
          <a href={`mailto:${config.business.email}`}>{config.business.email}</a>.
        </p>

        <h2>2. What the inquiry form collects</h2>
        <p>The form asks for, and only stores, what you enter into it:</p>
        <ul>
          <li>Your name</li>
          <li>Your email address</li>
          <li>Your phone number, if you give one</li>
          <li>Which build you are asking about</li>
          <li>Your working budget, if you give one</li>
          <li>The message you write describing the work</li>
        </ul>
        <p>
          The form also carries a hidden anti-spam field and the time the page was opened. Both are used
          only to tell a person from a bot, and neither identifies you.
        </p>
        <p>
          <strong>Do not enter passwords or provider keys in the form.</strong> The inquiry is for
          project context. Provider access moves through a separate secured step after a project is
          accepted.
        </p>

        <h2>3. Where it goes and where it is stored</h2>
        <p>
          A submission is sent to our business email so we can reply, and is stored in our project
          database, hosted by Neon in the United States. The site itself is hosted by Vercel, which
          processes the request in order to serve the page. Email delivery is handled by Resend. These
          providers process the information on our instructions in order to run the service; they do not
          receive it for their own marketing.
        </p>
        <p>We do not sell your information, and we do not share it with anyone else.</p>

        <h2>4. How long we keep it</h2>
        <p>
          Inquiries that do not become projects are deleted within 24 months. If your inquiry becomes a
          project, the records are kept for the life of the project and for seven years afterwards,
          which is what tax and contract records require. Ask us to delete sooner and we will, except
          where we are legally required to keep something.
        </p>

        <h2>5. Analytics</h2>
        <p>
          We use Vercel Web Analytics and Speed Insights to count page views and measure how fast pages
          load. These are cookieless: they set no cookies, they do not track you across other websites,
          and they do not build a profile of you. The data is aggregated and does not identify
          individual visitors. This is why the site shows no cookie consent banner — there is nothing to
          consent to.
        </p>

        <h2>6. Client workspace accounts</h2>
        <p>
          If you become a client and sign in to the workspace, authentication is handled by Clerk, which
          holds your email address and login credentials. Payments are handled by Stripe. We never see
          or store your full card details. Both providers keep their own privacy policies covering the
          information they hold.
        </p>

        <h2>7. Your choices</h2>
        <p>
          You can ask us at any time to tell you what we hold about you, to correct it, or to delete it.
          Email <a href={`mailto:${config.business.email}`}>{config.business.email}</a> with
          &ldquo;data request&rdquo; in the subject line. We answer within 30 days. You do not need to
          give a reason, and asking costs nothing.
        </p>

        <h2>8. Children</h2>
        <p>
          This is a service for businesses. We do not knowingly collect information from anyone under
          13. If you believe a child has sent us information, email us and we will delete it.
        </p>

        <h2>9. Changes</h2>
        <p>
          If this policy changes we update the date at the top. Material changes affecting information
          we already hold will be emailed to affected clients rather than quietly published.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
