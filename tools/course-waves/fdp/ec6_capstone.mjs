// Computes the EC6 capstone answers from the UKOT and MEREN-3 conditions.
// Writes fields.json (tier, key, value, tol) and prints a report.
import fs from 'fs';
import {
  UKOT_RESERVOIRS, UKOT_CONCEPT, UKOT_ALTERNATIVE, UKOT_BASE, UKOT_STRESS, UKOT_COSTS,
  UKOT_SCHEDULE, UKOT_WELLS, UKOT_RIG_RATE, UKOT_FACILITIES, UKOT_RISKS,
  MEREN_TASKS, MEREN_AS_OF,
} from '/root/ec-wip-fdp/ec6_fields_capstone.mjs';

const ROOT = process.env.EC6_ENGINES || '/root/wt-ec6-abex/packages/engines';
const E = await import(`${ROOT}/engines/economics/fdp/economics.js`);
const SC = await import(`${ROOT}/engines/economics/fdp/scenarioCalculations.js`);
const CO = await import(`${ROOT}/engines/economics/fdp/costCalculations.js`);
const SB = await import(`${ROOT}/engines/economics/fdp/subsurfaceCalculations.js`);
const WL = await import(`${ROOT}/engines/economics/fdp/wellCalculations.js`);
const FA = await import(`${ROOT}/engines/economics/fdp/facilitiesCalculations.js`);
const RK = await import(`${ROOT}/engines/economics/fdp/riskCalculations.js`);
const SH = await import(`${ROOT}/engines/economics/fdp/scheduleCalculations.js`);
const PC = await import(`${ROOT}/engines/economics/projectControls.js`);

const NET = UKOT_SCHEDULE.map((a) => ({ ...a, startDate: a.start, endDate: a.end }));
const agg = SB.aggregateReserves(UKOT_RESERVOIRS);
// EC6-8 (engines #183/#191). The UKOT plan carries an ABEX cost item, so every
// screening case it implies is charged that end-of-life cost in its final
// production year. Before this the ABEX line reached no cash flow at all.
const ABEX = E.planAbandonment({ costs: { items: UKOT_COSTS }, facilities: { list: UKOT_FACILITIES } });
const base = SC.runScenario(UKOT_BASE, UKOT_CONCEPT, ABEX);
const stress = SC.runScenario(UKOT_STRESS, UKOT_CONCEPT, ABEX);
const alt = SC.runScenario({ ...UKOT_BASE, conceptId: 302 }, UKOT_ALTERNATIVE, ABEX);
const cpm = SH.calculateCPM(NET);
const evm = PC.calculateEVM(MEREN_TASKS, { asOf: MEREN_AS_OF });
const planCase = {
  capexMM: CO.calculateTotalCAPEX(UKOT_COSTS),
  annualOpexMM: CO.calculateTotalOPEX(UKOT_COSTS),
  productionKbpd: SC.conceptProfileKbpd(UKOT_CONCEPT),
  pricesUsd: new Array(SC.conceptProfileKbpd(UKOT_CONCEPT).length).fill(UKOT_BASE.oilPrice),
  abandonment: ABEX,
};
const sweep = E.runFdpSensitivity(planCase);
const price = sweep.find((s) => s.name === 'Oil Price');
const F = [
  // Associate
  ['beginner', 'ukot_concept_capex_mm', SC.conceptCapexMM(UKOT_CONCEPT), 0.001],
  ['beginner', 'ukot_oil_p50_mmbbl', SB.reservesP50(agg), 0.001],
  ['beginner', 'ukot_gas_p50_bcf', SB.reservesP50(agg, 'Gas'), 0.001],
  ['beginner', 'ukot_base_npv_mm', base.metrics.npv, 0.05],
  // EC6-8 RETIRED ukot_base_irr_pct. Charging the end-of-life cost makes the
  // Board case flow change sign twice, so the engine returns irr null with
  // irrStatus multiple-roots and BOTH roots in irrRoots. A numerically graded
  // field cannot grade a null, and the higher root (37.6593) sits 0.0097 from
  // the retired answer of 37.66903, inside the old tolerance of 0.01, so
  // grading it would pass a learner who ran the pre-repair case. The LOWER root
  // can only be found by reading both, which is the judgement the repair
  // exposes.
  ['beginner', 'ukot_base_irr_low_root_pct', base.metrics.irrRoots[0], 0.01],
  // Payback is taught but not graded: a payback in years restated x1000 lands
  // in the middle of the digest's four-decimal money and collides with
  // something whatever the conditions are. The two-concept comparison is
  // graded instead.
  ['beginner', 'ukot_alternative_npv_mm', alt.metrics.npv, 0.05],
  // Professional. Money and whole currency units where possible: a small
  // integer answer collides with half the digest and grades nothing.
  ['intermediate', 'ukot_network_duration_days', SH.calculateNetworkDuration(NET), 0.5],
  ['intermediate', 'ukot_calendar_span_days', SH.calculateProjectDuration(NET), 0.5],
  ['intermediate', 'ukot_uk01_well_cost_usd', WL.calculateDrillingCost(WL.calculateDrillingTime(UKOT_WELLS[0].md, UKOT_WELLS[0].trajectory), UKOT_RIG_RATE), 1],
  ['intermediate', 'ukot_campaign_cost_usd', UKOT_WELLS.reduce((sum, w) => sum + WL.calculateDrillingCost(WL.calculateDrillingTime(w.md, w.trajectory), UKOT_RIG_RATE), 0), 1],
  ['intermediate', 'ukot_platform_capex_mm', FA.calculateFacilityCost(UKOT_FACILITIES[0]).capex, 0.01],
  ['intermediate', 'ukot_platform_decommissioning_mm', FA.calculateFacilityCost(UKOT_FACILITIES[0]).decommissioning, 0.01],
  // Expert
  ['advanced', 'meren_planned_value_usd', evm.pv, 1],
  ['advanced', 'meren_earned_value_usd', evm.ev, 1],
  ['advanced', 'meren_spi', evm.spi, 1e-5],
  ['advanced', 'meren_completion_ratio', evm.completionRatio, 1e-5],
  ['advanced', 'ukot_price_swing_mm', Math.abs(price.highParamNPV - price.lowParamNPV), 0.05],
  ['advanced', 'ukot_stress_npv_mm', stress.metrics.npv, 0.05],
];

