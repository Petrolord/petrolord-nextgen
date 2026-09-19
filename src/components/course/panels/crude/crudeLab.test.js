// Every value the crude teaching lab exposes to a panel or to the course page is
// pinned here against the teaching digest (tools/course-waves/crude/digest.txt),
// which is itself nothing but the vendored engines' return values on the
// OBIGBO, KWALE and APAPA records.
//
// THE GATES, and each one carries a control that is made to fire:
//
//   AGREEMENT WITH THE DIGEST  every reader's return is rebuilt into the
//                      digest's own lines, row by row and sentence by sentence,
//                      and each line must appear in the section that printed it.
//                      The control moves one figure by one unit in the fourth
//                      decimal and requires the rebuilt line to vanish.
//   THE WAVE INPUTS    read through tools/course-waves/waveInputs.mjs, which
//                      throws and names the file when one is missing. The teaching
//                      records in the lab are compared with crude_fields.mjs byte
//                      for byte and value for value, the committed copy is compared
//                      with the live wave directory when this machine has one, and
//                      the digest and graded answers are checked against the
//                      sha256 pins in waves.json.
//   THE BASIS RULE     every property the blend reports travels with the basis
//                      the engine names, and every wrong-basis reading differs
//                      from the engine's figure where the digest says it does.
//   THE CLOCK GATE     no engine, lab, panel or page source reads a date, a timer
//                      or a random number, and the whole snapshot is identical
//                      under two faked system dates.
//   THE ZONE GATE      the whole snapshot is rebuilt in a child process under
//                      TZ=Pacific/Pago_Pago and must be byte identical; the child
//                      proves it really ran west of Greenwich.
//   THE ANSWER SWEEP   no number anywhere in the snapshot lies within ten grading
//                      tolerances of a graded capstone answer, with a planted
//                      control that must be caught.
//   THE RENDER GATE    every mode of every panel renders with nothing and with an
//                      error-shaped object, and every panel renders in every mode
//                      on real data.
//   THE COPY RULE      no em dash, no en dash, no double hyphen and no "X, not Y"
//                      over the sources and over every string the lab hands a
//                      panel.
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
import * as L from './crudeLab.js';
import {
  waveDir, waveInput, mirrorDir, liveWaveDir, WAVES,
} from '../../../../../tools/course-waves/waveInputs.mjs';
import * as WAVE_FIELDS from '../../../../../tools/course-waves/crude/crude_fields.mjs';
import AssayExplorer, * as AE from './AssayExplorer.jsx';
import ValuationExplorer, * as VE from './ValuationExplorer.jsx';
import RecipeExplorer, * as RE from './RecipeExplorer.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

const WAVE_NAME = 'crude';
const WAVE = waveDir(WAVE_NAME);
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE_WAVE = liveWaveDir(WAVE_NAME);
const DIGEST = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');
const FIELDS_JSON = fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8');
const FIELDS = JSON.parse(FIELDS_JSON);
const FIELDS_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'crude_fields.mjs'), 'utf8');
const DUMP_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'crude_dump.mjs'), 'utf8');
const ENGINE_FILES = ['engines/downstream/crudeAssay.js', 'engines/downstream/productBlending.js', 'lib/lp/simplex.js'];
const ENGINE_SRC = ENGINE_FILES.map((f) => [f, fs.readFileSync(path.join(ROOT, 'packages/engines', f), 'utf8')]);

const LAB_FILE = 'crudeLab.js';
const PANEL_FILES = ['AssayExplorer.jsx', 'ValuationExplorer.jsx', 'RecipeExplorer.jsx'];
const SHARED_FILES = ['panelBits.jsx'];
const LEARNING_PAGE = path.resolve(ROOT, 'src/pages/apps/CrudeLearningPage.jsx');

const sourceOf = (file) => {
  const p = file === 'CrudeLearningPage.jsx' ? LEARNING_PAGE : path.join(HERE, file);
  if (!fs.existsSync(p)) {
    throw new Error(`source missing: ${file} is named in this suite's file list and is not at ${p}. `
      + 'A renamed or deleted file fails here rather than emptying the gates that read it.');
  }
  return fs.readFileSync(p, 'utf8');
};
const ALL_SOURCES = [LAB_FILE, ...SHARED_FILES, ...PANEL_FILES, 'CrudeLearningPage.jsx'];
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

/** The digest's own four decimals, written here independently of the lab's fx. */
const fx = (v) => {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`fx: ${v} is not a finite number`);
  const s = v.toFixed(4);
  return /^-0\.0+$/.test(s) ? s.slice(1) : s;
};
const fxOr = (v, word) => (v === null || v === undefined ? word : fx(v));
const inp = (v) => String(v);
const row = (...cells) => `| ${cells.join(' | ')} |`;
const orNothing = (a) => (a && a.length ? a.join(', ') : 'nothing');

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
  it('the digest is whole: twenty-seven sections', () => {
    expect(Object.keys(SECTIONS).length).toBe(27);
    expect(DIGEST.split('\n').length).toBeGreaterThan(900);
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

  it('the teaching records are copied VERBATIM from crude_fields.mjs, byte for byte', () => {
    const lab = sourceOf(LAB_FILE);
    const begin = '// ---- BEGIN VERBATIM crude_fields.mjs ----\n';
    const end = '// ---- END VERBATIM crude_fields.mjs ----';
    expect(lab).toContain(begin);
    expect(lab).toContain(end);
    const block = lab.slice(lab.indexOf(begin) + begin.length, lab.indexOf(end));
    const wave = FIELDS_MJS.slice(FIELDS_MJS.indexOf('const curve = (pts)'));
    expect(wave.length, 'the wave file carries almost nothing').toBeGreaterThan(8000);
    expect(block).toBe(wave);
    expect(DUMP_MJS).toContain("import * as F from './crude_fields.mjs';");
  });

  it('and they AGREE IN VALUE with the wave file when run, not only as text', () => {
    const names = Object.keys(WAVE_FIELDS);
    expect(names.length).toBeGreaterThanOrEqual(25);
    const differing = names.filter((k) => JSON.stringify(L[k]) !== JSON.stringify(WAVE_FIELDS[k]));
    expect(differing).toEqual([]);
  });

  it('every engine member the lab names resolves in the vendored modules', () => {
    const code = strip(sourceOf(LAB_FILE));
    const used = [...code.matchAll(/\b(CA|PB|LP)\.([A-Za-z_]\w*)/g)].map((m) => [m[1], m[2]]);
    expect(used.length).toBeGreaterThan(80);
    const missing = used.filter(([ns, name]) => L.ENGINE[ns][name] === undefined).map(([ns, n]) => `${ns}.${n}`);
    expect([...new Set(missing)]).toEqual([]);
  });

  it('the lab is the only file that imports the three engines, and it imports all three', () => {
    const lab = sourceOf(LAB_FILE);
    ['engines/downstream/crudeAssay.js', 'engines/downstream/productBlending.js', 'lib/lp/simplex.js']
      .forEach((f) => expect(lab).toContain(`@petrolord/engines/${f}`));
    ALL_SOURCES.filter((f) => f !== LAB_FILE).forEach((f) => expect(sourceOf(f), f).not.toMatch(/@petrolord\/engines/));
  });

  it('CONTROL ON THE PIN: a figure moved in its fourth decimal is not in the digest', () => {
    const good = row('specific gravity', fx(S.exportBlend.sg.value), 'volume');
    const bad = row('specific gravity', fx(S.exportBlend.sg.value + 0.0001), 'volume');
    expect(SECTIONS[12]).toContain(good);
    expect(SECTIONS[12]).not.toContain(bad);
  });

  it("the lab's fx prints as the digest prints", () => {
    [0, -0.00001, 1.23456, -7.55268, 698701.56049, 1e-9].forEach((v) => expect(L.fx(v)).toBe(fx(v)));
    expect(L.fx(null)).toBe('not formed');
  });
});

