// The PD8 capstone (Well Intervention), and the eighteen graded fields derived
// from it by running the engine. Nothing here is typed from a lesson, a chart
// or a table: every graded number below is a return value of
// engines/production/interventionDiagnostics.js.
//
// Every condition below differs from the ones intervention_cases.json
// publishes, which is the DR2 rule: design the capstone's conditions BEFORE
// writing the lessons, so the tier can teach on the published case and grade on
// this one. The golden's value is named in a trailing comment on every line.
//
// UNITS. Field units throughout: producing time in DAYS, radii in FT, water-oil
// ratio as a bare stb/stb RATIO, gas-oil ratio in scf/stb, water cut in
// PERCENT, skin and the pseudo-steady-state group dimensionless, fit quality as
// a FRACTION, log-log slopes per LOG CYCLE (dimensionless by construction: they
// are d ln y / d ln x), spans in LOG CYCLES. Nothing here is SI.
//
// WHY SO MANY GRADED VALUES ARE DIMENSIONLESS. This engine is a DIAGNOSTIC. It
// does not size anything, so almost every continuous number it returns is a
// slope, a fit quality, a span or a dimensionless group; the one dimensional
// return in the whole module is `lateFromT`, in days. The verdicts it returns
// -- `mechanism.id`, `confidence`, `verdict`, `blocked` -- are strings and
// booleans and CANNOT be graded, so the eighteen fields below are the
// continuous quantities that sit underneath them, and the aux block prints the
// verdicts each one produces so a lesson can show what the number decided.
//
// ---------------------------------------------------------------------------
// THE WELL: BOMU-17, and why it is uncomfortable
//
// A damaged oil well (skin 6.4) at 80.2 percent water cut, which is what its
// last water-oil ratio sample of 4.0386 works out to, with 2900 days of
// production history, a gas-oil ratio that has nearly tripled, and one event in
// the middle of the history. Four things are tuned into it, and every one is
// verified from the printed values rather than assumed:
//
//   1. THE HISTORY SUPPORTS TWO VERDICTS AT ONCE. For the first 1900 days the
//      water-oil ratio climbs faster than proportionally, which is the
//      channelling picture. On day 1900 the well was BEANED BACK, and the
//      water-oil ratio fell, which is the coning field test and the coning
//      answer. Both stories are in the same series. The engine reports only the
//      first one, because `logLogSlope` drops every point whose y is not
//      strictly positive and the four post-choke samples have NEGATIVE
//      derivatives. `chanDiagnosis` counts them -- `negativeDerivatives` -- and
//      then never reads the count on this path. See DEFECT (1) below.
//
//   2. IT SUPPORTS THE CHANNELLING VERDICT ON A HAIR. At the stated
//      lateFraction the derivative slope lands a little over a hundredth of a
//      unit above `channellingSlope` 1.3. A shade less and the mechanism is
//      `displacement`, and `screenTreatments` turns the water shutoff from
//      `candidate` into `blocked`. The aux block prints the margin.
//
//   3. THE ANALYST'S WINDOW DECIDES THE SPEND. The same series read at
//      lateFraction 0.30, 0.55 and 0.90 gives three different derivative
//      slopes and two different mechanisms, so the water shutoff comes out
//      `candidate` on one window and `blocked` on another with not one datum
//      changed. `lateFraction` has a default of 0.5 and no guidance beyond it.
//
//   4. THE GAS SIDE FAILS OPEN. The engine's own gas-shutoff reasoning tells
//      the user to "Run the diagnostic on the gas-oil ratio before deciding".
//      BOMU-17's gas-oil ratio history is exported from the production database
//      with the Bourdet derivative column NOT COMPUTED, so every `derivative`
//      is `null`. `Number(null)` is 0, so the engine reads the column as a
//      derivative that is exactly zero everywhere, and returns
//      `mechanism: displacement`, `ok: true`, with the note "The ratio is
//      sitting flat at 2670.71 ... Nothing is changing ... That is a finding,
//      not a failure to reach one." The gas-oil ratio it calls flat has nearly
//      TRIPLED across that window, by a factor of 2.937, and the SAME RETURN
//      OBJECT carries `worSlope` 0.5565 and `worR2` 0.9592 which say so. Spell
//      the same missing column `undefined` instead of `null` and the engine
//      reaches the honest `indeterminate` refusal. So the difference between a
//      reassuring false verdict and an honest one is which JavaScript spelling
//      of "no value" the exporter happened to emit. See DEFECT (2) below.
//
// ---------------------------------------------------------------------------
// THE DEFECTS THIS CAPSTONE SIZES, AND WHAT THE ORACLE SAYS ABOUT THEM
//
// The oracle (tools/validation/production/oracle_intervention.py) checks two
// things by genuinely independent routes: the log-log slope, by Theil-Sen
// against the engine's ordinary least squares, and the skin uplift, by a full
// SI Darcy rate against the engine's ratio of dimensionless groups. Both are
// good checks. What the oracle NEVER DOES is call `chanDiagnosis`,
// `screenTreatments`, `skinFromPiRatio` or `rankTreatments` at all. Its golden
// publishes four histories and a `lateDerivativeSlope` for each, and NOT ONE
// expected mechanism, confidence, verdict or refusal. The classifier -- the
// only part of this module that returns a verdict -- is untested end to end.
//
//   (1) NOT ORACLED. NEGATIVE DERIVATIVES ARE SILENTLY DISCARDED, AND WITH THEM
//       THE CONING EVIDENCE. `chanDiagnosis` builds its derivative fit from
//       `clean.filter(p => p.derivative > 0)`, and `logLogSlope` filters
//       `p.y > 0` again. A late window that has TURNED BACK DOWN is therefore
//       read on the samples from BEFORE the turn. The engine computes
//       `negativeDerivatives` two lines later and uses it only inside the
//       `!derFit.ok` branch, which this well never reaches, so the note it
//       carries -- "A ratio that has turned back down is itself the coning
//       signature" -- is unreachable whenever three positive samples survive.
//       EXPOSED HERE AS THE CENTRE OF THE CAPSTONE. The oracle cannot see it:
//       its own late-slope helper applies the SAME `> 0` filter, and none of
//       its four histories changes sign in the late window.
//
//   (2) NOT ORACLED. A MISSING DERIVATIVE COLUMN IS READ AS A DERIVATIVE OF
//       ZERO, AND RETURNS A REASSURING VERDICT. `Number(null)`, `Number('')`
//       and `Number([])` are all 0, and 0 is finite, so a series with no
//       derivative satisfies `Math.abs(p.derivative) < 1e-12` for every late
//       point and takes the flat branch: `ok: true`, `mechanism: displacement`,
//       "Nothing is changing, so there is no mechanism to diagnose and nothing
//       on this well for an intervention to fix." Only `undefined` gives NaN
//       and reaches the honest `indeterminate`. EXPOSED HERE ON THE GAS-OIL
//       RATIO, where the module's own text sends the user.
//
//   (3) NOT ORACLED. THE FLAT BRANCH ASSERTS SOMETHING IT NEVER CHECKED. That
//       branch's note reads "The ratio is sitting flat at X". Nothing in the
//       branch looks at the ratio trend; the condition is entirely about the
//       derivative. The same return carries `worSlope` and `worR2`, and on
//       BOMU-17's gas history those are strongly positive and near unity while
//       the sentence says the ratio is flat. Graded as
//       `gor_null_derivative_wor_slope`.
//
//   (4) NOT ORACLED. THE GUARD IS AT THE SINGULARITY, NOT AT PLAUSIBILITY.
//       `skinPiMultiplier` refuses a design only when the denominator reaches
//       zero, at skin -7.786 for this geometry, and its refusal text advertises
//       the physical limit: "Real treatments reach about -3 to -5 on acid and
//       -5 to -6 on a fracture". Everything in between is accepted in silence.
//       A design at skin -7.0 -- past everything that message calls real --
//       returns `ok: true`, no warnings, and an uplift of about eighteen times.
//       Graded as `skin_pi_multiplier_at_minus7` against the honest acid job's
//       `acid_job_pi_multiplier`.
//
//   (5) NOT ORACLED. THE TWO FITS IN ONE RETURN SIT ON DIFFERENT WINDOWS.
//       `worSlope` is fitted over EVERY late point; `derivativeSlope` over only
//       the late points whose derivative is positive. On this well that is 26
//       points against 22, the two slopes come out 1.0829 and 1.3127, and the
//       derivative fit's `spanDecades` of 0.9717 is 0.1851 of a log cycle
//       SHORTER than the window it claims to describe. Nothing in the return
//       says so, and the aux block prints both counts side by side.
//
//   (5a) NOT ORACLED. `logLogSlope`'s ZERO-VARIANCE GUARD IS UNREACHABLE, and
//       what happens instead is the opposite of what it intended. The line
//       `const r2 = syy > 0 ? (sxy * sxy) / (sxx * syy) : 1` is meant to hand
//       back a perfect fit when every y is identical. In floating point `syy`
//       over identical y values accumulates to about 1e-31 rather than to 0,
//       so the branch never fires and r2 comes back as about 1e-31. A history
//       whose derivative is EXACTLY CONSTANT -- a ratio rising exactly
//       logarithmically, which is a real signature -- is therefore refused
//       with "The derivative scatters too much to carry a slope: the fit
//       explains only 0.0 percent of it", on data with no scatter whatever.
//       Printed in aux as `constantDerivativeIsRefusedAsNoise`.
//
//   (6) NOT ORACLED, AND UNAMBIGUOUS. The hydraulic-fracture verdict is a
//       ternary with the same value on both arms:
//       `push('hydraulicFracture', Number.isFinite(skin) && skin > 0 ?
//       'consider' : 'consider', ...)`. The skin test does nothing. Printed in
//       aux, not graded, because a string cannot be graded.
//
//   (7) NOT ORACLED. `screenTreatments` does not know which fluid it was
//       handed. Feed it the gas-oil-ratio diagnosis and the WATER shutoff is
//       decided on gas evidence, with reasons quoting the water cut. Printed in
//       aux as the two screenings side by side.
//
// ---------------------------------------------------------------------------
// WHY THE TIERS SPLIT WHERE THEY DO
//
// The module has exactly three computational layers and they land on the three
// tiers without forcing:
//
//   ASSOCIATE  -- THE MEASUREMENT. `logLogSlope` on a raw ratio history, and
//     the pseudo-steady-state group `pssDenominator` / `minimumSkin`. One input
//     set, one number, no verdict, nothing gated by anything else. A learner
//     here is establishing what the well is doing and what its geometry allows,
//     not deciding anything.
//
//   PROFESSIONAL -- THE DIAGNOSIS ITSELF. `chanDiagnosis` on the water history
//     at the stated window, plus `skinPiMultiplier` for the designed acid job:
//     the number that says what the ALTERNATIVE to a water job is worth. These
//     are the numbers a verdict is read off, and reading them is the job.
//
//   EXPERT -- WHAT THE DIAGNOSIS HIDES OR BREAKS. The span the fit actually sat
//     on after the contrary samples were dropped; the slope of the discarded
//     evidence itself; the same diagnosis on two other windows; the fails-open
//     on the gas history; and the uplift the skin guard lets through. Every one
//     is still a return value of the same five functions, run on the evidence
//     the classifier discards or at the margins where it flips.
//
// DETERMINISM. No Math.random anywhere. Both histories are closed forms with
// ANALYTIC derivatives, the same discipline the oracle uses, so nothing here
// depends on a differencing scheme. `logLogSlope` is ordinary least squares
// accumulated as sums of products, so it is INDEPENDENT OF POINT ORDER;
// `chanDiagnosis` sorts by t only to pick `last` and to cut the late window.
// Two runs are byte-identical.
const R = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const I = await import(`${R}/engines/production/interventionDiagnostics.js`);
import * as fs from 'fs';

