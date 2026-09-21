// Every value the refinery teaching lab exposes to a panel or to the course page
// is pinned here against the teaching digest
// (tools/course-waves/refinery/digest.txt), which is itself nothing but the
// vendored downstream engines' and screening engine's return values on the
// OKORDIA, ABUA and ODIOMA records, dated from one period start and valued from
// one start year.
//
// THE GATES, and each one carries a control that is made to fire:
//
//   AGREEMENT WITH THE DIGEST  every reader's return at the digest's own inputs
//                      is rebuilt into the digest's own lines, row by row and
//                      sentence by sentence, and each line must appear in the
//                      section that printed it. The control moves one barrel and
//                      requires the rebuilt line to vanish.
//   THE WAVE INPUTS    read through tools/course-waves/waveInputs.mjs, which
//                      throws and names the file when one is missing. The teaching
//                      records in the lab are compared with refinery_fields.mjs
//                      byte for byte and value for value, the committed copy is
//                      compared with the live wave directory when this machine has
//                      one, and the digest and graded answers are checked against
//                      the sha256 pins in waves.json.
//   THE CLOCK GATE     three ways. Statically, every lab call to a clock-reading
//                      export passes its override, with the clock readers read out
//                      of the engine source by the wave's own clockguard.mjs. At
//                      run time, the whole snapshot is identical under two faked
//                      system dates, with a control proving a bare engine call does
//                      move under them. And no source constructs an empty Date or
//                      reads Date.now.
//   THE ZONE GATE      the whole snapshot is rebuilt in child processes under
//                      Pacific/Pago_Pago and Africa/Lagos and must be byte
//                      identical. NEGATIVE CONTROL: each child also dates the
//                      schedule from a Date built at its own local midnight, and in
//                      Lagos that one must move, exactly as digest SECTION 16 says.
//   NO NPV OR IRR HEADLINE  no key in the surface names an IRR, no panel source
//                      mentions one, and no Tile carries the NPV.
//   THE RENDER GATE    every mode of every panel renders with nothing and with an
//                      error-shaped object, and every panel renders in every mode
//                      on real data.
//   THE COPY RULE      no em dash, no en dash, no double hyphen and no "X, not Y"
//                      over the sources and over every string the lab hands a
//                      panel, with ONE engine sentence exempt by exact string and
//                      pinned to the vendored engine, and a dead exemption fails.
//   THE REFUSAL LITERAL GATE  no engine refusal sentence is typed into the lab, a
//                      panel or the page.
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
/* eslint-disable import/namespace */
import * as L from './refineryLab.js';
import {
  waveDir, waveInput, mirrorDir, liveWaveDir, WAVES,
} from '../../../../../tools/course-waves/waveInputs.mjs';
import * as WAVE_FIELDS from '../../../../../tools/course-waves/refinery/refinery_fields.mjs';
import { clockReadersOf, MODULES } from '../../../../../tools/course-waves/refinery/clockguard.mjs';
import ScreenExplorer, * as SE from './ScreenExplorer.jsx';
import PlanExplorer, * as PE from './PlanExplorer.jsx';
import VarianceExplorer, * as VE from './VarianceExplorer.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

const WAVE_NAME = 'refinery';
const WAVE = waveDir(WAVE_NAME);
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE_WAVE = liveWaveDir(WAVE_NAME);
const DIGEST = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');
const FIELDS_JSON = fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8');
const FIELDS_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'refinery_fields.mjs'), 'utf8');
const DUMP_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'refinery_dump.mjs'), 'utf8');
const ENGINES = path.join(ROOT, 'packages/engines');
const ENGINE_SRC = Object.fromEntries(Object.entries(MODULES).map(([m, rel]) => [m, fs.readFileSync(path.join(ENGINES, rel), 'utf8')]));

const LAB_FILE = 'refineryLab.js';
const PANEL_FILES = ['ScreenExplorer.jsx', 'PlanExplorer.jsx', 'VarianceExplorer.jsx'];
const SHARED_FILES = ['panelBits.jsx'];
const PAGE_FILE = 'RefineryLearningPage.jsx';
const LEARNING_PAGE = path.resolve(ROOT, 'src/pages/apps', PAGE_FILE);

const sourceOf = (file) => {
  const p = file === PAGE_FILE ? LEARNING_PAGE : path.join(HERE, file);
  if (!fs.existsSync(p)) {
    throw new Error(`source missing: ${file} is named in this suite's file list and is not at ${p}. `
      + 'A renamed or deleted file fails here rather than emptying the gates that read it.');
  }
  return fs.readFileSync(p, 'utf8');
};
const ALL_SOURCES = [LAB_FILE, ...SHARED_FILES, ...PANEL_FILES, PAGE_FILE];
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/ .*$/gm, '');

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
const row = (...cells) => `| ${cells.join(' | ')} |`;
const q = (s) => `"${s}"`;
const refused = (s) => `REFUSED: ${q(s)}`;
const {
  bbl, usd, pbl, pct, frac, mmd,
} = L;

/** Every line a section must carry, collected so a failure names them all. */
const pin = (n, lines) => {
  const have = new Set(SECTIONS[n] || []);
  const missing = lines.filter((l) => !have.has(l));
  expect(SECTIONS[n], `the digest has no SECTION ${n}`).toBeTruthy();
  expect(lines.length, `SECTION ${n} was pinned with nothing`).toBeGreaterThan(0);
  expect(missing, `SECTION ${n}: these lines the lab rebuilds are not in the digest`).toEqual([]);
};
/** A line that must START a line of the section (where the digest goes on to print more). */
const pinStart = (n, prefixes) => {
  const have = SECTIONS[n] || [];
  const missing = prefixes.filter((p) => !have.some((l) => l.startsWith(p)));
  expect(missing, `SECTION ${n}: these line starts are not in the digest`).toEqual([]);
};

const S = L.teachingSurface();
const byLabel = (rows, label) => rows.find((r) => r.label === label);

// ---------------------------------------------------------------------------

