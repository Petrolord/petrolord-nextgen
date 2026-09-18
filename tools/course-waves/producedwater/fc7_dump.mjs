// THE FC7 TEACHING DIGEST GENERATOR.
//
// It runs the PUBLISHED GOLDEN CASES of producedwater_cases.json, sweeps around
// those published inputs, and runs the three TEACHING STREAMS this wave
// designed for itself: the UZERE gravity front end, the KOKORI de-oiling train
// and the OGBOTOBO four stage train.
//
// THE FC7 CAPSTONE RUNS DIFFERENT STREAMS ENTIRELY. Nothing here imports,
// reads or reproduces the capstone generator, the graded answer file, or any
// capstone stream, rate, temperature, salinity, gravity, geometry, liner count,
// bubble size, gas ratio, bed or spec.
//
// Usage:  sh /root/fc-wip-producedwater/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/fc-wip-producedwater/digest.txt
//
// Engine: engines/facilities/producedWater.js, which imports NOTHING. The
// walked import closure of the whole family is in this wave's VENDOR record.
//
// THE COMMIT THIS DIGEST WAS BUILT AGAINST IS NOT TYPED HERE, AND THE HEADER
// LINE THAT STATES IT IS NOT TYPED EITHER. It was, once, and it went stale the
// moment the engine was repaired again: the header kept naming the FC7-0
// commit while the generator was reading the FC7-1 engine, and every gate in
// the wave passed, because a sha is not a number any numeric sweep looks at
// and no gate compared the sentence to the file it describes. The sha and the
// closure size are now READ from vendor/closure.json, which the closure walker
// writes and which it refuses to write unless every vendored path is identical
// to that commit, and `assertVendorRecord` below re-hashes the engine this
// generator actually imported and refuses if it is not the blob that record
// names. A label and the thing it labels are checked against each other.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from a published case) or "derived" (arithmetic on
// engine values printed in the same block, with the arithmetic stated).
// Nothing here reads a clock, a random number or a network.
//
// NOTHING IN THIS FILE DESCRIBES WHAT THE ENGINE USED TO DO except SECTION 22,
// whose subject IS the repair and which says so in its title and its first
// line. Repair history is provenance: it lives in RECON.md, FINDINGS.md and the
// engines repository's own FINDINGS-producedwater.md, all three of which open
// with a banner saying so. The digest has no such licence.
//
// A ROW LABELLED A REFUSAL MUST ACTUALLY REFUSE, and a row labelled an answer
// must actually answer. Both directions are BUILD-TIME GUARDS here, not habits:
// see `mustRefuse`, `A` and the whole-output sweep at the foot of this file.
// FC4's generator labelled one row a refusal and then called a case that
// SUCCEEDED, printing seven success fields under a refusal heading. Every
// number on the line was real engine output, so no numeric sweep could ever
// have seen it.

import fs from 'fs';
import crypto from 'crypto';
import {
  m3PerSecond, BARREL_M3,
  UZERE_WATER, UZERE_OIL, UZERE_BWPD, UZERE_INLET, UZERE_BASIN, UZERE_PLATES,
  UZERE_DROPLET_MICRON, UZERE_BASIN_SHALLOW_DEPTH_M,
  KOKORI_WATER, KOKORI_OIL, KOKORI_BWPD, KOKORI_LINERS, KOKORI_FLOTATION, KOKORI_FILTER,
  OGBOTOBO_WATER, OGBOTOBO_OIL, OGBOTOBO_BWPD, OGBOTOBO_INLET, OGBOTOBO_BASIN,
  OGBOTOBO_LINERS, OGBOTOBO_FLOTATION, OGBOTOBO_FILTER,
  OGBOTOBO_SPEC_TIGHT_PPM, OGBOTOBO_SPEC_LOOSE_PPM, OGBOTOBO_CALLER_FLOOR_PPM,
  FLOOR_DEMO_INLET, FLOOR_DEMO_CUT_MICRON, FLOOR_WIDE_STAGES, FLOOR_WIDE_CUT_MICRON,
  VISC_T_SWEEP, VISC_TDS_SWEEP, API_SWEEP, VISC_BAND, DENSITY_BAND, TDS_BAND, API_BAND,
  NBINS_SWEEP, SPAN_SWEEP, SIGMA_SWEEP, NBINS_REFUSED, SPAN_REFUSED, GRADE_RATIOS, GRADE_SHARPNESS,
  BASIN_AREA_SWEEP, SHORT_CIRCUIT_SWEEP, SHORT_CIRCUIT_REFUSED, PLATE_COUNT_SWEEP,
  LINER_SWEEP, LINER_REFUSED, LINER_STARVED, LINER_GEOMETRY_SWEEP, LINER_BORE_LEG_LENGTH_M,
  CORE_FRACTION_SWEEP, CORE_FRACTION_REFUSED,
  BUBBLE_SWEEP, GAS_RATIO_SWEEP, CELL_DEPTH_SWEEP, CELL_ARRANGEMENT,
  ARRANGEMENT_TOTAL_GAS_RATIO, IGF_PRESET, DAF_PRESET, FLOTATION_REFUSED,
  BED_DEPTH_SWEEP, MEDIA_SWEEP, LOADING_AREA_SWEEP,
  FILTER_FLOOR_ANSWER_AREAS, FILTER_FLOOR_REFUSED_AREAS, RISE_GAP_SWEEP,
  STOKES_PROBE_MICRON, DUST_CUT_MICRON, BUBBLE_REFERENCE_MICRON, KOKORI_TRAIN_INLET,
  IDENTICAL_STAGE_CUT_MICRON, IDENTICAL_STAGE_COUNT, BROKEN_PLATE_AREA,
  contractCensus,
} from '/root/fc-wip-producedwater/fc7_fields.mjs';

const ROOT = process.env.FC7_ENGINES || '/root/wt-fc7-nextgen/packages/engines';
const ENGINE_REL = 'engines/facilities/producedWater.js';
const P = await import(`${ROOT}/${ENGINE_REL}`);

/**
 * THE VENDOR RECORD, RE-CHECKED AGAINST THE FILE THIS GENERATOR IMPORTED.
 *
 * closure.json is written by vendor/closure.py, which walks the import closure
 * in the engines repository and refuses to write anything unless every path is
 * sha-identical with a named commit. That makes it a record of WHAT WAS
 * VENDORED. It does not, on its own, prove the generator read that copy, so
 * this re-computes the git blob hash of the engine module actually imported
 * above and refuses when it differs. The hash is computed here rather than
 * shelled out to git, so the digest build needs no repository at all.
 */
const gitBlobSha = (buf) => crypto.createHash('sha1')
  .update(Buffer.concat([Buffer.from(`blob ${buf.length}\u0000`, 'utf8'), buf])).digest('hex');
const assertVendorRecord = () => {
  const rec = JSON.parse(fs.readFileSync('/root/fc-wip-producedwater/vendor/closure.json', 'utf8'));
  const drift = rec.closure.filter((r) => !r.identical).map((r) => r.path);
  if (drift.length) {
    throw new Error(`GENERATOR REFUSES: the vendor record carries ${drift.length} path(s) that are not sha-identical with engines ${rec.enginesHead}: ${drift.join(', ')}. Re-vendor before rebuilding the digest.`);
  }
  const row = rec.closure.find((r) => r.path === ENGINE_REL);
  if (!row) throw new Error(`GENERATOR REFUSES: the vendor record names no row for ${ENGINE_REL}, so it cannot say what engine this digest was built against.`);
  const actual = gitBlobSha(fs.readFileSync(`${ROOT}/${ENGINE_REL}`));
  if (actual !== row.vendoredBlob) {
    throw new Error(`GENERATOR REFUSES: the engine this generator imported hashes to ${actual} and the vendor record says ${row.vendoredBlob}. The header would have named a commit this digest was not built against.`);
  }
  return { head: rec.enginesHead.slice(0, 7), paths: rec.closure.length };
};
const VENDOR = assertVendorRecord();

/**
 * THE SIZE OF THE JEST SUITE, MEASURED OFF THE VENDORED SUITE FILE rather than
 * typed into the prose that reports it. It was typed once, and it went stale
 * the moment the suite grew: the digest told a reader the suite had 68 tests
 * while the file it was built beside had more, and the typed-literal
 * gate could not see the figure because it ended a sentence. Both halves are
 * repaired, and this is the half that cannot go stale again.
 */
