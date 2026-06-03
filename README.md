# Kirokukan (記録館)

> *Your personal anime archive.*

A minimal AniList client built around a single missing feature — sorting completed entries by **finish date** — and a UX that fits how I actually track shows.

Pulls your list from AniList, pushes edits back, and adds quality-of-life things the official sites don't: an editor that auto-fills sensible defaults, a browse view with per-section navigation, grouped views for completed entries, and persistent local caching so the app feels instant on reload.

## Features

- **Browse without signing in** — explore curated sections, search, and filters as a guest. Sign in only when you want to track something.
- **Two-way sync with AniList** via OAuth (implicit grant — no server, no client secret). `/login` auto-redirects to AniList, skipping the manual click.
- **Lists** for both anime and manga, with all six status tabs.
- **View any public user's list** — no sign-in required. Search a username on Browse or hit `/:type/user/:username/list/:status` directly; clicking an entry opens *your own* tracking editor for that title (or the "Sign in to track" CTA as a guest).
- **Sort by completed date** (the original motivation), plus title / updated / added / start date / etc.
- **Grouped views for Completed** — switch to "by month" or "by year" with a popover toggle. Two banner styles: full-width row banners between groups, or inline banners (CSS subgrid) where the next group's label fills the trailing slot of the previous row. The same grouping carries into the **All** tab's Completed block, reusing the same setting.
- **URL-driven state** — tab, sort, and view live in the URL; presentation preferences (banner style, view per type) persist to `localStorage`.
- **Browse** with curated sections (Trending, Popular This Season, Top 100, All-Time Popular, Upcoming) plus full advanced filtering (genre, tag, year, season, format, status).
- **+1 episode/chapter shortcut** — inline on the card hover overlay for currently-watching entries (auto-completes if it hits max), plus a stepper inside the editor.
- **Editor modal** with `←/→` per-section navigation, status autofills (`→ Watching` fills started date, `→ Completed` fills progress to max and finished date), inline "Mark Completed" nudges, and a "View on AniList" deep link. Opens for guests too — form disabled with a "Sign in to track" CTA.
- **Persistent cache** to IndexedDB so reloads hydrate your lists and any previously-opened title instantly (7-day TTL).
- **Mobile-aware** — Dialog on desktop, bottom Sheet on mobile, same form.

## Stack

- Vite + React + TypeScript
- Tailwind v4 + shadcn/ui
- TanStack Query (with `@tanstack/react-query-persist-client` + `idb-keyval` for persistence)
- `graphql-request`
- `react-router-dom`

## Setup

1. **Register an AniList app** at [anilist.co/settings/developer](https://anilist.co/settings/developer)
   - Redirect URI: `http://localhost:5174/auth/callback` (add your production URL later)
   - Copy the **Client ID**
2. **Install + configure**
   ```sh
   npm install
   cp .env.example .env
   # paste your client id into VITE_ANILIST_CLIENT_ID
   ```
3. **Run**
   ```sh
   npm run dev
   ```
   Open `http://localhost:5174`. You land on Browse as a guest; click **Sign in** in the header to connect AniList.

## Build

```sh
npm run build      # output to dist/
npm run preview    # serve the built bundle
```

## Deployment (Cloudflare Pages)

1. Push to GitHub.
2. Cloudflare Pages → Create project → connect the repo:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add `VITE_ANILIST_CLIENT_ID` as a production env var in Pages settings.
4. Add the production callback URL (`https://<project>.pages.dev/auth/callback`) to your AniList app's redirect URIs.

SPA routing fallback is already wired via `public/_redirects`.

## Notes

- AniList rate limit is 90 req/min. TanStack Query handles 429s with backoff.
- When the AniList API is unreachable (a 403/503 or a CORS-masked outage surfaces as `AnilistDownError`), the list and browse views show a graceful "AniList is temporarily unavailable" state instead of a generic error.
- Tokens last 1 year and live in `localStorage`. The GraphQL client only attaches `Authorization` when a token is present, so browse-only and public-list routes work for anonymous users.
- Visiting your own `/:type/list/*` as a guest silently redirects to `/:type/browse` — no login wall. Public user lists (`/:type/user/:username/list/*`) stay viewable signed out.
- `useMediaWithEntry` is keyed by viewer id so the same media row is cached separately for anon and authed reads.
- Score is intentionally not displayed on cards — see `src/lib/scoreColors.ts` for the rare exception (Top 100 tile metadata).

## License

Personal project. No license declared.
