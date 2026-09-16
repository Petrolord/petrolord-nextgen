// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES OF gaslift_cases.json (plus sweeps
// around them and two clearly labelled teaching constructs the wave designs for
// itself). THE PD2 CAPSTONE RUNS DIFFERENT CONDITIONS ENTIRELY: nothing here
// imports, reads or reproduces pd2_fields.mjs, fields.json or any capstone
// well, depth, pressure, gravity, gradient or decrement. The teaching digest and
// the capstone are two files with opposite audiences and they never share a
// number.
//
// Usage:  node /root/pd-wip-gaslift/pd2_dump.mjs > /root/pd-wip-gaslift/digest.txt
//
// Engine:   packages/engines/engines/production/gasLiftDesign.js
//           packages/engines/engines/production/gasLiftValves.js
//           packages/engines/engines/production/gasProperties.js
// Goldens:  packages/engines/test-data/production/goldens/gaslift_cases.json
//           (including the `unloading` key and the fourth published case
//            midDecrementKnifeEdge that engines PR #110 added)

import fs from 'fs';

const ROOT = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const ENG = `${ROOT}/engines/production/`;
const D = await import(`${ENG}gasLiftDesign.js`);
const V = await import(`${ENG}gasLiftValves.js`);
const G = await import(`${ENG}gasProperties.js`);
const GOLD = JSON.parse(fs.readFileSync(
  `${ROOT}/test-data/production/goldens/gaslift_cases.json`, 'utf8'));

const out = [];
const w = (s) => out.push(s);
const f = (x, n = 6) => (x === null || x === undefined || Number.isNaN(x))
  ? 'n/a' : Number(x).toFixed(n);
const e = (x, n = 4) => (x === null || x === undefined) ? 'n/a' : Number(x).toExponential(n);

const tempOf = (i) => D.linearTemperature({ whtF: i.wht, bhtF: i.bht, refDepthFt: i.refDepth });
const adapt = (i) => ({
  ...i,
  tempAtDepthF: tempOf(i),
  ports: i.ports.map((id) => ({ idIn: id, label: String(id) })),
});

const designs = Object.fromEntries(GOLD.designs.map((g) => [g.id, g]));
const run = {};
for (const g of GOLD.designs) run[g.id] = D.designGasLift(adapt(g.inputs));

// A CONVERGED COLUMN REFERENCE. One 20000 step march per (surface pressure, depth,
// gravity, temperature profile), cached, and read back by linear interpolation
// between adjacent samples. The sample spacing is under half a foot, so the
// interpolation error is orders of magnitude below anything measured against it.
const refCache = new Map();
const refColumn = (pSurf, tvd, sg, T, key) => {
  const kk = `${key}|${pSurf}|${tvd}|${sg}`;
  if (!refCache.has(kk)) {
    refCache.set(kk, G.gasColumnPressure({
      pSurfPsia: pSurf, tvdFt: tvd, gasSg: sg, tempAtDepthF: T, steps: 20000,
    }).profile);
  }
  const prof = refCache.get(kk);
  const n = prof.length - 1;
  return (d) => {
    if (!(d > 0)) return prof[0].pPsia;
    if (d >= tvd) return prof[n].pPsia;
    const x = (d / tvd) * n;
    const j = Math.floor(x);
    return prof[j].pPsia + (x - j) * (prof[j + 1].pPsia - prof[j].pPsia);
  };
};

// ---------------------------------------------------------------- header
w('PD2 Gas Lift Design: TEACHING DIGEST');
w('');
w('THE ONLY NUMBERS A LESSON MAY QUOTE. Every line names its source: a PUBLISHED');
w('golden case out of packages/engines/test-data/production/goldens/gaslift_cases.json,');
w('a DERIVED sweep run on published inputs, or one of the two TEACHING constructs');
w('this wave designed for itself. NOTHING in this file comes from the graded');
w('capstone well. The capstone conditions and its eighteen graded answers live in');
w('a separate file that the generator of this digest never opens.');
w('');
w('A leak guard, pd2_leakcheck.mjs, reads the capstone graded field list and every');
w('number in every line of this file, and rejects the digest if any number lands');
w('within TEN TIMES a graded field tolerance of that field value, in three unit');
w('shiftings (as printed, times 1000, times 0.001). academy_submit_capstone grades');
w('with abs(got - expected) <= tol, so tol is ABSOLUTE in the field own units and');
w('is not a fraction of anything: ten times it is under a hundredth of a psi on a');
w('pressure and under a twentieth of a foot on a depth. This file passed that');
w('guard, and the closest approach anywhere in it is over two hundred tolerances');
w('away, on a PUBLISHED golden valve setting that this digest is obliged to carry.');
w('');
w('Generator: /root/pd-wip-gaslift/pd2_dump.mjs');
w('Engine:    packages/engines/engines/production/gasLiftDesign.js');
w('           packages/engines/engines/production/gasLiftValves.js');
w('           packages/engines/engines/production/gasProperties.js');
w('Goldens:   packages/engines/test-data/production/goldens/gaslift_cases.json');
w(`Golden oracle: ${GOLD.generator}`);
w('Units: psia, Mscf/d, ft TVD, degF, psi/ft, in, in2, lbm/ft3. Never psig, never SI.');
w('');
w('WHAT PROVENANCE LABEL MEANS WHAT');
w('  golden ...    a value committed in gaslift_cases.json, cut by the independent');
w('                stdlib oracle (RK4 column, bisection roots) named above.');
w('  engine ...    the shipped engine re-run on published golden inputs. Where a');
w('                golden carries the same quantity, the two are reported together');
w('                so a lesson can see the agreement or the divergence.');
w('  derived ...   a sweep or refinement run on PUBLISHED inputs by this generator.');
w('                A sweep point is not a published case. Say so if you print one.');
w('  teaching ...  a construct this wave invented: the teaching well AKASO-3 and the');
w('                teaching traverse on it. Not a published case, not a real well,');
w('                and never to be presented as either.');
w('');
w('THE FOUR PUBLISHED DESIGN CASES AT A GLANCE');
for (const g of GOLD.designs) {
  w(`  ${g.id}`);
  w(`      ${g.note}`);
  w(`      valves = ${g.depths.length}, stop reason = ${g.stopReason}, `
    + `multipointing stages = ${g.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') || 'none'}`);
}
w('');
w('THE ONE TEACHING WELL');
w('  AKASO-3   a 7200 ft IPO string this wave designed so the same well can be run');
w('            three ways, on the surface-close convention, on the constant-pressure');
w('            convention, and as a PPO string, and so a curved flowing traverse');
w('            exists whose exact crossing is known. It is a TEACHING WELL. It is');
w('            not in the goldens and no oracle has ever checked it.');
w('');

// ============================================================ SECTION 1
w('# SECTION 1: PUBLISHED GOLDEN GAS PROPERTIES');
w('# z of the injection gas from Sutton pseudo-criticals and Dranchuk & Abou-Kassem,');
w('# and the static gas gradient rho/144 that follows from it. Associate m02 owns');
w('# these. Note how far the gradient moves between the shallow cold row and the');
w('# deep hot row: it is not one number.');
for (const r of GOLD.gasProperties) {
  w(`golden gasProperties, sg ${r.gasSg} at ${f(r.pPsia, 1)} psia ${f(r.tF, 1)} degF, z = ${f(r.z, 9)} dimensionless`);
  w(`golden gasProperties, sg ${r.gasSg} at ${f(r.pPsia, 1)} psia ${f(r.tF, 1)} degF, gas gradient = ${f(r.gradPsiPerFt, 9)} psi/ft`);
}
for (const r of GOLD.gasProperties) {
  const z = G.naturalGasZ({ pPsia: r.pPsia, tF: r.tF, gasSg: r.gasSg });
  const gr = G.gasGradient({ pPsia: r.pPsia, tF: r.tF, gasSg: r.gasSg });
  w(`engine gasProperties, sg ${r.gasSg} at ${f(r.pPsia, 1)} psia ${f(r.tF, 1)} degF, z = ${f(z, 9)}, gradient = ${f(gr, 9)} psi/ft, `
    + `z difference from golden = ${e(z - r.z, 3)}`);
}
for (const r of GOLD.gasPropertiesAcid) {
  w(`golden gasPropertiesAcid, sg ${r.gasSg} at ${f(r.pPsia, 1)} psia ${f(r.tF, 1)} degF with yCO2 ${r.yCo2} and yH2S ${r.yH2s}, z = ${f(r.z, 9)} dimensionless`);
  const clean = G.naturalGasZ({ pPsia: r.pPsia, tF: r.tF, gasSg: r.gasSg });
  const wa = G.wichertAziz({ ...G.suttonPseudoCriticals(r.gasSg), yCo2: r.yCo2, yH2s: r.yH2s });
  w(`derived gasPropertiesAcid, the SAME gas with no acid correction, z = ${f(clean, 9)} dimensionless`);
  w(`derived gasPropertiesAcid, Wichert and Aziz epsilon = ${f(wa.epsilon, 6)} degR, corrected Tpc = ${f(wa.tpcR, 6)} degR, corrected Ppc = ${f(wa.ppcPsia, 6)} psia`);
  w(`derived gasPropertiesAcid, uncorrected Sutton Tpc = ${f(G.suttonPseudoCriticals(r.gasSg).tpcR, 6)} degR, uncorrected Ppc = ${f(G.suttonPseudoCriticals(r.gasSg).ppcPsia, 6)} psia`);
}
w('');

// ============================================================ SECTION 2
w('# SECTION 2: PUBLISHED GOLDEN GAS COLUMNS, DOWN AND BACK UP');
w('# Three columns marched from surface to depth, and the same three inverted back');
w('# to the surface pressure that produced them. Associate m02 l04 and l05 own the');
w('# march and the inverse. The round trip closes to under a millionth of a psi,');
w('# which is what a lesson should say about the inverse: it is a secant on the');
w('# forward march, so it is exactly as good as the march it inverts and no better.');
GOLD.columns.forEach((c, i) => {
  const T = D.linearTemperature({ whtF: c.whtF, bhtF: c.bhtF, refDepthFt: c.tvdFt });
  w(`golden column ${i + 1}, inputs: surface ${f(c.pSurfPsia, 1)} psia, depth ${f(c.tvdFt, 1)} ft, sg ${c.gasSg}, wellhead ${f(c.whtF, 1)} degF, bottom ${f(c.bhtF, 1)} degF, linear geotherm`);
  w(`golden column ${i + 1}, pressure at depth = ${f(c.pBottomPsia, 9)} psia`);
  w(`golden column ${i + 1}, surface pressure recovered from that depth pressure = ${f(c.surfaceFromBottom, 9)} psia`);
  w(`golden column ${i + 1}, round trip closure = ${e(c.surfaceFromBottom - c.pSurfPsia, 3)} psi`);
  const eng = G.gasColumnPressure({ pSurfPsia: c.pSurfPsia, tvdFt: c.tvdFt, gasSg: c.gasSg, tempAtDepthF: T, steps: 40 }).pBottomPsia;
  const back = G.gasColumnSurfacePressure({ pAtDepthPsia: c.pBottomPsia, tvdFt: c.tvdFt, gasSg: c.gasSg, tempAtDepthF: T, steps: 40 });
  w(`engine column ${i + 1}, pressure at depth at the 40 step default = ${f(eng, 9)} psia, difference from golden = ${e(eng - c.pBottomPsia, 3)} psi`);
  w(`engine column ${i + 1}, surface recovered at the 40 step default = ${f(back, 9)} psia, difference from golden = ${e(back - c.surfaceFromBottom, 3)} psi`);
  w(`derived column ${i + 1}, total lift of the column = ${f(c.pBottomPsia - c.pSurfPsia, 6)} psi over ${f(c.tvdFt, 0)} ft`);
  w(`derived column ${i + 1}, average gradient over the whole column = ${f((c.pBottomPsia - c.pSurfPsia) / c.tvdFt, 9)} psi/ft`);
});
w('');

