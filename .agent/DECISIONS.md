# Decisions

- Use `AGENTS.md` for compact operating policy.
- Use `.agent/` for concise project state.
- Use `.agents/skills/` for reusable, selectively loaded workflows.
- Keep payment initiation inside the authenticated client workspace; public visitors submit a build request rather than paying before acceptance.
- Use Stripe-hosted Checkout so card data never enters Push2Start code.
- Use Clerk for client identity and Neon for project state, with graceful setup states when production services are not connected.
- Provider access is authorization/status based; never accept secret keys or passwords in ordinary forms or messages.
- The supplied black/chrome/lime/cyan brand references supersede the light orange/blue direction. Use the supplied Git-branch symbol and a terminal-style build CTA in the hero.
- Rebuild the approved symbol with deterministic Blender geometry and use a lightweight GLB with native scroll-driven Three.js rendering. Keep the supplied image as a fallback; use measured SVG paths to connect the model to actual portfolio cards. No Higgsfield credits are required.
