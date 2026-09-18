// THE EIGHTEEN GRADED FC9 CAPSTONE ANSWERS, COMPUTED BY THE ENGINE.
//
// Three plants, six graded fields each, and NOT ONE OF THEM IS A CORROSION RATE
// THE CORRELATION PRODUCED. That is the design decision this wave rests on.
// `corrosion.js` exports eleven items it says outright are not sourced anywhere
// in the repository, plus one unresolved question about whether the protective
// scale factor multiplies the reaction term or the combined rate, and the repair
// record says in so many words that nothing downstream of that factor should be
// graded until it is read. A course that graded a de Waard-Milliams rate would
// be grading a learner on eleven numbers nobody can check.
//
// So the capstones grade what the engine can stand behind:
//   OBIGBO       what is in the stream and how fast it moves
//   NEMBE CREEK  the inhibitor arithmetic and the allowance, on a SURVEYED rate
//   SOKU         inversion on the engine's own verdict
//
// Usage:
//   node fc9_capstone.mjs            the human table, with the clearance report
//   node fc9_capstone.mjs --json     the rows make_fields.mjs writes
//
// NOTHING HERE READS THE DIGEST OR THE DIGEST GENERATOR, and the digest
// generator reads nothing here. The two run different plants at different
// conditions on purpose, and gate_capstone_leak.py proves it in both directions.
import process from 'node:process';

const ROOT = process.env.FC9_ENGINES || '/root/wt-fc9-nextgen/packages/engines';
const C = await import(`${ROOT}/engines/facilities/corrosion.js`);
const TOLPATH = process.env.FC9_TOLERANCE
  || '/root/wt-fc9-nextgen/src/components/course/panels/corrosion/gradedTolerance.js';
const { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } = await import(TOLPATH);

/* ---------------------------------------------------------- the machinery */

const ASSERTS = [];
const must = (claim, cond, detail) => {
  ASSERTS.push({ claim, pass: !!cond, detail: String(detail) });
  return !!cond;
};
const keys = (r) => (r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r));
/** A call this file LABELS a success. Asserts no error key and no non-finite number. */
const success = (label, r) => {
  must(`LABELLED A SUCCESS: ${label}`, !!(r && !r.error), r && r.error ? r.error : 'no error key');
  if (r && !r.error) {
    const bad = Object.entries(r).filter(([, v]) => typeof v === 'number' && !Number.isFinite(v));
    must(`SUCCESS CARRIES NO NON-FINITE NUMBER: ${label}`, bad.length === 0,
      bad.length ? bad.map(([k, v]) => `${k}=${v}`).join(', ') : 'every number finite');
  }
  return r;
};
/** A call this file LABELS a refusal. Asserts an error key. */
const refusal = (label, r) => {
  must(`LABELLED A REFUSAL: ${label}`, !!(r && r.error), r && r.error ? 'refused' : `returned keys [${keys(r)}]`);
  return r;
};

/**
 * ONE BISECTION ROUTINE, used for every Expert field. It bisects on a
 * PREDICATE THE ENGINE ANSWERS, never on a formula, and it refuses a bracket
 * whose two ends give the same verdict, because that bracket proves nothing.
 * 300 rounds takes a double to its last bit.
 */
const bisect = (lo, hi, pred, label) => {
  let a = lo; let b = hi;
  const pa = pred(a); const pb = pred(b);
  if (!must(`BISECTION BRACKET STRADDLES THE TURNOVER: ${label}`, pa !== pb,
    `pred(${lo})=${pa} pred(${hi})=${pb}`)) return NaN;
  for (let i = 0; i < 300; i += 1) {
    const m = (a + b) / 2;
    if (pred(m) === pa) a = m; else b = m;
    if (Math.abs(b - a) <= Math.abs(b) * 1e-15) break;
  }
  return (a + b) / 2;
};

/* ====================================================== OBIGBO, Associate

   A wet gas gathering line into the Obigbo manifold. Everything below is in
   the ENGINE'S OWN UNITS, and that is deliberate rather than lazy: the studio
   layer converts psig to bara by dividing by 14.5038, while the engine exports
   14.503773800721815, so the two disagree in the sixth significant figure.
   (The engine calls its own factor exact by definition, and it sits 1.9e-9
   above the factor the definitions give; digest section 24 measures that.) Grading a learner on which rounding the app happened to
   use would grade them on the app rather than on corrosion, so the capstone
   states the conditions the engine takes and the digest carries the conversion
   argument separately. That is one of the eighteen clearances below.
   ==================================================================== */

