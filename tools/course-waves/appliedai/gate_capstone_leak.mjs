// GATE: nothing the D5 capstone grades, no input it is set on and no field it
// names reaches the digest, the digest generator, the teaching lab's copy of
// the fixtures, the vendored golden, a sibling wave's answer key, the NextGen
// teaching lab and panels, the lessons, the writer briefs, wave.json or (once
// they exist) the banks.
//
// Adapted from D4's gate_capstone_leak.mjs. The D5 capstone inputs are
// SEEDED VARIANTS of the Ekene document fixture: passages copied verbatim from
// the fixture under new ids (ORL-, NNW-), queries worded for the capstone,
// answers (ORLU's written for the capstone, NNEWI's the fixture's system B
// text), extraction records renamed NX-, rating pairs and calibration rows.
// Text that is VERBATIM FIXTURE TEXT (a passage, a fixture answer, a fixture
// short answer or reference) is teaching material the digest may quote, so it
// is left out of the distinctive inputs and COUNTED. What is distinctive, and
// swept: every capstone query text, every answer text written for the
// capstone, every run of three consecutive capstone probabilities as the
// course prints them (two decimals), every capstone id, and every whole number
// of 100 or more among the stated settings (the seeds).
//
// DIRECTIONS, every one counted and printed:
//   1. INPUTS. No distinctive capstone string, no run of three consecutive
//      capstone probabilities and no distinctive capstone scalar in
//      digest.txt, d5_dump.mjs or the lab's fixture copy; no capstone scalar
//      equal to a number in the golden.
//   2. VALUES, AS TEXT. Every graded value at four renderings (full double,
//      twelve and nine significant digits, the six decimals the course prints)
//      is absent from digest.txt.
//   3. VALUES, AS NUMBERS. No numeric literal in digest.txt within TEN
//      tolerances of a graded value in any of five unit shiftings.
//   4. NAMES. No capstone name (ORLU, NNEWI, AWKA) and no capstone id prefix
//      (ORL-, NNW-, NX-) in the digest, the generator or the lab's fixture copy.
//   5. NEITHER FILE READS THE OTHER.
//   6. THE GOLDEN. No graded value within ten tolerances of a golden number.
//   7. SIBLINGS. No graded value within its own tolerance of a sibling wave's.
//   8. THE APP. The lab, the fixture copy, the three panels, their bits and the
//      learning page carry no graded value, no capstone name or id, no
//      distinctive capstone string and no distinctive capstone scalar.
//   9. THE BANKS, under --banks (default <wave>/banks); --no-banks declares
//      the foundation phase.
//  10. THE LESSONS, every .md under --lessons (default
//      <repo>/src/content/courses/appliedai), and THE BRIEFS (BRIEF.md,
//      LESSON_TASK.md, BANK_TASK.md, KEY_TRUTH_TASK.md, PANELS.md) and wave.json:
//      no capstone name, string, run, scalar or graded value at four
//      renderings, and no numeric literal within ten tolerances of a graded
//      value in five shiftings.
//
//   node gate_capstone_leak.mjs [--no-banks] [--banks DIR] [--no-lessons] [--lessons DIR]
//   node gate_capstone_leak.mjs --no-banks --plant-value | --plant-input | --plant-name | --plant-lesson
//      THE NEGATIVE CONTROLS, each planted in memory; each must exit 1 naming
//      the direction that caught it.
//
// Exit 0 clean, 1 a leak, 2 could not run.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.D5_WAVE_DIR || '/root/dai-wip-appliedai';
const REPO = process.env.D5_REPO || '/root/wt-dai-d5-nextgen';
const ENG = process.env.D5_ENGINES || path.join(REPO, 'packages/engines');
const WAVES = process.env.D5_WAVES || path.join(REPO, 'tools/course-waves');
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i === -1 ? null : args[i + 1]; };

const die = (m) => { console.log(`gate_capstone_leak REFUSES: ${m}`); process.exit(2); };
const read = (p) => { if (!fs.existsSync(p)) die(`missing ${p}`); return fs.readFileSync(p, 'utf8'); };

