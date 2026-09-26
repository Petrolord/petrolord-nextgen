// Teaching lab for EC2, Fiscal Regime Design. The three panels, the lessons
// and the vitest file all read this one module, so a number shown to a learner
// and a number a test pins cannot drift apart.
//
// EVERYTHING HERE IS THE VENDORED ENGINE'S OWN OUTPUT. Every ledger row, every
// sweep point, every summary, every verdict sentence below is a return value
// of engines/economics/fiscalRegime.js (the fiscal regime sandbox, extracted
// verbatim from the Suite's fiscalDesignerCalculations.js in the EC0 wave)
// with its templates in engines/economics/fiscalTemplates.js. It is plain
// JavaScript, so unlike EC1 there is no TypeScript resolution question here.
//
// NOTHING IN THIS FILE COMPUTES AN ECONOMIC QUANTITY. Where a reader carries a
// column the digest calls "derived", it is a ratio or a difference of two
// numbers the engine returned on the SAME row or in the same result object,
// printed beside them, and it is labelled as derived in the reader's own key
// name. The lab and /root/ec-wip-fiscal/digest.txt agree because both call the
// engine on the same inputs, not because either copied the other.
//
// UNITS. Money is millions of United States dollars, which the engine's own
// labels write as $MM. Volumes are bbl and Mscf; barrels of oil equivalent
// convert gas at 6000 scf per barrel. Rates are percent, except the R factor
// and the implied rate and split columns, which are ratios. A row is a year
// and the horizon is fixed at 25 years.
//
// PURITY. Every function here is pure and deterministic. There is no random
// number anywhere in this module and nothing is memoised, so two calls with
// the same arguments return the same numbers in the same order. The readers
// that wrap runFiscalComparison are async because THE ENGINE'S OWN
// runFiscalComparison is declared async; they await it and return its result.

import golden from '@petrolord/engines/test-data/economics/goldens/fiscal_cases.json';
import {
  calculateNPV, calculateIRR, calculateIRRResult, calculateCashFlowForRegime, deriveInsights, runFiscalComparison,
  GOVERNMENT_SHARE_STATES, commonShareWindow,
} from '@petrolord/engines/engines/economics/fiscalRegime.js';
import { fiscalTemplates } from '@petrolord/engines/engines/economics/fiscalTemplates.js';

export {
  calculateNPV, calculateIRR, calculateCashFlowForRegime, deriveInsights, runFiscalComparison,
  fiscalTemplates,
};

// ---------------------------------------------------------------------------
// The published goldens.
// ---------------------------------------------------------------------------

export const GOLDEN_DESCRIPTION = golden.description;

/**
 * A published case WITHOUT its `expected` block. The golden's expectations are
 * the ORACLE's pinned answers, not the engine's return values, and this lab's
 * contract is that every value it hands out is a return value of the engine.
 * The published expectations that the digest does print, the price and capex
 * sweep headlines, are read straight off the golden by their own readers below
 * and are labelled as published there.
 */
const strip = (c) => { const { expected, ...rest } = c; return rest; };

// COURSE LABELS IN THREE GOLDEN NOTES, exactly as the digest prints them. The
// golden's notes call the tiered teaching regime's tranches "the Nigeria PIA
// tranches" and the Designer's sample PSC regime's royalty "the Designer's
// default PIA sliding royalty". Neither regime is the Act, so the notes are
// relabelled here and every number in them is untouched.
export const NOTE_LABELS = [
  ['The Nigeria PIA tranches', "The tiered teaching regime's tranches"],
  ['the Nigeria PIA tranches', "the tiered teaching regime's tranches"],
  ["the Designer's default PIA sliding royalty", "the Designer's sample PSC regime's sliding royalty"],
];
const relabel = (note) => NOTE_LABELS.reduce((t, [a, b]) => t.split(a).join(b), note);
const CASHFLOW = golden.cashflow.map((c) => ({ ...c, note: relabel(c.note) }));
const CASE = Object.fromEntries(CASHFLOW.map((c) => [c.id, strip(c)]));
const CMP = Object.fromEntries(golden.comparisons.map((c) => [c.id, strip(c)]));
const INS = Object.fromEntries(golden.insights.map((c) => [c.id, strip(c)]));
const IRRC = Object.fromEntries(golden.irr.map((c) => [c.id, c]));

export const goldenCounts = () => ({
  cashflow: golden.cashflow.length,
  comparisons: golden.comparisons.length,
  insights: golden.insights.length,
  irr: golden.irr.length,
  priceSweep: golden.priceSweep.length,
  capexSweep: golden.capexSweep.length,
});

export const goldenCase = (id) => {
  const c = CASE[id];
  if (!c) throw new Error(`no published cash flow case named ${id}`);
  return c;
};
export const goldenComparison = (id) => {
  const c = CMP[id];
  if (!c) throw new Error(`no published comparison named ${id}`);
  return c;
};
export const goldenInsightsCase = (id) => {
  const c = INS[id];
  if (!c) throw new Error(`no published insights case named ${id}`);
  return c;
};

export const goldenCaseIds = () => golden.cashflow.map((c) => c.id);
export const goldenComparisonIds = () => golden.comparisons.map((c) => c.id);
export const goldenInsightsIds = () => golden.insights.map((c) => c.id);
export const goldenIrrIds = () => golden.irr.map((c) => c.id);

// ---------------------------------------------------------------------------
// Helpers. Pure, and none of them computes an economic quantity.
// ---------------------------------------------------------------------------

const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * The Suite assigns a template's id by slugging its name; the goldens use the
 * same rule, one underscore per non-alphanumeric character, trailing ones
 * stripped ("USA - Gulf of Mexico" becomes "usa___gulf_of_mexico").
 */
export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');

const cf = (regime, project, capexMultiplier = 1, priceMultiplier = 1) =>
  calculateCashFlowForRegime(regime, project, capexMultiplier, priceMultiplier);

/** Sums of the engine's own columns. Not an economic quantity: a column total. */
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

const paybackYear = (rows) => { const y = rows.find((x) => x.cumulativeNCF > 0); return y ? y.year : null; };
const payoutYear = (rows) => { const y = rows.find((x) => x.rFactor > 1.0); return y ? y.year : null; };

/** The regime a published case carries, given the id the golden gave it. */
const caseRegime = (c) => ({ id: c.regime.id, name: c.regime.name, ...clone(c.regime) });
const runCase = (c) => cf(caseRegime(c), c.project, c.capexMultiplier ?? 1, c.priceMultiplier ?? 1);

/** The engine's own ledger column order, as the ledger cascades. */
export const LEDGER_COLUMNS = [
  'year', 'grossRevenue', 'royalty', 'costRecovered', 'unrecoveredCostPool', 'profitOil',
  'tax', 'opex', 'capex', 'contractorNCF', 'governmentTake', 'cumulativeNCF', 'rFactor',
];

/** One line of prose for a project, exactly as the digest words it. */
export const projectLine = (pr) => `oil ${pr.production.oil.initial} bbl/d declining ${pr.production.oil.decline} percent a year, gas ${pr.production.gas.initial} Mscf/d declining ${pr.production.gas.decline} percent, NGL ${pr.production.ngl.initial} bbl/d declining ${pr.production.ngl.decline} percent; capex drilling ${pr.costs.capex.drilling}, facilities ${pr.costs.capex.facilities}, subsea ${pr.costs.capex.subsea} $MM; opex fixed ${pr.costs.opex.fixed} $MM a year and variable ${pr.costs.opex.variable} USD per boe; discount rate ${pr.discountRate} percent; price deck ${pr.prices.map((q) => `year ${q.year}: oil ${q.oil}, gas ${q.gas}, NGL ${q.ngl}`).join('; ')}`;

/** One line of prose for a regime, exactly as the digest words it. */
const royaltyWords = (y) => (y.type === 'flat' ? `flat ${y.rate} percent`
  : y.type === 'pia_2021' ? `PIA 2021 royalty (type pia_2021): production royalty by terrain ${y.terrain} and daily rate, royalty by price on the ${y.priceRoyaltyBase ?? 'regulations_2021'} benchmarks with project year 1 in calendar ${y.firstCalendarYear}, gas and NGL at the gas rate with ${y.gasInCountrySharePct ?? 0} percent used in-country`
    : `sliding on price, tiers ${y.tiers.map((t) => `${t.threshold} USD/bbl -> ${t.rate} percent`).join(', ')}`);
const splitWords = (p) => (p.type === 'flat' ? `flat ${p.split} percent to the contractor`
  : p.type === 'pia_cumulative_production' ? `government minimum profit oil by cumulative crude oil at the start of the year (type pia_cumulative_production), ${p.tiers.map((t, i) => `${t.upToMMbbl === null ? `above ${p.tiers[i - 1].upToMMbbl}` : `to ${t.upToMMbbl}`} million bbl -> government ${t.governmentPct} percent`).join(', ')}`
    : `tiered on the R factor, ${p.tiers.map((t) => `R ${t.threshold} -> ${t.split} percent`).join(', ')}`);
export const regimeLine = (g) => `royalty ${royaltyWords(g.royalty)}; cost recovery limit ${g.costRecoveryLimit} percent of ${g.costRecoveryBase === 'liquids_gross' ? 'the gross value of crude oil and NGL (costRecoveryBase liquids_gross)' : 'revenue after royalty'}; profit split ${splitWords(g.profitSplit)}; CIT ${g.tax.cit} percent, RRT ${g.tax.rrt} percent, minimum tax ${g.tax.minTax} percent${g.tax.rrtUpliftPct === undefined ? '' : `, RRT uplift ${g.tax.rrtUpliftPct} percent`}`;

// ---------------------------------------------------------------------------
// SECTION 2. The three projects, and the six regimes.
//
// The Designer's DEFAULT PROJECT and TEST PROJECT are taken FROM THE GOLDEN
// rather than retyped: every template case carries the one it was run on. The
// teaching field ODIDI is this course's own, copied verbatim from the digest
// builder so the digest and this lab agree.
// ---------------------------------------------------------------------------

export const DEFAULT_PROJECT = clone(goldenCase('template_nigeria___pia__2021_default_project').project);
export const TEST_PROJECT = clone(goldenCase('template_nigeria___pia__2021_test_project').project);

