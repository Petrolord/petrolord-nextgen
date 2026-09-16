// HEADER PLACEHOLDER, REWRITTEN AFTER THE FIRST RUN.
const R = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const S = await import(`${R}/engines/production/surveillance.js`);
const A = await import(`${R}/engines/production/allocation.js`);
const LS = await import(`${R}/engines/production/liftScreening.js`);
const LA = await import(`${R}/engines/production/liftAdvisor.js`);
import * as fs from 'fs';

const MS_DAY = 86400000;
const isoOf = (dayNum) => new Date(dayNum * MS_DAY).toISOString().slice(0, 10);
const dayOf = (iso) => Math.round(new Date(`${iso}T00:00:00Z`).getTime() / MS_DAY);

export const CAP = {
  field: 'AKASO',
  firstDate: '2026-02-05',   // golden surveillance ledger runs 2025-01-31 to 2025-06-30; golden allocation 2025-01-25 to 2025-02-05
  lastDate: '2026-04-25',    // golden surveillance asOf 2025-06-30; golden allocation last total 2025-02-05
  allocFromDate: '2026-04-05', // the golden allocates 12 days of totals; this allocates 21
  a12LastReportDate: '2026-04-14', // golden's stale well P-4 stops 20 days before asOf; AKASO-12 stops 11

  // ---- AKASO-4, the seam well --------------------------------------------
  // Thirty days of a perfectly constant gas-oil ratio and a perfectly constant
  // watercut on a rate that moves, then seven days in which the rate collapses
  // and the gas does not follow it down. Constant ratios in the baseline are
  // the point: where the daily ratio does not move, a mean of ratios and a
  // ratio of sums are the same number, so the whole disagreement is created in
  // the recent window and nowhere else.
  a4BaselineOilCycle: [1184, 1163, 1201, 1172, 1195, 1158], // golden P-1 baseline oil is a flat 900 stb/d
  a4BaselineWaterFrac: 0.27,   // water as a fraction of oil, so watercut = 0.27/1.27 exactly;
                               // golden P-1 baseline watercut is 0.35251798561151076
  a4BaselineGasFrac: 0.7,      // Mscf of gas per stb of oil, so GOR = 700 scf/stb exactly;
                               // golden P-1 baseline GOR is 800 scf/stb
  // The seven recent days, oldest first: [oil stb, water stb, gas Mscf], hours 24 throughout.
  // Hours are held at 24 deliberately, so that nothing in this well's story can
  // be blamed on uptime. That job belongs to AKASO-6.
  a4Recent: [
    [1146, 381, 861],   // golden P-1 recent rows are oil 700/650/600, water 850/870/890, gas 900/920/940
    [1132, 377, 848],   // golden: none of these
    [1151, 384, 869],   // golden: none
    [63, 214, 107],     // golden: none; the golden's lowest producer row is 100 stb/d
    [58, 206, 101],     // golden: none
    [66, 219, 112],     // golden: none
    [61, 211, 104],     // golden: none
  ],
  a4GradedLowDayIndex: 3,  // an array index, not a physical condition: the first collapsed day

  // ---- AKASO-6, the uptime well ------------------------------------------
  // The calendar-day volume falls by more than half. The producing-day rate
  // does not move. Every recent day carries a different hours_on, so no mean
  // in this well's story can be read off a single condition.
  a6BaselineOilCycle: [648, 634, 655, 641], // golden P-5 baseline oil is a flat 300 stb/d
  a6BaselineWaterFrac: 0.18,   // watercut = 0.18/1.18; golden P-5 has no watercut exception at all
  a6BaselineGasFrac: 0.55,     // GOR = 550 scf/stb; golden P-1 GOR baseline is 800
  // [hours_on, oil stb, water stb, gas Mscf], oldest first.
  a6Recent: [
    [11.4, 297.5, 53.6, 164.0], // golden P-5 downtime rows are a flat 8.0 h at 100 stb/d
    [9.6, 251.0, 45.2, 138.5],  // golden: none
    [13.2, 344.8, 62.1, 190.1], // golden: none
    [8.1, 211.5, 38.1, 116.6],  // golden: none
    [12.7, 331.8, 59.7, 182.9], // golden: none
    [10.3, 269.1, 48.4, 148.4], // golden: none
    [14.2, 370.9, 66.8, 204.5], // golden: none
  ],
  a6GradedRecentIndex: 0,   // an array index: the first recent day, 11.4 h

  // ---- AKASO-8, the clean well and the decline overlay --------------------
  // The only well on the field that raises no exception at all. It is dropping
  // 0.21 percent a day, which over the surveillance windows is a four percent
  // change and is invisible to every threshold in DEFAULT_SURVEILLANCE_SETTINGS.
  a8Qi: 940,        // stb/d at the first ledger date; golden syntheticDecline starts at 1200
  a8Di: 0.0021,     // nominal per DAY; golden effectiveDecline cases run Di 0.0015, 0.003, 0.0005
  a8WaterFrac: 0.42, // watercut = 0.42/1.42
  a8GasFrac: 0.61,   // GOR = 610 scf/stb

  // ---- AKASO-12, the well that stops reporting ---------------------------
  // It never records hours_on at all, and after 2026-04-14 it stops sending
  // rows. It does not stop producing: the facility meter keeps seeing it.
  a12Qi: 455,       // stb/d at the first ledger date; golden P-4 (its stale well) runs a flat 200
  a12Di: 0.0125,    // per day, a much steeper fall than AKASO-8's
  a12WaterFrac: 0.30,
  a12GasFrac: 0.53,

  // ---- AKASO-2W, the injector --------------------------------------------
  a2wBaselineCycle: [3240, 3180, 3260],  // golden I-1 baseline injection is a flat 3000 stb/d
  a2wRecent: [2140, 2080, 2160, 2100, 2050, 2190, 2120], // golden I-1 recent is a flat 1900 stb/d

  // ---- AKASO-15, the observation well ------------------------------------
  // Zero volumes and a full 24 hours recorded every single day. It is typed
  // observation, so detectExceptions drops it. computeKpis does not.
  a15HoursOn: 24,   // golden O-1 carries rows too, but the golden never prints what they do to uptime

  // ---- the facility meter -------------------------------------------------
  meterBias: 1.012, // the metered total runs 1.2 percent above the sum of the wells' true
                    // oil; the golden's metered totals are typed independently of its ledger

  // ---- the well tests -----------------------------------------------------
  // Rates in stb/d and Mscf/d, dates ISO. maxTestAgeDays is left at the
  // engine default of 180.
  tests: [
    // AKASO-4: two valid tests, the later one in force for the whole window.
    { id: 't-a4-1', well_id: 'w-akaso-4', test_date: '2025-11-20', oil_rate_stbd: 1210, water_rate_stbd: 328, gas_rate_mscfd: 848, duration_hours: 24, thp_psia: 340, is_valid: true },  // golden t-p1-a is 2024-12-20, 1200/300/640
    { id: 't-a4-2', well_id: 'w-akaso-4', test_date: '2026-04-02', oil_rate_stbd: 1165, water_rate_stbd: 316, gas_rate_mscfd: 816, duration_hours: 12, thp_psia: 335, is_valid: true },  // golden t-p1-b is 2025-02-05, 980/520/610
    { id: 't-a6-1', well_id: 'w-akaso-6', test_date: '2026-03-11', oil_rate_stbd: 651, water_rate_stbd: 117, gas_rate_mscfd: 358, duration_hours: 18, thp_psia: 295, is_valid: true },   // golden t-p2-a is 2024-09-15, 640/60/210
    // t-a8-1 is flagged is_valid TRUE and its watercut is eleven points off the
    // ledger on its own test date. validateWellTests says so; groupTests reads
    // is_valid and nothing else, so the test carries the well regardless.
    { id: 't-a8-1', well_id: 'w-akaso-8', test_date: '2026-02-18', oil_rate_stbd: 905, water_rate_stbd: 620, gas_rate_mscfd: 552, duration_hours: 24, thp_psia: 310, is_valid: true },   // golden publishes no third valid producer test, and no valid test that its own QC flags
    // AKASO-12: the old test that ages out, and the recent one QC threw away.
    { id: 't-a12-1', well_id: 'w-akaso-12', test_date: '2025-09-14', oil_rate_stbd: 455, water_rate_stbd: 195, gas_rate_mscfd: 241, duration_hours: 20, thp_psia: 260, is_valid: true }, // golden: no aged-out valid test exists
    { id: 't-a12-2', well_id: 'w-akaso-12', test_date: '2026-03-30', oil_rate_stbd: 402, water_rate_stbd: 172, gas_rate_mscfd: 213, duration_hours: 3.0, thp_psia: 248, is_valid: false }, // golden t-p3-a is 2025-01-28 and recorded ZERO flow; this one recorded real rates and was failed for duration
  ],
};

