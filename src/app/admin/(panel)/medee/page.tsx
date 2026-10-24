import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { Plus, Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { adminContext, adminScope } from "@/lib/admin-data";
import { fmtDate, POST_CATEGORIES } from "@/lib/site";
import { Flash, PageTitle } from "@/components/admin-kit";
import { PostThumb } from "@/components/ui";

export default async function AdminPosts({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const { admin, schools } = await adminContext();
  const rows = await db.select().from(posts).where(and(eq(posts.orgId, admin.orgId), adminScope(admin, posts.schoolId))).orderBy(desc(posts.publishedAt));
  const byId = new Map(schools.map((s) => [s.id, s.shortName]));
  return (
    <>
      <PageTitle title="Мэдээ" sub="Сайтын нүүр болон мэдээний хэсэгт гарна">
        <Link href="/admin/medee/new" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-bold text-white"><Plus className="size-4" /> Шинэ мэдээ</Link>
      </PageTitle>
      <Flash ok={ok}>Хадгалагдлаа — сайт дээр шууд харагдана</Flash>
      <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
        {rows.map((p) => (
          <Link key={p.id} href={`/admin/medee/${p.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50">
            <PostThumb post={p} className="h-12 w-16 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold text-ink">{p.title}</div>
              <div className="text-xs font-semibold text-ink/50">
                {POST_CATEGORIES[p.category]} · {fmtDate(p.publishedAt)} · {p.schoolId ? byId.get(p.schoolId) : "Сумын нийтийн"}
                {!p.published && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">Ноорог</span>}
              </div>
            </div>
            <Pencil className="size-4 text-ink/40" />
          </Link>
        ))}
        {rows.length === 0 && <div className="p-8 text-center text-ink/55">Мэдээ алга.</div>}
      </div>
    </>
  );
}
