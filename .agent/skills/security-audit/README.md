# Security Audit Toolkit & Enterprise Architecture Engine
### Defensive Vulnerability Review System & Next.js + Supabase Production Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Audit Pipeline](https://img.shields.io/badge/Audit%20Pipeline-Passing%20(100%25)-brightgreen.svg)](#unified-validation-command)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)

---

## 1. Overview

This repository unites two complementary engineering toolkits:
1. **The Defensive Security Audit Toolkit**: An exhaustive, source-grounded vulnerability hunting and verification framework covering 14 critical threat domains, JSON schema validation, and deterministic coverage ledgers.
2. **The Next.js + Supabase Enterprise Engine (`templates/next-supabase-enterprise-engine/`)**: A production-grade architecture standard and boilerplate featuring 100% Row-Level Security (RLS), Cloudflare perimeter defenses, Zero-CLS skeleton loaders, and legacy migration protocols.

---

## 2. Unified Validation Command

Run all internal test assertions, service-role quarantine checks, security findings validations, and coverage ledger verifications with **ONE single command**:

```bash
node audit-all.cjs
```

Or pass specific findings and ledger documents:
```bash
node audit-all.cjs path/to/findings.json path/to/coverage-ledger.json
```

**Output:**
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

## 3. The 14 Threat Vector Handbooks

The root directory contains 14 domain-specific security audit handbooks used during security reviews:

| Threat Handbook | Domain Coverage |
| :--- | :--- |
| [AI-AND-LLM.md](AI-AND-LLM.md) | Prompt injections, model extraction, tool-use security, and training data leaks. |
| [ATTACK-CLASSES.md](ATTACK-CLASSES.md) | Access control bypasses, SSRF, command injection, path traversal, and crypto flaws. |
| [CLIENT-SIDE.md](CLIENT-SIDE.md) | XSS, DOM clobbering, CSP bypasses, localStorage leaks, and prototype pollution. |
| [CLOUD-AND-DEPLOYMENT.md](CLOUD-AND-DEPLOYMENT.md) | Cloud IAM, metadata services, public bucket misconfigurations, and environment leaks. |
| [DATA-ISOLATION-AND-LIFECYCLE.md](DATA-ISOLATION-AND-LIFECYCLE.md) | Multi-tenancy, cross-tenant leaks, soft deletes, data retention, and crypto-shredding. |
| [DESKTOP-MOBILE-AND-LOCAL-IPC.md](DESKTOP-MOBILE-AND-LOCAL-IPC.md) | Native bridges, Electron/Tauri IPC, deep links, and device storage security. |
| [HUNTING.md](HUNTING.md) | Source-to-sink AST analysis, triage heuristics, and critic waves. |
| [MEMORY-SAFETY-AND-BINARY.md](MEMORY-SAFETY-AND-BINARY.md) | Buffer overflows, use-after-free, integer wraps, and native C/C++ addons. |
| [PROTOCOLS-RPC-AND-MESSAGING.md](PROTOCOLS-RPC-AND-MESSAGING.md) | WebSockets, gRPC, Redis/pub-sub authentication, and message queue security. |
| [RECONNAISSANCE.md](RECONNAISSANCE.md) | Attack surface discovery, route mapping, and endpoint indexing. |
| [RESOURCE-EXHAUSTION-AND-AVAILABILITY.md](RESOURCE-EXHAUSTION-AND-AVAILABILITY.md) | ReDoS, slowloris, rate limits, and payload bomb defenses. |
| [SUPPLY-CHAIN-AND-RELEASE.md](SUPPLY-CHAIN-AND-RELEASE.md) | Dependency pinning, lockfile tampering, and release pipeline integrity. |
| [VALIDATION-AND-REPORTING.md](VALIDATION-AND-REPORTING.md) | PoC standards, severity grading, and verification reports. |
| [WEB-PROTOCOL-AND-AUTH.md](WEB-PROTOCOL-AND-AUTH.md) | HTTP smuggling, CORS, SSRF, PKCE, session lifecycles, and JWT verification. |

---

## 4. Next.js + Supabase Enterprise Engine

Located in [templates/next-supabase-enterprise-engine/](templates/next-supabase-enterprise-engine/):

* [01_SYSTEM_ARCHITECTURE_AND_DESIGN.md](templates/next-supabase-enterprise-engine/01_SYSTEM_ARCHITECTURE_AND_DESIGN.md) – Traffic flow, modular directory structure, and client factories.
* [02_SUPABASE_DATABASE_AND_RLS_STANDARD.md](templates/next-supabase-enterprise-engine/02_SUPABASE_DATABASE_AND_RLS_STANDARD.md) – Mandatory RLS, `WITH CHECK` clauses, and pessimistic concurrency locking.
* [03_CLOUDFLARE_EDGE_AND_SECURITY_STANDARD.md](templates/next-supabase-enterprise-engine/03_CLOUDFLARE_EDGE_AND_SECURITY_STANDARD.md) – Cloudflare WAF, Turnstile bot defense, and nonce CSP headers.
* [04_UI_UX_DESIGN_SYSTEM_AND_SKELETONS.md](templates/next-supabase-enterprise-engine/04_UI_UX_DESIGN_SYSTEM_AND_SKELETONS.md) – Zero-CLS skeleton primitives and tactile `PageHeader`.
* [05_CODEBASE_CONVERSION_AND_MIGRATION_GUIDE.md](templates/next-supabase-enterprise-engine/05_CODEBASE_CONVERSION_AND_MIGRATION_GUIDE.md) – 5-phase migration protocol for Laravel, Django, Express, and CRA.
* [06_PROMPTS_COOKBOOK_AND_TUTORIAL.md](templates/next-supabase-enterprise-engine/06_PROMPTS_COOKBOOK_AND_TUTORIAL.md) – Operational prompts & validation script tutorial.

To use the template engine:
```bash
cd templates/next-supabase-enterprise-engine
npm run audit
```

---

## 5. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
