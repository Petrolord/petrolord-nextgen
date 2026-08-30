// DR4 teaching lab, pinned against the published oracle and the capstone truth.
import { describe, it, expect } from 'vitest';
import {
  WELLS, caseOf, volumes, SCENARIOS, sheet, tolerance, toleranceSweep,
  oracleCheck, IWCF, iwcfCheck, capstoneValues, boyle, maaspPa,
  INFLUX_GAS_MAX_KGM3, INFLUX_LIQUID_MIN_KGM3,
  CAPSTONE_SCENARIO, CAPSTONE_FRAC_EMW, CAPSTONE_KICK_INTENSITY,
} from './wellcontrolLab.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the two wells', () => {
  it('is the slant and the horizontal, sharing a mud and a pump', () => {
    expect(WELLS.map((w) => w.id).sort()).toEqual(['horizontal', 'slant']);
    for (const w of WELLS) {
      expect(w.mudDensityKgM3).toBe(1440);
      expect(w.fracEmwKgM3).toBe(1750);
      expect(w.pumpOutputM3PerStroke).toBe(0.012);
      expect(w.scrPressurePa).toBe(4500000);
    }
  });

  it('gives the horizontal well the volumes the lessons teach on', () => {
    const v = volumes('horizontal');
    near(v.stringVolumeM3, 24.23065791, 1e-6);
    near(v.annulusVolumeM3, 67.365410592, 1e-6);
    near(v.tvdBhM, 1214.859173174, 1e-6);
    near(v.tvdShoeM, 1172.343525979, 1e-6);
    near(v.strokesToBit, 2019.221492463, 1e-6);
    near(v.bottomsUpStrokes, 5613.784216004, 1e-6);
  });

  it('gives both wells the same annulus capacities, since the string and casing are shared', () => {
    near(volumes('slant').capBitM2, volumes('horizontal').capBitM2, 1e-15);
    near(volumes('slant').capShoeM2, volumes('horizontal').capShoeM2, 1e-15);
    near(volumes('slant').capShoeM2, 0.025517668, 1e-6);
  });

  it('makes the horizontal well shallower in TVD and deeper in MD than the slant', () => {
    expect(volumes('horizontal').bitMd).toBeLessThan(volumes('slant').bitMd);
    expect(volumes('horizontal').tvdBhM).toBeLessThan(volumes('slant').tvdBhM);
    // and its shoe is only tens of metres of TVD above its bit
    expect(volumes('horizontal').tvdBhM - volumes('horizontal').tvdShoeM).toBeLessThan(50);
    expect(volumes('slant').tvdBhM - volumes('slant').tvdShoeM).toBeGreaterThan(1000);
  });
});

describe('the kill sheet', () => {
  it('reproduces the published moderate scenario on both wells', () => {
    const s = sheet('slant', 'moderate_gas');
    near(s.killMudDensityKgM3, 1521.319686054, 1e-6);
    near(s.formationPressurePa, 37415778.63557866, 1e-3);
    near(s.icpPa, 6500000, 1e-6);
    near(s.fcpPa, 4754124.018918467, 1e-3);
    const h = sheet('horizontal', 'moderate_gas');
    near(h.killMudDensityKgM3, 1607.873978399, 1e-6);
    near(h.fcpPa, 5024606.182497741, 1e-3);
  });

  it('makes the kill mud weight the mud weight plus the SIDPP over the TVD head', () => {
    for (const w of ['slant', 'horizontal']) {
      for (const n of Object.keys(SCENARIOS)) {
        const s = sheet(w, n);
        near(s.killMudDensityKgM3, 1440 + SCENARIOS[n].sidppPa / (9.80665 * s.volumes.tvdBhM), 1e-9);
      }
    }
  });

  it('makes the ICP the slow circulating pressure plus the SIDPP, exactly', () => {
    for (const n of Object.keys(SCENARIOS)) {
      near(sheet('slant', n).icpPa, 4500000 + SCENARIOS[n].sidppPa, 1e-9);
    }
  });

  it('scales the FCP by the kill mud over the original mud', () => {
    for (const n of Object.keys(SCENARIOS)) {
      const s = sheet('slant', n);
      near(s.fcpPa, 4500000 * s.killMudDensityKgM3 / 1440, 1e-6);
    }
  });

  it('gives a schedule that runs from ICP to FCP over the strokes to the bit', () => {
    const s = sheet('slant', 'moderate_gas');
    expect(s.schedule).toHaveLength(11);
    near(s.schedule[0].pressurePa, s.icpPa, 1e-9);
    near(s.schedule[0].strokes, 0, 1e-9);
    near(s.schedule[10].pressurePa, s.fcpPa, 1e-6);
    near(s.schedule[10].strokes, s.strokesToBit, 1e-6);
    for (let i = 1; i < s.schedule.length; i += 1) {
      expect(s.schedule[i].pressurePa).toBeLessThan(s.schedule[i - 1].pressurePa);
      expect(s.schedule[i].strokes).toBeGreaterThan(s.schedule[i - 1].strokes);
    }
  });

  it('classifies both published influxes as LIQUID despite one being named gas', () => {
    // the density is computed from SICP less SIDPP over the influx height, and
    // on both scenarios it lands above the liquid threshold
    const a = sheet('slant', 'moderate_gas').influx;
    const b = sheet('slant', 'small_liquid').influx;
    near(a.densityKgM3, 1026.318798517, 1e-6);
    near(b.densityKgM3, 1348.070844115, 1e-6);
    expect(a.kind).toBe('liquid');
    expect(b.kind).toBe('liquid');
    expect(a.densityKgM3).toBeGreaterThan(INFLUX_LIQUID_MIN_KGM3);
    expect(INFLUX_GAS_MAX_KGM3).toBe(480);
  });

  it('gives the influx height as the pit gain over the annulus capacity at the bit', () => {
    for (const n of Object.keys(SCENARIOS)) {
      const s = sheet('slant', n);
      near(s.influx.heightM, SCENARIOS[n].pitGainM3 / s.volumes.capBitM2, 1e-6);
    }
  });
});

