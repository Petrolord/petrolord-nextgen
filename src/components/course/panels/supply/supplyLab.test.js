// Every value the supply teaching lab exposes to a panel or to the course page is
// pinned here against the teaching digest (tools/course-waves/supply/digest.txt),
// which is itself nothing but the vendored terminalDepot and fuelPricing engines'
// return values on the AKODO, IBAFO and BADAGRY records.
//
// THE GATES, and each one carries a control that is made to fire:
//
//   AGREEMENT WITH THE DIGEST  every reader's return is rebuilt into the digest's
//                      own lines, row by row and sentence by sentence, at the
//                      digest's own printing precision, and each line must appear
//                      in the section that printed it. The control moves one
//                      volume by a litre and requires the rebuilt line to vanish.
//   THE WAVE INPUTS    read through tools/course-waves/waveInputs.mjs, which
//                      throws and names the file when one is missing. The teaching
//                      records in the lab are compared with supply_fields.mjs byte
//                      for byte and value for value, the inline sweeps with the
//                      dump's own text, and the digest and graded answers with the
//                      sha256 pins in waves.json.
//   MISSING STAYS MISSING  a blank control goes to the engine as missing: the
//                      opening stock, the bays, the density, the coefficients, a
//                      rate and a cost box, each left blank, come back as the
//                      engine's refusal or its named gap, never as a zero.
//   THE CLOCK GATE     the whole snapshot is identical under two faked system
//                      dates, and no source reads a clock or a random number.
//   THE ZONE GATE      the whole snapshot is rebuilt in child processes under
//                      TZ=Pacific/Pago_Pago and TZ=Pacific/Kiritimati, twenty five
//                      hours apart, and must be byte identical. Each child proves
//                      its own offset first, so a child that silently ran in the
//                      parent's zone fails.
//   THE RENDER GATE    every mode of every panel renders with nothing, with an
//                      error-shaped object, with each data prop error-shaped in
//                      turn, and whole on real data.
//   THE REFUSAL LITERAL GATE  no engine refusal sentence is typed into a source.
//   THE COPY RULE      no em dash, no en dash, no double hyphen and no "X, not Y"
//                      in any source line or any string the lab hands a panel,
//                      with the engine's two FLOOR sentences exempt by exact prefix
//                      and pinned to the vendored engine, and a dead exemption fails.
import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
// Members of L and WAVE_FIELDS are read off the namespaces by name at run time,
// which is the point of the value comparison, so import/namespace cannot check
// them statically. The resolution test below proves every engine member resolves.
/* eslint-disable import/namespace */
import * as L from './supplyLab.js';
import {
  waveDir, waveInput, mirrorDir, liveWaveDir, WAVES,
} from '../../../../../tools/course-waves/waveInputs.mjs';
import * as WAVE_FIELDS from '../../../../../tools/course-waves/supply/supply_fields.mjs';
import TankExplorer, * as TE from './TankExplorer.jsx';
import DepotExplorer, * as DE from './DepotExplorer.jsx';
import PriceExplorer, * as PE from './PriceExplorer.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

const WAVE_NAME = 'supply';
const WAVE = waveDir(WAVE_NAME);
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE_WAVE = liveWaveDir(WAVE_NAME);
const DIGEST = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');
const FIELDS_JSON = fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8');
const FIELDS_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'supply_fields.mjs'), 'utf8');
const DUMP_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'supply_dump.mjs'), 'utf8');
const ENGINE_DIR = path.join(ROOT, 'packages/engines/engines/downstream');
const ENGINE_SRC = ['terminalDepot', 'fuelPricing'].map((m) => fs.readFileSync(path.join(ENGINE_DIR, `${m}.js`), 'utf8')).join('\n');

const LAB_FILE = 'supplyLab.js';
const PANEL_FILES = ['TankExplorer.jsx', 'DepotExplorer.jsx', 'PriceExplorer.jsx'];
const SHARED_FILES = ['panelBits.jsx'];
const LEARNING_PAGE = path.resolve(ROOT, 'src/pages/apps/SupplyLearningPage.jsx');

const sourceOf = (file) => {
  const p = file === 'SupplyLearningPage.jsx' ? LEARNING_PAGE : path.join(HERE, file);
  if (!fs.existsSync(p)) {
    throw new Error(`source missing: ${file} is named in this suite's file list and is not at ${p}. `
      + 'A renamed or deleted file fails here rather than emptying the gates that read it.');
  }
  return fs.readFileSync(p, 'utf8');
};
const ALL_SOURCES = [LAB_FILE, ...SHARED_FILES, ...PANEL_FILES, 'SupplyLearningPage.jsx'];
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// ---------------------------------------------------------------------------
// The digest, cut into its sections, and the digest's own ways of printing.
// ---------------------------------------------------------------------------

const SECTIONS = (() => {
  const out = {};
  let n = 0;
  DIGEST.split('\n').forEach((line) => {
    const m = /^# SECTION (\d+):/.exec(line);
    if (m) n = Number(m[1]);
    if (n) (out[n] = out[n] || []).push(line);
  });
  return out;
})();

const f = L.fmt;
const { plain } = L;
const row = (...cells) => `| ${cells.join(' | ')} |`;
const refused = (m) => `REFUSED: ${m}`;

/** Every line a section must carry, collected so a failure names them all. */
const pin = (n, lines) => {
  const have = new Set(SECTIONS[n] || []);
  const missing = lines.filter((l) => !have.has(l));
  expect(SECTIONS[n], `the digest has no SECTION ${n}`).toBeTruthy();
  expect(lines.length, `SECTION ${n} was pinned with nothing`).toBeGreaterThan(0);
  expect(missing, `SECTION ${n}: these lines the lab rebuilds are not in the digest`).toEqual([]);
};

const S = L.teachingSurface();

