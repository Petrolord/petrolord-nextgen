// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of gasprocessing_cases.json
// (plus sweeps around those published inputs) and the TEACHING FIELDS this
// wave designed for itself: the OBIAFU dehydration duty, the UBIE sour gas
// train and the AGBADA dew point skid. THE FC4 CAPSTONE RUNS DIFFERENT
// STREAMS ENTIRELY: nothing here imports, reads or reproduces the capstone
// generator, the graded answer file, or any capstone stream, rate,
// pressure, temperature, gravity, spec, ratio, strength, loading or duty.
//
// Usage:  sh /root/fc-wip-gasprocessing/build_digest.sh > digest.tmp \
//           && mv digest.tmp /root/fc-wip-gasprocessing/digest.txt
//
// Engine, vendored at NextGen fa33717f, sha-identical with engines 709172f
// (which is byte-for-byte fa53f7f on every gas-processing path):
// engines/facilities/gasProcessing.js, over
// engines/production/gasProperties.js for the Sutton pseudo-criticals, the
// DAK z-factor and the Rankine door.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from a published case) or "derived" (arithmetic
// on engine values printed on the same row or in the same block, with the
// arithmetic stated). Where the engine keeps a constant to itself, the
// constant is MEASURED by asking the engine a question about itself rather
// than typed. Nothing here reads a clock, a random number or a network.
//
// SECTION 14 IS WITHHELD. The Joule-Thomson chain is under repair (FC4-0)
// and its numbers are not teaching truth today. Rather than print them
// behind a banner a writer would learn to ignore, the section states what
// it will contain and prints nothing.

import fs from 'fs';
import {
  OBIAFU_LINE, OBIAFU, OBIAFU_CONTACTOR,
  OBIAFU_RATIO_SWEEP, RATIO_AT_LOWER_CUSTOM, RATIO_JUST_UNDER_LOWER,
  RATIO_AT_UPPER_CUSTOM, RATIO_JUST_OVER_UPPER,
  OBIAFU_SPEC_SWEEP, OBIAFU_RATE_SWEEP,
  SATURATION_P, SATURATION_T, WARN_AT_THRESHOLD, WARN_JUST_OVER,
  FIT_LOW_EDGE_F, FIT_BELOW_LOW_EDGE_F, FIT_HIGH_EDGE_F, FIT_ABOVE_HIGH_EDGE_F,
  FIT_DOCSTRING_HIGH_EDGE_F, WATER_FREEZING_F,
  UBIE, UBIE_CONTACTOR, UBIE_AMINE_IDS, UBIE_RICH_SWEEP,
  RICH_AT_MDEA_LIMIT, RICH_JUST_OVER_MDEA_LIMIT, UBIE_LEAN_SWEEP,
  UBIE_SPEC_ALREADY_MET, UBIE_SPEC_ABOVE_INLET,
  KREMSER_FACTORS, KREMSER_STAGES, OBIAFU_ABSORPTION_FACTOR, OBIAFU_STAGES,
  A_AT_UNITY, A_JUST_UNDER_UNITY, A_JUST_OVER_UNITY, A_WELL_UNDER_UNITY,
  UNREACHABLE_SPEC,
  LBMOL_PROBE, OVERHEAD_PROBE, MINUTES_PROBE, TONS_PROBE, RHO_L_PROBE,
  AMINE_DENSITY_PROBE, REBOILER_GROUP_PROBE,
} from '/root/fc-wip-gasprocessing/fc4_fields.mjs';

const ROOT = process.env.FC4_ENGINES || '/root/wt-fc4-nextgen/packages/engines';
const G = await import(`${ROOT}/engines/facilities/gasProcessing.js`);
const P = await import(`${ROOT}/engines/production/gasProperties.js`);
const GOLD = JSON.parse(fs.readFileSync(
  `${ROOT}/test-data/facilities/goldens/gasprocessing_cases.json`, 'utf8'));

const out = [];
const w = (s = '') => out.push(s);
const num = (x, n) => (x === null || x === undefined || Number.isNaN(Number(x)) ? 'null' : Number(x).toFixed(n));
const e6 = (x) => num(x, 6);     // psia, degF, lb/MMscf, gpm, ft, ratios
const r4 = (x) => num(x, 4);     // lb/day, gal/day, Btu/gal, lbmol/day
const raw = (x) => String(x);
const soft = (r) => (r && r.error ? `{ error: "${r.error}" }` : 'no error');
const shape = (r) => JSON.stringify(r);

/* The OBIAFU chain, run once and reused, so every section reads the same
 * answer rather than a fresh call that might have drifted. */
const OB_SAT = G.saturatedWaterContent(OBIAFU_LINE);
const OB = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf });
const OB_CONT = G.contactorDiameter({
  gasMMscfd: OBIAFU.gasMMscfd, pPsia: OBIAFU_LINE.pPsia, tF: OBIAFU_LINE.tF,
  ...OBIAFU_CONTACTOR,
});
const UB = G.aminePackage(UBIE);
const UB_CONT = G.contactorDiameter({ gasMMscfd: UBIE.gasMMscfd, ...UBIE_CONTACTOR });

/* ---------------------------------------------------------- constants */
/* Rule: where the module keeps a number to itself, ASK THE ENGINE A
 * QUESTION ABOUT ITSELF. Each probe below is a set of arguments chosen so
 * that one constant is the only thing left in the answer. */
const lbmolProbe = G.tegPackage(LBMOL_PROBE);
const LBMOL_SCF = 1e6 / lbmolProbe.btexLbDay;
const overheadProbe = G.tegPackage(OVERHEAD_PROBE);
const OVERHEAD_BTU_LB = overheadProbe.vaporPerGal;
const minutesProbe = G.tegPackage(MINUTES_PROBE);
const MINUTES_PER_DAY = minutesProbe.circGpd / minutesProbe.circGpm;
const tonsProbe = G.tegPackage(TONS_PROBE);
const YEAR_OVER_TON = tonsProbe.btexTonsYear / tonsProbe.btexLbDay;
const rhoLProbe = G.contactorDiameter(RHO_L_PROBE);
const RHO_L = rhoLProbe.rhoG * ((rhoLProbe.vAllowFtS / RHO_L_PROBE.ksFtS) ** 2 + 1);
const reboilerProbe = G.tegPackage(REBOILER_GROUP_PROBE);
const HOURS_TIMES_MM = (reboilerProbe.circGpd * reboilerProbe.dutyBtuPerGal) / reboilerProbe.reboilerMMBtuHr;
const MW_WATER = OB_SAT.lbPerMMscf / (OB_SAT.yWater * (1e6 / LBMOL_SCF));
const RANKINE_OFFSET = P.toRankine(0);
/* The amine gallons chain: acidMolesDay is returned, the swing, strength
 * and circulation are the caller's or returned, and the molecular weight
 * and solution gravity are exported by the amine table. */
const adp = G.aminePackage(AMINE_DENSITY_PROBE);
const adpAmine = G.amineOf(AMINE_DENSITY_PROBE.amineId);
const AMINE_LB_PER_GAL = (() => {
  const swing = AMINE_DENSITY_PROBE.richLoading - AMINE_DENSITY_PROBE.leanLoading;
  const solnLbDay = (adp.acidMolesDay / swing) * adpAmine.mw / (AMINE_DENSITY_PROBE.amineWtPct / 100);
  return solnLbDay / (adp.circGpm * MINUTES_PER_DAY) / adpAmine.sgSolution;
})();
/* The contactor's standard-condition group: qAct is the allowed velocity
 * times the flow area the diameter implies, so the group falls out. */
const CONTACTOR_BASE_GROUP = (() => {
  const c = rhoLProbe;
  const qAct = c.vAllowFtS * Math.PI * (c.diameterFt ** 2) / 4;
  const tR = P.toRankine(RHO_L_PROBE.tF);
  return (qAct * RHO_L_PROBE.pPsia) / (((RHO_L_PROBE.gasMMscfd * 1e6) / 86400) * tR * c.z);
})();
/* The Joule-Thomson group, the only constant of that routine the repair
 * will not move: R over the Btu conversion, at unit heat capacity. */
