// THE DRILLING HYDRAULICS PANEL GUARD, under the D2 policy (typedCaseGuard.js).
//
// All three hydraulics capstones run one new mud (52, 33, 6 and 5 at 1320
// kg/m3) that no explorer could be set to, so fifteen fields had no route. W4a
// gives the rheology, cleaning and surge explorers four dial boxes and a
// density box (blank is the selected case's own mud), prints pressures in MPa
// to 6 dp (1 Pa), and adds an open swab tile; the yield rule is taught in
// beginner m02 l04. Typing the mud is the work, so that reach is allowed. What
// this file forbids is the answer arriving without it: every view of the three
// explorers, at every case its select offers, with the boxes blank, lands on no
// graded answer; no default carries a capstone input; no panel source names a
// capstone reader or prints a graded answer.
//
// HD re-key (2026-09-22, migrations/20261030c_hd_hydraulics.sql): the beginner
// Herschel-Bulkley yield stress (hb_tau_y_Pa, 4 dial degrees) was numerically
// the light mud's measured 3 rpm stress in the default residual table, the one
// exception W4a had to pin. It is re-keyed onto the same mud's Herschel-Bulkley
// n (hb_n), which prints only once the mud is typed, so the pin is gone.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './hydraulicsLab.js';
import * as G from '../typedCaseGuard.js';
import * as K from '../../../../lib/w5cGuardKit.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = path.resolve(HERE, '../../../../../docs/graded-field-audit/fields.json');

// each live field as the grader holds it after every wave: a re-keyed field is
// its replacement (fields.json keeps the baseline key and records the re-key)
const live = JSON.parse(fs.readFileSync(FIELDS, 'utf8')).filter((f) => f.course === 'hydraulics')
  .map((f) => (f.shipped?.rekey ? { ...f, ...f.shipped.rekey, baseKey: f.key } : f));
const engine = L.capstoneValues();
const graded = live.map((f) => ({ tier: f.tier, key: f.key, value: engine[f.tier][f.key], tol: f.tol }));
// SI course (Pa, kg/m3, m/s, ratios): the psia and psig identities restate nothing.
const SI_SHIFTS = G.DEFAULT_SHIFTS.filter((x) => !x.tag.startsWith('psi'));
const targets = G.leakTargets(graded, { shifts: SI_SHIFTS });
const byKey = Object.fromEntries(live.map((f) => [f.key, f]));

const IDS = L.CASES.map((c) => c.id);
const BLANK = L.mudOver(L.BLANK_MUD);
const Q = 0.025;

// Every view of the three explorers, with the mud boxes blank, at every case.
const views = (over) => IDS.flatMap((id) => [
  { name: `rheology.models.${id}`, defaults: over, run: (o) => ({ f: L.rheology(o.fann ?? id), res: L.fitResiduals(o.fann ?? id) }) },
  { name: `rheology.curve.${id}`, defaults: over, run: (o) => L.rheologyCurve(o.fann ?? id) },
  { name: `rheology.chain.${id}`, defaults: over, run: (o) => { const s = L.pressureSplit(id, Q, o); return { s: { ...s, ecdProfile: undefined, elements: undefined }, sweep: L.flowSweep(id, undefined, o).map((r) => [r.pumpPressurePa / 1e6, r.bitShare * 100]) }; } },
  { name: `cleaning.transport.${id}`, defaults: over, run: (o) => L.holeCleaning(id, Q, o) },
  { name: `cleaning.ecd.${id}`, defaults: over, run: (o) => { const s = L.pressureSplit(id, Q, o); return { ecd: s.ecdAtTdKgM3, up: s.ecdOverMudKgM3, ann: s.annulusDpPa / 1e6, v: s.minAnnularVelocityMs, profile: s.ecdProfile.map((r) => r.ecdKgM3) }; } },
  {
    name: `cleaning.minflow.${id}`,
    defaults: over,
    run: (o) => {
      const q = L.minimumFlow(id, 0.9, o);
      return { q, sweep: L.cleaningSweep(id, undefined, o).map((r) => [r.minTransportRatio, r.worstCuttingsConcPct]), split: q == null ? null : L.pressureSplit(id, q, o).pumpPressurePa / 1e6 };
    },
  },
  ...['closed', 'open'].map((mode) => ({ name: `surge.sweep.${id}.${mode}`, defaults: over, run: (o) => L.tripSweep(id, [0.1, 0.2, 0.3, 0.5, 0.75, 1.0, 1.5], mode, o) })),
  { name: `surge.closedopen.${id}`, defaults: over, run: (o) => ({ c: L.surgeSwab(id, 0.5, 'closed', o), p: L.surgeSwab(id, 0.5, 'open', o), r: L.closedOverOpen(id, 0.5, o) }) },
  {
    name: `surge.window.${id}`,
    defaults: over,
    run: (o) => {
      const vClosed = L.speedLimit(id, { fracEmwKgM3: 1520, poreEmwKgM3: 1380, mode: 'closed', over: o });
      const vOpen = L.speedLimit(id, { fracEmwKgM3: 1520, poreEmwKgM3: 1380, mode: 'open', over: o });
      return { vClosed, vOpen, at: L.surgeSwab(id, vClosed, 'closed', o), ecd: L.pressureSplit(id, Q, o).ecdAtTdKgM3 };
    },
  },
]);

