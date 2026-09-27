// Key-truth checks for the portfolio Professional rows this re-cut changes.
// Every value is an engine return value (lib.mjs); where a check is a boolean
// it tests the engine's own return against a published golden's expected block
// or against another engine return, never against a figure typed here alone.
const curveGoldenLast = (L, name) => {
  const pts = L.curveCase(name);
  const exp = L.GAC.sCurve[name].expected.points;
  return JSON.stringify(pts.at(-1)) === JSON.stringify(exp.at(-1)) && pts.length === exp.length;
};
const curveGoldenAll = (L, name) => JSON.stringify(L.curveCase(name)) === JSON.stringify(L.GAC.sCurve[name].expected.points);
const refusalGolden = (L, name) => {
  const c = L.GAC.metricsRefusals[name];
  const i = c.inputs;
  return L.refusal(() => L.A.calculateMetrics(L.clone(i.afe), L.clone(i.costItems), L.clone(i.invoices), i.asOf)) === c.expected.message;
};
const metricsGolden = (L, name, keys) => {
  const m = L.metricsCase(name);
  const exp = L.GAC.metrics[name].expected;
  return keys.every((k) => m[k] === exp[k]);
};
// A row of the committed teaching digest (the engine's output when the digest was cut), by its first cell.
import fs from 'fs';
const DIGEST = fs.readFileSync(new URL('../digest.txt', import.meta.url), 'utf8').split('\n');
const digestRow = (first, after = 0) => DIGEST.slice(after).find((l) => l.startsWith(`| ${first} |`)).split('|').slice(1, -1).map((x) => x.trim());
const f6 = (x) => (x === null ? 'null' : x.toFixed(6));
/** OFON-1 at an as-of date formatted as the digest's as-of table prints it. */
const asOfRow = (L, d) => { const m = L.ofon(d); return [d, f6(m.timeProgress), String(Math.round(m.plannedValue)), String(Math.round(m.earnedValue)), m.spi === null ? 'null' : f6(m.spi), m.spiStatus, f6(m.cpi)]; };
const ofonWith = (L, code, patch) => L.OFON_ITEMS.map((x) => (x.code === code ? L.item(code, patch) : L.clone(x)));
const EMPTY = 'suite test: empty AFE: no budget and no spend, so SPI and CPI are null';
const WEV = 'suite test: weighted earned value (value earned, nothing spent: CPI null)';
const X100 = 'progress of exactly 100 percent is accepted and earns the whole budget';
const NEGF = 'negative entered forecast is ignored (the S-curve ignores it too)';
const MID = 'past window, asOf mid-year: actuals to June, forecast projected after';
const FUT = 'future window ending on a bucket: the last forecast point is the whole EAC';
const Y2020 = 'suite test: 1200 over 2020 with two invoices';
const FEB = 'February start labels Feb in every zone, asOf mid-window';
const DRL120 = 'Cost item "DRL-01" has progress above 100 percent (120 percent). Progress runs from 0 to 100 percent.';

