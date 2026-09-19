// THE REFINERY TEACHING DIGEST GENERATOR. Every figure, date, flag and
// refusal in digest.txt is printed by this file straight out of the vendored
// engines (engines/downstream/refineryPlanning.js, streamModel.js,
// modularRefinery.js, and engines/economics/screening.js through
// feasibilityEconomics), called on the teaching cases in refinery_fields.mjs.
// Nothing is typed: a number is the engine's return formatted to the places the
// header declares for its class, a refusal is the engine's own sentence, and a
// comparison the digest states (a flag, a difference) is computed here from two
// engine returns and printed beside them.
//
// THREE GUARDS BUILT INTO THE GENERATOR, so a digest that breaks one of them
// cannot be written at all:
//
//   THE CLOCK GATE (clockguard.mjs). The exports that read the machine clock
//   when an argument is left out are found by reading the engine source, and a
//   call that does not pass the wave's fixed period start or start year throws.
//   `--plant-clock` makes one deliberate bare call so the gate can be shown to
//   fire.
//
//   THE REFUSAL LABELS. refusal() asserts the engine refused and prints its own
//   sentence; a row cannot be labelled a refusal when the engine answered.
//
//   THE SECTION OWNERS. Each section's owning tier and module comes from ONE
//   table, SECTION_OWNERS, checked against structure.py's module keys at build
//   time, never typed into a heading.
//
// Usage: node refinery_dump.mjs [--plant-clock]   (build_digest.sh pins TZ)
import fs from 'fs';
import { execFileSync } from 'child_process';
import * as F from './refinery_fields.mjs';
import { loadGuarded, MODULES } from './clockguard.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-md-refinery-nextgen/packages/engines';
// MD_PLANT_LOCAL is the reproducibility gate's negative control: it hands the
// schedule a period start built as a Date at LOCAL midnight instead of the
// YYYY-MM-DD string. The engine reads a Date's UTC calendar day, so east of
// Greenwich every schedule date moves back a day. Never set in a build.
const PERIOD = process.env.MD_PLANT_LOCAL ? new Date(2027, 2, 1) : F.PERIOD_START;
const FIXED = { periodStart: PERIOD, startYears: [F.START_YEAR, F.START_YEAR_CHECK] };

const { RAW, G, CLOCK, CALLS } = await loadGuarded(ROOT, FIXED);
const RP = G.refineryPlanning;
const SM = G.streamModel;
const MR = G.modularRefinery;
const SC = G.screening;

if (process.argv.includes('--plant-clock')) {
  // The negative control: one bare call, which the gate must refuse.
  RP.cascadeToSchedule({ plan: RP.planRefinery(F.ABUA), periodDays: 31 });
}

/* ------------------------------------------------------------------ *
 * Output and formatting.
 * ------------------------------------------------------------------ */
const L = [];
const out = (s = '') => L.push(s);
const fx = (v, d) => {
  if (v === null || v === undefined) return 'null';
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`NON-FINITE: ${v}`);
  const s = v.toFixed(d);
  return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s;
};
const bbl = (v) => fx(v, 2);          // barrels
const usd = (v) => fx(v, 2);          // US dollars
const pbl = (v) => fx(v, 4);          // US dollars a barrel
const pct = (v) => (v === null ? 'null' : fx(v * 100, 2)); // a fraction printed as a percent
const frac = (v) => fx(v, 4);         // a fraction
const mmd = (v) => fx(v, 4);          // millions of US dollars (the screening engine's unit)
const row = (...cells) => out(`| ${cells.join(' | ')} |`);
const head = (...cells) => { row(...cells); row(...cells.map(() => '---')); };
const q = (s) => `"${s}"`;
let refusedCount = 0;
const refusal = (msg, where) => {
  if (!msg || !String(msg).trim()) throw new Error(`REFUSAL LABEL: ${where} was expected to be refused with a sentence, and the engine answered`);
  refusedCount += 1;
  return `REFUSED: ${q(msg)}`;
};

/* ------------------------------------------------------------------ *
 * THE SECTION OWNERS, one table, checked against structure.py.
 * ------------------------------------------------------------------ */
