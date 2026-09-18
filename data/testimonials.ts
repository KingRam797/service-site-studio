/**
 * Real client testimonials only.
 *
 * Every entry must come from a named client who actually said it. Do not add
 * sample, placeholder, or illustrative entries — the section below renders
 * nothing while this array is empty, which is the correct state until King
 * supplies real quotes. Review structured data is emitted only when this
 * array has at least one entry, so an invented quote would also put a
 * fabricated review into Google's index.
 */
export type Testimonial = {
  quote: string;
  /** Real first name at minimum. */
  name: string;
  business: string;
  projectUrl?: string;
  /** ISO-8601 date, e.g. "2026-04-18". */
  date: string;
};

export const testimonials: Testimonial[] = [];
