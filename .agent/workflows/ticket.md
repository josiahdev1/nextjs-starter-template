---
description: Execute a task using the starter pack ticket-first workflow
---

# `/ticket` — Ticket-First Execution Workflow

Follow these steps in order for the user's task:

1. **Read Project Standards**:
   - Read `AGENTS.md` and `tickets/TEMPLATE.md`.
   - Read any relevant skill in `.agent/skills/<skill>/SKILL.md` based on the Agent Skills Router in `AGENTS.md`.

2. **Verify `dev` Branch**:
   - Ensure the current Git branch is `dev` (`git checkout -B dev` if not on `dev`).

3. **Create or Resume Ticket (`IN PROGRESS`)**:
   - List `tickets/ticket-*.md` to find the next sequential number `XX`.
   - Create `tickets/ticket-XX-<kebab-case-slug>.md` copying the exact structure of `tickets/TEMPLATE.md` with `**Status**: IN PROGRESS` and `**Branch**: \`dev\``.

4. **Implement Changes**:
   - Execute the task while adhering to Next.js 16 conventions, canonical Tailwind CSS v4 classes, shadcn/ui composition rules, and Supabase/Vercel guidelines in `AGENTS.md`.
   - Record any added packages or shadcn components in `5. Notes & Dependencies`.

5. **Run Quality Gates**:
   // turbo-all
   - Run `npm run format` and `npm run format:check`
   - Run `npm run lint`
   - Run `npm run typecheck`
   - Run `npm test --if-present`
   - Run `npm run build`
   - If UI/behavior changed, verify `http://localhost:3000` with Playwright at `1440x900`, `1280x800`, and `390x844`.

6. **Close Ticket & Push to `dev`**:
   - Record the real command outputs in `4. Verification & Quality Gates` of `tickets/ticket-XX-<kebab-case-slug>.md` and set `**Status**: COMPLETED`.
   - Run:
     ```bash
     git add .
     git commit -m "ticket-XX: <short summary>"
     git push -u origin dev
     ```
   - Update `**Commit SHA**` in the local ticket file with the resulting commit hash.
