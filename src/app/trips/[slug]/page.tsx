import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Markdown } from "@/components/Markdown";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  formatDateRange,
  formatPriceEuros,
  getPublishedTrips,
  getTripBySlug,
  tripDurationDays,
  tripStats,
} from "@/lib/trips";

export const revalidate = 60;

export async function generateStaticParams() {
  const trips = await getPublishedTrips();
  return trips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return {};
  return {
    title: trip.title,
    description: trip.tagline,
    openGraph: {
      title: trip.title,
      description: trip.tagline,
      images: [{ url: trip.heroImageUrl }],
    },
  };
}

const navItems = [
  { href: "#overview", label: "Overview" },
  { href: "#itinerary", label: "Itinerary" },
  { href: "#host", label: "Host" },
  { href: "#details", label: "Details" },
  { href: "#faq", label: "FAQ" },
  { href: "#join", label: "Join" },
];

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) notFound();

  const stats = tripStats(trip);
  const duration = tripDurationDays(trip.startDate, trip.endDate);

  return (
    <>
      <SiteHeader navItems={navItems} />
      <main className="flex-1">
        {/* HERO */}
        <section id="overview" className="mx-auto max-w-[1080px] px-4 pt-10 pb-12 sm:pt-16">
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-sm text-[color:var(--faint)] hover:text-[color:var(--ink)]"
          >
            ← All trips
          </Link>

          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-3 py-1 text-xs font-medium uppercase tracking-wider text-[color:var(--bg0)]">
            Pilot edition
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-[color:var(--ink)] sm:text-5xl md:text-6xl">
            {trip.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)] sm:text-xl">
            {trip.tagline}
          </p>

          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-brand)] shadow-[var(--shadow-brand)]">
            <Image
              src={trip.heroImageUrl}
              alt={trip.title}
              fill
              sizes="(max-width: 1080px) 100vw, 1080px"
              className="object-cover"
              priority
            />
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-brand)] border border-[color:var(--line)] bg-[color:var(--line)] sm:grid-cols-3 lg:grid-cols-5">
            <QuickFact label="Dates" value={formatDateRange(trip.startDate, trip.endDate)} />
            <QuickFact label="Duration" value={`${duration} days`} />
            <QuickFact
              label="Start / Finish"
              value={
                trip.startCity === trip.endCity
                  ? trip.startCity
                  : `${trip.startCity} → ${trip.endCity}`
              }
            />
            <QuickFact label="Group size" value={`Up to ${trip.maxParticipants}`} />
            <QuickFact
              label="Price"
              value={`From ${formatPriceEuros(trip.priceCents, trip.currency)}`}
            />
          </dl>
        </section>

        {/* ITINERARY */}
        <section id="itinerary" className="mx-auto max-w-[1080px] px-4 py-12">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl">
              Itinerary
            </h2>
            <p className="mt-3 text-[color:var(--muted)]">
              {stats.runningDays} running days
              {stats.totalKm > 0 && ` · ${stats.totalKm} km total`}
              {stats.totalElevationGainM > 0 &&
                ` · +${stats.totalElevationGainM.toLocaleString()} m elevation`}
              .
            </p>
          </div>

          <ol className="space-y-5">
            {trip.days.map((day) => (
              <li
                key={day.id}
                className="overflow-hidden rounded-[var(--radius-brand)] border border-[color:var(--line)] bg-[color:var(--card)] shadow-[var(--shadow-brand)]"
              >
                <article className="grid gap-0 md:grid-cols-[1fr_288px]">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-2.5 py-0.5 text-xs font-medium text-white">
                        Day {day.dayNumber}
                      </span>
                      {day.distanceKm && (
                        <span className="inline-flex items-center rounded-full border border-[color:var(--line)] px-2.5 py-0.5 text-xs text-[color:var(--muted)]">
                          Run
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-[color:var(--ink)] sm:text-2xl">
                      {day.title}
                    </h3>
                    {(day.distanceKm ||
                      day.elevationGainM ||
                      day.elevationLossM) && (
                      <p className="mt-2 text-sm text-[color:var(--faint)]">
                        {day.distanceKm && `${day.distanceKm} km`}
                        {day.elevationGainM && ` · +${day.elevationGainM} m`}
                        {day.elevationLossM && ` · −${day.elevationLossM} m`}
                      </p>
                    )}
                    <div className="mt-4">
                      <Markdown>{day.description}</Markdown>
                    </div>
                  </div>
                  {day.imageUrl && (
                    <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:w-72 md:min-h-[260px]">
                      <Image
                        src={day.imageUrl}
                        alt={day.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 288px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </section>

        {/* HOST */}
        <section id="host" className="mx-auto max-w-[1080px] px-4 py-12">
          <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl">
            About your host
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-[200px_1fr] md:gap-10">
            <div className="relative h-48 w-48 overflow-hidden rounded-full md:h-[200px] md:w-[200px]">
              <Image
                src={trip.hostImageUrl}
                alt={trip.hostName}
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <div>
              <Markdown>{trip.hostBio}</Markdown>
            </div>
          </div>
        </section>

        {/* DETAILS (format + logistics + payment) */}
        <section id="details" className="mx-auto max-w-[1080px] px-4 py-12">
          <Markdown>{trip.description}</Markdown>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-[1080px] px-4 py-12">
          <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl">
            FAQ
          </h2>
          <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
            This is a physically demanding trip. Below are clear, practical
            answers about fitness, logistics, and participation conditions.
          </p>
          <div className="mt-8 divide-y divide-[color:var(--line)] rounded-[var(--radius-brand)] border border-[color:var(--line)] bg-[color:var(--card)] shadow-[var(--shadow-brand)]">
            {trip.faqItems.map((faq) => (
              <details key={faq.id} className="group p-6 sm:p-7">
                <summary className="flex cursor-pointer items-start justify-between gap-4 text-base font-medium text-[color:var(--ink)] [&::-webkit-details-marker]:hidden">
                  <span className="flex-1">{faq.question}</span>
                  <span
                    className="mt-1 text-[color:var(--accent)] transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <div className="mt-4">
                  <Markdown>{faq.answer}</Markdown>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* JOIN */}
        <section id="join" className="mx-auto max-w-[1080px] px-4 py-12 pb-20">
          <div className="rounded-[var(--radius-brand)] border border-[color:var(--line)] bg-gradient-to-br from-[color:var(--bg2)] via-[color:var(--bg1)] to-[color:var(--bg0)] p-8 shadow-[var(--shadow-brand)] sm:p-12">
            <h2 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-4xl">
              How to join
            </h2>
            <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
              This is a pilot format with a group of {trip.maxParticipants}{" "}
              people. If you&apos;re interested, send me a message and
              we&apos;ll confirm together whether the format is right for you.
            </p>

            <div className="mt-6 max-w-2xl space-y-2 text-[color:var(--muted)]">
              <p className="font-medium text-[color:var(--ink)]">
                Information to include:
              </p>
              <ul className="list-disc pl-5">
                <li>your name and city/country of origin;</li>
                <li>a short summary of your running background, especially trail experience;</li>
                <li>approximate weekly training volume;</li>
                <li>any constraints or considerations (injuries, health, diet).</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#176b3e]"
                href={`mailto:yury@kirillov.nl?subject=${encodeURIComponent(trip.title)}`}
              >
                Email
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent2)] px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2168b8]"
                href="https://wa.me/31612234441"
              >
                WhatsApp
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent2)] px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2168b8]"
                href="https://t.me/blackemcee"
              >
                Telegram
              </a>
            </div>

            <p className="mt-6 text-sm text-[color:var(--faint)]">
              Payment is discussed after fit confirmation. Deposit secures the
              spot.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[color:var(--card)] p-4 sm:p-5">
      <dt className="text-xs uppercase tracking-wider text-[color:var(--faint)]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-[color:var(--ink)] sm:text-base">
        {value}
      </dd>
    </div>
  );
}
