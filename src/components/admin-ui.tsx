"use client";
import { useFormStatus } from "react-dom";

export const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export function Submit({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={`inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 font-bold text-white hover:bg-brand-700 disabled:opacity-60 ${className}`}>
      {pending ? "Хадгалж байна…" : children}
    </button>
  );
}

export function DangerSubmit({ children, confirm: msg }: { children: React.ReactNode; confirm: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} onClick={(e) => { if (!window.confirm(msg)) e.preventDefault(); }}
      className="rounded-lg px-3 py-1.5 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50">
      {children}
    </button>
  );
}
