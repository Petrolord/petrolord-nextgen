// Every value the carbon teaching lab exposes to a panel or to the course page is
// pinned here against the teaching digest (tools/course-waves/carbon/digest.txt),
// which is itself nothing but the vendored engines' return values on the
// IGBOGENE, ISIOKPO and AGBOR records.
//
// THE GATES, and each one carries a control that is made to fire:
//
//   AGREEMENT WITH THE DIGEST  every reader's return is rebuilt into the
//                      digest's own lines, row by row and sentence by sentence,
//                      and each line must appear in the section that printed it.
//                      The control moves one figure in its last printed decimal
//                      and requires the rebuilt line to vanish.
//   THE WAVE INPUTS    read through tools/course-waves/waveInputs.mjs, which
//                      throws and names the file when one is missing. The teaching
//                      records in the lab are compared with carbon_fields.mjs byte
//                      for byte and value for value, the committed copy is compared
//                      with the live wave directory when this machine has one, and
//                      the digest and graded answers are checked against the
//                      sha256 pins in waves.json.
//   MISSING STAYS MISSING  a blank box reaches the engine blank and comes back as
//                      the engine's refusal, and no lab or panel source fills a
//                      default from anywhere.
//   THE CLOCK GATE     no engine, lab, panel or page source reads a date, a timer
//                      or a random number, and the whole snapshot is identical
//                      under two faked system dates.
//   THE ZONE GATE      the whole snapshot is rebuilt in child processes under
//                      TZ=Pacific/Pago_Pago and TZ=Pacific/Kiritimati and must be
//                      byte identical; each child proves which side of the date
//                      line it ran on.
//   THE ANSWER SWEEP   no number anywhere in the snapshot lies within ten grading
//                      tolerances of a graded capstone answer, with a planted
//                      control that must be caught.
//   THE RENDER GATE    every mode of every panel renders with nothing and with an
//                      error-shaped object, and every panel renders in every mode
//                      on real data.
//   THE COPY RULE      no em dash, no en dash, no double hyphen and no contrastive
//                      over the sources and over every string the lab hands a
//                      panel, with the three engine sentences the lessons quote
//                      verbatim exempt BY EXACT TEXT and pinned.
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
import * as L from './carbonLab.js';
import {
  waveDir, waveInput, mirrorDir, liveWaveDir, WAVES,
} from '../../../../../tools/course-waves/waveInputs.mjs';
import * as WAVE_FIELDS from '../../../../../tools/course-waves/carbon/carbon_fields.mjs';
import InventoryExplorer, * as IE from './InventoryExplorer.jsx';
import EfficiencyExplorer, * as EX from './EfficiencyExplorer.jsx';
import AbatementExplorer, * as AX from './AbatementExplorer.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

const WAVE_NAME = 'carbon';
const WAVE = waveDir(WAVE_NAME);
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE_WAVE = liveWaveDir(WAVE_NAME);
const DIGEST = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');
const FIELDS_JSON = fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8');
const FIELDS = JSON.parse(FIELDS_JSON);
const FIELDS_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'carbon_fields.mjs'), 'utf8');
const DUMP_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'carbon_dump.mjs'), 'utf8');
const ENGINE_FILES = ['engines/downstream/carbonAbatement.js', 'engines/downstream/energyEfficiency.js'];
const ENGINE_SRC = ENGINE_FILES.map((f) => [f, fs.readFileSync(path.join(ROOT, 'packages/engines', f), 'utf8')]);

const LAB_FILE = 'carbonLab.js';
const PANEL_FILES = ['InventoryExplorer.jsx', 'EfficiencyExplorer.jsx', 'AbatementExplorer.jsx'];
const SHARED_FILES = ['panelBits.jsx'];
const PAGE_FILE = 'CarbonLearningPage.jsx';
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
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// ---------------------------------------------------------------------------
// The digest, cut into its sections, and the digest's own ways of printing,
// written here independently of the lab's fmt.
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

