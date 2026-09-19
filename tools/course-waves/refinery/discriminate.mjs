// THE DISCRIMINATE SWEEP, per gate-must-call-the-engine: for each of the
// eighteen graded fields, does a plausible WRONG ROUTE actually move it by more
// than the field's tolerance? A field no error moves grades nothing, whatever
// the prompt claims it tests.
//
// The wrong routes are the defects MD2-0 repaired, asked of the ENGINE (a
// crude unit left out of the plan, a typed zero read as no limit, a stream
// value read off the raw dual, a cost gap counted as a margin gain, the revenue
// and cost gaps added together, an unmatched movement folded in, the
// construction-year tax loss thrown away), and the ordinary slips a learner
// makes (the other scaling exponent, 365 days, the firm scenario's utilisation,
// the premium left out, the product price read as the stream value). Each is
// named for the mistake. A route is BLIND when it lands within tolerance of
// the right answer; the table also prints the CLOSEST MISS in tolerances.
//
// Usage: node discriminate.mjs [--plant]   (exit 1 on any WEAK field, 2 on a refusal)
import fs from 'fs';
import * as K from './refinery_fields_capstone.mjs';
import { loadGuarded } from './clockguard.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-md-refinery-nextgen/packages/engines';
const { RAW, G } = await loadGuarded(ROOT, { periodStart: K.PERIOD_START, startYears: [K.START_YEAR] });
const RP = G.refineryPlanning; const SM = G.streamModel; const MR = G.modularRefinery; const SC = G.screening;
const fields = Object.fromEntries(JSON.parse(fs.readFileSync(`${HERE}fields.json`, 'utf8')).map((f) => [f[1], f]));
const EXP = RAW.modularRefinery.SCALING_EXPONENT;
const CFG = RAW.modularRefinery.CONFIGURATIONS;
const scen = (id) => RAW.modularRefinery.SUPPLY_SCENARIOS.find((s) => s.id === id);

/* ------------------------------ IKARAMA ------------------------------ */
const I = K.IKARAMA;
const iS = scen(I.scenarioId);
const iSlate = MR.productSlate({ productYields: CFG[I.configurationId].productYields, prices: I.prices });
const capexAt = (exponent) => MR.scaleCapex({ baseCost: I.baseCost, baseCapacity: I.baseCapacity, capacity: I.capacityBpd, exponent }).cost;
const iCapex = capexAt(EXP.MODULAR);
const iStreams = (over = {}) => MR.feasibilityStreams({
  capacityBpd: I.capacityBpd, onstreamDays: I.onstreamDays, utilisation: iS.utilisation,
  crudeCostPerBbl: I.crudeCostPerBbl + iS.crudePremium, slate: iSlate, fixedOpexPerYear: I.fixedOpexPerYear,
  variableOpexPerBbl: I.variableOpexPerBbl, projectLife: I.projectLife, constructionYears: I.constructionYears,
  capex: iCapex, ...over,
});
const iSt = iStreams();
const yieldNoLoss = Object.entries(CFG[I.configurationId].productYields).filter(([k]) => k !== 'loss').reduce((s, [, v]) => s + v, 0);
const firstRev = (st) => st.years[I.constructionYears].revenue;

/* ------------------------------ AMASSOMA ----------------------------- */
const A = K.AMASSOMA;
const aIn = { streams: A.streams, crudes: A.crudes, units: A.units, products: A.products };
const aPlan = RP.planRefinery(aIn);
const aZeroUnlimited = RP.planRefinery({ ...aIn, crudes: A.crudes.map((c) => (c.available === 0 ? { ...c, available: '' } : c)) });
const aNoCrudeUnit = RP.planRefinery({ ...aIn, units: A.units.map((u) => (u.feed ? u : { ...u, feed: 'crude_feed' })) });
const cdu = (p) => p.unitRuns.find((u) => u.id === 'cdu');
const mv = (p, s) => p.streamBalance.find((b) => b.id === s).marginalValue;
const price = (id) => A.products.find((p) => p.id === id).price;
const availSum = A.crudes.reduce((s, c) => s + c.available, 0);
const productBbl = aPlan.productMakes.reduce((s, m) => s + m.volume, 0);
const dht = A.units.find((u) => u.id === 'dht');

