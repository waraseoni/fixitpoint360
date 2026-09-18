import type {
  AMC,
  Attendance,
  Client,
  DB,
  Doc,
  DocItem,
  FirmSettings,
  InventoryItem,
  Job,
  LedgerEntry,
  SalaryRecord,
  TaDa,
  Transaction,
  User,
} from "./types";

export type ProfileRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "owner" | "staff";
  designation: string;
  status: "active" | "inactive";
  salary: number;
  commission_rate: number;
  joined_at: string;
};

export type ClientRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  pincode: string | null;
  type: Client["type"];
  gstin: string | null;
  notes: string | null;
  created_at: string;
};

export type JobRow = {
  id: string;
  job_no: number;
  client_id: string;
  category: Job["category"];
  title: string;
  description: string | null;
  status: Job["status"];
  priority: Job["priority"];
  assigned_to: string | null;
  scheduled_date: string | null;
  completed_date: string | null;
  charges: number;
  material_cost: number;
  advance: number;
  payment_status: Job["paymentStatus"];
  payment_mode: Job["paymentMode"];
  notes: string | null;
  created_at: string;
  created_by: string;
};

export type AMCRow = {
  id: string;
  client_id: string;
  category: AMC["category"];
  plan_name: string;
  amount: number;
  billing_cycle: AMC["billingCycle"];
  start_date: string | null;
  end_date: string | null;
  status: AMC["status"];
  notes: string | null;
  created_at: string;
};

export type AttendanceRow = {
  id: string;
  staff_id: string;
  date: string;
  status: Attendance["status"];
  check_in: string | null;
  check_out: string | null;
  notes: string | null;
};

export type SalaryRow = {
  id: string;
  staff_id: string;
  month: string;
  present_days: number;
  basic: number;
  commission: number;
  ta_da: number;
  bonus: number;
  deductions: number;
  net: number;
  paid: boolean;
  paid_date: string | null;
  notes: string | null;
};

export type TaDaRow = {
  id: string;
  staff_id: string;
  date: string;
  type: TaDa["type"];
  amount: number;
  description: string | null;
  job_id: string | null;
};

export type TransactionRow = {
  id: string;
  type: Transaction["type"];
  category: string;
  amount: number;
  date: string;
  mode: Transaction["mode"];
  client_id: string | null;
  job_id: string | null;
  staff_id: string | null;
  description: string | null;
  created_at: string;
};

export type LedgerRow = {
  id: string;
  client_id: string;
  date: string;
  type: LedgerEntry["type"];
  amount: number;
  ref_id: string | null;
  description: string;
  mode: LedgerEntry["mode"];
  created_at: string;
};

export type DocRow = {
  id: string;
  doc_no: number;
  doc_type: Doc["docType"];
  client_id: string;
  job_id: string | null;
  doc_date: string;
  valid_until: string | null;
  items: DocItem[];
  discount: number;
  tax_rate: number;
  notes: string | null;
  status: Doc["status"];
  created_at: string;
};

export type InventoryRow = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  reorder_level: number;
  notes: string | null;
  updated_at: string;
  created_at: string;
};

const num = (v: number | string | null): number => Number(v) || 0;

export const toUser = (r: ProfileRow): User => ({
  id: r.id,
  name: r.name,
  email: r.email,
  phone: r.phone,
  role: r.role,
  designation: r.designation,
  status: r.status,
  salary: num(r.salary),
  commissionRate: num(r.commission_rate),
  joinedAt: r.joined_at || "",
});

export const toClient = (r: ClientRow): Client => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  email: r.email || undefined,
  address: r.address || undefined,
  city: r.city || undefined,
  pincode: r.pincode || undefined,
  type: r.type,
  gstin: r.gstin || undefined,
  notes: r.notes || undefined,
  createdAt: r.created_at,
});

export const fromClient = (c: Client): ClientRow => ({
  id: c.id,
  name: c.name,
  phone: c.phone,
  email: c.email || null,
  address: c.address || null,
  city: c.city || null,
  pincode: c.pincode || null,
  type: c.type,
  gstin: c.gstin || null,
  notes: c.notes || null,
  created_at: c.createdAt,
});