const OBIGBO = Object.freeze({
  tC: 64.8,
  pTotalBar: 137.42,
  co2MolFrac: 0.0237,
  h2sMolFrac: 0.00093,
  ph: 4.62,
  velocityMS: 3.4442,
  diameterM: 0.20272,
  densityKgM3: 860.19,
  viscosityPaS: 0.00114,
  flowRegime: 'waterWet',
  waterCutFrac: 1,
  inhibitorEfficiencyPct: 87,
  inhibitorAvailabilityPct: 91.4,
});

const obigboFug = success('Obigbo co2Fugacity', C.co2Fugacity({
  tC: OBIGBO.tC, pTotalBar: OBIGBO.pTotalBar, co2MolFrac: OBIGBO.co2MolFrac,
}));
const obigboSour = success('Obigbo sourServiceScreen', C.sourServiceScreen({
  ph2sBar: OBIGBO.pTotalBar * OBIGBO.h2sMolFrac,
}));
const obigboRegime = C.corrosionRegime({
  ph2sBar: OBIGBO.pTotalBar * OBIGBO.h2sMolFrac, pco2Bar: obigboFug.pco2Bar,
});
must('Obigbo corrosionRegime returns a finite ratio', Number.isFinite(obigboRegime.ratio), obigboRegime.ratio);
const obigboShear = success('Obigbo wallShearStressPa', C.wallShearStressPa({
  velocityMS: OBIGBO.velocityMS, diameterM: OBIGBO.diameterM,
  densityKgM3: OBIGBO.densityKgM3, viscosityPaS: OBIGBO.viscosityPaS,
}));
const obigboRate = success('Obigbo corrosionRate at the datasheet programme', C.corrosionRate(OBIGBO));
const obigboDatasheet = success('Obigbo corrosionRate at perfect availability',
  C.corrosionRate({ ...OBIGBO, inhibitorAvailabilityPct: 100 }));

/* ================================================= NEMBE CREEK, Professional

   A Nembe Creek oil line whose wall-loss rate came off a two-year ultrasonic
   survey, NOT out of the correlation. The survey number is the whole reason
   this tier is gradeable: it is stated, so every de Waard-Milliams constant,
   the scale factor and its unresolved placement, the pH correction and the
   Blasius pair are all out of the chain by construction. What the engine still
   supplies is the INHIBITOR ARITHMETIC, which carries no correlation constant
   at all, and the ALLOWANCE ARITHMETIC, which carries none either.
   ==================================================================== */

const NEMBE = Object.freeze({
  surveyedUninhibitedMmYr: 1.9826,
  corrosionAllowanceMm: 3.048,
  consumedMm: 0.6731,
  designLifeYears: 18,
  inhibitorEfficiencyPct: 93,
  inhibitorAvailabilityPct: 88.5,
  // The conditions the RATIO is measured at. The ratio is invariant to every
  // one of them, which is asserted below rather than claimed.
  tC: 68.4, pTotalBar: 44.83, co2MolFrac: 0.0192, ph: 4.71,
  velocityMS: 2.1341, diameterM: 0.10318,
});

const nembeCommon = {
  tC: NEMBE.tC, pTotalBar: NEMBE.pTotalBar, co2MolFrac: NEMBE.co2MolFrac, ph: NEMBE.ph,
  velocityMS: NEMBE.velocityMS, diameterM: NEMBE.diameterM, flowRegime: 'waterWet',
};
const nembeRate = success('Nembe corrosionRate at the programme', C.corrosionRate({
  ...nembeCommon,
  inhibitorEfficiencyPct: NEMBE.inhibitorEfficiencyPct,
  inhibitorAvailabilityPct: NEMBE.inhibitorAvailabilityPct,
}));
const nembeDatasheet = success('Nembe corrosionRate at perfect availability', C.corrosionRate({
  ...nembeCommon, inhibitorEfficiencyPct: NEMBE.inhibitorEfficiencyPct, inhibitorAvailabilityPct: 100,
}));
/** The retained fraction, measured as the engine's own rate ratio. */
const nembeRetained = nembeRate.rateMmYr / nembeRate.uninhibitedMmYr;
const nembeDatasheetRetained = nembeDatasheet.rateMmYr / nembeDatasheet.uninhibitedMmYr;
const nembeInhibitedRate = NEMBE.surveyedUninhibitedMmYr * nembeRetained;
const nembeLife = success('Nembe remainingLife at the inhibited survey rate', C.remainingLife({
  rateMmYr: nembeInhibitedRate,
  corrosionAllowanceMm: NEMBE.corrosionAllowanceMm,
  consumedMm: NEMBE.consumedMm,
  designLifeYears: NEMBE.designLifeYears,
}));
const nembeDatasheetLife = success('Nembe remainingLife at the datasheet rate', C.remainingLife({
  rateMmYr: NEMBE.surveyedUninhibitedMmYr * nembeDatasheetRetained,
  corrosionAllowanceMm: NEMBE.corrosionAllowanceMm,
  consumedMm: NEMBE.consumedMm,
  designLifeYears: NEMBE.designLifeYears,
}));
must('Nembe: the programme life is SHORTER than the datasheet life, which is the tier\'s whole point',
  nembeLife.remainingYears < nembeDatasheetLife.remainingYears,
  `${nembeLife.remainingYears} against ${nembeDatasheetLife.remainingYears}`);
