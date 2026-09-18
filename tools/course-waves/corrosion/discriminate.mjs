// THE DISCRIMINATE SWEEP over every FC9 capstone route.
//
// Per the programme rule that a gate which restates the formula validates
// nothing: for each of the eighteen graded fields, does a PLAUSIBLE WRONG
// METHOD actually move it past its own tolerance? A field no plausible error
// moves is a field that grades nothing, whatever the prompt claims it tests.
//
// A route is WEAK if fewer than three of the plausible errors aimed at it move
// it, or if any error aimed at it is BLIND, meaning it lands inside the
// tolerance. The CLOSEST MISS is reported in tolerances, so "it discriminates"
// arrives with a margin beside it rather than as a claim.
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

const HERE = process.env.FC9_WAVE_DIR || '/root/fc-wip-corrosion';
const ROOT = process.env.FC9_ENGINES || '/root/wt-fc9-nextgen/packages/engines';
const C = await import(`${ROOT}/engines/facilities/corrosion.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e9 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The three scenarios, restated here from the generator's own frozen objects by
   reading its SOURCE, so this file cannot drift from the capstone by carrying a
   second typed copy of any condition. */
const SRC = fs.readFileSync(`${HERE}/fc9_capstone.mjs`, 'utf8');
const scenario = (name) => {
  const m = SRC.match(new RegExp(`const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
  if (!m) { console.log(`REFUSED: cannot read the ${name} scenario out of fc9_capstone.mjs`); process.exit(2); }
  const o = {};
  [...m[1].matchAll(/(\w+):\s*(-?[\d.]+)\s*,/g)].forEach((f) => { o[f[1]] = Number(f[2]); });
  const s = m[1].match(/flowRegime:\s*'(\w+)'/);
  if (s) o.flowRegime = s[1];
  return o;
};
const O = scenario('OBIGBO');
const N = scenario('NEMBE');
const S = scenario('SOKU');

const nCommon = {
  tC: N.tC, pTotalBar: N.pTotalBar, co2MolFrac: N.co2MolFrac, ph: N.ph,
  velocityMS: N.velocityMS, diameterM: N.diameterM, flowRegime: 'waterWet',
};
const sCommon = {
  tC: S.tC, pTotalBar: S.pTotalBar, co2MolFrac: S.co2MolFrac, ph: S.ph,
  velocityMS: S.velocityMS, diameterM: S.diameterM, flowRegime: 'waterWet',
};
const retainedAt = (common, eff, avail) => {
  const r = C.corrosionRate({ ...common, inhibitorEfficiencyPct: eff, inhibitorAvailabilityPct: avail });
  return r.rateMmYr / r.uninhibitedMmYr;
};
const bisect = (lo, hi, pred) => {
  let a = lo; let b = hi;
  if (pred(a) === pred(b)) return NaN;
  const pa = pred(a);
  for (let i = 0; i < 300; i += 1) {
    const m = (a + b) / 2;
    if (pred(m) === pa) a = m; else b = m;
    if (Math.abs(b - a) <= Math.abs(b) * 1e-15) break;
  }
  return (a + b) / 2;
};

const nRetained = retainedAt(nCommon, N.inhibitorEfficiencyPct, N.inhibitorAvailabilityPct);
const nRate = N.surveyedUninhibitedMmYr * nRetained;
const nBase = { corrosionAllowanceMm: N.corrosionAllowanceMm, consumedMm: N.consumedMm, designLifeYears: N.designLifeYears };
const nRemaining = N.corrosionAllowanceMm - N.consumedMm;
const sRetained = retainedAt(sCommon, S.inhibitorEfficiencyPct, S.inhibitorAvailabilityPct);
const sRate = S.surveyedUninhibitedMmYr * sRetained;
const sBase = { corrosionAllowanceMm: S.corrosionAllowanceMm, consumedMm: S.consumedMm, designLifeYears: S.designLifeYears };
const sRemaining = S.corrosionAllowanceMm - S.consumedMm;

/**
 * Each entry: the true value, and a set of named plausible WRONG METHODS, each a
 * function returning the value that error would produce. Every wrong method is a
 * mistake a competent learner could actually make on this route, and several are
 * mistakes the LIVE APP invited before the FC9-0 repair.
 */
