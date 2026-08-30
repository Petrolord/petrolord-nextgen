import { describe, it, expect } from 'vitest';
import {
  G, STEEL_DENSITY_KGM3, GOLDEN, WELLS, caseOf, hb, buoyancyFactor,
  PUBLISHED_FLUIDS, volumesFor, previousShoeMdOf, PROGRAMS, programFor, mudFor,
  placementFor, minRateNoFreeFall, maxRateUnderEcd, rateWindow, rateSweep,
  standoffFor, requiredSpacingFor, spacingSweep, springRate, clearances,
  checklistFor, annularVelocities, VERTICAL, verticalCheck, oracleCheck,
  annulusRows, fluidIntervals, API_TARGET_STANDOFF, tvdAt,
  CAPSTONE, capstoneVolumes, capstonePlacement, capstoneStandoff,
  capstoneRateWindow, capstoneValues,
} from './cementingLab.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the fixtures', () => {
  it('carries two wells and one closed-form vertical fixture', () => {
    expect(WELLS).toEqual(['slant', 'horizontal']);
    expect(caseOf('slant').casing.shoeMd).toBe(3000);
    expect(caseOf('horizontal').casing.shoeMd).toBe(2800);
    expect(VERTICAL.casing.shoeMd).toBe(2000);
    expect(VERTICAL.stations).toHaveLength(2);
  });

  it('cements the 7 inch production casing inside the 9-5/8 inch shoe', () => {
    for (const w of WELLS) {
      const c = caseOf(w);
      expect(c.casing.odM).toBe(0.1778);
      expect(c.holeSections[0].cased).toBe(true);
      expect(c.holeSections[0].casing_id_m).toBe(0.2204974);
      expect(c.holeSections[1].hole_id_m).toBe(0.2159);
      expect(c.excessOpenHolePct).toBe(15);
    }
    expect(previousShoeMdOf('slant')).toBe(1400);
    expect(previousShoeMdOf('horizontal')).toBe(1200);
  });

  it('agrees with the published oracle everywhere it can be checked', () => {
    const o = oracleCheck();
    expect(o.checked).toBeGreaterThan(60);
    expect(o.worstRel).toBeLessThan(1e-6);
  });
});

