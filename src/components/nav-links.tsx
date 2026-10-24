"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string };

export function NavLinks({ items }: { items: NavItem[] }) {
  const path = usePathname();
  return (
    <nav className="hidden xl:flex items-center gap-0.5">
      {items.map((it) => {
        const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href}
            className={`relative whitespace-nowrap px-3 py-2 text-[15px] font-semibold transition-colors ${active ? "text-brand-600" : "text-ink/80 hover:text-brand-600"}`}>
            {it.label}
            {active && <span className="absolute left-3 right-3 -bottom-1 h-[3px] rounded-full bg-brand-600" />}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileMenu({ items, eduUrl }: { items: NavItem[]; eduUrl: string }) {
  const path = usePathname();
  return (
    <details className="xl:hidden group relative" key={path}>
      <summary className="list-none cursor-pointer grid place-items-center size-10 rounded-xl bg-brand-50 text-brand-700" aria-label="Цэс">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </summary>
      <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="block rounded-xl px-4 py-3 font-semibold text-ink hover:bg-brand-50">{it.label}</Link>
        ))}
        <Link href="/il-tod" className="block rounded-xl px-4 py-3 font-semibold text-ink hover:bg-brand-50">Ил тод байдал</Link>
        <a href={eduUrl} className="mt-1 block rounded-xl bg-brand-600 px-4 py-3 text-center font-bold text-white">Сурагч / Эцэг эхийн булан</a>
      </div>
    </details>
  );
}
