// THIS SCRIPT RUNS THE PUBLISHED GOLDEN CASES of portfolio_cases.json and
// afe_cases.json (plus sweeps around those published inputs) and the TEACHING
// FIELDS this wave designed for itself: the OKONO capital inventory and the
// OFON-1 well AFE with its joint venture partners. THE EC5 CAPSTONE RUNS
// DIFFERENT CONDITIONS ENTIRELY: nothing here imports, reads or reproduces
// ec5_fields.mjs, fields.json, or any capstone field name, project, capex,
// probability, cost line, date or partner. The teaching digest and the
// capstone are two files with opposite audiences and never share a number.
//
// Usage:  sh /root/ec-wip-portfolio/build_digest.sh > /root/ec-wip-portfolio/digest.tmp \
//           && mv /root/ec-wip-portfolio/digest.tmp /root/ec-wip-portfolio/digest.txt
//
// Engines, as repaired in EC5-0 (engines #178): engines/economics/portfolio.js
// (the Capital Portfolio Studio) and engines/economics/afe.js (the AFE Cost
// Control Manager). Every AFE call passes an explicit asOf, so no line below
// depends on the day this script runs.
//
// EVERY NUMBER PRINTED HERE IS A RETURN VALUE OF THE ENGINE, except where a
// line says "golden" (read from a published case's expected block), "exact"
// (a published case's exact enumeration) or "derived" (arithmetic on engine
// values printed on the same row or block, with the arithmetic stated).

import fs from 'fs';

