"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpenText, ArrowRight } from "lucide-react";
import { useStore, getBalance } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { money } from "@/lib/format";
import {
  Card,
  CardHeader,
  SearchBox,
  EmptyState,
  PageTitle,
  Badge,
  Td,
  Th,
} from "@/components/ui";

export default function LedgerPage() {
  const { clients, ledger, session, settings } = useStore();
  const { t } = useI18n();
  const [q, setQ] = useState("");

  if (session?.role !== "owner") {
    return (
      <div className="py-20 text-center">
        <EmptyState message={t("noRecords")} />
      </div>
    );
  }

  const rows = clients
    .map((c) => {
      const entries = ledger.filter((e) => e.clientId === c.id);
      const balance = getBalance(entries);
      const debitTotal = entries.filter((e) => e.type === "debit").reduce((s, e) => s + e.amount, 0);
      const creditTotal = entries.filter((e) => e.type === "credit").reduce((s, e) => s + e.amount, 0);
      return { client: c, balance, debitTotal, creditTotal, count: entries.length };
    })
    .filter((r) => (r.client.name + r.client.phone).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.balance - a.balance);

  const totalDue = rows.filter((r) => r.balance > 0).reduce((s, r) => s + r.balance, 0);
  const totalAdvance = rows.filter((r) => r.balance < 0).reduce((s, r) => s + Math.abs(r.balance), 0);

  return (
    <div>
      <PageTitle title={t("allLedgers")} subtitle={`${t("due")}: ${money(totalDue, settings)} | ${t("advanceHeld")}: ${money(totalAdvance, settings)}`} />

      <div className="mb-4 w-full sm:w-72">
        <SearchBox value={q} onChange={setQ} placeholder={`${t("search")}...`} />
      </div>

      <Card>
        <CardHeader title={t("allLedgers")} />
        {rows.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("name")}</Th>
                  <Th>{t("phone")}</Th>
                  <Th>{t("debit")}</Th>
                  <Th>{t("credit")}</Th>
                  <Th>{t("entries")}</Th>
                  <Th>{t("balance")}</Th>
                  <Th>{t("actions")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.client.id} className="hover:bg-slate-50">
                    <Td className="font-medium text-slate-900">{r.client.name}</Td>
                    <Td>{r.client.phone}</Td>
                    <Td className="text-red-600">{money(r.debitTotal, settings)}</Td>
                    <Td className="text-emerald-600">{money(r.creditTotal, settings)}</Td>
                    <Td>{r.count}</Td>
                    <Td>
                      <Badge tone={r.balance > 0 ? "red" : r.balance < 0 ? "green" : "slate"}>
                        {money(r.balance, settings)}
                      </Badge>
                    </Td>
                    <Td>
                      <Link
                        href={`/app/clients/${r.client.id}`}
                        className="inline-flex items-center gap-1 rounded-md p-1.5 text-blue-600 hover:bg-blue-50"
                      >
                        <BookOpenText className="h-4 w-4" />
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