/** Walk every leaf of a plain object. */
function walk(v, p, fn) {
  fn(v, p);
  if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${p}.${k}`, fn));
}

// ---------------------------------------------------------------------------

describe('the wave inputs and the teaching records', () => {
  it('the digest is whole: all twenty-four sections', () => {
    expect(Object.keys(SECTIONS).length).toBe(24);
    expect(DIGEST.split('\n').length).toBeGreaterThan(700);
  });

  it('the digest and the graded answers are the bytes waves.json pins', () => {
    const pins = WAVES[WAVE_NAME].pins;
    const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
    expect(sha(DIGEST)).toBe(pins['digest.txt']);
    expect(sha(FIELDS_JSON)).toBe(pins['fields.json']);
  });

  it('THE MIRROR GATE: the committed copy is the wave, and this gate says which it compared', () => {
    const named = WAVES[WAVE_NAME].inputs;
    expect(named.length).toBeGreaterThanOrEqual(25);
    named.forEach((x) => expect(fs.existsSync(path.join(WAVE, x)), `${x} is missing from ${WAVE}`).toBe(true));
    if (LIVE_WAVE) {
      const pinned = ['digest.txt', 'fields.json', 'precision.json', 'capstone.json', 'supply_fields.mjs', 'supply_dump.mjs'];
      const differing = pinned.filter((x) => {
        const live = path.join(LIVE_WAVE, x);
        return !fs.existsSync(live) || !fs.readFileSync(path.join(MIRROR, x)).equals(fs.readFileSync(live));
      });
      // eslint-disable-next-line no-console
      console.log(`[mirror gate] byte-compared ${pinned.length} inputs this suite reads against the LIVE wave directory ${LIVE_WAVE}`);
      expect(differing, `the committed copy has drifted from ${LIVE_WAVE}`).toEqual([]);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[mirror gate] no live wave directory on this machine, so the committed copy at ${MIRROR} was checked for completeness`);
      expect(path.resolve(WAVE)).toBe(path.resolve(MIRROR));
    }
  });

  it('the teaching records are copied VERBATIM from supply_fields.mjs, byte for byte', () => {
    const lab = sourceOf(LAB_FILE);
    const begin = '// ---- BEGIN VERBATIM supply_fields.mjs ----\n';
    const end = '// ---- END VERBATIM supply_fields.mjs ----';
    expect(lab).toContain(begin);
    expect(lab).toContain(end);
    const block = lab.slice(lab.indexOf(begin) + begin.length, lab.indexOf(end));
    const wave = FIELDS_MJS.slice(FIELDS_MJS.indexOf('/* ----'));
    expect(wave.length, 'the wave file carries almost nothing').toBeGreaterThan(7000);
    expect(block).toBe(wave);
    expect(DUMP_MJS).toContain("import * as F from './supply_fields.mjs';");
  });

  it('and they AGREE IN VALUE with the wave file when run, not only as text', () => {
    const names = Object.keys(WAVE_FIELDS);
    expect(names.length).toBeGreaterThanOrEqual(38);
    const differing = names.filter((k) => JSON.stringify(L[k]) !== JSON.stringify(WAVE_FIELDS[k]));
    expect(differing).toEqual([]);
    expect(JSON.stringify(L.akodoTable(L.AKODO_TANKS[2]))).toBe(JSON.stringify(WAVE_FIELDS.akodoTable(WAVE_FIELDS.AKODO_TANKS[2])));
  });

  it('the sweeps the dump holds inline are the dump\'s own', () => {
    expect(DUMP_MJS).toContain(`for (const lm of [${L.IBAFO_LOAD_SWEEP.join(', ')}])`);
    expect(DUMP_MJS).toContain(`for (const d of [${L.IBAFO_DISTANCE_SWEEP.join(', ')}])`);
    expect(DUMP_MJS).toContain(`for (const dmd of [${L.IBAFO_DEMAND_SWEEP.join(', ')}])`);
    expect(DUMP_MJS).toContain(`for (const n of [${L.AKODO_DAYS_KEPT.join(', ')}])`);
    expect(DUMP_MJS).toContain(`amount: ${L.BADAGRY_FORWARD_FREIGHT_RATE} }`);
    expect(DUMP_MJS).toContain(`{ id: '${L.BADAGRY_CUSTOMS_CHARGE.id}', label: '${L.BADAGRY_CUSTOMS_CHARGE.label}', basis: '${L.BADAGRY_CUSTOMS_CHARGE.basis}', stage: '${L.BADAGRY_CUSTOMS_CHARGE.stage}', amount: ${L.BADAGRY_CUSTOMS_CHARGE.amount} }`);
    expect(DUMP_MJS).toContain(`insurance: ${L.BADAGRY_FULL_INSURANCE} }`);
    expect(DUMP_MJS).toContain(`const PRINT = {\n  ${Object.entries(L.PRINT).slice(0, 11).map(([k, v]) => `${k}: ${v}`).join(', ')},`);
  });

  it('every engine member the lab names resolves in the vendored modules', () => {
    const code = strip(sourceOf(LAB_FILE));
    const used = [...code.matchAll(/\b(TD|FP)\.([A-Za-z_]\w*)/g)].map((m) => [m[1], m[2]]);
    expect(used.length).toBeGreaterThan(50);
    const missing = used.filter(([ns, name]) => L.ENGINE[ns][name] === undefined).map(([ns, n]) => `${ns}.${n}`);
    expect([...new Set(missing)]).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// AGREEMENT WITH THE DIGEST, section by section.
// ---------------------------------------------------------------------------

describe('AGREEMENT WITH THE DIGEST: every reader, rebuilt into the digest\'s own lines', () => {
  it('SECTION 1, what the two apps compute and what the engine ships', () => {
    const e = S.engines;
    pin(1, [
      row('terminalDepot', e.terminalDepot.functions.length, e.terminalDepot.constants.length, [...e.terminalDepot.functions, ...e.terminalDepot.constants].join(', ')),
      row('fuelPricing', e.fuelPricing.functions.length, e.fuelPricing.constants.length, [...e.fuelPricing.functions, ...e.fuelPricing.constants].join(', ')),
      `fuelPricing.LITRES_PER_M3: ${e.litresPerM3}`,
      `fuelPricing.M3_PER_BBL: ${e.m3PerBbl}`,
      `fuelPricing.CHARGE_BASIS: ${e.chargeBasis.join(', ')}`,
      `fuelPricing.PRICE_ELEMENT_BASIS: ${e.priceElementBasis.join(', ')}`,
      ...e.importTemplate.map((c, i) => row(i + 1, c.id, c.label, c.basis, c.stage, plain(c.amount))),
      ...e.pumpTemplate.map((c, i) => row(i + 1, c.id, c.label, c.basis, c.recipient, plain(c.amount))),
      `fuelPricing.RATE_DISCLAIMER: "${e.rateDisclaimer}"`,
      ...e.productReference.map((p) => row(p.code, p.label, p.typicalDensityKgM3, p.range)),
    ]);
    expect(e.stationQueue.agree).toBe(true);
    const line = SECTIONS[1].find((l) => l.startsWith('That comparison'));
    expect(line).toContain(`answers a probability of waiting of ${f.prob(e.stationQueue.onPrintedRoundings)} against the station's ${f.prob(e.stationQueue.stationProbability)}.`);
  });

  it('SECTION 2, missing stays missing', () => {
    const lines = S.missing.map((m) => {
      if (m.refusal) return row(m.call, m.what, refused(m.refusal));
      const a = m.answer;
      if (m.call === 'dipToStandardVolume') return row(m.call, m.what, `gross ${f.m3(a.grossM3)} m3, standard ${f.m3(a.standardM3)}; note: ${a.note}`);
      if (m.call === 'reconcileStock') return row(m.call, m.what, `expected closing ${f.m3(a.expectedClosingM3)} m3, unaccounted ${f.m3(a.unaccountedM3)}; note: ${a.note}`);
      if (m.call === 'throughputEconomics') return row(m.call, m.what, `margin ${f.usd(a.margin)}, emissions ${plain(a.emissionsKgCo2e)}; note: ${a.note}`);
      return row(m.call, m.what, `complete ${a.complete}, ${a.missing} rates missing, total ${f.usd(a.totalUsd)} USD; ${a.note}`);
    });
    expect(lines).toHaveLength(18);
    pin(2, lines);
  });

  it('SECTION 3, the tables, the bracketing entries and the curve', () => {
    const c = S.curve;
    pin(3, [
      ...S.tables.map((t) => row(t.id, t.product, t.shape, t.size, t.entries, t.stepMm, `${t.first.heightMm} mm = ${f.m3(t.first.volumeM3)} m3`, `${t.last.heightMm} mm = ${f.m3(t.last.volumeM3)} m3`)),
      ...S.morningDips.map((d) => row(d.tank, d.dipMm, `${d.below.heightMm} mm = ${f.m3(d.below.volumeM3)} m3`, `${d.above.heightMm} mm = ${f.m3(d.above.volumeM3)} m3`, f.m3(d.volumeM3))),
      ...c.rows.map((r) => row(r.heightMm, f.m3(r.coarseM3), f.m3(r.fineM3), f.m3(r.coarseLessFineDerivedM3))),
      `AK-03 is a curve, and volumeAtDip draws a straight line between two entries. The same bullet strapped every 10 mm (${c.fineEntries} entries) against its own table every ${c.stepMm} mm:`,
      `AK-01 is a vertical cylinder, which is linear in height, so its ${c.ak01.stepMm} mm table and the same tank strapped every 10 mm agree at the dip to the litre: ${f.m3(c.ak01.coarseM3)} m3 and ${f.m3(c.ak01.fineM3)} m3.`,
    ]);
  });

  it('SECTION 4, where a table stops', () => {
    const p = L.partialTable();
    pin(4, [
      ...S.dipSweep.map((d) => row(plain(d.dipMm), d.refusal ? refused(d.refusal) : `${f.m3(d.volumeM3)} m3`)),
      ...S.partialDips.map((d) => row(d.dipMm, d.waterMm, d.refusal ? refused(d.refusal) : `gross ${f.m3(d.grossM3)} m3`)),
      ...S.aboveLast.map((d) => row(d.tank, d.lastMm, d.dipMm, refused(d.refusal))),
      `A partial calibration: the same tank with a table that starts at ${p[0].heightMm} mm, where the volume is ${f.m3(p[0].volumeM3)} m3 and not the empty tank, and ends at ${p[p.length - 1].heightMm} mm. Dips and water cuts put to it through dipToStandardVolume:`,
    ]);
    expect(S.dipSweep.filter((d) => d.refusal)).toHaveLength(4);
  });

  it('SECTION 5, free water and the gross volume', () => {
    const m = S.morning;
    const ak3 = m.rows[2]; const ak1 = m.rows[0];
    pin(5, [
      ...S.waterSweep.map((w) => row(w.waterMm, w.refusal ? refused(w.refusal) : `water ${f.m3(w.waterM3)} m3, gross ${f.m3(w.grossM3)} m3`)),
      ...m.rows.map((r) => row(r.tank, r.dipMm, r.waterMm, f.m3(r.volumeAtDipM3), f.m3(r.waterM3), f.m3(r.grossM3))),
      `total gross observed volume: ${f.m3(m.closingGrossM3)} m3`,
      `Subtracting heights first and reading the table once gives the volume at ${ak3.heightLessWaterDerivedMm} mm. On the bullet AK-03 that reads ${f.m3(ak3.byHeightNotUsedM3)} m3 against the gross ${f.m3(ak3.grossM3)} m3, because the water fills the narrow bottom of a curved tank. On the vertical AK-01 the volume at ${ak1.heightLessWaterDerivedMm} mm reads ${f.m3(ak1.byHeightNotUsedM3)} m3 against the gross ${f.m3(ak1.grossM3)} m3.`,
    ]);
  });

  it('SECTION 6, the volume correction factor, typed and SYNTHETIC', () => {
    const m = S.morning;
    pin(6, [
      `volumeCorrectionFactor with no coefficients: ${refused(S.vcfRefusals[0].message)}`,
      `SYNTHETIC COEFFICIENTS, invented for this course and not any commodity group's published row: K0 = ${L.SYNTHETIC_COEFFICIENTS.k0}, K1 = ${L.SYNTHETIC_COEFFICIENTS.k1}, K2 = ${L.SYNTHETIC_COEFFICIENTS.k2}. They show the form only. No stock in this digest is corrected with them.`,
      ...S.vcfTemperature.map((v) => row(v.temperatureC, f.alpha(v.alpha), f.vcf(v.vcf))),
      ...S.vcfDensity.map((v) => row(v.densityKgM3, f.alpha(v.alpha), f.vcf(v.vcf))),
      ...m.rows.map((r) => row(r.tank, r.densityKgM3, r.temperatureC, f.vcf(r.vcf), f.m3(r.grossM3), f.m3(r.standardM3))),
      `total standard volume, the closing stock the day is closed on: ${f.m3(m.closingStandardM3)} m3`,
    ]);
    pin(2, [row('volumeCorrectionFactor', 'the density', refused(S.vcfRefusals[1].message))]);
  });

  it('SECTION 7, closing the AKODO day, the reconciliation that cannot fail, and the tolerance', () => {
    const d = S.day; const i = d.inputs;
    const g = S.grossDay; const st = S.stillDay;
    pin(7, [
      row('opening stock (yesterday\'s closing dip) m3', f.m3(i.openingM3)),
      row('receipts m3', f.m3(i.receiptsM3)),
      row('deliveries m3', f.m3(i.deliveriesM3)),
      row('known losses m3', f.m3(i.knownLossM3)),
      row('expected closing m3', f.m3(d.expectedClosingM3)),
      row('dipped closing (standard) m3', f.m3(d.dippedClosingM3)),
      row('unaccounted m3', f.m3(d.unaccountedM3)),
      row('unaccounted percent of throughput', f.pct(d.unaccountedPercentOfThroughput)),
      row(`tolerance m3 (${i.tolerancePercentOfThroughput} percent of throughput)`, f.m3(d.toleranceM3)),
      row('within tolerance', d.withinTolerance),
      row('direction', d.direction),
      `throughput, receipts + deliveries: ${f.m3(d.throughputDerivedM3)} m3. The tolerance above is ${i.tolerancePercentOfThroughput} percent of it.`,
      `With no opening stock: ${refused(L.dayAt({ openingM3: undefined }).refusal)}`,
      ...S.cannotFail.map((r) => row(f.m3(r.closingM3), f.m3(r.openingM3), f.m3(r.expectedClosingM3), f.m3(r.unaccountedM3), r.withinTolerance, r.direction)),
      `The same day closed on the GROSS closing stock (${f.m3(g.closingGrossM3)} m3) against an opening stock held at standard: unaccounted ${f.m3(g.unaccountedM3)} m3, direction ${g.direction}, within tolerance ${g.withinTolerance}.`,
      ...S.toleranceSweep.map((r) => row(r.percent, f.m3(r.toleranceM3), r.withinTolerance)),
      `A day with no receipts and no deliveries has no throughput and so no tolerance: opening ${f.m3(st.openingM3)} m3 dipped at ${f.m3(st.dippedClosingM3)} m3 reads unaccounted ${f.m3(st.unaccountedM3)} m3, tolerance ${f.m3(st.toleranceM3)} m3, within tolerance ${st.withinTolerance}, direction ${st.direction}.`,
    ]);
    // THE DEMONSTRATION: every row balances, whatever the dip reads.
    S.cannotFail.forEach((r) => {
      expect(r.direction).toBe('balanced');
      expect(f.m3(r.unaccountedM3)).toBe('0.000');
    });
  });

  it('SECTION 8, a run in one direction', () => {
    const t = S.trend;
    const short = L.trendAt(6);
    const empty = L.trendAt(0);
    pin(8, [
      ...t.rows.map((r) => row(r.date, f.m3(r.unaccountedM3), f.m3(r.throughputM3), f.m3(r.cumulativeM3))),
      `cumulative unaccounted: ${f.m3(t.cumulativeM3)} m3; cumulative as a percent of cumulative throughput: ${f.pct(t.meanPercent)}`,
      `run ending on the latest day: ${t.runLength} days of ${t.runDirection}`,
      `prompt: ${t.prompt}`,
      `The first six days alone: run ${short.runLength} days of ${short.runDirection}; prompt: ${plain(short.prompt)}.`,
      `cumulative throughput over the nine days, the denominator of the mean percent: ${f.m3(t.cumulativeThroughputDerivedM3)} m3.`,
      ...S.trendThreshold.map((x) => row(x.daysKept, `${x.runLength} days of ${x.runDirection}`, x.prompt ? 'yes' : 'none')),
      `No days at all: cumulative ${f.m3(empty.cumulativeM3)} m3, run ${empty.runLength}, mean percent ${plain(empty.meanPercent)}.`,
    ]);
  });

  it('SECTION 9, the IBAFO rack as a queue', () => {
    const r = S.rack;
    pin(9, [
      row('arrivals per hour', r.inputs.arrivalsPerHour),
      row('mean load minutes', r.inputs.loadMinutes),
      row('bays', r.bays),
      row('offered load, erlangs', f.erlang(r.offered)),
      row('utilisation', f.util(r.utilisation)),
      row('probability of waiting (Erlang C)', f.prob(r.probabilityOfWaiting)),
      row('mean wait, minutes', f.min(r.averageWaitMinutes)),
      row('mean time on site, minutes', f.min(r.averageTimeOnSiteMinutes)),
      row('mean queue length, trucks', f.queue(r.queueLength)),
      row('trucks per day at this arrival rate', r.trucksPerDay),
      `The mean wait of a truck that does queue is the mean wait over the probability of waiting: ${f.min(r.averageWaitMinutes)} / ${f.prob(r.probabilityOfWaiting)} = ${f.min(r.waitIfQueuedDerivedMinutes)} minutes. The engine's averageWaitMinutes averages over every truck, the ones that load at once included.`,
      `Erlang B, the probability that every bay is busy in a rack with NO queue (a truck that finds every bay busy leaves), is not exported by the engine. From the engine's Erlang C by the identity B = C x (1 - utilisation) / (1 - utilisation x C) it is ${f.prob(r.erlangBDerived)} on the IBAFO rack, against the Erlang C of ${f.prob(r.probabilityOfWaiting)}.`,
      `Little's law, queue length = arrivals per hour x mean wait in hours: ${r.inputs.arrivalsPerHour} x ${f.min(r.averageWaitMinutes)} / 60 = ${f.queue(r.littleQueueDerived)}, the engine's queue length is ${f.queue(r.queueLength)}.`,
    ]);
  });

  it('SECTION 10, the bay sweep, the refusals and the load sweep', () => {
    pin(10, [
      ...S.baySweep.map((r) => (r.stable
        ? row(r.bays, f.util(r.utilisation), r.stable, f.prob(r.probabilityOfWaiting), f.min(r.averageWaitMinutes), f.queue(r.queueLength))
        : row(r.bays, f.util(r.utilisation), r.stable, f.prob(r.probabilityOfWaiting), 'none', 'none'))),
      ...S.rackRefusals.map((r) => row(plain(r.inputs.arrivalsPerHour), plain(r.inputs.loadMinutes), plain(r.inputs.bays), refused(r.refusal))),
      ...S.loadSweep.map((r) => row(r.inputs.loadMinutes, f.util(r.utilisation), f.prob(r.probabilityOfWaiting), f.min(r.averageWaitMinutes), f.prob(r.erlangBDerived))),
    ]);
    expect(S.rackRefusals.every((r) => r.refusal)).toBe(true);
  });

  it('SECTION 11, a rack that cannot keep up', () => {
    pin(11, S.arrivalSweep.map((r) => row(r.inputs.arrivalsPerHour, f.erlang(r.offered), f.util(r.utilisation), r.stable
      ? `probability of waiting ${f.prob(r.probabilityOfWaiting)}, mean wait ${f.min(r.averageWaitMinutes)} minutes`
      : `stable ${r.stable}, probability of waiting ${f.prob(r.probabilityOfWaiting)}, mean wait ${plain(r.averageWaitMinutes)}; ${refused(r.refusal)}`)));
  });

  it('SECTION 12, the tank farm tank by tank', () => {
    const fm = S.farm;
    pin(12, [
      ...fm.tanks.map((t) => row(t.id, f.m3(t.capacityM3), f.m3(t.heelM3), f.m3(t.stockM3), f.m3(t.pumpableM3), f.m3(t.ullageM3))),
      row('capacity m3', f.m3(fm.capacityM3)),
      row('heel m3', f.m3(fm.heelM3)),
      row('working capacity m3', f.m3(fm.workingCapacityM3)),
      row('stock m3', f.m3(fm.stockM3)),
      row('pumpable stock m3', f.m3(fm.pumpableStockM3)),
      row('ullage m3', f.m3(fm.ullageM3)),
      row('daily throughput (liftings) m3', f.m3(fm.dailyThroughputM3)),
      row('days of cover', f.days(fm.daysOfCover)),
      row('turns a year', f.turns(fm.turnsPerYear)),
      `With no daily throughput the engine gives days of cover ${plain(S.farmNoThroughput.daysOfCover)} and turns a year ${plain(S.farmNoThroughput.turnsPerYear)}: both need the throughput.`,
      `The farm's stock less the farm's heel is ${f.m3(fm.stockLessHeelNotUsedM3)} m3. That is not pumpable stock: IB-T2 holds ${f.m3(fm.tanks[1].stockM3)} m3 against a heel of ${f.m3(fm.tanks[1].heelM3)} m3, and no pump lends one tank's volume to another's heel.`,
    ]);
    // The drawn heel bars add up to each tank's capacity.
    fm.tanks.forEach((t) => expect(t.stockAtOrBelowHeelDrawnM3 + t.pumpableM3 + t.ullageM3).toBeCloseTo(t.capacityM3, 9));
  });

  it('SECTION 13, throughput economics and the carbon ledger', () => {
    const E = L.IBAFO_ECONOMICS;
    pin(13, [
      ...S.economics.map(([name, r]) => row(name, f.usd(r.revenue), f.usd(r.margin), f.usd(r.marginPerM3), r.lossTonnes === null ? 'none' : f.tonnes(r.lossTonnes),
        r.emissionsKgCo2e === null ? 'none' : f.kg(r.emissionsKgCo2e), r.kgCo2ePerTonneThroughput === null ? 'none' : f.share(r.kgCo2ePerTonneThroughput), plain(r.carbonNote))),
      row('the throughput', refused(S.economicsBlanks[0][1].refusal)),
      row('the fee', refused(S.economicsBlanks[1][1].refusal)),
      row('the fixed cost', `margin ${f.usd(S.economicsBlanks[2][1].margin)} USD; assumedZero: ${S.economicsBlanks[2][1].assumedZero.join(', ')}`),
      row('nothing', `margin ${f.usd(S.economicsBlanks[3][1].margin)} USD; assumedZero: ${S.economicsBlanks[3][1].assumedZero.length ? S.economicsBlanks[3][1].assumedZero.join(', ') : 'none'}`),
      `IBAFO: throughput ${f.m3(E.throughputM3)} m3, fee ${f.usd(E.feePerM3)} USD/m3, variable cost ${f.usd(E.variableCostPerM3)} USD/m3, fixed cost ${f.usd(E.fixedCostPerPeriod)} USD for the period, loss ${f.m3(E.lossM3)} m3, density ${E.productDensityKgM3} kg/m3.`,
      `The factor used below is SYNTHETIC, ${L.SYNTHETIC_LOSS_FACTOR_KG_PER_T} kg CO2e a tonne, invented for this course and not a published figure.`,
    ]);
  });

  it('SECTION 14, the lane, a blank cost, and three distances', () => {
    const l = S.lane;
    const nc = S.laneNoCapital;
    pin(14, [
      row('complete', l.complete),
      row('round trip km', f.km(l.roundTripKm)),
      row('cycle hours', f.hours(l.cycleHours)),
      row('trips a truck a day', f.trips(l.tripsPerTruckPerDay)),
      row('trips a truck a year', l.tripsPerTruckPerYear.toFixed(4)),
      ...l.components.map((c) => row(`${c.label}, naira a trip`, c.amount.toFixed(2))),
      row('cost a trip, naira', l.costPerTrip.toFixed(2)),
      row('litres delivered a trip', f.litres(l.deliveredLitresPerTrip)),
      row('cost per litre delivered, naira', f.localL(l.costPerLitreDelivered)),
      row('diesel litres a trip', f.litres(l.dieselLitresPerTrip)),
      row('kg CO2e a trip', plain(l.kgCo2ePerTrip)),
      row('carbon note', l.carbonNote),
      ...S.laneDriver.map(([label, r]) => row(label, r.complete, r.missingInputs.length ? r.missingInputs.join(', ') : 'none', r.costPerTrip.toFixed(2), f.localL(r.costPerLitreDelivered))),
      `With no truck capital cost: complete ${nc.complete}, missing ${nc.missingInputs.join(', ')}, cost per litre delivered ${f.localL(nc.costPerLitreDelivered)} naira, which is a floor.`,
      ...S.laneDistances.map((r) => row(f.km(r.inputs.distanceKm), f.hours(r.cycleHours), f.trips(r.tripsPerTruckPerDay), r.costPerTrip.toFixed(2), f.localL(r.costPerLitreDelivered))),
      ...S.laneDistances.map((r) => row(f.km(r.inputs.distanceKm), ...r.components.map((c) => c.amount.toFixed(2)))),
    ]);
  });

  it('SECTION 15, the fleet from the lane\'s own trips', () => {
    const fl = S.fleet;
    pin(15, [
      row('demand litres a day', f.litres(fl.demandLitresPerDay)),
      row('payload litres', f.litres(fl.payloadLitres)),
      row('trips a truck a day (from the lane)', f.trips(fl.tripsPerTruckPerDay)),
      row('trips needed a day', f.trips(fl.tripsNeededPerDay)),
      row('trucks required', fl.trucksRequired),
      row('fleet trip capacity a day', f.trips(fl.fleetTripCapacityPerDay)),
      row('fleet utilisation', f.util(fl.utilisation)),
      row('spare trips a day', f.trips(fl.spareTripsPerDay)),
      row('spare litres a day', f.litres(fl.spareLitresPerDay)),
      ...S.fleetSweep.map((r) => row(f.litres(r.demandLitresPerDay), f.trips(r.tripsNeededPerDay), r.trucksRequired, f.util(r.utilisation))),
      `With no demand: ${refused(S.fleetNoDemand.refusal)}`,
    ]);
  });

  it('SECTION 16, the station, the nozzles and the reorder fraction', () => {
    const st = S.station;
    pin(16, [
      row('transactions a day', st.transactionsPerDay.toFixed(1)),
      row('peak transactions an hour', st.peakTransactionsPerHour.toFixed(2)),
      row('service minutes a transaction', st.serviceMinutesPerTransaction.toFixed(3)),
      row('forecourt utilisation', f.util(st.queue.utilisation)),
      row('forecourt probability of waiting', f.prob(st.queue.probabilityOfWaiting)),
      row('forecourt mean wait, minutes', f.min(st.queue.averageWaitMinutes)),
      row('usable tank litres', f.litres(st.usableTankLitres)),
      row('cover days', st.coverDays.toFixed(2)),
      row('reorder level litres', f.litres(st.reorderLevelLitres)),
      row('ullage at reorder litres', f.litres(st.ullageAtReorderLitres)),
      row('payload fits the ullage', st.payloadFitsUllage),
      row('ullage warning', plain(st.ullageWarning)),
      ...S.nozzleSweep.map((r) => row(r.inputs.nozzles, f.util(r.queue.utilisation), r.queue.stable, f.prob(r.queue.probabilityOfWaiting), r.queue.stable ? f.min(r.queue.averageWaitMinutes) : 'none')),
      ...S.reorderSweep.map((r) => row(r.inputs.reorderAtFraction, f.litres(r.reorderLevelLitres), f.litres(r.ullageAtReorderLitres), r.payloadFitsUllage, plain(r.ullageWarning))),
      `The forecourt's delivery of ${f.litres(st.deliveryPayloadLitres)} litres is the IBAFO lane's payload (SECTION 14), and stationSizing checks the payload loaded. The lane delivers ${f.litres(S.lane.deliveredLitresPerTrip)} litres a trip after its transit loss; the station's check does not use that figure.`,
    ]);
  });

  it('SECTION 17, one cargo every way', () => {
    pin(17, [
      ...S.cargoUnits.map((r) => (r.refusal ? row(r.quantity, r.unit, refused(r.refusal), '', '', '') : row(r.quantity, r.unit, f.m3(r.m3), f.litres(r.litres), f.tonnes(r.tonnes), f.bbl(r.bbl)))),
      ...S.cargoDensities.map((r) => row(r.code, r.densityKgM3, f.m3(r.m3), f.litres(r.litres))),
      `A zero quantity: ${refused(S.cargoZero.refusal)}`,
    ]);
    pin(2, [
      row('cargoQuantities', 'the density', refused(L.cargoAt(L.BADAGRY_CARGO.quantity, 'tonne', '').refusal)),
    ]);
  });

  it('SECTION 18, the landed cost walk, the insurance basis, the refusals and the floors', () => {
    const l = S.landed; const cf = S.landedCf; const fl = S.landedFloors;
    const lineOf = (x, k) => x.lines.find((y) => y.key === k).amount;
    pin(18, [
      ...l.lines.map((x) => row(x.stage, x.label, x.basis, f.usd(x.amount), f.usdL(x.perLitre))),
      `FOB ${f.usd(l.fob)} USD; C&F ${f.usd(l.cf)} USD; CIF ${f.usd(l.cif)} USD; landed total ${f.usd(l.totalUsd)} USD; complete ${l.complete}; ${l.basisOfTotal}`,
      row('insurance USD', f.usd(lineOf(l, 'insurance')), f.usd(lineOf(cf, 'insurance'))),
      row('CIF USD', f.usd(l.cif), f.usd(cf.cif)),
      row('import duty USD', f.usd(lineOf(l, 'duty')), f.usd(lineOf(cf, 'duty'))),
      row('landed total USD', f.usd(l.totalUsd), f.usd(cf.totalUsd)),
      ...S.landedRefusals.map((r) => row(r.label, refused(r.message))),
      `With the duty and the financing rate left blank the build-up is not complete: complete ${fl.dutyAndFinanceBlank.complete}; missing ${fl.dutyAndFinanceBlank.missingRates.join(', ')}; total ${f.usd(fl.dutyAndFinanceBlank.totalUsd)} USD. ${fl.dutyAndFinanceBlank.basisOfTotal}`,
      `With every rate blank: complete ${fl.everyRateBlank.complete}; ${fl.everyRateBlank.missingRates.length} missing; total ${f.usd(fl.everyRateBlank.totalUsd)} USD, the FOB alone. ${fl.everyRateBlank.basisOfTotal}`,
      `A rate typed 0 is a rate: with the duty typed 0 the build-up is complete ${fl.dutyZero.complete}, total ${f.usd(fl.dutyZero.totalUsd)} USD. With the duty left blank it is complete ${fl.dutyBlank.complete}, missing ${fl.dutyBlank.missingRates.join(', ')}, total ${f.usd(fl.dutyBlank.totalUsd)} USD. ${fl.dutyBlank.basisOfTotal}`,
    ]);
    // The staircase ends on the engine's own total.
    expect(l.lines[l.lines.length - 1].runningDrawnUsd).toBeCloseTo(l.totalUsd, 1);
    expect(l.lines[0].baseDrawnUsd).toBe(0);
  });

  it('SECTION 19, ocean loss and the litre sold, and H1', () => {
    const h = S.h1;
    pin(19, [
      ...S.lossSweep.map((r) => row(r.lossPercent, f.litres(r.outturn.litres), f.usd(r.totalUsd), f.usdL(r.perLitreUsd), f.localL(r.perLitreLocal))),
      `The BADAGRY cargo, insurance on CIF, the ocean loss swept (bill of lading ${f.litres(S.landed.quantities.litres)} litres):`,
      `The exchange rate enters once, at the end: naira per litre sold = USD per litre sold x ${f.fx(L.BADAGRY_CARGO.fxRate)}. With no exchange rate the local figure is ${plain(L.landedAt({ fxRate: null }).perLitreLocal)}.`,
      `HELD (FINDINGS-supply H1): the charges levied at discharge are billed on the bill-of-lading quantity. The jetty line is ${f.usd(h.jetty.amount)} USD and the storage line ${f.usd(h.storage.amount)} USD, each on ${f.m3(h.billOfLadingM3)} m3 on the bill of lading, where the outturn is ${f.m3(h.outturnM3)} m3. Whether a terminal bills on the bill of lading or on the outturn is a contract term the engine does not know.`,
      `Every charge quoted per quantity is charged on the bill-of-lading quantity, the per-litre regulatory line included: ${f.usd(h.regulator.amount)} USD on ${f.litres(h.billOfLadingLitres)} bill-of-lading litres, and the port line ${f.usd(h.port.amount)} USD on ${f.tonnes(h.billOfLadingTonnes)} bill-of-lading tonnes. H1 names the discharge charges; the same contract question applies to any line charged per quantity, and the engine answers every one on the bill of lading.`,
    ]);
    // The landed total does not move with the loss; the litre sold does.
    expect(new Set(S.lossSweep.map((r) => r.totalUsd)).size).toBe(1);
    const perLitre = S.lossSweep.map((r) => r.perLitreUsd);
    perLitre.slice(1).forEach((v, i) => expect(v).toBeGreaterThan(perLitre[i]));
  });

  it('SECTION 20, the pump price build-up, the caps, the VAT basis and the floor', () => {
    const p = S.pump; const c = S.pumpCases;
    pin(20, [
      ...p.lines.map((l) => row(l.label, plain(l.recipient), l.basis, plain(l.rate), f.localL(l.amount), f.localL(l.running), f.share(l.share))),
      `pump price ${f.localL(p.pricePerLitre)} naira a litre; complete ${p.complete}; ${p.basisOfPrice}`,
      `Against a cap of ${f.localL(p.capPerLitre)} naira a litre: shortfall ${f.localL(p.shortfallPerLitre)} naira a litre (positive would mean the cap is below the chain's cost); the cap covers the chain: ${p.capCoversChain}.`,
      `Against a cap of ${f.localL(c.lowCap.capPerLitre)} naira a litre: shortfall ${f.localL(c.lowCap.shortfallPerLitre)} naira a litre; the cap covers the chain: ${c.lowCap.capCoversChain}.`,
      `The same ${L.BADAGRY_ELEMENTS.vat} percent typed as a percent of the landed cost instead of the running total: price ${f.localL(c.vatOnLanded.pricePerLitre)} naira a litre.`,
      `That build-up is complete ${c.vatOnLanded.complete}: the basis changes the amount, and every rate is still supplied.`,
      `With the dealer margin and the levies left blank: complete ${c.dealerAndLeviesBlank.complete}; missing ${c.dealerAndLeviesBlank.missingRates.join(', ')}; price ${f.localL(c.dealerAndLeviesBlank.pricePerLitre)} naira a litre. ${c.dealerAndLeviesBlank.basisOfPrice}`,
      `The BADAGRY build-up on its landed cost of ${f.localL(p.landedPerLitre)} naira a litre. Every element is INVENTED for this course:`,
    ]);
    // The waterfall's drawn base is the engine's running total before each element.
    p.lines.slice(1).forEach((l, i) => expect(l.baseDrawn).toBe(p.lines[i].running));
  });

  it('SECTION 21, where the money in a litre goes', () => {
    const p = S.pump; const c = S.pumpCases;
    const u = c.bridgingUnattributed.groups.find((g) => g.recipient === 'Unattributed');
    pin(21, [
      ...p.groups.map((g) => row(g.recipient, f.localL(g.amountPerLitre), f.share(g.share), g.lines.join('; '))),
      `price ${f.localL(p.pricePerLitre)} naira a litre`,
      `The bridging element with its recipient removed is grouped as ${u.recipient}: ${f.localL(u.amountPerLitre)} naira a litre.`,
      `marginWaterfall on a refused build-up: ${refused(c.refused.waterfallRefusal)}`,
    ]);
  });

  it('SECTION 22, what breaks the price', () => {
    const fx = S.fx; const e = S.fxEdges;
    pin(22, [
      ...fx.points.map((p) => row(f.fx(p.value), f.localL(p.pricePerLitre), f.localL(p.shortfallPerLitre), p.covered)),
      `breakeven: found ${fx.breakeven.found}, at ${f.fx(fx.breakeven.value)} naira to the dollar, after ${fx.breakeven.iterations} bisection steps.`,
      `The exchange rates swept are invented values for the course. priceSensitivity hands solveCrossing the bracket from the lowest to the highest value swept, here ${f.fx(fx.lo)} to ${f.fx(fx.hi)} naira to the dollar.`,
      ...S.fxChain.map((r) => row(f.fx(r.fx), f.localL(r.landedLocal), f.localL(r.government), f.localL(r.pricePerLitre))),
      `Searched only from ${e.narrow.lo} to ${e.narrow.hi}: found ${e.narrow.breakeven.found}; ${refused(e.narrow.breakeven.refusal)} The shortfall at the two ends: ${f.localL(e.narrow.breakeven.atLo)} and ${f.localL(e.narrow.breakeven.atHi)} naira a litre.`,
      `solveCrossing over a bracket written backwards (${e.backwards.lo} to ${e.backwards.hi}): ${refused(e.backwards.breakeven.refusal)}`,
      `With no cap there is nothing to cross: breakeven ${plain(e.noCap.breakeven)}.`,
    ]);
    // The panel's seven evenly spaced rates are the digest's seven rates at the digest's bracket,
    // and its breakeven is the one priceSensitivity itself finds.
    expect(fx.points.map((p) => p.value)).toEqual(L.BADAGRY_FX_VALUES);
    expect(fx.breakeven.value).toBe(S.fxDigest.breakeven.value);
    expect(fx.breakeven.iterations).toBe(S.fxDigest.breakeven.iterations);
    expect(S.fxDigest.points).toEqual(fx.points);
  });

  it('SECTION 23, the rules the engines keep, measured', () => {
    const r = S.rules;
    pin(23, [
      `H2: the volume correction coefficient tables and every published rate stay unshipped. volumeCorrectionFactor refuses without coefficients (SECTION 6), and every template rate is absent: IMPORT_TEMPLATE ships ${r.importLines - r.importRatesShipped} of ${r.importLines} rates as none and PUMP_TEMPLATE ${r.pumpLines - r.pumpRatesShipped} of ${r.pumpLines}.`,
      `a day is not closed without its opening stock (SECTION 7): ${refused(r.noOpening)}`,
      `bays are a whole number, one or more (SECTION 10): 2.5 bays reads "${r.halfBay}"`,
      `pumpable stock is counted tank by tank (SECTION 12): IB-T1 and IB-T2 together hold ${f.m3(r.pair.stockM3)} m3 over a combined heel of ${f.m3(r.pair.heelM3)} m3 and their pumpable stock is ${f.m3(r.pair.pumpableStockM3)} m3.`,
      `insurance quoted on CIF is solved in closed form (SECTION 18): CIF ${f.usd(r.cif)} USD on the BADAGRY cargo.`,
      `a load time of zero minutes is refused (SECTION 10): "${r.zeroLoad}"`,
      `throughputEconomics needs the throughput and the fee (SECTION 13): "${r.blankFee}" A blank cost or loss is taken as zero and named in assumedZero.`,
      `tankFarmCover with no daily throughput gives no days of cover and no turns (SECTION 12): turns a year ${plain(r.noThroughputTurns)}.`,
    ]);
    pin(24, [`On the synthetic row: VCF at 15 C is ${f.vcf(r.vcfAt15)}, exactly one: ${r.vcfAt15 === 1}.`]);
  });

  it('NEGATIVE CONTROL: one volume moved by a litre no longer matches the digest', () => {
    const d = S.day;
    const good = row('unaccounted m3', f.m3(d.unaccountedM3));
    const moved = row('unaccounted m3', f.m3(d.unaccountedM3 + 0.001));
    expect(SECTIONS[7]).toContain(good);
    expect(SECTIONS[7]).not.toContain(moved);
    expect(() => pin(7, [moved])).toThrow();
  });
});

// ---------------------------------------------------------------------------
// MISSING STAYS MISSING, at the controls a panel moves.
// ---------------------------------------------------------------------------

describe('MISSING STAYS MISSING: a blank control reaches the engine as missing', () => {
  it('a blank opening stock is refused, never taken as zero', () => {
    const r = L.dayAt({ openingM3: '' });
    expect(r.refusal).toBeTruthy();
    expect(r.unaccountedM3).toBeNull();
  });

  it('a blank, zero or fractional bay count shows the engine\'s refusal', () => {
    ['', '0', '2.5', null].forEach((b) => {
      const r = L.rackAt({ bays: b });
      expect(r.refusal, `bays ${b}`).toBe(S.rackRefusals[0].refusal);
      expect(r.probabilityOfWaiting).toBeNull();
    });
    expect(L.rackAt({ bays: '4' }).probabilityOfWaiting).toBe(S.rack.probabilityOfWaiting);
  });

  it('a blank density or blank coefficients are refused, never defaulted', () => {
    expect(L.vcfAt('', 31.5).refusal).toBeTruthy();
    expect(L.vcfAt(741.6, 31.5, null).refusal).toBe(S.vcfRefusals[0].message);
    expect(L.cargoAt(34000, 'tonne', '').refusal).toBeTruthy();
    expect(L.economicsAt({ productDensityKgM3: '' }).lossTonnes).toBeNull();
  });

  it('a blank VCF leaves the standard volume missing and the gross reported', () => {
    const r = L.morningAt({ 'AK-01': '' });
    expect(r.rows[0].standardM3).toBeNull();
    expect(r.rows[0].grossM3).toBe(S.morning.rows[0].grossM3);
    expect(r.closingStandardM3).toBeNull();
  });

  it('a blank rate is a missing rate and the total is labelled a floor', () => {
    const r = L.landedAt({ rates: { ...L.BADAGRY_RATES, duty: '' } });
    expect(r.complete).toBe(false);
    expect(r.missingRates).toEqual(['Import duty']);
    const p = L.pumpAt({ elements: { ...L.BADAGRY_ELEMENTS, dealer: '' } });
    expect(p.complete).toBe(false);
    expect(p.missingRates).toEqual(['Dealer margin']);
  });

  it('a blank cost box is named by the engine', () => {
    const r = L.laneAt({ overheadPerTrip: '' });
    expect(r.complete).toBe(false);
    expect(r.missingInputs).toEqual(['Overhead']);
  });

  it('the opening stock taken from the closing dip balances at any dip, and only the demonstration does it', () => {
    [4000, 4499.452, 5000].forEach((c) => {
      const o = L.openingFromClosingDerived(c);
      const r = L.dayAt({ openingM3: String(o), closingDippedM3: c });
      expect(f.m3(r.unaccountedM3)).toBe('0.000');
    });
    expect(L.openingFromClosingDerived('')).toBeNull();
    // The panel's day starts on the record, the digest's opening stock.
    expect(S.day.inputs.openingM3).toBe(L.AKODO_DAY.openingM3);
    expect(sourceOf('TankExplorer.jsx')).toMatch(/SECTION 7&apos;s demonstration/);
  });

  it('no control offers a list of coefficients or real rates', () => {
    PANEL_FILES.forEach((file) => {
      const code = strip(sourceOf(file));
      expect(code, file).not.toMatch(/PRODUCT_REFERENCE/);
      expect(code, file).not.toMatch(/commodity group['"]?\s*[,:]/i);
    });
  });
});

// ---------------------------------------------------------------------------
// THE SURFACE, THE CLOCK AND THE ZONE.
// ---------------------------------------------------------------------------

describe('the surface a panel reads is plain data', () => {
  it('no Date object, no NaN and no undefined anywhere in it', () => {
    const bad = [];
    let leaves = 0;
    walk(S, 'S', (v, p) => {
      if (Object.prototype.toString.call(v) === '[object Date]') bad.push(`${p} is a Date`);
      if (typeof v === 'number' && !Number.isFinite(v)) bad.push(`${p} is ${v}`);
      if (v === undefined) bad.push(`${p} is undefined`);
      if (v === null || typeof v !== 'object') leaves += 1;
    });
    expect(bad).toEqual([]);
    expect(leaves).toBeGreaterThan(2000);
  });
});

describe('THE CLOCK GATE: nothing reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('AT RUN TIME: the whole snapshot is identical under two faked system dates', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const early = JSON.stringify(L.teachingSurface());
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    const late = JSON.stringify(L.teachingSurface());
    expect(late.length).toBeGreaterThan(50000);
    expect(late).toBe(early);
  });

  it('CONTROL: the faked clock does move, so the gate can see a reader that used it', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const a = Date.now();
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    expect(Date.now()).not.toBe(a);
  });

  it('no source reads a clock or a random number, and none constructs a date', () => {
    ALL_SOURCES.forEach((file) => {
      const code = strip(sourceOf(file));
      expect(code.length, `${file} was stripped to nothing`).toBeGreaterThan(400);
      expect(code, `${file} reads a clock`).not.toMatch(/new Date\(|Date\.now|performance\.now|Math\.random/);
    });
    // Neither engine reads one either.
    expect(strip(ENGINE_SRC)).not.toMatch(/new Date\(|Date\.now|performance\.now|Math\.random/);
    // CONTROL on the stripper and the pattern.
    expect(strip('// new Date() in a comment\nconst x = 1;\n')).not.toContain('new Date');
    expect(strip('const now = Date.now();\n')).toMatch(/Date\.now/);
  });
});

const ZONES = [['Pacific/Pago_Pago', -660], ['Pacific/Kiritimati', 840]];
const CHILD_ZONE = process.env.SUPPLY_TZ_CHILD;
const SIDECAR = process.env.SUPPLY_TZ_SIDECAR;

describe('THE ZONE GATE: the lab reproduces byte for byte on both sides of the date line', () => {
  ZONES.forEach(([zone, offset]) => {
    it(`the whole snapshot under TZ=${zone} is byte-identical`, () => {
      if (CHILD_ZONE) {
        if (CHILD_ZONE !== zone) return;
        const offsetMinutes = -new Date('2026-10-15T12:00:00Z').getTimezoneOffset();
        fs.writeFileSync(SIDECAR, JSON.stringify({
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          offsetMinutes,
          snapshot: JSON.stringify(L.teachingSurface()),
        }));
        return;
      }
      const sidecar = path.join(ROOT, 'node_modules', `.supply-tz-${zone.replace(/\W/g, '_')}.json`);
      if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
      execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), [
        'run', '--reporter=dot', '--config', 'vitest.config.js',
        'src/components/course/panels/supply/supplyLab.test.js',
        '-t', `under TZ=${zone} is byte-identical`,
      ], {
        cwd: ROOT,
        env: { ...process.env, TZ: zone, SUPPLY_TZ_CHILD: zone, SUPPLY_TZ_SIDECAR: sidecar },
        stdio: 'pipe',
        timeout: 600000,
      });
      expect(fs.existsSync(sidecar), 'the child wrote no snapshot').toBe(true);
      const child = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
      fs.unlinkSync(sidecar);
      // CONTROL: the child really ran in that zone, on its side of the date line.
      expect(child.timeZone).toBe(zone);
      expect(child.offsetMinutes).toBe(offset);
      expect(child.snapshot.length).toBeGreaterThan(50000);
      expect(child.snapshot).toBe(JSON.stringify(L.teachingSurface()));
    }, 600000);
  });
});