const ROOT = process.env.EC5_ENGINES || '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen-ec5/packages/engines';
const P = await import(`${ROOT}/engines/economics/portfolio.js`);
const A = await import(`${ROOT}/engines/economics/afe.js`);
const ST = await import(`${ROOT}/lib/stats/stats.js`);
const GP = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/portfolio_cases.json`, 'utf8'));
const GA = JSON.parse(fs.readFileSync(`${ROOT}/test-data/economics/goldens/afe_cases.json`, 'utf8'));
const byId = (list, key = 'id') => Object.fromEntries(list.map((c) => [c[key], c]));
const GPC = Object.fromEntries(Object.entries(GP).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, byId(v)]));
const GAC = Object.fromEntries(Object.entries(GA).filter(([, v]) => Array.isArray(v) && v[0]?.name).map(([k, v]) => [k, byId(v, 'name')]));

const out = [];
const w = (s = '') => out.push(s);
const f = (x, n) => (x === null || x === undefined || Number.isNaN(Number(x))) ? 'null' : Number(x).toFixed(n);
const m = (x) => f(x, 4);   // portfolio money, million USD
const r = (x) => f(x, 6);   // probabilities, ratios, fractions
const u = (x) => f(x, 0);   // AFE money, whole currency units
const pc = (x) => f(x, 4);  // percents
const attempt = (fn) => { try { return { ok: true, value: fn() }; } catch (e) { return { ok: false, error: e.message, name: e.name }; } };

// ---------------------------------------------------------------- the fields
// THE TEACHING INVENTORY. Integer capex in million USD, so the exact 1 million
// USD grid applies at every limit below 5000.
const OKONO = [
  { id: 'OK-1', name: 'Infill drilling', capex: 120, npv_p50: 95, npv_p10: 150, npv_p90: 50, pos: 0.95, fail_cost: 10 },
  { id: 'OK-2', name: 'Gas compression', capex: 180, npv_p50: 130, npv_p10: 190, npv_p90: 80, pos: 0.9, fail_cost: 20 },
  { id: 'OK-3', name: 'Exploration well', capex: 90, npv_p50: 420, npv_p10: 700, npv_p90: 210, pos: 0.25, fail_cost: 85 },
  { id: 'OK-4', name: 'Waterflood', capex: 240, npv_p50: 210, npv_p10: 320, npv_p90: 120, pos: 0.8, fail_cost: 40 },
  { id: 'OK-5', name: 'Workovers', capex: 60, npv_p50: 38, npv_p10: 55, npv_p90: 22, pos: 1 },
  { id: 'OK-6', name: 'Satellite tie-back', capex: 310, npv_p50: 360, npv_p10: 560, npv_p90: 190, pos: 0.55, fail_cost: 120 },
];
const OKONO_LIMITS = [300, 450, 600, 750, 1000];
// THE TEACHING AFE. A well AFE in USD over 2027, read at stated as-of dates.
const OFON_AFE = { afe_number: 'OFON-1', start_date: '2027-02-01', end_date: '2027-11-30', currency: 'USD' };
const OFON_ITEMS = [
  { code: 'DRL-01', description: 'Rig and drilling services', budget: 14200000, commitment: 2600000, actual: 9800000, progress: 72 },
  { code: 'CSG-02', description: 'Casing and tubulars', budget: 3900000, commitment: 0, actual: 4300000, progress: 100 },
  { code: 'CMT-03', description: 'Cementing', budget: 1250000, commitment: 300000, actual: 640000, forecast: 1400000, progress: 55 },
  { code: 'LOG-04', description: 'Logging and testing', budget: 2100000, commitment: 900000, actual: 350000, progress: 20 },
  { code: 'CMP-05', description: 'Completion', budget: 5600000, commitment: 1200000, actual: 0, progress: 0 },
];
const OFON_INVOICES = [
  { invoice_date: '2027-02-20', amount: 3100000 },
  { invoice_date: '2027-04-10', amount: 5200000 },
  { invoice_date: '2027-06-05', amount: 4400000 },
  { invoice_date: '2027-07-18', amount: 2390000 },
];
const OFON_AS_OF = ['2027-01-15', '2027-02-01', '2027-06-30', '2027-08-15', '2027-11-30', '2028-01-10'];
const OFON_PARTNERS = [
  { name: 'Ofon Energy', working_interest: 40 },
  { name: 'Enang Petroleum', working_interest: 22.5 },
  { name: 'Mfem Resources', working_interest: 12.5 },
];

const setIds = (ps) => ps.map((p) => p.id).join(' + ') || 'none';
const oldNormal = (risk) => (risk.stdDev > 0 ? ST.normalCDF(-risk.emv / risk.stdDev) : (risk.emv < 0 ? 1 : 0));

// -------------------------------------------------------------- Section 1
w('# EC5 Capital Portfolio & Cost Control. Teaching digest.');
w('# Portfolio money is million USD to four decimals; probabilities and ratios to six; AFE money is whole units of the AFE currency (USD here); percents to four decimals.');
w();
w('# SECTION 1: The portfolio engine, what it models and what it refuses (owned by Associate m01)');
w();
w('- Risked EMV per project = pos x npv_p50 - (1 - pos) x fail_cost, pos the chance of success (0 to 1, default 1), fail_cost the loss if it fails (0 or more, default 0).');
w('- The optimizer funds each project in full or not at all (a 0/1 knapsack) and maximises the summed risked EMV with total capex within the limit on its grid.');
w('- Grid: 1 million USD per cell when the limit and every candidate capex are whole numbers and the limit is at most 5000; otherwise limit / 2000 per cell, each project weighing max(1, round(capex / cell)) cells.');
w('- A project with risked EMV of 0 or less is never funded; money may be left unspent.');
w(`- Risk summary: emv and stdDev in closed form; probLoss, p90 (the low case, the 10th percentile of simulated portfolio NPV) and p10 (the high case) from a seeded Monte Carlo, default seed ${P.DEFAULT_RISK_SEED}, default iterations ${P.DEFAULT_RISK_ITERATIONS}.`);
w('- P-labels follow the exceedance convention on an NPV outcome: P90 is the low case, P10 the high case. A capex, a cost or a probability never carries a P-label.');
w();
w('Refusals (published optimizeRefusals, engine messages verbatim):');
for (const c of GP.optimizeRefusals) { const a = attempt(() => P.optimizePortfolio({ projects: c.projects, capexLimit: c.capexLimit })); w(`- ${c.id}: ${a.ok ? 'accepted' : `${a.name}: "${a.error}"`}`); }
const clampRow = (id) => { const c = GPC.projectEmv[id]; return `- published ${id}: ${JSON.stringify(c.project)} gives risked EMV ${m(P.projectEmv(c.project))} (golden ${m(c.expected.emv)}).`; };
w();
['posAboveOneClamps', 'posBelowZeroClamps', 'negativeFailCostIsZero', 'nonNumericPosIsDefault', 'missingNpvIsZero'].forEach((id) => w(clampRow(id)));
const probeP = { capex: 10, npv_p50: 80, fail_cost: 30 };
for (const [label, pos] of [['pos left out', undefined], ['pos null', null], ['pos typed as an empty string ""', ''], ['pos typed as "n/a"', 'n/a']]) {
  const proj = pos === undefined ? probeP : { ...probeP, pos };
  w(`- probe, npv_p50 80 and fail_cost 30 with ${label}: risked EMV ${m(P.projectEmv(proj))}.`);
}
w('# Commentary: an absent or null pos defaults to 1 (certain success) and a non-numeric one such as "n/a" is also read as 1, but an empty string is the number 0 and is read as certain failure (finding EC5-6).');
const textCapex = attempt(() => P.optimizePortfolio({ projects: [{ id: 'T', capex: 'abc', npv_p50: 50 }, { id: 'U', capex: 40, npv_p50: 30 }], capexLimit: 100 }));
w(`- probe, a project with capex "abc" beside one with capex 40 at a limit of 100: ${textCapex.ok ? `funded ${setIds(textCapex.value.optimalProjects)}, total capex ${m(textCapex.value.totalCapex)}, total EMV ${m(textCapex.value.totalEmv)}` : textCapex.error}. A non-numeric capex is neither refused nor flagged; it counts as capex 0 and weighs one grid cell (finding EC5-7).`);
w('# Commentary: the unnamed refusal names the project by its position counted from 0, so "Project "1"" is the second project in the list.');
w();

// -------------------------------------------------------------- Section 2
w('# SECTION 2: Risking a project, the OKONO inventory (owned by Associate m02)');
w();
w('| project | name | capex | npv_p50 | npv_p10 | npv_p90 | pos | fail_cost | risked EMV | success spread | mixture sd |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
OKONO.forEach((p) => {
  const mo = P.projectMoments(p);
  w(`| ${p.id} | ${p.name} | ${m(p.capex)} | ${m(p.npv_p50)} | ${m(p.npv_p10)} | ${m(p.npv_p90)} | ${r(p.pos)} | ${m(p.fail_cost ?? 0)} | ${m(P.projectEmv(p))} | ${m(P.successStdDev(p))} | ${m(Math.sqrt(mo.variance))} |`);
});
w('(The success spread is (npv_p10 - npv_p90) / 2.5631, the normal-equivalent standard deviation from the entered percentiles; the mixture sd is the square root of the engine\'s projectMoments variance.)');
const ok3 = OKONO[2];
w(`OK-3 by hand: ${r(ok3.pos)} x ${m(ok3.npv_p50)} - ${r(1 - ok3.pos)} x ${m(ok3.fail_cost)} = ${m(P.projectEmv(ok3))} (engine). Its success-case NPV of ${m(ok3.npv_p50)} is not its value: the EMV is ${r(P.projectEmv(ok3) / ok3.npv_p50)} of it (derived).`);
w();
for (const id of ['unrisked', 'risked', 'posZero']) w(clampRow(id));
for (const id of ['explicitStddev', 'percentileFallback', 'invertedPercentiles', 'zeroStddevFallsBack']) { const c = GPC.successStdDev[id]; w(`- published successStdDev ${id}: ${JSON.stringify(c.project)} gives ${m(P.successStdDev(c.project))} (golden ${m(c.expected.sd)}).`); }
w();

// -------------------------------------------------------------- Section 3
w('# SECTION 3: Choosing under a budget (owned by Associate m03)');
w();
w('| capex limit | funded set | total capex | total risked EMV | total success NPV | unspent | resolution | overLimit |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
const okonoRuns = Object.fromEntries(OKONO_LIMITS.map((lim) => [lim, P.optimizePortfolio({ projects: OKONO, capexLimit: lim })]));
for (const lim of OKONO_LIMITS) { const o = okonoRuns[lim]; w(`| ${m(lim)} | ${setIds(o.optimalProjects)} | ${m(o.totalCapex)} | ${m(o.totalEmv)} | ${m(o.totalNpvSuccess)} | ${m(o.capexLimit - o.totalCapex)} (derived) | ${m(o.resolution)} | ${o.overLimit} |`); }
const ratio = [...OKONO].sort((a, b) => P.projectEmv(b) / b.capex - P.projectEmv(a) / a.capex);
w();
w('Ranking OKONO by risked EMV per million USD of capex (derived):');
ratio.forEach((p) => w(`- ${p.id}: ${r(P.projectEmv(p) / p.capex)}`));
let spent = 0; const greedy = [];
for (const p of ratio) { if (spent + p.capex <= 450) { greedy.push(p); spent += p.capex; } }
w(`Filling a 450.0000 limit greedily down that ranking funds ${setIds(greedy)} at capex ${m(spent)} and risked EMV ${m(greedy.reduce((s, p) => s + P.projectEmv(p), 0))} (derived); the optimizer funds ${setIds(okonoRuns[450].optimalProjects)} at ${m(okonoRuns[450].totalEmv)}.`);
w('# Commentary: the optimizer keeps the first best set it builds and replaces it only with a strictly larger EMV, so the order projects are entered decides between tied sets; the result reports one set and no alternatives, and the risk summary is simulated for that set only.');
w(`At 750.0000 the optimizer leaves ${m(okonoRuns[750].capexLimit - okonoRuns[750].totalCapex)} unspent (derived): no remaining project fits, and OK-6 alone costs ${m(OKONO[5].capex)}.`);
w();
for (const id of ['classic450', 'riskedVsSure', 'negativeNeverForced', 'zeroEmvExcluded', 'negativeEmvHugeBudget', 'limitBelowEveryProject', 'tieIdenticalProjects', 'tieDifferentComposition', 'exactFit']) {
  const c = GPC.optimize[id]; const o = P.optimizePortfolio({ projects: c.projects, capexLimit: c.capexLimit, correlation: c.correlation, ...(c.riskOptions || {}) });
  w(`- published ${id}: limit ${m(c.capexLimit)}; projects ${c.projects.map((p) => `${p.id} capex ${m(p.capex)} risked EMV ${m(P.projectEmv(p))}`).join('; ')}; engine set ${setIds(o.optimalProjects)}, capex ${m(o.totalCapex)}, EMV ${m(o.totalEmv)}; golden optimal sets ${JSON.stringify(c.expected.quantized.optimalSets.map((s) => s.ids))}.`);
}
w();

// -------------------------------------------------------------- Section 4
w('# SECTION 4: The efficient frontier (owned by Associate m04)');
w();
for (const lim of [450, 600]) {
  const o = okonoRuns[lim];
  w(`OKONO frontier at limit ${m(lim)} (capex, best risked EMV):`);
  w('| point | capex | EMV | EMV gained over the previous point | capex added | EMV per extra million USD |');
  w('| --- | --- | --- | --- | --- | --- |');
  o.frontierData.forEach((pt, i) => {
    const prev = o.frontierData[i - 1];
    w(`| ${i} | ${m(pt.capex)} | ${m(pt.emv)} | ${prev ? m(pt.emv - prev.emv) : 'none'} | ${prev ? m(pt.capex - prev.capex) : 'none'} | ${prev ? r((pt.emv - prev.emv) / (pt.capex - prev.capex)) : 'none'} |`);
  });
  w('(The last three columns are derived from consecutive rows.)');
  w(`Last point ${m(o.frontierData.at(-1).capex)}, ${m(o.frontierData.at(-1).emv)}: the optimum, ${setIds(o.optimalProjects)}.`);
  w();
}
const subsetAt = (capex, emv) => {
  const n = OKONO.length; const hits = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const sel = OKONO.filter((_, i) => mask >> i & 1);
    const c = sel.reduce((s2, p) => s2 + p.capex, 0); const e = sel.reduce((s2, p) => s2 + P.projectEmv(p), 0);
    if (Math.abs(c - capex) < 1e-9 && Math.abs(e - emv) < 1e-9) hits.push(setIds(sel));
  }
  return hits.join(' or ');
};
w('The set behind each frontier point at 600.0000 (derived: every subset of OKONO whose capex and risked EMV equal the point):');
okonoRuns[600].frontierData.forEach((pt, i) => w(`- point ${i}: ${subsetAt(pt.capex, pt.emv)}`));
w(`From 450.0000 to 600.0000 the optimum gains ${m(okonoRuns[600].totalEmv - okonoRuns[450].totalEmv)} of risked EMV for ${m(okonoRuns[600].totalCapex - okonoRuns[450].totalCapex)} more capex (derived).`);
w(`Two budgets on one frontier: at 450.0000 the funded set is ${setIds(okonoRuns[450].optimalProjects)}; at 600.0000 it is ${setIds(okonoRuns[600].optimalProjects)}. OK-3 is funded at the smaller budget and dropped at the larger one, so the optimal sets are not nested.`);
w();

// -------------------------------------------------------------- Section 5
w('# SECTION 5: The grid under the answer (owned by Associate m05)');
w();
for (const id of ['rawDollars', 'nonIntegerLimit', 'gridOvershoot', 'gridUndershoot', 'freeProjectZeroLimit', 'freeProjectTightLimit', 'freeProjectSlack']) {
  const c = GPC.optimize[id]; const o = P.optimizePortfolio({ projects: c.projects, capexLimit: c.capexLimit, correlation: c.correlation, ...(c.riskOptions || {}) });
  w(`- published ${id}: limit ${f(c.capexLimit, 4)}, resolution ${f(o.resolution, 6)}; projects ${c.projects.map((p) => `${p.id} capex ${f(p.capex, 4)} EMV ${m(P.projectEmv(p))}`).join('; ')}.`);
  const cells = Math.round(Math.max(0, Number(c.capexLimit) || 0) / o.resolution);
  w(`  grid cells ${cells}; cell weights ${c.projects.map((p) => `${p.id} ${Math.max(1, Math.round((Number(p.capex) || 0) / o.resolution))}`).join(', ')} (derived: max(1, round(capex / resolution))); unspent ${f(Math.max(0, Number(c.capexLimit) - o.totalCapex), 4)} (derived).`);
  w(`  engine set ${setIds(o.optimalProjects)}, capex ${f(o.totalCapex, 4)}, EMV ${m(o.totalEmv)}, overLimit ${o.overLimit}, overLimitBy ${f(o.overLimitBy, 4)}; exact optimum (golden) EMV ${m(c.expected.exact.optimalEmv)} on ${JSON.stringify(c.expected.exact.optimalSets.map((s) => s.ids))}; gap ${m(c.expected.quantizationGap)} (golden); set changed by the grid ${c.expected.setChanged}.`);
}
w('The overshoot is now flagged (overLimit, overLimitBy) and still happens; the undershoot and the one cell charged to a free project are unchanged (findings D2 and D4).');
w();

// -------------------------------------------------------------- Section 6
w('# SECTION 6: An AFE and its lines, OFON-1 (owned by Professional m01)');
w();
w(`OFON-1: currency ${OFON_AFE.currency}, window ${OFON_AFE.start_date} to ${OFON_AFE.end_date}.`);
w('| code | description | budget | commitment | actual | entered forecast | progress percent |');
w('| --- | --- | --- | --- | --- | --- | --- |');
OFON_ITEMS.forEach((i) => w(`| ${i.code} | ${i.description} | ${u(i.budget)} | ${u(i.commitment)} | ${u(i.actual)} | ${i.forecast ? u(i.forecast) : 'none'} | ${pc(i.progress)} |`));
w(`Invoices: ${OFON_INVOICES.map((v) => `${v.invoice_date} ${u(v.amount)}`).join('; ')}; invoice total ${u(OFON_INVOICES.reduce((s, v) => s + v.amount, 0))} (derived).`);
const ofonMid = A.calculateMetrics(OFON_AFE, OFON_ITEMS, OFON_INVOICES, '2027-08-15');
w(`Totals (engine): budget ${u(ofonMid.totalBudget)}, commitments ${u(ofonMid.totalCommitments)}, actuals ${u(ofonMid.totalActuals)}.`);
w('The metrics read actuals from the cost lines; the S-curve reads actuals from invoices. On OFON-1 the two agree by construction; they need not.');
w();

// -------------------------------------------------------------- Section 7
w('# SECTION 7: One forecast rule (owned by Professional m02)');
w();
w('itemForecast: the entered forecast when it is positive, otherwise the larger of the budget and actual + commitment.');
w('| code | budget | actual + commitment | entered forecast | itemForecast | rule used | line variance (budget - itemForecast) |');
w('| --- | --- | --- | --- | --- | --- | --- |');
OFON_ITEMS.forEach((i) => {
  const fc = A.itemForecast(i); const spend = i.actual + i.commitment;
  const rule = (Number(i.forecast) || 0) > 0 ? 'entered' : (spend > i.budget ? 'actual + commitment' : 'budget');
  w(`| ${i.code} | ${u(i.budget)} | ${u(spend)} (derived) | ${i.forecast ? u(i.forecast) : 'none'} | ${u(fc)} | ${rule} | ${u(i.budget - fc)} (derived) |`);
});
w(`AFE totals (engine): EAC ${u(ofonMid.totalForecast)}, variance at completion ${u(ofonMid.variance)} (negative means an overrun).`);
for (const n of ['suite test: entered forecast', 'suite test: under budget forecasts the budget', 'suite test: committed past the budget', 'negative entered forecast is ignored (the S-curve ignores it too)']) {
  const c = GAC.metrics[n]; const x = A.calculateMetrics(c.inputs.afe, c.inputs.costItems, c.inputs.invoices, c.inputs.asOf ?? '2030-01-01');
  w(`- published "${n}": items ${JSON.stringify(c.inputs.costItems)}; engine EAC ${f(x.totalForecast, 4)}, variance ${f(x.variance, 4)}.`);
}
const probeLine = { code: 'X', budget: 1250000, commitment: 300000, actual: 640000, progress: 55 };
for (const [label, fc] of [['entered forecast 0', 0], ['entered forecast 1 (below the 940000 already spent and committed)', 1], ['entered forecast 900000 (below the 940000 already spent and committed)', 900000], ['no entered forecast', undefined]]) {
  const item = fc === undefined ? probeLine : { ...probeLine, forecast: fc };
  w(`- CMT-03's budget, commitment and actual with ${label}: itemForecast ${u(A.itemForecast(item))}.`);
}
w('# Commentary: a forecast of 0 is not positive and falls back to the formula; any positive entered forecast is taken as typed, even one below the money already spent and committed (finding EC5-1). A line with no entered forecast can never show a saving: its forecast is at least its budget, so its variance is 0 or negative. OFON-1\'s three variances of 0 are that floor, not evidence of being on budget.');
w('# App surface: before EC5-0 the screens disagreed on this rule: the Cost Breakdown table showed the budget as the forecast, the PDF and Excel variance was budget less actual, the Top 5 used budget less (forecast or actual), and editing a line copied the budget into its forecast. After the EC5-0 Suite repair the dashboard tiles, the Cost Breakdown table, the PDF and Excel exports and the Top 5 all use this one rule, and editing a line no longer copies the budget into its forecast.');
w();

