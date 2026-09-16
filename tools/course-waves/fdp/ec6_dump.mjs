// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of fdp_cases.json and
// afe_cases.json (plus sweeps around those published inputs) and the TEACHING
// FIELDS this wave designed for itself: the EGINA development plan and the
// ODUDU-2 project schedule. THE EC6 CAPSTONE RUNS DIFFERENT CONDITIONS
// ENTIRELY: nothing here imports, reads or reproduces the capstone generator,
// fields.json, or any capstone field name, capex, rate, date, cost line,
// activity or task.
//
// Usage:  sh /root/ec-wip-fdp/build_digest.sh > /root/ec-wip-fdp/digest.tmp \
//           && mv /root/ec-wip-fdp/digest.tmp /root/ec-wip-fdp/digest.txt
//
// Engines, as repaired before this course in EC6-0 and EC6-1 (engines #179 and
// #180): engines/economics/fdp/* (the FDP Accelerator), projectControls.js
// (Project Management Pro) and screening.js (the shared screening economics).
// Every call that could read a clock is given an explicit date, so no line
// below depends on the day this script runs.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from a published case's expected block) or
// "derived" (arithmetic on engine values printed on the same row or block,
// with the arithmetic stated).

import fs from 'fs';
import {
  EGINA_RESERVOIRS, EGINA_CONCEPTS, EGINA_SCENARIOS, EGINA_COSTS, EGINA_SCHEDULE,
  EGINA_WELLS, EGINA_RIG_RATE, EGINA_RIG_COUNTS, EGINA_FACILITIES, EGINA_FLUID,
  EGINA_RISKS, ODUDU_TASKS, ODUDU_AS_OF,
} from '/root/ec-wip-fdp/ec6_fields.mjs';

const ROOT = process.env.EC6_ENGINES || '/root/wt-ec6-abex/packages/engines';
const E = await import(`${ROOT}/engines/economics/fdp/economics.js`);
const SC = await import(`${ROOT}/engines/economics/fdp/scenarioCalculations.js`);
const CO = await import(`${ROOT}/engines/economics/fdp/costCalculations.js`);
const CN = await import(`${ROOT}/engines/economics/fdp/conceptCalculations.js`);
const SB = await import(`${ROOT}/engines/economics/fdp/subsurfaceCalculations.js`);
const WL = await import(`${ROOT}/engines/economics/fdp/wellCalculations.js`);
const FA = await import(`${ROOT}/engines/economics/fdp/facilitiesCalculations.js`);
const HS = await import(`${ROOT}/engines/economics/fdp/hseCalculations.js`);
const RK = await import(`${ROOT}/engines/economics/fdp/riskCalculations.js`);
const RM = await import(`${ROOT}/engines/economics/fdp/riskModel.js`);
const SH = await import(`${ROOT}/engines/economics/fdp/scheduleCalculations.js`);
const FD = await import(`${ROOT}/engines/economics/fdp/fdpCalculations.js`);
const PC = await import(`${ROOT}/engines/economics/projectControls.js`);
const G = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/fdp_cases.json`, 'utf8'));
const byName = (list) => Object.fromEntries(list.map((c) => [c.name, c]));

const out = [];
const w = (s = '') => out.push(s);
const f = (x, n) => (x === null || x === undefined || Number.isNaN(Number(x)) ? 'null' : Number(x).toFixed(n));
const m = (x) => f(x, 4);    // plan money, $MM
const u = (x) => f(x, 0);    // whole currency units
const uf = (x) => f(x, 4);   // currency units where the fixture is sub-unit
const r = (x) => f(x, 6);    // ratios
const pc = (x) => f(x, 4);   // percents
const attempt = (fn) => { try { return { ok: true, value: fn() }; } catch (e) { return { ok: false, error: e.message, name: e.name }; } };
const refusal = (a) => (a.ok ? 'accepted' : `${a.name}: "${a.error}"`);

// The schedule rows carry `start` and `end`; the engine's calendar span reads
// `startDate` and `endDate`, the same mapping the studio makes.
const NETWORK = EGINA_SCHEDULE.map((a) => ({ ...a, startDate: a.start, endDate: a.end }));

const FPSO = EGINA_CONCEPTS[0];
const TIEBACK = EGINA_CONCEPTS[1];
const BASE = EGINA_SCENARIOS[0];

// EC6-8 (engines #183/#191). A plan's end-of-life cost. planAbandonment reads
// the plan's ABEX cost items first and falls back to the facility
// decommissioning estimate only when the plan carries none. EGINA carries one,
// so every EGINA screening case below is charged it in its final production
// year. Before this, the ABEX line sat on the cost screen and reached no cash
// flow, and every NPV in this digest was the value of a plan that never paid to
// abandon the field.
const ABEX = E.planAbandonment({ costs: { items: EGINA_COSTS }, facilities: { list: EGINA_FACILITIES } });

// ------------------------------------------------------------------ header
w('# EC6 Field Development Planning. Teaching digest.');
w('# Plan money is million USD to four decimals; whole currency units for well and task costs; ratios to six decimals; percents to four.');
w('# Every date is stated. No figure here is read from a clock.');
w();

// ---------------------------------------------------------------- SECTION 1
w('# SECTION 1: What a field development plan holds, and what the engine refuses (owned by Associate m01)');
w();
w('- The plan is one field: its reserves, one or more development concepts, the wells and facilities a concept implies, a schedule, a cost breakdown, a risk register, and the economics those imply.');
w('- The studio holds the plan together. It does not re-derive the subsurface, the well designs or the facility sizing: a figure typed into it is only as good as the work behind it.');
w('- Screening economics run through the sanctioned engine: post royalty and tax, discounted mid year. Default terms are royalty ' + pc(E.DEFAULT_FISCAL.royaltyRate) + ' percent, tax ' + pc(E.DEFAULT_FISCAL.taxRate) + ' percent, discount ' + pc(E.DEFAULT_FISCAL.discountRate) + ' percent and variable operating cost ' + m(E.DEFAULT_FISCAL.variableOpexPerBbl) + ' USD a barrel.');
w('- A figure the plan does not carry is refused by name. Nothing is substituted quietly.');
w('- Until September 2026 four figures were substituted silently when the plan did not carry them: a concept capex of 100 million USD, an operating cost of 10 million USD a year, a peak rate of 50 kbpd and an oil price of 70 USD a barrel. A card built on all four still looked like an answer.');
w();
w('Refusals (published scenarioRefusals, engine messages verbatim):');
G.scenarioRefusals.forEach((c) => {
  const a = attempt(() => SC.runScenario(c.inputs.scenario, c.inputs.concept));
  w(`- ${c.name}: ${refusal(a)}`);
});
w();
w('The same refusals on the EGINA concept (probe):');
[
  ['the concept with its capex fields removed', { ...FPSO, drillingCapex: undefined, facilitiesCapex: undefined, subseaCapex: undefined }, BASE],
  ['the concept with no operating cost', { ...FPSO, opex: undefined }, BASE],
  ['the concept with no peak rate', { ...FPSO, peakProduction: '' }, BASE],
  ['the scenario with no oil price', FPSO, { ...BASE, oilPrice: undefined }],
  ['a negative drilling capex', { ...FPSO, drillingCapex: -520 }, BASE],
].forEach(([label, concept, scenario]) => w(`- ${label}: ${refusal(attempt(() => SC.runScenario(scenario, concept, ABEX)))}`));
w(`- a scenario priced at zero, which is a number somebody typed: accepted, NPV ${m(SC.runScenario({ ...BASE, oilPrice: 0 }, FPSO, ABEX).metrics.npv)}.`);
w();

// ---------------------------------------------------------------- SECTION 2
w('# SECTION 2: Reserves, one total per fluid (owned by Associate m02)');
w();
w('| reservoir | fluid | P90 | P50 | P10 | recovery factor |');
w('| --- | --- | --- | --- | --- | --- |');
EGINA_RESERVOIRS.forEach((res) => w(`| ${res.name} | ${res.fluid} | ${m(res.p90)} | ${m(res.p50)} | ${m(res.p10)} | ${r(res.rf)} |`));
const agg = SB.aggregateReserves(EGINA_RESERVOIRS);
w();
w('| fluid | unit | rows | sum of P90 | sum of P50 | sum of P10 |');
w('| --- | --- | --- | --- | --- | --- |');
agg.fluids.forEach((fl) => {
  const t = agg.byFluid[fl];
  w(`| ${fl} | ${t.units} | ${t.count} | ${m(t.p90Sum)} | ${m(t.p50Sum)} | ${m(t.p10Sum)} |`);
});
w();
w(`EGINA oil P50 ${m(SB.reservesP50(agg))} MMbbl; gas P50 ${m(SB.reservesP50(agg, 'Gas'))} Bcf. Adding them would give ${m(SB.reservesP50(agg) + SB.reservesP50(agg, 'Gas'))} of nothing (derived).`);
w(`The engine's note, verbatim: "${agg.percentileNote}"`);
w(`- a row with no fluid type: ${refusal(attempt(() => SB.aggregateReserves([{ name: 'Unlabelled', p50: 10 }])))}`);
w(`- a row whose fluid is "Brine": ${refusal(attempt(() => SB.aggregateReserves([{ name: 'Aquifer', fluid: 'Brine', p50: 10 }])))}`);
w();
w('Published aggregateReserves cases:');
G.subsurface.aggregateReserves.forEach((c) => {
  const a = SB.aggregateReserves(c.inputs);
  w(`- ${c.name}: fluids ${JSON.stringify(a.fluids)}; ${a.fluids.map((fl) => `${fl} P50 ${m(a.byFluid[fl].p50Sum)} ${a.byFluid[fl].units}`).join('; ') || 'no rows'}.`);
});
G.subsurface.aggregateReservesRefusals.forEach((c) => w(`- ${c.name}: ${refusal(attempt(() => SB.aggregateReserves(c.inputs)))}`));
w();
const zone = { area: 2400, thickness: 140, porosity: 0.26, sw: 0.22, bo: 1.31 };
const ooip = SB.calculateOOIP(zone.area, zone.thickness, zone.porosity, zone.sw, zone.bo);
w(`Volumetrics on an EGINA Main zone of ${m(zone.area)} acres, ${m(zone.thickness)} ft net, porosity ${r(zone.porosity)}, water saturation ${r(zone.sw)}, Bo ${r(zone.bo)}: OOIP ${m(ooip)} STB (engine), ${m(ooip / 1e6)} MMstb (derived).`);
w(`Recovery factor implied by the WHOLE FIELD's oil P50 of ${m(SB.reservesP50(agg))} MMbbl against that one zone's oil in place: ${r(SB.calculateRecoveryFactor(ooip, SB.reservesP50(agg) * 1e6))} (engine).`);
w(`The like for like ratio, Egina Main's own P50 of ${m(EGINA_RESERVOIRS[0].p50)} MMbbl against the same zone: ${r(SB.calculateRecoveryFactor(ooip, EGINA_RESERVOIRS[0].p50 * 1e6))} (engine), against the ${r(EGINA_RESERVOIRS[0].rf)} the reserves table states for that reservoir.`);
w('# Commentary: the first ratio divides two different footprints, a two reservoir field total by one zone\'s oil in place, and the studio does not say so. Two numbers that each come from the engine can still be the wrong pair.');
w(`Wells needed for the field's oil P50 at 12 MMbbl a well: ${WL.calculateWellCount(SB.reservesP50(agg), 12)} (engine). The plan carries ${EGINA_WELLS.length} wells, and nothing in the studio reconciles the two.`);
w();

