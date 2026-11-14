import fs from 'fs'
import path from 'path'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface MigrationFile {
  filename: string
  version: string
  name: string
}

export interface MigrationDiffItem {
  filename: string
  version: string
  name: string
  status: 'APPLIED' | 'PENDING PUSH'
}

export interface SupabaseStatusResult {
  isConfigured: boolean
  maskedUrl: string | null
  maskedKey: string | null
  localMigrations: MigrationFile[]
  appliedVersions: string[]
  migrationDiff: MigrationDiffItem[]
  realtimeTable: string
  details?: string
}

/**
 * Parses a migration filename in format `NNNN_<slug>.sql` or `YYYYMMDDHHMMSS_<slug>.sql`
 */
export function parseMigrationFilename(filename: string): MigrationFile | null {
  if (!filename.endsWith('.sql')) return null
  const base = filename.slice(0, -4)
  const separatorIndex = base.indexOf('_')
  if (separatorIndex === -1) {
    return {
      filename,
      version: base,
      name: base,
    }
  }
  const version = base.slice(0, separatorIndex)
  const name = base.slice(separatorIndex + 1).replace(/_/g, ' ')
  return {
    filename,
    version,
    name,
  }
}

/**
 * Reads local migration files from the `supabase/migrations` directory
 */
export function getLocalMigrations(migrationsDir?: string): MigrationFile[] {
  const dir =
    migrationsDir || path.join(process.cwd(), 'supabase', 'migrations')
  if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
    return []
  }
  try {
    const files = fs.readdirSync(/*turbopackIgnore: true*/ dir)
    return files
      .filter((f) => f.endsWith('.sql'))
      .sort()
      .map(parseMigrationFilename)
      .filter((m): m is MigrationFile => m !== null)
  } catch {
    return []
  }
}

/**
 * Masks a sensitive string for diagnostic display (never printing secrets in full)
 */
export function maskCredential(
  val: string | undefined | null,
  keepChars = 6
): string | null {
  if (!val) return null
  if (
    val.includes('<your-project-ref>') ||
    val.includes('<your-publishable-key>')
  ) {
    return val // show unconfigured placeholder as is
  }
  if (val.length <= keepChars * 2) {
    return `${val.slice(0, 3)}...${val.slice(-3)}`
  }
  return `${val.slice(0, keepChars)}...${val.slice(-keepChars)}`
}

/**
 * Calculates diff between local migration files and applied versions in Supabase
 */
export function computeMigrationDiff(
  localMigrations: MigrationFile[],
  appliedVersions: string[]
): MigrationDiffItem[] {
  const appliedSet = new Set(appliedVersions)
  return localMigrations.map((m) => ({
    filename: m.filename,
    version: m.version,
    name: m.name,
    status: appliedSet.has(m.version) ? 'APPLIED' : 'PENDING PUSH',
  }))
}

/**
 * Checks connection and migration synchronization status against Supabase
 */
export async function getSupabaseDiagnosticStatus(
  client?: SupabaseClient
): Promise<SupabaseStatusResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const isConfigured = Boolean(
    url &&
    key &&
    !url.includes('<your-project-ref>') &&
    !url.includes('<SUPABASE_PROJECT_REF>')
  )

  const localMigrations = getLocalMigrations()
  const appliedVersions: string[] = []
  let details = ''

  if (isConfigured && client) {
    try {
      // 1. Attempt to query schema_migrations table if accessible
      const { data: migrationData, error: migrationError } = await client
        .from('schema_migrations')
        .select('version')

      if (!migrationError && Array.isArray(migrationData)) {
        migrationData.forEach((row: { version?: string }) => {
          if (row.version) appliedVersions.push(String(row.version))
        })
      } else {
        // 2. Fallback check: check if the initial starter table `todos` exists
        const { error: tableError } = await client
          .from('todos')
          .select('id')
          .limit(1)

        if (!tableError) {
          // Table exists! At least initial migration 0001 is applied
          if (localMigrations.length > 0) {
            appliedVersions.push(localMigrations[0].version)
          }
          details = 'Connected to remote database. Table `todos` is active.'
        } else {
          details =
            tableError.message ||
            'Database reachable, but `todos` table not found (migrations pending).'
        }
      }
    } catch (err) {
      details =
        err instanceof Error ? err.message : 'Failed to query Supabase schema'
    }
  } else {
    details =
      'Supabase credentials unconfigured. Create .env.local from .env.example to connect.'
  }

  const migrationDiff = computeMigrationDiff(localMigrations, appliedVersions)

  return {
    isConfigured,
    maskedUrl: maskCredential(url, 14),
    maskedKey: maskCredential(key, 8),
    localMigrations,
    appliedVersions,
    migrationDiff,
    realtimeTable: 'todos',
    details,
  }
}
