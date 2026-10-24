"use server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { getSite, MESSAGE_KINDS } from "@/lib/site";

export type ContactState = { ok?: boolean; error?: string };

const hits = new Map<string, number[]>();

export async function sendMessage(_prev: ContactState, fd: FormData): Promise<ContactState> {
  if (String(fd.get("website") ?? "")) return { ok: true }; // honeypot
  const site = await getSite();
  const body = String(fd.get("body") ?? "").trim();
  const name = String(fd.get("name") ?? "").trim().slice(0, 100);
  const contact = String(fd.get("contact") ?? "").trim().slice(0, 100);
  const kind = String(fd.get("kind") ?? "sanal");
  const schoolId = Number(fd.get("schoolId")) || null;
  if (body.length < 5) return { error: "Санал хүсэлтээ бичнэ үү." };
  if (body.length > 3000) return { error: "Хэт урт байна (3000 тэмдэгт хүртэл)." };
  if (schoolId && !site.schools.some((s) => s.id === schoolId)) return { error: "Сургууль олдсонгүй." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60000);
  if (recent.length >= 5) return { error: "Түр хүлээгээд дахин илгээнэ үү." };
  hits.set(ip, [...recent, now]);

  await db.insert(messages).values({
    orgId: site.org.id, schoolId, kind: kind in MESSAGE_KINDS ? kind : "sanal", name, contact, body,
  });
  return { ok: true };
}