/* ------------------------------ KOLOAMA ------------------------------ */
const KO = K.KOLOAMA;
const kPlan = RP.planRefinery({ streams: KO.streams, crudes: KO.crudes, units: KO.units, products: KO.products });
const kSch = RP.cascadeToSchedule({ plan: kPlan, periodStart: K.PERIOD_START, periodDays: K.PERIOD_DAYS, cargoSize: KO.cargoSize });
const kAct = KO.actuals.map((a, i) => SM.makeEvent({ id: `a${i}`, ledger: 'actual', type: a.type, materialId: a.materialId, quantity: a.quantity, cost: a.cost }));
const kRec = RP.reconcilePeriod({ planEvents: kSch.events, actualEvents: kAct, plan: kPlan });
const line = (m, t) => kRec.lines.find((l) => l.materialId === m && l.type === t);
const usan = line('usan', 'receipt'); const diesel = line('diesel', 'delivery');
const rawSum = kRec.lines.reduce((s, l) => s + l.totalVariance, 0);
const costLines = kRec.lines.filter((l) => l.direction === 'cost');
const X = KO.expansion; const xS = scen(X.scenarioId);
const xSlate = MR.productSlate({ productYields: CFG[X.configurationId].productYields, prices: X.prices });
const xCap = MR.scaleCapex({ baseCost: X.baseCost, baseCapacity: X.baseCapacity, capacity: X.capacityBpd, exponent: X.modularExponent });
const xSt = MR.feasibilityStreams({
  capacityBpd: X.capacityBpd, onstreamDays: X.onstreamDays, utilisation: xS.utilisation, crudeCostPerBbl: X.crudeCostPerBbl + xS.crudePremium,
  slate: xSlate, fixedOpexPerYear: X.fixedOpexPerYear, variableOpexPerBbl: X.variableOpexPerBbl, projectLife: X.projectLife,
  constructionYears: X.constructionYears, capex: xCap.cost,
});
const xEcon = MR.feasibilityEconomics({ streams: xSt, discountRate: X.discountRate, taxRate: X.taxRate, startYear: K.START_YEAR });
const taxes = (e) => e.cashflow.map((c) => c.tax);
const firstTax = (e) => taxes(e).find((t) => t > 0);
const lifeTax = (e) => taxes(e).reduce((s, t) => s + t, 0);
const econ = (over) => SC.calculateEconomics({ ...xEcon.inputs, ...over, startYear: K.START_YEAR });
const optionOff = econ({ lossCarryForward: false });
const capitalNotDeducted = econ({ capex: xEcon.inputs.capex.map(() => 0) });
const latestLossOnly = econ({ capex: xEcon.inputs.capex.map((c, i) => (i === 0 ? 0 : c)) });

