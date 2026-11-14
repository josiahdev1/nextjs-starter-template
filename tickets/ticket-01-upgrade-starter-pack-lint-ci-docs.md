# [TICKET-01] Upgrade Starter Pack: Lint Fix, AGENTS.md, README, and CI/CD

**Phase / Milestone**: Starter Pack Master Upgrade (Book A)  
**Status**: COMPLETED  
**Date**: 2026-11-14  
**Commit SHA**: pending (recorded on commit)  
**Branch**: `develop`  
**Author / Assignee**: josiahdev1 & Antigravity

---

## 1. Context & Objectives

Upgrade the `nextjs-starter-template` starter pack with Book A of the master upgrade:

- Fix `package.json` lint script (replace removed Next.js 16 `next lint` with `eslint .`), and add `lint:fix`, `typecheck`, `format`, and `format:check`.
- Append project overview, ticket-first workflow, shadcn/ui rules, linting rules, quality gates, Git/GitHub rules, optional Supabase rules, and Playwright E2E rules to `AGENTS.md` without modifying existing content.
- Establish `tickets/TEMPLATE.md` and `tickets/ticket-01-upgrade-starter-pack-lint-ci-docs.md`.
- Replace `README.md` with comprehensive starter pack documentation (without and with optional Supabase).
- Update `.github/workflows/ci.yml` and add `.github/workflows/ticket-check.yml`.
- Add optional Supabase setup files (`docs/supabase-setup.md`, `.env.example`) and update `.gitignore` without installing Supabase packages or creating `.env.local`.

## 2. Architectural Design & Key Changes

- `package.json`: updated `lint`, added `lint:fix`, `typecheck`, `format`, `format:check`.
- `AGENTS.md`: appended Book A starter-pack additions block at the bottom.
- `tickets/TEMPLATE.md`: created standard ticket template.
- `README.md`: replaced with A-Part 3 template documentation.
- `.github/workflows/ci.yml`: replaced with Node 22 CI pipeline (`format:check`, `lint`, `typecheck`, `test --if-present`, `build`).
- `.github/workflows/ticket-check.yml`: added PR ticket enforcement workflow.
- `docs/supabase-setup.md` & `.env.example`: created optional Supabase setup documentation and placeholder env template.
- `.gitignore`: ensured `.env*` and `!.env.example` are present.

## 3. Data & Schema Modifications

None

## 4. Verification & Quality Gates

- **Format**: Failed on 5 pre-existing untouched files (`npm run format:check` -> exit 1: `.github/dependabot.yml`, `.github/workflows/dependabot-automerge.yml`, `.github/workflows/update-shadcn.yml`, `eslint.config.mjs`, `src/app/globals.css`). All files created/modified in Ticket 1 pass Prettier formatting.
- **Lint**: Failed on 2 pre-existing errors (`npm run lint` -> `eslint .` exit 1: `react-hooks/set-state-in-effect` in `src/components/ui/carousel.tsx:98` and `src/hooks/use-mobile.ts:14`). `eslint.config.mjs` confirmed working with `npx eslint .`.
- **Type Check**: Passed (`npm run typecheck` -> `tsc --noEmit` exit 0).
- **Tests**: N/A (script not configured).
- **Build**: Passed (`npm run build` -> `next build` exit 0, static routes `/` and `/_not-found`).
- **Playwright Visual & E2E QA**: N/A (docs/config only).
- **Supabase Checks** (if used): N/A
- **Evidence**:
  - `npm run format:check` -> `[warn] Code style issues found in 5 files` (all pre-existing untouched files; `dependabot-automerge.yml`, `update-shadcn.yml`, `dependabot.yml` left unchanged per instructions).
  - `npm run lint` -> `✖ 2 problems (2 errors, 0 warnings)` in pre-existing `carousel.tsx` and `use-mobile.ts`.
  - `npm run typecheck` -> exit 0.
  - `npm run build` -> `✓ Compiled successfully in 1141ms`, `✓ Finished TypeScript in 3.4s`.

## 5. Notes & Dependencies

- No packages installed (Supabase remains optional).
- `e2e.yml` skipped because no Playwright test suite exists in the repository.
- Pre-existing `dependabot-automerge.yml`, `update-shadcn.yml`, and `dependabot.yml` were left unchanged per Ticket 1 instructions.
- Next ticket in sequence: `ticket-02-add-agent-skills-and-router.md`.
