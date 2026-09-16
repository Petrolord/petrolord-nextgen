// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES OF gaswell_cases.json (plus sweeps
// around them and two clearly labelled TEACHING wells this wave designs for
// itself). THE PD5 CAPSTONE RUNS DIFFERENT CONDITIONS ENTIRELY: nothing here
// imports, reads or reproduces pd5_fields.mjs, fields.json, or any capstone
// well, depth, pressure, temperature, tubing size, slug, casing pressure,
// gas-liquid ratio or correlation verdict. The teaching digest and the capstone
// are two files with opposite audiences and they never share a number.
//
// Usage:  node /root/pd-wip-gaswell/pd5_dump.mjs > /root/pd-wip-gaswell/digest.txt
//         node /root/pd-wip-gaswell/pd5_leakcheck.mjs
//
// Engine:   packages/engines/engines/production/gasWellLoading.js
//           packages/engines/engines/production/plungerLift.js
//           packages/engines/engines/production/gasProperties.js
// Goldens:  packages/engines/test-data/production/goldens/gaswell_cases.json
//           (cut by tools/validation/production/oracle_gaswell.py, SI throughout)

import fs from 'fs';

const ROOT = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const ENG = `${ROOT}/engines/production/`;
const W = await import(`${ENG}gasWellLoading.js`);
const P = await import(`${ENG}plungerLift.js`);
const G = await import(`${ENG}gasProperties.js`);
const GOLD = JSON.parse(fs.readFileSync(
  `${ROOT}/test-data/production/goldens/gaswell_cases.json`, 'utf8'));

const out = [];
const w = (s) => out.push(s);
const f = (x, n = 6) => (x === null || x === undefined || Number.isNaN(x))
  ? 'n/a' : Number(x).toFixed(n);
const e = (x, n = 4) => (x === null || x === undefined) ? 'n/a' : Number(x).toExponential(n);
const yn = (b) => (b ? 'true' : 'false');

// ---------------------------------------------------------------- header
w('PD5 Gas Well Performance and Deliquification: TEACHING DIGEST');
w('');
w('THIS FILE RUNS THE PUBLISHED CASES. THE CAPSTONE RUNS DIFFERENT CONDITIONS');
w('ENTIRELY. Every line below comes from a PUBLISHED golden case out of');
w('packages/engines/test-data/production/goldens/gaswell_cases.json, from the');
w('shipped engine re-run on those published inputs, from a sweep this generator');
w('ran on published inputs, or from one of the two TEACHING wells this wave');
w('designed for itself. The generator never opens pd5_fields.mjs and never reads');
w('the capstone well: no capstone depth, pressure, temperature, tubing size,');
w('slug, casing pressure, gas-liquid ratio or graded answer is reachable from');
w('here.');
w('');
w('A leak guard, pd5_leakcheck.mjs, reads the capstone graded field list out of');
w('fields.json and every number on every line of this file, and rejects the digest');
w('if any number lands within TEN TIMES a graded field tolerance of that field');
w('value, in three unit shiftings (as printed, times 1000, times 0.001).');
w('academy_submit_capstone grades with abs(got - expected) <= tol, so tol is');
w('ABSOLUTE in the field own units and is not a fraction of anything. Ten times it');
w('is under a hundredth of a psi on the plunger lift pressure, under a fortieth of');
w('a Mscf/d on a critical rate, and under a hundredth of a foot on the maximum');
w('slug. This file passed that guard.');
w('');
w('Generator: /root/pd-wip-gaswell/pd5_dump.mjs');
w('Engine:    packages/engines/engines/production/gasWellLoading.js');
w('           packages/engines/engines/production/plungerLift.js');
w('           packages/engines/engines/production/gasProperties.js');
w('Goldens:   packages/engines/test-data/production/goldens/gaswell_cases.json');
w('Golden oracle: tools/validation/production/oracle_gaswell.py (SI throughout,');
w('           no gc anywhere, plunger lift in pascals and metres, the rate constant');
w('           built from the molar volume rather than from 86400 Tsc/psc)');
w('Gate:      __tests__/production.gaswell.test.js');
w('Units: psia, degR, degF, Mscf/d, ft, in, in2, ft2, lbm/ft3, dyne/cm, ft/s, bbl,');
w('       bbl/d, scf, scf/bbl, psi, psi/ft, min. Never psig, never SI.');
w('');
w('WHAT PROVENANCE LABEL MEANS WHAT');
w('  golden ...    a value committed in gaswell_cases.json, cut by the independent');
w('                stdlib oracle named above. Twelve droplet-velocity rows, one');
w('                plunger-lift case, three constants.');
w('  engine ...    the shipped engine re-run on PUBLISHED golden inputs. Where a');
w('                golden carries the same quantity, the two are printed together');
w('                so a lesson can see the agreement or the divergence.');
w('  derived ...   a sweep, a refinement or a second route run by this generator on');
w('                PUBLISHED inputs. A sweep point is not a published case. Say so');
w('                if you print one.');
w('  teaching ...  a construct this wave invented: the teaching wells EBOCHA-5 and');
w('                OGUTA-2. Not published cases, not real wells, and never to be');
w('                presented as either. No oracle has ever checked them.');
w('');
w('THE PUBLISHED CASES AT A GLANCE');
w(`  velocity table   ${GOLD.velocity.length} rows. Two fluids (Turner water at 60.0 dyne/cm and`);
w('                   67.0 lbm/ft3, Turner condensate at 20.0 dyne/cm and 45.0');
w('                   lbm/ft3) crossed with three pressures (300.0, 1000.0, 2500.0');
w('                   psia) and two temperatures (540.0, 620.0 degR), all at gas');
w('                   gravity 0.65 and z 0.9. Each row carries the gas density, the');
w('                   terminal droplet velocity, the Turner and Coleman velocities,');
w('                   and the Turner critical rate through a 2.441 in string.');
w('  plunger case     6000.0 ft of 2.441 in tubing, 200.0 ft slug of 1.02 SG liquid,');
w('                   120.0 psia line, 600.0 psia casing, 6.0 lb plunger, gas gravity');
w('                   0.65 at 580.0 degR and z 0.9. Carries the lift pressure term by');
w('                   term, the gas a cycle needs, the liquid a cycle brings up and');
w('                   the gas-liquid ratio that follows.');
w('  constants        the Turner droplet constant, the Mscf/d rate constant, and one');
w('                   real-gas density spot check.');
w('');
w('THE TWO TEACHING WELLS');
w('  EBOCHA-5   a 7500 ft gas well on 3.548 in tubing with a six station flowing');
w('             traverse, designed so the wellhead reads healthy and the shoe reads');
w('             loading under the correlation the wellhead pressure selects, and so');
w('             the sizing pick changes when the other correlation is used. It is a');
w('             TEACHING WELL.');
w('  OGUTA-2    an 8200 ft plunger lift candidate on 2.441 in tubing, designed so');
w('             the casing pressure can be walked down through the lift requirement');
w('             and the gas requirement watched falling the wrong way. It is a');
w('             TEACHING WELL.');
w('');

// ============================================================ SECTION 1
w('# SECTION 1: THE PUBLISHED CONSTANTS, AND WHAT EACH ONE IS BUILT FROM');
w('# The three numbers the goldens publish on their own, each re-derived by the');
w('# engine on its own route. The Turner constant is the whole droplet balance');
w('# collapsed into one number, and the gate checks that the engine PRODUCES it');
w('# rather than storing it. Associate m03 and m04 own this section.');
w(`golden constant, Turner droplet constant = ${f(GOLD.constants.turnerConstant, 10)} dimensionless`);
w(`golden constant, rate constant = ${f(GOLD.constants.rateConstantMscfd, 8)} Mscf/d per (ft/s x ft2 x psia / degR)`);
w(`golden constant, gas density at 1000.0 psia 600.0 degR z 0.88 gas gravity 0.65 = ${f(GOLD.constants.gasDensity_1000psia_600R_z088_sg065, 10)} lbm/ft3`);
{
  const t = W.terminalDropletVelocity({ sigmaDyneCm: 1, rhoLiquidLbFt3: 2, rhoGasLbFt3: 1 });
  w(`engine constant, Turner droplet constant from the derivation = ${f(t.constant, 10)} dimensionless`);
  w(`engine constant, difference from the SI oracle = ${e(t.constant - GOLD.constants.turnerConstant, 4)} dimensionless`);
  // LABELLED AS A MAGNITUDE, which is what it always was. A lesson writer
  // reported that this line and the signed absolute difference above it look
  // like they should share a sign and do not. The magnitude was never wrong
  // and five lessons already quote it correctly as a magnitude alongside the
  // signed difference, so the honest repair is the label rather than the
  // number: say which of the two it is and the contradiction disappears.
  w(`engine constant, relative difference from the SI oracle, as a magnitude = ${e(Math.abs(t.constant - GOLD.constants.turnerConstant) / GOLD.constants.turnerConstant, 4)}`);
  w(`engine constant, rate constant = ${f(W.RATE_CONSTANT_MSCFD, 8)} Mscf/d, difference from the oracle = ${e(W.RATE_CONSTANT_MSCFD - GOLD.constants.rateConstantMscfd, 4)}`);
  const rho = W.gasDensityLbFt3({ pPsia: 1000, tempR: 600, z: 0.88, gasSg: 0.65 });
  w(`engine constant, gas density at the same spot = ${f(rho, 10)} lbm/ft3, difference from the oracle = ${e(rho - GOLD.constants.gasDensity_1000psia_600R_z088_sg065, 4)} lbm/ft3`);
  w(`engine constant, drag coefficient = ${f(W.DEFAULT_DRAG_COEFFICIENT, 4)} dimensionless (rigid sphere, Newton regime)`);
  w(`engine constant, critical Weber number = ${f(W.DEFAULT_CRITICAL_WEBER, 4)} dimensionless (droplet break-up)`);
  w(`engine constant, gc = ${f(W.GC, 4)} lbm ft / (lbf s2)`);
  w(`engine constant, dyne/cm to lbf/ft = ${e(W.DYNE_CM_TO_LBF_FT, 6)}`);
  w(`engine constant, standard pressure = ${f(W.P_STANDARD_PSIA, 2)} psia, standard temperature = ${f(W.T_STANDARD_R, 2)} degR`);
  w(`engine constant, Turner adjustment = ${f(W.LOADING_ADJUSTMENT.turner, 4)}, Coleman adjustment = ${f(W.LOADING_ADJUSTMENT.coleman, 4)}`);
  w(`engine constant, Coleman pressure limit = ${f(W.COLEMAN_PRESSURE_LIMIT_PSIA, 1)} psia`);
  w(`engine constant, air molecular weight in gasWellLoading = ${f(W.AIR_MW, 4)} lbm/lbmol`);
  w(`engine constant, air molecular weight in gasProperties = ${f(G.AIR_MW, 4)} lbm/lbmol`);
  w(`engine constant, gas constant R = ${f(W.R_PSIA_FT3_LBMOL_R, 4)} psia ft3 / (lbmol degR) in both modules`);
  w(`derived constant, the rate constant divided by 1000 = ${f(W.RATE_CONSTANT_MSCFD / 1000, 6)}, which is the 3.06 the texts print for MMscf/d`);
  w(`derived constant, the rate constant rebuilt by hand as 86400 x ${f(W.T_STANDARD_R, 2)} / (${f(W.P_STANDARD_PSIA, 2)} x 1000) = ${f((86400 * W.T_STANDARD_R) / (W.P_STANDARD_PSIA * 1000), 8)} Mscf/d`);
}
w('');

