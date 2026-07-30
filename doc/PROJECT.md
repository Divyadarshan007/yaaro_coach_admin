# Yaaro Coach — Project Documentation

> Living document. Update this file whenever the project's structure, stack, or features change.
> Last updated: 2026-07-30 (real coach authentication — Google/Firebase login page + backend `coach` model + route protection; see Changelog)

## 1. What this project is

**Yaaro Coach** is a SaaS **admin dashboard for fitness/personal-training coaches** to manage their clients, training programs, and exercise libraries. It's a B2B tool: the coach logs in, sees an overview of client activity, and (eventually) creates training programs, assigns them to clients, and tracks progress.

Evidence for this domain (from actual UI copy and nav structure):
- Root layout metadata: `title: "Yaaro Coach"`, `description: "Yaaro Coach admin panel"`.
- Dashboard greeting: "Hello, {name} 👋 — Get an overview of your clients' progress." with a "Search clients" input and "+ Add Client" button.
- Stat cards: Total Clients, Active clients last 7 days, Inactive clients last 7 days.
- Onboarding checklist: "Create a program" → "Invite a client" → "Assign a program".
- Full intended nav (Dashboard, Clients, and Program Library are active; the rest are disabled placeholders): Dashboard, Clients, Program Library, Exercise Library, Chat, Grow, Settings, Team.
- A trial banner ("29 days left on your trial, upgrade to keep full access") confirms it's a paid subscription SaaS product.

**Current state:** Dashboard is still hardcoded/mock data. Program Library + Program Editor are backend-wired (real MongoDB persistence via a new `coach` module in `yaaro_backend`, see §9) but those specific endpoints still run on the `DEFAULT_COACH_ID` placeholder rather than the new real coach auth (see below) — a deliberate, flagged follow-up rather than an oversight. A full-page **Routine Editor** (`program/[id]/routine/[routineId]`) now lets a coach build out a routine's exercises/sets against the real exercise catalog (see §9). **Clients** (`src/features/clients/`) is also live, but mock-data only — no client/coach relationship model exists in the backend yet. It has both a list page (`/clients`, 3 mock rows across 2 coaches, coach filter, Coach column) and a full **Client Detail page** (`/clients/[id]`, reached by clicking a row) with a header, a 7-tab bar, a fully-built Overview tab (Coached/Workout Program/Notes/Latest Activities cards + a Statistics section with Recharts bar/line charts, a calendar, and progress pictures), and 6 other tabs that are real but show a "coming soon" placeholder. Every nav item besides Dashboard, Clients, and Program Library is still a disabled stub.