must('Nembe: the programme does NOT meet the design life, so the shortfall is a real number',
  nembeLife.meetsDesignLife === false, `meetsDesignLife=${nembeLife.meetsDesignLife}`);

/* ========================================================== SOKU, Expert

   A Soku sour gas line where the wall shear has already taken the inhibitor
   credit away, so the datasheet efficiency is not what the line sees. Every
   field here is found by BISECTING an engine call until a flag or a number the
   engine returns turns over. The uninhibited rate is again stated from the
   operator's own inspection record, for the same reason as Nembe.
   ==================================================================== */

const SOKU = Object.freeze({
  surveyedUninhibitedMmYr: 2.1082,
  corrosionAllowanceMm: 4.7625,
  consumedMm: 1.3607,
  designLifeYears: 24,
  inhibitorEfficiencyPct: 96,
  inhibitorAvailabilityPct: 82.3,
  targetEffectiveProtectionPct: 88,
  tC: 74.9, pTotalBar: 88.61, co2MolFrac: 0.0154, ph: 4.83,
  velocityMS: 4.5739, diameterM: 0.15613,
});

const sokuCommon = {
  tC: SOKU.tC, pTotalBar: SOKU.pTotalBar, co2MolFrac: SOKU.co2MolFrac, ph: SOKU.ph,
  velocityMS: SOKU.velocityMS, diameterM: SOKU.diameterM, flowRegime: 'waterWet',
};
const sokuRate = success('Soku corrosionRate at the programme', C.corrosionRate({
  ...sokuCommon,
  inhibitorEfficiencyPct: SOKU.inhibitorEfficiencyPct,
  inhibitorAvailabilityPct: SOKU.inhibitorAvailabilityPct,
}));
const sokuRetained = sokuRate.rateMmYr / sokuRate.uninhibitedMmYr;
const sokuEffectiveRate = SOKU.surveyedUninhibitedMmYr * sokuRetained;

/** The allowance a life question actually has left, which the engine returns. */
const sokuBase = {
  corrosionAllowanceMm: SOKU.corrosionAllowanceMm,
  consumedMm: SOKU.consumedMm,
  designLifeYears: SOKU.designLifeYears,
};
const sokuProgrammeLife = success('Soku remainingLife at the effective rate',
  C.remainingLife({ ...sokuBase, rateMmYr: sokuEffectiveRate }));
must('Soku: the programme does NOT meet the design life, so every inversion below has a target',
  sokuProgrammeLife.meetsDesignLife === false, `meetsDesignLife=${sokuProgrammeLife.meetsDesignLife}`);

// 13. The largest rate at which the ENGINE still says the design life is met.
const sokuTolerableRate = bisect(1e-6, 5, (r) => C.remainingLife({ ...sokuBase, rateMmYr: r }).meetsDesignLife === true,
  'the tolerable rate, bisected on remainingLife.meetsDesignLife');

// 14. The availability at which the ENGINE's returned effective protection
//     first reaches the stated target, at the stated efficiency.
const sokuRequiredAvail = bisect(1, 100, (a) => success('Soku availability probe', C.corrosionRate({
  ...sokuCommon, inhibitorEfficiencyPct: SOKU.inhibitorEfficiencyPct, inhibitorAvailabilityPct: a,
})).effectiveInhibitionPct >= SOKU.targetEffectiveProtectionPct,
'the availability for the target effective protection, bisected on corrosionRate.effectiveInhibitionPct');

// 15. The availability at which the design life is met, the two engine doors
//     chained: the inhibitor ratio feeds the surveyed rate feeds the verdict.
const sokuAvailForLife = bisect(1, 100, (a) => {
  const r = C.corrosionRate({
    ...sokuCommon, inhibitorEfficiencyPct: SOKU.inhibitorEfficiencyPct, inhibitorAvailabilityPct: a,
  });
  const retained = r.rateMmYr / r.uninhibitedMmYr;
  return C.remainingLife({ ...sokuBase, rateMmYr: SOKU.surveyedUninhibitedMmYr * retained }).meetsDesignLife === true;
}, 'the availability for the design life, bisected through both engine doors');

