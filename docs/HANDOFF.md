# push2Start — Production handoff

## Repository

- Repository: `KingRam797/service-site-studio`
- Working branch: `codex/push2start-finish`
- Production URL: `https://service-site-studio-five.vercel.app`
- Production commit: `58ef839`

## Implemented

- Push2Start public identity, three-offer presentation, 50/25/25 production model, verified contact email, and Instagram.
- Interactive WebGL push-token insignia backed by a validated glTF 2.0 asset and static poster fallback.
- Visual selected-work cards for Creative Impressions, Like That Cutz, Windows To The Sol, and SNCL.
- Clerk-protected client workspace with project progress, materials, build updates, provider-connection status, and empty/setup states.
- Neon schema for projects, payment milestones, materials, provider connections, and project updates.
- Stripe Checkout for authenticated due milestones and a signed webhook that marks payment complete and releases the next milestone.
- Secure provider-connection requests that store status only; passwords and secret keys are never collected by the site.

## Production activation

1. Add Clerk, Neon, and Stripe through the Vercel Marketplace.
2. Apply `db/schema.sql` to the Neon database.
3. Add the Stripe webhook endpoint `/api/webhooks/stripe` and save its signing secret.
4. Create each accepted client project and its three payment milestones in Neon, then associate the Clerk user ID or client email.
5. Add Resend or `INQUIRY_WEBHOOK_URL` for direct inquiry delivery.

## Known blocker

- `https://like-that-cutz.vercel.app` currently returns 404. Its real brand artwork is shown, but the proof card intentionally remains non-clickable until the public deployment is restored.
- The authenticated/payment experience is deployed in setup mode until the Clerk, Neon, Stripe, and inquiry-delivery environment values are connected.
