// Every value the DR12 lab exposes to a panel, a lesson or the learning page is
// pinned here against the vendored engine's own golden, and so are the teaching
// CLAIMS. A course that asserts its numbers but not its arguments can have its
// argument quietly inverted by an engine change and still pass.

import { describe, it, expect } from 'vitest';
import * as L from './wellCostLab.js';

const G = L.GOLDEN;
const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the published case reproduces its golden', () => {
  it('the schedule, row for row', () => {
    const rows = L.publishedRows();
    expect(rows).toHaveLength(G.rows.length);
    rows.forEach((r, i) => {
      const g = G.rows[i];
      expect(r.id).toBe(g.id);
      near(r.productiveHr, g.productiveHr, 5e-9);
      near(r.durationHr, g.durationHr, 5e-9);
      near(r.endHr, g.endHr, 5e-9);
      near(r.endMdM, g.endMdM, 5e-9);
      near(r.drilledToM, g.drilledToM, 5e-9);
    });
  });

  it('the totals', () => {
    const t = L.publishedTotals();
    near(t.productiveHr, G.totals.productiveHr, 5e-9);
    near(t.nptHr, G.totals.nptHr, 5e-9);
    near(t.totalHr, G.totals.totalHr, 5e-9);
    near(t.totalDays, G.totals.totalDays, 5e-12);
    near(t.drilledM, G.totals.drilledM, 5e-9);
    near(t.tdMdM, G.totals.tdMdM, 5e-9);
  });

  it('the time-depth curve, breakpoint for breakpoint', () => {
    const c = L.publishedTimeDepthCurve();
    expect(c).toHaveLength(G.curve.length);
    c.forEach((p, i) => {
      near(p.tHr, G.curve[i].tHr, 5e-9);
      near(p.mdM, G.curve[i].mdM, 5e-9);
    });
    // The classic drilling curve: sloped while drilling, vertical while flat.
    // Depth never falls, and it only advances on a drill activity.
    for (let i = 1; i < c.length; i += 1) expect(c[i].mdM).toBeGreaterThanOrEqual(c[i - 1].mdM);
    const drills = L.publishedRows().filter((r) => r.kind === 'drill');
    const advancing = c.filter((p, i) => i > 0 && p.mdM > c[i - 1].mdM);
    expect(advancing).toHaveLength(drills.length);
  });

  it('the AFE, item by item', () => {
    const items = L.publishedAfeItems();
    expect(items).toHaveLength(G.afe.byItem.length);
    items.forEach((r, i) => {
      expect(r.id).toBe(G.afe.byItem[i].id);
      near(r.amountUsd, G.afe.byItem[i].amountUsd, 5e-7);
    });
  });

  it('the tangible / intangible split', () => {
    const s = L.publishedAfeSplit();
    near(s.tangibleUsd, G.afe.tangibleUsd, 5e-7);
    near(s.intangibleUsd, G.afe.intangibleUsd, 5e-7);
    near(s.baseUsd, G.afe.baseUsd, 5e-7);
    near(s.tangibleUsd + s.intangibleUsd, s.baseUsd, 5e-7);
    // An offshore AFE is mostly intangible: the tangibles are the steel that
    // stays in the ground, and here they are under a fifth of the base.
    expect(s.tangibleFrac).toBeLessThan(0.2);
  });

  it('contingency and the total', () => {
    near(L.publishedContingencyUsd(), G.afe.contingencyUsd, 5e-7);
    near(L.publishedTotalUsd(), G.afe.totalUsd, 5e-7);
    near(L.publishedTotalUsd(), G.afe.baseUsd + G.afe.contingencyUsd, 5e-7);
  });

  it('the cost-time curve and its checkpoint', () => {
    const pts = L.publishedCostCurve();
    expect(pts).toHaveLength(G.costCurve.length);
    pts.forEach((p, i) => {
      near(p.tHr, G.costCurve[i].tHr, 5e-9);
      near(p.usd, G.costCurve[i].usd, 5e-7);
    });
    const cp = L.publishedCostCurveCheckpoint();
    near(cp.tHr, G.costCurveCheckpoint.tHr, 5e-9);
    near(cp.usd, G.costCurveCheckpoint.usd, 5e-7);
  });

  it('cost per metre', () => {
    expect(L.publishedCostPerMeter()).toBe(G.costPerMeter.usdPerM);
  });

  it('the benchmark suggestion, and its honesty about unknowns', () => {
    expect(L.publishedBenchmark()).toEqual(G.benchmark.suggestion);
    expect(L.publishedBenchmark().indicative).toBe(true);
    expect(L.benchmarkSuggestion({ ...L.BENCHMARK_INPUTS, region: 'Atlantis' })).toBeNull();
    expect(L.benchmarkSuggestion({ ...L.BENCHMARK_INPUTS, mdM: 0 })).toBeNull();
  });

  it('the risk fixture evaluated at its modes', () => {
    const b = L.mcBaseAtModes();
    near(b.program.totals.totalHr, 160, 5e-9);
    // 5000 USD/h of spread over 160 h, plus the two lumps.
    near(b.totalUsd, 5000 * 160 + 200000 + 500000, 5e-7);
  });
});

