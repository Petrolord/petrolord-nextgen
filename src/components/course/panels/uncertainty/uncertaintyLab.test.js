// Every value the EC3 lab exposes to a panel, a lesson or the grader is pinned
// here against the teaching digest (/root/ec-wip-uncertainty/digest.txt), which
// is itself nothing but the screening engine's, the breakeven engine's and
// lib/stats' return values on the published goldens and on the teaching fields
// ISIALA, OKPOMA and NTEJE. The digest prints money to four decimals in
// millions of USD, prices to four, and ratios and random draws to six. Every
// pin below rebuilds a digest line from the lab's values with the digest's own
// formatting and compares the STRINGS, character for character, engine
// insight sentences included.
//
// THE EIGHTEEN GRADED FIELDS of the UMUNEDE capstone are pinned separately and
// EXACTLY against /root/ec-wip-uncertainty/fields.json, READ FROM THE FILE.
//
// Then the leak gate: no teaching export may return a number within ten times
// a graded field's ABSOLUTE tolerance of a graded answer, in any of three unit
// shiftings, with the band scaled by the shifting. The gate refuses to run over
// an implausibly small surface (dc-wavekit README section 13).
//
// COST. A breakeven run at 5000 iterations is several seconds; the heavy
// readers are computed ONCE in beforeAll and every test reads the same result.

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './uncertaintyLab.js';

// A plain object copy of the namespace, for the lookups by name below.
const LAB = Object.fromEntries(Object.entries(L));

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIGEST = '/root/ec-wip-uncertainty/digest.txt';
const FIELDS_JSON = '/root/ec-wip-uncertainty/fields.json';
const DUMP_MJS = '/root/ec-wip-uncertainty/ec3_dump.mjs';
const FIELDS_MJS = '/root/ec-wip-uncertainty/ec3_fields.mjs';
const HEAVY = 1_800_000;

// ---------------------------------------------------------------------------
// The digest's formatting, verbatim from ec3_dump.mjs.
// ---------------------------------------------------------------------------

const f = (x, n = 2) => ((x === null || x === undefined || Number.isNaN(Number(x))) ? 'null' : Number(x).toFixed(n));
const m = (x) => f(x, 4); // money, $MM
const r = (x) => f(x, 6); // ratios, fractions, draws
const p = (x) => f(x, 4); // percent and USD/bbl

const row = (cells) => `| ${cells.join(' | ')} |`;
const sep = (n) => row(Array(n).fill('---'));
const ledgerCells = (x, cols = L.LEDGER_COLUMNS) => cols.map((c) => (c === 'year' ? String(x[c]) : m(x[c])));
const metricsLine = (mt) => `npv ${m(mt.npv)}, irr ${p(mt.irr)} percent, payback ${p(mt.payback)} years, maxExposure ${m(mt.maxExposure)}, totalRevenue ${m(mt.totalRevenue)}, totalCapex ${m(mt.totalCapex)}, totalOpex ${m(mt.totalOpex)}, totalRoyalty ${m(mt.totalRoyalty)}, totalTax ${m(mt.totalTax)}, totalGovTake ${m(mt.totalGovTake)}`;

// ---------------------------------------------------------------------------
// One call per reader per argument list, shared by the pins and the leak gate.
// ---------------------------------------------------------------------------

const memo = new Map();
const get = (name, ...args) => {
  const key = `${name}(${args.map((a) => JSON.stringify(a)).join(', ')})`;
  if (!memo.has(key)) memo.set(key, (async () => LAB[name](...args))());
  return memo.get(key);
};

/** Readers that make at least one 300 to 20000 iteration breakeven run. */
const HEAVY_READERS = [
  'breakevenRun', 'tornado', 'seedComparison', 'narrowBeliefRun', 'publishedBreakevenRuns',
  'publishedInexactFit', 'publishedUnreachable', 'edges', 'endToEnd', 'wobble', 'umunedeCapstoneFields',
];

beforeAll(async () => {
  for (const name of HEAVY_READERS) {
    // eslint-disable-next-line no-await-in-loop
    await get(name);
  }
}, HEAVY);

