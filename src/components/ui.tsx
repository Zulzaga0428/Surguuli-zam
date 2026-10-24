import Link from "next/link";
import { ArrowRight, Newspaper, Trophy, Megaphone } from "lucide-react";
import type { Post, School } from "@/lib/schema";
import { fileUrl, fmtDate, POST_CATEGORIES } from "@/lib/site";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function SectionTitle({ icon, title, sub, href, linkLabel }: { icon: React.ReactNode; title: string; sub?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-brand-600">{icon}</span>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-ink">{title}</h2>
          {sub && <p className="text-sm font-semibold text-ink/60">{sub}</p>}
        </div>
      </div>
      {href && <Link href={href} className="shrink-0 inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:gap-2 transition-all">{linkLabel ?? "Бүгд"} <ArrowRight className="size-4" /></Link>}
    </div>
  );
}

const THUMB_BG: Record<string, string> = {
  medee: "from-sky-200 to-blue-300 text-blue-700",
  amjilt: "from-amber-200 to-orange-300 text-orange-700",
  zarlal: "from-emerald-200 to-teal-300 text-teal-700",
};

export function PostThumb({ post, className = "" }: { post: Post; className?: string }) {
  const url = fileUrl(post.coverId);
  if (url) return <img src={url} alt="" className={`object-cover ${className}`} />;
  const Icon = post.category === "amjilt" ? Trophy : post.category === "zarlal" ? Megaphone : Newspaper;
  return (
    <div className={`grid place-items-center bg-gradient-to-br ${THUMB_BG[post.category] ?? THUMB_BG.medee} ${className}`}>
      <Icon className="size-1/3 max-w-12 opacity-70" />
    </div>
  );
}

export function PostRow({ post, school }: { post: Post; school?: School | null }) {
  return (
    <Link href={`/medee/${post.id}`} className="group flex gap-4 rounded-2xl bg-white p-3 ring-1 ring-blue-100 hover:ring-brand-500/40 hover:shadow-lg hover:shadow-blue-900/5 transition">
      <PostThumb post={post} className="h-20 w-28 shrink-0 rounded-xl" />
      <div className="min-w-0 py-1">
        <div className="text-xs font-semibold text-ink/50">{fmtDate(post.publishedAt)}{school ? ` · ${school.shortName}` : ""}</div>
        <div className="mt-1 line-clamp-2 font-bold text-ink group-hover:text-brand-600">{post.title}</div>
      </div>
    </Link>
  );
}

export function PostCard({ post, school }: { post: Post; school?: School | null }) {
  return (
    <Link href={`/medee/${post.id}`} className="group overflow-hidden rounded-3xl bg-white ring-1 ring-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition">
      <PostThumb post={post} className="aspect-[16/9] w-full" />
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink/50">
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">{POST_CATEGORIES[post.category] ?? "Мэдээ"}</span>
          <span>{fmtDate(post.publishedAt)}</span>
          {school && <span>· {school.shortName}</span>}
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-extrabold text-ink group-hover:text-brand-600">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink/70">{post.body}</p>
      </div>
    </Link>
  );
}

export function Paragraphs({ text }: { text: string }) {
  return <div className="prose-body">{text.split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}</div>;
}

export function PageHero({ title, sub, kicker }: { title: string; sub?: string; kicker?: string }) {
  return (
    <div className="bg-gradient-to-b from-blue-100/70 to-transparent">
      <Container className="py-10 sm:py-14">
        {kicker && <div className="font-hand text-2xl text-brand-600">{kicker}</div>}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-ink/70 font-semibold">{sub}</p>}
      </Container>
    </div>
  );
}

export function SchoolFilter({ schools, current, base }: { schools: School[]; current?: string; base: string }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Link href={base} className={`rounded-full px-4 py-2 text-sm font-bold ring-1 ${!current ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-ink ring-blue-100 hover:ring-brand-500"}`}>Бүгд</Link>
      {schools.map((s) => (
        <Link key={s.id} href={`${base}?s=${s.slug}`} className={`rounded-full px-4 py-2 text-sm font-bold ring-1 ${current === s.slug ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-ink ring-blue-100 hover:ring-brand-500"}`}>{s.shortName}</Link>
      ))}
    </div>
  );
}
