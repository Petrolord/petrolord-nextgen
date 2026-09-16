// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES in packages/engines/test-data/production/goldens/esp_cases.json,
// the PUBLISHED CATALOGUE in engines/production/data/espCatalog.js, the PUBLISHED GATE FIXTURES in
// __tests__/production.esp.test.js, and three TEACHING WELLS designed for this wave and labelled as such.
// THE PD3 CAPSTONE RUNS DIFFERENT CONDITIONS ENTIRELY. Nothing here imports, reads or reproduces
// pd3_fields.mjs, the capstone well, or any capstone condition. The only use made of fields.json is the leak
// guard at the bottom, which reads the graded answers for the sole purpose of proving none of them is in the
// digest. If you are editing this file: do not add a capstone condition to it. The digest and the capstone are
// two files with opposite audiences.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ENG = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';

const {
  HP_HEAD_DIVISOR, FT3_PER_BBL, SEC_PER_DAY, WATER_LBF_PER_FT3, FT_LBF_PER_S_PER_HP,
  hydraulicHp, brakeHp, polyEval, fitStageCurve, referenceStageCurve, bepOf,
  stagePerformance, stackPerformance, viscosityCheck, applyViscosityFactors,
  VISCOSITY_CORRECTION_THRESHOLD_CST,
} = await import(`${ENG}/engines/production/espPump.js`);
const {
  PSI_PER_FT_SG, gradientFromDensity, intakePressure, intakeStream, gasHandling,
  DEFAULT_GAS_LIMITS, totalDynamicHead, tdhBreakdown, stageCount, sizePump,
  diagnoseOperation, stackCurve,
} = await import(`${ENG}/engines/production/espDesign.js`);
const {
  COPPER_ALPHA_PER_F, COPPER_REF_TEMP_F, conductorResistance, motorCurrent,
  cableVoltageDrop, cablePowerLossKw, surfaceRequirement, selectCable,
} = await import(`${ENG}/engines/production/espMotorCable.js`);
const {
  REFERENCE_STAGES, CABLE_SIZES, MOTOR_FRAMES,
} = await import(`${ENG}/engines/production/data/espCatalog.js`);

const G = JSON.parse(fs.readFileSync(
  `${ENG}/test-data/production/goldens/esp_cases.json`, 'utf8'));

// ------------------------------------------------------------------ output helpers
const OUT = [];
const say = (s = '') => OUT.push(s);
const fx = (v, d = 6) => {
  if (v === null || v === undefined) return 'none';
  if (typeof v === 'boolean' || typeof v === 'string') return String(v);
  if (!Number.isFinite(v)) return String(v);
  return v.toFixed(d);
};
const L = (label, v, unit = '', d = 6) => say(`${label} = ${fx(v, d)}${unit ? ` ${unit}` : ''}`);
const H = (s) => { say(); say(s); };

// ------------------------------------------------------------------ curves
const vendorCurve = fitStageCurve({ points: G.vendorCurve.points });
const specOf = (id) => G.referenceCurves.find((c) => c.id === id)?.spec
  || REFERENCE_STAGES.find((s) => s.id === id);
const c400 = referenceStageCurve(specOf('ref-400-1000'));
const c540 = referenceStageCurve(specOf('ref-540-2500'));
const c562 = referenceStageCurve(specOf('ref-562-4000'));
const c675 = referenceStageCurve(specOf('ref-675-7000'));
const CURVES = { 'ref-400-1000': c400, 'ref-540-2500': c540, 'ref-562-4000': c562, 'ref-675-7000': c675 };

// the laundering convention the module header states and the goldens are cut on
const sgFromDensity = (rho) => gradientFromDensity(rho) / PSI_PER_FT_SG;

const zeroHeadHz = (curve, qBpd) => {
  const h = (hz) => stagePerformance({ curve, qBpd, hz, specificGravity: 1 }).headFt;
  let a = 0.001; let b = 200;
  for (let i = 0; i < 300; i += 1) { const m = 0.5 * (a + b); if (h(m) > 0) b = m; else a = m; }
  return 0.5 * (a + b);
};
const zeroHeadQRef = (curve) => {
  const h = (q) => polyEval(curve.headFit, q);
  let a = curve.qMin; let b = 200000;
  for (let i = 0; i < 300; i += 1) { const m = 0.5 * (a + b); if (h(m) > 0) a = m; else b = m; }
  return 0.5 * (a + b);
};

// =====================================================================
// PREAMBLE
// =====================================================================
say('PD3 ESP Design: TEACHING DIGEST');
say();
say('THE ONLY NUMBERS A LESSON MAY QUOTE. Every line names its source: a published');
say('golden case, a published catalogue entry, a published engine gate fixture, or');
say('one of three teaching cases designed for this wave and labelled as one.');
say('NOTHING here comes from the graded capstone well, whose conditions the');
say('generator has never read.');
say();
say('A leak guard in the generator checks every number in every line of this file');
say('against all eighteen graded capstone answers, in three unit shiftings (as');
say('printed, times a thousand, divided by a thousand), at TEN TIMES the grader own');
say('acceptance band. That band is the ABSOLUTE tolerance the grader uses');
say('(academy_submit_capstone compares abs(got - expected) <= tol, in the field own');
say('units), so it is very tight: ten times it is 0.018 ft on a total dynamic head');
say('and 0.00022 A on a motor current. The verdict is printed at the end of this');
say('file. Nothing needed withholding.');
say();
say('Generator: /root/pd-wip-esp/pd3_dump.mjs');
say('Engines:   packages/engines/engines/production/espPump.js, espDesign.js,');
say('           espMotorCable.js, over data/espCatalog.js');
say('Goldens:   packages/engines/test-data/production/goldens/esp_cases.json');
say('Gates:     __tests__/production.esp.test.js');
say('Units: bbl/d, ft of head, hp, psia, degF, lbm/ft3, A, V, kVA, kW, Hz, in.');
say('Rates are IN SITU at pump conditions unless the line says stb/d.');
say();
say('THE THESIS THIS COURSE IS BUILT ON');
say('  An ESP is a stack of identical stages turned by a motor on the end of a');
say('  cable, so a design is one number carried through four translations: head per');
say('  stage becomes head required becomes shaft horsepower becomes amps at the');
say('  surface. An error introduced at any one translation is invisible at the next.');
say();
say('THE TWO KINDS OF STAGE CURVE IN THIS PACKAGE, AND THEY BEHAVE DIFFERENTLY');
say('  VENDOR FIT. fitStageCurve puts a least squares CUBIC (headDegree 3 by');
say('  default) through the points read off a manufacturer published curve. Five');
say('  points, four coefficients, so the fit does NOT pass through its points and');
say('  it carries a residual that a lesson can quote and a bad transcription shows');
say('  up in. This is the route for a real design.');
say('  REFERENCE MODEL. referenceStageCurve generates nine points from four named');
say('  parameters and fits them with a QUADRATIC (headDegree 2). The generating');
say('  shape is itself quadratic in rate, so the fit recovers it to machine');
say('  precision and its residual is nothing at all. It is a shape, not a catalogue');
say('  entry, and no lesson may call it a manufacturer pump.');
say('  A lesson that says "the cubic fit" means the VENDOR curve. A lesson that');
say('  quotes a reference stage residual is quoting a zero, and should say why.');
say();
say('THE THREE TEACHING CASES AND WHY EACH EXISTS. Two wells and one curve, none');
say('of them published, all three labelled on every line they appear on.');
say('  QUA-IBOE-4  a gassy well whose gas volume fraction through the pump lands');
say('              BETWEEN the two published thresholds, so the verdict is');
say('              gasHandler. Neither published design reaches that verdict, and a');
say('              lesson on the thresholds needs a case that trips the middle one.');
say('              Its motor is deliberately undersized, so the SELECTION load');
say('              fraction crosses one while the ELECTRICAL load fraction does');
say('              not: the module seam, on a well a lesson may print in full.');
say('  IBENO-2     a short shallow stack. The rounding margin on a stack of a few');
say('              dozen stages is worth percent, where on a stack of two hundred it');
say('              is worth tenths of a percent. It exists so a lesson can show that');
say('              the margin is bounded by ONE STAGE and never by a percentage.');
say('  BRASS-11    a teaching CURVE and not a well. The published vendor points as');
say('              transcribed by somebody who made');
say('              a mistake. Two versions, one mild and one a decimal slip, so a');
say('              lesson can watch the fit residual and the transcription warning');
say('              do the job they are there for.');

// =====================================================================
H('# SECTION 1: THE CONSTANTS AND THE THRESHOLDS (published, from the engine source)');
say('# Every threshold a number in this course is compared against is here, so no');
say('# lesson has to guess where a band came from.');
L('constant, cubic feet per barrel', FT3_PER_BBL, '', 6);
L('constant, seconds per day', SEC_PER_DAY, '', 0);
L('constant, water specific weight', WATER_LBF_PER_FT3, 'lbf/ft3', 1);
L('constant, foot pounds force per second per horsepower', FT_LBF_PER_S_PER_HP, '', 0);
L('constant, HP_HEAD_DIVISOR', HP_HEAD_DIVISOR, '', 8);
L('golden, hpHeadDivisor', G.constants.hpHeadDivisor, '', 8);
L('constant, HP_HEAD_DIVISOR against the golden, relative deviation',
  Math.abs(HP_HEAD_DIVISOR - G.constants.hpHeadDivisor) / G.constants.hpHeadDivisor, '', 14);
say('constant, the pressure form of the same statement is hp = q dP / 58824');
L('constant, HP_HEAD_DIVISOR times 62.4/144 (the pressure form divisor)',
  HP_HEAD_DIVISOR * (62.4 / 144), '', 6);
L('constant, that against the familiar rounded 58824, relative deviation',
  Math.abs(HP_HEAD_DIVISOR * (62.4 / 144) - 58824) / 58824, '', 10);
L('constant, PSI_PER_FT_SG (the rounded field form)', PSI_PER_FT_SG, 'psi/ft per SG', 6);
L('constant, 62.4 divided by 144 (the exact form gradientFromDensity uses)', 62.4 / 144, 'psi/ft per SG', 12);
L('constant, copper temperature coefficient per degF', COPPER_ALPHA_PER_F, 'per degF', 10);
L('constant, copper resistance reference temperature', COPPER_REF_TEMP_F, 'degF', 0);
L('threshold, DEFAULT_GAS_LIMITS standardMax', DEFAULT_GAS_LIMITS.standardMax, 'fraction', 2);
L('threshold, DEFAULT_GAS_LIMITS handlerMax', DEFAULT_GAS_LIMITS.handlerMax, 'fraction', 2);
L('threshold, VISCOSITY_CORRECTION_THRESHOLD_CST', VISCOSITY_CORRECTION_THRESHOLD_CST, 'cSt', 0);
say('threshold, region band: a duty inside the published rate range is recommended');
say('threshold, unless its reference rate is below 0.75 of the BEP rate (downthrust)');
say('threshold, or above 1.25 of the BEP rate (upthrust)');
say('threshold, transcription warning: head fit rmse above 2 percent of the tallest');
say('threshold, published head point');
say('threshold, diagnoseOperation underCurve fires at head ratio below 0.85');
say('threshold, diagnoseOperation overCurve fires at head ratio above 1.15');
say('threshold, diagnoseOperation ampsHigh fires at amps over nameplate above 1.05');
say('threshold, diagnoseOperation ampsLow fires at amps over nameplate below 0.40');
say('threshold, sizePump motorOverloaded fires at selection load fraction above 1');
say('threshold, sizePump motorUnderloaded fires at selection load fraction below 0.5');
say('threshold, selectCable default maximum voltage drop = 5 percent');
say('threshold, motorCurrent flags estimateWeakBelowHalfLoad below load fraction 0.5');

// =====================================================================
H('# SECTION 2: THE PUBLISHED CATALOGUE (data/espCatalog.js)');
say('# Four reference stage MODELS, five copper conductor sizes, five motor');
say('# nameplates. The reference stages are shapes with named parameters and carry');
say('# no manufacturer part number. The cable table carries resistance only: the');
say('# ampacity column is deliberately absent and Section 15 shows what that costs.');
REFERENCE_STAGES.forEach((s) => {
  say(`catalogue stage ${s.id}, label = ${s.label}`);
  L(`catalogue stage ${s.id}, housing outside diameter`, s.housingOdIn, 'in', 2);
  L(`catalogue stage ${s.id}, rate at best efficiency`, s.bepBpd, 'bbl/d', 0);
  L(`catalogue stage ${s.id}, head at best efficiency`, s.bepHeadFt, 'ft', 0);
  L(`catalogue stage ${s.id}, shutoff to BEP head ratio`, s.shutoffRatio, '', 2);
  L(`catalogue stage ${s.id}, peak efficiency`, s.bepEfficiency, 'fraction', 2);
  L(`catalogue stage ${s.id}, published range low`, s.qMin, 'bbl/d', 0);
  L(`catalogue stage ${s.id}, published range high`, s.qMax, 'bbl/d', 0);
});
CABLE_SIZES.forEach((c) => {
  L(`catalogue cable ${c.label}, copper resistance at 77 degF`, c.ohmsPer1000FtAt77F, 'ohms per 1000 ft', 4);
  say(`catalogue cable ${c.label}, ampacity column present = ${Object.prototype.hasOwnProperty.call(c, 'ampacityA')}`);
});
MOTOR_FRAMES.forEach((m) => {
  L(`catalogue motor ${m.id}, nameplate power`, m.hp, 'hp', 0);
  L(`catalogue motor ${m.id}, nameplate voltage`, m.volts, 'V', 0);
  L(`catalogue motor ${m.id}, nameplate current`, m.amps, 'A', 0);
  L(`catalogue motor ${m.id}, series outside diameter`, m.seriesOdIn, 'in', 2);
});

