"use client";

import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { X, Search } from "lucide-react";
import { useEffect } from "react";

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

type BtnVariant = "primary" | "secondary" | "danger" | "ghost" | "success" | "outline";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  const styles: Record<BtnVariant, string> = {
    primary:
      "bg-linear-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:shadow-lg hover:shadow-indigo-600/40 hover:brightness-110",
    secondary: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/30 transition-colors",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition-colors",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors",
    outline:
      "border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 transition-colors",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950",
        className
      )}
      {...props}
    />
  );
}

export function Field({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors", className)}>{children}</div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-slate-50/80 dark:from-slate-800/40 via-transparent to-transparent px-4 py-3">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: "blue" | "green" | "red" | "amber" | "indigo" | "slate";
}) {
  const tones: Record<string, string> = {
    blue: "bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30",
    green: "bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30",
    red: "bg-linear-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/30",
    amber: "bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-400/30",
    indigo: "bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30",
    slate: "bg-linear-to-br from-slate-500 to-slate-700 text-white shadow-md shadow-slate-500/30",
  };
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110", tones[tone])}>{icon}</div>
      <div className="min-w-0">
        <div className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{label}</div>
        <div className="truncate text-lg font-bold text-slate-900 dark:text-slate-100">{value}</div>
      </div>
    </div>
  );
}

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-blue-200 dark:ring-blue-800",
    green: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-800",
    red: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 ring-red-200 dark:ring-red-800",
    amber: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 ring-amber-200 dark:ring-amber-800",
    indigo: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-indigo-200 dark:ring-indigo-800",
    slate: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 ring-slate-200 dark:ring-slate-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1", tones[tone] || tones.slate)}>
      {children}
    </span>
  );
}


export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-start sm:overflow-y-auto sm:p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl sm:my-6 sm:max-h-none sm:rounded-xl",
          wide ? "sm:max-w-2xl" : "sm:max-w-lg"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 sm:hidden" />
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-2 text-3xl">📭</div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th className={cn("whitespace-nowrap px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("whitespace-nowrap px-3 py-2 text-sm text-slate-700 dark:text-slate-300", className)}>{children}</td>;
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

