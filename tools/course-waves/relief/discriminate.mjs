// THE DISCRIMINATE SWEEP over every FC5 capstone route.
//
// Per the programme rule that a gate which restates the formula validates
// nothing: for each of the eighteen graded fields, does a PLAUSIBLE WRONG
// METHOD actually move it past its own tolerance? A field no plausible error
// moves is a field that grades nothing, whatever the prompt claims it tests.
//
// A route is WEAK if fewer than three of the plausible errors aimed at it move
// it, or if any error aimed at it moves it by less than the tolerance. The
// CLOSEST MISS is reported in tolerances, so "it discriminates" arrives with a
// margin beside it rather than as a claim.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//
// The control multiplies every tolerance by 1e9 and must report EIGHTEEN WEAK
// ROUTES, because at that width no plausible error moves anything. It proves
// the sweep is reading the tolerances rather than reporting a constant.
//
// Exit 0 clean, 1 if any route is WEAK, 2 if the sweep could not run.
import fs from 'fs';
import {
  KOLO_CREEK_GAS, KOLO_CREEK_GAS_SUBCRITICAL, KOLO_CREEK_LIQUID, KOLO_CREEK_STEAM,
  OGBAINBIRI_VESSEL, OGBAINBIRI_TOWER, OGBAINBIRI_DRUM, OGBAINBIRI_DRUM_WIDER,
  GBARAN_BLOWDOWN, GBARAN_FLARE,
} from '/root/fc-wip-relief/fc5_fields_capstone.mjs';