// =====================================================================
H('# SECTION 3: THE PUBLISHED VENDOR STAGE CURVE, AND THE CUBIC THROUGH IT');
say('# Golden vendorCurve. Five points off a published pump curve, a least squares');
say('# cubic in head and a least squares cubic in efficiency, both in the');
say('# normalised variable q divided by the scale. This is the fit a lesson means');
say('# when it says "the cubic fit", and the only curve in this course with a');
say('# residual worth quoting.');
G.vendorCurve.points.forEach((p) => {
  L(`golden vendor curve, published point at ${p.qBpd} bbl/d, head`, p.headFt, 'ft', 4);
  L(`golden vendor curve, published point at ${p.qBpd} bbl/d, efficiency`, p.efficiencyPct, 'percent', 2);
});
L('golden vendor curve, published range low', vendorCurve.qMin, 'bbl/d', 0);
L('golden vendor curve, published range high', vendorCurve.qMax, 'bbl/d', 0);
L('golden vendor curve, reference frequency', vendorCurve.refHz, 'Hz', 0);
L('golden vendor curve, curve specific gravity', vendorCurve.curveSpecificGravity, '', 1);
L('golden vendor curve, head fit degree', vendorCurve.headFit.degree, '', 0);
L('golden vendor curve, head fit normalising scale', vendorCurve.headFit.scale, 'bbl/d', 0);
vendorCurve.headFit.coeffs.forEach((c, i) => {
  L(`golden vendor curve, head fit coefficient on z power ${i}`, c, 'ft', 10);
});
L('golden vendor curve, head fit rmse', vendorCurve.headFit.rmse, 'ft', 10);
L('golden vendor curve, head fit rmse as recorded in the golden', G.vendorCurve.headRmse, 'ft', 10);
L('golden vendor curve, head fit rmse as a fraction of the tallest point',
  vendorCurve.headFit.rmse / 32.0, 'fraction', 8);
L('golden vendor curve, transcription warning threshold, 2 percent of the tallest point',
  0.02 * 32.0, 'ft', 4);
say(`golden vendor curve, warnings raised = ${vendorCurve.warnings.length}`);
L('golden vendor curve, efficiency fit degree', vendorCurve.effFit.degree, '', 0);
vendorCurve.effFit.coeffs.forEach((c, i) => {
  L(`golden vendor curve, efficiency fit coefficient on z power ${i}`, c, 'fraction', 12);
});
L('golden vendor curve, efficiency fit rmse', vendorCurve.effFit.rmse, 'fraction', 10);
say(`golden vendor curve, brake power fit present = ${vendorCurve.bhpFit !== null}`);
say('golden vendor curve, with no vendor power points the brake power per stage is');
say('golden vendor curve, derived from head and efficiency at the pumped gravity');
say('# Fit residual at each published point: the cubic is four coefficients through');
say('# five points, so it misses every one of them, and by how much is the number a');
say('# lesson on fit quality is looking for.');
G.vendorCurve.points.forEach((p) => {
  const fit = polyEval(vendorCurve.headFit, p.qBpd);
  L(`golden vendor curve, head fit read at ${p.qBpd} bbl/d`, fit, 'ft', 8);
  L(`golden vendor curve, head residual at ${p.qBpd} bbl/d`, fit - p.headFt, 'ft', 8);
  const ef = polyEval(vendorCurve.effFit, p.qBpd);
  L(`golden vendor curve, efficiency fit read at ${p.qBpd} bbl/d`, ef, 'fraction', 8);
  L(`golden vendor curve, efficiency residual at ${p.qBpd} bbl/d`, ef - p.efficiencyPct / 100, 'fraction', 8);
});
L('golden vendor curve, best efficiency rate', vendorCurve.bep.qBpd, 'bbl/d', 4);
L('golden vendor curve, best efficiency head', vendorCurve.bep.headFt, 'ft', 6);
L('golden vendor curve, best efficiency value', vendorCurve.bep.efficiency, 'fraction', 9);
L('golden vendor curve, best efficiency rate as recorded in the golden', G.vendorCurve.bep.qBpd, 'bbl/d', 4);
L('golden vendor curve, best efficiency head as recorded in the golden', G.vendorCurve.bep.headFt, 'ft', 6);
L('golden vendor curve, best efficiency value as recorded in the golden', G.vendorCurve.bep.efficiency, 'fraction', 9);
say('# The BEP search is a 400 step scan of the efficiency fit across the published');
say('# range, so the rate it returns is on a grid of that spacing, not a solved');
say('# stationary point. A lesson may say the BEP is found by scanning.');
L('golden vendor curve, BEP scan spacing across the published range',
  (vendorCurve.qMax - vendorCurve.qMin) / 400, 'bbl/d', 4);

// readings across the range
say('# Head, efficiency and brake power per stage read across the published range at');
say('# 60 Hz on a 1.00 specific gravity fluid, and the same on a 0.90 fluid so a');
say('# lesson can show that gravity moves power and moves nothing else.');
[1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500].forEach((q) => {
  const s1 = stagePerformance({ curve: vendorCurve, qBpd: q, hz: 60, specificGravity: 1.0 });
  const s9 = stagePerformance({ curve: vendorCurve, qBpd: q, hz: 60, specificGravity: 0.9 });
  L(`golden vendor curve, at ${q} bbl/d 60 Hz, head`, s1.headFt, 'ft', 6);
  L(`golden vendor curve, at ${q} bbl/d 60 Hz, efficiency`, s1.efficiency, 'fraction', 8);
  L(`golden vendor curve, at ${q} bbl/d 60 Hz SG 1.00, brake power per stage`, s1.bhpPerStage, 'hp', 8);
  L(`golden vendor curve, at ${q} bbl/d 60 Hz SG 0.90, brake power per stage`, s9.bhpPerStage, 'hp', 8);
  say(`golden vendor curve, at ${q} bbl/d 60 Hz, region = ${s1.region}`);
  say(`golden vendor curve, at ${q} bbl/d 60 Hz, inside the published range = ${s1.inRange}`);
});

// =====================================================================
H('# SECTION 4: THE PUBLISHED REFERENCE STAGE MODELS, AND WHY THEIR FITS ARE EXACT');
say('# Golden referenceCurves plus the two catalogue entries the goldens do not');
say('# carry. Nine points are generated from four parameters by a quadratic shape');
say('# and then fitted with a quadratic, so the residual is machine noise. That is');
say('# not a good fit, it is a fit of a shape to itself, and a lesson must say so.');
[['ref-400-1000', c400], ['ref-540-2500', c540], ['ref-562-4000', c562], ['ref-675-7000', c675]]
  .forEach(([id, cv]) => {
    const sp = specOf(id);
    say(`reference stage ${id}, label = ${cv.label}`);
    say(`reference stage ${id}, source = ${cv.source}`);
    L(`reference stage ${id}, generating rate at best efficiency`, sp.bepBpd, 'bbl/d', 0);
    L(`reference stage ${id}, generating head at best efficiency`, sp.bepHeadFt, 'ft', 0);
    L(`reference stage ${id}, generating shutoff head ratio`, sp.shutoffRatio, '', 2);
    L(`reference stage ${id}, generating peak efficiency`, sp.bepEfficiency, 'fraction', 2);
    L(`reference stage ${id}, published range low`, cv.qMin, 'bbl/d', 2);
    L(`reference stage ${id}, published range high`, cv.qMax, 'bbl/d', 2);
    L(`reference stage ${id}, generated point spacing`, (cv.qMax - cv.qMin) / 8, 'bbl/d', 4);
    L(`reference stage ${id}, head fit degree`, cv.headFit.degree, '', 0);
    L(`reference stage ${id}, head fit normalising scale`, cv.headFit.scale, 'bbl/d', 2);
    cv.headFit.coeffs.forEach((c, i) => {
      L(`reference stage ${id}, head fit coefficient on z power ${i}`, c, 'ft', 10);
    });
    L(`reference stage ${id}, head fit rmse`, cv.headFit.rmse, 'ft', 14);
    L(`reference stage ${id}, efficiency fit rmse`, cv.effFit.rmse, 'fraction', 14);
    L(`reference stage ${id}, best efficiency rate`, cv.bep.qBpd, 'bbl/d', 4);
    L(`reference stage ${id}, best efficiency head`, cv.bep.headFt, 'ft', 8);
    L(`reference stage ${id}, best efficiency value`, cv.bep.efficiency, 'fraction', 10);
    L(`reference stage ${id}, shutoff head from the generating shape`, sp.bepHeadFt * sp.shutoffRatio, 'ft', 4);
    L(`reference stage ${id}, recommended band low, 0.75 of the BEP rate`, 0.75 * cv.bep.qBpd, 'bbl/d', 4);
    L(`reference stage ${id}, recommended band high, 1.25 of the BEP rate`, 1.25 * cv.bep.qBpd, 'bbl/d', 4);
    L(`reference stage ${id}, reference rate at which head reaches zero`, zeroHeadQRef(cv), 'bbl/d', 4);
    L(`reference stage ${id}, that rate past the end of the published data`,
      zeroHeadQRef(cv) - cv.qMax, 'bbl/d', 4);
  });
G.referenceCurves.forEach((rc) => {
  L(`golden reference curve ${rc.id}, best efficiency rate as recorded`, rc.bep.qBpd, 'bbl/d', 4);
  L(`golden reference curve ${rc.id}, best efficiency head as recorded`, rc.bep.headFt, 'ft', 10);
  L(`golden reference curve ${rc.id}, best efficiency value as recorded`, rc.bep.efficiency, 'fraction', 10);
  L(`golden reference curve ${rc.id}, head at the nominal BEP rate as recorded`, rc.headAtBep, 'ft', 4);
  rc.samples.forEach((s) => {
    L(`golden reference curve ${rc.id}, sampled head at ${s.qBpd} bbl/d`, s.headFt, 'ft', 10);
  });
});
say('# Head, efficiency and brake power across the published range of the two');
say('# reference stages the golden designs are built on.');
[[c540, 'ref-540-2500', [1250, 1600, 1950, 2300, 2500, 2650, 3000, 3350, 3500]],
  [c675, 'ref-675-7000', [4000, 4800, 5600, 6400, 7000, 7200, 8000, 8800, 9800]]]
  .forEach(([cv, id, rates]) => {
    rates.forEach((q) => {
      const s = stagePerformance({ curve: cv, qBpd: q, hz: 60, specificGravity: 1.0 });
      L(`reference stage ${id}, at ${q} bbl/d 60 Hz, head`, s.headFt, 'ft', 8);
      L(`reference stage ${id}, at ${q} bbl/d 60 Hz, efficiency`, s.efficiency, 'fraction', 10);
      L(`reference stage ${id}, at ${q} bbl/d 60 Hz SG 1.00, brake power per stage`, s.bhpPerStage, 'hp', 10);
      say(`reference stage ${id}, at ${q} bbl/d 60 Hz, region = ${s.region}`);
    });
  });

// =====================================================================
H('# SECTION 5: THE AFFINITY LAWS, ON THE TWELVE PUBLISHED GOLDEN ROWS');
say('# Golden affinity. THE PUBLISHED VENDOR CURVE, that is the cubic through the');
say('# five published vendor points, on a fluid of specific gravity 0.90, three');
say('# rates against four drive frequencies. The laws are exact for a fixed');
say('# impeller: rate scales with speed, head with speed squared, power with speed');
say('# cubed, and efficiency does not move at all. The engine maps the duty rate');
say('# BACK to the reference speed, reads the curve there, and maps forward again.');
let affMax = 0;
G.affinity.forEach((row) => {
  const s = stagePerformance({ curve: vendorCurve, qBpd: row.qBpd, hz: row.hz, specificGravity: row.sg });
  const tag = `golden affinity ${row.hz} Hz ${row.qBpd} bbl/d`;
  L(`${tag}, speed ratio`, s.ratio, '', 8);
  L(`${tag}, equivalent rate on the 60 Hz curve`, s.qRefBpd, 'bbl/d', 6);
  L(`${tag}, head per stage`, s.headFt, 'ft', 10);
  L(`${tag}, efficiency`, s.efficiency, 'fraction', 10);
  L(`${tag}, brake power per stage`, s.bhpPerStage, 'hp', 10);
  say(`${tag}, inside the published range = ${s.inRange}`);
  say(`${tag}, region = ${s.region}`);
  L(`${tag}, head as recorded in the golden`, row.headFt, 'ft', 10);
  L(`${tag}, brake power as recorded in the golden`, row.bhpPerStage, 'hp', 10);
  ['headFt', 'efficiency', 'bhpPerStage', 'qRefBpd'].forEach((k) => {
    const d = Math.abs(s[k] - row[k]) / Math.max(Math.abs(row[k]), 1e-12);
    if (d > affMax) affMax = d;
  });
});
L('golden affinity, largest relative deviation between the engine and the golden across all twelve rows',
  affMax, '', 14);
say('# The same duty rate swept across speed on the same stage, so the squares and');
say('# the cubes can be seen rather than asserted.');
[30, 35, 40, 45, 50, 55, 60, 65, 70].forEach((hz) => {
  const s = stagePerformance({ curve: vendorCurve, qBpd: 2500, hz, specificGravity: 0.9 });
  L(`golden vendor curve at 2500 bbl/d, ${hz} Hz, equivalent 60 Hz rate`, s.qRefBpd, 'bbl/d', 6);
  L(`golden vendor curve at 2500 bbl/d, ${hz} Hz, head per stage`, s.headFt, 'ft', 8);
  L(`golden vendor curve at 2500 bbl/d, ${hz} Hz, efficiency`, s.efficiency, 'fraction', 10);
  L(`golden vendor curve at 2500 bbl/d, ${hz} Hz, brake power per stage`, s.bhpPerStage, 'hp', 10);
  L(`golden vendor curve at 2500 bbl/d, ${hz} Hz, head as a multiple of the 60 Hz head`,
    s.headFt / stagePerformance({ curve: vendorCurve, qBpd: 2500, hz: 60, specificGravity: 0.9 }).headFt, '', 8);
  L(`golden vendor curve at 2500 bbl/d, ${hz} Hz, speed ratio squared`, (hz / 60) ** 2, '', 8);
  L(`golden vendor curve at 2500 bbl/d, ${hz} Hz, speed ratio cubed`, (hz / 60) ** 3, '', 8);
  say(`golden vendor curve at 2500 bbl/d, ${hz} Hz, inside the published range = ${s.inRange}`);
  say(`golden vendor curve at 2500 bbl/d, ${hz} Hz, region = ${s.region}`);
});
say('# The head multiple column does NOT equal the speed ratio squared, and that is');
say('# not a bug in the affinity laws. Holding the DUTY RATE fixed while the speed');
say('# changes moves the reading to a different place on the reference curve, so the');
say('# square law and the curve shape are both acting at once. The square law alone');
say('# is the golden affinity block above, where the reference rate moves with the');
say('# speed.');

