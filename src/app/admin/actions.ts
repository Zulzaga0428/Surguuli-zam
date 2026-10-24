"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { admins, documents, domains, events, files, messages, orgs, posts, schools, staff } from "@/lib/schema";
import { canManageSchool, checkPassword, endSession, hashPassword, requireAdmin, startSession } from "@/lib/auth";
import { DOC_CATEGORIES, POST_CATEGORIES } from "@/lib/site";

const str = (fd: FormData, k: string, max = 5000) => String(fd.get(k) ?? "").trim().slice(0, max);
const num = (fd: FormData, k: string) => {
  const n = Number(fd.get(k));
  return Number.isFinite(n) && fd.get(k) !== "" && fd.get(k) !== null ? n : null;
};

const IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DOCS = [...IMAGE, "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

async function saveFile(orgId: number, f: FormDataEntryValue | null, allowed: string[]) {
  if (!(f instanceof File) || f.size === 0) return null;
  if (f.size > 8 * 1024 * 1024) throw new Error("Файл 8MB-аас их байна");
  if (!allowed.includes(f.type)) throw new Error("Энэ төрлийн файл оруулах боломжгүй");
  const data = new Uint8Array(await f.arrayBuffer());
  const [row] = await db.insert(files).values({ orgId, name: f.name.slice(0, 200), mime: f.type, size: f.size, data }).returning({ id: files.id });
  return row.id;
}

// Сумын админ сургууль сонгоно (хоосон = сумын нийтийнх), сургуулийн админ зөвхөн өөрийнхөө.
function pickSchool(a: { schoolId: number | null }, fd: FormData) {
  if (a.schoolId !== null) return a.schoolId;
  return num(fd, "schoolId");
}

async function assertSchoolInOrg(orgId: number, schoolId: number | null) {
  if (schoolId === null) return;
  const [s] = await db.select({ id: schools.id }).from(schools).where(and(eq(schools.id, schoolId), eq(schools.orgId, orgId)));
  if (!s) throw new Error("Сургууль олдсонгүй");
}

function refresh() {
  revalidatePath("/", "layout");
}

// ---------- нэвтрэх ----------
export type LoginState = { error?: string; username?: string };
export async function login(_p: LoginState, fd: FormData): Promise<LoginState> {
  const username = str(fd, "username", 60).toLowerCase();
  const password = String(fd.get("password") ?? "");
  const [a] = await db.select().from(admins).where(eq(admins.username, username));
  if (!a || !checkPassword(password, a.passwordHash)) return { error: "Нэвтрэх нэр эсвэл нууц үг буруу байна", username };
  await startSession(a.id);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ---------- мэдээ ----------
export async function savePost(fd: FormData) {
  const a = await requireAdmin();
  const id = num(fd, "id");
  const title = str(fd, "title", 200);
  const body = str(fd, "body", 20000);
  const category = str(fd, "category");
  if (!title) throw new Error("Гарчиг хоосон байна");
  const schoolId = pickSchool(a, fd);
  await assertSchoolInOrg(a.orgId, schoolId);
  const coverId = await saveFile(a.orgId, fd.get("cover"), IMAGE);
  const values = {
    title, body, schoolId,
    category: category in POST_CATEGORIES ? category : "medee",
    published: fd.get("published") === "on",
    ...(coverId ? { coverId } : {}),
    ...(fd.get("removeCover") === "on" && !coverId ? { coverId: null } : {}),
  };
  if (id) {
    const [p] = await db.select().from(posts).where(and(eq(posts.id, id), eq(posts.orgId, a.orgId)));
    if (!p || !canManageSchool(a, p.schoolId)) throw new Error("Эрх хүрэхгүй");
    await db.update(posts).set(values).where(eq(posts.id, id));
  } else {
    await db.insert(posts).values({ orgId: a.orgId, ...values });
  }
  refresh();
  redirect("/admin/medee?ok=1");
}

export async function deletePost(fd: FormData) {
  const a = await requireAdmin();
  const id = num(fd, "id");
  if (!id) return;
  const [p] = await db.select().from(posts).where(and(eq(posts.id, id), eq(posts.orgId, a.orgId)));
  if (!p || !canManageSchool(a, p.schoolId)) throw new Error("Эрх хүрэхгүй");
  await db.delete(posts).where(eq(posts.id, id));
  refresh();
  redirect("/admin/medee");
}

// ---------- хуанли ----------
export async function addEvent(fd: FormData) {
  const a = await requireAdmin();
  const title = str(fd, "title", 200);
  const startsOn = str(fd, "startsOn", 10);
  const endsOn = str(fd, "endsOn", 10) || null;
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(startsOn)) throw new Error("Гарчиг, огноо заавал");
  const schoolId = pickSchool(a, fd);
  await assertSchoolInOrg(a.orgId, schoolId);
  const kind = ["event", "holiday", "term"].includes(str(fd, "kind")) ? str(fd, "kind") : "event";
  await db.insert(events).values({ orgId: a.orgId, schoolId, title, startsOn, endsOn, place: str(fd, "place", 200), description: str(fd, "description", 1000), kind });
  refresh();
  redirect("/admin/huanli?ok=1");
}

export async function deleteEvent(fd: FormData) {
  const a = await requireAdmin();
  const id = num(fd, "id");
  if (!id) return;
  const [e] = await db.select().from(events).where(and(eq(events.id, id), eq(events.orgId, a.orgId)));
  if (!e || !canManageSchool(a, e.schoolId)) throw new Error("Эрх хүрэхгүй");
  await db.delete(events).where(eq(events.id, id));
  refresh();
  redirect("/admin/huanli");
}

// ---------- ил тод байдал ----------
export async function addDocument(fd: FormData) {
  const a = await requireAdmin();
  const title = str(fd, "title", 300);
  const category = str(fd, "category");
  if (!title || !(category in DOC_CATEGORIES)) throw new Error("Гарчиг, ангилал заавал");
  const schoolId = pickSchool(a, fd);
  await assertSchoolInOrg(a.orgId, schoolId);
  const fileId = await saveFile(a.orgId, fd.get("file"), DOCS);
  const publishedOn = str(fd, "publishedOn", 10) || new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
  await db.insert(documents).values({ orgId: a.orgId, schoolId, category, title, fileId, publishedOn });
  refresh();
  redirect("/admin/il-tod?ok=1");
}

export async function deleteDocument(fd: FormData) {
  const a = await requireAdmin();
  const id = num(fd, "id");
  if (!id) return;
  const [d] = await db.select().from(documents).where(and(eq(documents.id, id), eq(documents.orgId, a.orgId)));
  if (!d || !canManageSchool(a, d.schoolId)) throw new Error("Эрх хүрэхгүй");
  await db.delete(documents).where(eq(documents.id, id));
  refresh();
  redirect("/admin/il-tod");
}

// ---------- багш, ажилтан ----------
export async function addStaff(fd: FormData) {
  const a = await requireAdmin();
  const schoolId = pickSchool(a, fd);
  if (!schoolId) throw new Error("Сургууль сонгоно уу");
  await assertSchoolInOrg(a.orgId, schoolId);
  const name = str(fd, "name", 100);
  const position = str(fd, "position", 100);
  if (!name || !position) throw new Error("Нэр, албан тушаал заавал");
  const photoId = await saveFile(a.orgId, fd.get("photo"), IMAGE);
  const group = str(fd, "group") === "udirdlaga" ? "udirdlaga" : "bagsh";
  const [{ m }] = await db.select({ m: sql<number>`coalesce(max(${staff.sort}), 0)::int` }).from(staff).where(eq(staff.schoolId, schoolId));
  await db.insert(staff).values({ schoolId, name, position, group, subject: str(fd, "subject", 100), photoId, sort: m + 1 });
  refresh();
  redirect("/admin/bagsh?ok=1");
}

export async function deleteStaff(fd: FormData) {
  const a = await requireAdmin();
  const id = num(fd, "id");
  if (!id) return;
  const [r] = await db.select({ s: staff, orgId: schools.orgId }).from(staff).innerJoin(schools, eq(schools.id, staff.schoolId)).where(eq(staff.id, id));
  if (!r || r.orgId !== a.orgId || !canManageSchool(a, r.s.schoolId)) throw new Error("Эрх хүрэхгүй");
  await db.delete(staff).where(eq(staff.id, id));
  refresh();
  redirect("/admin/bagsh");
}

// ---------- санал хүсэлт ----------
export async function markRead(fd: FormData) {
  const a = await requireAdmin();
  const id = num(fd, "id");
  if (!id) return;
  const [m] = await db.select().from(messages).where(and(eq(messages.id, id), eq(messages.orgId, a.orgId)));
  if (!m || !canManageSchool(a, m.schoolId)) throw new Error("Эрх хүрэхгүй");
  await db.update(messages).set({ read: !m.read }).where(eq(messages.id, id));
  revalidatePath("/admin", "layout");
  redirect("/admin/sanal");
}

// ---------- сургуулийн мэдээлэл ----------
export async function saveSchool(fd: FormData) {
  const a = await requireAdmin();
  const id = num(fd, "id");
  if (!id || !canManageSchool(a, id)) throw new Error("Эрх хүрэхгүй");
  await assertSchoolInOrg(a.orgId, id);
  const photoId = await saveFile(a.orgId, fd.get("photo"), IMAGE);
  const directorPhotoId = await saveFile(a.orgId, fd.get("directorPhoto"), IMAGE);
  const clubs = str(fd, "clubs", 2000).split(/[\n,]/).map((x) => x.trim()).filter(Boolean).slice(0, 30);
  await db.update(schools).set({
    name: str(fd, "name", 200), shortName: str(fd, "shortName", 60), tagline: str(fd, "tagline", 200),
    about: str(fd, "about", 10000), directorName: str(fd, "directorName", 100), directorMessage: str(fd, "directorMessage", 3000),
    founded: num(fd, "founded"), students: num(fd, "students") ?? 0, teachers: num(fd, "teachers") ?? 0, classes: num(fd, "classes") ?? 0,
    address: str(fd, "address", 300), phone: str(fd, "phone", 60), email: str(fd, "email", 120), facebook: str(fd, "facebook", 300),
    admission: str(fd, "admission", 5000), clubs,
    color: ["blue", "green", "purple", "orange", "red", "teal"].includes(str(fd, "color")) ? str(fd, "color") : "blue",
    ...(photoId ? { photoId } : {}), ...(directorPhotoId ? { directorPhotoId } : {}),
  }).where(eq(schools.id, id));
  refresh();
  redirect(`/admin/surguuli/${id}?ok=1`);
}

export async function createSchool(fd: FormData) {
  const a = await requireAdmin();
  if (a.schoolId !== null) throw new Error("Зөвхөн сумын админ");
  const name = str(fd, "name", 200);
  if (!name) throw new Error("Нэр заавал");
  const [{ m }] = await db.select({ m: sql<number>`coalesce(max(${schools.number}), 0)::int` }).from(schools).where(eq(schools.orgId, a.orgId));
  const number = num(fd, "number") ?? m + 1;
  let slug = String(number);
  const taken = await db.select({ slug: schools.slug }).from(schools).where(eq(schools.orgId, a.orgId));
  while (taken.some((t) => t.slug === slug)) slug += "-1";
  const shortName = str(fd, "shortName", 60) || `${number}-р сургууль`;
  const [s] = await db.insert(schools).values({
    orgId: a.orgId, slug, number, name, shortName, color: ["blue", "green", "purple", "orange", "red", "teal"][(number - 1) % 6],
    tagline: "", about: "Сургуулийн танилцуулгыг админ хэсгээс засна уу.",
    directorMessage: "Эрхэм эцэг эх, сурагчид аа! Манай сургуулийн цахим хуудсанд тавтай морил.",
    sort: number,
  }).returning();
  const username = `school${s.id}`;
  const password = Math.random().toString(36).slice(2, 10);
  await db.insert(admins).values({ orgId: a.orgId, schoolId: s.id, username, name: `${shortName} админ`, passwordHash: hashPassword(password) });
  const host = str(fd, "domain", 200).toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
  if (host) await db.insert(domains).values({ host, orgId: a.orgId, schoolId: s.id }).onConflictDoNothing();
  refresh();
  redirect(`/admin/surguuli/${s.id}?created=${encodeURIComponent(`${username}:${password}`)}`);
}

// ---------- сум (нүүр хуудас) ----------
export async function saveOrg(fd: FormData) {
  const a = await requireAdmin();
  if (a.schoolId !== null) throw new Error("Зөвхөн сумын админ");
  const heroImageId = await saveFile(a.orgId, fd.get("heroImage"), IMAGE);
  await db.update(orgs).set({
    name: str(fd, "name", 120), heroKicker: str(fd, "heroKicker", 120), heroTitle: str(fd, "heroTitle", 120),
    heroText: str(fd, "heroText", 400), about: str(fd, "about", 5000), address: str(fd, "address", 300),
    phone: str(fd, "phone", 60), email: str(fd, "email", 120), facebook: str(fd, "facebook", 300), eduUrl: str(fd, "eduUrl", 300) || "https://edu.zulzaga.app",
    ...(heroImageId ? { heroImageId } : {}),
  }).where(eq(orgs.id, a.orgId));
  refresh();
  redirect("/admin/sum?ok=1");
}

// ---------- домэйн ----------
export async function addDomain(fd: FormData) {
  const a = await requireAdmin();
  const host = str(fd, "host", 200).toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) throw new Error("Домэйн буруу байна");
  const schoolId = a.schoolId ?? num(fd, "schoolId");
  await assertSchoolInOrg(a.orgId, schoolId);
  const [ex] = await db.select().from(domains).where(eq(domains.host, host));
  if (ex) throw new Error("Энэ домэйн аль хэдийн бүртгэлтэй");
  await db.insert(domains).values({ host, orgId: a.orgId, schoolId });
  revalidatePath("/admin/domain");
  redirect("/admin/domain?ok=1");
}

export async function deleteDomain(fd: FormData) {
  const a = await requireAdmin();
  const host = str(fd, "host", 200);
  const [d] = await db.select().from(domains).where(and(eq(domains.host, host), eq(domains.orgId, a.orgId)));
  if (!d || !canManageSchool(a, d.schoolId)) throw new Error("Эрх хүрэхгүй");
  await db.delete(domains).where(eq(domains.host, host));
  revalidatePath("/admin/domain");
  redirect("/admin/domain");
}

// ---------- нууц үг ----------
export async function changePassword(fd: FormData) {
  const a = await requireAdmin();
  const cur = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (!checkPassword(cur, a.passwordHash)) redirect("/admin/nuuts?err=1");
  if (next.length < 8) redirect("/admin/nuuts?err=2");
  await db.update(admins).set({ passwordHash: hashPassword(next) }).where(eq(admins.id, a.id));
  redirect("/admin/nuuts?ok=1");
}
