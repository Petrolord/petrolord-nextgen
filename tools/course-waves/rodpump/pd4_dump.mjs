// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES OF rodpump_cases.json (plus sweeps
// around those published inputs, and one clearly labelled TEACHING WELL this wave
// designed for itself). THE PD4 CAPSTONE RUNS DIFFERENT CONDITIONS ENTIRELY:
// nothing here imports, reads or reproduces pd4_fields.mjs, fields.json, or any
// capstone string, taper, depth, fluid gravity, unit, stroke, plunger, pressure,
// speed, damping ratio or fillage. The teaching digest and the capstone are two
// files with opposite audiences and they never share a number.
//
// Usage:  node /root/pd-wip-rodpump/pd4_dump.mjs > /root/pd-wip-rodpump/digest.txt
//
// Engines:  packages/engines/engines/production/rodString.js
//           packages/engines/engines/production/rodDynamics.js
//           packages/engines/engines/production/pumpingUnit.js
//           packages/engines/engines/production/rodPumpDesign.js
//           packages/engines/engines/production/data/rodCatalog.js
// Goldens:  packages/engines/test-data/production/goldens/rodpump_cases.json
// Oracle:   tools/validation/production/oracle_rodpump.py

import fs from 'fs';

const ROOT = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const ENG = `${ROOT}/engines/production/`;
const RS = await import(`${ENG}rodString.js`);
const RD = await import(`${ENG}rodDynamics.js`);
const PU = await import(`${ENG}pumpingUnit.js`);
const RP = await import(`${ENG}rodPumpDesign.js`);
const RC = await import(`${ENG}data/rodCatalog.js`);
const GOLD = JSON.parse(fs.readFileSync(
  `${ROOT}/test-data/production/goldens/rodpump_cases.json`, 'utf8'));

const out = [];
const w = (s) => out.push(s);
const f = (x, n = 6) => (x === null || x === undefined || Number.isNaN(x))
  ? 'n/a' : Number(x).toFixed(n);
const e = (x, n = 4) => (x === null || x === undefined) ? 'n/a' : Number(x).toExponential(n);
const codes = (arr) => (arr && arr.length) ? arr.map((x) => x.code).join(', ') : 'none';

// ---------------------------------------------------------------- fixtures
// PUBLISHED. The two strings the oracle committed, at the oracle's own fluid
// gravity of 1.00.
const uniStr = RS.buildRodString({ sections: [{ size: '7/8', lengthFt: 6000 }], fluidSg: 1.0, gradeId: 'D' });
const tapStr = RS.buildRodString({
  sections: [{ size: '7/8', lengthFt: 3000 }, { size: '3/4', lengthFt: 2000 }],
  fluidSg: 1.0, gradeId: 'D',
});
const uniFrq = RS.naturalFrequency({ string: uniStr });
const tapFrq = RS.naturalFrequency({ string: tapStr });

// PUBLISHED. The oracle's four-bar linkage, dimension for dimension.
const GEOM = PU.conventionalGeometry(GOLD.unit.geometry);
const KIN = PU.unitKinematics(GEOM, { steps: 360 });
const SURF = PU.surfacePositionFn(KIN);
const S_IN = KIN.strokeIn;

// PUBLISHED. The predictive case the oracle committed: the taper string driven
// by pure simple harmonic motion over a 64 in stroke against a 5000 lb fluid
// load at a damping ratio of 0.10, a full barrel, at 5 and at 9 spm.
const P_STROKE_IN = GOLD.predict.strokeIn;
const P_FO = GOLD.predict.fluidLoadLb;
const P_ZETA = GOLD.predict.dampingRatio;
const P_SHM = PU.simpleHarmonicPosition(P_STROKE_IN / 12);
const pubPredict = (spm, o = {}) => RD.predictCard({
  string: tapStr, surfacePosition: P_SHM, strokeFt: P_STROKE_IN / 12, spm,
  fluidLoadLb: P_FO, fillage: 1, dampingRatio: P_ZETA, ...o,
});

// TEACHING. ODUMA-4, a well this wave invented so every Expert result has a
// case a lesson may quote. It is NOT a real well and NOT a published case.
const T_SEC = [{ size: '1', lengthFt: 1500 }, { size: '7/8', lengthFt: 1600 }, { size: '3/4', lengthFt: 1700 }];
const T_SG = 0.90;
const T_GRADE = 'D';
const T_PD = 1.75;
const T_PDIS = 2100;
const T_PINT = 150;
const T_SPM = 10;
const T_ZETA = 0.12;
const T_FILL = 0.90;
const teaStr = RS.buildRodString({ sections: T_SEC, fluidSg: T_SG, gradeId: T_GRADE });
const teaFrq = RS.naturalFrequency({ string: teaStr });
const T_FO = RP.fluidLoadLb({ plungerDIn: T_PD, pDischargePsi: T_PDIS, pIntakePsi: T_PINT });
const teaCard = (o = {}) => RD.predictCard({
  string: teaStr, surfacePosition: SURF, strokeFt: S_IN / 12, spm: T_SPM,
  fluidLoadLb: T_FO, fillage: T_FILL, dampingRatio: T_ZETA, ...o,
});
const teaDesign = (o = {}) => RP.runRodPumpDesign({
  string: teaStr, frequency: teaFrq, surfacePosition: SURF, strokeIn: S_IN, spm: T_SPM,
  plungerDIn: T_PD, pDischargePsi: T_PDIS, pIntakePsi: T_PINT,
  fillage: T_FILL, pumpEfficiency: 1, dampingRatio: T_ZETA, serviceFactor: 1.0, ...o,
});
const cardLoadFn = (card) => (tFrac) => {
  const nC = card.length;
  const x = ((((tFrac % 1) + 1) % 1)) * nC;
  const i = Math.floor(x);
  const fr = x - i;
  const a = card[i % nC].loadLb;
  const b = card[(i + 1) % nC].loadLb;
  return a + (b - a) * fr;
};

// A SECOND, INDEPENDENT ROUTE TO THE STEPPED-BAR EIGENVALUES, written here and
// not taken from the engine's scan. Same transfer matrix statement, but walked
// on a uniform two-million point grid from zero so no root can be stepped over,
// and every sign change is closed by bisection. It is used ONLY to report the
// first three modes and to say whether the engine's own scan found the first.
const E_PSI = RC.ROD_ELASTIC_MODULUS_PSI;
const endForce = (string, omega) => {
  let u = 0; let fo = 1;
  for (const s of string.sections) {
    const k = omega / RS.sectionWaveSpeedFtS(s);
    const kl = k * s.lengthFt;
    const z = ((E_PSI * s.areaIn2) / 12) * k;
    const c = Math.cos(kl); const sn = Math.sin(kl);
    const un = c * u + (z > 0 ? (sn / z) * fo : 0);
    const fn = -z * sn * u + c * fo;
    u = un; fo = fn;
  }
  return fo;
};
const modeSpm = (string, count = 3, hiSpm = 400, N = 2000000) => {
  const om = (spm) => (2 * Math.PI * spm) / 60;
  const res = [];
  let prevSpm = 1e-9;
  let prev = endForce(string, om(prevSpm));
  for (let i = 1; i <= N && res.length < count; i += 1) {
    const spm = (hiSpm * i) / N;
    const here = endForce(string, om(spm));
    if (prev * here < 0) {
      let lo = prevSpm; let up = spm; let fLo = prev;
      for (let j = 0; j < 200; j += 1) {
        const mid = 0.5 * (lo + up);
        const fMid = endForce(string, om(mid));
        if (fLo * fMid <= 0) { up = mid; } else { lo = mid; fLo = fMid; }
      }
      res.push(0.5 * (lo + up));
    }
    prevSpm = spm; prev = here;
  }
  return res;
};

// The scan grid `naturalFrequency` actually walks, replicated line for line
// from the engine source so the grid can be printed rather than described.
const scanGrid = (string) => {
  const n0 = RS.naturalFrequency({ string }).n0Spm;
  const hi = n0 * 4;
  const lo = n0 * 0.05;
  const steps = 400;
  let prevSpm = lo;
  const pts = [lo];
  let inRange = 0; let widest = 0; let widestLo = null; let widestHi = null;
  for (let i = 1; i <= steps; i += 1) {
    const spm = prevSpm + ((hi - lo) * i) / steps;
    pts.push(spm);
    if (spm <= hi) {
      inRange += 1;
      const gap = spm - prevSpm;
      if (gap > widest) { widest = gap; widestLo = prevSpm; widestHi = spm; }
    }
    prevSpm = spm;
  }
  return { n0, lo, hi, steps, intended: (hi - lo) / steps, pts, inRange, widest, widestLo, widestHi };
};

// The worst-loaded section, recomputed STANDALONE from a card's tension
// envelope. This is a SECOND ROUTE to a quantity `runRodPumpDesign` also
// returns; it exists only because `runRodPumpDesign` exposes neither `nodes`
// nor `cardSamples`, so a node sweep on the loading has no other way in.
const loadingStandalone = (string, dyn, serviceFactor = 1) => {
  const st = RP.sectionStresses({ string, tensionEnvelope: dyn.tensionEnvelope }).map((s) => {
    const g = RP.modifiedGoodman({
      minTensilePsi: string.grade.minTensilePsi, minStressPsi: s.minStressPsi, serviceFactor,
    });
    return { ...s, allowablePsi: g.allowablePsi, loadingPct: (s.maxStressPsi / g.allowablePsi) * 100 };
  });
  return { all: st, worst: st.reduce((a, s) => (s.loadingPct > a.loadingPct ? s : a), st[0]) };
};

// ---------------------------------------------------------------- header
w('PD4 Rod Pump Design: TEACHING DIGEST');
w('');
w('THE ONLY NUMBERS A LESSON MAY QUOTE. Every line names its source: a PUBLISHED');
w('golden value out of packages/engines/test-data/production/goldens/rodpump_cases.json,');
w('a DERIVED re-run or sweep on published inputs, or the one TEACHING WELL this');
w('wave designed for itself. NOTHING in this file comes from the graded capstone.');
w('The capstone conditions and its eighteen graded answers live in separate files');
w('that the generator of this digest never opens.');
w('');
w('A leak guard, pd4_leakcheck.mjs, reads the capstone graded field list and every');
w('number on every line of this file and rejects the digest if any number lands');
w('within TEN TIMES a graded field tolerance of that field value, in seven unit');
w('shiftings: the three the wave standard requires (as printed, times 1000, times');
w('0.001) and four this domain needs (times 100, times 0.01, times 12 for inches');
w('per foot, divided by 12 for feet per inch), because inches against feet and a');
w('percentage against a fraction are the live confusions in a rod pump digest.');
w('academy_submit_capstone grades with abs(got - expected) <= tol, so tol is');
w('ABSOLUTE in the field own units and is not a fraction of anything. The guard');
w('lives in its own file and the generator never imports the capstone.');
w('');
w('Generator: /root/pd-wip-rodpump/pd4_dump.mjs');
w('Engines:   packages/engines/engines/production/rodString.js');
w('           packages/engines/engines/production/rodDynamics.js');
w('           packages/engines/engines/production/pumpingUnit.js');
w('           packages/engines/engines/production/rodPumpDesign.js');
w('           packages/engines/engines/production/data/rodCatalog.js');
w('Goldens:   packages/engines/test-data/production/goldens/rodpump_cases.json');
w('Oracle:    tools/validation/production/oracle_rodpump.py');
w('Units: load lb, stroke and position in, depth and length ft, stiffness lb/in,');
w('       compliance in/lb, speed spm, rate bbl/d, power hp, torque in-lb,');
w('       stress psi, pressure psia never psig, area in2, volume in3.');
w('');
w('WHAT PROVENANCE LABEL MEANS WHAT');
w('  golden ...    a value committed in rodpump_cases.json by the independent');
w('                stdlib oracle: a finite-element eigenvalue for the string note,');
w('                a Newton four-bar closure with implicit differentiation for the');
w('                linkage, a staggered-grid RK4 march for the card, and Python');
w('                complex numbers for the diagnostic. Four different routes on');
w('                purpose. Its gates hold the two routes to 2 percent on plunger');
w('                stroke and 3 percent on the minimum load, so anything smaller');
w('                than that is invisible to the oracle by construction.');
w('  derived ...   the shipped engine re-run on PUBLISHED inputs, or a sweep this');
w('                generator ran around them. A sweep point is not a published');
w('                case. Say so if you print one.');
w('  teaching ...  the teaching well ODUMA-4, its design, and every sweep on it.');
w('                Invented by this wave to carry the Expert results. Not a');
w('                published case, not a real well, and never to be shown as');
w('                either.');
w('');
w('WHERE A QUANTITY IS COMPUTED TWICE, THE SECTION HEADER SAYS SO AND THE TWO');
w('LABELS DIFFER. Four quantities in this file have two honest routes:');
w('  the plunger stroke, from the spring rule and from the wave march (S12);');
w('  the peak polished rod load, from prlPeakLb and from the tension envelope (S18);');
w('  the fundamental note, from the engine scan and from a dense mode scan (S5);');
w('  the worst section loading, as runRodPumpDesign returns it and as this');
w('  generator recomputes it standalone from the same card (S19, S20, S23).');
w('Never quote one of a pair without saying which route it came from.');
w('');
w('THE PUBLISHED CASES AT A GLANCE');
w(`  strings.uniform    ${'7/8'} rods, 6000 ft, in fluid of specific gravity 1.00`);
w('  strings.taper      7/8 rods 3000 ft over 3/4 rods 2000 ft, same fluid');
w(`  unit               a conventional four-bar, front arm ${GOLD.unit.geometry.aIn} in`);
w(`  predict            the taper string, simple harmonic surface motion, ${P_STROKE_IN} in`);
w(`                     stroke, ${P_FO} lb fluid load, damping ratio ${P_ZETA}, full barrel,`);
w('                     at 5 and at 9 spm');
w('  diagnose           a synthetic measured card on the taper string at 9 spm');
w('');
w('THE ONE TEACHING WELL');
w('  ODUMA-4   a three-way taper this wave designed so that the subsample, the');
w('            convergence, the counterbalance, the ignored inputs, the Goodman');
w('            line and the fillage cliff all have a case a lesson may quote.');
w('            It is run on the PUBLISHED linkage above, so the surface motion');
w('            under it is a published four-bar and not an invented one.');
w('');

// ============================================================ SECTION 0
w('# SECTION 0: FOUR OBJECTS, ONE WELL');
w('# Associate m01 l04. A rod pump design in this package is four objects and one');
w('# function that joins them, and every number in this digest belongs to exactly');
w('# one of them. Naming which object owns a number is most of what the Associate');
w('# tier is for.');
w('#   rodString.js    the STRING. Closed form and timeless: a compliance sum,');
w('#                   Archimedes, and a stepped bar eigenvalue.');
w('#   pumpingUnit.js  the LINKAGE and the GEARBOX. A four-bar closure and the');
w('#                   torque factor that follows from differentiating it.');
w('#   rodPumpDesign   the PUMP and the JOIN: fluid load, plunger area,');
w('#                   displacement, the RP 11L groups, the Goodman check, and');
w('#                   runRodPumpDesign, which calls the card solver internally.');
w('#   rodDynamics.js  the CARD. Two solvers that share no code path: predictCard');
w('#                   marches the damped wave equation, diagnoseCard propagates');
w('#                   Fourier harmonics of a MEASURED card.');
w(`derived four objects, the STRING contributes, on the published taper: buoyed weight ${f(tapStr.weightFluidLb, 6)} lb, spring rate ${f(tapStr.krLbPerIn, 6)} lb/in, fundamental ${f(tapFrq.nPrimeSpm, 6)} spm`);
w(`derived four objects, the LINKAGE contributes, on the published unit: stroke ${f(S_IN, 6)} in, largest torque factor ${f(Math.max(...KIN.samples.map((x) => Math.abs(x.torqueFactorIn))), 6)} in, upstroke fraction ${f(KIN.upstrokeFraction, 6)}`);
w(`teaching four objects, the PUMP contributes, on ODUMA-4: fluid load ${f(T_FO, 6)} lb, plunger area ${f(RC.rodArea(T_PD), 6)} in2, rated displacement ${f(RP.displacementBpd({ plungerDIn: T_PD, strokeIn: S_IN, spm: T_SPM }), 6)} bbl/d`);
w('derived four objects, the CARD contributes everything that is not on those three lines: the plunger stroke, both polished rod loads, the card area, the horsepower, the tension envelope and every warning about them');
w('# NOTHING IN THE FIRST THREE OBJECTS NEEDS A MARCH. Everything in the fourth');
w('# does, and that is the seam the three tiers are cut along.');
w('');

// ============================================================ SECTION 1
w('# SECTION 1: PUBLISHED CONSTANTS');
w('# Associate m05 owns the pump constant, Associate m03 the wave speed. Both are');
w('# DERIVED in the engine rather than remembered: the pump constant is built from');
w('# cubic inches per barrel and the oracle builds it from gallons, so a slip in');
w('# either shows. The coupling ratio is published rod weight over bare steel');
w('# weight, and it is what slows the rod wave below the bare-steel value.');
// The "in2" here is a SQUARED DIAMETER and not an area. The constant multiplies
// d^2 directly, with the pi/4 already inside it. Writing the unit as in2 is the
// exact confusion that made a predecessor apply pi/4 a second time and
// understate displacement by 21.46 percent, so the unit is spelled out.
w(`golden constants, pump displacement constant = ${f(GOLD.constants.pumpConstant, 12)} bbl per day per (in of plunger diameter) squared per in of stroke per spm, the pi over four already inside it`);
w(`derived constants, engine PUMP_CONSTANT = ${f(RP.PUMP_CONSTANT, 12)}, difference from golden = ${e(RP.PUMP_CONSTANT - GOLD.constants.pumpConstant, 3)}`);
w(`derived constants, engine IN3_PER_BBL = ${RP.IN3_PER_BBL} in3 per bbl, from 42 gallons of 231 in3`);
w(`golden constants, wave speed of a 7/8 rod = ${f(GOLD.constants.waveSpeed78, 9)} ft/s`);
w(`derived constants, engine sectionWaveSpeedFtS on a 7/8 rod = ${f(RS.sectionWaveSpeedFtS({ areaIn2: RC.rodArea(0.875), weightLbPerFt: 2.224 }), 9)} ft/s`);
w(`derived constants, bare steel acoustic velocity from E and density = ${f(RC.steelAcousticVelocityFtS(), 9)} ft/s`);
w(`derived constants, coupling allowance stated by the catalog = ${RC.COUPLING_ALLOWANCE} dimensionless`);
w(`derived constants, bare steel velocity divided by the square root of the coupling allowance = ${f(RC.steelAcousticVelocityFtS() / Math.sqrt(RC.COUPLING_ALLOWANCE), 9)} ft/s`);
w(`derived constants, conventional rod acoustic velocity the catalog ships = ${RC.ROD_ACOUSTIC_VELOCITY_FT_S} ft/s`);
w(`derived constants, Young modulus for API sucker rods = ${RC.ROD_ELASTIC_MODULUS_PSI} psi`);
w(`derived constants, steel specific gravity used by Archimedes = ${RC.STEEL_SG} dimensionless`);
w(`derived constants, steel density = ${RC.STEEL_DENSITY_LB_FT3} lb/ft3`);
for (const [label, ratio] of Object.entries(GOLD.constants.couplingRatios)) {
  const dIn = RC.parseRodSize(label);
  const wt = RC.rodSize(label).weightLbPerFt;
  w(`golden couplingRatio, ${label} rod: published weight over bare steel weight = ${f(ratio, 12)} dimensionless`);
  w(`derived couplingRatio, ${label} rod: diameter = ${f(dIn, 6)} in, area = ${f(RC.rodArea(dIn), 9)} in2, `
    + `published weight = ${f(wt, 6)} lb/ft, bare steel weight = ${f(RC.bareRodWeightLbPerFt(dIn), 9)} lb/ft, `
    + `wave speed = ${f(RS.sectionWaveSpeedFtS({ areaIn2: RC.rodArea(dIn), weightLbPerFt: wt }), 6)} ft/s`);
}
w('');