// ---------------------------------------------------------------------------
// THE LEDGER
// ---------------------------------------------------------------------------
const D0 = dayOf(CAP.firstDate);
const DN = dayOf(CAP.lastDate);
const NDAYS = DN - D0 + 1;
const DATES = [];
for (let d = D0; d <= DN; d += 1) DATES.push(isoOf(d));

export const WELLS = {
  a4: { id: 'w-akaso-4', name: 'AKASO-4', well_type: 'producer' },
  a6: { id: 'w-akaso-6', name: 'AKASO-6', well_type: 'producer' },
  a8: { id: 'w-akaso-8', name: 'AKASO-8', well_type: 'producer' },
  a12: { id: 'w-akaso-12', name: 'AKASO-12', well_type: 'producer' },
  a2w: { id: 'w-akaso-2w', name: 'AKASO-2W', well_type: 'injector' },
  a15: { id: 'w-akaso-15', name: 'AKASO-15', well_type: 'observation' },
};

const row = (well, date, o) => ({
  well, well_id: well.id, prod_date: date,
  oil_stb: 0, water_stb: 0, gas_mscf: 0, winj_stb: 0, ginj_mscf: 0, hours_on: 24, ...o,
});

// AKASO-12's TRUE oil, which continues after it stops sending rows. Only the
// facility meter ever sees this after 2026-04-14.
const a12TrueOil = (i) => CAP.a12Qi * Math.exp(-CAP.a12Di * i);
const a8Oil = (i) => CAP.a8Qi * Math.exp(-CAP.a8Di * i);

