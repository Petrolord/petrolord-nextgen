// W6 transfer case for the corrosion finals: the UGADA trunkline.
//
// A wet sour gas-condensate trunkline that no lesson, module question or
// capstone of this course works (the lessons walk the studio default, the
// Etelebou, Kanbi, Tunu, Opukushi, Angiama and Diebu streams and a 4 mm
// allowance worked case; the capstones are OBIGBO, NEMBE CREEK and SOKU).
// Every figure a W6 item prints is produced here through the VENDORED
// corrosion engine. Where an item's distractor is a wrong method the engine
// has no door for, it is derived from engine outputs and the line above it
// names the mistake. Prints everything as one JSON object {inputs, values, print}.
import * as C from '@petrolord/engines/engines/facilities/corrosion.js';

const inputs = {
  case: 'UGADA',
  tC: 52.6, pTotalBar: 96.4, co2MolFrac: 0.0418, h2sMolFrac: 0.00061, ph: 4.86,
  velocityMS: 2.73, diameterM: 0.2545, densityKgM3: 812.4, viscosityPaS: 0.00187,
  inhibitorEfficiencyPct: 92, inhibitorAvailabilityPct: 87,
  corrosionAllowanceMm: 3.81, consumedMm: 0.94, designLifeYears: 25,
  // variations the items ask about
  doubledVelocityMS: 5.46, moderateVelocityMS: 7, strippingVelocityMS: 9.5,
  intermittentWaterCut: 0.46, lowPh: 3.7, typedEfficiencyPct: 115,
  raisedAvailabilityPct: 97, nearFullAvailabilityPct: 99.9, targetEffectivePct: 88,
  revisedConsumedMm: 1.62, raisedH2sMolFrac: 0.0025, doubledPressureBar: 192.8,
  fullyConsumedMm: 3.81, oldGuardEfficiencyPct: 90, mmPerInch: 25.4, milsPerInch: 1000,
};

const base = {
  tC: inputs.tC, pTotalBar: inputs.pTotalBar, co2MolFrac: inputs.co2MolFrac, h2sMolFrac: inputs.h2sMolFrac,
  ph: inputs.ph, velocityMS: inputs.velocityMS, diameterM: inputs.diameterM, densityKgM3: inputs.densityKgM3,
  viscosityPaS: inputs.viscosityPaS, waterCutFrac: 1, flowRegime: 'waterWet',
  inhibitorEfficiencyPct: inputs.inhibitorEfficiencyPct, inhibitorAvailabilityPct: inputs.inhibitorAvailabilityPct,
  corrosionAllowanceMm: inputs.corrosionAllowanceMm, consumedMm: inputs.consumedMm, designLifeYears: inputs.designLifeYears,
};

const must = (x, what) => {
  if (!x || x.error) throw new Error(`${what}: ${x && x.error}`);
  return x;
};
const values = {};
const print = {};
const put = (k, v, digits = 6) => { values[k] = v; print[k] = typeof v === 'number' ? v.toFixed(digits) : String(v); };

// ---------------------------------------------------------------- the base screening
const s = must(C.screen(base), 'base screening');
const r = s.rate;
put('pco2', r.pco2Bar);
put('fco2', r.fco2Bar);
put('fugCoef', r.fugacityCoefficient);
put('vr', r.reactionMmYr);
put('vm', r.massTransferMmYr);
put('combined', r.combinedMmYr);
put('margin', r.controllingMargin);
values.controlling = r.controlling; print.controlling = r.controlling;
put('onset', r.scaleOnsetTC);
put('scaleFactor', r.scaleFactor);
put('phFactor', r.phFactor);
put('uninhibited', r.uninhibitedMmYr);
put('rate', r.rateMmYr);
put('effPct', r.effectiveInhibitionPct, 2);
put('shortfallPp', r.inhibitorShortfallPp, 2);
put('ph2sBar', s.ph2sBar);
put('ph2sPsia', s.sour.ph2sPsia);
put('decades', s.sour.decadesAboveThreshold);
put('ratio', s.regime.ratio);
values.regime = s.regime.regime; print.regime = s.regime.regime;
put('re', s.shear.reynolds, 4);
put('tau', s.shear.tauPa);
values.filmRisk = s.shear.filmRisk; print.filmRisk = s.shear.filmRisk;
values.category = s.category; print.category = s.category;
put('remainingMm', s.life.remainingMm, 2);
put('life', s.life.remainingYears);
put('reqAllow', s.life.requiredAllowanceMm);
put('shortfallMm', s.life.shortfallMm);
values.binding = s.binding.what; print.binding = s.binding.what;
if (s.binding.what !== 'the corrosion allowance against the design life') throw new Error('base binding moved');
if (r.scaleFactor !== 1) throw new Error('the base case must sit below its computed film onset');

