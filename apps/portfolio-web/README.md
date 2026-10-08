# @keshab-bhatt/web — Portfolio Web Application & API

The primary web application and REST API backend for Keshab Datt Bhatt's executive portfolio.

---

## 🏛️ Directory Structure

```
apps/portfolio-web/
├── app/
│   ├── [locale]/                  # Internationalized pages (/en, /ne)
│   │   ├── articles/              # Articles directory & search
│   │   │   └── [slug]/            # Full article view & reading view
│   │   └── page.tsx               # Main localized executive landing page
│   ├── api/
│   │   ├── blogs/                 # REST API endpoints (GET, POST)
│   │   │   └── [slug]/            # Single blog endpoints (GET, PATCH, DELETE)
│   │   └── cron/
│   │       └── keep-alive/        # Automated Supabase heartbeat ping
│   ├── layout.tsx                 # Root layout with fonts & metadata
│   └── globals.css                # Tailwind CSS design system tokens
│
├── controllers/                   # HTTP controllers (request parsing, response formatting)
│   ├── blog.controller.ts
│   └── index.ts
│
├── services/                      # Business logic & database operations
│   ├── blog.service.ts
│   └── index.ts
│
├── models/                        # Domain models & database entity mappers
│   ├── blog.model.ts
│   └── index.ts
│
├── config/                        # Supabase & infrastructure configuration
│   ├── supabase.ts
│   └── index.ts
│
├── utils/                         # Standardized JSON response utilities
│   ├── api-response.ts
│   └── index.ts
│
├── lib/                           # Singleton clients & background jobs
│   ├── prisma.ts                  # Cached Prisma Client instance
│   ├── keep-alive.ts              # 24/7 Keep-alive heartbeat runner
│   ├── blog-client.ts             # Client-side API consumer SDK
│   └── index.ts
│
└── components/                    # Reusable UI components & section blocks
    ├── ui/                        # Low-level primitives
    └── index.ts                   # Component barrel export
```

---

## 🚀 Running Locally

```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portfolio.
API endpoints are available at:
- `GET /api/blogs`
- `GET /api/blogs/:slug`
- `POST /api/blogs`
- `PATCH /api/blogs/:slug`
- `DELETE /api/blogs/:slug`
- `GET /api/cron/keep-alive`