const SECTION_OWNERS = {
  1: [['beginner', 'm01']], 2: [['beginner', 'm01']], 3: [['beginner', 'm02']], 4: [['beginner', 'm03']],
  5: [['beginner', 'm04']], 6: [['beginner', 'm05']], 7: [['beginner', 'm05']], 8: [['beginner', 'm06']],
  9: [['intermediate', 'm01']], 10: [['intermediate', 'm01'], ['intermediate', 'm03']],
  11: [['intermediate', 'm02']], 12: [['intermediate', 'm03']], 13: [['intermediate', 'm01'], ['intermediate', 'm03']],
  14: [['intermediate', 'm04']], 15: [['intermediate', 'm05']], 16: [['intermediate', 'm05']],
  17: [['intermediate', 'm06']],
  18: [['advanced', 'm01']], 19: [['advanced', 'm01']], 20: [['advanced', 'm02']], 21: [['advanced', 'm03']],
  22: [['advanced', 'm04']], 23: [['advanced', 'm05']], 24: [['advanced', 'm06']],
};
const TIER_WORD = { beginner: 'Associate', intermediate: 'Professional', advanced: 'Expert' };
const structureKeys = (() => {
  const src = fs.readFileSync(`${HERE}structure.py`, 'utf8');
  const keys = new Set(); let tier = null;
  for (const line of src.split('\n')) {
    const t = /^ '(beginner|intermediate|advanced)': \[/.exec(line);
    if (t) tier = t[1];
    const m = /^  \('(m\d\d)-/.exec(line);
    if (m && tier) keys.add(`${tier}:${m[1]}`);
  }
  return keys;
})();
if (structureKeys.size !== 18) throw new Error(`SECTION OWNERS: structure.py yielded ${structureKeys.size} module keys, expected 18`);
let sectionNo = 0;
const section = (title) => {
  sectionNo += 1;
  const own = SECTION_OWNERS[sectionNo];
  if (!own) throw new Error(`SECTION OWNERS: section ${sectionNo} has no owner row`);
  for (const [t, m] of own) {
    if (!structureKeys.has(`${t}:${m}`)) throw new Error(`SECTION OWNERS: section ${sectionNo} names ${t} ${m}, which structure.py does not declare`);
  }
  const tiers = [...new Set(own.map(([t]) => t))];
  const owners = tiers.map((t) => `${TIER_WORD[t]} ${own.filter(([x]) => x === t).map(([, m]) => m).join(' and ')}`).join(' and ');
  out('');
  out(`# SECTION ${sectionNo}: ${title} (owned by ${owners})`);
  out('');
};

/* ------------------------------------------------------------------ *
 * Case helpers.
 * ------------------------------------------------------------------ */
const planInput = (c) => ({ streams: c.streams, crudes: c.crudes, units: c.units, products: c.products });
const withSet = (c, set) => {
  const x = JSON.parse(JSON.stringify(planInput(c)));
  for (const [kind, id, field, value] of set) {
    const r = x[kind].find((y) => y.id === id);
    if (!r) throw new Error(`no ${kind} ${id}`);
    r[field] = value;
  }
  return x;
};
const blankAllLimits = (c) => {
  const x = JSON.parse(JSON.stringify(planInput(c)));
  x.crudes.forEach((r) => { r.available = ''; });
  x.units.forEach((r) => { r.capacity = ''; });
  x.products.forEach((r) => { r.maxDemand = ''; });
  return x;
};
const scenario = (id) => {
  const s = RAW.modularRefinery.SUPPLY_SCENARIOS.find((x) => x.id === id);
  if (!s) throw new Error(`no scenario ${id}`);
  return s;
};
const streamsFor = (c, { scenarioId, capex, slate, utilisation, constructionYears }) => {
  const s = scenario(scenarioId);
  return MR.feasibilityStreams({
    capacityBpd: c.capacityBpd,
    onstreamDays: c.onstreamDays,
    utilisation: utilisation ?? s.utilisation,
    crudeCostPerBbl: c.crudeCostPerBbl + s.crudePremium,
    slate,
    fixedOpexPerYear: c.fixedOpexPerYear,
    variableOpexPerBbl: c.variableOpexPerBbl,
    projectLife: c.projectLife,
    constructionYears: constructionYears ?? c.constructionYears,
    capex,
  });
};
const ev = (ledger, a, i) => SM.makeEvent({ id: `${ledger}-${i + 1}`, ledger, type: a.type, materialId: a.materialId, quantity: a.quantity, cost: a.cost });

/* ================================================================== */
out('# refinery: Refinery Feasibility & Planning. Teaching digest.');
out('# Precision: barrels print to two decimals, US dollars to two decimals, US dollars a barrel to four decimals, percents to two decimals, fractions to four decimals, and the screening engine\'s millions of US dollars to four decimals. Counts are whole numbers.');
out(`# PERIOD START: ${F.PERIOD_START}, a ${F.PERIOD_DAYS}-day period. Every schedule in this digest is cascaded from this one period start, passed to the engine as that YYYY-MM-DD string; the period crosses the North American spring clock change. START YEAR: ${F.START_YEAR}, passed to every valuation. Nothing below read the machine clock, and the generator refuses to print a line from a call that did not pass them.`);
out('# ENGINES: engines/downstream (refineryPlanning, streamModel, modularRefinery) and lib/lp/simplex at petrolord-engines 60ee266, and engines/economics/screening as NextGen vendors it (an older copy carrying the lossCarryForward option), under packages/engines.');
out('# CASES: OKORDIA (a modular refinery feasibility screen), ABUA (one month\'s refinery plan and its schedule), ODIOMA (a month\'s plan, its actuals and variance, and a conversion expansion valued through the screening engine). All three are invented records. Crude grade names are labels on invented yields and prices, and every price and cost in this digest is illustrative, in US dollars.');
out('# Built by build_digest.sh from refinery_dump.mjs and refinery_fields.mjs. Never edited by hand.');

/* ------------------------------------------------------------------ */
section('WHAT THE TWO APPS COMPUTE');
out('Two Suite apps call these modules: the Modular Refinery Feasibility Studio (modularRefinery, and the screening engine through feasibilityEconomics) and the Refinery Planning Studio (refineryPlanning, over lib/lp/simplex and streamModel). The counts below are measured from the modules themselves.');
out('');
head('module', 'exported functions', 'exported lists and constants', 'exports that read the machine clock when an argument is left out');
for (const mod of Object.keys(MODULES)) {
  const fns = Object.values(RAW[mod]).filter((v) => typeof v === 'function').length;
  const other = Object.values(RAW[mod]).filter((v) => typeof v !== 'function').length;
  const clocks = [...CLOCK.values()].filter((n) => n.startsWith(`${mod}.`));
  row(mod, fns, other, clocks.length ? clocks.map((n) => n.split('.')[1]).join(', ') : 'none');
}
out('');
out('The clock readers, and the argument that stops each one reading the clock: cascadeToSchedule reads it when periodStart is left out; feasibilityEconomics and calculateEconomics read the year when startYear is left out. This digest passes both every time.');
out('');
out(`modularRefinery.SCALING_EXPONENT: STICK_BUILT ${RAW.modularRefinery.SCALING_EXPONENT.STICK_BUILT}, MODULAR ${RAW.modularRefinery.SCALING_EXPONENT.MODULAR}`);
out(`modularRefinery.CONFIGURATIONS: ${Object.keys(RAW.modularRefinery.CONFIGURATIONS).join(', ')}`);
out(`modularRefinery.SUPPLY_SCENARIOS: ${RAW.modularRefinery.SUPPLY_SCENARIOS.map((s) => s.id).join(', ')}`);
out(`modularRefinery.LICENSING_STAGES: ${RAW.modularRefinery.LICENSING_STAGES.map((s) => s.name).join(', ')}`);
out(`streamModel.LEDGER: ${Object.values(RAW.streamModel.LEDGER).join(', ')}`);
out(`streamModel.EVENT_TYPE: ${Object.values(RAW.streamModel.EVENT_TYPE).join(', ')}`);
out(`lib/lp/simplex LP_STATUS: ${Object.values(RAW.simplex.LP_STATUS).join(', ')}`);

/* ------------------------------------------------------------------ */
section('A BLANK BOX IS REFUSED');
{
  const O = F.OKORDIA;
  const slate = MR.productSlate({ productYields: RAW.modularRefinery.CONFIGURATIONS[O.configurationId].productYields, prices: O.prices });
  const cap = MR.scaleCapex({ baseCost: O.baseCost, baseCapacity: O.baseCapacity, capacity: O.capacityBpd });
  const base = { capacityBpd: O.capacityBpd, onstreamDays: O.onstreamDays, utilisation: 0.92, crudeCostPerBbl: O.crudeCostPerBbl, slate, fixedOpexPerYear: O.fixedOpexPerYear, variableOpexPerBbl: O.variableOpexPerBbl, projectLife: O.projectLife, constructionYears: O.constructionYears, capex: cap.cost };
  out('feasibilityStreams on the OKORDIA plant with one input changed at a time. A money or size box left blank is refused by name, and a utilisation or an on-stream day count outside its range is refused with the range.');
  out('');
  head('input changed', 'what the engine returns');
  const cases = [
    ['crude cost left blank', { crudeCostPerBbl: '' }],
    ['capital cost left blank', { capex: '' }],
    ['capacity and fixed operating cost left blank', { capacityBpd: '', fixedOpexPerYear: '' }],
    ['variable operating cost left blank', { variableOpexPerBbl: null }],
    ['utilisation typed as 90', { utilisation: 90 }],
    ['utilisation typed as -0.1', { utilisation: -0.1 }],
    ['on-stream days typed as 400', { onstreamDays: 400 }],
    ['on-stream days typed as 0', { onstreamDays: 0 }],
  ];
  for (const [label, patch] of cases) {
    const r = MR.feasibilityStreams({ ...base, ...patch });
    row(label, refusal(r.error, label));
  }
  const ok = MR.feasibilityStreams({ ...base, utilisation: 0 });
  row('utilisation typed as 0', `answered: annual throughput ${bbl(ok.annualBbl)} bbl`);
  out('');
  out('scaleCapex with a blank or zero input returns no cost at all rather than a zero cost:');
  head('input', 'cost', 'per bpd');
  for (const [label, a] of [['capacity 0', { capacity: 0 }], ['reference cost blank', { baseCost: '' }], ['reference capacity blank', { baseCapacity: null }]]) {
    const r = MR.scaleCapex({ baseCost: O.baseCost, baseCapacity: O.baseCapacity, capacity: O.capacityBpd, ...a });
    row(label, r.cost === null ? 'null' : usd(r.cost), r.perBpd === null ? 'null' : usd(r.perBpd));
  }
  out('');
  out('feasibilityEconomics refuses streams that carry a refusal, and a missing rate:');
  const bad = MR.feasibilityStreams({ ...base, crudeCostPerBbl: '' });
  row('streams refused for a blank crude cost', refusal(MR.feasibilityEconomics({ streams: bad, discountRate: 12, taxRate: 30, startYear: F.START_YEAR }).error, 'econ blank'));
  const good = MR.feasibilityStreams(base);
  row('tax rate left out of the call', refusal(MR.feasibilityEconomics({ streams: good, discountRate: 12, startYear: F.START_YEAR }).error, 'econ no tax'));
}

/* ------------------------------------------------------------------ */
section('THE SCALING LAWS AND THE CROSSOVER');
{
  const O = F.OKORDIA;
  out(`OKORDIA's reference point: a vendor quotation of ${usd(O.baseCost)} US dollars for a ${O.baseCapacity} bpd plant. scaleCapex computes cost = reference cost x (capacity / reference capacity) ^ exponent. scaleComparison prints both laws at each size; ratio is the modular cost over the stick-built cost.`);
  out('');
  const rows = MR.scaleComparison({ baseCost: O.baseCost, baseCapacity: O.baseCapacity, capacities: O.capacities });
  head('capacity (bpd)', 'modular cost (0.9)', 'modular per bpd', 'stick-built cost (0.6)', 'stick-built per bpd', 'ratio', 'modular cheaper', 'the two laws equal');
  for (const r of rows) {
    row(r.capacity, usd(r.modularCost), usd(r.modularPerBpd), usd(r.stickBuiltCost), usd(r.stickBuiltPerBpd), frac(r.ratio), String(r.modularCost < r.stickBuiltCost), String(r.modularCost === r.stickBuiltCost));
  }
  out('');
  const lin = MR.scaleCapex({ baseCost: O.baseCost, baseCapacity: O.baseCapacity, capacity: 10000, exponent: 1 });
  out(`The same quotation scaled with an exponent of 1 (cost in proportion to capacity) at 10000 bpd: ${usd(lin.cost)}, ${usd(lin.perBpd)} per bpd.`);
  out('The exponents are named, overridable parameters. scaleCapex defaults to the modular exponent when none is passed:');
  const def = MR.scaleCapex({ baseCost: O.baseCost, baseCapacity: O.baseCapacity, capacity: 20000 });
  out(`scaleCapex at 20000 bpd with no exponent passed: cost ${usd(def.cost)}, exponent ${def.exponent}.`);
}

/* ------------------------------------------------------------------ */
section('THE THREE CONFIGURATIONS AND THE PRODUCT SLATE');
{
  const O = F.OKORDIA;
  const C = RAW.modularRefinery.CONFIGURATIONS;
  head('configuration', 'units', 'lpg', 'naphtha', 'gasoline', 'kerosene', 'diesel', 'fuelOil', 'loss');
  for (const c of Object.values(C)) {
    const y = c.productYields;
    row(c.name, c.units.join(', '), ...['lpg', 'naphtha', 'gasoline', 'kerosene', 'diesel', 'fuelOil', 'loss'].map((k) => (y[k] === undefined ? '-' : frac(y[k]))));
  }
  out('');
  out(`OKORDIA's illustrative product prices, US dollars a barrel: ${Object.entries(O.prices).map(([k, v]) => `${k} ${pbl(v)}`).join(', ')}.`);
  out('productSlate values each product at its yield times its price, per barrel of CRUDE, and carries the loss as a yield with no value:');
  out('');
  for (const c of Object.values(C)) {
    const s = MR.productSlate({ productYields: c.productYields, prices: O.prices });
    out(`${c.name}:`);
    head('product', 'yield fraction', 'price', 'value per barrel of crude');
    for (const r of s.rows) row(r.id, frac(r.yieldFraction), r.pricePerBbl === null ? 'null' : pbl(r.pricePerBbl), r.valuePerBblCrude === null ? 'null' : pbl(r.valuePerBblCrude));
    out(`gross value per barrel of crude ${pbl(s.grossValuePerBbl)}; yields total ${frac(s.yieldTotal)}; yields close ${s.yieldsClose}; unpriced: ${s.unpriced.length ? s.unpriced.join(', ') : 'none'}`);
    out('');
  }
  const blank = MR.productSlate({ productYields: C.topping.productYields, prices: O.pricesNaphthaBlank });
  out(`Topping with the naphtha price left blank: gross value ${pbl(blank.grossValuePerBbl)}; unpriced: ${blank.unpriced.join(', ')}. The unpriced product is named and adds nothing to the value.`);
  const typed = MR.productSlate({ productYields: O.yieldsTyped, prices: O.prices });
  out(`Hydroskimming yields typed as ${Object.entries(O.yieldsTyped).map(([k, v]) => `${k} ${frac(v)}`).join(', ')}: yields total ${frac(typed.yieldTotal)}; yields close ${typed.yieldsClose}; gross value ${pbl(typed.grossValuePerBbl)}. The engine reports the gap and does not normalise the yields.`);
}

/* ------------------------------------------------------------------ */
section('THROUGHPUT, THE GROSS MARGIN AND THE ANNUAL STREAMS');
{
  const O = F.OKORDIA;
  const slate = MR.productSlate({ productYields: RAW.modularRefinery.CONFIGURATIONS[O.configurationId].productYields, prices: O.prices });
  const cap = MR.scaleCapex({ baseCost: O.baseCost, baseCapacity: O.baseCapacity, capacity: O.capacityBpd });
  const firm = scenario('firm');
  const st = streamsFor(O, { scenarioId: 'firm', capex: cap.cost, slate });
  out(`OKORDIA: ${O.configurationId}, ${O.capacityBpd} bpd, ${O.onstreamDays} on-stream days, firm supply (utilisation ${frac(firm.utilisation)}, crude premium ${pbl(firm.crudePremium)}), crude ${pbl(O.crudeCostPerBbl)} a barrel, fixed operating cost ${usd(O.fixedOpexPerYear)} a year, variable operating cost ${pbl(O.variableOpexPerBbl)} a barrel, ${O.constructionYears} construction years, ${O.projectLife} operating years.`);
  out('');
  out(`capital (modular law at the reference point): ${usd(st.capex)}; capital per bpd ${usd(st.capexPerBpd)}`);
  out(`annual throughput = capacity x on-stream days x utilisation: ${bbl(st.annualBbl)} bbl`);
  out(`gross value per barrel of crude ${pbl(slate.grossValuePerBbl)}; gross margin per barrel = gross value - crude cost - variable operating cost: ${pbl(st.grossMarginPerBbl)}`);
  out('The gross margin per barrel leaves the fixed operating cost out; the fixed cost is a yearly figure in the streams.');
  out('');
  head('year', 'producing', 'crude run (bbl)', 'revenue', 'crude cost', 'fixed opex', 'variable opex', 'capex');
  for (const y of st.years.filter((x) => x.year <= 3 || x.year === st.years.length - 1)) {
    row(y.year, String(y.producing), bbl(y.crudeBbl), usd(y.revenue), usd(y.crudeCost), usd(y.fixedOpex), usd(y.variableOpex), usd(y.capex));
  }
  out(`years in the streams: ${st.years.length} (construction years plus operating years)`);
  out('');
  const nameplate = streamsFor(O, { scenarioId: 'firm', capex: cap.cost, slate, utilisation: 1 });
  out(`The same plant at utilisation 1 (nameplate every on-stream day): annual throughput ${bbl(nameplate.annualBbl)} bbl.`);
  const zero = streamsFor(O, { scenarioId: 'firm', capex: cap.cost, slate, constructionYears: 0 });
  out(`With no construction period the capital is spent in year 0, the first operating year: year 0 capex ${usd(zero.years[0].capex)}, year 0 crude run ${bbl(zero.years[0].crudeBbl)} bbl, years in the streams ${zero.years.length}.`);
  const three = streamsFor(O, { scenarioId: 'firm', capex: cap.cost, slate, constructionYears: 3 });
  out(`With three construction years the capital is spread evenly: ${three.years.slice(0, 3).map((y) => usd(y.capex)).join(', ')}.`);
}

/* ------------------------------------------------------------------ */
section('CRUDE SUPPLY SCENARIOS');
{
  const O = F.OKORDIA;
  const slate = MR.productSlate({ productYields: RAW.modularRefinery.CONFIGURATIONS[O.configurationId].productYields, prices: O.prices });
  const cap = MR.scaleCapex({ baseCost: O.baseCost, baseCapacity: O.baseCapacity, capacity: O.capacityBpd });
  out('SUPPLY_SCENARIOS, as the engine exports them. They are named futures and carry no probability:');
  head('id', 'name', 'utilisation', 'crude premium ($/bbl)', 'note');
  for (const s of RAW.modularRefinery.SUPPLY_SCENARIOS) row(s.id, s.name, frac(s.utilisation), pbl(s.crudePremium), q(s.note));
  out('');
  out('OKORDIA under each scenario. The premium is added to the crude cost before the streams are built, and the utilisation replaces the plant\'s:');
  head('scenario', 'crude cost with premium', 'annual throughput (bbl)', 'gross margin per bbl', 'first operating year revenue', 'first operating year crude cost');
  for (const s of RAW.modularRefinery.SUPPLY_SCENARIOS) {
    const st = streamsFor(O, { scenarioId: s.id, capex: cap.cost, slate });
    const y = st.years[O.constructionYears];
    row(s.id, pbl(O.crudeCostPerBbl + s.crudePremium), bbl(st.annualBbl), pbl(st.grossMarginPerBbl), usd(y.revenue), usd(y.crudeCost));
  }
}

/* ------------------------------------------------------------------ */
section('THE LICENSING SEQUENCE');
{
  const O = F.OKORDIA;
  out('LICENSING_STAGES, in order. The app tracks where a project has got to; it is a process aid and the regulator\'s current requirements govern.');
  head('stage', 'id', 'name', 'typical evidence');
  for (const s of RAW.modularRefinery.LICENSING_STAGES) row(s.stage, s.id, s.name, s.typicalEvidence.join('; '));
  out('');
  head('completed ids', 'complete count', 'next stage', 'out of order');
  for (const done of [[], O.licensingDone, O.licensingOutOfOrder, ['lte', 'ltc'], ['lte', 'ltc', 'lto']]) {
    const p = MR.licensingProgress(done);
    row(done.length ? done.join(', ') : '(none)', p.completeCount, p.nextStage ? p.nextStage.name : 'null', String(p.outOfOrder));
  }
}

/* ------------------------------------------------------------------ */
section('THE OKORDIA SCREEN IN ONE TABLE');
{
  const O = F.OKORDIA;
  const cap = MR.scaleCapex({ baseCost: O.baseCost, baseCapacity: O.baseCapacity, capacity: O.capacityBpd });
  out(`OKORDIA at ${O.capacityBpd} bpd, capital ${usd(cap.cost)} (modular law), every configuration under every supply scenario, OKORDIA's prices and costs:`);
  head('configuration', 'scenario', 'gross value per bbl', 'annual throughput (bbl)', 'gross margin per bbl', 'first operating year revenue');
  for (const c of Object.values(RAW.modularRefinery.CONFIGURATIONS)) {
    const slate = MR.productSlate({ productYields: c.productYields, prices: O.prices });
    for (const s of RAW.modularRefinery.SUPPLY_SCENARIOS) {
      const st = streamsFor(O, { scenarioId: s.id, capex: cap.cost, slate });
      row(c.id, s.id, pbl(slate.grossValuePerBbl), bbl(st.annualBbl), pbl(st.grossMarginPerBbl), usd(st.years[O.constructionYears].revenue));
    }
  }
}

/* ------------------------------------------------------------------ */
section('THE ABUA CONFIGURATION, AND BLANK LIMITS AGAINST TYPED ZEROS');
{
  const A = F.ABUA;
  out(`ABUA, ${A.operator}: one month's plan. Yields are volume fractions, and a unit's throughput consumes one barrel of its feed stream for each barrel it runs. A unit with no feed is the crude unit.`);
  out('');
  head('crude', 'cost ($/bbl)', 'available (bbl)', ...A.streams.map((s) => `${s} yield`));
  for (const c of A.crudes) row(c.name, pbl(c.cost), bbl(c.available), ...A.streams.map((s) => (c.yields[s] === undefined ? '-' : frac(c.yields[s]))));
  out('');
  head('unit', 'capacity (bbl)', 'operating cost ($/bbl)', 'feed', 'yields');
  for (const u of A.units) row(u.name, bbl(u.capacity), pbl(u.opex), u.feed || '(none: the crude unit)', Object.entries(u.yields).map(([k, v]) => `${k} ${frac(v)}`).join(', ') || '(the crude yields)');
  out('');
  head('product', 'price ($/bbl)', 'floor (bbl)', 'ceiling (bbl)', 'recipe');
  for (const p of A.products) row(p.name, pbl(p.price), bbl(p.minDemand), bbl(p.maxDemand), Object.entries(p.recipe).map(([k, v]) => `${k} ${frac(v)}`).join(', '));
  out('');
  out('A limit left blank is no limit; a limit typed as 0 is a limit of zero. The diesel hydrotreater three ways:');
  const base = RP.planRefinery(planInput(A));
  const shut = RP.planRefinery(withSet(A, A.variants.find((v) => v.id === 'dht-shut').set));
  const blank = RP.planRefinery(withSet(A, A.variants.find((v) => v.id === 'dht-blank').set));
  head('hydrotreater capacity', 'hydrotreater throughput (bbl)', 'hydrotreater capacity the plan reports', 'crude run (bbl)', 'margin');
  const dht = (p) => p.unitRuns.find((u) => u.id === 'dht');
  row(`${bbl(A.units[2].capacity)} (as typed)`, bbl(dht(base).throughput), dht(base).capacity === Infinity ? 'Infinity' : bbl(dht(base).capacity), bbl(base.totalCrude), usd(base.margin));
  row('0 (typed as shut)', bbl(dht(shut).throughput), bbl(dht(shut).capacity), bbl(shut.totalCrude), usd(shut.margin));
  if (dht(blank).capacity !== Infinity) throw new Error('a blank capacity is expected to be reported as no limit');
  row('blank', bbl(dht(blank).throughput), 'no limit', bbl(blank.totalCrude), usd(blank.margin));
  out(`The plan reports the capacity of a unit left blank as the number ${String(dht(blank).capacity)}, which is what "no limit" means to the solver.`);
  out(`utilisation the plan reports for a unit with a blank capacity: ${dht(blank).utilisation}; for a unit typed as 0: ${dht(shut).utilisation}. A utilisation needs a finite capacity above zero.`);
}

/* ------------------------------------------------------------------ */
section('REFUSALS, INFEASIBLE AND UNBOUNDED PLANS');
{
  const A = F.ABUA;
  out('planRefinery refuses an input it cannot trust and names it. A plan with no answer says so in its status. Each row changes the ABUA configuration as described:');
  out('');
  head('change', 'status', 'what the engine returns');
  for (const r of A.refusals) {
    const input = r.blankAllLimits ? blankAllLimits(A) : withSet(A, r.set);
    const p = RP.planRefinery(input);
    if (p.status === 'optimal') throw new Error(`${r.id} was expected to fail and solved`);
    row(r.label, p.status, refusal(p.error, r.id));
  }
  row('no crude at all', RP.planRefinery({ ...planInput(A), crudes: [] }).status, refusal(RP.planRefinery({ ...planInput(A), crudes: [] }).error, 'no crude'));
  row('no product at all', RP.planRefinery({ ...planInput(A), products: [] }).status, refusal(RP.planRefinery({ ...planInput(A), products: [] }).error, 'no product'));
  const miss = RP.planRefinery(withSet(A, A.refusals.find((r) => r.id === 'blank-opex-price').set));
  out(`The missing list the engine returns with the blank reformer operating cost and jet price: ${miss.missing.join('; ')}.`);
}

/* ------------------------------------------------------------------ */
section('THE CRUDE UNIT CARRIES EVERY BARREL');
{
  const A = F.ABUA;
  const p = RP.planRefinery(planInput(A));
  out('Every barrel of crude runs through the feedless unit, by an equality row: crude run = crude unit throughput. ABUA\'s plan:');
  out('');
  head('crude', 'volume (bbl)', 'available (bbl)', 'cost');
  p.crudeRuns.forEach((c, i) => row(c.name, bbl(c.volume), bbl(A.crudes[i].available), usd(c.cost)));
  out('');
  head('unit', 'crude unit', 'throughput (bbl)', 'capacity (bbl)', 'utilisation (percent)', 'operating cost');
  for (const u of p.unitRuns) row(u.name, String(u.crudeUnit), bbl(u.throughput), bbl(u.capacity), pct(u.utilisation), usd(u.cost));
  out('');
  const cdu = p.unitRuns.find((u) => u.crudeUnit);
  out(`total crude ${bbl(p.totalCrude)} bbl; crude unit throughput ${bbl(cdu.throughput)} bbl; the two agree to the barrel: ${Math.abs(p.totalCrude - cdu.throughput) < 1e-6}`);
  out(`crude unit operating cost for the month: ${usd(cdu.cost)} (${pbl(A.units[0].opex)} a barrel on every barrel of crude)`);
  out('');
  const noFeedless = RP.planRefinery({ ...planInput(A), units: A.units.map((u) => (u.feed ? u : { ...u, feed: 'crude_feed' })) });
  const cd2 = noFeedless.unitRuns.find((u) => u.id === 'cdu');
  out('The row is written only when some unit has no feed. The same configuration with the crude unit given a feed stream that no crude makes, so no unit is feedless:');
  out(`crude unit throughput ${bbl(cd2.throughput)} bbl beside a crude run of ${bbl(noFeedless.totalCrude)} bbl; crude unit operating cost ${usd(cd2.cost)}; margin ${usd(noFeedless.margin)} against ${usd(p.margin)} for the configuration as typed.`);
  out('A configuration whose crude unit is not feedless has no crude unit in the plan, and its capacity and operating cost bind nothing.');
}

/* ------------------------------------------------------------------ */
section('READING THE PLAN');
{
  const A = F.ABUA;
  const p = RP.planRefinery(planInput(A));
  out('margin = product revenue - crude cost - unit operating cost. gross margin per barrel = margin / total crude.');
  out(`revenue ${usd(p.revenue)}; crude cost ${usd(p.crudeCost)}; unit operating cost ${usd(p.unitCost)}; margin ${usd(p.margin)}; total crude ${bbl(p.totalCrude)} bbl; gross margin per barrel of crude ${pbl(p.grossMarginPerBbl)}`);
  out('');
  head('product', 'volume (bbl)', 'ceiling (bbl)', 'at its ceiling', 'revenue');
  p.productMakes.forEach((m, i) => row(m.name, bbl(m.volume), bbl(A.products[i].maxDemand), String(Math.abs(m.volume - A.products[i].maxDemand) < 1e-6), usd(m.revenue)));
  out('');
  out('The stream balance: made - consumed by units - placed in products = surplus, never below zero. Surplus is the stream nobody found a home for.');
  head('stream', 'made (bbl)', 'consumed (bbl)', 'placed (bbl)', 'surplus (bbl)');
  for (const s of p.streamBalance) row(s.id, bbl(s.made), bbl(s.consumed), bbl(s.placed), bbl(s.surplus));
  out('');
  const atCap = p.unitRuns.filter((u) => u.utilisation !== null && Math.abs(u.utilisation - 1) < 1e-9).map((u) => u.name);
  const atAvail = p.crudeRuns.filter((c, i) => Math.abs(c.volume - A.crudes[i].available) < 1e-6).map((c) => c.name);
  out(`units at capacity: ${atCap.join(', ') || 'none'}`);
  out(`crudes at their availability: ${atAvail.join(', ') || 'none'}`);
}

/* ------------------------------------------------------------------ */
section('THE ABUA PLAN UNDER FIVE CHANGES');
{
  const A = F.ABUA;
  const base = RP.planRefinery(planInput(A));
  head('change', 'status', 'total crude (bbl)', 'crude unit utilisation (percent)', 'margin', 'gross margin per bbl', 'margin change from the plan as typed');
  const put = (label, p) => {
    if (p.status !== 'optimal') { row(label, p.status, '-', '-', '-', '-', '-'); return; }
    const cdu = p.unitRuns.find((u) => u.crudeUnit);
    row(label, p.status, bbl(p.totalCrude), pct(cdu.utilisation), usd(p.margin), pbl(p.grossMarginPerBbl), usd(p.margin - base.margin));
  };
  put('the plan as typed', base);
  for (const v of A.variants) put(v.label, RP.planRefinery(withSet(A, v.set)));
}

/* ------------------------------------------------------------------ */
section('WHAT ANOTHER BARREL OF EACH STREAM IS WORTH');
{
  const A = F.ABUA;
  const p = RP.planRefinery(planInput(A));
  out('marginalValue is the plan\'s value of one more barrel of a stream arriving from outside, in US dollars a barrel: the negated dual of the stream\'s balance row. The crude course teaches what a dual is; this course reads the stream values the plan prints.');
  out('');
  const placedIn = (s) => A.products.filter((pr) => pr.recipe[s]).map((pr) => `${pr.name} ${pbl(pr.price)}`).join('; ') || '(no product)';
  const feeds = (s) => A.units.filter((u) => u.feed === s).map((u) => u.name).join(', ') || '(no unit)';
  head('stream', 'marginal value ($/bbl)', 'surplus (bbl)', 'products it goes into, at their prices', 'unit it feeds');
  for (const s of p.streamBalance) row(s.id, pbl(s.marginalValue), bbl(s.surplus), placedIn(s.id), feeds(s.id));
  out('');
  out('The stream values under each change:');
  head('change', ...A.streams);
  const mv = (x) => A.streams.map((s) => (x.status === 'optimal' ? pbl(x.streamBalance.find((b) => b.id === s).marginalValue) : '-'));
  row('the plan as typed', ...mv(p));
  for (const v of A.variants) row(v.label, ...mv(RP.planRefinery(withSet(A, v.set))));
  out('');
  out('Pricing a debottleneck: the reformer capacity stepped, everything else as typed. The margin gained per extra barrel of capacity is the change in margin divided by the change in capacity, both printed:');
  head('reformer capacity (bbl)', 'reformer utilisation (percent)', 'margin', 'change in margin', 'change in capacity (bbl)', 'margin gained per extra barrel of capacity');
  let prev = null;
  for (const cap of A.reformerSweep) {
    const x = RP.planRefinery(withSet(A, [['units', 'reformer', 'capacity', cap]]));
    const ref = x.unitRuns.find((u) => u.id === 'reformer');
    if (prev) row(bbl(cap), pct(ref.utilisation), usd(x.margin), usd(x.margin - prev.margin), bbl(cap - prev.cap), pbl((x.margin - prev.margin) / (cap - prev.cap)));
    else row(bbl(cap), pct(ref.utilisation), usd(x.margin), '-', '-', '-');
    prev = { cap, margin: x.margin };
  }
}

/* ------------------------------------------------------------------ */
section('THE SCHEDULE');
{
  const A = F.ABUA;
  const p = RP.planRefinery(planInput(A));
  const sch = RP.cascadeToSchedule({ plan: p, periodStart: PERIOD, periodDays: F.PERIOD_DAYS, cargoSize: A.cargoSize });
  out(`ABUA's plan cascaded from period start ${F.PERIOD_START}, ${F.PERIOD_DAYS} days, cargo size ${bbl(A.cargoSize)} bbl. Crude arrives in whole cargoes evenly spaced; each unit runs and each product lifts in equal weekly events.`);
  out(`the engine's note: ${q(sch.note)}`);
  out('');
  const count = (t) => sch.events.filter((e) => e.type === t).length;
  out(`events: ${sch.events.length} in all; crude receipts ${count('receipt')}, unit runs ${count('unit_run')}, product lifts ${count('delivery')}; weeks in the period ${sch.events.find((e) => e.type === 'unit_run').meta.of}`);
  out('');
  head('id', 'date', 'type', 'material', 'quantity (bbl)', 'value', 'part');
  for (const e of sch.events) row(e.id, e.date, e.type, e.materialId, bbl(e.quantity), usd(e.cost), `${e.meta.cargo ?? e.meta.week} of ${e.meta.of}`);
  out('');
  out('The plan-ledger totals the schedule carries, material by material, agree with the plan:');
  head('material', 'type', 'scheduled quantity (bbl)', 'plan quantity (bbl)', 'scheduled value', 'plan value');
  const planQ = (id) => {
    const c = p.crudeRuns.find((x) => x.id === id); if (c) return [c.volume, c.cost];
    const u = p.unitRuns.find((x) => x.id === id); if (u) return [u.throughput, u.cost];
    const m = p.productMakes.find((x) => x.id === id); return [m.volume, m.revenue];
  };
  const seen = new Map();
  for (const e of sch.events) {
    const k = `${e.materialId}|${e.type}`;
    const r = seen.get(k) || { m: e.materialId, t: e.type, q: 0, c: 0 };
    r.q += e.quantity; r.c += e.cost; seen.set(k, r);
  }
  for (const r of seen.values()) { const [pq, pc] = planQ(r.m); row(r.m, r.t, bbl(r.q), bbl(pq), usd(r.c), usd(pc)); }
  out('');
  const small = RP.cascadeToSchedule({ plan: p, periodStart: PERIOD, periodDays: F.PERIOD_DAYS, cargoSize: 150000 });
  out(`The same plan with a cargo size of 150000 bbl: crude receipts ${small.events.filter((e) => e.type === 'receipt').length}; receipt dates for Forcados: ${small.events.filter((e) => e.type === 'receipt' && e.materialId === 'forcados').map((e) => e.date).join(', ')}.`);
  const none = RP.cascadeToSchedule({ plan: RP.planRefinery(withSet(A, A.refusals.find((r) => r.id === 'infeasible').set)), periodStart: PERIOD, periodDays: F.PERIOD_DAYS, cargoSize: A.cargoSize });
  out(`An infeasible plan cascades to ${none.events.length} events, with the note ${q(none.note)}`);
}

/* ------------------------------------------------------------------ */
section('THE SCHEDULE IN SEVEN TIME ZONES');
{
  // Each zone runs in its own node process started with TZ set, because a TZ
  // set inside a running process does not reach its Date. Every process calls
  // the engine with the period start as given; the rows print what it dated.
  const eng = `${ROOT}/engines/downstream/refineryPlanning.js`;
  const script = (startExpr) => `
    import { planRefinery, cascadeToSchedule } from ${JSON.stringify(eng)};
    const A = ${JSON.stringify(planInput(F.ABUA))};
    const { events } = cascadeToSchedule({ plan: planRefinery(A), periodStart: ${startExpr}, periodDays: ${F.PERIOD_DAYS}, cargoSize: ${F.ABUA.cargoSize} });
    console.log(JSON.stringify(events.map((e) => e.date)));`;
  const run = (tz, startExpr) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script(startExpr)], { env: { ...process.env, TZ: tz }, encoding: 'utf8' }));
  const zones = ['UTC', 'Africa/Lagos', 'Pacific/Kiritimati', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Pacific/Pago_Pago'];
  const ref = run('UTC', JSON.stringify(F.PERIOD_START));
  out(`ABUA's schedule built in seven time zones, each in its own process, with the period start passed as the string ${q(F.PERIOD_START)}. The first and last event dates, and whether every one of the ${ref.length} dates matches the UTC run:`);
  head('time zone', 'first date', 'last date', 'every date matches UTC');
  for (const z of zones) {
    const d = run(z, JSON.stringify(F.PERIOD_START));
    row(z, d[0], [...d].sort().at(-1), String(JSON.stringify(d) === JSON.stringify(ref)));
  }
  out('');
  out('The same schedule with the period start handed over as a Date built at LOCAL midnight (new Date(2027, 2, 1)). The engine reads a Date\'s UTC calendar day, so the answer depends on the zone:');
  head('time zone', 'first date', 'every date matches UTC');
  for (const z of ['UTC', 'Africa/Lagos', 'Pacific/Kiritimati', 'America/New_York', 'Pacific/Pago_Pago']) {
    const d = run(z, 'new Date(2027, 2, 1)');
    row(z, d[0], String(JSON.stringify(d) === JSON.stringify(ref)));
  }
  out('A period start given as a YYYY-MM-DD string is the same calendar day in every zone. That is how the Suite page passes it and how this digest passes it.');
}

