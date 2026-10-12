#!/usr/bin/env node
// Upload the members-only masters of a lesson series to Cloudflare Stream.
//
//   node tools/video/cf-stream-upload.mjs --series qi --dry-run
//   node tools/video/cf-stream-upload.mjs --series qi            (QI lessons 4-18)
//   options: --from 4 --to 18  --env /root/.cloudflare-stream.env
//            --videos /root/demo-videos  --out /root/video-host/cloudflare-stream
//
// Reads CF_API_TOKEN and CF_ACCOUNT_ID from the env file (mode 600, made by the
// owner). Read-only on the video folders. Each video goes up by tus with
// requireSignedURLs and allowedOrigins nextgen.petrolord.com, then waits until
// it can stream. Writes <out>/<series>.json (the uid record; re-runs skip what
// is there) and <out>/<series>-academy-videos.sql (the upsert the owner applies).
import fs from 'node:fs';
import { VIDEOS, SERIES } from '../../src/content/videos/registry.js';
import { parseEnv, membersVideos, run } from './cfStream.mjs';

const argv = process.argv.slice(2);
const arg = (name, dflt) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : dflt; };
const flag = (name) => argv.includes(`--${name}`);

const series = arg('series', 'qi');
const envPath = arg('env', '/root/.cloudflare-stream.env');
const dryRun = flag('dry-run');
let env = {};
if (fs.existsSync(envPath)) {
  const mode = fs.statSync(envPath).mode & 0o077;
  if (mode) console.warn(`warning: ${envPath} is readable by others; chmod 600 it`);
  env = parseEnv(fs.readFileSync(envPath, 'utf8'));
} else if (!dryRun) {
  console.error(`No ${envPath}. Create it with CF_API_TOKEN and CF_ACCOUNT_ID (mode 600).`);
  process.exit(2);
}

const list = membersVideos(VIDEOS, SERIES, series, { from: Number(arg('from', -Infinity)), to: Number(arg('to', Infinity)) });
try {
  const res = await run({
    fetch: globalThis.fetch, env, list, series, dryRun,
    videosDir: arg('videos', '/root/demo-videos'),
    outDir: arg('out', '/root/video-host/cloudflare-stream'),
  });
  if (dryRun) {
    console.log(`\nDRY RUN: ${res.todo} to upload. Nothing was sent or written.`);
  } else {
    console.log(`\n${res.uploaded} uploaded. Record: ${res.recPath}\nApply: ${res.sqlPath}`);
    if (res.customerCode) console.log(`Customer code for CF_STREAM_CUSTOMER_CODE: ${res.customerCode}`);
  }
} catch (e) {
  console.error(`FAILED: ${e.message}`);
  process.exit(1);
}
