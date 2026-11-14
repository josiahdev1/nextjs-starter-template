# Operational Prompts Cookbook & Tutorial
## Production-Grade AI Directives for Modernization, Hardening, & Security Audits

---

## 1. Overview & Operational Directive

This cookbook contains battle-tested, copy-paste prompts designed for execution in AI coding agents, autonomous LLM workflows, and senior engineering task forces. 

Each prompt establishes strict enterprise guardrails, binds the agent to the `next-supabase-enterprise-engine` standards, and guarantees deterministic outputs free of placeholder code.

---

## 2. Prompt A: Legacy Codebase Deep Recon & Audit

### Operational Context
Use this prompt when ingesting a legacy monolithic codebase (Laravel, Django, Express, Rails, or CRA/Vite) to extract data models, route inventories, authentication logic, and security vulnerabilities prior to migration.

### Copy-Paste Prompt Directive

```markdown
You are an Elite Enterprise Reverse-Engineer and Principal Security Auditor.

MISSION:
Perform a deep architectural reconnaissance and security audit of the provided legacy repository. Extract all data structures, API endpoints, authentication mechanisms, and security debt to prepare for a migration to Next.js (App Router) + Supabase + Cloudflare.

EXECUTION INSTRUCTIONS:
1. DATA MODEL INVENTORY:
   - Identify every database entity, table, and relationship (1:1, 1:N, M:N).
   - Document primary keys, foreign keys, cascade rules, soft-delete mechanisms, and timestamp columns.
   - Note data types that require conversion to PostgreSQL (e.g., MySQL tinyint(1) -> boolean, text -> uuid).
2. ROUTE & ENDPOINT INVENTORY:
   - Map all HTTP routes, controllers, HTTP verbs, and query/body parameter requirements.
   - Categorize each route: Public, Authenticated User, Organization Admin, or System Internal.
3. AUTHENTICATION & SESSION AUDIT:
   - Document how credentials are authenticated and sessions persisted (cookies, JWT, session tables).
   - Identify permission guards and role checks.
4. SECURITY VULNERABILITY & DEBT AUDIT:
   - Search for IDOR/BOLA vectors (e.g., querying records by URL ID without checking tenant ownership).
   - Flag SQL injections, unvalidated redirects, CSRF omissions, or missing rate limits.
   - Cross-reference findings against the 14 threat handbooks in the security-audit toolkit.

REQUIRED OUTPUT STRUCTURE:
Generate a markdown document named `RECONNAISSANCE_REPORT.md` containing:
1. Executive Summary & Stack Profile.
2. Complete Entity Relationship Matrix (including Mermaid ER diagram).
3. Comprehensive API Route Catalog (Table: Method | Path | Controller | Auth Level | Notes).
4. Security Debt Register (Table: Risk Level | Location | Vulnerability Description | Remediation).
5. Recommended Phase 2 Database Migration Sequence.
```

---

## 3. Prompt B: Supabase Migration & RLS Generator

### Operational Context
Use this prompt to convert legacy ORM schemas into idempotent PostgreSQL migrations with mandatory default-deny RLS, tenant isolation, compound indexes, and atomic RPC procedures.

### Copy-Paste Prompt Directive

```markdown
You are a Principal Database Engineer specializing in PostgreSQL 16 and Supabase Enterprise Architecture.

MISSION:
Generate a production-grade, idempotent SQL migration script for Supabase based on the provided entity models.

STRICT CONSTRAINTS & REQUIREMENTS:
1. IDEMPOTENT DDL:
   - Use `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, and UUID primary keys with `gen_random_uuid()`.
   - Every tenant-scoped table MUST include `tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE`.
2. ROW-LEVEL SECURITY (100% COVERAGE):
   - Explicitly execute `ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;` on every single table.
   - Add a restrictive default-deny filter:
     `CREATE POLICY "deny_unauthenticated_{table}" ON {table} AS RESTRICTIVE FOR ALL TO public USING (auth.role() = 'authenticated');`
   - Implement isolated SELECT, INSERT, UPDATE, DELETE policies binding to `(auth.jwt() ->> 'tenant_id')::uuid`.
   - On INSERT and UPDATE, the `WITH CHECK` clause is MANDATORY to prevent cross-tenant record tampering.