describe('the geometry and the volumes', () => {
  it('cuts the annulus at the section boundary and nowhere else', () => {
    const rows = volumesFor('slant').annulusRows;
    expect(rows).toHaveLength(2);
    expect(rows[0].fromMd).toBe(0);
    expect(rows[0].toMd).toBe(1400);
    expect(rows[0].openHole).toBe(false);
    expect(rows[1].openHole).toBe(true);
    expect(rows[1].toMd).toBe(3000);
  });

  it('inflates only the open hole row, and the effective bore follows', () => {
    const c = clearances('slant');
    near(c.nominalBoreM, 0.2159, 1e-12);
    near(c.effectiveBoreM, 0.22104932820526735, 1e-9);
    expect(c.effectiveBoreM).toBeGreaterThan(c.nominalBoreM);
    // the cased row is untouched by excess
    const withEx = annulusRows({ holeSections: caseOf('slant').holeSections, casing: caseOf('slant').casing, excessOpenHolePct: 15 });
    const noEx = annulusRows({ holeSections: caseOf('slant').holeSections, casing: caseOf('slant').casing, excessOpenHolePct: 0 });
    near(withEx[0].capM2, noEx[0].capM2, 1e-15);
    near(withEx[1].capM2 / noEx[1].capM2, 1.15, 1e-12);
  });

  it('makes the washed-out open hole WIDER than the cased annulus it hangs from', () => {
    const rows = volumesFor('slant').annulusRows;
    expect(rows[1].capM2).toBeGreaterThan(rows[0].capM2);
    // and without the excess the ordering is the other way round
    const noEx = annulusRows({ holeSections: caseOf('slant').holeSections, casing: caseOf('slant').casing, excessOpenHolePct: 0 });
    expect(noEx[1].capM2).toBeLessThan(noEx[0].capM2);
  });

  it('gives the two wells the SAME slurry volume and different displacement', () => {
    const s = volumesFor('slant');
    const h = volumesFor('horizontal');
    near(s.annularSlurryM3, h.annularSlurryM3, 1e-9);
    near(s.shoeTrackM3, h.shoeTrackM3, 1e-12);
    near(s.slurryM3, h.slurryM3, 1e-9);
    near(s.sacks, h.sacks, 1e-9);
    expect(s.displacementM3).toBeGreaterThan(h.displacementM3);
    near(s.displacementM3 - h.displacementM3, s.capInsideM2 * 200, 1e-9);
  });

  it('closes the slurry sum and the total', () => {
    const v = volumesFor('slant');
    near(v.annularSlurryM3 + v.shoeTrackM3, v.slurryM3, 1e-12);
    near(v.leadM3 + v.tailM3, v.slurryM3, 1e-12);
    near(v.spacerVolM3 + v.slurryM3 + v.displacementM3, v.totalPumpedM3, 1e-12);
    near(v.sacks * caseOf('slant').slurryYieldM3PerSack, v.slurryM3, 1e-9);
    near(v.jobTimeS * caseOf('slant').pumpRateM3s, v.totalPumpedM3, 1e-9);
  });

  it('refuses geometry it cannot cover or fit', () => {
    const c = caseOf('slant');
    expect(() => volumesFor('slant', { tocMd: 4000 })).toThrow(/above the shoe/);
    expect(() => annulusRows({
      holeSections: [{ from_md_m: 0, to_md_m: 500, cased: false, hole_id_m: 0.2159 }], casing: c.casing,
    })).toThrow(/does not cover/);
    expect(() => annulusRows({
      holeSections: c.holeSections, casing: { ...c.casing, odM: 0.25 },
    })).toThrow(/does not fit/);
  });

  it('grows the slurry linearly with the excess factor', () => {
    const base = volumesFor('slant', { excessOpenHolePct: 0 });
    const ex30 = volumesFor('slant', { excessOpenHolePct: 30 });
    // the open-hole part of the annular slurry is what the excess inflates
    const openOnly = volumesFor('slant', { excessOpenHolePct: 0, tocMd: 1400 }).annularSlurryM3;
    near(openOnly, 18.849518222426916, 1e-9);
    near(ex30.annularSlurryM3 - base.annularSlurryM3, 0.30 * openOnly, 1e-9);
  });
});

describe('the vertical closed-form fixture', () => {
  it('is exact cylinder algebra on both inside volumes', () => {
    const f = verticalCheck();
    near(f.volumes.displacementM3, f.closedDisplacementM3, 1e-12);
    near(f.volumes.shoeTrackM3, f.closedShoeTrackM3, 1e-12);
  });

  it('has no friction, so the end pump pressure IS the float differential', () => {
    const f = verticalCheck();
    expect(f.frictionFree).toBe(true);
    near(f.placement.endPumpPressurePa, f.placement.floatDiffPa, 1e-9);
    // the published value is quoted to nine decimals, so match it at a millipascal
    near(f.placement.endPumpPressurePa, VERTICAL.placement.endPumpPressurePa, 1e-3);
    for (const fl of VERTICAL.fluids) expect(fl.rheology).toBeUndefined();
  });

  it('free falls, and says so in a warning', () => {
    const f = verticalCheck();
    expect(f.placement.freeFall).toBe(true);
    expect(f.placement.warnings.join(' ')).toMatch(/Free fall/);
    near(f.placement.achievedTocMd, VERTICAL.tocMd, 1e-6);
  });

  it('has zero U-tube everywhere on an equal-density friction-free programme', () => {
    const rho = VERTICAL.mudInHole.densityKgM3;
    const v = verticalCheck().volumes;
    const iv = fluidIntervals({
      V: 10, fluids: [{ kind: 'tail', densityKgM3: rho, volumeM3: v.slurryM3 }],
      mudInHole: VERTICAL.mudInHole, vPath: 100,
    });
    near(iv.reduce((a, i) => a + (i.v1 - i.v0), 0), 100, 1e-12);
  });
});

