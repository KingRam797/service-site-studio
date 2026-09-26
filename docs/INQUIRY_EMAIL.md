# Inquiry email

Build requests are emailed to the owner through Resend (`lib/inquiry-delivery.ts`).

- **From:** `push2Start <inquiries@push2startstudio.com>`. `INQUIRY_FROM_EMAIL` overrides it.
- **To:** `pusher@push2startstudio.com`, the public address in `config/site.config.ts`. Leave `INQUIRY_TO_EMAIL` unset to keep it.
- **Reply-To:** the visitor, so a reply goes straight to the lead.

Resend refuses every send (HTTP 403) until `push2startstudio.com` shows **Verified** under Domains. Resend's shared `onboarding@resend.dev` sender is no workaround: it only delivers to the Resend account's own address, never to pusher@.

## DNS records

The domain's nameservers are `launch1.spaceship.net` and `launch2.spaceship.net`, so these records belong in Spaceship. Vercel lists the domain but does not serve its DNS; records added there have no effect.

Enter only the host part (`send`, not `send.push2startstudio.com`).

| Type | Host | Value | Priority |
|---|---|---|---|
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | |
| TXT | `resend._domainkey` | DKIM key below | |
| CNAME | `rsend` | `send.forge.rmta.net` | |

DKIM value, pasted as one line without quotes:

```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDP8PyWQb+qJ/ytJgWjeyPmviCKhB9+fJ0X/KPNax2suHaSHPhn9OgDDt9BZvG1q+y6Qtw86ETU5043MhhSv1PUylOryrAhiVUVOpnLG3chxCq5DZsqBrGWVykOsPIoi3cMnRKnR/LdK5aAFNtih+1wBjSqcII3i1Tp2aBquc0B3QIDAQAB
```

These are the values Resend issued for this domain on 2026-09-18. If its Domains page ever shows different ones, Resend is right.

The records sit only on `send`, `rsend` and `resend._domainkey`. Leave the root (`@`) MX records that receive pusher@ mail, and the records pointing the site at Vercel, unchanged.

## Confirm

1. Resend → Domains → push2startstudio.com → Verify. Every record should turn Verified.
2. On the live site, `GET /api/inquiries?test=send` sends one test email and returns Resend's verbatim response; `testSend.ok` should be `true`.
