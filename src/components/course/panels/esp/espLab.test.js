// Every value the PD3 lab exposes to a panel, a lesson or the grader is pinned
// here against the vendored engine's own goldens, and so are the teaching
// CLAIMS. A course that asserts its numbers but not its arguments can have its
// argument quietly inverted by an engine change and still pass: `sizePump` could
// start building the amps on the LARGER of its two powers, `selectCable` could
// start checking ampacity, `diagnoseOperation` could go back to printing its own
// threshold, and a file that only pinned numbers would fail with no idea which
// sentence in which lesson had just become false. So every one of those
// arguments is a named assertion below.
//
// The goldens were cut by an independent stdlib oracle
// (tools/validation/production/oracle_esp.py) from the published method
// statements rather than from the JS. The tolerances are the ones the engine's
// own gate uses, case for case.
//
// THE EIGHTEEN GRADED FIELDS of the OKARI-9 capstone are pinned separately, at
// the tolerances the capstone states, because a grader reading one derivation
// and a lesson reading another is exactly the failure this file exists to stop.
//
// AND THE SEVENTY EIGHT SHIPPED LESSONS are pinned too. They were written from
// /root/pd-wip-esp/digest.txt, so a lab value that disagrees with that file
// breaks a lesson that is already written. `teachingQuantities()` is compared to
// it label for label at the digest's own printed precision, and the checksum
// below pins the same thing on a machine that does not have the file.

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as L from './espLab.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const G = L.GOLDEN;

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);
const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
const relNear = (a, b, tol) => expect(rel(a, b)).toBeLessThan(tol);

/**
 * THE EIGHTEEN GRADED FIELDS, as [tier, key, value, tolerance].
 *
 * THE TOLERANCE IS ABSOLUTE, in the field's own units. `academy_submit_capstone`
 * in migrations/20260715_n4_petrophysics_capstone.sql grades with
 * `abs(v_got - v_exp) <= v_tol` and divides by nothing, so `tdh_ft` is accepted
 * within 0.0018 FEET of 3684.025520406471, not within 0.18 per cent of it. Every
 * band below is thousands of times tighter than a relative reading of the same
 * number would be.
 *
 * Every one of them is a return value of the ESP engines, produced by the
 * capstone derivation in /root/pd-wip-esp/pd3_fields.mjs and carried here
 * verbatim so the grader, the lessons and this file all pin one set of numbers.
 * `capstoneValues()` in the lab reproduces the same derivation call for call, and
 * the test below is what proves the two have not drifted.
 */
const CAPSTONE_FIELDS = [
  ['beginner', 'stage_fit_head_rmse_ft', 0.02217275280580838, 1.1e-8],
  ['beginner', 'stage_bep_q_bpd', 3600.625, 0.0018],
  ['beginner', 'stage_bep_head_ft', 17.48655357193924, 0.0000087],
  // Read at the Associate tier's OWN duty (CAP.dutyQBpd, CAP.dutySg), not at
  // the well's. See the decoupling note on CAP in espLab.js: reading these at
  // `gas.pumpIntakeBpd` forced the Associate PROMPT to state two PROFESSIONAL
  // graded answers, and no rounding escaped it.
  ['beginner', 'stage_head_at_duty_ft', 21.104863057398873, 0.000011],
  ['beginner', 'stage_efficiency_at_duty_frac', 0.7063497926211714, 3.5e-7],
  ['beginner', 'stage_bhp_per_stage_hp', 0.7947946030979557, 4.0e-7],
  ['intermediate', 'intake_pressure_psia', 1206.9, 0.0006],
  ['intermediate', 'intake_stream_gvf_frac', 0.20505218502181405, 1e-7],
  ['intermediate', 'pump_mixture_density_lbft3', 52.57683447823375, 0.000026],
  ['intermediate', 'pump_intake_bpd', 4181.40584, 0.0021],
  ['intermediate', 'tdh_ft', 3684.025520406471, 0.0018],
  ['intermediate', 'design_head_made_ft', 3706.1488182900653, 0.0019],
  ['advanced', 'design_shaft_hp', 134.57121282585754, 0.000067],
  ['advanced', 'motor_amps_a', 43.06278810427442, 0.000022],
  ['advanced', 'cable_drop_pct', 4.991671325954014, 0.0000025],
  ['advanced', 'surface_kva', 156.62014330985684, 0.000078],
  ['advanced', 'cable_loss_kw', 7.446269485504994, 0.0000037],
  ['advanced', 'diag_head_ratio_frac', 0.8460786902908579, 4.2e-7],
];

// ---------------------------------------------------------------------------
// 1. THE GOLDENS, CASE FOR CASE.
// ---------------------------------------------------------------------------

describe('the published constants reproduce the golden', () => {
  it('the hydraulic power divisor is the one the golden records', () => {
    relNear(L.HP_HEAD_DIVISOR, G.constants.hpHeadDivisor, 1e-12);
  });

  it('the divisor is built from first principles and not remembered', () => {
    // 550 ft lbf/s per hp times 86400 s/d over 62.4 lbf/ft3 times 5.614583 ft3/bbl
    relNear(
      (L.FT_LBF_PER_S_PER_HP * L.SEC_PER_DAY) / (L.WATER_LBF_PER_FT3 * L.FT3_PER_BBL),
      L.HP_HEAD_DIVISOR, 1e-15,
    );
  });

  it('the pressure form of the same statement is the familiar 58824, to a part in a thousand', () => {
    const pressureForm = L.HP_HEAD_DIVISOR * L.EXACT_PSI_PER_FT_SG;
    relNear(pressureForm, L.FAMILIAR_PRESSURE_DIVISOR, 1e-3);
    // and it is NOT exactly it, which is the point of printing both
    expect(pressureForm).not.toBe(L.FAMILIAR_PRESSURE_DIVISOR);
  });

  it('the module carries an exact and a rounded water gradient, 0.077 percent apart', () => {
    expect(L.PSI_PER_FT_SG).toBe(0.433);
    relNear(L.EXACT_PSI_PER_FT_SG, L.WATER_LBF_PER_FT3 / 144, 1e-15);
    near(L.gradientConversionSummary().differencePct, 0.0769822940723677, 1e-12);
  });
});

describe('the vendor stage curve reproduces the golden', () => {
  const fit = L.vendorCurveFit();

  it('the cubic head fit matches the golden coefficient for coefficient', () => {
    expect(fit.headDegree).toBe(3);
    expect(fit.headScale).toBe(G.vendorCurve.headScale);
    fit.headCoeffs.forEach((c, i) => near(c, G.vendorCurve.headCoeffs[i], 1e-9));
    relNear(fit.headRmse, G.vendorCurve.headRmse, 1e-10);
  });

  it('the cubic efficiency fit matches the golden coefficient for coefficient', () => {
    expect(fit.effDegree).toBe(3);
    fit.effCoeffs.forEach((c, i) => near(c, G.vendorCurve.effCoeffs[i], 1e-9));
  });

  it('the best efficiency point matches the golden', () => {
    const bep = L.vendorBep();
    near(bep.qBpd, G.vendorCurve.bep.qBpd, 1e-9);
    relNear(bep.headFt, G.vendorCurve.bep.headFt, 1e-11);
    relNear(bep.efficiency, G.vendorCurve.bep.efficiency, 1e-11);
  });

  it('the affinity block reproduces all twelve golden rows', () => {
    const rows = L.goldenAffinityRows();
    expect(rows).toHaveLength(12);
    rows.forEach((r) => {
      relNear(r.headFt, r.goldenHeadFt, 1e-9);
      relNear(r.bhpPerStage, r.goldenBhpPerStage, 1e-9);
      relNear(r.efficiency, r.goldenEfficiency, 1e-9);
      relNear(r.qRefBpd, r.goldenQRefBpd, 1e-9);
      expect(r.inRange).toBe(G.affinity.find((g) => g.hz === r.hz && g.qBpd === r.qBpd).inRange);
      expect(r.region).toBe(G.affinity.find((g) => g.hz === r.hz && g.qBpd === r.qBpd).region);
    });
    expect(L.affinityMaxDeviation()).toBeLessThan(1e-9);
  });
});

describe('the reference stage models reproduce the golden', () => {
  it('both published reference curves match, best efficiency point and samples', () => {
    L.goldenReferenceCurveRows().forEach((rc) => {
      const s = L.referenceCurveSummary(rc.id);
      relNear(s.bepQBpd, rc.bepQBpd, 1e-9);
      relNear(s.bepReadHeadFt, rc.bepHeadFt, 1e-9);
      relNear(s.bepReadEfficiency, rc.bepEfficiency, 1e-9);
      rc.samples.forEach((sample) => {
        const read = L.polyEval(L.referenceCurve(rc.id).headFit, sample.qBpd);
        relNear(read, sample.headFt, 1e-9);
      });
    });
  });
});

