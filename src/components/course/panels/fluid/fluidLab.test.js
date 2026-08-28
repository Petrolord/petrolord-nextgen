/**
 * RC6 truth pins. Every graded capstone field is pinned here THROUGH the
 * teaching lab, so a panel and the live grader cannot drift apart, plus the
 * supporting truth the lessons state.
 *
 * The values come from /root/rc-wip-fluid/RC6-TRUTH.md section G, which
 * verify_section_g.py re-derives from the engine field by field. If this file
 * and that script disagree, the digest is stale.
 */
import { describe, it, expect } from 'vitest';
import {
  EKENE, oilSg, suttonPseudoCriticals, reducedState, correlationSpread,
  viscosityChain, zSpread, gasAt, waterAt, ekeneAt, validityReport,
  GOOD_OIL, goodOilStagesF, goodOilMeasured, goodOilComposition,
  goodOilCharacterization, goodOilUntuned, goodOilTuned, tuningLedger,
  goodOilFlash, TIER, TIER_ORDER, isGradable,
} from './fluidLab';

const EK = { api: 32, gasSg: 0.75, tempF: 180, pbPsia: 2000, rsScfStb: 400 };

describe('the provenance ladder', () => {
  it('names every tier the engine publishes', () => {
    expect(Object.keys(TIER).sort()).toEqual(
      ['armed', 'lab_tuned', 'measured', 'oracle_gated', 'published_method', 'screening'],
    );
    expect(TIER_ORDER).toHaveLength(6);
    expect(new Set(TIER_ORDER)).toEqual(new Set(Object.keys(TIER)));
  });
  it('makes exactly one tier ungradable', () => {
    const ungradable = Object.keys(TIER).filter((t) => !isGradable(t));
    expect(ungradable).toEqual(['screening']);
  });
});

describe('Ekene: the Associate tier capstone fields', () => {
  it('oil specific gravity from API', () => {
    expect(oilSg(EKENE.api)).toBe(0.8654434250764526);
  });

  // CAPSTONE ekene_pb_standing_psia (tol 0.05)
  it('Standing bubble point at the designed 400 scf/stb', () => {
    const standing = correlationSpread(EK).find((c) => c.name === 'Standing');
    expect(standing.pbAtRs).toBe(1912.1923059028293);
  });

  // CAPSTONE ekene_bo_at_designed_rs (tol 0.0005)
  it('Standing Bo at the designed 400 scf/stb', () => {
    const standing = correlationSpread(EK).find((c) => c.name === 'Standing');
    expect(standing.boAtRs).toBe(1.2407824121407645);
  });

  // CAPSTONE ekene_muod_beal_cp (tol 0.0005)
  it('Beal dead oil viscosity', () => {
    expect(viscosityChain({ ...EK, pPsia: 2000 }).deadOilCp).toBe(2.3437444714709295);
  });

  // CAPSTONE ekene_z_hy_at_pi and ekene_z_correlation_gap_pct
  it('gas z at the initial pressure of 3200 psia, both correlations', () => {
    const z = zSpread(EKENE.piPsia, EKENE.tempF, EKENE.gasSg);
    expect(z.hallYarborough).toBe(0.8577529684232971);       // tol 0.0005
    expect(z.dranchukAbouKassem).toBe(0.8605955632995046);
    expect(z.gapPct).toBe(-0.3303055462323185);              // tol 0.002
  });

  // CAPSTONE ekene_bg_at_pi_rb_scf (tol 5e-7)
  it('gas formation volume factor at 3200 psia on the Hall-Yarborough z', () => {
    const z = zSpread(EKENE.piPsia, EKENE.tempF, EKENE.gasSg);
    expect(gasAt(EKENE.piPsia, EKENE.tempF, EKENE.gasSg, z.hallYarborough).bgRbPerScf)
      .toBe(0.0008633118643757966);
  });
});