// ============================================================ SECTION 3
w('# SECTION 3: THE REAL GAS COLUMN AGAINST THE 0.02 PSI/FT RULE OF THUMB');
w('# DERIVED from the published column cases. Associate m02 l03 and m05 l03 turn on');
w('# this comparison, so print it rather than assert it. The engine header names the');
w('# 0.02 psi/ft rule of thumb explicitly as the thing it does not do.');
w('# READ THE SIGN CAREFULLY, because it is the whole lesson. The real gas gradient');
w('# is rho / 144 and rho is proportional to p / (z T), so the gradient tracks the');
w('# PRESSURE LEVEL of the column and not the depth. On the 1414.7 psia column it is');
w('# close to twice the rule of thumb, on the 1014.7 psia column about a quarter');
w('# above it, and on the 614.7 psia column about a third BELOW it. A flat rule has');
w('# no pressure in it at all, so it is wrong in one direction on a high pressure');
w('# system and wrong in the other direction on a low pressure one. A lesson that');
w('# says only that the rule of thumb reads low has learned half of it.');
w('# AND A SECOND THING, which contradicts the easy story. Down a real well the');
w('# gradient DOES NOT simply grow with depth. Compression pushes it up and the');
w('# rising geotherm pushes it down, and on all three published columns, which carry');
w('# ordinary linear geotherms, the temperature wins: the local gradient FALLS a few');
w('# percent from surface to packer. Hold the temperature constant and the same');
w('# column shows the gradient rising, which is the isothermal block printed with');
w('# each column below. The gradient grows with PRESSURE. Whether it grows with');
w('# DEPTH is a race between two effects and it has to be computed, not assumed.');
GOLD.columns.forEach((c, i) => {
  const T = D.linearTemperature({ whtF: c.whtF, bhtF: c.bhtF, refDepthFt: c.tvdFt });
  const prof = G.gasColumnPressure({ pSurfPsia: c.pSurfPsia, tvdFt: c.tvdFt, gasSg: c.gasSg, tempAtDepthF: T, steps: 2000 }).profile;
  const nAt = 10;
  for (let k = 0; k <= nAt; k += 1) {
    const d = (c.tvdFt * k) / nAt;
    const idx = Math.round((d / c.tvdFt) * (prof.length - 1));
    const row = prof[idx];
    const flat = c.pSurfPsia + 0.02 * d;
    w(`derived rule of thumb, column ${i + 1} (surface ${f(c.pSurfPsia, 1)} psia, sg ${c.gasSg}) at ${f(d, 1)} ft: `
      + `engine column = ${f(row.pPsia, 6)} psia, flat 0.02 psi/ft rule = ${f(flat, 6)} psia, `
      + `rule error = ${f(flat - row.pPsia, 6)} psi, engine local gradient = ${f(row.gradPsiPerFt, 9)} psi/ft, `
      + `local gradient over 0.02 = ${f(row.gradPsiPerFt / 0.02, 6)} ratio, z = ${f(row.z, 9)}, temperature = ${f(row.tF, 4)} degF`);
  }
  const bot = prof[prof.length - 1];
  w(`derived rule of thumb, column ${i + 1} summary: the local gradient goes from ${f(prof[0].gradPsiPerFt, 9)} psi/ft at surface `
    + `to ${f(bot.gradPsiPerFt, 9)} psi/ft at ${f(c.tvdFt, 0)} ft, a CHANGE of ${f(100 * (bot.gradPsiPerFt / prof[0].gradPsiPerFt - 1), 4)} percent, `
    + `while z goes from ${f(prof[0].z, 9)} to ${f(bot.z, 9)} and the temperature goes from ${f(prof[0].tF, 4)} to ${f(bot.tF, 4)} degF`);
  w(`derived rule of thumb, column ${i + 1} summary: the local gradient therefore FALLS with depth on this well, because the geotherm outruns the compression`);
  const iso = G.gasColumnPressure({ pSurfPsia: c.pSurfPsia, tvdFt: c.tvdFt, gasSg: c.gasSg, tempAtDepthF: () => c.whtF, steps: 2000 }).profile;
  const isoBot = iso[iso.length - 1];
  w(`derived rule of thumb, column ${i + 1} ISOTHERMAL CONTROL, the same column held at its wellhead temperature ${f(c.whtF, 1)} degF throughout: `
    + `local gradient goes from ${f(iso[0].gradPsiPerFt, 9)} psi/ft at surface to ${f(isoBot.gradPsiPerFt, 9)} psi/ft at ${f(c.tvdFt, 0)} ft, `
    + `a CHANGE of ${f(100 * (isoBot.gradPsiPerFt / iso[0].gradPsiPerFt - 1), 4)} percent, and the pressure at depth is ${f(isoBot.pPsia, 9)} psia`);
  w(`derived rule of thumb, column ${i + 1} ISOTHERMAL CONTROL: with the temperature held the gradient RISES with depth, which is compression on its own. `
    + `The geothermal column above is that effect plus the opposite one, and the difference at the packer is ${f(isoBot.pPsia - bot.pPsia, 6)} psi.`);
  w(`derived rule of thumb, column ${i + 1} summary: the flat rule misses the pressure at ${f(c.tvdFt, 0)} ft by ${f(c.pSurfPsia + 0.02 * c.tvdFt - bot.pPsia, 6)} psi, `
    + `which is ${f(Math.abs(c.pSurfPsia + 0.02 * c.tvdFt - bot.pPsia) / (bot.pPsia - c.pSurfPsia) * 100, 4)} percent of the whole lift of the column`);
});
w('');

// ============================================================ SECTION 4
w('# SECTION 4: THE COLUMN CONVERGES. THE STEP REFINEMENT STUDY');
w('# DERIVED from the published column cases and the published design packer depths.');
w('# This is the honest negative result the module is built on, and Associate m05');
w('# owns it. The march is a predictor with a trapezoidal corrector on the gradient,');
w('# so it is second order: every doubling of the step count cuts the remaining error');
w('# by about four. Print the SEQUENCE, not a summary of it, because the skill being');
w('# taught is reading a convergence sequence and not trusting a claim about one.');
w('# The engine calls this march internally at steps = 20 for spacing and valve');
w('# settings, and at steps = 40 for the plotted injection curve, so the last two');
w('# rows of each block are the number a design actually carries.');
const refineTargets = [];
GOLD.columns.forEach((c, i) => refineTargets.push({
  label: `published column ${i + 1}`,
  pSurf: c.pSurfPsia, tvd: c.tvdFt, sg: c.gasSg,
  T: D.linearTemperature({ whtF: c.whtF, bhtF: c.bhtF, refDepthFt: c.tvdFt }),
}));
for (const g of GOLD.designs) {
  refineTargets.push({
    label: `published design ${g.id} at its packer`,
    pSurf: g.inputs.pKickoffPsia, tvd: g.inputs.maxDepthFt, sg: g.inputs.gasSg, T: tempOf(g.inputs),
  });
}
const STEPS = [1, 2, 4, 5, 10, 20, 40, 80, 160, 320, 640, 1280];
for (const t of refineTargets) {
  const ref = refColumn(t.pSurf, t.tvd, t.sg, t.T, t.label)(t.tvd);
  w(`derived step refinement, ${t.label}: surface ${f(t.pSurf, 1)} psia, depth ${f(t.tvd, 1)} ft, sg ${t.sg}`);
  let prevErr = null;
  for (const s of STEPS) {
    const p = G.gasColumnPressure({ pSurfPsia: t.pSurf, tvdFt: t.tvd, gasSg: t.sg, tempAtDepthF: t.T, steps: s }).pBottomPsia;
    const err = p - ref;
    const ratio = (prevErr === null || err === 0) ? null : prevErr / err;
    w(`derived step refinement, ${t.label}, steps = ${String(s).padStart(5)}: column at depth = ${f(p, 9)} psia, `
      + `error against the 20000 step reference = ${e(err, 4)} psi`
      + (ratio === null ? '' : `, error ratio against the previous row = ${f(ratio, 4)}`));
    prevErr = err;
  }
  const p20 = G.gasColumnPressure({ pSurfPsia: t.pSurf, tvdFt: t.tvd, gasSg: t.sg, tempAtDepthF: t.T, steps: 20 }).pBottomPsia;
  const p2000 = G.gasColumnPressure({ pSurfPsia: t.pSurf, tvdFt: t.tvd, gasSg: t.sg, tempAtDepthF: t.T, steps: 2000 }).pBottomPsia;
  w(`derived step refinement, ${t.label}, THE HEADLINE: 20 steps gives ${f(p20, 9)} psia, 2000 steps gives ${f(p2000, 9)} psia, `
    + `spread = ${e(p20 - p2000, 4)} psi on a column that lifts ${f(ref - t.pSurf, 4)} psi`);
  w(`derived step refinement, ${t.label}, the 20 step error as a fraction of the lift = ${e((p20 - p2000) / (ref - t.pSurf), 4)} ratio`);
}
w('derived step refinement, THE LESSON: this column has no truncation problem. The');
w('derived step refinement, error at the step count the engine actually uses is');
w('derived step refinement, thousandths of a psi on systems of over a thousand psia,');
w('derived step refinement, and the error ratio near 4.0 in every block says the');
w('derived step refinement, method is behaving exactly as its order predicts. A');
w('derived step refinement, learner who leaves believing every numerical method is');
w('derived step refinement, suspect has learned the wrong lesson. The skill is');
w('derived step refinement, telling the two cases apart, and the way you tell them');
w('derived step refinement, apart is by refining and watching.');
w('');

// ============================================================ SECTION 5
w('# SECTION 5: THE INJECTION PRESSURE CURVE AND ITS CHORD BIAS');
w('# DERIVED from the published column cases. injectionPressureCurve tabulates the');
w('# march at `steps` samples and then reads any depth by STRAIGHT LINE between two');
w('# samples. That is a second source of error, separate from the march itself, and');
w('# it is the one the deepest injection point later trips over. Everything here is');
w('# measured against a converged 20000 step march of the same column.');
w('# THREE NUMBERS PER ROW, and they mean different things.');
w('#   deviation AT A SAMPLE is pure march truncation: at a tabulated node there is');
w('#     no chord, so this is the error of the march at that step count.');
w('#   deviation BETWEEN SAMPLES is truncation plus chord, which is what a reader of');
w('#     the plotted curve actually suffers.');
w('#   CHORD COMPONENT is the second minus the average of the deviations at the two');
w('#     nodes that bracket it, so it isolates the straight line from the march.');
w('# The chord component is NEGATIVE on these columns because their gradient falls');
w('# slightly with depth, which makes the pressure curve concave, and a chord under a');
w('# concave curve reads low. Associate m05 and Expert m04 both need this block.');
GOLD.columns.forEach((c, i) => {
  const T = D.linearTemperature({ whtF: c.whtF, bhtF: c.bhtF, refDepthFt: c.tvdFt });
  const ref = refColumn(c.pSurfPsia, c.tvdFt, c.gasSg, T, `published column ${i + 1}`);
  for (const n of [4, 8, 16, 32, 64, 128, 256, 512, 1024]) {
    const cur = D.injectionPressureCurve({ pSurfPsia: c.pSurfPsia, gasSg: c.gasSg, tempAtDepthF: T, maxDepthFt: c.tvdFt, steps: n });
    let worst = 0; let worstD = 0;
    const m = 200;
    for (let k = 1; k < m; k += 1) {
      const d = (c.tvdFt * k) / m;
      const bias = cur.at(d) - ref(d);
      if (Math.abs(bias) > Math.abs(worst)) { worst = bias; worstD = d; }
    }
    const h = c.tvdFt / n;
    const jNode = Math.floor(n / 2);
    const dNode = jNode * h;
    const dNodeNext = (jNode + 1) * h;
    const dMid = dNode + h / 2;
    const devNode = cur.at(dNode) - ref(dNode);
    const devNodeNext = cur.at(dNodeNext) - ref(dNodeNext);
    const devMid = cur.at(dMid) - ref(dMid);
    const chordOnly = devMid - 0.5 * (devNode + devNodeNext);
    w(`derived chord bias, column ${i + 1} (surface ${f(c.pSurfPsia, 1)} psia, ${f(c.tvdFt, 0)} ft) at ${String(n).padStart(4)} samples: `
      + `sample spacing = ${f(h, 4)} ft, worst deviation anywhere = ${e(worst, 4)} psi at ${f(worstD, 1)} ft, `
      + `deviation AT the sample at ${f(dNode, 1)} ft = ${e(devNode, 4)} psi, `
      + `deviation BETWEEN samples at ${f(dMid, 1)} ft = ${e(devMid, 4)} psi, `
      + `CHORD COMPONENT = ${e(chordOnly, 4)} psi`);
  }
  w(`derived chord bias, column ${i + 1}, THE HEADLINE: the chord component falls by a factor near four for every doubling of the `
    + `sample count, exactly like the march itself, and at the 64 sample resolution it is thousandths of a psi or smaller. `
    + `It is NEGATIVE throughout, because these columns have a slightly falling gradient and a chord under a concave curve reads low.`);
});
w('');