/* ------------------------------------------------------------------ */
section('THE ABUA PLAN AND SCHEDULE END TO END');
{
  const A = F.ABUA;
  const p = RP.planRefinery(planInput(A));
  const sch = RP.cascadeToSchedule({ plan: p, periodStart: PERIOD, periodDays: F.PERIOD_DAYS, cargoSize: A.cargoSize });
  const cdu = p.unitRuns.find((u) => u.crudeUnit);
  head('reading', 'value');
  row('total crude (bbl)', bbl(p.totalCrude));
  row('crude unit utilisation (percent)', pct(cdu.utilisation));
  row('revenue', usd(p.revenue));
  row('crude cost', usd(p.crudeCost));
  row('unit operating cost', usd(p.unitCost));
  row('margin', usd(p.margin));
  row('gross margin per barrel of crude', pbl(p.grossMarginPerBbl));
  for (const s of p.streamBalance) row(`marginal value of ${s.id} ($/bbl)`, pbl(s.marginalValue));
  row('schedule events', sch.events.length);
  row('crude receipts', sch.events.filter((e) => e.type === 'receipt').length);
  row('first receipt date', sch.events[0].date);
}

/* ------------------------------------------------------------------ */
section('ONE SHAPE, THREE LEDGERS');
{
  out('A plan event, a scheduled event and a recorded actual are the same shape, marked by their ledger. makeEvent takes a quantity that is never negative: direction comes from the event type.');
  out('');
  head('event type', 'signedQuantity of 100 bbl', 'emits by its nature');
  for (const t of Object.values(RAW.streamModel.EVENT_TYPE)) {
    const e = SM.makeEvent({ id: 'x', ledger: 'actual', type: t, materialId: 'm', quantity: 100 });
    row(t, SM.signedQuantity(e), String(RAW.streamModel.EMITTING_TYPES.has(t)));
  }
  out('');
  out('What makeEvent refuses, each its own message:');
  head('event', 'what the engine returns');
  for (const [label, args] of [
    ['a quantity of -500', { id: 'a', ledger: 'actual', type: 'receipt', materialId: 'escravos', quantity: -500 }],
    ['a ledger called forecast', { id: 'b', ledger: 'forecast', type: 'receipt', materialId: 'escravos', quantity: 500 }],
    ['an event type called sale', { id: 'c', ledger: 'actual', type: 'sale', materialId: 'diesel', quantity: 500 }],
  ]) {
    let msg = null;
    try { SM.makeEvent(args); } catch (e) { msg = e.message; }
    row(label, refusal(msg, label));
  }
  const nc = SM.makeEvent({ id: 'd', ledger: 'actual', type: 'receipt', materialId: 'escravos', quantity: 500 });
  out(`An event recorded with no cost carries cost ${nc.cost === null ? 'null' : nc.cost}, which is different from a cost of 0; the variance marks a line with an uncosted event as costed false.`);
}