const jtUnitCp = G.jouleThomsonFPerPsi({ pPsia: 800, tF: 100, gasSg: 0.65, cpBtuLbmolF: 1 });
const JT_R_GROUP = (jtUnitCp.muFPerPsi * jtUnitCp.z * 800) / ((P.toRankine(100) ** 2) * jtUnitCp.dzdT);
/* The water vapour pressure coefficient, at the freezing point where the
 * Magnus exponent is exactly zero and only the coefficient is left. */
const MAGNUS_COEFF_PSIA = G.waterSatPsia(WATER_FREEZING_F);

// ------------------------------------------------------------------ header
w('# FC4 Gas Processing. Teaching digest.');
w('# Water contents, pressures, temperatures, circulations, diameters and ratios print to six decimals; pounds a day, gallons a day, Btu a gallon and lbmol a day to four; counts are whole numbers.');
w('# Field units: MMscfd of gas, psia, degF, lb of water per MMscf of gas, gal of solvent per lb of water, gpm, mol percent, Btu and MMBtu an hour.');
w('# Nothing here is read from a clock or a random number, so every line reproduces.');
w('# SECTION 14 IS WITHHELD PENDING FC4-0. See that section for what it will hold and why nothing stands in for it.');
w();

// ---------------------------------------------------------------- SECTION 1
w('# SECTION 1: What this engine conditions, and what it refuses (owned by Associate m01)');
w();
w('# App surface: the Gas Processing Studio runs three units over one gas stream. Dehydration takes water out with glycol, sweetening takes acid gas out with amine, and the dew point unit cools the gas by letting it down.');
w('- This engine conditions a GAS STREAM. It answers how much water a gas carries, how much solvent it takes to remove it, what the regenerator costs to run, how wide the vessel has to be, and how far a let-down cools the gas.');
w('- The doctrine the module was written against is stated in its own header: everything that is a DESIGN CHOICE or a chart value is an INPUT with its customary range named, and everything computable from first principles is computed. The predecessor app hid three numbers inside constants; this one asks for them.');
w('- A state the method has no answer for comes back as an object with an `error` string. This module throws nothing. It has ONE export that breaks that contract by returning a bare number, and Section 15 reads it.');
w('- What is NOT in this engine: no hydrate boundary, no compositional flash, no rate-based absorber model, no stage efficiency, no molecular sieve, no refrigeration and no NGL recovery. A hydrate margin is the Production module Flow Assurance engine, and the phase envelope of a reservoir fluid is the Fluid engine.');
w();
w('The three units, on the two teaching streams, end to end:');
w(`- OBIAFU carries ${e6(OB_SAT.lbPerMMscf)} lb of water per MMscf at ${e6(OBIAFU_LINE.pPsia)} psia and ${e6(OBIAFU_LINE.tF)} degF, and at ${e6(OBIAFU.gasMMscfd)} MMscfd a spec of ${e6(OBIAFU.outletLbMMscf)} lb per MMscf means taking out ${r4(OB.waterLbDay)} lb a day, which at ${e6(OBIAFU.circulationGalPerLb)} gal per lb is ${e6(OB.circGpm)} gpm of glycol and ${e6(OB.reboilerMMBtuHr)} MMBtu an hour of reboiler.`);
w(`- UBIE arrives at ${e6(UBIE.co2MolPct)} mol percent CO2 and ${e6(UBIE.h2sMolPct)} mol percent H2S, and meeting ${e6(UBIE.co2SpecMolPct)} and ${e6(UBIE.h2sSpecMolPct)} means picking up ${r4(UB.acidMolesDay)} lbmol of acid gas a day, which at a swing to ${e6(UB.richLoadingUsed)} is ${e6(UB.circGpm)} gpm of solution and ${e6(UB.reboilerMMBtuHr)} MMBtu an hour of regenerator.`);
w(`- The two contactors those streams go up are ${e6(OB_CONT.diameterFt)} ft and ${e6(UB_CONT.diameterFt)} ft across.`);
w();

// ---------------------------------------------------------------- SECTION 2
w('# SECTION 2: The constants this module keeps to itself (owned by Associate m01 l04 and Expert m05)');
w();
w('Every figure in this section is MEASURED out of the engine by asking it a question whose answer is the constant and nothing else. None is typed.');
w(`- the standard cubic feet in a pound mole: ${e6(LBMOL_SCF)}. Measured from the BTEX mole balance at one MMscfd, a million ppmv, a unit absorbed fraction and a unit molecular weight, where the answer is a million over this number and nothing else.`);
w(`- the molecular weight of water: ${e6(MW_WATER)}. Measured from the saturation answer divided by the mole fraction the same call returns, over the standard cubic feet just measured.`);
w(`- the water overhead the reboiler pays for: ${e6(OVERHEAD_BTU_LB)} Btu per lb. Measured at a circulation ratio of one gallon per pound and no reflux, where the vaporization term IS the overhead. The module's own comment calls this a latent heat of about 970 folded together with the sensible heat to the still; only the folded figure is in the code, and the 970 is not.`);
w(`- the minutes in a day: ${e6(MINUTES_PER_DAY)}. Measured by dividing the gallons a day the engine returns by the gallons a minute the same call returns.`);
w(`- the days in a year over the pounds in a short ton: ${e6(YEAR_OVER_TON)}. Measured as one BTEX answer divided by another from the same call. The two cannot be separated from outside, because they only ever appear as this ratio.`);
w(`- the hours in a day times the Btu in a MMBtu: ${num(HOURS_TIMES_MM, 0)}. Measured as the gallons a day times the duty per gallon over the duty in MMBtu an hour.`);
w(`- the liquid density the contactor sizes against: ${e6(RHO_L)} lb per ft3. Measured from the gas density and the allowed velocity the same call returns, since the velocity is the K value times the root of the density ratio.`);
w(`- the pounds per gallon of water the amine gallons chain divides by: ${e6(AMINE_LB_PER_GAL)}. Measured from the acid gas the engine says it picked up, through the swing, the molecular weight and the solution gravity the amine table exports, against the circulation the engine returned.`);
w(`- the contactor's standard-condition group, base pressure over base temperature: ${num(CONTACTOR_BASE_GROUP, 9)} psia per degR. Measured from the allowed velocity and the diameter, which together give the actual volume the engine formed.`);
w(`- the gas constant over the Btu conversion in the Joule-Thomson routine: ${e6(JT_R_GROUP)}. Measured at a unit heat capacity from the coefficient, the compressibility and the derivative the same call returns.`);
w(`- the water vapour pressure at the freezing point: ${num(MAGNUS_COEFF_PSIA, 9)} psia. This is the Magnus coefficient itself, because the exponent is exactly zero there.`);
w(`- the Rankine offset, from the gas properties module's own door: ${e6(RANKINE_OFFSET)} degR.`);
w(`- the molecular weight of dry air and the gas constant, both exported rather than measured: ${e6(P.AIR_MW)} and ${e6(P.R_UNIVERSAL)}.`);
w();
w('Two of those are worth a second look, and BOTH comparisons below are computed on this page rather than asserted:');
const impliedBase = (CONTACTOR_BASE_GROUP * 520) ;
w(`- the module's comment says its ${e6(LBMOL_SCF)} standard cubic feet per pound mole are measured at 14.65 psia. The gas constant and the Rankine offset it also uses put the pressure that gives that molar volume at 60 degF at ${e6((P.R_UNIVERSAL * (60 + RANKINE_OFFSET)) / LBMOL_SCF)} psia, which is ${e6(((P.R_UNIVERSAL * (60 + RANKINE_OFFSET)) / LBMOL_SCF) / 14.65)} times the 14.65 the comment names.`);
w(`- the contactor converts standard cubic feet to actual ones with a base group of ${num(CONTACTOR_BASE_GROUP, 9)} psia per degR. The group implied by the module's own pound mole at ${e6(60 + RANKINE_OFFSET)} degR is ${num(((P.R_UNIVERSAL * (60 + RANKINE_OFFSET)) / LBMOL_SCF) / (60 + RANKINE_OFFSET), 9)} psia per degR, and the first is ${e6(CONTACTOR_BASE_GROUP / (((P.R_UNIVERSAL * (60 + RANKINE_OFFSET)) / LBMOL_SCF) / (60 + RANKINE_OFFSET)))} times the second. A diameter carries the square root of that, so the two bases move a contactor by ${e6(100 * (1 - Math.sqrt(CONTACTOR_BASE_GROUP / (((P.R_UNIVERSAL * (60 + RANKINE_OFFSET)) / LBMOL_SCF) / (60 + RANKINE_OFFSET)))))} percent.`);
w(`- the glycol density the contactor sizes against is ${e6(RHO_L)} lb per ft3. The glycol density the dehydration balance is handed by default is ${e6(9.3)} lb per gal, which is ${e6(9.3 * 1728 / 231)} lb per ft3 at 231 cubic inches to the gallon and 1728 to the cubic foot, and the first is ${e6(RHO_L / (9.3 * 1728 / 231))} times the second. One module, one fluid, two densities.`);
w();

