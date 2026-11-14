# Next.js + Supabase Enterprise Engine
### Production-Grade Architecture, Row-Level Security, Cloudflare Perimeter, & Zero-CLS Design System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2016-green.svg)](https://supabase.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-WAF%20%26%20Turnstile-orange.svg)](https://www.cloudflare.com/)
[![Security Audit](https://img.shields.io/badge/Audit%20Pipeline-Passing%20(100%25)-brightgreen.svg)](#single-command-security-audit)

---

## 1. Executive Summary

The **Next-Supabase Enterprise Engine** is an architectural framework and production boilerplate for building high-reliability, multi-tenant SaaS and enterprise web applications.

It provides a battle-tested blueprint for:
1. **Converting Legacy Monoliths**: Modernizing Laravel, Django, Express/Node, and CRA/Vite SPAs into a decoupled Next.js (App Router) + Supabase stack.
2. **Hardening Existing Codebases**: Upgrading Next.js and Supabase applications to 100% PostgreSQL Row-Level Security (RLS), pessimistic concurrency locking, and Cloudflare perimeter defenses.
3. **Bootstrapping Greenfield Projects**: Launching new SaaS initiatives with pre-configured multi-tenant boundaries, zero layout shift (Zero-CLS) skeletons, and automated quality gates.

---

## 2. The Drop-In Modernization Engine: How It Works

This repository is designed to be **dropped directly into or alongside ANY existing project** (Laravel, Django, Express/Node, CRA/Vite, PHP monoliths, or existing Next.js apps) to autonomously analyze, modernize, and upgrade the system.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    THE DROP-IN ENGINE WORKFLOW                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   1. DROP IN          Clone or copy next-supabase-enterprise-engine into        │
│                       the target repository (e.g., inside /engine or beside it) │
│                             │                                                   │
│                             ▼                                                   │
│   2. SCAN & ANALYZE   Run `node scripts/engine-scanner.cjs ..`                  │
│                       The engine inspects the host project's models, routes,    │
│                       auth mechanisms, and security debt.                       │
│                             │                                                   │
│                             ▼                                                   │
│   3. DYNAMIC MD       The engine GENERATES & UPDATES project-specific           │
│      GENERATION       markdown blueprints tailored directly to that codebase:   │
│                       - `TARGET_CODEBASE_ASSESSMENT.md`                         │
│                       - `GENERATED_MIGRATION_BLUEPRINT.md` (DDL + RLS + Actions)│
│                       - Updates `CLAUDE.md` and `AGENTS.md` in the host project │
│                             │                                                   │
│                             ▼                                                   │
│   4. AUTONOMOUS       AI Agents (Claude Code, Cursor, Antigravity) read the     │
│      MODERNIZATION    tailored markdown files and implement the modern Next.js  │
│                       + Supabase modules step-by-step.                          │
│                             │                                                   │
│                             ▼                                                   │
│   5. AUDIT & VERIFY   Run `npm run audit` to guarantee 100% compliance          │
│                       against the 14 enterprise security threat handbooks.      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Architectural Pillars

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM TRAFFIC TOPOGRAPHY                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   Client Browser                                                                │
│        │                                                                        │
│        ▼ (HTTPS / TLS 1.3 Strict)                                               │
│   Cloudflare Anycast Perimeter                                                  │
│        ├── WAF Rules & Bot Defense                                              │
│        ├── Cloudflare Turnstile Verification                                    │
│        └── Edge Rate Limiting & Nonce CSP Injection                             │
│        │                                                                        │
│        ▼ (Origin Request)                                                       │
│   Vercel Edge & Serverless Compute (Next.js 14+ App Router)                     │
│        ├── Edge Middleware (Session Refresh & Nonce Headers)                    │
│        ├── React Server Components (RSC - Streaming SSR + Suspense)             │
│        └── Server Actions ("use server" - Zod Parsing & Turnstile Verification) │
│        │                                                                        │
│        ▼ (Typed PostgREST & RPC)                                                │
│   Domain Service & Repository Layer (`modules/[feature]/`)                      │
│        ├── Encapsulated Business Rules                                          │
│        └── Keyset-Paginated Data Access                                         │
│        │                                                                        │
│        ▼ (Authenticated PostgREST / RPC)                                        │
│   Sovereign Database Engine (Supabase / PostgreSQL 16)                          │
│        ├── 100% Mandatory Row-Level Security (Default-Deny + WITH CHECK)       │
│        ├── Pessimistic Concurrency (`SELECT ... FOR UPDATE` Stored Procedures)  │
│        └── Quarantined Service-Role Key                                         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

* **100% PostgreSQL Row-Level Security (RLS)**: Enforces default-deny on every table with strict multi-tenant isolation via `(auth.jwt() ->> 'tenant_id')::uuid`. Mandatory `WITH CHECK` clauses on INSERT and UPDATE prevent cross-tenant record tampering.
* **Pessimistic Concurrency Control**: High-stakes operations (inventory reservations, credit balance deductions, checkout) execute within atomic `SECURITY DEFINER` stored procedures using `SELECT ... FOR UPDATE`.
* **Zero Cumulative Layout Shift (Zero-CLS)**: Full-screen blocking spinners are eliminated. Structural 1:1 skeleton loaders (`SkeletonCard`, `SkeletonTable`, `SkeletonGrid`, `SkeletonForm`) provide seamless streaming SSR with Suspense.
* **Cloudflare Perimeter Defense**: Zero-CLS Cloudflare Turnstile bot verification on mutation actions, edge rate limiting, and per-request cryptographic nonces for strict Content-Security-Policy (CSP) headers.
* **Service-Role Key Quarantine**: Strict boundary protocols ensuring `SUPABASE_SERVICE_ROLE_KEY` is barred from browser code, client components, and public environment variables.

---

## 3. Architecture & Engineering Documentation

Deep-dive documentation standards are located in the repository:

| Document | Primary Focus |
| :--- | :--- |
| [01_SYSTEM_ARCHITECTURE_AND_DESIGN.md](01_SYSTEM_ARCHITECTURE_AND_DESIGN.md) | Topography, domain packaging (`modules/[feature]/`), and client/server/admin factories. |
| [02_SUPABASE_DATABASE_AND_RLS_STANDARD.md](02_SUPABASE_DATABASE_AND_RLS_STANDARD.md) | Default-deny RLS policies, `WITH CHECK` clauses, atomic RPCs with pessimistic locking, and compound indexing. |
| [03_CLOUDFLARE_EDGE_AND_SECURITY_STANDARD.md](03_CLOUDFLARE_EDGE_AND_SECURITY_STANDARD.md) | WAF rules, edge rate limits, Turnstile client/server integration, and nonce-based CSP middleware. |
| [04_UI_UX_DESIGN_SYSTEM_AND_SKELETONS.md](04_UI_UX_DESIGN_SYSTEM_AND_SKELETONS.md) | Zero-CLS skeleton primitives, tactile Claymorphic `PageHeader`, and $\ge 48\text{px}$ touch targets. |
| [05_CODEBASE_CONVERSION_AND_MIGRATION_GUIDE.md](05_CODEBASE_CONVERSION_AND_MIGRATION_GUIDE.md) | 5-phase migration protocol for porting Laravel, Django, Express, or CRA codebases. |
| [06_PROMPTS_COOKBOOK_AND_TUTORIAL.md](06_PROMPTS_COOKBOOK_AND_TUTORIAL.md) | Operational AI prompt cookbook (Prompts A–E) & deep-dive validation script tutorial. |

---

## 4. Single-Command Security Audit

This repository includes a deterministic validation suite in `scripts/`:

### Run Everything in One Command:
```bash
npm run audit
```

### What `npm run audit` Does Simultaneously:
1. **Internal Regression Tests**: Executes 65 automated tests verifying validation invariants.
2. **Service-Role Quarantine Scan**: Scans `app/`, `components/`, and `modules/` to guarantee zero exposure of `SUPABASE_SERVICE_ROLE_KEY`.
3. **Findings Schema Validation**: Validates security findings against [report-schema.json](scripts/report-schema.json).
4. **Coverage Ledger Validation**: Validates coverage records against coverage invariants.

```
================================================================================
   NEXT-SUPABASE ENTERPRISE ENGINE — UNIFIED SECURITY AUDIT RUNNER
================================================================================
  [PASS] Internal Regression Tests     : 65 tests passed
  [PASS] Service-Role Quarantine       : Clean
  [PASS] Findings Schema Validation    : PASS: 1 findings valid (Compliant test fixture)
  [PASS] Coverage Ledger Validation    : PASS: 1 coverage units valid (Compliant test fixture)
================================================================================
  STATUS: ALL EXECUTED CHECKS PASSED (100% ENTERPRISE COMPLIANT)
================================================================================
```

---

## 5. Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-github-username>/next-supabase-enterprise-engine.git
cd next-supabase-enterprise-engine
npm install
```

### 2. Configure Environment Variables
Copy [.env.example](.env.example) to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials and Cloudflare Turnstile keys.

### 3. Initialize Local Supabase Stack
```bash
# Start local PostgreSQL, Auth, and Storage containers
supabase start

# Run database migrations
supabase db reset
```

### 4. Verify Local Security Posture
```bash
npm run audit
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 6. Project Directory Layout

```
next-supabase-enterprise-engine/
├── app/                                    # App Router (Routing, Layouts, & RSC Views)
│   ├── (auth)/                             # Authentication flows (Login, Register, PKCE Callback)
│   ├── (dashboard)/[tenant]/               # Tenant-isolated dashboard modules
│   └── api/v1/                             # Webhooks (Stripe, Resend) & Public REST Endpoints
├── modules/[feature]/                      # Domain-Driven Modules
│   ├── actions/                            # Server Actions (Mutations & Zod Validation)
│   ├── repositories/                       # Domain Data Access (PostgREST & RPCs)
│   ├── components/                         # Feature UI Components
│   └── types/                              # Domain Schemas & TypeScript DTOs
├── lib/                                    # Infrastructure Utilities
│   ├── supabase/                           # Client Factories (client.ts, server.ts, admin.ts)
│   └── security/                           # Turnstile verification & rate limiting
├── components/                             # Reusable UI Primitives
│   ├── common/page-header.tsx              # Tactile Claymorphic Page Header
│   └── skeletons/                          # Zero-CLS Skeleton Placeholders
├── scripts/                                # Audit Validation Tooling
│   ├── audit-all.cjs                       # Single unified test runner
│   ├── report-schema.json                  # Findings JSON schema
│   ├── validate-findings.cjs               # Findings validator
│   └── validate-coverage-ledger.cjs        # Coverage ledger validator
├── CLAUDE.md                               # AI Agent Directives (Claude Code)
├── AGENTS.md                               # General AI Agent Guardrails
└── package.json
```

---

## 7. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
