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
// Engine, vendored sha-identical with engines 82ec6d4 (the FC4-0 repair):
// engines/facilities/gasProcessing.js, over
// engines/production/gasProperties.js for the Sutton pseudo-criticals, the
// DAK z-factor and the Rankine door, and over
// engines/facilities/separatorSizing.js for the DAK validity band.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from a published case) or "derived" (arithmetic
// on engine values printed on the same row or in the same block, with the
// arithmetic stated). Where the engine keeps a constant to itself, the
// constant is MEASURED by asking the engine a question about itself rather
// than typed. Nothing here reads a clock, a random number or a network.
//
// SECTION 14 IS BUILT. It was withheld while the Joule-Thomson chain was
// under repair, and prints the repaired engine's answers now that FC4-0 is
// vendored. NOTHING IN THIS FILE DESCRIBES WHAT THE ENGINE USED TO DO:
// repair history is provenance and lives in RECON.md and FINDINGS.md,
// which open with a banner saying so. The digest has no such licence.

import fs from 'fs';
import {
  OBIAFU_LINE, OBIAFU, OBIAFU_CONTACTOR,
  OBIAFU_RATIO_SWEEP, RATIO_AT_LOWER_CUSTOM, RATIO_JUST_UNDER_LOWER,
  RATIO_AT_UPPER_CUSTOM, RATIO_JUST_OVER_UPPER,
  OBIAFU_SPEC_SWEEP, OBIAFU_RATE_SWEEP,
  SATURATION_P, SATURATION_T, WARN_AT_THRESHOLD, WARN_JUST_OVER,
  FIT_LOW_EDGE_F, FIT_BELOW_LOW_EDGE_F, FIT_HIGH_EDGE_F, FIT_ABOVE_HIGH_EDGE_F,
  FIT_PUBLISHED_LOW_EDGE_F, FIT_PUBLISHED_HIGH_EDGE_F, FIT_PUBLISHED_JUST_OVER_F,
  GAS_ABOVE_FIT_F, WATER_FREEZING_F,
  OBIAFU_LEAN_SWEEP, LEAN_AT_LOWER_EDGE, LEAN_JUST_INSIDE_LOWER,
  LEAN_JUST_UNDER_UPPER, LEAN_AT_UPPER_EDGE, RATIO_THAT_FLOODS_THE_LOOP,
  AGBADA, AGBADA_P_SWEEP, AGBADA_CP_SWEEP, AGBADA_STEP_SWEEP,
  AGBADA_STEP_REFERENCE, AGBADA_STEPS_REFUSED, AGBADA_DEEP_P2_PSIA,
  AGBADA_COLD_INLET_F, AGBADA_COLD_P2_PSIA,
  SG_SUTTON_BREAKS, SG_SUTTON_LAST_PHYSICAL,
  UBIE, UBIE_CONTACTOR, UBIE_AMINE_IDS, UBIE_RICH_SWEEP,
  RICH_AT_MDEA_LIMIT, RICH_JUST_OVER_MDEA_LIMIT, UBIE_LEAN_SWEEP,
  UBIE_SPEC_ALREADY_MET, UBIE_SPEC_ABOVE_INLET,
  KREMSER_FACTORS, KREMSER_STAGES, OBIAFU_ABSORPTION_FACTOR, OBIAFU_STAGES,
  A_AT_UNITY, A_JUST_UNDER_UNITY, A_JUST_OVER_UNITY, A_WELL_UNDER_UNITY,
  UNREACHABLE_SPEC,
  LBMOL_PROBE, OVERHEAD_PROBE, MINUTES_PROBE, TONS_PROBE, RHO_L_PROBE,
  AMINE_DENSITY_PROBE, REBOILER_GROUP_PROBE,
  contractCensus,
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
/**
 * A ROW LABELLED A REFUSAL MUST ACTUALLY REFUSE. This exists because one did
 * not: the evidence block called the AGBADA deep let-down, which ANSWERS, and
 * printed its seven SUCCESS fields under a refusal heading. Every number on
 * that line was real engine output, so no numeric sweep could see it, and the
 * digest taught an evidence shape the engine never returns. The generator now
 * refuses to build rather than print such a line, which turns the class into
 * a build failure instead of a sentence somebody has to notice. It guards
 * EVERY refusal-labelled block in this file, not only the one that was wrong.
 */
const mustRefuse = (label, r) => {
  if (!r || typeof r.error !== 'string') {
    throw new Error(`GENERATOR REFUSES: the row "${label}" is labelled a refusal and the engine ANSWERED it. A refusal row computed from a successful call prints real numbers under a false heading, which no numeric sweep can see. Keys returned: ${r && typeof r === 'object' ? Object.keys(r).join(', ') : String(r)}`);
  }
  return r;
};
/** FC4-0 put `kremserFractionRemoved` inside the module's error contract:
 *  it returns { fractionRemoved } or { error } where it used to return a
 *  bare number. Every read of it here goes through this, so the digest can
 *  print a fraction and a refusal from the same call. */
const kFrac = (args) => G.kremserFractionRemoved(args);
const kNum = (args) => G.kremserFractionRemoved(args).fractionRemoved;

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

/* THE CONTRACT CENSUS, run once. Every export of the module enumerated,
 * every callable one asked a question it can answer and a question it
 * cannot, and the shape of both answers READ OFF the return value. The
 * digest's contract block is printed from this and states nothing the
 * census did not measure. See fc4_fields.mjs for why. */
const CENSUS = contractCensus(G);

// ------------------------------------------------------------------ header
w('# FC4 Gas Processing. Teaching digest.');
w('# Water contents, pressures, temperatures, circulations, diameters and ratios print to six decimals; pounds a day, gallons a day, Btu a gallon and lbmol a day to four; counts are whole numbers.');
w('# Field units: MMscfd of gas, psia, degF, lb of water per MMscf of gas, gal of solvent per lb of water, gpm, mol percent, Btu and MMBtu an hour.');
w('# Nothing here is read from a clock or a random number, so every line reproduces.');
w('# Built against engines 82ec6d4, vendored sha-identical. Every figure below is that engine\'s own answer at the inputs named beside it.');
w();

// ---------------------------------------------------------------- SECTION 1
w('# SECTION 1: What this engine conditions, and what it refuses (owned by Associate m01)');
w();
w('# App surface: the Gas Processing Studio runs three units over one gas stream. Dehydration takes water out with glycol, sweetening takes acid gas out with amine, and the dew point unit cools the gas by letting it down.');
w('- This engine conditions a GAS STREAM. It answers how much water a gas carries, how much solvent it takes to remove it, what the regenerator costs to run, how wide the vessel has to be, and how far a let-down cools the gas.');
w('- The doctrine is stated in the module\'s own header: everything that is a DESIGN CHOICE or a chart value is an INPUT with its customary range named, and everything computable from first principles is computed. The circulation ratio, the BTEX absorbed fraction, the glycol properties, the water overhead and the contactor liquid are all inputs with defaults, and a reader can see each one on the page rather than having to find it in the source.');
w(`- A state the method has no answer for comes back as an object with an \`error\` string, and this module throws nothing at all. The contract belongs to the ${CENSUS.doors.length} exports that are called with a NAMED-ARGUMENT OBJECT, which is every door the studio calls: each of them answers with an object, and each refusal puts a named string on an \`error\` key. The other ${CENSUS.helpers.length} callable exports take a single positional value and are scalar helpers. They answer with a bare number or with one row of a table, and they say they have no answer with a bare NaN or a null, which the door that consumes them turns into a named refusal. Section 15 reads every export of the module from both sides and names the ${CENSUS.helpers.length}.`);
w('- What is NOT in this engine: no hydrate boundary, no compositional flash, no rate-based absorber model, no stage efficiency, no molecular sieve, no refrigeration and no NGL recovery. A hydrate margin is the Production module Flow Assurance engine, and the phase envelope of a reservoir fluid is the Fluid engine.');
w();
w('The three units, on the two teaching streams, end to end:');
w(`- OBIAFU carries ${e6(OB_SAT.lbPerMMscf)} lb of water per MMscf at ${e6(OBIAFU_LINE.pPsia)} psia and ${e6(OBIAFU_LINE.tF)} degF, and at ${e6(OBIAFU.gasMMscfd)} MMscfd a spec of ${e6(OBIAFU.outletLbMMscf)} lb per MMscf means taking out ${r4(OB.waterLbDay)} lb a day, which at ${e6(OBIAFU.circulationGalPerLb)} gal per lb is ${e6(OB.circGpm)} gpm of glycol and ${e6(OB.reboilerMMBtuHr)} MMBtu an hour of reboiler.`);
w(`- UBIE arrives at ${e6(UBIE.co2MolPct)} mol percent CO2 and ${e6(UBIE.h2sMolPct)} mol percent H2S, and meeting ${e6(UBIE.co2SpecMolPct)} and ${e6(UBIE.h2sSpecMolPct)} means picking up ${r4(UB.acidMolesDay)} lbmol of acid gas a day. Loaded from a LEAN LOADING of ${e6(UBIE.leanLoading)} to a RICH LOADING of ${e6(UB.richLoadingUsed)} mol of acid gas per mol of amine, which is a LOADING SWING of ${num(UB.richLoadingUsed - UBIE.leanLoading, 9)} (derived, the two loadings on this line subtracted), that is ${e6(UB.circGpm)} gpm of solution and ${e6(UB.reboilerMMBtuHr)} MMBtu an hour of regenerator.`);
w(`- The two contactors those streams go up are ${e6(OB_CONT.diameterFt)} ft and ${e6(UB_CONT.diameterFt)} ft across.`);
w();

// ---------------------------------------------------------------- SECTION 2
w('# SECTION 2: The numbers this module stands on (owned by Associate m01 l04 and Expert m05)');
w();
w('Every constant this module uses is EXPORTED, so a reader can name it rather than infer it. They fall into three kinds, and the difference between the kinds is the most useful thing in this section.');
w();
w('KIND ONE: DERIVED, which means the module computes it from something else it exports and there is nothing to check.');
w(`- the standard pressure and temperature of this module, once: ${num(G.STD_PRESSURE_PSIA, 6)} psia and ${num(G.STD_TEMPERATURE_R, 6)} degR.`);
w(`- the standard cubic feet in a pound mole: ${num(G.LBMOL_SCF, 12)}. It is the gas constant times the standard temperature over the standard pressure, and the digest can check that by multiplying the three figures this page already carries: ${num((P.R_UNIVERSAL * G.STD_TEMPERATURE_R) / G.STD_PRESSURE_PSIA, 12)} (derived).`);
w(`- the US gallons in a cubic foot: ${num(G.GAL_PER_FT3, 12)}, exact as 1728 cubic inches to the cubic foot over 231 to the gallon.`);
w(`- the glycol density in lb per ft3: ${num(G.TEG_LB_PER_FT3, 12)}, which is the lb per gallon below times the gallons per cubic foot above.`);
w();
w('KIND TWO: MEASURED OUT OF THE ENGINE. These are exported too, and the digest asks the engine a question whose answer is the constant and nothing else, then prints the ratio of the measurement to the export. A ratio of one says the exported name and the number in use are the same number.');
w('| constant | exported | measured out of a return value | measured over exported |');
w('| --- | --- | --- | --- |');
const lbmolProbe = G.tegPackage(LBMOL_PROBE);
const overheadProbe = G.tegPackage(OVERHEAD_PROBE);
const minutesProbe = G.tegPackage(MINUTES_PROBE);
const tonsProbe = G.tegPackage(TONS_PROBE);
const rhoLProbe = G.contactorDiameter(RHO_L_PROBE);
const reboilerProbe = G.tegPackage(REBOILER_GROUP_PROBE);
const M_LBMOL = 1e6 / lbmolProbe.btexLbDay;
const M_OVERHEAD = overheadProbe.vaporPerGal;
const M_MINUTES = minutesProbe.circGpd / minutesProbe.circGpm;
const M_RHO_L = rhoLProbe.rhoG * ((rhoLProbe.vAllowFtS / RHO_L_PROBE.ksFtS) ** 2 + 1);
const M_YEAR_TON = tonsProbe.btexTonsYear / tonsProbe.btexLbDay;
const M_REB_GROUP = (reboilerProbe.circGpd * reboilerProbe.dutyBtuPerGal) / reboilerProbe.reboilerMMBtuHr;
const M_MW_WATER = OB_SAT.lbPerMMscf / (OB_SAT.yWater * (1e6 / G.LBMOL_SCF));
[
  ['standard cubic feet a pound mole', G.LBMOL_SCF, M_LBMOL, 'the BTEX mole balance at one MMscfd, a million ppmv, a unit fraction and a unit molecular weight'],
  ['the water overhead, Btu a lb', G.WATER_OVERHEAD_BTU_PER_LB, M_OVERHEAD, 'a circulation ratio of one gallon a pound with no reflux, where the vaporization term IS the overhead'],
  ['the contactor liquid, lb a ft3', G.TEG_LB_PER_FT3, M_RHO_L, 'the gas density and the allowed velocity of one call, since the velocity is K times the root of the density ratio'],
  ['the molecular weight of water', G.DECLARED_CONSTANTS.MW_WATER, M_MW_WATER, 'the saturation answer over the mole fraction the same call returns'],
].forEach(([label, exported, measured, how]) => {
  w(`| ${label} | ${num(exported, 12)} | ${num(measured, 12)} | ${num(measured / exported, 12)} |`);
});
w('Each row measured as follows, and none of the four numbers above was typed:');
[
  ['the standard cubic feet', 'the BTEX mole balance at one MMscfd, a million ppmv, a unit absorbed fraction and a unit molecular weight, where the answer is a million over this number and nothing else'],
  ['the water overhead', 'a circulation ratio of one gallon per pound with no reflux, where the vaporization term is the overhead alone'],
  ['the contactor liquid density', 'the gas density and the allowed velocity the same call returns, since the velocity is the K value times the root of the density ratio'],
  ['the molecular weight of water', 'the saturation answer divided by the mole fraction the same call returns, over the standard cubic feet already measured'],
].forEach(([what, how]) => w(`- ${what}: ${how}.`));
w();
w('Three more groups can only be measured as groups, because the engine never uses their parts separately and nothing outside can pull them apart:');
w(`- the minutes in a day: ${num(M_MINUTES, 9)}, the gallons a day over the gallons a minute of one call.`);
w(`- the days in a year over the pounds in a short ton: ${num(M_YEAR_TON, 12)}, one BTEX answer over another from the same call.`);
w(`- the hours in a day times the Btu in a MMBtu: ${num(M_REB_GROUP, 0)}, the gallons a day times the duty a gallon over the duty in MMBtu an hour.`);
w();
w('KIND THREE: DECLARED. These are customary or chart values with no publication anywhere in this repository to check them against. The module exports them in one place, under that name, and its own comment says that pinning them is all any gate can do:');
w('| declared constant | value |');
w('| --- | --- |');
[
  ['glycol, lb a gallon', G.DECLARED_CONSTANTS.TEG_LB_PER_GAL],
  ['water, lb a gallon', G.DECLARED_CONSTANTS.WATER_LB_PER_GAL],
  ['the water overhead, Btu a lb', G.DECLARED_CONSTANTS.WATER_OVERHEAD_BTU_PER_LB],
  ['the BTEX molecular weight', G.DECLARED_CONSTANTS.BTEX_MW_DEFAULT],
  ['the molecular weight of water', G.DECLARED_CONSTANTS.MW_WATER],
  ['the Magnus coefficient', G.DECLARED_CONSTANTS.MAGNUS_A],
  ['the Magnus numerator', G.DECLARED_CONSTANTS.MAGNUS_B],
  ['the Magnus denominator', G.DECLARED_CONSTANTS.MAGNUS_C],
  ['the customary circulation band, low', G.DECLARED_CONSTANTS.CUSTOMARY_CIRCULATION_LO],
  ['the customary circulation band, high', G.DECLARED_CONSTANTS.CUSTOMARY_CIRCULATION_HI],
  ['the pressure the chart warning starts at, psia', G.DECLARED_CONSTANTS.CHART_WARNING_PSIA],
].forEach(([label, v]) => w(`| ${label} | ${num(v, 6)} |`));
w('And the amine property set, five declared columns of it beside the name, on the same terms:');
w('| amine | molecular weight | solution gravity | rich limit | duty, Btu/gal | typical strength, wt % |');
w('| --- | --- | --- | --- | --- | --- |');
G.AMINES.forEach((a) => w(`| ${a.id} | ${e6(a.mw)} | ${e6(a.sgSolution)} | ${e6(a.maxLoading)} | ${e6(a.heatBtuPerGal)} | ${e6(a.wtPctTypical)} |`));
w();
w('THE DIFFERENCE BETWEEN THE KINDS IS THE LESSON. A derived constant cannot be wrong without the thing it is derived from being wrong. A measured one can be checked from outside. A declared one can only be pinned, and a gate that pins it is recording that a change would be a reviewed act rather than proving the value right. Section 17 is what follows from that.');
w();
w('Two figures from the package rather than this module, exported by the gas properties door:');
w(`- the Rankine offset: ${num(P.toRankine(0), 6)} degR, which is what the module converts every temperature with.`);
w(`- the molecular weight of dry air and the gas constant: ${num(P.AIR_MW, 6)} and ${num(P.R_UNIVERSAL, 6)}.`);
w();
w(`One derived comparison worth making on this page, because a reader meets both numbers: a glycol density of ${num(G.TEG_LB_PER_GAL, 6)} lb a gallon is ${num(G.TEG_LB_PER_FT3, 6)} lb a cubic foot, and the contactor sizes against exactly that figure. The dehydration balance and the vessel sizing use ONE density, and the ratio of the two the digest can form from the exports is ${num(G.TEG_LB_PER_FT3 / (G.TEG_LB_PER_GAL * G.GAL_PER_FT3), 12)}.`);
w();
// ---------------------------------------------------------------- SECTION 3
w('# SECTION 3: How much water a gas carries (owned by Associate m02)');
w();
w('The method is ideal vapour-liquid equilibrium over liquid water: the mole fraction of water in the gas is the vapour pressure of water over the total pressure, and the mass follows from the pound mole.');
w(`On OBIAFU at ${e6(OBIAFU_LINE.pPsia)} psia and ${e6(OBIAFU_LINE.tF)} degF the mole fraction is ${num(OB_SAT.yWater, 9)} and the content is ${e6(OB_SAT.lbPerMMscf)} lb per MMscf. The vapour pressure at that temperature alone is ${e6(G.waterSatPsia(OBIAFU_LINE.tF))} psia, and the mole fraction is that over the total pressure: ${num(G.waterSatPsia(OBIAFU_LINE.tF) / OBIAFU_LINE.pPsia, 9)} (derived, the two figures on this line divided).`);
w();
w('The surface, in lb per MMscf. Rows are degF, columns are psia:');
// The column heads print at the SAME precision as every pressure in this
// digest, which its own header line promises. They used to print bare, so
// `1500.000000` existed only in Section 14 and the tier sweep read an
// Associate lesson quoting this table's own column as reaching forward into
// an Expert section.
w(`| degF | ${SATURATION_P.map((p) => `${e6(p)} psia`).join(' | ')} |`);
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
w('# SECTION 4: The band the answer is honest in (owned by Associate m02 l05 and Expert m05)');
w();
w('THREE separate limits sit on the water answer and they are not the same limit. One refuses, one warns that the fit is being extrapolated, and one warns that the METHOD is being extrapolated.');
w();
w('1. THE FIT LIMIT, which REFUSES. The vapour-pressure fit holds over a stated band of temperature and the engine will not answer outside it. Read from both sides of both edges:');
w('| degF | degC | the engine |');
w('| --- | --- | --- |');
[FIT_BELOW_LOW_EDGE_F, FIT_LOW_EDGE_F, FIT_HIGH_EDGE_F, FIT_ABOVE_HIGH_EDGE_F].forEach((t) => {
  const r = G.saturatedWaterContent({ pPsia: 500, tF: t });
  w(`| ${num(t, 6)} | ${num((t - 32) / 1.8, 6)} | ${r.error ? `refuses: ${r.error}` : `answers ${e6(r.lbPerMMscf)} lb/MMscf`} |`);
});
w('Both edges are INCLUSIVE: the engine answers at exactly the edge and refuses a millionth of a degree outside it. A guard that refused its own stated limit would be as wrong as one that accepted anything.');
w();
w(`APP SURFACE, AND THIS IS A LIVE ONE. The gas temperature box in the Gas Processing Studio takes any number. A gas at ${e6(GAS_ABOVE_FIT_F)} degF is an ordinary thing to type, and the whole dehydration tab refuses it by name rather than answering: ${soft(G.saturatedWaterContent({ pPsia: OBIAFU_LINE.pPsia, tF: GAS_ABOVE_FIT_F }))}`);
w('The refusal carries the band in both units and the temperature it was handed, converted, so a reader is told what to change and by how much rather than only that something is wrong.');
w();
w('2. THE PUBLICATION LIMIT, which WARNS. The fit\'s coefficients were published over a narrower band than the one the module guards, and inside the gap the fit is an extrapolation of itself. The engine answers and says so:');
w('| degF | degC | note |');
w('| --- | --- | --- |');
[FIT_PUBLISHED_LOW_EDGE_F, 60, FIT_PUBLISHED_HIGH_EDGE_F, FIT_PUBLISHED_JUST_OVER_F, FIT_HIGH_EDGE_F].forEach((t) => {
  const r = G.saturatedWaterContent({ pPsia: 500, tF: t });
  w(`| ${num(t, 6)} | ${num((t - 32) / 1.8, 6)} | ${r.error ? `refuses` : shape(r.warning)} |`);
});
w();
w('3. THE METHOD LIMIT, which also WARNS, and is about the physics rather than the fit. Ideal mixing understates the water a real gas carries, and the departure grows with pressure. Read from both sides of the threshold:');
w('| psia | note |');
w('| --- | --- |');
[WARN_AT_THRESHOLD, WARN_JUST_OVER].forEach((pp) => {
  w(`| ${num(pp, 6)} | ${shape(G.saturatedWaterContent({ pPsia: pp, tF: OBIAFU_LINE.tF }).warning)} |`);
});
w('The first two limits are about the CURVE the engine draws. The third is about whether that curve is the right curve at all, and no amount of arithmetic inside this module can answer it. That is why the answer above the threshold is a screening number and a chart reading is a design number.');
w();
w('The other refusals on the water answer, and what each protects:');
[
  ['a total pressure below the water vapour pressure', () => G.saturatedWaterContent({ pPsia: 0.5, tF: 104 })],
  ['a total pressure exactly at the water vapour pressure', () => G.saturatedWaterContent({ pPsia: G.waterSatPsia(104), tF: 104 })],
  ['a total pressure of zero', () => G.saturatedWaterContent({ pPsia: 0, tF: 104 })],
  ['a temperature below absolute zero', () => G.saturatedWaterContent({ pPsia: 500, tF: -600 })],
  ['no temperature at all', () => G.saturatedWaterContent({ pPsia: 500 })],
].forEach(([label, fn]) => w(`- ${label}: ${soft(mustRefuse(label, fn()))}`));
w('The first two are one guard read from either side of its own limit. A gas at exactly its water vapour pressure is all water and nothing else, so refusing the equality is right rather than over-strict.');
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
w('# What the lean strength buys, and what it does not');
w();
w('The lean glycol strength is a second design choice and it answers a DIFFERENT question from the circulation ratio. A gallon of lean solution is not pure glycol: at w weight percent it already carries water before it meets the gas, and the contactor then adds more. The engine reports both ends of that loop balance.');
w('| lean, wt % | water already in a lean gallon, lb | rich glycol returns at, wt % | note |');
w('| --- | --- | --- | --- |');
OBIAFU_LEAN_SWEEP.forEach((lw) => {
  const r = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, leanTegWtPct: lw });
  w(`| ${e6(lw)} | ${num(r.leanWaterLbPerGal, 9)} | ${num(r.richTegWtPct, 9)} | ${r.warning ? 'yes' : 'no'} |`);
});
w(`At OBIAFU's own ${e6(OBIAFU.leanTegWtPct)} weight percent the lean gallon carries ${num(OB.leanWaterLbPerGal, 9)} lb of water and comes back at ${num(OB.richTegWtPct, 9)} weight percent.`);
w();
w('WHAT IT DOES NOT DO IS SET THE OUTLET SPEC. The engine says so itself, on every dehydration answer, in as many words:');
w(`- outletSpecBasis: "${OB.outletSpecBasis}"`);
w('The outlet water content is a TYPED design input. The dew point a given lean strength can actually deliver is read off a chart, and no chart is in this module, so the module takes the spec and reports the loop balance rather than pretending to derive one from the other. A reader who wants the other direction needs the chart, and this course says where the seam is instead of hiding it.');
w();
w('The two choices interact at the rich end. A circulation ratio low enough that each gallon has to carry a lot of water brings the rich glycol back below the strength this module will accept as a LEAN one, and the engine flags it:');
w('| gal per lb | water a gallon picks up, lb | rich returns at, wt % | note |');
w('| --- | --- | --- | --- |');
[RATIO_THAT_FLOODS_THE_LOOP, 0.5, 1, 2, 3.2, 5].forEach((c) => {
  const r = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, circulationGalPerLb: c });
  w(`| ${e6(c)} | ${num(1 / c, 9)} | ${num(r.richTegWtPct, 9)} | ${r.warning ? shape(r.warning) : 'null'} |`);
});
w();
w('The strength band, read from both sides of both edges:');
w('| lean, wt % | the engine |');
w('| --- | --- |');
[LEAN_AT_LOWER_EDGE, LEAN_JUST_INSIDE_LOWER, LEAN_JUST_UNDER_UPPER, LEAN_AT_UPPER_EDGE].forEach((lw) => {
  const r = G.tegPackage({ ...OBIAFU, inletLbMMscf: OB_SAT.lbPerMMscf, leanTegWtPct: lw });
  w(`| ${num(lw, 9)} | ${r.error ? `refuses: ${r.error}` : `answers, rich returns at ${num(r.richTegWtPct, 6)} wt %`} |`);
});
w('Both edges are EXCLUSIVE here, and for different reasons: below 90 the loop is not a dehydration loop, and 100 is a purity no regenerator reaches.');
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
w(`- OVERHEAD: boiling the absorbed water back out, plus the reflux the still condenses and boils again. Each gallon carries ${num(1 / OBIAFU.circulationGalPerLb, 9)} lb of water at this ratio (derived, one over the ratio), the overhead is ${e6(G.WATER_OVERHEAD_BTU_PER_LB)} Btu a lb measured in Section 2, and the reflux ratio of ${e6(OBIAFU.refluxRatio)} adds that fraction again. The engine returns ${r4(OB.vaporPerGal)} Btu a gallon.`);
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
w('Look at the last column rather than the others. The mass balance columns sit at one, because the oracle re-expresses them through kilograms and cubic metres and comes back to the same pounds. THE BTEX COLUMN DOES NOT, and it is the only column in the table that is a MOLE balance. Section 17 is what that gap is.');
w();

