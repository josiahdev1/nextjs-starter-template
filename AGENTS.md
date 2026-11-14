<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Tailwind CSS Developer Guide for Agents

This project uses **Tailwind CSS v4** alongside the **Tailwind CSS IntelliSense** engine. To prevent `suggestCanonicalClasses` warnings from appearing in the user's IDE, agents must always write **canonical utility classes** instead of arbitrary bracket syntax (`[...]`).

### 1. Opacity Rule: Use Percentage Values (`/N`) Instead of Bracket Decimals (`/[.N]`)

Never write decimal opacities inside brackets like `bg-black/[.08]` or `border-white/[.12]`. Always convert the decimal to an integer percentage (`decimal × 100`).

- **Pattern**: `<property>-<color>/<percentage>`
- **Conversion formula**: `0.06` → `/6`, `0.12` → `/12`, `0.5` → `/50`
- **Examples**:
  - `/[.02]` → `/2` (e.g., `bg-black/2`)
  - `/[.04]` → `/4` (e.g., `hover:bg-black/4`)
  - `/[.06]` → `/6` (e.g., `bg-black/6`)
  - `/[.08]` → `/8` (e.g., `border-black/8`, `dark:bg-white/8`)
  - `/[.12]` → `/12` (e.g., `dark:border-white/12`)
  - `/[.145]` or `/[.15]` → `/15` (e.g., `dark:border-white/15`)
  - `/[.50]` → `/50` (e.g., `text-black/50`)

### 2. Spacing & Sizing Rule: Use Multiples of 4px (`pixels ÷ 4`)

Tailwind's scale is based on `1 unit = 4px` (0.25rem). Avoid arbitrary pixel brackets (`w-[100px]`, `h-[14px]`) whenever a standard integer or half-step value exists.

- **Conversion formula**: `pixels ÷ 4 = utility value`
- **Examples**:
  - `w-[100px]` → `100 ÷ 4 = 25` → `w-25`
  - `h-[14px]` → `14 ÷ 4 = 3.5` → `h-3.5`
  - `p-[6px]` → `6 ÷ 4 = 1.5` → `p-1.5`
  - `gap-[18px]` → `18 ÷ 4 = 4.5` → `gap-4.5`
  - `w-[160px]` → `160 ÷ 4 = 40` → `w-40`

### 3. General Principles for Canonical Classes

- **Avoid unnecessary brackets**: Never write `border-[1px]`, `text-[14px]`, or `rounded-[12px]` when standard classes like `border`, `text-sm`, or `rounded-xl` exist.
- **Button & Flex layout safety**: Always include `whitespace-nowrap` on buttons, pills, or badges that contain text next to icons to prevent awkward multiline line breaks.
- **Semantic theme tokens**: Prefer project CSS variables and theme tokens (e.g., `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`) over arbitrary hardcoded hex codes.

---

<!-- BEGIN:starter-pack-additions (appended, existing sections above are untouched) -->

## Project Overview

**nextjs-starter-template** is built from the Next.js Starter Pack:

- Next.js 16 (App Router), React 19, TypeScript 5 (strict, `@/*` alias to `src/*`)
- Tailwind CSS v4 (CSS `@import`, OKLCH tokens in `src/app/globals.css`, `tw-animate-css`)
- shadcn/ui (base-nova style, Base UI) in `src/components/ui/`
- Poppins via `next/font/google` mapped to `--font-sans`
- ESLint 9 flat config (CLI), Prettier with Tailwind sorting plugin
- GitHub Actions in `.github/workflows/`
- **Optional**: Supabase (see "Supabase (Optional)" below). Only use it if this project has opted in.

## Ticket-First Development Workflow (`tickets/`)

1. **Mandatory Read & Naming Convention**: Before starting any task, always read `tickets/TEMPLATE.md` and inspect existing `tickets/ticket-*.md` files to check active tickets or determine the next sequential number. Every ticket lives in root `tickets/` named `tickets/ticket-XX-<kebab-case-slug>.md` and strictly follows `tickets/TEMPLATE.md` (`# [TICKET-XX] <Title>`, metadata block with `Phase / Milestone`, `Status`: `TODO` | `IN PROGRESS` | `COMPLETED`, `Date`, `Commit SHA`, `Branch: develop`, `Author / Assignee`, and sections `1. Context & Objectives` through `5. Notes & Dependencies`).
2. **Ticket Before Code (Zero Unapproved Coding)**:
   - **Existing / Provided Ticket**: If the owner already created, named, or pasted a ticket, read that exact ticket, NEVER create a duplicate, set `**Status**: IN PROGRESS`, implement all changes, fill in `Commit SHA` and `4. Verification & Quality Gates` with real command outputs, and set `**Status**: COMPLETED` when done.
   - **New Request Without a Ticket**: If the owner asks for a new feature, UI change, or bug fix without an existing ticket, create the next sequential ticket from `tickets/TEMPLATE.md` FIRST (`**Status**: IN PROGRESS`), and only write code after the ticket file is written.