describe('the closed forms, each against its driving input', () => {
  it('a drill activity is deltaMd / ROP, so footage is the invariant', () => {
    const s = L.ropSweep();
    for (const row of s) near(row.footageM, 1000, 5e-9);
    for (let i = 1; i < s.length; i += 1) expect(s[i].hr).toBeLessThan(s[i - 1].hr);
    // A hyperbola, not a line: halving ROP doubles the hours exactly.
    const at = (rop) => s.find((r) => r.ropMPerHr === rop).hr;
    near(at(5) / at(10), 2, 1e-12);
    near(at(10) / at(40), 4, 1e-12);
  });

  it('a trip is 2*md / v, and the 2 is the round trip', () => {
    for (const row of L.tripDepthSweep()) {
      near(row.roundTripRatio, 2, 1e-12);
      near(row.hr, (2 * row.mdM) / row.tripSpeedMPerHr, 1e-12);
    }
    // Linear in depth: twice the hole is twice the trip.
    const s = L.tripDepthSweep([1000, 2000]);
    near(s[1].hr / s[0].hr, 2, 1e-12);
  });

  it('casing is AFFINE, so the flat time is a floor no run speed removes', () => {
    const s = L.casingSpeedSweep();
    for (let i = 1; i < s.length; i += 1) expect(s[i].hr).toBeLessThan(s[i - 1].hr);
    for (const row of s) expect(row.hr).toBeGreaterThan(row.floorHr);
    // A first draft of this test asserted that doubling the run speed halves
    // the casing time. It does not, and the engine is right: only the RUNNING
    // half of the activity scales, and at the published speeds the flat time
    // (cement, wait on cement) is the larger half. At 400 m/h on 3000 m the
    // run is 7.5 h against 14 h flat, so doubling the speed buys 3.75 h out of
    // 21.5, which is 17 per cent and not 50.
    const at = (v) => s.find((r) => r.runSpeedMPerHr === v).hr;
    expect(at(800)).toBeGreaterThan(at(400) / 2);
    near(at(400) - at(800), 3000 / 400 - 3000 / 800, 1e-12);
    // and it converges onto the flat time, never onto zero
    const fast = L.casingSpeedSweep([1e9])[0];
    near(fast.hr, fast.floorHr, 1e-3);
  });

  it('a flat activity is its duration, and no rate touches it', () => {
    for (const row of L.flatDurationSweep()) expect(row.hr).toBe(row.durationHr);
    // The two flats on this well are 84 of the 384 productive hours, so a fifth
    // of the base programme is immune to every drilling-rate argument.
    const flats = L.publishedRows().filter((r) => r.kind === 'flat');
    const flatHr = flats.reduce((s, r) => s + r.productiveHr, 0);
    expect(flatHr).toBe(84);
    expect(flatHr / L.publishedTotals().productiveHr).toBeGreaterThan(0.2);
  });

  it('nptFrac is a fraction of PRODUCTIVE time, not of total time', () => {
    // THE ENGINE CONTRADICTED THE FIRST DRAFT OF THIS TEST, AND THE ENGINE IS
    // RIGHT ABOUT ITS OWN ARITHMETIC. The engine's header calls nptFrac "NPT
    // fraction of total time", so the draft asserted nptHr / totalHr ==
    // nptFrac. It does not hold: every activity is multiplied by (1 + nptFrac),
    // which makes the NPT hours nptFrac of the PRODUCTIVE hours and only
    // nptFrac / (1 + nptFrac) of the total. On the published well that is
    // 48 / 384 = 12.5 per cent against 48 / 432 = 11.1 per cent. The prose is
    // loose; the arithmetic is the definition, and it is the one this course
    // teaches, because reading it the other way understates a well by two days.
    for (const row of L.nptSweep()) {
      near(row.shareOfProductive, row.nptFrac, 1e-12);
      near(row.shareOfTotal, row.nptFrac / (1 + row.nptFrac), 1e-12);
      near(row.totalHr, row.productiveHr * (1 + row.nptFrac), 1e-9);
      if (row.nptFrac > 0) expect(row.shareOfTotal).toBeLessThan(row.nptFrac);
    }
    // and the productive hours are the same well every time: NPT stretches the
    // schedule, it does not change the work.
    const productive = L.nptSweep().map((r) => r.productiveHr);
    expect(new Set(productive).size).toBe(1);
    // the published 12.5 per cent really is 48 h on 384, not on 432
    const p = L.publishedTotals();
    near(p.nptHr / p.productiveHr, L.NPT_FRAC, 1e-12);
    near(p.nptHr / p.totalHr, 1 / 9, 1e-12);
  });
});

