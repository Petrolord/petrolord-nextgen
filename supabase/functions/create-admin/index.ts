// create-admin: make an account a platform admin (super_admin callers only).
//
// Restored 2026-10-14 from the deployed source with a fail-closed caller
// check (the deployed version had none and was deleted by the owner). The
// request logic is in handler.ts (tested in handler.test.ts); this file wires
// it to Supabase. Deploy with verify_jwt = true (supabase/config.toml).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHandler, type ExistingUser } from "./handler.ts";

const url = Deno.env.get("SUPABASE_URL") ?? "";
const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email: string): Promise<ExistingUser | null> {
  const perPage = 1000;
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    const hit = users.find((u) => u.email?.toLowerCase() === email);
    if (hit) return { id: hit.id, user_metadata: hit.user_metadata ?? {} };
    if (users.length < perPage) return null;
  }
}

Deno.serve(createHandler({
  getUser: async (authHeader) => {
    if (!url || !anon || !service) throw new Error("Server misconfiguration");
    const caller = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data, error } = await caller.auth.getUser();
    if (error || !data?.user) return null;
    return { id: data.user.id };
  },
  getProfileRole: async (userId) => {
    const { data, error } = await admin.from("profiles").select("role").eq("id", userId).maybeSingle();
    if (error) throw error;
    return (data?.role as string | undefined) ?? null;
  },
  findUserByEmail,
  setMetadataRole: async (user, role) => {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      user_metadata: { ...(user.user_metadata ?? {}), role },
    });
    if (error) throw error;
  },
  sendPasswordReset: async (email, redirectTo) => {
    const { error } = await admin.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);
    if (error) throw error;
  },
  invite: async (email, data, redirectTo) => {
    const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(email, { data, redirectTo });
    if (error) throw error;
    return invited.user.id;
  },
  upsertProfile: async (row) => {
    const { error } = await admin.from("profiles").upsert(row, { onConflict: "id" });
    if (error) throw error;
  },
  audit: async (row) => {
    const { error } = await admin.from("audit_logs").insert(row);
    if (error) throw error;
  },
}));
