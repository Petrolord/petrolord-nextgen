// Every value the EC5 lab exposes to a panel, a lesson or the grader is pinned
// here against the teaching digest (/root/ec-wip-portfolio/digest.txt), which
// is itself nothing but the portfolio engine's and the AFE engine's return
// values on the published goldens and on the teaching fields OKONO and OFON-1.
//
// THE DIGEST IS REBUILT BYTE FOR BYTE. buildDigest() below is ec5_dump.mjs's
// writer with every engine call replaced by a lab return value: the prose is
// the dump's, the formatting is the dump's (portfolio money to four decimals,
// probabilities and ratios to six, AFE money to whole units, percents to
// four), and every number comes out of portfolioLab.js. The rebuilt text is
// compared with digest.txt section by section and then whole.
//
// THE EIGHTEEN GRADED FIELDS of the IDOHO capstone are pinned separately and
// EXACTLY against /root/ec-wip-portfolio/fields.json, READ FROM THE FILE.
//
// Then the gates: the leak gate (no teaching export may return a number within
// ten times a graded field's ABSOLUTE tolerance of a graded answer, in any of
// three unit shiftings, over every number the lab exports, refusing a tiny
// surface), and the clock gate (the AFE readers return identical output under
// two faked system dates, with a control proving the clock moved).

