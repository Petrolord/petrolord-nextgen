// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES OF flowassurance_cases.json (plus
// sweeps around them and one clearly labelled TEACHING LINE this wave designs
// for itself). THE PD6 CAPSTONE RUNS DIFFERENT CONDITIONS ENTIRELY: nothing
// here imports, reads or reproduces pd6_fields.mjs, fields.json, or any
// capstone line, pipe, insulation, trench, rate, temperature, pressure,
// hydrate boundary, inhibitor dose or graded verdict. The teaching digest and
// the capstone are two files with opposite audiences and they never share a
// number.
//
// Usage:  node /root/pd-wip-flowassurance/pd6_dump.mjs > /root/pd-wip-flowassurance/digest.txt
//         node /root/pd-wip-flowassurance/pd6_leakcheck.mjs
//
// Engine:   packages/engines/engines/production/flowlineThermal.js
//           packages/engines/engines/production/hydrateInhibition.js
// Goldens:  packages/engines/test-data/production/goldens/flowassurance_cases.json
//           (cut by tools/validation/production/oracle_flowassurance.py, SI throughout)

import fs from 'fs';

const ROOT = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const ENG = `${ROOT}/engines/production/`;
const T = await import(`${ENG}flowlineThermal.js`);
const H = await import(`${ENG}hydrateInhibition.js`);
const GOLD = JSON.parse(fs.readFileSync(
  `${ROOT}/test-data/production/goldens/flowassurance_cases.json`, 'utf8'));

const out = [];
const w = (s) => out.push(s);
const f = (x, n = 6) => (x === null || x === undefined || Number.isNaN(x))
  ? 'n/a' : Number(x).toFixed(n);
const e = (x, n = 4) => (x === null || x === undefined) ? 'n/a' : Number(x).toExponential(n);
const yn = (b) => (b ? 'true' : 'false');
const rel = (a, b) => Math.abs(a - b) / Math.abs(b);

// ------------------------------------------------------------ fixtures
// THE PUBLISHED PIPE. Exactly the layer list, films and reference diameter the
// oracle used to cut overallU.bare, overallU.insulated and overallU.buried4ft.
const PUB_STEEL = { idIn: 6.065, odIn: 6.625, k: 26, label: 'carbon steel wall' };
const PUB_FOAM = { idIn: 6.625, odIn: 8.625, k: 0.09, label: 'syntactic PP foam' };
const PUB_IN_H = 250;   // inside film, Btu/(hr ft2 degF)
const PUB_OUT_H = 200;  // outside film, Btu/(hr ft2 degF)
const PUB_REF = 6.065;  // reference diameter, in: the bore
const PUB_BURIAL_FT = 4.0;
const PUB_KSOIL = 1.2;

// THE PUBLISHED FLUID, from oracle_flowassurance.py's profile and cooldown cases.
const PUB_INLET_F = 180.0;
const PUB_AMB_F = 40.0;
const PUB_MDOT = 120000.0;   // lb/hr
const PUB_CP = 0.5;          // Btu/(lb degF)
const PUB_LENGTHS = [5280.0, 26400.0, 105600.0];
const PUB_COOL_CONTENTS_RHO = 55.0;  // lbm/ft3
const PUB_COOL_CONTENTS_CP = 0.5;
const PUB_COOL_SHELL_CP = 0.11;
const PUB_COOL_START = 150.0;
const PUB_COOL_TARGET = 70.0;

// TEACHING LINE AKASO SPUR. Invented by this wave. Not a published case, not a
// real line, and no oracle has ever seen it.
const TL = {
  name: 'AKASO SPUR',
  layers: [
    { idIn: 9.562, odIn: 10.75, k: 26, label: 'carbon steel wall' },
    { idIn: 10.75, odIn: 13.75, k: 0.07, label: 'polyurethane foam' },
    { idIn: 13.75, odIn: 16.75, k: 0.9, label: 'concrete weight coat' },
  ],
  insideFilmH: 200,       // multiphase flowing
  outsideFilmH: 200,      // seabed with current
  burialFt: 3.0,
  kSoil: 1.2,             // wet soil / seabed
  refBore: 9.562,
  refCoatedOd: 16.75,
  lengthFt: 60000.0,
  inletTempF: 195.0,
  seabedTempF: 45.0,
  massRateLbHr: 90000.0,
  cpBtuLbF: 0.62,
  inletPsia: 2400.0,
  outletPsia: 1500.0,
  jtCoeffFPerPsi: 0.028,
  hydrateFlowingF: 71.0,  // A LABORATORY INPUT. The engine never computes it.
  hydrateShutInF: 78.0,   // the same boundary after the line packs up
  contentsRhoLbFt3: 8.6,
  contentsCp: 0.62,
  steelCp: 0.11,
  foamRhoLbFt3: 44.0,
  foamCp: 0.28,
  coatRhoLbFt3: 190.0,
  coatCp: 0.21,
  waterRateBpd: 420.0,
  subcoolingF: 36.0,
  safetyMarginF: 5.0,
  leanMeohWtPct: 96.0,
  leanMegWtPct: 89.0,
};
const TL_DP = TL.inletPsia - TL.outletPsia;
const TL_NEED = TL.subcoolingF + TL.safetyMarginF;

// ---------------------------------------------------------------- header
w('PD6 Flow Assurance: TEACHING DIGEST');
w('');
w('THIS FILE RUNS THE PUBLISHED CASES. THE CAPSTONE RUNS DIFFERENT CONDITIONS');
w('ENTIRELY. Every line below comes from a PUBLISHED golden case out of');
w('packages/engines/test-data/production/goldens/flowassurance_cases.json, from');
w('the shipped engine re-run on those published inputs, from a sweep this');
w('generator ran on published inputs, or from the one TEACHING LINE this wave');
w('designed for itself. The generator never opens pd6_fields.mjs and never reads');
w('the capstone line: no capstone pipe, insulation, trench, length, rate,');
w('temperature, pressure, hydrate boundary, dose or graded answer is reachable');
w('from here.');
w('');
w('A leak guard, pd6_leakcheck.mjs, reads the capstone graded field list out of');
w('fields.json and every number on every line of this file, and rejects the');
w('digest if any number lands within TEN TIMES a graded field tolerance of that');
w('field value, in three unit shiftings (as printed, times 1000, times 0.001).');
w('academy_submit_capstone grades with abs(got - expected) <= tol, so tol is');
w('ABSOLUTE in the field own units and is not a fraction of anything. Ten times');
w('it is under three ten-thousandths of a Btu/(hr ft2 degF) on a bare U, under');
w('four ten-thousandths of a degF on an arrival temperature, and under two');
w('hundredths of a foot on a relaxation length. This file passed that guard.');
w('');
w('Generator: /root/pd-wip-flowassurance/pd6_dump.mjs');
w('Engine:    packages/engines/engines/production/flowlineThermal.js');
w('           packages/engines/engines/production/hydrateInhibition.js');
w('Goldens:   packages/engines/test-data/production/goldens/flowassurance_cases.json');
w('Golden oracle: tools/validation/production/oracle_flowassurance.py. It works in');
w('           SI throughout, watts and metres and kelvin and seconds, and converts');
w('           only at the boundary, so every resistance, every relaxation length');
w('           and every cooldown crosses a unit system before it can be compared.');
w('           It computes both inhibitor relations in CELSIUS with the metric');
w('           constants, 1297 for Hammerschmidt and 72 for Nielsen-Bucklin, and');
w('           converts the answer, so the field constants the engine carries have');
w('           to fall out of the metric ones.');
w('Gate:      __tests__/production.flowassurance.test.js');
w('Units: degF, psia never psig, weight percent, lbm/ft3, lbm/ft, ft, in, hr,');
w('       Btu/(hr ft2 degF) for U, Btu/(hr ft degF) for k, Btu/(lb degF) for Cp,');
w('       hr ft degF/Btu per foot of pipe for a resistance, bbl/d. Never SI');
w('       except where a golden is explicitly published in SI and is labelled so.');
w('');
w('WHAT PROVENANCE LABEL MEANS WHAT');
w('  golden ...    a value committed in flowassurance_cases.json, cut by the');
w('                independent SI oracle named above. Three overall U values, one');
w('                burial limit, three relaxation lengths, three arrival');
w('                temperatures with their ntu, one cooldown, 24 inhibitor rows');
w('                and two constants.');
w('  engine ...    the shipped engine re-run on PUBLISHED golden inputs. Where a');
w('                golden carries the same quantity, the two are printed together');
w('                so a lesson can see the agreement or the divergence.');
w('  derived ...   a sweep, a refinement or a second route run by this generator');
w('                on PUBLISHED inputs, or an identity checked between two engine');
w('                returns. A sweep point is not a published case. Say so if you');
w('                print one.');
w('  teaching ...  a construct this wave invented: the line AKASO SPUR and every');
w('                fluid, pressure, hydrate boundary, water rate and dose that');
w('                goes with it. Not a published case, not a real line, and never');
w('                to be presented as either. No oracle has ever checked it.');
w('');
w('THE PUBLISHED CASES AT A GLANCE');
w('  the pipe         6.065 in bore, 6.625 in steel outside diameter at k 26,');
w('                   then 2.0 in of syntactic polypropylene foam to 8.625 in at');
w('                   k 0.09. Inside film 250, outside film 200. U referred to');
w('                   the 6.065 in bore. Published in three builds: bare, which');
w('                   is the steel layer alone; insulated, which adds the foam;');
w('                   and buried4ft, which adds a 4.0 ft trench to centreline in');
w('                   wet soil at k 1.2.');
w('  the burial limit one value, the ground resistance of a pipe LYING ON the');
w('                   bottom, H = D/2 on the 8.625 in coated diameter, published');
w('                   in SI as K m / W rather than in field units.');
w('  the fluid        180.0 degF in, 40.0 degF ambient, 120000.0 lb/hr, Cp 0.5,');
w('                   through the insulated build. Three relaxation lengths at');
w('                   60000.0 and 120000.0 lb/hr and Cp 0.5 and 0.6, and three');
w('                   arrivals at 5280.0, 26400.0 and 105600.0 ft. NO PRESSURES');
w('                   ARE SET ANYWHERE IN THE GOLDENS, so the Joule-Thomson term');
w('                   is zero in every published case.');
w('  the cooldown     one case. 150.0 degF start, 40.0 degF ambient, 70.0 degF');
w('                   target, contents at 55.0 lbm/ft3 and Cp 0.5, steel shell at');
w('                   490 lbm/ft3 and Cp 0.11, through the insulated build.');
w('  the inhibitors   24 rows. Four fluids, methanol, MEG, DEG and TEG, each at');
w('                   5.0, 10.0, 20.0, 30.0, 40.0 and 50.0 weight percent, each');
w('                   carrying a Hammerschmidt and a Nielsen-Bucklin depression.');
w('  the constants    the Hammerschmidt constant reached through the metric round');
w('                   trip, and the Nielsen-Bucklin constant reached the same way.');
w('');
w('THE TEACHING LINE');
w(`  ${TL.name}   a ${f(TL.lengthFt, 1)} ft buried subsea gas line on a 9.562 in bore, designed`);
w('             so that the number of transfer units is near enough to one that');
w('             the Joule-Thomson damping factor is visibly not one, so that the');
w('             hydrate verdict changes sign between the three ways of applying');
w('             the Joule-Thomson term, and so that pushing the same line to');
w('             three times its length drives the engine arrival below the');
w('             seabed. Every fluid property, pressure, hydrate temperature,');
w('             water rate and inhibitor lean strength on it is a TEACHING');
w('             number this wave chose. It is a TEACHING LINE.');
w('');
w('THE ONE THING NEITHER ENGINE COMPUTES');
w('  The hydrate boundary. Both module headers say so in as many words:');
w('  flowlineThermal says hydrate and wax boundaries "are fluid properties, they');
w('  come from a lab or a compositional flash, and the consumer supplies them",');
w('  and hydrateInhibition says it "does NOT compute where the hydrate boundary');
w('  is in the first place". Every hydrate temperature and every subcooling');
w('  printed anywhere in this file is therefore a TEACHING INPUT, never an engine');
w('  output, and every margin computed against one is conditional on it.');
w('');

// ============================================================ SECTION 1
w('# SECTION 1: THE PUBLISHED CONSTANTS, AND EVERY CATALOG VALUE THE ENGINES OFFER');
w('# The two published constants are inhibitor constants, reached by the oracle');
w('# through its metric round trip. The catalogs below are what the engine ships');
w('# as DEFAULTS: every layer still takes its own k as an input, and the film');
w('# coefficients are exposed precisely because they are the uncertain ones.');
w('# Associate m01 and m02 own this section.');
w(`golden constant, Hammerschmidt K from the metric round trip = ${f(GOLD.constants.hammerschmidtKfromMetric, 6)} degF weight percent basis`);
w(`golden constant, Nielsen-Bucklin constant from the metric round trip = ${f(GOLD.constants.nielsenBucklinFfromMetric, 6)} degF`);
w(`engine constant, NIELSEN_BUCKLIN_CONSTANT_F = ${f(H.NIELSEN_BUCKLIN_CONSTANT_F, 6)} degF`);
w(`engine constant, WATER_MOLECULAR_WEIGHT = ${f(H.WATER_MOLECULAR_WEIGHT, 6)}`);
w(`engine constant, HAMMERSCHMIDT_RELIABLE_WT_PCT = ${f(H.HAMMERSCHMIDT_RELIABLE_WT_PCT, 1)} weight percent`);
w(`engine constant, MAX_PRACTICAL_WT_PCT = ${f(H.MAX_PRACTICAL_WT_PCT, 1)} weight percent`);
w(`engine constant, STEEL_DENSITY_LB_FT3 = ${f(T.STEEL_DENSITY_LB_FT3, 1)} lbm/ft3`);
w('');
w('# The Hammerschmidt constant the engine actually uses is carried PER INHIBITOR');
w('# rather than as one global, so a user with a different source can match it.');
w('# All four ship the same value.');
H.INHIBITORS.forEach((inh) => {
  w(`engine inhibitor, ${inh.id}: label = ${inh.label}, molecular weight = ${f(inh.molecularWeight, 2)}, k = ${f(inh.k, 1)}, liquid density = ${f(inh.densityLbGal, 4)} lb/gal, Nielsen-Bucklin available = ${yn(inh.nielsenBucklin)}`);
});
w('');
w('# Thermal conductivities, Btu/(hr ft degF). The whole range from steel to');
w('# aerogel is three and a half orders of magnitude, which is why an insulation');
w('# layer can carry most of a stack while a steel wall carries almost none.');
T.CONDUCTIVITIES.forEach((c) => {
  w(`engine conductivity, ${c.id} (${c.label}) = ${f(c.k, 4)} Btu/(hr ft degF), ratio to carbon steel = ${f(c.k / 26, 8)}`);
});
w(`engine conductivity, unknown id 'aerogelBlanket' = ${f(T.conductivity('aerogelBlanket'), 6)}`);
w('# That n/a is a NaN and it is deliberate. The header says an earlier version');
w('# returned carbon steel for an unknown id, so a typo in an insulation id made a');
w('# line look two thousand times better insulated than it is. Note the ratio');
w(`derived, carbon steel to aerogel conductivity ratio = ${f(26 / T.conductivity('aerogel'), 6)} (the reciprocal of the aerogel row above)`);
w(`# above: aerogel to steel is ${f(T.conductivity('aerogel') / 26, 8)}, and the`);
w('# reciprocal on the line before this one is what the mistake was worth on');
w('# one layer.');
w('');
w('# Outside film coefficients, Btu/(hr ft2 degF).');
T.FILM_COEFFICIENTS.forEach((c) => {
  w(`engine outside film, ${c.id} (${c.label}) = ${f(c.h, 4)} Btu/(hr ft2 degF)`);
});
w('# Bore-side film coefficients, Btu/(hr ft2 degF). Kept in their own catalog.');
T.INSIDE_FILMS.forEach((c) => {
  w(`engine inside film, ${c.id} (${c.label}) = ${f(c.h, 4)} Btu/(hr ft2 degF)`);
});
w(`engine film coefficient, unknown id 'seabedStill' = ${f(T.filmCoefficient('seabedStill'), 6)}`);
w(`derived, ratio of the flowing-liquid inside film to the shut-in stagnant one = ${f(300 / 5, 6)}`);
w('# The inside film is very nearly a short circuit WHILE THE LINE FLOWS. A shut-in');
w('# line has a stagnant bore, and then it matters, which is the header saying so.');
w('');

