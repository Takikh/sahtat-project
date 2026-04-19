# Sahtat Promotion

Production website and admin dashboard for Sahtat Promotion (Médéa, Algeria), built with React + Vite + Supabase.

## Features

- Trilingual UI (FR/EN/AR) with RTL support
- Public website pages: Home, About, Projects, Services, News, Contact
- Client dashboard with purchased properties and construction updates
- Role-based admin panel:
	- analytics,
	- projects,
	- news,
	- reviews,
	- contacts,
	- client assignments,
	- user/role management
- Supabase-backed content for projects/news/reviews
- SEO basics (meta tags, robots, sitemap)

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui
- Supabase (Auth, Postgres, RLS)
- Vitest + Testing Library

## Prerequisites

- Node.js 20+
- npm 10+

## Environment variables

Copy `.env.example` to `.env` and set values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

`VITE_SUPABASE_PUBLISHABLE_KEY` should use a browser-safe key (preferably `sb_publishable_...`).
Do not place `SUPABASE_SERVICE_ROLE_KEY` or `sb_secret_...` in `.env` for frontend runtime.

## Run locally

1. Install dependencies
   - `npm install`
2. Start dev server
   - `npm run dev`
3. Open http://localhost:8080

## Scripts

- `npm run dev`: start development server
- `npm run build`: production build
- `npm run preview`: preview built app
- `npm run lint`: lint TypeScript/React code
- `npm run test`: run tests once
- `npm run test:watch`: run tests in watch mode

## Supabase notes

- App runtime uses environment variables from `.env`.
- Avoid hardcoding Supabase URL/keys in source files.
- If rotating keys, update `.env` and deployment environment variables.

### New quote + apartment modules (SQL activation)

This repository now includes:

- `supabase/migrations/20260419190000_project_quotes_and_unit_types.sql`
- `supabase/migrations/20260419191000_seed_project_unit_types.sql`

Apply both migrations before testing the new UI routes:

1. `supabase db push`
2. (Alternative) paste migration SQL files in Supabase SQL Editor and run in order.

Quick verification SQL:

```sql
SELECT slug, name FROM public.projects ORDER BY name;

SELECT p.slug, put.type_code, put.status, put.starting_price_dzd
FROM public.project_unit_types put
JOIN public.projects p ON p.id = put.project_id
ORDER BY p.slug, put.sort_order;

SELECT count(*) AS quote_requests
FROM public.project_quote_requests;
```

Public route to test after migration:

- `/projects/:slug-or-id/quote`

Admin tabs to test after migration:

- `Apartment Types`
- `Quotes`

### Admin user creation (secure)

Admin account creation from the dashboard now uses a Supabase Edge Function:

- Function path: `supabase/functions/admin-create-user/index.ts`
- Deploy it before using admin "Create Account":
  - `supabase functions deploy admin-create-user`
- Required function secrets:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

The function checks that the caller has `admin` role before creating users.

## Deployment (Vercel)

- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites and security headers are defined in `vercel.json`.

## SEO

- robots: `public/robots.txt`
- sitemap: `public/sitemap.xml`

## Admin access

Admin access is role-based only (`user_roles` table + RLS). No email-prefix fallback is used.
