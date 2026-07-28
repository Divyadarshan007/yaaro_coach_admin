# Yaaro Coach — Project Documentation

> Living document. Update this file whenever the project's structure, stack, or features change.
> Last updated: 2026-07-28

## 1. What this project is

**Yaaro Coach** is a SaaS **admin dashboard for fitness/personal-training coaches** to manage their clients, training programs, and exercise libraries. It's a B2B tool: the coach logs in, sees an overview of client activity, and (eventually) creates training programs, assigns them to clients, and tracks progress.

Evidence for this domain (from actual UI copy and nav structure):
- Root layout metadata: `title: "Yaaro Coach"`, `description: "Yaaro Coach admin panel"`.
- Dashboard greeting: "Hello, {name} 👋 — Get an overview of your clients' progress." with a "Search clients" input and "+ Add Client" button.
- Stat cards: Total Clients, Active clients last 7 days, Inactive clients last 7 days.
- Onboarding checklist: "Create a program" → "Invite a client" → "Assign a program".
- Full intended nav (only Dashboard is currently active, rest are disabled placeholders): Dashboard, Clients, Program Library, Exercise Library, Chat, Grow, Settings, Team.
- A trial banner ("29 days left on your trial, upgrade to keep full access") confirms it's a paid subscription SaaS product.

**Current state:** early scaffold. Only the Dashboard screen is built, and it renders entirely on hardcoded mock data (no backend/API/database wired up yet). Every other nav item is a disabled stub.

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js **16.2.12** (App Router) — genuinely new, not a fork; see [§6](#6-important-non-standard-nextjs-16-behavior) for why AGENTS.md warns about it |
| UI runtime | React **19.2.4** (canary features: View Transitions, `useEffectEvent`, `Activity`) |
| Language | TypeScript 5, `strict: true` |
| Styling | Tailwind CSS **v4** (CSS-first config, no `tailwind.config.*` file) |
| Component primitives | shadcn/ui, style **`base-nova`** — built on **Base UI** (`@base-ui/react`), **not Radix** |
| Icons | `lucide-react` |
| Forms/validation | `react-hook-form` + `@hookform/resolvers` + `zod` |
| Client state | `zustand` |
| Tables | `@tanstack/react-table` (not yet used anywhere) |
| Lint | ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript); `next lint` is removed in Next 16, so lint runs via plain `eslint` |
| Bundler | Turbopack (default in Next 16, no flag needed) |

Scripts (`package.json`): `dev` → `next dev`, `build` → `next build`, `start` → `next start`, `lint` → `eslint`.

## 3. Folder structure

```
src/
  app/
    layout.tsx              RootLayout — Inter font, <html>/<body>, metadata (title "Yaaro Coach", icon /yaaro-icon.png)
    page.tsx                 RootPage — redirect("/dashboard")
    globals.css               Tailwind v4 + shadcn theme tokens (see §4)
    (main)/
      layout.tsx              MainLayout — SidebarShell + scrollable <main>, full height
      dashboard/
        page.tsx               DashboardPage — feeds mock data into DashboardView

  components/
    layout/                  App shell/navigation chrome
      sidebar.tsx              SidebarShell — desktop collapsible aside + mobile Sheet drawer
      sidebar-content.tsx      composes logo, search, nav, trial banner
      sidebar-logo.tsx, sidebar-nav.tsx, sidebar-nav-item.tsx, sidebar-search.tsx
      mobile-topbar.tsx
      trial-banner.tsx         trial countdown + "Upgrade Now"
    shared/                  Cross-feature reusable UI (generic, not shadcn primitives)
      empty-state.tsx          icon + title + description + action
      meter.tsx                thin wrapper over Base UI Progress
      stat-card.tsx            generic clickable stat tile
    ui/                      shadcn/ui primitives (Base UI-backed): button, card, input, progress, separator, sheet

  features/
    dashboard/               Only feature implemented so far — establishes the "feature folder" pattern
      components/
        dashboard-greeting.tsx          "Hello, {name} 👋" + client search + "+ Add Client"
        dashboard-view.tsx               composes the full dashboard page body
        latest-activities-panel.tsx      Card + EmptyState ("No activities yet")
        onboarding-card.tsx               "Let's get started" checklist card
        onboarding-checklist.tsx / onboarding-checklist-item.tsx / onboarding-preview-graphic.tsx
        stat-card-row.tsx                 renders StatCard[] from data
        weekly-active-clients-chart.tsx / -panel.tsx   bar chart + EmptyState overlay
      data/dashboard-mock-data.ts        hardcoded mock data (no backend yet)
      types/dashboard.ts                  OnboardingStep, StatCardData, WeeklyChartAxis

  lib/
    utils.ts                 cn() = twMerge(clsx(...)) — standard shadcn utility

  navigation/
    sidebar-items.ts          NavItem[] — full intended app IA; only Dashboard enabled, rest disabled

  stores/
    sidebar-store.ts          zustand store: isMobileOpen, isDesktopCollapsed + toggles
```