describe('the two published designs reproduce the golden, end to end', () => {
  L.GOLDEN_DESIGN_IDS.forEach((id) => {
    it(`${id}: intake, gas, gradient, head, stack and shaft power`, () => {
      const c = L.goldenDesign(id);
      const g = L.goldenIntakeRecorded(id);
      const s = L.goldenSizingRecorded(id);
      // The golden stores its numbers to about twelve significant figures, so
      // 1e-9 relative is the file's own resolution and not a slack tolerance.
      near(c.pIntakePsia, g.intakePressurePsia, 1e-9);
      relNear(c.stream.gvf, g.streamGvf, 1e-9);
      relNear(c.gas.mixtureDensityLbFt3, g.pumpMixtureDensityLbFt3, 1e-9);
      relNear(c.gas.pumpIntakeBpd, g.pumpIntakeBpd, 1e-9);
      relNear(c.gradientPsiPerFt, g.gradientPsiPerFt, 1e-9);
      relNear(c.tdh.tdhFt, s.tdhFt, 1e-9);
      expect(c.sized.stages).toBe(s.stages);
      relNear(c.sized.headMadeFt, s.headMadeFt, 1e-9);
      relNear(c.sized.shaftHp, s.shaftHp, 1e-9);
      relNear(c.sized.hydraulicHp, s.hydraulicHp, 1e-9);
      relNear(c.sized.stage.headFt, s.headPerStageFt, 1e-9);
      relNear(c.sized.stage.efficiency, s.efficiency, 1e-9);
      relNear(c.sized.stage.bhpPerStage, s.bhpPerStage, 1e-9);
      relNear(c.sized.motorLoad.loadFraction, s.loadFraction, 1e-9);
    });
  });
});

describe('the electrical chain reproduces both golden cases', () => {
  it('amps, drop, surface volts, kVA, kW and cable loss', () => {
    const rows = L.goldenElectricalRows();
    expect(rows).toHaveLength(2);
    rows.forEach((r) => {
      relNear(r.amps, r.goldenAmps, 1e-9);
      relNear(r.dropV, r.goldenDropV, 1e-9);
      relNear(r.dropPct, r.goldenDropPct, 1e-9);
      relNear(r.surfaceVolts, r.goldenSurfaceVolts, 1e-9);
      relNear(r.kva, r.goldenKva, 1e-9);
      relNear(r.kw, r.goldenKw, 1e-9);
      relNear(r.lossKw, r.goldenLossKw, 1e-9);
      relNear(r.loadFraction, r.goldenLoadFraction, 1e-9);
      relNear(r.resistanceOhmsPer1000Ft, r.goldenResistanceOhmsPer1000Ft, 1e-9);
    });
    expect(L.electricalMaxDeviation()).toBeLessThan(1e-9);
  });

  it('the drop is the three phase form and the power factor stays out of it', () => {
    const r = L.goldenElectricalRows()[0];
    const expected = L.ROOT_THREE * r.amps * r.resistanceOhmsPer1000Ft * (r.lengthFt / 1000);
    relNear(r.dropV, expected, 1e-12);
    // and the power factor only shows up in the real power
    relNear(r.kw, r.kva * r.powerFactor, 1e-15);
  });
});

// ---------------------------------------------------------------------------
// 2. THE TEACHING CLAIMS. A number without its argument is not teaching.
// ---------------------------------------------------------------------------

describe('CLAIM: a stage curve is a fit, and a fit has a residual', () => {
  it('the cubic misses every one of the five published points', () => {
    const rows = L.vendorFitResidualRows();
    expect(rows).toHaveLength(5);
    rows.forEach((r) => {
      expect(Math.abs(r.headResidualFt)).toBeGreaterThan(0);
      expect(r.fitHeadFt).not.toBe(r.publishedHeadFt);
    });
    // four coefficients through five points, so the misses cannot all be zero
    expect(L.vendorCurveFit().headRmse).toBeGreaterThan(0);
  });

  it('the reference MODEL fit is a fit of a shape to itself, so its residual is nothing', () => {
    L.REFERENCE_CURVE_IDS.forEach((id) => {
      const s = L.referenceCurveSummary(id);
      expect(s.headDegree).toBe(2);
      expect(s.headRmse).toBeLessThan(1e-10);
      expect(s.effRmse).toBeLessThan(1e-10);
      expect(s.source).toBe('reference-model');
    });
    // and a lesson quoting a reference stage residual is quoting a zero
    expect(L.vendorCurveFit().headRmse).toBeGreaterThan(1e-3);
  });

  it('the transcription warning fires on the residual and not on the shape', () => {
    const rows = L.brassTranscriptionRows();
    const [asPublished, mild, slip] = rows;
    expect(asPublished.warningCount).toBe(0);
    // THE MILD ERROR IS THE INTERESTING ONE: the curve still looks like a pump
    // curve, the fit still answers at every rate, and the warning does NOT fire
    expect(mild.warningCount).toBe(0);
    expect(mild.headRmse).toBeGreaterThan(asPublished.headRmse);
    expect(Number.isFinite(mild.headAt2500Ft)).toBe(true);
    // the decimal slip is the one the check catches
    expect(slip.warningCount).toBe(1);
    expect(slip.warnings[0]).toContain('two percent');
    expect(slip.headRmse).toBeGreaterThan(slip.transcriptionThresholdFt);
  });

  it('THE SINGLE BAD POINT DISAPPEARS INTO THE ROOT MEAN SQUARE', () => {
    const [asPublished, mild, slip] = L.brassTranscriptionRows();
    // the per point misses are the fit against the points it was HANDED, so on
    // the untouched variant they are the ordinary residuals of a cubic through
    // five points and the typed column is the published column
    asPublished.points.forEach((p) => expect(p.typedLessPublishedFt).toBe(0));
    expect(asPublished.points).toHaveLength(L.vendorPublishedPoints().length);
    // exactly ONE point was mistyped on each of the other two variants
    [mild, slip].forEach((v) => {
      expect(v.points.filter((p) => p.typedLessPublishedFt !== 0)).toHaveLength(1);
    });
    // and the worst miss on the mild variant is the mistyped point itself
    const mistyped = mild.points.find((p) => p.typedLessPublishedFt !== 0);
    expect(mild.worstResidualQBpd).toBe(mistyped.qBpd);
    // THE FINDING: that one miss is several times the root mean square of the
    // five, which is exactly how a real error stays under an RMSE-only bar
    expect(mild.worstResidualOverRmse).toBeGreaterThan(1.5);
    expect(mild.headRmse).toBeLessThan(mild.transcriptionThresholdFt);
    expect(Math.abs(mild.worstResidualFt)).toBeGreaterThan(mild.transcriptionThresholdFt);
    // the decimal slip is big enough that even the average of five carries it
    expect(slip.headRmse).toBeGreaterThan(slip.transcriptionThresholdFt);
  });

  it('the BEP is found by SCANNING, so it lands on a grid', () => {
    const bep = L.vendorBep();
    near(bep.scanSpacingBpd, (L.VENDOR_CURVE.qMax - L.VENDOR_CURVE.qMin) / 400, 1e-12);
    const offGrid = (bep.qBpd - L.VENDOR_CURVE.qMin) / bep.scanSpacingBpd;
    near(offGrid, Math.round(offGrid), 1e-9);
  });

  it('and the recommended band is the two published fractions of that rate', () => {
    const bep = L.vendorBep();
    near(bep.recommendedLowBpd, L.ESP_THRESHOLDS.downthrustBepFraction * bep.qBpd, 1e-12);
    near(bep.recommendedHighBpd, L.ESP_THRESHOLDS.upthrustBepFraction * bep.qBpd, 1e-12);
    // and the band the engine LABELS agrees with the band those fractions draw
    L.vendorDutyRows().forEach((r) => {
      if (r.qBpd < bep.recommendedLowBpd) expect(r.region).toBe('downthrust');
      else if (r.qBpd > bep.recommendedHighBpd) expect(r.region).toBe('upthrust');
      else expect(r.region).toBe('recommended');
    });
  });

  it('and the scan MISSES the rate a reference stage was generated at', () => {
    L.REFERENCE_CURVE_IDS.forEach((id) => {
      const s = L.referenceCurveSummary(id);
      near(s.bepScanSpacingBpd, (s.qMax - s.qMin) / L.BEP_SCAN_STEPS, 1e-12);
      near(s.bepScanMissBpd, s.bepQBpd - s.bepBpd, 1e-12);
      // the miss is a grid artefact, so it is bounded by the scan spacing and is
      // never nothing: the generating rate does not sit on the scan grid
      expect(Math.abs(s.bepScanMissBpd)).toBeGreaterThan(0);
      expect(Math.abs(s.bepScanMissBpd)).toBeLessThanOrEqual(s.bepScanSpacingBpd);
      // and on all four published reference stages it reaches 2 bbl/d and no more
      expect(Math.abs(s.bepScanMissBpd)).toBeLessThanOrEqual(2);
    });
  });
});

