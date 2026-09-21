// THE REFINERY CAPSTONE GENERATOR. Runs the three capstone records through the
// vendored engines and writes the eighteen graded fields, six a tier, with
// their tolerances, the precision declaration, and the draft capstone prompts.
//
// Nothing here is read by refinery_dump.mjs and nothing here is quoted into a
// lesson. The digest and the capstone are two separate roads, and
// gate_capstone_leak.py sweeps both directions to keep it that way.
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE, reached through the same
// clock gate as the digest (clockguard.mjs), so no graded value can have come
// from the machine clock. The only arithmetic done here is the unit change the
// field's name states (a fraction x 100 for a percent) and the sum of the
// engine's own per-year tax for the lifetime tax.
//
// NO NPV AND NO IRR IS GRADED. The Economics courses grade those. The two tax
// fields are the screening engine's per-year tax as feasibilityEconomics runs
// it for a refinery (loss carried forward, no royalty).
//
// TOLERANCES, one derivation, CLASSES in refinery_fields_capstone.mjs: US
// dollars and barrels are graded to the whole unit (0.5); dollars a barrel to
// the cent (0.005); percents to two decimals (0.005); the screening engine's
// millions to four decimals (0.00005). Each is at least half a unit of the
// places the digest prints its class to, which is what gradeprecision.py asks.
// The expected value stored is the engine's figure rounded to six places past
// the graded place, so float noise never decides a grade.
//
// Usage: node refinery_capstone.mjs [--json]
import fs from 'fs';
import * as K from './refinery_fields_capstone.mjs';
import { loadGuarded } from './clockguard.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-md-refinery-nextgen/packages/engines';
const { RAW, G } = await loadGuarded(ROOT, { periodStart: K.PERIOD_START, startYears: [K.START_YEAR] });
const RP = G.refineryPlanning; const SM = G.streamModel; const MR = G.modularRefinery;

export const classOf = (key) => {
  const hits = Object.entries(K.CLASSES).filter(([, c]) => c.suffix.test(key));
  if (hits.length === 0) throw new Error(`${key} has no grading class`);
  hits.sort((a, b) => b[1].suffix.source.length - a[1].suffix.source.length);
  return hits[0][0];
};

/* ---------------------------- IKARAMA ---------------------------- */
const I = K.IKARAMA;
const iScen = RAW.modularRefinery.SUPPLY_SCENARIOS.find((s) => s.id === I.scenarioId);
const iSlate = MR.productSlate({ productYields: RAW.modularRefinery.CONFIGURATIONS[I.configurationId].productYields, prices: I.prices });
const iMod = MR.scaleCapex({ baseCost: I.baseCost, baseCapacity: I.baseCapacity, capacity: I.capacityBpd, exponent: RAW.modularRefinery.SCALING_EXPONENT.MODULAR });
const iStick = MR.scaleCapex({ baseCost: I.baseCost, baseCapacity: I.baseCapacity, capacity: I.capacityBpd, exponent: RAW.modularRefinery.SCALING_EXPONENT.STICK_BUILT });
const iSt = MR.feasibilityStreams({
  capacityBpd: I.capacityBpd, onstreamDays: I.onstreamDays, utilisation: iScen.utilisation,
  crudeCostPerBbl: I.crudeCostPerBbl + iScen.crudePremium, slate: iSlate,
  fixedOpexPerYear: I.fixedOpexPerYear, variableOpexPerBbl: I.variableOpexPerBbl,
  projectLife: I.projectLife, constructionYears: I.constructionYears, capex: iMod.cost,
});
if (iSt.error) throw new Error(`IKARAMA streams refused: ${iSt.error}`);

/* ---------------------------- AMASSOMA --------------------------- */
const A = K.AMASSOMA;
const aPlan = RP.planRefinery({ streams: A.streams, crudes: A.crudes, units: A.units, products: A.products });
if (aPlan.status !== 'optimal') throw new Error(`AMASSOMA plan is ${aPlan.status}`);
const aCdu = aPlan.unitRuns.find((u) => u.crudeUnit);
const aMv = (s) => aPlan.streamBalance.find((b) => b.id === s).marginalValue;