// ---------------------------------------------------------------- SECTION 3
w('# SECTION 3: How much water a gas carries (owned by Associate m02)');
w();
w('The method is ideal vapour-liquid equilibrium over liquid water: the mole fraction of water in the gas is the vapour pressure of water over the total pressure, and the mass follows from the pound mole.');
w(`On OBIAFU at ${e6(OBIAFU_LINE.pPsia)} psia and ${e6(OBIAFU_LINE.tF)} degF the mole fraction is ${num(OB_SAT.yWater, 9)} and the content is ${e6(OB_SAT.lbPerMMscf)} lb per MMscf. The vapour pressure at that temperature alone is ${e6(G.waterSatPsia(OBIAFU_LINE.tF))} psia, and the mole fraction is that over the total pressure: ${num(G.waterSatPsia(OBIAFU_LINE.tF) / OBIAFU_LINE.pPsia, 9)} (derived, the two figures on this line divided).`);
w();
w('The surface, in lb per MMscf. Rows are degF, columns are psia:');
w(`| degF | ${SATURATION_P.map((p) => `${p} psia`).join(' | ')} |`);
w(`| --- | ${SATURATION_P.map(() => '---').join(' | ')} |`);
SATURATION_T.forEach((t) => {
  w(`| ${e6(t)} | ${SATURATION_P.map((p) => e6(G.saturatedWaterContent({ pPsia: p, tF: t }).lbPerMMscf)).join(' | ')} |`);
});
w();
w('The vapour pressure alone, which is the whole temperature dependence and carries no pressure at all:');
w('| degF | vapour pressure, psia |');
w('| --- | --- |');
SATURATION_T.forEach((t) => w(`| ${e6(t)} | ${e6(G.waterSatPsia(t))} |`));
w();
w('The published cases, engine against golden:');
w('| psia | degF | engine, lb/MMscf | golden, lb/MMscf | engine over golden |');
w('| --- | --- | --- | --- | --- |');
GOLD.water.forEach((row) => {
  const r = G.saturatedWaterContent(row);
  w(`| ${e6(row.pPsia)} | ${e6(row.tF)} | ${e6(r.lbPerMMscf)} | ${e6(row.lbPerMMscf)} | ${num(r.lbPerMMscf / row.lbPerMMscf, 9)} |`);
});
w('The golden comes from a DIFFERENT published vapour-pressure equation from the one the engine uses, which is why the last column is near one rather than one. That is the whole value of the check: two independent fits of the same physical curve, meeting inside their shared band.');
w();

// ---------------------------------------------------------------- SECTION 4
w('# SECTION 4: Where the ideal answer stops (owned by Associate m02 l05 and Expert m05)');
w();
w('Two separate limits sit on the water answer, and they are not the same limit.');
w(`- THE CHART LIMIT. Above ${e6(WARN_AT_THRESHOLD)} psia the engine attaches a warning and keeps answering, because real-gas behaviour makes the true content higher than ideal mixing says. Read from both sides at the threshold itself: at ${e6(WARN_AT_THRESHOLD)} psia the warning is ${shape(G.saturatedWaterContent({ pPsia: WARN_AT_THRESHOLD, tF: OBIAFU_LINE.tF }).warning)} and at ${e6(WARN_JUST_OVER)} psia it is ${shape(G.saturatedWaterContent({ pPsia: WARN_JUST_OVER, tF: OBIAFU_LINE.tF }).warning)}.`);
w(`- THE FIT LIMIT. The vapour-pressure fit is guarded to a temperature band and refuses outside it. At ${e6(FIT_LOW_EDGE_F)} degF it returns ${e6(G.waterSatPsia(FIT_LOW_EDGE_F))} psia and at ${e6(FIT_BELOW_LOW_EDGE_F)} degF it returns ${raw(G.waterSatPsia(FIT_BELOW_LOW_EDGE_F))}. At ${e6(FIT_HIGH_EDGE_F)} degF it returns ${e6(G.waterSatPsia(FIT_HIGH_EDGE_F))} psia and at ${e6(FIT_ABOVE_HIGH_EDGE_F)} degF it returns ${raw(G.waterSatPsia(FIT_ABOVE_HIGH_EDGE_F))}.`);
w(`- The module's own docstring names a narrower upper edge than the guard enforces, at ${e6(FIT_DOCSTRING_HIGH_EDGE_F)} degF, where the fit returns ${e6(G.waterSatPsia(FIT_DOCSTRING_HIGH_EDGE_F))} psia. Between that and the guard the module answers without a note.`);
w(`- At the guard's own upper edge the fit puts the vapour pressure of water at ${e6(G.waterSatPsia(FIT_HIGH_EDGE_F))} psia. Water boils at one standard atmosphere there by definition, so the fit reads ${e6(G.waterSatPsia(FIT_HIGH_EDGE_F) / 14.6959487755142)} times the pressure the definition fixes (derived, the figure on this line over the standard atmosphere).`);
w();
w('What a refusal looks like, and what it protects:');
[
  ['a temperature below the fit', () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_BELOW_LOW_EDGE_F })],
  ['a temperature above the fit', () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_ABOVE_HIGH_EDGE_F })],
  ['a total pressure below the vapour pressure', () => G.saturatedWaterContent({ pPsia: 0.5, tF: 104 })],
  ['a total pressure exactly at the vapour pressure', () => G.saturatedWaterContent({ pPsia: G.waterSatPsia(104), tF: 104 })],
].forEach(([label, fn]) => w(`- ${label}: ${soft(fn())}`));
w('The third and fourth are the same guard read from either side of its own limit. A gas at exactly its water vapour pressure is all water and nothing else, so refusing the equality is right rather than over-strict.');
w();

// ---------------------------------------------------------------- SECTION 5
w('# SECTION 5: The water a unit has to take out (owned by Associate m03)');
w();
w(`The spec sets the load. OBIAFU arrives at ${e6(OB_SAT.lbPerMMscf)} lb per MMscf and has to leave at ${e6(OBIAFU.outletLbMMscf)}, so ${e6(OB_SAT.lbPerMMscf - OBIAFU.outletLbMMscf)} lb per MMscf comes out (derived, the two figures on this line subtracted), and at ${e6(OBIAFU.gasMMscfd)} MMscfd that is ${r4(OB.waterLbDay)} lb a day.`);
w();
w('The same stream against the spec, at a fixed rate and ratio:');
w('| outlet spec, lb/MMscf | water out, lb/day | circulation, gpm | reboiler, MMBtu/hr |');
w('| --- | --- | --- | --- |');
OBIAFU_SPEC_SWEEP.forEach((s) => {
  const r = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, outletLbMMscf: s });
  w(`| ${e6(s)} | ${r4(r.waterLbDay)} | ${e6(r.circGpm)} | ${e6(r.reboilerMMBtuHr)} |`);
});
w();
w('The same spec against the rate, which is the difference between an intensive answer and an extensive one:');
w('| rate, MMscfd | water out, lb/day | circulation, gpm | reboiler, MMBtu/hr | Btu per gallon |');
w('| --- | --- | --- | --- | --- |');
OBIAFU_RATE_SWEEP.forEach((q) => {
  const r = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, gasMMscfd: q });
  w(`| ${e6(q)} | ${r4(r.waterLbDay)} | ${e6(r.circGpm)} | ${e6(r.reboilerMMBtuHr)} | ${r4(r.dutyBtuPerGal)} |`);
});
w('The last column does not move down that table. The duty per gallon is a property of the glycol loop, and the rate only decides how many gallons there are.');
w();

