"use client";

import { useState } from "react";
import { Save, RefreshCcw, Building2, Languages, Sun, Moon, Laptop, Palette, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { useTheme, COLOR_OPTIONS, type ThemeMode } from "@/lib/theme";
import { roleLabel } from "@/lib/roles";
import { Button, Card, CardHeader, Input, Field, PageTitle, EmptyState, cn } from "@/components/ui";

export default function SettingsPage() {
  const { settings, session, updateSettings, resetDB } = useStore();
  const { t, lang, setLang } = useI18n();
  const { mode, resolvedMode, color, setMode, setColor } = useTheme();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  if (session?.role !== "owner") {
    return (
      <div className="py-20 text-center">
        <EmptyState message={t("noRecords")} />
      </div>
    );
  }

  const save = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const modeIcons = {
    light: Sun,
    dark: Moon,
    system: Laptop,
  };

  return (
    <div>
      <PageTitle title={t("settings")} subtitle={t("firmInfo")} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={t("firmInfo")}
            action={<Building2 className="h-4 w-4 text-slate-400" />}
          />
          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
            <Field label={t("firmName")}>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label={t("firmTagline")}>
              <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </Field>
            <Field label={t("contactNumber")}>
              <Input value={form.contactNo} onChange={(e) => setForm({ ...form, contactNo: e.target.value })} />
            </Field>
            <Field label={t("emailLabel")}>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label={t("firmAddress")}>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </Field>
            </div>
            <Field label={t("gstin")}>
              <Input value={form.gstin || ""} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
            </Field>
            <Field label={t("currency")}>
              <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </Field>
            <div className="sm:col-span-2 flex justify-end">
              <Button onClick={save}>
                <Save className="h-4 w-4" /> {saved ? t("saved") : t("saveSettings")}
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader

              title={t("appearance")}
              subtitle={t("themeSubtitle")}
              action={
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Palette className="h-4 w-4" />
                  <span className="capitalize">({resolvedMode})</span>
                </div>
              }
            />
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("themeMode")}
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {(["light", "system", "dark"] as ThemeMode[]).map((m) => {
                    const Icon = modeIcons[m];
                    const active = mode === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition-all",
                          active
                            ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-xs"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{t(m === "light" ? "modeLight" : m === "dark" ? "modeDark" : "modeSystem")}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("themeColor")}
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = color === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setColor(c.id)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg border p-2 text-left text-xs transition-all",
                          isSelected
                            ? "border-slate-900 dark:border-slate-100 bg-slate-100/90 dark:bg-slate-800 font-semibold shadow-xs"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white shadow-xs"
                          style={{ backgroundColor: c.primary }}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </span>
                        <span className="truncate">{c.name[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title={t("language")} />
            <div className="flex gap-2 p-4">
              <Button variant={lang === "en" ? "primary" : "outline"} onClick={() => setLang("en")}>
                <Languages className="h-4 w-4" /> English
              </Button>
              <Button variant={lang === "hi" ? "primary" : "outline"} onClick={() => setLang("hi")}>
                <Languages className="h-4 w-4" /> हिन्दी
              </Button>
            </div>
          </Card>


          <Card>
            <CardHeader title={t("dangerZone")} />
            <div className="p-4">
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm(t("confirmReset"))) {
                    resetDB();
                    setForm(useStore.getState().settings);
                  }
                }}
              >
                <RefreshCcw className="h-4 w-4" /> {t("resetData")}
              </Button>
              <p className="mt-2 text-xs text-slate-400">
                Owner: {settings.email} • {settings.contactNo}
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title={t("profile")} />
            <div className="p-4">
              <p className="text-sm text-slate-600">
                {session.name} ({roleLabel(session.role, lang)}) — {session.email}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
