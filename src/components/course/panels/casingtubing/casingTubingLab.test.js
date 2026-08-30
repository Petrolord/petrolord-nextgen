import { describe, it, expect } from 'vitest';
import {
  G, IN, KSI, GOLDEN, ROWS, rowOf, yieldOf, effOf, rating, boundariesOf,
  gradeSweep, tensionSweep, ratingTable, regimeCensus, PUBLISHED,
  buoyancyFactor, runCase, runAllCases, shoeOnlyComparison, verdictThresholds,
  PUBLISHED_TUBING, tubingGeometry, tubingRun, tubingScenario, tempSweep,
  envelope, HELICAL_RATIO, oracleCheck, erosionalVelocityMs, adjustedYieldPa,
  barlowBurstPa, api5c3CollapsePa, triaxialSF, stringProperties,
  STEEL_E_PA, STEEL_ALPHA_PER_C, BALLOONING_FACTOR, LOAD_CASE_KINDS,
  CASING_GRADES, CONNECTION_EFFICIENCIES,
  CAPSTONE_RATING, CAPSTONE_STRING, CAPSTONE_TUBING, CAPSTONE_TUBING_CASE,
  CAPSTONE_TUBING_TEMP, capstoneSections, capstoneRun, capstoneTubingRun,
  capstoneValues,
} from './casingTubingLab.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the fixtures', () => {
  it('carries 28 catalog rows and 10 grades', () => {
    expect(ROWS).toHaveLength(28);
    expect(CASING_GRADES).toHaveLength(10);
    expect(GOLDEN.ratings).toHaveLength(84);
    expect(GOLDEN.cases).toHaveLength(7);
    expect(LOAD_CASE_KINDS).toHaveLength(7);
    expect(GOLDEN.tubing).toHaveLength(3);
  });

  it('runs the published two-section string on the D1 slant well', () => {
    expect(PUBLISHED.shoeTvdM).toBeCloseTo(2507.919699301, 9);
    expect(PUBLISHED.breakTvdM).toBeCloseTo(1473.759701091, 9);
    expect(PUBLISHED.sections).toHaveLength(2);
    expect(PUBLISHED.env.mudKgM3).toBe(1440);
    expect(PUBLISHED.designFactors).toEqual({
      burst: 1.1, collapse: 1.0, tension: 1.6, triaxial: 1.25,
    });
    expect(PUBLISHED.bendingDlsDegPer30m).toBe(2);
  });

  it('carries the connection efficiencies the course uses', () => {
    expect(effOf('BTC')).toBe(1);
    expect(effOf('LTC')).toBe(0.85);
    expect(effOf('STC')).toBe(0.75);
    expect(CONNECTION_EFFICIENCIES.every((c) => c.efficiency > 0.5)).toBe(true);
  });

  it('agrees with the published oracle everywhere it can be checked', () => {
    const o = oracleCheck();
    expect(o.checked).toBeGreaterThan(400);
    expect(o.worstRel).toBeLessThan(1e-6);
  });
});

