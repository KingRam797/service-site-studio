---
name: deployment-check
description: Verify deployment readiness or diagnose a failed deployment without exposing credentials or changing production unexpectedly.
---

# Deployment Check

Determine the target platform and expected branch. Check only relevant:
- build command and output directory;
- runtime and package-manager versions;
- environment-variable names, never secret values;
- routing, framework, and deployment configuration;
- latest available build failure.

Run the production build locally when practical. Distinguish code failures from account, billing, permission, and provider incidents. Do not deploy, promote, roll back, or alter production settings unless the user authorized that action. Record the verified blocker and next step in `.agent/PROGRESS.md`.
