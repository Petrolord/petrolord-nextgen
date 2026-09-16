// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES OF intervention_cases.json (plus
// sweeps around those published inputs, and TEACHING CASES this wave designed
// for itself). THE PD8 CAPSTONE RUNS DIFFERENT CONDITIONS ENTIRELY: nothing
// here imports, reads or reproduces pd8_fields.mjs, fields.json, or any
// capstone well name, history, sample count, time span, exponent, choke day,
// residual, radius, skin, water cut, gas-oil ratio or late fraction. The
// teaching digest and the capstone are two files with opposite audiences and
// they never share a number.
//
// Usage:  node /root/pd-wip-intervention/pd8_dump.mjs > /root/pd-wip-intervention/digest.txt
//
// Engines:  packages/engines/engines/production/interventionDiagnostics.js
// Goldens:  packages/engines/test-data/production/goldens/intervention_cases.json
// Oracle:   tools/validation/production/oracle_intervention.py

import fs from 'fs';

const ROOT = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const I = await import(`${ROOT}/engines/production/interventionDiagnostics.js`);
const GOLD = JSON.parse(fs.readFileSync(
  `${ROOT}/test-data/production/goldens/intervention_cases.json`, 'utf8'));

const out = [];
const w = (s) => out.push(s);
const f = (x, n = 6) => (x === null || x === undefined || Number.isNaN(x))
  ? 'n/a' : Number(x).toFixed(n);
const e = (x, n = 4) => (x === null || x === undefined || Number.isNaN(x))
  ? 'n/a' : Number(x).toExponential(n);
const yn = (b) => (b === true ? 'true' : b === false ? 'false' : 'n/a');

// ---------------------------------------------------------------- fixtures
//
// THE TEACHING WELL. ELELENWO-4 is a well this wave invented so that the
// Expert results have a case a lesson may quote. It is not a real well and it
// is not a published case. Its water-oil ratio is a displacement term that
// grows linearly plus a channel term that grows faster,
//     WOR(t) = c1 t + c2 t^p,   c2 = c1 tX^(1 - p)
// and after the well is beaned back on day tChoke the ratio relaxes towards a
// residual,
//     WOR(t) = wRes + (wBreak - wRes) (t / tBreak)^-k.
// Both derivatives d(WOR)/d(ln t) are written in closed form, the same
// discipline the oracle uses on its own four histories, so nothing in this
// file depends on a differencing scheme and two runs are byte identical.
const TW = {
  name: 'ELELENWO-4',
  n: 38,
  t0Days: 15,
  t1Days: 3600,
  c1PerDay: 0.0032,
  p: 1.9,
  crossoverDays: 1500,
  chokeDays: 2200,
  declineK: 0.85,
  residual: 1.3,
  // The geometry and the damage. Field units: radii in ft, skin dimensionless.
  reFt: 1180,
  rwFt: 0.354,
  skinBefore: 7.5,
  skinAfterAcid: -2.2,
  skinAfterOverreach: -6.8,
  skinAfterRefused: -7.6,
  claimedRatio: 8.5,
  // The well as screenTreatments reads it.
  wctPct: 74.5,
  gorScfStb: 2152,
  expectedGorScfStb: 950,
  flowing: true,
};

// The teaching gas-oil ratio history: GOR(t) = g0 + g1 t^q, scf/stb, with the
// derivative column exactly as a production database that never computed one
// exports it.
const TG = { n: 26, t0Days: 60, t1Days: 3600, g0ScfStb: 950, g1: 0.0431, q: 1.25 };

function teachingWater() {
  const c2 = TW.c1PerDay * Math.pow(TW.crossoverDays, 1 - TW.p);
  const series = [];
  let wBreak = null;
  let tBreak = null;
  for (let i = 0; i < TW.n; i += 1) {
    const t = TW.t0Days * Math.pow(TW.t1Days / TW.t0Days, i / (TW.n - 1));
    if (t <= TW.chokeDays) {
      const wor = TW.c1PerDay * t + c2 * Math.pow(t, TW.p);
      series.push({ t, ratio: wor, derivative: TW.c1PerDay * t + TW.p * c2 * Math.pow(t, TW.p) });
      wBreak = wor;
      tBreak = t;
    } else {
      const decay = Math.pow(t / tBreak, -TW.declineK);
      series.push({
        t,
        ratio: TW.residual + (wBreak - TW.residual) * decay,
        derivative: -TW.declineK * (wBreak - TW.residual) * decay,
      });
    }
  }
  return { series, tBreak, wBreak, c2 };
}

function teachingGas(derivativeValue) {
  const series = [];
  for (let i = 0; i < TG.n; i += 1) {
    const t = TG.t0Days * Math.pow(TG.t1Days / TG.t0Days, i / (TG.n - 1));
    const row = { t, ratio: TG.g0ScfStb + TG.g1 * Math.pow(t, TG.q) };
    if (derivativeValue !== 'omit') row.derivative = derivativeValue;
    series.push(row);
  }
  return series;
}

// A history whose derivative is EXACTLY CONSTANT. WOR(t) = A + B ln t has
// d(WOR)/d(ln t) = B at every sample, which is a real signature and not a
// pathology: it is a ratio rising exactly logarithmically.
function constantDerivative(A, B, t0, t1, n) {
  const series = [];
  for (let i = 0; i < n; i += 1) {
    const t = t0 * Math.pow(t1 / t0, i / (n - 1));
    series.push({ t, ratio: A + B * Math.log(t), derivative: B });
  }
  return series;
}

// A history that ends on one low sample. Everything before it is a climbing
// water-oil ratio; the last reading is a test taken after a shut-in.
function lowLastSample(n, t0, t1, a, m, lastRatio) {
  const series = [];
  for (let i = 0; i < n; i += 1) {
    const t = t0 * Math.pow(t1 / t0, i / (n - 1));
    series.push({ t, ratio: a * Math.pow(t, m), derivative: m * a * Math.pow(t, m) });
  }
  series[series.length - 1].ratio = lastRatio;
  return series;
}

const { series: TWATER, tBreak: TW_TBREAK, wBreak: TW_WBREAK, c2: TW_C2 } = teachingWater();
const TGAS_NULL = teachingGas(null);
const TGAS_UNDEF = teachingGas('omit');
const TGEO = { reFt: TW.reFt, rwFt: TW.rwFt };
const GGEO = { reFt: GOLD.minimumSkin.reFt, rwFt: GOLD.minimumSkin.rwFt };

const TWELL = {
  skin: TW.skinBefore, reFt: TW.reFt, rwFt: TW.rwFt, wctPct: TW.wctPct,
  gorScfStb: TW.gorScfStb, expectedGorScfStb: TW.expectedGorScfStb, flowing: TW.flowing,
};

// The window the ORACLE reads its own histories on: series[n/2:], which is
// exactly what chanDiagnosis does at its default lateFraction of 0.5.
const oracleWindowFrom = (series) => series[Math.floor(series.length * 0.5)].t;

const lateCounts = (series, fromT) => {
  const late = series.filter((p) => p.t >= fromT);
  return {
    n: late.length,
    pos: late.filter((p) => Number.isFinite(p.derivative) && p.derivative > 0).length,
    neg: late.filter((p) => Number.isFinite(p.derivative) && p.derivative < 0).length,
    zero: late.filter((p) => Number.isFinite(p.derivative) && Math.abs(p.derivative) < 1e-12).length,
    spanTrue: Math.log10(late[late.length - 1].t / late[0].t),
  };
};

const dxLine = (label, d) => {
  w(`${label}: ok = ${yn(d.ok)}, mechanism = ${d.mechanism ? d.mechanism.id : 'n/a'}, `
    + `treatable = ${d.mechanism ? yn(d.mechanism.treatable) : 'n/a'}, confidence = ${d.confidence || 'n/a'}, `
    + `ambiguous = ${yn(d.ambiguous)}`);
  w(`${label}: worSlope = ${f(d.worSlope, 9)}, worR2 = ${f(d.worR2, 9)}, `
    + `derivativeSlope = ${f(d.derivativeSlope, 9)}, derivativeR2 = ${f(d.derivativeR2, 9)}, `
    + `spanDecades = ${f(d.spanDecades, 9)}, lateFromT = ${f(d.lateFromT, 6)} days`);
  (d.notes || []).forEach((nt, i) => w(`${label}: note ${i + 1}: ${nt}`));
  if (d.error) w(`${label}: error: ${d.error}`);
};

const screenLines = (label, rows) => {
  rows.forEach((r) => {
    w(`${label}, ${r.id}: verdict = ${r.verdict}, blocked = ${yn(r.blocked)}, reasons = ${r.reasons.length}`);
    r.reasons.forEach((rs, i) => w(`${label}, ${r.id}: reason ${i + 1}: ${rs}`));
    if (r.blockReason) w(`${label}, ${r.id}: blockReason: ${r.blockReason}`);
  });
};

