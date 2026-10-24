import { getSite, DOC_CATEGORIES } from "@/lib/site";
import { listDocs } from "@/lib/queries";
import { Container, PageHero, SchoolFilter } from "@/components/ui";
import { DocList } from "@/components/school-view";

export const metadata = { title: "Ил тод байдал" };

export default async function Transparency({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const sp = await searchParams;
  const site = await getSite();
  const sel = site.school ? null : site.schools.find((x) => x.slug === sp.s) ?? null;
  const docs = await listDocs(site, sel?.id);
  const byId = new Map(site.schools.map((s) => [s.id, s.shortName]));
  const name = (id: number | null) => (id ? byId.get(id) ?? "" : "Сумын нэгдсэн");
  const cats = Object.keys(DOC_CATEGORIES).filter((k) => docs.some((d) => d.category === k));
  return (
    <>
      <PageHero kicker="Нээлттэй, хариуцлагатай" title="Ил тод байдал" sub="Төсөв, санхүү, худалдан авалт, тушаал шийдвэр, ажлын байрны мэдээлэл" />
      <Container className="space-y-8">
        {!site.school && <SchoolFilter schools={site.schools} current={sel?.slug} base="/il-tod" />}
        {cats.length === 0 && <div className="rounded-3xl bg-white p-10 text-center text-ink/55 ring-1 ring-blue-100">Баримт бичиг алга.</div>}
        {cats.map((k) => (
          <section key={k}>
            <h2 className="mb-3 text-lg font-extrabold text-ink">{DOC_CATEGORIES[k]}</h2>
            <DocList docs={docs.filter((d) => d.category === k)} schoolName={site.school ? undefined : name} />
          </section>
        ))}
      </Container>
    </>
  );
}
