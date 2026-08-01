import type { Lang } from "@/lib/i18n";
import type { Role, User } from "./types";

export const ROLES: { value: Role; labelEn: string; labelHi: string; tone: string }[] = [
  { value: "owner", labelEn: "Owner", labelHi: "मालिक", tone: "indigo" },
  { value: "admin", labelEn: "Admin", labelHi: "एडमिन", tone: "blue" },
  { value: "staff", labelEn: "Staff", labelHi: "स्टाफ", tone: "slate" },
];

export const ROLE_LABEL: Record<Role, { en: string; hi: string; tone: string }> = {
  owner: { en: "Owner", hi: "मालिक", tone: "indigo" },
  admin: { en: "Admin", hi: "एडमिन", tone: "blue" },
  staff: { en: "Staff", hi: "स्टाफ", tone: "slate" },
};

export const roleLabel = (role: Role, lang: Lang): string => ROLE_LABEL[role][lang];
export const roleTone = (role: Role): string => ROLE_LABEL[role].tone;

const PAGE_ACCESS: { prefix: string; roles: Role[] }[] = [
  { prefix: "/app/dashboard", roles: ["owner", "admin", "staff"] },
  { prefix: "/app/users", roles: ["owner", "admin"] },
  { prefix: "/app/clients", roles: ["owner", "admin", "staff"] },
  { prefix: "/app/jobs", roles: ["owner", "admin", "staff"] },
  { prefix: "/app/amc", roles: ["owner", "admin", "staff"] },
  { prefix: "/app/staff", roles: ["owner", "admin", "staff"] },
  { prefix: "/app/attendance", roles: ["owner", "admin", "staff"] },
  { prefix: "/app/tada", roles: ["owner", "admin"] },
  { prefix: "/app/salary", roles: ["owner"] },
  { prefix: "/app/money", roles: ["owner"] },
  { prefix: "/app/ledger", roles: ["owner"] },
  { prefix: "/app/settings", roles: ["owner"] },
];

export function canAccess(role: Role, pathname: string): boolean {
  for (const { prefix, roles } of PAGE_ACCESS) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return roles.includes(role);
    }
  }
  return true;
}

export const canManage = (role: Role): boolean => role === "owner" || role === "admin";

export const canManageUsers = (role: Role): boolean => role === "owner" || role === "admin";

export const canAssignRole = (actor: Role, target: Role): boolean => {
  if (actor === "owner") return true;
  if (actor === "admin") return target === "staff";
  return false;
};

export function canEditUser(actor: Role, target: User): boolean {
  if (actor === "owner") return true;
  if (actor === "admin") return target.role === "staff";
  return false;
}