// ---------------------------------------------------------------- SECTION 3
w('# SECTION 3: Concepts, and the capex a concept carries (owned by Associate m03)');
w();
w('| concept | type | drilling | facilities | subsea | total capex | annual opex | life | peak kbpd |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
EGINA_CONCEPTS.forEach((c) => w(`| ${c.name} | ${c.facilityType} | ${m(c.drillingCapex)} | ${m(c.facilitiesCapex)} | ${m(c.subseaCapex)} | ${m(SC.conceptCapexMM(c))} | ${m(c.opex)} | ${m(c.lifeOfField)} | ${m(c.peakProduction)} |`));
w();
EGINA_CONCEPTS.forEach((c) => {
  const cost = CN.calculateConceptCost(c);
  w(`- ${c.name}: engine concept cost, capex ${m(cost.totalCapex)}, operating cost over ${m(c.lifeOfField)} years ${m(cost.totalOpex)}, lifecycle ${m(cost.totalLifecycleCost)}.`);
});
w(`- a concept that carries only one capex field (facilities ${m(FPSO.facilitiesCapex)}): total capex ${m(SC.conceptCapexMM({ facilitiesCapex: FPSO.facilitiesCapex }))} (engine).`);
w(`- a concept that carries a single pre-totalled capex of ${m(2250)}: ${m(SC.conceptCapexMM({ capex: 2250 }))} (engine).`);
w();
w('The screening production shape a concept implies (plateau then decline, a screening shape and not a reservoir forecast):');
const shape = SC.conceptProfileKbpd(FPSO);
w(`- ${FPSO.name}, peak ${m(FPSO.peakProduction)} kbpd over ${shape.length} years: ${shape.slice(0, 6).map((x) => m(x)).join(', ')} ... ${m(shape.at(-1))}.`);
w(`- year 4 is year 3 x ${r(shape[3] / shape[2])} (derived); the plateau runs to year ${shape.findIndex((x, i) => i > 0 && x < shape[i - 1])}.`);
const shapeVolume = shape.reduce((sum, k) => sum + (k * 1000 * 365) / 1e6, 0);
w(`- the volume under that shape is ${m(shapeVolume)} MMbbl (derived: each year's kbpd x 1000 x 365, summed, in millions of barrels).`);
w(`# Commentary: the plan's own oil P50 is ${m(SB.reservesP50(SB.aggregateReserves(EGINA_RESERVOIRS)))} MMbbl, and the shape above produces ${m(shapeVolume)}. Nothing in the studio compares them, and a plan whose profile cannot be fed by its own reserves still scores complete and still returns an NPV. The shape is a screening shape and the reconciliation is the planner's job.`);
w();
w('Concept schedules, dated from the concept start (no clock is read):');
EGINA_CONCEPTS.forEach((c) => {
  const s = CN.calculateConceptSchedule(c);
  w(`- ${c.name}: sanction ${s.fidDate}, first oil ${s.firstOilDate}, ${s.durationMonths} months.`);
});
w(`- a concept with no start date and no today given: ${refusal(attempt(() => CN.calculateConceptSchedule({ facilityType: 'FPSO' })))}`);
w(`- the same concept dated from 2027-04-01: first oil ${CN.calculateConceptSchedule({ facilityType: 'FPSO' }, { today: '2027-04-01' }).firstOilDate}.`);
w();

// ---------------------------------------------------------------- SECTION 4
w('# SECTION 4: What a scenario is worth (owned by Associate m04)');
w();
w('| scenario | concept | oil price | capex | NPV | IRR | IRR status | payback years |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
EGINA_SCENARIOS.forEach((s) => {
  const concept = EGINA_CONCEPTS.find((c) => c.id === s.conceptId);
  const res = SC.runScenario(s, concept, ABEX);
  w(`| ${s.name} | ${concept.name} | ${m(s.oilPrice)} | ${m(SC.conceptCapexMM(concept))} | ${m(res.metrics.npv)} | ${res.metrics.irr === null ? 'none' : pc(res.metrics.irr)} | ${res.metrics.irrStatus} | ${SC.scenarioPayback(s, concept) === null ? 'never' : m(SC.scenarioPayback(s, concept))} |`);
});
w();
const baseRun = SC.runScenario(BASE, FPSO, ABEX);
w(`Every case in that table carries the plan's end-of-life cost: source ${baseRun.abandonmentSource}, ${m(baseRun.abandonmentMM)} million USD, charged in production year ${baseRun.abandonmentYear} (engine). The basis the engine states: "${ABEX.abandonmentBasis}"`);
w('# Commentary: the payback column is the one figure in that table computed WITHOUT the end-of-life cost. scenarioPayback takes no abandonment argument, so the card reports the payback of a plan that never pays to abandon. On these cases it changes nothing, because the cost falls in the last year and the money has been recovered long before it; on a plan that only recovers at the end it would.');
w();
w(`The Base case in full: revenue ${m(baseRun.metrics.totalRevenue)}, royalty ${m(baseRun.metrics.totalRoyalty)}, tax ${m(baseRun.metrics.totalTax)}, capex ${m(baseRun.metrics.totalCapex)}, operating cost ${m(baseRun.metrics.totalOpex)}, government take ${m(baseRun.metrics.totalGovTake)}, deepest cash position ${m(baseRun.metrics.maxExposure)}.`);
w(`Government take is ${r(baseRun.metrics.totalGovTake / baseRun.metrics.totalRevenue)} of gross revenue (derived).`);
w();
w('Year by year, the Base case (engine cash flow rows):');
w('| year | gross revenue | royalty | capex | operating cost | tax | net cash flow | cumulative |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
baseRun.cashflow.slice(0, 8).forEach((row, i) => w(`| ${i} | ${m(row.grossRevenue)} | ${m(row.royalty)} | ${m(row.capex)} | ${m(row.opex)} | ${m(row.tax)} | ${m(row.ncf)} | ${m(row.cumulativeNCF)} |`));
w(`(Year 0 carries the capex and no production. The profile has ${baseRun.cashflow.length} rows in all.)`);
w();
w('The same concept at four prices (engine):');
[40, 55, 70, 85].forEach((price) => {
  const res = SC.runScenario({ ...BASE, oilPrice: price }, FPSO, ABEX);
  w(`- ${m(price)} USD a barrel: NPV ${m(res.metrics.npv)}, IRR ${res.metrics.irr === null ? `none (${res.metrics.irrStatus})` : pc(res.metrics.irr)}.`);
});
const tie = SC.runScenario(EGINA_SCENARIOS[4], TIEBACK, ABEX);
w(`The tie-back at 70 USD a barrel earns ${m(tie.metrics.npv)} on capex ${m(SC.conceptCapexMM(TIEBACK))}; the FPSO earns ${m(baseRun.metrics.npv)} on ${m(SC.conceptCapexMM(FPSO))}. Value per million of capex: tie-back ${r(tie.metrics.npv / SC.conceptCapexMM(TIEBACK))}, FPSO ${r(baseRun.metrics.npv / SC.conceptCapexMM(FPSO))} (derived).`);
w();

// ---------------------------------------------------------------- SECTION 5
w('# SECTION 5: The plan\'s own economics, and when there are none (owned by Associate m05)');
w();
const capexSum = CO.calculateTotalCAPEX(EGINA_COSTS);
const opexSum = CO.calculateTotalOPEX(EGINA_COSTS);
w('| cost item | type | phase | amount |');
w('| --- | --- | --- | --- |');
EGINA_COSTS.forEach((c) => w(`| ${c.name} | ${c.type} | ${c.phase} | ${m(c.amount)} |`));
w(`Engine totals: CAPEX ${m(capexSum)}, OPEX ${m(opexSum)} a year. The ABEX line of ${m(EGINA_COSTS[6].amount)} is in neither of those two totals (derived), because it is neither development capex nor an annual operating cost. It is the plan's end-of-life cost and the case carries it in the final production year.`);
w('By phase (engine):');
Object.entries(CO.calculateCostByPhase(EGINA_COSTS)).forEach(([phase, total]) => w(`- ${phase}: ${m(total)}`));
w();
const planCase = { capexMM: capexSum, annualOpexMM: opexSum, productionKbpd: shape, pricesUsd: new Array(shape.length).fill(70), abandonment: ABEX };
const planRun = E.runFdpCase(planCase);
const planRunNoAbex = E.runFdpCase({ ...planCase, abandonment: undefined });
w(`The plan's own case: capex ${m(capexSum)} from the cost items, operating cost ${m(opexSum)} a year, the FPSO concept's ${shape.length} year shape at $70/bbl, and the end-of-life cost in the last of those years. NPV ${m(planRun.metrics.npv)}, IRR ${planRun.metrics.irr === null ? `none (${planRun.metrics.irrStatus})` : pc(planRun.metrics.irr)}, payback ${m(E.paybackYears(planRun))} years (engine).`);
w();
w('The end-of-life cost, and what leaving it out was worth (engine):');
w(`- the engine resolves it as source ${planRun.abandonmentSource}, ${m(planRun.abandonmentMM)} million USD, charged in production year ${planRun.abandonmentYear}, on the basis "${ABEX.abandonmentBasis}"`);
w(`- an ABEX cost item replaces the facility decommissioning estimate, it is never added to it. Without any ABEX line the same plan would take the screening estimate of its facility instead.`);
w(`- the same case run with no end-of-life cost at all: NPV ${m(planRunNoAbex.metrics.npv)}, IRR ${planRunNoAbex.metrics.irr === null ? `none (${planRunNoAbex.metrics.irrStatus})` : pc(planRunNoAbex.metrics.irr)} (engine). That is the number this studio reported until September 2026.`);
w(`- charging it costs the plan ${m(planRunNoAbex.metrics.npv - planRun.metrics.npv)} million USD of present value (derived), against a cash cost of ${m(planRun.abandonmentMM)} paid twenty years out and deductible for tax in the year it falls.`);
w();
w(`The concept's own capex is ${m(SC.conceptCapexMM(FPSO))} and the cost items total ${m(capexSum)}: the two agree here because the plan was costed against the concept (derived). They are two different numbers and they are meant to be compared.`);
w();
w('A price deck that does not cover the profile is refused, not padded:');
w(`- a three year profile with two prices: ${refusal(attempt(() => CO.calculateCashFlows(800, 60, [10, 20, 30], [{ oil_price_usd: 70 }, { oil_price_usd: 70 }])))}`);
w(`- the same profile with three: accepted, NPV ${m(CO.calculateNPV(CO.calculateCashFlows(800, 60, [10, 20, 30], [{ oil_price_usd: 70 }, { oil_price_usd: 70 }, { oil_price_usd: 70 }])))}.`);
w();
w('The sensitivity sweep on the plan\'s case (engine, each driver plus and minus 30 percent):');
w('| driver | NPV at minus 30 percent | NPV at plus 30 percent | base NPV | swing |');
w('| --- | --- | --- | --- | --- |');
E.runFdpSensitivity(planCase).forEach((s) => w(`| ${s.name} | ${m(s.lowParamNPV)} | ${m(s.highParamNPV)} | ${m(s.baseNPV)} | ${m(Math.abs(s.highParamNPV - s.lowParamNPV))} (derived) |`));
w('# Commentary: production and price do not move the NPV by the same amount, because a barrel costs money to produce and a dollar of price does not.');
w();
// ---------------------------------------------------------------- SECTION 6
w('# SECTION 6: The plan that cannot be costed yet (owned by Associate m06)');
w();
w('A plan is only complete when every section carries something. The engine checks nine:');
const fullPlan = {
  fieldData: { fieldName: 'Egina', country: 'Nigeria' },
  subsurface: { reserves: { summary: { p10: 0, p50: 0, p90: 0 }, breakdown: EGINA_RESERVOIRS } },
  concepts: { list: EGINA_CONCEPTS, selectedId: 101 },
  scenarios: { list: EGINA_SCENARIOS, selectedId: 201 },
  wells: { list: EGINA_WELLS, rigs: 2, rigRate: EGINA_RIG_RATE },
  facilities: { list: EGINA_FACILITIES },
  schedule: { activities: NETWORK },
  costs: { items: EGINA_COSTS },
  economics: { npv: planRun.metrics.npv, capex: capexSum },
  hseData: { hazards: EGINA_RISKS },
  risks: EGINA_RISKS,
};
const fullScore = FD.calculateCompleteness(fullPlan);
w(`- the EGINA plan: ${fullScore.score} percent, ${fullScore.breakdown.filter((c) => c.valid).length} of ${fullScore.breakdown.length} sections (engine).`);
w(`- validation: isValid ${FD.validateFDPData(fullPlan).isValid}, errors ${JSON.stringify(FD.validateFDPData(fullPlan).errors)}, warnings ${JSON.stringify(FD.validateFDPData(fullPlan).warnings)}.`);
const noEconomics = { ...fullPlan, economics: { npv: 0, capex: 0 } };
w(`- the same plan with no economics written: ${FD.calculateCompleteness(noEconomics).score} percent, errors ${JSON.stringify(FD.validateFDPData(noEconomics).errors)}.`);
const summaryOnly = { ...fullPlan, subsurface: { reserves: { summary: { p50: 130 }, breakdown: [] } } };
w(`- a plan whose reserves came from a loaded example (summary only, no table): P50 read as ${m(FD.planReservesP50(summaryOnly))} (engine).`);
const unreadable = { ...fullPlan, subsurface: { reserves: { breakdown: [{ name: 'Unlabelled', p50: 99 }] } } };
w(`- a plan whose reserves table cannot be read: P50 ${m(FD.planReservesP50(unreadable))}, completeness ${FD.calculateCompleteness(unreadable).score} percent, isValid ${FD.validateFDPData(unreadable).isValid}, errors ${JSON.stringify(FD.validateFDPData(unreadable).errors)}.`);
w();
w(`The plan's P50 by fluid, through the same accessor the completeness check uses: oil ${m(FD.planReservesP50(fullPlan))} MMbbl, gas ${m(FD.planReservesP50(fullPlan, 'Gas'))} Bcf (engine).`);
w();
w('Published plan cases:');
G.plan.forEach((c) => w(`- ${c.name}: ${c.expected.completeness.score} percent, isValid ${c.expected.validation.isValid}${c.expected.validation.errors.length ? `, errors ${JSON.stringify(c.expected.validation.errors)}` : ''} (golden).`));
w();

// ---------------------------------------------------------------- SECTION 7
w('# SECTION 7: The schedule as a network (owned by Professional m01)');
w();
w('| activity | type | duration | must finish first |');
w('| --- | --- | --- | --- |');
NETWORK.forEach((a) => w(`| ${a.name} | ${a.type} | ${a.duration} | ${a.dependencies.length ? a.dependencies.join(', ') : 'nothing'} |`));
w();
const cpm = SH.calculateCPM(NETWORK);
w('The critical path method over that network (engine: forward pass, backward pass, float = late start minus early start):');
w('| activity | duration | early start | early finish | late start | late finish | float | critical |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
cpm.forEach((a) => w(`| ${a.id} ${a.name} | ${a.duration} | ${a.es} | ${a.ef} | ${a.ls} | ${a.lf} | ${a.float} | ${a.isCritical} |`));
w();
w(`Network duration ${SH.calculateNetworkDuration(NETWORK)} days (engine). Critical path: ${SH.criticalPaths(NETWORK).map((p) => p.join(' -> ')).join(' and ')}.`);
w(`Calendar span between the dates typed on the activities: ${SH.calculateProjectDuration(NETWORK)} days (engine). The two answer different questions: how long the work must take, and how long the window is.`);
const floaty = cpm.filter((a) => !a.isCritical);
w(`Activities with float: ${floaty.map((a) => `${a.id} (${a.float} days)`).join(', ')} (engine). An activity with float can slip by that much without moving the end date; one on the critical path cannot slip at all.`);
w();
w('What the network refuses (published schedule refusals, engine messages verbatim):');
G.schedule.filter((c) => c.expected.refused).forEach((c) => w(`- ${c.name}: ${refusal(attempt(() => SH.calculateCPM(c.inputs)))}`));
w();
w('Published schedule cases, engine against the reference:');
G.schedule.filter((c) => !c.expected.refused && c.inputs.length).forEach((c) => {
  const t = SH.calculateCPM(c.inputs);
  w(`- ${c.name}: duration ${f(SH.calculateNetworkDuration(c.inputs), 0)} days, critical ${JSON.stringify(t.filter((a) => a.isCritical).map((a) => a.id))}, paths ${JSON.stringify(SH.criticalPaths(c.inputs))}; golden reference duration ${f(c.expected.cpmReference.projectDurationDays, 0)}, critical ${JSON.stringify(c.expected.cpmReference.criticalActivities)}.`);
});
w();
const textbook = G.schedule.find((c) => c.name.startsWith('textbook network'));
w(`# Commentary: on the textbook network the engine used to mark all ${textbook.expected.retiredPassthrough.length} activities critical at float 0; the method puts the path at ${JSON.stringify(textbook.expected.cpmReference.criticalPaths[0])} and gives ${JSON.stringify(textbook.expected.criticalityDisagreements)} four days of float each (golden).`);
w();

// ---------------------------------------------------------------- SECTION 8
w('# SECTION 8: Dates that do not move (owned by Professional m02)');
w();
w('- A date-only string is parsed as LOCAL midnight. `new Date("2027-04-01")` is UTC midnight, which is the day before anywhere west of Greenwich, so a schedule drawn that way moved by a day depending on who looked at it.');
w('- A span is counted in whole calendar days, not by subtracting two timestamps: across a daylight-saving change a millisecond difference is out by an hour.');
w(`- Oct 30 to Nov 3, a window that crosses a daylight-saving change in some zones: ${SH.calculateProjectDuration([{ startDate: '2026-10-30', endDate: '2026-11-03' }])} days (engine, and the same in every zone).`);
w(`- an activity with no readable dates: calendar span ${SH.calculateProjectDuration([{ id: 'x', duration: 3 }]) === null ? 'null, which is the honest answer' : 'a number'} (engine).`);
w(`- an empty schedule: ${SH.calculateProjectDuration([])} (engine).`);
w();
w('Milestones are the activities of zero duration, or those typed as one:');
w(`- EGINA: ${JSON.stringify(SH.identifyMilestones(NETWORK).map((a) => a.name))} (engine).`);
w();
w('Concept schedules are dated from the concept, never from the clock:');
[['2027-04-01', 'FPSO'], ['2027-04-01', 'Platform'], ['2028-02-29', 'FPSO']].forEach(([start, type]) => {
  const s = CN.calculateConceptSchedule({ startDate: start, facilityType: type });
  w(`- a ${type} sanctioned ${start}: first oil ${s.firstOilDate}, ${s.durationMonths} months (engine).`);
});
w(`- an unreadable start date with no today given: ${refusal(attempt(() => CN.calculateConceptSchedule({ startDate: 'next spring' })))}`);
w();

// ---------------------------------------------------------------- SECTION 9
w('# SECTION 9: Wells, and what a rig day costs (owned by Professional m03)');
w();
w(`At the plan's rig rate of ${u(EGINA_RIG_RATE)} USD a day, services at 1.5 times the rig cost:`);
w('| well | type | trajectory | measured depth | days | cost |');
w('| --- | --- | --- | --- | --- | --- |');
EGINA_WELLS.forEach((well) => {
  const days = WL.calculateDrillingTime(well.md, well.trajectory);
  w(`| ${well.name} | ${well.type} | ${well.trajectory} | ${u(well.md)} | ${f(days, 0)} | ${u(WL.calculateDrillingCost(days, EGINA_RIG_RATE))} |`);
});
const totalWellDays = EGINA_WELLS.reduce((s, well) => s + WL.calculateDrillingTime(well.md, well.trajectory), 0);
const totalWellCost = EGINA_WELLS.reduce((s, well) => s + WL.calculateDrillingCost(WL.calculateDrillingTime(well.md, well.trajectory), EGINA_RIG_RATE), 0);
w(`Campaign totals (derived by summing the engine rows): ${f(totalWellDays, 0)} rig days, ${u(totalWellCost)} USD, ${m(totalWellCost / 1e6)} million USD.`);
w(`Every row divides to the same all-in day: ${u(totalWellCost / totalWellDays)} USD (derived). Trajectory and depth move the DAYS; the day itself is priced the same for a producer, an injector, a vertical well and a horizontal one.`);
w(`The same four wells at ${u(250000)} USD a day would cost ${u(EGINA_WELLS.reduce((s, well) => s + WL.calculateDrillingCost(WL.calculateDrillingTime(well.md, well.trajectory), 250000), 0))} USD (engine): the rig rate is not a detail.`);
w();
w('The same depth on three trajectories (engine):');
['Vertical', 'Deviated', 'Horizontal'].forEach((traj) => {
  const days = WL.calculateDrillingTime(12000, traj);
  w(`- 12000 ft ${traj}: ${f(days, 0)} days, ${u(WL.calculateDrillingCost(days, EGINA_RIG_RATE))} USD.`);
});
['Low', 'Medium', 'High'].forEach((cx) => w(`- 12000 ft Horizontal at ${cx} complexity: ${f(WL.calculateDrillingTime(12000, 'Horizontal', cx), 0)} days (engine).`));
w();
w('A campaign is as long as its rigs allow (derived: each well goes to the rig that comes free first, taken in the order the wells sit in the plan; a different order can give a different campaign length for the same four wells):');
EGINA_RIG_COUNTS.forEach((rigs) => {
  const free = new Array(rigs).fill(0);
  EGINA_WELLS.forEach((well) => {
    const days = WL.calculateDrillingTime(well.md, well.trajectory);
    let next = 0;
    for (let i = 1; i < free.length; i += 1) if (free[i] < free[next]) next = i;
    free[next] += days;
  });
  w(`- ${rigs} rig${rigs === 1 ? '' : 's'}: ${f(Math.max(...free), 0)} days, against ${f(totalWellDays, 0)} rig days of work; the rigs finish at ${free.map((d) => f(d, 0)).join(', ')} days (derived).`);
});
w();

// ---------------------------------------------------------------- SECTION 10
w('# SECTION 10: Facilities, sized and priced (owned by Professional m04)');
w();
w('| facility | type | nameplate bopd | capex | annual opex | decommissioning | gas capacity Mscf/d | water bopd |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
EGINA_FACILITIES.forEach((fac) => {
  const cost = FA.calculateFacilityCost(fac);
  const cap = FA.calculateFacilityCapacity(fac);
  w(`| ${fac.name} | ${fac.type} | ${u(fac.nameplateCapacity)} | ${m(cost.capex)} | ${m(cost.opex)} | ${m(cost.decommissioning)} | ${u(cap.gasCapacity)} | ${u(cap.waterHandling)} |`);
});
w();
const small = FA.calculateFacilityCost(EGINA_FACILITIES[0]);
const big = FA.calculateFacilityCost(EGINA_FACILITIES[1]);
w(`Scaling from ${u(EGINA_FACILITIES[0].nameplateCapacity)} to ${u(EGINA_FACILITIES[1].nameplateCapacity)} bopd, a factor of ${r(EGINA_FACILITIES[1].nameplateCapacity / EGINA_FACILITIES[0].nameplateCapacity)}: capex rises by ${r(big.capex / small.capex)} and operating cost by ${r(big.opex / small.opex)} (derived). Capex scales with size to the power 0.7 and operating cost to the power 0.6, so two and a half times the size costs ${r(big.capex / small.capex)} times the money, not two and a half times.`);
w('Decommissioning is 15 percent of the capex the facility carries (engine), on every row:');
EGINA_FACILITIES.forEach((fac) => {
  const cost = FA.calculateFacilityCost(fac);
  w(`- ${fac.name}: capex ${m(cost.capex)}, decommissioning ${m(cost.decommissioning)}, share ${r(cost.decommissioning / cost.capex)} (derived from the engine's own unrounded values, which is why a share taken from the four decimal figures printed here can land a digit out).`);
});
w();
const peakBpd = FPSO.peakProduction * 1000;
const gasMscfd = (peakBpd * EGINA_FLUID.gor) / 1000;
w(`The plan's peak is ${m(FPSO.peakProduction)} kbpd, which is ${u(peakBpd)} bopd, and at a gas-oil ratio of ${u(EGINA_FLUID.gor)} scf a barrel that is ${u(gasMscfd)} Mscf/d (derived).`);
EGINA_FACILITIES.forEach((fac) => {
  const cap = FA.calculateFacilityCapacity(fac);
  const bn = FA.identifyBottlenecks(fac, { oil: peakBpd, gas: gasMscfd, water: 0 });
  w(`- ${fac.name}: oil utilisation ${r(peakBpd / cap.oilCapacity)}, gas utilisation ${r(gasMscfd / cap.gasCapacity)} (derived); water handling ${u(cap.waterHandling)} bopd against no produced water forecast at all, so there is nothing to divide; bottlenecks ${bn.length ? JSON.stringify(bn) : 'none'} (engine).`);
});
w();
w('Flow assurance runs its own scale, and it is NOT the risk register\'s. The hazard score adds 3 for a subsea tie-back, 2 for oil below 25 API and 4 for any H2S above zero, and the level is High above 5, Medium above 2, and Low otherwise. The register\'s bands (20 Critical, 12 High, 6 Medium) use the same three words on a different quantity, so a score of 3 reads Medium here and Low there.');
w('Flow assurance on the plan\'s own fluid (engine):');
EGINA_FACILITIES.forEach((fac) => {
  const fa = FA.calculateFlowAssuranceRisk(fac, EGINA_FLUID);
  w(`- ${fac.name}: score ${f(fa.score, 0)}, level ${fa.level}, hazards ${fa.risks.length ? JSON.stringify(fa.risks.map((x) => `${x.type} ${x.severity}`)) : 'none'}.`);
});
w(`- the same tie-back on a fluid carrying 12 ppm H2S: ${JSON.stringify(FA.calculateFlowAssuranceRisk(EGINA_FACILITIES[2], { ...EGINA_FLUID, h2s: 12 }).risks.map((x) => `${x.type} ${x.severity}`))} (engine).`);
w('# Commentary: without an H2S figure the corrosion screen cannot fire at all, so a blank field reads as no corrosion risk rather than as an unknown. The screen also fires at ANY H2S above zero and always at High, so it separates a measured field from an unmeasured one and never one sour field from another.');
w();
// ---------------------------------------------------------------- SECTION 11
w('# SECTION 11: One risk scale (owned by Professional m05)');
w();
w('The bands, and they are the only ones in the studio: 20 and above Critical, 12 and above High, 6 and above Medium, below that Low.');
w('| probability | impact | score | band |');
w('| --- | --- | --- | --- |');
[[5, 5], [4, 5], [4, 4], [3, 4], [3, 3], [2, 3], [2, 2], [1, 3], [1, 1]].forEach(([p, i]) => w(`| ${p} | ${i} | ${f(p * i, 0)} | ${RM.getRiskLevel(p * i).level} |`));
w();
w('| risk | source | probability | impact | score | band | cost impact | mitigation |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
EGINA_RISKS.forEach((risk) => {
  const score = RM.riskScore(risk);
  w(`| ${risk.name} | ${risk.source} | ${risk.probability ?? 'none'} | ${risk.impact ?? 'none'} | ${score === null ? 'none' : f(score, 0)} | ${score === null ? 'Unscored' : RM.getRiskLevel(score).level} | ${m(risk.costImpact)} | ${risk.mitigation} |`);
});
w();
const levels = RK.aggregateRisksByLevel(EGINA_RISKS);
const matrix = HS.calculateRiskMatrix(EGINA_RISKS);
w(`By band (engine): Critical ${levels.Critical}, High ${levels.High}, Medium ${levels.Medium}, Low ${levels.Low}, Unscored ${levels.Unscored}.`);
w(`The HSE matrix on the same register (engine): critical ${matrix.critical}, high ${matrix.high}, medium ${matrix.medium}, low ${matrix.low}, unscored ${matrix.unscored}, total ${matrix.total}. The two agree because there is one scale.`);
w(`Consolidated score ${f(RK.calculateConsolidatedRiskScore(EGINA_RISKS), 0)}, unscored risks ${RK.countUnscoredRisks(EGINA_RISKS)}, portfolio health ${f(RK.calculatePortfolioHealth(EGINA_RISKS), 0)} (engine).`);
const scoredOnly = EGINA_RISKS.filter((risk) => RM.riskScore(risk) !== null);
w(`The same register with the unscored risk left out entirely: health ${f(RK.calculatePortfolioHealth(scoredOnly), 0)} (engine). An unscored risk neither helps nor hurts: it is reported as unscored.`);
w(`Risk exposure, the expected monetary value at the engine's probability factors: ${m(RK.calculateRiskExposure(EGINA_RISKS))} million USD (engine).`);
w('- the factors, by probability: 1 gives 0.05, 2 gives 0.20, 3 gives 0.40, 4 gives 0.60, 5 gives 0.85.');
w('- every contribution (derived: the factor for that risk\'s probability times its cost impact):');
EGINA_RISKS.forEach((risk) => {
  const factor = { 1: 0.05, 2: 0.20, 3: 0.40, 4: 0.60, 5: 0.85 }[risk.probability];
  w(`  - ${risk.name}: ${risk.probability === undefined ? 'no probability, so no factor and no contribution' : `${r(factor)} x ${m(risk.costImpact)} = ${m(factor * risk.costImpact)}`}`);
});
w(`- the five cost impacts add to ${m(EGINA_RISKS.reduce((sum, risk) => sum + risk.costImpact, 0))} million USD (derived), which is what the register would cost if every risk happened. The exposure of ${m(RK.calculateRiskExposure(EGINA_RISKS))} is not that number and is not a worst case.`);
w(`- the unscored risk carries a cost impact of ${m(EGINA_RISKS[4].costImpact)} and an impact of ${EGINA_RISKS[4].impact}, and contributes ${m(0)} to the exposure because its probability is missing (engine).`);
w();
w('By source (engine): ' + JSON.stringify(RK.aggregateRisksBySource(EGINA_RISKS)) + '.');
w();
w('Published risk sets:');
G.risk.forEach((c) => w(`- ${c.name}: consolidated ${c.expected.consolidatedScore === null ? 'null' : f(c.expected.consolidatedScore, 0)}, exposure ${m(c.expected.exposure)}, health ${f(c.expected.health, 0)}, by level ${JSON.stringify(c.expected.byLevel)} (golden).`));
w();

// ---------------------------------------------------------------- SECTION 12
w('# SECTION 12: The document, and what it reports (owned by Professional m06)');
w();
w('The generated plan reports what is there and what is missing. It does not fill gaps.');
w(`- EGINA: completeness ${fullScore.score} percent; the sections it checks are ${JSON.stringify(fullScore.breakdown.map((c) => c.module))}.`);
fullScore.breakdown.forEach((c) => w(`  - ${c.module}: ${c.valid}`));
w(`- the headline figures it carries: P50 oil ${m(FD.planReservesP50(fullPlan))} MMbbl, P50 gas ${m(FD.planReservesP50(fullPlan, 'Gas'))} Bcf, total CAPEX ${m(capexSum)} $MM, NPV ${m(planRun.metrics.npv)} $MM, IRR ${planRun.metrics.irr === null ? 'none' : pc(planRun.metrics.irr)}, wells ${EGINA_WELLS.length}.`);
w();
w('Cost roll-ups the document prints (engine):');
w(`- total CAPEX ${m(CO.calculateTotalCAPEX(EGINA_COSTS))}, total OPEX ${m(CO.calculateTotalOPEX(EGINA_COSTS))}.`);
G.costItems.forEach((c) => w(`- published ${c.name}: CAPEX ${m(c.expected.totalCAPEX)}, OPEX ${m(c.expected.totalOPEX)} (golden).`));
w();

// ---------------------------------------------------------------- SECTION 13
w('# SECTION 13: The rate of return, and when there is none (owned by Expert m01 and Expert m02)');
w();
w('The internal rate of return is the discount rate at which the net present value is zero. It exists only when the cash flow changes sign, it is not unique when the flow changes sign more than once, and it can be outside the range a solver searches.');
w(`The engine searches between -99 and 1000 percent and reports a rate only when it is a root inside that band. Otherwise irr is null and irrStatus says which of these happened: ${JSON.stringify(['ok', 'no-sign-change', 'above-clamp', 'multiple-roots', 'no-root'])}.`);
w('# App surface: the scenario card colours an internal rate of return of 15 percent or more green and anything below it amber, which is the only hurdle rate anywhere in the studio. It is a colour on a card and not a decision rule, and it says nothing about how much money a scenario carries.');
w();
w('| case | NPV | IRR | status |');
w('| --- | --- | --- | --- |');
[
  ['EGINA Base, 70 USD a barrel', SC.runScenario(BASE, FPSO, ABEX)],
  ['EGINA at 18 USD a barrel', SC.runScenario({ ...BASE, oilPrice: 18 }, FPSO, ABEX)],
  ['EGINA at 30 USD a barrel', SC.runScenario({ ...BASE, oilPrice: 30 }, FPSO, ABEX)],
  ['a case that only spends', E.runFdpCase({ capexMM: 500, annualOpexMM: 20, productionKbpd: [0, 0, 0], pricesUsd: [70, 70, 70] })],
  ['the published tiny capex case, listed again below', E.runFdpCase({ capexMM: 1, annualOpexMM: 0, productionKbpd: [10], pricesUsd: [75] })],
].forEach(([label, res]) => w(`| ${label} | ${m(res.metrics.npv)} | ${res.metrics.irr === null ? 'none' : pc(res.metrics.irr)} | ${res.metrics.irrStatus} |`));
w();
w('Published cases where the rate is not reportable (golden expectations, engine agrees):');
G.fdpCase.filter((c) => c.expected.metrics.irr === null).forEach((c) => {
  const res = E.runFdpCase(c.inputs);
  w(`- ${c.name}: NPV ${m(res.metrics.npv)}, status ${res.metrics.irrStatus}${c.expected.irrRootsPercent ? `, the true root the band hides ${pc(c.expected.irrRootsPercent[0])} percent (golden)` : ''}.`);
});
w();
const recovered = G.fdpCase.find((c) => c.name.startsWith('suite test: never pays back'));
if (recovered) {
  const res = E.runFdpCase(recovered.inputs);
  w(`- ${recovered.name}: NPV ${m(res.metrics.npv)}, IRR ${pc(res.metrics.irr)} percent, status ${res.metrics.irrStatus}. A negative rate is a real answer: it says what the money earned, which is less than none.`);
}
w('# Commentary: a clamped search that stops at its own boundary has not found a rate. Reporting the boundary as the answer put an internal rate of return of exactly 1000 percent, the upper edge of the band, in green on cards for projects that never return their money.');
w();
w('MORE THAN ONE ROOT, which is what an end-of-life cost does to a rate of return:');
w(`The EGINA plan spends ${m(capexSum)} in year 0, earns for ${shape.length} years, and pays ${m(planRun.abandonmentMM)} to abandon in the last of them. Its net cash flow therefore changes sign TWICE, and by Descartes' rule a flow that changes sign twice can be zeroed at more than one discount rate. The engine finds every root, reports irr null and irrStatus multiple-roots, and lists them:`);
w('| case | NPV | status | the rates that zero this flow, percent |');
w('| --- | --- | --- | --- |');
[
  ['EGINA Base, 70 USD a barrel', SC.runScenario(BASE, FPSO, ABEX)],
  ['EGINA Low price, 48 USD a barrel', SC.runScenario(EGINA_SCENARIOS[1], FPSO, ABEX)],
  ['EGINA High price, 92 USD a barrel', SC.runScenario(EGINA_SCENARIOS[2], FPSO, ABEX)],
  ['EGINA Tie-back base, 70 USD a barrel', SC.runScenario(EGINA_SCENARIOS[4], TIEBACK, ABEX)],
  ['EGINA at 18 USD a barrel', SC.runScenario({ ...BASE, oilPrice: 18 }, FPSO, ABEX)],
].forEach(([label, res]) => w(`| ${label} | ${m(res.metrics.npv)} | ${res.metrics.irrStatus} | ${res.metrics.irrRoots === null ? 'none: the flow is negative at every rate the engine searches' : res.metrics.irrRoots.map((x) => pc(x)).join(' and ')} |`));
w(`- The same Base case with no end-of-life cost reports a single rate of ${pc(SC.runScenario(BASE, FPSO).metrics.irr)} percent at status ${SC.runScenario(BASE, FPSO).metrics.irrStatus} (engine). One line of cost, and the question "what is the rate of return" stops having an answer.`);
w('- NEITHER root is the rate of return. They are the two discount rates at which this flow is worth nothing, and between them the plan is worth more than nothing. Quoting the higher one alone is the mistake the multiple-roots status exists to stop, and quoting the lower one as a loss is the same mistake upside down.');
w('- A rate of return is only a summary of a flow that spends once and earns thereafter. Charge a real end-of-life cost and most development plans stop being that shape, which is why the NPV, and not the rate, is what a plan is judged on.');
w();
w('The payback the same cases report:');
[['EGINA Base', BASE], ['EGINA at 30 USD a barrel', { ...BASE, oilPrice: 30 }], ['EGINA at 18 USD a barrel', { ...BASE, oilPrice: 18 }]].forEach(([label, scen]) => {
  const pb = SC.scenarioPayback(scen, FPSO);
  w(`- ${label}: ${pb === null ? 'never pays back (null, not the project life)' : `${m(pb)} years`} (engine).`);
});
w();

// ---------------------------------------------------------------- SECTION 14
w('# SECTION 14: What a sensitivity says, and what it does not (owned by Expert m03)');
w();
w('The sweep moves one driver at a time by 30 percent either way and re-runs the whole case. It is not a probability: nothing here says how likely a 30 percent move is.');
w('| driver | minus 30 percent | plus 30 percent | base | swing | swing as a share of base |');
w('| --- | --- | --- | --- | --- | --- |');
const sweep = E.runFdpSensitivity(planCase);
sweep.forEach((s) => {
  const swing = Math.abs(s.highParamNPV - s.lowParamNPV);
  w(`| ${s.name} | ${m(s.lowParamNPV)} | ${m(s.highParamNPV)} | ${m(s.baseNPV)} | ${m(swing)} | ${r(swing / Math.abs(s.baseNPV))} (derived) |`);
});
w();
const bySwing = [...sweep].sort((a, b) => Math.abs(b.highParamNPV - b.lowParamNPV) - Math.abs(a.highParamNPV - a.lowParamNPV));
w(`Ranked by swing (derived): ${bySwing.map((s) => s.name).join(', ')}.`);
w('- Oil price and production both scale revenue, but production also scales the variable operating cost the barrels carry, so production swings the NPV less than price does.');
w(`- The capex bar runs the other way: more capex is less value. At minus 30 percent capex the NPV is ${m(sweep[1].lowParamNPV)} and at plus 30 percent it is ${m(sweep[1].highParamNPV)} (engine).`);
w();
w('Published sensitivity cases:');
G.sensitivity.forEach((c) => {
  const i = c.inputs;
  const s = E.runFdpSensitivity({ capexMM: i.capexMM, annualOpexMM: i.annualOpexMM, productionKbpd: i.productionKbpd, pricesUsd: i.pricesUsd, fiscal: i.fiscal || {} });
  const fiscal = i.fiscal ? ` on royalty ${pc(i.fiscal.royaltyRate)} percent and tax ${pc(i.fiscal.taxRate)} percent` : ' on the default fiscal terms';
  w(`- ${c.name}: capex ${m(i.capexMM)}, operating cost ${m(i.annualOpexMM)} a year, ${i.productionKbpd.length} producing years at ${m(i.pricesUsd[0])} USD a barrel${fiscal}; base ${m(s[0].baseNPV)}; ${s.map((x) => `${x.name} ${m(x.lowParamNPV)} to ${m(x.highParamNPV)}`).join('; ')}.`);
});
w();

// ---------------------------------------------------------------- SECTION 15
w('# SECTION 15: Earned value, measured to a date (owned by Expert m04 and Expert m05)');
w();
w('| task | planned cost | actual cost | percent complete | window |');
w('| --- | --- | --- | --- | --- |');
ODUDU_TASKS.forEach((t) => w(`| ${t.name} | ${u(t.planned_cost)} | ${u(t.actual_cost)} | ${pc(t.percent_complete)} | ${t.planned_start_date} to ${t.planned_end_date} |`));
w();
w('| as of | planned value | earned value | actual cost | SPI | CPI | completion ratio |');
w('| --- | --- | --- | --- | --- | --- | --- |');
ODUDU_AS_OF.forEach((asOf) => {
  const e = PC.calculateEVM(ODUDU_TASKS, { asOf });
  w(`| ${asOf} | ${e.pv === null ? 'none' : u(e.pv)} | ${u(e.ev)} | ${u(e.ac)} | ${e.spi === null ? 'none' : r(e.spi)} | ${e.cpi === null ? 'none' : r(e.cpi)} | ${e.completionRatio === null ? 'none' : r(e.completionRatio)} |`);
});
w();
const mid = PC.calculateEVM(ODUDU_TASKS, { asOf: '2028-12-31' });
w(`Budget at completion ${u(mid.bac)} (engine). At 2028-12-31 the plan said ${u(mid.pv)} should have been earned and ${u(mid.ev)} was, which is a schedule index of ${r(mid.spi)}; ${u(mid.ac)} had been spent on ${u(mid.ev)} of value, a cost index of ${r(mid.cpi)}.`);
w(`The completion ratio at the same date is ${r(mid.completionRatio)}: that is progress against the WHOLE budget, and it is not a schedule index. Before this course's repair the app called that ratio SPI, so a project half finished on time and one half finished a year late both read ${r(0.5)}.`);
w(`The basis the engine states: "${mid.spiBasis}".`);
w('# Commentary: before this repair an index with no denominator was reported as a clean 1.00 and printed as "Under Budget", and percent complete came back as the string "NaN", which one card read as a zero and labelled "Behind Schedule". A null says the measurement does not exist; a 1.00 says the project is exactly on plan.');
w('# Commentary: earned value is NOT time-phased. It is each task\'s budget times the percent complete somebody typed, and there is no history of when that percent was measured, so it reads the same at every as-of date. That is why the first row below reports value earned on a date before the first window opens: the planned value knows the calendar and the progress figure does not.');
w();
w('A schedule index can read above 1, which the old ratio never could:');
const ahead = PC.calculateEVM([{ name: 'ahead', planned_cost: 1000000, percent_complete: 90, planned_start_date: '2028-01-01', planned_end_date: '2028-12-31' }], { asOf: '2028-07-02' });
w(`- one task, ${pc(90)} percent done half way through its window: SPI ${r(ahead.spi)}, completion ratio ${r(ahead.completionRatio)} (engine).`);
const undated = PC.calculateEVM([...ODUDU_TASKS, { name: 'Late scope, undated', planned_cost: 900000, percent_complete: 10 }], { asOf: '2028-12-31' });
w(`- add one costed task to ODUDU-2, a planned cost of ${u(900000)} at ${pc(10)} percent complete and no dates on it, read at the same 2028-12-31: SPI ${undated.spi === null ? 'none' : r(undated.spi)}, and the engine says why: "${undated.spiBasis}". Budget at completion rises to ${u(undated.bac)}, earned value to ${u(undated.ev)}, and the completion ratio reads ${r(undated.completionRatio)}.`);
const dropCost = (name) => PC.calculateEVM(ODUDU_TASKS.map((t) => (t.name === name ? { ...t, planned_cost: 0 } : t)), { asOf: '2028-12-31' });
const dropProc = dropCost('Procurement');
const dropFab = dropCost('Fabrication');
w(`- a planned cost read as zero, Procurement at ${pc(30)} percent complete: budget at completion ${u(dropProc.bac)}, earned value ${u(dropProc.ev)}, completion ratio ${r(dropProc.completionRatio)}, SPI ${r(dropProc.spi)} (engine).`);
w(`- the same on Fabrication at ${pc(0)} percent complete: budget at completion ${u(dropFab.bac)}, earned value ${u(dropFab.ev)}, completion ratio ${r(dropFab.completionRatio)}, SPI ${r(dropFab.spi)} (engine).`);
w(`# Commentary: a cost read as zero takes the task's budget out of the denominator AND the value it had already earned out of the numerator. The completion ratio therefore rises only when the dropped task's own progress is BELOW the project's ratio of ${r(mid.completionRatio)}: Fabrication at ${pc(0)} percent raises it to ${r(dropFab.completionRatio)}, Procurement at ${pc(30)} percent LOWERS it to ${r(dropProc.completionRatio)}. The schedule index moves only when the dropped task's window is open at the as-of date: Procurement's is, so SPI rises to ${r(dropProc.spi)}; Fabrication's has not opened, so it contributed nothing to planned value and SPI stays at ${r(mid.spi)}.`);
const uncosted = PC.calculateEVM([{ name: 'no cost' }, { name: 'no cost either' }], { asOf: '2028-12-31' });
w(`- a project with no costed task at all: SPI ${uncosted.spi === null ? 'none' : r(uncosted.spi)}, CPI ${uncosted.cpi === null ? 'none' : r(uncosted.cpi)}, percent complete ${uncosted.percentComplete === null ? 'none' : pc(uncosted.percentComplete)}, basis "${uncosted.spiBasis}".`);
w();
w('What it refuses (published EVM refusals, engine messages verbatim):');
const GA = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/afe_cases.json`, 'utf8'));
GA.evmRefusals.forEach((c) => w(`- ${c.name}: ${refusal(attempt(() => PC.calculateEVM(c.inputs.tasks, { asOf: c.inputs.asOf })))}`));
w(`- an as-of date that is not a date: ${refusal(attempt(() => PC.calculateEVM(ODUDU_TASKS, { asOf: 'last Friday' })))}`);
w();
w('Published EVM cases. These are rounding and edge fixtures, so their money is printed to four decimals: rounded to whole units the indexes beside them would not reconcile with the money.');
GA.evm.forEach((c) => {
  const e = PC.calculateEVM(c.inputs.tasks, { asOf: c.inputs.asOf });
  w(`- ${c.name} (as of ${c.inputs.asOf}): PV ${e.pv === null ? 'none' : uf(e.pv)}, EV ${uf(e.ev)}, AC ${uf(e.ac)}, SPI ${e.spi === null ? 'none' : r(e.spi)}, CPI ${e.cpi === null ? 'none' : r(e.cpi)}.`);
});
w();

// ---------------------------------------------------------------- SECTION 16
w('# SECTION 16: Reading a plan against itself (owned by Expert m06)');
w();
w('Three numbers in an FDP are easy to confuse, and the studio now shows all three:');
w(`- the concept's capex, ${m(SC.conceptCapexMM(FPSO))} million USD, which is what the development is estimated to cost, and which carries drilling ${m(FPSO.drillingCapex)}, facilities ${m(FPSO.facilitiesCapex)} and subsea ${m(FPSO.subseaCapex)};`);
w(`- the cost items' CAPEX total, ${m(capexSum)} million USD, which is what the plan has budgeted line by line;`);
w(`- the facility screening estimate, ${m(FA.calculateFacilityCost(EGINA_FACILITIES[0]).capex)} million USD for the FPSO alone, which is a class 5 figure from type and nameplate (engine).`);
w('They are three different estimates of overlapping things, and the overlap has to be matched before the numbers mean anything.');
w(`The comparison that is like for like is the facility screening estimate of ${m(FA.calculateFacilityCost(EGINA_FACILITIES[0]).capex)} against the concept's FACILITIES field of ${m(FPSO.facilitiesCapex)}, a gap of ${m(FA.calculateFacilityCost(EGINA_FACILITIES[0]).capex - FPSO.facilitiesCapex)} (derived). Setting it against the ${m(SC.conceptCapexMM(FPSO))} total instead compares one facility with a development that also drills ${m(FPSO.drillingCapex)} of wells and lays ${m(FPSO.subseaCapex)} of subsea.`);
w();
w('The same discipline on the schedule:');
w(`- the network says the work must take ${SH.calculateNetworkDuration(NETWORK)} days (engine);`);
w(`- the dates typed on the activities span ${SH.calculateProjectDuration(NETWORK)} days (engine);`);
w(`- the difference, ${f(SH.calculateProjectDuration(NETWORK) - SH.calculateNetworkDuration(NETWORK), 0)} days, is float somebody has already spent in the calendar (derived).`);
w();
w('And on the economics:');
w(`- the Base scenario on the concept's capex: NPV ${m(baseRun.metrics.npv)} (engine);`);
w(`- the plan's own cost items at the same price: NPV ${m(planRun.metrics.npv)} (engine);`);
w(`- the difference is ${m(Math.abs(baseRun.metrics.npv - planRun.metrics.npv))} (derived), and it is zero only when the plan is costed against the concept it is running.`);
w();
w(`A screening NPV is not a sanction case. Full fiscal detail under the PIA and the Nigeria Tax Act belongs to Petroleum Economics Studio; the tier here is screening, mid-year discounted, on the stated default terms.`);
w();

console.log(out.join('\n'));
