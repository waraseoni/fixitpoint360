"use client";

import Link from "next/link";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
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