// ---------------------------------------------------------------- header
w('PD8 Well Intervention: TEACHING DIGEST');
w('');
w('THE ONLY NUMBERS A LESSON MAY QUOTE. Every line names its source: a PUBLISHED');
w('value out of packages/engines/test-data/production/goldens/intervention_cases.json,');
w('a DERIVED re-run or sweep on published inputs, or a TEACHING case this wave');
w('designed for itself. NOTHING in this file comes from the graded capstone. The');
w('capstone conditions and its eighteen graded answers live in separate files that');
w('the generator of this digest never opens.');
w('');
w('A leak guard, pd8_leakcheck.mjs, reads the capstone graded field list and every');
w('number on every line of this file and rejects the digest if any number lands');
w('within TEN TIMES a graded field tolerance of that field value, in five unit');
w('shiftings: the three the wave standard requires (as printed, times 1000, times');
w('0.001) and two this domain needs (times 100 and times 0.01), because a fit');
w('quality quoted as a fraction and the same fit quality quoted as a percentage are');
w('the live confusion in a diagnostics digest. academy_submit_capstone grades with');
w('abs(got - expected) <= tol, so tol is ABSOLUTE in the field own units and is not');
w('a fraction of anything. The guard lives in its own file and the generator never');
w('imports the capstone.');
w('');
w('Generator: /root/pd-wip-intervention/pd8_dump.mjs');
w('Engines:   packages/engines/engines/production/interventionDiagnostics.js');
w('Goldens:   packages/engines/test-data/production/goldens/intervention_cases.json');
w('Oracle:    tools/validation/production/oracle_intervention.py');
w('Units: producing time in DAYS, radii in FT, water-oil ratio a bare stb/stb');
w('       RATIO, gas-oil ratio in scf/stb, water cut in PERCENT, skin and the');
w('       pseudo-steady-state group dimensionless, fit quality as a FRACTION,');
w('       log-log slopes per LOG CYCLE (they are d ln y / d ln x, so they carry no');
w('       unit at all), spans in LOG CYCLES. Nothing here is SI.');
w('');
w('WHAT PROVENANCE LABEL MEANS WHAT');
w('  golden ...    a value committed in intervention_cases.json by the independent');
w('                stdlib oracle. Two routes, both genuinely independent: the');
w('                log-log slope by THEIL-SEN, the median of every pairwise slope,');
w('                which shares no mean, no square and no covariance with the');
w('                engine ordinary least squares; and the skin uplift by a full');
w('                radial Darcy rate in SI, permeability in square metres and');
w('                pressures in pascals, divided as two real flow rates, against');
w('                the engine ratio of two dimensionless groups.');
w('  derived ...   the shipped engine re-run on PUBLISHED inputs, or a sweep this');
w('                generator ran around them. A sweep point is not a published');
w('                case. Say so if you print one.');
w('  teaching ...  the teaching well ELELENWO-4, the teaching gas history, the');
w('                three constructed demonstration series, and every sweep on');
w('                them. Invented by this wave to carry the Expert results. Not a');
w('                published case, not a real well, and never to be shown as');
w('                either.');
w('');
w('WHAT THE ORACLE NEVER CALLS, WHICH IS MOST OF THE MODULE');
w('  The golden publishes four labelled histories, a lateDerivativeSlope for each,');
w('  five skin pairs, one geometry floor and one power law. It publishes NO');
w('  expected mechanism, NO expected confidence, NO expected verdict, NO expected');
w('  refusal and NO expected block reason. chanDiagnosis, screenTreatments,');
w('  rankTreatments and skinFromPiRatio are not asserted against anything at all.');
w('  The only part of this module that returns a VERDICT is the part with no');
w('  golden. Section 2 runs the classifier over the four published histories and');
w('  prints the four assertions that were never written.');
w('');
w('THE PUBLISHED CASES AT A GLANCE');
w(`  power_law        ${GOLD.power_law.points.length} points on y = a x^m, slope ${GOLD.power_law.trueSlope} exactly`);
w(`  histories        four labelled series, ${GOLD.histories.channelling.series.length} samples each, `
  + `t from ${GOLD.histories.channelling.series[0].t} to ${GOLD.histories.channelling.series[GOLD.histories.channelling.series.length - 1].t} days`);
w(`  minimumSkin      one geometry, re ${GGEO.reFt} ft and rw ${GGEO.rwFt} ft`);
w(`  skin             ${GOLD.skin.length} before-and-after skin pairs on that same geometry`);
w('');
w('THE TEACHING CASES');
w(`  ${TW.name}    a water-oil ratio that climbs faster than proportionally for`);
w('               most of its life, then turns back down after the well is beaned');
w('               back, so ONE history argues both mechanisms at once. This wave');
w('               designed it so that the discarded evidence, the window sweep,');
w('               the two point counts and the skin guard all have a case a lesson');
w('               may quote.');
w('  teaching gas history   the same well gas-oil ratio, exported with the Bourdet');
w('               derivative column NOT COMPUTED, in both JavaScript spellings of');
w('               "no value".');
w('  constant-derivative demonstration   a ratio rising exactly logarithmically.');
w('  low-last-sample demonstration       a climbing ratio with one low final test.');
w('');

// ============================================================ SECTION 0
w('# SECTION 0: FIVE FUNCTIONS AND ONE IDEA');
w('# Associate m01. This module is five exported calculations and two lookups, and');
w('# every number in this digest belongs to exactly one of them. Naming which');
w('# function owns a number is most of what the Associate tier is for.');
w('#   logLogSlope        THE MEASUREMENT. Ordinary least squares of ln y against');
w('#                      ln x over a window. Exact on a power law. Returns a');
w('#                      slope, an intercept, an r-squared, a point count and a');
w('#                      span in log cycles. Knows nothing about wells.');
w('#   pssDenominator     THE GEOMETRY GROUP. ln(re/rw) - 3/4 + S, and nothing');
w('#                      else. Productivity is inversely proportional to it.');
w('#   minimumSkin        THE FLOOR. The skin at which that group reaches zero and');
w('#                      the productivity index goes infinite.');
w('#   skinPiMultiplier   WHAT REMOVING SKIN IS WORTH. A ratio of two of those');
w('#                      groups. Exactly 1 when the skin does not change.');
w('#   skinFromPiRatio    THE INVERSE. The skin implied by a measured uplift.');
w('#   chanDiagnosis      THE VERDICT. Reads a ratio history the way Chan reads');
w('#                      one and says which of four pictures it is closest to.');
w('#   screenTreatments   THE SPEND. Seven treatments, each gated by the verdict.');
w('# THE IDEA THE WHOLE MODULE TURNS ON: channelling is plumbing and can be sealed,');
w('# coning is not and cannot, and the two need OPPOSITE treatments. A planner who');
w('# recommends a squeeze without the diagnosis is wrong about half the time.');
w('#');
w('# THE THRESHOLDS. All named, all overridable, all round on purpose: they are');
w('# boundaries between pictures, not measurements.');
Object.entries(I.CHAN_DEFAULTS).forEach(([k, v]) => {
  w(`derived CHAN_DEFAULTS, ${k} = ${v}`);
});
w(`derived CHAN_DEFAULTS, the ambiguous band therefore runs from `
  + `${f(I.CHAN_DEFAULTS.channellingSlope - I.CHAN_DEFAULTS.ambiguousBand, 6)} to `
  + `${f(I.CHAN_DEFAULTS.channellingSlope + I.CHAN_DEFAULTS.ambiguousBand, 6)} on the derivative slope, `
  + `a width of ${f(2 * I.CHAN_DEFAULTS.ambiguousBand, 6)}`);
I.CHAN_MECHANISMS.forEach((m) => {
  w(`derived CHAN_MECHANISMS, ${m.id}: label ${m.label}, treatable = ${yn(m.treatable)}`);
  w(`derived CHAN_MECHANISMS, ${m.id}: note: ${m.note}`);
});
I.TREATMENTS.forEach((t) => {
  w(`derived TREATMENTS, ${t.id}: label ${t.label}, addressesSkin = ${yn(!!t.addressesSkin)}, `
    + `addressesWater = ${yn(!!t.addressesWater)}, addressesGas = ${yn(!!t.addressesGas)}, `
    + `addressesLift = ${yn(!!t.addressesLift)}`);
});
w(`derived VERDICT_ORDER = ${I.VERDICT_ORDER.join(', ')}`);
w('');

// ============================================================ SECTION 1
w('# SECTION 1: THE MEASUREMENT, AND THE ONE THING THE ORACLE DOES CHECK');
w('# Associate m02. PUBLISHED. The oracle commits eleven points on y = a x^m and');
w('# the Theil-Sen slope through them. Theil-Sen is the median of every pairwise');
w('# slope: no mean, no square, no covariance in common with least squares. On a');
w('# clean power law the two routes agree to machine precision, which is the gate,');
w('# and the engine reproduces the published slope and intercept exactly.');
w(`golden power_law, points = ${GOLD.power_law.points.length}, trueSlope = ${f(GOLD.power_law.trueSlope, 12)}, `
  + `trueIntercept = ${f(GOLD.power_law.trueIntercept, 12)}`);
w(`golden power_law, theilSen slope = ${f(GOLD.power_law.theilSen.slope, 12)}, `
  + `theilSen intercept = ${f(GOLD.power_law.theilSen.intercept, 12)}, n = ${GOLD.power_law.theilSen.n}`);
GOLD.power_law.points.forEach((p, i) => {
  w(`golden power_law point ${i + 1}: x = ${f(p.x, 6)}, y = ${f(p.y, 9)}, `
    + `ln x = ${f(Math.log(p.x), 9)}, ln y = ${f(Math.log(p.y), 9)}`);
});
const plFit = I.logLogSlope({ points: GOLD.power_law.points });
w(`derived power_law, engine slope = ${f(plFit.slope, 12)}, difference from the published Theil-Sen = ${e(plFit.slope - GOLD.power_law.theilSen.slope, 4)}`);
w(`derived power_law, engine intercept = ${f(plFit.intercept, 12)}, difference from published = ${e(plFit.intercept - GOLD.power_law.theilSen.intercept, 4)}`);
w(`derived power_law, engine r2 = ${f(plFit.r2, 12)}, shortfall from a perfect fit = ${e(1 - plFit.r2, 4)}`);
w(`derived power_law, engine n = ${plFit.n}, spanDecades = ${f(plFit.spanDecades, 9)}`);
w('# WHAT THE MEASUREMENT REFUSES, and the exact words it refuses with.');
const refuseTwo = I.logLogSlope({ points: [{ x: 1, y: 2 }, { x: 2, y: 4 }] });
w(`derived logLogSlope refusal, two points: ok = ${yn(refuseTwo.ok)}, n = ${refuseTwo.n}`);
w(`derived logLogSlope refusal, two points: error: ${refuseTwo.error}`);
const refuseNeg = I.logLogSlope({ points: [{ x: 1, y: 2 }, { x: 2, y: -4 }, { x: 3, y: 0 }, { x: 4, y: 8 }] });
w(`derived logLogSlope refusal, one negative and one zero y among four points: ok = ${yn(refuseNeg.ok)}, n = ${refuseNeg.n}`);
w(`derived logLogSlope refusal, one negative and one zero y among four points: error: ${refuseNeg.error}`);
const refuseSameX = I.logLogSlope({ points: [{ x: 5, y: 2 }, { x: 5, y: 4 }, { x: 5, y: 8 }] });
w(`derived logLogSlope refusal, every point at the same time: ok = ${yn(refuseSameX.ok)}`);
w(`derived logLogSlope refusal, every point at the same time: error: ${refuseSameX.error}`);
w('# THE FILTER IS THE POINT. logLogSlope drops every point whose y is not strictly');
w('# positive and then fits what is left, WITHOUT SAYING SO. The n it returns is the');
w('# count after the drop. Section 9 is what that costs.');
const dropDemo = I.logLogSlope({
  points: [{ x: 10, y: 1 }, { x: 20, y: 2 }, { x: 40, y: 4 }, { x: 80, y: 8 },
    { x: 160, y: -1 }, { x: 320, y: -2 }],
});
w(`derived logLogSlope drop, six points handed in of which two are negative: ok = ${yn(dropDemo.ok)}, `
  + `n returned = ${dropDemo.n}, slope = ${f(dropDemo.slope, 9)}, r2 = ${f(dropDemo.r2, 9)}, `
  + `spanDecades = ${f(dropDemo.spanDecades, 9)}`);
