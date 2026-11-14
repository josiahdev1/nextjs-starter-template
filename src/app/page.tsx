import Image from 'next/image'
import Link from 'next/link'
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Database,
  FileCode2,
  FolderGit2,
  Layers,
  Palette,
  ShieldCheck,
  Sparkles,
  Terminal,
  Type,
  Workflow,
} from 'lucide-react'
import packageJson from '../../package.json'
import { CopyCommand } from '@/components/copy-command'
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

function NextjsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 180" fill="none">
      <mask
        id="next-mask"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="180"
        height="180"
      >
        <circle cx="90" cy="90" r="90" fill="white" />
        <path
          d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
          fill="black"
        />
        <rect x="115" y="54" width="12" height="72" fill="black" />
      </mask>
      <circle
        cx="90"
        cy="90"
        r="90"
        fill="currentColor"
        mask="url(#next-mask)"
      />
    </svg>
  )
}

function ReactIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-11.5 -10.23174 23 20.46348"
      fill="none"
    >
      <circle cx="0" cy="0" r="2.05" fill="#58c4dc" />
      <g stroke="#58c4dc" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  )
}

function TypeScriptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <path
        d="M4.5 9h5v1.6H7.8V17H6.2v-6.4H4.5V9zm8 4.7c.5.5 1.2.8 2 .8.7 0 1.2-.2 1.5-.4.3-.3.5-.6.5-1 0-.4-.2-.7-.4-.9-.3-.2-.8-.4-1.5-.6l-.7-.2c-1-.3-1.7-.7-2.1-1.2-.4-.5-.6-1.1-.6-1.8 0-.9.4-1.7 1.1-2.2.8-.6 1.8-.9 3-.9 1 0 1.8.2 2.6.6l-.6 1.4c-.6-.4-1.3-.5-2-.5-.6 0-1.1.2-1.4.4-.3.2-.4.5-.4.8 0 .3.1.5.3.7.2.2.7.4 1.4.5l.7.2c1.1.3 1.8.8 2.2 1.3.4.5.7 1.2.7 2 0 1-.4 1.8-1.1 2.4-.8.6-1.8.9-3.1.9-1.2 0-2.2-.3-3-.9l.6-1.5z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function TailwindIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
    </svg>
  )
}

function ShadcnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="none">
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        stroke="currentColor"
        strokeWidth="28"
        strokeLinecap="round"
      />
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        stroke="currentColor"
        strokeWidth="28"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SupabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 109 113" fill="none">
      <path
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
        fill="#3ECF8E"
      />
      <path
        d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
        fill="#3ECF8E"
      />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  )
}

const features = [
  {
    title: 'Next.js 16.4.6',
    subtitle: 'App Router & Turbopack',
    icon: <NextjsIcon className="size-4 text-black dark:text-white" />,
  },
  {
    title: 'React 19.3.1',
    subtitle: 'React Compiler & RSC',
    icon: <ReactIcon className="size-4.5 text-cyan-500" />,
  },
  {
    title: 'Tailwind CSS v4',
    subtitle: 'OKLCH & canonical tokens',
    icon: <TailwindIcon className="size-4.5 text-cyan-500" />,
  },
  {
    title: 'TypeScript 5',
    subtitle: 'Strict type safety',
    icon: <TypeScriptIcon className="size-4.5 rounded-xs" />,
  },
  {
    title: 'Shadcn UI (50+)',
    subtitle: 'Base UI v4.23 components',
    icon: <ShadcnIcon className="size-4 text-black dark:text-white" />,
  },
  {
    title: 'Supabase Ready',
    subtitle: 'SSR, RLS & Realtime',
    icon: <SupabaseIcon className="size-4" />,
  },
  {
    title: '5 Agent Skills',
    subtitle: 'Pre-installed in .agent/',
    icon: <Bot className="size-4 text-indigo-500" />,
  },
  {
    title: 'CI/CD & Quality',
    subtitle: 'ESLint 9, Prettier & Tests',
    icon: <ShieldCheck className="size-4 text-emerald-500" />,
  },
  {
    title: 'Poppins Font',
    subtitle: 'Google sans-serif',
    icon: <Type className="text-primary size-4" />,
  },
]