// GENERATED FROM /root/ec-wip-uncertainty/digest.txt by line number, with the
// first characters of each block checked against the file. Do not hand-edit a
// value here: every string below is a line of the teaching digest, and the
// first describe block proves each one is still in the file on disk.
const D = {
 "S1.bullets": [
  "- Discounting is MID-YEAR: year index i is discounted by (1 + rate/100)^(i + 0.5).",
  "- The quick form always builds a 20 year case (expandQuickInputs life 20), TaxRoyalty only, gas volume 0 at a gas price of 3.5, capex split 50/50 over the first two years, fixed opex flat, variable opex = oil volume x USD/bbl / 1e6.",
  "- Units: production in bbl a year, prices USD/bbl, money $MM (volume x price / 1e6), rates in percent 0 to 100.",
  "- There is NO economic limit: every year of the life is produced and charged, including years whose net cash flow is negative.",
  "- The Monte Carlo is seeded: runMonteCarlo draws from mulberry32(settings.seed), default DEFAULT_MC_SEED 20260829; the breakeven default seed is DEFAULT_SEED 20260829.",
  "- It is a SCREENING engine: no PIA terms, no cost oil in the quick form, no working interest, no inflation basis. Those live in Petroleum Economics Studio (the EC1 course)."
 ],
 "S1.okpoma": [
  "No economic limit, read off the edge field OKPOMA (6800 bopd declining 18 percent a year, oil 78 USD/bbl, capex 260 $MM (half in each of the first two years), fixed opex 4 $MM a year, variable opex 10 USD/bbl, royalty 10 percent, tax 40 percent, discount rate 10 percent, first year 2027): years after the two capex years with negative net cash flow: 2046; year 20 ncf -0.5576 on gross revenue 4.4603 and opex 4.5718."
 ],
 "S2.quick": [
  "ISIALA quick inputs: 4400 bopd declining 12 percent a year, oil 70 USD/bbl, capex 180 $MM (half in each of the first two years), fixed opex 2.5 $MM a year, variable opex 13 USD/bbl, royalty 15 percent, tax 35 percent, discount rate 12 percent, first year 2027."
 ],
 "S2.expanded": [
  "Expanded: projectLife 20, fiscalType TaxRoyalty, royaltyRate 15, taxRate 35, discountRate 12."
 ],
 "S2.rows": [
  "| 2027 | 1606000.0000 | 70.0000 | 3.5000 | 90.0000 | 2.5000 | 20.8780 |",
  "| 2028 | 1413280.0000 | 70.0000 | 3.5000 | 90.0000 | 2.5000 | 18.3726 |",
  "| 2029 | 1243686.4000 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 16.1679 |",
  "| 2030 | 1094444.0320 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 14.2278 |",
  "| 2031 | 963110.7482 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 12.5204 |",
  "| 2032 | 847537.4584 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 11.0180 |",
  "| 2033 | 745832.9634 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 9.6958 |",
  "| 2034 | 656333.0078 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 8.5323 |",
  "| 2035 | 577573.0468 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 7.5084 |",
  "| 2036 | 508264.2812 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 6.6074 |",
  "| 2037 | 447272.5675 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 5.8145 |",
  "| 2038 | 393599.8594 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 5.1168 |",
  "| 2039 | 346367.8762 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 4.5028 |",
  "| 2040 | 304803.7311 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 3.9624 |",
  "| 2041 | 268227.2834 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 3.4870 |",
  "| 2042 | 236040.0094 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 3.0685 |",
  "| 2043 | 207715.2082 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 2.7003 |",
  "| 2044 | 182789.3833 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 2.3763 |",
  "| 2045 | 160854.6573 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 2.0911 |",
  "| 2046 | 141552.0984 | 70.0000 | 3.5000 | 0.0000 | 2.5000 | 1.8402 |"
 ],
 "S2.decline": [
  "Decline, year on year: year 2 over year 1 = 0.880000 (derived), year 20 over year 1 = 0.088140 (derived)."
 ],
 "S3.rows": [
  "| 2027 | 112.4200 | 16.8630 | 90.0000 | 23.3780 | 90.0000 | 0.0000 | -17.8210 | -17.8210 | 16.8630 |",
  "| 2028 | 98.9296 | 14.8394 | 90.0000 | 20.8726 | 90.0000 | 0.0000 | -26.7825 | -44.6035 | 14.8394 |",
  "| 2029 | 87.0580 | 13.0587 | 0.0000 | 18.6679 | 0.0000 | 19.3660 | 35.9654 | -8.6381 | 32.4247 |",
  "| 2030 | 76.6111 | 11.4917 | 0.0000 | 16.7278 | 0.0000 | 16.9371 | 31.4546 | 22.8165 | 28.4287 |",
  "| 2031 | 67.4178 | 10.1127 | 0.0000 | 15.0204 | 0.0000 | 14.7996 | 27.4850 | 50.3015 | 24.9123 |",
  "| 2032 | 59.3276 | 8.8991 | 0.0000 | 13.5180 | 0.0000 | 12.9187 | 23.9918 | 74.2934 | 21.8178 |",
  "| 2033 | 52.2083 | 7.8312 | 0.0000 | 12.1958 | 0.0000 | 11.2634 | 20.9178 | 95.2112 | 19.0947 |",
  "| 2034 | 45.9433 | 6.8915 | 0.0000 | 11.0323 | 0.0000 | 9.8068 | 18.2127 | 113.4238 | 16.6983 |",
  "| 2035 | 40.4301 | 6.0645 | 0.0000 | 10.0084 | 0.0000 | 8.5250 | 15.8321 | 129.2560 | 14.5895 |",
  "| 2036 | 35.5785 | 5.3368 | 0.0000 | 9.1074 | 0.0000 | 7.3970 | 13.7373 | 142.9933 | 12.7338 |",
  "| 2037 | 31.3091 | 4.6964 | 0.0000 | 8.3145 | 0.0000 | 6.4044 | 11.8938 | 154.8871 | 11.1007 |",
  "| 2038 | 27.5520 | 4.1328 | 0.0000 | 7.6168 | 0.0000 | 5.5308 | 10.2716 | 165.1586 | 9.6636 |",
  "| 2039 | 24.2458 | 3.6369 | 0.0000 | 7.0028 | 0.0000 | 4.7621 | 8.8440 | 174.0026 | 8.3990 |",
  "| 2040 | 21.3363 | 3.2004 | 0.0000 | 6.4624 | 0.0000 | 4.0857 | 7.5877 | 181.5903 | 7.2861 |",
  "| 2041 | 18.7759 | 2.8164 | 0.0000 | 5.9870 | 0.0000 | 3.4904 | 6.4822 | 188.0725 | 6.3068 |",
  "| 2042 | 16.5228 | 2.4784 | 0.0000 | 5.5685 | 0.0000 | 2.9666 | 5.5093 | 193.5818 | 5.4450 |",
  "| 2043 | 14.5401 | 2.1810 | 0.0000 | 5.2003 | 0.0000 | 2.5056 | 4.6532 | 198.2350 | 4.6866 |",
  "| 2044 | 12.7953 | 1.9193 | 0.0000 | 4.8763 | 0.0000 | 2.0999 | 3.8998 | 202.1348 | 4.0192 |",
  "| 2045 | 11.2598 | 1.6890 | 0.0000 | 4.5911 | 0.0000 | 1.7429 | 3.2368 | 205.3716 | 3.4319 |",
  "| 2046 | 9.9086 | 1.4863 | 0.0000 | 4.3402 | 0.0000 | 1.4288 | 2.6534 | 208.0250 | 2.9151 |"
 ],
 "S3.totals": [
  "Totals: npv 81.0464, irr 53.7148 percent, payback 3.2746 years, maxExposure -44.6035, totalRevenue 864.1699, totalCapex 180.0000, totalOpex 210.4887, totalRoyalty 129.6255, totalTax 136.0307, totalGovTake 265.6562."
 ],
 "S3.tax": [
  "Years with positive tax: 18 of 20; years with zero tax: 2027, 2028."
 ],
 "S4.tr_hand_2yr": [
  "## tr_hand_2yr: Suite test: $100 oil, 1 MMbbl/yr, royalty 20, tax 50, capex 50 in year 1, opex 10; year 1 royalty 20, tax 10, ncf 10; year 2 tax 35, ncf 35; NPV = 10/1.1^0.5 + 35/1.1^1.5.",
  "| year | grossRevenue | royalty | capex | opex | depreciation | tax | ncf | cumulativeNCF | govTake |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  "| 2030 | 100.0000 | 20.0000 | 50.0000 | 10.0000 | 50.0000 | 10.0000 | 10.0000 | 10.0000 | 30.0000 |",
  "| 2031 | 100.0000 | 20.0000 | 0.0000 | 10.0000 | 0.0000 | 35.0000 | 35.0000 | 45.0000 | 55.0000 |",
  "Engine metrics: npv 39.8721, irr 0.0000 percent, payback 0.0000 years, maxExposure 10.0000, totalRevenue 200.0000, totalCapex 50.0000, totalOpex 20.0000, totalRoyalty 40.0000, totalTax 45.0000, totalGovTake 85.0000."
 ],
 "S4.tr_hand_2yr_depr2": [
  "## tr_hand_2yr_depr2: Suite test: same with capexDepreciationYears 2; depreciation 25 a year, tax 22.5 both years, ncf -2.5 then 47.5, cash out unchanged at 70.",
  "| year | grossRevenue | royalty | capex | opex | depreciation | tax | ncf | cumulativeNCF | govTake |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  "| 2030 | 100.0000 | 20.0000 | 50.0000 | 10.0000 | 25.0000 | 22.5000 | -2.5000 | -2.5000 | 42.5000 |",
  "| 2031 | 100.0000 | 20.0000 | 0.0000 | 10.0000 | 25.0000 | 22.5000 | 47.5000 | 45.0000 | 42.5000 |",
  "Engine metrics: npv 38.7886, irr 1000.0000 percent, payback 1.0526 years, maxExposure -2.5000, totalRevenue 200.0000, totalCapex 50.0000, totalOpex 20.0000, totalRoyalty 40.0000, totalTax 45.0000, totalGovTake 85.0000.",
  "Oracle disagreement recorded in the golden: {\"disagreement\":\"the true root lies beyond the 1000 percent Newton clamp and the clamp is reported (the root is 1800 percent)\",\"irr\":1000}."
 ],
 "S4.tr_base_10yr": [
  "## tr_base_10yr: The 10 year base case behind the sweeps: a development year, then 20000 bopd declining 12 percent, $75 oil, capex 400 + 200, fixed opex 40, variable 6 $/bbl, abandonment 50 in the last year.",
  "| year | grossRevenue | royalty | capex | opex | depreciation | tax | ncf | cumulativeNCF | govTake |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  "| 2027 | 0.0000 | 0.0000 | 400.0000 | 0.0000 | 400.0000 | 0.0000 | -400.0000 | -400.0000 | 0.0000 |",
  "| 2028 | 547.5000 | 68.4375 | 200.0000 | 83.8000 | 200.0000 | 58.5787 | 136.6838 | -263.3162 | 127.0162 |",
  "| 2029 | 481.8000 | 60.2250 | 0.0000 | 78.5440 | 0.0000 | 102.9093 | 240.1217 | -23.1945 | 163.1343 |",
  "| 2036 | 196.8999 | 24.6125 | 0.0000 | 55.7520 | 0.0000 | 19.9606 | 46.5748 | 908.4827 | 44.5731 |",
  "Engine metrics: npv 472.6082, irr 41.0683 percent, payback 3.1115 years, maxExposure -400.0000, totalRevenue 3118.5674, totalCapex 600.0000, totalOpex 609.4854, totalRoyalty 389.8209, totalTax 560.7783, totalGovTake 950.5992."
 ],
 "S4.tr_gas_and_oil": [
  "## tr_gas_and_oil: Oil and gas revenue together with a constant gas price.",
  "| year | grossRevenue | royalty | capex | opex | depreciation | tax | ncf | cumulativeNCF | govTake |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  "| 2027 | 0.0000 | 0.0000 | 400.0000 | 0.0000 | 400.0000 | 0.0000 | -400.0000 | -400.0000 | 0.0000 |",
  "| 2028 | 585.8250 | 73.2281 | 200.0000 | 83.8000 | 200.0000 | 68.6391 | 160.1578 | -239.8422 | 141.8672 |",
  "| 2029 | 517.0590 | 64.6324 | 0.0000 | 78.5440 | 0.0000 | 112.1648 | 261.7178 | 21.8757 | 176.7972 |",
  "| 2036 | 216.5690 | 27.0711 | 0.0000 | 55.7520 | 0.0000 | 25.1238 | 58.6221 | 1063.3642 | 52.1949 |",
  "Engine metrics: npv 572.0520, irr 46.9063 percent, payback 2.9164 years, maxExposure -400.0000, totalRevenue 3371.4351, totalCapex 600.0000, totalOpex 609.4854, totalRoyalty 421.4294, totalTax 627.1561, totalGovTake 1048.5855."
 ],
 "S4.tr_missing_profiles": [
  "## tr_missing_profiles: Profiles shorter than projectLife read as zero beyond their end (the engine's `|| 0`); gas and abandonment omitted entirely.",
  "| year | grossRevenue | royalty | capex | opex | depreciation | tax | ncf | cumulativeNCF | govTake |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  "| 2030 | 30.0000 | 3.0000 | 20.0000 | 5.0000 | 20.0000 | 0.6000 | 1.4000 | 1.4000 | 3.6000 |",
  "| 2031 | 24.0000 | 2.4000 | 0.0000 | 5.0000 | 0.0000 | 4.9800 | 11.6200 | 13.0200 | 7.3800 |",
  "| 2032 | 0.0000 | 0.0000 | 0.0000 | 5.0000 | 0.0000 | 0.0000 | -5.0000 | 8.0200 | 0.0000 |",
  "| 2033 | 0.0000 | 0.0000 | 0.0000 | 5.0000 | 0.0000 | 0.0000 | -5.0000 | 3.0200 | 0.0000 |",
  "Engine metrics: npv 3.7561, irr -15.0294 percent, payback 0.0000 years, maxExposure 1.4000, totalRevenue 54.0000, totalCapex 20.0000, totalOpex 20.0000, totalRoyalty 5.4000, totalTax 5.5800, totalGovTake 10.9800."
 ],
 "S4.depreciation": [
  "| depr_1yr_on_2yr_hand | capexDepreciationYears 1 on the two year hand case: deductions past year 2 are lost. | 39.8721 | 0.0000 | 0.0000 | 45.0000 |",
  "| depr_2yr_on_2yr_hand | capexDepreciationYears 2 on the two year hand case: deductions past year 2 are lost. | 38.7886 | 1000.0000 | 1.0526 | 45.0000 |",
  "| depr_3yr_on_2yr_hand | capexDepreciationYears 3 on the two year hand case: deductions past year 2 are lost. | 31.2042 | 550.0000 | 1.1538 | 53.3333 |",
  "| depr_4yr_on_2yr_hand | capexDepreciationYears 4 on the two year hand case: deductions past year 2 are lost. | 27.4120 | 371.4286 | 1.2121 | 57.5000 |",
  "| depr_5yr_on_2yr_hand | capexDepreciationYears 5 on the two year hand case: deductions past year 2 are lost. | 25.1367 | 300.0000 | 1.2500 | 60.0000 |",
  "| depr_1yr_on_base_10yr | capexDepreciationYears 1 on the 10 year base case with capex in years 1 and 2. | 472.6082 | 41.0683 | 3.1115 | 560.7783 |",
  "| depr_2yr_on_base_10yr | capexDepreciationYears 2 on the 10 year base case with capex in years 1 and 2. | 522.2513 | 45.7916 | 2.8637 | 500.7783 |",
  "| depr_3yr_on_base_10yr | capexDepreciationYears 3 on the 10 year base case with capex in years 1 and 2. | 534.2144 | 45.7904 | 2.8774 | 480.7783 |",
  "| depr_4yr_on_base_10yr | capexDepreciationYears 4 on the 10 year base case with capex in years 1 and 2. | 537.0700 | 44.9949 | 2.9761 | 470.7783 |",
  "| depr_5yr_on_base_10yr | capexDepreciationYears 5 on the 10 year base case with capex in years 1 and 2. | 536.5100 | 44.1131 | 3.0459 | 464.7783 |",
  "| depr_rounding_2_5_to_3 | capexDepreciationYears 2.5 rounds to 3 (JavaScript Math.round rounds halves up). | 60.1627 | 279.1288 | 1.3333 | 75.0000 |",
  "| depr_zero_means_one | capexDepreciationYears 0 is floored at 1 (immediate expensing). | 39.8721 | 0.0000 | 0.0000 | 45.0000 |",
  "| depr_capex_in_last_year | Capex spent in the final year with 5 year depreciation: only one fifth is ever deducted. | 55.8288 | 1000.0000 | 0.0000 | 100.0000 |",
  "| depr_psc_ignores_depreciation | On a PSC the depreciation column is still filled but the tax base ignores it. | -4.3773 | -2.4691 | 2.0000 | 27.0000 |"
 ],
 "S5.factors": [
  "| 2027 | -17.8210 | 1.058301 | -16.8393 |",
  "| 2028 | -26.7825 | 1.185297 | -22.5956 |",
  "| 2029 | 35.9654 | 1.327532 | 27.0919 |",
  "| 2030 | 31.4546 | 1.486836 | 21.1554 |",
  "| 2031 | 27.4850 | 1.665256 | 16.5050 |",
  "| 2032 | 23.9918 | 1.865087 | 12.8636 |"
 ],
 "S5.metrics": [
  "ISIALA metrics: npv 81.0464, irr 53.7148 percent, payback 3.2746 years, maxExposure -44.6035."
 ],
 "S5.byHand": [
  "Payback read by hand: the cumulative first reaches zero in year index 3 (2030); the shortfall carried in is -8.6381 and that year's ncf is 31.4546, so payback = 3 + 8.6381 / 31.4546 = 3.2746 (derived, equals the engine's payback)."
 ],
 "S5.payback": [
  "- payback_spend_then_earn: The E1 correction: -100 then +150 pays back two thirds through the SECOND period, 1.667 years. Engine payback 1.6667, maxExposure -100.0000.",
  "- payback_exact_recovery: -100 then +100: cumulative reaches exactly zero at index 1, payback 1 + 100/100 = 2.0 years. Engine payback 2.0000, maxExposure -100.0000.",
  "- payback_first_period_positive: Positive from the first period: payback 0. Engine payback 0.0000, maxExposure 5.0000.",
  "- payback_never: Never recovers: payback is the project life (5). Engine payback 5.0000, maxExposure -100.0000.",
  "- payback_multi_year: Recovers in the fourth period: 3 + 10/40 = 3.25 years; maxExposure -130. Engine payback 4.7500, maxExposure -130.0000.",
  "- payback_zero_period_after_negative: A zero cash flow period right after the cumulative crosses: crossing period is the one used. Engine payback 1.8333, maxExposure -50.0000."
 ],
 "S5.irr": [
  "- irr_no_sign_change: Suite test: all-positive cash flow, IRR reported as 0. Engine irr 0.0000; golden irr 0.0000, golden roots [].",
  "- irr_known_21pct: Suite test: ncf [-100, +121] with mid-year discounting solves (1 + r) = 1.21, IRR 21 percent. Engine irr 21.0000; golden irr 21.0000, golden roots [20.999999999999996].",
  "- irr_two_roots: ncf [-100, 230, -132]: NPV(r) has TWO roots, 10 and 20 percent (mid-year discounting scales every term by the same (1 + r)^-0.5 so the year-end roots survive). The engine's Newton from 10 percent lands on one of them; the gate accepts either root and pins which. Engine irr 10.0000; golden irr null, golden roots [10.00000000000002,20.00000000000003].",
  "- irr_all_negative: Every period negative: no IRR, reported 0; payback is the project life. Engine irr 0.0000; golden irr 0.0000, golden roots [].",
  "- irr_tiny_cash_flows_derivative_guard: ncf of order 1e-7 $MM: the true mid-year IRR is the same 21 percent as irr_known_21pct scaled down, but the engine's ABSOLUTE derivative guard (|dNPV/dr| < 1e-5) fires on the first iteration and it returns its 10 percent starting guess. DISAGREEMENT, recorded in FINDINGS-fiscal.md. Engine irr 10.0000; golden irr 21.0000, golden roots [21.000000000000007]; recorded engine value {\"disagreement\":\"absolute derivative guard returns the Newton starting guess\",\"irr\":10}.",
  "- irr_beyond_clamp: ncf [-1, 100]: the mid-year IRR is 9900 percent. The engine clamps Newton at 1000 percent and reports the clamp. DISAGREEMENT (bound), recorded in FINDINGS-fiscal.md. Engine irr 1000.0000; golden irr 9900.0000, golden roots [9900]; recorded engine value {\"disagreement\":\"the true root lies beyond the 1000 percent Newton clamp and the clamp is reported (the root is 9900 percent)\",\"irr\":1000}."
 ],
 "S5.sweeps": [
  "| sweep_oil_price_40 | -123.6336 | 0.2549 | 8.4377 |",
  "| sweep_oil_price_50 | 53.1791 | 13.8221 | 5.0970 |",
  "| sweep_oil_price_60 | 220.9507 | 25.1188 | 3.9569 |",
  "| sweep_oil_price_70 | 388.7224 | 35.8217 | 3.3421 |",
  "| sweep_oil_price_80 | 556.4941 | 46.2780 | 2.9275 |",
  "| sweep_oil_price_90 | 724.2657 | 56.6433 | 2.6560 |",
  "| sweep_oil_price_100 | 892.0374 | 66.9933 | 2.4477 |",
  "| sweep_oil_price_110 | 1059.8091 | 77.3654 | 2.2827 |",
  "| sweep_oil_price_120 | 1227.5807 | 87.7774 | 2.1489 |",
  "| sweep_decline_0 | 1002.3868 | 55.2995 | 2.9517 |",
  "| sweep_decline_5 | 748.4067 | 49.4968 | 3.0076 |",
  "| sweep_decline_10 | 543.2315 | 43.5203 | 3.0782 |",
  "| sweep_decline_15 | 377.2394 | 37.3081 | 3.1683 |",
  "| sweep_decline_20 | 240.5337 | 30.6973 | 3.2848 |",
  "| sweep_decline_30 | 34.7682 | 14.7337 | 3.6434 |",
  "| sweep_discount_0 | 908.4827 | 41.0683 | 3.1115 |",
  "| sweep_discount_5 | 655.5263 | 41.0683 | 3.1115 |",
  "| sweep_discount_8 | 539.0363 | 41.0683 | 3.1115 |",
  "| sweep_discount_10 | 472.6082 | 41.0683 | 3.1115 |",
  "| sweep_discount_12 | 413.7005 | 41.0683 | 3.1115 |",
  "| sweep_discount_15 | 337.2369 | 41.0683 | 3.1115 |",
  "| sweep_discount_20 | 234.9911 | 41.0683 | 3.1115 |",
  "| sweep_tax_0 | 838.6053 | 61.6660 | 2.5968 |",
  "| sweep_tax_30 | 472.6082 | 41.0683 | 3.1115 |",
  "| sweep_tax_50 | 228.6101 | 26.0266 | 3.8810 |",
  "| sweep_tax_85 | -198.3865 | -7.7123 | 10.0000 |",
  "| sweep_psc_cap_20 | 4.5405 | 10.3218 | 5.5647 |",
  "| sweep_psc_cap_40 | 213.0567 | 24.0695 | 4.0501 |",
  "| sweep_psc_cap_60 | 301.4414 | 32.2457 | 3.3349 |",
  "| sweep_psc_cap_80 | 316.6306 | 35.9529 | 2.8850 |",
  "| sweep_psc_cap_100 | 322.7477 | 37.9803 | 2.7790 |"
 ],
 "S6.sens": [
  "| Oil Price | -17.3893 | 81.0464 | 175.8952 | 193.2845 |",
  "| CAPEX | 126.2382 | 81.0464 | 32.7547 | -93.4835 |",
  "| OPEX | 85.3696 | 81.0464 | 76.7233 | -8.6463 |",
  "| Production | -17.3893 | 81.0464 | 175.8952 | 193.2845 |"
 ],
 "S6.scales": [
  "What each bar scales: Oil Price scales price.oil; CAPEX scales capex; OPEX scales opexFixed ONLY (opexVariable is untouched); Production scales production.oil ONLY (variable opex does not follow the volume)."
 ],
 "S6.scenarioRule": [
  "ISIALA generateScenarios (Low: price and production x0.8, capex and fixed opex x1.2; High: the mirror):"
 ],
 "S6.scenarios": [
  "- Low: npv -72.1531, irr -3.5758 percent, payback 20.0000 years, maxExposure -146.2765, totalRevenue 553.0688, totalCapex 216.0000, totalOpex 220.4887, totalRoyalty 82.9603, totalTax 62.9637, totalGovTake 145.9240.",
  "- Base: npv 81.0464, irr 53.7148 percent, payback 3.2746 years, maxExposure -44.6035, totalRevenue 864.1699, totalCapex 180.0000, totalOpex 210.4887, totalRoyalty 129.6255, totalTax 136.0307, totalGovTake 265.6562.",
  "- High: npv 237.8860, irr 0.0000 percent, payback 0.0000 years, maxExposure 27.7707, totalRevenue 1244.4047, totalCapex 144.0000, totalOpex 200.4887, totalRoyalty 186.6607, totalTax 249.6393, totalGovTake 436.3001."
 ],
 "S6.publishedSens": [
  "Published sens_base_10yr (runSensitivityAnalysis on the base 10 year case: NPV at -30 and +30 percent of oil price, capex, fixed opex and oil production.): Oil Price 95.1220..850.0945; CAPEX 623.4287..321.7878; OPEX 518.7327..426.4837; Production 95.1220..850.0945."
 ],
 "S6.publishedScen": [
  "Published scen_base_10yr: Low npv -118.6479, Base npv 472.6082, High npv 1157.5514."
 ],
 "S7.fits": [
  "| capex $MM | 150 / 180 / 220 | 0.428571 | 127.2260 | 168.6738 | 252.3607 | 0.331225 | true |",
  "| opex $MM/yr | 16 / 20 / 26 | 0.400000 | 13.3201 | 17.4160 | 30.8541 | 0.233597 | true |",
  "| efficiency % | 85 / 91 / 96 | 0.545455 | 80.1459 | 92.0352 | 99.9640 | 0.599919 | true |",
  "| opex, narrow belief | 16 / 17 / 26 | 0.100000 | 15.1886 | 15.1886 | 31.0000 | 0.000001 | false |"
 ],
 "S7.narrowNote": [
  "Narrow belief note (engine): the stated median sits too near the 10th percentile for any triangular to pass through all three points; the fit uses the most left-skewed triangular there is (mode at the minimum)"
 ],
 "S7.band": [
  "The reachable band of the shape ratio, from triInvCDF on the unit triangle (derived): mode at the minimum 0.381966, mode at the maximum 0.618034."
 ],
 "S7.check": [
  "- fitted: 150.0000, 180.0000, 220.0000",
  "- THE OLD ERROR, the beliefs used as minimum / mode / maximum, read at 0.1, 0.5 and 0.9: 164.4914, 182.5834, 203.2668"
 ],
 "S7.inexact": [
  "Published mc_inexact_fit_note (Medians too near the 10th percentile (capex) and the 90th percentile (opex): both fits clamp and the insight carries both notes.): fits {\"capex\":{\"min\":759.4302079790101,\"mode\":759.4309619366204,\"max\":1550,\"exact\":false,\"note\":\"the stated median sits too near the 10th percentile for any triangular to pass through all three points; the fit uses the most left-skewed triangular there is (mode at the minimum)\"},\"opex\":{\"min\":37.5,\"mode\":77.02845182033687,\"max\":77.02848968388169,\"exact\":false,\"note\":\"the stated median sits too near the 90th percentile for any triangular to pass through all three points; the fit uses the most right-skewed triangular there is (mode at the maximum)\"},\"efficiency\":{\"min\":80.95491502812527,\"mode\":90,\"max\":99.04508497187474,\"exact\":true,\"note\":null}}."
 ],
 "S8.draws": [
  "mulberry32(20260829), first six draws: 0.936239, 0.826447, 0.952306, 0.732031, 0.064278, 0.391443."
 ],
 "S8.iteration1": [
  "| 1 | 0.936239 | capex | 0.331225 | upper | 226.5205 |",
  "| 2 | 0.826447 | opex | 0.233597 | upper | 24.4593 |",
  "| 3 | 0.952306 | efficiency | 0.599919 | upper | 97.2265 |"
 ],
 "S8.sameSeed": [
  "Same seed, same answer: two runs at seed 20260829 give identical samples: true."
 ],
 "S8.otherSeed": [
  "A different seed (7): median 72.8475 against 73.3297 at the default seed."
 ],
 "S9.base": [
  "ISIALA base case at the stated medians: capex 180 $MM, opex 20 $MM a year, efficiency 0.91; breakeven to NPV 0: 71.6277 USD/bbl."
 ],
 "S9.curve": [
  "| 20 | -220.0581 |",
  "| 40 | -129.7634 |",
  "| 60 | -47.0648 |",
  "| 70 | -6.5653 |",
  "| 80 | 33.6477 |",
  "| 100 | 113.5406 |",
  "| 150 | 311.7558 |"
 ],
 "S9.hurdles": [
  "A hurdle above zero: breakeven to NPV 100 $MM 96.5968; to NPV 250 $MM 134.3869; NPV at the 500 USD/bbl bracket top 1552.6414."
 ],
 "S9.kinks": [
  "- years 1 to 20 (the breakeven engine places ALL capex in year 1 and expenses it there, so year 1 carries capex too): 160.9994, 18.2954, 20.7902, 23.6252, 26.8469, 30.5078, 34.6679, 39.3954, 44.7675, 50.8721, 57.8093, 65.6923, 74.6504, 84.8300, 96.3977, 109.5429, 124.4805, 141.4551, 160.7445, 182.6642."
 ],
 "S9.kinkNote": [
  "- note: the Breakeven Analyzer builds its case with all capex in year 1 and opex flat, unlike the quick form's 50/50 capex split; 20 kinks, one per year."
 ],
 "S9.solve": [
  "- solve_base_npv0: Suite test: the base case (capex 1000, opex 60, efficiency 0.9) to NPV 0. Engine 175.1500; golden 175.1500.",
  "- solve_base_target_250: Suite test: the same case to a target NPV of 250 $MM; a higher hurdle needs a higher price. Engine 210.4257; golden 210.4257.",
  "- solve_capex_1300: Suite test: capex 1300 raises the breakeven. Engine 215.5109; golden 215.5109.",
  "- solve_opex_75: Suite test: opex 75 raises the breakeven. Engine 185.3034; golden 185.3034.",
  "- solve_efficiency_95: Suite test: efficiency 0.95 lowers the breakeven. Engine 165.9316; golden 165.9316.",
  "- solve_unreachable: Suite test: a 500000 $MM target is unreachable below $500; null. Engine null; golden null.",
  "- solve_no_fiscal: Royalty and tax at zero: a single linear segment, breakeven = discounted cost over discounted net barrels. Engine 128.0295; golden 128.0295.",
  "- solve_negative_target: A negative target NPV (-200) needs a lower price than breakeven. Engine 146.9294; golden 146.9294.",
  "- solve_tax_kink_inside_bracket: A heavy tax (85 percent) with the kinks well inside the bracket: the crossing sits on a taxed segment. Engine 322.3613; golden 322.3613.",
  "- solve_single_year: A one year profile: capex, opex and production all in one period. Engine 50.7937; golden 50.7937.",
  "- solve_zero_production_null: No production at all: NPV is flat and negative at every price, so null. Engine null; golden null.",
  "- solve_free_project_zero: No capex and no opex: NPV is non-negative at $0 so the breakeven is 0. Engine 0.0000; golden 0.0000."
 ],
 "S10.run": [
  "ISIALA breakeven run: 5000 iterations at seed 20260829, excluded 0."
 ],
 "S10.table": [
  "| 10th percentile of breakeven price | 500 | 62.1713 |",
  "| 50th percentile of breakeven price | 2500 | 73.3297 |",
  "| 90th percentile of breakeven price | 4500 | 85.5912 |",
  "| mean | all | 73.6242 |",
  "| base case at the stated medians | none | 71.6277 |"
 ],
 "S10.extremes": [
  "Sample extremes: lowest 50.7415, highest 107.6755. S-curve y at index i is (i + 1) / n: at index 2500, y 0.500200."
 ],
 "S10.meanMinusMedian": [
  "Mean minus median (derived): 0.2944."
 ],
 "S10.insight": [
  "Engine insight: The median breakeven oil price is 73.33 per barrel, and its 90th percentile is 85.59: a 90 percent chance the breakeven price is below that. Breakeven is most sensitive to Total CAPEX and Annual OPEX. Run seed 20260829: the same inputs and seed reproduce this result exactly."
 ],
 "S10.unreachable": [
  "Published mc_with_unreachable (Capex so large that part of the sample cannot break even below $500: those iterations are excluded and counted.): 55 of 120 excluded; 10th 397.3404, median 449.5729, 90th 486.6757."
 ],
 "S10.allUnreachable": [
  "Published mc_all_unreachable_throws (Capex so large that NO iteration breaks even below $500: the engine throws, and the oracle records the empty sample as `throws`.): engine error \"No iteration broke even below 500 dollars a barrel. Check the production profile, the cost ranges and the target NPV.\"."
 ],
 "S10.published": [
  "- mc_default_seed_300: Suite test inputs (300 iterations) at DEFAULT_SEED 20260829; the whole sorted sample is emitted. seed 20260829, 300 iterations: 10th 144.1380, median 178.1754, 90th 219.4196, mean 180.0854, base 175.1500, excluded 0.",
  "- mc_seed_12345: Suite test seed 12345. seed 12345, 300 iterations: 10th 145.4292, median 179.2695, 90th 219.8911, mean 182.1278, base 175.1500, excluded 0.",
  "- mc_seed_7: Suite test seed 7: percentiles bracket the base case, fits extend past the stated percentiles, tornado two-sided. seed 7, 300 iterations: 10th 150.7142, median 179.2190, 90th 215.8148, mean 181.4423, base 175.1500, excluded 0.",
  "- mc_seed_1: Suite test seed 1. seed 1, 300 iterations: 10th 147.3944, median 176.5115, 90th 219.1801, mean 180.5603, base 175.1500, excluded 0.",
  "- mc_seed_2: Suite test seed 2: a different sample from seed 1, a median within 5 percent. seed 2, 300 iterations: 10th 144.0810, median 179.4302, 90th 221.2888, mean 181.8329, base 175.1500, excluded 0.",
  "- mc_target_250_seed_7: A 250 $MM target at seed 7. seed 7, 300 iterations: 10th 184.5382, median 214.9766, 90th 251.2132, mean 216.6776, base 210.4257, excluded 0.",
  "- mc_inexact_fit_note: Medians too near the 10th percentile (capex) and the 90th percentile (opex): both fits clamp and the insight carries both notes. seed 7, 300 iterations: 10th 150.9868, median 179.3339, 90th 217.7511, mean 182.5409, base 160.4100, excluded 0.",
  "- mc_with_unreachable: Capex so large that part of the sample cannot break even below $500: those iterations are excluded and counted. seed 5, 120 iterations: 10th 397.3404, median 449.5729, 90th 486.6757, mean 446.8432, base 498.0372, excluded 55.",
  "- mc_default_seed_2000: 2000 iterations at the default seed; the sample is emitted in full. seed 20260829, 2000 iterations: 10th 146.9251, median 177.4702, 90th 219.3869, mean 180.6364, base 175.1500, excluded 0."
 ],
 "S11.tornado": [
  "| 1 | Total CAPEX | -7.0202 | 9.4067 | 16.4269 |",
  "| 2 | Annual OPEX | -5.8578 | 8.8730 | 14.7308 |",
  "| 3 | Prod. Efficiency | -3.7306 | 5.0561 | 8.7867 |"
 ],
 "S11.efficiency": [
  "Efficiency runs backwards: its low-price end comes from the 90th percentile efficiency (96), its high-price end from the 10th (85)."
 ],
 "S11.published": [
  "Published mc_with_unreachable tornado (B1): Total CAPEX low -80.7218 high 0.0000; Annual OPEX low -6.7689 high 0.0000; Prod. Efficiency low -26.2125 high 0.0000."
 ],
 "S12.bullets": [
  "- Definition (lib/conventions/percentile.js): P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.",
  "- Cases, low to high: Low case = P90, Best case = P50, High case = P10.",
  "- A quantity where more is better (NPV): low case takes its 10th percentile; Low case NPV (low value).",
  "- A quantity where more is worse (a breakeven price): no P-label at all; it is described as 10th percentile of breakeven price, 50th percentile of breakeven price, 90th percentile of breakeven price.",
  "- Parameters (capex, opex, efficiency) take percentiles too: 10th percentile of capex."
 ],
 "S12.settings": [
  "ISIALA through the Scenario Builder's Monte Carlo (the app's settings: 1000 iterations, price, capex and reserves each plus or minus 20 percent, seed 20260829):"
 ],
 "S12.cases": [
  "| Low case | P90 | p10 | 48.7439 |",
  "| Best case | P50 | p50 | 81.1835 |",
  "| High case | P10 | p90 | 109.8980 |"
 ],
 "S12.swap": [
  "THE SWAP EC3-0 FIXED: the old results panel printed the p90 key under \"P90 (Conservative)\", which on ISIALA is 109.8980, and the p10 key under \"P10 (Optimistic)\", which is 48.7439. The card called conservative held the larger number."
 ],
 "S13.sampling": [
  "- Sampling: each value v with a range r is drawn uniformly on [v(1 - r), v(1 + r)], one draw per year per array, in the order oil volume, gas volume, oil price, gas price, capex, with a falsy range consuming no draw.",
  "- reserves scales oil AND gas volumes; price scales oil AND gas prices; capex scales capex; opex and royalty and tax are never sampled."
 ],
 "S13.run": [
  "- ISIALA run: 1000 iterations, seed 20260829, emv 80.1707, 10th percentile key 48.7439, median 81.1835, 90th percentile key 109.8980, lowest 16.3054, highest 149.3540."
 ],
 "S13.histogram": [
  "- Histogram: 20 bins of width 6.6524 (derived); counts 7, 9, 15, 30, 45, 60, 73, 84, 114, 94, 96, 111, 92, 65, 52, 28, 12, 7, 5, 1."
 ],
 "S13.sCurve": [
  "- S-curve: 50 points, one every 20 sorted values; first probability 0.0000, last 98.0000."
 ],
 "S13.seed": [
  "- The seed guarantees the sample: the same seed repeats every value (true); seed 43 gives median 79.0624 against 81.1835. It guarantees nothing about accuracy."
 ],
 "S13.priceOnly": [
  "- Published mc_seed3_price_only: Only price uncertain: reserves and capex ranges are falsy and consume NO draws."
 ],
 "S14.intro": [
  "ISIALA's 1000 Scenario Builder NPVs, sorted. n x 0.1 = 100, n x 0.5 = 500 and n x 0.9 = 900 are all whole numbers on an even length, so the screening rule averages two neighbours at every row."
 ],
 "S14.rules": [
  "| 10th percentile | 48.7439 | 48.8335 | -0.0896 |",
  "| 50th percentile | 81.1835 | 81.1952 | -0.0116 |",
  "| 90th percentile | 109.8980 | 109.9036 | -0.0056 |"
 ],
 "S14.wobbleSeeds": [
  "- 10th percentile by seed 1..10: 62.0081, 62.0849, 62.4650, 62.1070, 62.0258, 62.3276, 62.0800, 62.3661, 62.3871, 62.2711; range 0.4569 (derived).",
  "- median by seed 1..10: 72.8047, 72.8951, 72.8255, 72.9631, 72.6338, 72.9061, 72.8475, 72.9739, 73.1287, 73.0649; range 0.4949 (derived)."
 ],
 "S14.wobbleIterations": [
  "- 100 iterations: 10th 61.1861, median 72.7058, 90th 86.3529.",
  "- 500 iterations: 10th 61.5530, median 72.9806, 90th 86.4976.",
  "- 1000 iterations: 10th 62.1241, median 72.9245, 90th 86.2728.",
  "- 5000 iterations: 10th 62.1713, median 73.3297, 90th 85.5912.",
  "- 20000 iterations: 10th 62.2724, median 73.0302, 90th 85.4380."
 ],
 "S15.zero": [
  "Every range at zero on ISIALA (30 iterations): 10th percentile key 81.0464, median 81.0464, 90th 81.0464, emv 81.0464, deterministic NPV 81.0464; bin 0 holds 30 of 30 (it used to throw, FINDINGS S4)."
 ],
 "S15.forty": [
  "Forty iterations on ISIALA: 40 S-curve points (it used to return none, FINDINGS S5)."
 ],
 "S15.narrow": [
  "ISIALA with the narrow opex belief 16 / 17 / 26: opex fit 15.1886 / 15.1886 / 31.0000, exact false; 10th 62.0843, median 73.1740, 90th 85.4599, base 67.2301; tornado Total CAPEX -7.0493/9.4442; Annual OPEX -1.4602/13.2707; Prod. Efficiency -3.5016/4.7457."
 ],
 "S15.insight": [
  "Insight carries the fit note: true."
 ],
 "S15.oneSided": [
  "A tornado bar with one side missing (B1, published mc_with_unreachable): high sides 0.0000, 0.0000, 0.0000; low sides -80.7218, -6.7689, -26.2125."
 ],
 "S16.nteje": [
  "NTEJE (3000 bopd declining 20 percent a year, oil 66 USD/bbl, capex 240 $MM (half in each of the first two years), fixed opex 6 $MM a year, variable opex 14 USD/bbl, royalty 15 percent, tax 30 percent, discount rate 12 percent, first year 2027): npv -123.9923, irr 1000.0000 percent, payback 20.0000, maxExposure -169.0209, final cumulative -154.5906. The IRR is the Newton clamp (FINDINGS S1), on a project that never pays back."
 ],
 "S16.okpoma": [
  "OKPOMA: npv 167.4389, irr 1000.0000 percent, payback 0.0000, maxExposure -2.2287."
 ],
 "S16.okpomaRows": [
  "| 2027 | 193.5960 | 19.3596 | 130.0000 | 28.8200 | 6.1666 | 9.2498 | 9.2498 |",
  "| 2028 | 158.7487 | 15.8749 | 130.0000 | 24.3524 | 0.0000 | -11.4786 | -2.2287 |",
  "| 2029 | 130.1740 | 13.0174 | 0.0000 | 20.6890 | 38.5870 | 57.8806 | 55.6518 |"
 ],
 "S16.irr": [
  "- irr_beyond_clamp: ncf [-1, 100]: the mid-year IRR is 9900 percent. The engine clamps Newton at 1000 percent and reports the clamp. DISAGREEMENT (bound), recorded in FINDINGS-fiscal.md. Engine 1000.0000; golden roots [9900].",
  "- irr_tiny_cash_flows_derivative_guard: ncf of order 1e-7 $MM: the true mid-year IRR is the same 21 percent as irr_known_21pct scaled down, but the engine's ABSOLUTE derivative guard (|dNPV/dr| < 1e-5) fires on the first iteration and it returns its 10 percent starting guess. DISAGREEMENT, recorded in FINDINGS-fiscal.md. Engine 10.0000; golden roots [21.000000000000007].",
  "- irr_two_roots: ncf [-100, 230, -132]: NPV(r) has TWO roots, 10 and 20 percent (mid-year discounting scales every term by the same (1 + r)^-0.5 so the year-end roots survive). The engine's Newton from 10 percent lands on one of them; the gate accepts either root and pins which. Engine 10.0000; golden roots [10.00000000000002,20.00000000000003]."
 ],
 "S16.fdp": [
  "- fdp_never_pays_back: capex 100000 on the same profile: never pays back, payback reports the project life. Engine npv -92616.5020, irr 1000.0000, payback 11.0000."
 ],
 "S16.midYear": [
  "Mid-year beside year-end on ISIALA's cash flows: engine (mid-year) npv 81.0464; the same rows discounted at year end 76.5817 (derived); ratio 1.058301 against (1.12)^0.5 = 1.058301 (derived)."
 ],
 "S17": [
  "- Deterministic: npv 81.0464, irr 53.7148 percent, payback 3.2746 years, maxExposure -44.6035.",
  "- Scenarios: Low -72.1531, Base 81.0464, High 237.8860.",
  "- Breakeven: base 71.6277; 10th percentile of breakeven price 62.1713, median 73.3297, 90th percentile of breakeven price 85.5912.",
  "- Scenario Builder Monte Carlo: Low case P90 48.7439, Best case P50 81.1835, High case P10 109.8980, emv 80.1707, seed 20260829."
 ]
};

