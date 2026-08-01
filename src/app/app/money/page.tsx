"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Plus, Pencil, Trash2, ArrowLeftRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_MODES } from "@/lib/constants";
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
  Badge,
} from "@/components/ui";
import type { Transaction } from "@/lib/types";

export default function MoneyPage() {
  const { transactions, clients, session, addTransaction, updateTransaction, deleteTransaction, settings } = useStore();
  const { t } = useI18n();

  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("income");
  const [month, setMonth] = useState(currentMonth());
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    mode: "cash",
    clientId: "",
    description: "",
  });

  if (session?.role !== "owner") {
    return (
      <div className="py-20 text-center">
        <EmptyState message={t("noRecords")} />
      </div>
    );
  }

  const monthTx = transactions.filter((x) => x.date.startsWith(month));
  const income = monthTx.filter((x) => x.type === "income").reduce((s, x) => s + x.amount, 0);
  const expense = monthTx.filter((x) => x.type === "expense").reduce((s, x) => s + x.amount, 0);
  const sorted = [...monthTx].sort((a, b) => b.date.localeCompare(a.date));

  const openAdd = (t2: "income" | "expense") => {
    setType(t2);
    setEditing(null);
    setForm({ category: t2 === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0], amount: "", date: new Date().toISOString().slice(0, 10), mode: "cash", clientId: "", description: "" });
    setModalOpen(true);
  };

  const openEdit = (tx: Transaction) => {
    setType(tx.type);
    setEditing(tx);
    setForm({
      category: tx.category,
      amount: String(tx.amount),
      date: tx.date,
      mode: tx.mode,
      clientId: tx.clientId || "",
      description: tx.description || "",
    });
    setModalOpen(true);
  };

  const submit = () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return;
    const payload = {
      type,
      category: form.category,
      amount,
      date: form.date,
      mode: form.mode as Transaction["mode"],
      clientId: form.clientId || undefined,
      description: form.description || undefined,
    };
    if (editing) updateTransaction(editing.id, payload);
    else addTransaction(payload);
    setModalOpen(false);
  };

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div>
      <PageTitle
        title={t("money")}
        subtitle={t("cashbook")}
        action={
          <div className="flex gap-2">
            <Button variant="success" onClick={() => openAdd("income")}>
              <Plus className="h-4 w-4" /> {t("addIncome")}
            </Button>
            <Button variant="danger" onClick={() => openAdd("expense")}>
              <Plus className="h-4 w-4" /> {t("addExpense")}
            </Button>
          </div>
        }
      />

      <div className="mb-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">{t("income")}</div>
            <div className="text-lg font-bold text-emerald-600">{money(income, settings)}</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">{t("expense")}</div>
            <div className="text-lg font-bold text-red-600">{money(expense, settings)}</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">{t("net")}</div>
            <div className={`text-lg font-bold ${income - expense >= 0 ? "text-slate-900" : "text-red-600"}`}>
              {money(income - expense, settings)}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title={`${t("transactionList")} • ${month}`} />
        {sorted.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("date")}</Th>
                  <Th>{t("type")}</Th>
                  <Th>{t("category")}</Th>
                  <Th>{t("description")}</Th>
                  <Th>{t("clientRef")}</Th>
                  <Th>{t("mode")}</Th>
                  <Th>{t("amount")}</Th>
                  <Th>{t("actions")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((x) => {
                  const client = x.clientId ? clients.find((c) => c.id === x.clientId) : undefined;
                  return (
                    <tr key={x.id} className="hover:bg-slate-50">
                      <Td>{formatDate(x.date)}</Td>
                      <Td>
                        <Badge tone={x.type === "income" ? "green" : "red"}>
                          {x.type === "income" ? t("income") : t("expense")}
                        </Badge>
                      </Td>
                      <Td>{x.category}</Td>
                      <Td className="max-w-[220px] truncate">{x.description || "—"}</Td>
                      <Td>{client?.name || "—"}</Td>
                      <Td>{PAYMENT_MODES.find((m) => m.value === x.mode)?.labelEn || x.mode}</Td>
                      <Td className={`font-semibold ${x.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
                        {x.type === "income" ? "+" : "-"}
                        {money(x.amount, settings)}
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(x)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(t("confirmDelete"))) deleteTransaction(x.id);
                            }}
                            className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t("edit") : type === "income" ? t("addIncome") : t("addExpense")}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("type")}>
              <Select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
                <option value="income">{t("income")}</option>
                <option value="expense">{t("expense")}</option>
              </Select>
            </Field>
            <Field label={t("category")}>
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("amount")} required>
              <Input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </Field>
            <Field label={t("mode")}>
              <Select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                {PAYMENT_MODES.filter((m) => m.value !== "pending").map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.labelEn}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("date")}>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label={t("clientRef")}>
              <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                <option value="">—</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