// ---------------------------------------------------------------------------
// THE RENDER GATE.
// ---------------------------------------------------------------------------

const MODE_COMPONENTS = [
  ['TankExplorer', TE, TankExplorer, ['TableMode', 'WaterMode', 'VcfMode', 'DayMode']],
  ['DepotExplorer', DE, DepotExplorer, ['RackMode', 'FarmMode', 'EconomicsMode', 'LaneMode']],
  ['PriceExplorer', PE, PriceExplorer, ['CargoMode', 'LandedMode', 'LossMode', 'PumpMode', 'FxMode']],
];

const noop = () => {};
const REAL_PROPS = {
  TableMode: () => ({
    tables: L.akodoTablesAt(), reading: L.dipAt('AK-01', 9318), sweep: L.dipSweepAt(), partialRows: L.partialDipsAt(), above: L.aboveLastAt(),
    curve: L.curveAt(), tank: 'AK-01', onTank: noop, dip: '9318', onDip: noop, partial: false, onPartial: noop,
  }),
  WaterMode: () => ({
    water: L.waterAt('AK-03', 1847, 41), sweep: L.waterSweepAt(), tables: L.akodoTablesAt(), tank: 'AK-03', onTank: noop, dip: '1847', onDip: noop, cut: '41', onCut: noop,
  }),
  VcfMode: () => ({
    morning: L.morningAt(), vcfs: { 'AK-01': '0.9803', 'AK-02': '0.9876', 'AK-03': '0.9884' }, onVcf: noop, synth: L.vcfAt(741.6, 31.5),
    curve: L.vcfCurveAt(741.6), refusals: L.vcfRefusalsAt(), rho: '741.6', onRho: noop, temp: '31.5', onTemp: noop,
  }),
  DayMode: () => ({
    day: L.dayAt(), inputs: L.dayAt().inputs, onInput: noop, onDemo: noop, onRecord: noop, cannotFail: L.cannotFailAt(),
    tolSweep: L.toleranceSweepAt(), trend: L.trendAt(9), daysKept: '9', onDaysKept: noop,
  }),
  RackMode: () => ({
    rack: L.rackAt(), curve: L.rackCurveAt(), baySweep: L.baySweepAt(), arrivalSweep: L.arrivalSweepAt(), inputs: { arrivalsPerHour: '9', loadMinutes: '24', bays: '4' }, onInput: noop,
  }),
  FarmMode: () => ({ farm: L.farmAt(), stocks: null, onStock: noop, daily: '2640', onDaily: noop }),
  EconomicsMode: () => ({ econ: L.economicsAt(), inputs: L.economicsAt().inputs, onInput: noop }),
  LaneMode: () => ({
    lane: L.laneAt(), laneInputs: L.laneAt().inputs, onLane: noop, fleet: L.fleetAt(), demand: '1260000', onDemand: noop,
    station: L.stationAt(), stationInputs: L.stationAt().inputs, onStation: noop, nozzles: L.nozzleSweepAt(),
  }),
  CargoMode: () => ({ cargo: L.cargoAt(), units: L.cargoUnitsAt(), densities: L.cargoDensitiesAt(), inputs: { quantity: '34000', unit: 'tonne', densityKgM3: '742.8' }, onInput: noop }),
  LandedMode: () => ({ landed: L.landedAt(), rates: L.BADAGRY_RATES, onRate: noop, basis: 'cif', onBasis: noop, refusals: L.landedRefusalsAt() }),
  LossMode: () => ({ landed: L.landedAt(), curve: L.lossCurveAt(), h1: L.h1At(), loss: '0.45', onLoss: noop }),
  PumpMode: () => ({ pump: L.pumpAt(), elements: L.BADAGRY_ELEMENTS, onElement: noop, cap: '1150', onCap: noop, vatBasis: 'running', onVatBasis: noop }),
  FxMode: () => ({ fx: L.fxAt(), inputs: { lo: '1200', hi: '2100', capPerLitre: '1150' }, onInput: noop }),
};

