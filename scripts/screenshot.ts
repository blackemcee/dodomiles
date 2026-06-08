import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs/promises";

type Shot = {
  name: string;
  url: string;
  width: number;
  height: number;
  fullPage?: boolean;
};

const BASE = process.env.SCREENSHOT_BASE ?? "http://localhost:3737";

type Section = { name: string; scrollTo: string };

const shots: (Shot & { sections?: Section[] })[] = [
  { name: "home-desktop", url: "/", width: 1280, height: 900, fullPage: true },
  { name: "home-mobile", url: "/", width: 390, height: 844, fullPage: true },
  {
    name: "trip-desktop",
    url: "/trips/peaks-of-the-balkans",
    width: 1280,
    height: 1400,
    fullPage: true,
    sections: [
      { name: "trip-desktop-hero", scrollTo: "#overview" },
      { name: "trip-desktop-itinerary", scrollTo: "#itinerary" },
      { name: "trip-desktop-host", scrollTo: "#host" },
      { name: "trip-desktop-details", scrollTo: "#details" },
      { name: "trip-desktop-faq", scrollTo: "#faq" },
      { name: "trip-desktop-join", scrollTo: "#join" },
    ],
  },
  {
    name: "trip-mobile",
    url: "/trips/peaks-of-the-balkans",
    width: 390,
    height: 844,
    fullPage: true,
  },
  { name: "login-desktop", url: "/login", width: 1280, height: 900, fullPage: true },
  { name: "login-mobile", url: "/login", width: 390, height: 844, fullPage: true },
];

async function main() {
  const outDir = path.resolve("screenshots");
  await fs.mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  try {
    for (const shot of shots) {
      const context = await browser.newContext({
        viewport: { width: shot.width, height: shot.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      const url = new URL(shot.url, BASE).toString();
      await page.goto(url, { waitUntil: "networkidle" });
      // Give Next image optimisation a tick to settle.
      await page.waitForTimeout(300);

      const file = path.join(outDir, `${shot.name}.png`);
      await page.screenshot({ path: file, fullPage: shot.fullPage ?? false });
      console.log(
        `${shot.name.padEnd(24)} ${shot.width}x${shot.height}  → ${file}`
      );

      for (const section of shot.sections ?? []) {
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
        }, section.scrollTo);
        await page.waitForTimeout(150);
        const sFile = path.join(outDir, `${section.name}.png`);
        await page.screenshot({ path: sFile });
        console.log(
          `${section.name.padEnd(24)} ${shot.width}x${shot.height}  → ${sFile}`
        );
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