describe('the claims the cost-time curve makes', () => {
  it('THE ENDPOINT IDENTITY: the last point is the BASE subtotal, not the total', () => {
    // Tolerance: the published case is EXACT, so it is pinned with toBe rather
    // than a tolerance at all. Across the schedule sweep the worst disagreement
    // is 9.3e-10 USD on a 5.4 million dollar subtotal, which is 1.7e-16
    // relative, or one unit in the last place of a double. That is the only
    // tolerance the identity needs: 5e-9 USD absolute is two ULPs of headroom
    // and nothing more. Anything larger would be hiding a modelling error
    // rather than a rounding one, because the two sides are literally the same
    // sums of the same products in a different order.
    const c = L.curveEndpointCheck();
    expect(c.endUsd).toBe(c.baseUsd);
    expect(c.endUsd).toBe(G.afe.baseUsd);
    for (const row of L.endpointIdentitySweep()) {
      near(row.endUsd, row.baseUsd, 5e-9);
      expect(row.relError).toBeLessThan(1e-15);
    }
    // and it is NOT the total, because contingency is a provision and
    // provisions do not accrue. A curve drawn to the total would be showing
    // money nobody has spent.
    expect(c.endUsd).toBeLessThan(c.totalUsd);
    near(c.totalUsd - c.endUsd, c.contingencyUsd, 5e-9);
  });

  it('the curve is non-decreasing and starts at zero on this well', () => {
    const pts = L.publishedCostCurve();
    expect(pts[0].usd).toBe(0);
    for (let i = 1; i < pts.length; i += 1) expect(pts[i].usd).toBeGreaterThan(pts[i - 1].usd);
  });

  it('an UNLINKED lump steps in at spud, before a metre is drilled', () => {
    const pts = L.unlinkedLumpCurve(123456);
    expect(pts[0].usd).toBe(123456);
    near(pts[pts.length - 1].usd, G.afe.baseUsd + 123456, 5e-7);
    // Every published lump is linked to an activity, which is why the golden's
    // curve starts at zero. Leaving the link off does not make the money go
    // away, it moves the cash out to day zero.
    expect(L.ITEMS.filter((i) => i.basis === 'lump').every((i) => i.atActivityId != null)).toBe(true);
  });
});