const SUITE_TESTS = (() => {
  const src = fs.readFileSync(`${ROOT}/__tests__/facilities.producedwater.test.js`, 'utf8');
  const n = (src.match(/^\s*(?:test|it)\(/gm) || []).length;
  if (!(n > 0)) {
    throw new Error('GENERATOR REFUSES: no test declarations were found in the vendored produced water suite, so the suite size cannot be reported.');
  }
  return n;
})();
const GOLD = JSON.parse(fs.readFileSync(
  `${ROOT}/test-data/facilities/goldens/producedwater_cases.json`, 'utf8'));
const D = P.DECLARED_CONSTANTS;

const out = [];
const tagged = new Set();
const w = (s = '') => out.push(s);
/**
 * THE FORMATTERS REFUSE A HOLE RATHER THAN PRINTING ONE. A formatter that turns
 * undefined into the word "null" hides a misread key, which is how a digest
 * ends up teaching a field the engine never returned. Anything not finite stops
 * the build and names the value.
 */
const num = (x, n) => {
  if (typeof x !== 'number' || !Number.isFinite(x)) {
    throw new Error(`GENERATOR REFUSES: a numeric slot was handed ${String(x)}, which is not a finite number. Either the key is misread or the engine did not answer.`);
  }
  return x.toFixed(n);
};
const f6 = (x) => num(x, 6);      // kg/m3, micron, ppm, percent, g, ratios
const f12 = (x) => num(x, 12);    // Pa.s, m/s, volume fractions
const yn = (b) => (b ? 'yes' : 'no');
/** A small count as a word, so a count read off a sweep is never typed twice. */
const NUMBER_WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const word = (n) => {
  if (!Number.isInteger(n) || n < 0 || n >= NUMBER_WORD.length) {
    throw new Error(`GENERATOR REFUSES: ${String(n)} has no word in this table, so a count would be printed as a bare digit where the prose spells it`);
  }
  return NUMBER_WORD[n];
};

/**
 * A ROW LABELLED AN ANSWER MUST ANSWER. Every engine call whose result is
 * printed as an answer goes through this, so a refusal can never be printed
 * with its fields read as `undefined` under a heading that promises numbers.
 */
const A = (label, r) => {
  if (r && typeof r === 'object' && typeof r.error === 'string') {
    throw new Error(`GENERATOR REFUSES: "${label}" is printed as an answer and the engine REFUSED it: ${r.error}`);
  }
  if (r === undefined || r === null || (typeof r === 'number' && Number.isNaN(r))) {
    throw new Error(`GENERATOR REFUSES: "${label}" is printed as an answer and the engine returned ${String(r)}`);
  }
  return r;
};

/**
 * A ROW LABELLED A REFUSAL MUST REFUSE, and this is the only way a refusal is
 * written into this digest. It throws when the call ANSWERED, and it TAGS the
 * line it wrote, so the sweep at the foot of the file can prove that no
 * refusal-shaped line reached the output by any other route.
 */
const mustRefuse = (label, r) => {
  if (!r || typeof r.error !== 'string') {
    throw new Error(`GENERATOR REFUSES: the row "${label}" is labelled a refusal and the engine ANSWERED it. A refusal row computed from a successful call prints real numbers under a false heading, which no numeric sweep can see. Keys returned: ${r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r)}`);
  }
  return r;
};
/** Write one refusal row. `label` is the input, `r` is what came back. */
const wRefusal = (label, r) => {
  mustRefuse(label, r);
  tagged.add(out.length);
  w(`| ${label} | REFUSED: ${r.error} |`);
};
/** The three conditions a flotation return warns on, named off its own values. */
const flotWarn = (r) => warnLabel(r, [
  // READ THE DECLARED CONSTANT, NEVER RESTATE IT. This line carried its own
  // inlined 60 while the engine carried a bare one too; FC7-1 declared the
  // threshold, so there is now exactly one place it lives and this reads it. A
  // second copy of a threshold is the same defect as an undeclared one, one step
  // further from the engine.
  [`less than the ${D.flotationResidenceWarnS} s of residence this module warns below`, r.residenceS < D.flotationResidenceWarnS],
  ['a gas holdup past the swarm limit', r.gasHoldup > D.gasHoldupWarn],
  ['a cut coarser than produced water carries', r.d50cMicron > D.coarseCutWarnMicron],
]);
/** Write one refusal row in a plain list rather than a table. */
const wRefusalLine = (label, r) => {
  mustRefuse(label, r);
  tagged.add(out.length);
  w(`- ${label}: REFUSED: ${r.error}`);
};
/** A NaN from one of the three leaves. Asserted to be NaN, not assumed. */
const wLeafNaN = (label, v) => {
  if (!(typeof v === 'number' && Number.isNaN(v))) {
    throw new Error(`GENERATOR REFUSES: the row "${label}" is labelled a bare NaN and the leaf returned ${String(v)}`);
  }
  tagged.add(out.length);
  w(`- ${label}: REFUSED: a bare NaN, which is how a leaf says it has no answer`);
};

/**
 * NAME THE WARNING FROM THE RETURN VALUES, AND CHECK THE NAME.
 *
 * A column that reads `r.warning ? 'the thing I had in mind' : 'none'` is a
 * CLAIM about which of a device's several warnings fired, and on the first draft
 * of this digest it was wrong: the basin short-circuit sweep labelled every row
 * "outside the customary band" while what was actually firing was the horizontal
 * velocity warning on all five. Every warning column here is built by testing
 * the CONDITIONS against the engine's own returned quantities, and then asserted
 * against whether the engine warned at all, so a label and a warning cannot
 * disagree without stopping the build.
 */
const warnLabel = (r, conditions) => {
  const fired = conditions.filter(([, holds]) => holds).map(([name]) => name);
  const warned = Boolean(r.warning);
  if (fired.length && !warned) {
    throw new Error(`GENERATOR REFUSES: this row names the warning(s) ${fired.join(', ')} and the engine warned about nothing at all`);
  }
  if (!fired.length && warned) {
    throw new Error(`GENERATOR REFUSES: this row names no warning and the engine warned: ${r.warning}`);
  }
  return fired.length ? fired.join(' and ') : 'none';
};

/* ------------------------------------------- the section owner clauses */
/**
 * SECTION OWNER CLAUSES ARE BUILT FROM structure.py, NEVER TYPED.
 *
 * They used to be hand-typed string literals, one per section, with the module
 * key written into the middle of a prose sentence as a RUNNING COUNTER. A
 * counter drifts the moment a section stops being one module: Section 8
 * correctly co-owns Professional m01, Section 9 was typed m01 again, and the
 * whole run from 9 to 12 then read one module low. Six clauses across the
 * Professional and Expert sides named a module that does not teach the section,
 * and two of them named an l05 in a module that has only four lessons. Nothing
 * caught any of it, because nothing read the curriculum.
 *
 * `owners()` renders the clause from tier, module and lesson keys and REFUSES
 * at build time when any of them is absent from structure.py. A module key that
 * does not exist, or a lesson key that is not in the module named beside it,
 * stops the build and says what the curriculum actually carries.
 *
 * litsweep keys ALL of its gating off the TIER WORD, so a wrong module key was
 * never able to misplace content or open a leak. It misleads the writer or the
 * auditor placing a question, which is the whole job of the clause.
 */
const STRUCTURE = (() => {
  const src = fs.readFileSync('/root/fc-wip-producedwater/structure.py', 'utf8');
  const tiers = new Map();
  let tier = null;
  let mod = null;
  for (const line of src.split('\n')) {
    // THE APOSTROPHES IN THESE THREE PATTERNS ARE ESCAPED AS \x27 ON PURPOSE.
    // gate_typed_literals pairs quotes to find the printed prose, and a bare
    // apostrophe inside a regex shifts that pairing and makes it sweep code as
    // if it were a sentence. This family has already paid for that once.
    let m = /^ {4}\x27(\w+)\x27: \[\s*$/.exec(line);
    if (m) { tier = m[1]; tiers.set(tier, new Map()); mod = null; continue; }
    if (!tier) continue;
    m = /^ {8}\(\x27(m\d\d)[^\x27]*\x27, \x27([^\x27]*)\x27, \[\s*$/.exec(line);
    if (m) { mod = m[1]; tiers.get(tier).set(mod, { title: m[2], lessons: new Set() }); continue; }
    m = /^ {12}\(\x27(l\d\d)[^\x27]*\x27, \x27/.exec(line);
    if (m && mod) tiers.get(tier).get(mod).lessons.add(m[1]);
  }
  // THE PARSE IS CHECKED AGAINST WHAT THIS WAVE IS, so a structure.py that
  // moves under this generator, or a regex that stops matching it, stops the
  // build instead of quietly yielding an empty curriculum that validates
  // nothing at all.
  let lessons = 0;
  for (const [t, mods] of tiers) {
    if (mods.size !== 6) throw new Error(`GENERATOR REFUSES: structure.py gives tier ${t} ${mods.size} modules and this wave is six a tier`);
    for (const [k, v] of mods) {
      if (!v.lessons.size) throw new Error(`GENERATOR REFUSES: structure.py gives ${t} ${k} no lessons, so the owner clauses cannot be checked`);
      lessons += v.lessons.size;
    }
  }
  if (tiers.size !== 3) throw new Error(`GENERATOR REFUSES: structure.py gives ${tiers.size} tiers and this wave is three`);
  if (lessons !== 78) throw new Error(`GENERATOR REFUSES: structure.py gives ${lessons} lessons and this wave is 78`);
  return tiers;
})();

const TIER_WORD = { beginner: 'Associate', intermediate: 'Professional', advanced: 'Expert' };

/**
 * One owner clause. Each argument is [tier, module] or [tier, module, lesson].
 * Consecutive entries in the same tier share one tier word, and consecutive
 * entries in the same module share one module key, which is the form the clean
 * waves write by hand: "Associate m01 l04 and Expert m06", "Expert m05 l02 and
 * l03", "Associate m04 and m05".
 */
const owners = (...spec) => {
  const parts = spec.map(([tier, mkey, lkey]) => {
    const word = TIER_WORD[tier];
    if (!word) throw new Error(`GENERATOR REFUSES: an owner clause names the tier "${tier}", which is not one of ${Object.keys(TIER_WORD).join(', ')}`);
    const mods = STRUCTURE.get(tier);
    if (!mods.has(mkey)) {
      throw new Error(`GENERATOR REFUSES: an owner clause names ${word} ${mkey}, and structure.py gives that tier ${[...mods.keys()].join(', ')}`);
    }
    if (lkey && !mods.get(mkey).lessons.has(lkey)) {
      throw new Error(`GENERATOR REFUSES: an owner clause names ${word} ${mkey} ${lkey}, and "${mods.get(mkey).title}" carries only ${[...mods.get(mkey).lessons].join(', ')}`);
    }
    return { word, mkey, lkey };
  });
  const words = parts.map((p, i) => {
    const prev = i ? parts[i - 1] : null;
    const key = p.lkey ? `${p.mkey} ${p.lkey}` : p.mkey;
    if (prev && prev.word === p.word && prev.mkey === p.mkey && p.lkey) return p.lkey;
    if (prev && prev.word === p.word) return key;
    return `${p.word} ${key}`;
  });
  return `(owned by ${words.join(' and ')})`;
};

/** One `# SECTION n:` heading, with its owner clause built rather than typed. */
const sec = (no, title, ...spec) => `# SECTION ${no}: ${title} ${owners(...spec)}`;

/* ------------------------------------------------------------------ setup */
const uzQ = m3PerSecond(UZERE_BWPD);
const uzMu = A('UZERE viscosity', P.waterViscosityPaS(UZERE_WATER));
const uzRw = A('UZERE brine density', P.waterDensityKgM3(UZERE_WATER));
const uzRo = A('UZERE crude density', P.oilDensityKgM3(UZERE_OIL));
const uzFluid = { rhoWater: uzRw.rhoKgM3, rhoOil: uzRo.rhoKgM3, muPaS: uzMu.muPaS };
const uzBasin = A('UZERE basin', P.apiSeparator({ flowM3S: uzQ, ...UZERE_BASIN, ...uzFluid }));
const uzPlate = A('UZERE plate pack', P.plateInterceptor({ flowM3S: uzQ, ...UZERE_PLATES, ...uzFluid }));
const uzBins = A('UZERE inlet bins', P.dropletBins({ d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma }));
const uzRise = A('UZERE median droplet rise', P.stokesRiseMS({ dMicron: UZERE_DROPLET_MICRON, ...uzFluid }));

const koQ = m3PerSecond(KOKORI_BWPD);
const koMu = A('KOKORI viscosity', P.waterViscosityPaS(KOKORI_WATER));
const koRw = A('KOKORI brine density', P.waterDensityKgM3(KOKORI_WATER));
const koRo = A('KOKORI crude density', P.oilDensityKgM3(KOKORI_OIL));
const koFluid = { rhoWater: koRw.rhoKgM3, rhoOil: koRo.rhoKgM3, muPaS: koMu.muPaS };
const koCyc = A('KOKORI liner bank', P.hydrocyclone({ flowM3S: koQ, ...KOKORI_LINERS, ...koFluid }));
const koFlot = A('KOKORI flotation', P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, ...koFluid }));
const koFilt = A('KOKORI bed', P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER }));

const ogQ = m3PerSecond(OGBOTOBO_BWPD);
const ogMu = A('OGBOTOBO viscosity', P.waterViscosityPaS(OGBOTOBO_WATER));
const ogRw = A('OGBOTOBO brine density', P.waterDensityKgM3(OGBOTOBO_WATER));
const ogRo = A('OGBOTOBO crude density', P.oilDensityKgM3(OGBOTOBO_OIL));
const ogFluid = { rhoWater: ogRw.rhoKgM3, rhoOil: ogRo.rhoKgM3, muPaS: ogMu.muPaS };
const ogBasin = A('OGBOTOBO basin', P.apiSeparator({ flowM3S: ogQ, ...OGBOTOBO_BASIN, ...ogFluid }));
const ogCyc = A('OGBOTOBO liner bank', P.hydrocyclone({ flowM3S: ogQ, ...OGBOTOBO_LINERS, ...ogFluid }));
const ogFlot = A('OGBOTOBO flotation', P.flotation({ flowM3S: ogQ, ...OGBOTOBO_FLOTATION, ...ogFluid }));
const ogFilt = A('OGBOTOBO bed', P.mediaFilter({ flowM3S: ogQ, ...OGBOTOBO_FILTER }));
const ogDevices = [
  { name: 'API 421 basin', ...ogBasin },
  { name: 'Hydrocyclone bank', ...ogCyc },
  { name: 'Induced gas flotation', ...ogFlot },
  { name: 'Walnut shell filter', ...ogFilt },
];
const ogTrain = A('OGBOTOBO train', P.treatmentTrain({
  inletOiwPpm: OGBOTOBO_INLET.oiwPpm, inletD50Micron: OGBOTOBO_INLET.d50Micron,
  sigma: OGBOTOBO_INLET.sigma, devices: ogDevices,
}));
const CENSUS = contractCensus(P);

/* ================================================================ header */
w('# FC7 Produced Water Treatment. Teaching digest.');
w('# Densities in kg/m3, cut sizes and droplet medians in micron, concentrations in ppm, removals in percent, centrifugal fields in g and dimensionless ratios print to six decimals; viscosities in Pa.s, velocities in m/s and volume fractions print to twelve.');
w('# Field units: bwpd of water, degrees C, ppm of total dissolved solids, degrees API, micron for droplets and bubbles, m3/s and m for the equipment, ppm of oil in water.');
w('# Nothing here is read from a clock or a random number, so every line reproduces.');
w(`# Built against engines ${VENDOR.head}, vendored sha-identical over a walked import closure of ${VENDOR.paths} paths. Every figure below is that engine's own answer at the inputs named beside it.`);
w();

/* ============================================================== SECTION 1 */
w(sec(1, 'What this engine treats, and what it refuses', ['beginner', 'm01']));
w();
w('# App surface: the Produced Water Treatment Studio builds a train of up to three stages over one water stream, and reports what each stage removes, what the droplets left look like, and what comes out.');
w('- This engine answers ONE question in several ways: given this water, this oil and this equipment, what fraction of the dispersed oil comes out, and what is left in the water afterwards.');
w('- The doctrine is that oil in water is a DROPLET SIZE DISTRIBUTION and not a concentration. A concentration says how much oil there is. The distribution says how hard it is to remove, and every device in this module is characterised by the droplet size it removes half of, its CUT SIZE d50c.');
w('- Every device cut size is computed from the equipment geometry and the fluid properties. Nothing in this module is a fixed removal efficiency, and that is the whole difference between this engine and a lookup table: the SAME device on finer water performs worse, which is what actually happens.');
w(`- A state the method has no answer for comes back as an object with a named \`error\` string, and this module throws nothing at all. It exports ${CENSUS.exported.length} names, ${CENSUS.callable.length} of them callable and ${CENSUS.frozen.length} of them frozen objects or strings. Of the callable ones, ${CENSUS.rows.filter((r) => r.refuses === 'an object with a named error').length} carry the error contract and ${CENSUS.rows.filter((r) => r.refuses === 'a bare NaN').length} are LEAVES that answer with a bare number and say they have no answer with a bare NaN. Section 16 reads every export from both sides and names the leaves.`);
w('- What is NOT in this engine: no dissolved or soluble oil removal, no chemical demulsifier, no coalescer media, no re-entrainment, no reject stream or oil recovery balance, no fouling over time and no backwash cycle. It states no discharge limit of its own.');
w();
w('The three teaching streams, end to end:');
w(`- UZERE is ${UZERE_BWPD} bwpd, which the Suite layer turns into ${f12(uzQ)} m3/s (derived, the barrel is exactly ${BARREL_M3} m3), at ${UZERE_WATER.tC} C and ${UZERE_WATER.tdsPpm} ppm TDS with ${UZERE_OIL.apiGravity} API oil. The water is ${f12(uzMu.muPaS)} Pa.s and ${f6(uzRw.rhoKgM3)} kg/m3, the oil is ${f6(uzRo.rhoKgM3)} kg/m3, and a basin of ${UZERE_BASIN.lengthM} by ${UZERE_BASIN.widthM} by ${UZERE_BASIN.depthM} m cuts at ${f6(uzBasin.d50cMicron)} micron where a pack of ${UZERE_PLATES.nPlates} plates of ${UZERE_PLATES.plateAreaM2} m2 cuts at ${f6(uzPlate.d50cMicron)}.`);
w(`- KOKORI is ${KOKORI_BWPD} bwpd at ${KOKORI_WATER.tC} C and ${KOKORI_WATER.tdsPpm} ppm TDS with ${KOKORI_OIL.apiGravity} API oil. ${KOKORI_LINERS.nLiners} liners run at ${f6(koCyc.turndownRatio)} times their design flow and develop ${f6(koCyc.gField)} g, cutting at ${f6(koCyc.d50cMicron)} micron; ${KOKORI_FLOTATION.nCells} cells of ${KOKORI_FLOTATION.cellVolumeM3} m3 cut at ${f6(koFlot.d50cMicron)}; and a ${KOKORI_FILTER.areaM2} m2 bed ${KOKORI_FILTER.bedDepthM} m deep cuts at ${f6(koFilt.d50cMicron)}.`);
w(`- OGBOTOBO is ${OGBOTOBO_BWPD} bwpd of ${OGBOTOBO_INLET.oiwPpm} ppm oil at d50 ${OGBOTOBO_INLET.d50Micron} micron and sigma ${OGBOTOBO_INLET.sigma}, through four stages. It leaves ${f6(ogTrain.outletOiwPpm)} ppm, which is ${f6(ogTrain.overallRemovalPct)} percent of the oil removed, and the droplet median falls from ${f6(ogTrain.inletMedianMicron)} to ${f6(ogTrain.outletMedianMicron)} micron.`);
w();

/* ============================================================== SECTION 2 */
w(sec(2, 'The numbers this module stands on, in four kinds', ['beginner', 'm01', 'l04'], ['advanced', 'm06']));
w();
w('Every number in this module that is a CHOICE rather than a derivation lives in one frozen `DECLARED_CONSTANTS`, and the engine reads each one from there rather than inlining it. The four kinds below are the most useful distinction in this course, and a reader who can place a number in the right kind has learned the main thing this module teaches.');
w();
w('KIND ONE: DERIVED. The module computes it, and there is nothing to check because it follows from something else on the page.');
const cdfAtCut = A('cdf at the cut', P.gradeEfficiency({ dMicron: 10, d50cMicron: 10, sharpness: D.defaultSharpness }));
const halfAreaR = Math.SQRT1_2;
w(`- the grade efficiency AT the cut size is exactly one half: ${f12(cdfAtCut)} at ten micron against a ten micron cut. That is what a cut size MEANS, and it holds at every sharpness because the reduced-efficiency form is r over one plus r.`);
w(`- the half-area radius of a round liner, as a fraction of the radius: ${f12(halfAreaR)} (derived, one over the root of two). Half the flow area sits inside it, so it is where the MEDIAN droplet enters. It is a criterion and not a constant, and the module refuses an oil core wider than it.`);
w(`- the flotation and filtration sharpness is ${D.interceptionSharpness} and it is DERIVED. Both devices capture by interception, whose rate goes as the SQUARE of the droplet diameter, so the grade curve is an exponential in the square of the reduced size and the reduced-efficiency family with m equal to ${D.interceptionSharpness} has the same half point and the same leading power. It was not chosen.`);
const gravityProbe = A('a rise to measure gravity with', P.stokesRiseMS({ dMicron: STOKES_PROBE_MICRON, ...uzFluid }));
const measuredG = (18 * uzFluid.muPaS * gravityProbe.vMS) / ((STOKES_PROBE_MICRON * 1e-6) ** 2 * (uzFluid.rhoWater - uzFluid.rhoOil));
w(`- standard gravity, MEASURED out of the engine the same way: eighteen times the viscosity times that same rise velocity, over the diameter squared times the density difference, is ${f6(measuredG)} m/s2 (derived, the arithmetic stated). It is the only number in the device physics that is neither declared nor derived, because it is a property of the planet.`);
const ln2Probe = A('a bed to measure the half point with', P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER }));
const measuredLn2 = ln2Probe.filterCoefficientPerM * (ln2Probe.d50cMicron / ln2Probe.referenceDropletMicron) ** 2 * ln2Probe.bedDepthM;
w(`- the natural logarithm of two, ${f12(measuredLn2)}, MEASURED out of the bed: the filter coefficient at the reported cut size, times the bed depth, is exactly it (derived, the three reported quantities multiplied). Both interception devices define their cut that way, because a cut size is where HALF the volume goes and half survives an exponential at the log of two.`);
const stokes18 = A('a rise to measure the Stokes group with', P.stokesRiseMS({ dMicron: STOKES_PROBE_MICRON, ...uzFluid }));
const measured18 = (9.80665 * (STOKES_PROBE_MICRON * 1e-6) ** 2 * (uzFluid.rhoWater - uzFluid.rhoOil)) / (uzFluid.muPaS * stokes18.vMS);
w(`- the 18 in the Stokes group, MEASURED out of the engine rather than typed: a ${STOKES_PROBE_MICRON} micron droplet in the UZERE water rises at ${f12(stokes18.vMS)} m/s, and gravity times the diameter squared times the density difference, over the viscosity times that velocity, comes to ${f12(measured18)} (derived, the arithmetic stated). The oracle never types an 18 either, which is why bending it in both files is caught.`);
w();
w('KIND TWO: DECLARED. Customary or chosen values with no publication anywhere in this repository to check them against. The module exports them in one frozen place, and its own comment says that PINNING them is all any gate can do. A pin is not a validation. What it buys is that moving one is a reviewed act instead of a silent one.');
w('| declared constant | value | what it sets |');
w('| --- | --- | --- |');
const DECLARED_ROWS = [
  ['vogelA', 'the fresh water viscosity fit, coefficient'],
  ['vogelB', 'the same fit, numerator'],
  ['vogelC', 'the same fit, offset'],
  ['salinityViscosityMultiplier', 'how fast viscosity rises with dissolved solids'],
  ['brineDensitySlopeKgM3', 'how fast density rises with dissolved solids'],
  ['crudeThermalExpansionPerC', 'how fast the crude thins with temperature'],
  ['crudeReferenceWaterKgM3', 'the water the API gravity specific gravity is taken against'],
  ['defaultNBins', 'the droplet grid, bin count'],
  ['defaultSpanSigma', 'the droplet grid, how far either side of the median it reaches'],
  ['defaultSharpness', 'the grade curve of the gravity and centrifugal devices'],
  ['interceptionCoefficient', 'the Stokes-flow interception efficiency coefficient'],
  ['shortCircuitFDefault', 'the API 421 turbulence and short-circuiting allowance'],
  ['plateEfficiencyFactor', 'the fraction of a plate pack projected area that settles'],
  ['linerDiameterM', 'the liner bore'],
  ['linerLengthM', 'the liner length, which sets its residence time'],
  ['designFlowPerLinerM3S', 'the flow one liner is rated at'],
  ['gFieldAtDesign', 'the field one liner develops at that flow'],
  ['coreRadiusFraction', 'where the oil core sits, as a fraction of the radius'],
  ['starvedTurndown', 'the bottom of the liner operating envelope'],
  ['overloadTurndown', 'the top of it, past which the field stops rising'],
  ['maxTurndown', 'past which the module refuses to answer at all'],
  ['flotationCellDepthM', 'the default cell depth, an input since FC7-0'],
  ['flotationGasDensityKgM3', 'the gas in the bubbles, an input'],
  ['bubbleMicronDefault', 'the default bubble'],
  ['gasRatioDefault', 'the default gas to water volume ratio'],
  ['gasHoldupWarn', 'the holdup past which a swarm is no longer independent bubbles'],
  ['filterCoefficientPerM', 'the bed filter coefficient at its reference triple'],
  ['filterReferenceDropletMicron', 'the droplet that coefficient is declared at'],
  ['filterReferenceMediaMicron', 'the grain size it is declared at'],
  ['filterReferenceLoadingMHr', 'the loading rate it is declared at'],
  ['filterLoadingExponent', 'how fast capture falls with loading rate'],
  ['filterBreakthroughLoadingMHr', 'the loading this module warns past'],
  ['filterMinLoadingMHr', 'the loading this module REFUSES below, because the coefficient is declared at one rate'],
  ['flotationResidenceWarnS', 'the flotation residence this module warns below'],
  ['minNBins', 'the fewest bins the distribution will be described on'],
  ['minSpanSigma', 'the fewest sigma either side of the median the grid must span'],
  ['stokesReynoldsLimit', 'the Reynolds number Stokes law is stated to here'],
  ['tdsMaxPpm', 'the salinity the linear correction is stated to'],
  ['sigmaMax', 'the widest droplet spread this module will describe'],
];
DECLARED_ROWS.forEach(([k, what]) => {
  if (!(k in D)) throw new Error(`GENERATOR REFUSES: DECLARED_CONSTANTS has no key ${k}, so this table row describes nothing`);
  w(`| ${k} | ${D[k]} | ${what} |`);
});
w(`Read straight off the frozen export, which carries ${Object.keys(D).length} keys in all. The ${Object.keys(D).length - DECLARED_ROWS.length} not in the table above are band edges and customary limits printed where they bite, in Sections 4, 10, 12, 13 and 16.`);
w();
w('KIND THREE: A CALIBRATION, and there is exactly one.');
w(`- \`attachmentEfficiency\` is ${D.attachmentEfficiency}. It is the probability that a droplet colliding with a bubble sticks, and it is the ONE number in this module with no derivation at all: it was chosen so that a cell at the module's own default conditions cuts in the ten to twenty micron range induced gas flotation is customarily credited with. It is an input, so a caller with a vendor curve can move it. Nothing in this course presents it as published, and no graded capstone answer depends on it.`);
w();
w('KIND FOUR: HELD FOR LITERATURE. Six numbers or rules this repository does not carry. The module states the ABSENCE rather than guessing a value, which is the honest form and is also the harder one to write. Section 17 is entirely about them.');
w(`- the value of the dissolved and soluble oil floor. Stated on every train return and applied as a floor only when a CALLER supplies one.`);
w(`- the second half of the API 421 horizontal velocity rule. \`API_421.velocityRuleComplete\` is ${P.API_421.velocityRuleComplete} on every return that carries the check.`);
w('- any discharge limit at all. This module states none, and a test asserts that `DECLARED_CONSTANTS` carries no specification-like key.');
w('- the media filter grain size exponent. The interception law gives the inverse cube and no bed data here can check it.');
w('- the attachment efficiency above, which is held AND is a calibration.');
w('- the shape and scale constants in KIND TWO, one at a time. They are pinned by literal in the jest suite with an exact key-set match, so adding or removing one fails until the pin is updated.');
w();

