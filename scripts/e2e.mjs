// Бүтэн урсгалын шалгалт: node scripts/e2e.mjs [base]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
const base = process.argv[2] ?? "http://localhost:3100";
const pw = process.env.DEMO_PASSWORD ?? "demo2026";
mkdirSync("shots", { recursive: true });
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓", m); } else { fail++; console.log("  ✗", m); } };

const browser = await chromium.launch({ channel: "msedge" });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
page.on("pageerror", (e) => { fail++; console.log("  ✗ PAGEERROR", e.message); });
const seen = (loc, ms = 20000) => loc.waitFor({ state: "visible", timeout: ms }).then(() => true, () => false);
const stamp = Date.now().toString().slice(-5);

console.log("1. Санал хүсэлт илгээх (нийтийн сайт)");
await page.goto(base + "/holboo");
await page.getByText("Гомдол", { exact: true }).click();
await page.locator("select[name=schoolId]").selectOption({ label: "Замын-Үүд сумын 2-р сургууль" });
await page.locator("textarea[name=body]").fill(`Шалгалтын санал ${stamp}: сургуулийн хаалганы гэрэлтүүлэг муу байна.`);
await page.getByRole("button", { name: "Илгээх" }).click();
ok(await seen(page.getByText("хүлээн авагдлаа")), "санал хүлээн авагдлаа");

console.log("2. Буруу нууц үг");
await page.goto(base + "/admin/login");
await page.fill("input[name=username]", "sum");
await page.fill("input[name=password]", "wrong");
await page.getByRole("button", { name: "Нэвтрэх" }).click();
ok(await seen(page.getByText("буруу байна")), "буруу нууц үг татгалзав");

console.log("3. Сумын админ нэвтрэх");
await page.fill("input[name=password]", pw);
await page.getByRole("button", { name: "Нэвтрэх" }).click();
await page.waitForURL(base + "/admin", { timeout: 30000 });
ok(await seen(page.getByText("Сайн байна уу")), "самбар нээгдэв");

console.log("4. Санал хүсэлт админд ирсэн");
await page.goto(base + "/admin/sanal");
ok(await seen(page.getByText(`Шалгалтын санал ${stamp}`)), "санал жагсаалтад байна");

console.log("5. Зурагтай мэдээ нийтлэх");
await page.goto(base + "/admin/medee/new");
const title = `Туршилтын мэдээ ${stamp}`;
await page.fill("input[name=title]", title);
await page.locator("select[name=schoolId]").selectOption({ label: "Замын-Үүд сумын 3-р сургууль" });
await page.fill("textarea[name=body]", "Энэ бол шалгалтын мэдээ.\n\nХоёр дахь догол мөр.");
await page.setInputFiles("input[name=cover]", "public/img/school-3.webp");
await page.getByRole("button", { name: "Нийтлэх" }).click();
await page.waitForURL(/\/admin\/medee\?ok=1/, { timeout: 30000 });
ok(await seen(page.getByText(title)), "мэдээ админ жагсаалтад");
await page.goto(base + "/");
ok(await seen(page.getByText(title).first()), "мэдээ нүүр хуудсанд гарав");
await page.getByText(title).first().click();
await page.waitForURL(/\/medee\/\d+/);
const img = await page.locator("article img").first().evaluate((i) => i.naturalWidth).catch(() => 0);
ok(img > 0, "нүүр зураг ачааллав");
await page.goto(base + "/surguuli/3");
ok(await seen(page.getByText(title).first()), "3-р сургуулийн хуудсанд гарав");
await page.goto(base + "/surguuli/1");
ok(!(await page.getByText(title).first().isVisible().catch(() => false)), "1-р сургуулийн хуудсанд ГАРААГҮЙ");

console.log("6. Хуанлид үйл явдал нэмэх");
await page.goto(base + "/admin/huanli");
await page.fill("form input[name=title]", `Шалгалтын өдөр ${stamp}`);
await page.fill("input[name=startsOn]", "2027-02-15");
await page.getByRole("button", { name: "Нэмэх" }).click();
await page.waitForURL(/ok=1/);
await page.goto(base + "/hicheeliin-jil");
ok(await seen(page.getByText(`Шалгалтын өдөр ${stamp}`)), "хуанлид гарав");

console.log("7. Ил тод байдалд PDF");
await page.goto(base + "/admin/il-tod");
await page.fill("form input[name=title]", `Төсвийн гүйцэтгэл ${stamp}`);
await page.setInputFiles("input[name=file]", { name: "tosov.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%test\n") });
await page.getByRole("button", { name: "Нийтлэх" }).click();
await page.waitForURL(/ok=1/);
await page.goto(base + "/il-tod");
ok(await seen(page.getByText(`Төсвийн гүйцэтгэл ${stamp}`)), "ил тод хуудсанд гарав");

console.log("8. Шинэ сургууль + домэйн үүсгэх");
await page.goto(base + "/admin/surguuli");
await page.fill("input[name=name]", `Туршилтын ${stamp} сургууль`);
await page.fill("input[name=domain]", `test${stamp}.edu.mn`);
await page.getByRole("button", { name: "Сургууль үүсгэх" }).click();
await page.waitForURL(/created=/, { timeout: 30000 });
const cred = decodeURIComponent(new URL(page.url()).searchParams.get("created"));
ok(/^school\d+:\w+$/.test(cred), "админ эрх үүсэв " + cred);
await page.screenshot({ path: "shots/admin-created.png" });

console.log("9. Домэйноор сургуулийн хуудас нээгдэх");
const r = await fetch(base + "/", { headers: { "x-forwarded-host": `test${stamp}.edu.mn` } });
const html = await r.text();
ok(html.includes(`Туршилтын ${stamp} сургууль`), "домэйн → тухайн сургуулийн хуудас");

console.log("10. Шинэ сургуулийн админ — зөвхөн өөрийнхөө");
await page.context().clearCookies();
const [u, p] = cred.split(":");
await page.goto(base + "/admin/login");
await page.fill("input[name=username]", u);
await page.fill("input[name=password]", p);
await page.getByRole("button", { name: "Нэвтрэх" }).click();
await page.waitForURL(base + "/admin", { timeout: 30000 });
await page.goto(base + "/admin/medee");
ok(!(await page.getByText(title).isVisible().catch(() => false)), "бусад сургуулийн мэдээ харагдахгүй");
const r2 = await page.goto(base + "/admin/surguuli/1");
ok(r2.status() === 404, "өөр сургуулийг засах эрхгүй (404)");

await browser.close();
console.log(`\n${pass} OK, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