const whatsNewItems = [
  {
    version: 'Next.js 16.4.6 + Vercel Observability',
    detail:
      'Next.js 16 proxy.ts, ESLint 9 CLI (eslint .), and pre-wired @vercel/speed-insights & @vercel/analytics in layout.tsx.',
  },
  {
    version: 'Supabase SSR v0.12 + JS v2.119',
    detail:
      'Pre-wired browser/server clients, session refresh proxy, RLS + Realtime SQL migrations, and live /supabase-test diagnostics.',
  },
  {
    version: '5 AI Agent Skills + CLAUDE.md',
    detail:
      'Built-in skills in .agent/skills/ for Supabase, Postgres Best Practices, Realtime, Security Audit, and Engineering Standards.',
  },
  {
    version: 'Always-On /ticket Rule & dev Branch',
    detail:
      'Automatic ticket creation (.agent/rules/ticket-workflow.md + /ticket), automated dev branch push workflow, and GitHub Actions CI.',
  },
]

const readmeHighlights = [
  {
    label: 'Quick Start & Scripts',
    description:
      'Run dev, build, lint, typecheck, format, and automated tsx tests with zero initial config.',
  },
  {
    label: 'Project Structure & Shadcn CLI',
    description:
      'Full directory map (src/, supabase/, tickets/, .agent/skills/) and safe shadcn component commands.',
  },
  {
    label: 'AI Agent Prompt & Troubleshooting',
    description:
      'Copy-paste starter prompts for AI coding agents plus solutions for common Next.js 16 and CI issues.',
  },
]

const starterStackCards = [
  {
    title: `Next.js ${packageJson.dependencies.next} & React ${packageJson.dependencies.react}`,
    badge: 'App Router + RSC',
    icon: <Layers className="text-primary size-4" />,
    description:
      'App Router with React Compiler 1.0, Turbopack dev server, strict TypeScript 5 (@/* alias to src/*), and Next.js 16 src/proxy.ts session convention.',
    files: ['src/app/layout.tsx', 'src/proxy.ts', 'tsconfig.json'],
  },
  {
    title: 'Tailwind CSS v4 & shadcn/ui',
    badge: '56 UI Components',
    icon: <Palette className="size-4 text-cyan-500" />,
    description:
      'CSS-first @import tokens with OKLCH light/dark palettes in globals.css, tw-animate-css, Poppins Google font (--font-sans), and 56 Base UI (base-nova) components.',
    files: ['src/app/globals.css', 'src/components/ui/*', 'components.json'],
  },
  {
    title: 'AI-Agent Ticket Workflow & Rules',
    badge: 'Always-On /ticket',
    icon: <Bot className="size-4 text-indigo-500" />,
    description:
      'Automatic ticket-first rules across Antigravity, Claude Code, Cursor, and Copilot with 6 domain skills for Frontend Design, Supabase, Postgres, Realtime, Security, and Engineering.',
    files: [
      'AGENTS.md',
      'CLAUDE.md',
      '.agent/rules/ticket-workflow.md',
      '.agent/workflows/ticket.md',
      '.agent/skills/*',
    ],
  },
  {
    title: 'Optional Supabase + Realtime Diagnostics',
    badge: 'RLS + WebSockets',
    icon: <Database className="size-4 text-emerald-500" />,
    description:
      'Pre-wired @supabase/ssr v0.12.7 & @supabase/supabase-js v2.109.0 browser/server/proxy clients, RLS-enabled SQL migration, and live status inspector.',
    files: [
      'src/lib/supabase/client.ts',
      'src/lib/supabase/server.ts',
      'src/lib/supabase/proxy.ts',
      'supabase/migrations/0001_init_starter.sql',
      '/supabase-test',
    ],
  },
  {
    title: 'Code Quality & CI/CD Pipelines',
    badge: 'ESLint 9 + GitHub CI',
    icon: <Workflow className="size-4 text-amber-500" />,
    description:
      'ESLint 9 flat config (eslint .), Prettier 3.9 with Tailwind class sorting, automated Node tsx unit tests, and 3 GitHub Actions workflows.',
    files: [
      'eslint.config.mjs',
      '.github/workflows/ci.yml',
      '.github/workflows/update-shadcn.yml',
      'tests/supabase.test.ts',
    ],
  },
  {
    title: 'Vercel Ready & Observability',
    badge: 'Analytics + Vitals',
    icon: <Activity className="size-4 text-sky-500" />,
    description:
      'Pre-wired @vercel/speed-insights v2.1.0 and @vercel/analytics v2.0.1 in RootLayout with zero-config production activation once deployed.',
    files: ['src/app/layout.tsx', 'package.json'],
  },
]

