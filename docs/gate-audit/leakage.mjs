#!/usr/bin/env node
// A LESSON may not hand a learner a graded capstone answer.
//
// FATAL: a value graded at tier T appears, within its tolerance, in a tier
//   BELOW T. That learner has been handed the higher tier's answer.
// SELF: a graded value appears in its OWN tier, which makes the capstone a
//   copying exercise rather than an analysis.
//
// WHAT THE PREVIOUS VERSION DID, AND WHY IT COULD REPORT NOTHING
// --------------------------------------------------------------
// It read `fields.json` from the wave directory and swept `src/content/courses/
// <slug>` from the repo, and it validated neither. Handed an empty
// `fields.json` it printed "sweeping 78 lesson files against 0 graded fields"
// and "fatal downward leaks: 0", and exited 0. Handed empty tier directories it
// printed "sweeping 0 lesson files" and exited 0. Both are the same bug
// promptleak had: the gate cannot tell "I checked and found nothing" from "I
// checked nothing". Verified empirically on 2026-09-16.
//
// Three further ways it examined less than it appeared to:
//
//   * `fields.json` in a wave directory DRIFTS from the answer key production
//     actually grades against. Six live waves' files disagree with the database
//     today, three of them in the VALUE of a graded field. A sweep against a
//     stale key is a sweep against the wrong answers, and it reports clean.
//     So this version reads the key from the database by default.
//   * its number regex split digit-grouped literals, so a lesson printing
//     "1,234,567.89" was swept as "1", "234" and "567.89" and could never match
//     anything. Grouped literals are now one number.
//   * literals of fewer than two significant figures are skipped, which is
//     right for noise but means 34 of the 793 live graded values, every one of
//     them a single-digit count or a round decimal, CANNOT be matched at all.
//     That blind spot is now printed rather than hidden, and `--integers`
//     sweeps it on demand.
//
// REFUSALS. Exit 2, never 0, when the gate cannot do its job: no graded fields,
// no source files, no numeric literals, a missing content directory, a
// malformed key, or a --banks run in which nothing is a question bank.
//
//   node leakage.mjs <wave_dir> [--banks]          legacy, wave-directory key
//   node leakage.mjs --db --all --content-root DIR every live course
//   node leakage.mjs --db --course dca --content-root DIR
//   node leakage.mjs --selftest                    negative control
//
// Exit codes: 0 clean, 1 leaks, 2 REFUSED. Only 0 is a pass.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';

const TIERS = ['beginner', 'intermediate', 'advanced'];
const RANK = { beginner: 0, intermediate: 1, advanced: 2 };
const TIER_OF = { b: 'beginner', i: 'intermediate', a: 'advanced' };
const DEFAULT_REPO = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen';

class Refused extends Error {}

// Unit scales a graded value may legitimately be restated at. 1 first, so an
// exact literal reports without a unit note.
const ALL_SCALES = [
  [1, '1'], [1e3, 'x1e3'], [1e-3, 'x1e-3'], [1e6, 'x1e6'], [1e-6, 'x1e-6'],
  [1e2, 'x1e2'], [1e-2, 'x1e-2'], [1e9, 'x1e9'], [1e-9, 'x1e-9'],
  [1 / 6894.757293168, 'psi'], [6894.757293168, 'pascals per psi'],
  [1 / 0.3048, 'per foot'], [0.3048, 'x0.3048'],
];
// A UNIT RESTATEMENT IS EXACT; AN APPROXIMATION IS NOISE. At scale 1 the
// grader's own tolerance is the whole test. Under a shifting, a loose absolute
// tolerance becomes a wildcard: EC3 saw 46 flags from one breakeven price
// matching an NPV under 'per foot', a conversion that means nothing for money.
// A genuine restatement in another unit ROUNDS the value, so it must agree
// relatively as well. This generalises the per-wave `leakScales` allowlist.
const REL_TOL = 1e-4;

