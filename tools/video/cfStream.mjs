// Cloudflare Stream helpers for the members-only lesson videos: pick the
// videos of a series from the registry, upload a master by tus, lock it to
// signed URLs on nextgen.petrolord.com, wait until it can stream, and write
// the academy_videos upsert the owner applies. Network calls go through the
// fetch passed in, so cfStream.test.mjs runs it against a mock.
import fs from 'node:fs';
import path from 'node:path';

export const API = 'https://api.cloudflare.com/client/v4';
export const ALLOWED_ORIGINS = ['nextgen.petrolord.com'];
// tus chunks must be a multiple of 256 KiB and at least 5 MiB (except the last).
export const CHUNK = 200 * 256 * 1024;
const TIER_ORDER = ['beginner', 'intermediate', 'advanced'];

/** KEY=VALUE lines; # comments and blank lines ignored. */
export function parseEnv(text) {
  const out = {};
  for (const line of String(text).split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !line.trim().startsWith('#')) out[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
  return out;
}

/** The lowest tier among the lessons a video enriches: its enrolment opens it. */
export function videoTier(video) {
  const tiers = (video.lessons || []).map((l) => l.split('/')[1]).filter((t) => TIER_ORDER.includes(t));
  if (!tiers.length) return null;
  return tiers.sort((a, b) => TIER_ORDER.indexOf(a) - TIER_ORDER.indexOf(b))[0];
}

/** Members-only videos of a series, optionally limited to lesson numbers from..to. */
export function membersVideos(VIDEOS, SERIES, series, { from = -Infinity, to = Infinity } = {}) {
  const s = SERIES[series];
  if (!s) throw new Error(`unknown series ${series}`);
  return Object.entries(VIDEOS)
    .filter(([, v]) => v.series === series && v.access === 'members' && v.number >= from && v.number <= to)
    .map(([videoId, v]) => ({ videoId, hostKey: v.hostKey, number: v.number, title: v.title, app: s.app, tier: videoTier(v) }));
}

const b64 = (s) => Buffer.from(String(s), 'utf8').toString('base64');

function auth(token, extra = {}) {
  return { Authorization: `Bearer ${token}`, ...extra };
}

async function ok(res, what) {
  if (res.ok) return res;
  const text = await res.text().catch(() => '');
  throw new Error(`${what}: HTTP ${res.status} ${text.slice(0, 300)}`);
}

/** tus upload of one file; returns the Stream uid. */
export async function tusUpload({ fetch, accountId, token, filePath, name, readFile = fs }) {
  const size = readFile.statSync(filePath).size;
  const meta = [`name ${b64(name)}`, 'requiresignedurls', `allowedorigins ${b64(ALLOWED_ORIGINS.join(','))}`].join(',');
  const created = await ok(await fetch(`${API}/accounts/${accountId}/stream`, {
    method: 'POST',
    headers: auth(token, { 'Tus-Resumable': '1.0.0', 'Upload-Length': String(size), 'Upload-Metadata': meta }),
  }), 'tus create');
  const location = created.headers.get('location');
  const uid = created.headers.get('stream-media-id');
  if (!location || !uid) throw new Error('tus create: no Location or stream-media-id header');
  const fd = readFile.openSync(filePath, 'r');
  try {
    let offset = 0;
    while (offset < size) {
      const len = Math.min(CHUNK, size - offset);
      const buf = Buffer.alloc(len);
      readFile.readSync(fd, buf, 0, len, offset);
      const res = await ok(await fetch(location, {
        method: 'PATCH',
        headers: auth(token, { 'Tus-Resumable': '1.0.0', 'Upload-Offset': String(offset), 'Content-Type': 'application/offset+octet-stream' }),
        body: buf,
      }), `tus patch at ${offset}`);
      const next = Number(res.headers.get('upload-offset'));
      offset = Number.isFinite(next) && next > offset ? next : offset + len;
    }
  } finally {
    readFile.closeSync(fd);
  }
  return uid;
}

/** Make sure the video plays only with a signed token, only on our site. */
export async function lockVideo({ fetch, accountId, token, uid, videoId }) {
  await ok(await fetch(`${API}/accounts/${accountId}/stream/${uid}`, {
    method: 'POST',
    headers: auth(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ requireSignedURLs: true, allowedOrigins: ALLOWED_ORIGINS, meta: { video_id: videoId } }),
  }), 'lock video');
}

