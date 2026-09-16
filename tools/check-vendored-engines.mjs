#!/usr/bin/env node
/**
 * THE VENDORED ENGINE GUARD.
 *
 * NextGen vendors the Petrolord engines by hand, one domain at a time. Nothing
 * in the repository has ever recorded which canonical commit the tree as a
 * whole corresponds to, so "did that pull bring everything" has never had an
 * answer to check against. The 2026-09-16 divergence audit measured the cost:
 * 210 canonical paths absent, 136 differing, and the live courses grading
 * values the Suite's apps can no longer reproduce.
 *
 * WHAT THIS CHECKS. Exactly the comparison the audit ran, and nothing softer:
 * every tracked path under packages/engines/ is joined by path against the
 * canonical tree at the pinned commit and compared BY GIT BLOB HASH. A path
 * that is absent, extra, or differing by one byte is a finding.
 *
 * WHY A LEDGER RATHER THAN A CLEAN COMPARE. The tree is not reconciled today
 * and cannot be in one step: Groups 3 and 4 of the audit move live graded
 * values and need their own deploy windows. A gate that is red on the day it
 * lands is a gate somebody deletes. So every KNOWN deviation is enumerated in
 * VENDOR.json with a reason and a group, and each differing or extra path is
 * PINNED TO ITS CURRENT VENDORED BLOB HASH. That pin is what stops the ledger
 * being a blanket amnesty: if a production engine file drifts a second time,
 * its hash no longer matches the pin and the guard fails, even though the path
 * was already on the list.
 *
 * The ledger also refuses to go stale. An entry describing a deviation that no
 * longer exists is itself a failure, because that is how the list burns down
 * as Groups 3 and 4 land instead of quietly accumulating dead rows.
 *
 * WHY THE MANIFEST IS COMMITTED. CI has no credentials for the private engines
 * repository, so the canonical blob hashes are committed beside VENDOR.json in
 * VENDOR.manifest. The check is then offline, needs no build and no clone, and
 * runs in well under a second. Passing --canonical <path to a real clone>
 * re-derives the manifest from git and verifies the committed copy against it,
 * which is what a vendoring pass and a nightly job should do; without it the
 * manifest is trusted, and its own integrity is covered by the pinned commit
 * plus review of any diff to it.
 *
 * FAILING ON AN EMPTY SWEEP. A gate that reports success while examining
 * nothing has already cost this programme twice, most recently promptleak.py,
 * which passed for months while sweeping zero prompts. This one asserts that
 * the manifest, the vendored tree and the join are all non-empty and at least
 * the floor sizes recorded in VENDOR.json before it is allowed to report
 * success, and it prints how many paths it actually compared.
 *
 * Usage:
 *   node tools/check-vendored-engines.mjs [--canonical <dir>] [--json] [--quiet]
 * Exit 0 clean, 1 on any finding, 2 on a usage or integrity error.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VENDOR_DIR = path.join(REPO, 'packages', 'engines');
const VENDOR_JSON = path.join(VENDOR_DIR, 'VENDOR.json');
const VENDOR_MANIFEST = path.join(VENDOR_DIR, 'VENDOR.manifest');
const PREFIX = 'packages/engines/';

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};
const has = (name) => args.includes(name);
const QUIET = has('--quiet');
const AS_JSON = has('--json');

const die = (msg) => {
  process.stderr.write(`check-vendored-engines: ${msg}\n`);
  process.exit(2);
};

/* ---------------------------------------------------------------- inputs */

if (!fs.existsSync(VENDOR_JSON)) die(`missing ${path.relative(REPO, VENDOR_JSON)}`);
let vendor;
try {
  vendor = JSON.parse(fs.readFileSync(VENDOR_JSON, 'utf8'));
} catch (e) {
  die(`${path.relative(REPO, VENDOR_JSON)} is not valid JSON: ${e.message}`);
}

const commit = vendor?.canonical?.commit;
if (typeof commit !== 'string' || !/^[0-9a-f]{40}$/.test(commit)) {
  die('canonical.commit must be a full 40 character sha in VENDOR.json');
}
const floors = vendor.floors ?? {};
const MIN_MANIFEST = Number(floors.manifestPaths ?? 1);
const MIN_VENDORED = Number(floors.vendoredPaths ?? 1);

/** Canonical path -> blob sha, from the committed manifest. */
const readManifest = (text, whence) => {
  const map = new Map();
  let lineNo = 0;
  for (const raw of text.split('\n')) {
    lineNo += 1;
    const line = raw.trimEnd();
    if (!line || line.startsWith('#')) continue;
    const sp = line.indexOf(' ');
    if (sp === -1) die(`${whence}:${lineNo}: expected "<sha> <path>"`);
    const sha = line.slice(0, sp);
    const p = line.slice(sp + 1);
    if (!/^[0-9a-f]{40}$/.test(sha)) die(`${whence}:${lineNo}: bad blob sha`);
    if (map.has(p)) die(`${whence}:${lineNo}: duplicate path ${p}`);
    map.set(p, sha);
  }
  return map;
};

