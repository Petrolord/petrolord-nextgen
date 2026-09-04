// Every value the DR11 lab exposes is pinned against the vendored engine's own
// golden, and so are the teaching CLAIMS. A course that asserts its numbers but
// not its arguments can have its argument quietly inverted and still pass.

import { describe, it, expect } from 'vitest';
import * as L from './integrityLab.js';

const G = L.GOLDEN;
const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the published case reproduces its golden', () => {
  it('the barrier envelope and the well category', () => {
    const v = L.verifyPublished();
    expect(v.primary.status).toBe(G.barrier.primaryStatus);
    expect(v.secondary.status).toBe(G.barrier.secondaryStatus);
    expect(v.category).toBe(G.barrier.category);
    expect(v.reason).toBeTruthy();
  });

  it('the whole published category table, row for row', () => {
    // The golden publishes 16 rows. The engine has to reproduce every one of
    // them, not just the case the fixture happens to sit on.
    expect(G.categoryTable).toHaveLength(16);
    for (const row of G.categoryTable) {
      expect(L.wellCategory({
        primary: row.primary, secondary: row.secondary,
        flowPotential: row.flowPotential ?? true,
      }).category).toBe(row.category);
    }
  });

  it('the MAASP row', () => {
    near(L.publishedMaasp().rows[0].allowSurfacePa, G.annulus.maaspFixtureAllowPa, 5e-6);
  });

  it('MAWOP, its governing candidate and every row', () => {
    const m = L.publishedMawop();
    expect(m.governing).toBe(G.annulus.mawop.governing);
    near(m.mawopPa, G.annulus.mawop.mawopPa, 5e-6);
    expect(m.rows).toHaveLength(G.annulus.mawop.rows.length);
    for (const golden of G.annulus.mawop.rows) {
      const row = m.rows.find((r) => r.name === golden.name);
      expect(row, `no row named ${golden.name}`).toBeTruthy();
      near(row.allowSurfacePa, golden.allowSurfacePa, 5e-6);
    }
  });

  it('the balanced plug, every reported value', () => {
    const p = L.publishedPlug();
    for (const key of ['slurryM3', 'balancedHeightM', 'spacerBehindM3', 'displacementM3',
      'asPumpedTopMdM', 'pluggedTopMdM', 'lengthM', 'cHoleM2', 'cAnnM2', 'cInM2']) {
      expect(G.plug[key], `golden has no ${key}`).toBeDefined();
      near(p[key], G.plug[key], Math.max(Math.abs(G.plug[key]) * 5e-9, 5e-9));
    }
  });

  it('the abandonment programme', () => {
    // The engine and its golden agree on every VALUE and disagree on two key
    // NAMES: the engine returns `pass` and a `surfacePlug` object, while the
    // oracle serialised them as `programPass` and `surfacePlugPass`. That is a
    // serialisation choice in the Python oracle rather than a behaviour
    // difference, and it is mapped here rather than papered over, so a future
    // reader can see the two names refer to one thing.
    const prog = L.publishedProgram();
    expect(prog.pass).toBe(G.program.programPass);
    expect(prog.surfacePlug.pass).toBe(G.program.surfacePlugPass);
    expect(prog.zoneCompliance).toHaveLength(G.program.zoneCompliance.length);
    for (const golden of G.program.zoneCompliance) {
      const z = prog.zoneCompliance.find((x) => x.zone === golden.zone);
      expect(z, `no zone ${golden.zone}`).toBeTruthy();
      expect(z.pass).toBe(golden.passZone);
      expect(z.primaryQualifying).toEqual(golden.primaryQualifying);
      expect(z.secondaryQualifying).toEqual(golden.secondaryQualifying);
      expect(z.topMdM).toBe(golden.topMdM);
      expect(z.required).toBe(golden.required);
    }
    // and the programme fails overall while its surface plug passes, which is
    // the case the Expert tier is built on: a compliant surface phase does not
    // rescue a zone that has only one qualifying barrier.
    expect(prog.pass).toBe(false);
    expect(prog.surfacePlug.pass).toBe(true);
  });
});

