"use client";

import Link from "next/link";
import {
  Users,
  Wrench,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  UserCog,
  ArrowRight,
} from "lucide-react";
import { useStore, getBalance } from "@/lib/store";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { money, currentMonth } from "@/lib/format";
import { Card, CardHeader, StatCard, Badge, EmptyState, Td, Th } from "@/components/ui";
import { JobStatusBadge, PaymentBadge } from "@/components/StatusBadge";

export default function DashboardPage() {
  const { jobs, clients, transactions, amcs, users, ledger, settings, session } = useStore();
  const { t, lang } = useI18n();

  const activeJobs = jobs.filter((j) => j.status !== "completed" && j.status !== "cancelled");
  const month = currentMonth();
  const income = transactions
    .filter((x) => x.type === "income" && x.date.startsWith(month))
    .reduce((s, x) => s + x.amount, 0);
  const expense = transactions
    .filter((x) => x.type === "expense" && x.date.startsWith(month))
    .reduce((s, x) => s + x.amount, 0);
  const activeAmcs = amcs.filter((a) => a.status === "active").length;
  const staffCount = users.filter((u) => u.role === "staff" && u.status === "active").length;

  const clientBalances = clients
    .map((c) => ({ client: c, balance: getBalance(ledger.filter((e) => e.clientId === c.id)) }))
    .filter((x) => x.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  const totalDue = clientBalances.reduce((s, x) => s + x.balance, 0);
  const recentJobs = [...jobs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-900">
          {t("welcome")}, {session?.name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-slate-500">{t("overview")}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("totalClients")} value={String(clients.length)} icon={<Users className="h-5 w-5" />} tone="blue" />
        <StatCard label={t("activeJobs")} value={String(activeJobs.length)} icon={<Wrench className="h-5 w-5" />} tone="indigo" />
        <StatCard label={t("dueAmount")} value={money(totalDue, settings)} icon={<IndianRupee className="h-5 w-5" />} tone="red" />
        <StatCard label={t("amcActive")} value={String(activeAmcs)} icon={<ShieldCheck className="h-5 w-5" />} tone="amber" />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label={t("incomeThisMonth")} value={money(income, settings)} icon={<TrendingUp className="h-5 w-5" />} tone="green" />
        <StatCard label={t("expenseThisMonth")} value={money(expense, settings)} icon={<TrendingDown className="h-5 w-5" />} tone="red" />
        <StatCard label={t("staffCount")} value={String(staffCount)} icon={<UserCog className="h-5 w-5" />} tone="slate" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={t("recentJobs")}
            action={
              <Link href="/app/jobs" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                {t("all")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {recentJobs.length === 0 ? (
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
                    <Th>{t("paymentStatus")}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50">
                      <Td className="font-medium text-slate-900">#{j.jobNo}</Td>
                      <Td className="max-w-[180px] truncate">{j.title}</Td>
                      <Td>{categoryLabel(SERVICE_CATEGORIES.find((c) => c.value === j.category), lang)}</Td>
                      <Td>
                        <JobStatusBadge value={j.status} />
                      </Td>
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
          <CardHeader
            title={t("openLedgers")}
            action={
              <Link href="/app/ledger" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                {t("ledger")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {clientBalances.length === 0 ? (
            <EmptyState message={t("noRecords")} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <Th>{t("name")}</Th>
                    <Th>{t("phone")}</Th>
                    <Th>{t("balance")}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientBalances.slice(0, 6).map(({ client, balance }) => (
                    <tr key={client.id} className="hover:bg-slate-50">
                      <Td className="font-medium text-slate-900">{client.name}</Td>
                      <Td>{client.phone}</Td>
                      <Td>
                        <Badge tone="red">{money(balance, settings)}</Badge>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