let DIGEST = read(path.join(HERE, 'digest.txt'));
const DUMP = read(path.join(HERE, 'd5_dump.mjs'));
const CAPSTONE = read(path.join(HERE, 'd5_capstone.mjs'));
const FIELDS = JSON.parse(read(path.join(HERE, 'fields.json')));
if (FIELDS.length !== 18) die(`fields.json carries ${FIELDS.length} fields`);
const INPUTS = JSON.parse(execFileSync('node', [path.join(HERE, 'd5_capstone.mjs'), '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8, env: { ...process.env, D5_ENGINES: ENG } }));
const NAMES = Object.keys(INPUTS);
if (NAMES.join() !== 'ORLU,NNEWI,AWKA') die(`unexpected capstone datasets ${NAMES.join()}`);

const findings = [];
const counts = {};
const count = (k, n = 1) => { counts[k] = (counts[k] || 0) + n; };

/* ---- the capstone inputs: distinctive strings, probability runs and scalars ---- */
const FIXDIR = path.join(ENG, 'test-data/dataai/ekene-docs');
const FIXTEXT = new Set();
const fx = (f) => JSON.parse(read(path.join(FIXDIR, f)));
fx('corpus.json').passages.forEach((p) => FIXTEXT.add(p.text));
fx('queries.json').queries.forEach((q) => { FIXTEXT.add(q.text); FIXTEXT.add(q.reference); });
fx('systems.json').systems.forEach((s) => s.answers.forEach((a) => { FIXTEXT.add(a.text); FIXTEXT.add(a.short); }));
const strings = [];
const series = [];
const scalars = [];
let fixtureLeftOut = 0;
const addString = (name, k, v) => {
  if (typeof v !== 'string' || v.trim().length < 12) return;
  if (FIXTEXT.has(v)) { fixtureLeftOut += 1; return; }
  strings.push({ name, k, v, low: v.toLowerCase() });
};
// A value the engine uses by default (nBoot 2000) is no capstone input: every
// example that leaves nBoot out uses it. Such scalars are left out and counted.
const ENGINE_DEFAULTS = new Set(Object.values((await import(`${ENG}/engines/dataai/evaluate.js`)).DEFAULTS).filter((v) => typeof v === 'number'));
let defaultsLeftOut = 0;
const bigInt = (v) => {
  if (!(typeof v === 'number' && Number.isInteger(v) && Math.abs(v) >= 100)) return false;
  if (ENGINE_DEFAULTS.has(v)) { defaultsLeftOut += 1; return false; }
  return true;
};
Object.entries(INPUTS).forEach(([name, o]) => {
  if (bigInt(o.seed)) scalars.push({ name, k: 'seed', v: o.seed });
  (o.queries || []).forEach((q) => addString(name, `query ${q.id}`, q.text));
  (o.answers || []).forEach((a) => addString(name, `answer ${a.query}`, a.text));
  (o.documents || []).forEach((d) => addString(name, `passage ${d.id}`, d.text));
  (o.shorts || []).forEach((x) => { addString(name, `short ${x.query}`, x.answer); addString(name, `reference ${x.query}`, x.reference); });
  Object.entries(o.stated || {}).forEach(([k, v]) => { if (bigInt(v)) scalars.push({ name, k: `stated.${k}`, v }); });
  if (o.calibration) series.push({ name, k: 'calibration.probabilities', v: o.calibration.probabilities });
});
// The extraction records' generator seed is typed in d5_capstone.mjs and is
// not in --inputs; it is read from the generator source so it is swept too.
[...CAPSTONE.matchAll(/mulberry32\((\d{3,})\)/g)].forEach((m) => { const v = Number(m[1]); if (bigInt(v) && !scalars.some((x) => x.v === v)) scalars.push({ name: 'generator', k: 'mulberry32 seed', v }); });
console.log('  the stated cutoffs, grades, bins, k1, b and the bootstrap seed are small numbers any example uses, so they are left out of the scalars and printed as left out');
console.log(`  stated scalars equal to an engine default, left out: ${defaultsLeftOut}`);
console.log(`  capstone strings that are verbatim fixture text (passages, fixture answers, short answers, references), left out: ${fixtureLeftOut}`);

/* ---- the negative controls, planted in memory ---- */
if (has('--plant-value')) DIGEST += `\n| planted | ${FIELDS[3][2].toFixed(6)} |\n`;
if (has('--plant-input')) DIGEST += `\nA planted query: ${INPUTS.NNEWI.queries[3].text}.\n`;
if (has('--plant-name')) DIGEST += '\nA planted line naming Awka.\n';

if (strings.length < 12) die(`only ${strings.length} distinctive capstone strings parsed`);
if (series.length < 1) die('no capstone probability series parsed');
// Runs of three consecutive probabilities, as the course prints them (2 dp,
// six decimals) and as the generator writes them. A run of one repeated value
// says nothing about the capstone; it is left out and counted.
const runs = [];
series.forEach(({ name, k, v }) => {
  for (let i = 0; i + 3 <= v.length; i += 1) {
    const w = v.slice(i, i + 3);
    if (w.every((x) => x === w[0])) { count('1 constant runs left out'); continue; }
    runs.push({ name, k, i, six: w.map((x) => x.toFixed(6)).join(', '), two: w.map((x) => x.toFixed(2)).join(', '), raw: w.map(String).join(', '), rawTight: w.map(String).join(',') });
  }
});
if (runs.length < 100) die(`only ${runs.length} capstone runs of three built`);

const NUM = /(?<![\w.])-?\d+(?:\.\d+)?(?:e[-+]?\d+)?(?![\w])/g;
const literals = (text) => [...text.matchAll(NUM)].map((m) => Number(m[0])).filter((x) => Number.isFinite(x));
// A whole-number scalar is matched as a whole number: 980 in "980.353000" is a
// different number and is not a hit (the (?!\.\d) guard).
const hasWord = (text, s) => new RegExp(`(?<![\\d.])${String(s).replace(/[.]/g, '\\.')}(?![\\d])(?!\\.\\d)`).test(text);
const runsIn = (text) => runs.filter((r) => text.includes(r.six) || text.includes(r.two) || text.includes(r.raw) || text.includes(r.rawTight));
const stringsIn = (text) => { const low = text.toLowerCase(); return strings.filter((x) => low.includes(x.low)); };

// 1. INPUTS
const LAB_DATA = read(path.join(REPO, 'src/components/course/panels/appliedai/ekeneDocs.json'));
[['digest.txt', DIGEST], ['d5_dump.mjs', DUMP], ['ekeneDocs.json', LAB_DATA]].forEach(([label, text]) => {
  count('1 input runs searched', runs.length);
  runsIn(text).forEach((r) => findings.push(`[1 inputs] ${label} carries a run of ${r.name}.${r.k} from entry ${r.i}: ${r.two}`));
  count('1 input strings searched', strings.length);
  stringsIn(text).forEach((x) => findings.push(`[1 inputs] ${label} carries ${x.name} ${x.k}: "${x.v}"`));
  scalars.forEach(({ name, k, v }) => {
    count('1 input scalars checked');
    if (hasWord(text, v)) findings.push(`[1 inputs] ${label} carries ${name}.${k} = ${v}`);
  });
});
const GOLD = JSON.parse(read(path.join(ENG, 'test-data/dataai/goldens/evaluate_cases.json')));
const goldNums = [];
const walk = (n) => {
  if (typeof n === 'number') goldNums.push(n);
  else if (Array.isArray(n)) n.forEach(walk);
  else if (n && typeof n === 'object') Object.values(n).forEach(walk);
};
walk(GOLD);
if (goldNums.length < 1000) die(`only ${goldNums.length} numbers walked out of the golden`);
scalars.forEach(({ name, k, v }) => {
  count('1 input scalars against the golden');
  if (goldNums.includes(v)) findings.push(`[1 inputs] the golden carries ${name}.${k} = ${v}`);
});

// 2. VALUES AS TEXT
const trim = (s) => (s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s);
const renderings = (v) => [...new Set([String(v), trim(v.toPrecision(12)), trim(v.toPrecision(9)), v.toFixed(6)])]
  .filter((s) => s.includes('.') && !s.includes('e') && s.length >= 6);
FIELDS.forEach(([, key, v]) => renderings(v).forEach((s) => {
  count('2 renderings searched');
  if (DIGEST.includes(s)) findings.push(`[2 values] digest.txt carries ${key} as ${s}`);
}));

// 3. VALUES AS NUMBERS, five shiftings, ten tolerances
const digestLits = literals(DIGEST.split('\n').filter((l) => !l.startsWith('#')).join('\n'));
if (digestLits.length < 1000) die(`only ${digestLits.length} literals in the digest; an empty or half-written digest clears everything`);
const SCALES = [1, 1e3, 1e-3, 1e2, 1e-2];
const nearAnswer = (lits, label, dir) => FIELDS.forEach(([, key, v, tol]) => SCALES.forEach((sc) => {
  const target = v * sc;
  const band = 10 * tol * sc;
  lits.forEach((x) => {
    count(`${dir} literal comparisons`);
    if (Math.abs(x - target) <= band) findings.push(`[${dir} values] ${label} literal ${x} is within ten tolerances of ${key} x${sc}`);
  });
}));
nearAnswer(digestLits, 'digest', '3');

// 4. NAMES
const nameRe = /\b(orlu|nnewi|awka)\b|\b(?:ORL|NNW|NX)-\d/i;
[['digest.txt', DIGEST], ['d5_dump.mjs', DUMP], ['ekeneDocs.json', LAB_DATA]].forEach(([label, text]) => {
  count('4 files searched for names');
  const m = text.match(nameRe);
  if (m) findings.push(`[4 names] ${label} names the capstone field ${m[0]}`);
});

// 5. NEITHER FILE READS THE OTHER
[['d5_dump.mjs', DUMP, /d5_capstone|fields\.json/],
  ['d5_capstone.mjs', CAPSTONE, /d5_dump|digest\.txt/]].forEach(([label, text, re]) => {
  count('5 files checked');
  const code = text.split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  if (re.test(code)) findings.push(`[5 separation] ${label} reads the other side (${re})`);
});

// 6. THE GOLDEN
FIELDS.forEach(([, key, v, tol]) => goldNums.forEach((x) => {
  count('6 golden comparisons');
  if (Math.abs(x - v) <= 10 * tol) findings.push(`[6 golden] golden number ${x} is within ten tolerances of ${key}`);
}));

// 7. SIBLINGS
let siblings = 0;
if (fs.existsSync(WAVES)) {
  fs.readdirSync(WAVES).filter((w) => w !== 'appliedai').forEach((w) => {
    const f = path.join(WAVES, w, 'fields.json');
    if (!fs.existsSync(f)) return;
    siblings += 1;
    JSON.parse(fs.readFileSync(f, 'utf8')).forEach(([, sk, sv]) => {
      FIELDS.forEach(([, key, v, tol]) => {
        count('7 sibling comparisons');
        if (typeof sv === 'number' && Math.abs(sv - v) <= tol) findings.push(`[7 siblings] ${w}/${sk} = ${sv} sits within the tolerance of ${key}`);
      });
    });
  });
}
if (siblings < 10) die(`only ${siblings} sibling answer keys found under ${WAVES}`);

// 8. THE APP
const APP = ['evaluateLab.js', 'RetrievalExplorer.jsx', 'ScoringExplorer.jsx', 'TrustExplorer.jsx', 'panelBits.jsx', 'ekeneDocs.json']
  .map((f) => path.join(REPO, 'src/components/course/panels/appliedai', f))
  .concat([path.join(REPO, 'src/pages/apps/AppliedaiLearningPage.jsx')]);
APP.forEach((p) => {
  const text = read(p);
  count('8 app sources');
  const m = text.match(nameRe);
  if (m) findings.push(`[8 app] ${path.basename(p)} names ${m[0]}`);
  FIELDS.forEach(([, key, v]) => renderings(v).forEach((s) => { if (text.includes(s)) findings.push(`[8 app] ${path.basename(p)} carries ${key} as ${s}`); }));
  runsIn(text).forEach((r) => findings.push(`[8 app] ${path.basename(p)} carries a run of ${r.name}.${r.k}`));
  stringsIn(text).forEach((x) => findings.push(`[8 app] ${path.basename(p)} carries ${x.name} ${x.k}`));
  scalars.forEach(({ name, k, v }) => { if (hasWord(text, v)) findings.push(`[8 app] ${path.basename(p)} carries ${name}.${k} = ${v}`); });
});

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
        FIELDS.forEach(([, key, v]) => renderings(v).forEach((s) => { if (t.includes(s)) findings.push(`[9 banks] ${f}#${i} carries ${key} as ${s}`); }));
        runsIn(t).forEach((r) => findings.push(`[9 banks] ${f}#${i} carries a run of ${r.name}.${r.k}`));
        stringsIn(t).forEach((x) => findings.push(`[9 banks] ${f}#${i} carries ${x.name} ${x.k}`));
        scalars.forEach(({ name, k, v }) => { if (hasWord(t, v)) findings.push(`[9 banks] ${f}#${i} carries ${name}.${k}`); });
      });
    });
  });
  if (bankTexts === 0) die(`the banks directory ${banksDir} holds no readable question text`);
}

