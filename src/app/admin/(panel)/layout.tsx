import Link from "next/link";
import { LayoutDashboard, Newspaper, CalendarDays, FileText, Users, MessageSquare, School, Globe, Home, LogOut, KeyRound, ExternalLink } from "lucide-react";
import { adminContext, unreadCount } from "@/lib/admin-data";
import { logout } from "../actions";
import { LogoMark } from "@/components/logo";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { admin, org, mySchools, isSum } = await adminContext();
  const unread = await unreadCount(admin.orgId, admin.schoolId);
  const nav: [string, string, React.ReactNode, number?][] = [
    ["/admin", "Самбар", <LayoutDashboard key="d" />],
    ["/admin/medee", "Мэдээ", <Newspaper key="n" />],
    ["/admin/huanli", "Хуанли", <CalendarDays key="c" />],
    ["/admin/il-tod", "Ил тод байдал", <FileText key="f" />],
    ["/admin/bagsh", "Багш, ажилтан", <Users key="u" />],
    ["/admin/sanal", "Санал хүсэлт", <MessageSquare key="m" />, unread],
    ...(isSum ? [["/admin/surguuli", "Сургуулиуд", <School key="s" />] as [string, string, React.ReactNode]] : [[`/admin/surguuli/${admin.schoolId}`, "Сургуулийн мэдээлэл", <School key="s" />] as [string, string, React.ReactNode]]),
    ...(isSum ? [["/admin/sum", "Нүүр хуудас", <Home key="h" />] as [string, string, React.ReactNode]] : []),
    ["/admin/domain", "Домэйн", <Globe key="g" />],
    ["/admin/nuuts", "Нууц үг", <KeyRound key="k" />],
  ];
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 p-4">
          <LogoMark className="size-10" />
          <div className="min-w-0">
            <div className="truncate font-extrabold text-ink">{isSum ? org.name : mySchools[0]?.shortName}</div>
            <div className="truncate text-xs font-semibold text-ink/55">{admin.name}</div>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible [scrollbar-width:none]">
          {nav.map(([href, label, icon, badge]) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ink/75 hover:bg-brand-50 hover:text-brand-700 [&>svg]:size-[18px]">
              {icon}<span className="flex-1">{label}</span>
              {badge ? <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">{badge}</span> : null}
            </Link>
          ))}
          <a href="/" target="_blank" className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-brand-600 hover:bg-brand-50 [&>svg]:size-[18px]"><ExternalLink /> Сайтыг харах</a>
          <form action={logout}>
            <button className="flex w-full shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-ink/55 hover:bg-rose-50 hover:text-rose-600 [&>svg]:size-[18px]"><LogOut /> Гарах</button>
          </form>
        </nav>
      </aside>
      <main className="min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  );
}
