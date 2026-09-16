#!/usr/bin/env node
// Every long numeric literal in a course's lessons (or its banks, with
// --banks) must resolve to a value the wave DERIVED by running the engine, not
// to a number somebody typed.
//
// The resolver is built from every truth-*.json the wave produced, from the
// goldens the wave names in wave.json, and from the constants it declares.
// Anything else with seven or more significant figures is UNRESOLVED.
//
// WHAT THE PREVIOUS VERSION DID, AND WHY IT COULD REPORT NOTHING
// --------------------------------------------------------------
// Handed a wave whose tier directories were empty it printed "sweeping 0
// lesson files against 0 derived values", "literals with 7+ significant
// figures checked: 0   unresolved: 0", and exited 0. Verified empirically on
// 2026-09-16. Three separate empty states all reported as a clean pass:
//
//   * no source files at all;
//   * a resolver built from nothing, so there was no ground truth to resolve
//     against (this direction is loud when files DO exist, because everything
//     then fails, but silent when both are empty);
//   * source files present but not one literal long enough to check, which
//     means the gate's actual question was never asked of anything.
//
// It also examined less than it appeared to. Its number regex split
// digit-grouped literals, so a lesson printing "1,234,567.89" was swept as
// "1", "234" and "567.89", none of which reaches seven significant figures:
// the longest and most obviously hand-typed numbers in a lesson were the ones
// it could not see. Grouped literals are now one number.
//
// A blind spot that remains, now declared rather than hidden: sigFigs() strips
// TRAILING zeros, so a round literal like "1234500.0" counts as five figures
// and is never checked. That is deliberate (a round number is rarely an engine
// return) but it is a hole, and the run prints how many literals it skipped
// for that reason.
//
// REFUSALS. Exit 2, never 0, when the gate cannot do its job.
//
//   node numsweep.mjs <wave_dir> [--banks] [--content DIR]
//   node numsweep.mjs --selftest
//
// Exit codes: 0 clean, 1 unresolved literals, 2 REFUSED. Only 0 is a pass.
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const TIERS = ['beginner', 'intermediate', 'advanced'];
const TIER_OF = { b: 'beginner', i: 'intermediate', a: 'advanced' };
const DEFAULT_REPO = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen';

class Refused extends Error {}

// Digit-grouped numbers first, so "1,600,000.25" is one number and not three.
const NUM = /-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g;
const bare = (raw) => raw.replace(/,/g, '');
const sigFigs = (raw) => bare(raw).replace(/[-.eE+]/g, '').replace(/^0+/, '').replace(/0+$/, '').length;
const sigFigsKeepingTrailing = (raw) => bare(raw).replace(/[-.eE+]/g, '').replace(/^0+/, '').length;

const UNIT_SCALES = [
  [1, ''], [1e3, 'x1e3'], [1e-3, 'x1e-3'], [1e6, 'x1e6'], [1e-6, 'x1e-6'],
  [1e9, 'x1e9'], [1e-9, 'x1e-9'], [1e2, 'x1e2'], [1e-2, 'x1e-2'],
  [1 / 6894757.293168, 'kpsi'], [1 / 6894.757293168, 'psi'],
  [1 / 9.869233e-16, 'darcy'], [1 / 9.869233e-13, 'millidarcy'],
];

function readJson(p, what) {
  if (!fs.existsSync(p)) throw new Refused(`${what} does not exist: ${p}`);
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    throw new Refused(`${what} is not readable JSON (${p}): ${e.message}`);
  }
}

