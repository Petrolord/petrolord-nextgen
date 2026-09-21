// GATE: nothing the H5 capstone grades, no distinctive input it is set on and
// no facility it names reaches the digest, the digest generator, the teaching
// streams, the vendored golden, a sibling wave's answer key, any live course's
// answer key, the NextGen teaching lab and panels, the banks or the lessons.
//
// This is the golden/digest COLLISION SWEEP and the capstone LEAK sweep in one
// gate, adapted from H3's gate_capstone_leak.mjs (H1's, FC9's) with the lessons
// direction from the start, and a NEW DIRECTION 11 for the cross-course seam.
//
// WHAT A "DISTINCTIVE INPUT" IS HERE. A QRA capstone is set on frequencies,
// probabilities of death, hours, fatality counts, costs and rates, and some of
// them are PUBLISHED values every QRA uses (the two HSE VPFs, the checklist's
// discount limits, R2P2's rates, one year in hours). Those are GENERIC and are
// declared below with the reason; matching them would be noise. Every other
// numeric input is DISTINCTIVE: a number with two or more significant
// figures, or a whole number of 1000 or more. A distinctive input is a
// fingerprint of the capstone, and it may appear in none of the swept files.
//
// DIRECTIONS, every one counted and printed:
//   1. INPUTS. Every distinctive capstone input must be absent from digest.txt,
//      h5_dump.mjs and h5_fields.mjs (as its JS spelling, its exponent
//      spelling, and its plain decimal spelling), and no distinctive input may
//      equal a number anywhere in the vendored golden. And THE ROW RULE: no
//      capstone subsystem or LOPA row may share its whole input record with a
//      golden case.
//   2. VALUES, AS TEXT. Every graded value at four renderings (full double,
//      twelve and nine significant digits, the decimals the course prints its
//      class to) must be absent from digest.txt.
//   3. VALUES, AS NUMBERS. No numeric literal in digest.txt may sit within TEN
//      tolerances of a graded value, in any of five unit shiftings (x1, x1e3,
//      x1e-3, x1e2, x1e-2). The grader's tolerance is ABSOLUTE:
//      public.academy_submit_capstone grades abs(got - expected) <= tol.
//   4. NAMES. No capstone facility name (UKPOKITI, OGINI, EBUGHU) anywhere in the
//      digest, the generator or the teaching streams.
//   5. NEITHER FILE READS THE OTHER. The digest side never names
//      h5_capstone.mjs or fields.json; the capstone never names h5_dump.mjs,
//      h5_fields.mjs or digest.txt.
//   6. THE GOLDEN. No graded value within ten tolerances of any golden number.
//   7. SIBLINGS AND LIVE COURSES. No graded value within the LOOSER of its own
//      and the other field's tolerance of: any committed sibling answer key
//      (tools/course-waves/*/fields.json), the H4 consequence answer key from
//      its live wave directory (unmerged when this wave was cut), and
//      EVERY LIVE COURSE's answer key harvested from the capstone field
//      objects in the repository's migrations/*.sql, the last definition of a
//      key winning. Six significant digits printing alike is also a finding.
//   8. THE APP. The lab, the three panels, their shared bits and the learning
//      page carry no graded value at four renderings, no capstone name and no
//      distinctive capstone input.
//   9. THE BANKS. Every prompt, option and explanation under --banks (default
//      <wave>/banks). A missing banks directory is a REFUSAL unless the run
//      declares --no-banks, which the foundation phase does because no bank
//      exists yet.
//  10. THE LESSONS. Every .md file under --lessons (default
//      <repo>/src/content/courses/qra, recursive), front matter included: no
//      capstone facility name; no distinctive capstone input at any of its
//      spellings, unless the digest itself prints that number (then it is
//      quotable as a digest figure, and the run names every input it excused
//      that way); no graded value at the four renderings; and no numeric
//      literal within TEN tolerances of a graded value in any of the five unit
//      shiftings. A missing lessons directory, or one with no .md file in it,
//      is a REFUSAL unless the run declares --no-lessons.
//  11. THE SEAM, REVERSED: ANOTHER COURSE'S GRADED ANSWERS IN THIS COURSE'S
//      TEXT. This course must not grade, and so must not TEACH TO, the graded
//      answers of the courses that own its seams: H4 consequence (live wave),
//      H3 lopa, the risk and change and compliance courses, the facilities
//      courses whose radiation and setbacks sit beside a QRA (separation FC1,
//      relief FC5), H1 safety statistics (the FAR base) and the economics
//      courses (EC2 to EC6). Every graded value of every one of them, at the
//      four renderings, must be absent from the digest, the teaching streams,
//      the app sources, the banks and the lessons. --plant-seam plants one H4
//      graded answer in the digest text in memory and must exit 1.
//
//   node gate_capstone_leak.mjs [--no-banks] [--banks DIR] [--no-lessons] [--lessons DIR]
//   node gate_capstone_leak.mjs --no-banks --no-lessons --plant-value | --plant-input | --plant-name
//      THE NEGATIVE CONTROLS: each plants one leak in the digest text in memory
//      and must exit 1 naming the direction that caught it.
//   node gate_capstone_leak.mjs --no-banks --plant-lesson
//      THE LESSONS CONTROL: appends, in memory, to the first lesson file read,
//      a literal three tolerances off a graded value (a near miss, so no
//      rendering matches and only the numeric comparison can catch it) and
//      must exit 1 with a [10 lessons] numeric finding naming that file. WHEN
//      NO LESSON EXISTS YET (the foundation phase) the control sweeps ONE
//      SYNTHETIC lesson, held in memory and named PLANTED-SYNTHETIC.md, so the
//      direction is proved to fire before the first lesson is written. The run
//      says which it did.
//
// Exit 0 clean, 1 a leak, 2 could not run.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.H5_WAVE_DIR || '/root/hse-wip-qra';
const REPO = process.env.H5_REPO || '/root/wt-h5-nextgen';
const ENG = process.env.H5_ENGINES || path.join(REPO, 'packages/engines');
const WAVES = process.env.H5_WAVES || path.join(REPO, 'tools/course-waves');
const MIGRATIONS = process.env.H5_MIGRATIONS || path.join(REPO, 'migrations');
const LIVE_SIBLINGS = (process.env.H5_LIVE_SIBLINGS
  || 'consequence=/root/hse-wip-consequence/fields.json')
  .split(',').filter(Boolean).map((s) => s.split('='));
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i === -1 ? null : args[i + 1]; };

