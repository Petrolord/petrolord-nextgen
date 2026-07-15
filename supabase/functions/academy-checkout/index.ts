// Academy checkout — initializes a Paystack hosted-checkout session for
// a pending academy_payments row (self door course fee, or campus door
// personal registration fee).
//
// The payment row is the single source of truth: the client sends ONLY
// the reference it got from the door function (academy_start_self_enrollment
// / academy_redeem_code); amount and currency come from the row, never
// from the request. Suite pattern (generate-quote) with that hardening.
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

    const { data: pay } = await admin
      .from("academy_payments")
      .select("*")
      .eq("reference", reference)
      .maybeSingle();
    if (!pay || pay.user_id !== user.id) {
      return json({ error: "payment_not_found" }, 404);
    }
    if (pay.status === "success") {
      return json({ status: "already_paid", reference });
    }
    if (pay.authorization_url) {
      // Idempotent re-entry: Paystack rejects duplicate references, so
      // reuse the cached hosted-checkout link.
      return json({ authorization_url: pay.authorization_url, reference });
    }

    const appUrl = (Deno.env.get("APP_URL") ?? "https://nextgen.petrolord.com")
      .replace(/\/$/, "");
    const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: pay.amount_minor,
        currency: pay.currency,
        reference,
        metadata: {
          purpose: pay.purpose,
          enrollment_id: pay.enrollment_id,
          user_id: user.id,
        },
        callback_url: `${appUrl}/dashboard/enroll?reference=${reference}`,
      }),
    });
    const init = await initRes.json();
    if (!initRes.ok || init.status !== true) {
      return json({ error: "paystack_initialize_failed", detail: init?.message }, 502);
    }

    await admin
      .from("academy_payments")
      .update({
        authorization_url: init.data.authorization_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", pay.id);

    return json({ authorization_url: init.data.authorization_url, reference });
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
});
