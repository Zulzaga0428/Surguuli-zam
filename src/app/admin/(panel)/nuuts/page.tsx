import { Card, Field, Flash, PageTitle } from "@/components/admin-kit";
import { Submit, inputCls } from "@/components/admin-ui";
import { changePassword } from "../../actions";

export default async function Password({ searchParams }: { searchParams: Promise<{ ok?: string; err?: string }> }) {
  const { ok, err } = await searchParams;
  return (
    <>
      <PageTitle title="Нууц үг солих" />
      <Flash ok={ok}>Нууц үг солигдлоо</Flash>
      {err && <div className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{err === "1" ? "Одоогийн нууц үг буруу" : "Шинэ нууц үг 8-аас дээш тэмдэгт байх ёстой"}</div>}
      <div className="max-w-md">
        <Card>
          <form action={changePassword} className="space-y-4">
            <Field label="Одоогийн нууц үг"><input name="current" type="password" required className={inputCls} /></Field>
            <Field label="Шинэ нууц үг" hint="8-аас дээш тэмдэгт"><input name="next" type="password" required minLength={8} className={inputCls} /></Field>
            <Submit className="w-full">Солих</Submit>
          </form>
        </Card>
      </div>
    </>
  );
}