describe('placement', () => {
  it('lands the cement at the target top on both wells and both programmes', () => {
    for (const w of WELLS) {
      for (const p of PROGRAMS) {
        near(placementFor(w, p).achievedTocMd, caseOf(w).tocMd, 1e-6);
      }
    }
  });

  it('puts the lead across the cased annulus and the tail across the open hole', () => {
    const end = placementFor('slant', 'lead_tail').annulusEnd;
    const lead = end.find((s) => s.kind === 'lead');
    const tail = end.find((s) => s.kind === 'tail');
    near(lead.fromMd, 1200, 1e-6);
    near(lead.toMd, 1400, 1e-6);
    near(tail.toMd, 3000, 1e-6);
    expect(tail.densityKgM3).toBe(PUBLISHED_FLUIDS.tailKgM3);
  });

  it('costs the neat programme pressure and ECD against the two-slurry one', () => {
    for (const w of WELLS) {
      const lt = placementFor(w, 'lead_tail');
      const nt = placementFor(w, 'neat');
      expect(nt.endPumpPressurePa).toBeGreaterThan(lt.endPumpPressurePa);
      expect(nt.maxEcdPrevShoeKgM3).toBeGreaterThan(lt.maxEcdPrevShoeKgM3);
      expect(nt.floatDiffPa).toBeGreaterThan(lt.floatDiffPa);
    }
    near(placementFor('slant', 'neat').maxEcdPrevShoeKgM3
      - placementFor('slant', 'lead_tail').maxEcdPrevShoeKgM3, 54.44798862742963, 1e-6);
  });

  it('free falls on the horizontal well with a neat slurry and not with a lead', () => {
    expect(placementFor('horizontal', 'neat').freeFall).toBe(true);
    expect(placementFor('horizontal', 'lead_tail').freeFall).toBe(false);
    expect(placementFor('slant', 'neat').freeFall).toBe(false);
    expect(placementFor('slant', 'lead_tail').freeFall).toBe(false);
    const nt = placementFor('horizontal', 'neat');
    expect(nt.series.filter((s) => s.freeFall)).toHaveLength(1);
    near(nt.series.reduce((a, s) => Math.min(a, s.uTubePa), Infinity), -104394.27505085245, 1e-6);
  });

  it('leaves the horizontal well with barely any float differential', () => {
    const h = placementFor('horizontal', 'lead_tail');
    const s = placementFor('slant', 'lead_tail');
    expect(h.floatDiffPa).toBeGreaterThan(0);
    expect(s.floatDiffPa / h.floatDiffPa).toBeGreaterThan(9);
    // because the lateral adds measured depth and no true vertical depth
    near(tvdAt(caseOf('horizontal').stations, 2800), 1214.859173174059, 1e-6);
    near(tvdAt(caseOf('slant').stations, 3000), 2507.9196993011733, 1e-6);
  });

  it('holds the ECD at the previous shoe flat until cement reaches above it', () => {
    const r = placementFor('slant', 'lead_tail');
    const early = r.series.slice(0, 30).map((s) => s.ecdPrevShoeKgM3);
    for (const e of early) near(e, early[0], 1e-9);
    expect(r.maxEcdPrevShoeKgM3).toBeGreaterThan(early[0]);
  });
});

