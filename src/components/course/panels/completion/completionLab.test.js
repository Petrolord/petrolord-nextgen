import { describe, it, expect } from 'vitest';
import {
  IN, GOLDEN, apiDriftM, buildStack, casingProgramProfile, governingDriftTo,
  runInClearance, throughBoreProfile, completionVolumes, sealSpaceOut,
  DRIFT_DEDUCTION_TUBING_M, DRIFT_DEDUCTION_CASING_SMALL_M,
  DRIFT_DEDUCTION_CASING_MID_M, DRIFT_DEDUCTION_CASING_LARGE_M,
  EQUIPMENT_CATALOG, NIPPLE_BORES_IN, EUE_COUPLING_OD_IN, EQUIPMENT_TYPES,
  ALL_TUBULARS, driftTable, driftClasses, PUBLISHED, publishedStack,
  publishedProfile, publishedClearance, publishedThroughBore, publishedVolumes,
  clearanceByTightness, throughBoreExtent, fitCheck, fitMatrix,
  spaceOutAt, spaceOutSweep, spaceOutBand, minPbrLength,
  dr6LengthChanges, dr6SpaceOut, oracleCheck,
  CAPSTONE, capstoneStack, capstoneProfile, capstonePackerBottomMdM,
  capstoneClearance, capstoneThroughBore, capstoneVolumes, capstoneSpaceOut,
  capstoneBand, capstoneValues,
} from './completionLab.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the fixtures', () => {
  it('carries one published completion of 13 components in a two-string program', () => {
    expect(PUBLISHED.components).toHaveLength(13);
    expect(PUBLISHED.program.strings).toHaveLength(2);
    expect(PUBLISHED.warnMarginM).toBe(0.003);
    near(PUBLISHED.packerMdM, 2600.5, 1e-9);
    near(PUBLISHED.tdMdM, 3000, 1e-9);
    expect(EQUIPMENT_CATALOG).toHaveLength(49);
    expect(EQUIPMENT_TYPES).toHaveLength(14);
  });

  it('agrees with the published oracle everywhere it can be checked', () => {
    const o = oracleCheck();
    expect(o.checked).toBeGreaterThan(70);
    expect(o.worstRel).toBeLessThan(1e-6);
  });
});

describe('API 5CT drift', () => {
  it('is the inside diameter less a deduction that depends on the OD alone', () => {
    near(apiDriftM({ odM: 9.625 * IN, idM: 8.681 * IN, kind: 'casing' }) / IN, 8.52475, 1e-9);
    near(apiDriftM({ odM: 7 * IN, idM: 6.184 * IN, kind: 'casing' }) / IN, 6.059, 1e-9);
    near(apiDriftM({ odM: 3.5 * IN, idM: 2.992 * IN, kind: 'tubing' }) / IN, 2.89825, 1e-9);
    near(DRIFT_DEDUCTION_TUBING_M / IN, 3 / 32, 1e-15);
    near(DRIFT_DEDUCTION_CASING_SMALL_M / IN, 1 / 8, 1e-15);
    near(DRIFT_DEDUCTION_CASING_MID_M / IN, 5 / 32, 1e-15);
    near(DRIFT_DEDUCTION_CASING_LARGE_M / IN, 3 / 16, 1e-15);
  });

  it('switches class exactly at 8-5/8 and 13-3/8 inches', () => {
    const idM = 8 * IN;
    expect(apiDriftM({ odM: 8.625 * IN, idM, kind: 'casing' })).toBe(idM - DRIFT_DEDUCTION_CASING_SMALL_M);
    expect(apiDriftM({ odM: 8.626 * IN, idM, kind: 'casing' })).toBe(idM - DRIFT_DEDUCTION_CASING_MID_M);
    expect(apiDriftM({ odM: 13.375 * IN, idM, kind: 'casing' })).toBe(idM - DRIFT_DEDUCTION_CASING_MID_M);
    expect(apiDriftM({ odM: 13.376 * IN, idM, kind: 'casing' })).toBe(idM - DRIFT_DEDUCTION_CASING_LARGE_M);
  });

  it('splits the whole catalog into four deduction classes', () => {
    const cls = driftClasses();
    expect(Object.keys(cls).sort()).toEqual(['0.09375', '0.12500', '0.15625', '0.18750']);
    expect(cls['0.18750']).toHaveLength(3);
    expect(cls['0.15625']).toHaveLength(9);
    expect(cls['0.12500']).toHaveLength(10);
    expect(cls['0.09375']).toHaveLength(6);
    expect(driftTable()).toHaveLength(ALL_TUBULARS.length);
  });

  it('makes the deduction depend on the OD and not on the weight', () => {
    const nines = driftTable().filter((r) => r.odIn === 9.625);
    expect(new Set(nines.map((r) => r.deductionIn.toFixed(9))).size).toBe(1);
    // and the drift itself does vary with weight, because the ID does
    expect(new Set(nines.map((r) => r.driftM)).size).toBe(nines.length);
  });

  it('refuses an inside diameter that is not inside', () => {
    expect(() => apiDriftM({ odM: 0.2, idM: 0.25 })).toThrow();
    expect(() => apiDriftM({ odM: 0.2, idM: 0.18, kind: 'sausage' })).toThrow(/kind/);
  });
});