// 16. The TOTAL allowance that, with 1.3607 mm already consumed, just meets the
//     design life. This is NOT requiredAllowanceMm, which ignores consumption,
//     and that gap is the Expert lesson.
const sokuAllowanceToReinstate = bisect(2, 40,
  (ca) => C.remainingLife({ ...sokuBase, corrosionAllowanceMm: ca, rateMmYr: sokuEffectiveRate }).meetsDesignLife === true,
  'the allowance to reinstate the design life, bisected on meetsDesignLife');
must('Soku: the reinstating allowance EXCEEDS requiredAllowanceMm, because that field ignores consumption',
  sokuAllowanceToReinstate > sokuProgrammeLife.requiredAllowanceMm,
  `${sokuAllowanceToReinstate} against ${sokuProgrammeLife.requiredAllowanceMm}`);

// 17. The life once the credit is gone: the surveyed rate with no inhibition.
const sokuStrippedLife = success('Soku remainingLife with the credit removed',
  C.remainingLife({ ...sokuBase, rateMmYr: SOKU.surveyedUninhibitedMmYr }));

// 18. How many times longer the credited life is. The rates share one chain, so
//     the ratio is the reciprocal of the retained fraction and nothing else.
const sokuCreditRatio = sokuProgrammeLife.remainingYears / sokuStrippedLife.remainingYears;

/* ======================================================== THE REFUSALS the
   capstones lean on, asserted so a tier cannot be written around behaviour the
   engine does not have. Each is LABELLED a refusal and must carry an error key.
   ==================================================================== */

refusal('a pH below the reference', C.corrosionRate({ ...nembeCommon, ph: 3.5 }));
refusal('a blank velocity', C.corrosionRate({ ...nembeCommon, velocityMS: undefined }));
refusal('an allowance already consumed', C.remainingLife({
  rateMmYr: 0.4, corrosionAllowanceMm: 3.048, consumedMm: 3.048, designLifeYears: 18,
}));
refusal('a screen with no density', C.screen({
  ...sokuCommon, h2sMolFrac: 0.001, viscosityPaS: 0.001,
  corrosionAllowanceMm: 4.7625, designLifeYears: 25,
}));

/* ==================================================== THE CLEARANCE REPORT

   Every held or withdrawn item, against every graded field, with the MECHANISM
   that clears it. Three mechanisms and no fourth:
     CONSTRUCTION  the capstone STATES the quantity the held item would supply
     IDENTITY      the held item enters only as an exact 1, so its value cannot
                   move the answer whichever term it multiplies
     CANCELLATION  the field is a ratio or a difference of two engine calls that
                   share the held chain bit for bit, so it divides out
     EXCLUSION     the held item is a label, a band, a threshold verdict, an
                   interval or a region, and no graded field reads a label
   Each mechanism is not asserted by being written down: the assertions below
   MEASURE it. INVARIANCE is the measurement for CONSTRUCTION and CANCELLATION,
   and a scale factor of exactly 1 is the measurement for IDENTITY.
   ==================================================================== */

const HELD = [
  'H1 every de Waard-Milliams constant: 0.0031, 1.4, 4.93, 1119, 0.58, 2.45, the 0.8 velocity exponent, the 0.2 diameter exponent',
  'H2 whether the protective scale factor multiplies the reaction term or the combined rate',
  'H3 the scale constants 2400, 0.6, 6.7 and the PUBLISHED film onset temperature',
  'H4 the pH slope of -0.5, the reference pH of 4, and what the correlation does below it',
  'H5 the 250 bar fugacity cap and what the correlation does above it',
  'H6 the H2S threshold value of 0.0035 bar',
  'H7 the H2S to CO2 transition ratios of 1/500 and 1/20',
  'H8 the 100 Pa film-stripping threshold and the 50 Pa moderate band',
  'H9 the Blasius coefficients 0.046 and -0.2 and the Reynolds 4000 switch',
  'H10 the rate category bands 0.1, 0.5 and 1.0 mm/yr',
  'H11 an inspection interval, a minimum thickness and a retirement thickness: NOT PROVIDED',
  'W1 WITHDRAWN: the MR0175 / ISO 15156 severity region and its material guidance',
];

const CLEARANCES = [];
const clear = (key, held, mechanism, how) => CLEARANCES.push({ key, held, mechanism, how });

/* -- OBIGBO. Measured invariance: recompute every Associate field at a second
      set of conditions that moves fCO2, the scale factor, the pH factor and the
      Reynolds branch, and require the graded value to be BIT IDENTICAL where it
      should be and to move where it should. */
const OBIGBO_FAR = {
  ...OBIGBO, tC: 41.7, pTotalBar: 311.4, ph: 6.9, velocityMS: 0.31, diameterM: 0.0508,
};
const obigboFarRate = success('Obigbo far-field corrosionRate', C.corrosionRate(OBIGBO_FAR));
const obigboFarDatasheet = success('Obigbo far-field at perfect availability',
  C.corrosionRate({ ...OBIGBO_FAR, inhibitorAvailabilityPct: 100 }));