// 10. THE LESSONS, THE BRIEFS AND wave.json
const lessonsDir = opt('--lessons') || path.join(REPO, 'src/content/courses/appliedai');
const lessonFiles = [];
let lessonLits = 0;
let plantedIn = null;
const sweepText = (rel, text0, fi) => {
  let text = text0;
  if (fi === 0 && has('--plant-lesson')) {
    const PLANT_FIELD = FIELDS[2];
    text += `\nA planted near miss: ${(PLANT_FIELD[2] - 3 * PLANT_FIELD[3]).toFixed(7)}.\n`;
    plantedIn = rel;
  }
  const plain = text.replace(/(\d),(?=\d{3}(?!\d))/g, '$1');
  const m = plain.match(nameRe);
  if (m) findings.push(`[10 lessons] ${rel} names the capstone field ${m[0]}`);
  runsIn(plain).forEach((r) => findings.push(`[10 lessons] ${rel} carries a run of ${r.name}.${r.k} from entry ${r.i}`));
  stringsIn(plain).forEach((x) => findings.push(`[10 lessons] ${rel} carries ${x.name} ${x.k}`));
  scalars.forEach(({ name, k, v }) => {
    count('10 scalar checks');
    if (hasWord(plain, v)) findings.push(`[10 lessons] ${rel} carries ${name}.${k} = ${v}`);
  });
  FIELDS.forEach(([, key, v]) => renderings(v).forEach((s) => {
    count('10 renderings searched');
    if (plain.includes(s)) findings.push(`[10 lessons] ${rel} carries ${key} as ${s}`);
  }));
  const lits = literals(plain);
  lessonLits += lits.length;
  FIELDS.forEach(([, key, v, tol]) => SCALES.forEach((sc) => {
    const target = v * sc;
    const band = 10 * tol * sc;
    lits.forEach((x) => {
      count('10 literal comparisons');
      if (Math.abs(x - target) <= band) findings.push(`[10 lessons numeric] ${rel} literal ${x} is within ten tolerances of ${key} x${sc}`);
    });
  }));
};
if (has('--no-lessons')) {
  console.log('  direction 10: --no-lessons DECLARED. This run says NOTHING about any lesson.');
} else if (!fs.existsSync(lessonsDir)) {
  die(`no lessons directory at ${lessonsDir}; pass --no-lessons to declare that this run does not sweep lessons`);
} else {
  const walkMd = (d) => fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkMd(p);
    else if (e.name.endsWith('.md') || e.name === 'manifest.json') lessonFiles.push(p);
  });
  walkMd(lessonsDir);
  if (lessonFiles.filter((p) => p.endsWith('.md')).length === 0) die(`the lessons directory ${lessonsDir} holds no .md file`);
  lessonFiles.forEach((p, fi) => { count('10 lesson files'); sweepText(path.relative(lessonsDir, p), fs.readFileSync(p, 'utf8'), fi); });
  console.log(`  direction 10: read ${lessonFiles.length} lesson and manifest files under ${lessonsDir}, ${lessonLits} numeric literals`);
}
const BRIEFS = ['BRIEF.md', 'LESSON_TASK.md', 'BANK_TASK.md', 'KEY_TRUTH_TASK.md', 'PANELS.md', 'wave.json'];
let briefsRead = 0;
BRIEFS.forEach((b) => {
  const p = path.join(HERE, b);
  if (!fs.existsSync(p)) die(`the brief ${b} is missing from ${HERE}`);
  let text = fs.readFileSync(p, 'utf8');
  // wave.json's gates block quotes gate summaries, and fieldsDiscrimination
  // names wrong methods; neither carries a capstone input. The whole file is
  // swept all the same, with the graded KEYS removed, because the keys name
  // the capstone fields by design.
  if (b === 'wave.json') FIELDS.forEach(([, key]) => { text = text.split(key).join('KEY'); });
  count('10 briefs');
  briefsRead += 1;
  sweepText(b, text, -1);
});

