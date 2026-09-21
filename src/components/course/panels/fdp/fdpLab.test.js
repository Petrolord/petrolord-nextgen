// Every value the EC6 lab exposes to a panel, a lesson or the grader is pinned
// here against the teaching digest (tools/course-waves/fdp/digest.txt), which is
// itself nothing but the FDP Accelerator's and Project Management Pro's return
// values on the published goldens and on the teaching fields EGINA and ODUDU-2.
//
// THE DIGEST IS REBUILT BYTE FOR BYTE. buildDigest() below is ec6_dump.mjs's
// writer with every engine call replaced by a lab return value: the prose is
// the dump's, the formatting is the dump's (plan money to four decimals, whole
// currency units for well and task costs, ratios to six, percents to four), and
// every number comes out of fdpLab.js. The rebuilt text is compared with
// digest.txt section by section and then whole.
//
// THE EIGHTEEN GRADED FIELDS of the UKOT and MEREN-3 capstone are pinned
// separately and EXACTLY against tools/course-waves/fdp/fields.json, READ FROM THE FILE.
//
// Then the gates:
//   THE LEAK GATE   no teaching export may return a number within ten times a
//                   graded field's ABSOLUTE tolerance of a graded answer, in
//                   any of three unit shiftings, over every number the lab
//                   exports, refusing a tiny surface.
//   THE CLOCK GATE  every reader returns identical output under two faked
//                   system dates, with a control proving the clock moved. This
//                   course has three clock surfaces: the concept schedule, the
//                   calendar span and the earned value as-of date.
//   THE TZ GATE     the whole rebuild runs a second time in a child process
//                   under TZ=America/Los_Angeles and must be byte-identical.
//                   The EC6-0 repair is exactly that a date-only string no
//                   longer moves with the reader's zone.
import { describe, it, expect, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as L from './fdpLab.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const LAB = Object.fromEntries(Object.entries(L));

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
// THE WAVE INPUTS. Read from the committed copy under tools/course-waves by
// default, which is what lets this suite run anywhere, CI included. Point it
// at a live wave directory mid-build with NEXTGEN_WAVE_DIR. A missing input
// throws and names itself rather than skipping: see tools/course-waves/waveInputs.mjs.
const WAVE_NAME = 'fdp';
const DIGEST = waveInput(WAVE_NAME, 'digest.txt');
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const DUMP_MJS = waveInput(WAVE_NAME, 'ec6_dump.mjs');
const FIELDS_MJS = waveInput(WAVE_NAME, 'ec6_fields.mjs');
const CAPSTONE_MJS = waveInput(WAVE_NAME, 'ec6_fields_capstone.mjs');
const LAB_SOURCE = () => fs.readFileSync(path.join(HERE, 'fdpLab.js'), 'utf8');

// ---------------------------------------------------------------------------
// The digest's formatting, verbatim from ec6_dump.mjs.
// ---------------------------------------------------------------------------

const f = (x, n) => ((x === null || x === undefined || Number.isNaN(Number(x))) ? 'null' : Number(x).toFixed(n));
const m = (x) => f(x, 4);  // plan money, million USD
const u = (x) => f(x, 0);  // whole currency units
const r = (x) => f(x, 6);  // ratios
const pc = (x) => f(x, 4); // percents
const uf = (x) => f(x, 4); // currency units where the fixture is sub-unit
const J = (x) => JSON.stringify(x);
const refusal = (a) => (a.ok ? 'accepted' : `${a.errorName}: "${a.error}"`);

// ---------------------------------------------------------------------------
// THE REBUILD. One block per digest section, in the dump's order.
// ---------------------------------------------------------------------------

const buildDigest = () => {
  const out = [];
  const w = (s = '') => out.push(s);

  w('# EC6 Field Development Planning. Teaching digest.');
  w('# Plan money is million USD to four decimals; whole currency units for well and task costs; ratios to six decimals; percents to four.');
  w('# Every date is stated. No figure here is read from a clock.');
  w();

  // Section 1
  const s1 = L.planAndRefusals();
  w('# SECTION 1: What a field development plan holds, and what the engine refuses (owned by Associate m01)');
  w();
  w('- The plan is one field: its reserves, one or more development concepts, the wells and facilities a concept implies, a schedule, a cost breakdown, a risk register, and the economics those imply.');
  w('- The studio holds the plan together. It does not re-derive the subsurface, the well designs or the facility sizing: a figure typed into it is only as good as the work behind it.');
  w(`- Screening economics run through the sanctioned engine: post royalty and tax, discounted mid year. Default terms are royalty ${pc(s1.fiscal.royaltyRate)} percent, tax ${pc(s1.fiscal.taxRate)} percent, discount ${pc(s1.fiscal.discountRate)} percent and variable operating cost ${m(s1.fiscal.variableOpexPerBbl)} USD a barrel.`);
  w('- A figure the plan does not carry is refused by name. Nothing is substituted quietly.');
  w('- Until September 2026 four figures were substituted silently when the plan did not carry them: a concept capex of 100 million USD, an operating cost of 10 million USD a year, a peak rate of 50 kbpd and an oil price of 70 USD a barrel. A card built on all four still looked like an answer.');
  w();
  w('Refusals (published scenarioRefusals, engine messages verbatim):');
  s1.published.forEach((c) => w(`- ${c.name}: ${refusal(c)}`));
  w();
  w('The same refusals on the EGINA concept (probe):');
  s1.probes.forEach((p) => w(`- ${p.label}: ${refusal(p)}`));
  w(`- a scenario priced at zero, which is a number somebody typed: accepted, NPV ${m(s1.zeroPriceNpv)}.`);
  w();

  // Section 2
  const s2 = L.reservesPerFluid();
  w('# SECTION 2: Reserves, one total per fluid (owned by Associate m02)');
  w();
  w('| reservoir | fluid | P90 | P50 | P10 | recovery factor |');
  w('| --- | --- | --- | --- | --- | --- |');
  s2.reservoirs.forEach((res) => w(`| ${res.name} | ${res.fluid} | ${m(res.p90)} | ${m(res.p50)} | ${m(res.p10)} | ${r(res.rf)} |`));
  w();
  w('| fluid | unit | rows | sum of P90 | sum of P50 | sum of P10 |');
  w('| --- | --- | --- | --- | --- | --- |');
  s2.byFluid.forEach((t) => w(`| ${t.fluid} | ${t.units} | ${t.count} | ${m(t.p90Sum)} | ${m(t.p50Sum)} | ${m(t.p10Sum)} |`));
  w();
  w(`EGINA oil P50 ${m(s2.oilP50)} MMbbl; gas P50 ${m(s2.gasP50)} Bcf. Adding them would give ${m(s2.addedAcrossFluidsDerived)} of nothing (derived).`);
  w(`The engine's note, verbatim: "${s2.percentileNote}"`);
  w(`- a row with no fluid type: ${refusal(s2.unlabelledRefusal)}`);
  w(`- a row whose fluid is "Brine": ${refusal(s2.brineRefusal)}`);
  w();
  w('Published aggregateReserves cases:');
  s2.published.forEach((c) => w(`- ${c.name}: fluids ${J(c.fluids)}; ${c.perFluid.map((x) => `${x.fluid} P50 ${m(x.p50Sum)} ${x.units}`).join('; ') || 'no rows'}.`));
  s2.publishedRefusals.forEach((c) => w(`- ${c.name}: ${refusal(c)}`));
  w();
  const v = s2.volumetrics;
  w(`Volumetrics on an EGINA Main zone of ${m(v.zone.area)} acres, ${m(v.zone.thickness)} ft net, porosity ${r(v.zone.porosity)}, water saturation ${r(v.zone.sw)}, Bo ${r(v.zone.bo)}: OOIP ${m(v.ooip)} STB (engine), ${m(v.ooipMMstbDerived)} MMstb (derived).`);
  w(`Recovery factor implied by the WHOLE FIELD's oil P50 of ${m(s2.oilP50)} MMbbl against that one zone's oil in place: ${r(v.recoveryFactorImplied)} (engine).`);
  w(`The like for like ratio, ${v.likeForLike.reservoirName}'s own P50 of ${m(v.likeForLike.p50)} MMbbl against the same zone: ${r(v.likeForLike.recoveryFactor)} (engine), against the ${r(v.likeForLike.statedRf)} the reserves table states for that reservoir.`);
  w('# Commentary: the first ratio divides two different footprints, a two reservoir field total by one zone\'s oil in place, and the studio does not say so. Two numbers that each come from the engine can still be the wrong pair.');
  w(`Wells needed for the field's oil P50 at ${v.eurPerWell} MMbbl a well: ${v.wellsNeeded} (engine). The plan carries ${v.wellsInPlan} wells, and nothing in the studio reconciles the two.`);
  w();

  // Section 3
  const s3 = L.conceptsAndCapex();
  w('# SECTION 3: Concepts, and the capex a concept carries (owned by Associate m03)');
  w();
  w('| concept | type | drilling | facilities | subsea | total capex | annual opex | life | peak kbpd |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s3.rows.forEach((c) => w(`| ${c.name} | ${c.facilityType} | ${m(c.drillingCapex)} | ${m(c.facilitiesCapex)} | ${m(c.subseaCapex)} | ${m(c.totalCapex)} | ${m(c.opex)} | ${m(c.lifeOfField)} | ${m(c.peakProduction)} |`));
  w();
  s3.costs.forEach((c) => w(`- ${c.name}: engine concept cost, capex ${m(c.totalCapex)}, operating cost over ${m(c.lifeOfField)} years ${m(c.totalOpex)}, lifecycle ${m(c.totalLifecycleCost)}.`));
  w(`- a concept that carries only one capex field (facilities ${m(s3.oneFieldOnly.facilitiesCapex)}): total capex ${m(s3.oneFieldOnly.totalCapex)} (engine).`);
  w(`- a concept that carries a single pre-totalled capex of ${m(s3.preTotalled.entered)}: ${m(s3.preTotalled.totalCapex)} (engine).`);
  w();
  w('The screening production shape a concept implies (plateau then decline, a screening shape and not a reservoir forecast):');
  const sh = s3.shape;
  w(`- ${sh.conceptName}, peak ${m(sh.peakProduction)} kbpd over ${sh.years} years: ${sh.firstSix.map((x) => m(x)).join(', ')} ... ${m(sh.last)}.`);
  w(`- year 4 is year 3 x ${r(sh.declineRatioDerived)} (derived); the plateau runs to year ${sh.plateauLastYear}.`);
  w(`- the volume under that shape is ${m(sh.volumeMMbblDerived)} MMbbl (derived: each year's kbpd x 1000 x 365, summed, in millions of barrels).`);
  w(`# Commentary: the plan's own oil P50 is ${m(s2.oilP50)} MMbbl, and the shape above produces ${m(sh.volumeMMbblDerived)}. Nothing in the studio compares them, and a plan whose profile cannot be fed by its own reserves still scores complete and still returns an NPV. The shape is a screening shape and the reconciliation is the planner's job.`);
  w();
  w('Concept schedules, dated from the concept start (no clock is read):');
  s3.schedules.forEach((s) => w(`- ${s.name}: sanction ${s.fidDate}, first oil ${s.firstOilDate}, ${s.durationMonths} months.`));
  w(`- a concept with no start date and no today given: ${refusal(s3.noStartDateRefusal)}`);
  w(`- the same concept dated from ${s3.datedFromToday.today}: first oil ${s3.datedFromToday.firstOilDate}.`);
  w();

  // Section 4
  const s4 = L.scenarioValues();
  w('# SECTION 4: What a scenario is worth (owned by Associate m04)');
  w();
  w('| scenario | concept | oil price | capex | NPV | IRR | IRR status | payback years |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s4.rows.forEach((s) => w(`| ${s.name} | ${s.conceptName} | ${m(s.oilPrice)} | ${m(s.capex)} | ${m(s.npv)} | ${s.irr === null ? 'none' : pc(s.irr)} | ${s.irrStatus} | ${s.payback === null ? 'never' : m(s.payback)} |`));
  w();
  w(`Every case in that table carries the plan's end-of-life cost: source ${s4.abandonment.source}, ${m(s4.abandonment.amountMM)} million USD, charged in production year ${s4.abandonment.year} (engine). The basis the engine states: "${s4.abandonment.basis}"`);
  w('# Commentary: the payback column is the one figure in that table computed WITHOUT the end-of-life cost. scenarioPayback takes no abandonment argument, so the card reports the payback of a plan that never pays to abandon. On these cases it changes nothing, because the cost falls in the last year and the money has been recovered long before it; on a plan that only recovers at the end it would.');
  w();
  w(`The Base case in full: revenue ${m(s4.base.totalRevenue)}, royalty ${m(s4.base.totalRoyalty)}, tax ${m(s4.base.totalTax)}, capex ${m(s4.base.totalCapex)}, operating cost ${m(s4.base.totalOpex)}, government take ${m(s4.base.totalGovTake)}, deepest cash position ${m(s4.base.maxExposure)}.`);
  w(`Government take is ${r(s4.base.govTakeShareDerived)} of gross revenue (derived).`);
  w();
  w('Year by year, the Base case (engine cash flow rows):');
  w('| year | gross revenue | royalty | capex | operating cost | tax | net cash flow | cumulative |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s4.cashflowRows.forEach((row) => w(`| ${row.year} | ${m(row.grossRevenue)} | ${m(row.royalty)} | ${m(row.capex)} | ${m(row.opex)} | ${m(row.tax)} | ${m(row.ncf)} | ${m(row.cumulativeNCF)} |`));
  w(`(Year 0 carries the capex and no production. The profile has ${s4.cashflowRowCount} rows in all.)`);
  w();
  w('The same concept at four prices (engine):');
  s4.priceLadder.forEach((x) => w(`- ${m(x.price)} USD a barrel: NPV ${m(x.npv)}, IRR ${x.irr === null ? `none (${x.irrStatus})` : pc(x.irr)}.`));
  const cp = s4.comparison;
  w(`The tie-back at 70 USD a barrel earns ${m(cp.tieBackNpv)} on capex ${m(cp.tieBackCapex)}; the FPSO earns ${m(cp.fpsoNpv)} on ${m(cp.fpsoCapex)}. Value per million of capex: tie-back ${r(cp.tieBackPerMillionDerived)}, FPSO ${r(cp.fpsoPerMillionDerived)} (derived).`);
  w();

  // Section 5
  const s5 = L.planEconomics();
  w('# SECTION 5: The plan\'s own economics, and when there are none (owned by Associate m05)');
  w();
  w('| cost item | type | phase | amount |');
  w('| --- | --- | --- | --- |');
  s5.items.forEach((c) => w(`| ${c.name} | ${c.type} | ${c.phase} | ${m(c.amount)} |`));
  w(`Engine totals: CAPEX ${m(s5.capexTotal)}, OPEX ${m(s5.opexTotal)} a year. The ABEX line of ${m(s5.abexAmount)} is in neither of those two totals (derived), because it is neither development capex nor an annual operating cost. It is the plan's end-of-life cost and the case carries it in the final production year.`);
  w('By phase (engine):');
  s5.byPhase.forEach((x) => w(`- ${x.phase}: ${m(x.total)}`));
  w();
  w(`The plan's own case: capex ${m(s5.planRun.capex)} from the cost items, operating cost ${m(s5.planRun.annualOpex)} a year, the FPSO concept's ${s5.planRun.years} year shape at $70/bbl, and the end-of-life cost in the last of those years. NPV ${m(s5.planRun.npv)}, IRR ${s5.planRun.irr === null ? `none (${s5.planRun.irrStatus})` : pc(s5.planRun.irr)}, payback ${m(s5.planRun.payback)} years (engine).`);
  w();
  w('The end-of-life cost, and what leaving it out was worth (engine):');
  w(`- the engine resolves it as source ${s5.abandonment.source}, ${m(s5.abandonment.amountMM)} million USD, charged in production year ${s5.abandonment.year}, on the basis "${s5.abandonment.basis}"`);
  w('- an ABEX cost item replaces the facility decommissioning estimate, it is never added to it. Without any ABEX line the same plan would take the screening estimate of its facility instead.');
  w(`- the same case run with no end-of-life cost at all: NPV ${m(s5.abandonment.withoutNpv)}, IRR ${s5.abandonment.withoutIrr === null ? `none (${s5.abandonment.withoutIrrStatus})` : pc(s5.abandonment.withoutIrr)} (engine). That is the number this studio reported until September 2026.`);
  w(`- charging it costs the plan ${m(s5.abandonment.costDerived)} million USD of present value (derived), against a cash cost of ${m(s5.abandonment.amountMM)} paid twenty years out and deductible for tax in the year it falls.`);
  w();
  w(`The concept's own capex is ${m(s5.conceptCapex)} and the cost items total ${m(s5.capexTotal)}: the two agree here because the plan was costed against the concept (derived). They are two different numbers and they are meant to be compared.`);
  w();
  w('A price deck that does not cover the profile is refused, not padded:');
  w(`- a three year profile with two prices: ${refusal(s5.priceDeck.shortRefusal)}`);
  w(`- the same profile with three: accepted, NPV ${m(s5.priceDeck.coveredNpv)}.`);
  w();
  w('The sensitivity sweep on the plan\'s case (engine, each driver plus and minus 30 percent):');
  w('| driver | NPV at minus 30 percent | NPV at plus 30 percent | base NPV | swing |');
  w('| --- | --- | --- | --- | --- |');
  s5.sweep.forEach((s) => w(`| ${s.name} | ${m(s.lowParamNPV)} | ${m(s.highParamNPV)} | ${m(s.baseNPV)} | ${m(s.swingDerived)} (derived) |`));
  w('# Commentary: production and price do not move the NPV by the same amount, because a barrel costs money to produce and a dollar of price does not.');
  w();

  // Section 6
  const s6 = L.completeness();
  w('# SECTION 6: The plan that cannot be costed yet (owned by Associate m06)');
  w();
  w('A plan is only complete when every section carries something. The engine checks nine:');
  w(`- the EGINA plan: ${s6.egina.score} percent, ${s6.egina.valid} of ${s6.egina.sections} sections (engine).`);
  w(`- validation: isValid ${s6.validation.isValid}, errors ${J(s6.validation.errors)}, warnings ${J(s6.validation.warnings)}.`);
  w(`- the same plan with no economics written: ${s6.noEconomics.score} percent, errors ${J(s6.noEconomics.errors)}.`);
  w(`- a plan whose reserves came from a loaded example (summary only, no table): P50 read as ${m(s6.summaryOnlyP50)} (engine).`);
  w(`- a plan whose reserves table cannot be read: P50 ${m(s6.unreadable.p50)}, completeness ${s6.unreadable.score} percent, isValid ${s6.unreadable.isValid}, errors ${J(s6.unreadable.errors)}.`);
  w();
  w(`The plan's P50 by fluid, through the same accessor the completeness check uses: oil ${m(s6.planP50.oil)} MMbbl, gas ${m(s6.planP50.gas)} Bcf (engine).`);
  w();
  w('Published plan cases:');
  s6.published.forEach((c) => w(`- ${c.name}: ${c.score} percent, isValid ${c.isValid}${c.errors.length ? `, errors ${J(c.errors)}` : ''} (golden).`));
  w();

  // Section 7
  const s7 = L.network();
  w('# SECTION 7: The schedule as a network (owned by Professional m01)');
  w();
  w('| activity | type | duration | must finish first |');
  w('| --- | --- | --- | --- |');
  s7.activities.forEach((a) => w(`| ${a.name} | ${a.type} | ${a.duration} | ${a.dependencies.length ? a.dependencies.join(', ') : 'nothing'} |`));
  w();
  w('The critical path method over that network (engine: forward pass, backward pass, float = late start minus early start):');
  w('| activity | duration | early start | early finish | late start | late finish | float | critical |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s7.cpm.forEach((a) => w(`| ${a.id} ${a.name} | ${a.duration} | ${a.es} | ${a.ef} | ${a.ls} | ${a.lf} | ${a.float} | ${a.isCritical} |`));
  w();
  w(`Network duration ${s7.duration} days (engine). Critical path: ${s7.paths.map((p) => p.join(' -> ')).join(' and ')}.`);
  w(`Calendar span between the dates typed on the activities: ${s7.calendarSpan} days (engine). The two answer different questions: how long the work must take, and how long the window is.`);
  w(`Activities with float: ${s7.withFloat.map((a) => `${a.id} (${a.float} days)`).join(', ')} (engine). An activity with float can slip by that much without moving the end date; one on the critical path cannot slip at all.`);
  w();
  w('What the network refuses (published schedule refusals, engine messages verbatim):');
  s7.refusals.forEach((c) => w(`- ${c.name}: ${refusal(c)}`));
  w();
  w('Published schedule cases, engine against the reference:');
  s7.published.forEach((c) => w(`- ${c.name}: duration ${f(c.duration, 0)} days, critical ${J(c.critical)}, paths ${J(c.paths)}; golden reference duration ${f(c.goldenDuration, 0)}, critical ${J(c.goldenCritical)}.`));
  w();
  w(`# Commentary: on the textbook network the engine used to mark all ${s7.textbook.retiredCount} activities critical at float 0; the method puts the path at ${J(s7.textbook.criticalPath)} and gives ${J(s7.textbook.disagreements)} four days of float each (golden).`);
  w();

  // Section 8
  const s8 = L.dates();
  w('# SECTION 8: Dates that do not move (owned by Professional m02)');
  w();
  w('- A date-only string is parsed as LOCAL midnight. `new Date("2027-04-01")` is UTC midnight, which is the day before anywhere west of Greenwich, so a schedule drawn that way moved by a day depending on who looked at it.');
  w('- A span is counted in whole calendar days, not by subtracting two timestamps: across a daylight-saving change a millisecond difference is out by an hour.');
  w(`- Oct 30 to Nov 3, a window that crosses a daylight-saving change in some zones: ${s8.dstWindow.days} days (engine, and the same in every zone).`);
  w(`- an activity with no readable dates: calendar span ${s8.undatedSpan === null ? 'null, which is the honest answer' : 'a number'} (engine).`);
  w(`- an empty schedule: ${s8.emptySpan} (engine).`);
  w();
  w('Milestones are the activities of zero duration, or those typed as one:');
  w(`- EGINA: ${J(s8.milestones)} (engine).`);
  w();
  w('Concept schedules are dated from the concept, never from the clock:');
  s8.conceptSchedules.forEach((s) => w(`- a ${s.facilityType} sanctioned ${s.startDate}: first oil ${s.firstOilDate}, ${s.durationMonths} months (engine).`));
  w(`- an unreadable start date with no today given: ${refusal(s8.unreadableStartRefusal)}`);
  w();

  // Section 9
  const s9 = L.wellsAndRigs();
  w('# SECTION 9: Wells, and what a rig day costs (owned by Professional m03)');
  w();
  w(`At the plan's rig rate of ${u(s9.rigRate)} USD a day, services at 1.5 times the rig cost:`);
  w('| well | type | trajectory | measured depth | days | cost |');
  w('| --- | --- | --- | --- | --- | --- |');
  s9.rows.forEach((x) => w(`| ${x.name} | ${x.type} | ${x.trajectory} | ${u(x.md)} | ${f(x.days, 0)} | ${u(x.cost)} |`));
  w(`Campaign totals (derived by summing the engine rows): ${f(s9.totals.daysDerived, 0)} rig days, ${u(s9.totals.costDerived)} USD, ${m(s9.totals.costMMDerived)} million USD.`);
  w(`Every row divides to the same all-in day: ${u(s9.totals.allInDayDerived)} USD (derived). Trajectory and depth move the DAYS; the day itself is priced the same for a producer, an injector, a vertical well and a horizontal one.`);
  w(`The same four wells at ${u(s9.alternativeRate.rate)} USD a day would cost ${u(s9.alternativeRate.costDerived)} USD (engine): the rig rate is not a detail.`);
  w();
  w('The same depth on three trajectories (engine):');
  s9.trajectories.forEach((x) => w(`- ${x.depthFt} ft ${x.trajectory}: ${f(x.days, 0)} days, ${u(x.cost)} USD.`));
  s9.complexities.forEach((x) => w(`- ${x.depthFt} ft Horizontal at ${x.complexity} complexity: ${f(x.days, 0)} days (engine).`));
  w();
  w('A campaign is as long as its rigs allow (derived: each well goes to the rig that comes free first, taken in the order the wells sit in the plan; a different order can give a different campaign length for the same four wells):');
  s9.campaigns.forEach((c) => w(`- ${c.rigs} rig${c.rigs === 1 ? '' : 's'}: ${f(c.daysDerived, 0)} days, against ${f(c.rigDaysDerived, 0)} rig days of work; the rigs finish at ${c.rigFinishDaysDerived.map((d) => f(d, 0)).join(', ')} days (derived).`));
  w();

  // Section 10
  const s10 = L.facilities();
  w('# SECTION 10: Facilities, sized and priced (owned by Professional m04)');
  w();
  w('| facility | type | nameplate bopd | capex | annual opex | decommissioning | gas capacity Mscf/d | water bopd |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s10.rows.forEach((x) => w(`| ${x.name} | ${x.type} | ${u(x.nameplateCapacity)} | ${m(x.capex)} | ${m(x.opex)} | ${m(x.decommissioning)} | ${u(x.gasCapacity)} | ${u(x.waterHandling)} |`));
  w();
  const sc10 = s10.scaling;
  w(`Scaling from ${u(sc10.fromNameplate)} to ${u(sc10.toNameplate)} bopd, a factor of ${r(sc10.sizeFactorDerived)}: capex rises by ${r(sc10.capexFactorDerived)} and operating cost by ${r(sc10.opexFactorDerived)} (derived). Capex scales with size to the power 0.7 and operating cost to the power 0.6, so two and a half times the size costs ${r(sc10.capexFactorDerived)} times the money, not two and a half times.`);
  w('Decommissioning is 15 percent of the capex the facility carries (engine), on every row:');
  s10.decommissioning.rows.forEach((x) => w(`- ${x.name}: capex ${m(x.capex)}, decommissioning ${m(x.decommissioning)}, share ${r(x.shareDerived)} (derived from the engine's own unrounded values, which is why a share taken from the four decimal figures printed here can land a digit out).`));
  w();
  const ut = s10.utilisation;
  w(`The plan's peak is ${m(ut.peakKbpd)} kbpd, which is ${u(ut.peakBpdDerived)} bopd, and at a gas-oil ratio of ${u(ut.gor)} scf a barrel that is ${u(ut.gasMscfdDerived)} Mscf/d (derived).`);
  ut.rows.forEach((x) => w(`- ${x.name}: oil utilisation ${r(x.oilUtilisationDerived)}, gas utilisation ${r(x.gasUtilisationDerived)} (derived); water handling ${u(x.waterHandling)} bopd against no produced water forecast at all, so there is nothing to divide; bottlenecks ${x.bottlenecks.length ? J(x.bottlenecks) : 'none'} (engine).`));
  w();
  w('Flow assurance runs its own scale, and it is NOT the risk register\'s. The hazard score adds 3 for a subsea tie-back, 2 for oil below 25 API and 4 for any H2S above zero, and the level is High above 5, Medium above 2, and Low otherwise. The register\'s bands (20 Critical, 12 High, 6 Medium) use the same three words on a different quantity, so a score of 3 reads Medium here and Low there.');
  w('Flow assurance on the plan\'s own fluid (engine):');
  s10.flowAssurance.rows.forEach((x) => w(`- ${x.name}: score ${f(x.score, 0)}, level ${x.level}, hazards ${x.hazards.length ? J(x.hazards) : 'none'}.`));
  w(`- the same tie-back on a fluid carrying ${s10.flowAssurance.h2sProbe.h2sPpm} ppm H2S: ${J(s10.flowAssurance.h2sProbe.hazards)} (engine).`);
  w('# Commentary: without an H2S figure the corrosion screen cannot fire at all, so a blank field reads as no corrosion risk rather than as an unknown. The screen also fires at ANY H2S above zero and always at High, so it separates a measured field from an unmeasured one and never one sour field from another.');
  w();

  // Section 11
  const s11 = L.riskRegister();
  w('# SECTION 11: One risk scale (owned by Professional m05)');
  w();
  w('The bands, and they are the only ones in the studio: 20 and above Critical, 12 and above High, 6 and above Medium, below that Low.');
  w('| probability | impact | score | band |');
  w('| --- | --- | --- | --- |');
  s11.bands.forEach((b) => w(`| ${b.probability} | ${b.impact} | ${f(b.score, 0)} | ${b.level} |`));
  w();
  w('| risk | source | probability | impact | score | band | cost impact | mitigation |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s11.rows.forEach((x) => w(`| ${x.name} | ${x.source} | ${x.probability ?? 'none'} | ${x.impact ?? 'none'} | ${x.score === null ? 'none' : f(x.score, 0)} | ${x.band} | ${m(x.costImpact)} | ${x.mitigation} |`));
  w();
  w(`By band (engine): Critical ${s11.levels.Critical}, High ${s11.levels.High}, Medium ${s11.levels.Medium}, Low ${s11.levels.Low}, Unscored ${s11.levels.Unscored}.`);
  w(`The HSE matrix on the same register (engine): critical ${s11.matrix.critical}, high ${s11.matrix.high}, medium ${s11.matrix.medium}, low ${s11.matrix.low}, unscored ${s11.matrix.unscored}, total ${s11.matrix.total}. The two agree because there is one scale.`);
  w(`Consolidated score ${f(s11.consolidated, 0)}, unscored risks ${s11.unscoredCount}, portfolio health ${f(s11.health, 0)} (engine).`);
  w(`The same register with the unscored risk left out entirely: health ${f(s11.healthWithoutUnscored, 0)} (engine). An unscored risk neither helps nor hurts: it is reported as unscored.`);
  w(`Risk exposure, the expected monetary value at the engine's probability factors: ${m(s11.exposure)} million USD (engine).`);
  w('- the factors, by probability: 1 gives 0.05, 2 gives 0.20, 3 gives 0.40, 4 gives 0.60, 5 gives 0.85.');
  w('- every contribution (derived: the factor for that risk\'s probability times its cost impact):');
  s11.contributions.forEach((x) => w(`  - ${x.name}: ${x.probability === null ? 'no probability, so no factor and no contribution' : `${r(x.factor)} x ${m(x.costImpact)} = ${m(x.contributionDerived)}`}`));
  w(`- the five cost impacts add to ${m(s11.costImpactTotalDerived)} million USD (derived), which is what the register would cost if every risk happened. The exposure of ${m(s11.exposure)} is not that number and is not a worst case.`);
  w(`- the unscored risk carries a cost impact of ${m(s11.unscored.costImpact)} and an impact of ${s11.unscored.impact}, and contributes ${m(s11.unscored.contributionDerived)} to the exposure because its probability is missing (engine).`);
  w();
  w(`By source (engine): ${J(s11.bySource)}.`);
  w();
  w('Published risk sets:');
  s11.published.forEach((c) => w(`- ${c.name}: consolidated ${c.consolidatedScore === null ? 'null' : f(c.consolidatedScore, 0)}, exposure ${m(c.exposure)}, health ${f(c.health, 0)}, by level ${J(c.byLevel)} (golden).`));
  w();

  // Section 12
  const s12 = L.documentRollups();
  w('# SECTION 12: The document, and what it reports (owned by Professional m06)');
  w();
  w('The generated plan reports what is there and what is missing. It does not fill gaps.');
  w(`- EGINA: completeness ${s12.completeness} percent; the sections it checks are ${J(s12.modules)}.`);
  s12.breakdown.forEach((c) => w(`  - ${c.module}: ${c.valid}`));
  w(`- the headline figures it carries: P50 oil ${m(s12.headline.oilP50)} MMbbl, P50 gas ${m(s12.headline.gasP50)} Bcf, total CAPEX ${m(s12.headline.totalCapex)} $MM, NPV ${m(s12.headline.npv)} $MM, IRR ${s12.headline.irr === null ? 'none' : pc(s12.headline.irr)}, wells ${s12.headline.wells}.`);
  w();
  w('Cost roll-ups the document prints (engine):');
  w(`- total CAPEX ${m(s12.totals.capex)}, total OPEX ${m(s12.totals.opex)}.`);
  s12.published.forEach((c) => w(`- published ${c.name}: CAPEX ${m(c.totalCAPEX)}, OPEX ${m(c.totalOPEX)} (golden).`));
  w();

  // Section 13
  const s13 = L.rateOfReturn();
  w('# SECTION 13: The rate of return, and when there is none (owned by Expert m01 and Expert m02)');
  w();
  w('The internal rate of return is the discount rate at which the net present value is zero. It exists only when the cash flow changes sign, it is not unique when the flow changes sign more than once, and it can be outside the range a solver searches.');
  w(`The engine searches between ${s13.band.low} and ${s13.band.high} percent and reports a rate only when it is a root inside that band. Otherwise irr is null and irrStatus says which of these happened: ${J(s13.statuses)}.`);
  w('# App surface: the scenario card colours an internal rate of return of 15 percent or more green and anything below it amber, which is the only hurdle rate anywhere in the studio. It is a colour on a card and not a decision rule, and it says nothing about how much money a scenario carries.');
  w();
  w('| case | NPV | IRR | status |');
  w('| --- | --- | --- | --- |');
  s13.rows.forEach((x) => w(`| ${x.label} | ${m(x.npv)} | ${x.irr === null ? 'none' : pc(x.irr)} | ${x.irrStatus} |`));
  w();
  w('Published cases where the rate is not reportable (golden expectations, engine agrees):');
  s13.published.forEach((c) => w(`- ${c.name}: NPV ${m(c.npv)}, status ${c.irrStatus}${c.hiddenRootPercent === null ? '' : `, the true root the band hides ${pc(c.hiddenRootPercent)} percent (golden)`}.`));
  w();
  if (s13.recovered) {
    w(`- ${s13.recovered.name}: NPV ${m(s13.recovered.npv)}, IRR ${pc(s13.recovered.irr)} percent, status ${s13.recovered.irrStatus}. A negative rate is a real answer: it says what the money earned, which is less than none.`);
  }
  w('# Commentary: a clamped search that stops at its own boundary has not found a rate. Reporting the boundary as the answer put an internal rate of return of exactly 1000 percent, the upper edge of the band, in green on cards for projects that never return their money.');
  w();
  w('MORE THAN ONE ROOT, which is what an end-of-life cost does to a rate of return:');
  const mr = s13.multipleRoots;
  w(`The EGINA plan spends ${m(mr.capexMM)} in year 0, earns for ${mr.years} years, and pays ${m(mr.abandonmentMM)} to abandon in the last of them. Its net cash flow therefore changes sign TWICE, and by Descartes' rule a flow that changes sign twice can be zeroed at more than one discount rate. The engine finds every root, reports irr null and irrStatus multiple-roots, and lists them:`);
  w('| case | NPV | status | the rates that zero this flow, percent |');
  w('| --- | --- | --- | --- |');
  mr.rows.forEach((x) => w(`| ${x.label} | ${m(x.npv)} | ${x.irrStatus} | ${x.roots === null ? 'none: the flow is negative at every rate the engine searches' : x.roots.map((y) => pc(y)).join(' and ')} |`));
  w(`- The same Base case with no end-of-life cost reports a single rate of ${pc(mr.withoutEnd.irr)} percent at status ${mr.withoutEnd.irrStatus} (engine). One line of cost, and the question "what is the rate of return" stops having an answer.`);
  w('- NEITHER root is the rate of return. They are the two discount rates at which this flow is worth nothing, and between them the plan is worth more than nothing. Quoting the higher one alone is the mistake the multiple-roots status exists to stop, and quoting the lower one as a loss is the same mistake upside down.');
  w('- A rate of return is only a summary of a flow that spends once and earns thereafter. Charge a real end-of-life cost and most development plans stop being that shape, which is why the NPV, and not the rate, is what a plan is judged on.');
  w();
  w('The payback the same cases report:');
  s13.paybacks.forEach((x) => w(`- ${x.label}: ${x.payback === null ? 'never pays back (null, not the project life)' : `${m(x.payback)} years`} (engine).`));
  w();

  // Section 14
  const s14 = L.sensitivitySweep();
  w('# SECTION 14: What a sensitivity says, and what it does not (owned by Expert m03)');
  w();
  w('The sweep moves one driver at a time by 30 percent either way and re-runs the whole case. It is not a probability: nothing here says how likely a 30 percent move is.');
  w('| driver | minus 30 percent | plus 30 percent | base | swing | swing as a share of base |');
  w('| --- | --- | --- | --- | --- | --- |');
  s14.rows.forEach((s) => w(`| ${s.name} | ${m(s.lowParamNPV)} | ${m(s.highParamNPV)} | ${m(s.baseNPV)} | ${m(s.swingDerived)} | ${r(s.swingShareDerived)} (derived) |`));
  w();
  w(`Ranked by swing (derived): ${s14.rankedBySwingDerived.join(', ')}.`);
  w('- Oil price and production both scale revenue, but production also scales the variable operating cost the barrels carry, so production swings the NPV less than price does.');
  w(`- The capex bar runs the other way: more capex is less value. At minus 30 percent capex the NPV is ${m(s14.capexRow.lowParamNPV)} and at plus 30 percent it is ${m(s14.capexRow.highParamNPV)} (engine).`);
  w();
  w('Published sensitivity cases:');
  s14.published.forEach((c) => {
    const fiscal = c.fiscal ? ` on royalty ${pc(c.fiscal.royaltyRate)} percent and tax ${pc(c.fiscal.taxRate)} percent` : ' on the default fiscal terms';
    w(`- ${c.name}: capex ${m(c.capexMM)}, operating cost ${m(c.annualOpexMM)} a year, ${c.years} producing years at ${m(c.priceUsd)} USD a barrel${fiscal}; base ${m(c.baseNPV)}; ${c.drivers.map((x) => `${x.name} ${m(x.lowParamNPV)} to ${m(x.highParamNPV)}`).join('; ')}.`);
  });
  w();

  // Section 15
  const s15 = L.earnedValue();
  w('# SECTION 15: Earned value, measured to a date (owned by Expert m04 and Expert m05)');
  w();
  w('| task | planned cost | actual cost | percent complete | window |');
  w('| --- | --- | --- | --- | --- |');
  s15.tasks.forEach((t) => w(`| ${t.name} | ${u(t.plannedCost)} | ${u(t.actualCost)} | ${pc(t.percentComplete)} | ${t.plannedStart} to ${t.plannedEnd} |`));
  w();
  w('| as of | planned value | earned value | actual cost | SPI | CPI | completion ratio |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s15.asOfRows.forEach((e) => w(`| ${e.asOf} | ${e.pv === null ? 'none' : u(e.pv)} | ${u(e.ev)} | ${u(e.ac)} | ${e.spi === null ? 'none' : r(e.spi)} | ${e.cpi === null ? 'none' : r(e.cpi)} | ${e.completionRatio === null ? 'none' : r(e.completionRatio)} |`));
  w();
  const mid = s15.mid;
  w(`Budget at completion ${u(mid.bac)} (engine). At ${mid.asOf} the plan said ${u(mid.pv)} should have been earned and ${u(mid.ev)} was, which is a schedule index of ${r(mid.spi)}; ${u(mid.ac)} had been spent on ${u(mid.ev)} of value, a cost index of ${r(mid.cpi)}.`);
  w(`The completion ratio at the same date is ${r(mid.completionRatio)}: that is progress against the WHOLE budget, and it is not a schedule index. Before this course's repair the app called that ratio SPI, so a project half finished on time and one half finished a year late both read ${r(mid.oldRatioExample)}.`);
  w(`The basis the engine states: "${mid.spiBasis}".`);
  w('# Commentary: before this repair an index with no denominator was reported as a clean 1.00 and printed as "Under Budget", and percent complete came back as the string "NaN", which one card read as a zero and labelled "Behind Schedule". A null says the measurement does not exist; a 1.00 says the project is exactly on plan.');
  w('# Commentary: earned value is NOT time-phased. It is each task\'s budget times the percent complete somebody typed, and there is no history of when that percent was measured, so it reads the same at every as-of date. That is why the first row below reports value earned on a date before the first window opens: the planned value knows the calendar and the progress figure does not.');
  w();
  w('A schedule index can read above 1, which the old ratio never could:');
  w(`- one task, ${pc(s15.ahead.percentComplete)} percent done half way through its window: SPI ${r(s15.ahead.spi)}, completion ratio ${r(s15.ahead.completionRatio)} (engine).`);
  w(`- add one costed task to ODUDU-2, a planned cost of ${u(s15.undated.plannedCost)} at ${pc(s15.undated.percentComplete)} percent complete and no dates on it, read at the same ${s15.undated.asOf}: SPI ${s15.undated.spi === null ? 'none' : r(s15.undated.spi)}, and the engine says why: "${s15.undated.spiBasis}". Budget at completion rises to ${u(s15.undated.bac)}, earned value to ${u(s15.undated.ev)}, and the completion ratio reads ${r(s15.undated.completionRatio)}.`);
  s15.zeroCost.forEach((z, i) => w(`- ${i === 0 ? `a planned cost read as zero, ${z.taskName}` : `the same on ${z.taskName}`} at ${pc(z.percentComplete)} percent complete: budget at completion ${u(z.bac)}, earned value ${u(z.ev)}, completion ratio ${r(z.completionRatio)}, SPI ${r(z.spi)} (engine).`));
  w(`# Commentary: a cost read as zero takes the task's budget out of the denominator AND the value it had already earned out of the numerator. The completion ratio therefore rises only when the dropped task's own progress is BELOW the project's ratio of ${r(mid.completionRatio)}: ${s15.zeroCost[1].taskName} at ${pc(s15.zeroCost[1].percentComplete)} percent raises it to ${r(s15.zeroCost[1].completionRatio)}, ${s15.zeroCost[0].taskName} at ${pc(s15.zeroCost[0].percentComplete)} percent LOWERS it to ${r(s15.zeroCost[0].completionRatio)}. The schedule index moves only when the dropped task's window is open at the as-of date: ${s15.zeroCost[0].taskName}'s is, so SPI rises to ${r(s15.zeroCost[0].spi)}; ${s15.zeroCost[1].taskName}'s has not opened, so it contributed nothing to planned value and SPI stays at ${r(mid.spi)}.`);
  w(`- a project with no costed task at all: SPI ${s15.uncosted.spi === null ? 'none' : r(s15.uncosted.spi)}, CPI ${s15.uncosted.cpi === null ? 'none' : r(s15.uncosted.cpi)}, percent complete ${s15.uncosted.percentComplete === null ? 'none' : pc(s15.uncosted.percentComplete)}, basis "${s15.uncosted.spiBasis}".`);
  w();
  w('What it refuses (published EVM refusals, engine messages verbatim):');
  s15.refusals.forEach((c) => w(`- ${c.name}: ${refusal(c)}`));
  w(`- an as-of date that is not a date: ${refusal(s15.badAsOfRefusal)}`);
  w();
  w('Published EVM cases. These are rounding and edge fixtures, so their money is printed to four decimals: rounded to whole units the indexes beside them would not reconcile with the money.');
  s15.published.forEach((c) => w(`- ${c.name} (as of ${c.asOf}): PV ${c.pv === null ? 'none' : uf(c.pv)}, EV ${uf(c.ev)}, AC ${uf(c.ac)}, SPI ${c.spi === null ? 'none' : r(c.spi)}, CPI ${c.cpi === null ? 'none' : r(c.cpi)}.`));
  w();

  // Section 16
  const s16 = L.reconciliations();
  w('# SECTION 16: Reading a plan against itself (owned by Expert m06)');
  w();
  w('Three numbers in an FDP are easy to confuse, and the studio now shows all three:');
  w(`- the concept's capex, ${m(s16.cost.conceptCapex)} million USD, which is what the development is estimated to cost, and which carries drilling ${m(s16.cost.conceptDrillingCapex)}, facilities ${m(s16.cost.conceptFacilitiesCapex)} and subsea ${m(s16.cost.conceptSubseaCapex)};`);
  w(`- the cost items' CAPEX total, ${m(s16.cost.costItemsCapex)} million USD, which is what the plan has budgeted line by line;`);
  w(`- the facility screening estimate, ${m(s16.cost.facilityScreeningCapex)} million USD for the FPSO alone, which is a class 5 figure from type and nameplate (engine).`);
  w('They are three different estimates of overlapping things, and the overlap has to be matched before the numbers mean anything.');
  w(`The comparison that is like for like is the facility screening estimate of ${m(s16.cost.facilityScreeningCapex)} against the concept's FACILITIES field of ${m(s16.cost.conceptFacilitiesCapex)}, a gap of ${m(s16.cost.likeForLikeGapDerived)} (derived). Setting it against the ${m(s16.cost.conceptCapex)} total instead compares one facility with a development that also drills ${m(s16.cost.conceptDrillingCapex)} of wells and lays ${m(s16.cost.conceptSubseaCapex)} of subsea.`);
  w();
  w('The same discipline on the schedule:');
  w(`- the network says the work must take ${s16.schedule.networkDays} days (engine);`);
  w(`- the dates typed on the activities span ${s16.schedule.calendarDays} days (engine);`);
  w(`- the difference, ${f(s16.schedule.spentFloatDerived, 0)} days, is float somebody has already spent in the calendar (derived).`);
  w();
  w('And on the economics:');
  w(`- the Base scenario on the concept's capex: NPV ${m(s16.economics.conceptCaseNpv)} (engine);`);
  w(`- the plan's own cost items at the same price: NPV ${m(s16.economics.planCaseNpv)} (engine);`);
  w(`- the difference is ${m(s16.economics.differenceDerived)} (derived), and it is zero only when the plan is costed against the concept it is running.`);
  w();
  w('A screening NPV is not a sanction case. Full fiscal detail under the PIA and the Nigeria Tax Act belongs to Petroleum Economics Studio; the tier here is screening, mid-year discounted, on the stated default terms.');
  w();

  return `${out.join('\n')}\n`;
};

/** Split a digest into its preamble and its sixteen sections, keyed by number. */
const sections = (text) => {
  const out = {};
  let key = 'preamble';
  text.split('\n').forEach((line) => {
    const hit = line.match(/^# SECTION (\d+):/);
    if (hit) key = `S${hit[1]}`;
    (out[key] ||= []).push(line);
  });
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.join('\n')]));
};

const readDigest = () => fs.readFileSync(DIGEST, 'utf8');
const SECTION_KEYS = ['preamble', ...Array.from({ length: 16 }, (_, i) => `S${i + 1}`)];

// ---------------------------------------------------------------------------
// 0. The digest on disk is a real digest, and the lab carries the dump's fields.
// ---------------------------------------------------------------------------

describe('the digest on disk and the teaching fields', () => {
  it('the digest carries a plausible number of literals, so it is not empty or mid-rebuild', () => {
    const literals = readDigest().match(/-?\d+(?:\.\d+)?/g) || [];
    expect(literals.length, 'digest.txt is empty or mid-rebuild').toBeGreaterThan(1000);
    expect(Object.keys(sections(readDigest()))).toEqual(SECTION_KEYS);
  });

  it('the teaching fields are copied verbatim from ec6_fields.mjs, which ec6_dump.mjs imports', () => {
    const src = fs.readFileSync(FIELDS_MJS, 'utf8');
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    const lab = LAB_SOURCE();
    const NAMES = ['EGINA_RESERVOIRS', 'EGINA_CONCEPTS', 'EGINA_SCENARIOS', 'EGINA_COSTS', 'EGINA_SCHEDULE',
      'EGINA_WELLS', 'EGINA_RIG_RATE', 'EGINA_RIG_COUNTS', 'EGINA_FACILITIES', 'EGINA_FLUID',
      'EGINA_RISKS', 'ODUDU_TASKS', 'ODUDU_AS_OF'];
    NAMES.forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in ec6_fields.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
      expect(dump, `${name} is imported by the dump`).toContain(name);
    });
  });

  it('the startDate and endDate mapping the dump makes on the schedule is the lab\'s', () => {
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    expect(dump).toContain('EGINA_SCHEDULE.map((a) => ({ ...a, startDate: a.start, endDate: a.end }))');
    expect(LAB_SOURCE()).toContain('EGINA_SCHEDULE.map((a) => ({ ...a, startDate: a.start, endDate: a.end }))');
  });

  it('the published goldens are both files, whole', () => {
    const c = L.goldenCounts();
    expect(c.fdp).toBeGreaterThan(130);
    expect(c.afe).toBeGreaterThan(100);
  });
});

// ---------------------------------------------------------------------------
// 1 to 16. The rebuilt digest, section by section and then whole.
// ---------------------------------------------------------------------------

describe('THE DIGEST, REBUILT FROM LAB RETURN VALUES, BYTE FOR BYTE', () => {
  const titles = {
    preamble: 'the title and the units line',
    S1: 'what a plan holds, and the refusals',
    S2: 'reserves, one total per fluid',
    S3: 'concepts and the capex a concept carries',
    S4: 'what a scenario is worth',
    S5: 'the plan\'s own economics and the sweep',
    S6: 'the plan that cannot be costed yet',
    S7: 'the schedule as a network',
    S8: 'dates that do not move',
    S9: 'wells, and what a rig day costs',
    S10: 'facilities, sized and priced',
    S11: 'one risk scale',
    S12: 'the document and what it reports',
    S13: 'the rate of return, and when there is none',
    S14: 'what a sensitivity says and does not',
    S15: 'earned value, measured to a date',
    S16: 'reading a plan against itself',
  };
  const built = sections(buildDigest());
  const onDisk = sections(readDigest());

  SECTION_KEYS.forEach((k) => {
    it(`${k === 'preamble' ? 'Preamble' : `Section ${k.slice(1)}`}: ${titles[k]}`, () => {
      expect(built[k], `${k} rebuilt`).toBeDefined();
      expect(built[k]).toBe(onDisk[k]);
    });
  });

  it('the whole digest, every line, is the lab', () => {
    const text = buildDigest();
    if (process.env.EC6_WRITE_BUILT) {
      // The timezone gate's child hands its rebuild back through this file,
      // with the zone it actually ran in so the parent can prove it moved.
      fs.writeFileSync(process.env.EC6_WRITE_BUILT, JSON.stringify({
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offsetMinutes: new Date('2027-04-01T00:00:00Z').getTimezoneOffset(),
        text,
      }));
    }
    expect(text.split('\n').length).toBe(readDigest().split('\n').length);
    expect(text).toBe(readDigest());
  });

  it('NEGATIVE CONTROL: one engine value moved by a single unit in the last printed place is a failed section', () => {
    const text = buildDigest().replace('| a1 Project sanction | 0 | 0 | 0 | 0 | 0 | 0 | true |', '| a1 Project sanction | 0 | 0 | 0 | 0 | 0 | 1 | true |');
    expect(sections(text).S7).not.toBe(onDisk.S7);
    expect(sections(text).S6).toBe(onDisk.S6);
  });
});

// ---------------------------------------------------------------------------
// Spot pins that say what the rebuild means.
// ---------------------------------------------------------------------------

describe('what the teaching fields show', () => {
  it('EC6-0: the critical path is a1, a3, a4, a7, a8 and three activities carry float', () => {
    const n = L.network();
    expect(n.paths).toEqual([['a1', 'a3', 'a4', 'a7', 'a8']]);
    expect(n.duration).toBe(870);
    expect(n.withFloat).toEqual([{ id: 'a2', float: 180 }, { id: 'a5', float: 180 }, { id: 'a6', float: 480 }]);
    expect(n.calendarSpan).toBe(933);
    expect(L.reconciliations().schedule.spentFloatDerived).toBe(63);
  });

  it('EC6-8: charging the end-of-life cost leaves the Base case with two roots and no single rate', () => {
    const ror = L.rateOfReturn();
    const rows = ror.rows;
    const stress = rows.find((x) => x.label === 'EGINA at 18 USD a barrel');
    expect(stress.irr).toBeNull();
    expect(stress.irrStatus).toBe('no-root');
    const base = rows.find((x) => x.label === 'EGINA Base, 70 USD a barrel');
    // The repair: the same case reported 'ok' and a single rate while the
    // plan's ABEX line reached no cash flow.
    expect(base.irr).toBeNull();
    expect(base.irrStatus).toBe('multiple-roots');
    expect(ror.multipleRoots.withoutEnd.irrStatus).toBe('ok');
    expect(ror.multipleRoots.withoutEnd.irr).toBeGreaterThan(0);
    const baseRoots = ror.multipleRoots.rows[0].roots;
    expect(baseRoots).toHaveLength(2);
    expect(baseRoots[0]).toBeLessThan(0);
    expect(baseRoots[1]).toBeGreaterThan(0);
    // Every earning case is two-rooted now, and the losing one has no root.
    expect(ror.multipleRoots.rows.map((x) => x.irrStatus)).toEqual(
      ['multiple-roots', 'multiple-roots', 'multiple-roots', 'multiple-roots', 'no-root'],
    );
    expect([...new Set(rows.map((x) => x.irrStatus))].every((s) => L.IRR_STATUSES.includes(s))).toBe(true);
    // Not a clamp: nothing reports the boundary of the search band as an answer.
    expect(rows.every((x) => x.irr !== L.IRR_BAND.high)).toBe(true);
  });

  it('EC6-1: reserves total per fluid, and the two totals are never added by the engine', () => {
    const s = L.reservesPerFluid();
    expect(s.byFluid.map((x) => [x.fluid, x.units])).toEqual([['Oil', 'MMbbl'], ['Gas', 'Bcf']]);
    expect(s.oilP50).toBe(130);
    expect(s.gasP50).toBe(70);
    expect(s.addedAcrossFluidsDerived).toBe(200);
  });

  it('EC6-1: one risk scale with an Unscored band, and an unscored risk changes neither health nor exposure', () => {
    const r = L.riskRegister();
    expect(r.levels).toEqual({ Critical: 1, High: 1, Medium: 1, Low: 1, Unscored: 1 });
    expect(r.matrix.unscored).toBe(1);
    expect(r.health).toBe(r.healthWithoutUnscored);
    expect(r.unscored.contributionDerived).toBe(0);
    expect(Number.isNaN(r.consolidated)).toBe(false);
  });

  it('EC6-1: planned value is time-phased to the as-of date, and the completion ratio is not an index', () => {
    const e = L.earnedValue();
    const pvs = e.asOfRows.map((x) => x.pv);
    expect(new Set(pvs).size).toBe(pvs.length);
    expect(new Set(e.asOfRows.map((x) => x.completionRatio)).size).toBe(1);
    expect(e.mid.spiBasis).toBe('planned value time-phased to the as-of date');
    expect(e.ahead.spi).toBeGreaterThan(1);
    expect(e.uncosted.spiBasis).toBe('no costed task, so there is no planned value');
  });

  it('EC6-8: every EGINA screening case carries the plan\'s ABEX line as its end-of-life cost', () => {
    const s4 = L.scenarioValues();
    const s5 = L.planEconomics();
    expect(s4.abandonment.source).toBe('abex-item');
    expect(s4.abandonment.amountMM).toBe(s5.abexAmount);
    // Charged in the final production year, which is the twentieth.
    expect(s4.abandonment.year).toBe(s5.planRun.years);
    expect(s5.abandonment.source).toBe('abex-item');
    // Leaving it out was worth real money, and both numbers are engine NPVs.
    expect(s5.abandonment.withoutNpv).toBeGreaterThan(s5.planRun.npv);
    expect(s5.abandonment.costDerived).toBeCloseTo(s5.abandonment.withoutNpv - s5.planRun.npv, 12);
    // The capstone is charged its own plan's ABEX line, not EGINA's.
    const runs = L.ukotRuns();
    expect(runs.base.abandonmentSource).toBe('abex-item');
    expect(runs.base.abandonmentMM).not.toBe(s5.abexAmount);
    expect(runs.base.metrics.irrStatus).toBe('multiple-roots');
    expect(runs.base.metrics.irr).toBeNull();
    expect(runs.base.metrics.irrRoots).toHaveLength(2);
  });

  it('the as-of reader refuses a date the digest does not print', () => {
    expect(() => L.oduduAsOf('2028-12-30')).toThrow(/course's as-of dates only/);
    expect(L.oduduAsOf('2028-01-01').spi).toBeNull();
  });

  it('no reader reads the clock: the lab source never makes an undated Date', () => {
    const src = LAB_SOURCE();
    expect(src).not.toMatch(/new Date\(\)/);
    expect(src).not.toMatch(/Date\.now/);
  });
});

describe('every reader is pure and deterministic', () => {
  const READERS = ['planAndRefusals', 'reservesPerFluid', 'conceptsAndCapex', 'scenarioValues', 'planEconomics',
    'completeness', 'network', 'dates', 'wellsAndRigs', 'facilities', 'riskRegister', 'documentRollups',
    'rateOfReturn', 'sensitivitySweep', 'earnedValue', 'reconciliations', 'endToEnd'];

  it('there is one reader per digest section, and the end to end reading', () => {
    expect(READERS).toHaveLength(17);
    READERS.forEach((name) => expect(typeof LAB[name], name).toBe('function'));
  });

  it('two calls agree, and mutating a result changes neither the next call nor the fields', () => {
    READERS.forEach((name) => expect(LAB[name](), name).toEqual(LAB[name]()));
    const a = L.reservesPerFluid();
    a.reservoirs[0].p50 = 999;
    a.oilP50 = 999;
    expect(L.EGINA_RESERVOIRS[0].p50).toBe(95);
    expect(L.reservesPerFluid().oilP50).toBe(130);
    const n = L.network();
    n.cpm[0].float = 42;
    expect(L.EGINA_SCHEDULE[0].duration).toBe(0);
    expect(L.network().cpm[0].float).toBe(0);
    const e = L.earnedValue();
    e.tasks[0].plannedCost = 1;
    expect(L.ODUDU_TASKS[0].planned_cost).toBe(2400000);
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE. Three clock surfaces: the concept schedule, the calendar
// span and the earned value as-of date. Every one of them is given a date.
// ---------------------------------------------------------------------------

describe('THE CLOCK GATE: no reader reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  const READERS = ['planAndRefusals', 'reservesPerFluid', 'conceptsAndCapex', 'scenarioValues', 'planEconomics',
    'completeness', 'network', 'dates', 'wellsAndRigs', 'facilities', 'riskRegister', 'documentRollups',
    'rateOfReturn', 'sensitivitySweep', 'earnedValue', 'reconciliations', 'endToEnd'];

  const snapshot = () => JSON.stringify(READERS.map((name) => [name, LAB[name]()]).concat(
    L.ODUDU_AS_OF.map((d) => [`oduduAsOf(${d})`, L.oduduAsOf(d)]),
    [['ukotCapstoneFields', L.ukotCapstoneFields()]],
  ));

  it('identical output under two faked system dates, one before EGINA and one far after', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2019-03-03T12:00:00Z'));
    const early = snapshot();
    vi.setSystemTime(new Date('2094-11-21T12:00:00Z'));
    const late = snapshot();
    expect(late.length).toBeGreaterThan(10000);
    expect(late).toBe(early);
  });

  it('CONTROL: the fake clock did move, and both dated engine calls left to their defaults do see it', async () => {
    const PC = await import('@petrolord/engines/engines/economics/projectControls.js');
    const CN = await import('@petrolord/engines/engines/economics/fdp/conceptCalculations.js');
    // Surface 3, the earned value as-of date: calculateEVM defaults asOf to today.
    const undatedEvm = () => PC.calculateEVM(L.ODUDU_TASKS).pv;
    // Surface 1, the concept schedule: calculateConceptSchedule dates from a
    // today the caller states, and a caller who states the clock gets the clock.
    const undatedConcept = () => CN.calculateConceptSchedule({ facilityType: 'FPSO' }, { today: new Date() }).firstOilDate;
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2019-03-03T12:00:00Z'));
    const t1 = Date.now();
    const earlyEvm = undatedEvm();
    const earlyConcept = undatedConcept();
    vi.setSystemTime(new Date('2029-06-30T12:00:00Z'));
    const t2 = Date.now();
    const lateEvm = undatedEvm();
    const lateConcept = undatedConcept();
    expect(new Date(t1).getUTCFullYear()).toBe(2019);
    expect(new Date(t2).getUTCFullYear()).toBe(2029);
    expect(earlyEvm).toBe(0);
    expect(lateEvm).toBeGreaterThan(0);
    expect(earlyConcept).toBe('2022-03-03');
    expect(lateConcept).not.toBe(earlyConcept);
  });

  it('CONTROL: surface 2, the calendar span, has no default at all: it reads only the dates typed on the activities', () => {
    // Nothing to fake. An activity with no readable dates answers null rather
    // than filling the gap from the clock.
    expect(L.dates().undatedSpan).toBeNull();
    expect(L.network().calendarSpan).toBe(933);
  });
});

// ---------------------------------------------------------------------------
// THE TIMEZONE GATE. The whole rebuild, a second time, west of Greenwich.
// EC6-0 is exactly the repair that a date-only string no longer moves with
// the reader's zone, so this must be byte-identical.
// ---------------------------------------------------------------------------

const TZ_CHILD_TZ = 'America/Los_Angeles';

describe('THE TIMEZONE GATE: the digest rebuilds byte for byte west of Greenwich', () => {
  it(`the whole rebuild under TZ=${TZ_CHILD_TZ} is the digest, byte for byte`, () => {
    if (process.env.EC6_TZ_CHILD) return; // the child does not re-spawn itself
    const sidecar = path.join(ROOT, 'node_modules', '.ec6-tz-rebuild.json');
    if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
    execFileSync('npx', ['vitest', 'run', '--reporter=dot', 'src/components/course/panels/fdp/fdpLab.test.js'], {
      cwd: ROOT,
      env: { ...process.env, TZ: TZ_CHILD_TZ, EC6_TZ_CHILD: '1', EC6_WRITE_BUILT: sidecar },
      stdio: 'pipe',
      timeout: 300000,
    });
    const child = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
    fs.unlinkSync(sidecar);
    // CONTROL: the child really did run west of Greenwich.
    expect(child.timeZone).toBe(TZ_CHILD_TZ);
    expect(child.offsetMinutes, 'the child ran at a UTC offset of zero').not.toBe(0);
    expect(child.text).toBe(readDigest());
  }, 300000);

  it('the three date-only surfaces this course prints are the ones EC6-0 repaired', () => {
    // A concept schedule, a calendar span and an earned value window, all
    // parsed from date-only strings, all printed as local calendar days.
    expect(L.conceptsAndCapex().schedules[0].firstOilDate).toBe('2030-04-01');
    expect(L.dates().dstWindow.days).toBe(4);
    expect(L.earnedValue().asOfRows[2].asOf).toBe('2028-12-31');
  });
});

// ---------------------------------------------------------------------------
// THE CAPSTONE: the eighteen graded fields reproduce fields.json exactly.
// ---------------------------------------------------------------------------

const CAPSTONE_FIELDS = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'));

describe('the UKOT and MEREN-3 capstone: the eighteen graded fields reproduce fields.json exactly', () => {
  it('fields.json is the eighteen published fields, six per tier, in the published order', () => {
    expect(CAPSTONE_FIELDS).toHaveLength(18);
    expect(CAPSTONE_FIELDS.map((x) => x[0])).toEqual([
      ...Array(6).fill('beginner'), ...Array(6).fill('intermediate'), ...Array(6).fill('advanced'),
    ]);
  });

  it('every one of the eighteen graded answers and tolerances is EXACTLY the published value', () => {
    const got = L.ukotCapstoneFields();
    expect(got.map((x) => x[1])).toEqual(CAPSTONE_FIELDS.map((x) => x[1]));
    const values = L.ukotCapstoneValues(got);
    const tolerances = L.ukotCapstoneTolerances(got);
    const wrong = [];
    CAPSTONE_FIELDS.forEach(([tier, key, v, tol], i) => {
      if (got[i][0] !== tier) wrong.push(`${key}: tier ${got[i][0]} against ${tier}`);
      if (values[key] !== v) wrong.push(`${tier} ${key}: lab ${values[key]} against published ${v}`);
      if (tolerances[key] !== tol) wrong.push(`${tier} ${key}: tolerance ${tolerances[key]} against published ${tol}`);
    });
    expect(wrong).toEqual([]);
  });

  it('the capstone conditions are copied verbatim from ec6_fields_capstone.mjs', () => {
    const src = fs.readFileSync(CAPSTONE_MJS, 'utf8');
    const lab = LAB_SOURCE();
    ['UKOT_RESERVOIRS', 'UKOT_CONCEPT', 'UKOT_ALTERNATIVE', 'UKOT_BASE', 'UKOT_STRESS', 'UKOT_COSTS',
      'UKOT_SCHEDULE', 'UKOT_WELLS', 'UKOT_RIG_RATE', 'UKOT_FACILITIES', 'UKOT_RISKS',
      'MEREN_TASKS', 'MEREN_AS_OF'].forEach((name) => {
      const a = src.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(a, `${name} in ec6_fields_capstone.mjs`).not.toBeNull();
      expect(b, `${name} in the lab`).not.toBeNull();
      expect(b[1], name).toBe(a[1]);
    });
  });

  it('the capstone never touches the teaching digest, and the digest generator never reads the capstone', () => {
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    ['UKOT', 'MEREN', 'ukot_', 'meren_', 'ec6_fields_capstone'].forEach((needle) => {
      expect(dump, `${needle} appears in ec6_dump.mjs`).not.toContain(needle);
    });
    expect(readDigest().toLowerCase()).not.toContain('ukot');
    expect(readDigest().toLowerCase()).not.toContain('meren');
  });
});

// ---------------------------------------------------------------------------
// THE LEAK GATE: no teaching number may be a graded capstone answer.
// ---------------------------------------------------------------------------

/** Exports that TAKE AN ARGUMENT. Each is walked below at every argument a panel hands it. */
const ARG_REQUIRED = ['oduduAsOf', 'leakGuardTargets', 'leakGuardHit', 'collectNumbers'];
const GATE_MACHINERY = ['LEAK_GUARD_MARGIN', 'LEAK_GUARD_SCALINGS'];

/**
 * A surface smaller than this is not the lab: refuse to call it clean. The
 * full lab walks 63 entries and about 1180 numbers (measured 2026-09-15);
 * the floor sits below that by less than any one large reader (earnedValue
 * alone is over a hundred numbers), so losing a reader to a rename trips it.
 */
const MIN_SURFACE_ENTRIES = 40;
const MIN_SURFACE_NUMBERS = 1000;

/** Every teaching export evaluated: constants as they are, readers called bare, the rest at every panel argument. */
const teachingSurface = () => {
  const out = [];
  Object.entries(L).forEach(([name, value]) => {
    if (L.CAPSTONE_ONLY_EXPORTS.includes(name) || ARG_REQUIRED.includes(name) || GATE_MACHINERY.includes(name)) return;
    out.push({ name, value: typeof value === 'function' ? value() : value });
  });
  L.ODUDU_AS_OF.forEach((d) => out.push({ name: `oduduAsOf(${d})`, value: L.oduduAsOf(d) }));
  return out;
};

const surfaceNumbers = (surface) => surface.flatMap((s) => L.collectNumbers(s.value, s.name));

const assertPlausible = (surface, numbers) => {
  if (surface.length < MIN_SURFACE_ENTRIES || numbers.length < MIN_SURFACE_NUMBERS) {
    throw new Error(`the teaching surface has only ${surface.length} entries and ${numbers.length} numbers: refusing to call it clean`);
  }
};

const leakHits = (surface, targets) => surfaceNumbers(surface)
  .map((n) => ({ n, t: L.leakGuardHit(n.value, targets) }))
  .filter((x) => x.t)
  .map(({ n, t }) => `${n.path} = ${n.value} is within ${t.band} of ${t.key} ${t.tag} (${Math.abs(n.value - t.value) / t.gradingBand} grading bands)`);

describe('THE LEAK GATE: the guard itself', () => {
  const targets = L.leakGuardTargets(CAPSTONE_FIELDS);

  it('the guard is built from all eighteen fields in all three unit shiftings, with the band scaled', () => {
    expect(targets).toHaveLength(18 * 3);
    expect(L.LEAK_GUARD_MARGIN).toBe(10);
    expect(L.LEAK_GUARD_SCALINGS.map((s) => s.factor)).toEqual([1, 1000, 0.001]);
    const t = (key, tag) => targets.find((x) => x.key === key && x.tag === tag);
    expect(t('ukot_uk01_well_cost_usd', 'as graded').band).toBeCloseTo(10, 12);
    expect(t('ukot_uk01_well_cost_usd', 'x0.001').band).toBeCloseTo(0.01, 12);
    expect(t('meren_spi', 'x1000').band).toBeCloseTo(0.1, 9);
  });

  it('every reader answers, and the surface is large enough to mean something', () => {
    const surface = teachingSurface();
    surface.forEach((s) => expect(s.value, `${s.name} returned nothing`).not.toBeUndefined());
    const numbers = surfaceNumbers(surface);
    // eslint-disable-next-line no-console
    console.log(`teaching surface: ${surface.length} entries, ${numbers.length} numbers`);
    expect(() => assertPlausible(surface, numbers)).not.toThrow();
  });

  it('THE GUARD REFUSES AN EMPTY OR TINY SURFACE rather than calling it clean', () => {
    const surface = teachingSurface();
    expect(() => assertPlausible([], [])).toThrow(/refusing/);
    expect(() => assertPlausible(surface.slice(0, 5), surfaceNumbers(surface.slice(0, 5)))).toThrow(/refusing/);
  });

  it('every export is accounted for: walked bare, walked with arguments, capstone or machinery', () => {
    const exported = Object.keys(L);
    ARG_REQUIRED.forEach((k) => expect(exported, k).toContain(k));
    exported.filter((k) => typeof LAB[k] === 'function' && LAB[k].length > 0 && !ARG_REQUIRED.includes(k)
      && !L.CAPSTONE_ONLY_EXPORTS.includes(k))
      .forEach((k) => expect(LAB[k].length, `${k} has a required argument and is not in ARG_REQUIRED`).toBe(0));
  });

  it('the teaching surface names no capstone export and no capstone field, and carries no em dash or en dash', () => {
    const text = JSON.stringify(teachingSurface());
    L.CAPSTONE_ONLY_EXPORTS.forEach((name) => {
      if (name === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(text, `${name} appears in the teaching surface`).not.toContain(name);
    });
    expect(text.toLowerCase()).not.toContain('ukot');
    expect(text.toLowerCase()).not.toContain('meren');
    L.UKOT_RESERVOIRS.forEach((x) => expect(text).not.toContain(`"${x.id}"`));
    L.UKOT_WELLS.forEach((x) => expect(text).not.toContain(`"${x.name}"`));
    L.MEREN_TASKS.forEach((x) => expect(text).not.toContain(`"${x.name}"`));
    expect(text).not.toMatch(/[–—]/);
  });

  it('THE GUARD IS LIVE: every graded answer, planted, is caught in every shifting, however deep', () => {
    CAPSTONE_FIELDS.forEach(([, key, v, tol]) => {
      const drift = 0.9 * L.LEAK_GUARD_MARGIN * tol;
      [v, v + drift, v - drift].forEach((planted) => {
        expect(L.leakGuardHit(planted, targets), `${key} ${planted}`).not.toBeNull();
        expect(L.leakGuardHit(planted * 1000, targets), `${key} x1000`).not.toBeNull();
        expect(L.leakGuardHit(planted / 1000, targets), `${key} x0.001`).not.toBeNull();
      });
      const buried = L.collectNumbers({ a: [{ b: v }] })[0].value;
      expect(targets.filter((t) => Math.abs(buried - t.value) < t.band).map((t) => t.key), key).toContain(key);
    });
  });

  it('THE GUARD GOES RED ON A PLANTED LEAK in a real reader\'s output, and is clean again without it', () => {
    const surface = teachingSurface();
    const graded = CAPSTONE_FIELDS.find((x) => x[1] === 'meren_spi')[2];
    const planted = surface.map((s) => (s.name === 'earnedValue'
      ? { ...s, value: { ...s.value, mid: { ...s.value.mid, spi: graded + 0.00004 } } }
      : s));
    const hits = leakHits(planted, targets);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/^earnedValue\.mid\.spi = .* of meren_spi as graded/);
    expect(leakHits(surface, targets)).toEqual([]);
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: the teaching headlines pass', () => {
    const e = L.endToEnd();
    expect(L.leakGuardHit(e.base.npv, targets)).toBeNull();
    expect(L.leakGuardHit(e.network.duration, targets)).toBeNull();
    expect(L.leakGuardHit(e.earned.spi, targets)).toBeNull();
    [NaN, Infinity, -Infinity].forEach((x) => expect(L.leakGuardHit(x, targets)).toBeNull());
    expect(L.collectNumbers({ a: NaN, b: null, c: 'text', d: undefined })).toEqual([]);
  });
});

describe('THE LEAK GATE: no teaching number may be a graded capstone answer', () => {
  it('NO number returned by any teaching export is within ten grading bands of a graded answer, in any shifting', () => {
    const targets = L.leakGuardTargets(CAPSTONE_FIELDS);
    const surface = teachingSurface();
    assertPlausible(surface, surfaceNumbers(surface));
    expect(leakHits(surface, targets)).toEqual([]);
  });

  it('every number PRINTED IN THE DIGEST stands clear of a graded answer too', () => {
    // A substring search over a page of four decimal money is meaningless: the
    // digits 74 sit inside 1174.0000. So the digest's own literals are parsed
    // and run through the same numeric guard.
    const targets = L.leakGuardTargets(CAPSTONE_FIELDS);
    const literals = (readDigest().match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
    expect(literals.length).toBeGreaterThan(1000);
    const hits = literals.map((v) => ({ v, t: L.leakGuardHit(v, targets) })).filter((x) => x.t)
      .map(({ v, t }) => `the digest prints ${v}, within ${t.band} of ${t.key} ${t.tag}`);
    expect([...new Set(hits)]).toEqual([]);
  });
});