const die = (m) => { console.log(`gate_capstone_leak REFUSES: ${m}`); process.exit(2); };
const read = (p) => { if (!fs.existsSync(p)) die(`missing ${p}`); return fs.readFileSync(p, 'utf8'); };

let DIGEST = read(path.join(HERE, 'digest.txt'));
const DUMP = read(path.join(HERE, 'h5_dump.mjs'));
const STREAMS = read(path.join(HERE, 'h5_fields.mjs'));
const CAPSTONE = read(path.join(HERE, 'h5_capstone.mjs'));
const FIELDS = JSON.parse(read(path.join(HERE, 'fields.json')));
if (FIELDS.length !== 18) die(`fields.json carries ${FIELDS.length} fields`);
const PRECISION = JSON.parse(read(path.join(HERE, 'precision.json')));
const dpOf = (key) => {
  const cls = Object.entries(PRECISION).find(([, s]) => new RegExp(s.match).test(key));
  if (!cls) die(`precision.json does not classify ${key}`);
  return cls[1].decimals;
};
const INPUTS = JSON.parse(execFileSync('node', [path.join(HERE, 'h5_capstone.mjs'), '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
const NAMES = Object.keys(INPUTS);
if (NAMES.join() !== 'UKPOKITI,OGINI,EBUGHU') die(`unexpected capstone scenarios ${NAMES.join()}`);

/* ------------------------------------------------ the generic input values */

// Values every LOPA uses. Each is declared with its reason; they are not
// fingerprints of this capstone. Anything else is distinctive.
const GENERIC = new Map([
  [8760, 'one year in hours, the H3 export HOURS_PER_YEAR'],
  [1336800, 'the CBA checklist VPF (2003 Q3), an engine export'],
  [1000000, 'the R2P2 VPF (2001), an engine export'],
  [0.015, 'the CBA checklist limit on the benefit discount rate'],
  [0.035, 'the CBA checklist limit on the cost discount rate'],
  [0.06, 'the R2P2 real discount rate'],
  [0.04, 'the R2P2 uprating of benefits'],
  [20500, 'the CBA checklist value of a serious injury'],
  [300, 'the CBA checklist value of a slight injury'],
]);
const sigFigs = (v) => {
  const s = Math.abs(v).toExponential().split('e')[0].replace('.', '').replace(/^0+/, '').replace(/0+$/, '');
  return s.length;
};
const isDistinctive = (v) => {
  if (typeof v !== 'number' || !Number.isFinite(v) || v === 0) return false;
  if (GENERIC.has(v)) return false;
  if (Number.isInteger(v)) return v >= 1000;
  return sigFigs(v) >= 2;
};
const distinctive = [];
const walkIn = (node, at, name) => {
  if (typeof node === 'number') { if (isDistinctive(node)) distinctive.push({ name, at, v: node }); return; }
  if (Array.isArray(node)) { node.forEach((x, i) => walkIn(x, `${at}[${i}]`, name)); return; }
  if (node && typeof node === 'object') Object.entries(node).forEach(([k, x]) => walkIn(x, at ? `${at}.${k}` : k, name));
};
Object.entries(INPUTS).forEach(([name, o]) => walkIn(o, '', name));
const byValue = new Map();
distinctive.forEach((d) => { if (!byValue.has(d.v)) byValue.set(d.v, d); });
const DISTINCT = [...byValue.values()];
if (DISTINCT.length < 30) die(`only ${DISTINCT.length} distinctive capstone inputs parsed`);

/* ---- the negative controls, planted in memory ---- */
if (has('--plant-value')) DIGEST += `\n| planted | ${FIELDS[3][2].toFixed(dpOf(FIELDS[3][1]))} |\n`;
if (has('--plant-input')) DIGEST += `\nThe planted crew roster is ${INPUTS.OGINI.crewHoursPerPersonPerYr} hours a person.\n`;
if (has('--plant-name')) DIGEST += '\nA planted line naming Ebughu.\n';

const findings = [];
const counts = {};
const count = (k, n = 1) => { counts[k] = (counts[k] || 0) + n; };

const NUM = /(?<![\w.])-?\d+(?:\.\d+)?(?:e[-+]?\d+)?(?![\w])/gi;
const literals = (text) => [...text.matchAll(NUM)].map((m) => Number(m[0])).filter((x) => Number.isFinite(x));
/** Every spelling of an input a writer or a generator might produce. */
const spellings = (v) => {
  const out = new Set([String(v), v.toExponential()]);
  const plain = v.toFixed(Math.min(20, Math.max(0, -Math.floor(Math.log10(Math.abs(v))) + sigFigs(v) - 1)));
  out.add(plain);
  return [...out];
};
const hasSpelling = (text, s) => new RegExp(`(?<![\\d.])${s.replace(/[.+]/g, (c) => `\\${c}`)}(?![\\d])`, 'i').test(text);

// 1. INPUTS
[['digest.txt', DIGEST], ['h5_dump.mjs', DUMP], ['h5_fields.mjs', STREAMS]].forEach(([label, text]) => {
  DISTINCT.forEach(({ name, at, v }) => {
    count('1 inputs checked');
    const hit = spellings(v).find((s) => hasSpelling(text, s));
    if (hit) findings.push(`[1 inputs] ${label} carries ${name}.${at} = ${v} as ${hit}`);
  });
});
const GOLD = JSON.parse(read(path.join(ENG, 'test-data/hse/goldens/qra_cases.json')));
const goldNums = [];
const walk = (n) => {
  if (typeof n === 'number') goldNums.push(n);
  else if (Array.isArray(n)) n.forEach(walk);
  else if (n && typeof n === 'object') Object.values(n).forEach(walk);
};
walk(GOLD);
// The qra golden carries 1093 numbers at 16fd6c9; a floor of 900 refuses a truncated or wrong file.
if (goldNums.length < 900) die(`only ${goldNums.length} numbers walked out of the golden`);
DISTINCT.forEach(({ name, at, v }) => {
  count('1 inputs against the golden');
  if (goldNums.includes(v)) findings.push(`[1 inputs] the golden carries ${name}.${at} = ${v}`);
});
// THE ROW RULE: a whole capstone record (a tree root, a scenario, a measure)
// equal to a golden case's whole args would hand back a graded answer by lookup.
const records = [];
const collect = (node, at) => {
  if (Array.isArray(node)) { node.forEach((x, i) => collect(x, `${at}[${i}]`)); return; }
  if (node && typeof node === 'object') {
    if ('initiatingFrequencyPerYr' in node || 'deltaPllPerYr' in node || 'frequencyPerYr' in node) records.push({ at, rec: node });
    Object.entries(node).forEach(([k, x]) => collect(x, `${at}.${k}`));
  }
};
Object.entries(INPUTS).forEach(([name, o]) => collect(o, name));
const goldRecords = [];
const collectG = (node) => {
  if (Array.isArray(node)) node.forEach(collectG);
  else if (node && typeof node === 'object') {
    if ('initiatingFrequencyPerYr' in node || 'deltaPllPerYr' in node || 'frequencyPerYr' in node) goldRecords.push(node);
    Object.values(node).forEach(collectG);
  }
};
collectG(GOLD);
if (records.length < 12 || goldRecords.length < 40) die(`the row rule has too little to compare: ${records.length} capstone and ${goldRecords.length} golden records`);
const scalarEq = (a, b) => {
  const ka = Object.keys(a).filter((k) => typeof a[k] !== 'object');
  const kb = Object.keys(b).filter((k) => typeof b[k] !== 'object');
  return ka.length === kb.length && ka.every((k) => a[k] === b[k]);
};
records.forEach(({ at, rec }) => goldRecords.forEach((g) => {
  count('1 row rule pairs');
  if (scalarEq(rec, g)) findings.push(`[1 inputs] the capstone record ${at} is a whole golden record`);
}));

// 2. VALUES AS TEXT
const trim = (s) => (s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s);
const renderings = (key, v) => [...new Set([String(v), trim(v.toPrecision(12)), trim(v.toPrecision(9)), v.toFixed(dpOf(key))])]
  .filter((s) => s.includes('.') && !s.includes('e') && s.length >= 6);
FIELDS.forEach(([, key, v]) => renderings(key, v).forEach((s) => {
  count('2 renderings searched');
  if (DIGEST.includes(s)) findings.push(`[2 values] digest.txt carries ${key} as ${s}`);
}));

// 3. VALUES AS NUMBERS, five shiftings, ten tolerances
const digestLits = literals(DIGEST.split('\n').filter((l) => !l.startsWith('#')).join('\n'));
if (digestLits.length < 800) die(`only ${digestLits.length} literals in the digest; an empty or half-written digest clears everything`);
const SCALES = [1, 1e3, 1e-3, 1e2, 1e-2];
FIELDS.forEach(([, key, v, tol]) => {
  SCALES.forEach((sc) => {
    const target = v * sc;
    const band = 10 * tol * sc;
    digestLits.forEach((x) => {
      count('3 literal comparisons');
      if (Math.abs(x - target) <= band) findings.push(`[3 values] digest literal ${x} is within ten tolerances of ${key} x${sc}`);
    });
  });
});

// 4. NAMES
const nameRe = /\b(ukpokiti|ogini|ebughu)\b/i;
[['digest.txt', DIGEST], ['h5_dump.mjs', DUMP], ['h5_fields.mjs', STREAMS]].forEach(([label, text]) => {
  count('4 files searched for names');
  const m = text.match(nameRe);
  if (m) findings.push(`[4 names] ${label} names the capstone facility ${m[0]}`);
});

// 5. NEITHER FILE READS THE OTHER
[['h5_dump.mjs', DUMP, /h5_capstone|fields\.json/], ['h5_fields.mjs', STREAMS, /import[^\n]*h5_capstone|fields\.json/],
  ['h5_capstone.mjs', CAPSTONE, /h5_dump|h5_fields|digest\.txt/]].forEach(([label, text, re]) => {
  count('5 files checked');
  const code = text.split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  if (re.test(code)) findings.push(`[5 separation] ${label} reads the other side (${re})`);
});

// 6. THE GOLDEN
FIELDS.forEach(([, key, v, tol]) => goldNums.forEach((x) => {
  count('6 golden comparisons');
  if (Math.abs(x - v) <= 10 * tol) findings.push(`[6 golden] golden number ${x} is within ten tolerances of ${key}`);
}));

// 7. SIBLINGS AND EVERY LIVE COURSE
const others = [];
let committed = 0;
if (fs.existsSync(WAVES)) {
  fs.readdirSync(WAVES).filter((w) => w !== 'qra').forEach((w) => {
    const f = path.join(WAVES, w, 'fields.json');
    if (!fs.existsSync(f)) return;
    committed += 1;
    JSON.parse(fs.readFileSync(f, 'utf8')).forEach(([, sk, sv, st]) => others.push({ at: `${w}/${sk}`, v: sv, tol: st }));
  });
}
if (committed < 10) die(`only ${committed} committed sibling answer keys found under ${WAVES}`);
let live = 0;
LIVE_SIBLINGS.forEach(([w, f]) => {
  if (!fs.existsSync(f)) die(`the live sibling answer key ${w} at ${f} is missing; set H5_LIVE_SIBLINGS to name it or drop it`);
  JSON.parse(fs.readFileSync(f, 'utf8')).forEach(([, sk, sv, st]) => { others.push({ at: `${w}(live)/${sk}`, v: sv, tol: st }); live += 1; });
});
// Every live course's capstone fields, harvested from the migrations. The
// capstone field object is written two ways in this repository: a JSON object
// with "key", "expected" and "tol", and jsonb_build_object('key', ...,
// 'expected', ..., 'tol', ...). The last definition of a key wins, which is how
// a recut migration supersedes the course migration before it.
const harvested = new Map();
if (!fs.existsSync(MIGRATIONS)) die(`no migrations directory at ${MIGRATIONS}`);
// THIS COURSE'S OWN MIGRATIONS are the answer key itself, and are never a
// sibling: they are excluded BY NAME and the count excluded is printed.
const ownMig = fs.readdirSync(MIGRATIONS).filter((f) => /_h5_qra_/.test(f));
const migFiles = fs.readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql') && !/_h5_qra_/.test(f)).sort();
console.log(`  direction 7: ${ownMig.length} of this course's own migrations excluded by name from the live sweep`);
migFiles.forEach((f) => {
  const t = fs.readFileSync(path.join(MIGRATIONS, f), 'utf8');
  for (const m of t.matchAll(/\{[^{}]*"expected"[^{}]*\}/g)) {
    try {
      const o = JSON.parse(m[0]);
      if (typeof o.key === 'string' && typeof o.expected === 'number') harvested.set(o.key, { v: o.expected, tol: Number(o.tol) || 0, f });
    } catch { /* a fragment of SQL that only looks like JSON */ }
  }
  for (const m of t.matchAll(/jsonb_build_object\(([^;]*?)\)/g)) {
    const s = m[1];
    const k = /'key'\s*,\s*'([^']+)'/.exec(s);
    const e = /'expected'\s*,\s*(-?[\d.eE+-]+)/.exec(s);
    const tl = /'tol'\s*,\s*(-?[\d.eE+-]+)/.exec(s);
    if (k && e && Number.isFinite(Number(e[1]))) harvested.set(k[1], { v: Number(e[1]), tol: tl ? Number(tl[1]) : 0, f });
  }
});
if (harvested.size < 500) die(`only ${harvested.size} live capstone fields harvested from ${migFiles.length} migrations`);
harvested.forEach(({ v, tol, f }, k) => others.push({ at: `live:${f}/${k}`, v, tol }));
const sig6 = (x) => (Number.isFinite(x) ? x.toPrecision(6) : String(x));
FIELDS.forEach(([, key, v, tol]) => others.forEach((o) => {
  count('7 sibling and live comparisons');
  if (typeof o.v !== 'number') return;
  const band = Math.max(tol, o.tol || 0);
  if (Math.abs(o.v - v) <= band) findings.push(`[7 siblings] ${o.at} = ${o.v} sits within ${band} of ${key}`);
  else if (sig6(o.v) === sig6(v)) findings.push(`[7 siblings] ${o.at} = ${o.v} prints the same six significant digits as ${key}`);
}));
// and within the wave
FIELDS.forEach(([, ka, va, ta], i) => FIELDS.slice(i + 1).forEach(([, kb, vb, tb]) => {
  count('7 within-wave pairs');
  if (Math.abs(va - vb) <= Math.max(ta, tb)) findings.push(`[7 siblings] ${ka} and ${kb} sit within one tolerance`);
}));

// 8. THE APP
const PANEL_DIR = path.join(REPO, 'src/components/course/panels/qra');
const APP = ['qraLab.js', 'EventTreeExplorer.jsx', 'SocietalExplorer.jsx', 'AlarpExplorer.jsx', 'panelBits.jsx']
  .map((f) => path.join(PANEL_DIR, f))
  .concat([path.join(REPO, 'src/pages/apps/QraLearningPage.jsx')]);
const inputHits = (text) => DISTINCT.filter(({ v }) => spellings(v).some((s) => hasSpelling(text, s)));
if (has('--no-app')) {
  console.log('  direction 8: --no-app DECLARED. This run says NOTHING about the lab, the panels or the page.');
} else {
  APP.forEach((p) => {
    const text = read(p);
    count('8 app sources');
    const m = text.match(nameRe);
    if (m) findings.push(`[8 app] ${path.basename(p)} names ${m[0]}`);
    FIELDS.forEach(([, key, v]) => renderings(key, v).forEach((s) => { if (text.includes(s)) findings.push(`[8 app] ${path.basename(p)} carries ${key} as ${s}`); }));
    inputHits(text).forEach(({ name, at, v }) => findings.push(`[8 app] ${path.basename(p)} carries ${name}.${at} = ${v}`));
  });
}

// 9. THE BANKS
const banksDir = opt('--banks') || path.join(HERE, 'banks');
let bankTexts = 0;
if (has('--no-banks')) {
  console.log('  direction 9: --no-banks DECLARED. This run says NOTHING about any bank.');
} else if (!fs.existsSync(banksDir)) {
  die(`no banks directory at ${banksDir}; pass --no-banks to declare that this run does not sweep banks`);
} else {
  fs.readdirSync(banksDir).filter((f) => f.endsWith('.json')).forEach((f) => {
    const qs = JSON.parse(fs.readFileSync(path.join(banksDir, f), 'utf8'));
    (Array.isArray(qs) ? qs : qs.questions || []).forEach((q, i) => {
      [q.prompt, q.explanation, ...(q.options || [])].filter((t) => typeof t === 'string').forEach((t) => {
        bankTexts += 1;
        const m = t.match(nameRe);
        if (m) findings.push(`[9 banks] ${f}#${i} names ${m[0]}`);
        FIELDS.forEach(([, key, v]) => renderings(key, v).forEach((s) => { if (t.includes(s)) findings.push(`[9 banks] ${f}#${i} carries ${key} as ${s}`); }));
        inputHits(t).forEach(({ name, at }) => findings.push(`[9 banks] ${f}#${i} carries ${name}.${at}`));
      });
    });
  });
  if (bankTexts === 0) die(`the banks directory ${banksDir} holds no readable question text`);
}

// 10. THE LESSONS
const lessonsDir = opt('--lessons') || path.join(REPO, 'src/content/courses/qra');
const lessonFiles = [];
let lessonLits = 0;
let plantedIn = null;
let synthetic = false;
const excused = [];
const swept = [];
const PLANT_LESSON = has('--plant-lesson');
if (has('--no-lessons') && !PLANT_LESSON) {
  console.log('  direction 10: --no-lessons DECLARED. This run says NOTHING about any lesson.');
} else {
  const walkMd = (d) => fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkMd(p);
    else if (e.name.endsWith('.md')) lessonFiles.push(p);
  });
  if (fs.existsSync(lessonsDir)) walkMd(lessonsDir);
  if (lessonFiles.length === 0) {
    if (!PLANT_LESSON) die(`no lesson .md file under ${lessonsDir}; pass --no-lessons to declare that this run does not sweep lessons`);
    synthetic = true;
  }
  const digestText = DIGEST;
  DISTINCT.forEach((d) => ((spellings(d.v).some((s) => hasSpelling(digestText, s))) ? excused : swept).push(d));
  const PLANT_FIELD = FIELDS[1];
  const texts = synthetic
    ? [[path.join(lessonsDir, 'PLANTED-SYNTHETIC.md'), '# A synthetic lesson\n\nHeld in memory only, so the lessons direction is proved before a lesson exists.\n']]
    : lessonFiles.map((p) => [p, fs.readFileSync(p, 'utf8')]);
  texts.forEach(([p, raw], fi) => {
    let text = raw;
    const rel = path.relative(lessonsDir, p);
    if (fi === 0 && PLANT_LESSON) {
      text += `\nA planted near miss: ${(PLANT_FIELD[2] - 3 * PLANT_FIELD[3]).toFixed(8)}.\n`;
      plantedIn = rel;
    }
    // Thousands commas removed, so 105,120 is read as 105120.
    const plain = text.replace(/(\d),(?=\d{3}(?!\d))/g, '$1');
    count('10 lesson files');
    const m = plain.match(nameRe);
    if (m) findings.push(`[10 lessons] ${rel} names the capstone facility ${m[0]}`);
    swept.forEach(({ name, at, v }) => {
      count('10 lesson input checks');
      const hit = spellings(v).find((s) => hasSpelling(plain, s));
      if (hit) findings.push(`[10 lessons] ${rel} carries ${name}.${at} = ${v} as ${hit}, an input the digest never prints`);
    });
    FIELDS.forEach(([, key, v]) => renderings(key, v).forEach((s) => {
      count('10 lesson renderings searched');
      if (plain.includes(s)) findings.push(`[10 lessons] ${rel} carries ${key} as ${s}`);
    }));
    const lits = literals(plain);
    lessonLits += lits.length;
    FIELDS.forEach(([, key, v, tol]) => SCALES.forEach((sc) => {
      const target = v * sc;
      const band = 10 * tol * sc;
      lits.forEach((x) => {
        count('10 lesson literal comparisons');
        if (Math.abs(x - target) <= band) findings.push(`[10 lessons numeric] ${rel} literal ${x} is within ten tolerances of ${key} x${sc}`);
      });
    }));
  });
  console.log(`  direction 10: read ${texts.length} lesson file(s) under ${lessonsDir}${synthetic ? ' (ONE SYNTHETIC LESSON IN MEMORY: no lesson exists yet)' : ''}, ${lessonLits} numeric literals; `
    + `distinctive inputs swept ${swept.length}; excused because the digest prints them ${excused.map((c) => `${c.name}.${c.at}=${c.v}`).join(' ') || 'none'}`);
}

