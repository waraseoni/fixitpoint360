"use client";

import Link from "next/link";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { siteContent } from "@/components/site/siteContent";
import { SiteShell, SiteIcon } from "@/components/site/SiteShell";
import { PageHero, AmcBanner, CallBand } from "@/components/site/site-ui";

export default function ServicesPage() {
  const { lang } = useI18n();
  const c = siteContent[lang];

  return (
    <SiteShell>
      <PageHero heading={c.servicesPage.heading} sub={c.servicesPage.sub} badge={c.tagline} />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6">
          {c.services.map((s, i) => (
            <div
              key={s.id}
              id={s.id}
              className="grid gap-8 lg:grid-cols-5 lg:items-start"
            >
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25">
                    <SiteIcon name={s.icon} className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
                      0{i + 1}
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      {s.title}
                    </h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                  {s.longDesc}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/contact?service=${s.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:opacity-90"
                  >
                    {c.servicesPage.requestCta}
                    <MessageCircle className="h-4 w-4" />
                  </Link>
                  <a
                    href={`tel:+91${c.phone}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Phone className="h-4 w-4" />
                    +91 {c.phone}
                  </a>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    {c.servicesPage.whatsIncluded}
                  </h3>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {s.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 rounded-xl bg-white p-3.5 text-sm text-slate-700 ring-1 ring-slate-200"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AmcBanner />
      <CallBand />
    </SiteShell>
  );
}
