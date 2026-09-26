# push2Start

The public Push2Start site and its client delivery system. The application combines the three public offers, selected work, project inquiry, authenticated client workspaces, secure provider-connection requests, and Stripe milestone checkout.

## Production services

- **Clerk** protects `/client` and identifies each client.
- **Neon Postgres** stores projects, materials, provider status, updates, and the 50/25/25 payment schedule. Apply `db/schema.sql` once to the production database.
- **Stripe Checkout** collects only milestones marked `due`; the signed webhook at `/api/webhooks/stripe` marks the milestone paid and releases the next one.
- **Resend or a webhook** delivers public build inquiries.

The app builds safely before these services are connected. Without production keys, client access shows a setup state and payments remain unavailable.

## The 80/20 architecture

The shared 80% is stable:

- semantic, mobile-first page structure;
- positioning-led hero and persistent conversion action;
- real-work proof gallery;
- services as a single source for page copy, forms, and structured data;
- process, founder credibility, policies, and FAQs;
- quote, appointment, or order conversion modes;
- direct delivery through a webhook or Resend, with email/SMS fallback;
- metadata, accessibility, validation, testing, and deployment checks.

The client-specific 20% remains deliberately variable:

- visual thesis, typography, palette, composition, and one signature device;
- services, pricing, proof, voice, policies, and imagery;
- appointment, capacity, deposit, catalog, or fulfillment rules;
- external systems and owner handoff.

## Start a client build

1. Copy `docs/CLIENT_INTAKE.md` and complete it with the owner.
2. Replace the demo content in `config/site.config.ts`.
3. Select a composition and signature based on the client's actual craft.
4. Add approved assets under `public/` and reference them in the config.
5. Select the necessary operations module from `docs/MODULE_MATRIX.md`.
6. Configure inquiry delivery in `.env.local`.
7. Run all checks, test on a physical phone, and use `docs/DELIVERY_CHECKLIST.md`.

```bash
npm install
npm run validate
npm test
npm run lint
npm run build
npm run dev
```

## Inquiry delivery

The site tries direct delivery first, then opens the configured email or SMS fallback when delivery is unavailable.

- `INQUIRY_WEBHOOK_URL`: sends validated JSON to the client's automation endpoint.
- `RESEND_API_KEY`: emails the owner from `inquiries@push2startstudio.com`, which Resend accepts only while the domain is verified (DNS records in `docs/INQUIRY_EMAIL.md`). `INQUIRY_FROM_EMAIL` overrides the sender.
- No delivery secrets belong in source control.

## Key files

- `config/site.config.ts` — the client's content, theme, services, proof, and conversion model.
- `config/types.ts` — the contract all client configurations follow.
- `app/page.tsx` — shared presentation and structured business data.
- `app/components/InquiryForm.tsx` — config-driven conversion form.
- `app/api/inquiries/route.ts` — validated delivery adapter.
- `docs/CLIENT_INTAKE.md` — the input required before development.
- `docs/MODULE_MATRIX.md` — which specialized workflow to use.
- `docs/OFFER.md` — the sellable service packages and scope boundaries.
- `docs/DELIVERY_CHECKLIST.md` — definition of delivered.
- `docs/HANDOFF.md` — exact continuation state.

## Ground rules

- A configuration change may reuse architecture; it may not substitute for design direction.
- Use real client work. Never invent reviews, awards, performance claims, credentials, or results.
- Do not accept payment until the promised integration and owner responsibilities are explicit.
- Treat deposits, policies, availability, taxes, and legal terms as client-approved business rules.
- Test the customer's complete action, not just the homepage.