// 11. THE SEAM, REVERSED: another course's graded answers in this course's text
const SEAM_WAVES = ['lopa', 'riskchange', 'compliance', 'separation', 'relief', 'safetystats',
  'fiscal', 'uncertainty', 'decision', 'portfolio', 'fdp'];
const seamFields = [];
SEAM_WAVES.forEach((wv) => {
  const f = path.join(WAVES, wv, 'fields.json');
  if (!fs.existsSync(f)) die(`the seam wave ${wv} has no committed answer key at ${f}`);
  JSON.parse(fs.readFileSync(f, 'utf8')).forEach(([, k, v]) => seamFields.push({ at: `${wv}/${k}`, v }));
});
LIVE_SIBLINGS.forEach(([wv, f]) => JSON.parse(fs.readFileSync(f, 'utf8')).forEach(([, k, v]) => seamFields.push({ at: `${wv}(live)/${k}`, v })));
if (seamFields.length < 150) die(`only ${seamFields.length} seam answers read; the seam direction would check almost nothing`);
if (has('--plant-seam')) DIGEST += `\nA planted seam answer: ${seamFields.find((x) => x.at.startsWith('consequence')).v}.\n`;
const seamRenderings = seamFields.flatMap(({ at, v }) => (typeof v !== 'number' || !Number.isFinite(v) ? []
  : [...new Set([String(v), trim(v.toPrecision(12)), trim(v.toPrecision(9))])]
    .filter((x) => x.includes('.') && !x.includes('e') && x.length >= 7).map((x) => ({ at, x }))));