// ============================================================ SECTION 2
w('# SECTION 2: THE PUBLISHED PIPE IN THREE BUILDS, GOLDEN U AGAINST ENGINE U');
w('# THE SAME QUANTITY IS COMPUTED TWO WAYS HERE AND BOTH ARE PRINTED. The golden');
w('# U is the oracle stacking the same resistances in SI, watts and metres and');
w('# kelvin, and converting back at the end. The engine U is the shipped');
w('# JavaScript stacking them in field units and never leaving them. They agree to');
w('# the conversion factors, and the residual relative difference printed on each');
w('# row is the round trip, not a disagreement about physics. Associate m02 owns');
w('# this section.');
const pubBuild = (id, layers, burialFt, kSoil, ref) => ({
  id, res: T.overallU({ layers, insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt, kSoil, referenceIdIn: ref }),
});
const PUB_BARE = pubBuild('bare', [PUB_STEEL], 0, 0, PUB_REF);
const PUB_INS = pubBuild('insulated', [PUB_STEEL, PUB_FOAM], 0, 0, PUB_REF);
const PUB_BUR = pubBuild('buried4ft', [PUB_STEEL, PUB_FOAM], PUB_BURIAL_FT, PUB_KSOIL, PUB_REF);

w(`golden U, published pipe bare (steel wall only) = ${f(GOLD.overallU.bare, 10)} Btu/(hr ft2 degF)`);
w(`engine U, published pipe bare (steel wall only) = ${f(PUB_BARE.res.uBtuHrFt2F, 10)} Btu/(hr ft2 degF)`);
w(`derived, relative difference golden against engine, bare = ${e(rel(PUB_BARE.res.uBtuHrFt2F, GOLD.overallU.bare), 6)}`);
w(`golden U, published pipe insulated (steel + 2.0 in foam) = ${f(GOLD.overallU.insulated, 12)} Btu/(hr ft2 degF)`);
w(`engine U, published pipe insulated (steel + 2.0 in foam) = ${f(PUB_INS.res.uBtuHrFt2F, 12)} Btu/(hr ft2 degF)`);
w(`derived, relative difference golden against engine, insulated = ${e(rel(PUB_INS.res.uBtuHrFt2F, GOLD.overallU.insulated), 6)}`);
w(`golden U, published pipe buried 4.0 ft in wet soil = ${f(GOLD.overallU.buried4ft, 12)} Btu/(hr ft2 degF)`);
w(`engine U, published pipe buried 4.0 ft in wet soil = ${f(PUB_BUR.res.uBtuHrFt2F, 12)} Btu/(hr ft2 degF)`);
w(`derived, relative difference golden against engine, buried4ft = ${e(rel(PUB_BUR.res.uBtuHrFt2F, GOLD.overallU.buried4ft), 6)}`);
w(`golden, total resistance of the insulated build, PUBLISHED IN SI = ${f(GOLD.overallU.totalResistanceSI, 12)} K m / W`);
w(`engine, total resistance of the insulated build, in field units = ${f(PUB_INS.res.totalResistance, 12)} hr ft degF/Btu per foot of pipe`);
w('# A per-length resistance in K m / W and one in hr ft degF/Btu per foot differ');
w('# by exactly the same factor that separates a conductivity in W/(m K) from one');
w('# in Btu/(hr ft degF), because a resistance is the reciprocal of a conductance');
w('# and the length cancels on both sides. The oracle carries that factor rounded');
w('# to eight figures. The exact value is the international Btu in joules over');
w('# 609.6, and both of those are printed on the next line.');
w(`engine constant, the international Btu = ${f(1055.05585262, 8)} J, over ${f(609.6, 1)}`);
w(`derived, the oracle SI-to-field factor as the oracle carries it = ${f(1.7307346, 10)} W/(m K) per Btu/(hr ft degF)`);
w(`derived, the same factor exactly = ${f(1055.05585262 / 609.6, 10)} W/(m K) per Btu/(hr ft degF)`);
w(`derived, relative difference of those two factors = ${e(rel(1.7307346, 1055.05585262 / 609.6), 6)}`);
w(`derived, golden SI resistance carried into field units with the oracle factor = ${f(GOLD.overallU.totalResistanceSI * 1.7307346, 12)} hr ft degF/Btu per foot`);
w(`derived, golden SI resistance carried into field units with the exact factor = ${f(GOLD.overallU.totalResistanceSI * (1055.05585262 / 609.6), 12)} hr ft degF/Btu per foot`);
w(`derived, relative difference, engine total against the oracle-factor conversion = ${e(rel(PUB_INS.res.totalResistance, GOLD.overallU.totalResistanceSI * 1.7307346), 6)}`);
w(`derived, relative difference, engine total against the exact-factor conversion = ${e(rel(PUB_INS.res.totalResistance, GOLD.overallU.totalResistanceSI * (1055.05585262 / 609.6)), 6)}`);
w('');
w('# What each build costs and buys, as ratios rather than as numbers.');
w(`derived, U ratio bare to insulated on the published pipe = ${f(PUB_BARE.res.uBtuHrFt2F / PUB_INS.res.uBtuHrFt2F, 8)}`);
w(`derived, U ratio insulated to buried4ft on the published pipe = ${f(PUB_INS.res.uBtuHrFt2F / PUB_BUR.res.uBtuHrFt2F, 8)}`);
w(`derived, U ratio bare to buried4ft on the published pipe = ${f(PUB_BARE.res.uBtuHrFt2F / PUB_BUR.res.uBtuHrFt2F, 8)}`);
w('# Two inches of foam is worth more than seventy times the bare U on this pipe.');
w('# Four feet of wet soil is worth less than a factor of two on top of it. The');
w('# stack adds, and once one term dominates the next one added has little left to');
w('# do.');
w('');

// ============================================================ SECTION 3
w('# SECTION 3: THE RESISTANCE STACK, EVERY LAYER, EVERY SHARE, ON FIVE BUILDS');
w('# A share is a PROPERTY OF A BUILD, not a number to memorise, so the same');
w('# stack is printed five times with one thing changed each time. Every');
w('# resistance is per foot of pipe, hr ft degF/Btu, and the shares on each build');
w('# sum to 100. The engine returns the shares itself, in the sharePct field of');
w('# each entry of the resistances array. Associate m02 and m03 own this section.');
w('#');
w('# Read the burial row as the ground term, the layer rows outward from the bore,');
w('# and the two film rows as the boundary layers on each face.');
const stack = (title, res, prov) => {
  if (!res.ok) { w(`${prov} build ${title}: REFUSED, ${res.error}`); return; }
  w(`${prov} build ${title}: overall U = ${f(res.uBtuHrFt2F, 10)} Btu/(hr ft2 degF), referred to ${f(res.referenceIdIn, 3)} in, total resistance = ${f(res.totalResistance, 10)} hr ft degF/Btu per foot, ${res.resistances.length} terms`);
  res.resistances.forEach((r) => {
    w(`${prov} build ${title}, term ${r.id}${r.label ? ` (${r.label})` : ''}: resistance = ${f(r.r, 10)} hr ft degF/Btu per foot, share = ${f(r.sharePct, 8)} percent`);
  });
  const sum = res.resistances.reduce((a, x) => a + x.sharePct, 0);
  w(`derived build ${title}: shares sum to ${f(sum, 8)} percent`);
};
stack('PUBLISHED BARE (steel wall only, no burial)', PUB_BARE.res, 'engine');
w('');
stack('PUBLISHED INSULATED (steel + 2.0 in syntactic foam, no burial)', PUB_INS.res, 'engine');
w('');
stack('PUBLISHED BURIED4FT (steel + foam + 4.0 ft trench, wet soil k 1.2)', PUB_BUR.res, 'engine');
w('');
const PUB_STILL = T.overallU({ layers: [PUB_STEEL, PUB_FOAM], insideFilmH: PUB_IN_H, outsideFilmH: 50, burialFt: 0, kSoil: 0, referenceIdIn: PUB_REF });
stack('PUBLISHED PIPE, INSULATED, STILL WATER OUTSIDE (outside film 50)', PUB_STILL, 'derived');
w('');
const PUB_STAG = T.overallU({ layers: [PUB_STEEL, PUB_FOAM], insideFilmH: 5, outsideFilmH: PUB_OUT_H, burialFt: 0, kSoil: 0, referenceIdIn: PUB_REF });
stack('PUBLISHED PIPE, INSULATED, SHUT IN AND STAGNANT INSIDE (inside film 5)', PUB_STAG, 'derived');
w('');
w('# The same foam layer, the same 2.0 in of syntactic polypropylene, across the');
w('# five builds above. Its RESISTANCE never changes. Its SHARE does, and it is');
w('# the share that tells a lesson what to look at.');
const foamOf = (res) => res.resistances.find((r) => r.id === 'layer1');
const steelOf = (res) => res.resistances.find((r) => r.id === 'layer0');
[['PUBLISHED INSULATED', PUB_INS.res], ['PUBLISHED BURIED4FT', PUB_BUR.res],
 ['STILL WATER OUTSIDE', PUB_STILL], ['SHUT IN AND STAGNANT', PUB_STAG]].forEach(([n, r]) => {
  const fo = foamOf(r);
  w(`derived, foam layer on build ${n}: resistance = ${f(fo.r, 10)} hr ft degF/Btu per foot, share = ${f(fo.sharePct, 8)} percent`);
});
w(`derived, spread of the foam share across those four builds = ${f(Math.max(foamOf(PUB_INS.res).sharePct, foamOf(PUB_BUR.res).sharePct, foamOf(PUB_STILL).sharePct, foamOf(PUB_STAG).sharePct) - Math.min(foamOf(PUB_INS.res).sharePct, foamOf(PUB_BUR.res).sharePct, foamOf(PUB_STILL).sharePct, foamOf(PUB_STAG).sharePct), 8)} percentage points`);
w('# And the steel wall, for contrast. It is the strongest material in the stack');
w('# and it carries almost nothing, because a resistance is ln(Do/Di) over k and');
w('# the steel has both the thinnest log and the largest k.');
[['PUBLISHED BARE', PUB_BARE.res], ['PUBLISHED INSULATED', PUB_INS.res],
 ['PUBLISHED BURIED4FT', PUB_BUR.res]].forEach(([n, r]) => {
  const st = steelOf(r);
  w(`derived, steel wall on build ${n}: resistance = ${f(st.r, 12)} hr ft degF/Btu per foot, share = ${f(st.sharePct, 8)} percent`);
});
w(`derived, the steel wall log term, ln(6.625 / 6.065) = ${f(Math.log(6.625 / 6.065), 10)}`);
w(`derived, the foam log term, ln(8.625 / 6.625) = ${f(Math.log(8.625 / 6.625), 10)}`);
w(`derived, ratio of those two log terms = ${f(Math.log(8.625 / 6.625) / Math.log(6.625 / 6.065), 8)}`);
w(`derived, ratio of the two conductivities, steel over foam = ${f(26 / 0.09, 8)}`);
w(`derived, product of those two ratios, which is the foam resistance over the steel resistance = ${f((Math.log(8.625 / 6.625) / Math.log(6.625 / 6.065)) * (26 / 0.09), 6)}`);
w(`derived, the same ratio taken straight from the two engine resistances = ${f(foamOf(PUB_INS.res).r / steelOf(PUB_INS.res).r, 6)}`);
w('');

// ============================================================ SECTION 4
w('# SECTION 4: WHAT THICKER FOAM BUYS, AND WHERE IT STOPS BUYING IT');
w('# A sweep on PUBLISHED inputs: the published pipe, the published films, the');
w('# published foam conductivity, with only the foam outside diameter moved. The');
w('# published build is the 8.625 in row and it is marked. Every other row is a');
w('# DERIVED SWEEP POINT and is not a published case. Associate m03 owns this.');
w('# The last two columns are a contiguous slice: each row against the one above');
w('# it, so a marginal return reads as a sequence.');
let prevU = null;
[6.625, 7.125, 7.625, 8.125, 8.625, 9.625, 10.625, 12.625, 16.625].forEach((od) => {
  const layers = od > 6.625
    ? [PUB_STEEL, { idIn: 6.625, odIn: od, k: 0.09, label: 'syntactic PP foam' }]
    : [PUB_STEEL];
  const r = T.overallU({ layers, insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: 0, kSoil: 0, referenceIdIn: PUB_REF });
  const fo = r.resistances.find((x) => x.id === 'layer1');
  const tag = od === 8.625 ? 'engine PUBLISHED BUILD' : 'derived sweep point';
  const wall = (od - 6.625) / 2;
  const inc = prevU === null ? null : prevU / r.uBtuHrFt2F;
  w(`${tag}, foam outside diameter ${f(od, 3)} in (wall ${f(wall, 4)} in): U = ${f(r.uBtuHrFt2F, 10)} Btu/(hr ft2 degF), total resistance = ${f(r.totalResistance, 10)}, foam resistance = ${fo ? f(fo.r, 10) : 'none'}, foam share = ${fo ? f(fo.sharePct, 6) : '0.000000'} percent, U ratio to the previous row = ${inc === null ? 'n/a' : f(inc, 8)}`);
  prevU = r.uBtuHrFt2F;
});
w('# The FIRST quarter inch of foam wall, the step from the bare 6.625 in to');
w('# 7.125 in, divides U by more than twenty two. The step from 12.625 in to');
w('# 16.625 in, which is two more inches of wall, eight times the WALL THICKNESS');
w('# of that first step and about seventeen times the MATERIAL, since the material');
w('# is an annulus and grows as the difference of two squares, divides it by less');
w('# than one and a half. The reason is in the log: a layer');
w('# resistance goes as ln(Do/Di), so equal THICKNESS added far out is less log');
w('# than the same thickness added close in.');
w(`derived, ln(7.125 / 6.625), the first quarter inch of foam wall = ${f(Math.log(7.125 / 6.625), 10)}`);
w(`derived, ln(16.625 / 16.125), a quarter inch of wall added at the outside = ${f(Math.log(16.625 / 16.125), 10)}`);
w(`derived, ratio of those two log terms = ${f(Math.log(7.125 / 6.625) / Math.log(16.625 / 16.125), 8)}`);
w('');
w('# The same sweep in the other material. Aerogel at k 0.012 against syntactic');
w('# foam at k 0.09, both on the PUBLISHED pipe and the PUBLISHED foam outside');
w('# diameter. DERIVED SWEEP POINTS, not published cases.');
[['syntactic PP foam', 0.09], ['polyurethane foam', 0.07], ['solid polypropylene', 0.13], ['aerogel blanket', 0.012], ['concrete weight coat', 0.9]].forEach(([label, k]) => {
  const r = T.overallU({ layers: [PUB_STEEL, { idIn: 6.625, odIn: 8.625, k, label }], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: 0, kSoil: 0, referenceIdIn: PUB_REF });
  const fo = r.resistances.find((x) => x.id === 'layer1');
  w(`derived sweep point, 2.0 in of ${label} at k ${f(k, 4)}: U = ${f(r.uBtuHrFt2F, 10)} Btu/(hr ft2 degF), layer resistance = ${f(fo.r, 10)}, layer share = ${f(fo.sharePct, 6)} percent`);
});
w('# The layer resistance is exactly inverse in k, so a lesson can read the whole');
w('# table off one row and a division. What is NOT inverse in k is the U, because');
w('# the films and the steel do not move.');
w(`derived, ratio of the aerogel layer resistance to the syntactic foam one = ${f(0.09 / 0.012, 8)}`);
w(`derived, ratio of the two U values from those same two builds = ${f(T.overallU({ layers: [PUB_STEEL, { idIn: 6.625, odIn: 8.625, k: 0.09 }], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: 0, kSoil: 0, referenceIdIn: PUB_REF }).uBtuHrFt2F / T.overallU({ layers: [PUB_STEEL, { idIn: 6.625, odIn: 8.625, k: 0.012 }], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: 0, kSoil: 0, referenceIdIn: PUB_REF }).uBtuHrFt2F, 8)}`);
w('');

