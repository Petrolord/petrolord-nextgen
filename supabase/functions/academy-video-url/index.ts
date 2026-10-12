// academy-video-url: a short-lived Cloudflare Stream player URL for one
// members-only lesson video (owner decision 2026-10-12: Cloudflare Stream).
//
// The request logic is in handler.ts (tested in handler.test.ts). This file
// wires it to Supabase and the function's secrets:
//   CF_STREAM_KEY_ID          the Stream signing key id
//   CF_STREAM_JWK             the signing key's base64 JWK (never leaves here)
//   CF_STREAM_CUSTOMER_CODE   the account's customer-<code>.cloudflarestream.com
// Until all three are set it answers 503 and the lesson shows the coming-soon
// card. The video map is public.academy_videos, read with the service role
// (the table has no client policies); the enrolment check runs as the caller.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHandler } from "./handler.ts";

const url = Deno.env.get("SUPABASE_URL") ?? "";
const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const asCaller = (authHeader: string) =>
  createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
const admin = createClient(url, service, { auth: { persistSession: false } });

serve(createHandler({
  env: (name) => Deno.env.get(name),
  getUser: async (authHeader) => {
    const { data: { user } } = await asCaller(authHeader).auth.getUser();
    return user ? { id: user.id } : null;
  },
  hasScope: async (authHeader, app, scope) => {
    const { data, error } = await asCaller(authHeader).rpc("academy_has_scope", { p_app: app, p_min: scope });
    return !error && data === true;
  },
  lookup: async (videoId) => {
    const { data, error } = await admin
      .from("academy_videos").select("app, tier, stream_uid").eq("video_id", videoId).maybeSingle();
    if (error) throw error;
    return data;
  },
}));