describe('the wave inputs and the teaching records', () => {
  it('the digest is whole: all twenty-four sections, at the period start and start year the lab uses', () => {
    expect(Object.keys(SECTIONS).length).toBe(24);
    expect(DIGEST.split('\n').length).toBeGreaterThan(700);
    expect(DIGEST).toContain(`# PERIOD START: ${L.PERIOD_START}, a ${L.PERIOD_DAYS}-day period.`);
    expect(DIGEST).toContain(`START YEAR: ${L.START_YEAR}, passed to every valuation.`);
    expect(typeof L.PERIOD_START).toBe('string');
  });

  it('the digest and the graded answers are the bytes waves.json pins', () => {
    const pins = WAVES[WAVE_NAME].pins;
    const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
    expect(sha(DIGEST)).toBe(pins['digest.txt']);
    expect(sha(FIELDS_JSON)).toBe(pins['fields.json']);
  });

  it('THE MIRROR GATE: the committed copy is the wave, and this gate says which it compared', () => {
    const named = WAVES[WAVE_NAME].inputs;
    expect(named.length).toBeGreaterThanOrEqual(30);
    named.forEach((f) => expect(fs.existsSync(path.join(WAVE, f)), `${f} is missing from ${WAVE}`).toBe(true));
    if (LIVE_WAVE) {
      const differing = named.filter((f) => {
        const live = path.join(LIVE_WAVE, f);
        return !fs.existsSync(live) || !fs.readFileSync(path.join(MIRROR, f)).equals(fs.readFileSync(live));
      });
      // eslint-disable-next-line no-console
      console.log(`[mirror gate] byte-compared ${named.length} inputs against the LIVE wave directory ${LIVE_WAVE}`);
      expect(differing, `the committed copy has drifted from ${LIVE_WAVE}`).toEqual([]);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[mirror gate] no live wave directory on this machine, so the committed copy at ${MIRROR} was checked for completeness`);
      expect(path.resolve(WAVE)).toBe(path.resolve(MIRROR));
    }
  });

  it('the teaching records are copied VERBATIM from refinery_fields.mjs, byte for byte', () => {
    const lab = sourceOf(LAB_FILE);
    const begin = '// ---- BEGIN VERBATIM refinery_fields.mjs ----\n';
    const end = '// ---- END VERBATIM refinery_fields.mjs ----';
    expect(lab).toContain(begin);
    expect(lab).toContain(end);
    const block = lab.slice(lab.indexOf(begin) + begin.length, lab.indexOf(end));
    const wave = FIELDS_MJS.slice(FIELDS_MJS.indexOf('export const PERIOD_START'));
    expect(wave.length, 'the wave file carries almost nothing').toBeGreaterThan(6000);
    expect(block).toBe(wave);
    expect(DUMP_MJS).toContain("import * as F from './refinery_fields.mjs';");
  });

  it('and they AGREE IN VALUE with the wave file when run, not only as text', () => {
    const names = Object.keys(WAVE_FIELDS);
    expect(names.length).toBeGreaterThanOrEqual(7);
    const differing = names.filter((k) => JSON.stringify(L[k]) !== JSON.stringify(WAVE_FIELDS[k]));
    expect(differing).toEqual([]);
  });

  it('every engine member the lab names resolves in the vendored modules', () => {
    const code = strip(sourceOf(LAB_FILE));
    const used = [...code.matchAll(/\b(MR|RP|SM|SC)\.([A-Za-z_]\w*)/g)].map((m) => [m[1], m[2]]);
    expect(used.length).toBeGreaterThan(40);
    const missing = used.filter(([ns, name]) => L.ENGINE[ns][name] === undefined).map(([ns, n]) => `${ns}.${n}`);
    expect([...new Set(missing)]).toEqual([]);
  });
});

// ---------------------------------------------------------------------------

describe('AGREEMENT WITH THE DIGEST, section by section', () => {
  it('SECTION 1, the modules, their counts and their lists', () => {
    const readers = Object.fromEntries(Object.entries(ENGINE_SRC).map(([m, src]) => [m, clockReadersOf(src)]));
    pin(1, S.counts.map((c) => row(c.module, c.functions, c.constants, readers[c.module].length ? readers[c.module].join(', ') : 'none')).concat([
      `modularRefinery.SCALING_EXPONENT: STICK_BUILT ${L.SCALING_EXPONENT.STICK_BUILT}, MODULAR ${L.SCALING_EXPONENT.MODULAR}`,
      `modularRefinery.CONFIGURATIONS: ${L.CONFIGURATION_IDS.join(', ')}`,
      `modularRefinery.SUPPLY_SCENARIOS: ${L.SUPPLY_SCENARIOS.map((s) => s.id).join(', ')}`,
      `modularRefinery.LICENSING_STAGES: ${L.LICENSING_STAGES.map((s) => s.name).join(', ')}`,
    ]));
  });

  it('SECTION 2, every blank box and out-of-range entry, in the engine\'s words', () => {
    const r = S.refusals;
    pin(2, [
      ...r.streams.map((x) => (x.error ? row(x.label, refused(x.error)) : row(x.label, `answered: annual throughput ${bbl(x.annualBbl)} bbl`))),
      ...r.scale.map((x) => row(x.label, String(x.cost), String(x.perBpd))),
      ...r.economics.map((x) => row(x.label, refused(x.error))),
    ]);
    expect(r.streams.filter((x) => x.error)).toHaveLength(8);
    expect(r.economics.every((x) => x.error)).toBe(true);
  });

  it('SECTION 3, both laws, the crossover, and the default exponent', () => {
    const t = S.scale.table;
    pin(3, t.map((x) => row(x.capacity, usd(x.modularCost), usd(x.modularPerBpd), usd(x.stickBuiltCost), usd(x.stickBuiltPerBpd), frac(x.ratio), String(x.modularCheaper), String(x.lawsEqual))).concat([
      `The same quotation scaled with an exponent of 1 (cost in proportion to capacity) at 10000 bpd: ${usd(S.scale.linearAt10000.cost)}, ${usd(S.scale.linearAt10000.perBpd)} per bpd.`,
      `scaleCapex at 20000 bpd with no exponent passed: cost ${usd(L.scaleAt({ capacity: 20000 }).noExponentPassed.cost)}, exponent ${L.scaleAt({ capacity: 20000 }).noExponentPassed.exponent}.`,
    ]));
    // The crossover the chart marks sits at the reference size.
    const atRef = t.find((x) => x.capacity === S.scale.reference.capacity);
    expect(atRef.lawsEqual).toBe(true);
    expect(S.scale.curve.find((x) => x.capacity === S.scale.reference.capacity).lawsEqual).toBe(true);
  });

  it('SECTION 3, the exponent controls move the capital and the reference point does not move', () => {
    const lower = L.scaleAt({ capacity: 20000, modularExponent: 0.8 });
    const base = L.scaleAt({ capacity: 20000 });
    expect(lower.point.modularCost).toBeLessThan(base.point.modularCost);
    expect(L.scaleAt({ capacity: 5000, modularExponent: 0.7, stickBuiltExponent: 0.45 }).point.lawsEqual).toBe(true);
  });

  it('SECTION 4, the configurations, every slate, a blank price and yields that do not close', () => {
    const cols = ['lpg', 'naphtha', 'gasoline', 'kerosene', 'diesel', 'fuelOil', 'loss'];
    const lines = [];
    S.slates.forEach((s) => {
      const y = s.productYields;
      lines.push(row(s.configuration.name, s.configuration.units.join(', '), ...cols.map((k) => (y[k] === undefined ? '-' : frac(y[k])))));
      s.rows.forEach((r) => lines.push(row(r.id, frac(r.yieldFraction), pbl(r.pricePerBbl), pbl(r.valuePerBblCrude))));
      lines.push(`gross value per barrel of crude ${pbl(s.grossValuePerBbl)}; yields total ${frac(s.yieldTotal)}; yields close ${s.yieldsClose}; unpriced: ${s.unpriced.length ? s.unpriced.join(', ') : 'none'}`);
    });
    const b = S.slateNaphthaBlank;
    lines.push(`Topping with the naphtha price left blank: gross value ${pbl(b.grossValuePerBbl)}; unpriced: ${b.unpriced.join(', ')}. The unpriced product is named and adds nothing to the value.`);
    const t = S.slateYieldsTyped;
    lines.push(`Hydroskimming yields typed as ${Object.entries(L.OKORDIA.yieldsTyped).map(([k, v]) => `${k} ${frac(v)}`).join(', ')}: yields total ${frac(t.yieldTotal)}; yields close ${t.yieldsClose}; gross value ${pbl(t.grossValuePerBbl)}. The engine reports the gap and does not normalise the yields.`);
    pin(4, lines);
    // A price box blanked in the panel reaches the engine as '' and comes back named.
    const blanked = L.slateOf({ configurationId: 'topping', prices: { ...L.OKORDIA.prices, naphtha: '' } });
    expect(blanked.unpriced).toEqual(['naphtha']);
    expect(pbl(blanked.grossValuePerBbl)).toBe(pbl(b.grossValuePerBbl));
    expect(S.slates.every((s) => s.loss !== null)).toBe(true);
  });

  it('SECTION 5, the OKORDIA streams, column by column, and the schedule terms', () => {
    const s = S.screen;
    const shown = s.years.filter((y) => y.year <= 3 || y.year === s.years.length - 1);
    const nameplate = L.screenOf({ utilisation: 1 });
    const zero = L.screenOf({ constructionYears: 0 });
    const three = L.screenOf({ constructionYears: 3 });
    pin(5, [
      `capital (modular law at the reference point): ${usd(s.capex)}; capital per bpd ${usd(s.capexPerBpd)}`,
      `annual throughput = capacity x on-stream days x utilisation: ${bbl(s.annualBbl)} bbl`,
      `gross value per barrel of crude ${pbl(s.grossValuePerBbl)}; gross margin per barrel = gross value - crude cost - variable operating cost: ${pbl(s.grossMarginPerBbl)}`,
      ...shown.map((y) => row(y.year, String(y.producing), bbl(y.crudeBbl), usd(y.revenue), usd(y.crudeCost), usd(y.fixedOpex), usd(y.variableOpex), usd(y.capex))),
      `years in the streams: ${s.yearsInStreams} (construction years plus operating years)`,
      `The same plant at utilisation 1 (nameplate every on-stream day): annual throughput ${bbl(nameplate.annualBbl)} bbl.`,
      `With no construction period the capital is spent in year 0, the first operating year: year 0 capex ${usd(zero.years[0].capex)}, year 0 crude run ${bbl(zero.years[0].crudeBbl)} bbl, years in the streams ${zero.yearsInStreams}.`,
      `With three construction years the capital is spread evenly: ${three.years.slice(0, 3).map((y) => usd(y.capex)).join(', ')}.`,
      ...S.termDefaults.map((r) => row(r.label, bbl(r.annualBbl), r.yearsInStreams, usd(r.year0Capex))),
    ]);
    pinStart(5, [`The table prints years 0 to 3 and the last year. Every producing year carries the same figures as year ${s.firstProducingYear}: true. The first producing year is year ${s.firstProducingYear}; the last is year ${s.yearsInStreams - 1}.`]);
    expect(three.firstProducingYear).toBe(3);
  });

  it('SECTION 5, a typed utilisation and a blank box reach the engine as typed', () => {
    expect(L.screenOf({ utilisation: '90' }).error).toBe(byLabel(S.refusals.streams, 'utilisation typed as 90').error);
    expect(L.screenOf({ crudeCostPerBbl: '' }).error).toBe(byLabel(S.refusals.streams, 'crude cost left blank').error);
    expect(L.screenOf({ capexTyped: '' }).error).toBe(byLabel(S.refusals.streams, 'capital cost left blank').error);
    expect(L.screenOf({ onstreamDays: '400' }).error).toBe(byLabel(S.refusals.streams, 'on-stream days typed as 400').error);
    // A blank crude cost is not turned into the premium on the way in.
    expect(L.screenOf({ scenarioId: 'tight', crudeCostPerBbl: '' }).error).toBe(byLabel(S.refusals.streams, 'crude cost left blank').error);
    // A typed utilisation left blank reads as the engine's default.
    expect(bbl(L.screenOf({ utilisation: '' }).annualBbl)).toBe(bbl(L.screenOf({ utilisation: 0.9 }).annualBbl));
  });

  it('SECTION 6, the scenarios as the engine exports them, and OKORDIA under each', () => {
    pin(6, L.SUPPLY_SCENARIOS.map((s) => row(s.id, s.name, frac(s.utilisation), pbl(s.crudePremium), q(s.note)))
      .concat(S.scenarios.map((s) => row(s.id, pbl(s.crudeCostWithPremium), bbl(s.annualBbl), pbl(s.grossMarginPerBbl), usd(s.firstRevenue), usd(s.firstCrudeCost)))));
  });

  it('SECTION 7, the licensing stages, and progress ticked in and out of order', () => {
    pin(7, L.LICENSING_STAGES.map((s) => row(s.stage, s.id, s.name, s.typicalEvidence.join('; ')))
      .concat(S.licensing.map((p) => row(p.completed.length ? p.completed.join(', ') : '(none)', p.completeCount, p.nextStage === null ? 'null' : p.nextStage, String(p.outOfOrder)))));
  });

  it('SECTION 8, every configuration under every scenario', () => {
    expect(S.screenTable).toHaveLength(9);
    pin(8, S.screenTable.map((r) => row(r.configurationId, r.scenarioId, pbl(r.grossValuePerBbl), bbl(r.annualBbl), pbl(r.grossMarginPerBbl), usd(r.firstRevenue))));
  });

  it('SECTION 9, the ABUA configuration, and the hydrotreater three ways', () => {
    const A = L.ABUA;
    const [typed, shut, blank] = S.hydrotreater;
    pin(9, [
      ...A.crudes.map((c) => row(c.name, pbl(c.cost), bbl(c.available), ...A.streams.map((s) => (c.yields[s] === undefined ? '-' : frac(c.yields[s]))))),
      ...A.products.map((p) => row(p.name, pbl(p.price), bbl(p.minDemand), bbl(p.maxDemand), Object.entries(p.recipe).map(([k, v]) => `${k} ${frac(v)}`).join(', '))),
      row(`${bbl(typed.typed)} (as typed)`, bbl(typed.throughput), bbl(Number(typed.capacityReported)), bbl(typed.totalCrude), usd(typed.margin)),
      row('0 (typed as shut)', bbl(shut.throughput), bbl(Number(shut.capacityReported)), bbl(shut.totalCrude), usd(shut.margin)),
      row('blank', bbl(blank.throughput), 'no limit', bbl(blank.totalCrude), usd(blank.margin)),
      `utilisation the plan reports for a unit with a blank capacity: ${blank.utilisation}; for a unit typed as 0: ${shut.utilisation}. A utilisation needs a finite capacity above zero.`,
    ]);
    expect(blank.capacityReported).toBe('Infinity');
  });

  it('SECTION 10, the refusals, the infeasible plan and the unbounded plan', () => {
    pin(10, S.planRefusals.map((r) => row(r.label, r.status, refused(r.error))).concat([
      `The missing list the engine returns with the blank reformer operating cost and jet price: ${byLabel(S.planRefusals, L.ABUA.refusals[1].label).missing.join('; ')}.`,
    ]));
    expect(S.planRefusals.map((r) => r.status)).toEqual(['invalid', 'invalid', 'invalid', 'invalid', 'infeasible', 'unbounded', 'invalid', 'invalid']);
  });

  it('SECTION 11, the crude unit carries every barrel, and the plan with no feedless unit', () => {
    const p = S.plan;
    const cdu = p.crudeUnit;
    const fedCdu = S.fed.units.find((u) => u.id === 'cdu');
    pin(11, [
      ...p.crudes.map((c) => row(c.name, bbl(c.volume), bbl(c.available), usd(c.cost))),
      ...p.units.map((u) => row(u.name, String(u.crudeUnit), bbl(u.throughput), bbl(u.capacity), pct(u.utilisation), usd(u.cost))),
      `total crude ${bbl(p.totalCrude)} bbl; crude unit throughput ${bbl(cdu.throughput)} bbl; the two agree to the barrel: ${p.crudeUnitAgrees}`,
      `crude unit throughput ${bbl(fedCdu.throughput)} bbl beside a crude run of ${bbl(S.fed.totalCrude)} bbl; crude unit operating cost ${usd(fedCdu.cost)}; margin ${usd(S.fed.margin)} against ${usd(p.margin)} for the configuration as typed.`,
    ]);
    expect(S.fed.crudeUnit).toBe(null);
  });

  it('SECTION 12, reading the plan: its money, its products, its stream balance and the limits that bind', () => {
    const p = S.plan;
    pin(12, [
      `revenue ${usd(p.revenue)}; crude cost ${usd(p.crudeCost)}; unit operating cost ${usd(p.unitCost)}; margin ${usd(p.margin)}; total crude ${bbl(p.totalCrude)} bbl; gross margin per barrel of crude ${pbl(p.grossMarginPerBbl)}`,
      ...p.products.map((m) => row(m.name, bbl(m.volume), bbl(m.ceiling), String(m.atCeiling), usd(m.revenue))),
      ...p.streams.map((s) => row(s.id, bbl(s.made), bbl(s.consumed), bbl(s.placed), bbl(s.surplus))),
      `units at capacity: ${p.unitsAtCapacity.join(', ')}`,
      `crudes at their availability: ${p.crudesAtAvailability.join(', ')}`,
    ]);
  });

  it('SECTION 13, the plan under five changes', () => {
    pin(13, S.variants.map((v) => row(v.label, v.status, bbl(v.totalCrude), pct(v.crudeUnitUtilisation), usd(v.margin), pbl(v.grossMarginPerBbl), v.marginChange))
      .concat(S.variants.map((v) => row(v.label, pbl(v.grossMarginPerBbl), v.grossMarginChange))));
  });

  it('SECTION 14, every stream value beside its products and its unit, under each change, and the debottleneck sweep', () => {
    const p = S.plan;
    pin(14, [
      ...p.streams.map((s) => row(s.id, pbl(s.marginalValue), bbl(s.surplus), s.goesInto.length ? s.goesInto.map((g) => `${g.name} ${pbl(g.price)}`).join('; ') : '(no product)', s.feeds.length ? s.feeds.join(', ') : '(no unit)')),
      ...S.variants.map((v) => row(v.label, ...L.ABUA.streams.map((s) => pbl(v.streamValues[s])))),
      ...S.sweep.map((r) => row(bbl(r.capacity), pct(r.utilisation), usd(r.margin), r.marginChange ?? '-', r.capacityChange ?? '-', r.perExtraBarrel ?? '-')),
    ]);
  });

  it('SECTION 15, the schedule event by event, its ledger, the small cargo and the empty cascade', () => {
    const s = S.schedule;
    const plan = S.plan;
    const planQ = (id) => {
      const c = plan.crudes.find((x) => x.id === id); if (c) return [c.volume, c.cost];
      const u = plan.units.find((x) => x.id === id); if (u) return [u.throughput, u.cost];
      const m = plan.products.find((x) => x.id === id); return [m.volume, m.revenue];
    };
    const infeasible = L.scheduleOf({ input: L.withSet(L.ABUA.refusals.find((r) => r.id === 'infeasible').set) });
    pin(15, [
      `the engine's note: ${q(s.note)}`,
      `events: ${s.counts.all} in all; crude receipts ${s.counts.receipts}, unit runs ${s.counts.unitRuns}, product lifts ${s.counts.lifts}; weeks in the period 5`,
      ...s.events.map((e) => row(e.id, e.date, e.type, e.materialId, bbl(e.quantity), usd(e.value), e.part)),
      ...s.ledger.map((r) => { const [pq, pc] = planQ(r.materialId); return row(r.materialId, r.type, bbl(r.quantity), bbl(pq), usd(r.value), usd(pc)); }),
      `The same plan with a cargo size of 150000 bbl: crude receipts ${S.scheduleSmallCargo.counts.receipts}; receipt dates for Forcados: ${S.scheduleSmallCargo.cargoes.find((c) => c.id === 'forcados').dates.join(', ')}.`,
      `An infeasible plan cascades to ${infeasible.events.length} events, with the note ${q(infeasible.note)}`,
    ]);
    pinStart(15, s.cargoes.map((c) => `| ${c.name} | ${bbl(c.crudeRun)} | ${frac(c.runOverCargo)} | ${c.cargoes} |`));
    s.cargoes.forEach((c) => expect(SECTIONS[15].some((l) => l.startsWith(`| ${c.name} |`) && l.endsWith(`| ${c.dates.join(', ')} |`))).toBe(true));
  });

  it('SECTION 15, the calendar is March 2027, day 1 is the period start and every event sits on it', () => {
    const s = S.schedule;
    expect(L.PERIOD_START).toBe('2027-03-01');
    expect(L.PERIOD_DAYS).toBe(31);
    expect(s.calendar).toHaveLength(31);
    expect(s.calendar[0].date).toBe(L.PERIOD_START);
    expect(s.calendar[30].date).toBe('2027-03-31');
    expect(s.outsideCalendar).toEqual([]);
    expect(s.calendar.reduce((n, d) => n + d.events.length, 0)).toBe(s.events.length);
    // The cargo size is a control: every size the panel offers cascades, and the receipts follow it.
    const counts = L.CARGO_SIZES.map((c) => L.scheduleOf({ cargoSize: c }).counts.receipts);
    counts.forEach((n, k) => { if (k) expect(n).toBeLessThanOrEqual(counts[k - 1]); });
  });

  it('SECTION 16, the seven zones: the string never moves, the local midnight does east of Greenwich', () => {
    const lines = [];
    S.zones.forEach((z) => {
      lines.push(row(z.zone, z.fromString.first, z.fromString.last, String(z.fromString.matchesUtc)));
      lines.push(row(z.zone, z.fromLocalMidnight.first, String(z.fromLocalMidnight.matchesUtc)));
    });
    pin(16, lines);
    expect(S.zones.map((z) => z.zone)).toEqual(L.ZONES);
    S.zones.forEach((z) => expect(z.fromString.dates).toEqual(S.schedule.events.map((e) => e.date)));
  });

  it('SECTION 17, the ABUA plan and schedule end to end', () => {
    const p = S.plan;
    pin(17, [
      row('total crude (bbl)', bbl(p.totalCrude)),
      row('crude unit utilisation (percent)', pct(p.crudeUnit.utilisation)),
      row('revenue', usd(p.revenue)),
      row('crude cost', usd(p.crudeCost)),
      row('unit operating cost', usd(p.unitCost)),
      row('margin', usd(p.margin)),
      row('gross margin per barrel of crude', pbl(p.grossMarginPerBbl)),
      ...p.streams.map((s) => row(`marginal value of ${s.id} ($/bbl)`, pbl(s.marginalValue))),
      row('schedule events', S.schedule.counts.all),
      row('crude receipts', S.schedule.counts.receipts),
      row('first receipt date', S.schedule.events[0].date),
    ]);
  });

  it('SECTION 18, a quantity typed below zero is refused in the engine\'s own words', () => {
    const a = L.odiomaActuals();
    a[0].quantity = -500;
    const v = L.varianceOf(a);
    pin(18, [row('a quantity of -500', refused(v.error))]);
    expect(v.materialId).toBe('escravos');
    // A value box left blank is recorded as no value, so the line is uncosted.
    const b = L.odiomaActuals();
    b[2].cost = '';
    const vb = L.varianceOf(b);
    expect(vb.lines.find((l) => l.materialId === 'cdu').costed).toBe(false);
    expect(vb.ledgers[1].uncostedEvents).toBe(1);
  });

  it('SECTION 19, the ODIOMA plan and its plan ledger', () => {
    const O = L.ODIOMA;
    const p = S.odioma.plan;
    pin(19, [
      ...O.crudes.map((c) => row(c.name, pbl(c.cost), bbl(c.available), ...O.streams.map((s) => (c.yields[s] === undefined ? '-' : frac(c.yields[s]))))),
      ...O.products.map((pr) => row(pr.name, pbl(pr.price), bbl(pr.maxDemand))),
      `plan: total crude ${bbl(p.totalCrude)} bbl; margin ${usd(p.margin)}; gross margin per barrel ${pbl(p.grossMarginPerBbl)}`,
      ...S.odioma.ledger.map((r) => row(r.materialId, r.type, r.events, bbl(r.quantity), usd(r.value), pbl(r.value / r.quantity))),
    ]);
  });

  it('SECTION 20, the actuals, every variance line, the unmatched movement and the unit values', () => {
    const v = S.variance;
    pin(20, [
      ...L.ODIOMA.actuals.map((a) => row(a.materialId, a.type, bbl(a.quantity), usd(a.cost))),
      ...v.lines.map((l) => row(l.materialId, l.type, l.direction, bbl(l.planQuantity), bbl(l.actualQuantity), usd(l.planCost), usd(l.actualCost), usd(l.volumeVariance), usd(l.priceVariance), usd(l.unexplained), usd(l.totalVariance), usd(l.marginEffect), String(l.costed))),
      ...v.unmatched.map((u) => row(u.materialId, u.type, u.presentIn, bbl(u.quantity), usd(u.cost))),
      ...v.lines.map((l) => row(l.materialId, l.type, pbl(l.planUnitValue), pbl(l.actualUnitValue), bbl(l.quantityGap))),
    ]);
  });

  it('SECTION 21, the totals on margin, the gap to the ledger margins, the units and the two ledgers', () => {
    const v = S.variance;
    pin(21, [
      `The headline total is on margin: ${q(v.total.basis)}.`,
      row('on margin (the headline)', usd(v.total.volumeVariance), usd(v.total.priceVariance), usd(v.total.unexplained), usd(v.total.totalVariance)),
      row('cost lines, as recorded', usd(v.cost.volumeVariance), usd(v.cost.priceVariance), usd(v.cost.unexplained), usd(v.cost.totalVariance)),
      row('revenue lines, as recorded', usd(v.revenue.volumeVariance), usd(v.revenue.priceVariance), usd(v.revenue.unexplained), usd(v.revenue.totalVariance)),
      `Adding every line's total variance as recorded, cost and revenue together, gives ${usd(v.recordedSum)}; the margin total is ${usd(v.total.totalVariance)}. The engine prints the margin total as the headline.`,
      `plan margin ${usd(v.planMargin)}; actual margin ${usd(v.actualMargin)}; margin variance ${usd(v.marginVariance)}; the plan's own margin ${usd(v.planOwnMargin)}; plan gross margin per barrel ${pbl(v.planGrossMarginPerBbl)}`,
      `margin variance - margin total of the matched lines = ${usd(v.marginGap)}; the unmatched movements, deliveries counted as revenue and the rest as cost, come to ${usd(v.unmatchedOnMargin)}. The ledger margins count every movement; the variance lines count only the matched ones.`,
      ...v.unitPerformance.map((u) => row(u.unitId, bbl(u.planned), bbl(u.actual), bbl(u.difference), pct(u.utilisationOfPlan))),
      ...v.ledgers.map((d) => row(d.ledger, d.events, usd(d.cost), usd(d.revenue), usd(d.margin), d.uncostedEvents, String(v.ledgerMarginsAgree))),
    ]);
  });

  it('SECTION 22, the expansion handed to the screening engine, year by year, and the start year that moves no figure', () => {
    const e = S.expansion;
    const i = e.inputs;
    pin(22, [
      `capital ${usd(e.capital)}; gross value per barrel of crude ${pbl(e.grossValuePerBbl)}; annual throughput ${bbl(e.annualBbl)} bbl; gross margin per barrel ${pbl(e.grossMarginPerBbl)}`,
      `fiscalType ${i.fiscalType}; royaltyRate ${i.royaltyRate}; taxRate ${i.taxRate}; discountRate ${i.discountRate}; lossCarryForward ${i.lossCarryForward}; projectLife ${i.projectLife} years; startYear ${i.startYear}`,
      `production (oil, bbl) in year 0 and in the first operating year: 0.00, ${bbl(i.firstProduction)}; price (the slate's gross value) in the first operating year ${pbl(i.firstPrice)}`,
      `opexFixed in the first operating year (fixed operating cost plus crude cost, millions) ${mmd(i.firstOpexFixed)}; opexVariable ${mmd(i.firstOpexVariable)}; capex in year 0 ${mmd(i.year0Capex)}`,
      ...e.rows.map((r) => row(r.index, r.year, mmd(r.grossRevenue), mmd(r.royalty), mmd(r.opex), mmd(r.capex), mmd(r.tax), mmd(r.lossCarriedForward), mmd(r.ncf))),
      `The start year labels the years and moves no figure: with start year ${L.START_YEAR_CHECK} the first calendar year reads ${S.expansionCheckYear.rows[0].year}, the NPV reads ${mmd(S.expansionCheckYear.npvReading)} and the total tax ${mmd(S.expansionCheckYear.totalTax)}, against ${e.rows[0].year}, ${mmd(e.npvReading)} and ${mmd(e.totalTax)} with start year ${L.START_YEAR}. The two agree to the last digit: true.`,
    ]);
    pinStart(22, [`NPV at 12 percent, mid-year discounting (a flow in year t is discounted at t + 0.5): ${mmd(e.npvReading)} million US dollars.`]);
    expect(() => L.expansionOf({ startYear: 2020 })).toThrow(TypeError);
  });

  it('SECTION 23, the tax with the loss carried forward and with the option off', () => {
    const on = S.expansion;
    const off = S.expansionOff;
    pin(23, [
      ...on.rows.map((r, k) => row(k, mmd(r.taxableBeforeRelief), mmd(r.tax), mmd(r.lossCarriedForward), mmd(on.taxOptionOff[k]))),
      `first year with tax to pay, loss carried forward: year ${on.firstTaxYear}, tax ${mmd(on.firstTax)} MM`,
      `total tax over the life: ${mmd(on.totalTaxOn)} MM with the loss carried forward; ${mmd(on.totalTaxOff)} MM with the option off; the difference ${on.totalTaxDifference} MM`,
      `NPV at 12 percent: ${mmd(on.npvReading)} MM with the loss carried forward; ${mmd(off.npvReading)} MM with the option off`,
    ]);
    // THE SWITCH: off, the per-year tax is the option-off column, the loss pool is empty and the first taxable year moves.
    expect(off.rows.map((r) => r.tax)).toEqual(on.taxOptionOff);
    expect(off.rows.every((r) => r.lossCarriedForward === 0)).toBe(true);
    expect(off.firstTaxYear).toBeLessThan(on.firstTaxYear);
    expect(mmd(off.totalTax)).toBe(mmd(on.totalTaxOff));
  });

  it('NEGATIVE CONTROL: one barrel moved no longer matches the digest', () => {
    const p = S.plan;
    const good = `total crude ${bbl(p.totalCrude)} bbl; crude unit throughput ${bbl(p.crudeUnit.throughput)} bbl; the two agree to the barrel: true`;
    const bad = `total crude ${bbl(p.totalCrude + 1)} bbl; crude unit throughput ${bbl(p.crudeUnit.throughput)} bbl; the two agree to the barrel: true`;
    expect(SECTIONS[11]).toContain(good);
    expect(SECTIONS[11]).not.toContain(bad);
  });
});

