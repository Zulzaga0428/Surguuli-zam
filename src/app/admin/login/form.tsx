"use client";
import { useActionState } from "react";
import { login, type LoginState } from "../actions";
import { inputCls } from "@/components/admin-ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <input name="username" defaultValue={state.username} key={state.username} placeholder="Нэвтрэх нэр" autoComplete="username" required className={inputCls} />
      <input name="password" type="password" placeholder="Нууц үг" autoComplete="current-password" required className={inputCls} />
      {state.error && <div className="rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm font-semibold text-rose-700">{state.error}</div>}
      <button disabled={pending} className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-60">{pending ? "Нэвтэрч байна…" : "Нэвтрэх"}</button>
      <a href="/" className="block text-center text-sm font-semibold text-ink/50 hover:text-brand-600">← Сайт руу буцах</a>
    </form>
  );
}
