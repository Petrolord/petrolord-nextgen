// Well control teaching lab for the DR4 course (app 'wellcontrol'). Pure
// functions over the vendored engines/drilling and its goldens; every exported
// value is pinned by wellcontrolLab.test.js.
//
// Two wells and two published kick scenarios. The LESSONS teach volumes and
// strokes on the HORIZONTAL well and the kill sheet on the two published
// scenarios; the CAPSTONE asks for the SLANT well's volumes and for a third
// scenario at a fracture gradient the lessons do not use, so that no graded
// value is a number a lesson printed.

import cases from '@petrolord/engines/test-data/drilling/goldens/wellcontrol_cases.json';

import {
  wellVolumes, annulusCapAt, tvdAt, killSheet, kickTolerance, kickToleranceSweep,
  maaspPa, boyle, INFLUX_GAS_MAX_KGM3, INFLUX_LIQUID_MIN_KGM3,
} from '@petrolord/engines/engines/drilling/wellControl.js';

export {
  boyle, maaspPa, INFLUX_GAS_MAX_KGM3, INFLUX_LIQUID_MIN_KGM3,
};

export const WELLS = cases.cases.map((c) => ({
  id: c.well, shoeMd: c.shoeMd, mudDensityKgM3: c.mudDensityKgM3, fracEmwKgM3: c.fracEmwKgM3,
  pumpOutputM3PerStroke: c.pump.outputM3PerStroke, scrPressurePa: c.pump.scrPressurePa,
}));

export const caseOf = (id = 'slant') => {
  const c = cases.cases.find((x) => x.well === id);
  if (!c) throw new Error(`Unknown well control case '${id}'.`);
  return c;
};

// The volumes, the strokes and the two depths every later calculation needs.
export const volumes = (id = 'horizontal') => {
  const c = caseOf(id);
  const v = wellVolumes({
    stations: c.stations, string: c.string, geometry: c.geometry,
    pumpOutputM3PerStroke: c.pump.outputM3PerStroke,
  });
  return {
    bitMd: v.bitMd,
    shoeMd: c.shoeMd,
    stringVolumeM3: v.stringVolumeM3,
    annulusVolumeM3: v.annulusVolumeM3,
    totalCirculatingM3: v.totalCirculatingM3,
    strokesToBit: v.strokes.surfaceToBit,
    bottomsUpStrokes: v.strokes.bitToSurface,
    fullCycleStrokes: v.strokes.fullCycle,
    tvdBhM: tvdAt(c.stations, v.bitMd),
    tvdShoeM: tvdAt(c.stations, c.shoeMd),
    capBitM2: annulusCapAt(v.annulusRows, v.bitMd - 1),
    capShoeM2: annulusCapAt(v.annulusRows, c.shoeMd - 1),
    stringRows: v.stringRows,
    annulusRows: v.annulusRows,
  };
};

// The two scenarios the goldens publish, which the lessons teach on.
export const SCENARIOS = {
  moderate_gas: { sidppPa: 2.0e6, sicpPa: 2.9e6, pitGainM3: 3.0 },
  small_liquid: { sidppPa: 0.8e6, sicpPa: 0.9e6, pitGainM3: 1.5 },
};

export const sheet = (id = 'horizontal', scenario = 'moderate_gas', over = {}) => {
  const c = caseOf(id);
  const v = volumes(id);
  const s = typeof scenario === 'string' ? SCENARIOS[scenario] : scenario;
  if (!s) throw new Error(`Unknown scenario '${scenario}'.`);
  const r = killSheet({
    tvdBhM: v.tvdBhM,
    tvdShoeM: v.tvdShoeM,
    mudDensityKgM3: over.mudDensityKgM3 ?? c.mudDensityKgM3,
    sidppPa: s.sidppPa,
    sicpPa: s.sicpPa,
    pitGainM3: s.pitGainM3,
    scrPressurePa: over.scrPressurePa ?? c.pump.scrPressurePa,
    pumpOutputM3PerStroke: c.pump.outputM3PerStroke,
    stringVolumeM3: v.stringVolumeM3,
    annulusVolumeM3: v.annulusVolumeM3,
    annulusCapNearBitM2: v.capBitM2,
    stepCount: over.stepCount ?? 10,
  });
  return { ...r, volumes: v };
};

