import "server-only";
import { and, asc, desc, eq, gte, isNull, or, type SQL } from "drizzle-orm";
import { db } from "./db";
import { documents, events, posts, staff, schools } from "./schema";
import type { Site } from "./site";

// Сургуулийн домэйн дээр: тухайн сургуулийнх + сумын нийтийнх. Сумын сайт дээр: бүгд.
function scope(site: Site, col: typeof posts.schoolId | typeof events.schoolId | typeof documents.schoolId, schoolId?: number | null): SQL | undefined {
  const sid = schoolId ?? site.school?.id;
  return sid ? or(eq(col, sid), isNull(col)) : undefined;
}

export async function listPosts(site: Site, opts: { limit?: number; schoolId?: number | null; category?: string } = {}) {
  return db.select().from(posts)
    .where(and(eq(posts.orgId, site.org.id), eq(posts.published, true), scope(site, posts.schoolId, opts.schoolId),
      opts.category ? eq(posts.category, opts.category) : undefined))
    .orderBy(desc(posts.publishedAt)).limit(opts.limit ?? 50);
}

export async function upcomingEvents(site: Site, opts: { limit?: number; schoolId?: number | null } = {}) {
  const today = new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
  return db.select().from(events)
    .where(and(eq(events.orgId, site.org.id), scope(site, events.schoolId, opts.schoolId),
      or(gte(events.startsOn, today), gte(events.endsOn, today))))
    .orderBy(asc(events.startsOn)).limit(opts.limit ?? 100);
}

export async function allEvents(site: Site, schoolId?: number | null) {
  return db.select().from(events)
    .where(and(eq(events.orgId, site.org.id), scope(site, events.schoolId, schoolId)))
    .orderBy(asc(events.startsOn));
}

export async function listDocs(site: Site, schoolId?: number | null) {
  return db.select().from(documents)
    .where(and(eq(documents.orgId, site.org.id), scope(site, documents.schoolId, schoolId)))
    .orderBy(desc(documents.publishedOn));
}

export async function listStaff(site: Site, schoolId?: number | null) {
  const sid = schoolId ?? site.school?.id;
  const rows = await db.select({ s: staff, school: schools }).from(staff)
    .innerJoin(schools, eq(schools.id, staff.schoolId))
    .where(and(eq(schools.orgId, site.org.id), sid ? eq(staff.schoolId, sid) : undefined))
    .orderBy(asc(schools.sort), asc(staff.sort), asc(staff.id));
  return rows;
}
