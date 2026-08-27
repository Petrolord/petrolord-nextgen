// Pins the material-balance teaching lab to the RC2 truth digest. All EIGHTEEN
// capstone values across the three tiers are asserted here, so a drift in the
// vendored engine or fixtures fails the build before it can strand a live
// capstone.

import { describe, it, expect } from 'vitest';
import {
  runEkeneTank, reconciliation, fetkovichConstants, fetkovichMarch,
  combinationDrive, pdSweep, pssAsymptote, pD, pDFinite, FIELD, runDakeTank,
} from './tankLab';

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);

describe('Associate capstone: close the Ekene tank', () => {
  const { result, last, rows } = runEkeneTank();

  it('reproduces the last-survey terms', () => {
    expect(rel(last.F_rb, 317926.842484584)).toBeLessThan(1e-12);
    expect(rel(last.Et_rb, 0.0261900809071921)).toBeLessThan(1e-12);
    expect(rel(last.efwShare * 100, 39.2996108949418)).toBeLessThan(1e-12);
  });

  it('recovers the OOIP and closes the line', () => {
    expect(rel(result.estimated_ooip_stb, 12139208.1074968)).toBeLessThan(1e-12);
    expect(result.r_squared).toBeCloseTo(1, 12);
    expect(rel(result.final_ddi, 0.607003891050583)).toBeLessThan(1e-12);
    expect(result.drive_mechanism).toBe('depletion_drive');
    expect(result.aquifer_strength).toBe('none');
  });

  it('F/Et is CONSTANT across every survey, which is what a straight line means', () => {
    const ratios = rows.filter((r) => r.F_over_Et != null).map((r) => r.F_over_Et);
    expect(ratios).toHaveLength(6);
    for (const r of ratios) expect(rel(r, 12139208.1074968)).toBeLessThan(1e-12);
  });

  it('drive indices close to 1', () => {
    expect(result.final_drive_index_sum).toBeCloseTo(1, 9);
    expect(result.final_wdi).toBeCloseTo(0, 12); // no aquifer
  });
});

describe('The reconciliation: two independent routes to one booking', () => {
  it('material balance lands on the geoscience volumetric STOIIP', () => {
    const r = reconciliation();
    expect(r.volumetric).toBe(12139208.107496763);
    expect(rel(r.materialBalance, 12139208.1074968)).toBeLessThan(1e-12);
    // 6.1e-15 relative: geometry and thermodynamics, sharing no inputs.
    expect(r.relativeGap).toBeLessThan(1e-13);
  });
});

describe('Professional capstone: aquifers and the cost of the wrong one', () => {
  it('Fetkovich constants reproduce Ahmed 10-10', () => {
    const c = fetkovichConstants();
    expect(rel(c.Wei, 211934253.721285)).toBeLessThan(1e-12);
    expect(rel(c.J, 116.496154838747)).toBeLessThan(1e-12);
    expect(rel(c.decay, 0.422897624804177)).toBeLessThan(1e-12);
    // The published constants the book prints, matched to its rounding.
    expect(rel(c.WiFull, 28.41e9)).toBeLessThan(0.001);
    expect(rel(c.Wei, 211.9e6)).toBeLessThan(0.001);
    expect(rel(c.J, 116.5)).toBeLessThan(0.001);
  });

  it('the ln(reD) trap is 47 percent wrong', () => {
    const good = fetkovichConstants();
    const bad = fetkovichConstants({ usePseudoSteadyState: false });
    expect(rel(bad.J, 62.2088067813624)).toBeLessThan(1e-12);
    expect((bad.J / good.J - 1) * 100).toBeCloseTo(-46.6001200919709, 9);
  });

  it('the marching scheme reproduces the printed We table', () => {
    const { We, printed } = fetkovichMarch();
    expect(rel(We[We.length - 1] / 1e6, 37.9731544101719)).toBeLessThan(1e-12);
    // ...and matches the book's printed final column within its rounding.
    const printedFinal = printed[printed.length - 1].We_MMbbl;
    expect(rel(We[We.length - 1] / 1e6, printedFinal)).toBeLessThan(0.001);
  });

  it('an unnecessary pot aquifer wrecks the OOIP while reporting R2 0.999', () => {
    const { result } = runEkeneTank({ aquiferModel: 'pot' });
    expect(rel(result.estimated_ooip_stb, -516449.043355256)).toBeLessThan(1e-9);
    expect(rel(result.r_squared, 0.999485673716372)).toBeLessThan(1e-9);
    // The headline: a NEGATIVE OOIP dressed in an excellent R2.
    expect(result.estimated_ooip_stb).toBeLessThan(0);
    expect(result.r_squared).toBeGreaterThan(0.999);
  });
});