const WRONG = {
  ikarama_modular_capex_usd: {
    truth: iCapex,
    routes: {
      the_stick_built_exponent: capexAt(EXP.STICK_BUILT),
      cost_in_proportion_to_capacity: capexAt(1),
      the_ratio_turned_upside_down: MR.scaleCapex({ baseCost: I.baseCost, baseCapacity: I.capacityBpd, capacity: I.baseCapacity, exponent: EXP.MODULAR }).cost,
      the_quotation_taken_as_it_stands: I.baseCost,
    },
  },
  ikarama_stick_built_capex_usd: {
    truth: capexAt(EXP.STICK_BUILT),
    routes: {
      the_modular_exponent: iCapex,
      cost_in_proportion_to_capacity: capexAt(1),
      the_ratio_turned_upside_down: MR.scaleCapex({ baseCost: I.baseCost, baseCapacity: I.capacityBpd, capacity: I.baseCapacity, exponent: EXP.STICK_BUILT }).cost,
    },
  },
  ikarama_gross_value_per_bbl: {
    truth: iSlate.grossValuePerBbl,
    routes: {
      normalised_to_the_product_yield: iSlate.grossValuePerBbl / yieldNoLoss,
      the_loss_valued_as_fuel_oil: MR.productSlate({ productYields: { ...CFG[I.configurationId].productYields, fuelOil: CFG[I.configurationId].productYields.fuelOil + CFG[I.configurationId].productYields.loss, loss: 0 }, prices: I.prices }).grossValuePerBbl,
      a_straight_average_of_the_prices: Object.values(I.prices).reduce((s, v) => s + v, 0) / Object.values(I.prices).length,
      the_hydroskimming_yields: MR.productSlate({ productYields: CFG.hydroskimming.productYields, prices: I.prices }).grossValuePerBbl,
    },
  },
  ikarama_annual_throughput_bbl: {
    truth: iSt.annualBbl,
    routes: {
      a_365_day_year: iStreams({ onstreamDays: 365 }).annualBbl,
      the_firm_scenario_utilisation: iStreams({ utilisation: scen('firm').utilisation }).annualBbl,
      nameplate_every_on_stream_day: iStreams({ utilisation: 1 }).annualBbl,
    },
  },
  ikarama_gross_margin_per_bbl: {
    truth: iSt.grossMarginPerBbl,
    routes: {
      the_supply_premium_left_out: iStreams({ crudeCostPerBbl: I.crudeCostPerBbl }).grossMarginPerBbl,
      the_variable_cost_left_out: iStreams({ variableOpexPerBbl: 0 }).grossMarginPerBbl,
      the_fixed_cost_spread_over_the_barrels: iSt.grossMarginPerBbl - I.fixedOpexPerYear / iSt.annualBbl,
    },
  },
  ikarama_first_year_revenue_usd: {
    truth: firstRev(iSt),
    routes: {
      the_firm_scenario_utilisation: firstRev(iStreams({ utilisation: scen('firm').utilisation })),
      a_365_day_year: firstRev(iStreams({ onstreamDays: 365 })),
      nameplate_every_on_stream_day: firstRev(iStreams({ utilisation: 1 })),
      the_revenue_net_of_crude_cost: firstRev(iSt) - iSt.years[I.constructionYears].crudeCost,
    },
  },
  amassoma_crude_run_bbl: {
    truth: aPlan.totalCrude,
    routes: {
      the_typed_zero_read_as_no_limit: aZeroUnlimited.totalCrude,
      every_crude_at_its_availability: availSum,
      the_crude_unit_capacity: cdu(aPlan).capacity,
    },
  },
  amassoma_cdu_utilisation_pct: {
    truth: cdu(aPlan).utilisation * 100,
    routes: {
      the_typed_zero_read_as_no_limit: cdu(aZeroUnlimited).utilisation * 100,
      the_crude_unit_left_out_of_the_plan: cdu(aNoCrudeUnit).utilisation * 100,
      the_run_over_the_crude_available: (aPlan.totalCrude / availSum) * 100,
    },
  },
  amassoma_plan_margin_usd: {
    truth: aPlan.margin,
    routes: {
      the_typed_zero_read_as_no_limit: aZeroUnlimited.margin,
      the_crude_unit_left_out_of_the_plan: aNoCrudeUnit.margin,
      the_crude_unit_cost_not_charged: aPlan.margin + cdu(aPlan).cost,
      revenue_less_crude_only: aPlan.revenue - aPlan.crudeCost,
    },
  },
  amassoma_gross_margin_per_bbl: {
    truth: aPlan.grossMarginPerBbl,
    routes: {
      the_typed_zero_read_as_no_limit: aZeroUnlimited.grossMarginPerBbl,
      the_crude_unit_left_out_of_the_plan: aNoCrudeUnit.grossMarginPerBbl,
      per_barrel_of_product_sold: aPlan.margin / productBbl,
    },
  },
  amassoma_naphtha_value_per_bbl: {
    truth: mv(aPlan, 'naphtha'),
    routes: {
      the_raw_dual_with_its_sign: -mv(aPlan, 'naphtha'),
      the_naphtha_export_price: price('naphtha_export'),
      the_crude_unit_left_out_of_the_plan: mv(aNoCrudeUnit, 'naphtha'),
      the_typed_zero_read_as_no_limit: mv(aZeroUnlimited, 'naphtha'),
    },
  },
  amassoma_gasoil_value_per_bbl: {
    truth: mv(aPlan, 'gasoil'),
    routes: {
      the_raw_dual_with_its_sign: -mv(aPlan, 'gasoil'),
      the_gasoil_export_price: price('gasoil_export'),
      the_diesel_price_through_the_hydrotreater: price('diesel') * dht.yields.ulsd - dht.opex,
      the_typed_zero_read_as_no_limit: mv(aZeroUnlimited, 'gasoil'),
    },
  },
  koloama_usan_price_variance_usd: {
    truth: usan.priceVariance,
    routes: {
      priced_on_the_plan_quantity: (usan.actualCost / usan.actualQuantity - usan.planCost / usan.planQuantity) * usan.planQuantity,
      the_whole_gap: usan.totalVariance,
      the_volume_variance: usan.volumeVariance,
      signed_on_margin: -usan.priceVariance,
    },
  },
  koloama_diesel_volume_variance_usd: {
    truth: diesel.volumeVariance,
    routes: {
      priced_at_the_actual_price: (diesel.actualQuantity - diesel.planQuantity) * (diesel.actualCost / diesel.actualQuantity),
      the_whole_gap: diesel.totalVariance,
      the_price_variance: diesel.priceVariance,
    },
  },
  koloama_margin_variance_usd: {
    truth: kRec.total.totalVariance,
    routes: {
      revenue_and_cost_gaps_added_together: rawSum,
      a_cost_gap_counted_as_a_margin_gain: kRec.total.revenue.totalVariance + kRec.total.cost.totalVariance,
      the_unmatched_sale_folded_in: kRec.marginVariance,
      the_revenue_lines_only: kRec.total.revenue.totalVariance,
    },
  },
  koloama_cost_variance_usd: {
    truth: kRec.total.cost.totalVariance,
    routes: {
      signed_on_margin: -kRec.total.cost.totalVariance,
      the_crude_receipts_only: costLines.filter((l) => l.type === 'receipt').reduce((s, l) => s + l.totalVariance, 0),
      revenue_and_cost_gaps_added_together: rawSum,
    },
  },
  koloama_first_tax_mm: {
    truth: firstTax(xEcon),
    routes: {
      the_construction_loss_thrown_away: firstTax(optionOff),
      the_first_operating_year_tax: xEcon.cashflow[X.constructionYears].tax,
      only_the_latest_year_loss_carried: firstTax(latestLossOnly),
      the_capital_not_deducted: firstTax(capitalNotDeducted),
    },
  },
  koloama_lifetime_tax_mm: {
    truth: lifeTax(xEcon),
    routes: {
      the_construction_loss_thrown_away: lifeTax(optionOff),
      the_capital_not_deducted: lifeTax(capitalNotDeducted),
      only_the_latest_year_loss_carried: lifeTax(latestLossOnly),
    },
  },
};

