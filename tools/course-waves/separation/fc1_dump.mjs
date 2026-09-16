// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of separator_cases.json and
// spacing_cases.json (plus sweeps around those published inputs) and the
// TEACHING FIELDS this wave designed for itself: the ABANA vessels, the
// AGBAMI three-phase separator and the ERHA flow station. THE FC1
// CAPSTONE RUNS DIFFERENT CONDITIONS ENTIRELY: nothing here imports,
// reads or reproduces the capstone generator, the graded answer file, or
// any capstone stream, pressure, rate, droplet size, coordinate or duty.
// The lab greps this source for the capstone names and for the graded
// answer file's name, so none of them is spelled out here.
//
// Usage:  sh /root/fc-wip-separation/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/fc-wip-separation/digest.txt
//
// Engines, as repaired before this course in FC1-0 (engines #188):
// engines/facilities/separatorSizing.js and engines/facilities/spacing.js,
// over engines/production/gasProperties.js for the DAK z factor.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where
// a line says "golden" (read from a published case's expected block) or
// "derived" (arithmetic on engine values printed on the same row or in
// the same block, with the arithmetic stated). Nothing here reads a
// clock, a random number or a network.

import fs from 'fs';
import {
  ABANA_1, ABANA_1_SWEEP, ABANA_2, ABANA_2_SWEEP, ABANA_2_WIDE_BAND, ABANA_2_LOW_LEVEL_FRAC,
  ABANA_SLUG, ABANA_FINGERS, ABANA_FINGERS_FEW,
  AGBAMI, AGBAMI_EXPLICIT_WATER_FRAC, AGBAMI_TIGHT_WATER_DROPLET_MICRON,
  AGBAMI_SWEEP, AGBAMI_NARROW_BAND,
  ERHA_ITEMS, ERHA_FLARE, ERHA_POOL, ERHA_UNPLACED, ERHA_GHOST_SOURCE, ERHA_DATUM,
} from '/root/fc-wip-separation/fc1_fields.mjs';

const ROOT = process.env.FC1_ENGINES || '/root/wt-fc1-nextgen/packages/engines';
const S = await import(`${ROOT}/engines/facilities/separatorSizing.js`);
const L = await import(`${ROOT}/engines/facilities/spacing.js`);
const GP = await import(`${ROOT}/engines/production/gasProperties.js`);
const G = JSON.parse(fs.readFileSync(`${ROOT}/test-data/facilities/goldens/separator_cases.json`, 'utf8'));
const GL = JSON.parse(fs.readFileSync(`${ROOT}/test-data/facilities/goldens/spacing_cases.json`, 'utf8'));

const out = [];
const w = (s = '') => out.push(s);
const num = (x, n) => (x === null || x === undefined || Number.isNaN(Number(x)) ? 'null' : Number(x).toFixed(n));
const e6 = (x) => num(x, 6);   // engineering: ft, ft2, ft/s, lb/ft3, ratios
const m4 = (x) => num(x, 4);   // metres, kW, seconds
const attempt = (fn) => { try { return { ok: true, value: fn() }; } catch (err) { return { ok: false, error: err.message, name: err.name, input: err.input }; } };
const refusal = (a) => (a.ok ? (a.value && a.value.error ? `returned { error: "${a.value.error}" }` : 'accepted') : `${a.name} on ${a.input}: "${a.error}"`);
const soft = (r) => (r && r.error ? `{ error: "${r.error}" }` : 'no error');

/** The chain the Separator & Slug Catcher Designer runs on a stream:
 *  conditions, then z and the two densities, then K, then settling, then
 *  the actual gas rate the vessel sees. */
const conditions = (p) => {
  const pPsia = p.pPsig + 14.7;
  const gas = S.gasDensityLbFt3({ pPsia, tF: p.tF, gasSg: p.gasSg });
  const rhoOil = p.oilApi !== undefined ? S.oilDensityLbFt3(p.oilApi) : p.sgOil * 62.4;
  const rhoWater = (p.waterSg ?? p.sgWater) * 62.4;
  const qLiquid = p.qOilBpd + p.qWaterBpd;
  const rhoLiquid = (rhoOil * p.qOilBpd + rhoWater * p.qWaterBpd) / qLiquid;
  const k = S.kValue({ internalsId: p.internalsId, pPsig: p.pPsig });
  const vt = S.terminalVelocityFtS({ k: k.k, rhoLLbFt3: rhoLiquid, rhoGLbFt3: gas.rhoLbFt3 });
  return {
    pPsia, gas, z: gas.z, ppr: gas.ppr, tpr: gas.tpr,
    rhoGas: gas.rhoLbFt3, rhoOil, rhoWater, rhoLiquid, qLiquid,
    kResult: k, k: k.k, vT: vt.vFtS,
    qGasActFt3S: S.gasActualFt3S({ qGasMMscfd: p.qGasMMscfd, pPsia, tF: p.tF, z: gas.z }),
  };
};

const A1 = conditions(ABANA_1);
const A2 = conditions(ABANA_2);
const AG = conditions(AGBAMI);

const sweepRows = (res) => {
  w('| diameter ft | length ft | L/D | in band | feasible | reasons |');
  w('| --- | --- | --- | --- | --- | --- |');
  res.rows.forEach((r) => w(`| ${e6(r.diameterFt)} | ${e6(r.lengthFt)} | ${e6(r.ldRatio)} | ${r.inRange} | ${r.feasible} | ${r.reasons.join(', ') || 'none'} |`));
  w(`preferred ${res.preferred ? `${e6(res.preferred.diameterFt)} ft` : 'null'}, preferredStatus ${res.preferredStatus}, band ${e6(res.ldMin)} to ${e6(res.ldMax)}.`);
};

// ------------------------------------------------------------------ header
w('# FC1 Separation & Slug Catching. Teaching digest.');
w('# Vessel work prints to six decimals: every ft, ft2, lb per ft3 and ft per s figure, so each density, velocity, diameter, height, length, margin, fraction and actual gas rate carries six. Site work prints to four decimals: every metre, kilowatt and second, so each setback, shortfall and drop crossing time carries four. Counts are whole numbers.');
w('# Field units: MMscfd, bpd, psig and psia, degF, ft, minutes. Site work is in metres.');
w('# Nothing here is read from a clock or a random number, so every line reproduces.');
w();

// ---------------------------------------------------------------- SECTION 1
w('# SECTION 1: What the sizing engine does, and what it refuses (owned by Associate m01)');
w();
w('# App surface: the Separator & Slug Catcher Designer runs this chain live. Conditions give z and the densities, the mist extractor gives K, K and the densities give the settling velocity, and the vessel follows from the settling velocity and the retention time.');
w('- This engine sizes a VESSEL. It says how big the drum must be for the stream to separate in it. What LEAVES each stage of a separation train at a given pressure and temperature is a flash calculation and lives in engines/fluid/separator.js.');
w('- A named input that is missing, not a number, or outside its domain throws a SeparatorInputError whose `input` property names the input. No default, clamp or fallback stands in for it.');
w('- A state the inputs are valid for but the method is not (a z factor outside the DAK range, a settling velocity that is not positive, an area outside the circle) comes back as an object with an `error` string, not a throw.');
w('- The retired Suite app it replaced hardcoded z at 0.85, used one K at every pressure, sized only two-phase vessels, and took its gas velocity from the diameter of the PREVIOUS render.');
w();
w('Refusals, engine messages verbatim:');
[
  ['kValue with no mist extractor and no override', () => S.kValue({ pPsig: 100 })],
  ['kValue with a mist extractor that is not in the table', () => S.kValue({ internalsId: 'verticalFoam', pPsig: 100 })],
  ['kValue with no pressure', () => S.kValue({ internalsId: 'verticalMesh' })],
  ['kValue at a negative gauge pressure', () => S.kValue({ internalsId: 'verticalMesh', pPsig: -20 })],
  ['kValue with an override of zero', () => S.kValue({ kOverride: 0 })],
  ['gas density with no pressure', () => S.gasDensityLbFt3({ tF: 100, gasSg: 0.65 })],
  ['gas density with a temperature that is not a number', () => S.gasDensityLbFt3({ pPsia: 500, tF: 'warm', gasSg: 0.65 })],
  ['gas density with no gas gravity', () => S.gasDensityLbFt3({ pPsia: 500, tF: 100 })],
  ['a liquid level of zero', () => S.horizontalSegments({ diameterFt: 8, liquidLevelFrac: 0 })],
  ['a liquid level of one', () => S.horizontalSegments({ diameterFt: 8, liquidLevelFrac: 1 })],
  ['a sweep over an empty diameter list', () => S.ldSweep({ mode: 'vertical2', diametersFt: [] })],
  ['a sweep whose band runs backwards', () => S.ldSweep({ mode: 'vertical2', diametersFt: [4], ldMin: 5, ldMax: 3 })],
  ['a slug catcher with a length-to-diameter ratio of zero', () => S.vesselSlugCatcher({ slugBbl: 200, ldRatio: 0 })],
  ['a slug catcher with a negative hold time', () => S.vesselSlugCatcher({ slugBbl: 200, holdMin: -5 })],
  ['a slug catcher with a negative normal liquid rate', () => S.vesselSlugCatcher({ slugBbl: 200, qLiquidBpd: -100 })],
  ['a harp with two and a half fingers', () => S.fingerSlugCatcher({ slugBbl: 200, fingerIdIn: 20, nFingers: 2.5 })],
  ['three-phase sizing with the retired droplet argument', () => S.horizontalThreePhase({ diameterFt: 10, dropletMicron: 500 })],
].forEach(([label, fn]) => w(`- ${label}: ${refusal(attempt(fn))}`));
w();
w('States the method has no answer for, returned rather than thrown:');
w(`- an unknown sizing mode: ${soft(S.ldSweep({ mode: 'cylindrical', diametersFt: [4] }))}`);
w(`- a settling velocity of zero in a vertical vessel: ${soft(S.verticalTwoPhase({ qGasActFt3S: 10, vTerminalFtS: 0, qLiquidBpd: 1000, retentionMin: 3 }))}`);
w(`- a gas denser than the liquid: ${soft(S.terminalVelocityFtS({ k: 0.35, rhoLLbFt3: 2, rhoGLbFt3: 5 }))}`);
w(`- a segment area larger than the circle: ${soft(S.segmentHeightForAreaFt({ diameterFt: 8, areaFt2: 100 }))}`);
w(`- a slug catcher with no slug: ${soft(S.vesselSlugCatcher({ slugBbl: 0 }))}`);
w(`- a slug catcher filled to the brim: ${soft(S.vesselSlugCatcher({ slugBbl: 200, fillFraction: 1 }))}`);
w(`- a droplet with no viscosity to fall through: ${soft(S.liquidLiquidSettlingFtS({ dropletMicron: 500, sgHeavy: 1.05, sgLight: 0.85, muCp: 0 }))}`);
w(`- a light phase denser than the heavy phase: ${soft(S.liquidLiquidSettlingFtS({ dropletMicron: 500, sgHeavy: 0.85, sgLight: 1.05, muCp: 2 }))}`);
w(`- a layout check over something that is not a list: ${soft(L.checkLayout({ items: null }))}`);
w(`- a distance with one coordinate pair: ${soft(L.haversineM({ lat1: 4.5, lon1: 7.1 }))}`);
w(`- a flare setback with no relief rate: ${soft(L.flareSetbackM({ lhvKjKg: 46000 }))}`);
w(`- a pool fire with no pool: ${soft(L.poolFireSetbackM({ poolDiameterM: 0 }))}`);
w();