describe('kick tolerance', () => {
  it('reproduces the published values on both wells', () => {
    const s = tolerance('slant');
    near(s.maaspPa, 3898114.57283317, 1e-3);
    near(s.kickToleranceM3, 2.783680489, 1e-6);
    near(s.cases.atShoeM3, 3.133289667, 1e-6);
    const h = tolerance('horizontal');
    near(h.kickToleranceM3, 1.078825342, 1e-6);
    near(h.cases.shutInM3, 3.274027579, 1e-6);
  });

  it('takes the SMALLER of the two cases on each well, and they differ in which', () => {
    const s = tolerance('slant');
    const h = tolerance('horizontal');
    expect(s.kickToleranceM3).toBe(Math.min(s.cases.shutInM3, s.cases.atShoeM3));
    expect(h.kickToleranceM3).toBe(Math.min(h.cases.shutInM3, h.cases.atShoeM3));
    // the slant well is limited shut in, the horizontal one at the shoe
    expect(s.cases.shutInM3).toBeLessThan(s.cases.atShoeM3);
    expect(h.cases.atShoeM3).toBeLessThan(h.cases.shutInM3);
  });

  it('gives MAASP as the fracture pressure at the shoe less the mud column to it', () => {
    for (const w of ['slant', 'horizontal']) {
      const v = volumes(w);
      near(tolerance(w).maaspPa, maaspPa({ tvdShoeM: v.tvdShoeM, mudDensityKgM3: 1440, fracEmwKgM3: 1750 }), 1e-9);
    }
  });

  it('falls to zero as the mud weight approaches the fracture gradient', () => {
    const sw = toleranceSweep('slant');
    for (let i = 1; i < sw.length; i += 1) {
      expect(sw[i].kickToleranceM3).toBeLessThanOrEqual(sw[i - 1].kickToleranceM3);
    }
    near(sw[0].kickToleranceM3, 7.814484267, 1e-6);
    expect(sw[sw.length - 1].kickToleranceM3).toBe(0);
  });

  it('expands a bubble by Boyle', () => {
    near(boyle({ p1Pa: 2e7, v1M3: 1, p2Pa: 1e7 }), 2, 1e-12);
    near(boyle({ p1Pa: 1e7, v1M3: 3, p2Pa: 1e7 }), 3, 1e-12);
  });
});

describe('the oracle and the hand example', () => {
  it('reproduces every published value to better than 1e-6', () => {
    const o = oracleCheck();
    expect(o.checked).toBeGreaterThan(100);
    expect(o.worstRel).toBeLessThan(1e-6);
  });

  it('reproduces the hand-constructed IWCF example', () => {
    const r = iwcfCheck();
    near(r.killSheet.killMudDensityKgM3, IWCF.killSheet.killMudDensityKgM3, 1e-6);
    near(r.killSheet.icpPa, IWCF.killSheet.icpPa, 1e-6);
    near(r.killSheet.fcpPa, IWCF.killSheet.fcpPa, 1e-6);
    near(r.kickTolerance.maaspPa, IWCF.kickTolerance.maaspPa, 1e-3);
    near(r.kickTolerance.kickToleranceM3, IWCF.kickTolerance.kickToleranceM3, 1e-6);
  });

  it('gives the hand example round closed forms a reader can check', () => {
    const i = IWCF.inputs;
    const r = iwcfCheck();
    // ICP is exactly the slow circulating pressure plus the SIDPP
    near(r.killSheet.icpPa, i.scrPressurePa + i.sidppPa, 1e-9);
    // strokes to bit and bottoms up are exact divisions of round volumes
    near(i.stringVolumeM3 / i.pumpOutputM3PerStroke, 4000, 1e-9);
    near(i.annulusVolumeM3 / i.pumpOutputM3PerStroke, 12000, 1e-9);
    // the influx height is the pit gain over the annulus capacity, exactly 200 m
    near(r.killSheet.influx.heightM, 200, 1e-9);
    // and MAASP is the fracture head less the mud head over 2000 m of TVD
    near(r.kickTolerance.maaspPa, (i.fracEmwKgM3 - i.mudDensityKgM3) * 9.80665 * i.tvdShoeM, 1e-6);
  });
});