/* ------------------------------------------------------------------ */
section('THE ODIOMA PLAN AS A PLAN LEDGER');
{
  const O = F.ODIOMA;
  const p = RP.planRefinery(planInput(O));
  const sch = RP.cascadeToSchedule({ plan: p, periodStart: PERIOD, periodDays: F.PERIOD_DAYS, cargoSize: O.cargoSize });
  out(`ODIOMA, ${O.operator}: two crudes, a crude unit and a reformer, four products. The plan, cascaded from ${F.PERIOD_START} over ${F.PERIOD_DAYS} days with a cargo size of ${bbl(O.cargoSize)} bbl, is the plan ledger the actuals are read against.`);
  out('');
  head('crude', 'cost ($/bbl)', 'available (bbl)', ...O.streams.map((s) => `${s} yield`));
  for (const c of O.crudes) row(c.name, pbl(c.cost), bbl(c.available), ...O.streams.map((s) => (c.yields[s] === undefined ? '-' : frac(c.yields[s]))));
  head('unit', 'capacity (bbl)', 'operating cost ($/bbl)', 'feed');
  for (const u of O.units) row(u.name, bbl(u.capacity), pbl(u.opex), u.feed || '(none: the crude unit)');
  head('product', 'price ($/bbl)', 'ceiling (bbl)');
  for (const pr of O.products) row(pr.name, pbl(pr.price), bbl(pr.maxDemand));
  out('');
  out(`plan: total crude ${bbl(p.totalCrude)} bbl; margin ${usd(p.margin)}; gross margin per barrel ${pbl(p.grossMarginPerBbl)}`);
  out('');
  out('The plan ledger, summed from the scheduled events by material and type (the grain the variance matches on):');
  head('material', 'type', 'events', 'quantity (bbl)', 'value', 'value per bbl');
  const agg = new Map();
  for (const e of sch.events) {
    const k = `${e.materialId}|${e.type}`;
    const r = agg.get(k) || { m: e.materialId, t: e.type, n: 0, q: 0, c: 0 };
    r.n += 1; r.q += e.quantity; r.c += e.cost; agg.set(k, r);
  }
  for (const r of agg.values()) row(r.m, r.t, r.n, bbl(r.q), usd(r.c), pbl(r.c / r.q));
}