**Architecture pattern:** feature-folder architecture (`src/features/<feature>/{components,data,types}`), with a separate generic split in `src/components`: `ui/` (shadcn primitives), `shared/` (reusable-but-app-specific), `layout/` (shell/nav chrome). The `components.json` `hooks` alias (`@/hooks`) is declared but `src/hooks/` doesn't exist yet.

## 4. Styling system

- Tailwind v4, imported CSS-first in `src/app/globals.css` via `@import "tailwindcss"`.
- Also imports `@import "tw-animate-css"` and `@import "shadcn/tailwind.css"` (shadcn ships its own Tailwind layer — this is why `shadcn` is a runtime `dependency`, not a devDependency).
- No `tailwind.config.*` file — theme tokens live in a `@theme inline { ... }` block in `globals.css`.
- Dark mode via `@custom-variant dark (&:is(.dark *))` (class-based).
- Full shadcn CSS-variable theme (`:root` / `.dark`): background/foreground/card/popover/primary/secondary/muted/accent/destructive/border/input/ring/chart-1..5/sidebar-* tokens.
- **Brand color:** primary is a lime/chartreuse green `#d0ea59` with near-black foreground `#0f0f0f`.
- **Sidebar is always dark** (`#0f0f0f` bg, white text), even when the rest of the app is in light mode — a deliberate persistent-dark-sidebar design.

`components.json`: style `base-nova`, baseColor `neutral`, iconLibrary `lucide`, RSC + TSX enabled, aliases `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`.

## 5. Config files

- `next.config.ts` — empty/default (`const nextConfig: NextConfig = {}`).
- `tsconfig.json` — target `ES2017`, `strict: true`, `moduleResolution: "bundler"`, path alias `@/*` → `./src/*`, includes both `.next/types` and `.next/dev/types` (the latter new in Next 16's separate dev/build output dirs).
- `eslint.config.mjs` — flat config, extends `eslint-config-next/core-web-vitals` + `.../typescript`.
- No `.eslintrc*`, no `tailwind.config.*` (both superseded by newer defaults).

## 6. Important: non-standard Next.js 16 behavior

`AGENTS.md` at the project root warns that this Next.js version has breaking changes vs. typical training data, and to consult `node_modules/next/dist/docs/` before writing code. Confirmed: this is genuine, current Next.js **16.2.12** (not a private fork). Key breaking changes relevant to this project:

- **`middleware` → `proxy` rename**: `middleware.ts`/`middleware()` is deprecated in favor of `proxy.ts`/`proxy()`, which only runs on the `nodejs` runtime (no edge). Not yet used in this project.
- **Turbopack is the default bundler** for both dev and build — no `--turbopack` flag needed (already reflected in `package.json` scripts).
- **Async Request APIs are fully async, no sync fallback**: `cookies()`, `headers()`, `draftMode()`, `params`, `searchParams` must always be awaited.
- **`next lint` removed** — use ESLint/Biome directly (this project's `lint` script already does this).
- **ESLint Flat Config is the default** for `eslint-config-next`.
- PPR experimental flag removed → replaced by top-level `cacheComponents` config option.
- `revalidateTag` now requires a second `cacheLife` arg; new `updateTag()`/`refresh()` cache APIs; `unstable_cacheLife`/`unstable_cacheTag` are now stable `cacheLife`/`cacheTag`.
- **Separate dev output dir**: `next dev` outputs to `.next/dev` (enables concurrent dev+build).
- Parallel routes now require explicit `default.js` (not applicable yet — no parallel routes here).
- React 19.2 canary + React Compiler support (opt-in via `reactCompiler: true`, not enabled here).
- `next/image` defaults changed (cache TTL, image sizes, `remotePatterns` replacing `domains`, etc.) — relevant once `next/image` is used (not yet).
- `next/legacy/image`, AMP, `serverRuntimeConfig`/`publicRuntimeConfig` all removed.
- New alpha **Build Adapters API** (`adapterPath` config) for deployment platform integrations — not used here.

When implementing new routes/features, check `node_modules/next/dist/docs/01-app/` for current conventions rather than relying on prior Next.js knowledge.

## 7. Git / project history

- Single-branch repo (`master`), no remote configured.
- One committed baseline: `5693da2 Initial commit from Create Next App`.
- Everything described in §3–§6 above (dashboard feature, sidebar/layout system, shadcn setup, zustand store, navigation model, icon, updated globals/layout/page) is **uncommitted work** layered on top of that scaffold commit.

## 8. Open / not-yet-built

- No backend, API routes, or database — dashboard is 100% mock data (`src/features/dashboard/data/dashboard-mock-data.ts`).
- No auth.
- Nav items beyond Dashboard are disabled stubs: Clients, Program Library, Exercise Library, Chat, Grow, Settings, Team.
- No `src/hooks/` yet despite the alias being reserved in `components.json`.
- No `proxy.ts`/`middleware.ts`.

---

## Changelog

- **2026-07-28**: Initial version of this doc, written from a full audit of the codebase at its current (uncommitted, post-scaffold) state.
