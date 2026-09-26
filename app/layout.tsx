import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/config/site.config";
import { jsonLdProps, professionalServiceSchema } from "@/lib/structured-data";
import { siteUrl } from "@/lib/site-url";
import MetaPixel from "./components/MetaPixel";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const content = (
    <html lang="en">
      <body>
        {children}
        <script {...jsonLdProps(professionalServiceSchema())} />
        <Analytics />
        <SpeedInsights />
        <MetaPixel />
      </body>
    </html>
  );

  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