// ---------------------------------------------------------------- SECTION 2
w('# SECTION 2: The gas at separator conditions (owned by Associate m02)');
w();
w('The three teaching streams, as the studio reads them:');
w('| stream | gas MMscfd | gauge psig | absolute psia | degF | gas gravity |');
w('| --- | --- | --- | --- | --- | --- |');
[['ABANA-1 test separator', ABANA_1, A1], ['ABANA-2 production separator', ABANA_2, A2], ['AGBAMI three-phase', AGBAMI, AG]]
  .forEach(([label, p, c]) => w(`| ${label} | ${e6(p.qGasMMscfd)} | ${e6(p.pPsig)} | ${e6(c.pPsia)} | ${e6(p.tF)} | ${e6(p.gasSg)} |`));
w('The absolute pressure is the gauge pressure plus 14.7 (derived, stated on the row).');
w();
w('Sutton pseudo-criticals and the DAK reduced pair:');
w('| stream | Tpc degR | Ppc psia | Ppr | Tpr | z | gas density lb/ft3 | actual gas ft3/s |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
[['ABANA-1', ABANA_1, A1], ['ABANA-2', ABANA_2, A2], ['AGBAMI', AGBAMI, AG]].forEach(([label, p, c]) => {
  const pc = GP.suttonPseudoCriticals(p.gasSg);
  w(`| ${label} | ${e6(pc.tpcR)} | ${e6(pc.ppcPsia)} | ${e6(c.ppr)} | ${e6(c.tpr)} | ${e6(c.z)} | ${e6(c.rhoGas)} | ${e6(c.qGasActFt3S)} |`);
});
w(`ABANA-1 and ABANA-2 share a stream, so they share Ppr, Tpr, z and gas density; only the gas RATE differs, ${e6(ABANA_1.qGasMMscfd)} against ${e6(ABANA_2.qGasMMscfd)} MMscfd.`);
w(`Rankine at ABANA conditions: ${e6(GP.toRankine(ABANA_1.tF))} degR (engine).`);
w();
w('# App surface: the actual rate is the standard rate scaled by 14.7 over the absolute pressure, by the absolute temperature over 520 degR, and by z. That is the volume the vessel has to pass every second.');
w(`ABANA-2 carries ${e6(ABANA_2.qGasMMscfd)} MMscfd at standard conditions, which is ${e6((ABANA_2.qGasMMscfd * 1e6) / 86400)} standard ft3/s (derived: rate times a million over 86400), and ${e6(A2.qGasActFt3S)} ft3/s at ${e6(A2.pPsia)} psia and ${e6(ABANA_2.tF)} degF (engine).`);
w();
w('Standard against actual, for all three streams:');
w('| stream | gas MMscfd | standard ft3/s | absolute psia | degF | degR | z | actual ft3/s | shrinkage |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
[['ABANA-1', ABANA_1, A1], ['ABANA-2', ABANA_2, A2], ['AGBAMI', AGBAMI, AG]].forEach(([label, p, c]) => {
  const std = (p.qGasMMscfd * 1e6) / 86400;
  w(`| ${label} | ${e6(p.qGasMMscfd)} | ${e6(std)} | ${e6(c.pPsia)} | ${e6(p.tF)} | ${e6(GP.toRankine(p.tF))} | ${e6(c.z)} | ${e6(c.qGasActFt3S)} | ${e6(std / c.qGasActFt3S)} |`);
});
w('The standard rate is the rate times a million over 86400 (derived on each row). The shrinkage is the standard rate over the actual rate (derived from the two columns on each row), and it is what the pressure, the temperature and z do to a volume between the sales meter and the vessel.');
w();
w('The DAK validity range this module enforces: Tpr from 1.0 to 3.0, Ppr up to 30. Below Ppr 0.2 the fit data stop and the answer is accepted with a note, because the surface runs to the ideal gas limit there and that is where an ordinary low-pressure separator sits.');
w('Published gasDensity cases:');
G.gasDensity.forEach((c) => {
  const r = S.gasDensityLbFt3(c.input);
  const line = r.error
    ? `refused: "${r.error}"`
    : `Ppr ${e6(r.ppr)}, Tpr ${e6(r.tpr)}, z ${e6(r.z)}, density ${e6(r.rhoLbFt3)} lb/ft3${r.note ? `, note "${r.note}"` : ''}`;
  w(`- ${c.name} (${e6(c.input.pPsia)} psia, ${e6(c.input.tF)} degF, gravity ${e6(c.input.gasSg)}): ${line}`);
});
w(`The golden expectations carry a status word for each: ${G.gasDensity.map((c) => `${c.name} ${c.expected.status}`).join('; ')} (golden).`);
w();

// ---------------------------------------------------------------- SECTION 3
w('# SECTION 3: The K value (owned by Associate m03)');
w();
w('The published base table, six rows, all overridable:');
w('| id | label | orientation | base K ft/s |');
w('| --- | --- | --- | --- |');
S.K_BASE.forEach((k) => w(`| ${k.id} | ${k.label} | ${k.orientation} | ${e6(k.k)} |`));
w(`The derating floor is ${e6(S.K_FLOOR)} (engine constant K_FLOOR).`);
w();
w('K at pressure, for the teaching streams and around them:');
w('| mist extractor | psig | base K | derated K | K used | derated | floored | nearFloor |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
[
  ['verticalMesh', 0], ['verticalMesh', 100], ['verticalMesh', ABANA_1.pPsig],
  ['horizontalMesh', ABANA_2.pPsig], ['horizontalVane', AGBAMI.pPsig],
  ['verticalNone', 2000], ['horizontalNone', 1500], ['verticalNone', 3000],
].forEach(([id, p]) => {
  const k = S.kValue({ internalsId: id, pPsig: p });
  w(`| ${id} | ${e6(p)} | ${e6(k.kBase)} | ${e6(k.kDerated)} | ${e6(k.k)} | ${k.derated} | ${k.floored} | ${k.nearFloor} |`);
});
w(`The floored warning, verbatim: "${S.kValue({ internalsId: 'verticalNone', pPsig: 3000 }).warning}"`);
w(`An override wins outright and says so: ${JSON.stringify(S.kValue({ kOverride: 0.28 }))}`);
w();
w('Published kValue cases:');
G.kValue.forEach((c) => {
  const k = S.kValue(c.input);
  w(`- ${c.name}: K ${e6(k.k)}, the rule gives ${e6(k.kDerated)}, derated ${k.derated}, floored ${k.floored}, nearFloor ${k.nearFloor}.`);
});
w();
(() => {
  const near = S.kValue({ internalsId: 'verticalNone', pPsig: 650 });
  w(`How close a derated K can sit to the floor, and the flag that says so: verticalNoneAt650psig returns K ${e6(near.k)} with derated ${near.derated}, floored ${near.floored} and nearFloor ${near.nearFloor}, which is ${e6(near.k - S.K_FLOOR)} above the floor of ${e6(S.K_FLOOR)} (derived: the two figures on this row). The rule takes 0.01 off K every 100 psi, so 50 psig more of operating pressure puts that vessel on the floor. nearFloor is true when one more 100 psi step of that same rule would floor the value, so it marks the approach to the cliff that floored marks the edge of, and the two are never true together.`);
})();
w();
w('# HELD FOR LITERATURE, taught as a limit and never graded: the derating of 0.01 per 100 psi above 100 psig, and the 0.12 floor, are the customary rule of thumb as this module records it. The published form has not been checked against the source, so a vendor K is the only honest input where the derating bites.');
w();

// ---------------------------------------------------------------- SECTION 4
w('# SECTION 4: Settling (owned by Associate m04)');
w();
w('Liquid densities, and the mixture the gas load sees:');
w('| stream | oil API | oil lb/ft3 | water SG | water lb/ft3 | oil bpd | water bpd | mixture lb/ft3 |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
[['ABANA-1', ABANA_1, A1], ['ABANA-2', ABANA_2, A2], ['AGBAMI', AGBAMI, AG]].forEach(([label, p, c]) => {
  w(`| ${label} | ${e6(p.oilApi)} | ${e6(c.rhoOil)} | ${e6(p.waterSg)} | ${e6(c.rhoWater)} | ${e6(p.qOilBpd)} | ${e6(p.qWaterBpd)} | ${e6(c.rhoLiquid)} |`);
});
w('The mixture is the two densities weighted by their volume rates (derived from the columns on each row). It is not their average: on AGBAMI the average would be '
  + `${e6((AG.rhoOil + AG.rhoWater) / 2)} lb/ft3 against the weighted ${e6(AG.rhoLiquid)}.`);
w();
w('Souders-Brown settling at the K each stream carries:');
w('| stream | K | liquid lb/ft3 | gas lb/ft3 | terminal velocity ft/s |');
w('| --- | --- | --- | --- | --- |');
[['ABANA-1 vertical mesh', A1], ['ABANA-2 horizontal mesh', A2], ['AGBAMI horizontal vane', AG]].forEach(([label, c]) => {
  w(`| ${label} | ${e6(c.k)} | ${e6(c.rhoLiquid)} | ${e6(c.rhoGas)} | ${e6(c.vT)} |`);
});
w('Published soudersBrown cases:');
G.soudersBrown.forEach((c) => w(`- ${c.name} (K ${e6(c.input.k)}, liquid ${e6(c.input.rhoLLbFt3)}, gas ${e6(c.input.rhoGLbFt3)}): ${e6(S.terminalVelocityFtS(c.input).vFtS)} ft/s.`));
w();

// ---------------------------------------------------------------- SECTION 5
w('# SECTION 5: The vertical vessel (owned by Associate m05)');
w();
const A1_GAS = S.verticalTwoPhase({
  qGasActFt3S: A1.qGasActFt3S, vTerminalFtS: A1.vT, qLiquidBpd: A1.qLiquid,
  retentionMin: ABANA_1.retentionMin, allowanceFt: ABANA_1.allowanceFt,
});
w(`ABANA-1 sized by its gas load: the gas needs an area of ${e6(A1.qGasActFt3S / A1.vT)} ft2 (derived: actual gas rate over the terminal velocity), which is a diameter of ${e6(A1_GAS.diameterGasFt)} ft (engine).`);
w(`At that diameter the liquid stands ${e6(A1_GAS.hLiquidFt)} ft deep, the vessel is ${e6(A1_GAS.heightFt)} ft tall with the ${e6(ABANA_1.allowanceFt)} ft allowance, the slenderness is ${e6(A1_GAS.ldRatio)}, and the velocity margin is exactly ${e6(A1_GAS.velocityMargin)} because the diameter was chosen to make it so.`);
w(`The retention volume is ${e6(A1_GAS.liquidVolFt3)} ft3: ${e6(A1.qLiquid)} bpd of liquid held ${e6(ABANA_1.retentionMin)} minutes.`);
w();
w('The same stream in the diameters a vendor actually offers:');
w('| diameter ft | liquid ft | height ft | L/D | gas velocity ft/s | margin | carries the gas |');
w('| --- | --- | --- | --- | --- | --- | --- |');
ABANA_1_SWEEP.diametersFt.forEach((d) => {
  const v = S.verticalTwoPhase({
    qGasActFt3S: A1.qGasActFt3S, vTerminalFtS: A1.vT, qLiquidBpd: A1.qLiquid,
    retentionMin: ABANA_1.retentionMin, allowanceFt: ABANA_1.allowanceFt, diameterOverride: d,
  });
  w(`| ${e6(d)} | ${e6(v.hLiquidFt)} | ${e6(v.heightFt)} | ${e6(v.ldRatio)} | ${e6(v.gasVelocityFtS)} | ${e6(v.velocityMargin)} | ${v.gasCapacityOk} |`);
});
w('The height falls and the margin rises with diameter, because the same liquid volume spreads over a larger floor and the same gas crosses a larger area.');
w();
w('Published vertical cases:');
G.vertical.forEach((c) => {
  const v = S.verticalTwoPhase(c.input);
  w(`- ${c.name} (${e6(c.input.qGasActFt3S)} ft3/s, ${e6(c.input.qLiquidBpd)} bpd, ${e6(c.input.retentionMin)} min, allowance ${e6(c.input.allowanceFt)} ft): diameter ${e6(v.diameterFt)} ft, liquid ${e6(v.hLiquidFt)} ft, height ${e6(v.heightFt)} ft, L/D ${e6(v.ldRatio)}, margin ${e6(v.velocityMargin)}.`);
});
w();

// ---------------------------------------------------------------- SECTION 6
w('# SECTION 6: The Associate reading, one chain end to end (owned by Associate m06)');
w();
w(`ABANA-1, step by step: ${e6(ABANA_1.pPsig)} psig becomes ${e6(A1.pPsia)} psia; the gravity ${e6(ABANA_1.gasSg)} gives Ppr ${e6(A1.ppr)} and Tpr ${e6(A1.tpr)}; DAK returns z ${e6(A1.z)}; the gas weighs ${e6(A1.rhoGas)} lb/ft3 and arrives at ${e6(A1.qGasActFt3S)} ft3/s; the liquid weighs ${e6(A1.rhoLiquid)} lb/ft3; the wire mesh pad gives K ${e6(A1.k)} after derating from ${e6(A1.kResult.kBase)}; settling is ${e6(A1.vT)} ft/s; the gas needs ${e6(A1_GAS.diameterGasFt)} ft of diameter; and at the 3 ft vessel the studio prefers, the height is ${e6(S.verticalTwoPhase({ qGasActFt3S: A1.qGasActFt3S, vTerminalFtS: A1.vT, qLiquidBpd: A1.qLiquid, retentionMin: ABANA_1.retentionMin, allowanceFt: ABANA_1.allowanceFt, diameterOverride: 3 }).heightFt)} ft.`);
w('Every one of those numbers moves if the pressure, the temperature, the gravity, the rates or the mist extractor move. None of them moves if the day changes.');
w();

// ---------------------------------------------------------------- SECTION 7
w('# SECTION 7: The horizontal vessel, a circle cut by a level (owned by Professional m01)');
w();
w(`ABANA-2 is built at ${e6(ABANA_2.diameterFt)} ft. The cross-section at a range of levels:`);
w('| level fraction | liquid depth ft | liquid area ft2 | gas area ft2 | gas height ft | gas-liquid chord ft | total area ft2 |');
w('| --- | --- | --- | --- | --- | --- | --- |');
[0.2, 0.3, 0.4, 0.5, 0.6, 0.75].forEach((lf) => {
  const s = S.horizontalSegments({ diameterFt: ABANA_2.diameterFt, liquidLevelFrac: lf });
  w(`| ${e6(lf)} | ${e6(s.liquidLevelFt)} | ${e6(s.areaLiquidFt2)} | ${e6(s.areaGasFt2)} | ${e6(s.gasHeightFt)} | ${e6(s.gasLiquidChordFt)} | ${e6(s.areaTotalFt2)} |`);
});
w('The chord is the WIDTH of the gas-liquid surface. It is not the oil-water interface, which three-phase sizing places itself, and it is not a length.');
w(`Half full is a special case and not a law: at half full the two areas are equal, ${e6(S.horizontalSegments({ diameterFt: ABANA_2.diameterFt, liquidLevelFrac: 0.5 }).areaLiquidFt2)} ft2 each, and the chord is the full diameter.`);
w();
w('Published segments cases:');
G.segments.forEach((c) => w(`- ${c.name}: liquid area ${e6(S.horizontalSegments(c.input).areaLiquidFt2)} ft2.`));
w();
w('The area of a segment and the depth that produces it are exact inverses (the engine bisects 100 times, which resolves the depth to double precision):');
[
  { diameterFt: 8, frac: 0.35 }, { diameterFt: 10, frac: 0.6 },
].forEach(({ diameterFt, frac }) => {
  const seg = S.horizontalSegments({ diameterFt, liquidLevelFrac: frac });
  const back = S.segmentHeightForAreaFt({ diameterFt, areaFt2: seg.areaLiquidFt2 });
  w(`- a drum of ${e6(diameterFt)} ft at level ${e6(frac)}: depth ${e6(seg.liquidLevelFt)} ft gives area ${e6(seg.areaLiquidFt2)} ft2, and that area gives the depth back as ${e6(back.heightFt)} ft.`);
});
w();

// ---------------------------------------------------------------- SECTION 8
w('# SECTION 8: Two lengths, one vessel (owned by Professional m02)');
w();
const A2H = S.horizontalTwoPhase({
  diameterFt: ABANA_2.diameterFt, qGasActFt3S: A2.qGasActFt3S, vTerminalFtS: A2.vT,
  qLiquidBpd: A2.qLiquid, retentionMin: ABANA_2.retentionMin, liquidLevelFrac: ABANA_2.liquidLevelFrac,
});
w(`ABANA-2 at ${e6(ABANA_2.diameterFt)} ft and level ${e6(ABANA_2.liquidLevelFrac)}: the liquid needs ${e6(A2H.lengthLiquidFt)} ft and the gas needs ${e6(A2H.lengthGasFt)} ft, so the vessel is ${e6(A2H.lengthFt)} ft long, controlled by the ${A2H.controlling}, at a slenderness of ${e6(A2H.ldRatio)}.`);
w(`The liquid requirement is the retention volume ${e6(A2H.liquidVolFt3)} ft3 over the liquid area ${e6(A2H.areaLiquidFt2)} ft2 (derived from the two engine values on this row).`);
const A2LOW = S.horizontalTwoPhase({
  diameterFt: ABANA_2.diameterFt, qGasActFt3S: A2.qGasActFt3S, vTerminalFtS: A2.vT,
  qLiquidBpd: A2.qLiquid, retentionMin: ABANA_2.retentionMin, liquidLevelFrac: ABANA_2_LOW_LEVEL_FRAC,
});
w(`Drop the level to ${e6(ABANA_2_LOW_LEVEL_FRAC)} and the same duty in the same drum needs ${e6(A2LOW.lengthLiquidFt)} ft, because the liquid area falls to ${e6(A2LOW.areaLiquidFt2)} ft2 while the gas gets ${e6(A2LOW.areaGasFt2)} ft2 and slows to ${e6(A2LOW.gasVelocityFtS)} ft/s.`);
w(`The gas side of that same drum at level ${e6(ABANA_2_LOW_LEVEL_FRAC)}: gas height ${e6(A2LOW.gasHeightFt)} ft, gas-liquid chord ${e6(A2LOW.gasLiquidChordFt)} ft, margin ${e6(A2LOW.gasVelocityMargin)}, gas length ${e6(A2LOW.lengthGasFt)} ft, gasCapacityOk ${A2LOW.gasCapacityOk}, controlling ${A2LOW.controlling}, total length ${e6(A2LOW.lengthFt)} ft, slenderness ${e6(A2LOW.ldRatio)}.`);
w(`Lowering the level lengthens the vessel and relieves the gas at the same time: the liquid requirement rises from ${e6(A2H.lengthLiquidFt)} ft to ${e6(A2LOW.lengthLiquidFt)} ft while the gas requirement falls from ${e6(A2H.lengthGasFt)} ft to ${e6(A2LOW.lengthGasFt)} ft (derived from the two figures in each pair).`);
w();
w('The two lengths across the family, at the level ABANA-2 runs:');
w('| diameter ft | liquid area ft2 | gas area ft2 | liquid length ft | gas length ft | length ft | controlling | L/D |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
ABANA_2_SWEEP.diametersFt.forEach((d) => {
  const h = S.horizontalTwoPhase({
    diameterFt: d, qGasActFt3S: A2.qGasActFt3S, vTerminalFtS: A2.vT,
    qLiquidBpd: A2.qLiquid, retentionMin: ABANA_2.retentionMin, liquidLevelFrac: ABANA_2.liquidLevelFrac,
  });
  w(`| ${e6(d)} | ${e6(h.areaLiquidFt2)} | ${e6(h.areaGasFt2)} | ${e6(h.lengthLiquidFt)} | ${e6(h.lengthGasFt)} | ${e6(h.lengthFt)} | ${h.controlling} | ${e6(h.ldRatio)} |`);
});
w();
w('Gas height, liquid depth and the gas-liquid chord per bore, at the level ABANA-2 runs:');
w('| diameter ft | liquid depth ft | gas height ft | gas-liquid chord ft | gas area ft2 | liquid area ft2 |');
w('| --- | --- | --- | --- | --- | --- |');
ABANA_2_SWEEP.diametersFt.forEach((d) => {
  const s = S.horizontalSegments({ diameterFt: d, liquidLevelFrac: ABANA_2.liquidLevelFrac });
  w(`| ${e6(d)} | ${e6(s.liquidLevelFt)} | ${e6(s.gasHeightFt)} | ${e6(s.gasLiquidChordFt)} | ${e6(s.areaGasFt2)} | ${e6(s.areaLiquidFt2)} |`);
});
w(`At a level of ${e6(ABANA_2.liquidLevelFrac)} the gas height is half the bore and the chord is the whole bore, which is why the gas length requirement at this level is the gas velocity ratio times half the diameter.`);
w();
w('Published horizontal cases:');
G.horizontal.forEach((c) => {
  const h = S.horizontalTwoPhase(c.input);
  w(`- ${c.name} (${e6(c.input.diameterFt)} ft, level ${e6(c.input.liquidLevelFrac)}, ${e6(c.input.qGasActFt3S)} ft3/s, ${e6(c.input.qLiquidBpd)} bpd, ${e6(c.input.retentionMin)} min): liquid ${e6(h.lengthLiquidFt)} ft, gas ${e6(h.lengthGasFt)} ft, length ${e6(h.lengthFt)} ft, controlling ${h.controlling}, L/D ${e6(h.ldRatio)}, gas velocity ${e6(h.gasVelocityFtS)} ft/s.`);
});
w();

// ---------------------------------------------------------------- SECTION 9
w('# SECTION 9: Gas capacity (owned by Professional m03)');
w();
w(`A horizontal vessel carries its gas when the velocity in the GAS SPACE stays under the Souders-Brown velocity. ABANA-2 at ${e6(ABANA_2.diameterFt)} ft runs ${e6(A2H.gasVelocityFtS)} ft/s against ${e6(A2.vT)} ft/s, a margin of ${e6(A2H.gasVelocityMargin)}, so gasCapacityOk is ${A2H.gasCapacityOk}.`);
w('The margin across the family:');
w('| diameter ft | gas area ft2 | gas velocity ft/s | margin | carries the gas |');
w('| --- | --- | --- | --- | --- |');
ABANA_2_SWEEP.diametersFt.forEach((d) => {
  const h = S.horizontalTwoPhase({
    diameterFt: d, qGasActFt3S: A2.qGasActFt3S, vTerminalFtS: A2.vT,
    qLiquidBpd: A2.qLiquid, retentionMin: ABANA_2.retentionMin, liquidLevelFrac: ABANA_2.liquidLevelFrac,
  });
  w(`| ${e6(d)} | ${e6(h.areaGasFt2)} | ${e6(h.gasVelocityFtS)} | ${e6(h.gasVelocityMargin)} | ${h.gasCapacityOk} |`);
});
w();
w('# HELD FOR LITERATURE, taught as a limit and never graded: a horizontal vessel uses the Souders-Brown velocity at the horizontal K as the droplet SETTLING velocity in the gas length requirement. That packaging has not been checked against API 12J or Arnold and Stewart.');
w('A consequence the engine gate pins: the gas length is the gas velocity over the settling velocity, times the gas height. Under the capacity rule that ratio is at most 1, so the gas length is at most the gas HEIGHT, and gas can control only a vessel that is gas overloaded or shorter than its own diameter.');
w('The published gas-overloaded three-phase case is the shape to look at:');
(() => {
  const c = G.threePhase.find((x) => x.name === 'gasOverloaded6ftGasControls');
  const r = S.horizontalThreePhase(c.input);
  w(`- ${c.name}: gas velocity ${e6(r.gasVelocityFtS)} ft/s against a settling velocity of ${e6(c.input.vTerminalFtS)} ft/s, margin ${e6(r.gasVelocityMargin)}, gasCapacityOk ${r.gasCapacityOk}, gas length ${e6(r.lengthGasFt)} ft against a gas height of ${e6(r.gasHeightFt)} ft, and the controlling requirement is ${r.controlling}.`);
})();
w();

// --------------------------------------------------------------- SECTION 10
w('# SECTION 10: Slug catchers (owned by Professional m04)');
w();
const ABV = S.vesselSlugCatcher(ABANA_SLUG);
w(`# App surface: the slug VOLUME is not computed here. It comes from the line, where the pigging tab of the line sizing studio works it out, and it is typed into this tab as a number somebody else stands behind.`);
w(`ABANA takes a ${e6(ABANA_SLUG.slugBbl)} bbl slug with ${e6(ABANA_SLUG.qLiquidBpd)} bpd still arriving and a ${e6(ABANA_SLUG.holdMin)} minute hold: the normal inflow adds ${e6(ABV.normalBbl)} bbl, the working volume is ${e6(ABV.workingBbl)} bbl, and at a fill fraction of ${e6(ABANA_SLUG.fillFraction)} the vessel is ${e6(ABV.totalVolumeFt3)} ft3.`);
w(`At a slenderness of ${e6(ABV.ldRatio)} that is a drum ${e6(ABV.diameterFt)} ft across and ${e6(ABV.lengthFt)} ft long.`);
w();
const ABF = S.fingerSlugCatcher(ABANA_FINGERS);
w(`The same slug in a harp: ${e6(ABANA_FINGERS.nFingers)} fingers of ${e6(ABANA_FINGERS.fingerIdIn)} inch bore, filled to ${e6(ABANA_FINGERS.fillFraction)}, need ${e6(ABF.totalVolumeFt3)} ft3, which is ${e6(ABF.fingerLengthFt)} ft per finger over an area of ${e6(ABF.areaPerFingerFt2)} ft2 each and ${e6(ABF.totalPipeFt)} ft of pipe in total.`);
w(`The harp ignores the normal inflow entirely: the finger volume comes from the slug alone, so ${e6(ABV.workingBbl)} bbl of working volume in the vessel answers ${e6(ABANA_FINGERS.slugBbl)} bbl in the fingers.`);
const ABFF = S.fingerSlugCatcher(ABANA_FINGERS_FEW);
w(`Squeeze the same slug into ${e6(ABANA_FINGERS_FEW.nFingers)} fingers of ${e6(ABANA_FINGERS_FEW.fingerIdIn)} inch bore and each one is ${e6(ABFF.fingerLengthFt)} ft long, with the warning: "${ABFF.warning}"`);
w();
w('Published slug catcher cases:');
G.vesselSlug.forEach((c) => {
  const v = S.vesselSlugCatcher(c.input);
  w(`- ${c.name} (${e6(c.input.slugBbl)} bbl, ${e6(c.input.qLiquidBpd)} bpd, ${e6(c.input.holdMin)} min, fill ${e6(c.input.fillFraction)}, L/D ${e6(c.input.ldRatio)}): normal ${e6(v.normalBbl)} bbl, volume ${e6(v.totalVolumeFt3)} ft3, diameter ${e6(v.diameterFt)} ft, length ${e6(v.lengthFt)} ft.`);
});
G.fingerSlug.forEach((c) => {
  const v = S.fingerSlugCatcher(c.input);
  w(`- ${c.name} (${e6(c.input.slugBbl)} bbl, ${e6(c.input.nFingers)} x ${e6(c.input.fingerIdIn)} inch, fill ${e6(c.input.fillFraction)}): volume ${e6(v.totalVolumeFt3)} ft3, ${e6(v.fingerLengthFt)} ft per finger, ${e6(v.totalPipeFt)} ft of pipe.`);
});
w();

// --------------------------------------------------------------- SECTION 11
w('# SECTION 11: Distances and computed setbacks on a site (owned by Professional m05)');
w();
w('# App surface: the Facility Layout Mapper has always advertised safety distances and never computed any. This engine is that missing half. It keeps two kinds of answer apart: a TABLE figure, which is a table, and a COMPUTED setback, which moves when the duty moves.');
w('Table figures used by the ERHA station, in metres:');
w('| pair | required m |');
w('| --- | --- |');
[['wellhead', 'wellhead'], ['wellhead', 'separator'], ['separator', 'tank'], ['tank', 'pump'],
  ['heaterTreater', 'tank'], ['flare', 'tank'], ['flare', 'control'], ['pump', 'pump'],
  ['valve', 'psv'], ['separator', 'valve'], ['tank', 'skid']].forEach(([a, b]) => {
  const r = L.requiredSpacingM({ typeA: a, typeB: b });
  w(`| ${a} to ${b} | ${r === null ? 'null, the table has no figure' : e6(r)} |`);
});
w('The lookup is symmetric, and a pair the table does not carry comes back as null rather than a guess.');
w();
w(`Distances on the ERHA site, from the datum at ${e6(ERHA_DATUM.lat)} north, ${e6(ERHA_DATUM.lon)} east (the engine measures on a sphere, because a site plan at a real latitude is not a flat grid):`);
(() => {
  const quarter = L.haversineM({ lat1: 0, lon1: 0, lat2: 0, lon2: 90 });
  w(`The sphere it measures on, read out of the engine rather than typed: a quarter turn along the equator comes back as ${m4(quarter.distanceM)} m (engine), so the radius in use is ${m4((2 * quarter.distanceM) / Math.PI)} m (derived: that distance times two over pi).`);
})();
w('| from | to | distance m |');
w('| --- | --- | --- |');
[['wh1', 'wh2'], ['wh1', 'sp1'], ['sp1', 'tk1'], ['tk1', 'pm1'], ['pm1', 'pm2'], ['tk1', 'fl1'], ['fl1', 'cr1']].forEach(([a, b]) => {
  const A = ERHA_ITEMS.find((i) => i.id === a);
  const B = ERHA_ITEMS.find((i) => i.id === b);
  w(`| ${A.name} | ${B.name} | ${m4(L.haversineM({ lat1: A.lat, lon1: A.lon, lat2: B.lat, lon2: B.lon }).distanceM)} |`);
});
w('Published distance cases, against an independent Vincenty solution and the three-dimensional chord:');
GL.distances.forEach((c) => {
  const d = L.haversineM(c.input);
  w(`- ${c.name}: haversine ${m4(d.distanceM)} m, Vincenty ${m4(c.expected.vincentyM)} m (golden), chord ${m4(c.expected.chordM)} m (golden).`);
});
w();
const ERF = L.flareSetbackM(ERHA_FLARE);
w(`The ERHA flare relieves ${e6(ERHA_FLARE.reliefRateKgS)} kg/s of gas at ${e6(ERHA_FLARE.lhvKjKg)} kJ/kg, which is ${m4(ERF.qKw)} kW of heat release (engine). With ${e6(ERHA_FLARE.fractionRadiated)} of it radiated and an allowable of ${e6(ERHA_FLARE.allowableKwM2)} kW/m2, the point source model puts the setback at ${m4(ERF.distanceM)} m.`);
w('The published allowable levels this engine carries (API 521 customary):');
L.RADIATION_LEVELS.forEach((r) => w(`- ${e6(r.kWm2)} kW/m2: ${r.label}`));
w('Published flare cases:');
GL.flare.forEach((c) => {
  const r = L.flareSetbackM(c.input);
  w(`- ${c.name} (${e6(c.input.reliefRateKgS)} kg/s, ${e6(c.input.lhvKjKg)} kJ/kg, allowable ${e6(c.input.allowableKwM2)}, radiated ${e6(c.input.fractionRadiated)}, transmissivity ${e6(c.input.transmissivity)}): ${m4(r.qKw)} kW, ${m4(r.distanceM)} m; the intensity back at that distance is ${m4(c.expected.intensityAtDistance)} kW/m2 (golden).`);
});
w();
const ERP = L.poolFireSetbackM(ERHA_POOL);
w(`The ERHA bund is ${e6(ERHA_POOL.poolDiameterM)} m across, which is ${m4(ERP.areaM2)} m2 of pool burning at ${e6(ERHA_POOL.burnRateKgM2S)} kg/m2/s, so ${m4(ERP.burnRateKgS)} kg/s and ${m4(ERP.qKw)} kW (engine). The flame stands ${m4(ERP.flameHeightM)} m tall by Thomas.`);
w(`The radius at which the intensity falls to ${e6(ERHA_POOL.allowableKwM2)} kW/m2 is ${m4(ERP.radiusFromCentreM)} m FROM THE POOL CENTRE, and the setback from the pool EDGE is ${m4(ERP.setbackFromEdgeM)} m, status ${ERP.setbackStatus}. The difference is half the pool diameter, ${m4(ERHA_POOL.poolDiameterM / 2)} m (derived).`);
w('That difference is the S1 defect the Suite layer carried: the layout check measures centre to centre and the tank icon is the pool centre, so passing the setback from the EDGE made the check short by half the bund and failed open.');
w('Published pool fire cases:');
GL.poolFire.forEach((c) => {
  const r = L.poolFireSetbackM(c.input);
  w(`- ${c.name} (${e6(c.input.poolDiameterM)} m pool, burn ${e6(c.input.burnRateKgM2S)}, ${e6(c.input.lhvKjKg)} kJ/kg, allowable ${e6(c.input.allowableKwM2)}): ${m4(r.qKw)} kW, flame ${m4(r.flameHeightM)} m, radius ${m4(r.radiusFromCentreM)} m, edge setback ${m4(r.setbackFromEdgeM)} m, status ${r.setbackStatus}.`);
  if (r.note) w(`    note: "${r.note}"`);
});
w();
w('# HELD FOR LITERATURE, taught as a limit and never graded: the spacing TABLE figures are the customary onshore production-facility values as this engine records them, with no source checked, and they are meant to be replaced by a site standard. The API 521 radiation LABELS are recorded the same way. A course may teach what a table is; it may not treat a table figure as a calculation.');
w('The pool fire model is a POINT SOURCE. It computes no view factor and no solid-flame surface emissive power, and inside the flame height it under-predicts, which is why the engine flags that case rather than answering it flat.');
w();

// --------------------------------------------------------------- SECTION 12
w('# SECTION 12: The Professional reading, a station judged (owned by Professional m06)');
w();
const ERL = L.checkLayout({
  items: [...ERHA_ITEMS, ERHA_UNPLACED],
  radiationSources: [
    { id: 'fl1', label: 'Flare radiation', setbackM: ERF.distanceM, allowableKwM2: ERHA_FLARE.allowableKwM2 },
    { id: 'tk1', label: 'Tank pool fire', setbackM: ERP.radiusFromCentreM, allowableKwM2: ERHA_POOL.allowableKwM2 },
    ERHA_GHOST_SOURCE,
  ],
});
w(`The ERHA station, checked against the table and against its own two computed setbacks: ${ERL.checked} comparisons carried a positive requirement, ${ERL.zeroRequirementPairs} pairs had none, ${ERL.violations.length} comparisons failed, complete is ${ERL.complete}, pass is ${ERL.pass} (${ERL.passStatus}).`);
w('| kind | from | to | actual m | required m | shortfall m | shortfall fraction |');
w('| --- | --- | --- | --- | --- | --- | --- |');
ERL.violations.forEach((v) => w(`| ${v.kind} | ${v.aName} | ${v.bName} | ${m4(v.actualM)} | ${m4(v.requiredM)} | ${m4(v.shortfallM)} | ${e6(v.shortfallFraction)} |`));
w(`worstAbsolute is ${ERL.worstAbsolute.aName} to ${ERL.worstAbsolute.bName}, ${m4(ERL.worstAbsolute.shortfallM)} m short. worstRelative is ${ERL.worstRelative.aName} to ${ERL.worstRelative.bName}, ${e6(ERL.worstRelative.shortfallFraction)} of its requirement. They are different pairs.`);
w(`Skipped: ${JSON.stringify(ERL.skipped)}. Unknown type pairs: ${ERL.unknownPairs.length}.`);
w();
const ERL_EDGE = L.checkLayout({
  items: [...ERHA_ITEMS, ERHA_UNPLACED],
  radiationSources: [
    { id: 'fl1', label: 'Flare radiation', setbackM: ERF.distanceM, allowableKwM2: ERHA_FLARE.allowableKwM2 },
    { id: 'tk1', label: 'Tank pool fire', setbackM: ERP.setbackFromEdgeM, allowableKwM2: ERHA_POOL.allowableKwM2 },
    ERHA_GHOST_SOURCE,
  ],
});
w(`What the half-bund correction is worth on this plot. The retired Suite layer handed the check the setback from the pool EDGE, ${m4(ERP.setbackFromEdgeM)} m, where the check measures centre to centre and the requirement is ${m4(ERP.radiusFromCentreM)} m. The same plot judged both ways:`);
w('| pair | actual m | required from the centre m | shortfall m | required as the retired edge figure m | residual shortfall under the retired figure m |');
w('| --- | --- | --- | --- | --- | --- |');
ERL.violations.filter((v) => v.kind === 'radiation' && v.aId === 'tk1').forEach((v) => {
  const old = ERL_EDGE.violations.find((x) => x.kind === 'radiation' && x.aId === 'tk1' && x.bId === v.bId);
  w(`| Crude tank to ${v.bName} | ${m4(v.actualM)} | ${m4(v.requiredM)} | ${m4(v.shortfallM)} | ${m4(ERP.setbackFromEdgeM)} | ${old ? m4(old.shortfallM) : 'not flagged at all'} |`);
});
w(`Every row's two shortfalls differ by ${m4(ERP.radiusFromCentreM - ERP.setbackFromEdgeM)} m, the half bund (derived from the two requirement columns). The heater treater is the row that shows what the defect cost: ${m4(ERL.violations.find((v) => v.kind === 'radiation' && v.bId === 'ht1').shortfallM)} m short of the real requirement, and only ${m4(ERL_EDGE.violations.find((v) => v.kind === 'radiation' && v.bId === 'ht1').shortfallM)} m short of the retired one.`);
w(`Judged the retired way the plot still fails, ${ERL_EDGE.violations.length} breaches against ${ERL.violations.length}, so the defect never showed as a pass: it showed as a smaller number, which is the harder kind to notice.`);
w();
const NN = L.nearestNeighbours({ items: ERHA_ITEMS });
w('What every item has around it, which is the other half of a layout review:');
w('| item | nearest | distance m | table requirement m |');
w('| --- | --- | --- | --- |');
NN.rows.forEach((r) => w(`| ${r.name} | ${r.nearest.name} | ${m4(r.nearest.distanceM)} | ${r.requiredM === null ? 'null' : e6(r.requiredM)} |`));
w();

// --------------------------------------------------------------- SECTION 13
w('# SECTION 13: Three phases in one vessel (owned by Expert m01)');
w();
const AG3 = S.horizontalThreePhase({
  diameterFt: AGBAMI.diameterFt, qGasActFt3S: AG.qGasActFt3S, vTerminalFtS: AG.vT,
  liquidLevelFrac: AGBAMI.liquidLevelFrac, ...AGBAMI,
});
w(`AGBAMI at ${e6(AGBAMI.diameterFt)} ft, level ${e6(AGBAMI.liquidLevelFrac)}, with ${e6(AGBAMI.qOilBpd)} bpd of oil held ${e6(AGBAMI.oilRetentionMin)} minutes and ${e6(AGBAMI.qWaterBpd)} bpd of water held ${e6(AGBAMI.waterRetentionMin)} minutes.`);
w(`The split is ${AG3.interfaceSplit}: the water takes ${e6(AG3.waterShare)} of the liquid cross-section, which is ${e6(AG3.areaWaterFt2)} ft2 against ${e6(AG3.areaOilFt2)} ft2 of oil in a liquid area of ${e6(AG3.areaLiquidFt2)} ft2.`);
w(`The interface sits at ${e6(AG3.interfaceHeightFt)} ft, the exact depth whose circular segment has the water area. The water layer is ${e6(AG3.waterLayerFt)} ft and the oil layer above it ${e6(AG3.oilLayerFt)} ft, and the two add to the liquid level ${e6(AG3.liquidLevelFt)} ft (derived).`);
w(`The retired rule divided the water area by the GAS-LIQUID CHORD of ${e6(AG3.gasLiquidChordFt)} ft, which gives ${e6(AG3.areaWaterFt2 / AG3.gasLiquidChordFt)} ft (derived from two engine values on this row) and understates the water layer, so the D2 carryunder check was reading a layer that was not there.`);
w(`One liquid retention requirement follows from the proportional split: ${e6(AG3.liquidRetentionLengthFt)} ft, with phaseRetentionLengthsFt ${JSON.stringify(AG3.phaseRetentionLengthsFt)} and retentionPhase ${AG3.retentionPhase}.`);
w();
const AG3E = S.horizontalThreePhase({
  diameterFt: AGBAMI.diameterFt, qGasActFt3S: AG.qGasActFt3S, vTerminalFtS: AG.vT,
  liquidLevelFrac: AGBAMI.liquidLevelFrac, waterFracOfLiquid: AGBAMI_EXPLICIT_WATER_FRAC, ...AGBAMI,
});
w(`Pin the interface instead, at a water share of ${e6(AGBAMI_EXPLICIT_WATER_FRAC)}: the split is ${AG3E.interfaceSplit}, the interface drops to ${e6(AG3E.interfaceHeightFt)} ft, the oil layer grows to ${e6(AG3E.oilLayerFt)} ft, and the two phases now need DIFFERENT lengths, ${e6(AG3E.phaseRetentionLengthsFt.oilFt)} ft for the oil and ${e6(AG3E.phaseRetentionLengthsFt.waterFt)} ft for the water. The requirement is the larger, ${e6(AG3E.liquidRetentionLengthFt)} ft, and retentionPhase names the ${AG3E.retentionPhase}.`);
w(`Two retention lengths are the same length within a relative gap of ${S.RETENTION_TIE_REL} (engine constant RETENTION_TIE_REL), and then retentionPhase is null rather than a coin toss.`);
w();
w('Published threePhase cases:');
G.threePhase.forEach((c) => {
  const r = S.horizontalThreePhase(c.input);
  w(`- ${c.name} (${e6(c.input.diameterFt)} ft, level ${e6(c.input.liquidLevelFrac ?? 0.5)}${c.input.waterFracOfLiquid ? `, pinned at ${e6(c.input.waterFracOfLiquid)}` : ''}): share ${e6(r.waterShare)}, interface ${e6(r.interfaceHeightFt)} ft, water ${e6(r.waterLayerFt)} ft, oil ${e6(r.oilLayerFt)} ft, retention length ${e6(r.liquidRetentionLengthFt)} ft, length ${e6(r.lengthFt)} ft, controlling ${r.controlling}, retentionPhase ${r.retentionPhase}.`);
  w(`    the retired chord rule on the same case gave a water layer of ${e6(c.expected.retiredChordRule.waterLayerFt)} ft and an oil layer of ${e6(c.expected.retiredChordRule.oilLayerFt)} ft (golden).`);
});
w();
w('What three-phase sizing demands, refused by name and with no default:');
[
  ['no oil rate', { diameterFt: 10, qWaterBpd: 4000 }],
  ['no water rate', { diameterFt: 10, qOilBpd: 6000 }],
  ['no oil retention time', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000 }],
  ['no oil gravity', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000, oilRetentionMin: 5, waterRetentionMin: 5 }],
  ['water lighter than the oil', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000, oilRetentionMin: 5, waterRetentionMin: 5, sgOil: 1.1, sgWater: 1.0 }],
  ['no oil viscosity', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000, oilRetentionMin: 5, waterRetentionMin: 5, sgOil: 0.85, sgWater: 1.05 }],
  ['no water droplet size', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000, oilRetentionMin: 5, waterRetentionMin: 5, sgOil: 0.85, sgWater: 1.05, muOilCp: 2, muWaterCp: 0.7 }],
  ['no oil droplet size', { diameterFt: 10, qOilBpd: 6000, qWaterBpd: 4000, oilRetentionMin: 5, waterRetentionMin: 5, sgOil: 0.85, sgWater: 1.05, muOilCp: 2, muWaterCp: 0.7, waterDropletMicron: 500 }],
  ['a pinned water share of zero', { ...AGBAMI, diameterFt: 10, qGasActFt3S: 20, vTerminalFtS: 1, waterFracOfLiquid: 0 }],
].forEach(([label, args]) => w(`- ${label}: ${refusal(attempt(() => S.horizontalThreePhase(args)))}`));
w();