// PHYSICAL CONVERSIONS ARE NOT RESTATEMENTS OF AN ARBITRARY QUANTITY. A value
// restated from metres to millimetres is the same number in another notation,
// and catching that is why the scale list exists (DR9 printed a graded 0.0381 m
// as "38.1 millimetres"). Dividing a dimensionless quantity by 0.3048 is not a
// restatement of anything: on `basin`, a lesson's 15.38095238095238 degC/km
// gradient came within tolerance of a graded vitrinite reflectance of 4.6879
// purely because 15.381 / 3.28084 = 4.6881, and reflectance has no feet in it.
// Across the 44 live courses these four conversions produced 202 of the 1700
// raw cross-tier hits and not one of them survived reading.
//
// So powers of ten stay FATAL and the four physical conversions are reported as
// NOTES that do not fail the gate, unless --physical-scales says otherwise or
// the wave names them in leakScales.
const PHYSICAL = new Set(['psi', 'pascals per psi', 'per foot', 'x0.3048']);
let PHYSICAL_ON = false;

// Digit-grouped numbers first, so "1,600,000" is one number and not three.
const NUM = /-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g;

const sigFigs = (raw) => raw.replace(/,/g, '').replace(/[-.eE+]/g, '').replace(/^0+/, '').length;

// A number welded to a word is a NAME, not a quantity: EJULEBE-1, AGBADA-9,
// the 01 of a 2031-01 date, the m04 of a module id.
function* numbersIn(text) {
  for (const m of String(text ?? '').matchAll(NUM)) {
    const raw = m[0];
    const start = m.index;
    const before = start > 0 ? text[start - 1] : ' ';
    if (/[A-Za-z_]/.test(before)) continue;
    if (raw.startsWith('-') && start > 0 && /[0-9A-Za-z]/.test(before)) continue;
    const v = Number(raw.replace(/,/g, ''));
    if (Number.isFinite(v)) yield [raw, v];
  }
}

// ------------------------------------------------------------------ inputs

function readJson(p, what) {
  if (!fs.existsSync(p)) throw new Refused(`${what} does not exist: ${p}`);
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    throw new Refused(`${what} is not readable JSON (${p}): ${e.message}`);
  }
}

function validateGraded(rows, where) {
  if (!Array.isArray(rows)) throw new Refused(`${where} is not an array of graded fields`);
  if (rows.length === 0) {
    throw new Refused(
      `${where} holds ZERO graded fields. A leak sweep against no answer key `
      + 'checks nothing, and reporting that as a pass is the defect this gate was repaired for.');
  }
  const out = [];
  for (const r of rows) {
    if (!Array.isArray(r) || r.length !== 4) {
      throw new Refused(`${where} has a row that is not [tier, key, value, tol]: ${JSON.stringify(r)}`);
    }
    const [tier, key, value, tol] = r;
    if (!(tier in RANK)) throw new Refused(`${where}: unknown tier "${tier}" for ${key}`);
    if (!Number.isFinite(value) || !Number.isFinite(tol) || tol < 0) {
      throw new Refused(`${where}: ${tier}.${key} has a non-numeric value or tolerance`);
    }
    out.push([tier, key, value, tol]);
  }
  return out;
}

const DB_QUERY = `
select coalesce(jsonb_agg(jsonb_build_object(
  'app_slug', app_slug, 'tier', tier, 'fields', fields) order by app_slug, tier), '[]'::jsonb) as dump
from public.academy_capstones where active;
`;

function gradedFromDb(workdir) {
  const qpath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'leakq-')), 'q.sql');
  fs.writeFileSync(qpath, DB_QUERY);
  let stdout;
  try {
    stdout = execFileSync('supabase', ['db', 'query', '--linked', '-f', qpath, '-o', 'json'],
      { cwd: workdir, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    throw new Refused(`supabase db query failed: ${String(e.stderr || e.message).slice(0, 300)}`);
  } finally {
    fs.rmSync(path.dirname(qpath), { recursive: true, force: true });
  }
  let rows;
  try {
    rows = JSON.parse(stdout).rows[0].dump;
  } catch (e) {
    throw new Refused(`could not read the query result: ${e.message}`);
  }
  const by = new Map();
  for (const r of rows) {
    for (const f of (r.fields || [])) {
      if (typeof f.expected !== 'number' || typeof f.tol !== 'number') continue;
      if (!by.has(r.app_slug)) by.set(r.app_slug, []);
      by.get(r.app_slug).push([r.tier, f.key, f.expected, f.tol]);
    }
  }
  if (by.size === 0) throw new Refused('the database returned no active capstone fields');
  return by;
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name))
    : (e.name.endsWith('.md') ? [path.join(d, e.name)] : [])));

