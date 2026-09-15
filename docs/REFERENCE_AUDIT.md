# Reference Architecture Audit

Audited from the default branches on September 15, 2026.

| Reference | Strong reusable asset | Specialized rule | Extraction decision |
|---|---|---|---|
| Creative Impressions | immersive proof-led story, quote/consultation forms, durable booking request | 4/5/6-hour windows, time-based deposits, maximum two events/day, overlap protection, 30-minute holds, Stripe webhook, Neon persistence | retain the page rhythm; promote availability, capacity, holds, deposit, persistence, and notification behavior into separate operations modules |
| Like That Cutz | concise offer, strong owner proof, service menu, FAQ/policies, mobile booking action, structured business data | Monday–Saturday 10–6, 15-minute starts, service durations, 15-minute breathing room, Sunday rejection, Square or SMS handoff, private location after confirmation | retain service-to-form consistency and mobile action; model external appointments and contact routing separately |
| Smile Now/Cry Later (`I.C.Melodies`) | centralized rebrandable configuration, cinematic brand direction, pricing/booking interface, explicit non-fabrication rules | studio-hour rates, hourly deposit, 24-hour online close, collaboration agreement, artist-owned Stripe, later Dropwav integration | keep centralized identity and compliance rules; make session deposit and agreement review optional modules |
| Luscious Kreations | scroll-led proof world, configurable sections, capacity-aware order builder | mixed priced/quoted catalog, effort scores, options, 12h/1d/2d/3d eligibility, rush fees, free delivery when large work can only use 3d | retain configuration-led story; promote catalog, effort, fulfillment tiers, and delivery pricing into tested pure logic modules |

## Shared 80%

1. A hero that makes a specific promise.
2. Real work as proof before long explanation.
3. One authoritative service catalog.
4. A visible owner, process, or operating standard.
5. Policies before submission.
6. One primary conversion action.
7. Mobile-first access to that action.
8. Search/social metadata and business structured data.
9. Clear request-versus-confirmation language.
10. Tested handoff, production configuration, and owner control.

## Specialized 20%

- the visual thesis and signature interaction;
- business voice and copy;
- service-specific content and proof;
- scheduling, capacity, deposit, payment, catalog, and fulfillment behavior;
- client-owned provider accounts and secrets.

The specialized layer is not an exception to the system. It is the reason the system has contracts and modules instead of one giant template.
