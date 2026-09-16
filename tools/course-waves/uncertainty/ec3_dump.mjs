// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of screening_cases.json and
// breakeven_cases.json (plus sweeps and probes around those published inputs,
// and the TEACHING FIELDS this wave designed for itself: ISIALA, OKPOMA and
// NTEJE). THE EC3 CAPSTONE RUNS DIFFERENT CONDITIONS ENTIRELY: nothing here
// imports, reads or reproduces ec3_fields.mjs, fields.json, or any capstone
// field name, volume, price, cost, rate, seed or year. The teaching digest and
// the capstone are two files with opposite audiences and never share a number.
//
// Usage:  sh /root/ec-wip-uncertainty/build_digest.sh > /root/ec-wip-uncertainty/digest.tmp \
//           && mv /root/ec-wip-uncertainty/digest.tmp /root/ec-wip-uncertainty/digest.txt
//         (always through a temp file, and with TZ=UTC)
//
// Engines: packages/engines/engines/economics/screening.js (the NPV Scenario
//          Builder) and breakeven.js (the Probabilistic Breakeven Analyzer),
//          with lib/stats/stats.js, as repaired in EC3-0 (engines #174), in the
//          EC6-1 IRR repair (engines #180) and in the EC3 wave findings of
//          2026-09-15 (engines #182, with the #187 performance pass).
// Retired: retired/ holds a frozen copy of the engines that built the
//          PUBLISHED digest of 2026-09-14 (digest.published-2026-09-14.txt).
//          It is imported ONLY for lines that begin "History, before the
//          2026-09-15 repair". Every other line describes the engines as they
//          are now.
// Words:   lib/conventions/percentile.js (engines #175), the Suite percentile
//          convention.
// Goldens: packages/engines/test-data/economics/goldens/{screening,breakeven}_cases.json
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from a published case's expected block and printed
// beside the engine's own value), "oracle" (a golden's recorded disagreement)
// or "derived" (arithmetic on engine values printed on the SAME row, with the
// arithmetic stated), or the line begins "History, before the 2026-09-15
// repair" (a return value of the RETIRED engine in retired/, on the same
// inputs). Nothing else is computed here.

import fs from 'fs';

const ROOT = process.env.EC3_ENGINES || '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen-ec3/packages/engines';
const CONV = process.env.EC3_CONVENTIONS
  || (fs.existsSync(`${ROOT}/lib/conventions/percentile.js`) ? `${ROOT}/lib/conventions/percentile.js` : '/root/wt-pconv-engines/lib/conventions/percentile.js');
const S = await import(`${ROOT}/engines/economics/screening.js`);
const B = await import(`${ROOT}/engines/economics/breakeven.js`);
const ST = await import(`${ROOT}/lib/stats/stats.js`);
const PC = await import(CONV);
const RETIRED = process.env.EC3_RETIRED || '/root/ec-wip-uncertainty/retired';
const SR = await import(`${RETIRED}/engines/economics/screening.js`);
const BR = await import(`${RETIRED}/engines/economics/breakeven.js`);
const HISTORY = 'History, before the 2026-09-15 repair (the retired engine that built the published digest, older than engines #180 and #182, on the same inputs):';
const GS = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/screening_cases.json`, 'utf8'));
const GB = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/breakeven_cases.json`, 'utf8'));

const out = [];
const w = (s = '') => out.push(s);
const f = (x, n = 2) => (x === null || x === undefined || Number.isNaN(Number(x))) ? 'null' : Number(x).toFixed(n);
const m = (x) => f(x, 4);   // money, $MM
const r = (x) => f(x, 6);   // ratios, fractions, draws
const p = (x) => f(x, 4);   // percent and $/bbl
const clone = (o) => JSON.parse(JSON.stringify(o));
const byId = (list) => Object.fromEntries(list.map((c) => [c.id, c]));
const SC = Object.fromEntries(Object.entries(GS).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, byId(v)]));
const BC = { monteCarlo: byId(GB.monteCarlo), solve: byId(GB.solve) };

// ---------------------------------------------------------------- the fields
// THE TEACHING FIELD. Scenario Builder quick inputs near the app's own
// defaults; the same field's oil profile feeds the Breakeven Analyzer.
const ISIALA = { initialRate: 4400, declineRate: 12, oilPrice: 70, capex: 180, fixedOpex: 2.5, opexPerBbl: 13, royaltyRate: 15, taxRate: 35, discountRate: 12, startYear: 2027 };
// ISIALA's breakeven beliefs: three exact fits, and one narrow opex belief
// that no triangular can honour.
const BELIEF = { capex: [150, 180, 220], opex: [16, 20, 26], eff: [85, 91, 96] };
const NARROW_OPEX = [16, 17, 26];
// Two edge fields. OKPOMA is cash positive in its first year and dips below
// zero in its second: payback (the first crossing) is 0, paybackStatus is
// 'recrossed' and paybackLast says where it turns non-negative for good; its
// only IRR root is negative and the engine now reports it. NTEJE never pays
// back (payback null, 'not-recovered') and no rate zeroes its NPV (irr null,
// 'no-root'). Before the repairs both reported the 1000 percent clamp.
const OKPOMA = { initialRate: 6800, declineRate: 18, oilPrice: 78, capex: 260, fixedOpex: 4, opexPerBbl: 10, royaltyRate: 10, taxRate: 40, discountRate: 10, startYear: 2027 };
const NTEJE = { initialRate: 3000, declineRate: 20, oilPrice: 66, capex: 240, fixedOpex: 6, opexPerBbl: 14, royaltyRate: 15, taxRate: 30, discountRate: 12, startYear: 2027 };
const APP_MC = { iterations: 1000, uncertainties: { price: 0.2, capex: 0.2, reserves: 0.2 } };

const quickLine = (q) => `${q.initialRate} bopd declining ${q.declineRate} percent a year, oil ${q.oilPrice} USD/bbl, capex ${q.capex} $MM (half in each of the first two years), fixed opex ${q.fixedOpex} $MM a year, variable opex ${q.opexPerBbl} USD/bbl, royalty ${q.royaltyRate} percent, tax ${q.taxRate} percent, discount rate ${q.discountRate} percent, first year ${q.startYear}`;
const isiala = S.expandQuickInputs(ISIALA);
const isialaRes = S.calculateEconomics(isiala);
const rowsOf = (inp, y0) => inp.production.oil.map((q, i) => ({ year: y0 + i, oil_production_bbl: q }));
const ISIALA_ROWS = rowsOf(isiala, ISIALA.startYear);
const beInputs = (belief, opex = belief.opex, extra = {}) => ({
  iterations: 5000, seed: B.DEFAULT_SEED, discountRate: ISIALA.discountRate, royaltyRate: ISIALA.royaltyRate, taxRate: ISIALA.taxRate, targetNpv: 0,
  productionData: { data: ISIALA_ROWS },
  variables: [
    { id: 1, name: 'Total CAPEX ($MM)', p10: belief.capex[0], p50: belief.capex[1], p90: belief.capex[2] },
    { id: 2, name: 'Annual OPEX ($MM/year)', p10: opex[0], p50: opex[1], p90: opex[2] },
    { id: 3, name: 'Production Efficiency (%)', p10: belief.eff[0], p50: belief.eff[1], p90: belief.eff[2] },
  ],
  ...extra,
});
const BASE_ARGS = { rows: ISIALA_ROWS, discountRate: ISIALA.discountRate, royaltyRate: ISIALA.royaltyRate, taxRate: ISIALA.taxRate };

