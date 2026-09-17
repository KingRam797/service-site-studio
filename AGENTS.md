# AGENTS.md

<!-- BEGIN:shared-agent-workflow -->
## Goal
Complete the requested task correctly with minimal context, tool calls, and rework.

## Start Here
Before substantial work:
1. Read this file.
2. Read `.agent/PROGRESS.md` if it exists.
3. Read `.agent/PROJECT_MAP.md` only when location discovery is needed.
4. Read `.agent/DECISIONS.md` when product or architecture decisions matter.
5. Load only the relevant skill under `.agents/skills/`.

Do not scan the entire repository unless evidence requires it.

## Execution
- Identify the exact requested change before searching.
- Inspect the smallest likely file set first.
- Do not reread unchanged files or repeat completed work.
- Make the smallest reliable change and preserve unrelated behavior.
- Keep successful tool output brief; retain detail for failures and important findings.
- Prefer targeted verification; run a full build only when warranted.
- Treat existing user changes as authoritative and do not overwrite them casually.

## Persistent State
- `.agent/PROJECT_MAP.md`: verified locations of major systems and commands.
- `.agent/PROGRESS.md`: completed work, changed files, verification, blockers, and exact next step.
- `.agent/DECISIONS.md`: durable product and architecture decisions only.

Keep these files concise; they are recovery points, not journals.

## Skills
Use the matching skill only when relevant:
- `repo-handoff`
- `debugging`
- `project-map-refresh`
- `deployment-check`
- `frontend-pass`
- `mobile-playtest`

## Delegation
Delegate only when explicitly authorized and when tasks are substantial, independent, and precisely scoped. The primary agent owns integration and verification.

### Subagent Delegation Policy
When subagents are requested:
- The primary/orchestrator agent reads and follows `AGENTS.md` and inspects repository architecture as needed.
- Subagents do **not** read `AGENTS.md` unless the orchestrator explicitly determines that broader context is required.
- The orchestrator gives each subagent the minimum working packet: exact files to read/edit, directly relevant interfaces or dependencies, task objective, constraints, acceptance criteria, and required validation/tests.
- Subagents must not scan the full repository by default; expand scope only when evidence shows the assigned task requires it.
- The orchestrator owns cross-system reasoning, integration, conflict resolution, final validation, and reporting.
- Prefer one primary execution path. Use multiple subagents only when tasks are meaningfully independent and the parallelism or specialization justifies the additional usage.

## Continuity Protection
When the interface indicates usage is nearing its limit, or interruption risk is high:
1. stop starting large new units;
2. finish the safest current unit;
3. update `.agent/PROGRESS.md`;
4. record the exact next action;
5. leave the repository runnable or clearly document why it is not.

## Communication
For ordinary success, report only what changed and whether verification passed. Expand only for failures, uncertainty, or meaningful tradeoffs.
<!-- END:shared-agent-workflow -->
