"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { money, formatDate } from "@/lib/format";
import {
  Button,
  Card,
  Input,
  Select,
  Field,
  Modal,
  EmptyState,
  PageTitle,
  Badge,
} from "@/components/ui";
import type { AMC } from "@/lib/types";

const CYCLES = [
  { value: "monthly", en: "Monthly", hi: "मासिक" },
  { value: "quarterly", en: "Quarterly", hi: "त्रैमासिक" },
  { value: "half_yearly", en: "Half Yearly", hi: "अर्धवार्षिक" },
  { value: "yearly", en: "Yearly", hi: "वार्षिक" },
];

const emptyForm = {
  clientId: "",
  category: "cctv" as AMC["category"],
  planName: "",
  amount: "",
  billingCycle: "monthly" as AMC["billingCycle"],
  startDate: "",
  endDate: "",
  status: "active" as AMC["status"],
  notes: "",
};

export default function AmcPage() {
  const { amcs, clients, settings, session, addAMC, updateAMC, deleteAMC } = useStore();
  const { t, lang } = useI18n();
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AMC | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (a: AMC) => {
    setEditing(a);
    setForm({
      clientId: a.clientId,
      category: a.category,
      planName: a.planName,
      amount: String(a.amount),
      billingCycle: a.billingCycle,
      startDate: a.startDate || "",
      endDate: a.endDate || "",
      status: a.status,
      notes: a.notes || "",
    });
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.clientId || !form.planName) return;
    const payload = {
      ...form,
      amount: parseFloat(form.amount) || 0,
      notes: form.notes || undefined,
    };
    if (editing) updateAMC(editing.id, payload);
    else addAMC(payload);
    setModalOpen(false);
  };

  const filtered = amcs.filter((a) => statusFilter === "all" || a.status === statusFilter);

  return (
    <div>
      <PageTitle
        title={t("amcList")}
        subtitle={`${amcs.filter((a) => a.status === "active").length} ${t("active").toLowerCase()}`}
        action={
          session?.role === "owner" && (
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4" />
              {t("addAMC")}
            </Button>
          )
        }
      />

      <div className="mb-4 flex gap-3">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44">
          <option value="all">{t("all")} {t("status")}</option>
          <option value="active">{t("active")}</option>
          <option value="expired">{t("expired")}</option>
          <option value="cancelled">{t("cancelled")}</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState message={t("noRecords")} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => {
            const client = clients.find((c) => c.id === a.clientId);
            const active = a.status === "active";
            return (
              <Card key={a.id} className="flex flex-col p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <Badge tone={active ? "green" : a.status === "expired" ? "red" : "slate"}>
                    {a.status === "active" ? t("active") : a.status === "expired" ? t("expired") : t("cancelled")}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{a.planName}</h3>
                {client && (
                  <Link href={`/app/clients/${client.id}`} className="text-xs text-blue-600 hover:underline">
                    {client.name}
                  </Link>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {categoryLabel(SERVICE_CATEGORIES.find((c) => c.value === a.category), lang)}
                </p>
                <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{money(a.amount, settings)}</div>
                    <div className="text-xs text-slate-500">
                      /{CYCLES.find((c) => c.value === a.billingCycle)?.en}
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div>{formatDate(a.startDate)}</div>
                    <div>→ {formatDate(a.endDate)}</div>
                  </div>
                </div>
                {a.notes && <p className="mt-2 text-xs text-slate-400">{a.notes}</p>}
                {session?.role === "owner" && (
                  <div className="mt-3 flex gap-1 border-t border-slate-100 pt-2">
                    <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => openEdit(a)}>
                      <Pencil className="h-3.5 w-3.5" /> {t("edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-xs text-red-600"
                      onClick={() => {
                        if (confirm(t("confirmDelete"))) deleteAMC(a.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> {t("delete")}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t("editAMC") : t("addAMC")} wide>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label={t("clientRef")} required>
            <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">—</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("serviceCategory")}>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as AMC["category"] })}>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {lang === "hi" ? c.labelHi : c.labelEn}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("planName")} required>
            <Input value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} required />
          </Field>
          <Field label={t("amount")} required>
            <Input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </Field>
          <Field label={t("billingCycle")}>
            <Select value={form.billingCycle} onChange={(e) => setForm({ ...form, billingCycle: e.target.value as AMC["billingCycle"] })}>
              {CYCLES.map((c) => (
                <option key={c.value} value={c.value}>
                  {lang === "hi" ? c.hi : c.en}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("status")}>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AMC["status"] })}>
              <option value="active">{t("active")}</option>
              <option value="expired">{t("expired")}</option>
              <option value="cancelled">{t("cancelled")}</option>
            </Select>
          </Field>
          <Field label={t("startDate")}>
            <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </Field>
          <Field label={t("endDate")}>
            <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label={t("notes")}>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={submit}>{t("save")}</Button>
        </div>
      </Modal>
    </div>
  );
}
