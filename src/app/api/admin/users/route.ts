/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const VALID_ROLES = ["owner", "admin", "staff"];

async function requireManager(
  authHeader: string | null
): Promise<{ ok: true; role: string; id: string } | { ok: false; message: string }> {
  if (!authHeader?.startsWith("Bearer ")) return { ok: false, message: "Missing auth token" };
  const token = authHeader.slice(7);
  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) return { ok: false, message: "Invalid session" };
  const { data: profile } = await getSupabaseAdmin()
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  if (!profile || (profile.role !== "owner" && profile.role !== "admin"))
    return { ok: false, message: "Manager access required" };
  return { ok: true, role: profile.role, id: data.user.id };
}

async function getProfileRole(id: string): Promise<string | null> {
  const { data } = await getSupabaseAdmin().from("profiles").select("role").eq("id", id).single();
  return data?.role ?? null;
}

export async function POST(req: Request) {
  const auth = await requireManager(req.headers.get("authorization"));
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: 401 });
  const actorRole = auth.role;
  const actorId = auth.id;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = body;
  try {
    if (action === "create") {
      const { name, email, phone, password, role = "staff", designation, salary, commissionRate, joinedAt } = body;
      if (!name || !email || !password)
        return NextResponse.json({ error: "name, email and password required" }, { status: 400 });
      if (!VALID_ROLES.includes(role))
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      if (actorRole === "admin" && role !== "staff")
        return NextResponse.json({ error: "Admin can only create staff users" }, { status: 403 });
      const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, phone, role, designation },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      const { error: profileError } = await getSupabaseAdmin()
        .from("profiles")
        .update({
          name,
          email,
          phone: phone || "",
          role,
          designation: designation || "",
          status: body.status || "active",
          salary: salary || 0,
          commission_rate: commissionRate || 0,
          joined_at: joinedAt || null,
        })
        .eq("id", data.user!.id);
      if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });
      return NextResponse.json({ ok: true, id: data.user!.id });
    }

    if (action === "update") {
      const { id, email, password, name, phone, role, designation, salary, commissionRate, joinedAt, status } = body;
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
      const targetRole = await getProfileRole(id);
      if (!targetRole) return NextResponse.json({ error: "User not found" }, { status: 404 });
      if (actorRole === "admin" && targetRole !== "staff")
        return NextResponse.json({ error: "Admin can only edit staff users" }, { status: 403 });
      if (role !== undefined) {
        if (!VALID_ROLES.includes(role))
          return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        if (actorRole === "admin" && role !== "staff")
          return NextResponse.json({ error: "Admin cannot assign admin or owner role" }, { status: 403 });
        if (id === actorId)
          return NextResponse.json({ error: "You cannot change your own role" }, { status: 403 });
      }
      if (email) {
        const { error } = await getSupabaseAdmin().auth.admin.updateUserById(id, { email, email_confirm: true });
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (password) {
        const { error } = await getSupabaseAdmin().auth.admin.updateUserById(id, { password });
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      }
      const patch: any = {};
      if (name !== undefined) patch.name = name;
      if (email !== undefined) patch.email = email;
      if (phone !== undefined) patch.phone = phone;
      if (role !== undefined) patch.role = role;
      if (designation !== undefined) patch.designation = designation;
      if (status !== undefined) patch.status = status;
      if (salary !== undefined) patch.salary = salary;
      if (commissionRate !== undefined) patch.commission_rate = commissionRate;
      if (joinedAt !== undefined) patch.joined_at = joinedAt;
      const { error } = await getSupabaseAdmin().from("profiles").update(patch).eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
      if (id === actorId)
        return NextResponse.json({ error: "You cannot delete your own account" }, { status: 403 });
      const targetRole = await getProfileRole(id);
      if (!targetRole) return NextResponse.json({ error: "User not found" }, { status: 404 });
      if (actorRole === "admin" && targetRole !== "staff")
        return NextResponse.json({ error: "Admin can only delete staff users" }, { status: 403 });
      const { error } = await getSupabaseAdmin().auth.admin.deleteUser(id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