describe('CLAIM: inRange false is a flag on the answer, not a refusal', () => {
  it('the golden own row 1300 bbl/d past the data returns a number', () => {
    const r = L.goldenExtrapolatedRow();
    near(r.qRefBpd, 4800, 1e-9);
    near(r.pastDataBpd, 1300, 1e-9);
    expect(r.inRange).toBe(false);
    expect(r.region).toBe('upthrust');
    expect(Number.isFinite(r.headFt)).toBe(true);
    expect(Number.isFinite(r.bhpPerStage)).toBe(true);
    relNear(r.headFt, 0.052063492058, 1e-8);
    relNear(r.bhpPerStage, 0.004290703685, 1e-8);
  });

  it('nothing snaps at the edge: only a boolean changes', () => {
    const rows = L.vendorExtrapolationRows();
    rows.forEach((r) => expect(Number.isFinite(r.headFt)).toBe(true));
    const inside = rows.filter((r) => r.inRange);
    const outside = rows.filter((r) => !r.inRange);
    expect(inside.length).toBeGreaterThan(0);
    expect(outside.length).toBeGreaterThan(0);
    // head falls monotonically straight through the boundary, with no step
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].headFt).toBeLessThan(rows[i - 1].headFt);
    }
    // and it keeps answering after head has gone negative, with a NEGATIVE
    // brake power rather than a refusal, because the hydraulic power went
    // negative while the efficiency was still positive
    const past = rows.filter((r) => r.headFt < 0 && r.efficiency > 0);
    expect(past.length).toBeGreaterThan(0);
    past.forEach((r) => {
      expect(Number.isFinite(r.bhpPerStage)).toBe(true);
      expect(r.bhpPerStage).toBeLessThan(0);
    });
    // The ONE place the engine finally stops is brakeHp's own guard, and it
    // arrives 2000 bbl/d past the end of the data, when the EFFICIENCY fit has
    // gone negative too. That is a refusal, and it comes long after the answers
    // stopped meaning anything.
    const last = rows[rows.length - 1];
    expect(last.pastDataBpd).toBe(2000);
    expect(last.efficiency).toBeLessThan(0);
    expect(Number.isNaN(last.bhpPerStage)).toBe(true);
  });

  it('the same behaviour belongs to EXTRAPOLATION and not to the cubic', () => {
    const rows = L.referenceExtrapolationRows();
    expect(L.referenceCurveSummary('ref-540-2500').headDegree).toBe(2);
    rows.forEach((r) => expect(Number.isFinite(r.headFt)).toBe(true));
    expect(rows[rows.length - 1].headFt).toBeLessThan(0);
  });

  it('the HEAD fit runs out before the EFFICIENCY fit does, on both curves', () => {
    const e = L.fitExhaustion();
    expect(e.vendorZeroEfficiencyBpd).toBeGreaterThan(e.vendorZeroHeadBpd);
    expect(e.referenceZeroEfficiencyBpd).toBeGreaterThan(e.referenceZeroHeadBpd);
    // so the negative brake power comes from a negative HYDRAULIC power
    expect(e.vendorEfficiencyOutlivesHeadBpd).toBeGreaterThan(0);
    expect(e.referenceEfficiencyOutlivesHeadBpd).toBeGreaterThan(0);
    // the reference model's efficiency shape returns to zero at twice the BEP rate
    expect(e.referenceZeroEfficiencyBpd).toBe(2 * 2500);
  });

  it('carried through a stage count the same reading costs a whole design', () => {
    const rows = L.designTurndownRows('gassyOffshore');
    const design = rows[0];
    const slowest = rows[rows.length - 1];
    expect(design.hz).toBe(60);
    expect(slowest.hz).toBe(40);
    expect(design.stages).toBe(192);
    // the stage count DIVIDES by the head per stage, so the collapse multiplies
    expect(slowest.stages).toBeGreaterThan(1000);
    expect(slowest.stagesMultipleOfDesign).toBeGreaterThan(5);
    relNear(slowest.stagesMultipleOfDesign, design.headPerStageFt / slowest.headPerStageFt, 1e-2);
    expect(slowest.inRange).toBe(false);
    expect(slowest.warningCodes).toContain('outsideCurve');
    // AND NO REFUSAL: a design came back at every rung
    rows.forEach((r) => expect(Number.isFinite(r.stages)).toBe(true));
  });

  it('the engine does not refuse until head goes negative, well below that', () => {
    L.GOLDEN_DESIGN_IDS.forEach((id) => {
      const z = L.designZeroHeadFrequency(id);
      const outside = L.designTurndownRows(id).filter((r) => !r.inRange);
      if (outside.length > 0) {
        // the answers stopped meaning anything above the frequency where they stop
        expect(z.zeroHeadHz).toBeLessThan(Math.max(...outside.map((r) => r.hz)));
      }
      expect(z.belowDesignHz).toBeGreaterThan(0);
    });
  });
});

describe('CLAIM: stages are integers, so a stack makes more head than it was asked for', () => {
  it('the margin is bounded by ONE STAGE, on every case', () => {
    L.allCases().forEach((c) => {
      const s = L.stackSizing(c);
      expect(s.headMadeFt).toBeGreaterThanOrEqual(s.tdhFt);
      expect(s.headMarginStages).toBeGreaterThanOrEqual(0);
      expect(s.headMarginStages).toBeLessThan(1);
      expect(s.stages).toBe(Math.ceil(s.stagesExact));
    });
  });

  it('THE IDENTITY: the power ratio IS the head ratio, to machine precision', () => {
    L.allCases().forEach((c) => {
      const s = L.stackSizing(c);
      expect(Math.abs(s.identity)).toBeLessThan(1e-12);
    });
    L.requirementSweepRows().forEach((r) => {
      expect(Math.abs(r.identity)).toBeLessThan(1e-12);
    });
  });

  it('the margin is not a percentage: a short stack pays percent where a tall one pays tenths', () => {
    const tall = L.stackSizing(L.goldenDesign('gassyOffshore'));
    const short = L.stackSizing(L.teachingWellCase(L.IBENO_2));
    expect(tall.stages).toBeGreaterThan(150);
    expect(short.stages).toBeLessThan(60);
    expect(short.headMarginPct).toBeGreaterThan(tall.headMarginPct);
    // and both are the same one stage of slack
    expect(tall.headMarginStages).toBeLessThan(1);
    expect(short.headMarginStages).toBeLessThan(1);
  });

  it('the two powers differ by exactly that ratio, and the smaller one is the one used', () => {
    L.twoPowerCostRows().forEach((r) => {
      expect(r.publishedMethodTakesHp).toBeGreaterThanOrEqual(r.electricalChainBuiltOnHp);
      expect(r.understatementHp).toBeGreaterThanOrEqual(0);
    });
    // READ THE DENOMINATOR: the same gap over the two different denominators
    const c = L.goldenDesign('gassyOffshore');
    const s = L.stackSizing(c);
    const cost = L.twoPowerCostRows().find((r) => r.id === 'gassyOffshore');
    expect(s.twoPowerGapHp).toBe(cost.understatementHp);
    expect(s.twoPowerGapPct).toBeGreaterThan(cost.understatementPct);
    near(s.twoPowerGapPct, 0.037359, 1e-5);
    near(cost.understatementPct, 0.037345, 1e-5);
  });
});