// ============================================================ SECTION 5
w('# SECTION 5: THE BURIAL TERM, ITS DEPTH SWEEP, ITS SOIL SWEEP, AND ITS FLOOR');
w('# THE H = D/2 LIMIT IS COMPUTED TWO WAYS HERE AND THE TWO ARE IN DIFFERENT');
w('# UNITS ON PURPOSE. The golden publishes it in SI, K m / W, because the whole');
w('# oracle is SI; the engine returns it in hr ft degF/Btu per foot. Both are');
w('# floating point residue of an exact zero, and the two residues are different');
w('# sizes because the two arithmetics reach acosh(1) by different routes. Do not');
w('# read them as a disagreement and do not convert one into the other.');
w('# Associate m04 owns this section.');
w(`golden, ground resistance of a pipe LYING ON the bottom, H = D/2 on 8.625 in, wet soil = ${e(GOLD.burialAtHalfDiameter, 10)} K m / W`);
w(`engine, the same case, burialResistance({ odIn: 8.625, burialFt: 8.625/24, kSoil: 1.2 }) = ${f(T.burialResistance({ odIn: 8.625, burialFt: 8.625 / 24, kSoil: 1.2 }), 12)} hr ft degF/Btu per foot`);
w(`derived, the exact answer both are approximating, acosh(1) / (2 pi k) = ${f(Math.acosh(1) / (2 * Math.PI * 1.2), 12)}`);
w('# A pipe lying on the seabed adds no ground resistance at all, and that is the');
w('# right answer rather than a limitation. It is also the check that the shape');
w('# factor is the right one, because acosh(2H/D) has to vanish there.');
w('');
w('# Depth sweep on the PUBLISHED coated diameter of 8.625 in in the PUBLISHED wet');
w('# soil at k 1.2. The 4.0 ft row is the published build and is marked. Every');
w('# other row is a DERIVED SWEEP POINT.');
[0.359375, 0.4, 0.5, 1.0, 2.0, 3.0, 4.0, 6.0, 10.0, 20.0].forEach((h) => {
  const r = T.burialResistance({ odIn: 8.625, burialFt: h, kSoil: 1.2 });
  const ratio = (2 * h) / (8.625 / 12);
  const tag = h === 4.0 ? 'engine PUBLISHED DEPTH' : 'derived sweep point';
  const full = T.overallU({ layers: [PUB_STEEL, PUB_FOAM], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: h, kSoil: PUB_KSOIL, referenceIdIn: PUB_REF });
  const bur = full.resistances.find((x) => x.id === 'burial');
  w(`${tag}, burial to centreline ${f(h, 6)} ft: 2H/D = ${f(ratio, 8)}, acosh(2H/D) = ${f(Math.acosh(ratio), 10)}, ground resistance = ${f(r, 10)} hr ft degF/Btu per foot, U of the full buried build = ${f(full.uBtuHrFt2F, 10)}, ground share = ${bur ? f(bur.sharePct, 6) : '0.000000'} percent`);
});
w('# Doubling the depth does NOT double the ground term, because acosh grows like');
w('# a logarithm once 2H/D is past about two. Depth is cheap insulation at first');
w('# and then it is nothing.');
w(`derived, acosh(2H/D) at 2.0 ft over acosh at 1.0 ft = ${f(Math.acosh(2 * 2 / (8.625 / 12)) / Math.acosh(2 * 1 / (8.625 / 12)), 8)}`);
w(`derived, acosh(2H/D) at 20.0 ft over acosh at 10.0 ft = ${f(Math.acosh(2 * 20 / (8.625 / 12)) / Math.acosh(2 * 10 / (8.625 / 12)), 8)}`);
w('');
w('# Soil sweep at the PUBLISHED 4.0 ft depth on the PUBLISHED coated diameter.');
w('# The k 1.2 row is the published soil and is marked. The ground term is exactly');
w('# inverse in k, the same as any other conduction layer.');
[[1.2, 'wet soil / seabed'], [0.5, 'dry soil'], [0.9, 'concrete-like backfill'], [2.0, 'a wetter, denser seabed']].forEach(([k, label]) => {
  const r = T.burialResistance({ odIn: 8.625, burialFt: PUB_BURIAL_FT, kSoil: k });
  const full = T.overallU({ layers: [PUB_STEEL, PUB_FOAM], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: PUB_BURIAL_FT, kSoil: k, referenceIdIn: PUB_REF });
  const bur = full.resistances.find((x) => x.id === 'burial');
  const tag = k === 1.2 ? 'engine PUBLISHED SOIL' : 'derived sweep point';
  w(`${tag}, soil k ${f(k, 4)} Btu/(hr ft degF) (${label}): ground resistance = ${f(r, 10)} hr ft degF/Btu per foot, U of the full buried build = ${f(full.uBtuHrFt2F, 10)}, ground share = ${f(bur.sharePct, 6)} percent`);
});
w('');
w('# WHAT THE BURIAL TERM ASSUMES, and it is stated in the engine header. It is');
w('# the classical conduction shape factor for an ISOTHERMAL cylinder in a');
w('# SEMI-INFINITE medium, out of the method of images. That means one uniform');
w('# soil conductivity everywhere, a flat surface at ambient, no groundwater');
w('# movement, no seasonal front, and a burial measured to the CENTRELINE and not');
w('# to the top of pipe. None of those is checked by anything in the module.');
w(`derived, burial to the TOP of the coated pipe rather than the centreline, 4.0 ft read as 4.0 + D/2 = ${f(4.0 + 8.625 / 24, 6)} ft: ground resistance = ${f(T.burialResistance({ odIn: 8.625, burialFt: 4.0 + 8.625 / 24, kSoil: 1.2 }), 10)} hr ft degF/Btu per foot`);
w(`derived, the same quantity read to the centreline at 4.0 ft = ${f(T.burialResistance({ odIn: 8.625, burialFt: 4.0, kSoil: 1.2 }), 10)} hr ft degF/Btu per foot`);
w(`derived, relative difference of those two readings of the same trench = ${f(100 * (T.burialResistance({ odIn: 8.625, burialFt: 4.0 + 8.625 / 24, kSoil: 1.2 }) / T.burialResistance({ odIn: 8.625, burialFt: 4.0, kSoil: 1.2 }) - 1), 6)} percent`);
w('');

// ============================================================ SECTION 6
w('# SECTION 6: THE GROUND TERM THAT IS CAUGHT AND DROPPED RATHER THAN REFUSED');
w('# burialResistance returns NaN when the burial is shallower than half the');
w('# coated diameter, because 2H/D is then below 1 and acosh has no real value');
w('# there. overallU guards that NaN with Number.isFinite BEFORE pushing the term,');
w('# so the term never reaches the refusal three lines later that would have');
w('# caught it. A buried line comes back as an EXPOSED line, with ok true and no');
w('# note. Everything in this section is run on the PUBLISHED pipe, the PUBLISHED');
w('# films and the PUBLISHED wet soil, with only the trench depth moved.');
w('# Expert m02 owns this section.');
w(`derived, half the published coated diameter, D/2 on 8.625 in = ${f(8.625 / 24, 8)} ft. Below this the term is NaN.`);
[3.0, 0.3].forEach((h) => {
  const r = T.burialResistance({ odIn: 8.625, burialFt: h, kSoil: PUB_KSOIL });
  w(`engine, burialResistance at ${f(h, 2)} ft on the published coated diameter = ${f(r, 10)} (2H/D = ${f(2 * h / (8.625 / 12), 8)})`);
});
const GOOD_TRENCH = T.overallU({ layers: [PUB_STEEL, PUB_FOAM], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: 3.0, kSoil: PUB_KSOIL, referenceIdIn: PUB_REF });
const TYPO_TRENCH = T.overallU({ layers: [PUB_STEEL, PUB_FOAM], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: 0.3, kSoil: PUB_KSOIL, referenceIdIn: PUB_REF });
w(`derived, trench entered as 3.0 ft: ok = ${yn(GOOD_TRENCH.ok)}, terms returned = ${GOOD_TRENCH.resistances.length}, a burial term is present = ${yn(!!GOOD_TRENCH.resistances.find((x) => x.id === 'burial'))}, U = ${f(GOOD_TRENCH.uBtuHrFt2F, 10)} Btu/(hr ft2 degF)`);
w(`derived, the SAME trench entered as 0.3 ft: ok = ${yn(TYPO_TRENCH.ok)}, terms returned = ${TYPO_TRENCH.resistances.length}, a burial term is present = ${yn(!!TYPO_TRENCH.resistances.find((x) => x.id === 'burial'))}, U = ${f(TYPO_TRENCH.uBtuHrFt2F, 10)} Btu/(hr ft2 degF)`);
w(`derived, error in U from the dropped ground term = ${f(100 * (TYPO_TRENCH.uBtuHrFt2F / GOOD_TRENCH.uBtuHrFt2F - 1), 6)} percent, and it is returned with ok true and no note`);
w(`derived, ground share of the correct 3.0 ft stack, which is what was silently removed = ${f(GOOD_TRENCH.resistances.find((x) => x.id === 'burial').sharePct, 6)} percent`);
w(`derived, U of the SWALLOWED result against the engine's own no-burial build = ${f(TYPO_TRENCH.uBtuHrFt2F, 10)} against ${f(PUB_INS.res.uBtuHrFt2F, 10)}, identical to ${e(rel(TYPO_TRENCH.uBtuHrFt2F, PUB_INS.res.uBtuHrFt2F), 4)} relative`);
w('# That last line is the whole finding: the buried answer and the exposed answer');
w('# are the same number. Nothing in the return says a trench was asked for.');
w('');
w('# The same module refuses a bad LAYER properly. Two failures, one input class,');
w('# opposite treatment.');
const BAD_LAYER = T.overallU({ layers: [PUB_STEEL, { idIn: 6.625, odIn: 8.625, k: T.conductivity('aerogelBlanket') }], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: 0, kSoil: 0, referenceIdIn: PUB_REF });
w(`engine, a layer with an unresolvable conductivity: ok = ${yn(BAD_LAYER.ok)}, error = ${BAD_LAYER.error}`);
const INVERTED_LAYER = T.overallU({ layers: [{ idIn: 8.625, odIn: 6.625, k: 0.09 }], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: 0, kSoil: 0, referenceIdIn: PUB_REF });
w(`engine, a layer whose outside diameter is smaller than its inside: ok = ${yn(INVERTED_LAYER.ok)}, error = ${INVERTED_LAYER.error}`);
const NO_LAYERS = T.overallU({ layers: [], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H });
w(`engine, no layers at all: ok = ${yn(NO_LAYERS.ok)}, error = ${NO_LAYERS.error}`);
w(`engine, a bad TRENCH on the same pipe: ok = ${yn(TYPO_TRENCH.ok)}, error = ${TYPO_TRENCH.error === undefined ? 'none, the call succeeded' : TYPO_TRENCH.error}`);
w('# The conductivity helper header states the discipline the trench branch does');
w('# not follow: "A NaN propagates into a refusal; a plausible wrong number does');
w('# not." Here the NaN is caught and swallowed, and what comes back is a');
w('# plausible wrong number.');
w('');

// ============================================================ SECTION 7
w('# SECTION 7: WHAT A U IS REFERRED TO, ON ONE PHYSICAL LINE, TWO WAYS');
w('# THE SAME PHYSICAL LINE IS EXPRESSED TWICE HERE AND THE TWO NUMBERS ARE');
w('# DIFFERENT BY DESIGN. Nothing about the pipe changes between the two rows');
w('# below: the same layers, the same films, the same trench, the same total');
w('# resistance to the last figure. Only referenceIdIn moves, from the 6.065 in');
w('# bore to the 8.625 in coated outside diameter. U is a resistance divided by an');
w('# AREA, so naming a different area gives a different U for identical physics.');
w('# The engine reports which one it used, in referenceIdIn. Associate m02 owns');
w('# this section and Expert m05 prices it.');
const PUB_BUR_OD = T.overallU({ layers: [PUB_STEEL, PUB_FOAM], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: PUB_BURIAL_FT, kSoil: PUB_KSOIL, referenceIdIn: 8.625 });
w(`engine, published buried build referred to the 6.065 in BORE: U = ${f(PUB_BUR.res.uBtuHrFt2F, 12)} Btu/(hr ft2 degF), referenceIdIn = ${f(PUB_BUR.res.referenceIdIn, 3)} in, total resistance = ${f(PUB_BUR.res.totalResistance, 12)}`);
w(`engine, the SAME build referred to the 8.625 in COATED OUTSIDE DIAMETER: U = ${f(PUB_BUR_OD.uBtuHrFt2F, 12)} Btu/(hr ft2 degF), referenceIdIn = ${f(PUB_BUR_OD.referenceIdIn, 3)} in, total resistance = ${f(PUB_BUR_OD.totalResistance, 12)}`);
w(`derived, the two total resistances are identical to ${e(rel(PUB_BUR.res.totalResistance, PUB_BUR_OD.totalResistance), 4)} relative. The physics did not move.`);
w(`derived, ratio of the two U values = ${f(PUB_BUR.res.uBtuHrFt2F / PUB_BUR_OD.uBtuHrFt2F, 10)}`);
w(`derived, ratio of the two reference diameters, 8.625 / 6.065 = ${f(8.625 / 6.065, 10)}`);
w(`derived, difference between those two ratios = ${e(Math.abs(PUB_BUR.res.uBtuHrFt2F / PUB_BUR_OD.uBtuHrFt2F - 8.625 / 6.065), 4)}`);
w('# THE INVARIANT. U times its reference diameter is the same number whichever');
w('# reference is chosen, because that product is the conductance per foot of');
w('# pipe and a conductance per foot does not care what area you name.');
w(`derived, U times reference diameter, bore reference = ${f(PUB_BUR.res.uBtuHrFt2F * PUB_BUR.res.referenceIdIn / 12, 12)} Btu/(hr ft degF) per foot of pipe`);
w(`derived, U times reference diameter, coated outside diameter reference = ${f(PUB_BUR_OD.uBtuHrFt2F * PUB_BUR_OD.referenceIdIn / 12, 12)} Btu/(hr ft degF) per foot of pipe`);
w(`derived, U times reference diameter is the SAME on either reference, and pi times it is one over the total resistance = ${f(1 / PUB_BUR.res.totalResistance / Math.PI, 12)} Btu/(hr ft degF) per foot of pipe`);
w('');
w('# The same on the insulated build, so that the invariant reads as a rule.');
const PUB_INS_OD = T.overallU({ layers: [PUB_STEEL, PUB_FOAM], insideFilmH: PUB_IN_H, outsideFilmH: PUB_OUT_H, burialFt: 0, kSoil: 0, referenceIdIn: 8.625 });
w(`engine, published insulated build referred to the bore: U = ${f(PUB_INS.res.uBtuHrFt2F, 12)}, referenceIdIn = ${f(PUB_INS.res.referenceIdIn, 3)} in`);
w(`engine, published insulated build referred to the coated outside diameter: U = ${f(PUB_INS_OD.uBtuHrFt2F, 12)}, referenceIdIn = ${f(PUB_INS_OD.referenceIdIn, 3)} in`);
w(`derived, ratio of those two = ${f(PUB_INS.res.uBtuHrFt2F / PUB_INS_OD.uBtuHrFt2F, 10)}, against the diameter ratio ${f(8.625 / 6.065, 10)}`);
w('');
w('# THE OMISSION. relaxationLengthFt, steadyStateProfile and cooldownTime each');
w('# take a bare idIn. None of the three takes the overallU result, and none of');
w('# them can see referenceIdIn. The field is reported and no consumer in the');
w('# module accepts it, so keeping the pair together is the caller job and nothing');
w('# complains when the caller does not.');
w('');
// ============================================================ SECTION 8
w('# SECTION 8: WHAT A CONSUMER DOES WHEN IT TAKES THE OTHER REFERENCE');
w('# Same published fluid, 180.0 degF in, 40.0 degF ambient, 120000.0 lb/hr, Cp');
w('# 0.5, on the published buried build. Three rows: the pair kept together at the');
w('# bore, the pair kept together at the coated outside diameter, and the');
w('# OD-referred U handed to the consumer with the BORE diameter, which is');
w('# dimensionally consistent and raises no complaint anywhere. Expert m05 owns');
w('# this section.');
const refCase = (label, u, d) => {
  const lc = T.relaxationLengthFt({ massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: u, idIn: d });
  const p = T.steadyStateProfile({ lengthFt: 26400.0, inletTempF: PUB_INLET_F, ambientTempF: PUB_AMB_F, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: u, idIn: d });
  w(`derived, ${label}: U = ${f(u, 10)}, diameter handed to the consumer = ${f(d, 3)} in, relaxation length = ${f(lc, 6)} ft, ntu over 26400.0 ft = ${f(p.ntu, 10)}, arrival = ${f(p.arrivalTempF, 8)} degF`);
  return { lc, p };
};
const A = refCase('bore-referred U with the bore diameter, CORRECT', PUB_BUR.res.uBtuHrFt2F, 6.065);
const B = refCase('OD-referred U with the coated outside diameter, ALSO CORRECT', PUB_BUR_OD.uBtuHrFt2F, 8.625);
const C = refCase('OD-referred U with the BORE diameter, MIXED', PUB_BUR_OD.uBtuHrFt2F, 6.065);
w(`derived, the two correct routes agree on relaxation length to ${e(rel(A.lc, B.lc), 4)} relative and on arrival to ${e(Math.abs(A.p.arrivalTempF - B.p.arrivalTempF), 4)} degF`);
w(`derived, the mixed route is wrong on arrival by ${f(C.p.arrivalTempF - A.p.arrivalTempF, 8)} degF at 26400.0 ft`);
w(`derived, the mixed route is wrong on relaxation length by ${f(100 * (C.lc / A.lc - 1), 6)} percent`);
w(`derived, that percentage against the diameter ratio 8.625 / 6.065 = ${f(100 * (8.625 / 6.065 - 1), 6)} percent. It is exactly the reference ratio and nothing else.`);
w('');
w('# The error is an error in ntu, and ntu sits in an exponent, so its size in degF');
w('# depends on where the line already is on its own exponential. On the three');
w('# PUBLISHED lengths it runs from a few degF to more than fifteen:');
PUB_LENGTHS.forEach((L) => {
  const good = T.steadyStateProfile({ lengthFt: L, inletTempF: PUB_INLET_F, ambientTempF: PUB_AMB_F, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: PUB_BUR.res.uBtuHrFt2F, idIn: 6.065 });
  const bad = T.steadyStateProfile({ lengthFt: L, inletTempF: PUB_INLET_F, ambientTempF: PUB_AMB_F, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: PUB_BUR_OD.uBtuHrFt2F, idIn: 6.065 });
  w(`derived, at ${f(L, 1)} ft on the buried build: correct arrival = ${f(good.arrivalTempF, 8)} degF, mixed-reference arrival = ${f(bad.arrivalTempF, 8)} degF, error = ${f(bad.arrivalTempF - good.arrivalTempF, 8)} degF, correct ntu = ${f(good.ntu, 8)}, mixed ntu = ${f(bad.ntu, 8)}`);
});
w('');

