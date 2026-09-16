// The PD6 capstone (Flow Assurance), and the eighteen graded fields derived
// from it by running the engines. Nothing here is typed from a lesson, a chart
// or a table: every graded number below is a return value of
// engines/production/flowlineThermal.js or engines/production/hydrateInhibition.js.
//
// Every condition below differs from the ones flowassurance_cases.json and its
// oracle publish, which is the DR2 rule: design the capstone's conditions
// BEFORE writing the lessons, so the tier can teach on the published case and
// grade on this one. The golden's competing value is named in a trailing
// comment on every line of CAP.
//
// UNITS. Field units throughout, exactly as both engine headers state: degF,
// psia (never psig), ft, in, lbm/ft3, lbm/ft, Btu/(hr ft2 degF) for U,
// Btu/(hr ft degF) for k, Btu/(lb degF) for Cp, lb/hr for mass rate, hr for
// time, weight percent for inhibitor concentration, bbl/d for water and
// chemical, lb/gal for the liquid densities the inhibitor mass balance uses.
// Nothing here is SI. The oracle is the thing that works in SI, and that is
// the whole point of the oracle.
//
// ---------------------------------------------------------------------------
// WHY THE TIERS SPLIT WHERE THEY DO
//
// The two modules have three seams in them and the split follows the seams
// rather than a syllabus.
//
//   ASSOCIATE owns the STACK. `layerResistance`, `burialResistance` and
//   `overallU` know nothing about fluid, rate, time or temperature. They are
//   geometry and material properties in series, and `pipeMassLbPerFt` and
//   `contentsMassLbPerFt` are geometry and density. Every one of those six
//   answers exists before anything flows. That is the simplest honest layer,
//   and it is the layer the rest is built on: U goes into every Professional
//   field and both masses go into the cooldown.
//
//   PROFESSIONAL owns the DESIGN. `relaxationLengthFt`, `steadyStateProfile`,
//   `uForArrivalTemp` and `cooldownTime` are where the fluid, the rate and the
//   clock enter. These are the four numbers a flow assurance engineer is
//   actually asked for: how long is the line thermally, what does it arrive
//   at, what insulation would it take to arrive warmer, and how long after a
//   shutdown before it is a problem. All four are exponentials of the same
//   group and the tier is the place to see that.
//
//   EXPERT owns WHAT THE DESIGN HIDES. Two things break here and both are
//   invisible from the Professional answers. The Joule-Thomson term the
//   profile carries is applied undamped, so it over-cools the arrival by a
//   factor of ntu/(1 - exp(-ntu)); on this line that is 2.138 and it flips the
//   hydrate verdict. And `inhibitionRequirement` sizes the dose from the
//   Hammerschmidt INVERSE and then checks it with Nielsen-Bucklin, so above 25
//   weight percent it returns `ok: true` on a dose that does not reach its own
//   requirement. Both are only visible when you compare two engine returns
//   against each other, which is exactly what an expert tier is for.
//
// ---------------------------------------------------------------------------
// THE LINE: EGBEMA SOUTH FL-4, and why it is uncomfortable
//
// A 12.33 mile, 10 inch schedule 40 tieback from a hot subsea well to a
// gathering manifold, foam-insulated, concrete weight coated, trenched and
// backfilled in wet clay. It is deliberately NOT a comfortable line. Four
// things were tuned into it, and all four are verified from the PRINTED values
// in the aux block rather than asserted:
//
//   1. IT ARRIVES JUST OUTSIDE THE HYDRATE BOUNDARY, AND THE ENGINE SAYS JUST
//      INSIDE. The heat-loss-only arrival is 77.9239 degF, 6.524 degF clear of
//      the 71.4 degF hydrate temperature at the 1285 psia arrival pressure.
//      Turn the Joule-Thomson term on and the engine reports 67.2364 degF,
//      4.164 degF INSIDE the hydrate region: continuous methanol from day one.
//      Damp the same JT term the way the energy balance actually damps it and
//      the arrival is 72.9257 degF, 1.526 degF OUTSIDE. The verdict flips on a
//      defect, and the whole swing is 5.6894 degF.
//
//   2. THE NO-TOUCH TIME IS UNDER THREE HOURS. 2.5446 hr to fall from the
//      arrival temperature to the flowing-condition hydrate temperature, on a
//      13.7926 hr time constant. That is the number the design lives or dies
//      on, and it is short enough that the next two points matter.
//
//   3. THE COOLDOWN IS COMPUTED ON A MASS THAT LEAVES OUT MOST OF THE LINE.
//      `cooldownTime` has exactly two mass slots, `contents` and `shell`,
//      while `overallU` accepts an unbounded layer list. The foam and the
//      concrete weight coat that carry 56.561 percent of the thermal
//      resistance contribute nothing to the thermal mass unless the caller
//      hand-lumps them into `shell`. Counting them takes the same line from
//      2.5446 hr to 5.9523 hr, a factor of 2.3392.
//
//   4. THE INHIBITOR DESIGN DOES NOT REACH ITS OWN SUBCOOLING. Shut in, the
//      line packs to 2900 psia and the hydrate temperature rises to 79.6 degF
//      against a 39.2 degF seabed, which is 40.4 degF of subcooling. Ask for
//      that plus a 5.4 degF margin and `inhibitionRequirement` returns
//      `ok: true` at 38.5919 weight percent methanol. Its own
//      `depressionCheck.nielsenBucklinF` on the same line says that
//      concentration delivers 39.2154 degF: 6.585 degF short of what was asked
//      for and 1.185 degF short of the BARE subcooling. The design the engine
//      passes leaves the line inside the hydrate region.
//
// ---------------------------------------------------------------------------
// WHAT THE ORACLE RECORDS, AND WHERE THIS CAPSTONE STANDS ON EACH
//
// oracle_flowassurance.py checks the thermal resistances, the relaxation
// length, three steady-state arrivals, one cooldown and 24 inhibitor
// depressions, all by crossing into SI (and into CELSIUS with the metric
// constants 1297 and 72 for the inhibitor relations). It records exactly one
// disagreement, and it records it as a TOLERANCE rather than as a defect:
//
//   (a) THE HAMMERSCHMIDT CONSTANT. The oracle emits
//       `constants.hammerschmidtKfromMetric = 2334.6`, which is 1297 x 1.8,
//       and every golden `hammerschmidtF` is computed with it. The engine
//       carries k = 2335 on all four inhibitors. The JS harness therefore
//       compares Hammerschmidt at a relative tolerance of 5e-4 while it
//       compares Nielsen-Bucklin at 1e-9, five and a half orders of magnitude
//       apart, because 2335 versus 2334.6 is a systematic 1.713e-4 on every
//       Hammerschmidt number ever returned. EXPOSED HERE IN AUX, with a third
//       value of the same constant that neither the engine nor the oracle
//       carries: 129.6 x 18.015 = 2334.744, which is the value that makes the
//       module's own two relations agree in the dilute limit.
//
// The oracle checks NOTHING at all about: `uForArrivalTemp`,
// `injectionRate`, `inhibitionRequirement`, `weightPctForDepression`, the
// Joule-Thomson term (it sets no pressures, so jt is 0 in every golden),
// `overallU`'s share percentages and reference diameter, `conductivity` and
// `filmCoefficient` refusals, `pipeMassLbPerFt` and `contentsMassLbPerFt` (it
// inlines its own formulas for the cooldown mass rather than calling them),
// and every branch of `cooldownTime` except the one ordinary case. Eight of
// the nine findings in FINDINGS.md live in that silence, which is the same
// shape the ESP and rod pump waves found: the oracle's silence was the
// finding.
//
// ---------------------------------------------------------------------------
// WHY THE HYDRATE TEMPERATURES ARE INPUTS
//
// Both engine headers are explicit and they agree with each other:
// flowlineThermal says "WHAT IS NOT HERE. Hydrate and wax boundaries. Those
// are fluid properties, they come from a lab or a compositional flash, and the
// consumer supplies them", and hydrateInhibition says it "does NOT compute
// where the hydrate boundary is in the first place". So the two hydrate
// temperatures below are stated conditions, the way a PVT report is, and the
// golden publishes no competing value because the oracle never has one either.
// They are the only two numbers in CAP for which that is true, and it is said
// on the line.
const R = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const T = await import(`${R}/engines/production/flowlineThermal.js`);
const H = await import(`${R}/engines/production/hydrateInhibition.js`);
import * as fs from 'fs';

