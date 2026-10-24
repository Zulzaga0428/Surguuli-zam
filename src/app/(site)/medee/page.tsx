import { getSite, POST_CATEGORIES } from "@/lib/site";
import { listPosts } from "@/lib/queries";
import { Container, PageHero, PostCard, SchoolFilter } from "@/components/ui";

export const metadata = { title: "Мэдээ мэдээлэл" };

export default async function News({ searchParams }: { searchParams: Promise<{ s?: string; c?: string }> }) {
  const sp = await searchParams;
  const site = await getSite();
  const sel = site.school ? null : site.schools.find((x) => x.slug === sp.s) ?? null;
  const category = sp.c && sp.c in POST_CATEGORIES ? sp.c : undefined;
  const posts = await listPosts(site, { schoolId: sel?.id, category, limit: 60 });
  const byId = new Map(site.schools.map((s) => [s.id, s]));
  return (
    <>
      <PageHero kicker="Сонин сайхан" title="Мэдээ мэдээлэл" sub="Сургуулиудын мэдээ, амжилт, зарлал" />
      <Container>
        {!site.school && <SchoolFilter schools={site.schools} current={sel?.slug} base="/medee" />}
        {posts.length === 0 ? <div className="rounded-3xl bg-white p-10 text-center text-ink/55 ring-1 ring-blue-100">Мэдээ алга.</div> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} school={site.school ? null : p.schoolId ? byId.get(p.schoolId) : null} />)}
          </div>
        )}
      </Container>
    </>
  );
}
