// THE SUPPLY TEACHING DIGEST GENERATOR. Every figure, table row and refusal in
// digest.txt is printed by this file straight out of the vendored
// engines/downstream/terminalDepot.js and fuelPricing.js, called on the
// teaching cases in supply_fields.mjs. Nothing is typed: a volume is the
// engine's volume, a probability is the engine's probability, and a refusal is
// the engine's own sentence, printed after "REFUSED:".
//
// THREE GUARDS BUILT INTO THE GENERATOR, so a digest that breaks one of them
// cannot be written at all:
//
//   THE VERDICT LABELS. refused() asserts the engine returned no figure and a
//   reason, and prints the reason; a row cannot be labelled a refusal when the
//   engine answered, which is how FC4's dump once printed success fields under
//   a refusal heading. answered() asserts the opposite.
//
//   THE SECTION OWNERS. Each section's owning tier and module comes from ONE
//   table, SECTION_OWNERS, checked against structure.py's module keys at build
//   time, never typed into a heading.
//
//   THE NON-VALUES. The build throws if a line would print NaN, undefined,
//   Infinity, null or an object where a measurement belongs, and if any figure
//   prints as a signed zero.
//
// NO CLOCK. Neither module reads a date or a random number (gate_clock.sh reads
// both sources and rebuilds this digest under a moved machine clock to prove
// it), so nothing here needs an as-of date.
//
// PRINT PRECISION is one table, PRINT, and the header prints it. Nothing is
// rounded anywhere else.
//
// Usage: node supply_dump.mjs   (build_digest.sh pins TZ)
import fs from 'fs';
import * as F from './supply_fields.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-md-supply-nextgen/packages/engines';
const TD = await import(`${ROOT}/engines/downstream/terminalDepot.js`);
const FP = await import(`${ROOT}/engines/downstream/fuelPricing.js`);

/* ------------------------------------------------------------------ *
 * Output, verdicts and formatting.
 * ------------------------------------------------------------------ */
const L = [];
const out = (s = '') => L.push(s);
export const PRINT = {
  m3: 3, mm: 0, vcf: 6, alpha: 9, prob: 6, util: 6, erlang: 4, min: 4, days: 4, turns: 4, queue: 4,
  usd: 2, usdL: 6, local: 4, localL: 4, litres: 2, tonnes: 4, bbl: 4, km: 2, hours: 3, trips: 6, fx: 4, pct: 4, kg: 4, share: 6,
};
const f = (cls) => (v) => {
  if (v === null || v === undefined) return 'none';
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`NON-VALUE: a ${cls} figure is ${v}`);
  const s = v.toFixed(PRINT[cls]);
  if (/^-0(\.0+)?$/.test(s)) return s.slice(1);
  return s;
};
const m3 = f('m3'); const vcf = f('vcf'); const alpha = f('alpha'); const prob = f('prob'); const util = f('util');
const erl = f('erlang'); const min = f('min'); const days = f('days'); const turns = f('turns'); const qlen = f('queue');
const usd = f('usd'); const usdL = f('usdL'); const loc = f('local'); const locL = f('localL'); const lit = f('litres');
const t4 = f('tonnes'); const bbl = f('bbl'); const km = f('km'); const hrs = f('hours'); const trips = f('trips');
const fx = f('fx'); const pct = f('pct'); const kg = f('kg'); const share = f('share');
const plain = (v) => (v === null || v === undefined ? 'none' : v === '' ? 'blank' : String(v));

let refusedCount = 0; let answeredCount = 0;
const refused = (r, where, key = null) => {
  const reason = r && (r.error || (r.found === false ? r.reason : null));
  if (!reason || !String(reason).trim() || (key && r[key] !== null && r[key] !== undefined)) {
    throw new Error(`VERDICT LABEL: ${where} was expected to be REFUSED with a reason${key ? ` and no ${key}` : ''}, and the engine said ${JSON.stringify(r)}`);
  }
  refusedCount += 1;
  return `REFUSED: ${reason}`;
};
const answered = (r, key, where) => {
  if (!r || r.error || r[key] === null || r[key] === undefined) throw new Error(`VERDICT LABEL: ${where} was expected to answer ${key}, and the engine said ${JSON.stringify(r)}`);
  answeredCount += 1;
  return r[key];
};
const row = (...cells) => out(`| ${cells.join(' | ')} |`);
const head = (...cells) => { row(...cells); row(...cells.map(() => '---')); };

/* ------------------------------------------------------------------ *
 * THE SECTION OWNERS, one table, checked against structure.py.
 * ------------------------------------------------------------------ */