// ============================================================ SECTION 9
w('# SECTION 9: BOTH MASSES, AND THE LAYERS THAT CARRY NONE');
w('# The module has exactly two mass helpers. pipeMassLbPerFt takes an annulus and');
w('# a density and returns lbm per foot; contentsMassLbPerFt takes a bore and a');
w('# fluid density and does the same. Both are geometry and nothing else. The');
w('# published cooldown case supplies the two densities used here: 490 lbm/ft3 for');
w('# steel, which is the engine default, and 55.0 lbm/ft3 for the contents.');
w('# Associate m05 owns this section.');
const PUB_STEEL_M = T.pipeMassLbPerFt({ idIn: 6.065, odIn: 6.625 });
const PUB_CONT_M = T.contentsMassLbPerFt({ idIn: 6.065, densityLbFt3: PUB_COOL_CONTENTS_RHO });
w(`engine, published pipe steel mass, 6.065 in to 6.625 in at ${f(T.STEEL_DENSITY_LB_FT3, 1)} lbm/ft3 = ${f(PUB_STEEL_M, 10)} lbm/ft`);
w(`engine, published contents mass, 6.065 in bore at ${f(PUB_COOL_CONTENTS_RHO, 1)} lbm/ft3 = ${f(PUB_CONT_M, 10)} lbm/ft`);
w(`derived, steel cross sectional area, (pi/4)(Do2 - Di2) = ${f((Math.PI / 4) * ((6.625 / 12) ** 2 - (6.065 / 12) ** 2), 10)} ft2`);
w(`derived, bore cross sectional area, (pi/4)Di2 = ${f((Math.PI / 4) * (6.065 / 12) ** 2, 10)} ft2`);
w(`derived, ratio of the steel mass to the contents mass on this pipe = ${f(PUB_STEEL_M / PUB_CONT_M, 8)}`);
w('# The cooldown header says leaving the pipe heat capacity out is "a common and');
w('# optimistic error: on an insulated small-bore line the steel can hold as much');
w('# heat as the oil in it". On this pipe it holds more mass than the contents do,');
w('# and once the two specific heats are applied the balance changes again.');
w(`derived, contents heat capacity per foot at Cp ${f(PUB_COOL_CONTENTS_CP, 2)} = ${f(PUB_CONT_M * PUB_COOL_CONTENTS_CP, 10)} Btu/(ft degF)`);
w(`derived, steel heat capacity per foot at Cp ${f(PUB_COOL_SHELL_CP, 2)} = ${f(PUB_STEEL_M * PUB_COOL_SHELL_CP, 10)} Btu/(ft degF)`);
w(`derived, total M Cp of the published cooldown case = ${f(PUB_CONT_M * PUB_COOL_CONTENTS_CP + PUB_STEEL_M * PUB_COOL_SHELL_CP, 10)} Btu/(ft degF)`);
w(`derived, contents share of that M Cp = ${f(100 * PUB_CONT_M * PUB_COOL_CONTENTS_CP / (PUB_CONT_M * PUB_COOL_CONTENTS_CP + PUB_STEEL_M * PUB_COOL_SHELL_CP), 6)} percent`);
w('');
w('# THE LAYERS THAT CARRY NONE. overallU takes an UNBOUNDED layer list.');
w('# cooldownTime has exactly two mass slots, contents and shell. There is no slot');
w('# for a coating, no helper that lumps one, and no warning anywhere when the');
w('# layer list is longer than two. On the published insulated build the foam');
w('# carries almost the whole resistance and, as the API reads, none of the mass.');
w(`derived, foam share of the published insulated resistance = ${f(foamOf(PUB_INS.res).sharePct, 6)} percent`);
w(`derived, foam share of the published buried resistance = ${f(foamOf(PUB_BUR.res).sharePct, 6)} percent`);
w(`derived, layers overallU accepted on the published insulated build = 2, mass slots cooldownTime offers = 2, of which the foam fits into = 0`);
w('teaching, syntactic polypropylene foam density taken as 44.0 lbm/ft3 and Cp 0.28 Btu/(lb degF). THESE ARE TEACHING NUMBERS. No golden publishes them and the engine has no catalog of them.');
const PUB_FOAM_M = T.pipeMassLbPerFt({ idIn: 6.625, odIn: 8.625, densityLbFt3: 44.0 });
w(`teaching, published pipe foam mass, 6.625 in to 8.625 in at 44.0 lbm/ft3 = ${f(PUB_FOAM_M, 10)} lbm/ft`);
w(`teaching, foam heat capacity per foot at Cp 0.28 = ${f(PUB_FOAM_M * 0.28, 10)} Btu/(ft degF)`);
w(`teaching, that as a fraction of the published cooldown M Cp = ${f(100 * PUB_FOAM_M * 0.28 / (PUB_CONT_M * PUB_COOL_CONTENTS_CP + PUB_STEEL_M * PUB_COOL_SHELL_CP), 6)} percent of it, and none of it is in the published cooldown at all`);
w('');
w('# The two mass helpers refuse what they cannot compute, and they do refuse.');
w(`engine, pipeMassLbPerFt with an outside diameter no larger than the inside = ${f(T.pipeMassLbPerFt({ idIn: 6.625, odIn: 6.625 }), 6)}`);
w(`engine, contentsMassLbPerFt with a zero density = ${f(T.contentsMassLbPerFt({ idIn: 6.065, densityLbFt3: 0 }), 6)}`);
w(`engine, contentsMassLbPerFt with a zero bore = ${f(T.contentsMassLbPerFt({ idIn: 0, densityLbFt3: 55 }), 6)}`);
w('# Those are NaN, and what cooldownTime does with a NaN mass is the SAME SHAPE');
w('# as what overallU does with a NaN trench. cooldownTime reads its masses as');
w('# (contents?.massLbPerFt || 0), and NaN is falsy in JavaScript, so a NaN mass');
w('# becomes a zero mass. If BOTH slots are NaN the total M Cp is zero and the');
w('# call is refused. If only ONE is, the term is silently dropped and the answer');
w('# comes back with ok true.');
const PUB_COOL_OK = T.cooldownTime({ contents: { massLbPerFt: PUB_CONT_M, cpBtuLbF: PUB_COOL_CONTENTS_CP }, shell: { massLbPerFt: PUB_STEEL_M, cpBtuLbF: PUB_COOL_SHELL_CP }, uBtuHrFt2F: PUB_INS.res.uBtuHrFt2F, idIn: PUB_REF, startTempF: PUB_COOL_START, ambientTempF: PUB_AMB_F, targetTempF: PUB_COOL_TARGET });
const PUB_COOL_BOTH_NAN = T.cooldownTime({ contents: { massLbPerFt: NaN, cpBtuLbF: PUB_COOL_CONTENTS_CP }, shell: { massLbPerFt: NaN, cpBtuLbF: PUB_COOL_SHELL_CP }, uBtuHrFt2F: PUB_INS.res.uBtuHrFt2F, idIn: PUB_REF, startTempF: PUB_COOL_START, ambientTempF: PUB_AMB_F, targetTempF: PUB_COOL_TARGET });
const PUB_COOL_ONE_NAN = T.cooldownTime({ contents: { massLbPerFt: NaN, cpBtuLbF: PUB_COOL_CONTENTS_CP }, shell: { massLbPerFt: PUB_STEEL_M, cpBtuLbF: PUB_COOL_SHELL_CP }, uBtuHrFt2F: PUB_INS.res.uBtuHrFt2F, idIn: PUB_REF, startTempF: PUB_COOL_START, ambientTempF: PUB_AMB_F, targetTempF: PUB_COOL_TARGET });
w(`derived, published cooldown with both masses good: ok = ${yn(PUB_COOL_OK.ok)}, no-touch time = ${f(PUB_COOL_OK.hours, 10)} hr, time constant = ${f(PUB_COOL_OK.timeConstantHr, 10)} hr`);
w(`derived, the same call with BOTH masses NaN: ok = ${yn(PUB_COOL_BOTH_NAN.ok)}, error = ${PUB_COOL_BOTH_NAN.error}`);
w(`derived, the same call with ONLY the contents mass NaN: ok = ${yn(PUB_COOL_ONE_NAN.ok)}, no-touch time = ${f(PUB_COOL_ONE_NAN.hours, 10)} hr, time constant = ${f(PUB_COOL_ONE_NAN.timeConstantHr, 10)} hr, note = ${PUB_COOL_ONE_NAN.note === undefined ? 'none' : PUB_COOL_ONE_NAN.note}`);
w(`derived, that dropped-mass no-touch time against the correct one = ${f(100 * (PUB_COOL_ONE_NAN.hours / PUB_COOL_OK.hours - 1), 6)} percent, returned with ok true and no note`);
w('');

// ============================================================ SECTION 10
w('# SECTION 10: THE PUBLISHED RELAXATION LENGTHS, GOLDEN AGAINST ENGINE');
w('# Lc = m Cp / (U pi D), the distance over which the fluid gives up 63 percent');
w('# of its excess temperature over ambient. Three published cases, all on the');
w('# published insulated U and the 6.065 in bore, with the mass rate doubled');
w('# between the first two and the heat capacity raised between the last two.');
w('# THE SAME QUANTITY IS COMPUTED TWO WAYS: the golden is the oracle in SI, the');
w('# engine is the shipped function in field units. Professional m01 owns this.');
GOLD.relaxation.forEach((c, i) => {
  const eng = T.relaxationLengthFt({ massRateLbHr: c.massRateLbHr, cpBtuLbF: c.cpBtuLbF, uBtuHrFt2F: c.uBtuHrFt2F, idIn: c.idIn });
  w(`golden relaxation case ${i + 1}: mass rate = ${f(c.massRateLbHr, 1)} lb/hr, Cp = ${f(c.cpBtuLbF, 2)} Btu/(lb degF), U = ${f(c.uBtuHrFt2F, 12)} Btu/(hr ft2 degF), bore = ${f(c.idIn, 3)} in, relaxation length = ${f(c.lengthFt, 8)} ft`);
  w(`engine relaxation case ${i + 1}: same inputs, relaxation length = ${f(eng, 8)} ft, relative difference to the golden = ${e(rel(eng, c.lengthFt), 6)}`);
});
w(`derived, relaxation length is exactly linear in mass rate: case 2 over case 1 = ${f(GOLD.relaxation[1].lengthFt / GOLD.relaxation[0].lengthFt, 10)}, against the mass rate ratio ${f(GOLD.relaxation[1].massRateLbHr / GOLD.relaxation[0].massRateLbHr, 10)}`);
w(`derived, and exactly linear in heat capacity: case 3 over case 2 = ${f(GOLD.relaxation[2].lengthFt / GOLD.relaxation[1].lengthFt, 10)}, against the Cp ratio ${f(GOLD.relaxation[2].cpBtuLbF / GOLD.relaxation[1].cpBtuLbF, 10)}`);
w('# It is also exactly inverse in U and in the bore diameter, which is why the');
w('# mixed-reference error carries straight through it.');
[[PUB_BARE.res.uBtuHrFt2F, 'published bare build'], [PUB_INS.res.uBtuHrFt2F, 'published insulated build'], [PUB_BUR.res.uBtuHrFt2F, 'published buried4ft build']].forEach(([u, label]) => {
  w(`derived, relaxation length at 120000.0 lb/hr and Cp 0.5 on the ${label}: U = ${f(u, 10)}, Lc = ${f(T.relaxationLengthFt({ massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: u, idIn: PUB_REF }), 8)} ft`);
});
w('# The relaxation length REFUSES rather than guessing. It is a bare NaN and not');
w('# an object, so a caller who does not check gets a NaN everywhere downstream.');
w(`engine, relaxationLengthFt with a zero U = ${f(T.relaxationLengthFt({ massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: 0, idIn: PUB_REF }), 6)}`);
w(`engine, relaxationLengthFt with a zero mass rate = ${f(T.relaxationLengthFt({ massRateLbHr: 0, cpBtuLbF: PUB_CP, uBtuHrFt2F: PUB_INS.res.uBtuHrFt2F, idIn: PUB_REF }), 6)}`);
w(`engine, relaxationLengthFt with a zero heat capacity = ${f(T.relaxationLengthFt({ massRateLbHr: PUB_MDOT, cpBtuLbF: 0, uBtuHrFt2F: PUB_INS.res.uBtuHrFt2F, idIn: PUB_REF }), 6)}`);
w('');
// ============================================================ SECTION 11
w('# SECTION 11: THE PUBLISHED ARRIVAL TEMPERATURES AND THEIR NTU');
w('# One fluid, 180.0 degF in against a 40.0 degF ambient at 120000.0 lb/hr and');
w('# Cp 0.5 through the published insulated build, at one mile, five miles and');
w('# twenty miles. NO PRESSURES ARE SET IN ANY PUBLISHED CASE, so the Joule-Thomson');
w('# term is exactly zero in every row here. Professional m01 owns this section.');
w(`golden, the relaxation length these three share = ${f(GOLD.profile.relaxationLengthFt, 8)} ft`);
w(`engine, the same relaxation length = ${f(T.relaxationLengthFt({ massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: GOLD.profile.uBtuHrFt2F, idIn: PUB_REF }), 8)} ft`);
GOLD.profile.points.forEach((pt, i) => {
  const eng = T.steadyStateProfile({ lengthFt: pt.lengthFt, inletTempF: PUB_INLET_F, ambientTempF: PUB_AMB_F, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: GOLD.profile.uBtuHrFt2F, idIn: PUB_REF });
  w(`golden profile point ${i + 1}: length = ${f(pt.lengthFt, 1)} ft, ntu = ${f(pt.ntu, 12)}, arrival = ${f(pt.arrivalTempF, 12)} degF`);
  w(`engine profile point ${i + 1}: length = ${f(pt.lengthFt, 1)} ft, ntu = ${f(eng.ntu, 12)}, arrival = ${f(eng.arrivalTempF, 12)} degF, relative difference in arrival = ${e(rel(eng.arrivalTempF, pt.arrivalTempF), 6)}`);
  w(`derived profile point ${i + 1}: exp(-ntu) = ${f(Math.exp(-pt.ntu), 12)}, excess over ambient retained = ${f(100 * Math.exp(-pt.ntu), 8)} percent, excess lost = ${f(100 * (1 - Math.exp(-pt.ntu)), 8)} percent`);
});
w('# NTU IS THE WHOLE STORY. It is the length measured in relaxation lengths, and');
w('# the arrival depends on nothing else once the inlet and the ambient are fixed.');
w(`derived, at ntu = 1 exactly the retained excess is exp(-1) = ${f(Math.exp(-1), 12)}, which is where the 63 percent in the module header comes from: ${f(100 * (1 - Math.exp(-1)), 8)} percent has been lost`);
[0.1, 0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0].forEach((n) => {
  w(`derived sweep point, ntu = ${f(n, 4)}: exp(-ntu) = ${f(Math.exp(-n), 12)}, arrival on a 180.0 degF inlet against a 40.0 degF ambient = ${f(PUB_AMB_F + (PUB_INLET_F - PUB_AMB_F) * Math.exp(-n), 10)} degF, excess over ambient remaining = ${f((PUB_INLET_F - PUB_AMB_F) * Math.exp(-n), 10)} degF`);
});
w('# A line much shorter than its relaxation length arrives hot whatever the');
w('# ambient. A line much longer than it arrives at ambient whatever it started');
w('# at. Past ntu 4 there is nothing left to insulate for.');
w('');

