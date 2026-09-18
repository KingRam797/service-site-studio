import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { hasDialablePhone, phoneHref } from "@/lib/config";
import TrackedLink from "./TrackedLink";

export function BranchMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "branch-mark branch-mark-compact" : "branch-mark"} aria-hidden="true">
      <Image src="/brand/push2start-symbol.jpeg" alt="" width={96} height={96} />
    </span>
  );
}

export function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <span className={footer ? "brand brand-footer" : "brand"}>
      <BranchMark compact={!footer} />
      <span><strong>push</strong><b>2</b><strong>Start</strong></span>
    </span>
  );
}

/**
 * `home` renders the in-page anchors used on the landing page. Every other
 * page links back to those same sections on `/`.
 */
export function SiteHeader({ home = false }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  return (
    <header className="header" id="top">
      <a className="wordmark" href={home ? "#top" : "/"} aria-label="push2Start home"><Wordmark /></a>
      <nav aria-label="Primary navigation">
        <a href={`${prefix}#proof`}>Work</a>
        <a href={`${prefix}#services`}>Builds</a>
        <a href={`${prefix}#process`}>Process</a>
        <a href={`${prefix}#faq`}>Questions</a>
        <a href="/client">Client login</a>
      </nav>
      <TrackedLink
        className="header-action"
        href={`${prefix}#start`}
        event="start_build_click"
        properties={{ location: "header" }}
      >
        Start a build <span>↗</span>
      </TrackedLink>
    </header>
  );
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  const config = siteConfig;
  return (
    <footer>
      <a className="footer-name" href={home ? "#top" : "/"}><Wordmark footer /></a>
      <div className="footer-copy">
        <p>{config.footerNote}</p>
        <p className="footer-legal">
          © {new Date().getFullYear()} TODO_FROM_KING · <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a>
        </p>
      </div>
      <div className="footer-links">
        {config.business.email && <a href={`mailto:${config.business.email}`}>{config.business.email}</a>}
        {hasDialablePhone(config.business.phone) && <a href={phoneHref(config.business.phone)}>{config.business.phone}</a>}
        <a href="/client">Client login</a>
        {config.business.socials?.map((social) => (
          <a href={social.href} key={social.label} target="_blank" rel="noreferrer">{social.label}</a>
        ))}
        <a href={home ? "#top" : "/"} className="back-top">{home ? "Back to top ↑" : "Home ↑"}</a>
      </div>
    </footer>
  );
}