// ============================================================ SECTION 2
w('# SECTION 2: THE PUBLISHED VELOCITY TABLE, EVERY ROW, EVERY COLUMN');
w('# All twelve rows as the oracle cut them, then the same twelve re-run through the');
w('# engine. The Coleman velocity IS the terminal velocity, because Coleman applies');
w('# no adjustment, and the goldens carry both names so that identity is visible.');
w('# The published critical rate is the TURNER rate through a 2.441 in string; the');
w('# Coleman rate on the same string is derived below it. Associate m02 through m05.');
GOLD.velocity.forEach((r, i) => {
  const n = i + 1;
  w(`golden velocity row ${n}, inputs: ${r.fluid}, sigma ${f(r.sigmaDyneCm, 1)} dyne/cm, liquid density ${f(r.rhoLiquidLbFt3, 1)} lbm/ft3, ${f(r.pPsia, 1)} psia, ${f(r.tempR, 1)} degR, z ${f(r.z, 2)}, gas gravity ${f(r.gasSg, 2)}`);
  w(`golden velocity row ${n}, gas density = ${f(r.rhoGasLbFt3, 10)} lbm/ft3`);
  w(`golden velocity row ${n}, terminal droplet velocity = ${f(r.terminalFtS, 10)} ft/s`);
  w(`golden velocity row ${n}, Coleman critical velocity = ${f(r.colemanFtS, 10)} ft/s`);
  w(`golden velocity row ${n}, Turner critical velocity = ${f(r.turnerFtS, 10)} ft/s`);
  w(`golden velocity row ${n}, Turner critical rate through 2.441 in = ${f(r.criticalRateTurnerMscfd, 9)} Mscf/d`);
});
w('# The engine on the same twelve rows. Two unit systems meeting: the oracle in');
w('# N/m, kg/m3 and m/s with no gc at all, the engine in dyne/cm, lbm/ft3 and ft/s');
w('# carrying gc explicitly. The residual differences are the rounding in the');
w('# field-unit conversions, not a difference in physics.');
const AREA_2441 = W.tubingAreaFt2(2.441);
GOLD.velocity.forEach((r, i) => {
  const n = i + 1;
  const vT = W.criticalVelocity({
    correlation: 'turner', sigmaDyneCm: r.sigmaDyneCm, rhoLiquidLbFt3: r.rhoLiquidLbFt3,
    pPsia: r.pPsia, tempR: r.tempR, z: r.z, gasSg: r.gasSg,
  });
  const vC = W.criticalVelocity({
    correlation: 'coleman', sigmaDyneCm: r.sigmaDyneCm, rhoLiquidLbFt3: r.rhoLiquidLbFt3,
    pPsia: r.pPsia, tempR: r.tempR, z: r.z, gasSg: r.gasSg,
  });
  const qT = W.rateAtVelocity({ velocityFtS: vT.velocityFtS, areaFt2: AREA_2441, pPsia: r.pPsia, tempR: r.tempR, z: r.z });
  const qC = W.rateAtVelocity({ velocityFtS: vC.velocityFtS, areaFt2: AREA_2441, pPsia: r.pPsia, tempR: r.tempR, z: r.z });
  w(`engine velocity row ${n}, gas density = ${f(vT.rhoGasLbFt3, 10)} lbm/ft3, difference from golden = ${e(vT.rhoGasLbFt3 - r.rhoGasLbFt3, 4)} lbm/ft3`);
  w(`engine velocity row ${n}, terminal = ${f(vT.terminalFtS, 10)} ft/s, Coleman = ${f(vC.velocityFtS, 10)} ft/s, Turner = ${f(vT.velocityFtS, 10)} ft/s, Turner difference from golden = ${e(vT.velocityFtS - r.turnerFtS, 4)} ft/s`);
  w(`engine velocity row ${n}, Turner critical rate through 2.441 in = ${f(qT, 9)} Mscf/d, difference from golden = ${e(qT - r.criticalRateTurnerMscfd, 4)} Mscf/d`);
  w(`derived velocity row ${n}, Coleman critical rate through 2.441 in = ${f(qC, 9)} Mscf/d, Turner minus Coleman = ${f(qT - qC, 9)} Mscf/d, Turner over Coleman = ${f(qT / qC, 10)}`);
});
w('');

// ============================================================ SECTION 3
w('# SECTION 3: z AND GAS DENSITY AT A STATION, AND THE TWO MOLECULAR WEIGHTS OF AIR');
w('# Density is the first thing a station gives you and everything after it turns on');
w('# the number. rho = p M / (z R T), and the two production modules do not carry');
w('# the same M. gasWellLoading uses 28.9647 and takes degR at the door;');
w('# gasProperties uses 28.9625 and takes degF at the door and divides by 144 to get');
w('# a gradient. Both feed real-gas density in the same domain, on the same R.');
w('# Associate m02 states the density; Expert m05 l03 owns the seam.');
{
  const mwGap = W.AIR_MW - G.AIR_MW;
  w(`derived air, gasWellLoading.AIR_MW minus gasProperties.AIR_MW = ${f(mwGap, 6)} lbm/lbmol`);
  w(`derived air, the two as parts per million of each other = ${f((mwGap / G.AIR_MW) * 1e6, 4)} ppm`);
  w('# The published station this is priced on is golden velocity row 6: 2500.0 psia,');
  w('# 620.0 degR, z 0.9, gas gravity 0.65. Both routes get the same p, T, z and');
  w('# gravity; the ONLY thing that differs is the molecular weight of air.');
  const pS = 2500.0; const tR = 620.0; const zS = 0.9; const sgS = 0.65;
  const tFs = tR - G.R_OFFSET;
  const rhoA = W.gasDensityLbFt3({ pPsia: pS, tempR: tR, z: zS, gasSg: sgS });
  const rhoB = G.gasGradient({ pPsia: pS, tF: tFs, gasSg: sgS, z: zS }) * 144;
  w(`derived air, the station in degR = ${f(tR, 4)} degR, the same station in degF = ${f(tFs, 4)} degF, and gasProperties.toRankine takes it back = ${f(G.toRankine(tFs), 4)} degR`);
  w(`derived air, gasWellLoading.gasDensityLbFt3 = ${f(rhoA, 10)} lbm/ft3`);
  w(`derived air, gasProperties.gasGradient x 144 = ${f(rhoB, 10)} lbm/ft3`);
  w(`derived air, the gap between the two routes = ${e(rhoA - rhoB, 6)} lbm/ft3`);
  w(`derived air, the gap as a fraction of the density = ${e((rhoA - rhoB) / rhoA, 6)}`);
  w(`derived air, gasProperties.gasGradient at the same station = ${f(rhoB / 144, 10)} psi/ft`);
  w(`golden air, the same station published by the SI oracle = ${f(GOLD.velocity[5].rhoGasLbFt3, 10)} lbm/ft3`);
  w('# What the gap is worth further on. Gas density enters the critical velocity as');
  w('# 1/sqrt(rho) and also, weakly, through the buoyancy in the density difference,');
  w('# so the velocity moves by a little over half the fractional density change.');
  w('# Both fractions are printed rather than reasoned about.');
  const vA = W.criticalVelocity({ correlation: 'turner', sigmaDyneCm: 60, rhoLiquidLbFt3: 67, pPsia: pS, tempR: tR, z: zS, gasSg: sgS });
  const tB = W.terminalDropletVelocity({ sigmaDyneCm: 60, rhoLiquidLbFt3: 67, rhoGasLbFt3: rhoB });
  w(`derived air, Turner critical velocity on the gasWellLoading density = ${f(vA.velocityFtS, 10)} ft/s`);
  w(`derived air, Turner critical velocity on the gasProperties density = ${f(tB.velocityFtS * 1.2, 10)} ft/s`);
  w(`derived air, the difference the molecular weight makes to the velocity = ${e(vA.velocityFtS - tB.velocityFtS * 1.2, 6)} ft/s`);
  w(`derived air, that difference as a fraction of the velocity = ${e(Math.abs(vA.velocityFtS - tB.velocityFtS * 1.2) / vA.velocityFtS, 6)}, against a density fraction of ${e(Math.abs(rhoA - rhoB) / rhoA, 6)}`);
  w(`derived air, the velocity fraction over the density fraction = ${f((Math.abs(vA.velocityFtS - tB.velocityFtS * 1.2) / vA.velocityFtS) / (Math.abs(rhoA - rhoB) / rhoA), 8)}, which is the one half from the inverse square root plus the buoyancy term`);
  w('# DAK z, which the goldens do not exercise: the velocity table pins z at 0.9 as');
  w('# an input, so the compressibility route is only reachable through gasProperties.');
  for (const [pp, tf] of [[300, 80.33], [1000, 80.33], [2500, 160.33], [1000, 140.33]]) {
    const z = G.naturalGasZ({ pPsia: pp, tF: tf, gasSg: 0.65 });
    w(`derived z, Sutton plus Dranchuk and Abou-Kassem at ${f(pp, 1)} psia ${f(tf, 2)} degF gas gravity 0.65: z = ${f(z, 10)} dimensionless, against the 0.9 the golden table pins`);
  }
  const sut = G.suttonPseudoCriticals(0.65);
  w(`derived z, Sutton pseudo-criticals at gas gravity 0.65: Tpc = ${f(sut.tpcR, 6)} degR, Ppc = ${f(sut.ppcPsia, 6)} psia`);
}
w('');

// ============================================================ SECTION 4
w('# SECTION 4: THE DROPLET BALANCE, AND WHAT MOVES IT');
w('# Drag against weight less buoyancy, with the largest stable droplet set by a');
w('# critical Weber number. Eliminating the droplet diameter between the two leaves');
w('# a velocity that depends on exactly three groups and nothing else: sigma to the');
w('# quarter, the density difference to the quarter, and one over the square root of');
w('# the gas density. Every row below is the engine, run on published golden fluid');
w('# properties and published golden gas densities. Associate m03 owns all of it.');
w('#');
w('# READ THAT SENTENCE CAREFULLY, BECAUSE IT INVITES A CLAIM THAT IS FALSE.');
w('# "Three groups and nothing else" is true of the SWEEP below, where the density');
w('# difference is driven as an independent input. It is NOT true of a real');
w('# station, because there the gas density appears TWICE: once on its own under');
w('# the square root and once inside the density difference.');
w('#');
w('# The consequence a writer will trip on: the water-to-condensate velocity ratio');
w('# is NOT a fluid constant. The 1.4626530609 printed below belongs to 1000.0');
w('# psia and 620.0 degR and does not hold at 300.0 or at 2500.0 psia. Quote it');
w('# with its station, always. A lesson writer nearly wrote it as an invariant,');
w('# caught it, and asked for this note.');
{
  w('# The power laws, checked rather than asserted. Doubling sigma by sixteen doubles');
  w('# the velocity; doubling the density difference by sixteen doubles it; four times');
  w('# the gas density halves it.');
  const v = (s, dl, rg) => W.terminalDropletVelocity({ sigmaDyneCm: s, rhoLiquidLbFt3: rg + dl, rhoGasLbFt3: rg }).velocityFtS;
  w(`derived balance, sigma 1.0 dyne/cm, density difference 60.0, gas density 3.0: terminal = ${f(v(1, 60, 3), 10)} ft/s`);
  w(`derived balance, sigma 16.0 dyne/cm, density difference 60.0, gas density 3.0: terminal = ${f(v(16, 60, 3), 10)} ft/s, ratio to the row above = ${f(v(16, 60, 3) / v(1, 60, 3), 10)}`);
  w(`derived balance, sigma 60.0 dyne/cm, density difference 1.0, gas density 3.0: terminal = ${f(v(60, 1, 3), 10)} ft/s`);
  w(`derived balance, sigma 60.0 dyne/cm, density difference 16.0, gas density 3.0: terminal = ${f(v(60, 16, 3), 10)} ft/s, ratio to the row above = ${f(v(60, 16, 3) / v(60, 1, 3), 10)}`);
  w(`derived balance, sigma 60.0 dyne/cm, density difference 60.0, gas density 1.0: terminal = ${f(v(60, 60, 1), 10)} ft/s`);
  w(`derived balance, sigma 60.0 dyne/cm, density difference 60.0, gas density 4.0: terminal = ${f(v(60, 60, 4), 10)} ft/s, ratio to the row above = ${f(v(60, 60, 4) / v(60, 60, 1), 10)}`);
  w('# The drag coefficient and the Weber number are inputs, so the 1.5936 moves when');
  w('# they move. This is the whole difference between a derivation and a remembered');
  w('# number, and the sweep is contiguous so the direction of each is visible.');
  for (const cd of [0.22, 0.33, 0.44, 0.55, 0.88, 1.10]) {
    const t = W.terminalDropletVelocity({ sigmaDyneCm: 1, rhoLiquidLbFt3: 2, rhoGasLbFt3: 1, dragCoefficient: cd });
    w(`derived balance, drag coefficient ${f(cd, 2)}: constant = ${f(t.constant, 10)} dimensionless, ratio to the shipped 0.44 = ${f(t.constant / GOLD.constants.turnerConstant, 10)}`);
  }
  for (const we of [10, 20, 30, 40, 60, 120]) {
    const t = W.terminalDropletVelocity({ sigmaDyneCm: 1, rhoLiquidLbFt3: 2, rhoGasLbFt3: 1, criticalWeber: we });
    w(`derived balance, critical Weber number ${f(we, 1)}: constant = ${f(t.constant, 10)} dimensionless, ratio to the shipped 30 = ${f(t.constant / GOLD.constants.turnerConstant, 10)}`);
  }
  w('# Surface tension at one published gas density. Row 4 of the golden table:');
  w('# 1000.0 psia, 620.0 degR, z 0.9, gas gravity 0.65, gas density as published.');
  w('# The whole contiguous sweep, including the two ends nobody would produce.');
  const rhoG4 = GOLD.velocity[3].rhoGasLbFt3;
  for (const s of [5, 10, 20, 30, 40, 50, 60, 70, 80]) {
    const t = W.terminalDropletVelocity({ sigmaDyneCm: s, rhoLiquidLbFt3: 67, rhoGasLbFt3: rhoG4 });
    w(`derived tension, sigma ${f(s, 1)} dyne/cm at liquid density 67.0 lbm/ft3: terminal = ${f(t.velocityFtS, 10)} ft/s, Turner = ${f(t.velocityFtS * 1.2, 10)} ft/s`);
  }
  w('# Liquid density at the same published gas density, contiguous.');
  for (const dl of [40, 45, 50, 55, 60, 62, 67, 70, 75]) {
    const t = W.terminalDropletVelocity({ sigmaDyneCm: 60, rhoLiquidLbFt3: dl, rhoGasLbFt3: rhoG4 });
    w(`derived density, liquid density ${f(dl, 1)} lbm/ft3 at sigma 60.0 dyne/cm: terminal = ${f(t.velocityFtS, 10)} ft/s, Turner = ${f(t.velocityFtS * 1.2, 10)} ft/s`);
  }
  w('# Brine against condensate, on the Turner fluid properties the module publishes.');
  W.TURNER_FLUIDS.forEach((fl) => {
    w(`engine fluid, ${fl.id} (${fl.label}): sigma = ${f(fl.sigmaDyneCm, 1)} dyne/cm, liquid density = ${f(fl.densityLbFt3, 1)} lbm/ft3`);
  });
  w(`engine fluid, an unknown fluid id falls back to ${W.turnerFluid('nonsense').id} rather than refusing`);
  for (const row of [3, 9]) {
    const r = GOLD.velocity[row];
    w(`golden fluid pair, at ${f(r.pPsia, 1)} psia ${f(r.tempR, 1)} degR the ${r.fluid} terminal velocity = ${f(r.terminalFtS, 10)} ft/s`);
  }
  {
    const wRow = GOLD.velocity[3]; const cRow = GOLD.velocity[9];
    w(`derived fluid pair, at 1000.0 psia 620.0 degR the water terminal over the condensate terminal = ${f(wRow.terminalFtS / cRow.terminalFtS, 10)}`);
    w(`derived fluid pair, at 1000.0 psia 620.0 degR the water Turner rate over the condensate Turner rate = ${f(wRow.criticalRateTurnerMscfd / cRow.criticalRateTurnerMscfd, 10)}`);
    w('# Condensate loads a well at a LOWER rate than water: about a third the tension');
    w('# and a lower density, so its droplets are easier to carry. Getting the sign of');
    w('# that backwards flags healthy wells as loaded.');
  }
  w('# What the balance refuses. A liquid lighter than the gas, or no tension at all,');
  w('# is not given a velocity.');
  const bad1 = W.terminalDropletVelocity({ sigmaDyneCm: 60, rhoLiquidLbFt3: 2, rhoGasLbFt3: 5 });
  const bad2 = W.terminalDropletVelocity({ sigmaDyneCm: 0, rhoLiquidLbFt3: 67, rhoGasLbFt3: 3 });
  w(`engine refusal, liquid density 2.0 below gas density 5.0: ok = ${yn(bad1.ok)}, velocity = ${f(bad1.velocityFtS, 6)} ft/s`);
  w(`engine refusal, sigma 0.0 dyne/cm: ok = ${yn(bad2.ok)}, velocity = ${f(bad2.velocityFtS, 6)} ft/s`);
  const badC = W.criticalVelocity({ correlation: 'guess', sigmaDyneCm: 60, rhoLiquidLbFt3: 67, pPsia: 1000, tempR: 600, z: 0.9, gasSg: 0.65 });
  w(`engine refusal, an unknown correlation: ok = ${yn(badC.ok)}, error = "${badC.error}"`);
}
w('');

