# Supabase Setup (Template)

Use only if the project needs Supabase.

## 1. Install packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. Add Supabase Library blocks (shadcn registry)

```bash
npx shadcn@latest add @supabase/supabase-client-nextjs
```

If the CLI cannot resolve the `@supabase` namespace, check the `registries` entry in `components.json` against the Supabase Library instructions and retry.

## 3. Environment variables

Create `.env.local` (git-ignored):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<SUPABASE_PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

Never put a secret / service-role key in a `NEXT_PUBLIC_*` variable. Restart `npm run dev` after editing.

## 4. Agent Skills (optional)

```bash
npx skills add supabase/agent-skills
```

## 5. Install all shadcn components (optional)

```bash
git status                     # tree must be clean
npx shadcn@latest add --all    # review the diff after
```

## 6. Files to create

- `src/lib/supabase/client.ts` (browser client)
- `src/lib/supabase/server.ts` (server client)
- Session-refresh file (`proxy` in Next.js 16; confirm in `node_modules/next/dist/docs/`)

## 7. Database workflow

1. SQL in `supabase/migrations/NNNN_<slug>.sql`
2. Enable RLS on every table + policies
3. Apply via Supabase MCP or `npx supabase db push`
4. Verify tables and row counts, record in the ticket