// -------------------------------------------------------------- Section 8
w('# SECTION 8: Earned value (owned by Professional m03)');
w();
w('| code | budget | progress percent | earned value (budget x progress) | actual |');
w('| --- | --- | --- | --- | --- |');
OFON_ITEMS.forEach((i) => w(`| ${i.code} | ${u(i.budget)} | ${pc(i.progress)} | ${u(i.budget * i.progress / 100)} (derived) | ${u(i.actual)} |`));
w(`Engine: earned value ${u(ofonMid.earnedValue)}, CPI ${r(ofonMid.cpi)} (earned value over actuals), percent spent ${pc(ofonMid.percentSpent)}, percent complete ${pc(ofonMid.percentComplete)}.`);
w('Planned value is the budget times the elapsed fraction of the window at the as-of date; SPI is earned value over planned value, and null where planned value is zero, except that an AFE whose budget is 0 reports SPI 1 by a guard that fires first (the published empty AFE below).');
for (const n of ['suite test: weighted earned value', 'suite test: CPI 1.25', 'progress beyond 100 percent earns beyond the budget', 'suite test: empty AFE']) {
  const c = GAC.metrics[n]; const x = A.calculateMetrics(c.inputs.afe, c.inputs.costItems, c.inputs.invoices, c.inputs.asOf ?? '2030-01-01');
  w(`- published "${n}": engine EV ${f(x.earnedValue, 4)}, AC ${f(x.totalActuals, 4)}, CPI ${x.cpi === null ? 'null' : r(x.cpi)}, SPI ${x.spi === null ? 'null' : r(x.spi)}.`);
}
w();