const starterInventoryStats = [
  {
    label: 'Template Package',
    badge: `v${packageJson.version}`,
    value: packageJson.name,
    detail: `${Object.keys(packageJson.dependencies).length} runtime + ${Object.keys(packageJson.devDependencies).length} dev packages`,
  },
  {
    label: 'UI Component Library',
    badge: 'base-nova',
    value: '56 Pre-installed',
    detail: 'shadcn/ui (@base-ui/react ^1.9.0) in src/components/ui/',
  },
  {
    label: 'Bundled Agent Skills',
    badge: '.agent/skills/',
    value: '6 Domain Skills',
    detail:
      'frontend-design, supabase, supabase-postgres-best-practices, supabase-realtime-data, security-audit, engineering-skills',
  },
  {
    label: 'App Routes & API',
    badge: 'App Router',
    value: '3 Active Endpoints',
    detail:
      '/ (Landing), /supabase-test (Diagnostics UI), /api/supabase-status (JSON)',
  },
]

const scriptDescriptions: Record<string, string> = {
  dev: 'Start Next.js 16 Turbopack dev server on http://localhost:3000',
  build: 'Create an optimized production build',
  start: 'Run the compiled production server',
  lint: 'Run ESLint 9 flat config across the repository (eslint .)',
  'lint:fix': 'Auto-fix ESLint issues across all files',
  typecheck: 'Run strict TypeScript compiler check (tsc --noEmit)',
  test: 'Execute automated test suite via tsx --test',
  format: 'Format codebase with Prettier & Tailwind sorting plugin',
  'format:check': 'Verify formatting in CI & pre-commit quality gates',
}