export const tolerance = (id = 'horizontal', over = {}) => {
  const c = caseOf(id);
  const v = volumes(id);
  return kickTolerance({
    tvdBhM: v.tvdBhM,
    tvdShoeM: v.tvdShoeM,
    mudDensityKgM3: over.mudDensityKgM3 ?? c.mudDensityKgM3,
    fracEmwKgM3: over.fracEmwKgM3 ?? c.fracEmwKgM3,
    kickIntensityKgM3: over.kickIntensityKgM3 ?? 60,
    influxDensityKgM3: over.influxDensityKgM3 ?? 240,
    annulusCapAtShoeM2: v.capShoeM2,
    annulusCapAtBitM2: v.capBitM2,
  });
};

export const toleranceSweep = (id = 'horizontal', {
  mudDensities = [1200, 1320, 1440, 1560, 1680], over = {},
} = {}) => {
  const c = caseOf(id);
  const v = volumes(id);
  return kickToleranceSweep({
    mudDensities,
    base: {
      tvdBhM: v.tvdBhM,
      tvdShoeM: v.tvdShoeM,
      fracEmwKgM3: over.fracEmwKgM3 ?? c.fracEmwKgM3,
      kickIntensityKgM3: over.kickIntensityKgM3 ?? 60,
      influxDensityKgM3: over.influxDensityKgM3 ?? 240,
      annulusCapAtShoeM2: v.capShoeM2,
      annulusCapAtBitM2: v.capBitM2,
    },
  });
};

// Verification against the published oracle: every summary field of both wells,
// both scenarios, the kick tolerance and the sweep.
export const oracleCheck = () => {
  let worst = 0;
  let at = null;
  let checked = 0;
  const cmp = (got, want, what) => {
    if (want == null || !Number.isFinite(got)) return;
    checked += 1;
    const rel = Math.abs(got - want) / Math.abs(want || 1);
    if (rel > worst) { worst = rel; at = { what, got, want }; }
  };
  for (const c of cases.cases) {
    const v = volumes(c.well);
    const ev = c.expected.volumes;
    for (const [k, g] of [['stringVolumeM3', v.stringVolumeM3], ['annulusVolumeM3', v.annulusVolumeM3],
      ['tvdBhM', v.tvdBhM], ['tvdShoeM', v.tvdShoeM], ['capBitM2', v.capBitM2], ['capShoeM2', v.capShoeM2]]) {
      cmp(g, ev[k], `${c.well}.volumes.${k}`);
    }
    for (const name of Object.keys(SCENARIOS)) {
      const s = sheet(c.well, name);
      const e = c.expected.killSheets[name];
      for (const k of ['killMudDensityKgM3', 'formationPressurePa', 'icpPa', 'fcpPa',
        'strokesToBit', 'bottomsUpStrokes', 'totalStrokes']) cmp(s[k], e[k], `${c.well}.${name}.${k}`);
      cmp(s.influx?.densityKgM3, e.influx?.densityKgM3, `${c.well}.${name}.influx.density`);
      cmp(s.influx?.heightM, e.influx?.heightM, `${c.well}.${name}.influx.height`);
      for (let i = 0; i < (e.schedule ?? []).length; i += 1) {
        cmp(s.schedule[i]?.pressurePa, e.schedule[i].pressurePa, `${c.well}.${name}.schedule[${i}].p`);
        cmp(s.schedule[i]?.strokes, e.schedule[i].strokes, `${c.well}.${name}.schedule[${i}].s`);
      }
    }
    const kt = tolerance(c.well);
    const ek = c.expected.kickTolerance;
    for (const k of ['maaspPa', 'formationPressurePa', 'headroomPa', 'kickToleranceM3']) cmp(kt[k], ek[k], `${c.well}.kt.${k}`);
    cmp(kt.cases.shutInM3, ek.cases.shutInM3, `${c.well}.kt.shutIn`);
    cmp(kt.cases.atShoeM3, ek.cases.atShoeM3, `${c.well}.kt.atShoe`);
    const sw = toleranceSweep(c.well);
    for (let i = 0; i < (c.expected.ktSweep ?? []).length; i += 1) {
      cmp(sw[i]?.kickToleranceM3, c.expected.ktSweep[i].kickToleranceM3, `${c.well}.sweep[${i}]`);
    }
  }
  return { checked, worstRel: worst, at };
};

