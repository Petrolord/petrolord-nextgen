// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of fiscal_cases.json (plus
// sweeps and probes around those published inputs, and the TEACHING FIELD
// this wave designed for itself, ODIDI). THE EC2 CAPSTONE RUNS DIFFERENT
// CONDITIONS ENTIRELY: nothing here imports, reads or reproduces
// ec2_fields.mjs, fields.json, or any capstone field name, volume, price,
// cost, rate or year. The teaching digest and the capstone are two files
// with opposite audiences and they never share a number.
//
// Usage:  sh /root/ec-wip-fiscal/build_digest.sh > /root/ec-wip-fiscal/digest.txt
//
// Engine:  packages/engines/engines/economics/fiscalRegime.js and
//          fiscalTemplates.js (plain JavaScript, imported directly)
// Golden:  packages/engines/test-data/economics/goldens/fiscal_cases.json
// Oracle findings restated here: tools/validation/economics/FINDINGS-fiscal.md
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "oracle" (copied from the golden's disagreement record and printed
// beside the engine's own value) or "derived" (a ratio or difference of two
// engine values printed on the SAME row). Nothing else is computed here.

import fs from 'fs';
import { register } from 'node:module';
// fiscalRegime.js imports engines/economics/cashflow.ts (engines 3.12.0): plain
// node 18 needs the TypeScript hook before the engine is imported.
register('./ts_loader.mjs', import.meta.url);

const ROOT = process.env.EC2_ENGINES || '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const E = await import(`${ROOT}/engines/economics/fiscalRegime.js`);
const { fiscalTemplates } = await import(`${ROOT}/engines/economics/fiscalTemplates.js`);
const IRRK = await import(`${ROOT}/engines/economics/irrContract.js`);
const G = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/fiscal_cases.json`, 'utf8'));

const out = [];
const w = (s = '') => out.push(s);
const f = (x, n = 2) => (x === null || x === undefined || Number.isNaN(Number(x))) ? 'null' : Number(x).toFixed(n);
const m = (x) => f(x, 4);          // money, $MM
const r = (x) => f(x, 6);          // ratios and rates
const p = (x) => f(x, 4);          // percent
const clone = (o) => JSON.parse(JSON.stringify(o));
// EC2-5: calculateIRR returns null with a status instead of 0 or its bracket.
// A rate prints to four decimals; a null prints with the status that says why,
// and multiple-roots lists the in-band roots the engine found.
const irrOf = (res) => (res.irr !== null && res.irr !== undefined
  ? p(res.irr)
  : `null (${res.irrStatus}${Array.isArray(res.irrRoots) && res.irrRoots.length ? `; roots ${res.irrRoots.map(p).join(', ')}` : ''}${res.irrRootAboveBand ? '; another root above the band' : ''})`);
const irrRows = (rows) => irrOf(E.calculateIRRResult(rows));
// The Suite assigns a template's id by slugging its name; the goldens use the
// same rule, one underscore per non-alphanumeric character, trailing ones
// stripped ("USA - Gulf of Mexico" -> "usa___gulf_of_mexico").
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');

// COURSE LABELS IN THREE GOLDEN NOTES. The golden's notes on rfactor_tranche_crossing,
// tiers_unsorted_selected_by_threshold and sliding_royalty_price_deck_crossing name
// their regimes "the Nigeria PIA tranches" and "the Designer's default PIA sliding
// royalty". Neither regime is the Act: the first is this course's tiered teaching
// regime value for value, the second is the Designer's sample PSC regime. The notes
// print with those two labels relabelled and every number untouched; the golden's
// own wording is listed for a separate engines rename (RECUT-fiscal-DONE.md, L6).
const NOTE_LABELS = [
  ['The Nigeria PIA tranches', "The tiered teaching regime's tranches"],
  ['the Nigeria PIA tranches', "the tiered teaching regime's tranches"],
  ["the Designer's default PIA sliding royalty", "the Designer's sample PSC regime's sliding royalty"],
];
for (const c of G.cashflow) for (const [a, b] of NOTE_LABELS) c.note = c.note.split(a).join(b);
const CASE = Object.fromEntries(G.cashflow.map((c) => [c.id, c]));
const CMP = Object.fromEntries(G.comparisons.map((c) => [c.id, c]));
const INS = Object.fromEntries(G.insights.map((c) => [c.id, c]));
const IRRC = Object.fromEntries(G.irr.map((c) => [c.id, c]));

// The Designer's default project, taken from the published case rather than
// retyped: every template case carries it.
const DEFAULT_PROJECT = clone(CASE['template_nigeria___pia__2021_default_project'].project);
const TEST_PROJECT = clone(CASE['template_nigeria___pia__2021_test_project'].project);
const REGIME = Object.fromEntries(
  fiscalTemplates.map((t) => [slug(t.name), { id: slug(t.name), name: t.name, ...clone(t.regime) }]));
const PIA = REGIME['nigeria___pia__2021'];
// The cash flow engine's royalty helpers, which the PIA template's royalty
// calls (fiscalRegime.js imports them), so the rates printed below are the
// rates the template charges.
const CF = await import(`${ROOT}/engines/economics/cashflow.ts`);
// THE TIERED TEACHING REGIME. A regime of this course, carrying no country's
// values: a two-tier sliding royalty (7.5 percent from 0, 10 percent from
// 50 USD/bbl), cost recovery to 80 percent of revenue after royalty, and three
// R-factor tranches (60 percent from R 1.0, 40 from 1.6, 30 from 2.5), CIT 30.
// It exists so the sliding royalty and the R-factor split have a worked
// example with a step inside the teaching field's life.
const TIERED = {
  id: 'tiered_teaching', name: 'Tiered teaching regime',
  royalty: { type: 'sliding_price', tiers: [{ threshold: 0, rate: 7.5 }, { threshold: 50, rate: 10 }] },
  tax: { cit: 30, rrt: 0, minTax: 0 },
  costRecoveryLimit: 80,
  profitSplit: { type: 'tiered_r_factor', tiers: [{ threshold: 1.0, split: 60 }, { threshold: 1.6, split: 40 }, { threshold: 2.5, split: 30 }] },
};
// The deck's oil price in a project year, read the way the engine reads it:
// walk the deck in list order and keep the last point the year has reached.
const priceAt = (proj, y) => { let px = proj.prices[0].oil; for (const q of proj.prices) if (y >= q.year) px = q.oil; return px; };
const GOM = REGIME['usa___gulf_of_mexico'];
const GENERIC = REGIME['generic_royalty_tax'];
const ANGOLA = REGIME['angola___deepwater_psc'];
const BRAZIL = REGIME['brazil___concession'];
const GHANA = REGIME['ghana___deepwater'];

// The TEACHING FIELD this wave designed for itself. Its deck deliberately
// crosses the tiered teaching regime's 50 USD/bbl royalty threshold between
// year 5 and year 6, and the PIA template's low royalty-by-price benchmark in
// the same year.
const ODIDI = {
  production: {
    oil: { initial: 8000, decline: 14 },
    gas: { initial: 40, decline: 9 },
    ngl: { initial: 900, decline: 15 },
  },
  prices: [
    { year: 1, oil: 45, gas: 3.0, ngl: 25 },
    { year: 6, oil: 65, gas: 3.8, ngl: 32 },
    { year: 12, oil: 85, gas: 4.2, ngl: 38 },
  ],
  costs: {
    capex: { drilling: 260, facilities: 120, subsea: 40 },
    opex: { fixed: 12, variable: 4 },
  },
  discountRate: 12,
};

const cf = (regime, project, cx = 1, px = 1) => E.calculateCashFlowForRegime(regime, project, cx, px);
const ROW_COLS = ['year', 'grossRevenue', 'royalty', 'costRecovered', 'unrecoveredCostPool', 'profitOil', 'tax', 'opex', 'capex', 'contractorNCF', 'governmentTake', 'cumulativeNCF', 'rFactor'];
const fmtCell = (k, x) => {
  if (x === null || x === undefined) return 'null';
  if (k === 'year') return String(x);
  if (k === 'rFactor') return r(x);
  return m(x);
};
const table = (rows, cols = ROW_COLS) => {
  w(`| ${cols.join(' | ')} |`);
  w(`| ${cols.map(() => '---').join(' | ')} |`);
  for (const row of rows) w(`| ${cols.map((c) => fmtCell(c, row[c])).join(' | ')} |`);
};
const projLine = (pr) => `oil ${pr.production.oil.initial} bbl/d declining ${pr.production.oil.decline} percent a year, gas ${pr.production.gas.initial} Mscf/d declining ${pr.production.gas.decline} percent, NGL ${pr.production.ngl.initial} bbl/d declining ${pr.production.ngl.decline} percent; capex drilling ${pr.costs.capex.drilling}, facilities ${pr.costs.capex.facilities}, subsea ${pr.costs.capex.subsea} $MM; opex fixed ${pr.costs.opex.fixed} $MM a year and variable ${pr.costs.opex.variable} USD per boe; discount rate ${pr.discountRate} percent; price deck ${pr.prices.map((q) => `year ${q.year}: oil ${q.oil}, gas ${q.gas}, NGL ${q.ngl}`).join('; ')}`;
const royaltyWords = (y) => (y.type === 'flat' ? `flat ${y.rate} percent`
  : y.type === 'pia_2021' ? `PIA 2021 royalty (type pia_2021): production royalty by terrain ${y.terrain} and daily rate, royalty by price on the ${y.priceRoyaltyBase ?? 'regulations_2021'} benchmarks with project year 1 in calendar ${y.firstCalendarYear}, gas and NGL at the gas rate with ${y.gasInCountrySharePct ?? 0} percent used in-country`
    : `sliding on price, tiers ${y.tiers.map((t) => `${t.threshold} USD/bbl -> ${t.rate} percent`).join(', ')}`);
const splitWords = (p) => (p.type === 'flat' ? `flat ${p.split} percent to the contractor`
  : p.type === 'pia_cumulative_production' ? `government minimum profit oil by cumulative crude oil at the start of the year (type pia_cumulative_production), ${p.tiers.map((t, i) => `${t.upToMMbbl === null ? `above ${p.tiers[i - 1].upToMMbbl}` : `to ${t.upToMMbbl}`} million bbl -> government ${t.governmentPct} percent`).join(', ')}`
    : `tiered on the R factor, ${p.tiers.map((t) => `R ${t.threshold} -> ${t.split} percent`).join(', ')}`);
const regimeLine = (g) => `royalty ${royaltyWords(g.royalty)}; cost recovery limit ${g.costRecoveryLimit} percent of ${g.costRecoveryBase === 'liquids_gross' ? 'the gross value of crude oil and NGL (costRecoveryBase liquids_gross)' : 'revenue after royalty'}; profit split ${splitWords(g.profitSplit)}; CIT ${g.tax.cit} percent, RRT ${g.tax.rrt} percent, minimum tax ${g.tax.minTax} percent${g.tax.rrtUpliftPct === undefined ? '' : `, RRT uplift ${g.tax.rrtUpliftPct} percent`}`;
const totals = (rows) => ({
  ncf: rows.reduce((s, x) => s + x.contractorNCF, 0),
  gov: rows.reduce((s, x) => s + x.governmentTake, 0),
  rev: rows.reduce((s, x) => s + x.grossRevenue, 0),
  roy: rows.reduce((s, x) => s + x.royalty, 0),
  tax: rows.reduce((s, x) => s + x.tax, 0),
  opex: rows.reduce((s, x) => s + x.opex, 0),
  capex: rows.reduce((s, x) => s + x.capex, 0),
  rec: rows.reduce((s, x) => s + x.costRecovered, 0),
  po: rows.reduce((s, x) => s + x.profitOil, 0),
});
const payback = (rows) => { const y = rows.find((x) => x.cumulativeNCF > 0); return y ? y.year : null; };
const payout = (rows) => { const y = rows.find((x) => x.rFactor > 1.0); return y ? y.year : null; };

// -------------------------------------------------------------- Section 1
w('# EC2 Fiscal Regime Design. The teaching digest.');
w();
w('# SECTION 1: The sandbox, its conventions, and what it refuses to be (owned by Associate m01)');
w();
w('Engine: engines/economics/fiscalRegime.js with its templates in fiscalTemplates.js. Every table below is a return value of calculateCashFlowForRegime, calculateNPV, calculateIRR, deriveInsights or runFiscalComparison. Money is millions of United States dollars, written $MM in the engine\'s own labels and "million USD" in prose. Volumes are bbl and Mscf. Barrels of oil equivalent convert gas at 6000 scf per barrel, which the engine writes as a multiply by 1000 and a divide by 6000. Rates are percent.');
w();
w('HOW TO READ A COLUMN MARKED "derived". A derived column is a ratio or a difference of two engine values on the SAME row, computed at full precision and then rounded for printing. The printed endpoints are rounded too, so subtracting the two printed endpoints does not always reproduce the printed difference: the default-project Generic Royalty/Tax climb prints 51.2558 and 41.0660 with a climb of -10.1897. Both are correct and both are off by one in the last place from the subtraction a reader would do by hand. Quote a derived column as printed. Never ask a reader, in a lesson exercise or a bank question, to subtract two printed endpoints and match a printed difference.');
w();
w('The four instruments a regime carries, and nothing else:');
w();
w('- `royalty`, either `flat` with a `rate`, `sliding_price` with tiers keyed on the oil price, or `pia_2021`, the Petroleum Industry Act 2021 royalty the Nigeria - PIA (2021) template carries (Section 12).');
w('- `costRecoveryLimit`, a percent of revenue after royalty, or, with `costRecoveryBase` set to `liquids_gross`, a percent of the gross value of crude oil and NGL (Section 13).');
w('- `profitSplit`, either `flat` with a contractor `split`, `tiered_r_factor` with tiers keyed on the R factor, or `pia_cumulative_production`, the government\'s minimum share by cumulative crude production (Section 14).');
w('- `tax`, holding `cit`, `rrt`, `minTax` and an optional `rrtUpliftPct` that defaults to 20.');
w();
w('Four things the sandbox refuses to be, all four stated in the engine\'s own header:');
w();
w('- It is not a second fiscal truth. The module\'s single source of truth for Nigerian fiscal math is the Petroleum Economics Studio engine. This model exists to compare the SHAPE of regimes against each other.');
w('- It does not take a production forecast. It generates one, from an initial rate and a decline, over a fixed horizon of 25 years, and there is no input that changes the horizon.');
w('- It does not schedule capex. Every dollar of capex is spent in year 1.');
w('- It does not model abandonment, depreciation, loss carryforward against tax, ring fencing, or a valuation date. A row is a year and the year is its own discount exponent.');
w();
w(`PROJECT_LIFE is ${cf(GOM, DEFAULT_PROJECT).length} rows, which is the count the engine returns for every regime and every project.`);
w();

// -------------------------------------------------------------- Section 2
w('# SECTION 2: The two published projects, and the teaching field ODIDI (owned by Associate m02)');
w();
w('Three project inputs are used throughout this digest. The first two are published in the golden and are the Designer\'s own defaults and its test project; the third is this course\'s teaching field.');
w();
w(`- DEFAULT PROJECT (the Designer's defaults, published): ${projLine(DEFAULT_PROJECT)}.`);
w(`- TEST PROJECT (published): ${projLine(TEST_PROJECT)}.`);
w(`- ODIDI (this course's teaching field): ${projLine(ODIDI)}.`);
w();
w('ODIDI exists for one reason the published cases do not cover: its deck lifts the oil price from 45 to 65 USD per bbl at year 6, so a sliding-scale royalty keyed at 50 USD per bbl changes tier inside the life of the field. The published `sliding_royalty_price_deck_crossing` case does the same thing on its own inputs and is printed in Section 12.');
w();

// -------------------------------------------------------------- Section 3
w('# SECTION 3: The production profile, read out of the engine by probe (owned by Associate m02)');
w();
w('`generateProductionProfile` is not exported, so the volumes are read back out of the engine. A PROBE runs the project with a royalty of zero, a cost recovery limit of 100, a flat 100 percent contractor split and every tax at zero, with two of the three streams zeroed and the surviving stream priced at 1.0, so the `grossRevenue` the engine returns is that stream\'s annual volume divided by one million. The oil and NGL columns are therefore million bbl and the gas column is million Mscf.');
w();
const PROBE_REGIME = { id: 'probe', name: 'probe', royalty: { type: 'flat', rate: 0 }, costRecoveryLimit: 100, profitSplit: { type: 'flat', split: 100 }, tax: { cit: 0, rrt: 0, minTax: 0 } };
const volProbe = (project, stream) => {
  const pr = clone(project);
  for (const s of ['oil', 'gas', 'ngl']) if (s !== stream) pr.production[s].initial = 0;
  pr.prices = pr.prices.map((q) => ({ year: q.year, oil: stream === 'oil' ? 1 : 0, gas: stream === 'gas' ? 1 : 0, ngl: stream === 'ngl' ? 1 : 0 }));
  return cf(PROBE_REGIME, pr).map((x) => x.grossRevenue);
};
for (const [label, project] of [['DEFAULT PROJECT', DEFAULT_PROJECT], ['ODIDI', ODIDI]]) {
  const o = volProbe(project, 'oil'), g = volProbe(project, 'gas'), n = volProbe(project, 'ngl');
  w(`Annual volumes, ${label}:`);
  w();
  w('| year | oil, million bbl | gas, million Mscf | NGL, million bbl |');
  w('| --- | --- | --- | --- |');
  for (let i = 0; i < o.length; i++) w(`| ${i + 1} | ${r(o[i])} | ${r(g[i])} | ${r(n[i])} |`);
  w();
}
w('Two properties of that table, both visible in it and both worth stating. The decline is applied AFTER the year is booked, so year 1 is the initial rate times 365 days with no decline taken. And the profile never stops: year 25 still produces, because the horizon is fixed at 25 years rather than set by an economic limit.');
w();

// -------------------------------------------------------------- Section 4
w('# SECTION 4: The price deck and its step hold (owned by Associate m02)');
w();
w('`getPriceForYear` walks the deck in list order and keeps the LAST point whose `year` the current year has reached, so a deck is a step function that holds a price until the next point and never interpolates. The probe below prices a single stream at the deck\'s own oil price with the other streams zeroed, so the returned `grossRevenue` divided by the volume from Section 3 is the applied price; the applied price column is printed directly by running the probe with the volume held at 1 bbl/d.');
w();
const priceProbe = (project) => {
  const pr = clone(project);
  pr.production = { oil: { initial: 1 / 365, decline: 0 }, gas: { initial: 0, decline: 0 }, ngl: { initial: 0, decline: 0 } };
  return cf(PROBE_REGIME, pr).map((x) => x.grossRevenue * 1e6);
};
for (const [label, project] of [['DEFAULT PROJECT', DEFAULT_PROJECT], ['ODIDI', ODIDI]]) {
  const a = priceProbe(project);
  w(`Applied oil price by year, ${label} (probe: one barrel a day, so grossRevenue times one million is the price in USD per bbl):`);
  w();
  w('| year | applied oil price, USD/bbl |');
  w('| --- | --- |');
  for (let i = 0; i < a.length; i++) w(`| ${i + 1} | ${r(a[i])} |`);
  w();
}
w(`The DEFAULT PROJECT deck holds 70 through year 4, steps to 75 at year 5 and to 80 at year 10, and holds 80 for the remaining sixteen years. ODIDI holds 45 through year 5, steps to 65 at year 6 and to 85 at year 12. Neither deck has a point beyond its last, and the engine does not escalate past it.`);
w();

// -------------------------------------------------------------- Section 5
w('# SECTION 5: Costs, and the two halves of opex (owned by Associate m02)');
w();
w('Capex is `drilling + facilities + subsea`, multiplied by the capex multiplier, and the whole of it is charged in year 1. Opex is `fixed` plus `variable` times the barrels of oil equivalent produced that year, divided by one million because the variable rate is USD per boe and the ledger is in millions.');
w();
for (const [label, project] of [['DEFAULT PROJECT', DEFAULT_PROJECT], ['ODIDI', ODIDI]]) {
  const rows = cf(GOM, project);
  w(`${label}, the cost columns the engine returns for every regime (they do not depend on the regime):`);
  w();
  table(rows.slice(0, 6).concat(rows.slice(24)), ['year', 'opex', 'capex']);
  w();
  const t = totals(rows);
  w(`Totals over the life: opex ${m(t.opex)} $MM, capex ${m(t.capex)} $MM.`);
  w();
}
w('Opex falls year on year even though `fixed` never changes, because the variable half tracks the declining boe. Capex is zero in every year but the first.');
w();

// -------------------------------------------------------------- Section 6
w('# SECTION 6: Gross revenue and a flat royalty (owned by Associate m03)');
w();
w('Gross revenue is oil volume times the applied oil price, plus gas volume times the gas price, plus NGL volume times the NGL price, all divided by one million. Royalty is a rate applied to GROSS revenue, before any cost is deducted.');
w();
for (const [label, project] of [['DEFAULT PROJECT', DEFAULT_PROJECT], ['ODIDI', ODIDI]]) {
  const rows = cf(GOM, project);
  w(`${label} under "${GOM.name}" (${regimeLine(GOM)}). First eight years and the last:`);
  w();
  w('| year | grossRevenue | royalty | revenue after royalty (derived, the two printed columns subtracted) | implied royalty rate (derived, royalty over grossRevenue) |');
  w('| --- | --- | --- | --- | --- |');
  for (const x of rows.slice(0, 8).concat(rows.slice(24))) {
    w(`| ${x.year} | ${m(x.grossRevenue)} | ${m(x.royalty)} | ${m(x.grossRevenue - x.royalty)} | ${r(x.royalty / x.grossRevenue)} |`);
  }
  w();
}
w('The implied rate is the same in every year of both tables, because this regime\'s royalty is flat. Section 12 prints the same column for a regime whose rate moves.');
w();

// -------------------------------------------------------------- Section 7
w('# SECTION 7: The six templates as data (owned by Associate m03)');
w();
w('`fiscalTemplates` is a list of six. Templates carry no `id`; the Suite assigns one when a template is loaded into a comparison, and the goldens use the slug of the name.');
w();
for (const t of fiscalTemplates) {
  const g = { id: slug(t.name), name: t.name, ...clone(t.regime) };
  w(`- **${t.name}** (id \`${g.id}\`). ${t.description}`);
  w(`  ${regimeLine(g)}.`);
}
w();
w('Three of the six take a flat 100 percent of profit oil to the contractor and recover cost at 100 percent, which is what a concession looks like inside a model built around a production sharing ledger: the contractor keeps everything the taxes do not take. Two split profit oil on the R factor and cap cost recovery at 90 percent (Ghana) and 50 percent (Angola) of revenue after royalty. The Nigeria - PIA (2021) template is the Act\'s base terms for a deep offshore production sharing contract on new acreage: the royalty the Act and the Petroleum Royalty Regulations 2022 set (production royalty by terrain and daily rate, royalty by price, gas and NGL at 5 percent), cost recovery to 70 percent of the gross value of crude oil and NGL, and the government\'s minimum share of profit oil by cumulative crude production (PIA Seventh Schedule paras 10, 11 and 14(4)); CIT 30 percent and no hydrocarbon tax in deep offshore (s.260(3)). These are the Act\'s minimum terms, which a licensing round can bid up (s.303(2)).');
w();

// -------------------------------------------------------------- Section 8
w('# SECTION 8: A concession ledger end to end (owned by Associate m04)');
w();
w(`"${GOM.name}" on the DEFAULT PROJECT, every column the engine returns, all 25 rows. The royalty is flat, the cost recovery limit is 100 percent, the contractor takes 100 percent of profit oil, and the only tax is CIT at 21 percent, so this is the simplest ledger the sandbox can produce.`);
w();
table(cf(GOM, DEFAULT_PROJECT));
w();
{
  const rows = cf(GOM, DEFAULT_PROJECT); const t = totals(rows);
  w(`Totals: gross revenue ${m(t.rev)}, royalty ${m(t.roy)}, cost recovered ${m(t.rec)}, profit oil ${m(t.po)}, tax ${m(t.tax)}, opex ${m(t.opex)}, capex ${m(t.capex)}, contractor net cash flow ${m(t.ncf)}, government take ${m(t.gov)} $MM.`);
  w(`Payback is year ${payback(rows)}, which is the first year `+'`cumulativeNCF`'+` is above zero. The R factor passes 1.0 in year ${payout(rows)}.`);
  w();
  w(`The identity that closes the ledger, on year 1: cost recovered ${m(rows[0].costRecovered)} plus contractor profit share, minus tax ${m(rows[0].tax)}, minus opex ${m(rows[0].opex)}, minus capex ${m(rows[0].capex)}, gives contractor net cash flow ${m(rows[0].contractorNCF)}. Government take that year is royalty ${m(rows[0].royalty)} plus the government profit share plus tax ${m(rows[0].tax)}, which is ${m(rows[0].governmentTake)}.`);
  w();
}

// -------------------------------------------------------------- Section 9
w('# SECTION 9: The identity that closes the ledger (owned by Associate m04)');
w();
w('In EVERY year, for EVERY regime, at EVERY cost recovery limit these templates use, contractor net cash flow PLUS government take equals gross revenue MINUS opex MINUS capex. The regime decides who gets what and when. It does not change what there is to get.');
w();
w('The reason is one line of the engine. Profit oil is revenue after royalty minus cost recovered, so cost recovered plus profit oil is revenue after royalty, always. Add the royalty back and the recovered cost and the royalty both cancel out of the sum, leaving revenue less the cash costs. An unrecovered balance does not leave the system: it stays in the pool and becomes somebody\'s profit oil in a later year.');
w();
for (const [label, regime, project] of [['USA - Gulf of Mexico (cost recovery limit 100) on the DEFAULT PROJECT', GOM, DEFAULT_PROJECT], ['Angola - Deepwater PSC (cost recovery limit 50) on the DEFAULT PROJECT', ANGOLA, DEFAULT_PROJECT]]) {
  const rows = cf(regime, project);
  w(`${label}:`);
  w();
  w('| year | grossRevenue | opex | capex | costRecovered | unrecoveredCostPool | contractorNCF | governmentTake | contractorNCF plus governmentTake (derived) | grossRevenue minus opex minus capex (derived) |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const x of rows.slice(0, 6)) {
    w(`| ${x.year} | ${m(x.grossRevenue)} | ${m(x.opex)} | ${m(x.capex)} | ${m(x.costRecovered)} | ${m(x.unrecoveredCostPool)} | ${m(x.contractorNCF)} | ${m(x.governmentTake)} | ${m(x.contractorNCF + x.governmentTake)} | ${m(x.grossRevenue - x.opex - x.capex)} |`);
  }
  w();
}
w('The last two columns agree on every row of both tables, and the two regimes are as far apart as this template set goes: one recovers cost in full and carries nothing, the other recovers half of revenue after royalty at most and is still working off a balance years later. The closing pools differ by hundreds of millions of USD and the sums do not differ at all.');
w();
{
  let worst = 0, where = '';
  for (const t of fiscalTemplates) {
    const g = { id: slug(t.name), name: t.name, ...clone(t.regime) };
    for (const project of [DEFAULT_PROJECT, TEST_PROJECT, ODIDI]) {
      for (const x of cf(g, project)) {
        const d = Math.abs((x.contractorNCF + x.governmentTake) - (x.grossRevenue - x.opex - x.capex));
        if (d > worst) { worst = d; where = `${t.name}, year ${x.year}`; }
      }
    }
  }
  let worstPub = 0, wherePub = '';
  for (const c of G.cashflow) {
    for (const x of cf({ id: c.regime.id, name: c.regime.name, ...c.regime }, c.project, c.capexMultiplier ?? 1, c.priceMultiplier ?? 1)) {
      const d = Math.abs((x.contractorNCF + x.governmentTake) - (x.grossRevenue - x.opex - x.capex));
      if (d > worstPub) { worstPub = d; wherePub = `${c.id}, year ${x.year}`; }
    }
  }
  w(`Swept rather than asserted. Across all six templates on all three projects, 450 rows, the largest disagreement between the two sums is ${worst.toExponential(4)} (${where}). Across all ${G.cashflow.length} published cash flow cases, ${G.cashflow.length * 25} rows, it is ${worstPub.toExponential(4)} (${wherePub}). Both are floating point noise; the identity is exact.`);
  w();
}
w('THIS IDENTITY USED TO FAIL, AND THAT IS WHY IT IS WORTH STATING. The engine header records two defects fixed in the E1 pass, both found by checking exactly this mass balance against the canonical production sharing semantics. Recovered cost was subtracted from profit oil and then DROPPED: not credited to the contractor, not counted to the government, so the two takes came to less than revenue minus cost by exactly the cost recovered, which on a normal case is hundreds of millions of USD a year evaporating out of the comparison the app exists to make. And opex was never recoverable, because the pool was seeded with capex and nothing was ever added to it. Cost oil is now credited to the contractor and the full cost outflow enters the pool.');
w();
w('So the identity is a CHECK, and it is the first one to run on any ledger this engine produces. If the two sums part company, the cascade has lost money somewhere between the royalty and the split, and no amount of reading the individual columns will show you where as quickly as the sum does.');
w();
w('One limit on it, stated because every capability in this course states its limit. It holds while the cost recovery limit is 100 percent or less, which covers every template and every published case. Profit oil is floored at zero, so a limit above 100 percent could in principle recover more than the revenue after royalty and break the identity in the direction of the contractor. Nothing in the template set does this.');
w();
// -------------------------------------------------------------- Section 10
w('# SECTION 10: Cumulative cash flow, payback and totals for all six templates (owned by Associate m05)');
w();
w('One line per template, on each of the two published projects. `payback` is the first year cumulative contractor net cash flow is above zero; `payout` is the first year the R factor is above 1.0; both are `null` when they never happen.');
w();
for (const [label, project] of [['DEFAULT PROJECT', DEFAULT_PROJECT], ['TEST PROJECT', TEST_PROJECT]]) {
  w(`${label}:`);
  w();
  w('| regime | total contractor NCF | total government take | total revenue | total tax | payback year | payout year | NPV at the project rate | IRR percent |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const t of fiscalTemplates) {
    const g = { id: slug(t.name), name: t.name, ...clone(t.regime) };
    const rows = cf(g, project); const s = totals(rows);
    w(`| ${t.name} | ${m(s.ncf)} | ${m(s.gov)} | ${m(s.rev)} | ${m(s.tax)} | ${payback(rows) ?? 'null'} | ${payout(rows) ?? 'null'} | ${m(E.calculateNPV(rows, project.discountRate))} | ${irrRows(rows)} |`);
  }
  w();
}
w('Total revenue is identical down each column, because the regime never touches production or price. Everything else moves.');
w();

// -------------------------------------------------------------- Section 11
w('# SECTION 11: Every published cash flow case, one line each (owned by Associate m05)');
w();
w(`The golden\'s ${G.cashflow.length} cash flow cases, with the golden\'s own note and the headline the engine returns today. An IRR that is not a single rate prints as null with the engine\'s status (Section 16).`);
w();
// ONE published note does not match its own recorded values, so it is
// annotated here rather than reprinted as if it were true. See the caution
// under this list.
// EC2-4: the golden's three notes that once contradicted their own numbers
// (capped_5pct, rfactor_tranche_crossing, rfactor_falls_back) were corrected
// at source, so no note needs a caution any more.
const STALE_NOTE = {};
for (const c of G.cashflow) {
  const rows = cf({ id: c.regime.id, name: c.regime.name, ...c.regime }, c.project, c.capexMultiplier ?? 1, c.priceMultiplier ?? 1);
  const s = totals(rows);
  w(`- ${c.id}: ${c.note}`);
  if (STALE_NOTE[c.id]) w(`  ${STALE_NOTE[c.id]}`);
  w(`  total contractor NCF ${m(s.ncf)}, total government take ${m(s.gov)}, total revenue ${m(s.rev)}, total royalty ${m(s.roy)}, total cost recovered ${m(s.rec)}, total profit oil ${m(s.po)}, total tax ${m(s.tax)}, payback year ${payback(rows) ?? 'null'}, payout year ${payout(rows) ?? 'null'}, NPV ${m(E.calculateNPV(rows, c.project.discountRate))} at ${c.project.discountRate} percent, IRR ${irrRows(rows)}, closing unrecovered pool ${m(rows[rows.length - 1].unrecoveredCostPool)}.`);
}
w();
w('A NOTE ON THE NOTES. Each note is the golden\'s own prose, reprinted verbatim except for two regime labels: the tranches the golden calls "the Nigeria PIA tranches" print as the tiered teaching regime\'s, which they are value for value, and "the Designer\'s default PIA sliding royalty" prints as the Designer\'s sample PSC regime\'s sliding royalty. Three of them once made a claim their own numbers refused, and all three were corrected at source (EC2-4):');
w();
w('- `capped_5pct_pool_never_clears` (formerly capped_5pct_never_recovers) once said "no payback, IRR 0". It pays back in year 3, because at a 5 percent cost recovery limit the revenue that cannot be recovered becomes profit oil and this regime splits profit oil 100 percent to the contractor. Its NPV is zero at 54.6792 percent and again at -14.2614 percent, so the IRR is null with the status multiple-roots. Cost recovery is not the only way a contractor is paid back.');
w('- `rfactor_tranche_crossing` once dated the 1.0 crossing to year 3. The R factor crosses 1.0 in year 2 and that crossing steps nothing, because 60 percent is already the first tier\'s split; the step to 40 percent in year 3 is the 1.6 threshold.');
w('- `rfactor_falls_back` once said the R factor peaks "just above 2.5". It peaks at 2.972625 in year 11 and crosses 2.5 going up in year 5, at 2.501684.');
w();
w('THE RULE, AND IT IS THE MOST PORTABLE THING IN THIS SECTION. Quote a golden\'s NUMBERS, never a golden\'s prose. When the three notes above were wrong, a numeric sweep of every note against everything its case computes found nothing, because every number those notes stated did appear somewhere in the case: year 3 was a real year, 2.5 a real threshold, 0 a real value. What was wrong was which number was attached to which event, and no mechanical check reads an ASSOCIATION. Three human readers found them, each by doing the arithmetic the sentence claimed.');
w();

// -------------------------------------------------------------- Section 12
w('# SECTION 12: The sliding-scale royalty (owned by Professional m01)');
w();
w('`getSlidingScaleRoyalty` starts at the FIRST tier\'s rate and walks the list in order, keeping the rate of every tier whose `threshold` the oil price has reached. For a sorted tier list that is the highest threshold reached. The price it reads is the applied oil price for the year AFTER the price multiplier, so a sweep moves the royalty tier as well as the revenue.');
w();
w(`The tiered teaching regime's royalty has two tiers, 0 USD/bbl at 7.5 percent and 50 USD/bbl at 10 percent. Swept across the price multiplier on the DEFAULT PROJECT, whose year 1 deck price is 70 USD per bbl:`);
w();
w('| price multiplier | applied year 1 oil price (derived, 70 times the multiplier) | year 1 grossRevenue | year 1 royalty | implied rate (derived) |');
w('| --- | --- | --- | --- | --- |');
for (const mult of [0.5, 0.6, 0.7, 0.71, 0.72, 0.8, 1.0, 1.2]) {
  const rows = cf(TIERED, DEFAULT_PROJECT, 1, mult);
  w(`| ${r(mult)} | ${r(70 * mult)} | ${m(rows[0].grossRevenue)} | ${m(rows[0].royalty)} | ${r(rows[0].royalty / rows[0].grossRevenue)} |`);
}
w();
w('The implied rate steps from 0.075000 to 0.100000 between the multipliers 0.710000 and 0.720000, which is the deck price crossing 50 USD per bbl. It is a STEP, not a ramp: nothing between the tiers is interpolated.');
w();
w('WHICH SIDE DOES THE THRESHOLD ITSELF BELONG TO. The comparison in the engine is `oilPrice >= tier.threshold`, so a price sitting EXACTLY on a threshold takes the UPPER tier. No multiplier on this deck lands exactly on 50, and one that looks as though it does is a rounding: 70 times 50 divided by 70 is 49.99999999999998 in binary floating point, which is strictly below the threshold and takes the LOWER tier while printing as 50.000000 at six decimals. So the point is made with a deck priced at the threshold instead, which needs no multiplier at all. Three probe decks, the Designer default project in every other respect, at the tiered teaching regime\'s royalty:');
w();
{
  w('| deck oil price, USD/bbl | year 1 grossRevenue | year 1 royalty | implied rate (derived) |');
  w('| --- | --- | --- | --- |');
  for (const price of [49.99, 50, 50.01]) {
    const pr = clone(DEFAULT_PROJECT);
    pr.prices = [{ year: 1, oil: price, gas: DEFAULT_PROJECT.prices[0].gas, ngl: DEFAULT_PROJECT.prices[0].ngl }];
    const rows = cf(TIERED, pr);
    w(`| ${r(price)} | ${m(rows[0].grossRevenue)} | ${m(rows[0].royalty)} | ${r(rows[0].royalty / rows[0].grossRevenue)} |`);
  }
  w();
}
w('The threshold belongs to the tier above it. A price one cent below pays 7.5 percent, a price exactly on it pays 10 percent, and a price one cent above pays 10 percent. Read a sweep\'s printed price column as a ROUNDING of the price the engine used, never as the price itself, and read the implied rate as the measurement: the rate says which side of the threshold the engine was actually on.');
w();
w('The same instrument seen along a deck rather than along a multiplier. ODIDI holds 45 USD per bbl through year 5 and steps to 65 at year 6, so under the tiered teaching regime its royalty rate changes inside the life of the field:');
w();
{
  const rows = cf(TIERED, ODIDI);
  w('| year | grossRevenue | royalty | implied rate (derived, royalty over grossRevenue) |');
  w('| --- | --- | --- | --- |');
  for (const x of rows.slice(0, 8)) w(`| ${x.year} | ${m(x.grossRevenue)} | ${m(x.royalty)} | ${r(x.royalty / x.grossRevenue)} |`);
  w();
}
w('And the two published cases that pin the same behaviour:');
w();
for (const id of ['sliding_royalty_price_deck_crossing', 'price_below_every_threshold']) {
  const c = CASE[id];
  const rows = cf({ id: c.regime.id, name: c.regime.name, ...c.regime }, c.project, c.capexMultiplier ?? 1, c.priceMultiplier ?? 1);
  w(`- ${id}: ${c.note}`);
  w(`  ${regimeLine(c.regime)}.`);
  w('');
  w('  | year | grossRevenue | royalty | implied rate (derived) |');
  w('  | --- | --- | --- | --- |');
  for (const x of rows.slice(0, 8)) w(`  | ${x.year} | ${m(x.grossRevenue)} | ${m(x.royalty)} | ${r(x.royalty / x.grossRevenue)} |`);
  w('');
}
w('`price_below_every_threshold` is the case that shows the starting rate is the FIRST tier\'s rate and not zero: the price never reaches any threshold above the first, and the first tier\'s rate is charged in every year.');
w();
w('### The Nigeria - PIA (2021) template\'s royalty (type pia_2021)');
w();
w(`This royalty has no tiers keyed on the price alone. Each year it charges three things, computed by the cash flow engine\'s own helpers: the production royalty on the oil revenue at the rate for the terrain (${PIA.royalty.terrain}) and the year\'s daily oil rate (the year\'s oil over 365 days); the royalty by price on the oil revenue, at the rate for the year\'s oil price and calendar year (project year 1 is ${PIA.royalty.firstCalendarYear}) on the ${PIA.royalty.priceRoyaltyBase} benchmarks; and the gas rate on the gas and NGL revenue. ODIDI under it:`);
w();
{
  const rows = cf(PIA, ODIDI);
  const vol = (y) => ODIDI.production.oil.initial * 365 * Math.pow(1 - ODIDI.production.oil.decline / 100, y - 1);
  w('| year | calendar year | oil price | daily oil rate (derived) | production royalty rate | low benchmark | royalty by price rate | gas and NGL rate | royalty | implied rate on grossRevenue (derived) |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const x of rows.slice(0, 14)) {
    const cy = PIA.royalty.firstCalendarYear + x.year - 1; const px = priceAt(ODIDI, x.year);
    w(`| ${x.year} | ${cy} | ${r(px)} | ${m(vol(x.year) / 365)} | ${r(CF.deriveOilRoyaltyRate(PIA.royalty.terrain, vol(x.year) / 365))} | ${m(CF.priceRoyaltyBenchmarks(cy, PIA.royalty.priceRoyaltyBase).low)} | ${r(CF.derivePriceRoyaltyRate(px, cy, PIA.royalty.terrain, PIA.royalty.priceRoyaltyBase))} | ${r(CF.deriveGasRoyaltyRate(PIA.royalty.terrain, PIA.royalty.gasInCountrySharePct))} | ${m(x.royalty)} | ${r(x.royalty / x.grossRevenue)} |`);
  }
  w();
}
w('ODIDI produces well under 50,000 bopd, so its production royalty stays at the 5 percent deep offshore rate. The royalty by price is zero while the oil price is at or below the year\'s low benchmark and rises from the year the deck lifts the price above it.');
w();
// -------------------------------------------------------------- Section 13
w('# SECTION 13: Cost recovery, the pool and the carryforward (owned by Professional m02)');
w();
w('Three lines of the engine do the whole of it. The recoverable pool is the balance brought forward plus this year\'s capex plus this year\'s opex. The allowance is the cost recovery limit as a percent of revenue AFTER royalty. Cost recovered is the smaller of the two, and the pool carries the rest forward. Profit oil is revenue after royalty minus cost recovered, floored at zero.');
w();
w('The same project under four limits, so the limit is the only thing that moves. Angola\'s 50 percent, the tiered teaching regime\'s 80, Ghana\'s 90 and the concession 100, all on the DEFAULT PROJECT with everything else held at the "Generic Royalty/Tax" template\'s settings:');
w();
for (const lim of [50, 80, 90, 100]) {
  const g = { ...clone(GENERIC), costRecoveryLimit: lim, id: `limit_${lim}`, name: `Generic at a ${lim} percent limit` };
  const rows = cf(g, DEFAULT_PROJECT); const s = totals(rows);
  w(`Cost recovery limit ${lim} percent. Total cost recovered ${m(s.rec)}, total profit oil ${m(s.po)}, total contractor NCF ${m(s.ncf)}, closing unrecovered pool ${m(rows[rows.length - 1].unrecoveredCostPool)} $MM.`);
  w();
  w('| year | grossRevenue | royalty | costRecovered | unrecoveredCostPool | profitOil |');
  w('| --- | --- | --- | --- | --- | --- |');
  for (const x of rows.slice(0, 7)) w(`| ${x.year} | ${m(x.grossRevenue)} | ${m(x.royalty)} | ${m(x.costRecovered)} | ${m(x.unrecoveredCostPool)} | ${m(x.profitOil)} |`);
  w();
}
w('READ THE 100 PERCENT TABLE BEFORE ASSUMING A FULL LIMIT NEVER BINDS. It binds here for two years. The allowance is 100 percent of revenue AFTER ROYALTY, which in year 1 is 237.9903, and the pool that year is the whole capex plus the whole opex, far more than that. So the pool closes year 1 at 293.0124 and year 2 at 107.9555 and only empties in year 3, and profit oil is 0.0000 in both of the first two years. A cost recovery limit of 100 percent is not the absence of a limit: it is a limit at the size of the revenue, and while capex is large the revenue is the binding constraint.');
w();
w('At 50 percent the same thing happens harder and for longer: the year 1 capex cannot be recovered in year 1 and the balance is still being worked off years later. Every dollar sitting in the pool is a dollar the contractor has spent and not yet been paid back.');
w();
w('Two published cases hold the extremes:');
w();
for (const id of ['capped_5pct_pool_never_clears', 'capped_40pct', 'never_recovers_huge_capex']) {
  const c = CASE[id];
  const rows = cf({ id: c.regime.id, name: c.regime.name, ...c.regime }, c.project, c.capexMultiplier ?? 1, c.priceMultiplier ?? 1);
  const s = totals(rows);
  w(`- ${id}: ${c.note} Cost recovery limit ${c.regime.costRecoveryLimit} percent. Total cost recovered ${m(s.rec)}, total profit oil ${m(s.po)}, total contractor NCF ${m(s.ncf)}, closing unrecovered pool ${m(rows[rows.length - 1].unrecoveredCostPool)} $MM, payback year ${payback(rows) ?? 'null'}.`);
}
w();
w(`The Nigeria - PIA (2021) template takes its limit on a different base (costRecoveryBase liquids_gross): ${PIA.costRecoveryLimit} percent of the gross value of crude oil and NGL, before royalty, where every other regime here takes a percent of revenue after royalty. On ODIDI:`);
w();
{
  const rows = cf(PIA, ODIDI);
  w('| year | grossRevenue | royalty | recoverable pool (derived, pool brought forward plus capex plus opex) | costRecovered | unrecoveredCostPool |');
  w('| --- | --- | --- | --- | --- | --- |');
  let prev = 0;
  for (const x of rows.slice(0, 6)) { w(`| ${x.year} | ${m(x.grossRevenue)} | ${m(x.royalty)} | ${m(prev + x.capex + x.opex)} | ${m(x.costRecovered)} | ${m(x.unrecoveredCostPool)} |`); prev = x.unrecoveredCostPool; }
  w();
}
w('What cost recovery is NOT. It is not a deduction against tax: the tax base in this model is the contractor\'s profit share, and cost recovered is added to the contractor\'s cash separately. It is not depreciation, and there is no schedule. And an unrecovered balance is not a loss carried forward for tax; it is only a claim on future revenue after royalty.');
w();

// -------------------------------------------------------------- Section 14
w('# SECTION 14: The R factor (owned by Professional m03)');
w();
w('The R factor is cumulative gross revenue divided by cumulative cost, where cumulative cost is the running sum of capex plus opex. It is a ratio of CUMULATIVES, not of the year, and it is computed BEFORE the split is chosen, from the totals including the current year. `getTieredSplit` then walks the tier list in order and keeps the split of every tier whose threshold the R factor has reached.');
w();
w(`The tiered teaching regime splits at R 1.0 to 60 percent, R 1.6 to 40 percent and R 2.5 to 30 percent. On the DEFAULT PROJECT:`);
w();
{
  const rows = cf(TIERED, DEFAULT_PROJECT);
  w('| year | grossRevenue | opex | capex | rFactor | profitOil | contractor profit share (derived, contractorNCF plus tax plus opex plus capex minus costRecovered) | implied split (derived, that share over profitOil) |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const x of rows) {
    const share = x.contractorNCF + x.tax + x.opex + x.capex - x.costRecovered;
    w(`| ${x.year} | ${m(x.grossRevenue)} | ${m(x.opex)} | ${m(x.capex)} | ${r(x.rFactor)} | ${m(x.profitOil)} | ${m(share)} | ${x.profitOil > 0 ? r(share / x.profitOil) : 'null'} |`);
  }
  w();
}
w('The implied split is the tier the R factor selected, read back out of the ledger. It starts below 1.0 in year 1, so the FIRST tier\'s split is used even though no threshold has been reached, exactly as the royalty does.');
w();
w(`The Nigeria - PIA (2021) template does not split on the R factor. Its split (type pia_cumulative_production) is the government\'s minimum share of profit oil by the field\'s cumulative crude production at the START of the year: ${PIA.profitSplit.tiers.map((t) => `${t.upToMMbbl === null ? 'above the last band' : `up to and including ${t.upToMMbbl} million bbl`} ${t.governmentPct} percent`).join(', ')}. The contractor takes the rest. On the DEFAULT PROJECT:`);
w();
{
  const rows = cf(PIA, DEFAULT_PROJECT);
  const vol = (y) => DEFAULT_PROJECT.production.oil.initial * 365 * Math.pow(1 - DEFAULT_PROJECT.production.oil.decline / 100, y - 1);
  let cum = 0;
  w('| year | cumulative oil at the start of the year, million bbl (derived) | profitOil | implied contractor split (derived) |');
  w('| --- | --- | --- | --- |');
  for (const x of rows.slice(0, 25)) {
    const share = x.contractorNCF + x.tax + x.opex + x.capex - x.costRecovered;
    w(`| ${x.year} | ${r(cum / 1e6)} | ${m(x.profitOil)} | ${x.profitOil > 0 ? r(share / x.profitOil) : 'null'} |`);
    cum += vol(x.year);
  }
  w();
}
w();
w('Three published cases, one for each behaviour:');
w();
for (const id of ['rfactor_tranche_crossing', 'rfactor_falls_back', 'harsh_split_40_royalty_20']) {
  const c = CASE[id];
  const rows = cf({ id: c.regime.id, name: c.regime.name, ...c.regime }, c.project, c.capexMultiplier ?? 1, c.priceMultiplier ?? 1);
  w(`- ${id}: ${c.note}`);
  w(`  ${regimeLine(c.regime)}.`);
  w('');
  w('  | year | rFactor | profitOil | implied split (derived) |');
  w('  | --- | --- | --- | --- |');
  for (const x of rows) {
    const share = x.contractorNCF + x.tax + x.opex + x.capex - x.costRecovered;
    w(`  | ${x.year} | ${r(x.rFactor)} | ${m(x.profitOil)} | ${x.profitOil > 0 ? r(share / x.profitOil) : 'null'} |`);
  }
  w('');
}
w('`rfactor_falls_back` is the property the oracle records and the course teaches: the R factor is a ratio of cumulatives and it is NOT monotone. Revenue declines while opex keeps accruing, the ratio crosses back below a threshold it had passed, and the contractor\'s split steps back UP. Real R factor contracts usually ratchet, so that a split once given up is never returned; this one does not, and nothing in the engine says so.');
w();
w('The order of the tiers decides the answer. The walk keeps the LAST tier in list order whose threshold is reached, which is the same thing as the highest threshold reached only while the list is sorted. Every template and the Designer\'s defaults are sorted. An unsorted list would silently select the wrong rate, and no gate in the app checks the order.');
w();

// -------------------------------------------------------------- Section 15
w('# SECTION 15: The tax stack (owned by Professional m04)');
w();
w('The tax base is the contractor\'s profit share, and nothing else. Costs are compensated through cost recovery, so no opex is deducted here again; the header records that an earlier version halved opex against the base and that the halving was invented and removed. CIT is the rate on the base when the base is positive. RRT is charged on the base MINUS an annual capital uplift of `rrtUpliftPct` percent of total capex, and only when that is positive. The minimum tax is a percent of GROSS revenue. The tax charged is `Math.max(cit + rrt, minTax)`.');
w();
w('Because the tax rates do not enter the base, the stack decomposes exactly: running the same regime with two of the three at zero returns the third on its own. The decomposition below is four engine runs of one regime, on the DEFAULT PROJECT with the "Brazil - Concession" instruments (royalty flat 10 percent, cost recovery 100, flat 100 percent split), whose CIT is 34 percent and whose RRT stands in for Special Participation at 40 percent.');
w();
{
  const base = clone(BRAZIL);
  const only = (patch, name) => ({ ...clone(base), tax: { cit: 0, rrt: 0, minTax: 0, ...patch }, id: name, name });
  const all = cf({ ...clone(base), id: 'all', name: 'all' }, DEFAULT_PROJECT);
  const citOnly = cf(only({ cit: base.tax.cit }, 'cit'), DEFAULT_PROJECT);
  const rrtOnly = cf(only({ rrt: base.tax.rrt }, 'rrt'), DEFAULT_PROJECT);
  const minOnly = cf(only({ minTax: 5 }, 'min'), DEFAULT_PROJECT);
  w('| year | grossRevenue | profitOil | CIT alone (cit 34, rrt 0, minTax 0) | RRT alone (cit 0, rrt 40, uplift 20 default) | minimum tax alone at 5 percent of gross | tax as published (cit 34, rrt 40, minTax 0) |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  for (let i = 0; i < all.length; i++) {
    w(`| ${all[i].year} | ${m(all[i].grossRevenue)} | ${m(all[i].profitOil)} | ${m(citOnly[i].tax)} | ${m(rrtOnly[i].tax)} | ${m(minOnly[i].tax)} | ${m(all[i].tax)} |`);
  }
  w();
  w(`Totals: CIT alone ${m(totals(citOnly).tax)}, RRT alone ${m(totals(rrtOnly).tax)}, minimum tax alone at 5 percent ${m(totals(minOnly).tax)}, tax as published ${m(totals(all).tax)} $MM.`);
  w();
  w(`The decomposition is exact in the engine and only APPROXIMATE at the precision printed here: each column total is rounded on its own, so CIT alone plus RRT alone can miss the published stack by one unit in the last place. Unrounded, the sum of the two is ${(totals(citOnly).tax + totals(rrtOnly).tax).toFixed(10)} against a published ${totals(all).tax.toFixed(10)}, a difference of ${Math.abs(totals(citOnly).tax + totals(rrtOnly).tax - totals(all).tax).toExponential(4)}. Quote the columns, do not assert that the printed figures add.`);
  w();
}
w('The RRT column is zero in the early years, because relief is drawn from a pool opened once at total capex times one plus the uplift (EC2-6), and the RRT is charged only on what the pool no longer covers. The first year with a charge is the year the pool runs out. Section 24 sweeps the uplift.');
w();
{
  // The Professional tier teaches the pool on this sweep (m04 l03), so the
  // table is printed in its own section too; Section 24 prints it again, with
  // two more columns, beside the retired annual allowance.
  const base = clone(BRAZIL);
  w(`The pool under a sweep: the "${base.name}" instruments on the DEFAULT PROJECT with the corporate income tax set to zero, so the tax is the RRT alone at ${base.tax.rrt} percent. Total capex is ${m(totals(cf(base, DEFAULT_PROJECT)).capex)} $MM.`);
  w();
  w('| rrtUpliftPct | total tax | total contractor NCF | total government cash flow | first year with a positive charge |');
  w('| --- | --- | --- | --- | --- |');
  for (const up of [0, 5, 10, 20, 30, 50]) {
    const g = { ...clone(base), tax: { ...clone(base.tax), cit: 0, rrtUpliftPct: up }, id: `up_${up}`, name: `uplift ${up}` };
    const rows = cf(g, DEFAULT_PROJECT); const s = totals(rows);
    const firstPos = rows.find((x) => x.tax > 0);
    w(`| ${up} | ${m(s.tax)} | ${m(s.ncf)} | ${m(s.gov)} | ${firstPos ? firstPos.year : 'null'} |`);
  }
  w();
}
w('The minimum tax and the maximum, on the published case that pins it:');
w();
for (const id of ['minimum_tax_binds', 'rrt_uplift_default_20', 'rrt_uplift_zero_respected']) {
  const c = CASE[id];
  const rows = cf({ id: c.regime.id, name: c.regime.name, ...c.regime }, c.project, c.capexMultiplier ?? 1, c.priceMultiplier ?? 1);
  w(`- ${id}: ${c.note}`);
  w(`  ${regimeLine(c.regime)}. Total tax ${m(totals(rows).tax)}, total contractor NCF ${m(totals(rows).ncf)} $MM.`);
  w('');
  w('  | year | grossRevenue | profitOil | tax |');
  w('  | --- | --- | --- | --- |');
  for (const x of rows.slice(0, 8)) w(`  | ${x.year} | ${m(x.grossRevenue)} | ${m(x.profitOil)} | ${m(x.tax)} |`);
  w('');
}
w('What the stack leaves out. There is no loss carryforward, so a year whose base is negative pays nothing and passes nothing to the next year. There is no ring fence and no consolidation. There is no depreciation, no capital allowance, no education tax, no levy on gross production. A regime whose real burden lives in an instrument the four fields cannot express cannot be modelled here, and the answer is not to bend a rate until the total looks right.');
w();

// -------------------------------------------------------------- Section 16
w('# SECTION 16: Discounting, the parity with mid year, and IRR (owned by Professional m05)');
w();
w('`calculateNPV` discounts YEAR END: each year\'s contractor net cash flow is divided by one plus the rate, raised to the year number, and year 1 is already discounted once. The screening engine in the same package discounts MID YEAR, at t equal to the index plus one half. On identical cash flows the mid-year NPV is larger by exactly the square root of one plus the rate, and that relation is pinned by the parity gate in the engines test file rather than left as a surprise.');
w();
{
  const rows = cf(GOM, DEFAULT_PROJECT);
  w(`"${GOM.name}" on the DEFAULT PROJECT, swept across the discount rate:`);
  w();
  w('| rate percent | NPV year end | NPV mid year (derived, the year-end NPV times the square root of one plus the rate) | ratio (derived) |');
  w('| --- | --- | --- | --- |');
  for (const rate of [0, 5, 8, 10, 12, 15, 20, 25, 30]) {
    const npv = E.calculateNPV(rows, rate);
    w(`| ${rate} | ${m(npv)} | ${m(npv * Math.sqrt(1 + rate / 100))} | ${r(Math.sqrt(1 + rate / 100))} |`);
  }
  w();
}
w('`calculateIRR` follows the shared contract in `engines/economics/irrContract.js` (EC2-5, owner decision 2026-09-15), the one the screening engine uses. It searches the band from -99 to 1000 percent and returns a number only when exactly one rate in that band zeroes the NPV; a negative root inside the band is reported as the negative rate it is. Otherwise it returns null and `calculateIRRResult` says why: `no-sign-change` when the flows never change sign, `no-root` when no rate in the band zeroes the NPV, `above-clamp` when the only root is above the band, and `multiple-roots` when several are, with `irrRoots` listing the ones inside and `irrRootAboveBand` flagging one beyond. The retired bisection returned 0 for a flow that never changes sign and for one whose only root is negative, and reported its 102400 percent bracket as a rate.');
w();
w(`The band as irrContract.js declares it: IRR_BAND_LOWER_PCT ${p(IRRK.IRR_BAND_LOWER_PCT)} percent and IRR_BAND_UPPER_PCT ${p(IRRK.IRR_BAND_UPPER_PCT)} percent. Neither edge is ever returned as a rate.`);
w();
w(`The ${G.irr.length} published IRR cases, engine value and the golden\'s own expectation:`);
w();
for (const c of G.irr) {
  const got = E.calculateIRRResult(c.cashFlows);
  w(`- ${c.id}: ${c.note}`);
  w(`  flows ${c.cashFlows.map((x) => x.contractorNCF).join(', ')}; engine ${irrOf(got)}, golden expects ${irrOf(c.expected)}${c.trueIrr !== undefined ? `, the true root is ${p(c.trueIrr)} percent (oracle)` : ''}${c.engine?.disagreement ? `. Disagreement pinned: ${c.engine.disagreement}` : ''}. NPV at 10 percent is ${m(c.npvAt10)}.`);
}
w();
w('Three of these are the retired failure modes. `irr_all_positive_no_sign_change` used to print 0 and is now null with the status no-sign-change. `irr_negative_root_reported` has flows of -100 then 90, loses money at every rate, used to print 0, and now reports its root, -10.0000 percent. `irr_above_clamp_past_old_bracket` has flows of -1 then 2000 and a true rate of 199900 percent; the retired bisection reported 102400 percent, the bracket its doubling reached, and the engine now returns null with the status above-clamp. Section 23 returns to it.');
w();
// -------------------------------------------------------------- Section 17
w('# SECTION 17: The comparison and its summary (owned by Expert m01)');
w();
w('`runFiscalComparison` takes a project and a list of regimes and returns four things: `summary`, one row per regime; `annualCashFlows`, the full ledger per regime; `sensitivityData`, the price and capex sweeps; and `insights`, the derived verdicts. The summary is sorted by contractor NPV descending, so `summary[0]` is the best regime for the contractor and nothing else can be read off the position.');
w();
w('The oracle publishes two columns the engine does not return, `royaltyRate` and `contractorSplit`, so the tier a row selected can be read without deriving it. Every other column is the engine\'s own.');
w();
for (const c of G.comparisons) {
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  w(`**${c.id}**: ${c.note}`);
  w(`Regimes: ${c.regimes.map((g) => `"${g.name}"`).join(', ')}. Discount rate ${c.project.discountRate} percent.`);
  w();
  w('| rank | regime | npv | irr | paybackPeriod | rFactorPayoutYear | govTake | effectiveTaxRate |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  res.summary.forEach((s, i) => w(`| ${i + 1} | ${s.name} | ${m(s.npv)} | ${irrOf(s)} | ${s.paybackPeriod ?? 'null'} | ${s.rFactorPayoutYear ?? 'null'} | ${m(s.govTake)} | ${p(s.effectiveTaxRate)} |`));
  w();
}
w('`effectiveTaxRate` in this table is government take divided by government take plus contractor take, where contractor take has TOTAL CAPEX ADDED BACK. The add-back is what makes it a rate on profit rather than a rate on cash. Section 19 shows the other definition, in the same result object.');
w();
w('`paybackPeriod` is the first year cumulative contractor net cash flow is above zero, and `null` when it never is. `rFactorPayoutYear` is the first year the R factor is above 1.0. They answer different questions and on these cases they often differ, because the R factor is gross revenue over cost while payback is cash after tax and after the government\'s share.');
w();

// -------------------------------------------------------------- Section 18
w('# SECTION 18: The price sweep (owned by Expert m02)');
w();
w('The price sweep runs the whole comparison again at oil prices of 40, 50, 60, 70, 80, 90, 100, 110 and 120 USD per bbl, nine points. It reaches that price by a MULTIPLIER: the price the sweep wants, divided by the FIRST deck point\'s oil price. The multiplier then scales the oil price in every year of the deck, and it scales OIL ONLY. Gas and NGL prices are untouched, so the price sweep is an oil price sweep and a gas-weighted project moves less across it than it looks like it should.');
w();
w('What the sweep plots is an effective tax rate at each price: total government take over total government take plus total contractor net cash flow, WITHOUT the capex add-back.');
w();
w('EVERY POINT CARRIES A STATE (FINDINGS EC2-1, owner decision 2026-09-14). `share` when lifetime profit, government take plus contractor net cash flow, is positive and the share is at most 100 percent; `exceeds` when profit is positive and the share is above 100 percent, with the true value kept; `undefined` when profit is zero or negative, with the value null. Zero is never a fallback. Profit here is revenue less opex less capex, which is the same under every regime at a given price, so a price that is undefined for one regime is undefined for all of them.');
w();
{
  const c = CMP['cmp_all_templates_default_project'];
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  const sw = res.sensitivityData.price;
  w('All six templates on the DEFAULT PROJECT, government share percent at each swept price:');
  w();
  w(`| regime | ${sw.labels.map((x) => `${x} USD/bbl`).join(' | ')} | climb, last minus first (derived) |`);
  w(`| --- | ${sw.labels.map(() => '---').join(' | ')} | --- |`);
  for (const d of sw.data) {
    const name = c.regimes.find((g) => g.id === d.regimeId).name;
    w(`| ${name} | ${d.values.map((v) => p(v)).join(' | ')} | ${p(d.values[d.values.length - 1] - d.values[0])} |`);
  }
  w();
  w(`The nine published price-sweep cases run ONE regime alone on the default project. READ THE NAME CAREFULLY: it is the Designer's own default regime, id 1, "${G.priceSweep[0].regime.name}", and it is NOT the "Nigeria - PIA (2021)" TEMPLATE. Its values are the Designer\'s own sample values and none of them is read from the Act. The Designer regime recovers cost at ${G.priceSweep[0].regime.costRecoveryLimit} percent against the template's ${PIA.costRecoveryLimit} percent of the gross value of crude oil and NGL, splits profit oil ${G.priceSweep[0].regime.profitSplit.tiers.map((t) => `${t.split} percent from R ${t.threshold}`).join(' and ')} against the template's ${splitWords(PIA.profitSplit)}, and charges royalty ${G.priceSweep[0].regime.royalty.tiers.map((t) => `${t.rate} percent from ${t.threshold} USD/bbl`).join(' and ')} against the template's ${royaltyWords(PIA.royalty)}. On the default project the template returns NPV ${m(E.calculateNPV(cf(PIA, DEFAULT_PROJECT), DEFAULT_PROJECT.discountRate))} and the Designer regime ${m(G.priceSweep.find((x) => x.id === 'price_70_pia_default').expected.npv)}. Anything keyed to "the PIA template" on these ${G.priceSweep.length + G.capexSweep.length} sweep cases is mis-keyed.`);
  w();
  w('The nine cases pin the whole result at each price, not only the share:');
  w();
  w('| case | npv | irr | totalContractorNCF | totalGovTake | paybackYear | rFactorPayoutYear | finalUnrecoveredPool |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const x of G.priceSweep) {
    const e = x.expected;
    w(`| ${x.id} | ${m(e.npv)} | ${e.irr === null ? `null${e.irrStatus ? ` (${e.irrStatus})` : ''}` : p(e.irr)} | ${m(e.totalContractorNCF)} | ${m(e.totalGovTake)} | ${e.paybackYear ?? 'null'} | ${e.rFactorPayoutYear ?? 'null'} | ${m(e.finalUnrecoveredPool)} |`);
  }
  w();
}
{
  w('The states, the climb over the whole sweep, the climb over the COMMON SHARE WINDOW the price verdict ranks (Section 21), and the verdict, on three published comparisons:');
  w();
  for (const id of ['cmp_all_templates_default_project', 'cmp_all_templates_test_project', 'cmp_designer_defaults']) {
    const c = CMP[id];
    const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
    const sw = res.sensitivityData.price;
    const n = sw.labels.length;
    const win = E.commonShareWindow(sw.data, n);
    w(`**${id}**, common share window ${win ? `${sw.labels[win.start]} to ${sw.labels[win.end]} USD per bbl, ${win.length} prices` : 'none'}:`);
    w();
    w(`| regime | states at ${sw.labels.join(', ')} | climb, last minus first (derived) | climb over the window (derived) |`);
    w('| --- | --- | --- | --- |');
    for (const d of sw.data) {
      const name = c.regimes.find((g) => g.id === d.regimeId).name;
      const full = d.values[n - 1] === null || d.values[0] === null ? null : d.values[n - 1] - d.values[0];
      const inWin = win ? d.values[win.end] - d.values[win.start] : null;
      w(`| ${name} | ${d.states.join(', ')} | ${full === null ? 'null' : p(full)} | ${inWin === null ? 'null' : p(inWin)} |`);
    }
    w();
    w(`- \`price\`: ${res.insights.find((i) => i.key === 'price').text}`);
    w();
  }
}
w('A regime whose share RISES with price is progressive: it captures the upside. A regime whose share FALLS with price is regressive, and the flat-royalty concessions in this template set are exactly that, because a fixed royalty rate and a fixed tax rate on a growing profit give the government a shrinking fraction once cost recovery has been paid off.');
w();

// -------------------------------------------------------------- Section 19
w('# SECTION 19: The effective tax rate has two values in one result (owned by Expert m02)');
w();
w('This is finding F2 of the oracle. The summary table computes government take over government take plus contractor take WITH total capex added back. The price sensitivity computes the same ratio on the same cash flows WITHOUT the add-back. Both are in the object `runFiscalComparison` returns, and a user comparing the chart\'s point at the base price with the row in the table above it sees two different numbers for one regime.');
w();
for (const id of ['cmp_designer_defaults', 'cmp_all_templates_default_project']) {
  const c = CMP[id];
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  const base = c.project.prices[0].oil;
  const idx = res.sensitivityData.price.labels.indexOf(base);
  w(`**${id}**, at the deck's own first-year price of ${base} USD per bbl (sweep label index ${idx}):`);
  w();
  w('| regime | effectiveTaxRate in the summary table (capex added back) | the price sweep at the same price (no add-back) | difference, percentage points (derived) |');
  w('| --- | --- | --- | --- |');
  for (const s of res.summary) {
    const series = res.sensitivityData.price.data.find((d) => d.regimeId === s.id);
    const chart = idx >= 0 ? series.values[idx] : null;
    w(`| ${s.name} | ${p(s.effectiveTaxRate)} | ${chart === null ? 'null' : p(chart)} | ${chart === null ? 'null' : p(chart - s.effectiveTaxRate)} |`);
  }
  w();
}
w('Neither number is wrong on its own terms. Take over profit and take over cash are both quantities a fiscal analyst uses, and they answer different questions. What is wrong is that one screen labels both of them "effective tax rate" and shows them within a centimetre of each other.');
w();
w('The sweep\'s definition has a second problem that the summary\'s does not, because its denominator can reach zero and go through it. See Section 26.');
w();

// -------------------------------------------------------------- Section 20
w('# SECTION 20: The capex sweep and the point the loop never reaches (owned by Expert m03)');
w();
w('This is finding F1. The capex sweep is written as a for loop from a multiplier of 0.8 to 1.5 in steps of 0.1, and its axis is labelled 0.8 to 1.5. Adding 0.1 to a binary floating point number does not land on 1.5: the accumulated multiplier reaches 1.5000000000000004, which fails the `<= 1.5` test, so the sweep has SEVEN points and its last label reads "1.4".');
w();
{
  const c = CMP['cmp_all_templates_default_project'];
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  const sw = res.sensitivityData.capex;
  w(`The engine returns ${sw.labels.length} labels: ${sw.labels.join(', ')}.`);
  w();
  w('All six templates on the DEFAULT PROJECT, contractor NPV at each swept capex multiplier, and the eighth point the loop never reaches computed by calling the engine directly at a multiplier of 1.5:');
  w();
  w(`| regime | ${sw.labels.map((x) => `x${x}`).join(' | ')} | x1.5, called directly | loss over the SEVEN swept points, 0.8 to 1.4 (derived) | loss over EIGHT points, 0.8 to 1.5 (derived) |`);
  w(`| --- | ${sw.labels.map(() => '---').join(' | ')} | --- | --- | --- |`);
  for (const d of sw.data) {
    const g = c.regimes.find((x) => x.id === d.regimeId);
    const at15 = E.calculateNPV(cf(g, c.project, 1.5, 1), c.project.discountRate);
    w(`| ${g.name} | ${d.values.map((v) => m(v)).join(' | ')} | ${m(at15)} | ${m(d.values[0] - d.values[d.values.length - 1])} | ${m(d.values[0] - at15)} |`);
  }
  w();
  w(`The golden publishes the seven engine points as \`engineCapexPoints\` and the seven engine losses as \`capexLossesAsEngine\`, beside the oracle's eight point sweep, so both are pinned and a silent change to either is caught.`);
  w();
}
w('The seven published capex-sweep cases run the same Designer default regime as the price sweep, id 1, at multipliers of 0.7 to 1.3, and pin the whole result at each. They are NOT the "Nigeria - PIA (2021)" template either:');
w();
w('| case | npv | irr | totalContractorNCF | totalGovTake | paybackYear | rFactorPayoutYear |');
w('| --- | --- | --- | --- | --- | --- | --- |');
for (const x of G.capexSweep) {
  const e = x.expected;
  w(`| ${x.id} | ${m(e.npv)} | ${e.irr === null ? `null${e.irrStatus ? ` (${e.irrStatus})` : ''}` : p(e.irr)} | ${m(e.totalContractorNCF)} | ${m(e.totalGovTake)} | ${e.paybackYear ?? 'null'} | ${e.rFactorPayoutYear ?? 'null'} |`);
}
w();
w('What "resilience to cost overrun" therefore measures is the NPV given up between a 20 percent UNDERSPEND and a 40 percent overrun, not the 50 percent overrun the axis promises. The verdict sentence is not false, it is answering a narrower question than the label on the chart.');
w();

// -------------------------------------------------------------- Section 21
w('# SECTION 21: The derived insights (owned by Expert m04)');
w();
w('`deriveInsights` returns up to five verdicts, keyed `npv`, `payback`, `government`, `capex` and `price`. The function exists because the Insights tab used to state conclusions that nothing had computed: it declared the top-NPV regime to also have the fastest payback, called the second-ranked regime the one that maximises government revenue, and asserted a capex-resilience and a price-response ranking that nothing in the app had worked out. All of them now come from the numbers, and a claim that cannot be supported is omitted rather than guessed.');
w();
w('A small inconsistency worth noticing rather than repeating, because it is in the engine\'s own comment and a lesson quoting the comment would inherit it. The comment says the tab stated "four conclusions of which three were never computed", and then enumerates FOUR uncomputed claims: the payback coupling, the government-revenue claim, the capex-resilience ranking and the price-response ranking. Three does not match four. Do not quote the count; the enumeration is the part that is checkable, and all four of the listed claims are now derived.');
w();
w('Every published insights case, with the sentence the engine returns today:');
w();
for (const c of G.insights) {
  w(`**${c.id}**: ${c.note}`);
  const got = E.deriveInsights(c.summary, c.sensitivityData);
  if (!got.length) { w('  (returns an empty list)'); w(); continue; }
  for (const i of got) w(`  - \`${i.key}\` / ${i.label}: ${i.text}`);
  w();
}
w('THE PRICE VERDICT SINCE EC2-1. It ranks the climb only over the longest run of consecutive swept prices at which EVERY regime\'s point is a share, the later run on a tie, so no climb starts or ends on an `exceeds` point or a null. It names a most progressive regime only when that run has at least three prices and the steepest climb leads the next by at least one percentage point. When the lead climb is not positive it names no progressive regime and calls the leader the least regressive. Otherwise it says no regime can be ranked across the sweep and names the first price at which a regime is economic, or says that none is.');
w();
w('Three shapes are worth naming. When no regime pays back, the payback verdict says so in one sentence rather than reporting a null. When only one regime is compared, the payback and government verdicts drop their comparison clause and the capex and price verdicts are omitted entirely, because a ranking of one is not a ranking. And an empty summary returns an empty list rather than a verdict about nothing.');
w();

// -------------------------------------------------------------- Section 22
w('# SECTION 22: A tie ranked by floating point noise (owned by Expert m04)');
w();
w('This is finding F3. The capex verdict picks its winner with a strict less-than in a reduce, which returns the first element when two are equal and therefore breaks a tie by list order. The price verdict did the same until EC2-1, and now declines to rank when the lead is under one percentage point (Section 21). When the tie is not exact but differs in the fifteenth significant figure, the winner is whichever regime\'s rounding noise happened to be smallest, and the sentence names it with the confidence of a result.');
w();
{
  const c = CMP['cmp_never_recovers'];
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  w(`**cmp_never_recovers**: ${c.note}`);
  w();
  w('| regime | npv | capex sweep first point | capex sweep last point | loss (derived) |');
  w('| --- | --- | --- | --- | --- |');
  for (const d of res.sensitivityData.capex.data) {
    const g = c.regimes.find((x) => x.id === d.regimeId);
    w(`| ${g.name} | ${m(res.summary.find((s) => s.id === d.regimeId).npv)} | ${r(d.values[0])} | ${r(d.values[d.values.length - 1])} | ${r(d.values[0] - d.values[d.values.length - 1])} |`);
  }
  w();
  for (const i of res.insights) w(`- \`${i.key}\`: ${i.text}`);
  w();
  w(`The golden records that the engine names "USA - Gulf of Mexico" as the most resilient here and the oracle's arithmetic names "Brazil - Concession". Neither is a result. The golden therefore carries the ranked quantities, \`capexLossesAsEngine\` and \`priceClimbs\`, and the gate treats a tie as a tie rather than pinning a winner.`);
  w();
  w('AND THE TIE HERE IS EXACT, WHICH IS STRONGER THAN A NEAR TIE, but not for the reason it first looks. The six losses are identical BY CONSTRUCTION because at BOTH ENDS of the sweep every regime recovers cost at its own limit, the pool being far larger than any allowance, so cost recovered, profit oil and tax are unchanged between a multiplier of 0.8 and one of 1.4. Nothing below the capex line moves. The whole capex difference therefore reaches the contractor\'s year 1 line undiluted and is discounted by the same single year, whatever royalty, profit oil and tax each regime carries.');
  w();
  w('The proof, per regime, at the two ends of the swept range:');
  w();
  {
    w('| regime | cost recovered at x0.8 | at x1.4 | profit oil at x0.8 | at x1.4 | tax at x0.8 | at x1.4 | capex loss (derived) |');
    w('| --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const g of c.regimes) {
      const a = totals(cf(g, c.project, 0.8, 1)), b = totals(cf(g, c.project, 1.4, 1));
      const loss = E.calculateNPV(cf(g, c.project, 0.8, 1), c.project.discountRate) - E.calculateNPV(cf(g, c.project, 1.4, 1), c.project.discountRate);
      w(`| ${g.name} | ${m(a.rec)} | ${m(b.rec)} | ${m(a.po)} | ${m(b.po)} | ${m(a.tax)} | ${m(b.tax)} | ${r(loss)} |`);
    }
    w();
  }
  w('READ THE PROFIT OIL COLUMN BEFORE BELIEVING ANY STORY ABOUT IT. It is nought for the three templates that recover cost at 100 percent and it is very much not nought for the other three. Angola carries 3500.5969 of profit oil and 612.6045 of tax on this case, and its royalty is flat 0 percent, so a claim that no profit oil and no tax exist anywhere here is refuted by the government take the same comparison reports. What is true, and is the whole of it, is that none of those columns MOVES across the sweep.');
  w();
  w('The arithmetic closes exactly. The capex difference between the two multipliers is 0.6 of 20000, which is 12000 million USD, spent in year 1 and discounted one year at the project\'s 10 percent rate: 12000 divided by 1.1 is 10909.090909, which is every one of the six losses.');
  w();
  w('The price verdict on the same case declines to rank: every point of every series is null and flagged undefined (Section 26), so there is no climb to compare. An earlier build subtracted the zero it returned there and named a most progressive regime on a climb of 0.0 percentage points.');
  w();
  w('No tie-break rule could be right here. A rule that picks the first, the last, the alphabetically smallest or the largest is picking among six answers that are the same answer. The only correct behaviour is to say so.');
  w();
}
{
  const c = INS['insights_ties'];
  w(`**insights_ties**: ${c.note}`);
  for (const i of E.deriveInsights(c.summary, c.sensitivityData)) w(`  - \`${i.key}\`: ${i.text}`);
  w();
  const c2 = INS['insights_rounding'];
  w(`**insights_rounding**: ${c2.note}`);
  for (const i of E.deriveInsights(c2.summary, c2.sensitivityData)) w(`  - \`${i.key}\`: ${i.text}`);
  w();
}
w('The reading rule that follows: a verdict naming a winner is only a verdict when the quantities it ranks are separated by more than the precision they are printed to. The insight sentences round to one decimal place. Two regimes whose losses print the same to one decimal have not been ranked by the sentence, whatever the sentence says.');
w();

// -------------------------------------------------------------- Section 23
w('# SECTION 23: The IRR that reports its bracket (owned by Expert m05)');
w();
w('This is finding F4, repaired in EC2-5. The retired `calculateIRR` bracketed the root by starting at 100 percent and doubling ten times, reaching 102400 percent. If the NPV was STILL positive there it returned 102400 rather than continuing, and 102400 was printed as an internal rate of return. The repaired function searches the band from -99 to 1000 percent and returns null with the status above-clamp when the only root is above it.');
w();
{
  const c = IRRC['irr_above_clamp_past_old_bracket'];
  const flows = c.cashFlows;
  w(`On the published case ${c.id}, cash flows ${flows.map((x) => x.contractorNCF).join(' then ')}: engine ${irrOf(E.calculateIRRResult(flows))}, oracle root ${p(c.trueIrr)} percent. The retired bisection returned 102400.0000.`);
  w();
  w('The NPV of those flows at a range of rates, all from `calculateNPV`, which is what makes the old bracket visible:');
  w();
  w('| rate percent | NPV |');
  w('| --- | --- |');
  for (const rate of [0, 100, 1600, 25600, 102400, 199900, 400000]) w(`| ${rate} | ${m(E.calculateNPV(flows, rate))} |`);
  w();
  const c2 = IRRC['irr_above_clamp_inside_old_bracket'];
  w(`A root INSIDE the old bracket: ${c2.id}, cash flows ${c2.cashFlows.map((x) => x.contractorNCF).join(' then ')}, oracle root ${p(c2.trueIrr)} percent. The doubling would have reported that root as a rate, because it lies inside 102400. It is above the 1000 percent band, so the engine returns ${irrOf(E.calculateIRRResult(c2.cashFlows))}.`);
  w();
}
w('At real project scale this is a curiosity: no field returns two thousand times its outlay in one year. It matters as a shape. A solver that reported the edge of its own search as an answer was the same failure as the screening engine reporting its 1000 percent Newton clamp, and the tell was identical in both, a suspiciously round number where a rate should be. 102400 is 100 doubled ten times, 1000 was a clamp, and neither is a root. Both engines now share one contract and return null with a status instead.');
w();

// -------------------------------------------------------------- Section 24
w('# SECTION 24: The uplift charged every year, retired (owned by Expert m05)');
w();
w('This was finding F5, repaired in EC2-6 (owner decision 2026-09-15). The retired engine took the RRT base as the contractor profit share MINUS `totalCapex * rrtUpliftPct / 100` in EVERY one of the 25 years, so at the default uplift of 20 percent the relief given over the life was five times the whole capex. The repaired engine opens ONE uplifted pool, total capex times one plus the uplift, and draws it against the profit share in every year that share is positive, the relief being the lesser of the base and what is left of the pool. The pool is never refilled, so relief over the life can never exceed it.');
w();
{
  const base = clone(BRAZIL);
  w(`The "${base.name}" instruments on the DEFAULT PROJECT with the RESOURCE RENT TAX ISOLATED, swept across the uplift. The template's own corporate income tax of ${base.tax.cit} percent is set to ZERO in every row below, so the tax column is the resource rent tax alone at ${base.tax.rrt} percent and nothing else. Section 15 prints the same isolation beside the published stack, and the published stack itself (CIT ${base.tax.cit} and RRT ${base.tax.rrt} together) is in Sections 10 and 11. Do not read these four columns as the regime's:`);
  w();
  w('| rrtUpliftPct | total tax | total contractor NCF | total government take | NPV at 10 percent | first year with a positive RRT charge |');
  w('| --- | --- | --- | --- | --- | --- |');
  for (const up of [0, 5, 10, 20, 30, 50]) {
    const g = { ...clone(base), tax: { ...clone(base.tax), cit: 0, rrtUpliftPct: up }, id: `up_${up}`, name: `uplift ${up}` };
    const rows = cf(g, DEFAULT_PROJECT); const s = totals(rows);
    const firstPos = rows.find((x) => x.tax > 0);
    w(`| ${up} | ${m(s.tax)} | ${m(s.ncf)} | ${m(s.gov)} | ${m(E.calculateNPV(rows, 10))} | ${firstPos ? firstPos.year : 'null'} |`);
  }
  w();
  w(`Total capex on this project is ${m(totals(cf(base, DEFAULT_PROJECT)).capex)} $MM, so a 20 percent uplift opens a pool of 1.2 times that, drawn down once and never refilled. The two published cases pin the default and the override: rrt_uplift_default_20 and rrt_uplift_zero_respected, both in Section 15.`);
  w();
}
w('The point for a reader is the shape under a sweep. Total tax falls by a fixed amount for each point of uplift while the first charged year slides later, which is what a pool looks like. An annual allowance would have cut the tax by far more per point. The only way to know which a parameter is, is to sweep it and watch the tax move.');
w();

// -------------------------------------------------------------- Section 25
w('# SECTION 25: ODIDI under all six templates, end to end (owned by Associate m06, Professional m06 and Expert m06)');
w();
w(`The teaching field, ${projLine(ODIDI)}.`);
w();
w('ODIDI under the PIA template, every column the engine returns, all 25 rows. This is the teaching field worked row by row, and it is the table to rehearse a ledger reading on:');
w();
table(cf(PIA, ODIDI));
w();
{
  const rows = cf(PIA, ODIDI); const t = totals(rows);
  w(`Totals: gross revenue ${m(t.rev)}, royalty ${m(t.roy)}, cost recovered ${m(t.rec)}, profit oil ${m(t.po)}, tax ${m(t.tax)}, opex ${m(t.opex)}, capex ${m(t.capex)}, opex plus capex ${m(t.opex + t.capex)}, contractor net cash flow ${m(t.ncf)}, government take ${m(t.gov)} $MM. Payback is year ${payback(rows) ?? 'null'} and the R factor passes 1.0 in year ${payout(rows) ?? 'null'}.`);
  w();
}
w('And the same field under the concession template, for the contrast the Associate tier is built on:');
w();
table(cf(GOM, ODIDI));
w();
{
  const rows = cf(GOM, ODIDI); const t = totals(rows);
  w(`Totals: gross revenue ${m(t.rev)}, royalty ${m(t.roy)}, cost recovered ${m(t.rec)}, profit oil ${m(t.po)}, tax ${m(t.tax)}, opex ${m(t.opex)}, capex ${m(t.capex)}, opex plus capex ${m(t.opex + t.capex)}, contractor net cash flow ${m(t.ncf)}, government take ${m(t.gov)} $MM. Payback is year ${payback(rows) ?? 'null'} and the R factor passes 1.0 in year ${payout(rows) ?? 'null'}.`);
  w();
}
w('Every template on ODIDI, one line each:');
w();
w('| regime | total revenue | total contractor NCF | total government take | total tax | total cost recovered | closing unrecovered pool | payback year | payout year | NPV at 12 percent | IRR percent |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const t of fiscalTemplates) {
  const g = { id: slug(t.name), name: t.name, ...clone(t.regime) };
  const rows = cf(g, ODIDI); const s = totals(rows);
  w(`| ${t.name} | ${m(s.rev)} | ${m(s.ncf)} | ${m(s.gov)} | ${m(s.tax)} | ${m(s.rec)} | ${m(rows[rows.length - 1].unrecoveredCostPool)} | ${payback(rows) ?? 'null'} | ${payout(rows) ?? 'null'} | ${m(E.calculateNPV(rows, ODIDI.discountRate))} | ${irrRows(rows)} |`);
}
w();
w('And the full comparison on ODIDI, with the sweeps and the verdicts the engine derives:');
w();
{
  const regimes = fiscalTemplates.map((t) => ({ id: slug(t.name), name: t.name, ...clone(t.regime) }));
  const res = await E.runFiscalComparison({ projectInputs: ODIDI, regimes });
  w('| rank | regime | npv | irr | paybackPeriod | rFactorPayoutYear | govTake | effectiveTaxRate |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  res.summary.forEach((s, i) => w(`| ${i + 1} | ${s.name} | ${m(s.npv)} | ${irrOf(s)} | ${s.paybackPeriod ?? 'null'} | ${s.rFactorPayoutYear ?? 'null'} | ${m(s.govTake)} | ${p(s.effectiveTaxRate)} |`));
  w();
  w(`Price sweep, government share percent at ${res.sensitivityData.price.labels.join(', ')} USD per bbl:`);
  w();
  w(`| regime | ${res.sensitivityData.price.labels.map((x) => `${x}`).join(' | ')} | climb (derived) |`);
  w(`| --- | ${res.sensitivityData.price.labels.map(() => '---').join(' | ')} | --- |`);
  for (const d of res.sensitivityData.price.data) {
    const g = regimes.find((x) => x.id === d.regimeId);
    w(`| ${g.name} | ${d.values.map((v) => p(v)).join(' | ')} | ${p(d.values[d.values.length - 1] - d.values[0])} |`);
  }
  w();
  w(`Capex sweep, contractor NPV at multipliers ${res.sensitivityData.capex.labels.join(', ')}:`);
  w();
  w(`| regime | ${res.sensitivityData.capex.labels.map((x) => `x${x}`).join(' | ')} | loss over the swept points (derived) |`);
  w(`| --- | ${res.sensitivityData.capex.labels.map(() => '---').join(' | ')} | --- |`);
  for (const d of res.sensitivityData.capex.data) {
    const g = regimes.find((x) => x.id === d.regimeId);
    w(`| ${g.name} | ${d.values.map((v) => m(v)).join(' | ')} | ${m(d.values[0] - d.values[d.values.length - 1])} |`);
  }
  w();
  for (const i of res.insights) w(`- \`${i.key}\` / ${i.label}: ${i.text}`);
  w();
}
w('Under the PIA template ODIDI\'s royalty by price starts inside the life of the field, in the year the deck lifts the oil price above that year\'s low benchmark, which none of the published template cases shows; Section 12 prints it year by year.');
w();

// -------------------------------------------------------------- Section 26
w('# SECTION 26: The government share curve carries three states (owned by Expert m02 and Expert m05)');
w();
w('The price sweep divides total government take by total government take plus total contractor net cash flow. An earlier build guarded that division with `totalProfit > 0` and returned EXACTLY 0 when the guard failed, which this course found (FINDINGS EC2-1). Since the owner decision of 2026-09-14 every point says what it is, and zero is never a fallback.');
w();
w('Three states live on one curve.');
w();
w('1. `share`. Profit is positive and the number is a share, between 0 and 100.');
w('2. `exceeds`. Profit is small and positive because the contractor is losing money while the government still collects, and the ratio goes ABOVE 100 percent. The true value is returned. A government share of several hundred percent is arithmetic, not a fiscal term.');
w('3. `undefined`. Profit is zero or negative, there is no share, and the value is null.');
w();
w('The third case, on the published comparison built for it:');
w();
{
  const c = CMP['cmp_never_recovers'];
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  w(`**cmp_never_recovers**: ${c.note} Capex is ${m(c.project.costs.capex.drilling)} drilling plus ${m(c.project.costs.capex.facilities)} facilities plus ${m(c.project.costs.capex.subsea)} subsea $MM. The production is the TEST PROJECT's, ${c.project.production.oil.initial} bbl/d of oil declining ${c.project.production.oil.decline} percent with no gas and no NGL, not the default project's three streams.`);
  w();
  w('| regime | total government take | total contractor NCF | the two added (derived) | value and state the sweep returns, at every one of the nine prices |');
  w('| --- | --- | --- | --- | --- |');
  for (const g of c.regimes) {
    const rows = cf(g, c.project);
    const t = totals(rows);
    const d = res.sensitivityData.price.data.find((x) => x.regimeId === g.id);
    const distinct = [...new Set(d.values.map((x, i) => `${p(x)} ${d.states[i]}`))];
    w(`| ${g.name} | ${m(t.gov)} | ${m(t.ncf)} | ${m(t.gov + t.ncf)} | ${distinct.join(', ')} |`);
  }
  w();
}
w('Every regime on that comparison returns null and the state undefined across the whole sweep, and each of them collected hundreds or thousands of millions of dollars for the government. The earlier build drew those points as 0.00 percent, on the same axis and in the same colour as a zero that would mean "the government took nothing".');
w();
w('The second case, reached by making the same project progressively more expensive. The Angola template on the DEFAULT PROJECT with every capex line multiplied, so nothing but the capital cost changes:');
w();
{
  const g = { ...clone(ANGOLA) };
  const states = [];
  w('| capex multiple | 40 | 50 | 60 | 70 | 80 | 90 | 100 | 110 | 120 |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const mult of [1, 2, 3, 4]) {
    const pr = clone(DEFAULT_PROJECT);
    pr.costs.capex.drilling *= mult; pr.costs.capex.facilities *= mult; pr.costs.capex.subsea *= mult;
    const res = await E.runFiscalComparison({ projectInputs: pr, regimes: [g] });
    w(`| x${mult} | ${res.sensitivityData.price.data[0].values.map((v) => p(v)).join(' | ')} |`);
    states.push([mult, res.sensitivityData.price.data[0].states]);
  }
  w();
  w('| capex multiple | states at 40 to 120 USD per bbl |');
  w('| --- | --- |');
  for (const [mult, st] of states) w(`| x${mult} | ${st.join(', ')} |`);
  w();
}
w('Read the x3 row along its length. It is null and undefined at 40 USD per bbl, exceeds at 50 with a number in the thousands and at 60 with one in the hundreds, and a share from 70 onward. Three states on one line of one chart, each now flagged. The earlier build drew 0.00 at 40 with no flag on any point, and an earlier draft of this section put the first share at 80 when the 70 point is already one.');
w();
w('The rule a reader needs. Before believing a point on this curve, read its state and the two totals underneath it. If contractor net cash flow over the life is negative, the point is above 100 percent and flagged exceeds. If it is negative enough to outweigh the government take, the point is null and flagged undefined, and there is no share to quote. The course explorer breaks the line at an undefined price, shades that band as uneconomic, and pins an exceeds point to the top of the axis with its true value in the tooltip, so it never sets the scale.');
w();

// -------------------------------------------------------------- Section 27
w('# SECTION 27: The payback verdict restates the NPV ranking whenever payback ties (owned by Expert m04)');
w();
w('Payback in this engine is an INTEGER year, the first year cumulative contractor net cash flow is above zero. Integers tie. On the Designer default project with all six templates loaded, most of the six pay back in the same year, and the verdict names one of them as though it had won.');
w();
{
  const c = CMP['cmp_all_templates_default_project'];
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  w('| position in the summary (NPV descending) | regime | npv | paybackPeriod |');
  w('| --- | --- | --- | --- |');
  res.summary.forEach((x, i) => w(`| ${i + 1} | ${x.name} | ${m(x.npv)} | ${x.paybackPeriod ?? 'null'} |`));
  w();
  const pb = res.insights.find((i) => i.key === 'payback');
  w(`The verdict the engine returns: ${pb.text}`);
  w();
  const byYear = {}; res.summary.forEach((x) => { byYear[x.paybackPeriod] = (byYear[x.paybackPeriod] || 0) + 1; });
  const ys = Object.keys(byYear).map(Number).sort((a, b) => a - b);
  const words = ['none', 'one', 'two', 'three', 'four', 'five', 'six'];
  w(`Read it against the table. ${ys.map((y, i) => `${i === 0 ? words[byYear[y]].replace(/^./, (ch) => ch.toUpperCase()) : words[byYear[y]]} regime${byYear[y] === 1 ? '' : 's'} pay${byYear[y] === 1 ? 's' : ''} back in year ${y}`).join(' and ')}, so "fastest capital recovery" has a ${words[byYear[ys[0]]]}-way tie at the top.`);
  w();
}
w('The regime the sentence names is the first of the tied regimes in summary order, and the summary is sorted by contractor NPV, so on any project where payback ties the payback verdict names WHICHEVER REGIME HAS THE HIGHEST NPV. It is the NPV ranking wearing a different label.');
w();
w('That is the exact claim `deriveInsights` was written to eliminate. The function exists because the Insights tab used to declare the top-NPV regime to also have the fastest payback, among three other conclusions nothing had computed. The payback verdict now genuinely reads the payback column, and it still lands on the top-NPV regime every time the column ties, because a strict less-than in a reduce keeps the first element it saw and the first element it saw is the NPV winner.');
w();
w('The capex and price verdicts have the same reduce and the same tie behaviour, and the golden records a case where the engine and the oracle name different winners on quantities that differ in the fifteenth figure. The payback verdict differs in one way that makes it worse rather than better: those two rank continuous quantities, where an exact tie is rare and a near-tie is the hazard, while THIS one ranks a small integer, where an exact tie is the normal case.');
w();
{
  const c = CMP['cmp_all_templates_test_project'];
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  const pb = res.insights.find((i) => i.key === 'payback');
  const years = res.summary.map((x) => x.paybackPeriod);
  w(`The same six templates on the TEST PROJECT pay back in years ${years.join(', ')} reading down the summary, and the verdict reads: ${pb.text}`);
  w();
  const c2 = CMP['cmp_designer_defaults'];
  const res2 = await E.runFiscalComparison({ projectInputs: c2.project, regimes: c2.regimes });
  const pb2 = res2.insights.find((i) => i.key === 'payback');
  w(`On the Designer's own two default regimes the two payback years differ, ${res2.summary.map((x) => `${x.name} year ${x.paybackPeriod}`).join(' and ')}, so there the verdict is a real ranking: ${pb2.text}`);
  w();
}
w('THE SAME THING HAPPENS ON THE TEACHING FIELD, which matters because ODIDI is where every tier rehearses a reading.');
w();
{
  const regimes = fiscalTemplates.map((t) => ({ id: slug(t.name), name: t.name, ...clone(t.regime) }));
  const res = await E.runFiscalComparison({ projectInputs: ODIDI, regimes });
  w('| position in the summary (NPV descending) | regime | npv | paybackPeriod |');
  w('| --- | --- | --- | --- |');
  res.summary.forEach((x, i) => w(`| ${i + 1} | ${x.name} | ${m(x.npv)} | ${x.paybackPeriod ?? 'null'} |`));
  w();
  const pb = res.insights.find((i) => i.key === 'payback');
  w(`The verdict: ${pb.text}`);
  w();
  const years = res.summary.map((x) => x.paybackPeriod).filter((y) => y !== null);
  const fastest = Math.min(...years);
  const tied = res.summary.filter((x) => x.paybackPeriod === fastest).map((x) => x.name);
  w(`${tied.length} regimes pay back in year ${fastest} on ODIDI: ${tied.join(', ')}. The verdict names one of them.`);
  w();
}
w('And notice the SECOND name in every one of these sentences. It is not the runner-up. The function picks the fastest, removes it, and then takes the MAXIMUM of what is left, so the second regime named is the SLOWEST of the rest. A sentence of the form "A pays back in year x, against year y for B" reads like a top two and is a top and a bottom, with everything else silently in between.');
w();
w('The reading rule. A verdict that names a winner on an INTEGER quantity is only a ranking when you have checked the column for ties, and the column is in the summary table two centimetres away. Where it ties, the sentence is telling you about NPV. And the two regimes a payback sentence names are the extremes, never a ranking of two.');
w();
w('One more thing to notice in the sentences above, and it is a copy defect rather than an arithmetic one. The engine formats money inside its verdict strings with a dollar sign and an MM unit (the capex and government verdicts on the published comparisons print that way). Every other number in this course is written as millions of USD in words, because the owner copy rule forbids the dollar sign and the MM unit in user-facing text. A panel that prints an insight sentence verbatim, which is the only honest way to show what the engine said, puts that formatting on the screen. Recorded in the wave FINDINGS.md as EC2-6.');
w();

w('# SECTION 28: Government take and government share of net revenue, the two named metrics (owned by Expert m01, m02 and m05)');
w();
w('Owner decision, naming wave 2026-09-14. The two ratios this engine returns now carry two names and one shared definition module, engines/economics/fiscalConventions.js. GOVERNMENT TAKE is the headline: government cash flow divided by revenue less opex less capex, which is government cash flow over government cash flow plus contractor net cash flow. GOVERNMENT SHARE OF NET REVENUE is second: government cash flow divided by revenue less opex, the capex added back. Government cash flow is royalty plus the government share of profit oil plus tax. No computation changed: undiscounted, government take is the price sweep ratio at the deck price and government share of net revenue is the summary legacy key `effectiveTaxRate`. The summary now also returns government take discounted at the project rate, every year discounted at year end first.');
w();
w('THE RATIO OF THE TWO IS A PROPERTY OF THE PROJECT. Revenue less opex (NR) and capex (C) do not depend on the regime, so government take divided by government share of net revenue is NR / (NR - C) for EVERY regime on one project, and the gap in percentage points is government share of net revenue times C / (NR - C).');
w();
for (const id of ['cmp_designer_defaults', 'cmp_all_templates_default_project', 'cmp_all_templates_test_project']) {
  const c = CMP[id];
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  const capex = c.project.costs.capex.drilling + c.project.costs.capex.facilities + c.project.costs.capex.subsea;
  const rows0 = res.annualCashFlows[0].data;
  const nr = rows0.reduce((t, x) => t + x.governmentTake + x.contractorNCF, 0) + capex;
  w(`**${id}**: total capex ${m(capex)}, revenue less opex ${m(nr)} on every regime, pre-take net cash flow ${m(nr - capex)}, NR / (NR - C) ${r(nr / (nr - capex))} (derived), discount rate ${c.project.discountRate} percent.`);
  w();
  w(`| regime | government cash flow | royalty | royalty share of government cash flow, percent (derived) | government take, undiscounted | state | government take, discounted at ${c.project.discountRate} percent | state | government share of net revenue, undiscounted | take minus share, percentage points (derived) | take over share (derived) |`);
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const s of res.summary) {
    const led = res.annualCashFlows.find((a) => a.regimeId === s.id).data;
    const roy = led.reduce((t, x) => t + x.royalty, 0);
    const gap = s.governmentTakePct === null || s.governmentShareOfNetRevenuePct === null ? null : s.governmentTakePct - s.governmentShareOfNetRevenuePct;
    const ratio = s.governmentTakePct === null || !s.governmentShareOfNetRevenuePct ? null : s.governmentTakePct / s.governmentShareOfNetRevenuePct;
    w(`| ${s.name} | ${m(s.govTake)} | ${m(roy)} | ${p(s.govTake > 0 ? (roy / s.govTake) * 100 : null)} | ${p(s.governmentTakePct)} | ${s.governmentTakeState} | ${p(s.governmentTakeDiscountedPct)} | ${s.governmentTakeDiscountedState} | ${p(s.governmentShareOfNetRevenuePct)} | ${p(gap)} | ${r(ratio)} |`);
  }
  w();
}
w('WHERE PROFIT DISAPPEARS, ONLY THE SECOND METRIC IS READABLE. On the published comparison with capex of 20000 the pre-take net cash flow is negative, so government take is undefined (null) for every regime, undiscounted and discounted. Government share of net revenue still has a positive denominator. The regimes whose government cash flow is all royalty collect it regardless of profit:');
w();
{
  const c = CMP['cmp_never_recovers'];
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  w('| regime | government cash flow | royalty share of government cash flow, percent (derived) | government take, undiscounted | state | government take, discounted | state | government share of net revenue, undiscounted |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const s of res.summary) {
    const led = res.annualCashFlows.find((a) => a.regimeId === s.id).data;
    const roy = led.reduce((t, x) => t + x.royalty, 0);
    w(`| ${s.name} | ${m(s.govTake)} | ${p((roy / s.govTake) * 100)} | ${p(s.governmentTakePct)} | ${s.governmentTakeState} | ${p(s.governmentTakeDiscountedPct)} | ${s.governmentTakeDiscountedState} | ${p(s.governmentShareOfNetRevenuePct)} |`);
  }
  w();
}
{
  const c = CMP['cmp_angola_capex_x3'];
  const res = await E.runFiscalComparison({ projectInputs: c.project, regimes: c.regimes });
  const s = res.summary[0];
  w(`**cmp_angola_capex_x3**: ${s.name} returns government take ${p(s.governmentTakePct)} (${s.governmentTakeState}) undiscounted and ${p(s.governmentTakeDiscountedPct)} (${s.governmentTakeDiscountedState}) discounted at ${c.project.discountRate} percent, and government share of net revenue ${p(s.governmentShareOfNetRevenuePct)}. Discounting weighs the year 1 capex more heavily than the later cash, so the discounted pre-take net cash flow is not positive and the discounted take has no value.`);
  w();
}
{
  const regimes = fiscalTemplates.map((t) => ({ id: slug(t.name), name: t.name, ...clone(t.regime) }));
  const res = await E.runFiscalComparison({ projectInputs: ODIDI, regimes });
  w(`**ODIDI** (discount rate ${ODIDI.discountRate} percent), the teaching field:`);
  w();
  w(`| regime | government cash flow | government take, undiscounted | state | government take, discounted at ${ODIDI.discountRate} percent | state | government share of net revenue, undiscounted | take over share (derived) |`);
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const s of res.summary) {
    const ratio = s.governmentTakePct === null || !s.governmentShareOfNetRevenuePct ? null : s.governmentTakePct / s.governmentShareOfNetRevenuePct;
    w(`| ${s.name} | ${m(s.govTake)} | ${p(s.governmentTakePct)} | ${s.governmentTakeState} | ${p(s.governmentTakeDiscountedPct)} | ${s.governmentTakeDiscountedState} | ${p(s.governmentShareOfNetRevenuePct)} | ${r(ratio)} |`);
  }
  w();
}
w('The reading rule. Quote either metric with its name and its basis. On one project the two differ by a fixed factor, so the gap in points grows with the share itself and never with the regime design as such. A royalty-heavy regime matters when profit is thin: its government cash flow does not wait for profit, so government take runs above 100 percent or has no value while government share of net revenue stays readable.');
w();

console.log(out.join('\n'));