function buildResolver(wave, cfg, repo) {
  const known = new Map();
  const add = (v, label) => {
    if (!Number.isFinite(v) || v === 0) return;
    if (!known.has(v)) known.set(v, label);
  };
  // Lessons write signs explicitly ("a skin of minus 2.68"), so the sweep sees
  // a POSITIVE literal for a negative engine value. Register both.
  const harvest = (obj, prefix) => {
    if (typeof obj === 'number') { add(obj, prefix); add(Math.abs(obj), `|${prefix}|`); return; }
    if (Array.isArray(obj)) { obj.forEach((o, i) => harvest(o, `${prefix}[${i}]`)); return; }
    if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) harvest(v, `${prefix}.${k}`);
    }
  };
  const sources = [];
  for (const f of fs.readdirSync(wave).filter((n) => n.startsWith('truth-') && n.endsWith('.json'))) {
    harvest(readJson(path.join(wave, f), f), f.replace('.json', ''));
    sources.push(f);
  }
  const missingGoldens = [];
  for (const g of cfg.goldens || []) {
    const p = path.join(repo, 'packages/engines/test-data', g);
    if (!fs.existsSync(p)) { missingGoldens.push(g); continue; }
    harvest(readJson(p, g), path.basename(g, '.json'));
    sources.push(g);
  }
  if (missingGoldens.length) {
    throw new Refused(`wave.json names golden(s) that do not exist: ${missingGoldens.join(', ')}. `
      + 'Refusing rather than resolving against a smaller set than the wave declared.');
  }
  for (const [v, l] of Object.entries(cfg.constants || {})) add(Number(v), l);
  if (known.size === 0) {
    throw new Refused('the resolver is EMPTY: no truth-*.json, no goldens and no constants. '
      + 'There is nothing to resolve lesson numbers against, so this is not a pass.');
  }
  return { known, sources };
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
  for (const t of TIERS) {
    const dir = path.join(contentDir, t);
    if (!fs.existsSync(dir)) continue;
    for (const f of walk(dir)) out.push([f, fs.readFileSync(f, 'utf8').split('\n')]);
  }
  if (out.length === 0) {
    throw new Refused(`no lesson .md files under ${contentDir}. A sweep of zero files is not a pass.`);
  }
  return out;
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
    } catch (e) { skipped.push(`${n} (unparseable)`); continue; }
    if (!Array.isArray(parsed)) { skipped.push(`${n} (not a question array)`); continue; }
    if (prefix && !TIER_OF[n[prefix.length]]) {
      throw new Refused(`bank file "${n}" has no b/i/a tier letter for prefix "${prefix}"`);
    }
    const lines = [];
    parsed.forEach((q, i) => {
      lines.push(`Q${i + 1} prompt: ${q.prompt}`);
      (q.options || []).forEach((o, j) => lines.push(`Q${i + 1} option${j}: ${o}`));
      lines.push(`Q${i + 1} explanation: ${q.explanation}`);
    });
    out.push([path.join(banksDir, n), lines]);
  }
  if (out.length === 0) {
    throw new Refused(`no question banks in ${banksDir}: ${all.length} .json file(s), all skipped `
      + `[${skipped.join('; ') || 'none'}]. A sweep of zero banks is not a pass.`);
  }
  return out;
}

function sweep(known, sources) {
  const resolve = (v) => {
    for (const [k, label] of known) {
      for (const [f, unit] of UNIT_SCALES) {
        const target = k * f;
        const scale = Math.max(Math.abs(target), Math.abs(v), 1e-12);
        // A literal with exactly 7 significant figures is a ROUNDING of the
        // engine value, so its relative error can reach 5e-7.
        if (Math.abs(target - v) / scale < 5e-7) return unit ? `${label} (${unit})` : label;
      }
    }
    return null;
  };
  const unresolved = [];
  let checked = 0;
  let skippedRound = 0;
  for (const [file, lines] of sources) {
    lines.forEach((line, i) => {
      for (const m of String(line).matchAll(NUM)) {
        const raw = m[0];
        if (sigFigs(raw) < 7) {
          if (sigFigsKeepingTrailing(raw) >= 7) skippedRound += 1;
          continue;
        }
        const v = Number(bare(raw));
        if (!Number.isFinite(v)) continue;
        checked += 1;
        if (!resolve(v)) unresolved.push({ file, line: i + 1, raw });
      }
    });
  }
  if (checked === 0) {
    throw new Refused(`${sources.length} source file(s) held NOT ONE literal of seven or more `
      + 'significant figures, so the gate\'s question was never asked. That is not a pass. '
      + '(A course whose lessons quote no engine value at full precision is itself a finding.)');
  }
  return { unresolved, checked, skippedRound };
}

// --------------------------------------------------------- negative control

function tmpdir() { return fs.mkdtempSync(path.join(os.tmpdir(), 'numtest-')); }

function makeWave(truth, constants = {}) {
  const w = tmpdir();
  fs.writeFileSync(path.join(w, 'wave.json'),
    JSON.stringify({ slug: 'zz', prefix: 'zz', goldens: [], constants }));
  if (truth) fs.writeFileSync(path.join(w, 'truth-a.json'), JSON.stringify(truth));
  return w;
}

