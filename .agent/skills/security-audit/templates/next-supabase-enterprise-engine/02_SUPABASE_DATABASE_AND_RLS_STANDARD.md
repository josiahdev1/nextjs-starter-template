# Supabase Database & Row-Level Security (RLS) Standard
## Enterprise PostgreSQL Isolation, Concurrency Control, & Indexing Engineering

---

## 1. Executive Principles

In enterprise architectures, the database is not merely a passive bit store—it is the **sovereign enforcement boundary**. Even if an upstream application layer suffers from a Remote Code Execution (RCE), an insecure direct object reference (IDOR), or a logic flaw, the PostgreSQL engine must guarantee:
1. **Absolute Tenant Isolation**: A tenant can never observe, alter, or delete records belonging to another tenant under any circumstance.
2. **Defensive Default-Deny**: A table without explicit security policies is completely inaccessible.
3. **Pessimistic Concurrency Guarantees**: State-changing financial, inventory, or transactional operations are protected against race conditions using row-level locking (`SELECT ... FOR UPDATE`).
4. **Service-Role Quarantine**: The privileged `service_role` super-token is permanently barred from client-facing application runtimes.

---

## 2. Strict Row-Level Security (RLS) Architecture

### 2.1 The Mandatory Baseline: Default Deny

PostgreSQL enables RLS on a per-table basis. By default in PostgreSQL, enabling RLS without policies denies all rows to unprivileged roles (`anon`, `authenticated`). However, to guarantee defense-in-depth against accidental policy misconfiguration, we enforce an explicit RESTRICTIVE default-deny rule on every table.

```sql
-- Step 1: Enable Row Level Security immediately upon table creation
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

-- Step 2: Enforce explicit RESTRICTIVE policy ensuring no unauthenticated access
-- Restrictive policies act as a mandatory filter: all permissive policies must ALSO satisfy this.
CREATE POLICY "deny_all_unauthenticated"
ON public.invoices
AS RESTRICTIVE
FOR ALL
TO public
USING (auth.role() = 'authenticated');
```

---

### 2.2 Standard Multi-Tenant Isolation Pattern

Every table containing tenant-scoped data must include a `tenant_id uuid NOT NULL` column referencing `public.organizations(id)`.

Tenant context is derived directly from the caller's cryptographically signed JWT via `auth.jwt()`. Client-supplied headers or body parameters are untrusted and discarded.

#### Complete Multi-Tenant Policy Specification
```sql
-- DDL Definition for Tenant-Scoped Table
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL,
    invoice_number TEXT NOT NULL,
    amount_cents BIGINT NOT NULL CHECK (amount_cents >= 0),
    status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'paid', 'void')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_invoices_tenant_number UNIQUE (tenant_id, invoice_number)
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy: Tenants can only view their own invoices
CREATE POLICY "tenant_select_invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
);

-- 2. INSERT Policy: Ensures invoices can only be inserted into the caller's tenant
-- WITH CHECK ensures that the newly created row belongs to the caller's tenant
CREATE POLICY "tenant_insert_invoices"
ON public.invoices
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
);

-- 3. UPDATE Policy: USING prevents targeting other tenants, WITH CHECK prevents kidnapping rows across tenants
CREATE POLICY "tenant_update_invoices"
ON public.invoices
FOR UPDATE
TO authenticated
USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
)
WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
);

-- 4. DELETE Policy: Tenants can only delete their own invoices
CREATE POLICY "tenant_delete_invoices"
ON public.invoices
FOR DELETE
TO authenticated
USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
);
```

> [!IMPORTANT]
> The `WITH CHECK` clause is mandatory on `INSERT` and `UPDATE`. Without `WITH CHECK`, a malicious actor with write access in Tenant A could update an existing record's `tenant_id` to Tenant B, transferring sensitive data across tenant boundaries (tenant kidnapping attack).

---

### 2.3 Role-Based Access Control (RBAC) Inside Tenants

For enterprise applications where tenants have multiple roles (`owner`, `admin`, `member`, `viewer`), policy checks can verify the user's role without causing recursive RLS performance degradation.

#### High-Performance Membership Function
Avoid running unindexed subqueries inside RLS policies. Instead, create a `SECURITY DEFINER` function with pinned `search_path`:

```sql
-- Function to retrieve caller's role within their active tenant
CREATE OR REPLACE FUNCTION public.get_current_tenant_role(target_tenant_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.organization_members
    WHERE user_id = auth.uid()
      AND tenant_id = target_tenant_id
    LIMIT 1;
$$;

-- Restrict sensitive actions (e.g., DELETE invoices) strictly to Tenant Admins & Owners
CREATE POLICY "admin_delete_invoices"
ON public.invoices
FOR DELETE
TO authenticated
USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
    AND public.get_current_tenant_role(tenant_id) IN ('owner', 'admin')
);
```

---

## 3. Concurrency Control & Pessimistic Locking

High-concurrency systems (such as e-commerce checkouts, inventory reservation, or billing credit deduction) are susceptible to **Time-Of-Check to Time-Of-Use (TOCTOU)** race conditions if handled via standard REST updates.

To prevent overselling or double-spending, all state-dependent mutations must execute within atomic PostgreSQL Stored Procedures (`SECURITY DEFINER`) utilizing pessimistic row-level locking (`SELECT ... FOR UPDATE`).

### 3.1 Production Stored Procedure: Atomic Inventory Deduction

```sql
CREATE OR REPLACE FUNCTION public.deduct_inventory_atomic(
    p_tenant_id UUID,
    p_item_id UUID,
    p_quantity INT,
    p_idempotency_key TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_stock INT;
    v_updated_stock INT;
    v_item_name TEXT;
    v_existing_tx UUID;
BEGIN
    -- 1. Input parameter validation
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity to deduct must be strictly positive (Received: %)', p_quantity
            USING ERRCODE = 'check_violation';
    END IF;

    -- 2. Verify tenant boundary
    IF p_tenant_id != (auth.jwt() ->> 'tenant_id')::uuid THEN
        RAISE EXCEPTION 'Access Denied: Tenant context mismatch.'
            USING ERRCODE = 'insufficient_privilege';
    END IF;

    -- 3. Idempotency check: prevent duplicate execution on network retries
    SELECT id INTO v_existing_tx
    FROM public.inventory_transactions
    WHERE tenant_id = p_tenant_id
      AND idempotency_key = p_idempotency_key;

    IF FOUND THEN
        RETURN jsonb_build_object(
            'success', true,
            'idempotent_replay', true,
            'transaction_id', v_existing_tx
        );
    END IF;

    -- 4. Pessimistic Row Lock: Acquire exclusive row lock on the inventory record
    -- Other concurrent transactions attempting to read this specific row FOR UPDATE will block
    -- until this transaction commits or rolls back.
    SELECT stock_count, name
    INTO v_current_stock, v_item_name
    FROM public.inventory_items
    WHERE id = p_item_id
      AND tenant_id = p_tenant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Inventory item % does not exist in tenant %', p_item_id, p_tenant_id
            USING ERRCODE = 'no_data_found';
    END IF;

    -- 5. Business logic check under exclusive lock
    IF v_current_stock < p_quantity THEN
        RAISE EXCEPTION 'Insufficient stock for item "%". Available: %, Requested: %', 
            v_item_name, v_current_stock, p_quantity
            USING ERRCODE = 'data_exception';
    END IF;

    -- 6. Apply atomic state mutation
    v_updated_stock := v_current_stock - p_quantity;

    UPDATE public.inventory_items
    SET stock_count = v_updated_stock,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_item_id;

    -- 7. Record transaction audit log with idempotency key
    INSERT INTO public.inventory_transactions (
        tenant_id,
        item_id,
        quantity_deducted,
        remaining_stock,
        idempotency_key,
        performed_by
    ) VALUES (
        p_tenant_id,
        p_item_id,
        p_quantity,
        v_updated_stock,
        p_idempotency_key,
        auth.uid()
    ) RETURNING id INTO v_existing_tx;

    -- 8. Return structured payload
    RETURN jsonb_build_object(
        'success', true,
        'idempotent_replay', false,
        'transaction_id', v_existing_tx,
        'remaining_stock', v_updated_stock
    );
END;
$$;
```

### 3.2 Invocation from Next.js Server Action
```typescript
"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function deductInventoryAction(params: {
  itemId: string;
  quantity: number;
  idempotencyKey: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  const tenantId = user.app_metadata.tenant_id;

  // Execute atomic RPC procedure
  const { data, error } = await supabase.rpc("deduct_inventory_atomic", {
    p_tenant_id: tenantId,
    p_item_id: params.itemId,
    p_quantity: params.quantity,
    p_idempotency_key: params.idempotencyKey,
  });

  if (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }

  return data;
}
```