/* ============================================================== SECTION 3 */
w(sec(3, 'Where temperature and salinity finally matter', ['beginner', 'm02']));
w();
w('The predecessor model collected a temperature and a salinity and used neither. In produced water they are most of the story, because they set the water viscosity and the density difference, and those two set what any of these devices can catch.');
w();
w(`Viscosity against temperature, at ${VISC_T_SWEEP.length} temperatures and ${UZERE_WATER.tdsPpm} ppm TDS:`);
w(`| degC | fresh Pa.s | salinity factor | brine Pa.s | brine over the ${VISC_T_SWEEP[VISC_T_SWEEP.length - 1]} C value |`);
w('| --- | --- | --- | --- | --- |');
const viscHot = A('viscosity at the top of the sweep', P.waterViscosityPaS({ tC: VISC_T_SWEEP[VISC_T_SWEEP.length - 1], tdsPpm: UZERE_WATER.tdsPpm }));
VISC_T_SWEEP.forEach((tC) => {
  const r = A(`viscosity at ${tC} C`, P.waterViscosityPaS({ tC, tdsPpm: UZERE_WATER.tdsPpm }));
  w(`| ${tC} | ${f12(r.muFreshPaS)} | ${f6(r.salinityFactor)} | ${f12(r.muPaS)} | ${f6(r.muPaS / viscHot.muPaS)} |`);
});
w(`The ratio column is derived, each brine viscosity over the last row of the same column. Across this sweep the water thins by a factor of ${f6(A('viscosity at the bottom of the sweep', P.waterViscosityPaS({ tC: VISC_T_SWEEP[0], tdsPpm: UZERE_WATER.tdsPpm })).muPaS / viscHot.muPaS)}, and a Stokes rise velocity goes as one over the viscosity, so the same basin catches a very different droplet in the same water at two temperatures.`);
w();
w(`Viscosity against salinity, at ${UZERE_WATER.tC} C:`);
w('| ppm TDS | salinity factor | brine Pa.s |');
w('| --- | --- | --- |');
VISC_TDS_SWEEP.forEach((tdsPpm) => {
  const r = A(`viscosity at ${tdsPpm} ppm`, P.waterViscosityPaS({ tC: UZERE_WATER.tC, tdsPpm }));
  w(`| ${tdsPpm} | ${f6(r.salinityFactor)} | ${f12(r.muPaS)} |`);
});
w(`The factor is one plus ${D.salinityViscosityMultiplier} times the mass fraction, which is DECLARED. It is linear and it is stated only to ${D.tdsMaxPpm} ppm, because past saturation a linear correction has nothing behind it.`);
// THE SWEEP NEEDS ITS OWN REFUSAL. The sentence above states a limit and the
// only refused salinity in this digest sat in Section 16, which the Associate
// tier does not own, so the tier that is taught this limit could not reach a
// single line of the engine actually enforcing it. This is that line, on the
// UZERE temperature the sweep above is run at.
wRefusalLine(`${TDS_BAND.justOver} ppm TDS at the ${UZERE_WATER.tC} C of the sweep above`, P.waterViscosityPaS({ tC: UZERE_WATER.tC, tdsPpm: TDS_BAND.justOver }));
w();
w(`Brine density and crude density on the same water, which is what the density DIFFERENCE is made of:`);
w('| degC | ppm TDS | fresh kg/m3 | brine kg/m3 |');
w('| --- | --- | --- | --- |');
[[UZERE_WATER.tC, 0], [UZERE_WATER.tC, UZERE_WATER.tdsPpm], [KOKORI_WATER.tC, KOKORI_WATER.tdsPpm], [OGBOTOBO_WATER.tC, OGBOTOBO_WATER.tdsPpm]].forEach(([tC, tdsPpm]) => {
  const r = A(`brine density at ${tC} C and ${tdsPpm} ppm`, P.waterDensityKgM3({ tC, tdsPpm }));
  w(`| ${tC} | ${tdsPpm} | ${f6(r.rhoFreshKgM3)} | ${f6(r.rhoKgM3)} |`);
});
w();
w(`Crude density against API gravity at ${UZERE_OIL.tC} C:`);
w('| API | sg at 60 F | kg/m3 | difference from the UZERE brine, kg/m3 |');
w('| --- | --- | --- | --- |');
const crudeDiffs = API_SWEEP.map((apiGravity) => {
  const r = A(`crude density at ${apiGravity} API`, P.oilDensityKgM3({ apiGravity, tC: UZERE_OIL.tC }));
  w(`| ${apiGravity} | ${f6(r.sg60)} | ${f6(r.rhoKgM3)} | ${f6(uzRw.rhoKgM3 - r.rhoKgM3)} |`);
  return uzRw.rhoKgM3 - r.rhoKgM3;
});
// THE SPREAD IS PRINTED, never characterised by eye: an earlier build called
// it "about three" where it is nearer four.
w(`The last column is derived, the brine density on the row above this table minus each crude density. It is the entire driving force for every gravity and centrifugal device in this module, and across this sweep it changes by a factor of ${f6(Math.max(...crudeDiffs) / Math.min(...crudeDiffs))} (derived, the largest difference over the smallest), which is the same factor on every cut size squared.`);
w();
// BOTH EFFECTS OF THE SALINITY AT ONCE, RANKED BY THE ENGINE. The salinity makes
// the water more viscous (a coarser cut) and heavier (a finer cut), and a lesson
// that says which one wins is stating a RANKING. A ranking is an answer, so it
// is computed here from two engine cuts per row rather than left to be read off
// two separate tables, and the generator refuses if the ranking it prints fails
// on any row.
const freshMu = A('fresh water viscosity at the UZERE temperature', P.waterViscosityPaS({ tC: UZERE_WATER.tC, tdsPpm: 0 }));
const freshRw = A('fresh water density at the UZERE temperature', P.waterDensityKgM3({ tC: UZERE_WATER.tC, tdsPpm: 0 }));
const saltRows = API_SWEEP.map((apiGravity) => {
  const o = A(`crude density at ${apiGravity} API`, P.oilDensityKgM3({ apiGravity, tC: UZERE_OIL.tC }));
  const fresh = A(`the UZERE basin on ${apiGravity} API crude in fresh water`, P.apiSeparator({
    flowM3S: uzQ, ...UZERE_BASIN, rhoWater: freshRw.rhoKgM3, rhoOil: o.rhoKgM3, muPaS: freshMu.muPaS,
  }));
  const brine = A(`the UZERE basin on ${apiGravity} API crude in the UZERE brine`, P.apiSeparator({
    flowM3S: uzQ, ...UZERE_BASIN, rhoWater: uzRw.rhoKgM3, rhoOil: o.rhoKgM3, muPaS: uzMu.muPaS,
  }));
  return {
    apiGravity, dFresh: freshRw.rhoKgM3 - o.rhoKgM3, freshCut: fresh.d50cMicron, brineCut: brine.d50cMicron,
  };
});
w(`Both effects of the UZERE salinity at once. The UZERE basin at ${UZERE_BWPD} bwpd, run by the engine on each crude above, once in fresh water and once in the UZERE brine, both at ${UZERE_WATER.tC} C:`);
w('| API | difference from fresh water, kg/m3 | fresh water cut, micron | UZERE brine cut, micron | brine cut over fresh cut |');
w('| --- | --- | --- | --- | --- |');
saltRows.forEach((r) => w(`| ${r.apiGravity} | ${f6(r.dFresh)} | ${f6(r.freshCut)} | ${f6(r.brineCut)} | ${f6(r.brineCut / r.freshCut)} |`));
if (!saltRows.every((r) => r.brineCut < r.freshCut)) {
  throw new Error('GENERATOR REFUSES: the digest says the saline water cuts finer on every crude of the sweep and at least one row does not');
}
const saltViscFactor = uzMu.muPaS / freshMu.muPaS;
const saltDensityGain = uzRw.rhoKgM3 - freshRw.rhoKgM3;
const saltBalanceFresh = saltDensityGain / (saltViscFactor - 1);
// The balance point is CHECKED BY THE ENGINE, not only derived: a crude placed
// exactly there must cut the same in both waters.
const saltBalanceOil = freshRw.rhoKgM3 - saltBalanceFresh;
const balFresh = A('the UZERE basin at the balance point in fresh water', P.apiSeparator({
  flowM3S: uzQ, ...UZERE_BASIN, rhoWater: freshRw.rhoKgM3, rhoOil: saltBalanceOil, muPaS: freshMu.muPaS,
}));
const balBrine = A('the UZERE basin at the balance point in the UZERE brine', P.apiSeparator({
  flowM3S: uzQ, ...UZERE_BASIN, rhoWater: uzRw.rhoKgM3, rhoOil: saltBalanceOil, muPaS: uzMu.muPaS,
}));
if (!(Math.abs(balBrine.d50cMicron / balFresh.d50cMicron - 1) <= Number.EPSILON * 16)) {
  throw new Error(`GENERATOR REFUSES: the salinity balance point does not balance in the engine: ${balBrine.d50cMicron / balFresh.d50cMicron}`);
}
w(`The last column is derived, the two engine cuts on the same row divided. It is below one on all ${saltRows.length} rows, so on every crude of this sweep the saline water is the one that cuts finer. The salinity makes the water ${f6(saltViscFactor)} times as viscous and ${f6(saltDensityGain)} kg/m3 heavier, and on this sweep the density gain is the larger move. The two effects balance only where the difference from fresh water is that density gain over the viscosity factor less one, ${f6(saltBalanceFresh)} kg/m3 (derived, the two figures in this sentence), which is ${f6(saltBalanceFresh + saltDensityGain)} kg/m3 against the brine. A crude placed exactly there cuts at ${f6(balFresh.d50cMicron)} micron in both waters when the engine runs it, and the largest difference against the brine anywhere in this sweep is ${f6(Math.max(...saltRows.map((r) => r.dFresh + saltDensityGain)))} kg/m3.`);
w();

/* ============================================================== SECTION 4 */
w(sec(4, 'Oil in water is a distribution', ['beginner', 'm03']));
w();
w('A concentration is one number and it cannot say how hard the oil is to remove. The distribution can. This module takes it as log-normal in droplet volume, described by a median diameter d50 and a log-standard-deviation sigma, and discretises it into volume bins so that a grade efficiency can be integrated against it exactly.');
w();
w(`The UZERE inlet, d50 ${UZERE_INLET.d50Micron} micron at sigma ${UZERE_INLET.sigma}, on the module's own grid of ${uzBins.nBins} bins spanning ${uzBins.spanSigma} sigma either side:`);
w(`- the coarsest bin reaches ${f6(uzBins.bins[uzBins.bins.length - 1].dHiMicron)} micron and the finest starts at ${f12(uzBins.bins[0].dLoMicron)} micron.`);
w(`- the volume in the truncated tails, which the normalisation absorbs: ${f12(uzBins.truncatedTailFraction)}.`);
w(`- the volume median of the bin set: ${f6(A('UZERE inlet median', P.medianOfBins(uzBins.bins)))} micron on a typed ${UZERE_INLET.d50Micron}. That identity is the one a median has to satisfy, because the volume median of a log-normal IS its own d50.`);
w();
w('THE GRID MOVES THE ANSWER, so it is reported back rather than hidden. The median identity holds on every grid, and the truncated tail is an analytic quantity the gate can check:');
w('| bins | median micron | truncated tail | tail over twice the cdf below the span |');
w('| --- | --- | --- | --- |');
NBINS_SWEEP.forEach((nBins) => {
  const b = A(`bins at ${nBins}`, P.dropletBins({ d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma, nBins }));
  const lo = Math.exp(Math.log(UZERE_INLET.d50Micron) - b.spanSigma * UZERE_INLET.sigma);
  const analytic = 2 * A('the cdf at the span edge', P.logNormalCdf({ d: lo, d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma }));
  w(`| ${nBins} | ${f6(P.medianOfBins(b.bins))} | ${f12(b.truncatedTailFraction)} | ${f12(b.truncatedTailFraction / analytic)} |`);
});
w('The last column is derived, the reported tail over twice the module\'s own cdf at the lower span edge. It is one, which says the tail the normalisation absorbs is exactly the analytic tail and not a binning artefact.');
w();
w(`The span, at one bin count:`);
w('| sigma spans | truncated tail | coarsest bin micron |');
w('| --- | --- | --- |');
SPAN_SWEEP.forEach((spanSigma) => {
  const b = A(`bins spanning ${spanSigma} sigma`, P.dropletBins({ d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma, spanSigma }));
  w(`| ${spanSigma} | ${f12(b.truncatedTailFraction)} | ${f6(b.bins[b.bins.length - 1].dHiMicron)} |`);
});
w();
w('Sigma is the input a reader is least likely to have measured and it matters more than almost anything else on the page. The same device on the same water, at one cut size:');
const sigmaProbeCut = 12;
w(`| sigma | removal at a ${sigmaProbeCut} micron cut, percent | outlet median micron | warning |`);
w('| --- | --- | --- | --- |');
SIGMA_SWEEP.forEach((sigma) => {
  const b = A(`bins at sigma ${sigma}`, P.dropletBins({ d50: UZERE_INLET.d50Micron, sigma }));
  const ap = A(`a device on sigma ${sigma}`, P.applyDevice({ bins: b.bins, d50cMicron: sigmaProbeCut }));
  w(`| ${sigma} | ${f6(ap.removalFraction * 100)} | ${f6(P.medianOfBins(ap.outletBins))} | ${warnLabel(b, [
    ['sigma outside the customary band', sigma < D.sigmaCustomaryMin || sigma > D.sigmaCustomaryMax],
  ])} |`);
});
w(`The module warns outside ${D.sigmaCustomaryMin} to ${D.sigmaCustomaryMax} and refuses above ${D.sigmaMax}, because a wider spread than that is not what produced water carries.`);
// THE GRID HAS THREE GUARDS AND THE DIGEST PRINTED NONE OF THEM. The bin count
// must be a WHOLE NUMBER and the engine says so by name, which a lesson in this
// tier asserted while no line of this digest carried it. A claim about an engine
// that the truth source does not print is a claim a reader cannot check.
wRefusalLine(`a bin count of ${NBINS_REFUSED.fractional}`, P.dropletBins({ d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma, nBins: NBINS_REFUSED.fractional }));
wRefusalLine(`a bin count of ${NBINS_REFUSED.belowFloor}`, P.dropletBins({ d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma, nBins: NBINS_REFUSED.belowFloor }));
wRefusalLine(`a span of ${SPAN_REFUSED} sigma either side`, P.dropletBins({ d50: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma, spanSigma: SPAN_REFUSED }));
w(`Those three name the guard they crossed and the figure that crossed it. The whole-number guard is the one worth pausing on: a bin count is a COUNT, a grid of ${NBINS_REFUSED.fractional} bins is not a thing the module can build, and rounding it quietly would have handed back an answer measured on a grid the caller never asked for.`);
w();

/* ============================================================== SECTION 5 */
w(sec(5, 'A droplet\'s rise, and the band it is honest in', ['beginner', 'm04'], ['advanced', 'm04']));
w();
w('Everything gravity and everything centrifugal in this module comes from one balance: a droplet rises because it is lighter than the water, and the drag on it balances that buoyancy. Stokes law is that balance in CREEPING FLOW.');
w();
w(`In the UZERE water, ${f12(uzFluid.muPaS)} Pa.s with a ${f6(uzFluid.rhoWater - uzFluid.rhoOil)} kg/m3 density difference (derived, the two densities in Section 1 subtracted):`);
w('| droplet micron | Stokes m/s | Reynolds | full drag balance m/s | Stokes over the balance | in band |');
w('| --- | --- | --- | --- | --- | --- |');
RISE_GAP_SWEEP.forEach((dMicron) => {
  const s = A(`Stokes at ${dMicron} micron`, P.stokesRiseMS({ dMicron, ...uzFluid }));
  const t = A(`the drag balance at ${dMicron} micron`, P.terminalRiseMS({
    dMicron, rhoHeavy: uzFluid.rhoWater, rhoLight: uzFluid.rhoOil, muPaS: uzFluid.muPaS,
  }));
  w(`| ${dMicron} | ${f12(s.vMS)} | ${f6(s.reynolds)} | ${f12(t.vMS)} | ${f6(s.vMS / t.vMS)} | ${s.warning ? 'no' : 'yes'} |`);
});
const gapRows = RISE_GAP_SWEEP.map((dMicron) => {
  const s = A(`Stokes at ${dMicron} micron`, P.stokesRiseMS({ dMicron, ...uzFluid }));
  const t = A(`the balance at ${dMicron} micron`, P.terminalRiseMS({ dMicron, rhoHeavy: uzFluid.rhoWater, rhoLight: uzFluid.rhoOil, muPaS: uzFluid.muPaS }));
  return { dMicron, re: s.reynolds, departure: s.vMS / t.vMS - 1 };
});
if (!gapRows.every((r, i) => i === 0 || r.departure > gapRows[i - 1].departure)) {
  throw new Error('GENERATOR REFUSES: this block states the departure grows with Reynolds and it does not');
}
const fine = gapRows[0];
const coarse = gapRows[gapRows.length - 1];
const nearBand = gapRows.reduce((a, b) => (Math.abs(b.re - D.stokesReynoldsLimit) < Math.abs(a.re - D.stokesReynoldsLimit) ? b : a));
w(`The fifth column is derived, the two velocities on the same row divided. THE DEPARTURE GROWS WITH THE REYNOLDS NUMBER, every row of this table, and that is the whole content of the band: at ${fine.dMicron} micron and Reynolds ${f6(fine.re)} the two routes agree to ${fine.departure.toExponential(2)}, at ${nearBand.dMicron} micron and Reynolds ${f6(nearBand.re)} they already differ by ${f6(nearBand.departure * 100)} percent, and at ${coarse.dMicron} micron and Reynolds ${f6(coarse.re)} Stokes overstates the rise by ${f6(coarse.departure * 100)} percent. The module states Stokes to Reynolds ${D.stokesReynoldsLimit} and warns above it. An overstated rise means an UNDERSTATED cut size, which is the optimistic direction, which is why the warning exists rather than being left to the reader.`);
w('The two routes are different methods rather than two copies of one: Stokes is closed form and the balance is a damped iteration on the Schiller-Naumann drag coefficient. That is what makes their agreement inside the band evidence of anything at all.');
w();
w('Every device in this module reports the Reynolds number of its OWN cut droplet and warns the same way, so a cut size that sits outside creeping flow says so on the same return.');
w();

/* ============================================================== SECTION 6 */
w(sec(6, 'The gravity devices: a cut size is a surface loading inverted', ['beginner', 'm04'], ['beginner', 'm05']));
w();
w('An API 421 basin removes the droplet that can rise the depth of the water in the time the water spends in the basin. Write that out and the depth cancels: what is left is the FLOW OVER THE PLAN AREA, the surface loading, times an allowance F for turbulence and short-circuiting. Invert the Stokes balance at that rise velocity and the cut size falls out.');
w();
w(`The UZERE basin, ${UZERE_BWPD} bwpd through ${UZERE_BASIN.lengthM} by ${UZERE_BASIN.widthM} by ${UZERE_BASIN.depthM} m at the default F of ${uzBasin.shortCircuitF}:`);
w(`- surface loading ${f12(uzBasin.overflowRateMS)} m/s, design rise ${f12(uzBasin.designRiseMS)} m/s, cut ${f6(uzBasin.d50cMicron)} micron at Reynolds ${f6(uzBasin.cutReynolds)}.`);
w(`- horizontal velocity ${f12(uzBasin.horizontalVelocityMS)} m/s against the ${f6(uzBasin.horizontalVelocityLimitMS)} m/s fixed limit, residence ${f6(uzBasin.residenceS)} s.`);
w(`- warning: ${uzBasin.warning || 'none'}`);
w();
w('THE DEPTH DOES NOT ENTER THE CUT SIZE AND IT DOES ENTER THE VELOCITY CHECK. The same basin at two water depths:');
w('| water depth m | cut micron | horizontal velocity m/s | residence s | warning |');
w('| --- | --- | --- | --- | --- |');
[UZERE_BASIN.depthM, UZERE_BASIN_SHALLOW_DEPTH_M].forEach((depthM) => {
  const r = A(`the UZERE basin at ${depthM} m of water`, P.apiSeparator({ flowM3S: uzQ, ...UZERE_BASIN, depthM, ...uzFluid }));
  w(`| ${depthM} | ${f6(r.d50cMicron)} | ${f12(r.horizontalVelocityMS)} | ${f6(r.residenceS)} | ${warnLabel(r, [
    ['the horizontal velocity above its limit', r.horizontalVelocityMS > r.horizontalVelocityLimitMS],
    ['F outside the customary band', r.shortCircuitF < P.API_421.shortCircuitCustomaryMin || r.shortCircuitF > P.API_421.shortCircuitCustomaryMax],
    ['the cut droplet outside creeping flow', r.cutReynolds > D.stokesReynoldsLimit],
  ])} |`);
});
w('The cut size is the same number on both rows, because the cut comes from the flow over the PLAN AREA. The shallower basin runs the water through faster, and faster flow re-entrains oil the basin has already separated, which is what the velocity limit is for. A reader who takes the cut size as the whole answer has missed the constraint that actually sizes the vessel.');
w();
w('The plan area, which is what the cut size does depend on:');
w('| length m | width m | plan area m2 | surface loading m/s | cut micron | cut micron per root loading |');
w('| --- | --- | --- | --- | --- | --- |');
BASIN_AREA_SWEEP.forEach((g) => {
  const r = A(`a basin ${g.lengthM} by ${g.widthM}`, P.apiSeparator({ flowM3S: uzQ, ...g, depthM: UZERE_BASIN.depthM, ...uzFluid }));
  w(`| ${g.lengthM} | ${g.widthM} | ${f6(g.lengthM * g.widthM)} | ${f12(r.overflowRateMS)} | ${f6(r.d50cMicron)} | ${f6(r.d50cMicron / Math.sqrt(r.overflowRateMS))} |`);
});
w('The plan area column and the last column are derived, the two dimensions multiplied and the cut divided by the root of the loading on the same row. The last column is constant, which says the cut size goes as the square root of the surface loading exactly, so HALVING the cut size costs four times the basin.');
w();
w(`F is the published allowance, customarily ${P.API_421.shortCircuitCustomaryMin} to ${P.API_421.shortCircuitCustomaryMax}:`);
w('| F | cut micron | warning |');
w('| --- | --- | --- |');
SHORT_CIRCUIT_SWEEP.forEach((shortCircuitF) => {
  const r = A(`a basin at F ${shortCircuitF}`, P.apiSeparator({ flowM3S: uzQ, ...UZERE_BASIN, shortCircuitF, ...uzFluid }));
  w(`| ${shortCircuitF} | ${f6(r.d50cMicron)} | ${warnLabel(r, [
    ['F outside the customary band', shortCircuitF < P.API_421.shortCircuitCustomaryMin || shortCircuitF > P.API_421.shortCircuitCustomaryMax],
    ['the horizontal velocity above its limit', r.horizontalVelocityMS > r.horizontalVelocityLimitMS],
    ['the cut droplet outside creeping flow', r.cutReynolds > D.stokesReynoldsLimit],
  ])} |`);
});
w('And the values it refuses, each named:');
SHORT_CIRCUIT_REFUSED.forEach((shortCircuitF) => {
  wRefusalLine(`F of ${shortCircuitF}`, P.apiSeparator({ flowM3S: uzQ, ...UZERE_BASIN, shortCircuitF, ...uzFluid }));
});
w();
w('A plate pack is the same physics with the pack multiplying the settling area, which is why a plate interceptor is far smaller than a basin for the same cut:');
w(`| plates | effective area m2 | design rise m/s | cut micron |`);
w('| --- | --- | --- | --- |');
PLATE_COUNT_SWEEP.forEach((nPlates) => {
  const r = A(`a pack of ${nPlates} plates`, P.plateInterceptor({ flowM3S: uzQ, ...UZERE_PLATES, nPlates, ...uzFluid }));
  w(`| ${nPlates} | ${f6(r.effectiveAreaM2)} | ${f12(r.designRiseMS)} | ${f6(r.d50cMicron)} |`);
});
w(`The effective area is the projected plate area times the plate count times an efficiency factor of ${D.plateEfficiencyFactor}, which is the fraction of the projected area that actually settles. That factor is DECLARED and is worth a large part of the answer: it has no source in this repository.`);
w();