**Coach authentication is now real** (not mock) — see §10. A `/login` page with a single "Continue with Google" button (Firebase Auth) is backed by a brand-new `coach` model in `yaaro_backend` (separate from the mobile app's `user` model), and every `(main)` route is now gated by `src/proxy.ts`, redirecting signed-out visitors to `/login`. This is the first genuinely non-mock, security-relevant feature in this project.

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
| Client state | `zustand` (no longer used by the sidebar — see §3; kept as a dependency in case other features need it) |
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
      layout.tsx              MainLayout — SidebarProvider > AppSidebar + SidebarInset(MobileTopbar + scrollable <main>)

      dashboard/
        page.tsx               DashboardPage — feeds mock data into DashboardView

      clients/
        page.tsx               ClientsPage — renders ClientsView with getMockClients(), no backend yet
        [id]/
          page.tsx             ClientDetailPage — async Server Component, awaits params, getClientDetail(id) or notFound()
          not-found.tsx        styled "Client not found" card (mirrors (main)/error.tsx), since no not-found.tsx existed anywhere before this

      program-library/
        page.tsx               ProgramLibraryPage — renders ProgramLibraryView, no data yet

  components/
    layout/                  App shell/navigation chrome
      app-sidebar.tsx          AppSidebar — composes shadcn's <Sidebar collapsible="icon"> with this app's
                               logo/search/nav/trial-banner content; reads/toggles state via useSidebar()
      sidebar-logo.tsx, sidebar-search.tsx
      mobile-topbar.tsx        mobile header bar; menu button calls useSidebar().toggleSidebar()
      trial-banner.tsx         trial countdown + "Upgrade Now"
    shared/                  Cross-feature reusable UI (generic, not shadcn primitives)
      empty-state.tsx          icon + title + description + action
      meter.tsx                thin wrapper over Base UI Progress
      stat-card.tsx            generic clickable stat tile
    ui/                      shadcn/ui primitives (Base UI-backed): button, card, input, progress, separator, sheet,
                             skeleton, tooltip, sidebar
                             - sidebar.tsx: shadcn's actual `Sidebar` block (SidebarProvider/Sidebar/SidebarTrigger/
                               SidebarMenuButton/useSidebar/etc, cookie-persisted desktop open state, Cmd/Ctrl+B
                               shortcut). `--sidebar-width`/`--sidebar-width-icon` overridden to 20rem/5rem via
                               `SidebarProvider`'s `style` prop in the (main) layout to match this app's original
                               sizing (was `w-80`/`w-20`).
                             - sheet.tsx: still hand-patched (see changelog) — the Sidebar's mobile drawer reuses this
                               same Sheet, so the flicker fix applies there too.

  hooks/
    use-mobile.ts             shadcn's useIsMobile — rewritten to useSyncExternalStore (the generated version set
                               state synchronously inside an effect, which this repo's eslint-plugin-react-hooks
                               flags as an error)

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

    program-library/          Second feature — "My Library" / "HevyCoach Library" tabs, both currently empty-state only
      components/
        program-library-view.tsx           client component; owns active-tab state (Base UI `Tabs`), composes the rest
        program-library-toolbar.tsx         search input + "New Folder" / "Create Workout Program" buttons (no handlers yet)
        program-library-empty-state.tsx     reuses shared `EmptyState`; "Browse Templates" switches to the HevyCoach tab
        hevycoach-library-panel.tsx         placeholder search + empty-state for the HevyCoach Library tab

    clients/                  Third feature — Clients list page, mock-data only (no client/coach model in the backend)
      components/
        clients-view.tsx                    client component; owns search + coach-filter state, composes toolbar + scope bar + table
        clients-toolbar.tsx                  search input (filters client-side) + renders AddClientDialog
        add-client-dialog.tsx                "Invite new clients" dialog (Base UI `Dialog`) — copyable coach.yaaro.fit invite link + single email input; "Send Invitation" only enables/disables on valid email and closes the dialog on click (no backend to actually send anything)
        clients-scope-bar.tsx                "My Clients" pill (static/visual) + "All coaches" Select (functional client-side coach filter)
        clients-table.tsx                    column header row (Client/Program/Last 7 Days/Coach/Status) + ClientRow list, or EmptyState if filters match nothing
        client-row.tsx                       avatar+name, program name/week label, week-activity strip, coach avatar+name, status badge (Active=blue/Sample Client=gray), 3-dot menu (visual-only)
        person-avatar.tsx                    shared colored-initials Avatar, used for both client and coach identities
        client-week-activity.tsx             renders 7 day-circles, highlighting active days
      lib/week-activity.ts                   getLastSevenDaysActivity() — computes the last 7 real calendar days off `new Date()` (not hardcoded dates) plus which ones show as "active"
      data/clients-mock-data.ts              getMockClients() — 3 hardcoded rows (bigbites, John Doe "Sample Client", Kapil Singh) across 2 coaches (Dev, H1 Gyms); also exports the shared per-client/coach AvatarInfo consts reused by client-detail-mock-data.ts
      data/client-detail-mock-data.ts        getClientDetail(id) — full mock profile per client (email, coached-since, workout program, activity feed, weekly stat charts, bodyweight history, progress pictures)
      components/detail/                     Client Detail page (`/clients/[id]`)
        client-detail-view.tsx                 client root; owns active-tab state (Base UI `Tabs`: Overview + 6 placeholder tabs)
        client-detail-header.tsx               large avatar, name/email, "Coached by" + coach avatar, Log Workout/Send Message (visual-only), 3-dot menu (visual-only)
        client-overview-tab.tsx                composes the Overview tab's two-column card grid + StatisticsSection
        coached-card.tsx / workout-program-card.tsx / notes-card.tsx / latest-activities-card.tsx
        notes-card.tsx                          Textarea with local (unpersisted) React state — functional typing, no backend
        statistics-section.tsx                 "Statistics" heading + the two chart/calendar/pictures grid rows
        stat-chart-card.tsx                     reusable Recharts `BarChart` card (Duration/Volume/Set), via shadcn's `chart.tsx` (Recharts-based)
        bodyweight-chart-card.tsx               Recharts `LineChart` card
        calendar-card.tsx                       hand-rolled month grid (prev/next month are functional local state, no event data), highlights today
        progress-pictures-card.tsx              prev/next cycles through mock entries (no real images — a placeholder icon tile, consistent with not fetching external image assets)
        client-placeholder-tab.tsx              shared "coming soon" EmptyState for the 6 non-Overview tabs

    routine-editor/           Full-page routine builder at `program/[id]/routine/[routineId]` (see §9)
      components/
        routine-editor-view.tsx             client root; hydrates `useMyProgramsStore`, finds the routine, lays out
                                             the two-column page (form + exercise cards | exercise picker)
        routine-editor-header.tsx           breadcrumb + back link + "All changes saved"
        routine-details-form.tsx            Routine Title input + Routine Note textarea
        routine-exercise-card.tsx           per-exercise note, rest-timer select, Set/Lbs/Reps rows, +Add set
        exercise-picker-panel.tsx           right-hand panel: search + Equipment/Muscles filters (client-side, over
                                             the full fetched catalog) + "+ Custom Exercise" (disabled, no backend yet)
      lib/exercise-filters.ts               distinct-equipment/-muscle option builders + catalog filter fn
      data/routine-editor-data.ts           REST_TIMER_OPTIONS

  lib/
    utils.ts                 cn() = twMerge(clsx(...)) — standard shadcn utility
    api/exercises.ts          getExerciseCatalog() — GET /mobile/v1/exercises (the same endpoint the mobile app uses;
                               unauthenticated for now, so only the global catalog comes back, no per-coach customs)

  navigation/
    sidebar-items.ts          NavItem[] — full intended app IA; Dashboard + Program Library enabled, rest disabled
