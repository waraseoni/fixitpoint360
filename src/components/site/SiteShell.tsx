"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cctv,
  Monitor,
  Printer,
  Home as HomeIcon,
  PackageSearch,
  Smartphone,
  Clock,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Menu,
  X,
  Languages,
  Wrench,
  Headset,
  BadgeCheck,
  QrCode as QrIcon,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { siteContent, type ServiceInfo } from "./siteContent";
import { QrModal } from "@/components/QrModal";

const ICONS: Record<string, typeof Cctv> = {
  cctv: Cctv,
  computer: Monitor,
  printer: Printer,
  household: HomeIcon,
  other: PackageSearch,
  clock: Clock,
  rupee: IndianRupee,
  shield: ShieldCheck,
  trending: TrendingUp,
  badge: BadgeCheck,
  headset: Headset,
  phone: Phone,
  message: MessageCircle,
  mail: Mail,
  map: MapPin,
  mobile: Smartphone,
};

export function SiteIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Wrench;
  return <Icon className={className} />;
}

const NAV_LINKS = [
  { href: "/", key: "home" as const },
  { href: "/services", key: "services" as const },
  { href: "/amc", key: "amc" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

function Logo() {
  const { lang } = useI18n();
  const c = siteContent[lang];
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
        <Wrench className="h-5 w-5 text-white" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-bold tracking-tight text-white">
          {c.brand}
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-cyan-300/80">
          {c.tagline}
        </span>
      </span>
    </Link>
  );
}

function Navbar() {
  const { lang, setLang } = useI18n();
  const c = siteContent[lang];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggleLang = () => setLang(lang === "en" ? "hi" : "en");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {c.nav[l.key]}
              </Link>
            );
          })}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <QrModal
            title={c.nav.qr}
            caption={c.nav.qrShare}
            trigger={
              <button
                className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
                aria-label={c.nav.qr}
              >
                <QrIcon className="h-4 w-4" />
              </button>
            }
          />
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
          >
            <Languages className="h-4 w-4" />
            {lang === "en" ? "हिंदी" : "EN"}
          </button>
          <Link
            href="/login"
            className="rounded-lg bg-linear-to-r from-indigo-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-opacity hover:opacity-90"
          >
            {c.nav.login}
          </Link>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <QrModal
            title={c.nav.qr}
            caption={c.nav.qrShare}
            trigger={
              <button
                className="flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-2 text-sm font-medium text-slate-200"
                aria-label={c.nav.qr}
              >
                <QrIcon className="h-4 w-4" />
              </button>
            }
          />
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-2 text-sm font-medium text-slate-200"
          >
            <Languages className="h-4 w-4" />
            {lang === "en" ? "हिंदी" : "EN"}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg border border-white/15 p-2 text-white"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-white/10 bg-slate-950 px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {c.nav[l.key]}
                </Link>
              );
            })}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-linear-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              {c.nav.login}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { lang } = useI18n();
  const c = siteContent[lang];
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            {c.footer.aboutText}
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            {c.footer.openApp}
          </Link>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            {c.footer.quickLinks}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-slate-400 transition-colors hover:text-cyan-300"
                >
                  {c.nav[l.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            {c.footer.ourServices}
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {c.services.map((s) => (
              <li key={s.id}>
                <Link
                  href="/services"
                  className="text-slate-400 transition-colors hover:text-cyan-300"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
            {c.footer.contactUs}
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              <a href={`tel:+91${c.phone}`} className="hover:text-cyan-300">
                +91 {c.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              <a
                href={`mailto:${c.email}`}
                className="break-all hover:text-cyan-300"
              >
                {c.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              <span className="text-slate-400">{c.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              <span className="text-slate-400">{c.footer.hoursValue}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {c.brand}. {c.footer.rights}
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function serviceById(
  list: ServiceInfo[],
  id: string
): ServiceInfo | undefined {
  return list.find((s) => s.id === id);
}
