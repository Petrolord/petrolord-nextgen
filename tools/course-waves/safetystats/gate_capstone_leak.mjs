// GATE: nothing the H1 capstone grades, no input it is set on and no workplace
// it names reaches the digest, the digest generator, the teaching streams, the
// vendored golden, a sibling wave's answer key, the NextGen teaching lab and
// panels, or (once they exist) the banks.
//
// This is the golden/digest COLLISION SWEEP and the capstone LEAK sweep in one
// gate, adapted from FC9's gate_capstone_leak.py and gate_collisions.mjs.
//
// DIRECTIONS, every one counted and printed:
//   1. INPUTS. Every capstone hours figure and every capstone count SERIES must
//      be absent from digest.txt, h1_dump.mjs and h1_fields.mjs, and no hours
//      figure may equal a number anywhere in the vendored golden.
//   2. VALUES, AS TEXT. Every graded value at four renderings (full double,
//      twelve and nine significant digits, the six decimals the course prints)
//      must be absent from digest.txt.
//   3. VALUES, AS NUMBERS. No numeric literal in digest.txt may sit within TEN
//      tolerances of a graded value, in any of five unit shiftings (x1, x1e3,
//      x1e-3, x1e2, x1e-2). The grader's tolerance is ABSOLUTE:
//      public.academy_submit_capstone grades abs(got - expected) <= tol.
//   4. NAMES. No capstone workplace name (OKRIKA, BONNY, FORCADOS) anywhere in
//      the digest, the generator or the teaching streams.
//   5. NEITHER FILE READS THE OTHER. The digest side never names
//      h1_capstone.mjs or fields.json; the capstone never names h1_dump.mjs,
//      h1_fields.mjs or digest.txt.
//   6. THE GOLDEN. No graded value within ten tolerances of any golden number.
//   7. SIBLINGS. No graded value within its own tolerance of any sibling wave's
//      graded value (tools/course-waves/*/fields.json in the NextGen repo).
//   8. THE APP. The lab, the three panels, their shared bits and the learning
//      page carry no graded value at four renderings, no capstone name and no
//      capstone hours figure.
//   9. THE BANKS. Every prompt, option and explanation under --banks (default
//      <wave>/banks). A missing banks directory is a REFUSAL unless the run
//      declares --no-banks, which the foundation phase does because no bank
//      exists yet.
//
//   node gate_capstone_leak.mjs [--no-banks] [--banks DIR]
//   node gate_capstone_leak.mjs --no-banks --plant-value | --plant-input | --plant-name
//      THE NEGATIVE CONTROLS: each plants one leak in the digest text in memory
//      and must exit 1 naming the direction that caught it.
//
// Exit 0 clean, 1 a leak, 2 could not run.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.H1_WAVE_DIR || '/root/hse-wip-safetystats';
const REPO = process.env.H1_REPO || '/root/wt-h1-nextgen';
const ENG = process.env.H1_ENGINES || path.join(REPO, 'packages/engines');
const WAVES = process.env.H1_WAVES || path.join(REPO, 'tools/course-waves');
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const opt = (f) => { const i = args.indexOf(f); return i === -1 ? null : args[i + 1]; };

const die = (m) => { console.log(`gate_capstone_leak REFUSES: ${m}`); process.exit(2); };
const read = (p) => { if (!fs.existsSync(p)) die(`missing ${p}`); return fs.readFileSync(p, 'utf8'); };

