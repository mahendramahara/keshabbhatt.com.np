# @keshab-bhatt/mobile — Portfolio Admin Mobile Application

Cross-platform executive content management suite built with **Expo SDK 52** and **Expo Router** for managing Keshab Datt Bhatt's portfolio articles, monitoring Supabase health, and publishing thought leadership insights.

---

## 🏛️ Directory Structure

```
apps/portfolio-admin-mobile/
├── assets/images/                 # Keshab Bhatt portrait, app icons & splash
│
├── src/
│   ├── app/                       # Expo Router file-based routing
│   │   ├── _layout.tsx            # Root GestureHandler & Stack Navigator
│   │   ├── index.tsx              # Root redirect to (drawer)
│   │   ├── (drawer)/
│   │   │   ├── _layout.tsx        # Outer Drawer navigation
│   │   │   └── index.tsx          # Main CMS view with Facebook-style Top Tabs
│   │   └── article/
│   │       ├── [slug].tsx         # Article Details Stack View
│   │       └── edit/[slug].tsx    # Article Edit Stack View
│   │
│   ├── components/
│   │   ├── pages/                 # Presentation views receiving props
│   │   │   ├── DashboardPageView.tsx
│   │   │   ├── ArticlesPageView.tsx
│   │   │   ├── CreateArticlePageView.tsx
│   │   │   ├── CloudSyncPageView.tsx
│   │   │   ├── ArticleDetailView.tsx
│   │   │   ├── EditArticlePageView.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── ui/                    # Reusable UI primitives (NativeWind styled)
│   │       ├── AppHeader.tsx
│   │       ├── TopTabBar.tsx      # Facebook-style top tab bar
│   │       ├── BlogCard.tsx
│   │       ├── StatCard.tsx
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── CustomDrawerContent.tsx
│   │       └── index.ts
│   │
│   ├── services/                  # Mobile API service layer
│   │   ├── api.ts                 # Full CRUD & keep-alive methods
│   │   └── index.ts
│   │
│   ├── store/                     # State coordination
│   │   └── tab-context.tsx        # Sync between Drawer & Top Tabs
│   │
│   ├── constants/                 # Theme tokens & typography
│   │   └── theme.ts
│   │
│   └── global.css                 # NativeWind utility definitions
│
├── app.json                       # Expo configuration
├── metro.config.js                # Metro bundler with NativeWind
├── tailwind.config.js             # Executive dark color grading
└── tsconfig.json                  # TypeScript path mappings (@/*)
```

---

## 🚀 Running the App

```bash
# Start development server
pnpm dev

# Run on Android emulator
pnpm android

# Run on iOS simulator
pnpm ios

# Run web preview
pnpm web
```

---

## 🎨 Design Philosophy
- **Executive Grading**: Matching the web application with Deep Navy (`#061739`, `#081c42`, `#040e24`) and Gold accents (`#d4af37`).
- **NativeWind**: 100% utility-based styling with Tailwind classes.
- **Top Tab Bar**: Facebook-style horizontal tabs anchored at the top with active indicator.
- **Zero Emojis**: Uses professional Ionicons and Lucide icons throughout.