must('CLEARANCE MEASUREMENT: the far-field case really does move the rate, so the invariance below is not vacuous',
  Math.abs(obigboFarRate.rateMmYr / obigboRate.rateMmYr - 1) > 0.5,
  `far ${obigboFarRate.rateMmYr} against near ${obigboRate.rateMmYr}`);
must('CLEARANCE MEASUREMENT: the far-field case crosses the 250 bar fugacity cap, so H5 is exercised',
  obigboFarRate.pressureCapApplied === true, `pressureCapApplied=${obigboFarRate.pressureCapApplied}`);
must('CLEARANCE by INVARIANCE: obigbo_effective_inhibition_pct is bit identical across the far-field case',
  obigboFarRate.effectiveInhibitionPct === obigboRate.effectiveInhibitionPct,
  `${obigboFarRate.effectiveInhibitionPct} against ${obigboRate.effectiveInhibitionPct}`);
const obigboMetalLossFar = obigboFarRate.rateMmYr / obigboFarDatasheet.rateMmYr;
const obigboMetalLoss = obigboRate.rateMmYr / obigboDatasheet.rateMmYr;
must('CLEARANCE by CANCELLATION: obigbo_metal_loss_ratio_vs_datasheet agrees across the far-field case to 1e-15',
  Math.abs(obigboMetalLossFar / obigboMetalLoss - 1) < 1e-15,
  `${obigboMetalLossFar} against ${obigboMetalLoss}`);
must('CLEARANCE by IDENTITY: the Obigbo scale factor is exactly 1, so H2 and H3 cannot move any Obigbo field',
  obigboRate.scaleFactor === 1, `scaleFactor=${obigboRate.scaleFactor}, onset ${obigboRate.scaleOnsetTC} C at ${obigboRate.tC ?? OBIGBO.tC} C`);

['obigbo_co2_partial_pressure_bar', 'obigbo_h2s_partial_pressure_psia', 'obigbo_h2s_to_co2_mole_ratio'].forEach((k) => {
  clear(k, 'H1 H2 H3 H4 H5 H8 H9', 'CONSTRUCTION', 'a partial pressure or a mole ratio is the total pressure times a mole fraction, or the ratio of two mole fractions. No correlation, no fugacity coefficient, no friction factor is in the chain: the fugacity CAP cannot reach it because the cap acts on the coefficient and this field never reads the coefficient');
  clear(k, 'H6 H7 H10 H11 W1', 'EXCLUSION', 'the field is a NUMBER, and every one of these held items is a label, a band, a threshold verdict, an interval or a withdrawn region. No graded field reads a label');
});
clear('obigbo_h2s_partial_pressure_psia', 'H6', 'EXCLUSION', 'the psia value is the partial pressure converted by the engine\'s exact BAR_TO_PSIA of 14.503773800721815, which is exact by the definition of the bar and the pound-force. The 0.0035 bar THRESHOLD is never compared against');
clear('obigbo_h2s_to_co2_mole_ratio', 'H7', 'EXCLUSION', 'the RATIO is graded and the two boundaries that turn it into a regime WORD are not. The ratio is also pressure free, so it is what catches a pH2S built from the total pressure or from a fugacity');
clear('obigbo_reynolds_number', 'H9', 'CONSTRUCTION', 'the Reynolds number is rho U d over mu, a definition. The Blasius pair and the Reynolds 4000 SWITCH act on the friction factor downstream of it, and no graded field reads a friction factor or a shear stress');
clear('obigbo_reynolds_number', 'H1 H2 H3 H4 H5 H6 H7 H8 H10 H11 W1', 'CONSTRUCTION', 'nothing in the Reynolds definition touches the correlation, the scale factor, the pH correction, the fugacity cap, a threshold or a band');
clear('obigbo_effective_inhibition_pct', 'H1 H2 H3 H4 H5 H8 H9', 'CONSTRUCTION', 'the effective protection is efficiency times availability, arithmetic over the two typed percentages with no correlation constant in it. MEASURED: bit identical at conditions that move the rate by more than half and cross the 250 bar cap');
clear('obigbo_effective_inhibition_pct', 'H6 H7 H10 H11 W1', 'EXCLUSION', 'a percentage is not a label, a band or a region');
clear('obigbo_metal_loss_ratio_vs_datasheet', 'H1 H2 H3 H4 H5 H8 H9', 'CANCELLATION', 'the ratio is two corrosionRate calls that differ ONLY in the availability, so the fugacity, the correlation, the scale factor, the pH factor and the water wetting divide out exactly. MEASURED: agrees to 1e-15 at conditions that move the rate by more than half');
clear('obigbo_metal_loss_ratio_vs_datasheet', 'H6 H7 H10 H11 W1', 'EXCLUSION', 'a ratio is not a label, a band, an interval or a region');
clear('obigbo_co2_partial_pressure_bar', 'H2 H3', 'IDENTITY', 'and additionally: the Obigbo scale factor is exactly 1 at 71.3 C against a computed onset above it, so whether that factor belongs on the reaction term or on the combined rate cannot move ANY Obigbo number, graded or not');

