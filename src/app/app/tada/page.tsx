"use client";

import { useState } from "react";
import { Plus, Trash2, CarFront } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { money, formatDate, currentMonth } from "@/lib/format";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Select,
  Field,
  Modal,
  EmptyState,
  PageTitle,
  Td,
  Th,
} from "@/components/ui";

export default function TaDaPage() {
  const { users, tada, jobs, session, addTada, deleteTada, settings } = useStore();
  const { t } = useI18n();

  const staffList = users.filter((u) => u.role === "staff" && u.status === "active");
  const [modalOpen, setModalOpen] = useState(false);
  const [month, setMonth] = useState(currentMonth());
  const [form, setForm] = useState({
    staffId: "",
    type: "travel",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    jobId: "",
  });

  if (session?.role !== "owner") {
    return (
      <div className="py-20 text-center">
        <EmptyState message={t("noRecords")} />
      </div>
    );
  }

  const records = tada
    .filter((x) => x.date.startsWith(month))
    .sort((a, b) => b.date.localeCompare(a.date));

  const byStaff = staffList.map((u) => ({
    user: u,
    total: tada.filter((x) => x.staffId === u.id && x.date.startsWith(month)).reduce((s, x) => s + x.amount, 0),
  }));

  const submit = () => {
    const amount = parseFloat(form.amount);
    if (!form.staffId || !amount || amount <= 0) return;
    addTada({
      staffId: form.staffId,
      type: form.type as "travel" | "daily_allowance" | "other",
      amount,
      date: form.date,
      description: form.description || undefined,
      jobId: form.jobId || undefined,
    });
    setModalOpen(false);
    setForm({ staffId: "", type: "travel", amount: "", date: new Date().toISOString().slice(0, 10), description: "", jobId: "" });
  };

  return (
    <div>
      <PageTitle
        title={t("taDa")}
        subtitle={t("tadaList")}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> {t("addTada")}
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {byStaff.map(({ user, total }) => (
          <Card key={user.id} className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <div className="truncate text-sm font-medium text-slate-700">{user.name}</div>
              <div className="text-lg font-bold text-slate-900">{money(total, settings)}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title={`${t("tadaList")} • ${month}`} />
        {records.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("date")}</Th>
                  <Th>{t("staff")}</Th>
                  <Th>{t("tadaType")}</Th>
                  <Th>{t("description")}</Th>
                  <Th>{t("jobNo")}</Th>
                  <Th>{t("amount")}</Th>
                  <Th>{t("actions")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((x) => {
                  const user = users.find((u) => u.id === x.staffId);
                  const job = jobs.find((j) => j.id === x.jobId);
                  return (
                    <tr key={x.id} className="hover:bg-slate-50">
                      <Td>{formatDate(x.date)}</Td>
                      <Td className="font-medium text-slate-900">{user?.name}</Td>
                      <Td>{x.type === "travel" ? t("travel") : x.type === "daily_allowance" ? t("dailyAllowance") : t("other")}</Td>
                      <Td className="max-w-[200px] truncate">{x.description || "—"}</Td>
                      <Td>{job ? `#${job.jobNo}` : "—"}</Td>
                      <Td className="font-semibold">{money(x.amount, settings)}</Td>
                      <Td>
                        <button
                          onClick={() => {
                            if (confirm(t("confirmDelete"))) deleteTada(x.id);
                          }}
                          className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t("addTada")}>
        <div className="space-y-3">
          <Field label={t("staff")} required>
            <Select value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })}>
              <option value="">—</option>
              {staffList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("tadaType")}>
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="travel">{t("travel")}</option>
                <option value="daily_allowance">{t("dailyAllowance")}</option>
                <option value="other">{t("other")}</option>
              </Select>
            </Field>
            <Field label={t("amount")} required>
              <Input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("date")}>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label={t("jobNo")}>
              <Select value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })}>
                <option value="">—</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    #{j.jobNo} - {j.title}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label={t("description")}>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={submit}>{t("save")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
