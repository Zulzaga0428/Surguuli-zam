import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import type { Site } from "@/lib/site";
import { schoolHref } from "@/lib/site";
import { LogoMark } from "./logo";

export function Footer({ site }: { site: Site }) {
  const { org, school, schools } = site;
  const c = school ?? org;
  return (
    <footer className="mt-16 bg-ink text-blue-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <LogoMark className="size-10" />
            <div className="text-lg font-extrabold text-white">{school ? school.name : org.name}</div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-blue-100/80">{school ? school.tagline : org.heroText}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {c.address && <li className="flex gap-2"><MapPin className="size-4 shrink-0 mt-0.5" />{c.address}</li>}
            {c.phone && <li className="flex gap-2"><Phone className="size-4 shrink-0 mt-0.5" /><a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a></li>}
            {c.email && <li className="flex gap-2"><Mail className="size-4 shrink-0 mt-0.5" /><a href={`mailto:${c.email}`}>{c.email}</a></li>}
          </ul>
        </div>
        <div>
          <div className="font-bold text-white">Сургуулиуд</div>
          <ul className="mt-3 space-y-2 text-sm">
            {schools.map((s) => <li key={s.id}><Link className="hover:text-white" href={schoolHref(site, s)}>{s.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <div className="font-bold text-white">Холбоос</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/il-tod">Ил тод байдал</Link></li>
            <li><Link className="hover:text-white" href="/elselt">Элсэлт</Link></li>
            <li><Link className="hover:text-white" href="/hicheeliin-jil">Хичээлийн хуанли</Link></li>
            <li><Link className="hover:text-white" href="/holboo">Санал хүсэлт</Link></li>
            <li><a className="hover:text-white" href={org.eduUrl}>Zulzaga EDU — нэвтрэх</a></li>
            <li><Link className="hover:text-white" href="/admin">Сургуулийн админ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 px-4 py-5 text-xs text-blue-100/60 sm:px-6">
          <span>© {new Date().getFullYear()} {org.name}</span>
          <span>Zulzaga EDU платформ дээр ажилладаг</span>
        </div>
      </div>
    </footer>
  );
}
