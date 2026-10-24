import { getSite, color } from "@/lib/site";
import { listStaff } from "@/lib/queries";
import { Container, PageHero, SchoolFilter } from "@/components/ui";
import { Person } from "@/components/school-view";

export const metadata = { title: "Багш нар" };

export default async function Teachers({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const sp = await searchParams;
  const site = await getSite();
  const sel = site.school ? null : site.schools.find((x) => x.slug === sp.s) ?? null;
  const rows = await listStaff(site, sel?.id);
  const leaders = rows.filter((r) => r.s.group === "udirdlaga");
  const others = rows.filter((r) => r.s.group !== "udirdlaga");
  const multi = !site.school && !sel;
  return (
    <>
      <PageHero kicker="Бидний баг" title="Удирдлага, багш нар" sub="Хүүхэд бүрийн ирээдүйн төлөө ажилладаг хамт олон" />
      <Container className="space-y-10">
        {!site.school && <SchoolFilter schools={site.schools} current={sel?.slug} base="/bagsh" />}
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-ink">Удирдлага</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{leaders.map((r) => <Person key={r.s.id} p={r.s} bg={color(r.school).bg} school={multi ? r.school.shortName : undefined} />)}</div>
        </section>
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-ink">Багш нар</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{others.map((r) => <Person key={r.s.id} p={r.s} bg={color(r.school).bg} school={multi ? r.school.shortName : undefined} />)}</div>
        </section>
      </Container>
    </>
  );
}