// ---------------------------------------------------------------------------
// AGREEMENT WITH THE DIGEST, section by section.
// ---------------------------------------------------------------------------

describe('AGREEMENT WITH THE DIGEST, the Associate sections', () => {
  it('SECTION 1, what the modules export', () => {
    pin(1, S.modules.map((m) => row(m.name, `${m.functions.length} (${m.functions.join(', ')})`, `${m.constants.length} (${m.constants.join(', ')})`)));
  });

  it('SECTION 2, gravity', () => {
    const g = S.gravity;
    pin(2, [
      row('A', 'apiFromSg(0.5) minus apiFromSg(1)', fx(g.A)),
      row('B', 'A minus apiFromSg(1)', fx(g.B)),
      ...g.rows.map((r) => row(inp(r.api), fx(r.sg), fx(r.roundTrip))),
      ...g.steps.map((r) => row(inp(r.sg), fx(r.api), r.step === null ? 'first row' : fx(r.step))),
      `Water (SG 1) is ${fx(g.water)} API by the definition.`,
    ]);
  });

  it('SECTION 3, the OBIGBO library', () => {
    const lib = S.library;
    const full = lib.filter((c) => c.sara);
    const p = (v) => (v === null ? 'not given' : inp(v));
    pin(3, [
      ...lib.map((c) => row(c.name, inp(c.api), fx(c.sg), p(c.properties.sulfurWtPct), p(c.properties.tanMgKohG), p(c.properties.nitrogenWtPct), p(c.properties.nickelPpm), p(c.properties.vanadiumPpm), p(c.properties.viscosityCSt))),
      ...full.map((c) => row(c.name, inp(c.sara.saturates), inp(c.sara.aromatics), inp(c.sara.resins), inp(c.sara.asphaltenes))),
      ...lib.map((c) => row(c.name, c.curve.map((q) => `${q.volumePercent} at ${q.temperatureF}`).join('; '))),
    ]);
    expect(lib.filter((c) => c.partial).map((c) => c.id)).toEqual(['ebp']);
  });

  it('SECTION 4, API through specific gravity', () => {
    pin(4, [
      ...S.apiBlends.map((r) => row(r.label, fx(r.sg), fx(r.api), fx(r.onVolume), fx(r.minusOnVolume), fx(r.onMass), fx(r.minusOnMass))),
      `The engine names its basis for API: "${S.exportBlend.api.basis}".`,
    ]);
  });

  it('SECTION 5, volume shares become mass shares', () => {
    const e = S.exportBlend;
    const { byVolume, byMass } = S.volumeAndMass;
    pin(5, [
      ...e.fractions.map((f, i) => row('Obigbo export blend', f.name, inp(e.shares[i]), fx(f.volumeFraction), fx(f.sg), fx(f.massFraction), fx(f.massMinusVolume))),
      ...byVolume.fractions.map((f, i) => row('three crudes, 50, 30 and 20 by volume', f.name, inp(byVolume.shares[i]), fx(f.volumeFraction), fx(f.sg), fx(f.massFraction), fx(f.massMinusVolume))),
      ...byMass.fractions.map((f, i) => row(f.name, inp(byMass.shares[i]), fx(f.volumeFraction), fx(f.massFraction))),
      `Blend API given by mass: ${fx(byMass.api.value)}. Blend API given by volume at 50, 30 and 20: ${fx(byVolume.api.value)}.`,
      row('by volume', fx(byVolume.sg.value), fx(byVolume.api.value), fx(byVolume.massProperties[0].value)),
      row('by mass', fx(byMass.sg.value), fx(byMass.api.value), fx(byMass.massProperties[0].value)),
    ]);
  });

  it('SECTION 6, the per-mass properties on mass, and on volume as the shortcut', () => {
    const lines = [];
    [['Obigbo export blend', S.exportBlend], ['three crudes, 50, 30 and 20 by volume', S.volumeAndMass.byVolume]].forEach(([label, b]) => {
      b.massProperties.forEach((m) => lines.push(row(label, m.label, fx(m.value), fx(m.onVolume), fx(m.massMinusVolume), m.basis)));
    });
    pin(6, lines);
  });

  it('SECTION 7, a blank is not a zero, and what the blend refuses', () => {
    const k = S.blanks;
    const sb = k.blankSulfur.massProperties[0];
    const z = k.zeroSulfur;
    const both = k.both;
    pin(7, [
      row('Obigbo export blend, both sulfurs given', fx(both.massProperties[0].value), 'nothing', both.massProperties[0].basis),
      row("Obigbo export blend, Egbema Medium's sulfur left blank", 'not blended', sb.missing.join(', '), sb.basis),
      row('Obigbo export blend, both sulfurs given', fx(both.sg.value), fx(both.api.value), fx(both.massProperties[0].value), fx(both.massProperties[1].value), fx(both.massProperties[4].value), fx(both.viscosity.value)),
      row("Egbema Medium's sulfur left blank", fx(k.blankSulfur.sg.value), fx(k.blankSulfur.api.value), 'not blended', fx(k.blankSulfur.massProperties[1].value), fx(k.blankSulfur.massProperties[4].value), fx(k.blankSulfur.viscosity.value)),
      row("Egbema Medium's sulfur typed as 0", fx(z.sg), fx(z.api), fx(z.sulfurWtPct), fx(z.tanMgKohG), fx(z.vanadiumPpm), fx(z.viscosityCSt)),
      `The typed 0 is blended on ${z.basis}, and nothing is named missing (${z.missingCount} properties listed).`,
      `With Egbema Medium's viscosity blank: viscosity not blended; basis "${k.blankViscosity.viscosity.basis}".`,
      ...k.refusals.map((r) => row(r.label, `REFUSED: ${r.reason}`)),
      ...k.normalised.map((r) => row(`${r.shares[0]} and ${r.shares[1]}`, fx(r.api), fx(r.sulfurWtPct))),
    ]);
    expect(sb.value).toBeNull();
    expect(k.blankViscosity.viscosity.value).toBeNull();
    expect(k.refusals.every((r) => r.ok === false && r.reason.length > 10)).toBe(true);
  });

  it('SECTION 8, viscosity through the Refutas index', () => {
    const r = S.refutas;
    pin(8, [
      ...r.crudes.map((c) => row(c.name, inp(c.viscosityCSt), fx(c.index), fx(c.back))),
      ...r.blends.map((b) => row(b.label, fx(b.value), fx(b.indexOnVolume), fx(b.massMinusVolume), fx(b.linearOnMass))),
      ...r.blends.map((b) => row(b.label, fx(b.value), fx(b.linearOnMass), fx(b.linearMinusEngine))),
      `The engine names its basis: "${S.exportBlend.viscosity.basis}".`,
      row('B', 'viscosityBlendIndex(e - 0.8)', fx(r.B)),
      row('A', 'viscosityBlendIndex(e^e - 0.8) minus B', fx(r.A)),
      row('the offset inside the double log', '1 minus viscosityFromBlendIndex of a very negative index', fx(r.offset)),
      row('the lowest viscosity the index reaches', 'viscosityFromBlendIndex of a very negative index', fx(r.floor)),
      ...r.domain.map((d) => row(inp(d.viscosityCSt), d.index === null ? 'no index (outside the domain)' : fx(d.index))),
      `With one crude's viscosity outside the domain (the Obigbo export blend with Egbema Medium's viscosity typed as ${inp(0.15)} cSt), the blend's viscosity is not blended; basis "${r.outsideBasis}". The other properties of that blend are formed as usual: API ${fx(r.outsideApi)}, sulfur ${fx(r.outsideSulfur)} wt%.`,
    ]);
    expect(r.outsideValue).toBeNull();
  });

  it('SECTION 9, the curve between and outside its points', () => {
    const c = S.curveProbes;
    pin(9, [
      ...c.temps.map((p) => row(p.name, inp(p.temperatureF), fxOr(p.volumePercent, 'unknown'))),
      ...c.volumes.map((p) => row(p.name, inp(p.volumePercent), fxOr(p.temperatureF, 'unknown'))),
    ]);
  });

  it('the curve plot carries the unknown region of a partial curve, and a full curve has none', () => {
    const byId = Object.fromEntries(S.curvePlots.map((p) => [p.id, p]));
    expect(byId.ebp.unknownBelowF).toBeGreaterThan(0);
    expect(byId.ebp.unknownAboveF).toBeLessThan(1600);
    expect(byId.ebp.sampled.some((p) => p.volumePercent === null)).toBe(true);
    expect(byId.obl.sampled.every((p) => p.volumePercent !== null)).toBe(true);
    expect(byId.obl.unknownBelowF).toBeNull();
    expect(byId.obl.unknownAboveF).toBeNull();
  });

  it('SECTION 10, cut yields of one crude', () => {
    const cs = S.cutSets;
    const eb = cs.crudes.find((c) => c.id === 'ebp');
    pin(10, [
      ...cs.cuts.map((c) => row(c.name, c.fromF === null ? 'no lower bound (from 0 percent)' : inp(c.fromF), c.toF === null ? 'no upper bound (to 100 percent)' : inp(c.toF))),
      ...cs.crudes.map((c) => row(c.name, ...c.cuts.map((r) => fxOr(r.yieldVolPercent, 'unknown')), fx(c.totalVolPercent), String(c.closes), orNothing(c.unknownCuts))),
      `The Ebocha partial assay starts at 4 percent and stops at 88, so ${eb.unknownCuts.length} of its ${eb.cuts.length} studio cuts have no yield, and its set does not close. Its known cuts total ${fx(eb.totalVolPercent)} percent.`,
      row(cs.inside.name, ...cs.inside.cuts.map((r) => fx(r.yieldVolPercent)), fx(cs.inside.totalVolPercent), String(cs.inside.closes), orNothing(cs.inside.unknownCuts)),
      `An inverted cut (from 500 F to 350 F) on Obigbo Light has no yield: the engine names it in unknownCuts (${cs.inverted.unknownCuts.join(', ')}).`,
    ]);
  });

  it('SECTION 11, the CII and the gravity screen', () => {
    const st = S.stability;
    pin(11, [
      ...st.alone.map((c) => row(c.name, fx(c.cii))),
      ...st.pairs.map((p) => row(`${p.label}, ${p.shares.join(' and ')}`, fx(p.blendedSara.saturates), fx(p.blendedSara.aromatics), fx(p.blendedSara.resins), fx(p.blendedSara.asphaltenes), fx(p.cii), p.band, p.verdict, fx(p.ciiOnVolume))),
      ...st.pairs.map((p) => row(`${p.label}, ${p.shares.join(' and ')}`, fx(p.cii), fx(p.ciiOnVolume), fx(p.volumeMinusEngine))),
      ...st.pairs.map((p) => row(p.label, p.message)),
      ...st.probes.map((p) => row(p.what, inp(p.lighter), inp(p.heavier), fx(p.contrast), p.verdict)),
      row('API contrast, lighter crude at 45 API', fx(st.thresholds.contrast)),
      row('lighter crude API, contrast held at 25', fx(st.thresholds.lighter)),
      ...st.noSara.map((p) => row(p.label, p.basis, p.contrast === null ? 'not formed' : fx(p.contrast), p.verdict, p.message)),
      row('Obigbo export blend, SARA on Obigbo Light only', st.partialSara.basis, st.partialSara.verdict, st.partialSara.message),
    ]);
    // NO VERDICT IS ITS OWN STATE: the uncertain band and the silent gravity
    // screen both come back null, and the lab never turns null into true.
    expect(st.pairs.map((p) => p.stable)).toEqual([false, null, true]);
    expect(st.noSara.map((p) => p.stable)).toEqual([false, null, null]);
    expect(st.bands).toEqual({ STABLE: 0.7, UNSTABLE: 0.9 });
  });

  it('SECTION 12, the export blend end to end, every property beside its basis', () => {
    const e = S.exportBlend;
    pin(12, [
      row('specific gravity', fx(e.sg.value), e.sg.basis),
      row('API', fx(e.api.value), e.api.basis),
      ...e.massProperties.map((m) => row(m.label, fx(m.value), m.basis)),
      row('viscosity cSt', fx(e.viscosity.value), e.viscosity.basis),
      row('CII', fx(e.stability.cii), `${e.stability.basis}, band ${e.stability.band}, stable ${e.stability.verdict}`),
      ...e.yields.cuts.map((r) => row(r.name, fx(r.yieldVolPercent))),
      row('total', fx(e.yields.totalVolPercent)),
      `Closes: ${e.yields.closes}. Cuts with no yield: ${orNothing(e.yields.unknownCuts)}.`,
    ]);
  });

  it('THE BASIS RULE: every wrong-basis reading differs from the engine where the digest says so', () => {
    const e = S.exportBlend;
    expect(Math.abs(e.api.value - e.api.onVolume)).toBeGreaterThan(1e-3);
    expect(Math.abs(e.api.value - e.api.onMass)).toBeLessThan(1e-9);
    e.massProperties.forEach((m) => expect(Math.abs(m.value - m.onVolume), m.key).toBeGreaterThan(1e-4));
    expect(Math.abs(e.viscosity.value - e.viscosity.indexOnVolume)).toBeGreaterThan(1e-3);
    // Every property is handed over with the basis the engine named, never without one.
    [e.sg, e.api, ...e.massProperties, e.viscosity].forEach((p) => expect(typeof p.basis === 'string' && p.basis.length > 3).toBe(true));
  });
});