function lessonSources(contentDir) {
  if (!fs.existsSync(contentDir)) {
    throw new Refused(`the course content directory does not exist: ${contentDir}. `
      + 'Refusing rather than reporting a clean sweep of nothing.');
  }
  const out = [];
  const emptyTiers = [];
  for (const t of TIERS) {
    const dir = path.join(contentDir, t);
    if (!fs.existsSync(dir)) { emptyTiers.push(t); continue; }
    const files = walk(dir);
    if (files.length === 0) emptyTiers.push(t);
    for (const f of files) {
      out.push([t, f, fs.readFileSync(f, 'utf8').split('\n')
        .map((line, i) => [`line ${i + 1}`, line])]);
    }
  }
  if (out.length === 0) {
    throw new Refused(`no lesson .md files under ${contentDir} (tiers with nothing: `
      + `${emptyTiers.join(', ') || 'none found'}). A sweep of zero files is not a pass.`);
  }
  return { sources: out, emptyTiers };
}

function bankSources(banksDir, prefix) {
  if (!fs.existsSync(banksDir)) throw new Refused(`no banks directory: ${banksDir}`);
  const all = fs.readdirSync(banksDir).filter((n) => n.endsWith('.json')).sort();
  const skipped = [];
  const out = [];
  for (const n of all) {
    if (n.startsWith('RECUT-')) { skipped.push(`${n} (recut manifest)`); continue; }
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(path.join(banksDir, n), 'utf8'));
    } catch (e) {
      skipped.push(`${n} (unparseable: ${e.message})`);
      continue;
    }
    if (!Array.isArray(parsed)) { skipped.push(`${n} (not a question array)`); continue; }
    const tier = TIER_OF[n[prefix.length]];
    if (!tier) {
      throw new Refused(`bank file "${n}" has no b/i/a tier letter at position `
        + `${prefix.length} for prefix "${prefix}". Refusing rather than guessing its tier.`);
    }
    const lines = [];
    parsed.forEach((q, i) => {
      // THE LABEL IS NOT CONTENT: only the content is scanned, so a question
      // index can never be swept as if a learner could read it as a value.
      lines.push([`Q${i + 1} prompt`, q.prompt]);
      (q.options || []).forEach((o, j) => lines.push([`Q${i + 1} option${j}`, o]));
      lines.push([`Q${i + 1} explanation`, q.explanation]);
    });
    out.push([tier, path.join(banksDir, n), lines]);
  }
  if (out.length === 0) {
    throw new Refused(`no question banks in ${banksDir}: ${all.length} .json file(s) present, `
      + `all skipped [${skipped.join('; ') || 'none'}]. A sweep of zero banks is not a pass.`);
  }
  return { sources: out, skipped };
}

// ------------------------------------------------------------------- sweep

// A literal of fewer than two significant figures is noise in prose. That is
// the right default, and it is also a hole: a graded value that is itself a
// single digit can never be matched by it. Say so out loud.
function blindSpot(graded) {
  return graded.filter(([, , value]) => sigFigs(String(Math.abs(value))) < 2);
}

function sweep(graded, sources, { scales = ALL_SCALES, integers = false } = {}) {
  const findings = [];
  let numbers = 0;
  let lines = 0;
  for (const [tier, file, content] of sources) {
    for (const [label, text] of content) {
      lines += 1;
      for (const [raw, v] of numbersIn(text)) {
        if (!integers && sigFigs(raw) < 2) continue;
        numbers += 1;
        for (const [gTier, key, value, tol] of graded) {
          let hit = null;
          for (const [f, slabel] of scales) {
            if (Math.abs(v - value * f) > tol * f) continue;
            if (f !== 1) {
              const rel = Math.abs(v - value * f) / Math.max(Math.abs(value * f), 1e-30);
              if (rel > REL_TOL) continue;
            }
            hit = slabel;
            break;
          }
          if (!hit) continue;
          const kind = RANK[tier] < RANK[gTier] ? 'FATAL' : (tier === gTier ? 'SELF' : null);
          if (!kind) continue;
          findings.push({ kind, tier, file, label, raw, value: v, gTier, key, expected: value, tol, scale: hit });
        }
      }
    }
  }
  if (lines === 0) throw new Refused('the sources held no lines at all. That is not a pass.');
  if (numbers === 0) {
    throw new Refused('the sweep examined ZERO numeric literals across every source file. '
      + 'A leak sweep that saw no numbers has validated nothing.');
  }
  return { findings, stats: { files: sources.length, lines, numbers, fields: graded.length } };
}

