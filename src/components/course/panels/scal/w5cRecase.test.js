// W5 (part c), section 3 for scal: pick A on the beginner tier (the OKORO
// sand, typed into the displacement explorer's own-case mode) and pick B on
// intermediate and advanced (the lessons work nearby teaching cases and the
// panels open off the capstone settings; keys unchanged).
//
//   KEYS. The six beginner keys are regenerated here through the panel lab
//   (displacementCase, btDaysFor), which calls the vendored fractional-flow
//   engine, and must equal the spec and the committed migration.
//   LEAKS. No panel source, the learning page or any scal lesson carries any of
//   the eighteen graded values in any string shape, or a number inside a graded
//   tolerance; no panel's opening state (every mode at its defaults) lands on a
//   graded value.
//   LABEL. The W1 open-book label and lesson notes are gone.
//   CONTROLS. Every check goes red on a planted leak.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  REPO, renderingsOf, leaksIn, nearValuesIn, lessonsOf, sourcesOf, migrationFields, W1_LABEL, W1_LESSON_NOTE, TIERS,
} from '@/lib/w5cGuardKit';
import * as L from './scalLab';
import { gradedKeys, OKORO } from '../../../../../docs/graded-field-audit/w5c/scal/case.mjs';

const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/graded-field-audit/w5c/scal.json'), 'utf8'));
const FIELDS = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/graded-field-audit/w5c/scal/fields.json'), 'utf8'));
const MIG = '20261028c_w5_scal.sql';
const LIVE = Object.fromEntries(TIERS.map((t) => [t, migrationFields(MIG, 'scal', t)]));
const ALL = TIERS.flatMap((t) => LIVE[t].fields.map((f) => ({ ...f, tier: t })));

const PANEL_DIR = 'src/components/course/panels/scal';
const PAGE = 'src/pages/apps/ScalLearningPage.jsx';
const SOURCES = sourcesOf(PANEL_DIR, [PAGE]);
const LESSONS = lessonsOf('scal');
const RENDER = ALL.filter((f) => !Number.isInteger(f.expected)).flatMap((f) => renderingsOf(f.key, f.expected));

// Printed numbers inside a graded tolerance that are not the answer, each with
// its reason. The sweep reports them; anything not listed fails.
const ALLOW = {
  // The book's printed J at Sw 0.2. The brief tells the learner to scale THIS
  // printed column for field 3, so it is a stated input; by the original
  // design it also sits inside field 2's tolerance (both legitimate versions
  // of J pass). Residual recorded in w5c/scal.json.
  j_at_sw02: ['0.169'],
  // A height in metres on the Ekene ladder (Sw 0.9 reached 0.4835 m above the
  // contact) and a grid saturation: different quantities that happen to sit
  // near the dimensionless column average.
  sw_avg_crest_column: ['0.48353582519437843', '0.4833333333333333'],
  // A J value on the drift lesson's toe (0.5769 at Sw* 0.4333): a different
  // quantity near the polymer efficiency.
  polymer_ed_bt: ['0.576923076923077'],
};

describe('W5c scal: keys and briefs', () => {
  it('regenerates the six OKORO keys through the engine; they equal the spec and the migration', () => {
    const keys = gradedKeys();
    expect(keys.beginner).toEqual(FIELDS.beginner);
    expect(LIVE.beginner.fields.map((f) => [f.key, f.expected, f.tol])).toEqual(FIELDS.beginner.map((f) => [f.key, f.expected, f.tol]));
    expect(LIVE.beginner.prompt).toBe(SPEC.tiers.beginner.prompt);
    // the brief states every input the regeneration uses
    for (const v of Object.values(OKORO)) expect(LIVE.beginner.prompt, String(v)).toContain(String(v));
  });

  it('the OKORO mobility ratio is the closed form, straight off the engine inputs', () => {
    const m = FIELDS.beginner.find((f) => f.key === 'okoro_m_ratio').expected;
    expect(L.displacementCase(OKORO).M).toBe(m);
  });

  it('every tier drops the W1 open-book label; the stripped tiers keep their keys', () => {
    for (const t of TIERS) expect(LIVE[t].prompt, t).not.toMatch(W1_LABEL);
    expect(LIVE.intermediate.fields.map((f) => f.key)).toEqual(
      ['lab_j_per_psi', 'j_at_sw02', 'res_pc_sw02', 'h_entry_m', 'fwl_m', 'sw_at_crest']);
    expect(LIVE.advanced.fields.map((f) => f.key)).toEqual(
      ['fitted_nw_printed_grid', 'avg_refit_a', 'gravity_ed_bt', 'downdip_ed_bt', 'polymer_ed_bt', 'sw_avg_crest_column']);
    // and the stripped keys are still what the engine gives on the capstone settings
    const v = (t, k) => LIVE[t].fields.find((f) => f.key === k).expected;
    const cap = L.reservoirCapillary();
    expect(Math.abs(cap.hEntryM - v('intermediate', 'h_entry_m'))).toBeLessThan(1e-12);
    expect(Math.abs(cap.swAtCrest - v('intermediate', 'sw_at_crest'))).toBeLessThan(1e-12);
    expect(Math.abs(L.averageRefit(0.25).fit.a - v('advanced', 'avg_refit_a'))).toBeLessThan(1e-12);
    expect(Math.abs(L.dipCase(2000, 10).bl.EDbt - v('advanced', 'gravity_ed_bt'))).toBeLessThan(1e-12);
    expect(Math.abs(L.dipCase(2000, -10).bl.EDbt - v('advanced', 'downdip_ed_bt'))).toBeLessThan(1e-12);
    expect(Math.abs(L.polymerCase(4).bl.EDbt - v('advanced', 'polymer_ed_bt'))).toBeLessThan(1e-12);
    expect(Math.abs(L.swAvgCrestColumn(2000) - v('advanced', 'sw_avg_crest_column'))).toBeLessThan(1e-12);
  });
});