// ============================================================ SECTION 6
w('# SECTION 6: THE ISOTHERMAL CLOSED FORM, THE MARCH SELF CHECK');
w('# DERIVED. With z pinned at 1 and the temperature held constant the march has a');
w('# closed form to reproduce, and reproducing it is the self asserting gate on the');
w('# routine: a numerical method that cannot reproduce the one case it HAS a closed');
w('# form for is not to be trusted on the cases it has none for.');
w('#');
w('# TWO CLOSED FORMS ARE PRINTED HERE AND THE DIFFERENCE BETWEEN THEM IS THE POINT.');
w('# The textbook form carries the ROUNDED coefficient 0.01875. The engine carries');
w('# its own constants, AIR_MW 28.9625 lbm/lbmol and R 10.7316 psia ft3 per lbmol');
w('# degR, whose coefficient is AIR_MW / (144 R) = 0.0187417041, lower by 4.43e-4');
w('# relative. So the march CANNOT converge onto the textbook form, and against it');
w('# the error parks at a floor that refinement never removes.');
w('#');
w('# The first draft of this block printed only the textbook form and called the');
w('# result convergence. It was not: the gate could not fail, because it was');
w('# measuring a fixed constant mismatch. TWO lesson writers independently refined');
w('# the march, watched the residual park, and reported it rather than writing');
w('# around it. Against the ENGINE-CONSTANT form the march converges properly, to');
w('# about 1e-7 psi at 2000 steps, and that number does keep shrinking.');
w('#');
w('# Both forms stay in the file. The parked residual is teaching material in its');
w('# own right, and it is the cleanest demonstration in the wave of the difference');
w('# between a truncation, which refinement removes, and a difference between two');
w('# FORMULATIONS, which it never touches. Associate m02 l04 and m05 l04 use it.');
{
  const K_TEXTBOOK = 0.01875;
  const K_ENGINE = G.AIR_MW / (144 * G.R_UNIVERSAL);
  // The two constants the engine coefficient is BUILT from, printed as data and
  // not only named in the comment above. A lesson may quote them, and a number
  // that lives only in prose is a number the digest cannot vouch for.
  w(`derived closed form, engine molar mass of air AIR_MW = ${f(G.AIR_MW, 4)} lbm per lbmol`);
  w(`derived closed form, engine gas constant R_UNIVERSAL = ${f(G.R_UNIVERSAL, 4)} psia ft3 per lbmol degR`);
  w(`derived closed form, textbook coefficient = ${f(K_TEXTBOOK, 10)}`);
  w(`derived closed form, engine coefficient, AIR_MW over 144 R = ${f(K_ENGINE, 10)}`);
  w(`derived closed form, the two coefficients differ by = ${e((K_TEXTBOOK - K_ENGINE) / K_ENGINE, 4)} relative`);
  const cases = [
    { pS: 1014.7, d: 8000, sg: 0.65, tF: 140 },
    { pS: 1414.7, d: 11000, sg: 0.7, tF: 175 },
    { pS: 614.7, d: 4000, sg: 0.6, tF: 115 },
  ];
  for (const c of cases) {
    const exact = c.pS * Math.exp((K_TEXTBOOK * c.sg * c.d) / (c.tF + 459.67));
    const engineForm = c.pS * Math.exp((K_ENGINE * c.sg * c.d) / (c.tF + 459.67));
    w(`derived closed form, surface ${f(c.pS, 1)} psia, ${f(c.d, 0)} ft, sg ${c.sg}, isothermal at ${f(c.tF, 1)} degF, z pinned at 1.0:`);
    w(`derived closed form, exact p(D) = pSurf * exp(0.01875 * sg * D / T) = ${f(exact, 9)} psia`);
    w(`derived closed form, ENGINE-CONSTANT p(D) = pSurf * exp(AIR_MW / (144 R) * sg * D / T) = ${f(engineForm, 9)} psia`);
    w(`derived closed form, the two closed forms differ by = ${e(exact - engineForm, 4)} psi`);
    for (const s of [2, 10, 40, 200, 2000]) {
      const p = G.gasColumnPressure({ pSurfPsia: c.pS, tvdFt: c.d, gasSg: c.sg, tempAtDepthF: () => c.tF, steps: s, zOverride: 1 }).pBottomPsia;
      w(`derived closed form, march at ${String(s).padStart(4)} steps = ${f(p, 9)} psia, error against the closed form = ${e(p - exact, 4)} psi`);
      w(`derived closed form, march at ${String(s).padStart(4)} steps, error against the ENGINE-CONSTANT form = ${e(p - engineForm, 4)} psi`);
    }
  }
}
w('');

// ============================================================ SECTION 7
w('# SECTION 7: PUBLISHED GOLDEN NITROGEN DOME CHARGES, AND A DOME AS A THERMOMETER');
w('# The dome charge is set on a 60 degF test rack and then works at valve');
w('# temperature. The correction is a fixed volume real gas ratio P/(z T) = constant');
w('# on nitrogen z, and Ct = Pd60 / PdT. Professional m02 l03 owns this. The linear');
w('# 1 + 0.00215 (T - 60) rule of thumb printed in older manuals is shown beside it,');
w('# because the engine header names that rule of thumb as the thing it refuses.');
for (const r of GOLD.nitrogen) {
  w(`golden nitrogen, 60 degF charge ${f(r.pd60Psia, 1)} psia at valve temperature ${f(r.tF, 1)} degF, dome at temperature = ${f(r.domeAtTempPsia, 9)} psia`);
  w(`golden nitrogen, 60 degF charge ${f(r.pd60Psia, 1)} psia at valve temperature ${f(r.tF, 1)} degF, Ct = Pd60 / PdT = ${f(r.ct, 9)} dimensionless`);
  w(`golden nitrogen, 60 degF charge ${f(r.pd60Psia, 1)} psia at valve temperature ${f(r.tF, 1)} degF, z at 60 degF = ${f(r.z60, 9)}, z at valve temperature = ${f(r.zT, 9)}`);
  const eng = V.domePressureAtTemp({ pd60Psia: r.pd60Psia, tF: r.tF });
  const back = V.domePressureAt60({ pdTPsia: r.domeAtTempPsia, tF: r.tF });
  const ctEng = V.temperatureCorrectionFactor({ pdTPsia: r.domeAtTempPsia, tF: r.tF });
  const lin = 1 / (1 + 0.00215 * (r.tF - 60));
  w(`engine nitrogen, 60 degF charge ${f(r.pd60Psia, 1)} psia at ${f(r.tF, 1)} degF, dome at temperature = ${f(eng, 9)} psia, difference from golden = ${e(eng - r.domeAtTempPsia, 3)} psi`);
  w(`engine nitrogen, inverse from ${f(r.domeAtTempPsia, 6)} psia at ${f(r.tF, 1)} degF back to 60 degF = ${f(back, 9)} psia, difference from the golden charge = ${e(back - r.pd60Psia, 3)} psi`);
  w(`engine nitrogen, temperatureCorrectionFactor at ${f(r.tF, 1)} degF = ${f(ctEng, 9)}, difference from golden Ct = ${e(ctEng - r.ct, 3)}`);
  w(`derived nitrogen, the linear rule of thumb 1 / (1 + 0.00215 (T - 60)) at ${f(r.tF, 1)} degF = ${f(lin, 9)}, `
    + `real gas Ct = ${f(r.ct, 9)}, rule of thumb error = ${f(lin - r.ct, 9)} which is ${f(100 * (lin - r.ct) / r.ct, 4)} percent`);
  w(`derived nitrogen, the dome pressure the linear rule of thumb would predict at ${f(r.tF, 1)} degF = ${f(r.pd60Psia / lin, 6)} psia against the real gas ${f(r.domeAtTempPsia, 6)} psia, a miss of ${f(r.pd60Psia / lin - r.domeAtTempPsia, 6)} psi`);
}
w('derived nitrogen, a dome charge is therefore a THERMOMETER as much as a spring:');
w('derived nitrogen, at a fixed 60 degF charge the pressure the valve actually feels');
w('derived nitrogen, rises with valve depth because the valve gets hotter, and the');
w('derived nitrogen, rule of thumb drifts further the hotter and the deeper it gets.');
w('');

// ============================================================ SECTION 8
w('# SECTION 8: PUBLISHED GOLDEN THORNHILL AND CRAVER THROUGHPUT');
w('# The industry convention for what a port will pass, with the ratio clamped at');
w('# the critical value so one expression covers both branches continuously.');
w('# Professional m05 owns this. Discharge coefficient = ' + V.TC_DISCHARGE_COEFF
  + ', k = 1.27, critical ratio = ' + f(V.criticalPressureRatio(1.27), 9) + '.');
for (const r of GOLD.thornhillCraver) {
  const eng = V.thornhillCraver({ pUpPsia: r.pUpPsia, pDnPsia: r.pDnPsia, portIdIn: r.portIdIn, gasSg: r.gasSg, tF: r.tF });
  w(`golden thornhillCraver, port ${r.portIdIn} in, upstream ${f(r.pUpPsia, 1)} psia, downstream ${f(r.pDnPsia, 1)} psia, sg ${r.gasSg}, ${f(r.tF, 1)} degF, `
    + `throughput = ${f(r.qMscfd, 9)} Mscf/d`);
  w(`golden thornhillCraver, port ${r.portIdIn} in, critical pressure ratio = ${f(r.criticalRatio, 9)} dimensionless`);
  w(`engine thornhillCraver, port ${r.portIdIn} in, upstream ${f(r.pUpPsia, 1)} psia, downstream ${f(r.pDnPsia, 1)} psia, `
    + `throughput = ${f(eng.qMscfd, 9)} Mscf/d, difference from golden = ${e(eng.qMscfd - r.qMscfd, 3)} Mscf/d`);
  w(`engine thornhillCraver, port ${r.portIdIn} in, actual pressure ratio = ${f(eng.ratio, 9)}, regime = ${eng.regime}, port flow area = ${f(eng.areaIn2, 9)} in2`);
}
w('# DERIVED regime sweep on the first published row: one port, one upstream');
w('# pressure, downstream walked from choked to nearly balanced. Professional m05 l02');
w('# owns the flat part of this curve.');
{
  const base = GOLD.thornhillCraver[0];
  for (const ratio of [0.10, 0.20, 0.30, 0.40, 0.50, 0.551208317714, 0.60, 0.70, 0.80, 0.90, 0.95, 0.98, 0.999]) {
    const pDn = base.pUpPsia * ratio;
    const r = V.thornhillCraver({ pUpPsia: base.pUpPsia, pDnPsia: pDn, portIdIn: base.portIdIn, gasSg: base.gasSg, tF: base.tF });
    w(`derived throughput regime, port ${base.portIdIn} in, upstream ${f(base.pUpPsia, 1)} psia at ${f(base.tF, 1)} degF sg ${base.gasSg}, `
      + `downstream ${f(pDn, 4)} psia, ratio ${f(ratio, 9)}, throughput = ${f(r.qMscfd, 6)} Mscf/d, regime = ${r.regime}`);
  }
  w('derived throughput regime, THE POINT: below the critical ratio the rate does not');
  w('derived throughput regime, change at all as the downstream pressure falls, so a');
  w('derived throughput regime, throughput number quoted without its regime is half a');
  w('derived throughput regime, statement.');
}
w('# DERIVED port area and ratio table for the two bellows sizes the published cases');
w('# use. Professional m02 l02 owns R = Ap / Ab.');
for (const ab of [0.31, 0.77]) {
  for (const p of [0.125, 0.15625, 0.1875, 0.21875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625, 0.75]) {
    w(`derived port geometry, port ${p} in, area = ${f(V.portArea(p), 9)} in2, bellows ${ab} in2, `
      + `R = ${f(V.portToBellowsRatio({ portIdIn: p, bellowsAreaIn2: ab }), 9)}, `
      + `1 / (1 - R) = ${f(1 / (1 - V.portToBellowsRatio({ portIdIn: p, bellowsAreaIn2: ab })), 9)}`);
  }
}
w('');