// ---------------------------------------------------------------------------

describe('the controls the panels move', () => {
  it('a limit typed as a number, typed as 0 and left blank re-solves the plan three ways', () => {
    const typed = L.planOf(L.withSet([['units', 'dht', 'capacity', '650000']]));
    expect(usd(typed.margin)).toBe(usd(S.plan.margin));
    const zero = L.planOf(L.withSet([['units', 'dht', 'capacity', '0']]));
    expect(usd(zero.margin)).toBe(usd(S.hydrotreater[1].margin));
    const blank = L.planOf(L.withSet([['units', 'dht', 'capacity', '']]));
    expect(usd(blank.margin)).toBe(usd(S.hydrotreater[2].margin));
  });

  it('an infeasible or unbounded plan comes back as its status and the engine\'s sentence, with nothing to chart', () => {
    const inf = L.planOf(L.withSet(L.ABUA.refusals.find((r) => r.id === 'infeasible').set));
    expect(inf.status).toBe('infeasible');
    expect(inf.units).toBeUndefined();
    const unb = L.planOf(L.blankAllLimits());
    expect(unb.status).toBe('unbounded');
    expect(unb.streams).toBeUndefined();
  });

  it('the reformer control reproduces the sweep at every capacity the digest prints', () => {
    S.sweep.forEach((r) => expect(usd(L.reformerAt(r.capacity).margin)).toBe(usd(r.margin)));
  });

  it('an edited actual moves its line and the margin total, and the unmatched movement stays apart', () => {
    const a = L.odiomaActuals();
    a.find((x) => x.materialId === 'diesel').quantity = String(334000);
    a.find((x) => x.materialId === 'diesel').cost = String(33600400);
    const v = L.varianceOf(a);
    const d = v.lines.find((l) => l.materialId === 'diesel');
    expect(d.totalVariance).toBeCloseTo(0, 6);
    expect(v.unmatched.map((u) => u.materialId)).toEqual(['lpg']);
    expect(usd(v.marginGap)).toBe(usd(v.unmatchedOnMargin));
  });
});