export const toJob = (r: JobRow): Job => ({
  id: r.id,
  jobNo: r.job_no,
  clientId: r.client_id,
  category: r.category,
  title: r.title,
  description: r.description || undefined,
  status: r.status,
  priority: r.priority,
  assignedTo: r.assigned_to || undefined,
  scheduledDate: r.scheduled_date || undefined,
  completedDate: r.completed_date || undefined,
  charges: num(r.charges),
  materialCost: num(r.material_cost),
  advance: num(r.advance),
  paymentStatus: r.payment_status,
  paymentMode: r.payment_mode,
  notes: r.notes || undefined,
  createdAt: r.created_at,
  createdBy: r.created_by,
});

export const fromJob = (j: Job): JobRow => ({
  id: j.id,
  job_no: j.jobNo,
  client_id: j.clientId,
  category: j.category,
  title: j.title,
  description: j.description || null,
  status: j.status,
  priority: j.priority,
  assigned_to: j.assignedTo || null,
  scheduled_date: j.scheduledDate || null,
  completed_date: j.completedDate || null,
  charges: j.charges || 0,
  material_cost: j.materialCost || 0,
  advance: j.advance || 0,
  payment_status: j.paymentStatus,
  payment_mode: j.paymentMode,
  notes: j.notes || null,
  created_at: j.createdAt,
  created_by: j.createdBy,
});

export const toAMC = (r: AMCRow): AMC => ({
  id: r.id,
  clientId: r.client_id,
  category: r.category,
  planName: r.plan_name,
  amount: num(r.amount),
  billingCycle: r.billing_cycle,
  startDate: r.start_date || undefined,
  endDate: r.end_date || undefined,
  status: r.status,
  notes: r.notes || undefined,
  createdAt: r.created_at,
});

export const fromAMC = (a: AMC): AMCRow => ({
  id: a.id,
  client_id: a.clientId,
  category: a.category,
  plan_name: a.planName,
  amount: a.amount || 0,
  billing_cycle: a.billingCycle,
  start_date: a.startDate || null,
  end_date: a.endDate || null,
  status: a.status,
  notes: a.notes || null,
  created_at: a.createdAt,
});

export const toAttendance = (r: AttendanceRow): Attendance => ({
  id: r.id,
  staffId: r.staff_id,
  date: r.date,
  status: r.status,
  checkIn: r.check_in || undefined,
  checkOut: r.check_out || undefined,
  notes: r.notes || undefined,
});

export const fromAttendance = (a: Attendance): AttendanceRow => ({
  id: a.id,
  staff_id: a.staffId,
  date: a.date,
  status: a.status,
  check_in: a.checkIn || null,
  check_out: a.checkOut || null,
  notes: a.notes || null,
});

export const toSalary = (r: SalaryRow): SalaryRecord => ({
  id: r.id,
  staffId: r.staff_id,
  month: r.month,
  presentDays: num(r.present_days),
  basic: num(r.basic),
  commission: num(r.commission),
  taDa: num(r.ta_da),
  bonus: num(r.bonus),
  deductions: num(r.deductions),
  net: num(r.net),
  paid: !!r.paid,
  paidDate: r.paid_date || undefined,
  notes: r.notes || undefined,
});

export const fromSalary = (s: SalaryRecord): SalaryRow => ({
  id: s.id,
  staff_id: s.staffId,
  month: s.month,
  present_days: s.presentDays,
  basic: s.basic,
  commission: s.commission,
  ta_da: s.taDa,
  bonus: s.bonus,
  deductions: s.deductions,
  net: s.net,
  paid: s.paid,
  paid_date: s.paidDate || null,
  notes: s.notes || null,
});

export const toTaDa = (r: TaDaRow): TaDa => ({
  id: r.id,
  staffId: r.staff_id,
  date: r.date,
  type: r.type,
  amount: num(r.amount),
  description: r.description || undefined,
  jobId: r.job_id || undefined,
});

