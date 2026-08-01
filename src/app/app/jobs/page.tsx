"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n, categoryLabel } from "@/lib/i18n";
import { SERVICE_CATEGORIES, JOB_STATUSES, PRIORITIES, PAYMENT_MODES } from "@/lib/constants";
import { money, formatDate } from "@/lib/format";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Select,
  Textarea,
  Field,
  Modal,
  SearchBox,
  EmptyState,
  PageTitle,
  Td,
  Th,
} from "@/components/ui";
import { JobStatusBadge, PaymentBadge, PriorityBadge } from "@/components/StatusBadge";
import type { Job } from "@/lib/types";

const emptyForm = {
  clientId: "",
  category: "cctv" as Job["category"],
  title: "",
  description: "",
  priority: "normal" as Job["priority"],
  assignedTo: "",
  scheduledDate: "",
  status: "pending" as Job["status"],
  charges: "",
  materialCost: "",
  advance: "",
  paymentMode: "pending" as Job["paymentMode"],
  notes: "",
};

function JobsInner() {
  const searchParams = useSearchParams();
  const { jobs, clients, users, settings, session, addJob, updateJob, deleteJob } = useStore();
  const { t, lang } = useI18n();

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState(searchParams.get("client") || "all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState(emptyForm);

  const staffList = users.filter((u) => u.status === "active" && u.role === "staff");

  const openAdd = (presetClient?: string) => {
    setEditing(null);
    const clientId = presetClient || (clientFilter !== "all" ? clientFilter : "");
    setForm({ ...emptyForm, clientId });
    setModalOpen(true);
  };

  const openEdit = (j: Job) => {
    setEditing(j);
    setForm({
      clientId: j.clientId,
      category: j.category,
      title: j.title,
      description: j.description || "",
      priority: j.priority,
      assignedTo: j.assignedTo || "",
      scheduledDate: j.scheduledDate || "",
      status: j.status,
      charges: String(j.charges),
      materialCost: String(j.materialCost),
      advance: String(j.advance),
      paymentMode: j.paymentMode,
      notes: j.notes || "",
    });
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.clientId || !form.title) return;
    const payload = {
      ...form,
      charges: parseFloat(form.charges) || 0,
      materialCost: parseFloat(form.materialCost) || 0,
      advance: parseFloat(form.advance) || 0,
      assignedTo: form.assignedTo || undefined,
      scheduledDate: form.scheduledDate || undefined,
      notes: form.notes || undefined,
      paymentStatus: "unpaid" as const,
      createdBy: session?.id || "",
    };
    if (editing) {
      updateJob(editing.id, payload);
    } else {
      addJob(payload);
    }
    setModalOpen(false);
  };

  const filtered = jobs.filter((j) => {
    const client = clients.find((c) => c.id === j.clientId);
    const matchQ = (j.title + (client?.name || "")).toLowerCase().includes(q.toLowerCase());
    const matchStatus = statusFilter === "all" || j.status === statusFilter;
    const matchCat = catFilter === "all" || j.category === catFilter;
    const matchClient = clientFilter === "all" || j.clientId === clientFilter;
    return matchQ && matchStatus && matchCat && matchClient;
  });

  const sorted = [...filtered].sort((a, b) => b.jobNo - a.jobNo);

  return (
    <div>
      <PageTitle
        title={t("jobList")}
        subtitle={`${jobs.length} ${t("total").toLowerCase()}`}
        action={
          session?.role === "owner" && (
            <Button onClick={() => openAdd()}>
              <Plus className="h-4 w-4" />
              {t("addJob")}
            </Button>
          )
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-full sm:w-72">
          <SearchBox value={q} onChange={setQ} placeholder={`${t("search")}...`} />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40">
          <option value="all">{t("all")} {t("status")}</option>
          {JOB_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {lang === "hi" ? s.labelHi : s.labelEn}
            </option>
          ))}
        </Select>
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="w-52">
          <option value="all">{t("all")} {t("category")}</option>
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {lang === "hi" ? c.labelHi : c.labelEn}
            </option>
          ))}
        </Select>
        <Select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="w-48">
          <option value="all">{t("all")} {t("clients")}</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <Card>
        <CardHeader title={t("jobList")} />
        {sorted.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("jobNo")}</Th>
                  <Th>{t("jobTitle")}</Th>
                  <Th>{t("clientRef")}</Th>
                  <Th>{t("category")}</Th>
                  <Th>{t("priority")}</Th>
                  <Th>{t("assignedTo")}</Th>
                  <Th>{t("status")}</Th>
                  <Th>{t("charges")}</Th>
                  <Th>{t("paymentStatus")}</Th>
                  <Th>{t("actions")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((j) => {
                  const client = clients.find((c) => c.id === j.clientId);
                  const tech = users.find((u) => u.id === j.assignedTo);
                  return (
                    <tr key={j.id} className="hover:bg-slate-50">
                      <Td className="font-medium text-slate-900">#{j.jobNo}</Td>
                      <Td className="max-w-[200px]">
                        <div className="truncate font-medium text-slate-800">{j.title}</div>
                        <div className="text-xs text-slate-400">{formatDate(j.scheduledDate)}</div>
                      </Td>
                      <Td>
                        {client && (
                          <Link href={`/app/clients/${client.id}`} className="text-blue-600 hover:underline">
                            {client.name}
                          </Link>
                        )}
                      </Td>
                      <Td>{categoryLabel(SERVICE_CATEGORIES.find((c) => c.value === j.category), lang)}</Td>
                      <Td>
                        <PriorityBadge value={j.priority} />
                      </Td>
                      <Td>{tech?.name || "—"}</Td>
                      <Td>
                        <JobStatusBadge value={j.status} />
                      </Td>
                      <Td>{money(j.charges, settings)}</Td>
                      <Td>
                        <PaymentBadge value={j.paymentStatus} />
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <Link href={`/app/jobs/${j.id}`} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                            <Eye className="h-4 w-4" />
                          </Link>
                          {session?.role === "owner" && (
                            <>
                              <button onClick={() => openEdit(j)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(t("confirmDelete"))) deleteJob(j.id);
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t("editJob") : t("addJob")} wide>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label={t("clientRef")} required>
            <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">—</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("serviceCategory")}>
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Job["category"] })}>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {lang === "hi" ? c.labelHi : c.labelEn}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label={t("jobTitle")} required>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label={t("description")}>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </Field>
          </div>
          <Field label={t("status")}>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Job["status"] })}>
              {JOB_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {lang === "hi" ? s.labelHi : s.labelEn}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("priority")}>
            <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Job["priority"] })}>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {lang === "hi" ? p.labelHi : p.labelEn}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("assignedTo")}>
            <Select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
              <option value="">—</option>
              {staffList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label={t("scheduledDate")}>
            <Input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
          </Field>
          <Field label={t("charges")}>
            <Input type="number" min="0" value={form.charges} onChange={(e) => setForm({ ...form, charges: e.target.value })} />
          </Field>
          <Field label={t("materialCost")}>
            <Input type="number" min="0" value={form.materialCost} onChange={(e) => setForm({ ...form, materialCost: e.target.value })} />
          </Field>
          <Field label={t("advance")}>
            <Input type="number" min="0" value={form.advance} onChange={(e) => setForm({ ...form, advance: e.target.value })} />
          </Field>
          <Field label={t("mode")}>
            <Select value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value as Job["paymentMode"] })}>
              {PAYMENT_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.labelEn}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label={t("notes")}>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
          </div>
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

export default function JobsPage() {
  return (
    <Suspense>
      <JobsInner />
    </Suspense>
  );
}
