---
trigger: always_on
description: Automatic Ticket-First Development Workflow for every code, configuration, or documentation change
---

# Automatic Ticket-First Development Rule

You must automatically follow the starter pack's **Ticket-First Development Workflow** on every request that modifies code, configuration, database migrations, or documentation—even when the user does not mention tickets in their prompt:

1. **Mandatory Pre-Flight Read**:
   - Before modifying any files, ALWAYS read `AGENTS.md` and `tickets/TEMPLATE.md`.
   - Inspect existing `tickets/ticket-*.md` files to check for an active `IN PROGRESS` ticket or determine the next sequential number (`01`, `02`, `03`, ...).

2. **Automatic Ticket Creation (`IN PROGRESS`)**:
   - If the user references an existing ticket, read and update that ticket (`**Status**: IN PROGRESS`)—never create a duplicate.
   - Otherwise, automatically create `tickets/ticket-XX-<kebab-case-slug>.md` from `tickets/TEMPLATE.md` with `**Status**: IN PROGRESS` and `**Branch**: \`dev\`` **before** writing or editing any project files.
   - Ensure you are working on the `dev` branch (`git checkout -B dev` or `git switch -c dev` if missing).

3. **Implementation, Quality Gates & Completion (`COMPLETED`)**:
   - Implement the requested change following all rules in `AGENTS.md` (Next.js 16 conventions, canonical Tailwind CSS v4 classes, shadcn/ui rules, Supabase & Vercel rules).
   - Run and record real command outputs in `4. Verification & Quality Gates` of the active ticket:
     - `npm run format` (and `npm run format:check`)
     - `npm run lint` (`eslint .` — never `next lint`)
     - `npm run typecheck` (`tsc --noEmit`)
     - `npm test` (if configured)
     - `npm run build` (`next build`)
   - For UI changes, verify the live app via Playwright across `1440x900`, `1280x800`, and `390x844` with zero console/hydration errors.
   - Set `**Status**: COMPLETED` in the ticket, stage and commit all changes (`git add . && git commit -m "ticket-XX: <short summary>"`), update `**Commit SHA**` in the local ticket, and push to `origin/dev` (`git push -u origin dev`).

4. **Exception**:
   - Skip ticket creation **ONLY** when the user asks a purely read-only question (no file edits) or explicitly says `"no ticket"` / `"read-only"`.
