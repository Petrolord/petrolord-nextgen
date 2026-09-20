// RECON reproductions for the findings in RECON.md section 3 (3b, 3c, 3d).
// Not a generator: nothing here reaches the digest or the capstone.
//   node /root/md-wip-refinery/recon_findings.mjs
import * as F from './refinery_fields.mjs';
const E = process.env.MD_ENGINES || '/root/wt-md-refinery-nextgen/packages/engines';
const SM = await import(`${E}/engines/downstream/streamModel.js`);
const MR = await import(`${E}/engines/downstream/modularRefinery.js`);
const O = F.ODIOMA;
const ev = O.actuals.map((a, i) => SM.makeEvent({ id: `a${i}`, ledger: 'actual', ...a }));
console.log('3b materialBalance on the ODIOMA actual ledger, opening stocks and closing dips as recorded:');
for (const r of SM.materialBalance({ events: ev, openingByMaterial: O.openingStock, closingByMaterial: O.closingDip })) {
  console.log(`   ${r.materialId.padEnd(10)} opening ${r.opening} in ${r.in} out ${r.out} closing ${r.closing} reported ${r.reportedClosing} unaccounted ${r.unaccounted}`);
}
const t = SM.dualLedgerTotals(ev);
const spend = O.actuals.filter((a) => a.type !== 'delivery').reduce((s, a) => s + a.cost, 0);
const sales = O.actuals.filter((a) => a.type === 'delivery').reduce((s, a) => s + a.cost, 0);
console.log(`3c dualLedgerTotals(actual).cost = ${t.cost}; spend ${spend} + sales ${sales} = ${spend + sales}`);
const slate = MR.productSlate({ productYields: MR.CONFIGURATIONS.hydroskimming.productYields, prices: F.OKORDIA.prices });
const st = MR.feasibilityStreams({ capacityBpd: 5000, crudeCostPerBbl: 60, slate, fixedOpexPerYear: 7.5e6, variableOpexPerBbl: 3.2, capex: 64e6 });
for (const [label, taxRate] of [['30', 30], ["'' (blank)", ''], ['null', null], ['left out', undefined]]) {
  const e = MR.feasibilityEconomics({ streams: st, discountRate: 12, taxRate, startYear: 2027 });
  console.log(`3d feasibilityEconomics taxRate ${label}: ${e.error ? `refused: ${e.error}` : `NPV ${e.metrics.npv.toFixed(4)} MM, total tax ${e.cashflow.reduce((s, c) => s + c.tax, 0).toFixed(4)} MM, inputs.taxRate ${e.inputs.taxRate}`}`);
}
const b = { capacityBpd: 5000, crudeCostPerBbl: 76, slate, fixedOpexPerYear: 7.5e6, variableOpexPerBbl: 3.2, capex: 64e6 };
for (const [k, v] of [['onstreamDays', undefined], ['onstreamDays', ''], ['utilisation', ''], ['constructionYears', undefined], ['constructionYears', ''], ['projectLife', '']]) {
  const r = MR.feasibilityStreams({ ...b, [k]: v });
  console.log(`3h feasibilityStreams ${k} ${v === undefined ? 'left out' : JSON.stringify(v)}: ${r.error ? `refused: ${r.error}` : `annualBbl ${r.annualBbl}, years ${r.years.length}, year 0 capex ${r.years[0].capex}`}`);
}