/* ------------------------------------------------------------------ */
const odioma = (() => {
  const O = F.ODIOMA;
  const p = RP.planRefinery(planInput(O));
  const sch = RP.cascadeToSchedule({ plan: p, periodStart: PERIOD, periodDays: F.PERIOD_DAYS, cargoSize: O.cargoSize });
  const actual = O.actuals.map((a, i) => ev('actual', a, i));
  const rec = RP.reconcilePeriod({ planEvents: sch.events, actualEvents: actual, plan: p });
  return { p, sch, actual, rec };
})();

section('THE ODIOMA ACTUALS AND THE VARIANCE LINES');
{
  const O = F.ODIOMA;
  const { rec } = odioma;
  out('What the month did, one aggregated movement a material and type. A delivery\'s value is what it sold for; every other event\'s value is what it cost.');
  head('material', 'type', 'quantity (bbl)', 'value');
  for (const a of O.actuals) row(a.materialId, a.type, bbl(a.quantity), usd(a.cost));
  out('');
  out('attributeVariance matches the two ledgers on material and type. volume variance = (actual quantity - plan quantity) x plan unit value; price variance = (actual unit value - plan unit value) x actual quantity; unexplained = total - volume - price, which is zero unless money moved with no barrels. marginEffect is the total with its sign set by what it did to margin: as it is on a revenue line, reversed on a cost line.');
  out('');
  head('material', 'type', 'direction', 'plan quantity', 'actual quantity', 'plan value', 'actual value', 'volume variance', 'price variance', 'unexplained', 'total variance', 'margin effect', 'costed');
  for (const l of rec.lines) {
    row(l.materialId, l.type, l.direction, bbl(l.planQuantity), bbl(l.actualQuantity), usd(l.planCost), usd(l.actualCost), usd(l.volumeVariance), usd(l.priceVariance), usd(l.unexplained), usd(l.totalVariance), usd(l.marginEffect), String(l.costed));
  }
  out('');
  out('Movements in one ledger and not the other are listed as unmatched and folded into no variance line:');
  head('material', 'type', 'present in', 'quantity (bbl)', 'value');
  for (const u of rec.unmatched) row(u.materialId, u.type, u.presentIn, bbl(u.quantity), usd(u.cost));
  const fz = rec.lines.find((l) => l.materialId === 'forcados');
  out('');
  out(`The Forcados line: no barrels arrived and a bill of ${usd(fz.actualCost)} did. Its volume variance is ${usd(fz.volumeVariance)}, its price variance ${usd(fz.priceVariance)}, and the unexplained ${usd(fz.unexplained)} is the money with no barrels, shown on its own.`);
}