// -------------------------------------------------------------- Section 9
w('# SECTION 9: The as-of date (owned by Professional m04)');
w();
w('| as of | time progress | planned value | earned value | SPI | CPI |');
w('| --- | --- | --- | --- | --- | --- |');
for (const d of OFON_AS_OF) { const x = A.calculateMetrics(OFON_AFE, OFON_ITEMS, OFON_INVOICES, d); w(`| ${d} | ${r(x.timeProgress)} | ${u(x.plannedValue)} | ${u(x.earnedValue)} | ${x.spi === null ? 'null' : r(x.spi)} | ${r(x.cpi)} |`); }
const dayMs = 86400000;
const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / dayMs);
w(`Whole days in the OFON-1 window ${OFON_AFE.start_date} to ${OFON_AFE.end_date}: ${days(OFON_AFE.start_date, OFON_AFE.end_date)} (derived). Elapsed whole days at 2027-06-30: ${days(OFON_AFE.start_date, '2027-06-30')}; at 2027-08-15: ${days(OFON_AFE.start_date, '2027-08-15')} (derived). Time progress is elapsed over total: ${r(days(OFON_AFE.start_date, '2027-06-30') / days(OFON_AFE.start_date, OFON_AFE.end_date))} and ${r(days(OFON_AFE.start_date, '2027-08-15') / days(OFON_AFE.start_date, OFON_AFE.end_date))} (derived), matching the engine column.`);
w('Only planned value, time progress and SPI move with the as-of date; earned value, actuals, CPI and EAC are read from the lines as entered.');
w('# Commentary: on the end day itself time progress is 1, so the whole budget is planned by the end date. An AFE with no dates still falls back to time progress 1 in the engine (the published no-dates case below): EC5-0 did not change that fallback; the repaired Suite labels SPI unavailable for such an AFE.');
w('# App surface: before EC5-0 the engine read the clock for time progress, so SPI on a live AFE changed from day to day, and before the start date it reported SPI as Infinity when value had been earned or NaN when not.');
w('On the start day no whole day has elapsed, so time progress is 0, planned value 0 and SPI null, exactly as before the start.');
for (const n of ['asOf mid-window: SPI against 256 of 729 days', 'asOf before the start: SPI null', 'asOf on the start day: no whole day elapsed, SPI null', 'asOf after the end: time progress 1', 'no dates: time progress 1']) {
  const c = GAC.metrics[n]; const x = A.calculateMetrics(c.inputs.afe, c.inputs.costItems, c.inputs.invoices, c.inputs.asOf);
  w(`- published "${n}": window ${c.inputs.afe.start_date ?? 'none'} to ${c.inputs.afe.end_date ?? 'none'}, asOf ${c.inputs.asOf ?? 'default'}; engine time progress ${r(x.timeProgress)}, SPI ${x.spi === null ? 'null' : r(x.spi)}.`);
}
w('# App surface: before EC5-0 the AFE wizard asked for no dates, so time progress fell back to 1 and SPI equalled percent complete divided by 100 (earned value over the whole budget); the repaired wizard asks for the window and the dashboard passes today as the as-of date.');
w();