fs.writeFileSync('/root/ec-wip-fdp/fields.json', JSON.stringify(F, null, 1));
const f = (x, n) => (x === null ? 'null' : Number(x).toFixed(n));
console.log('# EC6 capstone, UKOT and MEREN-3');
console.log(`oil P50 ${f(SB.reservesP50(agg), 4)} MMbbl, gas P50 ${f(SB.reservesP50(agg, 'Gas'), 4)} Bcf`);
console.log(`concept capex ${f(SC.conceptCapexMM(UKOT_CONCEPT), 4)}; alternative ${f(SC.conceptCapexMM(UKOT_ALTERNATIVE), 4)}`);
console.log(`abandonment: ${ABEX.abandonmentSource} ${f(ABEX.abandonmentMM, 4)} :: ${ABEX.abandonmentBasis}`);
console.log(`base NPV ${f(base.metrics.npv, 4)} IRR ${f(base.metrics.irr, 4)} (${base.metrics.irrStatus}) roots ${JSON.stringify(base.metrics.irrRoots)} payback ${f(SC.scenarioPayback(UKOT_BASE, UKOT_CONCEPT), 4)}`);
console.log(`alternative NPV ${f(alt.metrics.npv, 4)} IRR ${f(alt.metrics.irr, 4)}`);
console.log(`stress NPV ${f(stress.metrics.npv, 4)} IRR ${stress.metrics.irr === null ? 'none' : f(stress.metrics.irr, 4)} status ${stress.metrics.irrStatus}`);
console.log(`network ${SH.calculateNetworkDuration(NET)} days, calendar ${SH.calculateProjectDuration(NET)} days, critical ${JSON.stringify(SH.criticalPaths(NET))}`);
cpm.forEach((a) => console.log(`  ${a.id} ${a.name}: es ${a.es} ef ${a.ef} float ${a.float} critical ${a.isCritical}`));
console.log(`plan capex ${f(planCase.capexMM, 4)} opex ${f(planCase.annualOpexMM, 4)}; price swing ${f(Math.abs(price.highParamNPV - price.lowParamNPV), 4)}`);
console.log(`facilities: ${UKOT_FACILITIES.map((x) => `${x.name} capex ${f(FA.calculateFacilityCost(x).capex, 4)} decom ${f(FA.calculateFacilityCost(x).decommissioning, 4)}`).join('; ')}`);
console.log(`wells: ${UKOT_WELLS.map((w) => `${w.name} ${f(WL.calculateDrillingTime(w.md, w.trajectory), 0)} d ${f(WL.calculateDrillingCost(WL.calculateDrillingTime(w.md, w.trajectory), UKOT_RIG_RATE), 0)} USD`).join('; ')}`);
console.log(`risks: health ${f(RK.calculatePortfolioHealth(UKOT_RISKS), 0)} exposure ${f(RK.calculateRiskExposure(UKOT_RISKS), 4)} levels ${JSON.stringify(RK.aggregateRisksByLevel(UKOT_RISKS))}`);
console.log(`MEREN-3 as of ${MEREN_AS_OF}: PV ${f(evm.pv, 0)} EV ${f(evm.ev, 0)} AC ${f(evm.ac, 0)} SPI ${f(evm.spi, 6)} CPI ${f(evm.cpi, 6)} ratio ${f(evm.completionRatio, 6)}`);
console.log(`\n18 fields written to fields.json`);