// ---------------------------------------------------------------- SECTION 6
w('# SECTION 6: The circulation ratio is a choice (owned by Associate m03 l03)');
w();
w('The gallons of glycol per pound of water removed is a DESIGN CHOICE the engine will not make. It is the one number that decides both how much glycol moves and how much heat each gallon needs.');
w('| gal per lb | circulation, gpm | Btu per gal | sensible, Btu/gal | overhead, Btu/gal | reboiler, MMBtu/hr | warning |');
w('| --- | --- | --- | --- | --- | --- | --- |');
OBIAFU_RATIO_SWEEP.forEach((c) => {
  const r = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, circulationGalPerLb: c });
  w(`| ${e6(c)} | ${e6(r.circGpm)} | ${r4(r.dutyBtuPerGal)} | ${r4(r.sensiblePerGal)} | ${r4(r.vaporPerGal)} | ${e6(r.reboilerMMBtuHr)} | ${r.warning ? 'yes' : 'no'} |`);
});
w('Three things move in that table and they do not move together. More glycol per pound means more gallons and therefore more sensible heat in total, but each gallon carries LESS water and so needs less heat to boil it out, which is why the Btu a gallon falls while the MMBtu an hour rises.');
w();
w('The customary band, read from both sides of both edges:');
w('| gal per lb | warning |');
w('| --- | --- |');
[RATIO_JUST_UNDER_LOWER, RATIO_AT_LOWER_CUSTOM, RATIO_AT_UPPER_CUSTOM, RATIO_JUST_OVER_UPPER].forEach((c) => {
  const r = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, circulationGalPerLb: c });
  w(`| ${e6(c)} | ${shape(r.warning)} |`);
});
w('Both edges are inclusive: the engine warns outside two to five and is silent at exactly two and exactly five. A guard that objected to its own customary limit would be as wrong as one that accepted anything.');
w();

// ---------------------------------------------------------------- SECTION 7
w('# SECTION 7: What the reboiler pays for (owned by Associate m04)');
w();
w('The duty is assembled from named parts instead of arriving as one number. Two parts, and they answer different questions.');
w(`- SENSIBLE: heating the glycol itself from the absorber to the still. On OBIAFU that is ${e6(OBIAFU.reboilerTF)} degF less ${e6(OBIAFU.absorberTF)} degF of rise, on ${e6(9.3)} lb of glycol a gallon at ${e6(0.55)} Btu per lb per degF, which the engine returns as ${r4(OB.sensiblePerGal)} Btu a gallon.`);
w(`- OVERHEAD: boiling the absorbed water back out, plus the reflux the still condenses and boils again. Each gallon carries ${num(1 / OBIAFU.circulationGalPerLb, 9)} lb of water at this ratio (derived, one over the ratio), the overhead is ${e6(OVERHEAD_BTU_LB)} Btu a lb measured in Section 2, and the reflux ratio of ${e6(OBIAFU.refluxRatio)} adds that fraction again. The engine returns ${r4(OB.vaporPerGal)} Btu a gallon.`);
w(`- The two sum to ${r4(OB.dutyBtuPerGal)} Btu a gallon, and the sensible half is ${e6(OB.sensiblePerGal / OB.dutyBtuPerGal)} of the total (derived, the sensible over the sum).`);
w(`- At ${r4(OB.circGpd)} gallons a day that is ${e6(OB.reboilerMMBtuHr)} MMBtu an hour.`);
w();
w('The reflux ratio on its own, holding everything else:');
w('| reflux ratio | overhead, Btu/gal | total, Btu/gal | reboiler, MMBtu/hr |');
w('| --- | --- | --- | --- |');
[0, 0.1, 0.2, 0.25, 0.4, 0.6].forEach((rr) => {
  const r = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, refluxRatio: rr });
  w(`| ${e6(rr)} | ${r4(r.vaporPerGal)} | ${r4(r.dutyBtuPerGal)} | ${e6(r.reboilerMMBtuHr)} |`);
});
w();
w('The still temperature on its own, which moves only the sensible half:');
w('| reboiler degF | sensible, Btu/gal | overhead, Btu/gal | total, Btu/gal |');
w('| --- | --- | --- | --- |');
[340, 360, 375, 390, 400].forEach((tt) => {
  const r = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, reboilerTF: tt });
  w(`| ${e6(tt)} | ${r4(r.sensiblePerGal)} | ${r4(r.vaporPerGal)} | ${r4(r.dutyBtuPerGal)} |`);
});
w();

// ---------------------------------------------------------------- SECTION 8
w('# SECTION 8: The TEG published cases (owned by Associate m05)');
w();
w('| rate | inlet | outlet | gal/lb | water, lb/day | gpm | Btu/gal | MMBtu/hr | BTEX, lb/day |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.teg.forEach((row) => {
  const r = G.tegPackage(row);
  w(`| ${e6(row.gasMMscfd)} | ${e6(row.inletLbMMscf)} | ${e6(row.outletLbMMscf)} | ${e6(row.circulationGalPerLb)} | ${r4(r.waterLbDay)} | ${e6(r.circGpm)} | ${r4(r.dutyBtuPerGal)} | ${e6(r.reboilerMMBtuHr)} | ${r4(r.btexLbDay)} |`);
});
w('Against the golden, engine over golden on every field the published case carries:');
w('| case | water | gpm | Btu/gal | MMBtu/hr | BTEX |');
w('| --- | --- | --- | --- | --- | --- |');
GOLD.teg.forEach((row, i) => {
  const r = G.tegPackage(row);
  w(`| ${i + 1} | ${num(r.waterLbDay / row.waterLbDay, 12)} | ${num(r.circGpm / row.circGpm, 12)} | ${num(r.dutyBtuPerGal / row.dutyBtuPerGal, 12)} | ${num(r.reboilerMMBtuHr / row.reboilerMMBtuHr, 12)} | ${num(r.btexLbDay / row.btexLbDay, 12)} |`);
});
w('Every ratio is one to twelve decimals. Section 16 says what that does and does not prove.');
w();

// ---------------------------------------------------------------- SECTION 9
w('# SECTION 9: A contactor is a staged device (owned by Professional m01 and m02)');
w();
w('The Kremser relation ties three things: the absorption factor, the number of theoretical stages, and the fraction of the solute the column removes. Give it any two and it gives the third.');
w(`On the OBIAFU absorber at an absorption factor of ${e6(OBIAFU_ABSORPTION_FACTOR)} over ${e6(OBIAFU_STAGES)} stages the removal is ${num(G.kremserFractionRemoved({ absorptionFactor: OBIAFU_ABSORPTION_FACTOR, stages: OBIAFU_STAGES }), 9)}.`);
w();
w('The surface. Rows are stages, columns are the absorption factor:');
w(`| stages | ${KREMSER_FACTORS.map((a) => `A = ${a}`).join(' | ')} |`);
w(`| --- | ${KREMSER_FACTORS.map(() => '---').join(' | ')} |`);
KREMSER_STAGES.forEach((n) => {
  w(`| ${n} | ${KREMSER_FACTORS.map((a) => num(G.kremserFractionRemoved({ absorptionFactor: a, stages: n }), 9)).join(' | ')} |`);
});
w();
w('Read the columns, not the rows. Above an absorption factor of one every column climbs towards total removal as the stages are added. AT AND BELOW ONE IT DOES NOT, and the last column below is the gap between what 200 stages reach and the absorption factor itself:');
w('| A | removal at 12 stages | removal at 200 stages | A itself | 200 stages less A |');
w('| --- | --- | --- | --- | --- |');
[0.6, A_WELL_UNDER_UNITY, 0.95, A_JUST_UNDER_UNITY, A_AT_UNITY, A_JUST_OVER_UNITY, 1.2].forEach((a) => {
  const f200 = G.kremserFractionRemoved({ absorptionFactor: a, stages: 200 });
  w(`| ${num(a, 12)} | ${num(G.kremserFractionRemoved({ absorptionFactor: a, stages: 12 }), 9)} | ${num(f200, 9)} | ${num(a, 9)} | ${num(f200 - a, 12)} |`);
});
w('Below unity the removal never passes the absorption factor however many stages are bought, and the last column says how close 200 stages get. It is exactly zero for the lower factors, because the factor raised to the stage count has fallen below anything double precision can hold and the relation collapses to the factor itself. Only near one does 200 stages fall measurably short. AT AND ABOVE UNITY THAT COLUMN MEANS NOTHING, because there is no ceiling there to measure against: it is the distance from a removal that cannot exceed one to a factor that can, and it goes more negative the larger the factor, which is arithmetic about the column rather than physics about the absorber.');
w('At unity the closed form is indeterminate and the engine takes a separate branch, the stages over the stages plus one. Either side of unity by a billionth the answer is continuous with it, which is what says the branch is a limit rather than a patch.');
w();
w('Solving the other way round, for the stages a spec demands:');
w('| A | removal wanted | stages | check: removal at those stages |');
w('| --- | --- | --- | --- |');
[[1.2, 0.9], [OBIAFU_ABSORPTION_FACTOR, 0.9], [OBIAFU_ABSORPTION_FACTOR, 0.99], [2.0, 0.99], [A_AT_UNITY, 0.9]].forEach(([a, f]) => {
  const s = G.kremserStagesFor({ absorptionFactor: a, fractionRemoved: f });
  const back = s.error ? null : G.kremserFractionRemoved({ absorptionFactor: a, stages: s.stages });
  w(`| ${e6(a)} | ${e6(f)} | ${s.error ? `refuses: ${s.error}` : num(s.stages, 9)} | ${back === null ? 'n/a' : num(back, 9)} |`);
});
w(`And a spec a starved absorber cannot reach at any stage count: at an absorption factor of ${e6(A_WELL_UNDER_UNITY)} a removal of ${e6(UNREACHABLE_SPEC)} comes back as ${soft(G.kremserStagesFor({ absorptionFactor: A_WELL_UNDER_UNITY, fractionRemoved: UNREACHABLE_SPEC }))}. The refusal names the remedy, which is more solvent rather than more trays.`);
w();
w('The published cases, engine against golden. The golden here is a BRUTE FORCE STAGE CASCADE solved as a linear system, which is a genuinely different road to the same number:');
w('| A | stages | engine | golden | engine over golden |');
w('| --- | --- | --- | --- | --- |');
GOLD.kremser.forEach((row) => {
  const f = G.kremserFractionRemoved(row);
  w(`| ${e6(row.absorptionFactor)} | ${row.stages} | ${num(f, 12)} | ${num(row.fractionRemoved, 12)} | ${num(f / row.fractionRemoved, 12)} |`);
});
w();

