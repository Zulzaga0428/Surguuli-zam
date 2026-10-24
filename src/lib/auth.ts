import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "node:crypto";
export { hashPassword, checkPassword } from "./auth-hash";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { admins } from "./schema";

const COOKIE = "zs_admin";

// SESSION_SECRET тохируулаагүй бол процесс бүрт санамсаргүй түлхүүр — ажиллана, гэхдээ дахин асахад админууд дахин нэвтэрнэ.
const fallback = process.env.NODE_ENV === "production" ? randomBytes(32).toString("hex") : "dev-only-secret-change-me-please-32b";
if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") console.warn("[auth] SESSION_SECRET алга — түр түлхүүр ашиглаж байна");

function secret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET || fallback);
}

export async function startSession(adminId: number) {
  const token = await new SignJWT({ a: adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * 86400,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const id = Number(payload.a);
    const [a] = await db.select().from(admins).where(eq(admins.id, id));
    return a ?? null;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const a = await currentAdmin();
  if (!a) redirect("/admin/login");
  return a;
}

// Сургуулийн админ зөвхөн өөрийн сургуулийг, сумын админ (schoolId null) бүх сургуулийг удирдана.
export function canManageSchool(a: { schoolId: number | null }, schoolId: number | null) {
  return a.schoolId === null || a.schoolId === schoolId;
}
