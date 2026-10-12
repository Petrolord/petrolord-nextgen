// Cloudflare Stream signed playback tokens, signed here with the account's
// Stream signing key (POST /accounts/{account}/stream/keys returns its id and
// a base64 JWK). No network call per view: the token is an RS256 JWT whose
// header and payload carry the key id, whose subject is the video uid, and
// which expires a few minutes after it is made. Cloudflare checks it against
// the key, and a video uploaded with requireSignedURLs plays only with one.
//
// Plain Web Crypto and btoa, so it runs unchanged in the Deno edge runtime
// and under vitest (docs: developers.cloudflare.com/stream/viewing-videos/
// securing-your-stream/).

const enc = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const b64urlJson = (v: unknown) => base64url(enc.encode(JSON.stringify(v)));

/** Decode the base64 JWK the keys endpoint returns into the private RSA JWK. */
export function decodeStreamJwk(b64: string): JsonWebKey {
  const raw = JSON.parse(atob(String(b64).trim()));
  const { kty, n, e, d, p, q, dp, dq, qi } = raw;
  if (kty !== "RSA" || !n || !e || !d) throw new Error("not an RSA private JWK");
  return { kty, n, e, d, p, q, dp, dq, qi };
}

export interface StreamTokenInput {
  keyId: string;
  jwk: JsonWebKey;
  uid: string;
  nowSec: number;
  ttlSec: number;
  subtle?: SubtleCrypto;
}

/** Sign one playback token. Returns the JWT and its expiry (unix seconds). */
export async function signStreamToken(
  { keyId, jwk, uid, nowSec, ttlSec, subtle = globalThis.crypto.subtle }: StreamTokenInput,
): Promise<{ token: string; expires: number }> {
  const exp = Math.floor(nowSec) + Math.floor(ttlSec);
  const header = { alg: "RS256", kid: keyId };
  // nbf a little in the past so a viewer whose clock runs behind can still play.
  const payload = { sub: uid, kid: keyId, exp, nbf: Math.floor(nowSec) - 60 };
  const signingInput = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  const key = await subtle.importKey(
    "jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await subtle.sign("RSASSA-PKCS1-v1_5", key, enc.encode(signingInput));
  return { token: `${signingInput}.${base64url(new Uint8Array(sig))}`, expires: exp };
}

/** The Stream player URL for a signed token. */
export function streamIframeUrl(customerCode: string, token: string): string {
  return `https://customer-${customerCode}.cloudflarestream.com/${token}/iframe`;
}