export const CAP = {
  // ---- the water-oil ratio history -----------------------------------------
  // A displacement term that grows linearly plus a channel term that grows
  // faster, which is why the log-log slope RISES through the history and why
  // the window the analyst picks changes the answer:
  //     WOR(t) = c1 t + c2 t^p,   c2 = c1 tX^(1-p)
  // and after the well is beaned back on day tChoke the cone relaxes towards a
  // residual:
  //     WOR(t) = wRes + (wBreak - wRes) (t/tBreak)^-k
  // Both derivatives d(WOR)/d(ln t) are analytic. Nothing is differenced.
  worN: 46,                 // golden histories: n 40
  worT0Days: 24,            // golden histories: t0 10.0 days
  worT1Days: 2900,          // golden histories: t1 3000.0 days
  worC1PerDay: 0.0015,      // golden displacement history: a 0.05 (WOR = a t)
  worP: 1.8,                // golden channelling history: m 1.6; displacement m 1.0
  worCrossoverDays: 2300,   // golden has no crossover: its forms are single-term
  worChokeDays: 1900,       // golden has no event in any history
  worDeclineK: 0.9,         // golden coning history decays as t/(t+tau), tau 200.0
  worResidual: 1.4,         // golden coning history plateau: 4.0

  // the late-history window the diagnosis is graded on
  lateFraction: 0.55,       // chanDiagnosis default is 0.5, which is also the
                            // oracle's own late window (series[len//2:])
  lateFractionShort: 0.30,  // expert sweep, not a default anywhere
  lateFractionLong: 0.90,   // expert sweep, not a default anywhere
  lateFractionDefault: 0.5, // NOT a capstone condition: this IS chanDiagnosis's
                            // default and the oracle's window, carried in only so
                            // the aux block can show what it gives. No graded
                            // value uses it. (0.5 does occur as a DATUM in the
                            // golden -- the displacement history's first ratio and
                            // derivative -- but it is not a condition there either.)

  // ---- the gas-oil ratio history, with the derivative column missing -------
  //     GOR(t) = g0 + g1 t^q   scf/stb, and derivative: null on every row
  gorN: 30,                 // golden histories: n 40
  gorT0Days: 90,            // golden histories: t0 10.0 days
  gorT1Days: 2900,          // golden histories: t1 3000.0 days
  gorG0ScfStb: 780,         // golden flat history level: 1.2 (and it is a WOR)
  gorG1: 0.02687,           // golden channelling history: a 0.02
  gorQ: 1.4,                // golden channelling history: m 1.6

  // ---- the geometry and the skin ------------------------------------------
  reFt: 1480,               // golden skin and minimumSkin cases: reFt 2000.0
  rwFt: 0.29,               // golden: rwFt 0.35
  skinBefore: 6.4,          // golden skinBefore: 8.0, 5.0, 2.0, 0.0, 12.0
  skinAfterAcid: -2.5,      // golden skinAfter: 0.0, -2.0, 0.0, 0.0, -3.0
  skinAfterOverreach: -7.0, // golden skinAfter: as above; -7.0 is inside the
                            // singularity for this geometry and accepted silently
  skinAfterRefused: -8.2,   // aux only: past the floor, so the engine refuses
  claimedUpliftRatio: 9.6,  // aux only: a vendor's claimed fold-increase, inverted
                            // by skinFromPiRatio. Golden power_law slope 1.35,
                            // intercept ln 3.7; no ratio is published at all.

  // ---- the well as screenTreatments sees it (aux only, all strings) --------
  wctPct: 80.2,             // no water cut appears anywhere in the golden. 80.2 and
                            // not 80, because the golden's power_law abscissa set
                            // contains an x of exactly 80.
  gorScfStb: 2671,          // no gas-oil ratio appears anywhere in the golden
  expectedGorScfStb: 780,   // ditto
  flowing: true,            // ditto
};

