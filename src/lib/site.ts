import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { and, asc, eq } from "drizzle-orm";
import { db } from "./db";
import { domains, orgs, schools, type Org, type School } from "./schema";

export type Site = { org: Org; school: School | null; schools: School[] };

// Орж ирсэн домэйноор аль сум / сургууль болохыг танина.
// 1) domains хүснэгт, 2) <org-slug>.<ROOT_DOMAIN>, 3) DEFAULT_ORG (демо / railway домэйн).
export const getSite = cache(async (): Promise<Site> => {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0].trim().toLowerCase().replace(/:\d+$/, "").replace(/^www\./, "");

  let org: Org | undefined;
  let school: School | null = null;

  const [d] = host ? await db.select().from(domains).where(eq(domains.host, host)) : [];
  if (d) {
    [org] = await db.select().from(orgs).where(eq(orgs.id, d.orgId));
    if (d.schoolId) [school] = await db.select().from(schools).where(eq(schools.id, d.schoolId));
  }
  const root = process.env.ROOT_DOMAIN;
  if (!org && root && host.endsWith("." + root)) {
    const slug = host.slice(0, -(root.length + 1));
    [org] = await db.select().from(orgs).where(eq(orgs.slug, slug));
  }
  if (!org) {
    const slug = process.env.DEFAULT_ORG ?? "zamyn-uud";
    [org] = await db.select().from(orgs).where(eq(orgs.slug, slug));
    org ??= (await db.select().from(orgs).orderBy(asc(orgs.id)).limit(1))[0];
  }
  if (!org) throw new Error("Сайт тохируулагдаагүй байна (orgs хоосон)");

  const list = await db.select().from(schools).where(eq(schools.orgId, org.id)).orderBy(asc(schools.sort), asc(schools.number));
  return { org, school: school ?? null, schools: list };
});

export async function findSchool(orgId: number, slug: string) {
  const [s] = await db.select().from(schools).where(and(eq(schools.orgId, orgId), eq(schools.slug, slug)));
  return s ?? null;
}

// Домэйн тодорхой сургуульд холбогдсон бол тухайн сургуулийн хуудсууд "/" дээр байна.
export function schoolHref(site: Site, s: School, sub = "") {
  if (site.school?.id === s.id) return sub ? `/${sub}` : "/";
  return `/surguuli/${s.slug}${sub ? "/" + sub : ""}`;
}

export function fileUrl(id: number | null | undefined) {
  return id ? `/f/${id}` : null;
}

export function schoolPhoto(s: School) {
  return fileUrl(s.photoId) ?? s.photoPath ?? null;
}

export const COLORS: Record<string, { bg: string; soft: string; text: string; ring: string }> = {
  blue: { bg: "bg-blue-600", soft: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-100" },
  green: { bg: "bg-emerald-600", soft: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-100" },
  purple: { bg: "bg-violet-600", soft: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-100" },
  orange: { bg: "bg-orange-500", soft: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-100" },
  red: { bg: "bg-rose-600", soft: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-100" },
  teal: { bg: "bg-teal-600", soft: "bg-teal-50", text: "text-teal-700", ring: "ring-teal-100" },
};

export function color(s: School) {
  return COLORS[s.color] ?? COLORS.blue;
}

export const DOC_CATEGORIES: Record<string, string> = {
  tosov: "Төсөв, санхүү",
  hudaldan: "Худалдан авалт",
  tushaal: "Тушаал, шийдвэр",
  juram: "Дүрэм, журам",
  tailan: "Үйл ажиллагааны тайлан",
  ajliin_bair: "Ажлын байрны зар",
  busad: "Бусад",
};

export const POST_CATEGORIES: Record<string, string> = {
  medee: "Мэдээ",
  amjilt: "Амжилт",
  zarlal: "Зарлал",
};

export const MESSAGE_KINDS: Record<string, string> = {
  sanal: "Санал",
  asuult: "Асуулт",
  gomdol: "Гомдол",
  talarhal: "Талархал",
};

export function fmtDate(d: Date | string) {
  const x = typeof d === "string" ? new Date(d + (d.length === 10 ? "T00:00:00" : "")) : d;
  return `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, "0")}.${String(x.getDate()).padStart(2, "0")}`;
}

export const MONTHS = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];