// -------------------------------------------------------------- Section 10
w('# SECTION 10: The S-curve (owned by Professional m05)');
w();
const curve = A.generateSCurveData(OFON_AFE, OFON_ITEMS, OFON_INVOICES, '2027-08-15');
w('OFON-1 S-curve as of 2027-08-15:');
w('| point | label | Planned | Planned added since the previous point (derived) | Actual | Forecast |');
w('| --- | --- | --- | --- | --- | --- |');
curve.forEach((p, i) => w(`| ${i} | ${p.date} | ${u(p.Planned)} | ${i ? u(p.Planned - curve[i - 1].Planned) : 'none'} | ${p.Actual === null ? 'null' : u(p.Actual)} | ${u(p.Forecast)} |`));
w('# Commentary: a label is the month and a two-digit year ("Feb 27" is February 2027, not the 27th), and each point sits on the start date plus whole months (here the 1st). Actual at a point counts invoices dated on or before that day, so the 2027-07-18 invoice is not in the "Jul 27" point (12700000) and appears at "Aug 27". A month with more days adds more plan. After the as-of date Forecast ignores the actuals entirely and is the EAC spread from the start, so its jump at the first projected point comes from switching formulas, not from spending.');
w('# Commentary: this digest is built with the timezone pinned to UTC. The engine parses the window as UTC midnight but steps months and prints labels in local time, so the same AFE drawn in a timezone west of UTC (for example America/Los_Angeles) labels its first point "Jan 27" and shifts every Planned value (finding EC5-5); Lagos, Tokyo and UTC agree with this table.');
w('# App surface: before EC5-0 the curve kept walking past the end date to the current month (a 2020 AFE had 81 points on 2026-09-14 and gained one a month); it now stops at the end date.');
w(`${curve.length} points, one per calendar month from the start date to the end date. The last Planned point is ${u(curve.at(-1).Planned)} against a budget of ${u(ofonMid.totalBudget)}: the monthly buckets stop before the plan reaches the budget.`);
w(`After the as-of date Forecast is the EAC spread linearly from the start, so it jumps from the last actual ${u(curve.filter((p) => p.Actual !== null).at(-1).Actual)} to ${u(curve.find((p) => p.Actual === null).Forecast)} at the first projected point.`);
for (const n of ['suite test: 1200 over 2020 with two invoices', 'past window, asOf mid-year: actuals to June, forecast projected after', 'future window ending on a bucket: the last forecast point is the whole EAC', 'past window, all invoices unpaid: none dated']) {
  const c = GAC.sCurve[n]; const pts = A.generateSCurveData(c.inputs.afe, c.inputs.costItems, c.inputs.invoices, c.inputs.asOf);
  w(`- published "${n}": window ${c.inputs.afe.start_date} to ${c.inputs.afe.end_date}, asOf ${c.inputs.asOf ?? 'default'}, lines ${JSON.stringify(c.inputs.costItems)}, invoices ${JSON.stringify(c.inputs.invoices)}; ${pts.length} points; first ${JSON.stringify(pts[0])}; last ${JSON.stringify(pts.at(-1))}.`);
}
w();

