import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { events } from "@/lib/schema";
import { adminContext, adminScope } from "@/lib/admin-data";
import { fmtDate } from "@/lib/site";
import { Card, Field, Flash, PageTitle, SchoolSelect } from "@/components/admin-kit";
import { DangerSubmit, Submit, inputCls } from "@/components/admin-ui";
import { addEvent, deleteEvent } from "../../actions";

const KIND: Record<string, string> = { event: "Арга хэмжээ", holiday: "Амралт", term: "Хичээлийн жил" };

export default async function AdminEvents({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const { admin, schools } = await adminContext();
  const rows = await db.select().from(events).where(and(eq(events.orgId, admin.orgId), adminScope(admin, events.schoolId))).orderBy(asc(events.startsOn));
  const byId = new Map(schools.map((s) => [s.id, s.shortName]));
  return (
    <>
      <PageTitle title="Хичээлийн жил, хуанли" sub="Улирал, амралт, сургуулийн арга хэмжээ" />
      <Flash ok={ok}>Нэмэгдлээ</Flash>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
          {rows.map((e) => (
            <div key={e.id} className="flex items-center gap-4 px-4 py-3">
              <div className="w-24 shrink-0 text-sm font-bold text-brand-700">{fmtDate(e.startsOn)}</div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-ink">{e.title}</div>
                <div className="text-xs font-semibold text-ink/50">{KIND[e.kind]}{e.endsOn ? ` · ${fmtDate(e.endsOn)} хүртэл` : ""} · {e.schoolId ? byId.get(e.schoolId) : "Бүх сургууль"}{e.place ? ` · ${e.place}` : ""}</div>
              </div>
              {(admin.schoolId === null || e.schoolId === admin.schoolId) && (
                <form action={deleteEvent}><input type="hidden" name="id" value={e.id} /><DangerSubmit confirm="Устгах уу?">Устгах</DangerSubmit></form>
              )}
            </div>
          ))}
        </div>
        <Card title="Шинэ үйл явдал">
          <form action={addEvent} className="space-y-4">
            <Field label="Гарчиг"><input name="title" required className={inputCls} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Эхлэх"><input type="date" name="startsOn" required className={inputCls} /></Field>
              <Field label="Дуусах (заавал биш)"><input type="date" name="endsOn" className={inputCls} /></Field>
            </div>
            <Field label="Төрөл">
              <select name="kind" className={inputCls}>{Object.entries(KIND).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            </Field>
            <SchoolSelect admin={admin} schools={schools} />
            <Field label="Байршил"><input name="place" className={inputCls} /></Field>
            <Field label="Тайлбар"><textarea name="description" rows={3} className={inputCls} /></Field>
            <Submit className="w-full">Нэмэх</Submit>
          </form>
        </Card>
      </div>
    </>
  );
}
