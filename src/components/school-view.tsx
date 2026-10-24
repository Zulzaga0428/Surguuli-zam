import Link from "next/link";
import {
  Users, UserRound, LayoutGrid, CalendarDays, Quote, Newspaper, Sparkles, FileText, Phone, Mail, MapPin, ClipboardList, ArrowRight, Download,
} from "lucide-react";
import type { Site } from "@/lib/site";
import { color, DOC_CATEGORIES, fileUrl, fmtDate, schoolPhoto } from "@/lib/site";
import type { Doc, Event, Post, School, Staff } from "@/lib/schema";
import { Container, Paragraphs, PostCard, SectionTitle } from "./ui";
import { EventChip } from "./hub";
import { ContactForm } from "./contact-form";

export function SchoolView({ site, school: s, posts, events, staff, docs }: {
  site: Site; school: School; posts: Post[]; events: Event[]; staff: Staff[]; docs: Doc[];
}) {
  const c = color(s);
  const photo = schoolPhoto(s);
  const leaders = staff.filter((x) => x.group === "udirdlaga");
  const teachers = staff.filter((x) => x.group !== "udirdlaga");
  const onSchoolDomain = site.school?.id === s.id;
  const tabs = [["tuhai", "Танилцуулга"], ["medee", "Мэдээ"], ["huanli", "Хуанли"], ["bagsh", "Багш нар"], ["elselt", "Элсэлт"], ["il-tod", "Ил тод"], ["holboo", "Холбоо барих"]];

  return (
    <>
      <section className="relative">
        <div className="relative h-56 sm:h-72 overflow-hidden">
          {photo ? <img src={photo} alt={s.name} className="h-full w-full object-cover" /> : <div className={`h-full ${c.bg}`} />}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
          <Container className="absolute inset-x-0 bottom-0 pb-6 text-white">
            {!onSchoolDomain && <Link href="/surguuli" className="text-sm font-bold text-white/80 hover:text-white">← Бүх сургууль</Link>}
            <h1 className="mt-1 text-3xl sm:text-5xl font-black">{s.name}</h1>
            {s.tagline && <p className="mt-1 font-hand text-2xl text-blue-100">{s.tagline}</p>}
          </Container>
        </div>
        <nav className="sticky top-[72px] z-30 border-b border-blue-100 bg-white/95 backdrop-blur">
          <Container className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
            {tabs.map(([id, l]) => <a key={id} href={`#${id}`} className="shrink-0 rounded-full px-4 py-2 text-sm font-bold text-ink/75 hover:bg-brand-50 hover:text-brand-600">{l}</a>)}
          </Container>
        </nav>
      </section>

      <Container className="space-y-14 pt-8">
        <section id="tuhai" className="scroll-mt-36 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Fact icon={<Users />} value={s.students.toLocaleString("en-US")} label="Сурагч" c={c.text} />
              <Fact icon={<UserRound />} value={String(s.teachers)} label="Багш" c={c.text} />
              <Fact icon={<LayoutGrid />} value={String(s.classes)} label="Бүлэг анги" c={c.text} />
              <Fact icon={<CalendarDays />} value={s.founded ? String(s.founded) : "—"} label="Байгуулагдсан" c={c.text} />
            </div>
            <div className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-blue-100">
              <h2 className="mb-4 text-2xl font-extrabold text-ink">Бидний тухай</h2>
              <div className="text-ink/80"><Paragraphs text={s.about} /></div>
              {s.clubs.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2 font-extrabold text-ink"><Sparkles className={`size-5 ${c.text}`} /> Дугуйлан, секц</div>
                  <div className="flex flex-wrap gap-2">{s.clubs.map((x) => <span key={x} className={`rounded-full ${c.soft} ${c.text} px-3.5 py-1.5 text-sm font-bold`}>{x}</span>)}</div>
                </div>
              )}
            </div>
          </div>
          <div className={`rounded-3xl ${c.soft} p-6 ring-1 ${c.ring} h-fit`}>
            <Quote className={`size-8 ${c.text}`} />
            <p className="mt-3 text-ink/85 leading-relaxed">{s.directorMessage}</p>
            <div className="mt-5 flex items-center gap-3">
              {fileUrl(s.directorPhotoId)
                ? <img src={fileUrl(s.directorPhotoId)!} alt="" className="size-14 rounded-full object-cover ring-4 ring-white" />
                : <span className={`grid size-14 place-items-center rounded-full ${c.bg} text-lg font-black text-white ring-4 ring-white`}>{initials(s.directorName)}</span>}
              <div><div className="font-extrabold text-ink">{s.directorName}</div><div className="text-sm font-semibold text-ink/60">Захирал</div></div>
            </div>
          </div>
        </section>

        <section id="medee" className="scroll-mt-36">
          <SectionTitle icon={<Newspaper className="size-7" />} title="Мэдээ мэдээлэл" href={onSchoolDomain ? "/medee" : `/medee?s=${s.slug}`} linkLabel="Бүх мэдээ" />
          {posts.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{posts.slice(0, 3).map((p) => <PostCard key={p.id} post={p} />)}</div> : <Empty>Мэдээ одоогоор алга.</Empty>}
        </section>

        <section id="huanli" className="scroll-mt-36">
          <SectionTitle icon={<CalendarDays className="size-7" />} title="Удахгүй болох үйл явдал" href={onSchoolDomain ? "/hicheeliin-jil" : `/hicheeliin-jil?s=${s.slug}`} linkLabel="Хуанли" />
          {events.length ? <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{events.slice(0, 4).map((e) => <EventChip key={e.id} e={e} schoolName={e.schoolId ? s.shortName : undefined} />)}</div> : <Empty>Төлөвлөсөн үйл явдал алга.</Empty>}
        </section>

        <section id="bagsh" className="scroll-mt-36">
          <SectionTitle icon={<Users className="size-7" />} title="Удирдлага, багш нар" href={onSchoolDomain ? "/bagsh" : `/bagsh?s=${s.slug}`} linkLabel="Бүгд" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...leaders, ...teachers].slice(0, 8).map((p) => <Person key={p.id} p={p} bg={c.bg} />)}
          </div>
        </section>

        <section id="elselt" className="scroll-mt-36 rounded-3xl bg-gradient-to-br from-brand-600 to-blue-800 p-6 sm:p-10 text-white">
          <div className="flex items-center gap-3"><ClipboardList className="size-8" /><h2 className="text-2xl font-extrabold">Элсэлт</h2></div>
          <div className="mt-4 max-w-3xl text-blue-50"><Paragraphs text={s.admission || "Элсэлтийн мэдээлэл удахгүй нэмэгдэнэ."} /></div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://esis.edu.mn" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-brand-700">ESIS элсэлтийн бүртгэл <ArrowRight className="size-4" /></a>
            <a href="#holboo" className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 font-bold ring-1 ring-white/30">Асуулт асуух</a>
          </div>
        </section>

        <section id="il-tod" className="scroll-mt-36">
          <SectionTitle icon={<FileText className="size-7" />} title="Ил тод байдал" sub="Төсөв, худалдан авалт, тушаал шийдвэр, ажлын байр" href="/il-tod" linkLabel="Бүгд" />
          {docs.length ? <DocList docs={docs} /> : <Empty>Баримт бичиг одоогоор алга.</Empty>}
        </section>

        <section id="holboo" className="scroll-mt-36 grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-blue-100 h-fit">
            <h2 className="text-2xl font-extrabold text-ink">Холбоо барих</h2>
            <ul className="mt-5 space-y-4 text-ink/85">
              {s.address && <li className="flex gap-3"><MapPin className={`size-5 shrink-0 ${c.text}`} />{s.address}</li>}
              {s.phone && <li className="flex gap-3"><Phone className={`size-5 shrink-0 ${c.text}`} /><a href={`tel:${s.phone.replace(/\s/g, "")}`} className="font-bold">{s.phone}</a></li>}
              {s.email && <li className="flex gap-3"><Mail className={`size-5 shrink-0 ${c.text}`} /><a href={`mailto:${s.email}`}>{s.email}</a></li>}
            </ul>
            <a href={site.org.eduUrl} className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3.5 font-bold text-white">Zulzaga EDU-д нэвтрэх <ArrowRight className="size-4" /></a>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-extrabold text-ink">Санал хүсэлт илгээх</h3>
            <ContactForm schools={[]} schoolId={s.id} />
          </div>
        </section>
      </Container>
    </>
  );
}