const LEDGER = [];
const A12_LAST = dayOf(CAP.a12LastReportDate) - D0;
DATES.forEach((date, i) => {
  const back = NDAYS - 1 - i;              // 0 on the last date
  const recent = back < 7;                 // the seven-day test window
  const r = 6 - back;                      // index into the recent tables

  // AKASO-4
  if (recent) {
    const [o, w, g] = CAP.a4Recent[r];
    LEDGER.push(row(WELLS.a4, date, { oil_stb: o, water_stb: w, gas_mscf: g }));
  } else {
    const o = CAP.a4BaselineOilCycle[i % CAP.a4BaselineOilCycle.length];
    LEDGER.push(row(WELLS.a4, date, {
      oil_stb: o, water_stb: CAP.a4BaselineWaterFrac * o, gas_mscf: CAP.a4BaselineGasFrac * o,
    }));
  }

  // AKASO-6
  if (recent) {
    const [h, o, w, g] = CAP.a6Recent[r];
    LEDGER.push(row(WELLS.a6, date, { oil_stb: o, water_stb: w, gas_mscf: g, hours_on: h }));
  } else {
    const o = CAP.a6BaselineOilCycle[i % CAP.a6BaselineOilCycle.length];
    LEDGER.push(row(WELLS.a6, date, {
      oil_stb: o, water_stb: CAP.a6BaselineWaterFrac * o, gas_mscf: CAP.a6BaselineGasFrac * o,
    }));
  }

  // AKASO-8
  {
    const o = a8Oil(i);
    LEDGER.push(row(WELLS.a8, date, {
      oil_stb: o, water_stb: CAP.a8WaterFrac * o, gas_mscf: CAP.a8GasFrac * o,
    }));
  }

  // AKASO-12, only while it is still sending rows, and never with an hours column
  if (i <= A12_LAST) {
    const o = a12TrueOil(i);
    LEDGER.push(row(WELLS.a12, date, {
      oil_stb: o, water_stb: CAP.a12WaterFrac * o, gas_mscf: CAP.a12GasFrac * o, hours_on: null,
    }));
  }

  // AKASO-2W, the injector
  const winj = recent
    ? CAP.a2wRecent[r]
    : CAP.a2wBaselineCycle[i % CAP.a2wBaselineCycle.length];
  LEDGER.push(row(WELLS.a2w, date, { winj_stb: winj }));

  // AKASO-15, the observation well: nothing produced, a full day recorded
  LEDGER.push(row(WELLS.a15, date, { hours_on: CAP.a15HoursOn }));
});

// The facility meter. It sees every producer's TRUE oil, AKASO-12 included,
// whether or not that well sent a row, plus a fixed meter bias.
const ALLOC_FROM = dayOf(CAP.allocFromDate) - D0;
const TOTALS = [];
for (let i = ALLOC_FROM; i < NDAYS; i += 1) {
  const back = NDAYS - 1 - i;
  const recent = back < 7;
  const r = 6 - back;
  const a4 = recent ? CAP.a4Recent[r] : null;
  const a6 = recent ? CAP.a6Recent[r] : null;
  const oil4 = a4 ? a4[0] : CAP.a4BaselineOilCycle[i % CAP.a4BaselineOilCycle.length];
  const wat4 = a4 ? a4[1] : CAP.a4BaselineWaterFrac * oil4;
  const gas4 = a4 ? a4[2] : CAP.a4BaselineGasFrac * oil4;
  const oil6 = a6 ? a6[1] : CAP.a6BaselineOilCycle[i % CAP.a6BaselineOilCycle.length];
  const wat6 = a6 ? a6[2] : CAP.a6BaselineWaterFrac * oil6;
  const gas6 = a6 ? a6[3] : CAP.a6BaselineGasFrac * oil6;
  const oil8 = a8Oil(i);
  const oil12 = a12TrueOil(i);
  TOTALS.push({
    total_date: DATES[i],
    oil_stb: (oil4 + oil6 + oil8 + oil12) * CAP.meterBias,
    water_stb: (wat4 + wat6 + CAP.a8WaterFrac * oil8 + CAP.a12WaterFrac * oil12) * CAP.meterBias,
    gas_mscf: (gas4 + gas6 + CAP.a8GasFrac * oil8 + CAP.a12GasFrac * oil12) * CAP.meterBias,
  });
}

