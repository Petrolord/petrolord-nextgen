// Key-truth checks for the portfolio Expert rows this re-cut changes. Every
// value is an engine return value (lib.mjs); nothing restates a figure. A
// normal-approximation figure is built from the engine's own emv and stdDev
// with the stats module's normalCDF, the way the digest derives it.
const rm = (L, id) => { const c = L.GPC.riskMethod[id]; return L.risk(c.selected, c.correlation, c.riskOptions ?? {}); };
const normalPLoss = (L, r) => L.ST.normalCDF(-r.emv / r.stdDev);
const normalP90 = (L, r) => r.emv - 1.2816 * r.stdDev;
const rule = (msg) => (msg ? msg.slice(msg.indexOf('" ') + 2) : 'no refusal');
const refusedMetrics = (L, name) => { const c = L.GAC.metricsRefusals[name].inputs; return L.refusal(() => L.A.calculateMetrics(c.afe, c.costItems, c.invoices, c.asOf)); };
const zeroActuals = (L) => L.ofon('2027-08-15', L.OFON_ITEMS.map((i) => ({ ...i, actual: 0 })));
const EMPTY = 'suite test: empty AFE: no budget and no spend, so SPI and CPI are null';
const last = (a) => a[a.length - 1];
const split = (L, name) => { const c = L.GAC.partnerSplit[name].inputs; return L.A.calculatePartnerCosts(c.totalCost, L.clone(c.partners)); };
const probe = { name: 'W', capex: 10, npv_p50: 80, fail_cost: 30 };
// The engine messages as the NEW rows quote them, verbatim. A check that
// compares the engine's refusal with one of these proves the quoted text is the
// engine's; every such check moves under the wording plants.
const Q = {
  pos14: 'has a pos outside 0 to 1 (1.4); pos must be a number from 0 to 1',
  progress150: 'has progress above 100 percent (150 percent). Progress runs from 0 to 100 percent.',
  posRule: 'pos must be a number from 0 to 1',
  capexAbc: 'has a capex that is not a finite number ("abc"); capex must be 0 or more',
  progressRule: 'Progress runs from 0 to 100 percent.',
};