export default [
  // final 3: the closing point carries the dashboard EAC
  { q: 'intermediate final 3', where: 'key', printed: '27600000', value: (L) => L.ofonCurve().at(-1).Forecast },
  { q: 'intermediate final 3', where: 'prompt', printed: '24949669', value: (L) => L.ofonCurve().find((p) => p.date === 'Nov 27').Forecast },
  { q: 'intermediate final 3', where: 'explanation', printed: '27600000', value: (L) => L.ofon().totalForecast },
  // final 8: progress above 100 refused, naming DRL-01
  { q: 'intermediate final 8', where: 'key', printed: 'refuses the report with an AfeInputError naming DRL', value: (L) => L.refusal(() => L.ofon('2027-08-15', ofonWith(L, 'DRL-01', { progress: 120 }))) === DRL120 },
  { q: 'intermediate final 8', where: 'explanation', printed: 'has progress above', value: (L) => L.refusal(() => L.ofon('2027-08-15', ofonWith(L, 'DRL-01', { progress: 120 }))) === DRL120 },
  // final 10: negative forecast replaced and flagged; negative progress refused
  { q: 'intermediate final 10', where: 'key', printed: 'flagged forecastIgnored "negative"', value: (L) => { const m = L.metricsCase(NEGF); return m.lineForecasts[0].forecastIgnored === 'negative' && m.linesForecastIgnored === 1 && metricsGolden(L, NEGF, ['totalForecast', 'variance']); } },
  { q: 'intermediate final 10', where: 'key', printed: 'the progress stops the calculation with a message naming the cost item', value: (L) => refusalGolden(L, 'negative progress named by description') },
  { q: 'intermediate final 10', where: 'explanation', printed: '100.0000', value: (L) => L.metricsCase(NEGF).totalForecast },
  // final 12: kept and flagged
  { q: 'intermediate final 12', where: 'explanation', printed: 'flagged forecastBelowCommitted', value: (L) => { const c = L.A.itemForecastCheck(L.item('CMT-03', { actual: 1200000 })); return c.forecast === L.A.itemForecast(L.item('CMT-03')) && c.forecastBelowCommitted === true && c.forecastBelowCommittedBy === c.committed - c.forecast; } },
  // final 18: two nulls, told apart by spiStatus
  { q: 'intermediate final 18', where: 'key', printed: '"no-budget"', value: (L) => { const e = L.metricsCase(EMPTY); return e.spi === null && e.spiStatus === 'no-budget' && e.cpi === null && metricsGolden(L, EMPTY, ['spi', 'spiStatus', 'cpi', 'cpiStatus']); } },
  { q: 'intermediate final 18', where: 'key', printed: '"no-planned-value"', value: (L) => { const o = L.ofon('2027-01-15'); return o.spi === null && o.spiStatus === 'no-planned-value' && JSON.stringify(asOfRow(L, '2027-01-15')) === JSON.stringify(digestRow('2027-01-15')); } },
  // final 24: EAC 1500 on the closing point beside Planned 1200
  { q: 'intermediate final 24', where: 'key', printed: 'carries Forecast', value: (L) => curveGoldenLast(L, MID) && L.curveCase(MID).at(-1).Forecast === 1500 },
  { q: 'intermediate final 24', where: 'key', printed: '1200', value: (L) => L.curveCase(MID).at(-1).Planned },
  { q: 'intermediate final 24', where: 'explanation', printed: 'windowEnd true', value: (L) => curveGoldenLast(L, MID) && L.curveCase(MID).length === 13 },
  // final 26: CPI null (no-spend) and SPI null (no-planned-value) on the start day with nothing spent
  { q: 'intermediate final 26', where: 'key', printed: 'cpiStatus "no-spend"', value: (L) => { const m = L.ofon('2027-02-01', L.OFON_ITEMS.map((x) => ({ ...L.clone(x), actual: 0 }))); return m.cpi === null && m.cpiStatus === 'no-spend' && m.spi === null && m.spiStatus === 'no-planned-value' && m.earnedValue === L.ofon().earnedValue; } },
  { q: 'intermediate final 26', where: 'explanation', printed: '110.0000', value: (L) => L.metricsCase(WEV).earnedValue },
  // final 27: 13 points closing on 1 Jan 91 with the whole EAC
  { q: 'intermediate final 27', where: 'prompt', printed: '2450', value: (L) => L.curveCase(FUT).at(-1).Forecast },
  { q: 'intermediate final 27', where: 'explanation', printed: 'where Planned is', value: (L) => curveGoldenLast(L, FUT) && L.curveCase(FUT).at(-1).date === '1 Jan 91' },
  // final 32: planned value as of 2027-08-15
  { q: 'intermediate final 32', where: 'key', printed: '17466060', value: (L) => L.ofon('2027-08-15').plannedValue },
  // final 36: 11 points as of 2027-06-30, closing on the budget
  { q: 'intermediate final 36', where: 'key', printed: 'ten monthly steps from the start date and a closing point on the end date', value: (L) => { const c = L.ofonCurve('2027-06-30'); return c.length === 11 && c.at(-1).windowEnd === true && c.at(-1).Planned === L.ofon('2027-06-30').totalBudget; } },
  { q: 'intermediate final 36', where: 'explanation', printed: 'closes on', value: (L) => { const c = L.ofonCurve('2027-06-30'); return c.at(-1).date === '30 Nov 27' && c.at(-1).Forecast === L.ofon('2027-06-30').totalForecast && c.at(-1).Planned === L.ofon('2027-11-30').plannedValue; } },
  // final 39: only negative progress is refused
  { q: 'intermediate final 39', where: 'key', printed: 'refused with a message that names the item', value: (L) => refusalGolden(L, 'negative progress named by code') },
  { q: 'intermediate final 39', where: 'explanation', printed: 'forecastBelowCommitted', value: (L) => { const c = L.A.itemForecastCheck(L.item('CMT-03', { forecast: 900000 })); return c.forecast === 900000 && c.forecastBelowCommittedBy === 40000; } },
  // final 37: 256 of 729 days
  { q: 'intermediate final 37', where: 'explanation', printed: '0.351166', value: (L) => L.metricsCase('asOf mid-window: SPI against 256 of 729 days').timeProgress },
  // m01 13: both refused
  { q: 'intermediate m01 13', where: 'key', printed: 'Refuses both', value: (L) => refusalGolden(L, 'negative progress named by description') && refusalGolden(L, 'progress beyond 100 percent is refused') },
  // m02 2, 6: kept and flagged
  { q: 'intermediate m02 2', where: 'explanation', printed: '40000', value: (L) => L.A.itemForecastCheck(L.item('CMT-03', { forecast: 900000 })).forecastBelowCommittedBy },
  { q: 'intermediate m02 6', where: 'explanation', printed: '939999', value: (L) => L.A.itemForecastCheck(L.item('CMT-03', { forecast: 1 })).forecastBelowCommittedBy },
  { q: 'intermediate m02 6', where: 'explanation', printed: '1250000', value: (L) => L.A.itemForecastCheck(L.item('CMT-03', { forecast: 0 })).forecast },
  // m02 9: flagged
  { q: 'intermediate m02 9', where: 'explanation', printed: 'forecastIgnored "negative"', value: (L) => { const m = L.metricsCase(NEGF); return m.lineForecasts[0].forecastIgnored === 'negative' && metricsGolden(L, NEGF, ['totalForecast', 'linesForecastIgnored']); } },
  // m02 10: same forecast, told apart by the flag
  { q: 'intermediate m02 10', where: 'key', printed: 'forecastIgnored "negative"', value: (L) => { const n = L.A.itemForecastCheck(L.item('CMP-05', { forecast: -5 })); const z = L.A.itemForecastCheck(L.item('CMP-05', { forecast: 0 })); const b = L.A.itemForecastCheck(L.item('CMP-05')); return n.forecastIgnored === 'negative' && z.forecastIgnored === null && b.forecastIgnored === null && n.forecast === b.forecast && z.forecast === b.forecast && String(b.forecast) === digestRow('CMP-05', DIGEST.findIndex((l) => l.startsWith('# SECTION 7')))[4]; } },
  { q: 'intermediate m02 10', where: 'key', printed: '5600000', value: (L) => L.A.itemForecastCheck(L.item('CMP-05', { forecast: -5 })).forecast },
  // m02 11: a typed budget forecasts 3900000 and is flagged by 400000
  { q: 'intermediate m02 11', where: 'explanation', printed: '400000', value: (L) => L.A.itemForecastCheck(L.item('CSG-02', { forecast: 3900000 })).forecastBelowCommittedBy },
  { q: 'intermediate m02 11', where: 'key', printed: '400000', value: (L) => L.A.itemForecastCheck(L.item('CSG-02', { forecast: 3900000 })).forecastBelowCommittedBy },
  // m02 12: one rule everywhere
  { q: 'intermediate m02 12', where: 'key', printed: '27600000', value: (L) => L.ofon().totalForecast },
  { q: 'intermediate m02 12', where: 'key', printed: '-550000', value: (L) => L.ofon().variance },
  // m03 4: exactly 100 percent earns the whole budget
  { q: 'intermediate m03 4', where: 'key', printed: 'earns its whole budget', value: (L) => { const m = L.metricsCase(X100); return m.earnedValue === m.totalBudget && metricsGolden(L, X100, ['earnedValue', 'cpi']); } },
  { q: 'intermediate m03 4', where: 'prompt', printed: '1.400000', value: (L) => L.metricsCase(X100).cpi },
  { q: 'intermediate m03 4', where: 'prompt', printed: '140.0000', value: (L) => L.metricsCase(X100).earnedValue },
  { q: 'intermediate m03 4', where: 'explanation', printed: '1.000000', value: (L) => L.metricsCase(X100).spi },
  // m03 7: CPI null with nothing spent
  { q: 'intermediate m03 7', where: 'key', printed: 'cpiStatus "no-spend"', value: (L) => { const m = L.metricsCase(WEV); return m.cpi === null && m.cpiStatus === 'no-spend' && metricsGolden(L, WEV, ['cpi', 'cpiStatus', 'earnedValue']); } },
  { q: 'intermediate m03 7', where: 'explanation', printed: '0.275000', value: (L) => L.metricsCase(WEV).spi },
  // m03 8: both null, each with its status
  { q: 'intermediate m03 8', where: 'key', printed: 'spiStatus "no-budget"', value: (L) => { const e = L.metricsCase(EMPTY); return e.cpi === null && e.cpiStatus === 'no-spend' && e.spi === null && e.spiStatus === 'no-budget' && metricsGolden(L, EMPTY, ['cpi', 'spi', 'spiStatus']); } },
  // m03 11, m04 3: null on the start day
  { q: 'intermediate m03 11', where: 'explanation', printed: '"no-planned-value"', value: (L) => { const o = L.ofon('2027-02-01'); return o.spi === null && o.spiStatus === 'no-planned-value' && JSON.stringify(asOfRow(L, '2027-02-01')) === JSON.stringify(digestRow('2027-02-01')); } },
  // m03 13, m04 13: the no-dates fallback
  { q: 'intermediate m03 13', where: 'key', printed: '0.563087', value: (L) => L.ofon('2027-06-30', L.OFON_ITEMS, L.OFON_INVOICES, { afe_number: 'OFON-1', currency: 'USD' }).spi },
  { q: 'intermediate m04 13', where: 'key', printed: '0.563087', value: (L) => L.ofon('2027-02-02', L.OFON_ITEMS, L.OFON_INVOICES, { afe_number: 'OFON-1', currency: 'USD' }).spi },
  { q: 'intermediate m04 13', where: 'explanation', printed: '56.3087', value: (L) => L.ofon().percentComplete },
  { q: 'intermediate m04 11', where: 'prompt', printed: '0.250000', value: (L) => L.metricsCase('no dates: time progress 1').spi },
  { q: 'intermediate m04 9', where: 'key', printed: '56.3087', value: (L) => L.ofon('2028-01-10').percentComplete },
  // m05 12: the closing point carries the budget
  { q: 'intermediate m05 12', where: 'key', printed: '27050000', value: (L) => L.ofonCurve().at(-1).Planned },
  { q: 'intermediate m05 12', where: 'prompt', printed: '24452483', value: (L) => L.ofonCurve().find((p) => p.date === 'Nov 27').Planned },
  { q: 'intermediate m05 12', where: 'explanation', printed: '2597517', value: (L) => { const c = L.ofonCurve(); return c.at(-1).Planned - c.at(-2).Planned; } },
  // m05 13: a step on the end date becomes the closing point
  { q: 'intermediate m05 13', where: 'key', printed: 'the closing point replaces that step and no date appears twice', value: (L) => { const c = L.curveCase(FUT); return curveGoldenAll(L, FUT) && c.at(-1).date === '1 Jan 91' && new Set(c.map((p) => p.date)).size === c.length; } },
  { q: 'intermediate m05 13', where: 'prompt', printed: 'Both last points carry the whole EAC', value: (L) => { if (!curveGoldenAll(L, FUT)) return false; const c = L.ofonCurve(); return c.length === 11 && c.at(-1).Forecast === L.ofon().totalForecast && c.at(-1).Planned === L.ofon().totalBudget; } },
  // m05 14: the same curve in every zone
  { q: 'intermediate m05 14', where: 'key', printed: 'so the first point is', value: (L) => {
      const was = process.env.TZ;
      process.env.TZ = 'America/Los_Angeles';
      const la = L.curveCase(FEB); const laOfon = L.ofonCurve();
      if (was === undefined) delete process.env.TZ; else process.env.TZ = was;
      return JSON.stringify(la) === JSON.stringify(L.GAC.sCurve[FEB].expected.points) && la[0].date === 'Feb 27' && JSON.stringify(laOfon) === JSON.stringify(L.ofonCurve());
    } },
  { q: 'intermediate m05 14', where: 'explanation', printed: '2507947', value: (L) => {
      const was = process.env.TZ;
      process.env.TZ = 'America/Los_Angeles';
      const v = L.ofonCurve()[1].Planned;
      if (was === undefined) delete process.env.TZ; else process.env.TZ = was;
      return v;
    } },
  // m05 15: the 2020 window closes on 31 Dec 20
  { q: 'intermediate m05 15', where: 'key', printed: 'from the invoices to that day', value: (L) => curveGoldenLast(L, Y2020) && L.curveCase(Y2020).at(-1).Actual === 350 && L.curveCase(Y2020).at(-1).Planned === 1200 },
  // m06 4: 900000 kept and flagged by 40000
  { q: 'intermediate m06 4', where: 'explanation', printed: '40000', value: (L) => L.A.itemForecastCheck(L.item('CMT-03', { forecast: 900000 })).forecastBelowCommittedBy },
  // m06 8: CPI null
  { q: 'intermediate m06 8', where: 'key', printed: 'Null, with cpiStatus "no-spend"', value: (L) => { const m = L.metricsCase(WEV); return m.cpi === null && m.cpiStatus === 'no-spend' && metricsGolden(L, WEV, ['cpi', 'earnedValue', 'totalActuals']); } },
  // m06 10: the closing point carries the EAC
  { q: 'intermediate m06 10', where: 'key', printed: '27600000', value: (L) => L.ofonCurve().at(-1).Forecast },
  { q: 'intermediate m06 10', where: 'prompt', printed: '24949669', value: (L) => L.ofonCurve().at(-2).Forecast },
  // m06 12: SPI by date
  { q: 'intermediate m06 12', where: 'explanation', printed: '1.141290', value: (L) => L.ofon('2027-06-30').spi },
  { q: 'intermediate m06 12', where: 'explanation', printed: '0.872063', value: (L) => L.ofon('2027-08-15').spi },
  // m06 15: planned value on the end day
  { q: 'intermediate m06 15', where: 'key', printed: '27050000', value: (L) => L.ofon('2027-11-30').plannedValue },
  { q: 'intermediate m06 15', where: 'key', printed: "the curve's closing point", value: (L) => { const c = L.ofonCurve(); return c.at(-1).date === '30 Nov 27' && c.at(-1).Planned === L.ofon('2027-11-30').plannedValue; } },
  { q: 'intermediate m06 15', where: 'explanation', printed: '2597517', value: (L) => L.ofon('2027-11-30').plannedValue - L.ofonCurve().at(-2).Planned },
];
