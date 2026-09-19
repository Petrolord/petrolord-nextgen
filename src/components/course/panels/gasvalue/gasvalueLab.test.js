// Every value the gasvalue teaching lab exposes to a panel or to the course page
// is pinned here against the teaching digest
// (tools/course-waves/gasvalue/digest.txt), which is itself nothing but the
// vendored flareToValue and lpgCng engines' return values on the EGBEMA, KANO
// and IBAFO records.
//
// THE GATES, and each one carries a control that is made to fire:
//
//   AGREEMENT WITH THE DIGEST  every reader's return is rebuilt into the digest's
//                      own lines, row by row and sentence by sentence, at the
//                      digest's own printing precision, and each line must appear
//                      in the section that printed it. The control moves one
//                      tonne a year by a kilogram and requires the rebuilt line
//                      to vanish.
//   THE WAVE INPUTS    read through tools/course-waves/waveInputs.mjs, which
//                      throws and names the file when one is missing. The teaching
//                      records in the lab are compared with gasvalue_fields.mjs
//                      byte for byte and value for value, the inline probes with
//                      the dump's own text, and the digest and graded answers with
//                      the sha256 pins in waves.json.
//   MISSING STAYS MISSING  a blank box goes to the engine as missing: the flare
//                      efficiencies, the GWP, a density, a heating value, the fill
//                      limit and its basis, the boiling point, the lead time, the
//                      efficiency ratio, a recovery and a cost box, each left
//                      blank, come back as the engine's refusal, floor or named
//                      gap, never as a default.
//   THE CLOCK GATE     the whole snapshot is identical under two faked system
//                      dates, and no source reads a clock or a random number, and
//                      the lab never names modularRefinery.feasibilityEconomics.
//   THE ZONE GATE      the whole snapshot is rebuilt in child processes under
//                      TZ=Pacific/Pago_Pago and TZ=Pacific/Kiritimati, twenty five
//                      hours apart, and must be byte identical.
//   THE RENDER GATE    every mode of every panel renders with nothing, with an
//                      error-shaped object, with each data prop error-shaped in
//                      turn, and whole on real data.
//   THE REFUSAL LITERAL GATE  no engine sentence is typed into a source.
//   THE COPY RULE      no em dash, no en dash, no double hyphen and no "X, not Y"
//                      in any source line or any string the lab hands a panel. An
//                      engine sentence carrying the shape is exempt ONLY while the
//                      vendored engine source still carries that sentence, read at
//                      run time, so an engines copy sweep that rewords it needs no
//                      edit here and a sentence the lab wrote is never exempt.
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
import * as L from './gasvalueLab.js';
import {
  waveDir, waveInput, mirrorDir, liveWaveDir, WAVES,
} from '../../../../../tools/course-waves/waveInputs.mjs';
import * as WAVE_FIELDS from '../../../../../tools/course-waves/gasvalue/gasvalue_fields.mjs';
import FlareExplorer, * as FE from './FlareExplorer.jsx';
import RouteExplorer, * as RE from './RouteExplorer.jsx';
import RolloutExplorer, * as XE from './RolloutExplorer.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

const WAVE_NAME = 'gasvalue';
const WAVE = waveDir(WAVE_NAME);
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE_WAVE = liveWaveDir(WAVE_NAME);
const DIGEST = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');
const FIELDS_JSON = fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8');
const FIELDS_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'gasvalue_fields.mjs'), 'utf8');
const DUMP_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'gasvalue_dump.mjs'), 'utf8');
const ENGINE_DIR = path.join(ROOT, 'packages/engines/engines/downstream');
const ENGINE_SRC = ['flareToValue', 'lpgCng'].map((m) => fs.readFileSync(path.join(ENGINE_DIR, `${m}.js`), 'utf8')).join('\n');

const LAB_FILE = 'gasvalueLab.js';
const PANEL_FILES = ['FlareExplorer.jsx', 'RouteExplorer.jsx', 'RolloutExplorer.jsx'];
const SHARED_FILES = ['panelBits.jsx'];
const PAGE_FILE = 'GasvalueLearningPage.jsx';
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