if (!fs.existsSync(VENDOR_MANIFEST)) die(`missing ${path.relative(REPO, VENDOR_MANIFEST)}`);
const canonical = readManifest(fs.readFileSync(VENDOR_MANIFEST, 'utf8'), 'VENDOR.manifest');

/* Optional: re-derive the manifest from a real canonical clone. */
const canonDir = opt('--canonical');
if (canonDir) {
  if (!fs.existsSync(path.join(canonDir, '.git'))) die(`--canonical ${canonDir} is not a git clone`);
  let out;
  try {
    out = execFileSync('git', ['-C', canonDir, 'ls-tree', '-r', commit, '--format=%(objectname) %(path)'], {
      encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    });
  } catch (e) {
    die(`cannot list canonical ${commit} in ${canonDir}: ${e.message}`);
  }
  const live = readManifest(out, `${canonDir}@${commit}`);
  const drift = [];
  for (const [p, sha] of live) if (canonical.get(p) !== sha) drift.push(`manifest ${canonical.has(p) ? 'stale for' : 'is missing'} ${p}`);
  for (const p of canonical.keys()) if (!live.has(p)) drift.push(`manifest has ${p}, absent from canonical ${commit}`);
  if (drift.length) {
    for (const d of drift.slice(0, 40)) process.stderr.write(`  ${d}\n`);
    die(`VENDOR.manifest disagrees with ${canonDir} at ${commit} on ${drift.length} path(s); regenerate it`);
  }
  if (!QUIET) process.stdout.write(`manifest verified against ${canonDir} at ${commit.slice(0, 7)} (${live.size} paths)\n`);
}