// ============================================================ SECTION 2
w('# SECTION 2: THE TWO PUBLISHED ROD STRINGS');
w('# Associate m02 owns every number here. The engine reproduces the oracle to the');
w('# last figure on the closed forms, because a compliance sum and Archimedes have');
w('# only one answer; the two routes separate only on the eigenvalue, which is');
w('# Section 5.');
w('#');
w('# DO NOT READ THE NEXT TWO FIGURES AS A TAPER RESULT. The uniform string is');
w('# 6000 ft and the taper is 3000 plus 2000, so it is 5000 ft. The taper comes');
w('# out lighter and stiffer than the uniform string, but MOST OF BOTH GAPS IS');
w('# THE THOUSAND FEET, not the taper. The header said "of the same length" and');
w('# they are not, and a lesson writer caught it.');
w('#');
w('# The honest same-length comparison is the SECTION 3 SPLIT SWEEP, which holds');
w('# the total length fixed and moves the split. Use that one to say what a');
w('# taper buys.');
const strFixtures = [
  ['uniform', uniStr, GOLD.strings.uniform, '7/8 rods 6000 ft, fluid specific gravity 1.00'],
  ['taper', tapStr, GOLD.strings.taper, '7/8 rods 3000 ft over 3/4 rods 2000 ft, fluid specific gravity 1.00'],
];
for (const [nm, st, gd, note] of strFixtures) {
  w(`golden strings.${nm}, inputs: ${note}`);
  w(`golden strings.${nm}, weight in air = ${f(gd.weightAirLb, 9)} lb`);
  w(`golden strings.${nm}, buoyed weight = ${f(gd.weightFluidLb, 9)} lb`);
  w(`golden strings.${nm}, buoyancy factor = ${f(gd.buoyancy, 12)} dimensionless`);
  w(`golden strings.${nm}, elastic constant Er = ${e(gd.erInPerLb, 9)} in/lb`);
  w(`golden strings.${nm}, spring rate Kr = ${f(gd.krLbPerIn, 9)} lb/in`);
  w(`derived strings.${nm}, engine weight in air = ${f(st.weightAirLb, 9)} lb, difference from golden = ${e(st.weightAirLb - gd.weightAirLb, 3)} lb`);
  w(`derived strings.${nm}, engine buoyed weight = ${f(st.weightFluidLb, 9)} lb, difference from golden = ${e(st.weightFluidLb - gd.weightFluidLb, 3)} lb`);
  w(`derived strings.${nm}, engine Er = ${e(st.erInPerLb, 9)} in/lb, difference from golden = ${e(st.erInPerLb - gd.erInPerLb, 3)} in/lb`);
  w(`derived strings.${nm}, engine Kr = ${f(st.krLbPerIn, 9)} lb/in, difference from golden = ${e(st.krLbPerIn - gd.krLbPerIn, 3)} lb/in`);
  w(`derived strings.${nm}, length = ${f(st.lengthFt, 3)} ft, average weight = ${f(st.weightLbPerFt, 9)} lb/ft, grade = ${st.grade.label}, minimum tensile = ${st.grade.minTensilePsi} psi`);
  st.sections.forEach((sec, i) => {
    w(`derived strings.${nm} section ${i + 1}, label ${sec.label}, diameter = ${f(sec.dIn, 6)} in, area = ${f(sec.areaIn2, 9)} in2, `
      + `length = ${f(sec.lengthFt, 3)} ft, weight = ${f(sec.weightLbPerFt, 6)} lb/ft from the ${sec.weightSource} route, `
      + `section weight = ${f(sec.weightLb, 6)} lb, section compliance = ${e(sec.stretchPerLb, 9)} in/lb, `
      + `share of the whole compliance = ${f((sec.stretchPerLb / st.erInPerLb) * 100, 6)} percent`);
  });
  w(`derived strings.${nm}, warnings = ${codes(st.warnings)}`);
}
w(`derived strings, the taper is lighter than the uniform string by ${f(uniStr.weightAirLb - tapStr.weightAirLb, 6)} lb in air, `
  + `which is ${f(((uniStr.weightAirLb - tapStr.weightAirLb) / uniStr.weightAirLb) * 100, 6)} percent`);
w(`derived strings, and stiffer by ${f(tapStr.krLbPerIn - uniStr.krLbPerIn, 6)} lb/in, `
  + `which is ${f(((tapStr.krLbPerIn - uniStr.krLbPerIn) / uniStr.krLbPerIn) * 100, 6)} percent`);
w('');

// ============================================================ SECTION 3
w('# SECTION 3: STIFFNESS ADDS IN SERIES, SO COMPLIANCE ADDS AND STIFFNESS DOES NOT');
w('# Associate m02 l02. DERIVED on the published taper. The arithmetic the engine');
w('# does is 1/Kr = sum L_i / (E A_i): the COMPLIANCES add. The line below shows');
w('# what happens if a reader adds the section spring rates instead, which is the');
w('# mistake the series rule exists to prevent. Print both and let the size of the');
w('# error speak: adding stiffnesses gives a string more than four times too stiff.');
const secK = tapStr.sections.map((s) => 1 / s.stretchPerLb);
tapStr.sections.forEach((s, i) => {
  w(`derived series, published taper section ${i + 1} (${s.label}, ${f(s.lengthFt, 0)} ft): compliance = ${e(s.stretchPerLb, 9)} in/lb, spring rate on its own = ${f(secK[i], 9)} lb/in`);
});
w(`derived series, compliances added = ${e(tapStr.erInPerLb, 9)} in/lb, so the string spring rate = ${f(tapStr.krLbPerIn, 9)} lb/in. THIS IS WHAT THE ENGINE DOES.`);
w(`derived series, spring rates added instead = ${f(secK.reduce((a, b) => a + b, 0), 9)} lb/in, which is ${f(secK.reduce((a, b) => a + b, 0) / tapStr.krLbPerIn, 6)} times the true string rate`);
w(`derived series, the softest section alone would give ${f(Math.min(...secK), 9)} lb/in, and the whole string is softer than that at ${f(tapStr.krLbPerIn, 9)} lb/in`);
w('# THE TAPER AS A COMPROMISE. DERIVED sweep: the same 5000 ft and the same two rod');
w('# sizes, with the split walked from all 3/4 to all 7/8. Weight and stiffness move');
w('# together and in the same direction, so there is no split that is both light and');
w('# stiff. That is the compromise, and it is why a taper is designed on stress');
w('# rather than on either one.');
for (let topFt = 0; topFt <= 5000; topFt += 500) {
  const secs = [];
  if (topFt > 0) secs.push({ size: '7/8', lengthFt: topFt });
  if (topFt < 5000) secs.push({ size: '3/4', lengthFt: 5000 - topFt });
  const st = RS.buildRodString({ sections: secs, fluidSg: 1.0, gradeId: 'D' });
  const nf = RS.naturalFrequency({ string: st });
  w(`derived taper split, 7/8 over the top ${f(topFt, 0)} ft and 3/4 below: weight in air = ${f(st.weightAirLb, 6)} lb, `
    + `buoyed = ${f(st.weightFluidLb, 6)} lb, Er = ${e(st.erInPerLb, 9)} in/lb, Kr = ${f(st.krLbPerIn, 9)} lb/in, `
    + `stretch under 5000 lb = ${f(RS.rodStretchIn({ string: st, loadLb: 5000 }), 6)} in, fundamental = ${f(nf.nPrimeSpm, 9)} spm`);
}
w('# A TAPER THAT STEPS UP. DERIVED. The engine accepts the string and WARNS rather');
w('# than refusing, because a reversed order is a design error and not a parse error.');
const stepsUp = RS.buildRodString({ sections: [{ size: '3/4', lengthFt: 3000 }, { size: '7/8', lengthFt: 2000 }], fluidSg: 1.0 });
w(`derived taper order, 3/4 above 7/8 over the same 5000 ft: ok = ${stepsUp.ok}, warnings = ${codes(stepsUp.warnings)}, `
  + `Kr = ${f(stepsUp.krLbPerIn, 9)} lb/in, weight in air = ${f(stepsUp.weightAirLb, 6)} lb`);
w(`derived taper order, the published taper with the same two sections in the right order: Kr = ${f(tapStr.krLbPerIn, 9)} lb/in, warnings = ${codes(tapStr.warnings)}`);
w('# THE ENGINE REFUSES a size it cannot read, rather than defaulting it. That is the');
w('# defect the catalog header names: parseFloat on "7/8" with the slash swapped for a');
w('# dot gives 7.8, an eighty times area, and a string that cannot stretch.');
const badStr = RS.buildRodString({ sections: [{ size: 'seven eighths', lengthFt: 3000 }], fluidSg: 1.0 });
w(`derived taper refusal, size "seven eighths": ok = ${badStr.ok}, errors = ${badStr.errors.length}`);
w(`derived taper refusal, message: ${badStr.errors[0]}`);
w(`derived taper refusal, what the predecessor's parse would have given: 7/8 read as 7.8 in has area ${f(RC.rodArea(7.8), 6)} in2 against the true ${f(RC.rodArea(0.875), 9)} in2, a factor of ${f(RC.rodArea(7.8) / RC.rodArea(0.875), 6)}`);
w('');

// ============================================================ SECTION 4
w('# SECTION 4: BUOYED WEIGHT IS ARCHIMEDES AND NOTHING ELSE');
w('# Associate m02 l03. DERIVED sweep on the published taper. The buoyancy factor is');
w('# 1 - SG fluid over SG steel, with no other coefficient in it. The predecessor');
w('# used 1 - 1.2 SG / 7.85, and the last column prices that. THE LAST COLUMN IS');
w('# THE AUTHORITY, NOT THIS SENTENCE: the error runs about 2.9 percent of the');
w('# buoyed weight at a specific gravity of 1.00 and rises to about 3.4 percent');
w('# at 1.15, which is single digit percent and not the "about a fifth" this');
w('# header claimed in its first draft. The fifth belongs to SECTION 9, where the');
w('# predecessor plunger area form genuinely understates displacement by 21.46');
w('# percent, and it was copied here. A lesson writer priced both and reported');
w('# the mismatch rather than repeating it.');
for (const sg of [0.00, 0.70, 0.80, 0.85, 0.95, 1.00, 1.05, 1.15]) {
  const bf = RS.buoyancyFactor(sg);
  const bad = 1 - (1.2 * sg) / RC.STEEL_SG;
  w(`derived buoyancy, fluid specific gravity ${f(sg, 2)}: factor = ${f(bf, 12)}, buoyed weight of the published taper = ${f(tapStr.weightAirLb * bf, 6)} lb, `
    + `predecessor 1.2 factor = ${f(bad, 12)}, its buoyed weight = ${f(tapStr.weightAirLb * bad, 6)} lb, `
    + `weight it removes = ${f(tapStr.weightAirLb * (bf - bad), 6)} lb, which is ${f(((bf - bad) / bf) * 100, 6)} percent`);
}
w(`derived buoyancy, at specific gravity 1.00 the published taper loses ${f(tapStr.weightAirLb - tapStr.weightFluidLb, 6)} lb to the fluid it hangs in`);
w('');

// ============================================================ SECTION 5
w('# SECTION 5: THE STRING HAS A NOTE. TWO ROUTES TO THE SAME EIGENVALUE.');
w('# Associate m03 owns this section. THE SAME QUANTITY APPEARS TWICE HERE AND THE');
w('# TWO LABELS ARE DIFFERENT ON PURPOSE:');
w('#   "engine scan"  is naturalFrequency, which walks its own 400 point grid and');
w('#                  bisects the first sign change it meets.');
w('#   "mode scan"    is this generator, walking the SAME transfer matrix end force');
w('#                  on a uniform two million point grid from zero to 400 spm so');
w('#                  no root can be stepped over, and closing every sign change.');
w('# They agree to every figure printed on all three strings below, which is the');
w('# whole reason Section 6 can be written without alarm. Quote whichever you like,');
w('# but say which one you quoted.');
const uniModes = modeSpm(uniStr);
const tapModes = modeSpm(tapStr);
const teaModes = modeSpm(teaStr);
w(`golden strings.uniform, fundamental from the oracle finite element eigenvalue = ${f(GOLD.strings.uniform.n0Spm, 9)} spm`);
w(`derived strings.uniform, engine scan fundamental = ${f(uniFrq.nPrimeSpm, 12)} spm, difference from the oracle = ${e(uniFrq.nPrimeSpm - GOLD.strings.uniform.n0Spm, 4)} spm`);
w(`derived strings.uniform, mode scan first three modes = ${uniModes.map((x) => f(x, 9)).join(' spm, ')} spm`);
w(`derived strings.uniform, engine reports uniform = ${uniFrq.uniform}, taper factor = ${f(uniFrq.taperFactor, 9)}, acoustic velocity used = ${f(uniFrq.acousticVelocityFtS, 9)} ft/s`);
w(`derived strings.uniform, the quarter wave 60 a / (4 L) with that velocity = ${f((60 * uniFrq.acousticVelocityFtS) / (4 * uniStr.lengthFt), 12)} spm`);
w(`derived strings.uniform, the industry shorthand 245000 / L over ${f(uniStr.lengthFt, 0)} ft = ${f(245000 / uniStr.lengthFt, 9)} spm, difference from the engine = ${f(245000 / uniStr.lengthFt - uniFrq.nPrimeSpm, 9)} spm`);
w(`derived strings.uniform, mode ratios against the fundamental = ${f(uniModes[1] / uniModes[0], 9)} and ${f(uniModes[2] / uniModes[0], 9)}, against the odd harmonics 3 and 5 a uniform quarter wave bar would give`);
w(`golden strings.taper, fundamental from the oracle finite element eigenvalue = ${f(GOLD.strings.taper.n0Spm, 9)} spm`);
w(`derived strings.taper, engine scan fundamental = ${f(tapFrq.nPrimeSpm, 12)} spm, difference from the oracle = ${e(tapFrq.nPrimeSpm - GOLD.strings.taper.n0Spm, 4)} spm`);
w(`derived strings.taper, mode scan first three modes = ${tapModes.map((x) => f(x, 9)).join(' spm, ')} spm`);
w(`derived strings.taper, engine reports uniform = ${tapFrq.uniform}, unresolved = ${tapFrq.unresolved === true}`);
w(`derived strings.taper, the uniform quarter wave the engine calls n0 = ${f(tapFrq.n0Spm, 12)} spm, and the taper factor it reports = ${f(tapFrq.taperFactor, 12)} dimensionless`);
w(`derived strings.taper, mode ratios against the fundamental = ${f(tapModes[1] / tapModes[0], 9)} and ${f(tapModes[2] / tapModes[0], 9)}, which are NOT 3 and 5: a stepped bar is not a uniform bar`);
w(`derived strings.taper, the gap between the first and the second mode = ${f(tapModes[1] - tapModes[0], 9)} spm`);
w(`teaching strings.ODUMA-4, engine scan fundamental = ${f(teaFrq.nPrimeSpm, 12)} spm`);
w(`teaching strings.ODUMA-4, mode scan first three modes = ${teaModes.map((x) => f(x, 9)).join(' spm, ')} spm`);
w(`teaching strings.ODUMA-4, the uniform quarter wave n0 = ${f(teaFrq.n0Spm, 12)} spm, taper factor = ${f(teaFrq.taperFactor, 12)} dimensionless`);
w(`teaching strings.ODUMA-4, the gap between the first and the second mode = ${f(teaModes[1] - teaModes[0], 9)} spm`);
w('# WHAT THE NOTE DOES NOT PROMISE. The engine REFUSES a design at or above the');
w('# fundamental. It is a hard refusal with a message, not a warning, and it names');
w('# the number. DERIVED on the published taper and TEACHING on ODUMA-4.');
const refuse = RP.runRodPumpDesign({
  string: teaStr, frequency: teaFrq, surfacePosition: SURF, strokeIn: S_IN,
  spm: Math.ceil(teaFrq.nPrimeSpm), plungerDIn: T_PD, pDischargePsi: T_PDIS,
  pIntakePsi: T_PINT, fillage: 1, dampingRatio: T_ZETA,
});
w(`teaching refusal, ODUMA-4 asked for ${Math.ceil(teaFrq.nPrimeSpm)} spm against a fundamental of ${f(teaFrq.nPrimeSpm, 9)} spm: ok = ${refuse.ok}, errors = ${refuse.errors.length}`);
w(`teaching refusal, message: ${refuse.errors[0]}`);
w(`teaching refusal, the highest speed the engine will accept on this string is anything strictly below ${f(teaFrq.nPrimeSpm, 9)} spm`);
w('');

// ============================================================ SECTION 6
w('# SECTION 6: THE LIMIT OF THE SCAN. naturalFrequency WALKS A QUADRATIC GRID.');
w('# Associate m03 l04. DERIVED, replicated line for line from the engine source.');
w('# The scan means to lay 400 evenly spaced points between n0/20 and 4 n0. It adds');
w('# its increment to the RUNNING position instead of to the lower bound, so the');
w('# grid grows as i(i+1)/2 and the points run away. It is LATENT on every string in');
w('# this file: Section 5 shows the engine returning the true fundamental to every');
w('# figure the dense mode scan gives, because the modes on these strings are far');
w('# enough apart that even a coarse interval still brackets the first one. What it');
w('# costs is the guarantee, not the answer. State it as the limit of a scan.');
for (const [nm, st] of [['published taper', tapStr], ['ODUMA-4', teaStr]]) {
  const g = scanGrid(st);
  const lbl = nm === 'ODUMA-4' ? 'teaching' : 'derived';
  w(`${lbl} scan grid, ${nm}: intended range ${f(g.lo, 6)} to ${f(g.hi, 6)} spm over ${g.steps} steps, intended spacing = ${f(g.intended, 9)} spm`);
  w(`${lbl} scan grid, ${nm}: points that actually land inside that range = ${g.inRange + 1} of ${g.steps + 1}`);
  w(`${lbl} scan grid, ${nm}: widest interval inside the range = ${f(g.widest, 9)} spm, between ${f(g.widestLo, 6)} and ${f(g.widestHi, 6)} spm`);
  w(`${lbl} scan grid, ${nm}: that widest interval is ${f(g.widest / g.intended, 6)} times the intended spacing`);
  w(`${lbl} scan grid, ${nm}: the last point the scan evaluates = ${e(g.pts[g.pts.length - 1], 6)} spm, which is ${e(g.pts[g.pts.length - 1] / g.hi, 4)} times the top of the intended range`);
  w(`${lbl} scan grid, ${nm}: the first twelve points, contiguous from the start, are ${g.pts.slice(0, 12).map((x) => f(x, 6)).join(', ')} spm`);
  w(`${lbl} scan grid, ${nm}: the first twelve intervals, contiguous, are ${g.pts.slice(1, 13).map((x, i) => f(x - g.pts[i], 6)).join(', ')} spm`);
  const fund = nm === 'ODUMA-4' ? teaModes[0] : tapModes[0];
  const brk = g.pts.findIndex((x) => x > fund);
  w(`${lbl} scan grid, ${nm}: the fundamental at ${f(fund, 9)} spm falls in the interval from ${f(g.pts[brk - 1], 6)} to ${f(g.pts[brk], 6)} spm, an interval ${f(g.pts[brk] - g.pts[brk - 1], 9)} spm wide`);
  w(`${lbl} scan grid, ${nm}: the second mode sits ${f((nm === 'ODUMA-4' ? teaModes[1] : tapModes[1]) - fund, 9)} spm above the first, so one interval cannot hold both and the scan cannot skip past the pair`);
}
w('# WHAT IT WOULD COST IF THE MODES WERE CLOSER. DERIVED. Two roots inside one');
w('# interval leave no sign change, the scan walks past both, and the function');
w('# returns a HIGHER mode as the fundamental with no unresolved flag set. Since');
w('# runRodPumpDesign refuses every design at or above that number, a wrong');
w('# fundamental is a wrong refusal or a wrong permission. One character fixes it:');
w('# add the increment to the lower bound and not to the running position.');
const nfNo = RS.naturalFrequency({ string: RS.buildRodString({ sections: [{ size: '7/8', lengthFt: 3000 }, { size: '3/4', lengthFt: 2000 }], fluidSg: 1.0 }) });
w(`derived scan grid, the flag the engine sets when it finds no sign change at all is unresolved, and on the published taper it is ${nfNo.unresolved === true}`);
w('');

