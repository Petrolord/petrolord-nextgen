// Drilling hydraulics teaching lab for the DR3 course (app 'hydraulics'). Pure
// functions over the vendored engines/drilling and its goldens; every exported
// value is pinned by hydraulicsLab.test.js against DR3-TRUTH.md.
//
// Two wells and two muds, four combinations, one string and one bit. The
// lessons run at 0.015, 0.025 and 0.035 m3/s and at trip speeds of 0.2, 0.5 and
// 1.0 m/s. The CAPSTONE runs a third mud at 0.030 m3/s and 0.75 m/s, so that no
// graded value is a number a lesson printed.

import cases from '@petrolord/engines/test-data/drilling/goldens/hydraulics_cases.json';

import {
  computeHydraulics, buildFlowElements, elementLoss, bitHydraulics, BIT_CD,
} from '@petrolord/engines/engines/drilling/hydraulics.js';
import {
  fitModels, stressAtRate, localPowerLaw, apparentViscosity,
  TAU_PER_DEG_PA, GAMMA_PER_RPM,
} from '@petrolord/engines/engines/drilling/rheology.js';
import {
  computeHoleCleaning, minFlowRate, slipVelocity,
} from '@petrolord/engines/engines/drilling/holeCleaning.js';
import {
  computeSurgeSwab, sweepTripSpeeds, maxTripSpeed, CLINGING_CONSTANT,
} from '@petrolord/engines/engines/drilling/surgeSwab.js';

export { BIT_CD, CLINGING_CONSTANT, TAU_PER_DEG_PA, GAMMA_PER_RPM };
export { stressAtRate, localPowerLaw, apparentViscosity, slipVelocity, bitHydraulics };

// ---------------------------------------------------------------------------
// The four fixtures.
// ---------------------------------------------------------------------------

export const CASES = cases.cases.map((c) => ({
  id: `${c.well}_${c.mudName}`,
  well: c.well,
  mudName: c.mudName,
  densityKgM3: c.mud.densityKgM3,
  fann: { ...c.mud.fann },
}));

export const caseOf = (id = 'slant_kcl_polymer') => {
  const c = cases.cases.find((x) => `${x.well}_${x.mudName}` === id);
  if (!c) throw new Error(`Unknown hydraulics case '${id}'.`);
  return c;
};

const geoOf = (c) => ({ stations: c.stations, string: c.string, geometry: c.geometry });

// ---------------------------------------------------------------------------
// Rheology: three models from four dial readings.
// ---------------------------------------------------------------------------

export const rheology = (fannOrId = 'slant_kcl_polymer') => {
  const fann = typeof fannOrId === 'string' ? caseOf(fannOrId).mud.fann : fannOrId;
  return { fann: { ...fann }, ...fitModels(fann) };
};

// The three models' shear stress across the Fann rate range, which is where
// they agree and where they do not.
export const rheologyCurve = (fannOrId = 'slant_kcl_polymer',
  rates = [1, 5, 10, 50, 100, 170, 340, 511, 1022]) => {
  const f = rheology(fannOrId);
  return rates.map((gammaDot) => ({
    gammaDot,
    powerLaw: stressAtRate(f.powerLaw, gammaDot),
    bingham: stressAtRate(f.bingham, gammaDot),
    herschelBulkley: stressAtRate(f.herschelBulkley, gammaDot),
    apparentHb: apparentViscosity(f.herschelBulkley, gammaDot),
  }));
};

