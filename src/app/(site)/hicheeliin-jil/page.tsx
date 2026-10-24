import { CalendarDays, Palmtree, Flag } from "lucide-react";
import { fmtDate, getSite, MONTHS } from "@/lib/site";
import { allEvents } from "@/lib/queries";
import { Container, PageHero, SchoolFilter } from "@/components/ui";

export const metadata = { title: "Хичээлийн жил" };

export default async function Calendar({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const sp = await searchParams;
  const site = await getSite();
  const sel = site.school ? null : site.schools.find((x) => x.slug === sp.s) ?? null;
  const events = await allEvents(site, sel?.id);
  const byId = new Map(site.schools.map((s) => [s.id, s]));
  const today = new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
  const groups = new Map<string, typeof events>();
  for (const e of events) {
    const k = e.startsOn.slice(0, 7);
    groups.set(k, [...(groups.get(k) ?? []), e]);
  }
  return (
    <>
      <PageHero kicker="Төлөвлөгөө" title="Хичээлийн жил" sub="Улирал, амралт, сургуулиудын арга хэмжээний хуанли" />
      <Container>
        {!site.school && <SchoolFilter schools={site.schools} current={sel?.slug} base="/hicheeliin-jil" />}
        <div className="mb-6 flex flex-wrap gap-4 text-sm font-semibold text-ink/70">
          <span className="flex items-center gap-1.5"><Flag className="size-4 text-brand-600" /> Хичээлийн жил</span>
          <span className="flex items-center gap-1.5"><Palmtree className="size-4 text-emerald-600" /> Амралт</span>
          <span className="flex items-center gap-1.5"><CalendarDays className="size-4 text-orange-500" /> Арга хэмжээ</span>
        </div>
        <div className="space-y-8">
          {[...groups.entries()].map(([k, list]) => {
            const [y, m] = k.split("-").map(Number);
            return (
              <section key={k}>
                <h2 className="mb-3 text-lg font-extrabold text-ink">{y} оны {MONTHS[m - 1]}</h2>
                <div className="divide-y divide-blue-50 overflow-hidden rounded-3xl bg-white ring-1 ring-blue-100">
                  {list.map((e) => {
                    const past = (e.endsOn ?? e.startsOn) < today;
                    const Icon = e.kind === "holiday" ? Palmtree : e.kind === "term" ? Flag : CalendarDays;
                    const tone = e.kind === "holiday" ? "text-emerald-600 bg-emerald-50" : e.kind === "term" ? "text-brand-600 bg-brand-50" : "text-orange-500 bg-orange-50";
                    return (
                      <div key={e.id} className={`flex items-start gap-4 px-5 py-4 ${past ? "opacity-50" : ""}`}>
                        <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="size-5" /></span>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-ink">{e.title}</div>
                          <div className="text-sm font-semibold text-ink/55">
                            {fmtDate(e.startsOn)}{e.endsOn ? ` – ${fmtDate(e.endsOn)}` : ""} · {e.schoolId ? byId.get(e.schoolId)?.shortName : "Бүх сургууль"}{e.place ? ` · ${e.place}` : ""}
                          </div>
                          {e.description && <p className="mt-1 text-sm text-ink/70">{e.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </>
  );
}
