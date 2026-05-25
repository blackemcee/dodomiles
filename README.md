# DodoMiles

Public website + booking platform for [DodoMiles](https://dodomiles.com), a
small operator of guided trail-running trips.

Next.js 16 (App Router) + React 19 + Tailwind v4 + Prisma 7 + Postgres.
Designed to run as a single service on **Railway** with a managed Postgres
add-on.

## Layout

- `src/app/` — App Router. `page.tsx` is the trips gallery, `trips/[slug]/page.tsx` is the trip detail page.
- `src/lib/` — `db.ts` (Prisma client singleton) + `trips.ts` (queries + formatting helpers).
- `src/components/` — `SiteHeader`, `SiteFooter`, `Markdown`.
- `prisma/` — schema, migrations, and seed script (`seed.ts`).
- `public/pics/` — image assets, eventually to be replaced by Cloudflare R2 uploads.
- `legacy/` — frozen snapshot of the original static one-pager; reference only, not served.
- `scripts/screenshot.ts` — Playwright screenshot helper for local visual verification.

## Local development

Requirements:

- Node ≥ 22 (use `fnm install --lts && fnm use`)
- Docker (for the local Postgres)

```bash
cp .env.example .env       # one-time: copies DATABASE_URL pointing at the docker postgres
npm install                # also runs `prisma generate` via postinstall
npm run db:up              # starts postgres on host port 5433
npx prisma migrate dev     # applies migrations; runs the seed on a fresh DB
npm run dev                # http://localhost:3000
```

Other useful scripts:

- `npm run db:studio` — open Prisma Studio against local DB
- `npm run db:seed` — re-run the seed (clears + recreates the seeded trip)
- `npm run db:reset` — wipe the postgres volume and start fresh
- `npm run screenshot` — Playwright captures of home + trip page at desktop and mobile widths into `screenshots/` (gitignored)

## Deploying to Railway

This repo is configured for Railway via `railway.json`. The build uses Nixpacks
(Railway's default Node builder); the start command runs pending migrations
before booting Next.js:

```
npm run start:prod   #  prisma migrate deploy && next start
```

### First-time deploy

1. **Create the project.** In Railway, *New Project → Deploy from GitHub repo*. Select `blackemcee/dodomiles` and the `next` branch.
2. **Add Postgres.** From the project canvas, *+ New → Database → Add PostgreSQL*. Railway provisions it in seconds.
3. **Wire the database into the app service.** Open the app service → *Variables* → reference the Postgres' connection string:
   - Key: `DATABASE_URL`
   - Value: `${{Postgres.DATABASE_URL}}` (Railway substitutes the actual URL)
4. **Trigger a deploy.** Railway will run `npm install` → `npm run build` → `npm run start:prod`. The start command runs `prisma migrate deploy` against the new Postgres, which applies the `init` migration and creates the schema.
5. **Seed the first trip.** The seed is intentionally *not* part of the deploy chain (so it never silently overwrites prod data). Run it once via the Railway CLI:
   ```bash
   railway run --service <app-service-name> npm run db:seed
   ```
   Or use Railway's web shell on the app service: *...* → *Connect → Shell* → `npm run db:seed`.
6. **Visit the URL.** Railway gives the app service a `*.up.railway.app` URL by default. Visit it; the gallery should show Peaks of the Balkans.

### Custom domain (deferred)

Don't flip `dodomiles.com` over yet — the live site at that domain still serves
from GitHub Pages on `main`. Once the Railway deploy is solid:

1. Railway service → *Settings → Networking → Custom Domain* → add `dodomiles.com`.
2. Update DNS at the registrar to point at the Railway hostname (Railway shows the exact CNAME/AAAA values).
3. After propagation, disable GitHub Pages in repo settings and merge `next` → `main`.

## Operational notes

- Migrations run automatically on every deploy (`prisma migrate deploy` is idempotent). Add a new migration locally with `npx prisma migrate dev --name <slug>` and commit the generated SQL.
- Image uploads in `public/pics/` ship with the deploy. Long-term, they should move to Cloudflare R2 to avoid bloating the deploy artifact and to support admin uploads.
- There's no admin UI yet — trips are created via the seed script. The admin panel is planned for a later phase (see CLAUDE.md for the roadmap).