// held constants the items name, printed from the engine's own exports
put('threshBar', C.SOUR_THRESHOLD_BAR, 4);
put('carbMax', C.REGIME_CARBONATE_MAX, 3);
put('mixedMax', C.REGIME_MIXED_MAX, 2);
put('stripPa', C.FILM_STRIP_PA, 0);
put('moderatePa', C.FILM_MODERATE_PA, 0);
put('phRef', C.PH_REFERENCE, 0);
put('bandModerate', C.RATE_CATEGORY_BANDS.moderate, 1);
put('bandHigh', C.RATE_CATEGORY_BANDS.high, 1);
put('warnTriggerPp', C.INHIBITOR_SHORTFALL_PP, 1);

// ---------------------------------------------------------------- beginner distractors
// mole percent read as a fraction: 4.18 in place of 0.0418
put('pco2Pct', r.pco2Bar * 100);
// both acid gases added into the CO2 fraction
put('pco2Both', must(C.co2Fugacity({ tC: base.tC, pTotalBar: base.pTotalBar, co2MolFrac: base.co2MolFrac + base.h2sMolFrac }), 'both').pco2Bar);
// H2S bar figure divided by the factor instead of multiplied
put('ph2sDivided', s.ph2sBar / C.BAR_TO_PSIA);
// the CO2 fugacity coefficient wrongly applied to H2S
put('ph2sFugApplied', s.sour.ph2sPsia * r.fugacityCoefficient);
// ratio formed against the CO2 fugacity, and the ratio upside down
put('ratioFug', s.ph2sBar / r.fco2Bar);
put('ratioInv', r.pco2Bar / s.ph2sBar);
// the two terms added as if in parallel, and their mean
put('vSum', r.reactionMmYr + r.massTransferMmYr);
put('vMean', (r.reactionMmYr + r.massTransferMmYr) / 2);
// the margin taken against the larger term
put('marginWrong', Math.abs(r.massTransferMmYr - r.reactionMmYr) / Math.max(r.massTransferMmYr, r.reactionMmYr));
// transport term at double velocity (engine), and the wrong exponents
const vm2 = C.dwmMassTransferRate({ velocityMS: inputs.doubledVelocityMS, diameterM: base.diameterM, fco2Bar: r.fco2Bar });
put('vm2', vm2);
put('vm2Linear', 2 * r.massTransferMmYr);
// the two exponents measured out of the engine (held constants, never typed here)
put('velExp', Math.log2(vm2 / r.massTransferMmYr), 1);
put('diaExp', Math.log2(r.massTransferMmYr / C.dwmMassTransferRate({ velocityMS: base.velocityMS, diameterM: 2 * base.diameterM, fco2Bar: r.fco2Bar })), 1);
put('vm2Dexp', C.dwmMassTransferRate({ velocityMS: base.velocityMS, diameterM: base.diameterM, fco2Bar: r.fco2Bar }) * (vm2 / r.massTransferMmYr) ** 0.25);
// pH factor wrong forms: no reference, and a slope of one per unit
put('phAbove', base.ph - C.PH_REFERENCE, 2);
put('phNoRef', 10 ** (-0.5 * base.ph));
put('phSlopeOne', C.phFactor({ ph: base.ph }).factor ** 2);
put('phLin', 0.5 * (base.ph - C.PH_REFERENCE));
// below the reference: the refusal, and the slope carried below it
const low = C.phFactor({ ph: inputs.lowPh });
if (!low.error) throw new Error('pH below the reference must refuse');
put('phLowExtrap', 10 ** (-0.5 * (inputs.lowPh - C.PH_REFERENCE)));
// oil wet
const oil = must(C.screen({ ...base, flowRegime: 'oilWet' }), 'oil wet');
put('oilRate', oil.rate.rateMmYr);
if (oil.life !== null || oil.category !== null || oil.rate.effectiveInhibitionPct !== null) throw new Error('oil wet must withhold');
values.oilBinding = oil.binding.what; print.oilBinding = oil.binding.what;
// inhibitor wrong arithmetic
put('effBothFail', (1 - (1 - base.inhibitorEfficiencyPct / 100) * (1 - base.inhibitorAvailabilityPct / 100)) * 100, 2);
put('effAdded', base.inhibitorEfficiencyPct + base.inhibitorAvailabilityPct - 100, 2);
put('effDatasheet', base.inhibitorEfficiencyPct, 2);
put('shortfallBothFail', base.inhibitorEfficiencyPct - values.effBothFail, 2);
// Reynolds wrong forms
const shearOf = (o) => must(C.wallShearStressPa(o), 'shear');
put('reCp', shearOf({ velocityMS: base.velocityMS, diameterM: base.diameterM, densityKgM3: base.densityKgM3, viscosityPaS: base.viscosityPaS * 1000 }).reynolds, 4);
put('reRadius', shearOf({ velocityMS: base.velocityMS, diameterM: base.diameterM / 2, densityKgM3: base.densityKgM3, viscosityPaS: base.viscosityPaS }).reynolds, 4);
// density left out of the definition
put('reNoRho', s.shear.reynolds / base.densityKgM3, 4);
// mm/yr to mpy
put('mpy', r.rateMmYr / inputs.mmPerInch * inputs.milsPerInch, 4);
put('mpyTimes', r.rateMmYr * inputs.mmPerInch, 4);
put('mpyDivOnly', r.rateMmYr / inputs.mmPerInch, 4);
// the thousand applied against centimetres
put('mpyInch', r.rateMmYr * inputs.milsPerInch / (inputs.mmPerInch / 10), 4);