describe('Expert capstone: the finite aquifer and the benchmark', () => {
  it('pD finite at tD 100 and its PSS asymptote', () => {
    expect(rel(pDFinite(100, 5), 9.30886079703705)).toBeLessThan(1e-9);
    expect(rel(pssAsymptote(100, 5), 9.19277124576743)).toBeLessThan(1e-12);
    // Converging on the asymptote from above as the transient dies.
    expect(pDFinite(100, 5)).toBeGreaterThan(pssAsymptote(100, 5));
  });

  it('the two pD families disagree MOST at early time, not least', () => {
    const s = pdSweep(5);
    const early = s.find((r) => r.tD === 0.1);
    const mid = s.find((r) => r.tD === 5);
    const late = s.find((r) => r.tD === 100);
    expect(early.ratio).toBeGreaterThan(20);   // line source is a point source
    expect(mid.ratio).toBeLessThan(1.2);       // closest in the mid transient
    expect(late.ratio).toBeGreaterThan(3);     // finite boundary bites
  });

  it('Ahmed 11-1 combination-drive terms and the denominator convention', () => {
    const c = combinationDrive();
    expect(rel(c.We, 411281.250000001)).toBeLessThan(1e-9);
    expect(rel(c.byNetWithdrawal.WDI, 0.211250877090399)).toBeLessThan(1e-12);
    expect(c.byNetWithdrawal.sum).toBeCloseTo(1, 12);
    // Only the NET-withdrawal convention reproduces the book. Compare the way
    // you compare against ANY printed value whose intermediate rounding you
    // cannot see: agreement to within one unit in the last printed place. A
    // relative tolerance would be asserting against the book's rounding, and
    // an exact round-trip fails on WDI (ours 0.2112508 rounds to 0.2113 while
    // the book prints 0.2112, because it rounded We and A before dividing).
    const ulp = (printed) => Math.pow(10, -(String(printed).split('.')[1] || '').length);
    const agreesWithPrinted = (v, printed) => Math.abs(v - printed) <= ulp(printed);
    expect(agreesWithPrinted(c.byNetWithdrawal.DDI, c.printed.DDI)).toBe(true);
    expect(agreesWithPrinted(c.byNetWithdrawal.SDI, c.printed.SDI_gascap)).toBe(true);
    expect(agreesWithPrinted(c.byNetWithdrawal.WDI, c.printed.WDI)).toBe(true);
    expect(agreesWithPrinted(c.byNetWithdrawal.EDI, c.printed.EDI)).toBe(true);
    // ...and the gross convention does NOT reproduce them, on any of the four.
    expect(agreesWithPrinted(c.byGrossWithdrawal.DDI, c.printed.DDI)).toBe(false);
    // The gross convention looks like a 2.8 percent closure failure and is not.
    expect(c.byGrossWithdrawal.sum).toBeCloseTo(0.971594137029883, 9);
  });
});

describe('Expert capstone: the Dake 9.2 benchmark itself', () => {
  // The first two graded Expert fields come from this run. Before RC2 they were
  // the only capstone values in the course with no test behind them, so a drift
  // in the vendored engine would have stranded a live capstone silently.
  const finite = runDakeTank();

  it('reproduces the two graded Dake fields', () => {
    expect(rel(finite.ooip_mmstb, 307.221409553720)).toBeLessThan(1e-12);
    expect(rel(finite.we_mmrb, 88.0645883139400)).toBeLessThan(1e-12);
    expect(rel(finite.result.r_squared, 0.999975248425736)).toBeLessThan(1e-12);
    expect(finite.result.drive_mechanism).toBe('water_drive_with_depletion');
    expect(finite.result.aquifer_strength).toBe('strong');
  });

  it('sits inside the 3.53 percent the provenance string records for this path', () => {
    const missPct = (Math.abs(finite.ooip_mmstb - 312) / 312) * 100;
    expect(missPct).toBeLessThan(3.53);
    expect(missPct).toBeCloseTo(1.53159950201266, 10);
  });

  it('prices the two counterfactuals the Expert tier teaches', () => {
    // No aquifer at all: the regression buys the pressure history with oil.
    const none = runDakeTank({ aquifer: 'none' });
    expect(rel(none.ooip_mmstb, 532.588241588393)).toBeLessThan(1e-12);
    expect(none.result.warnings ?? []).toHaveLength(0);   // silent, and 225 MMSTB out

    // Infinite-acting solution on a bounded aquifer: influx up, oil down.
    const inf = runDakeTank({ aquifer: 'infinite' });
    expect(rel(inf.ooip_mmstb, 156.177551848366)).toBeLessThan(1e-12);
    expect(rel(inf.we_mmrb, 148.248060002236)).toBeLessThan(1e-12);
    expect(rel(inf.result.r_squared, 0.863239485188882)).toBeLessThan(1e-12);

    // An over-sized aquifer breaks the fit; an under-sized one does not.
    const red3 = runDakeTank({ radiusRatio: 3 });
    expect(rel(red3.ooip_mmstb, 455.567695625077)).toBeLessThan(1e-12);
    expect(red3.result.r_squared).toBeGreaterThan(0.9999);

    // Recovery factor moves more than ten points across the aquifer decision.
    expect(finite.recovery_factor_pct - none.recovery_factor_pct).toBeCloseTo(10.6648857625075, 9);
  });
});
