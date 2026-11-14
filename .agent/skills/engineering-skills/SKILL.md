---
name: engineering-skills
description: "Engineering standards for building full-stack apps with Next.js, Supabase, and Vercel. Use when designing application architecture (Server/Client Components, Server Actions, Route Handlers), database models and migrations, backend logic (auth, RBAC, validation, caching, background jobs, uploads), CI/CD and deployment, performance tuning, or writing tests and doing code review."
---

# Technical Skills
Engineering practices, technologies, and tools I use to build applications with **Next.js**, **Supabase**, and **Vercel**.

---

## Engineering Skills
How I design, build, secure, test, and deploy software across the modern full-stack web ecosystem.

### Software Architecture
Application structure, design patterns, and maintainability
- Server & Client Component Architecture (React Server Components / RSC)
- Service Layer Architecture (Server Actions & Route Handlers)
- REST & RPC API Architecture
- SOLID Principles
- Separation of Concerns
- Scalable Full-Stack Application Design

### Database Engineering
Reliable data models and efficient database operations with Supabase (PostgreSQL)
- Database Design & Relational Modeling (PostgreSQL)
- Database Normalization
- SQL Query Optimization
- Database Indexing (B-Tree, GIN, GiST)
- ACID Transactions
- Foreign Keys & Constraints
- Database Migrations (Supabase CLI / Prisma / Drizzle)
- Concurrency & Race Condition Handling
- Pagination (Keyset / Cursor-based & Offset)

### DevOps & Deployment
Automated delivery and production operations with Vercel & Supabase
- CI/CD Pipelines (Vercel Git Integration & GitHub Actions)
- Preview Deployments & Branch Environments (Vercel Previews & Supabase Branching)
- Environment Variable & Secret Management
- Zero-Downtime Production Deployment
- Edge & Serverless Runtime Configuration
- Custom Domain & DNS Management
- SSL/TLS & HTTPS Management
- Logging, Analytics & Web Vitals Monitoring (Vercel Observability)

### Backend Engineering
Business logic, access rules, and background processing
- Authentication & Session Management (Supabase Auth, SSR Cookie Sessions)
- Role-Based Access Control (RBAC) & Claims
- Input & Form Validation (Server Actions with Zod)
- Rate Limiting (Upstash / Vercel Edge Middleware)
- Data Caching & Revalidation (`unstable_cache`, `revalidateTag`, `revalidatePath`)
- Background Jobs & Queues (Supabase pg_cron, Database Webhooks, Inngest / QStash)
- Third-Party API Integration (REST & Webhooks)
- File & Asset Upload Handling (Supabase Storage with Signed URLs)
- Transactional Emails & Event Notifications (Resend / Supabase Auth Hooks)

### Security
Secure application behavior and common vulnerability prevention
- Row-Level Security (Postgres RLS Policies in Supabase)
- OWASP Fundamentals
- IDOR / BOLA Prevention (RLS & Session Verification)
- CSRF Protection (Next.js Server Actions origin checks)
- XSS Prevention (React escaping & Content Security Policies)
- SQL Injection Prevention (Supabase Parameterized Queries / ORM)
- Secure Authentication (PKCE Flow, HTTP-only Cookies, MFA)
- Input Sanitization & Validation (Schema parsing with Zod)

### Performance & Scalability
Efficient queries, loading, and application growth
- Query Optimization with Postgres EXPLAIN ANALYZE
- N+1 Query Prevention
- Application Caching (Next.js Data Cache, Full Route Cache)
- Edge Middleware & CDN Asset Caching
- Asset & Script Optimization (`next/image`, `next/font`)
- Streaming SSR & Suspense Boundaries
- Serverless & Edge Autoscaling (Vercel Serverless Functions)

### Testing & Code Quality
Verification, collaboration, and maintainable code
- Unit Testing (Vitest / Jest)
- Integration & Component Testing (React Testing Library)
- End-to-End (E2E) & API Testing (Playwright)
- Regression Testing
- Git Branching & Pull Request Workflows
- Code Review & Static Analysis (ESLint, Prettier, TypeScript)
- Debugging (React DevTools, Vercel Function Logs, Supabase Query Inspector)