const LEDGER = ['year', 'grossRevenue', 'royalty', 'capex', 'opex', 'depreciation', 'tax', 'ncf', 'cumulativeNCF', 'govTake'];
const ledgerTable = (cashflow, cols = LEDGER, pick = (i) => true) => {
  w(`| ${cols.join(' | ')} |`);
  w(`| ${cols.map(() => '---').join(' | ')} |`);
  cashflow.forEach((row, i) => { if (pick(i)) w(`| ${cols.map((c) => (c === 'year' ? String(row[c]) : m(row[c]))).join(' | ')} |`); });
};
// IRR and payback carry the status the engine returns beside the number
// (EC6-1 and EC3-1/EC3-2): a null IRR or payback is never printed without it.
const isNum = (x) => x !== null && x !== undefined && !Number.isNaN(Number(x));
const irrText = (mt) => (isNum(mt.irr)
  ? `irr ${p(mt.irr)} percent (irrStatus ${mt.irrStatus})`
  : `irr null (irrStatus ${mt.irrStatus}${mt.irrRoots && mt.irrRoots.length ? `, irrRoots ${mt.irrRoots.map(p).join(' and ')} percent` : ''})`);
const paybackText = (mt) => (isNum(mt.payback)
  ? `payback ${p(mt.payback)} years (paybackStatus ${mt.paybackStatus}${mt.paybackStatus === 'recrossed' ? `, paybackLast ${p(mt.paybackLast)}` : ''})`
  : `payback null (paybackStatus ${mt.paybackStatus})`);
// A golden IRR note written before the EC6-1 IRR repair still describes the
// retired Newton answer. Such a note is printed as history, never as the
// engine's present behaviour.
const STALE_IRR_NOTE = /reports the clamp|lands on one of them|starting guess/;
const irrNote = (c) => (STALE_IRR_NOTE.test(c.note)
  ? `Golden note, kept as published and written before the EC6-1 IRR repair (engines #180), so its engine sentence is history: "${c.note}"`
  : c.note);
const beliefsText = (b) => ['capex', 'opex', 'efficiency'].map((k) => `${k} ${m(b[k].p10)} / ${m(b[k].p50)} / ${m(b[k].p90)} (${b[k].source})`).join('; ');
const metricsLine = (mt) => `npv ${m(mt.npv)}, ${irrText(mt)}, ${paybackText(mt)}, maxExposure ${m(mt.maxExposure)}, totalRevenue ${m(mt.totalRevenue)}, totalCapex ${m(mt.totalCapex)}, totalOpex ${m(mt.totalOpex)}, totalRoyalty ${m(mt.totalRoyalty)}, totalTax ${m(mt.totalTax)}, totalGovTake ${m(mt.totalGovTake)}`;

// ------------------------------------------------------------------ header
w('# EC3 Probabilistic Economics. The teaching digest.');
w();
w('Every number below is a return value of the screening engine, the breakeven engine or lib/stats, run on the published goldens and on this wave\'s teaching fields, unless its line says golden, oracle or derived. Money is $MM to four decimals, prices USD/bbl to four, ratios and random draws to six. Percentile words follow lib/conventions/percentile.js.');
w('The engines are those repaired on 2026-09-15 (engines #182, after the EC6-1 IRR repair #180). A line that begins "History, before the 2026-09-15 repair" is the retired engine run on the same inputs, kept so a lesson can say what changed; every other line describes the engines as they are now.');
w();

// --------------------------------------------------------------- Section 1
w('# SECTION 1: The screening engine, its conventions, and what it refuses to be (owned by Associate m01)');
w();
w('- Discounting is MID-YEAR: year index i is discounted by (1 + rate/100)^(i + 0.5).');
w('- The quick form always builds a 20 year case (expandQuickInputs life 20), TaxRoyalty only, gas volume 0 at a gas price of 3.5, capex split 50/50 over the first two years, fixed opex flat, variable opex = oil volume x USD/bbl / 1e6.');
w('- Units: production in bbl a year, prices USD/bbl, money $MM (volume x price / 1e6), rates in percent 0 to 100.');
w('- There is NO economic limit: every year of the life is produced and charged, including years whose net cash flow is negative.');
w('- The Monte Carlo is seeded: runMonteCarlo draws from mulberry32(settings.seed), default DEFAULT_MC_SEED ' + S.DEFAULT_MC_SEED + '; the breakeven default seed is DEFAULT_SEED ' + B.DEFAULT_SEED + '.');
w('- It is a SCREENING engine: no PIA terms, no cost oil in the quick form, no working interest, no inflation basis. Those live in Petroleum Economics Studio (the EC1 course).');
w();
const lastLoss = S.expandQuickInputs(OKPOMA);
const okRes = S.calculateEconomics(lastLoss);
const okLossYears = okRes.cashflow.filter((x, i) => i >= 2 && x.ncf < 0).map((x) => x.year);
w(`No economic limit, read off the edge field OKPOMA (${quickLine(OKPOMA)}): years after the two capex years with negative net cash flow: ${okLossYears.join(', ') || 'none'}; year 20 ncf ${m(okRes.cashflow[19].ncf)} on gross revenue ${m(okRes.cashflow[19].grossRevenue)} and opex ${m(okRes.cashflow[19].opex)}.`);
w();

// --------------------------------------------------------------- Section 2
w('# SECTION 2: ISIALA, the teaching field, from quick inputs to a case (owned by Associate m02)');
w();
w(`ISIALA quick inputs: ${quickLine(ISIALA)}.`);
w();
w(`Expanded: projectLife ${isiala.projectLife}, fiscalType ${isiala.fiscalType}, royaltyRate ${isiala.royaltyRate}, taxRate ${isiala.taxRate}, discountRate ${isiala.discountRate}.`);
w();
w('| year | oil bbl | oil price | gas price | capex | opexFixed | opexVariable |');
w('| --- | --- | --- | --- | --- | --- | --- |');
isiala.production.oil.forEach((q, i) => w(`| ${ISIALA.startYear + i} | ${f(q, 4)} | ${p(isiala.price.oil[i])} | ${p(isiala.price.gas[i])} | ${m(isiala.capex[i])} | ${m(isiala.opexFixed[i])} | ${m(isiala.opexVariable[i])} |`));
w();
w(`Decline, year on year: year 2 over year 1 = ${r(isiala.production.oil[1] / isiala.production.oil[0])} (derived), year 20 over year 1 = ${r(isiala.production.oil[19] / isiala.production.oil[0])} (derived).`);
w();