const DP = {
  t: 3, kmol: 3, pct: 4, frac: 6, gj: 3, kgh: 4, kw: 3, c: 3, usd: 2, usdt: 4, crf: 8, mm: 4, kg: 4, mjt: 4, inten: 8, share: 6,
};
const p = (cls) => (v) => {
  if (v === null || v === undefined) return 'none';
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${cls}: ${v} is not a finite number`);
  const s = v.toFixed(DP[cls]);
  return /^-0(\.0+)?$/.test(s) ? s.slice(1) : s;
};
const t3 = p('t'); const km = p('kmol'); const pct = p('pct'); const frac = p('frac'); const gj = p('gj');
const kgh = p('kgh'); const kw = p('kw'); const degc = p('c'); const usd = p('usd'); const usdt = p('usdt');
const crf = p('crf'); const kg = p('kg'); const mjt = p('mjt'); const inten = p('inten'); const share = p('share');
const yn = (v) => (v === true ? 'true' : v === false ? 'false' : 'none');
const plain = (v) => (v === null || v === undefined ? 'none' : v === '' ? 'blank' : String(v));
const row = (...cells) => `| ${cells.join(' | ')} |`;
const REF = (e) => `REFUSED: ${e}`;

/** Every line a section must carry, collected so a failure names them all. */
const pin = (n, lines) => {
  const have = new Set(SECTIONS[n] || []);
  const missing = lines.filter((l) => !have.has(l));
  expect(SECTIONS[n], `the digest has no SECTION ${n}`).toBeTruthy();
  expect(lines.length, `SECTION ${n} was pinned with nothing`).toBeGreaterThan(0);
  expect(missing, `SECTION ${n}: these lines the lab rebuilds are not in the digest`).toEqual([]);
};
/** Fragments that must each sit inside some line of the section. */
const pinIn = (n, fragments) => {
  const lines = SECTIONS[n] || [];
  const missing = fragments.filter((f) => !lines.some((l) => l.includes(f)));
  expect(missing, `SECTION ${n}: these fragments are in no line of the digest`).toEqual([]);
};

const S = L.teachingSurface();

// ---------------------------------------------------------------------------

describe('the wave inputs and the teaching records', () => {
  it('the digest is whole: twenty-six sections', () => {
    expect(Object.keys(SECTIONS).length).toBe(26);
    expect(DIGEST.split('\n').length).toBeGreaterThan(650);
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

  it('the teaching records are copied VERBATIM from carbon_fields.mjs, byte for byte', () => {
    const lab = sourceOf(LAB_FILE);
    const begin = '// ---- BEGIN VERBATIM carbon_fields.mjs ----\n';
    const end = '// ---- END VERBATIM carbon_fields.mjs ----';
    expect(lab).toContain(begin);
    expect(lab).toContain(end);
    const block = lab.slice(lab.indexOf(begin) + begin.length, lab.indexOf(end));
    const wave = FIELDS_MJS.slice(FIELDS_MJS.indexOf('/* ------------------------------------------------------------------ *\n * THE GWP SETS'));
    expect(wave.length, 'the wave file carries almost nothing').toBeGreaterThan(5000);
    expect(block).toBe(wave);
    expect(DUMP_MJS).toContain("import * as F from './carbon_fields.mjs';");
  });

  it('and they AGREE IN VALUE with the wave file when run, not only as text', () => {
    const names = Object.keys(WAVE_FIELDS);
    expect(names.length).toBeGreaterThanOrEqual(25);
    const differing = names.filter((k) => JSON.stringify(L[k]) !== JSON.stringify(WAVE_FIELDS[k]));
    expect(differing).toEqual([]);
  });

  it('the probe inputs the dump holds inline are the dump\'s own', () => {
    const P = L.PROBES;
    [
      'fuelKmolPerYear: 1000, carbonPerKmolFuel: 1', '[1, 0.99, 0.98, 0.95]', '[0.999, 0.995]', '[1.0, 1.05, 1.09, 1.15]',
      "label: 'Diesel generators', scope: 1, activity: 1200", "label: 'Business travel', scope: 3, activity: 400",
      'dryO2Percent: 3 })', "[['dry O2 20.946 percent (all air)', 20.946], ['dry O2 21 percent', 21], ['dry O2 -1 percent', -1], ['dry O2 blank', '']]",
      '[1.0, 1.8, 2.5]', '[2.0, 2.8, 3.5, 4.5]', 'targetO2Percent: 1.5', 'specificHeatRatio: 1.3', 'hoursPerYear: 9000', 'targetReturnFraction: 1.2',
      "[{ label: 'Hot', supplyC: 200, targetC: 50, cpKWperK: 10 }, { label: 'Cold', supplyC: 30, targetC: 60, cpKWperK: 1 }], minimumApproachC: 10",
      '[{ supplyC: 100, targetC: 50, cpKWperK: -2 }, { supplyC: 20, targetC: 80, cpKWperK: 1 }], minimumApproachC: 10',
      '[{ supplyC: 50, targetC: 50, cpKWperK: 1 }], minimumApproachC: 10', 'F.AGBOR_MEASURES[2]', 'tonnesAbatedPerYear: -500', 'discountRate: 10 }',
      "m.label === 'Vapour recovery on the storage tanks'", "source: 'Ika leak detection survey (invented)', version: '2026 Q1'",
      "source: 'Atom balance (conservation of mass)', version: 'not applicable'",
    ].forEach((frag) => expect(DUMP_MJS, frag).toContain(frag));
    expect(P.refusalMeasureIndex).toBe(2);
    expect(L.AGBOR_MEASURES[P.refusalMeasureIndex].label).toBe('Heat integration project');
    expect(DUMP_MJS).toContain(`export const PRINT = {\n  t: 3, kmol: 3, pct: 4, frac: 6, gj: 3, kgh: 4, kw: 3, c: 3, usd: 2, usdt: 4, crf: 8, mm: 4, kg: 4, mjt: 4, inten: 8, share: 6,\n};`);
    expect({ ...L.PRINT }).toEqual(DP);
  });

  it('every engine member the lab names resolves in the vendored modules', () => {
    const code = strip(sourceOf(LAB_FILE));
    const used = [...code.matchAll(/\b(CA|EE)\.([A-Za-z_]\w*)/g)].map((m) => [m[1], m[2]]);
    expect(used.length).toBeGreaterThan(60);
    const missing = used.filter(([ns, name]) => L.ENGINE[ns][name] === undefined).map(([ns, n]) => `${ns}.${n}`);
    expect([...new Set(missing)]).toEqual([]);
  });

  it('the lab is the only file that imports the two engines, and it imports both', () => {
    const lab = sourceOf(LAB_FILE);
    ENGINE_FILES.forEach((f) => expect(lab).toContain(`@petrolord/engines/${f}`));
    ALL_SOURCES.filter((f) => f !== LAB_FILE).forEach((f) => expect(sourceOf(f), f).not.toMatch(/@petrolord\/engines/));
  });

  it('CONTROL ON THE PIN: a figure moved in its last printed decimal is not in the digest', () => {
    const inv = S.inventory.inv;
    const good = row('Total, Scope 1 and Scope 2', t3(inv.totalTonnes));
    const bad = row('Total, Scope 1 and Scope 2', t3(inv.totalTonnes + 0.001));
    expect(SECTIONS[7]).toContain(good);
    expect(SECTIONS[7]).not.toContain(bad);
  });

  it("the lab's fmt prints as the digest prints", () => {
    [0, -0.00001, 1.23456, -7.55268, 698701.56049, 1e-9].forEach((v) => {
      Object.keys(DP).forEach((cls) => expect(L.fmt(cls, v)).toBe(p(cls)(v)));
    });
    expect(L.fmt('t', null)).toBe('none');
    expect(L.F.t(undefined)).toBe('none');
  });
});

// ---------------------------------------------------------------------------
// AGREEMENT WITH THE DIGEST, section by section.
// ---------------------------------------------------------------------------

describe('AGREEMENT WITH THE DIGEST, the Associate sections', () => {
  it('SECTION 1, what the modules export and what they do not ship', () => {
    pin(1, [
      ...S.modules.map((m) => row(m.name, m.functions.length, m.constants.length, [...m.functions, ...m.constants].join(', '))),
      `carbonAbatement.MW_CO2: ${S.atomUnit.MW_CO2}`,
      `carbonAbatement.MW_C: ${S.atomUnit.MW_C}`,
      `carbonAbatement.MW_CH4: ${S.atomUnit.MW_CH4}`,
      `energyEfficiency.O2_MOLE_FRACTION_DRY_AIR: ${S.combustion.constants.O2_MOLE_FRACTION_DRY_AIR}`,
      `energyEfficiency.AIR_MOLAR_MASS: ${S.combustion.constants.AIR_MOLAR_MASS}`,
      `energyEfficiency.O2_MOLAR_MASS: ${S.combustion.constants.O2_MOLAR_MASS}`,
      `energyEfficiency.FUEL_REFERENCE_NOTE: "${S.combustion.constants.FUEL_REFERENCE_NOTE}"`,
      row('makeGwpSet({})', plain(S.gwp.empty.label), S.gwp.empty.gases, yn(S.gwp.empty.declared)),
      ...S.stackLossCases.properties.map((q) => row(q.property, q.typical, q.range, q.note)),
    ]);
    pinIn(1, [`energyEfficiency.ATMOSPHERIC_N2_MOLAR_MASS: ${kg(S.combustion.constants.ATMOSPHERIC_N2_MOLAR_MASS)}`]);
  });

  it('SECTION 2, what the carbon engine refuses, and the default when left out', () => {
    expect(S.refusals.rows.every((r) => r.error)).toBe(true);
    pin(2, S.refusals.rows.map((r) => row(r.fn, r.call, REF(r.error))));
    const lo = S.refusals.leftOut;
    pinIn(2, [`answers destructionEfficiencyFraction ${lo.destructionEfficiencyFraction}, co2Tonnes ${t3(lo.co2Tonnes)}, ch4Tonnes ${t3(lo.ch4Tonnes)}.`]);
  });

  it('SECTION 3, the atom balance and its molar masses', () => {
    const u = S.atomUnit;
    pin(3, [
      `The engine's method, verbatim: "${u.method}"`,
      ...u.rows.map((r) => row(r.eta, km(r.carbonKmol), t3(r.co2Tonnes), t3(r.ch4Tonnes))),
    ]);
    pinIn(3, [
      `plus two oxygens at ${u.computedHere.oxygen.toFixed(3)}`, `plus four hydrogens at ${u.computedHere.hydrogen.toFixed(3)}`,
      `The engine's result carries these keys and no other gas: ${u.gasKeys.join(', ')}.`,
    ]);
  });

  it('SECTION 4, the Igbogene fired heaters', () => {
    const h = S.heaterSweeps;
    pin(4, [
      row('carbonKmolPerYear', km(h.base.carbonKmolPerYear)), row('co2Tonnes', t3(h.base.co2Tonnes)),
      row('ch4Tonnes', t3(h.base.ch4Tonnes)), row('unburnedNote', plain(h.base.unburnedNote)),
      ...h.efficiencies.map((x) => row(x.eta, t3(x.r.co2Tonnes), t3(x.r.ch4Tonnes))),
      ...h.carbons.map((x) => row(x.c.toFixed(2), t3(x.r.co2Tonnes))),
    ]);
  });

  it('SECTION 5, the flare at five efficiencies, its refusal and the two computed-here figures', () => {
    const f = S.flareSweep;
    expect(f.setLabel).toBe('IPCC AR6 GWP100, fossil methane');
    pin(5, [
      ...f.rows.map((r) => row(r.eta, t3(r.co2Tonnes), t3(r.ch4Tonnes), r.ch4LineTCo2e === null ? 'no line (no methane)' : t3(r.ch4LineTCo2e), t3(r.flareTCo2e))),
      `Blank: ${REF(f.blank)}`,
      `At ${f.stated.eta} the methane line is ${t3(f.stated.ch4LineTCo2e)} tCO2e of the flare's ${t3(f.stated.flareTCo2e)} tCO2e, a share of ${share(f.computedHere.methaneShare)} (computed here from the engine's figures).`,
      `Read as 100 percent, the same flare is ${t3(f.computedHere.completeCombustionTCo2e)} tCO2e with no methane line: ${t3(f.computedHere.belowStated)} tCO2e below the flare at ${f.stated.eta} (computed here from the engine's figures).`,
      `The engine's note on the escaped carbon, verbatim: "${f.unburnedNote}"`,
    ]);
  });

  it('the flare sweep on every set carries its own set, and only the methane line moves', () => {
    const [course, ...others] = S.flareSweepOnSets;
    others.forEach((o) => {
      expect(o.setLabel).not.toBe(course.setLabel);
      o.rows.forEach((r, i) => {
        expect(r.co2Tonnes).toBe(course.rows[i].co2Tonnes);
        if (course.rows[i].ch4LineTCo2e) expect(r.ch4LineTCo2e).not.toBe(course.rows[i].ch4LineTCo2e);
      });
    });
  });

  it('SECTION 6, the four GWP sets, the engine notes and what declares a set', () => {
    const g = S.gwp;
    expect(g.sets).toHaveLength(4);
    expect(g.courseKey).toBe('ar6Fossil');
    pin(6, [
      ...g.sets.map((s) => row(s.label, s.report, s.horizon, s.CH4, s.N2O, yn(s.declared))),
      `The engine's note on every set, verbatim: "${g.sets[0].note}"`,
      `The engine's methane note on every set, verbatim: "${g.sets[0].methaneNote}"`,
      ...g.declaredChecks.map((c) => row(c.call, yn(c.declared))),
    ]);
    pinIn(6, [g.source]);
  });

  it('SECTION 7, the Igbogene inventory, its totals, its status, its disclaimer and its shares', () => {
    const { inv, computedHere } = S.inventory;
    expect(inv.reportable).toBe(true);
    pin(7, [
      ...inv.lines.map((l) => row(l.label, l.scope, l.gas, t3(l.activity), l.activityUnit, l.factor, l.factorUnit, l.gwp, t3(l.tonnesGas), t3(l.tCo2e), l.source, l.version, yn(l.provenanceComplete))),
      ...inv.byScope.map((s) => row(s.label, t3(s.tCo2e))),
      row('Total, Scope 1 and Scope 2', t3(inv.totalTonnes)),
      `gwpSetLabel: ${inv.gwpSetLabel}. computed: ${yn(inv.computed)}. reportable: ${yn(inv.reportable)}. blocked lines: ${inv.blockedLines.length}. unsourced lines: ${inv.unsourcedLines.length}.`,
      `The engine's disclaimer, verbatim: "${inv.disclaimer}"`,
      ...computedHere.shares.map((s) => row(s.label, share(s.share))),
    ]);
  });

  it('SECTION 8, one inventory on four GWP sets', () => {
    pin(8, [
      ...S.inventoryOnSets.map((r) => row(r.label, t3(r.scope1), t3(r.scope2), t3(r.total), t3(r.computedHere.lessCourseSet))),
      ...S.inventoryOnSets.map((r) => row(r.label, ...r.methaneLines.map((l) => t3(l.tCo2e)))),
    ]);
  });

  it('SECTION 9, computed and reportable, step by step', () => {
    const r = S.reportable;
    expect(r.steps.map((s) => s.step)).toEqual(L.REPORTABLE_STEPS);
    const first = r.steps[0].inv;
    pin(9, [
      ...r.steps.map((s) => row(s.step, s.inv.lines.length, t3(s.inv.scope1Tonnes), t3(s.inv.scope2Tonnes), t3(s.inv.totalTonnes), yn(s.inv.computed), yn(s.inv.reportable), s.inv.notReportableBecause ? s.inv.notReportableBecause.join('; ') : 'none')),
      ...first.blockedLines.map((b) => row(b.label, `blocked: ${b.reason}`)),
      ...r.withBad.blockedLines.map((b) => row(b.label, b.reason)),
      `total tCO2e ${t3(r.withBad.totalTonnes)}; reportable ${yn(r.withBad.reportable)}; not reportable because: ${r.withBad.notReportableBecause.join('; ')}.`,
    ]);
    pinIn(9, [`The first pass has ${first.blockedLines.length} blocked line(s) and ${first.unsourcedLines.length} unsourced line(s)`]);
  });

  it('SECTION 10, intensity over two boundaries, carrying its inventory\'s status', () => {
    const it2 = S.inventory.intensity;
    const [a] = it2.boundaries;
    const c = S.reportable.partialIntensity;
    pin(10, [
      ...it2.boundaries.map((b) => row(b.boundaryLabel, b.denominatorValue, b.unit, inten(b.scope1Intensity), inten(b.scope2Intensity), inten(b.totalIntensity), yn(b.reportable))),
      `The comparability note on the first, verbatim: "${a.comparabilityNote}"`,
      `An intensity inherits its inventory's status. With the electricity factor blank the total intensity is ${inten(c.totalIntensity)} ${c.unit}, reportable ${yn(c.reportable)}, because: ${c.notReportableBecause.join('; ')}.`,
      REF(it2.noBoundary),
    ]);
  });
});