/* ============================================================== SECTION 7 */
w(sec(7, 'The published gravity cases', ['beginner', 'm05']));
w();
w(`The golden file carries ${Object.keys(GOLD).filter((k) => Array.isArray(GOLD[k])).reduce((s, k) => s + GOLD[k].length, 0)} rows in ${Object.keys(GOLD).filter((k) => Array.isArray(GOLD[k])).length} groups. The basin and plate rows are printed here as the golden holds them, beside the engine's own answer at the same inputs.`);
w();
w('| case | golden cut micron | engine cut micron | engine over golden | golden Reynolds | velocity warning expected |');
w('| --- | --- | --- | --- | --- | --- |');
GOLD.apiSeparator.forEach((c, i) => {
  const r = A(`golden basin row ${i + 1}`, P.apiSeparator({
    flowM3S: c.flowM3S, lengthM: c.lengthM, widthM: c.widthM, depthM: c.depthM,
    shortCircuitF: c.shortCircuitF, rhoWater: c.rhoWater, rhoOil: c.rhoOil, muPaS: c.muPaS,
  }));
  w(`| basin ${i + 1}, ${c.flowM3S} m3/s through ${c.lengthM} by ${c.widthM} by ${c.depthM} | ${f6(c.d50cMicron)} | ${f6(r.d50cMicron)} | ${f12(r.d50cMicron / c.d50cMicron)} | ${f6(c.cutReynolds)} | ${yn(c.expectVelocityWarning)} |`);
});
GOLD.plateInterceptor.forEach((c, i) => {
  const r = A(`golden plate row ${i + 1}`, P.plateInterceptor({
    flowM3S: c.flowM3S, plateAreaM2: c.plateAreaM2, nPlates: c.nPlates,
    efficiencyFactor: c.efficiencyFactor, rhoWater: c.rhoWater, rhoOil: c.rhoOil, muPaS: c.muPaS,
  }));
  w(`| plates ${i + 1}, ${c.flowM3S} m3/s through ${c.plateAreaM2} m2 by ${c.nPlates} | ${f6(c.d50cMicron)} | ${f6(r.d50cMicron)} | ${f12(r.d50cMicron / c.d50cMicron)} | ${f6(c.cutReynolds)} | n/a |`);
});
const outOfBand = [...GOLD.apiSeparator, ...GOLD.plateInterceptor, ...GOLD.rise]
  .filter((c) => (c.cutReynolds ?? c.reynolds) > D.stokesReynoldsLimit);
if (!outOfBand.length) {
  throw new Error('GENERATOR REFUSES: this block states that published rows sit outside the creeping flow band and none does');
}
w(`The ratio column is derived, the engine answer over the golden value on the same row. The golden Reynolds column is the golden's own field, and ${outOfBand.length} published row across the basin, plate and rise groups sits OUTSIDE the creeping flow band on purpose, at Reynolds ${outOfBand.map((c) => f6(c.cutReynolds ?? c.reynolds)).join(', ')}: a gate that only ever sees cases inside a band cannot tell that the band is being policed.`);
w(`The plate rows also carry \`channelHeightIndependence\`, which is the oracle marching the same pack at two different channel heights and reporting the difference: ${GOLD.plateInterceptor.map((c) => c.channelHeightIndependence.toExponential(2)).join(', ')} (golden). A plate pack cut must not depend on how the pack is sliced, and that column is the proof rather than the claim.`);
w();

/* ============================================================== SECTION 8 */
w(sec(8, 'What a device does to a distribution', ['beginner', 'm05'], ['intermediate', 'm01']));
w();
w('A cut size on its own does not say what a device removes. The REMOVAL is the grade efficiency integrated against the distribution, and the OUTLET DISTRIBUTION is what the next device sees. That coupling is the whole point of a train.');
w();
w('The reduced-efficiency curve, at both sharpnesses this module uses:');
w(`| droplet over cut | efficiency at m ${GRADE_SHARPNESS[0]} | efficiency at m ${GRADE_SHARPNESS[1]} |`);
w('| --- | --- | --- |');
GRADE_RATIOS.forEach((ratio) => {
  const cells = GRADE_SHARPNESS.map((sharpness) => f12(A(`grade efficiency at ${ratio} and m ${sharpness}`,
    P.gradeEfficiency({ dMicron: ratio * 10, d50cMicron: 10, sharpness }))));
  w(`| ${ratio} | ${cells[0]} | ${cells[1]} |`);
});
w(`Both curves in the table above pass through one half at a ratio of one, which is the definition. The sharper curve separates better either side of the cut: at four times the cut size it removes ${f6(100 * P.gradeEfficiency({ dMicron: 40, d50cMicron: 10, sharpness: 3 }))} percent against ${f6(100 * P.gradeEfficiency({ dMicron: 40, d50cMicron: 10, sharpness: 2 }))}, and at a quarter of it ${f6(100 * P.gradeEfficiency({ dMicron: 2.5, d50cMicron: 10, sharpness: 3 }))} percent against ${f6(100 * P.gradeEfficiency({ dMicron: 2.5, d50cMicron: 10, sharpness: 2 }))}. Sharpness ${D.defaultSharpness} is DECLARED for the gravity and centrifugal devices. Sharpness ${D.interceptionSharpness} is DERIVED for the two interception devices.`);
w();
w(`The UZERE inlet, d50 ${UZERE_INLET.d50Micron} micron at sigma ${UZERE_INLET.sigma}, through one device at several cut sizes, so the removal and the outlet can be read together:`);
w('| cut micron | removal percent | surviving volume | outlet median micron |');
w('| --- | --- | --- | --- |');
[30, 20, 12, 6, 2].forEach((d50cMicron) => {
  const ap = A(`a device at ${d50cMicron} micron`, P.applyDevice({ bins: uzBins.bins, d50cMicron }));
  w(`| ${d50cMicron} | ${f6(ap.removalFraction * 100)} | ${f12(ap.survivingVolume)} | ${f6(P.medianOfBins(ap.outletBins))} |`);
});
w('The surviving volume column is what the outlet bins are normalised by. Below a floor the module stops reporting a median at all, because the shape of numerical dust means nothing:');
const dust = A('a device at a cut far below the water', P.applyDevice({ bins: uzBins.bins, d50cMicron: DUST_CUT_MICRON }));
w(`- a ${DUST_CUT_MICRON} micron cut on this water removes ${f12(dust.removalFraction * 100)} percent, leaves a surviving volume of ${dust.survivingVolume.toExponential(3)}, reports \`outletNormalised\` ${yn(dust.outletNormalised)}, and warns: ${dust.warning}`);
w();
/* ============================================================== SECTION 9 */
w(sec(9, 'The hydrocyclone, on stated geometry', ['intermediate', 'm02']));
w();
w('A de-oiling hydrocyclone spins the water so that the same buoyancy acts in a field hundreds of times gravity. The model states its geometry so the answer can be checked by marching a droplet through it: the liner is a tube, the residence time is its volume over the flow through it, the inlet spreads droplets over the cross-section BY AREA so the median droplet starts at the half-area radius, a droplet is captured when it reaches the oil core, and the cut size is the droplet whose radial migration just crosses that gap in the residence time.');
w();
w(`The KOKORI bank, ${KOKORI_BWPD} bwpd through ${KOKORI_LINERS.nLiners} liners:`);
w(`- ${f12(koCyc.perLinerM3S)} m3/s per liner against a ${koCyc.designFlowPerLinerM3S} m3/s design flow, a turndown of ${f6(koCyc.turndownRatio)}.`);
w(`- field ${f6(koCyc.gField)} g, liner volume ${f12(koCyc.linerVolumeM3)} m3, residence ${f6(koCyc.residenceS)} s.`);
w(`- the droplet has ${f12(koCyc.radialTravelM)} m to cross and ${f12(koCyc.requiredRiseMS)} m/s to do it in, which gives a cut of ${f6(koCyc.d50cMicron)} micron at Reynolds ${f6(koCyc.cutReynolds)}.`);
// THE HALF-AREA RADIUS, MEASURED BACK OUT OF THIS RETURN. It was printed only in
// Section 2, which this tier does not own, so a Professional question resting on
// it had to reach backward out of range for it. Here it is derived from three
// figures of the hydrocyclone's OWN return, which is a better line than the one
// in Section 2 anyway: that one restates one over the root of two and this one
// measures it out of the geometry the engine actually used.
// The radius is taken from the RETURNED volume and length rather than from the
// declared bore, so only the core fraction on this line is read rather than
// measured, and that one is declared and named where it is used.
const koLinerRadiusM = Math.sqrt(koCyc.linerVolumeM3 / (Math.PI * koCyc.linerLengthM));
const koHalfAreaFraction = koCyc.radialTravelM / koLinerRadiusM + D.coreRadiusFraction;
if (!(Math.abs(koHalfAreaFraction - Math.SQRT1_2) <= Number.EPSILON * 8)) {
  throw new Error(`GENERATOR REFUSES: the half-area radius measured out of the hydrocyclone return is ${koHalfAreaFraction} and the criterion is ${Math.SQRT1_2}`);
}
w(`- the half-area radius, as a fraction of the liner radius, MEASURED back out of this return rather than read from a constant: the travel over the radius the returned volume and length give, plus the declared core fraction of ${D.coreRadiusFraction}, is ${f12(koHalfAreaFraction)} (derived, the three figures on this same return). Half the flow area sits inside it, which is why the MEDIAN droplet starts there, and it is the criterion the core refusal below is taken against.`);
w(`- shear penalty ${f6(koCyc.shearPenalty)}, so the ideal cut and the reported cut are the same number here: ${f6(koCyc.idealD50cMicron)} and ${f6(koCyc.d50cMicron)}.`);
w(`- the bank this flow would want at its design point: ${koCyc.linersAtDesignFlow} liners.`);
w(`- cut basis, on every return: ${koCyc.cutBasis}`);
w();
w('THE GEOMETRY BITES, and both dimensions bite for different reasons:');
w('| bore m | length m | volume m3 | residence s | travel m | field g | cut micron |');
w('| --- | --- | --- | --- | --- | --- | --- |');
// THE FIELD COLUMN IS THE POINT OF THE TABLE, not decoration. The claim under
// it is that the bore cannot reach the field, and a claim a reader cannot check
// against a printed column is a claim they have to take on trust.
const boreLeg = [];
LINER_GEOMETRY_SWEEP.forEach((g) => {
  const r = A(`a liner ${g.linerDiameterM} by ${g.linerLengthM}`, P.hydrocyclone({ flowM3S: koQ, ...KOKORI_LINERS, ...g, ...koFluid }));
  if (g.linerLengthM === LINER_BORE_LEG_LENGTH_M) boreLeg.push({ bore: g.linerDiameterM, cut: r.d50cMicron });
  w(`| ${g.linerDiameterM} | ${g.linerLengthM} | ${f12(r.linerVolumeM3)} | ${f6(r.residenceS)} | ${f12(r.radialTravelM)} | ${f6(r.gField)} | ${f6(r.d50cMicron)} |`);
});
// The leg is read in TABLE order and swept in BORE order, which are not the
// same order: the shipped 0.035 liner sits in the length leg above.
// THE CONSTANT PRODUCT IS MEASURED ACROSS THE LEG, never typed, and the build
// stops if the rows do not actually hold it: the sentence below states an
// EXACT power law, and a stated power law that the printed rows do not obey is
// the same defect as the direction this sentence used to get backwards.
boreLeg.sort((a, b) => a.bore - b.bore);
const boreProducts = boreLeg.map((b) => b.cut * Math.sqrt(b.bore));
const boreSpread = Math.max(...boreProducts) - Math.min(...boreProducts);
if (boreLeg.length < 4) throw new Error(`GENERATOR REFUSES: the bore leg is ${boreLeg.length} rows and one or two rows cannot establish a direction`);
if (!(boreSpread < 1e-9)) throw new Error(`GENERATOR REFUSES: the bore leg is stated to go as one over the root of the bore and the products spread by ${boreSpread}`);
for (let i = 1; i < boreLeg.length; i += 1) {
  if (!(boreLeg[i].cut < boreLeg[i - 1].cut)) {
    throw new Error(`GENERATOR REFUSES: the bore leg is stated to be monotone and a bore of ${boreLeg[i].bore} cuts ${boreLeg[i].cut} against ${boreLeg[i - 1].cut} at ${boreLeg[i - 1].bore}`);
  }
}
w(`A longer liner buys residence time at the same travel, and the cut gets finer with it. A WIDER BORE ALSO CUTS FINER, and the reason is worth following, because a bore buys residence time and costs travel at the same time and it is not obvious which wins. THE BORE CANNOT REACH THE FIELD: the field is set by the turndown, which is the flow through one liner over its design flow, and no dimension of the liner enters it, which is why the field column above reads ${f6(koCyc.gField)} g on every row. What is left is a race between the residence and the travel. The residence goes as the SQUARE of the bore, because the liner volume does, while the travel from the half-area radius to the core goes only as the bore itself, so the residence wins by exactly one power and the cut goes as ONE OVER THE SQUARE ROOT OF THE BORE. The ${word(boreLeg.length)} rows at ${LINER_BORE_LEG_LENGTH_M} m of length are that sweep, over a tenfold span of bore from ${boreLeg[0].bore} to ${boreLeg[boreLeg.length - 1].bore} m: the cut times the square root of the bore is ${f6(boreProducts[0])} on every one of them (derived, the bore and the cut on each row, the root taken and multiplied). THE DIRECTION DOES NOT TURN OVER ANYWHERE, and that is a statement about the law rather than about the rows: one over a square root has no turning point, so there is no bore at which a wider liner starts cutting coarser, and a reader hunting this table for the crossover will not find one.`);
w();
w('Where the oil core is taken to sit, which is a DECLARED choice and is the travel the median droplet has to make:');
w('| core radius fraction | travel m | cut micron |');
w('| --- | --- | --- |');
CORE_FRACTION_SWEEP.forEach((coreRadiusFraction) => {
  const r = A(`a core at ${coreRadiusFraction} of the radius`, P.hydrocyclone({ flowM3S: koQ, ...KOKORI_LINERS, coreRadiusFraction, ...koFluid }));
  w(`| ${coreRadiusFraction} | ${f12(r.radialTravelM)} | ${f6(r.d50cMicron)} |`);
});
wRefusalLine(`a core at ${CORE_FRACTION_REFUSED} of the radius`, P.hydrocyclone({ flowM3S: koQ, ...KOKORI_LINERS, coreRadiusFraction: CORE_FRACTION_REFUSED, ...koFluid }));
w(`The refusal is a real criterion and not a range check: past one over the root of two the core is OUTSIDE the half-area radius, so the median droplet starts inside the core and there is nothing for it to cross.`);
w();