const ROOT = process.env.FC5_ENGINES || '/root/wt-fc5-nextgen/packages/engines';
const R = await import(`${ROOT}/engines/facilities/relief.js`);
const ATM = 14.7;
const RK = 459.67;
const SLACK = process.argv.includes('--slack-tolerances') ? 1e9 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync('/root/fc-wip-relief/fields.json', 'utf8')).map((f) => [f[1], [f[0], f[1], f[2], f[3] * SLACK]]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

const gasP1 = (o) => o.setPsig * (1 + o.overpressurePct / 100) + ATM;
const gasCall = (o) => ({
  wLbHr: o.wLbHr, p1Psia: gasP1(o), p2Psia: o.backPsia, tR: o.tF + RK,
  mw: o.mw, z: o.z, k: o.k, kd: o.kd, kb: o.kb, kc: o.kc,
});
const liqCall = (o) => ({
  qGpm: o.qGpm, p1Psig: o.setPsig * (1 + o.overpressurePct / 100), p2Psig: o.backPsig,
  sg: o.sg, muCp: o.muCp, kd: o.kd, kw: o.kw, kc: o.kc,
});
const steamCall = (o) => ({
  wLbHr: o.wLbHr, p1Psia: o.setPsig * (1 + o.overpressurePct / 100) + ATM,
  kd: o.kd, kb: o.kb, kc: o.kc, ksh: o.ksh,
});

/**
 * Each entry: the true value, and a set of named plausible WRONG METHODS, each
 * a function returning the value that error would produce. Every wrong method
 * is a mistake a competent learner could actually make on this route.
 */
const ROUTES = {
  kolocreek_critical_pressure_ratio: {
    truth: () => R.criticalPressureRatio(KOLO_CREEK_GAS.k),
    wrong: {
      k_of_air_assumed: () => R.criticalPressureRatio(1.4),
      k_read_as_1_2: () => R.criticalPressureRatio(1.2),
      exponent_inverted: () => (2 / (KOLO_CREEK_GAS.k + 1)) ** ((KOLO_CREEK_GAS.k - 1) / KOLO_CREEK_GAS.k),
      ratio_taken_as_back_over_set: () => KOLO_CREEK_GAS.backPsia / gasP1(KOLO_CREEK_GAS),
      two_over_k_plus_one_alone: () => 2 / (KOLO_CREEK_GAS.k + 1),
      subcritical_f2_quoted_instead: () => R.subcriticalF2({ k: KOLO_CREEK_GAS.k, r: 0.8 }),
    },
  },
  kolocreek_gas_coefficient_c: {
    truth: () => R.gasConstantC(KOLO_CREEK_GAS.k),
    wrong: {
      k_of_air_assumed: () => R.gasConstantC(1.4),
      k_read_as_1_2: () => R.gasConstantC(1.2),
      leading_constant_taken_as_735: () => 735 * (R.gasConstantC(KOLO_CREEK_GAS.k) / 520),
      bracket_not_rooted: () => 520 * (KOLO_CREEK_GAS.k * (2 / (KOLO_CREEK_GAS.k + 1)) ** ((KOLO_CREEK_GAS.k + 1) / (KOLO_CREEK_GAS.k - 1))),
      exponent_off_by_one: () => 520 * Math.sqrt(KOLO_CREEK_GAS.k * (2 / (KOLO_CREEK_GAS.k + 1)) ** (KOLO_CREEK_GAS.k / (KOLO_CREEK_GAS.k - 1))),
    },
  },
  kolocreek_gas_critical_area_in2: {
    truth: () => R.gasVaporArea(gasCall(KOLO_CREEK_GAS)).areaIn2,
    wrong: {
      set_pressure_used_as_relieving: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS), p1Psia: KOLO_CREEK_GAS.setPsig }).areaIn2,
      overpressure_left_off: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS), p1Psia: KOLO_CREEK_GAS.setPsig + ATM }).areaIn2,
      atmospheric_not_added: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS), p1Psia: gasP1(KOLO_CREEK_GAS) - ATM }).areaIn2,
      temperature_left_in_degf: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS), tR: KOLO_CREEK_GAS.tF }).areaIn2,
      compressibility_taken_as_one: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS), z: 1 }).areaIn2,
      k_of_air_assumed: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS), k: 1.4 }).areaIn2,
      discharge_coefficient_left_at_one: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS), kd: 1.0 }).areaIn2,
      subcritical_form_used: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS), p2Psia: KOLO_CREEK_GAS_SUBCRITICAL.backPsia }).areaIn2,
    },
  },
  kolocreek_gas_subcritical_area_in2: {
    truth: () => R.gasVaporArea(gasCall(KOLO_CREEK_GAS_SUBCRITICAL)).areaIn2,
    wrong: {
      critical_form_used: () => R.gasVaporArea(gasCall(KOLO_CREEK_GAS)).areaIn2,
      back_pressure_left_at_atmospheric: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS_SUBCRITICAL), p2Psia: ATM }).areaIn2,
      temperature_left_in_degf: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS_SUBCRITICAL), tR: KOLO_CREEK_GAS.tF }).areaIn2,
      compressibility_taken_as_one: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS_SUBCRITICAL), z: 1 }).areaIn2,
      k_of_air_assumed: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS_SUBCRITICAL), k: 1.4 }).areaIn2,
      discharge_coefficient_left_at_one: () => R.gasVaporArea({ ...gasCall(KOLO_CREEK_GAS_SUBCRITICAL), kd: 1.0 }).areaIn2,
    },
  },
  kolocreek_liquid_area_in2: {
    truth: () => R.liquidArea(liqCall(KOLO_CREEK_LIQUID)).areaIn2,
    wrong: {
      overpressure_left_off: () => R.liquidArea({ ...liqCall(KOLO_CREEK_LIQUID), p1Psig: KOLO_CREEK_LIQUID.setPsig }).areaIn2,
      back_pressure_ignored: () => R.liquidArea({ ...liqCall(KOLO_CREEK_LIQUID), p2Psig: 0 }).areaIn2,
      specific_gravity_left_at_one: () => R.liquidArea({ ...liqCall(KOLO_CREEK_LIQUID), sg: 1 }).areaIn2,
      gravity_not_rooted: () => R.liquidArea({ ...liqCall(KOLO_CREEK_LIQUID), sg: KOLO_CREEK_LIQUID.sg ** 2 }).areaIn2,
      discharge_coefficient_left_at_gas_value: () => R.liquidArea({ ...liqCall(KOLO_CREEK_LIQUID), kd: 0.975 }).areaIn2,
      a_viscosity_assumed: () => R.liquidArea({ ...liqCall(KOLO_CREEK_LIQUID), muCp: 50 }).areaIn2,
    },
    equivalent: {
      // The liquid route works on the DIFFERENCE of two gauge pressures, so
      // converting BOTH to absolute cannot move the answer. That is a property
      // of the route rather than a weakness, and the sweep asserts it stays
      // true: if this ever started moving the answer, the route would have
      // acquired an absolute pressure it has no business carrying.
      both_pressures_read_as_absolute: () => R.liquidArea({ ...liqCall(KOLO_CREEK_LIQUID), p1Psig: liqCall(KOLO_CREEK_LIQUID).p1Psig + ATM, p2Psig: KOLO_CREEK_LIQUID.backPsig + ATM }).areaIn2,
    },
  },
  kolocreek_steam_area_in2: {
    truth: () => R.steamArea(steamCall(KOLO_CREEK_STEAM)).areaIn2,
    wrong: {
      overpressure_left_off: () => R.steamArea({ ...steamCall(KOLO_CREEK_STEAM), p1Psia: KOLO_CREEK_STEAM.setPsig + ATM }).areaIn2,
      atmospheric_not_added: () => R.steamArea({ ...steamCall(KOLO_CREEK_STEAM), p1Psia: steamCall(KOLO_CREEK_STEAM).p1Psia - ATM }).areaIn2,
      discharge_coefficient_left_at_one: () => R.steamArea({ ...steamCall(KOLO_CREEK_STEAM), kd: 1.0 }).areaIn2,
      superheat_factor_assumed: () => R.steamArea({ ...steamCall(KOLO_CREEK_STEAM), ksh: 0.83 }).areaIn2,
      napier_applied_anyway: () => steamCall(KOLO_CREEK_STEAM).wLbHr / (51.5 * steamCall(KOLO_CREEK_STEAM).p1Psia * 0.975 * R.steamKn(2014.7)),
      gas_route_used: () => R.gasVaporArea({ wLbHr: KOLO_CREEK_STEAM.wLbHr, p1Psia: steamCall(KOLO_CREEK_STEAM).p1Psia, p2Psia: ATM, tR: 860, mw: 18.015, z: 1, k: 1.3 }).areaIn2,
    },
  },
  ogbainbiri_wetted_area_ft2: {
    truth: () => R.wettedAreaFt2(OGBAINBIRI_VESSEL).areaFt2,
    wrong: {
      read_standing_up: () => R.wettedAreaFt2({ ...OGBAINBIRI_VESSEL, orientation: 'vertical' }).areaFt2,
      half_full_assumed: () => R.wettedAreaFt2({ ...OGBAINBIRI_VESSEL, liquidLevelFt: OGBAINBIRI_VESSEL.diameterFt / 2 }).areaFt2,
      whole_shell_taken: () => Math.PI * OGBAINBIRI_VESSEL.diameterFt * OGBAINBIRI_VESSEL.lengthFt,
      chord_times_length: () => 2 * Math.sqrt(OGBAINBIRI_VESSEL.liquidLevelFt * (OGBAINBIRI_VESSEL.diameterFt - OGBAINBIRI_VESSEL.liquidLevelFt)) * OGBAINBIRI_VESSEL.lengthFt,
      radius_used_as_diameter: () => R.wettedAreaFt2({ ...OGBAINBIRI_VESSEL, diameterFt: OGBAINBIRI_VESSEL.diameterFt / 2 }).areaFt2,
      level_read_as_a_fraction: () => R.wettedAreaFt2({ ...OGBAINBIRI_VESSEL, liquidLevelFt: OGBAINBIRI_VESSEL.liquidLevelFt / OGBAINBIRI_VESSEL.diameterFt }).areaFt2,
    },
  },
  ogbainbiri_tower_wetted_area_ft2: {
    truth: () => R.wettedAreaFt2(OGBAINBIRI_TOWER).areaFt2,
    wrong: {
      read_lying_down: () => R.wettedAreaFt2({ ...OGBAINBIRI_TOWER, orientation: 'horizontal' }).areaFt2,
      whole_height_wetted: () => R.wettedAreaFt2({ ...OGBAINBIRI_TOWER, liquidLevelFt: OGBAINBIRI_TOWER.lengthFt }).areaFt2,
      radius_used_as_diameter: () => R.wettedAreaFt2({ ...OGBAINBIRI_TOWER, diameterFt: OGBAINBIRI_TOWER.diameterFt / 2 }).areaFt2,
      truncated_at_25_ft_wrongly: () => Math.PI * OGBAINBIRI_TOWER.diameterFt * 25,
      cross_section_added: () => R.wettedAreaFt2(OGBAINBIRI_TOWER).areaFt2 + (Math.PI * OGBAINBIRI_TOWER.diameterFt ** 2) / 4,
    },
  },
  ogbainbiri_liquid_area_fraction: {
    truth: () => R.segmentAreaFraction(OGBAINBIRI_DRUM.liquidFraction),
    wrong: {
      depth_fraction_quoted_directly: () => OGBAINBIRI_DRUM.liquidFraction,
      vapour_fraction_quoted: () => 1 - R.segmentAreaFraction(OGBAINBIRI_DRUM.liquidFraction),
      half_assumed: () => 0.5,
      segment_without_the_sine: () => (2 * Math.acos(1 - 2 * OGBAINBIRI_DRUM.liquidFraction)) / (2 * Math.PI),
      angle_not_doubled: () => { const th = Math.acos(1 - 2 * OGBAINBIRI_DRUM.liquidFraction); return (th - Math.sin(th)) / (2 * Math.PI); },
    },
  },
  ogbainbiri_vapor_velocity_fts: {
    truth: () => R.koDrumHorizontal(OGBAINBIRI_DRUM).vVaporFtS,
    wrong: {
      whole_cross_section_used: () => OGBAINBIRI_DRUM.qVaporAcfs / ((Math.PI * OGBAINBIRI_DRUM.diameterFt ** 2) / 4),
      depth_fraction_used_as_area_fraction: () => OGBAINBIRI_DRUM.qVaporAcfs / (((Math.PI * OGBAINBIRI_DRUM.diameterFt ** 2) / 4) * (1 - OGBAINBIRI_DRUM.liquidFraction)),
      drum_read_at_the_wider_diameter: () => R.koDrumHorizontal(OGBAINBIRI_DRUM_WIDER).vVaporFtS,
      holdup_left_at_the_default: () => R.koDrumHorizontal({ ...OGBAINBIRI_DRUM, liquidFraction: 0.25 }).vVaporFtS,
      radius_used_as_diameter: () => R.koDrumHorizontal({ ...OGBAINBIRI_DRUM, diameterFt: OGBAINBIRI_DRUM.diameterFt / 2 }).vVaporFtS,
    },
  },
  ogbainbiri_drum_length_ft: {
    truth: () => R.koDrumHorizontal(OGBAINBIRI_DRUM).requiredLengthFt,
    wrong: {
      fall_taken_as_the_whole_diameter: () => R.koDrumHorizontal(OGBAINBIRI_DRUM).vVaporFtS * (OGBAINBIRI_DRUM.diameterFt / OGBAINBIRI_DRUM.udFtS),
      division_inverted: () => R.koDrumHorizontal(OGBAINBIRI_DRUM).vVaporFtS * OGBAINBIRI_DRUM.diameterFt * (1 - OGBAINBIRI_DRUM.liquidFraction) * OGBAINBIRI_DRUM.udFtS,
      holdup_left_at_the_default: () => R.koDrumHorizontal({ ...OGBAINBIRI_DRUM, liquidFraction: 0.25 }).requiredLengthFt,
      depth_fraction_used_as_area_fraction: () => (OGBAINBIRI_DRUM.qVaporAcfs / (((Math.PI * OGBAINBIRI_DRUM.diameterFt ** 2) / 4) * (1 - OGBAINBIRI_DRUM.liquidFraction))) * ((OGBAINBIRI_DRUM.diameterFt * (1 - OGBAINBIRI_DRUM.liquidFraction)) / OGBAINBIRI_DRUM.udFtS),
      wider_drum_read: () => R.koDrumHorizontal(OGBAINBIRI_DRUM_WIDER).requiredLengthFt,
      ld_quoted_instead: () => R.koDrumHorizontal(OGBAINBIRI_DRUM).ld,
    },
  },
  ogbainbiri_drum_length_wider_ft: {
    truth: () => R.koDrumHorizontal(OGBAINBIRI_DRUM_WIDER).requiredLengthFt,
    wrong: {
      first_diameter_read: () => R.koDrumHorizontal(OGBAINBIRI_DRUM).requiredLengthFt,
      fall_taken_as_the_whole_diameter: () => R.koDrumHorizontal(OGBAINBIRI_DRUM_WIDER).vVaporFtS * (OGBAINBIRI_DRUM_WIDER.diameterFt / OGBAINBIRI_DRUM_WIDER.udFtS),
      holdup_left_at_the_default: () => R.koDrumHorizontal({ ...OGBAINBIRI_DRUM_WIDER, liquidFraction: 0.25 }).requiredLengthFt,
      depth_fraction_used_as_area_fraction: () => (OGBAINBIRI_DRUM_WIDER.qVaporAcfs / (((Math.PI * OGBAINBIRI_DRUM_WIDER.diameterFt ** 2) / 4) * (1 - OGBAINBIRI_DRUM_WIDER.liquidFraction))) * ((OGBAINBIRI_DRUM_WIDER.diameterFt * (1 - OGBAINBIRI_DRUM_WIDER.liquidFraction)) / OGBAINBIRI_DRUM_WIDER.udFtS),
      ld_quoted_instead: () => R.koDrumHorizontal(OGBAINBIRI_DRUM_WIDER).ld,
    },
  },
  gbaran_initial_mass_lb: {
    truth: () => R.blowdown(GBARAN_BLOWDOWN).initialMassLb,
    wrong: {
      compressibility_taken_as_one: () => R.blowdown({ ...GBARAN_BLOWDOWN, z: 1 }).initialMassLb,
      end_pressure_used_as_start: () => R.blowdown({ ...GBARAN_BLOWDOWN, p0Psia: 900, pEndPsia: 165 }).initialMassLb,
      mass_remaining_quoted: () => R.blowdown(GBARAN_BLOWDOWN).massRemainingLb,
      molecular_weight_of_air_assumed: () => R.blowdown({ ...GBARAN_BLOWDOWN, mw: 28.9625 }).initialMassLb,
      temperature_left_in_degf: () => R.blowdown({ ...GBARAN_BLOWDOWN, t0R: GBARAN_BLOWDOWN.t0R - RK }).initialMassLb,
      mass_removed_quoted: () => R.blowdown(GBARAN_BLOWDOWN).initialMassLb - R.blowdown(GBARAN_BLOWDOWN).massRemainingLb,
    },
  },
  gbaran_blowdown_time_s: {
    truth: () => R.blowdown(GBARAN_BLOWDOWN).timeS,
    wrong: {
      discharge_coefficient_left_at_the_default: () => R.blowdown({ ...GBARAN_BLOWDOWN, cd: 0.85 }).timeS,
      a_second_certified_coefficient_applied: () => R.blowdown({ ...GBARAN_BLOWDOWN, cd: GBARAN_BLOWDOWN.cd * 0.975 }).timeS,
      compressibility_taken_as_one: () => R.blowdown({ ...GBARAN_BLOWDOWN, z: 1 }).timeS,
      k_of_air_assumed: () => R.blowdown({ ...GBARAN_BLOWDOWN, k: 1.4 }).timeS,
      orifice_read_as_an_area: () => R.blowdown({ ...GBARAN_BLOWDOWN, orificeDIn: Math.sqrt((4 * GBARAN_BLOWDOWN.orificeDIn) / Math.PI) }).timeS,
      temperature_left_in_degf: () => R.blowdown({ ...GBARAN_BLOWDOWN, t0R: GBARAN_BLOWDOWN.t0R - RK }).timeS,
      time_in_minutes_quoted: () => R.blowdown(GBARAN_BLOWDOWN).timeS / 60,
    },
    equivalent: {
      // TWO RIGHT ROUTES TO THE SAME TIME, and both must grade correct. The
      // course integrates the same balance EXACTLY (digest section 21): with z
      // held and the flow choked, dm/dt is proportional to m^((k+1)/2), so the
      // time between two masses is closed form. It is built here from the
      // STATED inputs and the engine's own C and gas constant, not from the
      // march. The second is the march at an eight-fold finer step, which the
      // course teaches a reader to run (section 23). Either one outside the
      // tolerance would grade a right answer wrong.
      the_same_balance_integrated_exactly: () => {
        const { volumeFt3: V, p0Psia: p0, t0R: T0, pEndPsia: pe, mw, k, z, orificeDIn: d, cd } = GBARAN_BLOWDOWN;
        const c = R.gasConstantC(k);
        const rGas = 1545.349 / mw;
        const m0 = (p0 * 144 * V) / (z * rGas * T0);
        const aIn2 = cd * (Math.PI / 4) * (d / 12) ** 2 * 144;
        const a = ((c * aIn2 * Math.sqrt(mw / z)) / 3600) * ((z * rGas) / (144 * V)) * Math.sqrt(T0) * m0 ** (-(k - 1) / 2);
        const n = (k + 1) / 2;
        const mEnd = m0 * (pe / p0) ** (1 / k);
        return (mEnd ** (1 - n) - m0 ** (1 - n)) / (a * (n - 1));
      },
      the_march_at_an_eight_fold_finer_step: () => R.blowdown({ ...GBARAN_BLOWDOWN, dtS: GBARAN_BLOWDOWN.dtS / 8 }).timeS,
    },
  },
  gbaran_final_temperature_degr: {
    truth: () => R.blowdown(GBARAN_BLOWDOWN).finalTR,
    wrong: {
      start_temperature_quoted: () => GBARAN_BLOWDOWN.t0R,
      degf_quoted: () => R.blowdown(GBARAN_BLOWDOWN).finalTR - RK,
      k_of_air_assumed: () => R.blowdown({ ...GBARAN_BLOWDOWN, k: 1.4 }).finalTR,
      isentropic_exponent_not_reduced_by_one: () => GBARAN_BLOWDOWN.t0R * (R.blowdown(GBARAN_BLOWDOWN).massRemainingLb / R.blowdown(GBARAN_BLOWDOWN).initialMassLb) ** GBARAN_BLOWDOWN.k,
      end_pressure_read_as_a_temperature_ratio: () => GBARAN_BLOWDOWN.t0R * (GBARAN_BLOWDOWN.pEndPsia / GBARAN_BLOWDOWN.p0Psia),
    },
    equivalent: {
      // For an ideal isentropic expansion in a fixed volume, pressure goes as
      // mass to the k, so the temperature ratio read off the PRESSURES and the
      // one read off the MASSES are the same number. Two routes to one answer
      // is not an error, and the sweep asserts they stay equal.
      pressure_ratio_instead_of_mass_ratio: () => GBARAN_BLOWDOWN.t0R * (GBARAN_BLOWDOWN.pEndPsia / GBARAN_BLOWDOWN.p0Psia) ** ((GBARAN_BLOWDOWN.k - 1) / GBARAN_BLOWDOWN.k),
      // The compressibility multiplies the start mass and the end mass by the
      // same factor, so it cancels out of the mass ratio the temperature is
      // read from. It DOES move the inventory and the time, and the rows above
      // are the evidence for that.
      compressibility_taken_as_one: () => R.blowdown({ ...GBARAN_BLOWDOWN, z: 1 }).finalTR,
    },
  },
  gbaran_choked_floor_psia: {
    truth: () => R.blowdown(GBARAN_BLOWDOWN).chokedToPsia,
    wrong: {
      back_pressure_quoted: () => GBARAN_BLOWDOWN.pBackPsia,
      ratio_multiplied_instead_of_divided: () => GBARAN_BLOWDOWN.pBackPsia * R.criticalPressureRatio(GBARAN_BLOWDOWN.k),
      k_of_air_assumed: () => R.blowdown({ ...GBARAN_BLOWDOWN, k: 1.4 }).chokedToPsia,
      atmospheric_assumed_as_back_pressure: () => R.blowdown({ ...GBARAN_BLOWDOWN, pBackPsia: ATM }).chokedToPsia,
      end_pressure_quoted: () => GBARAN_BLOWDOWN.pEndPsia,
    },
  },
  gbaran_radiant_intensity_kwm2: {
    truth: () => R.radiationIntensity({ qKw: GBARAN_FLARE.qKw, distanceM: GBARAN_FLARE.distanceM, fractionRadiated: GBARAN_FLARE.fractionRadiated, transmissivity: GBARAN_FLARE.transmissivity }).kWm2,
    wrong: {
      transmissivity_left_at_one: () => R.radiationIntensity({ qKw: GBARAN_FLARE.qKw, distanceM: GBARAN_FLARE.distanceM, fractionRadiated: GBARAN_FLARE.fractionRadiated, transmissivity: 1 }).kWm2,
      radiated_fraction_left_at_the_default: () => R.radiationIntensity({ qKw: GBARAN_FLARE.qKw, distanceM: GBARAN_FLARE.distanceM, fractionRadiated: 0.3, transmissivity: GBARAN_FLARE.transmissivity }).kWm2,
      distance_not_squared: () => (GBARAN_FLARE.transmissivity * GBARAN_FLARE.fractionRadiated * GBARAN_FLARE.qKw) / (4 * Math.PI * GBARAN_FLARE.distanceM),
      solid_angle_taken_as_pi: () => (GBARAN_FLARE.transmissivity * GBARAN_FLARE.fractionRadiated * GBARAN_FLARE.qKw) / (Math.PI * GBARAN_FLARE.distanceM ** 2),
      solid_angle_taken_as_two_pi: () => (GBARAN_FLARE.transmissivity * GBARAN_FLARE.fractionRadiated * GBARAN_FLARE.qKw) / (2 * Math.PI * GBARAN_FLARE.distanceM ** 2),
      project_allowable_quoted: () => GBARAN_FLARE.projectAllowableKwM2,
    },
  },
  gbaran_setback_distance_m: {
    truth: () => R.distanceForIntensity({ qKw: GBARAN_FLARE.qKw, allowableKwM2: GBARAN_FLARE.projectAllowableKwM2, fractionRadiated: GBARAN_FLARE.fractionRadiated, transmissivity: GBARAN_FLARE.transmissivity }).distanceM,
    wrong: {
      a_customary_level_used_instead: () => R.distanceForIntensity({ qKw: GBARAN_FLARE.qKw, allowableKwM2: 4.73, fractionRadiated: GBARAN_FLARE.fractionRadiated, transmissivity: GBARAN_FLARE.transmissivity }).distanceM,
      another_customary_level_used: () => R.distanceForIntensity({ qKw: GBARAN_FLARE.qKw, allowableKwM2: 6.31, fractionRadiated: GBARAN_FLARE.fractionRadiated, transmissivity: GBARAN_FLARE.transmissivity }).distanceM,
      transmissivity_left_at_one: () => R.distanceForIntensity({ qKw: GBARAN_FLARE.qKw, allowableKwM2: GBARAN_FLARE.projectAllowableKwM2, fractionRadiated: GBARAN_FLARE.fractionRadiated, transmissivity: 1 }).distanceM,
      radiated_fraction_left_at_the_default: () => R.distanceForIntensity({ qKw: GBARAN_FLARE.qKw, allowableKwM2: GBARAN_FLARE.projectAllowableKwM2, fractionRadiated: 0.3, transmissivity: GBARAN_FLARE.transmissivity }).distanceM,
      not_rooted: () => (GBARAN_FLARE.transmissivity * GBARAN_FLARE.fractionRadiated * GBARAN_FLARE.qKw) / (4 * Math.PI * GBARAN_FLARE.projectAllowableKwM2),
      stated_distance_quoted: () => GBARAN_FLARE.distanceM,
    },
  },
};

