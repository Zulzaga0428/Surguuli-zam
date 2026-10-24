import { and, asc, eq } from "drizzle-orm";
import { Globe, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { domains } from "@/lib/schema";
import { adminContext, adminScope } from "@/lib/admin-data";
import { Card, Field, Flash, PageTitle, SchoolSelect } from "@/components/admin-kit";
import { DangerSubmit, Submit, inputCls } from "@/components/admin-ui";
import { addDomain, deleteDomain } from "../../actions";

export default async function AdminDomains({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const { admin, schools } = await adminContext();
  const rows = (await db.select().from(domains).where(and(eq(domains.orgId, admin.orgId), adminScope(admin, domains.schoolId))).orderBy(asc(domains.createdAt)))
    .filter((d) => d.host !== "localhost" && d.host !== "127.0.0.1");
  const byId = new Map(schools.map((s) => [s.id, s.name]));
  const target = process.env.CNAME_TARGET ?? "sites.zulzaga.app";
  return (
    <>
      <PageTitle title="Домэйн холбох" sub="Сургуулийн өөрийн домэйноор сайтаа нээх" />
      <Flash ok={ok}>Домэйн бүртгэгдлээ</Flash>
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card title="Холбогдсон домэйнууд">
            {rows.length === 0 ? <p className="text-sm text-ink/55">Одоогоор домэйн холбогдоогүй.</p> : (
              <ul className="divide-y divide-slate-100">
                {rows.map((d) => (
                  <li key={d.host} className="flex items-center gap-3 py-3">
                    <Globe className="size-5 text-brand-600" />
                    <div className="min-w-0 flex-1">
                      <a href={`https://${d.host}`} target="_blank" className="font-bold text-ink hover:text-brand-600">{d.host}</a>
                      <div className="text-xs font-semibold text-ink/50">{d.schoolId ? byId.get(d.schoolId) : "Сумын нэгдсэн сайт"}</div>
                    </div>
                    <form action={deleteDomain}><input type="hidden" name="host" value={d.host} /><DangerSubmit confirm="Домэйныг салгах уу?">Салгах</DangerSubmit></form>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Хэрхэн холбох вэ — 3 алхам">
            <ol className="space-y-4 text-sm text-ink/85">
              <li className="flex gap-3"><Num n={1} /><div>Сургууль өөрийн домэйноо (ж: <b>school1.edu.mn</b>) энд бүртгэнэ.</div></li>
              <li className="flex gap-3"><Num n={2} /><div>Домэйн бүртгэгчийн (Datacom, Namecheap г.м.) DNS тохиргоонд нэг мөр нэмнэ:
                <div className="mt-2 overflow-x-auto rounded-xl bg-slate-900 p-3 font-mono text-xs text-emerald-300">CNAME&nbsp;&nbsp;www&nbsp;&nbsp;→&nbsp;&nbsp;{target}</div>
                <div className="mt-1 text-xs text-ink/50">Үндсэн домэйнд (@) — бүртгэгч ALIAS/ANAME дэмждэг бол мөн {target} руу.</div></div></li>
              <li className="flex gap-3"><Num n={3} /><div>Бид SSL (https) гэрчилгээг автоматаар суулгана. 15 минут — 24 цагийн дотор сайт нээгдэнэ.</div></li>
            </ol>
            <div className="mt-5 flex gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800"><CheckCircle2 className="size-5 shrink-0" /> Сургуульд ямар ч сервер, програмист хэрэггүй — агуулгаа энэ самбараас өөрсдөө шинэчилнэ.</div>
          </Card>
        </div>
        <Card title="Домэйн нэмэх">
          <form action={addDomain} className="space-y-4">
            <Field label="Домэйн"><input name="host" required className={inputCls} placeholder="school1.edu.mn" /></Field>
            <SchoolSelect admin={admin} schools={schools} />
            <Submit className="w-full">Бүртгэх</Submit>
          </form>
        </Card>
      </div>
    </>
  );
}

function Num({ n }: { n: number }) {
  return <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-black text-white">{n}</span>;
}