describe('THE RENDER GATE', () => {
  it('every mode in a MODES list has a component, and every mode has a real-props builder', () => {
    MODE_COMPONENTS.forEach(([name, ns, , comps]) => {
      expect(ns.MODES.length, name).toBe(comps.length);
      comps.forEach((k) => expect(typeof ns[k], `${name}.${k}`).toBe('function'));
    });
    const all = MODE_COMPONENTS.flatMap(([, , , comps]) => comps);
    expect(Object.keys(REAL_PROPS).sort()).toEqual([...all].sort());
  });

  MODE_COMPONENTS.forEach(([name, ns, , comps]) => {
    comps.forEach((k) => {
      it(`${name}.${k} renders its empty state with nothing, and with an error-shaped object`, () => {
        const err = { error: 'nothing' };
        const html1 = renderToStaticMarkup(React.createElement(ns[k], {}));
        const props = Object.fromEntries(Object.keys(REAL_PROPS[k]()).map((p) => [p, err]));
        const html2 = renderToStaticMarkup(React.createElement(ns[k], props));
        expect(html1.length).toBeGreaterThan(20);
        expect(html2.length).toBeGreaterThan(20);
      });

      it(`${name}.${k} renders on real data, and with each data prop error-shaped in turn`, () => {
        const real = REAL_PROPS[k]();
        const full = renderToStaticMarkup(React.createElement(ns[k], real));
        expect(full.length).toBeGreaterThan(400);
        expect(full).not.toContain('has returned nothing');
        const dataProps = Object.keys(real).filter((p) => real[p] && typeof real[p] === 'object');
        expect(dataProps.length).toBeGreaterThan(0);
        dataProps.forEach((p) => {
          const html = renderToStaticMarkup(React.createElement(ns[k], { ...real, [p]: { error: 'nothing' } }));
          expect(html.length, `${k} with ${p} error-shaped`).toBeGreaterThan(20);
        });
      });
    });
  });

  MODE_COMPONENTS.forEach(([name, ns, Panel]) => {
    ns.MODES.forEach(([mode]) => {
      it(`${name} renders on real data in its ${mode} view`, () => {
        const html = renderToStaticMarkup(React.createElement(Panel, { initialMode: mode }));
        expect(html.length).toBeGreaterThan(1500);
        expect(html).not.toContain('has returned nothing');
      });
    });
  });

  it('every ResponsiveContainer is given a width and a height', () => {
    let seen = 0;
    PANEL_FILES.forEach((file) => {
      const tags = sourceOf(file).match(/<ResponsiveContainer[^>]*>/g) || [];
      seen += tags.length;
      tags.forEach((t) => {
        expect(t, file).toContain('width=');
        expect(t, file).toContain('height=');
      });
    });
    expect(seen).toBeGreaterThanOrEqual(10);
  });
});