describe('W5c scal: nothing prints a graded answer before the learner works', () => {
  it('sweeps real sources and lessons', () => {
    expect(SOURCES.map((s) => s.file)).toEqual([
      `${PANEL_DIR}/DesignExplorer.jsx`, `${PANEL_DIR}/DisplacementExplorer.jsx`, `${PANEL_DIR}/JFunctionExplorer.jsx`,
      `${PANEL_DIR}/scalLab.js`, PAGE,
    ]);
    expect(LESSONS.length).toBeGreaterThan(60);
    expect(ALL).toHaveLength(18);
    expect(RENDER.length).toBeGreaterThan(40);
  });

  it('no source or lesson carries a graded value in any shape, or a number inside a graded tolerance', () => {
    const hits = [];
    for (const s of [...SOURCES, ...LESSONS]) {
      for (const h of leaksIn(s.text, RENDER)) hits.push(`${s.file}: ${h.key} as ${h.text} (${h.shape})`);
    }
    for (const l of LESSONS) {
      for (const h of nearValuesIn(l.text, ALL, ALLOW)) hits.push(`${l.file}: ${h.text} within tol of ${h.key}`);
    }
    expect(hits).toEqual([]);
  });

  it('every panel mode at its opening settings lands on no graded value', () => {
    const seen = openingStateNumbers();
    expect(seen.length).toBeGreaterThan(40);
    const hits = [];
    for (const f of ALL) {
      for (const x of seen) if (Math.abs(x.v - f.expected) <= f.tol) hits.push(`${f.tier}/${f.key} ~ ${x.what} ${x.v}`);
    }
    expect(hits).toEqual([]);
  });

  it('the W1 open-book lesson note is gone from every scal tier', () => {
    expect(LESSONS.filter((l) => W1_LESSON_NOTE.test(l.text)).map((l) => l.file)).toEqual([]);
  });
});

describe('W5c scal: negative controls', () => {
  it('a graded value planted at full float, nine digits or six decimals is caught', () => {
    const missed = [];
    for (const f of ALL.filter((x) => !Number.isInteger(x.expected))) {
      const r = RENDER.filter((x) => x.key === f.key);
      if (!r.length) continue;
      for (const t of [`x = ${f.expected}`, `x = ${f.expected.toPrecision(9)}`, `reads ${f.expected.toFixed(6)}`]) {
        if (!leaksIn(t, r).length) missed.push(`${f.key}: ${t}`);
      }
    }
    expect(missed).toEqual([]);
  });

  it('a nearby worked value inside a tolerance is caught (the ladder-row shape)', () => {
    const f = ALL.find((x) => x.key === 'gravity_ed_bt');
    expect(nearValuesIn(`| 1000 | 0.019441087697622077 | 0.6376 | ${(f.expected + f.tol / 2).toFixed(10)} |`, [f])).toHaveLength(1);
    expect(nearValuesIn(`| 500 | 0.038882175395244155 | 0.638 | 0.5102855131161252 |`, [f])).toHaveLength(0);
  });

  it('an opening state on the capstone settings is caught', () => {
    const f = ALL.find((x) => x.key === 'polymer_ed_bt');
    const planted = [...openingStateNumbers(), { what: 'polymer at 4', v: L.polymerCase(4).bl.EDbt }];
    expect(planted.some((x) => Math.abs(x.v - f.expected) <= f.tol)).toBe(true);
  });
});

// Every number each panel shows in each mode at its opening settings.
function openingStateNumbers() {
  const out = [];
  const add = (what, v) => { if (Number.isFinite(v)) out.push({ what, v }); };
  const disp = (what, r) => {
    add(`${what} M`, r.M); add(`${what} Swf`, r.bl.Swf); add(`${what} fwf`, r.bl.fwf); add(`${what} Qi`, r.bl.QiBt);
    add(`${what} SwAvg`, r.bl.SwAvgBt); add(`${what} ED`, r.bl.EDbt); add(`${what} EDmax`, r.bl.EDmax);
  };
  // Displacement explorer: Ekene design (and its typed form), the textbook preset
  const e = L.ekeneDisplacement();
  disp('displacement', e); add('displacement days', L.btDaysAt(8000, e.bl.QiBt));
  disp('textbook', L.textbookCase());
  // J-function explorer: all plugs and each plug at Swirr 0.25, field tiles on the teaching rock
  for (const idx of [null, 0, 1, 2]) {
    const fit = L.fitPlugJ(idx, 0.25);
    add(`jfit ${idx} a`, fit.a); add(`jfit ${idx} b`, fit.b); add(`jfit ${idx} r2`, fit.r2Log);
  }
  const cap = L.reservoirCapillary(L.TEACHING_ROCK);
  for (const k of ['psiPerJ', 'pcEntryPsi', 'hEntryM', 'fwlM', 'swAtCrest']) add(`jfunction ${k}`, cap[k]);
  // Design explorer: each mode at its opening settings, and the context tiles
  const { fit } = L.fitLabGrid();
  add('fit nw', fit.params.nw); add('fit no', fit.params.no);
  const dip = L.dipCase(3000, 0);
  disp('dip default', dip); add('dip G', dip.gCoef);
  disp('polymer default', L.polymerCase(2));
  add('avg refit a', L.averageRefit(L.TEACHING_SWIRR).fit.a);
  add('crest column', L.swAvgCrestColumn(2000, L.TEACHING_ROCK));
  return out;
}