// ============================================================ SECTION 7
w('# SECTION 7: THE PUBLISHED FOUR-BAR LINKAGE');
w('# Associate m04 owns everything here. The equalizer bearing lies on two circles');
w('# at once, radius C about the saddle bearing and radius P about the crank pin,');
w('# and intersecting them IS the solution. The closure residual printed below is');
w('# how far the solved point misses each of the two circles: it is at round-off,');
w('# which is what says the closure is exact rather than fitted.');
w(`golden unit geometry, front arm A = ${GOLD.unit.geometry.aIn} in`);
w(`golden unit geometry, rear arm C = ${GOLD.unit.geometry.cIn} in`);
w(`golden unit geometry, pitman P = ${GOLD.unit.geometry.pIn} in`);
w(`golden unit geometry, crankshaft behind the saddle bearing = ${GOLD.unit.geometry.crankBehindIn} in`);
w(`golden unit geometry, crankshaft below the saddle bearing = ${GOLD.unit.geometry.crankBelowIn} in`);
w(`golden unit geometry, crank radius R = ${GOLD.unit.geometry.rIn} in`);
w(`golden unit, stroke = ${f(GOLD.unit.strokeIn, 9)} in`);
w(`golden unit, upstroke fraction of the revolution = ${f(GOLD.unit.upstrokeFraction, 12)} dimensionless`);
w(`golden unit, largest torque factor = ${f(GOLD.unit.torqueFactorMaxIn, 9)} in`);
w(`derived unit, engine stroke at 360 crank steps = ${f(KIN.strokeIn, 9)} in, difference from golden = ${e(KIN.strokeIn - GOLD.unit.strokeIn, 4)} in`);
w(`derived unit, engine upstroke fraction = ${f(KIN.upstrokeFraction, 12)}, difference from golden = ${e(KIN.upstrokeFraction - GOLD.unit.upstrokeFraction, 4)}`);
w(`derived unit, engine largest torque factor = ${f(Math.max(...KIN.samples.map((s) => Math.abs(s.torqueFactorIn))), 9)} in, difference from golden = ${e(Math.max(...KIN.samples.map((s) => Math.abs(s.torqueFactorIn))) - GOLD.unit.torqueFactorMaxIn, 4)} in`);
w(`derived unit, beam angle sweep = ${f(KIN.psiMax - KIN.psiMin, 12)} rad, and the stroke is that sweep times the front arm: ${f(GEOM.aIn * (KIN.psiMax - KIN.psiMin), 9)} in`);
w(`derived unit, crank angle at the BOTTOM of the polished rod stroke = ${f((KIN.crankAngleAtBottomRad * 180) / Math.PI, 9)} deg, sample index ${KIN.bottomIndex} of ${KIN.samples.length}`);
w(`derived unit, the upstroke is NOT half the revolution: it is ${f(KIN.upstrokeFraction * 100, 9)} percent of it, so the upstroke and the downstroke take different times`);
w(`derived unit, upstroke duration at 10 spm = ${f((60 / 10) * KIN.upstrokeFraction, 9)} s, downstroke duration = ${f((60 / 10) * (1 - KIN.upstrokeFraction), 9)} s`);
w('# THE CLOSURE, AT EVERY THIRTY DEGREES, CONTIGUOUS THROUGH A WHOLE REVOLUTION.');
w('# Golden samples are the oracle Newton closure with implicit differentiation.');
GOLD.unit.positionSample.forEach((p, k) => {
  w(`golden unit sample ${k + 1} of 12, crank ${f(k * 30, 1)} deg: polished rod position = ${f(p, 9)} in below the top of the stroke, torque factor = ${f(GOLD.unit.torqueFactorSample[k], 9)} in`);
});
w('# THE SAME REVOLUTION FROM THE ENGINE, at every fifteen degrees, contiguous, with');
w('# the velocity that follows. Position is measured DOWNWARD from the top of the');
w('# stroke; a NEGATIVE torque factor is the polished rod going UP. Velocity is the');
w('# torque factor times the crank angular velocity, so it scales with speed and the');
w('# torque factor does not: ds/dtheta is geometry alone.');
const OM10 = (2 * Math.PI * 10) / 60;
for (let k = 0; k < 24; k += 1) {
  const idx = k * 15;
  const s = KIN.samples[idx];
  const geo = GEOM;
  const px = -geo.crankBehindIn + geo.rIn * Math.cos(s.thetaRad);
  const py = -geo.crankBelowIn + geo.rIn * Math.sin(s.thetaRad);
  const ex = geo.cIn * Math.cos(s.psiRad);
  const ey = geo.cIn * Math.sin(s.psiRad);
  const resC = Math.hypot(ex, ey) - geo.cIn;
  const resP = Math.hypot(ex - px, ey - py) - geo.pIn;
  w(`derived unit revolution, crank ${f(k * 15, 1)} deg: beam angle = ${f(s.psiRad, 9)} rad, position = ${f(s.positionIn, 9)} in, `
    + `torque factor ds/dtheta = ${f(s.torqueFactorIn, 9)} in/rad, velocity at 10 spm = ${f(s.torqueFactorIn * OM10, 9)} in/s, `
    + `closure residual on the rear arm = ${e(resC, 3)} in, on the pitman = ${e(resP, 3)} in`);
}
w(`derived unit revolution, the fastest downward velocity at 10 spm = ${f(Math.max(...KIN.samples.map((s) => s.torqueFactorIn)) * OM10, 9)} in/s`);
w(`derived unit revolution, the fastest upward velocity at 10 spm = ${f(Math.min(...KIN.samples.map((s) => s.torqueFactorIn)) * OM10, 9)} in/s`);
// The printed quantity is min over max, which is the SLOWER over the FASTER.
// The label said the reverse, and a ratio of 0.88 announced as "faster over
// slower" is self-refuting, since that one cannot be below one. A lesson
// writer caught it and wrote around it rather than quoting it directionally.
w(`derived unit revolution, the two are NOT equal in size, and the ratio of the SLOWER to the FASTER is ${f(Math.abs(Math.min(...KIN.samples.map((s) => s.torqueFactorIn)) / Math.max(...KIN.samples.map((s) => s.torqueFactorIn))), 9)}: this asymmetry is what a sine wave assumption throws away`);
w('# WHAT A SINE WAVE WOULD HAVE SAID. DERIVED, same stroke, same speed.');
w('#');
w('# THE TWO CURVES ARE MEASURED FROM OPPOSITE ENDS AND THE RAW DIFFERENCE IS MOSTLY THAT.');
w('# The four-bar reports position measured DOWNWARD from the top, so at cycle');
w('# fraction zero the rod is at the BOTTOM and the four-bar reads a full stroke');
w('# while the simple harmonic reads zero. Subtract them as printed and the');
w('# difference column runs the whole stroke in both directions, and almost all');
w('# of that is the convention and not the shape.');
w('#');
w('# So a PHASE-ALIGNED difference is printed beside the raw one. Quote the');
w('# aligned column for "how wrong is a sine wave", and the raw one only to show');
w('# what the convention mismatch costs. A lesson writer nearly published the');
w('# phase offset as physics, caught it, and used the timing of the extremes and');
w('# the velocity asymmetry instead. Both are now available.');
const shmSurf = PU.simpleHarmonicPosition(S_IN / 12);
for (let k = 0; k < 24; k += 1) {
  const tf = k / 24;
  const real = SURF(tf) * 12;
  const sine = shmSurf(tf) * 12;
  // Align the sine to the four-bar's own convention: measured downward from the
  // top, so a full stroke less the sine, half a cycle out.
  // A REFLECTION, not a phase shift. The two curves are IN STEP and measured
  // from opposite ends: at cycle fraction zero both are at the bottom, the
  // four-bar reading a full stroke because it measures DOWNWARD from the top
  // and the sine reading zero because it measures UPWARD from the bottom.
  // Half a cycle was the first guess here and it was wrong, which is worth
  // keeping: two curves that disagree by a whole stroke are not necessarily
  // out of step, they may simply be measured from opposite ends.
  const aligned = S_IN - shmSurf(tf) * 12;
  w(`derived sine comparison, cycle fraction ${f(tf, 6)}: four-bar position = ${f(real, 9)} in, simple harmonic position as printed = ${f(sine, 9)} in, RAW difference including the phase convention = ${f(real - sine, 9)} in`);
  w(`derived sine comparison, cycle fraction ${f(tf, 6)}: PHASE ALIGNED simple harmonic = ${f(aligned, 9)} in, aligned difference, which is the SHAPE disagreement = ${f(real - aligned, 9)} in`);
}
w('');

// ============================================================ SECTION 8
w('# SECTION 8: WHAT GEOMETRY DECIDES, AND WHAT IT REFUSES');
w('# Associate m04 l04 and l05. DERIVED sweeps on the published linkage: one');
w('# dimension moved at a time, everything else held. The crank radius sets the');
w('# stroke almost proportionally and the front arm sets it exactly proportionally,');
w('# but neither of them touches the upstroke fraction much, which is a property of');
w('# the whole shape.');
for (const r of [20, 22, 24, 26, 28, 28.8, 30, 32, 34]) {
  const g = PU.conventionalGeometry({ ...GOLD.unit.geometry, rIn: r });
  const k = PU.unitKinematics(g, { steps: 360 });
  if (!k.ok) { w(`derived crank sweep, crank radius ${f(r, 3)} in: the linkage does not close, ${k.error}`); continue; }
  w(`derived crank sweep, crank radius ${f(r, 3)} in: stroke = ${f(k.strokeIn, 9)} in, upstroke fraction = ${f(k.upstrokeFraction, 9)}, `
    + `largest torque factor = ${f(Math.max(...k.samples.map((s) => Math.abs(s.torqueFactorIn))), 9)} in, stroke over crank radius = ${f(k.strokeIn / r, 9)}`);
}
for (const a of [80, 90, 100, 106.6667, 110, 120]) {
  const g = PU.conventionalGeometry({ ...GOLD.unit.geometry, aIn: a });
  const k = PU.unitKinematics(g, { steps: 360 });
  w(`derived arm sweep, front arm ${f(a, 4)} in: stroke = ${f(k.strokeIn, 9)} in, upstroke fraction = ${f(k.upstrokeFraction, 9)}, stroke over front arm = ${f(k.strokeIn / a, 12)}`);
}
w('# A LINKAGE THAT CANNOT CLOSE. DERIVED. The engine REPORTS it rather than');
w('# clamping the beam angle, because a geometry that does not close at some crank');
w('# angle cannot be a real unit.');
const noClose = PU.unitKinematics(PU.conventionalGeometry({ ...GOLD.unit.geometry, pIn: 20 }), { steps: 360 });
w(`derived closure refusal, pitman shortened to 20 in: ok = ${noClose.ok}`);
w(`derived closure refusal, message: ${noClose.error}`);
w('# THE GENERIC LINKAGE. DERIVED. The package ships NO named unit dimensions,');
w('# because real beam dimensions are manufacturer data and differ between makers');
w('# for the same API designation. genericConventionalGeometry scales a fixed SHAPE');
w('# to a requested stroke and labels itself generic everywhere it surfaces.');
for (const want of [54, 74, 100, 120, 144]) {
  const gg = PU.genericConventionalGeometry({ strokeIn: want });
  const kk = PU.unitKinematics(gg.geometry, { steps: 360 });
  w(`derived generic linkage, requested stroke ${f(want, 1)} in: achieved stroke = ${f(kk.strokeIn, 9)} in, front arm = ${f(gg.geometry.aIn, 9)} in, `
    + `rear arm = ${f(gg.geometry.cIn, 9)} in, pitman = ${f(gg.geometry.pIn, 9)} in, crank radius = ${f(gg.geometry.rIn, 9)} in, upstroke fraction = ${f(kk.upstrokeFraction, 9)}`);
}
w(`derived generic linkage, note the engine attaches: ${PU.genericConventionalGeometry({ strokeIn: 100 }).note}`);
w('# THE API DESIGNATION carries the three numbers a design is checked against, and');
w('# parsing it is worth doing for exactly that reason. DERIVED.');
for (const dsg of ['C-320D-200-100', 'C-456D-256-120', 'M-228D-173-86', 'A-640D-305-120']) {
  const p = PU.parseUnitDesignation(dsg);
  w(`derived designation, ${dsg}: kind = ${p.kind}, gearbox rating = ${p.torqueRatingInLb} in-lb, `
    + `structural capacity = ${p.structuralCapacityLb} lb, stroke = ${p.strokeIn} in, reduction = ${p.reduction}`);
}
w(`derived designation, a string that is not a designation returns ${PU.parseUnitDesignation('not a unit')} rather than a guess`);
w('');

// ============================================================ SECTION 9
w('# SECTION 9: THE PUMP ITSELF. FLUID LOAD, AREA, DISPLACEMENT, VOLUME PER STROKE.');
w('# Associate m05 owns all of it. Every line is closed form. The displacement');
w('# constant already contains pi/4, so it multiplies the DIAMETER SQUARED and not');
w('# the area: the predecessor multiplied by the area, applied pi/4 twice, and');
w('# understated displacement by about a fifth. The last column prices that.');
w('# The stroke used here is the PUBLISHED linkage stroke, and the differential is');
w('# a teaching differential of 1950 psi.');
const DP = T_PDIS - T_PINT;
for (const d of RC.PLUNGER_SIZES) {
  const area = RC.rodArea(d);
  const disp = RP.displacementBpd({ plungerDIn: d, strokeIn: S_IN, spm: T_SPM });
  const wrong = RP.PUMP_CONSTANT * area * S_IN * T_SPM;
  w(`derived pump, plunger ${f(d, 4)} in: area = ${f(area, 9)} in2, fluid load against ${DP} psi of differential = ${f(RP.fluidLoadLb({ plungerDIn: d, pDischargePsi: T_PDIS, pIntakePsi: T_PINT }), 6)} lb, `
    + `volume per stroke over the published ${f(S_IN, 6)} in stroke = ${f(area * S_IN, 6)} in3 = ${f((area * S_IN) / RP.IN3_PER_BBL, 9)} bbl, `
    + `rated displacement at ${T_SPM} spm = ${f(disp, 9)} bbl/d, predecessor area form = ${f(wrong, 9)} bbl/d, `
    + `predecessor understates by ${f((1 - wrong / disp) * 100, 6)} percent`);
}
w('# FLUID LOAD IS A DIFFERENTIAL TIMES AN AREA, so it is linear in both. DERIVED');
w('# sweep of the differential at a fixed plunger.');
for (const dp of [400, 800, 1200, 1600, 1950, 2400, 2800]) {
  w(`derived fluid load, plunger ${T_PD} in against ${f(dp, 1)} psi of differential: fluid load = ${f(RP.fluidLoadLb({ plungerDIn: T_PD, pDischargePsi: dp + T_PINT, pIntakePsi: T_PINT }), 9)} lb, `
    + `static stretch it causes on the published taper = ${f(RS.rodStretchIn({ string: tapStr, loadLb: RP.fluidLoadLb({ plungerDIn: T_PD, pDischargePsi: dp + T_PINT, pIntakePsi: T_PINT }) }), 9)} in`);
}
w('# THE ENGINE REFUSES a plunger with nothing to lift, rather than returning zero.');
const noLift = RP.runRodPumpDesign({
  string: tapStr, frequency: tapFrq, surfacePosition: SURF, strokeIn: S_IN, spm: 8,
  plungerDIn: T_PD, pDischargePsi: 600, pIntakePsi: 900, dampingRatio: 0.1,
});
w(`derived pump refusal, discharge below intake: ok = ${noLift.ok}, fluid load would be ${f(RP.fluidLoadLb({ plungerDIn: T_PD, pDischargePsi: 600, pIntakePsi: 900 }), 6)} lb`);
w(`derived pump refusal, message: ${noLift.errors[0]}`);
w('# AND A RATING IS NOT A PRODUCTION FORECAST. Rated displacement uses the SURFACE');
w('# stroke, which the plunger never sees; Sections 12 and 24 are the difference.');
w('');
// ============================================================ SECTION 10
w('# SECTION 10: THE TEACHING WELL ODUMA-4, DEFINED');
w('# INVENTED BY THIS WAVE. Not a real well and not a published case. It exists so');
w('# that every Expert result has a case a lesson may quote at full size, and it is');
w('# run on the PUBLISHED linkage of Section 7 so the surface motion under it is a');
w('# published four-bar rather than an invented one. Every ODUMA-4 line in this file');
w('# carries the teaching label.');
w(`teaching ODUMA-4 inputs, rod string = 1 in rods 1500 ft over 7/8 rods 1600 ft over 3/4 rods 1700 ft, total ${f(teaStr.lengthFt, 0)} ft`);
w(`teaching ODUMA-4 inputs, fluid specific gravity = ${T_SG}, rod grade = ${T_GRADE}`);
w(`teaching ODUMA-4 inputs, pumping unit = the published four-bar of Section 7, stroke ${f(S_IN, 9)} in`);
w(`teaching ODUMA-4 inputs, plunger diameter = ${T_PD} in`);
w(`teaching ODUMA-4 inputs, discharge pressure = ${T_PDIS} psia, intake pressure = ${T_PINT} psia`);
w(`teaching ODUMA-4 inputs, pumping speed = ${T_SPM} spm, damping ratio = ${T_ZETA}, fillage = ${T_FILL}, pump efficiency = 1`);
w(`teaching ODUMA-4 inputs, service factor = 1.0 unless a line says otherwise`);
w(`teaching ODUMA-4 string, weight in air = ${f(teaStr.weightAirLb, 9)} lb`);
w(`teaching ODUMA-4 string, buoyancy factor = ${f(teaStr.buoyancy, 12)} dimensionless`);
w(`teaching ODUMA-4 string, buoyed weight = ${f(teaStr.weightFluidLb, 9)} lb`);
w(`teaching ODUMA-4 string, elastic constant Er = ${e(teaStr.erInPerLb, 9)} in/lb`);
w(`teaching ODUMA-4 string, spring rate Kr = ${f(teaStr.krLbPerIn, 9)} lb/in`);
w(`teaching ODUMA-4 string, average weight = ${f(teaStr.weightLbPerFt, 9)} lb/ft, grade minimum tensile = ${teaStr.grade.minTensilePsi} psi`);
teaStr.sections.forEach((sec, i) => {
  w(`teaching ODUMA-4 section ${i + 1}, ${sec.label} rods: diameter = ${f(sec.dIn, 6)} in, area = ${f(sec.areaIn2, 9)} in2, `
    + `length = ${f(sec.lengthFt, 0)} ft, weight = ${f(sec.weightLbPerFt, 6)} lb/ft, section weight = ${f(sec.weightLb, 6)} lb, `
    + `compliance = ${e(sec.stretchPerLb, 9)} in/lb, share of the whole compliance = ${f((sec.stretchPerLb / teaStr.erInPerLb) * 100, 6)} percent`);
});
w(`teaching ODUMA-4 pump, fluid load Fo = ${f(T_FO, 9)} lb`);
w(`teaching ODUMA-4 pump, plunger area = ${f(RC.rodArea(T_PD), 9)} in2`);
w(`teaching ODUMA-4 pump, volume swept per surface stroke = ${f(RC.rodArea(T_PD) * S_IN, 6)} in3 = ${f((RC.rodArea(T_PD) * S_IN) / RP.IN3_PER_BBL, 9)} bbl`);
w(`teaching ODUMA-4 pump, rated displacement on the SURFACE stroke = ${f(RP.displacementBpd({ plungerDIn: T_PD, strokeIn: S_IN, spm: T_SPM }), 9)} bbl/d`);
w(`teaching ODUMA-4 string, fundamental from the engine scan = ${f(teaFrq.nPrimeSpm, 12)} spm, and the design runs at ${T_SPM} spm, a ratio of ${f(T_SPM / teaFrq.nPrimeSpm, 9)}`);
w('');