w(`derived logLogSlope drop, the span the six points actually cover = `
  + `${f(Math.log10(320 / 10), 9)} log cycles, so the fit reports `
  + `${f(Math.log10(320 / 10) - dropDemo.spanDecades, 9)} of a log cycle less than it was handed`);
w('');

// ============================================================ SECTION 2
w('# SECTION 2: THE FOUR PUBLISHED HISTORIES, AND THE FOUR ASSERTIONS NOBODY WROTE');
w('# Associate m03 and Professional m01. PUBLISHED shapes, DERIVED verdicts. The');
w('# golden publishes each history and its lateDerivativeSlope and stops there. It');
w('# names no mechanism, no confidence and no verdict, so the lines below are what');
w('# the classifier says when nothing is checking it. Read them as the four');
w('# assertions the oracle could have written and did not.');
for (const key of ['channelling', 'coning', 'displacement', 'flat']) {
  const h = GOLD.histories[key];
  const s = h.series;
  const from = oracleWindowFrom(s);
  w(`golden histories.${key}: form ${h.meta.form}, n = ${s.length}, t from ${f(s[0].t, 6)} to ${f(s[s.length - 1].t, 6)} days, `
    + `span = ${f(Math.log10(s[s.length - 1].t / s[0].t), 9)} log cycles`);
  Object.entries(h.meta).forEach(([k, v]) => {
    if (k !== 'form') w(`golden histories.${key}: meta ${k} = ${typeof v === 'number' ? f(v, 9) : v}`);
  });
  w(`golden histories.${key}: published lateDerivativeSlope = ${h.lateDerivativeSlope === null ? 'null' : f(h.lateDerivativeSlope, 12)}`);
  w(`golden histories.${key}: first sample ratio = ${f(s[0].ratio, 9)}, derivative = ${f(s[0].derivative, 9)}`);
  w(`golden histories.${key}: last sample ratio = ${f(s[s.length - 1].ratio, 9)}, derivative = ${f(s[s.length - 1].derivative, 9)}`);
  w(`derived histories.${key}: the oracle late window is series[${Math.floor(s.length * 0.5)}:], which starts at t = ${f(from, 6)} days, `
    + `and it is exactly what chanDiagnosis reads at its default lateFraction of 0.5`);
  const lc = lateCounts(s, from);
  w(`derived histories.${key}: late samples = ${lc.n}, of which positive derivative = ${lc.pos}, `
    + `negative = ${lc.neg}, exactly zero = ${lc.zero}`);
  const dfit = I.logLogSlope({ points: s.filter((p) => p.derivative > 0), xKey: 't', yKey: 'derivative', fromX: from });
  w(`derived histories.${key}: engine derivative fit over that window: ok = ${yn(dfit.ok)}, `
    + `slope = ${f(dfit.slope, 12)}, r2 = ${f(dfit.r2, 12)}, n = ${dfit.n}, spanDecades = ${f(dfit.spanDecades, 9)}`);
  if (h.lateDerivativeSlope !== null && dfit.ok) {
    w(`derived histories.${key}: engine least squares against the published Theil-Sen: difference = `
      + `${e(dfit.slope - h.lateDerivativeSlope, 6)}, relative = ${e((dfit.slope - h.lateDerivativeSlope) / h.lateDerivativeSlope, 6)}`);
  }
  const d = I.chanDiagnosis({ series: s });
  dxLine(`derived histories.${key}, chanDiagnosis at the default window`, d);
  w('');
}
w('# THE TWO THAT DESERVE A SECOND LOOK.');
w('# The coning history is the one place the two routes visibly separate: the engine');
w('# least squares and the published Theil-Sen disagree in the second decimal, on');
w('# data with no noise in it at all, because the shape is not a power law and the');
w('# two estimators weight a curved log-log trend differently. Both are right about');
w('# their own question. Neither is a measurement of a slope that exists.');
w('# The displacement history returns displacement with HIGH confidence and');
w('# ambiguous FALSE, on a slope of exactly one, which the oracle own docstring');
w('# calls the case that genuinely needs the plot and a person.');
w('');

// ============================================================ SECTION 3
w('# SECTION 3: THE PSEUDO-STEADY-STATE GROUP');
w('# Associate m04. PUBLISHED geometry. Everything about what a stimulation is worth');
w('# comes out of one group, ln(re/rw) - 3/4 + S, because the productivity index is');
w('# inversely proportional to it. The 3/4 is the pseudo-steady-state constant for a');
w('# circular drainage area; it is not a fudge and it is not adjustable.');
w(`golden minimumSkin, geometry: re = ${f(GGEO.reFt, 6)} ft, rw = ${f(GGEO.rwFt, 6)} ft`);
w(`golden minimumSkin, published value = ${f(GOLD.minimumSkin.value, 12)}`);
w(`derived minimumSkin, engine value = ${f(I.minimumSkin(GGEO), 12)}, difference from published = ${e(I.minimumSkin(GGEO) - GOLD.minimumSkin.value, 4)}`);
w(`derived minimumSkin, re over rw = ${f(GGEO.reFt / GGEO.rwFt, 9)}, ln of that = ${f(Math.log(GGEO.reFt / GGEO.rwFt), 12)}, `
  + `less 3/4 = ${f(Math.log(GGEO.reFt / GGEO.rwFt) - 0.75, 12)}`);
w('# HOW LITTLE THE RADII MATTER, and how much the skin does. A drainage radius is');
w('# a guess and a logarithm forgives a guess; a skin is a measurement and the group');
w('# adds it undivided. DERIVED sweep on the published wellbore radius.');
for (const re of [500, 1000, 1500, 2000, 3000, 5000, 10000]) {
  w(`derived geometry sweep, re = ${f(re, 0)} ft at the published rw of ${GGEO.rwFt} ft: `
    + `ln(re/rw) = ${f(Math.log(re / GGEO.rwFt), 9)}, denominator at zero skin = ${f(I.pssDenominator({ reFt: re, rwFt: GGEO.rwFt, skin: 0 }), 9)}, `
    + `minimumSkin = ${f(I.minimumSkin({ reFt: re, rwFt: GGEO.rwFt }), 9)}`);
}
w(`derived geometry sweep, a TWENTYFOLD change in drainage radius, from 500 to 10000 ft, moves the `
  + `zero-skin denominator by ${f(I.pssDenominator({ reFt: 10000, rwFt: GGEO.rwFt, skin: 0 }) - I.pssDenominator({ reFt: 500, rwFt: GGEO.rwFt, skin: 0 }), 9)}, `
  + `which one unit of skin more than covers`);
w('# THE DENOMINATOR AGAINST SKIN, on the published geometry. DERIVED sweep.');
for (const sk of [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 4, 6, 8, 12, 20]) {
  const den = I.pssDenominator({ ...GGEO, skin: sk });
  w(`derived denominator sweep, skin = ${f(sk, 1)}: denominator = ${f(den, 9)}, `
    + `flow efficiency against an undamaged well = ${f(I.pssDenominator({ ...GGEO, skin: 0 }) / den, 9)}`);
}
w('# WHAT pssDenominator AND minimumSkin REFUSE. Both return a BARE NaN, which is a');
w('# different failure contract from the one skinPiMultiplier uses, and Section 13');
w('# is what that costs.');
w(`derived pssDenominator refusal, rw larger than re: value = ${f(I.pssDenominator({ reFt: 0.35, rwFt: 2000, skin: 0 }), 6)}, `
  + `Number.isFinite = ${yn(Number.isFinite(I.pssDenominator({ reFt: 0.35, rwFt: 2000, skin: 0 })))}`);
w(`derived minimumSkin refusal, rw larger than re: value = ${f(I.minimumSkin({ reFt: 0.35, rwFt: 2000 }), 6)}, `
  + `Number.isFinite = ${yn(Number.isFinite(I.minimumSkin({ reFt: 0.35, rwFt: 2000 })))}`);
w(`derived pssDenominator refusal, a wellbore radius of zero: value = ${f(I.pssDenominator({ reFt: 2000, rwFt: 0, skin: 0 }), 6)}, `
  + `Number.isFinite = ${yn(Number.isFinite(I.pssDenominator({ reFt: 2000, rwFt: 0, skin: 0 })))}`);
w('');

// ============================================================ SECTION 4
w('# SECTION 4: WHAT REMOVING SKIN IS WORTH, ON THE FIVE PUBLISHED PAIRS');
w('# Associate m05 and Professional m03. PUBLISHED. The oracle builds a full radial');
w('# Darcy rate in SI, permeability in square metres and pressures in pascals, and');
w('# divides two real flow rates. The engine divides two dimensionless groups. They');
w('# agree because they are the same physics, and that agreement is the second of');
w('# the oracle two checks.');
GOLD.skin.forEach((c, i) => {
  const r = I.skinPiMultiplier(c);
  w(`golden skin case ${i + 1}: re = ${f(c.reFt, 3)} ft, rw = ${f(c.rwFt, 3)} ft, skin ${f(c.skinBefore, 3)} to ${f(c.skinAfter, 3)}, `
    + `published multiplier = ${f(c.multiplier, 12)}`);
  w(`derived skin case ${i + 1}: engine multiplier = ${f(r.multiplier, 12)}, difference from published = ${e(r.multiplier - c.multiplier, 4)}`);
  w(`derived skin case ${i + 1}: denominator before = ${f(r.before, 9)}, after = ${f(r.after, 9)}, `
    + `flowEfficiencyBefore = ${f(r.flowEfficiencyBefore, 9)}, flowEfficiencyAfter = ${f(r.flowEfficiencyAfter, 9)}, `
    + `minimumSkin returned inside the result = ${f(r.minimumSkin, 9)}`);
});
w('# THE FIRST GATE ON IT: the multiplier is EXACTLY 1 when the skin does not');
w('# change, to the last bit, because it is one number divided by itself.');
const unity = I.skinPiMultiplier({ ...GGEO, skinBefore: 0, skinAfter: 0 });
w(`derived skin identity, skin 0 to 0 on the published geometry: multiplier = ${f(unity.multiplier, 15)}, `
  + `departure from one = ${e(unity.multiplier - 1, 4)}`);