// =====================================================================
H('# SECTION 6: THE EDGE OF THE FIT, DEMONSTRATED');
say('# This is the Associate tier whole point. inRange is a FLAG ON THE ANSWER, not');
say('# a refusal. The engine tells you the duty is outside the published data and');
say('# then hands you the number anyway, because a polynomial has an opinion');
say('# everywhere. Nothing snaps. The answers degrade smoothly, which is exactly');
say('# what makes them dangerous.');
say();
say('# THE GOLDEN OWN EXTRAPOLATED ROW. 3200 bbl/d at 40 Hz maps back to 4800 bbl/d');
say('# on the 60 Hz curve, which is 1300 bbl/d past the end of the published data.');
{
  const s = stagePerformance({ curve: vendorCurve, qBpd: 3200, hz: 40, specificGravity: 0.9 });
  L('the golden extrapolated row, 40 Hz 3200 bbl/d, equivalent rate on the 60 Hz curve', s.qRefBpd, 'bbl/d', 4);
  L('the golden extrapolated row, published range low', vendorCurve.qMin, 'bbl/d', 0);
  L('the golden extrapolated row, published range high', vendorCurve.qMax, 'bbl/d', 0);
  L('the golden extrapolated row, distance past the end of the data', s.qRefBpd - vendorCurve.qMax, 'bbl/d', 4);
  L('the golden extrapolated row, head per stage', s.headFt, 'ft', 12);
  L('the golden extrapolated row, brake power per stage', s.bhpPerStage, 'hp', 12);
  L('the golden extrapolated row, efficiency', s.efficiency, 'fraction', 12);
  say(`the golden extrapolated row, inside the published range = ${s.inRange}`);
  say(`the golden extrapolated row, region = ${s.region}`);
  say('the golden extrapolated row, the engine returned a number, not a refusal');
  L('the golden extrapolated row, head as a fraction of the head at the same rate at 60 Hz',
    s.headFt / stagePerformance({ curve: vendorCurve, qBpd: 3200, hz: 60, specificGravity: 0.9 }).headFt, '', 8);
}
say();
say('# THE SWEEP THAT SHOWS NOTHING SNAPS. The golden own cubic read at 60 Hz from');
say('# inside the published data out past the point where head is gone. Read the');
say('# head column down: it falls, it flattens, it crosses zero, and no line in the');
say('# sweep is any different IN KIND from the line above it. There is no step, no');
say('# exception and no refusal at the edge of the data. The only thing that changes');
say('# at 3500 bbl/d is a boolean.');
[3000, 3200, 3400, 3500, 3600, 3800, 4000, 4200, 4400, 4600, 4800, 4806, 4900, 5100, 5500].forEach((q) => {
  const s = stagePerformance({ curve: vendorCurve, qBpd: q, hz: 60, specificGravity: 0.9 });
  L(`golden vendor curve extrapolation, at ${q} bbl/d 60 Hz, head`, s.headFt, 'ft', 8);
  L(`golden vendor curve extrapolation, at ${q} bbl/d 60 Hz, efficiency`, s.efficiency, 'fraction', 8);
  L(`golden vendor curve extrapolation, at ${q} bbl/d 60 Hz, brake power per stage`, s.bhpPerStage, 'hp', 8);
  L(`golden vendor curve extrapolation, at ${q} bbl/d 60 Hz, distance past the end of the data`,
    q - vendorCurve.qMax, 'bbl/d', 0);
  say(`golden vendor curve extrapolation, at ${q} bbl/d 60 Hz, inside the published range = ${s.inRange}`);
  say(`golden vendor curve extrapolation, at ${q} bbl/d 60 Hz, region = ${s.region}`);
});
L('golden vendor curve, rate at which the cubic head fit reaches zero at 60 Hz', zeroHeadQRef(vendorCurve), 'bbl/d', 4);
L('golden vendor curve, that rate past the end of the published data',
  zeroHeadQRef(vendorCurve) - vendorCurve.qMax, 'bbl/d', 4);
say('# The same sweep on a reference stage MODEL, whose head fit is a quadratic');
say('# rather than a cubic, so a lesson can show that the behaviour belongs to');
say('# EXTRAPOLATION and not to the cubic in particular.');
[3000, 3200, 3500, 3800, 4100, 4400, 4700, 4910, 5200, 5600].forEach((q) => {
  const s = stagePerformance({ curve: c540, qBpd: q, hz: 60, specificGravity: 0.9 });
  L(`reference stage ref-540-2500 extrapolation, at ${q} bbl/d 60 Hz, head`, s.headFt, 'ft', 8);
  L(`reference stage ref-540-2500 extrapolation, at ${q} bbl/d 60 Hz, efficiency`, s.efficiency, 'fraction', 8);
  L(`reference stage ref-540-2500 extrapolation, at ${q} bbl/d 60 Hz, brake power per stage`, s.bhpPerStage, 'hp', 8);
  say(`reference stage ref-540-2500 extrapolation, at ${q} bbl/d 60 Hz, inside the published range = ${s.inRange}`);
  say(`reference stage ref-540-2500 extrapolation, at ${q} bbl/d 60 Hz, region = ${s.region}`);
});
L('reference stage ref-540-2500, rate at which the head fit reaches zero at 60 Hz', zeroHeadQRef(c540), 'bbl/d', 4);
L('reference stage ref-540-2500, that rate past the end of the published data',
  zeroHeadQRef(c540) - c540.qMax, 'bbl/d', 4);
say('# The efficiency fit runs out too. On both of these curves the HEAD fit reaches');
say('# zero first and the efficiency fit is still positive there, so the brake power');
say('# per stage goes negative because the hydraulic power went negative, not because');
say('# the efficiency did. Either way the engine returns the number. A negative');
say('# efficiency would DIVIDE the brake power, and on a curve shaped the other way');
say('# round that is the path to a negative horsepower.');
[3500, 3700, 3900, 4100, 4300, 4500, 4800, 5100, 5500].forEach((q) => {
  L(`golden vendor curve extrapolation, efficiency fit read at ${q} bbl/d`,
    polyEval(vendorCurve.effFit, q), 'fraction', 8);
  L(`reference stage ref-540-2500 extrapolation, efficiency fit read at ${q} bbl/d`,
    polyEval(c540.effFit, q), 'fraction', 8);
});
{
  let zeroEff = null;
  for (let q = vendorCurve.qMax; q < 12000; q += 0.01) {
    if (polyEval(vendorCurve.effFit, q) <= 0) { zeroEff = q; break; }
  }
  L('golden vendor curve, rate at which the efficiency fit reaches zero at 60 Hz', zeroEff, 'bbl/d', 2);
  L('golden vendor curve, that is BEYOND the rate at which head reaches zero by',
    zeroEff - zeroHeadQRef(vendorCurve), 'bbl/d', 2);
  L('reference stage ref-540-2500, rate at which the efficiency fit reaches zero at 60 Hz',
    2 * 2500, 'bbl/d', 2);
  L('reference stage ref-540-2500, that is BEYOND the rate at which head reaches zero by',
    5000 - zeroHeadQRef(c540), 'bbl/d', 2);
}

// =====================================================================
H('# SECTION 7: WHAT AN UNBOUNDED FIT COSTS A WHOLE DESIGN');
say('# One stage reading outside the data is a small wrong number. The same reading');
say('# carried through a stage count is a large one, because the stage count');
say('# DIVIDES by it. Both published designs are swept down in frequency below the');
say('# speed they were sized at, and the stack count is the number to watch.');
const designs = {};
G.designs.forEach((d) => {
  const inp = d.inputs;
  const cv = CURVES[inp.curve];
  const pIntake = intakePressure({
    pwfPsia: inp.pwfPsia, perfTvdFt: inp.perfTvdFt, pumpTvdFt: inp.pumpTvdFt,
    annulusGradPsiPerFt: inp.annulusGradPsiPerFt,
  });
  const stream = intakeStream({ qoStbd: inp.qoStbd, wct: inp.wct, gorScfStb: inp.gorScfStb, pvt: inp.pvt });
  const gas = gasHandling({ stream, separatorEfficiency: inp.separatorEfficiency });
  const grad = gradientFromDensity(gas.mixtureDensityLbFt3);
  const sg = grad / PSI_PER_FT_SG;
  const tdh = totalDynamicHead({ pIntakePsia: pIntake, pDischargePsia: inp.pDischargePsia, gradientPsiPerFt: grad });
  const sized = sizePump({
    curve: cv, qBpd: gas.pumpIntakeBpd, tdhFt: tdh.tdhFt, hz: inp.hz,
    specificGravity: sg, nameplateHp: inp.nameplateHp,
  });
  designs[d.id] = { d, inp, cv, pIntake, stream, gas, grad, sg, tdh, sized };
});
Object.values(designs).forEach(({ d, inp, cv, grad, sg, tdh, gas }) => {
  const base = stagePerformance({ curve: cv, qBpd: gas.pumpIntakeBpd, hz: inp.hz, specificGravity: sg });
  [inp.hz, 55, 50, 46, 44, 42, 40].filter((h, i, a) => a.indexOf(h) === i && h <= inp.hz).forEach((hz) => {
    const sz = sizePump({
      curve: cv, qBpd: gas.pumpIntakeBpd, tdhFt: tdh.tdhFt, hz,
      specificGravity: sg, nameplateHp: inp.nameplateHp,
    });
    const tag = `golden design ${d.id} swept to ${hz} Hz`;
    L(`${tag}, equivalent rate on the 60 Hz curve`, sz.stage.qRefBpd, 'bbl/d', 4);
    L(`${tag}, distance past the end of the published data`, sz.stage.qRefBpd - cv.qMax, 'bbl/d', 4);
    L(`${tag}, head per stage`, sz.stage.headFt, 'ft', 6);
    // The value is base/swept, the factor by which head per stage SHRANK, so
    // the label has to say "smaller by a factor of". It first said "as a
    // multiple of the head at the design speed", which is the reciprocal, and
    // that put the field name and the field contents in contradiction: the
    // same row then claimed head per stage was 5.2523 TIMES the design value
    // while the stage count was 5.2552 times it, which cannot both hold when
    // the count is the requirement divided by the head. Found by a lesson
    // writer, who wrote around it rather than propagating it.
    L(`${tag}, head per stage smaller than at the design speed by a factor of`,
      base.headFt / sz.stage.headFt, '', 4);
    L(`${tag}, stages required`, sz.stages, 'stages', 0);
    L(`${tag}, stages as a multiple of the stages at the design speed`,
      sz.stages / sizePump({
        curve: cv, qBpd: gas.pumpIntakeBpd, tdhFt: tdh.tdhFt, hz: inp.hz, specificGravity: sg,
      }).stages, '', 4);
    say(`${tag}, inside the published range = ${sz.stage.inRange}`);
    say(`${tag}, region = ${sz.stage.region}`);
    say(`${tag}, warnings raised = ${sz.warnings.length}`);
    say(`${tag}, warning codes = ${sz.warnings.map((w) => w.code).join(' ') || 'none'}`);
    say(`${tag}, the engine returned a design, not a refusal`);
  });
  L(`golden design ${d.id}, frequency at which the head per stage reaches zero at this duty rate`,
    zeroHeadHz(cv, gas.pumpIntakeBpd), 'Hz', 4);
  L(`golden design ${d.id}, that frequency below the design speed`,
    inp.hz - zeroHeadHz(cv, gas.pumpIntakeBpd), 'Hz', 4);
});
say();
say('# THE FINDING AS THE WAVE RECORDED IT, conditions withheld. The engine finding');
say('# behind result 2 of this course was measured on a design this digest does not');
say('# carry and whose conditions no lesson may print. The headline sizes are');
say('# quotable and the conditions are not, so they are given here alone:');
say('recorded finding at 40 Hz, stages returned = 926 stages');
say('recorded finding at 40 Hz, head per stage = 3.9802 ft');
say('recorded finding at 40 Hz, stages as a multiple of the design speed stack = 5.58');
say('recorded finding at 40 Hz, warnings raised = 3 warnings');
say('recorded finding at 40 Hz, refusals = 0');
say('recorded finding, frequency at which head finally goes negative = 36.1016 Hz');
say('recorded finding, that is 6.5 Hz below the speed where the answers stopped');
say('recorded finding, meaning anything, and the engine answered at every step');
say('# A lesson wanting a case it may print IN FULL uses the swept golden designs');
say('# above, which show the same collapse with every condition on the page.');

// =====================================================================
H('# SECTION 8: TEACHING CURVE BRASS-11, A FIT THAT FAILS ITS OWN CHECK');
say('# TEACHING CURVE, NOT A PUBLISHED CASE. The golden vendor points as');
say('# transcribed by somebody who made a mistake, so a lesson can watch the');
say('# residual and the transcription warning do the job they exist for. The');
say('# warning fires when the head fit rmse exceeds two percent of the tallest');
say('# published head point.');
{
  const good = G.vendorCurve.points;
  const mild = good.map((p) => (p.qBpd === 2500 ? { ...p, headFt: 26.0 } : p));
  const slip = good.map((p) => (p.qBpd === 2000 ? { ...p, headFt: 3.05 } : p));
  [['as published', good], ['mild transcription error, 28.0 typed as 26.0 at 2500 bbl/d', mild],
    ['decimal slip, 30.5 typed as 3.05 at 2000 bbl/d', slip]].forEach(([tag, pts]) => {
    const cv = fitStageCurve({ points: pts });
    L(`teaching curve BRASS-11 ${tag}, head fit rmse`, cv.headFit.rmse, 'ft', 8);
    L(`teaching curve BRASS-11 ${tag}, transcription warning threshold`,
      0.02 * Math.max(...pts.map((p) => p.headFt)), 'ft', 6);
    say(`teaching curve BRASS-11 ${tag}, warnings raised = ${cv.warnings.length}`);
    cv.warnings.forEach((w, i) => say(`teaching curve BRASS-11 ${tag}, warning ${i + 1} = ${w}`));
    L(`teaching curve BRASS-11 ${tag}, head read at 2500 bbl/d 60 Hz`,
      polyEval(cv.headFit, 2500), 'ft', 6);
    L(`teaching curve BRASS-11 ${tag}, best efficiency rate`, cv.bep.qBpd, 'bbl/d', 4);
    L(`teaching curve BRASS-11 ${tag}, best efficiency head`, cv.bep.headFt, 'ft', 6);
  });
  say('# The mild error is the interesting one: the curve still looks like a pump');
  say('# curve, the fit still returns numbers at every rate, and the only thing that');
  say('# says anything is wrong is the residual against its threshold.');
}

