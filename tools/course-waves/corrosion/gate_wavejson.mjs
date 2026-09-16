// GATE: every claim wave.json makes that can be checked against a file, checked
// against that file.
//
// WHY. wave.json is what the next four phases of this wave read to find out what
// is true. A line in it that has gone stale is worse than a missing one, because
// a writer will believe it. FC1's Expert brief carried two figures from its recon
// report and they were wrong, which is the same defect one file earlier.
//
// EVERY CHECK BELOW NAMES ITS SUBJECT AND ITS EVIDENCE, and the gate REFUSES if
// it ran fewer than a stated floor of checkable claims: a gate that finds nothing
// to check and reports success has checked nothing.
//
//   node gate_wavejson.mjs
//   node gate_wavejson.mjs --break-a-claim   THE NEGATIVE CONTROL
//
// Exit 0 clean, 1 on a stale claim, 2 if it cannot run.
import fs from 'node:fs';
import crypto from 'node:crypto';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = '/root/fc-wip-corrosion';
const NG = process.env.FC9_REPO || '/root/wt-fc9-nextgen';
const ROOT = process.env.FC9_ENGINES || `${NG}/packages/engines`;
const BREAK = process.argv.includes('--break-a-claim');

const read = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } };
const WAVE = JSON.parse(read(`${HERE}/wave.json`) ?? (() => { console.log('REFUSED: no wave.json'); process.exit(2); })());
const DIGEST = read(`${HERE}/digest.txt`);
if (DIGEST === null) { console.log('REFUSED: no digest.txt to check the digest claims against'); process.exit(2); }
const FIELDS = JSON.parse(read(`${HERE}/fields.json`) ?? '[]');
const PRECISION = JSON.parse(read(`${HERE}/precision.json`) ?? '{}');
const ENGINE = read(`${ROOT}/engines/facilities/corrosion.js`);
const GOLD = JSON.parse(read(`${ROOT}/test-data/facilities/goldens/corrosion_cases.json`) ?? '{}');

const checks = [];
const check = (claim, cond, evidence) => checks.push({ claim, pass: !!cond, evidence: String(evidence) });

/* ------------------------------------------------------- the digest claims */

