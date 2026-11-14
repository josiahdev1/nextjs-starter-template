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
| `npm run lint`         | ESLint (`eslint .`)               |
| `npm run lint:fix`     | ESLint with auto-fix              |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`) |
| `npm run format`       | Format with Prettier              |
| `npm run format:check` | Check formatting (used by CI)     |

> **Next.js 16 note:** `next lint` no longer exists. Lint runs through the ESLint CLI.

## Project structure

```text
src/
  app/            App Router (layout.tsx, page.tsx, globals.css)
  components/ui/  shadcn/ui components
  hooks/          use-mobile, use-highlighted-code
  lib/            utils (cn), highlighter
tickets/          Ticket template + tickets (AI workflow)
.github/          CI, Dependabot, shadcn sync workflows
AGENTS.md         Rules for AI coding agents
```

## Using shadcn/ui

```bash
npx shadcn@latest add button        # add one component
npx shadcn@latest add --all         # add every component (review the diff after)
```

Run `--all` on a clean git tree. It may overwrite files you edited. Add `--overwrite` only if you want that.

## Using Supabase (optional)

Skip this section if you don't need a backend.

### Step 1: Create a Supabase project

Go to supabase.com, create a project, then open **Project Settings → API** and copy the **Project URL** and the **publishable key**.

### Step 2: Install packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Step 3: Add Supabase Library blocks (shadcn registry)

```bash
npx shadcn@latest add @supabase/supabase-client-nextjs
```

These add ready-made UI blocks for auth, realtime, storage, and more (see supabase.com/library).

### Step 4: Set environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<SUPABASE_PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

- `.env.local` is git-ignored. **Never commit it.**
- Only the publishable key may be used in the browser. **Never** put a secret / service-role key in a `NEXT_PUBLIC_*` variable.
- Restart `npm run dev` after editing.

### Step 5: Install Agent Skills (optional)

Gives AI coding tools ready-made Supabase instructions:

```bash
npx skills add supabase/agent-skills
```

### Step 6: Create the clients

- `src/lib/supabase/client.ts` for the browser (`createBrowserClient`)
- `src/lib/supabase/server.ts` for the server (`createServerClient` + cookies)
- A session-refresh file (Next.js 16 uses `proxy`, check `node_modules/next/dist/docs/`)

The easiest path is to let your AI agent do steps 2 to 6 for you (see "Working with AI agents").

### Step 7: Database changes

1. Put SQL in `supabase/migrations/NNNN_<name>.sql`.
2. Enable **Row Level Security** on every table and add policies.
3. Apply with `npx supabase db push` (or Supabase MCP).

### Deploying with Supabase

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in your host (e.g. Vercel → Project Settings → Environment Variables) and, if your build needs them, in GitHub → Settings → Secrets and variables → Actions.

## Working with AI agents (ticket workflow)

This repo is set up for AI coding agents. They read `AGENTS.md` and follow a **ticket-first** workflow:

1. Every change has a ticket in `tickets/ticket-XX-<slug>.md` (copy `tickets/TEMPLATE.md`).
2. The agent sets it `IN PROGRESS`, implements, records **real** lint/type/build results, then sets `COMPLETED`.

Starter prompt to give your agent:

```text
Read AGENTS.md and tickets/TEMPLATE.md, then create the next ticket for: <what you want>.
Follow the ticket-first workflow and record real verification output.
```

To add Supabase through an agent:

```text
Create the next ticket "supabase-integration". Follow the Supabase (Optional) section of AGENTS.md and docs/supabase-setup.md. Do not overwrite or print .env.local.
```

## CI/CD

| Workflow                      | Purpose                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `ci.yml`                      | On push/PR: install, format check, lint, typecheck, tests (if present), build |
| `dependabot-automerge.yml`    | Auto-merges non-major Dependabot PRs                                          |
| `update-shadcn.yml`           | Weekly diff of upstream shadcn components, opens a PR                         |
| `ticket-check.yml` (optional) | Requires a `tickets/ticket-*.md` change in feature PRs                        |

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