// ============================================================ SECTION 11
w('# SECTION 11: THE PUBLISHED PREDICTIVE CASES, IN FULL');
w('# Professional m01 and m03 own these. The oracle marched a staggered grid with');
w('# RK4 on the velocity and tension system; the engine marches displacement on a');
w('# collocated grid with an explicit central difference. Different unknowns,');
w('# different grid, different integrator, so the dispersion errors do not coincide,');
w('# and the gates hold them to 2 percent on plunger stroke and 3 percent on the');
w('# minimum load. The differences below sit inside that, and they are NOT noise:');
w('# they are two numerical routes to the same physics, and Sections 18 and 19 show');
w('# how much of the remaining gap is sampling rather than physics.');
for (const spm of [5, 9]) {
  const g = GOLD.predict.bySpm[String(spm)];
  const r = pubPredict(spm);
  w(`golden predict ${spm} spm, inputs: published taper, simple harmonic motion, stroke ${P_STROKE_IN} in, fluid load ${P_FO} lb, damping ratio ${P_ZETA}, full barrel`);
  w(`golden predict ${spm} spm, plunger stroke = ${f(g.plungerStrokeIn, 9)} in`);
  w(`golden predict ${spm} spm, peak polished rod load = ${f(g.pprlLb, 9)} lb`);
  w(`golden predict ${spm} spm, minimum polished rod load = ${f(g.mprlLb, 9)} lb`);
  w(`derived predict ${spm} spm, engine plunger stroke at the shipped default = ${f(r.plungerStrokeIn, 9)} in, difference from golden = ${f(r.plungerStrokeIn - g.plungerStrokeIn, 9)} in, which is ${f(((r.plungerStrokeIn - g.plungerStrokeIn) / g.plungerStrokeIn) * 100, 6)} percent`);
  w(`derived predict ${spm} spm, engine peak polished rod load = ${f(r.prlPeakLb, 9)} lb, difference from golden = ${f(r.prlPeakLb - g.pprlLb, 9)} lb, which is ${f(((r.prlPeakLb - g.pprlLb) / g.pprlLb) * 100, 6)} percent`);
  w(`derived predict ${spm} spm, engine minimum polished rod load = ${f(r.prlMinLb, 9)} lb, difference from golden = ${f(r.prlMinLb - g.mprlLb, 9)} lb, which is ${f(((r.prlMinLb - g.mprlLb) / g.mprlLb) * 100, 6)} percent`);
  w(`derived predict ${spm} spm, load range = ${f(r.prlPeakLb - r.prlMinLb, 9)} lb`);
  w(`derived predict ${spm} spm, card area = ${f(r.workInLbPerCycle, 6)} in-lb per cycle`);
  w(`derived predict ${spm} spm, polished rod horsepower = ${f(RP.polishedRodHp({ workInLbPerCycle: r.workInLbPerCycle, spm }), 9)} hp`);
  w(`derived predict ${spm} spm, marched steps in a cycle = ${r.samples}, card points after decimation = ${r.surfaceCard.length}, decimation stride = ${Math.max(1, Math.floor(r.samples / 180))}`);
  w(`derived predict ${spm} spm, converged = ${r.converged}, cycles marched = ${r.cycles}, warnings = ${codes(r.warnings)}`);
  w(`derived predict ${spm} spm, time step = ${e(r.dt, 6)} s, damping coefficient kappa = ${f(r.kappaPerS, 9)} per s, fastest section wave speed = ${f(r.waveSpeedFtS, 6)} ft/s`);
  w(`derived predict ${spm} spm, buoyed rod weight carried by the polished rod at rest = ${f(tapStr.weightFluidLb, 9)} lb`);
  w(`derived predict ${spm} spm, the peak load stands ${f(r.prlPeakLb - tapStr.weightFluidLb, 9)} lb above the buoyed weight, and the minimum stands ${f(tapStr.weightFluidLb - r.prlMinLb, 9)} lb below it`);
}
w('# HOW LONG THE WAVE TAKES TO GET THERE. Professional m01 l02. The rod string is');
w('# a wave guide, and the one number that says whether a design is dynamic is how');
w('# many times the wave crosses the string in one stroke. DERIVED on the published');
w('# taper, contiguous over the same speeds as the overtravel ladder.');
w(`derived wave transit, published taper: length = ${f(tapStr.lengthFt, 1)} ft, fastest section wave speed = ${f(pubPredict(9).waveSpeedFtS, 6)} ft/s`);
w(`derived wave transit, published taper: one way transit = ${f(tapStr.lengthFt / pubPredict(9).waveSpeedFtS, 9)} s, and a round trip = ${f((2 * tapStr.lengthFt) / pubPredict(9).waveSpeedFtS, 9)} s`);
for (const spm of [0.5, 1, 2, 3, 5, 7, 9, 11, 13, 15]) {
  const period = 60 / spm;
  const rt = (2 * tapStr.lengthFt) / pubPredict(9).waveSpeedFtS;
  w(`derived wave transit, published taper at ${f(spm, 1)} spm: stroke period = ${f(period, 9)} s, round trips of the string per stroke = ${f(period / rt, 9)}, speed over the fundamental = ${f(spm / tapFrq.nPrimeSpm, 9)}`);
}
w('# A STRING THAT THE WAVE CROSSES A HUNDRED TIMES A STROKE IS A SPRING. A string');
w('# it crosses a handful of times is a wave machine, and the two rules for the');
w('# plunger stroke separate over exactly that range.');
w('# THE ENGINE REFUSES an undamped march rather than producing a confident answer.');
const noDamp = pubPredict(9, { dampingRatio: 0 });
w(`derived predict refusal, damping ratio 0: ok = ${noDamp.ok}`);
w(`derived predict refusal, message: ${noDamp.error}`);
w('');

// ============================================================ SECTION 12
w('# SECTION 12: THE SPRING RULE AGAINST THE WAVE EQUATION. TWO ROUTES, ONE STROKE.');
w('# Professional m02 owns this and it is the first of the four results.');
w('# THE SAME QUANTITY IS COMPUTED TWO WAYS HERE AND THE LABELS DIFFER:');
w('#   "spring rule"  is S - Fo Er, closed form. It subtracts the static stretch of');
w('#                  the whole string under the fluid load from the surface stroke,');
w('#                  and it knows nothing about a rod string that is still moving');
w('#                  when the polished rod turns round.');
w('#   "wave march"   is predictCard plungerStrokeIn, the peak to trough travel of');
w('#                  the pump end node over one settled cycle.');
w('# The wave answer is LONGER at every speed on this page, and the difference is');
w('# inertial OVERTRAVEL. Read the whole contiguous ladder below rather than one');
w('# row. The overtravel is small near the static limit and large at a working');
w('# speed, but it is NOT MONOTONE in between: single rows step back below the row');
w('# before them, because the settled cycle a march lands on depends on where the');
w('# valve transfers fall relative to the wave arriving back from the pump, and');
w('# that phase is not a smooth function of speed. Quote the two ends of the ladder');
w('# to show the overtravel is a property of the march rather than a coincidence of');
w('# one case, and quote the ragged middle to show what a speed sweep on this');
w('# solver actually looks like. Never quote a rising trio and call it a trend.');
w(`derived spring rule, published taper: surface stroke S = ${f(P_STROKE_IN, 6)} in, fluid load Fo = ${f(P_FO, 6)} lb, Er = ${e(tapStr.erInPerLb, 9)} in/lb`);
w(`derived spring rule, published taper: static stretch Fo Er = ${f(P_FO * tapStr.erInPerLb, 9)} in`);
w(`derived spring rule, published taper: S - Fo Er = ${f(P_STROKE_IN - P_FO * tapStr.erInPerLb, 9)} in, AND THIS NUMBER DOES NOT DEPEND ON SPEED`);
w('# THE LADDER BELOW IS PRINTED IN FULL, every speed this generator ran, from the');
w('# near static bottom to the top of the useful range. The engine own test suite');
w('# gates the static limit at half a stroke a minute, where it requires the wave');
w('# answer to land within one percent of the spring rule, so the slow rows are not');
w('# decoration: they are the check the whole module stands on.');
for (const spm of [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]) {
  const r = pubPredict(spm);
  const rule = P_STROKE_IN - P_FO * tapStr.erInPerLb;
  w(`derived overtravel, published taper at ${f(spm, 1)} spm: spring rule = ${f(rule, 9)} in, wave march = ${f(r.plungerStrokeIn, 9)} in, `
    + `overtravel = ${f(r.plungerStrokeIn - rule, 9)} in, which is ${f(((r.plungerStrokeIn - rule) / rule) * 100, 6)} percent of the spring rule, `
    + `speed over the fundamental = ${f(spm / tapFrq.nPrimeSpm, 9)}, converged = ${r.converged}, `
    + `peak load = ${f(r.prlPeakLb, 6)} lb against a buoyed weight plus fluid load of ${f(tapStr.weightFluidLb + P_FO, 6)} lb, `
    + `minimum load = ${f(r.prlMinLb, 6)} lb against a buoyed weight of ${f(tapStr.weightFluidLb, 6)} lb`);
}
w('# READ THE TOP AND THE BOTTOM OF THAT LADDER TOGETHER. At the slow end the wave');
w('# march lands on the spring rule and the two loads land on the buoyed weight plus');
w('# the fluid load and on the buoyed weight alone, which is what a rod string does');
w('# when it is only a spring. Everything the course calls dynamic is the distance');
w('# between that bottom row and the row a real unit runs at.');
w(`teaching spring rule, ODUMA-4: surface stroke S = ${f(S_IN, 9)} in, fluid load Fo = ${f(T_FO, 9)} lb, Er = ${e(teaStr.erInPerLb, 9)} in/lb`);
w(`teaching spring rule, ODUMA-4: static stretch Fo Er = ${f(T_FO * teaStr.erInPerLb, 9)} in`);
w(`teaching spring rule, ODUMA-4: S - Fo Er = ${f(S_IN - T_FO * teaStr.erInPerLb, 9)} in, and it does not depend on speed either`);
for (let spm = 4; spm <= 14; spm += 1) {
  const d = teaDesign({ spm });
  const rule = S_IN - T_FO * teaStr.erInPerLb;
  if (!d.ok) { w(`teaching overtravel, ODUMA-4 at ${f(spm, 1)} spm: refused, ${d.errors[0]}`); continue; }
  w(`teaching overtravel, ODUMA-4 at ${f(spm, 1)} spm: spring rule = ${f(rule, 9)} in, wave march = ${f(d.design.plungerStrokeIn, 9)} in, `
    + `overtravel = ${f(d.design.plungerStrokeIn - rule, 9)} in, which is ${f(((d.design.plungerStrokeIn - rule) / rule) * 100, 6)} percent of the spring rule, `
    + `speed over the fundamental = ${f(spm / teaFrq.nPrimeSpm, 9)}`);
}
w('# THE OVERTRAVEL IS AN INERTIA EFFECT, so it should shrink when the string is');
w('# stiffer relative to the load it carries. DERIVED: the published case at 9 spm');
w('# with the fluid load walked down, everything else held. The spring rule moves');
w('# too, because Fo is in it, so the PERCENTAGE is the column to read.');
for (const fo of [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]) {
  const r = pubPredict(9, {});
  const rr = RD.predictCard({ string: tapStr, surfacePosition: P_SHM, strokeFt: P_STROKE_IN / 12, spm: 9, fluidLoadLb: fo, fillage: 1, dampingRatio: P_ZETA });
  const rule = P_STROKE_IN - fo * tapStr.erInPerLb;
  void r;
  w(`derived overtravel by load, published taper at 9 spm with fluid load ${f(fo, 1)} lb: spring rule = ${f(rule, 9)} in, wave march = ${f(rr.plungerStrokeIn, 9)} in, `
    + `overtravel = ${f(rr.plungerStrokeIn - rule, 9)} in, which is ${f(((rr.plungerStrokeIn - rule) / rule) * 100, 6)} percent`);
}
w('# WHICH ONE IS THE STROKE. The wave answer is, because it is the travel of the');
w('# plunger the barrel actually sees, and it is what displacementBpd is fed. The');
w('# spring rule is the static limit of the same thing, and the difference between');
w('# them is not an error in either: it is the inertia the static rule has no term for.');
w('');

// ============================================================ SECTION 13
w('# SECTION 13: STATIC STRETCH ON ITS OWN');
w('# Professional m02 l01. DERIVED. rodStretchIn is Er times the load, so it is');
w('# linear, and the plunger loses that much head before it moves at all.');
for (const load of [1000, 2500, 5000, 7500, 10000]) {
  w(`derived static stretch, published taper under ${f(load, 1)} lb applied at the pump = ${f(RS.rodStretchIn({ string: tapStr, loadLb: load }), 9)} in`);
  w(`derived static stretch, published uniform string under ${f(load, 1)} lb = ${f(RS.rodStretchIn({ string: uniStr, loadLb: load }), 9)} in`);
  w(`teaching static stretch, ODUMA-4 under ${f(load, 1)} lb = ${f(RS.rodStretchIn({ string: teaStr, loadLb: load }), 9)} in`);
}
w(`teaching static stretch, ODUMA-4 under its own fluid load of ${f(T_FO, 6)} lb = ${f(RS.rodStretchIn({ string: teaStr, loadLb: T_FO }), 9)} in, which is ${f((RS.rodStretchIn({ string: teaStr, loadLb: T_FO }) / S_IN) * 100, 6)} percent of the surface stroke`);
w('');

// ============================================================ SECTION 14
w('# SECTION 14: THE TEACHING WELL DESIGN, IN FULL, AT THE SHIPPED DEFAULTS');
w('# This is what runRodPumpDesign RETURNS on ODUMA-4. Every load on this page is');
w('# the SUBSAMPLED pair, because that is what the function reports and what a');
w('# studio user sees. Section 18 is what the march actually computed.');
const T0 = teaDesign();
const G0 = T0.design;
w(`teaching design, ok = ${T0.ok}, errors = ${T0.errors.length}, warnings = ${codes(G0.warnings)}`);
w(`teaching design, fluid load = ${f(G0.fluidLoadLb, 9)} lb`);
w(`teaching design, plunger area = ${f(G0.plungerAreaIn2, 9)} in2`);
w(`teaching design, plunger stroke = ${f(G0.plungerStrokeIn, 9)} in`);
w(`teaching design, peak polished rod load as reported = ${f(G0.pprlLb, 9)} lb`);
w(`teaching design, minimum polished rod load as reported = ${f(G0.mprlLb, 9)} lb`);
w(`teaching design, load range as reported = ${f(G0.pprlLb - G0.mprlLb, 9)} lb`);
w(`teaching design, card area = ${f(G0.cardAreaInLb, 6)} in-lb per cycle`);
w(`teaching design, polished rod horsepower = ${f(G0.prhp, 9)} hp`);
w(`teaching design, rated displacement on the surface stroke = ${f(G0.ratedBpd, 9)} bbl/d`);
w(`teaching design, swept displacement on the plunger stroke = ${f(G0.sweptBpd, 9)} bbl/d`);
w(`teaching design, produced rate = ${f(G0.producedBpd, 9)} bbl/d`);
w(`teaching design, produced over rated = ${f(G0.producedBpd / G0.ratedBpd, 9)} dimensionless`);
w(`teaching design, marched steps in a cycle = ${G0.dynamics.samples}, card points after decimation = ${G0.dynamics.surfaceCard.length}, decimation stride = ${Math.max(1, Math.floor(G0.dynamics.samples / 180))}`);
w(`teaching design, converged = ${G0.dynamics.converged}, cycles marched = ${G0.dynamics.cycles}, time step = ${e(G0.dynamics.dt, 6)} s, kappa = ${f(G0.dynamics.kappaPerS, 9)} per s`);
w(`teaching design, envelope samples along the string = ${G0.dynamics.tensionEnvelope.length}, shallowest at ${f(G0.dynamics.tensionEnvelope[0].depthFt, 6)} ft, deepest at ${f(G0.dynamics.tensionEnvelope[G0.dynamics.tensionEnvelope.length - 1].depthFt, 6)} ft`);
w('# THE RP 11L DIMENSIONLESS GROUPS the answer is read in. They are definitions, so');
w('# they are computed whatever route produced the loads. torqueGroup is ZERO here');
w('# because no balance was passed, and Section 22 is what that means.');
w(`teaching design groups, N over N0 = ${f(G0.groups.nOverN0, 9)}`);
w(`teaching design groups, N over N prime = ${f(G0.groups.nOverNPrime, 9)}`);
w(`teaching design groups, Fo over Skr = ${f(G0.groups.foOverSkr, 9)}`);
w(`teaching design groups, Sp over S = ${f(G0.groups.spOverS, 9)}`);
w(`teaching design groups, F1 over Skr = ${f(G0.groups.f1OverSkr, 9)}`);
w(`teaching design groups, F2 over Skr = ${f(G0.groups.f2OverSkr, 9)}`);
w(`teaching design groups, Skr = ${f(G0.groups.skrLb, 6)} lb`);
w(`teaching design groups, torqueGroup with no balance passed = ${f(G0.groups.torqueGroup, 9)}`);
w('# THE SECTION STRESSES, as runRodPumpDesign returns them, at a service factor of 1.');
G0.stresses.forEach((s, i) => {
  w(`teaching design stress, section ${i + 1} (${s.label}, top at ${f(s.topDepthFt, 3)} ft): envelope sample read at ${f(G0.dynamics.tensionEnvelope.reduce((a, b) => (Math.abs(b.depthFt - s.topDepthFt) < Math.abs(a.depthFt - s.topDepthFt) ? b : a), G0.dynamics.tensionEnvelope[0]).depthFt, 6)} ft, `
    + `maximum load = ${f(s.maxLoadLb, 6)} lb, minimum load = ${f(s.minLoadLb, 6)} lb, `
    + `maximum stress = ${f(s.maxStressPsi, 6)} psi, minimum stress = ${f(s.minStressPsi, 6)} psi, `
    + `Goodman allowable = ${f(s.allowablePsi, 6)} psi, loading = ${f(s.loadingPct, 9)} percent`);
});
w(`teaching design stress, worst section = ${G0.worstSection.label} at ${f(G0.worstSection.loadingPct, 9)} percent of its modified Goodman allowable`);
w('# THE SURFACE CARD, twenty four points read off the returned card at an even');
w('# stride, contiguous through the cycle. This is the decimated card, and it is');
w('# the ONLY card the function returns.');
{
  const c = G0.dynamics.surfaceCard;
  const step = Math.max(1, Math.floor(c.length / 24));
  for (let i = 0; i < c.length; i += step) {
    w(`teaching design surface card, point ${i + 1} of ${c.length}, cycle fraction ${f(c[i].tFrac, 6)}: position = ${f(c[i].positionIn, 9)} in, polished rod load = ${f(c[i].loadLb, 9)} lb`);
  }
}
w('# THE PUMP CARD from the same march, at the same stride. The two vertical sides');
w('# of the parallelogram ARE the two valve transfers, where the plunger is held');
w('# still and the rod above it stretches or relaxes.');
{
  const c = G0.dynamics.pumpCard;
  const step = Math.max(1, Math.floor(c.length / 24));
  for (let i = 0; i < c.length; i += step) {
    w(`teaching design pump card, point ${i + 1} of ${c.length}, cycle fraction ${f(c[i].tFrac, 6)}: plunger position = ${f(c[i].positionIn, 9)} in, pump load = ${f(c[i].loadLb, 9)} lb`);
  }
}
w(`teaching design pump card, the pump load takes exactly two values away from the transfers: ${f(T_FO, 9)} lb while lifting or pounding down, and 0 lb while falling`);
w(`teaching design pump card, area of the pump card = ${f(RP.cardArea(G0.dynamics.pumpCard), 6)} in-lb per cycle, against a surface card area of ${f(G0.cardAreaInLb, 6)} in-lb per cycle`);
w(`teaching design pump card, the surface card is larger by ${f(G0.cardAreaInLb - RP.cardArea(G0.dynamics.pumpCard), 6)} in-lb per cycle, which is the work the rods and the damping absorb`);
w('');