// ---------------------------------------------------------------- intermediate
const inter = must(C.screen({ ...base, flowRegime: 'intermittent', waterCutFrac: inputs.intermittentWaterCut }), 'intermittent');
put('rateInt', inter.rate.rateMmYr);
values.categoryInt = inter.category; print.categoryInt = inter.category;
put('rateIntComplement', r.rateMmYr * (1 - inputs.intermittentWaterCut));
const wwTyped = must(C.corrosionRate({ ...base, waterCutFrac: inputs.intermittentWaterCut }), 'water wet with a typed cut');
put('wwTypedFactor', wwTyped.waterWettingFactor);
put('wwTypedRate', wwTyped.rateMmYr);
put('intFactor', inter.rate.waterWettingFactor, 2);
// loss ratio against the datasheet
const retained = r.rateMmYr / r.uninhibitedMmYr;
put('retained', retained, 4);
put('retainedDs', 1 - base.inhibitorEfficiencyPct / 100, 2);
put('lossRatio', retained / (1 - base.inhibitorEfficiencyPct / 100));
put('lossInvAvail', 1 / (base.inhibitorAvailabilityPct / 100));
put('lossOffOnly', (1 - base.inhibitorAvailabilityPct / 100) / (1 - base.inhibitorEfficiencyPct / 100));
const up = must(C.corrosionRate({ ...base, inhibitorAvailabilityPct: inputs.raisedAvailabilityPct }), 'raised availability');
put('lossRatioUp', (up.rateMmYr / up.uninhibitedMmYr) / (1 - base.inhibitorEfficiencyPct / 100));
put('effUp', up.effectiveInhibitionPct, 2);
put('lossOffOnlyUp', (1 - inputs.raisedAvailabilityPct / 100) / (1 - base.inhibitorEfficiencyPct / 100));
put('lossInvAvailUp', 1 / (inputs.raisedAvailabilityPct / 100));
// a typed 115 percent efficiency
const clamp = must(C.corrosionRate({ ...base, inhibitorEfficiencyPct: inputs.typedEfficiencyPct }), 'typed 115');
put('effClamped', clamp.effectiveInhibitionPct, 2);
values.clampMsg = clamp.clamps[0]; print.clampMsg = clamp.clamps[0];
put('effUnclamped', inputs.typedEfficiencyPct * base.inhibitorAvailabilityPct / 100, 2);
// the moderate band and the stripping velocity
const mod = must(C.screen({ ...base, velocityMS: inputs.moderateVelocityMS }), 'moderate');
put('tauMod', mod.shear.tauPa);
values.filmRiskMod = mod.shear.filmRisk; print.filmRiskMod = mod.shear.filmRisk;
if (mod.filmStripped || mod.shear.filmRisk !== 'moderate') throw new Error('7 m/s must be moderate');
const strip = must(C.screen({ ...base, velocityMS: inputs.strippingVelocityMS }), 'stripping');
if (!strip.filmStripped) throw new Error('9.5 m/s must strip');
put('tauStrip', strip.shear.tauPa);
put('rateStrip', strip.rate.rateMmYr);
put('rateCredit', strip.rateWithFilmCreditMmYr);
put('stripRatio', strip.rate.rateMmYr / strip.rateWithFilmCreditMmYr);
put('ratioEffOnly', 1 / (1 - base.inhibitorEfficiencyPct / 100));
put('ratioAvailOnly', 1 / (1 - base.inhibitorAvailabilityPct / 100));
put('tauOverThresh', strip.shear.tauPa / C.FILM_STRIP_PA);
put('lifeStrip', strip.life.remainingYears);
put('lifeCredit', must(C.remainingLife({ rateMmYr: strip.rateWithFilmCreditMmYr, corrosionAllowanceMm: base.corrosionAllowanceMm, consumedMm: base.consumedMm, designLifeYears: base.designLifeYears }), 'credited life').remainingYears);
values.bindingStrip = strip.binding.what; print.bindingStrip = strip.binding.what;
if (strip.life.meetsDesignLife !== false) throw new Error('the stripped life must also fail the design life');
put('rateStripMean', (strip.rate.rateMmYr + strip.rateWithFilmCreditMmYr) / 2);
// allowance arithmetic wrong forms
put('lifeNoConsumed', base.corrosionAllowanceMm / r.rateMmYr);
put('lifeConsumedOnly', base.consumedMm / r.rateMmYr);
put('lifeTimes', s.life.remainingMm * r.rateMmYr);
put('shortVsCA', s.life.requiredAllowanceMm - base.corrosionAllowanceMm);
put('reqOverLife', s.life.remainingMm / base.designLifeYears);
// consumed revised upward
const rev = must(C.remainingLife({ rateMmYr: r.rateMmYr, corrosionAllowanceMm: base.corrosionAllowanceMm, consumedMm: inputs.revisedConsumedMm, designLifeYears: base.designLifeYears }), 'revised consumed');
put('revRemaining', rev.remainingMm, 2);
put('revShortfall', rev.shortfallMm);
put('revReq', rev.requiredAllowanceMm);
put('revShortRise', rev.shortfallMm - s.life.shortfallMm, 2);
put('revReqScaled', s.life.requiredAllowanceMm * rev.remainingMm / s.life.remainingMm);
// a perfect inhibitor
const perfect = must(C.screen({ ...base, inhibitorEfficiencyPct: 100, inhibitorAvailabilityPct: 100 }), 'perfect');
put('perfectRate', perfect.rate.rateMmYr);
if (!(perfect.life && perfect.life.unbounded === true && perfect.life.remainingYears === null && perfect.life.meetsDesignLife === null)) {
  throw new Error('a zero rate must return no life and no verdict');
}
// pressure doubled at the same composition
const dbl = must(C.screen({ ...base, pTotalBar: inputs.doubledPressureBar }), 'doubled pressure');
put('ratioDbl', dbl.regime.ratio);
put('pco2Dbl', dbl.rate.pco2Bar);
put('ratioDblFug', dbl.ph2sBar / dbl.rate.fco2Bar);
put('ratioDoubled', 2 * s.regime.ratio);
put('ratioHalved', s.regime.ratio / 2);
if (dbl.regime.ratio.toFixed(12) !== s.regime.ratio.toFixed(12)) throw new Error('ratio must not move with pressure');
// decade count wrong forms
put('decPsiaMix', Math.log10(s.sour.ph2sPsia / C.SOUR_THRESHOLD_BAR));
put('decLn', Math.log(s.ph2sBar / C.SOUR_THRESHOLD_BAR));
put('decPlain', s.ph2sBar / C.SOUR_THRESHOLD_BAR);

