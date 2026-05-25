# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**DodoMiles** — a small operator of guided trail-running trips. The repo hosts the public website (trip gallery + per-trip pages), the user dashboard (account, bookings), and an admin panel for managing trips. Production target: **Railway** (Postgres add-on, single service deploy), domain `dodomiles.com`.

We're mid-migration from a static one-pager to a full-stack app. The legacy static site still ships from the `main` branch via GitHub Pages while the new app is built on the `next` branch.

## Tech stack

- **Next.js 16** (App Router, TypeScript, Turbopack) — frontend + backend in one service.
- **React 19** — Server Components by default; client components only where needed.
- **Tailwind v4** — `@import "tailwindcss"` + `@theme inline {}` in `src/app/globals.css`. Brand tokens live as CSS custom properties on `:root` and are re-exported into Tailwind via `@theme inline`, so `bg-bg0`, `text-ink`, `text-accent`, etc. all work.
- **Postgres + Prisma** (planned) — relational data for trips, users, bookings.
- **NextAuth.js v5** (planned) — email + Google OAuth, Prisma adapter.
- **Stripe Checkout** (planned) — deposits and full payments for bookings.
- **Cloudflare R2** (planned) — image hosting; uploads via the admin panel.
- **Resend** (planned) — transactional email.

> AGENTS.md note from create-next-app: Next.js 16 / React 19 may differ from older training data. When in doubt, read `node_modules/next/dist/docs/` rather than assuming pre-15 conventions.

## Layout

- `src/app/` — App Router. `layout.tsx` sets brand metadata, `page.tsx` is the home gallery (currently a placeholder).
- `src/app/globals.css` — Tailwind + brand tokens.
- `public/` — static assets served at site root. `public/pics/` mirrors the legacy images; will eventually be replaced by Cloudflare R2-hosted uploads.
- `public/favicon.ico` *(via `src/app/favicon.ico`)* — Next App Router convention: favicon lives inside `src/app/`.
- `legacy/` — frozen snapshot of the original static site (`index.html`, `ru/index.html`, `pics/`, `CNAME`, `favicon.ico`). Reference only; **not** served. Pull design ideas and copy from here when building real pages.
- `.nvmrc` — pins Node LTS. `engines.node` in `package.json` enforces ≥22 for Railway.

## Branches

- `main` — the legacy static site. Still live at dodomiles.com via GitHub Pages until we flip DNS to Railway.
- `next` — the Next.js rebuild. Active development branch.

Do **not** merge `next` into `main` until DNS is ready to flip, since that would replace the live static site.

## Roadmap (phases)

1. ~~Scaffold Next.js + Tailwind + legacy archive.~~ ✅
2. Prisma + Postgres (Docker for local dev).
3. Trip schema + seed Peaks of the Balkans from `legacy/index.html`.
4. Public pages: `/` gallery + `/trips/[slug]` detail.
5. Railway project + first deploy.
6. NextAuth + user accounts (`/account`).
7. Booking model + Stripe Checkout flow.
8. Admin panel (`/admin` — role-gated CRUD + image upload).
9. SEO, sitemap, Resend transactional email.
10. (Later) RU translations via next-intl.

## Working on it

- `npm run dev` — Turbopack dev server.
- `npm run build && npm start` — production smoke test.
- `npm run lint` — flat ESLint config (`eslint.config.mjs`).
- Node: fnm (`.nvmrc` honored via `eval "$(fnm env --use-on-cd)"`).

## Contact details (carried over)

Contact links appearing in the legacy site (`mailto:yury@kirillov.nl`, `https://wa.me/31612234441`, `https://t.me/blackemcee`) will be reused in the new app. Single source of truth lives in code once Phase 4 lands — update there, not in `legacy/`.
