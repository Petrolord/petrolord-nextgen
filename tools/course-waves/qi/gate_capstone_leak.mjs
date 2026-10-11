// GATE: nothing the QI capstones grade, no input a capstone case is set on and
// no capstone case name reaches the digest, its generators, the teaching pack,
// the vendored goldens, a sibling wave's answer key, the NextGen teaching lab
// and panels, the learning page, the lessons, the writer briefs, wave.json or
// (once they exist) the banks.
//
// Adapted from SC4 marine's gate_capstone_leak.mjs. The QI capstones run on
// HELD-OUT SYNTHETIC CASES (src/content/capstone-cases/qi/<name>_case.json:
// TAMBERLO today, two more when the Professional and Expert graders land).
// What is distinctive, and swept:
//   * NAMES: every case name and well name (TAMBERLO, Tamberlo-1);
//   * CONDITIONS: the case's stated conditions as a run (temperature,
//     pressure, salinity, oil gravity, gas-oil ratio, gas gravity), in the
//     order the case states them, and each condition of 100 or more alone;
//   * STATED DEPTHS: the case's top, base, contact and stated sample depths
//     (feet), matched as whole numbers, because every one is a depth no Ekene
//     well has;
//   * LOG ROWS: every row of the case well, as its Vp and its Vs together
//     (one figure alone collides by chance with a file as dense as the pack).
//
// DIRECTIONS, every one counted and printed:
//   1. INPUTS. No case string, run, depth or log figure in digest.txt, the
//      digest generators (qi_dump*.mjs) or the teaching pack.
//   2. VALUES, AS TEXT. Every graded value at four renderings (full double,
//      twelve and nine significant digits, six decimals) absent from digest.txt.
//   3. VALUES, AS NUMBERS. No digest literal within TEN tolerances of a graded
//      value in any of five unit shiftings (x1, x1e3, x1e-3, x1e2, x1e-2).
//   4. NAMES. No case name in the digest, the generators or the pack.
//   5. NEITHER SIDE READS THE OTHER. The digest generators never read the
//      capstone generator, the cases or fields.json; the capstone generator
//      never reads the digest.
//   6. THE GOLDENS. No graded value within ten tolerances of a number in the
//      vendored QI and rock physics goldens.
//   7. SIBLINGS. No graded value within its own tolerance of a sibling wave's.
//   8. THE APP. The lab, the panels (tests and data files excluded) and the
//      learning page carry no graded value, case name or case input.
//   9. THE BANKS, under --banks (default <wave>/banks); --no-banks declares
//      the foundation phase.
//  10. THE LESSONS (every .md and manifest under the course) and THE BRIEFS
//      (every *.md in the wave directory) and wave.json.
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

const HERE = process.env.QI_WAVE_DIR || path.dirname(new URL(import.meta.url).pathname);
const REPO = process.env.QI_REPO || '/root/wt-qi-nextgen';
const ENG = process.env.QI_ENGINES || path.join(REPO, 'packages/engines');
const WAVES = process.env.QI_WAVES || path.join(REPO, 'tools/course-waves');
const CASES = path.join(REPO, 'src/content/capstone-cases/qi');
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i === -1 ? null : args[i + 1]; };
const die = (m) => { console.log(`gate_capstone_leak REFUSES: ${m}`); process.exit(2); };
const read = (p) => { if (!fs.existsSync(p)) die(`missing ${p}`); return fs.readFileSync(p, 'utf8'); };

