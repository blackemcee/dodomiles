import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  formatDateRange,
  formatPriceEuros,
  getPublishedTrips,
  tripStats,
  type TripWithRelations,
} from "@/lib/trips";

export const revalidate = 60;

export default async function HomePage() {
  const trips = await getPublishedTrips();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-[1080px] px-4 pt-16 pb-12 sm:pt-24">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--faint)]">
            DodoMiles
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-[color:var(--ink)] sm:text-5xl md:text-6xl">
            Trail running trips, in good company.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)] sm:text-xl">
            Small-group trips into remote mountains. All logistics handled —
            accommodation, transfers, luggage. You run at your own pace,
            inside a clear safety system.
          </p>
        </section>

        <section className="mx-auto max-w-[1080px] px-4 pb-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--ink)]">
              Upcoming trips
            </h2>
            <p className="text-sm text-[color:var(--faint)]">
              {trips.length === 1
                ? "1 trip currently open"
                : `${trips.length} trips currently open`}
            </p>
          </div>

          {trips.length === 0 ? (
            <div className="rounded-[var(--radius-brand)] border border-dashed border-[color:var(--line)] bg-[color:var(--card)] p-10 text-center text-[color:var(--muted)]">
              No trips published right now. Check back soon.
            </div>
          ) : trips.length === 1 ? (
            <FeaturedTripCard trip={trips[0]} />
          ) : (
            <ul className="grid gap-6 md:grid-cols-2">
              {trips.map((trip) => (
                <li key={trip.id}>
                  <TripCard trip={trip} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mx-auto max-w-[1080px] px-4 pb-20">
          <div className="rounded-[var(--radius-brand)] border border-[color:var(--line)] bg-[color:var(--card)] p-8 shadow-[var(--shadow-brand)] sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--ink)]">
              About DodoMiles
            </h2>
            <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
              DodoMiles is a small operator of guided trail-running trips into
              hard-to-reach corners of nature. Accommodation, transfers, and
              luggage transport are arranged in advance. On the trail, everyone
              runs at their own comfortable pace, with pre-agreed safety rules.
            </p>
            <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
              Run by{" "}
              <strong className="text-[color:var(--ink)]">Yury Kirillov</strong>{" "}
              from Amsterdam — 13 years of running, many mountain ultras, and a
              love for organising trips that wouldn&apos;t exist otherwise.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function TripCard({ trip }: { trip: TripWithRelations }) {
  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group block overflow-hidden rounded-[var(--radius-brand)] border border-[color:var(--line)] bg-[color:var(--card)] shadow-[var(--shadow-brand)] transition-transform hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--bg1)]">
        <Image
          src={trip.heroImageUrl}
          alt={trip.title}
          fill
          sizes="(max-width: 768px) 100vw, 540px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          priority
        />
        <span className="absolute left-4 top-4 rounded-full bg-[color:var(--ink)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[color:var(--bg0)]">
          Pilot edition
        </span>
      </div>
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-2 text-sm text-[color:var(--faint)]">
          <span>{trip.countries.join(" · ")}</span>
          <span aria-hidden>·</span>
          <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--ink)]">
          {trip.title}
        </h3>
        <p className="text-[color:var(--muted)]">{trip.tagline}</p>
        <div className="mt-2 flex items-center justify-between border-t border-[color:var(--line)] pt-4">
          <span className="text-sm text-[color:var(--faint)]">
            From{" "}
            <span className="font-semibold text-[color:var(--ink)]">
              {formatPriceEuros(trip.priceCents, trip.currency)}
            </span>
          </span>
          <span className="text-sm font-medium text-[color:var(--accent)] group-hover:underline">
            See the trip →
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedTripCard({ trip }: { trip: TripWithRelations }) {
  const stats = tripStats(trip);
  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group block overflow-hidden rounded-[var(--radius-brand)] border border-[color:var(--line)] bg-[color:var(--card)] shadow-[var(--shadow-brand)] transition-transform hover:-translate-y-0.5"
    >
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--bg1)] md:aspect-auto md:min-h-[420px]">
          <Image
            src={trip.heroImageUrl}
            alt={trip.title}
            fill
            sizes="(max-width: 768px) 100vw, 540px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
          <span className="absolute left-5 top-5 rounded-full bg-[color:var(--ink)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[color:var(--bg0)]">
            Pilot edition
          </span>
        </div>
        <div className="flex flex-col justify-between gap-6 p-8 sm:p-10">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[color:var(--faint)]">
              {trip.countries.join(" · ")} ·{" "}
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
            <h3 className="text-3xl font-semibold leading-tight tracking-tight text-[color:var(--ink)] sm:text-4xl">
              {trip.title}
            </h3>
            <p className="text-lg text-[color:var(--muted)]">{trip.tagline}</p>
            {stats.totalKm > 0 && (
              <p className="text-sm text-[color:var(--faint)]">
                {stats.runningDays} running days · {stats.totalKm} km ·{" "}
                {`+${stats.totalElevationGainM.toLocaleString()} m`}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-[color:var(--line)] pt-5">
            <span className="text-base text-[color:var(--faint)]">
              From{" "}
              <span className="text-lg font-semibold text-[color:var(--ink)]">
                {formatPriceEuros(trip.priceCents, trip.currency)}
              </span>
            </span>
            <span className="text-sm font-medium text-[color:var(--accent)] group-hover:underline">
              See the trip →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
