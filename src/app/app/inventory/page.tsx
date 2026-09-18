"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Check,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { INVENTORY_CATEGORIES } from "@/lib/constants";
import { money } from "@/lib/format";
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
  StatCard,
  Badge,
} from "@/components/ui";
import type { InventoryItem } from "@/lib/types";

const emptyForm = {
  name: "",
  category: "other",
  unit: "pcs",
  quantity: "",
  costPrice: "",
  sellingPrice: "",
  reorderLevel: "",
  notes: "",
};

const catLabel = (lang: "en" | "hi", value: string): string => {
  const c = INVENTORY_CATEGORIES.find((x) => x.value === value);
  return c ? (lang === "hi" ? c.labelHi : c.labelEn) : value;
};

export default function InventoryPage() {
  const { inventory, settings, session, addInventoryItem, updateInventoryItem, deleteInventoryItem, adjustStock } = useStore();
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [stockTarget, setStockTarget] = useState<InventoryItem | null>(null);
  const [stockQty, setStockQty] = useState("");
  const [stockMode, setStockMode] = useState<"in" | "out">("in");

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (i: InventoryItem) => {
    setEditing(i);
    setForm({
      name: i.name,
      category: i.category,
      unit: i.unit,
      quantity: String(i.quantity || ""),
      costPrice: String(i.costPrice || ""),
      sellingPrice: String(i.sellingPrice || ""),
      reorderLevel: String(i.reorderLevel || ""),
      notes: i.notes || "",
    });
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.name.trim()) return;
    if (editing) {
      updateInventoryItem(editing.id, {
        name: form.name,
        category: form.category,
        unit: form.unit,
        quantity: Number(form.quantity) || 0,
        costPrice: Number(form.costPrice) || 0,
        sellingPrice: Number(form.sellingPrice) || 0,
        reorderLevel: Number(form.reorderLevel) || 0,
        notes: form.notes || undefined,
      });
    } else {
      addInventoryItem({
        name: form.name,
        category: form.category,
        unit: form.unit,
        quantity: Number(form.quantity) || 0,
        costPrice: Number(form.costPrice) || 0,
        sellingPrice: Number(form.sellingPrice) || 0,
        reorderLevel: Number(form.reorderLevel) || 0,
        notes: form.notes || undefined,
      });
    }
    setModalOpen(false);
  };

  const applyStock = () => {
    const n = Number(stockQty);
    if (!stockTarget || !n || n <= 0) return;
    adjustStock(stockTarget.id, stockMode === "in" ? n : -n);
    setStockTarget(null);
    setStockQty("");
  };

  const filtered = inventory
    .filter((i) => catFilter === "all" || i.category === catFilter)
    .filter((i) => (i.name + i.category + (i.notes || "")).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const lowItems = inventory.filter((i) => i.quantity <= i.reorderLevel && i.reorderLevel > 0);
  const totalUnits = inventory.reduce((s, i) => s + i.quantity, 0);
  const stockValue = inventory.reduce((s, i) => s + i.costPrice * i.quantity, 0);

  return (
    <div>
      <PageTitle
        title={t("inventory")}
        subtitle={t("inventoryList")}
        action={
          session && canManage(session.role) && (
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4" /> {t("addItemInv")}
            </Button>
          )
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("totalItems")} value={String(inventory.length)} icon={<Package className="h-5 w-5" />} tone="blue" />
        <StatCard label={t("totalUnits")} value={String(totalUnits)} icon={<Package className="h-5 w-5" />} tone="indigo" />
        <StatCard label={t("lowItems")} value={String(lowItems.length)} icon={<AlertTriangle className="h-5 w-5" />} tone="red" />
        <StatCard label={t("invValue")} value={money(stockValue, settings)} icon={<Package className="h-5 w-5" />} tone="green" />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="w-full sm:w-72">
          <SearchBox value={q} onChange={setQ} placeholder={`${t("search")}...`} />
        </div>
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="w-48">
          <option value="all">{t("all")} {t("category")}</option>
          {INVENTORY_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {lang === "hi" ? c.labelHi : c.labelEn}
            </option>
          ))}
        </Select>
      </div>

      <Card>
        <CardHeader title={t("inventory")} />
        {filtered.length === 0 ? (
          <EmptyState message={t("noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <Th>{t("itemName")}</Th>
                  <Th>{t("category")}</Th>
                  <Th>{t("stockQty")}</Th>
                  <Th>{t("costPrice")}</Th>
                  <Th>{t("sellingPrice")}</Th>
                  <Th>{t("reorderLevel")}</Th>
                  <Th>{t("actions")}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((i) => {
                  const isLow = i.quantity <= i.reorderLevel && i.reorderLevel > 0;
                  return (
                    <tr key={i.id} className="hover:bg-slate-50">
                      <Td>
                        <div className="font-medium text-slate-900">{i.name}</div>
                        {i.notes && <div className="max-w-[160px] truncate text-xs text-slate-400">{i.notes}</div>}
                      </Td>
                      <Td>
                        <Badge tone="slate">{catLabel(lang, i.category)}</Badge>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isLow ? "text-red-600" : "text-slate-900"}`}>
                            {i.quantity} {i.unit}
                          </span>
                          {isLow && <Badge tone="red">{t("lowStock")}</Badge>}
                        </div>
                      </Td>
                      <Td>{money(i.costPrice, settings)}</Td>
                      <Td className="font-medium">{money(i.sellingPrice, settings)}</Td>
                      <Td>{i.reorderLevel}</Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" className="text-emerald-600 hover:bg-emerald-50 px-2" title={t("addStock")} onClick={() => { setStockTarget(i); setStockMode("in"); setStockQty(""); }}>
                            <TrendingUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" className="text-red-600 hover:bg-red-50 px-2" title={t("removeStock")} onClick={() => { setStockTarget(i); setStockMode("out"); setStockQty(""); }}>
                            <TrendingDown className="h-4 w-4" />
                          </Button>
                          {session && canManage(session.role) && (
                            <>
                              <Button variant="ghost" className="px-2" title={t("edit")} onClick={() => openEdit(i)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                className="px-2 text-red-600 hover:bg-red-50"
                                title={t("delete")}
                                onClick={() => confirm(t("confirmDelete")) && deleteInventoryItem(i.id)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t("editItemInv") : t("addItemInv")}>
        <div className="space-y-3">
          <Field label={t("itemName")} required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("category")}>
              <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {INVENTORY_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {lang === "hi" ? c.labelHi : c.labelEn}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("unit")}>
              <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            </Field>
            <Field label={t("stockQty")}>
              <Input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </Field>
            <Field label={t("reorderLevel")}>
              <Input type="number" min="0" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />
            </Field>
            <Field label={t("costPrice")}>
              <Input type="number" min="0" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
            </Field>
            <Field label={t("sellingPrice")}>
              <Input type="number" min="0" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
            </Field>
          </div>
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

      <Modal open={!!stockTarget} onClose={() => setStockTarget(null)} title={t("adjustStock")}>
        <div className="space-y-3">
          {stockTarget && (
            <div className="rounded-lg bg-slate-50 p-3 text-sm">
              <div className="font-semibold text-slate-900">{stockTarget.name}</div>
              <div className="text-slate-500">
                {t("stockQty")}: {stockTarget.quantity} {stockTarget.unit}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("type")}>
              <Select value={stockMode} onChange={(e) => setStockMode(e.target.value as "in" | "out")}>
                <option value="in">{t("stockIn")}</option>
                <option value="out">{t("stockOut")}</option>
              </Select>
            </Field>
            <Field label={t("qty")}>
              <Input type="number" min="0" value={stockQty} onChange={(e) => setStockQty(e.target.value)} />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setStockTarget(null)}>
              {t("cancel")}
            </Button>
            <Button onClick={applyStock}>{t("save")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}