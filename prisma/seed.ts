import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, TripStatus } from "../src/generated/prisma/client";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const SLUG = "peaks-of-the-balkans";

const hostBio = `**I'm Yury Kirillov.** I live in Amsterdam and have been running for about 13 years — from road to trail — and over that time I've completed many marathons and ultramarathons, primarily in the mountains.

In my professional life I spent most of my time in IT. In recent years I've also been organizing educational and research trips around the world with like-minded people: we explored ancient monuments in Jordan, visited remote tribes in the jungles of Nagaland and the Colombian Amazon, and took part in archaeological excavations in Uzbekistan. But all that time I really wanted to combine two of my true passions: travel and running. That's why I'm launching a new project — **DodoMiles**.

DodoMiles is about active travel to hard-to-reach corners of nature: running, hiking, and multi-day routes. All logistics are arranged in advance — accommodation, transfers, luggage transport, and support. At the same time, everyone runs at their own comfortable pace, with pre-agreed safety rules.`;

const description = `## Trip format

The trip is fully organized — accommodation, logistics, and support are planned in advance. Running is **self-paced**, but within a **clear safety system**.

**What's arranged**

- **Accommodation.** Hotels and guesthouses for every night.
- **Transfers.** Transfer from Tirana to the start and back from the finish, plus local rides during the trip.
- **Luggage transport.** We run light; luggage is moved between overnight stops by vehicle.

**How running works**

- **No on-trail escort.** This is not a guided run: everyone runs at their own pace.
- **Mini-groups.** When possible, we split into small pace groups — it helps with flow and safety.
- **Daily briefing & debrief.** Morning: route, weather, risks. Evening: the day's story, good food, and well-earned rest.

> **Safety, in short:** nobody is left "on their own." Everyone either shares live location or uses GPX tracks and check-ins, we define checkpoints in advance, and we avoid risky calls in bad weather or questionable conditions.

## Local expert

**Menduh Zavalani** has been deeply connected to mountains and nature since childhood — his father took him hiking in the Morava hills of southern Albania from an early age. Mendi trained as an architect and holds a degree in urban planning, but mountain travel has always remained his true passion. Through his travel company, he actively promotes routes in Albania's national parks.

His deep knowledge of the region allows travelers to truly understand, experience, and appreciate the freedom and raw beauty of the Albanian Alps, far from well-trodden paths. Mendi is a licensed mountain guide. On this trip, he supports route planning, organizes transfers and accommodation, helps resolve complex situations, leads briefings, and meets the group at the end of each day on the trail.

## Logistics

**Accommodation** — all overnight stays are arranged as part of the trip.

- Night 0: **Ebel Boutique Hotel** or similar — Tirana
- Night 1: **Polia Guesthouse** or similar — Theth
- Night 2: **Margjeka Hotel** or similar — Valbona
- Night 3: **Leonard Guesthouse / Bashkimi Guesthouse** or similar — Dobërdol
- Night 4: **Vucetaj Guesthouse** or similar — Vusanje
- Night 5: **Polia Guesthouse** or similar — Theth

**Transfers** — from Tirana to the start and back, plus all local rides, are arranged.

- Day 1: Tirana → Theth (group transfer)
- Day 6: Theth → Tirana (group transfer)
- Short transfers along the way to reduce running on roads

**Luggage transport** — luggage is moved between overnight stops so you can run with a small pack or vest.

- Luggage type: backpacks or duffels; suitcases won't work because part of the route uses horses.
- On you: phone, water, snacks, spare layer.

**Communication & coordination**

- Group chat: WhatsApp / Telegram
- Daily briefing: route, weather, key risks, check-in points
- Daily debrief: how the day went, timing, plan for the next day

> **Important:** there is no guide accompanying you on the trail. Trip organization is logistics and overall safety protocols, not continuous on-route support. If you're unsure whether this format fits you, message me with your experience — we'll talk it through and decide.

## Payment & participation terms

Participation fee: **€1050**

**Step-by-step**

- First we talk and confirm the format is right for you.
- Your spot is secured with a **30% deposit** of the total trip cost.
- **The remaining amount** is paid after final confirmation, no later than 3 months before the start date.

**Payment methods**

- Bank transfer (SEPA).
- Payment via a payment platform (on request). Service fee in this case is covered by the participant. Bank details are shared privately after participation is confirmed.

**Cancellation & refunds**

- **Until 18.04.2026:** full refund of the entire amount.
- **After 18.04.2026:** refund minus actual non-refundable expenses (accommodation, transfers), or a full refund if a replacement participant is found.
- **If the trip is canceled due to not reaching the minimum number of participants:** full refund of all paid funds.
- **If the organizer cancels the trip:** full refund of all funds.`;

type DayInput = {
  dayNumber: number;
  title: string;
  description: string;
  distanceKm?: number;
  elevationGainM?: number;
  elevationLossM?: number;
  imageUrl?: string;
};

