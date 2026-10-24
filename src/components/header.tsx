import Link from "next/link";
import { Search, UserRound } from "lucide-react";
import type { Site } from "@/lib/site";
import { LogoMark } from "./logo";
import { NavLinks, MobileMenu, type NavItem } from "./nav-links";

export function Header({ site }: { site: Site }) {
  const { org, school } = site;
  const items: NavItem[] = [
    { href: "/", label: "Нүүр" },
    { href: school ? "/bidnii-tuhai" : "/surguuli", label: school ? "Бидний тухай" : "Манай сургууль" },
    { href: "/medee", label: "Мэдээ мэдээлэл" },
    { href: "/hicheeliin-jil", label: "Хичээлийн жил" },
    { href: "/bagsh", label: "Багш нар" },
    { href: "/holboo", label: "Холбоо барих" },
  ];
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-blue-100/70">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <LogoMark />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[17px] font-extrabold text-ink">{school ? school.shortName : org.name}</span>
            <span className="block truncate text-[13px] font-semibold text-ink/70">{school ? org.name : "Ерөнхий боловсролын сургууль"}</span>
          </span>
        </Link>
        <div className="flex-1 flex justify-center"><NavLinks items={items} /></div>
        <Link href="/hailt" aria-label="Хайх" className="hidden sm:grid place-items-center size-10 rounded-xl text-brand-600 hover:bg-brand-50"><Search className="size-5" /></Link>
        <a href={org.eduUrl} className="hidden md:inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-brand-700">
          <UserRound className="size-4" /> Сурагч / Эцэг эхийн булан
        </a>
        <MobileMenu items={items} eduUrl={org.eduUrl} />
      </div>
    </header>
  );
}
