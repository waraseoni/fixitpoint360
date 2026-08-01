/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

async function requireOwner(authHeader: string | null): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!authHeader?.startsWith("Bearer ")) return { ok: false, message: "Missing auth token" };
  const token = authHeader.slice(7);
  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) return { ok: false, message: "Invalid session" };
  const { data: profile } = await getSupabaseAdmin()
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  if (!profile || profile.role !== "owner") return { ok: false, message: "Owner access required" };
  return { ok: true };
}

export async function POST(req: Request) {
  const auth = await requireOwner(req.headers.get("authorization"));
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const db = body.db;
  if (!db || typeof db !== "object") {
    return NextResponse.json({ error: "Missing db payload" }, { status: 400 });
  }

  try {
    // 1. Map existing auth users by email so we can reuse already-created accounts
    const { data: existingUsers } = await getSupabaseAdmin().auth.admin.listUsers({ perPage: 1000 });
    const emailToId = new Map<string, string>();
    existingUsers?.users.forEach((u) => emailToId.set((u.email || "").toLowerCase(), u.id));

    const idMap = new Map<string, string>(); // old profile id -> auth user uuid

    // 2. Create auth users for staff
    for (const u of db.users || []) {
      const email = String(u.email || "").toLowerCase();
      const existingId = emailToId.get(email);
      let userId = existingId;
      if (!userId) {
        const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
          email: u.email,
          password: u.password || "staff123",
          email_confirm: true,
          user_metadata: { name: u.name, phone: u.phone, role: u.role, designation: u.designation },
        });
        if (error) {
          const { data: found } = await getSupabaseAdmin().auth.admin.listUsers({ perPage: 1000 });
          const byEmail = found?.users.find((x) => (x.email || "").toLowerCase() === email);
          if (!byEmail) {
            console.error(`Import: could not create user ${email}: ${error.message}`);
            continue;
          }
          userId = byEmail.id;
        } else {
          userId = data.user!.id;
        }
      }
      idMap.set(u.id, userId!);
      // Update profile with full details from old DB
      await getSupabaseAdmin()
        .from("profiles")
        .update({
          name: u.name,
          email: u.email,
          phone: u.phone || "",
          role: u.role,
          designation: u.designation || "",
          status: u.status || "active",
          salary: u.salary || 0,
          commission_rate: u.commissionRate || 0,
          joined_at: u.joinedAt || null,
        })
        .eq("id", userId!);
    }

    const mapId = (old?: string): string | null => (old ? idMap.get(old) || null : null);

    // 3. Insert business data
    const clientIds = new Set<string>();
    const jobIds = new Set<string>();

    if (Array.isArray(db.clients)) {
      const rows = db.clients.map((c: any) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || null,
        address: c.address || null,
        city: c.city || null,
        pincode: c.pincode || null,
        type: c.type || "residential",
        gstin: c.gstin || null,
        notes: c.notes || null,
        created_at: c.createdAt || new Date().toISOString(),
      }));
      const { error } = await getSupabaseAdmin().from("clients").upsert(rows);
      if (error) throw error;
      rows.forEach((r: any) => clientIds.add(r.id));
    }

    if (Array.isArray(db.jobs)) {
      const rows = db.jobs.map((j: any) => ({
        id: j.id,
        job_no: j.jobNo,
        client_id: j.clientId,
        category: j.category || "other",
        title: j.title,
        description: j.description || null,
        status: j.status || "pending",
        priority: j.priority || "normal",
        assigned_to: mapId(j.assignedTo),
        scheduled_date: j.scheduledDate || null,
        completed_date: j.completedDate || null,
        charges: j.charges || 0,
        material_cost: j.materialCost || 0,
        advance: j.advance || 0,
        payment_status: j.paymentStatus || "unpaid",
        payment_mode: j.paymentMode || "pending",
        notes: j.notes || null,
        created_at: j.createdAt || new Date().toISOString(),
        created_by: mapId(j.createdBy),
      }));
      const { error } = await getSupabaseAdmin().from("jobs").upsert(rows);
      if (error) throw error;
      rows.forEach((r: any) => jobIds.add(r.id));
    }

    if (Array.isArray(db.amcs)) {
      const rows = db.amcs.map((a: any) => ({
        id: a.id,
        client_id: a.clientId,
        category: a.category || "other",
        plan_name: a.planName,
        amount: a.amount || 0,
        billing_cycle: a.billingCycle || "monthly",
        start_date: a.startDate || null,
        end_date: a.endDate || null,
        status: a.status || "active",
        notes: a.notes || null,
        created_at: a.createdAt || new Date().toISOString(),
      }));
      const { error } = await getSupabaseAdmin().from("amcs").upsert(rows);
      if (error) throw error;
    }

    if (Array.isArray(db.attendance)) {
      const rows = db.attendance.map((a: any) => ({
        id: a.id,
        staff_id: mapId(a.staffId),
        date: a.date,
        status: a.status || "present",
        check_in: a.checkIn || null,
        check_out: a.checkOut || null,
        notes: a.notes || null,
      }));
      const { error } = await getSupabaseAdmin().from("attendance").upsert(rows);
      if (error) throw error;
    }

    if (Array.isArray(db.salary)) {
      const rows = db.salary.map((x: any) => ({
        id: x.id,
        staff_id: mapId(x.staffId),
        month: x.month,
        present_days: x.presentDays || 0,
        basic: x.basic || 0,
        commission: x.commission || 0,
        ta_da: x.taDa || 0,
        bonus: x.bonus || 0,
        deductions: x.deductions || 0,
        net: x.net || 0,
        paid: !!x.paid,
        paid_date: x.paidDate || null,
        notes: x.notes || null,
      }));
      const { error } = await getSupabaseAdmin().from("salary_records").upsert(rows);
      if (error) throw error;
    }

    if (Array.isArray(db.tada)) {
      const rows = db.tada.map((t: any) => ({
        id: t.id,
        staff_id: mapId(t.staffId),
        date: t.date,
        type: t.type || "other",
        amount: t.amount || 0,
        description: t.description || null,
        job_id: t.jobId || null,
      }));
      const { error } = await getSupabaseAdmin().from("tada").upsert(rows);
      if (error) throw error;
    }

    if (Array.isArray(db.transactions)) {
      const rows = db.transactions.map((t: any) => ({
        id: t.id,
        type: t.type || "expense",
        category: t.category || "",
        amount: t.amount || 0,
        date: t.date,
        mode: t.mode || "pending",
        client_id: t.clientId || null,
        job_id: t.jobId || null,
        staff_id: mapId(t.staffId),
        description: t.description || null,
        created_at: t.createdAt || new Date().toISOString(),
      }));
      const { error } = await getSupabaseAdmin().from("transactions").upsert(rows);
      if (error) throw error;
    }

    if (Array.isArray(db.ledger)) {
      const rows = db.ledger.map((e: any) => ({
        id: e.id,
        client_id: e.clientId,
        date: e.date,
        type: e.type === "debit" ? "debit" : "credit",
        amount: e.amount || 0,
        ref_id: e.refId || null,
        description: e.description || "",
        mode: e.mode || "pending",
        created_at: e.createdAt || new Date().toISOString(),
      }));
      const { error } = await getSupabaseAdmin().from("ledger_entries").upsert(rows);
      if (error) throw error;
    }

    if (db.settings) {
      await getSupabaseAdmin().from("settings").upsert({ key: "firm", value: db.settings });
    }
    await getSupabaseAdmin()
      .from("app_meta")
      .upsert({ key: "job_counter", value: { job_counter: Number(db.jobCounter) || 0 } });

    return NextResponse.json({ ok: true, usersImported: idMap.size, clientsImported: clientIds.size, jobsImported: jobIds.size });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