let DIGEST = read(path.join(HERE, 'digest.txt'));
const DUMP = read(path.join(HERE, 'h1_dump.mjs'));
const STREAMS = read(path.join(HERE, 'h1_fields.mjs'));
const CAPSTONE = read(path.join(HERE, 'h1_capstone.mjs'));
const FIELDS = JSON.parse(read(path.join(HERE, 'fields.json')));
if (FIELDS.length !== 18) die(`fields.json carries ${FIELDS.length} fields`);
const INPUTS = JSON.parse(execFileSync('node', [path.join(HERE, 'h1_capstone.mjs'), '--inputs'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
const NAMES = Object.keys(INPUTS);
if (NAMES.join() !== 'OKRIKA,BONNY,FORCADOS') die(`unexpected capstone scenarios ${NAMES.join()}`);

/* ---- the negative controls, planted in memory ---- */
if (has('--plant-value')) DIGEST += `\n| planted | ${FIELDS[3][2].toFixed(6)} |\n`;
if (has('--plant-input')) DIGEST += `\nThe planted crew worked ${INPUTS.BONNY.alphaHours} hours.\n`;
if (has('--plant-name')) DIGEST += '\nA planted line naming Forcados.\n';

const findings = [];
const counts = {};
const count = (k, n = 1) => { counts[k] = (counts[k] || 0) + n; };

/* ---- the capstone inputs ---- */
const hoursFigures = [];
const series = [];
Object.entries(INPUTS).forEach(([name, o]) => {
  Object.entries(o).forEach(([k, v]) => {
    if (Array.isArray(v)) series.push({ name, k, v });
    else if (typeof v === 'number' && Number.isInteger(v) && v >= 1000) hoursFigures.push({ name, k, v });
  });
  (o.monthlyHours || []).forEach((v, i) => hoursFigures.push({ name, k: `monthlyHours[${i}]`, v }));
});
if (hoursFigures.length < 25) die(`only ${hoursFigures.length} capstone hours figures parsed`);

const NUM = /(?<![\w.])-?\d+(?:\.\d+)?(?:e[-+]?\d+)?(?![\w])/g;
const literals = (text) => [...text.matchAll(NUM)].map((m) => Number(m[0])).filter((x) => Number.isFinite(x));

// 1. INPUTS
const hasWord = (text, s) => new RegExp(`(?<![\\d.])${s.replace(/[.]/g, '\\.')}(?![\\d])`).test(text);
[['digest.txt', DIGEST], ['h1_dump.mjs', DUMP], ['h1_fields.mjs', STREAMS]].forEach(([label, text]) => {
  hoursFigures.forEach(({ name, k, v }) => {
    count('1 inputs checked');
    if (hasWord(text, String(v))) findings.push(`[1 inputs] ${label} carries ${name}.${k} = ${v}`);
  });
  series.forEach(({ name, k, v }) => {
    count('1 inputs checked');
    const s = v.join(', ');
    if (text.includes(s) || text.includes(v.join(','))) findings.push(`[1 inputs] ${label} carries the ${name}.${k} series`);
  });
});
const GOLD = JSON.parse(read(path.join(ENG, 'test-data/hse/goldens/safetyStats_cases.json')));
const goldNums = [];
const walk = (n) => {
  if (typeof n === 'number') goldNums.push(n);
  else if (Array.isArray(n)) n.forEach(walk);
  else if (n && typeof n === 'object') Object.values(n).forEach(walk);
};
walk(GOLD);
if (goldNums.length < 1000) die(`only ${goldNums.length} numbers walked out of the golden`);
hoursFigures.forEach(({ name, k, v }) => {
  count('1 inputs against the golden');
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
const nameRe = /\b(okrika|bonny|forcados)\b/i;
[['digest.txt', DIGEST], ['h1_dump.mjs', DUMP], ['h1_fields.mjs', STREAMS]].forEach(([label, text]) => {
  count('4 files searched for names');
  const m = text.match(nameRe);
  if (m) findings.push(`[4 names] ${label} names the capstone workplace ${m[0]}`);
});

// 5. NEITHER FILE READS THE OTHER
[['h1_dump.mjs', DUMP, /h1_capstone|fields\.json/], ['h1_fields.mjs', STREAMS, /import[^\n]*h1_capstone|fields\.json/],
  ['h1_capstone.mjs', CAPSTONE, /h1_dump|h1_fields|digest\.txt/]].forEach(([label, text, re]) => {
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
  fs.readdirSync(WAVES).filter((w) => w !== 'safetystats').forEach((w) => {
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
const APP = ['safetystatsLab.js', 'RatesExplorer.jsx', 'IntervalsExplorer.jsx', 'UChartExplorer.jsx', 'panelBits.jsx']
  .map((f) => path.join(REPO, 'src/components/course/panels/safetystats', f))
  .concat([path.join(REPO, 'src/pages/apps/SafetyStatsLearningPage.jsx')]);
APP.forEach((p) => {
  const text = read(p);
  count('8 app sources');
  const m = text.match(nameRe);
  if (m) findings.push(`[8 app] ${path.basename(p)} names ${m[0]}`);
  FIELDS.forEach(([, key, v]) => renderings(v).forEach((s) => { if (text.includes(s)) findings.push(`[8 app] ${path.basename(p)} carries ${key} as ${s}`); }));
  hoursFigures.forEach(({ name, k, v }) => { if (hasWord(text, String(v))) findings.push(`[8 app] ${path.basename(p)} carries ${name}.${k} = ${v}`); });
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
        hoursFigures.forEach(({ name, k, v }) => { if (hasWord(t, String(v))) findings.push(`[9 banks] ${f}#${i} carries ${name}.${k}`); });
      });
    });
  });
  if (bankTexts === 0) die(`the banks directory ${banksDir} holds no readable question text`);
}

console.log(`gate_capstone_leak: ${hoursFigures.length} capstone hours figures, ${series.length} count series, `
  + `${FIELDS.length} graded values, ${digestLits.length} digest literals, ${goldNums.length} golden numbers, `
  + `${siblings} sibling answer keys, ${APP.length} app sources, ${bankTexts} bank texts`);
Object.entries(counts).sort().forEach(([k, n]) => console.log(`  direction ${k}: ${n}`));
console.log(`  FINDINGS: ${findings.length}`);
findings.slice(0, 40).forEach((f) => console.log(`   ${f}`));
const planted = ['--plant-value', '--plant-input', '--plant-name'].filter(has);
if (planted.length) {
  const want = { '--plant-value': '[2 values]', '--plant-input': '[1 inputs]', '--plant-name': '[4 names]' }[planted[0]];
  const caught = findings.some((f) => f.startsWith(want));
  console.log(`  NEGATIVE CONTROL ${planted[0]}: expected a ${want} finding, ${caught ? 'caught' : 'NOT CAUGHT'}`);
  process.exit(caught ? 1 : 2);
}
process.exit(findings.length ? 1 : 0);
