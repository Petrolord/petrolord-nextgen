// W5 (part c), section 3 for mbal: pick A on the beginner tier (the ISAN tank,
// stated in the brief and typed into the tank explorer's Your tank mode) and
// pick B on intermediate and advanced (the lessons work teaching variants, the
// panels open off the capstone settings; keys unchanged).
//
//   KEYS. The six ISAN keys are regenerated through the panel lab
//   (typedTankInputs, runTank), which calls the vendored material-balance
//   engine, and equal the spec and the migration; the stripped keys still
//   equal the engine on the capstone settings.
//   LEAKS. No panel source, the page or any mbal lesson carries a graded value
//   in any string shape or a decimal inside a precise graded tolerance; every
//   panel's opening state lands on no graded value.
//   LABEL. The W1 open-book label and lesson notes are gone.
//   CONTROLS. Every check goes red on a planted leak.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  REPO, renderingsOf, leaksIn, nearValuesIn, lessonsOf, sourcesOf, migrationFields, W1_LABEL, W1_LESSON_NOTE, TIERS,
} from '@/lib/w5cGuardKit';
import * as L from './tankLab';
import { gradedKeys, ISAN } from '../../../../../docs/graded-field-audit/w5c/mbal/case.mjs';

const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/graded-field-audit/w5c/mbal.json'), 'utf8'));
const FIELDS = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/graded-field-audit/w5c/mbal/fields.json'), 'utf8'));
const MIG = '20261028c_w5_mbal.sql';
const LIVE = Object.fromEntries(TIERS.map((t) => [t, migrationFields(MIG, 'mbal', t)]));
const ALL = TIERS.flatMap((t) => LIVE[t].fields.map((f) => ({ ...f, tier: t })));

const PANEL_DIR = 'src/components/course/panels/mbal';
const PAGE = 'src/pages/apps/MbalLearningPage.jsx';
const SOURCES = sourcesOf(PANEL_DIR, [PAGE]);
const LESSONS = lessonsOf('mbal');
const RENDER = ALL.filter((f) => !Number.isInteger(f.expected)).flatMap((f) => renderingsOf(f.key, f.expected));

// Printed numbers inside a precise graded tolerance that are not the answer.
const ALLOW = {
  // "Table 9.3" (Dake's table number) and 9.31322574615479e-7 (a floating
  // point span in the pot plot lesson): not dimensionless pressures.
  pd_finite_100: ['9.3', '9.31322574615479'],
  // The teaching aquifer's time constant in days (308.98...) and the lower
  // bound of the default reservoir-radius box in feet (306.67): other
  // quantities near the Dake oil in place in MMSTB.
  dake_ooip_mmstb: ['308.98486314989134', '306.666666666667'],
};

describe('W5c mbal: keys and briefs', () => {
  it('regenerates the six ISAN keys through the engine; they equal the spec and the migration', () => {
    expect(gradedKeys().beginner).toEqual(FIELDS.beginner);
    expect(LIVE.beginner.fields.map((f) => [f.key, f.expected, f.tol])).toEqual(FIELDS.beginner.map((f) => [f.key, f.expected, f.tol]));
    expect(LIVE.beginner.prompt).toBe(SPEC.tiers.beginner.prompt);
    // every surveyed value the learner types is in the brief
    for (const r of ISAN.rows.slice(1)) for (const x of [r.p, r.np, r.bo]) expect(LIVE.beginner.prompt, String(x)).toContain(String(x));
  });

  it('every tier drops the W1 label; the stripped keys still equal the engine at the capstone settings', () => {
    for (const t of TIERS) expect(LIVE[t].prompt, t).not.toMatch(W1_LABEL);
    const v = (t, k) => LIVE[t].fields.find((f) => f.key === k).expected;
    const m = L.fetkovichMarch();
    const close = (a, b, what) => expect(Math.abs(a - b), what).toBeLessThan(1e-9 * Math.max(1, Math.abs(b)));
    close(m.constants.Wei, v('intermediate', 'wei_bbl'), 'Wei');
    close(m.constants.J, v('intermediate', 'j_bbl_d_psi'), 'J');
    close(m.constants.decay, v('intermediate', 'decay_365'), 'decay');
    close(m.We[m.We.length - 1] / 1e6, v('intermediate', 'we_final_mmbbl'), 'We');
    const pot = L.runEkeneTank({ aquiferModel: 'pot' }).result;
    close(pot.estimated_ooip_stb, v('intermediate', 'pot_ooip_stb'), 'pot OOIP');
    close(pot.r_squared, v('intermediate', 'pot_r2'), 'pot r2');
    const dake = L.runDakeTank({ aquifer: 'finite' });
    close(dake.ooip_mmstb, v('advanced', 'dake_ooip_mmstb'), 'Dake OOIP');
    close(dake.we_mmrb, v('advanced', 'dake_we_mmrb'), 'Dake We');
    close(L.pDFinite(100, 5), v('advanced', 'pd_finite_100'), 'pD');
    const cd = L.combinationDrive();
    close(cd.We, v('advanced', 'a111_we_bbl'), 'a111 We');
    close(cd.byNetWithdrawal.WDI, v('advanced', 'a111_wdi'), 'a111 WDI');
    close(cd.byNetWithdrawal.DDI, v('advanced', 'a111_ddi'), 'a111 DDI');
  });
});