describe('the claims about exposure: what a schedule slip can and cannot reach', () => {
  it('a per-day line is exposed to a slip, a lump is not, in BOTH directions', () => {
    const s = L.basisSlipSweep();
    const at = (f) => s.find((r) => r.slipFactor === f);
    const base = at(1);
    near(base.perDayUsd, L.NOMINAL_USD, 5e-7);
    near(base.perMeterUsd, L.NOMINAL_USD, 5e-7);
    near(base.lumpUsd, L.NOMINAL_USD, 5e-7);

    // Slipping: the day rate tracks the slip one for one.
    const slipped = at(1.5);
    expect(slipped.totalDays).toBeGreaterThan(base.totalDays);
    near(slipped.perDayUsd / base.perDayUsd, 1.5, 1e-12);
    near(slipped.perDayUsd, 1.5 * L.NOMINAL_USD, 5e-7);
    expect(slipped.lumpUsd).toBe(base.lumpUsd);
    expect(slipped.perMeterUsd).toBe(base.perMeterUsd);

    // Beating the plan: the same asymmetry the other way round. The day rate
    // gives money back, the lump does not, which is why a saving on a lump-sum
    // scope has to be negotiated and a saving on days is automatic.
    const gained = at(0.9);
    expect(gained.totalDays).toBeLessThan(base.totalDays);
    near(gained.perDayUsd / base.perDayUsd, 0.9, 1e-12);
    expect(gained.lumpUsd).toBe(base.lumpUsd);
    expect(gained.perMeterUsd).toBe(base.perMeterUsd);

    // and across the whole sweep the day rate is strictly monotone in the slip
    // while the other two never move at all.
    for (let i = 1; i < s.length; i += 1) {
      expect(s[i].perDayUsd).toBeGreaterThan(s[i - 1].perDayUsd);
      expect(s[i].lumpUsd).toBe(s[0].lumpUsd);
      expect(s[i].perMeterUsd).toBe(s[0].perMeterUsd);
    }
  });

  it('a per-meter line is exposed to FOOTAGE and is deaf to time', () => {
    // The other half of the argument, and the reason the three bases are three
    // and not two: per-meter money is immune to a slip but moves the moment the
    // well gets deeper. Dropping the last drill activity is 1000 m of hole.
    const base = L.publishedProgram();
    const shorter = L.programOf({
      activities: L.ACTIVITIES.filter((a) => !['a7', 'a8', 'a9'].includes(a.id)),
    });
    expect(shorter.totals.drilledM).toBe(2000);
    const perMeterRate = L.ITEMS.filter((i) => i.basis === 'per-meter')
      .reduce((s, i) => s + i.rate, 0);
    const dropped = L.afeOf(base).byItem.find((r) => r.id === 'c3').amountUsd
      - L.afeOf(shorter).byItem.find((r) => r.id === 'c3').amountUsd;
    near(dropped, perMeterRate * 1000, 5e-7);
    // while the slip sweep above left that same line untouched at every slip
    expect(L.basisSlipSweep().every((r) => r.drilledM === 3000)).toBe(true);
  });

  it('slipping the REAL programme moves the base only through the day rates', () => {
    const base = L.afeOf(L.publishedProgram());
    const slipped = L.afeOf(L.programAtSlip(1.5));
    const extraDays = L.programAtSlip(1.5).totals.totalDays - L.publishedTotals().totalDays;
    const perDayRate = L.RIG_RATE_USD_PER_HR * L.HOURS_PER_DAY;
    near(slipped.baseUsd - base.baseUsd, perDayRate * extraDays, 5e-7);
    // every lump line is byte-identical across the slip
    for (const item of base.byItem.filter((r) => r.basis === 'lump')) {
      expect(slipped.byItem.find((r) => r.id === item.id).amountUsd).toBe(item.amountUsd);
    }
    // and a slip below the no-NPT floor is refused rather than silently
    // producing negative non-productive time
    expect(() => L.programAtSlip(0.5)).toThrow(/nptFrac/);
  });
});