// ============================================================ SECTIONS 9-12: the four published designs
const sectionNo = { westTexasOil: 9, deepHighPressure: 10, constantPressurePPO: 11, midDecrementKnifeEdge: 12 };
for (const g of GOLD.designs) {
  const i = g.inputs;
  const r = run[g.id];
  const T = tempOf(i);
  w(`# SECTION ${sectionNo[g.id]}: PUBLISHED DESIGN CASE ${g.id}`);
  w(`# ${g.note}`);
  w(`golden design ${g.id}, input pKickoffPsia = ${f(i.pKickoffPsia, 1)} psia`);
  w(`golden design ${g.id}, input pOperatingPsia = ${f(i.pOperatingPsia, 1)} psia`);
  w(`golden design ${g.id}, input pWhUnloadPsia = ${f(i.pWhUnloadPsia, 1)} psia`);
  w(`golden design ${g.id}, input method = ${i.method}`);
  w(`golden design ${g.id}, input dpPerValvePsi = ${f(i.dpPerValvePsi, 2)} psi per valve`);
  w(`golden design ${g.id}, input dpTransferPsi = ${f(i.dpTransferPsi, 1)} psi`);
  w(`golden design ${g.id}, input killGradPsiPerFt = ${i.killGradPsiPerFt} psi/ft`);
  w(`golden design ${g.id}, input unloadGradPsiPerFt = ${i.unloadGradPsiPerFt} psi/ft`);
  w(`golden design ${g.id}, input gasSg = ${i.gasSg}`);
  w(`golden design ${g.id}, input maxDepthFt = ${f(i.maxDepthFt, 1)} ft, minSpacingFt = ${f(i.minSpacingFt, 1)} ft, maxValves = ${i.maxValves}`);
  w(`golden design ${g.id}, input wellhead temperature = ${f(i.wht, 1)} degF, bottom temperature = ${f(i.bht, 1)} degF at reference depth ${f(i.refDepth, 1)} ft`);
  w(`golden design ${g.id}, input valveType = ${i.valveType}, bellowsAreaIn2 = ${i.bellowsAreaIn2} in2, bottomOrifice = ${i.bottomOrifice}, orificeIdIn = ${i.orificeIdIn}`);
  w(`golden design ${g.id}, input port catalog = ${i.ports.join(', ')} in`);
  w(`golden design ${g.id}, input qgiTargetMscfd = ${f(i.qgiTargetMscfd, 1)} Mscf/d`);
  w(`golden design ${g.id}, stop reason = ${g.stopReason}`);
  w(`golden design ${g.id}, valve count = ${g.depths.length}`);
  g.depths.forEach((d, k) => {
    w(`golden design ${g.id}, valve ${k + 1} depth = ${f(d, 9)} ft, surface injection pressure at its stage = ${f(g.surfacePressures[k], 4)} psia`);
  });
  g.depths.forEach((d, k) => {
    if (k === 0) return;
    w(`derived design ${g.id}, spacing increment valve ${k} to valve ${k + 1} = ${f(d - g.depths[k - 1], 9)} ft against a stated minimum of ${f(i.minSpacingFt, 1)} ft`);
  });
  w(`engine design ${g.id}, stop reason = ${r.stopReason}, valve count = ${r.depths.length}, `
    + `largest depth difference from the golden = ${e(Math.max(...r.depths.map((d, k) => Math.abs(d - g.depths[k]))), 3)} ft`);
  w(`engine design ${g.id}, pOperatingPsia carried into the plotted injection curve = ${f(r.pOperatingPsia, 4)} psia`);
  w(`engine design ${g.id}, warnings raised = ${r.warnings.length ? r.warnings.map((x) => x.code).join(', ') : 'none'}`);
  r.warnings.forEach((x, k) => w(`engine design ${g.id}, warning ${k + 1} (${x.code}): ${x.message}`));
  // valve table
  g.valves.forEach((v, k) => {
    const ev = r.valves[k];
    const tag = `${g.id} valve ${k + 1}`;
    w(`golden ${tag}, depth = ${f(v.depthFt, 9)} ft, temperature at depth = ${f(v.tempF, 9)} degF, type = ${v.valveType}, port = ${v.portIdIn} in`);
    w(`golden ${tag}, injection pressure at depth = ${f(v.pInjAtDepthPsia, 9)} psia, production pressure at depth = ${f(v.pProdAtDepthPsia, 9)} psia`);
    if (v.r != null) w(`golden ${tag}, port to bellows ratio R = ${f(v.r, 9)}`);
    if (v.domeAtTempPsia != null) w(`golden ${tag}, dome pressure at valve temperature = ${f(v.domeAtTempPsia, 9)} psia`);
    if (v.dome60Psia != null) w(`golden ${tag}, dome pressure at the 60 degF test rack = ${f(v.dome60Psia, 9)} psia`);
    if (v.testRackOpeningPsia != null) w(`golden ${tag}, test rack opening pressure = ${f(v.testRackOpeningPsia, 9)} psia`);
    if (v.spreadPsi != null) w(`golden ${tag}, spread = ${f(v.spreadPsi, 9)} psi`);
    if (v.closingSurfacePressurePsia != null) w(`golden ${tag}, closing surface pressure = ${f(v.closingSurfacePressurePsia, 9)} psia`);
    w(`golden ${tag}, throughput = ${f(v.throughputMscfd, 9)} Mscf/d`);
    w(`engine ${tag}, throughput regime = ${ev.throughputRegime}, passes the ${f(i.qgiTargetMscfd, 0)} Mscf/d target = ${ev.passesTarget}, `
      + `closes at the operating surface pressure ${f(r.pOperatingPsia, 1)} psia = ${ev.closesAtOperating}`);
    const diffs = ['pInjAtDepthPsia', 'domeAtTempPsia', 'dome60Psia', 'testRackOpeningPsia', 'spreadPsi', 'closingSurfacePressurePsia', 'throughputMscfd']
      .filter((kk) => v[kk] != null && ev[kk] != null)
      .map((kk) => `${kk} ${e(ev[kk] - v[kk], 2)}`);
    w(`engine ${tag}, differences from the golden: ${diffs.join(', ')}`);
    if (ev.valveType !== 'orifice') {
      const pick = V.selectPort({
        ports: i.ports.map((id) => ({ idIn: id })), targetMscfd: i.qgiTargetMscfd,
        pUpPsia: ev.pInjAtDepthPsia, pDnPsia: ev.pProdAtDepthPsia, gasSg: i.gasSg, tF: T(v.depthFt),
      });
      w(`derived ${tag}, port selection at this stage differential, smallest port that passes ${f(i.qgiTargetMscfd, 0)} Mscf/d = `
        + `${pick.port ? `${pick.port.idIn} in` : 'none in the catalog'}`);
      pick.candidates.forEach((c) => {
        w(`derived ${tag}, port candidate ${c.port.idIn} in passes ${f(c.qMscfd, 6)} Mscf/d, regime ${c.regime}, ratio ${f(c.ratio, 9)}`);
      });
    }
  });
  // unloading
  w(`# ${g.id} unloading, stage by stage. The golden closingMargins come from the`);
  w(`# oracle, which evaluates the published closing rule (Takacs ch. 3, Brown vol. 2a,`);
  w(`# API Book 6) AT VALVE DEPTH off a forward RK4 column. The engine evaluates the`);
  w(`# same rule AT SURFACE by inverting a coarser column, so the two are different`);
  w(`# roads to the same verdict and a lesson may say so.`);
  g.unloading.forEach((s, k) => {
    const es = r.unloading[k];
    w(`golden ${g.id} stage ${s.stage}, point of injection transfers to valve ${s.valve} at ${f(s.depthFt, 9)} ft`);
    w(`golden ${g.id} stage ${s.stage}, surface injection pressure = ${f(s.surfaceInjectionPsia, 4)} psia`);
    w(`golden ${g.id} stage ${s.stage}, injection pressure at that depth = ${f(s.injectionAtDepthPsia, 9)} psia, production pressure at that depth = ${f(s.productionAtDepthPsia, 9)} psia`);
    w(`golden ${g.id} stage ${s.stage}, fluid level = ${f(s.fluidLevelFt, 9)} ft, gas rate through the valve = ${f(s.gasRateMscfd, 9)} Mscf/d, passes target = ${s.passesTarget}`);
    w(`golden ${g.id} stage ${s.stage}, upper valves still open = ${s.upperValvesOpen.length ? s.upperValvesOpen.join(', ') : 'none'}, multipointing = ${s.multipointing}`);
    s.closingMargins.forEach((m) => {
      w(`golden ${g.id} stage ${s.stage}, closing margin on valve ${m.valve}: family ${m.family}, acting on the ${m.actingOn} side, `
        + `acting pressure at valve depth = ${f(m.actingPressurePsia, 9)} psia, dome at valve temperature = ${f(m.domeAtTempPsia, 9)} psia, `
        + `margin = ${f(m.marginPsi, 9)} psi, spread = ${f(m.spreadPsi, 9)} psi, open = ${m.open}`
        + (m.casingDropPsi == null ? '' : `, casing has dropped ${f(m.casingDropPsi, 9)} psi from this valve own opening stage`));
    });
    w(`engine ${g.id} stage ${s.stage}, upper valves still open = ${es.upperValvesOpen.length ? es.upperValvesOpen.join(', ') : 'none'}, multipointing = ${es.multipointing}`);
    for (let j = 0; j < k; j += 1) {
      const cl = r.valves[j].closingSurfacePressurePsia;
      if (cl == null) continue;
      w(`engine ${g.id} stage ${s.stage}, surface test on valve ${j + 1}: casing ${f(es.surfaceInjectionPsia, 4)} psia against the closing surface pressure ${f(cl, 9)} psia, `
        + `surface margin = ${f(es.surfaceInjectionPsia - cl, 9)} psi, open = ${es.surfaceInjectionPsia >= cl}`);
    }
  });
  const agree = g.unloading.every((s, k) => s.multipointing === run[g.id].unloading[k].multipointing
    && JSON.stringify(s.upperValvesOpen) === JSON.stringify(run[g.id].unloading[k].upperValvesOpen));
  w(`engine design ${g.id}, VERDICT AGREEMENT with the oracle across all ${g.unloading.length} stages = ${agree}`);
  w('');
}

// ============================================================ SECTION 13: PPO divergence
w('# SECTION 13: THE PPO DIVERGENCE, BOTH SIDES OF IT');
w('# A PINNED KNOWN DIVERGENCE, not a bug to be worked around in a lesson and not a');
w('# worked example. Professional m03 states it as a limit. Expert may cite it as the');
w('# clearest case in the course of a verdict that is confident and wrong.');
w('# The engine computes closingSurfacePressurePsia by taking the dome charge, which');
w('# for a PPO valve balances against the TUBING, and inverting it up a CASING gas');
w('# column. unloadingSequence then compares that number with the casing pressure. So');
w('# a production operated string is closed on the wrong fluid. Not fixed, because the');
w('# engine is consumed by a live Suite app.');
{
  const g = designs.constantPressurePPO;
  const r = run.constantPressurePPO;
  const casingSide = [];
  const tubingSide = [];
  g.valves.forEach((v, k) => {
    if (v.closingSurfacePressurePsia == null) return;
    const clear = g.inputs.pKickoffPsia - v.closingSurfacePressurePsia;
    casingSide.push(clear);
    w(`engine PPO divergence, valve ${k + 1} at ${f(v.depthFt, 6)} ft: the engine casing side test compares the constant surface pressure `
      + `${f(g.inputs.pKickoffPsia, 1)} psia with a closing surface pressure of ${f(v.closingSurfacePressurePsia, 9)} psia, `
      + `so it clears the open threshold by ${f(clear, 9)} psi and the engine calls the valve OPEN`);
  });
  const seen = new Set();
  g.unloading.forEach((s) => s.closingMargins.forEach((m) => {
    if (seen.has(m.valve)) return; seen.add(m.valve);
    tubingSide.push(m.marginPsi);
    w(`golden PPO divergence, valve ${m.valve}: the published rule for a PPO valve tests the TUBING at valve depth, `
      + `${f(m.actingPressurePsia, 9)} psia against a dome at valve temperature of ${f(m.domeAtTempPsia, 9)} psia, `
      + `so it MISSES the open threshold by ${f(-m.marginPsi, 9)} psi and the oracle calls the valve SHUT`);
  }));
  w(`derived PPO divergence, the casing side clears by ${f(Math.min(...casingSide), 6)} to ${f(Math.max(...casingSide), 6)} psi across the six valves`);
  w(`derived PPO divergence, the tubing side rule it should be judged by misses by ${f(Math.min(...tubingSide.map((x) => -x)), 6)} to ${f(Math.max(...tubingSide.map((x) => -x)), 6)} psi on every valve`);
  w(`engine PPO divergence, the engine therefore reports multipointing at stages ${r.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ')} `
    + `with upper valves ${JSON.stringify(r.unloading.map((s) => s.upperValvesOpen))}`);
  w(`golden PPO divergence, the oracle reports multipointing at ${g.unloading.filter((s) => s.multipointing).length ? g.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') : 'no stage at all'}, `
    + `every stage clean`);
  w(`derived PPO divergence, the two disagree on all ${g.unloading.filter((s, k) => k > 0).length} later stages of this design`);
  w('derived PPO divergence, THE SECOND SYMPTOM: every spread in this PPO string is');
  w('derived PPO divergence, NEGATIVE, because valveSpread is handed the production');
  w('derived PPO divergence, pressure as the opening side and the casing as the other');
  w('derived PPO divergence, side, and on this well the casing is far above the tubing.');
  g.valves.forEach((v, k) => {
    w(`golden PPO divergence, valve ${k + 1} spread = ${f(v.spreadPsi, 9)} psi, which a lesson must read as a sign that the sides have been swapped and not as a valve property`);
  });
}
w('');