const seamTexts = [['digest.txt', DIGEST], ['h5_fields.mjs', STREAMS]];
if (!has('--no-app')) APP.forEach((p) => seamTexts.push([path.basename(p), read(p)]));
if (!has('--no-banks') && fs.existsSync(banksDir)) {
  fs.readdirSync(banksDir).filter((f) => f.endsWith('.json')).forEach((f) => seamTexts.push([`banks/${f}`, fs.readFileSync(path.join(banksDir, f), 'utf8')]));
}
lessonFiles.forEach((p) => seamTexts.push([path.relative(lessonsDir, p), fs.readFileSync(p, 'utf8')]));
seamTexts.forEach(([label, text]) => {
  count('11 seam texts');
  seamRenderings.forEach(({ at, x }) => {
    count('11 seam renderings searched');
    if (new RegExp(`(?<![\\d.])${x.replace(/[.+]/g, (ch) => `\\${ch}`)}(?!\\d)`).test(text)) findings.push(`[11 seam] ${label} carries ${at} as ${x}`);
  });
});
console.log(`  direction 11: ${seamFields.length} graded answers of ${SEAM_WAVES.length} committed seam waves and ${LIVE_SIBLINGS.length} live, ${seamRenderings.length} renderings, over ${seamTexts.length} H5 texts`);

