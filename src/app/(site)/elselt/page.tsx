import { ArrowRight, ClipboardList } from "lucide-react";
import { getSite, color } from "@/lib/site";
import { Container, PageHero, Paragraphs } from "@/components/ui";

export const metadata = { title: "Элсэлт" };

export default async function Admission() {
  const site = await getSite();
  const list = site.school ? [site.school] : site.schools;
  return (
    <>
      <PageHero kicker="Тавтай морил" title="Элсэлт" sub="1-р анги болон шилжин ирэх сурагчийн элсэлтийн мэдээлэл" />
      <Container className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-blue-800 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3"><ClipboardList className="size-7" /><div className="text-xl font-extrabold">1-р ангийн элсэлт ESIS системээр</div></div>
          <p className="mt-2 max-w-2xl text-blue-50">Ерөнхий боловсролын сургуулийн 1-р ангийн элсэлтийн бүртгэл Боловсролын салбарын мэдээллийн системээр цахимаар явагдана.</p>
          <a href="https://esis.edu.mn" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-brand-700">Бүртгэлд орох <ArrowRight className="size-4" /></a>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {list.map((s) => (
            <div key={s.id} className="rounded-3xl bg-white p-6 ring-1 ring-blue-100">
              <div className={`font-extrabold ${color(s).text}`}>{s.name}</div>
              <div className="mt-3 text-ink/80"><Paragraphs text={s.admission || "Мэдээлэл удахгүй нэмэгдэнэ."} /></div>
              <div className="mt-4 text-sm font-semibold text-ink/60">Лавлах: {s.phone}</div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