export const CAP = {
  // ---- the pipe: 10 in schedule 40 line pipe, ANSI B36.10 --------------
  // Published pipe dimensions, and a different pipe from the golden's 6 in
  // schedule 40. Every dimension in the stack differs.
  boreIdIn: 10.02,          // golden overallU.layers: idIn 6.065
  pipeOdIn: 10.75,          // golden: odIn 6.625
  pipeK: 8.67,              // golden overallU.layers[0].k: 26, carbon steel.
                            // This line is 22Cr duplex, which a wet CO2-bearing
                            // tieback is routinely built from, and its
                            // conductivity is a third of carbon steel's. Taking
                            // the pipe off carbon steel is what removes the last
                            // number CAP would otherwise have shared with the
                            // golden: after this change not one condition below
                            // equals any number the golden or its oracle carries.
  pipeDensityLbFt3: 487.3,  // golden: 490 (STEEL_DENSITY_LB_FT3, which is also
                            // pipeMassLbPerFt's own default). Duplex is 7805
                            // kg/m3. Stated so no graded field rides a default.

  // ---- the insulation: polyurethane foam, 0.75 in ---------------------
  foamOdIn: 12.25,          // golden insulation layer: odIn 8.625
  foamK: 0.062,             // golden: 0.09 (syntactic PP). The catalog default
                            // for polyurethane is 0.07; 0.062 is the
                            // manufacturer's measured value for this foam,
                            // which is what the module header says to use.

  // ---- the weight coat: concrete, 2.5 in ------------------------------
  // The golden's stack has NO third layer at all, which is why the share
  // percentages here cannot be read off it.
  concreteOdIn: 17.25,      // golden: no weight coat; its outermost od is 8.625
  concreteK: 0.88,          // golden: no weight coat. Catalog concrete is 0.9;
                            // 0.88 is this coat's tested value.

  // ---- the films ------------------------------------------------------
  insideFilmH: 285,         // golden oracle: 250 (a number in neither catalog).
                            // 285 is this project's measured bore-side film for
                            // a flowing liquid, near the catalog's liquidFlowing
                            // 300 without being it. It carries 0.19 percent of
                            // the stack, which is the module header's point that
                            // a flowing bore is very nearly a short circuit.
  outsideFilmH: 64,         // golden oracle: 200 (FILM_COEFFICIENTS
                            // seawaterCurrent). 64 is the survey's own measured
                            // coefficient for this sheltered channel, between
                            // the catalog's still-water 50 and a swept seabed,
                            // which is exactly what the module header says to
                            // pass. It carries 0.6 percent of the stack.

  // ---- the trench -----------------------------------------------------
  burialFt: 5.5,            // golden: 4 ft to centreline
  soilK: 1.45,              // golden: 1.2 (catalog soilWet). 1.45 is the
                            // measured backfill conductivity for this trench.
  burialSlipFt: 0.55,       // NOT a capstone condition and no graded field
                            // uses it: a deliberately wrong burial depth,
                            // shallower than half the coated diameter, carried
                            // in only so the aux block can size what the engine
                            // does with it. See FINDINGS.md (iii).

  // ---- the fluid and the duty ----------------------------------------
  lengthFt: 65120,          // golden profile lengths: 5280, 26400, 105600
  massRateLbHr: 90000,      // golden: 120000 and 60000
  cpBtuLbF: 0.58,           // golden: 0.5 and 0.6
  inletTempF: 268.0,        // golden profile: 180
  ambientTempF: 39.2,       // golden: 40
  nStationsProfile: 41,     // golden publishes no station count; the function's
                            // own default is 21. Stated so no default is used.
                            // arrivalTempF and ntu do not depend on it.

  // ---- the pressures, and the Joule-Thomson coefficient ---------------
  // The golden sets NO pressures anywhere, so jt is 0 in every published case
  // and the oracle never touches this path.
  inletPsia: 2140,          // golden: no pressures published at all
  outletPsia: 1285,         // golden: no pressures published at all
  jtCoeffFPerPsi: 0.0125,   // golden: no JT coefficient published at all
                            // (the JS unit test uses 0.02 on a 800 psi drop)

  // ---- the fluid the line holds, for the cooldown ----------------------
  contentsDensityLbFt3: 47.5, // golden cooldown contents: 55 lbm/ft3
  shellCpBtuLbF: 0.113,     // golden: 0.11 Btu/(lb degF) for the steel
  nStationsCooldown: 33,    // golden publishes no station count; the function's
                            // own default is 25. Stated so no default is used.
                            // `hours` and `timeConstantHr` do not depend on it.
  coatingDensityLbFt3: 140, // golden: no weight coat, so no coating density
  foamDensityLbFt3: 44,     // golden: no insulation mass at all
  coatingCpBtuLbF: 0.21,    // golden: no weight coat
  foamCpBtuLbF: 0.32,       // golden: no insulation mass at all

  // ---- the hydrate boundary: a lab number, stated -----------------------
  // Both engine headers say in as many words that the hydrate boundary is not
  // theirs to compute and is supplied by the consumer. The golden publishes no
  // hydrate temperature, at any pressure, because its oracle has none either.
  // These are the two lab values for this fluid.
  hydrateTempFlowingF: 71.4, // golden: publishes no hydrate boundary
  hydrateTempShutInF: 79.6,  // golden: publishes no hydrate boundary. Shut in,
                             // the line packs from 1285 to 2900 psia and the
                             // boundary moves 8.2 degF up with it.

  // ---- the insulation retrofit question ---------------------------------
  targetArrivalTempF: 96.5, // golden: publishes no arrival target; the JS unit
                            // test asks uForArrivalTemp for 120 degF

  // ---- the inhibitor design --------------------------------------------
  shutInSubcoolingF: 40.4,  // = hydrateTempShutInF - ambientTempF, 79.6 - 39.2.
                            // golden publishes no subcooling; the JS unit tests
                            // use 12, 25, 400 and -5.
  safetyMarginF: 5.4,       // golden publishes no margin; the JS unit test uses 3
  waterRateBpd: 780,        // golden publishes no water rate; the JS unit tests
                            // use 200 and 100 bbl/d
  meohLeanWtPct: 95.5,      // golden publishes no lean strength; the JS unit
                            // tests use 100 and 80 and 85
  megLeanWtPct: 88.5,       // golden publishes no lean strength; as above
  waterDensityLbGal: 8.62,  // the produced brine. NOT left at the function's
                            // own default of 8.34, which is fresh water; both
                            // graded rates state this value.
  // MAX_PRACTICAL_WT_PCT is deliberately NOT copied into CAP. It is the
  // module's own constant, the aux block reads it straight off the import, and
  // no graded field uses it.
};