// How far each fit sits from the FANN READINGS it was fitted to. The two-point
// models reproduce their own two points exactly and miss the low-rate ones.
export const fitResiduals = (fannOrId = 'slant_kcl_polymer') => {
  const f = rheology(fannOrId);
  const pts = [
    ['theta600', 600 * GAMMA_PER_RPM, f.fann.theta600],
    ['theta300', 300 * GAMMA_PER_RPM, f.fann.theta300],
    ['theta6', 6 * GAMMA_PER_RPM, f.fann.theta6],
    ['theta3', 3 * GAMMA_PER_RPM, f.fann.theta3],
  ];
  return pts.filter(([, , dial]) => dial != null).map(([name, gammaDot, dial]) => {
    const measured = dial * TAU_PER_DEG_PA;
    return {
      name,
      gammaDot,
      measuredPa: measured,
      powerLawPa: stressAtRate(f.powerLaw, gammaDot),
      binghamPa: stressAtRate(f.bingham, gammaDot),
      herschelBulkleyPa: stressAtRate(f.herschelBulkley, gammaDot),
    };
  });
};

// ---------------------------------------------------------------------------
// The circulating pressure chain.
// ---------------------------------------------------------------------------

const mudOf = (c, over = {}) => ({
  densityKgM3: over.densityKgM3 ?? c.mud.densityKgM3,
  model: over.model ?? fitModels(over.fann ?? c.mud.fann).herschelBulkley,
});

export const hydraulicsRun = (id = 'slant_kcl_polymer', flowRateM3s = 0.025, over = {}) => {
  const c = caseOf(id);
  return computeHydraulics({
    ...geoOf(c),
    mud: mudOf(c, over),
    flowRateM3s,
    nozzleTfaM2: over.nozzleTfaM2 ?? c.nozzleTfaM2,
    params: over.params ?? {},
  });
};

// The four numbers a pump pressure is made of, and each one's share.
export const pressureSplit = (id = 'slant_kcl_polymer', flowRateM3s = 0.025, over = {}) => {
  const r = hydraulicsRun(id, flowRateM3s, over);
  const s = r.summary;
  return {
    flowRateM3s,
    pipeDpPa: s.pipeDpPa,
    annulusDpPa: s.annulusDpPa,
    bitDpPa: s.bitDpPa,
    pumpPressurePa: s.pumpPressurePa,
    pipeShare: s.pipeDpPa / s.pumpPressurePa,
    annulusShare: s.annulusDpPa / s.pumpPressurePa,
    bitShare: s.bitDpPa / s.pumpPressurePa,
    ecdAtTdKgM3: s.ecdAtTdKgM3,
    ecdOverMudKgM3: s.ecdAtTdKgM3 - (over.densityKgM3 ?? caseOf(id).mud.densityKgM3),
    minAnnularVelocityMs: s.minAnnularVelocityMs,
    ecdProfile: r.ecdProfile,
    elements: r.elements,
    bit: r.bit,
    warnings: s.warnings ?? [],
  };
};

export const flowSweep = (id = 'slant_kcl_polymer',
  rates = [0.010, 0.015, 0.020, 0.025, 0.035, 0.040, 0.050], over = {}) =>
  rates.map((q) => pressureSplit(id, q, over));

export const flowElements = (id = 'slant_kcl_polymer') => {
  const c = caseOf(id);
  const { pipeElements, annulusElements, bitMd, uncovered } = buildFlowElements(geoOf(c));
  return { pipeElements, annulusElements, bitMd, uncovered };
};

