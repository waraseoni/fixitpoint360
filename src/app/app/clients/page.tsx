"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, MessageCircle, Phone, Eye } from "lucide-react";
import { useStore, getBalance } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { CLIENT_TYPES } from "@/lib/constants";
import { waLink, money } from "@/lib/format";
import { canManage } from "@/lib/roles";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Select,
  Field,
  Modal,
  SearchBox,
  EmptyState,
  PageTitle,
  Td,
  Th,
  Badge,
} from "@/components/ui";
import type { Client } from "@/lib/types";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
  type: "residential" as Client["type"],
  gstin: "",
  notes: "",
};

export default function ClientsPage() {
  const { clients, ledger, jobs, settings, addClient, updateClient, deleteClient, session } = useStore();
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (c: Client) => {
    setEditing(c);
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email || "",
      address: c.address || "",
      city: c.city || "",
      pincode: c.pincode || "",
      type: c.type,
      gstin: c.gstin || "",
      notes: c.notes || "",
    });
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.name || !form.phone) return;
    if (editing) {
      updateClient(editing.id, form);
    } else {
      addClient(form);
    }
    setModalOpen(false);
  };

  const filtered = clients.filter((c) => {
    const matchQ = (c.name + c.phone + (c.city || "")).toLowerCase().includes(q.toLowerCase());
    const matchType = typeFilter === "all" || c.type === typeFilter;
    return matchQ && matchType;
  });

  const clientBalance = (id: string) => getBalance(ledger.filter((e) => e.clientId === id));
  const clientJobs = (id: string) => jobs.filter((j) => j.clientId === id).length;

  return (
    <div>
      <PageTitle
        title={t("clientList")}
        subtitle={`${clients.length} ${t("total")?.toLowerCase()}`}
        action={
          session && canManage(session.role) && (
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4" />
              {t("addClient")}
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-full sm:w-72">
          <SearchBox value={q} onChange={setQ} placeholder={`${t("search")}...`} />
        </div>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-44">
          <option value="all">{t("all")} {t("type")}</option>
          {CLIENT_TYPES.map((ct) => (
            <option key={ct.value} value={ct.value}>
              {lang === "hi" ? ct.labelHi : ct.labelEn}
            </option>
          ))}
        </Select>
      </div>

      <Card>
        <CardHeader title={t("clientList")} />
        {filtered.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("name")}</Th>
                  <Th>{t("phone")}</Th>
                  <Th>{t("type")}</Th>
                  <Th>{t("balance")}</Th>
                  <Th>{t("jobs")}</Th>
                  <Th>{t("actions")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => {
                  const bal = clientBalance(c.id);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <Td>
                        <div className="font-medium text-slate-900">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.city}</div>
                      </Td>
                      <Td>{c.phone}</Td>
                      <Td>
                        <Badge tone={c.type === "corporate" ? "indigo" : c.type === "business" ? "blue" : "slate"}>
                          {CLIENT_TYPES.find((x) => x.value === c.type)?.labelEn}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge tone={bal > 0 ? "red" : bal < 0 ? "green" : "slate"}>
                          {bal > 0 ? `${t("due")}: ` : bal < 0 ? `${t("advanceHeld")}: ` : t("balance")}
                          {money(bal, settings)}
                        </Badge>
                      </Td>
                      <Td>{clientJobs(c.id)}</Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/app/clients/${c.id}`}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                            title={t("details")}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <a
                            href={waLink(c.phone, `Hello ${c.name}! This is ${settings.name} (${settings.contactNo}).`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50"
                            title={t("whatsapp")}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                          <a href={`tel:${c.phone}`} className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50" title={t("call")}>
                            <Phone className="h-4 w-4" />
                          </a>
                          {session && canManage(session.role) && (
                            <>
                              <button onClick={() => openEdit(c)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(t("confirmDelete"))) deleteClient(c.id);
                                }}
                                className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t("editClient") : t("addClient")} wide>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label={t("name")} required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label={t("phone")} required>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </Field>
          <Field label={t("emailLabel")}>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label={t("clientType")}>
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Client["type"] })}>
              {CLIENT_TYPES.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {lang === "hi" ? ct.labelHi : ct.labelEn}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("address")}>
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("city")}>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </Field>
            <Field label={t("pincode")}>
              <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            </Field>
          </div>
          <Field label={t("gstin")}>
            <Input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
          </Field>
          <Field label={t("notes")}>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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
