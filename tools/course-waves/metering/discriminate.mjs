// THE DISCRIMINATE SWEEP over every FC8 capstone route.
//
// Per the programme rule that a gate which restates the formula validates
// nothing: for each of the eighteen graded fields, does a PLAUSIBLE WRONG
// METHOD actually move it past its own tolerance? A field no plausible error
// moves is a field that grades nothing, whatever the prompt claims it tests.
//
// A route is WEAK if fewer than three of the plausible errors aimed at it move
// it, or if any error aimed at it is BLIND, meaning it lands INSIDE the
// tolerance. The CLOSEST MISS is reported in tolerances, so "it discriminates"
// arrives with a margin beside it rather than as a claim.
//
// IT IS RUN AT THE FINAL TOLERANCES, after make_fields.mjs has widened every
// one of them to the printed precision. Widening can reveal a collision a
// tighter tolerance hid, so a sweep run before the widening proves nothing
// about the course that ships.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//
// The control multiplies every tolerance by 1e9 and must report EIGHTEEN WEAK
// ROUTES, because at that width no plausible error moves anything. It proves
// the sweep is reading the tolerances rather than reporting a constant.
//
// Exit 0 clean, 1 if any route is WEAK, 2 if the sweep could not run.
import fs from 'node:fs';
import process from 'node:process';

const HERE = process.env.FC8_WAVE_DIR || '/root/fc-wip-metering';
const ROOT = process.env.FC8_ENGINES || '/root/wt-fc8-nextgen/packages/engines';
const M = await import(`${ROOT}/engines/facilities/metering.js`);
const V = await import(`${ROOT}/engines/facilities/controlValve.js`);
const T = await import(`${ROOT}/engines/facilities/storageTank.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e9 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The three scenarios, restated here by READING THE GENERATOR'S SOURCE, so this
   file cannot drift from the capstone by carrying a second typed copy of any
   condition. */
const SRC = fs.readFileSync(`${HERE}/fc8_capstone.mjs`, 'utf8');
const scenario = (name) => {
  const m = SRC.match(new RegExp(`const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
  if (!m) { console.log(`REFUSED: cannot read the ${name} scenario out of fc8_capstone.mjs`); process.exit(2); }
  const o = {};
  [...m[1].matchAll(/(\w+):\s*(-?[\d._]+)\s*,/g)].forEach((f) => { o[f[1]] = Number(f[2].replace(/_/g, '')); });
  return o;
};
const K = scenario('KRAKAMA');
const U = scenario('UTONANA');
const G = scenario('SAGHARA');

const bisect = (lo, hi, pred) => {
  let a = lo; let b = hi;
  const pa = pred(a);
  if (pa === pred(b)) return NaN;
  for (let i = 0; i < 300; i += 1) {
    const m = (a + b) / 2;
    if (pred(m) === pa) a = m; else b = m;
    if (Math.abs(b - a) <= Math.abs(b) * 1e-15) break;
  }
  return (a + b) / 2;
};

/* ---------------------------------------------------- the truths, re-derived */