function report(graded, sources, out, label) {
  const { findings, stats } = out;
  const blind = blindSpot(graded);
  const lines = [];
  lines.push(`${label}: ${stats.files} file(s), ${stats.lines} lines, `
    + `${stats.numbers} numeric literals against ${stats.fields} graded fields`);
  const isNote = (f) => !PHYSICAL_ON && PHYSICAL.has(f.scale);
  const fatal = findings.filter((f) => f.kind === 'FATAL' && !isNote(f));
  const self = findings.filter((f) => f.kind === 'SELF' && !isNote(f));
  const notes = findings.filter(isNote);
  for (const f of fatal) {
    const via = f.scale === '1' ? '' : ` (as ${f.scale})`;
    lines.push(`  FATAL ${f.tier} ${path.basename(path.dirname(f.file))}/${path.basename(f.file)} `
      + `${f.label} prints ${f.raw}${via}, which satisfies ${f.gTier}:${f.key} (${f.expected} +/- ${f.tol})`);
  }
  for (const f of self) {
    const via = f.scale === '1' ? '' : ` (as ${f.scale})`;
    lines.push(`  SELF  ${f.tier} ${path.basename(path.dirname(f.file))}/${path.basename(f.file)} `
      + `${f.label} prints ${f.raw}${via}, which satisfies its own tier's ${f.key} (${f.expected} +/- ${f.tol})`);
  }
  if (notes.length) {
    lines.push(`  note: ${notes.length} further match(es) hold only under a physical unit `
      + 'conversion (psi, feet) and are not counted; --physical-scales shows them');
  }
  if (blind.length) {
    lines.push(`  NOT COVERED: ${blind.length} graded field(s) are single-significant-figure `
      + `values this sweep cannot match (${blind.map(([t, k, v]) => `${t}.${k}=${v}`).join(', ')})`);
  }
  lines.push(`  => fatal downward leaks: ${fatal.length}   same-tier answer prints: ${self.length}`);
  return { text: lines.join('\n'), bad: fatal.length + self.length };
}

// --------------------------------------------------------- negative control

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'leaktest-'));
}

function writeCourse(root, slug, lessons) {
  for (const [tier, name, body] of lessons) {
    const d = path.join(root, slug, tier, 'm01-module');
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, name), body);
  }
  for (const t of TIERS) fs.mkdirSync(path.join(root, slug, t), { recursive: true });
}

const TEST_FIELDS = [
  ['beginner', 'b_rate', 1234.5678, 0.001],
  ['intermediate', 'i_head', 98765.4321, 0.01],
  ['advanced', 'a_npv', 55555.5, 0.5],
];