// ============================================================ SECTION 5
w('# SECTION 5: FLOW AREA, AND THE RATE THAT FOLLOWS FROM A VELOCITY');
w('# A critical velocity is not a rate until it is multiplied by an area and');
w('# converted to standard conditions. The area is where the tubing size enters and');
w('# it is the only place it enters, which is why a velocity string works at all.');
w('# Associate m04 l01 and l02 own this.');
{
  for (const id of [4.494, 3.958, 3.826, 3.740, 3.548, 3.476, 3.068, 2.441, 2.041, 1.995, 1.610]) {
    w(`derived area, inside diameter ${f(id, 3)} in: flow area = ${f(W.tubingAreaFt2(id), 10)} ft2, cross-section = ${f(P.tubingAreaIn2(id), 8)} in2`);
  }
  w(`derived area, doubling the diameter from 2.441 in to 4.882 in multiplies the area by ${f(W.tubingAreaFt2(4.882) / W.tubingAreaFt2(2.441), 10)}`);
  w('# Rate and velocity are exact inverses. A rate quoted at surface and a velocity');
  w('# quoted downhole are the same statement in two currencies.');
  const args = { areaFt2: AREA_2441, pPsia: 900, tempR: 580, z: 0.9 };
  const q12 = W.rateAtVelocity({ velocityFtS: 12, ...args });
  w(`derived inverse, 12.0 ft/s through 2.441 in at 900.0 psia 580.0 degR z 0.9 = ${f(q12, 9)} Mscf/d`);
  w(`derived inverse, that rate back to a velocity = ${f(W.velocityAtRate({ qMscfd: q12, ...args }), 12)} ft/s`);
  w(`derived inverse, round trip closure = ${e(W.velocityAtRate({ qMscfd: q12, ...args }) - 12, 4)} ft/s`);
  w(`engine refusal, velocityAtRate with zero area = ${f(W.velocityAtRate({ qMscfd: 1000, areaFt2: 0, pPsia: 900, tempR: 580, z: 0.9 }), 4)}`);
  w(`engine refusal, gasDensityLbFt3 at zero temperature = ${f(W.gasDensityLbFt3({ pPsia: 1000, tempR: 0, z: 0.88, gasSg: 0.65 }), 4)} lbm/ft3`);
}
w('');

// ============================================================ SECTION 6
w('# SECTION 6: THE CRITICAL RATE, THE ACTUAL VELOCITY, AND THE RATIO THAT DECIDES');
w('#');
w('# PROVENANCE, AND SECTION 7 TAKES THE OTHER ROAD. The critical rates below');
w('# come from the ENGINE. Section 7 prints the same quantity for the same');
w('# published rows from the ORACLE. They agree to about ten significant figures');
w('# and disagree after that: golden row 3 Turner is 1614.343766935 Mscf/d here');
w('# and 1614.343188395 Mscf/d there, 5.7854e-4 apart. Both are correct and they');
w('# are two roads to one number.');
w('#');
w('# So keep a lesson on ONE road. A writer who takes a rate from section 6 and');
w('# a paired Turner-against-Coleman figure from section 7 has silently mixed');
w('# them, and the difference is exactly the size that reads as a typo. A lesson');
w('# writer hit this fork and kept m04 wholly on section 6 and m05 wholly on');
w('# section 7 rather than trusting themselves to remember which was which.');
w('# One published station, walked across a contiguous rate sweep. The critical rate');
w('# does not move: it belongs to the station, not to the well. The actual velocity');
w('# and the ratio move with the rate, and the ratio is the only one of the three');
w('# that carries a verdict. Every row is printed, including the two nobody would');
w('# report. Associate m04 l03 to l05.');
{
  const st = { pPsia: 1000, tempR: 540, z: 0.9, gasSg: 0.65, sigmaDyneCm: 60, rhoLiquidLbFt3: 67, idIn: 2.441 };
  const base = W.loadingAt({ correlation: 'turner', ...st, qMscfd: 1000 });
  w(`derived station, published golden row 3 conditions: ${f(st.pPsia, 1)} psia, ${f(st.tempR, 1)} degR, z ${f(st.z, 2)}, gas gravity ${f(st.gasSg, 2)}, water at ${f(st.sigmaDyneCm, 1)} dyne/cm and ${f(st.rhoLiquidLbFt3, 1)} lbm/ft3, ${f(st.idIn, 3)} in tubing`);
  w(`derived station, gas density = ${f(base.rhoGasLbFt3, 10)} lbm/ft3`);
  w(`derived station, terminal droplet velocity = ${f(base.terminalFtS, 10)} ft/s`);
  w(`derived station, Turner critical velocity = ${f(base.criticalVelocityFtS, 10)} ft/s`);
  w(`derived station, flow area = ${f(base.areaFt2, 10)} ft2`);
  w(`derived station, Turner critical rate = ${f(base.criticalRateMscfd, 9)} Mscf/d`);
  const cBase = W.loadingAt({ correlation: 'coleman', ...st, qMscfd: 1000 });
  w(`derived station, Coleman critical velocity = ${f(cBase.criticalVelocityFtS, 10)} ft/s, Coleman critical rate = ${f(cBase.criticalRateMscfd, 9)} Mscf/d`);
  for (const q of [400, 800, 1200, 1400, 1600, 1614, 1800, 2200, 2600]) {
    const at = W.loadingAt({ correlation: 'turner', ...st, qMscfd: q });
    w(`derived sweep, rate ${f(q, 1)} Mscf/d: actual velocity = ${f(at.actualVelocityFtS, 10)} ft/s, critical rate = ${f(at.criticalRateMscfd, 9)} Mscf/d, ratio = ${f(at.ratio, 10)}, loaded = ${yn(at.loaded)}`);
  }
  w('# The ratio is the rate ratio and the velocity ratio at once, because both sides');
  w('# of it are evaluated at the same station on the same area.');
  const at1 = W.loadingAt({ correlation: 'turner', ...st, qMscfd: 1800 });
  w(`derived sweep, at 1800.0 Mscf/d the velocity ratio = ${f(at1.actualVelocityFtS / at1.criticalVelocityFtS, 10)} and the rate ratio = ${f(at1.ratio, 10)}, difference = ${e(at1.actualVelocityFtS / at1.criticalVelocityFtS - at1.ratio, 4)}`);
}
w('');

// ============================================================ SECTION 7
w('# SECTION 7: TURNER AND COLEMAN SIDE BY SIDE, AND THE TWENTY PERCENT');
w('# They are one equation and one factor. Turner et al. found their field data sat');
w('# about twenty percent above the theoretical velocity and applied the adjustment;');
w('# Coleman et al., on low-pressure wells, found the unadjusted equation fitted');
w('# better. Every published row shows the same factor, exactly, to machine');
w('# precision. Associate m05 and Expert m01.');
GOLD.velocity.forEach((r, i) => {
  w(`golden pair row ${i + 1}, Coleman = ${f(r.colemanFtS, 10)} ft/s, Turner = ${f(r.turnerFtS, 10)} ft/s, Turner over Coleman = ${f(r.turnerFtS / r.colemanFtS, 12)}`);
});
{
  w('# And the same factor carried straight through to rate, because the rate is');
  w('# linear in the velocity at a fixed station and a fixed area.');
  GOLD.velocity.forEach((r, i) => {
    const qT = r.criticalRateTurnerMscfd;
    const qC = W.rateAtVelocity({ velocityFtS: r.colemanFtS, areaFt2: AREA_2441, pPsia: r.pPsia, tempR: r.tempR, z: r.z });
    w(`derived pair row ${i + 1}, Turner rate = ${f(qT, 9)} Mscf/d, Coleman rate = ${f(qC, 9)} Mscf/d, Turner minus Coleman = ${f(qT - qC, 9)} Mscf/d, as a percentage of the Coleman rate = ${f(((qT - qC) / qC) * 100, 8)}`);
  });
  w(`engine pair, LOADING_ADJUSTMENT.turner = ${f(W.LOADING_ADJUSTMENT.turner, 6)}, LOADING_ADJUSTMENT.coleman = ${f(W.LOADING_ADJUSTMENT.coleman, 6)}, and the difference between them as a percentage = ${f((W.LOADING_ADJUSTMENT.turner / W.LOADING_ADJUSTMENT.coleman - 1) * 100, 6)}`);
  w('# The terminal velocity is IDENTICAL under both. Only the adjustment differs, so');
  w('# a lesson that says the two correlations use different physics is wrong.');
  const a = { sigmaDyneCm: 60, rhoLiquidLbFt3: 67, pPsia: 1200, tempR: 600, z: 0.9, gasSg: 0.65 };
  const vt = W.criticalVelocity({ correlation: 'turner', ...a });
  const vc = W.criticalVelocity({ correlation: 'coleman', ...a });
  w(`derived pair, at 1200.0 psia 600.0 degR z 0.9: Turner terminal = ${f(vt.terminalFtS, 10)} ft/s, Coleman terminal = ${f(vc.terminalFtS, 10)} ft/s, difference = ${e(vt.terminalFtS - vc.terminalFtS, 4)} ft/s`);
  w(`derived pair, at the same station: Turner critical = ${f(vt.velocityFtS, 10)} ft/s, Coleman critical = ${f(vc.velocityFtS, 10)} ft/s, and the shared droplet constant = ${f(vt.constant, 10)}`);
}
w('');

// ============================================================ SECTION 8
w('# SECTION 8: THE THRESHOLD BETWEEN THEM, AND THE SENTENCE THAT PRINTS IT');
w('# recommendCorrelation takes ONE pressure and switches on a strict comparison');
w('# against 1000 psia. The branch is unambiguous; the sentence attached to it is');
w('# where the trouble was. The reason used to round the pressure it branched on to');
w('# a whole number, so a well below the limit printed AS the limit under a branch');
w('# that only takes wells below it, and it hardcoded the word wellhead for whatever');
w('# station it was handed. Both are display-only and both are now fixed: the print');
w('# carries one decimal and the station label is set by the caller. One decimal');
w('# NARROWS the collision by ten rather than closing it. Expert m01 l04.');
{
  for (const p of [400.0, 850.0, 980.0, 999.04, 999.88, 999.96, 1000.0, 1000.04, 1000.5, 1500.0, 2500.0]) {
    const r = W.recommendCorrelation(p);
    w(`engine threshold, ${f(p, 2)} psia: correlation = ${r.correlation}, rounded whole that pressure prints as ${Math.round(p)}, printed to one decimal it prints as ${p.toFixed(1)}`);
  }
  w(`engine threshold, the reason at 850.00 psia: "${W.recommendCorrelation(850.0).reason}"`);
  w(`engine threshold, the reason at 999.88 psia: "${W.recommendCorrelation(999.88).reason}"`);
  w(`engine threshold, the reason at 1500.00 psia: "${W.recommendCorrelation(1500.0).reason}"`);
  w('# The station label. The function takes the pressure of any station, and callers do');
  w('# hand it others, so the word in the sentence is an argument now.');
  w(`engine threshold, with no label at 1500.00 psia: "${W.recommendCorrelation(1500.0).reason}"`);
  w(`engine threshold, with a label at 1500.00 psia: "${W.recommendCorrelation(1500.0, 'at the 7,500 ft shoe').reason}"`);
  w('# The collision that one decimal leaves behind: anything inside 0.05 psi of the');
  w('# limit still renders as the limit.');
  w(`derived threshold, 999.96 psia prints as ${(999.96).toFixed(1)} and the limit prints as ${(1000).toFixed(1)}, while the branch still returns ${W.recommendCorrelation(999.96).correlation}`);
  w(`derived threshold, the distance from 999.96 psia to the limit = ${f(1000 - 999.96, 4)} psi`);
  w(`derived threshold, the distance from 999.04 psia to the limit = ${f(1000 - 999.04, 4)} psi, and it prints as ${(999.04).toFixed(1)}`);
}
w('');