describe('AGREEMENT WITH THE DIGEST, the Professional sections', () => {
  it('SECTION 13, the blend\'s own curve', () => {
    const k = S.kwale;
    const p = S.kwalePartial;
    pin(13, [
      ...k.crudes.map((c) => row(c.name, inp(c.api), fx(c.sg), inp(c.sulfurWtPct), c.curve.map((q) => `${q.volumePercent} at ${q.temperatureF}`).join('; '))),
      `Blend API ${fx(k.api)}, SG ${fx(k.sg)}, sulfur ${fx(k.sulfurWtPct)} wt% (mass basis).`,
      ...k.table.map((r) => row(inp(r.temperatureF), fx(r.light), fx(r.medium), fx(r.blend))),
      `The blend's curve has ${k.curve.length} points: every temperature either crude measured.`,
      ...p.curve.map((q) => row(inp(q.temperatureF), fx(q.volumePercent))),
      `Of ${p.measured} temperatures the two crudes measured between them, the blend's curve keeps ${p.curve.length}.`,
    ]);
    expect(k.measuredTemperatures).toBe(k.curve.length);
    expect(p.dropped.length).toBe(p.measured - p.curve.length);
    expect(p.dropped.every((t) => t < 110 || t > 920)).toBe(true);
    expect(k.sulfurBasis).toBe('mass');
  });

  it('the share slider moves the blend: at 70 the curve and T50 differ from 55', () => {
    expect(S.kwaleAt70.shareLight).toBe(70);
    expect(S.kwaleAt70.t50.t50).toBeLessThan(S.kwale.t50.t50);
    expect(S.kwaleAt70.api).toBeGreaterThan(S.kwale.api);
  });

  it('SECTION 14, T50 and the Watson factor', () => {
    const k = S.kwale.t50;
    const s = S.studioPair.t50;
    const w = S.watson;
    pin(14, [
      row('Kwale Light and Ughelli Medium, 55 and 45', fx(k.t50), inp(k.grid), fx(k.volumeMean), fx(k.massMean)),
      row("the studio's default pair, 60 and 40 (what the app opens on)", fx(s.t50), inp(s.grid), fx(s.volumeMean), fx(s.massMean)),
      row('Kwale Light and Ughelli Medium, 55 and 45', fx(k.gridMinusEngine), fx(k.volumeMeanMinusEngine), fx(k.massMeanMinusEngine)),
      row("the studio's default pair, 60 and 40", fx(s.gridMinusEngine), fx(s.volumeMeanMinusEngine), fx(s.massMeanMinusEngine)),
      ...S.kwale.points.map((q) => row(inp(q.volumePercent), fx(q.temperatureF))),
      row('Kwale blend', fx(k.sg), fx(k.watsonK), fx(k.watsonKAtGrid)),
      row("the studio's default pair", fx(s.sg), fx(s.watsonK), fx(s.watsonKAtGrid)),
      `watsonK declines a non-physical input: at -500 F it returns ${w.atMinus500 === null ? 'no value' : 'a value'}, and at SG 0 it returns ${w.atSgZero === null ? 'no value' : 'a value'}.`,
    ]);
    pinIn(14, [`watsonK at 0 F and SG 1, cubed, is ${fx(w.rankineOffset)}.`]);
  });

  it('SECTION 15, cut yields of the blend, and one cut point moved', () => {
    const k = S.kwaleCuts;
    const d = S.kwaleCutsDeeper;
    const p = S.kwalePartial;
    pin(15, [
      ...L.KWALE_CUTS.map((c) => row(c.name, c.fromF === null ? 'no lower bound (from 0 percent)' : inp(c.fromF), c.toF === null ? 'no upper bound (to 100 percent)' : inp(c.toF))),
      ...k.rows.map((r) => row(r.name, fx(r.light), fx(r.medium), fx(r.yieldVolPercent), fx(r.onVolume), fx(r.blendMinusOnVolume), fx(r.onMass))),
      row('total', fx(k.lightTotal), fx(k.mediumTotal), fx(k.total), 'not formed', 'not formed', 'not formed'),
      `Closes: ${k.closes}.`,
      ...d.rows.map((r) => row(r.name, fx(r.base), fx(r.yieldVolPercent), fx(r.change))),
      row('total', fx(k.total), fx(d.total), fx(d.totalChange)),
      ...k.studioCuts.cuts.map((r) => row(r.name, fx(r.yieldVolPercent))),
      ...p.yields.cuts.map((r) => row(r.name, fxOr(r.yieldVolPercent, 'unknown'))),
      `unknownCuts: ${p.yields.unknownCuts.join(', ')}. Closes: ${p.yields.closes}. The cuts with a yield total ${fx(p.yields.totalVolPercent)} percent.`,
    ]);
    pinIn(15, [`(unyieldedCuts: ${p.unyieldedCuts.join(', ')})`, `complete: ${p.complete}. Its netback over the cuts it can value is ${fx(p.netback)} $/bbl.`]);
    // Moving one cut point moves barrels between two cuts and nowhere else.
    expect(d.rows.filter((r) => Math.abs(r.change) > 1e-9).map((r) => r.id)).toEqual(['diesel', 'residue']);
  });

  it('SECTION 16, the netback, every term', () => {
    const n = S.netback;
    const b = S.netbackBlank;
    const u = S.netbackUnpriced;
    pin(16, [
      ...n.rows.map((r) => row(r.name, fx(r.yieldVolPercent), inp(r.pricePerBbl), fx(r.valuePerBblCrude))),
      row('gross product value', fx(n.grossValue)),
      row(`value lost to losses at ${inp(n.lossPercent)} percent`, fx(n.lossValue)),
      row('processing cost', fx(n.processingCostPerBbl)),
      row('freight', fx(n.freightPerBbl)),
      row('netback', fx(n.netback)),
      `Complete: ${n.complete}. Costs taken as zero because they were blank: ${orNothing(n.assumedZero)}.`,
      row('losses on the product side, before the costs (the engine)', fx(n.netback), fx(0)),
      row('losses taken off the netback after the costs', fx(n.lossesAfterCosts), fx(n.lossesAfterCostsMinusEngine)),
      row('losses left out', fx(n.lossesLeftOut), fx(n.lossesLeftOutMinusEngine)),
      row('Kwale, freight and losses left blank', fx(b.netback), b.assumedZero.join(', ')),
      row('Kwale with the residue price left blank', fx(u.grossValue), fx(u.netback), u.unpricedCuts.join(', '), String(u.complete)),
    ]);
    pinIn(16, [`Complete: ${b.complete}. A blank cost is named`]);
  });

  it('the waterfall steps are the engine\'s terms in the engine\'s order, and land on the netback', () => {
    const w = S.netback.waterfall;
    expect(w.map((s) => s.step)).toEqual([
      'gross product value', 'lost to losses, on the product side', 'processing', 'freight', 'netback', 'marker netback', 'differential against the marker',
    ]);
    expect(w[3].to).toBeCloseTo(S.netback.netback, 9);
    expect(w[4].to).toBe(S.netback.netback);
    expect(w[6].value).toBe(S.netback.marker.differential);
    for (let i = 1; i < 4; i += 1) expect(w[i].from).toBe(w[i - 1].to);
  });

  it('SECTION 17, against the marker', () => {
    const m = S.marker;
    pin(17, [
      ...m.rows.map((r) => row(r.label, fx(r.grossValue), fx(r.netback), fx(r.differential))),
      `The volume-weighted mean of the two crudes' own netbacks is ${fx(m.volumeMean)} $/bbl; the blend's netback minus that mean is ${fx(m.blendMinusMean)}. Yields add on volume and every other term is per barrel, so the blend is worth what its barrels are worth.`,
      ...m.refusals.map((r) => row(r.label, `REFUSED: ${r.reason}`)),
      ...m.d86.map((r) => row(r.label, `REFUSED: ${r.reason}`)),
    ]);
    pinIn(17, [`Kwale's marker is ${inp(m.marker)} $/bbl.`]);
  });

  it('SECTION 18, the Kwale valuation and the studio defaults', () => {
    const k = S.kwale;
    const n = S.netback;
    const s = S.studioPair;
    pin(18, [
      row('blend API', fx(k.api)),
      row('blend T50 F (interpolated)', fx(k.t50.t50)),
      row('Watson K at T50 (screening)', fx(k.t50.watsonK)),
      ...S.kwaleCuts.rows.map((r) => row(`${r.name} yield volume percent`, fx(r.yieldVolPercent))),
      row('gross product value $/bbl', fx(n.grossValue)),
      row('loss value $/bbl', fx(n.lossValue)),
      row('netback $/bbl', fx(n.netback)),
      row('differential against the marker $/bbl', fx(n.marker.differential)),
      row('blend API', fx(s.api)),
      row(`blend sulfur wt% (basis: ${s.sulfurBasis})`, fx(s.sulfurWtPct)),
      row('blend T50 F (interpolated)', fx(s.t50.t50)),
      row('Watson K at T50 (screening)', fx(s.t50.watsonK)),
      ...s.yields.cuts.map((r) => row(`${r.name} yield volume percent`, fx(r.yieldVolPercent))),
      row('gross product value $/bbl', fx(s.grossValue)),
      row('netback $/bbl', fx(s.netback)),
      row('stability screen basis', s.stabilityBasis),
    ]);
  });
});