// FIRST: pin the timezone before anything makes a Date (finding EC5-5; see utcTimezone.js).
import { PINNED_TIMEZONE } from './utcTimezone.js';
import { describe, it, expect, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './portfolioLab.js';

const LAB = Object.fromEntries(Object.entries(L));

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIGEST = '/root/ec-wip-portfolio/digest.txt';
const FIELDS_JSON = '/root/ec-wip-portfolio/fields.json';
const DUMP_MJS = '/root/ec-wip-portfolio/ec5_dump.mjs';
const FIELDS_MJS = '/root/ec-wip-portfolio/ec5_fields.mjs';
const LAB_SOURCE = () => fs.readFileSync(path.join(HERE, 'portfolioLab.js'), 'utf8');

// ---------------------------------------------------------------------------
// The digest's formatting, verbatim from ec5_dump.mjs.
// ---------------------------------------------------------------------------

const f = (x, n) => ((x === null || x === undefined || Number.isNaN(Number(x))) ? 'null' : Number(x).toFixed(n));
const m = (x) => f(x, 4); // portfolio money, million USD
const r = (x) => f(x, 6); // probabilities, ratios, fractions
const u = (x) => f(x, 0); // AFE money, whole currency units
const pc = (x) => f(x, 4); // percents
const setIds = (list) => L.setLabel(list);

// ---------------------------------------------------------------------------
// THE REBUILD. One block per digest section, in the dump's order.
// ---------------------------------------------------------------------------

const buildDigest = () => {
  const out = [];
  const w = (s = '') => out.push(s);

  // Section 1
  const s1 = L.engineRules();
  w('# EC5 Capital Portfolio & Cost Control. Teaching digest.');
  w('# Portfolio money is million USD to four decimals; probabilities and ratios to six; AFE money is whole units of the AFE currency (USD here); percents to four decimals.');
  w();
  w('# SECTION 1: The portfolio engine, what it models and what it refuses (owned by Associate m01)');
  w();
  s1.rules.forEach((rule) => w(`- ${rule}`));
  w(`- Risk summary: emv and stdDev in closed form; probLoss, p90 (the low case, the 10th percentile of simulated portfolio NPV) and p10 (the high case) from a seeded Monte Carlo, default seed ${s1.seed}, default iterations ${s1.iterations}.`);
  w('- P-labels follow the exceedance convention on an NPV outcome: P90 is the low case, P10 the high case. A capex, a cost or a probability never carries a P-label.');
  w();
  w('Refusals (published optimizeRefusals, engine messages verbatim):');
  s1.refusals.forEach((a) => w(`- ${a.id}: ${a.ok ? 'accepted' : `${a.name}: "${a.error}"`}`));
  const clampRow = (c) => `- published ${c.id}: ${JSON.stringify(c.project)} gives risked EMV ${m(c.emv)} (golden ${m(c.goldenEmv)}).`;
  w();
  s1.clampCases.forEach((c) => w(clampRow(c)));
  s1.posProbes.forEach((p) => w(`- probe, npv_p50 80 and fail_cost 30 with ${p.label}: risked EMV ${m(p.emv)}.`));
  w('# Commentary: an absent or null pos defaults to 1 (certain success) and a non-numeric one such as "n/a" is also read as 1, but an empty string is the number 0 and is read as certain failure (finding EC5-6).');
  const tc = s1.textCapexProbe;
  w(`- probe, a project with capex "abc" beside one with capex 40 at a limit of 100: ${tc.ok ? `funded ${setIds(tc.ids)}, total capex ${m(tc.totalCapex)}, total EMV ${m(tc.totalEmv)}` : tc.error}. A non-numeric capex is neither refused nor flagged; it counts as capex 0 and weighs one grid cell (finding EC5-7).`);
  w('# Commentary: the unnamed refusal names the project by its position counted from 0, so "Project "1"" is the second project in the list.');
  w();

  // Section 2
  const s2 = L.okonoInventory();
  w('# SECTION 2: Risking a project, the OKONO inventory (owned by Associate m02)');
  w();
  w('| project | name | capex | npv_p50 | npv_p10 | npv_p90 | pos | fail_cost | risked EMV | success spread | mixture sd |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s2.rows.forEach((p) => {
    w(`| ${p.id} | ${p.name} | ${m(p.capex)} | ${m(p.npv_p50)} | ${m(p.npv_p10)} | ${m(p.npv_p90)} | ${r(p.pos)} | ${m(p.failCost)} | ${m(p.emv)} | ${m(p.successSpread)} | ${m(p.mixtureSdDerived)} |`);
  });
  w('(The success spread is (npv_p10 - npv_p90) / 2.5631, the normal-equivalent standard deviation from the entered percentiles; the mixture sd is the square root of the engine\'s projectMoments variance.)');
  const h = s2.hand;
  w(`OK-3 by hand: ${r(h.pos)} x ${m(h.npvP50)} - ${r(h.failWeightDerived)} x ${m(h.failCost)} = ${m(h.emv)} (engine). Its success-case NPV of ${m(h.npvP50)} is not its value: the EMV is ${r(h.emvShareOfSuccessDerived)} of it (derived).`);
  w();
  s2.publishedEmv.forEach((c) => w(clampRow(c)));
  s2.publishedSpread.forEach((c) => w(`- published successStdDev ${c.id}: ${JSON.stringify(c.project)} gives ${m(c.sd)} (golden ${m(c.goldenSd)}).`));
  w();

  // Section 3
  const s3 = L.okonoBudgets();
  w('# SECTION 3: Choosing under a budget (owned by Associate m03)');
  w();
  w('| capex limit | funded set | total capex | total risked EMV | total success NPV | unspent | resolution | overLimit |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s3.rows.forEach((o) => w(`| ${m(o.limit)} | ${setIds(o.ids)} | ${m(o.totalCapex)} | ${m(o.totalEmv)} | ${m(o.totalNpvSuccess)} | ${m(o.unspentDerived)} (derived) | ${m(o.resolution)} | ${o.overLimit} |`));
  w();
  w('Ranking OKONO by risked EMV per million USD of capex (derived):');
  s3.ranking.forEach((p) => w(`- ${p.id}: ${r(p.emvPerCapexDerived)}`));
  const g = s3.greedy;
  w(`Filling a ${m(g.limit)} limit greedily down that ranking funds ${setIds(g.ids)} at capex ${m(g.capexDerived)} and risked EMV ${m(g.emvDerived)} (derived); the optimizer funds ${setIds(g.optimalIds)} at ${m(g.optimalEmv)}.`);
  w('# Commentary: the optimizer keeps the first best set it builds and replaces it only with a strictly larger EMV, so the order projects are entered decides between tied sets; the result reports one set and no alternatives, and the risk summary is simulated for that set only.');
  w(`At ${m(s3.slack.limit)} the optimizer leaves ${m(s3.slack.unspentDerived)} unspent (derived): no remaining project fits, and OK-6 alone costs ${m(s3.slack.tieBackCapex)}.`);
  w();
  s3.published.forEach((c) => w(`- published ${c.id}: limit ${m(c.capexLimit)}; projects ${c.projects.map((p) => `${p.id} capex ${m(p.capex)} risked EMV ${m(p.emv)}`).join('; ')}; engine set ${setIds(c.ids)}, capex ${m(c.totalCapex)}, EMV ${m(c.totalEmv)}; golden optimal sets ${JSON.stringify(c.goldenOptimalSets)}.`));
  w();

  // Section 4
  const s4 = L.okonoFrontiers();
  w('# SECTION 4: The efficient frontier (owned by Associate m04)');
  w();
  s4.frontiers.forEach((fr) => {
    w(`OKONO frontier at limit ${m(fr.limit)} (capex, best risked EMV):`);
    w('| point | capex | EMV | EMV gained over the previous point | capex added | EMV per extra million USD |');
    w('| --- | --- | --- | --- | --- | --- |');
    fr.points.forEach((pt) => {
      const none = pt.emvGainedDerived === null;
      w(`| ${pt.index} | ${m(pt.capex)} | ${m(pt.emv)} | ${none ? 'none' : m(pt.emvGainedDerived)} | ${none ? 'none' : m(pt.capexAddedDerived)} | ${none ? 'none' : r(pt.emvPerExtraMillionDerived)} |`);
    });
    w('(The last three columns are derived from consecutive rows.)');
    const last = fr.points[fr.points.length - 1];
    w(`Last point ${m(last.capex)}, ${m(last.emv)}: the optimum, ${setIds(fr.ids)}.`);
    w();
  });
  w(`The set behind each frontier point at ${m(s4.frontiers[1].limit)} (derived: every subset of OKONO whose capex and risked EMV equal the point):`);
  s4.setsBehindLargerFrontier.forEach((pt) => w(`- point ${pt.index}: ${pt.setsDerived.map((s) => setIds(s)).join(' or ')}`));
  const gn = s4.gainSmallerToLarger;
  w(`From ${m(gn.from)} to ${m(gn.to)} the optimum gains ${m(gn.emvGainedDerived)} of risked EMV for ${m(gn.capexAddedDerived)} more capex (derived).`);
  const nn = s4.notNested;
  w(`Two budgets on one frontier: at ${m(nn.smaller.limit)} the funded set is ${setIds(nn.smaller.ids)}; at ${m(nn.larger.limit)} it is ${setIds(nn.larger.ids)}. ${nn.droppedAtLarger.join(', ')} is funded at the smaller budget and dropped at the larger one, so the optimal sets are not nested.`);
  w();

  // Section 5
  w('# SECTION 5: The grid under the answer (owned by Associate m05)');
  w();
  L.gridCases().forEach((c) => {
    w(`- published ${c.id}: limit ${f(c.capexLimit, 4)}, resolution ${f(c.resolution, 6)}; projects ${c.projects.map((p) => `${p.id} capex ${f(p.capex, 4)} EMV ${m(p.emv)}`).join('; ')}.`);
    w(`  grid cells ${c.gridCellsDerived}; cell weights ${c.cellWeightsDerived.map((x) => `${x.id} ${x.cells}`).join(', ')} (derived: max(1, round(capex / resolution))); unspent ${f(c.gridUnspentDerived, 4)} (derived).`);
    w(`  engine set ${setIds(c.ids)}, capex ${f(c.totalCapex, 4)}, EMV ${m(c.totalEmv)}, overLimit ${c.overLimit}, overLimitBy ${f(c.overLimitBy, 4)}; exact optimum (golden) EMV ${m(c.goldenExactEmv)} on ${JSON.stringify(c.goldenExactSets)}; gap ${m(c.goldenGap)} (golden); set changed by the grid ${c.goldenSetChanged}.`);
  });
  w('The overshoot is now flagged (overLimit, overLimitBy) and still happens; the undershoot and the one cell charged to a free project are unchanged (findings D2 and D4).');
  w();

  // Section 6
  const s6 = L.ofonLines();
  w('# SECTION 6: An AFE and its lines, OFON-1 (owned by Professional m01)');
  w();
  w(`OFON-1: currency ${s6.afe.currency}, window ${s6.afe.start_date} to ${s6.afe.end_date}.`);
  w('| code | description | budget | commitment | actual | entered forecast | progress percent |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s6.items.forEach((i) => w(`| ${i.code} | ${i.description} | ${u(i.budget)} | ${u(i.commitment)} | ${u(i.actual)} | ${i.enteredForecast ? u(i.enteredForecast) : 'none'} | ${pc(i.progress)} |`));
  w(`Invoices: ${s6.invoices.map((v) => `${v.invoice_date} ${u(v.amount)}`).join('; ')}; invoice total ${u(s6.invoiceTotalDerived)} (derived).`);
  w(`Totals (engine): budget ${u(s6.totalBudget)}, commitments ${u(s6.totalCommitments)}, actuals ${u(s6.totalActuals)}.`);
  w('The metrics read actuals from the cost lines; the S-curve reads actuals from invoices. On OFON-1 the two agree by construction; they need not.');
  w();

  // Section 7
  const s7 = L.forecastRule();
  w('# SECTION 7: One forecast rule (owned by Professional m02)');
  w();
  w(s7.rule);
  w('| code | budget | actual + commitment | entered forecast | itemForecast | rule used | line variance (budget - itemForecast) |');
  w('| --- | --- | --- | --- | --- | --- | --- |');
  s7.rows.forEach((i) => w(`| ${i.code} | ${u(i.budget)} | ${u(i.spendDerived)} (derived) | ${i.enteredForecast ? u(i.enteredForecast) : 'none'} | ${u(i.itemForecast)} | ${i.rule} | ${u(i.lineVarianceDerived)} (derived) |`));
  w(`AFE totals (engine): EAC ${u(s7.eac)}, variance at completion ${u(s7.variance)} (negative means an overrun).`);
  s7.published.forEach((c) => w(`- published "${c.name}": items ${JSON.stringify(c.items)}; engine EAC ${f(c.eac, 4)}, variance ${f(c.variance, 4)}.`));
  s7.probes.forEach((p) => w(`- CMT-03's budget, commitment and actual with ${p.label}: itemForecast ${u(p.itemForecast)}.`));
  w('# Commentary: a forecast of 0 is not positive and falls back to the formula; any positive entered forecast is taken as typed, even one below the money already spent and committed (finding EC5-1). A line with no entered forecast can never show a saving: its forecast is at least its budget, so its variance is 0 or negative. OFON-1\'s three variances of 0 are that floor, not evidence of being on budget.');
  w('# App surface: before EC5-0 the screens disagreed on this rule: the Cost Breakdown table showed the budget as the forecast, the PDF and Excel variance was budget less actual, the Top 5 used budget less (forecast or actual), and editing a line copied the budget into its forecast. After the EC5-0 Suite repair the dashboard tiles, the Cost Breakdown table, the PDF and Excel exports and the Top 5 all use this one rule, and editing a line no longer copies the budget into its forecast.');
  w();

  // Section 8
  const s8 = L.earnedValue();
  w('# SECTION 8: Earned value (owned by Professional m03)');
  w();
  w('| code | budget | progress percent | earned value (budget x progress) | actual |');
  w('| --- | --- | --- | --- | --- |');
  s8.rows.forEach((i) => w(`| ${i.code} | ${u(i.budget)} | ${pc(i.progress)} | ${u(i.earnedDerived)} (derived) | ${u(i.actual)} |`));
  w(`Engine: earned value ${u(s8.earnedValue)}, CPI ${r(s8.cpi)} (earned value over actuals), percent spent ${pc(s8.percentSpent)}, percent complete ${pc(s8.percentComplete)}.`);
  w(L.PLANNED_VALUE_RULE);
  s8.published.forEach((x) => w(`- published "${x.name}": engine EV ${f(x.earnedValue, 4)}, AC ${f(x.totalActuals, 4)}, CPI ${x.cpi === null ? 'null' : r(x.cpi)}, SPI ${x.spi === null ? 'null' : r(x.spi)}.`));
  w();

  // Section 9
  const s9 = L.asOfTable();
  w('# SECTION 9: The as-of date (owned by Professional m04)');
  w();
  w('| as of | time progress | planned value | earned value | SPI | CPI |');
  w('| --- | --- | --- | --- | --- | --- |');
  s9.rows.forEach((x) => w(`| ${x.asOf} | ${r(x.timeProgress)} | ${u(x.plannedValue)} | ${u(x.earnedValue)} | ${x.spi === null ? 'null' : r(x.spi)} | ${r(x.cpi)} |`));
  const dc = s9.dayCounts;
  const [e1, e2] = dc.elapsed;
  w(`Whole days in the OFON-1 window ${L.OFON_AFE.start_date} to ${L.OFON_AFE.end_date}: ${dc.windowDaysDerived} (derived). Elapsed whole days at ${e1.asOf}: ${e1.elapsedDaysDerived}; at ${e2.asOf}: ${e2.elapsedDaysDerived} (derived). Time progress is elapsed over total: ${r(e1.timeProgressDerived)} and ${r(e2.timeProgressDerived)} (derived), matching the engine column.`);
  w('Only planned value, time progress and SPI move with the as-of date; earned value, actuals, CPI and EAC are read from the lines as entered.');
  w('# Commentary: on the end day itself time progress is 1, so the whole budget is planned by the end date. An AFE with no dates still falls back to time progress 1 in the engine (the published no-dates case below): EC5-0 did not change that fallback; the repaired Suite labels SPI unavailable for such an AFE.');
  w('# App surface: before EC5-0 the engine read the clock for time progress, so SPI on a live AFE changed from day to day, and before the start date it reported SPI as Infinity when value had been earned or NaN when not.');
  w('On the start day no whole day has elapsed, so time progress is 0, planned value 0 and SPI null, exactly as before the start.');
  s9.published.forEach((x) => w(`- published "${x.name}": window ${x.startDate ?? 'none'} to ${x.endDate ?? 'none'}, asOf ${x.caseAsOf ?? 'default'}; engine time progress ${r(x.timeProgress)}, SPI ${x.spi === null ? 'null' : r(x.spi)}.`));
  w('# App surface: before EC5-0 the AFE wizard asked for no dates, so time progress fell back to 1 and SPI equalled percent complete divided by 100 (earned value over the whole budget); the repaired wizard asks for the window and the dashboard passes today as the as-of date.');
  w();

  // Section 10
  const s10 = L.sCurve();
  w('# SECTION 10: The S-curve (owned by Professional m05)');
  w();
  w(`OFON-1 S-curve as of ${s10.asOf}:`);
  w('| point | label | Planned | Planned added since the previous point (derived) | Actual | Forecast |');
  w('| --- | --- | --- | --- | --- | --- |');
  s10.points.forEach((p, i) => w(`| ${i} | ${p.date} | ${u(p.Planned)} | ${s10.plannedAddedDerived[i] === null ? 'none' : u(s10.plannedAddedDerived[i])} | ${p.Actual === null ? 'null' : u(p.Actual)} | ${u(p.Forecast)} |`));
  w('# Commentary: a label is the month and a two-digit year ("Feb 27" is February 2027, not the 27th), and each point sits on the start date plus whole months (here the 1st). Actual at a point counts invoices dated on or before that day, so the 2027-07-18 invoice is not in the "Jul 27" point (12700000) and appears at "Aug 27". A month with more days adds more plan. After the as-of date Forecast ignores the actuals entirely and is the EAC spread from the start, so its jump at the first projected point comes from switching formulas, not from spending.');
  w('# Commentary: this digest is built with the timezone pinned to UTC. The engine parses the window as UTC midnight but steps months and prints labels in local time, so the same AFE drawn in a timezone west of UTC (for example America/Los_Angeles) labels its first point "Jan 27" and shifts every Planned value (finding EC5-5); Lagos, Tokyo and UTC agree with this table.');
  w('# App surface: before EC5-0 the curve kept walking past the end date to the current month (a 2020 AFE had 81 points on 2026-09-14 and gained one a month); it now stops at the end date.');
  w(`${s10.pointCount} points, one per calendar month from the start date to the end date. The last Planned point is ${u(s10.lastPlanned)} against a budget of ${u(s10.totalBudget)}: the monthly buckets stop before the plan reaches the budget.`);
  w(`After the as-of date Forecast is the EAC spread linearly from the start, so it jumps from the last actual ${u(s10.lastActual)} to ${u(s10.firstProjectedForecast)} at the first projected point.`);
  s10.published.forEach((c) => w(`- published "${c.name}": window ${c.startDate} to ${c.endDate}, asOf ${c.caseAsOf ?? 'default'}, lines ${JSON.stringify(c.lines)}, invoices ${JSON.stringify(c.invoices)}; ${c.pointCount} points; first ${JSON.stringify(c.first)}; last ${JSON.stringify(c.last)}.`));
  w();

  // Section 11
  const s11 = L.riskMethods();
  w('# SECTION 11: Portfolio risk by simulation (owned by Expert m01)');
  w();
  w('The published riskMethod cases, each run by the engine at its stated seed and iterations, beside the exact answer and the normal approximation the engine used before EC5-0:');
  w('| case | kind | exact P(loss) | normal approximation P(loss) | engine P(loss) | standard error | z | exact P90 outcome | normal P90 | engine P90 |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s11.published.forEach((c) => w(`| ${c.id} | ${c.kind} | ${r(c.goldenExactProbLoss)} | ${r(c.goldenNormalProbLoss)} | ${r(c.engineProbLoss)} | ${r(c.goldenStandardError)} | ${f(c.goldenZ, 4)} | ${c.goldenExactP90Outcome !== null ? m(c.goldenExactP90Outcome) : (c.goldenExactP90Continuous !== null ? `${m(c.goldenExactP90Continuous)} (continuous)` : 'n/a')} | ${m(c.goldenNormalP90)} | ${m(c.engineP90)} |`));
  w('(exact, normal approximation, standard error and z are golden fields; the engine columns are this run.)');
  w('Inputs of the method cases (correlation, then each project as pos / npv_p50 / fail_cost, with its success spread where one is given):');
  s11.published.forEach((c) => w(`- ${c.id}: rho ${r(c.correlation)}, seed ${c.riskOptions.seed}, iterations ${c.riskOptions.iterations}; ${c.selected.map((p) => `${r(p.pos ?? 1)} / ${m(p.npv_p50 ?? 0)} / ${m(p.fail_cost ?? 0)}${p.npv_stddev ? ` sd ${m(p.npv_stddev)}` : ''}${p.npv_p10 !== undefined ? ` P10 ${m(p.npv_p10)} P90 ${m(p.npv_p90)}` : ''}`).join('; ')}.`));
  w();
  w(s11.drawOrder);
  w();
  w('OKONO funded sets through the risk summary (correlation 0, the optimizer default; default seed and iterations):');
  w('| limit | set | emv | stdDev | engine P(loss) | engine P90 | engine P10 | seed | iterations | what the normal approximation would have said, P(loss) (derived) | normal P90 (derived: emv - 1.2816 x stdDev) |');
  w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  s11.okono.forEach((x) => w(`| ${m(x.limit)} | ${setIds(x.ids)} | ${m(x.emv)} | ${m(x.stdDev)} | ${r(x.probLoss)} | ${m(x.p90)} | ${m(x.p10)} | ${x.seed} | ${x.iterations} | ${r(x.normalProbLossDerived)} | ${m(x.normalP90Derived)} |`));
  w();

  // Section 12
  const s12 = L.correlation();
  w('# SECTION 12: Correlation (owned by Expert m02)');
  w();
  w(`OKONO funded set at ${m(s12.limit)} (${setIds(s12.ids)}): project sds ${s12.projectSdsDerived.map(m).join(' / ')}; sum of variances ${m(s12.varianceSumDerived)}; square of the summed sds ${m(s12.sdSumSquaredDerived)} (derived).`);
  w(`| rho | stdDev | independentStdDev | spread formula ${s12.formula} (derived) | emv | P(loss) | P90 | P10 |`);
  w('| --- | --- | --- | --- | --- | --- | --- | --- |');
  s12.rows.forEach((x) => w(`| ${r(x.rho)} | ${m(x.stdDev)} | ${m(x.independentStdDev)} | ${m(x.formulaDerived)} | ${m(x.emv)} | ${r(x.probLoss)} | ${m(x.p90)} | ${m(x.p10)} |`));
  w('# Commentary: two models sit side by side in this table. stdDev is the closed-form moment formula with rho applied to the project outcomes; P(loss), P90 and P10 come from the simulation, where rho is applied to the latent drivers. The spread of the simulated values need not equal the stdDev printed beside them.');
  w('Correlation widens the spread and leaves the mean alone. rho is the correlation of the latent drivers of success and of the success spread; the correlation it implies between two projects\' success or failure events is lower than rho.');
  s12.published.forEach((x) => w(`- published riskMetrics ${x.id}: correlation used ${r(x.correlationUsed)}, stdDev ${m(x.stdDev)}, P(loss) ${r(x.probLoss)}; golden stdDev ${m(x.goldenStdDev)}.`));
  w();

  // Section 13
  const s13 = L.partnerShares();
  w('# SECTION 13: Joint venture shares (owned by Expert m03)');
  w();
  w(`OFON-1 budget ${u(s13.budget.cost)} split by working interest:`);
  w('| party | working interest percent | share |');
  w('| --- | --- | --- |');
  s13.budget.partners.forEach((p) => w(`| ${p.name} | ${pc(p.workingInterest)} | ${u(p.shareAmount)} |`));
  w(`| operator | ${pc(s13.budget.operatorShare)} | ${u(s13.budget.operatorAmount)} |`);
  w(`partnerTotal ${pc(s13.budget.partnerTotal)}, valid ${s13.budget.valid}, note ${s13.budget.note === null ? 'none' : `"${s13.budget.note}"`}. Shares sum to ${u(s13.budget.sharesSumDerived)} (derived).`);
  w(`Billing the actuals to date, ${u(s13.billed.cost)}: ${s13.billed.partners.map((p) => `${p.name} ${u(p.shareAmount)}`).join('; ')}; operator ${u(s13.billed.operatorAmount)}.`);
  s13.published.forEach((x) => w(`- published "${x.name}": cost ${f(x.cost, 2)}, interests ${JSON.stringify(x.interests)}; partner amounts ${x.partnerAmounts.map((a) => f(a, 2)).join(' / ') || 'none'}; operator share ${pc(x.operatorShare)}, operator amount ${f(x.operatorAmount, 2)}, valid ${x.valid}, note ${x.note === null ? 'none' : `"${x.note}"`}.`));
  w('# App surface: before EC5-0 the AFE summary PDF billed two invented partners (Partner A at 30 percent and Partner B at 10 percent) whatever was saved; the repaired PDF bills the AFE\'s saved partners and prints the engine note when the split is invalid.');
  w();

  // Section 14
  const s14 = L.refusalsAndFlags();
  w('# SECTION 14: Refusals and flags (owned by Expert m04)');
  w();
  s14.portfolio.forEach((a) => w(`- portfolio ${a.id}: ${a.name}: "${a.error}"`));
  s14.afe.forEach((a) => w(`- AFE "${a.name}": ${a.ok ? 'accepted' : `${a.errorName}: "${a.error}"`}`));
  const go = s14.overshoot;
  w(`- flag: published gridOvershoot reports overLimit ${go.overLimit}, overLimitBy ${f(go.overLimitBy, 4)} (capex ${f(go.totalCapex, 4)} against ${f(go.capexLimit, 4)}).`);
  w();
  w(s14.repaired);
  w(s14.notRepaired);
  w();

  // Section 15
  const s15 = L.distrust();
  w('# SECTION 15: Numbers to distrust (owned by Expert m05)');
  w();
  w(`CPI before any spend: OFON-1 with every actual set to 0 (progress unchanged) reports CPI ${r(s15.cpiBeforeSpend.cpi)} with earned value ${u(s15.cpiBeforeSpend.earnedValue)}: the engine returns 1 whenever actuals are 0.`);
  w(`An invoice with no date: published "${s15.nullDated.name}" (invoices ${JSON.stringify(s15.nullDated.invoices)}) gives a first point Actual of ${s15.nullDated.firstActual}: the null-dated amount counts from 1970 in every bucket; the missing date never counts.`);
  const up = s15.underrunPicture;
  w(`An overrun drawn as an underrun: OFON-1's last Forecast point on the S-curve is ${u(up.lastForecast)}, below the budget of ${u(up.totalBudget)}, while the EAC is ${u(up.eac)} and the variance at completion ${u(up.variance)}.`);
  w(`A plan that never reaches the budget: OFON-1's last Planned point ${u(s15.shortPlan.lastPlanned)} is ${u(s15.shortPlan.shortDerived)} short of the budget (derived).`);
  w();
  w(`Iterations and the standard error, OKONO funded set at ${m(s15.seedTable.limit)}:`);
  w('| seed | iterations | P(loss) | standard error sqrt(p(1 - p) / n) (derived) | P90 |');
  w('| --- | --- | --- | --- | --- |');
  s15.seedTable.rows.forEach((x) => w(`| ${x.seed} | ${x.iterations} | ${r(x.probLoss)} | ${r(x.standardErrorDerived)} | ${m(x.p90)} |`));
  w('A seed buys a reproducible number; iterations buy a smaller standard error. Neither buys a correct model of the projects.');
  w();
  w(s15.modelLimits);
  w();

  // Section 16
  const s16 = L.endToEnd();
  w('# SECTION 16: The teaching fields end to end, for the reading modules (owned by Associate m06, Professional m06 and Expert m06)');
  w();
  s16.okono.forEach((o) => w(`- OKONO at ${m(o.limit)}: ${setIds(o.ids)}, capex ${m(o.totalCapex)}, risked EMV ${m(o.totalEmv)}, P(loss) ${r(o.probLoss)}, P90 ${m(o.p90)}.`));
  w(`- OFON-1 as of ${s16.ofon.asOf}: EAC ${u(s16.ofon.eac)}, variance ${u(s16.ofon.variance)}, EV ${u(s16.ofon.earnedValue)}, CPI ${r(s16.ofon.cpi)}, SPI ${r(s16.ofon.spi)}.`);
  w(`- OFON-1 operator share ${pc(s16.operator.share)} of ${u(s16.operator.budget)}: ${u(s16.operator.amount)}.`);
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
  it('the tests run in UTC whatever the shell says, as build_digest.sh builds the digest (finding EC5-5)', () => {
    expect(PINNED_TIMEZONE).toBe('UTC');
    expect(new Date('2027-02-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })).toBe('Feb 27');
    expect(L.sCurve().points[0].date).toBe('Feb 27');
  });

  it('the digest carries a plausible number of literals, so it is not empty or mid-rebuild', () => {
    const literals = readDigest().match(/-?\d+(?:\.\d+)?/g) || [];
    expect(literals.length, 'digest.txt is empty or mid-rebuild').toBeGreaterThan(1000);
    expect(Object.keys(sections(readDigest()))).toEqual(SECTION_KEYS);
  });

  it('the teaching fields are copied verbatim from ec5_dump.mjs', () => {
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    const lab = LAB_SOURCE();
    ['OKONO', 'OKONO_LIMITS', 'OFON_AFE', 'OFON_ITEMS', 'OFON_INVOICES', 'OFON_AS_OF', 'OFON_PARTNERS'].forEach((name) => {
      const inDump = dump.match(new RegExp(`^const ${name} = ([\\s\\S]*?);$`, 'm'));
      const inLab = lab.match(new RegExp(`^export const ${name} = ([\\s\\S]*?);$`, 'm'));
      expect(inDump, `${name} in ec5_dump.mjs`).not.toBeNull();
      expect(inLab, `${name} in the lab`).not.toBeNull();
      expect(inLab[1], name).toBe(inDump[1]);
    });
  });

  it('the published goldens are both files, whole', () => {
    const c = L.goldenCounts();
    expect(c.portfolio).toBe(83);
    expect(c.afe).toBeGreaterThan(100);
  });
});

// ---------------------------------------------------------------------------
// 1 to 16. The rebuilt digest, section by section and then whole.
// ---------------------------------------------------------------------------

describe('THE DIGEST, REBUILT FROM LAB RETURN VALUES, BYTE FOR BYTE', () => {
  const titles = {
    preamble: 'the title and the units line',
    S1: 'the portfolio engine, its rules and refusals',
    S2: 'risking a project, OKONO',
    S3: 'choosing under a budget, the greedy fill and ties',
    S4: 'the efficient frontier',
    S5: 'the grid under the answer',
    S6: 'OFON-1 and its lines',
    S7: 'one forecast rule',
    S8: 'earned value',
    S9: 'the as-of date',
    S10: 'the S-curve',
    S11: 'portfolio risk by simulation',
    S12: 'correlation',
    S13: 'joint venture shares',
    S14: 'refusals and flags',
    S15: 'numbers to distrust',
    S16: 'the teaching fields end to end',
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
    expect(text.split('\n').length).toBe(readDigest().split('\n').length);
    expect(text).toBe(readDigest());
  });

  it('NEGATIVE CONTROL: one engine value moved by a single unit in the last printed place is a failed section', () => {
    const text = buildDigest().replace('| DRL-01 | 14200000 | 72.0000 | 10224000 (derived) | 9800000 |', '| DRL-01 | 14200000 | 72.0000 | 10224001 (derived) | 9800000 |');
    expect(sections(text).S8).not.toBe(onDisk.S8);
    expect(sections(text).S7).toBe(onDisk.S7);
  });
});

// ---------------------------------------------------------------------------
// Spot pins that say what the rebuild means.
// ---------------------------------------------------------------------------

describe('what the teaching fields show', () => {
  it('OK-3 is funded at 450 and dropped at 600, and the greedy fill loses to the optimum', () => {
    const b = L.okonoBudgets();
    expect(b.rows.find((x) => x.limit === 450).ids).toContain('OK-3');
    expect(b.rows.find((x) => x.limit === 600).ids).not.toContain('OK-3');
    expect(b.greedy.emvDerived).toBeLessThan(b.greedy.optimalEmv);
    expect(L.okonoFrontiers().notNested.droppedAtLarger).toEqual(['OK-3']);
  });

  it('the as-of reader refuses a date the digest does not print', () => {
    expect(() => L.ofonAsOf('2027-08-16')).toThrow(/digest's as-of dates only/);
    expect(L.ofonAsOf('2027-02-01').spi).toBeNull();
  });

  it('every OFON-1 reader is read at a stated date, never the clock', () => {
    const src = LAB_SOURCE();
    expect(src).not.toMatch(/new Date\(\)/);
    expect(src).not.toMatch(/Date\.now/);
    const s = L.sCurve();
    expect(s.published.every((c) => typeof c.asOfUsed === 'string')).toBe(true);
    expect(L.asOfTable().published.every((c) => typeof c.asOfUsed === 'string')).toBe(true);
  });
});

describe('every reader is pure and deterministic', () => {
  it('two calls agree, and mutating a result changes neither the next call nor the fields', () => {
    const a = L.okonoInventory();
    a.rows[0].capex = 999;
    a.hand.emv = 999;
    expect(L.okonoInventory()).toEqual(L.okonoInventory());
    expect(L.OKONO[0].capex).toBe(120);
    const s = L.sCurve();
    s.points[0].Planned = 1;
    expect(L.sCurve().points[0].Planned).toBe(0);
    const l = L.ofonLines();
    l.items[0].budget = 1;
    expect(L.OFON_ITEMS[0].budget).toBe(14200000);
    expect(L.riskMethods()).toEqual(L.riskMethods());
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE.
// ---------------------------------------------------------------------------

describe('THE CLOCK GATE: the AFE readers never read the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  const AFE_READERS = ['ofonLines', 'forecastRule', 'earnedValue', 'asOfTable', 'sCurve', 'partnerShares', 'refusalsAndFlags', 'distrust', 'endToEnd'];
  const snapshot = () => JSON.stringify(AFE_READERS.map((name) => [name, LAB[name]()]).concat(
    L.OFON_AS_OF.map((d) => [`ofonAsOf(${d})`, L.ofonAsOf(d)]),
    [['idohoCapstoneFields', L.idohoCapstoneFields()]],
  ));

  it('identical output under two faked system dates, one before OFON-1 and one far after', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2019-03-03T12:00:00Z'));
    const early = snapshot();
    vi.setSystemTime(new Date('2094-11-21T12:00:00Z'));
    const late = snapshot();
    expect(late.length).toBeGreaterThan(10000);
    expect(late).toBe(early);
  });

  it('CONTROL: the fake clock did move, and an engine call left to its default asOf does see it', async () => {
    const A = await import('@petrolord/engines/engines/economics/afe.js');
    const undated = () => A.calculateMetrics(L.OFON_AFE, L.OFON_ITEMS, L.OFON_INVOICES).timeProgress;
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2019-03-03T12:00:00Z'));
    const t1 = Date.now();
    const early = undated();
    vi.setSystemTime(new Date('2027-06-30T12:00:00Z'));
    const t2 = Date.now();
    const mid = undated();
    expect(new Date(t1).getUTCFullYear()).toBe(2019);
    expect(new Date(t2).getUTCFullYear()).toBe(2027);
    expect(early).toBe(0);
    expect(mid).toBeGreaterThan(0);
    expect(mid).not.toBe(early);
  });
});

// ---------------------------------------------------------------------------
// THE CAPSTONE: the eighteen graded fields reproduce fields.json exactly.
// ---------------------------------------------------------------------------

const CAPSTONE_FIELDS = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'));

describe('the IDOHO capstone: the eighteen graded fields reproduce fields.json exactly', () => {
  it('fields.json is the eighteen published fields, six per tier, in the published order', () => {
    expect(CAPSTONE_FIELDS).toHaveLength(18);
    expect(CAPSTONE_FIELDS.map((x) => x[0])).toEqual([
      ...Array(6).fill('beginner'), ...Array(6).fill('intermediate'), ...Array(6).fill('advanced'),
    ]);
  });

  it('every one of the eighteen graded answers and tolerances is EXACTLY the published value', () => {
    const got = L.idohoCapstoneFields();
    expect(got.map((x) => x[1])).toEqual(CAPSTONE_FIELDS.map((x) => x[1]));
    const values = L.idohoCapstoneValues(got);
    const tolerances = L.idohoCapstoneTolerances(got);
    const wrong = [];
    CAPSTONE_FIELDS.forEach(([tier, key, v, tol], i) => {
      if (got[i][0] !== tier) wrong.push(`${key}: tier ${got[i][0]} against ${tier}`);
      if (values[key] !== v) wrong.push(`${tier} ${key}: lab ${values[key]} against published ${v}`);
      if (tolerances[key] !== tol) wrong.push(`${tier} ${key}: tolerance ${tolerances[key]} against published ${tol}`);
    });
    expect(wrong).toEqual([]);
  });

  it('the capstone conditions are copied verbatim from ec5_fields.mjs', () => {
    const src = fs.readFileSync(FIELDS_MJS, 'utf8');
    const lab = LAB_SOURCE();
    [
      ['INVENTORY', 'IDOHO'], ['LIMITS', 'IDOHO_LIMITS'], ['EXCLUDED', 'IDOHO_EXCLUDED'], ['RHO', 'IDOHO_RHO'],
      ['AFE', 'IDOHO_AFE'], ['ITEMS', 'IDOHO_ITEMS'], ['AS_OF', 'IDOHO_AS_OF'], ['PARTNERS', 'IDOHO_PARTNERS'],
    ].forEach(([theirs, ours]) => {
      const a = src.match(new RegExp(`^export const ${theirs} = ([\\s\\S]*?);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${ours} = ([\\s\\S]*?);$`, 'm'));
      expect(a, theirs).not.toBeNull();
      expect(b, ours).not.toBeNull();
      expect(b[1], ours).toBe(a[1]);
    });
  });
});

// ---------------------------------------------------------------------------
// THE LEAK GATE: no teaching number may be a graded capstone answer.
// ---------------------------------------------------------------------------

/** Exports that TAKE AN ARGUMENT. Each is walked below at every argument a panel hands it. */
const ARG_REQUIRED = ['ofonAsOf', 'setLabel', 'leakGuardTargets', 'leakGuardHit', 'collectNumbers'];
const GATE_MACHINERY = ['LEAK_GUARD_MARGIN', 'LEAK_GUARD_SCALINGS'];

/**
 * A surface smaller than this is not the lab: refuse to call it clean. The
 * full lab walks 70 entries and about 1600 numbers (measured 2026-09-14); the
 * floor sits below that by less than any one large reader (riskMethods alone
 * is several hundred numbers), so losing a reader to a rename trips it.
 */
const MIN_SURFACE_ENTRIES = 60;
const MIN_SURFACE_NUMBERS = 1300;

/** Every teaching export evaluated: constants as they are, readers called bare, the rest at every panel argument. */
const teachingSurface = () => {
  const out = [];
  Object.entries(L).forEach(([name, v]) => {
    if (L.CAPSTONE_ONLY_EXPORTS.includes(name) || ARG_REQUIRED.includes(name) || GATE_MACHINERY.includes(name)) return;
    out.push({ name, value: typeof v === 'function' ? v() : v });
  });
  L.OFON_AS_OF.forEach((d) => out.push({ name: `ofonAsOf(${d})`, value: L.ofonAsOf(d) }));
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
    expect(t('id_eac_usd', 'as graded').band).toBeCloseTo(5, 12);
    expect(t('id_eac_usd', 'x0.001').band).toBeCloseTo(0.005, 12);
    expect(t('id_prob_loss_second_limit_correlated', 'x1000').band).toBeCloseTo(0.5, 9);
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

  it('the teaching surface names no capstone export and no capstone project, and carries no em dash or en dash', () => {
    const text = JSON.stringify(teachingSurface());
    L.CAPSTONE_ONLY_EXPORTS.forEach((name) => {
      if (name === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(text, `${name} appears in the teaching surface`).not.toContain(name);
    });
    expect(text.toLowerCase()).not.toContain('idoho');
    L.IDOHO.forEach((p) => expect(text).not.toContain(`"${p.id}"`));
    L.IDOHO_PARTNERS.forEach((p) => expect(text).not.toContain(p.name));
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
    const graded = CAPSTONE_FIELDS.find((x) => x[1] === 'id_cpi')[2];
    const planted = surface.map((s) => (s.name === 'earnedValue'
      ? { ...s, value: { ...s.value, cpi: graded + 0.00004 } }
      : s));
    const hits = leakHits(planted, targets);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/^earnedValue\.cpi = .* of id_cpi as graded/);
    expect(leakHits(surface, targets)).toEqual([]);
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: the teaching headlines pass', () => {
    const e = L.endToEnd();
    expect(L.leakGuardHit(e.okono[0].totalEmv, targets)).toBeNull();
    expect(L.leakGuardHit(e.ofon.eac, targets)).toBeNull();
    expect(L.leakGuardHit(e.ofon.cpi, targets)).toBeNull();
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
});