3. **One ticket = one focused change.** Do not bundle unrelated work.
4. **Record dependencies**: Any package or shadcn component added must be listed (name, version, reason) in `5. Notes & Dependencies` of the active ticket.

## shadcn/ui Rules

1. **Check before building**: Look in `src/components/ui/` before writing a new UI component. The starter ships 50+ components. Reuse and compose them; do not create duplicates.
2. **Add components with the CLI only**: `npx shadcn@latest add <component>`. Configuration lives in `components.json`.
3. **Add everything (only when the owner asks)**: `npx shadcn@latest add --all`. This can overwrite files, so run it on a clean git tree and review the diff. Use `--overwrite` only with owner approval.
4. **Do not edit `src/components/ui/*` casually**: Prefer wrapping or composing. If you must change one, note it in the ticket (the weekly `update-shadcn.yml` workflow may conflict).
5. **Class merging**: Always use the `cn()` helper from `src/lib/utils.ts`.
6. **Hooks**: Use `use-mobile.ts` for the `< 768px` breakpoint.

## Linting Rules (Next.js 16)

- **Never use `next lint`.** It was removed in Next.js 16 and fails with `Invalid project directory ... /lint`.
- Lint with the ESLint CLI: `npm run lint` must run `eslint .` (flat config in `eslint.config.mjs`).
- If a CI job fails on lint, check `package.json` scripts first.

## Code Quality Gates

Before every commit and before setting any ticket `COMPLETED`, run and record real output for:

```bash
npm run format:check   # Prettier
npm run lint           # ESLint CLI (eslint .)
npm run typecheck      # tsc --noEmit
npm test               # only if a test script exists
npm run build          # Next.js production build
```

If a script does not exist in `package.json`, write "N/A (script not configured)" in the ticket instead of inventing a result.

## Git & GitHub Rules

- **Working branch**: `develop`. All development is committed there.
- Never commit broken code or secrets (`.env.local`, API keys, service-role keys).
- Commit messages: `ticket-XX: <short summary>`.
- Before opening a PR, test the merge with main:
  ```bash
  git fetch origin main
  git merge --no-commit --no-ff origin/main
  ```
  Resolve conflicts on `develop`, re-run all quality gates, then commit. Never push unresolved conflict markers.
- Open a Pull Request from `develop` to `main`. `ci.yml` must pass before merge. Activity is recorded on `josiahdev1`.

## Supabase (Optional)

> **Only apply this section if the project uses Supabase** (i.e. `docs/supabase-setup.md` exists or the owner asked for it). Otherwise ignore it and do not install any Supabase package.

1. **Setup source of truth**: follow `docs/supabase-setup.md` exactly.
   - Packages: `@supabase/supabase-js` and `@supabase/ssr`
   - Library blocks: `npx shadcn@latest add @supabase/supabase-client-nextjs`
   - Agent skills (optional): `npx skills add supabase/agent-skills`, then read the installed Supabase skill before schema, RLS, Realtime, or Storage work.
2. **Environment variables (`.env.local`)**:
   - Required: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - `.env.local` is git-ignored. Provide `.env.example` with placeholders only. Never print, log, or commit real keys.
   - **Never** put a service-role / secret key in a `NEXT_PUBLIC_*` variable or in client code.
   - Restart `next dev` after changing env files.
3. **Client usage**:
   - Browser client: `src/lib/supabase/client.ts` (`createBrowserClient`)
   - Server client: `src/lib/supabase/server.ts` (`createServerClient` with Next.js cookies)
   - Session refresh: Next.js 16 renamed `middleware` to `proxy`. Confirm in `node_modules/next/dist/docs/` before writing it.
   - Use `getUser()` (not `getSession()`) for server-side auth checks.
4. **Database changes**:
   - Schema in `supabase/migrations/NNNN_<slug>.sql` (additive, `IF NOT EXISTS`). Seeds in `supabase/seed.sql`.
   - **Enable RLS on every table in `public`** with explicit policies.
   - If Supabase MCP tools are available for project `<SUPABASE_PROJECT_REF>`, apply migrations with `apply_migration` and seeds with `execute_sql`, then verify table and row counts. Otherwise use `npx supabase db push`.
   - Document every table touched in section 3 of the ticket.

## Playwright End-to-End Verification (UI Tickets)

For any ticket that changes UI or behavior, run Playwright against the live app before marking `COMPLETED` (skip only for docs/config-only tickets and say so in the ticket):