export const fromTaDa = (t: TaDa): TaDaRow => ({
  id: t.id,
  staff_id: t.staffId,
  date: t.date,
  type: t.type,
  amount: t.amount,
  description: t.description || null,
  job_id: t.jobId || null,
});

export const toTransaction = (r: TransactionRow): Transaction => ({
  id: r.id,
  type: r.type,
  category: r.category,
  amount: num(r.amount),
  date: r.date,
  mode: r.mode,
  clientId: r.client_id || undefined,
  jobId: r.job_id || undefined,
  staffId: r.staff_id || undefined,
  description: r.description || undefined,
  createdAt: r.created_at,
});

export const fromTransaction = (t: Transaction): TransactionRow => ({
  id: t.id,
  type: t.type,
  category: t.category,
  amount: t.amount || 0,
  date: t.date,
  mode: t.mode,
  client_id: t.clientId || null,
  job_id: t.jobId || null,
  staff_id: t.staffId || null,
  description: t.description || null,
  created_at: t.createdAt,
});

export const toLedger = (r: LedgerRow): LedgerEntry => ({
  id: r.id,
  clientId: r.client_id,
  date: r.date,
  type: r.type,
  amount: num(r.amount),
  refId: r.ref_id || undefined,
  description: r.description,
  mode: r.mode,
  createdAt: r.created_at,
});

export const fromLedger = (e: LedgerEntry): LedgerRow => ({
  id: e.id,
  client_id: e.clientId,
  date: e.date,
  type: e.type,
  amount: e.amount || 0,
  ref_id: e.refId || null,
  description: e.description,
  mode: e.mode,
  created_at: e.createdAt,
});

export const toDoc = (r: DocRow): Doc => ({
  id: r.id,
  docNo: r.doc_no,
  docType: r.doc_type,
  clientId: r.client_id,
  jobId: r.job_id || undefined,
  date: r.doc_date,
  validUntil: r.valid_until || undefined,
  items: Array.isArray(r.items) ? r.items : [],
  discount: num(r.discount),
  taxRate: num(r.tax_rate),
  notes: r.notes || undefined,
  status: r.status,
  createdAt: r.created_at,
});

export const fromDoc = (d: Doc): DocRow => ({
  id: d.id,
  doc_no: d.docNo,
  doc_type: d.docType,
  client_id: d.clientId,
  job_id: d.jobId || null,
  doc_date: d.date,
  valid_until: d.validUntil || null,
  items: d.items,
  discount: d.discount || 0,
  tax_rate: d.taxRate || 0,
  notes: d.notes || null,
  status: d.status,
  created_at: d.createdAt,
});

export const toInventoryItem = (r: InventoryRow): InventoryItem => ({
  id: r.id,
  name: r.name,
  category: r.category,
  unit: r.unit,
  quantity: num(r.quantity),
  costPrice: num(r.cost_price),
  sellingPrice: num(r.selling_price),
  reorderLevel: num(r.reorder_level),
  notes: r.notes || undefined,
  updatedAt: r.updated_at,
  createdAt: r.created_at,
});

export const fromInventoryItem = (i: InventoryItem): InventoryRow => ({
  id: i.id,
  name: i.name,
  category: i.category,
  unit: i.unit,
  quantity: i.quantity || 0,
  cost_price: i.costPrice || 0,
  selling_price: i.sellingPrice || 0,
  reorder_level: i.reorderLevel || 0,
  notes: i.notes || null,
  updated_at: i.updatedAt,
  created_at: i.createdAt,
});

export const defaultSettings: FirmSettings = {
  name: "FixitPoint360",
  tagline: "Complete IT & Home Services",
  contactNo: "",
  email: "",
  address: "",
  gstin: "",
  currency: "₹",
};

export const emptyDB = (): DB => ({
  users: [],
  clients: [],
  jobs: [],
  amcs: [],
  attendance: [],
  salary: [],
  tada: [],
  transactions: [],
  ledger: [],
  documents: [],
  inventory: [],
  settings: { ...defaultSettings },
  jobCounter: 0,
  docCounter: 0,
});
