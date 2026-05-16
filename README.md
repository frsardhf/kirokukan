# Kirokukan (記録館)

> *Your personal anime archive.*

A minimal AniList client built around a single missing feature — sorting completed entries by **finish date** — and a UX that fits how I actually track shows.

Pulls your list from AniList, pushes edits back, and adds quality-of-life things the official sites don't: an editor that auto-fills sensible defaults, a browse view with per-section navigation, and persistent local caching so the app feels instant on reload.

## Features

- **Two-way sync with AniList** via OAuth (implicit grant — no server, no client secret)
- **Lists** for both anime and manga, with all six status tabs
- **Sort by completed date** (the original motivation), plus title / updated / added / start date / etc.
- **URL-driven state** — tab and sort live in the URL, so views are shareable and back/forward works
- **Browse** with curated sections (Trending, Popular This Season, Top 100, All-Time Popular, Upcoming) plus full advanced filtering (genre, tag, year, season, format, status)
- **Editor modal** with `←/→` per-section navigation, status autofills (`→ Watching` fills started date, `→ Completed` fills progress to max and finished date), and inline "Mark Completed" nudges
- **Persistent cache** to IndexedDB so reloads hydrate your lists and any previously-opened title instantly
- **Mobile-aware** — Dialog on desktop, bottom Sheet on mobile, same form

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
   Open `http://localhost:5174` and sign in.

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
- Tokens last 1 year and live in `localStorage`.
- Score is intentionally not displayed on cards — see `src/lib/scoreColors.ts` for the rare exception (Top 100 tile metadata).

## License

Personal project. No license declared.