// =====================================================================
H('# SECTION 9: THE INTAKE SIDE, ON THE PUBLISHED DESIGNS');
say('# Golden designs. What the pump actually SEES, in the order the module walks');
say('# it: the flowing bottomhole pressure less the annulus column, then the black');
say('# oil PVT at those conditions, then what a separator takes out.');
const dumpIntake = (tag, inp, pIntake, stream, gas, grad, sg) => {
  L(`${tag}, flowing bottomhole pressure`, inp.pwfPsia, 'psia', 1);
  L(`${tag}, perforation depth`, inp.perfTvdFt, 'ft TVD', 0);
  L(`${tag}, pump setting depth`, inp.pumpTvdFt, 'ft TVD', 0);
  L(`${tag}, annulus column above the pump`, inp.perfTvdFt - inp.pumpTvdFt, 'ft', 0);
  L(`${tag}, annulus gradient`, inp.annulusGradPsiPerFt, 'psi/ft', 4);
  L(`${tag}, annulus column pressure`, inp.annulusGradPsiPerFt * (inp.perfTvdFt - inp.pumpTvdFt), 'psi', 4);
  L(`${tag}, pump intake pressure`, pIntake, 'psia', 4);
  L(`${tag}, oil rate at the tank`, inp.qoStbd, 'stb/d', 1);
  L(`${tag}, water cut`, inp.wct, 'fraction', 4);
  L(`${tag}, producing gas oil ratio`, inp.gorScfStb, 'scf/stb', 1);
  L(`${tag}, solution gas at intake conditions, Rs`, inp.pvt.rs, 'scf/stb', 1);
  L(`${tag}, oil formation volume factor, Bo`, inp.pvt.bo, 'rb/stb', 4);
  L(`${tag}, water formation volume factor, Bw`, inp.pvt.bw, 'rb/stb', 4);
  L(`${tag}, gas formation volume factor, Bg`, inp.pvt.bg, 'rb/scf', 6);
  L(`${tag}, oil density at intake`, inp.pvt.rhoO, 'lbm/ft3', 2);
  L(`${tag}, water density at intake`, inp.pvt.rhoW, 'lbm/ft3', 2);
  L(`${tag}, gas density at intake`, inp.pvt.rhoG, 'lbm/ft3', 2);
  L(`${tag}, water rate at the tank`, stream.qwStbd, 'stb/d', 6);
  L(`${tag}, oil rate at depth`, stream.qoResBpd, 'bbl/d', 6);
  L(`${tag}, water rate at depth`, stream.qwResBpd, 'bbl/d', 6);
  L(`${tag}, liquid rate at depth`, stream.liquidResBpd, 'bbl/d', 6);
  L(`${tag}, free gas at standard conditions`, stream.freeGasScfd, 'scf/d', 2);
  L(`${tag}, free gas at depth`, stream.freeGasResBpd, 'bbl/d', 6);
  L(`${tag}, total stream at depth`, stream.totalResBpd, 'bbl/d', 6);
  L(`${tag}, gas volume fraction of the whole stream`, stream.gvf, 'fraction', 10);
  L(`${tag}, liquid density at depth`, stream.liquidDensityLbFt3, 'lbm/ft3', 8);
  L(`${tag}, gas density at depth`, stream.gasDensityLbFt3, 'lbm/ft3', 4);
  L(`${tag}, mixture density of the whole stream`, stream.mixtureDensityLbFt3, 'lbm/ft3', 8);
  L(`${tag}, separator efficiency`, gas.separatorEfficiency, 'fraction', 4);
  L(`${tag}, gas vented up the annulus`, gas.ventedResBpd, 'bbl/d', 6);
  L(`${tag}, gas through the pump`, gas.throughPumpGasResBpd, 'bbl/d', 6);
  L(`${tag}, rate through the pump`, gas.pumpIntakeBpd, 'bbl/d', 6);
  L(`${tag}, gas volume fraction through the pump`, gas.gvfThroughPump, 'fraction', 10);
  L(`${tag}, mixture density through the pump`, gas.mixtureDensityLbFt3, 'lbm/ft3', 8);
  say(`${tag}, verdict = ${gas.verdict}`);
  L(`${tag}, design gradient from the pumped mixture density`, grad, 'psi/ft', 10);
  L(`${tag}, laundered specific gravity, gradient divided by 0.433`, sg, '', 10);
  L(`${tag}, rate at depth as a multiple of the tank liquid rate`,
    stream.liquidResBpd / (inp.qoStbd + stream.qwStbd), '', 8);
};
Object.values(designs).forEach(({ d, inp, pIntake, stream, gas, grad, sg }) => {
  dumpIntake(`golden design ${d.id}`, inp, pIntake, stream, gas, grad, sg);
  L(`golden design ${d.id}, intake pressure as recorded in the golden`, d.intakePressurePsia, 'psia', 4);
  L(`golden design ${d.id}, stream gas volume fraction as recorded in the golden`, d.stream.gvf, 'fraction', 10);
  L(`golden design ${d.id}, mixture density through the pump as recorded in the golden`,
    d.gas.mixtureDensityLbFt3, 'lbm/ft3', 8);
  L(`golden design ${d.id}, rate through the pump as recorded in the golden`, d.gas.pumpIntakeBpd, 'bbl/d', 6);
  L(`golden design ${d.id}, design gradient as recorded in the golden`, d.gradientPsiPerFt, 'psi/ft', 10);
});
say('# Note what the separator does to the DENSITY. Taking gas out of the stream');
say('# leaves the pump swallowing something HEAVIER than the whole stream was, so');
say('# the gradient the head conversion uses is not the stream gradient. On the');
say('# design with a separator the two differ by a real amount.');
Object.values(designs).forEach(({ d, stream, gas }) => {
  L(`golden design ${d.id}, whole stream mixture density`, stream.mixtureDensityLbFt3, 'lbm/ft3', 8);
  L(`golden design ${d.id}, through pump mixture density`, gas.mixtureDensityLbFt3, 'lbm/ft3', 8);
  L(`golden design ${d.id}, the separator makes the pumped fluid heavier by`,
    gas.mixtureDensityLbFt3 - stream.mixtureDensityLbFt3, 'lbm/ft3', 8);
  L(`golden design ${d.id}, and the gradient heavier by`,
    gradientFromDensity(gas.mixtureDensityLbFt3) - gradientFromDensity(stream.mixtureDensityLbFt3), 'psi/ft', 10);
});

// =====================================================================
H('# SECTION 10: THE GAS VERDICT AND ITS TWO THRESHOLDS');
say('# TEACHING WELL QUA-IBOE-4, NOT A PUBLISHED CASE. Both published designs come');
say('# back standard, so a lesson on the thresholds needs a well that trips the');
say('# middle one. This well is built to land between them.');
const qua = {
  id: 'QUA-IBOE-4',
  curve: 'ref-540-2500',
  hz: 60,
  qoStbd: 1400, wct: 0.35, gorScfStb: 700,
  pvt: { rs: 250, bo: 1.25, bw: 1.03, bg: 0.0014, rhoO: 47, rhoW: 63.5, rhoG: 5.5 },
  pwfPsia: 1600, perfTvdFt: 8200, pumpTvdFt: 7600, annulusGradPsiPerFt: 0.28,
  pDischargePsia: 2680, separatorEfficiency: 0.45,
  nameplateHp: 100, nameplateVolts: 1300, nameplateAmps: 49,
  thrustDeratePct: 12, cableLengthFt: 7600, cableTempF: 200, powerFactor: 0.86,
  whpPsia: 220,
};
const ibeno = {
  id: 'IBENO-2',
  curve: 'ref-562-4000',
  hz: 60,
  qoStbd: 1200, wct: 0.7, gorScfStb: 120,
  pvt: { rs: 120, bo: 1.08, bw: 1.01, bg: 0.0015, rhoO: 52, rhoW: 64.5, rhoG: 5 },
  pwfPsia: 900, perfTvdFt: 2400, pumpTvdFt: 2100, annulusGradPsiPerFt: 0.35,
  pDischargePsia: 1100, separatorEfficiency: 0,
  nameplateHp: 60, nameplateVolts: 1000, nameplateAmps: 38,
  thrustDeratePct: 10, cableLengthFt: 2100, cableTempF: 140, powerFactor: 0.85,
  whpPsia: 180,
};
const buildWell = (w) => {
  const cv = CURVES[w.curve];
  const pIntake = intakePressure({
    pwfPsia: w.pwfPsia, perfTvdFt: w.perfTvdFt, pumpTvdFt: w.pumpTvdFt,
    annulusGradPsiPerFt: w.annulusGradPsiPerFt,
  });
  const stream = intakeStream({ qoStbd: w.qoStbd, wct: w.wct, gorScfStb: w.gorScfStb, pvt: w.pvt });
  const gas = gasHandling({ stream, separatorEfficiency: w.separatorEfficiency });
  const grad = gradientFromDensity(gas.mixtureDensityLbFt3);
  const sg = grad / PSI_PER_FT_SG;
  const tdh = totalDynamicHead({ pIntakePsia: pIntake, pDischargePsia: w.pDischargePsia, gradientPsiPerFt: grad });
  const sized = sizePump({
    curve: cv, qBpd: gas.pumpIntakeBpd, tdhFt: tdh.tdhFt, hz: w.hz, specificGravity: sg,
    nameplateHp: w.nameplateHp, thrustDeratePct: w.thrustDeratePct,
  });
  return { w, inp: w, cv, pIntake, stream, gas, grad, sg, tdh, sized };
};
const QUA = buildWell(qua);
const IBE = buildWell(ibeno);
dumpIntake('teaching well QUA-IBOE-4', qua, QUA.pIntake, QUA.stream, QUA.gas, QUA.grad, QUA.sg);
say('# The separator efficiency swept, so the verdict can be seen crossing both');
say('# published thresholds on one well.');
[0, 0.1, 0.2, 0.3, 0.4, 0.45, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].forEach((e) => {
  const g = gasHandling({ stream: QUA.stream, separatorEfficiency: e });
  L(`teaching well QUA-IBOE-4, separator efficiency ${e.toFixed(2)}, gas through the pump`,
    g.throughPumpGasResBpd, 'bbl/d', 6);
  L(`teaching well QUA-IBOE-4, separator efficiency ${e.toFixed(2)}, rate through the pump`,
    g.pumpIntakeBpd, 'bbl/d', 6);
  L(`teaching well QUA-IBOE-4, separator efficiency ${e.toFixed(2)}, gas volume fraction through the pump`,
    g.gvfThroughPump, 'fraction', 8);
  L(`teaching well QUA-IBOE-4, separator efficiency ${e.toFixed(2)}, mixture density through the pump`,
    g.mixtureDensityLbFt3, 'lbm/ft3', 6);
  say(`teaching well QUA-IBOE-4, separator efficiency ${e.toFixed(2)}, verdict = ${g.verdict}`);
});
say('# What the engine REFUSES here: nothing about the verdict is a correlation. The');
say('# separator efficiency is a user or vendor number, the two limits are inputs,');
say('# and no gas handling performance is modelled at all. The verdict names a class');
say('# of equipment and stops.');

// =====================================================================
H('# SECTION 11: TWO CONVERSIONS FOR ONE GRADIENT, AND THE CONVENTION THAT KEEPS THEM EXACT');
say('# The module carries the same conversion twice. gradientFromDensity divides');
say('# density by 144, which is exact. PSI_PER_FT_SG is the rounded field constant');
say('# 0.433. They disagree, and where they meet is the design chain against the');
say('# diagnostics chain.');
L('gradient conversion, exact form, 62.4 divided by 144', 62.4 / 144, 'psi/ft per SG', 12);
L('gradient conversion, rounded form, PSI_PER_FT_SG', PSI_PER_FT_SG, 'psi/ft per SG', 6);
L('gradient conversion, difference', 62.4 / 144 - PSI_PER_FT_SG, 'psi/ft per SG', 12);
L('gradient conversion, difference as a percentage of the rounded form',
  100 * (62.4 / 144 - PSI_PER_FT_SG) / PSI_PER_FT_SG, 'percent', 6);
say('# What that is worth in feet of total dynamic head, on every case in this file.');
[...Object.values(designs).map((x) => ({ tag: `golden design ${x.d.id}`, gas: x.gas, tdh: x.tdh, grad: x.grad })),
  { tag: 'teaching well QUA-IBOE-4', gas: QUA.gas, tdh: QUA.tdh, grad: QUA.grad },
  { tag: 'teaching well IBENO-2', gas: IBE.gas, tdh: IBE.tdh, grad: IBE.grad }]
  .forEach(({ tag, gas, tdh, grad }) => {
    const trueSg = gas.mixtureDensityLbFt3 / 62.4;
    const naiveGrad = PSI_PER_FT_SG * trueSg;
    const naiveTdh = tdh.dpPsi / naiveGrad;
    L(`${tag}, TRUE specific gravity, density divided by 62.4`, trueSg, '', 10);
    L(`${tag}, laundered specific gravity, design gradient divided by 0.433`, grad / PSI_PER_FT_SG, '', 10);
    L(`${tag}, design gradient, the exact conversion`, grad, 'psi/ft', 10);
    L(`${tag}, diagnostics gradient on the TRUE specific gravity`, naiveGrad, 'psi/ft', 10);
    L(`${tag}, head on the design gradient`, tdh.tdhFt, 'ft', 6);
    L(`${tag}, head on the TRUE specific gravity route`, naiveTdh, 'ft', 6);
    L(`${tag}, the two routes disagree by`, naiveTdh - tdh.tdhFt, 'ft', 6);
    L(`${tag}, and by`, 100 * (naiveTdh - tdh.tdhFt) / tdh.tdhFt, 'percent', 6);
    L(`${tag}, on the LAUNDERED specific gravity the two routes disagree by`,
      tdh.dpPsi / (PSI_PER_FT_SG * (grad / PSI_PER_FT_SG)) - tdh.tdhFt, 'ft', 12);
  });
say('# The convention, which is what the goldens are cut on and what every consumer');
say('# in this package uses: derive the specific gravity FROM the design gradient by');
say('# dividing by 0.433, and then 0.433 times that specific gravity is identically');
say('# the design gradient again. The disagreement is not an error in either');
say('# conversion. It is an error in mixing them on one well.');