let DIGEST = read(path.join(HERE, 'digest.txt'));
const GENS = fs.readdirSync(HERE).filter((f) => /^qi_dump.*\.mjs$/.test(f)).sort();
if (!GENS.includes('qi_dump.mjs') || !GENS.includes('qi_dump_a.mjs')) die('the digest generators qi_dump.mjs and qi_dump_a.mjs are missing');
const GEN_TEXT = GENS.map((f) => [f, read(path.join(HERE, f))]);
const CAPSTONE = read(path.join(HERE, 'qi_capstone.mjs'));
const PACK = read(path.join(REPO, 'src/components/course/panels/qi/ekeneQiPack.json'));
const FIELDS = JSON.parse(read(path.join(HERE, 'fields.json')));
if (!FIELDS.length || FIELDS.length % 6) die(`fields.json carries ${FIELDS.length} fields, not six a tier`);
if (!fs.existsSync(CASES)) die(`no case directory ${CASES}`);
const CASEFILES = fs.readdirSync(CASES).filter((f) => f.endsWith('_case.json')).sort();
if (!CASEFILES.length) die(`no case file in ${CASES}`);
const INPUTS = CASEFILES.map((f) => JSON.parse(read(path.join(CASES, f))));

const findings = [];
const counts = {};
const count = (k, n = 1) => { counts[k] = (counts[k] || 0) + n; };

/* ---- the distinctive case inputs ---- */
const names = new Set();
const runs = [];
const depths = [];
const rowPairs = [];
INPUTS.forEach((c) => {
  names.add(c.case);
  if (c.well?.name) names.add(c.well.name);
  const cond = c.conditions ? Object.values(c.conditions) : [];
  if (cond.length >= 3) {
    for (let i = 0; i + 3 <= cond.length; i += 1) {
      const w = cond.slice(i, i + 3);
      runs.push({ name: c.case, k: `conditions[${i}]`, forms: [w.join(', '), w.join(' and '), w.join(',')] });
    }
    cond.filter((v) => v >= 100).forEach((v) => depths.push({ name: c.case, k: 'condition', v }));
  }
  if (c.well) {
    ['topFt', 'baseFt', 'owcFt'].forEach((k) => depths.push({ name: c.case, k, v: c.well[k] }));
    const ix = Object.fromEntries((c.well.columns || []).map((k, i) => [k, i]));
    c.well.rows.forEach((r) => { const vp = r[ix.vp]; const vs = r[ix.vs]; if (!Number.isInteger(vp) && !Number.isInteger(vs)) rowPairs.push({ name: c.case, md: r[ix.md_ft], vp, vs }); });
  }
  Object.entries(c.stated || {}).forEach(([k, v]) => { if (typeof v === 'number' && /Ft$/.test(k) && v >= 1000) depths.push({ name: c.case, k, v }); });
});
const nameList = [...names];
if (nameList.length < 2) die(`only ${nameList.length} case names read`);
if (runs.length < 2) die(`only ${runs.length} condition runs built`);
if (depths.length < 4) die(`only ${depths.length} stated depths read`);
if (rowPairs.length < 300) die(`only ${rowPairs.length} case log rows read`);

/* ---- the negative controls, planted in memory ---- */
if (has('--plant-value')) DIGEST += `\n| planted | ${FIELDS[3][2].toFixed(6)} |\n`;
if (has('--plant-input')) DIGEST += `\nA planted line: ${runs[0].forms[0]}.\n`;
if (has('--plant-name')) DIGEST += `\nA planted line naming ${nameList[1]}.\n`;

const NUM = /(?<![\w.])-?\d+(?:\.\d+)?(?:e[-+]?\d+)?(?![\w])/g;
const literals = (text) => [...text.matchAll(NUM)].map((m) => Number(m[0])).filter((x) => Number.isFinite(x));
const nameRe = new RegExp(`\\b(${nameList.map((n) => n.replace(/[-]/g, '\\-')).join('|')})\\b`, 'i');
const wordOf = (v) => new RegExp(`(?<![\\d.])${String(v).replace(/[.]/g, '\\.')}(?![\\d])(?!\\.\\d)`);
const depthRes = depths.map((d) => ({ ...d, re: wordOf(d.v) }));
const inputsIn = (label, text, dir) => {
  runs.forEach((r) => { count(`${dir} runs searched`); if (r.forms.some((f) => text.includes(f))) findings.push(`[${dir} inputs] ${label} carries ${r.name} ${r.k}: ${r.forms[0]}`); });
  depthRes.forEach((d) => { count(`${dir} depths checked`); if (d.re.test(text)) findings.push(`[${dir} inputs] ${label} carries ${d.name}.${d.k} = ${d.v}`); });
  // A single log figure at three decimals collides by chance with a dense file
  // (the pack holds thousands of velocities in the same range), so a case row
  // counts as carried only when its Vp AND its Vs both appear in the one text.
  const lits = new Set(literals(text));
  rowPairs.forEach((r) => { count(`${dir} case log rows checked`); if (lits.has(r.vp) && lits.has(r.vs)) findings.push(`[${dir} inputs] ${label} carries the ${r.name} log row at ${r.md} ft (Vp ${r.vp}, Vs ${r.vs})`); });
};
const trim = (s) => (s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s);
const renderings = (v) => [...new Set([String(v), trim(v.toPrecision(12)), trim(v.toPrecision(9)), v.toFixed(6)])]
  .filter((s) => s.includes('.') && !s.includes('e') && s.replace(/^-/, '').length >= 6);