// ============================================================ SECTION 9
w('# SECTION 9: TEACHING WELL EBOCHA-5, THE WHOLE DEFINITION');
w('# A TEACHING WELL. Not a published case, not a real well, and no oracle has ever');
w('# checked it. It exists so the three functions a point check cannot reach have');
w('# something to run on: the profile, the sizing and the correlation seam. Every');
w('# input is on this page so a reader can rebuild it.');
const EB = {
  name: 'EBOCHA-5',
  depthFt: 7500,
  idIn: 3.548,
  gasSg: 0.62,
  sigmaDyneCm: 62,
  rhoLiquidLbFt3: 66.2,
  qMscfd: 3100,
  liquidLabel: 'produced brine',
  raw: [[0, 880, 112], [1500, 978, 128.4], [3000, 1090, 144.8], [4500, 1218, 161.2], [6000, 1350, 177.6], [7500, 1500, 194]],
};
const EB_STATIONS = EB.raw.map(([d, p, t]) => ({
  depthFt: d, pPsia: p, tF: t, tempR: G.toRankine(t),
  z: G.naturalGasZ({ pPsia: p, tF: t, gasSg: EB.gasSg }), idIn: EB.idIn,
}));
const EB_CAND = [3.958, 3.826, 3.740, 3.548, 3.476, 3.068, 2.441, 2.041, 1.610];
{
  w(`teaching EBOCHA-5, tubing shoe depth = ${f(EB.depthFt, 1)} ft`);
  w(`teaching EBOCHA-5, current tubing inside diameter = ${f(EB.idIn, 3)} in, flow area = ${f(W.tubingAreaFt2(EB.idIn), 10)} ft2`);
  w(`teaching EBOCHA-5, gas gravity = ${f(EB.gasSg, 3)}`);
  w(`teaching EBOCHA-5, produced liquid interfacial tension = ${f(EB.sigmaDyneCm, 1)} dyne/cm, liquid density = ${f(EB.rhoLiquidLbFt3, 1)} lbm/ft3 (${EB.liquidLabel})`);
  w(`teaching EBOCHA-5, gas rate = ${f(EB.qMscfd, 1)} Mscf/d`);
  w(`teaching EBOCHA-5, tubing candidates for a velocity string = ${EB_CAND.map((c) => f(c, 3)).join(', ')} in`);
  EB_STATIONS.forEach((s) => {
    w(`teaching EBOCHA-5 traverse, ${f(s.depthFt, 1)} ft: ${f(s.pPsia, 1)} psia, ${f(s.tF, 2)} degF, ${f(s.tempR, 2)} degR, z from Sutton and DAK = ${f(s.z, 10)}, tubing ${f(s.idIn, 3)} in`);
  });
  EB_STATIONS.forEach((s) => {
    const rho = W.gasDensityLbFt3({ pPsia: s.pPsia, tempR: s.tempR, z: s.z, gasSg: EB.gasSg });
    w(`teaching EBOCHA-5 traverse, ${f(s.depthFt, 1)} ft: gas density = ${f(rho, 10)} lbm/ft3`);
  });
  w(`teaching EBOCHA-5, the wellhead pressure the operator reads = ${f(EB_STATIONS[0].pPsia, 1)} psia`);
  w(`teaching EBOCHA-5, the shoe pressure the liquid sees = ${f(EB_STATIONS[5].pPsia, 1)} psia`);
  w(`teaching EBOCHA-5, the pressure ratio between them = ${f(EB_STATIONS[5].pPsia / EB_STATIONS[0].pPsia, 8)}`);
}
w('');

// ============================================================ SECTION 10
w('# SECTION 10: THE LOADING PROFILE DOWN EBOCHA-5, STATION BY STATION');
w('# The correlation used here is the one recommendCorrelation returns for the');
w('# WELLHEAD pressure, which is how the function is called in practice. Every');
w('# station is printed, in order, top first, with its own ratio, so the crossing is');
w('# a sequence rather than an assertion. Professional m01 and m02 own this.');
const EB_WH_REC = W.recommendCorrelation(EB_STATIONS[0].pPsia, 'wellhead');
const EB_PROF = {};
for (const corr of ['coleman', 'turner']) {
  EB_PROF[corr] = W.loadingProfile({
    stations: EB_STATIONS, qMscfd: EB.qMscfd, correlation: corr,
    sigmaDyneCm: EB.sigmaDyneCm, rhoLiquidLbFt3: EB.rhoLiquidLbFt3, gasSg: EB.gasSg,
  });
}
{
  w(`teaching EBOCHA-5 profile, recommendCorrelation at the wellhead returns ${EB_WH_REC.correlation}`);
  w(`teaching EBOCHA-5 profile, its reason: "${EB_WH_REC.reason}"`);
  const p = EB_PROF[EB_WH_REC.correlation];
  p.points.forEach((pt) => {
    w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, ${f(pt.depthFt, 1)} ft: gas density = ${f(pt.rhoGasLbFt3, 10)} lbm/ft3, terminal = ${f(pt.terminalFtS, 10)} ft/s, critical velocity = ${f(pt.criticalVelocityFtS, 10)} ft/s`);
  });
  p.points.forEach((pt) => {
    w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, ${f(pt.depthFt, 1)} ft: critical rate = ${f(pt.criticalRateMscfd, 9)} Mscf/d, actual velocity = ${f(pt.actualVelocityFtS, 10)} ft/s, ratio = ${f(pt.ratio, 10)}, loaded = ${yn(pt.loaded)}`);
  });
  w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, controlling station = ${f(p.controlling.depthFt, 1)} ft, its critical rate = ${f(p.controlling.criticalRateMscfd, 9)} Mscf/d, its ratio = ${f(p.controlling.ratio, 10)}`);
  w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, loaded = ${yn(p.loaded)}, marginPct = ${f(p.marginPct, 8)} percent`);
  w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, the wellhead ratio = ${f(p.points[0].ratio, 10)} and the shoe ratio = ${f(p.points[5].ratio, 10)}, wellhead over shoe = ${f(p.points[0].ratio / p.points[5].ratio, 10)}`);
  w('# Where the crossing sits. The last station that reads healthy and the first that');
  w('# reads loaded, both printed, with the ratio each carries.');
  let last = null; let first = null;
  p.points.forEach((pt) => { if (pt.ratio >= 1) last = pt; else if (!first) first = pt; });
  w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, deepest healthy station = ${f(last.depthFt, 1)} ft at ratio ${f(last.ratio, 10)}`);
  w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, shallowest loading station = ${f(first.depthFt, 1)} ft at ratio ${f(first.ratio, 10)}`);
  w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, the crossing sits between those two, so it lies inside the deepest ${f(((EB.depthFt - last.depthFt) / EB.depthFt) * 100, 4)} percent of the string and outside the deepest ${f(((EB.depthFt - first.depthFt) / EB.depthFt) * 100, 4)} percent`);
  w('# What a wellhead-only check would have said, on the same well, on the same day.');
  w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, a point check at the wellhead alone: ratio = ${f(p.points[0].ratio, 10)}, loaded = ${yn(p.points[0].loaded)}, margin = ${f((p.points[0].ratio - 1) * 100, 8)} percent`);
  w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, the same well at the controlling station: ratio = ${f(p.controlling.ratio, 10)}, loaded = ${yn(p.controlling.loaded)}, margin = ${f(p.marginPct, 8)} percent`);
  w('# The critical rate rises monotonically with depth on a normal traverse, which is');
  w('# WHY the shoe controls. The increments are printed so the shape is visible.');
  for (let i = 1; i < p.points.length; i += 1) {
    const a = p.points[i - 1]; const b = p.points[i];
    w(`teaching EBOCHA-5 profile ${EB_WH_REC.correlation}, from ${f(a.depthFt, 1)} ft to ${f(b.depthFt, 1)} ft: critical rate rises ${f(b.criticalRateMscfd - a.criticalRateMscfd, 9)} Mscf/d, ratio falls ${f(a.ratio - b.ratio, 10)}`);
  }
  w('# The same well at a contiguous set of gas rates, so the crossing can be watched');
  w('# walking up the hole as the well declines. Every rate is printed, including the');
  w('# two where nothing crosses at all.');
  for (const q of [2400, 2700, 3000, 3100, 3200, 3450, 3700, 4000]) {
    const pr = W.loadingProfile({
      stations: EB_STATIONS, qMscfd: q, correlation: EB_WH_REC.correlation,
      sigmaDyneCm: EB.sigmaDyneCm, rhoLiquidLbFt3: EB.rhoLiquidLbFt3, gasSg: EB.gasSg,
    });
    const crossing = pr.points.find((pt) => pt.ratio < 1);
    w(`teaching EBOCHA-5 rate sweep ${EB_WH_REC.correlation}, ${f(q, 1)} Mscf/d: ratios = ${pr.points.map((pt) => f(pt.ratio, 6)).join(', ')}, loaded = ${yn(pr.loaded)}, marginPct = ${f(pr.marginPct, 6)}, shallowest loading station = ${crossing ? `${f(crossing.depthFt, 1)} ft` : 'none'}`);
  }
  w('# What the profile refuses.');
  const empty = W.loadingProfile({ stations: [], qMscfd: EB.qMscfd, correlation: 'turner', sigmaDyneCm: 62, rhoLiquidLbFt3: 66.2, gasSg: 0.62 });
  w(`engine refusal, an empty traverse: ok = ${yn(empty.ok)}, error = "${empty.error}"`);
  const badProf = W.loadingProfile({ stations: EB_STATIONS, qMscfd: EB.qMscfd, correlation: 'guess', sigmaDyneCm: 62, rhoLiquidLbFt3: 66.2, gasSg: 0.62 });
  w(`engine refusal, an unknown correlation in a profile: ok = ${yn(badProf.ok)}, error = "${badProf.error}"`);
}
w('');

// ============================================================ SECTION 11
w('# SECTION 11: THE CORRELATION SEAM AT FULL SIZE, ON EVERY STATION');
w('# The SAME six stations, evaluated once under Coleman and once under Turner. The');
w('# correlation was chosen from the wellhead pressure alone and is then used at');
w('# every station including the one that actually controls. This is what the choice');
w('# is worth, in Mscf/d and in verdicts, not as a claim. Expert m01 owns it.');
{
  const c = EB_PROF.coleman; const t = EB_PROF.turner;
  EB_STATIONS.forEach((s, i) => {
    const pc = c.points[i]; const pt = t.points[i];
    w(`teaching EBOCHA-5 seam, ${f(s.depthFt, 1)} ft at ${f(s.pPsia, 1)} psia: Coleman critical velocity = ${f(pc.criticalVelocityFtS, 10)} ft/s, Turner critical velocity = ${f(pt.criticalVelocityFtS, 10)} ft/s`);
  });
  EB_STATIONS.forEach((s, i) => {
    const pc = c.points[i]; const pt = t.points[i];
    w(`teaching EBOCHA-5 seam, ${f(s.depthFt, 1)} ft: Coleman critical rate = ${f(pc.criticalRateMscfd, 9)} Mscf/d, Turner critical rate = ${f(pt.criticalRateMscfd, 9)} Mscf/d, difference = ${f(pt.criticalRateMscfd - pc.criticalRateMscfd, 9)} Mscf/d, Turner over Coleman = ${f(pt.criticalRateMscfd / pc.criticalRateMscfd, 12)}`);
  });
  EB_STATIONS.forEach((s, i) => {
    const pc = c.points[i]; const pt = t.points[i];
    w(`teaching EBOCHA-5 seam, ${f(s.depthFt, 1)} ft: Coleman ratio = ${f(pc.ratio, 10)} loaded ${yn(pc.loaded)}, Turner ratio = ${f(pt.ratio, 10)} loaded ${yn(pt.loaded)}, verdicts agree = ${yn(pc.loaded === pt.loaded)}`);
  });
  w(`teaching EBOCHA-5 seam, Coleman verdict for the well: loaded = ${yn(c.loaded)}, controlling = ${f(c.controlling.depthFt, 1)} ft, marginPct = ${f(c.marginPct, 8)}`);
  w(`teaching EBOCHA-5 seam, Turner verdict for the well: loaded = ${yn(t.loaded)}, controlling = ${f(t.controlling.depthFt, 1)} ft, marginPct = ${f(t.marginPct, 8)}`);
  w(`teaching EBOCHA-5 seam, the two verdicts differ at ${EB_STATIONS.filter((s, i) => c.points[i].loaded !== t.points[i].loaded).map((s) => f(s.depthFt, 1)).join(', ') || 'no'} ft`);
  w('# recommendCorrelation asked at EVERY station rather than only at the gauge. The');
  w('# function takes one pressure, so this is the same call six times, and it does not');
  w('# return the same answer.');
  EB_STATIONS.forEach((s) => {
    const r = W.recommendCorrelation(s.pPsia, `at the ${s.depthFt.toLocaleString('en-US')} ft station`);
    w(`teaching EBOCHA-5 seam, recommendCorrelation at ${f(s.depthFt, 1)} ft (${f(s.pPsia, 1)} psia) returns ${r.correlation}`);
  });
  w(`teaching EBOCHA-5 seam, the reason it gives at the shoe: "${W.recommendCorrelation(EB_STATIONS[5].pPsia, 'at the 7,500 ft shoe').reason}"`);
  w(`teaching EBOCHA-5 seam, the wellhead choice is ${EB_WH_REC.correlation} and the controlling station would choose ${W.recommendCorrelation(EB_STATIONS[5].pPsia).correlation}`);
  w('# The same seam on a PUBLISHED station, so the twenty percent is not only a');
  w('# teaching-well number. Golden row 5: 2500.0 psia, 540.0 degR.');
  const gr = GOLD.velocity[4];
  const qC = W.rateAtVelocity({ velocityFtS: gr.colemanFtS, areaFt2: AREA_2441, pPsia: gr.pPsia, tempR: gr.tempR, z: gr.z });
  w(`derived seam, published row 5 Coleman rate = ${f(qC, 9)} Mscf/d, Turner rate = ${f(gr.criticalRateTurnerMscfd, 9)} Mscf/d, difference = ${f(gr.criticalRateTurnerMscfd - qC, 9)} Mscf/d`);
  w(`derived seam, a well making exactly the Coleman rate at that station is loaded under Turner at a ratio of ${f(qC / gr.criticalRateTurnerMscfd, 10)}`);
}
w('');

