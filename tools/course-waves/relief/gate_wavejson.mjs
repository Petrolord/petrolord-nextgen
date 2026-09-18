// GATE: wave.json must not outlive the digest, the fields, the structure or
// the engine it describes.
//
// FC4 built this gate because its wave.json gave TWO answers for its own
// digest in one file: a `digest` block saying 675 lines and 19 sections, and a
// `gates` entry saying 721 and 20. A plan that outlives its engine is a named
// failure mode on this programme, and a plan that contradicts ITSELF is the
// same failure with the evidence already in the room.
//
// Every claim wave.json makes that can be checked against a file is checked
// here, against that file. Three rules hold the gate honest:
//
//   1. IT PRINTS WHAT IT EXAMINED. Every claim it read is named on the way
//      past, so a green run is a list of checks rather than a word.
//   2. A MISSING KEY IS AN UNCHECKED CLAIM, NOT A PASS. Keys this gate wants
//      and cannot find are reported by name, and more than two of them is a
//      failure: a wave.json missing three of the blocks the gate reads is not
//      a file this gate has checked.
//   3. IT REFUSES BELOW TEN CHECKABLE CLAIMS. A gate that examined nothing
//      and exited 0 is the defect this programme keeps finding in its own
//      gates, so too little to have checked anything exits 2.
//
// Usage:
//   node gate_wavejson.mjs                  checks /root/fc-wip-relief
//   FC5_WAVE=<dir> node gate_wavejson.mjs   checks another copy of the wave
//   node gate_wavejson.mjs --no-live        skips the two gate subprocesses
//   node gate_wavejson.mjs --selftest       plants defects and proves it sees them
//
// Copy rule: no em dashes and no "X, not Y" contrastives anywhere a learner
// reads, and this file obeys it too.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const DEFAULT_WAVE = '/root/fc-wip-relief';
const KIT = '/root/dc-wavekit';

const md5 = (buf) => crypto.createHash('md5').update(buf).digest('hex');
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

/** Numerals the digest and wave.json both spell out. "fourteen published
 *  orifice areas" covers the audit row that names 14 rows, and a coverage test
 *  that cannot read a spelled numeral reports a miss that is not there. */
const NUMERALS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, twentyfive: 25, fifty: 50,
};

/** A constants KEY may name its figure symbolically rather than type it: "4
 *  pi" is the solid angle in the point source. The gate computes what such a
 *  key is worth rather than reporting the constant as undeclared. */
function symbolicValues(key) {
  const out = [];
  const pi = /^(\d+(?:\.\d+)?)\s*pi$/i.exec(key.trim());
  if (pi) out.push(Number(pi[1]) * Math.PI);
  const over = /^(\d+(?:\.\d+)?)\s*(?:\/|over)\s*(\d+(?:\.\d+)?)$/i.exec(key.trim());
  if (over && Number(over[2]) !== 0) out.push(Number(over[1]) / Number(over[2]));
  return out;
}

/** THE AUDIT SECTION IS THE AUTHORITY ON WHICH CONSTANTS EXIST. Its table's
 *  FIRST COLUMN names each quantity and, where the digest measured a figure
 *  for it, prints that figure. Scraping the whole section instead would sweep
 *  section numbers, lesson ids and worked answers into the constant list, so
 *  this reads the first column of the audit table alone and says so. */
function auditConstants(digestLines) {
  const marks = [];
  digestLines.forEach((l, i) => {
    const m = /^# SECTION (\d+):/.exec(l);
    if (m) marks.push({ n: Number(m[1]), i });
  });
  const audit = marks.find((s) => /AUDIT|what is typed|never checked/i.test(digestLines[s.i]));
  if (!audit) return { section: null, names: [], rows: 0 };
  const next = marks.find((s) => s.i > audit.i);
  const body = digestLines.slice(audit.i, next ? next.i : digestLines.length);
  const rows = body.filter((l) => /^\|/.test(l) && !/^\|\s*---/.test(l));
  const firsts = rows
    .map((l) => l.replace(/^\|/, '').split('|')[0].trim())
    .filter((c) => c && !/^quantity$/i.test(c));
  const names = [];
  for (const cell of firsts) {
    for (const m of cell.matchAll(/\d+(?:\.\d+)?/g)) {
      const v = Number(m[0]);
      // a bare 1 or 2 inside prose ("both orientations", "0 < K <= 1") is not
      // a constant this block declares, and the audit never states one alone
      if (v > 2) names.push({ raw: m[0], v, cell });
    }
  }
  return { section: audit.n, names, rows: firsts.length };
}

