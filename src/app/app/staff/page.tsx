"use client";

import Link from "next/link";
import { UserRound, Eye } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { roleLabel } from "@/lib/roles";
import { Card, CardHeader, Badge, EmptyState, PageTitle, Td, Th, SearchBox } from "@/components/ui";
import { useState } from "react";

export default function TeamPage() {
  const { users } = useStore();
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");

  const filtered = users.filter((u) => (u.name + u.designation + u.email).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageTitle
        title={t("team")}
        subtitle={`${users.length} ${t("total").toLowerCase()}`}
      />

      <div className="mb-4 w-full sm:w-72">
        <SearchBox value={q} onChange={setQ} placeholder={`${t("search")}...`} />
      </div>

      <Card>
        <CardHeader title={t("team")} />
        {filtered.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("name")}</Th>
                  <Th>{t("role")}</Th>
                  <Th>{t("designation")}</Th>
                  <Th>{t("phone")}</Th>
                  <Th>{t("status")}</Th>
                  <Th>{t("actions")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <UserRound className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={u.role === "owner" ? "indigo" : u.role === "admin" ? "blue" : "slate"}>
                        {roleLabel(u.role, lang)}
                      </Badge>
                    </Td>
                    <Td>{u.designation}</Td>
                    <Td>{u.phone}</Td>
                    <Td>
                      <Badge tone={u.status === "active" ? "green" : "red"}>
                        {u.status === "active" ? t("active") : t("cancelled")}
                      </Badge>
                    </Td>
                    <Td>
                      <Link
                        href={`/app/staff/${u.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                        title={t("details")}
                      >
                        <Eye className="h-4 w-4" />
                        {t("details")}
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
