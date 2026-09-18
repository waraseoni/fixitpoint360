"use client";

import Link from "next/link";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  Smartphone,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { siteContent } from "./siteContent";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10";

export function SectionHeading({
  eyebrow,
  heading,
  sub,
  light,
}: {
  eyebrow?: string;
  heading: string;
  sub?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl font-bold tracking-tight sm:text-4xl ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {heading}
      </h2>
      {sub && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function PageHero({
  heading,
  sub,
  badge,
}: {
  heading: string;
  sub: string;
  badge?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24">
        {badge && (
          <span className="mb-4 inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            {badge}
          </span>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {heading}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          {sub}
        </p>
      </div>
    </section>
  );
}

export function CallBand() {
  const { lang } = useI18n();
  const c = siteContent[lang];
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 left-10 h-56 w-56 rounded-full bg-indigo-600/30 blur-3xl" />
            <div className="absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-cyan-500/30 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {c.ctaBand.heading}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-slate-400">
              {c.ctaBand.sub}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:+91${c.phone}`}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                <Phone className="h-4 w-4" />
                {c.ctaBand.call}
              </a>
              <a
                href={c.waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" />
                {c.ctaBand.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AmcBanner() {
  const { lang } = useI18n();
  const c = siteContent[lang];
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-indigo-500 to-cyan-500 px-6 py-12 sm:px-12 sm:py-16">
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {c.amcBanner.heading}
              </h2>
              <p className="mt-3 text-base text-indigo-100">{c.amcBanner.sub}</p>
            </div>
            <Link
              href="/amc"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5"
            >
              {c.amcBanner.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MobileRepairAd() {
  const { lang } = useI18n();
  const c = siteContent[lang];
  const ad = c.mobileRepairAd;
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-slate-950/30 blur-3xl" />
          </div>
          <div className="relative grid gap-8 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
                <Zap className="h-3.5 w-3.5 text-yellow-300" />
                {ad.badge}
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {ad.heading}{" "}
                <span className="bg-linear-to-r from-yellow-200 via-white to-emerald-100 bg-clip-text text-transparent">
                  {ad.headingAccent}
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-teal-50/90">
                {ad.sub}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {ad.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-sm text-teal-50"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-yellow-300" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition-all hover:-translate-y-0.5"
                >
                  {ad.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:+91${c.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" />
                  {ad.ctaSecondary}
                </a>
              </div>
            </div>
            <div className="relative hidden justify-center lg:flex">
              <div className="relative">
                <div className="flex h-72 w-40 flex-col items-center justify-center rounded-[2rem] border border-white/30 bg-slate-950/40 p-4 shadow-2xl backdrop-blur-sm">
                  <div className="mb-3 h-1.5 w-10 rounded-full bg-white/20" />
                  <div className="flex h-44 w-28 items-center justify-center rounded-2xl bg-linear-to-br from-slate-800 to-slate-900">
                    <div className="relative flex h-24 w-24 items-center justify-center">
                      <div className="absolute inset-0 rounded-2xl bg-white/10 blur-md" />
                      <Smartphone className="relative h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="uppercase tracking-wider">24 hr fix</span>
                  </div>
                </div>
                <div className="absolute -right-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-300 shadow-lg">
                  <Zap className="h-6 w-6 text-slate-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