// --------------------------------------------------------------- SECTION 14
w('# SECTION 14: Droplets, and the verdicts they carry (owned by Expert m02)');
w();
w('Stokes settling between two liquids, in the field form the standards use, beside the oracle that re-derives it in SI from g d2 dRho over 18 mu:');
G.stokes.forEach((c) => {
  const v = S.liquidLiquidSettlingFtS(c.input).vFtS;
  w(`- ${c.name} (${e6(c.input.dropletMicron)} micron, heavy ${e6(c.input.sgHeavy)}, light ${e6(c.input.sgLight)}, ${e6(c.input.muCp)} cP): engine ${e6(v)} ft/s, oracle ${e6(c.expected.vFtS)} ft/s (golden), a ratio of ${e6(c.expected.vFtS / v)} (derived from the two figures on this row).`);
});
w('The field constant 1.78e-6 is a rounded packaging of the SI group, so the engine sits about four parts in a thousand below the SI derivation on every case, in the same direction each time. That is the size of the disagreement a droplet verdict is decided on when a residence time is close.');
w('The velocity goes as the SQUARE of the droplet size and inversely with viscosity, so halving the drop quarters the speed:');
[500, 350, 250, 150, 100].forEach((dm) => {
  const v = S.liquidLiquidSettlingFtS({ dropletMicron: dm, sgHeavy: AGBAMI.sgWater, sgLight: AGBAMI.sgOil, muCp: AGBAMI.muOilCp }).vFtS;
  w(`- a ${e6(dm)} micron water drop in ${e6(AGBAMI.muOilCp)} cP oil: ${e6(v)} ft/s.`);
});
(() => {
  const v500 = S.liquidLiquidSettlingFtS({ dropletMicron: 500, sgHeavy: AGBAMI.sgWater, sgLight: AGBAMI.sgOil, muCp: AGBAMI.muOilCp }).vFtS;
  const v250 = S.liquidLiquidSettlingFtS({ dropletMicron: 250, sgHeavy: AGBAMI.sgWater, sgLight: AGBAMI.sgOil, muCp: AGBAMI.muOilCp }).vFtS;
  w(`Read that as a straight line and a ${e6(250)} micron drop would settle at half the ${e6(500)} micron speed, ${e6(v500 / 2)} ft/s (derived: ${e6(v500)} halved). The engine gives ${e6(v250)} ft/s, a quarter, because the law is in the square of the diameter. The two differ by ${e6(v500 / 2 - v250)} ft/s (derived from the two figures on this row), which is the whole of the error in reading the law as linear.`);
})();
w();
w(`AGBAMI as sized: the vessel is ${e6(AG3.lengthFt)} ft long, so the oil stays ${m4(AG3.dropChecks.residenceOilS)} s and the water ${m4(AG3.dropChecks.residenceWaterS)} s.`);
w(`A ${e6(AGBAMI.waterDropletMicron)} micron water drop falls at ${e6(AG3.dropChecks.waterDropVelocityFtS)} ft/s and needs ${m4(AG3.dropChecks.waterDropFallS)} s to cross the ${e6(AG3.oilLayerFt)} ft oil layer, so waterCarryover is ${AG3.dropChecks.waterCarryover}.`);
w(`A ${e6(AGBAMI.oilDropletMicron)} micron oil drop rises at ${e6(AG3.dropChecks.oilDropVelocityFtS)} ft/s and needs ${m4(AG3.dropChecks.oilDropRiseS)} s to cross the ${e6(AG3.waterLayerFt)} ft water layer, so oilCarryunder is ${AG3.dropChecks.oilCarryunder}.`);
w('Under the proportional split the residence times are the retention times that were typed in, in seconds, because the split was made to give both phases the same length. Reading a residence back as a result there is reading an input.');
const AG3T = S.horizontalThreePhase({
  diameterFt: AGBAMI.diameterFt, qGasActFt3S: AG.qGasActFt3S, vTerminalFtS: AG.vT,
  liquidLevelFrac: AGBAMI.liquidLevelFrac, ...AGBAMI, waterDropletMicron: AGBAMI_TIGHT_WATER_DROPLET_MICRON,
});
w(`Tighten the water specification to ${e6(AGBAMI_TIGHT_WATER_DROPLET_MICRON)} micron and nothing about the vessel changes except the verdict: the drop falls at ${e6(AG3T.dropChecks.waterDropVelocityFtS)} ft/s, needs ${m4(AG3T.dropChecks.waterDropFallS)} s against ${m4(AG3T.dropChecks.residenceOilS)} s of residence, and waterCarryover is ${AG3T.dropChecks.waterCarryover}.`);
w(`The warning, verbatim: "${AG3T.warning}"`);
w(`On the pinned split the residence times separate: ${m4(AG3E.dropChecks.residenceOilS)} s for the oil against ${m4(AG3E.dropChecks.residenceWaterS)} s for the water, because the length is set by one phase and the areas by another.`);
w('Before FC1-0 a missing oil gravity did not refuse: the two droplet checks read NaN and came back false, so a vessel that carried water over reported no carryover. A verdict for an input it could not read is a verdict that says nothing.');
w();