// ============================================================ SECTION 12
w('# SECTION 12: THE PUBLISHED PROFILE STATION BY STATION, AT THE LONGEST LENGTH');
w('# The engine returns 21 stations by default and the golden publishes only the');
w('# arrival, so this table is ENGINE on PUBLISHED inputs: the 105600.0 ft point,');
w('# 180.0 degF in, 40.0 degF ambient, 120000.0 lb/hr, Cp 0.5, published insulated');
w('# U, 6.065 in bore, and no pressures anywhere. The pPsia column is NaN in every');
w('# row for exactly that reason and it is printed rather than hidden.');
w('# Professional m05 owns this section.');
const PUB_PROF = T.steadyStateProfile({ lengthFt: 105600.0, inletTempF: PUB_INLET_F, ambientTempF: PUB_AMB_F, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: GOLD.profile.uBtuHrFt2F, idIn: PUB_REF });
w(`engine, published profile at 105600.0 ft: ok = ${yn(PUB_PROF.ok)}, stations returned = ${PUB_PROF.stations.length}, relaxation length = ${f(PUB_PROF.relaxationLengthFt, 8)} ft, ntu = ${f(PUB_PROF.ntu, 12)}, arrival = ${f(PUB_PROF.arrivalTempF, 12)} degF`);
PUB_PROF.stations.forEach((st, i) => {
  w(`engine station ${String(i).padStart(2, '0')}: x = ${f(st.xFt, 2)} ft, temperature = ${f(st.tempF, 10)} degF, pressure = ${f(st.pPsia, 4)} psia, excess over ambient = ${f(st.tempF - PUB_AMB_F, 10)} degF, fraction of the inlet excess remaining = ${f((st.tempF - PUB_AMB_F) / (PUB_INLET_F - PUB_AMB_F), 12)}`);
});
w('# WHERE THE LINE IS COLDEST is the far end and only the far end, because the');
w('# profile is a monotone exponential with nothing else in it. That is true of');
w('# the published cases because they set no pressures. It stops being true the');
w('# moment a Joule-Thomson term is added, and it was never true of a real line');
w('# with a seabed that changes depth.');
w(`derived, station spacing on a 21 station profile over 105600.0 ft = ${f(105600.0 / 20, 4)} ft`);
w(`derived, temperature drop over the FIRST station interval = ${f(PUB_PROF.stations[0].tempF - PUB_PROF.stations[1].tempF, 10)} degF`);
w(`derived, temperature drop over the LAST station interval = ${f(PUB_PROF.stations[19].tempF - PUB_PROF.stations[20].tempF, 10)} degF`);
w(`derived, ratio of those two drops = ${f((PUB_PROF.stations[0].tempF - PUB_PROF.stations[1].tempF) / (PUB_PROF.stations[19].tempF - PUB_PROF.stations[20].tempF), 8)}`);
w('# That ratio is NOT exp(ntu). The two intervals are equal in length, so each');
w('# drop carries the same (1 - exp(-dx/Lc)) factor and the ratio is the ratio of');
w('# the two starting excesses, which is exp(ntu x 19/20), the distance between');
w('# the start of the first interval and the start of the last.');
w(`derived, exp(ntu x 19 / 20) on this line, which is what that ratio has to be = ${f(Math.exp(PUB_PROF.ntu * 19 / 20), 8)}`);
w(`derived, exp(ntu) on this line, for contrast, which is the ratio the whole-line excess falls by = ${f(Math.exp(PUB_PROF.ntu), 8)}`);
w('');
w('# HOW MANY STATIONS THE PROFILE NEEDS. The station count is a RESOLUTION');
w('# setting and nothing more: the arrival is a closed form and does not move.');
w('# This is a contiguous slice, coarsest first, and the ugly two station row is');
w('# kept rather than dropped because it is the one that proves the point.');
[2, 3, 5, 11, 21, 51, 101, 501].forEach((n) => {
  const p = T.steadyStateProfile({ lengthFt: 105600.0, inletTempF: PUB_INLET_F, ambientTempF: PUB_AMB_F, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: GOLD.profile.uBtuHrFt2F, idIn: PUB_REF, nStations: n });
  w(`derived sweep point, nStations = ${String(n).padStart(3)}: stations returned = ${String(p.stations.length).padStart(3)}, arrival = ${f(p.arrivalTempF, 14)} degF, difference from the 21 station arrival = ${e(Math.abs(p.arrivalTempF - PUB_PROF.arrivalTempF), 4)} degF`);
});
w('# Every row is the same number to the last figure. Refining a profile buys');
w('# resolution in the middle of the line and buys nothing at the end of it.');
w('');
w('# WHAT THE PROFILE REFUSES.');
const NO_LEN = T.steadyStateProfile({ lengthFt: 0, inletTempF: PUB_INLET_F, ambientTempF: PUB_AMB_F, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: GOLD.profile.uBtuHrFt2F, idIn: PUB_REF });
w(`engine, steadyStateProfile with a zero length: ok = ${yn(NO_LEN.ok)}, error = ${NO_LEN.error}`);
const NO_U = T.steadyStateProfile({ lengthFt: 105600.0, inletTempF: PUB_INLET_F, ambientTempF: PUB_AMB_F, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: 0, idIn: PUB_REF });
w(`engine, steadyStateProfile with a zero U: ok = ${yn(NO_U.ok)}, error = ${NO_U.error}`);
const COLD_IN = T.steadyStateProfile({ lengthFt: 105600.0, inletTempF: 20.0, ambientTempF: PUB_AMB_F, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: GOLD.profile.uBtuHrFt2F, idIn: PUB_REF });
w(`engine, steadyStateProfile with an inlet 20.0 degF BELOW the 40.0 degF ambient: ok = ${yn(COLD_IN.ok)}, arrival = ${f(COLD_IN.arrivalTempF, 10)} degF`);
w('# That last one is not a refusal and should not be. A line colder than its');
w('# surroundings warms towards them on the same exponential, and the engine');
w('# handles it correctly with no special case. It is the one direction of this');
w('# balance that needs none.');
w('');

// ============================================================ SECTION 13
w('# SECTION 13: TEACHING LINE AKASO SPUR, THE WHOLE DEFINITION');
w('# EVERY NUMBER IN THIS SECTION IS A TEACHING NUMBER. No golden publishes any');
w('# of it, no oracle has checked any of it, and it is not a real line. It exists');
w('# because the published cases set no pressures, carry no coating, sit in no');
w('# trench that can be got wrong, and have no hydrate boundary, so four things');
w('# this course has to teach cannot be shown on them at all. Say TEACHING LINE');
w('# whenever you quote from it.');
w(`teaching, ${TL.name} geometry: bore = ${f(TL.layers[0].idIn, 3)} in, steel wall to ${f(TL.layers[0].odIn, 3)} in at k ${f(TL.layers[0].k, 2)}, polyurethane foam to ${f(TL.layers[1].odIn, 3)} in at k ${f(TL.layers[1].k, 3)}, concrete weight coat to ${f(TL.layers[2].odIn, 3)} in at k ${f(TL.layers[2].k, 2)}`);
w(`teaching, ${TL.name} wall thicknesses: steel ${f((TL.layers[0].odIn - TL.layers[0].idIn) / 2, 4)} in, foam ${f((TL.layers[1].odIn - TL.layers[1].idIn) / 2, 4)} in, weight coat ${f((TL.layers[2].odIn - TL.layers[2].idIn) / 2, 4)} in`);
w(`teaching, ${TL.name} boundary: inside film ${f(TL.insideFilmH, 1)} Btu/(hr ft2 degF) (flowing multiphase), outside film ${f(TL.outsideFilmH, 1)} Btu/(hr ft2 degF) (seabed with current), buried ${f(TL.burialFt, 2)} ft to centreline in wet soil at k ${f(TL.kSoil, 2)}`);
w(`teaching, ${TL.name} reference diameters offered: bore ${f(TL.refBore, 3)} in and coated outside diameter ${f(TL.refCoatedOd, 3)} in`);
w(`teaching, ${TL.name} fluid: ${f(TL.massRateLbHr, 1)} lb/hr, Cp ${f(TL.cpBtuLbF, 3)} Btu/(lb degF), inlet ${f(TL.inletTempF, 2)} degF, seabed ${f(TL.seabedTempF, 2)} degF, length ${f(TL.lengthFt, 1)} ft`);
w(`teaching, ${TL.name} pressures: inlet ${f(TL.inletPsia, 1)} psia, outlet ${f(TL.outletPsia, 1)} psia, pressure drop ${f(TL_DP, 1)} psi, Joule-Thomson coefficient ${f(TL.jtCoeffFPerPsi, 4)} degF/psi`);
w(`teaching, ${TL.name} HYDRATE BOUNDARY, A LABORATORY INPUT AND NOT AN ENGINE OUTPUT: ${f(TL.hydrateFlowingF, 2)} degF flowing, ${f(TL.hydrateShutInF, 2)} degF once the line packs up after a shutdown`);
w(`teaching, ${TL.name} masses: contents at ${f(TL.contentsRhoLbFt3, 2)} lbm/ft3 and Cp ${f(TL.contentsCp, 3)}, steel at ${f(T.STEEL_DENSITY_LB_FT3, 1)} lbm/ft3 and Cp ${f(TL.steelCp, 3)}, foam at ${f(TL.foamRhoLbFt3, 2)} lbm/ft3 and Cp ${f(TL.foamCp, 3)}, weight coat at ${f(TL.coatRhoLbFt3, 2)} lbm/ft3 and Cp ${f(TL.coatCp, 3)}`);
w(`teaching, ${TL.name} produced water ${f(TL.waterRateBpd, 1)} bbl/d, shut-in subcooling to kill ${f(TL.subcoolingF, 2)} degF, safety margin ${f(TL.safetyMarginF, 2)} degF, lean methanol ${f(TL.leanMeohWtPct, 2)} weight percent, lean MEG ${f(TL.leanMegWtPct, 2)} weight percent`);
w('');
w('# The resistance stack of the teaching line, so that the shares from the');
w('# published pipe can be read against a build with a coating and a trench on it.');
const TL_U = T.overallU({ layers: TL.layers, insideFilmH: TL.insideFilmH, outsideFilmH: TL.outsideFilmH, burialFt: TL.burialFt, kSoil: TL.kSoil, referenceIdIn: TL.refBore });
const TL_U_OD = T.overallU({ layers: TL.layers, insideFilmH: TL.insideFilmH, outsideFilmH: TL.outsideFilmH, burialFt: TL.burialFt, kSoil: TL.kSoil, referenceIdIn: TL.refCoatedOd });
stack(`TEACHING LINE ${TL.name}, referred to the ${f(TL.refBore, 3)} in bore`, TL_U, 'teaching');
w('');
stack(`TEACHING LINE ${TL.name}, the SAME stack referred to the ${f(TL.refCoatedOd, 3)} in coated outside diameter`, TL_U_OD, 'teaching');
w(`teaching, ratio of those two U values = ${f(TL_U.uBtuHrFt2F / TL_U_OD.uBtuHrFt2F, 10)}, against the diameter ratio ${f(TL.refCoatedOd / TL.refBore, 10)}`);
w(`teaching, U times reference diameter, both references = ${f(TL_U.uBtuHrFt2F * TL.refBore / 12, 12)} and ${f(TL_U_OD.uBtuHrFt2F * TL.refCoatedOd / 12, 12)} Btu/(hr ft degF) per foot`);
w('');
w('# The same teaching line with the foam taken out and the weight coat carried');
w('# from the steel wall straight to the same 16.750 in outside diameter, so the');
w('# line is the same size on the outside. The coat is now a thicker layer as well');
w('# as a larger share, so BOTH its resistance and its share move, and the trench');
w('# term, which did not move at all, goes from a third of the stack to more than');
w('# three quarters of it.');
const TL_NOFOAM = T.overallU({ layers: [TL.layers[0], { idIn: 10.75, odIn: 16.75, k: 0.9, label: 'concrete weight coat' }], insideFilmH: TL.insideFilmH, outsideFilmH: TL.outsideFilmH, burialFt: TL.burialFt, kSoil: TL.kSoil, referenceIdIn: TL.refBore });
stack(`TEACHING LINE ${TL.name}, FOAM REMOVED, weight coat carried straight from the steel`, TL_NOFOAM, 'teaching');
w(`teaching, U ratio without the foam to with it = ${f(TL_NOFOAM.uBtuHrFt2F / TL_U.uBtuHrFt2F, 8)}`);
w(`teaching, weight coat resistance with the foam present = ${f(TL_U.resistances.find((x) => x.id === 'layer2').r, 10)}, share ${f(TL_U.resistances.find((x) => x.id === 'layer2').sharePct, 6)} percent`);
w(`teaching, weight coat resistance with the foam removed = ${f(TL_NOFOAM.resistances.find((x) => x.id === 'layer1').r, 10)}, share ${f(TL_NOFOAM.resistances.find((x) => x.id === 'layer1').sharePct, 6)} percent`);
w(`teaching, trench resistance in both builds = ${f(TL_U.resistances.find((x) => x.id === 'burial').r, 10)} and ${f(TL_NOFOAM.resistances.find((x) => x.id === 'burial').r, 10)}, shares ${f(TL_U.resistances.find((x) => x.id === 'burial').sharePct, 6)} percent and ${f(TL_NOFOAM.resistances.find((x) => x.id === 'burial').sharePct, 6)} percent`);
w('');
w('# THE TRENCH THAT IS SWALLOWED, on the teaching line, where the coated diameter');
w('# is large enough that a plausible typo falls below D/2.');
w(`teaching, half the ${TL.name} coated diameter, D/2 on ${f(TL.refCoatedOd, 3)} in = ${f(TL.refCoatedOd / 24, 8)} ft`);
const TL_TYPO = T.overallU({ layers: TL.layers, insideFilmH: TL.insideFilmH, outsideFilmH: TL.outsideFilmH, burialFt: 0.3, kSoil: TL.kSoil, referenceIdIn: TL.refBore });
w(`teaching, the ${f(TL.burialFt, 2)} ft trench entered as 0.3 ft: ok = ${yn(TL_TYPO.ok)}, terms returned = ${TL_TYPO.resistances.length} against ${TL_U.resistances.length}, a burial term is present = ${yn(!!TL_TYPO.resistances.find((x) => x.id === 'burial'))}, U = ${f(TL_TYPO.uBtuHrFt2F, 10)} against the correct ${f(TL_U.uBtuHrFt2F, 10)}`);
w(`teaching, error in U from that one swallowed term = ${f(100 * (TL_TYPO.uBtuHrFt2F / TL_U.uBtuHrFt2F - 1), 6)} percent, with ok true and no note`);
w('');