const kFlow = M.orificeFlow({
  pipeIdIn: K.pipeIdIn, orificeIdIn: K.orificeIdIn, dpInH2O: K.dpInH2O,
  p1Psia: K.p1Psia, densityLbFt3: K.densityLbFt3, viscosityCp: K.viscosityCp, k: K.k,
});
const kBudgetArgs = {
  beta: kFlow.beta, cdUncertaintyPct: K.cdUncertaintyPct,
  expansibilityUncertaintyPct: K.expansibilityUncertaintyPct,
  boreUncertaintyPct: K.boreUncertaintyPct, pipeUncertaintyPct: K.pipeUncertaintyPct,
  densityUncertaintyPct: K.densityUncertaintyPct,
  dpInH2O: K.dpInH2O, spanInH2O: K.spanInH2O,
  transmitterAccuracyPctOfSpan: K.transmitterAccuracyPctOfSpan,
};
const kBudget = M.orificeUncertainty(kBudgetArgs);
const uValve = V.liquidValve({
  qGpm: U.qGpm, p1Psia: U.p1Psia, p2Psia: U.p2Psia, sg: U.sg,
  pvPsia: U.pvPsia, pcPsia: U.pcPsia, flOverride: U.fl,
});
const gShellArgs = (sg) => ({
  diameterFt: G.diameterFt, heightFt: G.heightFt, courseHeightFt: G.courseHeightFt,
  liquidLevelFt: G.liquidLevelFt, sg, designStressPsi: G.designStressPsi,
  testStressPsi: G.testStressPsi, corrosionAllowanceIn: G.corrosionAllowanceIn,
  minimumThicknessIn: G.minimumThicknessIn,
});
const gCap = T.tankCapacity({ diameterFt: G.diameterFt, heightFt: G.heightFt, fillHeightFt: G.liquidLevelFt });
const gVentArgs = (draw) => ({
  nominalBbl: gCap.nominalBbl, fillBblPerHr: G.fillBblPerHr, drawBblPerHr: draw,
  highVolatility: false, latitudeFactor: G.latitudeFactor, insulated: false,
  scfhPerBbl: G.scfhPerBbl, lowVolatilityOutFactor: G.lowVolatilityOutFactor,
  proportionalLimitBbl: G.proportionalLimitBbl,
});
const gVent = T.normalVenting(gVentArgs(G.drawBblPerHr));
const headFt = Math.max(G.liquidLevelFt - 1, 0);