describe('Ekene: the supporting truth the lessons state', () => {
  it('Sutton pseudo-criticals', () => {
    const { ppcPsia, tpcR } = suttonPseudoCriticals(EKENE.gasSg);
    expect(ppcPsia).toBe(656.525);
    expect(tpcR).toBe(389.7);
  });
  it('the reduced state at the initial pressure', () => {
    const { ppr, tpr } = reducedState(EKENE.piPsia, EKENE.tempF, EKENE.gasSg);
    expect(ppr).toBe(4.874147976086212);
    expect(tpr).toBe(1.6414421349756225);
  });
  it('Standing Rs at the designed bubble point, which RC5 already grades', () => {
    const standing = correlationSpread(EK).find((c) => c.name === 'Standing');
    expect(standing.rsAtPb).toBe(421.93922752270595);
  });
  it('the viscosity chain thins with gas and thickens with pressure', () => {
    const chain = viscosityChain({ ...EK, pPsia: 2600 });
    expect(chain.deadOilCp).toBe(2.3437444714709295);
    expect(chain.liveOilAtPbCp).toBe(0.7559673199800581);
    expect(chain.oilAtPressureCp).toBe(0.8035947954460412);
    expect(chain.gasDissolvedThins).toBe(true);
    expect(chain.pressureThickens).toBe(true);
  });
  it('gas viscosity at the initial pressure', () => {
    const z = zSpread(EKENE.piPsia, EKENE.tempF, EKENE.gasSg);
    expect(gasAt(EKENE.piPsia, EKENE.tempF, EKENE.gasSg, z.hallYarborough).viscosityCp)
      .toBe(0.022022626655780805);
  });
  it('the three correlations disagree, and Glaso is the screening one', () => {
    const rows = correlationSpread(EK);
    expect(rows.map((r) => r.name)).toEqual(['Standing', 'Vasquez-Beggs', 'Glaso']);
    expect(rows.find((r) => r.name === 'Glaso').tier).toBe('screening');
    const pbs = rows.map((r) => r.pbAtRs);
    expect(Math.max(...pbs) - Math.min(...pbs)).toBeGreaterThan(100);
  });
  it('every correlation inverts its own Pb back to the Rs it was given', () => {
    for (const row of correlationSpread({ ...EK, pbPsia: 2000 })) {
      const back = correlationSpread({ ...EK, pbPsia: row.pbAtRs })
        .find((r) => r.name === row.name);
      expect(back.rsAtPb).toBeCloseTo(EK.rsScfStb, 8);
    }
  });
  it('formation water responds to pressure and temperature', () => {
    expect(waterAt(3200, 180).bwRbStb).toBeGreaterThan(1);
    expect(waterAt(3200, 220).bwRbStb).toBeGreaterThan(waterAt(3200, 100).bwRbStb);
    expect(waterAt(3200, 180, 100000).viscosityCp)
      .toBeGreaterThan(waterAt(3200, 180, 0).viscosityCp);
  });
  it('ekeneAt reports designed and correlated side by side', () => {
    const at = ekeneAt(EKENE.piPsia);
    expect(at.aboveBubblePoint).toBe(true);
    expect(at.rs.designed).toBe(400);
    expect(at.rs.correlated).toBe(421.93922752270595);
    expect(at.bo.designed).toBe(1.2);
    expect(at.bo.atDesignedRs).toBe(1.2407824121407645);
    expect(at.bo.atCorrelatedRs).toBe(1.2516120850485737);
  });
});

describe('validity warnings', () => {
  const base = {
    pi: EKENE.piPsia, tempF: EKENE.tempF, api: EKENE.api, gasSg: EKENE.gasSg,
    rsMax: EKENE.rsDesignScfStb,
  };
  it('Ekene as it stands is inside every range', () => {
    const { ppr, tpr } = reducedState(EKENE.piPsia, EKENE.tempF, EKENE.gasSg);
    expect(validityReport({ ...base, pprMax: ppr, tpr }).total).toBe(0);
  });
  it('the same fluid at 320 F raises one Vasquez-Beggs warning', () => {
    const { ppr, tpr } = reducedState(EKENE.piPsia, 320, EKENE.gasSg);
    const r = validityReport({
      ...base, pbRsBo: 'vasquez_beggs', tempF: 320, pprMax: ppr, tpr,
    });
    expect(r.correlation).toHaveLength(1);
    expect(r.correlation[0]).toMatch(/Vasquez-Beggs/);
  });
});

describe('Good Oil Well No. 4: what the laboratory measured', () => {
  it('the study as the fixture carries it', () => {
    const m = goodOilMeasured();
    expect(m.reservoirTempF).toBe(220);
    expect(m.bubblePointPsia).toBe(2634.65);
    expect(m.totalGorScfStb).toBe(768);
    expect(m.stockTankApi).toBe(40.7);
    expect(m.boRbStb).toBe(1.474);
    expect(m.plusMw).toBe(218);
    expect(m.plusSg).toBe(0.8515);
    expect(m.componentCount).toBe(11);
    expect(m.tier).toBe('measured');
  });
  it('the composition sums to one and ends in the pseudo-component', () => {
    const comp = goodOilComposition();
    expect(comp).toHaveLength(11);
    expect(comp.reduce((s, c) => s + c.molFraction, 0)).toBeCloseTo(1, 12);
    expect(comp[comp.length - 1].key).toBe('C7+');
    expect(comp[comp.length - 1].isPseudo).toBe(true);
    expect(comp.find((c) => c.key === 'C1').molFraction).toBe(0.3647);
    expect(comp[comp.length - 1].molFraction).toBe(0.3329);
  });
  it('the report lists one separator stage and implies the stock tank', () => {
    expect(GOOD_OIL.stagesF).toEqual([[75, 114.65]]);
    expect(goodOilStagesF()).toEqual([[75, 114.65], [75, 14.65]]);
  });
});

