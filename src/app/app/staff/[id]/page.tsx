"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Phone, Mail, CalendarCheck2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { money, formatDate, currentMonth, monthLabel } from "@/lib/format";
import {
  Card,
  CardHeader,
  EmptyState,
  Badge,
  Td,
  Th,
} from "@/components/ui";
import { JobStatusBadge, PaymentBadge, AttendanceBadge } from "@/components/StatusBadge";

export default function StaffDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { users, jobs, attendance, tada, salary, settings } = useStore();
  const { t, lang } = useI18n();
  const [month, setMonth] = useState(currentMonth());

  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <div className="py-20 text-center">
        <EmptyState message={t("noRecords")} />
      </div>
    );
  }

  const activeJobs = jobs.filter((j) => j.assignedTo === id && j.status !== "completed" && j.status !== "cancelled");
  const history = jobs
    .filter((j) => j.assignedTo === id && j.status === "completed")
    .sort((a, b) => (b.completedDate || "").localeCompare(a.completedDate || ""));
  const monthAtt = attendance.filter((a) => a.staffId === id && a.date.startsWith(month));
  const present = monthAtt.filter((a) => a.status === "present").length;
  const halfDays = monthAtt.filter((a) => a.status === "half_day").length;
  const monthTada = tada.filter((x) => x.staffId === id && x.date.startsWith(month));
  const tadaTotal = monthTada.reduce((s, x) => s + x.amount, 0);
  const salaryRec = salary.filter((x) => x.staffId === id).sort((a, b) => b.month.localeCompare(a.month));

  return (
    <div>
      <Link href="/app/staff" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> {t("staff")}
      </Link>

      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <CalendarCheck2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{user.name}</h1>
              <p className="text-sm text-slate-500">
                {user.designation} • {user.role}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" /> {user.email}
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="h-4 w-4 text-slate-400" /> {user.phone}
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>{t("basicSalary")}</span>
              <span className="font-medium">{money(user.salary, settings)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>{t("commissionRate")}</span>
              <span className="font-medium">{user.commissionRate}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>{t("joinedOn")}</span>
              <span className="font-medium">{formatDate(user.joinedAt)}</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title={t("activeJobsOf")} />
          {activeJobs.length === 0 ? (
            <EmptyState message={t("noRecords")} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <Th>{t("jobNo")}</Th>
                    <Th>{t("jobTitle")}</Th>
                    <Th>{t("category")}</Th>
                    <Th>{t("priority")}</Th>
                    <Th>{t("status")}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50">
                      <Td className="font-medium text-slate-900">
                        <Link href={`/app/jobs/${j.id}`} className="text-blue-600 hover:underline">
                          #{j.jobNo}
                        </Link>
                      </Td>
                      <Td className="max-w-[200px] truncate">{j.title}</Td>
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
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title={t("attendanceReport")} />
          <div className="p-4">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mb-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <div className="mb-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-emerald-50 p-2">
                <div className="text-lg font-bold text-emerald-600">{present}</div>
                <div className="text-[10px] text-emerald-500">{t("present")}</div>
              </div>
              <div className="rounded-lg bg-amber-50 p-2">
                <div className="text-lg font-bold text-amber-600">{halfDays}</div>
                <div className="text-[10px] text-amber-500">{t("halfDay")}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <div className="text-lg font-bold text-slate-600">{monthAtt.filter((a) => a.status === "absent").length}</div>
                <div className="text-[10px] text-slate-500">{t("absent")}</div>
              </div>
            </div>
            <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
              {monthAtt.length === 0 && <p className="text-sm text-slate-500">{t("noRecords")}</p>}
              {monthAtt
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-1.5">
                    <span className="text-sm text-slate-700">{formatDate(a.date)}</span>
                    <AttendanceBadge value={a.status} />
                  </div>
                ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title={`${t("taDa")} • ${monthLabel(month)}`} />
          <div className="p-4">
            {monthTada.length === 0 ? (
              <EmptyState message={t("noRecords")} />
            ) : (
              <div className="space-y-2">
                {monthTada.map((x) => (
                  <div key={x.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                    <div>
                      <div className="text-sm font-medium text-slate-800">{formatDate(x.date)}</div>
                      <div className="text-xs text-slate-400">
                        {x.type === "travel" ? t("travel") : x.type === "daily_allowance" ? t("dailyAllowance") : t("other")}
                        {x.description ? ` • ${x.description}` : ""}
                      </div>
                    </div>
                    <span className="font-semibold text-slate-800">{money(x.amount, settings)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-slate-200 px-1 pt-2">
                  <span className="text-sm font-medium text-slate-500">{t("total")}</span>
                  <span className="font-bold text-slate-900">{money(tadaTotal, settings)}</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title={t("salaryList")} />
          {salaryRec.length === 0 ? (
            <EmptyState message={t("noRecords")} />
          ) : (
            <div className="divide-y divide-slate-100">
              {salaryRec.map((s) => (
                <div key={s.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">{monthLabel(s.month)}</span>
                    <Badge tone={s.paid ? "green" : "amber"}>{s.paid ? t("paid") : t("unpaid")}</Badge>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-slate-500">
                    <span>{t("presentDays")}: {s.presentDays}</span>
                    <span>{t("basicSalary")}: {money(s.basic, settings)}</span>
                    <span>{t("commission")}: {money(s.commission, settings)}</span>
                    <span>{t("taDa")}: {money(s.taDa, settings)}</span>
                    <span>{t("deductions")}: {money(s.deductions, settings)}</span>
                    <span className="font-semibold text-slate-800">{t("netSalary")}: {money(s.net, settings)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title={t("jobHistory")} />
        {history.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("jobNo")}</Th>
                  <Th>{t("jobTitle")}</Th>
                  <Th>{t("category")}</Th>
                  <Th>{t("completedOn")}</Th>
                  <Th>{t("charges")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <Td className="font-medium text-slate-900">
                      <Link href={`/app/jobs/${j.id}`} className="text-blue-600 hover:underline">
                        #{j.jobNo}
                      </Link>
                    </Td>
                    <Td className="max-w-[220px] truncate">{j.title}</Td>
                    <Td>{categoryLabel(SERVICE_CATEGORIES.find((c) => c.value === j.category), lang)}</Td>
                    <Td>{formatDate(j.completedDate)}</Td>
                    <Td>{money(j.charges, settings)}</Td>
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
