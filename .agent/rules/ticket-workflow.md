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

3. **Always-On Frontend & `shadcn/ui` Rule**:
   - Before writing or modifying any `.tsx` UI component or page, ALWAYS read `.agent/skills/frontend-design/SKILL.md` and build exclusively with `shadcn/ui` components from `@/components/ui/*` (`Card`, `Badge`, `Button`, `Separator`, `Alert`, `Table`, `Tabs`, etc.). Never hand-code raw `<button>`, `<input>`, custom badge `<span>` pills, or custom bordered `<div>` cards when a `shadcn/ui` component exists.

4. **Implementation, Quality Gates & Completion (`COMPLETED`)**:
   - Implement the requested change following all rules in `AGENTS.md` (Next.js 16 conventions, canonical Tailwind CSS v4 classes, `shadcn/ui` & `frontend-design` rules, Supabase & Vercel rules).
   - Run and record real command outputs in `4. Verification & Quality Gates` of the active ticket:
     - `npm run format` (and `npm run format:check`)
     - `npm run lint` (`eslint .` — never `next lint`)
     - `npm run typecheck` (`tsc --noEmit`)
     - `npm test` (if configured)
     - `npm run build` (`next build`)
   - For UI changes, verify the live app via Playwright across `1440x900`, `1280x800`, and `390x844` with zero console/hydration errors.
   - Set `**Status**: COMPLETED` in the ticket, stage and commit all changes (`git add . && git commit -m "ticket-XX: <short summary>"`), update `**Commit SHA**` in the local ticket, and push to `origin/dev` (`git push -u origin dev`).

5. **Starter-Template Landing Page Sync & Downstream User Protection**:
   - **Starter-Template Landing Page Sync**: Whenever new starter-pack features, dependencies, routes, skills, or workflows are added or updated in this template repository, update the starter showcase section in `src/app/page.tsx` so `http://localhost:3000/` accurately reflects what's new in the codebase—using only real features present in the repo.
   - **Downstream User Protection**: Only update `src/app/page.tsx` if the starter-pack showcase section (`data-starter-showcase="true"`) is still present. If a developer clones this template and replaces `src/app/page.tsx` with their own custom app/landing page, NEVER overwrite or re-inject starter-pack template sections into their custom `src/app/page.tsx`.

6. **Exception**:
   - Skip ticket creation **ONLY** when the user asks a purely read-only question (no file edits) or explicitly says `"no ticket"` / `"read-only"`.
