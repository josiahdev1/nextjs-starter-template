'use client'

import * as React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseStatusResult } from '@/lib/supabase/migrations-status'
import {
  CheckCircle2,
  AlertCircle,
  Database,
  Radio,
  RefreshCw,
  Plus,
  Terminal,
  ArrowLeft,
  Key,
  Globe,
  FileCode2,
} from 'lucide-react'

interface RealtimeEvent {
  id: string
  timestamp: string
  eventType: string
  payload: Record<string, unknown>
}

export default function SupabaseTestPage() {
  const [status, setStatus] = React.useState<SupabaseStatusResult | null>(null)
  const [loadingStatus, setLoadingStatus] = React.useState(true)
  const [channelStatus, setChannelStatus] =
    React.useState<string>('DISCONNECTED')
  const [realtimeEvents, setRealtimeEvents] = React.useState<RealtimeEvent[]>(
    []
  )
  const [isInserting, setIsInserting] = React.useState(false)
  const [actionMessage, setActionMessage] = React.useState<string | null>(null)

  const supabase = React.useMemo(() => createClient(), [])

  const fetchStatus = React.useCallback(async () => {
    setLoadingStatus(true)
    try {
      const res = await fetch('/api/supabase-status')
      const data: SupabaseStatusResult = await res.json()
      setStatus(data)
    } catch {
      setStatus({
        isConfigured: false,
        maskedUrl: null,
        maskedKey: null,
        localMigrations: [],
        appliedVersions: [],
        migrationDiff: [],
        realtimeTable: 'todos',
        details: 'Failed to query status API.',
      })
    } finally {
      setLoadingStatus(false)
    }
  }, [])

  React.useEffect(() => {
    let ignore = false

    fetch('/api/supabase-status')
      .then((res) => res.json())
      .then((data: SupabaseStatusResult) => {
        if (!ignore) {
          setStatus(data)
          setLoadingStatus(false)
        }
      })
      .catch(() => {
        if (!ignore) {
          setStatus({
            isConfigured: false,
            maskedUrl: null,
            maskedKey: null,
            localMigrations: [],
            appliedVersions: [],
            migrationDiff: [],
            realtimeTable: 'todos',
            details: 'Failed to query status API.',
          })
          setLoadingStatus(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  // Setup Realtime subscription
  React.useEffect(() => {
    if (!status?.isConfigured) {
      return
    }

    const timer = setTimeout(() => {
      setChannelStatus('CONNECTING')
    }, 0)

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
        },
        (payload) => {
          const newEvent: RealtimeEvent = {
            id: String(Date.now() + Math.random()),
            timestamp: new Date().toLocaleTimeString(),
            eventType: payload.eventType,
            payload: (payload.new || payload.old || {}) as Record<
              string,
              unknown
            >,
          }
          setRealtimeEvents((prev) => [newEvent, ...prev.slice(0, 49)])
        }
      )
      .subscribe((subStatus) => {
        setChannelStatus(subStatus)
      })

    return () => {
      clearTimeout(timer)
      supabase.removeChannel(channel)
    }
  }, [supabase, status?.isConfigured])

  const handleInsertTestTodo = async () => {
    if (!status?.isConfigured) {
      setActionMessage('Configure .env.local first before inserting records.')
      return
    }
    setIsInserting(true)
    setActionMessage(null)
    try {
      const testTitle = `Test Todo @ ${new Date().toLocaleTimeString()}`
      const { error } = await supabase.from('todos').insert([
        {
          title: testTitle,
          is_complete: false,
        },
      ])

      if (error) {
        setActionMessage(`Insert error: ${error.message}`)
      } else {
        setActionMessage('Record inserted! Check Realtime stream below.')
      }
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : 'Failed to insert test todo.'
      )
    } finally {
      setIsInserting(false)
    }
  }

  const getStatusBadge = (chStatus: string) => {
    switch (chStatus) {
      case 'SUBSCRIBED':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
      case 'CONNECTING':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400'
      case 'UNCONFIGURED':
        return 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400'
      default:
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400'
    }
  }

  const activeChannelStatus = !status?.isConfigured
    ? 'UNCONFIGURED'
    : channelStatus

  return (
    <div className="min-h-screen bg-zinc-50 py-10 font-sans text-zinc-900 transition-colors dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStatus}
              disabled={loadingStatus}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <RefreshCw
                className={`size-3.5 ${loadingStatus ? 'animate-spin' : ''}`}
              />
              Refresh Status
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Supabase Diagnostics & Realtime Test
            </h1>
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Verify database credentials, migration sync status, and live
            WebSocket subscriptions.
          </p>
        </div>

        {/* 1. Environment Status Card */}
        <div className="mb-6 rounded-2xl border border-black/8 bg-white p-6 shadow-2xs dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-black/6 pb-4 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <Key className="size-5 text-indigo-500" />
              <h2 className="text-base font-semibold">
                1. Environment Credentials
              </h2>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                status?.isConfigured
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}
            >
              {status?.isConfigured ? (
                <>
                  <CheckCircle2 className="size-3.5" /> Configured
                </>
              ) : (
                <>
                  <AlertCircle className="size-3.5" /> Missing or Default
                </>
              )}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex flex-col justify-between gap-1 rounded-xl bg-zinc-50 p-3 text-xs sm:flex-row sm:items-center dark:bg-zinc-800/60">
              <span className="flex items-center gap-2 font-mono text-zinc-500 dark:text-zinc-400">
                <Globe className="size-3.5" /> NEXT_PUBLIC_SUPABASE_URL
              </span>
              <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
                {status?.maskedUrl || 'Not provided'}
              </span>
            </div>

            <div className="flex flex-col justify-between gap-1 rounded-xl bg-zinc-50 p-3 text-xs sm:flex-row sm:items-center dark:bg-zinc-800/60">
              <span className="flex items-center gap-2 font-mono text-zinc-500 dark:text-zinc-400">
                <Key className="size-3.5" />{' '}
                NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
              </span>
              <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
                {status?.maskedKey || 'Not provided'}
              </span>
            </div>

            {!status?.isConfigured && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-800 dark:text-amber-200">
                <p className="mb-1 font-semibold">How to configure:</p>
                <ol className="list-inside list-decimal space-y-1">
                  <li>
                    Copy{' '}
                    <code className="rounded bg-black/6 px-1 dark:bg-white/10">
                      .env.example
                    </code>{' '}
                    to{' '}
                    <code className="rounded bg-black/6 px-1 dark:bg-white/10">
                      .env.local
                    </code>
                  </li>
                  <li>
                    Paste your project URL and publishable key from Supabase
                    Dashboard &gt; Project Settings &gt; API
                  </li>
                  <li>
                    Restart{' '}
                    <code className="rounded bg-black/6 px-1 dark:bg-white/10">
                      npm run dev
                    </code>{' '}
                    and refresh this page
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* 2. Migration Sync Status Card */}
        <div className="mb-6 rounded-2xl border border-black/8 bg-white p-6 shadow-2xs dark:border-white/10 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-black/6 pb-4 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <Database className="size-5 text-emerald-500" />
              <h2 className="text-base font-semibold">
                2. Database Migrations Status
              </h2>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {status?.localMigrations.length || 0} local migration file(s)
            </span>
          </div>

          <div className="mt-4">
            {status?.localMigrations && status.localMigrations.length > 0 ? (
              <div className="divide-y divide-black/6 overflow-hidden rounded-xl border border-black/8 dark:divide-white/10 dark:border-white/10">
                {status.migrationDiff.map((item) => (
                  <div
                    key={item.filename}
                    className="flex items-center justify-between bg-white p-3 text-xs dark:bg-zinc-900/60"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileCode2 className="size-4 text-zinc-400" />
                      <div>
                        <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                          {item.filename}
                        </span>
                        <p className="text-[11px] text-zinc-500 capitalize dark:text-zinc-400">
                          {item.name}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        item.status === 'APPLIED'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No migration files found in supabase/migrations/
              </p>
            )}

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-zinc-100 p-3 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <Terminal className="size-4 shrink-0 text-zinc-500" />
              <span>
                To push pending migrations: ask your AI agent to apply via
                Supabase MCP or run{' '}
                <code className="font-mono font-semibold text-black dark:text-white">
                  npx supabase db push
                </code>
              </span>
            </div>
          </div>
        </div>

        {/* 3. Live Realtime Connection & Subscription Card */}
        <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-2xs dark:border-white/10 dark:bg-zinc-900">
          <div className="flex flex-col gap-3 border-b border-black/6 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <Radio className="size-5 animate-pulse text-cyan-500" />
              <div>
                <h2 className="text-base font-semibold">
                  3. Live Supabase Realtime Subscription
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Subscribed to table:{' '}
                  <code className="font-mono font-medium">public.todos</code>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(
                  activeChannelStatus
                )}`}
              >
                <span className="size-2 animate-ping rounded-full bg-current" />
                {activeChannelStatus}
              </span>
              <button
                onClick={handleInsertTestTodo}
                disabled={isInserting || !status?.isConfigured}
                className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                <Plus className="size-3.5" />
                {isInserting ? 'Inserting...' : 'Insert Test Record'}
              </button>
            </div>
          </div>

          {actionMessage && (
            <div className="mt-4 rounded-xl bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {actionMessage}
            </div>
          )}

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Live Event Stream ({realtimeEvents.length} events)
              </span>
              {realtimeEvents.length > 0 && (
                <button
                  onClick={() => setRealtimeEvents([])}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  Clear stream
                </button>
              )}
            </div>

            {realtimeEvents.length > 0 ? (
              <div className="max-h-60 divide-y divide-black/6 overflow-y-auto rounded-xl border border-black/8 font-mono text-xs dark:divide-white/10 dark:border-white/10">
                {realtimeEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-zinc-50/50 p-3 dark:bg-zinc-950/40"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {evt.eventType}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {evt.timestamp}
                      </span>
                    </div>
                    <pre className="overflow-x-auto text-[11px] text-zinc-700 dark:text-zinc-300">
                      {JSON.stringify(evt.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-black/10 py-8 text-center dark:border-white/10">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  No live events received yet. Click &quot;Insert Test
                  Record&quot; to test WebSocket replication.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
