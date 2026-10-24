import Link from "next/link";
import { ArrowRight, Users, UserRound } from "lucide-react";
import { getSite, color, schoolHref, schoolPhoto } from "@/lib/site";
import { Container, PageHero } from "@/components/ui";

export const metadata = { title: "Манай сургуулиуд" };

export default async function Schools() {
  const site = await getSite();
  return (
    <>
      <PageHero kicker="Хамтдаа урагшаа" title="Манай сургуулиуд" sub={`${site.org.name.replace(/ сум$/, "")}ийн ерөнхий боловсролын ${site.schools.length} сургууль`} />
      <Container className="grid gap-6 md:grid-cols-2">
        {site.schools.map((s) => {
          const c = color(s);
          const photo = schoolPhoto(s);
          return (
            <Link key={s.id} href={schoolHref(site, s)} className="group flex flex-col sm:flex-row overflow-hidden rounded-3xl bg-white ring-1 ring-blue-100 hover:shadow-xl hover:shadow-blue-900/10 transition">
              <div className="h-44 sm:h-auto sm:w-56 shrink-0 overflow-hidden">{photo ? <img src={photo} alt="" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" /> : <div className={`h-full ${c.soft}`} />}</div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-extrabold text-ink">{s.name}</h2>
                <p className={`mt-1 font-bold ${c.text}`}>{s.tagline}</p>
                <div className="mt-3 flex gap-4 text-sm font-semibold text-ink/65">
                  <span className="flex items-center gap-1.5"><Users className="size-4" />{s.students.toLocaleString("en-US")} сурагч</span>
                  <span className="flex items-center gap-1.5"><UserRound className="size-4" />{s.teachers} багш</span>
                </div>
                <div className="mt-2 text-sm text-ink/60">Захирал: {s.directorName}</div>
                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 font-bold text-brand-600 group-hover:gap-2.5 transition-all">Сургуулийн хуудас <ArrowRight className="size-4" /></span>
              </div>
            </Link>
          );
        })}
      </Container>
    </>
  );
}