describe('AGREEMENT WITH THE DIGEST, the Professional sections', () => {
  it('SECTION 11, the Isiokpo fuel gas and the mass balance', () => {
    const { st, noCo2, massBalance: mb } = S.combustion;
    pin(11, [
      row('o2PerKmolFuel', frac(st.o2PerKmolFuel), 'kmol O2 per kmol fuel'),
      row('stoichAirPerKmolFuel', frac(st.stoichAirPerKmolFuel), 'kmol air per kmol fuel'),
      row('stoichAirKgPerKgFuel', frac(st.stoichAirKgPerKgFuel), 'kg air per kg fuel'),
      row('fuelMolarMassKgKmol', kg(st.fuelMolarMassKgKmol), 'kg per kmol'),
      row('products.co2PerKmolFuel', frac(st.products.co2PerKmolFuel), 'kmol per kmol fuel'),
      row('products.h2oPerKmolFuel', frac(st.products.h2oPerKmolFuel), 'kmol per kmol fuel'),
      row('products.airN2PerKmolFuel', frac(st.products.airN2PerKmolFuel), 'kmol per kmol fuel'),
      row('products.fuelN2PerKmolFuel', frac(st.products.fuelN2PerKmolFuel), 'kmol per kmol fuel'),
      row('lhvMJPerKmolFuel', st.lhvMJPerKmolFuel.toFixed(4), 'MJ per kmol fuel'),
      row('hhvMJPerKmolFuel', st.hhvMJPerKmolFuel.toFixed(4), 'MJ per kmol fuel'),
      `With the CO2 taken out of the analysis and the rest renormalised, o2PerKmolFuel is ${frac(noCo2.o2PerKmolFuel)} and lhvMJPerKmolFuel ${noCo2.lhvMJPerKmolFuel.toFixed(4)}: the inerts dilute the fuel.`,
      row('fuel plus air in (fuel molar mass plus actual air times AIR_MOLAR_MASS)', kg(mb.inKg)),
      row('flue gas out (engine dry flue gas plus engine moisture)', kg(mb.outKg)),
      row('out less in (computed here)', frac(mb.computedHere.outLessIn)),
    ]);
  });

  it('SECTION 12, excess air from the stack oxygen, and its refusals', () => {
    const a = S.excessAir;
    pin(12, [
      `The engine's assumption, verbatim: "${a.assumption}"`,
      ...a.rows.map((x) => row(x.o2, pct(x.r.excessAirPercent), frac(x.r.actualAirPerKmolFuel), frac(x.r.dryFlueGasPerKmolFuel), frac(x.r.wetFlueGasPerKmolFuel))),
      ...a.refusals.map((r) => row(r.call, REF(r.error))),
    ]);
  });

  it('SECTION 13, stack loss on LHV and on HHV, its refusals and the radiation sweep', () => {
    const c = S.stackLossCases;
    const l = S.stackLoss;
    pin(13, [
      ...c.rows.map((x) => row(x.label, x.r.basis, pct(x.r.excessAirPercent), pct(x.losses['Dry flue gas']), pct(x.losses['Moisture from hydrogen']), pct(x.losses['Radiation and convection']), pct(x.losses['Unburned and other']), pct(x.r.totalLossPercent), pct(x.r.efficiencyPercent))),
      `dryFlueGasKgPerKmolFuel at 5.5 percent: ${kg(l.lhv.dryFlueGasKgPerKmolFuel)}; moistureKgPerKmolFuel: ${kg(l.lhv.moistureKgPerKmolFuel)}.`,
      `The same heater at the same oxygen reads ${pct(l.lhv.efficiencyPercent)} percent on LHV and ${pct(l.hhv.efficiencyPercent)} percent on HHV, a difference of ${pct(l.computedHere.lhvLessHhv)} percentage points (computed here from the engine's figures).`,
      `The moisture note on LHV, verbatim: "${l.lhv.moistureBasisNote}"`,
      `The moisture note on HHV, verbatim: "${l.hhv.moistureBasisNote}"`,
      `The comparison warning on LHV, verbatim: "${l.lhv.comparisonWarning}"`,
      ...c.refusals.map((r) => row(r.call, REF(r.error))),
      ...c.radiation.map((x) => row(x.rad.toFixed(1), pct(x.r.efficiencyPercent))),
    ]);
  });

  it('SECTION 14, what tuning the excess air is worth, the shortcut as contrast, the refusals and the sweep', () => {
    const t = S.tuning;
    const s = t.save;
    const sc = t.computedHere.shortcut;
    pin(14, [
      row('basis', s.basis), row('currentEfficiencyPercent', pct(s.currentEfficiencyPercent)), row('targetEfficiencyPercent', pct(s.targetEfficiencyPercent)),
      row('fuelSavingFraction', s.fuelSavingFraction.toFixed(10)), row('fuelSavingPercent', pct(s.fuelSavingPercent)), row('annualEnergySavedGJ', gj(s.annualEnergySavedGJ)),
      `The engine's method, verbatim: "${s.method}"`,
      `The percentage-point shortcut on the same figures (computed here from the engine's efficiencies; the engine does not return it): a saving fraction of ${sc.fraction.toFixed(10)}, which is ${gj(sc.gj)} GJ a year, ${gj(sc.belowEngine)} GJ below the engine's saving.`,
      ...S.tuningCases.refusals.map((r) => row(r.call, REF(r.error))),
      ...S.tuningCases.sweep.map((x) => row(x.o2.toFixed(1), pct(x.tgt.efficiencyPercent), pct(x.save.fuelSavingPercent), gj(x.save.annualEnergySavedGJ))),
    ]);
    pinIn(14, [`On HHV the same tuning is a saving fraction of ${t.onHhv.fuelSavingFraction.toFixed(10)} (fuelSavingPercent ${pct(t.onHhv.fuelSavingPercent)})`]);
  });

  it('SECTION 15, the steam trap at both exponents, its refusals, the missing boiler and the hours left out', () => {
    const c = S.trapCases;
    pin(15, [
      ...c.rows.map((x) => row(x.k, kgh(x.r.kgPerHour), t3(x.r.tonnesPerYear), usd(x.r.annualCost), gj(x.r.annualFuelGJ), t3(x.r.annualTonnesCo2e))),
      `At the superheated exponent the same trap loses ${t3(c.computedHere.moreTonnes)} tonnes a year more, a ratio of ${share(c.computedHere.ratio)} to the saturated figure (computed here from the engine's figures).`,
      `The choked-flow note, verbatim: "${c.chokedNote}"`,
      ...c.refusals.map((r) => row(r.call, REF(r.error))),
      `With the boiler efficiency blank the trap still loses ${t3(c.noBoiler.tonnesPerYear)} tonnes a year, and the fuel and carbon are none. fuelNote, verbatim: "${c.noBoiler.fuelNote}" carbonNote, verbatim: "${c.noBoiler.carbonNote}"`,
      `Hours left out of the call take the stated default of 8760: ${t3(c.hoursLeftOut.tonnesPerYear)} tonnes a year.`,
    ]);
    expect(c.noBoiler.annualFuelGJ).toBeNull();
    expect(c.noBoiler.annualTonnesCo2e).toBeNull();
  });

  it('SECTION 16, condensate return priced and as a floor, and its refusals', () => {
    const { full, floor, refusals } = S.condensateCases;
    pin(16, [
      row('extraCondensateTonnesPerYear', t3(full.extraCondensateTonnesPerYear), t3(floor.extraCondensateTonnesPerYear)),
      row('energySavedGJPerYear', gj(full.energySavedGJPerYear), gj(floor.energySavedGJPerYear)),
      ...full.components.map((c, i) => row(c.label, usd(c.amount), usd(floor.components[i].amount))),
      row('annualValue', usd(full.annualValue), usd(floor.annualValue)),
      row('complete', yn(full.complete), yn(floor.complete)),
      row('annualTonnesCo2e', t3(full.annualTonnesCo2e), t3(floor.annualTonnesCo2e)),
      `valueNote with the treatment blank, verbatim: "${floor.valueNote}"`,
      ...refusals.map((r) => row(r.call, REF(r.error))),
    ]);
  });

  it('SECTION 17, the pinch at three approaches, the problem table, the threshold problem and the refusals', () => {
    const c = S.pinchCases;
    const tb = c.table;
    pin(17, [
      ...c.streams.map((s) => row(s.label, s.supplyC, s.targetC, s.cpKWperK)),
      ...c.rows.map(({ d, p: q }) => row(d, kw(q.hotUtilityKW), kw(q.coldUtilityKW), degc(q.pinchHotC), degc(q.pinchColdC), kw(q.heatRecoveredKW), kw(q.totalHotStreamDutyKW), kw(q.totalColdStreamDutyKW), kw(q.balanceCheck), yn(q.thresholdProblem))),
      ...tb.intervals.map((iv) => row(degc(iv.topShiftedC), degc(iv.bottomShiftedC), frac(iv.cpHotKWperK), frac(iv.cpColdKWperK), kw(iv.surplusKW), kw(iv.cascadeKW))),
      `The heat flow is zero at shifted ${degc(tb.pinchShiftedC)} C, inside the range: the pinch, ${degc(tb.pinchHotC)} C on the hot side and ${degc(tb.pinchColdC)} C on the cold side.`,
      `The engine's note, verbatim: "${tb.crossPinchNote}"`,
      row(kw(c.threshold.hotUtilityKW), kw(c.threshold.coldUtilityKW), degc(c.threshold.pinchHotC), yn(c.threshold.thresholdProblem)),
      ...c.threshold.grandComposite.map((g) => row(degc(g.shiftedC), kw(g.heatFlowKW))),
      ...c.refusals.map((r) => row(r.call, REF(r.error))),
    ]);
  });
});