describe('the claims the Associate tier makes', () => {
  it('the WORST element sets the whole envelope', () => {
    // Note the vocabulary shift: an ELEMENT is verified, degraded, failed or
    // not-verified, while an ENVELOPE is intact, degraded or failed. All
    // verified elements give an INTACT envelope, and one bad element drags the
    // envelope down to match it.
    const map = { verified: 'intact', degraded: 'degraded', failed: 'failed', 'not-verified': 'degraded' };
    for (const row of L.statusSweep('verified')) {
      expect(row.primary).toBe(map[row.status]);
      expect(row.secondary).toBe('intact');
    }
  });

  it('not-verified DEGRADES rather than being ignored', () => {
    // The most consequential rule on this tier. An element nobody has checked
    // is not a working barrier, it is an unknown, and the standard treats an
    // unknown as a degradation. If a future edit made it pass through as
    // verified, an unverified well would read as sound.
    const row = L.statusSweep('verified').find((r) => r.status === 'not-verified');
    expect(row.primary).toBe('degraded');
    expect(row.primary).not.toBe('intact');
  });

  it('flow potential stops the secondary envelope being read at all', () => {
    // Written from the engine after a first draft claimed the flag only bites
    // when the second envelope is MISSING. It bites much wider than that: the
    // no-flow branch returns on the PRIMARY alone, so the flag changes the
    // answer wherever the secondary is worse than the primary. Twelve of the
    // sixteen states move.
    const moved = L.categorySweep(true).filter((row) => {
      const off = L.wellCategory({ primary: row.primary, secondary: row.secondary, flowPotential: false });
      return off.category !== row.category.category;
    });
    expect(moved.length).toBeGreaterThan(8);
    // the relaxation that matters: one intact envelope suffices when nothing
    // can flow to surface
    expect(L.wellCategory({ primary: 'intact', secondary: 'empty', flowPotential: true }).category).toBe('orange');
    expect(L.wellCategory({ primary: 'intact', secondary: 'empty', flowPotential: false }).category).toBe('green');
  });

  it('an EMPTY envelope is never green, in either branch', () => {
    // The second fails-open case on this function. The no-flow branch used to
    // fall through to green for an empty primary, so a well with nothing
    // recorded in it came back clean and the reason named a barrier that did
    // not exist. Fixed in petrolord-engines PR #105.
    for (const flowPotential of [true, false]) {
      for (const secondary of L.ENVELOPE_STATUSES) {
        expect(L.wellCategory({ primary: 'empty', secondary, flowPotential }).category).not.toBe('green');
      }
    }
    expect(L.wellCategory({ primary: 'empty', secondary: 'empty', flowPotential: false }).reason)
      .toMatch(/No barrier envelope recorded/);
  });

  it('the two vocabularies are different, and the engine keeps them apart', () => {
    // An ELEMENT is verified, degraded, failed or not-verified. An ENVELOPE is
    // intact, degraded, failed or empty. Mixing them is the obvious mistake,
    // and in an integrity engine the dangerous direction is a wrong input that
    // reads as safe. envelopeStatus refuses an unknown ELEMENT status, and
    // wellCategory refuses an unknown ENVELOPE status, so neither can be
    // talked into a reassuring answer by the wrong word.
    expect(() => L.envelopeStatus([{ name: 'X', status: 'intact' }])).toThrow();
    expect(() => L.wellCategory({ primary: 'verified', secondary: 'verified' })).toThrow();
    expect(() => L.wellCategory({ primary: 'not-verified', secondary: 'intact' })).toThrow();
    // and the correct vocabulary still works
    expect(L.wellCategory({ primary: 'intact', secondary: 'intact' }).category).toBe('green');
  });

  it('every status pair yields a category, with no gaps', () => {
    const rows = L.categorySweep();
    expect(rows).toHaveLength(L.ENVELOPE_STATUSES.length ** 2);
    for (const r of rows) {
      expect(typeof r.category.category).toBe('string');
      expect(r.category.reason).toBeTruthy();
    }
  });

  it('the seat count is a real quantity even when no element is common', () => {
    const s = L.seatCount();
    expect(s.physical).toBe(L.publishedElements().length);
    expect(s.seats).toBe(s.primary + s.secondary);
    expect(s.overcount).toBe(s.common);
  });
});

describe('the claims the Professional tier makes', () => {
  it('the RP 90 role factors really do derate, and by their stated amounts', () => {
    const sweep = L.factorSweep();
    const at = (role) => sweep.find((r) => r.role === role);
    expect(at('outer-casing-burst').factor).toBe(0.5);
    expect(at('inner-casing-burst').factor).toBe(0.8);
    expect(at('inner-tubing-collapse').factor).toBe(0.75);
    // and a lower factor really does give a lower allowable
    expect(at('outer-casing-burst').result.mawopPa)
      .toBeLessThan(at('inner-casing-burst').result.mawopPa);
    // and rating, the undereated role, is the most permissive of all
    expect(at('rating').factor).toBe(1);
  });

  it('a heavier annulus fluid LOWERS the allowable, one for one with head', () => {
    const rows = L.densitySweep();
    for (let i = 1; i < rows.length; i += 1) {
      expect(rows[i].rows.rows[0].allowSurfacePa)
        .toBeLessThan(rows[i - 1].rows.rows[0].allowSurfacePa);
    }
    // the drop between two densities is exactly the change in head
    const a = rows[0];
    const b = rows[rows.length - 1];
    const dRho = b.annulusFluidDensityKgM3 - a.annulusFluidDensityKgM3;
    const tvd = L.MAASP_ELEMENTS[0].tvdM;
    near(a.rows.rows[0].allowSurfacePa - b.rows.rows[0].allowSurfacePa, dRho * L.G * tvd, 5e-6);
  });

  it('the backup column on the far side pushes back', () => {
    // A rating is a differential across a wall. Raising the density on the FAR
    // side raises the allowable here, which is the opposite direction from
    // raising the density on this side.
    const base = L.publishedMaasp().rows[0].allowSurfacePa;
    const heavier = L.maaspRows({
      annulusFluidDensityKgM3: L.PARAMS.annulusFluidDensityKgM3,
      elements: [{ ...L.MAASP_ELEMENTS[0], backupDensityKgM3: L.MAASP_ELEMENTS[0].backupDensityKgM3 + 500 }],
    }).rows[0].allowSurfacePa;
    expect(heavier).toBeGreaterThan(base);
  });

  it('a negative row clamps the reported MAASP to zero and says so', () => {
    // Hydrostatic alone can bust a rating. The engine must not report a
    // negative allowable as if it were a pressure you could apply.
    const out = L.maaspRows({
      annulusFluidDensityKgM3: 1900,
      elements: [{ name: 'thin', limitPa: 1e6, tvdM: 2500, backupDensityKgM3: 0, factor: 0.75 }],
    });
    expect(out.rows[0].allowSurfacePa).toBeLessThan(0);
    expect(out.maaspPa).toBe(0);
    expect(out.negative).toBe(true);
  });

  it('the governing row is the MINIMUM over the rows, not the first', () => {
    // A selection over rows is LOGIC, and verifying the rows does not verify
    // the reduction. A sibling course shipped a worst-row reduction that
    // silently returned the first row on every case that passed.
    const m = L.publishedMawop();
    const min = m.rows.reduce((a, b) => (b.allowSurfacePa < a.allowSurfacePa ? b : a));
    expect(m.governing).toBe(min.name);
    expect(m.governing).not.toBe(m.rows[0].name);
    near(m.mawopPa, min.allowSurfacePa, 5e-6);
  });
});

