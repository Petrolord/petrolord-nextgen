// THE AS-OF GATE, run from outside the generators (brief rule 2).
//
// 1. STATIC. Every export whose signature defaults its date to the machine
//    clock is found by reading the vendored engine source. Neither generator
//    may call one of them on the raw module (RAW.<module>.<export>(...)), which
//    would route around the runtime guard, except inside a block that is the
//    named negative control.
// 2. RUNTIME, WITH NEGATIVE CONTROLS. The dump and the capstone must both run
//    clean; RC_NEGATIVE=omit (one call made without its as-of date) and
//    RC_NEGATIVE=clock (one engine call allowed to fall back to its default
//    today) must both FAIL, each with its own message.
import fs from 'fs';
import { spawnSync } from 'child_process';

const WAVE = '/root/as-wip-riskchange';
const ROOT = process.env.RC_ENGINES || '/root/wt-as-riskchange-nextgen/packages/engines';
const SIG = /export const (\w+) = (?:\(([\s\S]*?)\)|(\w+)) =>/g;
const names = new Set();
for (const m of ['calendar', 'riskScoring', 'managementOfChange', 'peerReview', 'lessonsLearned', 'qualityAssurance']) {
  const src = fs.readFileSync(`${ROOT}/engines/assurance/${m}.js`, 'utf8');
  for (const hit of src.matchAll(SIG)) {
    if (/(today|asOf)\s*=\s*new Date\(\)/.test(hit[2] ?? '')) names.add(hit[1]);
  }
}
let fail = 0;
console.log(`as-of gate: ${names.size} date-taking export names read from the engine source: ${[...names].sort().join(', ')}`);
if (names.size < 10) { console.log('  GATE REFUSES: too few date-taking exports found'); process.exit(2); }

for (const f of ['riskchange_dump.mjs', 'riskchange_capstone.mjs']) {
  const lines = fs.readFileSync(`${WAVE}/${f}`, 'utf8').split('\n');
  let raw = 0; let allowed = 0;
  lines.forEach((l, i) => {
    const m = l.match(/RAW\.(\w+)\.(\w+)\(/);
    if (!m || !names.has(m[2])) return;
    const ctx = lines.slice(Math.max(0, i - 4), i + 1).join('\n');
    if (/NEGATIVE === '(clock|utc)'/.test(ctx)) { allowed += 1; return; }
    raw += 1;
    console.log(`  FAIL ${f}:${i + 1} calls ${m[1]}.${m[2]} on the raw module, around the as-of guard`);
  });
  fail += raw;
  console.log(`  static ${f}: ${raw} raw date call(s) outside a negative control, ${allowed} inside one`);
}

const run = (file, env) => spawnSync(process.execPath, [`${WAVE}/${file}`], {
  env: { ...process.env, ...env, RC_CALLS_OUT: '/dev/null', RC_CAP_CALLS_OUT: '/dev/null',
    RC_FIELDS_OUT: '/dev/null', RC_PRECISION_OUT: '/dev/null' },
  encoding: 'utf8',
});
const clean = run('riskchange_dump.mjs', {});
const guarded = /(\d+) date-taking calls each handed the as-of date/.exec(clean.stderr);
console.log(`  runtime dump clean: exit ${clean.status}, ${guarded ? guarded[1] : '?'} guarded date calls`);
if (clean.status !== 0 || !guarded) fail += 1;
const cap = run('riskchange_capstone.mjs', {});
console.log(`  runtime capstone clean: exit ${cap.status}`);
if (cap.status !== 0) fail += 1;
// discriminate.mjs calls the engines directly by design (its wrong routes are
// engine calls on mistaken readings); it installs the same clock trap, so any
// call that fell back to the clock would stop it.
const disc = spawnSync(process.execPath, [`${WAVE}/discriminate.mjs`], { encoding: 'utf8' });
console.log(`  runtime discriminate under the clock trap: exit ${disc.status}${/CLOCK READ/.test(disc.stderr) ? ', CLOCK READ' : ''}`);
if (disc.status !== 0) fail += 1;
const omit = run('riskchange_dump.mjs', { RC_NEGATIVE: 'omit' });
const omitOk = omit.status !== 0 && /AS-OF GATE: \w+\.\w+ was called without its date argument/.test(omit.stderr);
console.log(`  negative control omit: exit ${omit.status}, ${omitOk ? 'the as-of gate fired' : 'DID NOT FIRE'}`);
if (!omitOk) fail += 1;
const clock = run('riskchange_dump.mjs', { RC_NEGATIVE: 'clock' });
const clockOk = clock.status !== 0 && /CLOCK READ/.test(clock.stderr);
console.log(`  negative control clock: exit ${clock.status}, ${clockOk ? 'the clock trap fired' : 'DID NOT FIRE'}`);
if (!clockOk) fail += 1;
console.log(fail ? `as-of gate: ${fail} failure(s)` : 'as-of gate: clean, and both negative controls fire');
process.exit(fail ? 1 : 0);