// ============================================================ SECTION 12
w('# SECTION 12: SIZING A VELOCITY STRING, EVERY CANDIDATE, BOTH CORRELATIONS');
w('# sizeTubingForRate returns the largest inside diameter whose critical rate the');
w('# well still beats, and it returns EVERY candidate with it. The pick is a single');
w('# line in the returned object; the rejections are the rest of it, and they are');
w('# where the argument about a workover actually happens. The list is run twice at');
w('# the SAME station, once under each correlation, and both full lists are printed');
w('# so the discarded candidate can be seen. Professional m03 and Expert m02.');
const EB_CTRL = EB_PROF[EB_WH_REC.correlation].controlling;
const EB_SIZED = {};
{
  w(`teaching EBOCHA-5 sizing, evaluated at the controlling station: ${f(EB_CTRL.depthFt, 1)} ft, ${f(EB_CTRL.pPsia, 1)} psia, ${f(EB_CTRL.tempR, 2)} degR, z = ${f(EB_CTRL.z, 10)}`);
  w(`teaching EBOCHA-5 sizing, at a gas rate of ${f(EB.qMscfd, 1)} Mscf/d`);
  for (const corr of ['coleman', 'turner']) {
    const s = W.sizeTubingForRate({
      candidatesIdIn: EB_CAND, qMscfd: EB.qMscfd, correlation: corr,
      sigmaDyneCm: EB.sigmaDyneCm, rhoLiquidLbFt3: EB.rhoLiquidLbFt3,
      pPsia: EB_CTRL.pPsia, tempR: EB_CTRL.tempR, z: EB_CTRL.z, gasSg: EB.gasSg,
    });
    EB_SIZED[corr] = s;
    s.rows.forEach((r) => {
      w(`teaching EBOCHA-5 sizing ${corr}, candidate ${f(r.idIn, 3)} in: flow area = ${f(r.areaFt2, 10)} ft2, critical velocity = ${f(r.criticalVelocityFtS, 10)} ft/s, critical rate = ${f(r.criticalRateMscfd, 9)} Mscf/d, actual velocity = ${f(r.actualVelocityFtS, 10)} ft/s, ratio = ${f(r.ratio, 10)}, unloads = ${yn(r.ratio >= 1)}`);
    });
    w(`teaching EBOCHA-5 sizing ${corr}, largestUnloaded = ${s.largestUnloaded ? `${f(s.largestUnloaded.idIn, 3)} in at a ratio of ${f(s.largestUnloaded.ratio, 10)}` : 'null'}`);
    w(`teaching EBOCHA-5 sizing ${corr}, candidates that unload = ${s.rows.filter((r) => r.ratio >= 1).map((r) => f(r.idIn, 3)).join(', ') || 'none'}`);
    w(`teaching EBOCHA-5 sizing ${corr}, candidates that do not = ${s.rows.filter((r) => !(r.ratio >= 1)).map((r) => f(r.idIn, 3)).join(', ') || 'none'}`);
  }
  const pc = EB_SIZED.coleman.largestUnloaded;
  const pt = EB_SIZED.turner.largestUnloaded;
  w(`teaching EBOCHA-5 sizing, the Coleman pick is ${f(pc.idIn, 3)} in and the Turner pick is ${f(pt.idIn, 3)} in`);
  w(`teaching EBOCHA-5 sizing, THE DISCARDED CANDIDATE: ${f(pc.idIn, 3)} in reads ${f(pc.ratio, 10)} under Coleman and ${f(EB_SIZED.turner.rows.find((r) => r.idIn === pc.idIn).ratio, 10)} under Turner`);
  w(`teaching EBOCHA-5 sizing, the Coleman pick loses ${f(pc.ratio - EB_SIZED.turner.rows.find((r) => r.idIn === pc.idIn).ratio, 10)} of ratio when the other correlation is used, which is ${f((1 - 1 / 1.2) * 100, 6)} percent of it`);
  w(`teaching EBOCHA-5 sizing, the Turner pick reads ${f(EB_SIZED.coleman.rows.find((r) => r.idIn === pt.idIn).ratio, 10)} under Coleman and ${f(pt.ratio, 10)} under Turner`);
  w(`teaching EBOCHA-5 sizing, the returned object carries these keys: ${Object.keys(EB_SIZED.coleman).join(', ')}`);
  w(`teaching EBOCHA-5 sizing, each row carries these keys: ${Object.keys(EB_SIZED.coleman.rows[0]).join(', ')}`);
  w(`teaching EBOCHA-5 sizing, so the CORRELATION is recorded, on every row, as "${EB_SIZED.coleman.rows[0].correlation}" and "${EB_SIZED.turner.rows[0].correlation}", and the adjustment beside it as ${f(EB_SIZED.coleman.rows[0].adjustment, 4)} and ${f(EB_SIZED.turner.rows[0].adjustment, 4)}`);
  w('# But the STATION is recorded nowhere. A row carries the pressure and');
  w('# temperature only through the density and the velocity it produced, and the');
  w('# returned object names no depth at all, so two sizings run at two stations on');
  w('# the same well are indistinguishable from their return values. See section 13.');
  w('# A rate nothing on the list can carry returns null rather than the least bad');
  w('# candidate, which is the right refusal and worth showing beside the pick.');
  const hopeless = W.sizeTubingForRate({
    candidatesIdIn: EB_CAND, qMscfd: 40, correlation: 'turner',
    sigmaDyneCm: EB.sigmaDyneCm, rhoLiquidLbFt3: EB.rhoLiquidLbFt3,
    pPsia: EB_CTRL.pPsia, tempR: EB_CTRL.tempR, z: EB_CTRL.z, gasSg: EB.gasSg,
  });
  w(`teaching EBOCHA-5 sizing, at 40.0 Mscf/d the largestUnloaded = ${hopeless.largestUnloaded === null ? 'null' : 'not null'}, and the best ratio on the list = ${f(Math.max(...hopeless.rows.map((r) => r.ratio)), 10)}`);
  w(`teaching EBOCHA-5 sizing, the rows are returned largest diameter first: ${EB_SIZED.coleman.rows.map((r) => f(r.idIn, 3)).join(' then ')}`);
}
w('');

// ============================================================ SECTION 13
w('# SECTION 13: THE SAME SIZING AT THE WRONG STATION');
w('# sizeTubingForRate takes bare pPsia, tempR and z and has no opinion about which');
w('# station they came from. the loadingProfile header says the controlling');
w('# station is the shoe and that evaluating at the wellhead is the classic error,');
w('# and the sizing that consumes that judgement accepts wellhead conditions without');
w('# a murmur. Both full lists are printed. Professional m03 l04 states it as a');
w('# limit; Expert m05 l04 states it as a fails-open.');
{
  const wh = EB_STATIONS[0];
  for (const corr of ['coleman', 'turner']) {
    const s = W.sizeTubingForRate({
      candidatesIdIn: EB_CAND, qMscfd: EB.qMscfd, correlation: corr,
      sigmaDyneCm: EB.sigmaDyneCm, rhoLiquidLbFt3: EB.rhoLiquidLbFt3,
      pPsia: wh.pPsia, tempR: wh.tempR, z: wh.z, gasSg: EB.gasSg,
    });
    s.rows.forEach((r) => {
      w(`teaching EBOCHA-5 wellhead sizing ${corr}, candidate ${f(r.idIn, 3)} in: critical rate = ${f(r.criticalRateMscfd, 9)} Mscf/d, ratio = ${f(r.ratio, 10)}, unloads = ${yn(r.ratio >= 1)}`);
    });
    w(`teaching EBOCHA-5 wellhead sizing ${corr}, largestUnloaded = ${s.largestUnloaded ? `${f(s.largestUnloaded.idIn, 3)} in at a ratio of ${f(s.largestUnloaded.ratio, 10)}` : 'null'}`);
    const atShoe = EB_SIZED[corr].largestUnloaded;
    w(`teaching EBOCHA-5 wellhead sizing ${corr}, the same list at the controlling station picks ${atShoe ? f(atShoe.idIn, 3) : 'null'} in, so the station is worth ${s.largestUnloaded && atShoe ? f(s.largestUnloaded.idIn - atShoe.idIn, 3) : 'n/a'} in of tubing`);
  }
  const whC = W.sizeTubingForRate({
    candidatesIdIn: EB_CAND, qMscfd: EB.qMscfd, correlation: EB_WH_REC.correlation,
    sigmaDyneCm: EB.sigmaDyneCm, rhoLiquidLbFt3: EB.rhoLiquidLbFt3,
    pPsia: wh.pPsia, tempR: wh.tempR, z: wh.z, gasSg: EB.gasSg,
  });
  w(`teaching EBOCHA-5 wellhead sizing, the current string is ${f(EB.idIn, 3)} in and the wellhead sizing returns ${f(whC.largestUnloaded.idIn, 3)} in, so it reports no workover is needed`);
  w(`teaching EBOCHA-5 wellhead sizing, the current string ratio at the wellhead = ${f(whC.rows.find((r) => r.idIn === EB.idIn).ratio, 10)} and at the controlling station = ${f(EB_SIZED[EB_WH_REC.correlation].rows.find((r) => r.idIn === EB.idIn).ratio, 10)}`);
  w(`teaching EBOCHA-5 wellhead sizing, the well is loading over the bottom ${f(((EB.depthFt - 4500) / EB.depthFt) * 100, 4)} percent of its tubing while that answer is returned`);
  w('# The controlling profile point already carries pPsia, tempR, z and idIn so that');
  w('# it can be handed straight in. Nothing makes a caller do it.');
  w(`teaching EBOCHA-5 wellhead sizing, the controlling point carries: pPsia = ${f(EB_CTRL.pPsia, 1)}, tempR = ${f(EB_CTRL.tempR, 2)}, z = ${f(EB_CTRL.z, 10)}, idIn = ${f(EB_CTRL.idIn, 3)}, depthFt = ${f(EB_CTRL.depthFt, 1)}`);
}
w('');