const panelSources = fs.readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx') && !f.includes('.test.'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

describe('the guard is built from the live graded fields', () => {
  it('eighteen live fields, each computed by the engine within its own tolerance', () => {
    expect(live).toHaveLength(18);
    live.forEach((f) => expect(Math.abs(engine[f.tier][f.key] - f.expected), `${f.tier}/${f.key}`).toBeLessThanOrEqual(f.tol));
  });
  it('blank boxes are the case\'s own mud, and a partial mud is no mud', () => {
    expect(BLANK).toEqual({});
    expect(L.mudOver({ ...L.BLANK_MUD, theta600: '52' })).toBeNull();
    expect(L.mudOver({ ...L.BLANK_MUD, densityKgM3: '9000' })).toBeNull();
    expect(L.mudOver({ theta600: '30', theta300: '33', theta6: '6', theta3: '5', densityKgM3: '' })).toBeNull();
    expect(L.mudOver({ ...L.BLANK_MUD, densityKgM3: '1320' })).toEqual({ densityKgM3: 1320 });
  });
});

describe('RULE 1: no view of the three explorers opens on a graded answer', () => {
  // KNOWN, and not a W4a change (the view is as it was): a swab EMW on the
  // light mud in kg/m3 sits within ten bands of a velocity in m/s read as
  // mm/s. The sweep is dimension blind on purpose; nobody reads a density as a
  // speed, and it is not within the grader's own band. It is pinned to its
  // view and key, so any other hit still fails. (The light mud's 3 rpm stress,
  // which was the graded yield, is no longer an exception: the HD re-key.)
  const KNOWN = [
    (h) => h.startsWith('surge.sweep.slant_light_wbm.closed.default[2].swabEmwKgM3 = ') && h.includes('/slant_min_annular_velocity_ms (x1000)'),
  ];
  const known = (h) => KNOWN.some((k) => k(h));
  it('every view, at every case, is silent with the mud boxes blank', () => {
    const hits = G.defaultStateHits({ targets, modes: views(BLANK) });
    expect(hits.filter((h) => !known(h))).toEqual([]);
    // and each known exception still exists, so the list cannot go stale
    KNOWN.forEach((k, i) => expect(hits.some(k), `known exception ${i} no longer fires`).toBe(true));
  }, 300000);
  it('NEGATIVE CONTROL: the same views on the capstone mud print the answers', () => {
    const over = { fann: L.CAPSTONE_FANN, densityKgM3: L.CAPSTONE_DENSITY_KGM3 };
    const hits = G.defaultStateHits({ targets, modes: views(over) });
    ['pl_n', 'hb_n', 'slant_surge_emw_closed_kgm3'].forEach((k) => expect(hits.some((h) => h.includes(`/${k} `)), k).toBe(true));
  }, 300000);
});