const SECTION_OWNERS = {
  1: [['beginner', 'm01']], 2: [['beginner', 'm01']], 3: [['beginner', 'm02']], 4: [['beginner', 'm02']],
  5: [['beginner', 'm03']], 6: [['beginner', 'm04']], 7: [['beginner', 'm05'], ['beginner', 'm06']],
  8: [['beginner', 'm05'], ['beginner', 'm06']],
  9: [['intermediate', 'm01']], 10: [['intermediate', 'm01'], ['intermediate', 'm02']], 11: [['intermediate', 'm02']],
  12: [['intermediate', 'm03'], ['intermediate', 'm06']], 13: [['intermediate', 'm04']],
  14: [['intermediate', 'm05'], ['intermediate', 'm06']], 15: [['intermediate', 'm05'], ['intermediate', 'm06']],
  16: [['intermediate', 'm05'], ['intermediate', 'm06']],
  17: [['advanced', 'm01']], 18: [['advanced', 'm02'], ['advanced', 'm06']], 19: [['advanced', 'm03'], ['advanced', 'm06']],
  20: [['advanced', 'm04'], ['advanced', 'm06']], 21: [['advanced', 'm04']], 22: [['advanced', 'm05'], ['advanced', 'm06']],
  23: [['advanced', 'm06']], 24: [['advanced', 'm06']],
};
const TIER_WORD = { beginner: 'Associate', intermediate: 'Professional', advanced: 'Expert' };
const structureKeys = (() => {
  const src = fs.readFileSync(`${HERE}structure.py`, 'utf8');
  const keys = new Set(); let tier = null;
  for (const line of src.split('\n')) {
    const t = /^ '(beginner|intermediate|advanced)': \[/.exec(line);
    if (t) tier = t[1];
    const m = /^  \('(m\d\d)-/.exec(line);
    if (m && tier) keys.add(`${tier}:${m[1]}`);
  }
  return keys;
})();
if (structureKeys.size !== 18) throw new Error(`SECTION OWNERS: structure.py yielded ${structureKeys.size} module keys, expected 18`);
let sectionNo = 0;
const section = (title) => {
  sectionNo += 1;
  const own = SECTION_OWNERS[sectionNo];
  if (!own) throw new Error(`SECTION OWNERS: section ${sectionNo} has no owner row`);
  for (const [t, m] of own) {
    if (!structureKeys.has(`${t}:${m}`)) throw new Error(`SECTION OWNERS: section ${sectionNo} names ${t} ${m}, which structure.py does not declare`);
  }
  const tiers = [...new Set(own.map(([t]) => t))];
  const owners = tiers.map((t) => `${TIER_WORD[t]} ${own.filter(([x]) => x === t).map(([, m]) => m).join(' and ')}`).join(' and ');
  out('');
  out(`# SECTION ${sectionNo}: ${title} (owned by ${owners})`);
  out('');
};

/* ------------------------------------------------------------------ *
 * The cases, built once.
 * ------------------------------------------------------------------ */
const tanks = F.AKODO_TANKS.map((t) => ({ ...t, table: F.akodoTable(t) }));
const AK1 = tanks[0]; const AK2 = tanks[1]; const AK3 = tanks[2];
const std = (t) => TD.dipToStandardVolume({ strapping: t.table, heightMm: t.dipMm, waterMm: t.waterMm, vcf: t.vcfTyped });
const stocks = tanks.map((t) => ({ t, s: std(t) }));
const closingStd = stocks.reduce((a, { s }) => a + answered(s, 'standardM3', `${s.id} standard`), 0);
const closingGross = stocks.reduce((a, { s }) => a + s.grossM3, 0);
const DAY = F.AKODO_DAY;

const BC = F.BADAGRY_CARGO;
const chargesWith = (rates, over = {}) => FP.IMPORT_TEMPLATE.map((c) => ({ ...c, amount: rates[c.id] ?? null, ...(over[c.id] || {}) }));
const onCif = { insurance: { basis: FP.CHARGE_BASIS.PERCENT_OF_CIF } };
const landed = (charges, extra = {}) => FP.landedCost({
  quantity: BC.quantity, quantityUnit: BC.quantityUnit, densityKgM3: BC.densityKgM3, fobPrice: BC.fobPrice,
  fobBasis: BC.fobBasis, charges, oceanLossPercent: BC.oceanLossPercent, fxRate: BC.fxRate, ...extra,
});
const elementsWith = (vals) => FP.PUMP_TEMPLATE.map((e) => ({ ...e, amount: vals[e.id] ?? null }));
const BAD_ELEMENTS = elementsWith(F.BADAGRY_ELEMENTS);
const badLanded = landed(chargesWith(F.BADAGRY_RATES, onCif));
const badPump = FP.buildPumpPrice({ landedPerLitre: badLanded.perLitreLocal, elements: BAD_ELEMENTS, capPerLitre: F.BADAGRY_CAP });
const priceAtFx = (rate) => {
  const l = landed(chargesWith(F.BADAGRY_RATES, onCif), { fxRate: rate });
  if (l.error || l.perLitreLocal === null) return NaN;
  return FP.buildPumpPrice({ landedPerLitre: l.perLitreLocal, elements: BAD_ELEMENTS }).pricePerLitre;
};

/* ================================================================== */
out('# supply: Terminals, Depots & Fuel Supply. Teaching digest.');
out('# PRECISION: volumes print to three decimals of a cubic metre (a litre); VCF to six decimals and its alpha to nine; probabilities and utilisation to six decimals; offered load in erlangs, minutes and queue lengths to four; days of cover and turns to four; money in US dollars to two decimals and dollars per litre to six; local currency per litre to four; percents to four; litres to two; tonnes and barrels to four; kilometres to two; hours to three; trips to six; exchange rates to four. Heights are whole millimetres. Counts are whole numbers.');
out('# NO CLOCK: neither engine reads a date or a random number, so no figure below depends on when or where the digest was built.');
out('# ENGINES: engines/downstream/terminalDepot.js and engines/downstream/fuelPricing.js at petrolord-engines e972ae7 (MD3-0, MD3-1 and MD3-2, with the engines #232 copy pass and queue vocabularies), vendored in NextGen under packages/engines.');
out('# CASES: AKODO (a coastal import terminal: three tanks, their strapping tables, a morning of dips and one day), IBAFO (an inland depot: its loading rack, tank farm, throughput economics, a truck lane, a fleet and a forecourt), BADAGRY (one petrol cargo landed and priced to the nozzle). All three are invented records.');
out('# RATES: every rate, margin, levy, freight, exchange rate and tax below is INVENTED for this course and is not a published figure. The engine ships no rate and no volume correction coefficient, and the one coefficient row below is SYNTHETIC.');
out('# Built by build_digest.sh from supply_dump.mjs and supply_fields.mjs. Never edited by hand.');

/* ------------------------------------------------------------------ */
section('WHAT THE TWO APPS COMPUTE, AND WHAT THE ENGINE SHIPS');
out('Each module exports its rules as functions and its fixed data as constants. The counts below are measured from the modules themselves.');
out('');
head('module', 'exported functions', 'exported constants', 'names');
for (const [name, mod] of [['terminalDepot', TD], ['fuelPricing', FP]]) {
  const fns = Object.entries(mod).filter(([, v]) => typeof v === 'function').map(([k]) => k);
  const other = Object.entries(mod).filter(([, v]) => typeof v !== 'function').map(([k]) => k);
  row(name, fns.length, other.length, [...fns, ...other].join(', '));
}
for (const [name, mod] of [['terminalDepot', TD], ['fuelPricing', FP]]) {
  const fns = Object.entries(mod).filter(([, v]) => typeof v === 'function').map(([k]) => k);
  const other = Object.entries(mod).filter(([, v]) => typeof v !== 'function').map(([k]) => k);
  out(`${name} exported functions (${fns.length}): ${fns.join(', ')}`);
  out(`${name} exported constants (${other.length}): ${other.length ? other.join(', ') : 'none'}`);
}
out('');
out(`fuelPricing.LITRES_PER_M3: ${FP.LITRES_PER_M3}`);
out(`fuelPricing.M3_PER_BBL: ${FP.M3_PER_BBL}`);
out(`fuelPricing.CHARGE_BASIS: ${Object.values(FP.CHARGE_BASIS).join(', ')}`);
out(`fuelPricing.PRICE_ELEMENT_BASIS: ${Object.values(FP.PRICE_ELEMENT_BASIS).join(', ')}`);
out('');
out('fuelPricing.IMPORT_TEMPLATE, the line items of an import build-up. Every rate is absent:');
head('order', 'id', 'label', 'basis', 'stage', 'rate shipped');
FP.IMPORT_TEMPLATE.forEach((c, i) => row(i + 1, c.id, c.label, c.basis, c.stage, plain(c.amount)));
out('');
out('fuelPricing.PUMP_TEMPLATE, the line items from the depot gate to the nozzle. Every rate is absent:');
head('order', 'id', 'label', 'basis', 'recipient', 'rate shipped');
FP.PUMP_TEMPLATE.forEach((e, i) => row(i + 1, e.id, e.label, e.basis, e.recipient, plain(e.amount)));
out('');
out(`fuelPricing.RATE_DISCLAIMER: "${FP.RATE_DISCLAIMER}"`);
out('');
out('fuelPricing.PRODUCT_REFERENCE, typical densities the engine labels as a starting point. Nothing in the module reads them unless a caller passes one in, and the certificate of quality is the authority:');
head('code', 'label', 'typical density kg/m3', 'range kg/m3');
FP.PRODUCT_REFERENCE.forEach((p) => row(p.code, p.label, p.typicalDensityKgM3, p.range));
out('');
{
  const a = FP.stationSizing({ ...F.IBAFO_STATION });
  // The station rounds the figures it REPORTS (peak to 2 dp, service minutes to
  // 3 dp) but queues on the unrounded ones, so the comparison is made on the
  // station's own unrounded inputs: throughput / litres x peak share, and
  // litres / rate + overhead.
  const S0 = F.IBAFO_STATION;
  const b = TD.rackQueue({ arrivalsPerHour: (S0.dailyThroughputLitres / S0.litresPerTransaction) * S0.peakHourShare, loadMinutes: S0.litresPerTransaction / S0.dispenseRateLitresPerMinute + S0.transactionOverheadMinutes, bays: S0.nozzles });
  const sameWait = Math.abs(a.queue.probabilityOfWaiting - b.probabilityOfWaiting) < 1e-12;
  if (!sameWait) throw new Error('stationSizing and rackQueue disagree on the same unrounded inputs');
  out(`fuelPricing.stationSizing sizes its forecourt by calling terminalDepot.rackQueue, so a forecourt and a loading rack are one queue model: on the IBAFO forecourt the station's probability of waiting and rackQueue's on the same arrivals, service minutes and nozzles agree: ${sameWait}.`);
  out(`That comparison is made on the station's unrounded arrivals and service minutes. stationSizing REPORTS its peak transactions to two decimals and its service minutes to three (SECTION 16), and rackQueue fed those printed roundings answers a probability of waiting of ${prob(TD.rackQueue({ arrivalsPerHour: a.peakTransactionsPerHour, loadMinutes: a.serviceMinutesPerTransaction, bays: S0.nozzles }).probabilityOfWaiting)} against the station's ${prob(a.queue.probabilityOfWaiting)}.`);
}

/* ------------------------------------------------------------------ */
section('MISSING STAYS MISSING');
out('Each row is one call with one measured input left blank, null or absent. The engine refuses the call, reports the figure it cannot form as none, or labels its answer incomplete; a refusal prints the engine\'s own sentence.');
out('');
head('call', 'what is missing', 'the engine answers');
row('volumeAtDip', 'the strapping table', refused(TD.volumeAtDip({ strapping: [], heightMm: 5000 }), 'no table'));
row('volumeAtDip', 'the dip (null)', refused(TD.volumeAtDip({ strapping: AK1.table, heightMm: null }), 'null dip'));
row('volumeAtDip', 'the dip (blank)', refused(TD.volumeAtDip({ strapping: AK1.table, heightMm: '' }), 'blank dip'));
{
  const r = TD.dipToStandardVolume({ strapping: AK1.table, heightMm: AK1.dipMm, waterMm: AK1.waterMm, vcf: null });
  row('dipToStandardVolume', 'the VCF', `gross ${m3(answered(r, 'grossM3', 'no vcf'))} m3, standard ${m3(r.standardM3)}; note: ${r.note}`);
}
row('volumeCorrectionFactor', 'the coefficients', refused(TD.volumeCorrectionFactor({ densityKgM3: AK1.densityKgM3, temperatureC: AK1.temperatureC }), 'no coefficients'));
row('volumeCorrectionFactor', 'the density', refused(TD.volumeCorrectionFactor({ temperatureC: AK1.temperatureC, coefficients: F.SYNTHETIC_COEFFICIENTS }), 'no density'));
row('reconcileStock', 'the opening stock', refused(TD.reconcileStock({ ...DAY, openingM3: null, closingDippedM3: closingStd }), 'no opening'));
{
  const r = TD.reconcileStock({ ...DAY, closingDippedM3: null });
  if (r.unaccountedM3 !== null || !r.note) throw new Error('no closing dip answered');
  row('reconcileStock', 'the closing dip', `expected closing ${m3(r.expectedClosingM3)} m3, unaccounted ${m3(r.unaccountedM3)}; note: ${r.note}`);
}
row('rackQueue', 'the arrival rate', refused(TD.rackQueue({ ...F.IBAFO_RACK, arrivalsPerHour: null }), 'no arrivals'));
{
  const r = TD.throughputEconomics({ ...F.IBAFO_ECONOMICS });
  row('throughputEconomics', 'the emission factor', `margin ${usd(r.margin)}, emissions ${plain(r.emissionsKgCo2e)}; note: ${r.carbonNote}`);
}
row('cargoQuantities', 'the density', refused(FP.cargoQuantities({ quantity: BC.quantity, unit: BC.quantityUnit }), 'no density'));
row('cargoQuantities', 'the quantity', refused(FP.cargoQuantities({ unit: BC.quantityUnit, densityKgM3: BC.densityKgM3 }), 'no quantity'));
row('landedCost', 'the FOB price', refused(landed(chargesWith(F.BADAGRY_RATES), { fobPrice: null }), 'no fob'));
{
  const r = landed(chargesWith({}));
  row('landedCost', 'every rate in the template', `complete ${r.complete}, ${r.missingRates.length} rates missing, total ${usd(r.totalUsd)} USD; ${r.basisOfTotal}`);
}
row('buildPumpPrice', 'the landed cost per litre', refused(FP.buildPumpPrice({ elements: BAD_ELEMENTS }), 'no landed'));
row('truckingEconomics', 'the distance', refused(FP.truckingEconomics({ ...F.IBAFO_LANE, distanceKm: null }), 'no distance'));
row('fleetSizing', 'the trips per truck', refused(FP.fleetSizing({ demandLitresPerDay: F.IBAFO_DEMAND_L_PER_DAY, payloadLitres: F.IBAFO_LANE.payloadLitres }), 'no trips'));
row('stationSizing', 'the nozzle count', refused(FP.stationSizing({ ...F.IBAFO_STATION, nozzles: null }), 'no nozzles'));

/* ------------------------------------------------------------------ */
section('THE AKODO STRAPPING TABLES');
out('Each tank\'s table lists a height in millimetres and a volume in cubic metres. volumeAtDip is linear between two entries. The vertical tanks\' tables are built from the tank geometry; the horizontal tank is a bullet whose volume is not linear in height.');
out('');
head('tank', 'product', 'shape', 'size', 'entries', 'step mm', 'first entry', 'last entry');
for (const t of tanks) {
  const size = t.shape === 'vertical' ? `diameter ${t.diameterM} m, strapped to ${t.topMm} mm` : `diameter ${t.diameterM} m, length ${t.lengthM} m`;
  const a = t.table[0]; const z = t.table[t.table.length - 1];
  row(t.id, t.product, t.shape, size, t.table.length, t.stepMm, `${a.heightMm} mm = ${m3(a.volumeM3)} m3`, `${z.heightMm} mm = ${m3(z.volumeM3)} m3`);
}
out('');
out('The table entries that bracket each morning dip, and the volume the engine interpolates between them:');
head('tank', 'dip mm', 'entry below', 'entry above', 'volumeAtDip m3');
for (const t of tanks) {
  const lo = [...t.table].reverse().find((p) => p.heightMm <= t.dipMm); const hi = t.table.find((p) => p.heightMm >= t.dipMm);
  const v = answered(TD.volumeAtDip({ strapping: t.table, heightMm: t.dipMm }), 'volumeM3', `${t.id} dip`);
  row(t.id, t.dipMm, `${lo.heightMm} mm = ${m3(lo.volumeM3)} m3`, `${hi.heightMm} mm = ${m3(hi.volumeM3)} m3`, m3(v));
}
out('');
{
  const fine = F.horizontalTable(AK3.diameterM, AK3.lengthM, 10);
  const coarse = answered(TD.volumeAtDip({ strapping: AK3.table, heightMm: AK3.dipMm }), 'volumeM3', 'AK-03 coarse');
  const exact = answered(TD.volumeAtDip({ strapping: fine, heightMm: AK3.dipMm }), 'volumeM3', 'AK-03 fine');
  const coarseW = answered(TD.volumeAtDip({ strapping: AK3.table, heightMm: AK3.waterMm }), 'volumeM3', 'AK-03 water coarse');
  const exactW = answered(TD.volumeAtDip({ strapping: fine, heightMm: AK3.waterMm }), 'volumeM3', 'AK-03 water fine');
  out(`AK-03 is a curve, and volumeAtDip draws a straight line between two entries. The same bullet strapped every 10 mm (${fine.length} entries) against its own table every ${AK3.stepMm} mm:`);
  head('height mm', 'volumeAtDip on the 100 mm table m3', 'volumeAtDip on the 10 mm table m3', 'the 100 mm table less the 10 mm table m3');
  row(AK3.dipMm, m3(coarse), m3(exact), m3(coarse - exact));
  row(AK3.waterMm, m3(coarseW), m3(exactW), m3(coarseW - exactW));
  out('The last column is computed from the unrounded volumes, so it can differ in the third decimal from the printed volume less the printed volume beside it. Quote the printed difference; do not recompute it from the rounded columns.');
  const vl = answered(TD.volumeAtDip({ strapping: AK1.table, heightMm: AK1.dipMm }), 'volumeM3', 'AK-01');
  const vf = answered(TD.volumeAtDip({ strapping: F.verticalTable(AK1.diameterM, AK1.topMm, 10), heightMm: AK1.dipMm }), 'volumeM3', 'AK-01 fine');
  out('');
  out(`AK-01 is a vertical cylinder, which is linear in height, so its ${AK1.stepMm} mm table and the same tank strapped every 10 mm agree at the dip to the litre: ${m3(vl)} m3 and ${m3(vf)} m3.`);
}

/* ------------------------------------------------------------------ */
section('WHERE A TABLE STOPS');
out(`AK-01's table runs from 0 mm to ${AK1.topMm} mm, and its first entry is the empty tank. The dip swept up it:`);
out('');
head('dip mm', 'the engine answers');
for (const d of F.AKODO_DIP_SWEEP) {
  const r = TD.volumeAtDip({ strapping: AK1.table, heightMm: d });
  row(plain(d), r.volumeM3 === null ? refused(r, `dip ${d}`) : `${m3(answered(r, 'volumeM3', `dip ${d}`))} m3`);
}
out('');
out(`A partial calibration: the same tank with a table that starts at ${F.AKODO_PARTIAL_TABLE[0].heightMm} mm, where the volume is ${m3(F.AKODO_PARTIAL_TABLE[0].volumeM3)} m3 and not the empty tank, and ends at ${F.AKODO_PARTIAL_TABLE[F.AKODO_PARTIAL_TABLE.length - 1].heightMm} mm. Dips and water cuts put to it through dipToStandardVolume:`);
head('dip mm (stated)', 'water mm (stated)', 'the engine answers');
for (const [d, w] of F.AKODO_PARTIAL_DIPS) {
  const r = TD.dipToStandardVolume({ strapping: F.AKODO_PARTIAL_TABLE, heightMm: d, waterMm: w, vcf: null });
  row(d, w, r.grossM3 === null ? refused(r, `partial ${d}/${w}`) : `gross ${m3(answered(r, 'grossM3', `partial ${d}`))} m3`);
}
out('');
out('The other two tanks dipped just above their own last entries:');
head('tank', 'last entry mm', 'dip mm (stated)', 'the engine answers');
for (const t of [AK2, AK3]) {
  const top = t.table[t.table.length - 1].heightMm;
  row(t.id, top, top + 10, refused(TD.volumeAtDip({ strapping: t.table, heightMm: top + 10 }), `${t.id} above`, 'volumeM3'));
}

/* ------------------------------------------------------------------ */
section('FREE WATER AND THE GROSS VOLUME');
out('Free water sits under the product. dipToStandardVolume converts the water cut through the SAME table and takes that volume off the total: gross observed volume = volume at the dip less volume at the water cut.');
out('');
out(`AK-02 dipped at ${AK2.dipMm} mm, with the water cut swept:`);
head('water mm', 'the engine answers');
for (const w of F.AKODO_WATER_SWEEP) {
  const r = TD.dipToStandardVolume({ strapping: AK2.table, heightMm: AK2.dipMm, waterMm: w, vcf: null });
  row(w, r.grossM3 === null ? refused(r, `water ${w}`) : `water ${m3(r.waterM3)} m3, gross ${m3(answered(r, 'grossM3', `water ${w}`))} m3`);
}
out('');
out('The morning at AKODO, tank by tank:');
head('tank', 'dip mm', 'water mm', 'volume at the dip m3', 'water m3', 'gross observed m3');
for (const { t, s } of stocks) {
  const total = TD.volumeAtDip({ strapping: t.table, heightMm: t.dipMm }).volumeM3;
  row(t.id, t.dipMm, t.waterMm, m3(total), m3(s.waterM3), m3(s.grossM3));
}
out(`total gross observed volume: ${m3(closingGross)} m3`);
out('The engine computes each gross volume, and the total, from the unrounded volumes, so a printed volume at the dip less the printed water can differ in the third decimal from the printed gross (AK-03). Quote the printed gross; no figure here is meant to be recomputed from the rounded columns.');
out('');
{
  const byHeight = answered(TD.volumeAtDip({ strapping: AK3.table, heightMm: AK3.dipMm - AK3.waterMm }), 'volumeM3', 'AK-03 by height');
  const byHeight1 = answered(TD.volumeAtDip({ strapping: AK1.table, heightMm: AK1.dipMm - AK1.waterMm }), 'volumeM3', 'AK-01 by height');
  out(`Subtracting heights first and reading the table once gives the volume at ${AK3.dipMm - AK3.waterMm} mm. On the bullet AK-03 that reads ${m3(byHeight)} m3 against the gross ${m3(stocks[2].s.grossM3)} m3, because the water fills the narrow bottom of a curved tank. On the vertical AK-01 the volume at ${AK1.dipMm - AK1.waterMm} mm reads ${m3(byHeight1)} m3 against the gross ${m3(stocks[0].s.grossM3)} m3.`);
}

/* ------------------------------------------------------------------ */
section('THE VOLUME CORRECTION FACTOR');
out('volumeCorrectionFactor computes the ASTM D1250 (API MPMS Chapter 11.1) FORM:');
out('alpha = K0 / rho^2 + K1 / rho + K2, and VCF = exp( -alpha x dT x (1 + 0.8 x alpha x dT) ), with rho the density at 15 C in kg/m3 and dT the observed temperature less 15 C.');
out('The coefficients K0, K1 and K2 are a published table per commodity group. The engine ships none and has no default, and this digest quotes none.');
out('');
out(`volumeCorrectionFactor with no coefficients: ${refused(TD.volumeCorrectionFactor({ densityKgM3: AK1.densityKgM3, temperatureC: AK1.temperatureC }), 'no coeff')}`);
out('');
out(`SYNTHETIC COEFFICIENTS, invented for this course and not any commodity group's published row: K0 = ${F.SYNTHETIC_COEFFICIENTS.k0}, K1 = ${F.SYNTHETIC_COEFFICIENTS.k1}, K2 = ${F.SYNTHETIC_COEFFICIENTS.k2}. They show the form only. No stock in this digest is corrected with them.`);
out('');
out(`The synthetic form at a density of ${AK1.densityKgM3} kg/m3, the temperature swept:`);
head('temperature C', 'alpha', 'VCF (synthetic)');
for (const T of F.AKODO_VCF_TEMPERATURES) {
  const r = TD.volumeCorrectionFactor({ densityKgM3: AK1.densityKgM3, temperatureC: T, coefficients: F.SYNTHETIC_COEFFICIENTS });
  row(T, alpha(r.alpha), vcf(answered(r, 'vcf', `T ${T}`)));
}
out('');
out(`The synthetic form at ${AK1.temperatureC} C, the density swept:`);
head('density kg/m3', 'alpha', 'VCF (synthetic)');
for (const rho of F.AKODO_VCF_DENSITIES) {
  const r = TD.volumeCorrectionFactor({ densityKgM3: rho, temperatureC: AK1.temperatureC, coefficients: F.SYNTHETIC_COEFFICIENTS });
  row(rho, alpha(r.alpha), vcf(answered(r, 'vcf', `rho ${rho}`)));
}
out('');
out('AKODO corrects its stock with a VCF read off its own tables for each tank\'s density and temperature, typed in. The typed figures are invented for the course. Standard volume = gross observed volume x VCF:');
head('tank', 'density kg/m3', 'temperature C', 'VCF typed', 'gross observed m3', 'standard m3');
for (const { t, s } of stocks) row(t.id, t.densityKgM3, t.temperatureC, vcf(s.vcf), m3(s.grossM3), m3(s.standardM3));
out(`total standard volume, the closing stock the day is closed on: ${m3(closingStd)} m3`);
out(`The total is summed from the unrounded standard volumes. The three printed standard volumes, each rounded to the litre, add to ${m3(stocks.reduce((a2, { s }) => a2 + Number(m3(s.standardM3)), 0))} m3; the day is closed on the unrounded total, printed above.`);

/* ------------------------------------------------------------------ */
section('CLOSING THE AKODO DAY');
out('reconcileStock: expected closing = opening + receipts - deliveries - known losses; unaccounted = dipped closing - expected closing; tolerance = a stated percent of throughput, and throughput = receipts + deliveries.');
out('');
const day = TD.reconcileStock({ ...DAY, closingDippedM3: closingStd });
head('item', 'value');
row('opening stock (yesterday\'s closing dip) m3', m3(DAY.openingM3));
row('receipts m3', m3(DAY.receiptsM3));
row('deliveries m3', m3(DAY.deliveriesM3));
row('known losses m3', m3(DAY.knownLossM3));
row('expected closing m3', m3(day.expectedClosingM3));
row('dipped closing (standard) m3', m3(day.dippedClosingM3));
row('unaccounted m3', m3(answered(day, 'unaccountedM3', 'akodo day')));
row('unaccounted percent of throughput', pct(day.unaccountedPercentOfThroughput));
row(`tolerance m3 (${DAY.tolerancePercentOfThroughput} percent of throughput)`, m3(day.toleranceM3));
row('within tolerance', day.withinTolerance);
row('direction', day.direction);
out(`throughput, receipts + deliveries: ${m3(DAY.receiptsM3 + DAY.deliveriesM3)} m3. The tolerance above is ${DAY.tolerancePercentOfThroughput} percent of it.`);
out('');
out(`With no opening stock: ${refused(TD.reconcileStock({ ...DAY, openingM3: undefined, closingDippedM3: closingStd }), 'no opening')}`);
out('');
out('A RECONCILIATION THAT CANNOT FAIL. Take the opening stock as today\'s closing dip less today\'s net movement, opening = closing dip - receipts + deliveries + known losses, and hand that to reconcileStock. The expected closing is then the dip itself, whatever the dip reads:');
head('closing dip m3', 'opening taken from it m3', 'expected closing m3', 'unaccounted m3', 'within tolerance', 'direction');
for (const c of [closingStd, ...F.AKODO_OTHER_CLOSINGS]) {
  const opening = c - DAY.receiptsM3 + DAY.deliveriesM3 + DAY.knownLossM3;
  const r = TD.reconcileStock({ ...DAY, openingM3: opening, closingDippedM3: c });
  row(m3(c), m3(opening), m3(r.expectedClosingM3), m3(r.unaccountedM3), r.withinTolerance, r.direction);
}
out('Every row balances, so none of them measured anything.');
out('');
{
  const g = TD.reconcileStock({ ...DAY, closingDippedM3: closingGross });
  out(`The same day closed on the GROSS closing stock (${m3(closingGross)} m3) against an opening stock held at standard: unaccounted ${m3(g.unaccountedM3)} m3, direction ${g.direction}, within tolerance ${g.withinTolerance}.`);
}
out('');
out('The tolerance percent swept on the same day:');
head('tolerance percent of throughput', 'tolerance m3', 'within tolerance');
for (const tp of F.AKODO_TOLERANCE_SWEEP) {
  const r = TD.reconcileStock({ ...DAY, closingDippedM3: closingStd, tolerancePercentOfThroughput: tp });
  row(tp, m3(r.toleranceM3), r.withinTolerance);
}
{
  const still = TD.reconcileStock({ openingM3: DAY.openingM3, closingDippedM3: DAY.openingM3 + 0.5, tolerancePercentOfThroughput: DAY.tolerancePercentOfThroughput });
  out(`A day with no receipts and no deliveries has no throughput and so no tolerance: opening ${m3(DAY.openingM3)} m3 dipped at ${m3(still.dippedClosingM3)} m3 reads unaccounted ${m3(still.unaccountedM3)} m3, tolerance ${m3(still.toleranceM3)} m3, within tolerance ${still.withinTolerance}, direction ${still.direction}.`);
}

/* ------------------------------------------------------------------ */
section('A RUN IN ONE DIRECTION');
{
  const tr = TD.trendUnaccounted(F.AKODO_HISTORY);
  out('trendUnaccounted keeps a running total of the daily unaccounted figures and counts the run of days in one direction that ends on the latest day.');
  out('');
  head('day', 'unaccounted m3', 'throughput m3', 'cumulative m3');
  tr.rows.forEach((r) => row(r.date, m3(r.unaccountedM3), m3(r.throughputM3), m3(r.cumulativeM3)));
  out('');
  out(`cumulative unaccounted: ${m3(tr.cumulativeM3)} m3; cumulative as a percent of cumulative throughput: ${pct(tr.meanPercent)}`);
  out(`run ending on the latest day: ${tr.runLength} days of ${tr.runDirection}`);
  out(`prompt: ${tr.prompt}`);
  out('');
  const short = TD.trendUnaccounted(F.AKODO_HISTORY.slice(0, 6));
  out(`The first six days alone: run ${short.runLength} days of ${short.runDirection}; prompt: ${plain(short.prompt)}.`);
  out(`cumulative throughput over the nine days, the denominator of the mean percent: ${m3(tr.rows.reduce((a2, r) => a2 + r.throughputM3, 0))} m3.`);
  out('The prompt threshold, read off the engine by trimming the history one day at a time:');
  head('days kept', 'run ending on the last kept day', 'prompt printed');
  for (const n of [5, 6, 7, 8, 9]) {
    const t = TD.trendUnaccounted(F.AKODO_HISTORY.slice(0, n));
    row(n, `${t.runLength} days of ${t.runDirection}`, t.prompt ? 'yes' : 'none');
  }
  const empty = TD.trendUnaccounted([]);
  out(`No days at all: cumulative ${m3(empty.cumulativeM3)} m3, run ${empty.runLength}, mean percent ${plain(empty.meanPercent)}.`);
}

/* ------------------------------------------------------------------ */
section('THE IBAFO RACK AS A QUEUE');
const rack = TD.rackQueue(F.IBAFO_RACK);
out('rackQueue models the loading rack as an M/M/c queue: trucks arrive at random at a mean rate, each takes a random time on the bay with a stated mean, and there are c bays. Offered load (erlangs) = arrivals per hour / (60 / load minutes); utilisation = offered load / bays; the probability that an arriving truck waits is Erlang C, which the engine builds from the Erlang B recursion; mean wait = Erlang C / (bays x service rate - arrivals).');
out('');
head('item', 'value');
row('arrivals per hour', F.IBAFO_RACK.arrivalsPerHour);
row('mean load minutes', F.IBAFO_RACK.loadMinutes);
row('bays', rack.bays);
row('offered load, erlangs', erl(rack.offered));
row('utilisation', util(rack.utilisation));
row('probability of waiting (Erlang C)', prob(answered(rack, 'probabilityOfWaiting', 'ibafo rack')));
row('mean wait, minutes', min(rack.averageWaitMinutes));
row('mean time on site, minutes', min(rack.averageTimeOnSiteMinutes));
row('mean queue length, trucks', qlen(rack.queueLength));
row('trucks per day at this arrival rate', rack.trucksPerDay);
out('');
out(`The mean wait of a truck that does queue is the mean wait over the probability of waiting: ${min(rack.averageWaitMinutes)} / ${prob(rack.probabilityOfWaiting)} = ${min(rack.averageWaitMinutes / rack.probabilityOfWaiting)} minutes. The engine's averageWaitMinutes averages over every truck, the ones that load at once included.`);
{
  const rho = rack.utilisation; const C = rack.probabilityOfWaiting;
  out(`Erlang B, the probability that every bay is busy in a rack with NO queue (a truck that finds every bay busy leaves), is not exported by the engine. From the engine's Erlang C by the identity B = C x (1 - utilisation) / (1 - utilisation x C) it is ${prob((C * (1 - rho)) / (1 - rho * C))} on the IBAFO rack, against the Erlang C of ${prob(C)}.`);
}
out(`Little's law, queue length = arrivals per hour x mean wait in hours: ${F.IBAFO_RACK.arrivalsPerHour} x ${min(rack.averageWaitMinutes)} / 60 = ${qlen(F.IBAFO_RACK.arrivalsPerHour * rack.averageWaitMinutes / 60)}, the engine's queue length is ${qlen(rack.queueLength)}.`);

/* ------------------------------------------------------------------ */
section('WAITING TIME AND THE BAY SWEEP');
out(`The IBAFO rack at ${F.IBAFO_RACK.arrivalsPerHour} arrivals an hour and ${F.IBAFO_RACK.loadMinutes} minutes a load, the bays swept:`);
head('bays', 'utilisation', 'stable', 'probability of waiting', 'mean wait minutes', 'mean queue trucks');
for (const b of F.IBAFO_BAY_SWEEP) {
  const r = TD.rackQueue({ ...F.IBAFO_RACK, bays: b });
  if (r.stable) row(b, util(r.utilisation), r.stable, prob(r.probabilityOfWaiting), min(r.averageWaitMinutes), qlen(r.queueLength));
  else row(b, util(r.utilisation), r.stable, prob(r.probabilityOfWaiting), 'none', 'none');
}
out('');
out('Inputs the engine refuses:');
head('arrivals per hour (stated)', 'load minutes (stated)', 'bays (stated)', 'the engine answers');
for (const q of F.IBAFO_RACK_REFUSALS) row(plain(q.arrivalsPerHour), plain(q.loadMinutes), plain(q.bays), refused(TD.rackQueue(q), `rack ${JSON.stringify(q)}`));
row(F.IBAFO_RACK.arrivalsPerHour, 0, F.IBAFO_RACK.bays, refused(TD.rackQueue({ ...F.IBAFO_RACK, loadMinutes: 0 }), 'rack zero load', 'averageWaitMinutes'));
out('');
out(`The IBAFO rack at ${F.IBAFO_RACK.arrivalsPerHour} arrivals an hour on its ${F.IBAFO_RACK.bays} bays, the mean load minutes swept:`);
head('load minutes (stated)', 'utilisation', 'probability of waiting', 'mean wait minutes', 'Erlang B, derived from the Erlang C');
for (const lm of [16, 20, 22, 24, 26]) {
  const r = TD.rackQueue({ ...F.IBAFO_RACK, loadMinutes: lm });
  row(lm, util(r.utilisation), prob(r.probabilityOfWaiting), min(r.averageWaitMinutes), prob((r.probabilityOfWaiting * (1 - r.utilisation)) / (1 - r.utilisation * r.probabilityOfWaiting)));
}

/* ------------------------------------------------------------------ */
section('A RACK THAT CANNOT KEEP UP');
out(`The IBAFO rack with its ${F.IBAFO_RACK.bays} bays and ${F.IBAFO_RACK.loadMinutes} minute loads, the arrivals swept:`);
head('arrivals per hour', 'offered load erlangs', 'utilisation', 'the engine answers');
for (const a of F.IBAFO_ARRIVAL_SWEEP) {
  const r = TD.rackQueue({ ...F.IBAFO_RACK, arrivalsPerHour: a });
  row(a, erl(r.offered), util(r.utilisation), r.stable
    ? `probability of waiting ${prob(r.probabilityOfWaiting)}, mean wait ${min(r.averageWaitMinutes)} minutes`
    : `stable ${r.stable}, probability of waiting ${prob(r.probabilityOfWaiting)}, mean wait ${plain(r.averageWaitMinutes)}; ${refused(r, `arrivals ${a}`)}`);
}

/* ------------------------------------------------------------------ */
section('THE IBAFO TANK FARM');
const farm = TD.tankFarmCover({ tanks: F.IBAFO_TANKS, dailyThroughputM3: F.IBAFO_DAILY_M3 });
out('tankFarmCover: working capacity = capacity less heel; pumpable stock and ullage are counted TANK BY TANK, each tank\'s pumpable stock being its stock above its own heel and never below zero; days of cover = pumpable stock / daily throughput; turns a year = daily throughput x 365 / working capacity.');
out('');
head('tank', 'capacity m3', 'heel m3', 'stock m3', 'pumpable m3', 'ullage m3');
for (const t of F.IBAFO_TANKS) {
  const one = TD.tankFarmCover({ tanks: [t], dailyThroughputM3: F.IBAFO_DAILY_M3 });
  row(t.id, m3(t.capacityM3), m3(t.heelM3), m3(t.stockM3), m3(one.pumpableStockM3), m3(one.ullageM3));
}
out('');
head('the farm', 'value');
row('capacity m3', m3(farm.capacityM3));
row('heel m3', m3(farm.heelM3));
row('working capacity m3', m3(farm.workingCapacityM3));
row('stock m3', m3(farm.stockM3));
row('pumpable stock m3', m3(farm.pumpableStockM3));
row('ullage m3', m3(farm.ullageM3));
row('daily throughput (liftings) m3', m3(F.IBAFO_DAILY_M3));
row('days of cover', days(farm.daysOfCover));
row('turns a year', turns(farm.turnsPerYear));
out('');
out('Ullage is counted the same way: each tank\'s capacity less its stock, never below zero, summed over the tanks.');
{
  const nod = TD.tankFarmCover({ tanks: F.IBAFO_TANKS });
  out(`With no daily throughput the engine gives days of cover ${plain(nod.daysOfCover)} and turns a year ${plain(nod.turnsPerYear)}: both need the throughput.`);
}
out(`The farm's stock less the farm's heel is ${m3(farm.stockM3 - farm.heelM3)} m3. That is not pumpable stock: IB-T2 holds ${m3(F.IBAFO_TANKS[1].stockM3)} m3 against a heel of ${m3(F.IBAFO_TANKS[1].heelM3)} m3, and no pump lends one tank's volume to another's heel.`);

/* ------------------------------------------------------------------ */
section('THROUGHPUT ECONOMICS AND THE CARBON LEDGER');
out('throughputEconomics: revenue = throughput x fee; margin = revenue - throughput x variable cost - fixed cost. Money here is in US dollars. The loss weighs loss m3 x density / 1000 tonnes, and emissions = loss tonnes x an emission factor the caller supplies. The engine ships no emission factor.');
out(`The factor used below is SYNTHETIC, ${F.SYNTHETIC_LOSS_FACTOR_KG_PER_T} kg CO2e a tonne, invented for this course and not a published figure.`);
out('');
{
  const E = F.IBAFO_ECONOMICS;
  const cases = [
    ['factor and density supplied', { ...E, lossEmissionFactorKgCo2ePerTonne: F.SYNTHETIC_LOSS_FACTOR_KG_PER_T }],
    ['no emission factor', { ...E }],
    ['no density', { ...E, productDensityKgM3: null, lossEmissionFactorKgCo2ePerTonne: F.SYNTHETIC_LOSS_FACTOR_KG_PER_T }],
  ];
  out(`IBAFO: throughput ${m3(E.throughputM3)} m3, fee ${usd(E.feePerM3)} USD/m3, variable cost ${usd(E.variableCostPerM3)} USD/m3, fixed cost ${usd(E.fixedCostPerPeriod)} USD for the period, loss ${m3(E.lossM3)} m3, density ${E.productDensityKgM3} kg/m3.`);
  head('case', 'revenue USD', 'margin USD', 'margin USD/m3', 'loss tonnes', 'emissions kg CO2e', 'kg CO2e per tonne of throughput', 'carbon note');
  for (const [name, args] of cases) {
    const r = TD.throughputEconomics(args);
    row(name, usd(r.revenue), usd(r.margin), usd(r.marginPerM3), r.lossTonnes === null ? 'none' : t4(r.lossTonnes),
      r.emissionsKgCo2e === null ? 'none' : kg(r.emissionsKgCo2e), r.kgCo2ePerTonneThroughput === null ? 'none' : share(r.kgCo2ePerTonneThroughput), plain(r.carbonNote));
  }
  out('');
  out('The money answer needs the throughput and the fee; a blank cost or loss is taken as zero and named:');
  head('what is blank', 'the engine answers');
  row('the throughput', refused(TD.throughputEconomics({ ...E, throughputM3: '' }), 'blank throughput', 'margin'));
  row('the fee', refused(TD.throughputEconomics({ ...E, feePerM3: null }), 'blank fee', 'margin'));
  {
    const r = TD.throughputEconomics({ ...E, fixedCostPerPeriod: '' });
    row('the fixed cost', `margin ${usd(r.margin)} USD; assumedZero: ${r.assumedZero.join(', ')}`);
    const r2 = TD.throughputEconomics({ ...E });
    row('nothing', `margin ${usd(r2.margin)} USD; assumedZero: ${r2.assumedZero.length ? r2.assumedZero.join(', ') : 'none'}`);
  }
}

/* ------------------------------------------------------------------ */
section('THE IBAFO LANE');
const lane = FP.truckingEconomics(F.IBAFO_LANE);
out('truckingEconomics: the cycle = round trip / average speed + load + discharge + queue hours; trips a truck a day = working hours / cycle; the truck\'s capital is spread over the trips a year that cycle allows; cost per litre delivered = cost per trip / the litres delivered after the transit loss. Money here is in naira; every cost is invented for this course.');
out('');
out(`IBAFO to a station cluster ${km(F.IBAFO_LANE.distanceKm)} km away, a ${lit(F.IBAFO_LANE.payloadLitres)} litre payload, ${F.IBAFO_LANE.averageSpeedKmh} km/h average, ${F.IBAFO_LANE.loadHours} h to load, ${F.IBAFO_LANE.dischargeHours} h to discharge, ${F.IBAFO_LANE.queueHours} h queueing, ${F.IBAFO_LANE.workingHoursPerDay} working hours a day and ${F.IBAFO_LANE.workingDaysPerYear} days a year, a transit loss of ${F.IBAFO_LANE.transitLossPercent} percent.`);
head('item', 'value');
row('complete', lane.complete);
row('round trip km', km(lane.roundTripKm));
row('cycle hours', hrs(lane.cycleHours));
row('trips a truck a day', trips(lane.tripsPerTruckPerDay));
row('trips a truck a year', lane.tripsPerTruckPerYear.toFixed(4));
lane.components.forEach((c) => row(`${c.label}, naira a trip`, c.amount === null ? 'none' : c.amount.toFixed(2)));
row('cost a trip, naira', lane.costPerTrip.toFixed(2));
row('litres delivered a trip', lit(lane.deliveredLitresPerTrip));
row('cost per litre delivered, naira', locL(answered(lane, 'costPerLitreDelivered', 'ibafo lane')));
row('diesel litres a trip', lit(lane.dieselLitresPerTrip));
row('kg CO2e a trip', plain(lane.kgCo2ePerTrip));
row('carbon note', lane.carbonNote);
out('');
out('A cost box left BLANK is a missing cost and is named; a cost left OUT of the call takes the default the signature states:');
head('the driver cost', 'complete', 'missing inputs', 'cost a trip, naira', 'cost per litre delivered, naira');
for (const [label, args] of [['typed', F.IBAFO_LANE], ['blank', { ...F.IBAFO_LANE, driverCostPerTrip: '' }], ['null', { ...F.IBAFO_LANE, driverCostPerTrip: null }], ['left out of the call', Object.fromEntries(Object.entries(F.IBAFO_LANE).filter(([k]) => k !== 'driverCostPerTrip'))]]) {
  const r = FP.truckingEconomics(args);
  row(label, r.complete, r.missingInputs.length ? r.missingInputs.join(', ') : 'none', r.costPerTrip.toFixed(2), locL(r.costPerLitreDelivered));
}
{
  const r = FP.truckingEconomics({ ...F.IBAFO_LANE, truckCapitalCost: null });
  out(`With no truck capital cost: complete ${r.complete}, missing ${r.missingInputs.join(', ')}, cost per litre delivered ${locL(r.costPerLitreDelivered)} naira, which is a floor.`);
}
out('');
out(`driverCostPerTrip defaults to 0 in the engine's signature, which is why the row with the driver cost left out of the call reads the same cost a trip as the blank row and still reads complete ${FP.truckingEconomics(Object.fromEntries(Object.entries(F.IBAFO_LANE).filter(([k]) => k !== 'driverCostPerTrip'))).complete}.`);
out('');
out('The same lane at three distances:');
head('distance km', 'cycle hours', 'trips a truck a day', 'cost a trip, naira', 'cost per litre delivered, naira');
for (const d of [156, 312, 468]) {
  const r = FP.truckingEconomics({ ...F.IBAFO_LANE, distanceKm: d });
  row(km(d), hrs(r.cycleHours), trips(r.tripsPerTruckPerDay), r.costPerTrip.toFixed(2), locL(r.costPerLitreDelivered));
}
out('');
out('The cost lines at each distance, naira a trip:');
head('distance km', ...lane.components.map((c) => c.label));
for (const d of [156, 312, 468]) {
  const r = FP.truckingEconomics({ ...F.IBAFO_LANE, distanceKm: d });
  row(km(d), ...r.components.map((c) => c.amount.toFixed(2)));
}

/* ------------------------------------------------------------------ */
section('THE FLEET');
out('fleetSizing: trips needed a day = demand / payload; trucks = the ceiling of trips needed / trips a truck a day; the spare capacity the ceiling buys is reported.');
out('');
{
  const fl = FP.fleetSizing({ demandLitresPerDay: F.IBAFO_DEMAND_L_PER_DAY, payloadLitres: F.IBAFO_LANE.payloadLitres, tripsPerTruckPerDay: lane.tripsPerTruckPerDay });
  head('item', 'value');
  row('demand litres a day', lit(F.IBAFO_DEMAND_L_PER_DAY));
  row('payload litres', lit(F.IBAFO_LANE.payloadLitres));
  row('trips a truck a day (from the lane)', trips(lane.tripsPerTruckPerDay));
  row('trips needed a day', trips(fl.tripsNeededPerDay));
  row('trucks required', answered(fl, 'trucksRequired', 'ibafo fleet'));
  row('fleet trip capacity a day', trips(fl.fleetTripCapacityPerDay));
  row('fleet utilisation', util(fl.utilisation));
  row('spare trips a day', trips(fl.spareTripsPerDay));
  row('spare litres a day', lit(fl.spareLitresPerDay));
  out('');
  out('The demand swept on the same lane:');
  head('demand litres a day', 'trips needed a day', 'trucks required', 'fleet utilisation');
  for (const dmd of [330000, 660000, 1260000, 1980000]) {
    const r = FP.fleetSizing({ demandLitresPerDay: dmd, payloadLitres: F.IBAFO_LANE.payloadLitres, tripsPerTruckPerDay: lane.tripsPerTruckPerDay });
    row(lit(dmd), trips(r.tripsNeededPerDay), r.trucksRequired, util(r.utilisation));
  }
  out(`With no demand: ${refused(FP.fleetSizing({ payloadLitres: F.IBAFO_LANE.payloadLitres, tripsPerTruckPerDay: lane.tripsPerTruckPerDay }), 'no demand')}`);
}

/* ------------------------------------------------------------------ */
section('THE STATION');
{
  const S = F.IBAFO_STATION;
  const st = FP.stationSizing(S);
  out('stationSizing: transactions a day = throughput / litres a transaction; the peak hour carries a stated share of them; service minutes = litres a transaction / dispense rate + an overhead; the forecourt queue is rackQueue with nozzles for bays. Tankage: usable = capacity less dead stock; reorder level = dead stock + usable x the reorder fraction; ullage at reorder = capacity less the reorder level, which a delivery must fit into.');
  out('');
  out(`The IBAFO forecourt: ${lit(S.dailyThroughputLitres)} litres a day, peak share ${S.peakHourShare}, ${S.litresPerTransaction} litres a transaction, ${S.dispenseRateLitresPerMinute} litres a minute, ${S.transactionOverheadMinutes} minutes overhead, ${S.nozzles} nozzles, a ${lit(S.tankCapacityLitres)} litre tank with ${lit(S.deadStockLitres)} litres dead stock, reorder at ${S.reorderAtFraction} of usable, deliveries of ${lit(S.deliveryPayloadLitres)} litres.`);
  head('item', 'value');
  row('transactions a day', st.transactionsPerDay.toFixed(1));
  row('peak transactions an hour', st.peakTransactionsPerHour.toFixed(2));
  row('service minutes a transaction', st.serviceMinutesPerTransaction.toFixed(3));
  row('forecourt utilisation', util(st.queue.utilisation));
  row('forecourt probability of waiting', st.queue.stable ? prob(st.queue.probabilityOfWaiting) : 'none');
  row('forecourt mean wait, minutes', st.queue.stable ? min(st.queue.averageWaitMinutes) : 'none');
  row('usable tank litres', lit(st.usableTankLitres));
  row('cover days', st.coverDays.toFixed(2));
  row('reorder level litres', lit(st.reorderLevelLitres));
  row('ullage at reorder litres', lit(st.ullageAtReorderLitres));
  row('payload fits the ullage', st.payloadFitsUllage);
  out('cover days = usable tank litres / litres a day. The engine rounds cover days to two decimals, so it prints to two here and not to the four of the header.');
  out(`The forecourt's delivery of ${lit(S.deliveryPayloadLitres)} litres is the IBAFO lane's payload (SECTION 14), and stationSizing checks the payload loaded. The lane delivers ${lit(lane.deliveredLitresPerTrip)} litres a trip after its transit loss; the station's check does not use that figure.`);
  row('ullage warning', plain(st.ullageWarning));
  out('');
  out('The nozzles swept at the same peak:');
  head('nozzles', 'utilisation', 'stable', 'probability of waiting', 'mean wait minutes');
  for (const n of F.IBAFO_NOZZLE_SWEEP) {
    const q = FP.stationSizing({ ...S, nozzles: n }).queue;
    row(n, util(q.utilisation), q.stable, prob(q.probabilityOfWaiting), q.stable ? min(q.averageWaitMinutes) : 'none');
  }
  out('');
  out('The reorder fraction swept against the same delivery:');
  head('reorder at fraction of usable', 'reorder level litres', 'ullage at reorder litres', 'payload fits', 'warning');
  for (const fr of F.IBAFO_REORDER_SWEEP) {
    const r = FP.stationSizing({ ...S, reorderAtFraction: fr });
    row(fr, lit(r.reorderLevelLitres), lit(r.ullageAtReorderLitres), r.payloadFitsUllage, plain(r.ullageWarning));
  }
}

/* ------------------------------------------------------------------ */
section('ONE CARGO EVERY WAY');
out(`cargoQuantities expresses one cargo in m3, litres, tonnes and barrels. m3 = tonnes x 1000 / density; litres = m3 x ${FP.LITRES_PER_M3}; barrels = m3 / ${FP.M3_PER_BBL}. Density is required and never assumed.`);
out('');
out(`The BADAGRY cargo at ${BC.densityKgM3} kg/m3, entered in each unit the trade quotes:`);
head('quantity (stated)', 'unit (stated)', 'm3', 'litres', 'tonnes', 'barrels');
for (const [q, u] of F.BADAGRY_QUANTITY_UNITS) {
  const r = FP.cargoQuantities({ quantity: q, unit: u, densityKgM3: BC.densityKgM3 });
  if (r.error) row(q, u, refused(r, `unit ${u}`), '', '', '');
  else row(q, u, m3(r.m3), lit(r.litres), t4(r.tonnes), bbl(r.bbl));
}
out('');
{
  const ref = FP.PRODUCT_REFERENCE;
  out(`The same ${BC.quantity} tonnes at each typical density in PRODUCT_REFERENCE, to show what a wrong density moves:`);
  head('product', 'density kg/m3', 'm3', 'litres');
  for (const p of ref) {
    const r = FP.cargoQuantities({ quantity: BC.quantity, unit: 'tonne', densityKgM3: p.typicalDensityKgM3 });
    row(p.code, p.typicalDensityKgM3, m3(r.m3), lit(r.litres));
  }
}
out(`A zero quantity: ${refused(FP.cargoQuantities({ quantity: 0, unit: 'tonne', densityKgM3: BC.densityKgM3 }), 'zero')}`);

/* ------------------------------------------------------------------ */
section('THE BADAGRY LANDED COST WALK');
out('landedCost walks the stages in order: FOB, then freight (C&F), then insurance (CIF), then the landed charges. Each charge names the base it bites on, and a base is frozen when the walk reaches it. Insurance quoted as a percent of CIF is part of the value it is charged on, so the engine solves it in closed form: CIF = (C&F + any other insurance) / (1 - the sum of the CIF rates).');
out('');
out(`The BADAGRY cargo: ${BC.quantity} tonnes of PMS at ${BC.densityKgM3} kg/m3, FOB ${usd(BC.fobPrice)} USD a tonne, ocean loss ${BC.oceanLossPercent} percent, ${fx(BC.fxRate)} naira to the dollar. Every rate below is INVENTED for this course:`);
head('line', 'basis', 'rate (invented)');
FP.IMPORT_TEMPLATE.forEach((c) => row(c.label, c.id === 'insurance' ? 'percent_of_cif' : c.basis, F.BADAGRY_RATES[c.id]));
out('');
const lcCf = landed(chargesWith(F.BADAGRY_RATES));
const walkTable = (r) => {
  head('stage', 'line', 'basis', 'amount USD', 'USD per outturn litre');
  r.lines.forEach((l) => row(l.stage, l.label, l.basis, usd(l.amount), usdL(l.perLitre)));
};
out('Insurance quoted on CIF, the usual marine quote, and the case the rest of this digest prices:');
walkTable(badLanded);
out(`FOB ${usd(badLanded.fob)} USD; C&F ${usd(badLanded.cf)} USD; CIF ${usd(badLanded.cif)} USD; landed total ${usd(badLanded.totalUsd)} USD; complete ${badLanded.complete}; ${badLanded.basisOfTotal}`);
out('');
out('The same rates with insurance quoted on C&F, as the template ships its basis:');
head('item', 'insurance on CIF', 'insurance on C&F');
row('insurance USD', usd(badLanded.lines.find((l) => l.key === 'insurance').amount), usd(lcCf.lines.find((l) => l.key === 'insurance').amount));
row('CIF USD', usd(badLanded.cif), usd(lcCf.cif));
row('import duty USD', usd(badLanded.lines.find((l) => l.key === 'duty').amount), usd(lcCf.lines.find((l) => l.key === 'duty').amount));
row('landed total USD', usd(badLanded.totalUsd), usd(lcCf.totalUsd));
out('');
out('What the walk refuses:');
head('the charge', 'the engine answers');
row('freight typed as a percent of CIF', refused(landed(chargesWith(F.BADAGRY_RATES, { freight: { basis: FP.CHARGE_BASIS.PERCENT_OF_CIF, amount: 4 } })), 'forward'));
row('freight typed as a percent of C&F', refused(landed(chargesWith(F.BADAGRY_RATES, { freight: { basis: FP.CHARGE_BASIS.PERCENT_OF_CF, amount: 4 } })), 'forward cf'));
row('a charge with the stage "customs"', refused(landed([...chargesWith(F.BADAGRY_RATES, onCif), { id: 'extra', label: 'Customs processing', basis: 'per_tonne', stage: 'customs', amount: 0.5 }]), 'unknown stage'));
row('insurance on CIF at 100 percent', refused(landed(chargesWith({ ...F.BADAGRY_RATES, insurance: 100 }, onCif)), 'hundred'));
out('');
{
  const floor = landed(chargesWith({ ...F.BADAGRY_RATES, duty: null, finance: null }, onCif));
  out(`With the duty and the financing rate left blank the build-up is not complete: complete ${floor.complete}; missing ${floor.missingRates.join(', ')}; total ${usd(floor.totalUsd)} USD. ${floor.basisOfTotal}`);
  const none = landed(chargesWith({}, onCif));
  out(`With every rate blank: complete ${none.complete}; ${none.missingRates.length} missing; total ${usd(none.totalUsd)} USD, the FOB alone. ${none.basisOfTotal}`);
  out(`The full build-up less the floor with the duty and the financing rate blank: ${usd(badLanded.totalUsd)} - ${usd(floor.totalUsd)} = ${usd(Number(usd(badLanded.totalUsd)) - Number(usd(floor.totalUsd)))} USD.`);
  const zero = landed(chargesWith({ ...F.BADAGRY_RATES, duty: 0 }, onCif));
  const blankDuty = landed(chargesWith({ ...F.BADAGRY_RATES, duty: '' }, onCif));
  out(`A rate typed 0 is a rate: with the duty typed 0 the build-up is complete ${zero.complete}, total ${usd(zero.totalUsd)} USD. With the duty left blank it is complete ${blankDuty.complete}, missing ${blankDuty.missingRates.join(', ')}, total ${usd(blankDuty.totalUsd)} USD. ${blankDuty.basisOfTotal}`);
}

/* ------------------------------------------------------------------ */
section('OCEAN LOSS AND THE LITRE SOLD');
out('The importer pays for the bill-of-lading quantity and sells the outturn: outturn = bill-of-lading x (1 - ocean loss / 100), and cost per litre sold = the landed total / the outturn litres. The loss divides the cost. The landed total stays the same and the litres it is spread over fall.');
out('');
out(`The BADAGRY cargo, insurance on CIF, the ocean loss swept (bill of lading ${lit(badLanded.quantities.litres)} litres):`);
head('ocean loss percent', 'outturn litres', 'landed total USD', 'USD per litre sold', 'naira per litre sold');
for (const lp of F.BADAGRY_LOSS_SWEEP) {
  const r = landed(chargesWith(F.BADAGRY_RATES, onCif), { oceanLossPercent: lp });
  row(lp, lit(r.outturn.litres), usd(r.totalUsd), usdL(r.perLitreUsd), locL(r.perLitreLocal));
}
out('');
out('An ocean loss left blank is a missing rate, so the build-up is not complete and the landed total is a floor. A loss left out of the call takes the 0 the signature states. A loss of 100 percent or more, or below 0, is refused:');
head('ocean loss (stated)', 'the engine answers');
{
  const lossRow = (v, label) => {
    const r = landed(chargesWith(F.BADAGRY_RATES, onCif), { oceanLossPercent: v });
    if (r.error) { row(label, refused(r, `loss ${label}`)); return r; }
    row(label, `complete ${r.complete}; missing ${r.missingRates.length ? r.missingRates.join(', ') : 'none'}; outturn ${lit(r.outturn.litres)} litres; landed total ${usd(r.totalUsd)} USD; USD per litre sold ${usdL(r.perLitreUsd)}; ${r.basisOfTotal}`);
    return r;
  };
  const b = lossRow('', 'blank');
  lossRow(null, 'null');
  const o = lossRow(undefined, 'left out of the call');
  lossRow(100, '100');
  lossRow(120, '120');
  lossRow(-0.5, '-0.5');
  const zero = landed(chargesWith(F.BADAGRY_RATES, onCif), { oceanLossPercent: 0 });
  out(`The blank row spreads the landed total over the bill-of-lading litres, as the 0 percent row does: its USD per litre sold equals the 0 percent row's: ${b.perLitreUsd === zero.perLitreUsd}. The row left out of the call reads the 0 percent row's USD per litre sold: ${o.perLitreUsd === zero.perLitreUsd}, and complete ${o.complete}.`);
}
out('');
out(`The exchange rate enters once, at the end: naira per litre sold = USD per litre sold x ${fx(BC.fxRate)}. With no exchange rate the local figure is ${plain(landed(chargesWith(F.BADAGRY_RATES, onCif), { fxRate: null }).perLitreLocal)}.`);
out('');
{
  const jetty = badLanded.lines.find((l) => l.key === 'jetty'); const storage = badLanded.lines.find((l) => l.key === 'storage');
  out(`HELD (FINDINGS-supply H1): the charges levied at discharge are billed on the bill-of-lading quantity. The jetty line is ${usd(jetty.amount)} USD and the storage line ${usd(storage.amount)} USD, each on ${m3(badLanded.quantities.m3)} m3 on the bill of lading, where the outturn is ${m3(badLanded.outturn.m3)} m3. Whether a terminal bills on the bill of lading or on the outturn is a contract term the engine does not know.`);
  const reg = badLanded.lines.find((l) => l.key === 'regulator'); const port = badLanded.lines.find((l) => l.key === 'port');
  out(`Every charge quoted per quantity is charged on the bill-of-lading quantity, the per-litre regulatory line included: ${usd(reg.amount)} USD on ${lit(badLanded.quantities.litres)} bill-of-lading litres, and the port line ${usd(port.amount)} USD on ${t4(badLanded.quantities.tonnes)} bill-of-lading tonnes. H1 names the discharge charges; the same contract question applies to any line charged per quantity, and the engine answers every one on the bill of lading.`);
}

/* ------------------------------------------------------------------ */
section('THE PUMP PRICE BUILD-UP');
out('buildPumpPrice applies each element in order onto a running subtotal, starting from the landed cost per litre at the depot gate, so the result is a waterfall: a per-litre element adds its amount, a percent of the running total adds that percent of everything above it, and the lines reconcile to the price.');
out('');
out(`The BADAGRY build-up on its landed cost of ${locL(badLanded.perLitreLocal)} naira a litre. Every element is INVENTED for this course:`);
head('element', 'recipient', 'basis', 'rate (invented)', 'amount naira/L', 'running naira/L', 'share of price');
badPump.lines.forEach((l) => row(l.label, plain(l.recipient), l.basis, plain(l.rate), locL(l.amount), locL(l.running), share(l.share)));
out(`pump price ${locL(answered(badPump, 'pricePerLitre', 'badagry pump'))} naira a litre; complete ${badPump.complete}; ${badPump.basisOfPrice}`);
out('');
out(`Against a cap of ${locL(F.BADAGRY_CAP)} naira a litre: shortfall ${locL(badPump.shortfallPerLitre)} naira a litre (positive would mean the cap is below the chain's cost); the cap covers the chain: ${badPump.capCoversChain}.`);
{
  const low = FP.buildPumpPrice({ landedPerLitre: badLanded.perLitreLocal, elements: BAD_ELEMENTS, capPerLitre: F.BADAGRY_LOW_CAP });
  out(`Against a cap of ${locL(F.BADAGRY_LOW_CAP)} naira a litre: shortfall ${locL(low.shortfallPerLitre)} naira a litre; the cap covers the chain: ${low.capCoversChain}.`);
  const vatLanded = FP.buildPumpPrice({ landedPerLitre: badLanded.perLitreLocal, elements: BAD_ELEMENTS.map((e) => (e.id === 'vat' ? { ...e, basis: FP.PRICE_ELEMENT_BASIS.PERCENT_OF_LANDED } : e)) });
  out(`The same ${F.BADAGRY_ELEMENTS.vat} percent typed as a percent of the landed cost instead of the running total: price ${locL(vatLanded.pricePerLitre)} naira a litre.`);
  out(`That build-up is complete ${vatLanded.complete}: the basis changes the amount, and every rate is still supplied.`);
  const floor = FP.buildPumpPrice({ landedPerLitre: badLanded.perLitreLocal, elements: elementsWith({ ...F.BADAGRY_ELEMENTS, dealer: null, levies: null }) });
  out(`With the dealer margin and the levies left blank: complete ${floor.complete}; missing ${floor.missingRates.join(', ')}; price ${locL(floor.pricePerLitre)} naira a litre. ${floor.basisOfPrice}`);
}

/* ------------------------------------------------------------------ */
section('WHERE THE MONEY IN A LITRE GOES');
{
  const w = FP.marginWaterfall(badPump);
  out('marginWaterfall groups the build-up by recipient, largest first. An element with no recipient is grouped as Unattributed.');
  out('');
  head('recipient', 'naira per litre', 'share of price', 'elements');
  w.groups.forEach((g) => row(g.recipient, locL(g.amountPerLitre), share(g.share), g.lines.join('; ')));
  out(`price ${locL(w.pricePerLitre)} naira a litre`);
  out('');
  const unattr = FP.marginWaterfall(FP.buildPumpPrice({ landedPerLitre: badLanded.perLitreLocal, elements: BAD_ELEMENTS.map((e) => (e.id === 'bridging' ? { ...e, recipient: undefined } : e)) }));
  const u = unattr.groups.find((g) => g.recipient === 'Unattributed');
  out(`The bridging element with its recipient removed is grouped as ${u.recipient}: ${locL(u.amountPerLitre)} naira a litre.`);
  out(`marginWaterfall on a refused build-up: ${refused(FP.marginWaterfall(FP.buildPumpPrice({ elements: BAD_ELEMENTS })), 'waterfall refused')}`);
}

/* ------------------------------------------------------------------ */
section('WHAT BREAKS THE PRICE');
out('priceSensitivity re-prices the whole chain at each value of one driver, here the exchange rate, and solveCrossing bisects for the value at which the price meets the cap. If the price does not cross the cap inside the range searched, the engine says so and returns no value.');
out('');
{
  const s = FP.priceSensitivity({ price: priceAtFx, values: F.BADAGRY_FX_VALUES, capPerLitre: F.BADAGRY_CAP });
  out(`The BADAGRY chain against a cap of ${locL(F.BADAGRY_CAP)} naira a litre:`);
  head('naira to the dollar', 'pump price naira/L', 'shortfall naira/L', 'cap covers');
  s.points.forEach((p) => row(fx(p.value), locL(p.pricePerLitre), locL(p.shortfallPerLitre), p.covered));
  out(`breakeven: found ${s.breakeven.found}, at ${fx(answered(s.breakeven, 'value', 'badagry breakeven'))} naira to the dollar, after ${s.breakeven.iterations} bisection steps.`);
  out(`The exchange rates swept are invented values for the course. priceSensitivity hands solveCrossing the bracket from the lowest to the highest value swept, here ${fx(Math.min(...F.BADAGRY_FX_VALUES))} to ${fx(Math.max(...F.BADAGRY_FX_VALUES))} naira to the dollar.`);
  out('');
  out('The chain at each exchange rate, element by element:');
  head('naira to the dollar', 'landed naira/L', 'Government naira/L', 'pump price naira/L');
  for (const v of F.BADAGRY_FX_VALUES) {
    const l = landed(chargesWith(F.BADAGRY_RATES, onCif), { fxRate: v });
    const pp = FP.buildPumpPrice({ landedPerLitre: l.perLitreLocal, elements: BAD_ELEMENTS });
    const g = FP.marginWaterfall(pp).groups.find((x) => x.recipient === 'Government');
    row(fx(v), locL(l.perLitreLocal), locL(g.amountPerLitre), locL(pp.pricePerLitre));
  }
  out('');
  const n = FP.priceSensitivity({ price: priceAtFx, values: F.BADAGRY_FX_NARROW, capPerLitre: F.BADAGRY_CAP });
  out(`Searched only from ${F.BADAGRY_FX_NARROW[0]} to ${F.BADAGRY_FX_NARROW[F.BADAGRY_FX_NARROW.length - 1]}: found ${n.breakeven.found}; ${refused(n.breakeven, 'narrow')} The shortfall at the two ends: ${locL(n.breakeven.atLo)} and ${locL(n.breakeven.atHi)} naira a litre.`);
  out(`solveCrossing over a bracket written backwards (${F.BADAGRY_FX_VALUES[6]} to ${F.BADAGRY_FX_VALUES[0]}): ${refused(FP.solveCrossing({ evaluate: (x) => priceAtFx(x) - F.BADAGRY_CAP, lo: F.BADAGRY_FX_VALUES[6], hi: F.BADAGRY_FX_VALUES[0] }), 'backwards')}`);
  const nc = FP.priceSensitivity({ price: priceAtFx, values: F.BADAGRY_FX_VALUES });
  out(`With no cap there is nothing to cross: breakeven ${plain(nc.breakeven)}.`);
}

/* ------------------------------------------------------------------ */
section('WHAT IS HELD AND WHAT IS DECIDED');
out('Held by the engines repository (FINDINGS-supply), taught as limits and never graded:');
out('H1: the charges levied at discharge (jetty, storage) are billed on the bill-of-lading quantity; whether a terminal bills on the bill of lading or on the outturn is a contract term the engine does not know (SECTION 19 prints the two quantities).');
out(`H2: the volume correction coefficient tables and every published rate stay unshipped. volumeCorrectionFactor refuses without coefficients (SECTION 6), and every template rate is absent: IMPORT_TEMPLATE ships ${FP.IMPORT_TEMPLATE.filter((c) => c.amount === null).length} of ${FP.IMPORT_TEMPLATE.length} rates as none and PUMP_TEMPLATE ${FP.PUMP_TEMPLATE.filter((c) => c.amount === null).length} of ${FP.PUMP_TEMPLATE.length}.`);
out('');
out('Rules the engines keep at 13f0936 from MD3-0 (engines PR #221), each measured in this digest:');
out(`a day is not closed without its opening stock (SECTION 7): ${refused(TD.reconcileStock({ ...DAY, openingM3: '', closingDippedM3: closingStd }), 'rule opening')}`);
out(`a dip below a table that does not start at the empty tank is refused, and so is a negative dip (SECTION 4).`);
out(`a water cut the table cannot convert is refused, and so is water above the product dip (SECTIONS 4 and 5).`);
out(`bays are a whole number, one or more (SECTION 10): 2.5 bays reads "${TD.rackQueue({ ...F.IBAFO_RACK, bays: 2.5 }).error}"`);
{
  const one = TD.tankFarmCover({ tanks: F.IBAFO_TANKS.slice(0, 2), dailyThroughputM3: F.IBAFO_DAILY_M3 });
  out(`pumpable stock is counted tank by tank (SECTION 12): IB-T1 and IB-T2 together hold ${m3(one.stockM3)} m3 over a combined heel of ${m3(one.heelM3)} m3 and their pumpable stock is ${m3(one.pumpableStockM3)} m3.`);
}
out('a loss with no density has no weight and no emissions, and the carbon note says why (SECTION 13).');
out(`insurance quoted on CIF is solved in closed form (SECTION 18): CIF ${usd(badLanded.cif)} USD on the BADAGRY cargo.`);
out('a freight-stage charge on C&F or CIF, and a charge with an unknown stage, are refused (SECTION 18).');
out('a blank trucking cost is missing and named, and a cost left out of the call takes its stated default (SECTION 14).');
out('');
out('Rules the engines keep at 13f0936 from MD3-1 (engines PR #224), each measured in this digest:');
out(`a load time of zero minutes is refused (SECTION 10): "${TD.rackQueue({ ...F.IBAFO_RACK, loadMinutes: 0 }).error}"`);
out(`throughputEconomics needs the throughput and the fee (SECTION 13): "${TD.throughputEconomics({ ...F.IBAFO_ECONOMICS, feePerM3: '' }).error}" A blank cost or loss is taken as zero and named in assumedZero.`);
out(`tankFarmCover with no daily throughput gives no days of cover and no turns (SECTION 12): turns a year ${plain(TD.tankFarmCover({ tanks: F.IBAFO_TANKS }).turnsPerYear)}.`);
out('an opening stock derived from the day\'s own closing dip balances every day and measures nothing (SECTION 7).');
out('');
out('Rules the engines keep at 13f0936 from MD3-2 (engines PR #225), each measured in this digest:');
{
  const blank = landed(chargesWith(F.BADAGRY_RATES, onCif), { oceanLossPercent: '' });
  out(`an ocean loss left blank is a missing rate and the landed total is a floor (SECTION 19): complete ${blank.complete}; missing ${blank.missingRates.join(', ')}; ${blank.basisOfTotal}`);
  out(`an ocean loss of 100 percent or more is refused (SECTION 19): ${refused(landed(chargesWith(F.BADAGRY_RATES, onCif), { oceanLossPercent: 100 }), 'rule loss 100')}`);
}

/* ------------------------------------------------------------------ */
section('WHAT THE ORACLES CHECK');
{
  const G = `${ROOT}/test-data/downstream/goldens`;
  const td = JSON.parse(fs.readFileSync(`${G}/terminaldepot_cases.json`, 'utf8'));
  const fp = JSON.parse(fs.readFileSync(`${G}/fuelpricing_cases.json`, 'utf8'));
  head('golden file', 'oracle', 'method', 'published source');
  row('terminaldepot_cases.json', td.provenance.oracle, td.provenance.method, td.provenance.published);
  row('fuelpricing_cases.json', fp.provenance.oracle, fp.provenance.method, fp.provenance.published);
  out('');
  out(`terminaldepot_cases.json carries ${td.dips.length} dips, ${td.refusals.length} refusals, ${td.queues.length} queues, ${td.days.length} reconciled days and ${[td.farm].length} tank farm.`);
  out(`fuelpricing_cases.json carries ${Object.keys(fp.landed).length} landed cost cases (${Object.keys(fp.landed).join(', ')}), ${[fp.lane].length} truck lane, ${[fp.fleet].length} fleet, ${[fp.pump].length} pump build-up with its breakeven exchange rate, and ${[fp.station].length} station.`);
  out('');
  out('Each golden file is written by an independent stdlib Python oracle. A golden figure beside an engine figure is two methods agreeing: the oracle builds a strapping table from tank geometry and computes Erlang C by the exact factorial form in rational arithmetic, where the engine interpolates and recurses; it iterates the insurance fixed point, where the engine uses a closed form; it solves the exchange rate breakeven in closed form, where the engine bisects; and it searches for the fleet one truck at a time, where the engine takes a ceiling. The oracles check figures and verdicts, never the wording of a refusal, so every refusal sentence in this digest is the engine\'s own and is quoted rather than checked.');
  out('The volume correction FORM is pinned by the tests and not validated against a published table, because no table is shipped: the tests assert the form itself and two invariants that need no coefficient, a VCF of exactly 1 at 15 C and below 1 above it.');
  const at15 = TD.volumeCorrectionFactor({ densityKgM3: AK1.densityKgM3, temperatureC: 15, coefficients: F.SYNTHETIC_COEFFICIENTS }).vcf;
  out(`On the synthetic row: VCF at 15 C is ${vcf(at15)}, exactly one: ${at15 === 1}.`);
}

/* ------------------------------------------------------------------ */
if (sectionNo !== Object.keys(SECTION_OWNERS).length) {
  throw new Error(`SECTION OWNERS: ${Object.keys(SECTION_OWNERS).length} owner rows for ${sectionNo} sections`);
}
// MD_PLANT_TZ is the reproducibility gate's negative control: one line that
// reads the time zone. Never set in a build.
if (process.env.MD_PLANT_TZ) out(`planted: ${new Date(2026, 0, 1).toISOString()}`);
const text = `${L.join('\n')}\n`;
const BAD = /NaN|undefined|Infinity|\[object Object\]|(^|[^\w.])-0\.0+(?![\d])/;
if (BAD.test(text)) {
  const bad = L.filter((l) => BAD.test(l)).slice(0, 5);
  throw new Error(`NON-VALUE PRINTED: ${bad.join(' || ')}`);
}
process.stdout.write(text);
process.stderr.write(`verdicts: ${refusedCount} refusal-labelled, ${answeredCount} answer-labelled, every label asserted against the engine\n`);
process.stderr.write(`sections: ${sectionNo}, lines: ${L.length}\n`);