/* ============================================================= SECTION 10 */
w(sec(10, 'The envelope, the ceiling and the refusal', ['intermediate', 'm03']));
w();
w('A liner bank is sized in LINERS, and the flow each liner carries is what sets its field. This is the one place in this module where the arithmetic and the engineering pull in opposite directions, and it is the most important section in the course.');
w();
w(`The KOKORI flow, swept DOWNWARD through liner counts. Read the cut size column from the bottom up, which is the direction a designer saving money reads it:`);
w('| liners | m3/s per liner | turndown | field g | shear penalty | ideal cut micron | CUT MICRON | warning |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
const linerRows = [];
LINER_SWEEP.forEach((nLiners) => {
  const r = A(`a bank of ${nLiners} liners`, P.hydrocyclone({ flowM3S: koQ, nLiners, ...koFluid }));
  linerRows.push({ nLiners, cut: r.d50cMicron, turndown: r.turndownRatio, g: r.gField });
  const which = warnLabel(r, [
    ['starved', r.turndownRatio < D.starvedTurndown],
    ['overloaded', r.turndownRatio > D.overloadTurndown],
  ]);
  w(`| ${nLiners} | ${f12(r.perLinerM3S)} | ${f6(r.turndownRatio)} | ${f6(r.gField)} | ${f6(r.shearPenalty)} | ${f6(r.idealD50cMicron)} | ${f6(r.d50cMicron)} | ${which} |`);
});
const best = linerRows.reduce((a, b) => (b.cut < a.cut ? b : a));
const fewestCut = linerRows[linerRows.length - 1];
w();
w(`THE FINEST CUT IN THAT TABLE IS AT ${best.nLiners} LINERS, ${f6(best.cut)} micron at a turndown of ${f6(best.turndown)}, and it is NOT the smallest bank. The smallest bank in the table, ${fewestCut.nLiners} liners, cuts at ${f6(fewestCut.cut)} micron, which is ${f6(fewestCut.cut / best.cut)} times worse (derived, the two cut sizes divided).`);
w(`Two things put the ceiling there. The field goes as the square of the tangential velocity and so as the square of the flow, but only UP TO the top of the operating envelope at ${D.overloadTurndown} times design, because past that the inlet slot chokes and the extra energy goes into pressure drop rather than rotation. So the reported field cannot exceed ${f6(D.gFieldAtDesign * D.overloadTurndown * D.overloadTurndown)} g, and the table shows it sitting there. Above the envelope the cut ALSO carries the root of the overload as an inlet shear penalty, because the shear at the inlet breaks the droplets finer than they arrived. The two together mean the cut gets WORSE from the envelope onward, in direct proportion to the overload.`);
w(`Past ${D.maxTurndown} times design the module stops answering, because the pressure drop and the shear decide the answer there and this model does not carry them. It says how many liners the flow needs:`);
LINER_REFUSED.forEach((nLiners) => {
  wRefusalLine(`${nLiners} liners on the KOKORI flow`, P.hydrocyclone({ flowM3S: koQ, nLiners, ...koFluid }));
});
const starved = A(`a bank of ${LINER_STARVED} liners`, P.hydrocyclone({ flowM3S: koQ, nLiners: LINER_STARVED, ...koFluid }));
w(`And at the other end, a bank running at ${f6(starved.turndownRatio)} of design still ANSWERS, with a cut of ${f6(starved.d50cMicron)} micron and a warning: ${starved.warning}`);
w(`The starved warning and the overload warning are different statements. Starved is advice about how to run the bank you have. Overloaded is a statement that the number beside it is getting worse and that the bank is too small.`);
w();
w('The published liner cases, beside the engine at the same inputs:');
w('| liners | flow m3/s | golden turndown | golden field g | golden cut micron | engine cut micron | oracle capture fraction at the cut |');
w('| --- | --- | --- | --- | --- | --- | --- |');
GOLD.hydrocyclone.forEach((c, i) => {
  const r = A(`golden liner row ${i + 1}`, P.hydrocyclone({
    flowM3S: c.flowM3S, nLiners: c.nLiners, rhoWater: c.rhoWater, rhoOil: c.rhoOil, muPaS: c.muPaS,
    ...(c.linerDiameterM ? { linerDiameterM: c.linerDiameterM } : {}),
    ...(c.linerLengthM ? { linerLengthM: c.linerLengthM } : {}),
    ...(c.designFlowPerLinerM3S ? { designFlowPerLinerM3S: c.designFlowPerLinerM3S } : {}),
    ...(c.gFieldAtDesign ? { gFieldAtDesign: c.gFieldAtDesign } : {}),
    ...(c.coreRadiusFraction ? { coreRadiusFraction: c.coreRadiusFraction } : {}),
  }));
  w(`| ${c.nLiners} | ${c.flowM3S} | ${f6(c.turndownRatio)} | ${f6(c.gField)} | ${f6(c.d50cMicron)} | ${f6(r.d50cMicron)} | ${f6(c.mcCaptureFractionAtCut)} |`);
});
w(`The last column is the golden\'s own field, and it is the most interesting number in the file: the oracle takes the cut size the engine reports, fires droplets of that size from starting radii spread uniformly BY AREA across the liner, marches each one, and counts how many reach the core. It comes out at ${f6(GOLD.hydrocyclone[0].mcCaptureFractionAtCut)} against the one half a cut size is DEFINED as. That is a different method agreeing with the definition, which is the only kind of agreement worth anything.`);
w();

/* ============================================================= SECTION 11 */
w(sec(11, 'Flotation is attachment kinetics', ['intermediate', 'm04']));
w();
w('Gas flotation does not settle droplets, it CARRIES them. Gas is fed to the cell, the bubbles rise, oil droplets collide with them and stick, and the froth is skimmed. So the cut size is a rate question rather than a settling question: the cut is the droplet the cell removes half of in the time the water is in it.');
w();
w('The chain, and every link is a return value:');
w(`- the gas is fed at ${KOKORI_FLOTATION.gasRatio} times the water flow to EACH cell, so ${f12(koFlot.gasFlowPerCellM3S)} m3/s per cell and ${f12(koFlot.totalGasFlowM3S)} m3/s in all.`);
w(`- the cell volume over the cell depth is its plan area, ${f6(koFlot.planAreaM2)} m2, so the superficial gas velocity is ${f12(koFlot.superficialGasMS)} m/s.`);
w(`- a ${koFlot.bubbleMicron} micron bubble rises at ${f12(koFlot.bubbleRiseMS)} m/s at Reynolds ${f6(koFlot.bubbleReynolds)}. That is the FULL DRAG BALANCE rather than Stokes, because at Reynolds in the tens Stokes is no longer the settling law.`);
w(`- the swarm holdup is the gas velocity over the bubble velocity, ${f12(koFlot.gasHoldup)}, and past ${D.gasHoldupWarn} the module warns because coalescing churn is no longer a swarm of independent bubbles.`);
w(`- capture is by INTERCEPTION, efficiency proportional to the square of the droplet over the bubble diameter, so the rate constant is ${f12(koFlot.rateCoefficientPerSPerM2)} per second per square metre of droplet diameter.`);
w(`- residence is ${f6(koFlot.residenceS)} s, and the cut size is the droplet for which the rate times the residence is the log of two: ${f6(koFlot.d50cMicron)} micron.`);
w(`- cut basis, on every return: ${koFlot.cutBasis}`);
w();
w('BECAUSE THE RATE GOES AS THE SQUARE OF THE DROPLET DIAMETER, the sharpness of this device is derived and not chosen. An exponential in the square of the reduced size has the same half point and the same leading power as the reduced-efficiency family at m equal to two, and that is what the train integrates.');
w();
w('The bubble size, which is the difference between the two kinds of cell:');
w(`| bubble micron | rise m/s | Reynolds | holdup | cut micron | cut over the ${BUBBLE_REFERENCE_MICRON} micron cut |`);
w('| --- | --- | --- | --- | --- | --- |');
const flotAt300 = A(`flotation at ${BUBBLE_REFERENCE_MICRON} micron bubbles`, P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, bubbleMicron: BUBBLE_REFERENCE_MICRON, ...koFluid }));
BUBBLE_SWEEP.forEach((bubbleMicron) => {
  const r = A(`flotation at ${bubbleMicron} micron bubbles`, P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, bubbleMicron, ...koFluid }));
  w(`| ${bubbleMicron} | ${f12(r.bubbleRiseMS)} | ${f6(r.bubbleReynolds)} | ${f12(r.gasHoldup)} | ${f6(r.d50cMicron)} | ${f6(r.d50cMicron / flotAt300.d50cMicron)} |`);
});
w(`The last column is derived, each cut over the ${BUBBLE_REFERENCE_MICRON} micron row. The cut goes as the bubble diameter to the three halves, because the rate carries the inverse cube of it and the cut is a square root of a rate: FINER BUBBLES CUT FINER, and that is the entire engineering difference between the two kinds of cell.`);
w();
w('The gas rate, at one bubble size:');
w('| gas to water ratio | superficial gas m/s | holdup | cut micron | warning |');
w('| --- | --- | --- | --- | --- |');
GAS_RATIO_SWEEP.forEach((gasRatio) => {
  const r = A(`flotation at a gas ratio of ${gasRatio}`, P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, gasRatio, ...koFluid }));
  w(`| ${gasRatio} | ${f12(r.superficialGasMS)} | ${f12(r.gasHoldup)} | ${f6(r.d50cMicron)} | ${flotWarn(r)} |`);
});
wRefusalLine(`a gas to water ratio of ${FLOTATION_REFUSED.gasRatio}`, P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, gasRatio: FLOTATION_REFUSED.gasRatio, ...koFluid }));
wRefusalLine(`a ${FLOTATION_REFUSED.bubbleMicron} micron bubble`, P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, bubbleMicron: FLOTATION_REFUSED.bubbleMicron, ...koFluid }));
wRefusalLine(`an attachment efficiency of ${FLOTATION_REFUSED.attachmentEfficiency}`, P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, attachmentEfficiency: FLOTATION_REFUSED.attachmentEfficiency, ...koFluid }));
w();
// THE RESIDENCE WARNING IS DEMONSTRATED RATHER THAN ASSERTED. The section
// printed the KOKORI residence and never the warning or its threshold, so the
// one device warning this module carries that is about the CELL rather than
// about the gas was the only one a reader had to take on trust.
//
// THE STRADDLE IS THE PUBLISHED ONE, chosen off the golden's own fields rather
// than invented here, because a cell shrunk on the KOKORI stream until it warns
// also drives the holdup past its own limit and fires BOTH warnings at once,
// which demonstrates neither. These two rows differ in cell volume alone and
// the holdup is inside the swarm limit on both.
const residenceStraddle = (() => {
  const cand = GOLD.flotation.filter((c) => 'expectResidenceWarning' in c && c.expectHoldupWarning === false);
  const sorted = [...cand].sort((a, b) => Math.abs(a.residenceS - D.flotationResidenceWarnS) - Math.abs(b.residenceS - D.flotationResidenceWarnS));
  const pair = sorted.slice(0, 2).sort((a, b) => b.residenceS - a.residenceS);
  if (pair.length !== 2 || pair[0].expectResidenceWarning !== false || pair[1].expectResidenceWarning !== true) {
    throw new Error('GENERATOR REFUSES: the golden carries no clean pair straddling the flotation residence threshold with the holdup warning off on both sides');
  }
  return pair;
})();
w(`THE RESIDENCE WARNING, AND THE THRESHOLD IT IS JUDGED AGAINST. The residence is the total cell volume over the flow, the threshold is DECLARED as \`flotationResidenceWarnS\` at ${D.flotationResidenceWarnS} s, and the warning quotes the figure it judged against so a reader can disagree with it. The KOKORI cells sit at ${f6(koFlot.residenceS)} s, far above it. The published pair that straddles the threshold runs ${residenceStraddle[0].flowM3S} m3/s through one cell of ${residenceStraddle[0].cellDepthM} m depth at a gas ratio of ${residenceStraddle[0].gasRatio} and a ${residenceStraddle[0].bubbleMicron} micron bubble, and the two rows differ in the CELL VOLUME alone:`);
w('| cell m3 | residence s | holdup | cut micron | warning |');
w('| --- | --- | --- | --- | --- |');
const straddleRows = residenceStraddle.map((c) => {
  const r = A(`the published residence straddle at ${c.cellVolumeM3} m3`, P.flotation({
    flowM3S: c.flowM3S, cellVolumeM3: c.cellVolumeM3, nCells: c.nCells, cellDepthM: c.cellDepthM,
    gasRatio: c.gasRatio, bubbleMicron: c.bubbleMicron,
    rhoWater: c.rhoWater, rhoOil: c.rhoOil, muPaS: c.muPaS,
  }));
  w(`| ${c.cellVolumeM3} | ${f6(r.residenceS)} | ${f12(r.gasHoldup)} | ${f6(r.d50cMicron)} | ${flotWarn(r)} |`);
  return r;
});
w(`- the warning in full, as the engine returns it: ${straddleRows[1].warning}`);
w(`Two seconds of residence either side of the threshold is the whole difference between those rows, and the holdup is under the ${D.gasHoldupWarn} swarm limit on both, so this warning is shown on its own rather than tangled with the other one. THE CUT SIZE IS THE SAME NUMBER ON BOTH ROWS, ${f6(straddleRows[0].d50cMicron)} micron, and that is not a coincidence: a smaller cell is a shorter residence AND a higher gas flux through a smaller plan area, the rate carries the flux and the cut is the droplet for which the rate times the residence is the log of two, so the cell volume cancels out of the cut entirely. The warning is a statement about the CELL and about how little time the attachment process is being given, and the cut size beside it will not show it.`);
w();
w('The cell depth, which is what turns a cell volume into the plan area the gas rises through, and is an input:');
w('| cell depth m | plan area m2 | superficial gas m/s | cut micron |');
w('| --- | --- | --- | --- |');
CELL_DEPTH_SWEEP.forEach((cellDepthM) => {
  const r = A(`flotation in a ${cellDepthM} m cell`, P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, cellDepthM, ...koFluid }));
  w(`| ${cellDepthM} | ${f6(r.planAreaM2)} | ${f12(r.superficialGasMS)} | ${f6(r.d50cMicron)} |`);
});
w('A DEEPER cell at the same volume is a NARROWER cell, so the same gas rises through less plan area, the gas flux is higher and the cut is finer. Nothing about that is obvious from a residence time, which is why the depth had to become an input.');
w();

/* ============================================================= SECTION 12 */
w(sec(12, 'Two kinds of cell, and an invariance', ['intermediate', 'm04', 'l05'], ['intermediate', 'm06']));
w();
w('Induced gas flotation entrains coarse bubbles mechanically. Dissolved gas flotation saturates water under pressure and releases very fine bubbles at a low gas rate. They are two boxes on the same model, and the model is what makes them different devices:');
w('| preset | gas ratio | bubble micron | superficial gas m/s | cut micron |');
w('| --- | --- | --- | --- | --- |');
[['induced gas', IGF_PRESET], ['dissolved gas', DAF_PRESET]].forEach(([name, preset]) => {
  const r = A(`the ${name} preset`, P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, ...preset, ...koFluid }));
  w(`| ${name} | ${preset.gasRatio} | ${preset.bubbleMicron} | ${f12(r.superficialGasMS)} | ${f6(r.d50cMicron)} |`);
});
const igfR = A('the induced preset', P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, ...IGF_PRESET, ...koFluid }));
const dafR = A('the dissolved preset', P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, ...DAF_PRESET, ...koFluid }));
w(`The dissolved cell cuts ${f6(igfR.d50cMicron / dafR.d50cMicron)} times finer on ${f6(DAF_PRESET.gasRatio / IGF_PRESET.gasRatio)} times the gas (both derived, the pairs of figures on those two rows divided). A model in which the bubble size could not move the cut would make these the same device, and no amount of menu would change that.`);
w();
w('THE INVARIANCE, which is the other half of the same design. How you COUNT the cells must not change the answer at equal total volume and equal total gas. The gas ratio here is scaled by the cell count so the unit is fed the same gas whatever the arrangement:');
w('| cells | m3 each | total m3 | ratio per cell | total gas m3/s | residence s | cut micron |');
w('| --- | --- | --- | --- | --- | --- | --- |');
const arrangement = [];
CELL_ARRANGEMENT.forEach((a) => {
  const gasRatio = ARRANGEMENT_TOTAL_GAS_RATIO / a.nCells;
  const r = A(`${a.nCells} cells of ${a.cellVolumeM3} m3`, P.flotation({
    flowM3S: koQ, nCells: a.nCells, cellVolumeM3: a.cellVolumeM3,
    cellDepthM: KOKORI_FLOTATION.cellDepthM, bubbleMicron: KOKORI_FLOTATION.bubbleMicron,
    gasRatio, ...koFluid,
  }));
  arrangement.push(r.d50cMicron);
  w(`| ${a.nCells} | ${a.cellVolumeM3} | ${f6(a.nCells * a.cellVolumeM3)} | ${f12(gasRatio)} | ${f12(r.totalGasFlowM3S)} | ${f6(r.residenceS)} | ${f6(r.d50cMicron)} |`);
});
const spread = Math.max(...arrangement) - Math.min(...arrangement);
w(`The total volume column is derived. Every cut size in that column is the same number: the spread across the four arrangements is ${spread.toExponential(2)} micron (derived, the largest minus the smallest), which is machine noise and not a difference. A jest test asserts this to 1e-12.`);
w(`The cell count DOES move the answer when the gas ratio is held instead, and it should: four cells at a ratio use four times the gas of one. The return reports the gas per cell and the total, so that reason is on the screen rather than inferred.`);
w();

