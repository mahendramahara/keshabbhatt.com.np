# @keshab-bhatt/web — Portfolio Web Application, REST API & Admin Portal

The primary web application, REST API backend, and Administration Portal for Keshab Datt Bhatt's executive portfolio.

---

## 🏛️ Directory Structure

```
apps/portfolio-web/
├── app/
│   ├── [locale]/                  # Internationalized pages (/en, /ne)
│   │   ├── articles/              # Articles directory & search
│   │   │   └── [slug]/            # Full article view & reading view
│   │   └── page.tsx               # Main localized executive landing page
│   ├── admin/                     # Executive Administration Portal
│   │   ├── layout.tsx             # Admin shell with right sidebar & theme provider
│   │   ├── login/                 # Administrator secure authentication
│   │   ├── dashboard/             # Overview metrics & quick actions
│   │   ├── categories/            # Blog category management (CRUD)
│   │   ├── blogs/                 # Blog post listing & filters
│   │   │   ├── new/               # Write article with rich WYSIWYG editor
│   │   │   └── [id]/edit/         # Article modification & publishing
│   │   └── admins/                # Administrator user management & privileges
│   ├── api/
│   │   ├── admin/                 # Protected administration endpoints (auth, admins, categories, stats)
│   │   ├── blogs/                 # Public & authenticated REST endpoints
│   │   └── cron/                  # Health check & monitor endpoints
│   ├── layout.tsx                 # Root layout with fonts & metadata
│   └── globals.css                # CSS custom properties & design system tokens
│
├── components/
│   ├── admin/                     # Component-based Admin Architecture
│   │   ├── ui/                    # Primitives: buttons, inputs, rich editor, modal, badges
│   │   ├── layout/                # Admin header, right sidebar, footer, shell, auth guard
│   │   └── features/              # Feature blocks: user manager, category manager, blog editor
│   └── ui/                        # Public website components
│
├── controllers/                   # HTTP controllers (request parsing, response formatting)
│   ├── admin-auth.controller.ts
│   ├── admin-user.controller.ts
│   ├── category.controller.ts
│   ├── blog.controller.ts
│   └── index.ts
│
├── services/                      # Business logic & MongoDB operations
│   ├── admin.service.ts
│   ├── category.service.ts
│   ├── blog.service.ts
│   └── index.ts
│
├── models/                        # Mongoose schemas & domain models
│   ├── admin.model.ts             # Salted bcrypt password hashing & permissions
│   ├── blog-category.model.ts     # Normalized category taxonomy
│   ├── blog.model.ts              # Normalized blog posts referencing categories
│   └── index.ts
│
├── config/                        # Database & environment configuration
│   ├── database.ts                # MongoDB connection & superadmin auto-seeder
│   ├── env.ts
│   └── index.ts
│
├── lib/                           # Helpers & utilities
│   ├── auth.ts                    # JWT token signing, verification & cookie management
│   ├── blog-client.ts             # API consumer SDK
│   └── index.ts
│
└── utils/                         # Standardized JSON response utilities
    ├── api-response.ts
    └── index.ts
```

---

## 🔐 Administration Portal (/admin)

- **Secure Login**: Authenticate with username or email address. Passwords hashed using bcrypt with salt.
- **Superadmin Auto-Seed**: Automatically initializes a protected superadmin from `SUPERADMIN_USERNAME`, `SUPERADMIN_EMAIL`, and `SUPERADMIN_PASSWORD` in your `.env`.
- **Admin Management**: Superadmin can create and manage admins. Superadmin account cannot be deleted.
- **Normalized Blog Categories**: Dedicated taxonomy management with custom color swatches and display order.
- **Executive Rich Text Editor**: Full toolbar (headings, bold, italic, lists, quotes, code, links, images, undo/redo) + raw HTML source view.
- **Right-Side Sidebar**: Dedicated collapsible right sidebar panel.
- **Natural Theme Switcher**: Full support for dark/light mode and 3 executive palettes (Navy Gold, Slate Corporate, Emerald Wealth).

---

## 🚀 Running Locally

```bash
# Start MongoDB (if running locally)
mongod

# Start Next.js development server
pnpm dev
```
