import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Sparkles } from "lucide-react";
import { adminContext } from "@/lib/admin-data";
import { color, schoolPhoto } from "@/lib/site";
import { Card, Field, PageTitle } from "@/components/admin-kit";
import { Submit, inputCls } from "@/components/admin-ui";
import { createSchool } from "../../actions";

export default async function AdminSchools() {
  const { admin, schools } = await adminContext();
  if (admin.schoolId) redirect(`/admin/surguuli/${admin.schoolId}`);
  return (
    <>
      <PageTitle title="Сургуулиуд" sub="Сургууль бүр өөрийн хуудас, админ, домэйнтэй" />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {schools.map((s) => {
            const p = schoolPhoto(s);
            return (
              <Link key={s.id} href={`/admin/surguuli/${s.id}`} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 hover:ring-brand-500/40">
                {p ? <img src={p} alt="" className="h-28 w-full object-cover" /> : <div className={`h-28 ${color(s).soft}`} />}
                <div className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1"><div className="font-extrabold text-ink">{s.name}</div><div className="text-xs font-semibold text-ink/55">{s.students} сурагч · {s.teachers} багш</div></div>
                  <Pencil className="size-4 text-ink/40" />
                </div>
              </Link>
            );
          })}
        </div>
        <Card title="Шинэ сургууль нэмэх">
          <div className="mb-4 flex gap-2 rounded-xl bg-brand-50 p-3 text-sm font-semibold text-brand-700"><Sparkles className="size-5 shrink-0" /> Сургуулийн хуудас, админ эрх шууд үүснэ. Домэйн бичвэл тэр хаягаар шууд нээгдэнэ.</div>
          <form action={createSchool} className="space-y-4">
            <Field label="Сургуулийн бүтэн нэр"><input name="name" required className={inputCls} placeholder="Замын-Үүд сумын 5-р сургууль" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Дугаар"><input name="number" type="number" min={1} className={inputCls} placeholder={String(schools.length + 1)} /></Field>
              <Field label="Богино нэр"><input name="shortName" className={inputCls} placeholder={`${schools.length + 1}-р сургууль`} /></Field>
            </div>
            <Field label="Домэйн (заавал биш)" hint="Сургуулийн өөрийн домэйн, ж: school5.edu.mn"><input name="domain" className={inputCls} placeholder="school5.edu.mn" /></Field>
            <Submit className="w-full">Сургууль үүсгэх</Submit>
          </form>
        </Card>
      </div>
    </>
  );
}