3. CONCURRENCY & TRANSACTION RPC:
   - If the entity handles financial balances, inventory counts, or seat allocation, generate an atomic PostgreSQL function (`SECURITY DEFINER`, `SET search_path = public`).
   - Use `SELECT ... FOR UPDATE` for pessimistic concurrency control and include idempotency key checks.
4. COMPOUND INDEXING:
   - Add B-Tree indexes on `(tenant_id, created_at DESC)` and all foreign keys.
   - Add GIN indexes on search columns and JSONB fields.

REQUIRED OUTPUT:
Output a single executable SQL migration file named `supabase/migrations/[TIMESTAMP]_[feature]_schema.sql`.
```

---

## 4. Prompt C: Full-Stack App Router Module Generator

### Operational Context
Use this prompt to scaffold an end-to-end domain feature inside `modules/[feature]/` adhering to Next.js App Router, Zod validation, Server Actions, Domain Repositories, and Shadcn UI with Zero-CLS skeletons.

### Copy-Paste Prompt Directive

```markdown
You are a Lead Full-Stack Engineer building enterprise software with Next.js (App Router), TypeScript, and Supabase.

MISSION:
Generate a complete, production-ready domain module inside `modules/[feature]/` adhering strictly to the `next-supabase-enterprise-engine` standard.

FEATURE SPECIFICATION:
Target Module: [FEATURE_NAME, e.g., "invoices", "inventory", "team"]

REQUIRED FILES & IMPLEMENTATION:
1. `modules/[feature]/types/[feature].schema.ts`:
   - Strict Zod schemas for form submissions and mutations.
   - TypeScript DTO interfaces inferred from Zod schemas and database types.
2. `modules/[feature]/repositories/[feature].repository.ts`:
   - Encapsulated database operations using typed Supabase client.
   - Implements Keyset pagination (`(created_at, id) < (cursorCreatedAt, cursorId)`).
   - Zero raw unparameterized SQL strings.
3. `modules/[feature]/actions/[feature].action.ts`:
   - Next.js Server Action (`"use server"`).
   - Zod runtime schema validation (`safeParse`).
   - Cloudflare Turnstile bot token verification (`verifyTurnstileToken`).
   - Session extraction via `createServerSupabaseClient()`.
   - Invalidation of relevant Next.js cache tags (`revalidateTag`).
4. `components/skeletons/skeleton-[feature].tsx`:
   - Zero-CLS skeleton placeholder matching exact production heights and bounds.
5. `modules/[feature]/components/[feature]-table-rsc.tsx`:
   - React Server Component fetching data via the repository and rendering the table.
6. `app/(dashboard)/[tenant]/[feature]/page.tsx`:
   - RSC mounting tactile `PageHeader` and `<Suspense fallback={<Skeleton... />}>`.

RULES:
- Zero placeholder comments like "// implement logic here".
- Strict TypeScript mode with zero `any` types.
- Minimum 48px touch targets for all interactive buttons.
```

---

## 5. Prompt D: Security Audit Verification & Ledger Generator

### Operational Context
Use this prompt to run an exhaustive defensive security audit against an application, validate findings against `report-schema.json`, and generate a coverage ledger verified by `validate-coverage-ledger.cjs`.

### Copy-Paste Prompt Directive

```markdown
You are a Principal Security Auditor and Penetration Tester executing the defensive security audit workflow.

MISSION:
Audit the target codebase across the 14 threat handbooks in `/home/josiah/Downloads/security-audit`, compile `coverage-ledger.json` and `findings.json`, and execute the local validation test scripts.

