import type { Metadata } from "next";
import ServicePage, { getService } from "../components/ServicePage";

const SLUG = "booking-ready";
const service = getService(SLUG)!;

export const metadata: Metadata = {
  title: `${service.name} — ${service.price} business website in Detroit | push2Start`,
  description: `${service.description} Built in ${service.duration} for Detroit and Michigan businesses.`,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    title: `${service.name} — ${service.price} business website in Detroit`,
    description: service.description,
    type: "website",
    url: `/${SLUG}`,
  },
};

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