// --------------------------------------------------------------- SECTION 15
w('# SECTION 15: The family of vessels (owned by Expert m03)');
w();
w('ABANA-1, the vertical family, band 2 to 4:');
sweepRows(S.ldSweep({
  mode: 'vertical2', ...ABANA_1_SWEEP, qGasActFt3S: A1.qGasActFt3S, vTerminalFtS: A1.vT,
  qLiquidBpd: A1.qLiquid, retentionMin: ABANA_1.retentionMin, allowanceFt: ABANA_1.allowanceFt,
}));
w();
w('ABANA-2, the horizontal family, band 3 to 5:');
const A2S = S.ldSweep({
  mode: 'horizontal2', ...ABANA_2_SWEEP, qGasActFt3S: A2.qGasActFt3S, vTerminalFtS: A2.vT,
  qLiquidBpd: A2.qLiquid, retentionMin: ABANA_2.retentionMin, liquidLevelFrac: ABANA_2.liquidLevelFrac,
});
sweepRows(A2S);
w('The same family judged against a band widened to 3 to 7, which is an INPUT and not a property of the vessel:');
const A2W = S.ldSweep({
  mode: 'horizontal2', diametersFt: ABANA_2_SWEEP.diametersFt, ...ABANA_2_WIDE_BAND,
  qGasActFt3S: A2.qGasActFt3S, vTerminalFtS: A2.vT, qLiquidBpd: A2.qLiquid,
  retentionMin: ABANA_2.retentionMin, liquidLevelFrac: ABANA_2.liquidLevelFrac,
});
sweepRows(A2W);
w(`Widening the band admits a row the narrow band excluded, and the preferred vessel does not move: the ${e6(A2W.rows[1].diameterFt)} ft row is now inRange ${A2W.rows[1].inRange} and still infeasible for ${A2W.rows[1].reasons.join(', ')}, so the smallest FEASIBLE row in band is still ${e6(A2W.preferred.diameterFt)} ft. A rule that took the first row in band would have moved.`);
w();
w(`AGBAMI, the three-phase family at the ${e6(AGBAMI.waterDropletMicron)} micron specification, band 3 to 5:`);
const AGS = S.ldSweep({
  mode: 'horizontal3', ...AGBAMI_SWEEP, qGasActFt3S: AG.qGasActFt3S, vTerminalFtS: AG.vT,
  liquidLevelFrac: AGBAMI.liquidLevelFrac, ...AGBAMI, diameterFt: undefined,
});
sweepRows(AGS);
w(`The same family at the ${e6(AGBAMI_TIGHT_WATER_DROPLET_MICRON)} micron specification:`);
sweepRows(S.ldSweep({
  mode: 'horizontal3', ...AGBAMI_SWEEP, qGasActFt3S: AG.qGasActFt3S, vTerminalFtS: AG.vT,
  liquidLevelFrac: AGBAMI.liquidLevelFrac, ...AGBAMI,
  waterDropletMicron: AGBAMI_TIGHT_WATER_DROPLET_MICRON, diameterFt: undefined,
}));
w('A droplet verdict gates feasibility, because a vessel that carries water into the oil outlet has not separated the stream, whatever its slenderness.');
w(`The same family at the ${e6(AGBAMI.waterDropletMicron)} micron specification with the band narrowed to ${e6(AGBAMI_NARROW_BAND.ldMin)} to ${e6(AGBAMI_NARROW_BAND.ldMax)}:`);
sweepRows(S.ldSweep({
  mode: 'horizontal3', diametersFt: AGBAMI_SWEEP.diametersFt, ...AGBAMI_NARROW_BAND,
  qGasActFt3S: AG.qGasActFt3S, vTerminalFtS: AG.vT, liquidLevelFrac: AGBAMI.liquidLevelFrac,
  ...AGBAMI, diameterFt: undefined,
}));
w('Three statuses, and they mean different things: selected is a vessel, none-in-band means feasible vessels exist and none of them is inside the slenderness the band asks for, and none-feasible means no vessel in the list works at all.');
w();
w('Published sweep cases, with the row the retired rule would have preferred:');
G.sweep.forEach((c) => {
  const r = S.ldSweep(c.input);
  w(`- ${c.name} (${c.input.mode}, band ${e6(c.input.ldMin)} to ${e6(c.input.ldMax)}): preferred ${r.preferred ? `${e6(r.preferred.diameterFt)} ft` : 'null'}, status ${r.preferredStatus}; the retired rule preferred ${e6(c.expected.retiredPreferredDiameterFt)} ft (golden).`);
  r.rows.forEach((row) => w(`    ${e6(row.diameterFt)} ft: L/D ${e6(row.ldRatio)}, length ${e6(row.lengthFt)} ft, inRange ${row.inRange}, feasible ${row.feasible}, reasons ${row.reasons.join(', ') || 'none'}.`));
});
w();