// The hand-constructed IWCF-style example, with clean numbers and its own
// closed forms. It is the one case in this course a third party can check.
export const IWCF = cases.iwcfStyleExample;

export const iwcfCheck = () => {
  const i = IWCF.inputs;
  const ks = killSheet({
    tvdBhM: i.tvdBhM, tvdShoeM: i.tvdShoeM, mudDensityKgM3: i.mudDensityKgM3,
    sidppPa: i.sidppPa, sicpPa: i.sicpPa, pitGainM3: i.pitGainM3,
    scrPressurePa: i.scrPressurePa, pumpOutputM3PerStroke: i.pumpOutputM3PerStroke,
    stringVolumeM3: i.stringVolumeM3, annulusVolumeM3: i.annulusVolumeM3,
    annulusCapNearBitM2: i.annulusCapNearBitM2,
  });
  const kt = kickTolerance({
    tvdBhM: i.tvdBhM, tvdShoeM: i.tvdShoeM, mudDensityKgM3: i.mudDensityKgM3,
    fracEmwKgM3: i.fracEmwKgM3, kickIntensityKgM3: i.kickIntensityKgM3,
    influxDensityKgM3: i.influxDensityKgM3,
    annulusCapAtShoeM2: i.annulusCapAtShoeM2, annulusCapAtBitM2: i.annulusCapAtBitM2,
  });
  return { inputs: i, killSheet: ks, kickTolerance: kt, published: { killSheet: IWCF.killSheet, kickTolerance: IWCF.kickTolerance } };
};

// ---------------------------------------------------------------------------
// The capstone's own scenario, and the eighteen graded values.
// ---------------------------------------------------------------------------

// A kick and a fracture gradient the lessons never use, on the well the
// lessons never take volumes from.
export const CAPSTONE_SCENARIO = { sidppPa: 1.4e6, sicpPa: 2.1e6, pitGainM3: 2.2 };
export const CAPSTONE_FRAC_EMW = 1820;
export const CAPSTONE_KICK_INTENSITY = 45;

export const capstoneValues = () => {
  const vs = volumes('slant');
  const ks = sheet('slant', CAPSTONE_SCENARIO);
  const kh = sheet('horizontal', CAPSTONE_SCENARIO);
  const over = { fracEmwKgM3: CAPSTONE_FRAC_EMW, kickIntensityKgM3: CAPSTONE_KICK_INTENSITY };
  const kt = tolerance('slant', over);
  const kth = tolerance('horizontal', over);
  return {
    beginner: {
      slant_string_volume_m3: vs.stringVolumeM3,
      slant_annulus_volume_m3: vs.annulusVolumeM3,
      slant_strokes_to_bit: vs.strokesToBit,
      slant_bottoms_up_strokes: vs.bottomsUpStrokes,
      slant_tvd_at_bit_m: vs.tvdBhM,
      slant_tvd_at_shoe_m: vs.tvdShoeM,
    },
    intermediate: {
      kill_mud_density_kgm3: ks.killMudDensityKgM3,
      formation_pressure_Pa: ks.formationPressurePa,
      icp_Pa: ks.icpPa,
      fcp_Pa: ks.fcpPa,
      influx_density_kgm3: ks.influx.densityKgM3,
      influx_height_m: ks.influx.heightM,
    },
    advanced: {
      slant_maasp_Pa: kt.maaspPa,
      slant_kick_tolerance_m3: kt.kickToleranceM3,
      slant_headroom_Pa: kt.headroomPa,
      slant_kt_at_shoe_m3: kt.cases.atShoeM3,
      horizontal_maasp_Pa: kth.maaspPa,
      horizontal_kill_mud_density_kgm3: kh.killMudDensityKgM3,
    },
  };
};
