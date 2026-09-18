// GATE: every CLAIM wave.json makes about this wave is checked against the file
// that settles it.
//
// wave.json is the wave's own description of itself and nothing read it. A
// stale line in it is a line a later agent will act on: the digest md5, the line
// count, the section count, the field list, the vendoring statement and the
// panel list are all claims, and each one has a file that settles it.
//
// IT ALSO ASSERTS THE MODE OF build_digest.sh. A sibling wave shipped a build
// script with mode 644 while its reproducibility gate invoked it as
// ./build_digest.sh, so that gate had never once run and nobody knew. A
// reproducibility check that cannot execute its own subject reports nothing.
//
//   node gate_wavejson.mjs
// Exit 0 clean, 1 on a stale claim, 2 if it cannot run.
import fs from 'node:fs';
import crypto from 'node:crypto';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.FC8_WAVE_DIR || '/root/fc-wip-metering';
const read = (f) => fs.readFileSync(`${HERE}/${f}`, 'utf8');
let WAVE;
try { WAVE = JSON.parse(read('wave.json')); } catch (e) { console.log(`REFUSED: wave.json is not readable JSON (${e.message})`); process.exit(2); }
const DIGEST = read('digest.txt');
const FIELDS = JSON.parse(read('fields.json'));
const PRECISION = JSON.parse(read('precision.json'));

const checks = [];
const check = (claim, cond, evidence) => checks.push({ claim, pass: !!cond, evidence: String(evidence) });

