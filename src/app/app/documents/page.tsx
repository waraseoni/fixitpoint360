"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Printer, Eye, FileText, X, Check } from "lucide-react";
import { useStore, docTotals } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { DOC_TYPES, DOC_STATUSES } from "@/lib/constants";
import { money, formatDate, today } from "@/lib/format";
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
import type { Doc, DocItem, DocType, DocStatus } from "@/lib/types";

const emptyItems: DocItem[] = [{ id: "i1", description: "", qty: 1, rate: 0 }];

function emptyForm(docType: DocType, clientId: string) {
  return {
    docType,
    clientId,
    jobId: "",
    date: today(),
    validUntil: "",
    items: emptyItems.map((i) => ({ ...i })),
    discount: "",
    taxRate: "",
    notes: "",
    status: "draft" as DocStatus,
  };
}

const docTypeTone = (t: DocType): string =>
  t === "invoice" ? "blue" : t === "bill" ? "green" : t === "estimate" ? "amber" : "indigo";

const docStatusTone = (s: DocStatus): string =>
  s === "paid" || s === "accepted" ? "green" : s === "rejected" || s === "cancelled" ? "red" : s === "sent" ? "blue" : "slate";

const docTypeLabel = (lang: "en" | "hi", t: DocType): string => {
  const d = DOC_TYPES.find((x) => x.value === t);
  return d ? (lang === "hi" ? d.labelHi : d.labelEn) : t;
};

const docStatusLabel = (lang: "en" | "hi", s: DocStatus): string => {
  const d = DOC_STATUSES.find((x) => x.value === s);
  return d ? (lang === "hi" ? d.labelHi : d.labelEn) : s;
};

export default function DocumentsPage() {
  return (
    <Suspense fallback={null}>
      <DocumentsInner />
    </Suspense>
  );
}