/* ---------------------------- KOLOAMA ---------------------------- */
const KO = K.KOLOAMA;
const kPlan = RP.planRefinery({ streams: KO.streams, crudes: KO.crudes, units: KO.units, products: KO.products });
if (kPlan.status !== 'optimal') throw new Error(`KOLOAMA plan is ${kPlan.status}`);
const kSch = RP.cascadeToSchedule({ plan: kPlan, periodStart: K.PERIOD_START, periodDays: K.PERIOD_DAYS, cargoSize: KO.cargoSize });
const kAct = KO.actuals.map((a, i) => SM.makeEvent({ id: `actual-${i + 1}`, ledger: 'actual', type: a.type, materialId: a.materialId, quantity: a.quantity, cost: a.cost }));
const kRec = RP.reconcilePeriod({ planEvents: kSch.events, actualEvents: kAct, plan: kPlan });
const kLine = (m, t) => kRec.lines.find((l) => l.materialId === m && l.type === t);
const X = KO.expansion;
const xScen = RAW.modularRefinery.SUPPLY_SCENARIOS.find((s) => s.id === X.scenarioId);
const xSlate = MR.productSlate({ productYields: RAW.modularRefinery.CONFIGURATIONS[X.configurationId].productYields, prices: X.prices });
const xCap = MR.scaleCapex({ baseCost: X.baseCost, baseCapacity: X.baseCapacity, capacity: X.capacityBpd, exponent: X.modularExponent });
const xSt = MR.feasibilityStreams({
  capacityBpd: X.capacityBpd, onstreamDays: X.onstreamDays, utilisation: xScen.utilisation,
  crudeCostPerBbl: X.crudeCostPerBbl + xScen.crudePremium, slate: xSlate,
  fixedOpexPerYear: X.fixedOpexPerYear, variableOpexPerBbl: X.variableOpexPerBbl,
  projectLife: X.projectLife, constructionYears: X.constructionYears, capex: xCap.cost,
});
const xEcon = MR.feasibilityEconomics({ streams: xSt, discountRate: X.discountRate, taxRate: X.taxRate, startYear: K.START_YEAR });
if (xEcon.error) throw new Error(`KOLOAMA expansion refused: ${xEcon.error}`);
const firstTaxYear = xEcon.cashflow.findIndex((c) => c.tax > 0);
if (firstTaxYear <= X.constructionYears) throw new Error('KOLOAMA: the loss is not carried into any operating year, so the field would not test carry-forward');