check('slug is metering', WAVE.slug === 'metering', WAVE.slug);
check('prefix is fc8', WAVE.prefix === 'fc8', WAVE.prefix);
check('pathOrder is 46', WAVE.pathOrder === 46, WAVE.pathOrder);
check('module is facilities', WAVE.module === 'facilities', WAVE.module);
check('prerequisite is null', WAVE.prerequisite === null, String(WAVE.prerequisite));
check('the repo it names exists', fs.existsSync(WAVE.repo), WAVE.repo);
check('the branch it names is the branch that repo is on',
  execFileSync('git', ['-C', WAVE.repo, 'rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim() === WAVE.branch,
  WAVE.branch);

/* The digest claims. */
const lines = DIGEST.replace(/\n$/, '').split('\n').length;
const sections = DIGEST.split('\n').filter((l) => l.startsWith('# SECTION')).length;
check('the digest line count', WAVE.digest.lines === lines, `${WAVE.digest.lines} claimed, ${lines} counted`);
check('the digest section count', WAVE.digest.sections === sections, `${WAVE.digest.sections} claimed, ${sections} counted`);
check('the digest md5', WAVE.digest.md5 === crypto.createHash('md5').update(DIGEST).digest('hex'),
  WAVE.digest.md5);
check('the digest sha256', WAVE.digest.sha256 === crypto.createHash('sha256').update(DIGEST).digest('hex'),
  WAVE.digest.sha256);
check('the sections are numbered 1 to N with no gap',
  DIGEST.split('\n').filter((l) => l.startsWith('# SECTION'))
    .map((l) => Number(/^# SECTION (\d+):/.exec(l)[1]))
    .every((v, i) => v === i + 1), `${sections} sections`);

/* THE BUILD SCRIPT MUST BE EXECUTABLE. */
const mode = (fs.statSync(`${HERE}/build_digest.sh`).mode & 0o777).toString(8);
check('build_digest.sh is executable, which a sibling wave shipped without',
  /[1357]/.test(mode[0]) || /[1357]/.test(mode), `mode ${mode}`);
check('build_digest.sh pins TZ and LC_ALL, so the digest cannot depend on where it is built',
  /TZ=UTC/.test(read('build_digest.sh')) && /LC_ALL=C/.test(read('build_digest.sh')), 'both pinned');

/* The field claims. */
check('the field count', WAVE.fields.count === FIELDS.length, `${WAVE.fields.count} claimed, ${FIELDS.length} counted`);
check('the field keys, in order', JSON.stringify(WAVE.fields.keys) === JSON.stringify(FIELDS.map((f) => f[1])),
  `${WAVE.fields.keys.length} keys`);
check('six graded fields in each of three tiers',
  Object.values(FIELDS.reduce((a, f) => ({ ...a, [f[0]]: (a[f[0]] || 0) + 1 }), {})).every((n) => n === 6),
  'six a tier');
check('the tolerance source it names exists',
  fs.existsSync(`${WAVE.repo}/${WAVE.fields.toleranceSource}`), WAVE.fields.toleranceSource);
check('precision.json classifies every graded field',
  FIELDS.every((f) => Object.values(PRECISION).some((p) => new RegExp(p.match).test(f[1]))),
  `${Object.keys(PRECISION).length} classes`);
check('every tolerance in fields.json is at least half a unit in the last place of its own class',
  FIELDS.every((f) => {
    const cls = Object.entries(PRECISION).find(([, p]) => new RegExp(p.match).test(f[1]));
    return cls && f[3] >= Number(`5e-${cls[1].decimals + 1}`) - 1e-30;
  }), 'every one');

/* The vendoring claim. */
check('the vendoring statement names the engines commit it was taken from',
  /9874d5834de552a08ed7aa16e0fcd12438fefdb1/.test(WAVE.enginesVendoredAt), 'named');
check('the vendoring statement says how the closure was proved',
  /WALKED/.test(WAVE.enginesVendoredAt) && /THREE independent ways/i.test(WAVE.enginesVendoredAt),
  'walked and proved three ways');
check('the closure record exists and covers ten paths',
  fs.existsSync(`${HERE}/vendor/closure.json`)
  && JSON.parse(read('vendor/closure.json')).closure.length === 10,
  'vendor/closure.json');
check('every closure path is recorded identical',
  JSON.parse(read('vendor/closure.json')).closure.every((r) => r.identical === true), 'all ten');
check('each engine it names is vendored where it says',
  WAVE.engines.every((e) => fs.existsSync(`${WAVE.repo}/packages/engines/${e}`)), WAVE.engines.join(', '));
check('each golden it names is vendored where it says',
  WAVE.goldens.every((g) => fs.existsSync(`${WAVE.repo}/packages/engines/test-data/${g}`)), WAVE.goldens.join(', '));

/* The plan claims. */
check('the scaffolded course carries 78 lesson files',
  fs.existsSync(`${WAVE.repo}/src/content/courses/${WAVE.slug}`)
  && execFileSync('bash', ['-c', `find ${WAVE.repo}/src/content/courses/${WAVE.slug} -name '*.md' | wc -l`], { encoding: 'utf8' }).trim() === '78',
  '78 lesson files');
check('the plan claims no migration has been applied',
  /NONE WRITTEN AND NONE APPLIED/.test(WAVE.plan.migrationsState), WAVE.plan.migrationsState);
check('the shipped panel file it names exists',
  WAVE.plan.panels.shipped.every((p) => fs.existsSync(`${WAVE.repo}/${p}`)), WAVE.plan.panels.shipped.join(', '));
check('every panel id it lists is one structure.py carries',
  (() => {
    const st = execFileSync('python3', [`${HERE}/structure.py`], { encoding: 'utf8' });
    return WAVE.plan.panels.ids.every((id) => st.includes(id));
  })(), WAVE.plan.panels.ids.join(', '));
check('the lesson length claim says headings are counted',
  /INCLUDING\s+EVERY HEADING/.test(WAVE.plan.lessonLength.measure), 'stated');

const stale = checks.filter((c) => !c.pass);
console.log(`gate_wavejson: ${checks.length} claim(s) in wave.json checked against the file that settles each`);
checks.forEach((c) => console.log(`  ${c.pass ? 'ok   ' : 'STALE'} ${c.claim}  [${c.evidence.slice(0, 80)}]`));
console.log(`  STALE CLAIMS: ${stale.length}`);
if (checks.length < 20) { console.log('  GATE REFUSES: it checked too few claims to be a check'); process.exit(2); }
process.exit(stale.length ? 1 : 0);