// ---------------------------------------------------------------------------
// THE REFUSAL LITERAL GATE, and THE COPY RULE.
// ---------------------------------------------------------------------------

const stringsIn = (surface) => {
  const out = [];
  walk(surface, 'S', (v, p) => { if (typeof v === 'string') out.push([p, v]); });
  return out;
};

const REFUSAL_KEYS = /\.(refusal|message|note|carbonNote|basisOfTotal|basisOfPrice|prompt|ullageWarning|waterfallRefusal)$/;

describe('THE REFUSAL LITERAL GATE: every refusal a panel shows is the engine\'s own', () => {
  it('no engine sentence is typed into the lab, a panel or the page', () => {
    const sentences = [...new Set(stringsIn(S).filter(([p, v]) => REFUSAL_KEYS.test(p) && v.length > 30).map(([, v]) => v))];
    expect(sentences.length, 'the lab returns almost no engine sentences, so this sweep is vacuous').toBeGreaterThanOrEqual(30);
    ALL_SOURCES.forEach((file) => {
      const text = sourceOf(file);
      const typed = sentences.filter((r) => text.includes(r.slice(0, 40)));
      expect(typed, `${file} types an engine sentence`).toEqual([]);
    });
    // CONTROL: the sweep finds one when it is there.
    expect(sentences.some((r) => `const x = '${sentences[0]}';`.includes(r.slice(0, 40)))).toBe(true);
  });
});