// ---------------------------------------------------------------- SECTION 9
w('# SECTION 9: A contactor is a staged device (owned by Professional m01 and m02)');
w();
w('The Kremser relation ties three things: the absorption factor, the number of theoretical stages, and the fraction of the solute the column removes. Give it any two and it gives the third.');
w();
w('THE ABSORPTION FACTOR, WRITTEN OUT. It is the liquid rate over the gas rate times the equilibrium constant:');
w('    A = L / (V K)');
w('with L the solvent molar rate down the column, V the gas molar rate up it, and K the equilibrium ratio of the solute between the two phases at the column\'s conditions. It is dimensionless, it is the ONE number that carries the equilibrium, and THIS MODULE DOES NOT COMPUTE IT: none of L, V or K is an argument of any export here, and the factor arrives as a typed input taken from equilibrium data. That is the seam, and it is why every table in this section is indexed by A rather than by a rate.');
w();
w('THE RELATION ITSELF, in the two branches the module carries:');
w('    f = (A^(N+1) - A) / (A^(N+1) - 1)      for A other than 1');
w('    f = N / (N + 1)                        for A = 1');
w('with f the fraction removed and N the number of theoretical stages. The second branch is not a special case bolted on: the first is indeterminate at A = 1, where numerator and denominator both vanish, and N over N plus one is its limit there. The table below reads across that limit from both sides to show the two agreeing.');
w();
w('AND INVERTED, which is the form a spec demands. Solving the first branch for N:');
w('    A^(N+1) = (A - f) / (1 - f)');
w('    N = log( (A - f) / (1 - f) ) / log(A) - 1');
w('    N = f / (1 - f)                        for A = 1');
w('Read the first of those three lines rather than the second and the ceiling falls straight out: the left side is positive for any real N, so the right side must be too, and with f below one that needs A above f. An absorption factor at or below the removal a spec asks for has no stage count at all, which is the refusal this section ends on.');
w(`On the OBIAFU absorber at an absorption factor of ${e6(OBIAFU_ABSORPTION_FACTOR)} over ${e6(OBIAFU_STAGES)} stages the removal is ${num(kNum({ absorptionFactor: OBIAFU_ABSORPTION_FACTOR, stages: OBIAFU_STAGES }), 9)}.`);
w();
w('The surface. Rows are stages, columns are the absorption factor:');
w(`| stages | ${KREMSER_FACTORS.map((a) => `A = ${a}`).join(' | ')} |`);
w(`| --- | ${KREMSER_FACTORS.map(() => '---').join(' | ')} |`);
KREMSER_STAGES.forEach((n) => {
  w(`| ${n} | ${KREMSER_FACTORS.map((a) => num(kNum({ absorptionFactor: a, stages: n }), 9)).join(' | ')} |`);
});
w();
w('Read the columns rather than the rows. Above an absorption factor of one every column climbs towards total removal as the stages are added. AT AND BELOW ONE IT DOES NOT, and the last column below is the gap between what 200 stages reach and the absorption factor itself:');
w('| A | removal at 12 stages | removal at 200 stages | A itself | 200 stages less A |');
w('| --- | --- | --- | --- | --- |');
[0.6, A_WELL_UNDER_UNITY, 0.95, A_JUST_UNDER_UNITY, A_AT_UNITY, A_JUST_OVER_UNITY, 1.2].forEach((a) => {
  const f200 = kNum({ absorptionFactor: a, stages: 200 });
  w(`| ${num(a, 12)} | ${num(kNum({ absorptionFactor: a, stages: 12 }), 9)} | ${num(f200, 9)} | ${num(a, 9)} | ${num(f200 - a, 12)} |`);
});
w('Below unity the removal never passes the absorption factor however many stages are bought, and the last column says how close 200 stages get. It is exactly zero for the lower factors, because the factor raised to the stage count has fallen below anything double precision can hold and the relation collapses to the factor itself. Only near one does 200 stages fall measurably short. AT AND ABOVE UNITY THAT COLUMN MEANS NOTHING, because there is no ceiling there to measure against: it is the distance from a removal that cannot exceed one to a factor that can, and it goes more negative the larger the factor, which is arithmetic about the column rather than physics about the absorber.');
w('At unity the closed form is indeterminate and the engine takes a separate branch, the stages over the stages plus one. Either side of unity by a billionth the answer is continuous with it, which is what says the branch is a limit rather than a patch.');
w();
w('Solving the other way round, for the stages a spec demands:');
w('| A | removal wanted | stages | check: removal at those stages |');
w('| --- | --- | --- | --- |');
[[1.2, 0.9], [OBIAFU_ABSORPTION_FACTOR, 0.9], [OBIAFU_ABSORPTION_FACTOR, 0.99], [2.0, 0.99], [A_AT_UNITY, 0.9]].forEach(([a, f]) => {
  const s = G.kremserStagesFor({ absorptionFactor: a, fractionRemoved: f });
  const back = s.error ? null : kNum({ absorptionFactor: a, stages: s.stages });
  w(`| ${e6(a)} | ${e6(f)} | ${s.error ? `refuses: ${s.error}` : num(s.stages, 9)} | ${back === null ? 'n/a' : num(back, 9)} |`);
});
w(`And a spec a starved absorber cannot reach at any stage count: at an absorption factor of ${e6(A_WELL_UNDER_UNITY)} a removal of ${e6(UNREACHABLE_SPEC)} comes back as ${soft(G.kremserStagesFor({ absorptionFactor: A_WELL_UNDER_UNITY, fractionRemoved: UNREACHABLE_SPEC }))}. The refusal names the remedy, which is more solvent rather than more trays.`);
w();
w('The published cases, engine against golden. The golden here is a BRUTE FORCE STAGE CASCADE solved as a linear system, which is a genuinely different road to the same number:');
w('| A | stages | engine | golden | engine over golden |');
w('| --- | --- | --- | --- | --- |');
GOLD.kremser.forEach((row) => {
  const f = kNum(row);
  w(`| ${e6(row.absorptionFactor)} | ${row.stages} | ${num(f, 12)} | ${num(row.fractionRemoved, 12)} | ${num(f / row.fractionRemoved, 12)} |`);
});
w();

