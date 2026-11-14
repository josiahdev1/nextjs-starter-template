# UI/UX Design System & Zero-CLS Skeletons Standard
## Tactile Claymorphic Aesthetics, Predictable Ergonomics, & Streaming UI

---

## 1. Executive Principles & Design Philosophy

Enterprise software demands rapid, predictable, and visually stable user interfaces. High-stakes workflows—such as financial audits, inventory management, and multi-tenant administration—cannot tolerate interface jitter, jarring layout shifts, or disorienting animations.

This design system standard enforces three foundational mandates:
1. **Zero Cumulative Layout Shift (CLS)**: Full-screen blocking loaders (e.g., "Loading application...", generic central spinners, or blank white screens) are strictly banned. Every asynchronous data boundary must render a 1:1 structural skeleton placeholder matching exact production dimensions.
2. **Tactile Claymorphic Aesthetics**: Modern, subdued tactile surfaces featuring subtle inner and drop shadows, crisp border contrasts, micro-elevations, and refined monochromatic tones with deliberate semantic accents.
3. **Enterprise Ergonomics & Touch Parity**: Interfaces must be fully operational on desktop, laptop, and iPad/Tablet landscape touch devices ($\ge 48\text{px}$ touch targets), adhering to WCAG 2.1 AA/AAA accessibility standards.

---

## 2. Zero-CLS Skeleton Primitives

The skeleton architecture utilizes Tailwind CSS pulse animations over subtle neutral backgrounds. Each component matches the exact bounding box, padding, line heights, and margins of its hydrated counterpart.

### 2.1 Metric Card Skeleton (`components/skeletons/skeleton-card.tsx`)

Used for KPI metrics, summary tiles, and dashboard counters.
```tsx
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-6 shadow-sm",
        "flex flex-col justify-between space-y-4",
        className
      )}
      aria-busy="true"
      aria-label="Loading metric card"
    >
      <div className="flex items-center justify-between">
        {/* Metric Label Placeholder */}
        <div className="h-4 w-28 rounded-md bg-muted animate-pulse" />
        {/* Metric Icon Placeholder */}
        <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
      </div>

      <div className="space-y-2">
        {/* Large Metric Number Placeholder */}
        <div className="h-8 w-36 rounded-md bg-muted animate-pulse" />
        {/* Trend / Subtext Placeholder */}
        <div className="h-3 w-48 rounded-md bg-muted/80 animate-pulse" />
      </div>
    </div>
  );
}
```

---

### 2.2 Data Table Skeleton (`components/skeletons/skeleton-table.tsx`)

Configurable for paginated listings, transaction ledgers, and inventory reports. Matches exact row height (`h-14`) and header structure.
```tsx
import { cn } from "@/lib/utils";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: SkeletonTableProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden",
        className
      )}
      aria-busy="true"
      aria-label="Loading data table"
    >
      {/* Table Header Placeholder */}
      <div className="border-b border-border/60 bg-muted/30 px-6 py-4 flex items-center justify-between">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`header-${i}`}
            className="h-4 rounded bg-muted animate-pulse"
            style={{ width: `${Math.max(15, 80 / columns)}%` }}
          />
        ))}
      </div>

      {/* Table Body Rows Placeholder */}
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="px-6 py-4 flex items-center justify-between h-14"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 rounded bg-muted/70 animate-pulse"
                style={{
                  width: `${Math.max(12, (70 / columns) * (colIndex === 0 ? 1.2 : 0.85))}%`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Table Pagination Footer Placeholder */}
      <div className="border-t border-border/60 bg-muted/10 px-6 py-3 flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-muted animate-pulse" />
        <div className="flex space-x-2">
          <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
          <div className="h-8 w-20 rounded-md bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
```

---

### 2.3 Grid Catalog Skeleton (`components/skeletons/skeleton-grid.tsx`)

Used for catalog cards, team directories, and media item grids.
```tsx
import { cn } from "@/lib/utils";

interface SkeletonGridProps {
  items?: number;
  className?: string;
}

export function SkeletonGrid({ items = 6, className }: SkeletonGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
      aria-busy="true"
      aria-label="Loading catalog grid"
    >
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={`grid-item-${i}`}
          className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm flex flex-col"
        >
          {/* Media / Aspect Container */}
          <div className="aspect-video w-full bg-muted animate-pulse" />
          
          {/* Card Body */}
          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-3.5 w-full rounded bg-muted/80 animate-pulse" />
              <div className="h-3.5 w-2/3 rounded bg-muted/60 animate-pulse" />
            </div>

            <div className="pt-4 border-t border-border/40 flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-muted animate-pulse" />
              <div className="h-8 w-24 rounded-lg bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### 2.4 Form & Modal Skeleton (`components/skeletons/skeleton-form.tsx`)

Eliminates layout shifts in settings panels, auth forms, and modal dialogs.
```tsx
import { cn } from "@/lib/utils";

interface SkeletonFormProps {
  fields?: number;
  className?: string;
}