describe('the claims contingency makes', () => {
  it('the base subtotal does not move with the contingency fraction', () => {
    const bases = L.contingencySweep().map((r) => r.baseUsd);
    expect(new Set(bases).size).toBe(1);
    expect(bases[0]).toBe(G.afe.baseUsd);
    // contingency is strictly linear in the fraction, on that fixed base
    for (const row of L.contingencySweep()) {
      near(row.contingencyUsd, row.contingencyFrac * row.baseUsd, 5e-7);
      near(row.totalUsd, row.baseUsd + row.contingencyUsd, 5e-7);
    }
  });

  it('at the PUBLISHED 10 per cent the provision already outranks five real lines', () => {
    // Not a rounding allowance even at a modest fraction: 538,000 USD is the
    // fourth largest number on this AFE. A first draft of this test said it
    // beat four lines, counting by eye down the item list; the engine's own
    // amounts say FIVE, because the completion services scope is 500,000 and
    // also falls under the provision. Ahead of it are only the rig, the
    // services spread and the casing.
    const at10 = L.contingencySweep([L.CONTINGENCY_FRAC])[0];
    expect(at10.rank).toBe(4);
    const beaten = L.publishedAfeItems().filter((r) => r.amountUsd < at10.contingencyUsd);
    expect(beaten).toHaveLength(5);
    expect(beaten.map((r) => r.id).sort()).toEqual(['c3', 'c5', 'c6', 'c7', 'c8']);
    const ahead = L.publishedAfeItems().filter((r) => r.amountUsd > at10.contingencyUsd);
    expect(ahead.map((r) => r.id).sort()).toEqual(['c1', 'c2', 'c4']);
  });

  it('THE CROSSING: the fraction at which the provision overtakes the largest line', () => {
    // Derived by bisection on the engine's own rollup, which is not told the
    // closed form. The largest real line is the rig day rate at 1.8 million on
    // a 5.38 million base, so the crossing is 33.46 per cent: a frontier
    // exploration contingency is enough to make the provision the single
    // biggest number in the estimate.
    const c = L.searchContingencyCrossing();
    near(c.frac, 0.3345724907063197, 1e-9);
    near(c.frac, c.closedForm, 1e-9);
    expect(c.largestItemId).toBe('c1');
    near(c.contingencyUsd, c.largestItemUsd, 1e-6);
    // and it really is a crossing: below it the rig wins, above it the
    // provision does, with no tie anywhere else
    const below = L.contingencySweep([c.frac * 0.99])[0];
    const above = L.contingencySweep([c.frac * 1.01])[0];
    expect(below.outranksLargestItem).toBe(false);
    expect(below.rank).toBe(2);
    expect(above.outranksLargestItem).toBe(true);
    expect(above.rank).toBe(1);
  });
});

