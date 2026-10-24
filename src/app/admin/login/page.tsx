import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { getSite } from "@/lib/site";
import { LogoMark } from "@/components/logo";
import { LoginForm } from "./form";

export const metadata = { title: "Админ нэвтрэх" };

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  const { org, school } = await getSite();
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl shadow-blue-900/10 ring-1 ring-blue-100">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <div className="font-extrabold text-ink">{school ? school.shortName : org.name}</div>
            <div className="text-sm font-semibold text-ink/55">Сайтын удирдлага</div>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