describe('the stack-up', () => {
  it('telescopes from the hanger and closes on the sum of the lengths', () => {
    const s = publishedStack();
    near(s.bottomMdM, GOLDEN.results.bottomMdM, 1e-12);
    near(s.bottomMdM, PUBLISHED.components.reduce((a, c) => a + c.lengthM, 0), 1e-12);
    near(s.lengthM, s.bottomMdM - s.hangerMdM, 1e-12);
    for (let i = 1; i < s.components.length; i += 1) {
      expect(s.components[i].topMdM).toBe(s.components[i - 1].bottomMdM);
    }
  });

  it('refuses a component with no length or an inside-out diameter', () => {
    expect(() => buildStack({ components: [] })).toThrow();
    expect(() => buildStack({ components: [{ type: 't', lengthM: 0, odM: 0.1, idM: 0.08 }] })).toThrow(/length/);
    expect(() => buildStack({ components: [{ type: 't', lengthM: 10, odM: 0.08, idM: 0.1 }] })).toThrow(/OD\/ID/);
    expect(() => buildStack({ hangerMdM: -1, components: PUBLISHED.components })).toThrow(/Hanger/);
  });
});

describe('the exposed casing program', () => {
  it('keeps the innermost bore where two strings overlap', () => {
    const p = publishedProfile();
    expect(p).toHaveLength(3);
    near(p[2].idM / IN, 6.184, 1e-9);
    expect(p[2].label).toBe('7" liner');
    // the 9-5/8 is still there below 2400 m; the liner simply hides it
    expect(PUBLISHED.program.strings[0].sections[1].bottomMdM).toBe(3000);
  });

  it('merges adjacent segments of the same bore and label', () => {
    const merged = casingProgramProfile([{
      name: 'one', sections: [
        { topMdM: 0, bottomMdM: 500, odM: 9.625 * IN, idM: 8.681 * IN },
        { topMdM: 500, bottomMdM: 900, odM: 9.625 * IN, idM: 8.681 * IN },
      ],
    }]);
    expect(merged).toHaveLength(1);
    near(merged[0].bottomMdM, 900, 1e-12);
  });

  it('returns null rather than a number when the program has a gap above the depth', () => {
    const gapped = casingProgramProfile([{
      name: 'liner only', sections: [{ topMdM: 2400, bottomMdM: 3000, odM: 7 * IN, idM: 6.184 * IN }],
    }]);
    expect(governingDriftTo(gapped, 2800)).toBeNull();
    expect(() => governingDriftTo(publishedProfile(), 0)).toThrow();
  });

  it('makes the governing drift fall monotonically with depth', () => {
    const p = publishedProfile();
    const d = [1000, 2000, 3000].map((md) => governingDriftTo(p, md).driftM);
    expect(d[0]).toBeGreaterThan(d[1]);
    expect(d[1]).toBeGreaterThan(d[2]);
    near(d[2] / IN, 6.184 - 1 / 8, 1e-9);
  });
});

