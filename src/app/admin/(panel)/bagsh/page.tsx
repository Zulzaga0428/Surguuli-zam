import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { schools as schoolsT, staff } from "@/lib/schema";
import { adminContext } from "@/lib/admin-data";
import { fileUrl } from "@/lib/site";
import { Card, Field, Flash, PageTitle, SchoolSelect } from "@/components/admin-kit";
import { DangerSubmit, Submit, inputCls } from "@/components/admin-ui";
import { initials } from "@/components/school-view";
import { addStaff, deleteStaff } from "../../actions";

export default async function AdminStaff({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const { admin, schools } = await adminContext();
  const rows = await db.select({ s: staff, school: schoolsT }).from(staff).innerJoin(schoolsT, eq(schoolsT.id, staff.schoolId))
    .where(and(eq(schoolsT.orgId, admin.orgId), admin.schoolId ? eq(staff.schoolId, admin.schoolId) : undefined))
    .orderBy(asc(schoolsT.sort), asc(staff.sort));
  return (
    <>
      <PageTitle title="Багш, ажилтан" sub="Сайтын «Багш нар» хэсэгт гарна" />
      <Flash ok={ok}>Нэмэгдлээ</Flash>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
          {rows.map(({ s, school }) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3">
              {fileUrl(s.photoId) ? <img src={fileUrl(s.photoId)!} alt="" className="size-10 rounded-full object-cover" />
                : <span className="grid size-10 place-items-center rounded-full bg-brand-100 font-black text-brand-700">{initials(s.name)}</span>}
              <div className="min-w-0 flex-1">
                <div className="font-bold text-ink">{s.name}</div>
                <div className="text-xs font-semibold text-ink/50">{s.position}{s.subject ? ` · ${s.subject}` : ""}{admin.schoolId ? "" : ` · ${school.shortName}`}</div>
              </div>
              <form action={deleteStaff}><input type="hidden" name="id" value={s.id} /><DangerSubmit confirm="Устгах уу?">Устгах</DangerSubmit></form>
            </div>
          ))}
        </div>
        <Card title="Шинээр нэмэх">
          <form action={addStaff} className="space-y-4">
            <SchoolSelect admin={admin} schools={schools} allowAll={false} />
            <Field label="Овог нэр"><input name="name" required className={inputCls} placeholder="Б. Болормаа" /></Field>
            <Field label="Албан тушаал"><input name="position" required className={inputCls} placeholder="Багш" /></Field>
            <Field label="Хичээл / анги"><input name="subject" className={inputCls} placeholder="Математик" /></Field>
            <Field label="Бүлэг">
              <select name="group" className={inputCls}><option value="bagsh">Багш</option><option value="udirdlaga">Удирдлага</option></select>
            </Field>
            <Field label="Зураг (заавал биш)"><input type="file" name="photo" accept="image/*" className="block text-sm text-ink/60 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-3.5 file:py-2 file:font-bold file:text-brand-700" /></Field>
            <Submit className="w-full">Нэмэх</Submit>
          </form>
        </Card>
      </div>
    </>
  );
}