describe('the claims the Expert tier makes', () => {
  it('AT ZERO EXCESS the settled plug top IS the design plug top, exactly', () => {
    // The identity the whole tier rests on, and the anchor for every excess
    // figure below it.
    const zero = L.excessSweep([0])[0];
    near(zero.pluggedTopMdM, L.PARAMS.plugFixture.plugTopMdM, 5e-9);
  });

  it('but the plug still SETTLES at zero excess, and that surprised the author', () => {
    // Written from the engine after a first draft asserted the settle was zero
    // whenever the excess was. It is not. The as-pumped column stands in the
    // annulus PLUS the stinger bore; once the stinger is pulled the same
    // slurry redistributes across the FULL hole bore, which is wider, so the
    // top drops. On this fixture it drops 15.36 m with no excess at all.
    // Excess adds to that, it does not cause it. A reader told that settling
    // is an excess effect would tighten the excess and expect the gap to go
    // away, and it would not.
    const zero = L.excessSweep([0])[0];
    expect(zero.settleM).toBeGreaterThan(15);
    expect(zero.settleM).toBeLessThan(16);
    expect(zero.pluggedTopMdM).toBeGreaterThan(zero.asPumpedTopMdM);
  });

  it('excess drives the finished plug DEEPER than the balanced column suggests', () => {
    const rows = L.excessSweep();
    for (const r of rows) {
      if (r.excess === 0) continue;
      expect(r.pluggedTopMdM).toBeGreaterThan(r.asPumpedTopMdM);
      expect(r.settleM).toBeGreaterThan(0);
    }
    // and more excess settles further
    const withExcess = rows.filter((r) => r.excess > 0);
    for (let i = 1; i < withExcess.length; i += 1) {
      expect(withExcess[i].settleM).toBeGreaterThan(withExcess[i - 1].settleM);
    }
  });

  it('slurry volume is linear in one plus the excess', () => {
    const rows = L.excessSweep([0, 0.5]);
    near(rows[1].slurryM3 / rows[0].slurryM3, 1.5, 5e-9);
  });

  it('the length rule has two thresholds and a foundation moves between them', () => {
    const rows = L.ruleSweep();
    const at = (lengthM, foundation) => rows.find((r) => r.lengthM === lengthM && r.foundation === foundation);
    expect(at(60, 'none').pass).toBe(false);
    expect(at(60, 'tagged').pass).toBe(true);
    expect(at(40, 'tagged').pass).toBe(false);
    expect(at(100, 'none').pass).toBe(true);
    // and the thresholds are exactly the documented ones
    expect(at(50, 'tagged').pass).toBe(true);
    expect(at(100, 'none').pass).toBe(true);
    expect(L.D010_DEFAULT_RULES.plugMinLengthM).toBe(100);
    expect(L.D010_DEFAULT_RULES.plugMinLengthOnFoundationM).toBe(50);
  });

  it('a log is worth 70 metres of annular cement', () => {
    const rows = L.annularSweep();
    const at = (lengthM, verifiedByLog) => rows.find((r) => r.lengthM === lengthM && r.verifiedByLog === verifiedByLog);
    expect(at(45, false).pass).toBe(false);
    expect(at(45, true).pass).toBe(true);
    expect(L.D010_DEFAULT_RULES.annularCementUnverifiedMinM
      - L.D010_DEFAULT_RULES.annularCementVerifiedMinM).toBe(70);
  });
});