describe('CLAIM: one field name, two quantities, twelve points apart', () => {
  it('the SELECTION fraction applies the derate and the ELECTRICAL one does not', () => {
    L.loadFractionSeamRows().forEach((r) => {
      r.derates.forEach((d) => {
        relNear(d.selectionLoadFraction, r.electricalLoadFraction / d.derate, 1e-12);
        if (d.deratePct === 0) {
          near(d.gapPoints, 0, 1e-12);
        } else {
          expect(d.gapPoints).toBeGreaterThan(0);
        }
      });
    });
  });

  it('the gap is the electrical fraction times one over the derate less one', () => {
    near(L.SEAM_FINDING.gapPoints, 0.89714 * (1 / 0.88 - 1) * 100, 1e-12);
    near(L.SEAM_FINDING.gapPoints, 12.233727272727283, 1e-9);
  });

  it('the undersized teaching motor is overloaded and not overloaded at once', () => {
    const qua = L.loadFractionSeamRows().find((r) => r.id === 'QUA-IBOE-4');
    const at12 = qua.derates.find((d) => d.deratePct === 12);
    // the SELECTION fraction crosses one and sizePump warns
    expect(at12.selectionLoadFraction).toBeGreaterThan(1);
    expect(at12.warningCodes).toContain('motorOverloaded');
    // the ELECTRICAL fraction the amps are built on stays below one and warns nothing
    expect(qua.electricalLoadFraction).toBeLessThan(1);
    expect(qua.derates.find((d) => d.deratePct === 0).warningCodes).toEqual([]);
    expect(at12.gapPoints).toBeGreaterThan(12);
  });

  it('the amps are built on the underated one', () => {
    const c = L.teachingWellCase(L.QUA_IBOE_4);
    const direct = L.motorCurrent({
      shaftHp: c.sized.shaftHp,
      nameplateHp: L.QUA_IBOE_4.nameplateHp,
      nameplateAmps: L.QUA_IBOE_4.nameplateAmps,
    });
    const seam = L.loadFractionSeamRows().find((r) => r.id === 'QUA-IBOE-4');
    relNear(direct.loadFraction, seam.electricalLoadFraction, 1e-15);
    expect(direct.loadFraction).not.toBe(c.sized.motorLoad.loadFraction);
  });
});

describe('CLAIM: two conversions for one gradient, and the convention that keeps them exact', () => {
  it('the gap is a FIXED PERCENTAGE, which is why it may not be quoted in feet off a graded head', () => {
    const rows = L.gradientConventionRows();
    rows.forEach((r) => near(r.gapPct, 0.0769822940723677, 1e-9));
    // the feet figures the digest carries, on the published and teaching cases
    const byId = Object.fromEntries(rows.map((r) => [r.id, r.gapFt]));
    near(byId.gassyOffshore, 3.832442, 5e-6);
    near(byId.highWaterCut, 2.923126, 5e-6);
    near(byId['QUA-IBOE-4'], 3.104070, 5e-6);
    near(byId['IBENO-2'], 0.558191, 5e-6);
  });

  it('the LAUNDERING convention makes the two chains agree exactly', () => {
    L.gradientConventionRows().forEach((r) => {
      expect(Math.abs(r.gapOnLaunderedSgFt)).toBeLessThan(1e-9);
    });
    L.allCases().forEach((c) => {
      relNear(L.PSI_PER_FT_SG * c.sg, c.gradientPsiPerFt, 1e-15);
    });
  });

  it('the engine docstring quotes a 2.8 ft figure no case in this course produces', () => {
    // Recorded, not fixed: the nearest real case is highWaterCut at 2.923126 ft.
    const gaps = L.gradientConventionRows().map((r) => r.gapFt);
    gaps.forEach((g) => expect(Math.abs(g - 2.8)).toBeGreaterThan(0.1));
  });
});

describe('CLAIM: total dynamic head is not the friction plus the wellhead', () => {
  it('the three parts sum to the head from the two pressures, exactly', () => {
    L.allCases().forEach((c) => {
      const d = L.tdhDecomposition(c);
      expect(Math.abs(d.summedLessPressureTdhFt)).toBeLessThan(1e-9);
      near(d.netLiftSharePct + d.frictionSharePct + d.whpSharePct, 100, 1e-9);
    });
  });

  it('the net vertical lift is most of it on every DEEP case', () => {
    ['gassyOffshore', 'highWaterCut', 'QUA-IBOE-4'].forEach((id) => {
      const c = L.allCases().find((x) => x.id === id);
      const d = L.tdhDecomposition(c);
      expect(c.inp.pumpTvdFt).toBeGreaterThan(5000);
      expect(d.netLiftSharePct).toBeGreaterThan(d.frictionSharePct);
      expect(d.netLiftSharePct).toBeGreaterThan(d.whpSharePct);
    });
  });

  it('and on the shallow teaching well it is NOT, which is why the parts are reported', () => {
    // IBENO-2 sets its pump at 2100 ft against a 180 psia wellhead, so the
    // wellhead term is the biggest of the three. A rule of thumb that says the
    // lift is always most of the head is wrong on this well, and the engine
    // never uses the decomposition to GET the head, only to report it.
    const d = L.tdhDecomposition(L.teachingWellCase(L.IBENO_2));
    expect(d.whpSharePct).toBeGreaterThan(d.netLiftSharePct);
    expect(d.whpSharePct).toBeGreaterThan(d.frictionSharePct);
    expect(Math.abs(d.summedLessPressureTdhFt)).toBeLessThan(1e-9);
  });

  it('the discharge pressure is an INPUT and the module will not guess it', () => {
    L.allCases().forEach((c) => {
      expect(L.tdhDecomposition(c).pDischargePsia).toBe(c.inp.pDischargePsia);
    });
  });
});

describe('CLAIM: the separator makes the pumped fluid heavier', () => {
  it('taking gas out raises the density and the gradient', () => {
    L.separatorDensityRows().forEach((r) => {
      const c = L.goldenDesign(r.id);
      if (c.inp.separatorEfficiency > 0) {
        expect(r.densityGainLbFt3).toBeGreaterThan(0);
        expect(r.gradientGainPsiPerFt).toBeGreaterThan(0);
      } else {
        near(r.densityGainLbFt3, 0, 1e-12);
      }
    });
  });

  it('the verdict crosses both published thresholds on the teaching well', () => {
    const rows = L.gasVerdictSweepRows(L.teachingWellCase(L.QUA_IBOE_4));
    const verdicts = new Set(rows.map((r) => r.verdict));
    expect(verdicts.has('standard')).toBe(true);
    expect(verdicts.has('gasHandler')).toBe(true);
    rows.forEach((r) => {
      if (r.gvfThroughPump > L.ESP_THRESHOLDS.handlerMaxGvf) expect(r.verdict).toBe('separatorRequired');
      else if (r.gvfThroughPump > L.ESP_THRESHOLDS.standardMaxGvf) expect(r.verdict).toBe('gasHandler');
      else expect(r.verdict).toBe('standard');
    });
  });

  it('the teaching well lands BETWEEN the thresholds, where neither published design does', () => {
    const qua = L.teachingWellCase(L.QUA_IBOE_4);
    expect(qua.gas.verdict).toBe('gasHandler');
    L.GOLDEN_DESIGN_IDS.forEach((id) => expect(L.goldenDesign(id).gas.verdict).toBe('standard'));
  });
});

describe('CLAIM: selectCable ampacityOk is true by construction on the shipped table', () => {
  it('the shipped table declares no ampacity at all', () => {
    L.catalogueCableRows().forEach((c) => {
      expect(c.ampacityDeclared).toBe(false);
      expect(c.ampacityA).toBeNull();
    });
  });

  it('so the pick runs on voltage drop alone, on every case in the course', () => {
    const picks = [
      L.cablePick(L.goldenCablePickArgs(0)),
      L.cablePick(L.goldenCablePickArgs(1)),
      L.ampacityGateFixtures().onShippedTable,
      ...L.TEACHING_WELLS.map((W) => L.cablePick(L.wellCablePickArgs(W))),
    ];
    picks.forEach((p) => {
      expect(p.everyCandidatePassedAmpacity).toBe(true);
      expect(p.acceptableEqualsDropOnEveryCandidate).toBe(true);
    });
  });

  it('the published gate: 192 A goes down 6 AWG because the check had nothing to check', () => {
    const gates = L.ampacityGateFixtures();
    expect(gates.onShippedTable.chosenLabel).toBe('6 AWG');
    near(gates.onShippedTable.candidates[0].amps, 192, 1e-9);
    // the arithmetic did not change, the DATA did
    expect(gates.withAmpacityColumn.chosenLabel).toBe('1 AWG');
    const failed = gates.withAmpacityColumn.candidates.filter((c) => !c.ampacityOk);
    expect(failed).toHaveLength(3);
  });

  it('and when nothing qualifies it returns nothing rather than the least bad candidate', () => {
    const none = L.ampacityGateFixtures().nothingQualifies;
    expect(none.chosenLabel).toBeNull();
    expect(none.candidates.every((c) => !c.ok)).toBe(true);
  });
});

