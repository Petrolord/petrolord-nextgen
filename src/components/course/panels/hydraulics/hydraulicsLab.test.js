// DR3 teaching lab, pinned against DR3-TRUTH.md.
import { describe, it, expect } from 'vitest';
import {
  CASES, caseOf, rheology, rheologyCurve, fitResiduals, hydraulicsRun, pressureSplit,
  flowSweep, flowElements, oracleCheck, holeCleaning, cleaningSweep, minimumFlow,
  surgeSwab, tripSweep, closedOverOpen, speedLimit, capstoneValues,
  BIT_CD, CLINGING_CONSTANT, TAU_PER_DEG_PA, GAMMA_PER_RPM,
  CAPSTONE_FANN, CAPSTONE_DENSITY_KGM3, CAPSTONE_FLOW_M3S, CAPSTONE_TRIP_MS,
} from './hydraulicsLab.js';

const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

describe('the four fixtures', () => {
  it('is two wells crossed with two muds', () => {
    expect(CASES.map((c) => c.id).sort()).toEqual([
      'horizontal_kcl_polymer', 'horizontal_light_wbm',
      'slant_kcl_polymer', 'slant_light_wbm',
    ]);
    expect(caseOf('slant_kcl_polymer').mud.densityKgM3).toBe(1440);
    expect(caseOf('slant_light_wbm').mud.densityKgM3).toBe(1200);
  });

  it('shares one string and one bit across all four', () => {
    const tfa = CASES.map((c) => caseOf(c.id).nozzleTfaM2);
    expect(new Set(tfa).size).toBe(1);
    for (const c of CASES) {
      expect(caseOf(c.id).string.map((s) => s.type)).toEqual(['dc', 'hwdp', 'dp']);
    }
  });

  it('carries the two constants the methods depend on', () => {
    expect(BIT_CD).toBe(0.95);
    expect(CLINGING_CONSTANT).toBe(0.45);
    near(TAU_PER_DEG_PA, 1.066 * 0.47880259, 1e-15);
    expect(GAMMA_PER_RPM).toBe(1.70233);
  });
});

describe('rheology', () => {
  it('fits three models to four dial readings', () => {
    const f = rheology('slant_kcl_polymer');
    near(f.powerLaw.n, 0.7520724865564147, 1e-12);
    near(f.powerLaw.kPaSn, 0.17822183097896477, 1e-12);
    near(f.bingham.pvPaS, 0.025984959015858657, 1e-12);
    near(f.bingham.ypPa, 6.124842731279998, 1e-9);
    near(f.herschelBulkley.tauYPa, 2.5520178046999997, 1e-9);
    near(f.herschelBulkley.n, 0.8382489300033881, 1e-12);
  });

  it('reproduces the two-point models exactly at their own two points', () => {
    for (const r of fitResiduals('slant_kcl_polymer')) {
      if (r.name === 'theta600' || r.name === 'theta300') {
        near(r.powerLawPa, r.measuredPa, 1e-9);
        near(r.binghamPa, r.measuredPa, 1e-9);
      }
    }
  });

  it('misses the low-rate readings with the two-point models and not with Herschel-Bulkley', () => {
    const rs = fitResiduals('slant_kcl_polymer');
    const t3 = rs.find((r) => r.name === 'theta3');
    expect(Math.abs(t3.binghamPa - t3.measuredPa)).toBeGreaterThan(0.5);
    expect(Math.abs(t3.herschelBulkleyPa - t3.measuredPa)).toBeLessThan(
      Math.abs(t3.binghamPa - t3.measuredPa),
    );
  });

  it('gives a shear-thinning apparent viscosity', () => {
    const c = rheologyCurve('slant_kcl_polymer');
    for (let i = 1; i < c.length; i += 1) {
      expect(c[i].apparentHb).toBeLessThan(c[i - 1].apparentHb);
      expect(c[i].herschelBulkley).toBeGreaterThan(c[i - 1].herschelBulkley);
    }
  });
});