describe('RULE 2: no default carries a capstone input', () => {
  const capstone = { ...L.CAPSTONE_FANN, densityKgM3: L.CAPSTONE_DENSITY_KGM3 };
  const KEYS = ['theta600', 'theta300', 'theta6', 'theta3', 'densityKgM3'];
  it('the capstone mud is not the mud of any case the explorers offer', () => {
    // a dial reading may coincide with one case (theta6 = 6 is no mud); the
    // capstone MUD is the four readings together, and no case carries them
    L.CASES.forEach((c) => expect({ ...c.fann }, c.id).not.toEqual(L.CAPSTONE_FANN));
    expect(G.distinguishingKeyProblems({ capstone, teachingCases: L.CASES.map((c) => ({ name: c.id, inputs: { ...c.fann, densityKgM3: c.densityKgM3 } })), keys: ['theta600', 'theta300', 'densityKgM3'] })).toEqual([]);
  });
  it('every box opens blank', () => {
    Object.values(L.BLANK_MUD).forEach((v) => expect(v).toBe(''));
    expect(G.preloadHits({ capstone, bundles: [{ name: 'blank boxes', inputs: L.BLANK_MUD }], keys: KEYS })).toEqual([]);
    panelSources.filter((p) => p.file.endsWith('Explorer.jsx')).forEach(({ file, text }) => {
      expect(text, file).toMatch(/const \[mud, setMud\] = useState\(BLANK_MUD\);/);
    });
  });
  it('NEGATIVE CONTROL: a density box that opened on 1320 is a preload', () => {
    expect(G.preloadHits({ capstone, bundles: [{ name: 'bad', inputs: { ...L.BLANK_MUD, densityKgM3: 1320 } }], keys: ['densityKgM3'] }))
      .toEqual(['bad preloads the capstone\'s densityKgM3 = 1320']);
  });
});

describe('THE ROUTE: typing the stated mud reads all fifteen unreachable fields at the printed precision', () => {
  const o = L.mudOver({ theta600: '52', theta300: '33', theta6: '6', theta3: '5', densityKgM3: '1320' });
  const S = 'slant_kcl_polymer';
  const Hz = 'horizontal_kcl_polymer';
  const f = L.rheology(o.fann);
  const ps = L.pressureSplit(S, 0.03, o);
  const ph = L.pressureSplit(Hz, 0.03, o);
  const ch = L.holeCleaning(Hz, 0.03, o);
  const sc = L.surgeSwab(S, 0.75, 'closed', o);
  const so = L.surgeSwab(S, 0.75, 'open', o);
  // [key, the number shown, decimals printed, graded units per unit shown]
  const shown = [
    ['hb_n', f.herschelBulkley.n, 8, 1],
    ['pipe_dp_Pa', ps.pipeDpPa / 1e6, 6, 1e6],
    ['annulus_dp_Pa', ps.annulusDpPa / 1e6, 6, 1e6],
    ['pump_pressure_Pa', ps.pumpPressurePa / 1e6, 6, 1e6],
    ['slant_ecd_at_td_kgm3', ps.ecdAtTdKgM3, 5, 1],
    ['horizontal_ecd_at_td_kgm3', ph.ecdAtTdKgM3, 5, 1],
    ['horizontal_min_transport_ratio', ch.minTransportRatio, 8, 1],
    ['horizontal_worst_cuttings_conc_pct', ch.worstCuttingsConcPct, 6, 1],
    ['horizontal_min_flow_tr080_m3s', L.minimumFlow(Hz, 0.8, o), 8, 1],
    ['slant_surge_dp_closed_Pa', sc.dpPa / 1e6, 6, 1e6],
    ['slant_surge_emw_closed_kgm3', sc.surgeEmwKgM3, 4, 1],
    ['slant_swab_emw_open_kgm3', so.swabEmwKgM3, 4, 1],
    ['closed_over_open_dp_ratio', L.closedOverOpen(S, 0.75, o), 8, 1],
    ['horizontal_surge_emw_closed_kgm3', L.surgeSwab(Hz, 0.75, 'closed', o).surgeEmwKgM3, 4, 1],
    ['slant_max_trip_speed_ms', L.speedLimit(S, { fracEmwKgM3: 1400, poreEmwKgM3: 1260, mode: 'closed', over: o }), 6, 1],
  ];
  it('covers every field the audit found unobtainable', () => {
    // hb_n is the HD replacement of hb_tau_y_Pa, which the audit found unobtainable
    const noRoute = ['hb_n', 'pipe_dp_Pa', 'annulus_dp_Pa', 'pump_pressure_Pa', 'slant_ecd_at_td_kgm3', 'horizontal_ecd_at_td_kgm3',
      'horizontal_min_transport_ratio', 'horizontal_worst_cuttings_conc_pct', 'horizontal_min_flow_tr080_m3s', 'slant_surge_dp_closed_Pa',
      'slant_surge_emw_closed_kgm3', 'slant_swab_emw_open_kgm3', 'closed_over_open_dp_ratio', 'horizontal_surge_emw_closed_kgm3', 'slant_max_trip_speed_ms'];
    expect(shown.map((r) => r[0]).sort()).toEqual(noRoute.sort());
  });
  shown.forEach(([key, v, dp, scale]) => {
    it(`${key} at ${dp} dp`, () => {
      const fl = byKey[key];
      expect(G.typedRouteMiss({ run: () => v, typed: null, read: (x) => x, dp, expected: fl.expected / scale, tol: fl.tol / scale, key })).toBeNull();
    });
  });
  it('NEGATIVE CONTROL: the old 4 dp MPa print could not carry the pipe loss', () => {
    const fl = byKey.pipe_dp_Pa;
    // 4 dp of MPa is 100 Pa, whose half-step (50 Pa) is the whole tolerance
    expect(G.typedRouteMiss({ run: () => ps.pipeDpPa / 1e6, typed: null, read: (x) => x, dp: 3, expected: fl.expected / 1e6, tol: fl.tol / 1e6, key: 'pipe_dp_Pa' })).not.toBeNull();
  });
});

