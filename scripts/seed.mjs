// One-time seed script: creates auth users + inserts seed data into Supabase.
// Usage: node scripts/seed.mjs
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.

import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { seed } from "./seed-data.mjs";

function loadEnv() {
  const env = {};
  const files = [".env.local", ".env"];
  for (const f of files) {
    if (!existsSync(f)) continue;
    for (const line of readFileSync(f, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && m[2].trim()) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function main() {
  console.log("Seeding FixitPoint360 -> Supabase");

  // 1. Auth users + profiles
  const idMap = new Map(); // old profile id -> auth user uuid
  for (const u of seed.users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name, phone: u.phone, role: u.role, designation: u.designation },
    });
    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        console.log(`  ! user ${u.email} already exists, looking up...`);
        const { data: found } = await supabase.auth.admin.listUsers();
        const match = found?.users.find((x) => x.email === u.email);
        if (!match) {
          console.error(`  x could not resolve ${u.email}`);
          continue;
        }
        idMap.set(u.id, match.id);
      } else {
        console.error(`  x createUser ${u.email}: ${error.message}`);
        continue;
      }
    } else {
      idMap.set(u.id, data.user.id);
    }
    await supabase
      .from("profiles")
      .update({
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        designation: u.designation,
        status: u.status,
        salary: u.salary,
        commission_rate: u.commissionRate,
        joined_at: u.joinedAt,
      })
      .eq("id", idMap.get(u.id));
    console.log(`  + ${u.email}`);
  }

  const mapStaff = (id) => idMap.get(id) || null;

  // 2. Clients
  const clients = seed.clients.map((c) => ({
    id: c.id, name: c.name, phone: c.phone, email: c.email || null, address: c.address || null,
    city: c.city || null, pincode: c.pincode || null, type: c.type, gstin: c.gstin || null,
    notes: c.notes || null, created_at: c.createdAt,
  }));
  const { error: eClients } = await supabase.from("clients").upsert(clients);
  if (eClients) throw eClients;
  console.log(`  + ${clients.length} clients`);

  // 3. Jobs
  const jobs = seed.jobs.map((j) => ({
    id: j.id, job_no: j.jobNo, client_id: j.clientId, category: j.category, title: j.title,
    description: j.description || null, status: j.status, priority: j.priority,
    assigned_to: mapStaff(j.assignedTo), scheduled_date: j.scheduledDate || null,
    completed_date: j.completedDate || null, charges: j.charges, material_cost: j.materialCost,
    advance: j.advance, payment_status: j.paymentStatus, payment_mode: j.paymentMode,
    notes: j.notes || null, created_at: j.createdAt, created_by: mapStaff(j.createdBy),
  }));
  const { error: eJobs } = await supabase.from("jobs").upsert(jobs);
  if (eJobs) throw eJobs;
  console.log(`  + ${jobs.length} jobs`);

  // 4. AMCs
  const amcs = seed.amcs.map((a) => ({
    id: a.id, client_id: a.clientId, category: a.category, plan_name: a.planName, amount: a.amount,
    billing_cycle: a.billingCycle, start_date: a.startDate || null, end_date: a.endDate || null,
    status: a.status, notes: a.notes || null, created_at: a.createdAt,
  }));
  const { error: eAmcs } = await supabase.from("amcs").upsert(amcs);
  if (eAmcs) throw eAmcs;

  // 5. Attendance
  const attendance = seed.attendance.map((a) => ({
    id: a.id, staff_id: mapStaff(a.staffId), date: a.date, status: a.status,
    check_in: a.checkIn || null, check_out: a.checkOut || null, notes: a.notes || null,
  }));
  const { error: eAtt } = await supabase.from("attendance").upsert(attendance);
  if (eAtt) throw eAtt;

  // 6. Salary records
  const salary = seed.salary.map((s) => ({
    id: s.id, staff_id: mapStaff(s.staffId), month: s.month, present_days: s.presentDays,
    basic: s.basic, commission: s.commission, ta_da: s.taDa, bonus: s.bonus, deductions: s.deductions,
    net: s.net, paid: !!s.paid, paid_date: s.paidDate || null, notes: s.notes || null,
  }));
  const { error: eSal } = await supabase.from("salary_records").upsert(salary);
  if (eSal) throw eSal;

  // 7. TADA
  const tada = seed.tada.map((t) => ({
    id: t.id, staff_id: mapStaff(t.staffId), date: t.date, type: t.type, amount: t.amount,
    description: t.description || null, job_id: t.jobId || null,
  }));
  const { error: eTada } = await supabase.from("tada").upsert(tada);
  if (eTada) throw eTada;

  // 8. Transactions
  const transactions = seed.transactions.map((t) => ({
    id: t.id, type: t.type, category: t.category, amount: t.amount, date: t.date, mode: t.mode,
    client_id: t.clientId || null, job_id: t.jobId || null, staff_id: t.staffId ? mapStaff(t.staffId) : null,
    description: t.description || null, created_at: t.createdAt,
  }));
  const { error: eTx } = await supabase.from("transactions").upsert(transactions);
  if (eTx) throw eTx;

  // 9. Ledger
  const ledger = seed.ledger.map((l) => ({
    id: l.id, client_id: l.clientId, date: l.date, type: l.type, amount: l.amount,
    ref_id: l.refId || null, description: l.description, mode: l.mode, created_at: l.createdAt,
  }));
  const { error: eLed } = await supabase.from("ledger_entries").upsert(ledger);
  if (eLed) throw eLed;

  // 10. Settings + job counter
  await supabase.from("settings").upsert({ key: "firm", value: seed.firm });
  await supabase.from("app_meta").upsert({ key: "job_counter", value: { job_counter: seed.jobCounter } });

  console.log("Done. Login as:");
  for (const u of seed.users) {
    console.log(`  ${u.email} / ${u.password}  (${u.role})`);
  }
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
