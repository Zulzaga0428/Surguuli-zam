// Төслийн HTML → PDF + хуудас бүрийн зураг шалгах
import { chromium } from "playwright-core";
import { pathToFileURL } from "node:url";
const [src, pdf, pngDir] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
await page.goto(pathToFileURL(src).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const over = await page.evaluate(() => [...document.querySelectorAll(".page")].map((p, i) => {
  const foot = p.querySelector(".foot").getBoundingClientRect().top;
  let max = 0;
  for (const el of p.querySelectorAll("*")) { if (el.closest(".foot")) continue; const r = el.getBoundingClientRect(); if (r.height) max = Math.max(max, r.bottom); }
  return `${i + 1}: ${max > foot - 2 ? "OVERFLOW " + Math.round(max - foot) + "px" : "ok"}`;
}));
console.log(over.join("  "));
const pages = await page.$$(".page");
for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: `${pngDir}/p${i + 1}.png` });
await page.pdf({ path: pdf, format: "A4", printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
await browser.close();
console.log("pdf ok");
