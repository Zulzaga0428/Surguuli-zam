import { BookOpen } from "lucide-react";

export function LogoMark({ className = "size-11" }: { className?: string }) {
  return (
    <span className={`${className} grid place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-blue-800 text-white shadow-md shadow-blue-900/20 ring-2 ring-white`}>
      <BookOpen className="size-1/2" strokeWidth={2.2} />
    </span>
  );
}
