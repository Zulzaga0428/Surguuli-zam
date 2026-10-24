// Хуудсуудын зураг авах: node scripts/shot.mjs [base] — Edge headless
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
const base = process.argv[2] ?? "http://localhost:3100";
const pages = (process.argv[3] ?? "/").split(",");
mkdirSync("shots", { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
for (const [w, h, tag] of [[1440, 900, "pc"], [390, 844, "m"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  for (const p of pages) {
    const r = await page.goto(base + p, { waitUntil: "networkidle" });
    const ow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = `shots/${tag}${p.replace(/[/?=&]/g, "_") || "_"}.png`;
    await page.screenshot({ path: name, fullPage: true });
    console.log(r?.status(), tag, p, ow > 0 ? `OVERFLOW ${ow}px` : "", name);
  }
  await ctx.close();
}
await browser.close();