// ============================================================ SECTION 14
w('# SECTION 14: THE TEACHING LINE ENERGY BALANCE, HEAT LOSS ONLY');
w('# TEACHING LINE. This is the AKASO SPUR profile with NO pressures passed, so');
w('# the Joule-Thomson term is zero and this is the pure exponential. The three');
w('# ways of applying the Joule-Thomson term are set against this row in SECTION 27, so');
w('# this is the baseline the whole Expert argument is measured from.');
w('# Professional m01 owns this section.');
const TL_LC = T.relaxationLengthFt({ massRateLbHr: TL.massRateLbHr, cpBtuLbF: TL.cpBtuLbF, uBtuHrFt2F: TL_U.uBtuHrFt2F, idIn: TL.refBore });
const TL_HEAT = T.steadyStateProfile({ lengthFt: TL.lengthFt, inletTempF: TL.inletTempF, ambientTempF: TL.seabedTempF, massRateLbHr: TL.massRateLbHr, cpBtuLbF: TL.cpBtuLbF, uBtuHrFt2F: TL_U.uBtuHrFt2F, idIn: TL.refBore });
w(`teaching, ${TL.name} overall U referred to the bore = ${f(TL_U.uBtuHrFt2F, 12)} Btu/(hr ft2 degF)`);
w(`teaching, ${TL.name} relaxation length = ${f(TL_LC, 8)} ft`);
w(`teaching, ${TL.name} ntu over ${f(TL.lengthFt, 1)} ft = ${f(TL_HEAT.ntu, 12)}`);
w(`teaching, ${TL.name} exp(-ntu) = ${f(Math.exp(-TL_HEAT.ntu), 12)}`);
w(`teaching, ${TL.name} inlet excess over the seabed = ${f(TL.inletTempF - TL.seabedTempF, 4)} degF`);
w(`teaching, ${TL.name} arrival with heat loss only = ${f(TL_HEAT.arrivalTempF, 12)} degF`);
w(`teaching, ${TL.name} arrival excess over the seabed = ${f(TL_HEAT.arrivalTempF - TL.seabedTempF, 10)} degF`);
w(`teaching, ${TL.name} margin against the ${f(TL.hydrateFlowingF, 2)} degF flowing hydrate boundary, heat loss only = ${f(TL_HEAT.arrivalTempF - TL.hydrateFlowingF, 10)} degF OUTSIDE the hydrate region`);
w(`teaching, ${TL.name} stations returned = ${TL_HEAT.stations.length}, station spacing = ${f(TL.lengthFt / 20, 2)} ft`);
TL_HEAT.stations.forEach((st, i) => {
  if (i % 2 !== 0 && i !== TL_HEAT.stations.length - 1) return;
  w(`teaching station ${String(i).padStart(2, '0')}: x = ${f(st.xFt, 2)} ft, temperature = ${f(st.tempF, 10)} degF, excess over the seabed = ${f(st.tempF - TL.seabedTempF, 10)} degF, margin against the flowing boundary = ${f(st.tempF - TL.hydrateFlowingF, 10)} degF`);
});
w('# Only the even stations are listed, so a lesson quoting from this table must');
w('# say which station it took. The arrival is station 20 and it is printed above');
w('# on its own line.');
w(`teaching, the station at which this line first falls below the ${f(TL.hydrateFlowingF, 2)} degF flowing boundary with heat loss only = none of the 21, the coldest point is the arrival at ${f(TL_HEAT.arrivalTempF, 8)} degF`);
w('');
// ============================================================ SECTION 15
w('# SECTION 15: THE INVERSE, THE U A TARGET ARRIVAL NEEDS, AND WHERE IT REFUSES');
w('# uForArrivalTemp inverts the same exponential: U = m Cp ln((Tin - Ta)/(Tt -');
w('# Ta)) / (pi D L). It returns the ntu the target implies alongside the U, which');
w('# is the same ntu the forward profile would report. Both PUBLISHED and TEACHING');
w('# cases are here and each row says which. Professional m02 owns this section.');
w('# THE PUBLISHED FLUID, 180.0 degF in against a 40.0 degF ambient at 120000.0');
w('# lb/hr and Cp 0.5 through the 6.065 in bore over 26400.0 ft.');
[160.0, 140.0, 120.0, 100.0, 80.0, 60.0, 45.0, 41.0, 40.0, 39.0, 180.0, 185.0].forEach((tgt) => {
  const r = T.uForArrivalTemp({ lengthFt: 26400.0, inletTempF: PUB_INLET_F, ambientTempF: PUB_AMB_F, targetTempF: tgt, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, idIn: PUB_REF });
  if (!r.ok) { w(`derived, target arrival ${f(tgt, 2)} degF: REFUSED, reason = ${r.reason}`); return; }
  const back = T.steadyStateProfile({ lengthFt: 26400.0, inletTempF: PUB_INLET_F, ambientTempF: PUB_AMB_F, massRateLbHr: PUB_MDOT, cpBtuLbF: PUB_CP, uBtuHrFt2F: r.uBtuHrFt2F, idIn: PUB_REF });
  w(`derived, target arrival ${f(tgt, 2)} degF: U needed = ${f(r.uBtuHrFt2F, 12)} Btu/(hr ft2 degF), ntu implied = ${f(r.ntu, 12)}, forward profile on that U arrives at ${f(back.arrivalTempF, 12)} degF, round trip error = ${e(Math.abs(back.arrivalTempF - tgt), 4)} degF`);
});
w('# THE TWO REFUSALS ARE DIFFERENT REFUSALS AND THE MESSAGES SAY SO. A target at');
w('# or below ambient is a physical impossibility, no insulation reaches it. A');
w('# target at or above the inlet is not a cooling problem at all. Read the');
w('# 40.00 and 39.00 rows against the 180.00 and 185.00 rows above.');
w('');
w('# The same inverse on the TEACHING LINE, against its own hydrate boundary and a');
w('# band of targets around it.');
[100.0, 90.0, 80.0, TL.hydrateFlowingF, 60.0, 50.0].forEach((tgt) => {
  const r = T.uForArrivalTemp({ lengthFt: TL.lengthFt, inletTempF: TL.inletTempF, ambientTempF: TL.seabedTempF, targetTempF: tgt, massRateLbHr: TL.massRateLbHr, cpBtuLbF: TL.cpBtuLbF, idIn: TL.refBore });
  if (!r.ok) { w(`teaching, ${TL.name} target arrival ${f(tgt, 2)} degF: REFUSED, reason = ${r.reason}`); return; }
  w(`teaching, ${TL.name} target arrival ${f(tgt, 2)} degF: U needed = ${f(r.uBtuHrFt2F, 12)} Btu/(hr ft2 degF), ntu implied = ${f(r.ntu, 12)}, ratio to the U this line actually has = ${f(r.uBtuHrFt2F / TL_U.uBtuHrFt2F, 8)}`);
});
w(`teaching, ${TL.name} actual U = ${f(TL_U.uBtuHrFt2F, 12)}, and the U needed for the ${f(TL.hydrateFlowingF, 2)} degF boundary is above it, which is the same statement as the arrival being above the boundary`);
w('');

// ============================================================ SECTION 16
w('# SECTION 16: THE PUBLISHED COOLDOWN, GOLDEN AGAINST ENGINE, STATION BY STATION');
w('# Lumped capacitance after a shutdown: (M Cp) dT/dt = -U A (T - Ta), so the');
w('# time to fall from a start to a target is tau ln((T0 - Ta)/(Tt - Ta)) with tau');
w('# = M Cp / (U A). ONE published case: 150.0 degF start, 40.0 degF ambient, 70.0');
w('# degF target, through the published insulated U on the 6.065 in bore, with the');
w('# contents at 55.0 lbm/ft3 and Cp 0.5 and the steel shell at 490 lbm/ft3 and Cp');
w('# 0.11. THE SAME QUANTITY IS COMPUTED TWO WAYS: golden in SI seconds, engine in');
w('# field hours. Professional m03 owns this section.');
w(`golden, published cooldown no-touch time = ${f(GOLD.cooldown.hours, 12)} hr`);
w(`engine, published cooldown no-touch time = ${f(PUB_COOL_OK.hours, 12)} hr, relative difference = ${e(rel(PUB_COOL_OK.hours, GOLD.cooldown.hours), 6)}`);
w(`golden, published cooldown time constant = ${f(GOLD.cooldown.timeConstantHr, 12)} hr`);
w(`engine, published cooldown time constant = ${f(PUB_COOL_OK.timeConstantHr, 12)} hr, relative difference = ${e(rel(PUB_COOL_OK.timeConstantHr, GOLD.cooldown.timeConstantHr), 6)}`);
w(`golden, the U the published cooldown uses = ${f(GOLD.cooldown.uBtuHrFt2F, 12)} Btu/(hr ft2 degF), which is the published insulated build`);
w(`derived, U A per foot of pipe = ${f(PUB_INS.res.uBtuHrFt2F * Math.PI * (PUB_REF / 12), 12)} Btu/(hr ft degF)`);
w(`derived, M Cp of this case = ${f(PUB_CONT_M * PUB_COOL_CONTENTS_CP + PUB_STEEL_M * PUB_COOL_SHELL_CP, 12)} Btu/(ft degF)`);
w(`derived, tau = M Cp / (U A) = ${f((PUB_CONT_M * PUB_COOL_CONTENTS_CP + PUB_STEEL_M * PUB_COOL_SHELL_CP) / (PUB_INS.res.uBtuHrFt2F * Math.PI * (PUB_REF / 12)), 12)} hr`);
w(`derived, the log term, ln((150.0 - 40.0)/(70.0 - 40.0)) = ${f(Math.log((PUB_COOL_START - PUB_AMB_F) / (PUB_COOL_TARGET - PUB_AMB_F)), 12)}`);
w(`derived, tau times that log term = ${f(PUB_COOL_OK.timeConstantHr * Math.log((PUB_COOL_START - PUB_AMB_F) / (PUB_COOL_TARGET - PUB_AMB_F)), 12)} hr`);
w(`derived, no-touch time in time constants = ${f(PUB_COOL_OK.hours / PUB_COOL_OK.timeConstantHr, 12)}`);
w('# The station table runs to 1.5 times the answer, so the last station is always');
w(`# below the target. Stations returned = ${PUB_COOL_OK.stations.length}.`);
PUB_COOL_OK.stations.forEach((st, i) => {
  if (i % 2 !== 0 && i !== PUB_COOL_OK.stations.length - 1) return;
  w(`engine cooldown station ${String(i).padStart(2, '0')}: t = ${f(st.hours, 8)} hr, temperature = ${f(st.tempF, 10)} degF, excess over ambient = ${f(st.tempF - PUB_AMB_F, 10)} degF`);
});
w('# The cooldown U here is the FLOWING U. A shut-in line has a stagnant bore and');
w('# its inside film falls from 250 to something near the catalog stagnant value.');
w('# The engine will take whichever U it is given and nothing in cooldownTime asks');
w('# whether the U it got was measured on a flowing line.');
const PUB_COOL_STAG = T.cooldownTime({ contents: { massLbPerFt: PUB_CONT_M, cpBtuLbF: PUB_COOL_CONTENTS_CP }, shell: { massLbPerFt: PUB_STEEL_M, cpBtuLbF: PUB_COOL_SHELL_CP }, uBtuHrFt2F: PUB_STAG.uBtuHrFt2F, idIn: PUB_REF, startTempF: PUB_COOL_START, ambientTempF: PUB_AMB_F, targetTempF: PUB_COOL_TARGET });
w(`derived, the same cooldown through the STAGNANT-BORE U of ${f(PUB_STAG.uBtuHrFt2F, 10)}: no-touch time = ${f(PUB_COOL_STAG.hours, 10)} hr, time constant = ${f(PUB_COOL_STAG.timeConstantHr, 10)} hr`);
w(`derived, that against the flowing-U answer = ${f(PUB_COOL_STAG.hours / PUB_COOL_OK.hours, 8)} times longer`);
w('');
// ============================================================ SECTION 17
w('# SECTION 17: THE TEACHING LINE COOLDOWN, THE SAME LINE WITH TWO DIFFERENT MASSES');
w('# THE SAME QUANTITY IS COMPUTED TWO WAYS HERE AND THEY ARE LABELLED');
w('# DIFFERENTLY. The API reading is what cooldownTime signature leads a caller to:');
w('# contents in one slot, the steel shell in the other, and no slot for a coating.');
w('# The lumped reading puts the foam and the weight coat into the shell slot by');
w('# hand, which is the only way the API allows it. Both are the same line at the');
w('# same U. Professional m03 owns this section.');
const TL_CONT_M = T.contentsMassLbPerFt({ idIn: TL.refBore, densityLbFt3: TL.contentsRhoLbFt3 });
const TL_STEEL_M = T.pipeMassLbPerFt({ idIn: TL.layers[0].idIn, odIn: TL.layers[0].odIn });
const TL_FOAM_M = T.pipeMassLbPerFt({ idIn: TL.layers[1].idIn, odIn: TL.layers[1].odIn, densityLbFt3: TL.foamRhoLbFt3 });
const TL_COAT_M = T.pipeMassLbPerFt({ idIn: TL.layers[2].idIn, odIn: TL.layers[2].odIn, densityLbFt3: TL.coatRhoLbFt3 });
w(`teaching, ${TL.name} contents mass = ${f(TL_CONT_M, 10)} lbm/ft at ${f(TL.contentsRhoLbFt3, 2)} lbm/ft3`);
w(`teaching, ${TL.name} steel mass = ${f(TL_STEEL_M, 10)} lbm/ft at ${f(T.STEEL_DENSITY_LB_FT3, 1)} lbm/ft3`);
w(`teaching, ${TL.name} foam mass = ${f(TL_FOAM_M, 10)} lbm/ft at ${f(TL.foamRhoLbFt3, 2)} lbm/ft3`);
w(`teaching, ${TL.name} weight coat mass = ${f(TL_COAT_M, 10)} lbm/ft at ${f(TL.coatRhoLbFt3, 2)} lbm/ft3`);
w(`teaching, ${TL.name} mass the API reading carries = ${f(TL_CONT_M + TL_STEEL_M, 10)} lbm/ft, mass it leaves out = ${f(TL_FOAM_M + TL_COAT_M, 10)} lbm/ft`);
w(`teaching, ${TL.name} resistance share of the two layers the API reading leaves out = ${f(TL_U.resistances.find((x) => x.id === 'layer1').sharePct + TL_U.resistances.find((x) => x.id === 'layer2').sharePct, 6)} percent`);
const mcpApi = TL_CONT_M * TL.contentsCp + TL_STEEL_M * TL.steelCp;
const mcpFull = mcpApi + TL_FOAM_M * TL.foamCp + TL_COAT_M * TL.coatCp;
w(`teaching, ${TL.name} M Cp on the API reading = ${f(mcpApi, 10)} Btu/(ft degF)`);
w(`teaching, ${TL.name} M Cp on the lumped reading = ${f(mcpFull, 10)} Btu/(ft degF)`);
w(`teaching, ${TL.name} ratio of those two heat capacities = ${f(mcpFull / mcpApi, 8)}`);
const TL_COOL_START = 120.0;
const coolApi = T.cooldownTime({ contents: { massLbPerFt: TL_CONT_M, cpBtuLbF: TL.contentsCp }, shell: { massLbPerFt: TL_STEEL_M, cpBtuLbF: TL.steelCp }, uBtuHrFt2F: TL_U.uBtuHrFt2F, idIn: TL.refBore, startTempF: TL_COOL_START, ambientTempF: TL.seabedTempF, targetTempF: TL.hydrateFlowingF });
const coolFull = T.cooldownTime({ contents: { massLbPerFt: TL_CONT_M, cpBtuLbF: TL.contentsCp }, shell: { massLbPerFt: TL_STEEL_M + TL_FOAM_M * (TL.foamCp / TL.steelCp) + TL_COAT_M * (TL.coatCp / TL.steelCp), cpBtuLbF: TL.steelCp }, uBtuHrFt2F: TL_U.uBtuHrFt2F, idIn: TL.refBore, startTempF: TL_COOL_START, ambientTempF: TL.seabedTempF, targetTempF: TL.hydrateFlowingF });
w(`teaching, ${TL.name} cooldown from ${f(TL_COOL_START, 2)} degF to the ${f(TL.hydrateFlowingF, 2)} degF flowing boundary against a ${f(TL.seabedTempF, 2)} degF seabed`);
w(`teaching, API READING: no-touch time = ${f(coolApi.hours, 10)} hr, time constant = ${f(coolApi.timeConstantHr, 10)} hr, stations = ${coolApi.stations.length}`);
w(`teaching, LUMPED READING, insulation and weight coat folded into the shell slot at their own heat capacities: no-touch time = ${f(coolFull.hours, 10)} hr, time constant = ${f(coolFull.timeConstantHr, 10)} hr`);
w(`teaching, ratio of the lumped no-touch time to the API one = ${f(coolFull.hours / coolApi.hours, 10)}`);
w(`teaching, ratio of the two time constants = ${f(coolFull.timeConstantHr / coolApi.timeConstantHr, 10)}`);
w(`teaching, difference in no-touch time = ${f(coolFull.hours - coolApi.hours, 10)} hr, which the API reading gives away`);
w('# The two ratios are the same number because the log term is identical in both:');
w('# only M Cp moved. That is why the whole finding can be stated as a ratio of');
w('# heat capacities and needs no second temperature.');
w(`teaching, the shared log term, ln((${f(TL_COOL_START, 1)} - ${f(TL.seabedTempF, 1)})/(${f(TL.hydrateFlowingF, 1)} - ${f(TL.seabedTempF, 1)})) = ${f(Math.log((TL_COOL_START - TL.seabedTempF) / (TL.hydrateFlowingF - TL.seabedTempF)), 10)}`);
w('# On this GAS line the contents carry about a quarter of the heat capacity the');
w('# API reading sees and the steel carries the rest. On the PUBLISHED liquid-');
w('# filled case the split runs the other way. Neither reading includes a coating.');
w(`teaching, contents share of the API M Cp on this gas line = ${f(100 * TL_CONT_M * TL.contentsCp / mcpApi, 6)} percent`);
w(`derived, contents share of the M Cp on the PUBLISHED liquid-filled cooldown = ${f(100 * PUB_CONT_M * PUB_COOL_CONTENTS_CP / (PUB_CONT_M * PUB_COOL_CONTENTS_CP + PUB_STEEL_M * PUB_COOL_SHELL_CP), 6)} percent`);
w('');