// --------------------------------------------------------------- SECTION 16
w('# SECTION 16: Judging a layout (owned by Expert m04)');
w();
w('What counts as a check: a comparison between two PLACED items with a POSITIVE requirement. A table figure of zero is no requirement and is counted separately, an item without coordinates is skipped, and a radiation source whose item is not on the plan is skipped.');
w(`On ERHA: checked ${ERL.checked}, zeroRequirementPairs ${ERL.zeroRequirementPairs}, skipped ${ERL.skipped.length}, unknownPairs ${ERL.unknownPairs.length}, complete ${ERL.complete}, pass ${ERL.pass}, passStatus ${ERL.passStatus}.`);
w('Complete and pass answer different questions. Complete says the layout was fully judged; pass says the comparisons that were made all cleared. A layout can pass and be incomplete, and the retired rule reported pass true for a plan where NOTHING was checked.');
w();
w('Published layout cases:');
GL.layout.forEach((c) => {
  const r = L.checkLayout(c.input);
  w(`- ${c.name}: checked ${r.checked}, zero-requirement ${r.zeroRequirementPairs}, violations ${r.violations.length}, skipped ${JSON.stringify(r.skipped)}, unknown ${JSON.stringify(r.unknownPairs)}, complete ${r.complete}, pass ${r.pass} (${r.passStatus}).`);
  w(`    the retired rule reported checked ${c.expected.retiredRule.checked}, pass ${c.expected.retiredRule.pass}, worst ${JSON.stringify(c.expected.retiredRule.worstPair)} (golden).`);
  if (r.worstAbsolute) {
    w(`    worstAbsolute ${r.worstAbsolute.kind} ${r.worstAbsolute.aId} to ${r.worstAbsolute.bId}, ${m4(r.worstAbsolute.shortfallM)} m of ${m4(r.worstAbsolute.requiredM)} m; worstRelative ${r.worstRelative.kind} ${r.worstRelative.aId} to ${r.worstRelative.bId}, ${e6(r.worstRelative.shortfallFraction)}.`);
  }
});
(() => {
  const s4 = L.checkLayout(GL.layout.find((c) => c.name === 's4RankingsDisagree').input);
  w(`Two rankings are returned and neither is called the worst on its own. A pair ${m4(s4.worstRelative.shortfallM)} m short of ${m4(s4.worstRelative.requiredM)} m is the worst RELATIVE breach; a control room ${m4(s4.worstAbsolute.shortfallM)} m short of ${m4(s4.worstAbsolute.requiredM)} m is the worst ABSOLUTE one. The retired code returned one ranking, built on the relative shortfall, and called it worst.`);
})();
w();

