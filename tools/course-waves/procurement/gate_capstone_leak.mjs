// GATE: nothing the SC2 capstone grades, no input it is set on and no field it
// names reaches the digest, the digest generator, the vendored tender fixtures
// the teaching lab imports, the vendored golden, a sibling wave's answer key,
// the NextGen teaching lab and panels, the learning page, the lessons, the
// writer briefs, wave.json or (once they exist) the banks.
//
// Adapted from D5's gate_capstone_leak.mjs. The SC2 capstone inputs are
// SYNTHETIC TENDERS OF THEIR OWN (ONITSHA, UMUAHIA, OKIGWE): bid codes ON1 to
// ON6, UM1 to UM6, OK1 to OK5, their own scopes, criteria, bills, programmes
// and settings. Text that is VERBATIM FIXTURE TEXT (a deviation reason, a
// partner name, a criterion id the fixtures also use) is teaching material the
// digest may quote, so it is left out of the distinctive inputs and COUNTED.
// What is distinctive, and swept: every capstone scope and label written for
// the capstone, every run of three consecutive unit rates of a capstone bid as
// the course prints them, every capstone bid code, the capstone tender
// numbers, and every capstone number of 100 or more that is fractional, or
// whole, at least 10000 and not a multiple of 100, and not an engine default
// (the seeds, the fractional unit rates, the uneven prices).
//
// DIRECTIONS, every one counted and printed:
//   1. INPUTS. No distinctive capstone string, no run of three consecutive
//      capstone unit rates and no distinctive capstone scalar in digest.txt,
//      sc2_dump.mjs or the ekene-tender fixtures the lab imports; no capstone
//      scalar equal to a number in the golden.
//   2. VALUES, AS TEXT. Every graded value at four renderings (full double,
//      twelve and nine significant digits, the six decimals the course prints)
//      is absent from digest.txt.
//   3. VALUES, AS NUMBERS. No numeric literal in digest.txt within TEN
//      tolerances of a graded value in any of five unit shiftings.
//   4. NAMES. No capstone name (ONITSHA, UMUAHIA, OKIGWE) and no capstone bid
//      code (ON1, UM1, OK1 and the rest) in the digest, the generator or the
//      lab's fixture copy.
//   5. NEITHER FILE READS THE OTHER.
//   6. THE GOLDEN. No graded value within ten tolerances of a golden number.
//   7. SIBLINGS. No graded value within its own tolerance of a sibling wave's.
//   8. THE APP. The lab, the three calculator panels, their bits and the
//      learning page carry no graded value, no capstone name or code, no
//      distinctive capstone string and no distinctive capstone scalar.
//   9. THE BANKS, under --banks (default <wave>/banks); --no-banks declares
//      the foundation phase.
//  10. THE LESSONS, every .md under --lessons (default
//      <repo>/src/content/courses/procurement), and THE BRIEFS (BRIEF.md,
//      LESSON_TASK.md, BANK_TASK.md, KEY_TRUTH_TASK.md, PANELS.md) and
//      wave.json: no capstone name, string, run, scalar or graded value at four
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

const HERE = process.env.SC2_WAVE_DIR || '/root/cat-wip-procurement';
const REPO = process.env.SC2_REPO || '/root/wt-sc2-nextgen';
const ENG = process.env.SC2_ENGINES || path.join(REPO, 'packages/engines');
const WAVES = process.env.SC2_WAVES || path.join(REPO, 'tools/course-waves');
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i === -1 ? null : args[i + 1]; };

const die = (m) => { console.log(`gate_capstone_leak REFUSES: ${m}`); process.exit(2); };
const read = (p) => { if (!fs.existsSync(p)) die(`missing ${p}`); return fs.readFileSync(p, 'utf8'); };