describe('the eighteen graded values', () => {
  const v = capstoneValues();

  it('runs a scenario and a fracture gradient the lessons do not use', () => {
    expect(CAPSTONE_SCENARIO).toEqual({ sidppPa: 1.4e6, sicpPa: 2.1e6, pitGainM3: 2.2 });
    expect(CAPSTONE_FRAC_EMW).toBe(1820);
    expect(CAPSTONE_KICK_INTENSITY).toBe(45);
    for (const n of Object.keys(SCENARIOS)) {
      expect(SCENARIOS[n].sidppPa).not.toBe(CAPSTONE_SCENARIO.sidppPa);
      expect(SCENARIOS[n].pitGainM3).not.toBe(CAPSTONE_SCENARIO.pitGainM3);
    }
    expect(caseOf('slant').fracEmwKgM3).not.toBe(CAPSTONE_FRAC_EMW);
  });

  it('reproduces the Associate six', () => {
    near(v.beginner.slant_string_volume_m3, 26.0836036552257, 1e-9);
    near(v.beginner.slant_annulus_volume_m3, 72.46894410089696, 1e-9);
    near(v.beginner.slant_strokes_to_bit, 2173.6336379354752, 1e-6);
    near(v.beginner.slant_bottoms_up_strokes, 6039.078675074747, 1e-6);
    near(v.beginner.slant_tvd_at_bit_m, 2507.9196993011733, 1e-9);
    near(v.beginner.slant_tvd_at_shoe_m, 1282.248590310811, 1e-9);
  });

  it('reproduces the Professional six', () => {
    near(v.intermediate.kill_mud_density_kgm3, 1496.9237802377363, 1e-9);
    near(v.intermediate.formation_pressure_Pa, 36815778.63557866, 1e-3);
    near(v.intermediate.icp_Pa, 5900000, 1e-6);
    near(v.intermediate.fcp_Pa, 4677886.813242926, 1e-3);
    near(v.intermediate.influx_density_kgm3, 1001.2472105482163, 1e-9);
    near(v.intermediate.influx_height_m, 162.6887318429214, 1e-9);
  });

  it('reproduces the Expert six', () => {
    near(v.advanced.slant_maasp_Pa, 4778333.992505175, 1e-3);
    near(v.advanced.slant_kick_tolerance_m3, 4.219078164062683, 1e-9);
    near(v.advanced.slant_headroom_Pa, 3671590.9101433456, 1e-3);
    near(v.advanced.slant_kt_at_shoe_m3, 4.9888090018644276, 1e-9);
    near(v.advanced.horizontal_maasp_Pa, 4368769.802836261, 1e-3);
    near(v.advanced.horizontal_kill_mud_density_kgm3, 1557.511784879494, 1e-9);
  });

  it('keeps every graded value clear of every other one at its own tolerance', () => {
    const TOL = {
      slant_string_volume_m3: 5e-4, slant_annulus_volume_m3: 5e-4,
      slant_strokes_to_bit: 0.05, slant_bottoms_up_strokes: 0.05,
      slant_tvd_at_bit_m: 5e-4, slant_tvd_at_shoe_m: 5e-4,
      kill_mud_density_kgm3: 0.005, formation_pressure_Pa: 50, icp_Pa: 50,
      fcp_Pa: 50, influx_density_kgm3: 0.005, influx_height_m: 0.005,
      slant_maasp_Pa: 50, slant_kick_tolerance_m3: 5e-4, slant_headroom_Pa: 50,
      slant_kt_at_shoe_m3: 5e-4, horizontal_maasp_Pa: 50,
      horizontal_kill_mud_density_kgm3: 0.005,
    };
    const all = Object.entries(v).flatMap(([t, fs]) => Object.entries(fs).map(([k, val]) => [t, k, val]));
    expect(all).toHaveLength(18);
    expect(Object.keys(TOL)).toHaveLength(18);
    for (let i = 0; i < all.length; i += 1) {
      for (let j = i + 1; j < all.length; j += 1) {
        expect(Math.abs(all[i][2] - all[j][2]))
          .toBeGreaterThan(Math.max(TOL[all[i][1]], TOL[all[j][1]]));
      }
    }
  });
});
