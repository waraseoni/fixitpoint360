"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wrench,
  ShieldCheck,
  UserCog,
  UsersRound,
  CalendarCheck2,
  Banknote,
  CarFront,
  ArrowLeftRight,
  BookOpenText,
  Settings,
  LogOut,
  Languages,
  Menu,
  X,
  Wrench as Logo,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { canAccess, roleLabel } from "@/lib/roles";
import type { TKey } from "@/lib/i18n";

const NAV: { href: string; key: TKey; icon: ReactNode }[] = [
  { href: "/app/dashboard", key: "dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/app/users", key: "users", icon: <UserCog className="h-4 w-4" /> },
  { href: "/app/clients", key: "clients", icon: <Users className="h-4 w-4" /> },
  { href: "/app/jobs", key: "jobs", icon: <Wrench className="h-4 w-4" /> },
  { href: "/app/amc", key: "amc", icon: <ShieldCheck className="h-4 w-4" /> },
  { href: "/app/staff", key: "team", icon: <UsersRound className="h-4 w-4" /> },
  { href: "/app/attendance", key: "attendance", icon: <CalendarCheck2 className="h-4 w-4" /> },
  { href: "/app/tada", key: "taDa", icon: <CarFront className="h-4 w-4" /> },
  { href: "/app/salary", key: "salary", icon: <Banknote className="h-4 w-4" /> },
  { href: "/app/money", key: "money", icon: <ArrowLeftRight className="h-4 w-4" /> },
  { href: "/app/ledger", key: "ledger", icon: <BookOpenText className="h-4 w-4" /> },
  { href: "/app/settings", key: "settings", icon: <Settings className="h-4 w-4" /> },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready, logout, settings } = useStore();
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  if (!canAccess(session.role, pathname)) {
    router.replace("/app/dashboard");
    return null;
  }

  const navItems = NAV.filter((n) => canAccess(session.role, n.href));

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 transform border-r border-slate-200 bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Logo className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-900">{t("appName")}</div>
            <div className="truncate text-[10px] text-slate-500">{t("tagline")}</div>
          </div>
          <button className="ml-auto rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-0.5 overflow-y-auto p-2">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {item.icon}
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 p-3">
          <div className="mb-2 truncate px-1 text-xs font-medium text-slate-700">
            {session.name}
            <span className="ml-1 text-[10px] uppercase text-slate-400">
              ({roleLabel(session.role, lang)})
            </span>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
          <button className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900">{settings.name}</div>
            <div className="hidden truncate text-xs text-slate-500 sm:block">{settings.address}</div>
          </div>
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Languages className="h-4 w-4" />
            {lang === "en" ? "हिन्दी" : "English"}
          </button>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