/* -- NEMBE. Measured invariance on the retained fraction and on everything
      built from it. */
const nembeFarCommon = { ...nembeCommon, tC: 39.2, pTotalBar: 7.15, co2MolFrac: 0.31, ph: 8.4, velocityMS: 0.77, diameterM: 0.3048 };
const nembeFar = success('Nembe far-field corrosionRate', C.corrosionRate({
  ...nembeFarCommon,
  inhibitorEfficiencyPct: NEMBE.inhibitorEfficiencyPct,
  inhibitorAvailabilityPct: NEMBE.inhibitorAvailabilityPct,
}));
must('CLEARANCE MEASUREMENT: the Nembe far-field case really does move the rate',
  Math.abs(nembeFar.rateMmYr / nembeRate.rateMmYr - 1) > 0.5, `far ${nembeFar.rateMmYr} against near ${nembeRate.rateMmYr}`);
must('CLEARANCE by INVARIANCE: nembe_retained_metal_loss_fraction is identical to 1e-15 across the far-field case',
  Math.abs((nembeFar.rateMmYr / nembeFar.uninhibitedMmYr) / nembeRetained - 1) < 1e-15,
  `${nembeFar.rateMmYr / nembeFar.uninhibitedMmYr} against ${nembeRetained}`);
must('CLEARANCE by INVARIANCE: nembe_inhibitor_shortfall_pp is bit identical across the far-field case',
  nembeFar.inhibitorShortfallPp === nembeRate.inhibitorShortfallPp,
  `${nembeFar.inhibitorShortfallPp} against ${nembeRate.inhibitorShortfallPp}`);
must('CLEARANCE by IDENTITY: the Nembe scale factor is exactly 1, so H2 and H3 cannot move a Nembe field',
  nembeRate.scaleFactor === 1, `scaleFactor=${nembeRate.scaleFactor}, onset ${nembeRate.scaleOnsetTC} C at ${NEMBE.tC} C`);
must('CLEARANCE by CONSTRUCTION: the Nembe pH is at or above the reference, so H4\'s below-reference refusal is never reached',
  NEMBE.ph >= C.PH_REFERENCE, `pH ${NEMBE.ph} against reference ${C.PH_REFERENCE}`);

['nembe_retained_metal_loss_fraction', 'nembe_inhibitor_shortfall_pp'].forEach((k) => {
  clear(k, 'H1 H2 H3 H4 H5 H8 H9', 'CANCELLATION', 'both are the inhibitor time average and nothing else: the retained fraction is a ratio of two rates that share the whole correlation chain, and the shortfall is the difference of two percentages. MEASURED invariant to 1e-15 at conditions that move the rate by more than half');
  clear(k, 'H6 H7 H10 H11 W1', 'EXCLUSION', 'neither is a label, a band, an interval or a region');
});
['nembe_inhibited_rate_mmyr', 'nembe_remaining_life_yr', 'nembe_required_allowance_mm', 'nembe_life_lost_to_availability_yr'].forEach((k) => {
  clear(k, 'H1 H2 H3 H4 H5 H8 H9', 'CONSTRUCTION', 'the capstone STATES the uninhibited wall-loss rate from a two-year ultrasonic survey, so the correlation never supplies a rate here. What the engine supplies is the retained fraction, which is invariant to the whole chain, and remainingLife, which carries no correlation constant at all');
  clear(k, 'H10', 'EXCLUSION', 'the rate CATEGORY is never read: no graded field is a band label, and the capstone never asks which band a rate falls in');
  clear(k, 'H11', 'EXCLUSION', 'remainingLife divides an allowance by a rate and stops. No inspection interval, minimum thickness or retirement thickness is computed, quoted or implied, and the engine lists all three in NOT_PROVIDED');
  clear(k, 'H6 H7 W1', 'EXCLUSION', 'the Nembe case is not asked a sour question at all: no H2S threshold comparison, no regime word, no severity region');
});