// ============================================================ SECTION 14
w('# SECTION 14: THE TOP VALVE, AND THE FIXED POINT THAT FINDS IT');
w('# DERIVED on published inputs. Valve 1 sits where the injection line first');
w('# overcomes a full column of kill fluid above the unloading wellhead pressure.');
w('# The depth depends on the injection pressure which depends on the depth, so the');
w('# engine iterates. The first iterate is the answer you would get if gas were');
w('# weightless, and the sequence shows exactly what the weight of the gas buys you.');
w('# Associate m04 owns all of this.');
for (const g of GOLD.designs) {
  const i = g.inputs;
  const T = tempOf(i);
  const floor = Math.min(i.maxDepthFt, i.maxDepthFt);
  let d = Math.min(Math.max((i.pKickoffPsia - i.pWhUnloadPsia) / i.killGradPsiPerFt, 0), floor);
  w(`derived top valve, ${g.id}: kickoff ${f(i.pKickoffPsia, 1)} psia, unloading wellhead ${f(i.pWhUnloadPsia, 1)} psia, kill fluid ${i.killGradPsiPerFt} psi/ft`);
  w(`derived top valve, ${g.id}, iterate 0 (weightless gas, (pKickoff - pWhUnload) / killGrad) = ${f(d, 9)} ft`);
  for (let k = 1; k <= 8; k += 1) {
    const pInj = G.gasColumnPressure({ pSurfPsia: i.pKickoffPsia, tvdFt: d, gasSg: i.gasSg, tempAtDepthF: T, steps: 20 }).pBottomPsia;
    const next = Math.min(Math.max((pInj - i.pWhUnloadPsia) / i.killGradPsiPerFt, 0), floor);
    w(`derived top valve, ${g.id}, iterate ${k}: injection pressure at ${f(d, 6)} ft = ${f(pInj, 9)} psia, next depth = ${f(next, 9)} ft, move = ${f(next - d, 9)} ft`);
    if (Math.abs(next - d) < 0.01) { d = next; break; }
    d = next;
  }
  const eng = D.topValveDepth({
    pKickoffPsia: i.pKickoffPsia, pWhUnloadPsia: i.pWhUnloadPsia, killGradPsiPerFt: i.killGradPsiPerFt,
    gasSg: i.gasSg, tempAtDepthF: T, maxDepthFt: i.maxDepthFt,
  });
  w(`engine top valve, ${g.id}, topValveDepth returns ${f(eng, 9)} ft, and the published valve 1 depth is ${f(g.depths[0], 9)} ft`);
  w(`derived top valve, ${g.id}, the weight of the gas moves the top valve DEEPER by ${f(eng - (i.pKickoffPsia - i.pWhUnloadPsia) / i.killGradPsiPerFt, 9)} ft `
    + `against the weightless answer, which is ${f(100 * (eng / ((i.pKickoffPsia - i.pWhUnloadPsia) / i.killGradPsiPerFt) - 1), 4)} percent`);
  w(`derived top valve, ${g.id}, the top valve depends on the kickoff pressure and NOT on the decrement, so it is the one depth in the string that a decrement change cannot move`);
}
w('# DERIVED: what moves the top valve. One input walked at a time, all others held');
w('# at the published westTexasOil values. Associate m04 l03 owns this.');
{
  const i = designs.westTexasOil.inputs; const T = tempOf(i);
  const tv = (over) => D.topValveDepth({
    pKickoffPsia: over.pKickoffPsia ?? i.pKickoffPsia,
    pWhUnloadPsia: over.pWhUnloadPsia ?? i.pWhUnloadPsia,
    killGradPsiPerFt: over.killGradPsiPerFt ?? i.killGradPsiPerFt,
    gasSg: over.gasSg ?? i.gasSg, tempAtDepthF: T, maxDepthFt: i.maxDepthFt,
  });
  for (const p of [864.7, 914.7, 964.7, 1014.7, 1064.7, 1114.7, 1164.7]) {
    w(`derived top valve sweep, westTexasOil with kickoff ${f(p, 1)} psia, top valve = ${f(tv({ pKickoffPsia: p }), 9)} ft`);
  }
  for (const p of [64.7, 89.7, 114.7, 139.7, 164.7, 214.7]) {
    w(`derived top valve sweep, westTexasOil with unloading wellhead ${f(p, 1)} psia, top valve = ${f(tv({ pWhUnloadPsia: p }), 9)} ft`);
  }
  for (const kg of [0.35, 0.40, 0.45, 0.50, 0.55, 0.60]) {
    w(`derived top valve sweep, westTexasOil with kill fluid ${kg} psi/ft, top valve = ${f(tv({ killGradPsiPerFt: kg }), 9)} ft`);
  }
  for (const sg of [0.55, 0.60, 0.65, 0.70, 0.75, 0.80]) {
    w(`derived top valve sweep, westTexasOil with injection gas sg ${sg}, top valve = ${f(tv({ gasSg: sg }), 9)} ft`);
  }
  w('derived top valve sweep, THE ORDER OF INFLUENCE on this well: the kill fluid');
  w('derived top valve sweep, gradient and the kickoff pressure move the top valve');
  w('derived top valve sweep, hundreds of feet, the wellhead pressure moves it tens of');
  w('derived top valve sweep, feet, and the gas gravity moves it tens of feet through');
  w('derived top valve sweep, the weight of the injection column alone.');
}
w('');

// ============================================================ SECTION 15
w('# SECTION 15: SPACING IS A RECURSION, MADE VISIBLE');
w('#');
w('# PROVENANCE, AND IT MATTERS BECAUSE TWO SETS OF NUMBERS LIVE IN THIS FILE.');
w('# The depths and increments below come from a STANDALONE RE-RUN of the spacing');
w('# recursion, iterate by iterate, so a lesson can show it converging. Section 9');
w('# prints the depths and increments the DESIGN ITSELF returned. The two agree to');
w('# about seven significant figures and disagree after that: valve 1 to valve 2 is');
w('# 1563.466592902 ft here and 1563.466503048 ft there, and the pattern repeats');
w('# down the string. Neither is wrong. They are two roads to one quantity, and the');
w('# fixed point is stopped at a tolerance rather than solved exactly.');
w('#');
w('# So do not pair a head from this section with an increment from section 9. A');
w('# lesson writer reported the trap after keeping each of their lessons internally');
w('# consistent on one road or the other, which is the right way to handle it.');
w('#');
w('# DERIVED on published westTexasOil inputs. Professional m01 owns this. Valve n');
w('# sits where the injection line at the decremented surface pressure, less the');
w('# transfer differential, still beats the transfer pressure at valve n-1, with kill');
w('# fluid in between. Written out, valve n is the fixed point of');
w('#   d = d(n-1) + ( pInj(pSurf(n), d) - dpTransfer - pProd(n-1) ) / killGrad');
w('# and the engine iterates it to 0.01 ft. Here is that iteration, valve by valve.');
{
  const i = designs.westTexasOil.inputs; const T = tempOf(i);
  const g = designs.westTexasOil;
  const dec = i.dpPerValvePsi;
  for (let n = 2; n <= g.depths.length; n += 1) {
    const pSurfN = i.pKickoffPsia - (n - 1) * dec;
    const dPrev = g.depths[n - 2];
    const pProdPrev = i.pWhUnloadPsia + i.unloadGradPsiPerFt * dPrev;
    w(`derived spacing recursion, westTexasOil valve ${n}: surface pressure at this stage = ${f(i.pKickoffPsia, 1)} - ${n - 1} x ${f(dec, 2)} = ${f(pSurfN, 4)} psia`);
    w(`derived spacing recursion, westTexasOil valve ${n}: valve ${n - 1} sits at ${f(dPrev, 9)} ft and its transfer production pressure is `
      + `${f(i.pWhUnloadPsia, 1)} + ${i.unloadGradPsiPerFt} x ${f(dPrev, 6)} = ${f(pProdPrev, 9)} psia`);
    let d = dPrev + i.minSpacingFt;
    w(`derived spacing recursion, westTexasOil valve ${n}: iterate 0 (the minimum spacing seed) = ${f(d, 9)} ft`);
    for (let k = 1; k <= 10; k += 1) {
      const pInj = G.gasColumnPressure({ pSurfPsia: pSurfN, tvdFt: d, gasSg: i.gasSg, tempAtDepthF: T, steps: 20 }).pBottomPsia;
      const next = dPrev + (pInj - i.dpTransferPsi - pProdPrev) / i.killGradPsiPerFt;
      w(`derived spacing recursion, westTexasOil valve ${n}: iterate ${k}: injection at ${f(d, 6)} ft = ${f(pInj, 9)} psia, `
        + `available head = ${f(pInj - i.dpTransferPsi - pProdPrev, 9)} psi, next depth = ${f(next, 9)} ft, move = ${f(next - d, 9)} ft`);
      if (Math.abs(next - d) < 0.01) { d = next; break; }
      d = next;
    }
    w(`derived spacing recursion, westTexasOil valve ${n}: converged at ${f(d, 9)} ft, published depth is ${f(g.depths[n - 1], 9)} ft`
      + (n === g.depths.length ? ' (the last mandrel is pulled to the target depth, see section 18)' : ''));
    w(`derived spacing recursion, westTexasOil valve ${n}: increment from valve ${n - 1} = ${f(d - dPrev, 9)} ft`);
  }
  w('derived spacing recursion, THE SHAPE OF IT: the increments SHRINK on the way down,');
  w('derived spacing recursion, because the surface pressure is falling by a fixed');
  w('derived spacing recursion, amount per valve while the transfer pressure it has to');
  w('derived spacing recursion, beat is rising with depth. That is why a string runs out');
  w('derived spacing recursion, of room rather than running out of valves.');
  const g2 = designs.westTexasOil;
  g2.depths.forEach((d, k) => {
    if (k === 0) return;
    w(`derived spacing recursion, westTexasOil increment ${k} to ${k + 1} = ${f(d - g2.depths[k - 1], 9)} ft`);
  });
}
w('');

// ============================================================ SECTION 16
w('# SECTION 16: CHANGE ONE DECREMENT, MOVE EVERY DEPTH BELOW IT');
w('# DERIVED on published inputs, one input walked. This is the block that proves');
w('# result 2 of the course: a design is a string and not a list of valves.');
w('# Valve 1 NEVER moves, because it is set by the kickoff pressure alone. Every valve');
w('# under it moves, and the move compounds downward.');
for (const id of ['westTexasOil', 'midDecrementKnifeEdge']) {
  const i = designs[id].inputs;
  const base = run[id];
  const decs = id === 'westTexasOil'
    ? [15, 20, 22.5, 25, 27.5, 30, 35, 40, 50]
    : [20, 23, 25, 26, 26.75, 27.5, 30, 35, 40];
  for (const dec of decs) {
    const r = D.designGasLift(adapt({ ...i, dpPerValvePsi: dec }));
    const tag = dec === i.dpPerValvePsi ? ' (THE PUBLISHED VALUE)' : '';
    w(`derived decrement sweep, ${id} at ${f(dec, 2)} psi per valve${tag}: valve count = ${r.depths.length}, stop reason = ${r.stopReason}`);
    r.depths.forEach((d, k) => {
      const shift = k < base.depths.length ? d - base.depths[k] : null;
      w(`derived decrement sweep, ${id} at ${f(dec, 2)} psi per valve, valve ${k + 1} depth = ${f(d, 9)} ft`
        + (shift === null ? ' (this valve does not exist in the published design)' : `, shift against the published design = ${f(shift, 9)} ft`));
    });
    w(`derived decrement sweep, ${id} at ${f(dec, 2)} psi per valve, deepest valve = ${f(r.depths[r.depths.length - 1], 9)} ft, `
      + `multipointing stages = ${r.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') || 'none'}`);
  }
  w(`derived decrement sweep, ${id}, THE POINT: valve 1 reads the same depth in every`);
  w(`derived decrement sweep, ${id}, row of this sweep and nothing below it does. A`);
  w(`derived decrement sweep, ${id}, decrement is not a property of one valve, it is the`);
  w(`derived decrement sweep, ${id}, step size of the whole recursion.`);
}
w('');

// ============================================================ SECTION 17
w('# SECTION 17: TWO CONVENTIONS, ONE RECURSION');
w('# DERIVED. surfaceClose drops the surface injection pressure a fixed amount per');
w('# valve, which is what makes the upper valves close as the point of injection moves');
w('# down. constantPressure holds the surface pressure and leans on the transfer');
w('# differential alone: the engine sets the decrement to zero and runs the SAME');
w('# recursion. Professional m01 l04 owns this. The published constantPressurePPO case');
w('# is the convention seen on its own; here it is seen as a difference, by running');
w('# two published designs both ways.');
for (const id of ['westTexasOil', 'midDecrementKnifeEdge']) {
  const i = designs[id].inputs;
  const cp = D.designGasLift(adapt({ ...i, method: 'constantPressure' }));
  const sc = run[id];
  w(`derived convention, ${id} on surfaceClose at ${f(i.dpPerValvePsi, 2)} psi per valve (THE PUBLISHED SETUP): `
    + `${sc.depths.length} valves, stop reason ${sc.stopReason}, deepest ${f(sc.depths[sc.depths.length - 1], 9)} ft`);
  w(`derived convention, ${id} on constantPressure: ${cp.depths.length} valves, stop reason ${cp.stopReason}, deepest ${f(cp.depths[cp.depths.length - 1], 9)} ft`);
  const n = Math.max(sc.depths.length, cp.depths.length);
  for (let k = 0; k < n; k += 1) {
    w(`derived convention, ${id} valve ${k + 1}: surfaceClose = ${k < sc.depths.length ? f(sc.depths[k], 9) + ' ft at ' + f(sc.surfacePressures[k], 4) + ' psia' : 'no valve'}, `
      + `constantPressure = ${k < cp.depths.length ? f(cp.depths[k], 9) + ' ft at ' + f(cp.surfacePressures[k], 4) + ' psia' : 'no valve'}`);
  }
  w(`derived convention, ${id} on constantPressure, multipointing stages = ${cp.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') || 'none'}`);
  w(`derived convention, ${id} on surfaceClose, multipointing stages = ${sc.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') || 'none'}`);
}
w('derived convention, THE TRADE: holding the surface pressure reaches the target in');
w('derived convention, FEWER valves and wider steps, and it removes the very mechanism');
w('derived convention, that shuts the upper valves, so the string that needs fewer');
w('derived convention, mandrels is the string more likely to inject at two depths.');
w('');

// ============================================================ SECTION 18
w('# SECTION 18: WHERE SPACING STOPS, AND THE MINIMUM SPACING EXEMPTION');
w('# Four stop reasons exist and three of them raise a warning. Professional m01 l05');
w('# owns this. The exemption is a real engine behaviour and a lesson must state it.');
w('# DEFECT (d), stated as a limit: when the recursion lands at or past the floor the');
w('# engine pushes that mandrel to the floor and stops WITHOUT testing minSpacingFt,');
w('# so the target-depth mandrel is exempt from the minimum the design declared.');
for (const g of GOLD.designs) {
  const i = g.inputs;
  const last = g.depths.length - 1;
  const gap = g.depths[last] - g.depths[last - 1];
  w(`golden stop reason, ${g.id} = ${g.stopReason}, last increment = ${f(gap, 9)} ft against a stated minSpacingFt of ${f(i.minSpacingFt, 1)} ft, `
    + `exempt = ${g.stopReason === 'targetDepth' && gap < i.minSpacingFt}`);
}
w(`derived minSpacing exemption, the published westTexasOil case lands its last mandrel `
  + `${f(designs.westTexasOil.depths[7] - designs.westTexasOil.depths[6], 9)} ft from its neighbour against a stated 250 ft minimum, `
  + `and no warning is raised, because the stop reason is targetDepth and that branch returns before the minSpacing test`);