// =====================================================================
H('# SECTION 12: TOTAL DYNAMIC HEAD, AND ITS THREE PARTS');
say('# TDH is the pressure the pump has to ADD, converted to feet of the fluid it is');
say('# pumping. It is NOT the friction plus the wellhead: the net vertical lift is');
say('# most of it. The engine computes it from the two pressures and then, only for');
say('# the report, decomposes it.');
const decompose = (tag, inp, pIntake, grad, tdh, whpPsia) => {
  const netLiftFt = inp.pumpTvdFt - pIntake / grad;
  const whpHeadFt = whpPsia / grad;
  const frictionFt = tdh.tdhFt - netLiftFt - whpHeadFt;
  const bd = tdhBreakdown({ netLiftFt, frictionFt, whpHeadFt });
  L(`${tag}, pump discharge pressure`, inp.pDischargePsia, 'psia', 1);
  L(`${tag}, pump intake pressure`, pIntake, 'psia', 4);
  L(`${tag}, pressure the pump must add`, tdh.dpPsi, 'psi', 4);
  L(`${tag}, gradient of the fluid in the pump`, grad, 'psi/ft', 10);
  L(`${tag}, total dynamic head`, tdh.tdhFt, 'ft', 6);
  L(`${tag}, TEACHING INPUT, wellhead pressure`, whpPsia, 'psia', 1);
  L(`${tag}, fluid standing above the intake, intake pressure over the gradient`, pIntake / grad, 'ft', 6);
  L(`${tag}, dynamic fluid level below surface`, netLiftFt, 'ft', 6);
  L(`${tag}, part one, net vertical lift`, bd.netLiftFt, 'ft', 6);
  L(`${tag}, part two, tubing friction`, bd.frictionFt, 'ft', 6);
  L(`${tag}, part three, the wellhead term`, bd.whpHeadFt, 'ft', 6);
  L(`${tag}, the three parts summed by tdhBreakdown`, bd.tdhFt, 'ft', 6);
  L(`${tag}, that sum against the head from the two pressures`, bd.tdhFt - tdh.tdhFt, 'ft', 12);
  L(`${tag}, net vertical lift as a share of the whole`, 100 * bd.netLiftFt / tdh.tdhFt, 'percent', 4);
  L(`${tag}, tubing friction as a share of the whole`, 100 * bd.frictionFt / tdh.tdhFt, 'percent', 4);
  L(`${tag}, the wellhead term as a share of the whole`, 100 * bd.whpHeadFt / tdh.tdhFt, 'percent', 4);
  L(`${tag}, tubing friction as a pressure`, bd.frictionFt * grad, 'psi', 4);
  L(`${tag}, the identity the decomposition rests on, discharge less the tubing`,
    inp.pDischargePsia - grad * inp.pumpTvdFt - whpPsia, 'psi', 4);
  say(`${tag}, leaving the net lift out would understate the stage count by roughly an order of magnitude`);
};
Object.values(designs).forEach(({ d, inp, pIntake, grad, tdh }) => {
  const whp = d.id === 'gassyOffshore' ? 400 : 30;
  decompose(`golden design ${d.id}`, inp, pIntake, grad, tdh, whp);
  L(`golden design ${d.id}, total dynamic head as recorded in the golden`, d.tdhFt, 'ft', 6);
});
decompose('teaching well QUA-IBOE-4', qua, QUA.pIntake, QUA.grad, QUA.tdh, qua.whpPsia);
decompose('teaching well IBENO-2', ibeno, IBE.pIntake, IBE.grad, IBE.tdh, ibeno.whpPsia);
say('# Only the wellhead pressure is a teaching input in those three part readings.');
say('# Everything else follows from the two pressures, the gradient and the pump');
say('# depth by the identity printed above: discharge pressure less the tubing');
say('# column less the wellhead pressure is the friction, exactly.');
say('# What TDH REFUSES: the discharge pressure is an INPUT to this module. It is a');
say('# flowing traverse result, and the honest way to get it is to march the tubing');
say('# at the design rate with the gas that is actually still in the stream. This');
say('# module will not guess it from a static column.');

// =====================================================================
H('# SECTION 13: SIZING THE STACK, AND THE MARGIN THAT INTEGERS BUY');
say('# stageCount rounds UP, always. So the head the stack MAKES exceeds the head');
say('# the duty REQUIRES, by somewhere between nothing and one whole stage, and the');
say('# two brake powers that follow differ by exactly that ratio.');
const dumpSizing = (tag, cv, qBpd, tdhFt, hz, sg, sized) => {
  L(`${tag}, rate through the pump`, qBpd, 'bbl/d', 6);
  L(`${tag}, total dynamic head required`, tdhFt, 'ft', 6);
  L(`${tag}, drive frequency`, hz, 'Hz', 0);
  L(`${tag}, specific gravity of the fluid in the pump`, sg, '', 10);
  L(`${tag}, equivalent rate on the 60 Hz curve`, sized.stage.qRefBpd, 'bbl/d', 6);
  L(`${tag}, head per stage`, sized.stage.headFt, 'ft', 8);
  L(`${tag}, efficiency at the duty`, sized.stage.efficiency, 'fraction', 10);
  L(`${tag}, brake power per stage`, sized.stage.bhpPerStage, 'hp', 10);
  say(`${tag}, inside the published range = ${sized.stage.inRange}`);
  say(`${tag}, region = ${sized.stage.region}`);
  L(`${tag}, stages before rounding, head required over head per stage`,
    tdhFt / sized.stage.headFt, 'stages', 8);
  L(`${tag}, stages after rounding up`, sized.stages, 'stages', 0);
  L(`${tag}, the fraction of a stage that was rounded away`,
    sized.stages - tdhFt / sized.stage.headFt, 'stages', 8);
  L(`${tag}, head the stack makes`, sized.headMadeFt, 'ft', 8);
  L(`${tag}, head margin over the requirement`, sized.headMarginFt, 'ft', 8);
  L(`${tag}, head margin as a percentage of the requirement`,
    100 * sized.headMarginFt / tdhFt, 'percent', 6);
  L(`${tag}, head margin as a fraction of one stage`, sized.headMarginFt / sized.stage.headFt, 'stages', 8);
  L(`${tag}, hydraulic power at the head required`, sized.hydraulicHp, 'hp', 8);
  L(`${tag}, shaft horsepower, brake power at the head REQUIRED`, sized.shaftHp, 'hp', 8);
  L(`${tag}, stack brake power, brake power at the head the stack MAKES`, sized.stack.bhpTotal, 'hp', 8);
  L(`${tag}, the two powers differ by`, sized.stack.bhpTotal - sized.shaftHp, 'hp', 8);
  L(`${tag}, and by`, 100 * (sized.stack.bhpTotal - sized.shaftHp) / sized.shaftHp, 'percent', 6);
  L(`${tag}, the power ratio, stack brake power over shaft horsepower`,
    sized.stack.bhpTotal / sized.shaftHp, '', 12);
  L(`${tag}, the head ratio, head made over head required`, sized.headMadeFt / tdhFt, '', 12);
  L(`${tag}, THE IDENTITY, power ratio less head ratio`,
    sized.stack.bhpTotal / sized.shaftHp - sized.headMadeFt / tdhFt, '', 16);
  // PRINT THE DERATE THE WARNINGS WERE RAISED UNDER, because without it this
  // block contradicts the derate sweep further down and neither block is wrong.
  // QUA-IBOE-4 carries a 12 percent thrust derate, so its selection load
  // fraction is 0.9542 / 0.88 and motorOverloaded fires, while the sweep's own
  // 0 percent row shows 0.9542 and no warning at all. A lesson writer reading
  // the two blocks side by side reported it as a contradiction, and was right
  // to: the operative quantity was in neither the label nor the message.
  if (sized.motorLoad) {
    L(`${tag}, thrust derate the sizing ran at`,
      100 * (1 - sized.motorLoad.derate), 'percent', 4);
    L(`${tag}, SELECTION load fraction at that derate`, sized.motorLoad.loadFraction, 'fraction', 10);
  }
  say(`${tag}, warnings raised = ${sized.warnings.length}`);
  sized.warnings.forEach((w) => say(`${tag}, warning ${w.code} = ${w.message}`));
};
Object.values(designs).forEach(({ d, inp, cv, gas, sg, tdh, sized }) => {
  dumpSizing(`golden design ${d.id}`, cv, gas.pumpIntakeBpd, tdh.tdhFt, inp.hz, sg, sized);
  L(`golden design ${d.id}, stages as recorded in the golden`, d.sized.stages, 'stages', 0);
  L(`golden design ${d.id}, head made as recorded in the golden`, d.sized.headMadeFt, 'ft', 8);
  L(`golden design ${d.id}, shaft horsepower as recorded in the golden`, d.sized.shaftHp, 'hp', 8);
  L(`golden design ${d.id}, hydraulic horsepower as recorded in the golden`, d.sized.hydraulicHp, 'hp', 8);
  L(`golden design ${d.id}, head per stage as recorded in the golden`, d.sized.stage.headFt, 'ft', 8);
  L(`golden design ${d.id}, efficiency at the duty as recorded in the golden`, d.sized.stage.efficiency, 'fraction', 10);
  L(`golden design ${d.id}, brake power per stage as recorded in the golden`, d.sized.stage.bhpPerStage, 'hp', 10);
  L(`golden design ${d.id}, load fraction as recorded in the golden`, d.sized.loadFraction, 'fraction', 10);
});
dumpSizing('teaching well QUA-IBOE-4', QUA.cv, QUA.gas.pumpIntakeBpd, QUA.tdh.tdhFt, qua.hz, QUA.sg, QUA.sized);
dumpSizing('teaching well IBENO-2', IBE.cv, IBE.gas.pumpIntakeBpd, IBE.tdh.tdhFt, ibeno.hz, IBE.sg, IBE.sized);
say('# THE MARGIN IS BOUNDED BY ONE STAGE, NOT BY A PERCENTAGE. Compare a stack of');
say('# a couple of hundred stages against a stack of a few dozen: the same one stage');
say('# of slack is worth a fraction of a percent on the tall stack and percent on');
say('# the short one. Here is the requirement swept on the short teaching well so');
say('# the stage count can be watched stepping and the identity checked at each step.');
[550, 600, 650, 680, 700, 720, 725, 740, 750, 770, 790, 810, 830, 850, 900].forEach((tdhFt) => {
  const sz = sizePump({
    curve: IBE.cv, qBpd: IBE.gas.pumpIntakeBpd, tdhFt, hz: ibeno.hz,
    specificGravity: IBE.sg, nameplateHp: ibeno.nameplateHp, thrustDeratePct: ibeno.thrustDeratePct,
  });
  const tag = `teaching well IBENO-2 requirement swept to ${tdhFt} ft`;
  L(`${tag}, stages before rounding`, tdhFt / sz.stage.headFt, 'stages', 6);
  L(`${tag}, stages after rounding up`, sz.stages, 'stages', 0);
  L(`${tag}, head made`, sz.headMadeFt, 'ft', 6);
  L(`${tag}, head margin`, sz.headMarginFt, 'ft', 6);
  L(`${tag}, head margin as a percentage of the requirement`, 100 * sz.headMarginFt / tdhFt, 'percent', 6);
  L(`${tag}, head margin as a fraction of one stage`, sz.headMarginFt / sz.stage.headFt, 'stages', 6);
  L(`${tag}, power ratio less head ratio`,
    sz.stack.bhpTotal / sz.shaftHp - sz.headMadeFt / tdhFt, '', 16);
});
say('# The identity holds to machine precision on every row above, on both published');
say('# designs and on both teaching wells. It is not a coincidence and it is not an');
say('# approximation: brake power is linear in head at a fixed rate and efficiency,');
say('# so the ratio of the two powers IS the ratio of the two heads.');
say('# WHICH POWER THE PUBLISHED METHOD TAKES. PetroWiki, ESP system selection and');
say('# performance calculations, sizes the motor on total stages times brake power');
say('# per stage times specific gravity, which is the SECOND of the two, the power');
say('# at the head the stack MAKES. Everything electrical in this package is built');
say('# on the FIRST, the power at the head required, so it understates by the');
say('# rounding margin. That is the non conservative direction. It was RECORDED and');
say('# NOT FIXED, because every number here is consumed by a live application.');
say('# What that choice is worth, on every case in this file. READ THE DENOMINATOR:');
say('# "head margin as a percentage of the requirement" and "and by" above divide');
say('# the gap by the SMALLER quantity, the head required and the shaft horsepower,');
say('# while "the understatement as a percentage" below divides it by the LARGER,');
say('# the stack brake power. So gassyOffshore reads 0.037359 percent on one');
say('# denominator and 0.037345 percent on the other, and highWaterCut reads');
say('# 0.109901 and 0.109780. They are the same gap, not two findings, and a lesson');
say('# must not present either figure as the other.');
[...Object.values(designs).map((x) => [`golden design ${x.d.id}`, x.sized]),
  ['teaching well QUA-IBOE-4', QUA.sized], ['teaching well IBENO-2', IBE.sized]]
  .forEach(([tag, sz]) => {
    L(`${tag}, the electrical chain is built on`, sz.shaftHp, 'hp', 8);
    L(`${tag}, the published sizing method would take`, sz.stack.bhpTotal, 'hp', 8);
    L(`${tag}, the understatement`, sz.stack.bhpTotal - sz.shaftHp, 'hp', 8);
    L(`${tag}, the understatement as a percentage`,
      100 * (sz.stack.bhpTotal - sz.shaftHp) / sz.stack.bhpTotal, 'percent', 6);
  });