const ROUTES = {
  krakama_beta_ratio: {
    truth: () => kFlow.beta,
    wrong: {
      pipe_over_bore: () => K.pipeIdIn / K.orificeIdIn,
      area_ratio: () => (K.orificeIdIn / K.pipeIdIn) ** 2,
      beta_to_the_fourth: () => (K.orificeIdIn / K.pipeIdIn) ** 4,
      annulus_fraction: () => (K.pipeIdIn - K.orificeIdIn) / K.pipeIdIn,
      published_upper_limit_quoted: () => 0.75,
    },
  },
  krakama_differential_psi: {
    truth: () => kFlow.dpPsi,
    wrong: {
      left_in_inches_of_water: () => K.dpInH2O,
      conversion_divided_not_multiplied: () => K.dpInH2O / (kFlow.dpPsi / K.dpInH2O),
      the_span_converted_instead: () => K.spanInH2O * (kFlow.dpPsi / K.dpInH2O),
      inches_of_mercury_factor: () => K.dpInH2O * 0.4911541,
      feet_of_water_factor: () => (K.dpInH2O / 12) * 0.4335,
    },
  },
  krakama_transmitter_uncertainty_pct: {
    truth: () => M.transmitterUncertaintyPct({
      dpInH2O: K.dpInH2O, spanInH2O: K.spanInH2O, accuracyPctOfSpan: K.transmitterAccuracyPctOfSpan,
    }).uncertaintyPctOfReading,
    wrong: {
      accuracy_quoted_as_reading: () => K.transmitterAccuracyPctOfSpan,
      span_and_reading_swapped: () => (K.transmitterAccuracyPctOfSpan * K.dpInH2O) / K.spanInH2O,
      scaled_by_the_flow_turndown: () => K.transmitterAccuracyPctOfSpan * Math.sqrt(K.spanInH2O / K.dpInH2O),
      scaled_by_the_turndown_squared: () => K.transmitterAccuracyPctOfSpan * (K.spanInH2O / K.dpInH2O) ** 2,
      engine_default_accuracy_used: () => M.transmitterUncertaintyPct({
        dpInH2O: K.dpInH2O, spanInH2O: K.spanInH2O,
      }).uncertaintyPctOfReading,
    },
  },
  krakama_flow_turndown_ratio: {
    truth: () => M.transmitterUncertaintyPct({
      dpInH2O: K.dpInH2O, spanInH2O: K.spanInH2O, accuracyPctOfSpan: K.transmitterAccuracyPctOfSpan,
    }).flowTurndown,
    wrong: {
      differential_turndown_quoted: () => K.spanInH2O / K.dpInH2O,
      reciprocal: () => Math.sqrt(K.dpInH2O / K.spanInH2O),
      turndown_squared: () => (K.spanInH2O / K.dpInH2O) ** 2,
      the_customary_limit_quoted: () => 3,
      the_differential_limit_quoted: () => 9,
    },
  },
  krakama_total_uncertainty_pct: {
    truth: () => kBudget.totalUncertaintyPct,
    wrong: {
      terms_summed_rather_than_in_quadrature: () => kBudget.contributions.reduce((s, c) => s + c.contributionPct, 0),
      sensitivities_ignored: () => Math.sqrt(kBudget.contributions.reduce((s, c) => s + c.uncertaintyPct ** 2, 0)),
      engine_defaults_used: () => M.orificeUncertainty({ beta: kFlow.beta, dpInH2O: K.dpInH2O, spanInH2O: K.spanInH2O }).totalUncertaintyPct,
      typed_differential_term_used: () => M.orificeUncertainty({
        beta: kFlow.beta, cdUncertaintyPct: K.cdUncertaintyPct,
        expansibilityUncertaintyPct: K.expansibilityUncertaintyPct,
        boreUncertaintyPct: K.boreUncertaintyPct, pipeUncertaintyPct: K.pipeUncertaintyPct,
        densityUncertaintyPct: K.densityUncertaintyPct,
      }).totalUncertaintyPct,
      dominant_term_quoted: () => kBudget.contributions[0].contributionPct,
    },
  },
  krakama_turbine_gross_bbl: {
    truth: () => M.turbineVolume({
      pulses: K.pulses, kFactorPulsesPerBbl: K.kFactorPulsesPerBbl, meterFactor: K.meterFactor,
    }).grossBbl,
    wrong: {
      indicated_quoted: () => K.pulses / K.kFactorPulsesPerBbl,
      meter_factor_divided: () => K.pulses / K.kFactorPulsesPerBbl / K.meterFactor,
      meter_factor_read_as_a_percentage: () => (K.pulses / K.kFactorPulsesPerBbl) * (1 + K.meterFactor / 100),
      k_factor_multiplied: () => K.pulses * K.kFactorPulsesPerBbl,
    },
  },
  utonana_ff_critical_ratio: {
    truth: () => uValve.ff,
    wrong: {
      vapour_over_critical_quoted: () => U.pvPsia / U.pcPsia,
      square_root_not_taken: () => 0.96 - 0.28 * (U.pvPsia / U.pcPsia),
      sign_reversed: () => 0.96 + 0.28 * Math.sqrt(U.pvPsia / U.pcPsia),
      pressures_inverted: () => 0.96 - 0.28 * Math.sqrt(U.pcPsia / U.pvPsia),
      engine_default_critical_pressure_used: () => V.liquidCriticalRatioFF({ pvPsia: U.pvPsia, pcPsia: 3200 }),
    },
  },
  utonana_allowable_drop_psi: {
    truth: () => uValve.dpAllowablePsi,
    wrong: {
      recovery_factor_not_squared: () => U.fl * (U.p1Psia - uValve.ff * U.pvPsia),
      critical_ratio_omitted: () => U.fl * U.fl * (U.p1Psia - U.pvPsia),
      stated_drop_quoted: () => U.p1Psia - U.p2Psia,
      vapour_pressure_not_subtracted: () => U.fl * U.fl * U.p1Psia,
      table_recovery_factor_used: () => V.liquidValve({
        qGpm: U.qGpm, p1Psia: U.p1Psia, p2Psia: U.p2Psia, sg: U.sg,
        pvPsia: U.pvPsia, pcPsia: U.pcPsia, styleId: 'globeCage',
      }).dpAllowablePsi,
    },
  },
  utonana_liquid_cv: {
    truth: () => uValve.cv,
    wrong: {
      sized_on_the_stated_drop: () => U.qGpm * Math.sqrt(U.sg / (U.p1Psia - U.p2Psia)),
      gravity_not_square_rooted: () => (U.qGpm * U.sg) / Math.sqrt(uValve.dpUsedPsi),
      drop_and_gravity_inverted: () => U.qGpm * Math.sqrt(uValve.dpUsedPsi / U.sg),
      gravity_omitted: () => U.qGpm / Math.sqrt(uValve.dpUsedPsi),
      table_recovery_factor_used: () => V.liquidValve({
        qGpm: U.qGpm, p1Psia: U.p1Psia, p2Psia: U.p2Psia, sg: U.sg,
        pvPsia: U.pvPsia, pcPsia: U.pcPsia, styleId: 'globeCage',
      }).cv,
    },
  },
  utonana_cavitation_sigma: {
    truth: () => uValve.sigma,
    wrong: {
      computed_on_the_stated_drop: () => (U.p1Psia - U.pvPsia) / (U.p1Psia - U.p2Psia),
      outlet_used_in_place_of_the_vapour_pressure: () => (U.p1Psia - U.p2Psia) / uValve.dpUsedPsi,
      inverted: () => uValve.dpUsedPsi / (U.p1Psia - U.pvPsia),
      pressure_ratio_quoted: () => U.p1Psia / U.pvPsia,
      cavitating_threshold_quoted: () => V.SIGMA_THRESHOLDS.cavitating,
    },
  },
  utonana_valve_authority: {
    truth: () => V.valveAuthority({
      dpValvePsi: uValve.dpStatedPsi, dpSystemTotalPsi: U.dpSystemTotalPsi,
    }).authority,
    wrong: {
      computed_on_the_allowable_drop: () => uValve.dpAllowablePsi / U.dpSystemTotalPsi,
      inverted: () => U.dpSystemTotalPsi / uValve.dpStatedPsi,
      the_rest_of_the_system_quoted: () => (U.dpSystemTotalPsi - uValve.dpStatedPsi) / U.dpSystemTotalPsi,
      stated_as_a_percentage: () => (uValve.dpStatedPsi / U.dpSystemTotalPsi) * 100,
      good_threshold_quoted: () => 0.5,
    },
  },
  utonana_normal_travel_pct: {
    truth: () => V.travelCheck({
      cvRequiredMin: U.cvRequiredMin, cvRequiredNormal: U.cvRequiredNormal,
      cvRequiredMax: U.cvRequiredMax, cvRated: U.cvRated,
      characteristic: 'equalPercentage', rangeability: U.rangeability,
    }).normalTravelPct,
    wrong: {
      linear_characteristic_used: () => V.travelCheck({
        cvRequiredMin: U.cvRequiredMin, cvRequiredNormal: U.cvRequiredNormal,
        cvRequiredMax: U.cvRequiredMax, cvRated: U.cvRated, characteristic: 'linear',
      }).normalTravelPct,
      engine_default_rangeability_used: () => V.travelCheck({
        cvRequiredMin: U.cvRequiredMin, cvRequiredNormal: U.cvRequiredNormal,
        cvRequiredMax: U.cvRequiredMax, cvRated: U.cvRated, characteristic: 'equalPercentage',
      }).normalTravelPct,
      maximum_flow_travel_quoted: () => V.travelCheck({
        cvRequiredMin: U.cvRequiredMin, cvRequiredNormal: U.cvRequiredNormal,
        cvRequiredMax: U.cvRequiredMax, cvRated: U.cvRated,
        characteristic: 'equalPercentage', rangeability: U.rangeability,
      }).maxTravelPct,
      minimum_flow_travel_quoted: () => V.travelCheck({
        cvRequiredMin: U.cvRequiredMin, cvRequiredNormal: U.cvRequiredNormal,
        cvRequiredMax: U.cvRequiredMax, cvRated: U.cvRated,
        characteristic: 'equalPercentage', rangeability: U.rangeability,
      }).minTravelPct,
      rangeability_not_logged: () => (1 + (U.cvRequiredNormal / U.cvRated) / U.rangeability) * 100,
    },
  },
  saghara_bottom_course_required_in: {
    truth: () => T.shellCourses(gShellArgs(G.sg)).thickestRequiredIn,
    wrong: {
      one_foot_not_subtracted: () => (2.6 * G.diameterFt * G.liquidLevelFt * G.sg) / G.designStressPsi + G.corrosionAllowanceIn,
      corrosion_allowance_omitted: () => (2.6 * G.diameterFt * headFt * G.sg) / G.designStressPsi,
      test_thickness_quoted: () => T.shellCourses(gShellArgs(G.sg)).courses[0].tTestIn,
      gravity_omitted: () => (2.6 * G.diameterFt * headFt) / G.designStressPsi + G.corrosionAllowanceIn,
      stated_minimum_plate_quoted: () => G.minimumThicknessIn,
    },
  },
  saghara_sg_at_which_test_governs: {
    truth: () => bisect(0.4, 1.4, (g) => T.shellCourses(gShellArgs(g)).governingReason === 'hydrostatic test'),
    wrong: {
      stress_ratio_alone: () => G.designStressPsi / G.testStressPsi,
      stress_ratio_inverted: () => G.testStressPsi / G.designStressPsi,
      design_gravity_quoted: () => G.sg,
      allowance_added_rather_than_subtracted: () => G.designStressPsi / G.testStressPsi
        + (G.corrosionAllowanceIn * G.designStressPsi) / (2.6 * G.diameterFt * headFt),
      allowance_ignored_on_the_crossing: () => G.designStressPsi / G.testStressPsi,
    },
  },
  saghara_inbreathing_scfh: {
    truth: () => gVent.inbreathingScfh,
    wrong: {
      thermal_only: () => gVent.thermal.inbreathingScfh,
      movement_only: () => gVent.movement.inbreathingScfh,
      outbreathing_quoted: () => gVent.outbreathingScfh,
      latitude_factor_omitted: () => gCap.nominalBbl * G.scfhPerBbl + G.drawBblPerHr * gCap.ft3PerBbl,
      barrels_not_converted_to_cubic_feet: () => gVent.thermal.inbreathingScfh + G.drawBblPerHr,
    },
  },
  saghara_vacuum_governing_draw_bblhr: {
    truth: () => bisect(0, 8000, (d) => T.normalVenting(gVentArgs(d)).governing === 'vacuum (inbreathing)'),
    wrong: {
      fill_rate_quoted: () => G.fillBblPerHr,
      stated_draw_quoted: () => G.drawBblPerHr,
      outbreathing_factor_omitted: () => G.fillBblPerHr - gVent.thermal.inbreathingScfh / gCap.ft3PerBbl,
      sign_reversed: () => G.fillBblPerHr + (1 - G.lowVolatilityOutFactor) * gVent.thermal.inbreathingScfh / gCap.ft3PerBbl,
      thermal_balance_alone: () => (1 - G.lowVolatilityOutFactor) * gVent.thermal.inbreathingScfh / gCap.ft3PerBbl,
    },
  },
  saghara_working_capacity_bbl: {
    truth: () => gCap.workingBbl,
    wrong: {
      nominal_capacity_quoted: () => gCap.nominalBbl,
      cubic_feet_quoted: () => gCap.crossSectionFt2 * G.liquidLevelFt,
      barrel_rounded_to_three_figures: () => (gCap.crossSectionFt2 * G.liquidLevelFt) / 5.61,
      diameter_used_where_the_radius_belongs: () => (Math.PI * G.diameterFt ** 2 * G.liquidLevelFt) / gCap.ft3PerBbl,
      gallons_quoted: () => gCap.workingBbl * 42,
    },
  },
  saghara_recovery_saved_lb_yr: {
    truth: () => T.lossControl({
      uncontrolledLbYr: G.uncontrolledLbYr, controlEfficiencyPct: G.controlEfficiencyPct,
    }).savedLbYr,
    wrong: {
      remaining_quoted: () => T.lossControl({
        uncontrolledLbYr: G.uncontrolledLbYr, controlEfficiencyPct: G.controlEfficiencyPct,
      }).remainingLbYr,
      efficiency_not_divided_by_a_hundred: () => G.uncontrolledLbYr * G.controlEfficiencyPct,
      uncontrolled_quoted: () => G.uncontrolledLbYr,
      short_tons_quoted: () => (G.uncontrolledLbYr * G.controlEfficiencyPct) / 100 / 2000,
    },
  },
};