w(`derived minSpacing exemption, the published deepHighPressure case DOES stop on minSpacing, at ${designs.deepHighPressure.depths.length} valves, `
  + `its deepest mandrel at ${f(designs.deepHighPressure.depths[6], 9)} ft and so still `
  + `${f(designs.deepHighPressure.inputs.maxDepthFt - designs.deepHighPressure.depths[6], 9)} ft short of its floor of ${f(designs.deepHighPressure.inputs.maxDepthFt, 1)} ft. `
  + `The next valve the recursion wanted would have sat inside the 300 ft minimum, so the string stopped and the minSpacing warning WAS raised. `
  + `That is the branch westTexasOil never reaches, and the two can be shown side by side`);
w('# DERIVED: driving westTexasOil into each of the other stop reasons, one input at a time.');
{
  const i = designs.westTexasOil.inputs;
  for (const mv of [3, 5, 7, 8, 12]) {
    const r = D.designGasLift(adapt({ ...i, maxValves: mv }));
    w(`derived stop reason sweep, westTexasOil with maxValves ${mv}: ${r.depths.length} valves, stop reason ${r.stopReason}, `
      + `deepest ${f(r.depths[r.depths.length - 1], 9)} ft, warnings ${r.warnings.map((x) => x.code).join(', ') || 'none'}`);
  }
  for (const ms of [100, 250, 400, 600, 900, 1400]) {
    const r = D.designGasLift(adapt({ ...i, minSpacingFt: ms }));
    w(`derived stop reason sweep, westTexasOil with minSpacingFt ${f(ms, 1)} ft: ${r.depths.length} valves, stop reason ${r.stopReason}, `
      + `deepest ${f(r.depths[r.depths.length - 1], 9)} ft, warnings ${r.warnings.map((x) => x.code).join(', ') || 'none'}`);
  }
  for (const dec of [60, 90, 130, 200]) {
    const r = D.designGasLift(adapt({ ...i, dpPerValvePsi: dec }));
    w(`derived stop reason sweep, westTexasOil with ${f(dec, 1)} psi per valve: ${r.depths.length} valves, stop reason ${r.stopReason}, `
      + `deepest ${f(r.depths[r.depths.length - 1], 9)} ft, warnings ${r.warnings.map((x) => x.code).join(', ') || 'none'}`);
  }
  const small = D.designGasLift(adapt({ ...i, ports: [0.125], orificeIdIn: 0.125, qgiTargetMscfd: 900 }));
  w(`derived stop reason sweep, westTexasOil with only a 0.125 in port in the catalog against a 900 Mscf/d target: `
    + `warnings ${small.warnings.map((x) => x.code).join(', ') || 'none'}`);
  small.warnings.filter((x) => x.code === 'portTooSmall').slice(0, 3).forEach((x) => w(`derived stop reason sweep, portTooSmall message: ${x.message}`));
}
w('');

// ============================================================ SECTION 19
w('# SECTION 19: WHAT FLIPS THE MULTIPOINTING VERDICT');
w('# DERIVED sweeps on the PUBLISHED midDecrementKnifeEdge case. Expert m02 and m05');
w('# own this. That case is spaced on 26.75 psi per valve, a decrement in the middle of');
w('# the usual 20 to 50 psi band, and its stage 5 verdict on valve 4 hangs on a fraction');
w('# of a psi. The engine surface margin and the oracle valve-depth margin are two');
w('# different numbers for the same knife edge, and BOTH are small, which is the point.');
w('#');
w('# THE MECHANISM, STATED OUTRIGHT, because it is more teachable than "hangs on a');
w('# fraction of a psi" and the file only ever implied it. Across all six charged');
w('# valves of this case the open flag IS the test of the casing DROP since a valve');
w('# own opening stage against that valve SPREAD. Valve 4 opens with a spread of');
w('# 32.272254090 psi against a drop of 32.122462454 psi, and the difference between');
w('# those two numbers, 0.149791635 psi, is the whole knife edge. Section 12 carries');
w('# the drop beside the spread on every valve, so the rule can be checked rather');
w('# than believed. A lesson writer worked it out from those rows and said so.');
w('#');
w('# AND A TRAP THAT FOLLOWS FROM IT. The SURFACE decrement is 26.75 psi per valve,');
w('# but the drop a valve actually feels AT DEPTH runs from 28.652797457 psi at valve');
w('# 1 to 33.355029522 psi at valve 6. Compare a spread against the decrement rather');
w('# than against the drop and you will pick the wrong valves.');
{
  const id = 'midDecrementKnifeEdge';
  const i = designs[id].inputs;
  const g = designs[id];
  const r = run[id];
  w(`golden knife edge, published stage 5 closing margin on valve 4 (oracle, at valve depth) = `
    + `${f(g.unloading[4].closingMargins.find((m) => m.valve === 4).marginPsi, 9)} psi`);
  w(`engine knife edge, published stage 5 surface margin on valve 4 (engine, at surface) = `
    + `${f(r.unloading[4].surfaceInjectionPsia - r.valves[3].closingSurfacePressurePsia, 9)} psi`);
  w(`derived knife edge, the whole system runs at ${f(i.pKickoffPsia, 1)} psia at surface and ${f(r.valves[3].pInjAtDepthPsia, 6)} psia at valve 4, `
    + `so that verdict is a fraction of a psi on a system of over a thousand psia`);
  w('# 19a. DECREMENT. Fine sweep across the flip.');
  for (const dec of [26.00, 26.25, 26.50, 26.60, 26.70, 26.74, 26.75, 26.76, 26.80, 26.85, 26.90, 27.00, 27.25, 27.50]) {
    const rr = D.designGasLift(adapt({ ...i, dpPerValvePsi: dec }));
    const m = rr.unloading[4].surfaceInjectionPsia - rr.valves[3].closingSurfacePressurePsia;
    w(`derived knife edge decrement, ${f(dec, 2)} psi per valve${dec === 26.75 ? ' (THE PUBLISHED VALUE)' : ''}: `
      + `stage 5 surface margin on valve 4 = ${f(m, 9)} psi, stage 5 multipointing = ${rr.unloading[4].multipointing}, `
      + `all multipointing stages = ${rr.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') || 'none'}`);
  }
  w('derived knife edge decrement, THE FLIP sits between 26.80 and 26.90 psi per valve,');
  w('derived knife edge decrement, so under a tenth of a psi per valve of decrement, on');
  w('derived knife edge decrement, a design nobody would look at twice, changes the most');
  w('derived knife edge decrement, consequential boolean this engine emits.');
  w('# 19b. PORT SIZE, which reaches the verdict through R = Ap / Ab and therefore');
  w('# through the dome charge and the closing pressure. Catalog reduced to a single');
  w('# port so every valve carries it.');
  for (const p of [0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625]) {
    const rr = D.designGasLift(adapt({ ...i, ports: [p], orificeIdIn: p, qgiTargetMscfd: 1 }));
    const m = rr.unloading[4].surfaceInjectionPsia - rr.valves[3].closingSurfacePressurePsia;
    w(`derived knife edge port, every valve on a ${p} in port: R = ${f(rr.valves[0].r, 9)}, `
      + `closing surface pressures = ${rr.valves.map((v) => v.closingSurfacePressurePsia == null ? 'orifice' : f(v.closingSurfacePressurePsia, 6)).join(' ')}, `
      + `stage 5 surface margin on valve 4 = ${f(m, 9)} psi, multipointing stages = ${rr.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') || 'none'}`);
  }
  w('# 19c. BELLOWS AREA, the other half of R.');
  for (const ab of [0.29, 0.31, 0.50, 0.62, 0.77, 0.90, 0.99]) {
    const rr = D.designGasLift(adapt({ ...i, bellowsAreaIn2: ab }));
    const m = rr.unloading[4].surfaceInjectionPsia - rr.valves[3].closingSurfacePressurePsia;
    w(`derived knife edge bellows, bellows ${ab} in2${ab === 0.77 ? ' (THE PUBLISHED VALUE)' : ''}: R = ${f(rr.valves[0].r, 9)}, `
      + `stage 5 surface margin on valve 4 = ${f(m, 9)} psi, multipointing stages = ${rr.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') || 'none'}`);
  }
  w('# 19d. DESIGN GAS RATE, which reaches the verdict only through port SELECTION, so');
  w('# it does nothing at all until the target crosses a catalog step and then it moves');
  w('# the verdict in one jump. This is a different SHAPE of sensitivity from the');
  w('# decrement, and a lesson should say so.');
  for (const q of [400, 600, 800, 1000, 1200, 1400, 1600, 2000, 2200, 2400, 3000, 3500]) {
    const rr = D.designGasLift(adapt({ ...i, qgiTargetMscfd: q }));
    const m = rr.unloading[4].surfaceInjectionPsia - rr.valves[3].closingSurfacePressurePsia;
    w(`derived knife edge gas rate, target ${f(q, 0)} Mscf/d${q === 600 ? ' (THE PUBLISHED VALUE)' : ''}: `
      + `ports chosen = ${rr.valves.map((v) => v.portIdIn).join(', ')}, stage 5 surface margin on valve 4 = ${f(m, 9)} psi, `
      + `multipointing stages = ${rr.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') || 'none'}`);
  }
  w('# 19e. THE TRANSFER DIFFERENTIAL and the UNLOADING GRADIENT, for completeness.');
  for (const dt of [40, 50, 60, 70, 80, 100]) {
    const rr = D.designGasLift(adapt({ ...i, dpTransferPsi: dt }));
    w(`derived knife edge transfer, dpTransferPsi ${f(dt, 1)} psi${dt === 60 ? ' (THE PUBLISHED VALUE)' : ''}: valve count ${rr.depths.length}, `
      + `deepest ${f(rr.depths[rr.depths.length - 1], 9)} ft, multipointing stages = ${rr.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') || 'none'}`);
  }
  for (const ug of [0.06, 0.09, 0.12, 0.15, 0.20]) {
    const rr = D.designGasLift(adapt({ ...i, unloadGradPsiPerFt: ug }));
    w(`derived knife edge unloading gradient, ${ug} psi/ft${ug === 0.09 ? ' (THE PUBLISHED VALUE)' : ''}: valve count ${rr.depths.length}, `
      + `deepest ${f(rr.depths[rr.depths.length - 1], 9)} ft, multipointing stages = ${rr.unloading.filter((s) => s.multipointing).map((s) => s.stage).join(', ') || 'none'}`);
  }
  w('# 19f. THE VALIDATION GAP, stated. Defect (a), now closed.');
  w('derived validation gap, the oracle unloading() was a STUB: it walked the valves and');
  w('derived validation gap, appended an empty open-valve list for every stage without');
  w('derived validation gap, ever evaluating the condition, and no unloading key was');
  w('derived validation gap, written into the goldens at all. The multipointing verdict');
  w('derived validation gap, was therefore UNGATED while looking gated, which is worse');
  w('derived validation gap, than an ungated function, because the extraction gate whole');
  w('derived validation gap, premise is that an independent oracle checked the engine.');
  w('derived validation gap, Closed by engines PR #110, which derives the verdict from the');
  w('derived validation gap, published closing rule at valve depth off a forward RK4');
  w('derived validation gap, column, where the engine evaluates it at surface by inverting');
  w('derived validation gap, a coarser column. The goldens gained an unloading key on');
  const nStage = GOLD.designs.reduce((a, x) => a + x.unloading.length, 0);
  const nMarg = GOLD.designs.reduce((a, x) => a + x.unloading.reduce((b, s) => b + s.closingMargins.length, 0), 0);
  const ipoStages = GOLD.designs.filter((x) => x.inputs.valveType === 'IPO').reduce((a, x) => a + x.unloading.length, 0);
  w(`derived validation gap, every design, ${nStage} stage rows and ${nMarg} closing-margin`);
  w('derived validation gap, rows, plus a fourth published case, midDecrementKnifeEdge.');
  w(`derived validation gap, Engine agreement is exact on all ${ipoStages} stages of the three`);
  w('derived validation gap, IPO designs. THE LESSON TO DRAW is about the shape of the');
  w('derived validation gap, failure: coverage that is not coverage. A boolean that');
  w('derived validation gap, consequential is not a detail of the output, it IS the output.');
  let worstMargin = 0;
  GOLD.designs.forEach((x) => {
    if (x.inputs.valveType !== 'IPO') return;
    const rr = run[x.id];
    x.unloading.forEach((s, k) => s.closingMargins.forEach((m) => {
      const eng = rr.unloading[k].surfaceInjectionPsia - rr.valves[m.valve - 1].closingSurfacePressurePsia;
      worstMargin = Math.max(worstMargin, Math.abs(Math.sign(eng) - Math.sign(m.marginPsi)));
    }));
  });
  w(`derived validation gap, sign agreement between the engine surface margin and the oracle valve-depth margin on every IPO closing-margin row = ${worstMargin === 0}`);
}
w('');