/* -- SOKU. Measured invariance on every bisected answer. */
const sokuFarCommon = { ...sokuCommon, tC: 33.1, pTotalBar: 19.4, co2MolFrac: 0.072, ph: 7.6, velocityMS: 0.55, diameterM: 0.4064 };
const sokuFar = success('Soku far-field corrosionRate', C.corrosionRate({
  ...sokuFarCommon,
  inhibitorEfficiencyPct: SOKU.inhibitorEfficiencyPct,
  inhibitorAvailabilityPct: SOKU.inhibitorAvailabilityPct,
}));
must('CLEARANCE MEASUREMENT: the Soku far-field case really does move the rate',
  Math.abs(sokuFar.rateMmYr / sokuRate.rateMmYr - 1) > 0.5, `far ${sokuFar.rateMmYr} against near ${sokuRate.rateMmYr}`);
const sokuRetainedFar = sokuFar.rateMmYr / sokuFar.uninhibitedMmYr;
must('CLEARANCE by INVARIANCE: the Soku retained fraction is identical to 1e-15 across the far-field case',
  Math.abs(sokuRetainedFar / sokuRetained - 1) < 1e-15, `${sokuRetainedFar} against ${sokuRetained}`);
const sokuAvailForLifeFar = bisect(1, 100, (a) => {
  const r = C.corrosionRate({ ...sokuFarCommon, inhibitorEfficiencyPct: SOKU.inhibitorEfficiencyPct, inhibitorAvailabilityPct: a });
  const retained = r.rateMmYr / r.uninhibitedMmYr;
  return C.remainingLife({ ...sokuBase, rateMmYr: SOKU.surveyedUninhibitedMmYr * retained }).meetsDesignLife === true;
}, 'the far-field availability for the design life');
must('CLEARANCE by INVARIANCE: soku_availability_for_design_life_pct is identical to 1e-12 across the far-field case',
  Math.abs(sokuAvailForLifeFar / sokuAvailForLife - 1) < 1e-12, `${sokuAvailForLifeFar} against ${sokuAvailForLife}`);
must('CLEARANCE by IDENTITY: the Soku scale factor is exactly 1, so H2 and H3 cannot move a Soku field',
  sokuRate.scaleFactor === 1, `scaleFactor=${sokuRate.scaleFactor}, onset ${sokuRate.scaleOnsetTC} C at ${SOKU.tC} C`);

['soku_tolerable_rate_mmyr', 'soku_allowance_to_reinstate_mm', 'soku_stripped_film_life_yr'].forEach((k) => {
  clear(k, 'H1 H2 H3 H4 H5 H8 H9', 'CONSTRUCTION', 'bisected on remainingLife alone, whose only inputs are an allowance, a consumed depth, a rate the capstone STATES from the inspection record, and a design life. No correlation constant is reachable from remainingLife');
  clear(k, 'H6 H7 H10 W1', 'EXCLUSION', 'no threshold, no regime, no band label and no severity region is read: the bisection turns over on meetsDesignLife, a boolean the engine derives from two numbers the capstone states');
  clear(k, 'H11', 'EXCLUSION', 'the ALLOWANCE is bisected, not a retirement thickness. The engine has no minimum thickness and this field does not invent one: it answers how much allowance the stated design life demands, which is arithmetic on the allowance the project already has');
});
['soku_required_availability_pct', 'soku_availability_for_design_life_pct', 'soku_film_credit_life_ratio'].forEach((k) => {
  clear(k, 'H1 H2 H3 H4 H5 H8 H9', 'CANCELLATION', 'the bisection turns over on the inhibitor time average, which is invariant to the correlation chain, and the life RATIO is two lives whose rates share that chain exactly. MEASURED invariant across a far-field case that moves the rate by more than half');
  clear(k, 'H6 H7 H10 H11 W1', 'EXCLUSION', 'none of the three reads a threshold, a regime, a band, an interval or a region');
});
clear('soku_film_credit_life_ratio', 'H8', 'CONSTRUCTION', 'the capstone STATES that the shear check has already removed the credit. Whether 100 Pa is the right threshold decides WHETHER the credit goes, and the graded number is the CONSEQUENCE of it having gone, which is the reciprocal of the retained fraction whatever the threshold is');
clear('soku_stripped_film_life_yr', 'H8', 'CONSTRUCTION', 'the same: the stripping is stated, and the graded life is the surveyed uninhibited rate against the remaining allowance');

/* ---------------------------------------------------------------- the rows */

