import type {
  AttendanceStatus,
  ClientType,
  JobStatus,
  PaymentMode,
  PaymentStatus,
  Priority,
  ServiceCategory,
} from "./types";

export const SERVICE_CATEGORIES: {
  value: ServiceCategory;
  labelEn: string;
  labelHi: string;
  icon: string;
}[] = [
  { value: "cctv", labelEn: "CCTV Installation & Repair", labelHi: "सीसीटीवी लगाना व मरम्मत", icon: "cctv" },
  { value: "computer", labelEn: "Computer Repair / Installation / Maintenance", labelHi: "कंप्यूटर मरम्मत / इंस्टॉलेशन / रखरखाव", icon: "computer" },
  { value: "printer", labelEn: "Printer Repair, Cartridge Refilling & Maintenance", labelHi: "प्रिंटर मरम्मत, कार्ट्रिज रिफिल व रखरखाव", icon: "printer" },
  { value: "household", labelEn: "Household Services", labelHi: "घरेलू सेवाएँ", icon: "household" },
  { value: "other", labelEn: "Other Services", labelHi: "अन्य सेवाएँ", icon: "other" },
];

export const JOB_STATUSES: { value: JobStatus; labelEn: string; labelHi: string }[] = [
  { value: "pending", labelEn: "Pending", labelHi: "लंबित" },
  { value: "assigned", labelEn: "Assigned", labelHi: "असाइन किया गया" },
  { value: "in_progress", labelEn: "In Progress", labelHi: "चल रहा है" },
  { value: "completed", labelEn: "Completed", labelHi: "पूर्ण" },
  { value: "cancelled", labelEn: "Cancelled", labelHi: "रद्द" },
];

export const PAYMENT_STATUSES: { value: PaymentStatus; labelEn: string; labelHi: string }[] = [
  { value: "unpaid", labelEn: "Unpaid", labelHi: "अवैतनिक" },
  { value: "partial", labelEn: "Partial", labelHi: "आंशिक" },
  { value: "paid", labelEn: "Paid", labelHi: "भुगतान किया गया" },
];

export const PRIORITIES: { value: Priority; labelEn: string; labelHi: string }[] = [
  { value: "low", labelEn: "Low", labelHi: "कम" },
  { value: "normal", labelEn: "Normal", labelHi: "सामान्य" },
  { value: "high", labelEn: "High", labelHi: "उच्च" },
  { value: "urgent", labelEn: "Urgent", labelHi: "अति आवश्यक" },
];

export const PAYMENT_MODES: { value: PaymentMode; labelEn: string; labelHi: string }[] = [
  { value: "cash", labelEn: "Cash", labelHi: "नकद" },
  { value: "upi", labelEn: "UPI", labelHi: "यूपीआई" },
  { value: "bank", labelEn: "Bank Transfer", labelHi: "बैंक ट्रांसफर" },
  { value: "card", labelEn: "Card", labelHi: "कार्ड" },
  { value: "pending", labelEn: "Pending", labelHi: "लंबित" },
];

export const CLIENT_TYPES: { value: ClientType; labelEn: string; labelHi: string }[] = [
  { value: "residential", labelEn: "Residential", labelHi: "घरेलू" },
  { value: "business", labelEn: "Business", labelHi: "व्यापार" },
  { value: "corporate", labelEn: "Corporate", labelHi: "कॉर्पोरेट" },
];

export const ATTENDANCE_STATUSES: { value: AttendanceStatus; labelEn: string; labelHi: string }[] = [
  { value: "present", labelEn: "Present", labelHi: "उपस्थित" },
  { value: "absent", labelEn: "Absent", labelHi: "अनुपस्थित" },
  { value: "half_day", labelEn: "Half Day", labelHi: "आधा दिन" },
  { value: "leave", labelEn: "Leave", labelHi: "अवकाश" },
];

export const INCOME_CATEGORIES = [
  "Job / Service",
  "AMC",
  "Cartridge Refilling",
  "Sales / Hardware",
  "Commission",
  "Other Income",
];

export const EXPENSE_CATEGORIES = [
  "Material / Parts",
  "Cartridge / Ink",
  "Fuel / Travel",
  "Salary",
  "Staff TA-DA",
  "Rent",
  "Electricity / Bills",
  "Internet / Phone",
  "Office Supplies",
  "Advertising",
  "Other Expense",
];

export const SERVICE_CAT_LABEL: Record<ServiceCategory, { en: string; hi: string }> =
  Object.fromEntries(
    SERVICE_CATEGORIES.map((c) => [c.value, { en: c.labelEn, hi: c.labelHi }])
  ) as Record<ServiceCategory, { en: string; hi: string }>;
