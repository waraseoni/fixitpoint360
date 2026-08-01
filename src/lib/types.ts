export type Role = "owner" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: Role;
  designation: string;
  status: "active" | "inactive";
  salary: number;
  commissionRate: number;
  joinedAt: string;
}

export type ClientType = "residential" | "business" | "corporate";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
  type: ClientType;
  gstin?: string;
  notes?: string;
  createdAt: string;
}

export type ServiceCategory =
  | "cctv"
  | "computer"
  | "printer"
  | "household"
  | "other";

export type JobStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "partial" | "paid";
export type Priority = "low" | "normal" | "high" | "urgent";
export type PaymentMode = "cash" | "upi" | "bank" | "card" | "pending";

export interface Job {
  id: string;
  jobNo: number;
  clientId: string;
  category: ServiceCategory;
  title: string;
  description?: string;
  status: JobStatus;
  priority: Priority;
  assignedTo?: string;
  scheduledDate?: string;
  completedDate?: string;
  charges: number;
  materialCost: number;
  advance: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface AMC {
  id: string;
  clientId: string;
  category: ServiceCategory;
  planName: string;
  amount: number;
  billingCycle: "monthly" | "quarterly" | "half_yearly" | "yearly";
  startDate?: string;
  endDate?: string;
  status: "active" | "expired" | "cancelled";
  notes?: string;
  createdAt: string;
}

export type AttendanceStatus = "present" | "absent" | "half_day" | "leave";

export interface Attendance {
  id: string;
  staffId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

export interface SalaryRecord {
  id: string;
  staffId: string;
  month: string;
  presentDays: number;
  basic: number;
  commission: number;
  taDa: number;
  bonus: number;
  deductions: number;
  net: number;
  paid: boolean;
  paidDate?: string;
  notes?: string;
}

export interface TaDa {
  id: string;
  staffId: string;
  date: string;
  type: "travel" | "daily_allowance" | "other";
  amount: number;
  description?: string;
  jobId?: string;
}

export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TxType;
  category: string;
  amount: number;
  date: string;
  mode: PaymentMode;
  clientId?: string;
  jobId?: string;
  staffId?: string;
  description?: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  clientId: string;
  date: string;
  type: "debit" | "credit";
  amount: number;
  refId?: string;
  description: string;
  mode: PaymentMode;
  createdAt: string;
}

export interface FirmSettings {
  name: string;
  tagline: string;
  contactNo: string;
  email: string;
  address: string;
  gstin?: string;
  currency: string;
}

export interface DB {
  users: User[];
  clients: Client[];
  jobs: Job[];
  amcs: AMC[];
  attendance: Attendance[];
  salary: SalaryRecord[];
  tada: TaDa[];
  transactions: Transaction[];
  ledger: LedgerEntry[];
  settings: FirmSettings;
  jobCounter: number;
}