// =====================================================================
H('# SECTION 14: THE ELECTRICAL CHAIN, AND THE SEAM IN THE MIDDLE OF IT');
say('# Golden electrical cases, reproduced end to end. A submersible motor');
say('# nameplate is power, volts and amps at full load, so current at part load is');
say('# the nameplate current scaled by the load fraction. No efficiency curve and no');
say('# power factor curve is invented: below about half load the estimate is flagged');
say('# rather than extrapolated to zero.');
let elecMax = 0;
G.electrical.forEach((e, i) => {
  const inp = e.inputs;
  const r = surfaceRequirement({
    shaftHp: inp.shaftHp, nameplateHp: inp.nameplateHp, nameplateAmps: inp.nameplateAmps,
    nameplateVolts: inp.nameplateVolts, powerFactor: inp.powerFactor,
    lengthFt: inp.lengthFt, ohmsPer1000FtAt77F: inp.ohmsPer1000FtAt77F, cableTempF: inp.cableTempF,
  });
  const tag = `golden electrical case ${i + 1}`;
  L(`${tag}, shaft horsepower`, inp.shaftHp, 'hp', 2);
  L(`${tag}, motor nameplate power`, inp.nameplateHp, 'hp', 0);
  L(`${tag}, motor nameplate voltage`, inp.nameplateVolts, 'V', 0);
  L(`${tag}, motor nameplate current`, inp.nameplateAmps, 'A', 0);
  L(`${tag}, cable length`, inp.lengthFt, 'ft', 0);
  L(`${tag}, cable temperature`, inp.cableTempF, 'degF', 0);
  L(`${tag}, conductor resistance at 77 degF`, inp.ohmsPer1000FtAt77F, 'ohms per 1000 ft', 4);
  L(`${tag}, power factor`, inp.powerFactor, '', 2);
  L(`${tag}, ELECTRICAL load fraction, shaft power over nameplate power`, r.loadFraction, 'fraction', 10);
  L(`${tag}, motor current`, r.amps, 'A', 6);
  say(`${tag}, estimate flagged weak below half load = ${r.estimateWeakBelowHalfLoad}`);
  L(`${tag}, conductor resistance at the cable temperature`, r.resistanceOhmsPer1000Ft, 'ohms per 1000 ft', 10);
  L(`${tag}, voltage drop`, r.dropV, 'V', 8);
  L(`${tag}, voltage drop as a percentage of nameplate voltage`, r.dropPct, 'percent', 8);
  L(`${tag}, voltage required at surface`, r.surfaceVolts, 'V', 8);
  L(`${tag}, apparent power at surface`, r.kva, 'kVA', 8);
  L(`${tag}, real power at surface`, r.kw, 'kW', 8);
  L(`${tag}, power lost as heat in the cable`, r.lossKw, 'kW', 8);
  L(`${tag}, cable loss as a percentage of the real power`, 100 * r.lossKw / r.kw, 'percent', 6);
  L(`${tag}, motor current as recorded in the golden`, e.amps, 'A', 4);
  L(`${tag}, voltage drop as recorded in the golden`, e.dropV, 'V', 8);
  L(`${tag}, voltage drop percentage as recorded in the golden`, e.dropPct, 'percent', 8);
  L(`${tag}, surface voltage as recorded in the golden`, e.surfaceVolts, 'V', 8);
  L(`${tag}, apparent power as recorded in the golden`, e.kva, 'kVA', 8);
  L(`${tag}, cable loss as recorded in the golden`, e.lossKw, 'kW', 8);
  ['amps', 'dropV', 'dropPct', 'surfaceVolts', 'kva', 'kw', 'lossKw', 'loadFraction', 'resistanceOhmsPer1000Ft']
    .forEach((k) => {
      const d = Math.abs(r[k] - e[k]) / Math.max(Math.abs(e[k]), 1e-12);
      if (d > elecMax) elecMax = d;
    });
});
L('golden electrical, largest relative deviation between the engine and the golden across both cases',
  elecMax, '', 14);
say('# The three-phase drop is the standard root three times current times');
say('# resistance times length in thousands of feet. Power factor enters the kVA and');
say('# does NOT enter the resistive drop.');
L('electrical, root three', Math.sqrt(3), '', 10);
say('# Copper resistance against temperature, so a lesson can show the correction');
say('# rather than assert it. Two AWG, the size the first golden case runs.');
[77, 100, 140, 180, 200, 220, 250].forEach((t) => {
  L(`electrical, 2 AWG conductor resistance at ${t} degF`,
    conductorResistance({ ohmsPer1000FtAt77F: 0.1593, tempF: t }), 'ohms per 1000 ft', 10);
  L(`electrical, 2 AWG resistance at ${t} degF as a multiple of the 77 degF value`,
    conductorResistance({ ohmsPer1000FtAt77F: 0.1593, tempF: t }) / 0.1593, '', 8);
});
say();
say('# THE SEAM. Two fields called loadFraction, in one domain, answering different');
say('# questions. espDesign.sizePump returns UTILISATION against the motor USABLE');
say('# rating, that is shaft power over nameplate power times the derate, which is');
say('# the published selection rule. espMotorCable.motorCurrent returns the');
say('# ELECTRICAL load fraction, shaft power over the PLATE, with no derate, because');
say('# the current a machine draws at a shaft load does not move when its permissible');
say('# load is cut. BOTH ARE ARITHMETICALLY RIGHT FOR WHAT THEY MEAN. The trap is');
say('# the shared name, and the amps, the cable pick and the weak estimate flag are');
say('# all built on the underated one.');
L('the seam, the gap between the two is the electrical load fraction times one over the derate less one, evaluated at load fraction 0.89714 and a 12 percent derate',
  0.89714 * (1 / 0.88 - 1) * 100, 'points', 4);
say('# Both fractions side by side, on every case in this file, across a range of');
say('# thrust derates.');
[...Object.values(designs).map((x) => [`golden design ${x.d.id}`, x]),
  ['teaching well QUA-IBOE-4', QUA], ['teaching well IBENO-2', IBE]]
  .forEach(([tag, x]) => {
    const np = x.inp.nameplateHp;
    const elec = x.sized.shaftHp / np;
    L(`${tag}, motor nameplate power`, np, 'hp', 0);
    L(`${tag}, shaft horsepower the chain is built on`, x.sized.shaftHp, 'hp', 8);
    L(`${tag}, ELECTRICAL load fraction from motorCurrent, no derate`, elec, 'fraction', 10);
    [0, 5, 8, 10, 12, 15, 20].forEach((pct) => {
      const sz = sizePump({
        curve: x.cv, qBpd: x.gas.pumpIntakeBpd, tdhFt: x.tdh.tdhFt, hz: x.inp.hz,
        specificGravity: x.sg, nameplateHp: np, thrustDeratePct: pct || undefined,
      });
      L(`${tag}, thrust derate ${pct} percent, derating factor`, sz.motorLoad.derate, '', 4);
      L(`${tag}, thrust derate ${pct} percent, SELECTION load fraction from sizePump`,
        sz.motorLoad.loadFraction, 'fraction', 10);
      L(`${tag}, thrust derate ${pct} percent, the gap between the two fractions`,
        100 * (sz.motorLoad.loadFraction - elec), 'points', 6);
      say(`${tag}, thrust derate ${pct} percent, warning codes = ${sz.warnings.map((w) => w.code).join(' ') || 'none'}`);
    });
    L(`${tag}, motor input power at 0.85 motor efficiency`, x.sized.motorLoad.inputKw, 'kW', 6);
  });
say('# On the undersized teaching motor the seam is not academic: the SELECTION');
say('# fraction crosses one and sizePump raises motorOverloaded, while the');
say('# ELECTRICAL fraction the amps are built on stays below one and raises nothing.');
say('# The same motor is both overloaded and not, depending on which module you ask.');

// =====================================================================
H('# SECTION 15: THE CABLE, AND A CHECK THAT CHECKS NOTHING');
say('# selectCable sorts the table smallest conductor first and takes the cheapest');
say('# candidate that passes both checks: the voltage drop limit AND the ampacity.');
say('# On the shipped table the second check is TRUE BY CONSTRUCTION, because a');
say('# candidate with no ampacityA passes it, and the shipped CABLE_SIZES carry no');
say('# ampacity column at all. So the pick is made on voltage drop alone. That is');
say('# not a wrong cable: it is half of the published method going unrun, and the');
say('# honest statement is that the check does not currently check anything.');
const dumpPick = (tag, args) => {
  const pick = selectCable(args);
  pick.candidates.forEach((c) => {
    L(`${tag}, candidate ${c.cable.label}, resistance at 77 degF`, c.cable.ohmsPer1000FtAt77F, 'ohms per 1000 ft', 4);
    L(`${tag}, candidate ${c.cable.label}, motor current`, c.requirement.amps, 'A', 6);
    L(`${tag}, candidate ${c.cable.label}, voltage drop`, c.requirement.dropV, 'V', 6);
    L(`${tag}, candidate ${c.cable.label}, voltage drop as a percentage`, c.requirement.dropPct, 'percent', 6);
    say(`${tag}, candidate ${c.cable.label}, drop check passed = ${c.dropOk}`);
    say(`${tag}, candidate ${c.cable.label}, ampacity check passed = ${c.ampacityOk}`);
    say(`${tag}, candidate ${c.cable.label}, ampacity declared = ${c.cable.ampacityA === undefined ? 'none' : c.cable.ampacityA}`);
    say(`${tag}, candidate ${c.cable.label}, selected as acceptable = ${c.ok}`);
  });
  say(`${tag}, cable chosen = ${pick.cable ? pick.cable.label : 'none'}`);
  L(`${tag}, maximum drop allowed`, pick.maxDropPct, 'percent', 1);
  if (pick.requirement) {
    L(`${tag}, chosen cable, voltage drop as a percentage`, pick.requirement.dropPct, 'percent', 6);
    L(`${tag}, chosen cable, voltage required at surface`, pick.requirement.surfaceVolts, 'V', 6);
    L(`${tag}, chosen cable, apparent power at surface`, pick.requirement.kva, 'kVA', 6);
    L(`${tag}, chosen cable, power lost as heat in the cable`, pick.requirement.lossKw, 'kW', 6);
  }
  say(`${tag}, every candidate passed the ampacity check = ${pick.candidates.every((c) => c.ampacityOk)}`);
  say(`${tag}, the acceptable flag equals the drop flag on every candidate = ${pick.candidates.every((c) => c.ok === c.dropOk)}`);
  return pick;
};
G.electrical.forEach((e, i) => {
  const inp = e.inputs;
  dumpPick(`golden electrical case ${i + 1} cable pick`, {
    cables: CABLE_SIZES, maxDropPct: 5, shaftHp: inp.shaftHp, nameplateHp: inp.nameplateHp,
    nameplateAmps: inp.nameplateAmps, nameplateVolts: inp.nameplateVolts,
    powerFactor: inp.powerFactor, lengthFt: inp.lengthFt, cableTempF: inp.cableTempF,
  });
});
say('# THE PUBLISHED GATE THAT NAMES THE FAILS OPEN. 192 hp of shaft on a 200 hp,');
say('# 200 A, 4160 V motor is 192 A down the hole. Over 1000 ft the drop on the');
say('# SMALLEST conductor in the table is well inside five percent of 4160 V, so');
say('# selectCable takes 6 AWG at a current no 6 AWG is rated for. The check that');
say('# should have caught it passed because there was nothing to check against.');
dumpPick('gate fixture 192 A on the shipped table', {
  cables: CABLE_SIZES, maxDropPct: 5, shaftHp: 192, nameplateHp: 200,
  nameplateAmps: 200, nameplateVolts: 4160, lengthFt: 1000, cableTempF: 150,
});
say('# The same run with a manufacturer ampacity column supplied on each candidate.');
say('# Now the check bites: three of the five candidates fail it and the pick moves');
say('# up three sizes, from 6 AWG to 1 AWG in a 6, 4, 2, 1, 1/0 table. The arithmetic');
say('# did not change. The DATA did.');
dumpPick('gate fixture 192 A with a manufacturer ampacity column', {
  cables: [
    { ...CABLE_SIZES[0], ampacityA: 105 }, { ...CABLE_SIZES[1], ampacityA: 140 },
    { ...CABLE_SIZES[2], ampacityA: 190 }, { ...CABLE_SIZES[3], ampacityA: 220 },
    { ...CABLE_SIZES[4], ampacityA: 255 },
  ],
  maxDropPct: 5, shaftHp: 192, nameplateHp: 200, nameplateAmps: 200,
  nameplateVolts: 4160, lengthFt: 1000, cableTempF: 150,
});
say('# WHAT selectCable REFUSES. When nothing qualifies it returns nothing, rather');
say('# than the least bad candidate dressed up as an answer. The published gate:');
dumpPick('gate fixture where nothing qualifies', {
  cables: CABLE_SIZES.map((c) => ({ ...c, ampacityA: 10 })),
  maxDropPct: 1, shaftHp: 200, nameplateHp: 250, nameplateAmps: 67,
  nameplateVolts: 1000, lengthFt: 12000, cableTempF: 220,
});
say('# The teaching well, whose small motor and long cable put every candidate over');
say('# the drop limit.');
dumpPick('teaching well QUA-IBOE-4 cable pick', {
  cables: CABLE_SIZES, maxDropPct: 5, shaftHp: QUA.sized.shaftHp, nameplateHp: qua.nameplateHp,
  nameplateAmps: qua.nameplateAmps, nameplateVolts: qua.nameplateVolts,
  powerFactor: qua.powerFactor, lengthFt: qua.cableLengthFt, cableTempF: qua.cableTempF,
});
dumpPick('teaching well IBENO-2 cable pick', {
  cables: CABLE_SIZES, maxDropPct: 5, shaftHp: IBE.sized.shaftHp, nameplateHp: ibeno.nameplateHp,
  nameplateAmps: ibeno.nameplateAmps, nameplateVolts: ibeno.nameplateVolts,
  powerFactor: ibeno.powerFactor, lengthFt: ibeno.cableLengthFt, cableTempF: ibeno.cableTempF,
});
say('# The surface numbers on the two teaching wells, for the lessons that need a');
say('# full electrical chain on a well they may print in full.');
[['teaching well QUA-IBOE-4', qua, QUA], ['teaching well IBENO-2', ibeno, IBE]].forEach(([tag, w, x]) => {
  CABLE_SIZES.forEach((cb) => {
    const r = surfaceRequirement({
      shaftHp: x.sized.shaftHp, nameplateHp: w.nameplateHp, nameplateAmps: w.nameplateAmps,
      nameplateVolts: w.nameplateVolts, powerFactor: w.powerFactor,
      lengthFt: w.cableLengthFt, ohmsPer1000FtAt77F: cb.ohmsPer1000FtAt77F, cableTempF: w.cableTempF,
    });
    L(`${tag} on ${cb.label}, motor current`, r.amps, 'A', 6);
    L(`${tag} on ${cb.label}, voltage drop`, r.dropV, 'V', 6);
    L(`${tag} on ${cb.label}, voltage drop as a percentage`, r.dropPct, 'percent', 6);
    L(`${tag} on ${cb.label}, voltage required at surface`, r.surfaceVolts, 'V', 6);
    L(`${tag} on ${cb.label}, apparent power at surface`, r.kva, 'kVA', 6);
    L(`${tag} on ${cb.label}, real power at surface`, r.kw, 'kW', 6);
    L(`${tag} on ${cb.label}, power lost as heat in the cable`, r.lossKw, 'kW', 6);
  });
});