/** Poll until readyToStream; returns the customer code read from the preview URL. */
export async function waitReady({ fetch, accountId, token, uid, intervalMs = 10000, timeoutMs = 30 * 60 * 1000, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }) {
  const start = Date.now();
  for (;;) {
    const res = await ok(await fetch(`${API}/accounts/${accountId}/stream/${uid}`, { headers: auth(token) }), 'status');
    const r = (await res.json()).result || {};
    if (r.status?.state === 'error') throw new Error(`${uid} failed to encode: ${r.status?.errorReasonText || 'error'}`);
    if (r.readyToStream) {
      const m = /customer-([a-z0-9]+)\.cloudflarestream\.com/.exec(r.preview || r.playback?.hls || '');
      return { customerCode: m ? m[1] : null };
    }
    if (Date.now() - start > timeoutMs) throw new Error(`${uid} not ready after ${timeoutMs / 60000} min`);
    await sleep(intervalMs);
  }
}

const sq = (s) => `'${String(s).replace(/'/g, "''")}'`;

/** One upsert for every uploaded video (no begin/commit: a single statement is atomic). */
export function upsertSql(records) {
  const rows = records.filter((r) => r.uid);
  if (!rows.length) return '-- nothing uploaded yet\n';
  const values = rows.map((r) => `  (${sq(r.videoId)}, ${sq(r.app)}, ${sq(r.tier)}, ${sq(r.uid)})`).join(',\n');
  return `-- academy_videos rows for the members-only lesson videos on Cloudflare Stream.\n`
    + `-- Generated by tools/video/cf-stream-upload.mjs; apply after the academy_videos migration.\n`
    + `insert into public.academy_videos (video_id, app, tier, stream_uid) values\n${values}\n`
    + `on conflict (video_id) do update set app = excluded.app, tier = excluded.tier, stream_uid = excluded.stream_uid;\n`;
}

/**
 * Upload the members-only videos of a series. Skips videos already recorded
 * with a uid. dryRun lists what would happen and touches nothing.
 */
export async function run({ fetch, env, list, videosDir, outDir, series, dryRun = false, log = console.log, readFile = fs, writeFile = fs, waitOpts = {} }) {
  const recPath = path.join(outDir, `${series}.json`);
  const sqlPath = path.join(outDir, `${series}-academy-videos.sql`);
  const records = readFile.existsSync(recPath) ? JSON.parse(readFile.readFileSync(recPath, 'utf8')) : [];
  const byId = new Map(records.map((r) => [r.videoId, r]));
  const todo = [];
  for (const v of list) {
    const file = path.join(videosDir, v.hostKey, 'youtube.mp4');
    if (!v.tier) { log(`skip ${v.videoId}: no tier in its lessons`); continue; }
    if (byId.get(v.videoId)?.uid) { log(`done ${v.videoId}: ${byId.get(v.videoId).uid}`); continue; }
    if (!readFile.existsSync(file)) { log(`MISSING ${v.videoId}: ${file}`); continue; }
    todo.push({ ...v, file, size: readFile.statSync(file).size });
  }
  for (const t of todo) log(`${dryRun ? 'would upload' : 'upload'} ${t.videoId} (${t.app}/${t.tier}) ${(t.size / 1048576).toFixed(1)} MB`);
  if (dryRun) return { uploaded: 0, todo: todo.length, records };
  if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID) throw new Error('CF_API_TOKEN and CF_ACCOUNT_ID are required in the env file');

  writeFile.mkdirSync(outDir, { recursive: true });
  const save = () => {
    writeFile.writeFileSync(recPath, JSON.stringify([...byId.values()], null, 2) + '\n');
    writeFile.writeFileSync(sqlPath, upsertSql([...byId.values()]));
  };
  let customerCode = null;
  let uploaded = 0;
  for (const t of todo) {
    const c = { fetch, accountId: env.CF_ACCOUNT_ID, token: env.CF_API_TOKEN };
    const uid = await tusUpload({ ...c, filePath: t.file, name: `${t.videoId} ${t.title}`, readFile });
    await lockVideo({ ...c, uid, videoId: t.videoId });
    byId.set(t.videoId, { videoId: t.videoId, hostKey: t.hostKey, app: t.app, tier: t.tier, uid, uploadedAt: new Date().toISOString() });
    save();
    const ready = await waitReady({ ...c, uid, ...waitOpts });
    customerCode = ready.customerCode || customerCode;
    byId.set(t.videoId, { ...byId.get(t.videoId), ready: true });
    save();
    uploaded += 1;
    log(`ready ${t.videoId}: ${uid}`);
  }
  if (!todo.length) save();
  return { uploaded, customerCode, records: [...byId.values()], recPath, sqlPath };
}