describe('RULE 3: no panel names a capstone reader or prints a graded answer', () => {
  it('there are panels to check', () => {
    expect(panelSources.map((s) => s.file).sort()).toEqual(['CleaningExplorer.jsx', 'MudBoxes.jsx', 'RheologyExplorer.jsx', 'SurgeExplorer.jsx']);
  });
  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone reader`, () => expect(G.capstoneNamesIn(text)).toEqual([]));
    it(`${file} prints no graded answer as a literal`, () => expect(G.gradedLiteralsIn(text, graded)).toEqual([]));
    it(`${file} carries no em dash and no en dash`, () => expect(text).not.toMatch(/[–—]/));
  });
});

describe('THE HD RE-KEY: hb_tau_y_Pa becomes hb_n, which only the typed mud prints', () => {
  const MIG = '20261030c_hd_hydraulics.sql';
  const mig = K.migrationFields(MIG, 'hydraulics', 'beginner');
  const hbN = byKey.hb_n;
  const oldTau = { tier: 'beginner', key: 'hb_tau_y_Pa', value: L.rheology(L.CAPSTONE_FANN).herschelBulkley.tauYPa, tol: 5e-4 };
  it('the migration writes the engine\'s value, in the yield stress\'s place, and moves nothing else', () => {
    expect(mig.fields.map((f) => f.key)).toEqual(['pl_n', 'hb_n', 'pipe_dp_Pa', 'annulus_dp_Pa', 'bit_dp_Pa', 'pump_pressure_Pa']);
    const f = mig.fields[1];
    expect(f.expected).toBe(engine.beginner.hb_n);
    expect(f.expected).toBe(L.rheology(L.CAPSTONE_FANN).herschelBulkley.n);
    expect({ key: f.key, label: f.label, unit: f.unit, expected: f.expected, tol: f.tol })
      .toEqual({ key: hbN.key, label: hbN.label, unit: hbN.unit, expected: hbN.expected, tol: hbN.tol });
    mig.fields.filter((x) => x.key !== 'hb_n').forEach((x) => {
      expect(x.expected, x.key).toBe(byKey[x.key].expected);
      expect(x.tol, x.key).toBe(byKey[x.key].tol);
    });
    expect(mig.prompt).toContain('the HERSCHEL-BULKLEY flow behaviour index n');
    expect(mig.prompt).not.toMatch(/yield stress in pascals/);
  });
  it('it still needs the yield rule: the Bingham yield point there, or theta3 alone, lands far outside tol', () => {
    const f = L.rheology(L.CAPSTONE_FANN);
    const t600 = L.CAPSTONE_FANN.theta600 * L.TAU_PER_DEG_PA;
    const t300 = L.CAPSTONE_FANN.theta300 * L.TAU_PER_DEG_PA;
    const nWith = (ty) => Math.log2((t600 - ty) / (t300 - ty));
    expect(Math.abs(nWith(f.herschelBulkley.tauYPa) - hbN.expected)).toBeLessThan(1e-12);
    expect(Math.abs(nWith(f.bingham.ypPa) - hbN.expected)).toBeGreaterThan(0.2);
    expect(Math.abs(nWith(L.CAPSTONE_FANN.theta3 * L.TAU_PER_DEG_PA) - hbN.expected)).toBeGreaterThan(0.01);
    expect(Math.abs(f.powerLaw.n - hbN.expected)).toBeGreaterThan(0.05);
  });
  it('no view at any case prints hb_n with the boxes blank', () => {
    const t = G.leakTargets([{ tier: 'beginner', key: 'hb_n', value: hbN.expected, tol: hbN.tol }], { shifts: SI_SHIFTS });
    expect(G.defaultStateHits({ targets: t, modes: views(BLANK) })).toEqual([]);
  }, 300000);
  it('NEGATIVE CONTROL: the same sweep finds the OLD yield stress on the light mud\'s default residual table', () => {
    const t = G.leakTargets([oldTau], { shifts: SI_SHIFTS });
    const hits = G.defaultStateHits({ targets: t, modes: views(BLANK) });
    expect(hits.some((h) => /^rheology\.models\.(slant|horizontal)_light_wbm\.default\.res\[3\]\.measuredPa = /.test(h))).toBe(true);
  }, 300000);
  it('NEGATIVE CONTROL: the same sweep finds hb_n once the capstone mud is typed', () => {
    const t = G.leakTargets([{ tier: 'beginner', key: 'hb_n', value: hbN.expected, tol: hbN.tol }], { shifts: SI_SHIFTS });
    const over = { fann: L.CAPSTONE_FANN, densityKgM3: L.CAPSTONE_DENSITY_KGM3 };
    expect(G.defaultStateHits({ targets: t, modes: views(over) }).some((h) => h.startsWith('rheology.models.'))).toBe(true);
  }, 300000);
  const lessons = K.lessonsOf('hydraulics');
  const sources = K.sourcesOf('src/components/course/panels/hydraulics');
  const shapes = K.renderingsOf('hb_n', hbN.expected);
  it('no lesson and no panel source carries hb_n in any string shape, or a number within its tol', () => {
    expect(shapes.length).toBeGreaterThan(5);
    [...lessons, ...sources].forEach(({ file, text }) => {
      expect(K.leaksIn(text, shapes), file).toEqual([]);
      expect(K.nearValuesIn(text, [hbN]), file).toEqual([]);
    });
  });
  it('NEGATIVE CONTROL: a lesson with the value planted is caught', () => {
    const planted = `${lessons[0].text}\nThe Herschel-Bulkley n of the new mud is ${hbN.expected.toFixed(6)}.`;
    expect(K.leaksIn(planted, shapes).length).toBeGreaterThan(0);
    expect(K.nearValuesIn(planted, [hbN]).length).toBeGreaterThan(0);
  });
  it('the working-the-capstone lesson names the new field', () => {
    const l02 = lessons.find((l) => l.file.endsWith('beginner/m06-the-associate-reading/l02-working-the-capstone.md'));
    expect(l02.text).toContain('2. The Herschel-Bulkley flow behaviour index n.');
    expect(l02.text).not.toMatch(/yield stress in pascals/);
    expect(l02.text).not.toMatch(/[\u2013\u2014]/);
  });
});