describe('the rating formulas', () => {
  it('reproduces the Barlow hand algebra with the 12.5 percent wall tolerance', () => {
    const r = rating(9.625, 47, 'L-80');
    const handPa = (0.875 * 2 * (80 * KSI) * (0.472 * IN)) / (9.625 * IN);
    near(r.burstPa, handPa, 1e-6);
    // the tolerance is the only reason the rating is not the full Barlow value
    near(r.burstPa / (handPa / 0.875), 0.875, 1e-12);
  });

  it('makes burst exactly linear in the yield strength', () => {
    const k = rating(9.625, 47, 'K-55').burstPa;
    const p = rating(9.625, 47, 'P-110').burstPa;
    near(p / k, 2, 1e-12);
    near(rating(9.625, 47, 'L-80').burstPa / k, 80 / 55, 1e-12);
  });

  it('takes the connection efficiency straight off the body yield', () => {
    const r = rating(9.625, 53.5, 'L-80', { connection: 'LTC' });
    near(r.jointStrengthN, 0.85 * r.bodyYieldN, 1e-9);
    near(rating(9.625, 53.5, 'L-80', { connection: 'BTC' }).jointStrengthN,
      r.bodyYieldN, 1e-9);
  });

  it('puts the three D/t boundaries in order and gives them to the grade alone', () => {
    for (const g of CASING_GRADES) {
      const b = boundariesOf(g.name);
      expect(b.dtYp).toBeLessThan(b.dtPt);
      expect(b.dtPt).toBeLessThan(b.dtTe);
      // the same boundaries come back off any pipe at that grade
      const viaPipe = rating(20, 94, g.name).boundaries;
      near(viaPipe.dtYp, b.dtYp, 1e-12);
      near(viaPipe.dtPt, b.dtPt, 1e-12);
      near(viaPipe.dtTe, b.dtTe, 1e-12);
    }
  });

  it('lowers every boundary as the grade rises', () => {
    const k = boundariesOf('K-55');
    const p = boundariesOf('P-110');
    expect(p.dtYp).toBeLessThan(k.dtYp);
    expect(p.dtPt).toBeLessThan(k.dtPt);
    expect(p.dtTe).toBeLessThan(k.dtTe);
  });

  it('finds the one row whose collapse is the same at all ten grades', () => {
    const same = ROWS.filter((r) => {
      const set = new Set(gradeSweep(r.odIn, r.weightLbFt).map((x) => x.collapsePa));
      return set.size === 1;
    });
    expect(same.map((r) => `${r.odIn}/${r.weightLbFt}`)).toEqual(['20/94']);
    const s = gradeSweep(20, 94);
    expect(s.every((x) => x.regime === 'elastic')).toBe(true);
    expect(s.every((x) => Math.abs(x.collapsePa - 3554024.408995863) < 1e-6)).toBe(true);
    // and the burst on the same row spans a factor of more than three
    near(s.at(-1).burstPa / s[0].burstPa, 125 / 40, 1e-12);
    // 20 inch 106.5 misses by one grade: H-40 is already out of elastic there
    const t = gradeSweep(20, 106.5);
    expect(t[0].regime).toBe('transition');
    expect(t.slice(1).every((x) => x.regime === 'elastic')).toBe(true);
  });

  it('leaves the elastic regime untouched by tension for nine grades in ten', () => {
    const s = gradeSweep(20, 94, { axialFraction: 0.4 });
    const untouched = s.filter((x) => x.deratedFraction === 0);
    expect(untouched).toHaveLength(9);
    expect(untouched.every((x) => x.regimeDerated === 'elastic')).toBe(true);
    expect(untouched.every((x) => Math.abs(x.collapseDeratedPa - 3554024.408995863) < 1e-6)).toBe(true);
    // the one that moves is the WEAKEST grade, because derating its yield
    // pushes the elastic boundary up past this pipe's D/t of 45.66
    const moved = s.filter((x) => x.deratedFraction > 0);
    expect(moved.map((x) => x.grade)).toEqual(['H-40']);
    expect(moved[0].regimeDerated).toBe('transition');
  });
});

describe('combined loading', () => {
  it('is the API axial-adjusted yield, monotone down to zero', () => {
    const yp = 80 * KSI;
    near(adjustedYieldPa(yp, 0), yp, 1e-9);
    let prev = yp;
    for (const f of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      const cur = adjustedYieldPa(yp, f * yp);
      expect(cur).toBeLessThan(prev);
      prev = cur;
    }
    expect(adjustedYieldPa(yp, yp)).toBe(0);
    expect(api5c3CollapsePa({ odM: 9.625 * IN, wallM: 0.472 * IN, yieldPa: yp, axialStressPa: 1.01 * yp }).regime)
      .toBe('yield-exhausted');
  });

  it('moves the census toward the yield regime as the tension rises', () => {
    const base = regimeCensus(ratingTable());
    const hot = regimeCensus(ratingTable({ axialFraction: 0.4 }), 'regimeDerated');
    expect(base.elastic).toBe(43);
    expect(hot.elastic).toBe(24);
    expect(base.yield).toBe(42);
    expect(hot.yield).toBe(71);
  });

  it('derates hardest in the yield regime and not at all in the elastic one', () => {
    const thick = tensionSweep(7, 35, 'K-55');
    expect(thick.at(-1).regime).toBe('yield');
    near(thick.at(-1).deratedFraction, 0.8235017956929166, 1e-9);
    // the thin 20 inch pipe is completely immune until the derated yield has
    // dropped far enough to move the elastic boundary past its own D/t
    const thin = tensionSweep(20, 94, 'K-55');
    expect(thin.slice(0, 6).every((x) => x.deratedFraction === 0)).toBe(true);
    expect(thin[6].regime).toBe('transition');
    near(thin[6].deratedFraction, 0.003124397190863104, 1e-9);
  });
});