// --------------------------------------------------------------- SECTION 10
w('# SECTION 10: Acid gas is removed by moles (owned by Professional m03)');
w();
w('Sweetening is a mole balance from end to end. The gas carries a mole percent of CO2 and H2S, the spec says what may stay, and the difference is what the solution has to pick up. Nothing in that chain is a mass until the very last step.');
w('THREE NAMES, AND THEY ARE THREE DIFFERENT NUMBERS. A reader who collapses them has lost the whole section, so they are separated here before any of them is used, and they are the engine\'s own words:');
w(`- the LEAN LOADING: what a mole of amine is still carrying when it comes back from the regenerator and enters the contactor. An input. On UBIE, ${e6(UBIE.leanLoading)} mol of acid gas per mol of amine.`);
w(`- the RICH LOADING: what a mole of amine is carrying when it leaves the contactor. An input. On UBIE, ${e6(UB.richLoadingUsed)}.`);
w(`- the LOADING SWING: the DIFFERENCE between them, which is what each mole of amine actually carries round the loop and is therefore what sets the circulation. NOT an input, and the engine does not return it under any name. On UBIE it is ${num(UB.richLoadingUsed - UBIE.leanLoading, 9)}, derived from the two figures above.`);
w('The rich loading is a CEILING that corrosion sets. The swing is a THROUGHPUT that the regenerator buys. Raising the rich loading raises the swing; lowering the lean loading also raises the swing, and costs regenerator duty rather than corrosion margin. That is why this section reads both ends separately.');
// WHICH INPUTS THE ENGINE ECHOES, MEASURED FROM THE ANSWER. This line used to
// say the engine echoes back "the one it used as `richLoadingUsed`", under the
// RICH LOADING bullet and nowhere else, which reads as though the rich loading
// is the echoed one. It is not: the answer carries a `...Used` key for EVERY
// typed input in this chain. Two bank questions were defective on that
// sentence, because "the lean loading, as leanLoadingUsed" and "both loadings"
// were both true as distractors. The set is now read off the answer's keys.
const AMINE_ECHOES = Object.keys(UB).filter((k) => k.endsWith('Used')).sort();
w(`The engine echoes back EVERY typed input this chain used, each under its own name ending in Used. There are ${AMINE_ECHOES.length} of them, measured by reading the keys of the answer itself: ${AMINE_ECHOES.map((k) => `\`${k}\` = ${e6(UB[k])}`).join(', ')}. So an echoed name tells a reader the value was TYPED and which value was taken, and it never means the figure was computed. THE LOADING SWING IS NOT AMONG THEM, and that absence is the point of the bullet above: the engine returns every number it was given and does not return the one it derived from two of them.`);
w(`The engine's own refusal uses all three words in one sentence when the swing vanishes: ${soft(G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading }))}`);
w();
w(`On UBIE: ${e6(UBIE.co2MolPct)} less ${e6(UBIE.co2SpecMolPct)} mol percent of CO2 plus ${e6(UBIE.h2sMolPct)} less ${e6(UBIE.h2sSpecMolPct)} of H2S is ${num((UBIE.co2MolPct - UBIE.co2SpecMolPct) + (UBIE.h2sMolPct - UBIE.h2sSpecMolPct), 9)} mol percent removed (derived, the four figures on this line), which at ${e6(UBIE.gasMMscfd)} MMscfd is ${r4(UB.acidMolesDay)} lbmol a day.`);
w(`Each mole of amine carries the LOADING SWING round the loop: a rich loading of ${e6(UB.richLoadingUsed)} less a lean loading of ${e6(UBIE.leanLoading)} is a swing of ${num(UB.richLoadingUsed - UBIE.leanLoading, 9)} mol of acid gas per mol of amine (derived, the two loadings on this line subtracted). The circulation follows from the swing and not from either loading on its own: ${e6(UB.circGpm)} gpm.`);
w(`The regenerator then costs the stated ${e6(UBIE.dutyBtuPerGal)} Btu a gallon on every one of those gallons, which is ${e6(UB.reboilerMMBtuHr)} MMBtu an hour.`);
w();
w('The swing is the whole lever. The rich end:');
w('| rich loading | swing | circulation, gpm | regenerator, MMBtu/hr | warning |');
w('| --- | --- | --- | --- | --- |');
UBIE_RICH_SWEEP.forEach((rl) => {
  const r = G.aminePackage({ ...UBIE, richLoading: rl });
  w(`| ${e6(rl)} | ${num(rl - UBIE.leanLoading, 9)} | ${e6(r.circGpm)} | ${e6(r.reboilerMMBtuHr)} | ${r.warning ? 'yes' : 'no'} |`);
});
w('And the lean end. READ THE LAST TWO COLUMNS TOGETHER BEFORE READING ANY SENTENCE ABOUT THEM, because this is where the model and the plant part company:');
w('| lean loading | swing | circulation, gpm | regenerator, MMBtu/hr | MMBtu/hr per gpm |');
w('| --- | --- | --- | --- | --- |');
UBIE_LEAN_SWEEP.forEach((ll) => {
  const r = G.aminePackage({ ...UBIE, leanLoading: ll });
  w(`| ${e6(ll)} | ${num(UBIE.richLoading - ll, 9)} | ${e6(r.circGpm)} | ${e6(r.reboilerMMBtuHr)} | ${num(r.reboilerMMBtuHr / r.circGpm, 9)} |`);
});
(() => {
  const lo = G.aminePackage({ ...UBIE, leanLoading: UBIE_LEAN_SWEEP[0] });
  const hi = G.aminePackage({ ...UBIE, leanLoading: UBIE_LEAN_SWEEP[UBIE_LEAN_SWEEP.length - 1] });
  w(`IN THIS MODEL A LEANER LEAN COSTS NOTHING. Going from a lean loading of ${e6(UBIE_LEAN_SWEEP[UBIE_LEAN_SWEEP.length - 1])} to ${e6(UBIE_LEAN_SWEEP[0])} takes the circulation from ${e6(hi.circGpm)} to ${e6(lo.circGpm)} gpm AND the regenerator from ${e6(hi.reboilerMMBtuHr)} to ${e6(lo.reboilerMMBtuHr)} MMBtu an hour. Both fall. The last column says why: the duty per gallon is a STATED input, ${e6(UBIE.dutyBtuPerGal)} Btu on every gallon circulated, so the regenerator duty is nothing but the circulation in other units and the ratio does not move down the table.`);
  w(`THAT IS THE MODEL AND NOT THE PLANT. Stripping a solution leaner is work, and on a real regenerator it is bought with reboiler duty per gallon, more stripping steam and a taller still. NONE OF THAT IS IN THIS ENGINE: the duty per gallon is a number the caller types and the engine never changes it, so nothing here can make a leaner lean cost anything. A reader who takes this table as the economics of a regenerator has been told the opposite of the truth by a model that is doing exactly what it says it does.`);
  w('WHAT THE TABLE IS HONESTLY FOR: it says how much SOLUTION a given lean loading has to move. That is a real answer and it is the one the mole balance is entitled to give. What it costs to reach that lean loading is a question for a rate-based still model, and the seam is here rather than further down.');
})();
w();
w('The corrosion warning, read from both sides of MDEA\'s own customary limit:');
w('| rich loading | warning |');
w('| --- | --- |');
[RICH_AT_MDEA_LIMIT, RICH_JUST_OVER_MDEA_LIMIT].forEach((rl) => {
  w(`| ${num(rl, 9)} | ${shape(G.aminePackage({ ...UBIE, richLoading: rl }).warning)} |`);
});
w();
w('Three refusals that look alike and are not:');
w(`- a spec already met at the inlet: ${soft(G.aminePackage({ ...UBIE, ...UBIE_SPEC_ALREADY_MET }))}`);
w(`- a spec set above the inlet: ${soft(G.aminePackage({ ...UBIE, ...UBIE_SPEC_ABOVE_INLET }))}`);
w(`- a lean loading at or above the rich: ${soft(G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading }))}`);
w();
w('The published cases, engine against golden:');
w('| case | gpm engine | gpm golden | ratio | MMBtu/hr engine | MMBtu/hr golden | ratio |');
w('| --- | --- | --- | --- | --- | --- | --- |');
['MDEA', 'DEA', 'MEA'].forEach((id, i) => {
  const row = GOLD.amine[i];
  const r = G.aminePackage({ ...row, amineId: id });
  w(`| ${id} | ${e6(r.circGpm)} | ${e6(row.circGpm)} | ${num(r.circGpm / row.circGpm, 12)} | ${e6(r.reboilerMMBtuHr)} | ${e6(row.reboilerMMBtuHr)} | ${num(r.reboilerMMBtuHr / row.reboilerMMBtuHr, 12)} |`);
});
w('Every ratio in that table is the same number, and it is not one. The whole amine balance is a MOLE balance, so every figure in it carries the standard molar volume, and the oracle builds that volume from the SI gas constant where the engine builds it from the package figure in field units. Section 17 measures the gap once and names it.');
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
w(`\`amineOf\` is one of the ${CENSUS.helpers.length} scalar helpers Section 15 names. It hands back a null where a door would hand back an object with an \`error\` key, and \`aminePackage\`, the door that consumes it, is what turns that null into the named refusal printed above. A caller of the LOOKUP therefore tests for a null; a caller of the PACKAGE reads one property, the way it does at every other door.`);
w();

