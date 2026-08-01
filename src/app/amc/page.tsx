"use client";

import Link from "next/link";
import { BadgeCheck, Check, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { siteContent } from "@/components/site/siteContent";
import { SiteShell } from "@/components/site/SiteShell";
import { PageHero, CallBand } from "@/components/site/site-ui";

export default function AmcPage() {
  const { lang } = useI18n();
  const c = siteContent[lang];

  return (
    <SiteShell>
      <PageHero heading={c.amcPage.heading} sub={c.amcPage.sub} badge={c.tagline} />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {c.plans.map((p) => (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-3xl p-7 transition-all hover:-translate-y-1 ${
                  p.popular
                    ? "bg-slate-950 text-white shadow-2xl shadow-indigo-900/30 ring-1 ring-indigo-500/50"
                    : "border border-slate-200 bg-white shadow-sm hover:shadow-xl"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-linear-to-r from-indigo-500 to-cyan-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                    <Sparkles className="h-3.5 w-3.5" />
                    {c.amcPage.popular}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <h2
                    className={`text-xl font-bold ${
                      p.popular ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {p.name}
                  </h2>
                  {p.popular && <BadgeCheck className="h-5 w-5 text-cyan-300" />}
                </div>
                <div className="mt-4 flex items-end gap-1">
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      p.popular ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {p.price}
                  </span>
                  <span
                    className={`pb-1 text-sm ${
                      p.popular ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {p.period}
                  </span>
                </div>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    p.popular ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {p.blurb}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          p.popular
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span
                        className={p.popular ? "text-slate-300" : "text-slate-600"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contact?service=${p.id}`}
                  className={`mt-7 rounded-xl px-5 py-3 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    p.popular
                      ? "bg-linear-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/30 hover:opacity-90"
                      : "border border-slate-300 text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {c.nav.contact}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {c.amcPage.whatIncluded}
              </h3>
              <ul className="mt-4 space-y-3">
                {c.amcPage.includedItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center rounded-2xl bg-slate-950 p-6 text-center">
              <h3 className="text-lg font-semibold text-white">
                {c.amcPage.customTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {c.amcPage.customText}
              </p>
              <Link
                href="/contact"
                className="mx-auto mt-5 inline-flex rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white"
              >
                {c.amcPage.customCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CallBand />
    </SiteShell>
  );
}
