// academy-video-url: a short-lived embed URL for one members-only lesson video.
//
// STUB, NOT DEPLOYED. It authenticates the caller and then answers 503
// video_host_not_configured, because no private host has been chosen yet
// (owner decision D3, 2026-10-11; Bunny Stream recommended). The client never
// calls it while VIDEO_HOST.provider is null in src/content/videos/registry.js,
// so deploying this stub early changes nothing a learner sees.
//
// V2 (docs/video/VIDEO-HOSTING.md) fills in three things here:
//   1. the server-side map video_id -> { app, tier, host id } (a table or a
//      JSON secret; the client's registry is never trusted for access),
//   2. the enrolment check: the caller must hold the tier's scope on the app
//      (academy_has_scope(app, scope) run AS THE CALLER, so the activation
//      gate and the scope ladder learning < working < advanced < full apply),
//   3. the signature: for Bunny Stream embed token authentication,
//        token   = hex(SHA-256(TOKEN_KEY + video_guid + expires))
//        url     = https://iframe.mediadelivery.net/embed/<library>/<video_guid>
//                  ?token=<token>&expires=<unix seconds>
//      with expires a few minutes ahead. The token key lives only in this
//      function's secrets (BUNNY_STREAM_LIBRARY_ID, BUNNY_STREAM_TOKEN_KEY).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

const VIDEO_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const caller = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);

    const body = await req.json().catch(() => ({}));
    const videoId = typeof body?.video_id === "string" ? body.video_id : "";
    if (!VIDEO_ID.test(videoId)) return json({ error: "video_id is required" }, 400);

    const library = Deno.env.get("BUNNY_STREAM_LIBRARY_ID");
    const tokenKey = Deno.env.get("BUNNY_STREAM_TOKEN_KEY");
    if (!library || !tokenKey) {
      return json({ error: "video_host_not_configured" }, 503);
    }

    // V2: look up videoId server-side, check academy_has_scope as the caller,
    // sign and return { url, expires }. Until then this stays closed.
    return json({ error: "video_host_not_configured" }, 503);
  } catch (_e) {
    return json({ error: "internal_error" }, 500);
  }
});