describe('the load cases', () => {
  it('reproduces every golden section verdict', () => {
    for (const c of GOLDEN.cases) {
      const run = runCase(c.kind);
      c.sections.forEach((exp, s) => {
        expect(run.sections[s].status).toBe(exp.status);
        expect(run.sections[s].collapseRegime).toBe(exp.collapseRegime);
      });
    }
  });

  it('buoys the string at the published mud weight', () => {
    near(buoyancyFactor(1440), 0.8165605095541402, 1e-15);
    const run = runCase('fullEvacuationCollapse');
    near(run.rows[0].faN, GOLDEN.string.weightKgM * G * buoyancyFactor(1440) * PUBLISHED.shoeTvdM, 1e-6);
    near(run.rows.at(-1).faN, 0, 1e-9);
  });

  it('governs the gas kick at SURFACE and the pressure test at the BOTTOM', () => {
    const kick = runCase('gasKickBurst');
    const test = runCase('pressureTestBurst');
    expect(kick.sections[0].burstAtTvdM).toBe(0);
    near(test.sections[1].burstAtTvdM, PUBLISHED.shoeTvdM, 1e-9);
    // the kick differential SHRINKS with depth and the test differential grows
    expect(kick.rows[0].burstDpPa).toBeGreaterThan(kick.rows.at(-1).burstDpPa);
    expect(test.rows[0].burstDpPa).toBeLessThan(test.rows.at(-1).burstDpPa);
  });

  it('costs 41.8 percent of the gas kick margin if only the section bottom is checked', () => {
    const cmp = shoeOnlyComparison('gasKickBurst');
    near(cmp[0].bottomSf, 2.396900745393525, 1e-9);
    near(cmp[0].scannedSf, 1.6904923854809817, 1e-9);
    near(cmp[0].overstatement, 1.417871364567877, 1e-9);
    expect(cmp[0].governingTvdM).toBe(0);
    // on the pressure test the bottom IS the governing point, so no overstatement
    const t = shoeOnlyComparison('pressureTestBurst');
    near(t[1].overstatement, 1, 1e-12);
  });

  it('puts the published evacuation level below the section break', () => {
    const full = runCase('fullEvacuationCollapse');
    const part = runCase('partialEvacuationCollapse');
    near(full.sections[0].collapseSF, part.sections[0].collapseSF, 1e-12);
    expect(part.sections[1].collapseSF).toBeGreaterThan(full.sections[1].collapseSF);
    near(part.profile.meta.evacToTvdM, 1504.7518195805999, 1e-9);
    expect(part.profile.meta.evacToTvdM).toBeGreaterThan(PUBLISHED.breakTvdM);
  });

  it('produces exactly one WARNING in fourteen section evaluations, from triaxial', () => {
    const runs = runAllCases();
    const flat = Object.values(runs).flatMap((r) => r.sections);
    expect(flat).toHaveLength(14);
    expect(flat.filter((s) => s.status === 'WARNING')).toHaveLength(1);
    expect(flat.filter((s) => s.status === 'FAIL')).toHaveLength(0);
    const warn = runs.pressureTestBurst.sections[1];
    expect(warn.status).toBe('WARNING');
    const th = verdictThresholds();
    expect(warn.triaxSF).toBeLessThan(th.triaxialWarn);
    expect(warn.burstSF).toBeGreaterThan(th.burstWarn);
    // and burst clears its own warning band by barely two thousandths
    expect(warn.burstSF - th.burstWarn).toBeLessThan(0.003);
    expect(warn.burstSF - th.burstWarn).toBeGreaterThan(0);
  });

  it('reduces the von Mises equivalent to the axial stress under pure tension', () => {
    const { areaM2 } = stringProperties({ odM: 9.625 * IN, idM: 8.681 * IN });
    const t = triaxialSF({
      odM: 9.625 * IN, idM: 8.681 * IN, yieldPa: 80 * KSI, piPa: 0, poPa: 0, axialN: 1e6,
    });
    near(t.vmePa, 1e6 / areaM2, 1e-6);
  });
});

