'use client'

import * as React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseStatusResult } from '@/lib/supabase/migrations-status'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Database,
  FileCode2,
  Globe,
  Key,
  Plus,
  Radio,
  RefreshCw,
  Terminal,
  Trash2,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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

  const getChannelBadgeVariant = (
    chStatus: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (chStatus) {
      case 'SUBSCRIBED':
        return 'default'
      case 'CONNECTING':
        return 'secondary'
      case 'UNCONFIGURED':
        return 'outline'
      default:
        return 'destructive'
    }
  }

  const activeChannelStatus = !status?.isConfigured
    ? 'UNCONFIGURED'
    : channelStatus

  return (
    <div className="bg-background text-foreground min-h-screen py-10 font-sans">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 sm:px-6">
        {/* Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ArrowLeft className="size-4" />
            <span>Back to Home</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStatus}
            disabled={loadingStatus}
          >
            <RefreshCw
              className={`size-3.5 ${loadingStatus ? 'animate-spin' : ''}`}
            />
            <span>Refresh Status</span>
          </Button>
        </div>

        {/* Page Title & Summary */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Supabase SSR + Realtime</Badge>
            <Badge variant="outline">Diagnostic Inspector</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Supabase Diagnostics &amp; Realtime Test
          </h1>
          <p className="text-muted-foreground text-sm">
            Verify database credentials, local-vs-remote migration sync status,
            and live WebSocket replication on{' '}
            <Badge variant="outline" className="font-mono text-[11px]">
              public.todos
            </Badge>
            .
          </p>
        </div>

        <Separator />

        {/* 1. Environment Credentials Card */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between gap-2">
              <div className="bg-muted/50 flex size-9 items-center justify-center rounded-lg border">
                <Key className="text-primary size-4" />
              </div>
              <Badge
                variant={status?.isConfigured ? 'default' : 'secondary'}
                className="shrink-0"
              >
                {status?.isConfigured ? (
                  <>
                    <CheckCircle2 className="size-3" />
                    <span>Configured</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="size-3" />
                    <span>Missing or Default</span>
                  </>
                )}
              </Badge>
            </div>
            <CardTitle className="pt-3 text-base leading-snug">
              1. Environment Credentials
            </CardTitle>
            <CardDescription className="text-xs">
              Masked environment variables read from{' '}
              <code className="font-mono">.env.local</code> without exposing raw
              keys.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 pt-2">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Card size="sm" className="flex h-full flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-muted/50 flex size-8 items-center justify-center rounded-lg border">
                      <Globe className="text-muted-foreground size-4" />
                    </div>
                    <Badge variant="outline" className="shrink-0 font-mono">
                      Project URL
                    </Badge>
                  </div>
                  <CardTitle className="pt-2 font-mono text-xs leading-snug">
                    NEXT_PUBLIC_SUPABASE_URL
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <Badge
                    variant="secondary"
                    className="max-w-full truncate font-mono text-xs"
                  >
                    {status?.maskedUrl || 'Not provided'}
                  </Badge>
                </CardContent>
              </Card>

              <Card size="sm" className="flex h-full flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-muted/50 flex size-8 items-center justify-center rounded-lg border">
                      <Key className="text-muted-foreground size-4" />
                    </div>
                    <Badge variant="outline" className="shrink-0 font-mono">
                      Publishable Key
                    </Badge>
                  </div>
                  <CardTitle className="pt-2 font-mono text-xs leading-snug">
                    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <Badge
                    variant="secondary"
                    className="max-w-full truncate font-mono text-xs"
                  >
                    {status?.maskedKey || 'Not provided'}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {!status?.isConfigured && (
              <Alert>
                <AlertCircle className="size-4" />
                <AlertTitle>How to configure Supabase locally</AlertTitle>
                <AlertDescription>
                  Copy <code className="font-mono">.env.example</code> to{' '}
                  <code className="font-mono">.env.local</code>, paste your
                  project URL and publishable key from{' '}
                  <strong>Supabase Dashboard → Project Settings → API</strong>,
                  then restart <code className="font-mono">npm run dev</code>.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* 2. Database Migrations Status Card */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between gap-2">
              <div className="bg-muted/50 flex size-9 items-center justify-center rounded-lg border">
                <Database className="text-primary size-4" />
              </div>
              <Badge variant="outline" className="shrink-0">
                {status?.localMigrations.length || 0} local migration file(s)
              </Badge>
            </div>
            <CardTitle className="pt-3 text-base leading-snug">
              2. Database Migrations Status
            </CardTitle>
            <CardDescription className="text-xs">
              Compares numbered SQL files in{' '}
              <code className="font-mono">supabase/migrations/</code> against
              the remote project schema.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 pt-2">
            {status?.localMigrations && status.localMigrations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Migration File</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Sync Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {status.migrationDiff.map((item) => (
                    <TableRow key={item.filename}>
                      <TableCell className="font-mono text-xs font-medium">
                        <span className="inline-flex items-center gap-2">
                          <FileCode2 className="text-muted-foreground size-3.5 shrink-0" />
                          {item.filename}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {item.version}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs capitalize">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            item.status === 'APPLIED' ? 'default' : 'secondary'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert>
                <FileCode2 className="size-4" />
                <AlertTitle>No local migrations found</AlertTitle>
                <AlertDescription>
                  Add numbered SQL files in{' '}
                  <code className="font-mono">supabase/migrations/</code> to
                  track schema changes.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-muted-foreground inline-flex items-center gap-2 text-xs">
              <Terminal className="size-3.5 shrink-0" />
              <span>
                Push pending migrations via Supabase MCP or CLI command:
              </span>
            </span>
            <Badge variant="secondary" className="font-mono text-xs">
              npx supabase db push
            </Badge>
          </CardFooter>
        </Card>

        {/* 3. Live Supabase Realtime Subscription Card */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="bg-muted/50 flex size-9 items-center justify-center rounded-lg border">
                <Radio className="text-primary size-4" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={getChannelBadgeVariant(activeChannelStatus)}
                  className="shrink-0"
                >
                  {activeChannelStatus}
                </Badge>
                <Button
                  size="sm"
                  onClick={handleInsertTestTodo}
                  disabled={isInserting || !status?.isConfigured}
                >
                  <Plus className="size-3.5" />
                  <span>
                    {isInserting ? 'Inserting...' : 'Insert Test Record'}
                  </span>
                </Button>
              </div>
            </div>
            <CardTitle className="pt-3 text-base leading-snug">
              3. Live Supabase Realtime Subscription
            </CardTitle>
            <CardDescription className="text-xs">
              Subscribed to{' '}
              <Badge variant="outline" className="font-mono text-[11px]">
                postgres_changes
              </Badge>{' '}
              events on table{' '}
              <Badge variant="outline" className="font-mono text-[11px]">
                public.{status?.realtimeTable || 'todos'}
              </Badge>
              .
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 pt-2">
            {actionMessage && (
              <Alert>
                <Terminal className="size-4" />
                <AlertTitle>Realtime Action</AlertTitle>
                <AlertDescription>{actionMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Live Event Stream</span>
                <Badge variant="outline" className="font-mono">
                  {realtimeEvents.length} events
                </Badge>
              </div>
              {realtimeEvents.length > 0 && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setRealtimeEvents([])}
                >
                  <Trash2 className="size-3" />
                  <span>Clear stream</span>
                </Button>
              )}
            </div>

            {realtimeEvents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Payload</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {realtimeEvents.map((evt) => (
                    <TableRow key={evt.id}>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {evt.eventType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">
                        {evt.timestamp}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <code className="bg-muted rounded px-1.5 py-0.5">
                          {JSON.stringify(evt.payload)}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert>
                <Radio className="size-4" />
                <AlertTitle>Waiting for live WebSocket events</AlertTitle>
                <AlertDescription>
                  No live events received yet. Connect your Supabase project in{' '}
                  <code className="font-mono">.env.local</code> and click{' '}
                  <strong>Insert Test Record</strong> to verify WebSocket
                  replication.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