const SCALES = [1, 1e3, 1e-3, 1e2, 1e-2];
const nearAnswer = (lits, label, dir) => FIELDS.forEach(([, key, v, tol]) => SCALES.forEach((sc) => {
  const target = v * sc;
  const band = 10 * tol * Math.max(sc, 1);
  lits.forEach((x) => {
    count(`${dir} literal comparisons`);
    if (Math.abs(x - target) <= band) findings.push(`[${dir} values] ${label} literal ${x} is within ten tolerances of ${key} x${sc}`);
  });
}));

// 1. INPUTS  and  4. NAMES
const SOURCES1 = [['digest.txt', DIGEST], ...GEN_TEXT, ['ekeneQiPack.json', PACK]];
SOURCES1.forEach(([label, text]) => {
  inputsIn(label, text, '1');
  count('4 files searched for names');
  const m = text.match(nameRe);
  if (m) findings.push(`[4 names] ${label} names the capstone case ${m[0]}`);
});

// 2. VALUES AS TEXT
FIELDS.forEach(([, key, v]) => renderings(v).forEach((s) => {
  count('2 renderings searched');
  if (DIGEST.includes(s)) findings.push(`[2 values] digest.txt carries ${key} as ${s}`);
}));

// 3. VALUES AS NUMBERS
const digestLits = literals(DIGEST.split('\n').filter((l) => !l.startsWith('#')).join('\n').replace(/(\d),(?=\d{3}(?!\d))/g, '$1'));
// The floor is 500 while the digest holds the Associate sections alone (911 literals at the foundation); raise it to 1000 once the Professional and Expert sections are in.
if (digestLits.length < 500) die(`only ${digestLits.length} literals in the digest; an empty or half-written digest clears everything`);
nearAnswer(digestLits, 'digest', '3');

