import "server-only";

import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

const tripDetailArgs = {
  include: {
    days: { orderBy: { dayNumber: "asc" } },
    faqItems: { orderBy: { order: "asc" } },
  },
} satisfies Prisma.TripDefaultArgs;

export type TripWithRelations = Prisma.TripGetPayload<typeof tripDetailArgs>;

export async function getPublishedTrips(): Promise<TripWithRelations[]> {
  return prisma.trip.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { startDate: "asc" },
    ...tripDetailArgs,
  });
}

export async function getTripBySlug(
  slug: string
): Promise<TripWithRelations | null> {
  return prisma.trip.findFirst({
    where: { slug, status: "PUBLISHED" },
    ...tripDetailArgs,
  });
}

export function formatPriceEuros(cents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDateRange(start: Date, end: Date): string {
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const dayFmt = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    timeZone: "UTC",
  });
  const monthFmt = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    timeZone: "UTC",
  });
  const yearFmt = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    timeZone: "UTC",
  });

  if (sameMonth && sameYear) {
    return `${dayFmt.format(start)}–${dayFmt.format(end)} ${monthFmt.format(end)} ${yearFmt.format(end)}`;
  }
  if (sameYear) {
    return `${dayFmt.format(start)} ${monthFmt.format(start)} – ${dayFmt.format(end)} ${monthFmt.format(end)} ${yearFmt.format(end)}`;
  }
  return `${dayFmt.format(start)} ${monthFmt.format(start)} ${yearFmt.format(start)} – ${dayFmt.format(end)} ${monthFmt.format(end)} ${yearFmt.format(end)}`;
}

export function tripDurationDays(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000)) + 1;
}

export function tripStats(trip: TripWithRelations): {
  runningDays: number;
  totalKm: number;
  totalElevationGainM: number;
} {
  const runningDays = trip.days.filter(
    (d) => d.distanceKm !== null && d.distanceKm !== undefined
  ).length;
  const totalKm = trip.days.reduce(
    (sum, d) => sum + (d.distanceKm ?? 0),
    0
  );
  const totalElevationGainM = trip.days.reduce(
    (sum, d) => sum + (d.elevationGainM ?? 0),
    0
  );
  return { runningDays, totalKm, totalElevationGainM };
}
