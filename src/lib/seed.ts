import { sql } from "drizzle-orm";
import { db } from "./db";
import { admins, documents, domains, events, orgs, posts, schools, staff } from "./schema";
import { hashPassword } from "./auth-hash";
import { rawExec } from "./db";
import { SCHEMA_SQL } from "./sql";

// Демо өгөгдөл. Нэр, тоо бүгд ЗОХИОМОЛ — сургууль админаасаа өөрийнхөөрөө солино.
export async function seedDemo() {
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(orgs);
  if (n > 0) return false;

  const [org] = await db.insert(orgs).values({
    slug: "zamyn-uud",
    name: "Замын-Үүд сум",
    heroKicker: "Боловсролтой ирээдүй",
    heroTitle: "Замын-Үүдийн сургуулиуд",
    heroText: "Бид мэдлэг, хүмүүжил, бүтээлч ирээдүйг хамтдаа бий болгоно.",
    about: "Замын-Үүд сумын ерөнхий боловсролын 4 сургуулийн нэгдсэн цахим хуудас. Сургууль бүр өөрийн мэдээ, хуанли, багш нар, ил тод байдлын мэдээллээ энд өөрсдөө шинэчилнэ.",
    address: "Дорноговь аймаг, Замын-Үүд сум",
    phone: "+976 7270 5789",
    email: "info@zulzaga.app",
    facebook: "https://facebook.com/ZulzagaEDU",
  }).returning();

  const colors = ["blue", "green", "purple", "orange"];
  const taglines = [
    "Мэдлэгээр тэргүүлэгч сургууль",
    "Спорт, эрүүл мэндийн сургууль",
    "Урлаг, бүтээлч сэтгэлгээ",
    "Хамтдаа өсөх гэр бүл",
  ];
  const stats = [[1250, 86, 38], [1100, 78, 34], [1020, 74, 32], [980, 70, 30]];
  const directors = ["Б. Энхтуяа", "Д. Ганбаатар", "Ц. Оюунчимэг", "Г. Батсүх"];
  const clubs = [
    ["Математикийн олимпиад", "Робот техник", "Англи хэлний клуб", "Шатар"],
    ["Сагсан бөмбөг", "Волейбол", "Үндэсний бөх", "Хөнгөн атлетик"],
    ["Морин хуур", "Бүжиг", "Дуу хоолой", "Зураг, дизайн"],
    ["Ном уншлагын клуб", "Эко клуб", "Мэтгэлцээн", "Програмчлал"],
  ];

  const ids: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [s] = await db.insert(schools).values({
      orgId: org.id,
      slug: String(i + 1),
      number: i + 1,
      name: `Замын-Үүд сумын ${i + 1}-р сургууль`,
      shortName: `${i + 1}-р сургууль`,
      tagline: taglines[i],
      about: `Манай сургууль ${1960 + i * 12} онд байгуулагдсан бөгөөд 1–12-р ангийн ${stats[i][0].toLocaleString("en-US")} сурагчид ерөнхий боловсрол олгож байна.\n\nБид сурагч бүрийн авьяас, сонирхлыг дэмжиж, эцэг эхтэйгээ нээлттэй хамтран ажилладаг. Сургуулийн бүх анги Zulzaga EDU системээр даалгавар, ирц, дүнгээ эцэг эхтэйгээ шууд хуваалцдаг.`,
      directorName: directors[i],
      directorMessage: "Эрхэм эцэг эх, сурагчид аа! Манай сургуулийн цахим хуудсанд тавтай морил. Хүүхэд бүр аюулгүй орчинд сурч, өөрийн авьяасаа нээх боломжийг бид хамтдаа бүрдүүлнэ.",
      photoPath: `/img/school-${i + 1}.webp`,
      color: colors[i],
      founded: 1960 + i * 12,
      students: stats[i][0],
      teachers: stats[i][1],
      classes: stats[i][2],
      address: `Замын-Үүд сум, ${i + 1}-р баг`,
      phone: `+976 7270 ${5790 + i}`,
      email: `school${i + 1}@zulzaga.app`,
      admission: "1-р ангийн элсэлт жил бүрийн 5-р сард ESIS системээр цахимаар явагдана.\n\nШилжин ирэх сурагч: өргөдөл, сурлагын дүнгийн тодорхойлолт, хувийн хэрэг.\n\nДэлгэрэнгүйг сургуулийн нийгмийн ажилтнаас лавлана уу.",
      clubs: clubs[i],
      sort: i,
    }).returning();
    ids.push(s.id);

    await db.insert(staff).values([
      { schoolId: s.id, name: directors[i], position: "Захирал", group: "udirdlaga", sort: 0 },
      { schoolId: s.id, name: ["С. Нарантуяа", "Э. Мөнхзул", "О. Туяа", "Л. Сарангэрэл"][i], position: "Сургалтын менежер", group: "udirdlaga", sort: 1 },
      { schoolId: s.id, name: ["Ж. Алтанцэцэг", "П. Болормаа", "Н. Энхбаяр", "Х. Солонго"][i], position: "Нийгмийн ажилтан", group: "udirdlaga", sort: 2 },
      { schoolId: s.id, name: ["Т. Ариунаа", "Б. Уранчимэг", "М. Цэцэгмаа", "Д. Номин"][i], position: "Бага ангийн багш", subject: "1–5-р анги", sort: 3 },
      { schoolId: s.id, name: ["Г. Билгүүн", "А. Тэмүүлэн", "С. Хонгор", "Р. Баярмаа"][i], position: "Багш", subject: "Математик", sort: 4 },
      { schoolId: s.id, name: ["Ц. Отгонбаяр", "Ш. Ундрах", "Б. Мишээл", "Ё. Анужин"][i], position: "Багш", subject: "Монгол хэл, уран зохиол", sort: 5 },
      { schoolId: s.id, name: ["Ч. Ганчимэг", "З. Батжаргал", "Ү. Солонго", "Э. Тэргэл"][i], position: "Багш", subject: "Англи хэл", sort: 6 },
      { schoolId: s.id, name: ["Д. Төгөлдөр", "Н. Эрдэнэ", "О. Бат-Эрдэнэ", "Г. Сүхбат"][i], position: "Багш", subject: "Биеийн тамир", sort: 7 },
    ]);
  }

  await db.insert(domains).values([
    { host: "localhost", orgId: org.id },
    { host: "127.0.0.1", orgId: org.id },
  ]).onConflictDoNothing();

  const now = Date.now();
  const day = 86400000;
  await db.insert(posts).values([
    { orgId: org.id, schoolId: null, title: "Хичээлийн шинэ жилийн баярын мэнд хүргэе!", category: "medee", publishedAt: new Date("2026-09-01T09:00:00+08:00"),
      body: "Замын-Үүд сумын 4 сургуулийн нийт сурагч, багш, эцэг эхчүүдэд 2026–2027 оны хичээлийн шинэ жилийн мэнд хүргэе!\n\nЭнэ жил сумын бүх сургууль Zulzaga EDU системд нэгдэж, эцэг эхчүүд хүүхдийнхээ даалгавар, ирц, дүнг утсаараа шууд харах боломжтой боллоо." },
    { orgId: org.id, schoolId: ids[1], title: "Сургуулийн спортын долоо хоног эхэллээ", category: "medee", publishedAt: new Date(now - 6 * day),
      body: "2-р сургуулийн уламжлалт спортын долоо хоног эхэллээ. Сагсан бөмбөг, волейбол, хөнгөн атлетикийн төрлөөр ангиуд хоорондоо өрсөлдөнө.\n\nЭцэг эхчүүдийг хүүхдүүдээ дэмжин ирэхийг урьж байна." },
    { orgId: org.id, schoolId: ids[0], title: "Эцэг эхийн уулзалт амжилттай зохион байгуулагдлаа", category: "medee", publishedAt: new Date(now - 11 * day),
      body: "1-р сургуулийн бүх ангийн эцэг эхийн уулзалт амжилттай болж өндөрлөлөө. Уулзалтаар хичээлийн жилийн төлөвлөгөө, сурагчдын аюулгүй байдал, цахим системийн ашиглалтын талаар ярилцлаа." },
    { orgId: org.id, schoolId: ids[2], title: "Аймгийн математикийн олимпиадад 3 медаль хүртлээ", category: "amjilt", publishedAt: new Date(now - 15 * day),
      body: "3-р сургуулийн сурагчид Дорноговь аймгийн математикийн олимпиадаас 1 алт, 2 мөнгөн медаль хүртлээ. Сурагчид болон багш нартаа баяр хүргэе!" },
    { orgId: org.id, schoolId: null, title: "Өвлийн амралтын хуваарь", category: "zarlal", publishedAt: new Date(now - 2 * day),
      body: "Ерөнхий боловсролын сургуулийн өвлийн амралт 12-р сарын 20-ноос 1-р сарын 5-ныг хүртэл үргэлжилнэ." },
  ]);

  const y = new Date().getFullYear();
  await db.insert(events).values([
    { orgId: org.id, title: "Хичээлийн шинэ жил эхэлнэ", startsOn: "2026-09-01", kind: "term" },
    { orgId: org.id, title: "1-р улирлын амралт", startsOn: "2026-11-02", endsOn: "2026-11-08", kind: "holiday" },
    { orgId: org.id, schoolId: ids[0], title: "Эцэг эхийн нээлттэй хаалганы өдөр", startsOn: `${y}-11-14`, place: "1-р сургуулийн их заал" },
    { orgId: org.id, schoolId: ids[1], title: "Сумын сагсан бөмбөгийн аварга шалгаруулах тэмцээн", startsOn: `${y}-11-21`, place: "Спорт заал" },
    { orgId: org.id, schoolId: ids[2], title: "Урлагийн их наадам", startsOn: `${y}-12-05`, place: "Соёлын төв" },
    { orgId: org.id, title: "Шинэ жилийн баяр", startsOn: `${y}-12-26`, kind: "event" },
    { orgId: org.id, title: "Өвлийн амралт", startsOn: "2026-12-20", endsOn: "2027-01-05", kind: "holiday" },
    { orgId: org.id, title: "2-р улирал эхэлнэ", startsOn: "2027-01-06", kind: "term" },
    { orgId: org.id, title: "Хаврын амралт", startsOn: "2027-03-21", endsOn: "2027-03-29", kind: "holiday" },
    { orgId: org.id, title: "Элсэлтийн бүртгэл (1-р анги)", startsOn: "2027-05-01", endsOn: "2027-05-31", kind: "term" },
    { orgId: org.id, title: "Хичээлийн жил дуусна", startsOn: "2027-06-01", kind: "term" },
  ]);

  await db.insert(documents).values([
    { orgId: org.id, category: "tosov", title: "2026 оны батлагдсан төсөв", publishedOn: "2026-01-20" },
    { orgId: org.id, category: "tailan", title: "2025–2026 оны хичээлийн жилийн үйл ажиллагааны тайлан", publishedOn: "2026-06-25" },
    { orgId: org.id, schoolId: ids[0], category: "juram", title: "Сургуулийн дотоод журам", publishedOn: "2026-09-01" },
    { orgId: org.id, schoolId: ids[0], category: "ajliin_bair", title: "Англи хэлний багшийн сул орон тоо", publishedOn: "2026-10-10" },
    { orgId: org.id, schoolId: ids[1], category: "hudaldan", title: "Спорт заалны засварын худалдан авалтын зар", publishedOn: "2026-08-12" },
  ]);

  await db.insert(admins).values([
    { orgId: org.id, schoolId: null, username: "sum", name: "Сумын боловсролын мэргэжилтэн", passwordHash: hashPassword(process.env.DEMO_PASSWORD ?? "demo2026") },
    ...ids.map((id, i) => ({ orgId: org.id, schoolId: id, username: `school${i + 1}`, name: `${i + 1}-р сургуулийн админ`, passwordHash: hashPassword(process.env.DEMO_PASSWORD ?? "demo2026") })),
  ]);
  return true;
}

export async function resetOnce(token: string) {
  await rawExec("CREATE TABLE IF NOT EXISTS meta (key text PRIMARY KEY, value text NOT NULL)");
  const r = await db.execute(sql`SELECT value FROM meta WHERE key = 'reset'`);
  const rows = (r as unknown as { rows: { value: string }[] }).rows;
  if (rows[0]?.value === token) return false;
  await rawExec("DROP TABLE IF EXISTS orgs, schools, domains, posts, events, staff, documents, messages, files, admins CASCADE");
  await rawExec(SCHEMA_SQL);
  await db.execute(sql`INSERT INTO meta (key, value) VALUES ('reset', ${token}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`);
  return true;
}