export default [
  // ---------------------------------------------------------------- final exam
  { q: 'advanced final 1', where: 'key', printed: '-50.0000', value: (L) => rm(L, 'singleWildcat').p90 },
  { q: 'advanced final 1', where: 'prompt', printed: '-150.5560', value: (L) => normalP90(L, rm(L, 'singleWildcat')) },
  { q: 'advanced final 2', where: 'prompt', printed: '0.200464', value: (L) => normalPLoss(L, rm(L, 'identical6')) },
  { q: 'advanced final 2', where: 'explanation', printed: '0.166046', value: (L) => normalPLoss(L, rm(L, 'identical8')) },
  { q: 'advanced final 4', where: 'prompt', printed: '0.123600', value: (L) => L.okono(450).risk.probLoss },
  { q: 'advanced final 7', where: 'prompt', printed: '-12.4175', value: (L) => normalP90(L, rm(L, 'mixtureWithSpread')) },
  { q: 'advanced final 7', where: 'prompt', printed: '1.7148', value: (L) => rm(L, 'mixtureWithSpread').p90 },
  { q: 'advanced final 8', where: 'key', printed: '218.4079', value: (L) => normalP90(L, L.okono(600).risk) },
  { q: 'advanced final 8', where: 'explanation', printed: '-57.1494', value: (L) => normalP90(L, L.okono(450).risk) },
  { q: 'advanced final 8', where: 'explanation', printed: '-18.3574', value: (L) => L.okono(450).risk.p90 },
  { q: 'advanced final 16', where: 'key', printed: '232.0795', value: (L) => L.okono(600, { correlation: 0.9 }).risk.stdDev },
  { q: 'advanced final 16', where: 'key', printed: '0.049500', value: (L) => L.okono(600, { correlation: 0.9 }).risk.probLoss },
  { q: 'advanced final 16', where: 'explanation', printed: '239.8888', value: (L) => L.okono(600, { correlation: 1 }).risk.stdDev },
  { q: 'advanced final 21', where: 'key', printed: 'Partner "B" at',
    value: (L) => { const s = split(L, 'negative interest: refused, allocation still shown'); return s.valid === false && s.operatorShare >= 0 && s.partnerAllocations[1].shareAmount === -200 && s.note.startsWith('Partner "B" has a negative working interest (-20.00 percent).'); } },
  { q: 'advanced final 21', where: 'prompt', printed: '90.0000', value: (L) => split(L, 'negative interest: refused, allocation still shown').operatorShare },
  { q: 'advanced final 24', where: 'key', printed: 'has a pos outside',
    value: (L) => rule(L.refusal(() => L.P.projectEmv({ ...probe, pos: 1.4 }))) === Q.pos14 },
  { q: 'advanced final 24', where: 'option 0', printed: '80.0000', value: (L) => L.P.projectEmv({ ...probe }) },
  { q: 'advanced final 25', where: 'key', printed: 'funded whenever its EMV is positive',
    value: (L) => { const r = L.optCase('freeProjectTightLimit'); return r.solveMethod === 'exact' && r.optimalProjects.some((p) => p.id === 'free'); } },
  { q: 'advanced final 25', where: 'explanation', printed: '70.0000', value: (L) => L.optCase('freeProjectTightLimit').totalEmv },
  { q: 'advanced final 26', where: 'key', printed: 'the AFE engine throws for that line',
    value: (L) => { const m = L.refusal(() => L.ofon('2027-08-15', L.OFON_ITEMS.map((i) => (i.code === 'CSG-02' ? { ...i, progress: 110 } : i)))); return m !== null && m.includes('"CSG-02"') && m.endsWith(Q.progressRule); } },
  { q: 'advanced final 28', where: 'key', printed: '780.0000', value: (L) => L.optCase('gridOvershoot').totalEmv },
  { q: 'advanced final 28', where: 'key', printed: 'solved exactly with overLimit false',
    value: (L) => { const r = L.optCase('gridOvershoot'); return L.setIds(r.optimalProjects) === 'A + C' && r.solveMethod === 'exact' && r.overLimit === false; } },
  { q: 'advanced final 29', where: 'key', printed: '860.0000', value: (L) => L.optCase('gridUndershoot').totalEmv },
  { q: 'advanced final 29', where: 'prompt', printed: '200.0000', value: (L) => L.optCase('gridUndershootFallback').optimalityGap },
  { q: 'advanced final 29', where: 'prompt', printed: '660.0000', value: (L) => L.optCase('gridUndershootFallback').totalEmv },
  { q: 'advanced final 30', where: 'key', printed: 'Time progress', value: (L) => L.metricsCase('no dates: time progress 1').timeProgress === 1 },
  { q: 'advanced final 30', where: 'explanation', printed: '0.250000', value: (L) => L.metricsCase('no dates: time progress 1').spi },
  { q: 'advanced final 31', where: 'prompt', printed: 'null with cpiStatus "no-spend"', value: (L) => { const m = zeroActuals(L); return m.cpi === null && m.cpiStatus === 'no-spend'; } },
  { q: 'advanced final 31', where: 'key', printed: '0.872063', value: (L) => zeroActuals(L).spi },
  { q: 'advanced final 32', where: 'key', printed: 'SPI null with spiStatus "no-budget"',
    value: (L) => { const m = L.metricsCase(EMPTY); return m.cpi === null && m.cpiStatus === 'no-spend' && m.spi === null && m.spiStatus === 'no-budget'; } },
  { q: 'advanced final 33', where: 'explanation', printed: 'closing point',
    value: (L) => { const c = L.curveCase('past window, all invoices unpaid: none dated'); const e = last(c); return e.windowEnd === true && e.date === '31 Dec 20' && e.Actual === 0 && e.Planned === 1200; } },
  { q: 'advanced final 34', where: 'key', printed: '27050000', value: (L) => L.ofon('2027-11-30').plannedValue },
  { q: 'advanced final 34', where: 'key', printed: 'window-end point', value: (L) => { const e = last(L.ofonCurve('2027-11-30')); return e.date === '30 Nov 27' && e.windowEnd === true && e.Planned === L.ofon('2027-11-30').plannedValue; } },
  { q: 'advanced final 34', where: 'prompt', printed: '24452483', value: (L) => L.ofonCurve().find((x) => x.date === 'Nov 27').Planned },
  { q: 'advanced final 35', where: 'key', printed: '27600000', value: (L) => last(L.ofonCurve()).Forecast },
  { q: 'advanced final 35', where: 'key', printed: '550000', value: (L) => -L.ofon().variance },
  { q: 'advanced final 35', where: 'prompt', printed: '24949669', value: (L) => L.ofonCurve().find((x) => x.date === 'Nov 27').Forecast },
  { q: 'advanced final 36', where: 'prompt', printed: '0.142035', value: (L) => normalPLoss(L, L.okono(450).risk) },
  { q: 'advanced final 38', where: 'explanation', printed: '588.0000', value: (L) => L.okono(1000).totalEmv },
  { q: 'advanced final 38', where: 'explanation', printed: 'solveMethod exact with optimalityGap', value: (L) => { const r = L.okono(750); return r.solveMethod === 'exact' && r.optimalityGap === 0; } },
  { q: 'advanced final 40', where: 'key', printed: '0.872063', value: (L) => L.ofon().spi },
  { q: 'advanced final 40', where: 'option 3', printed: '291.0000', value: (L) => L.okono(450).totalEmv },
  { q: 'advanced final 40', where: 'option 3', printed: 'solveMethod exact, optimalityGap', value: (L) => { const r = L.okono(450); return r.solveMethod === 'exact' && r.optimalityGap === 0; } },

  // ---------------------------------------------------------------- m01, m02
  { q: 'advanced m01 1', where: 'prompt', printed: '-150.5560', value: (L) => normalP90(L, rm(L, 'singleWildcat')) },
  { q: 'advanced m01 1', where: 'key', printed: '-50.0000', value: (L) => rm(L, 'singleWildcat').p90 },
  { q: 'advanced m01 5', where: 'prompt', printed: '-12.4175', value: (L) => normalP90(L, rm(L, 'mixtureWithSpread')) },
  { q: 'advanced m01 11', where: 'explanation', printed: '0.365832', value: (L) => normalPLoss(L, rm(L, 'singleWildcat')) },
  { q: 'advanced m02 9', where: 'prompt', printed: '137.2208', value: (L) => L.okono(600, { correlation: 0.6 }).risk.p90 },

  // ---------------------------------------------------------------- m03
  { q: 'advanced m03 12', where: 'key', printed: '6036000', value: (L) => L.A.calculatePartnerCosts(15090000, L.clone(L.OFON_PARTNERS)).partnerAllocations[0].shareAmount },
  { q: 'advanced m03 15', where: 'key', printed: 'the engine note printed beside an invalid split',
    value: (L) => { const s = split(L, 'negative interest: refused, allocation still shown'); return s.valid === false && typeof s.note === 'string' && s.partnerAllocations[0].shareAmount === 300; } },

  // ---------------------------------------------------------------- m04
  { q: 'advanced m04 3', where: 'key', printed: 'funded at no cost whenever its EMV is positive',
    value: (L) => { const r = L.optCase('freeProjectTightLimit'); return r.solveMethod === 'exact' && L.setIds(r.optimalProjects) === 'free + A'; } },
  { q: 'advanced m04 3', where: 'explanation', printed: '70.0000', value: (L) => L.optCase('freeProjectTightLimit').totalEmv },
  { q: 'advanced m04 4', where: 'key', printed: '80.0000', value: (L) => L.P.projectEmv({ ...probe }) },
  { q: 'advanced m04 4', where: 'key', printed: 'pos must be a number from', value: (L) => rule(L.refusal(() => L.P.projectEmv({ ...probe, pos: 'n/a' }))).split('; ')[1] === Q.posRule },
  { q: 'advanced m04 4', where: 'explanation', printed: 'has a blank pos', value: (L) => rule(L.refusal(() => L.P.projectEmv({ ...probe, pos: '' }))).split(';')[0] },
  { q: 'advanced m04 5', where: 'key', printed: 'has a capex that is not a finite number',
    value: (L) => Q.capexAbc === rule(L.refusal(() => L.P.optimizePortfolio({ projects: [{ id: 'T', capex: 'abc', npv_p50: 50 }, { id: 'U', capex: 40, npv_p50: 30 }], capexLimit: 100 }))) },
  { q: 'advanced m04 7', where: 'key', printed: 'has progress above',
    value: (L) => rule(refusedMetrics(L, 'progress beyond 100 percent is refused')) === Q.progress150 },
  { q: 'advanced m04 7', where: 'explanation', printed: '140.0000', value: (L) => L.metricsCase('progress of exactly 100 percent is accepted and earns the whole budget').earnedValue },
  { q: 'advanced m04 9', where: 'key', printed: 'false and',
    value: (L) => { const r = L.optCase('gridOvershoot'); return r.overLimit === false && r.overLimitBy === 0 && r.solveMethod === 'exact' && L.setIds(r.optimalProjects) === 'A + C'; } },
  { q: 'advanced m04 10', where: 'key', printed: '1334', value: (L) => { const r = L.optCase('gridOvershootFallback'); return Math.ceil(L.GPC.optimize.gridOvershootFallback.projects[0].capex / r.resolution); } },
  { q: 'advanced m04 10', where: 'key', printed: '668', value: (L) => { const r = L.optCase('gridOvershootFallback'); return Math.ceil(L.GPC.optimize.gridOvershootFallback.projects[1].capex / r.resolution); } },
  { q: 'advanced m04 10', where: 'prompt', printed: '3.000000', value: (L) => L.optCase('gridOvershootFallback').resolution },
  { q: 'advanced m04 11', where: 'key', printed: '860.0000', value: (L) => L.optCase('gridUndershoot').totalEmv },
  { q: 'advanced m04 11', where: 'key', printed: 'solved exactly with optimalityGap', value: (L) => { const r = L.optCase('gridUndershoot'); return r.solveMethod === 'exact' && r.optimalityGap === 0 && r.optimalProjects.length === 4; } },
  { q: 'advanced m04 11', where: 'explanation', printed: '200.0000', value: (L) => L.optCase('gridUndershootFallback').optimalityGap },
  { q: 'advanced m04 13', where: 'key', printed: 'spiStatus "no-budget"',
    value: (L) => { const m = L.metricsCase(EMPTY); return m.spi === null && m.spiStatus === 'no-budget' && m.cpi === null; } },
  { q: 'advanced m04 14', where: 'key', printed: 'Feb', value: (L) => { const f = L.ofonCurve()[0]; return f.date === 'Feb 27' && f.Planned === 0; } },
  { q: 'advanced m04 15', where: 'key', printed: '239.8888', value: (L) => L.okono(600, { correlation: 1 }).risk.stdDev },
  { q: 'advanced m04 15', where: 'key', printed: '0.059000', value: (L) => L.okono(600, { correlation: 1 }).risk.probLoss },

  // ---------------------------------------------------------------- m05
  { q: 'advanced m05 1', where: 'key', printed: 'CPI null with cpiStatus "no-spend"', value: (L) => { const m = zeroActuals(L); return m.cpi === null && m.cpiStatus === 'no-spend'; } },
  { q: 'advanced m05 1', where: 'prompt', printed: '15231500', value: (L) => zeroActuals(L).earnedValue },
  { q: 'advanced m05 3', where: 'explanation', printed: '1200', value: (L) => last(L.curveCase('past window, all invoices unpaid: none dated')).Planned },
  { q: 'advanced m05 6', where: 'key', printed: '27050000', value: (L) => last(L.ofonCurve()).Planned },
  { q: 'advanced m05 6', where: 'key', printed: '2597517', value: (L) => { const c = L.ofonCurve(); return last(c).Planned - c.find((x) => x.date === 'Nov 27').Planned; } },
  { q: 'advanced m05 7', where: 'key', printed: '27600000', value: (L) => last(L.ofonCurve()).Forecast },
  { q: 'advanced m05 7', where: 'key', printed: '-550000', value: (L) => L.ofon().variance },
  { q: 'advanced m05 8', where: 'key', printed: 'every curve closes on a point dated the window end',
    value: (L) => ['suite test: 1200 over 2020 with two invoices', 'future window ending on a bucket: the last forecast point is the whole EAC',
      'past window, asOf mid-year: actuals to June, forecast projected after', 'EC5-9b: a window ending on a month step, read after the end: the step becomes the closing point'].every((n) => {
      const c = L.GAC.sCurve[n]; const i = c.inputs; const e = last(L.curveCase(n));
      const m = L.A.calculateMetrics(L.clone(i.afe), L.clone(i.costItems), L.clone(i.invoices ?? []), i.asOf ?? '2026-09-14');
      return e.windowEnd === true && e.Planned === Math.round(m.totalBudget) && e.Forecast === Math.round(m.totalForecast);
    }) },
  { q: 'advanced m05 8', where: 'prompt', printed: '2450', value: (L) => last(L.curveCase('future window ending on a bucket: the last forecast point is the whole EAC')).Forecast },

  // ---------------------------------------------------------------- m06
  { q: 'advanced m06 1', where: 'key', printed: '-50.0000', value: (L) => rm(L, 'singleWildcat').p90 },
  { q: 'advanced m06 1', where: 'explanation', printed: '0.696100', value: (L) => rm(L, 'singleWildcat').probLoss },
  { q: 'advanced m06 4', where: 'key', printed: '41.2500', value: (L) => L.P.projectEmv(L.OKONO[2]) },
  { q: 'advanced m06 5', where: 'prompt', printed: 'solveMethod exact with optimalityGap', value: (L) => { const r = L.okono(450); return r.solveMethod === 'exact' && r.optimalityGap === 0; } },
  { q: 'advanced m06 5', where: 'key', printed: 'the fallback can fall short', value: (L) => { const r = L.optCase('gridUndershootFallback'); const x = L.optCase('gridUndershoot'); return r.solveMethod === 'grid-feasible' && r.optimalityGap > 0 && x.solveMethod === 'exact' && r.totalEmv < x.totalEmv; } },
  { q: 'advanced m06 5', where: 'explanation', printed: '200.0000', value: (L) => L.optCase('gridUndershootFallback').optimalityGap },
  { q: 'advanced m06 9', where: 'key', printed: '15090000', value: (L) => { const m = L.ofon(); return m.earnedValue / m.cpi; } },
  { q: 'advanced m06 9', where: 'key', printed: 'with nothing spent CPI is null', value: (L) => { const m = zeroActuals(L); return m.cpi === null && m.cpiStatus === 'no-spend'; } },
  { q: 'advanced m06 10', where: 'key', printed: '27600000', value: (L) => L.ofon().totalForecast },
  { q: 'advanced m06 10', where: 'key', printed: '-550000', value: (L) => L.ofon().variance },
  { q: 'advanced m06 15', where: 'key', printed: 'stops the whole report', value: (L) => { const m = L.refusal(() => L.ofon('2027-08-15', L.OFON_ITEMS.map((i) => (i.code === 'LOG-04' ? { ...i, progress: 101 } : i)))); return m !== null && m.endsWith(Q.progressRule); } },
];
