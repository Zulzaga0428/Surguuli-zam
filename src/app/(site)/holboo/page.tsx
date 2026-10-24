import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { getSite } from "@/lib/site";
import { Container, PageHero } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";

export const metadata = { title: "Холбоо барих" };

export default async function Contact() {
  const site = await getSite();
  const c = site.school ?? site.org;
  return (
    <>
      <PageHero kicker="Бид сонсоход бэлэн" title="Холбоо барих" sub="Санал, асуулт, гомдол, талархлаа илгээнэ үү. Сургуулийн удирдлага шууд хүлээн авна." />
      <Container className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <ContactForm schools={site.schools.map((s) => ({ id: s.id, name: s.name }))} schoolId={site.school?.id} />
        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-blue-100">
            <div className="text-lg font-extrabold text-ink">{site.school ? site.school.name : site.org.name}</div>
            <ul className="mt-4 space-y-3 text-ink/85">
              {c.address && <li className="flex gap-3"><MapPin className="size-5 shrink-0 text-brand-600" />{c.address}</li>}
              {c.phone && <li className="flex gap-3"><Phone className="size-5 shrink-0 text-brand-600" /><a className="font-bold" href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a></li>}
              {c.email && <li className="flex gap-3"><Mail className="size-5 shrink-0 text-brand-600" /><a href={`mailto:${c.email}`}>{c.email}</a></li>}
              {c.facebook && <li className="flex gap-3"><Globe className="size-5 shrink-0 text-brand-600" /><a href={c.facebook} target="_blank" rel="noreferrer">Facebook хуудас</a></li>}
            </ul>
          </div>
          {!site.school && site.schools.map((s) => (
            <div key={s.id} className="rounded-2xl bg-white p-4 text-sm ring-1 ring-blue-100">
              <div className="font-extrabold text-ink">{s.name}</div>
              <div className="mt-1 text-ink/70">{s.phone} · {s.email}</div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