const ROWS = [
  ['beginner', 'obigbo_co2_partial_pressure_bar', 'bar', obigboFug.pco2Bar],
  ['beginner', 'obigbo_h2s_partial_pressure_psia', 'psia', obigboSour.ph2sPsia],
  ['beginner', 'obigbo_h2s_to_co2_mole_ratio', 'ratio', obigboRegime.ratio],
  ['beginner', 'obigbo_reynolds_number', 'reynolds', obigboShear.reynolds],
  ['beginner', 'obigbo_effective_inhibition_pct', 'pct', obigboRate.effectiveInhibitionPct],
  ['beginner', 'obigbo_metal_loss_ratio_vs_datasheet', 'ratio', obigboMetalLoss],
  ['intermediate', 'nembe_retained_metal_loss_fraction', 'ratio', nembeRetained],
  ['intermediate', 'nembe_inhibitor_shortfall_pp', 'pp', nembeRate.inhibitorShortfallPp],
  ['intermediate', 'nembe_inhibited_rate_mmyr', 'mmPerYr', nembeInhibitedRate],
  ['intermediate', 'nembe_remaining_life_yr', 'yr', nembeLife.remainingYears],
  ['intermediate', 'nembe_required_allowance_mm', 'mm', nembeLife.requiredAllowanceMm],
  ['intermediate', 'nembe_life_lost_to_availability_yr', 'yr', nembeDatasheetLife.remainingYears - nembeLife.remainingYears],
  ['advanced', 'soku_tolerable_rate_mmyr', 'mmPerYr', sokuTolerableRate],
  ['advanced', 'soku_required_availability_pct', 'pct', sokuRequiredAvail],
  ['advanced', 'soku_availability_for_design_life_pct', 'pct', sokuAvailForLife],
  ['advanced', 'soku_allowance_to_reinstate_mm', 'mm', sokuAllowanceToReinstate],
  ['advanced', 'soku_stripped_film_life_yr', 'yr', sokuStrippedLife.remainingYears],
  ['advanced', 'soku_film_credit_life_ratio', 'ratio', sokuCreditRatio],
].map(([tier, key, cls, value]) => ({ tier, key, cls, value }));

/* The order and the classes must be the tolerance derivation's, not this
   file's opinion of them. A second copy of the field list is exactly the class
   of defect gradedTolerance.js exists to remove. */
must('the eighteen rows are the eighteen declared fields, in the declared order and classes',
  JSON.stringify(ROWS.map((r) => [r.tier, r.key, r.cls]))
  === JSON.stringify(GRADED_FIELDS.map(([t, k, c]) => [t, k, c])),
  `${ROWS.length} rows`);
ROWS.forEach((r) => must(`${r.key} is a finite positive number`, Number.isFinite(r.value) && r.value > 0, r.value));

/* Every held item must be cleared for every field. Eighteen times twelve. */
const missing = [];
GRADED_FIELDS.forEach(([, key]) => {
  HELD.forEach((h) => {
    const tag = h.split(' ')[0];
    const got = CLEARANCES.filter((c) => c.key === key && c.held.split(/\s+/).includes(tag));
    if (!got.length) missing.push(`${key} has no clearance for ${tag}`);
  });
});
must('EVERY HELD AND WITHDRAWN ITEM IS CLEARED FOR EVERY GRADED FIELD', missing.length === 0,
  missing.length ? missing.slice(0, 12).join('; ') : `${GRADED_FIELDS.length} fields x ${HELD.length} items, all cleared`);

/* -------------------------------------------------------------- reporting */

const failed = ASSERTS.filter((a) => !a.pass);
if (failed.length) {
  failed.forEach((a) => process.stderr.write(`  FAILED  ${a.claim}\n          ${a.detail}\n`));
  process.stderr.write(`fc9_capstone: ${ASSERTS.length} assertions, ${failed.length} FAILED. NOTHING WRITTEN.\n`);
  process.exit(1);
}
process.stderr.write(`fc9_capstone: ${ASSERTS.length} label-and-call and clearance assertions run, 0 failed\n`);

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(ROWS)}\n`);
} else if (process.argv.includes('--clearances')) {
  process.stdout.write(`${JSON.stringify({ held: HELD, clearances: CLEARANCES }, null, 1)}\n`);
} else {
  const pad = (s, n2) => String(s).padEnd(n2);
  process.stdout.write(`${pad('TIER', 14)}${pad('KEY', 40)}${pad('CLASS', 10)}${pad('VALUE', 26)}TOLERANCE\n`);
  ROWS.forEach((r) => process.stdout.write(
    `${pad(r.tier, 14)}${pad(r.key, 40)}${pad(r.cls, 10)}${pad(r.value.toFixed(PRINTED_DECIMALS[r.cls]), 26)}${gradedTolerance(r.key)}\n`));
  process.stdout.write(`\n${CLEARANCES.length} clearance assertions over ${GRADED_FIELDS.length} fields and ${HELD.length} held or withdrawn items\n`);
  const byMech = {};
  CLEARANCES.forEach((c) => { byMech[c.mechanism] = (byMech[c.mechanism] || 0) + 1; });
  process.stdout.write(`by mechanism: ${Object.entries(byMech).sort().map(([m, n2]) => `${m} ${n2}`).join(', ')}\n`);
}