// --------------------------------------------------------------- SECTION 10
w('# SECTION 10: Acid gas is removed by moles (owned by Professional m03)');
w();
w('Sweetening is a mole balance from end to end. The gas carries a mole percent of CO2 and H2S, the spec says what may stay, and the difference is what the solution has to pick up. Nothing in that chain is a mass until the very last step.');
w(`On UBIE: ${e6(UBIE.co2MolPct)} less ${e6(UBIE.co2SpecMolPct)} mol percent of CO2 plus ${e6(UBIE.h2sMolPct)} less ${e6(UBIE.h2sSpecMolPct)} of H2S is ${num((UBIE.co2MolPct - UBIE.co2SpecMolPct) + (UBIE.h2sMolPct - UBIE.h2sSpecMolPct), 9)} mol percent removed (derived, the four figures on this line), which at ${e6(UBIE.gasMMscfd)} MMscfd is ${r4(UB.acidMolesDay)} lbmol a day.`);
w(`Each mole of amine carries the swing, which is ${e6(UB.richLoadingUsed)} rich less ${e6(UBIE.leanLoading)} lean, or ${num(UB.richLoadingUsed - UBIE.leanLoading, 9)} mol of acid gas per mol of amine (derived, the two figures on this line subtracted). The circulation follows: ${e6(UB.circGpm)} gpm.`);
w(`The regenerator then costs the stated ${e6(UBIE.dutyBtuPerGal)} Btu a gallon on every one of those gallons, which is ${e6(UB.reboilerMMBtuHr)} MMBtu an hour.`);
w();
w('The swing is the whole lever. The rich end:');
w('| rich loading | swing | circulation, gpm | regenerator, MMBtu/hr | warning |');
w('| --- | --- | --- | --- | --- |');
UBIE_RICH_SWEEP.forEach((rl) => {
  const r = G.aminePackage({ ...UBIE, richLoading: rl });
  w(`| ${e6(rl)} | ${num(rl - UBIE.leanLoading, 9)} | ${e6(r.circGpm)} | ${e6(r.reboilerMMBtuHr)} | ${r.warning ? 'yes' : 'no'} |`);
});
w('And the lean end, which costs regenerator duty to reach and buys circulation back:');
w('| lean loading | swing | circulation, gpm | regenerator, MMBtu/hr |');
w('| --- | --- | --- | --- |');
UBIE_LEAN_SWEEP.forEach((ll) => {
  const r = G.aminePackage({ ...UBIE, leanLoading: ll });
  w(`| ${e6(ll)} | ${num(UBIE.richLoading - ll, 9)} | ${e6(r.circGpm)} | ${e6(r.reboilerMMBtuHr)} |`);
});
w();
w('The corrosion warning, read from both sides of MDEA\'s own customary limit:');
w('| rich loading | warning |');
w('| --- | --- |');
[RICH_AT_MDEA_LIMIT, RICH_JUST_OVER_MDEA_LIMIT].forEach((rl) => {
  w(`| ${num(rl, 9)} | ${shape(G.aminePackage({ ...UBIE, richLoading: rl }).warning)} |`);
});
w();
w('Two refusals that look alike and are not:');
w(`- a spec already met at the inlet: ${soft(G.aminePackage({ ...UBIE, ...UBIE_SPEC_ALREADY_MET }))}`);
w(`- a spec set above the inlet: ${soft(G.aminePackage({ ...UBIE, ...UBIE_SPEC_ABOVE_INLET }))}`);
w(`- a lean loading at or above the rich: ${soft(G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading }))}`);
w();
w('The published cases, engine against golden:');
w('| case | gpm engine | gpm golden | ratio | MMBtu/hr engine | MMBtu/hr golden | ratio |');
w('| --- | --- | --- | --- | --- | --- | --- |');
[['MDEA', 0], ['DEA', 1]].forEach(([id, i]) => {
  const row = GOLD.amine[i];
  const r = G.aminePackage({ ...row, amineId: id });
  w(`| ${id} | ${e6(r.circGpm)} | ${e6(row.circGpm)} | ${num(r.circGpm / row.circGpm, 12)} | ${e6(r.reboilerMMBtuHr)} | ${e6(row.reboilerMMBtuHr)} | ${num(r.reboilerMMBtuHr / row.reboilerMMBtuHr, 12)} |`);
});
w();

