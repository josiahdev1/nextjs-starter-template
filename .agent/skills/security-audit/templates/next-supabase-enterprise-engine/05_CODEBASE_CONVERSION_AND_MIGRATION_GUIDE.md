# Legacy Codebase Conversion & Migration Guide
## Modernizing Monoliths (Laravel, Django, Express, CRA) to Next.js + Supabase + Cloudflare

---

## 1. Executive Modernization Protocol

This operational guide provides the complete 5-phase engineering protocol for converting legacy, monolithic, or external applications (PHP/Laravel, Python/Django, Node/Express, and CRA/Vite SPAs) into the enterprise **Next.js (App Router) + Supabase + Vercel + Cloudflare** architecture.

### Legacy Stack Mapping Reference

| Legacy Stack Component | Monolithic Manifestation (Laravel / Django / Express) | Next.js + Supabase Modern Counterpart |
| :--- | :--- | :--- |
| **Routing & Controllers** | `routes/web.php`, `urls.py`, `express.Router()` | Next.js App Router (`app/(dashboard)/[tenant]/...`) |
| **ORM / Data Access** | Eloquent Models, Django ORM, Sequelize/Mongoose | Supabase PostgREST Client + Domain Repositories |
| **Data Security** | Middleware filters, `$fillable`, manual query scopes | PostgreSQL Row-Level Security (RLS) policies |
| **Mutations & Business Logic**| Controller actions, Service classes | Type-safe Next.js Server Actions with Zod |
| **Authentication & Sessions** | Server-side file/Redis sessions, passport cookies | Supabase Auth (`@supabase/ssr` PKCE cookies) |
| **Templating & UI** | Blade templates, Jinja/Django templates, CRA SPAs | React Server Components (RSC) + Tailwind / Shadcn UI |
| **Background Processing** | Laravel Queues, Celery, BullMQ | Supabase Database Webhooks, `pg_cron`, Inngest |
| **Static & Media Files** | Local filesystem, AWS S3 buckets | Supabase Storage with token-signed URLs |
| **Edge Security** | Nginx reverse proxy, manual Apache `.htaccess` | Cloudflare Edge WAF, Turnstile, & Security Headers |

---

## 2. Phase 1: Codebase Audit & Extraction

Before writing any new code, perform comprehensive reverse-engineering of the legacy application to establish an unambiguous catalog of all data models, business rules, API contracts, and security debt.

### 2.1 Automated Codebase Discovery (Single Command)
Before manual inspection, execute the autonomous engine scanner against the target repository:

```bash
# Run scanner against parent or target repository:
node scripts/engine-scanner.cjs <path-to-target-repo>
# E.g. if the engine is placed inside the host repo:
node scripts/engine-scanner.cjs ..
```
The scanner automatically inspects the host stack (Laravel, Django, Express, CRA), catalogs all models, detects security hotspots, and generates:
- `TARGET_CODEBASE_ASSESSMENT.md`
- `GENERATED_MIGRATION_BLUEPRINT.md`

### 2.2 Deep Manual Audit Checklist
1. **Model & Schema Extraction**:
   - Inspect ORM definition files:
     - Laravel: `database/migrations/`, `app/Models/*.php` (inspect `$fillable`, `$casts`, relationships).
     - Django: `*/models.py` (inspect `ForeignKey`, `ManyToManyField`, `unique_together`).
     - Express: `models/*.js` (Mongoose schemas, Sequelize migrations).
   - Document all soft-delete mechanisms (`deleted_at`), timestamp conventions, and relational cascade behaviors.
2. **Route & Endpoint Inventory**:
   - Map all public, authenticated, and administrative HTTP routes.
   - Catalog HTTP verbs, expected query parameters, request body schemas, and response formats.
3. **Session & Auth Mechanism Analysis**:
   - Document how users are authenticated: stateful cookies, Bearer tokens, or API keys.
   - Map role hierarchy: simple flags (`is_admin`), permission masks, or separate guard tables.
4. **External Integrations & Webhook Mapping**:
   - Identify outbound API calls (Stripe, SendGrid, Twilio, AWS S3).
   - Identify inbound webhook receivers and their signature verification algorithms.
5. **Security Debt & Vulnerability Discovery**:
   - Trace potential IDOR vectors where controllers accepted `$id` or `req.params.id` without validating organization or tenant ownership.
   - Flag unparameterized raw SQL fragments (`DB::raw()`, `cursor.execute()`).

---

## 3. Phase 2: Database Schema & RLS Translation

Translate legacy models into clean 3NF relational PostgreSQL schemas managed via versioned Supabase CLI migrations.

### 3.1 Migration Creation Workflow

```bash
# Initialize local Supabase environment if not already running
supabase init
supabase start

# Create new versioned migration file
supabase migration new convert_legacy_core_schema
```

### 3.2 Code Transformation Example: Laravel Eloquent to Supabase PostgreSQL

#### Legacy Laravel Eloquent Model (`app/Models/Order.php`)
```php
class Order extends Model {
    use SoftDeletes;
    protected $fillable = ['tenant_id', 'customer_name', 'total_amount', 'status'];

    public function items() {
        return $this->hasMany(OrderItem::class);
    }
}
```