say();
say('# SECTION 15B: THE PICK, MADE TWICE, ON THE TWO POWERS.');
say('# Everything electrical in this package is built on shaftHp, brake power at the');
say('# head REQUIRED. The published motor sizing method takes stack.bhpTotal, brake');
say('# power at the head the stack MAKES. Here selectCable is run TWICE on one case,');
say('# identical in every argument except which of those two horsepowers it is');
say('# handed, with the five percent limit printed beside both picks.');
say('# PROVENANCE. The two published designs carry no cable string in the goldens, so');
say('# each is given a TEACHING string: the motor is the catalogue frame or the');
say('# published gate fixture motor whose nameplate power equals the design own');
say('# nameplate power, and the length and the temperature are chosen for this');
say('# demonstration. They are not published values and no lesson may call them one.');
const twoPowerPick = (tag, base, sized) => {
  L(`${tag}, motor nameplate power`, base.nameplateHp, 'hp', 0);
  L(`${tag}, motor nameplate voltage`, base.nameplateVolts, 'V', 0);
  L(`${tag}, motor nameplate current`, base.nameplateAmps, 'A', 0);
  L(`${tag}, cable length`, base.lengthFt, 'ft', 0);
  L(`${tag}, cable temperature`, base.cableTempF, 'degF', 0);
  L(`${tag}, shaftHp, brake power at the head REQUIRED`, sized.shaftHp, 'hp', 8);
  L(`${tag}, stack brake power, brake power at the head the stack MAKES`, sized.stack.bhpTotal, 'hp', 8);
  const a = dumpPick(`${tag}, pick on shaftHp`, { ...base, shaftHp: sized.shaftHp });
  const b = dumpPick(`${tag}, pick on stack brake power`, { ...base, shaftHp: sized.stack.bhpTotal });
  const la = a.cable ? a.cable.label : 'none';
  const lb = b.cable ? b.cable.label : 'none';
  say(`${tag}, cable chosen on shaftHp = ${la}`);
  say(`${tag}, cable chosen on stack brake power = ${lb}`);
  if (a.requirement) L(`${tag}, deciding drop on shaftHp`, a.requirement.dropPct, 'percent', 6);
  if (b.requirement) L(`${tag}, deciding drop on stack brake power`, b.requirement.dropPct, 'percent', 6);
  L(`${tag}, maximum drop allowed on both runs`, a.maxDropPct, 'percent', 1);
  say(`${tag}, the pick moved = ${la !== lb}`);
};
say('# The two published designs, each on the motor that matches its own nameplate:');
say('# gassyOffshore on catalogue frame m-250-2400, highWaterCut on the 200 hp,');
say('# 200 A, 4160 V motor of the published 192 A gate fixture.');
twoPowerPick('published design gassyOffshore, teaching cable string', {
  cables: CABLE_SIZES, maxDropPct: 5, nameplateHp: 250, nameplateAmps: 67,
  nameplateVolts: 2400, powerFactor: 0.85, lengthFt: 7000, cableTempF: 180,
}, designs.gassyOffshore.sized);
twoPowerPick('published design highWaterCut, teaching cable string', {
  cables: CABLE_SIZES, maxDropPct: 5, nameplateHp: 200, nameplateAmps: 200,
  nameplateVolts: 4160, powerFactor: 0.88, lengthFt: 5800, cableTempF: 180,
}, designs.highWaterCut.sized);
say('# The two teaching wells on the cable strings they already carry.');
twoPowerPick('teaching well QUA-IBOE-4, its own cable string', {
  cables: CABLE_SIZES, maxDropPct: 5, nameplateHp: qua.nameplateHp, nameplateAmps: qua.nameplateAmps,
  nameplateVolts: qua.nameplateVolts, powerFactor: qua.powerFactor,
  lengthFt: qua.cableLengthFt, cableTempF: qua.cableTempF,
}, QUA.sized);
twoPowerPick('teaching well IBENO-2, its own cable string', {
  cables: CABLE_SIZES, maxDropPct: 5, nameplateHp: ibeno.nameplateHp, nameplateAmps: ibeno.nameplateAmps,
  nameplateVolts: ibeno.nameplateVolts, powerFactor: ibeno.powerFactor,
  lengthFt: ibeno.cableLengthFt, cableTempF: ibeno.cableTempF,
}, IBE.sized);
say('# NONE OF THE FOUR MOVED, and the reason is arithmetic, not luck. A pick moves');
say('# only when the winning candidate drop sits between the limit divided by the');
say('# power ratio and the limit itself. That window is the rounding margin wide, so');
say('# on a 192 stage design it is thousandths of a point and on a 33 stage design it');
say('# is more than a tenth of a point. The short stack is where the flip lives.');
say('# THE FLIP. The teaching well IBENO-2, everything unchanged except a TEACHING');
say('# cable string of 3300 ft, which places its 6 AWG drop inside that window.');
twoPowerPick('teaching well IBENO-2, teaching cable string of 3300 ft', {
  cables: CABLE_SIZES, maxDropPct: 5, nameplateHp: ibeno.nameplateHp, nameplateAmps: ibeno.nameplateAmps,
  nameplateVolts: ibeno.nameplateVolts, powerFactor: ibeno.powerFactor,
  lengthFt: 3300, cableTempF: ibeno.cableTempF,
}, IBE.sized);
say('# One number, read two defensible ways, and a different conductor comes out of');
say('# the same table under the same limit. The arithmetic is right on both runs.');
say('# Which one is the design is the open owner decision, and this is its cost.');

// =====================================================================
H('# SECTION 16: THE DIAGNOSIS, ITS THREE RATIO FLAGS AND THE ONE FIX THAT WAS MADE');
say('# Published gate fixture: reference stage ref-540-2500, 200 stages, specific');
say('# gravity 0.95, 2500 bbl/d at 60 Hz. diagnoseOperation reads the same curve');
say('# backwards, comparing the head the stack SHOULD make against what it IS');
say('# making. It does not guess WHY: wear, free gas through the stages and a wrong');
say('# stage count all look identical from here, and the flag says so.');
const dgCurve = c540;
const dgStages = 200;
const dgSg = 0.95;
const dgExpected = stackPerformance({ curve: dgCurve, stages: dgStages, qBpd: 2500, hz: 60, specificGravity: dgSg });
L('gate fixture diagnosis, stages', dgStages, 'stages', 0);
L('gate fixture diagnosis, specific gravity', dgSg, '', 2);
L('gate fixture diagnosis, rate', 2500, 'bbl/d', 0);
L('gate fixture diagnosis, drive frequency', 60, 'Hz', 0);
L('gate fixture diagnosis, head per stage', dgExpected.headFt / dgStages, 'ft', 8);
L('gate fixture diagnosis, head the stack should make', dgExpected.headFt, 'ft', 6);
L('gate fixture diagnosis, efficiency the curve expects', dgExpected.efficiency, 'fraction', 10);
L('gate fixture diagnosis, brake power the stack should absorb', dgExpected.bhpTotal, 'hp', 8);
say(`gate fixture diagnosis, region = ${dgExpected.region}`);
L('gate fixture diagnosis, diagnostics gradient, 0.433 times the specific gravity',
  PSI_PER_FT_SG * dgSg, 'psi/ft', 8);
say('# The head ratio swept from healthy down through both bands into a clear');
say('# failure, with every flag the sweep raises and the exact text of the message.');
[1.20, 1.16, 1.15, 1.10, 1.00, 0.95, 0.90, 0.87, 0.8600, 0.8520, 0.8500, 0.8499,
  0.8480, 0.8465, 0.8455, 0.8450, 0.8400, 0.80, 0.70, 0.55].forEach((ratio) => {
  const d = diagnoseOperation({
    curve: dgCurve, stages: dgStages, hz: 60, specificGravity: dgSg,
    measured: { qBpd: 2500, headFt: ratio * dgExpected.headFt },
  });
  const tag = `gate fixture diagnosis at head ratio ${ratio.toFixed(4)}`;
  L(`${tag}, head measured`, d.actualHeadFt, 'ft', 6);
  L(`${tag}, head expected`, d.expectedHeadFt, 'ft', 6);
  L(`${tag}, head ratio returned`, d.headRatio, 'fraction', 10);
  L(`${tag}, head ratio printed to one decimal place`, d.headRatio * 100, 'percent', 1);
  say(`${tag}, head ratio as it WOULD have printed to no decimal places = ${(d.headRatio * 100).toFixed(0)} percent`);
  say(`${tag}, flags raised = ${d.flags.map((f) => f.code).join(' ') || 'none'}`);
  d.flags.forEach((f) => say(`${tag}, message = ${f.message}`));
});
say('# THE BOUNDARY BAND THAT WAS THE DEFECT. underCurve fires on a STRICT');
say('# inequality below 0.85 and then prints the ratio it fired on. Rounded to whole');
say('# percent, everything in the first tenth of a percent below the threshold');
say('# rendered AS the threshold: a real warning that reads like a false alarm and');
say('# invites a user to dismiss it. Watch the two printings disagree across');
say('# [0.845, 0.85).');
[0.8450, 0.8455, 0.8461, 0.8470, 0.8475, 0.8480, 0.8490, 0.8495, 0.8499].forEach((ratio) => {
  const d = diagnoseOperation({
    curve: dgCurve, stages: dgStages, hz: 60, specificGravity: dgSg,
    measured: { qBpd: 2500, headFt: ratio * dgExpected.headFt },
  });
  const p = d.headRatio * 100;
  say(`underCurve band at head ratio ${ratio.toFixed(4)}, flag raised = ${d.flags.some((f) => f.code === 'underCurve')}`);
  say(`underCurve band at head ratio ${ratio.toFixed(4)}, prints now = ${p.toFixed(1)} percent`);
  say(`underCurve band at head ratio ${ratio.toFixed(4)}, printed before the fix = ${p.toFixed(0)} percent`);
  say(`underCurve band at head ratio ${ratio.toFixed(4)}, the old print equalled the threshold = ${p.toFixed(0) === '85'}`);
});
say('# ampsHigh fires above 1.05 and had the same defect over (1.05, 1.055].');
[1.0500, 1.0505, 1.0510, 1.0520, 1.0530, 1.0540, 1.0550, 1.0600].forEach((load) => {
  const d = diagnoseOperation({
    curve: dgCurve, stages: dgStages, hz: 60, specificGravity: dgSg, nameplateAmps: 60,
    measured: { qBpd: 2500, headFt: dgExpected.headFt, amps: load * 60 },
  });
  const p = load * 100;
  L(`ampsHigh band at load ${load.toFixed(4)}, motor current`, load * 60, 'A', 4);
  L(`ampsHigh band at load ${load.toFixed(4)}, amps over nameplate returned`, d.ampsLoad, 'fraction', 10);
  say(`ampsHigh band at load ${load.toFixed(4)}, flag raised = ${d.flags.some((f) => f.code === 'ampsHigh')}`);
  say(`ampsHigh band at load ${load.toFixed(4)}, prints now = ${p.toFixed(1)} percent`);
  say(`ampsHigh band at load ${load.toFixed(4)}, printed before the fix = ${p.toFixed(0)} percent`);
  say(`ampsHigh band at load ${load.toFixed(4)}, the old print equalled the threshold = ${p.toFixed(0) === '105'}`);
  d.flags.filter((f) => f.code === 'ampsHigh').forEach((f) => say(`ampsHigh band at load ${load.toFixed(4)}, message = ${f.message}`));
});
say('# ampsLow fires below 0.40 and had the same defect over [0.395, 0.40).');
[0.3900, 0.3950, 0.3960, 0.3970, 0.3980, 0.3990, 0.3999, 0.4000, 0.4200].forEach((load) => {
  const d = diagnoseOperation({
    curve: dgCurve, stages: dgStages, hz: 60, specificGravity: dgSg, nameplateAmps: 60,
    measured: { qBpd: 2500, headFt: dgExpected.headFt, amps: load * 60 },
  });
  const p = load * 100;
  L(`ampsLow band at load ${load.toFixed(4)}, motor current`, load * 60, 'A', 4);
  say(`ampsLow band at load ${load.toFixed(4)}, flag raised = ${d.flags.some((f) => f.code === 'ampsLow')}`);
  say(`ampsLow band at load ${load.toFixed(4)}, prints now = ${p.toFixed(1)} percent`);
  say(`ampsLow band at load ${load.toFixed(4)}, printed before the fix = ${p.toFixed(0)} percent`);
  say(`ampsLow band at load ${load.toFixed(4)}, the old print equalled the threshold = ${p.toFixed(0) === '40'}`);
  d.flags.filter((f) => f.code === 'ampsLow').forEach((f) => say(`ampsLow band at load ${load.toFixed(4)}, message = ${f.message}`));
});
say('# WHAT THE FIX CHANGED AND WHAT IT DID NOT. It changed toFixed(0) to');
say('# toFixed(1) in three message templates. It changed no threshold, no');
say('# comparison, no returned field and no arithmetic anywhere. Every flag that');
say('# fired before the fix fires after it, at the same ratio, and every number the');
say('# function RETURNS is bit for bit what it was. The only thing that moved is what');
say('# a human reads. That is the whole of the change, and it is the only one of the');
say('# five findings in this wave that was allowed to be made.');
L('the fix, thresholds changed', 0, '', 0);
L('the fix, returned fields changed', 0, '', 0);
L('the fix, message templates changed', 3, '', 0);
say('# Head can come from the two pressures instead of being handed over, and that');
say('# is the route the gradient seam runs through.');
{
  const grad = PSI_PER_FT_SG * dgSg;
  const d = diagnoseOperation({
    curve: dgCurve, stages: dgStages, hz: 60, specificGravity: dgSg,
    measured: { qBpd: 2500, pIntakePsia: 800, pDischargePsia: 800 + grad * 5000 },
  });
  L('gate fixture diagnosis from pressures, intake pressure', 800, 'psia', 0);
  L('gate fixture diagnosis from pressures, discharge pressure', 800 + grad * 5000, 'psia', 6);
  L('gate fixture diagnosis from pressures, diagnostics gradient', grad, 'psi/ft', 8);
  L('gate fixture diagnosis from pressures, head recovered', d.actualHeadFt, 'ft', 8);
  L('gate fixture diagnosis from pressures, head ratio', d.headRatio, 'fraction', 10);
  say(`gate fixture diagnosis from pressures, flags raised = ${d.flags.map((f) => f.code).join(' ') || 'none'}`);
}
say('# The region flag prints the duty as a multiple of the best efficiency rate.');
[1400, 1700, 1875, 2000, 2500, 3000, 3124, 3300, 3500].forEach((q) => {
  const d = diagnoseOperation({
    curve: dgCurve, stages: dgStages, hz: 60, specificGravity: dgSg,
    measured: { qBpd: q, headFt: stackPerformance({ curve: dgCurve, stages: dgStages, qBpd: q, hz: 60, specificGravity: dgSg }).headFt },
  });
  L(`gate fixture diagnosis at ${q} bbl/d, duty as a multiple of the best efficiency rate`, d.qOverBep, '', 6);
  say(`gate fixture diagnosis at ${q} bbl/d, region = ${d.region}`);
  say(`gate fixture diagnosis at ${q} bbl/d, flags raised = ${d.flags.map((f) => f.code).join(' ') || 'none'}`);
  d.flags.filter((f) => f.code === 'downthrust' || f.code === 'upthrust')
    .forEach((f) => say(`gate fixture diagnosis at ${q} bbl/d, message = ${f.message}`));
});
say('# WHAT A DIAGNOSIS REFUSES. It never names a cause. It compares two heads and');
say('# two currents against four numbers and reports which comparison failed. There');
say('# is no wear model, no gas lock model and no failure mode in this function.');

