import { describe, it, expect, vi, afterEach } from 'vitest';
import { makeFetchWithTimeout, isTimedPath } from './fetchWithTimeout.js';

// A Supabase read with no time limit could leave the page spinning for as
// long as the browser keeps a dead connection open (minutes). Database,
// RPC and auth calls now give up after a limit, so the page can show a
// retry instead. Storage uploads and edge functions keep no limit.
const stalled = vi.fn((url, init) => new Promise((resolve, reject) => {
  init?.signal?.addEventListener('abort', () => reject(init.signal.reason));
}));

afterEach(() => { stalled.mockClear(); vi.useRealTimers(); });

describe('fetchWithTimeout', () => {
  it('rejects a stalled database read once the limit passes', async () => {
    vi.useFakeTimers();
    const f = makeFetchWithTimeout(stalled, 1000);
    const p = f('https://x.supabase.co/rest/v1/academy_apps?select=*');
    const settled = expect(p).rejects.toThrow(/timed out/i);
    await vi.advanceTimersByTimeAsync(1001);
    await settled;
  });

  it('times auth and RPC calls too', () => {
    expect(isTimedPath('https://x.supabase.co/auth/v1/token?grant_type=refresh_token')).toBe(true);
    expect(isTimedPath('https://x.supabase.co/rest/v1/rpc/academy_activation_status')).toBe(true);
  });

  it('leaves storage and edge functions without a limit', () => {
    expect(isTimedPath('https://x.supabase.co/storage/v1/object/a/b.pdf')).toBe(false);
    expect(isTimedPath('https://x.supabase.co/functions/v1/academy-checkout')).toBe(false);
  });

  it('passes a fast response straight through and keeps the caller abort signal', async () => {
    const ok = vi.fn(async () => ({ ok: true, status: 200 }));
    const f = makeFetchWithTimeout(ok, 1000);
    const res = await f('https://x.supabase.co/rest/v1/profiles', { method: 'GET' });
    expect(res.status).toBe(200);

    const ctrl = new AbortController();
    const p = makeFetchWithTimeout(stalled, 60000)('https://x.supabase.co/rest/v1/profiles', { signal: ctrl.signal });
    ctrl.abort(new Error('caller aborted'));
    await expect(p).rejects.toThrow(/caller aborted/);
  });
});
