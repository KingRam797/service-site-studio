---
name: three-pass-delivery
description: Deliver a scoped Push2Start client site in three cohesive implementation passes using the existing foundation and a distinct client identity.
---

# Three-pass client delivery

Use after the client scope is sufficiently complete. Read AGENTS.md once, the current project checkpoint, then the completed client intake. Read only the chosen module's code. Do not rediscover the repository or duplicate existing checklists.

## Entry gate

Use `docs/CLIENT_INTAKE.md`: one decision-maker, approved offer/rules/content/assets, conversion goal, provider ownership/access, scope, and visual constraints. Record unknowns. READY_TO_BUILD and financial milestones retain their existing business meaning; these engineering passes do not alter payment rules.

## Pass 1 — direction and working spine

- Choose the smallest operating module with `docs/MODULE_MATRIX.md`.
- Specify client typography, palette, composition, image rhythm and one signature interaction in the project's design direction.
- Implement the responsive shell and primary page with a working primary customer action.
- Reuse configuration, SEO/schema, tracked links, field validation, error states and accessible navigation where their contracts fit.
- Exit: the primary path works and the decision-maker can review a concrete direction; missing assets/access are named rather than invented.

## Pass 2 — complete the approved system

- Complete routes, real content, selected provider adapters, responsive states and signature treatment in one related pass.
- Exercise the chosen module's business boundaries and loading/empty/success/failure states.
- Keep client identity outside reusable operations. A second consumer and a stable tested contract justify extracting a module; speculation does not.
- Exit: approved scope is implemented on a preview with no placeholder content or known functional blocker.

## Pass 3 — prove and launch

- Run repository validation, tests, lint and build; use `docs/DELIVERY_CHECKLIST.md` for responsive, accessibility, performance and owner handoff gates.
- Verify the preview's primary journey, failures, links, media policies and required integrations. Keep test data and provider side effects intentional.
- Merge/release only with existing authorization and passed applicable gates. Verify the resulting production deployment and public domain, not just the merge.
- Exit: tested production, owner handoff, rollback reference, exact current checkpoint and only genuine external/manual blockers.

## Scope and continuity

Three passes are a target when requirements are complete, not a shortcut around failed checks. Record late scope changes separately. Finish coherent verified work before optional polish. At the usage boundary, update `.agent/PROGRESS.md` with the next executable action.

One primary worker owns the architecture and integration. When substantial independent work warrants authorized delegation, give exact files, interfaces, constraints, acceptance criteria and tests; do not ask another agent to rediscover the project.

## Existing machinery map

| Concern | Starting point |
|---|---|
| Brand/content contract | `config/site.config.ts`, `lib/config.ts` |
| Responsive shell and service routes | `app/components/SiteChrome.tsx`, `ServicePage.tsx`, `app/globals.css` |
| SEO and analytics | `lib/structured-data.ts`, `lib/site-url.ts`, `app/layout.tsx`, `TrackedLink.tsx` |
| Inquiry/errors/notification | `InquiryForm.tsx`, `app/api/inquiries/route.ts`, `lib/inquiry-delivery.ts` |
| Cinematic policy | `CinematicBackdrop.tsx`, `motion-preference.ts`, `lib/cinematic-policy.ts` |
| Operations selection | `docs/MODULE_MATRIX.md` (a reference matrix, not proof every adapter is generalized) |
| Delivery evidence | `docs/DELIVERY_CHECKLIST.md`, `.agent/PROGRESS.md` |

Use repository-local paths. The component entries above are under `app/components/`. Never copy production credentials, customer data, client agreements or provider account IDs into a new client site. Client-specific brand assets/copy/prices/policies are inputs, never starter defaults to publish unchanged.
