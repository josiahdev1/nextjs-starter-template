-- 0001_init_starter.sql
-- Starter schema for nextjs-starter-template with Row Level Security & Realtime enabled

CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  is_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Explicit RLS Policies for starter demonstration and development
DROP POLICY IF EXISTS "Allow public and authenticated read access" ON public.todos;
CREATE POLICY "Allow public and authenticated read access"
  ON public.todos
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public and authenticated insert access" ON public.todos;
CREATE POLICY "Allow public and authenticated insert access"
  ON public.todos
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public and authenticated update access" ON public.todos;
CREATE POLICY "Allow public and authenticated update access"
  ON public.todos
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public and authenticated delete access" ON public.todos;
CREATE POLICY "Allow public and authenticated delete access"
  ON public.todos
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Enable Supabase Realtime replication on public.todos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'todos'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;
  END IF;
END $$;