// --------------------------------------------------------------- SECTION 12
w('# SECTION 12: The vessel the gas goes up (owned by Professional m05)');
w();
w('THE EQUATION IS NOT NEW. Souders-Brown, the K value and the settling velocity are owned by the Separation & Slug Catching course, which teaches the six published K rows and the mist extractor that sets them. What is new here is the DUTY: a contactor is a mass transfer column rather than a knockout drum, and it is sized on the gas that has to rise through a descending liquid.');
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
w('The published cases come in two kinds, and the difference between them is the most useful thing about this golden.');
w();
w('THE FIRST THREE PASS A COMPRESSIBILITY IN, so they check the sizing arithmetic and never the correlation. Each also names the LIQUID it is sizing against, which is a glycol column for the first two and an amine solution for the third:');
w('| rate | psia | degF | z given | liquid, lb/ft3 | diameter engine | diameter golden | ratio |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
const CONTACTOR_LIQUIDS = [G.TEG_LB_PER_FT3, G.TEG_LB_PER_FT3, G.amineSolutionLbPerFt3('MDEA')];
GOLD.contactor.slice(0, 3).forEach((row, i) => {
  const r = G.contactorDiameter({ ...row, rhoLLbFt3: CONTACTOR_LIQUIDS[i] });
  w(`| ${e6(row.gasMMscfd)} | ${e6(row.pPsia)} | ${e6(row.tF)} | ${e6(row.z)} | ${num(CONTACTOR_LIQUIDS[i], 6)} | ${e6(r.diameterFt)} | ${e6(row.diameterFt)} | ${num(r.diameterFt / row.diameterFt, 12)} |`);
});
w('The third row is an AMINE column sized against an amine solution, and the liquid density it uses is built from the solution gravity the amine table already carried. A glycol density and an amine solution density are different numbers, and a column sized against the wrong one is confidently the wrong width.');
w(`On the same duty the two liquids give: ${num(G.contactorDiameter({ ...GOLD.contactor[2], rhoLLbFt3: G.TEG_LB_PER_FT3 }).diameterFt, 9)} ft against glycol and ${num(G.contactorDiameter({ ...GOLD.contactor[2], rhoLLbFt3: G.amineSolutionLbPerFt3('MDEA') }).diameterFt, 9)} ft against MDEA solution, a factor of ${num(G.contactorDiameter({ ...GOLD.contactor[2], rhoLLbFt3: G.amineSolutionLbPerFt3('MDEA') }).diameterFt / G.contactorDiameter({ ...GOLD.contactor[2], rhoLLbFt3: G.TEG_LB_PER_FT3 }).diameterFt, 9)} (derived, the two figures on this line divided).`);
w();
w('THE LAST TWO LET THE ENGINE COMPUTE ITS OWN COMPRESSIBILITY, which is the branch the live studio always takes because it never passes one:');
w('| rate | psia | degF | z the engine computes | z golden | diameter engine | diameter golden | ratio |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
GOLD.contactor.slice(3).forEach((row) => {
  const r = G.contactorDiameter({ gasMMscfd: row.gasMMscfd, pPsia: row.pPsia, tF: row.tF, gasSg: row.gasSg, ksFtS: row.ksFtS });
  w(`| ${e6(row.gasMMscfd)} | ${e6(row.pPsia)} | ${e6(row.tF)} | ${num(r.z, 12)} | ${num(row.z, 12)} | ${e6(r.diameterFt)} | ${e6(row.diameterFt)} | ${num(r.diameterFt / row.diameterFt, 12)} |`);
});
w(`Those two also report where the compressibility came from: the engine returns zSource "${G.contactorDiameter({ gasMMscfd: 50, pPsia: 1000, tF: 100, gasSg: 0.65 }).zSource}" when it forms one and "${G.contactorDiameter({ gasMMscfd: 50, pPsia: 1000, tF: 100, gasSg: 0.65, z: 0.85 }).zSource}" when it is handed one, so a reader is never guessing which branch produced the number in front of them.`);
w();
w(`The liquid the gas rises against is an INPUT, defaulting to the module's one glycol density of ${num(G.TEG_LB_PER_FT3, 6)} lb per ft3. An amine column passes its own: the module builds one from each amine's solution gravity, and the three come out ${G.AMINES.map((a) => `${a.id} ${num(G.amineSolutionLbPerFt3(a.id), 6)}`).join(', ')} lb per ft3.`);
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
w('# SECTION 14: Cooling by expansion, and the cold separator (owned by Expert m01, m02 and m03)');
w();
w('THE COEFFICIENT ITSELF IS NOT THIS COURSE\'S TO TEACH. The Joule-Thomson coefficient and the product of it with a pressure drop belong to the Production module Flow Assurance course, which owns them over a whole module. What is this course\'s is the thing no other module in the package does: THIS IS THE ONLY ENGINE THAT COMPUTES ONE. The flowline thermal engine takes a coefficient as a TYPED INPUT from its caller and never forms one, so this section is where the number a caller types comes from.');
w();
w('The relation, which the module derives in its own header and which admits no alternative:');
w('    mu = (1/Cp) [ T (dV/dT)_P - V ],  with V = z R T / P');
w('    T (dV/dT)_P = (R/P)( T z + T^2 (dz/dT)_P ) = V + (R T^2 / P)(dz/dT)_P');
w('    mu = (R T^2 / (Cp P)) (dz/dT)_P');
w('Every term on the right is either the caller\'s or comes from the same validated compressibility correlation the contactor uses. Nothing about the gas beyond its gravity enters, which is the method\'s reach and its limit in one line.');
w();
const AG_MU = G.jouleThomsonFPerPsi({ pPsia: AGBADA.p1Psia, tF: AGBADA.tF, gasSg: AGBADA.gasSg, cpBtuLbmolF: AGBADA.cpBtuLbmolF });
const AG = G.jtDrop(AGBADA);
const AG_WIN = G.saturatedWaterContent({ pPsia: AGBADA.p1Psia, tF: AGBADA.tF });
const AG_WOUT = G.saturatedWaterContent({ pPsia: AGBADA.p2Psia, tF: AG.t2F });
w(`On AGBADA at ${e6(AGBADA.p1Psia)} psia and ${e6(AGBADA.tF)} degF, a gravity of ${e6(AGBADA.gasSg)} and a heat capacity of ${e6(AGBADA.cpBtuLbmolF)} Btu per lbmol per degF: the compressibility is ${num(AG_MU.z, 9)} at a reduced pressure of ${num(AG_MU.ppr, 6)} and a reduced temperature of ${num(AG_MU.tpr, 6)}, its temperature derivative is ${num(AG_MU.dzdT, 12)} per degR, and the coefficient is ${num(AG_MU.muFPerPsi, 9)} degF per psi.`);
w(`In the unit a field engineer quotes, that is ${num(AG_MU.muFPerPsi * 100, 6)} degF per 100 psi (derived, the figure on the line above times a hundred).`);
w();
w('The derivative is where the whole answer lives. It is the only term that carries any real-gas behaviour at all, and it is what the module differentiates rather than assumes:');
w('| psia | z | dz/dT, per degR | mu, degF/psi | mu, degF/100 psi |');
w('| --- | --- | --- | --- | --- |');
AGBADA_P_SWEEP.forEach((pp) => {
  const r = G.jouleThomsonFPerPsi({ pPsia: pp, tF: AGBADA.tF, gasSg: AGBADA.gasSg, cpBtuLbmolF: AGBADA.cpBtuLbmolF });
  w(`| ${e6(pp)} | ${r.error ? 'refuses' : num(r.z, 9)} | ${r.error ? '' : num(r.dzdT, 12)} | ${r.error ? '' : num(r.muFPerPsi, 9)} | ${r.error ? '' : num(r.muFPerPsi * 100, 6)} |`);
});
w('Read the lowest row against the highest. The coefficient does NOT vanish as the pressure falls, because the derivative divided by the pressure tends to a finite limit even as the compressibility tends to one. A gas at near-atmospheric pressure still cools when it expands, and a method that treated the departure from ideality as the whole story would say it does not.');
w();
w('The heat capacity is an input and it divides the whole answer:');
w('| Cp, Btu/lbmol.degF | mu, degF/100 psi | Cp times mu |');
w('| --- | --- | --- |');
AGBADA_CP_SWEEP.forEach((cp) => {
  const r = G.jouleThomsonFPerPsi({ pPsia: AGBADA.p1Psia, tF: AGBADA.tF, gasSg: AGBADA.gasSg, cpBtuLbmolF: cp });
  w(`| ${e6(cp)} | ${num(r.muFPerPsi * 100, 6)} | ${num(cp * r.muFPerPsi, 9)} |`);
});
w('The last column is derived, the two figures on each row multiplied. It does not move down the table, which is what says the heat capacity enters exactly once and as a divisor. Everything else about the gas is in the other factor.');
w();
w('# The march (owned by Expert m02)');
w();
w('A coefficient is a slope, so a finite pressure drop is an integration and not a multiplication. The module marches it in equal pressure steps, taking the half-step TEMPERATURE as well as the half-step PRESSURE, which is a midpoint Runge-Kutta step and second order in the step size.');
w();
w(`On AGBADA from ${e6(AGBADA.p1Psia)} psia to ${e6(AGBADA.p2Psia)} psia the gas arrives at ${num(AG.t2F, 9)} degF, having cooled ${num(AG.dropF, 9)} degF over ${AG.steps} steps.`);
w(`The march reports three coefficients, and they are three different numbers: ${num(AG.muInletFPerPsi, 9)} at the inlet, ${num(AG.muLastStepFPerPsi, 9)} at the last half step, and ${num(AG.muMeanFPerPsi, 9)} as the mean the cooling actually delivered. The mean is the cooling over the pressure drop and is the one that belongs beside an arrival temperature.`);
w(`The inlet coefficient is ${num(AG.muInletFPerPsi / AG.muMeanFPerPsi, 9)} times the mean (derived, two figures from the line above divided), so quoting the inlet beside the arrival overstates the slope the answer was built from.`);
w();
w('How many steps are enough, measured against a march of the same routine at a step count nothing downstream would ever use:');
const AG_REF = G.jtDrop({ ...AGBADA, steps: AGBADA_STEP_REFERENCE });
w(`| steps | cooling, degF | arrival, degF | cooling over the ${AGBADA_STEP_REFERENCE}-step answer |`);
w('| --- | --- | --- | --- |');
AGBADA_STEP_SWEEP.forEach((n) => {
  const r = G.jtDrop({ ...AGBADA, steps: n });
  w(`| ${n} | ${num(r.dropF, 9)} | ${num(r.t2F, 9)} | ${num(r.dropF / AG_REF.dropF, 12)} |`);
});
w(`The reference march itself reports ${num(AG_REF.dropF, 9)} degF. The last column is derived, each row's cooling over that. Twenty steps is the module's default and the table says what that default is worth on this let-down.`);
w();
w('What the march refuses, and why each refusal is a different fault:');
AGBADA_STEPS_REFUSED.forEach((n) => {
  w(`- a march of ${raw(n)} steps: ${soft(G.jtDrop({ ...AGBADA, steps: n }))}`);
});
w(`- a let-down to a pressure above the inlet: ${soft(G.jtDrop({ p1Psia: AGBADA.p2Psia, p2Psia: AGBADA.p1Psia, tF: AGBADA.tF, gasSg: AGBADA.gasSg }))}`);
w(`- a let-down with the two pressures equal: ${soft(G.jtDrop({ ...AGBADA, p2Psia: AGBADA.p1Psia }))}`);
w();
w('Letting the same gas down further does NOT go on cooling it in proportion, because the coefficient falls with the pressure the march is walking down:');
w('| outlet psia | arrival, degF | cooling, degF |');
w('| --- | --- | --- |');
[AGBADA.p2Psia, AGBADA_DEEP_P2_PSIA, 25, 8].forEach((p2) => {
  const r = G.jtDrop({ ...AGBADA, p2Psia: p2 });
  w(`| ${e6(p2)} | ${r.error ? `refuses: ${r.error}` : num(r.t2F, 9)} | ${r.error ? '' : num(r.dropF, 9)} |`);
});
w();
w('A march CAN die part way down, and what kills it is a cold INLET rather than a deep outlet: the gas cools past the reduced temperature its own compressibility correlation is valid at, and the coefficient it needs for the next step cannot be formed. The refusal names the step it died at and the state it died in, which is the difference between an answer that is missing and an answer nobody can tell is missing:');
const AG_COLD = G.jtDrop({ ...AGBADA, tF: AGBADA_COLD_INLET_F, p2Psia: AGBADA_COLD_P2_PSIA });
w(`- the same gas entering at ${e6(AGBADA_COLD_INLET_F)} degF and let down to ${e6(AGBADA_COLD_P2_PSIA)} psia: ${soft(AG_COLD)}`);
w(`- and it hands back where: step ${raw(AG_COLD.diedAtStep)} of ${raw(AG_COLD.steps)}, at ${num(AG_COLD.diedAtPsia, 6)} psia and ${num(AG_COLD.diedAtF, 6)} degF.`);
w('Three fields beside a message, and between them they say the march was two thirds of the way down and the gas was already cold when the method ran out. A bare refusal would have said none of it.');
w();
w(`The gravity has a hard edge of its own. Sutton's pseudo-critical pressure correlation turns negative above a gravity of about ${e6(SG_SUTTON_BREAKS)}, and the compressibility that depends on it is refused rather than returned:`);
w('| gravity | the engine |');
w('| --- | --- |');
[AGBADA.gasSg, SG_SUTTON_LAST_PHYSICAL, SG_SUTTON_BREAKS].forEach((sg) => {
  const r = G.jouleThomsonFPerPsi({ pPsia: AGBADA.p1Psia, tF: AGBADA.tF, gasSg: sg, cpBtuLbmolF: AGBADA.cpBtuLbmolF });
  w(`| ${e6(sg)} | ${r.error ? `refuses: ${r.error}` : `answers ${num(r.muFPerPsi, 9)} degF per psi`} |`);
});
w();
w('# The cold separator (owned by Expert m03)');
w();
w(`The point of the cooling is the water it drops out. AGBADA carries ${num(AG_WIN.lbPerMMscf, 9)} lb of water per MMscf at its inlet, and at ${num(AG.t2F, 9)} degF and ${e6(AGBADA.p2Psia)} psia the gas can hold ${num(AG_WOUT.lbPerMMscf, 9)} lb per MMscf.`);
w(`The difference is ${num(AG_WIN.lbPerMMscf - AG_WOUT.lbPerMMscf, 9)} lb per MMscf (derived, the two figures on the line above subtracted), and that is what appears as liquid in the separator boot.`);
w(`As a ratio the cold gas holds ${num(AG_WOUT.lbPerMMscf / AG_WIN.lbPerMMscf, 9)} of what the warm gas held (derived, the same two figures divided).`);
w();
w('Two things move that outlet number and they pull in opposite directions. The temperature fell, which dries the gas; the pressure also fell, which wets it. The engine can be asked each question separately:');
w('| state | psia | degF | water the gas can hold, lb/MMscf |');
w('| --- | --- | --- | --- |');
[
  ['at the inlet', AGBADA.p1Psia, AGBADA.tF],
  ['cooled, but still at inlet pressure', AGBADA.p1Psia, AG.t2F],
  ['let down, but not yet cooled', AGBADA.p2Psia, AGBADA.tF],
  ['at the cold separator', AGBADA.p2Psia, AG.t2F],
].forEach(([label, pp, tt]) => {
  const r = G.saturatedWaterContent({ pPsia: pp, tF: tt });
  w(`| ${label} | ${e6(pp)} | ${num(tt, 6)} | ${r.error ? `refuses: ${r.error}` : num(r.lbPerMMscf, 9)} |`);
});
w('The third row is the one that surprises a reader: letting the gas down WITHOUT cooling it would let it hold more water than it arrived with, because the mole fraction of water at a fixed vapour pressure rises as the total pressure falls. The expansion only dries the gas because of the cooling it causes.');
w();
w('And this is the seam. Dehydration and a cold separator are two answers to one question, and a third answer, injecting an inhibitor so the water that is there cannot form a hydrate, belongs to the Flow Assurance course along with the hydrate boundary itself. Nothing in this engine computes a hydrate boundary. What this section computes is where the cold spot is and how much free water arrives at it, which is the input that question takes.');
w();
// --------------------------------------------------------------- SECTION 15
w('# SECTION 15: What a refusal is, and what one always carries with it (owned by Expert m05 l02 and l03)');
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
  ['a march with a fractional step count', () => G.jtDrop({ ...AGBADA, steps: 0.4 })],
  ['a march with no steps at all', () => G.jtDrop({ ...AGBADA, steps: 0 })],
  ['a still colder than the absorber it dries glycol for', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, absorberTF: 380, reboilerTF: 100 })],
  ['a negative circulation ratio', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, circulationGalPerLb: -3 })],
  ['a BTEX absorbed fraction above one', () => G.tegPackage({ ...OBIAFU, inletLbMMscf: 60, btexAbsorbedFrac: 5 })],
  ['an amine solution stronger than pure amine', () => G.aminePackage({ ...UBIE, amineWtPct: 150 })],
  ['an amine solution of no strength', () => G.aminePackage({ ...UBIE, amineWtPct: 0 })],
  ['a negative regenerator duty', () => G.aminePackage({ ...UBIE, dutyBtuPerGal: -800 })],
  ['a gas temperature below absolute zero', () => G.jouleThomsonFPerPsi({ pPsia: 900, tF: -600, gasSg: 0.65 })],
  ['a gas gravity Sutton cannot carry', () => G.jouleThomsonFPerPsi({ pPsia: 900, tF: 100, gasSg: SG_SUTTON_BREAKS })],
  ['a compressibility above the correlation band', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 30000, tF: 100, gasSg: 0.65 })],
  ['a contactor liquid lighter than its gas', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 900, tF: 100, gasSg: 0.65, rhoLLbFt3: 0.5 })],
].forEach(([label, fn]) => w(`- ${label}: ${soft(mustRefuse(label, fn()))}`));
w();
w(`THE CONTRACT, EXACTLY. This module exports ${CENSUS.names.length} names. ${CENSUS.values.length} of them are values, the constants and the amine property table, and ${CENSUS.callable.length} are callable. Every callable one is asked here a question it can answer and a question it cannot, and the shape below is read off what came back rather than stated:`);
w('| export | called with | answering | with no answer | where a no-answer is named |');
w('| --- | --- | --- | --- | --- |');
CENSUS.rows.forEach((r) => {
  w(`| ${r.name} | ${r.door ? 'a named-argument object' : 'one positional value'} | ${r.answers} | ${r.refuses} | ${r.caughtBy ? `\`${r.caughtBy}\`, which returns ${r.caughtShape}` : 'the call itself'} |`);
});
w(`Read the table by its second column. THE ERROR CONTRACT IS THE DOORS: all ${CENSUS.doors.length} exports called with a named-argument object answer with an object, and every one of them that cannot answer puts a named string on an \`error\` key. That is every door the studio calls, so a caller of a door checks one property and never catches, and there is no door it has to check differently.`);
w(`The other ${CENSUS.helpers.length} are SCALAR HELPERS, called with one positional value, and they are named here so nobody has to discover them at a call site: ${CENSUS.helpers.map((r) => `\`${r.name}\``).join(', ')}. A helper answers with a bare number or with one row of the property table, and says it has no answer with a bare NaN or a null. None of those reaches a studio tab as a blank, because each one is consumed by a door, and the last column above is that door being handed the helper's no-answer and refusing BY NAME. The engine's own header says so of the first of them: the saturation fit is a correlation with nowhere to put an error key, and its one caller turns the NaN into a named refusal.`);
w('A helper read straight from a studio tab would be the real defect, because a bare NaN passes an `error` check and surfaces far downstream as an empty field, and an empty field looks exactly like a field nobody filled in. That is what the audit asks of a module: which exports are doors, which are helpers, and whether anything reads a helper where it should have read a door.');
w();
w('The contract read on ONE door, from five directions:');
w('| call | absorption factor | stages | returns |');
w('| --- | --- | --- | --- |');
[[0, 5], [-1, 5], [2, 0], [2, -3], [1.6, 6]].forEach(([a, n]) => {
  const r = kFrac({ absorptionFactor: a, stages: n });
  w(`| kremserFractionRemoved | ${e6(a)} | ${e6(n)} | ${r.error ? `{ error: "${r.error}" }` : `{ fractionRemoved: ${num(r.fractionRemoved, 9)} }`} |`);
});
w('Read the last row against the four above it. The same call shape returns a fraction or a refusal, and the caller tells them apart by asking for a property rather than by inspecting a type. That is what the contract buys: a guard downstream cannot be written wrongly, because there is only one way to write it.');
w();
w('A refusal also hands back the EVIDENCE it stands on, so a caller can say what to change rather than only that something failed:');
[
  ['the stage count a spec needs when the solvent caps it', () => G.kremserStagesFor({ absorptionFactor: A_WELL_UNDER_UNITY, fractionRemoved: UNREACHABLE_SPEC })],
  ['a march that walks off the correlation part way down', () => G.jtDrop({ ...AGBADA, tF: AGBADA_COLD_INLET_F, p2Psia: AGBADA_COLD_P2_PSIA })],
  ['a compressibility off the correlation band', () => G.zAtState({ pPsia: 30000, tF: 100, gasSg: 0.65 })],
  ['a contactor whose liquid is lighter than its gas', () => G.contactorDiameter({ gasMMscfd: 50, pPsia: 900, tF: 100, gasSg: 0.65, rhoLLbFt3: 0.5 })],
].forEach(([label, fn]) => {
  const r = mustRefuse(label, fn());
  const keys = Object.keys(r).filter((k) => k !== 'error');
  w(`- ${label}: besides the message it returns ${keys.length} field${keys.length === 1 ? '' : 's'}, ${keys.join(', ')}.`);
});
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
  ['the lean loading raised to the rich, so the swing is exactly zero', UBIE.richLoading, () => G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading })],
  ['the lean loading a billionth below the rich, so the swing is barely positive', UBIE.richLoading - 1e-9, () => G.aminePackage({ ...UBIE, leanLoading: UBIE.richLoading - 1e-9 })],
  ['the let-down with the two pressures equal', 500, () => G.jtDrop({ p1Psia: 500, p2Psia: 500, tF: 100, gasSg: 0.65 })],
  ['the let-down a hair apart', 499.999999, () => G.jtDrop({ p1Psia: 500, p2Psia: 499.999999, tF: 100, gasSg: 0.65 })],
].forEach(([guard, value, fn]) => w(`| ${guard} | ${num(value, 9)} | ${fn().error ? 'refuses' : 'answers'} |`));
w('A guard that refuses its own limit is as wrong as one that accepts nonsense, which is why both sides are read rather than one.');
w();

// --------------------------------------------------------------- SECTION 16
w('# SECTION 16: What the method does not know (owned by Expert m06 l01)');
w();
w('Six things this course teaches as limits and never as answers:');
w(`1. The real-gas departure of the saturated water content. HELD FOR LITERATURE. The engine warns above ${num(G.DECLARED_CONSTANTS.CHART_WARNING_PSIA, 6)} psia that the correction reaches tens of percent, and nothing in this package stands behind a figure for it. Every graded water content in this course sits below that threshold for exactly this reason.`);
w(`2. The water overhead the reboiler pays for, ${num(G.WATER_OVERHEAD_BTU_PER_LB, 6)} Btu a lb. DECLARED. It is an input with that default, and no publication in this repository fixes it.`);
w(`3. The glycol density, ${num(G.TEG_LB_PER_GAL, 6)} lb a gallon. DECLARED. It is the module's one glycol density and both the loop balance and the vessel sizing read it, so at least a reader always knows which number they are holding.`);
w(`4. The water density the amine gallons chain divides by, ${num(G.WATER_LB_PER_GAL, 6)} lb a gallon. DECLARED, and the module's own comment records that it sits above the measured density of water at the standard temperature, because it is the figure the amine circulation charts are drawn with.`);
w('5. The three amines\' property set. DECLARED. The molecular weights are chemistry; the typical strengths, the rich limits, the duties and the solution gravities are customary practice with no source in this package.');
w('6. The BTEX absorbed fraction and its single molecular weight. DECLARED. The fraction is a chart or operating value the engine takes as an input, and the molecular weight is one compound standing for four.');
w();
w('THE MODULE COLLECTS ALL OF THESE IN ONE PLACE. `DECLARED_CONSTANTS` is an export whose whole purpose is to say which numbers no check in this package can reach, and its own comment says that pinning them is the honest best available rather than a validation. A course that presented a pinned constant as a verified one would be making exactly the claim that export exists to refuse.');
w();
w('And two things that are not held but simply ABSENT. THERE IS NO HYDRATE BOUNDARY IN THIS ENGINE, and there is no stage efficiency. A hydrate margin is the Production module Flow Assurance engine, which owns subcooling, the depression correlations and the inhibitor dose, and which computes no hydrate boundary of its own either. Dehydration and a cold separator are the OTHER two answers to the same question, and the seam between the three is a course boundary rather than a gap.');
w();
w('One more absence worth naming, because a reader will look for it. Nothing here models a real absorber. A theoretical stage is not a tray, there is no stage efficiency, no rate-based mass transfer and no approach to equilibrium. Section 9 gives a stage count and Section 10 gives a circulation, and turning either into steel needs a vendor.');
w();

