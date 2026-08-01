"use client";

import Link from "next/link";
import { ArrowRight, Quote, Target } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { siteContent } from "@/components/site/siteContent";
import { SiteShell, SiteIcon } from "@/components/site/SiteShell";
import { PageHero, SectionHeading } from "@/components/site/site-ui";

export default function AboutPage() {
  const { lang } = useI18n();
  const c = siteContent[lang];

  return (
    <SiteShell>
      <PageHero heading={c.aboutPage.heading} sub={c.aboutPage.sub} badge={c.tagline} />

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {c.aboutPage.storyHeading}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                {c.aboutPage.storyText}
              </p>
              <div className="mt-8 flex items-start gap-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <Quote className="mt-1 h-8 w-8 shrink-0 text-indigo-500" />
                <p className="text-base font-medium leading-relaxed text-slate-700">
                  {c.aboutPage.missionText}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.hero.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
                >
                  <p className="text-3xl font-bold text-indigo-600">{s.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
              <div className="flex flex-col justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-500 p-6 text-center sm:col-span-2">
                <Target className="mx-auto h-8 w-8 text-white/90" />
                <p className="mt-3 text-lg font-bold text-white">
                  {c.aboutPage.missionHeading}
                </p>
                <p className="mt-1 text-sm text-indigo-100">{c.aboutPage.missionText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading heading={c.aboutPage.valuesHeading} sub={c.aboutPage.valuesSub} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.aboutPage.values.map((v) => (
              <div
                key={v.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-110">
                  <SiteIcon name={v.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-center sm:py-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-16 right-1/4 h-56 w-56 rounded-full bg-indigo-600/30 blur-3xl" />
              <div className="absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-cyan-500/25 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                {c.aboutPage.ctaHeading}
              </h2>
              <p className="mt-3 text-slate-400">{c.aboutPage.ctaText}</p>
              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                {c.aboutPage.ctaBtn}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