describe('run-in clearance', () => {
  it('reproduces every published row and status', () => {
    const { rows } = publishedClearance();
    expect(rows).toHaveLength(GOLDEN.results.clearance.length);
    rows.forEach((r, i) => {
      near(r.clearanceM, GOLDEN.results.clearance[i].clearanceM, 1e-9);
      expect(r.status).toBe(GOLDEN.results.clearance[i].status);
      expect(r.controlling).toBe(GOLDEN.results.clearance[i].controlling);
    });
    expect(rows.every((r) => r.status === 'PASS')).toBe(true);
  });

  it('checks the WHOLE path above a component, not the bore at its own depth', () => {
    const { rows } = publishedClearance();
    // the safety valve stops at 153 m and is therefore checked against the
    // 9-5/8 inch drift, never against the liner it never reaches
    const sssv = rows.find((r) => r.type === 'sssv');
    expect(sssv.controlling).toBe('9-5/8" production casing');
    near(sssv.governingDriftM / IN, 8.681 - 5 / 32, 1e-9);
    // everything that passes the liner top is checked against the liner
    const packer = rows.find((r) => r.type === 'packer');
    expect(packer.controlling).toBe('7" liner');
    near(packer.governingDriftM / IN, 6.184 - 1 / 8, 1e-9);
  });

  it('makes the production packer the tightest row, at 4.7 mm', () => {
    const { rows, worst } = publishedClearance();
    const tightest = clearanceByTightness(rows)[0];
    expect(tightest.type).toBe('packer');
    near(tightest.clearanceM, 0.0046736, 1e-9);
    expect(worst.name).toBe(tightest.name);
    near(worst.clearanceM, GOLDEN.results.clearanceWorst.clearanceM, 1e-12);
    // it clears the 3 mm warn margin by 1.67 mm, and the second tightest is
    // the eccentric side pocket mandrel
    near(tightest.clearanceM - PUBLISHED.warnMarginM, 0.0016736, 1e-9);
    expect(clearanceByTightness(rows)[1].type).toBe('spm');
    near(clearanceByTightness(rows)[1].clearanceM, 0.007848599999999983, 1e-9);
  });

  it('does not report the first row as the worst on an all-PASS string', () => {
    // the regression the DR8 course found: ranking by status alone made
    // `worst` degenerate to rows[0] whenever every row shared a status
    const { rows, worst } = publishedClearance();
    expect(worst.name).not.toBe(rows[0].name);
    expect(rows[0].clearanceM / worst.clearanceM).toBeGreaterThan(20);
    near(rows[0].clearanceM / worst.clearanceM, 21.87364130434783, 1e-9);
  });

  it('fails an oversized item through the liner and passes it above the liner', () => {
    const deep = buildStack({ components: [
      { type: 'tubing', name: 'tbg', lengthM: 2500, odM: 4.5 * IN, idM: 2.992 * IN },
      { type: 'sssv', name: 'oversize TRSV', lengthM: 2.2, odM: 6.94 * IN, idM: 3.813 * IN },
    ] });
    const r = runInClearance({ stack: deep, profile: publishedProfile() });
    expect(r.rows[1].status).toBe('FAIL');
    expect(r.worst.name).toBe('oversize TRSV');
    const shallow = buildStack({ components: [
      { type: 'tubing', name: 'tbg', lengthM: 2000, odM: 4.5 * IN, idM: 2.992 * IN },
      { type: 'sssv', name: 'oversize TRSV', lengthM: 2.2, odM: 6.94 * IN, idM: 3.813 * IN },
    ] });
    expect(runInClearance({ stack: shallow, profile: publishedProfile() }).rows[1].status).toBe('PASS');
  });
});