/* ============================================================= SECTION 13 */
w(sec(13, 'The bed, and a cut size that is an inversion rather than a second opinion', ['intermediate', 'm05']));
w();
w('A walnut shell or media bed does not screen droplets out, it captures them on the grains as the water passes: DEPTH FILTRATION. The penetration through a depth falls exponentially, the filter coefficient of a droplet goes as the square of its diameter and the inverse cube of the grain, and it falls with loading rate. The cut size is then the droplet the bed removes half of over its own depth, which is an INVERSION of that same law and not a rival to it.');
w();
w(`The KOKORI bed, ${KOKORI_FILTER.areaM2} m2 and ${KOKORI_FILTER.bedDepthM} m deep on ${KOKORI_FILTER.mediaMicron} micron media:`);
w(`- loading ${f6(koFilt.loadingMHr)} m/hr, filter coefficient ${f12(koFilt.filterCoefficientPerM)} per m at the ${koFilt.referenceDropletMicron} micron reference droplet.`);
w(`- penetration at that reference droplet ${f12(koFilt.penetrationAtRefDroplet)}, so removal ${f6(koFilt.removalAtRefDroplet * 100)} percent of the oil at that ONE size.`);
w(`- cut size ${f6(koFilt.d50cMicron)} micron.`);
w(`- cut basis, on every return: ${koFilt.cutBasis}`);
w();
w('The bed depth, which is the input a depth filtration model must respond to:');
w('| depth m | lambda per m | removal at the reference droplet percent | cut micron | cut times the root of the depth |');
w('| --- | --- | --- | --- | --- |');
BED_DEPTH_SWEEP.forEach((bedDepthM) => {
  const r = A(`a bed ${bedDepthM} m deep`, P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER, bedDepthM }));
  w(`| ${bedDepthM} | ${f12(r.filterCoefficientPerM)} | ${f6(r.removalAtRefDroplet * 100)} | ${f6(r.d50cMicron)} | ${f6(r.d50cMicron * Math.sqrt(bedDepthM))} |`);
});
w(`The last column is derived, the cut times the square root of the depth on the same row. It is constant, which says the cut goes as one over the root of the depth exactly, so the depth moves the cut by a factor of ${f6(A('the shallowest bed', P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER, bedDepthM: BED_DEPTH_SWEEP[0] })).d50cMicron / A('the deepest bed', P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER, bedDepthM: BED_DEPTH_SWEEP[BED_DEPTH_SWEEP.length - 1] })).d50cMicron)} across this sweep.`);
w();
w('The grain size, and the ONE HELD exponent in this device:');
w(`| media micron | lambda per m | cut micron | lambda over the ${D.filterReferenceMediaMicron} micron row |`);
w('| --- | --- | --- | --- |');
const lamRef = A('the reference grain', P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER, mediaMicron: D.filterReferenceMediaMicron }));
MEDIA_SWEEP.forEach((mediaMicron) => {
  const r = A(`${mediaMicron} micron media`, P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER, mediaMicron }));
  w(`| ${mediaMicron} | ${f12(r.filterCoefficientPerM)} | ${f6(r.d50cMicron)} | ${f6(r.filterCoefficientPerM / lamRef.filterCoefficientPerM)} |`);
});
w(`The last column is derived, each lambda over the row at the module's own reference grain of ${D.filterReferenceMediaMicron} micron. It is the CUBE of the grain ratio, because both the number of collectors per unit volume and the interception efficiency of each one depend on the grain size. THAT EXPONENT IS HELD FOR LITERATURE: the interception derivation gives the cube, it is a strong dependence, and this repository carries no bed data to check it against. A reader should treat the grain column as the model's statement and not as a measurement. At the reference grain the factor is exactly one, which is why the graded capstone beds are packed there.`);
w();
w('The loading rate, which is the only thing the area changes:');
w('| area m2 | loading m/hr | lambda per m | cut micron | warning |');
w('| --- | --- | --- | --- | --- |');
LOADING_AREA_SWEEP.forEach((areaM2) => {
  const r = A(`a ${areaM2} m2 bed`, P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER, areaM2 }));
  w(`| ${areaM2} | ${f6(r.loadingMHr)} | ${f12(r.filterCoefficientPerM)} | ${f6(r.d50cMicron)} | ${warnLabel(r, [
    ['above the breakthrough loading', r.loadingMHr > D.filterBreakthroughLoadingMHr],
  ])} |`);
});
w(`Lambda falls as the loading rate to the power ${D.filterLoadingExponent}, from a value DECLARED at ${D.filterReferenceLoadingMHr} m/hr, and the module warns above ${D.filterBreakthroughLoadingMHr} m/hr because a bed loses depth capture at that rate and breaks through early. The reference triple, ${D.filterCoefficientPerM} per m at a ${D.filterReferenceDropletMicron} micron droplet, ${D.filterReferenceMediaMicron} micron media and ${D.filterReferenceLoadingMHr} m/hr, is ONE calibration of this module with no published source here.`);
w();
// THE FLOOR IS THE FC7-1 REPAIR AND THIS SECTION OWNS IT. A device whose one
// refusal is never shown refusing is a device a reader can only take the
// declared constant's word for, which is what both tier writers had to do.
const floorRefusals = FILTER_FLOOR_REFUSED_AREAS.map((areaM2) => mustRefuse(
  `a ${areaM2} m2 bed on this flow`,
  P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER, areaM2 }),
));
// THE BED AT THE FLOOR IS READ OFF THE REFUSAL, never computed here. The
// refusal's job is to name the bed that would work, and a digest that computed
// that number itself would be checking its own arithmetic rather than the
// engine's answer.
const areaAtFloor = floorRefusals[0].areaAtFloorM2;
floorRefusals.forEach((r) => {
  if (r.areaAtFloorM2 !== areaAtFloor) {
    throw new Error(`GENERATOR REFUSES: two refusals on one flow name different beds at the floor, ${r.areaAtFloorM2} and ${areaAtFloor}`);
  }
});
w(`THE FLOOR UNDER THE LOADING RATE, which is the one place this device REFUSES. Widening a bed lowers its loading, and past a point the loading falls under the ${D.filterMinLoadingMHr} m/hr this module answers above. The reason is on the refusal rather than in a range check: the filter coefficient is DECLARED at ${D.filterReferenceLoadingMHr} m/hr, the loading exponent is the only velocity dependence in this model, and at the floor the declared law is already claiming several times the one coefficient there is any calibration for. On the KOKORI flow, the last beds that answer:`);
w('| area m2 | loading m/hr | lambda per m | cut micron |');
w('| --- | --- | --- | --- |');
FILTER_FLOOR_ANSWER_AREAS.forEach((areaM2) => {
  const r = A(`a ${areaM2} m2 bed above the floor`, P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER, areaM2 }));
  w(`| ${areaM2} | ${f6(r.loadingMHr)} | ${f12(r.filterCoefficientPerM)} | ${f6(r.d50cMicron)} |`);
});
w('And the beds that do not, each refused by name:');
FILTER_FLOOR_REFUSED_AREAS.forEach((areaM2) => {
  wRefusalLine(`a ${areaM2} m2 bed on this flow`, P.mediaFilter({ flowM3S: koQ, ...KOKORI_FILTER, areaM2 }));
});
w(`- the bed that would run this flow AT the floor, which every one of those refusals names and which the return carries as \`areaAtFloorM2\`: ${f6(areaAtFloor)} m2, against the ${KOKORI_FILTER.areaM2} m2 bed this stream actually runs.`);
w(`THE REFUSAL NAMES FOUR THINGS and each of them is doing work: the loading it was given, the floor it is under, the reference loading the coefficient is declared at, and the bed that would reach the floor. A reader who wanted an answer below ${D.filterMinLoadingMHr} m/hr is told what to change and by how much. What a bed really does far below its design rate is HELD FOR LITERATURE, which is why this is a refusal rather than a warning: the module will not extend a one-point calibration downward by three orders of magnitude and then report the result as a cut size.`);
w();
w('The published bed cases, beside the engine:');
w('| area m2 | depth m | media micron | golden loading m/hr | golden lambda per m | golden cut micron | engine cut micron |');
w('| --- | --- | --- | --- | --- | --- | --- |');
GOLD.mediaFilter.forEach((c, i) => {
  const r = A(`golden bed row ${i + 1}`, P.mediaFilter({
    flowM3S: c.flowM3S, areaM2: c.areaM2,
    ...(c.bedDepthM ? { bedDepthM: c.bedDepthM } : {}),
    ...(c.mediaMicron ? { mediaMicron: c.mediaMicron } : {}),
    ...(c.filterCoefficientPerM ? { filterCoefficientPerM: c.filterCoefficientPerM } : {}),
  }));
  w(`| ${c.areaM2} | ${c.bedDepthM ?? D.filterBedDepthDefaultM} | ${c.mediaMicron ?? D.filterReferenceMediaMicron} | ${f6(c.loadingMHr)} | ${f12(c.lambdaAtRefPerM)} | ${f6(c.d50cMicron)} | ${f6(r.d50cMicron)} |`);
});
w('The golden carries no removal fraction for this device and the engine returns none: there is ONE route through this model now, and the cut size the train reads is an inversion of the depth filtration the oracle marches layer by layer.');
w();
/* ============================================================= SECTION 14 */
w(sec(14, 'The train, and why three good devices are not one great one', ['intermediate', 'm06'], ['advanced', 'm01']));
w();
w('A train carries the OUTLET distribution forward at every stage. Each device removes the droplets it is good at, so the next device faces finer water than the inlet did and performs worse on it than its own cut size suggests. A table of fixed efficiencies throws exactly that away.');
w();
w(`The OGBOTOBO train, ${OGBOTOBO_INLET.oiwPpm} ppm at d50 ${OGBOTOBO_INLET.d50Micron} micron and sigma ${OGBOTOBO_INLET.sigma}, four stages:`);
w('| stage | cut micron | sharpness | removal percent | outlet ppm | outlet median micron | warning |');
w('| --- | --- | --- | --- | --- | --- | --- |');
ogTrain.stages.forEach((s) => {
  w(`| ${s.name} | ${f6(s.d50cMicron)} | ${s.sharpness} | ${f6(s.removalPct)} | ${f6(s.outletOiwPpm)} | ${f6(s.outletMedianMicron)} | ${s.warning ? s.warning.split(';')[0] : 'none'} |`);
});
w(`- overall ${f6(ogTrain.overallRemovalPct)} percent, ${ogTrain.overallRemovalBasis}.`);
w(`- ${ogTrain.stagesRun} of ${ogTrain.stages.length} stages ran, complete ${yn(ogTrain.complete)}, stages skipped ${ogTrain.stagesSkipped}.`);
w(`- the droplet median falls from ${f6(ogTrain.inletMedianMicron)} to ${f6(ogTrain.outletMedianMicron)} micron against a typed inlet d50 of ${ogTrain.inletD50Micron}.`);
w(`- the grid: ${ogTrain.nBins} bins over ${ogTrain.spanSigma} sigma, truncated tail ${f12(ogTrain.truncatedTailFraction)}.`);
w(`- basis, on every return: ${ogTrain.concentrationBasis}`);
w();
w(`THE COUPLING, ISOLATED. ${IDENTICAL_STAGE_COUNT} IDENTICAL devices in series, each cutting at ${IDENTICAL_STAGE_CUT_MICRON} micron, on the OGBOTOBO inlet water. If a device were a fixed efficiency, every row of the removal column would be the same number:`);
w('| stage | removal percent this stage | outlet ppm | outlet median micron | removal as a fraction of the first stage |');
w('| --- | --- | --- | --- | --- |');
const identical = A('a train of identical devices', P.treatmentTrain({
  inletOiwPpm: OGBOTOBO_INLET.oiwPpm, inletD50Micron: OGBOTOBO_INLET.d50Micron,
  sigma: OGBOTOBO_INLET.sigma,
  devices: Array.from({ length: IDENTICAL_STAGE_COUNT }, (unused, i) => ({
    name: `stage ${i + 1}`, d50cMicron: IDENTICAL_STAGE_CUT_MICRON, sharpness: D.defaultSharpness,
  })),
}));
identical.stages.forEach((s, i) => {
  w(`| ${i + 1} | ${f6(s.removalPct)} | ${f6(s.outletOiwPpm)} | ${f6(s.outletMedianMicron)} | ${f6(s.removalPct / identical.stages[0].removalPct)} |`);
});
w(`The last column is derived, each stage removal over the first stage's. The fifth identical device removes ${f6(identical.stages[IDENTICAL_STAGE_COUNT - 1].removalPct)} percent where the first removed ${f6(identical.stages[0].removalPct)}, because the water reaching it has had its coarse oil taken out ${IDENTICAL_STAGE_COUNT - 1} times already. Multiplying ${f6(identical.stages[0].removalPct)} percent devices five times over would predict an outlet of ${f6(OGBOTOBO_INLET.oiwPpm * (1 - identical.stages[0].removalPct / 100) ** IDENTICAL_STAGE_COUNT)} ppm (derived, the first stage removal compounded); the train says ${f6(identical.outletOiwPpm)} ppm.`);
w();
w('THE ORDER OF THE STAGES CHANGES EVERY STAGE NUMBER AND NOT THE FINAL ANSWER, and the reason is worth more than either fact. A device removes a fixed FRACTION of each droplet size, so the volume surviving in any one size bin is the PRODUCT of the survivals across the devices, and a product does not care what order it is taken in. The OGBOTOBO devices, as designed and reversed:');
const reversed = A('the reversed train', P.treatmentTrain({
  inletOiwPpm: OGBOTOBO_INLET.oiwPpm, inletD50Micron: OGBOTOBO_INLET.d50Micron,
  sigma: OGBOTOBO_INLET.sigma, devices: [...ogDevices].reverse(),
}));
const outletGap = Math.abs(reversed.outletOiwPpm - ogTrain.outletOiwPpm) / ogTrain.outletOiwPpm;
if (!(outletGap < 1e-12)) {
  throw new Error(`GENERATOR REFUSES: this block states the train outlet is invariant under reordering and the two outlets differ by ${outletGap} relative`);
}
const stageGaps = ogTrain.stages.map((st, i) => Math.abs(st.removalPct - reversed.stages[i].removalPct));
if (!stageGaps.some((g) => g > 1)) {
  throw new Error('GENERATOR REFUSES: this block states the stage removals move under reordering and none of them moved by a whole point');
}
w('| position | device as designed | removal percent | device reversed | removal percent |');
w('| --- | --- | --- | --- | --- |');
ogTrain.stages.forEach((st, i) => {
  w(`| ${i + 1} | ${st.name} | ${f6(st.removalPct)} | ${reversed.stages[i].name} | ${f6(reversed.stages[i].removalPct)} |`);
});
w(`- the outlet concentration is ${f6(ogTrain.outletOiwPpm)} ppm both ways, agreeing to ${outletGap.toExponential(2)} relative, which is float rounding and not a difference.`);
w(`- the outlet median is ${f6(ogTrain.outletMedianMicron)} micron both ways.`);
w(`- the per-stage removals move by as much as ${f6(Math.max(...stageGaps))} percentage points.`);
w('So a reader comparing two trains must compare their OUTLETS, and a reader judging one stage must know what reached it. And the engineering question the identity does not answer is why a designer still puts the coarse device first: fouling, plugging and how much oil each device can take in its reject are what decide that, and this module carries none of them. An invariance in a model is a statement about the model.');
w();
w('The published train cases, beside the engine at the same inputs. These carry the oracle\'s particle tracking result, which is a different method entirely:');
w('| case | golden outlet ppm | engine outlet ppm | golden outlet median | engine outlet median | oracle samples |');
w('| --- | --- | --- | --- | --- | --- |');
GOLD.train.forEach((c, i) => {
  const r = A(`golden train row ${i + 1}`, P.treatmentTrain({
    inletOiwPpm: c.inletOiwPpm, inletD50Micron: c.inletD50Micron, sigma: c.sigma,
    spanSigma: c.spanSigma, devices: c.devices,
  }));
  w(`| ${c.label} | ${f6(c.outletOiwPpm)} | ${f6(r.outletOiwPpm)} | ${f6(c.outletMedianMicron)} | ${f6(r.outletMedianMicron)} | ${c.samples} |`);
});
w('The golden values in that table are not the engine\'s own answer recorded back: they are 400,000 droplets each carrying a surviving weight through every stage, with no binning anywhere. That is what validates the quadrature, the coupling, the outlet concentration, every stage and both medians at once.');
w();

/* ============================================================= SECTION 15 */
w(sec(15, 'The two medians, and the grid they are measured on', ['advanced', 'm02']));
w();
w('A train reports two droplet medians, an inlet one and an outlet one, and a reader is going to compare them. That only means something if they are measured the same way.');
w();
w('Both are the volume median of the same bin set, interpolated in LOG diameter across the bin the median falls in. The engine says so on every return:');
w(`- ${ogTrain.medianBasis}`);
w(`- the inlet median, ${f6(ogTrain.inletMedianMicron)} micron, reproduces the typed d50 of ${ogTrain.inletD50Micron} to ${(Math.abs(ogTrain.inletMedianMicron - ogTrain.inletD50Micron) / ogTrain.inletD50Micron).toExponential(2)} relative (derived, the difference over the typed value). The typed figure is kept beside it as \`inletD50Micron\`.`);
w();
w('WHY INTERPOLATION RATHER THAN THE BIN MIDPOINT. One step of this grid is a few percent of a diameter, so a median read as a bare midpoint is quantised to the grid, and a bin wide enough to hold six orders of magnitude of outlet concentration reports one value for all of them. Interpolated, the median tracks the cut:');
w('| cut micron | outlet ppm on the OGBOTOBO inlet | outlet median micron |');
w('| --- | --- | --- |');
[20, 12, 8, 5, 3, 1.5].forEach((d50cMicron) => {
  const t = A(`one device at ${d50cMicron} micron`, P.treatmentTrain({
    inletOiwPpm: OGBOTOBO_INLET.oiwPpm, inletD50Micron: OGBOTOBO_INLET.d50Micron,
    sigma: OGBOTOBO_INLET.sigma,
    devices: [{ name: 'one device', d50cMicron, sharpness: D.defaultSharpness }],
  }));
  w(`| ${d50cMicron} | ${f6(t.outletOiwPpm)} | ${f6(t.outletMedianMicron)} |`);
});
w('The medians fall monotonically as the cut tightens, which is the property a quantised median cannot have. A jest test asserts it.');
w();
w('The published bin grid cases:');
w('| d50 (stated) | sigma (stated) | bins (stated) | span (stated) | golden median | golden truncated tail |');
w('| --- | --- | --- | --- | --- | --- |');
GOLD.binGrid.forEach((c) => {
  w(`| ${c.d50} | ${c.sigma} | ${c.nBins ?? D.defaultNBins} | ${c.spanSigma ?? D.defaultSpanSigma} | ${f6(c.medianMicron)} | ${f12(c.truncatedTailFraction)} |`);
});
w();

/* ============================================================= SECTION 16 */
w(sec(16, 'A refusal, a withheld verdict, and the difference', ['advanced', 'm03'], ['advanced', 'm04']));
w();
w('This module has three ways of not answering, and telling them apart is most of what an Expert reader is for.');
w();
w('ONE: A REFUSAL. The input is one this method cannot use, so the return is an object carrying a named `error` and nothing that could pass for an answer. The contract census, measured rather than listed:');
w('| export | given a question it can answer | given one it cannot |');
w('| --- | --- | --- |');
CENSUS.rows.forEach((r) => w(`| ${r.name} | ${r.answers} | ${r.refuses} |`));
w(`The ${CENSUS.rows.filter((r) => r.refuses === 'a bare NaN').length} LEAVES are ${CENSUS.rows.filter((r) => r.refuses === 'a bare NaN').map((r) => r.name).join(', ')}. They are helpers with nowhere to put an error key, they return a bare NaN rather than a number that could pass for an answer, and their callers inside the module turn that NaN into a named refusal. That is a documented contract rather than an oversight:`);
wLeafNaN('gradeEfficiency at a cut size of zero', P.gradeEfficiency({ dMicron: 20, d50cMicron: 0 }));
wLeafNaN('medianOfBins on an empty bin set', P.medianOfBins([]));
wLeafNaN('logNormalCdf at a negative diameter', P.logNormalCdf({ d: -5, d50: 25, sigma: 0.8 }));
wRefusalLine('applyDevice at a cut size of zero, which is the caller that turns that NaN into a name', P.applyDevice({ bins: uzBins.bins, d50cMicron: 0 }));
w();
w('The band edges, each refused by name and each stated on the refusal:');
wRefusalLine(`a water temperature of ${VISC_BAND.aboveHigh} C`, P.waterViscosityPaS({ tC: VISC_BAND.aboveHigh, tdsPpm: 0 }));
wRefusalLine(`a water temperature of ${VISC_BAND.belowLow} C`, P.waterViscosityPaS({ tC: VISC_BAND.belowLow, tdsPpm: 0 }));
wRefusalLine(`a brine density at ${DENSITY_BAND.aboveHigh} C`, P.waterDensityKgM3({ tC: DENSITY_BAND.aboveHigh, tdsPpm: 0 }));
wRefusalLine(`${TDS_BAND.justOver} ppm TDS`, P.waterViscosityPaS({ tC: 40, tdsPpm: TDS_BAND.justOver }));
wRefusalLine(`${TDS_BAND.negative} ppm TDS`, P.waterViscosityPaS({ tC: 40, tdsPpm: TDS_BAND.negative }));
wRefusalLine(`${API_BAND.aboveHigh} API`, P.oilDensityKgM3({ apiGravity: API_BAND.aboveHigh, tC: 40 }));
wRefusalLine(`${API_BAND.infinite} API, where the specific gravity denominator is zero`, P.oilDensityKgM3({ apiGravity: API_BAND.infinite, tC: 40 }));
wRefusalLine('an oil heavier than the water', P.stokesRiseMS({ dMicron: 30, rhoWater: 860, rhoOil: 1010, muPaS: 6e-4 }));
w(`THAT RISE VELOCITY REFUSAL IS THE FIRST OF FIVE DOORS ON ONE BAD FLUID, and the count is worth stating exactly, because it is the count the repair was about and a reader will be asked to hold it. FIVE DOORS, FOUR OF THEM DEVICES: \`stokesRiseMS\` above is the door that is not a device, and the four below are the devices. Each refuses in its own words rather than through one shared sentence:`);
const badFluid = { rhoWater: 860, rhoOil: 1010, muPaS: 6e-4 };
wRefusalLine('a gravity separator on an oil heavier than its water', P.apiSeparator({ flowM3S: 0.02, lengthM: 10, widthM: 3, depthM: 1.2, ...badFluid }));
wRefusalLine('a plate pack on the same fluid', P.plateInterceptor({ flowM3S: 0.02, plateAreaM2: 2, nPlates: 40, ...badFluid }));
wRefusalLine('a hydrocyclone on the same fluid', P.hydrocyclone({ flowM3S: 0.02, nLiners: 60, ...badFluid }));
wRefusalLine('flotation on the same fluid', P.flotation({ flowM3S: 0.02, cellVolumeM3: 20, nCells: 2, ...badFluid }));
wRefusalLine('a missing viscosity into a plate pack', P.plateInterceptor({ flowM3S: 0.02, plateAreaM2: 2, nPlates: 40, rhoWater: 1010, rhoOil: 860 }));
wRefusalLine('a train given something that is not an array of devices', P.treatmentTrain({ inletOiwPpm: 500, inletD50Micron: 25, devices: null }));
w();
w('TWO: A WITHHELD VERDICT. The train ran, the concentrations are real, and the PASS OR FAIL is not reported, with a reason. This is not the same as a refusal and it is not the same as a failure:');
const broken = A('a train with a stage that cannot run', P.treatmentTrain({
  inletOiwPpm: OGBOTOBO_INLET.oiwPpm, inletD50Micron: OGBOTOBO_INLET.d50Micron,
  sigma: OGBOTOBO_INLET.sigma, specPpm: OGBOTOBO_SPEC_LOOSE_PPM,
  devices: [
    { name: 'API 421 basin', ...ogBasin },
    { name: 'CPI plate pack', ...P.plateInterceptor({ flowM3S: ogQ, plateAreaM2: BROKEN_PLATE_AREA, nPlates: 40, ...ogFluid }) },
    { name: 'Walnut shell filter', ...ogFilt },
  ],
}));
w(`- a three stage train with the plate area box cleared: ${broken.stagesRun} of ${broken.stages.length} stages ran, complete ${yn(broken.complete)}, skipped ${JSON.stringify(broken.skippedStages)}.`);
w(`- it still reports concentrations: ${f6(broken.outletOiwPpm)} ppm and ${f6(broken.overallRemovalPct)} percent, ${broken.overallRemovalBasis}.`);
w(`- and it reports NO verdict: meetsSpec ${String(broken.meetsSpec)}, marginPpm ${String(broken.marginPpm)}.`);
w(`- the reason: ${broken.verdictWithheldReason}`);
w(`- the stage that did not run carries nothing but its name and its cause: ${JSON.stringify(broken.stages[1])}`);
w('A stage that did not run carries its NAME and its CAUSE and nothing else, so a stage that is not there cannot show a confident process warning beside its own failure.');
w();
w('The other two reasons a verdict is withheld, both on a train that ran completely:');
const noSpec = A('the OGBOTOBO train with no spec', ogTrain);
w(`- no specification given: meetsSpec ${String(noSpec.meetsSpec)}, reason "${noSpec.verdictWithheldReason}".`);
const zeroSpec = A('the OGBOTOBO train at a spec of zero', P.treatmentTrain({
  inletOiwPpm: OGBOTOBO_INLET.oiwPpm, inletD50Micron: OGBOTOBO_INLET.d50Micron,
  sigma: OGBOTOBO_INLET.sigma, devices: ogDevices, specPpm: 0,
}));
w(`- a specification of zero: meetsSpec ${String(zeroSpec.meetsSpec)}, reason "${zeroSpec.verdictWithheldReason}". A specification of zero is a MISSING INPUT and not a failing train, and the module says which of the two it is rather than leaving a reader to read a blank as a failure.`);
w();
w('THREE: A WARNING. The answer is reported AND the module says something about it. A warning never withholds anything, and every one of them names a quantity and a threshold. The verdict machinery itself, on two specification figures:');
w('| spec ppm | outlet ppm | meets spec | margin ppm |');
w('| --- | --- | --- | --- |');
[OGBOTOBO_SPEC_TIGHT_PPM, OGBOTOBO_SPEC_LOOSE_PPM].forEach((specPpm) => {
  const t = A(`the OGBOTOBO train against ${specPpm} ppm`, P.treatmentTrain({
    inletOiwPpm: OGBOTOBO_INLET.oiwPpm, inletD50Micron: OGBOTOBO_INLET.d50Micron,
    sigma: OGBOTOBO_INLET.sigma, devices: ogDevices, specPpm,
  }));
  w(`| ${specPpm} | ${f6(t.outletOiwPpm)} | ${yn(t.meetsSpec)} | ${f6(t.marginPpm)} |`);
});
w(`NEITHER OF THOSE TWO FIGURES IS A LIMIT. They are two arbitrary numbers, chosen here only to show which branch of the comparison fires. THIS MODULE STATES NO DISCHARGE LIMIT AND NEITHER DOES THIS COURSE: the specification is the caller's own, out of the caller's own permit or regulation, and a jest test asserts that the module's declared constants carry no specification-like key at all. Anyone quoting a figure from this block as a limit has quoted an example.`);
w();