// ---------------------------------------------------------------------------

const walk = (v, p, fn) => {
  fn(v, p);
  if (Array.isArray(v)) v.forEach((x, k) => walk(x, `${p}[${k}]`, fn));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${p}.${k}`, fn));
};

describe('the surface a panel reads is plain data', () => {
  it('no Date object, no NaN and no undefined anywhere in it', () => {
    const bad = [];
    walk(S, 'S', (v, p) => {
      if (v instanceof Date) bad.push(`${p} is a Date`);
      if (typeof v === 'number' && Number.isNaN(v)) bad.push(`${p} is NaN`);
      if (v === undefined) bad.push(`${p} is undefined`);
    });
    expect(bad).toEqual([]);
  });

  it('NO IRR: no key in the surface names one, and no panel or page mentions one', () => {
    const keys = [];
    walk(S, 'S', (v, p) => { if (/irr/i.test(p.split('.').at(-1))) keys.push(p); });
    expect(keys).toEqual([]);
    [...PANEL_FILES, ...SHARED_FILES, PAGE_FILE].forEach((f) => expect(sourceOf(f), f).not.toMatch(/\birr\b/i));
  });

  it('NO NPV HEADLINE: no Tile carries the NPV and nothing invites optimising it', () => {
    [...PANEL_FILES, PAGE_FILE].forEach((f) => {
      const tiles = sourceOf(f).match(/<Tile[^>]*>/g) || [];
      tiles.forEach((t) => expect(t, f).not.toMatch(/npv/i));
      expect(sourceOf(f), f).not.toMatch(/maximi[sz]e the npv|optimi[sz]e the npv/i);
    });
    // CONTROL on the tile pattern.
    expect('<Tile label="NPV" value={x} />').toMatch(/<Tile[^>]*npv/i);
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE.
// ---------------------------------------------------------------------------

/** The argument text of every call to NS.name( in a source, by balanced parentheses. */
const callsIn = (code, ns, name) => {
  const out = [];
  const needle = `${ns}.${name}(`;
  let at = code.indexOf(needle);
  while (at >= 0) {
    let depth = 0;
    let k = at + needle.length - 1;
    for (; k < code.length; k += 1) {
      if (code[k] === '(') depth += 1;
      else if (code[k] === ')') { depth -= 1; if (depth === 0) break; }
    }
    out.push(code.slice(at + needle.length, k));
    at = code.indexOf(needle, k);
  }
  return out;
};

const CLOCK_CALLS = [['RP', 'cascadeToSchedule', 'periodStart'], ['MR', 'feasibilityEconomics', 'startYear'], ['SC', 'calculateEconomics', 'startYear']];
const bareClockCalls = (code) => {
  const found = [];
  const bad = [];
  CLOCK_CALLS.forEach(([ns, name, key]) => {
    callsIn(code, ns, name).forEach((args) => {
      found.push({ call: `${ns}.${name}`, args });
      if (!new RegExp(`\\b${key}\\b`).test(args)) bad.push(`${ns}.${name}(${args})`);
    });
  });
  return { found, bad };
};

describe('THE CLOCK GATE: nothing reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('the engines carry the clock-reading exports the wave\'s own scan finds', () => {
    expect(clockReadersOf(ENGINE_SRC.refineryPlanning)).toEqual(['cascadeToSchedule']);
    expect(clockReadersOf(ENGINE_SRC.modularRefinery)).toEqual(['feasibilityEconomics']);
    expect(clockReadersOf(ENGINE_SRC.screening)).toContain('calculateEconomics');
  });

  it('STATICALLY: every lab call to a clock-reading export passes its override, and every schedule but the zone demonstration passes the string', () => {
    const code = strip(sourceOf(LAB_FILE));
    const { found, bad } = bareClockCalls(code);
    expect(found.length, 'the lab makes almost no clock-reading calls, so this gate is vacuous').toBeGreaterThanOrEqual(9);
    expect(bad).toEqual([]);
    const schedules = found.filter((f) => f.call === 'RP.cascadeToSchedule');
    const notString = schedules.filter((f) => !/periodStart: PERIOD_START\b/.test(f.args));
    expect(notString, 'only the zone demonstration may hand the engine a period start other than the string').toHaveLength(1);
    expect(code.slice(code.indexOf('export const zoneSchedules'))).toContain(`RP.cascadeToSchedule(${notString[0].args})`);
    found.filter((f) => f.call !== 'RP.cascadeToSchedule').forEach((f) => expect(f.args).toMatch(/startYear(: START_YEAR)?\b/));
  });

  it('NEGATIVE CONTROL: a planted bare call is caught, in each shape', () => {
    expect(bareClockCalls('const s = RP.cascadeToSchedule({ plan, periodDays: 31 });').bad).toHaveLength(1);
    expect(bareClockCalls('const e = MR.feasibilityEconomics({ streams, discountRate: 12, taxRate: 30 });').bad).toHaveLength(1);
    expect(bareClockCalls('const e = SC.calculateEconomics({ ...inputs });').bad).toHaveLength(1);
    expect(bareClockCalls('const s = RP.cascadeToSchedule({ plan, periodStart: PERIOD_START });').bad).toHaveLength(0);
  });

  it('AT RUN TIME: the whole snapshot is identical under two faked system dates', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const early = JSON.stringify(L.teachingSurface());
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    const late = JSON.stringify(L.teachingSurface());
    expect(late.length).toBeGreaterThan(50000);
    expect(late).toBe(early);
  });

  it('CONTROL: under the same two faked dates a bare engine call DOES move, so the gate can see one', () => {
    const plan = L.ENGINE.RP.planRefinery(L.abuaInput());
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const early = L.ENGINE.RP.cascadeToSchedule({ plan, periodDays: 31, cargoSize: 400000 }).events[0].date;
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    const late = L.ENGINE.RP.cascadeToSchedule({ plan, periodDays: 31, cargoSize: 400000 }).events[0].date;
    expect(early).not.toBe(late);
  });

  it('no source constructs an empty Date or reads a clock, and no panel or page constructs a date at all', () => {
    ALL_SOURCES.forEach((file) => {
      const code = strip(sourceOf(file));
      expect(code.length, `${file} was stripped to nothing`).toBeGreaterThan(400);
      expect(code, `${file} reads a clock`).not.toMatch(/new Date\(\s*\)|Date\.now|performance\.now|Math\.random/);
      if (file !== LAB_FILE) expect(code, `${file} constructs a date`).not.toMatch(/new Date\(/);
    });
    // CONTROL on the stripper and the pattern.
    expect(strip('// new Date() in a comment\nconst x = 1;\n')).not.toContain('new Date');
    expect(strip('const now = new Date();\n')).toMatch(/new Date\(\s*\)/);
  });
});

// ---------------------------------------------------------------------------
// THE ZONE GATE, and its negative control.
// ---------------------------------------------------------------------------

const TZ_ZONES = [['Pacific/Pago_Pago', -1], ['Africa/Lagos', 1]];
const CHILD_ZONE = process.env.MD_TZ_CHILD;
const SIDECAR = process.env.MD_TZ_SIDECAR;

describe('THE ZONE GATE: the lab reproduces byte for byte either side of Greenwich', () => {
  TZ_ZONES.forEach(([zone, side]) => {
    it(`the whole snapshot under TZ=${zone} is byte-identical`, () => {
      if (CHILD_ZONE) {
        if (CHILD_ZONE !== zone) return;
        const offsetMinutes = -new Date('2027-03-01T12:00:00Z').getTimezoneOffset();
        const plan = L.ENGINE.RP.planRefinery(L.abuaInput());
        const localMidnight = L.ENGINE.RP.cascadeToSchedule({
          plan, periodStart: new Date(2027, 2, 1), periodDays: L.PERIOD_DAYS, cargoSize: L.ABUA.cargoSize,
        }).events.map((e) => e.date);
        fs.writeFileSync(SIDECAR, JSON.stringify({
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          offsetMinutes,
          snapshot: JSON.stringify(L.teachingSurface()),
          localMidnight,
        }));
        return;
      }
      const sidecar = path.join(ROOT, 'node_modules', `.md-tz-${zone.replace(/\W/g, '_')}.json`);
      if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
      execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), [
        'run', '--reporter=dot', '--config', 'vitest.config.js',
        'src/components/course/panels/refinery/refineryLab.test.js',
        '-t', `under TZ=${zone} is byte-identical`,
      ], {
        cwd: ROOT,
        env: {
          ...process.env, TZ: zone, MD_TZ_CHILD: zone, MD_TZ_SIDECAR: sidecar,
        },
        stdio: 'pipe',
        timeout: 600000,
      });
      expect(fs.existsSync(sidecar), 'the child wrote no snapshot').toBe(true);
      const child = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
      fs.unlinkSync(sidecar);
      expect(child.timeZone).toBe(zone);
      expect(Math.sign(child.offsetMinutes)).toBe(side);
      expect(child.snapshot.length).toBeGreaterThan(50000);
      expect(child.snapshot).toBe(JSON.stringify(L.teachingSurface()));
      // NEGATIVE CONTROL: the child's own local midnight, handed to the engine as
      // a Date, does what digest SECTION 16 says it does in that zone.
      const digestRow = S.zones.find((z) => z.zone === zone).fromLocalMidnight;
      expect(child.localMidnight).toEqual(digestRow.dates);
      expect(JSON.stringify(child.localMidnight) === JSON.stringify(S.schedule.events.map((e) => e.date))).toBe(side < 0);
    }, 600000);
  });
});

// ---------------------------------------------------------------------------
// THE RENDER GATE.
// ---------------------------------------------------------------------------

const MODE_COMPONENTS = [
  ['ScreenExplorer', SE, ScreenExplorer, ['ScaleMode', 'SlateMode', 'StreamsMode', 'ScreenMode', 'LicensingMode']],
  ['PlanExplorer', PE, PlanExplorer, ['ConfigMode', 'CrudeUnitMode', 'StreamsMode', 'ChangesMode', 'ScheduleMode']],
  ['VarianceExplorer', VE, VarianceExplorer, ['LedgerMode', 'TotalsMode', 'ExpansionMode']],
];
const noop = () => {};
const ERR = { error: 'nothing' };
const DATA_PROPS = ['scale', 'slate', 'screen', 'refusals', 'scenarios', 'table', 'lic', 'input', 'plan', 'fed', 'atReformer', 'sweep',
  'variants', 'dht', 'sch', 'zones', 'ledger', 'actuals', 'v', 'exp', 'inputs', 'prices'];

const REAL_PROPS = {
  ScaleMode: () => ({
    scale: L.scaleAt(), capacity: 5000, onCapacity: noop, modular: 0.9, onModular: noop, stick: 0.6, onStick: noop,
  }),
  SlateMode: () => ({
    slate: L.slateOf(), configId: 'hydroskimming', onConfig: noop, prices: { ...L.OKORDIA.prices }, onPrice: noop, yields: null, onYield: noop, onReset: noop, onTypedYields: noop,
  }),
  StreamsModeScreen: () => ({
    screen: L.screenOf(), inputs: L.okordiaInputs(), onInput: noop, typeUtil: false, onTypeUtil: noop, typeCapex: false, onTypeCapex: noop,
    refusals: L.screenRefusals(), scenarios: L.scenarioTable(), allYears: false, onAllYears: noop, onReset: noop,
  }),
  ScreenMode: () => ({ table: L.screenTable() }),
  LicensingMode: () => ({ lic: L.licensingOf(['lte']), done: ['lte'], onToggle: noop }),
  ConfigMode: () => ({
    input: L.abuaInput(), onCell: noop, onReset: noop, onDht: noop, plan: L.planOf(),
  }),
  CrudeUnitMode: () => ({
    plan: L.planOf(), fed: L.crudeUnitGivenAFeed(), showFed: false, onShowFed: noop,
  }),
  StreamsModePlan: () => ({
    plan: L.planOf(), reformer: 420000, onReformer: noop, atReformer: L.reformerAt(420000), sweep: L.reformerSweep(),
  }),
  ChangesMode: () => ({ variants: L.variantPlans(), refusals: L.planRefusals(), dht: L.hydrotreaterThreeWays() }),
  ScheduleMode: () => ({
    sch: L.scheduleOf(), cargo: 400000, onCargo: noop, zone: 'Africa/Lagos', onZone: noop, zones: L.zoneSchedules(),
  }),
  LedgerMode: () => ({
    ledger: L.odiomaPlan().ledger, actuals: L.odiomaActuals(), onActual: noop, onReset: noop, v: L.varianceOf(),
  }),
  TotalsMode: () => ({ v: L.varianceOf() }),
  ExpansionMode: () => ({
    exp: L.expansionOf(), carry: true, onCarry: noop, year: 2027, onYear: noop,
  }),
};
const realFor = (panel, k) => (k === 'StreamsMode' ? REAL_PROPS[panel === 'ScreenExplorer' ? 'StreamsModeScreen' : 'StreamsModePlan'] : REAL_PROPS[k]);

describe('THE RENDER GATE', () => {
  it('every mode in a MODES list has a component, and every component is in the list', () => {
    MODE_COMPONENTS.forEach(([name, ns, , comps]) => {
      expect(ns.MODES.length, name).toBe(comps.length);
      comps.forEach((k) => expect(typeof ns[k], `${name}.${k}`).toBe('function'));
      comps.forEach((k) => expect(typeof realFor(name, k), `${name}.${k} has no real-props builder`).toBe('function'));
    });
  });

  MODE_COMPONENTS.forEach(([name, ns, , comps]) => {
    comps.forEach((k) => {
      it(`${name}.${k} renders its empty state with nothing, and with an error-shaped object`, () => {
        const Comp = ns[k];
        const html1 = renderToStaticMarkup(React.createElement(Comp, {}));
        const html2 = renderToStaticMarkup(React.createElement(Comp, Object.fromEntries(DATA_PROPS.map((p) => [p, ERR]))));
        expect(html1.length).toBeGreaterThan(20);
        expect(html2.length).toBeGreaterThan(20);
      });

      it(`${name}.${k} renders on real data, and with each data prop error-shaped in turn`, () => {
        const real = realFor(name, k)();
        const full = renderToStaticMarkup(React.createElement(ns[k], real));
        expect(full.length).toBeGreaterThan(400);
        expect(full).not.toContain('has returned nothing');
        const dataProps = Object.keys(real).filter((p) => real[p] && typeof real[p] === 'object');
        expect(dataProps.length).toBeGreaterThan(0);
        dataProps.forEach((p) => {
          const html = renderToStaticMarkup(React.createElement(ns[k], { ...real, [p]: ERR }));
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

  it('a refused plan renders as the engine\'s sentence and draws no chart', () => {
    const inf = L.planOf(L.withSet(L.ABUA.refusals.find((r) => r.id === 'infeasible').set));
    const html = renderToStaticMarkup(React.createElement(PE.StreamsMode, { ...REAL_PROPS.StreamsModePlan(), plan: inf }));
    expect(html).toContain(inf.error);
    expect(html).not.toContain('recharts');
    const blank = L.screenOf({ crudeCostPerBbl: '' });
    expect(renderToStaticMarkup(React.createElement(SE.StreamsMode, { ...REAL_PROPS.StreamsModeScreen(), screen: blank }))).toContain(blank.error);
  });

  it('every ResponsiveContainer is given a width and a height', () => {
    PANEL_FILES.forEach((f) => {
      const tags = sourceOf(f).match(/<ResponsiveContainer[^>]*>/g) || [];
      expect(tags.length, f).toBeGreaterThan(0);
      tags.forEach((t) => {
        expect(t, f).toContain('width=');
        expect(t, f).toContain('height=');
      });
    });
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
const errorsIn = (surface) => {
  const out = [];
  walk(surface, 'S', (v, p) => { if (typeof v === 'string' && /\.error$/.test(p) && v) out.push(v); });
  return [...new Set(out)];
};

describe('THE REFUSAL LITERAL GATE: every refusal a panel shows is the engine\'s own', () => {
  it('no engine refusal sentence is typed into the lab, a panel or the page', () => {
    const extra = [L.varianceOf([{ materialId: 'x', type: 'receipt', quantity: -1, cost: 1 }]).error, S.schedule.note];
    const reasons = [...errorsIn(S), ...extra];
    expect(reasons.length, 'the lab returns almost no refusals, so this sweep is vacuous').toBeGreaterThanOrEqual(15);
    ALL_SOURCES.forEach((file) => {
      const text = sourceOf(file);
      const typed = reasons.filter((r) => r.length > 30 && text.includes(r.slice(0, 40)));
      expect(typed, `${file} types an engine refusal`).toEqual([]);
    });
  });
});

const EM = '—';
const EN = '–';
const CONTRASTIVE = /,\s+not\s+\w/;
const breaches = (s) => CONTRASTIVE.test(s) || s.includes(EM) || s.includes(EN) || / -- /.test(s);

/**
 * THE ONE LIVE ENGINE SENTENCE THAT BREACHES THE OWNER COPY RULE, exempt by exact
 * string and pinned to the vendored engine. PANELS.md names it: the schedule
 * note, shown verbatim as the engine's words. A dead exemption fails.
 */
const COPY_RULE_EXEMPTIONS = ['this is the shape of the month to read actuals against, not a berth-level schedule.'];

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

  it('every string the lab hands a panel obeys it, except the one exempt engine sentence', () => {
    const strings = stringsIn(S);
    expect(strings.length).toBeGreaterThanOrEqual(500);
    const offenders = strings.filter(([, s]) => breaches(s));
    const unexcused = offenders.filter(([, s]) => !COPY_RULE_EXEMPTIONS.some((ex) => s.includes(ex)));
    expect(unexcused.map(([p, s]) => `${p}: ${s}`)).toEqual([]);
  });

  it('A DEAD EXEMPTION FAILS: the exempt sentence is still returned and still in the engine', () => {
    const strings = stringsIn(S).map(([, s]) => s);
    COPY_RULE_EXEMPTIONS.forEach((ex) => {
      expect(strings.some((s) => s.includes(ex)), `"${ex}" matches nothing the lab returns`).toBe(true);
      expect(breaches(ex)).toBe(true);
      expect(ENGINE_SRC.refineryPlanning, `"${ex}" is no longer in the vendored engine`).toContain(ex);
    });
  });
});