// ============================================================ SECTION 20
w('# SECTION 20: THE DEEPEST INJECTION POINT, AND THE CHORD THAT CANNOT SEE ITSELF');
w('# DEFECT (b). Expert m03 and m04 own this. deepestInjectionPoint locates the');
w('# crossing between two tabulated traverse points by straight line on the margin,');
w('# and it reads the injection pressure by straight line between two tabulated column');
w('# samples. BOTH SIDES of the residual therefore come off the same pair of chords,');
w('# so the residual it reports is a statement that the two chords agree with each');
w('# other and nothing more. Refine the tabulation and the answer moves while the');
w('# reported residual stays small.');
w('#');
w('# TWO RUNS LIVE IN THIS SECTION AND THEY ARE NOT THE SAME RUN. Read the labels.');
w('#');
w('#   THE ENGINE LINE, below, is the shipped answer as the shipped engine produces');
w('#   it: the published 1000 ft tabulation AND the injection curve at the sample');
w('#   count the engine defaults to. It reports -1.317711139 ft of depth error, a');
w('#   residual of 4.6770e-3 psi, a true residual of 1.58211e-1 psi, and a ratio of');
w('#   33.83. That is the number a user of the studio is actually handed.');
w('#');
w('#   THE REFINEMENT ROWS hold the injection column CONVERGED and vary only the');
w('#   tabulation spacing, so the chord error being measured is the traverse chord');
w('#   alone. At the same shipped 1000 ft spacing they report -1.318735072 ft,');
w('#   4.8890e-3 psi, 1.5833e-1 psi and a ratio of 32.386. That is the number that');
w('#   isolates the mechanism.');
w('#');
w('# Both are correct and they answer different questions. Quote either, never both');
w('# in one sentence, and say which one you are quoting. TWO lesson writers hit this');
w('# fork independently and both kept their lessons on one road, which is why it is');
w('# now labelled here rather than left for a third to find.');
{
  const ip = GOLD.injectionPoint;
  const T = D.linearTemperature({ whtF: ip.whtF, bhtF: ip.bhtF, refDepthFt: ip.refDepthFt });
  w(`golden injectionPoint, inputs: surface ${f(ip.pSurfPsia, 1)} psia, sg ${ip.gasSg}, transfer differential ${f(ip.dpTransferPsi, 1)} psi, `
    + `maximum depth ${f(ip.maxDepthFt, 1)} ft, wellhead ${f(ip.whtF, 1)} degF, bottom ${f(ip.bhtF, 1)} degF at ${f(ip.refDepthFt, 1)} ft`);
  ip.traverse.forEach((row) => w(`golden injectionPoint, published flowing traverse row: ${f(row.tvdFt, 1)} ft, ${f(row.pPsia, 4)} psia`));
  w(`derived injectionPoint, the published tabulation is ${ip.traverse.length} rows at ${f(ip.traverse[1].tvdFt - ip.traverse[0].tvdFt, 1)} ft spacing`);
  w(`golden injectionPoint, expected depth = ${f(ip.expected.depthFt, 9)} ft`);
  w(`golden injectionPoint, expected injection pressure at that depth = ${f(ip.expected.pInjPsia, 9)} psia`);
  w(`golden injectionPoint, expected production pressure at that depth = ${f(ip.expected.pProdPsia, 9)} psia`);
  w(`golden injectionPoint, expected limitedBy = ${ip.expected.limitedBy}`);
  const shipped = D.deepestInjectionPoint({
    prodTraverse: ip.traverse, pSurfPsia: ip.pSurfPsia, gasSg: ip.gasSg, tempAtDepthF: T,
    dpTransferPsi: ip.dpTransferPsi, maxDepthFt: ip.maxDepthFt,
  });
  const residShipped = shipped.pInjPsia - ip.dpTransferPsi - shipped.pProdPsia;
  w(`engine injectionPoint, depth = ${f(shipped.depthFt, 9)} ft, injection = ${f(shipped.pInjPsia, 9)} psia, production = ${f(shipped.pProdPsia, 9)} psia, limitedBy = ${shipped.limitedBy}`);
  w(`engine injectionPoint, REPORTED residual at the crossing = ${e(residShipped, 5)} psi, against the 0.5 psi its own gate allows`);
  // continuous stand-in for the traverse
  const xs = ip.traverse.map((r) => r.tvdFt); const ys = ip.traverse.map((r) => r.pPsia);
  const pchip = (X, Y) => {
    const n = X.length; const h = []; const dd = [];
    for (let k = 0; k < n - 1; k += 1) { h.push(X[k + 1] - X[k]); dd.push((Y[k + 1] - Y[k]) / h[k]); }
    const m = new Array(n);
    m[0] = dd[0]; m[n - 1] = dd[n - 2];
    for (let k = 1; k < n - 1; k += 1) {
      if (dd[k - 1] * dd[k] <= 0) m[k] = 0;
      else { const w1 = 2 * h[k] + h[k - 1]; const w2 = h[k] + 2 * h[k - 1]; m[k] = (w1 + w2) / (w1 / dd[k - 1] + w2 / dd[k]); }
    }
    return (x) => {
      let k = 0; while (k < n - 2 && x > X[k + 1]) k += 1;
      const t = (x - X[k]) / h[k]; const t2 = t * t; const t3 = t2 * t;
      return Y[k] * (2 * t3 - 3 * t2 + 1) + h[k] * m[k] * (t3 - 2 * t2 + t) + Y[k + 1] * (-2 * t3 + 3 * t2) + h[k] * m[k + 1] * (t3 - t2);
    };
  };
  const P = pchip(xs, ys);
  const trueInj = refColumn(ip.pSurfPsia, ip.maxDepthFt, ip.gasSg, T, 'golden injectionPoint');
  const resid = (d) => trueInj(d) - ip.dpTransferPsi - P(d);
  let a = 0; let b = ip.maxDepthFt;
  for (let k = 0; k < 200; k += 1) { const m = (a + b) / 2; if (resid(a) * resid(m) <= 0) b = m; else a = m; }
  const conv = (a + b) / 2;
  w('derived injectionPoint, TO REFINE A TABULATION YOU NEED SOMETHING TO REFINE IT');
  w('derived injectionPoint, TOWARD. This digest builds a monotone cubic through the');
  w('derived injectionPoint, published traverse rows and treats it as the continuous');
  w('derived injectionPoint, flowing traverse the tabulation samples. It reproduces every');
  w('derived injectionPoint, published row exactly and it is a TEACHING CONSTRUCT, not a');
  w('derived injectionPoint, published curve, so a lesson may quote its numbers only as');
  w('derived injectionPoint, a refinement study and never as the golden answer.');
  w(`derived injectionPoint, converged crossing against that continuous traverse and a converged column = ${f(conv, 9)} ft`);
  w(`derived injectionPoint, converged injection pressure = ${f(trueInj(conv), 9)} psia, converged production pressure = ${f(P(conv), 9)} psia, converged residual = ${e(resid(conv), 3)} psi`);
  w(`derived injectionPoint, the SHIPPED tabulation answer sits ${f(shipped.depthFt - conv, 9)} ft and ${f(shipped.pInjPsia - trueInj(conv), 9)} psi from the converged answer`);
  w(`derived injectionPoint, and the TRUE residual at the shipped answer is ${e(resid(shipped.depthFt), 5)} psi, `
    + `which is ${f(Math.abs(resid(shipped.depthFt) / residShipped), 2)} times the residual the function reported`);
  w('# 20a. TABULATION REFINEMENT: the traverse resampled from that continuous curve at');
  w('# rising row counts, with the column held converged. Watch the depth march and the');
  w('# reported residual fail to track it.');
  for (const nseg of [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]) {
    const rows = [];
    for (let k = 0; k <= nseg; k += 1) { const x = (ip.maxDepthFt * k) / nseg; rows.push({ tvdFt: x, pPsia: P(x) }); }
    const rr = D.deepestInjectionPoint({
      prodTraverse: rows, pSurfPsia: ip.pSurfPsia, gasSg: ip.gasSg, tempAtDepthF: T,
      dpTransferPsi: ip.dpTransferPsi, maxDepthFt: ip.maxDepthFt, steps: 2048,
    });
    const rep = rr.pInjPsia - ip.dpTransferPsi - rr.pProdPsia;
    w(`derived injectionPoint refinement, tabulation spacing ${f(ip.maxDepthFt / nseg, 4)} ft (${nseg + 1} rows)`
      + `${nseg === 8 ? ' (THE SPACING THE PUBLISHED CASE SHIPS)' : ''}: `
      + `depth = ${f(rr.depthFt, 9)} ft, depth error = ${f(rr.depthFt - conv, 9)} ft, injection = ${f(rr.pInjPsia, 9)} psia, `
      + `REPORTED residual = ${e(rep, 4)} psi, TRUE residual at that depth = ${e(resid(rr.depthFt), 4)} psi, `
      + `true over reported = ${f(Math.abs(resid(rr.depthFt) / rep), 3)}`);
  }
  w('# 20b. COLUMN REFINEMENT with the published 9 row tabulation held fixed. This is');
  w('# the other chord, and it barely moves the answer, which is exactly why the defect');
  w('# is hard to see: refining the thing that is easy to refine changes nothing.');
  for (const s of [8, 16, 20, 40, 80, 160, 320, 640, 1280, 2560]) {
    const rr = D.deepestInjectionPoint({
      prodTraverse: ip.traverse, pSurfPsia: ip.pSurfPsia, gasSg: ip.gasSg, tempAtDepthF: T,
      dpTransferPsi: ip.dpTransferPsi, maxDepthFt: ip.maxDepthFt, steps: s,
    });
    w(`derived injectionPoint column refinement, injection curve at ${String(s).padStart(4)} samples: depth = ${f(rr.depthFt, 9)} ft, `
      + `injection = ${f(rr.pInjPsia, 9)} psia, reported residual = ${e(rr.pInjPsia - ip.dpTransferPsi - rr.pProdPsia, 4)} psi`);
  }
  w('derived injectionPoint, THE LESSON: a small residual proves the two chords agree');
  w('derived injectionPoint, with each other. It says nothing whatever about whether');
  w('derived injectionPoint, either chord is near the curve. The residual does NOT fall');
  w('derived injectionPoint, as the error falls, and on the coarsest rows it is the');
  w('derived injectionPoint, SMALLEST reported residual that carries the LARGEST error.');
  w('# 20c. THE OTHER STOP: limitedBy. When gas still wins at the deepest tabulated row');
  w('# the function returns that row and says depth, not pressure, and a lesson must not');
  w('# read that as a crossing.');
  {
    for (const ps of [1014.7, 1214.7, 1414.7, 1614.7]) {
      const rr = D.deepestInjectionPoint({
        prodTraverse: ip.traverse, pSurfPsia: ps, gasSg: ip.gasSg, tempAtDepthF: T,
        dpTransferPsi: ip.dpTransferPsi, maxDepthFt: ip.maxDepthFt,
      });
      w(`derived injectionPoint limitedBy, surface ${f(ps, 1)} psia: depth = ${f(rr.depthFt, 9)} ft, injection = ${f(rr.pInjPsia, 9)} psia, `
        + `production = ${f(rr.pProdPsia, 9)} psia, limitedBy = ${rr.limitedBy}`);
    }
    for (const ps of [714.7, 614.7, 514.7, 414.7, 314.7]) {
      const rr = D.deepestInjectionPoint({
        prodTraverse: ip.traverse, pSurfPsia: ps, gasSg: ip.gasSg, tempAtDepthF: T,
        dpTransferPsi: ip.dpTransferPsi, maxDepthFt: ip.maxDepthFt,
      });
      w(`derived injectionPoint limitedBy, surface ${f(ps, 1)} psia: depth = ${f(rr.depthFt, 9)} ft, injection = ${f(rr.pInjPsia, 9)} psia, `
        + `production = ${f(rr.pProdPsia, 9)} psia, limitedBy = ${rr.limitedBy}`);
    }
    w('derived injectionPoint limitedBy, THE THIRD RETURN: when the gas loses at the very');
    w('derived injectionPoint limitedBy, first tabulated row the function returns depth 0');
    w('derived injectionPoint limitedBy, and calls it limitedBy pressure, which is the');
    w('derived injectionPoint limitedBy, engine way of saying the well will not lift at all');
    w('derived injectionPoint limitedBy, on this injection pressure.');
  }
  w('# 20d. WHAT DEPTH BUYS. The crossing walked against the surface injection pressure');
  w('# and against the transfer differential, on the published traverse.');
  for (const ps of [814.7, 864.7, 914.7, 964.7, 1014.7, 1064.7, 1114.7, 1164.7]) {
    const rr = D.deepestInjectionPoint({
      prodTraverse: ip.traverse, pSurfPsia: ps, gasSg: ip.gasSg, tempAtDepthF: T,
      dpTransferPsi: ip.dpTransferPsi, maxDepthFt: ip.maxDepthFt,
    });
    w(`derived injectionPoint depth purchase, surface ${f(ps, 1)} psia buys ${f(rr.depthFt, 9)} ft of injection depth (limitedBy ${rr.limitedBy})`);
  }
  for (const dt of [0, 25, 50, 75, 100, 150, 200]) {
    const rr = D.deepestInjectionPoint({
      prodTraverse: ip.traverse, pSurfPsia: ip.pSurfPsia, gasSg: ip.gasSg, tempAtDepthF: T,
      dpTransferPsi: dt, maxDepthFt: ip.maxDepthFt,
    });
    w(`derived injectionPoint depth purchase, transfer differential ${f(dt, 1)} psi${dt === 100 ? ' (THE PUBLISHED VALUE)' : ''} gives ${f(rr.depthFt, 9)} ft (limitedBy ${rr.limitedBy})`);
  }
}
w('');