// 5. SEPARATION
GEN_TEXT.forEach(([label, text]) => {
  count('5 files checked');
  const code = text.split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
  if (/qi_capstone|fields\.json|capstone-cases|qi_cases/.test(code)) findings.push(`[5 separation] ${label} reads the capstone side`);
});
count('5 files checked');
if (/digest\.txt|qi_dump/.test(CAPSTONE.split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n'))) findings.push('[5 separation] qi_capstone.mjs reads the digest side');

// 6. THE GOLDENS
const goldNums = [];
const walkN = (n) => { if (typeof n === 'number') goldNums.push(n); else if (Array.isArray(n)) n.forEach(walkN); else if (n && typeof n === 'object') Object.values(n).forEach(walkN); };
['test-data/qi', 'test-data/rockphysics'].forEach((d) => {
  const dir = path.join(ENG, d);
  if (!fs.existsSync(dir)) die(`no golden directory ${dir}`);
  fs.readdirSync(dir).filter((f) => f.endsWith('.json')).forEach((f) => walkN(JSON.parse(read(path.join(dir, f)))));
});
if (goldNums.length < 1000) die(`only ${goldNums.length} numbers walked out of the goldens`);
FIELDS.forEach(([, key, v, tol]) => goldNums.forEach((x) => {
  count('6 golden comparisons');
  if (Math.abs(x - v) <= 10 * tol) findings.push(`[6 goldens] golden number ${x} is within ten tolerances of ${key}`);
}));

// 7. SIBLINGS
let siblings = 0;
if (fs.existsSync(WAVES)) {
  fs.readdirSync(WAVES).filter((w) => w !== 'qi').forEach((w) => {
    const f = path.join(WAVES, w, 'fields.json');
    if (!fs.existsSync(f)) return;
    siblings += 1;
    JSON.parse(fs.readFileSync(f, 'utf8')).forEach(([, sk, sv]) => FIELDS.forEach(([, key, v, tol]) => {
      count('7 sibling comparisons');
      if (typeof sv === 'number' && Math.abs(sv - v) <= tol) findings.push(`[7 siblings] ${w}/${sk} = ${sv} sits within the tolerance of ${key}`);
    }));
  });
}
if (siblings < 10) die(`only ${siblings} sibling answer keys found under ${WAVES}`);

// 8. THE APP
const panelDir = path.join(REPO, 'src/components/course/panels/qi');
// gradedTolerance.js and gradedAnswerGuard.js are the guard's own
// infrastructure (they name the graded keys by design and no panel renders
// them); every other source in the directory is swept.
const GUARD_FILES = new Set(['gradedTolerance.js', 'gradedAnswerGuard.js']);
const APP = fs.readdirSync(panelDir).filter((f) => /\.(jsx?|mjs)$/.test(f) && !/\.test(kit)?\./.test(f) && !GUARD_FILES.has(f)).map((f) => path.join(panelDir, f));
const page = path.join(REPO, 'src/pages/apps/QiLearningPage.jsx');
if (fs.existsSync(page)) APP.push(page);
if (!APP.some((p) => p.endsWith('qiLab.js'))) die('the teaching lab qiLab.js is missing');
APP.forEach((p) => {
  const text = read(p);
  const label = path.basename(p);
  count('8 app sources');
  const m = text.match(nameRe);
  if (m) findings.push(`[8 app] ${label} names ${m[0]}`);
  FIELDS.forEach(([, key, v]) => renderings(v).forEach((s) => { if (text.includes(s)) findings.push(`[8 app] ${label} carries ${key} as ${s}`); }));
  inputsIn(label, text, '8');
});

// 9. THE BANKS
const banksDir = opt('--banks') || path.join(HERE, 'banks');
let bankTexts = 0;
const sweepFree = (rel, text, dir) => {
  const plain = text.replace(/(\d),(?=\d{3}(?!\d))/g, '$1');
  const m = plain.match(nameRe);
  if (m) findings.push(`[${dir}] ${rel} names the capstone case ${m[0]}`);
  inputsIn(rel, plain, dir);
  FIELDS.forEach(([, key, v]) => renderings(v).forEach((s) => { count(`${dir} renderings searched`); if (plain.includes(s)) findings.push(`[${dir}] ${rel} carries ${key} as ${s}`); }));
  const lits = literals(plain);
  FIELDS.forEach(([, key, v, tol]) => SCALES.forEach((sc) => lits.forEach((x) => {
    count(`${dir} literal comparisons`);
    if (Math.abs(x - v * sc) <= 10 * tol * Math.max(sc, 1)) findings.push(`[${dir} numeric] ${rel} literal ${x} is within ten tolerances of ${key} x${sc}`);
  })));
  return lits.length;
};
if (has('--no-banks')) {
  console.log('  direction 9: --no-banks DECLARED. This run says NOTHING about any bank.');
} else if (!fs.existsSync(banksDir)) {
  die(`no banks directory at ${banksDir}; pass --no-banks to declare that this run does not sweep banks`);
} else {
  fs.readdirSync(banksDir).filter((f) => f.endsWith('.json')).sort().forEach((f) => {
    const qs = JSON.parse(fs.readFileSync(path.join(banksDir, f), 'utf8'));
    (Array.isArray(qs) ? qs : qs.questions || []).forEach((q, i) => {
      [q.prompt, q.explanation, ...(q.options || [])].filter((t) => typeof t === 'string').forEach((t) => { bankTexts += 1; sweepFree(`${f}#${i}`, t, '9 banks'); });
    });
  });
  if (bankTexts === 0) die(`the banks directory ${banksDir} holds no readable question text`);
}

// 10. THE LESSONS, THE BRIEFS AND wave.json
const lessonsDir = opt('--lessons') || path.join(REPO, 'src/content/courses/qi');
const lessonFiles = [];
let lessonLits = 0;
let plantedIn = null;
if (has('--no-lessons')) {
  console.log('  direction 10: --no-lessons DECLARED. This run says NOTHING about any lesson.');
} else {
  if (!fs.existsSync(lessonsDir)) die(`no lessons directory at ${lessonsDir}`);
  const walkMd = (d) => fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkMd(p); else if (e.name.endsWith('.md') || e.name === 'manifest.json') lessonFiles.push(p);
  });
  walkMd(lessonsDir);
  if (!lessonFiles.some((p) => p.endsWith('.md'))) die(`the lessons directory ${lessonsDir} holds no .md file`);
  lessonFiles.forEach((p, fi) => {
    let text = fs.readFileSync(p, 'utf8');
    const rel = path.relative(lessonsDir, p);
    if (fi === 0 && has('--plant-lesson')) {
      const F = FIELDS[2];
      text += `\nA planted near miss: ${(F[2] - 3 * F[3]).toFixed(7)}.\n`;
      plantedIn = rel;
    }
    count('10 lesson files');
    lessonLits += sweepFree(rel, text, '10 lessons');
  });
}
const BRIEFS = fs.readdirSync(HERE).filter((f) => f.endsWith('.md')).sort().concat(['wave.json']);
if (BRIEFS.length < 2) die('no brief (*.md) in the wave directory');
BRIEFS.forEach((b) => {
  let text = read(path.join(HERE, b));
  if (b === 'wave.json') {
    FIELDS.forEach(([, key]) => { text = text.split(key).join('KEY'); });
    text = text.replace(/\b[0-9a-f]{12,64}\b/g, 'HEXDIGEST');
  }
  count('10 briefs');
  sweepFree(b, text, '10 briefs');
});