AUDIT SCOPES & CHECKS:
1. Multitenancy & Data Isolation (`DATA-ISOLATION-AND-LIFECYCLE.md`):
   - Confirm 100% of tables enforce RLS with `(auth.jwt() ->> 'tenant_id')::uuid`.
   - Verify `WITH CHECK` on all UPDATE policies to prevent tenant hijacking.
2. Web Protocol & Session Auth (`WEB-PROTOCOL-AND-AUTH.md`):
   - Verify PKCE flow, SameSite=Lax HTTP-only cookies, and session invalidation on logout.
   - Confirm origin verification on all Server Actions.
3. Resource Exhaustion & Availability (`RESOURCE-EXHAUSTION-AND-AVAILABILITY.md`):
   - Verify rate-limiting on authentication and mutation endpoints.
   - Verify Keyset pagination prevents high-offset database denial of service.
4. Cloud & Perimeter Defense (`CLOUD-AND-DEPLOYMENT.md`):
   - Verify that `SUPABASE_SERVICE_ROLE_KEY` is not present in client bundles or public env vars.
   - Verify strict CSP headers with nonces in middleware.

OUTPUT & VERIFICATION REQUIREMENTS:
1. Produce `findings.json` strictly compliant with `report-schema.json`.
2. Produce `coverage-ledger.json` recording every analyzed subsystem.
3. Execute validation commands:
   ```bash
   node scripts/validate-findings.cjs findings.json
   node scripts/validate-coverage-ledger.cjs coverage-ledger.json
   ```
4. Generate a comprehensive `REPORT.md` summarizing verified findings, severity ratings, and exact remediation code diffs.
```

---

## 6. Prompt E: Existing Next.js Codebase Hardening

### Operational Context
Use this prompt to scan and refactor an existing Next.js + Supabase application to eliminate UI layout shifts, patch IDOR vulnerabilities, quarantine service-role keys, and enforce Cloudflare perimeter defenses.

### Copy-Paste Prompt Directive

```markdown
You are an Enterprise Systems Hardening Specialist.

MISSION:
Audit and refactor the existing Next.js application to meet the `next-supabase-enterprise-engine` enterprise standard.

HARDENING DIRECTIVES:
1. ELIMINATE FULL-SCREEN LOADERS (ZERO-CLS):
   - Search for full-screen loading spinners, "Loading...", or blocking spinner overlays.
   - Replace them with structural skeleton primitives (`SkeletonCard`, `SkeletonTable`, `SkeletonForm`).
   - Implement React Suspense boundaries around all streaming RSCs.
2. PATCH IDOR & DATA BOUNDARY LEAKS:
   - Identify any route handler or Server Action that accepts `tenantId` or `userId` from client request bodies.
   - Refactor to derive tenant and user identities strictly from the authenticated JWT session (`auth.getUser()`).
3. QUARANTINE SERVICE-ROLE KEYS:
   - Search the codebase for `SUPABASE_SERVICE_ROLE_KEY` or `supabaseAdmin`.
   - Ensure the service-role client is removed from all client components, RSCs, and standard Server Actions.
4. INJECT CLOUDFLARE PERIMETER & SECURITY HEADERS:
   - Update `middleware.ts` to generate cryptographic nonces and enforce strict CSP, HSTS, and frame protections.
   - Add Cloudflare Turnstile bot verification to login, registration, and high-risk mutation actions.
5. STANDARDIZE UI ERGONOMICS:
   - Enforce minimum 48px touch targets for all interactive buttons and inputs.
   - Standardize page headers using the tactile Claymorphic `PageHeader`.