describe('the through-bore', () => {
  it('is a cumulative minimum from the top and names the XN no-go', () => {
    const tb = publishedThroughBore();
    near(tb.minIdM, 0.066929, 1e-9);
    expect(tb.controlling).toMatch(/XN/);
    for (let i = 1; i < tb.rows.length; i += 1) {
      expect(tb.rows[i].cumMinIdM).toBeLessThanOrEqual(tb.rows[i - 1].cumMinIdM);
    }
  });

  it('reports an extreme that governs 3.75 m of a 2606 m string', () => {
    const extent = throughBoreExtent(publishedStack(), publishedThroughBore());
    near(extent['XN no-go nipple 3-1/2"'], 3.75, 1e-9);
    near(extent['TRSV safety valve 3-1/2"'], 2451.6, 1e-9);
    near(extent['Tubing 3-1/2" EUE'], 150.9, 1e-9);
    // the safety valve governs 94 percent of the string, the reported
    // restriction governs a tenth of a percent
    expect(extent['TRSV safety valve 3-1/2"'] / publishedStack().lengthM).toBeGreaterThan(0.94);
    expect(extent['XN no-go nipple 3-1/2"'] / publishedStack().lengthM).toBeLessThan(0.002);
  });

  it('makes the safety valve a real restriction and the tubing not one', () => {
    near(NIPPLE_BORES_IN['3.5'].x, 2.75, 1e-12);
    near(NIPPLE_BORES_IN['3.5'].xn, 2.635, 1e-12);
    expect(NIPPLE_BORES_IN['3.5'].xn).toBeLessThan(NIPPLE_BORES_IN['3.5'].x);
    expect(NIPPLE_BORES_IN['3.5'].x).toBeLessThan(2.992);
    near(EUE_COUPLING_OD_IN['3.5'], 4.5, 1e-12);
  });
});

describe('volumes', () => {
  it('reproduces the published four volumes with no warnings', () => {
    const v = publishedVolumes();
    const g = GOLDEN.results.volumes;
    near(v.stringCapacityM3, g.stringCapacityM3, 1e-6);
    near(v.stringDisplacementM3, g.stringDisplacementM3, 1e-6);
    near(v.annulusAbovePackerM3, g.annulusAbovePackerM3, 1e-5);
    near(v.belowPackerM3, g.belowPackerM3, 1e-5);
    expect(v.warnings).toEqual([]);
  });

  it('leaves the steel volume as the difference of the two string volumes', () => {
    const v = publishedVolumes();
    near(v.stringDisplacementM3 - v.stringCapacityM3, 14.953204615242353, 1e-6);
    expect(v.stringDisplacementM3).toBeGreaterThan(v.stringCapacityM3);
  });

  it('is exact on a single-interval hand integral', () => {
    const stack = buildStack({ components: [{ type: 'tubing', name: 't', lengthM: 100, odM: 4.5 * IN, idM: 2.992 * IN }] });
    const profile = casingProgramProfile([{ name: 'csg', sections: [{ topMdM: 0, bottomMdM: 200, odM: 9.625 * IN, idM: 8.681 * IN }] }]);
    const v = completionVolumes({ stack, profile, packerMdM: 100, tdMdM: 200 });
    const a = (d) => (Math.PI / 4) * (d * IN) ** 2;
    near(v.stringCapacityM3, a(2.992) * 100, 1e-12);
    near(v.annulusAbovePackerM3, (a(8.681) - a(4.5)) * 100, 1e-12);
    near(v.belowPackerM3, a(8.681) * 100, 1e-12);
  });

  it('skips an uncased interval with a warning rather than guessing a bore', () => {
    const stack = buildStack({ components: [{ type: 'tubing', name: 't', lengthM: 100, odM: 4.5 * IN, idM: 2.992 * IN }] });
    const short = casingProgramProfile([{ name: 'csg', sections: [{ topMdM: 0, bottomMdM: 50, odM: 9.625 * IN, idM: 8.681 * IN }] }]);
    const v = completionVolumes({ stack, profile: short, packerMdM: 100, tdMdM: 150 });
    expect(v.warnings.length).toBeGreaterThan(0);
    expect(v.warnings[0]).toMatch(/No casing coverage/);
    expect(() => completionVolumes({ stack, profile: short, packerMdM: 120, tdMdM: 150 })).toThrow(/Packer/);
    expect(() => completionVolumes({ stack, profile: short, packerMdM: 100, tdMdM: 50 })).toThrow(/TD/);
  });
});