// The engine against the independent numpy oracle that generated the goldens.
export const oracleCheck = () => {
  let worst = 0;
  let at = null;
  let checked = 0;
  for (const c of cases.cases) {
    const id = `${c.well}_${c.mudName}`;
    const fits = fitModels(c.mud.fann);
    for (const m of ['powerLaw', 'bingham', 'herschelBulkley']) {
      for (const [k, v] of Object.entries(fits[m])) {
        if (typeof v !== 'number') continue;
        checked += 1;
        const want = c.fits[m][k];
        const rel = Math.abs(v - want) / Math.abs(want || 1);
        if (rel > worst) { worst = rel; at = { id, what: `${m}.${k}`, got: v, want }; }
      }
    }
    for (const [key, exp] of Object.entries(c.expected.hydraulics)) {
      const q = Number(key.slice(2));
      const s = hydraulicsRun(id, q).summary;
      for (const f of ['pipeDpPa', 'annulusDpPa', 'bitDpPa', 'pumpPressurePa', 'ecdAtTdKgM3', 'minAnnularVelocityMs']) {
        checked += 1;
        const rel = Math.abs(s[f] - exp[f]) / Math.abs(exp[f] || 1);
        if (rel > worst) { worst = rel; at = { id, what: `q${q}.${f}`, got: s[f], want: exp[f] }; }
      }
    }
    for (const [key, exp] of Object.entries(c.expected.surgeSwab)) {
      const open = key.startsWith('open_');
      const v = Number(key.replace('open_', '').slice(2));
      const r = surgeSwab(id, v, open ? 'open' : 'closed');
      for (const f of ['dpPa', 'surgeEmwKgM3', 'swabEmwKgM3']) {
        checked += 1;
        const rel = Math.abs(r[f] - exp[f]) / Math.abs(exp[f] || 1);
        if (rel > worst) { worst = rel; at = { id, what: `${key}.${f}`, got: r[f], want: exp[f] }; }
      }
    }
    checked += 1;
    const hcExp = c.expected.holeCleaning;
    const hcGot = holeCleaning(id, 0.025);
    const rel = Math.abs(hcGot.minTransportRatio - hcExp.minTransportRatio) / hcExp.minTransportRatio;
    if (rel > worst) { worst = rel; at = { id, what: 'holeCleaning.minTransportRatio', got: hcGot.minTransportRatio, want: hcExp.minTransportRatio }; }
  }
  return { checked, worstRel: worst, at };
};

// ---------------------------------------------------------------------------
// Hole cleaning.
// ---------------------------------------------------------------------------

export const holeCleaning = (id = 'slant_kcl_polymer', flowRateM3s = 0.025, over = {}) => {
  const c = caseOf(id);
  const r = computeHoleCleaning({
    ...geoOf(c), mud: mudOf(c, over), flowRateM3s, cuttings: over.cuttings ?? {},
  });
  return {
    rows: r.rows,
    minTransportRatio: r.summary.minTransportRatio,
    feedM3s: r.summary.feedM3s,
    worstCuttingsConcPct: r.rows.reduce((m, x) => Math.max(m, x.cuttingsConcPct), 0),
    warnings: r.summary.warnings ?? [],
  };
};

export const cleaningSweep = (id = 'slant_kcl_polymer',
  rates = [0.010, 0.015, 0.020, 0.025, 0.030, 0.035, 0.040], over = {}) =>
  rates.map((q) => ({ flowRateM3s: q, ...holeCleaning(id, q, over) }));

export const minimumFlow = (id = 'slant_kcl_polymer', targetTr = 0.5, over = {}) => {
  const c = caseOf(id);
  return minFlowRate({ ...geoOf(c), mud: mudOf(c, over), targetTr, cuttings: over.cuttings ?? {} });
};

// ---------------------------------------------------------------------------
// Surge and swab.
// ---------------------------------------------------------------------------

export const surgeSwab = (id = 'slant_kcl_polymer', tripSpeedMs = 0.5, mode = 'closed', over = {}) => {
  const c = caseOf(id);
  const r = computeSurgeSwab({
    ...geoOf(c), mud: mudOf(c, over), tripSpeedMs, mode,
  });
  return {
    mode: r.mode,
    tripSpeedMs: r.tripSpeedMs,
    referenceMd: r.referenceMd,
    dpPa: r.dpPa,
    surgeEmwKgM3: r.surgeEmwKgM3,
    swabEmwKgM3: r.swabEmwKgM3,
    dEmwKgM3: r.surgeEmwKgM3 - (over.densityKgM3 ?? c.mud.densityKgM3),
    rows: r.rows,
  };
};

export const tripSweep = (id = 'slant_kcl_polymer',
  speeds = [0.1, 0.2, 0.3, 0.5, 0.75, 1.0, 1.5], mode = 'closed', over = {}) => {
  const c = caseOf(id);
  return sweepTripSpeeds({ ...geoOf(c), mud: mudOf(c, over), speeds, mode });
};