describe('the tubing-packer system', () => {
  it('reproduces the three published scenarios', () => {
    for (const name of ['production-heating', 'injection-cooling', 'stimulation']) {
      const s = tubingScenario(name);
      for (const k of ['pistonN', 'ballooningN', 'thermalN', 'totalN']) {
        near(s.run.forces[k], s.result.forces[k], 1e-6);
      }
      expect(s.run.buckling.state).toBe(s.result.buckling.state);
      expect(s.run.packer.strokeOk).toBe(s.result.packer.strokeOk);
    }
  });

  it('finds a different limit in each of the three scenarios', () => {
    const heat = tubingScenario('production-heating');
    const cool = tubingScenario('injection-cooling');
    const stim = tubingScenario('stimulation');
    expect(heat.run.buckling.state).toBe('helical');
    expect(heat.run.packer.strokeOk).toBe(true);
    expect(cool.run.buckling.state).toBe('none');
    expect(cool.run.packer.strokeOk).toBe(false);
    expect(stim.run.buckling.state).toBe('none');
    expect(stim.run.packer.sf).toBeLessThan(cool.run.packer.sf);
    expect(stim.run.packer.sf).toBeLessThan(heat.run.packer.sf);
  });

  it('makes the thermal force exactly minus E A alpha dT', () => {
    const g = tubingGeometry();
    const r = tubingRun({ dPiPa: 0, dPoPa: 0, externalKgM3: 1150 }, { deltaOpC: 45 });
    near(r.forces.thermalN, -STEEL_E_PA * g.areaM2 * STEEL_ALPHA_PER_C * 45, 1e-6);
    near(r.lengthChanges.thermalM, STEEL_ALPHA_PER_C * g.lengthM * 45, 1e-12);
    expect(BALLOONING_FACTOR).toBe(0.6);
  });

  it('holds helical at exactly 2 root 2 minus 1 times sinusoidal', () => {
    const b = tubingScenario('production-heating').run.buckling;
    near(b.helicalN / b.sinusoidalN, HELICAL_RATIO, 1e-12);
    near(HELICAL_RATIO, 1.8284271247461903, 1e-15);
  });

  it('makes the stroke window exactly 2 stroke over alpha L degrees wide', () => {
    const e = envelope();
    near(e.strokeWindowDegC, 100, 1e-6);
    near(e.strokeWindowDegC, e.closedFormStrokeWindowDegC, 1e-6);
    // and it is the same width at a different pressure change, which only
    // slides the window along the temperature axis
    const e2 = envelope({ dPiPa: 30e6 });
    near(e2.strokeWindowDegC, 100, 1e-6);
    expect(e2.coldStrokeDegC).toBeGreaterThan(e.coldStrokeDegC);
  });

  it('reaches buckling 34.7 degrees before it runs out of stroke on the hot side', () => {
    const e = envelope();
    near(e.coldStrokeDegC, -34.82534863819683, 1e-6);
    near(e.sinusoidalOnsetDegC, 30.45640382594624, 1e-6);
    near(e.helicalOnsetDegC, 43.11622208089929, 1e-6);
    near(e.hotStrokeDegC, 65.17465136180317, 1e-6);
    expect(e.hotLimitIs).toBe('buckling');
    near(e.hotStrokeDegC - e.sinusoidalOnsetDegC, 34.71824753585693, 1e-6);
  });

  it('sweeps the temperature axis monotonically in force', () => {
    const s = tempSweep();
    expect(s).toHaveLength(37);
    for (let i = 1; i < s.length; i += 1) expect(s[i].totalN).toBeLessThan(s[i - 1].totalN);
    expect(s[0].pistonN).toBe(s.at(-1).pistonN);
  });

  it('gives the RP 14E erosional velocity', () => {
    near(erosionalVelocityMs({ mixtureKgM3: 700, cFactor: 100 }), 4.610800842784442, 1e-9);
    expect(erosionalVelocityMs({ mixtureKgM3: 1150, cFactor: 100 }))
      .toBeLessThan(erosionalVelocityMs({ mixtureKgM3: 700, cFactor: 100 }));
  });
});