// ---------------------------------------------------------------------------
// 0. The pins are the digest's own lines, and the digest is a real digest.
// ---------------------------------------------------------------------------

describe('the pinned lines are lines of the digest on disk', () => {
  it('the digest carries a plausible number of literals, so it is not empty or mid-rebuild', () => {
    const text = fs.readFileSync(DIGEST, 'utf8');
    const literals = text.match(/-?\d+(?:\.\d+)?/g) || [];
    expect(literals.length, 'digest.txt is empty or mid-rebuild').toBeGreaterThan(1000);
  });

  it('every pinned line is still a line of digest.txt, verbatim', () => {
    const lines = new Set(fs.readFileSync(DIGEST, 'utf8').split('\n'));
    const missing = Object.entries(D).flatMap(([k, v]) => v.filter((x) => !lines.has(x)).map((x) => `${k}: ${x.slice(0, 80)}`));
    expect(missing).toEqual([]);
    expect(Object.values(D).flat().length).toBeGreaterThan(250);
  });

  it('the teaching fields are copied verbatim from ec3_dump.mjs', () => {
    const dump = fs.readFileSync(DUMP_MJS, 'utf8');
    const lab = fs.readFileSync(path.join(HERE, 'uncertaintyLab.js'), 'utf8');
    ['ISIALA', 'BELIEF', 'NARROW_OPEX', 'OKPOMA', 'NTEJE', 'APP_MC'].forEach((name) => {
      const inDump = dump.match(new RegExp(`^const ${name} = (.*);$`, 'm'));
      const inLab = lab.match(new RegExp(`^export const ${name} = (.*);$`, 'm'));
      expect(inDump, `${name} in ec3_dump.mjs`).not.toBeNull();
      expect(inLab, `${name} in the lab`).not.toBeNull();
      expect(inLab[1], name).toBe(inDump[1]);
    });
  });

  it('the published goldens are the ones the brief names: 91 screening cases and 22 breakeven cases', () => {
    expect(L.goldenCounts()).toEqual({ screening: 91, breakeven: 22 });
  });
});