// --------------------------------------------------------------- Section 3
w('# SECTION 3: The ISIALA ledger, all twenty rows (owned by Associate m03)');
w();
ledgerTable(isialaRes.cashflow);
w();
w(`Totals: ${metricsLine(isialaRes.metrics)}.`);
w(`Years with positive tax: ${isialaRes.cashflow.filter((x) => x.tax > 0).length} of 20; years with zero tax: ${isialaRes.cashflow.filter((x) => x.tax === 0).map((x) => x.year).join(', ')}.`);
w();

// --------------------------------------------------------------- Section 4
w('# SECTION 4: The published royalty and tax cases, and depreciation (owned by Associate m03)');
w();
for (const id of ['tr_hand_2yr', 'tr_hand_2yr_depr2', 'tr_base_10yr', 'tr_gas_and_oil', 'tr_missing_profiles']) {
  const c = SC.taxRoyalty[id];
  const res = S.calculateEconomics(c.inputs);
  w(`## ${id}: ${c.note}`);
  ledgerTable(res.cashflow, LEDGER, (i) => res.cashflow.length <= 4 || i < 3 || i === res.cashflow.length - 1);
  w(`Engine metrics: ${metricsLine(res.metrics)}.`);
  if (c.engine) w(`Oracle disagreement recorded in the golden: ${JSON.stringify(c.engine).slice(0, 300)}.`);
  w();
}
w('Depreciation, one line each (capexDepreciationYears changes the tax base only; cash capex is always in year):');
w();
w('| case | note | npv | irr | irrStatus | payback | paybackStatus | totalTax |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const c of GS.depreciation) {
  const res = S.calculateEconomics(c.inputs);
  w(`| ${c.id} | ${c.note} | ${m(res.metrics.npv)} | ${p(res.metrics.irr)} | ${res.metrics.irrStatus} | ${p(res.metrics.payback)} | ${res.metrics.paybackStatus} | ${m(res.metrics.totalTax)} |`);
}
w();

// --------------------------------------------------------------- Section 5
w('# SECTION 5: Value from a ledger: discounting, NPV, payback, IRR, exposure (owned by Associate m04)');
w();
w('ISIALA discount factors at 12 percent, mid-year (engine convention, derived as (1.12)^(i + 0.5)) beside each year\'s discounted cash flow:');
w();
w('| year | ncf | factor | discounted ncf (derived) |');
w('| --- | --- | --- | --- |');
isialaRes.cashflow.slice(0, 6).forEach((row, i) => {
  const fac = Math.pow(1 + ISIALA.discountRate / 100, i + 0.5);
  w(`| ${row.year} | ${m(row.ncf)} | ${r(fac)} | ${m(row.ncf / fac)} |`);
});
w();
w(`ISIALA metrics: npv ${m(isialaRes.metrics.npv)}, ${irrText(isialaRes.metrics)}, ${paybackText(isialaRes.metrics)}, paybackLast ${p(isialaRes.metrics.paybackLast)}, maxExposure ${m(isialaRes.metrics.maxExposure)}.`);
w('The four payback statuses: ok (the cumulative crosses zero once and stays non-negative), recrossed (it turns non-negative and later goes back below zero; payback stays the FIRST crossing and paybackLast is where it turns non-negative for good, null if it never does), no-investment (never negative, payback 0), not-recovered (never non-negative, payback null). The five IRR statuses: ok, no-sign-change, no-root, above-clamp (still positive at 1000 percent), multiple-roots (every root listed in irrRoots, irr null).');
const firstPos = isialaRes.cashflow.findIndex((x) => x.cumulativeNCF >= 0);
w(`Payback read by hand: the cumulative first reaches zero in year index ${firstPos} (${isialaRes.cashflow[firstPos].year}); the shortfall carried in is ${m(isialaRes.cashflow[firstPos - 1].cumulativeNCF)} and that year's ncf is ${m(isialaRes.cashflow[firstPos].ncf)}, so payback = ${firstPos} + ${m(Math.abs(isialaRes.cashflow[firstPos - 1].cumulativeNCF))} / ${m(isialaRes.cashflow[firstPos].ncf)} = ${p(firstPos + Math.abs(isialaRes.cashflow[firstPos - 1].cumulativeNCF) / isialaRes.cashflow[firstPos].ncf)} (derived, equals the engine's payback).`);
w();
w('Published payback cases:');
const lastCrossing = (cf) => {
  let L = -1; cf.forEach((x, i) => { if (x.cumulativeNCF < 0) L = i; });
  if (L < 0 || L === cf.length - 1) return null;
  return `${L + 1} + ${m(Math.abs(cf[L].cumulativeNCF))} / ${m(cf[L + 1].ncf)} = ${p(L + 1 + Math.abs(cf[L].cumulativeNCF) / cf[L + 1].ncf)}`;
};
for (const c of GS.payback) {
  const res = S.calculateEconomics(c.inputs);
  const chk = res.metrics.paybackStatus === 'recrossed' ? lastCrossing(res.cashflow) : null;
  w(`- ${c.id}: ${c.note} Engine ${paybackText(res.metrics)}${res.metrics.paybackStatus === 'recrossed' ? '' : `, paybackLast ${p(res.metrics.paybackLast)}`}, maxExposure ${m(res.metrics.maxExposure)}; cumulative ${res.cashflow.map((x) => m(x.cumulativeNCF)).join(', ')}${chk ? `; paybackLast by hand ${chk} (derived)` : ''}.`);
}
w();
w('Published IRR cases (engine beside the golden; the golden lists every root the oracle found):');
for (const c of GS.irr) {
  const res = S.calculateEconomics(c.inputs);
  w(`- ${c.id}: ${irrNote(c)} Engine ${irrText(res.metrics)}; golden irr ${p(c.expected.metrics.irr)}, golden irrStatus ${c.expected.metrics.irrStatus}, golden roots ${JSON.stringify(c.expected.metrics.irrRoots)}${c.engine ? `; recorded engine value ${JSON.stringify(c.engine).slice(0, 160)}` : ''}.`);
}
w();
w('Published sweeps on the 10 year base case, one line each:');
w();
w('| case | npv | irr | irrStatus | irrRoots | payback | paybackStatus |');
w('| --- | --- | --- | --- | --- | --- | --- |');
for (const c of GS.sweeps) { const res = S.calculateEconomics(c.inputs); const mt = res.metrics; w(`| ${c.id} | ${m(mt.npv)} | ${p(mt.irr)} | ${mt.irrStatus} | ${mt.irrRoots ? mt.irrRoots.map(p).join(' and ') : 'none'} | ${p(mt.payback)} | ${mt.paybackStatus} |`); }
w();

