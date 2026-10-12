import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { VIDEOS, SERIES } from '../../src/content/videos/registry.js';
import { parseEnv, videoTier, membersVideos, upsertSql, run, CHUNK, ALLOWED_ORIGINS } from './cfStream.mjs';

describe('picking the videos', () => {
  it('QI lessons 4 to 18 are the members-only videos, each with a tier', () => {
    const list = membersVideos(VIDEOS, SERIES, 'qi');
    expect(list.map((v) => v.number)).toEqual(Array.from({ length: 15 }, (_, i) => i + 4));
    for (const v of list) {
      expect(v.app).toBe('qi');
      expect(['beginner', 'intermediate', 'advanced']).toContain(v.tier);
      expect(v.hostKey).toMatch(/^lesson-qi-[b-f]\d+$/);
    }
    expect(membersVideos(VIDEOS, SERIES, 'qi', { from: 4, to: 5 }).map((v) => v.videoId)).toEqual(['qi-b4', 'qi-b5']);
  });

  it('a video enriching two tiers opens at the lower one', () => {
    expect(videoTier({ lessons: ['qi/advanced/m/l', 'qi/intermediate/m/l'] })).toBe('intermediate');
    expect(videoTier({ lessons: [] })).toBeNull();
  });

  it('parses the env file', () => {
    expect(parseEnv("# c\nCF_API_TOKEN='abc'\nCF_ACCOUNT_ID=123\n")).toEqual({ CF_API_TOKEN: 'abc', CF_ACCOUNT_ID: '123' });
  });

  it('writes one atomic upsert and quotes values', () => {
    const sql = upsertSql([{ videoId: 'qi-b4', app: 'qi', tier: 'beginner', uid: "u'1" }, { videoId: 'qi-b5' }]);
    expect(sql).toContain("('qi-b4', 'qi', 'beginner', 'u''1')");
    expect(sql).not.toContain('qi-b5');
    expect(sql).not.toMatch(/\bcommit\b|\bbegin\b/i);
  });
});

function mockCloudflare() {
  const calls = [];
  const fetch = vi.fn(async (url, init = {}) => {
    calls.push({ url, method: init.method || 'GET', headers: init.headers || {}, body: init.body });
    const h = (o) => ({ get: (k) => o[k.toLowerCase()] ?? null });
    if (init.method === 'POST' && url.endsWith('/stream')) {
      return { ok: true, status: 201, headers: h({ location: 'https://upload.example/tus/1', 'stream-media-id': 'uid-1' }) };
    }
    if (init.method === 'PATCH') {
      const off = Number(init.headers['Upload-Offset']) + init.body.length;
      return { ok: true, status: 204, headers: h({ 'upload-offset': String(off) }) };
    }
    if (init.method === 'POST') return { ok: true, status: 200, headers: h({}), json: async () => ({ success: true }) };
    return { ok: true, status: 200, headers: h({}), json: async () => ({ result: { readyToStream: true, preview: 'https://customer-xyz789.cloudflarestream.com/uid-1/watch' } }) };
  });
  return { fetch, calls };
}

describe('uploading', () => {
  const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'cfs-'));
  const list = [{ videoId: 'qi-b4', hostKey: 'lesson-qi-b4', number: 4, title: 'Shear', app: 'qi', tier: 'beginner' }];

  it('dry run sends and writes nothing', async () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'v/lesson-qi-b4'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'v/lesson-qi-b4/youtube.mp4'), Buffer.alloc(10));
    const { fetch } = mockCloudflare();
    const res = await run({ fetch, env: {}, list, series: 'qi', dryRun: true, videosDir: path.join(dir, 'v'), outDir: path.join(dir, 'out'), log: () => {} });
    expect(res.todo).toBe(1);
    expect(fetch).not.toHaveBeenCalled();
    expect(fs.existsSync(path.join(dir, 'out'))).toBe(false);
  });

  it('uploads by tus in chunks, locks to signed URLs on our site, waits, and records the uid', async () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, 'v/lesson-qi-b4'), { recursive: true });
    const size = CHUNK + 1000;
    fs.writeFileSync(path.join(dir, 'v/lesson-qi-b4/youtube.mp4'), Buffer.alloc(size, 7));
    const { fetch, calls } = mockCloudflare();
    const res = await run({ fetch, env: { CF_API_TOKEN: 't', CF_ACCOUNT_ID: 'acc' }, list, series: 'qi', videosDir: path.join(dir, 'v'), outDir: path.join(dir, 'out'), log: () => {}, waitOpts: { intervalMs: 0 } });

    const create = calls[0];
    expect(create.url).toBe('https://api.cloudflare.com/client/v4/accounts/acc/stream');
    expect(create.headers['Upload-Length']).toBe(String(size));
    expect(create.headers['Upload-Metadata']).toContain('requiresignedurls');
    expect(create.headers['Upload-Metadata']).toContain(`allowedorigins ${Buffer.from(ALLOWED_ORIGINS.join(',')).toString('base64')}`);
    const patches = calls.filter((c) => c.method === 'PATCH');
    expect(patches.map((p) => p.headers['Upload-Offset'])).toEqual(['0', String(CHUNK)]);
    const lock = calls.find((c) => c.method === 'POST' && c.url.endsWith('/stream/uid-1'));
    expect(JSON.parse(lock.body)).toMatchObject({ requireSignedURLs: true, allowedOrigins: ['nextgen.petrolord.com'] });

    expect(res.uploaded).toBe(1);
    expect(res.customerCode).toBe('xyz789');
    const rec = JSON.parse(fs.readFileSync(path.join(dir, 'out/qi.json'), 'utf8'));
    expect(rec[0]).toMatchObject({ videoId: 'qi-b4', uid: 'uid-1', tier: 'beginner', ready: true });
    expect(fs.readFileSync(path.join(dir, 'out/qi-academy-videos.sql'), 'utf8')).toContain("'uid-1'");

    // A re-run skips what is recorded (negative control on double uploads).
    const again = mockCloudflare();
    await run({ fetch: again.fetch, env: { CF_API_TOKEN: 't', CF_ACCOUNT_ID: 'acc' }, list, series: 'qi', videosDir: path.join(dir, 'v'), outDir: path.join(dir, 'out'), log: () => {} });
    expect(again.fetch).not.toHaveBeenCalled();
  });

});