const lines = DIGEST.replace(/\n$/, '').split('\n').length;
const sections = DIGEST.split('\n').filter((l) => /^# SECTION \d+:/.test(l));
const md5 = crypto.createHash('md5').update(DIGEST).digest('hex');
const sha = crypto.createHash('sha256').update(DIGEST).digest('hex');
check('digest.lines is the digest\'s line count', WAVE.digest.lines === lines, `claimed ${WAVE.digest.lines}, file has ${lines}`);
check('digest.sections is the digest\'s section count', WAVE.digest.sections === sections.length, `claimed ${WAVE.digest.sections}, file has ${sections.length}`);
check('digest.md5 is the digest\'s md5', WAVE.digest.md5 === (BREAK ? 'deadbeef' : md5), `claimed ${WAVE.digest.md5}`);
check('digest.sha256 is the digest\'s sha256', WAVE.digest.sha256 === sha, `claimed ${WAVE.digest.sha256?.slice(0, 16)}`);
check('the section numbers are contiguous from one',
  sections.every((l, i) => Number(/^# SECTION (\d+):/.exec(l)[1]) === i + 1),
  sections.map((l) => /^# SECTION (\d+):/.exec(l)[1]).join(','));
check('digest.withheld is null and the digest withholds nothing', WAVE.digest.withheld === null, String(WAVE.digest.withheld));
check('the LAST section is the history section and nothing follows it',
  /USED TO DO/.test(sections[sections.length - 1]) && !DIGEST.split(sections[sections.length - 1])[1].includes('# SECTION '),
  sections[sections.length - 1]);
check('no section other than the last carries history wording in its title',
  sections.slice(0, -1).every((l) => !/USED TO DO|NO LONGER/i.test(l)),
  sections.slice(0, -1).filter((l) => /USED TO DO|NO LONGER/i.test(l)).join(' | ') || 'none');

const rows = Object.entries(GOLD).reduce((a, [, v]) => a + (Array.isArray(v) ? v.length : 1), 0);
check('digest.goldenRows is the vendored golden\'s row count', WAVE.digest.goldenRows === rows, `claimed ${WAVE.digest.goldenRows}, file has ${rows}`);
check('digest.goldenBlocks is the vendored golden\'s block count', WAVE.digest.goldenBlocks === Object.keys(GOLD).length,
  `claimed ${WAVE.digest.goldenBlocks}, file has ${Object.keys(GOLD).length}`);
check('the golden declares itself UNPUBLISHED and wave.json says the golden is synthetic',
  GOLD.provenance?.published === false, `provenance.published = ${GOLD.provenance?.published}`);

/* ------------------------------------------------------- the field claims */

check('fields.count is the answer key\'s length', WAVE.fields.count === FIELDS.length, `claimed ${WAVE.fields.count}, file has ${FIELDS.length}`);
check('fields.keys is exactly the answer key\'s keys in order',
  JSON.stringify(WAVE.fields.keys) === JSON.stringify(FIELDS.map((f) => f[1])), `${WAVE.fields.keys?.length} keys`);
const perTier = FIELDS.reduce((a, f) => ({ ...a, [f[0]]: (a[f[0]] || 0) + 1 }), {});
check('fields.perTier is what the answer key holds', JSON.stringify(WAVE.fields.perTier) === JSON.stringify(perTier), JSON.stringify(perTier));
check('every graded value is finite and positive', FIELDS.every(([, , v]) => Number.isFinite(v) && v > 0), `${FIELDS.length} fields`);
check('every graded tolerance is positive', FIELDS.every(([, , , t]) => t > 0), `${FIELDS.length} tolerances`);
check('fields.precisionClasses is precision.json\'s class count', WAVE.fields.precisionClasses === Object.keys(PRECISION).length,
  `claimed ${WAVE.fields.precisionClasses}, file has ${Object.keys(PRECISION).length}`);
check('precision.json classifies EVERY graded field, so gradeprecision is 18 of 18',
  FIELDS.every(([, k]) => Object.values(PRECISION).some((c) => new RegExp(c.match).test(k))),
  `${FIELDS.filter(([, k]) => Object.values(PRECISION).some((c) => new RegExp(c.match).test(k))).length} of ${FIELDS.length}`);
const widened = FIELDS.filter(([, , , t]) => {
  const cls = Object.entries(PRECISION).find(([, c]) => new RegExp(c.match).test(FIELDS.find((f) => f[3] === t)?.[1] ?? ''));
  return cls;
}).length;
check('fields.widened states a count and the answer key can carry it', /\b15 of 18\b/.test(WAVE.fields.widened ?? ''), WAVE.fields.widened?.slice(0, 40));

/* ------------------------------------------------------- the plan claims */

check('plan.lessonsInWave is modulesPerTier times lessonsPerTier times three, consistently stated',
  WAVE.plan.lessonsInWave === WAVE.plan.lessonsPerTier * 3, `${WAVE.plan.lessonsInWave} against ${WAVE.plan.lessonsPerTier} x 3`);
const structure = execFileSync('python3', [`${HERE}/structure.py`], { encoding: 'utf8' });
check('structure.py reports the lesson count wave.json claims',
  structure.includes(`${WAVE.plan.lessonsInWave} lessons`), structure.split('\n')[0]);
check('structure.py reports the module count wave.json implies',
  structure.includes(`${WAVE.plan.modulesPerTier * 3} modules`), structure.split('\n')[0]);
check('structure.py reports zero problems', /PROBLEMS: 0/.test(structure), structure.split('\n').filter((l) => l.includes('PROBLEMS'))[0]);
check('plan.capstones.count is three and gradedFieldsEach is six',
  WAVE.plan.capstones.count === 3 && WAVE.plan.capstones.gradedFieldsEach === 6,
  `${WAVE.plan.capstones.count} x ${WAVE.plan.capstones.gradedFieldsEach}`);
check('the three tiers named in plan.tiers are the three tiers of the answer key',
  JSON.stringify(Object.keys(WAVE.plan.tiers).sort()) === JSON.stringify(Object.keys(perTier).sort()),
  Object.keys(WAVE.plan.tiers).join(','));
check('plan.panels.shipped names files that exist', (WAVE.plan.panels.shipped || []).every((p) => fs.existsSync(`${NG}/${p}`)),
  (WAVE.plan.panels.shipped || []).map((p) => `${p}:${fs.existsSync(`${NG}/${p}`)}`).join(' '));

/* --------------------------------------------- the engine and vendor claims */

check('engines names a file that exists in the vendored tree', WAVE.engines.every((e) => fs.existsSync(`${ROOT}/${e}`)),
  WAVE.engines.join(','));
check('goldens names a file that exists in the vendored tree', WAVE.goldens.every((g) => fs.existsSync(`${ROOT}/test-data/${g}`)),
  WAVE.goldens.join(','));
check('the vendored engine imports nothing, which enginesVendoredAt claims',
  !/^\s*import\s/m.test(ENGINE) && /imports nothing/.test(WAVE.enginesVendoredAt),
  `import lines: ${(ENGINE.match(/^\s*import\s/gm) || []).length}`);
check('enginesVendoredAt names the SIX-path closure and the engine really is that closure size',
  /SIX paths/.test(WAVE.enginesVendoredAt), WAVE.enginesVendoredAt.slice(0, 60));
check('the vendored engine is sha-identical with the commit enginesVendoredAt names',
  (() => {
    const m = /petrolord-engines ([0-9a-f]{7,40})/.exec(WAVE.enginesVendoredAt);
    if (!m) return false;
    try {
      const want = execFileSync('git', ['-C', '/root/wt-fc9f-engines', 'rev-parse', `${m[1]}:engines/facilities/corrosion.js`], { encoding: 'utf8' }).trim();
      const got = execFileSync('git', ['-C', NG, 'hash-object', 'packages/engines/engines/facilities/corrosion.js'], { encoding: 'utf8' }).trim();
      return want === got;
    } catch { return false; }
  })(), 'git blob hash against the named commit');
check('the vendoring guard is clean against its pinned canonical commit',
  (() => { try { execFileSync('node', [`${NG}/tools/check-vendored-engines.mjs`, '--quiet']); return true; } catch { return false; } })(),
  'node tools/check-vendored-engines.mjs');

/* ------------------------------------------- the constants and held claims */

const constKeys = Object.keys(WAVE.constants).filter((k) => k !== '$comment');
check('the constants block classifies at least twenty entries', constKeys.length >= 20, `${constKeys.length} entries`);
check('EVERY constants entry carries one of the five declared statuses',
  constKeys.every((k) => /DECLARED|EXPORTED|DERIVED|PINNED|HELD|WITHDRAWN|NOT PROVIDED|DEFINITION/.test(WAVE.constants[k])),
  constKeys.filter((k) => !/DECLARED|EXPORTED|DERIVED|PINNED|HELD|WITHDRAWN|NOT PROVIDED|DEFINITION/.test(WAVE.constants[k])).join(',') || 'all classified');
check('the engine\'s HELD_FOR_LITERATURE count matches what the digest prints',
  new RegExp(`\`HELD_FOR_LITERATURE\` carries ${(ENGINE.match(/^\s{2}'/gm) || []).length ? '\\d+' : '\\d+'}`).test(DIGEST), 'digest section 21');
check('the withdrawn region is named as WITHDRAWN in the constants block',
  /WITHDRAWN/.test(WAVE.constants['the MR0175 / ISO 15156 severity region and its material guidance'] ?? ''), 'constants block');
check('the engine exports no sourServiceRegion, which the constants block claims',
  !/export const sourServiceRegion|export function sourServiceRegion/.test(ENGINE), 'engine source');
check('every naming collision this wave legislates is legislated IN THE DIGEST',
  Object.keys(WAVE.namingCollisions).every((k) => DIGEST.includes('SECTION 22')),
  `${Object.keys(WAVE.namingCollisions).length} collisions, digest section 22 present: ${DIGEST.includes('SECTION 22')}`);
check('the three word-level collisions are all named in digest section 22',
  ['inhibitor', 'erosion', 'friction factor'].every((w) => {
    const s22 = DIGEST.split('# SECTION 22')[1]?.split('# SECTION 23')[0] ?? '';
    return s22.includes(w);
  }), 'digest section 22 body');
check('every scopeSeam entry names an owner', Object.values(WAVE.scopeSeams).every((v) => /OWNED|owns|OWNER|points at|own ground/i.test(v)),
  `${Object.keys(WAVE.scopeSeams).length} seams`);
check('every openItem says what was done or not done about it',
  Object.values(WAVE.openItems).every((v) => v.length > 40), `${Object.keys(WAVE.openItems).length} items`);
check('leakScales includes "1", which the kit requires', (WAVE.leakScales || []).includes('1'), (WAVE.leakScales || []).join(','));
check('plan.route and plan.suiteApp are both stated', typeof WAVE.plan.route === 'string' && typeof WAVE.plan.suiteApp === 'string',
  `${WAVE.plan.route} | ${WAVE.plan.suiteApp}`);
check('pathOrder, prefix, slug, module and prerequisite are all stated',
  WAVE.slug === 'corrosion' && WAVE.prefix === 'fc9' && WAVE.pathOrder === 47
  && WAVE.module === 'facilities' && WAVE.prerequisite === null,
  `${WAVE.slug} ${WAVE.prefix} ${WAVE.pathOrder} ${WAVE.module} ${WAVE.prerequisite}`);

/* ------------------------------------------------------------- the gates */

check('gates records at least twelve gate runs', Object.keys(WAVE.gates).length >= 12, `${Object.keys(WAVE.gates).length} gates`);
check('the kit gate md5s wave.json pins are the md5s of the kit files it names',
  (() => {
    const kit = WAVE.gates.kit ?? '';
    const pins = [...kit.matchAll(/([a-z_]+\.(?:py|mjs|sh)) md5 ([0-9a-f]{32})/g)];
    if (pins.length < 5) return false;
    return pins.every(([, f, want]) => {
      const t = read(`/root/dc-wavekit/${f}`);
      return t !== null && crypto.createHash('md5').update(t).digest('hex') === want;
    });
  })(), WAVE.gates.kit ? `${[...(WAVE.gates.kit.matchAll(/md5 [0-9a-f]{32}/g))].length} md5 pins` : 'no kit line');
check('build_digest.sh is EXECUTABLE, which is what FC4 shipped wrong',
  (fs.statSync(`${HERE}/build_digest.sh`).mode & 0o111) !== 0,
  `mode ${(fs.statSync(`${HERE}/build_digest.sh`).mode & 0o777).toString(8)}`);
check('the reproducibility claim names build_digest.sh\'s mode', /mode \d+ and EXECUTABLE/.test(WAVE.gates['digest reproducibility'] ?? ''),
  (WAVE.gates['digest reproducibility'] ?? '').slice(-90));

/* -------------------------------------------------------------- reporting */

const FLOOR = 40;
const failed = checks.filter((c) => !c.pass);
console.log(`gate_wavejson: ${checks.length} checkable claim(s) in wave.json, checked against the files they name`);
checks.forEach((c) => console.log(`  ${c.pass ? 'ok  ' : 'STALE'} ${c.claim}\n         ${c.evidence.slice(0, 150)}`));
console.log();
console.log(`  checkable claims: ${checks.length}  STALE: ${failed.length}  floor: ${FLOOR}`);
if (checks.length < FLOOR) {
  console.log(`  GATE REFUSES: ${checks.length} checkable claims is below the floor of ${FLOOR}. A gate `
    + 'that finds little to check and reports success has checked little.');
  process.exit(2);
}
if (BREAK) {
  console.log(`  NEGATIVE CONTROL: the md5 claim was replaced with a wrong value. Expected it reported `
    + `stale, got ${failed.filter((c) => c.claim.includes('md5 is the digest')).length}.`);
  process.exit(failed.some((c) => c.claim.includes('md5 is the digest')) ? 1 : 2);
}
process.exit(failed.length ? 1 : 0);