// --------------------------------------------------------------- SECTION 17
w('# SECTION 17: What the method does not know (owned by Expert m05)');
w();
w('Four things this course teaches as limits and never as answers:');
w(`1. The K derating of 0.01 per 100 psi above 100 psig and the floor at ${e6(S.K_FLOOR)} are a rule of thumb recorded here, not a checked publication. At ${e6(ABANA_1.pPsig)} psig the vertical mesh K falls from ${e6(A1.kResult.kBase)} to ${e6(A1.kResult.k)}, which moves every vessel dimension that follows it.`);
w('2. A horizontal vessel borrows the Souders-Brown velocity at the horizontal K as its droplet settling velocity. If the published method sizes the gas length from a droplet diameter instead, the gas length and every conclusion drawn from it changes.');
w('3. The spacing table and the radiation labels are recorded values with no source checked. A site standard replaces the table wholesale.');
w('4. The published cases in these two goldens are SYNTHETIC. They come from an independent oracle written in Python from the same physics, in SI units where the engine works in field units, which catches an arithmetic or a unit error and cannot catch a method that is wrong in both files. No measured separator is in this course.');
w();
w('The DAK range is enforced rather than extrapolated, and the two directions are treated differently:');
[
  ['a cold gas below the range', { pPsia: 1000, tF: -150, gasSg: 0.65 }],
  ['a hot gas above the range', { pPsia: 500, tF: 700, gasSg: 0.65 }],
  ['a pressure above the range', { pPsia: 25000, tF: 150, gasSg: 0.65 }],
  ['a low-pressure separator below the fit data', { pPsia: 100, tF: 100, gasSg: 0.65 }],
].forEach(([label, input]) => {
  const r = S.gasDensityLbFt3(input);
  w(`- ${label}: ${r.error ? `refused, "${r.error}"` : `accepted, z ${e6(r.z)}, density ${e6(r.rhoLbFt3)} lb/ft3, note "${r.note}"`}`);
});
w(`The DAK bounds as this module states them: Tpr ${e6(S.DAK_TPR_MIN)} to ${e6(S.DAK_TPR_MAX)}, Ppr up to ${e6(S.DAK_PPR_MAX)}, with the fit data starting at Ppr ${e6(S.DAK_PPR_MIN_FIT)}.`);
w();

