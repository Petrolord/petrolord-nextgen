// Key-truth checks for the portfolio Associate rows this re-cut changes. Every
// value is an engine return value through lib.mjs; nothing restates a formula.
// A boolean claim is paired with an engine figure (a risked EMV, a refusal
// message, a curve point) so a planted engine defect moves it.
const opt = (L, id, extra) => L.optCase(id, extra);
const emv = (L, id) => L.P.projectEmv(L.clone(L.GPC.projectEmv[id].project));
const refuse = (L, fn) => L.refusal(fn);
const FREE = { id: 'FREE', name: 'Study', capex: 0, npv_p50: 12 };
// A refusal checked in two digit-free and numeric halves: the phrase (only when the
// whole message carries its stated rule) and the figure the message quotes.
const capexMsg = (L, id) => { const c = L.GPC.optimizeRefusals[id]; return L.refusal(() => L.P.optimizePortfolio({ projects: L.clone(c.projects), capexLimit: c.capexLimit })); };
const posMsg = (L, project) => L.refusal(() => L.P.projectEmv(project));
const phrase = (m, ph, rule) => (m && m.includes(ph) && m.endsWith(rule) ? ph : 'moved');
const figure = (m, rule) => (m && m.endsWith(rule) ? Number(m.match(/\((-?[\d.]+)\)/)[1]) : NaN);
// The overshoot fallback's bound is 20 whatever the grid or the EMVs; read it only beside its funded 780.
const gapAt780 = (L) => { const f = L.optCase('gridOvershootFallback'); return f.totalEmv === 780 ? f.optimalityGap : NaN; };
const CAPEX_RULE = '; capex must be 0 or more';
const POS_RULE = '; pos must be a number from 0 to 1';

