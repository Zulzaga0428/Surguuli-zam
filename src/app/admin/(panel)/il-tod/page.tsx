import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { documents } from "@/lib/schema";
import { adminContext, adminScope } from "@/lib/admin-data";
import { DOC_CATEGORIES, fileUrl, fmtDate } from "@/lib/site";
import { Card, Field, Flash, PageTitle, SchoolSelect } from "@/components/admin-kit";
import { DangerSubmit, Submit, inputCls } from "@/components/admin-ui";
import { addDocument, deleteDocument } from "../../actions";

export default async function AdminDocs({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const { admin, schools } = await adminContext();
  const rows = await db.select().from(documents).where(and(eq(documents.orgId, admin.orgId), adminScope(admin, documents.schoolId))).orderBy(desc(documents.publishedOn));
  const byId = new Map(schools.map((s) => [s.id, s.shortName]));
  return (
    <>
      <PageTitle title="Ил тод байдал" sub="Төсөв, худалдан авалт, тушаал, журам, ажлын байрны зар — PDF, Word, Excel" />
      <Flash ok={ok}>Баримт нийтлэгдлээ</Flash>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
          {rows.map((d) => (
            <div key={d.id} className="flex items-center gap-4 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-ink">{d.title}</div>
                <div className="text-xs font-semibold text-ink/50">{DOC_CATEGORIES[d.category]} · {fmtDate(d.publishedOn)} · {d.schoolId ? byId.get(d.schoolId) : "Сумын нэгдсэн"}</div>
              </div>
              {d.fileId ? <a href={fileUrl(d.fileId)!} target="_blank" className="text-sm font-bold text-brand-600">Файл</a> : <span className="text-xs text-ink/40">Файлгүй</span>}
              {(admin.schoolId === null || d.schoolId === admin.schoolId) && (
                <form action={deleteDocument}><input type="hidden" name="id" value={d.id} /><DangerSubmit confirm="Устгах уу?">Устгах</DangerSubmit></form>
              )}
            </div>
          ))}
        </div>
        <Card title="Баримт нийтлэх">
          <form action={addDocument} className="space-y-4">
            <Field label="Гарчиг"><input name="title" required className={inputCls} /></Field>
            <Field label="Ангилал">
              <select name="category" className={inputCls}>{Object.entries(DOC_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            </Field>
            <SchoolSelect admin={admin} schools={schools} />
            <Field label="Огноо"><input type="date" name="publishedOn" className={inputCls} /></Field>
            <Field label="Файл" hint="PDF, Word, Excel, зураг · 8MB хүртэл"><input type="file" name="file" className="block text-sm text-ink/60 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-3.5 file:py-2 file:font-bold file:text-brand-700" /></Field>
            <Submit className="w-full">Нийтлэх</Submit>
          </form>
        </Card>
      </div>
    </>
  );
}
