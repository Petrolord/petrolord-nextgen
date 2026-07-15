// Academy payment verification — the trust anchor is Paystack's own
// verify endpoint (server-side, secret key); the client can only hand
// us a reference. Activation + amount/currency validation happen inside
// academy_apply_successful_payment (SECURITY DEFINER, service-role-only
// execute), which is idempotent — safe to poll.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET_KEY) {
      return json({ error: "payments_not_configured" }, 503);
    }
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return json({ error: "unauthorized" }, 401);

    const { reference } = await req.json();
    if (!reference) return json({ error: "reference is required" }, 400);

    // Server-side verify against Paystack, with short backoff (Suite
    // pattern) — a just-completed charge can take a moment to settle.
    let data: Record<string, unknown> | null = null;
    for (const delay of [0, 1500, 3000]) {
      if (delay) await new Promise((r) => setTimeout(r, delay));
      const res = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } },
      );
      if (res.ok) {
        const body = await res.json();
        if (body.status === true && body.data) {
          data = body.data;
          if (body.data.status !== "pending") break;
        }
      }
    }
    if (!data) return json({ status: "not_verifiable" }, 200);
    if (data.status === "pending" || data.status === "ongoing") {
      return json({ status: "pending" }, 200);
    }

    const { data: applied, error } = await admin.rpc(
      "academy_apply_successful_payment",
      {
        p_reference: reference,
        p_amount_minor: data.amount,
        p_currency: data.currency,
        p_success: data.status === "success",
        p_raw: data,
      },
    );
    if (error) return json({ error: error.message }, 500);
    return json(applied);
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
});