w('# WHAT MOVES THE LOADS. Professional m03 l04. TEACHING sweeps on ODUMA-4, one');
w('# input at a time, everything else held at the Section 10 inputs. Read each as a');
w('# contiguous sequence. The damping ratio is the input nobody measures, and it');
w('# moves the two loads more than most designers expect.');
for (const z of [0.05, 0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20]) {
  const d = teaDesign({ dampingRatio: z });
  if (!d.ok) { w(`teaching damping sweep, ODUMA-4 at a damping ratio of ${f(z, 4)}: refused, ${d.errors[0]}`); continue; }
  w(`teaching damping sweep, ODUMA-4 at a damping ratio of ${f(z, 4)}: plunger stroke = ${f(d.design.plungerStrokeIn, 6)} in, PPRL = ${f(d.design.pprlLb, 6)} lb, MPRL = ${f(d.design.mprlLb, 6)} lb, `
    + `load range = ${f(d.design.pprlLb - d.design.mprlLb, 6)} lb, horsepower = ${f(d.design.prhp, 6)} hp, produced = ${f(d.design.producedBpd, 6)} bbl/d, `
    + `worst loading = ${f(d.design.worstSection.loadingPct, 6)} percent, kappa = ${f(d.design.dynamics.kappaPerS, 9)} per s, converged = ${d.design.dynamics.converged}, warnings = ${codes(d.design.warnings)}`);
}
{
  const zs = [0.05, 0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20].map((z) => teaDesign({ dampingRatio: z }).design);
  w(`teaching damping sweep, ODUMA-4: across those nine contiguous rows PPRL moves ${f(Math.max(...zs.map((x) => x.pprlLb)) - Math.min(...zs.map((x) => x.pprlLb)), 6)} lb and MPRL moves ${f(Math.max(...zs.map((x) => x.mprlLb)) - Math.min(...zs.map((x) => x.mprlLb)), 6)} lb`);
  w(`teaching damping sweep, ODUMA-4: and the plunger stroke moves ${f(Math.max(...zs.map((x) => x.plungerStrokeIn)) - Math.min(...zs.map((x) => x.plungerStrokeIn)), 6)} in, on an input the engine header says field strings only sit BETWEEN about 0.05 and 0.15 of critical`);
}
w('# THE PLUNGER SIZE MOVES BOTH THE LOAD AND THE VOLUME, in opposite directions on');
w('# the thing a designer cares about. TEACHING sweep on ODUMA-4, contiguous over');
w('# the API bores the string will accept.');
for (const d0 of [1.25, 1.5, 1.75, 2.0, 2.25]) {
  const d = teaDesign({ plungerDIn: d0 });
  if (!d.ok) { w(`teaching plunger sweep, ODUMA-4 with a ${f(d0, 4)} in plunger: refused, ${d.errors[0]}`); continue; }
  w(`teaching plunger sweep, ODUMA-4 with a ${f(d0, 4)} in plunger: fluid load = ${f(d.design.fluidLoadLb, 6)} lb, plunger stroke = ${f(d.design.plungerStrokeIn, 6)} in, `
    + `PPRL = ${f(d.design.pprlLb, 6)} lb, MPRL = ${f(d.design.mprlLb, 6)} lb, produced = ${f(d.design.producedBpd, 6)} bbl/d, `
    + `worst loading = ${f(d.design.worstSection.loadingPct, 6)} percent, horsepower = ${f(d.design.prhp, 6)} hp, warnings = ${codes(d.design.warnings)}`);
}
w('# THE FLUID GRAVITY MOVES THE BUOYED WEIGHT AND THEREFORE BOTH LOADS, and it');
w('# moves nothing else in the string. TEACHING sweep on ODUMA-4, contiguous.');
for (const sg of [0.75, 0.80, 0.85, 0.90, 0.95, 1.00, 1.05]) {
  const st2 = RS.buildRodString({ sections: T_SEC, fluidSg: sg, gradeId: T_GRADE });
  const fq2 = RS.naturalFrequency({ string: st2 });
  const d = RP.runRodPumpDesign({
    string: st2, frequency: fq2, surfacePosition: SURF, strokeIn: S_IN, spm: T_SPM,
    plungerDIn: T_PD, pDischargePsi: T_PDIS, pIntakePsi: T_PINT,
    fillage: T_FILL, dampingRatio: T_ZETA, serviceFactor: 1.0,
  });
  w(`teaching gravity sweep, ODUMA-4 in fluid of specific gravity ${f(sg, 4)}: buoyancy factor = ${f(st2.buoyancy, 9)}, buoyed weight = ${f(st2.weightFluidLb, 6)} lb, `
    + `PPRL = ${f(d.design.pprlLb, 6)} lb, MPRL = ${f(d.design.mprlLb, 6)} lb, plunger stroke = ${f(d.design.plungerStrokeIn, 6)} in, `
    + `worst loading = ${f(d.design.worstSection.loadingPct, 6)} percent`);
}
w('# NOTE WHAT DOES NOT MOVE DOWN THAT LAST COLUMN: the spring rate and the elastic');
w('# constant are properties of the steel and the geometry, so the fluid changes the');
w('# weight the polished rod carries and not how far the string stretches under a');
w('# given load.');
w('');

// ============================================================ SECTION 15
w('# SECTION 15: POWER, AND WHAT POWER DOES NOT INCLUDE');
w('# Professional m04. DERIVED and TEACHING. Polished rod horsepower is the card');
w('# area times the speed, divided by 12 in per ft and by 33000 ft-lb per minute per');
w('# horsepower. It is the power delivered AT THE POLISHED ROD: it contains no');
w('# gearbox loss, no belt loss, no motor efficiency and no counterbalance work.');
for (const spm of [6, 8, 10, 12]) {
  const d = teaDesign({ spm });
  if (!d.ok) continue;
  w(`teaching power, ODUMA-4 at ${f(spm, 1)} spm: card area = ${f(d.design.cardAreaInLb, 6)} in-lb per cycle, polished rod horsepower = ${f(d.design.prhp, 9)} hp, `
    + `card area times speed over 396000 = ${f((d.design.cardAreaInLb * spm) / (12 * 33000), 9)} hp`);
}
w(`teaching power, ODUMA-4 at ${T_SPM} spm, horsepower per barrel produced = ${f(G0.prhp / G0.producedBpd, 9)} hp per bbl/d`);
w(`derived power, published taper at 9 spm: card area = ${f(pubPredict(9).workInLbPerCycle, 6)} in-lb per cycle, polished rod horsepower = ${f(RP.polishedRodHp({ workInLbPerCycle: pubPredict(9).workInLbPerCycle, spm: 9 }), 9)} hp`);
w(`derived power, published taper at 5 spm: card area = ${f(pubPredict(5).workInLbPerCycle, 6)} in-lb per cycle, polished rod horsepower = ${f(RP.polishedRodHp({ workInLbPerCycle: pubPredict(5).workInLbPerCycle, spm: 5 }), 9)} hp`);
w('# THE CARD AREA IS A SHOELACE INTEGRAL over a closed loop of load against');
w('# position, so it is exactly as good as the loop it is given. Section 18 sweeps');
w('# the sampling and the area moves with it.');
w('');
// ============================================================ SECTION 16
w('# SECTION 16: WHAT THE MARCH ACCUMULATES, AND WHAT IT THEN THROWS AWAY');
w('# Expert m01 l01 and l02. The march runs at the Courant step. The tension');
w('# envelope is accumulated over EVERY ONE of those steps at every node. The');
w('# surface card is then DECIMATED, by taking every stride-th recorded step, to a');
w('# few hundred points, and prlPeakLb and prlMinLb are the maximum and minimum of');
w('# THAT SUBSAMPLE. Two different samplings of one march, in one return object.');
w(`teaching sampling, ODUMA-4 at the shipped defaults: marched steps in a cycle = ${G0.dynamics.samples}`);
w(`teaching sampling, ODUMA-4: cardSamples default = 180, decimation stride = ${Math.max(1, Math.floor(G0.dynamics.samples / 180))}, points kept = ${G0.dynamics.surfaceCard.length}`);
w(`teaching sampling, ODUMA-4: the card keeps ${f((G0.dynamics.surfaceCard.length / G0.dynamics.samples) * 100, 6)} percent of the steps the march computed`);
w(`teaching sampling, ODUMA-4: the tension envelope is accumulated over all ${G0.dynamics.samples} steps, at all ${G0.dynamics.tensionEnvelope.length} interior nodes`);
w(`teaching sampling, ODUMA-4: node spacing dx = ${f(teaStr.lengthFt / 120, 9)} ft on the default 120 node grid, and the shallowest envelope sample sits at dx/2 = ${f(G0.dynamics.tensionEnvelope[0].depthFt, 9)} ft`);
w(`derived sampling, published taper at 9 spm: marched steps = ${pubPredict(9).samples}, card points = ${pubPredict(9).surfaceCard.length}, stride = ${Math.max(1, Math.floor(pubPredict(9).samples / 180))}`);
w(`derived sampling, published taper at 5 spm: marched steps = ${pubPredict(5).samples}, card points = ${pubPredict(5).surfaceCard.length}, stride = ${Math.max(1, Math.floor(pubPredict(5).samples / 180))}`);
w('# runRodPumpDesign EXPOSES NEITHER cardSamples NOR nodes. Every sweep in Sections');
w('# 17 to 20 therefore calls predictCard directly, which is the only way in. That is');
w('# itself the finding: a studio user gets the subsampled pair and cannot ask for');
w('# the other one.');
w(`derived sampling, the parameters predictCard accepts and runRodPumpDesign does not forward: cardSamples default 180, nodes default 120, maxCycles default 20, tol default ${1e-4}`);
w('');

// ============================================================ SECTION 17
w('# SECTION 17: THE cardSamples SWEEP. THE REPORTED LOADS WALKING TOWARD THE REAL');
w('# ONES. Expert m01 l02 and l04, and this is the second of the four results.');
w('# ONLY cardSamples changes. The march is bit for bit identical at every row:');
w('# same nodes, same time step, same cycles, same plunger stroke. What moves is');
w('# which of the marched steps survive into the card the two loads are read off.');
w('# READ THE WHOLE CONTIGUOUS SEQUENCE, INCLUDING THE UGLY COARSE ROWS. The trend');
w('# is that the peak rises and the minimum falls toward the marched values, because');
w('# a coarse sample is unlikely to land on either extreme, but neither column is');
w('# MONOTONE: a coarse stride can happen to land near an extreme and then miss it');
w('# again at the next stride. The minimum moves much further than the peak, because');
w('# the minimum sits in the narrow load transfer where the card is changing fastest.');
w('# The last rows are the march itself: once the stride reaches 1 there is nothing');
w('# left to throw away.');
const csList = [45, 60, 90, 120, 180, 240, 360, 540, 900, 1500, 3000, 7000, 20000];
for (const [nm, mk, lbl] of [
  ['published taper at 9 spm', (cs) => pubPredict(9, { cardSamples: cs }), 'derived'],
  ['published taper at 5 spm', (cs) => pubPredict(5, { cardSamples: cs }), 'derived'],
  ['ODUMA-4', (cs) => teaCard({ cardSamples: cs }), 'teaching'],
]) {
  const full = mk(1000000);
  for (const cs of csList) {
    const r = mk(cs);
    w(`${lbl} cardSamples, ${nm}, cardSamples = ${cs}: points kept = ${r.surfaceCard.length}, stride = ${Math.max(1, Math.floor(r.samples / cs))}, `
      + `reported peak = ${f(r.prlPeakLb, 6)} lb, reported minimum = ${f(r.prlMinLb, 6)} lb, reported range = ${f(r.prlPeakLb - r.prlMinLb, 6)} lb, `
      + `card area = ${f(r.workInLbPerCycle, 4)} in-lb, plunger stroke = ${f(r.plungerStrokeIn, 9)} in`);
  }
  w(`${lbl} cardSamples, ${nm}, THE MARCH ITSELF (stride 1, every one of the ${full.samples} steps): `
    + `peak = ${f(full.prlPeakLb, 6)} lb, minimum = ${f(full.prlMinLb, 6)} lb, range = ${f(full.prlPeakLb - full.prlMinLb, 6)} lb, card area = ${f(full.workInLbPerCycle, 4)} in-lb`);
  const dflt = mk(180);
  w(`${lbl} cardSamples, ${nm}, WHAT THE DEFAULT COSTS: the reported peak is ${f(full.prlPeakLb - dflt.prlPeakLb, 6)} lb LOW, which is ${f(((full.prlPeakLb - dflt.prlPeakLb) / full.prlPeakLb) * 100, 6)} percent`);
  w(`${lbl} cardSamples, ${nm}, WHAT THE DEFAULT COSTS: the reported minimum is ${f(dflt.prlMinLb - full.prlMinLb, 6)} lb HIGH, which is ${f(((dflt.prlMinLb - full.prlMinLb) / full.prlMinLb) * 100, 6)} percent of the real minimum, a reported over real ratio of ${f(dflt.prlMinLb / full.prlMinLb, 9)}`);
  w(`${lbl} cardSamples, ${nm}, WHAT THE DEFAULT COSTS: the reported load range is ${f((full.prlPeakLb - full.prlMinLb) - (dflt.prlPeakLb - dflt.prlMinLb), 6)} lb NARROW, which is ${f((1 - (dflt.prlPeakLb - dflt.prlMinLb) / (full.prlPeakLb - full.prlMinLb)) * 100, 6)} percent`);
  w(`${lbl} cardSamples, ${nm}, WHAT THE DEFAULT COSTS: the card area is ${f(full.workInLbPerCycle - dflt.workInLbPerCycle, 4)} in-lb LOW, which is ${f(((full.workInLbPerCycle - dflt.workInLbPerCycle) / full.workInLbPerCycle) * 100, 6)} percent, and the polished rod horsepower moves with it`);
  w(`${lbl} cardSamples, ${nm}, AND THE PLUNGER STROKE DOES NOT MOVE AT ALL: ${f(dflt.plungerStrokeIn, 9)} in at the default against ${f(full.plungerStrokeIn, 9)} in at stride 1, a difference of ${e(full.plungerStrokeIn - dflt.plungerStrokeIn, 3)} in. The plunger stroke is a peak to trough of the pump node over every marched step and is never decimated.`);
}
w('# HOW BIG THE SUBSAMPLE ERROR IS DEPENDS ENTIRELY ON THE CASE, so a lesson must');
w('# not quote one percentage as though it were a property of the engine. TEACHING:');
w('# the default 180 point card against the full march, walked across the ODUMA-4');
w('# speed sweep, contiguous. The ratio column is reported minimum over marched');
w('# minimum, and it is only meaningful while both are the same sign; where the sign');
w('# differs the row says so instead, because that is a bigger finding than a ratio.');
for (let s2 = 7.0; s2 <= 13.001; s2 += 0.5) {
  const spm = Number(s2.toFixed(1));
  const a = teaCard({ spm });
  const b = teaCard({ spm, cardSamples: 1000000 });
  const sameSign = (a.prlMinLb > 0) === (b.prlMinLb > 0);
  w(`teaching subsample by speed, ODUMA-4 at ${f(spm, 1)} spm: reported minimum = ${f(a.prlMinLb, 6)} lb, marched minimum = ${f(b.prlMinLb, 6)} lb, `
    + `reported peak = ${f(a.prlPeakLb, 6)} lb, marched peak = ${f(b.prlPeakLb, 6)} lb, `
    + `peak reported low by ${f(((b.prlPeakLb - a.prlPeakLb) / b.prlPeakLb) * 100, 6)} percent, `
    + (sameSign
      ? `reported over marched minimum = ${f(a.prlMinLb / b.prlMinLb, 6)}`
      : 'THE TWO MINIMA HAVE OPPOSITE SIGNS, so the reported card and the march disagree about whether the polished rod load goes negative at all'));
}
w('# THE WORST ROW IN THAT SWEEP IS NOT A ROUNDING DIFFERENCE. At one speed the');
w('# reported minimum is more than three times the marched one, and at two others');
w('# the reported minimum is POSITIVE while the march found a NEGATIVE one. A');
w('# negative polished rod load means the polished rod is pushing down and the rods');
w('# are in compression, which is the single verdict the minimum load exists to');
w('# deliver, and on those rows the reported number delivers the opposite verdict.');
w('# THE SAME SWEEP AGAINST FILLAGE, contiguous, at the design speed. The emptier');
w('# the barrel the sharper the load transfer, and the sharper the transfer the more');
w('# a coarse card misses.');
for (const fl of [1.00, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70]) {
  const a = teaCard({ fillage: fl });
  const b = teaCard({ fillage: fl, cardSamples: 1000000 });
  w(`teaching subsample by fillage, ODUMA-4 at a fillage of ${f(fl, 4)}: reported minimum = ${f(a.prlMinLb, 6)} lb, marched minimum = ${f(b.prlMinLb, 6)} lb, `
    + `reported over marched = ${f(a.prlMinLb / b.prlMinLb, 6)}, reported peak = ${f(a.prlPeakLb, 6)} lb, marched peak = ${f(b.prlPeakLb, 6)} lb, `
    + `peak reported low by ${f(((b.prlPeakLb - a.prlPeakLb) / b.prlPeakLb) * 100, 6)} percent`);
}
w('# THE MINIMUM IS THE ONE THAT MATTERS. It is the number a designer uses to decide');
w('# whether the rods go into compression, and reporting it high is not a rounding');
w('# difference. It is a different verdict.');
{
  const dflt = teaCard();
  const full = teaCard({ cardSamples: 1000000 });
  w(`teaching cardSamples verdict, ODUMA-4: the reported minimum is ${f(dflt.prlMinLb, 6)} lb and the marched minimum is ${f(full.prlMinLb, 6)} lb`);
  w(`teaching cardSamples verdict, ODUMA-4: the reported minimum is ${f(dflt.prlMinLb / full.prlMinLb, 6)} times the real one`);
  w(`teaching cardSamples verdict, ODUMA-4: the buoyed rod weight is ${f(teaStr.weightFluidLb, 6)} lb, so the reported minimum sits ${f(teaStr.weightFluidLb - dflt.prlMinLb, 6)} lb below it and the real one sits ${f(teaStr.weightFluidLb - full.prlMinLb, 6)} lb below it`);
}
w('');