#### Transformed Supabase PostgreSQL Migration (`supabase/migrations/20260101000000_orders.sql`)
```sql
-- Create Orders table with strict constraints and UUID primary key
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    customer_name TEXT NOT NULL CHECK (char_length(customer_name) >= 2),
    total_amount_cents BIGINT NOT NULL CHECK (total_amount_cents >= 0),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'completed', 'cancelled')),
    deleted_at TIMESTAMPTZ NULL, -- Preserves legacy soft-delete data
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Compound Index for Multi-Tenant Chronological Listing
CREATE INDEX idx_orders_tenant_created 
ON public.orders (tenant_id, created_at DESC) 
WHERE deleted_at IS NULL;

-- Enable Mandatory Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Default Deny Restrictive Filter
CREATE POLICY "deny_unauthenticated_orders"
ON public.orders
AS RESTRICTIVE
FOR ALL
TO public
USING (auth.role() = 'authenticated');

-- Strict Multi-Tenant Isolation Policies
CREATE POLICY "tenant_select_orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
    AND deleted_at IS NULL
);

CREATE POLICY "tenant_insert_orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
    AND created_by = auth.uid()
);

CREATE POLICY "tenant_update_orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
)
WITH CHECK (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
);

CREATE POLICY "tenant_delete_orders"
ON public.orders
FOR DELETE
TO authenticated
USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::uuid
);
```

---

## 4. Phase 3: Service Layer & Server Action Scaffolding

Replace monolithic HTTP controllers with modular, type-safe Next.js Server Actions and Domain Repositories.

### 4.1 Transformation Example: Express Controller to Server Action

#### Legacy Express Controller (`controllers/orderController.js`)
```javascript
exports.createOrder = async (req, res) => {
  try {
    const { customerName, totalAmount } = req.body;
    // VULNERABLE: Trusts tenantId sent in request body!
    const order = await Order.create({
      tenantId: req.body.tenantId, 
      customerName,
      totalAmount
    });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

#### Modern Type-Safe Server Action (`modules/orders/actions/create-order.action.ts`)
```typescript
"use server";

import { z } from "zod";
import { revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

const CreateOrderSchema = z.object({
  customerName: z.string().min(2, "Customer name is required.").max(100),
  totalAmountCents: z.number().int().positive("Amount must be a positive integer in cents."),
  turnstileToken: z.string().min(1, "Bot challenge required."),
});

export type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createOrderAction(
  formData: FormData
): Promise<ActionResponse<{ id: string }>> {
  // 1. Zod Schema Parse
  const result = CreateOrderSchema.safeParse({
    customerName: formData.get("customerName"),
    totalAmountCents: Number(formData.get("totalAmountCents")),
    turnstileToken: formData.get("turnstileToken"),
  });

  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
      error: "Validation failed.",
    };
  }

  // 2. Cloudflare Turnstile Verification
  const isHuman = await verifyTurnstileToken(result.data.turnstileToken);
  if (!isHuman) {
    return { success: false, error: "Bot verification failed." };
  }

  // 3. Authenticate and Extract Tenant Context from Cryptographic JWT
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Authentication required." };
  }

  const tenantId = user.app_metadata.tenant_id as string;
  if (!tenantId) {
    return { success: false, error: "Missing tenant organization claims." };
  }

  // 4. Execute Scoped Database Insert (Protected by RLS)
  const { data, error } = await supabase
    .from("orders")
    .insert({
      tenant_id: tenantId,
      created_by: user.id,
      customer_name: result.data.customerName,
      total_amount_cents: result.data.totalAmountCents,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: `Failed to create order: ${error.message}` };
  }

  // 5. Invalidate Next.js Data Cache
  revalidateTag(`tenant-${tenantId}-orders`);

  return {
    success: true,
    data: { id: data.id },
  };
}
```

---

## 5. Phase 4: UI/UX Component Reconstruction

Replace legacy server-rendered templates (Blade, Jinja) or client-heavy SPAs (CRA) with streaming React Server Components and Zero-CLS skeleton loaders.

### 5.1 Architecture Conversion Rules
1. **Server Component by Default**: Fetch data directly in the RSC without client-side `useEffect` or `fetch()` cascades.
2. **Suspense Boundaries**: Wrap data tables, metric cards, and charts in `<Suspense fallback={<Skeleton... />}>`.
3. **Interactive Islands**: Restrict `"use client"` exclusively to interactive form components, modals, and client-side calculators.
4. **Header Integration**: Mount `PageHeader` at the top of every dashboard view.

---

## 6. Phase 5: Production Security Verification

Before deploying the migrated application, run the automated security validation suite and verify compliance against all 14 threat handbooks.

### 6.1 Execution Commands
```bash
# 1. Run unit and integration tests for validation tooling
npm run test:audit-scripts

# 2. Validate findings document against report-schema.json
npm run audit:validate-findings -- path/to/findings.json

# 3. Verify complete coverage ledger
npm run audit:validate-coverage -- path/to/coverage-ledger.json
```

### 6.2 Threat Vector Verification Checklist
- [ ] **Cross-Tenant Isolation**: Attempted to query Tenant B's records with Tenant A's session token; confirmed zero rows returned.
- [ ] **Service-Role Key Quarantine**: Ran `grep -rn "SUPABASE_SERVICE_ROLE_KEY" app/ components/`; confirmed clean.
- [ ] **Turnstile Bot Challenge**: Tested mutation endpoints without Turnstile token; confirmed immediate rejection.
- [ ] **Zero-CLS Verification**: Ran Google Lighthouse / Web Vitals test; confirmed Cumulative Layout Shift score $< 0.05$.
- [ ] **CSP Nonce Inspection**: Inspected HTTP response headers; confirmed active `Content-Security-Policy` with request nonces.
