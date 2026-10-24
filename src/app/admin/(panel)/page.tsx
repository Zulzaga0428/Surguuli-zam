import Link from "next/link";
import { and, desc, eq, sql } from "drizzle-orm";
import { Newspaper, CalendarDays, FileText, MessageSquare, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { documents, events, messages, posts } from "@/lib/schema";
import { adminContext, adminScope } from "@/lib/admin-data";
import { fmtDate, MESSAGE_KINDS } from "@/lib/site";
import { Card, PageTitle } from "@/components/admin-kit";

export default async function Dashboard() {
  const { admin, org, schools, isSum, mySchools } = await adminContext();
  const count = async (t: typeof posts | typeof events | typeof documents) => {
    const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(t).where(and(eq(t.orgId, admin.orgId), adminScope(admin, t.schoolId)));
    return n;
  };
  const [np, ne, nd] = await Promise.all([count(posts), count(events), count(documents)]);
  const msgs = await db.select().from(messages).where(and(eq(messages.orgId, admin.orgId), adminScope(admin, messages.schoolId))).orderBy(desc(messages.createdAt)).limit(5);
  const byId = new Map(schools.map((s) => [s.id, s.shortName]));
  return (
    <>
      <PageTitle title={`Сайн байна уу, ${admin.name}`} sub={isSum ? `${org.name} — ${schools.length} сургууль` : mySchools[0]?.name}>
        <Link href="/admin/medee/new" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-bold text-white"><Plus className="size-4" /> Мэдээ нэмэх</Link>
      </PageTitle>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat href="/admin/medee" icon={<Newspaper />} n={np} label="Мэдээ" />
        <Stat href="/admin/huanli" icon={<CalendarDays />} n={ne} label="Үйл явдал" />
        <Stat href="/admin/il-tod" icon={<FileText />} n={nd} label="Баримт бичиг" />
        <Stat href="/admin/sanal" icon={<MessageSquare />} n={msgs.filter((m) => !m.read).length} label="Шинэ санал хүсэлт" />
      </div>
      <div className="mt-6">
        <Card title="Сүүлийн санал хүсэлт" actions={<Link href="/admin/sanal" className="text-sm font-bold text-brand-600">Бүгд →</Link>}>
          {msgs.length === 0 ? <p className="text-sm text-ink/55">Одоогоор санал хүсэлт ирээгүй байна.</p> : (
            <ul className="divide-y divide-slate-100">
              {msgs.map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-ink/55">
                    {!m.read && <span className="size-2 rounded-full bg-rose-500" />}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5">{MESSAGE_KINDS[m.kind] ?? m.kind}</span>
                    <span>{m.schoolId ? byId.get(m.schoolId) : "Сумын"}</span>
                    <span>· {fmtDate(m.createdAt)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/85">{m.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function Stat({ href, icon, n, label }: { href: string; icon: React.ReactNode; n: number; label: string }) {
  return (
    <Link href={href} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 hover:ring-brand-500/40">
      <span className="text-brand-600 [&>svg]:size-6">{icon}</span>
      <div className="mt-2 text-3xl font-black text-ink">{n}</div>
      <div className="text-sm font-semibold text-ink/55">{label}</div>
    </Link>
  );
}