```

**Architecture pattern:** feature-folder architecture (`src/features/<feature>/{components,data,types}`), with a separate generic split in `src/components`: `ui/` (shadcn primitives), `shared/` (reusable-but-app-specific), `layout/` (shell/nav chrome). `src/stores/` (zustand sidebar store) was removed once the sidebar migrated to shadcn's own state management.

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

- Dashboard is still 100% mock data (`src/features/dashboard/data/dashboard-mock-data.ts`) — deliberately deferred, since there's no client/coach relationship model in the backend yet to back it with anything but zeros.
- "New Folder" (in the Program Library toolbar) is still visual-only, no handler.
- **Coach auth exists now (§10)**, but the existing Program Library/Program Editor/Routine Editor endpoints (`GET/POST/PATCH/DELETE /coach/v1/programs*`) still aren't gated behind it — they still run on `DEFAULT_COACH_ID`. Wiring `authenticateCoachToken` onto those routes, and attaching the coach's session to `yaaro_coach`'s existing server-side fetchers, is a deliberate, separate follow-up (see the `TODO(coach-auth)` comment in `routes/coach/v1/index.js`) — doing it in the same pass would have meant also changing those already-working call sites, which was explicitly out of scope for this round.
- No client/coach relationship model, no invite backend, no program-assignment model — see §9's last paragraph and §10.
- Nav items beyond Dashboard, Clients, and Program Library are disabled stubs: Exercise Library, Chat, Grow, Settings, Team.
- Clients page has no real backend model — no invite flow, no per-client detail page, "+ Add Client" and the row's 3-dot menu are visual-only (no handlers).
- No `src/hooks/` yet despite the alias being reserved in `components.json`.

## 9. Backend wiring (`yaaro_backend`'s `coach` module)

Program Library and Program Editor are wired to a new `/coach` route module in the sibling `yaaro_backend` repo (Express + Mongoose, plain JS — see that repo's own structure; mirrors the existing `business` module's pattern: `routes/coach/{index.js, v1/index.js, controllers/, validators/}`, registered in `routes/zindex.js`).

- **Program/template endpoints still don't require coach auth**, even though real coach auth now exists (see §10) — every `program` document still has a `coachId` field defaulted to `process.env.DEFAULT_COACH_ID` (a fixed placeholder). Gating these routes behind `authenticateCoachToken` is a 1-line middleware addition (see the `TODO(coach-auth)` comment in `v1/index.js`) but was deliberately deferred so this round's auth work didn't also have to touch `yaaro_coach`'s already-working Program Library/Editor call sites.
- **Models:** `program` (a coach's own editable programs — `coachId`, `templateId` ref, `title`, `duration`, `note`, `routines[]` with embedded `exercises[]`) and `programTemplate` (the read-only library catalog, seeded via `yaaro_backend/scripts/seed-program-templates.js` — run once with `npm run seed:programTemplates`).
- **Muscle taxonomy is reused, not duplicated.** `yaaro_backend` already has real `muscle`/`muscleGroup` collections (used by the main app's exercise catalog, publicly exposed today via `GET /mobile/v1/exercise/muscles`). Program/template exercises store a `muscleId` ref into that same collection instead of a hardcoded string enum. A thin `GET /coach/v1/muscles` endpoint (`coach/controllers/muscle_ctrl.js`) exposes the same data under the coach module's own contract. `src/lib/muscle-groups.ts` on the frontend no longer hardcodes a taxonomy — it's just helper functions (`buildMuscleLookup`, `getDistinctMuscleGroups`) operating on the fetched catalog.
- **Data flow follows this Next version's idiomatic pattern** (Server Components for reads, Server Actions for mutations — see §6): pages (`program-library/page.tsx`, `program/[id]/page.tsx`) are `async` Server Components that `fetch()` the backend directly via server-only fetchers in `src/lib/api/{programs,program-templates,muscles}.ts` (base URL from the server-only `COACH_BACKEND_URL` env var, `.env.local`, never exposed to the browser). Mutations go through `"use server"` actions in `src/features/program-editor/actions.ts`.
- **`useMyProgramsStore` (zustand)** is still the in-editor optimistic-update layer (all the granular `addRoutine`/`updateExercise`/etc. actions instant-update local state for a snappy UI) but is now hydrated from server-fetched props on mount and debounce-persists (600ms) the current program's `routines`/`title`/`duration`/`note` back to the backend via `updateProgramAction` after each edit. Ids assigned client-side for brand-new routines/exercises get replaced by real ones on the next persisted save/reload — a deliberate simplification (whole-document replace, not per-item upsert) that self-heals on next page load rather than needing per-item id reconciliation.
- **Program creation is click-triggered, not route-triggered.** Originally modeled as a `/program/new` page that created-then-redirected on render — this was a real bug: Next's `<Link>` prefetching invoked the mutation just from the link scrolling into view, creating phantom "Untitled Program" rows with no user action. Fixed by deleting that route and having the "Create Workout Program" buttons call `createBlankProgramAction()` directly via a click handler (`useTransition` + `router.push`).
- **Rebranding:** the Program Library's "template catalog" feature was originally built against a competitor product's name ("Hevy"/"HevyCoach") baked into types/files/components/copy. Renamed throughout to `Yaaro`/`Yaaro Coach` (e.g. `hevycoach-library.ts` → `types/yaaro-coach-library.ts`, `HevyCoachProgram` → `YaaroCoachProgram`).
- **Routine Editor reuses the app's real exercise catalog, not a coach-specific one.** The exercise picker calls `GET /mobile/v1/exercises` directly (same endpoint + data the mobile app's own "Choose exercise" screen uses) rather than a new `/coach/v1/exercises` — it already returns the full populated catalog (name, muscle, equipment, thumbnail, `isFullBodyweightExercise`) and needed no new backend endpoint. It takes no query params, so search/Equipment/Muscles filtering happens client-side over the ~430-exercise list in `lib/exercise-filters.ts`. Passing a coach auth token (to also merge in that coach's custom exercises, same as the endpoint already does for logged-in mobile users) is deferred until coach auth exists — noted with a comment at the call site, not implemented speculatively.
- **`program.exerciseSchema.sets` changed shape**: was a plain `Number` (a target set *count*); it's now `[{ lbs, reps }]`, one entry per actual set, so the Routine Editor can track per-set weight/reps. Added `note` (routine + exercise) and `isBodyweight` (exercise) alongside it. This is a breaking change to the embedded subdocument shape — the **Joi validator** in `routes/coach/validators/index.js` had to be updated in lockstep (it's a separate hand-maintained schema, not derived from the Mongoose model, so it's easy to forget when touching this shape again). Also had to fix the **create-from-template clone** in `program_ctrl.js`'s `create()`: `programTemplate.exerciseSchema.sets` is still a plain count (templates don't track real weight/reps), so cloning now expands it into that many blank `{lbs: null, reps: null}` rows instead of copying the number straight across (the original bug: copying a number into an array field threw a Mongoose validation 500 on every "create from template").

## 10. Coach authentication (Google/Firebase)

The first genuinely non-mock, security-relevant feature in this project. A coach is a **new, separate account type** — not the mobile app's `user`, not `business`'s `brand` — following this codebase's existing "each audience gets its own model" precedent.

**`yaaro_backend` side** (all additive — nothing in `business`, `web`, `mobile`, or the existing `program`/`programTemplate` routes was modified):
- New model **`coach`** (`src/models/coach.js`): `firebaseUid` (unique), `provider` (`"google"`), `email`, `name`, `avatar`, `isActive`. Registered in `models/zindex.js`.
- New controller `routes/coach/controllers/auth_ctrl.js`: `googleLogin` verifies a **Firebase ID token** via the existing `config/firebaseAdmin` (`verifyIdToken` — the same Admin SDK already used by the unrelated `web` module's end-user Google login, reused read-only here, not modified), finds-or-creates the `coach` by `firebaseUid`, and returns a coach-scoped JWT (`{ id, role: "coach" }`, signed with the existing `getJwtSecret()` util) plus the coach's profile. `me` returns the current coach's profile given a valid token.
- New middleware `authenticateCoachToken`, added **as a new export** in the existing `middlewares/authenticator.js` (mirrors `authenticateBrandToken`'s shape exactly: `Authorization: Bearer <token>`, checks `role === "coach"`, attaches `req.coachToken`) — every existing export in that file is untouched.
- New routes registered in `routes/coach/v1/index.js`: `POST /coach/v1/auth/google`, `GET /coach/v1/auth/me` (behind `authenticateCoachToken`). All pre-existing routes in that file (muscles/program-templates/programs) are byte-for-byte unchanged except for the `TODO(coach-auth)` comment text itself.
- Firebase project is `yaaro-fit` (confirmed via the Admin SDK's own startup log when requiring the module) — the **same** Firebase project the mobile app and `web` module already use; a coach is just a different Firestore/Firebase-Auth-authenticated identity within it, backed by its own Mongo collection.

**`yaaro_coach` side:**
- `firebase` (Web SDK) added as a dependency. `src/lib/firebase-client.ts` exports `signInWithGoogle(config)` (`signInWithPopup` + `GoogleAuthProvider`, returns the ID token) — it takes the Firebase config as a parameter rather than reading env vars itself (see below).
- **Firebase Web config is fetched from the backend at request time, not duplicated into `yaaro_coach`'s own env.** `GET /coach/v1/auth/firebase-config` (new, public) on the backend returns the same non-secret `FIREBASE_WEB_*` values the `web` module already embeds into anonymous browsers' HTML today — reading that precedent is what prompted this: since these values are already treated as public, `yaaro_coach`'s `src/lib/api/firebase-config.ts` fetches them server-side (same `COACH_BACKEND_URL` pattern as `programs.ts`/`muscles.ts`) and `login/page.tsx` (now an async Server Component) passes the result into `<LoginView firebaseConfig={...}>` as a prop. `yaaro_backend`'s `.env` stays the single source of truth; no `NEXT_PUBLIC_FIREBASE_*` vars exist in `yaaro_coach` at all.
- `/login` (`src/app/login/page.tsx` + `src/features/auth/components/login-view.tsx`) — outside the `(main)` route group, so it renders with no sidebar. Matches the reference screenshot minus Apple/email-password/Sign-up (single "Continue with Google" button only, per explicit scope). `google-icon.tsx` is a standalone inline SVG of Google's standard 4-color "G" mark (the standard, expected asset for a "Sign in with Google" button). Sign-in errors are mapped to specific messages (`auth/invalid-api-key`, `auth/popup-closed-by-user`, `auth/unauthorized-domain`) rather than one generic string, so a failed attempt is actually diagnosable from the screen instead of needing a console dive.
- `src/app/api/auth/google/route.ts` — Route Handler: takes the client's Firebase ID token, forwards it server-to-server to `${COACH_BACKEND_URL}/coach/v1/auth/google`, then sets the returned JWT as its **own** httpOnly `coach_session` cookie (7-day maxAge) on `yaaro_coach`'s own origin — the backend's JSON response carries the token in the body rather than a cross-origin `Set-Cookie`, since the frontend (`coach.yaaro.fit`) and the Express API are different origins. `src/app/api/auth/logout/route.ts` clears that cookie.
- `src/proxy.ts` (Next 16's `middleware.ts` replacement, per §6) — redirects to `/login` if the `coach_session` cookie is absent on any non-`/login` route, and redirects an already-signed-in visitor away from `/login` to `/dashboard`. Only checks cookie *presence*, not JWT validity — real verification happens wherever a Server Component/Action actually calls a coach-authenticated backend endpoint, per Next's own guidance not to rely on Proxy alone for authorization.
- **Not yet wired**: none of the existing Program Library/Client pages actually attach the `coach_session` token to their backend calls yet (see §9's first bullet) — logging in currently only gates *page access*, it doesn't yet change what data any page fetches. That's the deliberate next step, not an oversight.
- **Still unverified**: the actual Google popup sign-in round-trip, and whether the Firebase Console's "yaaro-fit" project has Google sign-in enabled for the **Web** platform specifically with `localhost`/`coach.yaaro.fit` as authorized domains — that's Firebase Console configuration, not code, and needs the user to click through it in a real browser (not scriptable against Google's own consent screen).

---

## Changelog

- **2026-07-30**: First real end-to-end attempt at the Google sign-in surfaced the generic "Something went wrong signing in" error — root cause was simply that the 6 `NEXT_PUBLIC_FIREBASE_*` placeholders in `.env.local` were still empty (expected, since this environment never had the real values to fill them in with). Fixed two things: (1) `login-view.tsx` now maps specific Firebase error codes (`auth/invalid-api-key`, `auth/popup-closed-by-user`, `auth/unauthorized-domain`) to specific on-screen messages instead of one generic string. (2) The user pointed out `yaaro_backend` already has this exact config (`FIREBASE_WEB_*`, already publicly served by the unrelated `web` module's login page) — rather than duplicating those values into `yaaro_coach`'s own env, added a new public `GET /coach/v1/auth/firebase-config` endpoint that returns them, and refactored `yaaro_coach` to fetch this server-side (`src/lib/api/firebase-config.ts`) and pass it into `LoginView` as a prop instead of reading `NEXT_PUBLIC_FIREBASE_*` — `firebase-client.ts`'s `signInWithGoogle` now takes the config as a parameter. Removed the now-unnecessary env placeholders entirely; `yaaro_backend`'s `.env` stays the single source of truth. Verified live against the already-running local backend (port 3200) — the new endpoint returned real values (confirmed project `yaaro-fit`), and the login page renders correctly fetching them at request time.
- **2026-07-30**: Built real **coach authentication** (Google via Firebase) — see §10 for full detail. Confirmed scope up front across two rounds of questions before writing any code: (1) coach is a brand-new, separate `coach` model rather than reusing the mobile app's `user`, explicitly scoped to the `coach` module only with no changes to other modules' code; (2) build the full thing — UI + real backend + wired session — rather than a visual-only page first.
  - **yaaro_backend**: new `coach` model + `models/zindex.js` registration; new `routes/coach/controllers/auth_ctrl.js` (`googleLogin`, `me`); new `authenticateCoachToken` added as a fresh export in the existing `middlewares/authenticator.js`; two new routes registered in `routes/coach/v1/index.js`. Everything else in the `coach` module (programs/templates/muscles) is untouched — coach auth exists but isn't yet required by those routes, a deliberate follow-up.
  - **yaaro_coach**: new `/login` page (Google-only, matches the reference minus Apple/email/Sign-up), `firebase` Web SDK dependency, `src/lib/firebase-client.ts`, `/api/auth/google` + `/api/auth/logout` Route Handlers (backend returns the JWT in its JSON body; the Route Handler sets it as this app's own httpOnly cookie, since frontend and backend are different origins), and `src/proxy.ts` gating every `(main)` route behind that cookie's presence.
  - Real infrastructure detail, not guessed: the invite-link domain question from the previous entry already established `coach.yaaro.fit`; this round additionally confirmed the shared Firebase project is `yaaro-fit` (from the Admin SDK's own startup log) — the coach login uses that same project, just a new `coach`-scoped identity within it.
  - Verified: backend files syntax-checked (`node --check`) and require-checked (`node -e "require(...)"`, which also confirmed Firebase Admin initializes correctly against the real `yaaro-fit` project); frontend `tsc --noEmit` + `eslint` clean; `curl` confirmed the proxy redirect (`/clients` → 307 → `/login` when signed out) and the login page's real HTML content; a headless-Chrome screenshot confirmed the rendered page matches the reference. Caught and fixed one bug this way: reusing the existing `SidebarLogo` component in the login header rendered invisible text, since its `text-sidebar-foreground` color assumes the sidebar's dark background — replaced with a plain light-header version.
  - **Not verified, and can't be from this environment**: the actual Google popup sign-in round-trip. That requires real Firebase Web SDK config values (the 6 `NEXT_PUBLIC_FIREBASE_*` vars are placeholders — copy them from `yaaro_backend`'s `FIREBASE_WEB_*`) and a real Google account in an interactive browser; headless/automated sign-in against Google's own consent screen isn't something to script. Manual testing by the user is the next step, along with confirming the Firebase Console has Google sign-in enabled for Web with the right authorized domains.
- **2026-07-30**: Built the **"Invite new clients" dialog** (`src/features/clients/components/add-client-dialog.tsx`), opened by the Clients page's "+ Add Client" button (previously visual-only/no-op). Matches a reference screenshot: title + description + "Learn More", a copyable coach-scoped invite link, an email input, and a "Send Invitation" button disabled until the email is validly formed. Confirmed scope up front: single email input (not multi-email chips) for now, and since there's no invite backend, "Send Invitation" only enables/disables on valid input and closes the dialog on click — no fake success state or mock client row added. The invite link uses the real production domain the user provided (**coach.yaaro.fit**, not a guessed placeholder) — saved to memory as `yaaro_domain_scheme` since it's factual infrastructure info, not something to re-derive per feature. "Copy Link" actually copies to the clipboard (trivial, no backend needed) with a brief "Copied" label swap.
- **2026-07-30**: Built the **Client Detail page** (`(main)/clients/[id]/page.tsx`, new `src/features/clients/components/detail/`) and wired `/clients` row clicks to navigate there (`ClientRow` is now a client component using `useRouter`; its 3-dot menu button calls `stopPropagation` so it doesn't also trigger the row navigation). Confirmed scope up front given the size of the reference screenshot: build the full Overview tab with real mock data (Coached/Workout Program/Notes/Latest Activities cards + a Statistics section), the other 6 tabs (Workout Program, Exercise Statistics, Advanced Statistics, Body Measurements, Progress Pictures, Settings) as real-but-placeholder tabs, and use a real charting library rather than hand-rolled SVG — added shadcn's `chart.tsx` (Recharts-based; `recharts` is now a dependency), consistent with how every other new UI primitive (avatar/badge/select/table) got added via the shadcn CLI in this project.
  - New mock data layer: `data/client-detail-mock-data.ts`'s `getClientDetail(id)` returns a full profile per client (email, coached-since, workout program summary, an activity feed, 3 weekly stat series for bar charts, a bodyweight history for a line chart, progress pictures) — `clients-mock-data.ts` now exports its per-client/coach `AvatarInfo` consts so both the list and detail mock data share one identity source instead of duplicating avatar colors.
  - Progress pictures use a placeholder icon tile, not real photos — consistent with the earlier decision not to fetch/embed external image assets for mock client avatars.
  - The calendar card and progress-pictures card are hand-rolled (month grid computed from plain `Date` math; prev/next are real local-state interactions), while the 3 stat charts and the bodyweight chart are genuine Recharts `BarChart`/`LineChart` components via `ChartContainer`/`ChartTooltip`.
  - Added `not-found.tsx` for `clients/[id]` (styled to match the existing `(main)/error.tsx` card) — there was no `not-found.tsx` anywhere in the app before this, so an unknown client id previously rendered a completely blank page instead of Next's (invisible, unstyled-in-this-app) default 404 boundary. Found via a real screenshot of `/clients/does-not-exist`, not by inspection.
  - Hit and fixed two real rendering bugs, both found via headless-Chrome screenshots rather than assumed from code:
    1. Every multi-child `CardHeader` (Coached, Workout Program, Notes, Latest Activities, Calendar) was stacking its children vertically instead of laying out inline. Cause: `className="flex-row items-center justify-between"` sets only `flex-direction`, not `display: flex` — and `CardHeader`'s base class is `display: grid`, so `flex-row` had no effect. Fixed by using `flex items-center justify-between` (needed `flex` itself, not just `flex-row`).
    2. The 3 Recharts bar charts rendered gridlines/axes but zero visible bars in the headless screenshot. Cause: Recharts' default mount animation (driven by `requestAnimationFrame`) appears to freeze at its 0-height starting frame under headless Chrome's `--virtual-time-budget`. Fixed by passing `isAnimationActive={false}` on the `Bar`/`Line` elements — also arguably the right call for a static admin dashboard regardless of the screenshot quirk.
  - Verified via `tsc --noEmit` + `eslint` (clean across the whole `src/`) and headless-Chrome screenshots of the Overview tab, the `/clients` list (still correct after the `PersonAvatar` `className` prop addition), and the new 404 page. Did not click-through the 6 placeholder tabs live (no Playwright/Puppeteer/chromium-cli available beyond static screenshots) — the tab-switching code reuses the same Base UI `Tabs` pattern already proven in `program-library-view.tsx`.
- **2026-07-30**: Built the **Clients** page (`(main)/clients/page.tsx`) and enabled its sidebar nav item — new `src/features/clients/` feature folder (`clients-view.tsx`, `clients-toolbar.tsx`, `clients-scope-bar.tsx`, `clients-table.tsx`, `client-row.tsx`, `person-avatar.tsx`, `client-week-activity.tsx`, `lib/week-activity.ts`, `data/clients-mock-data.ts`). Added shadcn `avatar`, `badge`, and (later) `select` primitives. Deliberately mock-data only — no client/coach relationship model or multi-coach/team model exists in `yaaro_backend` yet (same reason "Team" is still a disabled nav stub). Two rounds, confirmed with the user up front both times before writing code:
  1. First round matched a reference screenshot showing a single "Sample Client" row (John Doe / "Full Body x3") — built with "+ Add Client" and the row's 3-dot menu as visual-only (no handlers), no row-click navigation.
  2. User then shared a fuller reference screenshot with a "My Clients" scope pill, an "All coaches" filter, a **Coach** column, and multiple client rows with mixed statuses ("Active" vs "Sample Client"). Expanded to match, still mock-only per the user's choice: `getMockClients()` now returns 3 rows (bigbites/Dev/Active, John Doe/H1 Gyms/Sample Client, Kapil Singh/H1 Gyms/Active) with colored-initials `PersonAvatar` for both client and coach; status badge color-codes Active (blue) vs Sample Client (gray, same as before). The "My Clients" pill is a static visual (its alternate state wasn't specified by the reference, so left non-interactive rather than inventing behavior); the "All coaches" `Select` **does** actually filter the local mock array client-side (same tier as the pre-existing search-box filtering — plain local array filtering, not a backend integration, so it was safe to make functional beyond what was strictly asked).
  - The "last 7 days" activity strip is computed dynamically off the real current date (`getLastSevenDaysActivity`), not hardcoded dates, so it keeps looking correct as time passes.
  - Hit and fixed one real bug: Base UI's `Select.Value` renders the raw selected value by default, not any item's label — the coach filter trigger showed the literal string `"all"` instead of "All coaches" until passing a `children` render-function to `SelectValue` that maps the raw value to a display label.
  - Hit and fixed a second real bug, found from a user screenshot: the table body was originally each row + the header rendered as independent CSS Grid `<div>`s sharing the same `grid-cols-[...]` string. That doesn't guarantee alignment — `auto`/`fr` track widths are computed per grid instance from *that instance's own* cell content, so a wider "Sample Client" badge in one row shifted that row's columns relative to rows with the shorter "Active" badge, and none of them matched the header (whose "Last 7 Days"/"Coach" cells only ever contain short label text, not the real 7-pill/avatar content). Fixed by switching to a real semantic `<table>` (added shadcn's `table` primitive) — one shared column-width computation across the header and every row is exactly what HTML tables are for, eliminating the whole bug class instead of hand-tuning more fixed/auto/fr track widths.
  - Verified via `tsc --noEmit` + `eslint` (clean, both rounds) and real headless-Chrome screenshots against the user's own running dev server; the coach-filter dropdown's filtering logic was verified by code review (matching `client.coach.name`) rather than a live click-through, since no browser-automation tool (Playwright/Puppeteer/chromium-cli) was available in this environment beyond static screenshots.
- **2026-07-29**: Built the full-page **Routine Editor** (`program/[id]/routine/[routineId]`, new `src/features/routine-editor/`) — routine title/note, per-exercise note/rest-timer/Set-Lbs-Reps rows, and a right-hand exercise picker wired to the real `GET /mobile/v1/exercises` catalog (429 real exercises, search + Equipment/Muscles filters done client-side since that endpoint takes no query params). `AddRoutineDialog`'s "Create New Routine" now navigates here instead of just inserting a blank routine into local state. No RPE field (explicitly out of scope this round).
  - **yaaro_backend**: `program.exerciseSchema.sets` changed from a plain set-count `Number` to `[{lbs, reps}]`; added `note` (routine + exercise) and `isBodyweight` (exercise, drives whether the Lbs column shows). Updated the hand-maintained Joi validator (`coach/validators/index.js`) to match — it doesn't derive from the Mongoose schema, so this is a step easy to miss next time this shape changes. Fixed a real bug this surfaced: `program_ctrl.js`'s create-from-template clone was copying `programTemplate`'s set-count straight into the new (now array-shaped) field, throwing a 500 on every "create from template" — fixed by expanding the count into that many blank set rows.
  - **yaaro_coach**: new `src/lib/api/exercises.ts`; extended `Program`/`ProgramRoutine`/`ProgramExercise` types and `my-programs-store.ts` with routine-note and per-set actions (`addExerciseSet`/`updateExerciseSet`/`removeExerciseSet`), reusing the existing debounced whole-program PATCH persistence rather than adding a new sync path. `RoutineEditorView` guards against a hydration race: since the zustand store is a module singleton that survives client-side navigation, navigating straight from "Create New Routine" to the new routine's edit page could otherwise have the page's own server-fetched (and likely still-stale, pre-debounce) `initialProgram` overwrite the just-created local routine on mount — fixed by only hydrating from the server fetch if the store doesn't already have that program loaded.
  - Verified end-to-end: `tsc --noEmit` + `eslint` clean; a real Playwright/Chromium run through Program Library → a program → Add Routine → Create New Routine → searched and added a real exercise → added a set → edited a value, no console errors, confirmed persisted via a direct backend GET, then cleaned up the test routine from the real program it was tested against.
- **2026-07-29**: Wired Program Library + Program Editor to a real backend (no auth yet — see §9 for full detail). Summary:
  - **yaaro_backend**: new `coach` route module (`routes/coach/`) mirroring `business`'s structure; new `program`/`programTemplate` Mongoose models; `GET /coach/v1/muscles` reusing the existing `muscle`/`muscleGroup` collections instead of duplicating them; `scripts/seed-program-templates.js` to seed the 13-template library catalog (resolves each exercise's muscle name to a real `muscle` document id, warns on any that don't resolve — none did against the real dev DB). Found and fixed a pre-existing bug in the shared `middlewares/validator.js`: validating `params` then `body` in two separate `validate()` calls clobbers `req.body` with the params object; worked around it using the existing `source: "all"` pattern (already used elsewhere in the codebase) instead of touching the shared middleware.
  - **yaaro_coach**: added a server-only API layer (`src/lib/api/`), Server Actions (`src/features/program-editor/actions.ts`), converted `program-library`/`program/[id]` pages to async Server Components fetching real data, and reworked `my-programs-store.ts` to hydrate from + debounce-persist to the backend while keeping its existing optimistic local-mutation API intact (component call sites unchanged). Renamed the "Hevy"/"HevyCoach" branding throughout the program-library feature to "Yaaro"/"Yaaro Coach". Replaced the hardcoded `src/lib/muscle-groups.ts` taxonomy with helpers operating on the live-fetched catalog.
  - Found and fixed a real bug during manual verification: the original `/program/new` page design (create-on-render, then redirect) was silently triggered by Next's `<Link>` prefetch, creating phantom programs with no user action. Fixed by deleting that route and making program creation a click-triggered Server Action instead.
  - Verified end-to-end against the real dev database: backend CRUD (create blank / create-from-template / patch / soft-delete) via curl, and the actual Next dev server rendering real template/program data with no leftover mock imports (`npm run build`, `tsc --noEmit`, and `eslint` all clean).
- **2026-07-28**: Initial version of this doc, written from a full audit of the codebase at its current (uncommitted, post-scaffold) state.
- **2026-07-28**: Fixed flicker on mobile sidebar open/close, in two passes:
  1. First pass (didn't fully fix it): added a `keepMounted` prop to `SheetContent`/`SheetPortal` ([sheet.tsx](../src/components/ui/sheet.tsx)), enabled on the mobile drawer in [sidebar.tsx](../src/components/layout/sidebar.tsx), so the drawer's content stays mounted (toggled via the `hidden` attribute) instead of unmount/remounting on every open. Legitimate improvement, but not the actual cause of the visible flicker.
  2. Real root cause, found by capturing actual frame-by-frame screenshots of the transition with a headless Playwright/Chromium session (via CDP `Page.startScreencast`) rather than reasoning from source alone: the drawer panel (`SheetContent`'s `data-[side=left/right/top/bottom]` classes) animated **opacity 0→1 together with only a 2.5rem translate**. For a full-height/full-width drawer this meant the panel was translucent for most of the 200ms transition, so the dashboard content behind it showed through and double-exposed with the sidebar's own nav-item highlight — visible as a ghosting/flash artifact on both open and close. Fixed by making the panel transition **transform-only** (`transition-transform`, no opacity animation) and sliding it fully off-screen (`translate-x-full` / `-translate-x-full` / `translate-y-full` / `-translate-y-full` per side, was `2.5rem`) — the panel is now solid/opaque throughout the slide; only the separate backdrop overlay still fades opacity (that's fine, it's a scrim, not the panel).
  - Also still noted: the sidebar is *not* using shadcn's dedicated `Sidebar` component/`SidebarProvider` — it's a custom `SidebarShell` (Zustand store + shadcn `Sheet` for mobile + a plain `<aside>` for desktop collapse).
- **2026-07-28**: Built the **Program Library** page (`(main)/program-library/page.tsx`) and enabled its sidebar nav item (`src/navigation/sidebar-items.ts`, was `href: "#"`/`disabled: true`). New `src/features/program-library/` feature folder: `program-library-view.tsx` (Base UI `Tabs` for "My Library"/"HevyCoach Library", client component), `program-library-toolbar.tsx` (search + New Folder + Create Workout Program — buttons have no handlers yet), `program-library-empty-state.tsx` (reuses the existing shared `EmptyState`; its "Browse Templates" button switches to the HevyCoach Library tab rather than navigating), `hevycoach-library-panel.tsx` (placeholder search + empty-state). No data layer — the page always renders the empty state, matching the reference screenshot exactly (which showed 0 programs).
- **2026-07-28**: Migrated the sidebar to shadcn's actual `Sidebar` block (`sidebar-07` — "collapses to icons" — was the closest match to this app's existing behavior). Ran `npx shadcn@latest add sidebar`, which pulled in `sidebar.tsx`, `skeleton.tsx`, `tooltip.tsx`, and `hooks/use-mobile.ts`; declined its offer to overwrite `sheet.tsx` so the manual flicker fix above survived (the Sidebar's mobile drawer reuses that same `Sheet`, confirmed via headless-Chromium frame capture that it's still ghost-free). Replaced the custom `SidebarShell`/`sidebar-content.tsx`/`sidebar-nav.tsx`/`sidebar-nav-item.tsx`/`stores/sidebar-store.ts` with a single [app-sidebar.tsx](../src/components/layout/app-sidebar.tsx) that composes shadcn's `Sidebar`/`SidebarHeader`/`SidebarContent`/`SidebarFooter`/`SidebarMenuButton` around this app's existing logo/search/nav-items/trial-banner content. Sidebar open/collapsed state now lives in shadcn's own `SidebarProvider` (cookie-persisted, `Cmd/Ctrl+B` shortcut, `useSidebar()` hook) instead of the zustand store, which was deleted. Also fixed a pre-existing lint error in the generated `use-mobile.ts` (`react-hooks/set-state-in-effect`) by rewriting it with `useSyncExternalStore`. Root layout now wraps children in `TooltipProvider` (needed for the collapsed-icon nav tooltips).
