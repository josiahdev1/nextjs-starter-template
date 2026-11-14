import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseDiagnosticStatus } from '@/lib/supabase/migrations-status'

export async function GET() {
  try {
    const supabase = await createClient()
    const status = await getSupabaseDiagnosticStatus(supabase)
    return NextResponse.json(status)
  } catch (err) {
    return NextResponse.json(
      {
        isConfigured: false,
        maskedUrl: null,
        maskedKey: null,
        localMigrations: [],
        appliedVersions: [],
        migrationDiff: [],
        realtimeTable: 'todos',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 200 }
    )
  }
}
