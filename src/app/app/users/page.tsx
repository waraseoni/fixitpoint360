"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, UserRound, Eye } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { ROLES, canEditUser, canAssignRole, roleLabel } from "@/lib/roles";
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
  SearchBox,
} from "@/components/ui";
import type { Role, User } from "@/lib/types";

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  designation: string;
  salary: string;
  commissionRate: string;
  joinedAt: string;
  status: User["status"];
}

const emptyForm = (role: Role): FormState => ({
  name: "",
  email: "",
  phone: "",
  password: "",
  role,
  designation: "",
  salary: "",
  commissionRate: "",
  joinedAt: "",
  status: "active",
});

export default function UsersPage() {
  const { users, session, addUser, updateUser, deleteUser } = useStore();
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm("staff"));

  const actor = session!;
  const allowedRoles = ROLES.filter((r) => canAssignRole(actor.role, r.value));

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm("staff"), joinedAt: new Date().toISOString().slice(0, 10) });
    setModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({
      name: u.name,
      email: u.email,
      phone: u.phone,
      password: "",
      role: u.role,
      designation: u.designation,
      salary: String(u.salary),
      commissionRate: String(u.commissionRate),
      joinedAt: u.joinedAt,
      status: u.status,
    });
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.name || !form.email) return;
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      designation: form.designation,
      salary: parseFloat(form.salary) || 0,
      commissionRate: parseFloat(form.commissionRate) || 0,
      joinedAt: form.joinedAt,
      status: form.status,
      ...(editing
        ? form.password
          ? { password: form.password }
          : {}
        : { password: form.password || "staff123" }),
    };
    if (editing) {
      updateUser(editing.id, payload);
    } else {
      addUser(payload);
    }
    setModalOpen(false);
  };

  const filtered = users.filter((u) => {
    const matchesQ = (u.name + u.designation + u.email).toLowerCase().includes(q.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesQ && matchesRole;
  });

  return (
    <div>
      <PageTitle
        title={t("users")}
        subtitle={`${users.length} ${t("total").toLowerCase()} • ${users.filter((u) => u.status === "active").length} ${t("activeUsers")}`}
        action={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" />
            {t("addUser")}
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-full sm:w-72">
          <SearchBox value={q} onChange={setQ} placeholder={`${t("search")}...`} />
        </div>
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as Role | "all")} className="w-44">
          <option value="all">{t("all")} {t("role")}</option>
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {roleLabel(r.value, lang)}
            </option>
          ))}
        </Select>
      </div>

      <Card>
        <CardHeader title={t("userList")} />
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
                {filtered.map((u) => {
                  const editable = canEditUser(actor.role, u);
                  const isSelf = u.id === actor.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <Td>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <UserRound className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {u.name} {isSelf && <span className="text-xs text-slate-400">({t("you")})</span>}
                            </div>
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
                        <div className="flex items-center gap-1">
                          <Link href={`/app/staff/${u.id}`} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" title={t("details")}>
                            <Eye className="h-4 w-4" />
                          </Link>
                          {editable && !isSelf && (
                            <button onClick={() => openEdit(u)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" title={t("edit")}>
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                          {editable && !isSelf && (
                            <button
                              onClick={() => {
                                if (confirm(t("confirmDelete"))) deleteUser(u.id);
                              }}
                              className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                              title={t("delete")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t("editUser") : t("addUser")} wide>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label={t("name")} required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label={t("designation")}>
            <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Technician" />
          </Field>
          <Field label={t("emailLabel")} required>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </Field>
          <Field label={t("phone")}>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label={t("role")} required>
            <Select
              value={form.role}
              disabled={editing ? editing.id === actor.id : false}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            >
              {allowedRoles.map((r) => (
                <option key={r.value} value={r.value}>
                  {roleLabel(r.value, lang)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("password")}>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={editing ? t("leaveBlankToKeep") : "staff123"}
            />
          </Field>
          <Field label={t("joinedOn")}>
            <Input type="date" value={form.joinedAt} onChange={(e) => setForm({ ...form, joinedAt: e.target.value })} />
          </Field>
          <Field label={t("status")}>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as User["status"] })}>
              <option value="active">{t("active")}</option>
              <option value="inactive">{t("cancelled")}</option>
            </Select>
          </Field>
          <Field label={t("basicSalary")}>
            <Input type="number" min="0" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          </Field>
          <Field label={t("commissionRate")}>
            <Input type="number" min="0" max="100" value={form.commissionRate} onChange={(e) => setForm({ ...form, commissionRate: e.target.value })} />
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModalOpen(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={submit}>{t("save")}</Button>
        </div>
      </Modal>
    </div>
  );
}
