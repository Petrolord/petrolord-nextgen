import { describe, it, expect, beforeAll, vi } from 'vitest';
import { webcrypto } from 'node:crypto';
import { createHandler, TTL_SEC } from './handler.ts';
import { decodeStreamJwk, signStreamToken } from '../_shared/streamToken.ts';

const subtle = webcrypto.subtle as unknown as SubtleCrypto;
const NOW = 1_800_000_000;
const UID = 'ea95132c15732412d22c1476fa83f27a';
let jwkB64 = '';
let publicKey: CryptoKey;

const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)), (c) => c.charCodeAt(0));
const part = (jwt: string, i: number) => JSON.parse(new TextDecoder().decode(fromB64url(jwt.split('.')[i])));

beforeAll(async () => {
  const pair = await subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['sign', 'verify'],
  ) as CryptoKeyPair;
  publicKey = pair.publicKey;
  // The keys endpoint returns the JWK base64 encoded, with kid and alg on it.
  const jwk = { ...(await subtle.exportKey('jwk', pair.privateKey)), kid: 'key-123', alg: 'RS256' };
  jwkB64 = btoa(JSON.stringify(jwk));
});

function deps(over: Record<string, unknown> = {}) {
  const env = { CF_STREAM_KEY_ID: 'key-123', CF_STREAM_JWK: jwkB64, CF_STREAM_CUSTOMER_CODE: 'abc123' };
  return {
    env: (n: string) => (env as Record<string, string>)[n],
    getUser: vi.fn(async () => ({ id: 'u1' })),
    hasScope: vi.fn(async () => true),
    lookup: vi.fn(async (id: string) => (id === 'qi-b4' ? { app: 'qi', tier: 'beginner', stream_uid: UID } : null)),
    nowSec: () => NOW,
    subtle,
    ...over,
  };
}
const post = (body: unknown, auth = 'Bearer jwt') =>
  new Request('https://fn.local/academy-video-url', {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: auth } : {}) },
    body: JSON.stringify(body),
  });

describe('academy-video-url', () => {
  it('401 without a signed-in caller', async () => {
    const res = await createHandler(deps())(post({ video_id: 'qi-b4' }, ''));
    expect(res.status).toBe(401);
    const res2 = await createHandler(deps({ getUser: async () => null }))(post({ video_id: 'qi-b4' }));
    expect(res2.status).toBe(401);
  });

  it('400 for a missing or malformed video id', async () => {
    expect((await createHandler(deps())(post({}))).status).toBe(400);
    expect((await createHandler(deps())(post({ video_id: '../x' }))).status).toBe(400);
  });

  it('503 while any Stream secret is missing', async () => {
    for (const missing of ['CF_STREAM_KEY_ID', 'CF_STREAM_JWK', 'CF_STREAM_CUSTOMER_CODE']) {
      const d = deps();
      const env = d.env;
      d.env = (n: string) => (n === missing ? undefined : env(n));
      const res = await createHandler(d)(post({ video_id: 'qi-b4' }));
      expect(res.status).toBe(503);
      expect(await res.json()).toEqual({ error: 'video_host_not_configured' });
    }
  });

  it('404 for a video that is not in academy_videos', async () => {
    const res = await createHandler(deps())(post({ video_id: 'qi-f99' }));
    expect(res.status).toBe(404);
  });

  it('403 without the tier scope, asked as the caller with the right scope', async () => {
    const d = deps({ hasScope: vi.fn(async () => false) });
    const res = await createHandler(d)(post({ video_id: 'qi-b4' }));
    expect(res.status).toBe(403);
    expect(d.hasScope).toHaveBeenCalledWith('Bearer jwt', 'qi', 'learning');
    const adv = deps({ lookup: async () => ({ app: 'qi', tier: 'advanced', stream_uid: UID }) });
    await createHandler(adv)(post({ video_id: 'qi-f15' }));
    expect(adv.hasScope).toHaveBeenCalledWith('Bearer jwt', 'qi', 'advanced');
    // An unknown tier never plays (negative control on the tier map).
    const odd = deps({ lookup: async () => ({ app: 'qi', tier: 'expert', stream_uid: UID }) });
    expect((await createHandler(odd)(post({ video_id: 'qi-b4' }))).status).toBe(403);
  });

  it('200 returns the Stream player URL with a token signed by the key', async () => {
    const res = await createHandler(deps())(post({ video_id: 'qi-b4' }));
    expect(res.status).toBe(200);
    const { url, expires } = await res.json();
    expect(expires).toBe(NOW + TTL_SEC);
    const m = /^https:\/\/customer-abc123\.cloudflarestream\.com\/([^/]+)\/iframe$/.exec(url);
    expect(m).not.toBeNull();
    const jwt = m![1];
    expect(part(jwt, 0)).toEqual({ alg: 'RS256', kid: 'key-123' });
    expect(part(jwt, 1)).toEqual({ sub: UID, kid: 'key-123', exp: NOW + TTL_SEC, nbf: NOW - 60 });
    const [h, p, s] = jwt.split('.');
    const ok = await subtle.verify('RSASSA-PKCS1-v1_5', publicKey, fromB64url(s), new TextEncoder().encode(`${h}.${p}`));
    expect(ok).toBe(true);
    // Negative control: a token whose payload is changed no longer verifies.
    const forged = btoa(JSON.stringify({ sub: 'other', kid: 'key-123', exp: NOW + TTL_SEC })).replace(/=+$/, '');
    expect(await subtle.verify('RSASSA-PKCS1-v1_5', publicKey, fromB64url(s), new TextEncoder().encode(`${h}.${forged}`))).toBe(false);
  });

  it('decodes only an RSA private JWK', async () => {
    expect(() => decodeStreamJwk(btoa(JSON.stringify({ kty: 'EC', x: '1' })))).toThrow();
    const signed = await signStreamToken({ keyId: 'k', jwk: decodeStreamJwk(jwkB64), uid: UID, nowSec: NOW, ttlSec: 60, subtle });
    expect(signed.expires).toBe(NOW + 60);
  });
});