describe('the pressure chain', () => {
  it('splits the pump pressure into pipe, annulus and bit', () => {
    const s = pressureSplit('slant_kcl_polymer', 0.025);
    near(s.pumpPressurePa, 11771089.324261548, 1e-3);
    near(s.pipeDpPa, 7998453.767490401, 1e-3);
    near(s.annulusDpPa, 1434707.6543385487, 1e-3);
    near(s.bitDpPa, 2337927.902432598, 1e-3);
    near(s.pipeDpPa + s.annulusDpPa + s.bitDpPa, s.pumpPressurePa, 1e-6);
    near(s.pipeShare + s.annulusShare + s.bitShare, 1, 1e-12);
  });

  it('puts most of this system loss in the pipe rather than the bit', () => {
    const s = pressureSplit('slant_kcl_polymer', 0.025);
    near(s.bitShare, 0.1986161040859544, 1e-12);
    expect(s.pipeShare).toBeGreaterThan(0.6);
    expect(s.bitShare).toBeLessThan(0.3);
  });

  it('raises every loss with flow rate, the bit fastest', () => {
    const sw = flowSweep('slant_kcl_polymer');
    for (let i = 1; i < sw.length; i += 1) {
      expect(sw[i].pumpPressurePa).toBeGreaterThan(sw[i - 1].pumpPressurePa);
      expect(sw[i].bitShare).toBeGreaterThan(sw[i - 1].bitShare);
    }
  });

  it('builds a flow path with both a pipe and an annulus side', () => {
    const e = flowElements('slant_kcl_polymer');
    expect(e.pipeElements.length).toBeGreaterThan(0);
    expect(e.annulusElements.length).toBeGreaterThan(0);
    expect(e.bitMd).toBe(3000);
    expect(e.uncovered).toBeFalsy();
  });

  it('raises the ECD above the mud weight and never below it', () => {
    for (const c of CASES) {
      const s = pressureSplit(c.id, 0.025);
      expect(s.ecdOverMudKgM3).toBeGreaterThan(0);
      const cps = s.ecdProfile;
      for (let i = 1; i < cps.length; i += 1) expect(cps[i].md).toBeGreaterThan(cps[i - 1].md);
    }
  });
});

describe('the oracle check', () => {
  it('agrees with the independent numpy implementation to better than 1e-6', () => {
    const o = oracleCheck();
    expect(o.checked).toBeGreaterThan(100);
    expect(o.worstRel).toBeLessThan(1e-6);
    expect(o.worstRel).toBeGreaterThan(0);
  });
});

describe('hole cleaning', () => {
  it('reproduces the published transport ratio', () => {
    near(holeCleaning('slant_kcl_polymer', 0.025).minTransportRatio, 0.828481556, 1e-6);
    near(holeCleaning('slant_light_wbm', 0.025).minTransportRatio, 0.769992315, 1e-6);
  });

  it('cleans better with a heavier mud at the same rate', () => {
    const heavy = holeCleaning('slant_kcl_polymer', 0.025).minTransportRatio;
    const light = holeCleaning('slant_light_wbm', 0.025).minTransportRatio;
    expect(heavy).toBeGreaterThan(light);
  });

  it('improves monotonically with flow rate', () => {
    const sw = cleaningSweep('horizontal_kcl_polymer');
    for (let i = 1; i < sw.length; i += 1) {
      expect(sw[i].minTransportRatio).toBeGreaterThan(sw[i - 1].minTransportRatio);
      expect(sw[i].worstCuttingsConcPct).toBeLessThan(sw[i - 1].worstCuttingsConcPct);
    }
  });

  it('solves for the flow rate that reaches a target transport ratio', () => {
    const q = minimumFlow('horizontal_kcl_polymer', 0.9);
    near(holeCleaning('horizontal_kcl_polymer', q).minTransportRatio, 0.9, 1e-6);
    expect(minimumFlow('horizontal_kcl_polymer', 0.9))
      .toBeGreaterThan(minimumFlow('horizontal_kcl_polymer', 0.5));
  });
});

describe('surge and swab', () => {
  it('reproduces the published closed-string pressures', () => {
    const r = surgeSwab('slant_kcl_polymer', 0.5, 'closed');
    near(r.dpPa, 981472.927055978, 1e-3);
    near(r.surgeEmwKgM3, 1479.906535149, 1e-6);
    near(r.swabEmwKgM3, 1400.093464851, 1e-6);
  });

  it('makes surge and swab symmetric about the mud weight', () => {
    for (const v of [0.2, 0.5, 1.0]) {
      const r = surgeSwab('slant_kcl_polymer', v, 'closed');
      near(r.surgeEmwKgM3 - 1440, 1440 - r.swabEmwKgM3, 1e-9);
    }
  });

  it('gives a closed string a larger pressure than an open one', () => {
    for (const v of [0.2, 0.5, 1.0]) {
      expect(closedOverOpen('slant_kcl_polymer', v)).toBeGreaterThan(1);
    }
    near(closedOverOpen('slant_kcl_polymer', 0.5), 981472.927055978 / 837277.270608184, 1e-9);
  });

  it('rises with trip speed and less than proportionally', () => {
    const sw = tripSweep('slant_kcl_polymer');
    for (let i = 1; i < sw.length; i += 1) expect(sw[i].dpPa).toBeGreaterThan(sw[i - 1].dpPa);
    const a = sw.find((r) => r.tripSpeedMs === 0.5);
    const b = sw.find((r) => r.tripSpeedMs === 1.0);
    expect(b.dpPa / a.dpPa).toBeLessThan(2);
    expect(b.dpPa / a.dpPa).toBeGreaterThan(1);
  });

  it('solves for the trip speed a pressure window allows', () => {
    const v = speedLimit('slant_kcl_polymer', { fracEmwKgM3: 1500, poreEmwKgM3: 1380 });
    expect(v).toBeGreaterThan(0);
    const r = surgeSwab('slant_kcl_polymer', v, 'closed');
    expect(r.surgeEmwKgM3).toBeLessThanOrEqual(1500 + 1e-6);
    expect(r.swabEmwKgM3).toBeGreaterThanOrEqual(1380 - 1e-6);
  });
});