const ROUTES = {
  obigbo_co2_partial_pressure_bar: {
    truth: () => C.co2Fugacity({ tC: O.tC, pTotalBar: O.pTotalBar, co2MolFrac: O.co2MolFrac }).pco2Bar,
    wrong: {
      fugacity_quoted_instead: () => C.co2Fugacity({ tC: O.tC, pTotalBar: O.pTotalBar, co2MolFrac: O.co2MolFrac }).fco2Bar,
      mole_percent_not_converted: () => O.pTotalBar * (O.co2MolFrac * 100),
      h2s_fraction_used: () => O.pTotalBar * O.h2sMolFrac,
      total_pressure_quoted: () => O.pTotalBar,
      gauge_pressure_used: () => (O.pTotalBar - 1.01325) * O.co2MolFrac,
      psia_not_bar: () => O.pTotalBar * O.co2MolFrac * C.BAR_TO_PSIA,
    },
  },
  obigbo_h2s_partial_pressure_psia: {
    truth: () => C.sourServiceScreen({ ph2sBar: O.pTotalBar * O.h2sMolFrac }).ph2sPsia,
    wrong: {
      left_in_bar: () => O.pTotalBar * O.h2sMolFrac,
      truncated_factor_14p5038: () => O.pTotalBar * O.h2sMolFrac * 14.5038,
      rounded_factor_14p5: () => O.pTotalBar * O.h2sMolFrac * 14.5,
      co2_fraction_used: () => O.pTotalBar * O.co2MolFrac * C.BAR_TO_PSIA,
      divided_not_multiplied: () => (O.pTotalBar * O.h2sMolFrac) / C.BAR_TO_PSIA,
      threshold_quoted_instead: () => C.SOUR_THRESHOLD_PSIA,
    },
  },
  obigbo_h2s_to_co2_mole_ratio: {
    truth: () => C.corrosionRegime({
      ph2sBar: O.pTotalBar * O.h2sMolFrac,
      pco2Bar: C.co2Fugacity({ tC: O.tC, pTotalBar: O.pTotalBar, co2MolFrac: O.co2MolFrac }).pco2Bar,
    }).ratio,
    wrong: {
      inverted_co2_over_h2s: () => O.co2MolFrac / O.h2sMolFrac,
      built_on_the_fugacity: () => (O.pTotalBar * O.h2sMolFrac)
        / C.co2Fugacity({ tC: O.tC, pTotalBar: O.pTotalBar, co2MolFrac: O.co2MolFrac }).fco2Bar,
      ph2s_taken_as_total_pressure: () => O.pTotalBar / (O.pTotalBar * O.co2MolFrac),
      carbonate_boundary_quoted: () => C.REGIME_CARBONATE_MAX,
      mixed_boundary_quoted: () => C.REGIME_MIXED_MAX,
      expressed_as_a_percentage: () => (O.h2sMolFrac / O.co2MolFrac) * 100,
    },
  },
  obigbo_reynolds_number: {
    truth: () => C.wallShearStressPa({
      velocityMS: O.velocityMS, diameterM: O.diameterM, densityKgM3: O.densityKgM3, viscosityPaS: O.viscosityPaS,
    }).reynolds,
    wrong: {
      viscosity_left_in_centipoise: () => (O.densityKgM3 * O.velocityMS * O.diameterM) / (O.viscosityPaS * 1000),
      radius_used_for_diameter: () => (O.densityKgM3 * O.velocityMS * (O.diameterM / 2)) / O.viscosityPaS,
      kinematic_form_with_density_twice: () => (O.densityKgM3 * O.densityKgM3 * O.velocityMS * O.diameterM) / O.viscosityPaS,
      diameter_left_in_inches: () => (O.densityKgM3 * O.velocityMS * (O.diameterM / 0.0254)) / O.viscosityPaS,
      velocity_left_in_feet_per_second: () => (O.densityKgM3 * (O.velocityMS / 0.3048) * O.diameterM) / O.viscosityPaS,
      switch_value_quoted: () => C.SHEAR_SWITCH_RE,
    },
  },
  obigbo_effective_inhibition_pct: {
    truth: () => C.corrosionRate(O).effectiveInhibitionPct,
    wrong: {
      datasheet_efficiency_quoted: () => O.inhibitorEfficiencyPct,
      availability_quoted: () => O.inhibitorAvailabilityPct,
      efficiency_plus_availability_minus_100: () => O.inhibitorEfficiencyPct + O.inhibitorAvailabilityPct - 100,
      unavailable_time_only: () => (100 - O.inhibitorAvailabilityPct) * (O.inhibitorEfficiencyPct / 100),
      averaged_not_multiplied: () => (O.inhibitorEfficiencyPct + O.inhibitorAvailabilityPct) / 2,
      old_eff_gt_0p9_guard_returning_zero: () => 0,
    },
  },
  obigbo_metal_loss_ratio_vs_datasheet: {
    truth: () => C.corrosionRate(O).rateMmYr / C.corrosionRate({ ...O, inhibitorAvailabilityPct: 100 }).rateMmYr,
    wrong: {
      taken_against_the_uninhibited_rate: () => C.corrosionRate(O).rateMmYr / C.corrosionRate({ ...O, inhibitorEfficiencyPct: 0 }).rateMmYr,
      inverted: () => C.corrosionRate({ ...O, inhibitorAvailabilityPct: 100 }).rateMmYr / C.corrosionRate(O).rateMmYr,
      read_as_the_percentage_point_gap: () => O.inhibitorEfficiencyPct - (O.inhibitorEfficiencyPct * O.inhibitorAvailabilityPct) / 100,
      efficiency_ratio_only: () => O.inhibitorEfficiencyPct / O.inhibitorAvailabilityPct,
      availability_taken_as_the_ratio: () => 100 / O.inhibitorAvailabilityPct,
      retained_fraction_quoted_instead: () => 1 - (O.inhibitorAvailabilityPct / 100) * (O.inhibitorEfficiencyPct / 100),
    },
  },
  nembe_retained_metal_loss_fraction: {
    truth: () => nRetained,
    wrong: {
      one_minus_efficiency_only: () => 1 - N.inhibitorEfficiencyPct / 100,
      one_minus_availability_only: () => 1 - N.inhibitorAvailabilityPct / 100,
      product_of_the_two_complements: () => (1 - N.inhibitorEfficiencyPct / 100) * (1 - N.inhibitorAvailabilityPct / 100),
      effective_protection_quoted: () => (N.inhibitorEfficiencyPct * N.inhibitorAvailabilityPct) / 10000,
      availability_only: () => N.inhibitorAvailabilityPct / 100,
      efficiency_only: () => N.inhibitorEfficiencyPct / 100,
    },
  },
  nembe_inhibitor_shortfall_pp: {
    truth: () => C.corrosionRate({
      ...nCommon, inhibitorEfficiencyPct: N.inhibitorEfficiencyPct, inhibitorAvailabilityPct: N.inhibitorAvailabilityPct,
    }).inhibitorShortfallPp,
    wrong: {
      availability_gap_quoted: () => 100 - N.inhibitorAvailabilityPct,
      read_as_a_relative_percentage: () => ((N.inhibitorEfficiencyPct - (N.inhibitorEfficiencyPct * N.inhibitorAvailabilityPct) / 100) / N.inhibitorEfficiencyPct) * 100,
      effective_protection_quoted: () => (N.inhibitorEfficiencyPct * N.inhibitorAvailabilityPct) / 100,
      sign_inverted: () => (N.inhibitorEfficiencyPct * N.inhibitorAvailabilityPct) / 100 - N.inhibitorEfficiencyPct,
      efficiency_minus_availability: () => N.inhibitorEfficiencyPct - N.inhibitorAvailabilityPct,
      the_declared_shortfall_trigger: () => C.INHIBITOR_SHORTFALL_PP,
    },
  },
  nembe_inhibited_rate_mmyr: {
    truth: () => nRate,
    wrong: {
      surveyed_rate_quoted_unchanged: () => N.surveyedUninhibitedMmYr,
      datasheet_efficiency_applied: () => N.surveyedUninhibitedMmYr * (1 - N.inhibitorEfficiencyPct / 100),
      availability_applied_alone: () => N.surveyedUninhibitedMmYr * (1 - N.inhibitorAvailabilityPct / 100),
      effective_protection_applied_as_a_rate: () => N.surveyedUninhibitedMmYr * ((N.inhibitorEfficiencyPct * N.inhibitorAvailabilityPct) / 10000),
      correlation_rate_used_instead: () => C.corrosionRate({
        ...nCommon, inhibitorEfficiencyPct: N.inhibitorEfficiencyPct, inhibitorAvailabilityPct: N.inhibitorAvailabilityPct,
      }).rateMmYr,
      converted_to_mpy: () => (nRate / 25.4) * 1000,
    },
  },
  nembe_remaining_life_yr: {
    truth: () => C.remainingLife({ ...nBase, rateMmYr: nRate }).remainingYears,
    wrong: {
      full_allowance_not_the_remainder: () => N.corrosionAllowanceMm / nRate,
      consumed_added_not_subtracted: () => (N.corrosionAllowanceMm + N.consumedMm) / nRate,
      surveyed_rate_used: () => nRemaining / N.surveyedUninhibitedMmYr,
      datasheet_rate_used: () => nRemaining / (N.surveyedUninhibitedMmYr * (1 - N.inhibitorEfficiencyPct / 100)),
      design_life_quoted: () => N.designLifeYears,
      allowance_in_inches_forgotten: () => (nRemaining / 25.4) / nRate,
    },
  },
  nembe_required_allowance_mm: {
    truth: () => C.remainingLife({ ...nBase, rateMmYr: nRate }).requiredAllowanceMm,
    wrong: {
      consumed_included: () => nRate * N.designLifeYears + N.consumedMm,
      remaining_life_used_not_design_life: () => nRate * C.remainingLife({ ...nBase, rateMmYr: nRate }).remainingYears,
      surveyed_rate_used: () => N.surveyedUninhibitedMmYr * N.designLifeYears,
      remaining_allowance_quoted: () => nRemaining,
      shortfall_quoted_instead: () => C.remainingLife({ ...nBase, rateMmYr: nRate }).shortfallMm,
      expressed_in_inches: () => (nRate * N.designLifeYears) / 25.4,
    },
  },
  nembe_life_lost_to_availability_yr: {
    truth: () => C.remainingLife({ ...nBase, rateMmYr: N.surveyedUninhibitedMmYr * retainedAt(nCommon, N.inhibitorEfficiencyPct, 100) }).remainingYears
      - C.remainingLife({ ...nBase, rateMmYr: nRate }).remainingYears,
    wrong: {
      sign_inverted: () => C.remainingLife({ ...nBase, rateMmYr: nRate }).remainingYears
        - C.remainingLife({ ...nBase, rateMmYr: N.surveyedUninhibitedMmYr * retainedAt(nCommon, N.inhibitorEfficiencyPct, 100) }).remainingYears,
      measured_against_no_inhibitor_at_all: () => nRemaining / N.surveyedUninhibitedMmYr
        - C.remainingLife({ ...nBase, rateMmYr: nRate }).remainingYears,
      taken_as_a_ratio_of_lives: () => C.remainingLife({ ...nBase, rateMmYr: N.surveyedUninhibitedMmYr * retainedAt(nCommon, N.inhibitorEfficiencyPct, 100) }).remainingYears
        / C.remainingLife({ ...nBase, rateMmYr: nRate }).remainingYears,
      datasheet_life_quoted_alone: () => C.remainingLife({ ...nBase, rateMmYr: N.surveyedUninhibitedMmYr * retainedAt(nCommon, N.inhibitorEfficiencyPct, 100) }).remainingYears,
      availability_gap_times_design_life: () => ((100 - N.inhibitorAvailabilityPct) / 100) * N.designLifeYears,
      full_allowance_used_on_both_sides: () => N.corrosionAllowanceMm / (N.surveyedUninhibitedMmYr * retainedAt(nCommon, N.inhibitorEfficiencyPct, 100))
        - N.corrosionAllowanceMm / nRate,
    },
  },
  soku_tolerable_rate_mmyr: {
    truth: () => bisect(1e-6, 5, (r) => C.remainingLife({ ...sBase, rateMmYr: r }).meetsDesignLife === true),
    wrong: {
      full_allowance_used: () => S.corrosionAllowanceMm / S.designLifeYears,
      consumed_added: () => (S.corrosionAllowanceMm + S.consumedMm) / S.designLifeYears,
      design_life_inverted: () => sRemaining * S.designLifeYears,
      effective_rate_quoted: () => sRate,
      low_category_band_quoted: () => C.RATE_CATEGORY_BANDS.low,
      expressed_in_mpy: () => (sRemaining / S.designLifeYears / 25.4) * 1000,
    },
  },
  soku_required_availability_pct: {
    truth: () => bisect(1, 100, (a) => C.corrosionRate({
      ...sCommon, inhibitorEfficiencyPct: S.inhibitorEfficiencyPct, inhibitorAvailabilityPct: a,
    }).effectiveInhibitionPct >= S.targetEffectiveProtectionPct),
    wrong: {
      target_quoted_directly: () => S.targetEffectiveProtectionPct,
      efficiency_over_target: () => (S.inhibitorEfficiencyPct / S.targetEffectiveProtectionPct) * 100,
      target_minus_efficiency_from_100: () => 100 - (S.inhibitorEfficiencyPct - S.targetEffectiveProtectionPct),
      current_availability_quoted: () => S.inhibitorAvailabilityPct,
      retained_form_inverted: () => (1 - S.targetEffectiveProtectionPct / 100) / (S.inhibitorEfficiencyPct / 100) * 100,
      sum_read_as_the_requirement: () => S.targetEffectiveProtectionPct + (100 - S.inhibitorEfficiencyPct),
    },
  },
  soku_availability_for_design_life_pct: {
    truth: () => bisect(1, 100, (a) => {
      const retained = retainedAt(sCommon, S.inhibitorEfficiencyPct, a);
      return C.remainingLife({ ...sBase, rateMmYr: S.surveyedUninhibitedMmYr * retained }).meetsDesignLife === true;
    }),
    wrong: {
      target_protection_answer_reused: () => bisect(1, 100, (a) => C.corrosionRate({
        ...sCommon, inhibitorEfficiencyPct: S.inhibitorEfficiencyPct, inhibitorAvailabilityPct: a,
      }).effectiveInhibitionPct >= S.targetEffectiveProtectionPct),
      full_allowance_used_in_the_target: () => bisect(1, 100, (a) => {
        const retained = retainedAt(sCommon, S.inhibitorEfficiencyPct, a);
        return C.remainingLife({ ...sBase, consumedMm: 0, rateMmYr: S.surveyedUninhibitedMmYr * retained }).meetsDesignLife === true;
      }),
      efficiency_solved_instead_of_availability: () => bisect(1, 100, (e) => {
        const retained = retainedAt(sCommon, e, S.inhibitorAvailabilityPct);
        return C.remainingLife({ ...sBase, rateMmYr: S.surveyedUninhibitedMmYr * retained }).meetsDesignLife === true;
      }),
      retained_read_as_the_availability: () => (sRemaining / S.designLifeYears / S.surveyedUninhibitedMmYr) * 100,
      current_availability_quoted: () => S.inhibitorAvailabilityPct,
      hundred_percent_assumed_enough: () => 100,
    },
  },
  soku_allowance_to_reinstate_mm: {
    truth: () => bisect(2, 40, (ca) => C.remainingLife({ ...sBase, corrosionAllowanceMm: ca, rateMmYr: sRate }).meetsDesignLife === true),
    wrong: {
      required_allowance_field_quoted: () => C.remainingLife({ ...sBase, rateMmYr: sRate }).requiredAllowanceMm,
      shortfall_quoted: () => C.remainingLife({ ...sBase, rateMmYr: sRate }).shortfallMm,
      consumed_subtracted_not_added: () => sRate * S.designLifeYears - S.consumedMm,
      surveyed_rate_used: () => S.surveyedUninhibitedMmYr * S.designLifeYears + S.consumedMm,
      existing_allowance_quoted: () => S.corrosionAllowanceMm,
      expressed_in_inches: () => (sRate * S.designLifeYears + S.consumedMm) / 25.4,
    },
  },
  soku_stripped_film_life_yr: {
    truth: () => C.remainingLife({ ...sBase, rateMmYr: S.surveyedUninhibitedMmYr }).remainingYears,
    wrong: {
      credited_life_quoted: () => C.remainingLife({ ...sBase, rateMmYr: sRate }).remainingYears,
      full_allowance_used: () => S.corrosionAllowanceMm / S.surveyedUninhibitedMmYr,
      datasheet_efficiency_still_applied: () => sRemaining / (S.surveyedUninhibitedMmYr * (1 - S.inhibitorEfficiencyPct / 100)),
      design_life_quoted: () => S.designLifeYears,
      rate_and_allowance_inverted: () => S.surveyedUninhibitedMmYr / sRemaining,
      expressed_in_months: () => (sRemaining / S.surveyedUninhibitedMmYr) * 12,
    },
  },
  soku_film_credit_life_ratio: {
    truth: () => C.remainingLife({ ...sBase, rateMmYr: sRate }).remainingYears
      / C.remainingLife({ ...sBase, rateMmYr: S.surveyedUninhibitedMmYr }).remainingYears,
    wrong: {
      inverted: () => C.remainingLife({ ...sBase, rateMmYr: S.surveyedUninhibitedMmYr }).remainingYears
        / C.remainingLife({ ...sBase, rateMmYr: sRate }).remainingYears,
      taken_as_a_difference: () => C.remainingLife({ ...sBase, rateMmYr: sRate }).remainingYears
        - C.remainingLife({ ...sBase, rateMmYr: S.surveyedUninhibitedMmYr }).remainingYears,
      datasheet_efficiency_used_as_the_credit: () => 1 / (1 - S.inhibitorEfficiencyPct / 100),
      effective_protection_read_as_the_ratio: () => (S.inhibitorEfficiencyPct * S.inhibitorAvailabilityPct) / 100,
      efficiency_read_as_the_ratio: () => S.inhibitorEfficiencyPct / 100,
      expressed_as_a_percentage: () => (1 / sRetained) * 100,
    },
  },
};

