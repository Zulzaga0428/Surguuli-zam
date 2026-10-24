import "server-only";
import { and, asc, eq, sql, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import { db } from "./db";
import { messages, orgs, schools } from "./schema";
import { requireAdmin } from "./auth";

export async function adminContext() {
  const admin = await requireAdmin();
  const [org] = await db.select().from(orgs).where(eq(orgs.id, admin.orgId));
  const list = await db.select().from(schools).where(eq(schools.orgId, admin.orgId)).orderBy(asc(schools.sort), asc(schools.number));
  const mine = admin.schoolId ? list.filter((s) => s.id === admin.schoolId) : list;
  return { admin, org, schools: list, mySchools: mine, isSum: admin.schoolId === null };
}

// Сургуулийн админ зөвхөн өөрийн сургуулийн мөрүүдийг харна.
export function adminScope(admin: { schoolId: number | null }, col: PgColumn): SQL | undefined {
  return admin.schoolId === null ? undefined : eq(col, admin.schoolId);
}

export async function unreadCount(orgId: number, schoolId: number | null) {
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(messages)
    .where(and(eq(messages.orgId, orgId), eq(messages.read, false), schoolId === null ? undefined : eq(messages.schoolId, schoolId)));
  return n;
}
