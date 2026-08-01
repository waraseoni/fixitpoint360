"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone, Plus, Trash2 } from "lucide-react";
import { useStore, getBalance } from "@/lib/store";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { CLIENT_TYPES, SERVICE_CATEGORIES, PAYMENT_MODES } from "@/lib/constants";
import { money, formatDate, waLink } from "@/lib/format";
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
  Badge,
  Td,
  Th,
} from "@/components/ui";
import { JobStatusBadge, PaymentBadge } from "@/components/StatusBadge";
import type { LedgerEntry } from "@/lib/types";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { clients, jobs, amcs, ledger, settings, session, addLedgerEntry, deleteLedgerEntry } = useStore();
  const { t, lang } = useI18n();

  const client = clients.find((c) => c.id === id);
  const [entryOpen, setEntryOpen] = useState(false);
  const [entry, setEntry] = useState({ type: "debit", amount: "", mode: "cash", description: "", date: new Date().toISOString().slice(0, 10) });

  if (!client) {
    return (
      <div className="py-20 text-center">
        <EmptyState message={t("noRecords")} />
        <Link href="/app/clients" className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600">
          <ArrowLeft className="h-4 w-4" /> {t("clients")}
        </Link>
      </div>
    );
  }

  const clientLedger = [...ledger]
    .filter((e) => e.clientId === client.id)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
  const balance = getBalance(clientLedger);
  const entriesWithBalance = clientLedger.reduce((acc, e) => {
    const prev = acc.length ? acc[acc.length - 1].balance : 0;
    acc.push({ ...e, balance: prev + (e.type === "debit" ? e.amount : -e.amount) });
    return acc;
  }, [] as (LedgerEntry & { balance: number })[]);
  const clientJobs = jobs.filter((j) => j.clientId === client.id).sort((a, b) => b.jobNo - a.jobNo);
  const clientAmcs = amcs.filter((a) => a.clientId === client.id);

  const submitEntry = () => {
    const amount = parseFloat(entry.amount);
    if (!amount || amount <= 0) return;
    addLedgerEntry({
      clientId: client.id,
      date: entry.date,
      type: entry.type as "debit" | "credit",
      amount,
      mode: entry.mode as LedgerEntry["mode"],
      description: entry.description || (entry.type === "debit" ? "Debit" : "Credit"),
    });
    setEntryOpen(false);
    setEntry({ type: "debit", amount: "", mode: "cash", description: "", date: new Date().toISOString().slice(0, 10) });
  };

  return (
    <div>
      <Link href="/app/clients" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> {t("clients")}
      </Link>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{client.name}</h1>
          <p className="text-sm text-slate-500">
            {CLIENT_TYPES.find((x) => x.value === client.type)?.labelEn}
            {client.city ? ` • ${client.city}` : ""}
            {client.phone ? ` • ${client.phone}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={waLink(client.phone, `Hello ${client.name}! This is ${settings.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" /> {t("whatsapp")}
          </a>
          <a href={`tel:${client.phone}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Phone className="h-4 w-4" /> {t("call")}
          </a>
          {session && canManage(session.role) && (
            <Button variant="outline" onClick={() => setEntryOpen(true)}>
              <Plus className="h-4 w-4" /> {t("addLedgerEntry")}
            </Button>
          )}
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs text-slate-500">{t("balance")}</div>
          <div className={`text-lg font-bold ${balance > 0 ? "text-red-600" : balance < 0 ? "text-emerald-600" : "text-slate-900"}`}>
            {money(balance, settings)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">{t("jobs")}</div>
          <div className="text-lg font-bold text-slate-900">{clientJobs.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">{t("amc")}</div>
          <div className="text-lg font-bold text-slate-900">
            {clientAmcs.filter((a) => a.status === "active").length} / {clientAmcs.length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">{t("emailLabel")}</div>
          <div className="truncate text-sm font-medium text-slate-700">{client.email || "—"}</div>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader
          title={`${t("ledgerOf")} ${client.name}`}
          subtitle={`${t("debit")}: ${clientLedger.filter((e) => e.type === "debit").reduce((s, e) => s + e.amount, 0)} | ${t("credit")}: ${clientLedger.filter((e) => e.type === "credit").reduce((s, e) => s + e.amount, 0)}`}
        />
        {clientLedger.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("date")}</Th>
                  <Th>{t("description")}</Th>
                  <Th>{t("mode")}</Th>
                  <Th>{t("debit")}</Th>
                  <Th>{t("credit")}</Th>
                  <Th>{t("balance")}</Th>
                  {session && canManage(session.role) && <Th>{t("actions")}</Th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entriesWithBalance.map((e) => {
                  return (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <Td>{formatDate(e.date)}</Td>
                      <Td>
                        <div className="text-slate-800">{e.description}</div>
                        {e.refId && (
                          <Link href={`/app/jobs/${e.refId}`} className="text-xs text-blue-600 hover:underline">
                            {t("jobNo")}
                            {jobs.find((j) => j.id === e.refId)?.jobNo}
                          </Link>
                        )}
                      </Td>
                      <Td>{PAYMENT_MODES.find((m) => m.value === e.mode)?.labelEn || e.mode}</Td>
                      <Td className="text-red-600">{e.type === "debit" ? money(e.amount, settings) : "—"}</Td>
                      <Td className="text-emerald-600">{e.type === "credit" ? money(e.amount, settings) : "—"}</Td>
                      <Td className="font-medium">{money(e.balance, settings)}</Td>
                      {session && canManage(session.role) && (
                        <Td>
                          <button
                            onClick={() => {
                              if (confirm(t("confirmDelete"))) deleteLedgerEntry(e.id);
                            }}
                            className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </Td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="mb-6">
        <CardHeader
          title={t("jobs")}
          action={
            <Link href={`/app/jobs?client=${client.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
              <Plus className="h-3.5 w-3.5" /> {t("addJob")}
            </Link>
          }
        />
        {clientJobs.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("jobNo")}</Th>
                  <Th>{t("jobTitle")}</Th>
                  <Th>{t("category")}</Th>
                  <Th>{t("status")}</Th>
                  <Th>{t("charges")}</Th>
                  <Th>{t("paymentStatus")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientJobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <Td className="font-medium text-slate-900">
                      <Link href={`/app/jobs/${j.id}`} className="text-blue-600 hover:underline">
                        #{j.jobNo}
                      </Link>
                    </Td>
                    <Td className="max-w-[220px] truncate">{j.title}</Td>
                    <Td>{categoryLabel(SERVICE_CATEGORIES.find((c) => c.value === j.category), lang)}</Td>
                    <Td>
                      <JobStatusBadge value={j.status} />
                    </Td>
                    <Td>{money(j.charges, settings)}</Td>
                    <Td>
                      <PaymentBadge value={j.paymentStatus} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title={t("amc")} />
        {clientAmcs.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("planName")}</Th>
                  <Th>{t("category")}</Th>
                  <Th>{t("amount")}</Th>
                  <Th>{t("startDate")}</Th>
                  <Th>{t("endDate")}</Th>
                  <Th>{t("status")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientAmcs.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <Td className="font-medium text-slate-900">{a.planName}</Td>
                    <Td>{categoryLabel(SERVICE_CATEGORIES.find((c) => c.value === a.category), lang)}</Td>
                    <Td>{money(a.amount, settings)}</Td>
                    <Td>{formatDate(a.startDate)}</Td>
                    <Td>{formatDate(a.endDate)}</Td>
                    <Td>
                      <Badge tone={a.status === "active" ? "green" : a.status === "expired" ? "red" : "slate"}>
                        {a.status === "active" ? t("active") : a.status === "expired" ? t("expired") : t("cancelled")}
                      </Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={entryOpen} onClose={() => setEntryOpen(false)} title={t("addLedgerEntry")}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("entryType")}>
              <Select value={entry.type} onChange={(e) => setEntry({ ...entry, type: e.target.value })}>
                <option value="debit">{t("debit")}</option>
                <option value="credit">{t("credit")}</option>
              </Select>
            </Field>
            <Field label={t("date")}>
              <Input type="date" value={entry.date} onChange={(e) => setEntry({ ...entry, date: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("amount")} required>
              <Input type="number" min="0" value={entry.amount} onChange={(e) => setEntry({ ...entry, amount: e.target.value })} />
            </Field>
            <Field label={t("mode")}>
              <Select value={entry.mode} onChange={(e) => setEntry({ ...entry, mode: e.target.value })}>
                {PAYMENT_MODES.filter((m) => m.value !== "pending").map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.labelEn}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label={t("description")}>
            <Input value={entry.description} onChange={(e) => setEntry({ ...entry, description: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setEntryOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={submitEntry}>{t("save")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