const days: DayInput[] = [
  {
    dayNumber: 0,
    title: "Day 0 — Arrival in Tirana",
    description:
      "Arrival in Tirana, check-in at a hotel in the city center. Free time.",
    imageUrl: "/pics/tirana.jpg",
  },
  {
    dayNumber: 1,
    title: "Day 1 — Tirana → Theth (transfer)",
    description: `After breakfast at the hotel we head north toward the Balkan Alps. A winding mountain road brings us to the village of Theth — the home base for mountain lovers in Albania. This is where the Peaks of the Balkans route officially begins. Theth sits in a high valley surrounded by 2,000-meter peaks — with a stone church, wooden cabins, flocks of sheep, and wisps of cloud clinging to the ridges.

We'll explore the area, loosen up the legs, swim, listen to stories, and enjoy a great dinner — tomorrow the adventure starts.`,
    imageUrl: "/pics/day1.jpg",
  },
  {
    dayNumber: 2,
    title: "Day 2 — Theth → Valbona (run)",
    description: `Our first running day. After breakfast we pack our running vests and start from Theth. We climb to the Valbona Pass at around 1800 meters — wide views open over the valley and surrounding ridgelines. We'll snack near the pass, then begin the descent toward Valbona.

Valbona Valley National Park is considered one of the most beautiful places in Albania and lies in the heart of the Accursed Mountains. In the evening we reach the village of Valbona and stay in one of the local guesthouses scattered across the valley.`,
    distanceKm: 15,
    elevationGainM: 1100,
    elevationLossM: 800,
    imageUrl: "/pics/day2.jpg",
  },
  {
    dayNumber: 3,
    title: "Day 3 — Valbona → Çerem → Dobërdol (run)",
    description: `A long and very full day. After breakfast we leave Valbona and climb on an alpine trail to the Perslopit Pass (2039 m) on the border with Montenegro. We gain over 1000 m and find ourselves among the highest rocky peaks, including Maja Jezercë — the "queen of the Albanian Alps" (2694 m).

After a short section in Montenegro, we return to Albania and descend on a shepherd's trail to the secluded village of Çerem. In Çerem we rest, have lunch, and start the second part of the day. This section is easier — mostly forest and fields — but there's still another kilometer of ascent, so don't underestimate it.

By late afternoon we reach the shepherd settlement of Dobërdol. There are no roads here, and our luggage will arrive by horses. Dinner and rest.`,
    distanceKm: 29,
    elevationGainM: 2200,
    elevationLossM: 1300,
    imageUrl: "/pics/day3.jpg",
  },
  {
    dayNumber: 4,
    title: "Day 4 — Dobërdol → Babino Polje → Vusanje (run)",
    description: `Breakfast in Dobërdol, then we run toward the border with Montenegro. We start high today, so the first part doesn't have a huge climb. Soon the blueberry fields around Dobërdol give way to jagged peaks forming the massif at the border of three countries. If time and energy allow, we can take an optional spur to a nearby summit.

Once we're in Montenegro, we begin a gentle descent to the village of Babino Polje. At the end of the trail we'll find a cozy guesthouse with a terrace for a snack, then we hop into the bus for about a 1.5-hour drive to the next point — the Grbaje Valley, often (without false modesty) called one of the most scenic valleys in Europe. From here a beautiful mountain trail runs beneath the Talijanka and Popadija peaks, with views toward the sharp Karanfili ridge. At the end of the trail our bus meets us and takes us to the village of Vusanje, where we'll have dinner and spend the night.`,
    distanceKm: 20,
    elevationGainM: 1000,
    elevationLossM: 1600,
    imageUrl: "/pics/day4.jpg",
  },
  {
    dayNumber: 5,
    title: "Day 5 — Vusanje → Theth (run)",
    description: `The final running day — and the official end of the Peaks of the Balkans route. The Vusanje → Theth stage is considered one of the most beautiful sections of the entire trail: 20 kilometers of alpine meadows, lakes, waterfalls, and sharp peaks as we cross from Montenegro back into Albania.

We return to where it all began — the village of Theth — celebrate the finish with great food, share impressions, and enjoy a well-deserved rest for the remainder of the day.`,
    distanceKm: 20,
    elevationGainM: 900,
    elevationLossM: 1100,
    imageUrl: "/pics/day5.jpg",
  },
  {
    dayNumber: 6,
    title: "Day 6 — Theth → Tirana (return)",
    description:
      "Breakfast, goodbye to the mountains, then we take the bus back to Tirana. The adventure ends.",
  },
];

type FaqInput = { question: string; answer: string };