// --------------------------------------------------------------- SECTION 11
w('# SECTION 11: Three amines, and what separates them (owned by Professional m04)');
w();
w('The module carries a published property set for three amines, and every column of it is a design consequence rather than a piece of chemistry trivia.');
w('| amine | molecular weight | typical strength, wt % | customary rich limit | customary duty, Btu/gal | solution gravity |');
w('| --- | --- | --- | --- | --- | --- |');
G.AMINES.forEach((a) => {
  w(`| ${a.id} | ${e6(a.mw)} | ${e6(a.wtPctTypical)} | ${e6(a.maxLoading)} | ${e6(a.heatBtuPerGal)} | ${e6(a.sgSolution)} |`);
});
w();
w('The same duty put through all three, each at its OWN typical strength, rich limit and duty, which is what the table is for:');
w('| amine | circulation, gpm | regenerator, MMBtu/hr | rich used | MMBtu/hr per gpm |');
w('| --- | --- | --- | --- | --- |');
UBIE_AMINE_IDS.forEach((id) => {
  const r = G.aminePackage({
    gasMMscfd: UBIE.gasMMscfd, co2MolPct: UBIE.co2MolPct, h2sMolPct: UBIE.h2sMolPct,
    co2SpecMolPct: UBIE.co2SpecMolPct, h2sSpecMolPct: UBIE.h2sSpecMolPct,
    amineId: id, leanLoading: UBIE.leanLoading,
  });
  w(`| ${id} | ${e6(r.circGpm)} | ${e6(r.reboilerMMBtuHr)} | ${e6(r.richLoadingUsed)} | ${num(r.reboilerMMBtuHr / r.circGpm, 9)} |`);
});
w('The last column is derived, the two engine figures on each row divided. It is NOT a new fact. Divide each amine\'s customary duty in the table above by the minutes in a day measured in Section 2, times the minutes in an hour, and the same number comes back:');
w('| amine | MMBtu/hr per gpm, from the two engine figures | the table duty times 60 over a million |');
w('| --- | --- | --- |');
UBIE_AMINE_IDS.forEach((id) => {
  const a = G.amineOf(id);
  const r = G.aminePackage({
    gasMMscfd: UBIE.gasMMscfd, co2MolPct: UBIE.co2MolPct, h2sMolPct: UBIE.h2sMolPct,
    co2SpecMolPct: UBIE.co2SpecMolPct, h2sSpecMolPct: UBIE.h2sSpecMolPct,
    amineId: id, leanLoading: UBIE.leanLoading,
  });
  w(`| ${id} | ${num(r.reboilerMMBtuHr / r.circGpm, 9)} | ${num((a.heatBtuPerGal * 60) / 1e6, 9)} |`);
});
w('So the regenerator duty ranks the three amines in exactly the order the duty column of the property set already does, and the circulation ranks them in the same order again. All three orderings are the same ordering, and the interesting number is not which amine is cheapest but HOW FAR apart they are:');
w('| pair | circulation ratio | duty ratio |');
w('| --- | --- | --- |');
const amRows = UBIE_AMINE_IDS.map((id) => ({ id, r: G.aminePackage({
  gasMMscfd: UBIE.gasMMscfd, co2MolPct: UBIE.co2MolPct, h2sMolPct: UBIE.h2sMolPct,
  co2SpecMolPct: UBIE.co2SpecMolPct, h2sSpecMolPct: UBIE.h2sSpecMolPct,
  amineId: id, leanLoading: UBIE.leanLoading,
}) }));
[[0, 2], [1, 2], [0, 1]].forEach(([i, j]) => {
  w(`| ${amRows[i].id} over ${amRows[j].id} | ${num(amRows[i].r.circGpm / amRows[j].r.circGpm, 9)} | ${num(amRows[i].r.reboilerMMBtuHr / amRows[j].r.reboilerMMBtuHr, 9)} |`);
});
w('The two ratio columns are NOT equal, and that is the whole point of the table: circulation is set by the rich limit and the strength, duty is set by the rich limit, the strength and the duty per gallon, so the same ordering is reached by two different routes and the gaps between the amines are different sizes on each.');
w();
w(`An amine the table does not carry: ${shape(G.amineOf('DIPA'))}, and the package asked for it returns ${soft(G.aminePackage({ ...UBIE, amineId: 'DIPA' }))}. This is the one catalogue lookup in the module and it says it does not know.`);
w();

// --------------------------------------------------------------- SECTION 12
w('# SECTION 12: The vessel the gas goes up (owned by Professional m05)');
w();
w('THE EQUATION IS NOT NEW. Souders-Brown, the K value and the settling velocity are owned by the Separation & Slug Catching course, which teaches the six published K rows and the mist extractor that sets them. What is new here is the DUTY: a contactor is a mass transfer column, not a knockout drum, and it is sized on the gas that has to rise through a descending liquid.');
w();
w(`On OBIAFU the gas weighs ${e6(OB_CONT.rhoG)} lb per ft3 at ${e6(OBIAFU_LINE.pPsia)} psia and ${e6(OBIAFU_LINE.tF)} degF with a compressibility of ${num(OB_CONT.z, 9)}, the allowed velocity at a K of ${e6(OBIAFU_CONTACTOR.ksFtS)} ft per s is ${e6(OB_CONT.vAllowFtS)} ft per s, and the diameter is ${e6(OB_CONT.diameterFt)} ft.`);
w(`On UBIE the gas weighs ${e6(UB_CONT.rhoG)} lb per ft3 at ${e6(UBIE_CONTACTOR.pPsia)} psia and ${e6(UBIE_CONTACTOR.tF)} degF with a compressibility of ${num(UB_CONT.z, 9)}, the allowed velocity at a K of ${e6(UBIE_CONTACTOR.ksFtS)} ft per s is ${e6(UB_CONT.vAllowFtS)} ft per s, and the diameter is ${e6(UB_CONT.diameterFt)} ft.`);
w();
w('The compressibility is NOT an input here. The engine computes it from the same DAK correlation the rest of the platform uses, off Sutton pseudo-criticals built from the gas gravity alone:');
w('| psia | degF | gravity | z the engine computes | gas density, lb/ft3 | allowed velocity, ft/s | diameter, ft |');
w('| --- | --- | --- | --- | --- | --- | --- |');
[[600, 100, 0.65], [950, 104, 0.66], [1400, 110, 0.7], [1400, 60, 0.7], [2000, 110, 0.75]].forEach(([p, t, sg]) => {
  const r = G.contactorDiameter({ gasMMscfd: OBIAFU.gasMMscfd, pPsia: p, tF: t, gasSg: sg, ksFtS: OBIAFU_CONTACTOR.ksFtS });
  w(`| ${e6(p)} | ${e6(t)} | ${e6(sg)} | ${num(r.z, 9)} | ${e6(r.rhoG)} | ${e6(r.vAllowFtS)} | ${e6(r.diameterFt)} |`);
});
w();
w('The K value, which is the one design choice in the whole sizing:');
w('| K, ft/s | allowed velocity, ft/s | diameter, ft |');
w('| --- | --- | --- |');
[0.15, 0.2, 0.25, 0.3, 0.35, 0.4].forEach((k) => {
  const r = G.contactorDiameter({ gasMMscfd: OBIAFU.gasMMscfd, pPsia: OBIAFU_LINE.pPsia, tF: OBIAFU_LINE.tF, gasSg: OBIAFU_CONTACTOR.gasSg, ksFtS: k });
  w(`| ${e6(k)} | ${e6(r.vAllowFtS)} | ${e6(r.diameterFt)} |`);
});
w();
w('The published cases pass their compressibility IN rather than letting the engine compute one, so the golden checks the sizing and never the correlation:');
w('| rate | psia | degF | z given | diameter engine | diameter golden | ratio |');
w('| --- | --- | --- | --- | --- | --- | --- |');
GOLD.contactor.forEach((row) => {
  const r = G.contactorDiameter(row);
  w(`| ${e6(row.gasMMscfd)} | ${e6(row.pPsia)} | ${e6(row.tF)} | ${e6(row.z)} | ${e6(r.diameterFt)} | ${e6(row.diameterFt)} | ${num(r.diameterFt / row.diameterFt, 12)} |`);
});
w(`The same first case with the z LEFT OUT, so the engine computes one: it returns ${num(G.contactorDiameter({ ...GOLD.contactor[0], z: undefined }).z, 9)} against the ${e6(GOLD.contactor[0].z)} the case hands it, and the diameter moves from ${e6(GOLD.contactor[0].diameterFt)} ft to ${e6(G.contactorDiameter({ ...GOLD.contactor[0], z: undefined }).diameterFt)} ft, a factor of ${num(G.contactorDiameter({ ...GOLD.contactor[0], z: undefined }).diameterFt / GOLD.contactor[0].diameterFt, 9)} (derived, the two diameters on this line divided).`);
w();
w(`The liquid the gas is rising against is a TYPED CONSTANT of ${e6(RHO_L)} lb per ft3, measured in Section 2. It is the same number whether the column holds glycol or amine, and neither the glycol density the dehydration balance takes as an input nor the solution gravity the amine table carries reaches it. Section 16 takes that up.`);
w();

// --------------------------------------------------------------- SECTION 13
w('# SECTION 13: The still overhead nobody sells (owned by Expert m04)');
w();
w('Aromatics dissolve in glycol in the contactor, ride round the loop and leave through the still overhead. The absorbed fraction is an OPERATING VALUE the engine takes as an input; the arithmetic from it is a mole balance and nothing else.');
w(`On OBIAFU at ${e6(OBIAFU.btexInletPpmv)} ppmv and an absorbed fraction of ${e6(OBIAFU.btexAbsorbedFrac)}, the engine returns ${r4(OB.btexLbDay)} lb a day and ${e6(OB.btexTonsYear)} short tons a year.`);
w();
w('| ppmv in | absorbed fraction | lb/day | short tons/yr |');
w('| --- | --- | --- | --- |');
[[60, 0.1], [180, 0.1], [180, 0.15], [180, 0.2], [400, 0.15], [900, 0.15]].forEach(([ppm, f]) => {
  const r = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, btexInletPpmv: ppm, btexAbsorbedFrac: f });
  w(`| ${e6(ppm)} | ${e6(f)} | ${r4(r.btexLbDay)} | ${e6(r.btexTonsYear)} |`);
});
(() => {
  const at = (ppm, f) => G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, btexInletPpmv: ppm, btexAbsorbedFrac: f }).btexLbDay;
  w(`Both columns are linear in both inputs, and the table says so itself: tripling the ppmv from 60 to 180 at a fixed fraction multiplies the pounds a day by ${num(at(180, 0.1) / at(60, 0.1), 12)}, and doubling the fraction from 0.1 to 0.2 at a fixed ppmv multiplies it by ${num(at(180, 0.2) / at(180, 0.1), 12)} (both derived, rows of the table above divided). A mole balance with one operating multiplier and no chemistry is exactly what those two figures describe.`);
})();
w(`The molecular weight the balance uses is an input with a default of ${e6(92)}, which is toluene. A real BTEX cut is four compounds, and the engine carries one number for all of them.`);
w();