// ============================================================ SECTION 18
w('# SECTION 18: TWO PEAK LOADS OUT OF ONE RETURN OBJECT. TWO ROUTES, SAME CALL.');
w('# Expert m01 l03 and l05. THE SAME QUANTITY APPEARS TWICE AND THE LABELS DIFFER:');
w('#   "prlPeakLb"     is the maximum of the DECIMATED surface card.');
w('#   "envelope top"  is tensionEnvelope[0].maxLb, accumulated over EVERY marched');
w('#                   step, plus the buoyed weight of the rod above that node. The');
w('#                   shallowest envelope sample sits at dx/2 and not at the');
w('#                   surface, so that rod has to be added back.');
w('# Both come out of ONE call to predictCard. They disagree, and the design SPLITS');
w('# on the disagreement: sectionStresses and the modified Goodman line read the');
w('# envelope, while rating.structuralPct and the structuralOverload warning read');
w('# prlPeakLb. The trusting half is the subsampled one.');
{
  const r = teaCard();
  const env0 = r.tensionEnvelope[0];
  const above = teaStr.sections[0].weightLbPerFt * env0.depthFt * teaStr.buoyancy;
  const implied = env0.maxLb + above;
  const full = teaCard({ cardSamples: 1000000 });
  w(`teaching envelope, ODUMA-4: shallowest envelope node depth = ${f(env0.depthFt, 9)} ft`);
  w(`teaching envelope, ODUMA-4: envelope maximum at that node = ${f(env0.maxLb, 9)} lb`);
  w(`teaching envelope, ODUMA-4: envelope minimum at that node = ${f(env0.minLb, 9)} lb`);
  w(`teaching envelope, ODUMA-4: buoyed weight of the rod above that node = ${f(above, 9)} lb`);
  w(`teaching envelope, ODUMA-4: peak polished rod load IMPLIED BY THE ENVELOPE = ${f(implied, 9)} lb`);
  w(`teaching envelope, ODUMA-4: peak polished rod load AS prlPeakLb REPORTS IT = ${f(r.prlPeakLb, 9)} lb`);
  w(`teaching envelope, ODUMA-4: the disagreement INSIDE ONE RETURN OBJECT = ${f(implied - r.prlPeakLb, 9)} lb, which is ${f(((implied - r.prlPeakLb) / r.prlPeakLb) * 100, 6)} percent`);
  w(`teaching envelope, ODUMA-4: the fully sampled card gives ${f(full.prlPeakLb, 9)} lb, so the envelope route sits ${f(implied - full.prlPeakLb, 9)} lb from the march peak while prlPeakLb sits ${f(r.prlPeakLb - full.prlPeakLb, 9)} lb from it`);
  w('# THE SMALLER, SEPARATE EFFECT, stated so it is not confused with the first:');
  w('# sectionStresses reads the envelope sample NEAREST the top of each section, and');
  w('# the shallowest sample is at dx/2. So the top section is priced at the stress');
  w('# dx/2 down, one half node of buoyed rod light. That is a DISCRETISATION CHOICE,');
  w('# not a defect, and it is much smaller than the subsample.');
  w(`teaching envelope, ODUMA-4: the top section stress is read ${f(env0.depthFt, 9)} ft down, which is ${f(above, 9)} lb of buoyed rod light, ${f((above / implied) * 100, 6)} percent`);
  w('# THE WHOLE ENVELOPE, contiguous, at every eighth node from the surface down.');
  for (let i = 0; i < r.tensionEnvelope.length; i += 8) {
    const en = r.tensionEnvelope[i];
    w(`teaching envelope profile, ODUMA-4 node ${i + 1} of ${r.tensionEnvelope.length} at ${f(en.depthFt, 4)} ft: maximum tension = ${f(en.maxLb, 6)} lb, minimum tension = ${f(en.minLb, 6)} lb, range = ${f(en.maxLb - en.minLb, 6)} lb`);
  }
  const last = r.tensionEnvelope[r.tensionEnvelope.length - 1];
  w(`teaching envelope profile, ODUMA-4 deepest node at ${f(last.depthFt, 4)} ft: maximum tension = ${f(last.maxLb, 6)} lb, minimum tension = ${f(last.minLb, 6)} lb`);
  w(`teaching envelope profile, ODUMA-4: the deepest node carries a maximum close to the fluid load of ${f(T_FO, 6)} lb, which is what the plunger hangs on the string`);
}
w('# WHICH CHECK READS WHICH. TEACHING, on a rating that straddles the two loads on');
w('# purpose. C-320D-198-100 is a TEACHING DESIGNATION, not a manufacturer product:');
w('# the package ships no named unit dimensions and parseUnitDesignation will read');
w('# any well formed string. Its structural capacity was chosen to sit BETWEEN the');
w('# subsampled peak and the marched peak, so the two routes return different');
w('# verdicts on the same design.');
{
  const rating = PU.parseUnitDesignation('C-320D-198-100');
  const dR = teaDesign({ unitRating: rating });
  const full = teaCard({ cardSamples: 1000000 });
  w(`teaching rating split, structural capacity of the teaching designation = ${rating.structuralCapacityLb} lb, stroke rating = ${rating.strokeIn} in, gearbox rating = ${rating.torqueRatingInLb} in-lb`);
  w(`teaching rating split, structuralPct as the design reports it, from prlPeakLb = ${f(dR.design.rating.structuralPct, 9)} percent`);
  w(`teaching rating split, the same percentage computed from the marched peak instead = ${f((full.prlPeakLb / rating.structuralCapacityLb) * 100, 9)} percent`);
  w(`teaching rating split, warnings the design raises = ${codes(dR.design.warnings)}`);
  w(`teaching rating split, the structuralOverload warning fires above 100 percent, and on the subsampled route it does not fire on this design`);
  w(`teaching rating split, strokePct = ${f(dR.design.rating.strokePct, 9)} percent, torquePct = ${dR.design.rating.torquePct}`);
  w(`teaching rating split, worst section loading from the ENVELOPE = ${f(dR.design.worstSection.loadingPct, 9)} percent, which did not move when the rating changed because the Goodman line never reads a rating`);
  const ratingB = PU.parseUnitDesignation('C-320D-200-100');
  const dB = teaDesign({ unitRating: ratingB });
  w(`teaching rating split, on the standard looking C-320D-200-100 instead: structuralPct = ${f(dB.design.rating.structuralPct, 9)} percent from prlPeakLb, and ${f((full.prlPeakLb / ratingB.structuralCapacityLb) * 100, 9)} percent from the marched peak, warnings = ${codes(dB.design.warnings)}`);
}
w('');

// ============================================================ SECTION 19
w('# SECTION 19: THE CONVERGENCE STUDY. WHAT CONVERGES AND WHAT DOES NOT.');
w('# Expert m02 and the third of the four results. ONLY nodes changes. The time step');
w('# follows the Courant condition, so the marched steps rise with the node count.');
w('# The notPeriodic flag is printed at EVERY row, contiguous, so its behaviour can');
w('# be read rather than described.');
w('# The loading column is recomputed STANDALONE by this generator from the same');
w('# card, using sectionStresses and modifiedGoodman exactly as runRodPumpDesign');
w('# does, because runRodPumpDesign does not expose nodes. On the default 120 node');
w('# grid the standalone route reproduces the design return to every figure, which');
w('# is the check on it, and that agreement is printed below.');
const nodeList = [60, 120, 240, 480, 960, 1920];
for (const [nm, mk, st, lbl] of [
  ['published taper at 9 spm', (n) => pubPredict(9, { nodes: n }), tapStr, 'derived'],
  ['ODUMA-4 at the shipped damping', (n) => teaCard({ nodes: n }), teaStr, 'teaching'],
  ['ODUMA-4 at 11 spm and a damping ratio of 0.05', (n) => RD.predictCard({ string: teaStr, surfacePosition: SURF, strokeFt: S_IN / 12, spm: 11, fluidLoadLb: T_FO, fillage: T_FILL, dampingRatio: 0.05, nodes: n }), teaStr, 'teaching'],
]) {
  const rows = nodeList.map((n) => ({ n, r: mk(n) }));
  for (const { n, r } of rows) {
    w(`${lbl} convergence, ${nm}, nodes = ${n}: marched steps = ${r.samples}, plunger stroke = ${f(r.plungerStrokeIn, 9)} in, `
      + `PPRL = ${f(r.prlPeakLb, 6)} lb, MPRL = ${f(r.prlMinLb, 6)} lb, load range = ${f(r.prlPeakLb - r.prlMinLb, 6)} lb, `
      + `converged = ${r.converged}, cycles marched = ${r.cycles}, notPeriodic raised = ${r.warnings.some((x) => x.code === 'notPeriodic')}, `
      + `worst loading recomputed standalone = ${f(loadingStandalone(st, r).worst.loadingPct, 9)} percent`);
  }
  const sps = rows.map((x) => x.r.plungerStrokeIn);
  const pk = rows.map((x) => x.r.prlPeakLb);
  const mn = rows.map((x) => x.r.prlMinLb);
  const ld = rows.map((x) => loadingStandalone(st, x.r).worst.loadingPct);
  w(`${lbl} convergence, ${nm}, SPREAD over the six contiguous rows above: plunger stroke moves ${f(Math.max(...sps) - Math.min(...sps), 9)} in, which is ${f(((Math.max(...sps) - Math.min(...sps)) / Math.min(...sps)) * 100, 6)} percent`);
  w(`${lbl} convergence, ${nm}, SPREAD: PPRL moves ${f(Math.max(...pk) - Math.min(...pk), 6)} lb, which is ${f(((Math.max(...pk) - Math.min(...pk)) / Math.min(...pk)) * 100, 6)} percent of the smallest`);
  w(`${lbl} convergence, ${nm}, SPREAD: MPRL moves ${f(Math.max(...mn) - Math.min(...mn), 6)} lb, which is ${f(((Math.max(...mn) - Math.min(...mn)) / Math.abs(Math.min(...mn))) * 100, 6)} percent of the smallest in size`);
  w(`${lbl} convergence, ${nm}, SPREAD: the worst section loading moves ${f(Math.max(...ld) - Math.min(...ld), 9)} percentage points across the same six rows`);
  w(`${lbl} convergence, ${nm}, notPeriodic across the six contiguous rows in node order: ${rows.map((x) => `${x.n}:${x.r.warnings.some((y) => y.code === 'notPeriodic')}`).join(', ')}`);
}
w('# THE FLAG IS NOT MONOTONE IN RESOLUTION. On the low damping ODUMA-4 rows above,');
w('# coarse grids converge, a finer one does not, a finer one still does, and the');
w('# finest does not. So the message the flag prints, which asks the user to raise');
w('# the damping or check the inputs, cannot be read as a resolution problem. And');
w('# runRodPumpDesign exposes neither nodes nor maxCycles, so a caller who sees that');
w('# warning has nothing to turn.');
{
  const dflt = teaDesign({ spm: 11, dampingRatio: 0.05 });
  w(`teaching flag, ODUMA-4 at 11 spm and damping 0.05 through runRodPumpDesign at the shipped grid: warnings = ${codes(dflt.design.warnings)}`);
  const nm = RD.predictCard({ string: teaStr, surfacePosition: SURF, strokeFt: S_IN / 12, spm: 11, fluidLoadLb: T_FO, fillage: T_FILL, dampingRatio: 0.05, nodes: 480 });
  w(`teaching flag, the message the engine prints when it does raise it: ${nm.warnings.find((x) => x.code === 'notPeriodic').message}`);
  w(`teaching flag, maxCycles default = 20, and the unconverged row above stopped at ${nm.cycles} cycles`);
}
w('# THE STANDALONE LOADING ROUTE AGREES WITH THE DESIGN RETURN at the shipped grid,');
w('# which is what licenses using it for the node sweep above.');
w(`teaching loading routes, ODUMA-4 at the shipped defaults: runRodPumpDesign returns ${f(G0.worstSection.loadingPct, 12)} percent`);
w(`teaching loading routes, ODUMA-4 at the shipped defaults: this generator recomputes ${f(loadingStandalone(teaStr, G0.dynamics).worst.loadingPct, 12)} percent`);
w(`teaching loading routes, ODUMA-4: the two are strictly equal = ${loadingStandalone(teaStr, G0.dynamics).worst.loadingPct === G0.worstSection.loadingPct}`);
w('');
// ============================================================ SECTION 20
w('# SECTION 20: A NUMBER SMALLER THAN THE SOLVER OWN NOISE IS NOT A RESULT.');
w('# Expert m02 l04 and the fourth of the four results, and it is the tier hardest');
w('# habit. TWO SWEEPS ON ONE PAGE, both TEACHING, both on ODUMA-4, both of the same');
w('# quantity, so the comparison is a comparison and not an analogy:');
w('#   the SPEED sweep moves the pumping speed at the shipped 120 node grid;');
w('#   the NODE sweep holds the speed and moves the grid the same answer is');
w('#   computed on, which changes NOTHING about the well.');
w('# The loading here is the worst section loading, recomputed STANDALONE from the');
w('# card in both sweeps so the two columns are the same computation. It agrees');
w('# with the design return at the shipped grid, as Section 19 prints.');
w('# READ THE SPEED SWEEP AS A CONTIGUOUS SEQUENCE, every row from 9.0 to 13.0 spm.');
const spdList = [];
for (let s = 9.0; s <= 13.001; s += 0.2) spdList.push(Number(s.toFixed(1)));
const spdRows = spdList.map((spm) => {
  const r = teaCard({ spm });
  return { spm, r, loading: loadingStandalone(teaStr, r).worst.loadingPct };
});
for (const { spm, r, loading } of spdRows) {
  w(`teaching speed sweep, ODUMA-4 at ${f(spm, 1)} spm, 120 nodes: worst section loading = ${f(loading, 6)} percent, `
    + `PPRL as reported = ${f(r.prlPeakLb, 6)} lb, MPRL as reported = ${f(r.prlMinLb, 6)} lb, plunger stroke = ${f(r.plungerStrokeIn, 6)} in, `
    + `converged = ${r.converged}`);
}
{
  const idx = spdRows.findIndex((x) => x.spm === 10.6);
  const a = spdRows[idx - 1]; const b = spdRows[idx]; const c = spdRows[idx + 1];
  w(`teaching speed sweep, ODUMA-4: the loading DIPS at ${f(b.spm, 1)} spm. The three contiguous rows are ${f(a.loading, 6)}, ${f(b.loading, 6)} and ${f(c.loading, 6)} percent`);
  w(`teaching speed sweep, ODUMA-4: the depth of that dip below the row before it = ${f(a.loading - b.loading, 6)} percentage points`);
  w('# NOW THE SAME QUANTITY, SAME WELL, SAME SPEED, ONLY THE GRID MOVED. Nothing');
  w('# about the well changes down these rows. Whatever they spread by is the');
  w('# solver own noise on this number.');
  for (const spm of [10.2, 10.4, 10.6, 10.8]) {
    const vals = nodeList.map((n) => loadingStandalone(teaStr, teaCard({ spm, nodes: n })).worst.loadingPct);
    nodeList.forEach((n, i) => {
      w(`teaching node noise, ODUMA-4 at ${f(spm, 1)} spm, nodes = ${n}: worst section loading = ${f(vals[i], 6)} percent`);
    });
    w(`teaching node noise, ODUMA-4 at ${f(spm, 1)} spm: the loading spread across those six contiguous node counts = ${f(Math.max(...vals) - Math.min(...vals), 6)} percentage points, from ${f(Math.min(...vals), 6)} to ${f(Math.max(...vals), 6)} percent`);
  }
  const noise104 = (() => { const v = nodeList.map((n) => loadingStandalone(teaStr, teaCard({ spm: 10.4, nodes: n })).worst.loadingPct); return Math.max(...v) - Math.min(...v); })();
  const noise108 = (() => { const v = nodeList.map((n) => loadingStandalone(teaStr, teaCard({ spm: 10.8, nodes: n })).worst.loadingPct); return Math.max(...v) - Math.min(...v); })();
  w(`teaching noise against dip, ODUMA-4: the dip is ${f(a.loading - b.loading, 6)} percentage points deep`);
  w(`teaching noise against dip, ODUMA-4: the node spread at ${f(a.spm, 1)} spm is ${f(noise104, 6)} percentage points`);
  w(`teaching noise against dip, ODUMA-4: the node spread at ${f(c.spm, 1)} spm is ${f(noise108, 6)} percentage points`);
  w(`teaching noise against dip, ODUMA-4: the dip is ${f((a.loading - b.loading) / noise104, 6)} times the node spread at the row before it and ${f((a.loading - b.loading) / noise108, 6)} times the spread at the row after it`);
  w('# BOTH NUMBERS ARE ON THIS PAGE ON PURPOSE. The dip is real in the sense that');
  w('# the solver printed it. It is not a result, because moving a grid parameter');
  w('# that changes nothing about the well moves the same number further. Refusing a');
  w('# tempting reading on the grounds of the solver own noise is the single most');
  w('# transferable habit in this course, and it needs both numbers side by side.');
}
w('# THE PLUNGER STROKE IS THE HONEST HALF OF THE SAME SWEEP. Section 19 shows it');
w('# converging to a small fraction of a percent while the loads do not, so every');
w('# quantity proportional to the plunger stroke, which includes the swept and the');
w('# produced rate, survives the grid and the two load extremes do not.');
w('');

