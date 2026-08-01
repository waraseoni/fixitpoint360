import type { DB } from "./types";

export function uid(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function money(amount: number, settings?: DB["settings"]): string {
  const cur = settings?.currency || "₹";
  return `${cur}${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount || 0)}`;
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso.length <= 10 ? iso + "T00:00:00" : iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function today(): string {
  const d = new Date();
  return toISO(d);
}

export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(month: string): string {
  if (!/^\d{4}-\d{2}$/.test(month)) return month;
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function monthDays(month: string): string[] {
  const [y, m] = month.split("-").map(Number);
  const days: string[] = [];
  const count = new Date(y, m, 0).getDate();
  for (let i = 1; i <= count; i++) {
    days.push(`${month}-${String(i).padStart(2, "0")}`);
  }
  return days;
}

export function daysInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

export function phoneToWaNumber(phone: string): string {
  let p = (phone || "").replace(/[^0-9]/g, "");
  if (p.length === 10) p = "91" + p;
  return p;
}

export function waLink(phone: string, text: string): string {
  return `https://wa.me/${phoneToWaNumber(phone)}?text=${encodeURIComponent(text)}`;
}
