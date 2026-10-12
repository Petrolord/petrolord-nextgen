// The request logic of academy-video-url, with its outside world passed in so
// vitest can run it (index.ts wires Deno, Supabase and the secrets).
//
// Order of checks:
//   401  no signed-in caller
//   400  no well-formed video_id
//   503  the Cloudflare Stream secrets are not all set
//   404  the video is not in academy_videos (not uploaded yet)
//   403  the caller does not hold the tier's scope on the app, checked with
//        academy_has_scope AS THE CALLER (activation gate and the ladder
//        learning < working < advanced < full apply)
//   200  { url, expires }: the Stream player URL with a token that expires
//        in TTL_SEC
import { corsHeaders, json } from "../_shared/cors.ts";
import { decodeStreamJwk, signStreamToken, streamIframeUrl } from "../_shared/streamToken.ts";

const VIDEO_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const TTL_SEC = 5 * 60;

// The tier a video belongs to maps to the scope that tier's enrolment grants.
export const TIER_SCOPE: Record<string, string> = {
  beginner: "learning",
  intermediate: "working",
  advanced: "advanced",
};

export interface VideoRow { app: string; tier: string; stream_uid: string }

export interface HandlerDeps {
  env: (name: string) => string | undefined;
  getUser: (authHeader: string) => Promise<{ id: string } | null>;
  hasScope: (authHeader: string, app: string, scope: string) => Promise<boolean>;
  lookup: (videoId: string) => Promise<VideoRow | null>;
  nowSec?: () => number;
  subtle?: SubtleCrypto;
}

export function createHandler(deps: HandlerDeps) {
  const now = deps.nowSec ?? (() => Date.now() / 1000);
  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
    try {
      const authHeader = req.headers.get("Authorization") ?? "";
      const user = authHeader ? await deps.getUser(authHeader) : null;
      if (!user) return json({ error: "unauthorized" }, 401);

      const body = await req.json().catch(() => ({}));
      const videoId = typeof body?.video_id === "string" ? body.video_id : "";
      if (!VIDEO_ID.test(videoId)) return json({ error: "video_id is required" }, 400);

      const keyId = deps.env("CF_STREAM_KEY_ID");
      const jwkB64 = deps.env("CF_STREAM_JWK");
      const customer = deps.env("CF_STREAM_CUSTOMER_CODE");
      if (!keyId || !jwkB64 || !customer) return json({ error: "video_host_not_configured" }, 503);

      const row = await deps.lookup(videoId);
      if (!row || !row.stream_uid) return json({ error: "video_not_found" }, 404);

      const scope = TIER_SCOPE[row.tier];
      if (!scope || !(await deps.hasScope(authHeader, row.app, scope))) {
        return json({ error: "forbidden" }, 403);
      }

      const { token, expires } = await signStreamToken({
        keyId, jwk: decodeStreamJwk(jwkB64), uid: row.stream_uid,
        nowSec: now(), ttlSec: TTL_SEC, subtle: deps.subtle,
      });
      return json({ url: streamIframeUrl(customer, token), expires });
    } catch (_e) {
      return json({ error: "internal_error" }, 500);
    }
  };
}