// The stack, outward from the bore, exactly as `overallU` wants it.
const STEEL = { idIn: CAP.boreIdIn, odIn: CAP.pipeOdIn, k: CAP.pipeK };
const FOAM = { idIn: CAP.pipeOdIn, odIn: CAP.foamOdIn, k: CAP.foamK };
const COAT = { idIn: CAP.foamOdIn, odIn: CAP.concreteOdIn, k: CAP.concreteK };
const FILMS = {
  insideFilmH: CAP.insideFilmH,
  outsideFilmH: CAP.outsideFilmH,
  referenceIdIn: CAP.boreIdIn,
};

export function capstoneValues() {
  // --- the stack -----------------------------------------------------------
  const uBare = T.overallU({ layers: [STEEL], ...FILMS });
  const uIns = T.overallU({ layers: [STEEL, FOAM], ...FILMS });
  const uBur = T.overallU({
    layers: [STEEL, FOAM, COAT], burialFt: CAP.burialFt, kSoil: CAP.soilK, ...FILMS,
  });
  // The trench entered 0.6 ft deep instead of 5.5. Not graded: aux only.
  const uSlip = T.overallU({
    layers: [STEEL, FOAM, COAT], burialFt: CAP.burialSlipFt, kSoil: CAP.soilK, ...FILMS,
  });
  const foamShare = uBur.resistances.find((r) => r.id === 'layer1');
  const coatShare = uBur.resistances.find((r) => r.id === 'layer2');
  const groundShare = uBur.resistances.find((r) => r.id === 'burial');
  const U = uBur.uBtuHrFt2F;

  const steelMass = T.pipeMassLbPerFt({
    idIn: CAP.boreIdIn, odIn: CAP.pipeOdIn, densityLbFt3: CAP.pipeDensityLbFt3,
  });
  const contentsMass = T.contentsMassLbPerFt({
    idIn: CAP.boreIdIn, densityLbFt3: CAP.contentsDensityLbFt3,
  });
  const foamMass = T.pipeMassLbPerFt({
    idIn: CAP.pipeOdIn, odIn: CAP.foamOdIn, densityLbFt3: CAP.foamDensityLbFt3,
  });
  const coatMass = T.pipeMassLbPerFt({
    idIn: CAP.foamOdIn, odIn: CAP.concreteOdIn, densityLbFt3: CAP.coatingDensityLbFt3,
  });

  // --- the design ----------------------------------------------------------
  const duty = {
    lengthFt: CAP.lengthFt, inletTempF: CAP.inletTempF, ambientTempF: CAP.ambientTempF,
    massRateLbHr: CAP.massRateLbHr, cpBtuLbF: CAP.cpBtuLbF, idIn: CAP.boreIdIn,
  };
  const lcFt = T.relaxationLengthFt({ ...duty, uBtuHrFt2F: U });
  const prof = T.steadyStateProfile({
    ...duty, uBtuHrFt2F: U, nStations: CAP.nStationsProfile,
  });
  const ntu = prof.ntu;
  const need = T.uForArrivalTemp({ ...duty, targetTempF: CAP.targetArrivalTempF });

  // --- the Joule-Thomson term ---------------------------------------------
  const jtCommon = {
    ...duty, uBtuHrFt2F: U, nStations: CAP.nStationsProfile,
    inletPsia: CAP.inletPsia, outletPsia: CAP.outletPsia,
  };
  // What the engine does: the whole JT drop, carried linearly.
  const profJt = T.steadyStateProfile({ ...jtCommon, jtCoeffFPerPsi: CAP.jtCoeffFPerPsi });
  // What the energy balance does. m Cp dT/dx = -UpiD(T - Ta) - m Cp s with s a
  // CONSTANT JT sink per foot (which is exactly what a linear pressure profile
  // implies) integrates to a JT offset of s Lc (1 - exp(-ntu)), not to s L. The
  // ratio is (1 - exp(-ntu))/ntu, so feeding the engine a JT coefficient scaled
  // by that factor makes it return the damped answer. Still an engine return.
  const jtDampFactor = (1 - Math.exp(-ntu)) / ntu;
  const profJtDamped = T.steadyStateProfile({
    ...jtCommon, jtCoeffFPerPsi: CAP.jtCoeffFPerPsi * jtDampFactor,
  });
  // How long this line would have to be before the engine reports an arrival
  // BELOW the seabed, which `uForArrivalTemp` in the same module refuses to
  // accept as a target. Aux only.
  const longLine = T.steadyStateProfile({
    ...jtCommon, lengthFt: CAP.lengthFt * 3,
  });
  const longLineJt = T.steadyStateProfile({
    ...jtCommon, lengthFt: CAP.lengthFt * 3, jtCoeffFPerPsi: CAP.jtCoeffFPerPsi,
  });

  // --- the cooldown --------------------------------------------------------
  const coolCommon = {
    contents: { massLbPerFt: contentsMass, cpBtuLbF: CAP.cpBtuLbF },
    shell: { massLbPerFt: steelMass, cpBtuLbF: CAP.shellCpBtuLbF },
    uBtuHrFt2F: U, idIn: CAP.boreIdIn,
    startTempF: prof.arrivalTempF, ambientTempF: CAP.ambientTempF,
    nStations: CAP.nStationsCooldown,
  };
  const cool = T.cooldownTime({ ...coolCommon, targetTempF: CAP.hydrateTempFlowingF });
  // The same shutdown asked the question that is actually correct: the line
  // packs in, so the boundary to beat is the SHUT-IN one. Aux only.
  const coolShutIn = T.cooldownTime({ ...coolCommon, targetTempF: CAP.hydrateTempShutInF });
  // The same shutdown with the coatings counted in the thermal mass, lumped
  // into the one `shell` slot the API offers. Aux only.
  const lumpedMass = steelMass + foamMass + coatMass;
  const lumpedCp = (steelMass * CAP.shellCpBtuLbF + foamMass * CAP.foamCpBtuLbF
    + coatMass * CAP.coatingCpBtuLbF) / lumpedMass;
  const coolCoated = T.cooldownTime({
    ...coolCommon,
    shell: { massLbPerFt: lumpedMass, cpBtuLbF: lumpedCp },
    targetTempF: CAP.hydrateTempFlowingF,
  });

  // --- the inhibitor design ------------------------------------------------
  const meoh = H.inhibitionRequirement({
    subcoolingF: CAP.shutInSubcoolingF, safetyMarginF: CAP.safetyMarginF,
    waterRateBpd: CAP.waterRateBpd, inhibitorId: 'methanol',
    leanWtPct: CAP.meohLeanWtPct, waterDensityLbGal: CAP.waterDensityLbGal,
  });
  const meg = H.inhibitionRequirement({
    subcoolingF: CAP.shutInSubcoolingF, safetyMarginF: CAP.safetyMarginF,
    waterRateBpd: CAP.waterRateBpd, inhibitorId: 'meg',
    leanWtPct: CAP.megLeanWtPct, waterDensityLbGal: CAP.waterDensityLbGal,
  });
  // The engine refuses to run Nielsen-Bucklin on a glycol. Run it anyway, in
  // aux, to show that the MEG dose sits at the SAME mole fraction as the
  // methanol dose and therefore has exactly the same true depression.
  const megNbF = H.nielsenBucklinDepression({
    weightPct: meg.weightPct, molecularWeight: 62.07,
  });
  const meohX = H.weightPctToMoleFraction({
    weightPct: meoh.weightPct, molecularWeight: 32.04,
  });
  const megX = H.weightPctToMoleFraction({
    weightPct: meg.weightPct, molecularWeight: 62.07,
  });

  return {
    // Associate: the stack. What the pipe is, before anything flows.
    u_bare_btu_hr_ft2_f:        uBare.uBtuHrFt2F,
    u_insulated_btu_hr_ft2_f:   uIns.uBtuHrFt2F,
    u_buried_btu_hr_ft2_f:      U,
    foam_resistance_share_pct:  foamShare.sharePct,
    steel_mass_lbm_per_ft:      steelMass,
    contents_mass_lbm_per_ft:   contentsMass,
    // Professional: the design. What the line does with a fluid in it.
    relaxation_length_ft:       lcFt,
    arrival_temp_f:             prof.arrivalTempF,
    ntu_dimensionless:          ntu,
    u_for_target_arrival_btu_hr_ft2_f: need.uBtuHrFt2F,
    cooldown_hours_hr:          cool.hours,
    cooldown_time_constant_hr:  cool.timeConstantHr,
    // Expert: what the design hides. Where the two engines break.
    jt_arrival_temp_f:          profJt.arrivalTempF,
    meoh_design_wt_pct:         meoh.weightPct,
    meoh_delivered_depression_f: meoh.depressionCheck.nielsenBucklinF,
    meoh_injection_rate_bpd:    meoh.rate.rateBpd,
    meg_design_wt_pct:          meg.weightPct,
    meg_injection_rate_bpd:     meg.rate.rateBpd,
    _aux: {
      stack: {
        uBareBtuHrFt2F: uBare.uBtuHrFt2F,
        uInsulatedBtuHrFt2F: uIns.uBtuHrFt2F,
        uBuriedBtuHrFt2F: U,
        referenceIdIn: uBur.referenceIdIn,
        totalResistanceHrFtF_perBtu: uBur.totalResistance,
        shares: uBur.resistances.map((r) => ({ id: r.id, r: r.r, sharePct: r.sharePct })),
        insulationPlusCoatSharePct: foamShare.sharePct + coatShare.sharePct,
        groundSharePct: groundShare.sharePct,
        bareOverInsulated: uBare.uBtuHrFt2F / uIns.uBtuHrFt2F,
        // FINDINGS (iii): a burial depth shallower than half the coated
        // diameter makes burialResistance NaN, and overallU DROPS it instead
        // of refusing, so a trenched line silently becomes an exposed one.
        burialSilentDrop: {
          burialFt: CAP.burialSlipFt,
          burialResistance: String(T.burialResistance({
            odIn: CAP.concreteOdIn, burialFt: CAP.burialSlipFt, kSoil: CAP.soilK,
          })),
          ok: uSlip.ok,
          uBtuHrFt2F: uSlip.uBtuHrFt2F,
          resistanceIds: uSlip.resistances.map((r) => r.id),
          uErrorPct: ((uSlip.uBtuHrFt2F - U) / U) * 100,
        },
        // FINDINGS (iv): overallU reports referenceIdIn, and not one consumer
        // in the module accepts it. A U referred to the coated OD, passed with
        // the bore, is dimensionally consistent and wrong by 17.25/10.02.
        referenceSeam: {
          uToBore: U,
          uToCoatedOd: T.overallU({
            layers: [STEEL, FOAM, COAT], burialFt: CAP.burialFt, kSoil: CAP.soilK,
            insideFilmH: CAP.insideFilmH, outsideFilmH: CAP.outsideFilmH,
            referenceIdIn: CAP.concreteOdIn,
          }).uBtuHrFt2F,
          arrivalIfMisreferenced: T.steadyStateProfile({
            ...duty,
            uBtuHrFt2F: T.overallU({
              layers: [STEEL, FOAM, COAT], burialFt: CAP.burialFt, kSoil: CAP.soilK,
              insideFilmH: CAP.insideFilmH, outsideFilmH: CAP.outsideFilmH,
              referenceIdIn: CAP.concreteOdIn,
            }).uBtuHrFt2F,
            nStations: CAP.nStationsProfile,
          }).arrivalTempF,
          arrivalCorrectF: prof.arrivalTempF,
        },
      },
      masses: {
        steelLbPerFt: steelMass,
        contentsLbPerFt: contentsMass,
        foamLbPerFt: foamMass,
        coatingLbPerFt: coatMass,
        mcpGradedBtuPerFtF: contentsMass * CAP.cpBtuLbF + steelMass * CAP.shellCpBtuLbF,
        mcpWithCoatingsBtuPerFtF: contentsMass * CAP.cpBtuLbF + lumpedMass * lumpedCp,
      },
      design: {
        relaxationLengthFt: lcFt,
        lengthFt: CAP.lengthFt,
        ntu: ntu,
        arrivalTempF: prof.arrivalTempF,
        marginOverFlowingHydrateF: prof.arrivalTempF - CAP.hydrateTempFlowingF,
        uForTargetArrival: need,
        insulationImprovementPct: ((U - need.uBtuHrFt2F) / U) * 100,
        cooldownHours: cool.hours,
        cooldownTimeConstantHr: cool.timeConstantHr,
        // FINDINGS (v): the coatings that carry most of the resistance carry
        // none of the mass.
        cooldownWithCoatingsHr: coolCoated.hours,
        cooldownCoatingRatio: coolCoated.hours / cool.hours,
        // FINDINGS (vi): the correct target is the SHUT-IN boundary, and the
        // engine returns a negative no-touch time with ok true, no note, and a
        // station table that WARMS.
        cooldownToShutInBoundary: {
          targetTempF: CAP.hydrateTempShutInF,
          ok: coolShutIn.ok,
          hours: coolShutIn.hours,
          note: coolShutIn.note ?? null,
          firstStation: coolShutIn.stations[0],
          lastStation: coolShutIn.stations[coolShutIn.stations.length - 1],
        },
      },
      // FINDINGS (ii): the JT term is applied undamped.
      jouleThomson: {
        dpPsi: CAP.inletPsia - CAP.outletPsia,
        jtCoeffFPerPsi: CAP.jtCoeffFPerPsi,
        fullJtDropF: CAP.jtCoeffFPerPsi * (CAP.inletPsia - CAP.outletPsia),
        dampFactor: jtDampFactor,
        overApplicationFactor: 1 / jtDampFactor,
        arrivalNoJtF: prof.arrivalTempF,
        arrivalEngineJtF: profJt.arrivalTempF,
        arrivalDampedJtF: profJtDamped.arrivalTempF,
        dampedMinusEngineF: profJtDamped.arrivalTempF - profJt.arrivalTempF,
        hydrateTempFlowingF: CAP.hydrateTempFlowingF,
        engineSubcoolingF: CAP.hydrateTempFlowingF - profJt.arrivalTempF,
        dampedSubcoolingF: CAP.hydrateTempFlowingF - profJtDamped.arrivalTempF,
        verdictEngine: profJt.arrivalTempF < CAP.hydrateTempFlowingF
          ? 'inside the hydrate region' : 'outside the hydrate region',
        verdictDamped: profJtDamped.arrivalTempF < CAP.hydrateTempFlowingF
          ? 'inside the hydrate region' : 'outside the hydrate region',
        // and the same term on a line three times as long, where the engine's
        // arrival goes BELOW the seabed that is heating it
        tripleLength: {
          lengthFt: CAP.lengthFt * 3,
          ambientTempF: CAP.ambientTempF,
          arrivalNoJtF: longLine.arrivalTempF,
          arrivalEngineJtF: longLineJt.arrivalTempF,
          belowAmbient: longLineJt.arrivalTempF < CAP.ambientTempF,
          uForArrivalAtThatTemp: T.uForArrivalTemp({
            ...duty, lengthFt: CAP.lengthFt * 3, targetTempF: longLineJt.arrivalTempF,
          }),
        },
      },
      // FINDINGS (i): the requirement is sized on the inverse of a relation the
      // module itself does not trust at the concentration it produces.
      inhibition: {
        subcoolingF: CAP.shutInSubcoolingF,
        safetyMarginF: CAP.safetyMarginF,
        neededDepressionF: meoh.neededDepressionF,
        methanol: {
          ok: meoh.ok,
          required: meoh.required,
          weightPct: meoh.weightPct,
          reliable: meoh.depressionCheck.reliable,
          basis: meoh.depressionCheck.basis,
          hammerschmidtF: meoh.depressionCheck.hammerschmidtF,
          nielsenBucklinF: meoh.depressionCheck.nielsenBucklinF,
          recommendedF: meoh.depressionCheck.recommendedF,
          spreadF: meoh.depressionCheck.spreadF,
          shortfallVsNeedF: meoh.neededDepressionF - meoh.depressionCheck.nielsenBucklinF,
          shortfallVsSubcoolingF: CAP.shutInSubcoolingF - meoh.depressionCheck.nielsenBucklinF,
          stillInsideHydrateRegion:
            meoh.depressionCheck.nielsenBucklinF < CAP.shutInSubcoolingF,
          moleFraction: meohX,
          rateBpd: meoh.rate.rateBpd,
          streamDensityLbGal: meoh.rate.streamDensityLbGal,
          pureMassLbDay: meoh.rate.pureMassLbDay,
          massLbDay: meoh.rate.massLbDay,
        },
        meg: {
          ok: meg.ok,
          weightPct: meg.weightPct,
          basis: meg.depressionCheck.basis,
          nielsenBucklinF: meg.depressionCheck.nielsenBucklinF,
          recommendedF: meg.depressionCheck.recommendedF,
          spreadF: meg.depressionCheck.spreadF,
          note: meg.depressionCheck.note,
          // run on the glycol anyway: the same mole fraction, the same answer
          nielsenBucklinIfRun: megNbF,
          moleFraction: megX,
          moleFractionMinusMethanol: megX - meohX,
          rateBpd: meg.rate.rateBpd,
          streamDensityLbGal: meg.rate.streamDensityLbGal,
        },
        // The dose Nielsen-Bucklin would actually need for the stated
        // requirement, obtained by inverting the engine's own forward relation
        // by bisection on engine returns only.
        honestMethanol: (() => {
          let lo = 0.001; let hi = 99.999;
          for (let i = 0; i < 200; i += 1) {
            const mid = (lo + hi) / 2;
            const d = H.nielsenBucklinDepression({ weightPct: mid, molecularWeight: 32.04 });
            if (d < meoh.neededDepressionF) lo = mid; else hi = mid;
          }
          const w = (lo + hi) / 2;
          const rate = H.injectionRate({
            waterRateBpd: CAP.waterRateBpd, weightPct: w, inhibitorId: 'methanol',
            leanWtPct: CAP.meohLeanWtPct, waterDensityLbGal: CAP.waterDensityLbGal,
          });
          return {
            weightPct: w,
            underDoseWtPct: w - meoh.weightPct,
            checkDepressionF: H.nielsenBucklinDepression({ weightPct: w, molecularWeight: 32.04 }),
            rateBpd: rate.rateBpd,
            extraChemicalBpd: rate.rateBpd - meoh.rate.rateBpd,
            extraChemicalPct: (rate.rateBpd / meoh.rate.rateBpd - 1) * 100,
          };
        })(),
        // Part of FINDINGS (i): the two relations are already 8 percent apart
        // AT the concentration the module calls reliable.
        reliabilityBoundary: {
          weightPct: H.HAMMERSCHMIDT_RELIABLE_WT_PCT,
          reliable: H.depression({
            weightPct: H.HAMMERSCHMIDT_RELIABLE_WT_PCT, inhibitorId: 'methanol',
          }).reliable,
          basis: H.depression({
            weightPct: H.HAMMERSCHMIDT_RELIABLE_WT_PCT, inhibitorId: 'methanol',
          }).basis,
          hammerschmidtF: H.depression({
            weightPct: H.HAMMERSCHMIDT_RELIABLE_WT_PCT, inhibitorId: 'methanol',
          }).hammerschmidtF,
          nielsenBucklinF: H.depression({
            weightPct: H.HAMMERSCHMIDT_RELIABLE_WT_PCT, inhibitorId: 'methanol',
          }).nielsenBucklinF,
          spreadF: H.depression({
            weightPct: H.HAMMERSCHMIDT_RELIABLE_WT_PCT, inhibitorId: 'methanol',
          }).spreadF,
        },
        // FINDINGS (vii): the practical ceiling is measured with the relation
        // the module does not trust up there.
        ceiling: {
          maxPracticalWtPct: H.MAX_PRACTICAL_WT_PCT,
          hammerschmidtAtCeilingF: H.hammerschmidtDepression({
            weightPct: H.MAX_PRACTICAL_WT_PCT, molecularWeight: 32.04, k: 2335,
          }),
          nielsenBucklinAtCeilingF: H.nielsenBucklinDepression({
            weightPct: H.MAX_PRACTICAL_WT_PCT, molecularWeight: 32.04,
          }),
        },
        // FINDINGS (viii): three values of one constant.
        hammerschmidtConstant: {
          engineK: 2335,
          oracleKfromMetric: 1297 * 1.8,
          kThatMatchesNielsenBucklin: H.NIELSEN_BUCKLIN_CONSTANT_F * H.WATER_MOLECULAR_WEIGHT,
          engineOverOracle: 2335 / (1297 * 1.8),
          // the two relations at near-infinite dilution, where they must agree
          dilute: {
            weightPct: 0.001,
            hammerschmidtF: H.hammerschmidtDepression({
              weightPct: 0.001, molecularWeight: 32.04, k: 2335,
            }),
            nielsenBucklinF: H.nielsenBucklinDepression({
              weightPct: 0.001, molecularWeight: 32.04,
            }),
          },
        },
        // FINDINGS (ix): leanWtPct is a WEIGHT percent one line above and a
        // VOLUME percent one line below.
        streamDensity: {
          meohEngineLbGal: meoh.rate.streamDensityLbGal,
          meohVolumeAdditiveLbGal: 1 / ((CAP.meohLeanWtPct / 100) / 6.6
            + (1 - CAP.meohLeanWtPct / 100) / CAP.waterDensityLbGal),
          megEngineLbGal: meg.rate.streamDensityLbGal,
          megVolumeAdditiveLbGal: 1 / ((CAP.megLeanWtPct / 100) / 9.3
            + (1 - CAP.megLeanWtPct / 100) / CAP.waterDensityLbGal),
          meohRateErrorPct: ((1 / ((CAP.meohLeanWtPct / 100) / 6.6
            + (1 - CAP.meohLeanWtPct / 100) / CAP.waterDensityLbGal))
            / meoh.rate.streamDensityLbGal - 1) * 100,
          megRateErrorPct: ((1 / ((CAP.megLeanWtPct / 100) / 9.3
            + (1 - CAP.megLeanWtPct / 100) / CAP.waterDensityLbGal))
            / meg.rate.streamDensityLbGal - 1) * 100,
        },
      },
    },
  };
}

