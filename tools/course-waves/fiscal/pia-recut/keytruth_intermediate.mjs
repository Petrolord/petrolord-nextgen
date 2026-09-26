// Key truth for the Professional (intermediate) rows of the fiscal PIA re-cut.
// Every value is an engine call through lib.mjs. See keytruth.mjs for the rules.
const liquids = (L, y) => {
  // gross value of crude oil and NGL in year y, read back from the engine by a
  // probe that zeroes gas: grossRevenue of the same project without gas.
  const p = JSON.parse(JSON.stringify(L.ODIDI));
  p.production.gas.initial = 0;
  return L.cf(L.GENERIC, p)[y - 1].grossRevenue;
};
const odidiPia = (L) => L.cf(L.PIA, L.ODIDI);
export default [
  // final 7: the PIA template's limit is 70 percent of the gross value of crude oil and NGL
  { q: 'intermediate final 7', where: 'key', printed: '97.7288', value: (L) => odidiPia(L)[0].costRecovered },
  { q: 'intermediate final 7', where: 'key', printed: '70 percent of the oil and NGL sales alone', value: (L) => Math.abs(odidiPia(L)[0].costRecovered - 0.7 * liquids(L, 1)) < 1e-9 },
  { q: 'intermediate final 7', where: 'prompt', printed: '139.6563', value: (L) => odidiPia(L)[0].grossRevenue },
  { q: 'intermediate final 7', where: 'prompt', printed: '6.9828', value: (L) => odidiPia(L)[0].royalty },
  { q: 'intermediate final 7', where: 'explanation', printed: '347.2750', value: (L) => odidiPia(L)[0].unrecoveredCostPool },
  // final 9: year 11 recovers its own opex with the pool empty
  { q: 'intermediate final 9', where: 'key', printed: 'That year\'s own opex', value: (L) => { const r = odidiPia(L); return r[9].unrecoveredCostPool === 0 && Math.abs(r[10].costRecovered - r[10].opex) < 1e-12 && r[10].unrecoveredCostPool === 0; } },
  { q: 'intermediate final 9', where: 'prompt', printed: '14.8678', value: (L) => odidiPia(L)[8].unrecoveredCostPool },
  { q: 'intermediate final 9', where: 'prompt', printed: '30.1819', value: (L) => odidiPia(L)[9].costRecovered },
  { q: 'intermediate final 9', where: 'prompt', printed: '14.8473', value: (L) => odidiPia(L)[10].costRecovered },
  { q: 'intermediate final 9', where: 'explanation', printed: '15.3141', value: (L) => odidiPia(L)[9].opex },
  // final 24: USA heavier on the take, the PIA template on the tax (test project)
  { q: 'intermediate final 24', where: 'key', printed: 'USA, on the take', value: (L) => { const a = L.totals(L.GOM, L.TEST_PROJECT); const b = L.totals(L.PIA, L.TEST_PROJECT); return a.governmentTake > b.governmentTake && a.tax < b.tax; } },
  { q: 'intermediate final 24', where: 'prompt', printed: '616.4851', value: (L) => L.totals(L.GOM, L.TEST_PROJECT).tax },
  { q: 'intermediate final 24', where: 'prompt', printed: '1929.2089', value: (L) => L.totals(L.GOM, L.TEST_PROJECT).governmentTake },
  { q: 'intermediate final 24', where: 'prompt', printed: '1074.4895', value: (L) => L.totals(L.PIA, L.TEST_PROJECT).tax },
  { q: 'intermediate final 24', where: 'prompt', printed: '1782.9635', value: (L) => L.totals(L.PIA, L.TEST_PROJECT).governmentTake },
  // final 34: ODIDI sort head and the government cash flow ends
  { q: 'intermediate final 34', where: 'prompt', printed: '1.7389', value: async (L) => (await L.compare(L.ODIDI, L.SIX)).summary[0].npv },
  { q: 'intermediate final 34', where: 'prompt', printed: 'Nigeria - PIA (2021)', value: async (L) => (await L.compare(L.ODIDI, L.SIX)).summary[0].name },
  { q: 'intermediate final 34', where: 'prompt', printed: '316.7898', value: (L) => L.totals(L.ANGOLA, L.ODIDI).governmentTake },
  { q: 'intermediate final 34', where: 'prompt', printed: '196.0260', value: (L) => L.totals(L.PIA, L.ODIDI).governmentTake },
  // final 35: two templates split on the R factor; year 11 base under the tiered regime
  { q: 'intermediate final 35', where: 'prompt', printed: 'Two of the six', value: (L) => L.SIX.filter((g) => g.profitSplit.type === 'tiered_r_factor').length === 2 },
  { q: 'intermediate final 35', where: 'explanation', printed: '24.0065', value: (L) => { const x = L.cf(L.TIERED, L.DEFAULT_PROJECT)[10]; return x.contractorNCF + x.tax + x.opex + x.capex - x.costRecovered; } },
  { q: 'intermediate final 35', where: 'explanation', printed: '80.0217', value: (L) => L.cf(L.TIERED, L.DEFAULT_PROJECT)[10].profitOil },
  { q: 'intermediate final 35', where: 'explanation', printed: '230.9340', value: (L) => L.totals(L.GHANA, L.DEFAULT_PROJECT).tax },
  { q: 'intermediate final 35', where: 'explanation', printed: '422.8854', value: (L) => L.totals(L.GENERIC, L.DEFAULT_PROJECT).tax },
  // final 40: the royalty step and the R factor crossing in year 6 of ODIDI
  { q: 'intermediate final 40', where: 'prompt', printed: '0.997329', value: (L) => L.cf(L.TIERED, L.ODIDI)[4].rFactor },
  { q: 'intermediate final 40', where: 'prompt', printed: '1.136133', value: (L) => L.cf(L.TIERED, L.ODIDI)[5].rFactor },
  { q: 'intermediate final 40', where: 'explanation', printed: 'year 6', value: (L) => { const r = odidiPia(L); return r[4].royalty / r[4].grossRevenue < 0.0500001 && r[5].royalty / r[5].grossRevenue > 0.051; } },
  // module m03 ord 14: the R factor column is regime independent
  { q: 'intermediate m03 14', where: 'key', printed: 'no royalty, cost recovery limit, split or tax setting can move it', value: (L) => { const a = L.cf(L.PIA, L.DEFAULT_PROJECT); const b = L.cf(L.GOM, L.DEFAULT_PROJECT); return a.every((r, i) => r.rFactor === b[i].rFactor); } },
  // module m04 ord 13: largest tax inside the smallest take, of the four CIT-only templates
  { q: 'intermediate m04 13', where: 'prompt', printed: '453.4354', value: (L) => L.totals(L.PIA, L.DEFAULT_PROJECT).tax },
  { q: 'intermediate m04 13', where: 'prompt', printed: '687.4682', value: (L) => L.totals(L.PIA, L.DEFAULT_PROJECT).governmentTake },
  { q: 'intermediate m04 13', where: 'prompt', printed: 'largest total tax of the four', value: (L) => { const f = L.SIX.filter((g) => g.tax.rrt === 0 && g.tax.minTax === 0 && g.tax.cit > 0); const t = f.map((g) => L.totals(g, L.DEFAULT_PROJECT)); const p = L.totals(L.PIA, L.DEFAULT_PROJECT); return f.length === 4 && t.every((x) => x.tax <= p.tax && x.governmentTake >= p.governmentTake); } },
  { q: 'intermediate m04 13', where: 'key', printed: 'point in opposite directions', value: (L) => { const p = L.totals(L.PIA, L.DEFAULT_PROJECT); const g = L.totals(L.GHANA, L.DEFAULT_PROJECT); return p.tax > g.tax && p.governmentTake < g.governmentTake; } },
  { q: 'intermediate m04 13', where: 'explanation', printed: '1316.6067', value: (L) => L.totals(L.GHANA, L.DEFAULT_PROJECT).governmentTake },
  // module m05 ord 7: Brazil on ODIDI, no single rate
  { q: 'intermediate m05 7', where: 'prompt', printed: '5.8662', value: (L) => -L.totals(L.BRAZIL, L.ODIDI).npv },
  { q: 'intermediate m05 7', where: 'key', printed: 'no single rate can be named', value: (L) => { const t = L.totals(L.BRAZIL, L.ODIDI); return t.irr === null && t.irrStatus === 'multiple-roots' && t.irrRoots.length === 2 && t.irrRoots[0] < 0 && t.irrRoots[1] > 0 && t.irrRoots[1] < 12; } },
  { q: 'intermediate m05 7', where: 'explanation', printed: '192.9896', value: (L) => L.totals(L.BRAZIL, L.ODIDI).contractorNCF },
  { q: 'intermediate m05 7', where: 'prompt', printed: 'the least negative of the five templates below zero', value: (L) => { const n = L.SIX.map((g) => L.totals(g, L.ODIDI).npv).filter((x) => x < 0); return n.length === 5 && Math.max(...n) === L.totals(L.BRAZIL, L.ODIDI).npv; } },
  // module m05 ord 9 and 11: the IRR contract on published flows
  { q: 'intermediate m05 9', where: 'key', printed: 'above-clamp', value: (L) => L.E.calculateIRRResult([{ year: 1, contractorNCF: -100 }, { year: 2, contractorNCF: 1500 }]).irrStatus },
  { q: 'intermediate m05 11', where: 'key', printed: '10.0000', value: (L) => -L.E.calculateIRRResult([{ year: 1, contractorNCF: -100 }, { year: 2, contractorNCF: 90 }]).irr },
  { q: 'intermediate m05 11', where: 'key', printed: 'no-sign-change', value: (L) => L.E.calculateIRRResult([{ year: 1, contractorNCF: 10 }, { year: 2, contractorNCF: 20 }]).irrStatus },
  // module m05 ord 12: every ODIDI IRR null; NPV range
  { q: 'intermediate m05 12', where: 'explanation', printed: 'All six', value: (L) => L.SIX.every((g) => L.totals(g, L.ODIDI).irr === null) },
  { q: 'intermediate m05 12', where: 'explanation', printed: '1.7389', value: (L) => L.totals(L.PIA, L.ODIDI).npv },
  { q: 'intermediate m05 12', where: 'explanation', printed: '58.1813', value: (L) => -L.totals(L.ANGOLA, L.ODIDI).npv },
  // module m06 ord 6: the spread around the 12 percent hurdle
  { q: 'intermediate m06 6', where: 'key', printed: 'the regime decides which side of zero it lands on', value: (L) => { const n = L.SIX.map((g) => L.totals(g, L.ODIDI).npv); return n.filter((x) => x > 0).length === 1 && n.filter((x) => x < 0).length === 5; } },
  { q: 'intermediate m06 6', where: 'prompt', printed: '1.7389', value: (L) => L.totals(L.PIA, L.ODIDI).npv },
  { q: 'intermediate m06 6', where: 'explanation', printed: '-19.2469', value: (L) => L.totals(L.PIA, L.ODIDI).irrRoots[0] },
  { q: 'intermediate m06 6', where: 'explanation', printed: '12.1606', value: (L) => L.totals(L.PIA, L.ODIDI).irrRoots[1] },
  { q: 'intermediate m06 6', where: 'explanation', printed: 'No regime on that field carries a single rate of return', value: (L) => L.SIX.every((g) => L.totals(g, L.ODIDI).irr === null) },
  // module m06 ord 7: sort ends and take ends
  { q: 'intermediate m06 7', where: 'explanation', printed: 'Nigeria - PIA (2021) first and Angola - Deepwater PSC last', value: async (L) => { const s = (await L.compare(L.ODIDI, L.SIX)).summary; return s[0].name === 'Nigeria - PIA (2021)' && s[5].name === 'Angola - Deepwater PSC'; } },
  // module m06 ord 10: Brazil's share of net revenue and the range
  { q: 'intermediate m06 10', where: 'prompt', printed: '27.5413', value: async (L) => (await L.compare(L.ODIDI, L.SIX)).summary.find((x) => x.name === 'Brazil - Concession').governmentShareOfNetRevenuePct },
  { q: 'intermediate m06 10', where: 'explanation', printed: '23.1713', value: async (L) => Math.min(...(await L.compare(L.ODIDI, L.SIX)).summary.map((x) => x.governmentShareOfNetRevenuePct)) },
  { q: 'intermediate m06 10', where: 'explanation', printed: '37.4463', value: async (L) => Math.max(...(await L.compare(L.ODIDI, L.SIX)).summary.map((x) => x.governmentShareOfNetRevenuePct)) },
  // module m06 ord 11: the capex sweep reaches 1.5; losses
  { q: 'intermediate m06 11', where: 'prompt', printed: 'eight multipliers', value: (L) => L.E.CAPEX_SWEEP_MULTIPLIERS.length === 8 && L.E.CAPEX_SWEEP_MULTIPLIERS[7] === 1.5 },
  { q: 'intermediate m06 11', where: 'explanation', printed: '181.1922', value: (L) => L.totals(L.GHANA, L.ODIDI, 0.8).npv - L.totals(L.GHANA, L.ODIDI, 1.5).npv },
  { q: 'intermediate m06 11', where: 'explanation', printed: '252.6075', value: (L) => L.totals(L.ANGOLA, L.ODIDI, 0.8).npv - L.totals(L.ANGOLA, L.ODIDI, 1.5).npv },
  // module m06 ord 13: only the PIA template clears 12 percent; a 10 percent overrun erases it
  { q: 'intermediate m06 13', where: 'key', printed: 'the only one of the six to clear the field\'s 12 percent', value: (L) => L.SIX.filter((g) => L.totals(g, L.ODIDI).npv > 0).map((g) => g.name).join() === 'Nigeria - PIA (2021)' },
  { q: 'intermediate m06 13', where: 'key', printed: 'a modest overrun erases', value: (L) => L.totals(L.PIA, L.ODIDI, 1.1).npv < 0 },
  { q: 'intermediate m06 13', where: 'explanation', printed: '31.8615', value: (L) => -L.totals(L.PIA, L.ODIDI, 1.1).npv },
  // module m06 ord 15: the pool reopens in year 19
  { q: 'intermediate m06 15', where: 'prompt', printed: '0.8723', value: (L) => odidiPia(L)[18].unrecoveredCostPool },
  { q: 'intermediate m06 15', where: 'prompt', printed: '32.2234', value: (L) => odidiPia(L)[24].unrecoveredCostPool },
  { q: 'intermediate m06 15', where: 'explanation', printed: '11.9734', value: (L) => odidiPia(L)[18].costRecovered },
  { q: 'intermediate m06 15', where: 'explanation', printed: '12.8457', value: (L) => odidiPia(L)[18].opex },
  { q: 'intermediate m06 15', where: 'key', printed: 'the allowance no longer covered the year\'s own cost', value: (L) => { const r = odidiPia(L); return r[17].unrecoveredCostPool === 0 && r[18].costRecovered < r[18].opex; } },
  // AUDIT (key-truth auditor): final 24's gloss, GoM's heavier take is royalty
  { q: 'intermediate final 24', where: 'explanation', printed: '1312.7238', value: (L) => L.totals(L.GOM, L.TEST_PROJECT).royalty },
  { q: 'intermediate final 24', where: 'explanation', printed: '5 and later 10 percent of profit oil', value: (L) => { const r = L.cf(L.PIA, L.TEST_PROJECT); const sh = [...new Set(r.filter((x) => x.profitOil > 0).map((x) => ((x.governmentTake - x.royalty - x.tax) / x.profitOil).toFixed(6)))]; return sh.join() === '0.050000,0.100000'; } },
  // m04 8: the first positive resource rent tax charge, per regime
  { q: 'intermediate m04 8', where: 'explanation', printed: 'year 13', value: (L) => { const z = JSON.parse(JSON.stringify(L.ANGOLA)); z.tax.rrt = 0; const a = L.cf(L.ANGOLA, L.DEFAULT_PROJECT); const b = L.cf(z, L.DEFAULT_PROJECT); return `year ${a.findIndex((r, k) => r.tax - b[k].tax > 1e-9) + 1}`; } },
  { q: 'intermediate m04 8', where: 'explanation', printed: 'year 7', value: (L) => { const z = JSON.parse(JSON.stringify(L.BRAZIL)); z.tax.rrt = 0; const a = L.cf(L.BRAZIL, L.DEFAULT_PROJECT); const b = L.cf(z, L.DEFAULT_PROJECT); return `year ${a.findIndex((r, k) => r.tax - b[k].tax > 1e-9) + 1}`; } },
];
