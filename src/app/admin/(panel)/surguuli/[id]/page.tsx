import Link from "next/link";
import { notFound } from "next/navigation";
import { KeyRound } from "lucide-react";
import { adminContext } from "@/lib/admin-data";
import { canManageSchool } from "@/lib/auth";
import { COLORS, fileUrl, schoolPhoto } from "@/lib/site";
import { Card, Field, Flash, PageTitle } from "@/components/admin-kit";
import { Submit, inputCls } from "@/components/admin-ui";
import { saveSchool } from "../../../actions";

export default async function EditSchool({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; created?: string }> }) {
  const { id } = await params;
  const { ok, created } = await searchParams;
  const { admin, schools } = await adminContext();
  const s = schools.find((x) => x.id === Number(id));
  if (!s || !canManageSchool(admin, s.id)) notFound();
  const [user, pass] = (created ?? "").split(":");
  const photo = schoolPhoto(s);
  return (
    <>
      <PageTitle title={s.name} sub="Сургуулийн хуудсанд гарах мэдээлэл">
        <Link href={`/surguuli/${s.slug}`} target="_blank" className="text-sm font-bold text-brand-600">Хуудсыг харах ↗</Link>
      </PageTitle>
      {created && (
        <div className="mb-5 rounded-2xl bg-emerald-50 p-5 ring-1 ring-emerald-200">
          <div className="font-extrabold text-emerald-800">✓ Сургууль үүслээ — сайт нь бэлэн</div>
          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-900"><KeyRound className="size-4" /> Сургуулийн админ: <b>{user}</b> · нууц үг: <b className="font-mono">{pass}</b></div>
          <div className="mt-1 text-xs text-emerald-700">Энэ нууц үгийг сургуульд хүлээлгэж өгнө үү. Дахин харагдахгүй.</div>
        </div>
      )}
      <Flash ok={ok}>Хадгалагдлаа — сайт дээр шууд шинэчлэгдлээ</Flash>
      <form action={saveSchool} className="space-y-6">
        <input type="hidden" name="id" value={s.id} />
        <Card title="Үндсэн мэдээлэл">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Бүтэн нэр"><input name="name" required defaultValue={s.name} className={inputCls} /></Field>
            <Field label="Богино нэр"><input name="shortName" required defaultValue={s.shortName} className={inputCls} /></Field>
            <Field label="Уриа"><input name="tagline" defaultValue={s.tagline} className={inputCls} /></Field>
            <Field label="Өнгө">
              <select name="color" defaultValue={s.color} className={inputCls}>
                {Object.keys(COLORS).map((c) => <option key={c} value={c}>{({ blue: "Цэнхэр", green: "Ногоон", purple: "Ягаан", orange: "Улбар шар", red: "Улаан", teal: "Номин" } as Record<string, string>)[c]}</option>)}
              </select>
            </Field>
          </div>
          <div className="mt-4"><Field label="Бидний тухай" hint="Догол мөрийг хоосон мөрөөр тусгаарлана"><textarea name="about" rows={6} defaultValue={s.about} className={inputCls} /></Field></div>
          <div className="mt-4"><Field label="Сургуулийн зураг">
            {photo && <img src={photo} alt="" className="mb-2 h-28 rounded-xl object-cover" />}
            <input type="file" name="photo" accept="image/*" className="block text-sm text-ink/60 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-3.5 file:py-2 file:font-bold file:text-brand-700" />
          </Field></div>
        </Card>
        <Card title="Тоон мэдээлэл">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Сурагч"><input name="students" type="number" min={0} defaultValue={s.students} className={inputCls} /></Field>
            <Field label="Багш"><input name="teachers" type="number" min={0} defaultValue={s.teachers} className={inputCls} /></Field>
            <Field label="Бүлэг анги"><input name="classes" type="number" min={0} defaultValue={s.classes} className={inputCls} /></Field>
            <Field label="Байгуулагдсан он"><input name="founded" type="number" defaultValue={s.founded ?? ""} className={inputCls} /></Field>
          </div>
        </Card>
        <Card title="Захирлын мэндчилгээ">
          <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
            <div className="space-y-4">
              <Field label="Захирлын нэр"><input name="directorName" defaultValue={s.directorName} className={inputCls} /></Field>
              <Field label="Мэндчилгээ"><textarea name="directorMessage" rows={4} defaultValue={s.directorMessage} className={inputCls} /></Field>
            </div>
            <Field label="Зураг">
              {fileUrl(s.directorPhotoId) && <img src={fileUrl(s.directorPhotoId)!} alt="" className="mb-2 size-20 rounded-full object-cover" />}
              <input type="file" name="directorPhoto" accept="image/*" className="block text-sm text-ink/60 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-3.5 file:py-2 file:font-bold file:text-brand-700" />
            </Field>
          </div>
        </Card>
        <Card title="Элсэлт, дугуйлан">
          <div className="space-y-4">
            <Field label="Элсэлтийн мэдээлэл"><textarea name="admission" rows={5} defaultValue={s.admission} className={inputCls} /></Field>
            <Field label="Дугуйлан, секц" hint="Мөр бүрт нэг, эсвэл таслалаар"><textarea name="clubs" rows={3} defaultValue={s.clubs.join("\n")} className={inputCls} /></Field>
          </div>
        </Card>
        <Card title="Холбоо барих">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Хаяг"><input name="address" defaultValue={s.address} className={inputCls} /></Field>
            <Field label="Утас"><input name="phone" defaultValue={s.phone} className={inputCls} /></Field>
            <Field label="Имэйл"><input name="email" type="email" defaultValue={s.email} className={inputCls} /></Field>
            <Field label="Facebook хуудас"><input name="facebook" defaultValue={s.facebook} className={inputCls} /></Field>
          </div>
        </Card>
        <div className="sticky bottom-4 flex justify-end"><Submit className="shadow-lg">Бүгдийг хадгалах</Submit></div>
      </form>
    </>
  );
}