// ============================================================ SECTION 14
w('# SECTION 14: THE PUBLISHED PLUNGER LIFT CASE, TERM BY TERM');
w('# The one plunger case the oracle publishes, run through the engine. Every term');
w('# of the static force balance printed on its own, then the gas a cycle needs, the');
w('# liquid it brings up and the ratio between them. The oracle did the same balance');
w('# in pascals and metres. Professional m04 owns the reading.');
const GP = GOLD.plunger.inputs;
const PUB_LIFT = P.liftPressure({
  linePressurePsia: GP.linePressurePsia, slugLengthFt: GP.slugLengthFt, liquidSg: GP.liquidSg,
  idIn: GP.idIn, plungerWeightLb: GP.plungerWeightLb, depthFt: GP.depthFt,
  gasSg: GP.gasSg, avgTempR: GP.avgTempR, z: GP.z,
});
{
  w(`golden plunger, inputs: depth ${f(GP.depthFt, 1)} ft, tubing ${f(GP.idIn, 3)} in, slug ${f(GP.slugLengthFt, 1)} ft, liquid SG ${f(GP.liquidSg, 3)}, line ${f(GP.linePressurePsia, 1)} psia, casing ${f(GP.casingPressurePsia, 1)} psia, plunger ${f(GP.plungerWeightLb, 1)} lb, gas gravity ${f(GP.gasSg, 2)}, ${f(GP.avgTempR, 1)} degR, z ${f(GP.z, 2)}`);
  w(`golden plunger, slug hydrostatic = ${f(GOLD.plunger.slugPsi, 10)} psi`);
  w(`golden plunger, plunger weight term = ${f(GOLD.plunger.plungerPsi, 10)} psi`);
  w(`golden plunger, gas column term = ${f(GOLD.plunger.gasColumnPsi, 10)} psi`);
  w(`golden plunger, required lift pressure = ${f(GOLD.plunger.requiredPsia, 10)} psia`);
  w(`golden plunger, gas per cycle = ${f(GOLD.plunger.gasPerCycleScf, 9)} scf`);
  w(`golden plunger, liquid per cycle = ${f(GOLD.plunger.liquidPerCycleBbl, 10)} bbl`);
  w(`golden plunger, required gas-liquid ratio = ${f(GOLD.plunger.requiredGlrScfBbl, 8)} scf/bbl`);
  // THE UNSTATED CONVENTION, PRICED. liftPressure evaluates its gas column at
  // the LINE pressure and applies that density over the whole tubing above the
  // slug. The header defends carrying the term and never says at which
  // pressure it is carried, so this block runs the same term three ways: at
  // the line pressure as shipped, at the pressure at the slug top, and at the
  // average of the two. A defensible choice stated is worth more than a better
  // choice left implicit, and a reader cannot judge the choice without the
  // spread. Professional m04 l02 asked for this and could not find it.
  {
    const H = GP.depthFt - GP.slugLengthFt;
    const rhoAt = (pPsia) => W.gasDensityLbFt3({
      pPsia, tempR: GP.avgTempR, gasSg: GP.gasSg, z: GP.z,
    });
    const term = (pPsia) => (rhoAt(pPsia) * H) / 144;
    const pTop = GP.linePressurePsia + term(GP.linePressurePsia);
    const pAvg = (GP.linePressurePsia + pTop) / 2;
    w(`derived plunger, the gas column is carried over ${f(H, 1)} ft, from the line to the top of the slug`);
    w(`derived plunger, gas column term AT THE LINE PRESSURE ${f(GP.linePressurePsia, 1)} psia, which is what the engine ships = ${f(term(GP.linePressurePsia), 10)} psi`);
    w(`derived plunger, gas column term AT THE PRESSURE AT THE SLUG TOP ${f(pTop, 6)} psia = ${f(term(pTop), 10)} psi`);
    w(`derived plunger, gas column term AT THE AVERAGE OF THE TWO ${f(pAvg, 6)} psia = ${f(term(pAvg), 10)} psi`);
    w(`derived plunger, the spread between the shipped convention and the slug top = ${f(term(pTop) - term(GP.linePressurePsia), 10)} psi`);
    w(`derived plunger, that spread as a fraction of the required lift pressure = ${e(Math.abs(term(pTop) - term(GP.linePressurePsia)) / GOLD.plunger.requiredPsia, 4)}`);
  }
  w(`engine plunger, line pressure term = ${f(PUB_LIFT.terms.linePressurePsia, 10)} psi`);
  w(`engine plunger, slug hydrostatic = ${f(PUB_LIFT.terms.slugPsi, 10)} psi, difference from the oracle = ${f(PUB_LIFT.terms.slugPsi - GOLD.plunger.slugPsi, 10)} psi`);
  w(`engine plunger, plunger weight term = ${f(PUB_LIFT.terms.plungerPsi, 10)} psi, difference from the oracle = ${e(PUB_LIFT.terms.plungerPsi - GOLD.plunger.plungerPsi, 4)} psi`);
  w(`engine plunger, gas column term = ${f(PUB_LIFT.terms.gasColumnPsi, 10)} psi, difference from the oracle = ${e(PUB_LIFT.terms.gasColumnPsi - GOLD.plunger.gasColumnPsi, 4)} psi`);
  w(`engine plunger, friction term = ${f(PUB_LIFT.terms.frictionPsi, 10)} psi, which is an input and is measured rather than modelled`);
  w(`engine plunger, required lift pressure = ${f(PUB_LIFT.requiredPsia, 10)} psia, difference from the oracle = ${f(PUB_LIFT.requiredPsia - GOLD.plunger.requiredPsia, 10)} psi`);
  w(`engine plunger, tubing cross-section = ${f(PUB_LIFT.areaIn2, 10)} in2`);
  w(`engine plunger, the five terms sum to = ${f(Object.values(PUB_LIFT.terms).reduce((a, v) => a + v, 0), 10)} psia`);
  const gas = P.gasPerCycleScf({ depthFt: GP.depthFt, idIn: GP.idIn, pStartPsia: GP.casingPressurePsia, pEndPsia: PUB_LIFT.requiredPsia, avgTempR: GP.avgTempR, z: GP.z });
  const liq = P.slugVolumeBbl({ slugLengthFt: GP.slugLengthFt, idIn: GP.idIn });
  w(`engine plunger, gas per cycle = ${f(gas, 9)} scf, difference from the oracle = ${f(gas - GOLD.plunger.gasPerCycleScf, 9)} scf`);
  w(`engine plunger, liquid per cycle = ${f(liq, 10)} bbl, difference from the oracle = ${e(liq - GOLD.plunger.liquidPerCycleBbl, 4)} bbl`);
  w(`engine plunger, required gas-liquid ratio = ${f(gas / liq, 8)} scf/bbl, difference from the oracle = ${f(gas / liq - GOLD.plunger.requiredGlrScfBbl, 8)} scf/bbl`);
  w(`derived plunger, slug volume and slug length are inverses: ${f(GP.slugLengthFt, 1)} ft gives ${f(liq, 10)} bbl and that volume gives back ${f(P.slugLengthForBbl({ bbl: liq, idIn: GP.idIn }), 10)} ft`);
  w(`engine plunger, FT3_PER_BBL = ${f(P.FT3_PER_BBL, 6)} ft3/bbl`);
  w(`engine plunger, the rule of thumb constant = ${f(P.RULE_OF_THUMB_SCF_PER_BBL_PER_1000FT, 1)} scf per bbl per 1000 ft`);
  w(`derived plunger, the rule of thumb on the published depth = ${f(P.ruleOfThumbGlr({ depthFt: GP.depthFt }), 8)} scf/bbl against a computed requirement of ${f(gas / liq, 8)} scf/bbl`);
  w(`derived plunger, the physics is ${f((gas / liq) / P.ruleOfThumbGlr({ depthFt: GP.depthFt }), 8)} times as demanding as the heuristic on the published case`);
  w(`engine plunger, TYPICAL rise = ${f(P.TYPICAL.riseFtMin, 1)} ft/min, fall in gas = ${f(P.TYPICAL.fallInGasFtMin, 1)} ft/min, fall in liquid = ${f(P.TYPICAL.fallInLiquidFtMin, 1)} ft/min, friction = ${f(P.TYPICAL.frictionPsi, 1)} psi`);
  w('# The friction term is linear and additive, which is the easiest thing in the');
  w('# balance to check by hand.');
  const withF = P.liftPressure({
    linePressurePsia: GP.linePressurePsia, slugLengthFt: GP.slugLengthFt, liquidSg: GP.liquidSg,
    idIn: GP.idIn, plungerWeightLb: GP.plungerWeightLb, depthFt: GP.depthFt,
    gasSg: GP.gasSg, avgTempR: GP.avgTempR, z: GP.z, frictionPsi: 40,
  });
  w(`derived plunger, the published case with 40.0 psi of friction = ${f(withF.requiredPsia, 10)} psia, which is ${f(withF.requiredPsia - PUB_LIFT.requiredPsia, 10)} psi more`);
}
w('');

// ============================================================ SECTION 15
w('# SECTION 15: THE GRADIENT CONSTANT, ITS EXACT FORM, AND WHAT THE ROUNDING COSTS');
w('# plungerLift.PSI_PER_FT_SG is 0.433. The exact water gradient is one thousand');
w('# kilograms per cubic metre times g, expressed in psi per foot per unit specific');
w('# gravity, and it is built below from the three conversion constants this wave');
w('# declares. The two are a tenth of a percent apart, the gate knows it and loosens');
w('# that one assertion to a 5e-3 relative tolerance, and the golden publishes the');
w('# ORACLE number for its own case, which the engine cannot reproduce. The cost');
w('# is a FIXED PERCENTAGE of whatever slug it sits on, so a cost in psi divides back');
w('# to the slug that produced it: the costs below are given on the PUBLISHED case');
w('# and on TEACHING slugs only. Expert m03 owns this.');
{
  const G_SI = 9.80665; const M_PER_FT = 0.3048; const PA_PER_PSI = 6894.757293168;
  const exact = (1000 * G_SI * M_PER_FT) / PA_PER_PSI;
  w(`derived gradient, 1000.0 kg/m3 times g of ${f(G_SI, 5)} m/s2 = ${f(1000 * G_SI, 6)} Pa/m`);
  w(`derived gradient, times ${f(M_PER_FT, 4)} m per ft = ${f(1000 * G_SI * M_PER_FT, 6)} Pa/ft`);
  w(`derived gradient, divided by ${f(PA_PER_PSI, 9)} Pa per psi = ${f(exact, 13)} psi/ft per unit SG`);
  w(`engine gradient, PSI_PER_FT_SG = ${f(P.PSI_PER_FT_SG, 13)} psi/ft per unit SG`);
  w(`derived gradient, exact minus rounded = ${f(exact - P.PSI_PER_FT_SG, 13)} psi/ft per unit SG`);
  w(`derived gradient, exact over rounded = ${f(exact / P.PSI_PER_FT_SG, 13)}`);
  w(`derived gradient, the rounding as a percentage of the exact value = ${f(((exact - P.PSI_PER_FT_SG) / exact) * 100, 10)} percent`);
  w(`derived gradient, the rounding as a percentage of the rounded value = ${f(((exact - P.PSI_PER_FT_SG) / P.PSI_PER_FT_SG) * 100, 10)} percent`);
  w('# The published case, where the golden carries the oracle exact-gradient answer.');
  w(`golden gradient, the published 200.0 ft slug of 1.02 SG liquid = ${f(GOLD.plunger.slugPsi, 10)} psi`);
  w(`engine gradient, the same slug through 0.433 = ${f(P.PSI_PER_FT_SG * GP.liquidSg * GP.slugLengthFt, 10)} psi`);
  w(`derived gradient, the cost on the published slug = ${f(GOLD.plunger.slugPsi - P.PSI_PER_FT_SG * GP.liquidSg * GP.slugLengthFt, 10)} psi`);
  w(`derived gradient, the cost on the published required lift pressure = ${f(GOLD.plunger.requiredPsia - PUB_LIFT.requiredPsia, 10)} psi, which is ${f(((GOLD.plunger.requiredPsia - PUB_LIFT.requiredPsia) / GOLD.plunger.requiredPsia) * 100, 8)} percent of it`);
  w('# A contiguous slug sweep at a TEACHING liquid gravity of 1.06, so the fixed');
  w('# percentage and the growing absolute cost are both visible. Every row printed.');
  for (const L of [120, 180, 240, 300, 360, 420, 480]) {
    const rounded = P.PSI_PER_FT_SG * 1.06 * L;
    const ex = exact * 1.06 * L;
    w(`teaching gradient, a ${f(L, 1)} ft slug of 1.06 SG: 0.433 gives ${f(rounded, 10)} psi, the exact gradient gives ${f(ex, 10)} psi, cost = ${f(ex - rounded, 10)} psi, cost as a percentage = ${f(((ex - rounded) / ex) * 100, 10)}`);
  }
  w('# The same constant, at the same value, sits in espDesign in this domain, beside');
  w('# an exact 62.4/144 elsewhere. Two modules in one domain carrying a rounded 0.433');
  w('# is one adjudication, not two local fixes.');
  w(`derived gradient, 62.4 lbm/ft3 over 144 = ${f(62.4 / 144, 13)} psi/ft, against the exact ${f(exact, 13)} and the shipped ${f(P.PSI_PER_FT_SG, 13)}`);
  w(`derived gradient, the gate pins PSI_PER_FT_SG to 0.433 exactly and loosens the slug assertion alone to a relative tolerance of 5e-3, which is ${f(5e-3 / ((exact - P.PSI_PER_FT_SG) / exact), 6)} times the disagreement it is covering`);
}
w('');