// ---------------------------------------------------------------------------
// 1. Section 1: the screening engine and what it refuses to be.
// ---------------------------------------------------------------------------

describe('Section 1: the screening engine, its conventions, no economic limit', () => {
  it('the convention bullets, with the life, gas price and both seeds read off the engines', async () => {
    const c = await get('screeningConventions');
    expect(c.lines).toEqual(D['S1.bullets']);
    expect(c.projectLife).toBe(20);
    expect(c.fiscalType).toBe('TaxRoyalty');
    expect(c.gasPrice).toBe(3.5);
    expect(c.gasVolume).toBe(0);
    expect(c.capexFirstTwoYears).toEqual([90, 90]);
    expect(c.defaultMcSeed).toBe(20260829);
    expect(c.defaultBreakevenSeed).toBe(20260829);
    expect(L.DEFAULT_MC_SEED).toBe(20260829);
    expect(L.DEFAULT_SEED).toBe(20260829);
  });

  it('OKPOMA loses money in its last year and the engine still produces and charges it', async () => {
    const e = await get('noEconomicLimit');
    expect(`No economic limit, read off the edge field OKPOMA (${e.line}): years after the two capex years with negative net cash flow: ${e.lossYearsAfterCapex.join(', ') || 'none'}; year 20 ncf ${m(e.lastYear.ncf)} on gross revenue ${m(e.lastYear.grossRevenue)} and opex ${m(e.lastYear.opex)}.`).toBe(D['S1.okpoma'][0]);
    expect(e.lastYear.year).toBe(2046);
  });
});

