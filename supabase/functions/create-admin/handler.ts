// The request logic of create-admin, with its outside world passed in so
// vitest can run it (index.ts wires Supabase and the service role).
//
// create-admin makes an account a platform admin: an existing user gets
// role 'admin' and a password-reset email; an unknown email gets an invite.
// The deployed version until 2026-10-14 had no caller check at all, so any
// signed-in user could make themselves admin. The caller check is now the
// one create-super-admin and delete-user use, and it fails closed:
//   401  no Authorization header, or the token does not resolve to a user
//   403  the caller's profiles.role is not 'super_admin' (or the lookup fails)
//   400  no well-formed email
//   409  the target is a super_admin (never demoted here)
//   200  { success, message, userId, isExistingUser }
import { corsHeaders, json } from "../_shared/cors.ts";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ExistingUser { id: string; user_metadata?: Record<string, unknown> }

export interface CreateAdminDeps {
  getUser: (authHeader: string) => Promise<{ id: string } | null>;
  getProfileRole: (userId: string) => Promise<string | null>;
  findUserByEmail: (email: string) => Promise<ExistingUser | null>;
  setMetadataRole: (user: ExistingUser, role: string) => Promise<void>;
  sendPasswordReset: (email: string, redirectTo?: string) => Promise<void>;
  invite: (email: string, data: Record<string, unknown>, redirectTo?: string) => Promise<string>;
  upsertProfile: (row: Record<string, unknown>) => Promise<void>;
  audit: (row: Record<string, unknown>) => Promise<void>;
  now?: () => string;
}

export function createHandler(deps: CreateAdminDeps) {
  const now = deps.now ?? (() => new Date().toISOString());
  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
    try {
      // 1. Caller check, fail closed.
      const authHeader = req.headers.get("Authorization") ?? "";
      if (!authHeader) return json({ error: "Unauthorized: Missing Authorization header" }, 401);
      let caller: { id: string } | null = null;
      try {
        caller = await deps.getUser(authHeader);
      } catch {
        caller = null;
      }
      if (!caller?.id) return json({ error: "Unauthorized: Invalid session" }, 401);

      let callerRole: string | null = null;
      try {
        callerRole = await deps.getProfileRole(caller.id);
      } catch {
        callerRole = null;
      }
      if (callerRole !== "super_admin") {
        return json({ error: "Forbidden: Only Super Admins can create admins" }, 403);
      }

      // 2. Input.
      const body = await req.json().catch(() => ({}));
      const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
      if (!EMAIL.test(email)) return json({ error: "A valid email is required" }, 400);
      const redirectTo = typeof body?.redirectUrl === "string" && body.redirectUrl ? body.redirectUrl : undefined;
      const name = typeof body?.name === "string" && body.name.trim() ? body.name.trim() : email.split("@")[0];

      // 3. Existing user: promote and send a reset; otherwise invite.
      const existing = await deps.findUserByEmail(email);
      let userId: string;
      if (existing) {
        if ((await deps.getProfileRole(existing.id)) === "super_admin") {
          return json({ error: "This account is a Super Admin and cannot be changed to Admin here" }, 409);
        }
        userId = existing.id;
        await deps.setMetadataRole(existing, "admin");
        try {
          await deps.sendPasswordReset(email, redirectTo);
        } catch (e) {
          console.error("[create-admin] reset email failed:", e);
        }
      } else {
        userId = await deps.invite(email, { role: "admin", display_name: name }, redirectTo);
      }

      // 4. The profile row is what the app reads; the signup trigger never
      //    grants admin, so it is written here with the service role.
      await deps.upsertProfile({
        id: userId,
        email,
        role: "admin",
        status: "active",
        display_name: name,
        updated_at: now(),
      });

      try {
        await deps.audit({
          user_id: caller.id,
          action: "CREATE_ADMIN",
          resource_type: "user",
          resource_id: userId,
          description: `${existing ? "Promoted" : "Invited"} ${email} as Admin`,
          status: "success",
        });
      } catch (e) {
        console.warn("[create-admin] audit log failed:", e);
      }

      return json({
        success: true,
        message: existing ? "User updated and password reset sent." : "User invited successfully.",
        userId,
        isExistingUser: !!existing,
      });
    } catch (e) {
      console.error("[create-admin] error:", e);
      return json({ error: (e as Error)?.message || "Internal Server Error" }, 400);
    }
  };
}
