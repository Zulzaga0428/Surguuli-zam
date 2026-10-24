import type { School } from "@/lib/schema";
import { inputCls } from "./admin-ui";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-ink/80">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

export function Card({ title, children, actions }: { title?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
      {(title || actions) && <div className="mb-4 flex items-center justify-between gap-3">{title && <h2 className="text-lg font-extrabold text-ink">{title}</h2>}{actions}</div>}
      {children}
    </section>
  );
}

export function PageTitle({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-black text-ink">{title}</h1>
        {sub && <p className="mt-0.5 text-sm font-semibold text-ink/55">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function Flash({ ok, children }: { ok?: string; children: React.ReactNode }) {
  if (!ok) return null;
  return <div className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200">✓ {children}</div>;
}

// Сумын админд сургууль сонгох талбар, сургуулийн админд нуугдмал утга.
export function SchoolSelect({ admin, schools, value, allowAll = true }: { admin: { schoolId: number | null }; schools: School[]; value?: number | null; allowAll?: boolean }) {
  if (admin.schoolId !== null) return null;
  return (
    <Field label="Хамаарах сургууль">
      <select name="schoolId" defaultValue={value ?? ""} className={inputCls} required={!allowAll}>
        {allowAll ? <option value="">Бүх сургууль (сумын нийтийн)</option> : <option value="" disabled>Сонгоно уу</option>}
        {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </Field>
  );
}