describe('AGREEMENT WITH THE DIGEST, the Expert sections', () => {
  it('SECTION 19, the textbook LP, its vertices found by the kernel', () => {
    const t = S.textbook;
    const c = S.lpCases;
    pin(19, [
      row(t.status, fx(t.x[0]), fx(t.x[1]), fx(t.objective), fx(t.shadowPrices[0]), fx(t.shadowPrices[1]), String(t.iterations)),
      ...t.raised.map((r) => row(`row ${r.row}, rhs ${r.rhs}`, fx(r.objective), fx(r.change))),
      ...c.fixed.map((p) => row(`x ${fx(p.x)}, y ${fx(p.y)}`, fx(p.objective), p.status)),
      ...c.statuses.slice(0, 3).map((s) => row(s.problem, s.status)),
      row(c.statuses[3].problem, `${c.statuses[3].status}, objective ${fx(c.statuses[3].objective)}`),
      `A malformed problem is not an answer: the kernel throws ("${c.malformed}").`,
      `iterations counts the pivots the kernel made, phase one and phase two together: the textbook case took ${t.iterations}.`,
    ]);
    // The vertices the direction sweep finds are exactly the four the digest checks.
    const key = (p) => `${fx(p.x)},${fx(p.y)}`;
    expect(t.vertices.map(key).sort()).toEqual(c.fixed.map(key).sort());
    t.vertices.forEach((v) => expect(v.status).toBe('optimal'));
    // The optimum sits on a vertex.
    expect(t.vertices.some((v) => Math.abs(v.x - t.x[0]) < 1e-9 && Math.abs(v.y - t.x[1]) < 1e-9)).toBe(true);
  });

  it('dragging a right-hand side: the change in the optimum is the row price times the step while the vertex holds', () => {
    const d = S.textbookDrag;
    expect(d.row).toBe(1);
    expect(d.step).toBe(4);
    expect(d.change).toBeCloseTo(d.priceTimesStep, 6);
    const far = L.textbookDrag(0, 60);
    expect(far.change).toBeLessThan(far.priceTimesStep);
  });

  it('SECTION 20, blending rules as rows', () => {
    const b = S.blendingRules;
    pin(20, [
      ...L.ROW_BASES.map((r) => row(...r)),
      ...b.rvp.map((r) => row(inp(r.rvp), fx(r.index), fx(r.back))),
      ...b.templates.flatMap((t) => t.specs.map((s) => row(t.name, s.name, s.basis, s.min === null ? 'no minimum' : inp(s.min), s.max === null ? 'no maximum' : inp(s.max), s.unit || 'no unit'))),
      ...S.propertyCheck.map((r) => row(r.name, fx(r.achieved), fx(r.again), fx(r.difference))),
    ]);
    pinIn(20, [`RVP_INDEX_EXPONENT is ${inp(b.exponent)}: an exported constant that is the default exponent of rvpIndex and rvpFromIndex`, `BINDING_TOLERANCE (${inp(b.tolerance)})`]);
  });

  it('SECTION 21, the Apapa PMS recipe', () => {
    const r = S.pms;
    pin(21, [
      ...L.APAPA_PMS_POOL.map((c) => row(c.name, inp(c.cost), inp(c.sg), inp(c.ron), inp(c.mon), inp(c.sulfurPpm), inp(c.rvp), inp(c.maxVolume))),
      ...r.recipe.map((x) => row(x.name, fx(x.volume), fx(x.volumeFraction), fx(x.cost))),
      row('total', fx(r.totalVolume), fx(1), fx(r.totalCost)),
      `Unit cost ${fx(r.unitCost)} $/bbl. Status ${r.status}.`,
      ...r.achieved.map((a) => row(a.name, a.min === null ? 'no minimum' : inp(a.min), a.max === null ? 'no maximum' : inp(a.max), fx(a.value), fx(a.giveaway), String(a.binding), a.basis)),
      `Components at their availability: ${orNothing(r.atAvailability)}.`,
    ]);
    pinIn(21, [`Binding: ${r.bindingSpecs.join(' and ')}.`]);
  });

  it('SECTION 22, giveaway and its price', () => {
    const g = S.giveaway;
    pin(22, [
      ...g.rows.map((x) => row(x.name, fx(x.giveaway), x.unitValue === null ? 'not given' : inp(x.unitValue), x.value === null ? 'not priced' : fx(x.value))),
      `Specifications with no giveaway (binding) are not listed: ${g.notListed.join(', ')}.`,
    ]);
  });

  it('SECTION 23, shadow prices as the value of relief, with rowPrice beside and never in its place', () => {
    const r = S.relief;
    pin(23, [
      ...r.rows.map((s) => row(s.name, fx(s.price), s.per, fx(s.rowPrice))),
      `The sulfur row's scale: sum(SG x volume) over the recipe is ${fx(r.sulfurScale)}. rowPrice x that sum is ${fx(r.sulfurRowTimesScale)}; the reported value of relief is ${fx(r.sulfurPrice)} $ per ppm (relief on a maximum is the negative of dCost/dL).`,
      `The RVP row is in index units. rowPrice x ${fx(S.pms.totalVolume)} bbl is ${fx(r.rvpPerIndex)} $ per index point. The reported value of relief is ${fx(r.rvpPrice)} $ per psi; divided by the negative of the per-index figure, that is ${fx(r.rvpIndexSlope)} index points per psi, the slope of the index at the ${inp(r.rvpLimit)} psi limit. The same slope from the exported exponent, RVP_INDEX_EXPONENT x ${inp(r.rvpLimit)}^(RVP_INDEX_EXPONENT - 1), is ${fx(r.rvpSlopeFromExponent)}.`,
      ...r.resolves.map((x) => row(`${x.name.replace(' maximum', '')} limit ${inp(x.newLimit)}`, fx(x.totalCost), fx(x.saving), fx(x.price))),
      row('volume row price (the marginal barrel)', fx(r.marginal.volumeRowPrice)),
      row('unit cost (the average barrel)', fx(r.marginal.unitCost)),
      row('marginal minus average', fx(r.marginal.marginalMinusAverage)),
      row(`re-solved at ${inp(r.marginal.resolvedTarget)} bbl, cost minus the optimum`, fx(r.marginal.resolvedStep)),
      `Non-binding at Apapa: ${r.nonBinding.join(', ')}.`,
    ]);
    // The value of relief is never the row price on a binding specification row.
    r.rows.filter((s) => s.kind === 'spec' && Math.abs(s.price) > 1e-9).forEach((s) => {
      expect(Math.abs(s.price - s.rowPrice), s.name).toBeGreaterThan(1);
    });
    // The whole unit of relief and the derivative part.
    r.resolves.forEach((x) => expect(Math.abs(x.saving - x.predicted), x.name).toBeGreaterThan(1e-3));
  });

  it('SECTION 24, the AGO pool, the index on mass', () => {
    const a = S.ago;
    const v = S.agoOnVolume;
    pin(24, [
      ...L.APAPA_AGO_POOL.map((c) => row(c.name, inp(c.cost), inp(c.sg), inp(c.cetane), inp(c.sulfurPpm), inp(c.viscosityCSt), inp(c.flashPointC), inp(c.maxVolume))),
      ...a.recipe.map((x) => row(x.name, fx(x.volume), fx(x.cost))),
      row('total', fx(a.totalVolume), fx(a.totalCost)),
      `Unit cost ${fx(a.unitCost)} $/bbl.`,
      ...a.bySpec.map((s) => row(s.name, fx(s.value), fx(s.giveaway), String(s.binding), fx(s.price), s.per)),
      `The recipe's viscosity with the index on mass (the engine): ${fx(a.viscosityIndexOnMass)} cSt. With the same index on volume instead: ${fx(a.viscosityIndexOnVolume)} cSt.`,
      `The rows behind the AGO prices. Cetane and density blend on volume, so each row's scale sum(d_i v_i) is the recipe's ${fx(a.totalVolume)} bbl; the mass rows (sulfur, viscosity) scale by sum(SG x volume), ${fx(a.massScale)}.`,
      ...a.volumeRows.map((s) => row(s.name, fx(s.rowPrice), fx(s.scale), fx(s.rowTimesScale), fx(s.price), s.per)),
      ...a.recipe.map((x, i) => row(x.name, fx(x.volume), fx(v.recipe[i].volume))),
      row('total cost $', fx(a.totalCost), fx(v.totalCost)),
      `Binding with the index on volume: ${v.bindingSpecs.join(' and ')}.`,
    ]);
  });

  it('SECTION 25, infeasible, refused and skipped', () => {
    const r = S.refused;
    const f = r.floor;
    pin(25, [
      ...r.infeasible.map((x) => row(x.label, x.status, `REFUSED: ${x.reason}`)),
      ...r.movedBack.map((m) => row(`${m.name} ${m.key === 'min' ? 'minimum' : 'maximum'}`, inp(m.t10), inp(m.t50), m.status)),
      ...r.tightened.map((m) => row(`${m.name} ${m.key === 'min' ? 'minimum' : 'maximum'}`, inp(m.t50), inp(m.t10), m.status)),
      ...r.availability.map((x) => row(x.label, x.status, fx(x.butane), fx(x.totalCost), x.binding.join(', '))),
      ...r.refusals.map((x) => row(x.label, `REFUSED: ${x.reason}`)),
      ...r.skipped.map((x) => row(x.label, x.status, fx(x.totalCost), x.skipped, x.reason)),
      ...r.skipped.map((x) => row(x.label, 'not formed (the engine returns no value)', String(x.densityApplied), fx(x.density))),
      row('Isomerate at least 1200 bbl', f.status, fx(f.isomerate), fx(f.totalCost), f.binding.join(', '), fx(f.sulfurRelief)),
      `At that optimum butane is ${fx(f.butane)} bbl against its availability of ${inp(f.butaneCap)}: ${f.butaneAtCap ? 'at its availability' : 'inside its availability'}.`,
    ]);
    r.skipped.forEach((x) => expect(x.skippedAchieved).toBeNull());
    r.infeasible.forEach((x) => expect(x.ok).toBe(false));
  });

  it('SECTION 26, the optimizer\'s default pool', () => {
    const d = S.optimizerDefault;
    pin(26, [
      ...d.recipe.map((x) => row(x.name, fx(x.volume))),
      `Total cost ${fx(d.totalCost)} $, unit cost ${fx(d.unitCost)} $/bbl, binding ${d.bindingSpecs.join(' and ')}.`,
      ...d.shadowPrices.map((s) => row(s.name, fx(s.price), s.per, fx(s.rowPrice))),
    ]);
    pinIn(26, [`Components at their availability: ${orNothing(d.atAvailability)}. At zero: ${orNothing(d.atZero)}. Marginal barrel minus unit cost: ${fx(d.marginalMinusAverage)} $/bbl.`]);
  });

  it('SECTION 27, the constants and the held items', () => {
    const k = S.constants;
    pin(27, [
      row('CII_BANDS.STABLE', inp(k.ciiStable)),
      row('CII_BANDS.UNSTABLE', inp(k.ciiUnstable)),
      row('RVP_INDEX_EXPONENT, the default exponent of rvpIndex and rvpFromIndex', inp(k.rvpExponent)),
      row('BINDING_TOLERANCE', inp(k.bindingTolerance)),
      row('viscosityBlendIndex(1), the Refutas index of 1 cSt', fx(k.refutasOfOne)),
      row('sgFromApi(10), water', fx(k.water)),
      row(...L.HELD[0]),
      row(...L.HELD[2]),
    ]);
    pinIn(27, [
      `reads ${fx(S.exportBlend.viscosity.value)} cSt on mass and ${fx(S.exportBlend.viscosity.indexOnVolume)} cSt on volume`,
      L.HELD[1][1],
    ]);
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE and THE ZONE GATE.
// ---------------------------------------------------------------------------

const CLOCK = /new Date\(|Date\.now|performance\.now|Math\.random|getTimezoneOffset|Intl\.DateTimeFormat/;

describe('THE CLOCK GATE: nothing reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('none of the three vendored engine files reads a clock or a random number', () => {
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

const ZONE = 'Pacific/Pago_Pago';
const CHILD_ZONE = process.env.CRUDE_TZ_CHILD;
const SIDECAR = process.env.CRUDE_TZ_SIDECAR;

describe('THE ZONE GATE: the lab reproduces byte for byte west of Greenwich', () => {
  it(`the whole snapshot under TZ=${ZONE} is byte-identical`, () => {
    if (CHILD_ZONE) {
      expect(CHILD_ZONE).toBe(ZONE);
      const offsetMinutes = -new Date('2026-09-19T12:00:00Z').getTimezoneOffset();
      fs.writeFileSync(SIDECAR, JSON.stringify({
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offsetMinutes,
        snapshot: JSON.stringify(L.teachingSurface()),
      }));
      return;
    }
    const sidecar = path.join(ROOT, 'node_modules', '.crude-tz-sidecar.json');
    if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
    execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), [
      'run', '--reporter=dot', '--config', 'vitest.config.js',
      'src/components/course/panels/crude/crudeLab.test.js',
      '-t', `under TZ=${ZONE} is byte-identical`,
    ], {
      cwd: ROOT,
      env: { ...process.env, TZ: ZONE, CRUDE_TZ_CHILD: ZONE, CRUDE_TZ_SIDECAR: sidecar },
      stdio: 'pipe',
      timeout: 600000,
    });
    expect(fs.existsSync(sidecar), 'the child wrote no snapshot').toBe(true);
    const child = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
    fs.unlinkSync(sidecar);
    // CONTROL: the child really ran eleven hours west of Greenwich.
    expect(child.timeZone).toBe(ZONE);
    expect(child.offsetMinutes).toBe(-660);
    expect(child.snapshot.length).toBeGreaterThan(50000);
    expect(child.snapshot).toBe(JSON.stringify(L.teachingSurface()));
  }, 600000);
});

// ---------------------------------------------------------------------------
// THE ANSWER SWEEP: nothing the lab hands a panel sits near a graded answer.
// ---------------------------------------------------------------------------

const walk = (v, p, visit) => {
  visit(v, p);
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${p}[${i}]`, visit));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${p}.${k}`, visit));
};
const nearGraded = (surface) => {
  const hits = [];
  walk(surface, 'S', (v, p) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) return;
    FIELDS.forEach(([, key, value, tol]) => {
      if (Math.abs(Math.abs(v) - Math.abs(value)) <= 10 * tol) hits.push(`${p} = ${v} sits on ${key}`);
    });
  });
  return hits;
};

