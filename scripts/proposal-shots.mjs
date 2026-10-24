// Төслийн баримтад зориулсан зураг (зөвхөн уншина): node scripts/proposal-shots.mjs <outdir>
import { chromium } from "playwright-core";
const base = "https://demo.zulzaga.app";
const out = process.argv[2];
const pw = process.env.DEMO_PASSWORD;
const browser = await chromium.launch({ channel: "msedge" });
const shot = async (ctx, path, file, opts = {}) => {
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: "networkidle" });
  if (opts.scroll) await p.evaluate((y) => window.scrollTo(0, y), opts.scroll);
  await p.screenshot({ path: `${out}/${file}`, fullPage: !!opts.full, clip: opts.clip });
  await p.close();
  console.log("ok", file);
};
const pc = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
await shot(pc, "/", "home-pc.png", { full: true });
for (const n of [1, 2, 3, 4]) await shot(pc, `/surguuli/${n}`, `school-${n}.png`, { clip: { x: 0, y: 0, width: 1440, height: 760 } });
await shot(pc, "/surguuli/2", "school-full.png", { full: true });
await shot(pc, "/il-tod", "il-tod.png");
await shot(pc, "/hicheeliin-jil", "huanli.png");
await shot(pc, "/holboo", "holboo.png");
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await shot(m, "/", "home-m.png");
await shot(m, "/", "home-m2.png", { scroll: 860 });
await shot(m, "/surguuli/3", "school-m.png");
// админ (зөвхөн харна)
const a = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
const p = await a.newPage();
await p.goto(base + "/admin/login");
await p.fill("input[name=username]", "sum");
await p.fill("input[name=password]", pw);
await p.getByRole("button", { name: "Нэвтрэх" }).click();
await p.waitForURL(base + "/admin");
await p.close();
await shot(a, "/admin", "admin-dash.png");
await shot(a, "/admin/medee/new", "admin-post.png");
await shot(a, "/admin/domain", "admin-domain.png");
await shot(a, "/admin/surguuli", "admin-schools.png");
await browser.close();
