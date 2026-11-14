# Supabase Database & Migration Architecture

This directory contains the database migrations, seed data, and schema definitions for **nextjs-starter-template**.

---

## 1. Migration Directory Layout

```text
supabase/
├── migrations/
│   └── 0001_init_starter.sql        # Initial starter schema (todos table with RLS & Realtime)
└── README.md                        # This documentation file
```

---

## 2. Autonomous Migration & Realtime Rules (for AI Agents & Developers)

1. **Numbered Migrations (`supabase/migrations/NNNN_<slug>.sql`)**:
   - Every schema change, table creation, column modification, index, trigger, or function MUST be saved as an additive, sequential migration file.
   - Never edit applied migrations; add the next sequential migration number (`0002_...`, `0003_...`).

2. **Row Level Security (RLS) is Mandatory**:
   - Every table in `public` must execute `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`.
   - Explicit policies must be created for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
   - Never use insecure metadata for security checks; rely on verified `auth.uid()` or role claims.

3. **Realtime Replication Publication**:
   - For any table that needs live client updates, add it to the `supabase_realtime` publication:
     ```sql
     DO $$
     BEGIN
       IF NOT EXISTS (
         SELECT 1 FROM pg_publication_tables
         WHERE pubname = 'supabase_realtime'
           AND schemaname = 'public'
           AND tablename = '<table_name>'
       ) THEN
         ALTER PUBLICATION supabase_realtime ADD TABLE public.<table_name>;
       END IF;
     END $$;
     ```

4. **Zero Manual Copy-Paste (Autonomous MCP Push)**:
   - When an AI agent creates or changes migrations, the agent must automatically push pending migrations to the remote Supabase project using:
     - **Supabase MCP**: `apply_migration` or `execute_sql`.
     - **Supabase CLI**: `npx supabase db push`.
   - **NO MANUAL SQL INSTRUCTIONS**: Never instruct the developer to manually paste SQL into the Supabase Dashboard SQL Editor unless both automated MCP and the CLI fail or are unauthenticated.

---

## 3. Local & Remote Commands

- Push pending migrations:
  ```bash
  npx supabase db push
  ```
- Generate TypeScript types from remote schema:
  ```bash
  npx supabase gen types typescript --project-id <your-project-ref> > src/types/supabase.ts
  ```
- Verify status in browser:
  Open [http://localhost:3000/supabase-test](http://localhost:3000/supabase-test) to verify your connection, migration status, and live Realtime streams.
