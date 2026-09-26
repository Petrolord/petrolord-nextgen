// Associate (beginner) key truth: every figure or claim below is computed by
// CALLING the engine through lib.mjs. See keytruth.mjs for the format.
const T = (L, g, p = 'dflt') => L.totals(g, { dflt: L.DEFAULT_PROJECT, test: L.TEST_PROJECT, odidi: L.ODIDI }[p]);
const memo = new Map();
const cmp = async (L, p) => {
  if (!memo.has(p)) memo.set(p, await L.compare({ dflt: L.DEFAULT_PROJECT, odidi: L.ODIDI }[p], L.SIX));
  return memo.get(p);
};
const series = async (L, p, id) => (await cmp(L, p)).sensitivityData.price.data.find((d) => d.regimeId === id).values;
const npvs = (L) => L.SIX.map((g) => T(L, g, 'odidi').npv);
const ok = (b, s) => (b ? s : 'no');

export default [
  // final 2: the royalty opens the gap; PIA keeps more and pays more tax
  { q: 'beginner final 2', where: 'key', printed: '154.4828', value: (L) => T(L, L.PIA).royalty },
  { q: 'beginner final 2', where: 'key', printed: '335.8660', value: (L) => T(L, L.GENERIC).royalty },
  { q: 'beginner final 2', where: 'key', printed: 'A much smaller royalty', value: (L) => { const p = T(L, L.PIA); const g = T(L, L.GENERIC); return ok(p.contractorNCF > g.contractorNCF && p.tax > g.tax && p.costRecovered.toFixed(4) === g.costRecovered.toFixed(4) && g.royalty - p.royalty > p.contractorNCF - g.contractorNCF, 'A much smaller royalty'); } },
  { q: 'beginner final 2', where: 'prompt', printed: '1058.0159', value: (L) => T(L, L.PIA).contractorNCF },
  { q: 'beginner final 2', where: 'explanation', printed: '453.4354', value: (L) => T(L, L.PIA).tax },
  { q: 'beginner final 2', where: 'explanation', printed: '941.4436', value: (L) => T(L, L.PIA).costRecovered },
  // final 6
  { q: 'beginner final 6', where: 'prompt', printed: '687.4682', value: (L) => T(L, L.PIA).governmentTake },
  // final 16: the PIA royalty shape
  { q: 'beginner final 16', where: 'key', printed: 'a royalty by price once oil passes that year\'s low benchmark', value: (L) => { const r = L.cf(L.PIA, L.DEFAULT_PROJECT); const imp = r.map((x) => x.royalty / x.grossRevenue); return ok(L.PIA.royalty.type === 'pia_2021' && Math.min(...imp) >= 0.05 - 1e-12 && Math.max(...imp) > 0.05, 'a royalty by price once oil passes that year\'s low benchmark'); } },
  { q: 'beginner final 16', where: 'prompt', printed: '154.4828', value: (L) => T(L, L.PIA).royalty },
  { q: 'beginner final 16', where: 'prompt', printed: '268.6928', value: (L) => T(L, L.BRAZIL).royalty },
  { q: 'beginner final 16', where: 'explanation', printed: '443.2226', value: (L) => T(L, L.PIA, 'test').royalty },
  { q: 'beginner final 16', where: 'explanation', printed: '700.1194', value: (L) => T(L, L.BRAZIL, 'test').royalty },
  // final 18: family of three flat 100 / limit 100
  { q: 'beginner final 18', where: 'key', printed: 'A flat split handing the contractor 100 percent', value: (L) => ok(L.SIX.filter((g) => g.profitSplit.type === 'flat' && g.profitSplit.split === 100 && g.costRecoveryLimit === 100).map((g) => g.id).sort().join() === [L.BRAZIL.id, L.GOM.id, L.GENERIC.id].sort().join(), 'A flat split handing the contractor 100 percent') },
  { q: 'beginner final 18', where: 'explanation', printed: '70 percent of the gross value of crude oil and NGL', value: (L) => ok(L.PIA.costRecoveryLimit === 70 && L.PIA.costRecoveryBase === 'liquids_gross', '70 percent of the gross value of crude oil and NGL') },
  // final 29: only Angola separates payback and payout
  { q: 'beginner final 29', where: 'explanation', printed: 'Angola - Deepwater PSC reports payback 4 against payout 3', value: (L) => ok(L.SIX.filter((g) => { const t = T(L, g); return t.payback !== t.payout; }).map((g) => `${g.name}:${T(L, g).payback}/${T(L, g).payout}`).join() === 'Angola - Deepwater PSC:4/3', 'Angola - Deepwater PSC reports payback 4 against payout 3') },
  // final 30
  { q: 'beginner final 30', where: 'explanation', printed: '428.8774', value: (L) => Math.min(...L.SIX.map((g) => T(L, g).contractorNCF)) },
  { q: 'beginner final 30', where: 'explanation', printed: '1058.0159', value: (L) => Math.max(...L.SIX.map((g) => T(L, g).contractorNCF)) },
  // final 32: five negative at 12 percent, every cumulative positive
  { q: 'beginner final 32', where: 'key', printed: 'fails the discount rate', value: (L) => ok(npvs(L).filter((v) => v < 0).length === 5 && L.SIX.every((g) => T(L, g, 'odidi').rows[24].cumulativeNCF > 0), 'fails the discount rate') },
  { q: 'beginner final 32', where: 'explanation', printed: '1.7389', value: (L) => T(L, L.PIA, 'odidi').npv },
  { q: 'beginner final 32', where: 'explanation', printed: '-5.8662', value: (L) => T(L, L.BRAZIL, 'odidi').npv },
  // final 33: PIA ODIDI price-sweep band
  { q: 'beginner final 33', where: 'prompt', printed: '42.2597', value: async (L) => Math.min(...(await series(L, 'odidi', L.PIA.id))) },
  { q: 'beginner final 33', where: 'prompt', printed: '50.4050', value: async (L) => Math.max(...(await series(L, 'odidi', L.PIA.id))) },
  // final 34: distractor figures
  { q: 'beginner final 34', where: 'option 3', printed: '10.4742', value: (L) => L.cf(L.TIERED, L.ODIDI)[0].royalty },
  { q: 'beginner final 34', where: 'key', printed: '26.1856', value: (L) => L.cf(L.GOM, L.ODIDI)[0].governmentTake },
  // final 36
  { q: 'beginner final 36', where: 'explanation', printed: '24.2824', value: (L) => T(L, L.GOM, 'odidi').closingPool },
  // final 40
  { q: 'beginner final 40', where: 'explanation', printed: '229.9586', value: (L) => T(L, L.PIA, 'odidi').contractorNCF },
  { q: 'beginner final 40', where: 'explanation', printed: '1.7389', value: (L) => T(L, L.PIA, 'odidi').npv },
  // final 41: ODIDI ranges
  { q: 'beginner final 41', where: 'prompt', printed: '196.0260', value: (L) => Math.min(...L.SIX.map((g) => T(L, g, 'odidi').governmentTake)) },
  { q: 'beginner final 41', where: 'prompt', printed: '316.7898', value: (L) => Math.max(...L.SIX.map((g) => T(L, g, 'odidi').governmentTake)) },
  { q: 'beginner final 41', where: 'explanation', printed: '109.1947', value: (L) => Math.min(...L.SIX.map((g) => T(L, g, 'odidi').contractorNCF)) },
  { q: 'beginner final 41', where: 'explanation', printed: '229.9586', value: (L) => Math.max(...L.SIX.map((g) => T(L, g, 'odidi').contractorNCF)) },
  // final 42: which three move on their own
  { q: 'beginner final 42', where: 'key', printed: 'A profit split keyed on the R factor under Ghana and Angola', value: (L) => ok(L.SIX.filter((g) => g.profitSplit.type === 'tiered_r_factor').map((g) => g.id).sort().join() === [L.ANGOLA.id, L.GHANA.id].sort().join() && L.PIA.royalty.type === 'pia_2021' && L.PIA.profitSplit.type === 'pia_cumulative_production' && L.SIX.filter((g) => g.royalty.type === 'sliding_price').length === 0, 'A profit split keyed on the R factor under Ghana and Angola') },
  // m01 3
  { q: 'beginner m01 3', where: 'key', printed: '154.4828', value: (L) => T(L, L.PIA).royalty },
  { q: 'beginner m01 3', where: 'key', printed: '335.8660', value: (L) => T(L, L.GENERIC).royalty },
  { q: 'beginner m01 3', where: 'key', printed: 'more than its heavier tax wins back', value: (L) => { const p = T(L, L.PIA); const g = T(L, L.GENERIC); return ok(p.tax > g.tax && p.contractorNCF > g.contractorNCF, 'more than its heavier tax wins back'); } },
  { q: 'beginner m01 3', where: 'prompt', printed: '1058.0159', value: (L) => T(L, L.PIA).contractorNCF },
  { q: 'beginner m01 3', where: 'option 0', printed: '453.4354', value: (L) => T(L, L.PIA).tax },
  { q: 'beginner m01 3', where: 'option 2', printed: '1591.0013', value: (L) => T(L, L.PIA).profitOil },
  // m01 12: the printed climb is off by one from the hand subtraction
  { q: 'beginner m01 12', where: 'key', printed: '41.6869', value: async (L) => (await series(L, 'dflt', L.PIA.id))[0] },
  { q: 'beginner m01 12', where: 'key', printed: '41.6802', value: async (L) => (await series(L, 'dflt', L.PIA.id))[8] },
  { q: 'beginner m01 12', where: 'key', printed: '-0.0068', value: async (L) => { const v = await series(L, 'dflt', L.PIA.id); return v[8] - v[0]; } },
  { q: 'beginner m01 12', where: 'key', printed: 'a printed climb of -0.0068', value: async (L) => { const v = await series(L, 'dflt', L.PIA.id); return ok((Number(v[8].toFixed(4)) - Number(v[0].toFixed(4))).toFixed(4) !== (v[8] - v[0]).toFixed(4), 'a printed climb of -0.0068'); } },
  // m01 14
  { q: 'beginner m01 14', where: 'option 3', printed: '687.4682', value: (L) => T(L, L.PIA).governmentTake },
  // m03 7: the error is exactly the GoM royalty
  { q: 'beginner m03 7', where: 'key', printed: '50.9979', value: (L) => L.cf(L.GOM, L.DEFAULT_PROJECT)[0].royalty },
  // m03 9: PIA smaller than Brazil on both projects
  { q: 'beginner m03 9', where: 'key', printed: 'plus a royalty by price only while the price clears the year\'s low benchmark', value: (L) => ok(T(L, L.PIA).royalty < T(L, L.BRAZIL).royalty && T(L, L.PIA, 'test').royalty < T(L, L.BRAZIL, 'test').royalty && L.PIA.royalty.type === 'pia_2021', 'plus a royalty by price only while the price clears the year\'s low benchmark') },
  { q: 'beginner m03 9', where: 'prompt', printed: '443.2226', value: (L) => T(L, L.PIA, 'test').royalty },
  // m03 12: two R factor templates at 90 and 50, PIA at 70 of the gross liquids value
  { q: 'beginner m03 12', where: 'key', printed: 'Two tiered on the R factor, capped at 90 and 50 percent', value: (L) => ok(L.GHANA.profitSplit.type === 'tiered_r_factor' && L.ANGOLA.profitSplit.type === 'tiered_r_factor' && L.GHANA.costRecoveryLimit === 90 && L.ANGOLA.costRecoveryLimit === 50 && L.PIA.costRecoveryLimit === 70 && L.PIA.costRecoveryBase === 'liquids_gross', 'Two tiered on the R factor, capped at 90 and 50 percent') },
  // m03 13: most royalty is GoM, whose contractor beats three of the other five
  { q: 'beginner m03 13', where: 'key', printed: '503.7989', value: (L) => Math.max(...L.SIX.map((g) => T(L, g).royalty)) },
  { q: 'beginner m03 13', where: 'key', printed: '980.9313', value: (L) => T(L, L.GOM).contractorNCF },
  { q: 'beginner m03 13', where: 'key', printed: 'more than three of the other five', value: (L) => ok(L.SIX.filter((g) => T(L, g).contractorNCF < T(L, L.GOM).contractorNCF).length === 3, 'more than three of the other five') },
  { q: 'beginner m03 13', where: 'explanation', printed: '1058.0159', value: (L) => T(L, L.PIA).contractorNCF },
  // m05 4, 6
  { q: 'beginner m05 4', where: 'prompt', printed: 'the other five report 3 for both', value: (L) => ok(L.SIX.filter((g) => g.id !== L.ANGOLA.id).every((g) => T(L, g).payback === 3 && T(L, g).payout === 3), 'the other five report 3 for both') },
  { q: 'beginner m05 6', where: 'prompt', printed: 'Five of the six templates report payback in year 3', value: (L) => ok(L.SIX.filter((g) => T(L, g).payback === 3).length === 5, 'Five of the six templates report payback in year 3') },
  // m05 9
  { q: 'beginner m05 9', where: 'prompt', printed: 'the fourth highest', value: (L) => ok(L.SIX.map((g) => T(L, g).contractorNCF).sort((a, b) => b - a).indexOf(T(L, L.BRAZIL).contractorNCF) === 3, 'the fourth highest') },
  { q: 'beginner m05 9', where: 'explanation', printed: '230.9340', value: (L) => Math.min(...L.SIX.map((g) => T(L, g).tax)) },
  { q: 'beginner m05 9', where: 'explanation', printed: 'pays the second most tax', value: (L) => ok(L.SIX.map((g) => T(L, g).tax).sort((a, b) => b - a)[1] === T(L, L.PIA).tax, 'pays the second most tax') },
  // m05 11: the five negative values
  { q: 'beginner m05 11', where: 'key', printed: 'still is not worth building', value: (L) => ok(npvs(L).filter((v) => v < 0).length === 5 && L.SIX.every((g) => T(L, g, 'odidi').rows[24].cumulativeNCF > 0), 'still is not worth building') },
  { q: 'beginner m05 11', where: 'explanation', printed: '1.7389', value: (L) => T(L, L.PIA, 'odidi').npv },
  // m05 13
  { q: 'beginner m05 13', where: 'prompt', printed: '42.2597', value: async (L) => Math.min(...(await series(L, 'odidi', L.PIA.id))) },
  { q: 'beginner m05 13', where: 'prompt', printed: '78.5512', value: async (L) => (await series(L, 'odidi', L.GOM.id))[0] },
  // m06 5: Brazil second most on ODIDI
  { q: 'beginner m06 5', where: 'prompt', printed: 'the second most of the six templates', value: (L) => ok(L.SIX.map((g) => T(L, g, 'odidi').contractorNCF).sort((a, b) => b - a)[1] === T(L, L.BRAZIL, 'odidi').contractorNCF, 'the second most of the six templates') },
  { q: 'beginner m06 5', where: 'option 3', printed: '19.3270', value: (L) => T(L, L.BRAZIL, 'odidi').closingPool },
  // m06 13
  { q: 'beginner m06 13', where: 'prompt', printed: '196.0260', value: (L) => T(L, L.PIA, 'odidi').governmentTake },
  { q: 'beginner m06 13', where: 'explanation', printed: '229.9586', value: (L) => T(L, L.PIA, 'odidi').contractorNCF },
  // m06 14: the instruments that move
  { q: 'beginner m06 14', where: 'key', printed: 'The R factor split Ghana and Angola carry', value: (L) => ok(L.SIX.filter((g) => g.profitSplit.type === 'tiered_r_factor').map((g) => g.id).sort().join() === [L.ANGOLA.id, L.GHANA.id].sort().join() && L.PIA.profitSplit.type === 'pia_cumulative_production', 'The R factor split Ghana and Angola carry') },
];