// --------------------------------------------------------------- SECTION 17
w('# SECTION 17: What a published case can and cannot catch (owned by Expert m05 l05)');
w();
w('A check that restates the thing it is checking validates nothing. This module\'s published cases come from an oracle that says, route by route, which of its routes are independent of the engine and which are not, and that distinction is the whole of this section.');
w();
w('THE INDEPENDENT ROUTES, and the evidence that they are independent is that they DO NOT agree exactly:');
const wWorst = Math.max(...GOLD.water.map((row) => Math.abs(G.saturatedWaterContent(row).lbPerMMscf / row.lbPerMMscf - 1)));
const kWorst = Math.max(...GOLD.kremser.map((row) => Math.abs(kNum(row) / row.fractionRemoved - 1)));
w(`- WATER CONTENT. The oracle uses a DIFFERENT published vapour-pressure equation from the engine's. Across the ${GOLD.water.length} published cases the largest departure from one is ${num(wWorst, 9)} (derived, the largest absolute departure in the Section 3 table). Two published fits of one physical curve meeting inside their shared band is a result; two copies of one fit agreeing exactly is not.`);
w(`- KREMSER. The oracle solves the stage cascade as a LINEAR SYSTEM by elimination, which is different arithmetic reaching the same number. Largest departure from one across ${GOLD.kremser.length} cases: ${num(kWorst, 12)} (derived, from the Section 9 table).`);
w('- THE JOULE-THOMSON COEFFICIENT. The oracle forms the molar volume from a compressibility it solves ITSELF, by a different root-finder from the engine\'s, and differentiates it NUMERICALLY, so the identity the engine derives is never used on the checking side. Only the published correlation is shared.');
w('- THE BALANCES. The oracle carries these through kilograms, cubic metres, joules and watts, and it builds the STANDARD MOLAR VOLUME from the SI gas constant where the engine builds it from the package figure in field units. That is a real second road and not a change of spelling, and the next block measures the difference it makes.');
w();
w('THAT LAST ONE LEAVES A MEASURABLE SIGNATURE, and it is the most useful number on this page. Every quantity that passes through the standard molar volume carries the gap between the two gas constants, and every quantity that does not carries none of it:');
const molarRows = [];
GOLD.teg.forEach((row, i) => {
  const r = G.tegPackage(row);
  molarRows.push([`TEG case ${i + 1}, water a day`, r.waterLbDay / row.waterLbDay, 'a MASS balance, no molar volume in it']);
  molarRows.push([`TEG case ${i + 1}, BTEX a day`, r.btexLbDay / row.btexLbDay, 'a MOLE balance, the molar volume is in it']);
});
['MDEA', 'DEA', 'MEA'].forEach((id, i) => {
  const row = GOLD.amine[i];
  molarRows.push([`amine case ${i + 1}, circulation`, G.aminePackage({ ...row, amineId: id }).circGpm / row.circGpm, 'a MOLE balance end to end']);
});
GOLD.contactor.forEach((row, i) => {
  const rho = [G.TEG_LB_PER_FT3, G.TEG_LB_PER_FT3, G.amineSolutionLbPerFt3('MDEA')][i];
  const r = i < 3 ? G.contactorDiameter({ ...row, rhoLLbFt3: rho })
    : G.contactorDiameter({ gasMMscfd: row.gasMMscfd, pPsia: row.pPsia, tF: row.tF, gasSg: row.gasSg, ksFtS: row.ksFtS });
  molarRows.push([`contactor case ${i + 1}, gas density`, r.rhoG / row.rhoG, 'the gas law, which carries the gas constant']);
});
w('| published case | engine over golden | what the quantity is |');
w('| --- | --- | --- |');
molarRows.forEach(([a, b, c]) => w(`| ${a} | ${num(b, 15)} | ${c} |`));
const molar = molarRows.filter(([, , c]) => !/MASS/.test(c)).map(([, v]) => v);
const mass = molarRows.filter(([, , c]) => /MASS/.test(c)).map(([, v]) => v);
w(`The molar rows all carry the SAME number to the last place double precision holds: the largest minus the smallest of them is ${(Math.max(...molar) - Math.min(...molar)).toExponential(3)} (derived, from the molar rows above), which is a few units in the last bit rather than a difference in the arithmetic. The mass rows carry none of it: their largest departure from one is ${Math.max(...mass.map((v) => Math.abs(v - 1))).toExponential(3)}.`);
w(`So the signature is ${num(molar[0], 15)}, and it is the ratio of two gas constants rather than a defect in either side. A quantity that shows it went through a mole; a quantity that does not, did not. That is a check telling you something about the arithmetic it just did, which is the entire point of an independent oracle.`);
w();
w('THE SHARED VALUES, which the oracle declares rather than checks. The dehydration and sweetening balances both turn on customary densities and a customary overhead, and there is nothing in this repository to check any of them against. The oracle holds a second copy under a name that says so, so that CHANGING one of them breaks the published cases and makes the change a reviewed act. That is a tripwire and it is worth having. It is not a validation, and the oracle says as much in its own comment.');
w();
w('So the published cases divide into two kinds, and a reader has to know which kind is in front of them:');
w('| what is checked | by what | what a disagreement would mean |');
w('| --- | --- | --- |');
[
  ['the water content', 'a second published vapour-pressure equation', 'one of the two fits is wrong, or the conversion between them is'],
  ['the stage relation', 'a brute-force cascade solved as a linear system', 'the closed form is wrong'],
  ['the coefficient and the march', 'an independently solved compressibility, differentiated numerically', 'the identity the engine derives is wrong'],
  ['the balances', 'the same arithmetic in different units, with the customary values declared as shared', 'a unit slip or a transcription error, and nothing about whether the customary values are right'],
].forEach(([a, b, c]) => w(`| ${a} | ${b} | ${c} |`));
w();
w('THE RULE A READER SHOULD LEAVE WITH. Agreement to twelve decimals between two things that share their arithmetic is a weaker result than agreement to six between two things that do not. The first says a transcription was faithful. The second says two roads met. When a published case agrees exactly, the question to ask is not how close it came but how far apart the two sides were to begin with.');
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
w(`UBIE arrives at ${e6(UBIE.co2MolPct)} mol percent CO2 and ${e6(UBIE.h2sMolPct)} mol percent H2S and has to leave at ${e6(UBIE.co2SpecMolPct)} and ${e6(UBIE.h2sSpecMolPct)}. As a mole balance that is ${r4(UB.acidMolesDay)} lbmol a day into the solution. Between a LEAN LOADING of ${e6(UBIE.leanLoading)} and a RICH LOADING of ${e6(UB.richLoadingUsed)} the LOADING SWING is ${num(UB.richLoadingUsed - UBIE.leanLoading, 9)} mol per mol (derived, the two loadings on this line subtracted), and on ${e6(UBIE.amineWtPct)} weight percent MDEA that is ${e6(UB.circGpm)} gpm and ${e6(UB.reboilerMMBtuHr)} MMBtu an hour.`);
w(`As a staged device the same column is read differently. At an absorption factor of ${e6(OBIAFU_ABSORPTION_FACTOR)} the Kremser relation says ${e6(OBIAFU_STAGES)} theoretical stages remove ${num(kNum({ absorptionFactor: OBIAFU_ABSORPTION_FACTOR, stages: OBIAFU_STAGES }), 9)} of what is there, and a removal of ${e6(0.99)} would demand ${num(G.kremserStagesFor({ absorptionFactor: OBIAFU_ABSORPTION_FACTOR, fractionRemoved: 0.99 }).stages, 9)}.`);
w(`As a vessel it is ${e6(UB_CONT.diameterFt)} ft across, because the gas weighs ${e6(UB_CONT.rhoG)} lb per ft3 at ${e6(UBIE_CONTACTOR.pPsia)} psia and may not rise faster than ${e6(UB_CONT.vAllowFtS)} ft per s.`);
w('Three answers about one column, and not one of them can be derived from the other two. The mole balance says how much solution has to move and says nothing about whether the column can reach the spec. The stage relation says whether the spec is reachable and says nothing about how many gallons a minute it takes. The vessel says how wide the steel has to be and knows neither.');
w();

