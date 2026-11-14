# nextjs-starter-template

A production-ready **Next.js 16** starter with **Tailwind CSS v4**, **shadcn/ui (50+ components)**, strict **TypeScript**, automated **CI/CD**, an **AI-agent ticket workflow**, and **optional Supabase**.

## What's included

- Next.js 16 (App Router), React 19, TypeScript 5 (strict, `@/*` alias)
- Tailwind CSS v4 with OKLCH design tokens and `tw-animate-css`
- shadcn/ui (base-nova, Base UI): forms, dialogs, sidebar, charts (recharts), carousel (Embla), command palette (cmdk), code highlighting (Shiki), chat widgets, and more
- Poppins font via `next/font/google`
- ESLint 9 (flat config) + Prettier (Tailwind class sorting)
- GitHub Actions: CI, Dependabot auto-merge, weekly shadcn sync
- `AGENTS.md` + `tickets/` workflow for AI coding agents
- Optional Supabase (auth, database, realtime, storage)

## Requirements

- **Node.js 20.9 or newer** (Node 22 recommended)
- npm (this starter uses `package-lock.json`)
- Git

## Quick start (without Supabase)

```bash
git clone <your-repo-url> nextjs-starter-template
cd nextjs-starter-template
npm install
npm run dev
```

Open http://localhost:3000. That's it, no environment variables are needed.

## Scripts

| Command                | What it does                      |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the dev server (Turbopack)  |
| `npm run build`        | Production build                  |
| `npm run start`        | Run the production build          |
| `npm test`             | Run automated test suite (`tsx`)  |
| `npm run lint`         | ESLint (`eslint .`)               |
| `npm run lint:fix`     | ESLint with auto-fix              |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`) |
| `npm run format`       | Format with Prettier              |
| `npm run format:check` | Check formatting (used by CI)     |

> **Next.js 16 note:** `next lint` no longer exists. Lint runs through the ESLint CLI.

## Project structure

```text
src/
  app/               App Router (layout.tsx, page.tsx, globals.css)
  app/supabase-test/ Live Supabase diagnostic & Realtime verification page
  components/ui/     shadcn/ui components (50+)
  hooks/             use-mobile, use-highlighted-code
  lib/supabase/      Next.js 16 SSR clients, proxy session refresh, status helpers
  lib/               utils (cn), highlighter
supabase/
  migrations/        Numbered SQL migrations (RLS + Realtime enabled)
  README.md          Autonomous database migration & push rules
tickets/             Ticket template + git-ignored local tickets (AI workflow)
.agent/skills/       Pre-installed AI agent skills
.github/             CI, Dependabot, shadcn sync workflows
AGENTS.md            Rules for AI coding agents
```

## Using shadcn/ui

```bash
npx shadcn@latest add button        # add one component
npx shadcn@latest add --all         # add every component (review the diff after)
```

Run `--all` on a clean git tree. It may overwrite files you edited. Add `--overwrite` only if you want that.

## Using Supabase (optional)

Supabase client libraries (`@supabase/supabase-js`, `@supabase/ssr`), Next.js 16 session refresh proxy, database migration directories, and diagnostic tools are pre-installed out of the box with zero boilerplate. If you don't need a backend, no action is needed—the project builds and runs cleanly without Supabase credentials.

When you're ready to connect Supabase:

### 1. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials (from your Supabase Dashboard under Project Settings → API):

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

### 2. Verify connection & Realtime

Restart your dev server (`npm run dev`) and visit **`http://localhost:3000/supabase-test`**:

- Checks environment credentials without exposing secrets.
- Compares local migrations against applied migrations on remote database.
- Establishes a live Supabase Realtime WebSocket connection to verify subscriptions.

### 3. Push migrations autonomously

Tell your AI coding agent (Antigravity, Claude Code, Cursor, Windsurf, etc.) to apply pending migrations via **Supabase MCP** or run:

```bash
npx supabase db push
```

> **Zero Manual SQL**: AI agents automatically push numbered migrations with Row Level Security (RLS) enabled. Never manually copy-paste SQL in the Dashboard unless automated tools are completely unavailable.

### 4. Deploying with Supabase

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to your hosting provider (e.g., Vercel → Project Settings → Environment Variables) and to **GitHub → Settings → Secrets and variables → Actions** if CI builds require them.

## Agent Skills

Five skills live in `.agent/skills/` (and `.claude/skills/`) and are routed through `AGENTS.md`:

| Skill                              | Purpose                                                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `supabase`                         | Official Supabase docs lookup, Auth (`getClaims`, SSR cookies), RLS security checklist, Edge Functions, Storage, CLI & MCP |
| `supabase-postgres-best-practices` | Postgres schema design, query optimization, indexes, connection pooling, and RLS performance                               |
| `supabase-realtime-data`           | Realtime subscription patterns and `supabase_realtime` publication setup                                                   |
| `security-audit`                   | Defensive security review workflow and 14 threat handbooks                                                                 |
| `engineering-skills`               | Architecture, backend, DevOps, performance, and testing practices                                                          |

## Working with AI agents (ticket workflow)

This repo is set up for AI coding agents. They read `AGENTS.md` and follow a **ticket-first** workflow:

1. Every change has a ticket in `tickets/ticket-XX-<slug>.md` (copy `tickets/TEMPLATE.md`). Local tickets stay in `tickets/` and are ignored by Git via `tickets/.gitignore`.
2. The agent works on the `dev` branch, sets the ticket `IN PROGRESS`, implements, records **real** lint/type/build results, sets `COMPLETED`, and commits and pushes to `origin/dev` (`git push -u origin dev`) to be merged into `main` via Pull Request on GitHub.

Starter prompt to give your agent:

```text
Read AGENTS.md and tickets/TEMPLATE.md, then create the next ticket for: <what you want>.
Follow the ticket-first workflow and record real verification output.
```

## CI/CD

| Workflow                   | Purpose                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| `ci.yml`                   | On push/PR (`main`, `dev`): install, format check, lint, typecheck, tests (if present), build |
| `dependabot-automerge.yml` | Auto-merges non-major Dependabot PRs                                                          |
| `update-shadcn.yml`        | Weekly diff of upstream shadcn components, opens a PR                                         |

If your build needs Supabase variables, add them as **GitHub Actions secrets** named `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Without Supabase, nothing needs to be configured.

## Troubleshooting

| Problem                                   | Fix                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------ |
| CI: `Invalid project directory ... /lint` | `next lint` was removed in Next 16. Set `"lint": "eslint ."` in `package.json`       |
| `Missing NEXT_PUBLIC_SUPABASE_URL`        | Create `.env.local` from `.env.example`, restart dev server                          |
| Env change not picked up                  | Stop and restart `npm run dev`                                                       |
| `shadcn add --all` overwrote my edits     | `git checkout -- <file>` or `git restore .` (that's why you start from a clean tree) |
| Prettier fails in CI                      | Run `npm run format` locally and commit                                              |
| Node version error                        | Use Node 20.9+ (22 recommended)                                                      |

## License

<Your license>