w('# WHY A STIMULATION IS WORTH SO LITTLE ON AN UNDAMAGED WELL. DERIVED sweep on');
w('# the published geometry: the same one unit of skin removed, from different');
w('# starting points. Removing a unit from a heavily damaged well is worth several');
w('# times what removing a unit from a clean one is worth.');
for (const s0 of [20, 12, 8, 5, 3, 2, 1]) {
  const r = I.skinPiMultiplier({ ...GGEO, skinBefore: s0, skinAfter: s0 - 1 });
  w(`derived one unit of skin, ${f(s0, 1)} down to ${f(s0 - 1, 1)}: multiplier = ${f(r.multiplier, 9)}, `
    + `uplift = ${f((r.multiplier - 1) * 100, 6)} percent`);
}
w('');

// ============================================================ SECTION 5
w('# SECTION 5: THE INVERSE, AND WHAT IT DOES NOT CHECK');
w('# Professional m03 and Expert m05. skinFromPiRatio is the natural way to audit a');
w('# claimed uplift: a vendor says the well makes N times what it made, and this is');
w('# the skin that claim implies. DERIVED on the published geometry.');
for (const ratio of [1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12]) {
  const sk = I.skinFromPiRatio({ ...GGEO, ratio });
  w(`derived implied skin, a claimed uplift of ${f(ratio, 3)} times on the published geometry implies a post-job skin of `
    + `${f(sk, 9)}, and the floor this geometry allows is ${f(I.minimumSkin(GGEO), 9)}`);
}
w('# THE ROUND TRIP. Take a published pair, compute its multiplier, invert it, and');
w('# the skin comes back. That is the only check there is on this function, and it');
w('# is one this generator ran, not one the oracle wrote.');
GOLD.skin.slice(0, 3).forEach((c, i) => {
  const m = I.skinPiMultiplier(c).multiplier;
  const back = I.skinFromPiRatio({ reFt: c.reFt, rwFt: c.rwFt, ratio: m, skinReference: c.skinBefore });
  w(`derived round trip, published case ${i + 1}: multiplier = ${f(m, 9)}, inverted skin = ${f(back, 9)}, `
    + `stated skinAfter = ${f(c.skinAfter, 3)}, difference = ${e(back - c.skinAfter, 4)}`);
});
w('# NO PLAUSIBILITY CHECK OF ANY KIND, and a BARE NaN for bad geometry. There is no');
w('# ok flag on this function, so a caller that does not run Number.isFinite on the');
w('# result cannot tell an answer from a refusal.');
const nanSkin = I.skinFromPiRatio({ reFt: 0.35, rwFt: 2000, ratio: 3 });
w(`derived inverse refusal, rw larger than re: value = ${f(nanSkin, 6)}, Number.isFinite = ${yn(Number.isFinite(nanSkin))}`);
const nanRatio = I.skinFromPiRatio({ ...GGEO, ratio: -2 });
w(`derived inverse refusal, a negative claimed ratio: value = ${f(nanRatio, 6)}, Number.isFinite = ${yn(Number.isFinite(nanRatio))}`);
const zeroRatio = I.skinFromPiRatio({ ...GGEO, ratio: 0 });
w(`derived inverse refusal, a claimed ratio of zero: value = ${f(zeroRatio, 6)}, Number.isFinite = ${yn(Number.isFinite(zeroRatio))}`);
w('# AND WHAT IT RETURNS WITHOUT COMMENT: a claimed uplift can imply a skin below');
w('# everything the module own refusal text calls real, and the answer comes back as');
w('# a bare number with nothing said about it.');
for (const ratio of [15, 20, 30]) {
  const sk = I.skinFromPiRatio({ ...GGEO, ratio });
  w(`derived inverse overreach, a claimed uplift of ${f(ratio, 3)} times implies a skin of ${f(sk, 9)}, `
    + `which is ${f(sk - I.minimumSkin(GGEO), 9)} above the floor and past everything the module calls achievable, `
    + `returned with no flag, no warning and no note`);
}
w('');

// ============================================================ SECTION 6
w('# SECTION 6: THE TEACHING WELL, ELELENWO-4, SAMPLE BY SAMPLE');
w('# Professional m02 and Expert m01 through m03. TEACHING. Not a real well and not');
w('# a published case. Designed so that one history argues both mechanisms at once:');
w('# the water-oil ratio climbs faster than proportionally for most of its life,');
w('# then the well is beaned back and the ratio falls, which is the coning field');
w('# test and the coning answer. Both stories are in the same series.');
w(`teaching ${TW.name}, samples = ${TW.n}, t from ${f(TW.t0Days, 3)} to ${f(TW.t1Days, 3)} days, `
  + `spaced geometrically, span = ${f(Math.log10(TW.t1Days / TW.t0Days), 9)} log cycles`);
w(`teaching ${TW.name}, WOR(t) = c1 t + c2 t^p with c1 = ${TW.c1PerDay} per day, p = ${TW.p}, `
  + `crossover tX = ${TW.crossoverDays} days and therefore c2 = ${e(TW_C2, 9)}`);
w(`teaching ${TW.name}, beaned back on day ${TW.chokeDays}; after that WOR(t) = ${TW.residual} + (wBreak - ${TW.residual}) (t/tBreak)^-${TW.declineK}`);
w(`teaching ${TW.name}, the last sample before the choke is at t = ${f(TW_TBREAK, 6)} days with WOR = ${f(TW_WBREAK, 9)}`);
w(`teaching ${TW.name}, first sample WOR = ${f(TWATER[0].ratio, 9)}, last sample WOR = ${f(TWATER[TWATER.length - 1].ratio, 9)}, `
  + `peak WOR = ${f(TW_WBREAK, 9)}`);
w(`teaching ${TW.name}, samples with a positive derivative = ${TWATER.filter((p) => p.derivative > 0).length}, `
  + `with a negative derivative = ${TWATER.filter((p) => p.derivative < 0).length}`);
w(`teaching ${TW.name}, water cut = ${TW.wctPct} percent, skin = ${TW.skinBefore}, re = ${TW.reFt} ft, rw = ${TW.rwFt} ft, `
  + `gas-oil ratio = ${TW.gorScfStb} scf/stb against an expected ${TW.expectedGorScfStb} scf/stb, flowing = ${yn(TW.flowing)}`);
TWATER.forEach((p, i) => {
  w(`teaching ${TW.name} sample ${i + 1}: t = ${f(p.t, 6)} days, WOR = ${f(p.ratio, 9)}, `
    + `derivative = ${f(p.derivative, 9)}`);
});
w('# THE WHOLE HISTORY FITTED AS ONE. This is the Associate measurement, on a raw');
w('# history, with no window and no classifier anywhere near it.');
const twFull = I.logLogSlope({ points: TWATER, xKey: 't', yKey: 'ratio' });
w(`teaching ${TW.name} full-history ratio fit: ok = ${yn(twFull.ok)}, slope = ${f(twFull.slope, 12)}, `
  + `intercept = ${f(twFull.intercept, 12)}, r2 = ${f(twFull.r2, 12)}, n = ${twFull.n}, `
  + `spanDecades = ${f(twFull.spanDecades, 9)}`);
w(`teaching ${TW.name} full-history ratio fit: the fit dropped ${TWATER.length - twFull.n} of the ${TWATER.length} `
  + `samples handed to it, and said nothing about it`);
w(`teaching ${TW.name} full-history ratio fit: intercept as a coefficient, exp(intercept) = ${e(Math.exp(twFull.intercept), 9)}`);
const twFullDer = I.logLogSlope({ points: TWATER, xKey: 't', yKey: 'derivative' });
w(`teaching ${TW.name} full-history derivative fit: ok = ${yn(twFullDer.ok)}, slope = ${f(twFullDer.slope, 12)}, `
  + `r2 = ${f(twFullDer.r2, 12)}, n = ${twFullDer.n}, spanDecades = ${f(twFullDer.spanDecades, 9)}`);
w('');

// ============================================================ SECTION 7
w('# SECTION 7: THE DIAGNOSIS AT THE DEFAULT WINDOW');
w('# Professional m02. TEACHING, at the engine own default lateFraction of 0.5,');
w('# which is also the window the oracle reads its four histories on. This is the');
w('# reading a user gets by touching nothing.');
const dxDefault = I.chanDiagnosis({ series: TWATER });
dxLine(`teaching ${TW.name} at lateFraction 0.5`, dxDefault);
const lcDefault = lateCounts(TWATER, dxDefault.lateFromT);
w(`teaching ${TW.name} at lateFraction 0.5: late samples = ${lcDefault.n}, positive derivative = ${lcDefault.pos}, `
  + `negative = ${lcDefault.neg}, exactly zero = ${lcDefault.zero}`);
w('# TWO FITS IN ONE RETURN OBJECT, ON TWO DIFFERENT WINDOWS. worSlope is fitted');
w('# over EVERY late sample. derivativeSlope is fitted over only the late samples');
w('# whose derivative is positive. They come back side by side with nothing in the');
w('# object saying they were measured on different data, and spanDecades describes');
w('# the second window only while being named as though it described the reading.');
const twWorLate = I.logLogSlope({ points: TWATER, xKey: 't', yKey: 'ratio', fromX: dxDefault.lateFromT });
const twDerLate = I.logLogSlope({
  points: TWATER.filter((p) => p.derivative > 0), xKey: 't', yKey: 'derivative', fromX: dxDefault.lateFromT,
});
w(`teaching ${TW.name} two windows: the ratio fit used n = ${twWorLate.n} samples over `
  + `${f(twWorLate.spanDecades, 9)} log cycles, slope = ${f(twWorLate.slope, 12)}, r2 = ${f(twWorLate.r2, 12)}`);
w(`teaching ${TW.name} two windows: the derivative fit used n = ${twDerLate.n} samples over `
  + `${f(twDerLate.spanDecades, 9)} log cycles, slope = ${f(twDerLate.slope, 12)}, r2 = ${f(twDerLate.r2, 12)}`);