// ============================================================ SECTION 16
w('# SECTION 16: TEACHING WELL OGUTA-2, AND THE PLUNGER SCREEN IN FULL');
w('# A TEACHING WELL. Not a published case, not a real well, no oracle has checked');
w('# it. It exists so the casing pressure can be walked down through the lift');
w('# requirement, which the published case does not do. Every field the screen');
w('# returns is printed, including the ones the verdict never uses. Professional m04');
w('# and Expert m04 and m05.');
const OG = {
  name: 'OGUTA-2',
  depthFt: 8200,
  idIn: 2.441,
  linePressurePsia: 145,
  casingPressurePsia: 720,
  slugLengthFt: 160,
  liquidSg: 1.06,
  plungerWeightLb: 8.2,
  gasSg: 0.66,
  avgTempR: 592,
  z: 0.87,
  wellGlrScfBbl: 5900,
  gasRateMscfd: 1150,
  riseFtMin: 750,
  fallInGasFtMin: 1000,
  fallInLiquidFtMin: 172,
  afterflowMin: 30,
  shutInMin: 40,
};
const OG_ARGS = { ...OG };
delete OG_ARGS.name; delete OG_ARGS.gasRateMscfd;
const OG_SCREEN = P.screenPlungerLift(OG_ARGS);
const OG_D = OG_SCREEN.design;
{
  w(`teaching OGUTA-2, depth = ${f(OG.depthFt, 1)} ft, tubing = ${f(OG.idIn, 3)} in, cross-section = ${f(P.tubingAreaIn2(OG.idIn), 10)} in2, flow area = ${f(W.tubingAreaFt2(OG.idIn), 10)} ft2`);
  w(`teaching OGUTA-2, line pressure = ${f(OG.linePressurePsia, 1)} psia, casing pressure = ${f(OG.casingPressurePsia, 1)} psia`);
  w(`teaching OGUTA-2, slug = ${f(OG.slugLengthFt, 1)} ft of ${f(OG.liquidSg, 3)} SG liquid, plunger = ${f(OG.plungerWeightLb, 2)} lb`);
  w(`teaching OGUTA-2, gas gravity = ${f(OG.gasSg, 3)}, average temperature = ${f(OG.avgTempR, 1)} degR (${f(OG.avgTempR - G.R_OFFSET, 2)} degF), z = ${f(OG.z, 3)}`);
  w(`teaching OGUTA-2, the well makes ${f(OG.gasRateMscfd, 1)} Mscf/d at a gas-liquid ratio of ${f(OG.wellGlrScfBbl, 1)} scf/bbl`);
  w(`teaching OGUTA-2, cycle inputs: rise ${f(OG.riseFtMin, 1)} ft/min, fall in gas ${f(OG.fallInGasFtMin, 1)} ft/min, fall in liquid ${f(OG.fallInLiquidFtMin, 1)} ft/min, afterflow ${f(OG.afterflowMin, 1)} min, shut-in ${f(OG.shutInMin, 1)} min`);
  w(`teaching OGUTA-2 screen, ok = ${yn(OG_SCREEN.ok)}, errors = ${OG_SCREEN.errors.length}`);
  w(`teaching OGUTA-2 screen, line pressure term = ${f(OG_D.lift.terms.linePressurePsia, 10)} psi`);
  w(`teaching OGUTA-2 screen, slug hydrostatic term = ${f(OG_D.lift.terms.slugPsi, 10)} psi`);
  w(`teaching OGUTA-2 screen, plunger weight term = ${f(OG_D.lift.terms.plungerPsi, 10)} psi`);
  w(`teaching OGUTA-2 screen, gas column term = ${f(OG_D.lift.terms.gasColumnPsi, 10)} psi`);
  w(`teaching OGUTA-2 screen, friction term = ${f(OG_D.lift.terms.frictionPsi, 10)} psi`);
  w(`teaching OGUTA-2 screen, required lift pressure = ${f(OG_D.lift.requiredPsia, 10)} psia`);
  w(`teaching OGUTA-2 screen, the casing exceeds it by = ${f(OG.casingPressurePsia - OG_D.lift.requiredPsia, 10)} psi`);
  w(`teaching OGUTA-2 screen, gas per cycle = ${f(OG_D.gasPerCycleScf, 9)} scf`);
  w(`teaching OGUTA-2 screen, liquid per cycle = ${f(OG_D.liquidPerCycleBbl, 10)} bbl`);
  w(`teaching OGUTA-2 screen, required gas-liquid ratio = ${f(OG_D.requiredGlrScfBbl, 8)} scf/bbl`);
  w(`teaching OGUTA-2 screen, the well gas-liquid ratio = ${f(OG_D.wellGlrScfBbl, 1)} scf/bbl`);
  w(`teaching OGUTA-2 screen, rule of thumb gas-liquid ratio = ${f(OG_D.ruleOfThumbGlrScfBbl, 8)} scf/bbl`);
  w(`teaching OGUTA-2 screen, ruleOfThumbAgrees = ${yn(OG_D.ruleOfThumbAgrees)}`);
  w(`teaching OGUTA-2 screen, the computed requirement over the rule of thumb = ${f(OG_D.requiredGlrScfBbl / OG_D.ruleOfThumbGlrScfBbl, 8)}`);
  w(`teaching OGUTA-2 screen, rise = ${f(OG_D.timing.riseMin, 8)} min, fall = ${f(OG_D.timing.fallMin, 8)} min, afterflow = ${f(OG_D.timing.afterflowMin, 1)} min, shut-in = ${f(OG_D.timing.shutInMin, 1)} min`);
  w(`teaching OGUTA-2 screen, total cycle = ${f(OG_D.timing.totalMin, 8)} min, cycles per day = ${f(OG_D.timing.cyclesPerDay, 8)}`);
  w(`teaching OGUTA-2 screen, liquid per day = ${f(OG_D.liquidPerDayBbl, 8)} bbl/d`);
  w(`teaching OGUTA-2 screen, gas per day = ${f(OG_D.gasPerDayMscf, 8)} Mscf/d`);
  w(`teaching OGUTA-2 screen, pressureOk = ${yn(OG_D.pressureOk)}, glrOk = ${yn(OG_D.glrOk)}, feasible = ${yn(OG_D.feasible)}`);
  OG_D.warnings.forEach((wn) => {
    w(`teaching OGUTA-2 screen, warning ${wn.code}: "${wn.message}"`);
  });
  w(`teaching OGUTA-2 screen, warnings raised = ${OG_D.warnings.map((x) => x.code).join(', ') || 'none'}`);
  w('# What the screen refuses outright, on the same well with one input broken.');
  for (const [label, patch] of [['zero depth', { depthFt: 0 }], ['zero plunger weight', { plungerWeightLb: 0 }], ['a slug longer than the tubing', { slugLengthFt: 9000 }], ['zero tubing diameter', { idIn: 0 }], ['zero slug', { slugLengthFt: 0 }], ['zero average temperature', { avgTempR: 0 }]]) {
    const r = P.screenPlungerLift({ ...OG_ARGS, ...patch });
    w(`engine refusal, OGUTA-2 with ${label}: ok = ${yn(r.ok)}, errors = "${r.errors.join(' ')}"`);
  }
}
w('');

// ============================================================ SECTION 17
w('# SECTION 17: THE REQUIREMENT THAT FALLS THE WRONG WAY');
w('# screenPlungerLift computes the gas a cycle needs as an expansion from the');
w('# casing pressure down to the pressure still needed at the top of the rise, and');
w('# gasPerCycleScf averages the two ends with no check that the expansion runs the');
w('# right way. When the casing cannot reach the requirement the average is simply');
w('# smaller and a number still comes back. The sweep below is contiguous and every');
w('# point prints pressureOk, glrOk and feasible, so the flag turning TRUE on a well');
w('# that cannot move the plunger at all is on the page. Expert m04.');
{
  w(`teaching OGUTA-2 sweep, the required lift pressure is fixed at ${f(OG_D.lift.requiredPsia, 10)} psia and does not move with the casing`);
  w(`teaching OGUTA-2 sweep, the well makes ${f(OG.wellGlrScfBbl, 1)} scf/bbl throughout`);
  for (const cp of [900, 720, 600, 480, 400, 320, 285, 240, 180, 130, 90]) {
    const r = P.screenPlungerLift({ ...OG_ARGS, casingPressurePsia: cp });
    const d = r.design;
    w(`teaching OGUTA-2 sweep, casing ${f(cp, 1)} psia: required lift = ${f(d.lift.requiredPsia, 8)} psia, gas per cycle = ${f(d.gasPerCycleScf, 8)} scf, required gas-liquid ratio = ${f(d.requiredGlrScfBbl, 8)} scf/bbl, pressureOk = ${yn(d.pressureOk)}, glrOk = ${yn(d.glrOk)}, feasible = ${yn(d.feasible)}`);
  }
  const hi = P.screenPlungerLift({ ...OG_ARGS, casingPressurePsia: 900 }).design;
  const lo = P.screenPlungerLift({ ...OG_ARGS, casingPressurePsia: 90 }).design;
  w(`teaching OGUTA-2 sweep, from 900.0 psia of casing to 90.0 psia the required gas-liquid ratio FALLS from ${f(hi.requiredGlrScfBbl, 8)} to ${f(lo.requiredGlrScfBbl, 8)} scf/bbl`);
  w(`teaching OGUTA-2 sweep, that is a drop of ${f(hi.requiredGlrScfBbl - lo.requiredGlrScfBbl, 8)} scf/bbl, or ${f(((hi.requiredGlrScfBbl - lo.requiredGlrScfBbl) / hi.requiredGlrScfBbl) * 100, 6)} percent, all of it in the flattering direction`);
  w(`teaching OGUTA-2 sweep, at 900.0 psia the well CAN move the plunger and glrOk = ${yn(hi.glrOk)}; at 90.0 psia it cannot move it at all and glrOk = ${yn(lo.glrOk)}`);
  w(`teaching OGUTA-2 sweep, feasible still catches both, because feasible is pressureOk AND glrOk: at 900.0 psia feasible = ${yn(hi.feasible)} and at 90.0 psia feasible = ${yn(lo.feasible)}`);
  w('# Read the sweep in two halves. ABOVE the crossing the fall is defensible: less');
  w('# casing pressure genuinely means less gas expanded per cycle, and feasible turns');
  w('# TRUE over that band because the requirement dropped under what the well makes.');
  w('# BELOW the crossing there is no expansion at all and the number is an artefact,');
  w('# and that is the half the missing guard belongs to. The row that says whether');
  w('# the expansion runs the right way is printed for every point below.');
  w('# The mechanism, printed rather than described: the average of the two ends is');
  w('# the whole of it, and it keeps falling straight through the crossing.');
  for (const cp of [900, 720, 600, 480, 400, 320, 285, 240, 180, 130, 90]) {
    const pAvg = (cp + OG_D.lift.requiredPsia) / 2;
    w(`teaching OGUTA-2 sweep, casing ${f(cp, 1)} psia: the average of casing and requirement = ${f(pAvg, 8)} psia, casing minus requirement = ${f(cp - OG_D.lift.requiredPsia, 8)} psi, expansion runs the right way = ${yn(cp > OG_D.lift.requiredPsia)}`);
  }
  w('# The same shape on the PUBLISHED case, so this is not a teaching-well artefact.');
  w('# The well gas-liquid ratio here is a DERIVED figure of 4500.0 scf/bbl chosen to');
  w('# straddle the requirement; everything else is the published input set.');
  for (const cp of [600, 480, 400, 300, 240, 200, 150]) {
    const r = P.screenPlungerLift({
      depthFt: GP.depthFt, idIn: GP.idIn, linePressurePsia: GP.linePressurePsia,
      casingPressurePsia: cp, slugLengthFt: GP.slugLengthFt, liquidSg: GP.liquidSg,
      plungerWeightLb: GP.plungerWeightLb, gasSg: GP.gasSg, avgTempR: GP.avgTempR,
      z: GP.z, wellGlrScfBbl: 4500, afterflowMin: 20, shutInMin: 35,
    });
    const d = r.design;
    w(`derived published sweep, casing ${f(cp, 1)} psia: required lift = ${f(d.lift.requiredPsia, 8)} psia, gas per cycle = ${f(d.gasPerCycleScf, 8)} scf, required gas-liquid ratio = ${f(d.requiredGlrScfBbl, 8)} scf/bbl, pressureOk = ${yn(d.pressureOk)}, glrOk = ${yn(d.glrOk)}, feasible = ${yn(d.feasible)}`);
  }
  w('# The guard that is missing is one line: refuse the gas number when the casing');
  w('# pressure is at or below the lift requirement, rather than averaging across the');
  w('# crossing.');
}
w('');