/* ------------------------------------------------------------------ */
section('TOTALS ON MARGIN, AND THE UNITS AGAINST PLAN');
{
  const { rec, p } = odioma;
  const t = rec.total;
  out(`The headline total is on margin: ${q(t.basis)}.`);
  head('total', 'volume variance', 'price variance', 'unexplained', 'total variance');
  row('on margin (the headline)', usd(t.volumeVariance), usd(t.priceVariance), usd(t.unexplained), usd(t.totalVariance));
  row('cost lines, as recorded', usd(t.cost.volumeVariance), usd(t.cost.priceVariance), usd(t.cost.unexplained), usd(t.cost.totalVariance));
  row('revenue lines, as recorded', usd(t.revenue.volumeVariance), usd(t.revenue.priceVariance), usd(t.revenue.unexplained), usd(t.revenue.totalVariance));
  out('');
  const raw = rec.lines.reduce((s, l) => s + l.totalVariance, 0);
  out(`Adding every line's total variance as recorded, cost and revenue together, gives ${usd(raw)}; the margin total is ${usd(t.totalVariance)}. The engine prints the margin total as the headline.`);
  out('');
  out('reconcilePeriod reads the margin of each ledger: deliveries less everything else that carries a value.');
  out(`plan margin ${usd(rec.planMargin)}; actual margin ${usd(rec.actualMargin)}; margin variance ${usd(rec.marginVariance)}; the plan's own margin ${usd(p.margin)}; plan gross margin per barrel ${pbl(rec.planGrossMarginPerBbl)}`);
  const un = rec.unmatched.reduce((s, u) => s + (u.type === 'delivery' ? u.cost : -u.cost), 0);
  out(`margin variance - margin total of the matched lines = ${usd(rec.marginVariance - t.totalVariance)}; the unmatched movements, deliveries counted as revenue and the rest as cost, come to ${usd(un)}. The ledger margins count every movement; the variance lines count only the matched ones.`);
  out('');
  out('Each unit against plan. The app reports the gap and does not say why it happened:');
  head('unit', 'planned (bbl)', 'actual (bbl)', 'difference (bbl)', 'utilisation of plan (percent)');
  for (const u of rec.unitPerformance) row(u.unitId, bbl(u.planned), bbl(u.actual), bbl(u.difference), pct(u.utilisationOfPlan));
}