describe('THE ANSWER SWEEP: no number in the snapshot is a graded capstone answer', () => {
  it('eighteen graded answers are read', () => {
    expect(FIELDS).toHaveLength(18);
  });

  it('the snapshot carries none of them, to within ten grading tolerances', () => {
    let count = 0;
    walk(S, 'S', (v) => { if (typeof v === 'number') count += 1; });
    expect(count, 'the snapshot carries almost no numbers, so this sweep is vacuous').toBeGreaterThan(2000);
    expect(nearGraded(S)).toEqual([]);
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
  ['AssayExplorer', AE, AssayExplorer, ['LibraryMode', 'BlendMode', 'CurveMode', 'StabilityMode']],
  ['ValuationExplorer', VE, ValuationExplorer, ['BlendCurveMode', 'T50Mode', 'CutsMode', 'NetbackMode']],
  ['RecipeExplorer', RE, RecipeExplorer, ['LpMode', 'PmsMode', 'ReliefMode', 'AgoMode', 'RefusedMode']],
];

const noop = () => {};
const REAL_PROPS = {
  LibraryMode: () => ({ lib: L.library(), gravity: L.gravity(), refutas: L.refutas() }),
  BlendMode: () => ({
    blend: L.exportBlend(), refusals: L.blanksAndRefusals().refusals,
    picks: ['obl', 'egm', ''], shares: [65, 35, 0], blank: { id: '', key: 'sulfurWtPct' }, onPick: noop, onShare: noop, onBlank: noop,
  }),
  CurveMode: () => ({ plot: L.curvePlot('ebp'), cuts: L.cutsOf('ebp'), pick: 'ebp', onPick: noop }),
  StabilityMode: () => ({ st: L.blendOf(['obl', 'egm'], [65, 35]).stability, screen: L.stability(), pair: 0, onPair: noop, dropSara: false, onDropSara: noop }),
  BlendCurveMode: () => ({ kw: L.kwaleBlend(), partial: L.kwalePartial(), share: 55, onShare: noop }),
  T50Mode: () => ({ kw: L.kwaleBlend(), studio: L.studioPair() }),
  CutsMode: () => ({ cuts: L.kwaleCuts(), points: L.KWALE_CUT_POINTS, onPoint: noop, onReset: noop }),
  NetbackMode: () => ({ nb: L.netback(), marker: L.marker(), flags: {}, onFlag: noop }),
  LpMode: () => ({ drag: L.textbookDrag(0, 24), cases: L.lpCases(), row: 0, rhs: 24, onRow: noop, onRhs: noop }),
  PmsMode: () => ({ pms: L.pmsRecipe(), giveaway: L.giveaway(), rules: L.blendingRules() }),
  ReliefMode: () => ({ pms: L.pmsRecipe(), rel: L.relief(), drag: L.reliefResolve('sulfurPpm', 'max', 52), sweep: L.reliefSweep('sulfurPpm', 'max'), pick: 'sulfurPpm.max', limit: 52, onPick: noop, onLimit: noop }),
  AgoMode: () => ({ ago: L.agoRecipe(), agoVol: L.agoRecipe({ indexOnMass: false }) }),
  RefusedMode: () => ({ refd: L.refusedAndSkipped(), recipe: L.pmsRecipe({ butaneMax: 0 }), butane: '0', onButane: noop, blank: '', onBlank: noop }),
};

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
        const html1 = renderToStaticMarkup(React.createElement(Comp, {}));
        const real = REAL_PROPS[k]();
        const props = Object.fromEntries(Object.keys(real).map((p) => [p, typeof real[p] === 'function' ? noop : err]));
        const html2 = renderToStaticMarkup(React.createElement(Comp, props));
        expect(html1.length).toBeGreaterThan(20);
        expect(html2.length).toBeGreaterThan(20);
      });

      it(`${name}.${k} renders on real data, and with each data prop error-shaped in turn`, () => {
        const real = REAL_PROPS[k]();
        const full = renderToStaticMarkup(React.createElement(ns[k], real));
        expect(full.length).toBeGreaterThan(400);
        expect(full).not.toContain('has returned nothing');
        const dataProps = Object.keys(real).filter((p) => real[p] && typeof real[p] === 'object' && !Array.isArray(real[p]) && !['blank', 'flags'].includes(p));
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

  it('the assay blend shows every property beside the basis the engine names, and the reading it does not use', () => {
    const html = renderToStaticMarkup(React.createElement(AssayExplorer, { initialMode: 'blend' }));
    const e = L.exportBlend();
    [e.api.basis, e.viscosity.basis, 'mass', 'volume'].forEach((b) => expect(html).toContain(b));
    [e.api.value, e.api.onVolume, e.massProperties[0].value, e.massProperties[0].onVolume, e.viscosity.value, e.viscosity.indexOnVolume]
      .forEach((v) => expect(html).toContain(fx(v)));
  });

  it('the stability view shows no verdict as its own state, never as a tick', () => {
    const html = renderToStaticMarkup(React.createElement(AE.StabilityMode, REAL_PROPS.StabilityMode()));
    expect(html).toContain('Screens unstable');
    expect(html).not.toContain('No verdict');
    const quiet = L.blendOf(['obl', 'egm'], [65, 35], { dropSara: true }).stability;
    expect(quiet.stable).toBeNull();
    const html2 = renderToStaticMarkup(React.createElement(AE.StabilityMode, { ...REAL_PROPS.StabilityMode(), st: quiet, dropSara: true }));
    expect(html2).toContain('No verdict');
    expect(html2).not.toContain('Stable: true');
  });

  it('the recipe relief view prints the value of relief with rowPrice beside it', () => {
    const html = renderToStaticMarkup(React.createElement(RE.ReliefMode, REAL_PROPS.ReliefMode()));
    const r = L.relief();
    const sulfur = r.rows.find((s) => s.name === 'Sulfur maximum');
    expect(html).toContain(fx(sulfur.price));
    expect(html).toContain(fx(sulfur.rowPrice));
    expect(html).toContain('rowPrice');
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
  walk(surface, 'S', (v, p) => { if (typeof v === 'string') out.push([p, v]); });
  return out;
};

describe("THE REFUSAL LITERAL GATE: every refusal a panel shows is the engine's own", () => {
  it('no engine refusal sentence is typed into the lab, a panel or the page', () => {
    const reasons = reasonsIn(S);
    expect(reasons.length, 'the lab returns almost no refusals, so this sweep is vacuous').toBeGreaterThanOrEqual(12);
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

  it('every string the lab hands a panel obeys it', () => {
    const strings = stringsIn(S);
    expect(strings.length).toBeGreaterThanOrEqual(500);
    expect(strings.filter(([, s]) => breaches(s)).map(([p, s]) => `${p}: ${s}`)).toEqual([]);
  });
});
