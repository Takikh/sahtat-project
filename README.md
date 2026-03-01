# Sahtat Promotion – Promoteur Immobilier à Médéa

Official website for **Sahtat Promotion EURL**, a real estate developer based in Médéa, Algeria. The site showcases residential and commercial projects, company news, and provides client dashboards for tracking construction progress.

## Features

- **Trilingual** – French, English, and Arabic (with RTL support)
- **Dark / Light theme** toggle
- **Dynamic projects** – filterable by city, type, and status (powered by Supabase)
- **Contact form** – submissions stored in Supabase
- **Authentication** – sign in / sign up with email & password (Supabase Auth)
- **Client Dashboard** – purchased properties, construction progress updates with photos
- **Admin Panel** (role-based):
  - Analytics (page views, project interest charts)
  - Projects / News / Reviews / Contact messages CRUD
  - Construction progress updates per client property
  - User & role management
- **Page-view & project-interest analytics**
- **SEO** basics – Open Graph, Twitter Card meta tags
- **Responsive** design with mobile navigation

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite (SWC) |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Routing | React Router 6 |
| Data | Supabase (PostgreSQL, Auth, RLS) |
| State | TanStack React Query |
| i18n | i18next + react-i18next |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Theming | next-themes |
| Deployment | Vercel |
| Testing | Vitest + Testing Library |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18 (or [Bun](https://bun.sh/))
- A Supabase project with the required tables (see `supabase/migrations/`)

### Installation

```sh
# Clone the repo
git clone https://github.com/your-username/sahtat-project.git
cd sahtat-project

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### Environment Variables

Create a `.env` file at the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── admin/         # Admin panel tabs
│   ├── home/          # Homepage sections
│   ├── layout/        # Navbar, Footer, Layout wrapper
│   └── ui/            # shadcn/ui primitives
├── data/              # Static data (news, projects fallback)
├── hooks/             # Custom hooks (auth, tracking, toast)
├── i18n/              # Translations (en, fr, ar)
├── integrations/      # Supabase client & generated types
├── lib/               # Utilities
├── pages/             # Route-level page components
└── test/              # Test setup & specs
```

## Deployment

The project is configured for **Vercel** deployment via [vercel.json](vercel.json) with:
- SPA rewrite rules
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Immutable asset caching

## License

All rights reserved – Sahtat Promotion EURL.