describe('the equipment catalog', () => {
  it('gives every jewelry body the coupling OD unless it has a reason not to', () => {
    const kit = EQUIPMENT_CATALOG.filter((r) => r.forTubingOdIn === 3.5);
    const cpl = EUE_COUPLING_OD_IN['3.5'];
    const atCoupling = kit.filter((r) => r.odIn === cpl).map((r) => r.type);
    expect(atCoupling).toEqual(expect.arrayContaining(['tubing', 'flow-coupling', 'blast-joint', 'nipple-x', 'nipple-xn', 'weg']));
    const bigger = kit.filter((r) => r.odIn > cpl).map((r) => r.type);
    expect(bigger.sort()).toEqual(['expansion-joint', 'sliding-sleeve', 'spm', 'sssv']);
    expect(kit.find((r) => r.type === 'perforated-joint').odIn).toBe(3.5);
    expect(kit.every((r) => r.approx === true)).toBe(true);
  });

  it('fits the 3-1/2 kit in 7 inch casing at every weight and fails three items in 5-1/2', () => {
    for (const w of [26, 29, 32]) expect(fitCheck(3.5, 7, w).failCount).toBe(0);
    const small = fitCheck(3.5, 5.5, 20);
    expect(small.failCount).toBe(3);
    expect(small.fails.sort()).toEqual(['expansion-joint', 'spm', 'sssv']);
  });

  it('makes the big-body items decide the completion size', () => {
    const m = fitMatrix();
    for (const row of m) {
      if (row.failCount === 0) continue;
      expect(row.fails.some((t) => ['spm', 'sssv', 'expansion-joint', 'packer'].includes(t))).toBe(true);
    }
    expect(EQUIPMENT_CATALOG.find((r) => r.type === 'spm' && r.forTubingOdIn === 3.5).eccentric).toBe(true);
  });
});

describe('seal space-out', () => {
  it('reproduces the two published cases and their asymmetry', () => {
    for (const c of GOLDEN.results.spaceOut) {
      const r = sealSpaceOut({
        pbrLengthM: c.pbrLengthM, insertLengthM: c.insertLengthM,
        expectedDLM: c.expectedDLM, marginM: c.marginM,
      });
      near(r.availableM, c.result.availableM, 1e-12);
      near(r.remainingM, c.result.remainingM, 1e-12);
      expect(r.status).toBe(c.result.status);
    }
    // elongation uses the REMAINING bore and contraction the INSERTION depth
    near(sealSpaceOut({ pbrLengthM: 6.1, insertLengthM: 3, expectedDLM: 1 }).availableM, 3.1, 1e-12);
    near(sealSpaceOut({ pbrLengthM: 6.1, insertLengthM: 3, expectedDLM: -1 }).availableM, 3.0, 1e-12);
  });

  it('divides a FIXED budget: the two availables always sum to the PBR length', () => {
    for (const ins of [0, 0.5, 1, 3, 3.05, 5, 6.1]) {
      near(spaceOutAt(6.1, ins, 1, -1).budgetM, 6.1, 1e-12);
    }
    const sweep = spaceOutSweep(6.1, 1.2, -2.8);
    expect(sweep).toHaveLength(21);
    for (const r of sweep) near(r.budgetM, 6.1, 1e-12);
  });

  it('bisects the both-pass band on the published job and finds it 0.3 m deeper', () => {
    const b = spaceOutBand(6.1, 1.2, -2.8, 0.5);
    expect(b.open).toBe(true);
    near(b.loM, 3.3, 1e-9);
    near(b.hiM, 4.4, 1e-9);
    near(b.widthM, 1.1, 1e-9);
    near(b.midM, 3.85, 1e-9);
    // the published landing of 3.0 m sits BELOW the band, which is why the
    // contraction case comes back WARN with 0.2 m to spare
    expect(3.0).toBeLessThan(b.loM);
    near(b.loM - 3.0, 0.3, 1e-9);
    expect(spaceOutAt(6.1, 3.0, 1.2, -2.8, 0.5).bothPass).toBe(false);
    expect(spaceOutAt(6.1, b.midM, 1.2, -2.8, 0.5).bothPass).toBe(true);
  });

  it('needs a PBR of the whole swing plus twice the margin, and no less', () => {
    near(minPbrLength(1.2, -2.8, 0.5), 5.0, 1e-9);
    near(minPbrLength(0.65, -3.15, 0.4), 4.6, 1e-9);
    expect(spaceOutBand(4.99, 1.2, -2.8, 0.5).open).toBe(false);
    expect(spaceOutBand(5.01, 1.2, -2.8, 0.5).open).toBe(true);
  });

  it('overtravels into a FAIL and refuses an impossible insertion', () => {
    expect(sealSpaceOut({ pbrLengthM: 6.1, insertLengthM: 3, expectedDLM: 3.5 }).status).toBe('FAIL');
    expect(() => sealSpaceOut({ pbrLengthM: 6.1, insertLengthM: 7 })).toThrow(/Insertion/);
    expect(() => sealSpaceOut({ pbrLengthM: 0, insertLengthM: 0 })).toThrow(/PBR/);
  });

  it('closes the Casing and Tubing course: a 6.1 m PBR carries all three of its cases', () => {
    const d = dr6SpaceOut(6.1, 0.5);
    expect(d.cases).toHaveLength(3);
    near(d.maxUpM, 0.894760459, 1e-9);
    near(d.maxDownM, -3.345136113, 1e-9);
    near(d.swingM, 4.239896572, 1e-9);
    near(d.minPbrM, 5.239896572, 1e-6);
    // two of the three failed a 1.5 m stroke in that course
    expect(dr6LengthChanges().filter((c) => !c.strokeOkAt1p5M)).toHaveLength(2);
    // and all three pass here, landed at the middle of the band
    expect(d.band.open).toBe(true);
    near(d.band.midM, 4.275187827, 1e-6);
    expect(d.atMid.every((r) => r.status === 'PASS')).toBe(true);
  });
});