// ---------------------------------------------------------------------------
// 2. Sections 2 and 3: ISIALA from quick inputs to a ledger.
// ---------------------------------------------------------------------------

describe('Section 2: ISIALA from quick inputs to a case', () => {
  it('the quick inputs, the expanded settings and all twenty rows', async () => {
    const qc = await get('quickCase', 'isiala');
    expect(`ISIALA quick inputs: ${qc.line}.`).toBe(D['S2.quick'][0]);
    expect(`Expanded: projectLife ${qc.projectLife}, fiscalType ${qc.fiscalType}, royaltyRate ${qc.royaltyRate}, taxRate ${qc.taxRate}, discountRate ${qc.discountRate}.`).toBe(D['S2.expanded'][0]);
    expect(qc.rows.map((x) => row([String(x.year), f(x.oilBbl, 4), p(x.oilPrice), p(x.gasPrice), m(x.capex), m(x.opexFixed), m(x.opexVariable)]))).toEqual(D['S2.rows']);
    expect(`Decline, year on year: year 2 over year 1 = ${r(qc.declineYear2OverYear1Derived)} (derived), year 20 over year 1 = ${r(qc.declineYear20OverYear1Derived)} (derived).`).toBe(D['S2.decline'][0]);
    expect(qc.quick).toEqual(L.ISIALA);
  });

  it('the edge fields expand the same way and carry the digest\'s own description', async () => {
    expect((await get('quickCase', 'okpoma')).line).toBe(D['S1.okpoma'][0].match(/OKPOMA \((.*)\): years/)[1]);
    expect((await get('quickCase', 'nteje')).line).toBe(D['S16.nteje'][0].match(/^NTEJE \((.*)\): npv/)[1]);
    expect(L.FIELD_KEYS).toEqual(['isiala', 'okpoma', 'nteje']);
    expect(() => L.quickCase('umunede')).toThrow(/no teaching field/);
  });
});

describe('Section 3: the ISIALA ledger, all twenty rows', () => {
  it('twenty rows, the totals and the tax years', async () => {
    const led = await get('ledger', 'isiala');
    expect(row(L.LEDGER_COLUMNS)).toBe('| year | grossRevenue | royalty | capex | opex | depreciation | tax | ncf | cumulativeNCF | govTake |');
    expect(led.rows.map((x) => row(ledgerCells(x)))).toEqual(D['S3.rows']);
    expect(`Totals: ${metricsLine(led.metrics)}.`).toBe(D['S3.totals'][0]);
    expect(`Years with positive tax: ${led.positiveTaxYearCount} of 20; years with zero tax: ${led.zeroTaxYears.join(', ')}.`).toBe(D['S3.tax'][0]);
    expect(led.paybackIndex).toBe(3);
    expect(led.paybackRowYear).toBe(2030);
  });

  it('OKPOMA\'s payback row is row 0, and NTEJE has none', async () => {
    const ok = await get('ledger', 'okpoma');
    expect(ok.paybackIndex).toBe(0);
    expect(ok.rows.slice(0, 3).map((x) => row(ledgerCells(x, L.OKPOMA_FIRST_ROW_COLUMNS)))).toEqual(D['S16.okpomaRows']);
    const nt = await get('ledger', 'nteje');
    expect(nt.paybackIndex).toBe(-1);
    expect(nt.paybackRowYear).toBeNull();
    expect(`${m(nt.metrics.npv)} ${p(nt.metrics.irr)} ${p(nt.metrics.payback)} ${m(nt.metrics.maxExposure)}`).toBe('-123.9923 1000.0000 20.0000 -169.0209');
  });
});

// ---------------------------------------------------------------------------
// 3. Section 4: published royalty and tax cases, and depreciation.
// ---------------------------------------------------------------------------

describe('Section 4: the published royalty and tax cases, and depreciation', () => {
  it('the five published cases, each as the digest prints it', async () => {
    expect(L.TAX_ROYALTY_CASE_IDS).toEqual(['tr_hand_2yr', 'tr_hand_2yr_depr2', 'tr_base_10yr', 'tr_gas_and_oil', 'tr_missing_profiles']);
    for (const id of L.TAX_ROYALTY_CASE_IDS) {
      // eslint-disable-next-line no-await-in-loop
      const x = await get('publishedTaxRoyalty', id);
      const block = [
        `## ${x.id}: ${x.note}`,
        row(L.LEDGER_COLUMNS),
        sep(L.LEDGER_COLUMNS.length),
        ...x.shown.map((y) => row(ledgerCells(y))),
        `Engine metrics: ${metricsLine(x.metrics)}.`,
        ...(x.recordedEngine ? [`Oracle disagreement recorded in the golden: ${JSON.stringify(x.recordedEngine).slice(0, 300)}.`] : []),
      ];
      expect(block, id).toEqual(D[`S4.${id}`]);
    }
    expect((await get('publishedTaxRoyalty', 'tr_base_10yr')).rowCount).toBe(10);
    expect(() => L.publishedTaxRoyalty('nope')).toThrow(/no published/);
  });

  it('the fourteen depreciation cases, one line each', async () => {
    const d = await get('depreciationCases');
    expect(d.map((x) => row([x.id, x.note, m(x.npv), p(x.irr), p(x.payback), m(x.totalTax)]))).toEqual(D['S4.depreciation']);
  });
});

// ---------------------------------------------------------------------------
// 4. Section 5: value from a ledger.
// ---------------------------------------------------------------------------

describe('Section 5: discounting, NPV, payback, IRR, exposure', () => {
  it('the mid-year factors beside discounted cash flow, the metrics and the payback read by hand', async () => {
    const v = await get('value', 'isiala');
    expect(v.factorRows.map((x) => row([String(x.year), m(x.ncf), r(x.factorDerived), m(x.discountedNcfDerived)]))).toEqual(D['S5.factors']);
    expect(`ISIALA metrics: npv ${m(v.npv)}, irr ${p(v.irr)} percent, payback ${p(v.payback)} years, maxExposure ${m(v.maxExposure)}.`).toBe(D['S5.metrics'][0]);
    const h = v.paybackByHand;
    expect(`Payback read by hand: the cumulative first reaches zero in year index ${h.index} (${h.year}); the shortfall carried in is ${m(h.shortfallCarriedIn)} and that year's ncf is ${m(h.ncfThatYear)}, so payback = ${h.index} + ${m(Math.abs(h.shortfallCarriedIn))} / ${m(h.ncfThatYear)} = ${p(h.paybackDerived)} (derived, equals the engine's payback).`).toBe(D['S5.byHand'][0]);
    expect(p(h.paybackDerived)).toBe(p(v.payback));
  });

  it('the edge fields have no payback read by hand: OKPOMA pays back at row 0 and NTEJE never', async () => {
    expect((await get('value', 'okpoma')).paybackByHand).toBeNull();
    expect((await get('value', 'nteje')).paybackByHand).toBeNull();
  });

  it('the published payback, IRR and sweep cases', async () => {
    expect((await get('paybackCases')).map((x) => `- ${x.id}: ${x.note} Engine payback ${p(x.payback)}, maxExposure ${m(x.maxExposure)}.`)).toEqual(D['S5.payback']);
    expect((await get('irrCases')).map((x) => `- ${x.id}: ${x.note} Engine irr ${p(x.engineIrr)}; golden irr ${p(x.goldenIrr)}, golden roots ${JSON.stringify(x.goldenRoots)}${x.recordedEngine ? `; recorded engine value ${JSON.stringify(x.recordedEngine).slice(0, 160)}` : ''}.`)).toEqual(D['S5.irr']);
    expect((await get('sweeps')).map((x) => row([x.id, m(x.npv), p(x.irr), p(x.payback)]))).toEqual(D['S5.sweeps']);
  });
});

