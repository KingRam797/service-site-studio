# Operations Module Matrix

Choose the smallest module that matches how the business actually fulfills work.

| Module | Use when | Required configuration | Proven reference |
|---|---|---|---|
| Contact routing | The owner confirms everything manually | owner contact, required fields, email/SMS fallback | Like That Cutz request handoff |
| External appointments | Availability already lives in Square or another booking provider | public booking URL, hours, service mapping, confirmation language | Like That Cutz + Square |
| Internal appointments | The site must calculate valid slots | hours, duration, buffers, closures, holds, capacity, persistence | Creative Impressions booking logic |
| Capacity booking | Work consumes overlapping time or has a daily limit | date/time windows, duration, overlap, daily capacity, hold expiration | Creative Impressions: two events/day |
| Session deposit | Time blocks require a reservation deposit | rate, block length, deposit formula, reschedule/cancellation policy | Smile Now/Cry Later studio model |
| Catalog order | Customers combine priced and quoted items | catalog, units, options, effort/capacity, price rules | Luscious Kreations order builder |
| Fulfillment tiers | Lead time and order size change availability or fees | effort score, tier eligibility, rush fee, delivery rule | Luscious Kreations 12h/1d/2d/3d model |
| Secure payment | A confirmed amount can be paid online | provider ownership, success/cancel routes, webhook, idempotency | Creative Impressions Stripe deposit |
| Owner notification | A request must reach the owner reliably | recipient, sending domain, fallback route | Resend/webhook adapter |

## Selection rule

Do not build an internal scheduler because a booking link looks less custom. Do not use a booking link when the client's capacity logic cannot be represented safely by the provider. Complexity must be earned by the operating requirement.

## Promotion rule

A client-specific workflow becomes a reusable module only after:

1. it has a stable business contract;
2. edge cases are documented;
3. pure decision logic is separated from UI and provider code;
4. acceptance tests cover boundaries;
5. secrets and owner data remain outside the module;
6. at least two builds could use it without copying client identity.