const { f4, t3, d2 } = L.fmt;
/** An input as the dump's inp() prints it. */
const inp = (v) => (v === null ? 'blank (null)' : v === '' ? "blank ('')" : v === undefined ? 'omitted' : String(v));
/** A figure the engine may decline to give, printed as the dump's fxOr(v, 'null'). */
const orNull = (v, p = f4) => (v === null || v === undefined ? 'null' : p(v));
const yesNo = (b) => (b === true ? 'true' : b === false ? 'false' : 'no verdict');
const list = (a) => (a && a.length ? a.join('; ') : 'none');
const noneOr = (v) => (v === null || v === undefined ? 'none' : v);
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
  it('the digest is whole: all thirty-six sections', () => {
    expect(Object.keys(SECTIONS).length).toBe(36);
    expect(DIGEST.split('\n').length).toBeGreaterThan(800);
  });

  it('the digest and the graded answers are the bytes waves.json pins', () => {
    const pins = WAVES[WAVE_NAME].pins;
    const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
    expect(sha(DIGEST)).toBe(pins['digest.txt']);
    expect(sha(FIELDS_JSON)).toBe(pins['fields.json']);
  });

  it('THE MIRROR GATE: the committed copy is the wave, and this gate says which it compared', () => {
    const named = WAVES[WAVE_NAME].inputs;
    expect(named.length).toBeGreaterThanOrEqual(20);
    named.forEach((x) => expect(fs.existsSync(path.join(WAVE, x)), `${x} is missing from ${WAVE}`).toBe(true));
    if (LIVE_WAVE) {
      const pinned = ['digest.txt', 'fields.json', 'precision.json', 'capstone.json', 'gasvalue_fields.mjs', 'gasvalue_dump.mjs'];
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

  it('the teaching records are copied VERBATIM from gasvalue_fields.mjs, byte for byte', () => {
    const lab = sourceOf(LAB_FILE);
    const begin = '// ---- BEGIN VERBATIM gasvalue_fields.mjs ----\n';
    const end = '// ---- END VERBATIM gasvalue_fields.mjs ----';
    expect(lab).toContain(begin);
    expect(lab).toContain(end);
    const block = lab.slice(lab.indexOf(begin) + begin.length, lab.indexOf(end));
    const wave = FIELDS_MJS.slice(FIELDS_MJS.indexOf('/* ----'));
    expect(wave.length, 'the wave file carries almost nothing').toBeGreaterThan(6000);
    expect(block).toBe(wave);
    expect(DUMP_MJS).toContain("import * as T from './gasvalue_fields.mjs';");
  });

  it('and they AGREE IN VALUE with the wave file when run, not only as text', () => {
    const names = Object.keys(WAVE_FIELDS);
    expect(names.length).toBeGreaterThanOrEqual(29);
    const differing = names.filter((k) => JSON.stringify(L[k]) !== JSON.stringify(WAVE_FIELDS[k]));
    expect(differing).toEqual([]);
  });

  it('the probes the dump holds inline are the dump\'s own', () => {
    expect(DUMP_MJS).toContain(`for (const code of [${L.PURE_CODES.map((c) => `'${c}'`).join(', ')}])`);
    expect(DUMP_MJS).toContain(`const typedC3 = comps([${L.CARBON_PROBE.map(([c, y]) => `['${c}', ${y}]`).join(', ')}]);`);
    expect(DUMP_MJS).toContain(`for (const eta of [${L.DESTRUCTION_SWEEP.join(', ')}])`);
    expect(DUMP_MJS).toContain(`for (const gwp of [P.gwpMethane, ${L.GWP_OTHERS.join(', ')}])`);
    expect(DUMP_MJS).toContain(`blendComps({ propane: ${L.STUDIO_BLEND.propane}, butane: ${L.STUDIO_BLEND.butane} })`);
    expect(DUMP_MJS).toContain(`recoveryFraction: ${L.STUDIO_LPG_RECOVERY} }`);
    expect(DUMP_MJS).toContain(`L.cngDispensing({ vehiclesPerHour: ${L.FORECOURT_OVERLOAD}, fillMinutes`);
    expect(DUMP_MJS).toContain(`for (const e of [${L.RATIO_SWEEP[0]}, X.newFuel.efficiencyRatio, ${L.RATIO_SWEEP[2]}])`);
  });

  it('every engine member the lab names resolves in the vendored modules', () => {
    const code = strip(sourceOf(LAB_FILE));
    const used = [...code.matchAll(/\b(FV|LC|MR)\.([A-Za-z_]\w*)/g)].map((m) => [m[1], m[2]]);
    expect(used.length).toBeGreaterThan(40);
    const missing = used.filter(([ns, name]) => L.ENGINE[ns][name] === undefined).map(([ns, n]) => `${ns}.${n}`);
    expect([...new Set(missing)]).toEqual([]);
    // The one function in scope that reads the machine year is never named.
    expect(code).not.toMatch(/feasibilityEconomics/);
  });
});

// ---------------------------------------------------------------------------
// AGREEMENT WITH THE DIGEST, section by section.
// ---------------------------------------------------------------------------

describe('AGREEMENT WITH THE DIGEST, the flare explorer (Associate)', () => {
  it('SECTION 1, what the two modules export', () => {
    const e = S.engines;
    pin(1, [
      row('flareToValue', `${e.flareToValue.functions.length} (${e.flareToValue.functions.join(', ')})`, `${e.flareToValue.constants.length} (${e.flareToValue.constants.join(', ')})`),
      row('lpgCng', `${e.lpgCng.functions.length} (${e.lpgCng.functions.join(', ')})`, `${e.lpgCng.constants.length} (${e.lpgCng.constants.join(', ')})`),
    ]);
  });

  it('SECTION 2, the unit constants and one Mscf of each pure component', () => {
    pin(2, [
      ...S.reference.constants.map((c) => row(c.name, c.name === 'BTU_PER_MWH' ? f4(c.value) : inp(c.value), c.what)),
      ...S.pure.map((p) => row(p.label, inp(p.molarMassLbLbmol), f4(p.kgPerMscf))),
    ]);
  });

  it('SECTION 3, the component reference table and its note', () => {
    pin(3, [
      ...S.reference.table.map((r) => row(r.code, r.label, inp(r.c), inp(r.molarMassLbLbmol), inp(r.typicalGhvBtuScf), r.liquidDensityLbGal === null ? 'none' : inp(r.liquidDensityLbGal), yesNo(r.recoverableAsNgl), yesNo(!!r.inert))),
      `The engine's note on the table: "${S.reference.note}"`,
    ]);
  });

  it('SECTION 4, an analysis that does not sum to one', () => {
    const eg = S.egbema; const es = S.egbemaShort;
    pin(4, [
      row('EGBEMA in full', f4(eg.rawMoleFractionSum), noneOr(eg.normalisationNote)),
      row('EGBEMA typed short', f4(es.rawMoleFractionSum), noneOr(es.normalisationNote)),
      ...L.EGBEMA_SHORT_GAS.map(([code, y], i) => row(code, inp(y), f4(es.normalised[i].moleFraction), inp(L.EGBEMA_GAS[i][1]), f4(eg.normalised[i].moleFraction))),
    ]);
    expect(eg.normalisationNote).toBeNull();
    expect(es.normalisationNote).toBeTruthy();
  });

  it('SECTION 5, the gas by the mole, and the two heating value shortcuts', () => {
    const lines = [['EGBEMA', S.egbema], ['OGUTA', S.oguta], ['studio opening gas', S.studio]].map(([n, g]) => row(n, f4(g.ghvBtuScf), f4(g.inertMoleFraction), f4(g.co2MoleFraction), f4(g.methaneMoleFraction), f4(g.carbonPerMol), f4(g.hydrocarbonCarbonPerMol), f4(g.molarMassLbLbmol), f4(g.kgPerMscf)));
    const eg = S.egbema;
    pin(5, [
      ...lines,
      row('the engine, on moles', f4(eg.ghvBtuScf), f4(0)),
      row('the same heating values weighted by mass', f4(eg.massWeightedGhvNotUsed), f4(eg.massWeightedLessEngineNotUsed)),
      row('the engine asked about the hydrocarbons alone (inerts left out and the rest scaled to one)', f4(eg.hydrocarbonsOnlyGhv), f4(eg.hydrocarbonsOnlyLessEngine)),
    ]);
    [S.egbema, S.oguta, S.studio].forEach((g) => expect(f4(g.carbonLessHydrocarbonDerived)).toBe(f4(g.co2MoleFraction)));
  });

  it('SECTION 6, a carbon number is never assumed, and what the analysis refuses', () => {
    pin(6, [
      ...S.carbonProbe.map((x) => row(x.probe, f4(x.carbonPerMol), f4(x.hydrocarbonCarbonPerMol))),
      ...S.analysisRefusals.map((x) => row(x.probe, refused(x.refusal))),
    ]);
  });

  it('SECTION 7, the liquids in the gas and where the richness word changes', () => {
    pin(7, [
      `"${S.egbema.gpmBasis}"`,
      ...[['EGBEMA', S.egbema], ['OGUTA', S.oguta], ['studio opening gas', S.studio]].map(([n, g]) => row(n, f4(g.gpmC2Plus), f4(g.gpmC3Plus), f4(g.ethaneGpmDerived), g.richness)),
      row('lean to moderate', f4(S.richnessEdges.leanToModerate.gpmC3Plus)),
      row('moderate to rich', f4(S.richnessEdges.moderateToRich.gpmC3Plus)),
    ]);
    expect(S.richnessEdges.leanToModerate).toMatchObject({ below: 'lean', above: 'moderate' });
    expect(S.richnessEdges.moderateToRich).toMatchObject({ below: 'moderate', above: 'rich' });
  });

  it('SECTION 8, a missing density is a missing answer', () => {
    pin(8, S.missingProbes.map((x) => row(x.probe, orNull(x.gpmC2Plus), orNull(x.gpmC3Plus), x.richness === null ? 'null' : x.richness, list(x.missingLiquidDensity), orNull(x.ghvBtuScf), noneOr(x.ghvNote))));
  });

  it('SECTION 9, the mass ceiling on liquids', () => {
    pin(9, [['EGBEMA', S.egbema], ['OGUTA', S.oguta], ['studio opening gas', S.studio]].map(([n, g]) => row(n, f4(g.kgPerMscf), f4(g.c3PlusKgPerMscf), f4(g.c3PlusShareDerived))));
  });

  it('SECTION 10, the flare by 40 CFR 98.233(n), the CO2 passing through and methane from the methane', () => {
    const f = S.egbemaFlare;
    pin(10, [
      `The engine's basis sentence: "${f.basis}"`,
      row('CO2', S.flareMolarMasses.co2.toFixed(3)),
      row('methane', S.flareMolarMasses.methane.toFixed(3)),
      row('scfPerYear', inp(f.scfPerYear)),
      row('flareCo2Tonnes (t/yr)', t3(f.flareCo2Tonnes)),
      row('flareCh4Tonnes (t/yr)', t3(f.flareCh4Tonnes)),
      row('flareCo2eTonnes (t/yr)', t3(f.flareCo2eTonnes)),
      row('methaneShareOfFlareCo2e', f4(f.methaneShareOfFlareCo2e)),
      row('destructionEfficiency', inp(f.destructionEfficiency)),
      row('combustionEfficiency', inp(f.combustionEfficiency)),
      ...S.passThrough.map((x) => row(x.probe, t3(x.flareCo2Tonnes), t3(x.flareCh4Tonnes))),
      row('the engine (methane in the gas)', t3(f.flareCh4Tonnes), f4(1)),
      row('every unburned carbon counted as methane', t3(f.allCarbonMethaneNotUsed), f4(f.allCarbonOverEngineNotUsed)),
    ]);
  });

  it('SECTION 11, destruction and combustion efficiency, and the stand-in', () => {
    const { given, left, leftLessGivenDerived: d } = S.standIn;
    pin(11, [
      row('both efficiencies given', inp(given.combustionEfficiency), t3(given.flareCo2Tonnes), t3(given.flareCh4Tonnes), t3(given.flareCo2eTonnes), noneOr(given.combustionEfficiencyNote)),
      row('combustion efficiency left out', inp(left.combustionEfficiency), t3(left.flareCo2Tonnes), t3(left.flareCh4Tonnes), t3(left.flareCo2eTonnes), left.combustionEfficiencyNote),
      row('left out minus given', f4(d.combustionEfficiency), t3(d.flareCo2Tonnes), t3(d.flareCh4Tonnes), t3(d.flareCo2eTonnes), ''),
      ...S.destructionSweep.map((x) => row(inp(x.eta), t3(x.flareCo2Tonnes), t3(x.flareCh4Tonnes), t3(x.flareCo2eTonnes), f4(x.methaneShareOfFlareCo2e))),
    ]);
  });

  it('SECTION 12, CO2e with a stated GWP, and the GWP left blank', () => {
    const n = S.noGwp;
    pin(12, [
      ...S.gwpSweep.map((x) => row(inp(x.gwp), t3(x.flareCo2eTonnes), f4(x.methaneShareOfFlareCo2e))),
      row('flareCo2Tonnes', t3(n.flareCo2Tonnes)),
      row('flareCh4Tonnes', t3(n.flareCh4Tonnes)),
      row('flareCo2eTonnes', orNull(n.flareCo2eTonnes, t3)),
      row('methaneShareOfFlareCo2e', orNull(n.methaneShareOfFlareCo2e)),
      row('blockedBy', n.blockedBy),
    ]);
  });

  it('SECTION 13, what abatement refuses, and on-stream days omitted', () => {
    pin(13, [
      ...S.flareRefusals.map((x) => row(x.probe, refused(x.refusal))),
      `On-stream days OMITTED from the call (not typed at all) take the stated default: scfPerYear ${inp(S.omittedDays.scfPerYear)}. Typed blank, they are refused, as the table shows.`,
    ]);
  });

  it('SECTION 14, the studio opens with both efficiencies and the GWP blank', () => {
    pin(14, [row(`studio opening gas, ${L.SUITE_FLARE.volumeMMscfd} MMscfd, ${L.SUITE_FLARE.onstreamDays} days, efficiencies blank`, refused(S.studioFlare.refusal))]);
  });

  it('SECTION 15, the EGBEMA flare end to end', () => {
    const g = S.egbema; const f = S.egbemaFlare;
    pin(15, [
      row('sheet sum', f4(g.rawMoleFractionSum)),
      row('heating value, Btu/scf', f4(g.ghvBtuScf)),
      row('inerts, mole fraction', f4(g.inertMoleFraction)),
      row('hydrocarbon carbon per mole', f4(g.hydrocarbonCarbonPerMol)),
      row('mass, kg/Mscf', f4(g.kgPerMscf)),
      row('propane and heavier, kg/Mscf', f4(g.c3PlusKgPerMscf)),
      row('liquids, gal/Mscf C3+', f4(g.gpmC3Plus)),
      row('richness', g.richness),
      row('flare CO2, t/yr', t3(f.flareCo2Tonnes)),
      row('flare methane, t/yr', t3(f.flareCh4Tonnes)),
      row('flare CO2e, t/yr', t3(f.flareCo2eTonnes)),
      row('heating value, Btu/scf', f4(S.studio.ghvBtuScf)),
      row('liquids, gal/Mscf C3+', f4(S.studio.gpmC3Plus)),
    ]);
  });
});

describe('AGREEMENT WITH THE DIGEST, the route explorer (Professional)', () => {
  it('SECTION 16, the route templates, their note and the requirement notes', () => {
    const t = S.templates;
    pin(16, [
      ...t.templates.flatMap((x) => x.requirements.map((q) => row(x.id, x.label, x.yieldBasis.unit, x.yieldBasis.ceiling, q.label, q.direction, q.unit, q.limit === null ? 'null' : inp(q.limit)))),
      `The engine's note: "${t.note}"`,
      ...t.requirementNotes.map((n) => `- ${n.route}, ${n.requirement}: "${n.note}"`),
    ]);
  });

  it('SECTION 17, screening EGBEMA, and every limit unset', () => {
    pin(17, [
      ...S.screens.flatMap((s) => s.checks.map((c) => row(s.label, c.label, orNull(c.actual), c.limit === null ? 'unset' : inp(c.limit), c.status, c.margin === null ? 'none' : f4(c.margin)))),
      ...S.screens.map((s) => row(s.label, s.verdict, s.failures.length ? s.failures.map((x) => `${x.requirement}: ${f4(x.actual)} against ${inp(x.limit)}, short by ${f4(x.shortfall)} ${x.unit}`).join('; ') : 'none', list(s.uncheckedRequirements))),
      ...S.openScreens.map((s) => row(s.label, s.verdict)),
      row('screenRoute on a gas the analysis refused', refused(S.screenRefusal)),
    ]);
  });

  it('SECTION 18, each route against its ceiling on three gases, and the yields refused', () => {
    const c = S.ceilings;
    pin(18, [
      ...c.egbema.map((x, i) => row(x.label, x.unit, x.basis, f4(x.ceiling), f4(c.oguta[i].ceiling), f4(c.studio[i].ceiling), inp(L.EGBEMA_ROUTES[x.routeId].productUnitPerMscf))),
      ...S.yieldRefusals.map((x) => row(x.probe, refused(x.refusal))),
      `The studio's LPG route on its opening gas at ${inp(S.studioLpg.yieldPerMscf)} t/Mscf is within its ceiling of ${f4(S.studioLpg.ceiling)} t/Mscf, and the typed yield over the ceiling is ${f4(S.studioLpg.yieldOverCeilingDerived)}.`,
    ]);
    S.yieldChecks.forEach((x) => expect(x.yieldOverCeilingDerived).toBeLessThanOrEqual(1));
  });

  it('SECTION 19, a route\'s year, the recoveries refused and the blank costs named', () => {
    pin(19, [
      ...S.routeYears.map((e) => row(e.label, f4(e.mscfPerYear), `${f4(e.productPerYear)} ${e.productUnitLabel}`, d2(e.revenuePerYear), d2(e.operatingCostPerYear), d2(e.grossMarginPerYear), f4(e.valuePerMscf))),
      ...S.routeRefusals.map((x) => row(x.probe, refused(x.refusal))),
      ...S.blankCosts.map((x) => row(x.probe === 'both costs typed' ? 'both costs typed' : x.probe, d2(x.operatingCostPerYear), f4(x.valuePerMscf), list(x.assumedZero))),
    ]);
  });

  it('SECTION 20, capital by the modular power law, the six-tenths reading and the cash flow', () => {
    pin(20, [
      ...S.exponents.map((x) => row(x.name, inp(x.value))),
      ...S.routeYears.map((e) => row(e.label, d2(e.capitalCost), inp(e.scalingExponent), d2(e.sixTenthsNotUsed), d2(e.modularLessSixTenthsDerived))),
      ...S.routeYears.map((e) => row(e.label, d2(e.cashFlow.year0), d2(e.cashFlow.recurring))),
      `The engine's valuation note: "${S.routeYears[0].valuationNote}"`,
      `With the reference cost left blank the capital is null and the note reads: "${S.noReferenceCost.capexNote}"`,
    ]);
    expect(S.noReferenceCost.capitalCost).toBeNull();
  });

  it('SECTION 21, the counterfactual, the power route and blocked until declared', () => {
    const cng = S.counterfactuals.filter((c) => c.routeId === 'cng');
    const power = S.counterfactuals.find((c) => c.key === 'power');
    const undeclared = S.blocked.find((b) => b.probe === 'no counterfactual label');
    pin(21, [
      ...cng.map((a) => row(a.counterfactualLabel, t3(a.flareCo2eTonnes), inp(a.recoveryFraction), t3(a.avoidedFlareCo2eTonnes), inp(a.productCombustionTonnesCo2ePerYear), inp(a.displacedFuelTonnesCo2ePerYear), t3(a.netAbatementTonnesCo2ePerYear), t3(a.netLessGrossDerived))),
      `Gas to power recovers ${inp(power.recoveryFraction)}. Its counterfactual, "${power.counterfactualLabel}": product combustion ${inp(power.productCombustionTonnesCo2ePerYear)}, displaced ${inp(power.displacedFuelTonnesCo2ePerYear)}. avoidedFlareCo2eTonnes ${t3(power.avoidedFlareCo2eTonnes)}, netAbatementTonnesCo2ePerYear ${t3(power.netAbatementTonnesCo2ePerYear)}.`,
      ...S.blocked.map((b) => row(b.probe, 'null', b.blockedBy)),
      `The warning printed while the counterfactual is undeclared: "${undeclared.warning}"`,
      `The flare's gross CO2e is still reported beside a blocked net, as grossClaimIfNoCounterfactual (${t3(undeclared.grossClaimIfNoCounterfactual)} t/yr here): the claim the engine will not make.`,
    ]);
    S.blocked.forEach((b) => expect(b.netAbatementTonnesCo2ePerYear).toBeNull());
  });

  it('SECTION 22, the breakeven credit price, the stand-alone hurdle and what credits refuse', () => {
    const c = S.credits; const e = S.creditEdges;
    pin(22, [
      ...c.points.map((p) => row(inp(p.creditPrice), d2(p.creditRevenuePerYear), d2(p.totalMarginPerYear), yesNo(p.clearsHurdle))),
      row('standsAloneWithoutCredits', yesNo(c.standsAloneWithoutCredits)),
      row('breakevenCreditPrice ((hurdle minus margin) over net tonnes)', f4(c.breakevenCreditPrice)),
      row('lowestTestedClearingPrice', inp(c.lowestTestedClearingPrice)),
      row('the first price in the order typed that clears', inp(c.firstTypedClearingPrice)),
      row('verdict', c.verdict),
      `At a hurdle of ${inp(L.EGBEMA_LOW_HURDLE)} the route stands alone: standsAloneWithoutCredits ${yesNo(e.lowHurdle.standsAloneWithoutCredits)}, breakevenCreditPrice ${f4(e.lowHurdle.breakevenCreditPrice)}, verdict "${e.lowHurdle.verdict}"`,
      row('the gas-to-power counterfactual, which adds emissions', refused(e.addsEmissions)),
      row('no net abatement (the counterfactual undeclared)', refused(e.noNet)),
      row("a hurdle that is not a number ('x')", refused(e.badHurdle)),
      row('no margin for the route (price missing)', `answers with no verdict: breakevenCreditPrice ${orNull(e.noMargin.breakevenCreditPrice)}; "${e.noMargin.verdict}"`),
      row("hurdle left blank ('')", `answers with no verdict: breakevenCreditPrice ${orNull(e.blankHurdle.breakevenCreditPrice)}; "${e.blankHurdle.verdict}"`),
    ]);
  });

  it('SECTION 23, the bid table with the study\'s limits and with every limit unset', () => {
    const b = S.bid; const o = S.bidOpen;
    pin(23, [
      ...b.rows.map((r) => row(r.label, r.verdict, d2(r.capitalCost), d2(r.revenuePerYear), d2(r.grossMarginPerYear), f4(r.valuePerMscf), r.netAbatementTonnesCo2ePerYear === null ? 'none declared' : t3(r.netAbatementTonnesCo2ePerYear))),
      row('bestByValuePerMscf', b.bestByValuePerMscf === null ? 'null' : b.bestByValuePerMscf),
      row('leaderNotFullyScreened', b.leaderNotFullyScreened === null ? 'null' : b.leaderNotFullyScreened),
      row('screenedOut', list(b.screenedOut)),
      row('notFullyScreened', list(b.notFullyScreened)),
      row('rankingNote', b.rankingNote),
      row('bestByValuePerMscf', o.bestByValuePerMscf === null ? 'null' : o.bestByValuePerMscf),
      row('leaderNotFullyScreened', o.leaderNotFullyScreened === null ? 'null' : o.leaderNotFullyScreened),
      row('rankingNote', o.rankingNote),
    ]);
  });

  it('SECTION 24, the EGBEMA CNG route end to end', () => {
    const y = S.routeYears[0]; const a = S.counterfactuals[0];
    pin(24, [
      row('CNG yield ceiling, kg/Mscf', f4(y.yieldCeilingPerMscf)),
      row('CNG made, kg/yr', f4(y.productPerYear)),
      row('capital, dollars', d2(y.capitalCost)),
      row('gross margin, dollars a year', d2(y.grossMarginPerYear)),
      row('value per Mscf, dollars', f4(y.valuePerMscf)),
      row('flare CO2e, t/yr', t3(a.flareCo2eTonnes)),
      row('avoided flare CO2e at the recovery, t/yr', t3(a.avoidedFlareCo2eTonnes)),
      row('net abatement against diesel, t/yr', t3(a.netAbatementTonnesCo2ePerYear)),
      row('breakeven credit price, dollars per tonne', f4(S.credits.breakevenCreditPrice)),
    ]);
  });
});

describe('AGREEMENT WITH THE DIGEST, the rollout explorer (Expert)', () => {
  it('SECTION 25, the LPG blend on its three bases', () => {
    const k = S.kanoBlend;
    pin(25, [
      ...S.lpgReference.table.map((r) => row(r.code, r.label, inp(r.molarMassKgKmol), inp(r.typicalLiquidDensityKgM3), r.liquidDensityRange, inp(r.typicalLatentHeatKJkg), r.latentHeatRange, inp(r.typicalBoilingPointC))),
      `The engine's note: "${S.lpgReference.note}"`,
      ...[['KANO', k], ['studio opening blend', S.studioBlend]].map(([n, b]) => row(n, `${f4(b.densityKgM3)} (${b.densityBasis})`, `${f4(b.latentHeatKJkg)} (${b.latentHeatBasis})`, `${f4(b.molarMassKgKmol)} (${b.molarMassBasis})`, f4(b.massFractions[0].massFraction), f4(b.massFractions[1].massFraction))),
      `Density blends on volume; latent heat per kilogram blends on mass, through the mass fractions the densities give; molar mass blends on moles. KANO's latent heat averaged on the volume fractions instead would be ${f4(k.latentOnVolumeNotUsed)} kJ/kg, which is ${f4(k.latentOnVolumeLessEngineNotUsed)} kJ/kg from the engine's.`,
      ...S.blendRefusals.map((x) => row(x.probe, refused(x.refusal))),
    ]);
  });

  it('SECTION 26, the vessel, the fill limit and its basis, and the blank lead time', () => {
    const [liq, wat] = S.kanoVessels; const e = S.vesselEdges; const b = e.blankLead;
    pin(26, [
      ...S.kanoVessels.map((s, i) => row(inp(L.KANO_FILL_LIMITS[i].maxFillRatio), s.fillRatioBasis, f4(s.usableM3), f4(s.usableTonnes), f4(s.vapourSpaceM3), f4(s.coverDays), f4(s.safetyStockTonnes), f4(s.reorderAtTonnes), f4(s.ullageAtReorderTonnes), yesNo(s.deliveryFitsUllage), f4(s.deliveriesPerMonth))),
      `The same ${inp(L.KANO_FILL_LIMITS[1].maxFillRatio)} read on the other basis (as a share of the liquid volume) gives ${f4(wat.otherBasisTonnesNotUsed)} t, which is ${f4(-wat.otherBasisLessEngineNotUsed)} t below the filling density's ${f4(wat.usableTonnes)} t. The vapour space is not spare capacity: it is what keeps a vessel of expanding liquid from rupturing.`,
      ...e.refusals.map((x) => row(x.probe, refused(x.refusal))),
      `A BLANK LEAD TIME IS MISSING. With the lead time left blank (''): missingInputs ${list(b.missingInputs)}; reorderAtTonnes ${orNull(b.reorderAtTonnes)}; deliveryFitsUllage ${yesNo(b.deliveryFitsUllage)}. The cover (${f4(b.coverDays)} days) does not depend on it and is still given.`,
    ]);
    expect(liq.fillRatioBasis).toBe('liquid_volume');
    expect(L.FILL_BASES).toEqual(['liquid_volume', 'water_capacity_mass']);
    expect(SECTIONS[26].join('\n')).toContain(`WATER_KG_M3 = ${e.waterKgM3} kg/m3`);
  });

  it('SECTION 27, the vaporizer, its floor and what it refuses', () => {
    const k = S.kanoVaporizer; const fl = S.vaporizerStart;
    pin(27, [
      ...k.terms.map((t) => row(t.label, f4(t.kW), f4(t.share))),
      row('dutyKW', f4(k.dutyKW), f4(1)),
      row('designDutyKW (with the margin)', f4(k.designDutyKW), ''),
      `With the boiling point left blank the engine gives the boil alone: dutyKW ${f4(fl.dutyKW)}, missingTerms ${list(fl.missingTerms)}, and the note "${fl.note}"`,
      ...S.vaporizerRefusals.map((x) => row(x.probe, refused(x.refusal))),
    ]);
    // THE EXPLORER STARTS ON THE FLOOR: the boiling point is blank, so the duty is a floor, never refused.
    expect(fl.refusal).toBeNull();
    expect(fl.complete).toBe(false);
  });

  it('SECTION 28, the carousel on the positions wholly working', () => {
    const k = S.carousel; const s = S.studioCarousel;
    pin(28, [
      row('arrivalsPerHour', f4(k.arrivalsPerHour)),
      row('effectivePositions', f4(k.effectivePositions)),
      row('queuePositions', inp(k.queuePositions)),
      row('positionRoundingNote', k.positionRoundingNote),
      row('minimumPositionsForThroughput', inp(k.minimumPositionsForThroughput)),
      row('queue offered (erlangs)', f4(k.queue.offered)),
      row('queue utilisation', f4(k.queue.utilisation)),
      row('queue probabilityOfWaiting', f4(k.queue.probabilityOfWaiting)),
      row('queue averageWaitMinutes', f4(k.queue.averageWaitMinutes)),
      row('queue queueLength', f4(k.queue.queueLength)),
      row('throughputCapacityPerDay', f4(k.throughputCapacityPerDay)),
      row('meetsDemand', yesNo(k.meetsDemand)),
      `The engine's note: "${k.note}"`,
      ...S.positionsSweep.map((x) => row(inp(x.positions), f4(x.queue.probabilityOfWaiting), f4(x.queue.averageWaitMinutes))),
      `The studio's opening carousel (${inp(L.SUITE_ROLLOUT.bottling.cylindersPerDay)} a day, ${inp(L.SUITE_ROLLOUT.bottling.fillMinutesPerCylinder)} minutes, ${inp(L.SUITE_ROLLOUT.bottling.positions)} positions at ${inp(L.SUITE_ROLLOUT.bottling.availabilityFraction)}, ${inp(L.SUITE_ROLLOUT.bottling.shiftHoursPerDay)} hours): effectivePositions ${f4(s.effectivePositions)}, queuePositions ${inp(s.queuePositions)}, averageWaitMinutes ${f4(s.queue.averageWaitMinutes)}.`,
      ...S.carouselRefusals.map((x) => row(x.probe, refused(x.refusal))),
    ]);
  });

  it("SECTION 29, cylinders and trailers by Little's law", () => {
    const block = (name, f, cyc) => [
      ...f.stages.map((s, i) => row(s.label, inp(cyc[i].days), f4(s.share))),
      row('cycleDays', f4(f.cycleDays)),
      row('inCirculation', f4(f.inCirculation)),
      row('sparesAllowance', f4(f.sparesAllowance)),
      row('fleetRequired', inp(f.fleetRequired)),
      row('spareCapacityUnits (what the ceiling adds)', f4(f.spareCapacityUnits)),
      row('dominantStage', f.dominantStage),
    ];
    pin(29, [
      ...block('KANO cylinders', S.cylinders, L.KANO_CYLINDER_CYCLE),
      ...block('IBAFO trailers', S.trailers, L.IBAFO_TRAILER_CYCLE),
      `The basis sentence: "${S.cylinders.basis}"`,
      ...S.floatRefusals.map((x) => row(x.probe, refused(x.refusal))),
    ]);
  });

  it('SECTION 30, gas in a bank: real, ideal, gauge and absolute, and the range', () => {
    const g = S.gauge; const c = S.cold;
    pin(30, [
      ...S.banks.map((b) => row(b.label, inp(b.inputs.volumeM3), inp(b.inputs.pressureBar), f4(b.z), f4(b.ppr), f4(b.tpr), yesNo(b.correlationInRange), f4(b.massKg), f4(b.idealMassKg), f4(b.realVersusIdeal))),
      row('the gauge reading typed as if absolute', inp(L.IBAFO_GAUGE.gaugeBar), f4(g.gaugeAsAbsoluteMassNotUsed)),
      row('gauge plus atmosphere', f4(g.pressureSentBar), f4(g.massKg)),
      row('absolute minus gauge-as-absolute', f4(L.IBAFO_GAUGE.atmosphereBar), f4(g.absoluteLessGaugeAsAbsoluteNotUsed)),
      `THE CORRELATION'S RANGE. DAK_RANGE: ppr ${inp(L.DAK_RANGE.pprMin)} to ${inp(L.DAK_RANGE.pprMax)}, tpr ${inp(L.DAK_RANGE.tprMin)} to ${inp(L.DAK_RANGE.tprMax)}. Outside it the engine still answers and says so:`,
      row('the Low bank at -80 C', f4(c.tpr), yesNo(c.correlationInRange), c.correlationNote),
      ...S.bankRefusals.map((x) => row(x.probe, refused(x.refusal))),
    ]);
    expect(SECTIONS[30].join('\n')).toContain(`pressureBasis "${L.PRESSURE_BASIS}"`);
  });

  it('SECTION 31, the cascade by equalisation, one bank, and the studio\'s', () => {
    const k = S.cascade; const s = S.studioCascade;
    const firstLast = [...k.fills.slice(0, 3), ...k.fills.slice(-2)];
    pin(31, [
      row('kgPerFill', f4(k.kgPerFill)),
      row('fillsBeforeRecharge', inp(k.fillsBeforeRecharge)),
      row('deliveredKg', t3(k.deliveredKg)),
      row('storedKg', t3(k.storedKg)),
      row('leftInBanksKg', t3(k.leftInBanksKg)),
      row('storedKg minus deliveredKg minus leftInBanksKg', t3(k.ledgerDerivedKg)),
      row('cascadeEfficiency (delivered over stored)', f4(k.cascadeEfficiency)),
      row('nextVehicleReachesBar', f4(k.nextVehicleReachesBar)),
      row('hitFillLimit', yesNo(k.hitFillLimit)),
      row('pressureBasis', k.pressureBasis),
      ...k.banksAfter.map((b) => row(b.label, f4(b.startBar), f4(b.endBar))),
      ...firstLast.map((f) => row(inp(f.fill), f.banks.join(', '))),
      `The engine's note: "${k.note}"`,
      `WHY THREE BANKS. The same ${f4(k.oneBank.volumeM3)} m3 as one bank at ${inp(k.oneBank.pressureBar)} bar(a): fillsBeforeRecharge ${inp(k.oneBank.fillsBeforeRecharge)}, cascadeEfficiency ${f4(k.oneBank.cascadeEfficiency)}, leftInBanksKg ${t3(k.oneBank.leftInBanksKg)}.`,
      `The studio's opening cascade (three 1.5 m3 banks at 250 bar(a), a 0.08 m3 vehicle from 20 to 200, gas ${inp(L.SUITE_ROLLOUT.gasSg)} at ${inp(L.SUITE_ROLLOUT.temperatureC)} C): fillsBeforeRecharge ${inp(s.fillsBeforeRecharge)}, cascadeEfficiency ${f4(s.cascadeEfficiency)}, leftInBanksKg ${t3(s.leftInBanksKg)}, nextVehicleReachesBar ${f4(s.nextVehicleReachesBar)}.`,
      ...S.cascadeRefusals.map((x) => row(x.probe, refused(x.refusal))),
    ]);
  });

  it('SECTION 32, the compressor as a unit bridge, and only that', () => {
    const c = S.compression;
    pin(32, [
      row('qMMscfd (the throughput as standard volume)', f4(c.qMMscfd)),
      row('suction, psia', f4(c.suctionPsia)),
      row('stageCount', inp(c.stageCount)),
      row('pressureBasis', c.pressureBasis),
      row('basis', c.basis),
      ...c.stages.map((s) => row(inp(s.stage), f4(s.suctionBar), f4(s.dischargeBar), f4(s.ratio))),
      ...S.compressionRefusals.map((x) => row(x.probe, refused(x.refusal))),
    ]);
    // No power, temperature or head leaves the reader: FC3 owns them.
    walk(c, 'compression', (v, p) => expect(p).not.toMatch(/kW|brake|dischargeC|specificEnergy|cooling|z$/i));
  });

  it('SECTION 33, the forecourt queue, stable and unstable', () => {
    const o = S.overload;
    pin(33, [
      ...S.forecourt.map((x) => row(inp(x.dispensers), f4(x.queue.utilisation), f4(x.queue.probabilityOfWaiting), f4(x.queue.averageWaitMinutes), f4(x.kgPerHour))),
      `At ${L.FORECOURT_OVERLOAD} buses an hour on 2 dispensers the forecourt cannot keep up. The engine gives an answer and no refusal: stable ${yesNo(o.queue.stable)}, utilisation ${f4(o.queue.utilisation)}, and the queue's message "${o.queue.message}"`,
      ...S.forecourtRefusals.map((x) => row(x.probe, refused(x.refusal))),
      `The engine's note: "${S.forecourt[0].note}"`,
    ]);
    expect(o.refusal).toBeNull();
  });

  it("SECTION 34, the customer's switch", () => {
    const k = S.ibafoSwitch; const e = S.switchEdges;
    pin(34, [
      row('consumptionSource', k.consumptionSource),
      row('newFuelConsumptionPer100Km (kg)', f4(k.newFuelConsumptionPer100Km)),
      row('PMS litres a year', f4(k.baseFuel.unitsPerYear)),
      row('PMS cost a year', f4(k.baseFuel.costPerYear)),
      row('PMS cost per km', f4(k.baseFuel.costPerKm)),
      row('CNG kg a year', f4(k.newFuel.unitsPerYear)),
      row('CNG cost a year', f4(k.newFuel.costPerYear)),
      row('CNG cost per km', f4(k.newFuel.costPerKm)),
      row('annualSaving (after maintenance)', f4(k.annualSaving)),
      row('savingPerKm', f4(k.savingPerKm)),
      row('simplePaybackYears', f4(k.simplePaybackYears)),
      row('kgCo2eAvoidedPerYear', f4(k.kgCo2eAvoidedPerYear)),
      row('paybackNote', k.paybackNote),
      ...S.ratioSweep.map((x) => row(inp(x.ratio), f4(x.newFuelConsumptionPer100Km), f4(x.annualSaving), f4(x.simplePaybackYears))),
      `With a measured CNG consumption of 9.5 kg per 100 km the engine uses it: consumptionSource "${e.measured.consumptionSource}", simplePaybackYears ${f4(e.measured.simplePaybackYears)}.`,
      `With CNG at 1100 naira a kg there is no saving: annualSaving ${f4(e.noSaving.annualSaving)}, simplePaybackYears ${orNull(e.noSaving.simplePaybackYears)}, and the note "${e.noSaving.paybackNote}"`,
      row('no measured consumption and the efficiency ratio left blank', refused(e.noRatio)),
      row('no annual distance', refused(e.noDistance)),
      row('year0', f4(k.annualCashFlow.year0)),
      row('recurring', f4(k.annualCashFlow.recurring)),
    ]);
    // THE EXPLORER STARTS WITH THE RATIO BLANK, so the engine's refusal is what it shows first.
    expect(S.switchStart.refusal).toBe(e.noRatio);
  });

  it('SECTION 36, the KANO and IBAFO rollout end to end', () => {
    pin(36, [
      row('KANO blend density, kg/m3', f4(S.kanoBlend.densityKgM3)),
      row('KANO usable LPG at a 0.85 liquid fill, t', f4(S.kanoVessels[0].usableTonnes)),
      row('KANO cover, days', f4(S.kanoVessels[0].coverDays)),
      row('KANO vaporizer design duty, kW', f4(S.kanoVaporizer.designDutyKW)),
      row('KANO carousel positions wholly working', inp(S.carousel.queuePositions)),
      row('KANO carousel average wait, minutes', f4(S.carousel.queue.averageWaitMinutes)),
      row('KANO cylinders required', inp(S.cylinders.fleetRequired)),
      row('IBAFO Mid bank, kg', f4(S.banks[1].massKg)),
      row('IBAFO fills before recharge', inp(S.cascade.fillsBeforeRecharge)),
      row('IBAFO left in the banks, kg', t3(S.cascade.leftInBanksKg)),
      row('IBAFO trailers required', inp(S.trailers.fleetRequired)),
      row('IBAFO bus simple payback, years', f4(S.ibafoSwitch.simplePaybackYears)),
    ]);
  });

  it('NEGATIVE CONTROL: one tonne a year moved by a kilogram no longer matches the digest', () => {
    const f = S.egbemaFlare;
    const good = row('flareCo2eTonnes (t/yr)', t3(f.flareCo2eTonnes));
    const moved = row('flareCo2eTonnes (t/yr)', t3(f.flareCo2eTonnes + 0.001));
    expect(SECTIONS[10]).toContain(good);
    expect(SECTIONS[10]).not.toContain(moved);
    expect(() => pin(10, [moved])).toThrow();
  });
});

// ---------------------------------------------------------------------------
// MISSING STAYS MISSING, at the controls a panel moves.
// ---------------------------------------------------------------------------

describe('MISSING STAYS MISSING: a blank box reaches the engine as missing', () => {
  const eg = () => L.presetRows('egbema');

  it('the flare explorer starts with every flare input blank, and the engine refuses', () => {
    Object.values(L.BLANK_FLARE).forEach((v) => expect(v).toBe(''));
    expect(S.blankFlare.refusal).toBeTruthy();
    expect(S.blankFlare.flareCo2Tonnes).toBeUndefined();
    // Each efficiency blank in turn, the rest EGBEMA's, is the engine's refusal.
    const r = L.flareAt(eg(), { ...L.egbemaFlareInputs(), flareDestructionEfficiency: '' });
    expect(r.refusal).toBe(S.flareRefusals[0].refusal);
  });

  it('a blank combustion efficiency lets the destruction efficiency stand in, and the engine says so', () => {
    const r = L.flareAt(eg(), { ...L.egbemaFlareInputs(), flareCombustionEfficiency: '' });
    expect(r.combustionEfficiency).toBe(L.EGBEMA_PARCEL.flareDestructionEfficiency);
    expect(r.combustionEfficiencyNote).toBe(S.standIn.left.combustionEfficiencyNote);
    expect(r.flareCo2Tonnes).toBe(S.standIn.left.flareCo2Tonnes);
  });

  it('a blank GWP leaves the CO2e missing and names why', () => {
    const r = L.flareAt(eg(), { ...L.egbemaFlareInputs(), gwpMethane: '' });
    expect(r.flareCo2eTonnes).toBeNull();
    expect(r.blockedBy).toBe(S.noGwp.blockedBy);
  });

  it('a blank density or heating value box makes the figure missing, and a blank carbon number is filled from the reference', () => {
    const noDens = L.gasAt(eg().map((x) => (x.code === 'C3' ? { ...x, liquidDensityLbGal: '' } : x)));
    expect(noDens.gpmC3Plus).toBeNull();
    expect(noDens.richness).toBeNull();
    expect(noDens.missingLiquidDensity).toEqual(['C3']);
    const noGhv = L.gasAt(eg().map((x) => (x.code === 'NC4' ? { ...x, ghvBtuScf: '' } : x)));
    expect(noGhv.ghvBtuScf).toBeNull();
    expect(noGhv.massWeightedGhvNotUsed).toBeNull();
    const noC = L.gasAt(eg().map((x) => (x.code === 'C3' ? { ...x, c: '' } : x)));
    expect(noC.carbonPerMol).toBe(S.egbema.carbonPerMol);
  });

  it('a limit left blank is unchecked, never passed', () => {
    const s = L.screenAt('cng', { ...L.EGBEMA_LIMITS.cng, maxInertFraction: '' });
    expect(s.checks.find((c) => c.key === 'maxInertFraction').status).toBe('unchecked');
    expect(s.verdict).toBe('not fully screened');
  });

  it('a blank recovery or days is refused; a blank cost is named in assumedZero', () => {
    expect(L.routeYearAt('cng', { ...L.EGBEMA_ROUTES.cng, recoveryFraction: '' }).refusal).toBeTruthy();
    expect(L.routeYearAt('cng', L.EGBEMA_ROUTES.cng, L.presetRows('egbema'), { volumeMMscfd: 7.5, onstreamDays: '' }).refusal).toBeTruthy();
    expect(L.routeYearAt('cng', { ...L.EGBEMA_ROUTES.cng, fixedOpexPerYear: '' }).assumedZero).toEqual(['fixed operating cost']);
  });

  it('the vessel starts with the fill limit blank and no basis chosen, and the engine refuses each', () => {
    expect(S.vesselStart.refusal).toBe(S.vesselEdges.refusals[0].refusal);
    const noBasis = L.vesselAt({ ...L.KANO_VESSEL, maxFillRatio: 0.85, fillRatioBasis: '' });
    expect(noBasis.refusal).toBeTruthy();
    expect(noBasis.usableTonnes).toBeUndefined();
    const withBasis = L.vesselAt({ ...L.KANO_VESSEL, maxFillRatio: 0.85, fillRatioBasis: 'liquid_volume' });
    expect(withBasis.usableTonnes).toBe(S.kanoVessels[0].usableTonnes);
  });

  it('a blank boiling point gives the floor; a liquid in above its boiling point is refused as the engine says', () => {
    const floor = L.vaporizerAt({ ...L.KANO_VAPORIZER, boilingPointC: '' });
    expect(floor.complete).toBe(false);
    expect(floor.note).toBe(S.vaporizerStart.note);
    const hot = L.vaporizerAt({ ...L.KANO_VAPORIZER, boilingPointC: L.BUTANE_ATMOSPHERIC_BOILING_C });
    expect(hot.refusal).toBe(S.vaporizerRefusals[0].refusal);
  });

  it('a gauge toggle hands the engine the gauge plus the stated atmosphere; a blank atmosphere is a missing pressure', () => {
    const g = L.bankAt({ ...L.ibafoGaugeInputs() });
    expect(g.massKg).toBe(S.gauge.massKg);
    const noAtm = L.bankAt({ ...L.ibafoGaugeInputs(), atmosphereBar: '' });
    expect(noAtm.refusal).toBe(S.bankRefusals[0].refusal);
  });

  it('the credit prices are handed over in the order typed, and a blank hurdle gives no verdict', () => {
    const r = L.creditsAt({ net: S.credits.netAbatementTonnesCo2ePerYear, margin: S.routeYears[0].grossMarginPerYear, prices: '12, 40', hurdleMarginPerYear: L.EGBEMA_CREDITS.hurdleMarginPerYear });
    expect(r.points.map((p) => p.creditPrice)).toEqual([12, 40]);
    expect(r.firstTypedClearingPrice).toBe(40);
    expect(S.creditEdges.blankHurdle.breakevenCreditPrice).toBeNull();
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
    expect(strip(ENGINE_SRC)).not.toMatch(/new Date\(|Date\.now|performance\.now|Math\.random/);
    // CONTROL on the stripper and the pattern.
    expect(strip('// new Date() in a comment\nconst x = 1;\n')).not.toContain('new Date');
    expect(strip('const now = Date.now();\n')).toMatch(/Date\.now/);
  });
});

const ZONES = [['Pacific/Pago_Pago', -660], ['Pacific/Kiritimati', 840]];
const CHILD_ZONE = process.env.GASVALUE_TZ_CHILD;
const SIDECAR = process.env.GASVALUE_TZ_SIDECAR;

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
      const sidecar = path.join(ROOT, 'node_modules', `.gasvalue-tz-${zone.replace(/\W/g, '_')}.json`);
      if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
      execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), [
        'run', '--reporter=dot', '--config', 'vitest.config.js', '--maxWorkers=1', '--minWorkers=1',
        'src/components/course/panels/gasvalue/gasvalueLab.test.js',
        '-t', `under TZ=${zone} is byte-identical`,
      ], {
        cwd: ROOT,
        env: { ...process.env, TZ: zone, GASVALUE_TZ_CHILD: zone, GASVALUE_TZ_SIDECAR: sidecar },
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
  ['FlareExplorer', FE, FlareExplorer, ['AnalysisMode', 'MoleMode', 'LiquidsMode', 'FlareMode']],
  ['RouteExplorer', RE, RouteExplorer, ['ScreenMode', 'YieldMode', 'YearMode', 'CounterfactualMode', 'CreditsMode', 'BidMode']],
  ['RolloutExplorer', XE, RolloutExplorer, ['BlendMode', 'VesselMode', 'VaporizerMode', 'CarouselMode', 'BankMode', 'CascadeMode', 'StationMode', 'SwitchMode']],
];

const noop = () => {};
const eg = () => L.presetRows('egbema');
const REAL_PROPS = {
  AnalysisMode: () => ({
    gas: L.gasAt(L.presetRows('egbema_short')), rows: L.presetRows('egbema_short'), onRow: noop, onPreset: noop, reference: L.referenceAt(), pure: L.pureComponentsAt(), refusals: L.analysisRefusalsAt(),
  }),
  MoleMode: () => ({ gas: L.gasAt(eg()), rows: eg(), onRow: noop, onPreset: noop, probe: L.carbonProbeAt() }),
  LiquidsMode: () => ({ gas: L.gasAt(eg()), rows: eg(), onRow: noop, onPreset: noop, edges: L.richnessEdgesAt(), probes: L.missingProbesAt() }),
  FlareMode: () => ({
    flare: L.flareAt(eg(), { ...L.egbemaFlareInputs(), flareCombustionEfficiency: '' }), inputs: L.egbemaFlareInputs(), onInput: noop, onEgbema: noop, onClear: noop,
    molar: L.flareMolarMassesAt(), passThrough: L.passThroughAt(), sweep: L.destructionSweepAt(), gwps: L.gwpSweepAt(), refusals: L.flareRefusalsAt(),
  }),
  ScreenMode: () => ({ templates: L.routeTemplatesAt(), screens: L.screensAt(), limits: L.egbemaLimits(), onLimit: noop, onStudy: noop, onUnset: noop }),
  YieldMode: () => ({ ceilings: L.yieldChecksAt(), years: L.routeYearsAt(), inputs: L.egbemaRouteInputs(), onInput: noop, refusals: L.yieldRefusalsAt(), studio: L.studioLpgAt() }),
  YearMode: () => ({
    route: 'cng', onRoute: noop, year: L.routeYearAt('cng'), inputs: L.egbemaRouteInputs(), onInput: noop, parcel: L.egbemaParcel(), onParcel: noop, years: L.routeYearsAt(), exponents: L.scalingExponentsAt(),
  }),
  CounterfactualMode: () => ({ cf: L.counterfactualAt(), inputs: L.egbemaCounterfactualInputs(), onInput: noop, preset: 'cng0', onPreset: noop, table: L.counterfactualsAt() }),
  CreditsMode: () => ({
    credits: L.egbemaCreditsAt(), cf: L.counterfactualAt(), year: L.routeYearAt('cng'), prices: '40, 8, 20, 12', onPrices: noop, hurdle: '24500000', onHurdle: noop,
  }),
  BidMode: () => ({ bid: L.bidAt() }),
  BlendMode: () => ({ blend: L.blendAt(), rows: L.blendRowsOf(L.KANO_BLEND), onRow: noop, onPreset: noop, reference: L.lpgReferenceAt(), refusals: L.blendRefusalsAt() }),
  VesselMode: () => ({ vessel: L.kanoVesselsAt()[1], inputs: { ...L.KANO_VESSEL, ...L.KANO_FILL_LIMITS[1] }, onInput: noop, edges: L.vesselEdgesAt() }),
  VaporizerMode: () => ({ vap: L.kanoVaporizerAt(), inputs: { ...L.KANO_VAPORIZER }, onInput: noop, onKano: noop, onAtmospheric: noop, refusals: L.vaporizerRefusalsAt() }),
  CarouselMode: () => ({
    carousel: L.carouselAt(), inputs: { ...L.KANO_BOTTLING }, onInput: noop, sweep: L.positionsSweepAt(), refusals: L.carouselRefusalsAt(),
    cylinders: L.floatAt(L.kanoCylindersInputs()), cylIn: L.kanoCylindersInputs(), onCyl: noop,
    trailers: L.floatAt(L.ibafoTrailersInputs()), trlIn: L.ibafoTrailersInputs(), onTrl: noop, floatRefusals: L.floatRefusalsAt(),
  }),
  BankMode: () => ({
    bank: L.ibafoGaugeAt(), inputs: L.ibafoGaugeInputs(), onInput: noop, onPreset: noop, banks: L.ibafoBanksAt(), cold: L.coldBankAt(), refusals: L.bankRefusalsAt(),
  }),
  CascadeMode: () => ({ cascade: L.cascadeAt(), inputs: L.ibafoCascadeInputs(), onBank: noop, onInput: noop, refusals: L.cascadeRefusalsAt() }),
  StationMode: () => ({
    comp: L.compressionAt(), compIn: L.ibafoCompressionInputs(), onComp: noop, compRefusals: L.compressionRefusalsAt(),
    forecourt: L.forecourtAt({ ...L.ibafoForecourtInputs(), kgPerFill: L.cascadeAt().kgPerFill }), fcIn: L.ibafoForecourtInputs(), onFc: noop,
    kgPerFill: L.cascadeAt().kgPerFill, overload: L.overloadAt(), fcRefusals: L.forecourtRefusalsAt(),
  }),
  SwitchMode: () => ({ sw: L.switchAt(), inputs: L.IBAFO_CONVERSION, onInput: noop, onRatio: noop, sweep: L.ratioSweepAt(), edges: L.switchEdgesAt() }),
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

  it('the explorers open on the engine\'s refusal or floor where an input has no default', () => {
    const flare = renderToStaticMarkup(React.createElement(FlareExplorer, { initialMode: 'flare' }));
    expect(flare).toContain('REFUSED');
    const vessel = renderToStaticMarkup(React.createElement(RolloutExplorer, { initialMode: 'vessel' }));
    expect(vessel).toContain('REFUSED');
    expect(vessel).toContain('choose a basis');
    const vap = renderToStaticMarkup(React.createElement(RolloutExplorer, { initialMode: 'vaporizer' }));
    expect(vap).toContain('a floor, terms missing');
    const sw = renderToStaticMarkup(React.createElement(RolloutExplorer, { initialMode: 'switch' }));
    expect(sw).toContain('REFUSED');
  });

  it('every CNG pressure a panel labels is labelled bar(a)', () => {
    const src = sourceOf('RolloutExplorer.jsx');
    const barLabels = src.match(/[,(]\s*bar\b(?!\(a\))/g) || [];
    // The only bare "bar" is the gauge reading, which is labelled as one.
    expect(barLabels.length).toBeLessThanOrEqual(1);
    expect(src).toContain("'Pressure on the gauge, bar'");
    expect(src).toContain("const BAR_A = 'bar(a)';");
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
    expect(seen).toBeGreaterThanOrEqual(8);
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

const REFUSAL_KEYS = /\.(refusal|message|note|basis|gpmBasis|normalisationNote|ghvNote|combustionEfficiencyNote|blockedBy|warning|verdict|rankingNote|capexNote|valuationNote|positionRoundingNote|correlationNote|paybackNote|addsEmissions|noNet|badHurdle|noRatio|noDistance|screenRefusal)$/;

describe('THE REFUSAL LITERAL GATE: every refusal and note a panel shows is the engine\'s own', () => {
  it('no engine sentence is typed into the lab, a panel or the page', () => {
    const sentences = [...new Set(stringsIn(S).filter(([p, v]) => REFUSAL_KEYS.test(p) && v.length > 30).map(([, v]) => v))];
    expect(sentences.length, 'the lab returns almost no engine sentences, so this sweep is vacuous').toBeGreaterThanOrEqual(40);
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
/** The sentences of a string that carry the contrastive shape. */
const breachingSentences = (s) => s.split(/(?<=\.)\s+/).filter((x) => breaches(x));

/**
 * AN ENGINE SENTENCE IS EXEMPT WHILE THE ENGINE STILL SAYS IT. A returned string
 * breaching the rule is excused only if every breaching sentence in it is in the
 * vendored engine source verbatim. Nothing is listed here, so a re-vendored
 * engine that rewords its notes shrinks the offenders without an edit, and a
 * sentence the lab or a panel wrote is never excused.
 */
const engineSays = (s) => breachingSentences(s).every((x) => ENGINE_SRC.includes(x.trim()));

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

  it('every string the lab hands a panel obeys it, except sentences the vendored engine itself says', () => {
    const strings = stringsIn(S);
    expect(strings.length).toBeGreaterThanOrEqual(500);
    const unexcused = strings.filter(([, s]) => breaches(s) && !engineSays(s));
    expect(unexcused.map(([p, s]) => `${p}: ${s}`)).toEqual([]);
  });

  it('CONTROL: a breaching sentence the engine does not say is not excused', () => {
    expect(engineSays('The panel wrote this, not the engine.')).toBe(false);
    const excused = stringsIn(S).filter(([, s]) => breaches(s));
    // Whatever the engine still says with the shape is excused only by being in its source.
    excused.forEach(([, s]) => breachingSentences(s).forEach((x) => expect(ENGINE_SRC).toContain(x.trim())));
  });
});