// --------------------------------------------------------------- SECTION 14
w('# SECTION 14: WITHHELD. The Joule-Thomson chain (would be owned by Expert m01, m02 and m03)');
w();
w('NOTHING IS PRINTED IN THIS SECTION AND NOTHING IN THIS DIGEST STANDS IN FOR IT.');
w();
w('The module computes a Joule-Thomson coefficient from the temperature derivative of the same DAK compressibility correlation the contactor uses, marches it down a pressure drop in equal steps, and reports the temperature the gas arrives at and the water it can still hold there. Those are the numbers Expert m01, m02 and m03 are built on.');
w();
w('The FC4-0 recon found that chain to be wrong by a factor that varies with the compressibility, and the repair is in flight. Numbers printed here today would be numbers a writer would learn, so this section prints none. When FC4-0 is vendored this section is rebuilt and it will carry: the coefficient across pressure, gravity and heat capacity; the derivative that produces it; the march and how many steps it takes to converge; the temperature at the cold separator; the water the cold gas can still hold; and the seam to the Production module Flow Assurance engine, which asks a caller to TYPE a Joule-Thomson coefficient and is the only other place in the package the quantity appears.');
w();
w('A digest that prints a wrong number behind a warning has still taught it. This is the cheaper half of the repair-before-writing rule: fourteen Expert lessons and four of six Expert capstone fields wait, and none of them is written twice.');
w();

// --------------------------------------------------------------- SECTION 15
w('# SECTION 15: What a refusal is, and what sits outside the contract (owned by Expert m05)');
w();
w('The contract: a state the method has no answer for comes back as an object carrying an `error` string. Nothing in this module throws. Every refusal it makes:');
[
  ['a temperature outside the water fit', () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_ABOVE_HIGH_EDGE_F })],
  ['a total pressure at or below the water vapour pressure', () => G.saturatedWaterContent({ pPsia: 0.2, tF: 104 })],
  ['a dehydration duty with no gas rate', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, gasMMscfd: 0 })],
  ['an outlet spec at or above the inlet', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 10, outletLbMMscf: 10 })],
  ['a lean glycol strength outside 90 to 100 weight percent', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 89 })],
  ['a lean glycol strength of exactly 100 weight percent', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 100 })],
  ['an amine the table does not carry', () => G.aminePackage({ ...UBIE, amineId: 'DIPA' })],
  ['a sweetening duty with no gas rate', () => G.aminePackage({ ...UBIE, gasMMscfd: 0 })],
  ['a lean loading at or above the rich', () => G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading })],
  ['a spec that leaves nothing to remove', () => G.aminePackage({ ...UBIE, ...UBIE_SPEC_ALREADY_MET })],
  ['a spec above the inlet', () => G.aminePackage({ ...UBIE, ...UBIE_SPEC_ABOVE_INLET })],
  ['a contactor with no gas rate', () => G.contactorDiameter({ gasMMscfd: 0, pPsia: 900, tF: 100, gasSg: 0.65 })],
  ['a contactor at no pressure', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 0, tF: 100, gasSg: 0.65 })],
  ['a contactor for a gas of no gravity', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 900, tF: 100, gasSg: 0 })],
  ['a contactor at a K value of zero', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 900, tF: 100, gasSg: 0.65, ksFtS: 0 })],
  ['a Kremser stage count for an impossible removal', () => G.kremserStagesFor({ absorptionFactor: A_WELL_UNDER_UNITY, fractionRemoved: UNREACHABLE_SPEC })],
  ['a Kremser stage count for a removal of one', () => G.kremserStagesFor({ absorptionFactor: 2, fractionRemoved: 1 })],
  ['a Joule-Thomson screen at no pressure', () => G.jouleThomsonFPerPsi({ pPsia: 0, tF: 100, gasSg: 0.65 })],
  ['a Joule-Thomson screen at no heat capacity', () => G.jouleThomsonFPerPsi({ pPsia: 900, tF: 100, gasSg: 0.65, cpBtuLbmolF: 0 })],
  ['a let-down to a pressure above the inlet', () => G.jtDrop({ p1Psia: 500, p2Psia: 600, tF: 100, gasSg: 0.65 })],
  ['a let-down to zero', () => G.jtDrop({ p1Psia: 500, p2Psia: 0, tF: 100, gasSg: 0.65 })],
].forEach(([label, fn]) => w(`- ${label}: ${soft(fn())}`));
w();
w('THE ONE EXPORT OUTSIDE THE CONTRACT. `kremserFractionRemoved` returns a BARE NUMBER rather than an object, so it has nowhere to put an error and returns a non-number instead:');
w('| absorption factor | stages | returns |');
w('| --- | --- | --- |');
[[0, 5], [-1, 5], [2, 0], [2, -3]].forEach(([a, n]) => {
  w(`| ${e6(a)} | ${e6(n)} | ${raw(G.kremserFractionRemoved({ absorptionFactor: a, stages: n }))} |`);
});
w('A caller that checks a property finds none, because there is no object to check. This is the shape a downstream guard cannot see, and it is the reason the contract is worth stating as a contract.');
w();
w('Every guard has a boundary, and the boundary is where the teaching is. Each one read from both sides:');
w('| guard | value | the engine |');
w('| --- | --- | --- |');
[
  ['the lean glycol strength, lower edge', 90, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 90 })],
  ['the lean glycol strength, just inside', 90.000001, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 90.000001 })],
  ['the lean glycol strength, just under the top', 99.999999, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 99.999999 })],
  ['the lean glycol strength, upper edge', 100, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, leanTegWtPct: 100 })],
  ['the outlet spec equal to the inlet', 60, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, outletLbMMscf: 60 })],
  ['the outlet spec a hair under the inlet', 59.999999, () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, outletLbMMscf: 59.999999 })],
  ['the water fit, lower edge', FIT_LOW_EDGE_F, () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_LOW_EDGE_F })],
  ['the water fit, below the lower edge', FIT_BELOW_LOW_EDGE_F, () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_BELOW_LOW_EDGE_F })],
  ['the water fit, upper edge', FIT_HIGH_EDGE_F, () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_HIGH_EDGE_F })],
  ['the water fit, above the upper edge', FIT_ABOVE_HIGH_EDGE_F, () => G.saturatedWaterContent({ pPsia: 500, tF: FIT_ABOVE_HIGH_EDGE_F })],
  ['the amine swing at exactly zero', UBIE.richLoading, () => G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading })],
  ['the amine swing a hair above zero', UBIE.richLoading - 1e-9, () => G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading - 1e-9 })],
  ['the let-down with the two pressures equal', 500, () => G.jtDrop({ p1Psia: 500, p2Psia: 500, tF: 100, gasSg: 0.65 })],
  ['the let-down a hair apart', 499.999999, () => G.jtDrop({ p1Psia: 500, p2Psia: 499.999999, tF: 100, gasSg: 0.65 })],
].forEach(([guard, value, fn]) => w(`| ${guard} | ${num(value, 9)} | ${fn().error ? 'refuses' : 'answers'} |`));
w('A guard that refuses its own limit is as wrong as one that accepts nonsense, which is why both sides are read rather than one.');
w();