let totalWrong = 0;
let weak = 0;
let closest = { key: null, name: null, ratio: Infinity };
console.log('field                                    tol        errors  moved  blind  closest miss (tolerances)');
Object.entries(ROUTES).forEach(([key, { truth, wrong }]) => {
  if (!fields[key]) { console.log(`REFUSED: ${key} is not a graded field`); process.exit(2); }
  const tol = fields[key][3];
  const t = truth();
  if (!Number.isFinite(t)) { console.log(`REFUSED: the true value of ${key} did not evaluate`); process.exit(2); }
  if (Math.abs(t - fields[key][2]) > 1e-12 * Math.max(1, Math.abs(t))) {
    console.log(`REFUSED: this sweep's own truth for ${key} is ${t} and fields.json carries ${fields[key][2]}`);
    process.exit(2);
  }
  const moved = []; const blind = [];
  let nearest = Infinity; let nearestName = null;
  Object.entries(wrong).forEach(([name, f]) => {
    totalWrong += 1;
    let got;
    try { got = f(); } catch (e) { got = NaN; }
    const d = Math.abs(got - t);
    if (!Number.isFinite(got) || d > tol) {
      moved.push(name);
      const ratio = Number.isFinite(got) ? d / tol : Infinity;
      if (ratio < nearest) { nearest = ratio; nearestName = name; }
    } else { blind.push(`${name} (off by ${d.toExponential(3)})`); }
  });
  if (nearest < closest.ratio) closest = { key, name: nearestName, ratio: nearest };
  const isWeak = moved.length < 3 || blind.length > 0;
  if (isWeak) weak += 1;
  console.log(`${key.padEnd(40)} ${String(tol).padEnd(10)} ${String(moved.length + blind.length).padStart(6)} ${String(moved.length).padStart(6)} ${String(blind.length).padStart(6)}  ${nearest === Infinity ? 'all infinite' : nearest.toExponential(3)} (${nearestName})${isWeak ? '   WEAK' : ''}`);
  if (blind.length) console.log(`${' '.repeat(41)}BLIND TO: ${blind.join(', ')}`);
});
console.log();
console.log(`routes swept: ${Object.keys(ROUTES).length}  plausible wrong methods aimed at them: ${totalWrong}  WEAK routes: ${weak}`);
console.log(`CLOSEST MISS ACROSS THE WHOLE SWEEP: ${closest.key} via ${closest.name}, ${closest.ratio.toExponential(3)} tolerances away`);
console.log('every truth above was re-derived from the engine in this file and checked against fields.json before it was used');
if (Object.keys(ROUTES).length !== 18 || totalWrong < 54) {
  console.log('REFUSED: a sweep with fewer than three wrong methods a field is not a sweep');
  process.exit(2);
}
if (SLACK !== 1) {
  console.log(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected 18 WEAK routes, got ${weak}.`);
  process.exit(weak === 18 ? 1 : 2);
}
process.exit(weak ? 1 : 0);