describe('CLAIM: the pick made on the two powers, and where it flips', () => {
  it('none of the four ordinary strings move, and the fifth does', () => {
    const studies = L.twoPowerPickStudies();
    expect(studies).toHaveLength(5);
    expect(studies.slice(0, 4).every((s) => !s.pickMoved)).toBe(true);
    const flip = studies[4];
    expect(flip.pickMoved).toBe(true);
    expect(flip.chosenOnShaft).toBe('6 AWG');
    expect(flip.chosenOnStack).toBe('4 AWG');
    // the flip window is the limit divided by the power ratio up to the limit
    expect(flip.decidingDropOnShaftPct).toBeLessThanOrEqual(flip.maxDropPct);
  });

  it('the teaching mirror of the capstone cable study finds exactly that flip', () => {
    const mirror = L.teachingCableFlipStudy();
    expect(mirror).toHaveLength(1);
    expect(mirror[0].label).toContain('IBENO-2');
    expect(mirror[0].label).toContain(String(L.IBENO_FLIP_CABLE_LENGTH_FT));
  });
});

describe('CLAIM: three messages printed the threshold they had just failed', () => {
  it('underCurve fires below 0.85 and used to print 85 across the whole first tenth', () => {
    const rows = L.underCurveBandRows();
    rows.forEach((r) => {
      expect(r.flagRaised).toBe(true);
      expect(r.oldPrintEqualledThreshold).toBe(true);
    });
    // the fix: one decimal place, so the printed number can sit off the threshold
    expect(rows.filter((r) => r.printsNowPct !== '85.0').length).toBeGreaterThan(0);
    expect(rows[0].printsNowPct).toBe('84.5');
  });

  it('ampsHigh fires above 1.05 and had the same defect over (1.05, 1.055]', () => {
    const rows = L.ampsHighBandRows();
    // The defect band is OPEN at both ends: 1.055 itself already rounds to 106,
    // so the printing only collided with the threshold strictly below it.
    const inBand = rows.filter((r) => r.load > 1.05 && r.load < 1.055);
    expect(inBand.length).toBeGreaterThan(0);
    inBand.forEach((r) => {
      expect(r.flagRaised).toBe(true);
      expect(r.oldPrintEqualledThreshold).toBe(true);
      expect(r.messages[0]).toContain(`${r.printsNowPct} percent`);
    });
    expect(rows.find((r) => r.load === 1.055).oldPrintEqualledThreshold).toBe(false);
    // and the flag does NOT fire exactly at the threshold, which is why it matters
    expect(rows.find((r) => r.load === 1.05).flagRaised).toBe(false);
  });

  it('ampsLow fires below 0.40 and had the same defect over [0.395, 0.40)', () => {
    const rows = L.ampsLowBandRows();
    const inBand = rows.filter((r) => r.load >= 0.395 && r.load < 0.4);
    expect(inBand.length).toBeGreaterThan(0);
    inBand.forEach((r) => {
      expect(r.flagRaised).toBe(true);
      expect(r.oldPrintEqualledThreshold).toBe(true);
    });
    expect(rows.find((r) => r.load === 0.4).flagRaised).toBe(false);
  });

  it('the fix changed three message templates and no arithmetic', () => {
    expect(L.DIAGNOSIS_FIX).toEqual({
      thresholdsChanged: 0, returnedFieldsChanged: 0, messageTemplatesChanged: 3,
    });
    // every returned field is still what it was: the ratio, not the printing
    L.diagnosisHeadRatioRows().forEach((r) => {
      relNear(r.headRatio, r.actualHeadFt / r.expectedHeadFt, 1e-15);
      near(r.printedPct, r.headRatio * 100, 1e-12);
    });
  });

  it('a diagnosis never names a cause', () => {
    const codes = new Set(L.diagnosisHeadRatioRows().flatMap((r) => r.flagCodes));
    ['wear', 'gasLock', 'worn', 'failure'].forEach((c) => expect(codes.has(c)).toBe(false));
    const under = L.diagnosisHeadRatioRows().find((r) => r.flagCodes.includes('underCurve'));
    expect(under.messages.join(' ')).toContain('all look like this');
  });
});

describe('CLAIM: the engine reports viscosity and refuses to correct for it', () => {
  it('above the threshold a correction is REQUIRED and none is applied', () => {
    L.viscosityCheckRows().forEach((r) => {
      expect(r.correctionRequired).toBe(r.viscosityCSt > L.ESP_THRESHOLDS.viscosityCorrectionCSt);
      expect(r.factorsApplied).toBe(false);
      if (r.correctionRequired) expect(r.note).toContain('Hydraulic Institute');
    });
  });

  it('factors are applied only when the user supplies them', () => {
    const v = L.viscosityFactorRow();
    relNear(v.correctedHeadFt, v.uncorrectedHeadFt * v.headFactor, 1e-15);
    relNear(v.correctedEfficiency, v.uncorrectedEfficiency * v.efficiencyFactor, 1e-15);
    expect(v.unchangedWithNoFactors).toBe(true);
  });
});

describe('CLAIM: what the three modules actually refuse', () => {
  const r = L.refusals();

  it('a curve on two points is refused outright', () => {
    expect(r.twoPointsOk).toBe(false);
    expect(r.twoPointsHeadFitReturned).toBe(false);
    expect(r.twoPointsMessage).toContain('at least three points');
  });

  it('a curve with no efficiency points still reads head and refuses power', () => {
    expect(r.noEfficiencyOk).toBe(true);
    expect(Number.isFinite(r.noEfficiencyHeadAt2500Ft)).toBe(true);
    expect(Number.isNaN(r.noEfficiencyBhpPerStage)).toBe(true);
    expect(Number.isNaN(r.noEfficiencyBepQBpd)).toBe(true);
  });

  it('the arithmetic refusals all return NaN rather than a number', () => {
    [r.brakeHpAtZeroEfficiency, r.stageCountAtZeroHead, r.stageCountAtNegativeHead,
      r.tdhAtZeroGradientFt, r.motorCurrentAtZeroNameplateHp, r.motorCurrentAtZeroNameplateAmps,
      r.zeroFrequencyHeadFt, r.bepWithNoEfficiencyQBpd, r.bepWithNoEfficiencyHeadFt,
    ].forEach((v) => expect(Number.isNaN(v)).toBe(true));
    // but a zero gradient still hands back the pressure difference it does know
    near(r.tdhAtZeroGradientDpPsi, 2000, 1e-12);
    expect(r.zeroFrequencyRegion).toBe('invalid');
  });

  it('below half load the current estimate is FLAGGED rather than refused', () => {
    near(r.partLoadLoadFraction, 0.2, 1e-12);
    expect(Number.isFinite(r.partLoadAmps)).toBe(true);
    expect(r.partLoadEstimateWeak).toBe(true);
  });
});

describe('CLAIM: the stack curve is the published range scaled by the speed ratio', () => {
  it('a slower drive plots a shorter curve, and head falls across it', () => {
    const sc = L.stackCurveRows();
    near(sc.qLoBpd, sc.publishedLowTimesRatioBpd, 1e-9);
    near(sc.qHiBpd, sc.publishedHighTimesRatioBpd, 1e-9);
    expect(sc.points).toHaveLength(12);
    for (let i = 1; i < sc.points.length; i += 1) {
      expect(sc.points[i].headFt).toBeLessThan(sc.points[i - 1].headFt);
    }
  });
});

// ---------------------------------------------------------------------------
// 3. THE EIGHTEEN GRADED FIELDS.
// ---------------------------------------------------------------------------

describe('the capstone derivation', () => {
  const values = L.capstoneValues();

  it('reproduces all eighteen graded answers inside the grader own absolute band', () => {
    CAPSTONE_FIELDS.forEach(([, key, expected, tol]) => {
      expect(values[key], key).toBeDefined();
      expect(Math.abs(values[key] - expected), `${key}: ${values[key]} against ${expected}`)
        .toBeLessThanOrEqual(tol);
    });
  });

  it('carries exactly eighteen fields, six to a tier', () => {
    expect(Object.keys(values)).toHaveLength(18);
    ['beginner', 'intermediate', 'advanced'].forEach((tier) => {
      expect(Object.values(L.CAPSTONE_TIERS).filter((t) => t === tier)).toHaveLength(6);
    });
    CAPSTONE_FIELDS.forEach(([tier, key, , tol]) => {
      expect(L.CAPSTONE_TIERS[key]).toBe(tier);
      expect(L.CAPSTONE_TOLERANCES[key]).toBe(tol);
      expect(L.CAPSTONE_FIELD_UNITS[key]).toBeTruthy();
    });
  });

  it('is deterministic', () => {
    expect(L.capstoneValues()).toEqual(values);
  });
});

// ---------------------------------------------------------------------------
// 4. THE SEVENTY EIGHT SHIPPED LESSONS.
// ---------------------------------------------------------------------------

const DIGEST_PATH = '/root/pd-wip-esp/digest.txt';

/**
 * Lines in the digest that carry an equals sign but are PROSE, not a quantity,
 * plus the generator's own leak guard verdict block, which is a statement about
 * the digest rather than teaching material.
 */