let DIGEST = read(path.join(HERE, 'digest.txt'));
const DUMP = read(path.join(HERE, 'sc2_dump.mjs'));
const CAPSTONE = read(path.join(HERE, 'sc2_capstone.mjs'));
const FIELDS = JSON.parse(read(path.join(HERE, 'fields.json')));
if (FIELDS.length !== 18) die(`fields.json carries ${FIELDS.length} fields`);
const INPUTS = JSON.parse(execFileSync('node', [path.join(HERE, 'sc2_capstone.mjs'), '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1e8, env: { ...process.env, SC2_ENGINES: ENG } }));
const NAMES = Object.keys(INPUTS);
if (NAMES.join() !== 'ONITSHA,UMUAHIA,OKIGWE') die(`unexpected capstone datasets ${NAMES.join()}`);

const findings = [];
const counts = {};
const count = (k, n = 1) => { counts[k] = (counts[k] || 0) + n; };

/* ---- the capstone inputs: distinctive strings, unit-rate runs and scalars ---- */
const FIXDIR = path.join(ENG, 'test-data/supplychain/ekene-tender');
const FIXTEXT = new Set();
const fx = (f) => JSON.parse(read(path.join(FIXDIR, f)));
const walkStrings = (n, f) => {
  if (typeof n === 'string') f(n);
  else if (Array.isArray(n)) n.forEach((x) => walkStrings(x, f));
  else if (n && typeof n === 'object') Object.values(n).forEach((x) => walkStrings(x, f));
};
['well-services.json', 'materials.json'].forEach((f) => walkStrings(fx(f), (t) => FIXTEXT.add(t)));
const strings = [];
const series = [];
const scalars = [];
let fixtureLeftOut = 0;
const addString = (name, k, v) => {
  if (typeof v !== 'string' || v.trim().length < 12) return;
  if (FIXTEXT.has(v) || [...FIXTEXT].some((f) => f.includes(v))) { fixtureLeftOut += 1; return; }
  if (strings.some((x) => x.v === v)) return;
  strings.push({ name, k, v, low: v.toLowerCase() });
};
// A value the engine uses by default is no capstone input. Such scalars are
// left out and counted, and so is every whole number below 10000 or a multiple
// of 100: a count of tonnes, a depth, a rate like 2900 or a round price like
// 50000 is a figure any example may use. What stays is distinctive: a
// fractional price or rate (27450.35), a whole price like 406980, a seed.
const { T: ENGINE } = await import(path.join(HERE, 'tender_engine.mjs'));
const ENGINE_DEFAULTS = new Set(Object.values(ENGINE.DEFAULTS).filter((v) => typeof v === 'number'));
let defaultsLeftOut = 0;
let roundLeftOut = 0;
const bigNum = (v) => {
  if (!(typeof v === 'number' && Number.isFinite(v) && Math.abs(v) >= 100)) return false;
  if (ENGINE_DEFAULTS.has(v)) { defaultsLeftOut += 1; return false; }
  if (Number.isInteger(v) && (Math.abs(v) < 10000 || v % 100 === 0)) { roundLeftOut += 1; return false; }
  return true;
};
const addScalar = (name, k, v) => { if (bigNum(v) && !scalars.some((x) => x.v === v)) scalars.push({ name, k, v }); };
const walkNums = (name, n, k = '') => {
  if (typeof n === 'number') addScalar(name, k, n);
  else if (Array.isArray(n)) n.forEach((x, i) => walkNums(name, x, `${k}[${i}]`));
  else if (n && typeof n === 'object') Object.entries(n).forEach(([kk, x]) => walkNums(name, x, k ? `${k}.${kk}` : kk));
};
const bidsOf = (o) => [...(o.bids || []), ...((o.tender && o.tender.bids) || [])];
Object.entries(INPUTS).forEach(([name, o]) => {
  walkNums(name, o);
  walkStrings(o, (t) => addString(name, 'string', t));
  bidsOf(o).forEach((b) => series.push({ name, k: `${b.id} unit rates`, v: b.lines.map((l) => l.unitRate) }));
});
console.log('  the stated pass marks, weights, weeks, rates a week, years, discount rates and fractions are small numbers any example uses, so they are left out of the scalars and printed as left out');
console.log(`  capstone numbers equal to an engine default, left out: ${defaultsLeftOut}; whole numbers below 10000 or multiples of 100, left out: ${roundLeftOut}`);
console.log(`  capstone strings that are verbatim fixture text, left out: ${fixtureLeftOut}`);

/* ---- the negative controls, planted in memory ---- */
if (has('--plant-value')) DIGEST += `\n| planted | ${FIELDS[3][2].toFixed(6)} |\n`;
if (has('--plant-input')) DIGEST += `\nA planted scope: ${INPUTS.UMUAHIA.scope}.\n`;
if (has('--plant-name')) DIGEST += '\nA planted line naming Okigwe.\n';

if (strings.length < 10) die(`only ${strings.length} distinctive capstone strings parsed`);
if (series.length < 15) die(`only ${series.length} capstone unit-rate series parsed`);
// Runs of three consecutive unit rates of one bid, as the course prints them
// (six decimals), with two decimals, and as the generator writes them. A run
// of one repeated value says nothing about the capstone; it is left out and
// counted.
const runs = [];
series.forEach(({ name, k, v }) => {
  for (let i = 0; i + 3 <= v.length; i += 1) {
    const w = v.slice(i, i + 3);
    if (w.every((x) => x === w[0])) { count('1 constant runs left out'); continue; }
    runs.push({ name, k, i, six: w.map((x) => x.toFixed(6)).join(', '), two: w.map((x) => x.toFixed(2)).join(', '), raw: w.map(String).join(', '), rawTight: w.map(String).join(',') });
  }
});
if (runs.length < 40) die(`only ${runs.length} capstone runs of three built`);

const NUM = /(?<![\w.])-?\d+(?:\.\d+)?(?:e[-+]?\d+)?(?![\w])/g;
const literals = (text) => [...text.matchAll(NUM)].map((m) => Number(m[0])).filter((x) => Number.isFinite(x));
// A whole-number scalar is matched as a whole number: 980 in "980.353000" is a
// different number and is not a hit (the (?!\.\d) guard).
const hasWord = (text, s) => new RegExp(`(?<![\\d.])${String(s).replace(/[.]/g, '\\.')}(?![\\d])(?!\\.\\d)`).test(text);
const runsIn = (text) => runs.filter((r) => text.includes(r.six) || text.includes(r.two) || text.includes(r.raw) || text.includes(r.rawTight));
const stringsIn = (text) => { const low = text.toLowerCase(); return strings.filter((x) => low.includes(x.low)); };

// 1. INPUTS
// The lab imports the vendored fixture files themselves; they are what a
// learner's panel starts from, so they are swept as the lab's dataset.
const LAB_DATA = ['well-services.json', 'materials.json'].map((f) => read(path.join(FIXDIR, f))).join('\n');
[['digest.txt', DIGEST], ['sc2_dump.mjs', DUMP], ['the ekene-tender fixtures', LAB_DATA]].forEach(([label, text]) => {
  count('1 input runs searched', runs.length);
  runsIn(text).forEach((r) => findings.push(`[1 inputs] ${label} carries a run of ${r.name}.${r.k} from entry ${r.i}: ${r.two}`));
  count('1 input strings searched', strings.length);
  stringsIn(text).forEach((x) => findings.push(`[1 inputs] ${label} carries ${x.name} ${x.k}: "${x.v}"`));
  scalars.forEach(({ name, k, v }) => {
    count('1 input scalars checked');
    if (hasWord(text, v)) findings.push(`[1 inputs] ${label} carries ${name}.${k} = ${v}`);
  });
});
const GOLD = JSON.parse(read(path.join(ENG, 'test-data/supplychain/goldens/tender_cases.json')));
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
const nameRe = /\b(onitsha|umuahia|okigwe)\b|\b(?:ON|UM|OK)[1-6]\b|EK-11\/(?:WS\/2027-19|MS\/2027-23)/i;
[['digest.txt', DIGEST], ['sc2_dump.mjs', DUMP], ['the ekene-tender fixtures', LAB_DATA]].forEach(([label, text]) => {
  count('4 files searched for names');
  const m = text.match(nameRe);
  if (m) findings.push(`[4 names] ${label} names the capstone field ${m[0]}`);
});

// 5. NEITHER FILE READS THE OTHER
[['sc2_dump.mjs', DUMP, /sc2_capstone|fields\.json/],
  ['sc2_capstone.mjs', CAPSTONE, /sc2_dump|digest\.txt/]].forEach(([label, text, re]) => {
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
  fs.readdirSync(WAVES).filter((w) => w !== 'procurement').forEach((w) => {
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
const APP = ['tenderLab.js', 'EnvelopeCalculator.jsx', 'AwardCalculator.jsx', 'ContractCalculator.jsx', 'panelBits.jsx']
  .map((f) => path.join(REPO, 'src/components/course/panels/procurement', f))
  .concat([path.join(REPO, 'src/pages/apps/ProcurementLearningPage.jsx')]);
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
const lessonsDir = opt('--lessons') || path.join(REPO, 'src/content/courses/procurement');
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

console.log(`gate_capstone_leak: ${strings.length} distinctive capstone strings, ${series.length} capstone unit-rate series, ${runs.length} runs of three, ${scalars.length} distinctive scalars, `
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