w(`teaching ${TW.name} two windows: the derivative fit is ${twWorLate.n - twDerLate.n} samples short of the ratio fit, `
  + `and ${f(twWorLate.spanDecades - twDerLate.spanDecades, 9)} of a log cycle short of the window it claims to describe`);
w(`teaching ${TW.name} two windows: the window actually runs ${f(lcDefault.spanTrue, 9)} log cycles`);
w(`teaching ${TW.name} two windows: the two slopes returned side by side are `
  + `${f(dxDefault.worSlope, 9)} for the ratio and ${f(dxDefault.derivativeSlope, 9)} for the derivative, `
  + `a gap of ${f(dxDefault.derivativeSlope - dxDefault.worSlope, 9)}`);
w('# WHERE THE VERDICT SITS AGAINST THE THRESHOLD. This is the whole spend, decided');
w('# on one comparison.');
w(`teaching ${TW.name} margin: derivativeSlope = ${f(dxDefault.derivativeSlope, 12)} against a channellingSlope of `
  + `${I.CHAN_DEFAULTS.channellingSlope}, so the margin is ${f(dxDefault.derivativeSlope - I.CHAN_DEFAULTS.channellingSlope, 12)}`);
w(`teaching ${TW.name} margin: and against the ambiguous band of ${I.CHAN_DEFAULTS.ambiguousBand}, the reading is `
  + `${f(Math.abs(dxDefault.derivativeSlope - I.CHAN_DEFAULTS.channellingSlope), 9)} from the boundary, so ambiguous = ${yn(dxDefault.ambiguous)}`);
w('');

// ============================================================ SECTION 8
w('# SECTION 8: THE DIAL THAT DECIDES THE SPEND');
w('# Expert m02. TEACHING sweep. lateFraction is a free analyst choice with a');
w('# default of 0.5 and no guidance anywhere in the module, no sweep helper, and');
w('# nothing in the return object that names its effect. On one history, with not');
w('# one datum changed, it moves the mechanism and therefore the water shutoff');
w('# verdict. Every column below is the same 38 samples read through a different');
w('# window.');
for (const lf of [0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00]) {
  const d = I.chanDiagnosis({ series: TWATER, lateFraction: lf });
  const lc = lateCounts(TWATER, d.lateFromT);
  const sc = I.screenTreatments({ well: TWELL, diagnosis: d });
  const water = sc.find((r) => r.id === 'waterShutoff');
  w(`teaching ${TW.name} window sweep, lateFraction = ${f(lf, 2)}: window starts at t = ${f(d.lateFromT, 6)} days, `
    + `late samples = ${lc.n} of which ${lc.pos} positive and ${lc.neg} negative, `
    + `derivativeSlope = ${f(d.derivativeSlope, 9)}, derivativeR2 = ${f(d.derivativeR2, 9)}, `
    + `spanDecades = ${f(d.spanDecades, 9)}, worSlope = ${f(d.worSlope, 9)}, worR2 = ${f(d.worR2, 9)}, `
    + `mechanism = ${d.mechanism.id}, confidence = ${d.confidence}, ambiguous = ${yn(d.ambiguous)}, `
    + `waterShutoff = ${water.verdict}`);
}
w('# THE SAME SWEEP AS A MARGIN. What the dial is worth, measured against the one');
w('# threshold that decides whether the squeeze is recommended or refused.');
for (const lf of [0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00]) {
  const d = I.chanDiagnosis({ series: TWATER, lateFraction: lf });
  w(`teaching ${TW.name} window margin, lateFraction = ${f(lf, 2)}: derivativeSlope less channellingSlope = `
    + `${f(d.derivativeSlope - I.CHAN_DEFAULTS.channellingSlope, 9)}`);
}
const sweepSlopes = [0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00]
  .map((lf) => I.chanDiagnosis({ series: TWATER, lateFraction: lf }).derivativeSlope);
w(`teaching ${TW.name} window sweep: across the whole range of the dial the derivative slope moves by `
  + `${f(Math.max(...sweepSlopes) - Math.min(...sweepSlopes), 9)}, from ${f(Math.min(...sweepSlopes), 9)} to ${f(Math.max(...sweepSlopes), 9)}`);
w('# THE DIAL IS CLAMPED, WHICH IS THE ONE THING ABOUT IT THAT IS DOCUMENTED');
w('# NOWHERE. lateFraction is clamped to the range 0.1 to 1.0, so a value outside it');
w('# is silently replaced rather than refused.');
for (const lf of [-3, 0, 0.05, 0.1, 1.0, 2.5]) {
  const d = I.chanDiagnosis({ series: TWATER, lateFraction: lf });
  w(`teaching ${TW.name} clamp, lateFraction = ${f(lf, 2)} as handed in: window starts at t = ${f(d.lateFromT, 6)} days, `
    + `derivativeSlope = ${f(d.derivativeSlope, 9)}, mechanism = ${d.mechanism.id}`);
}
w('');

// ============================================================ SECTION 9
w('# SECTION 9: THE EVIDENCE THAT ARGUES THE OTHER WAY, AND WHERE IT GOES');
w('# Expert m01. THE CENTRE OF THE TIER. chanDiagnosis builds its derivative fit');
w('# from clean.filter((p) => Number.isFinite(p.derivative) && p.derivative > 0),');
w('# and logLogSlope then filters y > 0 again. A late window whose ratio has');
w('# TURNED BACK DOWN is therefore read entirely on the samples from BEFORE the');
w('# turn. The engine knows: two lines later');
w('# it counts negativeDerivatives, and it reads that count only inside the');
w('# !derFit.ok branch and the flat branch. Whenever three positive samples survive,');
w('# derFit.ok is true, the count is discarded, and the note it carries is');
w('# unreachable. Here is that note, quoted from the source, on a path this history');
w('# never reaches:');
w('#   "A ratio that has turned back down is itself the coning signature, but');
w('#    confirm it against the plot rather than on this alone."');
const firstPost = TWATER.find((p) => p.t > TW.chokeDays);
const postFit = I.logLogSlope({ points: TWATER, xKey: 't', yKey: 'ratio', fromX: firstPost.t });
const postDerFit = I.logLogSlope({ points: TWATER.map((p) => ({ t: p.t, d: -p.derivative })), xKey: 't', yKey: 'd', fromX: firstPost.t });
w(`teaching ${TW.name} discarded evidence: the turn happens after day ${TW.chokeDays}; the first sample past it is at `
  + `t = ${f(firstPost.t, 6)} days`);
TWATER.filter((p) => p.derivative < 0).forEach((p, i) => {
  w(`teaching ${TW.name} discarded sample ${i + 1}: t = ${f(p.t, 6)} days, WOR = ${f(p.ratio, 9)}, derivative = ${f(p.derivative, 9)}`);
});
w(`teaching ${TW.name} discarded evidence, fitted on its own: ok = ${yn(postFit.ok)}, `
  + `ratio slope = ${f(postFit.slope, 12)}, r2 = ${f(postFit.r2, 12)}, n = ${postFit.n}, `
  + `spanDecades = ${f(postFit.spanDecades, 9)}`);
w(`teaching ${TW.name} discarded evidence, the magnitude of the falling derivative fitted on its own: `
  + `slope = ${f(postDerFit.slope, 12)}, r2 = ${f(postDerFit.r2, 12)}, n = ${postDerFit.n}`);
w(`teaching ${TW.name} discarded evidence: a rate cut followed by a falling water-oil ratio is the coning field `
  + `test, and the ratio fit through it has an r-squared of ${f(postFit.r2, 9)}, which is a cleaner reading than the `
  + `${f(dxDefault.derivativeR2, 9)} the engine reported for the verdict it actually gave`);
w('# WHAT THE ENGINE REPORTED INSTEAD, on the same well, at the same window.');
w(`teaching ${TW.name} discarded evidence: reported mechanism = ${dxDefault.mechanism.id}, `
  + `reported derivativeSlope = ${f(dxDefault.derivativeSlope, 9)}, samples used = ${twDerLate.n}, samples dropped = `
  + `${twWorLate.n - twDerLate.n}, and the count of negative derivatives the engine computed and then discarded = ${lcDefault.neg}`);
w('# THE COMPOUNDING COST: dropping the contrary samples also SHORTENS the span the');
w('# fit sits on, and the span has its own gate at minSpanDecades. At a short enough');
w('# window the drop is the difference between a reading and a refusal.');
for (const lf of [0.20, 0.25, 0.30, 0.35]) {
  const d = I.chanDiagnosis({ series: TWATER, lateFraction: lf });
  const lc = lateCounts(TWATER, d.lateFromT);
  w(`teaching ${TW.name} span loss, lateFraction = ${f(lf, 2)}: the window runs ${f(lc.spanTrue, 9)} log cycles, `
    + `the fit reports spanDecades = ${f(d.spanDecades, 9)}, the loss is ${f(lc.spanTrue - d.spanDecades, 9)}, `
    + `and minSpanDecades is ${I.CHAN_DEFAULTS.minSpanDecades}, so the reported span clears the gate by `
    + `${f(d.spanDecades - I.CHAN_DEFAULTS.minSpanDecades, 9)}`);
}
w('# AND THE PATH THAT DOES READ THE COUNT, so a lesson can show what the engine');
w('# would have said. TEACHING: the same four falling samples with nothing before');
w('# them, so no positive sample survives, derFit fails, and the coning branch');
w('# fires with the note that is otherwise unreachable.');
const fallingOnly = TWATER.filter((p) => p.derivative < 0);
const padded = [
  ...TWATER.slice(TWATER.length - 8, TWATER.length - 4).map((p) => ({ t: p.t, ratio: p.ratio, derivative: -Math.abs(p.derivative) })),
  ...fallingOnly,
];
const dxFalling = I.chanDiagnosis({ series: padded, lateFraction: 1.0 });
dxLine(`teaching falling-only demonstration, ${padded.length} samples every one with a negative derivative`, dxFalling);
w('');

