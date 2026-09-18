import { create } from "zustand";
import type {
  AMC,
  Attendance,
  Client,
  DB,
  Doc,
  FirmSettings,
  InventoryItem,
  Job,
  LedgerEntry,
  Role,
  SalaryRecord,
  TaDa,
  Transaction,
  User,
} from "./types";
import { getSupabase } from "./supabase";
import { uid, toISO, daysInMonth } from "./format";
import {
  emptyDB,
  fromAMC,
  fromAttendance,
  fromClient,
  fromDoc,
  fromInventoryItem,
  fromJob,
  fromLedger,
  fromSalary,
  fromTaDa,
  fromTransaction,
  toAMC,
  toAttendance,
  toClient,
  toDoc,
  toInventoryItem,
  toJob,
  toLedger,
  toSalary,
  toTaDa,
  toTransaction,
  toUser,
  type AMCRow,
  type AttendanceRow,
  type ClientRow,
  type DocRow,
  type InventoryRow,
  type JobRow,
  type LedgerRow,
  type ProfileRow,
  type SalaryRow,
  type TaDaRow,
  type TransactionRow,
} from "./db";

export type Session = { id: string; name: string; email: string; role: Role } | null;

interface State extends DB {
  session: Session;
  ready: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;

  addUser: (u: Omit<User, "id">) => Promise<void>;
  updateUser: (id: string, patch: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  addClient: (c: Omit<Client, "id" | "createdAt">) => Promise<void>;
  updateClient: (id: string, patch: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  addJob: (j: Omit<Job, "id" | "jobNo" | "createdAt">) => Promise<void>;
  updateJob: (id: string, patch: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  recordJobPayment: (jobId: string, amount: number, mode: Job["paymentMode"], date: string) => Promise<void>;

  addAMC: (a: Omit<AMC, "id" | "createdAt">) => Promise<void>;
  updateAMC: (id: string, patch: Partial<AMC>) => Promise<void>;
  deleteAMC: (id: string) => Promise<void>;

  markAttendance: (a: Omit<Attendance, "id">) => Promise<void>;
  deleteAttendance: (id: string) => Promise<void>;

  generateSalary: (staffId: string, month: string, bonus: number, deductions: number) => Promise<SalaryRecord>;
  toggleSalaryPaid: (id: string) => Promise<void>;
  deleteSalary: (id: string) => Promise<void>;

  addTada: (t: Omit<TaDa, "id">) => Promise<void>;
  deleteTada: (id: string) => Promise<void>;

  addTransaction: (t: Omit<Transaction, "id" | "createdAt">) => Promise<void>;
  updateTransaction: (id: string, patch: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  addLedgerEntry: (e: Omit<LedgerEntry, "id" | "createdAt">) => Promise<void>;
  deleteLedgerEntry: (id: string) => Promise<void>;

  addDoc: (d: Omit<Doc, "id" | "docNo" | "createdAt">) => Promise<void>;
  updateDoc: (id: string, patch: Partial<Doc>) => Promise<void>;
  deleteDoc: (id: string) => Promise<void>;

  addInventoryItem: (i: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateInventoryItem: (id: string, patch: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  adjustStock: (id: string, quantity: number) => Promise<void>;

  updateSettings: (patch: Partial<FirmSettings>) => Promise<void>;
  resetDB: () => Promise<void>;
}

function recomputeJobPayment(db: DB, jobId: string): DB {
  const credits = db.ledger
    .filter((e) => e.refId === jobId && e.type === "credit")
    .reduce((s, e) => s + e.amount, 0);
  const job = db.jobs.find((j) => j.id === jobId);
  if (!job) return db;
  let paymentStatus: Job["paymentStatus"];
  if (job.charges <= 0) paymentStatus = "paid";
  else if (credits >= job.charges) paymentStatus = "paid";
  else if (credits > 0) paymentStatus = "partial";
  else paymentStatus = "unpaid";
  return { ...db, jobs: db.jobs.map((j) => (j.id === jobId ? { ...j, paymentStatus } : j)) };
}

function buildJobLedger(job: Job): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  if (job.charges > 0) {
    entries.push({
      id: uid("l"),
      clientId: job.clientId,
      date: toISO(new Date()),
      type: "debit",
      amount: job.charges,
      refId: job.id,
      description: `Job #${job.jobNo} - ${job.title}`,
      mode: "pending",
      createdAt: toISO(new Date()),
    });
  }
  if ((job.advance || 0) > 0) {
    entries.push({
      id: uid("l"),
      clientId: job.clientId,
      date: toISO(new Date()),
      type: "credit",
      amount: job.advance,
      refId: job.id,
      description: `Advance received - Job #${job.jobNo}`,
      mode: job.paymentMode,
      createdAt: toISO(new Date()),
    });
  }
  return entries;
}

async function all(table: string): Promise<unknown[]> {
  try {
    const { data, error } = await getSupabase().from(table).select("*");
    if (error) throw error;
    return (data as unknown[] | null) || [];
  } catch (err) {
    const msg = (err as { message?: string })?.message || String(err);
    console.error(`[hydrate] failed to load "${table}":`, msg);
    throw err;
  }
}

async function safe<T = unknown>(table: string): Promise<T[]> {
  try {
    return (await all(table)) as T[];
  } catch {
    return [];
  }
}

async function fetchProfiles(): Promise<User[]> {
  const rows = (await all("profiles")) as ProfileRow[];
  return rows.map(toUser);
}

async function fetchJobCounter(): Promise<number> {
  const { data, error } = await getSupabase().from("app_meta").select("*").eq("key", "job_counter").single();
  if (error || !data) return 0;
  const value = (data as { value?: { job_counter?: number } }).value;
  return Number(value?.job_counter) || 0;
}

async function authToken(): Promise<string> {
  const { data } = await getSupabase().auth.getSession();
  return data.session?.access_token || "";
}

async function adminFetch(body: unknown): Promise<Response> {
  return fetch("/api/admin/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await authToken()}`,
    },
    body: JSON.stringify(body),
  });
}

async function persistJobCounter(n: number): Promise<void> {
  await getSupabase()
    .from("app_meta")
    .upsert({ key: "job_counter", value: { job_counter: n } });
}

export function docTotals(d: Pick<Doc, "items" | "discount" | "taxRate">): {
  subtotal: number;
  taxAmount: number;
  total: number;
} {
  const subtotal = (d.items || []).reduce((s, it) => s + (it.qty || 0) * (it.rate || 0), 0);
  const taxAmount = (subtotal * (d.taxRate || 0)) / 100;
  const total = subtotal - (d.discount || 0) + taxAmount;
  return { subtotal, taxAmount, total };
}

export const useStore = create<State>()((set, get) => ({
  ...emptyDB(),
  session: null,
  ready: false,

  hydrate: async () => {
    try {
      const sup = getSupabase();
      const { data: authRes } = await sup.auth.getSession();
      const authSession = authRes.session;
      if (!authSession) {
        set({ session: null, ready: true });
        return;
      }
      const { data: profile } = await sup
        .from("profiles")
        .select("*")
        .eq("id", authSession.user.id)
        .single();
      if (!profile) {
        await sup.auth.signOut();
        set({ session: null, ready: true });
        return;
      }
      const [clients, jobs, amcs, attendance, salary, tada, transactions, ledger, documents, inventory, settingsRows, users, counter] =
        await Promise.all([
          safe<ClientRow>("clients"),
          safe<JobRow>("jobs"),
          safe<AMCRow>("amcs"),
          safe<AttendanceRow>("attendance"),
          safe<SalaryRow>("salary_records"),
          safe<TaDaRow>("tada"),
          safe<TransactionRow>("transactions"),
          safe<LedgerRow>("ledger_entries"),
          safe<DocRow>("documents"),
          safe<InventoryRow>("inventory"),
          safe("settings"),
          fetchProfiles(),
          fetchJobCounter(),
        ]);
      const firmRow = (settingsRows as { key: string; value?: unknown }[]).find((s) => s.key === "firm");
      const firm = (firmRow?.value || {}) as Partial<FirmSettings>;
      const u = toUser(profile as ProfileRow);
      const docCounter = (documents as DocRow[]).reduce((max, r) => Math.max(max, r.doc_no), 0);
      set({
        ...emptyDB(),
        users,
        clients: clients.map(toClient),
        jobs: jobs.map(toJob),
        amcs: amcs.map(toAMC),
        attendance: attendance.map(toAttendance),
        salary: salary.map(toSalary),
        tada: tada.map(toTaDa),
        transactions: transactions.map(toTransaction),
        ledger: ledger.map(toLedger),
        documents: documents.map(toDoc),
        inventory: inventory.map(toInventoryItem),
        settings: { ...emptyDB().settings, ...firm },
        jobCounter: counter,
        docCounter,
        session: { id: u.id, name: u.name, email: u.email, role: u.role },
        ready: true,
      });
    } catch (err) {
      console.error("hydrate failed", err);
      set({ ready: true });
    }
  },

  login: async (email, password) => {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;
    const { data: profile } = await getSupabase()
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();
    if (!profile) return false;
    const u = toUser(profile as ProfileRow);
    set({ session: { id: u.id, name: u.name, email: u.email, role: u.role } });
    return true;
  },

  logout: async () => {
    await getSupabase().auth.signOut();
    set({ session: null });
  },

  addUser: async (u) => {
    try {
      const res = await adminFetch({ action: "create", ...u });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to create user");
      const users = await fetchProfiles();
      set({ users });
    } catch (err) {
      console.error(err);
    }
  },

  updateUser: async (id, patch) => {
    try {
      const res = await adminFetch({ action: "update", id, ...patch });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to update user");
      const users = await fetchProfiles();
      set({ users });
    } catch (err) {
      console.error(err);
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await adminFetch({ action: "delete", id });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to delete user");
      const users = await fetchProfiles();
      set((s) => ({
        users,
        attendance: s.attendance.filter((a) => a.staffId !== id),
        salary: s.salary.filter((x) => x.staffId !== id),
        tada: s.tada.filter((x) => x.staffId !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  addClient: async (c) => {
    const now = toISO(new Date());
    const client: Client = { ...c, id: uid("c"), createdAt: now };
    try {
      await getSupabase().from("clients").insert(fromClient(client));
      set((s) => ({ clients: [...s.clients, client] }));
    } catch (err) {
      console.error(err);
    }
  },

  updateClient: async (id, patch) => {
    try {
      const current = get().clients.find((c) => c.id === id);
      if (!current) return;
      const updated = { ...current, ...patch };
      await getSupabase().from("clients").update(fromClient(updated)).eq("id", id);
      set((s) => ({ clients: s.clients.map((c) => (c.id === id ? updated : c)) }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteClient: async (id) => {
    try {
      const jobIds = get().jobs.filter((j) => j.clientId === id).map((j) => j.id);
      const sup = getSupabase();
      await sup.from("transactions").delete().eq("client_id", id);
      if (jobIds.length) {
        await sup.from("ledger_entries").delete().in("ref_id", jobIds);
      }
      await sup.from("clients").delete().eq("id", id);
      set((s) => ({
        clients: s.clients.filter((c) => c.id !== id),
        jobs: s.jobs.filter((j) => j.clientId !== id),
        amcs: s.amcs.filter((a) => a.clientId !== id),
        ledger: s.ledger.filter((e) => e.clientId !== id),
        transactions: s.transactions.filter((t) => t.clientId !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  addJob: async (j) => {
    const s = get();
    const jobNo = s.jobCounter + 1;
    const now = toISO(new Date());
    const job: Job = {
      ...j,
      id: uid("j"),
      jobNo,
      createdAt: now,
      advance: j.advance || 0,
      materialCost: j.materialCost || 0,
      charges: j.charges || 0,
      createdBy: s.session?.id || "",
    };
    const jobLedger = buildJobLedger(job);
    const advanceTx: Transaction[] = [];
    if ((job.advance || 0) > 0) {
      advanceTx.push({
        id: uid("tx"),
        type: "income",
        category: "Job / Service",
        amount: job.advance,
        date: now,
        mode: job.paymentMode,
        clientId: job.clientId,
        jobId: job.id,
        description: `Advance - Job #${jobNo}`,
        createdAt: now,
      });
    }
    let db: DB = {
      ...s,
      jobs: [...s.jobs, job],
      ledger: [...s.ledger, ...jobLedger],
      transactions: [...s.transactions, ...advanceTx],
      jobCounter: jobNo,
    };
    db = recomputeJobPayment(db, job.id);
    try {
      const sup = getSupabase();
      await sup.from("jobs").insert(fromJob(job));
      if (jobLedger.length) await sup.from("ledger_entries").insert(jobLedger.map(fromLedger));
      if (advanceTx.length) await sup.from("transactions").insert(advanceTx.map(fromTransaction));
      await persistJobCounter(jobNo);
      set(db);
    } catch (err) {
      console.error(err);
    }
  },

  updateJob: async (id, patch) => {
    const s = get();
    const job = s.jobs.find((j) => j.id === id);
    if (!job) return;
    const updated: Job = { ...job, ...patch };
    const jobLedger = buildJobLedger(updated);
    const otherLedger = s.ledger.filter((e) => e.refId !== id);
    let db: DB = { ...s, jobs: s.jobs.map((j) => (j.id === id ? updated : j)), ledger: [...otherLedger, ...jobLedger] };
    db = recomputeJobPayment(db, id);
    try {
      const sup = getSupabase();
      await sup.from("jobs").update(fromJob(updated)).eq("id", id);
      await sup.from("ledger_entries").delete().eq("ref_id", id);
      if (jobLedger.length) await sup.from("ledger_entries").insert(jobLedger.map(fromLedger));
      set(db);
    } catch (err) {
      console.error(err);
    }
  },

  deleteJob: async (id) => {
    try {
      const sup = getSupabase();
      await sup.from("ledger_entries").delete().eq("ref_id", id);
      await sup.from("jobs").delete().eq("id", id);
      set((s) => ({
        jobs: s.jobs.filter((j) => j.id !== id),
        ledger: s.ledger.filter((e) => e.refId !== id),
        transactions: s.transactions.filter((t) => t.jobId !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  recordJobPayment: async (jobId, amount, mode, date) => {
    const s = get();
    const job = s.jobs.find((j) => j.id === jobId);
    if (!job) return;
    const entry: LedgerEntry = {
      id: uid("l"),
      clientId: job.clientId,
      date,
      type: "credit",
      amount,
      refId: jobId,
      description: `Payment received - Job #${job.jobNo}`,
      mode,
      createdAt: toISO(new Date()),
    };
    const tx: Transaction = {
      id: uid("tx"),
      type: "income",
      category: "Job / Service",
      amount,
      date,
      mode,
      clientId: job.clientId,
      jobId,
      description: `Job #${job.jobNo} - ${job.title}`,
      createdAt: toISO(new Date()),
    };
    let db: DB = { ...s, ledger: [...s.ledger, entry], transactions: [...s.transactions, tx] };
    db = recomputeJobPayment(db, jobId);
    try {
      const sup = getSupabase();
      await sup.from("ledger_entries").insert(fromLedger(entry));
      await sup.from("transactions").insert(fromTransaction(tx));
      set(db);
    } catch (err) {
      console.error(err);
    }
  },

  addAMC: async (a) => {
    const amc: AMC = { ...a, id: uid("a"), createdAt: toISO(new Date()) };
    try {
      await getSupabase().from("amcs").insert(fromAMC(amc));
      set((s) => ({ amcs: [...s.amcs, amc] }));
    } catch (err) {
      console.error(err);
    }
  },

  updateAMC: async (id, patch) => {
    try {
      const current = get().amcs.find((a) => a.id === id);
      if (!current) return;
      const updated = { ...current, ...patch };
      await getSupabase().from("amcs").update(fromAMC(updated)).eq("id", id);
      set((s) => ({ amcs: s.amcs.map((a) => (a.id === id ? updated : a)) }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteAMC: async (id) => {
    try {
      await getSupabase().from("amcs").delete().eq("id", id);
      set((s) => ({ amcs: s.amcs.filter((a) => a.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  markAttendance: async (a) => {
    const s = get();
    const idx = s.attendance.findIndex((x) => x.staffId === a.staffId && x.date === a.date);
    const row: Attendance =
      idx >= 0 ? { ...s.attendance[idx], ...a, id: s.attendance[idx].id } : { ...a, id: uid("at") };
    const attendance =
      idx >= 0 ? s.attendance.map((x, i) => (i === idx ? row : x)) : [...s.attendance, row];
    try {
      await getSupabase().from("attendance").upsert(fromAttendance(row), { onConflict: "staff_id,date" });
      set({ attendance });
    } catch (err) {
      console.error(err);
    }
  },

  deleteAttendance: async (id) => {
    try {
      await getSupabase().from("attendance").delete().eq("id", id);
      set((s) => ({ attendance: s.attendance.filter((a) => a.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  generateSalary: async (staffId, month, bonus, deductions) => {
    const s = get();
    const user = s.users.find((u) => u.id === staffId);
    const att = s.attendance.filter((a) => a.staffId === staffId && a.date.startsWith(month));
    const presentDays =
      att.reduce((sum, a) => sum + (a.status === "present" ? 1 : a.status === "half_day" ? 0.5 : 0), 0);
    const totalDays = daysInMonth(month);
    const basic = user ? user.salary * (presentDays / totalDays) : 0;
    const commission = s.jobs
      .filter(
        (j) =>
          j.assignedTo === staffId &&
          j.status === "completed" &&
          (j.completedDate || "").startsWith(month)
      )
      .reduce((sum, j) => sum + (j.charges * (user?.commissionRate || 0)) / 100, 0);
    const taDa = s.tada
      .filter((t) => t.staffId === staffId && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0);
    const net = basic + commission + taDa + bonus - deductions;
    const existing = s.salary.find((x) => x.staffId === staffId && x.month === month);
    const rec: SalaryRecord = {
      id: existing ? existing.id : uid("s"),
      staffId,
      month,
      presentDays: Math.round(presentDays * 100) / 100,
      basic: Math.round(basic),
      commission: Math.round(commission),
      taDa,
      bonus,
      deductions,
      net: Math.round(net),
      paid: existing?.paid || false,
      paidDate: existing?.paidDate,
      notes: existing?.notes,
    };
    try {
      await getSupabase().from("salary_records").upsert(fromSalary(rec), { onConflict: "staff_id,month" });
      set((st) => ({
        salary: existing ? st.salary.map((x) => (x.id === existing.id ? rec : x)) : [...st.salary, rec],
      }));
    } catch (err) {
      console.error(err);
    }
    return rec;
  },

  toggleSalaryPaid: async (id) => {
    const s = get();
    const rec = s.salary.find((x) => x.id === id);
    if (!rec) return;
    const updated: SalaryRecord = {
      ...rec,
      paid: !rec.paid,
      paidDate: !rec.paid ? toISO(new Date()) : undefined,
    };
    try {
      await getSupabase().from("salary_records").update(fromSalary(updated)).eq("id", id);
      set((st) => ({ salary: st.salary.map((x) => (x.id === id ? updated : x)) }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteSalary: async (id) => {
    try {
      await getSupabase().from("salary_records").delete().eq("id", id);
      set((s) => ({ salary: s.salary.filter((x) => x.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  addTada: async (t) => {
    const row: TaDa = { ...t, id: uid("t") };
    try {
      await getSupabase().from("tada").insert(fromTaDa(row));
      set((s) => ({ tada: [...s.tada, row] }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteTada: async (id) => {
    try {
      await getSupabase().from("tada").delete().eq("id", id);
      set((s) => ({ tada: s.tada.filter((x) => x.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  addTransaction: async (t) => {
    const row: Transaction = { ...t, id: uid("tx"), createdAt: toISO(new Date()) };
    try {
      await getSupabase().from("transactions").insert(fromTransaction(row));
      set((s) => ({ transactions: [...s.transactions, row] }));
    } catch (err) {
      console.error(err);
    }
  },

  updateTransaction: async (id, patch) => {
    try {
      const current = get().transactions.find((t) => t.id === id);
      if (!current) return;
      const updated = { ...current, ...patch };
      await getSupabase().from("transactions").update(fromTransaction(updated)).eq("id", id);
      set((s) => ({ transactions: s.transactions.map((t) => (t.id === id ? updated : t)) }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteTransaction: async (id) => {
    try {
      await getSupabase().from("transactions").delete().eq("id", id);
      set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  addLedgerEntry: async (e) => {
    const row: LedgerEntry = { ...e, id: uid("l"), createdAt: toISO(new Date()) };
    try {
      await getSupabase().from("ledger_entries").insert(fromLedger(row));
      set((s) => ({ ledger: [...s.ledger, row] }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteLedgerEntry: async (id) => {
    const s = get();
    const entry = s.ledger.find((e) => e.id === id);
    try {
      await getSupabase().from("ledger_entries").delete().eq("id", id);
      let db: DB = { ...s, ledger: s.ledger.filter((e) => e.id !== id) };
      if (entry?.refId) db = recomputeJobPayment(db, entry.refId);
      set(db);
    } catch (err) {
      console.error(err);
    }
  },

  updateSettings: async (patch) => {
    const current = get().settings;
    const next: FirmSettings = { ...current, ...patch };
    try {
      await getSupabase().from("settings").upsert({ key: "firm", value: next });
      set({ settings: next });
    } catch (err) {
      console.error(err);
    }
  },

  addDoc: async (d) => {
    const s = get();
    const docNo = s.docCounter + 1;
    const doc: Doc = {
      ...d,
      id: uid("d"),
      docNo,
      items: d.items || [],
      discount: d.discount || 0,
      taxRate: d.taxRate || 0,
      createdAt: toISO(new Date()),
    };
    try {
      const sup = getSupabase();
      await sup.from("documents").insert(fromDoc(doc));
      await getSupabase().from("app_meta").upsert({ key: "doc_counter", value: { doc_counter: docNo } });
      set((st) => ({ documents: [...st.documents, doc], docCounter: docNo }));
    } catch (err) {
      console.error(err);
    }
  },

  updateDoc: async (id, patch) => {
    const current = get().documents.find((d) => d.id === id);
    if (!current) return;
    const updated = { ...current, ...patch };
    try {
      await getSupabase().from("documents").update(fromDoc(updated)).eq("id", id);
      set((st) => ({ documents: st.documents.map((d) => (d.id === id ? updated : d)) }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteDoc: async (id) => {
    try {
      await getSupabase().from("documents").delete().eq("id", id);
      set((st) => ({ documents: st.documents.filter((d) => d.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  addInventoryItem: async (i) => {
    const now = toISO(new Date());
    const item: InventoryItem = { ...i, id: uid("inv"), createdAt: now, updatedAt: now };
    try {
      await getSupabase().from("inventory").insert(fromInventoryItem(item));
      set((st) => ({ inventory: [...st.inventory, item] }));
    } catch (err) {
      console.error(err);
    }
  },

  updateInventoryItem: async (id, patch) => {
    const current = get().inventory.find((i) => i.id === id);
    if (!current) return;
    const updated = { ...current, ...patch, updatedAt: toISO(new Date()) };
    try {
      await getSupabase().from("inventory").update(fromInventoryItem(updated)).eq("id", id);
      set((st) => ({ inventory: st.inventory.map((i) => (i.id === id ? updated : i)) }));
    } catch (err) {
      console.error(err);
    }
  },

  deleteInventoryItem: async (id) => {
    try {
      await getSupabase().from("inventory").delete().eq("id", id);
      set((st) => ({ inventory: st.inventory.filter((i) => i.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },

  adjustStock: async (id, quantity) => {
    const current = get().inventory.find((i) => i.id === id);
    if (!current) return;
    const updated = { ...current, quantity: current.quantity + quantity, updatedAt: toISO(new Date()) };
    try {
      await getSupabase().from("inventory").update(fromInventoryItem(updated)).eq("id", id);
      set((st) => ({ inventory: st.inventory.map((i) => (i.id === id ? updated : i)) }));
    } catch (err) {
      console.error(err);
    }
  },

  resetDB: async () => {
    try {
      const sup = getSupabase();
      await Promise.all([
        sup.from("documents").delete().neq("id", ""),
        sup.from("inventory").delete().neq("id", ""),
        sup.from("ledger_entries").delete().neq("id", ""),
        sup.from("transactions").delete().neq("id", ""),
        sup.from("salary_records").delete().neq("id", ""),
        sup.from("tada").delete().neq("id", ""),
        sup.from("attendance").delete().neq("id", ""),
        sup.from("amcs").delete().neq("id", ""),
        sup.from("jobs").delete().neq("id", ""),
        sup.from("clients").delete().neq("id", ""),
      ]);
      await persistJobCounter(0);
      set({ ...emptyDB(), session: get().session, users: get().users, settings: get().settings });
    } catch (err) {
      console.error(err);
    }
  },
}));

export const getBalance = (entries: LedgerEntry[]): number =>
  entries.reduce((sum, e) => sum + (e.type === "debit" ? e.amount : -e.amount), 0);