// ---------------------------------------------------------------- advanced
// largest tolerable rate: bisect the meetsDesignLife flag
const meets = (rate) => C.remainingLife({ rateMmYr: rate, corrosionAllowanceMm: base.corrosionAllowanceMm, consumedMm: base.consumedMm, designLifeYears: base.designLifeYears }).meetsDesignLife;
let lo = 1e-9; let hi = r.rateMmYr;
for (let i = 0; i < 200; i += 1) { const m = (lo + hi) / 2; if (meets(m)) lo = m; else hi = m; }
put('maxRate', lo);
put('maxRateCA', base.corrosionAllowanceMm / base.designLifeYears);
put('maxRateConsumed', base.consumedMm / base.designLifeYears);
put('rateDatasheet', r.uninhibitedMmYr * (1 - base.inhibitorEfficiencyPct / 100));
// availability for a target effective protection: bisect effectiveInhibitionPct
const effAt = (a) => C.corrosionRate({ ...base, inhibitorAvailabilityPct: a }).effectiveInhibitionPct;
lo = 0; hi = 100;
for (let i = 0; i < 200; i += 1) { const m = (lo + hi) / 2; if (effAt(m) >= inputs.targetEffectivePct) hi = m; else lo = m; }
put('availNeeded', hi);
put('availAddPoints', 100 - (base.inhibitorEfficiencyPct - inputs.targetEffectivePct));
put('availWrongAlg', (1 - (1 - inputs.targetEffectivePct / 100) / (base.inhibitorEfficiencyPct / 100)) * 100);
put('targetAsAvail', inputs.targetEffectivePct);
// allowance that reinstates the life: bisect the total allowance
const meetsCA = (ca) => C.remainingLife({ rateMmYr: r.rateMmYr, corrosionAllowanceMm: ca, consumedMm: base.consumedMm, designLifeYears: base.designLifeYears }).meetsDesignLife;
lo = base.consumedMm + 1e-9; hi = 1000;
for (let i = 0; i < 200; i += 1) { const m = (lo + hi) / 2; if (meetsCA(m)) hi = m; else lo = m; }
put('reinstate', hi);
put('reqMinusConsumed', s.life.requiredAllowanceMm - base.consumedMm);
// sulphide
const sul = must(C.screen({ ...base, h2sMolFrac: inputs.raisedH2sMolFrac }), 'sulphide');
put('ratioSul', sul.regime.ratio);
values.regimeSul = sul.regime.regime; print.regimeSul = sul.regime.regime;
put('rateSul', sul.rate.rateMmYr);
if (sul.withheld === null || sul.category !== null || sul.life !== null) throw new Error('sulphide must withhold');
if (sul.rate.rateMmYr !== r.rateMmYr) throw new Error('H2S must not move the rate');
values.bindingSul = sul.binding.what; print.bindingSul = sul.binding.what;
put('rateSulScaled', r.rateMmYr * sul.regime.ratio / s.regime.ratio);
// a fully consumed allowance
const gone = C.remainingLife({ rateMmYr: r.rateMmYr, corrosionAllowanceMm: base.corrosionAllowanceMm, consumedMm: inputs.fullyConsumedMm, designLifeYears: base.designLifeYears });
if (!gone.error) throw new Error('a fully consumed allowance must refuse');
values.goneMsg = gone.error; print.goneMsg = gone.error;
// the blank velocity before the repair: an infinite transport term leaves the reaction term
put('oldBlankRate', 1 / (1 / r.reactionMmYr + 0));
const blank = C.screen({ ...base, velocityMS: undefined });
if (!blank.error) throw new Error('a blank velocity must refuse');
values.blankMsg = blank.error; print.blankMsg = blank.error;
// the warning trigger
const near = must(C.corrosionRate({ ...base, inhibitorAvailabilityPct: inputs.nearFullAvailabilityPct }), 'near full');
put('shortNear', near.inhibitorShortfallPp, 3);
if (near.warning !== null) throw new Error('99.9 percent availability must stay under the warning trigger');
// the half life distractor for the inspection item
put('halfLife', s.life.remainingYears / 2);
put('lifeCategoryStep', s.life.remainingYears * C.RATE_CATEGORY_BANDS.moderate);

console.log(JSON.stringify({ inputs, values, print }));