console.log(`gate_capstone_leak: ${DISTINCT.length} distinctive capstone inputs (${GENERIC.size} generic values declared), ${records.length} capstone records, `
  + `${FIELDS.length} graded values, ${digestLits.length} digest literals, ${goldNums.length} golden numbers in ${goldRecords.length} golden records, `
  + `${committed} committed sibling answer keys, ${live} live sibling fields, ${harvested.size} live course fields from ${migFiles.length} migrations, `
  + `${has('--no-app') ? 0 : APP.length} app sources, ${bankTexts} bank texts, ${synthetic ? 0 : lessonFiles.length} lesson files`);
Object.entries(counts).sort().forEach(([k, n]) => console.log(`  direction ${k}: ${n}`));
console.log(`  FINDINGS: ${findings.length}`);
findings.slice(0, 40).forEach((f) => console.log(`   ${f}`));
const planted = ['--plant-value', '--plant-input', '--plant-name', '--plant-lesson', '--plant-seam'].filter(has);
if (planted.length) {
  const want = { '--plant-value': '[2 values]', '--plant-input': '[1 inputs]', '--plant-name': '[4 names]', '--plant-lesson': '[10 lessons numeric]', '--plant-seam': '[11 seam]' }[planted[0]];
  const caught = planted[0] === '--plant-lesson'
    ? plantedIn !== null && findings.some((f) => f.startsWith(`${want} ${plantedIn} `))
    : findings.some((f) => f.startsWith(want));
  if (planted[0] === '--plant-lesson') console.log(`  planted in ${plantedIn}${synthetic ? ' (synthetic)' : ''}`);
  console.log(`  NEGATIVE CONTROL ${planted[0]}: expected a ${want} finding, ${caught ? 'caught' : 'NOT CAUGHT'}`);
  process.exit(caught ? 1 : 2);
}
process.exit(findings.length ? 1 : 0);