/* ============================================================= SECTION 17 */
w(sec(17, 'What the method does not know', ['advanced', 'm06', 'l01']));
w();
w('Six things are HELD FOR LITERATURE in this module. Held means the repository carries no publication for the number, so the module states the absence rather than guessing, and no gate pretends to validate it. A reader who can list these six has the most useful map of the module there is.');
w();
w('ONE: THE DISSOLVED AND SOLUBLE OIL FLOOR. No device here removes dissolved oil, so there is a floor under every outlet this train reports, and its value is not in this module. The existence is stated on every train return:');
w(`- ${ogTrain.dissolvedOilNote}`);
w(`- with no floor given: outlet ${f6(ogTrain.outletOiwPpm)} ppm, dispersed ${f6(ogTrain.dispersedOutletOiwPpm)} ppm, floorApplied ${yn(ogTrain.floorApplied)}, dissolvedOilFloorPpm ${String(ogTrain.dissolvedOilFloorPpm)}.`);
const floorDemoNoFloor = A('the floor demonstration with no floor', P.treatmentTrain({
  inletOiwPpm: FLOOR_DEMO_INLET.oiwPpm, inletD50Micron: FLOOR_DEMO_INLET.d50Micron,
  sigma: FLOOR_DEMO_INLET.sigma,
  devices: [{ name: 'one very fine device', d50cMicron: FLOOR_DEMO_CUT_MICRON, sharpness: D.defaultSharpness }],
}));
const floored = A('the floor demonstration with a caller floor', P.treatmentTrain({
  inletOiwPpm: FLOOR_DEMO_INLET.oiwPpm, inletD50Micron: FLOOR_DEMO_INLET.d50Micron,
  sigma: FLOOR_DEMO_INLET.sigma,
  devices: [{ name: 'one very fine device', d50cMicron: FLOOR_DEMO_CUT_MICRON, sharpness: D.defaultSharpness }],
  dissolvedOilFloorPpm: OGBOTOBO_CALLER_FLOOR_PPM,
}));
if (!floored.floorApplied) {
  throw new Error('GENERATOR REFUSES: the floor block is labelled as the floor biting and the engine did not apply it');
}
w(`- the floor only matters where a train's DISPERSED prediction falls below it. On a narrow inlet, ${FLOOR_DEMO_INLET.oiwPpm} ppm at d50 ${FLOOR_DEMO_INLET.d50Micron} micron and sigma ${FLOOR_DEMO_INLET.sigma}, one device cutting at ${FLOOR_DEMO_CUT_MICRON} micron takes the dispersed oil to ${f6(floorDemoNoFloor.outletOiwPpm)} ppm and the module reports that figure, floorApplied ${yn(floorDemoNoFloor.floorApplied)}.`);
w(`- the same train with a floor of ${OGBOTOBO_CALLER_FLOOR_PPM} ppm stated BY THE CALLER: dispersed ${f6(floored.dispersedOutletOiwPpm)} ppm, reported outlet ${f6(floored.outletOiwPpm)} ppm, floorApplied ${yn(floored.floorApplied)}, and both figures are on the return so the reader can see which is which.`);
w(`- the warning that arrives with it: ${floored.warning}`);
w(`THE ${OGBOTOBO_CALLER_FLOOR_PPM} PPM IS THE CALLER'S NUMBER AND NOT THE MODULE'S. No value for that floor is stated anywhere in this engine or this course.`);
const wideChain = A('an artificial chain on the wide inlet', P.treatmentTrain({
  inletOiwPpm: OGBOTOBO_INLET.oiwPpm, inletD50Micron: OGBOTOBO_INLET.d50Micron,
  sigma: OGBOTOBO_INLET.sigma,
  devices: Array.from({ length: FLOOR_WIDE_STAGES }, (unused, i) => ({
    name: `stage ${i + 1}`, d50cMicron: FLOOR_WIDE_CUT_MICRON, sharpness: D.defaultSharpness,
  })),
}));
w(`AND THE SECOND HALF OF THE SAME LESSON, which is a fact about the distribution rather than about the floor. On the WIDE OGBOTOBO inlet at sigma ${OGBOTOBO_INLET.sigma}, ${FLOOR_WIDE_STAGES} identical devices cutting at ${FLOOR_WIDE_CUT_MICRON} micron still leave ${f6(wideChain.outletOiwPpm)} ppm, with the median down at ${f6(wideChain.outletMedianMicron)} micron. The fine tail of a wide distribution carries volume that no device in this module removes at all, so on that water the dispersed prediction never gets near a dissolved oil floor, and a reader chasing single figures of ppm by adding equipment is chasing the wrong thing.`);
w();
w('TWO: THE SECOND HALF OF THE API 421 HORIZONTAL VELOCITY RULE. The standard limits the horizontal velocity to the LESSER of a fixed velocity and a multiple of the design droplet rise velocity. Only the fixed half is here:');
w(`- every return that carries the check also carries velocityRuleComplete ${P.API_421.velocityRuleComplete}.`);
w(`- the note it carries: ${P.API_421.velocityRuleNote}`);
w(`- so a basin that passes this check has passed HALF A RULE. The OGBOTOBO basin runs at ${f12(ogBasin.horizontalVelocityMS)} m/s against the ${f6(ogBasin.horizontalVelocityLimitMS)} m/s fixed limit and its warning is ${ogBasin.warning ? `present: ${ogBasin.warning}` : 'absent'}.`);
w();
w('THREE: ANY DISCHARGE LIMIT AT ALL. Covered in Section 16. The module states none; a test asserts it states none.');
w();
w('FOUR: THE FILTER GRAIN SIZE EXPONENT. Covered in Section 13. The interception derivation gives the inverse cube, the input moves the answer by a large factor, and no bed data in this repository can check the exponent.');
w();
w(`FIVE: THE ATTACHMENT EFFICIENCY, ${D.attachmentEfficiency}, which is the one CALIBRATION in this module. It is chosen so a cell at the module's own defaults cuts in the range induced gas flotation is customarily credited with. It is an input so a caller with a vendor curve can move it, and moving it moves the flotation cut in direct proportion to its own square root:`);
w('| attachment efficiency | cut micron | cut over the declared value row |');
w('| --- | --- | --- |');
[0.002, 0.005, D.attachmentEfficiency, 0.02, 0.05].forEach((attachmentEfficiency) => {
  const r = A(`flotation at an attachment efficiency of ${attachmentEfficiency}`, P.flotation({ flowM3S: koQ, ...KOKORI_FLOTATION, attachmentEfficiency, ...koFluid }));
  w(`| ${attachmentEfficiency} | ${f6(r.d50cMicron)} | ${f6(r.d50cMicron / koFlot.d50cMicron)} |`);
});
w('The last column is derived, each cut over the KOKORI row. Nothing downstream may present this number as published, and no graded answer in this course depends on it.');
w();
w('SIX: THE DEVICE SHAPE AND SCALE CONSTANTS, one at a time. Sharpness three, the plate pack efficiency factor, the whole liner geometry with its rated field and design flow, the flotation interception coefficient, the filter reference triple and the customary bands. Section 2 lists them. They are PINNED by literal in the jest suite with an exact key-set match, so adding or removing one fails until the pin is updated, and the test says in as many words that a pin is not a validation.');
w();
w(`AND ONE STATEMENT ABOUT THE HYDROCYCLONE CUT ITSELF. The capture this model computes is an IDEAL: ${koCyc.cutBasis}. Field de-oilers are customarily credited with a coarser cut than this model gives, and no vendor performance curve exists in this repository to calibrate against. That is a statement about what the model leaves out rather than a number, and it belongs beside every cyclone cut size this course prints.`);
w();

/* ============================================================= SECTION 18 */
w(sec(18, 'What an independent oracle is', ['advanced', 'm05', 'l02'], ['advanced', 'm05', 'l03']));
w();
w('A gate that restates the formula the engine uses validates nothing. The golden file this course prints from is written by an oracle that reaches every answer BY A DIFFERENT METHOD, and the difference is the whole value of it.');
w();
w('The routes, and what makes each one independent:');
w('- the creeping flow rise velocity: the FORCE BALANCE solved numerically, with the drag coefficient as 24 over the Reynolds number and the two force expressions typed out. The 18 in the Stokes group is NEVER TYPED, so there is no place in the oracle for a wrong 18 to hide. Bending the engine from 18 to 20 is caught even when the same bend is attempted in the oracle.');
w('- the terminal rise velocity: bisection on the drag residual, against the engine\'s damped iteration.');
w('- the basin and plate cut sizes: a droplet TRAJECTORY marched through the geometry, bisected on the size that just clears. The surface loading result is a consequence of the march rather than a restatement of it, and the plate route marches two different channel heights and asserts the answer does not depend on which.');
w('- the hydrocyclone cut: the radial migration marched, with the field re-derived through the TANGENTIAL VELOCITY rather than the flow ratio, plus a Monte Carlo over starting radii uniform by area that puts the captured fraction at the reported cut at one half.');
w('- the flotation cut: the kinetics assembled from its PARTS in a different order, bubble number then swept area then rise velocity then interception, with the attachment marched by Euler and the size bisected out of it.');
w('- the filter cut: the bed marched layer by layer, and the droplet whose MARCHED removal is exactly one half bisected out.');
w('- the whole train: PARTICLE TRACKING, 400,000 droplets each carrying a surviving weight through every stage, with no binning anywhere. That checks the quadrature, the coupling, the outlet concentration, every stage and both medians by a method with no bins in it at all.');
w('- the error function series: against the C library\'s own erf.');
w();
w('THE IDENTITIES, which need no publication and are the strongest checks in the file:');
w(`- half the volume is removed at the cut size, by definition: ${f12(P.gradeEfficiency({ dMicron: 12, d50cMicron: 12 }))} at twelve micron against a twelve micron cut.`);
w(`- the volume median of a log-normal bin set equals its own d50: ${f6(P.medianOfBins(uzBins.bins))} against ${UZERE_INLET.d50Micron}, on every grid in Section 4.`);
w('- the truncated tail equals twice the cdf below the span edge, checked in Section 4 and coming out at one.');
w('- the flotation cell count makes no difference at equal total gas and equal total volume, checked in Section 12 and asserted to 1e-12.');
w('- a plate pack cut does not depend on how the pack is sliced into channels, carried in the golden as `channelHeightIndependence`.');
w();
w('WHAT THE ORACLE DOES NOT DO, and this matters as much. It holds its OWN second copy of the declared constants, so for those numbers it is a PIN and not a validation, and both the code and the test say so. Six of the eight defects planted in the engine and the oracle together are caught by that pin and by nothing else, which is a statement about how much of this module a pin is carrying.');
w();
w('AND THE MEASURED GAP, so a reader knows what the agreements are worth. This is the engine re-run at every published condition and compared with the golden value the oracle wrote, as a RELATIVE difference:');
w('| group | rows | largest relative gap between the engine and the golden |');
w('| --- | --- | --- |');
const GAP = [
  ['apiSeparator', GOLD.apiSeparator.map((c) => [c.d50cMicron, P.apiSeparator({ flowM3S: c.flowM3S, lengthM: c.lengthM, widthM: c.widthM, depthM: c.depthM, shortCircuitF: c.shortCircuitF, rhoWater: c.rhoWater, rhoOil: c.rhoOil, muPaS: c.muPaS }).d50cMicron])],
  ['plateInterceptor', GOLD.plateInterceptor.map((c) => [c.d50cMicron, P.plateInterceptor({ flowM3S: c.flowM3S, plateAreaM2: c.plateAreaM2, nPlates: c.nPlates, efficiencyFactor: c.efficiencyFactor, rhoWater: c.rhoWater, rhoOil: c.rhoOil, muPaS: c.muPaS }).d50cMicron])],
  ['hydrocyclone', GOLD.hydrocyclone.map((c) => [c.d50cMicron, P.hydrocyclone({ flowM3S: c.flowM3S, nLiners: c.nLiners, rhoWater: c.rhoWater, rhoOil: c.rhoOil, muPaS: c.muPaS }).d50cMicron])],
  ['mediaFilter', GOLD.mediaFilter.map((c) => [c.d50cMicron, P.mediaFilter({ flowM3S: c.flowM3S, areaM2: c.areaM2, ...(c.bedDepthM ? { bedDepthM: c.bedDepthM } : {}), ...(c.mediaMicron ? { mediaMicron: c.mediaMicron } : {}), ...(c.filterCoefficientPerM ? { filterCoefficientPerM: c.filterCoefficientPerM } : {}) }).d50cMicron])],
  ['train, outlet concentration', GOLD.train.map((c) => [c.outletOiwPpm, P.treatmentTrain({ inletOiwPpm: c.inletOiwPpm, inletD50Micron: c.inletD50Micron, sigma: c.sigma, spanSigma: c.spanSigma, devices: c.devices }).outletOiwPpm])],
  ['train, outlet droplet median', GOLD.train.map((c) => [c.outletMedianMicron, P.treatmentTrain({ inletOiwPpm: c.inletOiwPpm, inletD50Micron: c.inletD50Micron, sigma: c.sigma, spanSigma: c.spanSigma, devices: c.devices }).outletMedianMicron])],
];
GAP.forEach(([name, pairs]) => {
  const worst = Math.max(...pairs.map(([g, e]) => {
    if (!Number.isFinite(g) || !Number.isFinite(e)) {
      throw new Error(`GENERATOR REFUSES: the ${name} gap row compares ${g} with ${e}`);
    }
    return Math.abs(e - g) / Math.abs(g);
  }));
  w(`| ${name} | ${pairs.length} | ${worst.toExponential(2)} |`);
});
w('The two exact routes, the basin and the plate pack, agree to rounding, and so does the cyclone: two closed arguments for one number should. The train rows are larger because the golden there is a Monte Carlo over 400,000 droplets and carries its own sampling noise, so agreement at that level is the best a particle count can buy rather than slack in the gate. IDENTICAL TO TWELVE DECIMALS WOULD BE THE WEAKER RESULT on those rows, because that is what two copies of one calculation produce.');
w();