// ============================================================ SECTION 18
w('# SECTION 18: THE COOLDOWN THAT RUNS BACKWARDS, AND THE ONE THAT DOES NOT');
w('# cooldownTime guards startTempF > ambientTempF and targetTempF > ambientTempF.');
w('# It never checks startTempF > targetTempF. When the target is above the start,');
w('# Math.log of a ratio below 1 is negative and the function returns a negative');
w('# number of hours as a normal answer. The three branches are printed together');
w('# so the missing one reads as the gap in a set. Professional m03 owns this and');
w('# Expert may cite it. TEACHING LINE conditions throughout.');
const coolBase = { contents: { massLbPerFt: TL_CONT_M, cpBtuLbF: TL.contentsCp }, shell: { massLbPerFt: TL_STEEL_M, cpBtuLbF: TL.steelCp }, uBtuHrFt2F: TL_U.uBtuHrFt2F, idIn: TL.refBore };
const coolCold = T.cooldownTime({ ...coolBase, startTempF: 40.0, ambientTempF: TL.seabedTempF, targetTempF: TL.hydrateFlowingF });
w(`teaching, BRANCH 1, start ${f(40.0, 1)} degF already below the ${f(TL.seabedTempF, 1)} degF seabed: ok = ${yn(coolCold.ok)}, error = ${coolCold.error}`);
const coolBelowAmb = T.cooldownTime({ ...coolBase, startTempF: TL_COOL_START, ambientTempF: TL.seabedTempF, targetTempF: 40.0 });
w(`teaching, BRANCH 2, target ${f(40.0, 1)} degF below the ${f(TL.seabedTempF, 1)} degF seabed: ok = ${yn(coolBelowAmb.ok)}, hours = ${coolBelowAmb.hours}, time constant = ${f(coolBelowAmb.timeConstantHr, 10)} hr, stations = ${coolBelowAmb.stations.length}, note = ${coolBelowAmb.note}`);
w('# That is the branch the module DOES handle, and it handles it well: an');
w('# Infinity, a time constant that is still meaningful, an empty station list and');
w('# a written note. It is the shape the missing branch should have had.');
const TL_ARRIVAL_JT = T.steadyStateProfile({ lengthFt: TL.lengthFt, inletTempF: TL.inletTempF, ambientTempF: TL.seabedTempF, massRateLbHr: TL.massRateLbHr, cpBtuLbF: TL.cpBtuLbF, uBtuHrFt2F: TL_U.uBtuHrFt2F, idIn: TL.refBore, inletPsia: TL.inletPsia, outletPsia: TL.outletPsia, jtCoeffFPerPsi: TL.jtCoeffFPerPsi }).arrivalTempF;
const coolBack = T.cooldownTime({ ...coolBase, startTempF: TL_ARRIVAL_JT, ambientTempF: TL.seabedTempF, targetTempF: TL.hydrateShutInF });
w(`teaching, BRANCH 3, THE MISSING ONE. The line stops with its far end at the engine arrival of ${f(TL_ARRIVAL_JT, 10)} degF, and once it packs up the hydrate boundary moves to ${f(TL.hydrateShutInF, 2)} degF, which is ABOVE the temperature the line is at.`);
w(`teaching, cooldownTime asked for the time to fall from ${f(TL_ARRIVAL_JT, 10)} degF to ${f(TL.hydrateShutInF, 2)} degF against a ${f(TL.seabedTempF, 1)} degF seabed: ok = ${yn(coolBack.ok)}, hours = ${f(coolBack.hours, 10)}, time constant = ${f(coolBack.timeConstantHr, 10)} hr, note = ${coolBack.note === undefined ? 'none' : coolBack.note}, error = ${coolBack.error === undefined ? 'none' : coolBack.error}`);
w(`teaching, the log term that produced it, ln((${f(TL_ARRIVAL_JT, 4)} - ${f(TL.seabedTempF, 1)})/(${f(TL.hydrateShutInF, 1)} - ${f(TL.seabedTempF, 1)})) = ${f(Math.log((TL_ARRIVAL_JT - TL.seabedTempF) / (TL.hydrateShutInF - TL.seabedTempF)), 10)}`);
w(`teaching, stations returned on that call = ${coolBack.stations.length}, and they run BACKWARDS in time and WARM UP`);
coolBack.stations.forEach((st, i) => {
  if (i % 4 !== 0 && i !== coolBack.stations.length - 1) return;
  w(`teaching backwards station ${String(i).padStart(2, '0')}: t = ${f(st.hours, 10)} hr, temperature = ${f(st.tempF, 10)} degF`);
});
w(`teaching, temperature RISE across that station table = ${f(coolBack.stations[coolBack.stations.length - 1].tempF - coolBack.stations[0].tempF, 10)} degF, on a line that has just been shut in against a colder seabed`);
w('# The right answer is that there is NO no-touch time: the line is inside the');
w('# shut-in hydrate envelope from the moment it stops. The mirror of this case is');
w('# already handled in the same module. uForArrivalTemp refuses an inlet at or');
w('# below its target with a written reason, and cooldownTime itself has the');
w('# Infinity branch above. This one branch was missed.');
const mirror = T.uForArrivalTemp({ lengthFt: TL.lengthFt, inletTempF: TL_ARRIVAL_JT, ambientTempF: TL.seabedTempF, targetTempF: TL.hydrateShutInF, massRateLbHr: TL.massRateLbHr, cpBtuLbF: TL.cpBtuLbF, idIn: TL.refBore });
w(`teaching, the mirror question put to uForArrivalTemp, inlet ${f(TL_ARRIVAL_JT, 4)} degF and target ${f(TL.hydrateShutInF, 2)} degF: ok = ${yn(mirror.ok)}, reason = ${mirror.reason}`);
w('# Two functions in one module, opposite positions on the same pair of');
w('# temperatures.');
w('');

// ============================================================ SECTION 19
w('# SECTION 19: THE 24 PUBLISHED INHIBITOR ROWS, GOLDEN AGAINST ENGINE');
w('# The oracle computes BOTH relations for ALL FOUR fluids, in Celsius with the');
w('# metric constants, and converts. The engine computes Hammerschmidt for all');
w('# four and returns Nielsen-Bucklin ONLY for methanol, because the catalog');
w('# carries nielsenBucklin = false on the three glycols. So the golden publishes');
w('# a check the engine declines to report. Expert m03 and m04 own this section.');
{
  const IX_ORDER = ['methanol', 'meg', 'deg', 'teg'];
  IX_ORDER.forEach((id) => {
    const rows = GOLD.inhibition.filter((r) => r.inhibitor === id);
    rows.forEach((r) => {
      const inh = H.inhibitor(id);
      const eh = H.hammerschmidtDepression({ weightPct: r.weightPct, molecularWeight: inh.molecularWeight, k: inh.k });
      const en = H.nielsenBucklinDepression({ weightPct: r.weightPct, molecularWeight: inh.molecularWeight });
      const dep = H.depression({ weightPct: r.weightPct, inhibitorId: id });
      w(`golden inhibitor row, ${id} at ${f(r.weightPct, 1)} weight percent: Hammerschmidt = ${f(r.hammerschmidtF, 10)} degF, Nielsen-Bucklin = ${f(r.nielsenBucklinF, 10)} degF`);
      w(`engine inhibitor row, ${id} at ${f(r.weightPct, 1)} weight percent: hammerschmidtF = ${f(eh, 10)} degF, nielsenBucklinF = ${dep.nielsenBucklinF === null ? 'null' : f(dep.nielsenBucklinF, 10) + ' degF'}, recommendedF = ${f(dep.recommendedF, 10)} degF, basis = ${dep.basis}, reliable = ${yn(dep.reliable)}, spreadF = ${dep.spreadF === null ? 'null' : f(dep.spreadF, 10)}`);
      w(`derived, relative difference golden against engine Hammerschmidt, ${id} ${f(r.weightPct, 1)} = ${e(rel(r.hammerschmidtF, eh), 6)}`);
      w(`derived, the Nielsen-Bucklin the ORACLE publishes for ${id} at ${f(r.weightPct, 1)} weight percent, recomputed by this generator = ${f(en, 10)} degF, relative difference against the golden = ${e(rel(r.nielsenBucklinF, en), 6)}`);
    });
  });
}
w('# Every Hammerschmidt relative difference on those rows is the same number to');
w('# four figures, because it is one constant against another and nothing else.');
w('# Every Nielsen-Bucklin relative difference is at the round trip. The engine');
w('# and the oracle disagree on Hammerschmidt by a fixed ratio and agree on');
w('# Nielsen-Bucklin to the conversion. Section 21 says why.');
w('');

// ============================================================ SECTION 20
w('# SECTION 20: WHERE THE TWO RELATIONS SEPARATE, AND WHERE THE ENGINE DRAWS ITS LINE');
w('# HAMMERSCHMIDT_RELIABLE_WT_PCT is 25. Below it the engine reports');
w('# Hammerschmidt as recommendedF; above it, for methanol, it switches to');
w('# Nielsen-Bucklin. The switch is a report, not a redesign. Expert m04 owns it.');
{
  const IX_LADDER = [5.0, 10.0, 15.0, 20.0, 25.0, 30.0, 35.0, 40.0, 45.0, 50.0];
  IX_LADDER.forEach((wp) => {
    const d = H.depression({ weightPct: wp, inhibitorId: 'methanol' });
    w(`engine methanol at ${f(wp, 1)} weight percent: hammerschmidtF = ${f(d.hammerschmidtF, 10)} degF, nielsenBucklinF = ${f(d.nielsenBucklinF, 10)} degF, spreadF = ${f(d.spreadF, 10)} degF, ratio Hammerschmidt over Nielsen-Bucklin = ${f(d.hammerschmidtF / d.nielsenBucklinF, 10)}, reliable = ${yn(d.reliable)}, basis = ${d.basis}`);
  });
  const d25 = H.depression({ weightPct: 25.0, inhibitorId: 'methanol' });
  w(`derived, the spread at the reliability line itself, 25.0 weight percent methanol = ${f(d25.spreadF, 10)} degF, which is ${f(100 * d25.spreadF / d25.nielsenBucklinF, 6)} percent of the Nielsen-Bucklin value, and the engine still reports reliable = ${yn(d25.reliable)}`);
}
w('# The two relations do not start disagreeing at 25 weight percent. They');
w('# disagree at every concentration and the gap simply grows. 25 is where the');
w('# engine changes which one it PRINTS, not where the physics changes.');
w('');

// ============================================================ SECTION 21
w('# SECTION 21: THREE VALUES OF ONE CONSTANT, AND THE DILUTE LIMIT THAT DECIDES IT');
w('# The module carries k = 2335 on all four inhibitors and');
w('# NIELSEN_BUCKLIN_CONSTANT_F = 129.6. Those two are not independent.');
w('# Hammerschmidt in mole terms is (K / MW_water) times the inhibitor to water');
w('# mole ratio, and Nielsen-Bucklin is -129.6 ln(1 - x), whose leading term is');
w('# 129.6 x. For the module own two relations to meet as the solution goes');
w('# dilute, K has to be 129.6 times 18.015. The oracle metric round trip,');
w('# 1297 times 1.8, gives a third value. Expert m05 owns this.');
{
  const IX_K_ENGINE = H.inhibitor('methanol').k;
  const IX_K_MEET = H.NIELSEN_BUCKLIN_CONSTANT_F * H.WATER_MOLECULAR_WEIGHT;
  const IX_K_METRIC = GOLD.constants.hammerschmidtKfromMetric;
  w(`engine constant, the Hammerschmidt K the module carries = ${f(IX_K_ENGINE, 6)}`);
  w(`derived, the Hammerschmidt K that makes the module own two relations meet in the dilute limit, 129.6 times 18.015 = ${f(IX_K_MEET, 6)}`);
  w(`golden constant, the Hammerschmidt K the oracle reaches through the metric round trip, 1297 times 1.8 = ${f(IX_K_METRIC, 6)}`);
  w(`derived, ratio of the carried K to the meeting K = ${f(IX_K_ENGINE / IX_K_MEET, 10)}`);
  w(`derived, ratio of the carried K to the metric K = ${f(IX_K_ENGINE / IX_K_METRIC, 10)}`);
  w(`derived, ratio of the meeting K to the metric K = ${f(IX_K_MEET / IX_K_METRIC, 10)}`);
  const IX_DILUTE = [1.0, 0.1, 0.01, 0.001];
  IX_DILUTE.forEach((wp) => {
    const d = H.depression({ weightPct: wp, inhibitorId: 'methanol' });
    w(`engine methanol at ${wp} weight percent: hammerschmidtF = ${f(d.hammerschmidtF, 16)} degF, nielsenBucklinF = ${f(d.nielsenBucklinF, 16)} degF, ratio = ${f(d.hammerschmidtF / d.nielsenBucklinF, 10)}`);
  });
  w('# The ratio walks down toward the carried-K over meeting-K ratio as the');
  w('# solution goes dilute, and what is left over is the series correction on the');
  w('# logarithm. The gap is a constant, not a curvature.');
  const IX_TOL_HAM = 5e-4;
  const IX_TOL_NB = 1e-9;
  w(`derived, the harness relative tolerance on Hammerschmidt = ${e(IX_TOL_HAM, 4)}, on Nielsen-Bucklin = ${e(IX_TOL_NB, 4)}, ratio of the two tolerances = ${f(IX_TOL_HAM / IX_TOL_NB, 1)}`);
  w(`derived, the actual relative gap between the carried K and the metric K = ${e(rel(IX_K_ENGINE, IX_K_METRIC), 6)}, which is inside the looser tolerance and would not survive the tighter one`);
}
w('');