- Target `http://localhost:3000` and verify: zero `console.error` / hydration warnings on load and reload; clean rendering at `1440x900`, `1280x800`, and `390x844` with no clipped content or horizontal scrollbar; every modified control works; light and dark mode if supported.
- Never leave screenshot or test-artifact junk in the repo.
- If anything fails, fix it and re-run until everything passes. Record the command and pass summary in section 4 of the ticket.

<!-- END:starter-pack-additions -->

---

<!-- BEGIN:agent-skills-router -->

## Agent Skills Router & Conflict Rules (`.agent/skills/`)

Skills live in `.agent/skills/<name>/SKILL.md` and are the **source of truth** for their topic. This section only says **which skill to read** and **how to settle conflicts**. It intentionally does not repeat skill content, so never copy skill rules into this file.

### 1. Which skill to read (before starting the work)

| Skill | Read it before |
|-------|----------------|
| `supabase` | ANY Supabase task: database, Auth, RLS, Storage, Realtime, Edge Functions, migrations, CLI, MCP, debugging |
| `supabase-postgres-best-practices` | Writing or changing anything in Postgres: tables, types, migrations, indexes, RLS policies, functions, triggers, queries, slow-query diagnosis |
| `supabase-realtime-data` | Building live-update features (Realtime subscriptions, live dashboards, presence). **Patterns only** (see 3.5) |
| `security-audit` | Security questions, reviews of auth, RLS, API routes, uploads, secrets, dependencies, or any request to audit or pen-test |
| `engineering-skills` | Architecture (RSC, Server Actions, Route Handlers), data modeling, caching, background jobs, CI/CD and deployment, performance, testing, code review |

- Read the relevant `SKILL.md` and then only the reference files it points to for the task. Do not bulk-read an entire skill folder.
- In `5. Notes & Dependencies` of the active ticket, list which skills were read.
- Supabase changes often. The `supabase` skill requires checking the current changelog and docs before implementing. Do that instead of trusting memory.

### 2. Precedence when instructions disagree (highest first)

1. The owner's explicit instruction and the active ticket
2. This `AGENTS.md` (Next.js rules, Tailwind rules, ticket workflow, shadcn rules, Git rules, quality gates)
3. Security and data-safety rules. If two skills disagree, the **stricter** rule wins
4. `supabase` skill for Supabase-specific behavior, `supabase-postgres-best-practices` for SQL design and performance
5. `engineering-skills` for general engineering practice
6. `supabase-realtime-data` (reference patterns only)

If a conflict is not listed below and you cannot settle it with this order, stop and ask the owner instead of guessing.

### 3. Known conflicts and their resolution

1. **`SECURITY DEFINER`**: Default to `SECURITY INVOKER`. Use `SECURITY DEFINER` only for atomic or locking procedures (`SELECT ... FOR UPDATE`) or RLS helper functions that truly need it, and then ALL of these apply: pinned `search_path`; an `auth.uid()` check inside the function; keep it in a non-exposed schema when it is not called from the client; if it must be called through `supabase.rpc`, revoke `EXECUTE` from `PUBLIC` and `anon` and grant only what is needed; run the Supabase advisors after the change. When unsure, the `supabase` skill wins.
2. **Cloudflare (WAF, Turnstile, edge rules)**: Apply only if this project actually uses Cloudflare. Otherwise use the Vercel and Next.js equivalents (nonce-based CSP, rate limiting) and do not add Cloudflare dependencies.
3. **UI standards from `security-audit` templates (file `04`)**: The shadcn/ui and Tailwind rules in this file win for components and classes. Take only the structural ideas: skeleton fallbacks that prevent layout shift, and touch targets of at least 48px on touch-first UIs.
4. **Packages named in `engineering-skills`** (Zod, Upstash, Inngest, Resend, Vitest, Prisma, Drizzle, and so on) are options, not requirements. Add a dependency only when a ticket needs it and record it per the dependency rule. Migrations in this project use the Supabase CLI (`supabase/migrations/`), not Prisma or Drizzle.
5. **`supabase-realtime-data`**: Use it for patterns only (`postgres_changes` subscriptions, graceful fallback to server-rendered data, no fake loops in production). Do NOT create its example tables, do NOT copy its project URL or key, and do NOT use its `src/utils/supabase` paths. This project uses `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, and the values in `.env.local`. Create tables only when the owner asks for a feature that needs them.

### 4. Using `security-audit`

- **Guidance mode is the default**: use only the relevant parts for the question. Do not run the full six-phase workflow, create output folders, or write audit files unless the owner explicitly asks for an audit, pen test, or report.
- **Full audit mode** only on explicit request. Write its output outside the repository and never commit audit artifacts.
- Never run target code outside the safe-execution rules in that skill. Do not install dependencies for the audit.
- Do not run `engine-scanner.cjs` on this repository unless the owner asks, because it writes assessment files into the target.
- Never mark a security check as passed without evidence. Record the command or finding reference in the ticket.

<!-- END:agent-skills-router -->