let totalWrong = 0;
let weak = 0;
let closest = { key: null, name: null, ratio: Infinity };
console.log('field                                 tol        errors  moved  blind  closest miss (tolerances)');
Object.entries(ROUTES).forEach(([key, { truth, wrong }]) => {
  if (!fields[key]) { console.log(`REFUSED: ${key} is not a graded field`); process.exit(2); }
  const tol = fields[key][3];
  const t = truth();
  if (!Number.isFinite(t)) { console.log(`REFUSED: the true value of ${key} did not evaluate`); process.exit(2); }
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
  console.log(`${key.padEnd(37)} ${String(tol).padEnd(10)} ${String(moved.length + blind.length).padStart(6)} ${String(moved.length).padStart(6)} ${String(blind.length).padStart(6)}  ${nearest === Infinity ? 'all infinite' : nearest.toExponential(3)} (${nearestName})${isWeak ? '   WEAK' : ''}`);
  if (blind.length) console.log(`${' '.repeat(38)}BLIND TO: ${blind.join(', ')}`);
});
console.log();
console.log(`routes swept: ${Object.keys(ROUTES).length}  plausible wrong methods aimed at them: ${totalWrong}  WEAK routes: ${weak}`);
console.log(`CLOSEST MISS ACROSS THE WHOLE SWEEP: ${closest.key} via ${closest.name}, ${closest.ratio.toExponential(3)} tolerances away`);
if (Object.keys(ROUTES).length !== 18 || totalWrong < 54) {
  console.log('REFUSED: a sweep with fewer than three wrong methods a field is not a sweep');
  process.exit(2);
}
if (SLACK !== 1) {
  console.log(`NEGATIVE CONTROL: tolerances multiplied by ${SLACK}. Expected 18 WEAK routes, got ${weak}.`);
  process.exit(weak === 18 ? 1 : 2);
}
process.exit(weak ? 1 : 0);