function makeContent(bodies) {
  const root = tmpdir();
  for (const t of TIERS) fs.mkdirSync(path.join(root, 'zz', t), { recursive: true });
  bodies.forEach(([tier, body], i) => {
    const d = path.join(root, 'zz', tier, 'm01');
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, `l0${i + 1}.md`), body);
  });
  return path.join(root, 'zz');
}

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

  const w = makeWave({ rate: 1234.5678901, head: 98765.43210987 });
  const cfg = readJson(path.join(w, 'wave.json'), 'wave.json');
  const { known } = buildResolver(w, cfg, '/nonexistent-repo');

  const cleanC = makeContent([['beginner', 'The rate is 1234.5678901 bbl/d.\n']]);
  let r = sweep(known, lessonSources(cleanC));
  check('a lesson quoting a derived value resolves', r.unresolved.length === 0);
  check('and it really did check a literal', r.checked === 1);

  // 4271839.55 is not any scaling of either known value, so it can only have
  // been typed. (An earlier draft of this control used 9876543.21, which IS
  // the head at x1e2 and therefore resolved: a negative control has to be
  // checked against the resolver it is testing.)
  const dirty = makeContent([['beginner', 'The rate is 1234.5678901 and the gain is 4271839.55 bbl.\n']]);
  r = sweep(known, lessonSources(dirty));
  check('a planted hand-typed number goes RED',
    r.unresolved.length === 1 && r.unresolved[0].raw === '4271839.55');
  check('removing it goes green again', sweep(known, lessonSources(cleanC)).unresolved.length === 0);

  const unit = makeContent([['beginner', 'The rate is 1.2345678901 thousand bbl/d.\n']]);
  check('a value restated in another unit still resolves',
    sweep(known, lessonSources(unit)).unresolved.length === 0);

  // digit grouping: the old regex split this and never checked it at all
  const grouped = makeContent([['beginner', 'The gain is 4,271,839.55 bbl.\n']]);
  r = sweep(known, lessonSources(grouped));
  check('a digit-grouped literal is one number and IS checked',
    r.checked === 1 && r.unresolved.length === 1 && r.unresolved[0].raw === '4,271,839.55');

  // the trailing-zero blind spot is counted out loud
  const round = makeContent([['beginner', 'The rate is 1234.5678901 and the total is 1234500.0 bbl.\n']]);
  r = sweep(known, lessonSources(round));
  check('a round literal skipped for trailing zeros is COUNTED, not silently dropped',
    r.skippedRound === 1);

  // REFUSALS
  refuses('a missing wave.json is REFUSED',
    () => readJson(path.join(tmpdir(), 'wave.json'), 'wave.json'));
  refuses('an EMPTY resolver (no truth, no goldens, no constants) is REFUSED',
    () => buildResolver(makeWave(null), { goldens: [], constants: {} }, '/nonexistent-repo'));
  refuses('a golden the wave names but that does not exist is REFUSED',
    () => buildResolver(makeWave({ a: 1.23456789 }), { goldens: ['nope.json'] }, '/nonexistent-repo'));
  refuses('a missing content directory is REFUSED',
    () => lessonSources('/no/such/course'));
  const emptyC = tmpdir();
  for (const t of TIERS) fs.mkdirSync(path.join(emptyC, 'zz', t), { recursive: true });
  refuses('a content directory with no lessons is REFUSED',
    () => lessonSources(path.join(emptyC, 'zz')));
  const shortC = makeContent([['beginner', 'The rate is about 12 bbl/d.\n']]);
  refuses('lessons with no literal long enough to check are REFUSED',
    () => sweep(known, lessonSources(shortC)));
  const nb = tmpdir();
  fs.mkdirSync(path.join(nb, 'banks'), { recursive: true });
  refuses('a --banks run with no bank files is REFUSED', () => bankSources(path.join(nb, 'banks'), 'zz'));
  fs.writeFileSync(path.join(nb, 'banks', 'zzb_m01.json'), '{"not":"an array"}');
  refuses('a --banks run where nothing is a question array is REFUSED',
    () => bankSources(path.join(nb, 'banks'), 'zz'));

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
  const contentOverride = flag('--content');
  const wave = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--content');
  try {
    if (!wave) throw new Refused('usage: numsweep.mjs <wave_dir> [--banks] [--content DIR]');
    const cfg = readJson(path.join(wave, 'wave.json'), 'wave.json');
    const repo = cfg.repo || DEFAULT_REPO;
    const { known, sources: resolverFrom } = buildResolver(wave, cfg, repo);
    const src = useBanks
      ? bankSources(path.join(wave, 'banks'), cfg.prefix)
      : lessonSources(contentOverride || path.join(repo, 'src/content/courses', cfg.slug));
    const { unresolved, checked, skippedRound } = sweep(known, src);
    console.log(`${cfg.slug}: sweeping ${src.length} ${useBanks ? 'bank' : 'lesson'} file(s) `
      + `against ${known.size} derived values from ${resolverFrom.length} source(s)`);
    for (const u of unresolved) {
      console.log(`  UNRESOLVED ${path.basename(path.dirname(u.file))}/${path.basename(u.file)}:${u.line}  ${u.raw}`);
    }
    console.log(`  => literals with 7+ significant figures checked: ${checked}   unresolved: ${unresolved.length}`
      + (skippedRound ? `   (${skippedRound} round literal(s) skipped for trailing zeros, not checked)` : ''));
    return unresolved.length ? 1 : 0;
  } catch (e) {
    if (e instanceof Refused) {
      console.error(`\nREFUSED: ${e.message}`);
      console.error('This gate does not pass on an empty or unreadable sweep.');
      return 2;
    }
    throw e;
  }
}

process.exit(main());