// ============================================================ SECTION 21
w('# SECTION 21: THE COUNTERBALANCE');
w('# Expert m03. TEACHING, on the ODUMA-4 card and the PUBLISHED linkage. A unit is');
w('# balanced when the largest torque the gearbox sees on the upstroke equals the');
w('# largest it sees on the downstroke, which is one scalar condition in one');
w('# unknown, closed by bisection on the difference between the two peaks. The');
w('# counterweight moment is anchored to the crank angle at the BOTTOM of the');
w('# polished rod stroke, not to whichever angle a maker calls zero, which is what');
w('# makes the sign right by construction.');
const teaLoadAt = cardLoadFn(G0.dynamics.surfaceCard);
const BAL = PU.balanceUnit({ kin: KIN, cardLoadAt: teaLoadAt, structuralUnbalanceLb: 0, crankOffsetDeg: 0, aIn: GEOM.aIn });
w(`teaching balance, ODUMA-4 with no structural unbalance and no crank offset: balanced = ${BAL.balanced}`);
w(`teaching balance, ODUMA-4: counterbalance moment = ${f(BAL.momentInLb, 6)} in-lb`);
w(`teaching balance, ODUMA-4: peak gearbox torque = ${f(BAL.peakTorqueInLb, 6)} in-lb`);
w(`teaching balance, ODUMA-4: counterbalance effect at the polished rod = ${f(BAL.counterbalanceEffectLb, 6)} lb`);
w(`teaching balance, ODUMA-4: the counterbalance effect is read a quarter turn from the bottom of the stroke, where the torque factor is ${f(Math.abs(KIN.samples[(KIN.bottomIndex + Math.round(KIN.samples.length / 4)) % KIN.samples.length].torqueFactorIn), 9)} in`);
w(`teaching balance, ODUMA-4: dividing the moment by the FRONT ARM instead would give ${f(BAL.momentInLb / GEOM.aIn, 6)} lb, which understates the effect by a factor of ${f(BAL.counterbalanceEffectLb / (BAL.momentInLb / GEOM.aIn), 6)}`);
w(`teaching balance, ODUMA-4: the buoyed rod weight is ${f(teaStr.weightFluidLb, 6)} lb and the counterbalance effect is ${f(BAL.counterbalanceEffectLb - teaStr.weightFluidLb, 6)} lb above it, which is roughly the rod weight plus half the fluid load of ${f(T_FO / 2, 6)} lb`);
w('# THE NET TORQUE THROUGH A REVOLUTION, contiguous, at every fifteen degrees. The');
w('# rod term is the torque factor times the polished rod load; the counterweight');
w('# term is a sine anchored to the bottom of the stroke.');
for (let k = 0; k < 24; k += 1) {
  const t = BAL.torque[k * 15];
  w(`teaching balance torque, ODUMA-4 crank ${f(k * 15, 1)} deg: torque factor = ${f(t.torqueFactorIn, 9)} in, polished rod load = ${f(t.prlLb, 6)} lb, `
    + `rod torque = ${f(t.rodTorqueInLb, 6)} in-lb, counterweight torque = ${f(t.counterbalanceTorqueInLb, 6)} in-lb, net torque = ${f(t.netTorqueInLb, 6)} in-lb`);
}
{
  const up = BAL.torque.filter((r) => r.torqueFactorIn < 0).map((r) => Math.abs(r.netTorqueInLb));
  const dn = BAL.torque.filter((r) => r.torqueFactorIn >= 0).map((r) => Math.abs(r.netTorqueInLb));
  w(`teaching balance, ODUMA-4: largest net torque on the upstroke = ${f(Math.max(...up), 6)} in-lb`);
  w(`teaching balance, ODUMA-4: largest net torque on the downstroke = ${f(Math.max(...dn), 6)} in-lb`);
  w(`teaching balance, ODUMA-4: the two peaks differ by ${e(Math.max(...up) - Math.max(...dn), 4)} in-lb, which is what balanced means`);
}
w('# WHAT AN UNBALANCED UNIT COSTS. DERIVED sweep of the moment around the balance');
w('# point, contiguous, with the two peaks printed separately so the crossing is');
w('# visible rather than asserted.');
for (const frac of [0, 0.25, 0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0]) {
  const m = BAL.momentInLb * frac;
  const t = PU.netTorque({ kin: KIN, cardLoadAt: teaLoadAt, counterbalanceMomentInLb: m, structuralUnbalanceLb: 0, crankOffsetDeg: 0 });
  const up = Math.max(...t.filter((r) => r.torqueFactorIn < 0).map((r) => Math.abs(r.netTorqueInLb)));
  const dn = Math.max(...t.filter((r) => r.torqueFactorIn >= 0).map((r) => Math.abs(r.netTorqueInLb)), 0);
  w(`teaching balance sweep, ODUMA-4 with a counterweight moment of ${f(m, 6)} in-lb, which is ${f(frac, 4)} of the balanced moment: `
    + `upstroke peak = ${f(up, 6)} in-lb, downstroke peak = ${f(dn, 6)} in-lb, larger of the two = ${f(Math.max(up, dn), 6)} in-lb`);
}
w(`teaching balance sweep, ODUMA-4: with NO counterweight at all the gearbox sees ${f(Math.max(...PU.netTorque({ kin: KIN, cardLoadAt: teaLoadAt, counterbalanceMomentInLb: 0 }).map((r) => Math.abs(r.netTorqueInLb))), 6)} in-lb`);
w(`teaching balance sweep, ODUMA-4: balancing it brings that down to ${f(BAL.peakTorqueInLb, 6)} in-lb, a reduction of ${f(100 * (1 - BAL.peakTorqueInLb / Math.max(...PU.netTorque({ kin: KIN, cardLoadAt: teaLoadAt, counterbalanceMomentInLb: 0 }).map((r) => Math.abs(r.netTorqueInLb)))), 6)} percent`);
w('# THE COUNTERBALANCE IS COMPUTED FROM THE CARD THE ENGINE RETURNS, WHICH IS THE');
w('# DECIMATED ONE. balanceUnit takes a cardLoadAt, and the only surface card');
w('# predictCard hands out is the subsample of Section 17. So the subsample runs one');
w('# level further than Section 18 said: not only does rating.structuralPct read the');
w('# subsampled peak, rating.torquePct reads a torque BALANCED against the subsampled');
w('# card. TEACHING, the same march balanced twice, once off the default card and');
w('# once off the full march card.');
{
  const fullCard = teaCard({ cardSamples: 1000000 });
  const balFull = PU.balanceUnit({ kin: KIN, cardLoadAt: cardLoadFn(fullCard.surfaceCard), structuralUnbalanceLb: 0, crankOffsetDeg: 0, aIn: GEOM.aIn });
  w(`teaching balance sampling, ODUMA-4 balanced off the DEFAULT ${G0.dynamics.surfaceCard.length} point card: moment = ${f(BAL.momentInLb, 6)} in-lb, peak torque = ${f(BAL.peakTorqueInLb, 6)} in-lb, counterbalance effect = ${f(BAL.counterbalanceEffectLb, 6)} lb`);
  w(`teaching balance sampling, ODUMA-4 balanced off the FULL ${fullCard.surfaceCard.length} point march card: moment = ${f(balFull.momentInLb, 6)} in-lb, peak torque = ${f(balFull.peakTorqueInLb, 6)} in-lb, counterbalance effect = ${f(balFull.counterbalanceEffectLb, 6)} lb`);
  w(`teaching balance sampling, ODUMA-4: the decimation moves the counterbalance moment by ${f(BAL.momentInLb - balFull.momentInLb, 6)} in-lb, which is ${f(((BAL.momentInLb - balFull.momentInLb) / balFull.momentInLb) * 100, 6)} percent`);
  w(`teaching balance sampling, ODUMA-4: it moves the peak gearbox torque by ${f(balFull.peakTorqueInLb - BAL.peakTorqueInLb, 6)} in-lb, which is ${f(((balFull.peakTorqueInLb - BAL.peakTorqueInLb) / balFull.peakTorqueInLb) * 100, 6)} percent, and the default card reads it LOW`);
  w(`teaching balance sampling, ODUMA-4: and the counterbalance effect by ${f(BAL.counterbalanceEffectLb - balFull.counterbalanceEffectLb, 6)} lb`);
  const rating = PU.parseUnitDesignation('C-320D-200-100');
  w(`teaching balance sampling, ODUMA-4: torquePct against a ${rating.torqueRatingInLb} in-lb gearbox is ${f((BAL.peakTorqueInLb / rating.torqueRatingInLb) * 100, 9)} percent from the default card and ${f((balFull.peakTorqueInLb / rating.torqueRatingInLb) * 100, 9)} percent from the full march`);
}
w('# AND counterbalanceEffect DOES NOT READ THE CRANK OFFSET, ALTHOUGH netTorque IN');
w('# THE SAME FUNCTION DOES. balanceUnit forwards structuralUnbalanceLb to');
w('# counterbalanceEffect and does NOT forward crankOffsetDeg, and');
w('# counterbalanceEffect reads the torque factor A QUARTER TURN FROM THE BOTTOM of');
w('# the stroke, which is where the counterweight moment peaks ONLY when the offset');
w('# is zero. With an offset the moment peaks a quarter turn LESS the offset, so the');
w('# torque factor is read at the wrong crank angle. The engine own docstring states');
w('# the assumption the offset breaks: it is read where the moment is at its maximum.');
w('# So inside ONE balanceUnit return the moment and the peak torque know about the');
w('# offset and the counterbalance effect does not. TEACHING, contiguous sweep.');
{
  const n = KIN.samples.length;
  const ref = KIN.crankAngleAtBottomRad;
  const qIdx = (KIN.bottomIndex + Math.round(n / 4)) % n;
  const tfQuarter = Math.abs(KIN.samples[qIdx].torqueFactorIn);
  for (const off of [-30, -20, -10, 0, 10, 20, 30, 45]) {
    const b = PU.balanceUnit({ kin: KIN, cardLoadAt: teaLoadAt, structuralUnbalanceLb: 0, crankOffsetDeg: off, aIn: GEOM.aIn });
    const tau = (off * Math.PI) / 180;
    let bestI = 0; let bestV = -Infinity;
    KIN.samples.forEach((sm, i) => { const v = Math.sin(sm.thetaRad - ref + tau); if (v > bestV) { bestV = v; bestI = i; } });
    const tfTrue = Math.abs(KIN.samples[bestI].torqueFactorIn);
    w(`teaching counterbalance offset, ODUMA-4 with a crank offset of ${f(off, 1)} deg: moment = ${f(b.momentInLb, 6)} in-lb, peak torque = ${f(b.peakTorqueInLb, 6)} in-lb`);
    w(`teaching counterbalance offset, ODUMA-4 with a crank offset of ${f(off, 1)} deg: the engine reads the torque factor at crank sample ${qIdx}, where it is ${f(tfQuarter, 9)} in, and reports a counterbalance effect of ${f(b.counterbalanceEffectLb, 6)} lb`);
    w(`teaching counterbalance offset, ODUMA-4 with a crank offset of ${f(off, 1)} deg: the counterweight moment actually peaks at crank sample ${bestI}, where the torque factor is ${f(tfTrue, 9)} in, which would give a counterbalance effect of ${f(b.momentInLb / tfTrue, 6)} lb`);
    w(`teaching counterbalance offset, ODUMA-4 with a crank offset of ${f(off, 1)} deg: the difference between the two is ${f(b.counterbalanceEffectLb - b.momentInLb / tfTrue, 6)} lb, which is ${f(((b.counterbalanceEffectLb - b.momentInLb / tfTrue) / (b.momentInLb / tfTrue)) * 100, 6)} percent`);
  }
  w('# AT A ZERO OFFSET THE TWO AGREE EXACTLY, which is what says this is the offset');
  w('# and nothing else. The counterbalance effect is how a counterbalance is QUOTED');
  w('# and how it is MEASURED in the field, so a wrong one is a wrong field target.');
}
w('# THE BALANCE IS AN INPUT TO THE FUNCTION THAT COMPUTES THE CARD IT COMES FROM.');
w('# Expert m03 l04. balanceUnit needs the surface card, and the surface card comes');
w('# out of predictCard, which runRodPumpDesign calls INTERNALLY. So there is no way');
w('# to call runRodPumpDesign once and get a balanced design: the card has to be');
w('# solved separately, balanced, and then the design run, which solves the same card');
w('# a second time with the same inputs. This digest does exactly that and pays for');
w('# the card twice.');
w('# AND THE NATURAL FIRST CALL, WITH THE BALANCE OMITTED, FAILS OPEN.');
{
  const withB = teaDesign({ balance: BAL, unitRating: PU.parseUnitDesignation('C-320D-200-100') });
  const noB = teaDesign({ unitRating: PU.parseUnitDesignation('C-320D-200-100') });
  w(`teaching fails open, ODUMA-4 with the balance passed: groups.torqueGroup = ${f(withB.design.groups.torqueGroup, 9)}`);
  w(`teaching fails open, ODUMA-4 with the balance OMITTED: groups.torqueGroup = ${f(noB.design.groups.torqueGroup, 9)}`);
  w(`teaching fails open, ODUMA-4 with the balance passed: rating.torquePct = ${f(withB.design.rating.torquePct, 9)} percent`);
  w(`teaching fails open, ODUMA-4 with the balance OMITTED: rating.torquePct = ${noB.design.rating.torquePct}`);
  w('# ZERO IS A MEANINGFUL POINT ON THE RP 11L TORQUE CHART, the no load axis, so a');
  w('# missing balance reads as a weightless gearbox rather than as an unanswered');
  w('# question. torquePct ONE FIELD AWAY returns null in the same call, so the module');
  w('# already knows how to say not computed and does say it, which is what makes the');
  w('# zero indefensible rather than merely unfortunate. The fix costs no arithmetic.');
  w(`teaching fails open, ODUMA-4: the two fields disagree about whether an answer exists in ONE return object, torqueGroup = ${f(noB.design.groups.torqueGroup, 9)} against torquePct = ${noB.design.rating.torquePct}`);
  w(`teaching fails open, ODUMA-4: every other output is identical with and without the balance, because the balance enters only those two fields. Plunger stroke equal = ${withB.design.plungerStrokeIn === noB.design.plungerStrokeIn}, PPRL equal = ${withB.design.pprlLb === noB.design.pprlLb}, worst loading equal = ${withB.design.worstSection.loadingPct === noB.design.worstSection.loadingPct}`);
}
w('');

// ============================================================ SECTION 22
w('# SECTION 22: THREE INPUTS ACCEPTED AND NEVER READ');
w('# Expert m04, and the tier clearest fails-open. runRodPumpDesign destructures');
w('# kin, structuralUnbalanceLb and crankOffsetDeg in its signature, lists all three');
w('# in its own documented input list, and references none of them anywhere in the');
w('# body. Proved below by STRICT EQUALITY over the outputs, and then the same two');
w('# numbers are handed to balanceUnit, where they ARE read, so the contrast is on');
w('# one page.');
{
  const zero = teaDesign({ structuralUnbalanceLb: 0, crankOffsetDeg: 0 });
  const set = teaDesign({ kin: KIN, structuralUnbalanceLb: 600, crankOffsetDeg: 10 });
  const keys = ['pprlLb', 'mprlLb', 'plungerStrokeIn', 'prhp', 'producedBpd', 'cardAreaInLb', 'fluidLoadLb', 'sweptBpd', 'ratedBpd'];
  w('teaching ignored inputs, ODUMA-4 run A: structuralUnbalanceLb = 0, crankOffsetDeg = 0, kin not passed');
  w('teaching ignored inputs, ODUMA-4 run B: structuralUnbalanceLb = 600, crankOffsetDeg = 10, kin passed');
  for (const k of keys) {
    w(`teaching ignored inputs, ODUMA-4 strict equality on ${k}: run A = ${f(zero.design[k], 12)}, run B = ${f(set.design[k], 12)}, A === B is ${zero.design[k] === set.design[k]}`);
  }
  w(`teaching ignored inputs, ODUMA-4 strict equality on worstSection.loadingPct: run A = ${f(zero.design.worstSection.loadingPct, 12)}, run B = ${f(set.design.worstSection.loadingPct, 12)}, A === B is ${zero.design.worstSection.loadingPct === set.design.worstSection.loadingPct}`);
  w(`teaching ignored inputs, ODUMA-4: every one of those ten outputs is strictly equal, count of differences = ${keys.filter((k) => zero.design[k] !== set.design[k]).length + (zero.design.worstSection.loadingPct === set.design.worstSection.loadingPct ? 0 : 1)}`);
  w('# kin IS WORSE IN KIND IF NOT IN SIZE. It is unused, so a caller can hand');
  w('# runRodPumpDesign the kinematics of ONE unit and the surfacePosition of ANOTHER');
  w('# and nothing will notice. DERIVED proof: the kinematics of a generic 144 in unit');
  w('# passed alongside the published 106 in surface motion.');
  const otherKin = PU.unitKinematics(PU.genericConventionalGeometry({ strokeIn: 144 }).geometry, { steps: 360 });
  const mismatched = teaDesign({ kin: otherKin });
  w(`teaching ignored inputs, ODUMA-4 with a mismatched kin of stroke ${f(otherKin.strokeIn, 6)} in against a surface motion of stroke ${f(S_IN, 6)} in: plunger stroke = ${f(mismatched.design.plungerStrokeIn, 12)} in`);
  w(`teaching ignored inputs, ODUMA-4: identical to run A = ${mismatched.design.plungerStrokeIn === zero.design.plungerStrokeIn}, and no warning was raised, warnings = ${codes(mismatched.design.warnings)}`);
  w('# THE SAME TWO NUMBERS, GIVEN TO balanceUnit, ARE NOT SMALL.');
  const b00 = PU.balanceUnit({ kin: KIN, cardLoadAt: teaLoadAt, structuralUnbalanceLb: 0, crankOffsetDeg: 0, aIn: GEOM.aIn });
  const bSU = PU.balanceUnit({ kin: KIN, cardLoadAt: teaLoadAt, structuralUnbalanceLb: 600, crankOffsetDeg: 0, aIn: GEOM.aIn });
  const bOF = PU.balanceUnit({ kin: KIN, cardLoadAt: teaLoadAt, structuralUnbalanceLb: 0, crankOffsetDeg: 10, aIn: GEOM.aIn });
  const bBoth = PU.balanceUnit({ kin: KIN, cardLoadAt: teaLoadAt, structuralUnbalanceLb: 600, crankOffsetDeg: 10, aIn: GEOM.aIn });
  for (const [nm, b] of [['both at zero', b00], ['structural unbalance 600 lb only', bSU], ['crank offset 10 deg only', bOF], ['both together', bBoth]]) {
    w(`teaching balance sensitivity, ODUMA-4 with ${nm}: moment = ${f(b.momentInLb, 6)} in-lb, peak torque = ${f(b.peakTorqueInLb, 6)} in-lb, counterbalance effect = ${f(b.counterbalanceEffectLb, 6)} lb`);
  }
  w(`teaching balance sensitivity, ODUMA-4: those two numbers move the counterbalance moment by ${f(b00.momentInLb - bBoth.momentInLb, 6)} in-lb, which is ${f((1 - bBoth.momentInLb / b00.momentInLb) * 100, 6)} percent`);
  w(`teaching balance sensitivity, ODUMA-4: and the peak gearbox torque by ${f(b00.peakTorqueInLb - bBoth.peakTorqueInLb, 6)} in-lb, which is ${f((1 - bBoth.peakTorqueInLb / b00.peakTorqueInLb) * 100, 6)} percent`);
  w(`teaching balance sensitivity, ODUMA-4: and the counterbalance effect by ${f(b00.counterbalanceEffectLb - bBoth.counterbalanceEffectLb, 6)} lb`);
  w('# SO A CALLER WHO TYPES A STRUCTURAL UNBALANCE AND A CRANK OFFSET INTO THE');
  w('# DESIGN FUNCTION, AND READS BACK A TORQUE RATING PERCENTAGE, HAS NO WAY TO KNOW');
  w('# THOSE TWO NUMBERS WENT NOWHERE. That is what a fails-open looks like: not a');
  w('# wrong answer with an error beside it, but a plausible answer with nothing.');
  const rating = PU.parseUnitDesignation('C-320D-200-100');
  const dA = teaDesign({ balance: bBoth, unitRating: rating, structuralUnbalanceLb: 600, crankOffsetDeg: 10 });
  const dZ = teaDesign({ balance: b00, unitRating: rating });
  w(`teaching balance sensitivity, ODUMA-4: torquePct computed with the balance that DID read those numbers = ${f(dA.design.rating.torquePct, 9)} percent`);
  w(`teaching balance sensitivity, ODUMA-4: torquePct computed with the balance that did not = ${f(dZ.design.rating.torquePct, 9)} percent`);
  w(`teaching balance sensitivity, ODUMA-4: the design run itself is identical between those two calls, plunger stroke equal = ${dA.design.plungerStrokeIn === dZ.design.plungerStrokeIn}, PPRL equal = ${dA.design.pprlLb === dZ.design.pprlLb}`);
}
w('');
// ============================================================ SECTION 23
w('# SECTION 23: THE MODIFIED GOODMAN LINE AND THE SERVICE FACTOR');
w('# Expert m05 l01 and l02. Sa = ( T/4 + 0.5625 Smin ) SF, from API RP 11BR. T is');
w('# the grade minimum tensile strength, a material minimum. SF is NOT a property of');
w('# the rod: it stands for the fluid, the corrosion and the operator own practice,');
w('# so it is an input with no default that pretends otherwise. The allowable rises');
w('# with the MINIMUM stress, which is why a string that never unloads is allowed');
w('# more than one that swings to nothing.');
w('# The loading in this section is the design return route, as runRodPumpDesign');
w('# reports it, not the standalone recomputation of Sections 19 and 20.');
for (const gid of ['K', 'C', 'D']) {
  const g = RC.rodGrade(gid);
  w(`derived Goodman, grade ${g.label}: minimum tensile = ${g.minTensilePsi} psi, T/4 = ${f(g.minTensilePsi / 4, 6)} psi, and that is the allowable at a service factor of 1 when the minimum stress is zero`);
}
for (const smin of [0, 2500, 5000, 7500, 10000, 12500]) {
  w(`derived Goodman, grade D at a minimum stress of ${f(smin, 1)} psi and a service factor of 1: allowable = ${f(RP.modifiedGoodman({ minTensilePsi: 115000, minStressPsi: smin, serviceFactor: 1 }).allowablePsi, 6)} psi`);
}
w('# THE SERVICE FACTOR SWEEP ON ODUMA-4, contiguous from 1.00 down to 0.70. The');
w('# design itself does not change down this column: the same card, the same');
w('# stresses, the same envelope. What changes is the line they are judged against.');
const sfList = [1.00, 0.975, 0.95, 0.925, 0.90, 0.875, 0.85, 0.825, 0.80, 0.775, 0.75, 0.725, 0.70];
for (const sf of sfList) {
  const d = teaDesign({ serviceFactor: sf });
  const ws = d.design.worstSection;
  w(`teaching service factor, ODUMA-4 at SF ${f(sf, 4)}: worst section = ${ws.label}, maximum stress = ${f(ws.maxStressPsi, 6)} psi, minimum stress = ${f(ws.minStressPsi, 6)} psi, `
    + `allowable = ${f(ws.allowablePsi, 6)} psi, loading = ${f(ws.loadingPct, 6)} percent, warnings = ${codes(d.design.warnings)}`);
}
{
  let lo = 0.70; let hi = 1.00;
  const L = (sf) => teaDesign({ serviceFactor: sf }).design.worstSection.loadingPct;
  for (let i = 0; i < 60; i += 1) {
    const mid = 0.5 * (lo + hi);
    if (L(mid) > 100) { lo = mid; } else { hi = mid; }
  }
  const cross = 0.5 * (lo + hi);
  w(`teaching service factor, ODUMA-4: the loading crosses 100 percent at a service factor of ${f(cross, 9)}, found by bisection on the sweep above`);
  w(`teaching service factor, ODUMA-4: at that service factor the allowable is ${f(teaDesign({ serviceFactor: cross }).design.worstSection.allowablePsi, 6)} psi and the loading is ${f(L(cross), 9)} percent`);
  w(`teaching service factor, ODUMA-4: the design is acceptable for every service factor above that and overstressed below it, and the design itself never changed`);
  w(`teaching service factor, ODUMA-4: the same crossing stated as an allowable, ${f(teaDesign({ serviceFactor: cross }).design.worstSection.maxStressPsi, 6)} psi of maximum stress against ${f(teaDesign({ serviceFactor: cross }).design.worstSection.allowablePsi, 6)} psi of allowable`);
}
w('# THE WARNING USED TO PRINT THE THRESHOLD IT HAD JUST FAILED, AND NO LONGER DOES.');
w('# rodOverstressed once formatted the loading with toFixed(0), so anything just');
w('# above 100 printed the words 100 percent and read as though the value sat ON the');
w('# threshold, which invites a user to dismiss a real warning. It rounded UP as');
w('# readily as down, so it also OVERSTATED an exceedance.');
w('#');
w('# ENGINES PR #113 FIXED IT, along with 20 other sites, and PR #114 found 6 more');
w('# because the first sweep was grepped on one spelling of the defect. The shipped');
w('# code now uses toFixed(1) here and in the fillage message in Section 24, and the');
w('# rows below are run against the FIXED engine and are the evidence of the fix.');
w('# Read them as what a corrected warning looks like, not as a defect to report.');
w('#');
w('# A first draft of this header described the defect in the present tense, having');
w('# been written from a findings note taken before the fix. A lesson writer checked');
w('# the shipped source, found toFixed(1), and wrote no lesson around the claim.');
for (const sf of [0.845, 0.84, 0.83, 0.82, 0.81]) {
  const d = teaDesign({ serviceFactor: sf });
  const wmsg = d.design.warnings.find((x) => x.code === 'rodOverstressed');
  w(`teaching warning text, ODUMA-4 at SF ${f(sf, 4)}: true loading = ${f(d.design.worstSection.loadingPct, 6)} percent, warning raised = ${!!wmsg}, message says: ${wmsg ? wmsg.message : 'no rodOverstressed warning'}`);
}
w('# THE SAME FAMILY as the fillage message in Section 24, which is why the fix was');
w('# a repo-wide SWEEP for that formatting inside warning text rather than three');
w('# separate fixes. Twenty seven sites across twelve modules in the end, in four');
w('# domains, one of which nobody had thought to look in.');
w('# EACH SECTION AGAINST ITS OWN LINE. A taper is designed so every section carries');
w('# the same peak stress, so the spread of the loading column below is the check on');
w('# whether this taper does.');
for (const sf of [1.0, 0.85]) {
  const d = teaDesign({ serviceFactor: sf });
  d.design.stresses.forEach((s, i) => {
    w(`teaching section loading, ODUMA-4 at SF ${f(sf, 4)}, section ${i + 1} (${s.label}, top at ${f(s.topDepthFt, 1)} ft): maximum stress = ${f(s.maxStressPsi, 6)} psi, `
      + `minimum stress = ${f(s.minStressPsi, 6)} psi, allowable = ${f(s.allowablePsi, 6)} psi, loading = ${f(s.loadingPct, 6)} percent`);
  });
  const ls = d.design.stresses.map((s) => s.loadingPct);
  w(`teaching section loading, ODUMA-4 at SF ${f(sf, 4)}: the loading spread across the three sections = ${f(Math.max(...ls) - Math.min(...ls), 6)} percentage points, so this taper is NOT stress balanced`);
}
w('');