function selftest() {
  let ok = true;
  const check = (name, cond) => {
    console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}`);
    ok = ok && cond;
  };
  const refuses = (name, fn) => {
    try { fn(); } catch (e) { check(name, e instanceof Refused); return; }
    check(name, false);
  };
  console.log('negative control');

  const root = tmpdir();
  const clean = [
    ['beginner', 'l01.md', 'The stage rate is read from the ledger at a duty of 310 bbl/d.\n'],
    ['intermediate', 'l01.md', 'The pump develops head over 42 stages; compute it.\n'],
    ['advanced', 'l01.md', 'Value the development at a discount rate of 9.5 percent.\n'],
  ];
  writeCourse(root, 'zz', clean);
  const graded = validateGraded(TEST_FIELDS, 'test fields');
  const srcClean = lessonSources(path.join(root, 'zz')).sources;

  let r = sweep(graded, srcClean);
  check('a clean lesson set reports no leak', report(graded, srcClean, r, 't').bad === 0);
  check('and it really did examine three files', r.stats.files === 3);
  check('and it really did examine numeric literals', r.stats.numbers > 0);

  // plant a downward leak: the Associate lesson prints the Professional answer
  const planted = tmpdir();
  writeCourse(planted, 'zz', [
    ['beginner', 'l01.md', 'The head at that point is 98765.4321 ft.\n'],
    ...clean.slice(1),
  ]);
  const srcP = lessonSources(path.join(planted, 'zz')).sources;
  r = sweep(graded, srcP);
  check('a planted downward leak goes RED',
    r.findings.some((f) => f.kind === 'FATAL' && f.key === 'i_head' && f.tier === 'beginner'));
  check('removing the planted leak goes green again', sweep(graded, srcClean).findings.length === 0);

  // a leak restated in another unit
  const shifted = tmpdir();
  writeCourse(shifted, 'zz', [['beginner', 'l01.md', 'The head is 98.7654321 thousand ft.\n'],
    ...clean.slice(1)]);
  r = sweep(graded, lessonSources(path.join(shifted, 'zz')).sources);
  check('a leak restated at another unit scale is still caught',
    r.findings.some((f) => f.key === 'i_head' && f.scale !== '1'));

  // A LOOSE TOLERANCE UNDER A SHIFTING IS A WILDCARD. A bare "180" degF matched
  // a 0.176 porosity at x1000 because 0.18 is inside a 0.005 tolerance. A
  // genuine restatement in another unit ROUNDS the value, so it must agree
  // relatively as well.
  const loose = validateGraded([['advanced', 'phi', 0.17615030026601647, 0.005]], 'loose');
  const lc = tmpdir();
  writeCourse(lc, 'zz', [['beginner', 'l01.md', 'Read the sand at 180 degF.\n'],
    ...clean.slice(1)]);
  r = sweep(loose, lessonSources(path.join(lc, 'zz')).sources);
  check('a loose approximation under a unit shifting is not called a leak',
    !r.findings.some((f) => f.key === 'phi'));

  // WHAT THE RELATIVE RULE CANNOT DO, AND WHY leakScales STILL EXISTS. EC3's
  // breakeven price of 73.3297 USD/bbl agrees with a graded NPV of 22.35046
  // million USD to two parts in a hundred thousand under 'per foot'. It is a
  // coincidence, but a TIGHT one, so no relative rule can separate it: only
  // restricting the scales can. Money restates by powers of a thousand and by
  // nothing else, which is what a wave says in wave.json's leakScales.
  const money = validateGraded([['advanced', 'npv_musd', 22.35045845910797, 0.01]], 'money');
  const mc = tmpdir();
  writeCourse(mc, 'zz', [['beginner', 'l01.md', 'The breakeven price is 73.3297 USD per barrel.\n'],
    ...clean.slice(1)]);
  const mSrc = lessonSources(path.join(mc, 'zz')).sources;
  check('an irrelevant conversion still fires when every scale is allowed',
    sweep(money, mSrc).findings.some((f) => f.key === 'npv_musd'));
  const thousands = ALL_SCALES.filter(([, l]) => ['1', 'x1e3', 'x1e-3', 'x1e6', 'x1e-6'].includes(l));
  check('and declaring leakScales in wave.json suppresses it',
    !sweep(money, mSrc, { scales: thousands }).findings.some((f) => f.key === 'npv_musd'));

  // same-tier print is a SELF finding
  const selfd = tmpdir();
  writeCourse(selfd, 'zz', [['beginner', 'l01.md', 'The stage rate is 1234.5678 bbl/d.\n'],
    ...clean.slice(1)]);
  r = sweep(graded, lessonSources(path.join(selfd, 'zz')).sources);
  check('a lesson printing its own tier answer is a SELF finding',
    r.findings.some((f) => f.kind === 'SELF' && f.key === 'b_rate'));

  // digit grouping: the old regex split this into 98, 765.4321 and missed it
  const grouped = tmpdir();
  writeCourse(grouped, 'zz', [['beginner', 'l01.md', 'The head is 98,765.4321 ft.\n'],
    ...clean.slice(1)]);
  r = sweep(graded, lessonSources(path.join(grouped, 'zz')).sources);
  check('a digit-grouped literal is one number and is caught',
    r.findings.some((f) => f.kind === 'FATAL' && f.key === 'i_head'));

  // a number welded to a well name is a name, not a quantity
  const named = validateGraded([['intermediate', 'decline', -0.01, 0.001]], 'named');
  const nd = tmpdir();
  writeCourse(nd, 'zz', [['beginner', 'l01.md', 'Wells EJULEBE-1 and UMU-01 were drilled.\n'],
    ...clean.slice(1)]);
  r = sweep(named, lessonSources(path.join(nd, 'zz')).sources);
  check('a number welded to a well name is not swept as a quantity',
    !r.findings.some((f) => f.raw === '-1' || f.raw === '-01'));

  // A PHYSICAL CONVERSION OF A DIMENSIONLESS QUANTITY IS NOT A RESTATEMENT.
  // This is the basin false positive: a 15.381 degC/km gradient divided by
  // 0.3048 lands on a graded vitrinite reflectance of 4.6880, and reflectance
  // has no feet in it. The match is found, and it is a note, not a failure.
  const dimless = validateGraded([['intermediate', 'ro_full', 4.687971627022019, 0.005]], 'dimless');
  const pc = tmpdir();
  writeCourse(pc, 'zz', [['beginner', 'l01.md', 'The gradient is 15.38095238095238 degC per km.\n'],
    ...clean.slice(1)]);
  const pSrc = lessonSources(path.join(pc, 'zz')).sources;
  const pOut = sweep(dimless, pSrc);
  check('a match holding only under a physical unit conversion is found',
    pOut.findings.some((f) => f.scale === 'per foot'));
  check('and it is reported as a NOTE rather than failing the gate',
    report(dimless, pSrc, pOut, 't').bad === 0);

  // the blind spot is declared rather than hidden
  const oneFig = validateGraded([['advanced', 'count', 5, 0]], 'onefig');
  check('a single-significant-figure graded value is reported as NOT COVERED',
    blindSpot(oneFig).length === 1
    && report(oneFig, srcClean, sweep(oneFig, srcClean), 't').text.includes('NOT COVERED'));

  // REFUSALS
  refuses('an EMPTY fields.json is REFUSED, not passed', () => validateGraded([], 'empty'));
  refuses('a malformed graded row is REFUSED', () => validateGraded([['beginner', 'k', 1]], 'bad'));
  refuses('a non-numeric graded value is REFUSED',
    () => validateGraded([['beginner', 'k', 'x', 0.1]], 'bad'));
  refuses('a missing fields file is REFUSED',
    () => readJson(path.join(root, 'nope.json'), 'fields.json'));
  refuses('a missing content directory is REFUSED',
    () => lessonSources(path.join(root, 'no-such-course')));
  const emptyCourse = tmpdir();
  for (const t of TIERS) fs.mkdirSync(path.join(emptyCourse, 'zz', t), { recursive: true });
  refuses('a content directory with no lessons is REFUSED',
    () => lessonSources(path.join(emptyCourse, 'zz')));
  const noNums = tmpdir();
  writeCourse(noNums, 'zz', [['beginner', 'l01.md', 'state the answer in words\n']]);
  refuses('lessons containing no numbers at all are REFUSED',
    () => sweep(graded, lessonSources(path.join(noNums, 'zz')).sources));
  const noBanks = tmpdir();
  fs.mkdirSync(path.join(noBanks, 'banks'), { recursive: true });
  refuses('a --banks run with no bank files is REFUSED',
    () => bankSources(path.join(noBanks, 'banks'), 'zz'));
  fs.writeFileSync(path.join(noBanks, 'banks', 'zzb_m01.json'), '{"not":"an array"}');
  refuses('a --banks run where nothing is a question array is REFUSED',
    () => bankSources(path.join(noBanks, 'banks'), 'zz'));

  console.log('\nnegative control: ' + (ok ? 'ALL PASS' : 'FAILURES ABOVE'));
  return ok ? 0 : 1;
}

// -------------------------------------------------------------------- main

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('--selftest')) return selftest();
  const flag = (n, d = null) => {
    const i = argv.indexOf(n);
    return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
  };
  const useBanks = argv.includes('--banks');
  const useDb = argv.includes('--db');
  const integers = argv.includes('--integers');
  PHYSICAL_ON = argv.includes('--physical-scales');
  const all = argv.includes('--all');
  const course = flag('--course');
  const contentRoot = flag('--content-root');
  const workdir = flag('--workdir', '.');
  const jsonOut = flag('--json');
  const wave = argv.find((a) => !a.startsWith('--')
    && argv[argv.indexOf(a) - 1] !== '--course'
    && argv[argv.indexOf(a) - 1] !== '--content-root'
    && argv[argv.indexOf(a) - 1] !== '--workdir'
    && argv[argv.indexOf(a) - 1] !== '--json');

  const results = [];
  let bad = 0;
  try {
    if (useDb) {
      if (!contentRoot) throw new Refused('--db needs --content-root <src/content/courses>');
      const byCourse = gradedFromDb(workdir);
      let slugs = [...byCourse.keys()].sort();
      if (course) {
        if (!byCourse.has(course)) throw new Refused(`no active capstone rows for course "${course}"`);
        slugs = [course];
      } else if (!all) {
        throw new Refused('--db needs --all or --course SLUG');
      }
      // ONE COURSE'S REFUSAL MUST NOT BLIND THE OTHER FORTY-THREE. A sweep of
      // every live course that stops at the first course it cannot read has
      // examined a prefix of the estate and said nothing about the rest, which
      // is a smaller version of the defect this gate was repaired for. Each
      // course is swept independently; refusals are collected and named, and
      // the run still exits 2 because a refusal is never a pass.
      const refused = [];
      for (const slug of slugs) {
        try {
          const graded = validateGraded(byCourse.get(slug), `the live answer key for ${slug}`);
          const { sources } = lessonSources(path.join(contentRoot, slug));
          const out = sweep(graded, sources, { integers });
          const rep = report(graded, sources, out, slug);
          console.log(rep.text);
          bad += rep.bad;
          results.push({ course: slug, stats: out.stats, findings: out.findings });
        } catch (e) {
          if (!(e instanceof Refused)) throw e;
          refused.push([slug, e.message]);
          console.log(`${slug}: REFUSED: ${e.message}`);
          results.push({ course: slug, refused: e.message });
        }
      }
      console.log(`\n${slugs.length} course(s) attempted, ${slugs.length - refused.length} swept, `
        + `${refused.length} REFUSED.  total fatal+self: ${bad}`);
      for (const [slug, msg] of refused) console.log(`  REFUSED ${slug}: ${msg}`);
      if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(results, null, 1));
      if (refused.length) return 2;
    } else {
      if (!wave) throw new Refused('usage: leakage.mjs <wave_dir> [--banks] | --db --all --content-root DIR');
      const cfgPath = path.join(wave, 'wave.json');
      const cfg = readJson(cfgPath, 'wave.json');
      const repo = cfg.repo || DEFAULT_REPO;
      const graded = validateGraded(readJson(path.join(wave, 'fields.json'), 'fields.json'),
        `${wave}/fields.json`);
      let scales = ALL_SCALES;
      if (Array.isArray(cfg.leakScales)) {
        scales = ALL_SCALES.filter(([, l]) => cfg.leakScales.includes(l));
        if (scales.length !== cfg.leakScales.length) {
          throw new Refused(`wave.json leakScales names an unknown scale: ${cfg.leakScales.join(', ')}`);
        }
        if (!scales.some(([f]) => f === 1)) {
          throw new Refused('wave.json leakScales must include "1"');
        }
      }
      const { sources } = useBanks
        ? bankSources(path.join(wave, 'banks'), cfg.prefix)
        : lessonSources(contentRoot || path.join(repo, 'src/content/courses', cfg.slug));
      const out = sweep(graded, sources, { scales, integers });
      const rep = report(graded, sources, out, `${cfg.slug} ${useBanks ? 'banks' : 'lessons'}`);
      console.log(rep.text);
      bad = rep.bad;
      results.push({ course: cfg.slug, stats: out.stats, findings: out.findings });
    }
  } catch (e) {
    if (e instanceof Refused) {
      console.error(`\nREFUSED: ${e.message}`);
      console.error('This gate does not pass on an empty or unreadable sweep.');
      return 2;
    }
    throw e;
  }
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(results, null, 1));
  return bad ? 1 : 0;
}

process.exit(main());
