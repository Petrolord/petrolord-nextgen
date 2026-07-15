// delete-user — permanently removes a user (auth + profile), super_admin only.
//
// Brought into the repo at the legacy-LMS retirement pass (2026-07-15): the
// previously deployed version also cleaned up university/LMS tables that no
// longer exist. Academy_* rows cascade from auth.users, so auth deletion is
// the real cleanup; the explicit deletes below are the chassis tables whose
// FKs to profiles have no cascade.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
      throw new Error("Server misconfiguration: Missing Supabase Environment Variables");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: { user: requester }, error: userError } =
      await supabaseClient.auth.getUser();
    if (userError || !requester) {
      return json({ error: "Unauthorized: Invalid session" }, 401);
    }

    const { data: requesterProfile, error: profileError } = await supabaseAdmin
      .from("profiles").select("role").eq("id", requester.id).single();
    if (profileError || requesterProfile?.role !== "super_admin") {
      return json({ error: "Forbidden: Only Super Admins can delete users" }, 403);
    }

    const rawBody = await req.text();
    if (!rawBody) throw new Error("Request body is empty");
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new Error("Failed to parse request body as JSON");
    }
    const { userId } = payload;
    if (!userId) throw new Error("Missing required field: userId");

    // Preserve audit history but detach it from the deleted user.
    const { error: auditError } = await supabaseAdmin
      .from("audit_logs").update({ user_id: null }).eq("user_id", userId);
    if (auditError) console.warn("[delete-user] Warning unlinking audit logs:", auditError);

    // Chassis rows keyed to the user with no cascade from profiles.
    for (const dep of [
      { table: "notifications", col: "user_id" },
      { table: "notification_preferences", col: "user_id" },
      { table: "user_preferences", col: "user_id" },
      { table: "filter_presets", col: "user_id" },
    ]) {
      const { error: delError } = await supabaseAdmin
        .from(dep.table).delete().eq(dep.col, userId);
      if (delError) console.warn(`[delete-user] Warning deleting from ${dep.table}:`, delError);
    }

    // Auth deletion cascades all academy_* records.
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteAuthError && !deleteAuthError.message.includes("User not found")) {
      return json({ error: `Auth Deletion Failed: ${deleteAuthError.message}` }, 400);
    }

    // profiles does not cascade from auth.users in this project.
    const { error: deleteDbError } = await supabaseAdmin
      .from("profiles").delete().eq("id", userId);
    if (deleteDbError) {
      console.warn("[delete-user] Profile DB deletion warning:", deleteDbError);
      return json({
        success: true,
        message: "User deleted from Auth, but profile data remains due to remaining dependencies.",
        warning: deleteDbError.message,
      }, 200);
    }

    return json({ success: true, message: "User and dependencies cleaned up successfully" }, 200);
  } catch (error) {
    console.error("[delete-user] Unhandled Error:", error);
    return json({ error: (error as Error).message || "Internal Server Error" }, 500);
  }
});
