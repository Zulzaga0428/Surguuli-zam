import { redirect } from "next/navigation";
import { adminContext } from "@/lib/admin-data";
import { fileUrl } from "@/lib/site";
import { Card, Field, Flash, PageTitle } from "@/components/admin-kit";
import { Submit, inputCls } from "@/components/admin-ui";
import { saveOrg } from "../../actions";

export default async function AdminOrg({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const { ok } = await searchParams;
  const { admin, org } = await adminContext();
  if (admin.schoolId) redirect("/admin");
  return (
    <>
      <PageTitle title="Нүүр хуудас" sub="Сумын нэгдсэн сайтын толгой хэсэг, холбоо барих" />
      <Flash ok={ok}>Хадгалагдлаа</Flash>
      <form action={saveOrg} className="space-y-6">
        <Card title="Толгой хэсэг (hero)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Сум / дүүргийн нэр"><input name="name" required defaultValue={org.name} className={inputCls} /></Field>
            <Field label="Дээд жижиг бичиг"><input name="heroKicker" defaultValue={org.heroKicker} className={inputCls} /></Field>
            <Field label="Гарчиг" hint="Эхний үг хар, үлдсэн нь цэнхэр"><input name="heroTitle" required defaultValue={org.heroTitle} className={inputCls} /></Field>
            <Field label="Zulzaga EDU холбоос"><input name="eduUrl" defaultValue={org.eduUrl} className={inputCls} /></Field>
          </div>
          <div className="mt-4"><Field label="Тайлбар"><textarea name="heroText" rows={2} defaultValue={org.heroText} className={inputCls} /></Field></div>
          <div className="mt-4"><Field label="Толгойн зураг" hint="Өргөн зураг, хүүхдүүд баруун талд байвал зохимжтой">
            <img src={fileUrl(org.heroImageId) ?? "/img/hero.webp"} alt="" className="mb-2 h-28 rounded-xl object-cover" />
            <input type="file" name="heroImage" accept="image/*" className="block text-sm text-ink/60 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-3.5 file:py-2 file:font-bold file:text-brand-700" />
          </Field></div>
        </Card>
        <Card title="Холбоо барих">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Хаяг"><input name="address" defaultValue={org.address} className={inputCls} /></Field>
            <Field label="Утас"><input name="phone" defaultValue={org.phone} className={inputCls} /></Field>
            <Field label="Имэйл"><input name="email" defaultValue={org.email} className={inputCls} /></Field>
            <Field label="Facebook"><input name="facebook" defaultValue={org.facebook} className={inputCls} /></Field>
          </div>
          <div className="mt-4"><Field label="Танилцуулга"><textarea name="about" rows={4} defaultValue={org.about} className={inputCls} /></Field></div>
        </Card>
        <div className="flex justify-end"><Submit>Хадгалах</Submit></div>
      </form>
    </>
  );
}