// ============================================================ SECTION 10
w('# SECTION 10: THE FAILS-OPEN. A MISSING DERIVATIVE COLUMN IS READ AS ZERO');
w('# Expert m03. THE WORST ONE IN THE MODULE. Number(null) is 0. So is Number("")');
w('# and Number([]). Only Number(undefined) is NaN. chanDiagnosis filters its input');
w('# on Number.isFinite(p.t) and Number.isFinite(p.ratio) and DOES NOT REQUIRE THE');
w('# DERIVATIVE TO BE FINITE, so a series exported with the Bourdet derivative');
w('# column never computed satisfies Math.abs(p.derivative) < 1e-12 at every late');
w('# point, takes the flat branch, and returns a reassuring verdict.');
w('# The spelling decides the answer, and null is the spelling every JSON export and');
w('# every SQL null produces.');
const coercions = [
  ['null', null], ['empty string', ''], ['empty array', []], ['false', false],
  ['the string "0"', '0'], ['undefined', undefined], ['the string "n/a"', 'n/a'],
];
coercions.forEach(([label, v]) => {
  const num = Number(v);
  w(`derived coercion, Number(${label}) = ${Number.isNaN(num) ? 'NaN' : f(num, 1)}, Number.isFinite = ${yn(Number.isFinite(num))}, `
    + `passes Math.abs(x) < 1e-12 = ${yn(Number.isFinite(num) && Math.abs(num) < 1e-12)}`);
});
w('# THE SAME WATER HISTORY, THE SAME MISSING DATA, TWO SPELLINGS, TWO OPPOSITE');
w('# ANSWERS. TEACHING.');
const twNull = TWATER.map((p) => ({ t: p.t, ratio: p.ratio, derivative: null }));
const twUndef = TWATER.map((p) => ({ t: p.t, ratio: p.ratio }));
const dxNull = I.chanDiagnosis({ series: twNull });
const dxUndef = I.chanDiagnosis({ series: twUndef });
dxLine(`teaching ${TW.name} with the derivative column spelled null`, dxNull);
dxLine(`teaching ${TW.name} with the derivative column spelled undefined`, dxUndef);
w(`teaching ${TW.name} spelling: null returns mechanism ${dxNull.mechanism.id} at confidence ${dxNull.confidence}, `
  + `undefined returns mechanism ${dxUndef.mechanism.id} at confidence ${dxUndef.confidence}, on identical ratios`);
w('# AND ON THE GAS HISTORY, WHICH IS WHERE THE MODULE OWN TEXT SENDS THE USER. The');
w('# gas shutoff reasoning says "Run the diagnostic on the gas-oil ratio before');
w('# deciding". TEACHING gas history: GOR(t) = g0 + g1 t^q scf/stb, with the');
w('# derivative column never computed.');
w(`teaching gas history: samples = ${TG.n}, t from ${TG.t0Days} to ${TG.t1Days} days, `
  + `g0 = ${TG.g0ScfStb} scf/stb, g1 = ${TG.g1}, q = ${TG.q}`);
w(`teaching gas history: first GOR = ${f(TGAS_NULL[0].ratio, 9)} scf/stb, last GOR = ${f(TGAS_NULL[TGAS_NULL.length - 1].ratio, 9)} scf/stb, `
  + `a factor of ${f(TGAS_NULL[TGAS_NULL.length - 1].ratio / TGAS_NULL[0].ratio, 9)} across the window`);
TGAS_NULL.forEach((p, i) => {
  w(`teaching gas history sample ${i + 1}: t = ${f(p.t, 6)} days, GOR = ${f(p.ratio, 9)} scf/stb, derivative column = null`);
});
const dxGasNull = I.chanDiagnosis({ series: TGAS_NULL });
const dxGasUndef = I.chanDiagnosis({ series: TGAS_UNDEF });
dxLine('teaching gas history with the derivative column spelled null', dxGasNull);
dxLine('teaching gas history with the derivative column spelled undefined', dxGasUndef);
w('');

// ============================================================ SECTION 11
w('# SECTION 11: THE FLAT BRANCH ASSERTS SOMETHING IT NEVER CHECKED');
w('# Expert m03. That branch note opens "The ratio is sitting flat at X". NOTHING IN');
w('# THE BRANCH LOOKS AT THE RATIO. The condition is entirely about the derivative,');
w('# and the same return object carries worSlope and worR2, fitted on the ratio, and');
w('# they say the opposite. The engine contradicts itself inside one object.');
w(`teaching gas history flat branch: the note says the ratio is sitting flat at `
  + `${f(TGAS_NULL[TGAS_NULL.length - 1].ratio, 2)} scf/stb`);
w(`teaching gas history flat branch: the SAME return object carries worSlope = ${f(dxGasNull.worSlope, 12)} `
  + `and worR2 = ${f(dxGasNull.worR2, 12)}, which is a ratio climbing steadily, on ${dxGasNull.points.length} clean samples`);
w(`teaching ${TW.name} flat branch: the note says the ratio is sitting flat at ${f(TWATER[TWATER.length - 1].ratio, 2)}`);
w(`teaching ${TW.name} flat branch: the SAME return object carries worSlope = ${f(dxNull.worSlope, 12)} `
  + `and worR2 = ${f(dxNull.worR2, 12)}`);
w('# THE PUBLISHED FLAT HISTORY IS THE ONE CASE WHERE THE SENTENCE IS TRUE, which is');
w('# exactly why nobody noticed: the only series anyone tested it on really was');
w('# flat.');
const goldFlat = GOLD.histories.flat.series;
const dxGoldFlat = I.chanDiagnosis({ series: goldFlat });
w(`golden histories.flat: every ratio = ${f(goldFlat[0].ratio, 9)}, every derivative = ${f(goldFlat[0].derivative, 9)}`);
dxLine('derived histories.flat, chanDiagnosis', dxGoldFlat);
w('');

// ============================================================ SECTION 12
w('# SECTION 12: THE ZERO-VARIANCE GUARD THAT FIRES BY ACCIDENT');
w('# Expert m03 and m04. logLogSlope computes r2 = syy > 0 ? (sxy*sxy)/(sxx*syy) : 1,');
w('# intending to hand back a perfect fit when every y is identical.');
w('# AN EARLIER VERSION OF THIS COMMENT SAID THE BRANCH NEVER FIRES. THAT IS WRONG,');
w('# and the generated line directly below it always said so: four points with y');
w('# identical at 5 return exactly the r2 = 1 the branch exists to produce. Whether');
w('# syy accumulates to EXACTLY zero over identical y depends on the sample count');
w('# and the value TOGETHER, and SECTION 12A sweeps both. What is true is that it');
w('# fires on small tidy cases and stops firing on real ones, so on the twenty');
w('# sample constant-derivative history it does NOT fire and the opposite of what');
w('# was intended happens: clean data is refused as noise.');
const identical = [{ x: 10, y: 5 }, { x: 100, y: 5 }, { x: 1000, y: 5 }, { x: 10000, y: 5 }];
const idFit = I.logLogSlope({ points: identical });
w(`derived zero variance, four points with y identical at 5: ok = ${yn(idFit.ok)}, slope = ${e(idFit.slope, 6)}, `
  + `r2 = ${e(idFit.r2, 6)}, n = ${idFit.n}, spanDecades = ${f(idFit.spanDecades, 9)}`);
w(`derived zero variance, the guard intended r2 = 1 here; it returned ${e(idFit.r2, 6)}, which is `
  + `${e(1 - idFit.r2, 6)} short of the value the branch exists to produce`);
w('# AND THE REAL SIGNATURE THAT LANDS ON IT. A ratio rising exactly logarithmically');
w('# has a derivative that is exactly constant. TEACHING demonstration: WOR = A +');
w('# B ln t, so d(WOR)/d(ln t) = B at every sample.');
const constDer = constantDerivative(2.0, 0.9, 20, 2000, 20);
w(`teaching constant-derivative demonstration: WOR = 2.0 + 0.9 ln t, ${constDer.length} samples from `
  + `t = 20 to 2000 days, first WOR = ${f(constDer[0].ratio, 9)}, last WOR = ${f(constDer[constDer.length - 1].ratio, 9)}, `
  + `derivative = ${f(constDer[0].derivative, 9)} at every sample`);
const dxConst = I.chanDiagnosis({ series: constDer });
dxLine('teaching constant-derivative demonstration, chanDiagnosis', dxConst);
const constDerFit = I.logLogSlope({ points: constDer, xKey: 't', yKey: 'derivative' });
w(`teaching constant-derivative demonstration, the derivative fit on its own: slope = ${e(constDerFit.slope, 6)}, `
  + `r2 = ${e(constDerFit.r2, 6)}, against a minR2 of ${I.CHAN_DEFAULTS.minR2}`);
w(`teaching constant-derivative demonstration, the ratio fit on its own: slope = ${f(I.logLogSlope({ points: constDer, xKey: 't', yKey: 'ratio' }).slope, 9)}, `
  + `r2 = ${f(I.logLogSlope({ points: constDer, xKey: 't', yKey: 'ratio' }).r2, 9)}`);
w('');

// ============================================================ SECTION 13
w('# SECTION 13: THE SKIN GUARD SITS AT THE SINGULARITY, NOT AT PLAUSIBILITY');
w('# Expert m04. skinPiMultiplier refuses a design only when the denominator reaches');
w('# ZERO, which is where the productivity index goes infinite. Its refusal text');
w('# then advertises a COMPLETELY DIFFERENT limit: "Real treatments reach about -3');
w('# to -5 on acid and -5 to -6 on a fracture; ask for less." Everything between');
w('# those limits and the pole is accepted in silence, with no warning, no note and');
w('# no flag. minimumSkin exists, is computed on every call, and is even returned');
w('# inside the successful result. It is never compared against anything but zero.');
w(`teaching ${TW.name} geometry: re = ${TW.reFt} ft, rw = ${TW.rwFt} ft, ln(re/rw) = ${f(Math.log(TW.reFt / TW.rwFt), 12)}, `
  + `minimumSkin = ${f(I.minimumSkin(TGEO), 12)}`);
w(`teaching ${TW.name} damage: skin before = ${TW.skinBefore}, denominator = ${f(I.pssDenominator({ ...TGEO, skin: TW.skinBefore }), 12)}, `
  + `flow efficiency = ${f(I.pssDenominator({ ...TGEO, skin: 0 }) / I.pssDenominator({ ...TGEO, skin: TW.skinBefore }), 9)}`);