/* ------------------------------------------------------------------ */
section('THE EXPANSION: STREAMS INTO THE SCREENING ENGINE');
const expansion = (() => {
  const X = F.ODIOMA.expansion;
  const slate = MR.productSlate({ productYields: RAW.modularRefinery.CONFIGURATIONS[X.configurationId].productYields, prices: X.prices });
  const cap = MR.scaleCapex({ baseCost: X.baseCost, baseCapacity: X.baseCapacity, capacity: X.capacityBpd, exponent: X.modularExponent });
  const st = streamsFor(X, { scenarioId: X.scenarioId, capex: cap.cost, slate });
  const econ = MR.feasibilityEconomics({ streams: st, discountRate: X.discountRate, taxRate: X.taxRate, startYear: F.START_YEAR });
  return { X, slate, cap, st, econ };
})();
{
  const { X, slate, cap, st, econ } = expansion;
  out(`ODIOMA's expansion: a ${X.configurationId} plant of ${X.capacityBpd} bpd, ${X.onstreamDays} on-stream days, ${X.scenarioId} supply, crude ${pbl(X.crudeCostPerBbl)} a barrel, capital by the modular law from ${usd(X.baseCost)} at ${X.baseCapacity} bpd, fixed operating cost ${usd(X.fixedOpexPerYear)} a year, variable ${pbl(X.variableOpexPerBbl)} a barrel, ${X.constructionYears} construction years, ${X.projectLife} operating years, discount rate ${X.discountRate} percent, tax rate ${X.taxRate} percent.`);
  out(`capital ${usd(cap.cost)}; gross value per barrel of crude ${pbl(slate.grossValuePerBbl)}; annual throughput ${bbl(st.annualBbl)} bbl; gross margin per barrel ${pbl(st.grossMarginPerBbl)}`);
  out('');
  out('What feasibilityEconomics hands the screening engine, in the engine\'s units (money in millions of US dollars):');
  const i = econ.inputs;
  out(`fiscalType ${i.fiscalType}; royaltyRate ${i.royaltyRate}; taxRate ${i.taxRate}; discountRate ${i.discountRate}; lossCarryForward ${i.lossCarryForward}; projectLife ${i.projectLife} years; startYear ${i.startYear}`);
  out(`production (oil, bbl) in year 0 and in the first operating year: ${bbl(i.production.oil[0])}, ${bbl(i.production.oil[X.constructionYears])}; price (the slate's gross value) in the first operating year ${pbl(i.price.oil[X.constructionYears])}`);
  out(`opexFixed in the first operating year (fixed operating cost plus crude cost, millions) ${mmd(i.opexFixed[X.constructionYears])}; opexVariable ${mmd(i.opexVariable[X.constructionYears])}; capex in year 0 ${mmd(i.capex[0])}`);
  out('Revenue goes in as revenue (barrels at the slate\'s value), and the royalty rate is 0 because a refinery buys its crude and pays no royalty.');
  out('');
  head('year', 'calendar year', 'gross revenue (MM)', 'royalty (MM)', 'opex (MM)', 'capex (MM)', 'tax (MM)', 'tax loss carried forward (MM)', 'net cash flow (MM)');
  for (const c of econ.cashflow) row(econ.cashflow.indexOf(c), c.year, mmd(c.grossRevenue), mmd(c.royalty), mmd(c.opex), mmd(c.capex), mmd(c.tax), mmd(c.taxLossCarriedForward), mmd(c.ncf));
  out('');
  out(`NPV at ${X.discountRate} percent, mid-year discounting (a flow in year t is discounted at t + 0.5): ${mmd(econ.metrics.npv)} million US dollars. The Economics courses teach and grade the NPV; this course reads it as the feasibility screen's answer.`);
  const shifted = MR.feasibilityEconomics({ streams: st, discountRate: X.discountRate, taxRate: X.taxRate, startYear: F.START_YEAR_CHECK });
  const tax = (e) => e.cashflow.reduce((s, c) => s + c.tax, 0);
  out(`The start year labels the years and moves no figure: with start year ${F.START_YEAR_CHECK} the first calendar year reads ${shifted.cashflow[0].year}, the NPV reads ${mmd(shifted.metrics.npv)} and the total tax ${mmd(tax(shifted))}, against ${econ.cashflow[0].year}, ${mmd(econ.metrics.npv)} and ${mmd(tax(econ))} with start year ${F.START_YEAR}. The two agree to the last digit: ${shifted.metrics.npv === econ.metrics.npv && tax(shifted) === tax(econ)}.`);
}