// --------------------------------------------------------------- SECTION 18
w('# SECTION 18: The Expert reading, a stream and a site together (owned by Expert m06)');
w();
w(`AGBAMI end to end: ${e6(AGBAMI.pPsig)} psig and ${e6(AGBAMI.tF)} degF give Ppr ${e6(AG.ppr)}, Tpr ${e6(AG.tpr)}, z ${e6(AG.z)} and a gas density of ${e6(AG.rhoGas)} lb/ft3; the vane pack gives K ${e6(AG.k)}; settling is ${e6(AG.vT)} ft/s; the gas arrives at ${e6(AG.qGasActFt3S)} ft3/s; at ${e6(AGBAMI.diameterFt)} ft the interface sits at ${e6(AG3.interfaceHeightFt)} ft, the vessel needs ${e6(AG3.lengthFt)} ft with the controlling requirement ${AG3.controlling}, and both droplet verdicts pass at the ${e6(AGBAMI.waterDropletMicron)} micron specification and the water one fails at ${e6(AGBAMI_TIGHT_WATER_DROPLET_MICRON)} micron.`);
w(`ERHA end to end: the flare setback is ${m4(ERF.distanceM)} m from ${m4(ERF.qKw)} kW, the bund radius is ${m4(ERP.radiusFromCentreM)} m from the centre and ${m4(ERP.setbackFromEdgeM)} m from the edge, and checking the site against both plus the table leaves ${ERL.violations.length} breaches, the largest of them ${m4(ERL.worstAbsolute.shortfallM)} m and the sharpest ${e6(ERL.worstRelative.shortfallFraction)} of its requirement, on a plan that is not complete because ${ERL.skipped.length} things were skipped.`);
w('A sized vessel and a judged site are the two halves of one answer: a drum that separates the stream and a plot that can hold the drum.');
w();

console.log(out.join('\n'));