const DIGEST_NON_QUANTITY_LABELS = [
  'constant, the pressure form of the same statement is hp',
  'leak guard, graded fields checked',
  'leak guard, unit shiftings checked',
  'leak guard, numbers landing inside ten tolerances of a graded answer',
  'leak guard, numbers withheld',
  'leak guard, closest approach, field',
  'leak guard, closest approach, distance in tolerances',
];

/**
 * The only labels the lab prints that the SHIPPED digest does not carry.
 *
 * The generator gained these two rows per case after digest.txt was cut, to stop
 * the sizing block contradicting the derate sweep: without the derate the sizing
 * ran at, QUA-IBOE-4 shows a selection load fraction over one and a
 * motorOverloaded warning in one block and 0.9542 with no warning in the other,
 * and a lesson writer reported that as a contradiction. They are engine returns
 * like every other row here, and no shipped lesson quotes them.
 */
// EMPTY, and it should stay empty.
//
// This held eight derate labels for about two minutes. The lab was written
// against a digest whose generator had already gained those rows but which had
// not been regenerated yet, so the lab was genuinely ahead of the shipped file
// and the allowlist was the honest thing to write. The digest was regenerated
// shortly afterwards and the allowlist became a lie in the other direction:
// the test then demanded that eight labels be MISSING from a file that had
// them, and it failed.
//
// An allowlist for a transient state is a gate with a timer on it. If this
// list is ever non-empty again, regenerate the digest instead and put it back
// to nothing, because a lab ahead of its own digest is a condition to fix
// rather than a condition to record.
const LAB_AHEAD_OF_SHIPPED_DIGEST = [];

/**
 * The one place the VENDORED ENGINE is now ahead of the shipped digest.
 *
 * Engines #113 and #114 swept 27 warning messages that printed the threshold
 * they had just failed, and the re-vendor at 03c6a0fd landed after digest.txt
 * was cut. `motorOverloaded` now names the derate, the usable rating and the
 * load fraction, because "95.4 hp against a 100 hp motor" reads as comfortably
 * inside rating while what tripped the flag is 95.4 / (100 x 0.88) = 1.084. The
 * NUMBER in the message did not move and no other teaching value moved at all:
 * this is a display string, and it is listed rather than hidden so that a lesson
 * quoting the old wording can be found and corrected.
 */
const DIGEST_BEHIND_THE_ENGINE = [
  'teaching well QUA-IBOE-4, warning motorOverloaded',
];

const readDigest = () => {
  const map = new Map();
  fs.readFileSync(DIGEST_PATH, 'utf8').split('\n').forEach((line) => {
    if (!line || line.startsWith('#')) return;
    const m = line.match(/^(.+?) = (.*)$/);
    if (!m) return;
    if (!map.has(m[1])) map.set(m[1], []);
    map.get(m[1]).push(m[2]);
  });
  return map;
};

const digestAvailable = fs.existsSync(DIGEST_PATH);

describe('the teaching quantities', () => {
  const rows = L.teachingQuantities();
  const map = L.teachingQuantityMap();

  it('is a long list of source tagged label and value pairs', () => {
    expect(rows.length).toBeGreaterThan(2900);
    rows.forEach((r) => {
      expect(typeof r.label).toBe('string');
      expect(r.label.length).toBeGreaterThan(0);
      expect(['number', 'boolean', 'string']).toContain(typeof r.value);
    });
  });

  it('every label names its source: a published case, the catalogue, a gate fixture or a teaching case', () => {
    const prefixes = [
      'constant,', 'threshold,', 'catalogue ', 'golden ', 'golden,', 'reference stage ', 'the golden ',
      'teaching curve ', 'teaching well ', 'recorded finding', 'gradient conversion,',
      'gate fixture ', 'electrical,', 'the seam,', 'the fix,', 'underCurve band ', 'ampsHigh band ',
      'ampsLow band ', 'viscosity', 'refusal,', 'published design ',
    ];
    rows.forEach((r) => {
      expect(prefixes.some((p) => r.label.startsWith(p)), r.label).toBe(true);
    });
  });

  it('names OKARI-9 nowhere, and no capstone condition', () => {
    const text = rows.map((r) => `${r.label} = ${r.value}`).join('\n');
    expect(text).not.toContain('OKARI');
    expect(text).not.toMatch(/\b(stage_fit_head_rmse_ft|tdh_ft|motor_amps_a|diag_head_ratio_frac)\b/);
  });

  it('carries both published designs, both teaching wells and the teaching curve', () => {
    const text = rows.map((r) => r.label).join('\n');
    expect(text).toContain('golden design gassyOffshore');
    expect(text).toContain('golden design highWaterCut');
    expect(text).toContain('teaching well QUA-IBOE-4');
    expect(text).toContain('teaching well IBENO-2');
    expect(text).toContain('teaching curve BRASS-11');
    expect(L.TEACHING_WELLS).toHaveLength(2);
  });

  it('carries no em dash and no en dash anywhere', () => {
    const text = rows.map((r) => `${r.label} = ${r.value}`).join('\n');
    expect(text).not.toMatch(/[\u2013\u2014]/);
    // and neither does the lab source
    expect(fs.readFileSync(path.join(HERE, 'espLab.js'), 'utf8')).not.toMatch(/[\u2013\u2014]/);
    expect(fs.readFileSync(path.join(HERE, 'espLab.test.js'), 'utf8')).not.toMatch(/[\u2013\u2014]/);
  });

  it('is deterministic', () => {
    expect(L.teachingQuantities()).toEqual(rows);
  });

  it('has the identity the lessons were written against', () => {
    // A checksum, so the agreement below is pinned even on a machine that does
    // not carry the wave's working directory. Any change to a teaching number,
    // a label or the list's order moves it.
    const text = rows
      .map((r) => `${r.label} = ${typeof r.value === 'number' ? r.value.toPrecision(15) : String(r.value)}`)
      .join('\n');
    expect(crypto.createHash('sha256').update(text).digest('hex'))
      .toBe('ad642caac01e0bf578b0372d75e6a1c4a0c1bb1c470cb1e9e21c1c321fcdf612');
    expect(map.size).toBe(3000);
  });
});

describe.skipIf(!digestAvailable)('AGREEMENT WITH THE SHIPPED DIGEST that the 78 lessons quote', () => {
  // A lab value that disagrees with /root/pd-wip-esp/digest.txt breaks a lesson
  // that is already written, so this is compared label for label at the digest's
  // own printed precision rather than spot checked.
  const digest = digestAvailable ? readDigest() : new Map();
  const lab = L.teachingQuantityMap();

  it('every teaching quantity the lab exposes agrees with the digest', () => {
    const problems = [];
    lab.forEach((values, label) => {
      if (LAB_AHEAD_OF_SHIPPED_DIGEST.includes(label)) return;
      if (DIGEST_BEHIND_THE_ENGINE.includes(label)) return;
      const printed = digest.get(label);
      if (!printed) { problems.push(`no digest line "${label}"`); return; }
      if (printed.length !== values.length) {
        problems.push(`"${label}": lab prints ${values.length}, digest prints ${printed.length}`);
        return;
      }
      values.forEach((value, i) => {
        const text = printed[i];
        if (typeof value === 'number') {
          const m = text.match(/^(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?|NaN|Infinity|-Infinity)(?: .*)?$/);
          if (!m) { problems.push(`"${label}": lab number ${value}, digest "${text}"`); return; }
          const digestValue = Number(m[1]);
          if (Number.isNaN(digestValue)) {
            if (!Number.isNaN(value)) problems.push(`"${label}": lab ${value}, digest NaN`);
            return;
          }
          const decimals = (m[1].split('.')[1] || '').length;
          const band = 0.5 * 10 ** -decimals + 1e-9 * Math.abs(digestValue);
          if (!(Math.abs(value - digestValue) <= band)) {
            problems.push(`"${label}": lab ${value}, digest "${text}"`);
          }
        } else if (String(value) !== text) {
          problems.push(`"${label}": lab "${value}", digest "${text}"`);
        }
      });
    });
    expect(problems).toEqual([]);
  });

  it('every quantity the digest carries is reachable from the lab', () => {
    const unreachable = [...digest.keys()]
      .filter((label) => !lab.has(label))
      .filter((label) => !DIGEST_NON_QUANTITY_LABELS.includes(label));
    expect(unreachable).toEqual([]);
  });

  it('and the only labels the lab adds are the eight the generator gained afterwards', () => {
    const added = [...lab.keys()].filter((label) => !digest.has(label));
    expect(added.sort()).toEqual([...LAB_AHEAD_OF_SHIPPED_DIGEST].sort());
  });
});

// ---------------------------------------------------------------------------
// 5. THE LEAK GATE.
// ---------------------------------------------------------------------------