// ---------------------------------------------------------------------------
// 5. Section 6: sensitivity and scenarios.
// ---------------------------------------------------------------------------

describe('Section 6: one number becomes three', () => {
  it('the sensitivity bars at 0.7 and 1.3, and what each scales', async () => {
    const s = await get('sensitivity', 'isiala');
    expect(s.map((x) => row([x.name, m(x.lowParamNPV), m(x.baseNPV), m(x.highParamNPV), m(x.swingDerived)]))).toEqual(D['S6.sens']);
    expect(`What each bar scales: ${s.map((x) => `${x.name} scales ${x.scales}`).join('; ')}.`).toBe(D['S6.scales'][0]);
    expect(L.SENSITIVITY_FACTORS).toEqual({ low: 0.7, high: 1.3 });
  });

  it('Low, Base and High, and the two published cases', async () => {
    expect(`ISIALA generateScenarios (${L.SCENARIO_RULE}):`).toBe(D['S6.scenarioRule'][0]);
    const sc = await get('scenarios', 'isiala');
    expect(sc.map((x) => `- ${x.name}: ${metricsLine(x.metrics)}.`)).toEqual(D['S6.scenarios']);
    const ps = await get('publishedSensitivity');
    expect(`Published sens_base_10yr (${ps.note}): ${ps.rows.map((x) => `${x.name} ${m(x.lowParamNPV)}..${m(x.highParamNPV)}`).join('; ')}.`).toBe(D['S6.publishedSens'][0]);
    const pc = await get('publishedScenarios');
    expect(`Published scen_base_10yr: ${pc.rows.map((x) => `${x.name} npv ${m(x.npv)}`).join(', ')}.`).toBe(D['S6.publishedScen'][0]);
  });
});

// ---------------------------------------------------------------------------
// 6. Sections 7 and 8: the fit and the sampling.
// ---------------------------------------------------------------------------

describe('Section 7: percentiles are not endpoints', () => {
  it('four fits, the band, the check through the stated beliefs and the old error', async () => {
    const x = await get('fits');
    expect(x.rows.map((y) => row([y.name, y.stated.join(' / '), r(y.shapeRatioDerived), m(y.min), m(y.mode), m(y.max), r(y.mDerived), String(y.exact)]))).toEqual(D['S7.fits']);
    expect(`Narrow belief note (engine): ${x.narrowNote}`).toBe(D['S7.narrowNote'][0]);
    expect(`The reachable band of the shape ratio, from triInvCDF on the unit triangle (derived): mode at the minimum ${r(x.band.modeAtMinimumDerived)}, mode at the maximum ${r(x.band.modeAtMaximumDerived)}.`).toBe(D['S7.band'][0]);
    expect([
      `- fitted: ${x.capexCheck.fitted.map(m).join(', ')}`,
      `- THE OLD ERROR, the beliefs used as minimum / mode / maximum, read at 0.1, 0.5 and 0.9: ${x.capexCheck.beliefsAsEndpoints.map(m).join(', ')}`,
    ]).toEqual(D['S7.check']);
    expect(x.rows.map((y) => y.note === null)).toEqual([true, true, true, false]);
  });

  it('the published inexact fit, both notes, at full precision', async () => {
    const x = await get('publishedInexactFit');
    expect(`Published mc_inexact_fit_note (${x.note}): fits ${JSON.stringify(x.fits)}.`).toBe(D['S7.inexact'][0]);
  });

  it('the stated beliefs are worded as parameter percentiles', () => {
    expect(L.beliefLabels('capex')).toEqual(['10th percentile of capex', '50th percentile of capex', '90th percentile of capex']);
  });
});

describe('Section 8: the inverse CDF, the seed, three draws in order', () => {
  it('six draws and iteration 1 branch by branch', async () => {
    const w = await get('samplingWalk');
    expect(`mulberry32(${w.seed}), first six draws: ${w.draws.map(r).join(', ')}.`).toBe(D['S8.draws'][0]);
    expect(w.iteration1.map((y) => row([String(y.draw), r(y.u), y.variable, r(y.fModeDerived), y.branch, m(y.sampled)]))).toEqual(D['S8.iteration1']);
    expect(L.SAMPLE_ORDER).toEqual(['capex', 'opex', 'efficiency']);
  });

  it('another seed walks other draws', async () => {
    const w7 = await get('samplingWalk', 7);
    expect(w7.seed).toBe(7);
    expect(w7.draws).not.toEqual((await get('samplingWalk')).draws);
  });

  it('same seed, same sample; seed 7, another median', async () => {
    const s = await get('seedComparison');
    expect(`Same seed, same answer: two runs at seed ${s.seed} give identical samples: ${s.identicalSamples}.`).toBe(D['S8.sameSeed'][0]);
    expect(`A different seed (${s.otherSeed}): median ${p(s.medianAtOtherSeed)} against ${p(s.medianAtSeed)} at the default seed.`).toBe(D['S8.otherSeed'][0]);
    expect(s.iterations).toBe(5000);
    expect(s.medianLabel).toBe('50th percentile of breakeven price');
  });
});

// ---------------------------------------------------------------------------
// 7. Sections 9, 10 and 11: the breakeven price, the sample, the tornado.
// ---------------------------------------------------------------------------

describe('Section 9: the breakeven price', () => {
  it('the base case, NPV against price and the hurdles', async () => {
    const c = await get('breakevenCurve');
    expect(`ISIALA base case at the stated medians: capex ${c.capexMM} $MM, opex ${c.opexMM} $MM a year, efficiency ${c.efficiency}; breakeven to NPV 0: ${p(c.baseBreakeven)} USD/bbl.`).toBe(D['S9.base'][0]);
    expect(c.points.map((y) => row([String(y.price), m(y.npv)]))).toEqual(D['S9.curve']);
    const h = await get('hurdles');
    expect(`A hurdle above zero: breakeven ${h.rows.map((y) => `to NPV ${y.targetNpv} $MM ${p(y.price)}`).join('; ')}; NPV at the ${h.bracketTop} USD/bbl bracket top ${m(h.npvAtBracketTop)}.`).toBe(D['S9.hurdles'][0]);
  });

  it('twenty kinks where tax switches on, and the twelve published solves', async () => {
    const k = await get('taxKinks');
    expect(`- years 1 to 20 (the breakeven engine places ALL capex in year 1 and expenses it there, so year 1 carries capex too): ${k.map((y) => p(y.kinkPriceDerived)).join(', ')}.`).toBe(D['S9.kinks'][0]);
    expect(`- note: the Breakeven Analyzer builds its case with all capex in year 1 and opex flat, unlike the quick form's 50/50 capex split; ${k.length} kinks, one per year.`).toBe(D['S9.kinkNote'][0]);
    // Every kink sits inside the 0 to 500 bracket, so bisection is safe.
    expect(k.every((y) => y.kinkPriceDerived > 0 && y.kinkPriceDerived < L.PRICE_BRACKET_TOP)).toBe(true);
    const s = await get('solveCases');
    expect(s.map((y) => `- ${y.id}: ${y.note} Engine ${p(y.enginePrice)}; golden ${p(y.goldenPrice)}.`)).toEqual(D['S9.solve']);
  });
});

describe('Section 10: reading the sample', () => {
  it('5000 iterations, three percentiles of a price, the mean, the base, the extremes and the insight', async () => {
    const run = await get('breakevenRun');
    expect(`ISIALA breakeven run: ${run.sampleSize} iterations at seed ${run.seed}, excluded ${run.excluded}.`).toBe(D['S10.run'][0]);
    expect([
      ...run.percentiles.map((y) => row([y.label, String(y.sortedIndexDerived), p(y.value)])),
      row(['mean', 'all', p(run.mean)]),
      row(['base case at the stated medians', 'none', p(run.baseBreakeven)]),
    ]).toEqual(D['S10.table']);
    expect(`Sample extremes: lowest ${p(run.lowest)}, highest ${p(run.highest)}. S-curve y at index i is (i + 1) / n: at index ${run.medianIndex}, y ${r(run.sCurveYAtMedianIndex)}.`).toBe(D['S10.extremes'][0]);
    expect(`Mean minus median (derived): ${p(run.meanMinusMedianDerived)}.`).toBe(D['S10.meanMinusMedian'][0]);
    expect(`Engine insight: ${run.insights}`).toBe(D['S10.insight'][0]);
    expect(run.percentiles.map((y) => y.engineKey)).toEqual(['p10', 'p50', 'p90']);
  });

  it('the S-curve is 100 sorted prices from the lowest to the highest, y from 0.01 to 1', async () => {
    const run = await get('breakevenRun');
    expect(run.sCurve).toHaveLength(100);
    expect(run.sCurve[0].index).toBe(49);
    expect(r(run.sCurve[0].y)).toBe('0.010000');
    expect(run.sCurve[99].index).toBe(4999);
    expect(p(run.sCurve[99].price)).toBe(p(run.highest));
    expect(r(run.sCurve[99].y)).toBe('1.000000');
    expect(run.sCurve.every((y, i) => i === 0 || (y.price >= run.sCurve[i - 1].price && y.y > run.sCurve[i - 1].y))).toBe(true);
    // The point at y 0.5 is the sorted value just below the median index.
    expect(run.sCurve[49].index).toBe(run.medianIndex - 1);
  });

  it('the published runs, the excluded iterations and the run that throws', async () => {
    const u = await get('publishedUnreachable');
    expect(`Published mc_with_unreachable (${u.note}): ${u.excluded} of ${u.iterations} excluded; 10th ${p(u.p10)}, median ${p(u.p50)}, 90th ${p(u.p90)}.`).toBe(D['S10.unreachable'][0]);
    const pr = await get('publishedBreakevenRuns');
    expect(`Published mc_all_unreachable_throws (${pr.allUnreachable.note}): engine error "${pr.allUnreachable.error}".`).toBe(D['S10.allUnreachable'][0]);
    expect(pr.runs.map((y) => `- ${y.id}: ${y.note} seed ${y.seed}, ${y.iterations} iterations: 10th ${p(y.p10)}, median ${p(y.p50)}, 90th ${p(y.p90)}, mean ${p(y.mean)}, base ${p(y.baseBreakeven)}, excluded ${y.excluded}.`)).toEqual(D['S10.published']);
  });
});

describe('Section 11: the two-sided tornado', () => {
  it('three bars with both sides, efficiency running backwards, and the published one-sided case', async () => {
    const t = await get('tornado');
    expect(t.rows.map((y) => row([String(y.rank), y.variable, p(y.low), p(y.high), p(y.swingDerived)]))).toEqual(D['S11.tornado']);
    expect(`Efficiency runs backwards: its low-price end comes from the 90th percentile efficiency (${t.efficiencyLowPriceEndFrom}), its high-price end from the 10th (${t.efficiencyHighPriceEndFrom}).`).toBe(D['S11.efficiency'][0]);
    expect(t.lowPriceEndLabel).toBe('90th percentile of efficiency');
    expect(t.highPriceEndLabel).toBe('10th percentile of efficiency');
    const u = await get('publishedUnreachable');
    expect(`Published mc_with_unreachable tornado (B1): ${u.tornado.map((y) => `${y.variable} low ${p(y.low)} high ${p(y.high)}`).join('; ')}.`).toBe(D['S11.published'][0]);
  });

  it('a run already in hand gives the same tornado as a bare call', async () => {
    expect(L.tornado(await get('breakevenRun'))).toEqual(await get('tornado'));
  });
});

