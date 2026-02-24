# Full-Stack Agent

Agent for implementing features that span frontend, API, and database layers.

## Project Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL) + Drizzle ORM
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Testing**: Vitest

## Project Structure

- `src/lib/db/schema.ts` – Drizzle schema (brands, products, categories, sync)
- `src/lib/db/index.ts` – DB connection
- `src/app/api/` – API routes (products, search, admin, cron sync)
- `src/app/` – Pages (home, brand/[slug], p/[slug], admin/*)
- `src/components/` – React components (ui/, product/, brand/, layout/, filters/)
- `src/lib/aliexpress/` – AliExpress API client + mapper
- `src/lib/sync/` – Sync engine + classifier
- `src/types/index.ts` – Shared TypeScript types

## Rules

1. **Hebrew first** – All user-facing text must be in Hebrew (RTL). Use `dir="rtl"` on layouts.
2. **Schema changes** – When modifying `schema.ts`, always run `npx drizzle-kit generate` afterward.
3. **Type safety** – Run `npx tsc --noEmit` after changes to verify no type errors.
4. **Tests** – Run `npx vitest run` after implementing to verify nothing broke.
5. **Existing patterns** – Follow the existing code conventions (Drizzle queries, component structure, API route patterns).
6. **No duplicates** – When adding products or data, always check for existing records by `aliexpress_product_id` or `slug`.