describe('the rate window', () => {
  it('bisects both edges rather than reading them off a sweep', () => {
    const w = rateWindow('slant', 'lead_tail', 1700);
    near(w.minRateNoFreeFallM3s, 0.01693390800228161, 1e-9);
    near(w.maxRateUnderEcdM3s, 0.02417969900227423, 1e-9);
    near(w.widthM3s, 0.007246, 1e-5);
    expect(w.open).toBe(true);
  });

  it('closes the window on the horizontal well with a neat slurry, and the lead opens it', () => {
    const nt = rateWindow('horizontal', 'neat', 1700);
    const lt = rateWindow('horizontal', 'lead_tail', 1700);
    expect(nt.open).toBe(false);
    expect(nt.widthM3s).toBeLessThan(0);
    near(nt.minRateNoFreeFallM3s, 0.020597931638693924, 1e-9);
    near(nt.maxRateUnderEcdM3s, 0.017832442077937685, 1e-9);
    expect(lt.open).toBe(true);
    near(lt.widthM3s, 0.00539927840496492, 1e-9);
  });

  it('trades free fall against ECD monotonically in the rate', () => {
    const s = rateSweep('horizontal', 'neat');
    for (let i = 1; i < s.length; i += 1) {
      expect(s[i].maxEcdPrevShoeKgM3).toBeGreaterThan(s[i - 1].maxEcdPrevShoeKgM3);
      expect(s[i].worstUTubePa).toBeGreaterThan(s[i - 1].worstUTubePa);
    }
    expect(s[0].freeFall).toBe(true);
    expect(s.at(-1).freeFall).toBe(false);
  });

  it('returns null rather than a number when an edge does not exist', () => {
    const run = (q) => placementFor('slant', 'lead_tail', { pumpRateM3s: q });
    expect(maxRateUnderEcd(run, 100)).toBeNull();
    expect(minRateNoFreeFall((q) => placementFor('horizontal', 'neat', { pumpRateM3s: q }),
      { lo: 0.0005, hi: 0.001 })).toBeNull();
  });
});

describe('centralization', () => {
  it('is bound by the mid-span sag rather than by the centralizer, on both wells', () => {
    for (const w of WELLS) {
      const so = standoffFor(w);
      expect(so.bindingTerm).toBe('mid-span sag');
      expect(so.minRow.standoffMidSpan).toBeLessThan(so.minRow.standoffAtCentralizer);
    }
    near(standoffFor('slant').minStandoff, 0.742357202445576, 1e-9);
    near(standoffFor('horizontal').minStandoff, 0.599178961025609, 1e-9);
  });

  it('passes the API target on the slant well and fails it on the horizontal one', () => {
    expect(standoffFor('slant').minStandoff).toBeGreaterThanOrEqual(API_TARGET_STANDOFF);
    expect(standoffFor('horizontal').minStandoff).toBeLessThan(API_TARGET_STANDOFF);
    near(requiredSpacingFor('slant'), 13.05523892558449, 1e-6);
    near(requiredSpacingFor('horizontal'), 11.187558579905271, 1e-6);
    expect(requiredSpacingFor('horizontal')).toBeLessThan(caseOf('horizontal').centralizer.spacingM);
    expect(requiredSpacingFor('slant')).toBeGreaterThan(caseOf('slant').centralizer.spacingM);
  });

  it('collapses the standoff to zero by twenty metres of spacing', () => {
    const s = spacingSweep('slant');
    for (let i = 1; i < s.length; i += 1) expect(s[i].minStandoff).toBeLessThanOrEqual(s[i - 1].minStandoff);
    expect(s.find((x) => x.spacingM === 20).minStandoff).toBe(0);
    expect(s.find((x) => x.spacingM === 6).minStandoff).toBeGreaterThan(0.9);
  });

  it('gains more from closer spacing than from a stiffer spring', () => {
    const tighter = standoffFor('slant', { centralizer: { spacingM: 9 } }).minStandoff;
    const stiffer = standoffFor('slant', { centralizer: { restoringForceN: 17800 } }).minStandoff;
    const base = standoffFor('slant').minStandoff;
    expect(tighter - base).toBeGreaterThan(stiffer - base);
  });

  it('improves the standoff as the mud gets heavier', () => {
    const light = standoffFor('slant', { mudDensityKgM3: 1030 }).minStandoff;
    const heavy = standoffFor('slant', { mudDensityKgM3: 2000 }).minStandoff;
    expect(heavy).toBeGreaterThan(light);
    near(buoyancyFactor(1440), 0.8165605095541402, 1e-15);
    expect(STEEL_DENSITY_KGM3).toBe(7850);
  });

  it('measures the standoff clearance in the NOMINAL hole and the volume in the washed-out one', () => {
    const c = clearances('slant');
    const k = springRate('slant');
    near(k.clearanceM, c.nominalClearanceM, 1e-15);
    expect(c.effectiveClearanceM).toBeGreaterThan(c.nominalClearanceM);
    near(k.kNPerM, 8900 / ((1 - API_TARGET_STANDOFF) * c.nominalClearanceM), 1e-9);
  });

  it('counts the checklist honestly, and fails exactly the horizontal standoff', () => {
    const s = checklistFor('slant', 'lead_tail');
    const h = checklistFor('horizontal', 'lead_tail');
    expect(s.total).toBe(5);
    expect(s.passed).toBe(5);
    expect(h.passed).toBe(4);
    expect(h.items.find((i) => !i.ok).id).toBe('standoff');
    const v = annularVelocities('slant');
    expect(v.every((x) => x.vMs >= 0.3)).toBe(true);
    near(v[0].vMs, 1.4973771889585683, 1e-9);
  });
});

