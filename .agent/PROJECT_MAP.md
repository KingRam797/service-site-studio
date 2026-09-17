# Project Map

- Public page: `app/page.tsx`
- Public styling: `app/globals.css`
- Interactive insignia: `app/components/PushTokenExperience.tsx`
- Client workspace: `app/client/page.tsx`, `app/client/workspace.css`
- Authentication boundary: `app/layout.tsx`, `app/sign-in/**`, `proxy.ts`, `lib/auth.ts`
- Payments: `app/actions/payments.ts`, `app/api/webhooks/stripe/route.ts`, `lib/stripe.ts`
- Client data: `lib/client-workspace.ts`, `lib/db.ts`, `db/schema.sql`
- Public content: `config/site.config.ts`
- Build checks: `npm run validate`, `npm test`, `npm run lint`, `npm run build`
