# Keshab Datt Bhatt — Executive Portfolio & CMS Monorepo

Enterprise-grade bilingual digital portfolio, thought leadership platform, and mobile content management suite for **Keshab Datt Bhatt** (Senior Banking Technology Executive & IT Leader, Kathmandu, Nepal).

---

## 🏛️ Architecture Overview

This repository is built as a high-performance **pnpm monorepo** managed with **Turborepo**:

```
keshab-bhatt-portfolio/
├── apps/
│   ├── portfolio-web/             # Next.js 15 (App Router, SSR/ISR, REST API Layer, Tailwind CSS)
│   └── portfolio-admin-mobile/    # Expo SDK 52 Mobile App (Expo Router, Drawer + Top Tabs, NativeWind)
│
├── packages/
│   ├── types/                     # Shared TypeScript interfaces & models
│   ├── validation/                # Zod schemas for request validation & integrity
│   ├── content/                   # Modular bilingual static content (en/ne) & initial seed
│   ├── ui/                        # Shared design tokens & foundation primitives
│   ├── typescript-config/         # Strict tsconfig presets
│   └── eslint-config/             # Unified code quality & linting rules
│
└── supabase/                      # PostgreSQL migration scripts & schema definitions
```

---

## 🚀 Applications

### 1. `portfolio-web` (`http://localhost:3000`)
- **Framework**: Next.js 15 with React 19, TypeScript, and Tailwind CSS.
- **Bilingual**: Internationalized routing (`/en` and `/ne`) for English and Nepali.
- **Executive Aesthetic**: Bespoke dark corporate grading with Deep Navy (`#061739`), Royal Gold (`#d4af37`), and Slate borders.
- **REST API Layer**:
  - `controllers/`: Handles HTTP requests, parameter extraction, and status codes.
  - `services/`: Encapsulates database queries (Prisma ORM) and in-memory fallbacks.
  - `models/`: Data mapping between Prisma PostgreSQL entities and core `BlogPost` models.
  - `utils/`: Structured JSON responses (`apiSuccess`, `apiPaginated`, `apiError`).
  - `config/`: Supabase client and PostgreSQL connection configuration.
- **24/7 Supabase Keep-Alive**: Automated heartbeat route at `/api/cron/keep-alive` preventing inactivity pauses on Supabase free tier.

### 2. `portfolio-admin-mobile`
- **Framework**: Expo SDK 52 with Expo Router.
- **Styling**: NativeWind (Tailwind CSS for React Native) matching web executive color grading.
- **Navigation Hierarchy**:
  - **Outer Drawer**: Executive profile header with Keshab Bhatt avatar, navigation links, and live web portal trigger.
  - **Top Tabs (Facebook-Style)**: Horizontal tab bar at the top with active indicator (Dashboard, Articles, New Post, Cloud Sync).
  - **Nested Stack**: Dedicated routes for article reading (`/article/[slug]`) and editing (`/article/edit/[slug]`).
- **Zero Emojis**: 100% compliant with enterprise clean code standards using `@expo/vector-icons` / Lucide icons.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js `>= 20.x`
- pnpm `>= 9.x`

### Installation
```bash
# Install dependencies across all apps and packages
pnpm install
```

### Development
```bash
# Start all applications concurrently
pnpm dev

# Or start specific projects:
pnpm --filter @keshab-bhatt/web dev      # Next.js Web on http://localhost:3000
pnpm --filter @keshab-bhatt/mobile dev   # Expo Mobile App
```

### Type Checking & Quality Control
```bash
# Run strict TypeScript verification across entire workspace
pnpm typecheck
```

---

## 🔒 Security & Database Integration
- **PostgreSQL**: Hosted on Supabase (ap-southeast-1 pooler).
- **ORM**: Prisma with transaction connection pooling (`pgbouncer=true`).
- **Input Validation**: Strict Zod runtime schemas in `@keshab-bhatt/validation`.
- **Fault-Tolerant Fallback**: Graceful in-memory rendering if cloud connectivity fluctuates.