describe('AGREEMENT WITH THE DIGEST, the Expert sections', () => {
  it('SECTION 18, the cost of a tonne at the rate, at 0 and against one year', () => {
    const t = S.costTable;
    pin(18, [
      ...t.rows.map(({ m }) => row(m.label, m.capitalCost, m.annualSavings, m.annualCost, m.tonnesAbatedPerYear, m.lifeYears, m.actsOn.join(', '))),
      ...t.rows.map(({ m, r }) => row(m.label, crf(r.capitalRecoveryFactor), usd(r.annualisedCapital), usd(r.netAnnualCost), usdt(r.costPerTonne), yn(r.paysForItself))),
      ...t.rows.map(({ m, atZero, computedHere }) => row(m.label, usdt(atZero.costPerTonne), usdt(computedHere.oneYear))),
    ]);
  });

  it('SECTION 19, what the cost of a tonne refuses and what it names', () => {
    const c = S.costRefusals;
    pin(19, c.rows.map((r) => row(r.call, REF(r.error))));
    pinIn(19, [
      `${c.label} with the savings and the running cost blank: costPerTonne ${usdt(c.named.costPerTonne)} USD, assumedZero: ${c.named.assumedZero.join(', ')}.`,
      `${c.label} with capital 0 answers costPerTonne ${usdt(c.capitalZero.costPerTonne)} USD and capitalRecoveryFactor ${crf(c.capitalZero.capitalRecoveryFactor)}.`,
      `An abatement of 0 is accepted and has no cost per tonne: costPerTonne ${usdt(c.abatementZero.costPerTonne)}, paysForItself ${yn(c.abatementZero.paysForItself)}.`,
    ]);
  });

  it('SECTION 20, the curve, its outputs, the plain mean and the interactions', () => {
    const cv = S.curves[0];
    const c = cv.curve;
    pin(20, [
      ...c.steps.map((s, i) => row(i + 1, s.label, usdt(s.costPerTonne), t3(s.tonnesAbatedPerYear), t3(s.cumulativeStartTonnes), t3(s.cumulativeEndTonnes), yn(s.paysForItself))),
      row('totalAbatementTonnes', t3(c.totalAbatementTonnes)), row('paysForItselfTonnes', t3(c.paysForItselfTonnes)),
      row('paysForItselfMeasures', c.paysForItselfMeasures.join('; ')), row('netAnnualCostOfAll USD', usd(c.netAnnualCostOfAll)),
      row('weightedAverageCostPerTonne USD', usdt(c.weightedAverageCostPerTonne)), row('additive', yn(c.additive)),
      ...c.interactions.map((x) => row(x.sourceId, x.measures.join('; '))),
      `The interaction note, verbatim: "${c.interactionNote}"`,
    ]);
    pinIn(20, [`The plain mean of the six costs per tonne (computed here) is ${usdt(cv.computedHere.plainMean)} USD`]);
  });

  it('the curve drawn as steps tiles the axis from 0 and ends at the total', () => {
    const c = S.curves[0].curve;
    const pts = L.curveSteps(c);
    expect(pts[0].tonnes).toBe(0);
    expect(pts[pts.length - 1].tonnes).toBe(c.totalAbatementTonnes);
    expect(pts.slice(0, -1).map((q) => q.cost)).toEqual(c.steps.map((s) => s.costPerTonne));
  });

  it('SECTION 21, the inventory the measures act on, the sources passed and the three curves with their verdicts', () => {
    const ag = S.agbor;
    pin(21, [
      ...ag.inv.lines.map((l) => row(l.label, l.scope, t3(l.tCo2e))),
      row('Total, Scope 1 and Scope 2', '', t3(ag.inv.totalTonnes)),
      ...Object.entries(ag.sources).map(([k, v]) => row(k, t3(v))),
      ...S.curves.map((cv) => {
        const c = cv.curve;
        return row(cv.presetLabel, t3(c.totalAbatementTonnes), t3(c.targetTonnes), yn(c.meetsTarget), plain(c.targetBasis), t3(c.residualToTargetTonnes),
          c.overClaims.length ? c.overClaims.map((o) => `${o.sourceId}: claimed ${t3(o.claimedTonnes)} against ${t3(o.emittedTonnes)} emitted`).join('; ') : 'none');
      }),
    ]);
    pinIn(21, [`The target is 30 percent of the inventory total: ${t3(ag.computedHere.target)} tCO2e`]);
  });

  it('every source a measure acts on is listed, and one with no emission passed is unchecked', () => {
    const [costed, , unchecked] = S.curves;
    expect(costed.sources.map((s) => s.id).sort()).toEqual(['flare', 'heaters', 'power', 'steam', 'vents']);
    expect(costed.sources.filter((s) => s.checked).map((s) => s.id).sort()).toEqual(['flare', 'heaters']);
    expect(unchecked.sources.find((s) => s.id === 'flare').checked).toBe(false);
    expect(unchecked.sources.find((s) => s.id === 'flare').emitted).toBeNull();
  });

  it('SECTION 22, the path, its gap note, the partial inventory, the unscheduled measure and the refusals', () => {
    const [full, partial, uns] = S.paths;
    pin(22, [
      ...full.path.rows.map((r) => row(r.year, t3(r.abatedTonnes), t3(r.emissionsTonnes), t3(r.targetTonnes), t3(r.unabatedGapTonnes), r.measuresLive.length ? r.measuresLive.join('; ') : 'none')),
      `firstShortfallYear: ${plain(full.path.firstShortfallYear)}. finalGapTonnes: ${t3(full.path.finalGapTonnes)}.`,
      `The gap note, verbatim: "${full.path.gapNote}"`,
      row('the full inventory', t3(full.path.rows[full.path.rows.length - 1].targetTonnes), t3(full.path.finalGapTonnes), plain(full.path.firstShortfallYear)),
      row('the partial inventory', t3(partial.path.rows[partial.path.rows.length - 1].targetTonnes), t3(partial.path.finalGapTonnes), plain(partial.path.firstShortfallYear)),
      `A measure with no start year is named and left off the path: unscheduledMeasures ${uns.path.unscheduledMeasures.map((u) => `${u.label} (${u.reason})`).join('; ')}; finalGapTonnes ${t3(uns.path.finalGapTonnes)}.`,
      REF(S.pathRefusals.zeroBaseline),
      REF(S.pathRefusals.reversedYears),
    ]);
    pinIn(22, [`the inventory totals ${t3(partial.baseline)} tCO2e and is reportable ${yn(partial.reportable)} (${partial.notReportableBecause.join('; ')})`]);
  });

  it('SECTION 23, one saving in money and carbon, the one-year contrast and the calls', () => {
    const { ps, computedHere } = S.saving;
    const c = S.savingCalls;
    pin(23, [
      row('annualValue USD', usd(ps.annualValue)), row('annualTonnesCo2e', t3(ps.annualTonnesCo2e)),
      row('simplePaybackYears', frac(ps.simplePaybackYears)), row('costPerTonneCo2e USD', usdt(ps.costPerTonneCo2e)), row('basis', ps.basis),
      row('no life and no rate', `costPerTonneCo2e ${usdt(c.noLife.costPerTonneCo2e)}; costPerTonneNote "${c.noLife.note}"`),
      row('no emission factor', `annualTonnesCo2e ${t3(c.noFactor.annualTonnesCo2e)}; carbonNote "${c.noFactor.note}"`),
      row('no basis declared', `basisNote "${c.noBasis.note}"`),
      row('saving on LHV, factor on HHV', REF(c.mixed)),
      row('saving blank', REF(c.blank)),
    ]);
    pinIn(23, [`gives ${usdt(computedHere.oneYear)} USD a tonne.`]);
  });

  it('SECTION 24, energy intensity and the peer, with a stream blanked', () => {
    const e = S.energy;
    const m = S.energyMissing;
    pin(24, [
      ...e.streams.map((s) => row(s.label, gj(s.energyGJ), share(s.share))),
      row('all three streams', yn(e.complete), gj(e.totalEnergyGJ), mjt(e.intensityMJPerTonne), frac(e.versusPeer), mjt(e.gapMJPerTonne)),
      row('purchased power blank', yn(m.complete), gj(m.totalEnergyGJ), mjt(m.intensityMJPerTonne), frac(m.versusPeer), mjt(m.gapMJPerTonne)),
      `peerNote with a stream missing, verbatim: "${m.peerNote}"`,
      `The disclaimer, verbatim: "${e.disclaimer}"`,
      REF(S.energyNoThroughput),
    ]);
  });

  it('SECTION 25, the held items as the digest states them', () => {
    const held = Object.fromEntries(L.HELD);
    pin(25, [row('H1', held.H1), row('H3', held.H3), row('H4', held.H4)]);
    pinIn(25, [held.H2.slice(held.H2.indexOf('The pair is labelled typical'))]);
    pinIn(25, ['typical methane heating values are 802.6 LHV and 890.8 HHV MJ per kmol']);
  });
});

