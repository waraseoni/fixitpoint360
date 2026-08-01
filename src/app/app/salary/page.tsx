"use client";

import { useState } from "react";
import { Calculator, CheckCircle2, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { money, monthLabel, currentMonth } from "@/lib/format";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Select,
  Field,
  EmptyState,
  PageTitle,
  Badge,
  Td,
  Th,
} from "@/components/ui";

export default function SalaryPage() {
  const { users, salary, session, generateSalary, toggleSalaryPaid, deleteSalary, settings } = useStore();
  const { t } = useI18n();

  const staffList = users.filter((u) => u.role === "staff" && u.status === "active");
  const [staffId, setStaffId] = useState(staffList[0]?.id || "");
  const [month, setMonth] = useState(currentMonth());
  const [bonus, setBonus] = useState("0");
  const [deductions, setDeductions] = useState("0");

  if (session?.role !== "owner") {
    return (
      <div className="py-20 text-center">
        <EmptyState message={t("noRecords")} />
      </div>
    );
  }

  const records = salary.filter((s) => staffId === "" || s.staffId === staffId).sort((a, b) => b.month.localeCompare(a.month));

  const onGenerate = () => {
    if (!staffId) return;
    generateSalary(staffId, month, parseFloat(bonus) || 0, parseFloat(deductions) || 0);
  };

  return (
    <div>
      <PageTitle title={t("salary")} subtitle={t("salaryList")} />

      <Card className="mb-6">
        <CardHeader title={t("generateSalary")} />
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label={t("staff")}>
            <Select value={staffId} onChange={(e) => setStaffId(e.target.value)}>
              {staffList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("month")}>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </Field>
          <Field label={t("bonus")}>
            <Input type="number" min="0" value={bonus} onChange={(e) => setBonus(e.target.value)} />
          </Field>
          <Field label={t("deductions")}>
            <Input type="number" min="0" value={deductions} onChange={(e) => setDeductions(e.target.value)} />
          </Field>
          <div className="flex items-end">
            <Button onClick={onGenerate}>
              <Calculator className="h-4 w-4" /> {t("generateSalary")}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title={t("salaryList")} />
        {records.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("staff")}</Th>
                  <Th>{t("month")}</Th>
                  <Th>{t("presentDays")}</Th>
                  <Th>{t("basicSalary")}</Th>
                  <Th>{t("commission")}</Th>
                  <Th>{t("taDa")}</Th>
                  <Th>{t("bonus")}</Th>
                  <Th>{t("deductions")}</Th>
                  <Th>{t("netSalary")}</Th>
                  <Th>{t("status")}</Th>
                  <Th>{t("actions")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => {
                  const user = users.find((u) => u.id === r.staffId);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <Td className="font-medium text-slate-900">{user?.name || "—"}</Td>
                      <Td>{monthLabel(r.month)}</Td>
                      <Td>{r.presentDays}</Td>
                      <Td>{money(r.basic, settings)}</Td>
                      <Td>{money(r.commission, settings)}</Td>
                      <Td>{money(r.taDa, settings)}</Td>
                      <Td>{money(r.bonus, settings)}</Td>
                      <Td className="text-red-600">{money(r.deductions, settings)}</Td>
                      <Td className="font-semibold text-slate-900">{money(r.net, settings)}</Td>
                      <Td>
                        <Badge tone={r.paid ? "green" : "amber"}>{r.paid ? t("paid") : t("unpaid")}</Badge>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => toggleSalaryPaid(r.id)}>
                            <CheckCircle2 className="h-3.5 w-3.5" /> {t("markPaid")}
                          </Button>
                          <Button
                            variant="ghost"
                            className="px-2 py-1 text-xs text-red-600"
                            onClick={() => {
                              if (confirm(t("confirmDelete"))) deleteSalary(r.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
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
    </div>
  );
}