const keysExpected = Object.keys(fields).sort();
const keysHave = Object.keys(ROUTES).sort();
if (JSON.stringify(keysExpected) !== JSON.stringify(keysHave)) {
  console.log('REFUSED: the sweep does not cover exactly the eighteen graded fields');
  console.log('  missing from the sweep:', keysExpected.filter((k) => !keysHave.includes(k)).join(', ') || 'none');
  console.log('  swept but not graded:', keysHave.filter((k) => !keysExpected.includes(k)).join(', ') || 'none');
  process.exit(2);
}

let weak = 0;
let totalWrong = 0;
let totalEquivalent = 0;
let equivalentBroken = 0;
let closest = { key: null, name: null, ratio: Infinity };
console.log('field                                 tol        errors  moved  blind  equiv  closest miss (tolerances)');
Object.entries(ROUTES).forEach(([key, { truth, wrong, equivalent }]) => {
  const tol = fields[key][3];
  const t = truth();
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
    } else { blind.push(name); }
  });
  if (nearest < closest.ratio) closest = { key, name: nearestName, ratio: nearest };
  // A restatement declared EQUIVALENT must NOT move the answer. If it does,
  // either the declaration is wrong or the route has changed, and both are
  // findings.
  const eqBroken = [];
  Object.entries(equivalent || {}).forEach(([name, f]) => {
    totalEquivalent += 1;
    let got;
    try { got = f(); } catch (e) { got = NaN; }
    if (!Number.isFinite(got) || Math.abs(got - t) > tol) eqBroken.push(`${name} (moved by ${Math.abs(got - t).toExponential(3)})`);
  });
  equivalentBroken += eqBroken.length;
  const isWeak = moved.length < 3 || blind.length > 0 || eqBroken.length > 0;
  if (isWeak) weak += 1;
  console.log(`${key.padEnd(37)} ${String(tol).padEnd(10)} ${String(moved.length + blind.length).padStart(6)} ${String(moved.length).padStart(6)} ${String(blind.length).padStart(6)} ${String(Object.keys(equivalent || {}).length).padStart(6)}  ${nearest === Infinity ? 'all infinite' : nearest.toExponential(3)} (${nearestName})${isWeak ? '   WEAK' : ''}`);
  if (blind.length) console.log(`  ${' '.repeat(35)}BLIND TO: ${blind.join(', ')}`);
  if (eqBroken.length) console.log(`  ${' '.repeat(35)}DECLARED EQUIVALENT BUT MOVED: ${eqBroken.join(', ')}`);
});
console.log();
console.log(`routes swept: ${Object.keys(ROUTES).length}  plausible wrong methods aimed at them: ${totalWrong}  restatements declared equivalent: ${totalEquivalent} (${equivalentBroken} broken)  WEAK routes: ${weak}`);
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