export const closedOverOpen = (id = 'slant_kcl_polymer', tripSpeedMs = 0.5, over = {}) =>
  surgeSwab(id, tripSpeedMs, 'closed', over).dpPa / surgeSwab(id, tripSpeedMs, 'open', over).dpPa;

export const speedLimit = (id = 'slant_kcl_polymer', {
  fracEmwKgM3 = null, poreEmwKgM3 = null, mode = 'closed', over = {},
} = {}) => {
  const c = caseOf(id);
  return maxTripSpeed({ ...geoOf(c), mud: mudOf(c, over), mode, fracEmwKgM3, poreEmwKgM3 });
};

// ---------------------------------------------------------------------------
// The capstone's own conditions, and the eighteen graded values.
// ---------------------------------------------------------------------------

// A mud the lessons never mix, a flow rate they never pump and a trip speed
// they never run, so that no graded value is a number a lesson printed.
export const CAPSTONE_FANN = { theta600: 52, theta300: 33, theta6: 6, theta3: 5 };
export const CAPSTONE_DENSITY_KGM3 = 1320;
export const CAPSTONE_FLOW_M3S = 0.030;
export const CAPSTONE_TRIP_MS = 0.75;
export const CAPSTONE_FRAC_EMW = 1400;
export const CAPSTONE_PORE_EMW = 1260;

export const capstoneValues = () => {
  const over = { fann: CAPSTONE_FANN, densityKgM3: CAPSTONE_DENSITY_KGM3 };
  const f = rheology(CAPSTONE_FANN);
  const S = 'slant_kcl_polymer';
  const Hz = 'horizontal_kcl_polymer';
  const ps = pressureSplit(S, CAPSTONE_FLOW_M3S, over);
  const ph = pressureSplit(Hz, CAPSTONE_FLOW_M3S, over);
  const ch = holeCleaning(Hz, CAPSTONE_FLOW_M3S, over);
  const sc = surgeSwab(S, CAPSTONE_TRIP_MS, 'closed', over);
  const so = surgeSwab(S, CAPSTONE_TRIP_MS, 'open', over);
  const hc = surgeSwab(Hz, CAPSTONE_TRIP_MS, 'closed', over);
  return {
    beginner: {
      pl_n: f.powerLaw.n,
      hb_tau_y_Pa: f.herschelBulkley.tauYPa,
      pipe_dp_Pa: ps.pipeDpPa,
      annulus_dp_Pa: ps.annulusDpPa,
      bit_dp_Pa: ps.bitDpPa,
      pump_pressure_Pa: ps.pumpPressurePa,
    },
    intermediate: {
      slant_ecd_at_td_kgm3: ps.ecdAtTdKgM3,
      slant_min_annular_velocity_ms: ps.minAnnularVelocityMs,
      horizontal_ecd_at_td_kgm3: ph.ecdAtTdKgM3,
      horizontal_min_transport_ratio: ch.minTransportRatio,
      horizontal_worst_cuttings_conc_pct: ch.worstCuttingsConcPct,
      horizontal_min_flow_tr080_m3s: minimumFlow(Hz, 0.80, over),
    },
    advanced: {
      slant_surge_dp_closed_Pa: sc.dpPa,
      slant_surge_emw_closed_kgm3: sc.surgeEmwKgM3,
      slant_swab_emw_open_kgm3: so.swabEmwKgM3,
      closed_over_open_dp_ratio: sc.dpPa / so.dpPa,
      horizontal_surge_emw_closed_kgm3: hc.surgeEmwKgM3,
      slant_max_trip_speed_ms: speedLimit(S, {
        fracEmwKgM3: CAPSTONE_FRAC_EMW, poreEmwKgM3: CAPSTONE_PORE_EMW, over,
      }),
    },
  };
};