const starterScripts = Object.entries(packageJson.scripts).map(
  ([name, rawCmd]) => ({
    name,
    command: `npm run ${name}`,
    rawCmd,
    description: scriptDescriptions[name] ?? `Run ${rawCmd}`,
  })
)

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-1 flex-col items-center justify-between gap-10 bg-white px-6 py-12 sm:items-start sm:px-14 sm:py-16 dark:bg-black">
        {/* Top bar with Next.js logo and GitHub repo badge */}
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              className="h-5 w-25 dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            <span className="rounded-full border border-black/10 bg-black/4 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-zinc-700 dark:border-white/15 dark:bg-white/8 dark:text-zinc-200">
              v2.0 Starter Pack • Next.js 16.4.6
            </span>
          </div>

          <a
            href="https://github.com/josiahdev1/nextjs-starter-template"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/2 px-3.5 py-1.5 text-xs font-medium whitespace-nowrap text-zinc-700 transition-colors hover:border-black/20 hover:bg-black/6 dark:border-white/15 dark:bg-white/6 dark:text-zinc-200 dark:hover:border-white/25 dark:hover:bg-white/10"
          >
            <GitHubIcon className="size-3.5" />
            <span>josiahdev1/nextjs-starter-template</span>
            <ArrowUpRight className="size-3.5 text-zinc-400" />
          </a>
        </div>

        {/* Hero & Content */}
        <div className="flex w-full flex-col items-center gap-8 text-center sm:items-start sm:text-left">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl leading-10 font-semibold tracking-tight text-black sm:text-4xl dark:text-zinc-50">
              Starter Template
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Get started by editing{' '}
              <code className="rounded bg-black/6 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10 dark:text-zinc-200">
                src/app/page.tsx
              </code>{' '}
              or read{' '}
              <code className="rounded bg-black/6 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10 dark:text-zinc-200">
                README.md
              </code>{' '}
              and{' '}
              <code className="rounded bg-black/6 px-1.5 py-0.5 font-mono text-sm dark:bg-white/10 dark:text-zinc-200">
                AGENTS.md
              </code>{' '}
              to build with AI agents and optional Supabase.
            </p>
          </div>

          {/* 1. What's Included Grid */}
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                What&apos;s Included
              </p>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                9 core modules pre-configured
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">
              {features.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-xl border border-black/8 bg-black/2 p-2.5 text-left transition-colors hover:border-black/15 hover:bg-black/4 dark:border-white/12 dark:bg-white/4 dark:hover:border-white/20 dark:hover:bg-white/8"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-black/6 bg-white shadow-2xs dark:border-white/10 dark:bg-zinc-900">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-black dark:text-zinc-100">
                      {item.title}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Separate Section: What's New in This Starter Pack (Versions & Upgrades) */}
          <div className="flex w-full flex-col gap-3 rounded-2xl border border-black/8 bg-black/2 p-5 text-left dark:border-white/12 dark:bg-white/4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/6 pb-3 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-black dark:text-zinc-100">
                  What&apos;s New in This Starter Pack
                </h2>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-emerald-700 dark:text-emerald-400">
                Latest Release • v2.0
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
              {whatsNewItems.map((item) => (
                <div
                  key={item.version}
                  className="flex flex-col gap-1 rounded-xl border border-black/6 bg-white p-3.5 dark:border-white/8 dark:bg-zinc-950/70"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    <span className="text-xs font-semibold text-black dark:text-zinc-100">
                      {item.version}
                    </span>
                  </div>
                  <p className="pl-5.5 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Separate Section: Read README.md Card & Supabase Quick Start Card */}
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            {/* Dedicated Card: Read README.md */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-black/8 bg-black/2 p-5 text-left dark:border-white/12 dark:bg-white/4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-black dark:text-zinc-100">
                      Read README.md Guide
                    </h2>
                  </div>
                  <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-indigo-600 dark:text-indigo-400">
                    Documentation
                  </span>
                </div>

                <ul className="flex flex-col gap-2.5 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                  {readmeHighlights.map((item) => (
                    <li key={item.label} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-indigo-400" />
                      <span>
                        <strong className="font-semibold text-black dark:text-zinc-200">
                          {item.label}:
                        </strong>{' '}
                        {item.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="https://github.com/josiahdev1/nextjs-starter-template#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap text-black transition-opacity hover:opacity-75 dark:text-white"
              >
                <FileCode2 className="size-3.5" />
                <span>Open README.md on GitHub</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>

            {/* Dedicated Card: Supabase & Realtime Quick Start */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-black/8 bg-black/2 p-5 text-left dark:border-white/12 dark:bg-white/4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="size-4 text-emerald-400" />
                    <h2 className="text-sm font-semibold text-black dark:text-zinc-100">
                      Supabase &amp; Realtime Setup
                    </h2>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-cyan-600 dark:text-cyan-400">
                    Optional Backend
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                  <p>
                    Runs cleanly without credentials. To connect your Supabase
                    project:
                  </p>
                  <div className="rounded-xl border border-black/8 bg-white p-3 font-mono text-xs text-zinc-800 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
                    <div>cp .env.example .env.local</div>
                    <div className="text-zinc-400">
                      # Add URL &amp; publishable key, then verify:
                    </div>
                    <div>npm run dev &amp;&amp; open /supabase-test</div>
                  </div>
                </div>
              </div>

              <Link
                href="/supabase-test"
                className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap text-emerald-600 transition-opacity hover:opacity-75 dark:text-emerald-400"
              >
                <SupabaseIcon className="size-3.5" />
                <span>Open /supabase-test Diagnostics &amp; Realtime</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA Actions */}
        <div className="flex w-full flex-col flex-wrap gap-3 text-sm font-medium sm:flex-row sm:items-center">
          <a
            className="bg-foreground text-background flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 whitespace-nowrap transition-colors hover:bg-zinc-800 sm:w-auto dark:hover:bg-zinc-200"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="h-3.5 w-4 dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={14}
            />
            Deploy Now
          </a>

          <a
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/10 px-5 whitespace-nowrap transition-colors hover:bg-black/4 sm:w-auto dark:border-white/15 dark:hover:bg-white/8"
            href="https://github.com/josiahdev1/nextjs-starter-template"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon className="size-4" />
            GitHub Repo
          </a>

          <a
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/10 px-5 whitespace-nowrap transition-colors hover:bg-black/4 sm:w-auto dark:border-white/15 dark:hover:bg-white/8"
            href="https://github.com/josiahdev1/nextjs-starter-template#readme"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BookOpen className="size-4" />
            Read README.md
          </a>

          <Link
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/10 px-5 whitespace-nowrap transition-colors hover:bg-black/4 sm:w-auto dark:border-white/15 dark:hover:bg-white/8"
            href="/supabase-test"
          >
            <SupabaseIcon className="size-4" />
            Supabase Diagnostics
          </Link>

          <a
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/10 px-5 whitespace-nowrap transition-colors hover:bg-black/4 sm:w-auto dark:border-white/15 dark:hover:bg-white/8"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>

      {/* Starter-Pack Deep Showcase Area (auto-synced while data-starter-showcase="true" is present) */}
      <section
        data-starter-showcase="true"
        aria-label="Starter Stack and Developer Quick Reference"
        className="w-full max-w-5xl px-6 pb-16 sm:px-14 sm:pb-24"
      >
        <Card className="p-2 sm:p-6">
          <CardContent className="flex flex-col gap-10 pt-4">
            {/* Section 1: Starter Stack & Features Grid */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">Starter Architecture</Badge>
                    <Badge variant="outline">
                      Next.js {packageJson.dependencies.next} • React{' '}
                      {packageJson.dependencies.react}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Starter Stack &amp; Features Grid
                  </h2>
                  <p className="text-muted-foreground max-w-2xl text-sm">
                    Every layer below is pre-installed and verified in this
                    repository—from App Router conventions and OKLCH design
                    tokens to AI agent workflows and optional Supabase
                    diagnostics.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/supabase-test" />}
                >
                  <SupabaseIcon className="size-3.5" />
                  <span>Explore /supabase-test</span>
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {starterStackCards.map((card) => (
                  <Card key={card.title} className="flex h-full flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <div className="bg-muted/50 flex size-9 items-center justify-center rounded-lg border">
                          {card.icon}
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {card.badge}
                        </Badge>
                      </div>
                      <CardTitle className="pt-3 text-base leading-snug">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <CardDescription className="text-xs leading-relaxed">
                        {card.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-1.5 border-t-0 bg-transparent pt-0">
                      {card.files.map((filePath) => (
                        <Badge
                          key={filePath}
                          variant="outline"
                          className="font-mono text-[11px]"
                        >
                          {filePath}
                        </Badge>
                      ))}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Section 2: What's Included & Quick Exploration Strip */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">Developer Quick Reference</Badge>
                    <Badge variant="outline">Server-Read Inventory</Badge>
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    What&apos;s Included &amp; Quick Exploration Strip
                  </h2>
                  <p className="text-muted-foreground max-w-2xl text-sm">
                    Live repository inventory read directly from{' '}
                    <Badge variant="outline" className="font-mono text-[11px]">
                      package.json
                    </Badge>
                    , pre-configured routes, and one-click CLI scripts.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/supabase-test" />}
                  >
                    <SupabaseIcon className="size-3.5" />
                    <span>Open /supabase-test</span>
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={
                      <a
                        href="/api/supabase-status"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <FolderGit2 className="size-3.5" />
                    <span>/api/supabase-status</span>
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Live Repository Inventory Strip */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {starterInventoryStats.map((stat) => (
                  <Card key={stat.label} className="flex h-full flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-xs font-medium">
                          {stat.label}
                        </span>
                        <Badge variant="outline" className="shrink-0 font-mono">
                          {stat.badge}
                        </Badge>
                      </div>
                      <CardTitle className="pt-2 text-base leading-snug">
                        {stat.value}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <CardDescription className="text-xs leading-relaxed">
                        {stat.detail}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Package.json Scripts + Interactive Exploration */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-muted/50 flex size-9 items-center justify-center rounded-lg border">
                        <Terminal className="text-primary size-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base leading-snug">
                          Key Scripts from package.json
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Standardized commands for development, ESLint 9
                          flat-config linting, TypeScript checking, unit
                          testing, and production builds.
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {starterScripts.length} NPM Scripts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-2">
                  {starterScripts.map((script) => (
                    <Card
                      key={script.name}
                      size="sm"
                      className="bg-muted/30 flex-row items-center justify-between gap-3 px-3.5 py-2.5"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs"
                          >
                            {script.command}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-muted-foreground font-mono text-[11px]"
                          >
                            {script.rawCmd}
                          </Badge>
                        </div>
                        <CardDescription className="truncate text-xs">
                          {script.description}
                        </CardDescription>
                      </div>
                      <CopyCommand
                        command={script.command}
                        label={script.name}
                      />
                    </Card>
                  ))}
                </CardContent>
                <CardFooter className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <CardDescription className="text-xs">
                    Need to test database credentials, RLS migrations, or live
                    WebSocket replication?
                  </CardDescription>
                  <Button
                    variant="secondary"
                    size="xs"
                    nativeButton={false}
                    render={<Link href="/supabase-test" />}
                  >
                    <SupabaseIcon className="size-3" />
                    <span>Inspect /supabase-test Diagnostics</span>
                    <ArrowUpRight className="size-3" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