// ---------------------------------------------------------------------------
export function capstoneValues() {
  const wellSeries = S.buildWellSeries(LEDGER);
  const fieldSeries = S.buildFieldSeries(LEDGER);
  const byName = new Map(wellSeries.map((s) => [s.well.name, s]));

  // --- one row, read by derivePoint ---------------------------------------
  const a4Pts = byName.get('AKASO-4').points;
  const a6Pts = byName.get('AKASO-6').points;
  const a8Pts = byName.get('AKASO-8').points;
  const a12Pts = byName.get('AKASO-12').points;
  const a4Low = a4Pts[a4Pts.length - 7 + CAP.a4GradedLowDayIndex];
  const a6First = a6Pts[a6Pts.length - 7 + CAP.a6GradedRecentIndex];

  // --- one window, read by computeKpis ------------------------------------
  const kpi7 = S.computeKpis(wellSeries, fieldSeries, { windowDays: 7 });
  const kpi30 = S.computeKpis(wellSeries, fieldSeries, { windowDays: 30 });
  // The same KPI call with the observation well removed, aux only.
  const noObs = LEDGER.filter((r) => r.well_id !== WELLS.a15.id);
  const kpi7NoObs = S.computeKpis(S.buildWellSeries(noObs), S.buildFieldSeries(noObs), { windowDays: 7 });

  // --- two windows, read by detectExceptions ------------------------------
  const det = S.detectExceptions(wellSeries);
  const pick = (name, type) => det.exceptions.find((e) => e.wellName === name && e.type === type);
  const a4Rate = pick('AKASO-4', 'rate_drop');
  const a4Wc = pick('AKASO-4', 'watercut_rise');
  const a4Gor = pick('AKASO-4', 'gor_rise');
  const a6Rate = pick('AKASO-6', 'rate_drop');
  const a6Down = pick('AKASO-6', 'downtime');
  const a12Stale = pick('AKASO-12', 'stale_data');
  const a2wInj = pick('AKASO-2W', 'injection_drop');
  // The same pass with the stale window widened past the gap, aux only: the
  // early return in detectExceptions is what this measures.
  const detWide = S.detectExceptions(wellSeries, { staleDays: 30 });

  // --- the SAME well and the SAME window, read volumetrically -------------
  // buildFieldSeries over one well's rows is that well's own daily total, and
  // computeKpis over it forms the period ratios the way the module header says
  // a period ratio is formed. Both numbers below are engine return values.
  const a4Rows = LEDGER.filter((r) => r.well_id === WELLS.a4.id);
  const a4Vol7 = S.computeKpis(S.buildWellSeries(a4Rows), S.buildFieldSeries(a4Rows), { windowDays: 7 });
  const a4Vol30base = (() => {
    // the baseline window read the same way, aux only: 30 days ending seven
    // days before the frontier
    const cut = DATES[NDAYS - 8];
    const sub = a4Rows.filter((r) => r.prod_date <= cut);
    return S.computeKpis(S.buildWellSeries(sub), S.buildFieldSeries(sub), { windowDays: 30 });
  })();

  // --- the moving average, aux only ---------------------------------------
  const a4Ma7 = S.movingAverage(a4Pts, 'oil', 7);
  const a4MaGor7 = S.movingAverage(a4Pts, 'gor', 7);

  // --- the metered total, read by computeAllocation -----------------------
  const allocInput = {
    wells: Object.values(WELLS), tests: CAP.tests, ledger: LEDGER, totals: TOTALS,
  };
  const alloc = S.buildWellSeries ? A.computeAllocation(allocInput) : null;
  const allocInv = A.computeAllocation({ ...allocInput, settings: { includeInvalidTests: true } });
  const allocLedger = A.computeAllocation({ ...allocInput, settings: { basis: 'ledger' } });
  const allocNoUptime = A.computeAllocation({ ...allocInput, settings: { useUptime: false } });
  const last = alloc.days[alloc.days.length - 1];
  const lastInv = allocInv.days[allocInv.days.length - 1];
  const a8Alloc = alloc.wells.find((w) => w.wellName === 'AKASO-8');
  const a12AllocInv = allocInv.wells.find((w) => w.wellName === 'AKASO-12');
  const imb = A.imbalanceSeries(alloc, LEDGER);
  const imbInv = A.imbalanceSeries(allocInv, LEDGER);
  const imbLast = imb[imb.length - 1];
  const monthly = A.monthlyFactors(alloc);
  const monthlyInv = A.monthlyFactors(allocInv);
  const qc = A.validateWellTests(CAP.tests, wellSeries);

  // --- the decline overlay, through the canonical Arps engine -------------
  const fit8 = S.fitWellDecline(a8Pts, { stream: 'oil', basis: 'producing', modelType: 'Auto-Select' });
  const p8 = fit8.fit.parameters;
  const eff8 = S.annualEffectiveDecline(p8.Di, p8.b, p8.modelType);
  const fit12 = S.fitWellDecline(a12Pts, { stream: 'oil', basis: 'producing', modelType: 'Auto-Select' });
  const p12 = fit12.fit.parameters;
  const eff12 = S.annualEffectiveDecline(p12.Di, p12.b, p12.modelType);
  const fit4 = S.fitWellDecline(a4Pts, { stream: 'oil', basis: 'producing', modelType: 'Auto-Select' });

  // --- the lift chain, fed by the two layers above ------------------------
  // Every input below is an engine return value from the surveillance or the
  // allocation pass, converted only at the door where liftAdvisor asks for a
  // per cent rather than a fraction.
  const a4LastAlloc = last.entries.find((e) => e.wellName === 'AKASO-4');
  const liftTargetRate = a4LastAlloc.allocated.oil;
  const liftWctPct = kpi7.watercut * 100;
  const liftGor = kpi7.gor;
  const glr = LA.plungerWellGlr({
    targetRate: liftTargetRate, gorScfStb: liftGor, wctPct: liftWctPct,
  });
  const liftSg = LA.liquidGravity({ api: 29.4, wct: kpi7.watercut });
  // The seam-1 question: the screener is handed one number, and the two
  // readings of it are the oil rate and the liquid rate.
  const screenInputs = {
    depthFt: 8150, gor: liftGor, wctPct: liftWctPct, api: 29.4, bhtF: 196,
    hasSand: false, isDeviated: true, isHorizontal: false,
    powerAvailable: true, gasAvailable: true, reservoirPressureLow: false,
  };
  const screenAsOil = LS.screenLift({ ...screenInputs, targetRate: liftTargetRate });
  const screenAsLiquid = LS.screenLift({ ...screenInputs, targetRate: glr.liquidBpd });
  const screenNoApi = LS.screenLift({ ...screenInputs, targetRate: liftTargetRate, api: undefined });
  const scores = (rs) => Object.fromEntries(rs.map((r) => [r.id, r.score]));
  const recs = (rs) => rs.filter((r) => r.recommended).map((r) => r.id);

  // A design pass this wave can run without injecting three chains: the four
  // engine-backed methods with no chain supplied refuse honestly, which is
  // exactly the four-way truth table reconcile enumerates.
  const stubModel = {
    phase: 'oil', tvdMax: 8150,
    ipr: { qmax: 2600 },
    vlp: { idIn: 2.992, nodeMd: 8150, rates: { wct: kpi7.watercut, gor: liftGor } },
    fluidModel: { api: 29.4, gasSg: 0.68 },
    trajectory: { points: [{ md: 0, tvd: 0 }, { md: 4200, tvd: 4180 }, { md: 9100, tvd: 8150 }] },
    tAt: (tvd) => 88 + (196 - 88) * (tvd / 8150),
  };
  const pass = LA.runDesignPass({
    model: stubModel, targetRate: liftTargetRate, wctPct: liftWctPct,
    gorScfStb: liftGor, whp: 265, facility: {}, chain: {},
  });
  const rec = LA.reconcile({ screening: screenAsOil, designPass: pass });

  return {
    // -- Associate: one row and one window, with nothing to compare against --
    a4_low_day_gor_scfstb:            a4Low.gor,
    a6_producing_day_oil_stbd:        a6First.oilPd,
    field_kpi_oil_stbd:               kpi7.oil,
    field_kpi_watercut_frac:          kpi7.watercut,
    field_kpi_gor_scfstb:             kpi7.gor,
    field_kpi_uptime_pct:             kpi7.uptimePct,
    // -- Professional: two windows, and a metered total over a sum of tests --
    a4_recent_oil_mean_stbd:          a4Rate.value,
    a4_baseline_oil_mean_stbd:        a4Rate.baseline,
    a6_recent_hours_mean_h:           a6Down.value,
    alloc_oil_factor_last_day:        last.factors.oil,
    alloc_a8_oil_stb:                 a8Alloc.allocated.oil,
    imbalance_oil_pct_last_day:       imbLast.oil.imbalancePct,
    // -- Expert: two engine functions, one window, two answers --------------
    seam_a4_gor_mean_of_ratios_scfstb:   a4Gor.value,
    seam_a4_gor_volumetric_scfstb:       a4Vol7.gor,
    seam_a4_watercut_mean_of_ratios_frac: a4Wc.value,
    alloc_oil_factor_last_day_with_invalid_tests: lastInv.factors.oil,
    decline_a8_effective_pct:            eff8,
    lift_a4_liquid_rate_bpd:             glr.liquidBpd,

    _aux: {
      field: {
        name: CAP.field,
        firstDate: CAP.firstDate, lastDate: CAP.lastDate, ledgerDays: NDAYS,
        ledgerRows: LEDGER.length,
        wells: Object.values(WELLS).map((w) => ({ id: w.id, name: w.name, type: w.well_type })),
        cadenceDays: wellSeries.map((s) => ({ name: s.well.name, n: s.points.length, cadence: S.seriesCadenceDays(s.points) })),
        asOf: det.asOf,
        recentWindow: [DATES[NDAYS - 7], DATES[NDAYS - 1]],
        baselineWindow: [DATES[NDAYS - 37], DATES[NDAYS - 8]],
        settings: S.DEFAULT_SURVEILLANCE_SETTINGS,
      },
      kpis: {
        window7: kpi7, window30: kpi30,
        window7WithoutObservationWell: kpi7NoObs,
        uptimeInflationPts: kpi7.uptimePct - kpi7NoObs.uptimePct,
        producerCountCountsObservationWell:
          kpi7.producerCount === Object.values(WELLS).filter((w) => w.well_type !== 'injector').length,
        wellsOnLastDay: fieldSeries[fieldSeries.length - 1].wellsOn,
      },
      exceptions: {
        asOf: det.asOf,
        count: det.exceptions.length,
        rows: det.exceptions.map((e) => ({
          well: e.wellName, type: e.type, severity: e.severity,
          value: e.value, baseline: e.baseline, message: e.message,
        })),
        withStaleDays30: detWide.exceptions.map((e) => ({
          well: e.wellName, type: e.type, severity: e.severity, value: e.value, baseline: e.baseline,
        })),
        staleWellReportsNothingWhenWindowWidened:
          !detWide.exceptions.some((e) => e.wellName === 'AKASO-12'),
        staleSeverity: a12Stale.severity,
        staleGapDays: a12Stale.value,
        staleThresholdDays: a12Stale.baseline,
        lastReportedOilStbd: a12Pts[a12Pts.length - 1].oil,
      },
      a4: {
        lowDay: {
          date: a4Low.date, oil: a4Low.oil, water: a4Low.water, gas: a4Low.gas,
          watercut: a4Low.watercut, gor: a4Low.gor,
          oilPd: a4Low.oilPd, liquidPd: a4Low.liquidPd,
        },
        rateDrop: { value: a4Rate.value, baseline: a4Rate.baseline, severity: a4Rate.severity,
          dropPct: ((a4Rate.baseline - a4Rate.value) / a4Rate.baseline) * 100, message: a4Rate.message },
        gorSeam: {
          meanOfRatiosRecent: a4Gor.value,
          meanOfRatiosBaseline: a4Gor.baseline,
          volumetricRecent: a4Vol7.gor,
          volumetricBaseline: a4Vol30base.gor,
          riseByMeanOfRatiosPct: ((a4Gor.value - a4Gor.baseline) / a4Gor.baseline) * 100,
          riseByVolumetricPct: ((a4Vol7.gor - a4Vol30base.gor) / a4Vol30base.gor) * 100,
          overstatementPct: (a4Gor.value / a4Vol7.gor - 1) * 100,
          severityByMeanOfRatios: a4Gor.severity,
          triggerPct: S.DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct,
          highAtPct: S.DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct * 2,
          volumetricFiresAtAll:
            ((a4Vol7.gor - a4Vol30base.gor) / a4Vol30base.gor) * 100 >= S.DEFAULT_SURVEILLANCE_SETTINGS.gorRisePct,
        },
        watercutSeam: {
          meanOfRatiosRecent: a4Wc.value,
          meanOfRatiosBaseline: a4Wc.baseline,
          volumetricRecent: a4Vol7.watercut,
          volumetricBaseline: a4Vol30base.watercut,
          riseByMeanOfRatiosPts: (a4Wc.value - a4Wc.baseline) * 100,
          riseByVolumetricPts: (a4Vol7.watercut - a4Vol30base.watercut) * 100,
          severityByMeanOfRatios: a4Wc.severity,
          triggerPts: S.DEFAULT_SURVEILLANCE_SETTINGS.watercutRisePts,
          highAtPts: S.DEFAULT_SURVEILLANCE_SETTINGS.watercutRisePts * 2,
        },
        movingAverageOilLast: a4Ma7[a4Ma7.length - 1],
        movingAverageGorLast: a4MaGor7[a4MaGor7.length - 1],
        movingAverageGorEqualsMeanOfRatios: a4MaGor7[a4MaGor7.length - 1] === a4Gor.value,
        declineFitInsufficient: !!fit4.insufficient,
      },
      a6: {
        gradedRow: {
          date: a6First.date, hoursOn: a6First.hoursOn, oil: a6First.oil,
          oilPd: a6First.oilPd, waterPd: a6First.waterPd, liquidPd: a6First.liquidPd,
          watercut: a6First.watercut, gor: a6First.gor,
        },
        calendarRateDrop: { value: a6Rate.value, baseline: a6Rate.baseline, severity: a6Rate.severity,
          dropPct: ((a6Rate.baseline - a6Rate.value) / a6Rate.baseline) * 100 },
        producingDayRecentMean: (() => {
          const v = a6Pts.slice(-7).map((p) => p.oilPd);
          return v.reduce((a, b) => a + b, 0) / v.length;
        })(),
        producingDayBaselineMean: (() => {
          const v = a6Pts.slice(-37, -7).map((p) => p.oilPd);
          return v.reduce((a, b) => a + b, 0) / v.length;
        })(),
        downtime: { value: a6Down.value, threshold: a6Down.baseline, severity: a6Down.severity },
        hoursRecent: a6Pts.slice(-7).map((p) => p.hoursOn),
      },
      a8: {
        qiStbd: CAP.a8Qi, diPerDay: CAP.a8Di,
        firstRate: a8Pts[0].oilPd, lastRate: a8Pts[a8Pts.length - 1].oilPd,
        fitModelType: p8.modelType, fitQi: p8.qi, fitDi: p8.Di, fitB: p8.b, fitR2: fit8.fit.r2,
        effectivePct: eff8,
        effectiveFromTrueDi: S.annualEffectiveDecline(CAP.a8Di, 0, 'Exponential'),
        diErrorPerDay: p8.Di - CAP.a8Di,
        raisesNoException: !det.exceptions.some((e) => e.wellName === 'AKASO-8'),
        forecastAt365: fit8.forecast?.forecast
          ? fit8.forecast.forecast[Math.min(364, fit8.forecast.forecast.length - 1)]
          : null,
      },
      a12: {
        qiStbd: CAP.a12Qi, diPerDay: CAP.a12Di,
        lastReportDate: CAP.a12LastReportDate,
        rowsSent: a12Pts.length,
        hoursColumn: a12Pts[0].hoursOn,
        oilPdEqualsCalendar: a12Pts[0].oilPd === a12Pts[0].oil,
        fitModelType: p12.modelType, fitDi: p12.Di, fitB: p12.b, effectivePct: eff12,
        trueOilOnLastFieldDay: a12TrueOil(NDAYS - 1),
        allocatedOilWithInvalidTests: a12AllocInv ? a12AllocInv.allocated.oil : null,
        allocatedDaysWithInvalidTests: a12AllocInv ? a12AllocInv.days : 0,
        daysWithNoLedgerRowAtAll: NDAYS - 1 - A12_LAST,
      },
      injector: a2wInj ? {
        value: a2wInj.value, baseline: a2wInj.baseline, severity: a2wInj.severity,
        dropPct: ((a2wInj.baseline - a2wInj.value) / a2wInj.baseline) * 100,
        checksSkippedForInjectors: ['watercut_rise', 'gor_rise', 'downtime'],
      } : null,
      allocation: {
        window: [CAP.allocFromDate, CAP.lastDate],
        days: alloc.days.length,
        settings: alloc.settings,
        grand: alloc.totals,
        closureOilStb: alloc.totals.allocated.oil - alloc.totals.measured.oil,
        wells: alloc.wells.map((w) => ({
          name: w.wellName, days: w.days,
          theoreticalOil: w.theoretical.oil, allocatedOil: w.allocated.oil,
          factor: w.allocated.oil / w.theoretical.oil,
        })),
        lastDay: {
          date: last.date, measured: last.measured, theoretical: last.theoretical,
          allocated: last.allocated, factors: last.factors,
          entries: last.entries.map((e) => ({
            name: e.wellName, testId: e.testId, testDate: e.testDate, uptime: e.uptime,
            theoreticalOil: e.theoretical.oil, allocatedOil: e.allocated.oil,
          })),
        },
        firstDay: {
          date: alloc.days[0].date, measured: alloc.days[0].measured,
          theoretical: alloc.days[0].theoretical, factors: alloc.days[0].factors,
        },
        factorRangeOil: [
          Math.min(...alloc.days.map((d) => d.factors.oil)),
          Math.max(...alloc.days.map((d) => d.factors.oil)),
        ],
        outOfBandDays: alloc.days.filter((d) => d.factors.oil < alloc.settings.factorWarnLow
          || d.factors.oil > alloc.settings.factorWarnHigh).length,
        diagnosticCounts: alloc.diagnostics.reduce((m, d) => {
          m[d.code] = (m[d.code] || 0) + 1; return m;
        }, {}),
        firstNoTestDiagnostic: alloc.diagnostics.find((d) => d.code === 'no_test_in_force')?.message,
        firstOutOfBandDiagnostic: alloc.diagnostics.find((d) => d.code === 'factor_out_of_band')?.message,
        monthlyFactors: monthly.map((m) => ({
          well: m.wellName, month: m.periodMonth,
          theoreticalOil: m.theoretical.oil, allocatedOil: m.allocated.oil, factors: m.factors,
        })),
      },
      allocationWithInvalidTests: {
        days: allocInv.days.length,
        grand: allocInv.totals,
        lastDayFactors: lastInv.factors,
        lastDayTheoretical: lastInv.theoretical,
        oilFactorRatio: lastInv.factors.oil / last.factors.oil,
        oilFactorShiftPct: (lastInv.factors.oil / last.factors.oil - 1) * 100,
        wells: allocInv.wells.map((w) => ({
          name: w.wellName, days: w.days,
          theoreticalOil: w.theoretical.oil, allocatedOil: w.allocated.oil,
        })),
        a8LossStb: allocInv.wells.find((w) => w.wellName === 'AKASO-8').allocated.oil - a8Alloc.allocated.oil,
        a12BooksBarrelsOnDaysItSentNoRow: (() => {
          const cut = CAP.a12LastReportDate;
          return allocInv.days.filter((d) => d.date > cut
            && d.entries.some((e) => e.wellName === 'AKASO-12' && e.allocated.oil > 0)).length;
        })(),
        a12UptimeOnADayWithNoRow: (() => {
          const d = allocInv.days[allocInv.days.length - 1];
          return d.entries.find((e) => e.wellName === 'AKASO-12')?.uptime;
        })(),
        monthlyFactors: monthlyInv.map((m) => ({
          well: m.wellName, month: m.periodMonth, factors: m.factors,
          theoreticalOil: m.theoretical.oil,
        })),
      },
      allocationOtherBases: {
        ledgerBasisLastDayFactors: allocLedger.days[allocLedger.days.length - 1].factors,
        ledgerBasisGrand: allocLedger.totals,
        noUptimeLastDayFactors: allocNoUptime.days[allocNoUptime.days.length - 1].factors,
        noUptimeGrand: allocNoUptime.totals,
      },
      imbalance: {
        lastDay: { date: imbLast.date, ...imbLast.oil },
        beforeAndAfterTheWellWentQuiet: (() => {
          const cut = CAP.a12LastReportDate;
          const before = imb.filter((d) => d.date <= cut);
          const after = imb.filter((d) => d.date > cut);
          const mean = (a) => a.reduce((s, d) => s + d.oil.imbalancePct, 0) / a.length;
          return {
            lastReportedDate: cut,
            meanPctWhileReporting: mean(before),
            meanPctAfterItStopped: mean(after),
            jumpPts: mean(after) - mean(before),
            firstDayAfter: after[0] ? { date: after[0].date, ...after[0].oil } : null,
          };
        })(),
        rows: imb.map((d) => ({ date: d.date, ...d.oil })),
      },
      testQc: {
        count: qc.length,
        rows: qc.map((r) => ({
          test: r.testId, well: r.wellName, date: r.testDate, severity: r.severity,
          issues: r.issues.map((i) => ({ code: i.code, severity: i.severity, message: i.message })),
        })),
        settings: A.DEFAULT_TEST_QC_SETTINGS,
        testInForceOnLastDay: Object.fromEntries(['w-akaso-4', 'w-akaso-6', 'w-akaso-8', 'w-akaso-12'].map((id) => {
          const g = A.groupTests(CAP.tests, { includeInvalid: false }).get(id);
          const gi = A.groupTests(CAP.tests, { includeInvalid: true }).get(id);
          return [id, {
            valid: A.testInForce(g, CAP.lastDate)?.id ?? null,
            includingInvalid: A.testInForce(gi, CAP.lastDate)?.id ?? null,
          }];
        })),
      },
      lift: {
        inputsAreEngineReturns: {
          targetRateFrom: 'computeAllocation days[last].entries[AKASO-4].allocated.oil',
          wctFrom: 'computeKpis({windowDays:7}).watercut, x100 at the door',
          gorFrom: 'computeKpis({windowDays:7}).gor',
        },
        targetRateStbd: liftTargetRate,
        wctPct: liftWctPct,
        gorScfStb: liftGor,
        glr,
        liquidGravity: liftSg,
        liquidOverOil: glr.liquidBpd / liftTargetRate,
        screeningAsOilRate: { scores: scores(screenAsOil), recommended: recs(screenAsOil), order: screenAsOil.map((r) => r.id) },
        screeningAsLiquidRate: { scores: scores(screenAsLiquid), recommended: recs(screenAsLiquid), order: screenAsLiquid.map((r) => r.id) },
        screeningWithNoApi: { scores: scores(screenNoApi), recommended: recs(screenNoApi), order: screenNoApi.map((r) => r.id) },
        rodDutyIndexOnOilRate: (liftTargetRate * screenInputs.depthFt) / 1e6,
        rodDutyIndexOnLiquidRate: (glr.liquidBpd * screenInputs.depthFt) / 1e6,
        designPass: {
          ok: pass.ok,
          results: pass.results.map((r) => ({ id: r.id, ok: r.ok, reason: r.reason })),
        },
        reconcile: {
          rows: rec.rows.map((r) => ({ id: r.id, score: r.score, recommended: r.recommended, verdict: r.verdict })),
          ranked: rec.ranked.map((r) => r.id),
          workable: rec.workable.map((r) => r.id),
          disagreements: rec.disagreements.map((r) => r.id),
        },
        catalogPicks: {
          stageAtOilRate: LA.pickReferenceStage(liftTargetRate),
          stageAtLiquidRate: LA.pickReferenceStage(glr.liquidBpd),
          motorAt120hp: LA.pickMotorFrame(120),
          motorAt330hp: LA.pickMotorFrame(330),
          motorAt420hp: LA.pickMotorFrame(420),
          headroomAt420: LA.pickMotorFrame(420).hp / 420,
        },
        mdAtPumpTvd: LA.mdAtTvd(stubModel.trajectory, Math.round(stubModel.tvdMax * 0.94)),
      },
      decline: {
        a8: { modelType: p8.modelType, qi: p8.qi, Di: p8.Di, b: p8.b, effectivePct: eff8 },
        a12: { modelType: p12.modelType, qi: p12.qi, Di: p12.Di, b: p12.b, effectivePct: eff12 },
        a4Insufficient: !!fit4.insufficient,
        a4ModelType: fit4.fit?.parameters?.modelType ?? null,
        exponentialLimitCheck: S.annualEffectiveDecline(p8.Di, 0, 'Exponential'),
      },
      deferments: (() => {
        const events = [
          { category: 'Facility', start_date: '2026-04-06', end_date: '2026-04-09', oil_deferred_stb: 2840, water_deferred_stb: 690, gas_deferred_mscf: 1720 },
          { category: 'Well integrity', start_date: '2026-04-11', end_date: '2026-04-12', oil_deferred_stb: 615, water_deferred_stb: 170, gas_deferred_mscf: 372 },
          { category: 'Artificial lift', start_date: '2026-04-19', end_date: null, oil_deferred_stb: 3960, water_deferred_stb: 1410, gas_deferred_mscf: 2405 },
          { category: 'Facility', start_date: '2026-04-22', end_date: '2026-04-23', oil_deferred_stb: 508, water_deferred_stb: 131, gas_deferred_mscf: 305 },
        ];
        const sum = S.summarizeDeferments(events, det.asOf);
        return { events, summary: sum, openEventDays: sum.byCategory.find((c) => c.category === 'Artificial lift')?.days };
      })(),
      decimation: {
        pointsPerWell: a4Pts.length,
        decimatedLength: S.decimate(a4Pts, 40).length,
        untouchedUnderCap: S.decimate(a4Pts, 1500) === a4Pts,
      },
    },
  };
}

