"use client";
import { useActionState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { sendMessage, type ContactState } from "@/app/(site)/actions";

const KINDS = [["sanal", "Санал"], ["asuult", "Асуулт"], ["gomdol", "Гомдол"], ["talarhal", "Талархал"]];

export function ContactForm({ schools, schoolId }: { schools: { id: number; name: string }[]; schoolId?: number | null }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, {});
  if (state.ok) {
    return (
      <div className="rounded-3xl bg-emerald-50 p-8 text-center ring-1 ring-emerald-200">
        <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
        <div className="mt-3 text-lg font-extrabold text-ink">Таны санал хүсэлт хүлээн авагдлаа</div>
        <p className="mt-1 text-sm text-ink/70">Сургуулийн удирдлага танилцаж, шаардлагатай бол тантай холбогдоно. Баярлалаа!</p>
      </div>
    );
  }
  const input = "w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-ink outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";
  return (
    <form action={action} className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-blue-100">
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="flex flex-wrap gap-2">
        {KINDS.map(([v, l], i) => (
          <label key={v} className="cursor-pointer">
            <input type="radio" name="kind" value={v} defaultChecked={i === 0} className="peer sr-only" />
            <span className="block rounded-full px-4 py-2 text-sm font-bold ring-1 ring-blue-100 peer-checked:bg-brand-600 peer-checked:text-white peer-checked:ring-brand-600">{l}</span>
          </label>
        ))}
      </div>
      {schoolId ? <input type="hidden" name="schoolId" value={schoolId} /> : (
        <select name="schoolId" className={input} defaultValue="">
          <option value="">Сумын боловсролын хэлтэс / ерөнхий</option>
          {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Нэр (заавал биш)" className={input} />
        <input name="contact" placeholder="Утас эсвэл имэйл (заавал биш)" className={input} />
      </div>
      <textarea name="body" required minLength={5} rows={5} placeholder="Санал хүсэлтээ энд бичнэ үү…" className={input} />
      {state.error && <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{state.error}</div>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink/55">Нэр, утсаа бичээгүй бол нэргүйгээр илгээгдэнэ.</p>
        <button disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-brand-700 disabled:opacity-60">
          <Send className="size-4" /> {pending ? "Илгээж байна…" : "Илгээх"}
        </button>
      </div>
    </form>
  );
}