// ---------------------------------------------------------------------------
// The two histories, built from the closed forms above.
// ---------------------------------------------------------------------------
export function waterHistory() {
  const c2 = CAP.worC1PerDay * Math.pow(CAP.worCrossoverDays, 1 - CAP.worP);
  const out = [];
  let wBreak = null;
  let tBreak = null;
  for (let i = 0; i < CAP.worN; i += 1) {
    const t = CAP.worT0Days * Math.pow(CAP.worT1Days / CAP.worT0Days, i / (CAP.worN - 1));
    if (t <= CAP.worChokeDays) {
      const wor = CAP.worC1PerDay * t + c2 * Math.pow(t, CAP.worP);
      out.push({ t, ratio: wor, derivative: CAP.worC1PerDay * t + CAP.worP * c2 * Math.pow(t, CAP.worP) });
      wBreak = wor;
      tBreak = t;
    } else {
      const decay = Math.pow(t / tBreak, -CAP.worDeclineK);
      out.push({
        t,
        ratio: CAP.worResidual + (wBreak - CAP.worResidual) * decay,
        derivative: -CAP.worDeclineK * (wBreak - CAP.worResidual) * decay,
      });
    }
  }
  return { series: out, tBreak, wBreak };
}

export function gasHistory() {
  const out = [];
  for (let i = 0; i < CAP.gorN; i += 1) {
    const t = CAP.gorT0Days * Math.pow(CAP.gorT1Days / CAP.gorT0Days, i / (CAP.gorN - 1));
    // The derivative column the production database never filled in.
    out.push({ t, ratio: CAP.gorG0ScfStb + CAP.gorG1 * Math.pow(t, CAP.gorQ), derivative: null });
  }
  return out;
}

