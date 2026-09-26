"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const PIXEL_ID = "2296378871117878";
const CHOICE_KEY = "push2start-meta-consent";
const SETTINGS_EVENT = "push2start:privacy-settings";
const CHOICE_EVENT = "push2start:meta-consent-change";
const SERVICE_PATHS = new Set(["/proof-page", "/booking-ready", "/operations-site"]);

type Choice = "accepted" | "declined" | null;
let ephemeralChoice: Choice = null;

function readChoice(): Choice {
  try {
    const value = window.localStorage.getItem(CHOICE_KEY);
    if (value === "accepted" || value === "declined") return value;
  } catch {
    // Storage may be blocked; keep the current page's choice in memory.
  }
  return ephemeralChoice;
}

function subscribeChoice(callback: () => void) {
  window.addEventListener(CHOICE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHOICE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function noSubscription() { return () => {}; }

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function isPublicPage(path: string) {
  return !path.startsWith("/client") && !path.startsWith("/sign-in");
}

export function trackMetaLead() {
  try {
    if (readChoice() === "accepted" && isPublicPage(window.location.pathname)) {
      window.fbq?.("track", "Lead");
    }
  } catch {
    // Tracking cannot interfere with a submitted inquiry.
  }
}

export function MetaPrivacyControl() {
  return (
    <button type="button" className="privacy-choice-link" onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}>
      Privacy choices
    </button>
  );
}

export default function MetaPixel() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribeChoice, readChoice, () => null);
  const hydrated = useSyncExternalStore(noSubscription, () => true, () => false);
  const [showChoices, setShowChoices] = useState(false);
  const [ready, setReady] = useState(false);
  const lastPage = useRef<string | null>(null);
  const publicPage = isPublicPage(pathname);

  useEffect(() => {
    const open = () => setShowChoices(true);
    window.addEventListener(SETTINGS_EVENT, open);
    return () => window.removeEventListener(SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    if (choice !== "accepted" || !publicPage) {
      window.fbq?.("consent", "revoke");
      return;
    }
    if (!ready || lastPage.current === pathname) return;
    window.fbq?.("consent", "grant");
    window.fbq?.("track", "PageView");
    if (SERVICE_PATHS.has(pathname)) window.fbq?.("track", "ViewContent");
    lastPage.current = pathname;
  }, [choice, pathname, publicPage, ready]);

  function choose(next: Exclude<Choice, null>) {
    ephemeralChoice = next;
    try {
      window.localStorage.setItem(CHOICE_KEY, next);
    } catch {
      // The choice still applies for the current page.
    }
    if (next === "declined") {
      window.fbq?.("consent", "revoke");
      lastPage.current = null;
    }
    window.dispatchEvent(new Event(CHOICE_EVENT));
    setShowChoices(false);
  }

  return (
    <>
      {choice === "accepted" && publicPage && (
        <Script id="meta-pixel" strategy="afterInteractive" onReady={() => setReady(true)}>
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');`}
        </Script>
      )}
      {hydrated && (showChoices || choice === null) && publicPage && (
        <div className="meta-consent" role="region" aria-label="Advertising privacy choices">
          <p>May we use Meta Pixel to measure visits and inquiries from our ads? Meta may use cookies for ad measurement. <a href="/privacy">How it works</a></p>
          <div className="meta-consent-actions">
            <button type="button" onClick={() => choose("declined")}>Decline</button>
            <button type="button" onClick={() => choose("accepted")}>Allow</button>
          </div>
        </div>
      )}
    </>
  );
}