// Tolerances are ABSOLUTE, in each field's own unit, and set at 5e-7 of the
// value: comfortably above the 5e-8 a seven-significant-figure rounding of a
// number of this size can cost, and far below anything an arithmetic slip or a
// different method could produce. Two decimal figures, so they read as a
// deliberate choice rather than as a machine artefact.
const TOL = {
  u_bare_btu_hr_ft2_f: 2.3e-5,
  u_insulated_btu_hr_ft2_f: 5.6e-7,
  u_buried_btu_hr_ft2_f: 2.7e-7,
  foam_resistance_share_pct: 2.4e-5,
  steel_mass_lbm_per_ft: 2.0e-5,
  contents_mass_lbm_per_ft: 1.3e-5,
  relaxation_length_ft: 1.8e-2,
  arrival_temp_f: 3.9e-5,
  ntu_dimensionless: 8.9e-7,
  u_for_target_arrival_btu_hr_ft2_f: 2.1e-7,
  cooldown_hours_hr: 1.3e-6,
  cooldown_time_constant_hr: 6.9e-6,
  jt_arrival_temp_f: 3.4e-5,
  meoh_design_wt_pct: 1.9e-5,
  meoh_delivered_depression_f: 2.0e-5,
  meoh_injection_rate_bpd: 3.3e-4,
  meg_design_wt_pct: 2.7e-5,
  meg_injection_rate_bpd: 5.0e-4,
};
const TIER = {
  u_bare_btu_hr_ft2_f: 'beginner',
  u_insulated_btu_hr_ft2_f: 'beginner',
  u_buried_btu_hr_ft2_f: 'beginner',
  foam_resistance_share_pct: 'beginner',
  steel_mass_lbm_per_ft: 'beginner',
  contents_mass_lbm_per_ft: 'beginner',
  relaxation_length_ft: 'intermediate',
  arrival_temp_f: 'intermediate',
  ntu_dimensionless: 'intermediate',
  u_for_target_arrival_btu_hr_ft2_f: 'intermediate',
  cooldown_hours_hr: 'intermediate',
  cooldown_time_constant_hr: 'intermediate',
  jt_arrival_temp_f: 'advanced',
  meoh_design_wt_pct: 'advanced',
  meoh_delivered_depression_f: 'advanced',
  meoh_injection_rate_bpd: 'advanced',
  meg_design_wt_pct: 'advanced',
  meg_injection_rate_bpd: 'advanced',
};
export const UNIT = {
  u_bare_btu_hr_ft2_f: 'Btu/(hr ft2 degF)',
  u_insulated_btu_hr_ft2_f: 'Btu/(hr ft2 degF)',
  u_buried_btu_hr_ft2_f: 'Btu/(hr ft2 degF)',
  foam_resistance_share_pct: 'percent of total thermal resistance',
  steel_mass_lbm_per_ft: 'lbm/ft',
  contents_mass_lbm_per_ft: 'lbm/ft',
  relaxation_length_ft: 'ft',
  arrival_temp_f: 'degF',
  ntu_dimensionless: 'dimensionless',
  u_for_target_arrival_btu_hr_ft2_f: 'Btu/(hr ft2 degF)',
  cooldown_hours_hr: 'hr',
  cooldown_time_constant_hr: 'hr',
  jt_arrival_temp_f: 'degF',
  meoh_design_wt_pct: 'weight percent in the aqueous phase',
  meoh_delivered_depression_f: 'degF',
  meoh_injection_rate_bpd: 'bbl/d',
  meg_design_wt_pct: 'weight percent in the aqueous phase',
  meg_injection_rate_bpd: 'bbl/d',
};

const V = capstoneValues();
const fields = Object.keys(TIER).map((k) => [TIER[k], k, V[k], TOL[k]]);
fs.writeFileSync('/root/pd-wip-flowassurance/fields.json', JSON.stringify(fields, null, 1));
for (const [t, k, v, tol] of fields) {
  console.log(`${t.padEnd(13)} ${k.padEnd(34)} ${v}  ${UNIT[k]}  (tol ${tol})`);
}
console.log('\naux:', JSON.stringify(V._aux, null, 1));