// ---------------------------------------------------------------------------
// 8. Sections 12 to 16: the convention, the Monte Carlo, the rules, the edges.
// ---------------------------------------------------------------------------

describe('Section 12: one meaning of a P-label', () => {
  it('the definition and the words, from the convention module', async () => {
    const w = await get('pLabelWords');
    expect([
      `- Definition (lib/conventions/percentile.js): ${w.definition}`,
      `- Cases, low to high: ${w.cases.map((c) => `${c.caseLabel} = ${c.pLabel}`).join(', ')}.`,
      `- A quantity where more is better (NPV): low case takes its ${w.npvLowCasePercentile}; ${w.npvLowCaseLabel}.`,
      `- A quantity where more is worse (a breakeven price): no P-label at all; it is described as ${w.breakevenPrice.join(', ')}.`,
      `- Parameters (capex, opex, efficiency) take percentiles too: ${w.parameters.capex[0]}.`,
    ]).toEqual(D['S12.bullets']);
    expect(w.cases.map((c) => c.engineKey)).toEqual(['p10', 'p50', 'p90']);
  });

  it('Low, Best and High on ISIALA\'s Scenario Builder run, and the swapped cards quoted', async () => {
    const c = await get('scenarioBuilderCases');
    expect(`ISIALA through the Scenario Builder's Monte Carlo (the app's settings: ${L.APP_MC.iterations} iterations, price, capex and reserves each plus or minus ${L.APP_MC.uncertainties.price * 100} percent, seed ${c.seed}):`).toBe(D['S12.settings'][0]);
    expect(c.rows.map((y) => row([y.caseLabel, y.pLabel, y.engineKey, m(y.npv)]))).toEqual(D['S12.cases']);
    expect(`THE SWAP EC3-0 FIXED: the old results panel printed the p90 key under ${c.swappedCards[0].quoted}, which on ISIALA is ${m(c.swappedCards[0].value)}, and the p10 key under ${c.swappedCards[1].quoted}, which is ${m(c.swappedCards[1].value)}. The card called conservative held the larger number.`).toBe(D['S12.swap'][0]);
    expect(c.conservativeCardHeldTheLargerNumber).toBe(true);
    expect(c.orderViolation).toBeNull();
  });
});

describe('Section 13: the Scenario Builder\'s Monte Carlo', () => {
  it('the rule, the run, the histogram, the S-curve, the seed and the price-only case', async () => {
    expect(L.MC_SAMPLING_LINES).toEqual(D['S13.sampling']);
    const x = await get('scenarioBuilderMonteCarlo');
    expect(`- ISIALA run: ${x.iterations} iterations, seed ${x.seed}, emv ${m(x.emv)}, 10th percentile key ${m(x.p10)}, median ${m(x.p50)}, 90th percentile key ${m(x.p90)}, lowest ${m(x.lowest)}, highest ${m(x.highest)}.`).toBe(D['S13.run'][0]);
    expect(`- Histogram: ${x.histogram.binCount} bins of width ${m(x.histogram.widthDerived)} (derived); counts ${x.histogram.counts.join(', ')}.`).toBe(D['S13.histogram'][0]);
    expect(`- S-curve: ${x.sCurve.pointCount} points, one every ${x.sCurve.stepDerived} sorted values; first probability ${p(x.sCurve.firstProbability)}, last ${p(x.sCurve.lastProbability)}.`).toBe(D['S13.sCurve'][0]);
    expect(x.sCurve.points).toHaveLength(50);
    // EC3-6: the S-curve's point at 10 percent is the floor rule's sorted value, not the card's average.
    const rules = await get('twoRules');
    expect(x.sCurve.valueAtTenPercent).toBe(rules.rows[0].floorRule);
    expect(x.sCurve.valueAtTenPercent).not.toBe(x.p10);
    expect(x.sCurve.lastProbability).toBe(98);
    expect(m(x.sCurve.points[0].value)).toBe(m(x.lowest));
    const s = await get('mcSeedComparison');
    expect(`- The seed guarantees the sample: the same seed repeats every value (${s.sameSeedRepeatsEveryValue}); seed ${s.otherSeed} gives median ${m(s.medianAtOtherSeed)} against ${m(s.medianAtSeed)}. It guarantees nothing about accuracy.`).toBe(D['S13.seed'][0]);
    const po = await get('publishedPriceOnly');
    expect(`- Published mc_seed3_price_only: ${po.note}`).toBe(D['S13.priceOnly'][0]);
    expect(po.uncertainties).toEqual({ capex: 0, price: 0.2, reserves: 0 });
  });
});

describe('Section 14: two percentile rules, and the wobble', () => {
  it('the two rules on one sample of 1000', async () => {
    const t = await get('twoRules');
    expect(`ISIALA's ${t.n} Scenario Builder NPVs, sorted. n x 0.1 = ${t.nTimesTenthDerived}, n x 0.5 = ${t.nTimesHalfDerived} and n x 0.9 = ${t.nTimesNinetiethDerived} are all whole numbers on an even length, so the screening rule averages two neighbours at every row.`).toBe(D['S14.intro'][0]);
    expect(t.rows.map((y) => row([y.label, m(y.screeningRule), m(y.floorRule), m(y.differenceDerived)]))).toEqual(D['S14.rules']);
  });

  it('ten seeds and five iteration counts', async () => {
    const w = await get('wobble');
    expect([
      `- 10th percentile by seed 1..10: ${w.bySeed.map((y) => p(y.p10)).join(', ')}; range ${p(w.p10RangeDerived)} (derived).`,
      `- median by seed 1..10: ${w.bySeed.map((y) => p(y.p50)).join(', ')}; range ${p(w.p50RangeDerived)} (derived).`,
    ]).toEqual(D['S14.wobbleSeeds']);
    expect(w.byIterations.map((y) => `- ${y.iterations} iterations: 10th ${p(y.p10)}, median ${p(y.p50)}, 90th ${p(y.p90)}.`)).toEqual(D['S14.wobbleIterations']);
    expect(w.defaultSeedMedianOutsideSeedSpan).toBe(true);
    expect(w.labels.p50).toBe('50th percentile of breakeven price');
  });

  it('stepping through the wobble one run at a time gives the same answer as the whole', () => {
    const opts = { seeds: [1, 2], seedIterations: 60, counts: [40] };
    expect(L.wobbleSteps(opts)).toEqual([
      { kind: 'seed', seed: 1, iterations: 60 }, { kind: 'seed', seed: 2, iterations: 60 },
      { kind: 'iterations', seed: 20260829, iterations: 40 },
    ]);
    expect(L.wobbleCollect(L.wobbleSteps(opts).map(L.wobbleStep))).toEqual(L.wobble(opts));
    expect(L.wobbleSteps()).toHaveLength(15);
  });
});

describe('Section 15: repaired edges and one still open, B1', () => {
  it('every range at zero, forty iterations, and the one-sided tornado', async () => {
    const e = await get('edges');
    const z = e.zeroRanges;
    expect(`Every range at zero on ISIALA (${z.iterations} iterations): 10th percentile key ${m(z.p10)}, median ${m(z.p50)}, 90th ${m(z.p90)}, emv ${m(z.emv)}, deterministic NPV ${m(z.deterministicNpv)}; bin 0 holds ${z.binZeroCount} of 30 (it used to throw, FINDINGS S4).`).toBe(D['S15.zero'][0]);
    expect(`Forty iterations on ISIALA: ${e.fortyIterations.sCurvePoints} S-curve points (it used to return none, FINDINGS S5).`).toBe(D['S15.forty'][0]);
    expect(`A tornado bar with one side missing (B1, published mc_with_unreachable): high sides ${e.oneSidedTornado.rows.map((y) => p(y.high)).join(', ')}; low sides ${e.oneSidedTornado.rows.map((y) => p(y.low)).join(', ')}.`).toBe(D['S15.oneSided'][0]);
  });

  it('the narrow opex belief clamps and the insight says so', async () => {
    const n = await get('narrowBeliefRun');
    const [q10, q50, q90] = n.percentiles;
    expect(`ISIALA with the narrow opex belief ${n.stated.join(' / ')}: opex fit ${m(n.opexFit.min)} / ${m(n.opexFit.mode)} / ${m(n.opexFit.max)}, exact ${n.opexFit.exact}; 10th ${p(q10.value)}, median ${p(q50.value)}, 90th ${p(q90.value)}, base ${p(n.baseBreakeven)}; tornado ${n.tornado.map((y) => `${y.variable} ${p(y.low)}/${p(y.high)}`).join('; ')}.`).toBe(D['S15.narrow'][0]);
    expect(`Insight carries the fit note: ${n.insightCarriesFitNote}.`).toBe(D['S15.insight'][0]);
    expect(n.insights).toContain(`opex: ${(await get('fits')).narrowNote}`);
    expect(n.statedLabels).toEqual(['10th percentile of opex', '50th percentile of opex', '90th percentile of opex']);
  });
});

describe('Section 16: numbers to distrust', () => {
  it('NTEJE and OKPOMA report the clamp; the IRR cases; the payback never revisited; mid-year beside year-end', async () => {
    const d = await get('distrust');
    const nt = d.nteje;
    expect(`NTEJE (${nt.line}): npv ${m(nt.npv)}, irr ${p(nt.irr)} percent, payback ${p(nt.payback)}, maxExposure ${m(nt.maxExposure)}, final cumulative ${m(nt.finalCumulative)}. The IRR is the Newton clamp (FINDINGS S1), on a project that never pays back.`).toBe(D['S16.nteje'][0]);
    const ok = d.okpoma;
    expect(`OKPOMA: npv ${m(ok.npv)}, irr ${p(ok.irr)} percent, payback ${p(ok.payback)}, maxExposure ${m(ok.maxExposure)}.`).toBe(D['S16.okpoma'][0]);
    expect(ok.firstRows.map((y) => row(ledgerCells(y, L.OKPOMA_FIRST_ROW_COLUMNS)))).toEqual(D['S16.okpomaRows']);
    expect(d.irrCases.map((y) => `- ${y.id}: ${y.note} Engine ${p(y.engineIrr)}; golden roots ${JSON.stringify(y.goldenRoots)}.`)).toEqual(D['S16.irr']);
    const fd = d.fdpNeverPaysBack;
    expect(`- fdp_never_pays_back: ${fd.note} Engine npv ${m(fd.npv)}, irr ${p(fd.irr)}, payback ${p(fd.payback)}.`).toBe(D['S16.fdp'][0]);
    const mid = d.midYear;
    expect(`Mid-year beside year-end on ISIALA's cash flows: engine (mid-year) npv ${m(mid.engineNpv)}; the same rows discounted at year end ${m(mid.yearEndNpvDerived)} (derived); ratio ${r(mid.ratioDerived)} against (1.12)^0.5 = ${r(mid.rootOfOnePlusRateDerived)} (derived).`).toBe(D['S16.midYear'][0]);
  });
});

describe('Section 17: ISIALA end to end', () => {
  it('the four headline blocks', async () => {
    const e = await get('endToEnd');
    const [q10, q50, q90] = e.breakeven.percentiles;
    expect([
      `- Deterministic: npv ${m(e.deterministic.npv)}, irr ${p(e.deterministic.irr)} percent, payback ${p(e.deterministic.payback)} years, maxExposure ${m(e.deterministic.maxExposure)}.`,
      `- Scenarios: ${e.scenarios.map((y) => `${y.name} ${m(y.npv)}`).join(', ')}.`,
      `- Breakeven: base ${p(e.breakeven.baseBreakeven)}; ${q10.label} ${p(q10.value)}, median ${p(q50.value)}, ${q90.label} ${p(q90.value)}.`,
      `- Scenario Builder Monte Carlo: ${e.scenarioBuilder.rows.map((y) => `${y.caseLabel} ${y.pLabel} ${m(y.npv)}`).join(', ')}, emv ${m(e.scenarioBuilder.emv)}, seed ${e.scenarioBuilder.seed}.`,
    ]).toEqual(D.S17);
  });
});

