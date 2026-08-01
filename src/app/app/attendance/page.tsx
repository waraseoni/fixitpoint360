"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { ATTENDANCE_STATUSES } from "@/lib/constants";
import { monthDays, currentMonth } from "@/lib/format";
import { Card, CardHeader, Select, EmptyState, PageTitle } from "@/components/ui";
import { AttendanceBadge } from "@/components/StatusBadge";
import type { AttendanceStatus } from "@/lib/types";

export default function AttendancePage() {
  const { users, attendance, markAttendance, deleteAttendance, session } = useStore();
  const { t, lang } = useI18n();

  const staffList = users.filter((u) => u.role === "staff" && u.status === "active");
  const initialStaff = session?.role === "staff" ? session.id : staffList[0]?.id || "";
  const [staffId, setStaffId] = useState(initialStaff);
  const [month, setMonth] = useState(currentMonth());

  const days = monthDays(month);
  const getStatus = (date: string): AttendanceStatus | null =>
    attendance.find((a) => a.staffId === staffId && a.date === date)?.status || null;

  const setStatus = (date: string, status: AttendanceStatus) => {
    const existing = attendance.find((a) => a.staffId === staffId && a.date === date);
    if (existing && existing.status === status) {
      deleteAttendance(existing.id);
      return;
    }
    markAttendance({ staffId, date, status });
  };

  const statusCounts = days.reduce(
    (acc, d) => {
      const s = getStatus(d);
      if (s) acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      <PageTitle title={t("attendance")} subtitle={t("attendanceReport")} />

      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={staffId} onChange={(e) => setStaffId(e.target.value)} className="w-56">
          {staffList.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {ATTENDANCE_STATUSES.map((s) => (
          <div key={s.value} className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs">
            <AttendanceBadge value={s.value} />
            <span className="font-semibold text-slate-700">{statusCounts[s.value] || 0}</span>
          </div>
        ))}
      </div>

      {staffId ? (
        <Card>
          <CardHeader
            title={staffList.find((u) => u.id === staffId)?.name || t("staff")}
            subtitle={t("presentDays") + ": " + ((statusCounts.present || 0) + (statusCounts.half_day || 0) * 0.5)}
          />
          <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {days.map((date) => {
              const status = getStatus(date);
              const day = new Date(date + "T00:00:00").getDate();
              const weekday = new Date(date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short" });
              const isToday = date === currentMonth() && new Date().getDate() === day;
              return (
                <div
                  key={date}
                  className={`rounded-lg border p-2 ${isToday ? "border-blue-400 ring-1 ring-blue-200" : "border-slate-200"}`}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">{day}</span>
                    <span className="text-[10px] text-slate-400">{weekday}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {ATTENDANCE_STATUSES.map((s) => {
                      const sel = status === s.value;
                      const colors: Record<string, string> = {
                        present: sel ? "bg-emerald-600 text-white border-emerald-600" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
                        absent: sel ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50",
                        half_day: sel ? "bg-amber-500 text-white border-amber-500" : "border-amber-200 text-amber-600 hover:bg-amber-50",
                        leave: sel ? "bg-blue-600 text-white border-blue-600" : "border-blue-200 text-blue-600 hover:bg-blue-50",
                      };
                      return (
                        <button
                          key={s.value}
                          onClick={() => setStatus(date, s.value)}
                          className={`rounded border px-1 py-0.5 text-[10px] font-medium transition-colors ${colors[s.value]}`}
                        >
                          {lang === "hi" ? s.labelHi : s.labelEn}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card>
          <EmptyState message={t("noRecords")} />
        </Card>
      )}
    </div>
  );
}
