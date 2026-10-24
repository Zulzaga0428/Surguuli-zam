import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { messages } from "@/lib/schema";
import { adminContext, adminScope } from "@/lib/admin-data";
import { MESSAGE_KINDS } from "@/lib/site";
import { PageTitle } from "@/components/admin-kit";
import { markRead } from "../../actions";

const TONE: Record<string, string> = { gomdol: "bg-rose-100 text-rose-700", asuult: "bg-sky-100 text-sky-700", talarhal: "bg-emerald-100 text-emerald-700", sanal: "bg-amber-100 text-amber-700" };

export default async function AdminMessages() {
  const { admin, schools } = await adminContext();
  const rows = await db.select().from(messages).where(and(eq(messages.orgId, admin.orgId), adminScope(admin, messages.schoolId))).orderBy(desc(messages.createdAt));
  const byId = new Map(schools.map((s) => [s.id, s.shortName]));
  return (
    <>
      <PageTitle title="Санал хүсэлт" sub="Сайтын «Холбоо барих» маягтаар ирсэн. Нэр, утас бичээгүй бол нэргүй." />
      <div className="space-y-3">
        {rows.length === 0 && <div className="rounded-2xl bg-white p-8 text-center text-ink/55 ring-1 ring-slate-200">Санал хүсэлт ирээгүй байна.</div>}
        {rows.map((m) => (
          <div key={m.id} className={`rounded-2xl bg-white p-5 ring-1 ${m.read ? "ring-slate-200" : "ring-brand-500/50 shadow-sm"}`}>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              {!m.read && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-white">Шинэ</span>}
              <span className={`rounded-full px-2 py-0.5 ${TONE[m.kind] ?? "bg-slate-100"}`}>{MESSAGE_KINDS[m.kind] ?? m.kind}</span>
              <span className="text-ink/55">{m.schoolId ? byId.get(m.schoolId) : "Сумын / ерөнхий"}</span>
              <span className="text-ink/40">· {new Date(m.createdAt).toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" })}</span>
            </div>
            <p className="mt-2 whitespace-pre-line text-ink/90">{m.body}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-semibold text-ink/60">{m.name || m.contact ? `${m.name}${m.contact ? ` · ${m.contact}` : ""}` : "Нэргүй"}</span>
              <form action={markRead}><input type="hidden" name="id" value={m.id} /><button className="rounded-lg px-3 py-1.5 font-bold text-brand-600 hover:bg-brand-50">{m.read ? "Уншаагүй болгох" : "Уншсан ✓"}</button></form>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