function structureCounts(waveDir) {
  const py = `import importlib.util, json
spec = importlib.util.spec_from_file_location('s', r'${path.join(waveDir, 'structure.py')}')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
tiers = {t: {'modules': len(mods), 'lessons': sum(len(x[2]) for x in mods)} for t, mods in m.TIERS.items()}
panels = sorted({p for mods in m.TIERS.values() for x in mods for l in x[2] for p in l[3]})
print(json.dumps({'tiers': tiers, 'panels': panels, 'held': len(getattr(m, 'HELD', []))}))`;
  return JSON.parse(execFileSync('python3', ['-c', py], { encoding: 'utf8' }));
}

// ----------------------------------------------------------------- the audit
export function audit(waveDir, opts = {}) {
  const live = opts.live !== false;
  const bad = [];
  const unchecked = [];
  const examined = [];
  let checked = 0;

  const ck = (name, ok, detail) => {
    checked += 1;
    examined.push(`${ok ? 'ok    ' : 'STALE '} ${name}${detail ? `: ${detail}` : ''}`);
    if (!ok) bad.push(`${name}: ${detail}`);
  };
  const skip = (name, why) => {
    unchecked.push(`${name} (${why})`);
    examined.push(`UNCHECKED ${name}: ${why}`);
  };

  const wavePath = path.join(waveDir, 'wave.json');
  if (!fs.existsSync(wavePath)) {
    return { refused: `no wave.json in ${waveDir}, so there is no claim to check`, examined, bad, unchecked, checked };
  }
  let w;
  try {
    w = JSON.parse(fs.readFileSync(wavePath, 'utf8'));
  } catch (e) {
    return { refused: `${wavePath} is not parseable JSON (${e.message}), so nothing in it was checked`, examined, bad, unchecked, checked };
  }
  const digestPath = path.join(waveDir, 'digest.txt');
  if (!fs.existsSync(digestPath)) {
    return { refused: `no digest.txt in ${waveDir}, so every claim wave.json makes about its digest is unchecked`, examined, bad, unchecked, checked };
  }
  const digestRaw = fs.readFileSync(digestPath, 'utf8');
  const D = digestRaw.replace(/\n$/, '').split('\n');
  const digestText = D.join('\n');

  // ---------------------------------------- A. the digest's own measurements
  const lines = D.length;
  const sections = D.filter((l) => /^# SECTION \d+:/.test(l)).length;
  const dg = w.digest || {};
  if (num(dg.lines) === null) skip('digest.lines', 'absent or not a number');
  else ck('digest.lines', dg.lines === lines, `wave.json says ${dg.lines}, digest.txt has ${lines}`);
  if (num(dg.sections) === null) skip('digest.sections', 'absent or not a number');
  else ck('digest.sections', dg.sections === sections, `wave.json says ${dg.sections}, digest.txt has ${sections}`);

  if (!isStr(dg.md5)) skip('digest.md5', 'absent or not a string');
  else {
    const asIs = md5(digestRaw);
    const noTrail = md5(digestRaw.replace(/\n$/, ''));
    ck('digest.md5', dg.md5 === asIs || dg.md5 === noTrail,
      `wave.json says ${dg.md5}, digest.txt is ${asIs} (${noTrail} without its trailing newline)`);
  }

  // the golden row and block counts, checked against the golden FILE and
  // against the sentence the digest prints about itself
  const goldenClaims = [];
  for (const g of Array.isArray(w.goldens) ? w.goldens : []) goldenClaims.push(g);
  let goldenFile = null;
  for (const g of goldenClaims) {
    const candidates = [
      path.join(waveDir, g),
      path.join(waveDir, 'goldens', path.basename(g)),
      path.join(String(w.repo || ''), 'packages/engines/test-data', g),
      path.join(String(w.repo || ''), 'packages/engines', g),
      g,
    ];
    const hit = candidates.find((c) => c && fs.existsSync(c));
    ck(`goldens path exists: ${g}`, Boolean(hit), hit ? `read at ${hit}` : `not found at any of ${candidates.length} roots`);
    if (hit && !goldenFile) {
      try { goldenFile = JSON.parse(fs.readFileSync(hit, 'utf8')); } catch { goldenFile = null; }
    }
  }
  if (goldenClaims.length === 0) skip('goldens', 'absent or empty');

  if (goldenFile && typeof goldenFile === 'object' && !Array.isArray(goldenFile)) {
    const blocks = Object.keys(goldenFile);
    const rows = blocks.reduce((a, k) => a + (Array.isArray(goldenFile[k]) ? goldenFile[k].length : 0), 0);
    if (num(dg.goldenRows) === null) skip('digest.goldenRows', 'absent or not a number');
    else ck('digest.goldenRows', dg.goldenRows === rows, `wave.json says ${dg.goldenRows}, the golden file carries ${rows}`);
    if (num(dg.goldenBlocks) === null) skip('digest.goldenBlocks', 'absent or not a number');
    else ck('digest.goldenBlocks', dg.goldenBlocks === blocks.length, `wave.json says ${dg.goldenBlocks}, the golden file carries ${blocks.length}`);
    const stated = /published set carries (\d+) rows across (\d+) blocks/.exec(digestText);
    if (stated) {
      ck('the digest own row and block sentence', Number(stated[1]) === rows && Number(stated[2]) === blocks.length,
        `the digest says ${stated[1]} rows across ${stated[2]} blocks, the golden file carries ${rows} across ${blocks.length}`);
    } else skip('the digest own row and block sentence', 'the digest no longer prints one');
  } else {
    skip('digest.goldenRows and digest.goldenBlocks', 'the golden file was not readable as a block map');
  }

  // ---------------------------------------------- B. wave.json against itself
  // THE SAME FIGURES APPEAR INSIDE THE GATES PROSE. A file that states a
  // figure twice must state it the same way both times, which is the exact
  // defect this gate was built for.
  const prose = JSON.stringify(w.gates || {}) + JSON.stringify(dg.note || '');
  const restatedLines = [...prose.matchAll(/(\d[\d,]*)\s+lines/g)].map((m) => Number(m[1].replace(/,/g, '')));
  restatedLines.forEach((n, i) => ck(`gates prose line count ${i + 1}`, n === lines, `says ${n}, digest.txt has ${lines}`));
  const restatedSecs = [...prose.matchAll(/(\d+)\s+sections?(?:\s+titles?)?\b/g)].map((m) => Number(m[1]));
  restatedSecs.forEach((n, i) => ck(`gates prose section count ${i + 1}`, n === sections, `says ${n}, digest.txt has ${sections}`));
  if (restatedLines.length === 0 && restatedSecs.length === 0) {
    skip('gates prose restatements', 'the gates block restates neither the line count nor the section count');
  }

  // the kit files wave.json pins by md5
  const kitClaims = [...prose.matchAll(/([A-Za-z_][\w.]*\.(?:py|mjs))\s+md5\s+([0-9a-f]{32})|([A-Za-z_][\w.]*\.(?:py|mjs))\s+([0-9a-f]{32})/g)]
    .map((m) => ({ file: m[1] || m[3], hash: m[2] || m[4] }));
  for (const c of kitClaims) {
    const p = path.join(KIT, c.file);
    if (!fs.existsSync(p)) { skip(`kit md5 ${c.file}`, `no ${p} on disk`); continue; }
    const actual = md5(fs.readFileSync(p));
    ck(`kit md5 ${c.file}`, actual === c.hash, `wave.json says ${c.hash}, ${p} is ${actual}`);
  }
  if (kitClaims.length === 0) skip('kit md5 claims', 'the gates block pins no kit file by md5');

  // ------------------------------------------------- C. the paths it declares
  const engineClaims = Array.isArray(w.engines) ? w.engines : [];
  for (const e of engineClaims) {
    const candidates = [
      path.join(String(w.repo || ''), 'packages/engines', e),
      path.join(waveDir, e),
      path.join(waveDir, path.basename(e)),
      e,
    ];
    const hit = candidates.find((c) => c && fs.existsSync(c));
    ck(`engine path exists: ${e}`, Boolean(hit), hit ? `read at ${hit}` : `not found at any of ${candidates.length} roots`);
  }
  if (engineClaims.length === 0) skip('engines', 'absent or empty');

  if (!isStr(w.repo)) skip('repo', 'absent or not a string');
  else {
    ck('repo exists on disk', fs.existsSync(w.repo), `${w.repo}`);
    if (isStr(w.branch) && fs.existsSync(path.join(w.repo, '.git'))) {
      let head = '';
      try {
        head = execFileSync('git', ['-C', w.repo, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
      } catch { head = ''; }
      if (head) ck('branch is the checked out branch', head === w.branch, `wave.json says ${w.branch}, ${w.repo} is on ${head}`);
      else skip('branch', 'git could not name the checked out branch');
    } else skip('branch', 'absent, or the repo carries no .git to read it from');
  }

  // ------------------------------------------- D. identity, presence and type
  const identity = [
    ['slug', (v) => isStr(v) && /^[a-z0-9-]+$/.test(v), 'a lowercase slug string'],
    ['prefix', (v) => isStr(v) && /^[a-z]{1,4}\d{1,2}$/.test(v), 'a short course prefix like fc5'],
    ['name', (v) => isStr(v), 'a non-empty display name'],
    ['pathOrder', (v) => num(v) !== null && Number.isInteger(v) && v > 0, 'a positive whole number'],
    ['module', (v) => isStr(v), 'a non-empty module name'],
  ];
  for (const [key, ok, want] of identity) {
    if (!(key in w)) { skip(key, `absent, and it must be ${want}`); continue; }
    ck(`${key} is ${want}`, ok(w[key]), `wave.json carries ${JSON.stringify(w[key])}`);
  }
  // prerequisite is the one key whose CORRECT value may be null, so absence
  // and null are different things and only absence is unchecked
  if (!('prerequisite' in w)) skip('prerequisite', 'absent. A course with no prerequisite states null rather than omitting it');
  else ck('prerequisite is null or a slug', w.prerequisite === null || isStr(w.prerequisite), `wave.json carries ${JSON.stringify(w.prerequisite)}`);

  const plan = w.plan || {};
  if (!isStr(plan.route)) skip('plan.route', 'absent or not a string');
  else if (!isStr(w.slug)) skip('plan.route against the slug', 'there is no slug to check it against');
  else ck('plan.route matches the slug', plan.route === `/dashboard/apps/${w.slug}`, `${plan.route} against the slug ${w.slug}`);

  if (!Array.isArray(w.leakScales)) skip('leakScales', 'absent or not an array');
  else ck('leakScales is a non-empty array of scales', w.leakScales.length > 0 && w.leakScales.every((s) => isStr(s) || num(s) !== null),
    `${w.leakScales.length} entries: ${JSON.stringify(w.leakScales)}`);

  // ------------------------------------------ E. the constants block coverage
  const A = auditConstants(D);
  if (!w.constants || typeof w.constants !== 'object') {
    skip('constants', 'absent or not an object');
  } else if (A.names.length === 0) {
    skip('constants against the audit section', 'the digest carries no audit table for them to be checked against');
  } else {
    const blob = Object.entries(w.constants).map(([k, v]) => `${k} :: ${v}`).join('\n');
    const pool = [...blob.matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
    for (const word of Object.keys(NUMERALS)) {
      if (new RegExp(`\\b${word}\\b`, 'i').test(blob)) pool.push(NUMERALS[word]);
    }
    for (const k of Object.keys(w.constants)) pool.push(...symbolicValues(k));
    // COVERAGE IS A VALUE TEST, NOT A STRING TEST. The digest prints
    // 1500.000000000007 because it BISECTED the threshold out of the engine,
    // and wave.json declares 1500. Those are the same constant.
    const covers = (x) => pool.some((y) => y === x || (x !== 0 && Math.abs(y - x) / Math.abs(x) < 1e-5));
    const missed = [];
    const seen = new Set();
    for (const n of A.names) {
      if (seen.has(n.raw)) continue;
      seen.add(n.raw);
      if (!covers(n.v)) missed.push(`${n.raw} (from "${n.cell.slice(0, 70)}")`);
    }
    ck(`constants cover the ${seen.size} figures SECTION ${A.section} names over ${A.rows} audit rows`,
      missed.length === 0, missed.length ? `not declared in the constants block: ${missed.join('; ')}` : `all ${seen.size} declared`);
    checked += seen.size - 1;
  }

  // the vendoring claim, against the line the digest prints about its build
  if (!isStr(w.enginesVendoredAt)) skip('enginesVendoredAt', 'absent or not a string');
  else {
    const builtAgainst = /Built against engines ([0-9a-f]{7,40})/.exec(digestText);
    const shaClaim = /\b([0-9a-f]{7,40})\b/.exec(w.enginesVendoredAt);
    if (!builtAgainst) skip('enginesVendoredAt sha', 'the digest no longer prints the engines sha it was built against');
    else if (!shaClaim) skip('enginesVendoredAt sha', 'wave.json names no sha in that string');
    else ck('enginesVendoredAt names the sha the digest was built against',
      builtAgainst[1].startsWith(shaClaim[1]) || shaClaim[1].startsWith(builtAgainst[1]),
      `wave.json says ${shaClaim[1]}, the digest says ${builtAgainst[1]}`);

    const closure = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b\s+paths/i.exec(w.enginesVendoredAt);
    const digestClosure = /closure of\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+paths/i.exec(digestText);
    if (closure && digestClosure) {
      ck('the vendoring closure size agrees with the digest',
        NUMERALS[closure[1].toLowerCase()] === NUMERALS[digestClosure[1].toLowerCase()],
        `wave.json says ${closure[1]} paths, the digest says ${digestClosure[1]}`);
    } else skip('the vendoring closure size', 'one of the two files no longer spells it out');
  }

  // --------------------------------------------------- F. the graded fields
  const fieldsPath = path.join(waveDir, 'fields.json');
  if (!fs.existsSync(fieldsPath)) {
    skip('the graded field claims', `no fields.json in ${waveDir}`);
  } else {
    const rows = JSON.parse(fs.readFileSync(fieldsPath, 'utf8'));
    const keys = rows.map((r) => r[1]);
    const perTier = {};
    for (const r of rows) perTier[r[0]] = (perTier[r[0]] || 0) + 1;
    const f = w.fields || {};
    if (num(f.count) === null) skip('fields.count', 'absent or not a number');
    else ck('fields.count', f.count === rows.length, `wave.json says ${f.count}, fields.json has ${rows.length}`);
    if (!f.perTier || typeof f.perTier !== 'object') skip('fields.perTier', 'absent or not an object');
    else {
      ck('fields.perTier', JSON.stringify(f.perTier) === JSON.stringify(perTier),
        `wave.json says ${JSON.stringify(f.perTier)}, fields.json has ${JSON.stringify(perTier)}`);
    }
    if (!Array.isArray(f.keys)) skip('fields.keys', 'absent or not an array');
    else {
      const same = f.keys.length === keys.length && f.keys.every((k, i) => k === keys[i]);
      const onlyWave = f.keys.filter((k) => !keys.includes(k));
      const onlyFile = keys.filter((k) => !f.keys.includes(k));
      ck('fields.keys are the fields.json keys in order', same,
        `${f.keys.length} claimed against ${keys.length} in fields.json`
        + `${onlyWave.length ? `, only in wave.json: ${onlyWave.join(', ')}` : ''}`
        + `${onlyFile.length ? `, only in fields.json: ${onlyFile.join(', ')}` : ''}`);
    }
    const cap = plan.capstones || {};
    if (num(cap.count) === null || num(cap.gradedFieldsEach) === null) {
      skip('plan.capstones.count times gradedFieldsEach', 'one of the two is absent or not a number');
    } else {
      ck('plan.capstones.count times gradedFieldsEach', cap.count * cap.gradedFieldsEach === rows.length,
        `wave.json implies ${cap.count * cap.gradedFieldsEach}, fields.json has ${rows.length}`);
    }
  }

  // ------------------------------------------- G. the lessons and the modules
  const structPath = path.join(waveDir, 'structure.py');
  if (!fs.existsSync(structPath)) {
    skip('the lesson and module claims', `no structure.py in ${waveDir}`);
  } else {
    let s = null;
    try { s = structureCounts(waveDir); } catch (e) { s = null; }
    if (!s) skip('the lesson and module claims', 'structure.py did not yield its TIERS map');
    else {
      const tiers = Object.keys(s.tiers);
      const lessons = tiers.reduce((a, t) => a + s.tiers[t].lessons, 0);
      const perTier = [...new Set(tiers.map((t) => s.tiers[t].lessons))];
      const mods = [...new Set(tiers.map((t) => s.tiers[t].modules))];
      if (num(plan.lessonsPerTier) === null) skip('plan.lessonsPerTier', 'absent or not a number');
      else {
        ck('plan.lessonsPerTier', perTier.length === 1 && perTier[0] === plan.lessonsPerTier,
          `wave.json says ${plan.lessonsPerTier}, structure.py has ${JSON.stringify(s.tiers)}`);
      }
      if (num(plan.modulesPerTier) === null) skip('plan.modulesPerTier', 'absent or not a number');
      else {
        ck('plan.modulesPerTier', mods.length === 1 && mods[0] === plan.modulesPerTier,
          `wave.json says ${plan.modulesPerTier}, structure.py has ${mods.join(' and ')}`);
      }
      if (num(plan.lessonsInWave) === null) {
        // FC4 had no such key and the gate inferred the total from the tier
        // count, so the absence is reported and the inference still runs
        skip('plan.lessonsInWave', 'absent, so the wave total is only inferred from lessonsPerTier');
        if (num(plan.lessonsPerTier) !== null) {
          ck('plan.lessonsPerTier times the tier count', plan.lessonsPerTier * tiers.length === lessons,
            `wave.json implies ${plan.lessonsPerTier * tiers.length}, structure.py has ${lessons}`);
        }
      } else {
        ck('plan.lessonsInWave', plan.lessonsInWave === lessons, `wave.json says ${plan.lessonsInWave}, structure.py has ${lessons}`);
      }
      const ids = (plan.panels && Array.isArray(plan.panels.ids)) ? plan.panels.ids : null;
      if (!ids) skip('plan.panels.ids', 'absent or not an array');
      else {
        const missing = s.panels.filter((p) => !ids.some((row) => String(row).includes(p)));
        const invented = ids
          .map((row) => (/^([a-z0-9-]+)/.exec(String(row).trim()) || [])[1])
          .filter((p) => p && !s.panels.includes(p));
        ck('plan.panels.ids are the panel ids structure.py uses', missing.length === 0 && invented.length === 0,
          `structure.py uses ${s.panels.join(', ')}`
          + `${missing.length ? `; never named in wave.json: ${missing.join(', ')}` : ''}`
          + `${invented.length ? `; named in wave.json and unused: ${invented.join(', ')}` : ''}`);
      }
    }
  }

  // ------------------------------- H. the counts the prose gate itself prints
  if (!live) {
    skip('the prose gate counts wave.json quotes', 'this run was asked not to start subprocesses');
  } else {
    let out = '';
    try {
      out = execFileSync('node', [path.join(KIT, 'digestprose.mjs'), digestPath, '--rules', waveDir],
        { encoding: 'utf8', env: { ...process.env, FC5_WAVE: waveDir } });
    } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }
    const warned = /(\d+) warned for a human read/.exec(out);
    const pins = /(\d+) engine pin\(s\)/.exec(out);
    const quotedWarn = /(\d+) warned/.exec(prose);
    const quotedPins = /(\d+) (?:ENGINE FRAGMENTS PINNED|engine fragments pinned|engine pins)/i.exec(prose);
    if (warned && quotedWarn) ck('gates prose warning count', Number(quotedWarn[1]) === Number(warned[1]), `wave.json says ${quotedWarn[1]}, the prose gate reports ${warned[1]}`);
    else skip('gates prose warning count', warned ? 'wave.json quotes none' : 'the prose gate printed none');
    if (pins && quotedPins) ck('gates prose engine pin count', Number(quotedPins[1]) === Number(pins[1]), `wave.json says ${quotedPins[1]}, the prose gate reports ${pins[1]}`);
    else skip('gates prose engine pin count', pins ? 'wave.json quotes none' : 'the prose gate printed none');
  }

  return { refused: null, examined, bad, unchecked, checked };
}

// ------------------------------------------------------------------ selftest
//
// THE NEGATIVE CONTROL. A gate nobody has seen fail is a gate nobody has
// tested. Each plant below is made in a TEMPORARY COPY of the wave, never in
// the wave itself, and the control asserts the gate NAMES the defect rather
// than merely going red.
function selftest(waveDir) {
  const must = (c, m) => { if (!c) throw new Error(m); };
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fc5-wavejson-'));
  const copy = (name) => {
    const src = path.join(waveDir, name);
    if (!fs.existsSync(src)) return false;
    const dst = path.join(tmp, name);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.cpSync(src, dst, { recursive: true });
    return true;
  };
  for (const f of ['wave.json', 'digest.txt', 'fields.json', 'structure.py', 'goldens']) {
    must(copy(f), `the selftest needs ${f} in ${waveDir} to plant anything in a copy of it`);
  }
  const wavePath = path.join(tmp, 'wave.json');
  const original = JSON.parse(fs.readFileSync(wavePath, 'utf8'));
  const write = (o) => fs.writeFileSync(wavePath, JSON.stringify(o, null, 1));
  const named = (frag, res) => res.bad.some((b) => b.includes(frag));

  const base = audit(tmp, { live: false });
  must(!base.refused, `the unplanted copy refused: ${base.refused}`);
  console.log(`   baseline on a copy of the wave: ${base.checked} claims checked, `
    + `${base.bad.length} stale, ${base.unchecked.length} unchecked`);

  // 1. the founding defect: a line count that outlived its digest
  let w = JSON.parse(JSON.stringify(original));
  w.digest.lines += 1;
  write(w);
  let r = audit(tmp, { live: false });
  must(named('digest.lines', r), 'a wrong digest line count was NOT reported');
  console.log(`   control FIRED on digest.lines: ${r.bad.find((b) => b.includes('digest.lines'))}`);

  // 2. a section count that disagrees with the file
  w = JSON.parse(JSON.stringify(original));
  w.digest.sections = 7;
  write(w);
  r = audit(tmp, { live: false });
  must(named('digest.sections', r), 'a wrong section count was NOT reported');
  console.log(`   control FIRED on digest.sections: ${r.bad.find((b) => b.includes('digest.sections'))}`);

  // 3. a golden path that does not exist
  w = JSON.parse(JSON.stringify(original));
  w.goldens = ['facilities/goldens/no_such_cases.json'];
  write(w);
  r = audit(tmp, { live: false });
  must(named('goldens path exists', r), 'a golden file that does not exist was NOT reported');
  console.log(`   control FIRED on a missing golden: ${r.bad.find((b) => b.includes('goldens path exists'))}`);

  // 4. an engine path that does not exist
  w = JSON.parse(JSON.stringify(original));
  w.engines = ['engines/facilities/notAnEngine.js'];
  write(w);
  r = audit(tmp, { live: false });
  must(named('engine path exists', r), 'an engine file that does not exist was NOT reported');
  console.log(`   control FIRED on a missing engine: ${r.bad.find((b) => b.includes('engine path exists'))}`);

  // 5. a graded field count that disagrees with fields.json
  w = JSON.parse(JSON.stringify(original));
  if (w.fields) w.fields.count = 99;
  if (w.plan && w.plan.capstones) w.plan.capstones.gradedFieldsEach = 5;
  write(w);
  r = audit(tmp, { live: false });
  must(named('fields.count', r) || named('gradedFieldsEach', r), 'a wrong graded field count was NOT reported');
  console.log(`   control FIRED on the graded field count: ${r.bad.find((b) => /fields.count|gradedFieldsEach/.test(b))}`);

  // 6. a lesson count that disagrees with structure.py
  w = JSON.parse(JSON.stringify(original));
  w.plan.lessonsPerTier = 25;
  write(w);
  r = audit(tmp, { live: false });
  must(named('plan.lessonsPerTier', r), 'a wrong lesson count was NOT reported');
  console.log(`   control FIRED on plan.lessonsPerTier: ${r.bad.find((b) => b.includes('plan.lessonsPerTier'))}`);

  // 7. a constant the audit section names and the constants block drops
  w = JSON.parse(JSON.stringify(original));
  const dropped = Object.keys(w.constants).find((k) => k === '21000') || Object.keys(w.constants)[1];
  delete w.constants[dropped];
  write(w);
  r = audit(tmp, { live: false });
  // THE CONTROL MUST NAME THE PLANT. This wave already carries one undeclared
  // audit figure, so asserting only that the coverage check went red proved
  // nothing: it was red before the plant. The assertion is on the DROPPED
  // FIGURE appearing in the report.
  const covRow = r.bad.find((b) => b.includes('constants cover')) || '';
  must(covRow.includes(dropped), `dropping the constant ${dropped} was NOT named: ${covRow.slice(0, 200)}`);
  const baseCov = base.bad.find((b) => b.includes('constants cover')) || '';
  must(!baseCov.includes(dropped), `${dropped} was already reported before the plant, so this control proves nothing`);
  console.log(`   control FIRED on a dropped constant (${dropped}), NAMED in: `
    + `${covRow.slice(covRow.indexOf(dropped) - 40, covRow.indexOf(dropped) + 60)}`);

  // 8. a route that no longer matches the slug
  w = JSON.parse(JSON.stringify(original));
  w.plan.route = '/dashboard/apps/somewhere-else';
  write(w);
  r = audit(tmp, { live: false });
  must(named('plan.route matches the slug', r), 'a route that contradicts the slug was NOT reported');
  console.log(`   control FIRED on plan.route: ${r.bad.find((b) => b.includes('plan.route'))}`);

  // 9. A MISSING KEY IS AN UNCHECKED CLAIM, AND THREE OF THEM IS A FAILURE
  w = JSON.parse(JSON.stringify(original));
  delete w.digest.md5;
  write(w);
  r = audit(tmp, { live: false });
  must(r.unchecked.some((u) => u.startsWith('digest.md5')), 'an absent digest.md5 was not reported as unchecked');
  must(!named('digest.md5', r), 'an absent key was reported as stale rather than as unchecked');
  console.log(`   control FIRED on an absent key: UNCHECKED ${r.unchecked.find((u) => u.startsWith('digest.md5'))}`);

  w = JSON.parse(JSON.stringify(original));
  delete w.digest.md5; delete w.digest.goldenRows; delete w.leakScales; delete w.prerequisite;
  write(w);
  r = audit(tmp, { live: false });
  must(r.unchecked.length > 2, `four keys were removed and only ${r.unchecked.length} came back unchecked`);
  console.log(`   control FIRED on too many unchecked claims: ${r.unchecked.length} unchecked, which fails`);

  // 10. TOO LITTLE TO HAVE CHECKED ANYTHING IS A REFUSAL, NEVER A PASS
  const bare = fs.mkdtempSync(path.join(os.tmpdir(), 'fc5-wavejson-bare-'));
  fs.writeFileSync(path.join(bare, 'wave.json'), JSON.stringify({ slug: 'relief' }));
  fs.writeFileSync(path.join(bare, 'digest.txt'), '# SECTION 1: nothing (owned by Associate m01)\n');
  const thin = audit(bare, { live: false });
  must(thin.checked < 10, `a wave.json with one key yielded ${thin.checked} checks, so the floor proves nothing`);
  console.log(`   control FIRED on the ten-claim floor: a one-key wave.json yields ${thin.checked} checks, below the floor`);

  const empty = audit(fs.mkdtempSync(path.join(os.tmpdir(), 'fc5-wavejson-empty-')), { live: false });
  must(empty.refused, 'a directory with no wave.json did not refuse');
  console.log(`   control FIRED on an absent wave.json: REFUSED ${empty.refused}`);

  write(original);
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.rmSync(bare, { recursive: true, force: true });
  console.log('[gate_wavejson] selftest OK: every plant was NAMED, an absent key is unchecked rather '
    + 'than passed, more than two unchecked claims fail, and a wave.json too thin to check refuses');
  return 0;
}

// ------------------------------------------------------------------ runtime
const argv = process.argv.slice(2);
for (const a of argv) {
  if (!['--selftest', '--no-live'].includes(a)) {
    console.log(`REFUSED: unknown option ${a}. Refusing rather than ignoring it.`);
    process.exit(2);
  }
}
const WAVE = process.env.FC5_WAVE || DEFAULT_WAVE;

if (argv.includes('--selftest')) {
  process.exit(selftest(WAVE));
}

const r = audit(WAVE, { live: !argv.includes('--no-live') });
console.log(`gate_wavejson: reading ${path.join(WAVE, 'wave.json')}`);
for (const line of r.examined) console.log(`   ${line}`);
if (r.refused) {
  console.log(`  GATE REFUSES: ${r.refused}`);
  process.exit(2);
}
console.log(`gate_wavejson: ${r.checked} claim(s) in wave.json checked against the files they `
  + `describe; ${r.bad.length} stale; ${r.unchecked.length} unchecked`);
for (const b of r.bad) console.log(`   STALE ${b}`);
for (const u of r.unchecked) console.log(`   UNCHECKED ${u}`);
if (r.checked < 10) {
  console.log('  GATE REFUSES: it examined too little to have checked anything. Ten checkable '
    + 'claims is the floor, and a gate below it that exits 0 is the defect this file exists to catch');
  process.exit(2);
}
if (r.unchecked.length > 2) {
  console.log(`  GATE REFUSES: ${r.unchecked.length} claims could not be checked at all. Two is the `
    + 'most this gate will carry, because a wave.json missing the blocks the gate reads has not '
    + 'been checked by it');
  process.exit(2);
}
process.exit(r.bad.length ? 1 : 0);