function DocumentsInner() {
  const searchParams = useSearchParams();
  const { documents, clients, jobs, settings, session, addDoc, updateDoc, deleteDoc } = useStore();
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const presetType = searchParams.get("new");
  const presetClient = searchParams.get("client") || undefined;
  const presetJob = searchParams.get("job") || undefined;
  const [modalOpen, setModalOpen] = useState(() => presetType !== null);
  const [preview, setPreview] = useState<Doc | null>(null);
  const [editing, setEditing] = useState<Doc | null>(null);
  const [form, setForm] = useState(() => {
    const t0 = presetType as DocType | null;
    const base = t0 ? emptyForm(t0, presetClient || "") : emptyForm("bill", "");
    return { ...base, jobId: presetJob || "" };
  });

  const openAdd = (type: DocType) => {
    setEditing(null);
    setForm({ ...emptyForm(type, presetClient || clients[0]?.id || ""), jobId: presetJob || "" });
    setModalOpen(true);
  };
  const openEdit = (d: Doc) => {
    setEditing(d);
    setForm({
      docType: d.docType,
      clientId: d.clientId,
      jobId: d.jobId || "",
      date: d.date,
      validUntil: d.validUntil || "",
      items: d.items.map((i) => ({ ...i })),
      discount: String(d.discount || ""),
      taxRate: String(d.taxRate || ""),
      notes: d.notes || "",
      status: d.status,
    });
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.clientId) return;
    const items = form.items.filter((i) => (i.description || "").trim() !== "");
    if (items.length === 0) return;
    const payload = {
      docType: form.docType,
      clientId: form.clientId,
      jobId: form.jobId || undefined,
      date: form.date,
      validUntil: form.validUntil || undefined,
      items,
      discount: Number(form.discount) || 0,
      taxRate: Number(form.taxRate) || 0,
      notes: form.notes || undefined,
      status: form.status,
    };
    if (editing) {
      updateDoc(editing.id, payload);
    } else {
      addDoc(payload);
    }
    setModalOpen(false);
  };

  const filtered = documents
    .filter((d) => typeFilter === "all" || d.docType === typeFilter)
    .filter((d) => {
      const client = clients.find((c) => c.id === d.clientId);
      const matchQ = (client ? client.name + client.phone : "").toLowerCase().includes(q.toLowerCase());
      return matchQ;
    })
    .sort((a, b) => b.docNo - a.docNo);

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name || "—";

  return (
    <div>
      <PageTitle
        title={t("documents")}
        subtitle={t("documentsList")}
        action={
          session && canManage(session.role) && (
            <div className="flex flex-wrap gap-1.5">
              <Button onClick={() => openAdd("bill")} className="!bg-green-600 hover:!bg-green-700">
                <Plus className="h-4 w-4" /> {t("docTypeBill")}
              </Button>
              <Button onClick={() => openAdd("invoice")}>
                <Plus className="h-4 w-4" /> {t("docTypeInvoice")}
              </Button>
              <Button onClick={() => openAdd("estimate")} className="!bg-amber-600 hover:!bg-amber-700">
                <Plus className="h-4 w-4" /> {t("docTypeEstimate")}
              </Button>
              <Button onClick={() => openAdd("quotation")} className="!bg-indigo-600 hover:!bg-indigo-700">
                <Plus className="h-4 w-4" /> {t("docTypeQuotation")}
              </Button>
            </div>
          )
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-full sm:w-72">
          <SearchBox value={q} onChange={setQ} placeholder={`${t("search")}...`} />
        </div>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-44">
          <option value="all">{t("all")} {t("type")}</option>
          {DOC_TYPES.map((dt) => (
            <option key={dt.value} value={dt.value}>
              {lang === "hi" ? dt.labelHi : dt.labelEn}
            </option>
          ))}
        </Select>
      </div>

      <Card>
        <CardHeader title={t("documents")} />
        {filtered.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("docNo")}</Th>
                  <Th>{t("type")}</Th>
                  <Th>{t("name")}</Th>
                  <Th>{t("docDate")}</Th>
                  <Th>{t("total")}</Th>
                  <Th>{t("status")}</Th>
                  <Th>{t("actions")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((d) => {
                  const totals = docTotals(d);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <Td>
                        <span className="font-semibold text-slate-900">
                          {docTypeLabel(lang, d.docType)[0]}
                          {d.docNo}
                        </span>
                      </Td>
                      <Td>
                        <Badge tone={docTypeTone(d.docType)}>{docTypeLabel(lang, d.docType)}</Badge>
                      </Td>
                      <Td className="max-w-[160px] truncate font-medium text-slate-900">
                        {clientName(d.clientId)}
                      </Td>
                      <Td>{formatDate(d.date)}</Td>
                      <Td className="font-semibold">{money(totals.total, settings)}</Td>
                      <Td>
                        <Badge tone={docStatusTone(d.status)}>{docStatusLabel(lang, d.status)}</Badge>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" className="px-2" title={t("viewDoc")} onClick={() => setPreview(d)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {session && canManage(session.role) && (
                            <>
                              <Button variant="ghost" className="px-2" title={t("edit")} onClick={() => openEdit(d)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                className="px-2 text-red-600 hover:bg-red-50"
                                title={t("delete")}
                                onClick={() => confirm(t("confirmDelete")) && deleteDoc(d.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t("edit") + " " + docTypeLabel(lang, form.docType) : t("newDocument")} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={t("type")} required>
              <Select value={form.docType} onChange={(e) => setForm({ ...form, docType: e.target.value as DocType })}>
                {DOC_TYPES.map((dt) => (
                  <option key={dt.value} value={dt.value}>
                    {lang === "hi" ? dt.labelHi : dt.labelEn}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("clientRef")} required>
              <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                <option value="">{lang === "hi" ? "चुनें" : "Select"}</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("jobs")}>
              <Select value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })}>
                <option value="">—</option>
                {jobs
                  .filter((j) => !form.clientId || j.clientId === form.clientId)
                  .map((j) => (
                    <option key={j.id} value={j.id}>
                      #{j.jobNo} {j.title}
                    </option>
                  ))}
              </Select>
            </Field>
            <Field label={t("status")}>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as DocStatus })}>
                {DOC_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {lang === "hi" ? s.labelHi : s.labelEn}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("docDate")}>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label={t("validUntil")}>
              <Input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} />
            </Field>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">{t("items")}</span>
              <Button
                variant="outline"
                className="px-3 py-1.5 text-xs"
                onClick={() => setForm({ ...form, items: [...form.items, { id: `i${Date.now()}`, description: "", qty: 1, rate: 0 }] })}
              >
                <Plus className="h-3.5 w-3.5" /> {t("addItem")}
              </Button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-[1fr_64px_90px_90px_28px] items-start gap-2">
                  <Input
                    placeholder={t("description")}
                    value={item.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        items: form.items.map((i, j) => (j === idx ? { ...i, description: e.target.value } : i)),
                      })
                    }
                  />
                  <Input
                    type="number"
                    min="0"
                    value={item.qty}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        items: form.items.map((i, j) => (j === idx ? { ...i, qty: Number(e.target.value) || 0 } : i)),
                      })
                    }
                  />
                  <Input
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        items: form.items.map((i, j) => (j === idx ? { ...i, rate: Number(e.target.value) || 0 } : i)),
                      })
                    }
                  />
                  <div className="flex h-9 items-center justify-end rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm font-semibold text-slate-700">
                    {money((item.qty || 0) * (item.rate || 0), settings)}
                  </div>
                  <button
                    onClick={() => setForm({ ...form, items: form.items.filter((_, j) => j !== idx) })}
                    className="mt-1.5 rounded-md p-1 text-slate-400 hover:text-red-600"
                    aria-label={t("delete")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("discount")}>
              <Input type="number" min="0" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
            </Field>
            <Field label={t("taxRate")}>
              <Input type="number" min="0" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
            </Field>
          </div>

          {(() => {
            const totals = docTotals({
              items: form.items.filter((i) => i.description.trim()),
              discount: Number(form.discount) || 0,
              taxRate: Number(form.taxRate) || 0,
            });
            return (
              <div className="ml-auto w-full max-w-xs space-y-1 rounded-lg bg-slate-50 p-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>{t("subtotal")}</span>
                  <span>{money(totals.subtotal, settings)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>{t("taxAmount")}</span>
                  <span>{money(totals.taxAmount, settings)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{t("total")}</span>
                  <span>{money(totals.total, settings)}</span>
                </div>
              </div>
            );
          })()}

          <Field label={t("notes")}>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={submit}>
              <Check className="h-4 w-4" /> {t("save")}
            </Button>
          </div>
        </div>
      </Modal>

      {preview && (
        <DocPreview
          doc={preview}
          onClose={() => setPreview(null)}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
}

function DocPreview({ doc, onClose, onPrint }: { doc: Doc; onClose: () => void; onPrint: () => void }) {
  const { clients, jobs, settings } = useStore();
  const { t, lang } = useI18n();
  const client = clients.find((c) => c.id === doc.clientId);
  const job = jobs.find((j) => j.id === doc.jobId);
  const totals = docTotals(doc);
  const title = docTypeLabel(lang, doc.docType);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="my-6 w-full max-w-2xl rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <FileText className="h-4 w-4 text-blue-600" /> {title} #{doc.docNo}
          </h3>
          <div className="flex items-center gap-2">
            <Button onClick={onPrint}>
              <Printer className="h-4 w-4" /> {t("print")}
            </Button>
            <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="print-area p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-slate-900 pb-4">
            <div>
              <div className="text-xl font-bold text-slate-900">{settings.name}</div>
              <div className="text-xs text-slate-500">{settings.tagline}</div>
              <div className="mt-2 text-xs text-slate-600">{settings.address}</div>
              <div className="text-xs text-slate-600">
                {t("phone")}: {settings.contactNo}
              </div>
              {settings.email && <div className="text-xs text-slate-600">{settings.email}</div>}
              {settings.gstin && (
                <div className="text-xs text-slate-600">
                  {t("gstin")}: {settings.gstin}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900">{title}</div>
              <div className="text-xs text-slate-500">
                {t("docNo")}: {doc.docNo}
              </div>
              <div className="text-xs text-slate-500">
                {t("docDate")}: {formatDate(doc.date)}
              </div>
              {doc.validUntil && (
                <div className="text-xs text-slate-500">
                  {t("validUntil")}: {formatDate(doc.validUntil)}
                </div>
              )}
              <div className="mt-1 text-xs">
                <Badge tone={docStatusTone(doc.status)}>{docStatusLabel(lang, doc.status)}</Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t("billTo")}
              </div>
              <div className="text-sm font-semibold text-slate-900">{client?.name}</div>
              {client?.address && <div className="text-xs text-slate-600">{client.address}</div>}
              <div className="text-xs text-slate-600">{client?.phone}</div>
              {client?.gstin && <div className="text-xs text-slate-600">{t("gstin")}: {client.gstin}</div>}
            </div>
            {job && (
              <div className="text-right">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {t("jobs")}
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  #{job.jobNo} {job.title}
                </div>
              </div>
            )}
          </div>

          <table className="mt-5 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">{t("description")}</th>
                <th className="px-2 py-2 text-center">{t("qty")}</th>
                <th className="px-2 py-2 text-right">{t("rate")}</th>
                <th className="px-2 py-2 text-right">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {doc.items.map((item, i) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="px-2 py-2 text-slate-500">{i + 1}</td>
                  <td className="px-2 py-2 text-slate-800">{item.description}</td>
                  <td className="px-2 py-2 text-center text-slate-700">{item.qty}</td>
                  <td className="px-2 py-2 text-right text-slate-700">{money(item.rate, settings)}</td>
                  <td className="px-2 py-2 text-right font-medium text-slate-900">{money(item.qty * item.rate, settings)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-xs space-y-1 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{t("subtotal")}</span>
                <span>{money(totals.subtotal, settings)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t("discount")}</span>
                <span>-{money(doc.discount, settings)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t("taxAmount")} ({doc.taxRate}%)</span>
                <span>{money(totals.taxAmount, settings)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-slate-900 pt-1 text-base font-bold text-slate-900">
                <span>{t("total")}</span>
                <span>{money(totals.total, settings)}</span>
              </div>
            </div>
          </div>

          {doc.notes && (
            <div className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <span className="font-semibold">{t("notes")}: </span>
              {doc.notes}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between text-xs text-slate-400">
            <div>{settings.tagline}</div>
            <div>{t("thanksForBusiness") || "Thank you for your business!"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}