// --------------------------------------------------------------- SECTION 20
// FRAMED HISTORY. This section is the one place in the digest where the
// subject IS what the engine used to do, and it says so in its own title and
// in its first line. Framed history is curriculum; unframed history is a
// defect. It is placed LAST so nothing above it can be read as history by
// accident, and every figure in it is either the repaired engine's answer or
// a ratio printed beside the two numbers it came from.
w('# SECTION 20: What this engine was repaired for, and how to teach it (owned by Expert m05 l01)');
w();
w('THE EXPERT TIER READS THIS DIGEST OUT OF ORDER, so the mapping is stated here once rather than inferred from six section headers. It was resolved by SUBJECT:');
w('| Expert lesson | where it reads from |');
w('| --- | --- |');
[['m05 l01, What was repaired, and what was not', 'Section 20'],
 ['m05 l02, What a refusal is', 'Section 15'],
 ['m05 l03, The contract read on one door', 'Section 15, the export census and the one-door table'],
 ['m05 l04, Constants measured out of the engine', 'Section 2'],
 ['m05 l05, What a published case can catch', 'Section 17'],
 ['m06 l01, What the method does not know', 'Section 16'],
 ['m06 l02, The capstone worked', 'its own capstone rather than this digest'],
 ['m06 l03, Where this engine hands over', 'Sections 14 and 16'],
].forEach(([a, b]) => w(`| ${a} | ${b} |`));
w();
w('EVERYTHING IN THIS SECTION IS HISTORY AND IS LABELLED AS HISTORY. Nothing above this line is. If you teach any of it, say plainly that it is what the engine used to do, the way this section does. A sentence about former behaviour that reads as current behaviour is the defect; the subject itself is not.');
w();
w('This module was repaired after a recon found 49 findings in it, its published cases and the studio that composes it. Four of those are worth teaching because each one is a general lesson that happens to have an example here.');
w();
w('1. A COEFFICIENT THAT WAS WRONG ON FOUR SCREENS AT THE APP\'S OWN DEFAULTS. The Joule-Thomson relation carries no compressibility in its denominator, and this module divided by one. The error was exactly a factor of one over z: nothing at all in the ideal-gas limit and growing with pressure, which is the shape that hides an error, because it is smallest exactly where a sanity check is easiest. The lesson is the shape rather than the factor.');
const histP = [20, 600, 1000, 2500];
w('| psia | z the engine reports | 1 over z, which is what the error was |');
w('| --- | --- | --- |');
histP.forEach((pp) => {
  const r = G.jouleThomsonFPerPsi({ pPsia: pp, tF: 100, gasSg: 0.65 });
  w(`| ${e6(pp)} | ${num(r.z, 9)} | ${num(1 / r.z, 9)} |`);
});
w('Those are the repaired engine\'s compressibilities, and the last column is one over each of them, printed so the shape of the former error can be read off numbers that are current.');
w();
w('2. THE CHECK THAT COULD NOT CATCH IT. The routine had no published case at all, and its only check was that the answer fell in a band of 5 to 9 degF per 100 psi. Both the wrong answer and the right one sit inside that band, so the check could not fail. A gate that restates the formula it is checking, or bounds an answer loosely enough to admit both candidates, is not a check. Section 17 is what a real one looks like, and the golden now carries published cases for this routine.');
w();
w('3. AN INPUT THAT WAS VALIDATED AND THEN IGNORED. The lean glycol strength was range checked, refused outside 90 to 100 weight percent, and read by nothing. A validated input that moves no output is worse than an absent one, because the validation asserts that it matters. It now drives the loop water balance, and Section 6 teaches what it does and, just as carefully, what it does not: it does not set the outlet spec, and the engine says so on every answer.');
w();
w('4. ONE FLUID WITH TWO DENSITIES, AND ONE MODULE WITH TWO STANDARD BASES. Two numbers for one glycol, and a standard cubic foot defined at one pressure and converted at another. Neither gap was large. Both are defects whatever their size, because nothing downstream can tell which of the two numbers it is holding. Section 2 now shows one of each, and shows the derived ones being derived.');
w();
// The comment counts are MEASURED by reading the engine source, not typed,
// for the same reason every other figure in this digest is measured.
const HIST_RE = /^\s*(\*|\/\/).*(used to|no longer|until FC4-0)/;
// The same sweep with a wider keyword list, so the digest can say how much
// the RULE moves the answer instead of asserting that it does.
const HIST_RE_WIDE = /^\s*(\*|\/\/).*(used to|no longer|before the repair|formerly|had been|prior to|was the bug|instead of|was on screen)/i;
const countWide = (file) => fs.readFileSync(file, 'utf8').split('\n').filter((l) => HIST_RE_WIDE.test(l)).length;
const countHist = (file) => fs.readFileSync(file, 'utf8').split('\n').filter((l) => HIST_RE.test(l)).length;
const walkJs = (dir) => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walkJs(`${dir}/${e.name}`) : (e.name.endsWith('.js') ? [`${dir}/${e.name}`] : [])));
const THIS_MODULE_HIST = countHist(`${ROOT}/engines/facilities/gasProcessing.js`);
const ENGINE_FILES = walkJs(`${ROOT}/engines`);
const ALL_ENGINE_HIST = ENGINE_FILES.reduce((a, f) => a + countHist(f), 0);
const THIS_MODULE_WIDE = countWide(`${ROOT}/engines/facilities/gasProcessing.js`);
w(`WHERE THE REST OF IT LIVES, AND HOW TO READ IT. The engine's own source comments record what changed, because a good repair records what it changed: there are ${THIS_MODULE_HIST} such comment lines in this module and ${ALL_ENGINE_HIST} across the vendored engines, counted here rather than quoted, by reading ${ENGINE_FILES.length} vendored engine modules under packages/engines/engines and taking every COMMENT line carrying "used to", "no longer" or the repair's own name. Both the tree and the rule are stated because a count of this kind means nothing without them: widen the rule to the nine keywords this file also sweeps with and this module alone reads ${THIS_MODULE_WIDE}, and count the canonical engines repository instead of the subset NextGen vendors and the tree figure more than doubles. A number quoted without its tree and its rule is not checkable and should not be repeated. THEY ARE PROVENANCE. A comment is not the digest, and a sentence lifted out of one into a lesson arrives with no frame around it. If you want to teach any of it, frame it the way this section does, and never present it as what the engine does now.`);
w();

console.log(out.join('\n'));