/**
 * Every teaching value in the lab, reachable the way a panel reaches it: not just
 * the digest list, but a deep walk of every accessor's whole return value, so a
 * field a panel renders that no lesson quotes is covered too.
 */
const teachingSurface = () => {
  const cases = L.allCases();
  const named = [
    ['VENDOR_CURVE', () => L.VENDOR_CURVE],
    ['ESP_THRESHOLDS', () => L.ESP_THRESHOLDS],
    ['catalogueStageRows', L.catalogueStageRows],
    ['catalogueCableRows', L.catalogueCableRows],
    ['catalogueMotorRows', L.catalogueMotorRows],
    ['vendorPublishedPoints', L.vendorPublishedPoints],
    ['vendorCurveFit', L.vendorCurveFit],
    ['vendorFitResidualRows', L.vendorFitResidualRows],
    ['vendorBep', L.vendorBep],
    ['vendorDutyRows', L.vendorDutyRows],
    ['goldenReferenceCurveRows', L.goldenReferenceCurveRows],
    ['goldenAffinityRows', L.goldenAffinityRows],
    ['affinityMaxDeviation', L.affinityMaxDeviation],
    ['speedSweepRows', L.speedSweepRows],
    ['goldenExtrapolatedRow', L.goldenExtrapolatedRow],
    ['vendorExtrapolationRows', L.vendorExtrapolationRows],
    ['referenceExtrapolationRows', L.referenceExtrapolationRows],
    ['efficiencyTailRows', L.efficiencyTailRows],
    ['fitExhaustion', L.fitExhaustion],
    ['brassTranscriptionRows', L.brassTranscriptionRows],
    ['viscosityCheckRows', L.viscosityCheckRows],
    ['viscosityFactorRow', L.viscosityFactorRow],
    ['RECORDED_FINDING_40HZ', () => L.RECORDED_FINDING_40HZ],
    ['separatorDensityRows', L.separatorDensityRows],
    ['gradientConversionSummary', L.gradientConversionSummary],
    ['gradientConventionRows', L.gradientConventionRows],
    ['requirementSweepRows', L.requirementSweepRows],
    ['twoPowerCostRows', L.twoPowerCostRows],
    ['goldenElectricalRows', L.goldenElectricalRows],
    ['electricalMaxDeviation', L.electricalMaxDeviation],
    ['copperResistanceRows', L.copperResistanceRows],
    ['loadFractionSeamRows', L.loadFractionSeamRows],
    ['SEAM_FINDING', () => L.SEAM_FINDING],
    ['ampacityGateFixtures', L.ampacityGateFixtures],
    ['twoPowerPickStudies', L.twoPowerPickStudies],
    ['teachingCableFlipStudy', L.teachingCableFlipStudy],
    ['diagnosisFixture', L.diagnosisFixture],
    ['diagnosisHeadRatioRows', L.diagnosisHeadRatioRows],
    ['underCurveBandRows', L.underCurveBandRows],
    ['ampsHighBandRows', L.ampsHighBandRows],
    ['ampsLowBandRows', L.ampsLowBandRows],
    ['diagnosisFromPressures', L.diagnosisFromPressures],
    ['diagnosisRegionRows', L.diagnosisRegionRows],
    ['stackCurveRows', L.stackCurveRows],
    ['refusals', L.refusals],
    ['teachingQuantities', L.teachingQuantities],
    ...L.REFERENCE_CURVE_IDS.map((id) => [`referenceCurveSummary ${id}`, () => L.referenceCurveSummary(id)]),
    ...L.REFERENCE_CURVE_IDS.map((id) => [`referenceCurve ${id}`, () => L.referenceCurve(id)]),
    ...['ref-540-2500', 'ref-675-7000'].map((id) => [`referenceDutyRows ${id}`, () => L.referenceDutyRows(id)]),
    ...L.GOLDEN_DESIGN_IDS.map((id) => [`goldenDesign ${id}`, () => L.goldenDesign(id)]),
    ...L.GOLDEN_DESIGN_IDS.map((id) => [`goldenIntakeRecorded ${id}`, () => L.goldenIntakeRecorded(id)]),
    ...L.GOLDEN_DESIGN_IDS.map((id) => [`goldenSizingRecorded ${id}`, () => L.goldenSizingRecorded(id)]),
    ...L.GOLDEN_DESIGN_IDS.map((id) => [`designTurndownRows ${id}`, () => L.designTurndownRows(id)]),
    ...L.GOLDEN_DESIGN_IDS.map((id) => [`designZeroHeadFrequency ${id}`, () => L.designZeroHeadFrequency(id)]),
    ...L.TEACHING_WELLS.map((W) => [`teachingWellCase ${W.id}`, () => L.teachingWellCase(W)]),
    ...L.TEACHING_WELLS.map((W) => [`wellCablePick ${W.id}`, () => L.cablePick(L.wellCablePickArgs(W))]),
    ...L.TEACHING_WELLS.map((W) => [`surfaceAcrossCablesRows ${W.id}`, () => L.surfaceAcrossCablesRows(W)]),
    ...[0, 1].map((i) => [`goldenCablePick ${i}`, () => L.cablePick(L.goldenCablePickArgs(i))]),
    ...cases.map((c) => [`intakeReading ${c.id}`, () => L.intakeReading(c)]),
    ...cases.map((c) => [`gasVerdictSweepRows ${c.id}`, () => L.gasVerdictSweepRows(c)]),
    ...cases.map((c) => [`tdhDecomposition ${c.id}`, () => L.tdhDecomposition(c)]),
    ...cases.map((c) => [`stackSizing ${c.id}`, () => L.stackSizing(c)]),
  ];

  const out = [];
  const walk = (v, at) => {
    if (typeof v === 'number') { if (Number.isFinite(v)) out.push({ at, value: v }); return; }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${at}[${i}]`)); return; }
    if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${at}.${k}`));
  };
  named.forEach(([name, fn]) => walk(fn(), name));
  return out;
};

