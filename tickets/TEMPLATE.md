# [TICKET-XX] <Title>

**Phase / Milestone**: <Milestone Name>  
**Status**: TODO | IN PROGRESS | COMPLETED  
**Date**: <Date>  
**Commit SHA**: <Commit SHA>  
**Branch**: `dev`  
**Author / Assignee**: <Owner Name> & <Agent / Team Name>

---

## 1. Context & Objectives

<Summary of the problem, user request, and engineering goals>

## 2. Architectural Design & Key Changes

<Components, routes, shadcn components added, services, or systems added or updated>

## 3. Data & Schema Modifications

<Write "None" if not applicable. If Supabase is used: tables touched, migration files (`supabase/migrations/NNNN_*.sql`), RLS policies, seed changes, env variable names (never values), data flow>

## 4. Verification & Quality Gates

- **Format**: Passed (`npm run format:check`)
- **Lint**: Passed (`npm run lint`)
- **Type Check**: Passed (`npm run typecheck`)
- **Tests**: Passed (`npm test`) or N/A (script not configured)
- **Build**: Passed (`npm run build`)
- **Playwright Visual & E2E QA**: <command + pass summary at 1440x900, 1280x800, 390x844> or N/A (docs/config only)
- **Supabase Checks** (if used): <migration applied, RLS enabled, row counts verified>
- **Evidence**: <Screenshots, command outputs, or test results>

## 5. Notes & Dependencies

<Known considerations, packages / shadcn components added (name, version, reason), next ticket in sequence>