// --------------------------------------------------------------- Section 6
w('# SECTION 6: One number becomes three: sensitivity and scenarios (owned by Associate m05)');
w();
const isSens = S.runSensitivityAnalysis(isiala);
w('ISIALA runSensitivityAnalysis (each input scaled by 0.7 and 1.3, NPV at each end):');
w();
w('| input | NPV at 0.7 | base NPV | NPV at 1.3 | swing, high minus low (derived) |');
w('| --- | --- | --- | --- | --- |');
isSens.forEach((s) => w(`| ${s.name} | ${m(s.lowParamNPV)} | ${m(s.baseNPV)} | ${m(s.highParamNPV)} | ${m(s.highParamNPV - s.lowParamNPV)} |`));
w();
w('What each bar scales: Oil Price scales price.oil; CAPEX scales capex; OPEX scales opexFixed ONLY (opexVariable is untouched); Production scales production.oil AND opexVariable, so the variable opex follows the volume (EC6-1, engines #180).');
const isSensOld = SR.runSensitivityAnalysis(isiala).find((s) => s.name === 'Production');
w(`${HISTORY} the Production bar scaled production.oil alone and read ${m(isSensOld.lowParamNPV)} at 0.7 and ${m(isSensOld.highParamNPV)} at 1.3.`);
w();
const isSc = S.generateScenarios(isiala);
w('ISIALA generateScenarios (Low: price, production and variable opex x0.8, capex and fixed opex x1.2; High: the mirror):');
for (const k of ['Low', 'Base', 'High']) w(`- ${k}: ${metricsLine(isSc[k].metrics)}.`);
const isScOld = SR.generateScenarios(isiala);
w(`${HISTORY} the Low and High cases scaled production without its variable opex (EC3-3): Low npv ${m(isScOld.Low.metrics.npv)}, totalOpex ${m(isScOld.Low.metrics.totalOpex)}; High npv ${m(isScOld.High.metrics.npv)}, totalOpex ${m(isScOld.High.metrics.totalOpex)}.`);
w();
const sensG = SC.sensitivity.sens_base_10yr;
w(`Published sens_base_10yr (${sensG.note}): ${S.runSensitivityAnalysis(sensG.inputs).map((s) => `${s.name} ${m(s.lowParamNPV)}..${m(s.highParamNPV)}`).join('; ')}.`);
const scG = SC.scenarios.scen_base_10yr;
const scRes = S.generateScenarios(scG.inputs);
w(`Published scen_base_10yr: Low npv ${m(scRes.Low.metrics.npv)}, Base npv ${m(scRes.Base.metrics.npv)}, High npv ${m(scRes.High.metrics.npv)}.`);
w();