const EM = '—';
const EN = '–';
const CONTRASTIVE = /,\s+not\s+\w/;
const breaches = (s) => CONTRASTIVE.test(s) || s.includes(EM) || s.includes(EN) || / -- /.test(s);

/**
 * THE ENGINE SENTENCES THAT BREACH THE OWNER COPY RULE, exempt by exact prefix
 * and pinned to the vendored engine. PANELS.md names them: the engine's "A FLOOR"
 * sentences may be shown verbatim as the engine's words. A dead exemption fails.
 */
const COPY_RULE_EXEMPTIONS = ['A FLOOR, not a cost: ', 'A FLOOR, not a price: '];

describe('THE OWNER COPY RULE: no em dash, no en dash and no contrastive', () => {
  it('no source line breaches it', () => {
    ALL_SOURCES.forEach((file) => {
      const bad = sourceOf(file).split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => breaches(l));
      expect(bad.map(([n, l]) => `${file}:${n}: ${l.trim()}`)).toEqual([]);
    });
  });

  it('CONTROL: the detector fires on all four shapes', () => {
    expect(breaches(`an em dash ${EM} here`)).toBe(true);
    expect(breaches(`a range 1${EN}2`)).toBe(true);
    expect(breaches('a double -- hyphen')).toBe(true);
    expect(breaches('this thing, not that thing')).toBe(true);
    expect(breaches('a clean sentence')).toBe(false);
  });

  it('every string the lab hands a panel obeys it, except the engine\'s FLOOR sentences', () => {
    const strings = stringsIn(S);
    expect(strings.length).toBeGreaterThanOrEqual(500);
    const offenders = strings.filter(([, s]) => breaches(s));
    const unexcused = offenders.filter(([, s]) => !COPY_RULE_EXEMPTIONS.some((ex) => s.startsWith(ex)));
    expect(unexcused.map(([p, s]) => `${p}: ${s}`)).toEqual([]);
  });

  it('A DEAD EXEMPTION FAILS: each exempt sentence is still returned and still in the engine', () => {
    const strings = stringsIn(S).map(([, s]) => s);
    COPY_RULE_EXEMPTIONS.forEach((ex) => {
      expect(strings.some((s) => s.startsWith(ex)), `"${ex}" matches nothing the lab returns`).toBe(true);
      expect(breaches(ex)).toBe(true);
      expect(ENGINE_SRC, `"${ex}" is no longer in the vendored engine`).toContain(ex.trim());
    });
  });
});