// -------------------------------------------------------------- Section 11
w('# SECTION 11: Portfolio risk by simulation (owned by Expert m01)');
w();
w('The published riskMethod cases, each run by the engine at its stated seed and iterations, beside the exact answer and the normal approximation the engine used before EC5-0:');
w('| case | kind | exact P(loss) | normal approximation P(loss) | engine P(loss) | standard error | z | exact P90 outcome | normal P90 | engine P90 |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const c of GP.riskMethod) {
  const x = P.portfolioRiskMetrics(c.selected, c.correlation, c.riskOptions);
  w(`| ${c.id} | ${c.kind} | ${r(c.exact.probLoss)} | ${r(c.normalApprox.probLoss)} | ${r(x.probLoss)} | ${r(c.probLossSE)} | ${f(c.probLossZ, 4)} | ${c.exact.p90?.outcome !== undefined ? m(c.exact.p90.outcome) : (typeof c.exact.p90 === 'number' ? `${m(c.exact.p90)} (continuous)` : (c.exact.p90?.value !== undefined ? `${m(c.exact.p90.value)} (continuous)` : 'n/a'))} | ${m(c.normalApprox.p90)} | ${m(x.p90)} |`);
}
w('(exact, normal approximation, standard error and z are golden fields; the engine columns are this run.)');
w('Inputs of the method cases (correlation, then each project as pos / npv_p50 / fail_cost, with its success spread where one is given):');
for (const c of GP.riskMethod) w(`- ${c.id}: rho ${r(c.correlation)}, seed ${c.riskOptions.seed}, iterations ${c.riskOptions.iterations}; ${c.selected.map((p) => `${r(p.pos ?? 1)} / ${m(p.npv_p50 ?? 0)} / ${m(p.fail_cost ?? 0)}${p.npv_stddev ? ` sd ${m(p.npv_stddev)}` : ''}${p.npv_p10 !== undefined ? ` P10 ${m(p.npv_p10)} P90 ${m(p.npv_p90)}` : ''}`).join('; ')}.`);
w();
w('Draw order per iteration: F1, F2, then for each project in array order e1, e2, all from randomNormal on mulberry32(seed). z1 = sqrt(rho) F1 + sqrt(1 - rho) e1 decides success (normalCDF(z1) < pos); z2 = sqrt(rho) F2 + sqrt(1 - rho) e2 scales the success spread. Every normal is drawn whether or not it is used.');
w();
w('OKONO funded sets through the risk summary (correlation 0, the optimizer default; default seed and iterations):');
w('| limit | set | emv | stdDev | engine P(loss) | engine P90 | engine P10 | seed | iterations | what the normal approximation would have said, P(loss) (derived) | normal P90 (derived: emv - 1.2816 x stdDev) |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const lim of OKONO_LIMITS) {
  const x = okonoRuns[lim].risk;
  w(`| ${m(lim)} | ${setIds(okonoRuns[lim].optimalProjects)} | ${m(x.emv)} | ${m(x.stdDev)} | ${r(x.probLoss)} | ${m(x.p90)} | ${m(x.p10)} | ${x.seed} | ${x.iterations} | ${r(oldNormal(x))} | ${m(x.emv - 1.2816 * x.stdDev)} |`);
}
w();