export function initials(name: string) {
  const parts = name.replace(/\./g, " ").split(/\s+/).filter(Boolean);
  return (parts[parts.length - 1]?.[0] ?? "?").toUpperCase();
}

export function Person({ p, bg, school }: { p: Staff; bg: string; school?: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-blue-100">
      {fileUrl(p.photoId)
        ? <img src={fileUrl(p.photoId)!} alt="" className="size-14 shrink-0 rounded-full object-cover" />
        : <span className={`grid size-14 shrink-0 place-items-center rounded-full ${bg} text-lg font-black text-white`}>{initials(p.name)}</span>}
      <div className="min-w-0">
        <div className="truncate font-extrabold text-ink">{p.name}</div>
        <div className="text-sm font-semibold text-ink/60">{p.position}{p.subject ? ` · ${p.subject}` : ""}</div>
        {school && <div className="text-xs font-semibold text-brand-600">{school}</div>}
      </div>
    </div>
  );
}

export function DocList({ docs, schoolName }: { docs: Doc[]; schoolName?: (id: number | null) => string }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-blue-100 divide-y divide-blue-50">
      {docs.map((d) => {
        const url = fileUrl(d.fileId);
        return (
          <div key={d.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
            <FileText className="size-6 shrink-0 text-brand-600" />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-ink">{d.title}</div>
              <div className="text-xs font-semibold text-ink/55">{DOC_CATEGORIES[d.category] ?? d.category} · {fmtDate(d.publishedOn)}{schoolName ? ` · ${schoolName(d.schoolId)}` : ""}</div>
            </div>
            {url ? <a href={url} target="_blank" className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700"><Download className="size-4" /> Татах</a>
              : <span className="text-xs font-semibold text-ink/40">Файл хавсаргаагүй</span>}
          </div>
        );
      })}
    </div>
  );
}

function Fact({ icon, value, label, c }: { icon: React.ReactNode; value: string; label: string; c: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-blue-100">
      <span className={`${c} [&>svg]:size-6`}>{icon}</span>
      <div className="mt-2 text-2xl font-black text-ink">{value}</div>
      <div className="text-xs font-semibold text-ink/60">{label}</div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-white p-8 text-center text-ink/55 ring-1 ring-blue-100">{children}</div>;
}
