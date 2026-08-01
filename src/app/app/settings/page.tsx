"use client";

import { useState } from "react";
import { Save, RefreshCcw, Building2, Languages } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Button, Card, CardHeader, Input, Field, PageTitle, EmptyState } from "@/components/ui";

export default function SettingsPage() {
  const { settings, session, updateSettings, resetDB } = useStore();
  const { t, lang, setLang } = useI18n();
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
                {session.name} ({session.role}) — {session.email}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