describe('the capstone', () => {
  const V = capstoneValues();

  it('runs conditions that share nothing with the lessons', () => {
    expect(CAPSTONE.casing.odM).not.toBe(caseOf('slant').casing.odM);
    expect(CAPSTONE.casing.shoeMd).toBe(previousShoeMdOf('slant'));
    expect(CAPSTONE.excessOpenHolePct).not.toBe(caseOf('slant').excessOpenHolePct);
    expect(CAPSTONE.pumpRateM3s).not.toBe(caseOf('slant').pumpRateM3s);
    expect(CAPSTONE.slurryYieldM3PerSack).not.toBe(caseOf('slant').slurryYieldM3PerSack);
    expect(CAPSTONE.tailKgM3).not.toBe(PUBLISHED_FLUIDS.tailKgM3);
    expect(CAPSTONE.standoffMudKgM3).not.toBe(PUBLISHED_FLUIDS.mudKgM3);
    expect(CAPSTONE.centralizer.spacingM).not.toBe(caseOf('slant').centralizer.spacingM);
    expect(CAPSTONE.centralizer.restoringForceN).not.toBe(caseOf('slant').centralizer.restoringForceN);
    // the TRAJECTORY is the module's own, which is the point of one wellbore
    expect(CAPSTONE.well).toBe('slant');
  });

  it('pins all eighteen graded values', () => {
    near(V.annulus_slurry_m3, 42.83199302556888, 1e-9);
    near(V.shoe_track_m3, 1.8328970170415964, 1e-12);
    near(V.slurry_m3, 44.66489004261047, 1e-9);
    near(V.displacement_m3, 51.626599313338296, 1e-9);
    near(V.sacks, 1111.0669164828475, 1e-6);
    near(V.open_hole_effective_bore_m, 0.32852429371737485, 1e-12);
    near(V.end_pump_pressure_pa, 6233731.747831926, 1e-3);
    near(V.float_diff_pa, 4969584.9998046905, 1e-3);
    near(V.max_ecd_prev_shoe_kgm3, 1576.3692813689117, 1e-6);
    near(V.min_rate_no_free_fall_m3s, 0.12974748005989847, 1e-9);
    near(V.max_rate_under_ecd_limit_m3s, 0.04354109120904704, 1e-9);
    near(V.rate_window_width_m3s, -0.08620638885085144, 1e-9);
    near(V.min_standoff, 0.8556417628346304, 1e-9);
    near(V.standoff_at_centralizer_at_min, 0.8841171967314949, 1e-9);
    near(V.required_spacing_m, 15.99770776601963, 1e-6);
    near(V.buoyed_weight_n_per_m, 572.3226608514, 1e-6);
    near(V.min_standoff_rigid, 0.6424096181525695, 1e-9);
    near(V.centralizer_spring_rate_n_per_m, 999875.0156230475, 1e-3);
  });

  it('has no two graded values inside either tolerance of each other', () => {
    const F = [
      ['annulus_slurry_m3', 5e-7], ['shoe_track_m3', 5e-7], ['slurry_m3', 5e-7],
      ['displacement_m3', 5e-7], ['sacks', 5e-4], ['open_hole_effective_bore_m', 5e-7],
      ['end_pump_pressure_pa', 50], ['float_diff_pa', 50], ['max_ecd_prev_shoe_kgm3', 5e-3],
      ['min_rate_no_free_fall_m3s', 5e-7], ['max_rate_under_ecd_limit_m3s', 5e-7],
      ['rate_window_width_m3s', 5e-7], ['min_standoff', 5e-7],
      ['standoff_at_centralizer_at_min', 5e-7], ['required_spacing_m', 5e-7],
      ['buoyed_weight_n_per_m', 5e-4], ['min_standoff_rigid', 5e-7],
      ['centralizer_spring_rate_n_per_m', 5e-3],
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
    expect(pub.length).toBeGreaterThan(900);
    const tol = {
      sacks: 5e-4, end_pump_pressure_pa: 50, float_diff_pa: 50,
      max_ecd_prev_shoe_kgm3: 5e-3, buoyed_weight_n_per_m: 5e-4,
      centralizer_spring_rate_n_per_m: 5e-3,
    };
    for (const [k, v] of Object.entries(V)) {
      const t = tol[k] ?? 5e-7;
      for (const p of pub) if (p !== 0) expect(Math.abs(p - v)).toBeGreaterThan(t);
    }
  });

  it('closes each tier on a sum the learner can check', () => {
    near(V.annulus_slurry_m3 + V.shoe_track_m3, V.slurry_m3, 1e-9);
    near(V.max_rate_under_ecd_limit_m3s - V.min_rate_no_free_fall_m3s, V.rate_window_width_m3s, 1e-12);
    expect(V.min_standoff).toBeLessThanOrEqual(V.standoff_at_centralizer_at_min);
  });

  it('closes the capstone rate window, and the job free falls at its design rate', () => {
    expect(V.rate_window_width_m3s).toBeLessThan(0);
    expect(capstoneRateWindow().open).toBe(false);
    expect(capstonePlacement().freeFall).toBe(true);
    // and the ECD constraint is NOT what makes it impossible: the design rate
    // is comfortably under the limit, and the free-fall edge is unreachable
    expect(V.max_ecd_prev_shoe_kgm3).toBeLessThan(CAPSTONE.ecdLimitKgM3);
    expect(V.max_rate_under_ecd_limit_m3s).toBeGreaterThan(CAPSTONE.pumpRateM3s);
    expect(V.min_rate_no_free_fall_m3s).toBeGreaterThan(0.1);
  });

  it('passes the API standoff on bow springs and fails it on the rigid blade', () => {
    expect(V.min_standoff).toBeGreaterThan(API_TARGET_STANDOFF);
    expect(V.min_standoff_rigid).toBeLessThan(API_TARGET_STANDOFF);
    expect(V.required_spacing_m).toBeGreaterThan(CAPSTONE.centralizer.spacingM);
    near(capstoneVolumes().annularSlurryM3 + capstoneVolumes().shoeTrackM3,
      capstoneVolumes().slurryM3, 1e-9);
    near(capstoneStandoff().minRow.incDeg, 40, 1e-9);
  });
});