describe('the eighteen graded values', () => {
  const v = capstoneValues();

  it('runs on a mud, a flow rate and a trip speed the lessons do not use', () => {
    expect(CAPSTONE_FANN).toEqual({ theta600: 52, theta300: 33, theta6: 6, theta3: 5 });
    expect(CAPSTONE_DENSITY_KGM3).toBe(1320);
    expect(CAPSTONE_FLOW_M3S).toBe(0.030);
    expect(CAPSTONE_TRIP_MS).toBe(0.75);
    for (const c of CASES) {
      expect(caseOf(c.id).mud.fann).not.toEqual(CAPSTONE_FANN);
      expect(caseOf(c.id).mud.densityKgM3).not.toBe(CAPSTONE_DENSITY_KGM3);
    }
  });

  it('reproduces the Associate six', () => {
    near(v.beginner.pl_n, 0.6560455987826389, 1e-12);
    near(v.beginner.hb_tau_y_Pa, 2.04161424376, 1e-9);
    near(v.beginner.pipe_dp_Pa, 8990804.931422047, 1e-3);
    near(v.beginner.annulus_dp_Pa, 1531961.9814624505, 1e-3);
    near(v.beginner.bit_dp_Pa, 3086064.831211029, 1e-3);
    near(v.beginner.pump_pressure_Pa, 13608831.744095527, 1e-3);
  });

  it('reproduces the Professional six', () => {
    near(v.intermediate.slant_ecd_at_td_kgm3, 1382.2893336895256, 1e-9);
    near(v.intermediate.slant_min_annular_velocity_ms, 1.1756560409748478, 1e-12);
    near(v.intermediate.horizontal_ecd_at_td_kgm3, 1441.9531576465401, 1e-9);
    near(v.intermediate.horizontal_min_transport_ratio, 0.8328468755463043, 1e-12);
    near(v.intermediate.horizontal_worst_cuttings_conc_pct, 0.7326199737252664, 1e-12);
    near(v.intermediate.horizontal_min_flow_tr080_m3s, 0.024178302356402937, 1e-12);
  });

  it('reproduces the Expert six', () => {
    near(v.advanced.slant_surge_dp_closed_Pa, 1147176.908236135, 1e-3);
    near(v.advanced.slant_surge_emw_closed_kgm3, 1366.6440330130283, 1e-9);
    near(v.advanced.slant_swab_emw_open_kgm3, 1281.0694196662196, 1e-9);
    near(v.advanced.closed_over_open_dp_ratio, 1.1981335138884341, 1e-12);
    near(v.advanced.horizontal_surge_emw_closed_kgm3, 1411.1350006312582, 1e-9);
    near(v.advanced.slant_max_trip_speed_ms, 1.0880403500952598, 1e-12);
  });

  it('keeps every graded value clear of every other one at its own tolerance', () => {
    const TOL = {
      pl_n: 5e-7, hb_tau_y_Pa: 5e-4, pipe_dp_Pa: 50, annulus_dp_Pa: 50,
      bit_dp_Pa: 50, pump_pressure_Pa: 50,
      slant_ecd_at_td_kgm3: 0.005, slant_min_annular_velocity_ms: 5e-5,
      horizontal_ecd_at_td_kgm3: 0.005, horizontal_min_transport_ratio: 5e-5,
      horizontal_worst_cuttings_conc_pct: 5e-5, horizontal_min_flow_tr080_m3s: 5e-6,
      slant_surge_dp_closed_Pa: 50, slant_surge_emw_closed_kgm3: 0.005,
      slant_swab_emw_open_kgm3: 0.005, closed_over_open_dp_ratio: 5e-5,
      horizontal_surge_emw_closed_kgm3: 0.005, slant_max_trip_speed_ms: 5e-5,
    };
    const all = Object.entries(v).flatMap(([tier, fs]) => Object.entries(fs).map(([k, val]) => [tier, k, val]));
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
