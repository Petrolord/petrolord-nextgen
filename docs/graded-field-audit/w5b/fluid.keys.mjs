// W5b re-case, fluid: every graded value is what the course panels show once
// the learner sets the case the brief states. Each key calls the same lab
// function the panels call (src/components/course/panels/fluid/fluidLab.js,
// on the vendored engines), with the case read from fluid.json.
import {
  correlationSpread, viscosityChain, zSpread, gasAt, goodOilCharacterization,
  goodOilUntuned, goodOilMeasured, goodOilTuned,
} from '../../../src/components/course/panels/fluid/fluidLab.js';

export function compute(tiers) {
  const out = {};
  const b = tiers.beginner.case;
  const standing = correlationSpread({ api: b.api, gasSg: b.gas_sg, tempF: b.temp_f, pbPsia: b.pb_psia, rsScfStb: b.rs_scf_stb })
    .find((r) => r.name === 'Standing');
  const z = zSpread(b.pi_psia, b.temp_f, b.gas_sg);
  out.beginner = {
    ekene_pb_standing_psia: standing.pbAtRs,
    ekene_bo_at_designed_rs: standing.boAtRs,
    ekene_muod_beal_cp: viscosityChain({ api: b.api, tempF: b.temp_f, rsScfStb: b.rs_scf_stb, pbPsia: b.pb_psia, pPsia: b.pi_psia }).deadOilCp,
    ekene_z_hy_at_pi: z.hallYarborough,
    ekene_bg_at_pi_rb_scf: gasAt(b.pi_psia, b.temp_f, b.gas_sg, z.hallYarborough).bgRbPerScf,
    ekene_z_correlation_gap_pct: z.gapPct,
  };
  const i = tiers.intermediate.case;
  const u = goodOilUntuned({ test: i.test, satTempF: i.sat_temp_f });
  const lab = goodOilMeasured(i.test);
  out.intermediate = {
    plus_tc_r: goodOilCharacterization(i.plus).tcR,
    untuned_psat_case_psia: u.saturationPressurePsia,
    gor_bias_pct: (u.totalGorScfStb / lab.totalGorScfStb - 1) * 100,
    good_oil_untuned_gor_scf_stb: u.totalGorScfStb,
    good_oil_untuned_sto_api: u.stockTankApi,
    good_oil_api_bias: u.stockTankApi - lab.stockTankApi,
  };
  const a = tiers.advanced.case;
  const t = goodOilTuned(a.test);
  const tuned = (name) => t.targets.find((r) => r.name === name).tuned;
  out.advanced = {
    good_oil_tuned_bo_rb_stb: tuned('bo'),
    good_oil_tuned_gor_scf_stb: tuned('totalGor'),
    good_oil_tuned_sto_api: tuned('stoApi'),
    tuned_splus_knob: t.knobs.sPlus,
    tuned_kc1_knob: t.knobs.kC1,
    tuning_ssr_reduction: t.ssrReduction,
  };
  return out;
}