/* The vendored tree, as git sees it: tracked paths only, by blob hash. */
let lsFiles;
try {
  lsFiles = execFileSync('git', ['-C', REPO, 'ls-files', '-s', '--', 'packages/engines'], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
} catch (e) {
  die(`git ls-files failed: ${e.message}`);
}
// The vendoring contract itself lives inside the vendored directory so that it
// travels with the tree, but it is NextGen's own control data and has no
// canonical counterpart. It is not vendored content and is not compared.
const SELF = new Set(['VENDOR.json', 'VENDOR.manifest']);

const vendored = new Map();
for (const line of lsFiles.split('\n')) {
  if (!line.trim()) continue;
  // <mode> <sha> <stage>\t<path>
  const tab = line.indexOf('\t');
  if (tab === -1) die(`unparseable git ls-files line: ${line}`);
  const [, sha] = line.slice(0, tab).split(/\s+/);
  const p = line.slice(tab + 1);
  if (!p.startsWith(PREFIX)) continue;
  const rel = p.slice(PREFIX.length);
  if (SELF.has(rel)) continue;
  vendored.set(rel, sha);
}

/* ------------------------------------------------- the empty-sweep guard */

const fatal = [];
if (canonical.size === 0) fatal.push('VENDOR.manifest lists no canonical paths');
if (vendored.size === 0) fatal.push('git ls-files found no tracked paths under packages/engines');
if (canonical.size < MIN_MANIFEST) fatal.push(`manifest has ${canonical.size} paths, below the floor of ${MIN_MANIFEST}`);
if (vendored.size < MIN_VENDORED) fatal.push(`vendored tree has ${vendored.size} tracked paths, below the floor of ${MIN_VENDORED}`);
if (fatal.length) {
  for (const f of fatal) process.stderr.write(`EMPTY SWEEP REFUSED: ${f}\n`);
  process.stderr.write('A gate that examines nothing must never report success.\n');
  process.exit(1);
}

/* ------------------------------------------------------------- the ledger */

const ledger = new Map();
const seenLedger = new Set();
for (const [i, entry] of (vendor.knownDeviations ?? []).entries()) {
  const where = `knownDeviations[${i}]`;
  if (!entry || typeof entry.path !== 'string') die(`${where}: needs a "path"`);
  if (!['missing', 'differing', 'extra'].includes(entry.kind)) die(`${where}: kind must be missing, differing or extra`);
  if (typeof entry.reason !== 'string' || entry.reason.trim().length < 8) die(`${where}: needs a real "reason"`);
  if (typeof entry.group !== 'string' || !entry.group) die(`${where}: needs a "group"`);
  if (entry.kind !== 'missing') {
    if (!/^[0-9a-f]{40}$/.test(entry.vendoredSha ?? '')) {
      die(`${where}: a ${entry.kind} path must pin "vendoredSha" to the blob currently vendored`);
    }
  }
  if (ledger.has(entry.path)) die(`${where}: ${entry.path} is listed twice`);
  ledger.set(entry.path, entry);
}

const findings = [];
const note = (kind, p, detail, entry) => findings.push({ kind, path: p, detail, group: entry?.group ?? null });

let compared = 0;

for (const [p, canonSha] of canonical) {
  const vendSha = vendored.get(p);
  const entry = ledger.get(p);
  if (vendSha === undefined) {
    if (!entry) note('MISSING', p, 'in canonical, absent from the vendored tree, and not in the ledger');
    else if (entry.kind !== 'missing') note('LEDGER', p, `ledger calls this "${entry.kind}" but the path is absent`, entry);
    else seenLedger.add(p);
    continue;
  }
  compared += 1;
  if (vendSha === canonSha) {
    if (entry) note('STALE', p, `ledger still lists this as "${entry.kind}" but it now matches canonical; remove the entry`, entry);
    continue;
  }
  if (!entry) {
    note('DIFFERING', p, `vendored ${vendSha.slice(0, 12)} vs canonical ${canonSha.slice(0, 12)}, and not in the ledger`);
  } else if (entry.kind !== 'differing') {
    note('LEDGER', p, `ledger calls this "${entry.kind}" but the path is present and differs`, entry);
  } else if (entry.vendoredSha !== vendSha) {
    note('DRIFT', p, `known divergence, but the vendored blob moved: pinned ${entry.vendoredSha.slice(0, 12)}, now ${vendSha.slice(0, 12)}`, entry);
  } else {
    seenLedger.add(p);
  }
}

for (const [p, vendSha] of vendored) {
  if (canonical.has(p)) continue;
  const entry = ledger.get(p);
  if (!entry) {
    note('EXTRA', p, 'present in the vendored tree, absent from canonical, and not in the ledger');
  } else if (entry.kind !== 'extra') {
    note('LEDGER', p, `ledger calls this "${entry.kind}" but the path exists only in the vendored tree`, entry);
  } else if (entry.vendoredSha !== vendSha) {
    note('DRIFT', p, `known local-only file, but its blob moved: pinned ${entry.vendoredSha.slice(0, 12)}, now ${vendSha.slice(0, 12)}`, entry);
  } else {
    seenLedger.add(p);
  }
}

for (const p of ledger.keys()) {
  if (seenLedger.has(p)) continue;
  if (findings.some((f) => f.path === p)) continue;
  note('STALE', p, 'ledger entry matches no deviation in the tree; remove it', ledger.get(p));
}

if (compared === 0) {
  process.stderr.write('EMPTY SWEEP REFUSED: the join compared zero present paths.\n');
  process.exit(1);
}

/* -------------------------------------------------------------- reporting */

const byGroup = {};
for (const e of ledger.values()) byGroup[e.group] = (byGroup[e.group] ?? 0) + 1;

if (AS_JSON) {
  process.stdout.write(`${JSON.stringify({
    commit, canonicalPaths: canonical.size, vendoredPaths: vendored.size,
    comparedPaths: compared, ledgerEntries: ledger.size, byGroup, findings,
  }, null, 2)}\n`);
} else if (findings.length) {
  const order = ['MISSING', 'DIFFERING', 'EXTRA', 'DRIFT', 'LEDGER', 'STALE'];
  process.stderr.write(`\nVENDORED ENGINE GUARD: ${findings.length} finding(s) against canonical ${commit.slice(0, 7)}\n\n`);
  for (const kind of order) {
    const rows = findings.filter((f) => f.kind === kind);
    if (!rows.length) continue;
    process.stderr.write(`${kind} (${rows.length}):\n`);
    for (const r of rows) process.stderr.write(`  ${r.path}\n      ${r.detail}\n`);
    process.stderr.write('\n');
  }
  process.stderr.write(
    'Every deviation from canonical must be either reconciled or recorded in\n'
    + 'packages/engines/VENDOR.json with a reason and a group. Never pull an engine\n'
    + 'file without applying its recut in the same deploy window.\n',
  );
} else if (!QUIET) {
  const groups = Object.entries(byGroup).sort().map(([g, n]) => `${g} ${n}`).join(', ');
  process.stdout.write(
    `vendored engines clean against canonical ${commit.slice(0, 7)}: `
    + `${compared} path(s) compared byte for byte, ${canonical.size} canonical, `
    + `${vendored.size} vendored, ${ledger.size} recorded deviation(s) (${groups}).\n`,
  );
}

process.exit(findings.length ? 1 : 0);