// -------------------------------------------------------------- Section 12
w('# SECTION 12: Correlation (owned by Expert m02)');
w();
const set600 = okonoRuns[600].optimalProjects;
const sds = set600.map((p) => Math.sqrt(P.projectMoments(p).variance));
const varSum = sds.reduce((s, v) => s + v * v, 0); const sdSum = sds.reduce((s, v) => s + v, 0);
w(`OKONO funded set at 600.0000 (${setIds(set600)}): project sds ${sds.map(m).join(' / ')}; sum of variances ${m(varSum)}; square of the summed sds ${m(sdSum * sdSum)} (derived).`);
w('| rho | stdDev | independentStdDev | spread formula sqrt(sum var + rho x ((sum sd)^2 - sum var)) (derived) | emv | P(loss) | P90 | P10 |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const rho of [0, 0.3, 0.6, 0.9, 1]) {
  const x = P.portfolioRiskMetrics(set600, rho);
  w(`| ${r(rho)} | ${m(x.stdDev)} | ${m(x.independentStdDev)} | ${m(Math.sqrt(varSum + rho * (sdSum * sdSum - varSum)))} | ${m(x.emv)} | ${r(x.probLoss)} | ${m(x.p90)} | ${m(x.p10)} |`);
}
w('# Commentary: two models sit side by side in this table. stdDev is the closed-form moment formula with rho applied to the project outcomes; P(loss), P90 and P10 come from the simulation, where rho is applied to the latent drivers. The spread of the simulated values need not equal the stdDev printed beside them.');
w('Correlation widens the spread and leaves the mean alone. rho is the correlation of the latent drivers of success and of the success spread; the correlation it implies between two projects\' success or failure events is lower than rho.');
for (const id of ['correlation_0', 'correlation_0p5', 'correlation_1', 'clampAbove', 'clampBelow', 'singleProject']) {
  const c = GPC.riskMetrics[id]; const x = P.portfolioRiskMetrics(c.selected, c.correlation === 'NaN' ? NaN : c.correlation, c.useEngineDefaults ? undefined : c.riskOptions);
  w(`- published riskMetrics ${id}: correlation used ${r(x.correlation)}, stdDev ${m(x.stdDev)}, P(loss) ${r(x.probLoss)}; golden stdDev ${m(c.expected.stdDev)}.`);
}
w();

// -------------------------------------------------------------- Section 13
w('# SECTION 13: Joint venture shares (owned by Expert m03)');
w();
const split = A.calculatePartnerCosts(ofonMid.totalBudget, OFON_PARTNERS);
w(`OFON-1 budget ${u(ofonMid.totalBudget)} split by working interest:`);
w('| party | working interest percent | share |');
w('| --- | --- | --- |');
split.partnerAllocations.forEach((p) => w(`| ${p.name} | ${pc(p.working_interest)} | ${u(p.shareAmount)} |`));
w(`| operator | ${pc(split.operatorShare)} | ${u(split.operatorAmount)} |`);
w(`partnerTotal ${pc(split.partnerTotal)}, valid ${split.valid}, note ${split.note === null ? 'none' : `"${split.note}"`}. Shares sum to ${u(split.partnerAllocations.reduce((s, p) => s + p.shareAmount, 0) + split.operatorAmount)} (derived).`);
const billed = A.calculatePartnerCosts(ofonMid.totalActuals, OFON_PARTNERS);
w(`Billing the actuals to date, ${u(ofonMid.totalActuals)}: ${billed.partnerAllocations.map((p) => `${p.name} ${u(p.shareAmount)}`).join('; ')}; operator ${u(billed.operatorAmount)}.`);
for (const n of ['suite test: 70 and 45 is more than the whole', 'suite test: a 10 percent shortfall is valid', 'negative interest: refused, allocation still shown', 'negative interest and a total over 100: both sentences, negative first', 'suite test: no partners']) {
  const c = GAC.partnerSplit[n]; const x = A.calculatePartnerCosts(c.inputs.totalCost, c.inputs.partners);
  w(`- published "${n}": cost ${f(c.inputs.totalCost, 2)}, interests ${JSON.stringify(c.inputs.partners.map((p) => p.working_interest))}; partner amounts ${x.partnerAllocations.map((p) => f(p.shareAmount, 2)).join(' / ') || 'none'}; operator share ${pc(x.operatorShare)}, operator amount ${f(x.operatorAmount, 2)}, valid ${x.valid}, note ${x.note === null ? 'none' : `"${x.note}"`}.`);
}
w('# App surface: before EC5-0 the AFE summary PDF billed two invented partners (Partner A at 30 percent and Partner B at 10 percent) whatever was saved; the repaired PDF bills the AFE\'s saved partners and prints the engine note when the split is invalid.');
w();

