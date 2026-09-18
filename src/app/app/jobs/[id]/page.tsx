"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, Banknote, FileText, ShieldCheck } from "lucide-react";
import { useStore, getBalance } from "@/lib/store";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { SERVICE_CATEGORIES, JOB_STATUSES, PRIORITIES, PAYMENT_MODES } from "@/lib/constants";
import { money, formatDate, today } from "@/lib/format";
import { canManage } from "@/lib/roles";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Select,
  Field,
  Modal,
  EmptyState,
  Td,
  Th,
} from "@/components/ui";
import { JobStatusBadge, PaymentBadge, PriorityBadge } from "@/components/StatusBadge";
import type { Job } from "@/lib/types";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    jobs,
    clients,
    users,
    ledger,
    settings,
    session,
    updateJob,
    recordJobPayment,
  } = useStore();
  const { t, lang } = useI18n();

  const job = jobs.find((j) => j.id === id);
  const [payOpen, setPayOpen] = useState(false);
  const [pay, setPay] = useState({ amount: "", mode: "cash", date: today() });

  if (!job) {
    return (
      <div className="py-20 text-center">
        <EmptyState message={t("noRecords")} />
        <Link href="/app/jobs" className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600">
          <ArrowLeft className="h-4 w-4" /> {t("jobs")}
        </Link>
      </div>
    );
  }

  const client = clients.find((c) => c.id === job.clientId);
  const tech = users.find((u) => u.id === job.assignedTo);
  const jobLedger = ledger.filter((e) => e.refId === job.id);
  const paidTotal = jobLedger.filter((e) => e.type === "credit").reduce((s, e) => s + e.amount, 0);
  const clientBalance = getBalance(ledger.filter((e) => e.clientId === job.clientId));

  const doMarkCompleted = () => {
    updateJob(job.id, { status: "completed", completedDate: today() });
  };

  const submitPayment = () => {
    const amount = parseFloat(pay.amount);
    if (!amount || amount <= 0) return;
    recordJobPayment(job.id, amount, pay.mode as Job["paymentMode"], pay.date);
    setPayOpen(false);
    setPay({ amount: "", mode: "cash", date: today() });
  };

  const info = [
    { label: t("clientRef"), value: client ? client.name : "—", href: client ? `/app/clients/${client.id}` : undefined },
    { label: t("serviceCategory"), value: categoryLabel(SERVICE_CATEGORIES.find((c) => c.value === job.category), lang) },
    { label: t("status"), value: JOB_STATUSES.find((s) => s.value === job.status)?.labelEn || job.status },
    { label: t("priority"), value: PRIORITIES.find((p) => p.value === job.priority)?.labelEn || job.priority },
    { label: t("assignedTo"), value: tech?.name || "—" },
    { label: t("scheduledDate"), value: formatDate(job.scheduledDate) },
    { label: t("completedOn"), value: formatDate(job.completedDate) },
    { label: t("createdOn"), value: formatDate(job.createdAt) },
  ];

  return (
    <div>
      <Link href="/app/jobs" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> {t("jobs")}
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {t("jobNo")}
            {job.jobNo} — {job.title}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <JobStatusBadge value={job.status} />
            <PriorityBadge value={job.priority} />
            <PaymentBadge value={job.paymentStatus} />
          </div>
        </div>
        {session && canManage(session.role) && (
          <div className="flex flex-wrap items-center gap-2">
            {job.status === "in_progress" && (
              <Button variant="success" onClick={doMarkCompleted}>
                <CheckCircle2 className="h-4 w-4" /> {t("markCompleted")}
              </Button>
            )}
            {job.status !== "cancelled" && (
              <Button variant="outline" onClick={() => updateJob(job.id, { status: "cancelled" })}>
                <XCircle className="h-4 w-4" /> {t("cancelled")}
              </Button>
            )}
            {job.paymentStatus !== "paid" && job.status !== "cancelled" && (
              <Button onClick={() => setPayOpen(true)}>
                <Banknote className="h-4 w-4" /> {t("recordPayment")}
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push(`/app/documents?new=invoice&client=${job.clientId}&job=${job.id}`)}>
              <FileText className="h-4 w-4" /> {t("makeInvoice")}
            </Button>
            <Button variant="outline" onClick={() => router.push(`/app/documents?new=quotation&client=${job.clientId}&job=${job.id}`)}>
              <ShieldCheck className="h-4 w-4" /> {t("makeQuotation")}
            </Button>
          </div>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs text-slate-500">{t("charges")}</div>
          <div className="text-lg font-bold text-slate-900">{money(job.charges, settings)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">{t("materialCost")}</div>
          <div className="text-lg font-bold text-slate-900">{money(job.materialCost, settings)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">{t("advance")}</div>
          <div className="text-lg font-bold text-slate-900">{money(job.advance, settings)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">{t("balance")}</div>
          <div className={`text-lg font-bold ${job.charges - paidTotal > 0 ? "text-red-600" : "text-emerald-600"}`}>
            {money(job.charges - paidTotal, settings)}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={t("jobDetail")} />
          <div className="p-4">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {info.map((row) => (
                <div key={row.label} className="flex flex-col">
                  <dt className="text-xs text-slate-500">{row.label}</dt>
                  <dd className="text-sm font-medium text-slate-800">
                    {row.href ? (
                      <Link href={row.href} className="text-blue-600 hover:underline">
                        {row.value}
                      </Link>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            {job.description && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3">
                <div className="text-xs font-medium text-slate-500">{t("description")}</div>
                <p className="mt-1 text-sm text-slate-700">{job.description}</p>
              </div>
            )}
            {job.notes && (
              <div className="mt-3 rounded-lg bg-amber-50 p-3">
                <div className="text-xs font-medium text-amber-600">{t("notes")}</div>
                <p className="mt-1 text-sm text-amber-800">{job.notes}</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title={`${t("ledgerOf")} ${client?.name || ""}`} />
          <div className="p-4">
            {jobLedger.length === 0 ? (
              <p className="text-sm text-slate-500">{t("noRecords")}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <Th>{t("date")}</Th>
                      <Th>{t("description")}</Th>
                      <Th>{t("amount")}</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobLedger.map((e) => (
                      <tr key={e.id}>
                        <Td>{formatDate(e.date)}</Td>
                        <Td className="max-w-[160px] truncate">{e.description}</Td>
                        <Td className={e.type === "debit" ? "text-red-600" : "text-emerald-600"}>
                          {e.type === "debit" ? "-" : "+"}
                          {money(e.amount, settings)}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-xs font-medium text-slate-500">{t("balance")}</span>
              <span className={`text-sm font-bold ${clientBalance > 0 ? "text-red-600" : "text-emerald-600"}`}>
                {money(clientBalance, settings)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Modal open={payOpen} onClose={() => setPayOpen(false)} title={t("recordPayment")}>
        <div className="space-y-3">
          <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
            {t("charges")}: {money(job.charges, settings)} • {t("balance")}: {money(job.charges - paidTotal, settings)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("amount")} required>
              <Input type="number" min="0" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value })} />
            </Field>
            <Field label={t("mode")}>
              <Select value={pay.mode} onChange={(e) => setPay({ ...pay, mode: e.target.value })}>
                {PAYMENT_MODES.filter((m) => m.value !== "pending").map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.labelEn}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label={t("date")}>
            <Input type="date" value={pay.date} onChange={(e) => setPay({ ...pay, date: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setPayOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={submitPayment}>{t("save")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
