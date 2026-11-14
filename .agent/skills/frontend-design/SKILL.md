---
name: frontend-design
description: "Frontend design and UI engineering standards for Next.js 16, Tailwind CSS v4 (OKLCH tokens), and shadcn/ui. Read this skill BEFORE creating or modifying any .tsx UI component, page, layout, card grid, form, or dashboard."
---

# Frontend Design & shadcn/ui Architecture Skill

This skill defines the mandatory frontend architecture and UI rules for building clean, accessible, responsive interfaces in this Next.js 16 + Tailwind CSS v4 + **shadcn/ui** starter pack.

---

## 1. Mandatory `shadcn/ui` First Rule

1. **Always Use `shadcn/ui` Primitives (`@/components/ui/*`)**:
   - Every card, button, badge, alert, separator, table, tab bar, dialog, dropdown, input, tooltip, skeleton, or empty state **MUST** be built by composing pre-installed primitives from `src/components/ui/`:
     - Layout & Surfaces: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`, `Separator`, `ScrollArea`, `ResizablePanelGroup`, `Tabs`, `Accordion`, `Collapsible`, `Sheet`, `Drawer`, `Sidebar`
     - Actions & Navigation: `Button`, `ButtonGroup`, `DropdownMenu`, `NavigationMenu`, `Breadcrumb`, `Pagination`, `Command`, `Toggle`, `ToggleGroup`
     - Data Display & Status: `Badge`, `Alert`, `AlertTitle`, `AlertDescription`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `Avatar`, `Progress`, `Skeleton`, `Spinner`, `Empty`, `Kbd`, `Tooltip`, `HoverCard`
     - Forms & Inputs: `Input`, `InputGroup`, `InputOTP`, `Textarea`, `Select`, `NativeSelect`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `Calendar`, `Label`, `Field`
2. **Zero Raw HTML Substitutes**:
   - **Never** hand-code raw `<button>`, `<input>`, `<select>`, `<textarea>`, custom badge `<span>` pills, or custom bordered `<div>` cards with ad-hoc Tailwind classes when a `shadcn/ui` component exists.
   - For Next.js `<Link>` or `<a>` styled as buttons or badges, use the Base UI `render` prop on `Button` or `Badge` (e.g., `<Button variant="outline" size="sm" nativeButton={false} render={<Link href="/route" />}>...</Button>`).
3. **CLI Installation Only**:
   - Before building a custom component, inspect `src/components/ui/`. If a needed primitive is not present yet, install it via `npx shadcn@latest add <component>` and record it in the active ticket.

---

## 2. Card & Grid Layout Guardrails (Prevent Cramped Headers & Clipped Badges)

Multi-column grids (`md:grid-cols-2`, `lg:grid-cols-3`, `lg:grid-cols-4`) have constrained horizontal width (`~260px–320px` per card). Follow these strict layout guardrails to prevent narrow 1–2 word title columns and clipped badges:

1. **Never Crowd Icon + Long Title + Badge on a Single Row**:
   - Do **NOT** place an icon, a multi-word title, and a status badge inside a single horizontal flex row (`flex items-center justify-between`) or a side-by-side `CardAction` grid when the title can exceed 20 characters.
2. **Standard 2-Row `<CardHeader>` Pattern**:
   - **Row 1 (Metadata Top Row)**: Put the icon container (`size-9 rounded-lg border bg-muted/50 flex items-center justify-center`) on the left and `<Badge variant="secondary" className="shrink-0">` (or `variant="outline"`) on the right inside `<div className="flex items-center justify-between gap-2">`.
   - **Row 2 (Full-Width Title)**: Place `<CardTitle className="pt-3 text-base leading-snug">` on its own full-width line underneath the metadata row so titles read naturally across the entire card width and badges never clip or overflow.
3. **Equal-Height Cards in Grids (`flex h-full flex-col`)**:
   - Always apply `className="flex h-full flex-col"` on `<Card>` inside CSS grids.
   - Place body copy or metrics inside `<CardContent className="flex-1">` so variable-length content expands evenly.
   - Place file path chips, tags, or card actions inside `<CardFooter className="flex flex-wrap gap-1.5 pt-0">` (or with border top) using `<Badge variant="outline" className="font-mono text-[11px]">` so footers align across every row.

```tsx
<Card className="flex h-full flex-col">
  <CardHeader>
    <div className="flex items-center justify-between gap-2">
      <div className="bg-muted/50 flex size-9 items-center justify-center rounded-lg border">
        <Layers className="text-primary size-4" />
      </div>
      <Badge variant="secondary" className="shrink-0">
        App Router + RSC
      </Badge>
    </div>
    <CardTitle className="pt-3 text-base leading-snug">
      Next.js 16 &amp; React 19
    </CardTitle>
  </CardHeader>
  <CardContent className="flex-1">
    <CardDescription className="text-xs leading-relaxed">
      App Router with React Compiler, Turbopack dev server, and strict TypeScript.
    </CardDescription>
  </CardContent>
  <CardFooter className="flex flex-wrap gap-1.5 border-t-0 bg-transparent pt-0">
    <Badge variant="outline" className="font-mono text-[11px]">
      src/app/layout.tsx
    </Badge>
  </CardFooter>
</Card>
```

---

## 3. OKLCH Tokens, Canonical Tailwind v4 & Responsive Polish

1. **Semantic OKLCH Tokens**:
   - Always use project theme tokens from `src/app/globals.css`: `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `text-muted-foreground`, `border-border`, `bg-muted/50`, `bg-primary`, `text-primary-foreground`, and `text-destructive`.
   - Avoid hardcoded zinc/gray hex values inside `shadcn/ui` sections so both light and dark modes maintain crisp contrast.
2. **Canonical Tailwind CSS v4 Syntax**:
   - Use percentage opacities (`/10`, `/50`, `/80`) instead of bracket decimals (`/[.10]`).
   - Use standard 4px scale spacing (`size-9`, `gap-1.5`, `p-6`) instead of arbitrary pixel brackets.
   - Always include `whitespace-nowrap` and `shrink-0` on badges and icon buttons.
3. **Zero Horizontal Overflow (`390px` → `1440px`)**:
   - Wrap multi-badge or multi-button toolbars in `flex flex-wrap items-center gap-2`.
   - Use `<Table>` (which includes `overflow-x-auto`) or `min-w-0 truncate` on long monospace identifiers and URLs so mobile viewports (`390x844`) never scroll horizontally.
4. **Server Component First**:
   - Keep page and layout components as React Server Components (`async` / non-client) by default. Isolate interactive browser APIs (`navigator.clipboard`, WebSocket subscriptions, state) into small `"use client"` components.
