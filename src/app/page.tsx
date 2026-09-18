"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { siteContent } from "@/components/site/siteContent";
import {
  SiteShell,
  SiteIcon,
  serviceById,
} from "@/components/site/SiteShell";
import { btnGhost, btnPrimary, SectionHeading, AmcBanner, CallBand, MobileRepairAd } from "@/components/site/site-ui";

export default function HomePage() {
  const { lang } = useI18n();
  const c = siteContent[lang];

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />
          <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.6)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 text-center sm:px-6 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            {c.hero.badge}
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            {c.hero.title}{" "}
            <span className="bg-linear-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              {c.hero.titleAccent}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {c.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/services" className={btnPrimary}>
              {c.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/amc" className={btnGhost}>
              {c.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200 lg:grid-cols-4">
          {c.hero.stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 bg-white px-6 py-8 text-center"
            >
              <span className="text-3xl font-bold tracking-tight text-slate-900">
                {s.value}
              </span>
              <span className="text-sm text-slate-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <MobileRepairAd />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Services"
            heading={c.sectionServices.heading}
            sub={c.sectionServices.sub}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.services.map((s) => {
              const svc = serviceById(c.services, s.id)!;
              return (
                <Link
                  key={s.id}
                  href="/services"
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
                    <SiteIcon name={svc.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                    {s.desc}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                    {c.nav.services}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
            <div className="flex flex-col justify-center rounded-2xl bg-slate-950 p-6 text-center sm:col-span-2 lg:col-span-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck className="h-6 w-6 text-cyan-300" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {c.amcBanner.heading}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                {c.amcBanner.sub}
              </p>
              <Link
                href="/amc"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
              >
                {c.amcBanner.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading heading={c.why.heading} sub={c.why.sub} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.why.items.map((w) => (
              <div
                key={w.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <SiteIcon name={w.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{w.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {w.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AmcBanner />
      <CallBand />
    </SiteShell>
  );
}