// ============================================================ SECTION 24
w('# SECTION 24: FILLAGE, THE CLIFF, AND THE EFFECTIVE FACTOR');
w('# Professional m05 owns the cliff and the effective factor; Expert m05 owns what');
w('# a threshold three thousandths away means for a reported result.');
w('# THE ARITHMETIC IN QUESTION. runRodPumpDesign computes sweptBpd from the PLUNGER');
w('# stroke the march returned, then multiplies by fillage. But the plunger stroke');
w('# ITSELF already moved with fillage, because the POUND_DOWN state holds the fluid');
w('# load on the plunger while it travels down through the empty part of the barrel,');
w('# and that travel is inside plungerStrokeIn. So a fillage multiplier is charged');
w('# against a swept volume the same fillage already changed.');
w('# READ THE WHOLE CONTIGUOUS SWEEP. The effective factor is the produced rate');
w('# divided by the produced rate at a full barrel, and the nominal factor is the');
w('# fillage itself. Their ratio is the last column, and its SIGN FLIPS.');
const fillList = [1.00, 0.98, 0.96, 0.94, 0.92, 0.90, 0.88, 0.86, 0.84, 0.82, 0.80, 0.78, 0.76, 0.74, 0.72, 0.70, 0.65, 0.60, 0.55, 0.50];
const FULLB = teaDesign({ fillage: 1.0 }).design;
for (const fl of fillList) {
  const d = teaDesign({ fillage: fl }).design;
  const eff = d.producedBpd / FULLB.producedBpd;
  w(`teaching fillage, ODUMA-4 at a fillage of ${f(fl, 4)}: plunger stroke = ${f(d.plungerStrokeIn, 6)} in, swept = ${f(d.sweptBpd, 6)} bbl/d, produced = ${f(d.producedBpd, 6)} bbl/d, `
    + `effective factor = ${f(eff, 9)}, nominal factor = ${f(fl, 4)}, effective over nominal = ${f(eff / fl, 9)}, `
    + `error against nominal = ${f((eff / fl - 1) * 100, 6)} percent, warnings = ${codes(d.warnings)}`);
}
{
  const rows = fillList.map((fl) => {
    const d = teaDesign({ fillage: fl }).design;
    return { fl, sp: d.plungerStrokeIn, ratio: (d.producedBpd / FULLB.producedBpd) / fl };
  });
  const over = rows.filter((r) => r.ratio > 1).length;
  const under = rows.filter((r) => r.ratio < 1).length;
  w(`teaching fillage, ODUMA-4: across those twenty contiguous rows the effective factor sits ABOVE the nominal fillage on ${over} of them and BELOW it on ${under}, so the sign of the error flips within one sweep`);
  w(`teaching fillage, ODUMA-4: the largest overstatement is ${f((Math.max(...rows.map((r) => r.ratio)) - 1) * 100, 6)} percent at a fillage of ${f(rows.reduce((a, b) => (b.ratio > a.ratio ? b : a)).fl, 4)}`);
  w(`teaching fillage, ODUMA-4: the largest understatement is ${f((1 - Math.min(...rows.map((r) => r.ratio))) * 100, 6)} percent at a fillage of ${f(rows.reduce((a, b) => (b.ratio < a.ratio ? b : a)).fl, 4)}`);
  w('# AND THE PLUNGER STROKE IS NOT MONOTONE IN FILLAGE EITHER, which is what says');
  w('# this is an accounting question rather than an approximation: a defensible');
  w('# convention would err one way.');
  w(`teaching fillage, ODUMA-4: plunger stroke at a full barrel = ${f(rows[0].sp, 6)} in`);
  w(`teaching fillage, ODUMA-4: the longest plunger stroke in the sweep = ${f(Math.max(...rows.map((r) => r.sp)), 6)} in, at a fillage of ${f(rows.reduce((a, b) => (b.sp > a.sp ? b : a)).fl, 4)}`);
  w(`teaching fillage, ODUMA-4: the shortest = ${f(Math.min(...rows.map((r) => r.sp)), 6)} in, at a fillage of ${f(rows.reduce((a, b) => (b.sp < a.sp ? b : a)).fl, 4)}`);
  w(`teaching fillage, ODUMA-4: so the plunger travels FURTHER at a partly filled barrel than at a full one over part of this range, because the string stays loaded into the downstroke`);
  w('# THERE IS A DEFENSIBLE READING in which some of this is right, because the');
  w('# plunger genuinely does travel further when the string stays loaded into the');
  w('# downstroke. What is not defensible is charging a fillage multiplier against a');
  w('# swept volume that the same fillage already changed. Adjudicate against the');
  w('# published method before touching any arithmetic.');
}
w('# THE CLIFF IN THE CODE. incompleteFillage fires at a hard fillage < 0.85 with no');
w('# hysteresis and no graduation. Four ten thousandths of fillage separate a silent');
w('# design from a warned one, and the two designs are the same design.');
for (const fl of [0.8520, 0.8510, 0.8505, 0.8501, 0.8500, 0.8499, 0.8495, 0.8490, 0.8480]) {
  const d = teaDesign({ fillage: fl }).design;
  const wm = d.warnings.find((x) => x.code === 'incompleteFillage');
  w(`teaching fillage cliff, ODUMA-4 at a fillage of ${f(fl, 4)}: produced = ${f(d.producedBpd, 6)} bbl/d, plunger stroke = ${f(d.plungerStrokeIn, 6)} in, incompleteFillage raised = ${!!wm}`);
}
{
  const a = teaDesign({ fillage: 0.8500 }).design;
  const b = teaDesign({ fillage: 0.8499 }).design;
  w(`teaching fillage cliff, ODUMA-4: the silent design makes ${f(a.producedBpd, 6)} bbl/d and the warned design makes ${f(b.producedBpd, 6)} bbl/d`);
  w(`teaching fillage cliff, ODUMA-4: they are ${f(a.producedBpd - b.producedBpd, 6)} bbl/d apart, and one of them raises a warning`);
  w(`teaching fillage cliff, ODUMA-4: the message the warned one prints: ${b.warnings.find((x) => x.code === 'incompleteFillage').message}`);
  w('# AND THE MESSAGE ONCE PRINTED THE THRESHOLD IT HAD JUST FAILED. Before engines');
  w('# PR #113 any fillage from 0.845 up to but not including 0.85 printed the words');
  w('# 85 percent, the threshold the design had just missed. It read as though the');
  w('# though the barrel filled exactly to the limit.');
  for (const fl of [0.8499, 0.8480, 0.8460, 0.8450, 0.8440]) {
    const d = teaDesign({ fillage: fl }).design;
    const wm = d.warnings.find((x) => x.code === 'incompleteFillage');
    w(`teaching warning text, ODUMA-4 at a fillage of ${f(fl, 4)}: the message says ${wm ? wm.message.split('. ')[0] : 'no warning'}`);
  }
  w('# THE POINT IS NOT THAT 0.85 IS THE WRONG PLACE TO DRAW A LINE. The design is');
  w('# genuinely pounding on both sides of it. The point is that the warning list is');
  w('# not a substitute for reading the number.');
}
w('');

// ============================================================ SECTION 25
w('# SECTION 25: THE DIAGNOSTIC. READING A CARD INSTEAD OF PREDICTING ONE.');
w('# Expert m05 l03, l04 and l05. This is the Gibbs 1963 problem and it is a');
w('# DIFFERENT problem: both the position AND the load are known at the surface,');
w('# from a dynamometer, and the question is what the pump is doing. Each Fourier');
w('# harmonic propagates down the string in closed form, so it is solved');
w('# analytically per harmonic and summed. predictCard and diagnoseCard share no');
w('# code path, which is what makes the round trip a real check.');
{
  const gd = GOLD.diagnose;
  const card = gd.positionsIn.map((p, i) => ({ tFrac: i / gd.positionsIn.length, positionIn: p, loadLb: gd.loadsLb[i] }));
  const r = RD.diagnoseCard({ string: tapStr, surfaceCard: card, spm: gd.spm, dampingRatio: gd.dampingRatio, harmonics: gd.harmonics });
  w(`golden diagnose, inputs: the published taper, ${gd.positionsIn.length} sample synthetic measured card, ${gd.spm} spm, damping ratio ${gd.dampingRatio}, ${gd.harmonics} harmonics`);
  w(`golden diagnose, the measured card is a smooth closed loop, position ${f(Math.min(...gd.positionsIn), 6)} to ${f(Math.max(...gd.positionsIn), 6)} in and load ${f(Math.min(...gd.loadsLb), 6)} to ${f(Math.max(...gd.loadsLb), 6)} lb`);
  w(`golden diagnose, plunger stroke = ${f(gd.result.plungerStrokeIn, 9)} in`);
  w(`golden diagnose, maximum pump load = ${f(gd.result.pumpLoadMaxLb, 9)} lb`);
  w(`golden diagnose, minimum pump load = ${f(gd.result.pumpLoadMinLb, 9)} lb`);
  w(`derived diagnose, engine plunger stroke = ${f(r.plungerStrokeIn, 9)} in, difference from golden = ${e(r.plungerStrokeIn - gd.result.plungerStrokeIn, 3)} in`);
  w(`derived diagnose, engine maximum pump load = ${f(r.pumpLoadRangeLb[1], 9)} lb, difference from golden = ${e(r.pumpLoadRangeLb[1] - gd.result.pumpLoadMaxLb, 3)} lb`);
  w(`derived diagnose, engine minimum pump load = ${f(r.pumpLoadRangeLb[0], 9)} lb, difference from golden = ${e(r.pumpLoadRangeLb[0] - gd.result.pumpLoadMinLb, 3)} lb`);
  w(`derived diagnose, harmonics actually used = ${r.harmonics}, requested = ${gd.harmonics}, cap is floor(N/2) - 1 = ${Math.floor(gd.positionsIn.length / 2) - 1}`);
  w(`derived diagnose, kappa = ${f(r.kappaPerS, 9)} per s`);
  w(`derived diagnose, the surface stroke of the measured card is ${f(Math.max(...gd.positionsIn) - Math.min(...gd.positionsIn), 6)} in and the plunger stroke it implies is ${f(r.plungerStrokeIn, 6)} in, a ratio of ${f(r.plungerStrokeIn / (Math.max(...gd.positionsIn) - Math.min(...gd.positionsIn)), 9)}`);
  w('# THE DIAGNOSTIC REFUSES a card it cannot read. Sixteen samples is the floor.');
  const short = RD.diagnoseCard({ string: tapStr, surfaceCard: card.slice(0, 12), spm: 9, dampingRatio: 0.1 });
  w(`derived diagnose refusal, a 12 point card: ok = ${short.ok}, message: ${short.error}`);
  w('# THE HARMONIC COUNT IS A CHOICE, and it is the diagnostic own resolution knob.');
  w('# DERIVED sweep on the PUBLISHED measured card, contiguous.');
  for (const h of [2, 4, 6, 8, 12, 16, 24, 32, 48, 58]) {
    const rr = RD.diagnoseCard({ string: tapStr, surfaceCard: card, spm: gd.spm, dampingRatio: gd.dampingRatio, harmonics: h });
    w(`derived diagnose harmonics, published card with ${h} requested: harmonics used = ${rr.harmonics}, plunger stroke = ${f(rr.plungerStrokeIn, 9)} in, `
      + `maximum pump load = ${f(rr.pumpLoadRangeLb[1], 6)} lb, minimum pump load = ${f(rr.pumpLoadRangeLb[0], 6)} lb`);
  }
}
w('# THE ROUND TRIP. TEACHING. Predict a card on ODUMA-4, hand the SURFACE HALF of');
w('# it back to the diagnostic solver, and the pump card it returns has to be the');
w('# one the prediction assumed. THE SAME QUANTITY, THE PLUNGER STROKE, IS COMPUTED');
w('# TWICE HERE AND THE LABELS DIFFER:');
w('#   "march"      is predictCard plungerStrokeIn, a peak to trough of the pump');
w('#                node over every marched step.');
w('#   "diagnostic" is diagnoseCard plungerStrokeIn, twenty four harmonics');
w('#                propagated down the string from the DECIMATED surface card.');
w('# They do not agree exactly, and the gap is the price of the round trip: the');
w('# diagnostic sees only the decimated card and only the harmonics it is given.');
{
  const march = G0.dynamics;
  const dg = RD.diagnoseCard({ string: teaStr, surfaceCard: march.surfaceCard, spm: T_SPM, dampingRatio: T_ZETA, harmonics: 24 });
  w(`teaching round trip, ODUMA-4: plunger stroke from the MARCH = ${f(march.plungerStrokeIn, 9)} in`);
  w(`teaching round trip, ODUMA-4: plunger stroke from the DIAGNOSTIC = ${f(dg.plungerStrokeIn, 9)} in`);
  w(`teaching round trip, ODUMA-4: the two differ by ${f(dg.plungerStrokeIn - march.plungerStrokeIn, 9)} in, which is ${f(((dg.plungerStrokeIn - march.plungerStrokeIn) / march.plungerStrokeIn) * 100, 6)} percent`);
  w(`teaching round trip, ODUMA-4: maximum pump load from the DIAGNOSTIC = ${f(dg.pumpLoadRangeLb[1], 9)} lb, against the fluid load of ${f(T_FO, 9)} lb the march put on the plunger, a difference of ${f(dg.pumpLoadRangeLb[1] - T_FO, 9)} lb`);
  w(`teaching round trip, ODUMA-4: minimum pump load from the DIAGNOSTIC = ${f(dg.pumpLoadRangeLb[0], 9)} lb, against the 0 lb the march put on it while falling`);
  w(`teaching round trip, ODUMA-4: the diagnostic overshoots at both ends because a truncated harmonic sum cannot reproduce the two vertical valve transfers, which are the sharpest feature of a pump card`);
  w(`teaching round trip, ODUMA-4: harmonics used = ${dg.harmonics}, out of a card of ${march.surfaceCard.length} points whose cap is floor(N/2) - 1 = ${Math.floor(march.surfaceCard.length / 2) - 1}`);
  w('# THE HARMONIC SWEEP ON THE TEACHING CARD, contiguous, so the overshoot can be');
  w('# watched rather than asserted.');
  for (const h of [2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 80, 91]) {
    const rr = RD.diagnoseCard({ string: teaStr, surfaceCard: march.surfaceCard, spm: T_SPM, dampingRatio: T_ZETA, harmonics: h });
    w(`teaching round trip harmonics, ODUMA-4 with ${h} requested: harmonics used = ${rr.harmonics}, plunger stroke = ${f(rr.plungerStrokeIn, 9)} in, `
      + `maximum pump load = ${f(rr.pumpLoadRangeLb[1], 6)} lb, minimum pump load = ${f(rr.pumpLoadRangeLb[0], 6)} lb, `
      + `stroke difference from the march = ${f(rr.plungerStrokeIn - march.plungerStrokeIn, 9)} in`);
  }
  w('# WHAT A DIAGNOSIS CANNOT TELL YOU. It returns the pump card. It does not');
  w('# return why the card has that shape: gas interference, a worn plunger, a stuck');
  w('# valve and a partly filled barrel are read off the SHAPE by a person, and the');
  w('# engine names none of them. It also carries the damping ratio it is GIVEN, and');
  w('# a damping ratio is not measurable from the card either.');
  for (const z of [0.05, 0.08, 0.10, 0.12, 0.15, 0.20]) {
    const rr = RD.diagnoseCard({ string: teaStr, surfaceCard: march.surfaceCard, spm: T_SPM, dampingRatio: z, harmonics: 24 });
    w(`teaching diagnostic damping, ODUMA-4 read back at a damping ratio of ${f(z, 4)}: plunger stroke = ${f(rr.plungerStrokeIn, 9)} in, maximum pump load = ${f(rr.pumpLoadRangeLb[1], 6)} lb, minimum pump load = ${f(rr.pumpLoadRangeLb[0], 6)} lb`);
  }
  w(`teaching diagnostic damping, ODUMA-4: across that contiguous sweep the plunger stroke read back moves ${f(Math.max(...[0.05, 0.08, 0.10, 0.12, 0.15, 0.20].map((z) => RD.diagnoseCard({ string: teaStr, surfaceCard: march.surfaceCard, spm: T_SPM, dampingRatio: z, harmonics: 24 }).plungerStrokeIn)) - Math.min(...[0.05, 0.08, 0.10, 0.12, 0.15, 0.20].map((z) => RD.diagnoseCard({ string: teaStr, surfaceCard: march.surfaceCard, spm: T_SPM, dampingRatio: z, harmonics: 24 }).plungerStrokeIn)), 9)} in, on an input nobody measured`);
}
w('');

// ============================================================ SECTION 26
w('# SECTION 26: WHAT THIS ENGINE REFUSES, COLLECTED');
w('# Associate m01 l03. Every capability comes with a limit, and these are the');
w('# limits stated as refusals rather than as caveats. Each message below is the');
w('# engine own text.');
w(`derived refusal 1, a rod size that cannot be read as a diameter: ${badStr.errors[0]}`);
w(`derived refusal 2, a linkage that does not close at every crank angle: ${noClose.error}`);
w(`derived refusal 3, a plunger with no differential to lift against: ${noLift.errors[0]}`);
w(`derived refusal 4, a march with no damping: ${noDamp.error}`);
w(`teaching refusal 5, a speed at or above the string own fundamental: ${refuse.errors[0]}`);
w(`derived refusal 6, a measured card with fewer than sixteen samples: ${RD.diagnoseCard({ string: tapStr, surfaceCard: [], spm: 9, dampingRatio: 0.1 }).error}`);
w(`derived refusal 7, a pumping speed of zero: ${RP.runRodPumpDesign({ string: teaStr, frequency: teaFrq, surfacePosition: SURF, strokeIn: S_IN, spm: 0, plungerDIn: T_PD, pDischargePsi: T_PDIS, pIntakePsi: T_PINT, dampingRatio: T_ZETA }).errors.join(' ')}`);
w(`derived refusal 8, a rod string with no sections: ${RS.buildRodString({ sections: [], fluidSg: 1 }).errors.join(' ')}`);
w('# AND WHAT IT WARNS ABOUT RATHER THAN REFUSING, with the code each raises:');
w('derived warning codes, taperStepsUp, a section larger than the one above it');
w('derived warning codes, timestep, the time step exceeded the Courant limit');
w('derived warning codes, notPeriodic, the march did not settle into a repeating cycle');
w('derived warning codes, rodOverstressed, the worst section passes its modified Goodman allowable');
w('derived warning codes, structuralOverload, prlPeakLb passes the unit structural capacity');
w('derived warning codes, torqueOverload, the balanced peak torque passes the gearbox rating');
w('derived warning codes, strokeOverload, the design stroke is longer than the unit stroke');
w('derived warning codes, incompleteFillage, the fillage is below 0.85');
w('# WHAT THE ENGINE DOES NOT MODEL AT ALL, so no number in this file speaks to it:');
w('# rod buckling and the compression a sinker bar would be sized for, tubing');
w('# movement and an unanchored tubing string, fluid friction on the plunger and');
w('# valve slippage as anything other than the pumpEfficiency the caller types,');
w('# gas interference, deviated hole side loading and rod on tubing wear, gearbox');
w('# and belt and motor losses, and the fatigue history that turns a Goodman');
w('# percentage into a service life.');
w('');
w('# END OF DIGEST');
console.log(out.join('\n'));