// ---------------------------------------------------------------------------
// MISSING STAYS MISSING, and the panels' presets read the engine live.
// ---------------------------------------------------------------------------

describe('MISSING STAYS MISSING: a blank box reaches the engine blank', () => {
  it('a blank flare efficiency is the engine\'s refusal, and the flare leaves the inventory', () => {
    const inv = L.inventory({ flareInputs: { destructionEfficiencyFraction: '' } });
    expect(inv.flare.error).toBe(S.flareSweep.blank);
    expect(inv.inv.lines.some((l) => /^Flaring/.test(l.label))).toBe(false);
    expect(inv.inv.totalTonnes).toBeLessThan(S.inventory.inv.totalTonnes);
    // Typed back in, the flare returns to the digest's inventory.
    expect(L.inventory({ flareInputs: { destructionEfficiencyFraction: '0.98' } }).inv.totalTonnes).toBe(S.inventory.inv.totalTonnes);
  });

  it('every required box on every tier is refused blank, by the engine', () => {
    const blanks = [
      L.heaters({ fuelKmolPerYear: '' }),
      L.stackLoss({ radiationLossPercent: '' }).lhv,
      L.tuning({ floor: '' }).save,
      L.tuning({ targetO2: '' }).save,
      L.tuning({ targetO2: '1.5' }).save,
      L.trap({ specificHeatRatio: '' }),
      L.trap({ hoursPerYear: '' }),
      L.trap({ dischargeCoefficient: '' }),
      L.condensate({ boilerEfficiencyFraction: '' }),
      L.condensate({ hoursPerYear: '' }),
      L.pinch(''),
      L.costMeasure({ ...L.AGBOR_MEASURES[2], capitalCost: '' }),
      L.costMeasure(L.AGBOR_MEASURES[2], ''),
      L.costMeasure(L.AGBOR_MEASURES[2], '10'),
      L.saving({ energyBasis: 'LHV', emissionFactorBasis: 'HHV' }).ps,
      L.excessAirAt(21),
      L.excessAirAt(''),
    ];
    blanks.forEach((r, i) => expect(r.error, `case ${i}`).toBeTruthy());
    expect(L.trap({ boilerEfficiencyFraction: '' }).annualFuelGJ).toBeNull();
    expect(L.condensate({ treatmentCostPerTonne: '' }).complete).toBe(false);
  });

  it('a refused measure goes to the curve with its label, and the lab lists it with the engine\'s sentence', () => {
    const ms = L.AGBOR_MEASURES.map((m, i) => (i === 2 ? { ...m, capitalCost: '' } : m));
    const cv = L.curve({ measures: ms });
    expect(cv.refusedHere).toHaveLength(1);
    expect(cv.refusedHere[0].label).toBe('Heat integration project');
    expect(cv.refusedHere[0].reason).toBe(S.costRefusals.rows.find((r) => r.call === 'capital cost blank').error);
    expect(cv.curve.steps.map((s) => s.label)).not.toContain('Heat integration project');
    expect(Array.isArray(cv.refusedByEngine)).toBe(true);
  });

  it('refusedNamedBy reads a refused-measure list under any of the engine\'s likely keys, and nothing when there is none', () => {
    expect(L.refusedNamedBy({ error: null, refusedMeasures: [{ label: 'a', reason: 'b' }] })).toEqual([{ label: 'a', reason: 'b' }]);
    expect(L.refusedNamedBy({ error: null, refused: ['x'] })).toEqual([{ label: 'x', reason: null }]);
    expect(L.refusedNamedBy({ error: null })).toEqual([]);
    expect(L.refusedNamedBy(null)).toEqual([]);
  });

  it('no lab or panel source fills a missing input with a default', () => {
    const DEFAULTING = /(\|\||\?\?)\s*(0|1|0\.98|0\.1|8760|8784|1\.135|1\.3|0\.83|1\.8|2)\b(?!\.\d)/;
    [LAB_FILE, ...SHARED_FILES, ...PANEL_FILES].forEach((f) => {
      const bad = strip(sourceOf(f)).split('\n').filter((l) => DEFAULTING.test(l));
      expect(bad, f).toEqual([]);
    });
    // CONTROL: the detector fires.
    expect(DEFAULTING.test('const eta = x.eta || 1;')).toBe(true);
    expect(DEFAULTING.test('const h = x.hours ?? 8760;')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE and THE ZONE GATE.
// ---------------------------------------------------------------------------

const CLOCK = /new Date\(|Date\.now|performance\.now|Math\.random|getTimezoneOffset|Intl\.DateTimeFormat/;

describe('THE CLOCK GATE: nothing reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('neither vendored engine file reads a clock or a random number', () => {
    ENGINE_SRC.forEach(([f, src]) => {
      expect(strip(src).length, f).toBeGreaterThan(5000);
      expect(strip(src), f).not.toMatch(CLOCK);
    });
  });

  it('no lab, panel or page source reads one either', () => {
    ALL_SOURCES.forEach((file) => {
      const code = strip(sourceOf(file));
      expect(code.length, `${file} was stripped to nothing`).toBeGreaterThan(400);
      expect(code, `${file} reads a clock`).not.toMatch(CLOCK);
    });
    // CONTROL on the stripper and the pattern.
    expect(strip('// Date.now() in a comment\nconst x = 1;\n')).not.toMatch(CLOCK);
    expect(strip('const now = Date.now();\n')).toMatch(CLOCK);
  });

  it('AT RUN TIME: the whole snapshot is identical under two faked system dates', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const early = JSON.stringify(L.teachingSurface());
    const earlyNow = Date.now();
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    const late = JSON.stringify(L.teachingSurface());
    // CONTROL: the faked clock really moved, so the gate can see a read.
    expect(Date.now()).not.toBe(earlyNow);
    expect(late.length).toBeGreaterThan(50000);
    expect(late).toBe(early);
  });
});

const ZONES = [['Pacific/Pago_Pago', -660], ['Pacific/Kiritimati', 840]];
const CHILD_ZONE = process.env.CARBON_TZ_CHILD;
const SIDECAR = process.env.CARBON_TZ_SIDECAR;

describe('THE ZONE GATE: the lab reproduces byte for byte on both sides of the date line', () => {
  ZONES.forEach(([zone, offset]) => {
    it(`the whole snapshot under TZ=${zone} is byte-identical`, () => {
      if (CHILD_ZONE) {
        if (CHILD_ZONE !== zone) return;
        const offsetMinutes = -new Date('2026-09-19T12:00:00Z').getTimezoneOffset();
        fs.writeFileSync(SIDECAR, JSON.stringify({
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          offsetMinutes,
          snapshot: JSON.stringify(L.teachingSurface()),
        }));
        return;
      }
      const sidecar = path.join(ROOT, 'node_modules', `.carbon-tz-${zone.replace(/\W/g, '_')}.json`);
      if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
      execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), [
        'run', '--reporter=dot', '--config', 'vitest.config.js',
        'src/components/course/panels/carbon/carbonLab.test.js',
        '-t', `under TZ=${zone} is byte-identical`,
      ], {
        cwd: ROOT,
        env: { ...process.env, TZ: zone, CARBON_TZ_CHILD: zone, CARBON_TZ_SIDECAR: sidecar },
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
// THE ANSWER SWEEP: nothing the lab hands a panel sits near a graded answer.
// ---------------------------------------------------------------------------

const walk = (v, q, visit) => {
  visit(v, q);
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${q}[${i}]`, visit));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${q}.${k}`, visit));
};
const nearGraded = (surface, exempt = []) => {
  const hits = [];
  walk(surface, 'S', (v, q) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) return;
    FIELDS.forEach(([, key, value, tol]) => {
      if (Math.abs(Math.abs(v) - Math.abs(value)) <= 10 * tol && !exempt.some(([ep, ek]) => ep === q && ek === key)) hits.push(`${q} = ${v} sits on ${key}`);
    });
  });
  return hits;
};

/**
 * FOUR TEACHING FIGURES SIT NUMERICALLY NEAR A GRADED ANSWER OF ANOTHER QUANTITY,
 * each exempt BY EXACT PATH AND KEY: an excess air percent near a cost per tonne,
 * a total loss percent near a weighted average cost, and the over-claim curve's
 * flare recovery cost per tonne near a hot utility in kW. None is the same kind
 * of figure as the answer it sits near, and each lies more than one grading
 * tolerance away, so entering it would be graded wrong. A dead exemption fails.
 */
const SWEEP_EXEMPT = [
  ['S.excessAir.rows[4].r.excessAirPercent', 'ikorodu_waste_heat_cost_per_t_usd'],
  ['S.tuningCases.sweep[3].tgt.totalLossPercent', 'ikorodu_curve_weighted_average_usd_per_t'],
  ['S.curves[1].curve.steps[5].costPerTonne', 'igrita_pinch_hot_utility_kw'],
  ['S.curves[2].curve.steps[5].costPerTonne', 'igrita_pinch_hot_utility_kw'],
];
const at = (surface, q) => q.slice(2).split(/\.|\[|\]/).filter(Boolean).reduce((o, k) => (o === null || o === undefined ? o : o[k]), surface);

describe('THE ANSWER SWEEP: no number in the snapshot is a graded capstone answer', () => {
  it('eighteen graded answers are read', () => {
    expect(FIELDS).toHaveLength(18);
  });

  it('the snapshot carries none of them, to within ten grading tolerances', () => {
    let count = 0;
    walk(S, 'S', (v) => { if (typeof v === 'number') count += 1; });
    expect(count, 'the snapshot carries almost no numbers, so this sweep is vacuous').toBeGreaterThan(1500);
    expect(nearGraded(S, SWEEP_EXEMPT)).toEqual([]);
  });

  it('each exemption is live, of another quantity, and more than one grading tolerance from its answer', () => {
    SWEEP_EXEMPT.forEach(([q, key]) => {
      const v = at(S, q);
      const [, , value, tol] = FIELDS.find(([, k]) => k === key);
      expect(typeof v, q).toBe('number');
      expect(nearGraded(S).some((h) => h.startsWith(`${q} = `) && h.endsWith(key)), `${q} no longer sits near ${key}, so drop its exemption`).toBe(true);
      expect(Math.abs(Math.abs(v) - Math.abs(value)), q).toBeGreaterThan(tol);
    });
  });

  it('NEGATIVE CONTROL: a graded answer planted in a copy of the snapshot is caught, signed either way', () => {
    FIELDS.forEach(([, key, value]) => {
      expect(nearGraded({ ...S, planted: { x: value } }).some((h) => h.includes(key)), key).toBe(true);
      expect(nearGraded({ planted: [-value] }).some((h) => h.includes(key)), key).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// THE RENDER GATE.
// ---------------------------------------------------------------------------

const MODE_COMPONENTS = [
  ['InventoryExplorer', IE, InventoryExplorer, ['AtomMode', 'FlareMode', 'SetsMode', 'InventoryMode']],
  ['EfficiencyExplorer', EX, EfficiencyExplorer, ['FuelMode', 'AirMode', 'LossMode', 'TuningMode', 'SteamMode', 'PinchMode']],
  ['AbatementExplorer', AX, AbatementExplorer, ['CostMode', 'CurveMode', 'TargetMode', 'PathMode', 'SavingMode']],
];

const noop = () => {};
const str = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v === null || v === undefined ? '' : String(v)]));
const REAL_PROPS = {
  AtomMode: () => ({
    heat: L.heaters(), fl: L.flare(), heatIn: str(L.IGBOGENE_HEATERS), flIn: str(L.IGBOGENE_FLARE_RECORD), onHeat: noop, onFlare: noop, unit: L.atomUnit(), refusals: L.carbonRefusals(),
  }),
  FlareMode: () => ({ sweep: L.flareSweep() }),
  SetsMode: () => ({ gwp: L.gwpSets(), onSets: L.inventoryOnSets(), setKey: L.COURSE_SET }),
  InventoryMode: () => ({
    inv: L.inventory(), steps: L.reportableSteps(), step: 0, onStep: noop, flareDe: '0.98', onFlareDe: noop,
  }),
  FuelMode: () => ({ comb: L.combustion(), fuel: L.ISIOKPO_FUEL.map(([c, y]) => [c, String(y)]), onFuel: noop }),
  AirMode: () => ({
    air: L.excessAir(), at: L.excessAirAt(5.5), o2: 5.5, onO2: noop,
  }),
  LossMode: () => ({
    loss: L.stackLoss(), cases: L.stackLossCases(), o2: 5.5, onO2: noop, rad: '1.8', onRad: noop,
  }),
  TuningMode: () => ({
    tune: L.tuning(), cases: L.tuningCases(), inputs: { currentO2: '5.5', targetO2: '2.8', floor: '2', annualGJ: '410000' }, onInput: noop,
  }),
  SteamMode: () => ({
    tr: L.trap(), cases: L.trapCases(), trapIn: str(L.ISIOKPO_TRAP), onTrap: noop, cond: L.condensate(), condCases: L.condensateCases(), condIn: str(L.ISIOKPO_CONDENSATE), onCond: noop,
  }),
  PinchMode: () => ({
    p: L.pinch(15), cases: L.pinchCases(), dtmin: 15, onDtmin: noop, preset: 'isiokpo', onPreset: noop,
  }),
  CostMode: () => ({
    table: L.costTable(), refusals: L.costRefusals(), measures: L.AGBOR_MEASURES.map((m) => ({ ...m })), onMeasure: noop, rate: '0.1', onRate: noop,
  }),
  CurveMode: () => ({ cv: L.curve() }),
  TargetMode: () => ({ cv: L.curve({ preset: 'overclaim' }), preset: 'overclaim', onPreset: noop }),
  PathMode: () => ({
    p: L.path('full'), refusals: L.pathRefusals(), preset: 'full', onPreset: noop,
  }),
  SavingMode: () => ({
    sv: L.saving(), calls: L.savingCalls(), inputs: { ...str(L.AGBOR_SAVING), energyBasis: 'LHV', fuelCostBasis: 'LHV', emissionFactorBasis: 'LHV' }, onInput: noop, en: L.energy(), blank: '', onBlank: noop,
  }),
};
const render = (Comp, props) => renderToStaticMarkup(React.createElement(Comp, props));

describe('THE RENDER GATE', () => {
  it('every mode in a MODES list has a component, and every component is in the list', () => {
    MODE_COMPONENTS.forEach(([name, ns, , comps]) => {
      expect(ns.MODES.length, name).toBe(comps.length);
      comps.forEach((k) => expect(typeof ns[k], `${name}.${k}`).toBe('function'));
    });
  });

  it('every mode has a real-props builder', () => {
    const all = MODE_COMPONENTS.flatMap(([, , , comps]) => comps);
    expect(Object.keys(REAL_PROPS).sort()).toEqual([...all].sort());
  });

  MODE_COMPONENTS.forEach(([name, ns, , comps]) => {
    comps.forEach((k) => {
      it(`${name}.${k} renders its empty state with nothing, and with every prop error-shaped`, () => {
        const Comp = ns[k];
        const err = { error: 'nothing' };
        const html1 = render(Comp, {});
        const real = REAL_PROPS[k]();
        const props = Object.fromEntries(Object.keys(real).map((q) => [q, typeof real[q] === 'function' ? noop : err]));
        const html2 = render(Comp, props);
        expect(html1.length).toBeGreaterThan(20);
        expect(html2.length).toBeGreaterThan(20);
      });

      it(`${name}.${k} renders on real data, and with each data prop error-shaped in turn`, () => {
        const real = REAL_PROPS[k]();
        const full = render(ns[k], real);
        expect(full.length).toBeGreaterThan(400);
        expect(full).not.toContain('has returned nothing');
        const dataProps = Object.keys(real).filter((q) => real[q] && typeof real[q] === 'object' && !Array.isArray(real[q]));
        expect(dataProps.length).toBeGreaterThan(0);
        dataProps.forEach((q) => {
          const html = render(ns[k], { ...real, [q]: { error: 'nothing' } });
          expect(html.length, `${k} with ${q} error-shaped`).toBeGreaterThan(20);
        });
      });
    });
  });

  MODE_COMPONENTS.forEach(([name, ns, Panel]) => {
    ns.MODES.forEach(([mode]) => {
      it(`${name} renders on real data in its ${mode} view`, () => {
        const html = render(Panel, { initialMode: mode });
        expect(html.length).toBeGreaterThan(1500);
        expect(html).not.toContain('has returned nothing');
      });
    });
  });

  it('the inventory view opens on the digest inventory with its status beside every total, and the four sets with report and horizon', () => {
    const html = render(InventoryExplorer, { initialMode: 'inventory' });
    const inv = S.inventory.inv;
    [t3(inv.totalTonnes), t3(inv.scope1Tonnes), t3(inv.scope2Tonnes), 'reportable true', inv.gwpSetLabel].forEach((x) => expect(html).toContain(x));
    S.gwp.sets.forEach((s) => {
      expect(html).toContain(s.label);
      expect(html).toContain(`report ${s.report}, horizon ${s.horizon}`);
    });
    expect(html).toContain(S.gwp.source.slice(0, 40).replace(/"/g, '&quot;'));
    expect(html.toLowerCase()).not.toContain('recommend');
  });

  it('the flare box emptied shows the engine\'s refusal and the inventory loses its flare lines', () => {
    const inv = L.inventory({ flareInputs: { destructionEfficiencyFraction: '' } });
    const html = render(IE.InventoryMode, { ...REAL_PROPS.InventoryMode(), inv, flareDe: '' });
    expect(html).toContain(S.flareSweep.blank);
    expect(html).not.toContain('Flaring (CO2)');
  });

  it('the stack losses are two charts on two bases, and a reading at the oxygen in air is refused by the engine', () => {
    const html = render(EfficiencyExplorer, { initialMode: 'losses' });
    expect(html).toContain(pct(S.stackLoss.lhv.efficiencyPercent));
    expect(html).toContain(pct(S.stackLoss.hhv.efficiencyPercent));
    expect(html).toContain('On LHV');
    expect(html).toContain('On HHV');
    const at = L.excessAirAt(21);
    const air = render(EX.AirMode, { ...REAL_PROPS.AirMode(), at, o2: 21 });
    expect(air).toContain(at.error);
  });

  it('the tuning view shows the engine\'s ratio with the shortcut labelled as the contrast figure, and a target below the floor refused', () => {
    const html = render(EX.TuningMode, REAL_PROPS.TuningMode());
    expect(html).toContain(gj(S.tuning.save.annualEnergySavedGJ));
    expect(html).toContain(gj(S.tuning.computedHere.shortcut.gj));
    expect(html).toContain('never the answer');
    const low = L.tuning({ targetO2: '1.5' });
    expect(render(EX.TuningMode, { ...REAL_PROPS.TuningMode(), tune: low })).toContain(low.save.error);
  });

  it('the target view prints targetBasis verbatim and labels a source with no emission passed as unchecked', () => {
    ['costed', 'overclaim', 'unchecked'].forEach((k) => {
      const cv = L.curve({ preset: k });
      const html = render(AX.TargetMode, { cv, preset: k, onPreset: noop });
      expect(html).toContain(cv.curve.targetBasis);
      expect(html).toContain(`meetsTarget ${yn(cv.curve.meetsTarget)}`);
    });
    const html = render(AX.TargetMode, { cv: L.curve({ preset: 'unchecked' }), preset: 'unchecked', onPreset: noop });
    expect(html).toContain('unchecked: no emission passed');
  });

  it('a rate typed as a percentage is the engine\'s refusal in the cost view', () => {
    const table = L.costTable(L.AGBOR_MEASURES, '10');
    const html = render(AX.CostMode, { ...REAL_PROPS.CostMode(), table, rate: '10' });
    expect(html).toContain(S.costRefusals.rows.find((r) => r.call.startsWith('discount rate 10')).error);
  });

  it('every ResponsiveContainer is given a width and a height', () => {
    PANEL_FILES.forEach((f) => {
      const tags = sourceOf(f).match(/<ResponsiveContainer[^>]*>/g) || [];
      expect(tags.length, `${f} draws no chart`).toBeGreaterThan(0);
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

const reasonsIn = (surface) => {
  const out = [];
  walk(surface, 'S', (v) => {
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.reason === 'string' && v.reason) out.push(v.reason);
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.error === 'string' && v.error) out.push(v.error);
  });
  return [...new Set(out)];
};
const stringsIn = (surface) => {
  const out = [];
  walk(surface, 'S', (v, q) => { if (typeof v === 'string') out.push([q, v]); });
  return out;
};

describe("THE REFUSAL LITERAL GATE: every refusal a panel shows is the engine's own", () => {
  it('no engine refusal sentence is typed into the lab, a panel or the page', () => {
    const reasons = reasonsIn(S);
    expect(reasons.length, 'the lab returns almost no refusals, so this sweep is vacuous').toBeGreaterThanOrEqual(30);
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
 * THE THREE ENGINE SENTENCES THE LESSONS QUOTE VERBATIM, and the only strings
 * exempt from the contrastive check: the atom balance method (SECTION 3), the
 * inventory disclaimer (SECTION 7) and the condensate floor note (SECTION 16).
 * Each is pinned to the digest, and a dead exemption fails.
 */
const EXEMPT = [S.atomUnit.method, S.inventory.inv.disclaimer, S.condensateCases.floor.valueNote];

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

  it('the three exempt engine sentences are the digest\'s verbatim quotes, and each still needs its exemption', () => {
    expect(EXEMPT).toHaveLength(3);
    pin(3, [`The engine's method, verbatim: "${EXEMPT[0]}"`]);
    pin(7, [`The engine's disclaimer, verbatim: "${EXEMPT[1]}"`]);
    pin(16, [`valueNote with the treatment blank, verbatim: "${EXEMPT[2]}"`]);
    EXEMPT.forEach((s) => expect(breaches(s), s).toBe(true));
  });

  it('every other string the lab hands a panel obeys it', () => {
    const strings = stringsIn(S);
    expect(strings.length).toBeGreaterThanOrEqual(300);
    expect(strings.filter(([, s]) => breaches(s) && !EXEMPT.includes(s)).map(([q, s]) => `${q}: ${s}`)).toEqual([]);
  });
});
