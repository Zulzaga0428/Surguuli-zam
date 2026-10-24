import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/schema";
import { fileUrl, fmtDate, getSite, POST_CATEGORIES } from "@/lib/site";
import { listPosts } from "@/lib/queries";
import { Container, Paragraphs, PostRow } from "@/components/ui";

async function load(idStr: string) {
  const id = Number(idStr);
  if (!Number.isInteger(id)) return null;
  const site = await getSite();
  const [p] = await db.select().from(posts).where(and(eq(posts.id, id), eq(posts.orgId, site.org.id), eq(posts.published, true)));
  if (!p) return null;
  if (site.school && p.schoolId && p.schoolId !== site.school.id) return null;
  return { site, p };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const r = await load((await params).id);
  if (!r) return {};
  return { title: r.p.title, description: r.p.body.slice(0, 160), openGraph: { title: r.p.title, images: r.p.coverId ? [`/f/${r.p.coverId}`] : undefined } };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const r = await load((await params).id);
  if (!r) notFound();
  const { site, p } = r;
  const school = p.schoolId ? site.schools.find((s) => s.id === p.schoolId) : null;
  const more = (await listPosts(site, { limit: 5 })).filter((x) => x.id !== p.id).slice(0, 4);
  const cover = fileUrl(p.coverId);
  return (
    <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
      <article className="min-w-0">
        <Link href="/medee" className="text-sm font-bold text-brand-600">← Бүх мэдээ</Link>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-ink/55">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{POST_CATEGORIES[p.category] ?? "Мэдээ"}</span>
          <span>{fmtDate(p.publishedAt)}</span>
          <span>· {school ? school.name : site.org.name}</span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black leading-tight text-ink">{p.title}</h1>
        {cover && <img src={cover} alt="" className="mt-6 w-full rounded-3xl object-cover max-h-[520px]" />}
        <div className="mt-6 text-lg text-ink/85"><Paragraphs text={p.body} /></div>
      </article>
      <aside>
        <div className="mb-3 font-extrabold text-ink">Бусад мэдээ</div>
        <div className="space-y-3">{more.map((x) => <PostRow key={x.id} post={x} />)}</div>
      </aside>
    </Container>
  );
}
