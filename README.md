# Keshab Datt Bhatt — Executive Portfolio & CMS Monorepo

Enterprise-grade bilingual digital portfolio, thought leadership platform, and mobile content management suite for **Keshab Datt Bhatt** — Executive Business & Finance Consultant in Nepal specializing in banking, capital markets, and corporate governance.

🌐 **Live Production Website**: [https://keshabbhatt.com.np](https://keshabbhatt.com.np)

---

## 🏛️ Monorepo Architecture

This project is structured as a high-performance **pnpm monorepo** orchestrated with **Turborepo**:

```
keshab-bhatt-portfolio/
├── apps/
│   ├── portfolio-web/             # Next.js App Router, Dynamic MongoDB Atlas API, Tailwind CSS
│   └── portfolio-admin-mobile/    # Expo SDK 52 Mobile Admin App, NativeWind, JWT Auth
│
├── packages/
│   ├── types/                     # Shared TypeScript interfaces & Domain Models
│   ├── validation/                # Zod schemas for runtime validation & request integrity
│   ├── content/                   # Structured bilingual content (EN / NE) & defaults
│   ├── ui/                        # Shared design system primitives & tokens
│   ├── typescript-config/         # Strict TypeScript configurations
│   └── eslint-config/             # Unified linting and code quality standards
```

---

## 🚀 Applications

### 1. `portfolio-web` — Executive Web Application & API
- **Framework**: Next.js App Router with React 19, TypeScript, and Tailwind CSS.
- **Bilingual Experience**: Dynamic internationalized routing (`/en` and `/ne`) with seamless locale switching.
- **Executive Visual Identity**: Bespoke dark corporate grading with Deep Navy (`#061739`), Royal Gold (`#d4af37`), and refined slate borders.
- **Mobile Responsive Drawer**: Mobile navigation drawer with full touch controls portaled directly to `document.body` with zero horizontal viewport shift (`overflow-x: clip`).
- **Dynamic Database Layer**: Enforces `force-dynamic` rendering for MongoDB Atlas to deliver real-time article publication without stale SSG caching.
- **Search Engine Optimization (SEO)**:
  - Strictly matching self-referential canonical and hreflang alternate links without trailing-slash discrepancies.
  - Hardened HTTP headers: `poweredByHeader: false` (removes `X-Powered-By`).
  - Automated JSON-LD structured schema markup (Person, CollectionPage, BlogPosting) and OpenGraph/Twitter metadata.
- **RESTful API Engine**:
  - `/api/blogs`: Full article retrieval, creation, updating, and deletion.
  - `/api/categories`: Public and admin category taxonomies.
  - `/api/admin/auth/login`: JWT-based superadmin authentication with secure cookie lifecycle.
  - `/api/health`: Real-time system health and database connectivity diagnostics.

### 2. `portfolio-admin-mobile` — Executive Mobile Management Suite
- **Framework**: Expo SDK 52 with Expo Router.
- **Styling**: NativeWind (Tailwind CSS for React Native) matching web executive color grading.
- **Mobile Navigation**:
  - **Executive Drawer**: Quick access to profile info, web portal link, and theme toggling.
  - **Top Tabs Bar**: Rapid switching across Dashboard, Articles list, New Post composer, and Analytics.
  - **Nested Route Stack**: Dedicated screens for reviewing, editing, and publishing content on the go.
- **Enterprise Security**: Bearer JWT token authentication, secure persistent storage, and automated network retry.

---

## 🛠️ Tech Stack & Foundations

| Domain | Technology |
|---|---|
| **Language** | TypeScript (Strict mode enabled across all packages) |
| **Monorepo Manager** | Turborepo & pnpm Workspaces |
| **Web Frontend** | Next.js (App Router), React 19, Tailwind CSS |
| **Mobile App** | Expo (SDK 52), Expo Router, React Native, NativeWind |
| **Database** | MongoDB Atlas with Mongoose ODM (Direct replica-set resolution) |
| **Authentication** | JWT (JSON Web Tokens) & Bcrypt password hashing |
| **Validation** | Zod (Runtime validation & shared schemas) |

---

## 💻 Getting Started

### Prerequisites
- **Node.js** `>= 20.x`
- **pnpm** `>= 9.x`

### Installation
```bash
# Clone the repository
git clone https://github.com/mahendramahara/keshabbhatt.com.np.git
cd keshab-bhatt-portfolio

# Install monorepo dependencies
pnpm install
```

### Environment Configuration
Create `.env.local` inside `apps/portfolio-web/` (or copy `.env.example`):
```env
# MongoDB Connection String (Atlas Cloud)
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio_db"

# JWT Authentication Secret Key
JWT_SECRET="your-secure-random-jwt-secret-key-32-characters"

# Super Admin Initial Credentials (Auto-seeded dynamically)
SUPERADMIN_NAME="Keshab Datt Bhatt"
SUPERADMIN_EMAIL="admin@example.com"
SUPERADMIN_USERNAME="admin"
SUPERADMIN_PASSWORD="your-strong-password"

# Public URL of the web application
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Database Seeding
```bash
# Seed initial categories, superadmin, articles, and CV document into Atlas
node --env-file=apps/portfolio-web/.env.local apps/portfolio-web/scripts/clean-and-seed.mjs
```

### Development
```bash
# Start all applications concurrently
pnpm dev

# Or start individual applications:
pnpm --filter @keshab-bhatt/web dev        # Next.js web application (http://localhost:3000)
pnpm --filter @keshab-bhatt/mobile dev     # Expo mobile admin application
```

### Build & Type Verification
```bash
# Typecheck all packages and applications (0 errors required)
pnpm turbo run typecheck

# Build web application bundle for production
pnpm turbo run build --filter=@keshab-bhatt/web
```

---

## 🌐 Production Deployment (Vercel)

1. **Connect Repository to Vercel**: Import the monorepo root.
2. **Framework Preset**: Next.js (Root `vercel.json` coordinates Turborepo builds automatically).
3. **Atlas Network Access**: Ensure MongoDB Atlas has `0.0.0.0/0` enabled in IP Access List to allow Vercel dynamic serverless IPs.
4. **Environment Variables**: Configure in Vercel Project Settings:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `SUPERADMIN_NAME`
   - `SUPERADMIN_EMAIL`
   - `SUPERADMIN_USERNAME`
   - `SUPERADMIN_PASSWORD`
   - `NEXT_PUBLIC_SITE_URL` (`https://keshabbhatt.com.np`)

---

## 📄 License & Attribution

Designed and maintained for **Keshab Datt Bhatt**. All rights reserved.