export function capstoneValues() {
  const { series: wor, tBreak, wBreak } = waterHistory();
  const gor = gasHistory();

  // --- the measurement layer -----------------------------------------------
  const worFull = I.logLogSlope({ points: wor, xKey: 't', yKey: 'ratio' });
  const denomBefore = I.pssDenominator({ reFt: CAP.reFt, rwFt: CAP.rwFt, skin: CAP.skinBefore });
  const denomAcid = I.pssDenominator({ reFt: CAP.reFt, rwFt: CAP.rwFt, skin: CAP.skinAfterAcid });
  const floorSkin = I.minimumSkin({ reFt: CAP.reFt, rwFt: CAP.rwFt });

  // --- the diagnosis --------------------------------------------------------
  const dx = I.chanDiagnosis({ series: wor, lateFraction: CAP.lateFraction });
  const dxDefault = I.chanDiagnosis({ series: wor, lateFraction: CAP.lateFractionDefault }); // aux
  const dxShort = I.chanDiagnosis({ series: wor, lateFraction: CAP.lateFractionShort });
  const dxLong = I.chanDiagnosis({ series: wor, lateFraction: CAP.lateFractionLong });

  const acid = I.skinPiMultiplier({
    reFt: CAP.reFt, rwFt: CAP.rwFt, skinBefore: CAP.skinBefore, skinAfter: CAP.skinAfterAcid,
  });
  const overreach = I.skinPiMultiplier({
    reFt: CAP.reFt, rwFt: CAP.rwFt, skinBefore: CAP.skinBefore, skinAfter: CAP.skinAfterOverreach,
  });
  const refused = I.skinPiMultiplier({
    reFt: CAP.reFt, rwFt: CAP.rwFt, skinBefore: CAP.skinBefore, skinAfter: CAP.skinAfterRefused,
  });

  // --- what the diagnosis discarded ----------------------------------------
  // The four post-choke samples, read on their own. This is the evidence
  // logLogSlope's `y > 0` filter throws away inside chanDiagnosis.
  const firstPostChoke = wor.find((p) => p.t > CAP.worChokeDays);
  const postChoke = I.logLogSlope({
    points: wor, xKey: 't', yKey: 'ratio', fromX: firstPostChoke.t,
  });

  // --- the gas history, whose derivative column was never computed ----------
  const dxGas = I.chanDiagnosis({ series: gor, lateFraction: CAP.lateFraction });

  // --- aux: what the numbers above actually decided ------------------------
  const wellRow = {
    skin: CAP.skinBefore, reFt: CAP.reFt, rwFt: CAP.rwFt, wctPct: CAP.wctPct,
    gorScfStb: CAP.gorScfStb, expectedGorScfStb: CAP.expectedGorScfStb, flowing: CAP.flowing,
  };
  const screenWater = I.screenTreatments({ well: wellRow, diagnosis: dx });
  const screenLong = I.screenTreatments({ well: wellRow, diagnosis: dxLong });
  const screenGas = I.screenTreatments({ well: wellRow, diagnosis: dxGas });
  const screenNone = I.screenTreatments({ well: wellRow, diagnosis: null });

  const lateAll = wor.filter((p) => p.t >= dx.lateFromT);
  const latePos = lateAll.filter((p) => p.derivative > 0);
  const lateNeg = lateAll.filter((p) => p.derivative < 0);

  // A perfectly flat but NON-zero derivative: syy is 0, so logLogSlope hands
  // back r2 = 1 by fiat, and the classifier reads that as a high-confidence
  // finding off a regression with no variance to explain. Aux only.
  const flatPositive = Array.from({ length: 24 }, (_, i) => {
    const t = 40 * Math.pow(2600 / 40, i / 23);
    return { t, ratio: 2.2 + 0.31 * Math.log(t), derivative: 0.31 };
  });
  const dxFlatPositive = I.chanDiagnosis({ series: flatPositive, lateFraction: CAP.lateFraction });
  const flatPositiveFit = I.logLogSlope({ points: flatPositive, xKey: 't', yKey: 'derivative' });

  // Same water history with the derivative column blanked to null, so the
  // fails-open can be sized against the well's own real reading.
  const dxWaterNulled = I.chanDiagnosis({
    series: wor.map((p) => ({ t: p.t, ratio: p.ratio, derivative: null })),
    lateFraction: CAP.lateFraction,
  });
  // ... and with it blanked to undefined, which is the only spelling that
  // reaches the honest answer.
  const dxWaterUndef = I.chanDiagnosis({
    series: wor.map((p) => ({ t: p.t, ratio: p.ratio })),
    lateFraction: CAP.lateFraction,
  });

  return {
    // Associate: the measurement. What the ratio is doing and what the geometry allows.
    wor_loglog_slope_full:        worFull.slope,
    wor_loglog_intercept_full:    worFull.intercept,
    wor_loglog_r2_full:           worFull.r2,
    wor_loglog_span_decades_full: worFull.spanDecades,
    pss_denominator_at_skin_6p4:  denomBefore,
    minimum_skin_for_geometry:    floorSkin,
    // Professional: the diagnosis, and what the alternative to a water job is worth.
    chan_wor_slope_late:          dx.worSlope,
    chan_wor_r2_late:             dx.worR2,
    chan_derivative_slope_late:   dx.derivativeSlope,
    chan_derivative_r2_late:      dx.derivativeR2,
    chan_late_window_start_days:  dx.lateFromT,
    acid_job_pi_multiplier:       acid.multiplier,
    // Expert: what the diagnosis hides or breaks.
    chan_derivative_span_decades: dx.spanDecades,
    post_choke_wor_slope:         postChoke.slope,
    chan_late030_derivative_slope: dxShort.derivativeSlope,
    chan_late090_derivative_slope: dxLong.derivativeSlope,
    gor_null_derivative_wor_slope: dxGas.worSlope,
    skin_pi_multiplier_at_minus7: overreach.multiplier,
    _aux: {
      well: {
        name: 'BOMU-17',
        worFirst: wor[0], worAtChoke: { tBreak, wBreak },
        worLast: wor[wor.length - 1],
        worMax: wor.reduce((a, p) => (p.ratio > a ? p.ratio : a), 0),
        impliedWatercutPctFromLastWor: 100 * wor[wor.length - 1].ratio / (1 + wor[wor.length - 1].ratio),
        gorFirst: gor[0], gorLast: gor[gor.length - 1],
        gorRiseFactorOverLateWindow: gor[gor.length - 1].ratio / (gor.find((p) => p.t >= dxGas.lateFromT)?.ratio ?? NaN),
      },
      thresholdsInUse: I.CHAN_DEFAULTS,
      diagnosisAtStatedWindow: {
        mechanism: dx.mechanism.id, treatable: dx.mechanism.treatable,
        confidence: dx.confidence, ambiguous: dx.ambiguous,
        derivativeSlope: dx.derivativeSlope,
        marginAboveChannellingSlope: dx.derivativeSlope - I.CHAN_DEFAULTS.channellingSlope,
        marginAboveConingSlope: dx.derivativeSlope - I.CHAN_DEFAULTS.coningSlope,
        notes: dx.notes,
      },
      // DEFECT (1): the discarded coning evidence.
      discardedEvidence: {
        lateWindowPoints: lateAll.length,
        pointsTheDerivativeFitUsed: latePos.length,
        pointsDroppedForNegativeDerivative: lateNeg.length,
        droppedSamples: lateNeg.map((p) => ({ t: p.t, ratio: p.ratio, derivative: p.derivative })),
        derivativeFitSpanDecades: dx.spanDecades,
        lateWindowSpanDecadesIfNothingDropped:
          Math.log10(wor[wor.length - 1].t / dx.lateFromT),
        spanLostToTheDropDecades:
          Math.log10(wor[wor.length - 1].t / dx.lateFromT) - dx.spanDecades,
        atLateFraction030: {
          derivativeFitSpanDecades: dxShort.spanDecades,
          spanIfNothingDropped: Math.log10(wor[wor.length - 1].t / dxShort.lateFromT),
          minSpanDecades: I.CHAN_DEFAULTS.minSpanDecades,
          marginAboveMinSpan: dxShort.spanDecades - I.CHAN_DEFAULTS.minSpanDecades,
        },
        postChokeWorFit: postChoke,
        engineCountedThemAndDidNotUseThem:
          'chanDiagnosis computes negativeDerivatives, then reads it only inside the !derFit.ok branch and the flat branch. With 22 positive samples surviving, derFit.ok is true, so the count is computed and discarded and the note it carries is unreachable.',
      },
      // DEFECT (5): two fits, two windows, one return object.
      twoFitsTwoWindows: {
        worFitPoints: lateAll.length, worSlope: dx.worSlope, worR2: dx.worR2,
        derivativeFitPoints: latePos.length, derivativeSlope: dx.derivativeSlope,
        derivativeR2: dx.derivativeR2, derivativeSpanDecades: dx.spanDecades,
      },
      windowSensitivity: [
        ['lateFraction 0.30', dxShort],
        ['lateFraction 0.50 (the default and the oracle window)', dxDefault],
        ['lateFraction 0.55 (graded)', dx],
        ['lateFraction 0.90', dxLong],
      ].map(([label, d]) => ({
        label,
        lateFromT: d.lateFromT,
        derivativeSlope: d.derivativeSlope,
        derivativeR2: d.derivativeR2,
        spanDecades: d.spanDecades ?? null,
        mechanism: d.mechanism.id,
        confidence: d.confidence,
        ambiguous: d.ambiguous ?? null,
      })),
      // DEFECTS (2) and (3): the fails-open on a missing derivative column.
      missingDerivativeColumn: {
        coercions: {
          'Number(null)': String(Number(null)),
          "Number('')": String(Number('')),
          'Number([])': String(Number([])),
          'Number(undefined)': String(Number(undefined)),
        },
        gasHistory: {
          mechanism: dxGas.mechanism.id, ok: dxGas.ok, confidence: dxGas.confidence,
          worSlope: dxGas.worSlope, worR2: dxGas.worR2,
          derivativeSlope: dxGas.derivativeSlope, derivativeR2: dxGas.derivativeR2,
          lastRatioScfStb: gor[gor.length - 1].ratio,
          notes: dxGas.notes,
        },
        sameWaterHistoryWithNullDerivatives: {
          mechanism: dxWaterNulled.mechanism.id, confidence: dxWaterNulled.confidence,
          worSlope: dxWaterNulled.worSlope, notes: dxWaterNulled.notes,
        },
        sameWaterHistoryWithUndefinedDerivatives: {
          mechanism: dxWaterUndef.mechanism.id, confidence: dxWaterUndef.confidence,
          worSlope: dxWaterUndef.worSlope, notes: dxWaterUndef.notes,
        },
        minWorGateIsUnitBlind:
          `minWor is ${I.CHAN_DEFAULTS.minWor}, named for a water-oil ratio, and it is applied unchanged to a gas-oil ratio in scf/stb. Any real GOR clears it, so the gate is inert on the fluid the module's own gas-shutoff reasoning sends you to.`,
      },
      // DEFECT (5a): the zero-variance guard is unreachable, and a perfectly
      // clean constant derivative is refused as pure noise.
      constantDerivativeIsRefusedAsNoise: {
        seriesDerivative: 0.31,
        rawFitSlope: flatPositiveFit.slope,
        rawFitR2: flatPositiveFit.r2,
        mechanism: dxFlatPositive.mechanism.id, confidence: dxFlatPositive.confidence,
        derivativeSlope: dxFlatPositive.derivativeSlope, derivativeR2: dxFlatPositive.derivativeR2,
        spanDecades: dxFlatPositive.spanDecades ?? null,
        notes: dxFlatPositive.notes,
        why: 'logLogSlope guards this with `syy > 0 ? (sxy*sxy)/(sxx*syy) : 1`, intending r2 = 1 when there is no variance to explain. Over 24 identical y values syy accumulates to about 1e-31 rather than to 0, so the guard never fires and r2 comes back as about 1e-31. The engine then reports 0.0 percent explained on data that has no scatter at all.',
      },
      // DEFECT (4): the guard sits at the singularity, not at plausibility.
      skin: {
        lnReOverRw: Math.log(CAP.reFt / CAP.rwFt),
        floorSkin,
        denominatorAtSkinBefore: denomBefore,
        denominatorAfterAcid: denomAcid,
        acidJob: acid,
        overreachAtMinus7: overreach,
        refusedAtMinus8p2: refused,
        overreachOverAcid: overreach.multiplier / acid.multiplier,
        skinImpliedByClaimedUplift: I.skinFromPiRatio({
          reFt: CAP.reFt, rwFt: CAP.rwFt, ratio: CAP.claimedUpliftRatio, skinReference: CAP.skinBefore,
        }),
        skinFromPiRatioOnBadGeometry: I.skinFromPiRatio({
          reFt: CAP.rwFt, rwFt: CAP.reFt, ratio: 2, skinReference: 0,
        }),
        inconsistentFailureContract:
          'skinPiMultiplier returns { ok: false, error }. skinFromPiRatio returns a bare NaN on the same bad geometry, which propagates silently through any arithmetic downstream.',
      },
      // The golden ships four LABELLED histories and never asserts what the
      // classifier says about any of them. Here is what it says, run on the
      // golden's own series at the golden's own late window. Not graded: these
      // are the golden's conditions, not the capstone's.
      goldenHistoriesThroughTheClassifierTheGoldenNeverTests: (() => {
        const g = JSON.parse(fs.readFileSync(
          `${R}/test-data/production/goldens/intervention_cases.json`, 'utf8'));
        return Object.entries(g.histories).map(([label, h]) => {
          const d = I.chanDiagnosis({ series: h.series, lateFraction: CAP.lateFractionDefault });
          return {
            labelledInTheGoldenAs: label,
            publishedLateDerivativeSlope: h.lateDerivativeSlope,
            engineMechanism: d.mechanism.id,
            engineDerivativeSlope: d.derivativeSlope ?? null,
            engineDerivativeR2: d.derivativeR2 ?? null,
            engineConfidence: d.confidence,
            engineAmbiguous: d.ambiguous ?? null,
          };
        });
      })(),
      // GATE 2, run in code rather than by eye: every numeric capstone
      // condition against every number the golden publishes. An EXACT match is
      // the failure mode; the nearest published number and the gap are printed
      // so the margin is on the record. `lateFractionDefault` is expected to
      // match, because it is not a capstone condition: it is chanDiagnosis's own
      // default, carried in for the aux block only.
      goldenConditionCheck: (() => {
        const g = JSON.parse(fs.readFileSync(
          `${R}/test-data/production/goldens/intervention_cases.json`, 'utf8'));
        const pubv = [];
        const walk = (o, path) => {
          if (typeof o === 'number') { pubv.push([o, path]); return; }
          if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${path}[${i}]`));
          if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`);
        };
        walk(g, 'golden');
        const rows = [];
        let exact = 0;
        for (const [k, v] of Object.entries(CAP)) {
          if (typeof v !== 'number') { rows.push([k, v, 'non-numeric, no golden analogue']); continue; }
          const hit = pubv.filter(([p]) => p === v).map(([, path]) => path);
          let gap = Infinity;
          let near = null;
          for (const [p] of pubv) { const d = Math.abs(p - v); if (d < gap) { gap = d; near = p; } }
          if (hit.length) { exact += 1; rows.push([k, v, `EXACT MATCH: ${hit.slice(0, 2).join(', ')}`]); }
          else rows.push([k, v, `distinct, nearest published ${near}, gap ${gap}`]);
        }
        return {
          goldenNumbersHarvested: pubv.length,
          capConditionsExactlyEqualToAPublishedNumber: exact,
          expectedExactMatches: 'lateFractionDefault only, which is not a capstone condition',
          rows,
        };
      })(),
      // DEFECTS (6) and (7): the screening.
      screening: {
        onTheWaterDiagnosis: screenWater.map((r) => [r.id, r.verdict, r.blocked]),
        onTheLateFraction090Diagnosis: screenLong.map((r) => [r.id, r.verdict, r.blocked]),
        onTheGASDiagnosis: screenGas.map((r) => [r.id, r.verdict, r.blocked]),
        onNoDiagnosisAtAll: screenNone.map((r) => [r.id, r.verdict, r.blocked]),
        waterShutoffFlip: {
          at055: screenWater.find((r) => r.id === 'waterShutoff').verdict,
          at090: screenLong.find((r) => r.id === 'waterShutoff').verdict,
          onGas: screenGas.find((r) => r.id === 'waterShutoff').verdict,
        },
        fractureTernaryIsDead:
          "push('hydraulicFracture', Number.isFinite(skin) && skin > 0 ? 'consider' : 'consider', ...) returns 'consider' on both arms, so the skin test decides nothing.",
        screeningNeverReadsAmbiguous:
          'screenTreatments reads diagnosis.confidence only inside the channelling branch. An ambiguous DISPLACEMENT reading blocks the treatment with no caveat at all.',
        screeningDoesNotKnowTheFluid:
          'screenTreatments takes whatever chanDiagnosis it is handed. The gas-oil-ratio reading blocks the WATER shutoff, with reasons quoting the water cut.',
        rankedOnTheWaterDiagnosis: I.rankTreatments(screenWater).map((r) => [r.verdict, r.id]),
        fullReasonsForWaterShutoff: screenWater.find((r) => r.id === 'waterShutoff'),
      },
    },
  };
}