// ============================================================ SECTION 21
w('# SECTION 21: TEACHING WELL AKASO-3');
w('# A TEACHING WELL. It is not in the goldens, no oracle has ever checked it, and a');
w('# lesson must call it a teaching well every time it prints one of these numbers.');
w('# It exists so the SAME string can be shown three ways: on the surface-close');
w('# convention, on the constant-pressure convention, and as a PPO string, which no');
w('# single published case can do.');
const TW = {
  id: 'AKASO-3', wht: 98, bht: 178, refDepth: 7600, maxDepthFt: 7200,
  gasSg: 0.63, pKickoffPsia: 1064.7, pOperatingPsia: 964.7, pWhUnloadPsia: 144.7,
  killGradPsiPerFt: 0.44, unloadGradPsiPerFt: 0.10, dpTransferPsi: 55, dpPerValvePsi: 30,
  bellowsAreaIn2: 0.77, ports: [0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625, 0.75],
  orificeIdIn: 0.3125, qgiTargetMscfd: 700, minSpacingFt: 250, maxValves: 12,
  method: 'surfaceClose', valveType: 'IPO', bottomOrifice: true,
};
w(`teaching well AKASO-3, input pKickoffPsia = ${f(TW.pKickoffPsia, 1)} psia`);
w(`teaching well AKASO-3, input pOperatingPsia = ${f(TW.pOperatingPsia, 1)} psia`);
w(`teaching well AKASO-3, input pWhUnloadPsia = ${f(TW.pWhUnloadPsia, 1)} psia`);
w(`teaching well AKASO-3, input killGradPsiPerFt = ${TW.killGradPsiPerFt} psi/ft, unloadGradPsiPerFt = ${TW.unloadGradPsiPerFt} psi/ft`);
w(`teaching well AKASO-3, input dpTransferPsi = ${f(TW.dpTransferPsi, 1)} psi, dpPerValvePsi = ${f(TW.dpPerValvePsi, 1)} psi per valve`);
w(`teaching well AKASO-3, input gasSg = ${TW.gasSg}, maxDepthFt = ${f(TW.maxDepthFt, 1)} ft, minSpacingFt = ${f(TW.minSpacingFt, 1)} ft, maxValves = ${TW.maxValves}`);
w(`teaching well AKASO-3, input wellhead temperature = ${f(TW.wht, 1)} degF, bottom temperature = ${f(TW.bht, 1)} degF at reference depth ${f(TW.refDepth, 1)} ft`);
w(`teaching well AKASO-3, input bellowsAreaIn2 = ${TW.bellowsAreaIn2} in2, orificeIdIn = ${TW.orificeIdIn} in, qgiTargetMscfd = ${f(TW.qgiTargetMscfd, 1)} Mscf/d`);
w(`teaching well AKASO-3, input port catalog = ${TW.ports.join(', ')} in`);
const variants = [
  ['surfaceClose IPO', { ...TW }],
  ['constantPressure IPO', { ...TW, method: 'constantPressure' }],
  ['surfaceClose PPO', { ...TW, valveType: 'PPO', bottomOrifice: false }],
];
for (const [name, inp] of variants) {
  const r = D.designGasLift(adapt(inp));
  const TT = tempOf(inp);
  w(`teaching well AKASO-3 (${name}), stop reason = ${r.stopReason}, valve count = ${r.depths.length}, warnings = ${r.warnings.map((x) => x.code).join(', ') || 'none'}`);
  r.valves.forEach((v, k) => {
    w(`teaching well AKASO-3 (${name}), valve ${k + 1}: depth = ${f(v.depthFt, 9)} ft, surface injection pressure at its stage = ${f(v.pSurfOpenPsia ?? r.surfacePressures[k], 4)} psia, `
      + `temperature = ${f(v.tempF, 6)} degF, type = ${v.valveType}, port = ${v.portIdIn} in`);
    w(`teaching well AKASO-3 (${name}), valve ${k + 1}: injection at depth = ${f(v.pInjAtDepthPsia, 9)} psia, production at depth = ${f(v.pProdAtDepthPsia, 9)} psia, `
      + `throughput = ${f(v.throughputMscfd, 9)} Mscf/d, regime = ${v.throughputRegime}`);
    if (v.domeAtTempPsia != null) {
      w(`teaching well AKASO-3 (${name}), valve ${k + 1}: R = ${f(v.r, 9)}, dome at temperature = ${f(v.domeAtTempPsia, 9)} psia, `
        + `dome at 60 degF = ${f(v.dome60Psia, 9)} psia, test rack opening = ${f(v.testRackOpeningPsia, 9)} psia, `
        + `spread = ${f(v.spreadPsi, 9)} psi, closing surface pressure = ${f(v.closingSurfacePressurePsia, 9)} psia`);
    }
  });
  r.unloading.forEach((s, k) => {
    w(`teaching well AKASO-3 (${name}), stage ${s.stage}: casing ${f(s.surfaceInjectionPsia, 4)} psia, fluid level ${f(s.fluidLevelFt, 9)} ft, `
      + `gas rate ${f(s.gasRateMscfd, 9)} Mscf/d, upper valves open = ${s.upperValvesOpen.length ? s.upperValvesOpen.join(', ') : 'none'}, multipointing = ${s.multipointing}`);
    for (let j = 0; j < k; j += 1) {
      const cl = r.valves[j].closingSurfacePressurePsia;
      if (cl == null) continue;
      w(`teaching well AKASO-3 (${name}), stage ${s.stage}, surface test on valve ${j + 1}: casing ${f(s.surfaceInjectionPsia, 4)} psia against closing ${f(cl, 9)} psia, `
        + `margin = ${f(s.surfaceInjectionPsia - cl, 9)} psi`);
    }
  });
  const cur = r.injectionCurve;
  for (const d of [0, 900, 1800, 2700, 3600, 4500, 5400, 6300, 7200]) {
    w(`teaching well AKASO-3 (${name}), operating injection curve at ${f(d, 1)} ft = ${f(cur.at(d), 9)} psia`);
  }
  w(`teaching well AKASO-3 (${name}), unloading line, kill fluid from surface: pressure at ${f(TW.maxDepthFt, 0)} ft = ${f(TW.pWhUnloadPsia + TW.killGradPsiPerFt * TW.maxDepthFt, 9)} psia`);
  w(`teaching well AKASO-3 (${name}), transfer line, wellhead plus lifted gradient: pressure at ${f(TW.maxDepthFt, 0)} ft = ${f(TW.pWhUnloadPsia + TW.unloadGradPsiPerFt * TW.maxDepthFt, 9)} psia`);
  void TT;
}
w('');

// ============================================================ SECTION 22
w('# SECTION 22: TEACHING TRAVERSE ON AKASO-3, AND THE CHORD DEFECT AT FULL SIZE');
w('# A TEACHING CONSTRUCT. The published golden traverse is nearly straight, so its');
w('# chord error is small. Real flowing traverses curve, because holdup and friction');
w('# change with depth. This teaching traverse is an explicit smooth curve,');
w('#   p(D) = 144.7 + 0.11 D + 8e-6 D^2 psia, 0 to 7200 ft,');
w('# so its exact crossing against a converged gas column is known to machine');
w('# precision and the tabulation can be coarsened and refined at will. It is NOT a');
w('# published case and NOT a measured traverse. It is here so Expert m04 can show the');
w('# defect at a size a learner can see.');
{
  const T = tempOf(TW);
  const P = (d) => 144.7 + 0.11 * d + 8e-6 * d * d;
  const trueInj = refColumn(TW.pOperatingPsia, TW.maxDepthFt, TW.gasSg, T, 'teaching AKASO-3');
  const resid = (d) => trueInj(d) - TW.dpTransferPsi - P(d);
  for (const d of [0, 900, 1800, 2700, 3600, 4500, 5400, 6300, 7200]) {
    w(`teaching traverse AKASO-3, flowing production pressure at ${f(d, 1)} ft = ${f(P(d), 9)} psia`);
  }
  let a = 0; let b = TW.maxDepthFt;
  for (let k = 0; k < 200; k += 1) { const m = (a + b) / 2; if (resid(a) * resid(m) <= 0) b = m; else a = m; }
  const conv = (a + b) / 2;
  w(`teaching traverse AKASO-3, EXACT crossing against a converged column at ${f(TW.pOperatingPsia, 1)} psia surface with a ${f(TW.dpTransferPsi, 1)} psi transfer differential = ${f(conv, 9)} ft`);
  w(`teaching traverse AKASO-3, exact injection pressure at the crossing = ${f(trueInj(conv), 9)} psia`);
  w(`teaching traverse AKASO-3, exact production pressure at the crossing = ${f(P(conv), 9)} psia`);
  w(`teaching traverse AKASO-3, residual at the exact crossing = ${e(resid(conv), 3)} psi`);
  for (const nseg of [3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 128, 256, 512]) {
    const rows = [];
    for (let k = 0; k <= nseg; k += 1) { const x = (TW.maxDepthFt * k) / nseg; rows.push({ tvdFt: x, pPsia: P(x) }); }
    const rr = D.deepestInjectionPoint({
      prodTraverse: rows, pSurfPsia: TW.pOperatingPsia, gasSg: TW.gasSg, tempAtDepthF: T,
      dpTransferPsi: TW.dpTransferPsi, maxDepthFt: TW.maxDepthFt, steps: 2048,
    });
    const rep = rr.pInjPsia - TW.dpTransferPsi - rr.pProdPsia;
    w(`teaching traverse AKASO-3 refinement, tabulation spacing ${f(TW.maxDepthFt / nseg, 4)} ft (${nseg + 1} rows): `
      + `depth = ${f(rr.depthFt, 9)} ft, depth error = ${f(rr.depthFt - conv, 9)} ft, `
      + `injection = ${f(rr.pInjPsia, 9)} psia, pressure error = ${f(rr.pInjPsia - trueInj(conv), 9)} psi, `
      + `REPORTED residual = ${e(rep, 4)} psi, TRUE residual at that depth = ${e(resid(rr.depthFt), 4)} psi, `
      + `true over reported = ${f(Math.abs(resid(rr.depthFt) / rep), 2)}`);
  }
  w('teaching traverse AKASO-3 refinement, THE HEADLINE A LESSON CAN PRINT: on a 2400 ft');
  w('teaching traverse AKASO-3 refinement, tabulation the crossing lands tens of feet');
  w('teaching traverse AKASO-3 refinement, shallow of the truth while the function reports');
  w('teaching traverse AKASO-3 refinement, a residual of hundredths of a psi, comfortably');
  w('teaching traverse AKASO-3 refinement, inside the 0.5 psi its own gate allows, and the');
  w('teaching traverse AKASO-3 refinement, residual it cannot see is hundreds of times');
  w('teaching traverse AKASO-3 refinement, larger than the one it can. A self consistent');
  w('teaching traverse AKASO-3 refinement, wrong answer is the hardest kind to catch.');
}
w('');

// ============================================================ SECTION 23
w('# SECTION 23: WHAT THE ENGINE REFUSES TO DO');
w('# Every module that introduces a capability must state its limit. These are the');
w('# engine own refusals, taken from its headers and its code, and every tier needs');
w('# at least one of them.');
w('refusal, the module does not solve the well inflow. There is no IPR anywhere in it.');
w('refusal, the module does not solve multiphase outflow. The flowing production');
w('refusal, traverse used to locate the deepest injection point is PASSED IN as a');
w('refusal, depth-pressure table, so the caller can build it from a validated nodal');
w('refusal, model rather than this module inventing a gradient.');
w('refusal, the unloading and transfer lines are STRAIGHT LINES on constant gradients.');
w('refusal, a real unloading column is neither straight nor constant, and the engine');
w('refusal, does not pretend otherwise, it simply declares the gradient as an input.');
w('refusal, the column is STATIC. There is no friction, no velocity, no injection rate');
w('refusal, in the annulus at all, so the casing pressure it computes is the shut-in');
w('refusal, gas column and not a flowing one.');
w('refusal, intermittent lift is not modelled. Everything here is continuous lift.');
w('refusal, the dome charge z uses Dranchuk and Abou-Kassem with nitrogen criticals,');
w('refusal, which is an extrapolation off the natural gas basis DAK was fitted to. The');
w('refusal, header says so plainly and pins the window it is defensible in, Tpr 2.3 to');
w('refusal, 3.1 and Ppr 1 to 5, and it asserts no agreement with data this repo has not');
w('refusal, verified.');
w('refusal, the throughput is Thornhill and Craver, which is an ORIFICE equation. It');
w('refusal, does not know that a real gas lift valve throttles on its stem before it is');
w('refusal, fully open, so it is an upper bound on what a valve passes and not a');
w('refusal, prediction of it.');
w('refusal, the target depth mandrel is exempt from minSpacingFt. See section 18.');
w('refusal, for a PPO string the closing test is evaluated on the wrong fluid. See');
w('refusal, section 13. This is a PINNED KNOWN DIVERGENCE, not a thing to design on.');
w('refusal, deepestInjectionPoint reports a residual that cannot see its own error. See');
w('refusal, section 20. Treat the residual as a consistency check between two chords.');
w('');
w('END OF DIGEST');

process.stdout.write(out.join('\n') + '\n');
