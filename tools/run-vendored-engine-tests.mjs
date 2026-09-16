#!/usr/bin/env node
/**
 * RUN THE VENDORED ENGINE SUITES, AND HOLD THEM TO A LEDGER.
 *
 * Until now these suites ran NOWHERE. `npm test` is `vitest run`, and
 * vitest.config.js includes only src/**, so the 110 jest suites under
 * packages/engines/__tests__ were outside every glob in the repository. That
 * is why 24 tests could fail against NextGen's own vendored engines, in
 * economics.fdp and economics.screening, without anybody seeing it: the tests
 * and goldens for those two areas were vendored newer than the engine code
 * beside them, and nothing ever ran the pair together.
 *
 * Those 24 must not block this guard landing, and must not be silently
 * skipped either. So they are ALLOW-LISTED IN VENDOR.json WITH A REASON AND AN
 * EXACT COUNT, and this runner holds the list in both directions:
 *
 *   - a failing suite that is NOT on the list fails the build;
 *   - a listed suite failing MORE tests than recorded fails the build;
 *   - a listed suite failing FEWER, or passing outright, ALSO fails the build,
 *     with the instruction to update or remove the entry.
 *
 * That last rule is the one that matters. An allow-list that only caps the
 * damage rots: entries outlive their cause and the list becomes a list of
 * things nobody has looked at since. Requiring it to track reality exactly
 * means the Group 4 economics re-vendor cannot land without deleting these two
 * rows, and the list can only ever shrink.
 *
 * It also refuses an empty sweep: no suites discovered, or fewer than the
 * floor in VENDOR.json, is a failure and not a pass. A gate that reports
 * success while running nothing has cost this programme twice.
 *
 * Usage: node tools/run-vendored-engine-tests.mjs [-- <extra jest args>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VENDOR_DIR = path.join(REPO, 'packages', 'engines');
const VENDOR_JSON = path.join(VENDOR_DIR, 'VENDOR.json');

const fail = (msg) => {
  process.stderr.write(`run-vendored-engine-tests: ${msg}\n`);
  process.exit(2);
};

if (!fs.existsSync(VENDOR_JSON)) fail('packages/engines/VENDOR.json not found');
const vendor = JSON.parse(fs.readFileSync(VENDOR_JSON, 'utf8'));
const allowed = new Map();
for (const row of vendor?.knownTestFailures?.suites ?? []) {
  if (!row?.suite || !Number.isInteger(row.failing) || row.failing < 1) {
    fail(`knownTestFailures entry needs "suite" and a positive integer "failing": ${JSON.stringify(row)}`);
  }
  if (typeof row.reason !== 'string' || row.reason.trim().length < 8) {
    fail(`knownTestFailures entry for ${row.suite} needs a real "reason"`);
  }
  allowed.set(row.suite, row);
}
const MIN_SUITES = Number(vendor?.floors?.testSuites ?? 1);

const extra = process.argv.includes('--') ? process.argv.slice(process.argv.indexOf('--') + 1) : [];
const outFile = path.join(process.env.RUNNER_TMPDIR ?? VENDOR_DIR, `.jest-report-${process.pid}.json`);

// jest is a devDependency of packages/engines, not of the app, so look there
// first. Falling back to the repo root keeps this working in a hoisted install.
const jestBin = [
  path.join(VENDOR_DIR, 'node_modules', 'jest', 'bin', 'jest.js'),
  path.join(REPO, 'node_modules', 'jest', 'bin', 'jest.js'),
].find((p) => fs.existsSync(p));
if (!jestBin) {
  fail('jest not installed. Run `npm ci --prefix packages/engines` before this check;'
    + ' a missing runner must never read as a pass.');
}

const res = spawnSync(
  process.execPath,
  [jestBin, '--ci', '--silent', '--json', `--outputFile=${outFile}`, ...extra],
  { cwd: VENDOR_DIR, encoding: 'utf8', stdio: ['ignore', 'inherit', 'inherit'], maxBuffer: 64 * 1024 * 1024 },
);
if (res.error) fail(`could not run jest: ${res.error.message}`);

if (!fs.existsSync(outFile)) fail('jest produced no JSON report; treating as a failed run');
const report = JSON.parse(fs.readFileSync(outFile, 'utf8'));
fs.unlinkSync(outFile);

/* ------------------------------------------------------- empty-sweep guard */

const total = report.numTotalTestSuites ?? 0;
if (total === 0 || (report.testResults ?? []).length === 0) {
  process.stderr.write('EMPTY SWEEP REFUSED: jest discovered no vendored engine suites.\n');
  process.exit(1);
}
if (total < MIN_SUITES) {
  process.stderr.write(`EMPTY SWEEP REFUSED: ${total} suites discovered, below the floor of ${MIN_SUITES} in VENDOR.json.\n`);
  process.exit(1);
}
if ((report.numTotalTests ?? 0) === 0) {
  process.stderr.write('EMPTY SWEEP REFUSED: the suites ran zero test cases.\n');
  process.exit(1);
}

/* ------------------------------------------------------------- the ledger */

const failingNow = new Map();
for (const r of report.testResults ?? []) {
  const rel = path.relative(VENDOR_DIR, r.name).split(path.sep).join('/');
  const n = (r.assertionResults ?? []).filter((a) => a.status === 'failed').length;
  if (n > 0) failingNow.set(rel, n);
  else if (r.status === 'failed') failingNow.set(rel, Math.max(1, n)); // suite-level crash
}

const problems = [];
for (const [suite, n] of failingNow) {
  const row = allowed.get(suite);
  if (!row) {
    problems.push(`NEW FAILING SUITE  ${suite}: ${n} failing test(s), not in VENDOR.json knownTestFailures.`);
  } else if (n > row.failing) {
    problems.push(`GREW  ${suite}: ${n} failing, allow-list records ${row.failing}. The allow-list must never grow.`);
  } else if (n < row.failing) {
    problems.push(`IMPROVED  ${suite}: ${n} failing, allow-list records ${row.failing}. Lower the count in VENDOR.json.`);
  }
}
for (const [suite, row] of allowed) {
  if (!failingNow.has(suite)) {
    problems.push(`FIXED  ${suite}: now passes, but is still allow-listed for ${row.failing} failure(s). Remove the entry from VENDOR.json.`);
  }
}

const allowedTotal = [...allowed.values()].reduce((a, r) => a + r.failing, 0);
process.stdout.write(
  `\nvendored engine suites: ${total} discovered, ${report.numTotalTests} test(s) run, `
  + `${report.numFailedTests ?? 0} failing, ${allowedTotal} allow-listed in VENDOR.json.\n`,
);

if (problems.length) {
  process.stderr.write('\nVENDORED ENGINE TEST LEDGER\n\n');
  for (const p of problems) process.stderr.write(`  ${p}\n`);
  process.stderr.write(
    '\nEvery failing vendored suite must be recorded in packages/engines/VENDOR.json\n'
    + 'under knownTestFailures, with a reason and an exact count, or fixed.\n',
  );
  process.exit(1);
}

process.stdout.write('every failing suite is accounted for, and no allow-listed suite has gone stale.\n');
process.exit(0);
