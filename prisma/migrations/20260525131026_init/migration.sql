-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "countries" TEXT[],
    "region" TEXT NOT NULL,
    "startCity" TEXT NOT NULL,
    "endCity" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "depositCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "maxParticipants" INTEGER NOT NULL DEFAULT 8,
    "heroImageUrl" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hostName" TEXT NOT NULL,
    "hostBio" TEXT NOT NULL,
    "hostImageUrl" TEXT NOT NULL,
    "inclusions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripDay" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION,
    "elevationGainM" INTEGER,
    "elevationLossM" INTEGER,
    "imageUrl" TEXT,

    CONSTRAINT "TripDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FaqItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trip_slug_key" ON "Trip"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TripDay_tripId_dayNumber_key" ON "TripDay"("tripId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FaqItem_tripId_order_key" ON "FaqItem"("tripId", "order");

-- AddForeignKey
ALTER TABLE "TripDay" ADD CONSTRAINT "TripDay_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaqItem" ADD CONSTRAINT "FaqItem_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
