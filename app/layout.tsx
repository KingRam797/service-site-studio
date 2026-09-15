import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site.config";
import "./globals.css";

const canonical = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  metadataBase: canonical ? new URL(canonical) : undefined,
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