const round = (v, d) => Number(v.toFixed(d));
const RAWFIELDS = [
  ['beginner', 'ikarama_modular_capex_usd', iMod.cost],
  ['beginner', 'ikarama_stick_built_capex_usd', iStick.cost],
  ['beginner', 'ikarama_gross_value_per_bbl', iSlate.grossValuePerBbl],
  ['beginner', 'ikarama_annual_throughput_bbl', iSt.annualBbl],
  ['beginner', 'ikarama_gross_margin_per_bbl', iSt.grossMarginPerBbl],
  ['beginner', 'ikarama_first_year_revenue_usd', iSt.years[I.constructionYears].revenue],
  ['intermediate', 'amassoma_crude_run_bbl', aPlan.totalCrude],
  ['intermediate', 'amassoma_cdu_utilisation_pct', aCdu.utilisation * 100],
  ['intermediate', 'amassoma_plan_margin_usd', aPlan.margin],
  ['intermediate', 'amassoma_gross_margin_per_bbl', aPlan.grossMarginPerBbl],
  ['intermediate', 'amassoma_naphtha_value_per_bbl', aMv('naphtha')],
  ['intermediate', 'amassoma_gasoil_value_per_bbl', aMv('gasoil')],
  ['advanced', 'koloama_usan_price_variance_usd', kLine('usan', 'receipt').priceVariance],
  ['advanced', 'koloama_diesel_volume_variance_usd', kLine('diesel', 'delivery').volumeVariance],
  ['advanced', 'koloama_margin_variance_usd', kRec.total.totalVariance],
  ['advanced', 'koloama_cost_variance_usd', kRec.total.cost.totalVariance],
  ['advanced', 'koloama_first_tax_mm', xEcon.cashflow[firstTaxYear].tax],
  ['advanced', 'koloama_lifetime_tax_mm', xEcon.cashflow.reduce((s, c) => s + c.tax, 0)],
];
export const FIELDS = RAWFIELDS.map(([tier, key, v]) => {
  const c = K.CLASSES[classOf(key)];
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${tier}.${key} is ${v}, which is not a finite number the engine returned`);
  // six places past the graded place: tol 0.5 -> 6 decimals, 0.005 -> 8, 0.00005 -> 10
  const graded = Math.round(-Math.log10(c.tol * 2));
  return [tier, key, round(v, graded + 6), c.tol];
});
for (const [tier, key] of FIELDS) if (!K.FIELD_SOURCES[key]) throw new Error(`${key} has no FIELD_SOURCES row`);
if (FIELDS.length !== 18 || new Set(FIELDS.map((f) => f[1])).size !== 18) throw new Error('eighteen distinct graded keys expected');
for (const t of ['beginner', 'intermediate', 'advanced']) {
  if (FIELDS.filter((f) => f[0] === t).length !== 6) throw new Error(`${t} does not grade six fields`);
}
if (FIELDS.some(([, k]) => /npv|irr/i.test(k))) throw new Error('an NPV or IRR field: the Economics courses grade those');

/* ------------------------- the prompts ------------------------- */
// DRAFT PROMPTS. They state every condition a field needs and nothing that
// hands over an answer: gate_promptleak.py refuses any prompt that carries a
// graded value in any rendering, or a figure the engine derives on the way to
// one (a plan volume, a scaled capital cost).
const n = (v) => String(v);
const yieldsTxt = (y) => Object.entries(y).map(([k, v]) => `${k} ${n(v)}`).join(', ');
const planTxt = (c) => [
  `Streams: ${c.streams.join(', ')}.`,
  `Crudes: ${c.crudes.map((x) => `${x.name} at ${n(x.cost)} dollars a barrel, ${x.available === 0 ? 'availability typed as 0 (the cargo was cancelled)' : `up to ${n(x.available)} barrels`}, yields ${yieldsTxt(x.yields)}`).join('; ')}.`,
  `Units: ${c.units.map((u) => `${u.name}, capacity ${n(u.capacity)} barrels, operating cost ${n(u.opex)} dollars a barrel, ${u.feed ? `feed ${u.feed}, yields ${yieldsTxt(u.yields)}` : 'no feed (the crude unit)'}`).join('; ')}.`,
  `Products: ${c.products.map((p) => `${p.name} at ${n(p.price)} dollars a barrel, up to ${n(p.maxDemand)} barrels, made from ${yieldsTxt(p.recipe)}`).join('; ')}.`,
].join(' ');
const pricesTxt = (p) => Object.entries(p).map(([k, v]) => `${k} ${n(v)}`).join(', ');
export const PROMPTS = {
  beginner: `IKARAMA MODULAR REFINERY, ${I.sponsor}. Every price is illustrative, in US dollars. A vendor quoted a ${n(I.baseCapacity)} bpd plant at ${n(I.baseCost / 1e6)} million dollars; the sponsor studies a ${I.configurationId} plant of ${n(I.capacityBpd)} bpd with the configuration's screening yields, ${n(I.onstreamDays)} on-stream days a year, under the ${iScen.name.toLowerCase()} scenario, crude at ${n(I.crudeCostPerBbl)} dollars a barrel before any premium, a fixed operating cost of ${n(I.fixedOpexPerYear / 1e6)} million dollars a year, a variable operating cost of ${n(I.variableOpexPerBbl)} dollars a barrel, ${n(I.constructionYears)} construction years and ${n(I.projectLife)} operating years. Product prices a barrel: ${pricesTxt(I.prices)}. Give six numbers. (1) The capital cost by the modular scaling law, to the whole dollar. (2) The capital cost by the stick-built scaling law, to the whole dollar. (3) The gross value of the product slate per barrel of crude, to the cent. (4) The annual crude throughput under the scenario, to the whole barrel. (5) The gross margin per barrel of crude under the scenario, to the cent. (6) The revenue in the first operating year, to the whole dollar.`,
  intermediate: `AMASSOMA REFINERY, ${A.operator}: the plan for one month. Every price is illustrative, in US dollars; yields are volume fractions. ${planTxt(A)} Every demand floor is 0. Give six numbers from the optimal plan. (1) The total crude run, to the whole barrel. (2) The crude unit's utilisation, in percent to two decimals. (3) The plan margin for the month, to the whole dollar. (4) The gross margin per barrel of crude, to the cent. (5) What one more barrel of naphtha is worth to the plan, in dollars a barrel to the cent. (6) What one more barrel of gasoil is worth to the plan, in dollars a barrel to the cent.`,
  advanced: `KOLOAMA REFINERY, ${KO.operator}. Every price is illustrative, in US dollars; yields are volume fractions. THE MONTH: the plan for the ${K.PERIOD_DAYS}-day period starting ${K.PERIOD_START}, cascaded with a cargo size of ${n(KO.cargoSize)} barrels, is the plan ledger. ${planTxt(KO)} Every demand floor is 0. What the month did, one movement a material and type (a delivery's value is what it sold for): ${KO.actuals.map((a) => `${a.materialId} ${a.type} ${n(a.quantity)} barrels, ${n(a.cost)} dollars`).join('; ')}. THE EXPANSION: a second ${X.configurationId} train of ${n(X.capacityBpd)} bpd with the configuration's screening yields, capital by the modular scaling law from a quotation of ${n(X.baseCost / 1e6)} million dollars for ${n(X.baseCapacity)} bpd, ${n(X.onstreamDays)} on-stream days, ${xScen.name.toLowerCase()}, crude at ${n(X.crudeCostPerBbl)} dollars a barrel, fixed operating cost ${n(X.fixedOpexPerYear / 1e6)} million dollars a year, variable operating cost ${n(X.variableOpexPerBbl)} dollars a barrel, ${n(X.constructionYears)} construction years, ${n(X.projectLife)} operating years, tax rate ${n(X.taxRate)} percent, discount rate ${n(X.discountRate)} percent, product prices a barrel ${pricesTxt(X.prices)}, valued as the Modular Refinery Feasibility Studio values it. Give six numbers. (1) The price variance on the Usan crude receipts, to the whole dollar. (2) The volume variance on the diesel lifts, to the whole dollar. (3) The month's total variance on margin across the matched lines, to the whole dollar. (4) The total variance on the cost lines as recorded, to the whole dollar. (5) The expansion's tax in the first year it pays any, in millions of dollars to four decimals. (6) The expansion's total tax over its life, in millions of dollars to four decimals.`,
};

/* --------------------------- write ----------------------------- */
const fieldsOut = process.env.MD_FIELDS_OUT || `${HERE}fields.json`;
const precOut = process.env.MD_PRECISION_OUT || `${HERE}precision.json`;
const capOut = process.env.MD_CAPSTONE_OUT || `${HERE}capstone.json`;
if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(FIELDS.map(([tier, key, value, tol]) => ({ tier, key, value, tol })))}\n`);
} else if (!process.argv.includes('--no-write')) {
  fs.writeFileSync(fieldsOut, `${JSON.stringify(FIELDS, null, 1)}\n`);
  const prec = {};
  for (const name of Object.keys(K.CLASSES)) {
    const keys = FIELDS.map((f) => f[1]).filter((k) => classOf(k) === name);
    if (keys.length) prec[name] = { decimals: K.CLASSES[name].decimals, match: `^(?:${keys.join('|')})$` };
  }
  fs.writeFileSync(precOut, `${JSON.stringify(prec, null, 1)}\n`);
  fs.writeFileSync(capOut, `${JSON.stringify({
    periodStart: K.PERIOD_START,
    tiers: Object.fromEntries(['beginner', 'intermediate', 'advanced'].map((t) => [t, {
      record: { beginner: 'IKARAMA', intermediate: 'AMASSOMA', advanced: 'KOLOAMA' }[t],
      prompt: PROMPTS[t],
      fields: FIELDS.filter((f) => f[0] === t).map(([, key, , tol]) => ({ key, class: classOf(key), source: K.FIELD_SOURCES[key], tol })),
    }])),
  }, null, 1)}\n`);
  for (const [t, k, v, tol] of FIELDS) process.stdout.write(`${t.padEnd(13)} ${k.padEnd(38)} ${String(v).padStart(22)}  tol ${tol}\n`);
}