describe('the capstone', () => {
  const V = capstoneValues();

  it('runs a program and a string that share nothing with the lessons', () => {
    expect(CAPSTONE.program.strings).toHaveLength(3);
    expect(CAPSTONE.components).toHaveLength(14);
    expect(CAPSTONE.tdMdM).not.toBe(PUBLISHED.tdMdM);
    expect(CAPSTONE.pbrLengthM).not.toBe(6.1);
    expect(CAPSTONE.marginM).not.toBe(0.5);
    // 2-7/8 inch jewelry, not 3-1/2
    near(CAPSTONE.components[0].odM / IN, 3.668, 1e-9);
    near(CAPSTONE.components[0].idM / IN, 2.441, 1e-9);
    // a 7 inch 32 lb/ft liner, tighter than the lessons' 29 lb/ft
    near(CAPSTONE.program.strings[2].sections[0].idM / IN, 6.094, 1e-9);
    expect(CAPSTONE.program.strings[2].sections[0].idM).toBeLessThan(6.184 * IN);
  });

  it('hides the surface string and then the production string in two merges', () => {
    const p = capstoneProfile();
    expect(p).toHaveLength(2);
    near(p[0].topMdM, 0, 1e-12);
    near(p[0].bottomMdM, 2000, 1e-12);
    expect(p[0].label).toBe('9-5/8in production casing');
    near(p[1].bottomMdM, 2900, 1e-12);
    expect(p[1].label).toBe('7in liner');
  });

  it('pins all eighteen graded values', () => {
    near(V.bottom_md_m, 2600.65, 1e-9);
    near(V.packer_bottom_md_m, 2594.4, 1e-9);
    near(V.drift_liner_m, 0.1516126, 1e-12);
    near(V.drift_surface_casing_m, 0.31137224999999996, 1e-12);
    near(V.string_capacity_m3, 7.852067852872123, 1e-9);
    near(V.string_displacement_m3, 17.767445424211306, 1e-9);
    near(V.worst_clearance_m, 0.0023875999999999897, 1e-12);
    near(V.spm_clearance_m, 0.024612599999999984, 1e-12);
    near(V.through_bore_min_id_m, 0.056007, 1e-12);
    near(V.through_bore_at_packer_id_m, 0.0587502, 1e-12);
    near(V.annulus_above_packer_m3, 67.27585926805148, 1e-6);
    near(V.below_packer_m3, 5.715910666870907, 1e-6);
    near(V.available_elongation_m, 3.07, 1e-9);
    near(V.available_contraction_m, 2.28, 1e-9);
    near(V.remaining_elongation_m, 2.42, 1e-9);
    near(V.remaining_contraction_m, -0.87, 1e-9);
    near(V.min_insertion_both_pass_m, 3.55, 1e-7);
    near(V.min_pbr_length_m, 4.6, 1e-7);
  });

  it('has no two graded values inside either tolerance of each other', () => {
    const F = [
      ['bottom_md_m', 5e-7], ['packer_bottom_md_m', 5e-7], ['drift_liner_m', 5e-8],
      ['drift_surface_casing_m', 5e-8], ['string_capacity_m3', 5e-7],
      ['string_displacement_m3', 5e-7], ['worst_clearance_m', 5e-8],
      ['spm_clearance_m', 5e-8], ['through_bore_min_id_m', 5e-8],
      ['through_bore_at_packer_id_m', 5e-8], ['annulus_above_packer_m3', 5e-7],
      ['below_packer_m3', 5e-7], ['available_elongation_m', 5e-7],
      ['available_contraction_m', 5e-7], ['remaining_elongation_m', 5e-7],
      ['remaining_contraction_m', 5e-7], ['min_insertion_both_pass_m', 5e-7],
      ['min_pbr_length_m', 5e-7],
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
    expect(pub.length).toBeGreaterThan(200);
    const tol = {
      drift_liner_m: 5e-8, drift_surface_casing_m: 5e-8, worst_clearance_m: 5e-8,
      spm_clearance_m: 5e-8, through_bore_min_id_m: 5e-8, through_bore_at_packer_id_m: 5e-8,
    };
    for (const [k, v] of Object.entries(V)) {
      const t = tol[k] ?? 5e-7;
      for (const p of pub) if (p !== 0) expect(Math.abs(p - v)).toBeGreaterThan(t);
    }
  });

  it('closes each tier on a sum the learner can check', () => {
    near(V.bottom_md_m, CAPSTONE.components.reduce((a, c) => a + c.lengthM, 0), 1e-9);
    expect(V.string_displacement_m3).toBeGreaterThan(V.string_capacity_m3);
    near(V.available_elongation_m + V.available_contraction_m, CAPSTONE.pbrLengthM, 1e-9);
    near(V.remaining_contraction_m, V.available_contraction_m - Math.abs(CAPSTONE.dlDownM), 1e-9);
    near(V.min_pbr_length_m, CAPSTONE.dlUpM - CAPSTONE.dlDownM + 2 * CAPSTONE.marginM, 1e-7);
    // the two tight rows share a governing drift, so their clearances differ
    // by exactly the difference of the two outside diameters
    near(V.spm_clearance_m - V.worst_clearance_m, (5.875 - 5.0) * IN, 1e-9);
  });

  it('warns on the packer and fails the contraction space-out', () => {
    const cl = capstoneClearance();
    expect(cl.worst.type).toBe('packer');
    expect(cl.worst.status).toBe('WARN');
    expect(cl.rows.filter((r) => r.status !== 'PASS')).toHaveLength(1);
    // the SAME packer passes the lessons' 7 inch 29 lb/ft liner
    expect(publishedClearance().rows.find((r) => r.type === 'packer').status).toBe('PASS');
    const so = capstoneSpaceOut();
    expect(so.up.status).toBe('PASS');
    expect(so.down.status).toBe('FAIL');
    expect(so.bothPass).toBe(false);
    // and there IS a landing that works: the band is open and 3.55 m deeper
    const band = capstoneBand();
    expect(band.open).toBe(true);
    expect(CAPSTONE.insertLengthM).toBeLessThan(band.loM);
    near(band.loM - CAPSTONE.insertLengthM, 1.27, 1e-7);
  });

  it('puts the XN no-go below the packer and the safety valve above it', () => {
    const tb = capstoneThroughBore();
    expect(tb.controlling).toMatch(/XN/);
    near(V.through_bore_at_packer_id_m / IN, 2.313, 1e-9);
    near(V.through_bore_min_id_m / IN, 2.205, 1e-9);
    expect(V.through_bore_min_id_m).toBeLessThan(V.through_bore_at_packer_id_m);
    expect(capstoneVolumes().warnings).toEqual([]);
  });
});