// NEGATIVE CONTROL: --plant adds a route that lands on the right answer, and
// the sweep must then report exactly one WEAK field.
if (process.argv.includes('--plant')) WRONG.amassoma_plan_margin_usd.routes.planted_identity = WRONG.amassoma_plan_margin_usd.truth;
let weak = 0; let routes = 0; let closest = { miss: Infinity, key: null };
console.log('field                                  routes  moved  blind   closest miss (tolerances)');
for (const [key, { truth, routes: rs }] of Object.entries(WRONG)) {
  if (!fields[key]) { console.log(`  REFUSES: ${key} is not in fields.json`); process.exit(2); }
  const tol = fields[key][3];
  if (Math.abs(fields[key][2] - truth) > tol / 1000) { console.log(`  REFUSES: ${key} in fields.json is ${fields[key][2]} and this sweep computes ${truth}`); process.exit(2); }
  const blind = []; let nearest = Infinity;
  for (const [name, got] of Object.entries(rs)) {
    routes += 1;
    if (typeof got !== 'number' || !Number.isFinite(got)) { console.log(`  REFUSES: route ${key}.${name} produced ${got}`); process.exit(2); }
    const d = Math.abs(got - truth) / tol;
    if (d <= 1) blind.push(`${name} (lands on ${got})`); else nearest = Math.min(nearest, d);
  }
  if (blind.length) weak += 1;
  if (nearest < closest.miss) closest = { miss: nearest, key };
  const n = Object.keys(rs).length;
  console.log(`${key.padEnd(38)} ${String(n).padStart(6)} ${String(n - blind.length).padStart(6)} ${String(blind.length).padStart(6)}   ${nearest.toFixed(1)}`);
  blind.forEach((b) => console.log(`    BLIND ${b}`));
}
if (Object.keys(WRONG).length !== 18) { console.log('  REFUSES: not eighteen fields'); process.exit(2); }
console.log(`\ndiscriminate: 18 graded fields, ${routes} wrong routes swept, ${weak} WEAK field(s)`);
console.log(`the closest miss anywhere in the eighteen: ${closest.key} at ${closest.miss.toFixed(1)} tolerances (tolerance ${fields[closest.key][3]})`);
if (routes < 18 * 3) { console.log('  GATE REFUSES: fewer than three wrong routes a field is not a sweep'); process.exit(2); }
process.exit(weak ? 1 : 0);
