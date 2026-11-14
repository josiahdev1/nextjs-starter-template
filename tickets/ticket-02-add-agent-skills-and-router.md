# [TICKET-02] Add Agent Skills and Router

**Phase / Milestone**: Starter Pack Master Upgrade (Book B)  
**Status**: COMPLETED  
**Date**: 2026-11-14  
**Commit SHA**: pending (recorded on commit)  
**Branch**: `develop`  
**Author / Assignee**: josiahdev1 & Antigravity

---

## 1. Context & Objectives

Install the 5 workspace agent skills in `.agent/skills/` (`supabase`, `supabase-postgres-best-practices`, `supabase-realtime-data`, `security-audit`, `engineering-skills`), append the Agent Skills Router & Conflict Rules to `AGENTS.md`, and update ESLint, Prettier, Git ignores, `README.md`, and `docs/supabase-setup.md` so CI remains clean.

## 2. Architectural Design & Key Changes

- `.agent/skills/supabase/`, `.agent/skills/supabase-postgres-best-practices/`, `.agent/skills/supabase-realtime-data/`: extracted unchanged from `skills.zip`.
- `.agent/skills/security-audit/`: extracted from `security-audit.zip`, removing nested `.git` directories inside `.agent/`, plus `AGENTS.md` and `CLAUDE.md` at `.agent/skills/security-audit/` root and inside `templates/next-supabase-enterprise-engine/`.
- `.agent/skills/engineering-skills/SKILL.md`: created from B-Part 2 of the master upgrade.
- `AGENTS.md`: appended B-Part 3 router block at the bottom.
- `eslint.config.mjs`: added `".agent/**"` to `globalIgnores`.
- `.prettierignore`: added `.agent/`.
- `.gitignore`: added `skills.zip`, `skills_1.zip`, `security-audit.zip`, `security-audit_1.zip`, `engineering_skills.md`, `engineering_skills_1.md`, `nextjs-starter-pack-master-upgrade.md` (ensuring `.agent/` is NOT ignored).
- `README.md`: added `Agent Skills` subsection under `Using Supabase (optional)`.
- `docs/supabase-setup.md`: added one-line note pointing to `.agent/skills/`.

## 3. Data & Schema Modifications

None

## 4. Verification & Quality Gates

- **Format**: Failed on 7 files (`npm run format:check` -> exit 1: `.github/dependabot.yml`, `.github/workflows/dependabot-automerge.yml`, `.github/workflows/update-shadcn.yml`, `AGENTS.md`, `eslint.config.mjs`, `README.md`, `src/app/globals.css`). `.agent/` is properly ignored by `.prettierignore` (zero warnings inside `.agent/`).
- **Lint**: Failed on 2 pre-existing errors (`npm run lint` -> `eslint .` exit 1: `react-hooks/set-state-in-effect` in `src/components/ui/carousel.tsx:98` and `src/hooks/use-mobile.ts:14`). `.agent/**` is properly ignored by `eslint.config.mjs` (zero errors/warnings inside `.agent/`).
- **Type Check**: Passed (`npm run typecheck` -> `tsc --noEmit` exit 0).
- **Tests**: N/A (script not configured).
- **Build**: Passed (`npm run build` -> `next build` exit 0, static routes `/` and `/_not-found`).
- **Playwright Visual & E2E QA**: N/A (docs/config/skills only).
- **Supabase Checks** (if used): N/A
- **Evidence**:
  - All 5 `SKILL.md` files verified present and readable (`supabase`, `supabase-postgres-best-practices`, `supabase-realtime-data`, `security-audit`, `engineering-skills`).
  - `find .agent -name ".git"` returned empty; `find .agent/skills/security-audit \( -name "AGENTS.md" -o -name "CLAUDE.md" \)` returned empty.
  - Smoke test `node .agent/skills/security-audit/audit-all.cjs --sample` -> exit 0: `65 tests passed`, `Service-Role Quarantine: Clean`, `Findings Schema Validation: PASS`, `Coverage Ledger Validation: PASS`.

## 5. Notes & Dependencies

### 5 Skills Added
1. `supabase` (`.agent/skills/supabase/SKILL.md`)
2. `supabase-postgres-best-practices` (`.agent/skills/supabase-postgres-best-practices/SKILL.md`)
3. `supabase-realtime-data` (`.agent/skills/supabase-realtime-data/SKILL.md`)
4. `security-audit` (`.agent/skills/security-audit/SKILL.md`)
5. `engineering-skills` (`.agent/skills/engineering-skills/SKILL.md`)

### 5 Conflict Resolutions (B-Part 3 Section 3)
1. **`SECURITY DEFINER`**: Default to `SECURITY INVOKER`. Use `SECURITY DEFINER` only for atomic/locking procedures (`SELECT ... FOR UPDATE`) or RLS helper functions that truly need it, with pinned `search_path`, an `auth.uid()` check, non-exposed schema when not called from client, `EXECUTE` revoked from `PUBLIC`/`anon` if called via `supabase.rpc`, and Supabase advisors run after; `supabase` skill wins when unsure.
2. **Cloudflare (WAF, Turnstile, edge rules)**: Apply only if the project actually uses Cloudflare; otherwise use Vercel/Next.js equivalents (nonce-based CSP, rate limiting) and do not add Cloudflare dependencies.
3. **UI standards from `security-audit` templates (file `04`)**: `AGENTS.md` shadcn/ui and Tailwind rules win for components and classes; keep only structural ideas (skeleton fallbacks preventing layout shift, >= 48px touch targets on touch-first UIs).
4. **Packages named in `engineering-skills`**: Options (Zod, Upstash, Inngest, Resend, Vitest, Prisma, Drizzle, etc.), not requirements; add only when a ticket needs them and record in the ticket; migrations use Supabase CLI (`supabase/migrations/`), not Prisma or Drizzle.
5. **`supabase-realtime-data`**: Patterns only (`postgres_changes`, server-rendered fallback, no fake loops in production); do not create its example tables, copy its URL/key, or use `src/utils/supabase` paths (project uses `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, and `.env.local`).

### Additional Notes
- `AGENTS.md` and `README.md` were not auto-reformatted with Prettier so existing sections remain byte-for-byte untouched per Book B instructions.
