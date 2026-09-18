"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@vercel/analytics";

/**
 * An ordinary anchor that reports a custom event on click. Navigation is never
 * blocked or delayed — if the analytics call fails the link still works.
 */
export default function TrackedLink({
  event,
  properties,
  children,
  ...anchorProps
}: {
  event: string;
  properties?: Record<string, string>;
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...anchorProps}
      onClick={() => {
        try {
          track(event, properties);
        } catch {
          // Analytics must never break a call to action.
        }
      }}
    >
      {children}
    </a>
  );
}