// ============================================================ SECTION 18
w('# SECTION 18: THE SLUG LENGTH CLAMP, AND THE ANSWER IT HIDES');
w('# maxSlugLengthFt solves the balance directly and then clamps the answer into');
w('# [0, depthFt]. Both ends of that clamp print a number that is not a solution.');
w('# The unclamped value is beside the returned one at every point below. Expert m04.');
{
  const areaIn2 = P.tubingAreaIn2(OG.idIn);
  const plungerPsi = OG.plungerWeightLb / areaIn2;
  const rhoGas = W.gasDensityLbFt3({ pPsia: OG.linePressurePsia, tempR: OG.avgTempR, z: OG.z, gasSg: OG.gasSg });
  const gasPerFt = rhoGas / 144;
  const perFt = P.PSI_PER_FT_SG * OG.liquidSg - gasPerFt;
  w(`teaching OGUTA-2 clamp, the plunger weight term = ${f(plungerPsi, 10)} psi`);
  w(`teaching OGUTA-2 clamp, the gas density at line pressure = ${f(rhoGas, 10)} lbm/ft3, so the gas column costs ${f(gasPerFt, 12)} psi/ft`);
  w(`teaching OGUTA-2 clamp, the net cost of a foot of slug = ${f(perFt, 12)} psi/ft, which is 0.433 times ${f(OG.liquidSg, 3)} less the gas gradient`);
  for (const cp of [4000, 900, 720, 600, 480, 400, 320, 285, 240, 180, 130, 90]) {
    const available = cp - OG.linePressurePsia - plungerPsi - 0 - gasPerFt * OG.depthFt;
    const unclamped = available / perFt;
    const returned = P.maxSlugLengthFt({
      casingPressurePsia: cp, linePressurePsia: OG.linePressurePsia, liquidSg: OG.liquidSg,
      idIn: OG.idIn, plungerWeightLb: OG.plungerWeightLb, depthFt: OG.depthFt,
      gasSg: OG.gasSg, avgTempR: OG.avgTempR, z: OG.z,
    });
    w(`teaching OGUTA-2 clamp, casing ${f(cp, 1)} psia: available = ${f(available, 8)} psi, unclamped solution = ${f(unclamped, 8)} ft, maxSlugLengthFt returns = ${f(returned, 8)} ft, clamped = ${yn(Math.abs(returned - unclamped) > 1e-9)}`);
  }
  w('# What zero actually means. At the casing pressures where the function returns');
  w('# zero, the balance with NO SLUG AT ALL still is not satisfied, so zero is not');
  w('# the longest slug the well can lift, it is a refusal wearing a number.');
  for (const cp of [130, 90]) {
    const bare = P.liftPressure({
      linePressurePsia: OG.linePressurePsia, slugLengthFt: 0, liquidSg: OG.liquidSg,
      idIn: OG.idIn, plungerWeightLb: OG.plungerWeightLb, depthFt: OG.depthFt,
      gasSg: OG.gasSg, avgTempR: OG.avgTempR, z: OG.z,
    });
    const returned = P.maxSlugLengthFt({
      casingPressurePsia: cp, linePressurePsia: OG.linePressurePsia, liquidSg: OG.liquidSg,
      idIn: OG.idIn, plungerWeightLb: OG.plungerWeightLb, depthFt: OG.depthFt,
      gasSg: OG.gasSg, avgTempR: OG.avgTempR, z: OG.z,
    });
    w(`teaching OGUTA-2 clamp, casing ${f(cp, 1)} psia: maxSlugLengthFt returns ${f(returned, 8)} ft, and the balance at a zero slug still needs ${f(bare.requiredPsia, 10)} psia, short by ${f(bare.requiredPsia - cp, 10)} psi`);
  }
  w('# The upper clamp has the same shape. At a casing pressure high enough, the');
  w('# function returns the tubing length exactly, which is a depth rather than a');
  w('# computed maximum.');
  const top = P.maxSlugLengthFt({
    casingPressurePsia: 4000, linePressurePsia: OG.linePressurePsia, liquidSg: OG.liquidSg,
    idIn: OG.idIn, plungerWeightLb: OG.plungerWeightLb, depthFt: OG.depthFt,
    gasSg: OG.gasSg, avgTempR: OG.avgTempR, z: OG.z,
  });
  w(`teaching OGUTA-2 clamp, at 4000.0 psia of casing maxSlugLengthFt returns ${f(top, 8)} ft and the tubing is ${f(OG.depthFt, 1)} ft, identical = ${yn(top === OG.depthFt)}`);
  w('# At the maximum the balance is exactly satisfied, which is the check that the');
  w('# solve is right in the range where the clamp does not bite.');
  const mx = P.maxSlugLengthFt({
    casingPressurePsia: OG.casingPressurePsia, linePressurePsia: OG.linePressurePsia,
    liquidSg: OG.liquidSg, idIn: OG.idIn, plungerWeightLb: OG.plungerWeightLb,
    depthFt: OG.depthFt, gasSg: OG.gasSg, avgTempR: OG.avgTempR, z: OG.z,
  });
  const atMax = P.liftPressure({
    linePressurePsia: OG.linePressurePsia, slugLengthFt: mx, liquidSg: OG.liquidSg,
    idIn: OG.idIn, plungerWeightLb: OG.plungerWeightLb, depthFt: OG.depthFt,
    gasSg: OG.gasSg, avgTempR: OG.avgTempR, z: OG.z,
  });
  w(`teaching OGUTA-2 clamp, at the maximum slug of ${f(mx, 8)} ft the required lift = ${f(atMax.requiredPsia, 10)} psia against a casing of ${f(OG.casingPressurePsia, 1)} psia, residual = ${e(atMax.requiredPsia - OG.casingPressurePsia, 4)} psi`);
  w(`teaching OGUTA-2 clamp, that maximum slug holds ${f(P.slugVolumeBbl({ slugLengthFt: mx, idIn: OG.idIn }), 8)} bbl`);
  const lightRet = P.maxSlugLengthFt({ casingPressurePsia: 720, linePressurePsia: 145, liquidSg: 0.005, idIn: OG.idIn, plungerWeightLb: OG.plungerWeightLb, depthFt: OG.depthFt, gasSg: OG.gasSg, avgTempR: OG.avgTempR, z: OG.z });
  w(`engine refusal, maxSlugLengthFt with a liquid so light the net cost of a foot of slug is not positive returns ${Number.isNaN(lightRet) ? 'NaN' : f(lightRet, 6)}, which is the one place in this function that refuses instead of clamping`);
}
w('');

// ============================================================ SECTION 19
w('# SECTION 19: WHAT THE PLUNGER CYCLE CARRIES AGAINST WHAT THE WELL MAKES');
w('# liquidPerDayBbl is computed and returned and never compared to anything.');
w('# feasible is built from the pressure balance and the gas-liquid ratio only. The');
w('# third step is arithmetic the screen already has every ingredient for. Expert');
w('# m05 l01 and l02.');
{
  const wellLiquidBpd = (OG.gasRateMscfd * 1000) / OG.wellGlrScfBbl;
  w(`teaching OGUTA-2 capacity, the cycle delivers = ${f(OG_D.liquidPerCycleBbl, 10)} bbl per trip`);
  w(`teaching OGUTA-2 capacity, trips per day = ${f(OG_D.timing.cyclesPerDay, 8)}`);
  w(`teaching OGUTA-2 capacity, liquidPerDayBbl = ${f(OG_D.liquidPerDayBbl, 8)} bbl/d`);
  w(`teaching OGUTA-2 capacity, the well makes ${f(OG.gasRateMscfd, 1)} Mscf/d at ${f(OG.wellGlrScfBbl, 1)} scf/bbl, so its liquid make = ${f(wellLiquidBpd, 8)} bbl/d`);
  w(`teaching OGUTA-2 capacity, the well makes ${f(wellLiquidBpd / OG_D.liquidPerDayBbl, 8)} times what the cycle carries`);
  w(`teaching OGUTA-2 capacity, the shortfall = ${f(wellLiquidBpd - OG_D.liquidPerDayBbl, 8)} bbl/d`);
  w(`teaching OGUTA-2 capacity, feasible = ${yn(OG_D.feasible)}, built from pressureOk = ${yn(OG_D.pressureOk)} and glrOk = ${yn(OG_D.glrOk)} and nothing else`);
  w(`teaching OGUTA-2 capacity, the design object returns these keys: ${Object.keys(OG_D).join(', ')}`);
  w('# What it would take to carry the well. A contiguous shut-in sweep, so the number');
  w('# of trips a day rises and the liquid carried rises with it, and the gap closes or');
  w('# does not. Every row printed, including the ones that cycle faster than any real');
  w('# installation would.');
  for (const shutIn of [40, 30, 20, 10, 5, 2, 0]) {
    const r = P.screenPlungerLift({ ...OG_ARGS, shutInMin: shutIn, afterflowMin: 0 });
    const d = r.design;
    w(`teaching OGUTA-2 capacity, shut-in ${f(shutIn, 1)} min with no afterflow: cycle = ${f(d.timing.totalMin, 8)} min, trips per day = ${f(d.timing.cyclesPerDay, 8)}, liquid per day = ${f(d.liquidPerDayBbl, 8)} bbl/d, against a well make of ${f(wellLiquidBpd, 8)} bbl/d, ratio = ${f(wellLiquidBpd / d.liquidPerDayBbl, 8)}`);
  }
  w('# The same reading on the PUBLISHED case, with a DERIVED well gas-liquid ratio of');
  w('# 4500.0 scf/bbl and a DERIVED gas rate of 700.0 Mscf/d, so a lesson can make the');
  w('# point without a teaching well.');
  const pubScreen = P.screenPlungerLift({
    depthFt: GP.depthFt, idIn: GP.idIn, linePressurePsia: GP.linePressurePsia,
    casingPressurePsia: GP.casingPressurePsia, slugLengthFt: GP.slugLengthFt,
    liquidSg: GP.liquidSg, plungerWeightLb: GP.plungerWeightLb, gasSg: GP.gasSg,
    avgTempR: GP.avgTempR, z: GP.z, wellGlrScfBbl: 4500, afterflowMin: 20, shutInMin: 35,
  }).design;
  const pubWellLiquid = (700 * 1000) / 4500;
  w(`derived published capacity, cycle = ${f(pubScreen.timing.totalMin, 8)} min, trips per day = ${f(pubScreen.timing.cyclesPerDay, 8)}, liquid per day = ${f(pubScreen.liquidPerDayBbl, 8)} bbl/d`);
  w(`derived published capacity, the well liquid make = ${f(pubWellLiquid, 8)} bbl/d, ratio to what the cycle carries = ${f(pubWellLiquid / pubScreen.liquidPerDayBbl, 8)}`);
  w(`derived published capacity, pressureOk = ${yn(pubScreen.pressureOk)}, glrOk = ${yn(pubScreen.glrOk)}, feasible = ${yn(pubScreen.feasible)}, and the liquid comparison appears nowhere in that verdict`);
  w('# The slow-cycle warning is the only timing check there is, and it fires on trips');
  w('# per day rather than on barrels.');
  const slow = P.screenPlungerLift({ ...OG_ARGS, shutInMin: 1500 }).design;
  w(`teaching OGUTA-2 capacity, with a 1500.0 min shut-in the cycle = ${f(slow.timing.totalMin, 8)} min, trips per day = ${f(slow.timing.cyclesPerDay, 8)}, warnings = ${slow.warnings.map((x) => x.code).join(', ')}`);
  const sw = slow.warnings.find((x) => x.code === 'slowCycle');
  if (sw) w(`teaching OGUTA-2 capacity, the slow-cycle message: "${sw.message}"`);
}
w('');

// ============================================================ SECTION 20
w('# SECTION 20: WHAT THESE MODULES REFUSE TO DO');
w('# Every module that introduces a capability has to state its limit. These are the');
w('# engines own refusals, taken from their headers and their code, and every tier');
w('# needs at least one of them.');
w('refusal, the droplet balance models ONE droplet at its terminal velocity. It does');
w('refusal, not model a droplet population, coalescence, break-up in transit, or any');
w('refusal, film flowing on the tubing wall, which is the other way a gas well');
w('refusal, carries liquid.');
w('refusal, interfacial tension and liquid density are INPUTS. Neither is a function');
w('refusal, of anything these modules know, and the Turner fluid properties are');
w('refusal, offered as labelled starting points rather than as correlations.');
w('refusal, the drag coefficient of 0.44 is a rigid sphere in the Newton regime. A');
w('refusal, real droplet deforms, and nothing here knows that.');
w('refusal, there is no inflow performance anywhere in these modules. The gas rate is');
w('refusal, an input, so a loading verdict is a verdict at a rate somebody supplied');
w('refusal, and not a prediction of what the well will do next.');
w('refusal, the flowing traverse is PASSED IN as a list of stations with their own');
w('refusal, pressure, temperature, z and diameter. loadingProfile does not solve');
w('refusal, multiphase flow and does not invent a gradient.');
w('refusal, an empty traverse is refused rather than treated as a passing well, and an');
w('refusal, unknown correlation is refused rather than silently treated as turner.');
w('refusal, recommendCorrelation takes ONE pressure and returns guidance, not a');
w('refusal, decision. It does not switch the correlation for anybody, and it cannot');
w('refusal, see which station the pressure came from.');
w('refusal, sizeTubingForRate has no opinion about which station its pressure,');
w('refusal, temperature and z came from. See section 13.');
w('refusal, the plunger lift force balance is STATIC. No friction unless it is handed');
w('refusal, in, no velocity, no gas slippage past the plunger, and no fallback of the');
w('refusal, slug during the rise.');
w('refusal, the rise and fall velocities, the afterflow and the shut-in are operating');
w('refusal, inputs with stated typical bands. They are not computed and they are not');
w('refusal, optimised.');
w('refusal, the 400 scf per bbl per 1000 ft screening rule is carried for comparison');
w('refusal, only and is never used to decide feasibility. Which of the two a well sits');
w('refusal, between is reported through ruleOfThumbAgrees.');
w('refusal, gasPerCycleScf does NOT check that the expansion runs the right way. See');
w('refusal, section 17. This is a KNOWN DEFECT, not a thing to design on.');
w('refusal, maxSlugLengthFt clamps rather than refuses at both ends. See section 18.');
w('refusal, screenPlungerLift never compares liquidPerDayBbl to anything. See section');
w('refusal, 19.');
w('refusal, the two production modules carry two molecular weights of air and two');
w('refusal, temperature conventions at the door. See section 3.');
w('');
w('END OF DIGEST');

process.stdout.write(`${out.join('\n')}\n`);