const acid = I.skinPiMultiplier({ ...TGEO, skinBefore: TW.skinBefore, skinAfter: TW.skinAfterAcid });
w(`teaching ${TW.name} designed acid job, skin ${TW.skinBefore} down to ${TW.skinAfterAcid}: ok = ${yn(acid.ok)}, `
  + `multiplier = ${f(acid.multiplier, 12)}, before = ${f(acid.before, 9)}, after = ${f(acid.after, 9)}, `
  + `flowEfficiencyAfter = ${f(acid.flowEfficiencyAfter, 9)}, minimumSkin in the result = ${f(acid.minimumSkin, 9)}`);
w('# THE SWEEP THAT MATTERS. Walk the after-skin down past everything the refusal');
w('# text calls real, and watch the answer get bigger and the engine stay quiet.');
for (const sa of [-1, -2, -3, -4, -5, -5.5, -6, -6.5, -6.8, -7, -7.2, -7.3, -7.35, -7.361, -7.4, -7.6, -8]) {
  const r = I.skinPiMultiplier({ ...TGEO, skinBefore: TW.skinBefore, skinAfter: sa });
  if (r.ok) {
    w(`teaching ${TW.name} skin guard, after-skin = ${f(sa, 3)}: ok = true, multiplier = ${f(r.multiplier, 9)}, `
      + `denominator after = ${f(r.after, 9)}, distance above the floor = ${f(sa - r.minimumSkin, 9)}, `
      + `warnings = none, notes = none`);
  } else {
    w(`teaching ${TW.name} skin guard, after-skin = ${f(sa, 3)}: ok = false`);
    w(`teaching ${TW.name} skin guard, after-skin = ${f(sa, 3)}: error: ${r.error}`);
  }
}
const honest = I.skinPiMultiplier({ ...TGEO, skinBefore: TW.skinBefore, skinAfter: -5 });
const over = I.skinPiMultiplier({ ...TGEO, skinBefore: TW.skinBefore, skinAfter: TW.skinAfterOverreach });
w(`teaching ${TW.name} skin guard: the deepest skin the refusal text calls real for a fracture is -6; at an `
  + `after-skin of -5 the multiplier is ${f(honest.multiplier, 9)} and at ${TW.skinAfterOverreach} it is `
  + `${f(over.multiplier, 9)}, a factor of ${f(over.multiplier / honest.multiplier, 9)} handed back with the same `
  + `confidence as the honest one`);
w(`teaching ${TW.name} skin guard: against the DESIGNED acid job the same overreach is a factor of `
  + `${f(over.multiplier / acid.multiplier, 9)}`);
w('# THE BEFORE-SKIN HAS THE SAME GUARD AND THE SAME GAP, and its refusal text is a');
w('# different sentence that does not mention the achievable range at all.');
const badBefore = I.skinPiMultiplier({ ...TGEO, skinBefore: -8.5, skinAfter: 0 });
w(`teaching ${TW.name} skin guard, before-skin = -8.5: ok = ${yn(badBefore.ok)}`);
w(`teaching ${TW.name} skin guard, before-skin = -8.5: error: ${badBefore.error}`);
const badGeom = I.skinPiMultiplier({ reFt: 0.35, rwFt: 2000, skinBefore: 5, skinAfter: 0 });
w(`teaching skin guard, rw larger than re: ok = ${yn(badGeom.ok)}`);
w(`teaching skin guard, rw larger than re: error: ${badGeom.error}`);
w('# TWO FAILURE CONTRACTS IN ONE MODULE, which is what makes this hard to catch at');
w('# a call site: skinPiMultiplier returns { ok: false, error }, and pssDenominator,');
w('# minimumSkin and skinFromPiRatio return a BARE NaN for the same bad geometry.');
w(`derived failure contracts: skinPiMultiplier returns an object with ok = ${yn(badGeom.ok)}; `
  + `pssDenominator returns ${f(I.pssDenominator({ reFt: 0.35, rwFt: 2000, skin: 0 }), 3)}; `
  + `minimumSkin returns ${f(I.minimumSkin({ reFt: 0.35, rwFt: 2000 }), 3)}; `
  + `skinFromPiRatio returns ${f(I.skinFromPiRatio({ reFt: 0.35, rwFt: 2000, ratio: 3 }), 3)}`);
w('# AUDITING A CLAIM ON THE TEACHING GEOMETRY. A vendor claims a fold increase; the');
w('# inverse says what skin that implies, and says nothing about whether it is real.');
for (const ratio of [2, 4, 6, TW.claimedRatio, 12]) {
  const sk = I.skinFromPiRatio({ ...TGEO, ratio });
  w(`teaching ${TW.name} claim audit, a claimed uplift of ${f(ratio, 3)} times implies a post-job skin of ${f(sk, 9)}, `
    + `against a geometry floor of ${f(I.minimumSkin(TGEO), 9)} and a fracture limit the module own text puts at -6`);
}
w('');

// ============================================================ SECTION 14
w('# SECTION 14: THE RATIO GATE IS UNIT BLIND AND READS ONE SAMPLE');
w('# Expert m05. minWor is 0.1, named for a water-oil ratio, documented as "Below');
w('# this water-oil ratio there is no water problem to diagnose", and applied');
w('# unchanged to whatever ratio column arrives. It is also applied to the LAST');
w('# SAMPLE ALONE, so one low final reading short-circuits the entire diagnosis with');
w('# no slope computed and no confidence returned.');
w(`derived minWor: the threshold is ${I.CHAN_DEFAULTS.minWor}, and it is compared against the last sample ratio only`);
w(`teaching gas history: the last GOR is ${f(TGAS_NULL[TGAS_NULL.length - 1].ratio, 6)} scf/stb, which clears a `
  + `water-oil-ratio threshold of ${I.CHAN_DEFAULTS.minWor} by a factor of `
  + `${e(TGAS_NULL[TGAS_NULL.length - 1].ratio / I.CHAN_DEFAULTS.minWor, 6)}, so on a gas history the gate is inert`);
const lowLast = lowLastSample(24, 30, 2000, 0.004, 1.15, 0.06);
w(`teaching low-last-sample demonstration: ${lowLast.length} samples from t = 30 to 2000 days on WOR = 0.004 t^1.15, `
  + `climbing to ${f(lowLast[lowLast.length - 2].ratio, 9)} at the second to last sample, with the last reading `
  + `replaced by a post-shut-in test of ${f(lowLast[lowLast.length - 1].ratio, 9)}`);
const dxLow = I.chanDiagnosis({ series: lowLast });
dxLine('teaching low-last-sample demonstration, chanDiagnosis', dxLow);
const lowRestored = lowLast.map((p, i) => (i === lowLast.length - 1
  ? { ...p, ratio: 0.004 * Math.pow(p.t, 1.15) } : p));
const dxRestored = I.chanDiagnosis({ series: lowRestored });
dxLine('teaching low-last-sample demonstration with that one sample restored, chanDiagnosis', dxRestored);
w(`teaching low-last-sample demonstration: one sample decides between mechanism ${dxLow.mechanism.id} with `
  + `confidence ${dxLow.confidence} and no slope at all, and mechanism ${dxRestored.mechanism.id} with confidence `
  + `${dxRestored.confidence} at a derivative slope of ${f(dxRestored.derivativeSlope, 9)}`);
w('# THE OTHER DOOR IN. A history of fewer than six samples is refused outright, and');
w('# that refusal is the one place the module counts before it reads.');
const short = TWATER.slice(0, 5);
const dxShort = I.chanDiagnosis({ series: short });
dxLine(`teaching short history, ${short.length} samples`, dxShort);
w('');

// ============================================================ SECTION 15
w('# SECTION 15: THE SCREENING, AND WHAT THE VERDICT IS GATED ON');
w('# Professional m04 and m05. TEACHING. Seven treatments, each with its reasons in');
w('# full, and the water shutoff gated by the diagnosis. Every verdict below is the');
w('# same well row read against a different diagnosis, and nothing about the well');
w('# changes between them.');
const scDefault = I.screenTreatments({ well: TWELL, diagnosis: dxDefault });
screenLines(`teaching ${TW.name} screening, water diagnosis at lateFraction 0.5`, scDefault);
w(`teaching ${TW.name} screening, water diagnosis at lateFraction 0.5: ranked order = `
  + `${I.rankTreatments(scDefault).map((r) => `${r.id} (${r.verdict})`).join(', ')}`);
w('');
const dxLong = I.chanDiagnosis({ series: TWATER, lateFraction: 0.9 });
const scLong = I.screenTreatments({ well: TWELL, diagnosis: dxLong });
screenLines(`teaching ${TW.name} screening, the same well at lateFraction 0.9`, scLong);
w(`teaching ${TW.name} screening, the same well at lateFraction 0.9: ranked order = `
  + `${I.rankTreatments(scLong).map((r) => `${r.id} (${r.verdict})`).join(', ')}`);
w('');
w('# WITH NO DIAGNOSIS AT ALL, which is the honest refusal and the one the module');
w('# gets right.');
const scNone = I.screenTreatments({ well: TWELL, diagnosis: null });
screenLines(`teaching ${TW.name} screening, no diagnosis`, scNone);
w('');

// ============================================================ SECTION 16
w('# SECTION 16: THE SCREENING DOES NOT KNOW WHICH FLUID IT READ');
w('# Expert m05. screenTreatments takes a diagnosis and reads diagnosis.mechanism.id.');
w('# NOTHING in chanDiagnosis return says whether it read a water-oil ratio or a');
w('# gas-oil ratio, and the module own gas reasoning sends the user to run it on the');
w('# gas. Hand the screening the GAS diagnosis and the WATER shutoff comes back with');
w('# a verdict, and its reasons quote the water cut. That block is issued on gas');
w('# evidence.');
const scGas = I.screenTreatments({ well: TWELL, diagnosis: dxGasNull });
screenLines(`teaching ${TW.name} screening, handed the GAS diagnosis`, scGas);
w(`teaching ${TW.name} screening comparison: on the water diagnosis the water shutoff is `
  + `${scDefault.find((r) => r.id === 'waterShutoff').verdict}; on the gas diagnosis it is `
  + `${scGas.find((r) => r.id === 'waterShutoff').verdict}; the well row handed in is identical`);