OUTPUT:
Provide a step-by-step refactoring log with before/after code comparisons and run the audit validation scripts to prove compliance.
```

---

## 7. Deep-Dive Tutorial: How to Use the Audit Validation Scripts

The template engine includes a zero-dependency, high-rigor audit validation toolset located in `scripts/`:
- `report-schema.json` – Strict JSON Schema specification defining all allowed finding structures.
- `validate-findings.cjs` – Validates `findings.json` against `report-schema.json`, enforcing invariant checks (lexicographic fingerprint ordering, severity bounds, visible content, and safe paths).
- `validate-coverage-ledger.cjs` – Validates `coverage-ledger.json`, verifying that all attack classes, architectural boundaries, and code paths have been systematically analyzed.
- Automated Test Suite – Run with `npm run test:audit-scripts` to verify the 65 internal test assertions.

---

### 7.1 CLI Execution Quick Reference

#### The Single Audit Command
Run the internal regression test suite, service-role quarantine scan, findings validator, and coverage ledger validator simultaneously with **ONE single command**:

```bash
# Runs all tests, quarantine checks, findings checks, and coverage checks at once:
npm run audit
```

Optional arguments for explicit artifact paths:
```bash
npm run audit -- path/to/findings.json path/to/coverage-ledger.json
```

#### Individual Diagnostic Commands

```bash
# 1. Run all 65 automated regression tests on the scripts
npm run test:audit-scripts

# 2. Validate a findings file against report-schema.json
node scripts/validate-findings.cjs path/to/findings.json