const TIER = {
  a4_low_day_gor_scfstb: 'beginner',
  a6_producing_day_oil_stbd: 'beginner',
  field_kpi_oil_stbd: 'beginner',
  field_kpi_watercut_frac: 'beginner',
  field_kpi_gor_scfstb: 'beginner',
  field_kpi_uptime_pct: 'beginner',
  a4_recent_oil_mean_stbd: 'intermediate',
  a4_baseline_oil_mean_stbd: 'intermediate',
  a6_recent_hours_mean_h: 'intermediate',
  alloc_oil_factor_last_day: 'intermediate',
  alloc_a8_oil_stb: 'intermediate',
  imbalance_oil_pct_last_day: 'intermediate',
  seam_a4_gor_mean_of_ratios_scfstb: 'advanced',
  seam_a4_gor_volumetric_scfstb: 'advanced',
  seam_a4_watercut_mean_of_ratios_frac: 'advanced',
  alloc_oil_factor_last_day_with_invalid_tests: 'advanced',
  decline_a8_effective_pct: 'advanced',
  lift_a4_liquid_rate_bpd: 'advanced',
};
const UNIT = {
  a4_low_day_gor_scfstb: 'scf/stb',
  a6_producing_day_oil_stbd: 'stb/d',
  field_kpi_oil_stbd: 'stb/d',
  field_kpi_watercut_frac: 'fraction',
  field_kpi_gor_scfstb: 'scf/stb',
  field_kpi_uptime_pct: 'per cent',
  a4_recent_oil_mean_stbd: 'stb/d',
  a4_baseline_oil_mean_stbd: 'stb/d',
  a6_recent_hours_mean_h: 'h',
  alloc_oil_factor_last_day: 'dimensionless',
  alloc_a8_oil_stb: 'stb',
  imbalance_oil_pct_last_day: 'per cent',
  seam_a4_gor_mean_of_ratios_scfstb: 'scf/stb',
  seam_a4_gor_volumetric_scfstb: 'scf/stb',
  seam_a4_watercut_mean_of_ratios_frac: 'fraction',
  alloc_oil_factor_last_day_with_invalid_tests: 'dimensionless',
  decline_a8_effective_pct: 'per cent',
  lift_a4_liquid_rate_bpd: 'bbl/d',
};

// public.academy_submit_capstone grades with abs(v_got - v_exp) <= v_tol, so
// this is an ABSOLUTE tolerance in each field's own unit and is NOT a fraction
// of anything. It is SET at about 5e-7 of the value's own magnitude, rounded up
// to two significant figures, with a 1e-7 floor for the fractions: loose enough
// to admit an honest seven-significant-figure rounding of the printed answer,
// tight enough that no second reading of any of these quantities survives it.
const tolFor = (v) => {
  const raw = Math.max(Math.abs(v) * 5e-7, 1e-7);
  const step = 10 ** (Math.floor(Math.log10(raw)) - 1);
  return Number((Math.ceil(raw / step) * step).toPrecision(2));
};

const V = capstoneValues();
const fields = Object.keys(TIER).map((k) => [TIER[k], k, V[k], tolFor(V[k])]);
fs.writeFileSync('/root/pd-wip-surveillance/fields.json', JSON.stringify(fields, null, 1));
for (const [t, k, v, tol] of fields) {
  console.log(`${t.padEnd(13)} ${k.padEnd(46)} ${v}  ${UNIT[k].padEnd(14)} (tol ${tol})`);
}
console.log('\naux:', JSON.stringify(V._aux, null, 1));
