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
  QrCode as QrIcon,
  FileText,
  Package,
  ChevronsLeft,
  ChevronsRight,
  Home,
  FolderKanban,
  CircleUserRound,
  Ellipsis,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/components/ui";
import { canAccess, roleLabel } from "@/lib/roles";
import type { TKey } from "@/lib/i18n";
import { QrModal } from "@/components/QrModal";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useTheme, getColorConfig } from "@/lib/theme";


interface NavItem {
  href: string;
  key: TKey;
  icon: ReactNode;
}

interface NavGroup {
  label?: TKey;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
      { href: "/app/dashboard", key: "dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { href: "/app/clients", key: "clients", icon: <Users className="h-4 w-4" /> },
    ],
  },
  {
    label: "groupServices",
    items: [
      { href: "/app/jobs", key: "jobs", icon: <Wrench className="h-4 w-4" /> },
      { href: "/app/documents", key: "documents", icon: <FileText className="h-4 w-4" /> },
      { href: "/app/inventory", key: "inventory", icon: <Package className="h-4 w-4" /> },
      { href: "/app/amc", key: "amc", icon: <ShieldCheck className="h-4 w-4" /> },
    ],
  },
  {
    label: "groupTeam",
    items: [
      { href: "/app/users", key: "users", icon: <UserCog className="h-4 w-4" /> },
      { href: "/app/staff", key: "team", icon: <UsersRound className="h-4 w-4" /> },
      { href: "/app/attendance", key: "attendance", icon: <CalendarCheck2 className="h-4 w-4" /> },
      { href: "/app/salary", key: "salary", icon: <Banknote className="h-4 w-4" /> },
      { href: "/app/tada", key: "taDa", icon: <CarFront className="h-4 w-4" /> },
    ],
  },
  {
    label: "groupFinance",
    items: [
      { href: "/app/money", key: "money", icon: <ArrowLeftRight className="h-4 w-4" /> },
      { href: "/app/ledger", key: "ledger", icon: <BookOpenText className="h-4 w-4" /> },
    ],
  },
  {
    label: "groupSystem",
    items: [{ href: "/app/settings", key: "settings", icon: <Settings className="h-4 w-4" /> }],
  },
];

const MOBILE_PRIMARY: NavItem[] = [
  { href: "/app/dashboard", key: "dashboard", icon: <Home className="h-5 w-5" /> },
  { href: "/app/jobs", key: "jobs", icon: <FolderKanban className="h-5 w-5" /> },
  { href: "/app/clients", key: "clients", icon: <CircleUserRound className="h-5 w-5" /> },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, ready, logout, settings } = useStore();
  const { t, lang, setLang } = useI18n();
  const { color } = useTheme();
  const themeConfig = getColorConfig(color);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
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

  const role = session.role;
  const groups = NAV_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((n) => canAccess(role, n.href)),
  })).filter((g) => g.items.length > 0);

  const allItems = groups.flatMap((g) => g.items);
  const activeItem = allItems.find((n) =>
    n.href === "/app/dashboard" ? pathname === "/app/dashboard" : pathname.startsWith(n.href)
  );

  const sidebarContent = (

    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-xs transition-colors"
          style={{ backgroundColor: themeConfig.primary }}
        >
          <Logo className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{t("appName")}</div>
            <div className="truncate text-[10px] text-slate-500 dark:text-slate-400">{t("tagline")}</div>
          </div>
        )}
        <button className="ml-auto rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </button>
        {!collapsed && (
          <button
            className="ml-auto hidden rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:block"
            onClick={() => setCollapsed(true)}
            title={t("collapse")}
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.label && !collapsed && (
              <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {t(group.label)}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/app/dashboard" ? pathname === "/app/dashboard" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    title={collapsed ? t(item.key) : undefined}
                    style={
                      active
                        ? {
                            backgroundColor: `${themeConfig.primary}18`,
                            color: themeConfig.primary,
                          }
                        : undefined
                    }
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      collapsed ? "justify-center" : "",
                      active
                        ? "font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                    )}
                  >
                    {item.icon}
                    {!collapsed && t(item.key)}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        {collapsed ? (
          <button
            className="mx-auto flex justify-center rounded-full border border-slate-200 dark:border-slate-800 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:block"
            onClick={() => setCollapsed(false)}
            title={t("expand")}
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        ) : (
          <>
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 px-3 py-2">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: themeConfig.primary }}
              >
                {(session.name?.[0] || "U").toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{session.name}</div>
                <div className="truncate text-[10px] text-slate-400 dark:text-slate-500">{roleLabel(session.role, lang)}</div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </button>
            <button
              className="mt-1 hidden w-full items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:flex"
              onClick={() => setCollapsed(true)}
            >
              <ChevronsLeft className="h-3.5 w-3.5" /> {t("collapse")}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 lg:pb-0 transition-colors">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-[width] duration-200 lg:block",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden" onClick={() => setOpen(false)} />}

      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[72px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 px-3 backdrop-blur sm:px-4">
          <button className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {activeItem ? t(activeItem.key) : t("appName")}
            </div>
            <div className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">{settings.name}</div>
          </div>

          <ThemeSelector />
          <QrModal
            title={t("shareWebsite")}
            caption={t("shareQrCaption")}
            trigger={
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                aria-label={t("shareWebsite")}
              >
                <QrIcon className="h-4 w-4" />
              </button>
            }
          />
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Languages className="h-4 w-4" />
            {lang === "en" ? "हिन्दी" : "English"}
          </button>
        </header>
        <main className="p-3 sm:p-5 lg:p-6">{children}</main>
      </div>


      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 lg:hidden">
        {MOBILE_PRIMARY.map((item) => {
          const active =
            item.href === "/app/dashboard" ? pathname === "/app/dashboard" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={active ? { color: themeConfig.primary } : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                active ? "font-semibold" : "text-slate-500 dark:text-slate-400"
              )}
            >
              {item.icon}
              {t(item.key)}
            </Link>
          );
        })}
        <button
          onClick={() => setOpen(true)}
          style={open ? { color: themeConfig.primary } : undefined}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
            open ? "font-semibold" : "text-slate-500 dark:text-slate-400"
          )}
        >
          <Ellipsis className="h-5 w-5" />
          {t("moreMenu")}
        </button>
      </nav>

    </div>
  );
}