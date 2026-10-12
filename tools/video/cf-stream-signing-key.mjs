#!/usr/bin/env node
// One-off: create the Cloudflare Stream signing key that academy-video-url
// signs playback tokens with.
//
//   node tools/video/cf-stream-signing-key.mjs
//   options: --env /root/.cloudflare-stream.env  --key-file /root/.cloudflare-stream-signing-key.json
//
// Cloudflare shows the key once. It is written to the key file (mode 600) and
// never printed: the output only names the key id and the file, and the
// commands to set the function secrets read the file inside your own shell.
import fs from 'node:fs';
import { API, parseEnv } from './cfStream.mjs';

const argv = process.argv.slice(2);
const arg = (name, dflt) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : dflt; };
const envPath = arg('env', '/root/.cloudflare-stream.env');
const keyFile = arg('key-file', '/root/.cloudflare-stream-signing-key.json');

if (fs.existsSync(keyFile) && !argv.includes('--force')) {
  console.error(`${keyFile} already exists. A second key is not needed; pass --force to make another.`);
  process.exit(2);
}
if (!fs.existsSync(envPath)) {
  console.error(`No ${envPath}. Create it with CF_API_TOKEN and CF_ACCOUNT_ID (mode 600).`);
  process.exit(2);
}
const env = parseEnv(fs.readFileSync(envPath, 'utf8'));
if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID) {
  console.error('CF_API_TOKEN and CF_ACCOUNT_ID are required in the env file.');
  process.exit(2);
}

const res = await fetch(`${API}/accounts/${env.CF_ACCOUNT_ID}/stream/keys`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${env.CF_API_TOKEN}` },
});
const body = await res.json().catch(() => ({}));
if (!res.ok || !body?.result?.id || !body.result.jwk) {
  console.error(`Key creation failed: HTTP ${res.status} ${JSON.stringify(body?.errors || [])}`);
  process.exit(1);
}
fs.writeFileSync(keyFile, JSON.stringify({ id: body.result.id, jwk: body.result.jwk, created: body.result.created }) + '\n', { mode: 0o600 });
fs.chmodSync(keyFile, 0o600);

const read = (field) => `$(node -p "require('${keyFile}').${field}")`;
console.log(`Signing key ${body.result.id} saved to ${keyFile} (mode 600). The key itself is not shown.`);
console.log('\nIn your own SSH terminal (not in the chat), set the function secrets:');
console.log(`  cd /opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen && supabase secrets set CF_STREAM_KEY_ID="${read('id')}" CF_STREAM_JWK="${read('jwk')}" --project-ref txcsbtvcdaqmkjjbhbeg`);