// ---------------------------------------------------------------------------
// 9. Purity.
// ---------------------------------------------------------------------------

describe('every reader is pure and deterministic', () => {
  it('two calls agree, and mutating a result changes neither the next call nor the fields', async () => {
    const a = L.ledger('isiala');
    a.rows[0].ncf = 999;
    a.metrics.npv = 999;
    expect(L.ledger('isiala')).toEqual(await get('ledger', 'isiala'));
    const q = L.quickCase('isiala');
    q.quick.capex = 1;
    expect(L.ISIALA.capex).toBe(180);
    expect(L.samplingWalk()).toEqual(await get('samplingWalk'));
    expect(await L.scenarioBuilderMonteCarlo()).toEqual(await get('scenarioBuilderMonteCarlo'));
    expect(L.breakevenRun({ iterations: 50 })).toEqual(L.breakevenRun({ iterations: 50 }));
  });
});

// ---------------------------------------------------------------------------
// 10. THE CAPSTONE: the eighteen graded fields reproduce fields.json exactly.
// ---------------------------------------------------------------------------

const CAPSTONE_FIELDS = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'));

describe('the UMUNEDE capstone: the eighteen graded fields reproduce fields.json exactly', () => {
  it('fields.json is the eighteen published fields, six per tier, in the published order', () => {
    expect(CAPSTONE_FIELDS).toHaveLength(18);
    expect(CAPSTONE_FIELDS.map((x) => x[0])).toEqual([
      ...Array(6).fill('beginner'), ...Array(6).fill('intermediate'), ...Array(6).fill('advanced'),
    ]);
    expect(CAPSTONE_FIELDS.every((x) => x[3] === 0.001)).toBe(true);
  });

  it('every one of the eighteen graded answers and tolerances is EXACTLY the published value', async () => {
    const got = await get('umunedeCapstoneFields');
    expect(got.map((x) => x[1])).toEqual(CAPSTONE_FIELDS.map((x) => x[1]));
    const values = await L.umunedeCapstoneValues(got);
    const tolerances = await L.umunedeCapstoneTolerances(got);
    const wrong = [];
    CAPSTONE_FIELDS.forEach(([tier, key, v, tol], i) => {
      if (got[i][0] !== tier) wrong.push(`${key}: tier ${got[i][0]} against ${tier}`);
      if (values[key] !== v) wrong.push(`${tier} ${key}: lab ${values[key]} against published ${v}`);
      if (tolerances[key] !== tol) wrong.push(`${tier} ${key}: tolerance ${tolerances[key]} against published ${tol}`);
    });
    expect(wrong).toEqual([]);
  });

  it('the capstone conditions are copied verbatim from ec3_fields.mjs', () => {
    const src = fs.readFileSync(FIELDS_MJS, 'utf8');
    const lab = fs.readFileSync(path.join(HERE, 'uncertaintyLab.js'), 'utf8');
    [
      ['UMUNEDE', 'UMUNEDE'], ['BELIEF', 'UMUNEDE_BELIEF'], ['SEED', 'UMUNEDE_SEED'], ['MC', 'UMUNEDE_MC'],
      ['BREAKEVEN_ITERATIONS', 'UMUNEDE_BREAKEVEN_ITERATIONS'], ['HURDLE_MUSD', 'UMUNEDE_HURDLE_MUSD'],
    ].forEach(([theirs, ours]) => {
      const a = src.match(new RegExp(`^export const ${theirs} = (.*);$`, 'm'));
      const b = lab.match(new RegExp(`^export const ${ours} = (.*);$`, 'm'));
      expect(a, theirs).not.toBeNull();
      expect(b, ours).not.toBeNull();
      expect(b[1], ours).toBe(a[1]);
    });
  });
});

// ---------------------------------------------------------------------------
// 11. THE LEAK GATE: no teaching number may be a graded capstone answer.
// ---------------------------------------------------------------------------

/**
 * Exports that TAKE AN ARGUMENT and return nothing useful bare. Each is walked
 * below at every argument a panel hands it. The list is asserted, so a new
 * reader cannot hide in it.
 */
const ARG_REQUIRED = [
  'quickLine', 'publishedTaxRoyalty', 'tornadoRows', 'beliefLabels', 'wobbleStep', 'wobbleCollect',
  'leakGuardTargets', 'leakGuardHit', 'collectNumbers',
];
const GATE_MACHINERY = ['LEAK_GUARD_MARGIN', 'LEAK_GUARD_SCALINGS'];

/** A surface smaller than this is not the lab: refuse to call it clean. */
const MIN_SURFACE_ENTRIES = 80;
const MIN_SURFACE_NUMBERS = 2000;

const teachingSurface = async () => {
  const out = [];
  const push = async (name, v) => out.push({ name, value: await v });
  for (const [name, v] of Object.entries(L)) {
    if (L.CAPSTONE_ONLY_EXPORTS.includes(name) || ARG_REQUIRED.includes(name) || GATE_MACHINERY.includes(name)) continue;
    // eslint-disable-next-line no-await-in-loop
    await push(`${name}()`, typeof v === 'function' ? get(name) : v);
  }
  for (const key of L.FIELD_KEYS) {
    for (const reader of ['quickCase', 'ledger', 'value', 'sensitivity', 'scenarios']) {
      // eslint-disable-next-line no-await-in-loop
      await push(`${reader}(${key})`, get(reader, key));
    }
  }
  for (const id of L.TAX_ROYALTY_CASE_IDS) {
    // eslint-disable-next-line no-await-in-loop
    await push(`publishedTaxRoyalty(${id})`, get('publishedTaxRoyalty', id));
  }
  for (const quantity of ['capex', 'opex', 'efficiency', 'breakeven price']) {
    // eslint-disable-next-line no-await-in-loop
    await push(`beliefLabels(${quantity})`, L.beliefLabels(quantity));
  }
  await push('samplingWalk(7)', get('samplingWalk', 7));
  await push('quickLine(ISIALA)', L.quickLine(L.ISIALA));
  return out;
};

const surfaceNumbers = (surface) => surface.flatMap((s) => L.collectNumbers(s.value, s.name));

/** Refuse to report a clean gate over a surface that cannot be the lab (README section 13). */
const assertPlausible = (surface, numbers) => {
  if (surface.length < MIN_SURFACE_ENTRIES || numbers.length < MIN_SURFACE_NUMBERS) {
    throw new Error(`the teaching surface has only ${surface.length} entries and ${numbers.length} numbers: refusing to call it clean`);
  }
};

describe('THE LEAK GATE: the guard itself', () => {
  const targets = L.leakGuardTargets(CAPSTONE_FIELDS);

  it('the guard is built from all eighteen fields in all three unit shiftings, with the band scaled', () => {
    expect(targets).toHaveLength(18 * 3);
    expect(L.LEAK_GUARD_MARGIN).toBe(10);
    expect(L.LEAK_GUARD_SCALINGS.map((s) => s.factor)).toEqual([1, 1000, 0.001]);
    const t = (key, tag) => targets.find((x) => x.key === key && x.tag === tag);
    const [, , v] = CAPSTONE_FIELDS.find((x) => x[1] === 'um_npv_musd');
    expect(t('um_npv_musd', 'as graded').band).toBeCloseTo(0.01, 12);
    expect(t('um_npv_musd', 'x1000').band).toBeCloseTo(10, 9);
    expect(t('um_npv_musd', 'x0.001').band).toBeCloseTo(0.00001, 15);
    expect(t('um_npv_musd', 'x1000').value).toBeCloseTo(v * 1000, 6);
  });

  it('every reader answers a bare call, and the surface is large enough to mean something', async () => {
    const surface = await teachingSurface();
    surface.forEach((s) => expect(s.value, `${s.name} returned nothing`).not.toBeUndefined());
    const numbers = surfaceNumbers(surface);
    // eslint-disable-next-line no-console
    console.log(`teaching surface: ${surface.length} entries, ${numbers.length} numbers`);
    expect(() => assertPlausible(surface, numbers)).not.toThrow();
  }, HEAVY);

  it('THE GUARD REFUSES AN EMPTY OR TINY SURFACE rather than calling it clean', async () => {
    const surface = await teachingSurface();
    expect(() => assertPlausible([], [])).toThrow(/refusing/);
    expect(() => assertPlausible(surface.slice(0, 5), surfaceNumbers(surface.slice(0, 5)))).toThrow(/refusing/);
  }, HEAVY);

  it('every export is accounted for: walked bare, walked with arguments, capstone or machinery', () => {
    const exported = Object.keys(L);
    ARG_REQUIRED.forEach((k) => expect(exported, k).toContain(k));
    exported.filter((k) => typeof LAB[k] === 'function' && LAB[k].length > 0 && !ARG_REQUIRED.includes(k)
      && !L.CAPSTONE_ONLY_EXPORTS.includes(k))
      .forEach((k) => {
        // A reader with a REQUIRED argument would be called bare with nothing.
        // Every remaining function's parameters must all have defaults.
        expect(LAB[k].length, `${k} has a required argument and is not in ARG_REQUIRED`).toBe(0);
      });
  });

  it('the teaching surface names no capstone export, and carries no em dash or en dash', async () => {
    const text = JSON.stringify(await teachingSurface());
    L.CAPSTONE_ONLY_EXPORTS.forEach((name) => {
      if (name === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(text, `${name} appears in the teaching surface`).not.toContain(name);
    });
    expect(text.toLowerCase()).not.toContain('umunede');
    expect(text).not.toMatch(/[–—]/);
  }, HEAVY);

  it('THE GUARD IS LIVE: every graded answer, planted, is caught in every shifting, however deep', () => {
    CAPSTONE_FIELDS.forEach(([, key, v, tol]) => {
      const drift = 0.9 * L.LEAK_GUARD_MARGIN * tol;
      [v, v + drift, v - drift].forEach((planted) => {
        expect(L.leakGuardHit(planted, targets), `${key} ${planted}`).not.toBeNull();
        expect(L.leakGuardHit(planted * 1000, targets), `${key} x1000`).not.toBeNull();
        expect(L.leakGuardHit(planted / 1000, targets), `${key} x0.001`).not.toBeNull();
      });
      // Two graded fields can share a neighbourhood (the Low case key and the
      // floor-rule 10th sit 0.0066 apart), so ask for every target hit.
      const buried = L.collectNumbers({ a: [{ b: v }] })[0].value;
      expect(targets.filter((t) => Math.abs(buried - t.value) < t.band).map((t) => t.key), key).toContain(key);
    });
  });

  it('THE GUARD IS NOT TRIGGER HAPPY: the teaching headlines pass', async () => {
    expect(L.leakGuardHit((await get('ledger', 'isiala')).metrics.npv, targets)).toBeNull();
    expect(L.leakGuardHit((await get('breakevenRun')).percentiles[1].value, targets)).toBeNull();
    expect(L.leakGuardHit((await get('breakevenCurve')).baseBreakeven, targets)).toBeNull();
    [NaN, Infinity, -Infinity].forEach((x) => expect(L.leakGuardHit(x, targets)).toBeNull());
    expect(L.collectNumbers({ a: NaN, b: null, c: 'text', d: undefined })).toEqual([]);
  }, HEAVY);
});

describe('THE LEAK GATE: no teaching number may be a graded capstone answer', () => {
  const targets = L.leakGuardTargets(CAPSTONE_FIELDS);

  it('NO number returned by any teaching export is within ten grading bands of a graded answer, in any shifting', async () => {
    const surface = await teachingSurface();
    const numbers = surfaceNumbers(surface);
    assertPlausible(surface, numbers);
    const hits = numbers
      .map((n) => ({ n, t: L.leakGuardHit(n.value, targets) }))
      .filter((x) => x.t)
      .map(({ n, t }) => `${n.path} = ${n.value} is within ${t.band} of ${t.key} ${t.tag} (${Math.abs(n.value - t.value) / t.gradingBand} grading bands)`);
    expect(hits).toEqual([]);
  }, HEAVY);
});