// ============================================================ SECTION 22
w('# SECTION 22: THE REQUIREMENT CHAIN ON TEACHING LINE AKASO SPUR, METHANOL');
w('# EVERY NUMBER IN THIS SECTION IS A TEACHING NUMBER. The subcooling, the');
w('# margin, the produced water rate and the lean strength were all chosen by');
w('# this wave. inhibitionRequirement SIZES with the Hammerschmidt inverse and');
w('# CHECKS with Nielsen-Bucklin, and nothing in the function compares the two.');
w('# Expert m04 owns this section.');
const IX_REQ_M = H.inhibitionRequirement({
  subcoolingF: TL.subcoolingF, safetyMarginF: TL.safetyMarginF,
  waterRateBpd: TL.waterRateBpd, inhibitorId: 'methanol', leanWtPct: TL.leanMeohWtPct,
});
w(`teaching, AKASO SPUR asks for ${f(TL.subcoolingF, 2)} degF of shut-in subcooling plus a ${f(TL.safetyMarginF, 2)} degF margin, so neededDepressionF = ${f(IX_REQ_M.neededDepressionF, 2)} degF`);
w(`teaching, inhibitionRequirement methanol returns: ok = ${yn(IX_REQ_M.ok)}, required = ${yn(IX_REQ_M.required)}, weightPct = ${f(IX_REQ_M.weightPct, 10)} weight percent, error = ${IX_REQ_M.error === null ? 'none' : IX_REQ_M.error}`);
w(`teaching, and in the SAME returned object: depressionCheck.hammerschmidtF = ${f(IX_REQ_M.depressionCheck.hammerschmidtF, 10)} degF, depressionCheck.nielsenBucklinF = ${f(IX_REQ_M.depressionCheck.nielsenBucklinF, 10)} degF, depressionCheck.recommendedF = ${f(IX_REQ_M.depressionCheck.recommendedF, 10)} degF, basis = ${IX_REQ_M.depressionCheck.basis}, reliable = ${yn(IX_REQ_M.depressionCheck.reliable)}`);
w(`teaching, the sized depression against the delivered depression: sized ${f(IX_REQ_M.depressionCheck.hammerschmidtF, 10)} degF, delivered ${f(IX_REQ_M.depressionCheck.recommendedF, 10)} degF`);
w(`teaching, SHORTFALL against what was asked for = ${f(IX_REQ_M.neededDepressionF - IX_REQ_M.depressionCheck.recommendedF, 10)} degF, which is ${f(100 * (IX_REQ_M.neededDepressionF - IX_REQ_M.depressionCheck.recommendedF) / IX_REQ_M.neededDepressionF, 6)} percent of the need`);
w(`teaching, SHORTFALL against the BARE subcooling with no margin at all = ${f(TL.subcoolingF - IX_REQ_M.depressionCheck.recommendedF, 10)} degF`);
w(`teaching, injectionRate on that dose: rateBpd = ${f(IX_REQ_M.rate.rateBpd, 10)} bbl/d, streamDensityLbGal = ${f(IX_REQ_M.rate.streamDensityLbGal, 10)} lb/gal, massLbDay = ${f(IX_REQ_M.rate.massLbDay, 6)}, pureMassLbDay = ${f(IX_REQ_M.rate.pureMassLbDay, 6)}`);
// the Nielsen-Bucklin inverse, the concentration the CHECK would have demanded
const IX_NB_INV = (d, mw) => {
  const x = 1 - Math.exp(-d / H.NIELSEN_BUCKLIN_CONSTANT_F);
  const q = (x / (1 - x)) * mw / H.WATER_MOLECULAR_WEIGHT;
  return (100 * q) / (1 + q);
};
const IX_W_NB = IX_NB_INV(TL_NEED, H.inhibitor('methanol').molecularWeight);
const IX_RATE_NB = H.injectionRate({ waterRateBpd: TL.waterRateBpd, weightPct: IX_W_NB, inhibitorId: 'methanol', leanWtPct: TL.leanMeohWtPct });
w(`derived, inverting NIELSEN-BUCKLIN instead for the same ${f(TL_NEED, 2)} degF need gives ${f(IX_W_NB, 10)} weight percent methanol`);
w(`derived, that is ${f(IX_W_NB - IX_REQ_M.weightPct, 10)} weight percent more than the engine sized, and its Nielsen-Bucklin depression is ${f(H.nielsenBucklinDepression({ weightPct: IX_W_NB, molecularWeight: H.inhibitor('methanol').molecularWeight }), 10)} degF`);
w(`derived, the injection rate at that concentration on the teaching line = ${f(IX_RATE_NB.rateBpd, 10)} bbl/d, which is ${f(IX_RATE_NB.rateBpd - IX_REQ_M.rate.rateBpd, 10)} bbl/d and ${f(100 * (IX_RATE_NB.rateBpd - IX_REQ_M.rate.rateBpd) / IX_REQ_M.rate.rateBpd, 6)} percent more methanol`);
w('# The engine returns ok = true on a design whose own check, printed in an');
w('# adjacent field of the same object, does not reach the subcooling it was');
w('# handed. Nothing in the function reads depressionCheck back.');
w('');

// ============================================================ SECTION 23
w('# SECTION 23: HOW SHORT IS SHORT, ACROSS A SWEEP OF NEEDS');
w('# A sweep this generator ran on the teaching line water rate and lean');
w('# strength. A SWEEP POINT IS NOT A PUBLISHED CASE. Only the need moves.');
{
  const IX_NEEDS = [15.0, 20.0, 25.0, 30.0, 35.0, 41.0, 50.0, 60.0];
  IX_NEEDS.forEach((need) => {
    const r = H.inhibitionRequirement({ subcoolingF: need, safetyMarginF: 0, waterRateBpd: TL.waterRateBpd, inhibitorId: 'methanol', leanWtPct: TL.leanMeohWtPct });
    const del = r.depressionCheck.recommendedF;
    w(`derived sweep, need ${f(need, 1)} degF: sized weightPct = ${f(r.weightPct, 10)}, delivered ${r.depressionCheck.basis} = ${f(del, 10)} degF, shortfall = ${f(need - del, 10)} degF, shortfall percent = ${f(100 * (need - del) / need, 6)}, reliable = ${yn(r.depressionCheck.reliable)}, ok = ${yn(r.ok)}`);
  });
}
w('# The shortfall is zero nowhere and negative nowhere. Below the reliability');
w('# line the engine reports Hammerschmidt as the delivered depression, which is');
w('# the same relation it sized with, so the shortfall reads as exactly zero and');
w('# the check has proved nothing at all. Above it the check switches relation');
w('# and the shortfall appears in one step.');
w('');

// ============================================================ SECTION 24
w('# SECTION 24: NO CHECK AT ALL FOR MEG, AND THE MOLE FRACTION THAT GIVES IT AWAY');
w('# TEACHING LINE conditions, MEG at its own lean strength. The catalog carries');
w('# nielsenBucklin = false on MEG, so depressionCheck.nielsenBucklinF is null,');
w('# basis stays hammerschmidt, and recommendedF is the sizing relation reported');
w('# back as the check. Expert m04 owns this.');
const IX_REQ_G = H.inhibitionRequirement({
  subcoolingF: TL.subcoolingF, safetyMarginF: TL.safetyMarginF,
  waterRateBpd: TL.waterRateBpd, inhibitorId: 'meg', leanWtPct: TL.leanMegWtPct,
});
w(`teaching, inhibitionRequirement MEG on the same ${f(IX_REQ_G.neededDepressionF, 2)} degF need returns: ok = ${yn(IX_REQ_G.ok)}, required = ${yn(IX_REQ_G.required)}, weightPct = ${f(IX_REQ_G.weightPct, 10)} weight percent`);
w(`teaching, its depressionCheck: hammerschmidtF = ${f(IX_REQ_G.depressionCheck.hammerschmidtF, 10)} degF, nielsenBucklinF = ${IX_REQ_G.depressionCheck.nielsenBucklinF === null ? 'null' : f(IX_REQ_G.depressionCheck.nielsenBucklinF, 10)}, recommendedF = ${f(IX_REQ_G.depressionCheck.recommendedF, 10)} degF, basis = ${IX_REQ_G.depressionCheck.basis}, spreadF = ${IX_REQ_G.depressionCheck.spreadF === null ? 'null' : f(IX_REQ_G.depressionCheck.spreadF, 10)}, reliable = ${yn(IX_REQ_G.depressionCheck.reliable)}`);
w(`teaching, so the MEG design reads as delivering ${f(IX_REQ_G.depressionCheck.recommendedF, 10)} degF against a need of ${f(IX_REQ_G.neededDepressionF, 2)} degF, a shortfall of ${f(IX_REQ_G.neededDepressionF - IX_REQ_G.depressionCheck.recommendedF, 10)} degF`);
w(`teaching, injectionRate on the MEG dose: rateBpd = ${f(IX_REQ_G.rate.rateBpd, 10)} bbl/d, streamDensityLbGal = ${f(IX_REQ_G.rate.streamDensityLbGal, 10)} lb/gal`);
{
  const IX_MEG_NB = H.nielsenBucklinDepression({ weightPct: IX_REQ_G.weightPct, molecularWeight: H.inhibitor('meg').molecularWeight });
  const IX_X_MEG = H.weightPctToMoleFraction({ weightPct: IX_REQ_G.weightPct, molecularWeight: H.inhibitor('meg').molecularWeight });
  const IX_X_MEOH = H.weightPctToMoleFraction({ weightPct: IX_REQ_M.weightPct, molecularWeight: H.inhibitor('methanol').molecularWeight });
  w(`derived, running nielsenBucklinDepression on that MEG concentration by hand gives ${f(IX_MEG_NB, 10)} degF`);
  w(`derived, the methanol dose and the MEG dose sit at the same mole fraction: methanol ${f(IX_X_MEOH, 16)}, MEG ${f(IX_X_MEG, 16)}, difference ${e(IX_X_MEG - IX_X_MEOH, 4)}`);
  w('# That is not a coincidence. The Hammerschmidt inverse fixes the inhibitor to');
  w('# water MOLE RATIO at 18.015 times the depression over K, and K is the same');
  w('# 2335 on all four fluids, so every fluid sized for the same depression lands');
  w('# on the same mole fraction and therefore on the same Nielsen-Bucklin answer.');
  w('# The check the engine declines to run for MEG is the check it already ran');
  w('# for methanol, to the last figure.');
}
w('');

// ============================================================ SECTION 25
w('# SECTION 25: THE CEILING MEASURED IN THE COORDINATES OF THE RELATION IT DOES NOT TRUST');
w('# MAX_PRACTICAL_WT_PCT is 70 and inhibitionRequirement compares against it the');
w('# concentration it got from the HAMMERSCHMIDT inverse. So the refusal boundary');
w('# is drawn in the coordinates of the over-predicting relation. Expert m05.');
{
  const IX_MW_M = H.inhibitor('methanol').molecularWeight;
  const IX_K_M = H.inhibitor('methanol').k;
  const IX_CEIL = H.MAX_PRACTICAL_WT_PCT;
  const IX_H70 = H.hammerschmidtDepression({ weightPct: IX_CEIL, molecularWeight: IX_MW_M, k: IX_K_M });
  const IX_N70 = H.nielsenBucklinDepression({ weightPct: IX_CEIL, molecularWeight: IX_MW_M });
  w(`engine, methanol at the ${f(IX_CEIL, 1)} weight percent ceiling: hammerschmidtDepression = ${f(IX_H70, 10)} degF, nielsenBucklinDepression = ${f(IX_N70, 10)} degF`);
  w(`derived, the BAND the engine will design inside and the chemistry it checks against cannot deliver = ${f(IX_H70 - IX_N70, 10)} degF wide`);
  w(`derived, ratio of the ceiling in Hammerschmidt coordinates to the ceiling in Nielsen-Bucklin coordinates = ${f(IX_H70 / IX_N70, 10)}`);
  const IX_MW_G = H.inhibitor('meg').molecularWeight;
  w(`engine, MEG at the same ${f(IX_CEIL, 1)} weight percent ceiling: hammerschmidtDepression = ${f(H.hammerschmidtDepression({ weightPct: IX_CEIL, molecularWeight: IX_MW_G, k: IX_K_M }), 10)} degF, and depression() reports nielsenBucklinF = null there as everywhere`);
  w(`derived, running nielsenBucklinDepression on ${f(IX_CEIL, 1)} weight percent MEG by hand = ${f(H.nielsenBucklinDepression({ weightPct: IX_CEIL, molecularWeight: IX_MW_G }), 10)} degF`);
  const IX_BIG = [80.0, 100.0, 120.0, 140.0, 160.0, 175.0];
  IX_BIG.forEach((need) => {
    const r = H.inhibitionRequirement({ subcoolingF: need, safetyMarginF: 0, waterRateBpd: TL.waterRateBpd, inhibitorId: 'methanol', leanWtPct: TL.leanMeohWtPct });
    if (!r.ok) {
      w(`derived sweep, need ${f(need, 1)} degF methanol: ok = ${yn(r.ok)}, weightPct = ${f(r.weightPct, 10)}, REFUSED, error = ${r.error}`);
    } else {
      const del = r.depressionCheck.recommendedF;
      w(`derived sweep, need ${f(need, 1)} degF methanol: ok = ${yn(r.ok)}, sized weightPct = ${f(r.weightPct, 10)}, delivered ${r.depressionCheck.basis} = ${f(del, 10)} degF, shortfall = ${f(need - del, 10)} degF, ACCEPTED`);
    }
  });
  w('# The last accepted row and the first refused row are both above what 70');
  w('# weight percent methanol can actually kill. The ceiling is not a safety');
  w('# limit in the coordinates the module says to believe.');
}
w('');

// ============================================================ SECTION 26
w('# SECTION 26: leanWtPct AS A WEIGHT PERCENT AND AS A VOLUME PERCENT, ONE LINE APART');
w('# Inside injectionRate the gross-up treats lean as a WEIGHT percent, which it');
w('# is, and the density blend on the next line weights the component densities');
w('# by the same number, which is the VOLUME fraction rule. The mass-fraction');
w('# form of an ideal blend is 1/rho = w_i/rho_i + w_w/rho_w. Expert m05.');
{
  const IX_WATER_RHO = 8.34;
  const IX_BLEND_MASS = (rhoI, lean) => 1 / ((lean / 100) / rhoI + ((100 - lean) / 100) / IX_WATER_RHO);
  const IX_BLEND_VOL = (rhoI, lean) => (rhoI * lean + IX_WATER_RHO * (100 - lean)) / 100;
  const IX_ROWS = [
    ['methanol', TL.leanMeohWtPct, IX_REQ_M.weightPct],
    ['meg', TL.leanMegWtPct, IX_REQ_G.weightPct],
  ];
  IX_ROWS.forEach(([id, lean, wp]) => {
    const rhoI = H.inhibitor(id).densityLbGal;
    const eng = IX_BLEND_VOL(rhoI, lean);
    const cor = IX_BLEND_MASS(rhoI, lean);
    const r = H.injectionRate({ waterRateBpd: TL.waterRateBpd, weightPct: wp, inhibitorId: id, leanWtPct: lean });
    w(`teaching, ${id} lean ${f(lean, 1)} weight percent: engine streamDensityLbGal = ${f(r.streamDensityLbGal, 10)} lb/gal, mass-fraction blend = ${f(cor, 10)} lb/gal, engine value high by ${f(100 * (eng - cor) / cor, 6)} percent`);
    w(`teaching, ${id} rate as the engine returns it = ${f(r.rateBpd, 10)} bbl/d, with the mass-fraction density = ${f(r.massLbDay / cor / 42, 10)} bbl/d, engine rate LOW by ${f(100 * (r.massLbDay / cor / 42 - r.rateBpd) / r.rateBpd, 6)} percent`);
  });
  w('# Because the arithmetic mean of two densities always exceeds the harmonic');
  w('# mean, the engine stream density comes out HIGH and, since the rate is a');
  w('# mass over a density, the rate comes out LOW. Always LOW, never high.');
  const IX_LEANS = [90.0, 80.0, 70.0, 60.0, 50.0];
  IX_LEANS.forEach((lean) => {
    const rhoI = H.inhibitor('methanol').densityLbGal;
    const eng = IX_BLEND_VOL(rhoI, lean);
    const cor = IX_BLEND_MASS(rhoI, lean);
    w(`derived sweep, lean methanol ${f(lean, 1)} weight percent: engine blend = ${f(eng, 10)} lb/gal, mass-fraction blend = ${f(cor, 10)} lb/gal, rate LOW by ${f(100 * (eng - cor) / cor, 6)} percent`);
  });
  w('# The error is a fraction of a percent on a strong lean stream and grows as');
  w('# the stream is diluted. It cannot be both conventions, and one line has to');
  w('# change.');
}
w('');

// ===== APPEND MARKER =====

// ---------------------------------------------------------------- flush
console.log(out.join('\n'));
