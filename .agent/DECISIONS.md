# Decisions

- Use `AGENTS.md` for compact operating policy.
- Use `.agent/` for concise project state.
- Use `.agents/skills/` for reusable, selectively loaded workflows.
- Keep payment initiation inside the authenticated client workspace; public visitors submit a build request rather than paying before acceptance.
- Use Stripe-hosted Checkout so card data never enters Push2Start code.
- Use Clerk for client identity and Neon for project state, with graceful setup states when production services are not connected.
- Provider access is authorization/status based; never accept secret keys or passwords in ordinary forms or messages.
- Treat the 3D push token as the single signature interaction and keep the rest of the public design disciplined.