console.log(`gate_capstone_leak: ${strings.length} distinctive capstone strings, ${series.length} capstone probability series, ${runs.length} runs of three, ${scalars.length} distinctive scalars, `
  + `${FIELDS.length} graded values, ${digestLits.length} digest literals, ${goldNums.length} golden numbers, `
  + `${siblings} sibling answer keys, ${APP.length} app sources, ${bankTexts} bank texts, ${lessonFiles.length} lesson files, ${briefsRead} briefs`);
Object.entries(counts).sort().forEach(([k, n]) => console.log(`  direction ${k}: ${n}`));
console.log(`  FINDINGS: ${findings.length}`);
findings.slice(0, 40).forEach((f) => console.log(`   ${f}`));
const planted = ['--plant-value', '--plant-input', '--plant-name', '--plant-lesson'].filter(has);
if (planted.length) {
  const want = { '--plant-value': '[2 values]', '--plant-input': '[1 inputs]', '--plant-name': '[4 names]', '--plant-lesson': '[10 lessons numeric]' }[planted[0]];
  const caught = planted[0] === '--plant-lesson'
    ? plantedIn !== null && findings.some((f) => f.startsWith(`${want} ${plantedIn} `))
    : findings.some((f) => f.startsWith(want));
  if (planted[0] === '--plant-lesson') console.log(`  planted in ${plantedIn}`);
  console.log(`  NEGATIVE CONTROL ${planted[0]}: expected a ${want} finding, ${caught ? 'caught' : 'NOT CAUGHT'}`);
  process.exit(caught ? 1 : 2);
}
process.exit(findings.length ? 1 : 0);