describe('Good Oil: the Professional tier capstone fields', () => {
  // CAPSTONE good_oil_c7plus_tc_r (tol 0.05)
  it('characterizes C7+ from MW and SG alone', () => {
    const ch = goodOilCharacterization();
    expect(ch.tcR).toBe(1324.2385574932478);
    expect(ch.pcPsia).toBe(262.591601775175);
    expect(ch.omega).toBe(0.6690835265426222);
    expect(ch.shift).toBe(0.15389683656773767);
    expect(ch.tbR).toBe(998.2811638461088);
    expect(ch.watsonK).toBe(11.73724869095868);
    expect(ch.tier).toBe('published_method');
  });

  // CAPSTONE good_oil_untuned_psat_psia, _gor_scf_stb, _sto_api
  it('runs untuned against the study conditions', () => {
    const u = goodOilUntuned();
    expect(u.totalGorScfStb).toBe(793.8042771796476);   // tol 1
    expect(u.stockTankApi).toBe(31.8056416463794);      // tol 0.05
    expect(u.separatorGorScfStb).toBe(712.4345234580164);
    expect(u.stockTankGorScfStb).toBe(81.36975372163106);
    expect(u.surfaceGasGravity).toBe(0.8387343037652255);
    expect(u.stockTankSg).toBe(0.8664734333330801);
    expect(u.tier).toBe('oracle_gated');
    // The two stages add up, which is the identity that says the train is a
    // train rather than two independent flashes.
    expect(u.separatorGorScfStb + u.stockTankGorScfStb).toBeCloseTo(u.totalGorScfStb, 9);
  });

  // CAPSTONE good_oil_psat_bias_pct (tol 0.02) and good_oil_api_bias (tol 0.05)
  it('reports both documented untuned biases', () => {
    const t = tuningLedger();
    const psat = t.find((r) => r.name === 'psat');
    const api = t.find((r) => r.name === 'stoApi');
    expect(psat.untuned).toBe(2791.100735294379);       // tol 0.5
    expect(psat.untunedErr).toBe(5.938198064045652);    // tol 0.02
    expect(api.untunedErr).toBe(-8.894358353620603);    // tol 0.05
  });

  it('withholds Bo because the untuned model is two phase at reservoir conditions', () => {
    const u = goodOilUntuned();
    expect(u.boRbStb).toBeNull();
    // and this is why: the model saturates ABOVE where the lab says the oil is
    expect(u.saturationPressurePsia).toBeGreaterThan(goodOilMeasured().bubblePointPsia);
  });
});

describe('Good Oil: the Expert tier capstone fields', () => {
  const fit = goodOilTuned();

  it('converges without hitting a bound', () => {
    expect(fit.converged).toBe(true);
    expect(fit.boundsHit).toEqual([]);
    expect(fit.tier).toBe('lab_tuned');
  });

  // CAPSTONE tuned_splus_knob and tuned_kc1_knob (tol 0.0005)
  it('lands the four knobs', () => {
    expect(fit.knobs.sPlus).toBe(0.12266364195926757);
    expect(fit.knobs.kC1).toBe(0.050325447877585576);
    expect(fit.knobs.fTc).toBe(0.9963403431519178);
    expect(fit.knobs.fPc).toBe(0.9827953945642255);
  });

  // CAPSTONE tuning_ssr_reduction (tol 0.05)
  it('cuts the residual by a factor of twenty three', () => {
    expect(fit.ssrBefore).toBe(0.007631032308112891);
    expect(fit.ssrAfter).toBe(0.00032953309314853003);
    expect(fit.ssrReduction).toBe(23.157104602764026);
  });

  // CAPSTONE good_oil_tuned_psat_psia, _gor_scf_stb, _sto_api
  it('lands the four targets', () => {
    const t = Object.fromEntries(tuningLedger().map((r) => [r.name, r]));
    expect(t.psat.tuned).toBe(2632.64216695564);           // tol 0.5
    expect(t.totalGor.tuned).toBe(761.7262989883229);      // tol 1
    expect(t.stoApi.tuned).toBe(38.755039373806255);       // tol 0.05
    expect(t.bo.tuned).toBe(1.4573161052573853);
  });

  it('THE TIER\'S SHARPEST RESULT: the joint fit trades Bo away', () => {
    const t = Object.fromEntries(tuningLedger().map((r) => [r.name, r]));
    expect(t.psat.improved).toBe(true);
    expect(t.totalGor.improved).toBe(true);
    expect(t.stoApi.improved).toBe(true);
    // Bo was the best-matched target untuned and the tuning gave it up.
    expect(t.bo.improved).toBe(false);
    expect(t.bo.untunedErr).toBe(-0.30851008490921433);
    expect(t.bo.tunedErr).toBe(-1.131878883488105);
    // Four knobs cannot make four targets exact, and this is what that costs.
    expect(tuningLedger().filter((r) => !r.improved)).toHaveLength(1);
  });
});

describe('the flash the Expert tier reads', () => {
  it('is two phase below the lab bubble point and single phase above it', () => {
    const below = goodOilFlash(220, 1500);
    expect(below.twoPhase).toBe(true);
    expect(below.beta).toBeGreaterThan(0);
    const above = goodOilFlash(220, 5000);
    expect(above.twoPhase).toBe(false);
    expect(above.tier).toBe('oracle_gated');
  });
});