console.log(`gate_capstone_leak: ${CASEFILES.length} case file(s) (${nameList.join(', ')}), ${runs.length} condition runs, ${depths.length} stated depths and conditions, `
  + `${rowPairs.length} case log rows (Vp and Vs together), ${FIELDS.length} graded values, ${digestLits.length} digest literals, ${goldNums.length} golden numbers, `
  + `${siblings} sibling answer keys, ${APP.length} app sources, ${bankTexts} bank texts, ${lessonFiles.length} lesson files (${lessonLits} literals), ${BRIEFS.length} briefs`);
Object.entries(counts).sort().forEach(([k, n]) => console.log(`  direction ${k}: ${n}`));
console.log(`  FINDINGS: ${findings.length}`);
findings.slice(0, 40).forEach((f) => console.log(`   ${f}`));
const planted = ['--plant-value', '--plant-input', '--plant-name', '--plant-lesson'].filter(has);
if (planted.length) {
  const want = { '--plant-value': '[2 values]', '--plant-input': '[1 inputs]', '--plant-name': '[4 names]', '--plant-lesson': '[10 lessons numeric]' }[planted[0]];
  const caught = planted[0] === '--plant-lesson'
    ? plantedIn !== null && findings.some((f) => f.startsWith(`${want} ${plantedIn} `))
    : findings.some((f) => f.startsWith(want));
  console.log(`  NEGATIVE CONTROL ${planted[0]}: expected a ${want} finding, ${caught ? 'caught' : 'NOT CAUGHT'}`);
  process.exit(caught ? 1 : 2);
}
process.exit(findings.length ? 1 : 0);