export default [
  // ------------------------------------------------------------ final exam
  { q: 'beginner final 1', where: 'explanation', printed: '291.0000', value: (L) => L.okono(450e6, {}, L.OKONO.map((p) => ({ ...p, capex: p.capex * 1e6 }))).totalEmv },
  { q: 'beginner final 1', where: 'key', printed: 'exact', value: (L) => L.okono(450, {}, L.OKONO.map((p) => ({ ...p, capex: p.capex * 1e6 }))).solveMethod === 'exact'
      && L.setIds(L.okono(450e6, {}, L.OKONO.map((p) => ({ ...p, capex: p.capex * 1e6 }))).optimalProjects) === L.setIds(L.okono(450).optimalProjects)
      && L.okono(450e6, {}, L.OKONO.map((p) => ({ ...p, capex: p.capex * 1e6 }))).solveMethod },
  { q: 'beginner final 4', where: 'key', printed: 'succeeds in every iteration', value: (L) => {
      const w = { name: 'W', npv_p50: 420, fail_cost: 85 }; const r = L.risk([w]);
      return r.probLoss === 0 && r.p90 === 420 && L.P.projectEmv(w) === 420; } },
  { q: 'beginner final 5', where: 'key', printed: 'funded beside', value: (L) => { const r = L.okono(450, {}, [...L.OKONO, FREE]); return r.optimalProjects.some((p) => p.id === 'FREE') && L.setIds(r.optimalProjects.filter((p) => p.id !== 'FREE')) === L.setIds(L.okono(450).optimalProjects) && L.P.projectEmv(FREE) === 12; } },
  { q: 'beginner final 5', where: 'explanation', printed: '70.0000', value: (L) => opt(L, 'freeProjectTightLimit').totalEmv },
  { q: 'beginner final 7', where: 'key', printed: '200.0000', value: (L) => opt(L, 'gridUndershootFallback').optimalityGap },
  { q: 'beginner final 7', where: 'explanation', printed: '660.0000', value: (L) => opt(L, 'gridUndershootFallback').totalEmv },
  { q: 'beginner final 7', where: 'explanation', printed: '860.0000', value: (L) => opt(L, 'gridUndershoot').totalEmv },
  { q: 'beginner final 9', where: 'key', printed: '200.0000', value: (L) => opt(L, 'gridUndershootFallback').optimalityGap },
  { q: 'beginner final 9', where: 'key', printed: 'grid-feasible', value: (L) => (opt(L, 'gridUndershootFallback').totalEmv === 660 ? opt(L, 'gridUndershootFallback').solveMethod : 'moved') },
  { q: 'beginner final 9', where: 'explanation', printed: 'has a negative capex', value: (L) => phrase(capexMsg(L, 'negativeCapexRefused'), 'has a negative capex', CAPEX_RULE) },
  { q: 'beginner final 9', where: 'explanation', printed: '-150', value: (L) => figure(capexMsg(L, 'negativeCapexRefused'), CAPEX_RULE) },
  { q: 'beginner final 9', where: 'explanation', printed: 'has a pos outside', value: (L) => phrase(posMsg(L, { name: 'a', capex: 10, npv_p50: 80, fail_cost: 30, pos: 1.4 }), 'has a pos outside', POS_RULE) },
  { q: 'beginner final 9', where: 'explanation', printed: '1.4', value: (L) => figure(posMsg(L, { name: 'a', capex: 10, npv_p50: 80, fail_cost: 30, pos: 1.4 }), POS_RULE) },
  { q: 'beginner final 10', where: 'key', printed: '200.0000', value: (L) => opt(L, 'gridUndershootFallback').optimalityGap },
  { q: 'beginner final 10', where: 'explanation', printed: '20.0000', value: (L) => gapAt780(L) },
  { q: 'beginner final 29', where: 'prompt', printed: '3.000000', value: (L) => opt(L, 'gridOvershootFallback').resolution },
  { q: 'beginner final 29', where: 'key', printed: 'the limit divided into', value: (L) => { const f = opt(L, 'gridOvershootFallback'); return f.resolution * 2000 === f.capexLimit && opt(L, 'gridOvershoot').resolution === null; } },
  { q: 'beginner final 30', where: 'key', printed: '780.0000', value: (L) => opt(L, 'gridOvershootFallback').totalEmv },
  { q: 'beginner final 30', where: 'explanation', printed: '20.0000', value: (L) => gapAt780(L) },
  { q: 'beginner final 31', where: 'key', printed: '780.0000', value: (L) => opt(L, 'gridOvershoot').totalEmv },
  { q: 'beginner final 31', where: 'key', printed: '200.0000', value: (L) => opt(L, 'gridUndershoot').totalEmv - opt(L, 'gridUndershootFallback').totalEmv },
  { q: 'beginner final 31', where: 'explanation', printed: '660.0000', value: (L) => opt(L, 'gridUndershootFallback').totalEmv },
  { q: 'beginner final 32', where: 'key', printed: '3.000000', value: (L) => opt(L, 'gridUndershootFallback').resolution },
  { q: 'beginner final 32', where: 'explanation', printed: '200.0000', value: (L) => opt(L, 'gridUndershootFallback').optimalityGap },
  { q: 'beginner final 32', where: 'explanation', printed: '860.0000', value: (L) => opt(L, 'gridUndershoot').totalEmv },
  { q: 'beginner final 33', where: 'key', printed: '70.0000', value: (L) => opt(L, 'freeProjectTightLimit').totalEmv },
  { q: 'beginner final 33', where: 'key', printed: '1.0000', value: (L) => { const s = opt(L, 'freeProjectSlack'); return s.totalEmv === opt(L, 'freeProjectTightLimit').totalEmv ? s.capexLimit - s.totalCapex + (s.totalEmv - 70) : null; } },
  { q: 'beginner final 41', where: 'key', printed: 'a pos left out read as', value: (L) => L.P.projectEmv({ npv_p50: 80, fail_cost: 30 }) === 80 && emv(L, 'negativeFailCostIsZero') === 40 },
  { q: 'beginner final 41', where: 'explanation', printed: '41.2500', value: (L) => L.P.projectEmv(L.OKONO[2]) },
  { q: 'beginner final 42', where: 'key', printed: '10.0000', value: (L) => opt(L, 'freeProjectZeroLimit').totalEmv },
  { q: 'beginner final 42', where: 'explanation', printed: 'funds nothing', value: (L) => opt(L, 'limitBelowEveryProject').optimalProjects.length === 0 && opt(L, 'freeProjectZeroLimit').totalEmv === 10 },
  // ------------------------------------------------------------ m01
  { q: 'beginner m01 4', where: 'explanation', printed: '0.123600', value: (L) => L.okono(450).risk.probLoss },
  { q: 'beginner m01 4', where: 'explanation', printed: '-18.3574', value: (L) => L.okono(450).risk.p90 },
  { q: 'beginner m01 6', where: 'key', printed: 'solved exactly on the capex as typed', value: (L) => { const r = L.okono(450e6, {}, L.OKONO.map((p) => ({ ...p, capex: p.capex * 1e6 }))); return L.setIds(r.optimalProjects) === L.setIds(L.okono(450).optimalProjects) && r.totalEmv === 291; } },
  { q: 'beginner m01 6', where: 'key', printed: 'exact', value: (L) => L.okono(450e6, {}, L.OKONO.map((p) => ({ ...p, capex: p.capex * 1e6 }))).solveMethod },
  { q: 'beginner m01 6', where: 'explanation', printed: '250.0000', value: (L) => opt(L, 'rawDollars').totalEmv },
  { q: 'beginner m01 9', where: 'explanation', printed: 'has a negative capex', value: (L) => phrase(capexMsg(L, 'negativeCapexRefused'), 'has a negative capex', CAPEX_RULE) },
  { q: 'beginner m01 9', where: 'explanation', printed: '-150', value: (L) => figure(capexMsg(L, 'negativeCapexRefused'), CAPEX_RULE) },
  { q: 'beginner m01 10', where: 'key', printed: '105.0000', value: (L) => L.P.projectEmv({ ...L.OKONO[2], fail_cost: -85 }) },
  { q: 'beginner m01 10', where: 'explanation', printed: '40.0000', value: (L) => emv(L, 'negativeFailCostIsZero') },
  { q: 'beginner m01 10', where: 'explanation', printed: 'has a pos outside', value: (L) => phrase(posMsg(L, L.clone(L.GPC.projectEmvRefusals.percentTypedAsPosRefused.project)), 'has a pos outside', POS_RULE) },
  { q: 'beginner m01 10', where: 'explanation', printed: '30', value: (L) => figure(posMsg(L, L.clone(L.GPC.projectEmvRefusals.percentTypedAsPosRefused.project)), POS_RULE) },
  { q: 'beginner m01 11', where: 'key', printed: '-0.5', value: (L) => { const c = L.GPC.optimizeRefusals.negativeCapexUnnamed; const m = refuse(L, () => L.P.optimizePortfolio({ projects: L.clone(c.projects), capexLimit: c.capexLimit })); const g = m && m.match(/negative capex \((-?[\d.]+)\); capex must be 0 or more$/); return g ? Number(g[1]) : NaN; } },
  { q: 'beginner m01 11', where: 'explanation', printed: 'has a negative capex', value: (L) => phrase(capexMsg(L, 'negativeCapexUnnamed'), 'has a negative capex', CAPEX_RULE) },
  { q: 'beginner m01 11', where: 'explanation', printed: '-0.5', value: (L) => figure(capexMsg(L, 'negativeCapexUnnamed'), CAPEX_RULE) },
  { q: 'beginner m01 12', where: 'key', printed: '780.0000', value: (L) => opt(L, 'gridOvershoot').totalEmv },
  { q: 'beginner m01 12', where: 'key', printed: 'A + C', value: (L) => (opt(L, 'gridOvershoot').overLimit === false && opt(L, 'gridOvershoot').totalEmv === 780 ? L.setIds(opt(L, 'gridOvershoot').optimalProjects) : 'moved') },
  // ------------------------------------------------------------ m02
  { q: 'beginner m02 13', where: 'key', printed: 'every iteration', value: (L) => { const w = { name: 'W', npv_p50: 80, fail_cost: 30 }; return L.risk([w]).probLoss === 0 && L.P.projectEmv(w) === 80; } },
  { q: 'beginner m02 13', where: 'explanation', printed: '80.0000', value: (L) => emv(L, 'nullPosIsDefault') },
  { q: 'beginner m02 15', where: 'key', printed: '-30.0000', value: (L) => emv(L, 'posZero') },
  { q: 'beginner m02 15', where: 'explanation', printed: 'has a pos outside', value: (L) => phrase(posMsg(L, L.clone(L.GPC.projectEmvRefusals.posBelowZeroRefused.project)), 'has a pos outside', POS_RULE) },
  { q: 'beginner m02 15', where: 'explanation', printed: '-0.2', value: (L) => figure(posMsg(L, L.clone(L.GPC.projectEmvRefusals.posBelowZeroRefused.project)), POS_RULE) },
  // ------------------------------------------------------------ m03
  { q: 'beginner m03 14', where: 'key', printed: 'keeps the tied set with less capex', value: (L) => {
      // close the gap to an exact tie by raising OK-5 to OK-3's risked EMV: the lighter set comes back
      const tied = L.OKONO.map((p) => (p.id === 'OK-5' ? { ...p, npv_p50: 41.25 } : p));
      const r = L.okono(450, {}, tied);
      return Math.abs(r.totalEmv - 291) < 1e-9 && L.setIds(r.optimalProjects) === 'OK-1 + OK-4 + OK-5' && r.totalCapex < 450; } },
  { q: 'beginner m03 14', where: 'key', printed: 'whatever the entry order', value: (L) => {
      const tied = L.OKONO.map((p) => (p.id === 'OK-5' ? { ...p, npv_p50: 41.25 } : p));
      const a = L.okono(450, {}, tied); const b = L.okono(450, {}, [...tied].reverse());
      return L.setIds(a.optimalProjects) === 'OK-1 + OK-4 + OK-5' && [...b.optimalProjects].map((p) => p.id).sort().join() === 'OK-1,OK-4,OK-5' && Math.abs(b.totalEmv - 291) < 1e-9; } },
  { q: 'beginner m03 7', where: 'key', printed: '-44.0000', value: (L) => L.P.projectEmv(L.clone(L.GPC.optimize.negativeEmvHugeBudget.projects.find((p) => p.id === 'neg'))) },
  { q: 'beginner m04 13', where: 'key', printed: '329.0000', value: (L) => L.okono(510, {}, L.OKONO.filter((p) => ['OK-1', 'OK-3', 'OK-4', 'OK-5'].includes(p.id))).totalEmv },
  { q: 'beginner m04 13', where: 'key', printed: '402.7500', value: (L) => L.okono(600).totalEmv },
  // ------------------------------------------------------------ m05
  { q: 'beginner m05 1', where: 'key', printed: '291.0000', value: (L) => L.okono(450).totalEmv },
  { q: 'beginner m05 1', where: 'prompt', printed: 'exact', value: (L) => [300, 450, 600, 750, 1000].every((x) => L.okono(x).optimalityGap === 0) && L.okono(450).solveMethod },
  { q: 'beginner m05 2', where: 'key', printed: '250.0000', value: (L) => opt(L, 'nonIntegerLimit').totalEmv },
  { q: 'beginner m05 2', where: 'key', printed: '0.5000', value: (L) => { const r = opt(L, 'nonIntegerLimit'); return r.solveMethod === 'exact' ? r.capexLimit - r.totalCapex : null; } },
  { q: 'beginner m05 3', where: 'key', printed: '250.0000', value: (L) => opt(L, 'rawDollars').totalEmv },
  { q: 'beginner m05 3', where: 'key', printed: 'exact', value: (L) => (opt(L, 'rawDollars').resolution === null ? opt(L, 'rawDollars').solveMethod : 'grid') },
  { q: 'beginner m05 4', where: 'key', printed: '0.0000', value: (L) => opt(L, 'rawDollars').optimalityGap + opt(L, 'nonIntegerLimit').optimalityGap },
  { q: 'beginner m05 5', where: 'key', printed: '780.0000', value: (L) => opt(L, 'gridOvershoot').totalEmv },
  { q: 'beginner m05 6', where: 'key', printed: '780.0000', value: (L) => opt(L, 'gridOvershootFallback').totalEmv },
  { q: 'beginner m05 6', where: 'explanation', printed: '20.0000', value: (L) => gapAt780(L) },
  { q: 'beginner m05 6', where: 'explanation', printed: '3.000000', value: (L) => opt(L, 'gridOvershootFallback').resolution },
  { q: 'beginner m05 7', where: 'key', printed: 'A + B', value: (L) => { const f = opt(L, 'gridOvershootFallback'); return f.overLimit === false && f.totalEmv === 780 && !f.optimalProjects.some((p) => p.id === 'B'); } },
  { q: 'beginner m05 8', where: 'key', printed: 'upper bound', value: (L) => { const f = opt(L, 'gridOvershootFallback'); return f.optimalityGap >= opt(L, 'gridOvershoot').totalEmv - f.totalEmv && f.totalEmv === 780; } },
  { q: 'beginner m05 8', where: 'prompt', printed: '20.0000', value: (L) => gapAt780(L) },
  { q: 'beginner m05 8', where: 'explanation', printed: '200.0000', value: (L) => opt(L, 'gridUndershootFallback').optimalityGap },
  { q: 'beginner m05 9', where: 'key', printed: '860.0000', value: (L) => opt(L, 'gridUndershoot').totalEmv },
  { q: 'beginner m05 10', where: 'key', printed: '3.000000', value: (L) => opt(L, 'gridUndershootFallback').resolution },
  { q: 'beginner m05 10', where: 'explanation', printed: '660.0000', value: (L) => opt(L, 'gridUndershootFallback').totalEmv },
  { q: 'beginner m05 10', where: 'explanation', printed: '200.0000', value: (L) => opt(L, 'gridUndershootFallback').optimalityGap },
  { q: 'beginner m05 11', where: 'key', printed: '200.0000', value: (L) => opt(L, 'gridUndershootFallback').optimalityGap },
  { q: 'beginner m05 11', where: 'explanation', printed: '860.0000', value: (L) => opt(L, 'gridUndershoot').totalEmv },
  { q: 'beginner m05 12', where: 'key', printed: '70.0000', value: (L) => opt(L, 'freeProjectTightLimit').totalEmv },
  { q: 'beginner m05 13', where: 'key', printed: '70.0000', value: (L) => opt(L, 'freeProjectSlack').totalEmv },
  { q: 'beginner m05 13', where: 'key', printed: '1.0000', value: (L) => { const s = opt(L, 'freeProjectSlack'); return s.capexLimit - s.totalCapex + (s.totalEmv - 70); } },
  { q: 'beginner m05 14', where: 'key', printed: 'inside its limit in money', value: (L) => ['freeProjectZeroLimit', 'freeProjectTightLimit', 'freeProjectSlack'].every((id) => opt(L, id).overLimit === false && opt(L, id).optimalProjects.some((p) => p.id === 'free')) && opt(L, 'freeProjectZeroLimit').totalEmv === 10 },
  { q: 'beginner m05 15', where: 'key', printed: '200.0000', value: (L) => opt(L, 'gridUndershootFallback').optimalityGap },
  { q: 'beginner m05 15', where: 'explanation', printed: '20.0000', value: (L) => gapAt780(L) },
  // ------------------------------------------------------------ m06
  { q: 'beginner m06 2', where: 'key', printed: 'a pos left out read as', value: (L) => emv(L, 'nullPosIsDefault') === 80 && emv(L, 'negativeFailCostIsZero') === 40 },
  { q: 'beginner m06 2', where: 'explanation', printed: '40.0000', value: (L) => emv(L, 'negativeFailCostIsZero') },
  { q: 'beginner m06 4', where: 'key', printed: 'optimalityGap', value: (L) => { const f = opt(L, 'gridUndershootFallback'); return f.solveMethod === 'grid-feasible' && f.optimalityGap > 0 && f.totalEmv === 660 && f.overLimit === false; } },
  { q: 'beginner m06 4', where: 'explanation', printed: '660.0000', value: (L) => opt(L, 'gridUndershootFallback').totalEmv },
  { q: 'beginner m06 10', where: 'explanation', printed: '27600000', value: (L) => L.ofon().totalForecast },
  { q: 'beginner m06 10', where: 'explanation', printed: '-550000', value: (L) => L.ofon().variance },
  { q: 'beginner m06 12', where: 'key', printed: '27050000', value: (L) => { const c = L.ofonCurve(); return c[c.length - 1].Planned; } },
  { q: 'beginner m06 12', where: 'prompt', printed: '24452483', value: (L) => { const c = L.ofonCurve(); return c[c.length - 2].Planned; } },
  { q: 'beginner m06 12', where: 'explanation', printed: '27600000', value: (L) => { const c = L.ofonCurve(); return c[c.length - 1].Forecast; } },
  { q: 'beginner m06 12', where: 'explanation', printed: '2597517', value: (L) => { const c = L.ofonCurve(); return c[c.length - 1].Planned - c[c.length - 2].Planned; } },
  { q: 'beginner m06 14', where: 'prompt', printed: '291.0000', value: (L) => L.okono(450).totalEmv },
  { q: 'beginner m06 15', where: 'explanation', printed: '402.7500', value: (L) => L.okono(600).totalEmv },
];