// TOLERANCES. Absolute, in each field's own units, set at about two parts in a
// million of the value with a floor of 2e-6: tight enough that no field can be
// satisfied by a number read off the golden (goldensweep proves it), and loose
// enough to accept an honest seven-significant-figure rounding, which for a
// value of order one costs up to 5e-7.
const TOL = {
  wor_loglog_slope_full: 2e-6,         // per log cycle
  wor_loglog_intercept_full: 1.5e-5,   // ln(WOR at t = 1 day)
  wor_loglog_r2_full: 2e-6,            // fraction
  wor_loglog_span_decades_full: 5e-6,  // log cycles
  pss_denominator_at_skin_6p4: 3e-5,   // dimensionless
  minimum_skin_for_geometry: 2e-5,     // dimensionless (skin)
  chan_wor_slope_late: 2e-6,           // per log cycle
  chan_wor_r2_late: 2e-6,              // fraction
  chan_derivative_slope_late: 3e-6,    // per log cycle
  chan_derivative_r2_late: 2e-6,       // fraction
  chan_late_window_start_days: 5e-4,   // days
  acid_job_pi_multiplier: 6e-6,        // dimensionless
  chan_derivative_span_decades: 2e-6,  // log cycles
  post_choke_wor_slope: 2e-6,          // per log cycle
  chan_late030_derivative_slope: 3e-6, // per log cycle
  chan_late090_derivative_slope: 3e-6, // per log cycle
  gor_null_derivative_wor_slope: 2e-6, // per log cycle
  skin_pi_multiplier_at_minus7: 4e-5,  // dimensionless
};
const TIER = {
  wor_loglog_slope_full: 'beginner', wor_loglog_intercept_full: 'beginner',
  wor_loglog_r2_full: 'beginner', wor_loglog_span_decades_full: 'beginner',
  pss_denominator_at_skin_6p4: 'beginner', minimum_skin_for_geometry: 'beginner',
  chan_wor_slope_late: 'intermediate', chan_wor_r2_late: 'intermediate',
  chan_derivative_slope_late: 'intermediate', chan_derivative_r2_late: 'intermediate',
  chan_late_window_start_days: 'intermediate', acid_job_pi_multiplier: 'intermediate',
  chan_derivative_span_decades: 'advanced', post_choke_wor_slope: 'advanced',
  chan_late030_derivative_slope: 'advanced', chan_late090_derivative_slope: 'advanced',
  gor_null_derivative_wor_slope: 'advanced', skin_pi_multiplier_at_minus7: 'advanced',
};

const V = capstoneValues();
const fields = Object.keys(TIER).map((k) => [TIER[k], k, V[k], TOL[k]]);
fs.writeFileSync('/root/pd-wip-intervention/fields.json', JSON.stringify(fields, null, 1));
for (const [t, k, v, tol] of fields) console.log(`${t.padEnd(13)} ${k.padEnd(30)} ${v}  (tol ${tol})`);
console.log('\naux:', JSON.stringify(V._aux, null, 1));