w('# AND CONFIDENCE IS READ IN EXACTLY ONE PLACE. screenTreatments reads');
w('# diagnosis.confidence only in the channelling branch, where it appends a line');
w('# about a production log. The displacement and coning branches, which BLOCK, read');
w('# neither confidence nor ambiguous. The caveat is attached to the verdict that');
w('# spends money, not to the one that refuses to.');
w(`teaching ${TW.name} confidence handling, at lateFraction 0.5: mechanism = ${dxDefault.mechanism.id}, `
  + `confidence = ${dxDefault.confidence}, ambiguous = ${yn(dxDefault.ambiguous)}, water shutoff reasons = `
  + `${scDefault.find((r) => r.id === 'waterShutoff').reasons.length}`);
w(`teaching ${TW.name} confidence handling, at lateFraction 0.9: mechanism = ${dxLong.mechanism.id}, `
  + `confidence = ${dxLong.confidence}, ambiguous = ${yn(dxLong.ambiguous)}, water shutoff reasons = `
  + `${scLong.find((r) => r.id === 'waterShutoff').reasons.length}, blocked = `
  + `${yn(scLong.find((r) => r.id === 'waterShutoff').blocked)}`);
w('');

// ============================================================ SECTION 17
w('# SECTION 17: A TEST THAT DECIDES NOTHING');
w('# Expert m05. UNAMBIGUOUS, and one word wide. The fracture verdict is');
w('#   push("hydraulicFracture", Number.isFinite(skin) && skin > 0 ? "consider" :');
w('#   "consider", fracReasons);');
w('# Both arms of the ternary return the same string. The skin test decides nothing');
w('# and never has, and it reads as though somebody meant "candidate" on the true');
w('# arm. DERIVED sweep: the same well row at every skin, and the verdict never');
w('# moves.');
for (const sk of [-4, -1, 0, 0.5, 3, 9, 20, NaN]) {
  const row = { ...TWELL, skin: sk };
  const r = I.screenTreatments({ well: row, diagnosis: dxDefault });
  const frac = r.find((x) => x.id === 'hydraulicFracture');
  const acidRow = r.find((x) => x.id === 'matrixAcid');
  const recomp = r.find((x) => x.id === 'recompletion');
  w(`derived fracture ternary, skin = ${Number.isFinite(sk) ? f(sk, 3) : 'not entered'}: `
    + `hydraulicFracture = ${frac.verdict}, matrixAcid = ${acidRow.verdict}, recompletion = ${recomp.verdict}, `
    + `fracture reasons = ${frac.reasons.length}`);
}
w('# WHAT THE OTHER SKIN-GATED VERDICTS DO INSTEAD, so a lesson can show that the');
w('# module knows how to write this branch and wrote it correctly three times.');
w(`derived verdict thresholds, matrixAcid: candidate above skin 2, marginal above 0, no at or below 0, `
  + `unknown when no skin was entered`);
w(`derived verdict thresholds, recompletion: candidate when the mechanism is channelling or the skin is above 8, `
  + `consider otherwise`);
w(`derived verdict thresholds, artificialLift: candidate when flowing is false, consider above 70 percent water, `
  + `no otherwise; this well is at ${TW.wctPct} percent`);
w('');

// ============================================================ SECTION 18
w('# SECTION 18: THE GAS SHUTOFF GATE, AND THE INSTRUCTION IT ENDS ON');
w('# Professional m05. DERIVED sweep on the teaching well expected gas-oil ratio.');
w('# The gate is a factor of two on the expected ratio and nothing else.');
for (const gor of [900, 1500, 1899, 1900, 1901, 2152, 3000, 5000]) {
  const row = { ...TWELL, gorScfStb: gor };
  const r = I.screenTreatments({ well: row, diagnosis: dxDefault }).find((x) => x.id === 'gasShutoff');
  w(`derived gas gate, gas-oil ratio = ${f(gor, 0)} scf/stb against an expected ${TW.expectedGorScfStb}: `
    + `verdict = ${r.verdict}, ratio to expected = ${f(gor / TW.expectedGorScfStb, 9)}, reasons = ${r.reasons.length}`);
}
const gasRow = I.screenTreatments({ well: TWELL, diagnosis: dxDefault }).find((x) => x.id === 'gasShutoff');
gasRow.reasons.forEach((rs, i) => w(`derived gas gate, at the teaching well own ratio: reason ${i + 1}: ${rs}`));
w('# THAT LAST SENTENCE IS THE WHOLE OF SECTION 10 AND SECTION 16 IN ONE LINE. It');
w('# tells the user to run the diagnostic on the gas-oil ratio, and the diagnostic');
w('# it sends them to cannot tell it read a gas history, fails open on a missing');
w('# derivative column, and returns a verdict the water screening will then act on.');
w('');

// ============================================================ SECTION 19
w('# SECTION 19: THE WATER GATE, END TO END');
w('# Professional m04. DERIVED sweep on the water cut, holding the diagnosis fixed.');
w('# Below 30 percent there is no water problem worth an intervention, whatever the');
w('# diagnosis says, and that gate fires before the mechanism is ever read.');
for (const wct of [10, 25, 29, 30, 45, 60, 61, 74.5, 90]) {
  const row = { ...TWELL, wctPct: wct };
  const r = I.screenTreatments({ well: row, diagnosis: dxDefault });
  const water = r.find((x) => x.id === 'waterShutoff');
  const frac = r.find((x) => x.id === 'hydraulicFracture');
  const lift = r.find((x) => x.id === 'artificialLift');
  w(`derived water gate, water cut = ${f(wct, 1)} percent: waterShutoff = ${water.verdict}, `
    + `blocked = ${yn(water.blocked)}, reasons = ${water.reasons.length}, fracture reasons = ${frac.reasons.length}, `
    + `artificialLift = ${lift.verdict}`);
}
w('# THE SAME WATER CUT UNDER EVERY MECHANISM. This is the gating the module exists');
w('# for, and it is the part with no golden.');
const mechCases = [
  ['channelling', I.chanDiagnosis({ series: GOLD.histories.channelling.series })],
  ['coning', I.chanDiagnosis({ series: GOLD.histories.coning.series })],
  ['displacement', I.chanDiagnosis({ series: GOLD.histories.displacement.series })],
  ['flat', I.chanDiagnosis({ series: GOLD.histories.flat.series })],
];
mechCases.forEach(([label, d]) => {
  const r = I.screenTreatments({ well: TWELL, diagnosis: d });
  const water = r.find((x) => x.id === 'waterShutoff');
  const rate = r.find((x) => x.id === 'rateReduction');
  const recomp = r.find((x) => x.id === 'recompletion');
  w(`derived mechanism gate, published ${label} history gives mechanism ${d.mechanism.id} at confidence ${d.confidence}: `
    + `waterShutoff = ${water.verdict} (blocked ${yn(water.blocked)}), rateReduction = ${rate.verdict}, `
    + `recompletion = ${recomp.verdict}`);
});
w('');

// ============================================================ SECTION 20
w('# SECTION 20: WHAT A LESSON MAY AND MAY NOT DO WITH THIS FILE');
w('# 1. Every number a lesson quotes must appear on a line above. If it is not here,');
w('#    it is not a number this course knows.');
w('# 2. Say which label a number carries. A golden value, a derived sweep point and');
w('#    a teaching case are three different kinds of claim and a reader is entitled');
w('#    to know which one is in front of them.');
w('# 3. Never present the teaching well, the teaching gas history or the three');
w('#    demonstration series as real or as published. They were built to carry a');
w('#    result and they are labelled teaching for that reason.');
w('# 4. Never mention the capstone well, its history, its geometry, its skin, its');
w('#    water cut or its window. None of it is in this file and none of it belongs');
w('#    in a lesson.');
w('# 5. Say what the thing REFUSES to do. Every refusal in this module is printed');
w('#    above with its exact words, and the refusals are half the teaching.');
w('# 6. A slope on a log-log plot carries no unit. Do not give it one.');
w('# 7. Fit quality is a FRACTION in this engine and a PERCENTAGE in its own error');
w('#    messages. Say which you mean every time.');
// ============================================================ SECTION 12A
// Folded in from pd8_zerovar.mjs so that this generator alone reproduces the
// digest. Reproduces logLogSlope's own syy accumulation exactly.
const syyOf = (vals) => {
  const nn = vals.length;
  const ly = vals.map(Math.log);
  const my = ly.reduce((a, v) => a + v, 0) / nn;
  let acc = 0;
  for (const v of ly) { const d = v - my; acc += d * d; }
  return acc;
};
w('');
w('# SECTION 12A: WHEN THE ZERO-VARIANCE GUARD FIRES, AND WHY IT IS WORSE');
w('# THAN A GUARD THAT NEVER FIRES. derived, reproducing logLogSlope\'s own');
w('# accumulation. The guard is `syy > 0 ? ordinary : 1`, so it fires exactly');
w('# when syy is EXACTLY zero. Over identical y values that is decided by');
w('# whether the sequential sum of n identical logarithms divides exactly by n,');
w('# and THAT DEPENDS ON THE SAMPLE COUNT AND THE VALUE TOGETHER. Neither one');
w('# alone predicts it. Expert m04.');
for (const zn of [3, 4, 5, 8, 10, 16, 20, 32]) {
  const cells = [5, 0.9, 2, 0.1].map((v) => {
    const acc = syyOf(Array(zn).fill(v));
    return `y = ${v}: syy = ${acc.toExponential(3)}, guard fires = ${acc === 0}`;
  });
  w(`derived zero variance sweep, n = ${zn}: ${cells.join('; ')}`);
}
w('# READ THE TABLE, NOT THE SLOGAN. At n = 3 and n = 4 the guard fires on');
w('# every value tried. At n = 5 it already splits: it fires on y = 5 and not');
w('# on y = 0.9. At n = 8 and above it mostly does not fire, and y = 2 keeps');
w('# firing until n = 32 where it stops. There is no rule here a caller could');
w('# hold in their head.');
w('# SO THE HEADLINE "A GUARD THAT NEVER FIRES" IS WRONG, AND THE TRUTH IS');
w('# WORSE. A guard that never fires is dead code, and dead code is harmless');
w('# once you know it is dead. THIS guard fires on small tidy cases and stops');
w('# firing on real ones, which is the pattern that survives a test suite and');
w('# fails in production: the derived four-point case at y = 5 fires and');
w('# returns the intended r2 = 1, and the twenty-sample constant-derivative');
w('# history does not fire and comes back at r2 = 2.271680e-31, clean data');
w('# refused as noise.');
w('');
w(`derived digest, lines written = ${out.length + 1}`);

process.stdout.write(out.join('\n') + '\n');