// --------------------------------------------------------------- SECTION 16
w('# SECTION 16: What the method does not know (owned by Expert m05 l05)');
w();
w('Six things this course teaches as limits and never as answers:');
w(`1. The real-gas departure of the saturated water content. HELD FOR LITERATURE. The engine says it reaches tens of percent by high pressure and warns above ${e6(WARN_AT_THRESHOLD)} psia, and nothing in this package stands behind a figure for it. Every graded water content in this course sits below that threshold for exactly this reason.`);
w(`2. The water overhead the reboiler pays for, ${e6(OVERHEAD_BTU_LB)} Btu a lb, measured in Section 2. HELD FOR LITERATURE. It is a typed constant, its own comment describes it as a latent heat of about 970 folded with a sensible heat, and neither half is sourced or separable from outside.`);
w(`3. The liquid density the contactor sizes against, ${e6(RHO_L)} lb per ft3, measured in Section 2. HELD FOR LITERATURE, and it is a GLYCOL density used for every column. The module's own amine table carries a solution gravity for each amine and the sizing never reads it, so an amine contactor is sized against a liquid that is not in it.`);
w(`4. The three amines' property set. HELD FOR LITERATURE. The molecular weights are chemistry; the typical strengths, the rich limits, the duties and the solution gravities are customary practice with no source in this package.`);
w('5. The BTEX absorbed fraction and its single molecular weight. HELD FOR LITERATURE. The engine is explicit that the fraction is a chart or operating value, and the molecular weight is one compound standing for four.');
w('6. The published cases in this golden are SYNTHETIC. They come from an oracle written in Python against the same physics. One route in it is genuinely independent: the water content is checked against a DIFFERENT published vapour-pressure equation, and the Kremser relation is checked against a brute-force stage cascade solved as a linear system. THE OTHER THREE ROUTES ARE NOT INDEPENDENT, and Section 17 is the whole of that story.');
w();
w('And two things that are not held but simply absent. THERE IS NO HYDRATE BOUNDARY IN THIS ENGINE, and there is no stage efficiency. A hydrate margin is the Production module Flow Assurance engine, which owns subcooling, the depression correlations and the inhibitor dose, and which refuses to compute a hydrate boundary of its own. Dehydration is the OTHER answer to the same question, and the seam between the two is a course boundary rather than a gap.');
w();

// --------------------------------------------------------------- SECTION 17
w('# SECTION 17: What the published cases can and cannot catch (owned by Expert m05 l02 and l03)');
w();
w('A gate that restates the engine\'s own formula validates nothing. Three of the five routes in this module\'s oracle do exactly that, and the digest can show it without leaving the engine.');
w();
w('The two routes that ARE independent, and the evidence:');
w(`- WATER CONTENT. The oracle uses a different published vapour-pressure equation. That is why the ratios in Section 3 sit near one rather than at one: the largest gap across the four published cases is ${num(Math.max(...GOLD.water.map((row) => Math.abs(G.saturatedWaterContent(row).lbPerMMscf / row.lbPerMMscf - 1))), 9)} (derived, the largest absolute departure from one in the Section 3 table). A gate whose two sides agree to twelve decimals has not been shown to have two sides.`);
w(`- KREMSER. The oracle solves the stage cascade as a linear system. The closed form and the cascade agree to ${num(Math.max(...GOLD.kremser.map((row) => Math.abs(G.kremserFractionRemoved(row) / row.fractionRemoved - 1))), 12)} at worst across the five published cases (derived, the largest absolute departure from one in the Section 9 table), which is agreement between two genuinely different pieces of arithmetic rather than one piece run twice.`);
w();
w('The three routes that are NOT independent. In each case the oracle carries the SAME constant and the SAME expression shape as the engine, so regenerating the golden after a change to either makes the pair agree again at any value:');
w(`- the dehydration balance carries the ${e6(OVERHEAD_BTU_LB)} Btu a lb overhead in both files;`);
w(`- the sweetening balance carries the same pounds per gallon of water, measured in Section 2 as ${e6(AMINE_LB_PER_GAL)}, in both files;`);
w(`- the contactor carries the same ${e6(RHO_L)} lb per ft3 liquid, the same base group and the same gas constant in both files.`);
w('Those three are why every ratio in Sections 8, 10 and 12 is one to twelve decimals while the two independent ratios are not. IDENTICAL TO TWELVE DECIMALS IS NOT A STRONGER RESULT THAN AGREEING TO SIX. It is a weaker one, because it is what two copies of one calculation produce.');
w();
w(`And one whole routine with NO published case at all: the Joule-Thomson chain has no row in this golden, no oracle route and no check beyond a range. That is where the FC4-0 recon found its defect, and Section 14 is why this digest prints none of it.`);
w();

// --------------------------------------------------------------- SECTION 18
w('# SECTION 18: The Associate reading, one stream from the line to the still (owned by Associate m06)');
w();
w(`OBIAFU arrives at ${e6(OBIAFU_LINE.pPsia)} psia and ${e6(OBIAFU_LINE.tF)} degF carrying ${e6(OB_SAT.lbPerMMscf)} lb of water per MMscf, which is a mole fraction of ${num(OB_SAT.yWater, 9)} and nothing to do with the rate. A spec of ${e6(OBIAFU.outletLbMMscf)} lb per MMscf takes ${e6(OB_SAT.lbPerMMscf - OBIAFU.outletLbMMscf)} of that out (derived, the two figures on this line subtracted), and only now does the rate matter: at ${e6(OBIAFU.gasMMscfd)} MMscfd it is ${r4(OB.waterLbDay)} lb a day.`);
w(`The choice of ${e6(OBIAFU.circulationGalPerLb)} gallons of glycol per pound turns that into ${r4(OB.circGpd)} gallons a day, or ${e6(OB.circGpm)} gpm. Each of those gallons needs ${r4(OB.sensiblePerGal)} Btu to reach the still and ${r4(OB.vaporPerGal)} Btu to give its water up, ${r4(OB.dutyBtuPerGal)} Btu in all, and the reboiler that does it is ${e6(OB.reboilerMMBtuHr)} MMBtu an hour.`);
w(`The vessel that gas rises through is ${e6(OB_CONT.diameterFt)} ft across, and the glycol loop carries ${e6(OB.btexTonsYear)} short tons of aromatics a year out of the still overhead on the way.`);
w('Six answers about one stream. Two of them, the water content and the duty per gallon, do not know the rate exists. Three of them are nothing but the rate applied to the first two. And the last one is about a vessel, which is the only part of the chain that cares what pressure the gas is at rather than only how wet it is.');
w();

// --------------------------------------------------------------- SECTION 19
w('# SECTION 19: The Professional reading, one sour stream through two columns (owned by Professional m06)');
w();
w(`UBIE arrives at ${e6(UBIE.co2MolPct)} mol percent CO2 and ${e6(UBIE.h2sMolPct)} mol percent H2S and has to leave at ${e6(UBIE.co2SpecMolPct)} and ${e6(UBIE.h2sSpecMolPct)}. As a mole balance that is ${r4(UB.acidMolesDay)} lbmol a day into the solution, which at a swing of ${num(UB.richLoadingUsed - UBIE.leanLoading, 9)} mol per mol on ${e6(UBIE.amineWtPct)} weight percent MDEA is ${e6(UB.circGpm)} gpm and ${e6(UB.reboilerMMBtuHr)} MMBtu an hour.`);
w(`As a staged device the same column is read differently. At an absorption factor of ${e6(OBIAFU_ABSORPTION_FACTOR)} the Kremser relation says ${e6(OBIAFU_STAGES)} theoretical stages remove ${num(G.kremserFractionRemoved({ absorptionFactor: OBIAFU_ABSORPTION_FACTOR, stages: OBIAFU_STAGES }), 9)} of what is there, and a removal of ${e6(0.99)} would demand ${num(G.kremserStagesFor({ absorptionFactor: OBIAFU_ABSORPTION_FACTOR, fractionRemoved: 0.99 }).stages, 9)}.`);
w(`As a vessel it is ${e6(UB_CONT.diameterFt)} ft across, because the gas weighs ${e6(UB_CONT.rhoG)} lb per ft3 at ${e6(UBIE_CONTACTOR.pPsia)} psia and may not rise faster than ${e6(UB_CONT.vAllowFtS)} ft per s.`);
w('Three answers about one column, and not one of them can be derived from the other two. The mole balance says how much solution has to move and says nothing about whether the column can reach the spec. The stage relation says whether the spec is reachable and says nothing about how many gallons a minute it takes. The vessel says how wide the steel has to be and knows neither.');
w();

console.log(out.join('\n'));