# 3. Validate a coverage ledger file
node scripts/validate-coverage-ledger.cjs path/to/coverage-ledger.json
```

**Exit Codes:**
- `0`: Validation passed (`PASS: N findings valid` or `PASS: M coverage units valid`).
- `1`: Validation failed with diagnostic errors printed to `stderr`.

---

### 7.2 Writing a Valid `findings.json`

The `findings.json` file is a top-level JSON array where each entry represents one security finding. Every entry must strictly match one of three branches defined in `report-schema.json`:
1. `confirmed`: A demonstrated, source-grounded vulnerability with reproduction and trace.
2. `needs_validation`: A hypothesis whose decisive fact is outside source (e.g. requires live deployment, CDN behavior, or cloud infrastructure).
3. `rejected`: A candidate hypothesis refuted during source inspection or testing.

#### Invariants Enforced by `validate-findings.cjs`:
- **Lexicographical Ordering**: Findings **MUST** be sorted alphabetically by `fingerprint`.
- **Severity Capping**: `overall_severity` cannot exceed the scores of `likelihood` or `impact`.
- **Trace Invariant**: Must contain at least one trace object (`kind`: `entrypoint`, `propagation`, or `sink`). Line numbers must be integers $\ge 1$.
- **Visible Content**: Strings cannot consist solely of whitespace, terminal escapes, or Unicode control characters.

#### Complete Valid `findings.json` Example:

```json
[
  {
    "verdict": "confirmed",
    "fingerprint": "auth-session-missing-invalidation",
    "title": "Session token not invalidated upon server-side logout",
    "description": "Calling the signout route handler clears cookies but does not revoke the Supabase refresh token server-side.",
    "root_cause": "route handler calls cookies().delete() instead of supabase.auth.signOut({ scope: \"global\" }).",
    "intended_behavior": "Logout must invalidate all active server refresh tokens via the Supabase Auth API.",
    "trace": [
      {
        "kind": "entrypoint",
        "file": "app/(auth)/signout/route.ts",
        "line": 8,
        "scope": "POST",
        "description": "User submits logout request."
      },
      {
        "kind": "sink",
        "file": "app/(auth)/signout/route.ts",
        "line": 15,
        "scope": "POST",
        "description": "Session cookie deleted locally without revoking server token."
      }
    ],
    "evidence": [
      {
        "file": "app/(auth)/signout/route.ts",
        "line": 15,
        "description": "cookieStore.delete(\"sb-access-token\") executed without calling auth.admin.signOut"
      }
    ],
    "conditions": [],
    "execution": {
      "attacker_perspective": "Attacker holding previously compromised access token.",
      "payloads": ["Bearer <previously-issued-token>"],
      "instructions": ["Authenticate, log out in browser, and reuse the old token against /api/v1/user."],
      "observed_result": "The API endpoint accepts the token and returns user profile data."
    },
    "remediation": {
      "strategy": "Call await supabase.auth.signOut({ scope: 'global' }) before clearing cookies."
    },
    "severity": {
      "likelihood": {
        "score": "medium",
        "reason": "Requires attacker to intercept valid session token prior to logout."
      },
      "impact": {
        "score": "high",
        "reason": "Allows unauthorized access to user account post-logout."
      },
      "overall_severity": "medium"
    },
    "confidence": {
      "score": "high",
      "reason": "Confirmed via local source tracing and token replay curl."
    }
  },
  {
    "verdict": "needs_validation",
    "fingerprint": "storage-signed-url-leak-hypothesis",
    "title": "Potential signed URL leakage through unkeyed CDN edge cache",
    "description": "Private document download URLs may be cached by intermediate proxies.",
    "claimed_root_cause": "Cache-Control headers on signed asset responses lack private or no-store directives.",
    "trace": [
      {
        "kind": "entrypoint",
        "file": "app/api/v1/documents/[id]/download/route.ts",
        "line": 12,
        "scope": "GET",
        "description": "Client requests download URL for private tenant document."
      }
    ],
    "evidence": [
      {
        "file": "app/api/v1/documents/[id]/download/route.ts",
        "line": 28,
        "description": "Response sets Cache-Control: max-age=3600 without private keyword."
      }
    ],
    "blockers": [
      "Staging CDN behavior cannot be simulated in local unit tests without live Cloudflare edge headers."
    ],
    "validation_plan": {
      "local": "Simulate caching proxy using local Nginx with standard caching rules.",
      "deployment": "In staging environment, request signed URL across multiple distinct IP addresses and verify Cache-Control header."
    }
  },
  {
    "verdict": "rejected",
    "fingerprint": "tenant-rls-bypass-in-invoices",
    "title": "Claimed RLS bypass in invoice listing",
    "description": "Initial hypothesis claimed invoices could be viewed by unauthorized tenants.",
    "claimed_root_cause": "getInvoices query was hypothesized to omit tenant filtering.",
    "trace": [
      {
        "kind": "entrypoint",
        "file": "modules/invoices/repositories/invoice.repository.ts",
        "line": 22,
        "scope": "listInvoices",
        "description": "Repository query runs PostgREST select."
      }
    ],
    "evidence": [
      {
        "file": "supabase/migrations/20260101000000_invoices.sql",
        "line": 35,
        "description": "PostgreSQL policy tenant_select_invoices strictly enforces tenant_id = (auth.jwt() ->> 'tenant_id')::uuid."
      }
    ],
    "reason": "PostgreSQL RLS engine intercepts PostgREST queries and enforces tenant isolation at the kernel level regardless of application filters."
  }
]
```

---

### 7.3 Writing a Valid `coverage-ledger.json`

The coverage ledger tracks all analyzed units of the system across waves of testing.

#### Invariants Enforced by `validate-coverage-ledger.cjs`:
- **Canonical Coverage ID**: Must be derived using the formula:
  `canonicalCoverageId(canonical_refs)` which URL-encodes each field (`surface`, `boundary`, `subsystem`, `attack_class`) and joins them with `::`.
  Example: `Auth%20Module::Session%20Boundary::Authentication::WEB-PROTOCOL-AND-AUTH.md%23Session%20fixation%20and%20invalidation`
- **Agent ID Formatting**: Must match `^[a-z0-9][a-z0-9_-]{0,63}$` and cannot equal Windows reserved names (`con`, `prn`, `aux`, `nul`, `com1-9`, `lpt1-9`).
- **Check Methods**:
  - `method: "source"` requires `artifact: null`.
  - `method: "local"` requires an owned artifact matching `agents/<agent-id>/artifacts/...`.
- **Status Progression**: Valid states are `planned`, `in_progress`, `candidate`, `covered`, `deferred`, `blocked`, and `out_of_scope`.

#### Complete Valid `coverage-ledger.json` Example:

```json
[
  {
    "coverage_id": "Auth%20Module::Session%20Boundary::Authentication::WEB-PROTOCOL-AND-AUTH.md%23Session%20fixation%20and%20invalidation",
    "canonical_refs": {
      "surface": "Auth Module",
      "boundary": "Session Boundary",
      "subsystem": "Authentication",
      "attack_class": "WEB-PROTOCOL-AND-AUTH.md#Session fixation and invalidation"
    },
    "surface": "Auth Module",
    "boundary": "Session Boundary",
    "subsystem": "Authentication",
    "attack_class": "WEB-PROTOCOL-AND-AUTH.md#Session fixation and invalidation",
    "starting_paths": ["app/(auth)/signout/route.ts"],
    "ordinary_attack_class_block": "WEB-PROTOCOL-AND-AUTH.md#Session fixation and invalidation",
    "selected_companion_blocks": [],
    "excluded_blocks": [],
    "prior_status": "new",
    "attempts": [],
    "wave": 1,
    "status": "candidate",
    "agent_id": "hunter-1",
    "reviewed_paths": ["app/(auth)/signout/route.ts"],
    "local_checks": [
      {
        "agent_id": "hunter-1",
        "reviewed_paths": ["app/(auth)/signout/route.ts"],
        "invariant": "Session logout must invalidate active tokens.",
        "method": "source",
        "result": "Source shows cookies deleted without server signout.",
        "artifact": null
      }
    ],
    "result_fingerprints": ["auth-session-missing-invalidation"],
    "unresolved": ["Needs validation against live Supabase Auth endpoint."]
  }
]
```

---

### 7.4 Validation Error Troubleshooting Matrix

| Validation Error Message | Underlying Root Cause | Required Remediation |
| :--- | :--- | :--- |
| `findings are not sorted by fingerprint` | Finding entries in array are out of alphabetical order. | Sort the top-level array alphabetically by `fingerprint`. |
| `overall_severity cannot exceed demonstrated impact` | `overall_severity` is set to `high` while `impact.score` is `medium`. | Lower `overall_severity` to match the lowest bound of likelihood and impact. |
| `line: value must be integer >= 1` | Line number in `trace` or `evidence` is `0` or negative. | Set exact line number from source file ($1$-indexed). |
| `missing required field "reason"` (in rejected branch) | Rejected finding contains obsolete field `refutation`. | Replace `refutation` object with a top-level string `reason: "..."`. |
| `coverage_id does not match canonical_refs` | ID string does not equal `canonicalCoverageId(refs)`. | Re-encode each canonical ref with `encodeURIComponent` joined by `::`. |
| `source-only check must use null artifact` | A check with `method: "source"` specified a file path. | Set `artifact: null` when `method` is `"source"`. |
| `path has no check owner` | A file listed in `reviewed_paths` was not reviewed by any check in `local_checks`. | Ensure every path in `reviewed_paths` is included in at least one check's `reviewed_paths`. |

---

### 7.5 The Autonomous AI Agent Self-Correction Loop

When an AI agent (Claude Code, Cursor, Antigravity) is instructed to audit or verify a codebase:
```
  ┌────────────────────────────────────────────────────────┐
  │ 1. GENERATE                                            │
  │    Draft findings.json & coverage-ledger.json          │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │ 2. VALIDATE                                            │
  │    Run node scripts/validate-findings.cjs ...          │
  │    Run node scripts/validate-coverage-ledger.cjs ...   │
  └──────────────────────────┬─────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
       [Exit code != 0]              [Exit code == 0]
              │                             │
              ▼                             ▼
  ┌────────────────────────┐   ┌───────────────────────────┐
  │ 3. PARSE & AUTO-CORRECT│   │ 4. COMPLETE               │
  │    Parse stderr errors │   │    Report verified        │
  │    Fix schema & logic  │   │    findings with 100%     │
  │    Loop back to Step 2 │   │    audit pass guarantee   │
  └────────────────────────┘   └───────────────────────────┘
```
