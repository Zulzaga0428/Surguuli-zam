import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts, type Post } from "@/lib/schema";
import { adminContext } from "@/lib/admin-data";
import { canManageSchool } from "@/lib/auth";
import { fileUrl, POST_CATEGORIES } from "@/lib/site";
import { Card, Field, PageTitle, SchoolSelect } from "@/components/admin-kit";
import { DangerSubmit, Submit, inputCls } from "@/components/admin-ui";
import { deletePost, savePost } from "../../../actions";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { admin, schools } = await adminContext();
  let post: Post | null = null;
  if (id !== "new") {
    const [p] = await db.select().from(posts).where(and(eq(posts.id, Number(id) || 0), eq(posts.orgId, admin.orgId)));
    if (!p || !canManageSchool(admin, p.schoolId)) notFound();
    post = p;
  }
  const cover = fileUrl(post?.coverId);
  return (
    <>
      <PageTitle title={post ? "Мэдээ засах" : "Шинэ мэдээ"}>
        <Link href="/admin/medee" className="text-sm font-bold text-ink/55">← Буцах</Link>
      </PageTitle>
      <Card>
        <form action={savePost} className="space-y-5">
          {post && <input type="hidden" name="id" value={post.id} />}
          <Field label="Гарчиг"><input name="title" required defaultValue={post?.title} className={inputCls} placeholder="Жишээ: Хичээлийн шинэ жилийн баяр" /></Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Ангилал">
              <select name="category" defaultValue={post?.category ?? "medee"} className={inputCls}>
                {Object.entries(POST_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <SchoolSelect admin={admin} schools={schools} value={post?.schoolId} />
          </div>
          <Field label="Агуулга" hint="Догол мөр тусгаарлахдаа хоосон мөр үлдээнэ"><textarea name="body" rows={10} defaultValue={post?.body} className={inputCls} /></Field>
          <Field label="Нүүр зураг" hint="JPG, PNG, WEBP · 8MB хүртэл">
            {cover && <img src={cover} alt="" className="mb-2 h-32 rounded-xl object-cover" />}
            <input type="file" name="cover" accept="image/*" className="block text-sm text-ink/60 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-50 file:px-3.5 file:py-2 file:font-bold file:text-brand-700" />
          </Field>
          {cover && <label className="flex items-center gap-2 text-sm font-semibold text-ink/70"><input type="checkbox" name="removeCover" /> Зургийг хасах</label>}
          <label className="flex items-center gap-2 font-semibold text-ink"><input type="checkbox" name="published" defaultChecked={post?.published ?? true} className="size-4" /> Сайт дээр нийтлэх</label>
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <Submit>{post ? "Хадгалах" : "Нийтлэх"}</Submit>
            {post && <span className="text-sm"><Link href={`/medee/${post.id}`} target="_blank" className="font-bold text-brand-600">Сайт дээр харах ↗</Link></span>}
          </div>
        </form>
        {post && (
          <form action={deletePost} className="mt-4 text-right">
            <input type="hidden" name="id" value={post.id} />
            <DangerSubmit confirm="Энэ мэдээг устгах уу?">Мэдээг устгах</DangerSubmit>
          </form>
        )}
      </Card>
    </>
  );
}