const faqItems: FaqInput[] = [
  {
    question: "What level of fitness is required?",
    answer: `This trip is designed for well-prepared runners. It includes **four consecutive running days** in the mountains, with daily distances of approximately **16–30 km** and significant elevation gain.

To participate, you should:

- run regularly at least 3–4 times per week;
- have experience with long trail runs or mountain races of 25–30 km or more;
- be comfortable with several hard days in a row without full recovery;
- be able to navigate using GPX tracks on a watch or smartphone.`,
  },
  {
    question: "How is accommodation arranged?",
    answer: `Accommodation is included and based on shared twin rooms. You will normally share a room with another participant.

Single-room accommodation may be available for an additional fee. However, it is **not always possible**: mountain guesthouses are often very simple, and single rooms do not exist everywhere.

Single-room availability is confirmed individually, once the final route and overnight locations are fixed.`,
  },
  {
    question: "What if I can't run part of a stage or need to skip a day?",
    answer: `The format accounts for this possibility. If you experience excessive fatigue, discomfort, or a minor injury, you may shorten a stage or skip it entirely.

Depending on the situation, options may include:

- skipping part of a stage using the luggage transfer vehicle;
- skipping a full day and moving directly to the next overnight location;
- traveling together with the local support guide outside the running route.

Decisions are made on-site, based on the participant's condition, logistical constraints, and overall safety considerations.`,
  },
  {
    question: "At what altitudes does the route run?",
    answer: `The route takes place at altitudes between approximately **850 and 2400 meters** above sea level.

If you know you are sensitive to altitude or have medical conditions related to high elevation, you should consult a doctor in advance.

Each participant is responsible for assessing their own health and limits.`,
  },
  {
    question: "Can the route change?",
    answer: `Yes. The route may be adjusted on any day of the trip.

Possible reasons include:

- unfavorable weather conditions;
- overall fatigue or condition of the group;
- trail conditions (snow, washouts, landslides);
- other factors affecting safety.

Route changes are decided by the organizing side, with safety as the primary priority.`,
  },
  {
    question: "What is included in the price?",
    answer: `The price includes:

- accommodation for the entire route;
- meals from Day 1 to Day 6, except dinner on Day 2 in Valbona;
- all transfers, including luggage transport;
- organizational and logistical support;
- route materials and safety protocols.

Not included: flights to and from Tirana, personal travel insurance, meals outside organized stops, alcohol, personal equipment.`,
  },
  {
    question: "Is insurance required?",
    answer:
      "Yes. Participation requires personal travel and medical insurance that explicitly covers trail running and mountain activities.",
  },
  {
    question: "What equipment is required?",
    answer: `A full and final equipment list will be sent closer to the trip dates. It may change depending on weather forecasts and current mountain conditions.

Core requirements include:

- a running vest or backpack with water capacity of at least 1 liter;
- both light and warm running layers;
- trail running shoes;
- trail poles (preferably running-specific);
- a waterproof jacket with taped seams;
- emergency thermal blanket;
- elastic bandage, sports tape, blister plasters;
- sunscreen;
- a waterproof headlamp;
- GPX tracks for each day loaded on your phone or watch.

Due to altitude changes and variable mountain weather, conditions can shift significantly within a single day.`,
  },
];

async function main() {
  await prisma.trip.deleteMany({ where: { slug: SLUG } });

  await prisma.trip.create({
    data: {
      slug: SLUG,
      title: "Peaks of the Balkans",
      tagline:
        "A pilot trail-running trip into the rocky peaks and folklore of the Balkan Alps, on the border of Albania and Montenegro.",
      status: TripStatus.PUBLISHED,

      startDate: new Date("2026-07-19T00:00:00Z"),
      endDate: new Date("2026-07-24T00:00:00Z"),

      countries: ["Albania", "Montenegro"],
      region: "Peaks of the Balkans",
      startCity: "Tirana",
      endCity: "Tirana",

      priceCents: 105_000,
      depositCents: 31_500,
      currency: "EUR",
      maxParticipants: 7,

      heroImageUrl: "/pics/header_sun.jpg",
      summary:
        "Six days, four running days, 85 km across Albania and Montenegro on the Peaks of the Balkans trail. Accommodation, transfers, and luggage transport included.",
      description,

      hostName: "Yury Kirillov",
      hostBio,
      hostImageUrl: "/pics/me.jpg",

      inclusions: [
        "Accommodation for the entire route",
        "All transfers (Tirana → mountains → Tirana, plus local rides)",
        "Luggage transport between overnight stops",
        "Meals from Day 1 to Day 6 (except dinner on Day 2 in Valbona)",
        "Daily briefings and on-trip coordination",
        "Local expert support (route, accommodation, end-of-day meet-up)",
      ],

      days: {
        create: days.map((d) => ({
          dayNumber: d.dayNumber,
          title: d.title,
          description: d.description,
          distanceKm: d.distanceKm,
          elevationGainM: d.elevationGainM,
          elevationLossM: d.elevationLossM,
          imageUrl: d.imageUrl,
        })),
      },

      faqItems: {
        create: faqItems.map((f, i) => ({
          question: f.question,
          answer: f.answer,
          order: i,
        })),
      },
    },
  });

  const count = await prisma.trip.count();
  console.log(`Seed complete. ${count} trip(s) in the database.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
