import Link from "next/link";
import { Search } from "lucide-react";
import { and, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts, events, documents } from "@/lib/schema";
import { fmtDate, getSite, schoolHref } from "@/lib/site";
import { Container, PageHero, PostRow } from "@/components/ui";

export const metadata = { title: "Хайлт" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 80);
  const site = await getSite();
  const like = `%${q.replace(/[%_\\]/g, (m) => "\\" + m)}%`;
  const ok = q.length >= 2;
  const [ps, es, ds] = ok ? await Promise.all([
    db.select().from(posts).where(and(eq(posts.orgId, site.org.id), eq(posts.published, true), or(ilike(posts.title, like), ilike(posts.body, like)))).limit(20),
    db.select().from(events).where(and(eq(events.orgId, site.org.id), ilike(events.title, like))).limit(20),
    db.select().from(documents).where(and(eq(documents.orgId, site.org.id), ilike(documents.title, like))).limit(20),
  ]) : [[], [], []];
  const schools = ok ? site.schools.filter((s) => `${s.name} ${s.tagline} ${s.directorName}`.toLowerCase().includes(q.toLowerCase())) : [];
  const total = ps.length + es.length + ds.length + schools.length;
  return (
    <>
      <PageHero title="Хайлт" />
      <Container className="space-y-6">
        <form className="flex gap-2">
          <input name="q" defaultValue={q} autoFocus placeholder="Мэдээ, үйл явдал, баримт бичиг хайх…" className="min-w-0 flex-1 rounded-full border border-blue-100 bg-white px-5 py-3 outline-none focus:border-brand-500" />
          <button className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 font-bold text-white"><Search className="size-4" /> Хайх</button>
        </form>
        {ok && <div className="text-sm font-semibold text-ink/60">«{q}» — {total} үр дүн</div>}
        {schools.map((s) => <Link key={s.id} href={schoolHref(site, s)} className="block rounded-2xl bg-white p-4 font-bold ring-1 ring-blue-100">{s.name}</Link>)}
        <div className="grid gap-3 md:grid-cols-2">{ps.map((p) => <PostRow key={p.id} post={p} />)}</div>
        {es.map((e) => <Link key={e.id} href="/hicheeliin-jil" className="block rounded-2xl bg-white p-4 ring-1 ring-blue-100"><b>{e.title}</b> <span className="text-sm text-ink/55">· {fmtDate(e.startsOn)}</span></Link>)}
        {ds.map((d) => <Link key={d.id} href="/il-tod" className="block rounded-2xl bg-white p-4 ring-1 ring-blue-100"><b>{d.title}</b> <span className="text-sm text-ink/55">· {fmtDate(d.publishedOn)}</span></Link>)}
      </Container>
    </>
  );
}
