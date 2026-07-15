// Paystack webhook — asynchronous confirmation path (covers learners
// who never return to the callback page). Auth = HMAC-SHA512 signature
// of the RAW body with the secret key, validated before JSON.parse
// (Suite pattern). Reuses the same idempotent activation RPC as
// academy-verify, so double delivery is harmless.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET_KEY) {
      return new Response("payments not configured", { status: 503 });
    }

    const signature = req.headers.get("x-paystack-signature");
    if (!signature) return new Response("no signature", { status: 400 });

    const bodyText = await req.text();
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(PAYSTACK_SECRET_KEY),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["verify"],
    );
    const sigBytes = Uint8Array.from(
      signature.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)),
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(bodyText),
    );
    if (!valid) return new Response("invalid signature", { status: 401 });

    const event = JSON.parse(bodyText);
    if (event.event !== "charge.success") {
      return new Response("ignored", { status: 200 });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data, error } = await admin.rpc("academy_apply_successful_payment", {
      p_reference: event.data.reference,
      p_amount_minor: event.data.amount,
      p_currency: event.data.currency,
      p_success: true,
      p_raw: event.data,
    });
    if (error) return new Response(error.message, { status: 500 });
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(String(e?.message ?? e), { status: 500 });
  }
});