export function SkeletonForm({ fields = 4, className }: SkeletonFormProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card p-6 shadow-sm space-y-6 max-w-xl",
        className
      )}
      aria-busy="true"
      aria-label="Loading form"
    >
      <div className="space-y-2 pb-2 border-b border-border/40">
        <div className="h-6 w-40 rounded bg-muted animate-pulse" />
        <div className="h-4 w-64 rounded bg-muted/70 animate-pulse" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={`field-${i}`} className="space-y-2">
            <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
            <div className="h-11 w-full rounded-lg bg-muted/50 border border-border/40 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="pt-4 flex items-center justify-end space-x-3">
        <div className="h-10 w-24 rounded-lg bg-muted animate-pulse" />
        <div className="h-10 w-32 rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  );
}
```

---

## 3. Tactile Claymorphic `PageHeader` Standard

Every page across the authenticated enterprise dashboard must render the standard `PageHeader`. It establishes consistent spatial hierarchy, provides breadcrumbs, and features a subtle tactile micro-elevation.

### Complete TSX Implementation (`components/common/page-header.tsx`)

```tsx
import * as React from "react";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "outline" | "success" | "warning";
  };
  breadcrumbs?: BreadcrumbItem[];
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void | Promise<void>;
  actionHref?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Tactile Claymorphic PageHeader
 * Features subtle elevation, 48px touch parity, and standard typography hierarchy.
 */
export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  breadcrumbs,
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
  actionHref,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative w-full rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/95 p-6 sm:p-8",
        // Tactile Claymorphic Shadow Standard:
        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05),inset_0_1px_1px_0_rgba(255,255,255,0.8)]",
        "dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.05)]",
        "transition-all duration-150 mb-8",
        className
      )}
    >
      {/* Optional Breadcrumb Trail */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumbs"
          className="mb-3 flex items-center space-x-1.5 text-xs text-muted-foreground"
        >
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground transition-colors py-1 inline-flex items-center min-h-[32px]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={cn(isLast && "font-medium text-foreground")}>
                    {crumb.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-4">
          {Icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              {badge && (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/15 text-primary border border-primary/25">
                  {badge.label}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls / Children Slot */}
        <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
          {children}

          {actionLabel && (
            actionHref ? (
              <Button asChild size="default" className="min-h-[48px] px-5 font-medium shadow-sm">
                <Link href={actionHref}>
                  {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                  {actionLabel}
                </Link>
              </Button>
            ) : (
              <Button
                onClick={onAction}
                size="default"
                className="min-h-[48px] px-5 font-medium shadow-sm"
              >
                {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                {actionLabel}
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
```

---

## 4. Ergonomics & Standard Typography Scale

### 4.1 Touch Target Standard ($\ge 48\text{px}$)

Operational tools are frequently accessed on iPad or tablet landscape viewports in warehouses, field audits, and executive briefings. 
- **Minimum Interactive Bound**: All buttons, select menus, dropdown items, tabs, and pagination buttons must possess an explicit minimum bounding box of `48px x 48px` (or `min-h-[48px]`).
- **Form Controls**: Text inputs and dropdown triggers must use `h-11` or `h-12` (44px to 48px) with ample tap padding.

### 4.2 Standard Enterprise Typography Scale

Novelty oversized display fonts (48px / 64px) are strictly eliminated in data-dense dashboard modules. 

| Token | Class | Size / Leading | Target Usage |
| :--- | :--- | :--- | :--- |
| **Heading 1** | `text-2xl font-bold tracking-tight` | 24px / 32px | Top-level `PageHeader` titles only |
| **Heading 2** | `text-xl font-semibold` | 20px / 28px | Section headers, card group titles |
| **Heading 3** | `text-lg font-medium` | 18px / 26px | Modal titles, subsection headers |
| **Body (Default)** | `text-sm font-normal` | 14px / 20px | Standard data cells, descriptions, form labels |
| **Caption / Subtext**| `text-xs text-muted-foreground` | 12px / 16px | Timestamps, metadata, badges, tooltips |
| **KPI Metrics** | `text-3xl font-extrabold tracking-tight` | 30px / 36px | Numerical metric highlights in `SkeletonCard` |

---

## 5. Streaming SSR Integration Pattern

Connect zero-CLS skeletons to Next.js App Router streaming server components using React Suspense:

```tsx
// app/(dashboard)/[tenant]/inventory/page.tsx
import { Suspense } from "react";
import { PageHeader } from "@/components/common/page-header";
import { SkeletonTable } from "@/components/skeletons/skeleton-table";
import { InventoryTableRSC } from "@/modules/inventory/components/inventory-table-rsc";
import { Boxes, Plus } from "lucide-react";

export default function InventoryPage({ params }: { params: { tenant: string } }) {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Inventory Operations"
        description="Real-time multi-warehouse stock levels, SKU tracking, and inventory allocations."
        icon={Boxes}
        actionLabel="Add SKU"
        actionIcon={Plus}
        actionHref={`/${params.tenant}/inventory/new`}
      />

      {/* React Suspense Boundary with Zero-CLS Skeleton Fallback */}
      <Suspense fallback={<SkeletonTable rows={8} columns={5} />}>
        <InventoryTableRSC tenantId={params.tenant} />
      </Suspense>
    </main>
  );
}
```