describe('the claims cost per metre makes', () => {
  it('cost per metre can RANK SECTIONS DIFFERENTLY from total spend', () => {
    // The claim the Expert tier is built on. On the long-intermediate well the
    // 17.5 inch hole is the single biggest cheque on the well AND the cheapest
    // metre on it, while the short 12.25 inch hole is the dearest metre and
    // only the second biggest cheque. So "where the money goes" and "where the
    // money is inefficient" are two different questions with two different
    // answers, and an efficiency programme aimed by the wrong one aims at the
    // wrong section.
    const r = L.sectionRankings(L.LONG_INTERMEDIATE_SECTIONS);
    expect(r.bySpend).toEqual(['intermediate', 'production', 'surface']);
    expect(r.byUnitCost).toEqual(['production', 'intermediate', 'surface']);
    expect(r.bySpend).not.toEqual(r.byUnitCost);
    const by = (tag) => r.rows.find((x) => x.tag === tag);
    expect(by('intermediate').sectionUsd).toBeGreaterThan(by('production').sectionUsd);
    expect(by('intermediate').usdPerM).toBeLessThan(by('production').usdPerM);
  });

  it('but on the PUBLISHED well the two orderings agree, so the inversion has a cause', () => {
    // Written from the engine rather than from the claim. A first draft
    // asserted the inversion on the published well and the engine disagreed:
    // there the production hole is both the biggest cheque and the dearest
    // metre, because its 1000 m interval is not short enough relative to the
    // 1500 m intermediate to reverse the ordering. The inversion is not a
    // property of every well, it is caused by a LONG cheap section sitting
    // beside a SHORT dear one, and saying so is the actual teaching point.
    const r = L.sectionRankings();
    expect(r.bySpend).toEqual(['production', 'intermediate', 'surface']);
    expect(r.byUnitCost).toEqual(r.bySpend);
    // the difference between the two wells is the intermediate footage
    const pub = r.rows.find((x) => x.tag === 'intermediate').intervalM;
    const long = L.LONG_INTERMEDIATE_SECTIONS.find((x) => x.tag === 'intermediate').intervalM;
    expect(long).toBeGreaterThan(pub);
  });

  it('the ADE closed form: affine in bit cost and in rig hours, at 1 / interval', () => {
    const base = { ...L.COST_PER_METER_INPUTS };
    const at = (over) => L.costPerMeter({ ...base, ...over });
    // slope in bit cost is exactly 1 / interval
    near((at({ bitCostUsd: 150000 }) - at({})) / 100000, 1 / base.intervalM, 1e-15);
    // slope in EACH of the three hour terms is rigRate / interval, and they are
    // interchangeable: an hour tripping costs what an hour drilling costs
    for (const key of ['drillingHr', 'connectionHr', 'tripHr']) {
      near((at({ [key]: base[key] + 10 }) - at({})) / 10,
        base.rigRateUsdPerHr / base.intervalM, 1e-12);
    }
    // and doubling the rig rate does NOT double the cost per metre, because the
    // bit is not rig time. On the published inputs it buys a factor of 1.94.
    near(at({ rigRateUsdPerHr: 2 * base.rigRateUsdPerHr }) / at({}), 1.9350649350649352, 1e-12);
    expect(at({ rigRateUsdPerHr: 2 * base.rigRateUsdPerHr }) / at({})).toBeLessThan(2);
    // a zero-length interval is refused rather than returning Infinity
    expect(() => at({ intervalM: 0 })).toThrow(/intervalM/);
  });

  it('more footage lowers the unit cost onto an ASYMPTOTE, not towards zero', () => {
    const s = L.footageSweep();
    for (let i = 1; i < s.length; i += 1) expect(s[i].usdPerM).toBeLessThan(s[i - 1].usdPerM);
    for (const row of s) expect(row.usdPerM).toBeGreaterThan(row.asymptoteUsdPerM);
    // the floor is rigRate / ROP, the cost of the rig time the hole itself
    // takes, and no amount of footage amortises that away
    const far = L.footageSweep([1e7])[0];
    near(far.usdPerM, far.asymptoteUsdPerM, 1);
    // the golden's published case sits on this sweep at 1000 m
    near(s.find((r) => r.intervalM === 1000).usdPerM, G.costPerMeter.usdPerM, 1e-9);
  });
});

describe('the claim the risk fixture makes', () => {
  it('the deterministic base case is NOT the risked mean, and sits BELOW it', () => {
    // The engine is deterministic by design and the suite's canonical Monte
    // Carlo module samples around it. The golden publishes the analytic mean of
    // that sampling, and it does not equal the base case: a triangular mean is
    // (min + mode + max) / 3, not the mode, so a base case built at the modes
    // is a mode-of-modes and lands below the mean here by 2 per cent.
    const b = L.mcBaseAtModes();
    const tri = (d) => (d.min + d.mode + d.max) / 3;
    const dists = G.mc.uncertainties;
    const meanHr = 100 + dists.filter((u) => u.target === 'activity')
      .reduce((s, u) => s + tri(u.dist), 0);
    near(meanHr / 24, L.MC_ANALYTIC.meanDays, 1e-9);
    expect(b.totalDays).toBeLessThan(L.MC_ANALYTIC.meanDays);
    expect(b.totalUsd).toBeLessThan(L.MC_ANALYTIC.meanUsd);
    near(L.MC_ANALYTIC.meanUsd - b.totalUsd, 30000, 5e-7);
    // and NOT because every distribution is skewed upwards. One of them is not:
    // phase 2 has mode 20 h against a mean of 18 h and pulls the other way. A
    // first draft asserted uniform right skew and the golden refused it. The
    // aggregate leans up because the other three lean up harder, which is the
    // honest version of the argument and the one a learner can check.
    const byId = (id) => dists.find((u) => u.id === id).dist;
    expect(tri(byId('m3'))).toBeLessThan(byId('m3').mode);
    for (const id of ['m2', 'm4', 'mc2']) expect(tri(byId(id))).toBeGreaterThan(byId(id).mode);
  });
});