// =====================================================================
H('# SECTION 17: THE STACK CURVE, FOR PLOTTING AGAINST A WELL');
say('# Published gate fixture at 50 Hz. The rate range is the published range scaled');
say('# by the speed ratio, so a slower drive plots a shorter curve, and the head');
say('# falls monotonically across it.');
{
  const rows = stackCurve({ curve: dgCurve, stages: dgStages, hz: 50, specificGravity: dgSg, nPoints: 12 });
  L('gate fixture stack curve at 50 Hz, rate range low', rows[0].qBpd, 'bbl/d', 6);
  L('gate fixture stack curve at 50 Hz, rate range high', rows[rows.length - 1].qBpd, 'bbl/d', 6);
  L('gate fixture stack curve at 50 Hz, published range low times the speed ratio', dgCurve.qMin * (50 / 60), 'bbl/d', 6);
  L('gate fixture stack curve at 50 Hz, published range high times the speed ratio', dgCurve.qMax * (50 / 60), 'bbl/d', 6);
  rows.forEach((r, i) => {
    L(`gate fixture stack curve at 50 Hz, point ${i + 1}, rate`, r.qBpd, 'bbl/d', 4);
    L(`gate fixture stack curve at 50 Hz, point ${i + 1}, head`, r.headFt, 'ft', 6);
    L(`gate fixture stack curve at 50 Hz, point ${i + 1}, efficiency`, r.efficiency, 'fraction', 8);
    L(`gate fixture stack curve at 50 Hz, point ${i + 1}, brake power total`, r.bhpTotal, 'hp', 6);
    say(`gate fixture stack curve at 50 Hz, point ${i + 1}, region = ${r.region}`);
  });
}

// =====================================================================
H('# SECTION 18: VISCOSITY, WHICH THIS ENGINE WILL NOT GUESS AT');
say('# The industry correction for viscous service is the Hydraulic Institute chart,');
say('# ANSI/HI 9.6.7. It is NOT reproduced here from memory. This module reports the');
say('# in situ viscosity, flags when a correction is required, and applies factors');
say('# ONLY when the user supplies them. Applying invented factors would be worse');
say('# than applying none, and that is the refusal.');
L('viscosity, correction threshold', VISCOSITY_CORRECTION_THRESHOLD_CST, 'cSt', 0);
[[2, 55], [8, 58], [20, 58], [60, 58], [150, 60]].forEach(([cp, rho]) => {
  const v = viscosityCheck({ viscosityCp: cp, densityLbFt3: rho });
  L(`viscosity check at ${cp} cp and ${rho} lbm/ft3, specific gravity`, rho / 62.4, '', 8);
  L(`viscosity check at ${cp} cp and ${rho} lbm/ft3, kinematic viscosity`, v.viscosityCSt, 'cSt', 6);
  say(`viscosity check at ${cp} cp and ${rho} lbm/ft3, correction required = ${v.correctionRequired}`);
  say(`viscosity check at ${cp} cp and ${rho} lbm/ft3, factors applied = ${v.factorsApplied}`);
  say(`viscosity check at ${cp} cp and ${rho} lbm/ft3, note = ${v.note}`);
});
{
  const stage = stagePerformance({ curve: c540, qBpd: 2500, hz: 60, specificGravity: 0.95 });
  const corr = applyViscosityFactors(stage, { cq: 0.9, ch: 0.85, ceta: 0.7 });
  L('viscosity factors, uncorrected head per stage', stage.headFt, 'ft', 8);
  L('viscosity factors, uncorrected efficiency', stage.efficiency, 'fraction', 10);
  L('viscosity factors, supplied head factor', 0.85, '', 2);
  L('viscosity factors, supplied efficiency factor', 0.70, '', 2);
  L('viscosity factors, supplied rate factor', 0.90, '', 2);
  L('viscosity factors, corrected head per stage', corr.headFt, 'ft', 8);
  L('viscosity factors, corrected efficiency', corr.efficiency, 'fraction', 10);
  L('viscosity factors, corrected rate', corr.qCorrectedBpd, 'bbl/d', 6);
  say(`viscosity factors, with no factors supplied the reading is returned unchanged = ${applyViscosityFactors(stage, null) === stage}`);
}

// =====================================================================
H('# SECTION 19: EVERY REFUSAL IN THE THREE MODULES, IN ONE PLACE');
say('# Every lesson in this course has to say what its subject REFUSES to do. These');
say('# are the refusals the engine actually makes, as opposed to the flags it raises');
say('# while answering anyway.');
{
  const short = fitStageCurve({ points: [{ qBpd: 1500, headFt: 32 }, { qBpd: 2500, headFt: 28 }] });
  say(`refusal, fitStageCurve on two points, ok = ${short.ok}`);
  say(`refusal, fitStageCurve on two points, message = ${short.warnings[0]}`);
  say(`refusal, fitStageCurve on two points, a head fit was returned = ${short.headFit !== undefined}`);
}
{
  const noEff = fitStageCurve({ points: G.vendorCurve.points.map((p) => ({ qBpd: p.qBpd, headFt: p.headFt })) });
  say(`refusal, fitStageCurve with no efficiency points, ok = ${noEff.ok}`);
  say(`refusal, fitStageCurve with no efficiency points, warning = ${noEff.warnings[0]}`);
  L('refusal, fitStageCurve with no efficiency points, best efficiency rate', noEff.bep.qBpd, 'bbl/d', 4);
  const s = stagePerformance({ curve: noEff, qBpd: 2500, hz: 60, specificGravity: 0.9 });
  L('refusal, with no efficiency fit the head still reads at 2500 bbl/d', s.headFt, 'ft', 6);
  L('refusal, and the brake power per stage is', s.bhpPerStage, 'hp', 6);
}
L('refusal, brakeHp at zero efficiency',
  brakeHp({ qBpd: 2000, headFt: 5000, specificGravity: 1, efficiency: 0 }), '', 0);
L('refusal, stageCount with a head per stage of zero', stageCount({ tdhFt: 4000, headPerStageFt: 0 }), '', 0);
L('refusal, stageCount with a negative head per stage', stageCount({ tdhFt: 4000, headPerStageFt: -3 }), '', 0);
L('refusal, totalDynamicHead with a gradient of zero',
  totalDynamicHead({ pIntakePsia: 1000, pDischargePsia: 3000, gradientPsiPerFt: 0 }).tdhFt, '', 0);
L('refusal, totalDynamicHead with a gradient of zero still returns the pressure difference',
  totalDynamicHead({ pIntakePsia: 1000, pDischargePsia: 3000, gradientPsiPerFt: 0 }).dpPsi, 'psi', 1);
L('refusal, motorCurrent with a nameplate power of zero',
  motorCurrent({ shaftHp: 50, nameplateHp: 0, nameplateAmps: 49 }).amps, '', 0);
L('refusal, motorCurrent with a nameplate current of zero',
  motorCurrent({ shaftHp: 50, nameplateHp: 100, nameplateAmps: 0 }).amps, '', 0);
{
  const s = stagePerformance({ curve: c540, qBpd: 2500, hz: 0, specificGravity: 0.9 });
  L('refusal, stagePerformance at zero frequency, head', s.headFt, '', 0);
  say(`refusal, stagePerformance at zero frequency, region = ${s.region}`);
  say(`refusal, stagePerformance at zero frequency, inside the published range = ${s.inRange}`);
}
{
  const b = bepOf({ headFit: c540.headFit, effFit: null, qMin: c540.qMin, qMax: c540.qMax });
  L('refusal, bepOf with no efficiency fit, rate', b.qBpd, '', 0);
  L('refusal, bepOf with no efficiency fit, head', b.headFt, '', 0);
}
{
  const m = motorCurrent({ shaftHp: 20, nameplateHp: 100, nameplateAmps: 49 });
  L('refusal, motorCurrent at a fifth of plate, load fraction', m.loadFraction, 'fraction', 4);
  L('refusal, motorCurrent at a fifth of plate, current', m.amps, 'A', 4);
  say(`refusal, motorCurrent at a fifth of plate, estimate flagged weak = ${m.estimateWeakBelowHalfLoad}`);
  say('refusal, below about half load the real current flattens toward the');
  say('refusal, magnetising current, so the linear scaling is flagged rather than');
  say('refusal, quietly extrapolated toward zero');
}
say('# And the two things the package refuses to CONTAIN. There are no manufacturer');
say('# part numbers with invented curves behind them anywhere in it, and there is no');
say('# ampacity column in the cable table, because ampacity belongs to the insulation');
say('# system and the well temperature and is an input.');

// =====================================================================
// WRITE, THEN GUARD
// =====================================================================
const digestPath = path.join(HERE, 'digest.txt');
fs.writeFileSync(digestPath, `${OUT.join('\n')}\n`, 'utf8');

const FIELDS = JSON.parse(fs.readFileSync(path.join(HERE, 'fields.json'), 'utf8'));
const SCALES = [1, 1000, 0.001];
const NUM = /-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g;

const guard = (file) => {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  let best = null;
  const hits = [];
  lines.forEach((line, li) => {
    const ms = line.match(NUM) || [];
    ms.forEach((m) => {
      const n = Number(m);
      if (!Number.isFinite(n)) return;
      FIELDS.forEach(([tier, name, value, tol]) => {
        SCALES.forEach((s) => {
          const cand = n / s;
          const dist = Math.abs(cand - value);
          const count = dist / tol;
          const rec = {
            count, tier, name, value, tol, printed: m, scale: s, line: li + 1, text: line,
          };
          if (best === null || count < best.count) best = rec;
          if (count <= 10) hits.push(rec);
        });
      });
    });
  });
  return { best, hits, lineCount: lines.length - 1 };
};

let g = guard(digestPath);
const verdict = [];
verdict.push('');
verdict.push('# LEAK GUARD VERDICT');
verdict.push('# Every number on every line of this file, in three unit shiftings, against');
verdict.push('# all eighteen graded capstone answers, at ten times the grader absolute');
verdict.push('# acceptance band.');
verdict.push(`leak guard, graded fields checked = ${FIELDS.length} fields`);
verdict.push('leak guard, unit shiftings checked = as printed, times a thousand, divided by a thousand');
verdict.push(`leak guard, numbers landing inside ten tolerances of a graded answer = ${g.hits.length}`);
verdict.push('leak guard, numbers withheld = 0');
verdict.push(`leak guard, closest approach, field = ${g.best.tier} ${g.best.name}`);
verdict.push(`leak guard, closest approach, distance in tolerances = ${g.best.count.toExponential(4)}`);
verdict.push('leak guard, no lesson may reconstruct a graded answer from this file');
fs.appendFileSync(digestPath, `${verdict.join('\n')}\n`, 'utf8');

g = guard(digestPath);
console.log('digest written:', digestPath);
console.log('lines:', g.lineCount);
console.log('graded fields:', FIELDS.length);
console.log('hits within 10 tolerances:', g.hits.length);
g.hits.slice(0, 40).forEach((h) => {
  console.log(`  HIT ${h.count.toFixed(3)} tol  ${h.tier}.${h.name} exp=${h.value} tol=${h.tol} scale=${h.scale} printed=${h.printed} line ${h.line}`);
  console.log(`       ${h.text}`);
});
console.log('closest approach:');
console.log(`  field: ${g.best.tier}.${g.best.name}`);
console.log(`  graded value: ${g.best.value}   absolute tolerance: ${g.best.tol}`);
console.log(`  nearest digest number: ${g.best.printed} (unit scale ${g.best.scale})`);
console.log(`  distance: ${Math.abs(g.best.printed / g.best.scale - g.best.value).toExponential(6)}  =  ${g.best.count.toExponential(6)} tolerances`);
console.log(`  line ${g.best.line}: ${g.best.text.slice(0, 160)}`);

// second and third closest, for the report
const all = [];
{
  const lines = fs.readFileSync(digestPath, 'utf8').split('\n');
  lines.forEach((line, li) => {
    (line.match(NUM) || []).forEach((m) => {
      const n = Number(m);
      if (!Number.isFinite(n)) return;
      FIELDS.forEach(([tier, name, value, tol]) => {
        SCALES.forEach((s) => {
          all.push({ count: Math.abs(n / s - value) / tol, tier, name, printed: m, scale: s, line: li + 1, text: line });
        });
      });
    });
  });
}
all.sort((a, b) => a.count - b.count);
console.log('five closest approaches:');
const seen = new Set();
let shown = 0;
for (const a of all) {
  const k = `${a.tier}.${a.name}|${a.printed}|${a.scale}`;
  if (seen.has(k)) continue;
  seen.add(k);
  console.log(`  ${a.count.toExponential(4)} tol  ${a.tier}.${a.name}  printed=${a.printed} scale=${a.scale} line ${a.line}`);
  shown += 1;
  if (shown >= 5) break;
}