/**
 * THE TEACHING FIELD, ODIDI. Designed for this course. It is not a golden case
 * and it is not graded anywhere. Its deck deliberately crosses the tiered
 * teaching regime's 50 USD/bbl royalty threshold between year 5 and year 6, which is the one thing no published
 * case does on a template.
 */
export const ODIDI = {
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

export const ODIDI_LABEL = 'ODIDI';

export const PROJECT_KEYS = ['default', 'test', 'odidi'];
export const PROJECT_LABELS = {
  default: 'DEFAULT PROJECT, the Designer\'s own defaults, published',
  test: 'TEST PROJECT, published',
  odidi: 'ODIDI, this course\'s teaching field',
};

const PROJECTS = { default: DEFAULT_PROJECT, test: TEST_PROJECT, odidi: ODIDI };

export const project = (key) => {
  const p = PROJECTS[key];
  if (!p) throw new Error(`no project named ${key}; the projects are ${PROJECT_KEYS.join(', ')}`);
  return clone(p);
};

/** The three projects with the digest's own one-line description of each. */
export const projects = () => PROJECT_KEYS.map((key) => ({
  key, label: PROJECT_LABELS[key], line: projectLine(project(key)), discountRate: project(key).discountRate,
}));

const REGIME = Object.fromEntries(
  fiscalTemplates.map((t) => [slug(t.name), { id: slug(t.name), name: t.name, ...clone(t.regime) }]));

export const REGIME_IDS = fiscalTemplates.map((t) => slug(t.name));

export const regime = (id) => {
  const g = REGIME[id];
  if (!g) throw new Error(`no template regime named ${id}; the templates are ${REGIME_IDS.join(', ')}`);
  return clone(g);
};

const PIA = () => regime('nigeria___pia__2021');
const GOM = () => regime('usa___gulf_of_mexico');
const GENERIC = () => regime('generic_royalty_tax');
const ANGOLA = () => regime('angola___deepwater_psc');
const BRAZIL = () => regime('brazil___concession');

/**
 * THE TIERED TEACHING REGIME, value for value the digest's. A regime of this
 * course carrying no country's values: a two-tier sliding royalty (7.5 percent
 * from 0, 10 percent from 50 USD/bbl), cost recovery to 80 percent of revenue
 * after royalty, and three R-factor tranches (60 percent from R 1.0, 40 from
 * 1.6, 30 from 2.5), CIT 30. The sliding royalty and the R-factor split are
 * taught on it, because none of the six templates carries either with a step
 * inside the teaching field's life.
 */
export const TIERED_REGIME = Object.freeze({
  id: 'tiered_teaching', name: 'Tiered teaching regime',
  royalty: { type: 'sliding_price', tiers: [{ threshold: 0, rate: 7.5 }, { threshold: 50, rate: 10 }] },
  tax: { cit: 30, rrt: 0, minTax: 0 },
  costRecoveryLimit: 80,
  profitSplit: { type: 'tiered_r_factor', tiers: [{ threshold: 1.0, split: 60 }, { threshold: 1.6, split: 40 }, { threshold: 2.5, split: 30 }] },
});
const TIERED = () => clone(TIERED_REGIME);

// ---------------------------------------------------------------------------
// SECTION 7. The six templates as data.
// ---------------------------------------------------------------------------

/**
 * The six templates with the ids the goldens slug them by, each with its
 * royalty, cost recovery limit, profit split and tax stack, and the template's
 * own description.
 */
export const templates = () => fiscalTemplates.map((t) => {
  const g = { id: slug(t.name), name: t.name, ...clone(t.regime) };
  return {
    id: g.id,
    name: t.name,
    description: t.description,
    line: regimeLine(g),
    royalty: g.royalty,
    royaltyType: g.royalty.type,
    costRecoveryLimit: g.costRecoveryLimit,
    profitSplit: g.profitSplit,
    profitSplitType: g.profitSplit.type,
    tax: g.tax,
    rrtUpliftPct: g.tax.rrtUpliftPct ?? null,
    regime: g,
  };
});

// ---------------------------------------------------------------------------
// SECTION 1 and SECTION 8. The ledger.
// ---------------------------------------------------------------------------

/**
 * The full return of calculateCashFlowForRegime, with the column totals, the
 * payback year and the payout year read off the same rows.
 */
export const ledger = (regimeId, projectKey, capexMultiplier = 1, priceMultiplier = 1) => {
  const g = regime(regimeId);
  const pr = project(projectKey);
  const rows = cf(g, pr, capexMultiplier, priceMultiplier);
  const t = totals(rows);
  return {
    regimeId, regimeName: g.name, regimeLine: regimeLine(g), projectKey, capexMultiplier, priceMultiplier,
    rows,
    rowCount: rows.length,
    totals: t,
    paybackYear: paybackYear(rows),
    payoutYear: payoutYear(rows),
    closingUnrecoveredPool: rows[rows.length - 1].unrecoveredCostPool,
    npv: calculateNPV(rows, pr.discountRate),
    irrPct: calculateIRR(rows),
    discountRatePct: pr.discountRate,
  };
};

/** PROJECT_LIFE, read out of the engine rather than restated. */
export const projectLife = () => cf(GOM(), DEFAULT_PROJECT).length;

/**
 * The concession ledger the digest walks end to end, with the year 1 identity
 * that closes it. Every term is a column the engine returned on that row.
 */
export const concessionLedger = () => {
  const led = ledger('usa___gulf_of_mexico', 'default');
  const y1 = led.rows[0];
  return {
    ...led,
    identityYear1: {
      year: y1.year,
      costRecovered: y1.costRecovered,
      tax: y1.tax,
      opex: y1.opex,
      capex: y1.capex,
      contractorNCF: y1.contractorNCF,
      royalty: y1.royalty,
      governmentTake: y1.governmentTake,
      profitOil: y1.profitOil,
    },
  };
};

// ---------------------------------------------------------------------------
// SECTION 3 and SECTION 4. The probes.
//
// generateProductionProfile and getPriceForYear are not exported, so the
// volumes and the applied prices are read back OUT of the engine by running a
// regime that takes nothing.
// ---------------------------------------------------------------------------

/**
 * THE PROBE REGIME. Royalty zero, cost recovery limit 100, a flat 100 percent
 * contractor split and every tax at zero, so grossRevenue passes through
 * untouched by any instrument.
 */
export const PROBE_REGIME = {
  id: 'probe', name: 'probe',
  royalty: { type: 'flat', rate: 0 },
  costRecoveryLimit: 100,
  profitSplit: { type: 'flat', split: 100 },
  tax: { cit: 0, rrt: 0, minTax: 0 },
};

/**
 * THE VOLUME PROBE, Section 3. Two of the three streams are zeroed and the
 * surviving stream is priced at 1.0 in every deck point, so the grossRevenue
 * the engine returns IS that stream's annual volume divided by one million.
 * The oil and NGL columns are therefore million bbl and the gas column is
 * million Mscf.
 */
export const volumeProbe = (projectKey) => {
  const stream = (name) => {
    const pr = project(projectKey);
    for (const s of ['oil', 'gas', 'ngl']) if (s !== name) pr.production[s].initial = 0;
    pr.prices = pr.prices.map((q) => ({
      year: q.year, oil: name === 'oil' ? 1 : 0, gas: name === 'gas' ? 1 : 0, ngl: name === 'ngl' ? 1 : 0,
    }));
    return cf(PROBE_REGIME, pr).map((x) => x.grossRevenue);
  };
  const oil = stream('oil'); const gas = stream('gas'); const ngl = stream('ngl');
  return {
    projectKey,
    units: { oil: 'million bbl', gas: 'million Mscf', ngl: 'million bbl' },
    oil, gas, ngl,
    byYear: oil.map((v, i) => ({ year: i + 1, oil: v, gas: gas[i], ngl: ngl[i] })),
  };
};

/**
 * THE PRICE PROBE, Section 4. Production is held at one barrel a day of oil
 * with the other streams zeroed, so grossRevenue times one million is the
 * APPLIED oil price for the year in USD per bbl, deck step hold and all.
 */
export const priceProbe = (projectKey) => {
  const pr = project(projectKey);
  pr.production = { oil: { initial: 1 / 365, decline: 0 }, gas: { initial: 0, decline: 0 }, ngl: { initial: 0, decline: 0 } };
  const applied = cf(PROBE_REGIME, pr).map((x) => x.grossRevenue * 1e6);
  return {
    projectKey,
    unit: 'USD per bbl',
    applied,
    byYear: applied.map((v, i) => ({ year: i + 1, appliedOilPrice: v })),
    deck: project(projectKey).prices,
  };
};

// ---------------------------------------------------------------------------
// SECTION 5 and SECTION 6. Costs, and a flat royalty.
// ---------------------------------------------------------------------------

/** The cost columns, which do not depend on the regime. */
export const costColumns = (projectKey) => {
  const rows = cf(GOM(), project(projectKey));
  const t = totals(rows);
  return {
    projectKey,
    byYear: rows.map((x) => ({ year: x.year, opex: x.opex, capex: x.capex })),
    head: rows.slice(0, 6).map((x) => ({ year: x.year, opex: x.opex, capex: x.capex })),
    last: { year: rows[24].year, opex: rows[24].opex, capex: rows[24].capex },
    totalOpex: t.opex,
    totalCapex: t.capex,
  };
};

/**
 * Gross revenue and a FLAT royalty, with the implied rate read back out of the
 * ledger. The implied rate is derived: the royalty column over the gross
 * revenue column, both on the same engine row.
 */
export const flatRoyaltyLedger = (projectKey) => {
  const g = GOM();
  const rows = cf(g, project(projectKey));
  const line = (x) => ({
    year: x.year,
    grossRevenue: x.grossRevenue,
    royalty: x.royalty,
    revenueAfterRoyaltyDerived: x.grossRevenue - x.royalty,
    impliedRateDerived: x.royalty / x.grossRevenue,
  });
  return {
    projectKey, regimeName: g.name, regimeLine: regimeLine(g),
    byYear: rows.map(line),
    shown: rows.slice(0, 8).concat(rows.slice(24)).map(line),
  };
};

// ---------------------------------------------------------------------------
// SECTION 9. The identity that closes the ledger.
//
// In EVERY year, for EVERY regime, at EVERY cost recovery limit these
// templates use, contractor net cash flow PLUS government cash flow equals gross
// revenue MINUS opex MINUS capex. Both sides of that are sums of columns the
// engine returned on the same row, and the gap between them is the check.
// ---------------------------------------------------------------------------

export const IDENTITY_CASES = [
  ['usa___gulf_of_mexico', 'default', 'USA - Gulf of Mexico (cost recovery limit 100) on the DEFAULT PROJECT'],
  ['angola___deepwater_psc', 'default', 'Angola - Deepwater PSC (cost recovery limit 50) on the DEFAULT PROJECT'],
];

const identityLine = (x) => ({
  year: x.year,
  grossRevenue: x.grossRevenue,
  opex: x.opex,
  capex: x.capex,
  costRecovered: x.costRecovered,
  unrecoveredCostPool: x.unrecoveredCostPool,
  contractorNCF: x.contractorNCF,
  governmentTake: x.governmentTake,
  takeSumDerived: x.contractorNCF + x.governmentTake,
  revenueLessCostDerived: x.grossRevenue - x.opex - x.capex,
  gapDerived: (x.contractorNCF + x.governmentTake) - (x.grossRevenue - x.opex - x.capex),
});

/**
 * The identity on the two regimes furthest apart in the template set, and then
 * SWEPT rather than asserted: the largest disagreement anywhere in the six
 * templates on the three projects, and anywhere in the 28 published cases.
 */
export const ledgerIdentity = () => {
  const cases = IDENTITY_CASES.map(([regimeId, projectKey, label]) => ({
    label, regimeId, projectKey,
    head: cf(regime(regimeId), project(projectKey)).slice(0, 6).map(identityLine),
  }));
  const worstOf = (runs) => {
    let worst = 0; let where = ''; let rows = 0;
    runs.forEach(({ label, rows: rr }) => rr.forEach((x) => {
      rows += 1;
      const d = Math.abs((x.contractorNCF + x.governmentTake) - (x.grossRevenue - x.opex - x.capex));
      if (d > worst) { worst = d; where = `${label}, year ${x.year}`; }
    }));
    return { worst, where, rows };
  };
  const templateRuns = [];
  fiscalTemplates.forEach((t) => PROJECT_KEYS.forEach((key) => {
    templateRuns.push({ label: t.name, rows: cf({ id: slug(t.name), name: t.name, ...clone(t.regime) }, project(key)) });
  }));
  const publishedRuns = CASHFLOW.map((c) => ({ label: c.id, rows: runCase(strip(c)) }));
  return { cases, templates: worstOf(templateRuns), published: worstOf(publishedRuns) };
};

// ---------------------------------------------------------------------------
// SECTION 10 and SECTION 25. Every template on one project, one line each.
// ---------------------------------------------------------------------------

export const templateTotals = (projectKey) => {
  const pr = project(projectKey);
  return fiscalTemplates.map((t) => {
    const g = { id: slug(t.name), name: t.name, ...clone(t.regime) };
    const rows = cf(g, pr);
    const s = totals(rows);
    return {
      id: g.id, name: t.name, projectKey,
      totalContractorNCF: s.ncf,
      totalGovernmentTake: s.gov,
      totalRevenue: s.rev,
      totalTax: s.tax,
      totalCostRecovered: s.rec,
      closingUnrecoveredPool: rows[rows.length - 1].unrecoveredCostPool,
      paybackYear: paybackYear(rows),
      payoutYear: payoutYear(rows),
      npv: calculateNPV(rows, pr.discountRate),
      irrPct: calculateIRR(rows),
    };
  });
};

// ---------------------------------------------------------------------------
// SECTION 11. Every published cash flow case, one line each.
//
// Three published NOTES USED TO make a claim their own numbers refused, and
// the 2026-09-15 recut corrected all three in the golden itself. The note is
// the golden's prose and is reprinted verbatim; the annotation beside it is
// this course's record of what the note used to say, and the values are the
// engine's. Quote a golden's NUMBERS, never a golden's prose. These strings
// are the ones the teaching digest prints, byte for byte.
// ---------------------------------------------------------------------------

export const STALE_NOTES = {
  capped_5pct_pool_never_clears:
    'HISTORY, AND THE NOTE IS CORRECT NOW. Until the 2026-09-15 recut this case was called capped_5pct_never_recovers and its note claimed "no payback, IRR 0", while the golden recorded paybackYear 3 beside it. Only the pool half was ever right. The note now states the payback and the two roots, and the engine returns null with status multiple-roots.',
  rfactor_tranche_crossing:
    'HISTORY, AND THE NOTE IS CORRECT NOW. The retired note said the R factor walks through 1.0 in year 3 and steps the split there. It crosses 1.0 between year 1 (0.781480) and year 2 (1.383252), and that crossing steps NOTHING because 60 percent is already the lowest tier\'s split; the step to 40 percent in year 3 is the 1.6 threshold. The note now says exactly that, and the table in Section 14 is the record.',
  rfactor_falls_back:
    'HISTORY, AND THE NOTE IS CORRECT NOW. The retired note said the R factor peaks "just above 2.5". It peaks at 2.972625 in year 11, crossing 2.5 upward in year 5 at 2.501684. The fall back through 2.5 in year 23 and the step from 30 back up to 40 were always as described.',
};

export const publishedCaseLines = () => CASHFLOW.map((c) => {
  const rows = runCase(c);
  const s = totals(rows);
  return {
    id: c.id, note: c.note,
    staleNote: STALE_NOTES[c.id] ?? null,
    regimeLine: regimeLine(c.regime),
    capexMultiplier: c.capexMultiplier ?? 1,
    priceMultiplier: c.priceMultiplier ?? 1,
    discountRatePct: c.project.discountRate,
    totalContractorNCF: s.ncf,
    totalGovernmentTake: s.gov,
    totalRevenue: s.rev,
    totalRoyalty: s.roy,
    totalCostRecovered: s.rec,
    totalProfitOil: s.po,
    totalTax: s.tax,
    paybackYear: paybackYear(rows),
    payoutYear: payoutYear(rows),
    npv: calculateNPV(rows, c.project.discountRate),
    irrPct: calculateIRR(rows),
    closingUnrecoveredPool: rows[rows.length - 1].unrecoveredCostPool,
  };
});

// ---------------------------------------------------------------------------
// SECTION 12. The sliding-scale royalty.
// ---------------------------------------------------------------------------

export const ROYALTY_MULTIPLIERS = [0.5, 0.6, 0.7, 0.71, 0.72, 0.8, 1.0, 1.2];

/**
 * The tiered teaching regime's royalty swept across the price multiplier on the DEFAULT PROJECT,
 * whose year 1 deck price is 70 USD per bbl. The applied price column is
 * derived, 70 times the multiplier; the implied rate column is derived, the
 * royalty the engine returned over the gross revenue it returned.
 */
export const royaltyMultiplierSweep = () => ROYALTY_MULTIPLIERS.map((multiplier) => {
  const rows = cf(TIERED(), DEFAULT_PROJECT, 1, multiplier);
  return {
    multiplier,
    appliedYear1PriceDerived: 70 * multiplier,
    grossRevenue: rows[0].grossRevenue,
    royalty: rows[0].royalty,
    impliedRateDerived: rows[0].royalty / rows[0].grossRevenue,
  };
});

export const ROYALTY_THRESHOLD_PRICES = [49.99, 50, 50.01];

/**
 * WHICH SIDE DOES THE THRESHOLD ITSELF BELONG TO. The engine compares with
 * `oilPrice >= tier.threshold`, so a price sitting EXACTLY on a threshold takes
 * the UPPER tier. No multiplier on this deck lands exactly on 50: 70 times 50
 * divided by 70 is 49.99999999999998 in binary floating point, strictly below
 * the threshold, and it prints as 50.000000 at six decimals. So the point is
 * made with a deck priced AT the threshold, which needs no multiplier at all.
 */
export const royaltyThresholdProbe = () => ROYALTY_THRESHOLD_PRICES.map((price) => {
  const pr = clone(DEFAULT_PROJECT);
  pr.prices = [{ year: 1, oil: price, gas: DEFAULT_PROJECT.prices[0].gas, ngl: DEFAULT_PROJECT.prices[0].ngl }];
  const rows = cf(TIERED(), pr);
  return {
    deckOilPrice: price,
    grossRevenue: rows[0].grossRevenue,
    royalty: rows[0].royalty,
    impliedRateDerived: rows[0].royalty / rows[0].grossRevenue,
  };
});

/**
 * The multiplier that LOOKS as though it lands on the threshold and does not.
 * 0.714285714285714 is fifty seventieths written to fifteen digits, which is
 * what a sweep axis prints; times 70 it is 49.99999999999998, strictly below
 * the threshold, and it still prints as 50.000000 at six decimals.
 */
export const ROYALTY_ROUNDING_MULTIPLIER = 0.714285714285714;

export const royaltyThresholdRounding = () => {
  const multiplier = ROYALTY_ROUNDING_MULTIPLIER;
  const rows = cf(TIERED(), DEFAULT_PROJECT, 1, multiplier);
  return {
    multiplier,
    appliedYear1PriceDerived: 70 * multiplier,
    grossRevenue: rows[0].grossRevenue,
    royalty: rows[0].royalty,
    impliedRateDerived: rows[0].royalty / rows[0].grossRevenue,
  };
};

/** The same instrument along ODIDI's deck rather than along a multiplier. */
export const odidiRoyaltyByYear = () => {
  const rows = cf(TIERED(), ODIDI);
  return rows.slice(0, 8).map((x) => ({
    year: x.year,
    grossRevenue: x.grossRevenue,
    royalty: x.royalty,
    impliedRateDerived: x.royalty / x.grossRevenue,
  }));
};

/**
 * The Nigeria - PIA (2021) template's royalty (type pia_2021) on ODIDI, the
 * first fourteen years: production royalty at the deep offshore rate for the
 * year's daily oil rate, royalty by price once the oil price passes the year's
 * low benchmark (Regulations 2021 base, the engine default), and the gas rate on
 * gas and NGL. The implied rate is derived, royalty over gross revenue.
 */
export const odidiPiaRoyaltyByYear = () => cf(PIA(), ODIDI).slice(0, 14).map((x) => ({
  year: x.year,
  grossRevenue: x.grossRevenue,
  royalty: x.royalty,
  impliedRateDerived: x.royalty / x.grossRevenue,
}));

export const ROYALTY_CASE_IDS = ['sliding_royalty_price_deck_crossing', 'price_below_every_threshold'];

export const royaltyCases = () => ROYALTY_CASE_IDS.map((id) => {
  const c = goldenCase(id);
  const rows = runCase(c);
  return {
    id, note: c.note, regimeLine: regimeLine(c.regime),
    head: rows.slice(0, 8).map((x) => ({
      year: x.year,
      grossRevenue: x.grossRevenue,
      royalty: x.royalty,
      impliedRateDerived: x.royalty / x.grossRevenue,
    })),
  };
});

// ---------------------------------------------------------------------------
// SECTION 13. Cost recovery, the pool and the carryforward.
// ---------------------------------------------------------------------------

export const COST_RECOVERY_LIMITS = [50, 80, 90, 100];

/**
 * The same project under four cost recovery limits, so the limit is the only
 * thing that moves. Everything else is held at the Generic Royalty/Tax
 * template's settings, on the DEFAULT PROJECT.
 */
export const costRecoverySweep = (limits = COST_RECOVERY_LIMITS) => limits.map((limit) => {
  const g = { ...GENERIC(), costRecoveryLimit: limit, id: `limit_${limit}`, name: `Generic at a ${limit} percent limit` };
  const rows = cf(g, DEFAULT_PROJECT);
  const s = totals(rows);
  return {
    limit, name: g.name,
    totalCostRecovered: s.rec,
    totalProfitOil: s.po,
    totalContractorNCF: s.ncf,
    closingUnrecoveredPool: rows[rows.length - 1].unrecoveredCostPool,
    head: rows.slice(0, 7).map((x) => ({
      year: x.year,
      grossRevenue: x.grossRevenue,
      royalty: x.royalty,
      costRecovered: x.costRecovered,
      unrecoveredCostPool: x.unrecoveredCostPool,
      profitOil: x.profitOil,
    })),
    rows,
  };
});

export const COST_RECOVERY_CASE_IDS = ['capped_5pct_pool_never_clears', 'capped_40pct', 'never_recovers_huge_capex'];

export const costRecoveryCases = () => COST_RECOVERY_CASE_IDS.map((id) => {
  const c = goldenCase(id);
  const rows = runCase(c);
  const s = totals(rows);
  return {
    id, note: c.note,
    costRecoveryLimit: c.regime.costRecoveryLimit,
    totalCostRecovered: s.rec,
    totalProfitOil: s.po,
    totalContractorNCF: s.ncf,
    closingUnrecoveredPool: rows[rows.length - 1].unrecoveredCostPool,
    paybackYear: paybackYear(rows),
  };
});

// ---------------------------------------------------------------------------
// SECTION 14. The R factor.
// ---------------------------------------------------------------------------

export const R_FACTOR_CASE_IDS = [
  'tiered_default_project', 'rfactor_tranche_crossing', 'rfactor_falls_back', 'harsh_split_40_royalty_20',
];

export const R_FACTOR_CASE_LABELS = {
  tiered_default_project: 'The tiered teaching regime on the DEFAULT PROJECT',
  rfactor_tranche_crossing: 'rfactor_tranche_crossing, the published crossing case',
  rfactor_falls_back: 'rfactor_falls_back, the published falling-back case',
  harsh_split_40_royalty_20: 'harsh_split_40_royalty_20, the published harsh case',
};

/**
 * The R factor table with the implied split read back out of the ledger. The
 * contractor's profit share is derived from the engine's own columns on the
 * same row (contractorNCF plus tax plus opex plus capex minus costRecovered,
 * which is the ledger identity rearranged), and the implied split is that
 * share over the profit oil the engine returned. `fallsBack` is true on any
 * row whose R factor is below the previous row's, which is the property the
 * oracle records and the course teaches.
 */
export const rFactorTable = (caseId = 'tiered_default_project') => {
  let rows; let note; let line;
  if (caseId === 'tiered_default_project') {
    const g = TIERED();
    rows = cf(g, DEFAULT_PROJECT);
    note = 'The tiered teaching regime splits at R 1.0 to 60 percent, R 1.6 to 40 percent and R 2.5 to 30 percent.';
    line = regimeLine(g);
  } else {
    const c = goldenCase(caseId);
    rows = runCase(c);
    note = c.note;
    line = regimeLine(c.regime);
  }
  const table = rows.map((x, i) => {
    const share = x.contractorNCF + x.tax + x.opex + x.capex - x.costRecovered;
    return {
      year: x.year,
      grossRevenue: x.grossRevenue,
      opex: x.opex,
      capex: x.capex,
      rFactor: x.rFactor,
      profitOil: x.profitOil,
      contractorProfitShareDerived: share,
      impliedSplitDerived: x.profitOil > 0 ? share / x.profitOil : null,
      fallsBack: i > 0 && x.rFactor < rows[i - 1].rFactor,
    };
  });
  const splits = table.map((x) => x.impliedSplitDerived);
  const returnedAt = table.find((x, i) => i > 0 && splits[i] !== null && splits[i - 1] !== null && splits[i] > splits[i - 1] + 1e-9);
  return {
    caseId, label: R_FACTOR_CASE_LABELS[caseId] ?? caseId, note, regimeLine: line,
    table,
    peakRFactor: Math.max(...table.map((x) => x.rFactor)),
    fallsBackAnywhere: table.some((x) => x.fallsBack),
    firstFallBackYear: table.find((x) => x.fallsBack)?.year ?? null,
    // A split once given up is RETURNED, which a ratcheted contract would never do.
    splitReturned: returnedAt !== undefined,
    splitReturnedYear: returnedAt ? returnedAt.year : null,
    payoutYear: payoutYear(rows),
  };
};

// ---------------------------------------------------------------------------
// SECTION 15 and SECTION 24. The tax stack.
// ---------------------------------------------------------------------------

/**
 * FOUR ENGINE RUNS OF ONE REGIME. Because the tax rates do not enter the base,
 * the stack decomposes exactly: running the same regime with two of the three
 * at zero returns the third on its own. The instruments are the Brazil -
 * Concession template's, whose CIT is 34 percent and whose RRT stands in for
 * Special Participation at 40 percent.
 */
export const taxDecomposition = (projectKey = 'default') => {
  const base = BRAZIL();
  const pr = project(projectKey);
  const only = (patch, name) => ({ ...clone(base), tax: { cit: 0, rrt: 0, minTax: 0, ...patch }, id: name, name });
  const all = cf({ ...clone(base), id: 'all', name: 'all' }, pr);
  const citOnly = cf(only({ cit: base.tax.cit }, 'cit'), pr);
  const rrtOnly = cf(only({ rrt: base.tax.rrt }, 'rrt'), pr);
  const minOnly = cf(only({ minTax: 5 }, 'min'), pr);
  return {
    projectKey,
    regimeName: base.name,
    citPct: base.tax.cit,
    rrtPct: base.tax.rrt,
    minTaxPct: 5,
    rrtUpliftPct: base.tax.rrtUpliftPct ?? 20,
    byYear: all.map((x, i) => ({
      year: x.year,
      grossRevenue: x.grossRevenue,
      profitOil: x.profitOil,
      citAlone: citOnly[i].tax,
      rrtAlone: rrtOnly[i].tax,
      minTaxAlone: minOnly[i].tax,
      taxAsPublished: x.tax,
    })),
    totalCitAlone: totals(citOnly).tax,
    totalRrtAlone: totals(rrtOnly).tax,
    totalMinTaxAlone: totals(minOnly).tax,
    totalTaxAsPublished: totals(all).tax,
    firstYearWithRrt: rrtOnly.find((x) => x.tax > 0)?.year ?? null,
  };
};

export const TAX_CASE_IDS = ['minimum_tax_binds', 'rrt_uplift_default_20', 'rrt_uplift_zero_respected'];

export const taxCases = () => TAX_CASE_IDS.map((id) => {
  const c = goldenCase(id);
  const rows = runCase(c);
  const s = totals(rows);
  return {
    id, note: c.note, regimeLine: regimeLine(c.regime),
    totalTax: s.tax,
    totalContractorNCF: s.ncf,
    head: rows.slice(0, 8).map((x) => ({
      year: x.year, grossRevenue: x.grossRevenue, profitOil: x.profitOil, tax: x.tax,
    })),
  };
});

export const UPLIFT_SWEEP_PCT = [0, 5, 10, 20, 30, 50];

/**
 * EC2-6. The uplift sizes a ONE-TIME pool, total capex times one plus the
 * uplift, drawn down against the contractor profit share until it is
 * exhausted and never refilled, so relief over the life never exceeds that
 * pool. The rule it replaced subtracted totalCapex times the uplift in every
 * one of the 25 years, five times the capex at the default 20 percent.
 * CIT is set to zero here so the RRT is the whole of the tax.
 */
export const upliftSweep = () => {
  const base = BRAZIL();
  return UPLIFT_SWEEP_PCT.map((up) => {
    const g = { ...clone(base), tax: { ...clone(base.tax), cit: 0, rrtUpliftPct: up }, id: `up_${up}`, name: `uplift ${up}` };
    const rows = cf(g, DEFAULT_PROJECT);
    const s = totals(rows);
    return {
      rrtUpliftPct: up,
      totalTax: s.tax,
      totalContractorNCF: s.ncf,
      totalGovernmentTake: s.gov,
      npvAt10: calculateNPV(rows, 10),
      firstYearWithPositiveRrt: rows.find((x) => x.tax > 0)?.year ?? null,
    };
  });
};

export const upliftTotalCapex = () => totals(cf(BRAZIL(), DEFAULT_PROJECT)).capex;

// ---------------------------------------------------------------------------
// SECTION 16 and SECTION 23. Discounting and IRR.
// ---------------------------------------------------------------------------

export const DISCOUNT_SWEEP_PCT = [0, 5, 8, 10, 12, 15, 20, 25, 30];

/**
 * calculateNPV discounts YEAR END. The screening engine in the same package
 * discounts MID YEAR, and on identical cash flows the mid-year NPV is larger
 * by exactly the square root of one plus the rate. The parity column is
 * derived: the year-end NPV the engine returned, times that factor.
 */
export const discountSweep = (regimeId = 'usa___gulf_of_mexico', rates = DISCOUNT_SWEEP_PCT, projectKey = 'default') => {
  const rows = cf(regime(regimeId), project(projectKey));
  return rates.map((ratePct) => {
    const npvYearEnd = calculateNPV(rows, ratePct);
    const parity = Math.sqrt(1 + ratePct / 100);
    return {
      ratePct,
      npvYearEnd,
      npvMidYearDerived: npvYearEnd * parity,
      parityRatioDerived: parity,
    };
  });
};

/**
 * The five published IRR vectors: the engine's value, the golden's own
 * expectation, and the true root where the golden records one.
 */
export const irrCases = () => golden.irr.map((c) => ({
  id: c.id,
  note: c.note,
  cashFlows: c.cashFlows,
  engineIrrPct: calculateIRR(c.cashFlows),
  goldenExpectedPct: (c.expected && typeof c.expected === 'object') ? (c.expected.irr ?? null) : (c.expected ?? null),
  goldenIrrStatus: (c.expected && typeof c.expected === 'object') ? (c.expected.irrStatus ?? null) : null,
  goldenIrrRootsPct: (c.expected && typeof c.expected === 'object') ? (c.expected.irrRoots ?? null) : null,
  goldenIrrRootAboveBand: (c.expected && typeof c.expected === 'object') ? (c.expected.irrRootAboveBand ?? false) : false,
  trueIrrPct: c.trueIrr ?? null,
  npvAt10: c.npvAt10,
  disagreement: c.engine?.disagreement ?? null,
  // Both may be null under the repaired contract, and null is an agreement.
  agrees: (() => {
    const got = calculateIRR(c.cashFlows);
    const want = (c.expected && typeof c.expected === 'object') ? (c.expected.irr ?? null) : (c.expected ?? null);
    if (got === null || want === null) return got === want;
    return Math.abs(got - want) < 1e-6;
  })(),
}));

export const IRR_BRACKET_RATES = [0, 100, 1600, 25600, 102400, 199900, 400000];

/**
 * EC2-5. The band made visible: NPV of the runaway vector at a range of rates.
 * The engine now returns null with irrStatus above-clamp rather than the
 * 102400 percent bracket its retired doubling search reached.
 */
export const irrBracketEvidence = () => {
  const c = IRRC.irr_above_clamp_past_old_bracket;
  const res = calculateIRRResult(c.cashFlows);
  return {
    id: c.id,
    cashFlows: c.cashFlows,
    engineIrrPct: res.irr,
    irrStatus: res.irrStatus,
    irrRootAboveBand: res.irrRootAboveBand ?? false,
    trueIrrPct: c.trueIrr ?? null,
    npvByRate: IRR_BRACKET_RATES.map((ratePct) => ({ ratePct, npv: calculateNPV(c.cashFlows, ratePct) })),
  };
};

// ---------------------------------------------------------------------------
// SECTION 17 to SECTION 22, and SECTION 26. The comparison.
//
// runFiscalComparison IS DECLARED ASYNC BY THE ENGINE, so every reader that
// calls it is async too. Nothing here computes while it waits.
// ---------------------------------------------------------------------------

export const COMPARISON_IDS = [...golden.comparisons.map((c) => c.id), 'odidi'];

export const COMPARISON_LABELS = Object.fromEntries([
  ...golden.comparisons.map((c) => [c.id, c.id]),
  ['odidi', 'odidi, all six templates on the teaching field'],
]);

const comparisonInputs = (caseId) => {
  if (caseId === 'odidi') {
    return {
      projectInputs: clone(ODIDI),
      regimes: fiscalTemplates.map((t) => ({ id: slug(t.name), name: t.name, ...clone(t.regime) })),
      note: 'All six templates on ODIDI, this course\'s teaching field.',
    };
  }
  const c = goldenComparison(caseId);
  return { projectInputs: clone(c.project), regimes: clone(c.regimes), note: c.note };
};

/** The raw engine result, for the readers below. */
export const comparisonResult = async (caseId) => {
  const { projectInputs, regimes } = comparisonInputs(caseId);
  return runFiscalComparison({ projectInputs, regimes });
};

/**
 * The summary table, sorted as the engine sorts it (contractor NPV
 * descending), with government take and government share of net revenue side by side
 * and their difference.
 * The price sweep's rate is read at the deck's own first-year price, which is
 * the one price at which the two definitions describe the same run.
 */
export const comparison = async (caseId) => {
  const { projectInputs, regimes, note } = comparisonInputs(caseId);
  const res = await runFiscalComparison({ projectInputs, regimes });
  const basePrice = projectInputs.prices[0].oil;
  const idx = res.sensitivityData.price.labels.indexOf(basePrice);
  return {
    caseId, note,
    regimeNames: regimes.map((g) => g.name),
    discountRatePct: projectInputs.discountRate,
    basePrice,
    basePriceLabelIndex: idx,
    summary: res.summary.map((s, rank) => {
      const series = res.sensitivityData.price.data.find((d) => d.regimeId === s.id);
      const sweepAtBase = idx >= 0 && series ? series.values[idx] : null;
      return {
        rank: rank + 1,
        id: s.id,
        name: s.name,
        npv: s.npv,
        irrPct: s.irr,
        paybackPeriod: s.paybackPeriod,
        rFactorPayoutYear: s.rFactorPayoutYear,
        govTake: s.govTake,
        // The two named metrics, straight off the engine's summary row.
        governmentTakePct: s.governmentTakePct,
        governmentTakeState: s.governmentTakeState,
        governmentTakeDiscountedPct: s.governmentTakeDiscountedPct,
        governmentTakeDiscountedState: s.governmentTakeDiscountedState,
        governmentShareOfNetRevenuePct: s.governmentShareOfNetRevenuePct,
        takeMinusShareDerived: s.governmentTakePct === null || s.governmentShareOfNetRevenuePct === null
          ? null : s.governmentTakePct - s.governmentShareOfNetRevenuePct,
        effectiveTaxRateSummary: s.effectiveTaxRate,
        effectiveTaxRateSweepAtBase: sweepAtBase,
        effectiveTaxRateDifferenceDerived: sweepAtBase === null ? null : sweepAtBase - s.effectiveTaxRate,
      };
    }),
    insights: res.insights,
  };
};

/**
 * SECTION 19. The pair, on its own. The summary's rate adds total capex back
 * to the contractor's take, so it is a rate on profit; the price sweep's rate
 * does not, so it is a rate on cash. Both live in one result object and one
 * screen once labelled both of them "effective tax rate".
 */
export const etrBothWays = async (caseId) => {
  const c = await comparison(caseId);
  return {
    caseId: c.caseId,
    basePrice: c.basePrice,
    basePriceLabelIndex: c.basePriceLabelIndex,
    rows: c.summary.map((s) => ({
      id: s.id,
      name: s.name,
      summaryWithCapexAddBack: s.effectiveTaxRateSummary,
      sweepWithoutAddBack: s.effectiveTaxRateSweepAtBase,
      differencePercentagePointsDerived: s.effectiveTaxRateDifferenceDerived,
    })),
  };
};

/**
 * SECTION 18. The price sweep. It reaches a price by a MULTIPLIER of the first
 * deck point's oil price, and it scales OIL ONLY. What it plots is government
 * take over government cash flow plus contractor net cash flow, without the capex
 * add-back.
 *
 * EVERY POINT CARRIES THE ENGINE'S OWN STATE (EC2-1, owner decision
 * 2026-09-14): `share`, `exceeds` (above 100 percent, true value kept) or
 * `undefined` (lifetime profit not positive, value null). An earlier build
 * returned exactly 0 where the state is now undefined. The reader does not
 * re-derive the state: it reads the engine's, and re-runs the SAME regime at
 * the SAME multiplier only to put the two lifetime totals underneath the point
 * and to check that the totals agree with the state the engine returned.
 */
export const PRICE_POINT_MEANINGS = {
  share: 'share: lifetime profit is positive and government take is within 0 to 100 percent',
  exceeds: 'exceeds: lifetime profit is positive but the contractor loses money while the government still collects, so the ratio is above 100 percent; the true value is kept and it is not a share',
  undefined: 'undefined: lifetime profit is zero or negative, so there is no share, the value is null and the line breaks',
};

const stateFromTotals = (gov, ncf) => {
  const profit = gov + ncf;
  if (!(profit > 0)) return GOVERNMENT_SHARE_STATES.UNDEFINED;
  return (gov / profit) * 100 > 100 ? GOVERNMENT_SHARE_STATES.EXCEEDS : GOVERNMENT_SHARE_STATES.SHARE;
};

const pricePointEvidence = (g, projectInputs, priceLabel, plotted, state) => {
  const rows = cf(g, projectInputs, 1, priceLabel / projectInputs.prices[0].oil);
  const t = totals(rows);
  const denominator = t.gov + t.ncf;
  return {
    price: priceLabel,
    plotted,
    state,
    lifetimeContractorNCF: t.ncf,
    lifetimeGovernmentTake: t.gov,
    lifetimeDenominatorDerived: denominator,
    lifetimeContractorNcfPositive: t.ncf > 0,
    stateAgreesWithTotals: stateFromTotals(t.gov, t.ncf) === state,
    noValue: state === GOVERNMENT_SHARE_STATES.UNDEFINED,
    meaning: PRICE_POINT_MEANINGS[state],
    warn: state !== GOVERNMENT_SHARE_STATES.SHARE,
  };
};

/** Last minus first, or null when either end has no value. */
const endpointClimb = (values) => {
  const a = values[0];
  const b = values[values.length - 1];
  return a === null || b === null || a === undefined || b === undefined ? null : b - a;
};

export const priceSweep = async (caseId) => {
  const { projectInputs, regimes, note } = comparisonInputs(caseId);
  const res = await runFiscalComparison({ projectInputs, regimes });
  const sw = res.sensitivityData.price;
  const win = commonShareWindow(sw.data, sw.labels.length);
  return {
    caseId, note,
    labels: sw.labels,
    window: win,
    windowLabels: win ? [sw.labels[win.start], sw.labels[win.end]] : null,
    undefinedPrices: sw.labels.filter((_, i) => sw.data.some((d) => d.states[i] === GOVERNMENT_SHARE_STATES.UNDEFINED)),
    priceVerdict: res.insights.find((i) => i.key === 'price') ?? null,
    series: sw.data.map((d) => {
      const g = regimes.find((x) => x.id === d.regimeId);
      const points = sw.labels.map((label, i) => pricePointEvidence(g, projectInputs, label, d.values[i], d.states[i]));
      const base = totals(cf(g, projectInputs));
      return {
        id: d.regimeId,
        name: g.name,
        values: d.values,
        states: d.states,
        climbDerived: endpointClimb(d.values),
        windowClimbDerived: win ? d.values[win.end] - d.values[win.start] : null,
        points,
        warnPoints: points.filter((x) => x.warn).map((x) => x.price),
        everyPointIsAShare: points.every((x) => !x.warn),
        anyPointUndefined: points.some((x) => x.noValue),
        everyStateAgreesWithTotals: points.every((x) => x.stateAgreesWithTotals),
        lifetimeContractorNCFAtTheDeck: base.ncf,
        lifetimeGovernmentTakeAtTheDeck: base.gov,
        lifetimeContractorNcfPositiveAtTheDeck: base.ncf > 0,
        distinctPlotted: [...new Set(d.values)],
      };
    }),
  };
};

/**
 * THE REGIME THE SIXTEEN PUBLISHED SWEEP CASES ACTUALLY RUN, which is NOT the
 * "Nigeria - PIA (2021)" template despite every case id containing "pia". It is
 * the Designer's own default regime, id 1, which the golden names "Nigerian PIA
 * (PSC)" and the course calls the Designer's sample PSC regime: its values are
 * the Designer's illustrative samples and none is read from the Act. It
 * recovers cost at 70 percent of revenue after royalty where the template takes
 * 70 percent of the gross value of crude oil and NGL, splits profit oil in two R
 * factor tranches where the template takes the government's minimum share by
 * cumulative production, slides its royalty on price where the template charges
 * the PIA 2021 royalty, and carries an RRT and a minimum tax the template does
 * not have. Anything keyed to "the PIA template" on these cases is mis-keyed.
 */
export const DESIGNER_REGIME_LABEL = "the Designer's sample PSC regime";

export const sweepCaseRegime = () => {
  const g = clone(golden.priceSweep[0].regime);
  const t = PIA();
  const capexRegime = clone(golden.capexSweep[0].regime);
  const rows = cf({ ...g, id: String(g.id), name: g.name }, DEFAULT_PROJECT);
  return {
    id: g.id,
    name: g.name,
    courseLabel: DESIGNER_REGIME_LABEL,
    line: regimeLine(g),
    sameRegimeOnEveryPriceCase: new Set(golden.priceSweep.map((x) => JSON.stringify(x.regime))).size === 1,
    sameRegimeOnEveryCapexCase: new Set(golden.capexSweep.map((x) => JSON.stringify(x.regime))).size === 1,
    priceAndCapexShareIt: JSON.stringify(g) === JSON.stringify(capexRegime),
    isTheTemplate: g.name === t.name,
    template: { id: t.id, name: t.name, line: regimeLine(t) },
    npvOfTheDesignerRegime: golden.priceSweep.find((x) => x.id === 'price_70_pia_default').expected.npv,
    npvOfTheTemplate: calculateNPV(cf(t, DEFAULT_PROJECT), DEFAULT_PROJECT.discountRate),
    designerCostRecoveryLimit: g.costRecoveryLimit,
    templateCostRecoveryLimit: t.costRecoveryLimit,
    designerCostRecoveryBase: g.costRecoveryBase ?? 'revenue_after_royalty',
    templateCostRecoveryBase: t.costRecoveryBase ?? 'revenue_after_royalty',
    designerTrancheCount: g.profitSplit.tiers.length,
    designerSplitType: g.profitSplit.type,
    templateSplitType: t.profitSplit.type,
    templateBandCount: t.profitSplit.tiers.length,
    designerTotalContractorNCF: totals(rows).ncf,
  };
};

/** The nine published price-sweep cases, which pin the whole result at each price. */
export const publishedPriceSweep = () => golden.priceSweep.map((x) => ({
  id: x.id,
  regimeName: x.regime.name,
  npv: x.expected.npv,
  irrPct: x.expected.irr,
  totalContractorNCF: x.expected.totalContractorNCF,
  totalGovTake: x.expected.totalGovTake,
  paybackYear: x.expected.paybackYear ?? null,
  rFactorPayoutYear: x.expected.rFactorPayoutYear ?? null,
  finalUnrecoveredPool: x.expected.finalUnrecoveredPool,
}));

/**
 * SECTION 20. The capex sweep, EIGHT points reaching the endpoint the axis
 * promises (EC2-3). CAPEX_SWEEP_MULTIPLIERS is an integer step count, each
 * multiplier written (8 + k) / 10, so the last point is exactly 1.5 and equals
 * the engine called directly at 1.5. The loop it replaced accumulated 0.1,
 * reached 1.5000000000000004, failed its own test and stopped at 1.4.
 */
export const capexSweep = async (caseId) => {
  const { projectInputs, regimes, note } = comparisonInputs(caseId);
  const res = await runFiscalComparison({ projectInputs, regimes });
  const sw = res.sensitivityData.capex;
  return {
    caseId, note,
    labels: sw.labels,
    labelCount: sw.labels.length,
    lastLabel: sw.labels[sw.labels.length - 1],
    series: sw.data.map((d) => {
      const g = regimes.find((x) => x.id === d.regimeId);
      const at15 = calculateNPV(cf(g, projectInputs, 1.5, 1), projectInputs.discountRate);
      return {
        id: d.regimeId,
        name: g.name,
        values: d.values,
        npvAtOneAndAHalfCalledDirectly: at15,
        lossOverSweptRangeDerived: d.values[0] - d.values[d.values.length - 1],
        lossToOneAndAHalfCalledDirectlyDerived: d.values[0] - at15,
        endpointMatchesDirectCallDerived: d.values[d.values.length - 1] === at15,
      };
    }),
  };
};

/** The published capex-sweep cases, at multipliers of 0.7 to 1.5. */
export const publishedCapexSweep = () => golden.capexSweep.map((x) => ({
  id: x.id,
  regimeName: x.regime.name,
  npv: x.expected.npv,
  irrPct: x.expected.irr,
  totalContractorNCF: x.expected.totalContractorNCF,
  totalGovTake: x.expected.totalGovTake,
  paybackYear: x.expected.paybackYear ?? null,
  rFactorPayoutYear: x.expected.rFactorPayoutYear ?? null,
}));

/**
 * SECTION 21. The derived verdicts for a published insights case. Up to five,
 * keyed npv, payback, government, capex and price; a claim that cannot be
 * supported is omitted rather than guessed.
 */
export const insights = (caseId) => {
  const c = goldenInsightsCase(caseId);
  const got = deriveInsights(c.summary, c.sensitivityData);
  return {
    caseId, note: c.note,
    verdicts: got,
    keys: got.map((i) => i.key),
    empty: got.length === 0,
    regimeCount: c.summary.length,
  };
};

/**
 * SECTION 22. The tie ranked by floating point noise, with the ranked
 * quantities printed so a reader can see the tie the sentence does not admit.
 * The capex and price verdicts pick their winner with a strict less-than in a
 * reduce, which returns the first element when two are equal.
 */
export const tieEvidence = async () => {
  const c = goldenComparison('cmp_never_recovers');
  const res = await runFiscalComparison({ projectInputs: clone(c.project), regimes: clone(c.regimes) });
  const ranked = res.sensitivityData.capex.data.map((d) => {
    const g = c.regimes.find((x) => x.id === d.regimeId);
    return {
      id: d.regimeId,
      name: g.name,
      npv: res.summary.find((s) => s.id === d.regimeId).npv,
      capexFirstPoint: d.values[0],
      capexLastPoint: d.values[d.values.length - 1],
      lossDerived: d.values[0] - d.values[d.values.length - 1],
      lossToOneDecimalDerived: (d.values[0] - d.values[d.values.length - 1]).toFixed(1),
    };
  });
  const climbs = res.sensitivityData.price.data.map((d) => {
    const g = c.regimes.find((x) => x.id === d.regimeId);
    return {
      id: d.regimeId,
      name: g.name,
      states: d.states,
      climbDerived: endpointClimb(d.values),
      climbToOneDecimalDerived: endpointClimb(d.values) === null ? null : endpointClimb(d.values).toFixed(1),
    };
  });
  const distinctLosses = new Set(ranked.map((r) => r.lossToOneDecimalDerived));
  // THE TIE IS EXACT, AND BY CONSTRUCTION. At BOTH ends of the swept range
  // every regime recovers cost at its own limit, the pool being far larger
  // than any allowance, so cost recovered, profit oil and tax are unchanged
  // between a multiplier of 0.8 and one of 1.4. Nothing below the capex line
  // moves, so the whole capex difference reaches the contractor's year 1 line
  // undiluted and is discounted by the same single year.
  const ends = c.regimes.map((g) => {
    const lo = totals(cf(g, c.project, 0.8, 1));
    const hi = totals(cf(g, c.project, 1.4, 1));
    return {
      id: g.id,
      name: g.name,
      costRecoveredAtLow: lo.rec, costRecoveredAtHigh: hi.rec,
      profitOilAtLow: lo.po, profitOilAtHigh: hi.po,
      taxAtLow: lo.tax, taxAtHigh: hi.tax,
      capexAtLow: lo.capex, capexAtHigh: hi.capex,
      unchangedBelowTheCapexLine: lo.rec === hi.rec && lo.po === hi.po && lo.tax === hi.tax,
      lossDerived: calculateNPV(cf(g, c.project, 0.8, 1), c.project.discountRate)
        - calculateNPV(cf(g, c.project, 1.4, 1), c.project.discountRate),
    };
  });
  const totalCapex = c.project.costs.capex.drilling + c.project.costs.capex.facilities + c.project.costs.capex.subsea;
  return {
    caseId: 'cmp_never_recovers',
    note: c.note,
    ranked,
    ends,
    everyRegimeUnchangedBelowTheCapexLine: ends.every((x) => x.unchangedBelowTheCapexLine),
    // The arithmetic closes exactly: 0.6 of the capex, spent in year 1 and
    // discounted one year at the project rate, IS every one of the six losses.
    capexDifference: ends[0].capexAtHigh - ends[0].capexAtLow,
    totalCapex,
    discountRatePct: c.project.discountRate,
    lossFromTheCapexLineAlone: (ends[0].capexAtHigh - ends[0].capexAtLow) / (1 + c.project.discountRate / 100),
    climbs,
    insights: res.insights,
    capexVerdict: res.insights.find((i) => i.key === 'capex') ?? null,
    priceVerdict: res.insights.find((i) => i.key === 'price') ?? null,
    separatedAtOneDecimal: distinctLosses.size === ranked.length,
    ties: insights('insights_ties'),
    rounding: insights('insights_rounding'),
  };
};

/**
 * SECTION 26. The government take curve carries three states, and this is the
 * evidence. The cmp_never_recovers totals beside the null the sweep returns at
 * every price (an earlier build returned exactly 0 there), and the Angola capex
 * multiple table where the same line runs through all three states.
 *
 * A regime whose LIFETIME contractor net cash flow is not positive is reported
 * as such in `lifetimeContractorNcfPositive` and named in `meaning`. It is not
 * enough that the call returned.
 */
export const ANGOLA_CAPEX_MULTIPLES = [1, 2, 3, 4];

export const shareCurveRegimes = async () => {
  const c = goldenComparison('cmp_never_recovers');
  const res = await runFiscalComparison({ projectInputs: clone(c.project), regimes: clone(c.regimes) });
  const rows = c.regimes.map((g) => {
    const led = cf(g, c.project);
    const t = totals(led);
    const d = res.sensitivityData.price.data.find((x) => x.regimeId === g.id);
    const series = d.values;
    const positive = t.ncf > 0;
    const points = res.sensitivityData.price.labels.map((label, i) => pricePointEvidence(g, c.project, label, series[i], d.states[i]));
    return {
      id: g.id,
      name: g.name,
      totalGovernmentTake: t.gov,
      totalContractorNCF: t.ncf,
      denominatorDerived: t.gov + t.ncf,
      lifetimeContractorNcfPositive: positive,
      plotted: series,
      states: d.states,
      points,
      distinctPlotted: [...new Set(series)],
      distinctStates: [...new Set(d.states)],
      noValueAtAnyPrice: series.every((v) => v === null),
      everyPointUndefined: d.states.every((x) => x === GOVERNMENT_SHARE_STATES.UNDEFINED),
      everyStateAgreesWithTotals: points.every((x) => x.stateAgreesWithTotals),
      meaning: positive ? PRICE_POINT_MEANINGS.share : PRICE_POINT_MEANINGS.undefined,
    };
  });
  const angola = [];
  for (const multiple of ANGOLA_CAPEX_MULTIPLES) {
    const pr = clone(DEFAULT_PROJECT);
    pr.costs.capex.drilling *= multiple;
    pr.costs.capex.facilities *= multiple;
    pr.costs.capex.subsea *= multiple;
    const g = ANGOLA();
    // eslint-disable-next-line no-await-in-loop
    const r = await runFiscalComparison({ projectInputs: pr, regimes: [g] });
    const led = cf(g, pr);
    const t = totals(led);
    const values = r.sensitivityData.price.data[0].values;
    const states = r.sensitivityData.price.data[0].states;
    const points = r.sensitivityData.price.labels.map((label, i) => pricePointEvidence(g, pr, label, values[i], states[i]));
    angola.push({
      multiple,
      labels: r.sensitivityData.price.labels,
      values,
      states,
      points,
      meanings: [...new Set(points.map((x) => x.meaning))],
      lifetimeContractorNCFAtTheDeck: t.ncf,
      lifetimeGovernmentTakeAtTheDeck: t.gov,
      lifetimeContractorNcfPositiveAtTheDeck: t.ncf > 0,
      undefinedAtSomePoint: states.includes(GOVERNMENT_SHARE_STATES.UNDEFINED),
      exceedsAtSomePoint: states.includes(GOVERNMENT_SHARE_STATES.EXCEEDS),
      firstSharePrice: r.sensitivityData.price.labels[states.indexOf(GOVERNMENT_SHARE_STATES.SHARE)] ?? null,
      everyPointIsAShare: points.every((x) => !x.warn),
    });
  }
  return {
    caseId: 'cmp_never_recovers',
    note: c.note,
    capex: { drilling: c.project.costs.capex.drilling, facilities: c.project.costs.capex.facilities, subsea: c.project.costs.capex.subsea },
    rows,
    everyRegimeHasNoValueAtAnyPrice: rows.every((r) => r.noValueAtAnyPrice),
    priceVerdict: res.insights.find((i) => i.key === 'price') ?? null,
    angola,
  };
};

/**
 * SECTION 27. THE PAYBACK VERDICT RESTATES THE NPV RANKING WHENEVER PAYBACK
 * TIES. Payback here is an INTEGER year, and integers tie. The verdict picks
 * its winner with a strict less-than in a reduce, which keeps the FIRST element
 * it saw, and the summary is sorted by contractor NPV, so the first element it
 * saw is the NPV winner. Where the column ties, the sentence is telling you
 * about NPV under a different label.
 */
export const PAYBACK_TIE_CASE_IDS = [
  'cmp_all_templates_default_project', 'cmp_all_templates_test_project', 'cmp_designer_defaults', 'odidi',
];

export const paybackTieEvidence = async () => {
  const out = [];
  for (const caseId of PAYBACK_TIE_CASE_IDS) {
    const { projectInputs, regimes } = comparisonInputs(caseId);
    // eslint-disable-next-line no-await-in-loop
    const res = await runFiscalComparison({ projectInputs, regimes });
    const years = res.summary.map((s) => s.paybackPeriod);
    const fastest = Math.min(...years.filter((y) => Number.isFinite(y)));
    const atFastest = res.summary.filter((s) => s.paybackPeriod === fastest);
    const verdict = res.insights.find((i) => i.key === 'payback') ?? null;
    // THE SECOND NAME IN A PAYBACK SENTENCE IS NOT THE RUNNER-UP. The function
    // picks the fastest, removes it, and then takes the MAXIMUM of what is
    // left, so the second regime named is the SLOWEST of the rest. A sentence
    // of the form "A pays back in year x, against year y for B" reads like a
    // top two and is a top and a bottom.
    const named = verdict ? [...verdict.text.matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
    const paying = res.summary.filter((s) => Number.isFinite(s.paybackPeriod));
    const rest = paying.filter((s) => s.name !== named[0]);
    const slowestOfTheRest = rest.length
      ? rest.reduce((a, b) => (b.paybackPeriod > a.paybackPeriod ? b : a)).name : null;
    const runnerUp = rest.length
      ? [...rest].sort((a, b) => a.paybackPeriod - b.paybackPeriod)[0].name : null;
    out.push({
      caseId,
      namesInTheSentence: named,
      secondNamed: named[1] ?? null,
      // EC2-10. The sentence lists EVERY regime tied at the fastest year and
      // then one more, so the name that is the slowest of the rest is the
      // LAST one, not the second. secondNamed is kept for the history the
      // lessons quote and is only the slowest of the rest when nothing tied.
      lastNamed: named.length ? named[named.length - 1] : null,
      slowestOfTheRest,
      runnerUp,
      secondNamedIsTheSlowestOfTheRest: named.length > 1 && named[1] === slowestOfTheRest,
      lastNamedIsTheSlowestOfTheRest: named.length > 1 && named[named.length - 1] === slowestOfTheRest,
      rows: res.summary.map((s, i) => ({ position: i + 1, id: s.id, name: s.name, npv: s.npv, paybackPeriod: s.paybackPeriod })),
      paybackYears: years,
      distinctPaybackYears: [...new Set(years)],
      fastestPaybackYear: fastest,
      tiedAtFastest: atFastest.length,
      tiedRegimeNames: atFastest.map((s) => s.name),
      tied: atFastest.length > 1,
      verdict,
      namedRegime: verdict ? ((verdict.text.match(/^"([^"]+)"/) ?? [])[1] ?? null) : null,
      topNpvRegime: res.summary[0].name,
      // Where the column ties, the sentence names the top-NPV regime.
      namesTheTopNpvRegime: verdict ? verdict.text.startsWith(`"${res.summary[0].name}"`) : false,
    });
  }
  return out;
};

/**
 * The engine formats money inside its verdict strings with a dollar sign and
 * MM, which the owner copy rule forbids in user-facing text. A panel that
 * prints an insight sentence verbatim, the only honest way to show what the
 * engine said, puts that formatting on the screen. Recorded as EC2-6.
 */
export const verdictCopyDefect = async () => {
  const res = await comparison('cmp_all_templates_default_project');
  const offending = res.insights.filter((i) => /\$[\d.-]+MM/.test(i.text));
  return {
    caseId: res.caseId,
    total: res.insights.length,
    withEngineMoneyFormatting: offending.map((i) => i.key),
    sample: offending.length ? offending[0].text : null,
  };
};

// ===========================================================================
// THE CAPSTONE. URUAN ONLY. NOT FOR LESSONS, NOT FOR PANELS.
//
// EVERYTHING BELOW THIS LINE IS CAPSTONE MATERIAL. URUAN, its concession and its production sharing contract
// are copied VERBATIM from /root/ec-wip-fiscal/ec2_fields.mjs so the grader,
// the lab's own tests and the migration headers all read one derivation. The
// names all carry URUAN or uruan, and panelCapstoneGuard.test.js greps the
// three panel sources for every one of them. The leak gate in
// fiscalLab.test.js checks every TEACHING export's return values against the
// eighteen graded answers below.
//
// The teaching digest and the capstone are two files with opposite audiences
// and they never share a number.
// ===========================================================================

export const URUAN_LABEL = 'URUAN';

export const URUAN = {
  production: {
    oil: { initial: 5200, decline: 11 },
    gas: { initial: 65, decline: 7 },
    ngl: { initial: 480, decline: 13 },
  },
  prices: [
    { year: 1, oil: 58, gas: 3.2, ngl: 27 },
    { year: 8, oil: 72, gas: 4.1, ngl: 34 },
  ],
  costs: {
    capex: { drilling: 185, facilities: 95, subsea: 35 },
    opex: { fixed: 9, variable: 6.5 },
  },
  discountRate: 11,
};

// The two regimes the capstone puts side by side.
export const URUAN_CONCESSION = {
  id: 'uruan_concession',
  name: 'URUAN concession',
  royalty: { type: 'flat', rate: 14 },
  costRecoveryLimit: 100,
  profitSplit: { type: 'flat', split: 100 },
  tax: { cit: 28, rrt: 0, minTax: 0 },
};

export const URUAN_PSC = {
  id: 'uruan_psc',
  name: 'URUAN production sharing contract',
  royalty: { type: 'sliding_price', tiers: [{ threshold: 0, rate: 6 }, { threshold: 60, rate: 9.5 }] },
  costRecoveryLimit: 65,
  // Recut 2026-09-13. Thresholds 1.4 and 1.65, not 1.8 and 2.6: this field's R
  // factor peaks at 1.699873, so the old tranches never engaged, the split
  // read 65 percent in all 25 years and a learner who ignored the R factor
  // entirely scored full marks on every production sharing field. At 1.4 and
  // 1.65 all three engage and the ratio then FALLS BACK through the top one
  // in year 25, which is the property the Professional tier teaches.
  profitSplit: { type: 'tiered_r_factor', tiers: [{ threshold: 1.0, split: 65 }, { threshold: 1.4, split: 45 }, { threshold: 1.65, split: 32 }] },
  tax: { cit: 32, rrt: 0, minTax: 0 },
};

const URUAN_MONEY = 0.001;
const URUAN_PCT = 0.0001;
const URUAN_RATIO = 0.000001;

/** The capstone runs, exactly as the derivation makes them. */
export const uruanRuns = async () => {
  const run = (g, cx = 1, px = 1) => calculateCashFlowForRegime(g, URUAN, cx, px);
  const con = run(URUAN_CONCESSION);
  const psc = run(URUAN_PSC);
  const cmp = await runFiscalComparison({ projectInputs: URUAN, regimes: [URUAN_CONCESSION, URUAN_PSC] });
  return { con, psc, cmp, pscAtOneAndAHalf: calculateNPV(run(URUAN_PSC, 1.5, 1), URUAN.discountRate) };
};

/**
 * The eighteen graded fields as [tier, key, value, tolerance], in the order and
 * with the tolerances the capstone publishes. THE TOLERANCE IS ABSOLUTE, in
 * the field's own units: academy_submit_capstone grades with
 * abs(v_got - v_exp) <= v_tol and divides by nothing.
 */
export const uruanCapstoneFields = async () => {
  const { con, psc, cmp, pscAtOneAndAHalf } = await uruanRuns();
  const sum = (rows, k) => rows.reduce((s, x) => s + x[k], 0);
  const sPsc = cmp.summary.find((s) => s.id === URUAN_PSC.id);
  const priceSweepOf = (id) => cmp.sensitivityData.price.data.find((d) => d.regimeId === id).values;
  const capexSweepOf = (id) => cmp.sensitivityData.capex.data.find((d) => d.regimeId === id).values;
  const at60 = cmp.sensitivityData.price.labels.indexOf(60);
  const pscCapex = capexSweepOf(URUAN_PSC.id);
  const conPrice = priceSweepOf(URUAN_CONCESSION.id);
  return [
    ['beginner', 'con_y1_gross_revenue_musd', con[0].grossRevenue, URUAN_MONEY],
    ['beginner', 'con_y4_royalty_musd', con[3].royalty, URUAN_MONEY],
    ['beginner', 'con_y4_opex_musd', con[3].opex, URUAN_MONEY],
    ['beginner', 'con_y5_contractor_ncf_musd', con[4].contractorNCF, URUAN_MONEY],
    // Tolerance 0.0003 (PIA re-cut lead decision): the PIA template's year 2
    // royalty on the default project sits 0.000606 away, inside a 0.001 band.
    ['beginner', 'con_payback_year_cum_ncf_musd', con.find((x) => x.cumulativeNCF > 0).cumulativeNCF, 0.0003],
    ['beginner', 'con_total_government_take_musd', sum(con, 'governmentTake'), URUAN_MONEY],
    ['intermediate', 'psc_y1_cost_recovered_musd', psc[0].costRecovered, URUAN_MONEY],
    ['intermediate', 'psc_y3_unrecovered_pool_musd', psc[2].unrecoveredCostPool, URUAN_MONEY],
    ['intermediate', 'psc_y5_r_factor', psc[4].rFactor, URUAN_RATIO],
    // YEAR 8, not year 9, and a tolerance of 0.0003 rather than the usual
    // 0.001. Year 8 is the FIRST year on the far side of the deck step, so it
    // is the only year that discriminates the step year: a reader who put the
    // step at year 9 reads year 8 at the old price and is wrong, while year 9
    // scores the same whether the step is placed at 7, 8 or 9. The band is
    // narrowed rather than the year moved, because at 0.001 ten tolerances
    // reached three unrelated digest literals.
    ['intermediate', 'psc_y8_royalty_musd', psc[7].royalty, 0.0003],
    ['intermediate', 'psc_total_tax_musd', sum(psc, 'tax'), URUAN_MONEY],
    ['intermediate', 'psc_npv_musd', calculateNPV(psc, URUAN.discountRate), URUAN_MONEY],
    ['advanced', 'cmp_top_npv_musd', cmp.summary[0].npv, URUAN_MONEY],
    ['advanced', 'cmp_psc_effective_tax_rate_pct', sPsc.effectiveTaxRate, URUAN_PCT],
    ['advanced', 'cmp_psc_price_sweep_at_60_pct', priceSweepOf(URUAN_PSC.id)[at60], URUAN_PCT],
    // EC2-3. On the repaired eight-point sweep the loss ACROSS the sweep is the
    // loss to 1.5, so the old cmp_psc_capex_loss_seven_point_musd computed to
    // exactly the field below it and the pair stopped discriminating. It is
    // retired and replaced by the last tenth of the sweep, 1.4 to 1.5, which
    // the repair is what made readable.
    ['advanced', 'cmp_psc_capex_loss_last_tenth_musd', pscCapex[pscCapex.length - 2] - pscCapex[pscCapex.length - 1], URUAN_MONEY],
    ['advanced', 'cmp_psc_capex_loss_eight_point_musd', pscCapex[0] - pscAtOneAndAHalf, URUAN_MONEY],
    ['advanced', 'cmp_con_price_climb_pct_points', conPrice[conPrice.length - 1] - conPrice[0], URUAN_PCT],
  ];
};

/** The graded answers keyed by field. */
export const uruanCapstoneValues = async () =>
  Object.fromEntries((await uruanCapstoneFields()).map(([, key, value]) => [key, value]));

/** The grading tolerance of each field, absolute, in the field's own units. */
export const uruanCapstoneTolerances = async () =>
  Object.fromEntries((await uruanCapstoneFields()).map(([, key, , tol]) => [key, tol]));

/**
 * Every export of this module that is built on the capstone. The panel guard
 * greps the panel sources for each name; the leak gate skips each one when it
 * walks the teaching surface.
 */
export const CAPSTONE_ONLY_EXPORTS = [
  'URUAN_LABEL', 'URUAN', 'URUAN_CONCESSION', 'URUAN_PSC',
  'uruanRuns', 'uruanCapstoneFields', 'uruanCapstoneValues', 'uruanCapstoneTolerances',
  'CAPSTONE_ONLY_EXPORTS',
];

/** How much wider than the grader's own band a teaching number has to stand clear. */
export const LEAK_GUARD_MARGIN = 10;

/** The unit shifts a number can be restated under and still be the same answer. */
export const LEAK_GUARD_SCALINGS = [
  { factor: 1, tag: 'as graded' },
  { factor: 1000, tag: 'x1000' },
  { factor: 0.001, tag: 'x0.001' },
];

/**
 * Every forbidden neighbourhood: eighteen answers, three shiftings, ten times
 * the grading band. The band is SCALED with the shifting, because the grader's
 * tolerance is absolute in the field's own units and a restated answer carries
 * a restated tolerance with it.
 */
export const leakGuardTargets = (fields) => {
  const out = [];
  fields.forEach(([tier, key, value, tol]) => {
    LEAK_GUARD_SCALINGS.forEach(({ factor, tag }) => {
      const gradingBand = tol * Math.abs(factor);
      out.push({ tier, key, tag, value: value * factor, gradingBand, band: LEAK_GUARD_MARGIN * gradingBand });
    });
  });
  return out;
};

/** The target a number collides with, or null. Dimension blind: a box takes any number. */
export const leakGuardHit = (value, targets) => {
  if (!Number.isFinite(value)) return null;
  for (const t of targets) {
    if (Math.abs(value - t.value) < t.band) return t;
  }
  return null;
};

/** Every finite number reachable inside a value, with the path it sits at. */
export const collectNumbers = (value, path = '', out = [], depth = 0) => {
  if (depth > 12) return out;
  if (typeof value === 'number') {
    if (Number.isFinite(value)) out.push({ path, value });
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectNumbers(v, `${path}[${i}]`, out, depth + 1));
    return out;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => collectNumbers(v, path ? `${path}.${k}` : k, out, depth + 1));
  }
  return out;
};
