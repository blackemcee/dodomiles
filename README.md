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

1. **Create the project.** In Railway: *New Project → Deploy from GitHub repo*. Select `blackemcee/dodomiles`. Railway defaults the branch to `main` — **change it to `next`** (Settings → Source → Branch connected to production), otherwise it will try to deploy the legacy static HTML site.
2. **Add Postgres.** Project canvas → *+ New → Database → Add PostgreSQL*. Railway provisions it in seconds.
3. **Wire the database into the app service.** App service → *Variables* → add:
   - Key: `DATABASE_URL`
   - Value: `${{Postgres.DATABASE_URL}}` (Railway substitutes the internal connection string at runtime)
4. **Wait for the deploy.** Railway runs `npm install` → `npm run build` (Prisma generate + Next build) → `npm run start:prod` (Prisma migrate deploy + Next start). The migrate step creates the `Trip` / `TripDay` / `FaqItem` tables on first deploy. ~3 minutes end-to-end. Watch *Deployments* tab; should end green.
5. **Seed the first trip.** The seed is intentionally *not* part of the deploy chain — it would silently overwrite prod data on every redeploy. Grab the public Postgres URL and run the seed from your laptop:
   - Railway → *Postgres* service → *Variables* → reveal and copy `DATABASE_PUBLIC_URL` (the `*.proxy.rlwy.net` one). The internal URL won't work from outside Railway.
   - Locally:
     ```bash
     DATABASE_URL='paste-public-url-here' npm run db:seed
     ```
   - You should see `Seed complete. 1 trip(s) in the database.`
   - (The Railway CLI's `railway run` defaults to injecting the linked service's `DATABASE_URL`, which is the *internal* one — so `railway run npm run db:seed` won't work from outside Railway without manually overriding the URL.)
6. **Expose a public URL.** App service → *Settings → Networking → Generate Domain*. Railway hands you a `*.up.railway.app` URL.
7. **Visit it.** The home page should show the Peaks of the Balkans card; `/trips/peaks-of-the-balkans` should render the full trip detail.

### Custom domain (deferred)

Don't flip `dodomiles.com` over yet — the live site at that domain still serves
from GitHub Pages on `main`. Once the Railway deploy is solid:

1. Railway service → *Settings → Networking → Custom Domain* → add `dodomiles.com`.
2. Update DNS at the registrar to point at the Railway hostname (Railway shows the exact CNAME/AAAA values).
3. After propagation, disable GitHub Pages in repo settings and merge `next` → `main`.

## Operational notes

- **Migrations** run automatically on every deploy (`prisma migrate deploy` is idempotent). Add a new migration locally with `npx prisma migrate dev --name <slug>` and commit the generated SQL.
- **Pages must tolerate the DB being unreachable at build time.** Railway's build sandbox can't resolve `postgres.railway.internal` — that hostname only works at runtime once a container joins the Railway private network. Any new server component / `generateStaticParams` / `generateMetadata` that queries Prisma must wrap the call in `try/catch` with a sensible fallback (see `src/app/page.tsx` and `src/app/trips/[slug]/page.tsx` for the pattern). ISR / on-demand rendering takes over at runtime.
- **Images** in `public/pics/` ship with the deploy. Long-term, they should move to Cloudflare R2 to avoid bloating the deploy artifact and to support admin uploads.
- **No admin UI yet** — trips are created via the seed script. The admin panel is planned for a later phase (see CLAUDE.md for the roadmap).