---

## 4. Indexing Rules & Query Optimization

In multi-tenant schemas, queries almost universally filter by `tenant_id`. Missing composite indexes cause sequential table scans, degrading performance and opening vector points for Resource Exhaustion (DoS).

### 4.1 Indexing Standard Rules

| Pattern | Index Type | Use Case | Example SQL |
| :--- | :--- | :--- | :--- |
| **Tenant Chronology** | B-Tree | Filtering tenant items sorted by date (Timeline, List) | `CREATE INDEX idx_invoices_tenant_created ON public.invoices (tenant_id, created_at DESC);` |
| **Foreign Key Joins** | B-Tree | All child relational foreign keys | `CREATE INDEX idx_invoices_customer ON public.invoices (tenant_id, customer_id);` |
| **Status Filters** | B-Tree (Partial) | Active or pending records | `CREATE INDEX idx_invoices_pending ON public.invoices (tenant_id, created_at) WHERE status = 'pending';` |
| **Search Terms** | GIN | Text search over names, titles, descriptions | `CREATE INDEX idx_items_search ON public.inventory_items USING GIN (to_tsvector('english', name || ' ' || coalesce(description, '')));` |
| **JSONB Metadata** | GIN (`jsonb_path_ops`)| Querying arbitrary document properties inside JSONB | `CREATE INDEX idx_invoices_metadata ON public.invoices USING GIN (metadata jsonb_path_ops);` |

### 4.2 High-Efficiency Keyset Pagination

Avoid `OFFSET` pagination on tables with more than 10,000 rows. `OFFSET 10000` forces the database to read, sort, and discard 10,000 tuples. Keyset (cursor) pagination uses index-backed comparisons:

```sql
-- Optimal Keyset Query using (tenant_id, created_at DESC, id DESC) index
SELECT id, invoice_number, amount_cents, created_at
FROM public.invoices
WHERE tenant_id = 'c0a80101-0000-0000-0000-000000000001'::uuid
  AND (created_at, id) < ('2026-10-23T12:00:00Z'::timestamptz, 'b1b80202-0000-0000-0000-000000000002'::uuid)
ORDER BY created_at DESC, id DESC
LIMIT 25;
```

### 4.3 Query Plan Verification Protocol

All production queries must be audited using `EXPLAIN (ANALYZE, BUFFERS)` to verify:
1. **Index Scan / Index Only Scan**: Query strictly hits `idx_invoices_tenant_created`.
2. **Zero Filter Discards**: RLS predicate `tenant_id = ...` is evaluated as an index condition, not a post-scan filter.
3. **Execution Time**: Under 5ms for reads at 1,000,000 rows.

---

## 5. Service-Role Key Quarantine Protocol

The `SUPABASE_SERVICE_ROLE_KEY` bypasses all Row-Level Security policies in PostgreSQL. An exposure of this key in browser code or client-side Next.js bundles completely compromises every tenant's data.

### 5.1 Concrete Quarantine Rules
1. **Zero Client-Side Presence**: The string `SUPABASE_SERVICE_ROLE_KEY` must never be prefixed with `NEXT_PUBLIC_`.
2. **Forbidden in App Router Pages**: Server Components, Client Components, and standard Server Actions must use `createServerSupabaseClient()` (which relies on `NEXT_PUBLIC_SUPABASE_ANON_KEY` and session cookie authentication).
3. **Restricted Run-Targets**: `createAdminClient()` (using the service role key) may only be executed inside:
   - Dedicated webhook route handlers (`app/api/v1/webhooks/stripe/route.ts`) validating cryptographic signatures.
   - Offline maintenance CLI scripts (`scripts/*.ts`).
   - Scheduled database workers (`pg_cron` jobs).

### 5.2 Automated CI Build Linter Rule

Add an AST / regex check to your CI pipeline (`.github/workflows/ci.yml`) to guarantee no leaks occur:

```bash
#!/usr/bin/env bash
# Fail build if SERVICE_ROLE is referenced in client or app components
if grep -rn --exclude-dir={node_modules,.next,scripts,lib/supabase/admin.ts} "SUPABASE_SERVICE_ROLE_KEY" app/ components/ modules/; then
    echo "CRITICAL SECURITY ERROR: SUPABASE_SERVICE_ROLE_KEY detected in application directory!"
    exit 1
fi
echo "Service-role quarantine verified: Clean."
```