describe('the capstone', () => {
  const V = capstoneValues();

  it('runs conditions that share nothing with the lessons', () => {
    expect(CAPSTONE_RATING.grade).toBe('C-90');
    expect(GOLDEN.ratings.some((r) => r.grade === 'C-90')).toBe(false);
    expect(GOLDEN.ratings.some((r) => r.grade === 'T-95')).toBe(false);
    expect(CAPSTONE_RATING.axialFraction).toBe(0.55);
    expect(CAPSTONE_STRING.env.mudKgM3).not.toBe(PUBLISHED.env.mudKgM3);
    expect(CAPSTONE_STRING.shoeTvdM).not.toBe(PUBLISHED.shoeTvdM);
    expect(CAPSTONE_STRING.bendingDlsDegPer30m).not.toBe(PUBLISHED.bendingDlsDegPer30m);
    expect(CAPSTONE_TUBING.tubing.lengthM).not.toBe(PUBLISHED_TUBING.tubing.lengthM);
    expect(CAPSTONE_TUBING_TEMP.deltaOpC).toBe(100);
    expect(CAPSTONE_TUBING_CASE.dPoPa).toBeGreaterThan(0);
  });

  it('pins all eighteen graded values', () => {
    near(V.burst_rating_Pa, 38971486.295327105, 1e-6);
    near(V.body_yield_N, 7784690.730872745, 1e-6);
    near(V.joint_strength_N, 5838518.048154559, 1e-6);
    near(V.collapse_Pa, 15994736.328453356, 1e-6);
    near(V.collapse_at_55pct_tension_Pa, 13362352.096477188, 1e-6);
    near(V.dt_plastic_transition_boundary, 21.687209920387204, 1e-12);
    near(V.gaskick_sec1_burst_sf, 1.712954075413236, 1e-12);
    near(V.pressuretest_sec2_burst_sf, 1.3040311472977943, 1e-12);
    near(V.fullevac_sec2_collapse_sf, 0.9852464388609451, 1e-12);
    near(V.partialevac_sec2_collapse_sf, 2.046281065326578, 1e-12);
    near(V.runningaxial_sec2_tension_sf, 3.3408019033052354, 1e-12);
    near(V.pressuretest_sec2_triax_sf, 1.4356806349563185, 1e-12);
    near(V.piston_N, 136910.1070172768, 1e-6);
    near(V.ballooning_N, 115469.85263765803, 1e-6);
    near(V.thermal_N, -576442.5921194464, 1e-6);
    near(V.total_force_N, -324062.63246451155, 1e-6);
    near(V.helical_limit_N, 264203.613922147, 1e-6);
    near(V.total_length_change_m, 2.158758783053055, 1e-9);
  });

  it('has no two graded values inside either tolerance of each other', () => {
    const F = [
      ['burst_rating_Pa', 50], ['body_yield_N', 50], ['joint_strength_N', 50],
      ['collapse_Pa', 50], ['collapse_at_55pct_tension_Pa', 50],
      ['dt_plastic_transition_boundary', 5e-7],
      ['gaskick_sec1_burst_sf', 5e-6], ['pressuretest_sec2_burst_sf', 5e-6],
      ['fullevac_sec2_collapse_sf', 5e-6], ['partialevac_sec2_collapse_sf', 5e-6],
      ['runningaxial_sec2_tension_sf', 5e-6], ['pressuretest_sec2_triax_sf', 5e-6],
      ['piston_N', 0.5], ['ballooning_N', 0.5], ['thermal_N', 0.5],
      ['total_force_N', 0.5], ['helical_limit_N', 0.5],
      ['total_length_change_m', 5e-6],
    ];
    expect(F).toHaveLength(18);
    for (let a = 0; a < F.length; a += 1) {
      for (let b = a + 1; b < F.length; b += 1) {
        const gap = Math.abs(V[F[a][0]] - V[F[b][0]]);
        expect(gap).toBeGreaterThan(Math.max(F[a][1], F[b][1]));
      }
    }
  });

  it('has no graded value within its tolerance of anything the goldens publish', () => {
    const pub = [];
    (function walk(o) {
      if (typeof o === 'number') { pub.push(o); return; }
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (o && typeof o === 'object') Object.values(o).forEach(walk);
    }(GOLDEN));
    expect(pub.length).toBeGreaterThan(700);
    const tol = {
      dt_plastic_transition_boundary: 5e-7, total_length_change_m: 5e-6,
      gaskick_sec1_burst_sf: 5e-6, pressuretest_sec2_burst_sf: 5e-6,
      fullevac_sec2_collapse_sf: 5e-6, partialevac_sec2_collapse_sf: 5e-6,
      runningaxial_sec2_tension_sf: 5e-6, pressuretest_sec2_triax_sf: 5e-6,
      piston_N: 0.5, ballooning_N: 0.5, thermal_N: 0.5, total_force_N: 0.5,
      helical_limit_N: 0.5,
    };
    for (const [k, v] of Object.entries(V)) {
      const t = tol[k] ?? 50;
      for (const p of pub) if (p !== 0) expect(Math.abs(p - v)).toBeGreaterThan(t);
    }
  });

  it('closes the Expert tier on a sum the learner can check', () => {
    near(V.piston_N + V.ballooning_N + V.thermal_N, V.total_force_N, 1e-6);
    // the string is in compression past the helical limit, and out of stroke
    expect(-V.total_force_N).toBeGreaterThan(V.helical_limit_N);
    expect(V.total_length_change_m).toBeGreaterThan(CAPSTONE_TUBING.packer.strokeM);
    expect(capstoneTubingRun().buckling.state).toBe('helical');
    expect(capstoneTubingRun().packer.strokeOk).toBe(false);
  });

  it('fails the capstone string on exactly one case, by one and a half percent', () => {
    const sects = capstoneSections();
    expect(sects[0].yieldPa).toBe(95 * KSI);
    expect(sects[1].yieldPa).toBe(90 * KSI);
    expect(sects[1].connectionEfficiency).toBe(0.75);
    const fails = LOAD_CASE_KINDS.flatMap((k) => capstoneRun(k).sections)
      .filter((s) => s.status === 'FAIL');
    expect(fails).toHaveLength(1);
    expect(V.fullevac_sec2_collapse_sf).toBeLessThan(CAPSTONE_STRING.designFactors.collapse);
    expect(V.fullevac_sec2_collapse_sf).toBeGreaterThan(0.98);
    // and the capstone evacuation level lands INSIDE the top section, unlike
    // the published run where it fell below the break
    const part = capstoneRun('partialEvacuationCollapse');
    near(part.profile.meta.evacToTvdM, 660.0000000000001, 1e-6);
    expect(part.profile.meta.evacToTvdM).toBeLessThan(CAPSTONE_STRING.breakTvdM);
  });

  it('keeps the gas kick governing at surface on the capstone conditions too', () => {
    const kick = capstoneRun('gasKickBurst');
    expect(kick.sections[0].burstAtTvdM).toBe(0);
    const test = capstoneRun('pressureTestBurst');
    near(test.sections[1].burstAtTvdM, CAPSTONE_STRING.shoeTvdM, 1e-9);
  });
});