describe('THE LEAK GATE: no teaching number may be a graded capstone answer', () => {
  // THE THRESHOLD IS THE GRADER'S OWN, AND IT IS ABSOLUTE.
  //
  // `public.academy_submit_capstone` in
  // migrations/20260715_n4_petrophysics_capstone.sql grades each field with
  //
  //     if v_got is not null and abs(v_got - v_exp) <= v_tol then
  //
  // so `tol` is an absolute band in the field's own units and not a fraction of
  // the value. `tdh_ft` is accepted within 0.0018 ft, not within 6.6 ft. Read
  // that function before touching the numbers below: a guard whose threshold is
  // inferred rather than read comes out thousands of times too wide, and a gate
  // that wide withholds good teaching material for nothing.
  //
  // The gate is DIMENSION BLIND on purpose. The grader compares numbers and
  // never asks what they were a measurement of, so neither does this: a head in
  // feet that happens to land on the graded motor current would be marked
  // correct if a learner pasted it into that box.
  //
  // WHAT THE GATE FINDS, WHICH IS WORTH STATING POSITIVELY: NOTHING. The
  // published goldens, the published gate fixtures and all three teaching cases
  // are clean. The closest any teaching number comes to a graded answer is the
  // 0.8461 head ratio in the underCurve boundary band, which is 50 tolerances
  // from `diag_head_ratio_frac`, and that one is close on purpose: the capstone's
  // own survey lands in the same band, which is the whole reason the band is
  // teaching material.
  const targets = L.leakGuardTargets();

  it('the guard is built from all eighteen fields in all three unit shiftings', () => {
    expect(targets).toHaveLength(18 * 3);
    expect(L.LEAK_GUARD_MARGIN).toBe(10);
    expect(L.LEAK_GUARD_SCALINGS.map((s) => s.factor)).toEqual([1, 1000, 0.001]);
    CAPSTONE_FIELDS.forEach(([, key, , tol]) => {
      const t = targets.find((x) => x.key === key && x.tag === 'as graded');
      expect(t.gradingBand).toBe(tol);
      expect(t.band).toBe(10 * tol);
    });
    // and under a unit shift the ABSOLUTE band shifts with the value
    expect(targets.find((t) => t.key === 'tdh_ft' && t.tag === 'x1000').gradingBand).toBe(1.8);
    expect(targets.find((t) => t.key === 'tdh_ft' && t.tag === 'x0.001').gradingBand).toBe(1.8e-6);
  });

  it('NO teaching quantity is within ten times a grading band of a graded answer', () => {
    const hits = [];
    L.teachingQuantities().forEach((r) => {
      if (typeof r.value !== 'number' || !Number.isFinite(r.value)) return;
      const hit = L.leakGuardHit(r.value, targets);
      if (hit) hits.push(`${r.label} = ${r.value} is within ${hit.band} of ${hit.key} ${hit.tag}`);
    });
    expect(hits).toEqual([]);
  });

  it('NOR is any number anywhere on the panel facing surface', () => {
    const surface = teachingSurface();
    expect(surface.length).toBeGreaterThan(4000);
    const hits = [];
    surface.forEach(({ at, value }) => {
      const hit = L.leakGuardHit(value, targets);
      if (hit) hits.push(`${at} = ${value} is within ${hit.band} of ${hit.key} ${hit.tag}`);
    });
    expect(hits).toEqual([]);
  });

  it('THE GUARD IS LIVE: every graded answer is caught, and so is a prose rounding of it', () => {
    // Deliberate failure. Every graded answer, and a drift of nine tenths of the
    // guard band either way, which is the prose rounding the ten times margin
    // exists to cover. Not one of them gets past the gate.
    Object.entries(L.capstoneValues()).forEach(([key, v]) => {
      const drift = 0.9 * L.LEAK_GUARD_MARGIN * L.CAPSTONE_TOLERANCES[key];
      [v, v + drift, v - drift].forEach((planted) => {
        const hit = L.leakGuardHit(planted, targets);
        expect(hit, `${key} planted as ${planted} was not caught`).not.toBeNull();
        expect(hit.key).toBe(key);
      });
    });
  });

  it('THE GUARD IS LIVE: a planted UNIT SHIFTED leak is caught too', () => {
    const v = L.capstoneValues();
    expect(L.leakGuardHit(v.tdh_ft / 1000, targets).key).toBe('tdh_ft');
    expect(L.leakGuardHit(v.motor_amps_a * 1000, targets).key).toBe('motor_amps_a');
    expect(L.leakGuardHit(v.cable_loss_kw / 1000, targets).key).toBe('cable_loss_kw');
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: ordinary teaching numbers pass', () => {
    // The published designs' own total dynamic heads, which are the same KIND of
    // number as the graded one and nowhere near it.
    L.GOLDEN_DESIGN_IDS.forEach((id) => {
      expect(L.leakGuardHit(L.goldenDesign(id).tdh.tdhFt, targets)).toBeNull();
    });
    expect(L.leakGuardHit(L.vendorBep().qBpd, targets)).toBeNull();
    expect(L.leakGuardHit(0, targets)).toBeNull();
    expect(L.leakGuardHit(NaN, targets)).toBeNull();
  });

  it('the closest a teaching number comes is the underCurve band, and it is 50 tolerances away', () => {
    let best = null;
    L.teachingQuantities().forEach((r) => {
      if (typeof r.value !== 'number' || !Number.isFinite(r.value)) return;
      targets.forEach((t) => {
        const d = Math.abs(r.value - t.value) / t.gradingBand;
        if (best === null || d < best.d) best = { d, key: t.key, label: r.label };
      });
    });
    expect(best.d).toBeGreaterThan(L.LEAK_GUARD_MARGIN);
    expect(best.d).toBeGreaterThan(50);
  });
});

// ---------------------------------------------------------------------------
// 6. THE PANEL GUARD: A PANEL MAY NOT REACH INTO THE CAPSTONE.
// ---------------------------------------------------------------------------

/**
 * Every export of espLab.js that is built on the OKARI-9 capstone's own
 * conditions. Anything here is for the grader, this file's own tests and the
 * migration headers, and for nothing that a learner can see.
 *
 * PD1 learned this the hard way: its lab exported the whole capstone surface
 * beside the teaching surface with nothing between them, and the two functions a
 * panel author reaches for first were both capstone-only. So every capstone
 * reader here is NAMED so a grep can find it, and every one of them has a
 * teaching mirror that does the same job on a case a learner may see.
 */
const CAPSTONE_ONLY = [
  'CAP',
  'OKARI_LABEL',
  'CAPSTONE_TIERS',
  'CAPSTONE_TOLERANCES',
  'CAPSTONE_FIELD_UNITS',
  'capstoneValues',
  'okariCurve',
  'okariCase',
  'okariDiagnosis',
  'okariTurndownLadder',
  'okariGradientStudy',
  'okariSeam',
  'okariCableStudy',
  'LEAK_GUARD_MARGIN',
  'LEAK_GUARD_SCALINGS',
  'leakGuardTargets',
  'leakGuardHit',
];

/** The teaching function a panel must use instead of each capstone reader. */
const CAPSTONE_MIRRORS = {
  okariCurve: 'vendorCurveFit',
  okariCase: 'goldenDesign',
  okariDiagnosis: 'diagnosisFixture',
  okariTurndownLadder: 'designTurndownRows',
  okariGradientStudy: 'gradientConventionRows',
  okariSeam: 'loadFractionSeamRows',
  okariCableStudy: 'teachingCableFlipStudy',
};

const CAPSTONE_NAME_PATTERN = /^(CAP$|CAP_|OKARI_|okari|CAPSTONE_|capstone|LEAK_GUARD_|leakGuard)/;

// The lab's exports as a plain object, so the guard can look a name up by string.
// That is the whole point of the naming rule: the check has to be able to ask
// "is anything called this", not "does this identifier exist".
const LAB = { ...L };

describe('THE PANEL GUARD: no panel may read the capstone', () => {
  it('every capstone-only export exists and is named so a grep can find it', () => {
    CAPSTONE_ONLY.forEach((name) => {
      expect(LAB[name], `${name} is missing from the lab`).toBeDefined();
      expect(CAPSTONE_NAME_PATTERN.test(name), `${name} is not named as capstone material`).toBe(true);
    });
  });

  it('and NOTHING else in the lab is named that way, so the grep cannot over-fire', () => {
    const misnamed = Object.keys(LAB)
      .filter((name) => CAPSTONE_NAME_PATTERN.test(name))
      .filter((name) => !CAPSTONE_ONLY.includes(name));
    expect(misnamed).toEqual([]);
  });

  it('every capstone reader a panel would want has a TEACHING mirror', () => {
    Object.entries(CAPSTONE_MIRRORS).forEach(([capstone, mirror]) => {
      expect(CAPSTONE_ONLY).toContain(capstone);
      expect(typeof LAB[mirror], `${mirror} must be a teaching function`).toBe('function');
      expect(CAPSTONE_NAME_PATTERN.test(mirror)).toBe(false);
    });
    // and every okari reader is covered by one
    Object.keys(LAB).filter((n) => n.startsWith('okari')).forEach((n) => {
      expect(Object.keys(CAPSTONE_MIRRORS), `${n} has no teaching mirror`).toContain(n);
    });
  });

  const panelSources = fs
    .readdirSync(HERE)
    .filter((f) => f.endsWith('.jsx'))
    .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

  const capstoneNamesIn = (text) => [...new Set([
    ...CAPSTONE_ONLY.filter((name) => new RegExp(`\\b${name}\\b`).test(text)),
    ...[...text.matchAll(/\bokari[A-Z]\w*/g)].map((m) => m[0]),
  ])];

  const gradedAnswersIn = (text) => Object.values(L.capstoneValues())
    .filter((v) => typeof v === 'number' && Number.isFinite(v))
    // Six significant figures of a graded answer is a leak at any rounding a
    // panel would plausibly print.
    .map((v) => v.toPrecision(6).replace(/0+$/, ''))
    .filter((s) => !s.includes('e'))
    .filter((s) => text.includes(s));

  it('THE GREP IS LIVE: it catches a panel that reaches into the capstone', () => {
    // The guard has to work before the panels exist, so it is proved on a
    // synthetic source rather than waiting for a real one to go wrong.
    const bad = "import { okariTurndownLadder, CAP } from './espLab.js';";
    expect(capstoneNamesIn(bad).sort()).toEqual(['CAP', 'okariTurndownLadder']);
    const printed = `const stages = ${L.capstoneValues().tdh_ft.toPrecision(6)};`;
    expect(gradedAnswersIn(printed).length).toBeGreaterThan(0);
    // and it does not fire on the teaching mirrors
    const good = "import { designTurndownRows, goldenDesign } from './espLab.js';";
    expect(capstoneNamesIn(good)).toEqual([]);
    expect(gradedAnswersIn(good)).toEqual([]);
  });

  it('no panel in this directory names a capstone-only export or prints a graded answer', () => {
    const problems = [];
    panelSources.forEach(({ file, text }) => {
      const names = capstoneNamesIn(text);
      if (names.length) problems.push(`${file} reaches into the capstone: ${names.join(', ')}`);
      const printed = gradedAnswersIn(text);
      if (printed.length) problems.push(`${file} prints a graded answer: ${printed.join(', ')}`);
    });
    expect(problems).toEqual([]);
  });
});
