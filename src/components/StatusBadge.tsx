"use client";

import { Badge } from "./ui";
import { useI18n } from "@/lib/i18n";
import type { JobStatus, PaymentStatus, Priority, AttendanceStatus } from "@/lib/types";
import { JOB_STATUSES, PAYMENT_STATUSES, PRIORITIES, ATTENDANCE_STATUSES } from "@/lib/constants";

export function JobStatusBadge({ value }: { value: JobStatus }) {
  const { t } = useI18n();
  const label = JOB_STATUSES.find((s) => s.value === value)?.labelEn || value;
  const tones: Record<JobStatus, string> = {
    pending: "amber",
    assigned: "blue",
    in_progress: "indigo",
    completed: "green",
    cancelled: "red",
  };
  return <Badge tone={tones[value]}>{t("status")}: {label}</Badge>;
}

export function PaymentBadge({ value }: { value: PaymentStatus }) {
  const label = PAYMENT_STATUSES.find((s) => s.value === value)?.labelEn || value;
  const tones: Record<PaymentStatus, string> = {
    paid: "green",
    partial: "amber",
    unpaid: "red",
  };
  return <Badge tone={tones[value]}>{label}</Badge>;
}

export function PriorityBadge({ value }: { value: Priority }) {
  const label = PRIORITIES.find((p) => p.value === value)?.labelEn || value;
  const tones: Record<Priority, string> = { low: "slate", normal: "blue", high: "amber", urgent: "red" };
  return <Badge tone={tones[value]}>{label}</Badge>;
}

export function AttendanceBadge({ value }: { value: AttendanceStatus }) {
  const label = ATTENDANCE_STATUSES.find((s) => s.value === value)?.labelEn || value;
  const tones: Record<AttendanceStatus, string> = {
    present: "green",
    absent: "red",
    half_day: "amber",
    leave: "blue",
  };
  return <Badge tone={tones[value]}>{label}</Badge>;
}