describe('W5c mbal: nothing prints a graded answer before the learner works', () => {
  it('sweeps real sources and lessons', () => {
    expect(SOURCES.map((s) => s.file)).toEqual([
      `${PANEL_DIR}/AquiferExplorer.jsx`, `${PANEL_DIR}/PdExplorer.jsx`, `${PANEL_DIR}/TankExplorer.jsx`, `${PANEL_DIR}/tankLab.js`, PAGE,
    ]);
    expect(LESSONS.length).toBeGreaterThan(60);
    expect(ALL).toHaveLength(18);
    expect(RENDER.length).toBeGreaterThan(40);
  });

  it('no source or lesson carries a graded value in any shape, or a decimal inside a precise graded tolerance', () => {
    const hits = [];
    for (const s of [...SOURCES, ...LESSONS]) for (const h of leaksIn(s.text, RENDER)) hits.push(`${s.file}: ${h.key} as ${h.text} (${h.shape})`);
    for (const l of LESSONS) for (const h of nearValuesIn(l.text, ALL, ALLOW)) hits.push(`${l.file}: ${h.text} within tol of ${h.key}`);
    expect(hits).toEqual([]);
  });

  it('every panel mode at its opening settings lands on no graded value', () => {
    const seen = openingStateNumbers();
    expect(seen.length).toBeGreaterThan(40);
    const hits = [];
    for (const f of ALL) for (const x of seen) if (Math.abs(x.v - f.expected) <= f.tol) hits.push(`${f.tier}/${f.key} ~ ${x.what} ${x.v}`);
    expect(hits).toEqual([]);
  });

  it('the W1 open-book lesson note is gone from every mbal tier', () => {
    expect(LESSONS.filter((l) => W1_LESSON_NOTE.test(l.text)).map((l) => l.file)).toEqual([]);
  });
});

describe('W5c mbal: negative controls', () => {
  it('a graded value planted at full float, nine digits or six decimals is caught', () => {
    const missed = [];
    for (const f of ALL.filter((x) => !Number.isInteger(x.expected))) {
      const r = RENDER.filter((x) => x.key === f.key);
      if (!r.length) continue;
      for (const shown of [String(f.expected), f.expected.toPrecision(9), f.expected.toFixed(6)]) {
        if (shown.replace('-', '').length < 6 || !shown.includes('.')) continue;
        if (!leaksIn(`x = ${shown}`, r).length) missed.push(`${f.key}: ${shown}`);
      }
    }
    expect(missed).toEqual([]);
  });

  it('an opening state at the capstone settings is caught (the pD explorer at reD 5, the aquifer explorer at the book geometry)', () => {
    const f = ALL.find((x) => x.key === 'pd_finite_100');
    const g = ALL.find((x) => x.key === 'j_bbl_d_psi');
    const planted = [...openingStateNumbers(), { what: 'pD reD 5', v: L.pDFinite(100, 5) }, { what: 'J book', v: L.fetkovichConstants().J }];
    expect(planted.some((x) => Math.abs(x.v - f.expected) <= f.tol)).toBe(true);
    expect(planted.some((x) => Math.abs(x.v - g.expected) <= g.tol)).toBe(true);
    expect(nearValuesIn('the fit reached 0.99949 on the pot run', ALL.filter((x) => x.key === 'pot_r2'))).toHaveLength(1);
  });
});

// Every number the three panels show in each mode at its opening settings.
function openingStateNumbers() {
  const out = [];
  const add = (what, v) => { if (Number.isFinite(v)) out.push({ what, v }); };
  const tank = (what, run) => {
    for (const r of run.rows) { add(`${what} F`, r.F_rb); add(`${what} Eo`, r.Eo_rb_stb); add(`${what} Efw`, r.Efw_rb); add(`${what} Et`, r.Et_rb); add(`${what} F/Et`, r.F_over_Et); }
    const x = run.result;
    for (const k of ['estimated_ooip_stb', 'r_squared', 'regression_intercept', 'final_ddi', 'final_sdi', 'final_wdi', 'final_drive_index_sum']) add(`${what} ${k}`, x[k]);
    add(`${what} efw share`, run.last.efwShare * 100);
  };
  tank('ekene', L.runEkeneTank());
  tank('typed default', L.runTank(L.typedTankInputs({
    pi: L.EKENE.inputs.initial_pressure_psia, swi: L.EKENE.inputs.initial_water_saturation,
    cf: L.EKENE.inputs.formation_compressibility_psi, cw: L.EKENE.inputs.water_compressibility_psi,
    rows: L.EKENE.inputs.production_data.map((r) => ({ p: r.pressure_psia, np: r.cum_oil_stb, bo: r.bo_rb_stb })),
  })));
  const dake = L.runDakeTank({ aquifer: 'none' });
  add('dake none ooip', dake.ooip_mmstb); add('dake none we', dake.we_mmrb); add('dake none r2', dake.result.r_squared);
  // the aquifer explorer's teaching geometry
  const aq = L.fetkovichMarch({ h_ft: 80, phi: 0.22, ct_psi: 6e-6, pi_psia: 2740, k_md: 150, theta_deg: 180, muw_cp: 0.55, re_ft: 9200, ra_ft: 36800, reD: 4, dt_days: 365 });
  for (const k of ['WiFull', 'WiWedge', 'fAngle', 'Wei', 'denom', 'J', 'JpiOverWei', 'decay']) add(`aquifer ${k}`, aq.constants[k]);
  aq.We.forEach((w, i) => add(`aquifer We ${i}`, w / 1e6));
  // the pD explorer at reD 10
  for (const r of L.pdSweep(10, [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 25, 40, 50, 75, 100])) { add(`pd ${r.tD} finite`, r.finite); add(`pd ${r.tD} ratio`, r.ratio); add(`pd ${r.tD} line`, r.infinite); }
  return out;
}