/* ------------------------------------------------------------------ */
section('TAX LOSSES CARRIED FORWARD');
{
  const { X, econ } = expansion;
  const off = SC.calculateEconomics({ ...econ.inputs, lossCarryForward: false, startYear: F.START_YEAR });
  out('The capital is expensed in the years it is spent, before the plant earns, so the construction years make a tax loss. feasibilityEconomics switches on the screening engine\'s lossCarryForward option: the loss is carried forward and shelters the first operating years. The same inputs with the option off, through calculateEconomics directly:');
  out('');
  head('year', 'taxable income before relief (MM)', 'tax, loss carried forward (MM)', 'loss carried forward at year end (MM)', 'tax, option off (MM)');
  econ.cashflow.forEach((c, k) => {
    const taxable = c.grossRevenue - c.royalty - c.opex - c.abex - c.depreciation;
    row(k, mmd(taxable), mmd(c.tax), mmd(c.taxLossCarriedForward), mmd(off.cashflow[k].tax));
  });
  out('');
  const firstTax = econ.cashflow.findIndex((c) => c.tax > 0);
  const totOn = econ.cashflow.reduce((s, c) => s + c.tax, 0);
  const totOff = off.cashflow.reduce((s, c) => s + c.tax, 0);
  out(`first year with tax to pay, loss carried forward: year ${firstTax}, tax ${mmd(econ.cashflow[firstTax].tax)} MM`);
  out(`total tax over the life: ${mmd(totOn)} MM with the loss carried forward; ${mmd(totOff)} MM with the option off; the difference ${mmd(totOff - totOn)} MM`);
  out(`NPV at ${X.discountRate} percent: ${mmd(econ.metrics.npv)} MM with the loss carried forward; ${mmd(off.metrics.npv)} MM with the option off`);
  out('feasibilityEconomics passes no capexDepreciationYears, so the screening engine deducts the capital in the year it is spent (its depreciation column equals the capex column in every year): ' + String(econ.cashflow.every((c) => Math.abs(c.depreciation - c.capex) < 1e-12)) + '.');
}

/* ------------------------------------------------------------------ */
section('HELD, DECIDED, AND WHAT THE ORACLES CHECK');
{
  out('Owner decisions in force (FINDINGS-refinery.md, 2026-09-19):');
  out('- Loss carry-forward is an option of the screening engine, off by default for every other caller; the refinery switches it on.');
  out('- No royalty on a refinery: feasibilityEconomics passes a royalty rate of 0.');
  out('- A feedless unit is the crude unit and carries every barrel of crude; a plan with no feedless unit writes no crude-unit row.');
  out('');
  out('HELD, taught as stated limits and never graded:');
  out(`- H1. The scaling exponents ${RAW.modularRefinery.SCALING_EXPONENT.STICK_BUILT} and ${RAW.modularRefinery.SCALING_EXPONENT.MODULAR} are defaults for a vendor's own figures to replace. No published source for them is in the engines repository.`);
  out('- H2. The screening engine depreciates capital in the year it is spent and offers no capital allowance schedule starting at commissioning. Carrying the loss forward covers the refinery case; a fuller allowance model belongs to the Economics module.');
  out('');
  out('Limits the engines state themselves: yields are fixed vectors; quality is not carried through the plan; one period at a time with no inventory between periods; the schedule models no tank capacity, jetty window or turnaround.');
  out('');
  const Gd = `${ROOT}/test-data/downstream/goldens`;
  const rp = JSON.parse(fs.readFileSync(`${Gd}/refineryplanning_cases.json`, 'utf8'));
  const mr = JSON.parse(fs.readFileSync(`${Gd}/modularrefinery_cases.json`, 'utf8'));
  head('golden file', 'cases', 'written by', 'method');
  row('refineryplanning_cases.json', `${rp.cases.length} plans, ${rp.variance.lines.length} variance lines, 1 schedule`, rp.provenance.oracle, rp.provenance.method);
  row('modularrefinery_cases.json', `${mr.cases.length} feasibility cases, ${mr.scale.length} scale points`, mr.provenance.oracle, mr.provenance.method);
  out('');
  out('The plan oracle solves each plan in exact rational arithmetic and accepts it only with a duality certificate; it values a stream by re-solving with a small extra supply of it. The feasibility oracle keeps annual accounts and a dated tax-loss ledger used oldest first. Neither oracle checks a refusal\'s wording, so every refusal sentence in this digest is the engine\'s own and is quoted.');
}

/* ------------------------------------------------------------------ */
if (sectionNo !== Object.keys(SECTION_OWNERS).length) {
  throw new Error(`SECTION OWNERS: ${Object.keys(SECTION_OWNERS).length} owner rows for ${sectionNo} sections`);
}
const text = `${L.join('\n')}\n`;
if (/NaN|undefined|Invalid Date|\[object Object\]/.test(text)) {
  const bad = L.filter((l) => /NaN|undefined|Invalid Date|\[object Object\]/.test(l)).slice(0, 5);
  throw new Error(`NON-VALUE PRINTED: ${bad.join(' || ')}`);
}
process.stdout.write(text);
process.stderr.write(`clock gate: ${[...CALLS.values()].reduce((a, b) => a + b, 0)} gated calls to ${CALLS.size} of ${CLOCK.size} clock-reading exports, every one passed the fixed period start or start year\n`);
process.stderr.write(`refusals: ${refusedCount}, every label asserted against the engine\n`);
process.stderr.write(`sections: ${sectionNo}, lines: ${L.length}\n`);
