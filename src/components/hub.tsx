import Link from "next/link";
import {
  ArrowRight, BookOpen, GraduationCap, BookMarked, Users, School as SchoolIcon, UserRound, Trophy, Link2,
  CalendarDays, Newspaper, Phone, MapPin, FileText, ChevronRight, Heart, ClipboardList, UsersRound,
} from "lucide-react";
import type { Site } from "@/lib/site";
import { color, fileUrl, fmtDate, schoolHref, schoolPhoto } from "@/lib/site";
import type { Event, Post } from "@/lib/schema";
import { Container, PostRow, SectionTitle } from "./ui";

const CARD_ICONS = [BookOpen, GraduationCap, BookMarked, Users];
const CARD_TINT = ["from-blue-50", "from-emerald-50", "from-violet-50", "from-orange-50"];

export function roundStat(n: number) {
  if (n >= 1000) return `${(Math.floor(n / 100) * 100).toLocaleString("en-US")}+`;
  if (n >= 100) return `${Math.floor(n / 50) * 50}+`;
  return String(n);
}

export function Hub({ site, posts, events }: { site: Site; posts: Post[]; events: Event[] }) {
  const { org, schools } = site;
  const teachers = schools.reduce((a, s) => a + s.teachers, 0);
  const students = schools.reduce((a, s) => a + s.students, 0);
  const [w1, ...rest] = org.heroTitle.split(" ");
  const heroImg = fileUrl(org.heroImageId) ?? "/img/hero.webp";
  const byId = new Map(schools.map((s) => [s.id, s]));

  return (
    <>
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-x-0 top-0 h-72 w-full object-cover object-[75%_center] md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[70%] md:object-right md:[mask-image:linear-gradient(to_right,transparent,black_30%)]" />
        <div className="absolute inset-0 hero-fade" />
        <Container className="relative pt-[300px] pb-14 md:py-20 lg:py-24">
          <div className="max-w-[640px]">
            <div className="flex items-center gap-2 font-hand text-[28px] text-brand-600">{org.heroKicker} <Heart className="size-5" /></div>
            <h1 className="mt-1 text-[40px] sm:text-6xl font-black leading-[1.05] text-ink tracking-tight">
              {w1}<br /><span className="text-brand-600">{rest.join(" ")}</span>
            </h1>
            <p className="mt-5 max-w-md text-lg font-semibold text-ink/80">{org.heroText}</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Stat icon={<UsersRound />} value={String(schools.length)} label="Сургууль" />
              <Stat icon={<UserRound />} value={roundStat(teachers)} label="Багш" />
              <Stat icon={<Users />} value={roundStat(students)} label="Сурагч" />
              <div className="flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-3 shadow-lg shadow-blue-900/5 ring-1 ring-blue-100">
                <Trophy className="size-6 text-brand-600" />
                <span className="text-sm font-bold leading-tight text-ink">Сайн сайхныг<br />хамтдаа</span>
              </div>
            </div>
            <a href="#surguuliud" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-600/25 hover:bg-brand-700">
              Сургуулиудын мэдээллийг үзэх <ArrowRight className="size-5" />
            </a>
          </div>
        </Container>
      </section>

      <Container className="grid gap-8 lg:grid-cols-[1fr_300px] pt-4">
        <div className="min-w-0">
          <section id="surguuliud" className="scroll-mt-24">
            <SectionTitle icon={<SchoolIcon className="size-9" />} title="Манай сургуулиуд" sub={`${org.name.replace(/ сум$/, "")}ийн ${schools.length} сургуулийн нэгдсэн цахим хуудас`} href="/surguuli" linkLabel="Бүх сургууль" />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {schools.map((s, i) => {
                const Icon = CARD_ICONS[i % 4];
                const c = color(s);
                const photo = schoolPhoto(s);
                return (
                  <Link key={s.id} href={schoolHref(site, s)} className={`group overflow-hidden rounded-3xl bg-gradient-to-b ${CARD_TINT[i % 4]} to-white ring-1 ${c.ring} hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-0.5 transition`}>
                    <div className="relative h-32 overflow-hidden">
                      {photo ? <img src={photo} alt={s.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" /> : <div className={`h-full ${c.soft}`} />}
                      <span className="absolute left-3 top-3 grid size-7 place-items-center rounded-full bg-white/90 text-xs font-black text-ink">{s.number}</span>
                    </div>
                    <div className="relative px-5 pb-5">
                      <span className={`-mt-6 relative grid size-12 place-items-center rounded-full ${c.bg} text-white ring-4 ring-white shadow-md`}><Icon className="size-6" /></span>
                      <h3 className="mt-3 text-xl font-extrabold text-ink"><span className={c.text}>{s.number}-р</span> сургууль</h3>
                      <p className="mt-1.5 text-sm text-ink/65 line-clamp-2">{s.tagline || "Сургуулийн танилцуулга, удирдлага, мэдээ мэдээлэл, холбоо барих"}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-600 shadow-sm ring-1 ring-blue-100 group-hover:gap-2.5 transition-all">Дэлгэрэнгүй <ArrowRight className="size-4" /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-12">
            <SectionTitle icon={<Newspaper className="size-7" />} title="Сүүлд нэмэгдсэн мэдээ" href="/medee" linkLabel="Бүх мэдээ" />
            <div className="grid gap-4 md:grid-cols-2">
              {posts.slice(0, 4).map((p) => <PostRow key={p.id} post={p} school={p.schoolId ? byId.get(p.schoolId) : null} />)}
            </div>
          </section>

          {events.length > 0 && (
            <section className="mt-12">
              <SectionTitle icon={<CalendarDays className="size-7" />} title="Удахгүй болох үйл явдал" href="/hicheeliin-jil" linkLabel="Хуанли" />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {events.slice(0, 4).map((e) => <EventChip key={e.id} e={e} schoolName={e.schoolId ? byId.get(e.schoolId)?.shortName : undefined} />)}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5 lg:pt-1">
          <div className="rounded-3xl bg-gradient-to-b from-blue-50 to-white p-5 ring-1 ring-blue-100">
            <div className="mb-4 flex items-center gap-2 text-lg font-extrabold text-ink"><Link2 className="size-6 text-brand-600" /> Шуурхай холбоос</div>
            <div className="space-y-2.5">
              <Quick href="/hicheeliin-jil" icon={<CalendarDays />} label="Хичээлийн хуваарь" />
              <Quick href="/medee" icon={<Newspaper />} label="Мэдээ мэдээлэл" />
              <Quick href={org.eduUrl} icon={<Users />} label="Эцэг эхийн булан" external />
              <Quick href={org.eduUrl} icon={<UserRound />} label="Сурагчийн булан" external />
              <Quick href="/elselt" icon={<ClipboardList />} label="Элсэлт" />
              <Quick href="/il-tod" icon={<FileText />} label="Ил тод байдал" />
              <Quick href="/holboo" icon={<Phone />} label="Холбоо барих" />
            </div>
            <div className="mt-4 text-center font-hand text-2xl text-brand-600/80">Хамтдаа урагшаа ♡</div>
          </div>
          <div className="relative overflow-hidden rounded-3xl text-white shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-brand-600 to-sky-400" />
            <MapPin className="absolute -right-4 -bottom-6 size-36 text-white/10" />
            <div className="relative p-5">
              <div className="flex items-center gap-1.5 font-extrabold"><MapPin className="size-4" /> {org.name.replace(/ сум$/, "")}</div>
              <div className="mt-1 font-bold">Боловсролын хот</div>
              <div className="font-hand text-xl">— Илүү сайхан ирээдүй!</div>
            </div>
          </div>
          {posts.some((p) => p.category === "zarlal") && (
            <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200">
              <div className="text-xs font-black uppercase tracking-wide text-amber-700">Зарлал</div>
              {posts.filter((p) => p.category === "zarlal").slice(0, 2).map((p) => (
                <Link key={p.id} href={`/medee/${p.id}`} className="mt-2 block font-bold text-ink hover:text-brand-600">{p.title}<span className="block text-xs font-semibold text-ink/50">{fmtDate(p.publishedAt)}</span></Link>
              ))}
            </div>
          )}
        </aside>
      </Container>
    </>
  );
}

export function EventChip({ e, schoolName }: { e: Event; schoolName?: string }) {
  const d = new Date(e.startsOn + "T00:00:00");
  return (
    <div className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-blue-100">
      <div className="grid h-16 w-14 shrink-0 place-items-center rounded-xl bg-brand-50 text-center">
        <div><div className="text-2xl font-black leading-none text-brand-600">{d.getDate()}</div><div className="text-[11px] font-bold text-ink/60">{d.getMonth() + 1}-р сар</div></div>
      </div>
      <div className="min-w-0">
        <div className="font-bold text-ink line-clamp-2">{e.title}</div>
        <div className="mt-1 text-xs font-semibold text-ink/55">{schoolName ?? "Бүх сургууль"}{e.place ? ` · ${e.place}` : ""}</div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-3 shadow-lg shadow-blue-900/5 ring-1 ring-blue-100">
      <span className="text-brand-600 [&>svg]:size-7">{icon}</span>
      <span className="leading-tight"><span className="block text-xl font-black text-ink">{value}</span><span className="text-xs font-semibold text-ink/60">{label}</span></span>
    </div>
  );
}

function Quick({ href, icon, label, external }: { href: string; icon: React.ReactNode; label: string; external?: boolean }) {
  const cls = "flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-bold text-ink shadow-sm ring-1 ring-blue-100 hover:ring-brand-500/50 hover:text-brand-600 transition";
  const inner = <><span className="text-brand-600 [&>svg]:size-5">{icon}</span><span className="flex-1">{label}</span><ChevronRight className="size-4 text-ink/40" /></>;
  return external ? <a href={href} className={cls}>{inner}</a> : <Link href={href} className={cls}>{inner}</Link>;
}
