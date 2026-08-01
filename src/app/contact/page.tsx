"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { siteContent } from "@/components/site/siteContent";
import { SiteShell, SiteIcon } from "@/components/site/SiteShell";
import { PageHero } from "@/components/site/site-ui";

function ContactForm() {
  const { lang } = useI18n();
  const c = siteContent[lang];
  const searchParams = useSearchParams();
  const preselect = searchParams.get("service") ?? "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(preselect);
  const [message, setMessage] = useState("");

  const options = [
    ...c.services.map((s) => ({ value: s.id, label: s.title })),
    ...c.plans.map((p) => ({ value: p.id, label: `${p.name} ${c.amcPage.heading}` })),
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const label =
      options.find((o) => o.value === service)?.label ?? service;
    const text = [
      `${c.contactPage.name}: ${name}`,
      `${c.contactPage.phoneField}: ${phone}`,
      `${c.contactPage.service}: ${label}`,
      `${c.contactPage.message}: ${message}`,
    ].join("\n");
    window.open(`${c.waLink}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const inputCls =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
          {c.contactPage.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <SiteIcon name={card.icon} className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {card.title}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {card.value}
                  </p>
                </div>
              </div>
              <p className="mt-2.5 text-sm text-slate-500">{card.sub}</p>
            </div>
          ))}
          <div className="rounded-2xl bg-slate-950 p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Clock className="h-5 w-5 text-cyan-300" />
              </div>
              <p className="text-sm font-semibold">{c.footer.hours}</p>
            </div>
            <p className="mt-2.5 text-sm text-slate-400">{c.footer.hoursValue}</p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {c.contactPage.formHeading}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{c.contactPage.formSub}</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {c.contactPage.name} *
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                    placeholder={c.contactPage.name}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {c.contactPage.phoneField} *
                  </label>
                  <input
                    required
                    type="tel"
                    pattern="[0-9+\- ]{10,15}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputCls}
                    placeholder="98765 43210"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {c.contactPage.service} *
                </label>
                <select
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={inputCls}
                >
                  <option value="" disabled>
                    {c.contactPage.chooseService}
                  </option>
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {c.contactPage.message}
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={inputCls}
                  placeholder={c.contactPage.messagePlaceholder}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                <Send className="h-4 w-4" />
                {c.contactPage.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { lang } = useI18n();
  const c = siteContent[lang];
  return (
    <SiteShell>
      <PageHero heading={c.contactPage.heading} sub={c.contactPage.sub} badge={c.tagline} />
      <section className="bg-slate-50 py-16 sm:py-20">
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </section>
    </SiteShell>
  );
}
