"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

export type Lang = "en" | "hi";

const STORAGE_KEY = "fixitpoint360-lang";

function readLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "hi" || saved === "en" ? saved : "en";
}

let langValue: Lang = readLang();
const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getLangSnapshot(): Lang {
  return langValue;
}

function getLangServerSnapshot(): Lang {
  return "en";
}

function notify() {
  listeners.forEach((cb) => cb());
}

function setLangValue(l: Lang) {
  langValue = l;
  window.localStorage.setItem(STORAGE_KEY, l);
  notify();
}

const dict = {
  appName: { en: "FixitPoint360", hi: "फिक्सिटपॉइंट360" },
  tagline: { en: "IT & Home Services", hi: "आईटी एवं घरेलू सेवाएँ" },
  login: { en: "Login", hi: "लॉगिन" },
  logout: { en: "Logout", hi: "लॉगआउट" },
  email: { en: "Email", hi: "ईमेल" },
  password: { en: "Password", hi: "पासवर्ड" },
  signIn: { en: "Sign In", hi: "साइन इन" },
  signingIn: { en: "Signing in...", hi: "साइन इन हो रहा है..." },
  goToWebsite: { en: "Go to website", hi: "वेबसाइट पर जाएँ" },
  wrongCredentials: { en: "Invalid email or password", hi: "गलत ईमेल या पासवर्ड" },

  dashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  clients: { en: "Clients", hi: "ग्राहक" },
  jobs: { en: "Jobs / Services", hi: "जॉब / सेवाएँ" },
  amc: { en: "AMC", hi: "एएमसी" },
  staff: { en: "Staff", hi: "स्टाफ" },
  team: { en: "Team", hi: "टीम" },
  users: { en: "Users", hi: "यूज़र्स" },
  userList: { en: "User List", hi: "यूज़र सूची" },
  addUser: { en: "Add User", hi: "यूज़र जोड़ें" },
  editUser: { en: "Edit User", hi: "यूज़र संपादित करें" },
  activeUsers: { en: "Active Users", hi: "सक्रिय यूज़र" },
  roleOwner: { en: "Owner", hi: "मालिक" },
  roleAdmin: { en: "Admin", hi: "एडमिन" },
  roleStaff: { en: "Staff", hi: "स्टाफ" },
  attendance: { en: "Attendance", hi: "उपस्थिति" },
  salary: { en: "Salary", hi: "वेतन" },
  taDa: { en: "TA / DA", hi: "टीए / डीए" },
  money: { en: "Income / Expense", hi: "आय / व्यय" },
  ledger: { en: "Ledger", hi: "बही-खाता" },
  settings: { en: "Settings", hi: "सेटिंग्स" },
  hello: { en: "Hello", hi: "नमस्ते" },
  you: { en: "You", hi: "आप" },
  language: { en: "Language", hi: "भाषा" },

  add: { en: "Add", hi: "जोड़ें" },
  edit: { en: "Edit", hi: "संपादित" },
  save: { en: "Save", hi: "सहेजें" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  delete: { en: "Delete", hi: "हटाएँ" },
  search: { en: "Search", hi: "खोजें" },
  filter: { en: "Filter", hi: "फ़िल्टर" },
  all: { en: "All", hi: "सभी" },
  name: { en: "Name", hi: "नाम" },
  phone: { en: "Phone", hi: "फोन" },
  emailLabel: { en: "Email", hi: "ईमेल" },
  address: { en: "Address", hi: "पता" },
  city: { en: "City", hi: "शहर" },
  pincode: { en: "Pincode", hi: "पिनकोड" },
  type: { en: "Type", hi: "प्रकार" },
  notes: { en: "Notes", hi: "टिप्पणी" },
  date: { en: "Date", hi: "दिनांक" },
  amount: { en: "Amount", hi: "राशि" },
  description: { en: "Description", hi: "विवरण" },
  category: { en: "Category", hi: "श्रेणी" },
  mode: { en: "Mode", hi: "माध्यम" },
  status: { en: "Status", hi: "स्थिति" },
  actions: { en: "Actions", hi: "कार्रवाई" },
  noRecords: { en: "No records found", hi: "कोई रिकॉर्ड नहीं मिला" },
  close: { en: "Close", hi: "बंद करें" },
  details: { en: "Details", hi: "विवरण" },
  confirmDelete: { en: "Are you sure you want to delete this?", hi: "क्या आप वाकई इसे हटाना चाहते हैं?" },
  total: { en: "Total", hi: "कुल" },
  print: { en: "Print", hi: "प्रिंट" },
  whatsapp: { en: "WhatsApp", hi: "व्हाट्सएप" },
  call: { en: "Call", hi: "कॉल" },
  balance: { en: "Balance", hi: "शेष" },
  createdOn: { en: "Created on", hi: "बनाया गया" },
  optional: { en: "Optional", hi: "वैकल्पिक" },

  overview: { en: "Overview", hi: "अवलोकन" },
  groupCustomers: { en: "Customers", hi: "ग्राहक" },
  groupServices: { en: "Services", hi: "सेवाएँ" },
  groupTeam: { en: "Team", hi: "टीम" },
  groupFinance: { en: "Finance", hi: "वित्त" },
  groupSystem: { en: "System", hi: "सिस्टम" },
  moreMenu: { en: "Menu", hi: "मेन्यू" },
  collapse: { en: "Collapse", hi: "बंद करें" },
  expand: { en: "Expand", hi: "खोलें" },
  quickActions: { en: "Quick Actions", hi: "त्वरित कार्रवाई" },
  shareWebsite: { en: "Share Website", hi: "वेबसाइट साझा करें" },
  shareQrCaption: { en: "Scan this QR to share the website URL with customers", hi: "ग्राहकों के साथ वेबसाइट यूआरएल साझा करने के लिए यह क्यूआर स्कैन करें" },
  totalClients: { en: "Total Clients", hi: "कुल ग्राहक" },
  activeJobs: { en: "Active Jobs", hi: "चालू जॉब" },
  dueAmount: { en: "Amount Due", hi: "बकाया राशि" },
  incomeThisMonth: { en: "Income (This Month)", hi: "आय (इस माह)" },
  expenseThisMonth: { en: "Expense (This Month)", hi: "व्यय (इस माह)" },
  netCash: { en: "Net Cash Flow", hi: "नकदी प्रवाह" },
  recentJobs: { en: "Recent Jobs", hi: "हाल के जॉब" },
  openLedgers: { en: "Pending Client Dues", hi: "लंबित ग्राहक बकाया" },
  amcActive: { en: "Active AMCs", hi: "सक्रिय एएमसी" },
  staffCount: { en: "Staff", hi: "स्टाफ" },
  todayJobs: { en: "Today's Jobs", hi: "आज के जॉब" },
  welcome: { en: "Welcome", hi: "स्वागत है" },

  addClient: { en: "Add Client", hi: "ग्राहक जोड़ें" },
  editClient: { en: "Edit Client", hi: "ग्राहक संपादित करें" },
  clientList: { en: "Client List", hi: "ग्राहक सूची" },
  clientDetails: { en: "Client Details", hi: "ग्राहक विवरण" },
  clientType: { en: "Client Type", hi: "ग्राहक प्रकार" },
  gstin: { en: "GSTIN", hi: "जीएसटीआईएन" },
  ledgerOf: { en: "Ledger of", hi: "की बही" },
  credit: { en: "Credit", hi: "जमा" },
  debit: { en: "Debit", hi: "नामे" },

  addJob: { en: "New Job", hi: "नया जॉब" },
  editJob: { en: "Edit Job", hi: "जॉब संपादित करें" },
  jobNo: { en: "Job #", hi: "जॉब #" },
  jobTitle: { en: "Job Title", hi: "जॉब शीर्षक" },
  jobList: { en: "Jobs & Services", hi: "जॉब और सेवाएँ" },
  serviceCategory: { en: "Service Category", hi: "सेवा श्रेणी" },
  priority: { en: "Priority", hi: "प्राथमिकता" },
  assignedTo: { en: "Assigned To", hi: "सौंपा गया" },
  scheduledDate: { en: "Scheduled Date", hi: "निर्धारित तिथि" },
  charges: { en: "Job Charges", hi: "जॉब शुल्क" },
  materialCost: { en: "Material Cost", hi: "सामग्री लागत" },
  advance: { en: "Advance", hi: "अग्रिम" },
  paymentStatus: { en: "Payment", hi: "भुगतान" },
  paid: { en: "Paid", hi: "भुगतान हुआ" },
  partial: { en: "Partial", hi: "आंशिक" },
  unpaid: { en: "Unpaid", hi: "अवैतनिक" },
  recordPayment: { en: "Record Payment", hi: "भुगतान दर्ज करें" },
  paymentReceived: { en: "Payment Received", hi: "भुगतान प्राप्त" },
  markCompleted: { en: "Mark Completed", hi: "पूर्ण करें" },
  completedOn: { en: "Completed On", hi: "पूर्ण तिथि" },
  jobDetail: { en: "Job Details", hi: "जॉब विवरण" },
  clientRef: { en: "Client", hi: "ग्राहक" },

  addAMC: { en: "New AMC", hi: "नया एएमसी" },
  editAMC: { en: "Edit AMC", hi: "एएमसी संपादित करें" },
  amcList: { en: "AMC Contracts", hi: "एएमसी अनुबंध" },
  planName: { en: "Plan Name", hi: "योजना का नाम" },
  billingCycle: { en: "Billing Cycle", hi: "बिलिंग चक्र" },
  startDate: { en: "Start Date", hi: "आरंभ तिथि" },
  endDate: { en: "End Date", hi: "समाप्ति तिथि" },
  active: { en: "Active", hi: "सक्रिय" },
  expired: { en: "Expired", hi: "समाप्त" },
  cancelled: { en: "Cancelled", hi: "रद्द" },

  addStaff: { en: "Add Staff", hi: "स्टाफ जोड़ें" },
  editStaff: { en: "Edit Staff", hi: "स्टाफ संपादित करें" },
  staffList: { en: "Staff Members", hi: "स्टाफ सदस्य" },
  designation: { en: "Designation", hi: "पदनाम" },
  basicSalary: { en: "Basic Salary", hi: "मूल वेतन" },
  commissionRate: { en: "Commission (%)", hi: "कमीशन (%)" },
  joinedOn: { en: "Joined On", hi: "शामिल हुआ" },
  role: { en: "Role", hi: "भूमिका" },
  leaveBlankToKeep: { en: "Leave blank to keep current password", hi: "पासवर्ड बदलने के लिए खाली छोड़ें" },
  staffDetails: { en: "Staff Details", hi: "स्टाफ विवरण" },
  jobHistory: { en: "Job History", hi: "जॉब इतिहास" },
  activeJobsOf: { en: "Active Jobs", hi: "चालू जॉब" },

  markAttendance: { en: "Mark Attendance", hi: "उपस्थिति दर्ज करें" },
  present: { en: "Present", hi: "उपस्थित" },
  absent: { en: "Absent", hi: "अनुपस्थित" },
  halfDay: { en: "Half Day", hi: "आधा दिन" },
  leave: { en: "Leave", hi: "अवकाश" },
  checkIn: { en: "Check-in", hi: "प्रवेश समय" },
  checkOut: { en: "Check-out", hi: "निकास समय" },
  presentDays: { en: "Present Days", hi: "उपस्थित दिन" },
  attendanceReport: { en: "Attendance Report", hi: "उपस्थिति रिपोर्ट" },

  generateSalary: { en: "Generate Salary", hi: "वेतन बनाएं" },
  month: { en: "Month", hi: "माह" },
  commission: { en: "Commission", hi: "कमीशन" },
  bonus: { en: "Bonus", hi: "बोनस" },
  deductions: { en: "Deductions", hi: "कटौती" },
  netSalary: { en: "Net Salary", hi: "शुद्ध वेतन" },
  markPaid: { en: "Mark Paid", hi: "भुगतान चिह्नित करें" },
  salaryList: { en: "Salary Records", hi: "वेतन रिकॉर्ड" },
  tadaList: { en: "TA/DA Records", hi: "टीए/डीए रिकॉर्ड" },
  addTada: { en: "Add TA/DA", hi: "टीए/डीए जोड़ें" },
  tadaType: { en: "TA/DA Type", hi: "टीए/डीए प्रकार" },
  travel: { en: "Travel", hi: "यात्रा" },
  dailyAllowance: { en: "Daily Allowance", hi: "दैनिक भत्ता" },
  other: { en: "Other", hi: "अन्य" },

  income: { en: "Income", hi: "आय" },
  expense: { en: "Expense", hi: "व्यय" },
  addIncome: { en: "Add Income", hi: "आय जोड़ें" },
  addExpense: { en: "Add Expense", hi: "व्यय जोड़ें" },
  cashbook: { en: "Cashbook", hi: "नकद बही" },
  transactionList: { en: "All Transactions", hi: "सभी लेन-देन" },
  net: { en: "Net", hi: "शुद्ध" },

  addLedgerEntry: { en: "Add Ledger Entry", hi: "बही प्रविष्टि जोड़ें" },
  entryType: { en: "Entry Type", hi: "प्रविष्टि प्रकार" },
  runningBalance: { en: "Running Balance", hi: "चालू शेष" },
  allLedgers: { en: "All Client Ledgers", hi: "सभी ग्राहक बहियाँ" },
  due: { en: "Due", hi: "बकाया" },
  advanceHeld: { en: "Advance (Credit)", hi: "अग्रिम (जमा)" },

  firmInfo: { en: "Firm Information", hi: "फर्म जानकारी" },
  firmName: { en: "Firm Name", hi: "फर्म का नाम" },
  firmTagline: { en: "Tagline", hi: "टैगलाइन" },
  contactNumber: { en: "Contact Number", hi: "संपर्क नंबर" },
  firmAddress: { en: "Office Address", hi: "कार्यालय का पता" },
  currency: { en: "Currency Symbol", hi: "मुद्रा चिह्न" },
  saveSettings: { en: "Save Settings", hi: "सेटिंग्स सहेजें" },
  dangerZone: { en: "Danger Zone", hi: "खतरे का क्षेत्र" },
  resetData: { en: "Reset all data to demo seed", hi: "सभी डेटा रीसेट करें" },
  confirmReset: { en: "This will erase all your data. Continue?", hi: "इससे सारा डेटा मिट जाएगा। जारी रखें?" },
  profile: { en: "Profile", hi: "प्रोफ़ाइल" },

  required: { en: "Required", hi: "आवश्यक" },
  today: { en: "Today", hi: "आज" },
  saved: { en: "Saved", hi: "सहेजा गया" },
  entries: { en: "Entries", hi: "प्रविष्टियाँ" },
  jobsCount: { en: "Jobs", hi: "जॉब" },

  documents: { en: "Bills & Quotes", hi: "बिल और कोटेशन" },
  documentsList: { en: "Bills, Invoices, Estimates & Quotations", hi: "बिल, इनवॉइस, अनुमान और कोटेशन" },
  newDocument: { en: "New Document", hi: "नया दस्तावेज़" },
  docTypeBill: { en: "Bill", hi: "बिल" },
  docTypeInvoice: { en: "Invoice", hi: "इनवॉइस" },
  docTypeEstimate: { en: "Estimate", hi: "अनुमान" },
  docTypeQuotation: { en: "Quotation", hi: "कोटेशन" },
  docNo: { en: "Doc #", hi: "दस्तावेज़ #" },
  docDate: { en: "Date", hi: "दिनांक" },
  validUntil: { en: "Valid Until", hi: "मान्य तिथि तक" },
  items: { en: "Items", hi: "वस्तुएँ" },
  addItem: { en: "Add Item", hi: "वस्तु जोड़ें" },
  qty: { en: "Qty", hi: "मात्रा" },
  rate: { en: "Rate", hi: "दर" },
  subtotal: { en: "Subtotal", hi: "उप-योग" },
  discount: { en: "Discount", hi: "छूट" },
  taxRate: { en: "Tax/GST (%)", hi: "कर/जीएसटी (%)" },
  taxAmount: { en: "Tax Amount", hi: "कर राशि" },
  viewDoc: { en: "View / Print", hi: "देखें / प्रिंट" },
  docStatusDraft: { en: "Draft", hi: "ड्राफ्ट" },
  docStatusSent: { en: "Sent", hi: "भेजा गया" },
  docStatusAccepted: { en: "Accepted", hi: "स्वीकृत" },
  docStatusRejected: { en: "Rejected", hi: "अस्वीकृत" },
  docStatusPaid: { en: "Paid", hi: "भुगतान किया गया" },
  docStatusCancelled: { en: "Cancelled", hi: "रद्द" },
  fromFirm: { en: "From", hi: "प्रेषक" },
  billTo: { en: "Bill To", hi: "बिल प्राप्तकर्ता" },
  makeInvoice: { en: "Generate Invoice", hi: "इनवॉइस बनाएँ" },
  makeBill: { en: "Generate Bill", hi: "बिल बनाएँ" },
  makeEstimate: { en: "Generate Estimate", hi: "अनुमान बनाएँ" },
  makeQuotation: { en: "Generate Quotation", hi: "कोटेशन बनाएँ" },

  inventory: { en: "Inventory", hi: "स्टॉक/इन्वेंट्री" },
  inventoryList: { en: "Manage parts, cartridges & stock items", hi: "पार्ट्स, कार्ट्रिज और स्टॉक प्रबंधित करें" },
  addItemInv: { en: "Add Item", hi: "वस्तु जोड़ें" },
  editItemInv: { en: "Edit Item", hi: "वस्तु संपादित करें" },
  itemName: { en: "Item Name", hi: "वस्तु नाम" },
  unit: { en: "Unit", hi: "इकाई" },
  stockQty: { en: "Stock", hi: "स्टॉक" },
  costPrice: { en: "Cost Price", hi: "लागत मूल्य" },
  sellingPrice: { en: "Selling Price", hi: "बिक्री मूल्य" },
  reorderLevel: { en: "Reorder Level", hi: "रीऑर्डर स्तर" },
  lowStock: { en: "Low Stock", hi: "स्टॉक कम" },
  stockValue: { en: "Stock Value", hi: "स्टॉक मूल्य" },
  addStock: { en: "Add Stock", hi: "स्टॉक जोड़ें" },
  removeStock: { en: "Remove Stock", hi: "स्टॉक घटाएँ" },
  adjustStock: { en: "Adjust Stock", hi: "स्टॉक समायोजित करें" },
  stockIn: { en: "In", hi: "जोड़ें" },
  stockOut: { en: "Out", hi: "घटाएँ" },
  inventoryStats: { en: "Inventory Overview", hi: "इन्वेंट्री सारांश" },
  totalItems: { en: "Total Items", hi: "कुल वस्तुएँ" },
  totalUnits: { en: "Total Units", hi: "कुल इकाइयाँ" },
  lowItems: { en: "Low Stock Items", hi: "कम स्टॉक वस्तुएँ" },
  invValue: { en: "Stock Value", hi: "स्टॉक मूल्य" },
  thanksForBusiness: { en: "Thank you for your business!", hi: "आपके व्यवसाय के लिए धन्यवाद!" },
  phoneLabel: { en: "Phone", hi: "फोन" },

  appearance: { en: "Appearance & Theme", hi: "थीम एवं रंग रूप" },
  themeMode: { en: "Theme Mode", hi: "थीम मोड" },
  themeColor: { en: "Accent Color", hi: "एक्सेंट रंग" },
  modeLight: { en: "Light", hi: "लाइट" },
  modeDark: { en: "Dark", hi: "डार्क" },
  modeSystem: { en: "System", hi: "सिस्टम" },
  themeSubtitle: { en: "Customize light/dark mode and color accent across the system", hi: "सिस्टम भर में लाइट/डार्क मोड और एक्सेंट रंग कस्टमाइज़ करें" },
} as const;

export type TKey = keyof typeof dict;

type TFunc = (key: TKey) => string;

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFunc;
}

const Ctx = createContext<I18nCtx>({ lang: "en", setLang: () => {}, t: (k) => dict[k].en });

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getLangSnapshot, getLangServerSnapshot);

  const changeLang = (l: Lang) => {
    setLangValue(l);
  };

  const t: TFunc = (k) => dict[k][lang];

  return <Ctx.Provider value={{ lang, setLang: changeLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  return useContext(Ctx);
}

export function categoryLabel(
  cat: { labelEn: string; labelHi: string } | undefined,
  lang: Lang
): string {
  if (!cat) return lang === "hi" ? "अन्य" : "Other";
  return lang === "hi" ? cat.labelHi : cat.labelEn;
}