// --------------------------------------------------------------- Section 7
w('# SECTION 7: Percentiles are not endpoints: the triangular fit (owned by Professional m01)');
w();
const fitLine = (name, t, fit) => `| ${name} | ${t.join(' / ')} | ${r((t[1] - t[0]) / (t[2] - t[0]))} | ${m(fit.min)} | ${m(fit.mode)} | ${m(fit.max)} | ${r((fit.mode - fit.min) / (fit.max - fit.min))} | ${fit.exact} |`;
w('ISIALA beliefs fitted by fitTriangularToPercentiles. The shape ratio is (50th - 10th) / (90th - 10th) of the stated belief (derived); m is the mode\'s position in the fitted range (derived).');
w();
w('| variable | stated 10th / 50th / 90th | shape ratio | min | mode | max | m | exact |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
const fits = {
  capex: ST.fitTriangularToPercentiles(...BELIEF.capex),
  opex: ST.fitTriangularToPercentiles(...BELIEF.opex),
  efficiency: ST.fitTriangularToPercentiles(...BELIEF.eff),
  narrowOpex: ST.fitTriangularToPercentiles(...NARROW_OPEX),
};
w(fitLine('capex $MM', BELIEF.capex, fits.capex));
w(fitLine('opex $MM/yr', BELIEF.opex, fits.opex));
w(fitLine('efficiency %', BELIEF.eff, fits.efficiency));
w(fitLine('opex, narrow belief', NARROW_OPEX, fits.narrowOpex));
w();
w(`Narrow belief note (engine): ${fits.narrowOpex.note}`);
w();
const rMin = ((ST.triInvCDF(0.5, 0, 0, 1) - ST.triInvCDF(0.1, 0, 0, 1)) / (ST.triInvCDF(0.9, 0, 0, 1) - ST.triInvCDF(0.1, 0, 0, 1)));
const rMax = ((ST.triInvCDF(0.5, 0, 1, 1) - ST.triInvCDF(0.1, 0, 1, 1)) / (ST.triInvCDF(0.9, 0, 1, 1) - ST.triInvCDF(0.1, 0, 1, 1)));
w(`The reachable band of the shape ratio, from triInvCDF on the unit triangle (derived): mode at the minimum ${r(rMin)}, mode at the maximum ${r(rMax)}.`);
w();
w('Check the capex fit passes through the stated beliefs, triInvCDF of the fitted triangle at 0.1, 0.5 and 0.9:');
w(`- fitted: ${[0.1, 0.5, 0.9].map((u) => m(ST.triInvCDF(u, fits.capex.min, fits.capex.mode, fits.capex.max))).join(', ')}`);
w(`- THE OLD ERROR, the beliefs used as minimum / mode / maximum, read at 0.1, 0.5 and 0.9: ${[0.1, 0.5, 0.9].map((u) => m(ST.triInvCDF(u, BELIEF.capex[0], BELIEF.capex[1], BELIEF.capex[2]))).join(', ')}`);
w();
const inex = BC.monteCarlo.mc_inexact_fit_note;
const inexRes = B.generateBreakevenData(inex.inputs);
w(`Published mc_inexact_fit_note (${inex.note}): fits ${JSON.stringify(inexRes.distributionFits)}.`);
w(`Its beliefs, the 10th / 50th / 90th percentiles the base case and the tornado use (EC3-5; stated when a fit is exact, the fitted triangle's own when it clamps): ${beliefsText(inexRes.beliefs)}; base ${p(inexRes.baseBreakeven)}.`);
w(`${HISTORY} the base case read the stated medians whatever the fit: base ${p(BR.generateBreakevenData(inex.inputs).baseBreakeven)}.`);
w();

// --------------------------------------------------------------- Section 8
w('# SECTION 8: Sampling: the inverse CDF, the seeded generator, three draws in order (owned by Professional m02)');
w();
const rng = ST.mulberry32(B.DEFAULT_SEED);
const draws = Array.from({ length: 6 }, () => rng());
w(`mulberry32(${B.DEFAULT_SEED}), first six draws: ${draws.map(r).join(', ')}.`);
w();
w('Iteration 1 of ISIALA\'s breakeven run takes draws 1, 2 and 3 in the order capex, opex, efficiency:');
w();
w('| draw | u | variable | F(mode) (derived) | branch | sampled value |');
w('| --- | --- | --- | --- | --- | --- |');
[['capex', fits.capex], ['opex', fits.opex], ['efficiency', fits.efficiency]].forEach(([name, fit], i) => {
  const Fm = (fit.mode - fit.min) / (fit.max - fit.min);
  w(`| ${i + 1} | ${r(draws[i])} | ${name} | ${r(Fm)} | ${draws[i] <= Fm ? 'lower' : 'upper'} | ${m(ST.triInvCDF(draws[i], fit.min, fit.mode, fit.max))} |`);
});
w();
const beMain = B.generateBreakevenData(beInputs(BELIEF));
const beAgain = B.generateBreakevenData(beInputs(BELIEF));
const beSeed7 = B.generateBreakevenData(beInputs(BELIEF, BELIEF.opex, { seed: 7 }));
w(`Same seed, same answer: two runs at seed ${beMain.seed} give identical samples: ${JSON.stringify(beMain.plotData.histogram.x) === JSON.stringify(beAgain.plotData.histogram.x)}.`);
w(`A different seed (7): median ${p(beSeed7.kpis.p50)} against ${p(beMain.kpis.p50)} at the default seed.`);
w();

// --------------------------------------------------------------- Section 9
w('# SECTION 9: The breakeven price (owned by Professional m03)');
w();
const baseArgs = { ...BASE_ARGS, capexMM: BELIEF.capex[1], opexMM: BELIEF.opex[1], efficiency: BELIEF.eff[1] / 100 };
w(`ISIALA base case at the beliefs' medians (every ISIALA fit is exact, so the beliefs are the stated ones: ${beliefsText(beMain.beliefs)}): capex ${BELIEF.capex[1]} $MM, opex ${BELIEF.opex[1]} $MM a year, efficiency ${BELIEF.eff[1] / 100}; breakeven to NPV 0: ${p(B.solveBreakevenPrice(baseArgs, 0))} USD/bbl.`);
w();
w('| oil price | NPV through the breakeven engine |');
w('| --- | --- |');
for (const price of [20, 40, 60, 70, 80, 100, 150]) w(`| ${price} | ${m(B.npvAtPrice({ ...baseArgs, price }))} |`);
w();
w(`A hurdle above zero: breakeven to NPV 100 $MM ${p(B.solveBreakevenPrice(baseArgs, 100))}; to NPV 250 $MM ${p(B.solveBreakevenPrice(baseArgs, 250))}; NPV at the 500 USD/bbl bracket top ${m(B.npvAtPrice({ ...baseArgs, price: 500 }))}.`);
w();
w('Where tax switches on, year by year: the price at which that year\'s taxable income crosses zero, (opex + capex expensed that year) / ((1 - royalty) x volume x efficiency) x 1e6 (derived from the engine inputs; this is the oracle\'s closed-form kink):');
w(`- years 1 to 20 (the breakeven engine places ALL capex in year 1 and expenses it there, so year 1 carries capex too): ${ISIALA_ROWS.map((row, i) => p(((BELIEF.opex[1] + (i === 0 ? BELIEF.capex[1] : 0)) / ((1 - ISIALA.royaltyRate / 100) * row.oil_production_bbl * (BELIEF.eff[1] / 100))) * 1e6)).join(', ')}.`);
w(`- note: the Breakeven Analyzer builds its case with all capex in year 1 and opex flat, unlike the quick form's 50/50 capex split; ${ISIALA_ROWS.length} kinks, one per year.`);
w();
w('Published solve cases, one line each (engine price beside the golden\'s closed-form price):');
for (const c of GB.solve) {
  const got = B.solveBreakevenPrice(c.args, c.targetNpv ?? 0);
  w(`- ${c.id}: ${c.note} Engine ${p(got)}; golden ${p(c.expected.price)}.`);
}
w();

// -------------------------------------------------------------- Section 10
w('# SECTION 10: Reading the sample (owned by Professional m04)');
w();
const n = beMain.plotData.histogram.x.length;
const sorted = beMain.plotData.cdf.x;
const at = (q) => Math.min(n - 1, Math.floor(q * n));
w(`ISIALA breakeven run: ${n} iterations at seed ${beMain.seed}, excluded ${beMain.excludedIterations}, clippedDraws capex ${beMain.clippedDraws.capex}, opex ${beMain.clippedDraws.opex}, efficiency ${beMain.clippedDraws.efficiency}.`);
w();
w('| statistic | sorted index (derived, min(n - 1, floor(q n))) | breakeven price |');
w('| --- | --- | --- |');
w(`| ${PC.parameterPercentileLabel('breakeven price', 'q10')} | ${at(0.1)} | ${p(beMain.kpis.p10)} |`);
w(`| ${PC.parameterPercentileLabel('breakeven price', 'q50')} | ${at(0.5)} | ${p(beMain.kpis.p50)} |`);
w(`| ${PC.parameterPercentileLabel('breakeven price', 'q90')} | ${at(0.9)} | ${p(beMain.kpis.p90)} |`);
w(`| mean | all | ${p(beMain.kpis.mean)} |`);
w(`| base case at the beliefs' medians (stated here) | none | ${p(beMain.baseBreakeven)} |`);
w();
w(`Sample extremes: lowest ${p(sorted[0])}, highest ${p(sorted[n - 1])}. S-curve y at index i is (i + 1) / n: at index ${at(0.5)}, y ${r(beMain.plotData.cdf.y[at(0.5)])}.`);
w(`Mean minus median (derived): ${p(beMain.kpis.mean - beMain.kpis.p50)}.`);
w(`Engine insight: ${beMain.insights}`);
w();
const unr = BC.monteCarlo.mc_with_unreachable;
const unrRes = B.generateBreakevenData(unr.inputs);
w(`Published mc_with_unreachable (${unr.note}): ${unrRes.excludedIterations} of ${unr.inputs.iterations} excluded; 10th ${p(unrRes.kpis.p10)}, median ${p(unrRes.kpis.p50)}, 90th ${p(unrRes.kpis.p90)}.`);
const allUnr = BC.monteCarlo.mc_all_unreachable_throws;
let thrown = null; try { B.generateBreakevenData(allUnr.inputs); } catch (e) { thrown = e.message; }
w(`Published mc_all_unreachable_throws (${allUnr.note}): engine error "${thrown}".`);
w();
w('Published breakeven Monte Carlo cases, one line each:');
for (const c of GB.monteCarlo) {
  if (c.expected.throws) continue;
  const res = B.generateBreakevenData(c.inputs);
  w(`- ${c.id}: ${c.note} seed ${res.seed}, ${c.inputs.iterations} iterations: 10th ${p(res.kpis.p10)}, median ${p(res.kpis.p50)}, 90th ${p(res.kpis.p90)}, mean ${p(res.kpis.mean)}, base ${p(res.baseBreakeven)}, excluded ${res.excludedIterations}; beliefs source capex ${res.beliefs.capex.source}, opex ${res.beliefs.opex.source}, efficiency ${res.beliefs.efficiency.source}; clippedDraws ${res.clippedDraws.capex} / ${res.clippedDraws.opex} / ${res.clippedDraws.efficiency}.`);
}
const refusedBe = GB.monteCarlo.filter((c) => c.expected.refused);
w(`Refused beliefs (EC3-8), the engine's own error for each published case: ${refusedBe.map((c) => { let e = null; try { B.generateBreakevenData(c.inputs); } catch (err) { e = err.message; } return `${c.id} "${e}"`; }).join('; ')}.`);
w();

// -------------------------------------------------------------- Section 11
w('# SECTION 11: The two-sided tornado (owned by Professional m05)');
w();
w('ISIALA tornado, each variable swung between the 10th and 90th percentiles in beliefs (the stated ones when its fit is exact, the fitted triangle\'s own when it clamps) with the others at the beliefs\' medians; low and high are measured from the base breakeven. A side with no breakeven below 500 USD/bbl is null, its bar is unreachable, and unreachable bars sort FIRST:');
w();
w('| rank | variable | low side | high side | swing | unreachable |');
w('| --- | --- | --- | --- | --- | --- |');
beMain.tornadoData.y.forEach((name, i) => w(`| ${i + 1} | ${name} | ${p(beMain.tornadoData.low[i])} | ${p(beMain.tornadoData.high[i])} | ${p(beMain.tornadoData.high[i] - beMain.tornadoData.low[i])} | ${beMain.tornadoData.unreachable[i]} |`));
w();
w(`Efficiency runs backwards: its low-price end comes from the 90th percentile efficiency (${BELIEF.eff[2]}), its high-price end from the 10th (${BELIEF.eff[0]}).`);
const tornadoText = (td) => td.y.map((name, i) => `${name} low ${p(td.low[i])} high ${p(td.high[i])} unreachable ${td.unreachable ? td.unreachable[i] : 'not reported'}`).join('; ');
w(`Published mc_with_unreachable tornado (B1): ${tornadoText(unrRes.tornadoData)}.`);
const oneBar = BC.monteCarlo.mc_one_bar_unreachable;
const oneBarRes = B.generateBreakevenData(oneBar.inputs);
w(`Published mc_one_bar_unreachable tornado (B1), in the engine's order: ${tornadoText(oneBarRes.tornadoData)}.`);
w(`${HISTORY} an end with no breakeven was drawn at 0 with a zero swing and its bar sorted LAST; mc_one_bar_unreachable read, in that engine's order: ${tornadoText(BR.generateBreakevenData(oneBar.inputs).tornadoData)}.`);
w();

// -------------------------------------------------------------- Section 12
w('# SECTION 12: One meaning of a P-label (owned by Expert m01)');
w();
w(`- Definition (lib/conventions/percentile.js): ${PC.EXCEEDANCE_DEFINITION}`);
w(`- Cases, low to high: ${PC.CASES.map((c) => `${c.label} = ${PC.OUTCOME_LABELS[c.outcome]}`).join(', ')}.`);
w(`- A quantity where more is better (NPV): low case takes its ${PC.parameterPercentileLabel(null, PC.casePercentile('low', true))}; ${PC.caseLabel('low', 'NPV', true)}.`);
w(`- A quantity where more is worse (a breakeven price): no P-label at all; it is described as ${PC.parameterPercentileLabel('breakeven price', 'q10')}, ${PC.parameterPercentileLabel('breakeven price', 'q50')}, ${PC.parameterPercentileLabel('breakeven price', 'q90')}.`);
w(`- Parameters (capex, opex, efficiency) take percentiles too: ${PC.parameterPercentileLabel('capex', 'q10')}.`);
w();
const isMc = await S.runMonteCarlo(isiala, APP_MC);
w(`ISIALA through the Scenario Builder's Monte Carlo (the app's settings: ${APP_MC.iterations} iterations, price, capex and reserves each plus or minus ${APP_MC.uncertainties.price * 100} percent, seed ${isMc.seed}):`);
w();
w('| case | P-label | engine key | NPV |');
w('| --- | --- | --- | --- |');
w(`| Low case | ${PC.OUTCOME_LABELS.p90} | p10 | ${m(isMc.p10)} |`);
w(`| Best case | ${PC.OUTCOME_LABELS.p50} | p50 | ${m(isMc.p50)} |`);
w(`| High case | ${PC.OUTCOME_LABELS.p10} | p90 | ${m(isMc.p90)} |`);
w();
w(`THE SWAP EC3-0 FIXED: the old results panel printed the p90 key under "P90 (Conservative)", which on ISIALA is ${m(isMc.p90)}, and the p10 key under "P10 (Optimistic)", which is ${m(isMc.p10)}. The card called conservative held the larger number.`);
w();

// -------------------------------------------------------------- Section 13
w('# SECTION 13: The Scenario Builder\'s Monte Carlo (owned by Expert m02)');
w();
w('- Sampling: ONE factor per uncertain variable per iteration, uniform on [1 - r, 1 + r], applied to every year; drawn in the order reserves, price, capex, with a falsy range drawing nothing (EC3-7).');
w('- reserves scales oil AND gas volumes AND the variable opex those volumes carry; price scales oil AND gas prices; capex scales every capex entry; fixed opex, royalty and tax are never sampled.');
const refusedMc = [];
for (const c of GS.monteCarloRefused) { let e = null; try { await S.runMonteCarlo(c.inputs, c.settings); } catch (err) { e = err.message; } refusedMc.push(`${c.id} "${e}"`); }
w(`- A range outside 0 to 1 is refused (EC3-7), the engine's own error for each published case: ${refusedMc.join('; ')}.`);
w(`- ISIALA run: ${isMc.iterations} iterations, seed ${isMc.seed}, emv ${m(isMc.emv)}, 10th percentile key ${m(isMc.p10)}, median ${m(isMc.p50)}, 90th percentile key ${m(isMc.p90)}, lowest ${m(isMc.allValues[0])}, highest ${m(isMc.allValues[isMc.allValues.length - 1])}.`);
w(`- Histogram: ${isMc.histogram.length} bins of width ${m(isMc.histogram[0].binEnd - isMc.histogram[0].binStart)} (derived); counts ${isMc.histogram.map((b) => b.count).join(', ')}.`);
const cdfAt = (prob) => isMc.cdf.find((pt) => pt.probability === prob).value;
w(`- S-curve (EC3-6): ${isMc.cdf.length} points at probability ${p(isMc.cdf[0].probability)}, ${p(isMc.cdf[1].probability)}, ${p(isMc.cdf[2].probability)} and so on to ${p(isMc.cdf[isMc.cdf.length - 1].probability)} percent, each read with the cards' quantile rule. First value ${m(isMc.cdf[0].value)}, equal to the lowest NPV (${isMc.cdf[0].value === isMc.allValues[0]}); last value ${m(isMc.cdf[isMc.cdf.length - 1].value)}, equal to the highest (${isMc.cdf[isMc.cdf.length - 1].value === isMc.allValues[isMc.allValues.length - 1]}); heights at 10, 50 and 90 percent ${m(cdfAt(10))}, ${m(cdfAt(50))} and ${m(cdfAt(90))}, equal to the 10th percentile key, the median and the 90th percentile key (${cdfAt(10) === isMc.p10 && cdfAt(50) === isMc.p50 && cdfAt(90) === isMc.p90}).`);
const isMcOld = await SR.runMonteCarlo(isiala, APP_MC);
w(`- ${HISTORY} every year was drawn separately and variable opex never moved, so the spread came out narrow: 10th percentile key ${m(isMcOld.p10)}, median ${m(isMcOld.p50)}, 90th percentile key ${m(isMcOld.p90)}, emv ${m(isMcOld.emv)}, lowest ${m(isMcOld.allValues[0])}, highest ${m(isMcOld.allValues[isMcOld.allValues.length - 1])}. Its S-curve kept every ${Math.max(1, Math.floor(isMcOld.iterations / 50))}th sorted value (floor(n / 50), derived), ${isMcOld.cdf.length} points, last probability ${p(isMcOld.cdf[isMcOld.cdf.length - 1].probability)}, last value ${m(isMcOld.cdf[isMcOld.cdf.length - 1].value)}, so it never reached the highest NPV.`);
const isMc43 = await S.runMonteCarlo(isiala, { ...APP_MC, seed: 43 });
const isMcAgain = await S.runMonteCarlo(isiala, APP_MC);
w(`- The seed guarantees the sample: the same seed repeats every value (${JSON.stringify(isMcAgain.allValues) === JSON.stringify(isMc.allValues)}); seed 43 gives median ${m(isMc43.p50)} against ${m(isMc.p50)}. It guarantees nothing about accuracy.`);
const priceOnly = SC.monteCarloSeeded.mc_seed3_price_only;
w(`- Published mc_seed3_price_only: ${priceOnly.note}`);
w();

// -------------------------------------------------------------- Section 14
w('# SECTION 14: Two percentile rules in one module (owned by Expert m03)');
w();
const sortedMc = isMc.allValues;
const N = sortedMc.length;
w(`ISIALA\'s ${N} Scenario Builder NPVs, sorted. n x 0.1 = ${N * 0.1}, n x 0.5 = ${N * 0.5} and n x 0.9 = ${N * 0.9} are all whole numbers on an even length, so the screening rule averages two neighbours at every row.`);
w();
w('| quantity | screening rule (averages two values when n x q is whole on an even length) | breakeven rule (sorted[min(n - 1, floor(q n))]) | difference (derived) |');
w('| --- | --- | --- | --- |');
for (const q of [0.1, 0.5, 0.9]) {
  const screening = ST.quantile(sortedMc, q);
  const floorRule = sortedMc[Math.min(N - 1, Math.floor(q * N))];
  w(`| ${PC.parameterPercentileLabel(null, q * 100)} | ${m(screening)} | ${m(floorRule)} | ${m(screening - floorRule)} |`);
}
w();
w('How much a percentile wobbles: ISIALA\'s breakeven 10th percentile and median over ten seeds, 5000 iterations each (engine values), and the spread (derived):');
const wob = [];
for (let s = 1; s <= 10; s += 1) { const res = B.generateBreakevenData(beInputs(BELIEF, BELIEF.opex, { seed: s })); wob.push(res.kpis); }
w(`- 10th percentile by seed 1..10: ${wob.map((k) => p(k.p10)).join(', ')}; range ${p(Math.max(...wob.map((k) => k.p10)) - Math.min(...wob.map((k) => k.p10)))} (derived).`);
w(`- median by seed 1..10: ${wob.map((k) => p(k.p50)).join(', ')}; range ${p(Math.max(...wob.map((k) => k.p50)) - Math.min(...wob.map((k) => k.p50)))} (derived).`);
w('And against the iteration count at the default seed:');
for (const it of [100, 500, 1000, 5000, 20000]) { const res = B.generateBreakevenData(beInputs(BELIEF, BELIEF.opex, { iterations: it })); w(`- ${it} iterations: 10th ${p(res.kpis.p10)}, median ${p(res.kpis.p50)}, 90th ${p(res.kpis.p90)}.`); }
w();

// -------------------------------------------------------------- Section 15
w('# SECTION 15: Edges that used to break, B1 included (owned by Expert m04)');
w();
const zero = await S.runMonteCarlo(isiala, { iterations: 30, uncertainties: { price: 0, capex: 0, reserves: 0 } });
w(`Every range at zero on ISIALA (30 iterations): 10th percentile key ${m(zero.p10)}, median ${m(zero.p50)}, 90th ${m(zero.p90)}, emv ${m(zero.emv)}, deterministic NPV ${m(isialaRes.metrics.npv)}; bin 0 holds ${zero.histogram[0].count} of 30 (it used to throw, FINDINGS S4).`);
const short = await S.runMonteCarlo(isiala, { ...APP_MC, iterations: 40 });
w(`Forty iterations on ISIALA: ${short.cdf.length} S-curve points, last value ${m(short.cdf[short.cdf.length - 1].value)} equal to the highest of the forty (${short.cdf[short.cdf.length - 1].value === short.allValues[short.allValues.length - 1]}). Fewer than 50 iterations used to return no points at all (FINDINGS S5, fixed EC3-0).`);
w();
const narrow = B.generateBreakevenData(beInputs(BELIEF, NARROW_OPEX));
w(`ISIALA with the narrow opex belief ${NARROW_OPEX.join(' / ')}: opex fit ${m(narrow.distributionFits.opex.min)} / ${m(narrow.distributionFits.opex.mode)} / ${m(narrow.distributionFits.opex.max)}, exact ${narrow.distributionFits.opex.exact}; 10th ${p(narrow.kpis.p10)}, median ${p(narrow.kpis.p50)}, 90th ${p(narrow.kpis.p90)}, base ${p(narrow.baseBreakeven)}; tornado ${narrow.tornadoData.y.map((name, i) => `${name} ${p(narrow.tornadoData.low[i])}/${p(narrow.tornadoData.high[i])}`).join('; ')}.`);
w(`Its beliefs (EC3-5): ${beliefsText(narrow.beliefs)}; the base case and the tornado run at those, so the opex median they use is ${m(narrow.beliefs.opex.p50)} and the stated 17 is not used.`);
w(`Insight carries the fit note: ${narrow.insights.includes('the stated median sits too near')}; insight carries the beliefs note: ${narrow.insights.includes("the fitted triangle's 10th, 50th and 90th percentiles")}.`);
const narrowOld = BR.generateBreakevenData(beInputs(BELIEF, NARROW_OPEX));
w(`${HISTORY} the base case and the tornado read the stated median 17 while the sample drew from the fitted triangle: base ${p(narrowOld.baseBreakeven)}; tornado ${narrowOld.tornadoData.y.map((name, i) => `${name} ${p(narrowOld.tornadoData.low[i])}/${p(narrowOld.tornadoData.high[i])}`).join('; ')}.`);
w();
w(`A tornado bar with one side missing (B1, FIXED 2026-09-15, published mc_with_unreachable): high sides ${unrRes.tornadoData.high.map(p).join(', ')}; low sides ${unrRes.tornadoData.low.map(p).join(', ')}; unreachable ${unrRes.tornadoData.unreachable.join(', ')}; order ${unrRes.tornadoData.y.join(', ')}.`);
w(`Only one bar open (published mc_one_bar_unreachable): order ${oneBarRes.tornadoData.y.join(', ')}; unreachable ${oneBarRes.tornadoData.unreachable.join(', ')}; high sides ${oneBarRes.tornadoData.high.map(p).join(', ')}. The open bar sorts FIRST, ahead of both reachable bars.`);
w(`Engine insight on it: ${oneBarRes.insights}`);
const effRun = B.generateBreakevenData(BC.monteCarlo.mc_efficiency_past_100.inputs);
w(`A fitted tail past a physical limit (EC3-8, published mc_efficiency_past_100): efficiency fit ${m(effRun.distributionFits.efficiency.min)} / ${m(effRun.distributionFits.efficiency.mode)} / ${m(effRun.distributionFits.efficiency.max)}, exact ${effRun.distributionFits.efficiency.exact}; clippedDraws capex ${effRun.clippedDraws.capex}, opex ${effRun.clippedDraws.opex}, efficiency ${effRun.clippedDraws.efficiency} of ${BC.monteCarlo.mc_efficiency_past_100.inputs.iterations}, each held at 100.`);
w();

// -------------------------------------------------------------- Section 16
w('# SECTION 16: Numbers to distrust (owned by Expert m05)');
w();
const nt = S.calculateEconomics(S.expandQuickInputs(NTEJE));
w(`NTEJE (${quickLine(NTEJE)}): npv ${m(nt.metrics.npv)}, ${irrText(nt.metrics)}, ${paybackText(nt.metrics)}, maxExposure ${m(nt.metrics.maxExposure)}, final cumulative ${m(nt.cashflow[19].cumulativeNCF)}. No rate in the engine's band zeroes its NPV and it never pays back, and the engine says both.`);
w(`OKPOMA: npv ${m(okRes.metrics.npv)}, ${irrText(okRes.metrics)}, ${paybackText(okRes.metrics)}, maxExposure ${m(okRes.metrics.maxExposure)}.`);
const ntOld = SR.calculateEconomics(S.expandQuickInputs(NTEJE)).metrics;
const okOld = SR.calculateEconomics(lastLoss).metrics;
w(`${HISTORY} NTEJE irr ${p(ntOld.irr)} percent, the Newton clamp (FINDINGS S1), and payback ${p(ntOld.payback)}, the project life; OKPOMA irr ${p(okOld.irr)} percent, the same clamp, and payback ${p(okOld.payback)} with no status.`);
w('OKPOMA\'s first three rows:');
ledgerTable(okRes.cashflow, ['year', 'grossRevenue', 'royalty', 'capex', 'opex', 'tax', 'ncf', 'cumulativeNCF'], (i) => i < 3);
w(`The cumulative is non-negative at index 0, so payback, the FIRST crossing, is 0; the second capex year takes it to ${m(okRes.cashflow[1].cumulativeNCF)}, so paybackStatus is ${okRes.metrics.paybackStatus} and paybackLast is where it turns non-negative for good: 2 + ${m(Math.abs(okRes.cashflow[1].cumulativeNCF))} / ${m(okRes.cashflow[2].ncf)} = ${p(2 + Math.abs(okRes.cashflow[1].cumulativeNCF) / okRes.cashflow[2].ncf)} (derived, equals the engine's paybackLast ${p(okRes.metrics.paybackLast)}).`);
w();
for (const id of ['irr_beyond_clamp', 'irr_tiny_cash_flows_derivative_guard', 'irr_two_roots']) {
  const c = SC.irr[id]; const res = S.calculateEconomics(c.inputs);
  w(`- ${id}: ${irrNote(c)} Engine ${irrText(res.metrics)}; golden roots ${JSON.stringify(c.expected.metrics.irrRoots)}.`);
}
const fdp = SC.fdp.fdp_never_pays_back; const fdpRes = S.calculateEconomics(fdp.inputs);
w(`- fdp_never_pays_back: ${fdp.note} Engine npv ${m(fdpRes.metrics.npv)}, ${irrText(fdpRes.metrics)}, ${paybackText(fdpRes.metrics)}.`);
w();
const yearEnd = isialaRes.cashflow.reduce((s, row, i) => s + row.ncf / Math.pow(1 + ISIALA.discountRate / 100, i + 1), 0);
w(`Mid-year beside year-end on ISIALA\'s cash flows: engine (mid-year) npv ${m(isialaRes.metrics.npv)}; the same rows discounted at year end ${m(yearEnd)} (derived); ratio ${r(isialaRes.metrics.npv / yearEnd)} against (1.12)^0.5 = ${r(Math.sqrt(1 + ISIALA.discountRate / 100))} (derived).`);
w('Two breakevens for one field: EC1\'s Petroleum Economics Studio breakeven discounts at year end on its own ledger; this engine discounts mid-year on a screening ledger with all capex in year 1. The two are different quantities and are not converted into each other here.');
w();

// -------------------------------------------------------------- Section 17
w('# SECTION 17: ISIALA end to end, for the reading modules (owned by Associate m06, Professional m06 and Expert m06)');
w();
w(`- Deterministic: npv ${m(isialaRes.metrics.npv)}, ${irrText(isialaRes.metrics)}, ${paybackText(isialaRes.metrics)}, maxExposure ${m(isialaRes.metrics.maxExposure)}.`);
w(`- Scenarios: Low ${m(isSc.Low.metrics.npv)}, Base ${m(isSc.Base.metrics.npv)}, High ${m(isSc.High.metrics.npv)}.`);
w(`- Breakeven: base ${p(beMain.baseBreakeven)}; ${PC.parameterPercentileLabel('breakeven price', 'q10')} ${p(beMain.kpis.p10)}, median ${p(beMain.kpis.p50)}, ${PC.parameterPercentileLabel('breakeven price', 'q90')} ${p(beMain.kpis.p90)}.`);
w(`- Scenario Builder Monte Carlo: Low case ${PC.OUTCOME_LABELS.p90} ${m(isMc.p10)}, Best case ${PC.OUTCOME_LABELS.p50} ${m(isMc.p50)}, High case ${PC.OUTCOME_LABELS.p10} ${m(isMc.p90)}, emv ${m(isMc.emv)}, seed ${isMc.seed}.`);
w();

// -------------------------------------------------------------- Section 18
// APPENDED AT THE END ON PURPOSE. Three lesson tiers and two bank writers are
// quoting this file by line number, so a new block goes after the last line
// rather than beside the material it belongs to.
w('# SECTION 18: History, the retired engine\'s scenario metrics in full (owned by Associate m05, for contrast with the scenarios of Section 6)');
w();
w('Every line below is the RETIRED engine (retired/, frozen before engines #180 and #182) run on the SAME ISIALA case as Section 6, printed in full so a lesson or a bank question can contrast a whole scenario row instead of the two figures Section 6 carries. None of it is current behaviour, and a retired figure is never to be copied out of the published digest.');
w();
const retiredMetricsLine = (mt) => `npv ${m(mt.npv)}, irr ${p(mt.irr)} percent, payback ${p(mt.payback)} years, maxExposure ${m(mt.maxExposure)}, totalRevenue ${m(mt.totalRevenue)}, totalCapex ${m(mt.totalCapex)}, totalOpex ${m(mt.totalOpex)}, totalRoyalty ${m(mt.totalRoyalty)}, totalTax ${m(mt.totalTax)}, totalGovTake ${m(mt.totalGovTake)}`;
for (const k of ['Low', 'Base', 'High']) w(`${HISTORY} the ${k} scenario in full: ${retiredMetricsLine(isScOld[k].metrics)}.`);
w();
w('The retired engine returned no irrStatus and no paybackStatus, so those two words are absent from every figure above: its Low payback is the project life where the current engine returns null with not-recovered, and its High irr is the zero it reported wherever the cash flow never changes sign. Its Base scenario scales nothing, so the Base row is the one row the repair left alone.');
w();

process.stdout.write(`${out.join('\n')}\n`);