// -------------------------------------------------------------- Section 14
w('# SECTION 14: Refusals and flags (owned by Expert m04)');
w();
for (const c of GP.optimizeRefusals) { const a = attempt(() => P.optimizePortfolio({ projects: c.projects, capexLimit: c.capexLimit })); w(`- portfolio ${c.id}: ${a.name}: "${a.error}"`); }
for (const c of GA.metricsRefusals) { const a = attempt(() => A.calculateMetrics(c.inputs.afe, c.inputs.costItems, c.inputs.invoices, c.inputs.asOf)); w(`- AFE "${c.name}": ${a.ok ? 'accepted' : `${a.name}: "${a.error}"`}`); }
const go = GPC.optimize.gridOvershoot; const goRun = P.optimizePortfolio({ projects: go.projects, capexLimit: go.capexLimit, ...(go.riskOptions || {}) });
w(`- flag: published gridOvershoot reports overLimit ${goRun.overLimit}, overLimitBy ${f(goRun.overLimitBy, 4)} (capex ${f(goRun.totalCapex, 4)} against ${f(goRun.capexLimit, 4)}).`);
w();
w('Repaired after this course was cut: an invoice the engine cannot date no longer reaches the S-curve at all, and the count of undated invoices is reported beside the curve, so the money is named instead of being counted from 1970 into every bucket. Repaired in EC5-0: the risk summary (simulation, seed shown), the overshoot flag, the negative capex refusal, the as-of date, SPI null, the S-curve bounded to its window, one forecast rule, negative progress refused, a negative working interest flagged. The Suite repair removed the invented partners and integrations, added AFE dates, one EAC rule on every screen and the resolution and overshoot on screen.');
w('Not repaired (findings, taught as properties): the grid undershoot (D4) and the free project charged a cell (D2); CPI reported as 1 before any money is spent; SPI 1 on a zero-budget AFE; time progress 1 on an AFE with no dates; an entered forecast below the money already spent taken as typed; progress above 100 percent accepted although the refusal message says progress runs from 0 to 100; a blank pos read as certain failure; a non-numeric capex neither refused nor flagged; S-curve labels and plan shifting with the viewer\'s timezone west of UTC; the S-curve plan stopping short of the budget and its forecast ignoring actuals after the as-of date; the correlation slider stopping at 0.9; the unused risk score.');
w();

// -------------------------------------------------------------- Section 15
w('# SECTION 15: Numbers to distrust (owned by Expert m05)');
w();
const noSpend = A.calculateMetrics(OFON_AFE, OFON_ITEMS.map((i) => ({ ...i, actual: 0 })), [], '2027-08-15');
w(`CPI before any spend: OFON-1 with every actual set to 0 (progress unchanged) reports CPI ${r(noSpend.cpi)} with earned value ${u(noSpend.earnedValue)}: the engine returns 1 whenever actuals are 0.`);
const nd = GAC.sCurve['past window, all invoices unpaid: none dated'];
const ndPts = A.generateSCurveData(nd.inputs.afe, nd.inputs.costItems, nd.inputs.invoices, nd.inputs.asOf);
const ndUndated = A.countUndatedInvoices(nd.inputs.invoices);
const ndWasNull = nd.inputs.invoices.find((v) => 'invoice_date' in v && v.invoice_date === null)?.amount;
w(`An invoice with no date: published "past window, all invoices unpaid: none dated" (invoices ${JSON.stringify(nd.inputs.invoices)}) gives a first point Actual of ${ndPts[0].Actual} and a last point Actual of ${ndPts.at(-1).Actual}. Neither invoice carries a date the engine can read, so neither reaches the curve at all, and the engine reports ${ndUndated} undated invoices beside it so the money is named rather than dropped in silence.`);
w(`# Commentary: this case used to read ${ndWasNull} at every point. An amount whose date was null was counted from 1970, which is before any window, so it landed in every bucket and the first point reported spending from before the work began. The figure was plausible, it reconciled with nothing, and no screen said a date was missing. It is the reason this section exists.`);
w(`An overrun drawn as an underrun: OFON-1's last Forecast point on the S-curve is ${u(curve.at(-1).Forecast)}, below the budget of ${u(ofonMid.totalBudget)}, while the EAC is ${u(ofonMid.totalForecast)} and the variance at completion ${u(ofonMid.variance)}.`);
w(`A plan that never reaches the budget: OFON-1's last Planned point ${u(curve.at(-1).Planned)} is ${u(ofonMid.totalBudget - curve.at(-1).Planned)} short of the budget (derived).`);
w();
w('Iterations and the standard error, OKONO funded set at 450.0000:');
w('| seed | iterations | P(loss) | standard error sqrt(p(1 - p) / n) (derived) | P90 |');
w('| --- | --- | --- | --- | --- |');
for (const [seed, it] of [[P.DEFAULT_RISK_SEED, 1000], [P.DEFAULT_RISK_SEED, 10000], [P.DEFAULT_RISK_SEED, 40000], [1, 10000], [2, 10000], [3, 10000]]) {
  const x = P.portfolioRiskMetrics(okonoRuns[450].optimalProjects, 0, { seed, iterations: it });
  w(`| ${seed} | ${it} | ${r(x.probLoss)} | ${r(Math.sqrt(x.probLoss * (1 - x.probLoss) / it))} | ${m(x.p90)} |`);
}
w('A seed buys a reproducible number; iterations buy a smaller standard error. Neither buys a correct model of the projects.');
w();
w('What a portfolio model cannot tell you, as properties of these modules: projects are funded whole; capex is spent in one period and never phased; there is no time value beyond the NPVs entered; correlation is one average number; the success spread is normal; the AFE plan is a straight line; earned value is only as good as the progress typed in.');
w();

// -------------------------------------------------------------- Section 16
w('# SECTION 16: The teaching fields end to end, for the reading modules (owned by Associate m06, Professional m06 and Expert m06)');
w();
for (const lim of [450, 600]) { const o = okonoRuns[lim]; w(`- OKONO at ${m(lim)}: ${setIds(o.optimalProjects)}, capex ${m(o.totalCapex)}, risked EMV ${m(o.totalEmv)}, P(loss) ${r(o.risk.probLoss)}, P90 ${m(o.risk.p90)}.`); }
w(`- OFON-1 as of 2027-08-15: EAC ${u(ofonMid.totalForecast)}, variance ${u(ofonMid.variance)}, EV ${u(ofonMid.earnedValue)}, CPI ${r(ofonMid.cpi)}, SPI ${r(ofonMid.spi)}.`);
w(`- OFON-1 operator share ${pc(split.operatorShare)} of ${u(ofonMid.totalBudget)}: ${u(split.operatorAmount)}.`);
w();

process.stdout.write(`${out.join('\n')}\n`);