/* ============================================================= SECTION 19 */
w(sec(19, 'What a published case can and cannot catch', ['advanced', 'm05', 'l04'], ['advanced', 'm05', 'l05']));
w();
w('A golden file and a green suite are not the same thing as a validated engine. The only way to know what a gate can catch is to break the engine on purpose and watch.');
w();
const groups = Object.keys(GOLD).filter((k) => Array.isArray(GOLD[k])).sort();
w(`The golden file as it stands: ${groups.length} groups, ${groups.reduce((s, k) => s + GOLD[k].length, 0)} rows.`);
w('| group | rows | what it pins |');
w('| --- | --- | --- |');
const GROUP_NOTE = {
  apiSeparator: 'basin cut sizes, the velocity warning on both sides of the limit, and Reynolds numbers inside and outside the creeping flow band',
  binGrid: 'the median identity and the truncated tail across bin counts and spans',
  bubbleRise: 'the full drag balance at bubble Reynolds numbers from below one to the tens',
  cdf: 'the error function series against the C library, on an absolute tolerance that is the series own published accuracy',
  flotation: 'the whole attachment chain, with the holdup and residence warnings straddled',
  hydrocyclone: 'the field, the envelope, the shear penalty and the captured fraction at the cut',
  mediaFilter: 'depth filtration, the inverted cut, the grain size and the breakthrough warning, with three rows added at low loading where the bed area used to move nothing',
  mediaFilterFloor: 'the loading floor: five beds REFUSED below it, two answered at and above it, and the bed area that would run the flow at the floor',
  oilDensity: 'the crude density FUNCTION, called rather than fed its own answers back',
  plateInterceptor: 'the pack cut and the channel height independence',
  properties: 'the viscosity and brine density fits, including the one published check in the file',
  removal: 'the binned quadrature against a Monte Carlo of the same distribution',
  rise: 'Stokes, its Reynolds number, and the measured gap to the real drag balance',
  train: 'the coupling, both medians and every stage, by particle tracking',
};
groups.forEach((k) => {
  if (!GROUP_NOTE[k]) throw new Error(`GENERATOR REFUSES: the golden carries a group "${k}" this table does not describe`);
  w(`| ${k} | ${GOLD[k].length} | ${GROUP_NOTE[k]} |`);
});
w();
w('THE WARNINGS ARE GOLDEN VALUES, which is unusual and is deliberate. The golden carries `expectVelocityWarning`, `expectStarvedWarning`, `expectOverloadWarning`, `expectResidenceWarning`, `expectHoldupWarning` and `expectBreakthroughWarning`, each straddled by rows on both sides of the threshold, so a warning that stops firing fails a case rather than going quietly. Counted off the file, in the table below:');
const WARN_KEYS = ['expectVelocityWarning', 'expectStarvedWarning', 'expectOverloadWarning', 'expectResidenceWarning', 'expectHoldupWarning', 'expectBreakthroughWarning'];
w('| golden warning field | rows carrying it | rows where it is true |');
w('| --- | --- | --- |');
WARN_KEYS.forEach((key) => {
  const rows = groups.flatMap((g) => GOLD[g]).filter((c) => key in c);
  if (!rows.length) throw new Error(`GENERATOR REFUSES: no golden row carries ${key}`);
  w(`| ${key} | ${rows.length} | ${rows.filter((c) => c[key] === true).length} |`);
});
w('Every one of those fields is straddled in the table above: it is true on at least one row and false on at least one other, which is what makes it evidence that the threshold is where the module says it is.');
w();
w('AT LEAST ONE ROW PER DEVICE STATES NONE OF THAT DEVICE\'S DEFAULTS, so a default is never the only thing a case exercises. That is a rule a golden file has to be built to, because a suite whose every case runs at the defaults cannot tell a default from a derivation.');
w();
// THE GROUP TABLE ABOVE PROMISED THIS GROUP IN WORDS AND NOTHING DELIVERED IT.
// A row of a summary table that describes seven cases is not the seven cases,
// and this is the one group whose subject is a REFUSAL, which is the thing a
// summary can least afford to stand in for.
w(`THE NEWEST GROUP IN FULL, because it is the only group in this file whose subject is a refusal and the only one a reader cannot infer from a cut size. Every row runs ${GOLD.mediaFilterFloor[0].flowM3S} m3/s through a bed, and the only input that moves is the AREA:`);
w('| bed area m2 | loading m/hr | the golden expects | the engine |');
w('| --- | --- | --- | --- |');
GOLD.mediaFilterFloor.forEach((c, i) => {
  const r = P.mediaFilter({ flowM3S: c.flowM3S, areaM2: c.areaM2 });
  const refused = Boolean(r && typeof r.error === 'string');
  if (refused !== c.expectRefusal) {
    throw new Error(`GENERATOR REFUSES: golden floor row ${i + 1} expects ${c.expectRefusal ? 'a refusal' : 'an answer'} at ${c.areaM2} m2 and the engine ${refused ? 'refused' : 'answered'}`);
  }
  if (r.areaAtFloorM2 !== undefined && f6(r.areaAtFloorM2) !== f6(c.areaAtFloorM2)) {
    throw new Error(`GENERATOR REFUSES: golden floor row ${i + 1} names ${c.areaAtFloorM2} m2 at the floor and the engine names ${r.areaAtFloorM2}`);
  }
  w(`| ${c.areaM2} | ${f6(c.loadingMHr)} | ${c.expectRefusal ? 'REFUSED' : 'an answer'} | ${refused ? 'refused' : 'answered'} |`);
});
const floorGroup = GOLD.mediaFilterFloor;
// THE GROUP IS TWO DEMONSTRATIONS, and they are told apart by how far the
// loading sits from the floor rather than by their position in the file: the
// FLAT rows are the beds that used to give one answer across a hundredfold of
// area, and the NEAR rows pin the floor to the value the module declares.
const nearFloor = floorGroup.filter((c) => Math.abs(c.loadingMHr - D.filterMinLoadingMHr) / D.filterMinLoadingMHr < 0.05);
const flatRows = floorGroup.filter((c) => !nearFloor.includes(c));
const nearRefused = nearFloor.filter((c) => c.expectRefusal);
const nearAnswered = nearFloor.filter((c) => !c.expectRefusal);
if (!flatRows.length || nearRefused.length !== 1 || !nearAnswered.length) {
  throw new Error(`GENERATOR REFUSES: the floor group does not split into flat rows and a straddle: ${flatRows.length} flat, ${nearRefused.length} refused near the floor, ${nearAnswered.length} answered near it`);
}
const areaSpan = Math.max(...flatRows.map((c) => c.areaM2)) / Math.min(...flatRows.map((c) => c.areaM2));
w(`The first ${word(flatRows.length)} beds span ${f6(areaSpan)} times in area (derived, the largest of those areas over the smallest) and every one of them is refused. THOSE ARE THE FOUR BEDS A CLAMP MAKES IDENTICAL, which is the whole reason this group exists: a hundredfold of bed area is the widest thing a reader could vary, and a module that answered the same on all four would be caught here and nowhere else in the file.`);
w(`The ${word(nearFloor.length)} rows beside them are the STRADDLE, and they are what pins the floor to the declared value rather than to somewhere below it: ${f6(nearRefused[0].loadingMHr)} m/hr is REFUSED and ${f6(nearAnswered[0].loadingMHr)} m/hr ANSWERS, which is a gap of ${f6((nearAnswered[0].loadingMHr - nearRefused[0].loadingMHr) / D.filterMinLoadingMHr)} of the floor itself (derived, the two loadings subtracted and taken over the floor). And ${f6(floorGroup[0].areaAtFloorM2)} m2 is \`areaAtFloorM2\` on all ${word(floorGroup.length)} rows, golden and engine alike, which is the bed that would run that flow at the floor.`);
w();
w(`THE PLANTING BATTERY, which is the real measure of the gate. FC7-0 planted thirty five defects, twenty seven in the engine alone and eight in the engine and the oracle together, run one at a time against the suite. Before that repair, 22 of those 35 left the suite fully green: 16 of the 27 planted in the engine alone and 6 of the eight planted in both files. After it, 0 of 35 do. FC7-1 re-ran all 35 against the repaired source and added twenty four of its own plus one self-test of the runner, and none of the sixty leaves the suite green. The suite this digest was built beside carries ${SUITE_TESTS} tests, counted off the vendored file.`);
w('The eight planted in both files at once are the interesting half, because a golden regenerated from a bent oracle agrees with a bent engine perfectly. What catches them now is a mixture of three things: a route with no place to type the constant, the identities that need no source, and an explicit PIN with the value typed by hand in the test file.');
w('Every family in the suite also carries a NEGATIVE CONTROL that is asserted to fire and to name a case. One of them records a fact about its own subject rather than a round number: the cyclone control fails on four of five rows and not five, because a turndown of exactly one is the one case a wrong field exponent cannot move.');
w();

/* ============================================================= SECTION 20 */
w(sec(20, 'The Associate reading, one stream from the water to the plate pack', ['beginner', 'm06']));
w();
w(`UZERE, ${UZERE_BWPD} bwpd of ${UZERE_INLET.oiwPpm} ppm oil at ${UZERE_WATER.tC} C and ${UZERE_WATER.tdsPpm} ppm TDS, ${UZERE_OIL.apiGravity} API, droplets at d50 ${UZERE_INLET.d50Micron} micron and sigma ${UZERE_INLET.sigma}.`);
w();
let stepN = 0;
const step = () => { stepN += 1; return stepN; };
w('| step | what the engine was asked | answer |');
w('| --- | --- | --- |');
w(`| ${step()} | the flow, from the rate | ${f12(uzQ)} m3/s (derived, ${UZERE_BWPD} barrels times ${BARREL_M3} m3 over 86400 s) |`);
w(`| ${step()} | the water viscosity | ${f12(uzMu.muPaS)} Pa.s, from ${f12(uzMu.muFreshPaS)} fresh times a salinity factor of ${f6(uzMu.salinityFactor)} |`);
w(`| ${step()} | the brine density | ${f6(uzRw.rhoKgM3)} kg/m3, from ${f6(uzRw.rhoFreshKgM3)} fresh |`);
w(`| ${step()} | the crude density | ${f6(uzRo.rhoKgM3)} kg/m3, at a specific gravity of ${f6(uzRo.sg60)} |`);
w(`| ${step()} | the density difference | ${f6(uzRw.rhoKgM3 - uzRo.rhoKgM3)} kg/m3 (derived, the brine and crude densities above subtracted) |`);
w(`| ${step()} | how fast the median droplet rises | ${f12(uzRise.vMS)} m/s at Reynolds ${f6(uzRise.reynolds)}, inside the band |`);
w(`| ${step()} | the basin surface loading | ${f12(uzBasin.overflowRateMS)} m/s |`);
w(`| ${step()} | the basin cut size | ${f6(uzBasin.d50cMicron)} micron |`);
w(`| ${step()} | what the basin removes from this water | ${f6(A('the basin on the UZERE water', P.applyDevice({ bins: uzBins.bins, d50cMicron: uzBasin.d50cMicron, sharpness: uzBasin.sharpness })).removalFraction * 100)} percent |`);
w(`| ${step()} | the plate pack cut size | ${f6(uzPlate.d50cMicron)} micron, on an effective area of ${f6(uzPlate.effectiveAreaM2)} m2 |`);
const uzTrain = A('the UZERE two stage train', P.treatmentTrain({
  inletOiwPpm: UZERE_INLET.oiwPpm, inletD50Micron: UZERE_INLET.d50Micron, sigma: UZERE_INLET.sigma,
  devices: [{ name: 'API 421 basin', ...uzBasin }, { name: 'CPI plate pack', ...uzPlate }],
}));
w(`| ${step()} | the two of them in series | ${f6(uzTrain.outletOiwPpm)} ppm out, ${f6(uzTrain.overallRemovalPct)} percent removed |`);
w(`| ${step()} | the droplets left | median ${f6(uzTrain.outletMedianMicron)} micron, from ${f6(uzTrain.inletMedianMicron)} |`);
w(`| ${step()} | the verdict | ${String(uzTrain.meetsSpec)}, because "${uzTrain.verdictWithheldReason}" |`);
w();
w(`Step ${stepN} is the point of the whole tier. The engine has just computed eleven numbers and it will not turn them into a pass or a fail, because nobody gave it a specification and it does not have one of its own.`);
w();

/* ============================================================= SECTION 21 */
w(sec(21, 'The Professional reading, one de-oiling train through three unlike devices', ['intermediate', 'm06']));
w();
w(`KOKORI, ${KOKORI_BWPD} bwpd at ${KOKORI_WATER.tC} C and ${KOKORI_WATER.tdsPpm} ppm TDS, ${KOKORI_OIL.apiGravity} API. The water is ${f12(koMu.muPaS)} Pa.s, ${f6(koRw.rhoKgM3)} kg/m3 against ${f6(koRo.rhoKgM3)} kg/m3 of oil, a difference of ${f6(koRw.rhoKgM3 - koRo.rhoKgM3)} kg/m3 (derived).`);
w();
w('| device | what sets its cut | cut micron | sharpness | where the number comes from |');
w('| --- | --- | --- | --- | --- |');
w(`| ${KOKORI_LINERS.nLiners} liners | a centrifugal field of ${f6(koCyc.gField)} g over a residence of ${f6(koCyc.residenceS)} s | ${f6(koCyc.d50cMicron)} | ${koCyc.sharpness} | stated liner geometry, turndown ${f6(koCyc.turndownRatio)} |`);
w(`| ${KOKORI_FLOTATION.nCells} cells of ${KOKORI_FLOTATION.cellVolumeM3} m3 | interception on a ${koFlot.bubbleMicron} micron bubble swarm at a holdup of ${f12(koFlot.gasHoldup)} | ${f6(koFlot.d50cMicron)} | ${koFlot.sharpness} | attachment kinetics, residence ${f6(koFlot.residenceS)} s |`);
w(`| a ${KOKORI_FILTER.areaM2} m2 bed | depth filtration at ${f12(koFilt.filterCoefficientPerM)} per m over ${KOKORI_FILTER.bedDepthM} m | ${f6(koFilt.d50cMicron)} | ${koFilt.sharpness} | inverted depth filtration, loading ${f6(koFilt.loadingMHr)} m/hr |`);
w();
const koTrain = A('the KOKORI train', P.treatmentTrain({
  inletOiwPpm: KOKORI_TRAIN_INLET.oiwPpm, inletD50Micron: KOKORI_TRAIN_INLET.d50Micron,
  sigma: KOKORI_TRAIN_INLET.sigma,
  devices: [
    { name: 'Hydrocyclone bank', ...koCyc },
    { name: 'Induced gas flotation', ...koFlot },
    { name: 'Walnut shell filter', ...koFilt },
  ],
}));
w(`The three of them in series, on ${KOKORI_TRAIN_INLET.oiwPpm} ppm at d50 ${KOKORI_TRAIN_INLET.d50Micron} micron and sigma ${KOKORI_TRAIN_INLET.sigma}:`);
w('| stage | cut micron | removal percent | outlet ppm | outlet median micron |');
w('| --- | --- | --- | --- | --- |');
koTrain.stages.forEach((s) => w(`| ${s.name} | ${f6(s.d50cMicron)} | ${f6(s.removalPct)} | ${f6(s.outletOiwPpm)} | ${f6(s.outletMedianMicron)} |`));
w(`- overall ${f6(koTrain.overallRemovalPct)} percent, outlet ${f6(koTrain.outletOiwPpm)} ppm, median ${f6(koTrain.inletMedianMicron)} to ${f6(koTrain.outletMedianMicron)} micron.`);
w(`- the two sharpnesses in that table are not a style choice: ${koCyc.sharpness} is DECLARED for the centrifugal device and ${koFlot.sharpness} is DERIVED for the two interception devices, and the difference is worth real percentage points of removal.`);
w();
w('The three cut sizes in that table come from three completely different arguments: a field and a travel, a collision rate and a residence, and an exponential penetration through a depth. A reader who can say which argument produced which number, and which input each one responds to, has finished the tier.');
w();

/* ============================================================= SECTION 22 */
w(sec(22, 'HISTORY. What this engine was repaired for, and how to teach it', ['advanced', 'm05', 'l01']));
w();
w('THIS SECTION IS HISTORY. It is the one section of this digest whose subject is what the engine USED TO DO, it is framed as history in its title and in this first line, and nothing above it is history at all. Every figure in the rest of this digest is the repaired engine answering now.');
w();
w('Five things this module did before FC7-0, each of which is a lesson rather than an anecdote:');
w('- THE HYDROCYCLONE REWARDED BUYING FEWER LINERS. The field went as the square of the flow with nothing above it, so the cut size fell without limit as liners were removed from the bank, and the studio\'s own shipped default ran its liners at 7.7 times their design flow. A studio that tells a designer to buy less equipment for a better answer is worse than no studio. THE LESSON IS THE SWEEP: sweep the input a user is most tempted to reduce, and look at the direction of the answer. Section 10 is that sweep on the repaired model, and it now turns over. THE LINER ITSELF WAS NOT A MODEL EITHER, which is the same defect one level down: the liner LENGTH was not an input at all, and the bore reached the answer through a bare divisor on a velocity the source called residence-scaled rather than through any residence time. Section 9 is the stated geometry the repair put there, where both dimensions move the answer for a reason a reader can follow.');
w('- FOUR DEVICES TRUSTED WHAT A FIFTH REFUSED. Given an oil heavier than its water, `stokesRiseMS` refused by name and the four devices returned a cut size of NaN with no error at all, and the train then skipped those stages and returned a spec verdict computed over whatever ran. THE LESSON IS THE RULE: when two halves of one module disagree, THE TRUSTING HALF IS THE BUG. Section 16 runs the identical bad fluid through all five of those doors at once, the rise velocity function and the four devices, and every one of them now refuses in its own words.');
w('- TWO MODELS WERE DEAD. An attachment fraction that was exactly one across every input a user could type made the bubble size, the gas rate and the residence time decorative, and made induced and dissolved gas flotation the same device behind two menu entries. A media filter computed its removal twice by two routes that disagreed, and the train read the route the gate did not validate. THE LESSON IS THE PROBE: sweep every input and check it moves the answer, and if a module holds two opinions about one quantity, delete one.');
w('- A MEDIAN WAS REPORTED AGAINST A DIFFERENT KIND OF NUMBER. The inlet median was the typed d50 and the outlet median was measured off the bins, so a train that removed nothing showed the median falling. THE LESSON IS THE BASIS: two numbers a reader will compare must be measured the same way, and the module should say on its own return that they are.');
w('- THE GATE COULD NOT CATCH ANY OF IT. Sixteen defects planted in the engine alone left the suite fully green, and six more survived being planted in the engine and the oracle together. THE LESSON IS SECTION 19: a green suite is a measurement of the suite, until somebody plants a defect and watches.');
w();
w('Three more, found by THIS COURSE when it built the digest against the repaired engine and repaired in FC7-1, each of them a class FC7-0 had already named in a place FC7-0 did not look:');
w(`- A BED AREA THAT MOVED NOTHING. The media filter clamped its own loading rate up to a floor and said nothing, so under that rate four beds of completely different area reported the same filter coefficient and the same cut size to every digit. The clamp was in the oracle too, so the independent check agreed with it. THE LESSON IS THE SILENT CLAMP: a guard that quietly moves an input is a guard that deletes the input, and the repair is to REFUSE by name. This module now answers above ${num(D.filterMinLoadingMHr, 0)} m/hr and says why below it, because its filter coefficient is declared at ${num(D.filterReferenceLoadingMHr, 0)} m/hr and what a bed does far under its design rate is held for literature.`);
w(`- A THRESHOLD NOBODY HAD DECLARED. The flotation residence warning compared against a bare ${num(D.flotationResidenceWarnS, 0)} written inside the sentence that reported it, and the droplet grid's two floors were bare the same way, in a module whose stated doctrine is that every number which is a choice rather than a derivation lives in one frozen object. THE LESSON IS THE LEDGER: a threshold a reader cannot find is a threshold nobody reviews, and a warning should quote the figure it judged against so the reader can disagree with it.`);
w('- A SILENT WAY BACK TO THE QUANTISED MEDIAN. The volume median interpolated when a bin carried its edges and fell back to the bin midpoint when it did not, which is the quantised answer FC7-0 had just removed, reachable again by one caller handing over midpoints alone, with nothing on the return saying which route ran. THE LESSON IS THE FALLBACK: a fallback that answers is worse than a refusal, because it is an answer nobody can tell from the right one. The leaf returns NaN now and the callers turn it into a named refusal.');
w();
w('HOW TO TEACH THIS, and it is the rule for the whole course. Repair history is PROVENANCE: it belongs in this section, framed, or nowhere. A number from the old model has no place in a lesson, a panel or a question, because a reader who meets it without the frame has simply been told something false about how this engine works. Every figure in every section above this one is the repaired engine\'s own answer at the inputs named beside it.');
w();

/* ==================================================== the build-time guards */
/**
 * THE WHOLE-OUTPUT REFUSAL SWEEP.
 *
 * `wRefusal`, `wRefusalLine` and `wLeafNaN` are the only three routes by which a
 * refusal may be written into this digest, and each one throws if the call it
 * was handed ANSWERED. This sweep closes the class: it walks every line of the
 * finished output, finds every line that PRESENTS a refusal, and fails the build
 * if any of them was written by some other route. FC4's defect was one such
 * line, and no numeric sweep over the digest could ever have seen it, because
 * every number on it was real engine output.
 */
const REFUSAL_SHAPE = /REFUSED:|\berror: "/;
const untagged = out
  .map((line, i) => ({ line, i }))
  .filter(({ line, i }) => REFUSAL_SHAPE.test(line) && !tagged.has(i));
if (untagged.length) {
  throw new Error(`GENERATOR REFUSES: ${untagged.length} line(s) present a refusal without going through the refusal writers, so nothing proved the engine actually refused:\n${untagged.map(({ line, i }) => `  line ${i + 1}: ${line}`).join('\n')}`);
}
/** Every refusal writer must have been used, or the guard is guarding nothing. */
if (tagged.size < 20) {
  throw new Error(`GENERATOR REFUSES: only ${tagged.size} refusal row(s) were written through the guarded writers. This digest teaches a module with a refusal on every door, and a guard over almost nothing is not a guard.`);
}
/** No em dash, no en dash, anywhere a learner reads. */
const dashed = out.map((line, i) => ({ line, i })).filter(({ line }) => /[–—]/.test(line));
if (dashed.length) {
  throw new Error(`GENERATOR REFUSES: ${dashed.length} line(s) carry an em dash or an en dash:\n${dashed.map(({ line, i }) => `  line ${i + 1}: ${line}`).join('\n')}`);
}
/**
 * NO HOLE IN A TABLE CELL. The formatters above already refuse a non-finite
 * value at source, and this is the second half of the same guard, over the cells
 * that are written without a formatter.
 *
 * It looks for a cell whose WHOLE content is `undefined` or `NaN`, and NOT for
 * the words anywhere on a line: the engine's own refusal for a missing viscosity
 * contains the word undefined, and the leaf contract in Section 16 is ABOUT the
 * bare NaN. A guard that fires on clear air is as much a defect as one that
 * misses, so this one is narrowed to the shape a hole actually takes.
 */
const holes = out.map((line, i) => ({ line, i }))
  .filter(({ line }) => line.startsWith('|')
    && line.split('|').map((c) => c.trim()).some((c) => c === 'undefined' || c === 'NaN'));
if (holes.length) {
  throw new Error(`GENERATOR REFUSES: ${holes.length} table row(s) carry a cell that is undefined or NaN:\n${holes.map(({ line, i }) => `  line ${i + 1}: ${line}`).join('\n')}`);
}

process.stdout.write(`${out.join('\n')}\n`);
process.stderr.write(`fc7_dump: ${out.length} lines, ${out.filter((l) => l.startsWith('# SECTION')).length} sections, ${tagged.size} guarded refusal rows\n`);
