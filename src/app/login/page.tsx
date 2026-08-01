"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrench, LogIn, Languages, Loader2, Globe } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Button, Input, Field, Card } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const login = useStore((s) => s.login);
  const hydrate = useStore((s) => s.hydrate);
  const { t, lang, setLang } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    if (ok) {
      await hydrate();
      router.replace("/app/dashboard");
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <Wrench className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t("appName")}</h1>
          <p className="text-sm text-slate-500">{t("tagline")}</p>
        </div>

        <Card className="p-6">
          <form onSubmit={submit} className="space-y-4">
            <Field label={t("email")} required>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
                placeholder="you@example.com"
                required
              />
            </Field>
            <Field label={t("password")} required>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
                required
              />
            </Field>
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {t("wrongCredentials")}
              </div>
            )}
            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {loading ? t("signingIn") : t("signIn")}
            </Button>
          </form>
        </Card>

        <div className="mt-4 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Globe className="h-4 w-4" />
            {t("goToWebsite")}
          </Link>
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <Languages className="h-4 w-4" />
            {lang === "en" ? "हिन्दी में देखें" : "View in English"}
          </button>
        </div>
      </div>
    </div>
  );
}
