// W5b re-case, waterflood: every graded value is what the course panels show
// once the learner types the case the brief states. Each key calls the same
// lab function the panels call (src/components/course/panels/waterflood/
// floodLab.js, on the vendored engines), with the case read from
// waterflood.json.
import {
  ledgerWith, periodVoidage, allocationAudit, patternLedger, patternAdvice, surveillanceWith,
  layerSweep, permeabilityVariation, evAtFirstBreakthrough, forecast, channelBackoutFor, LEDGER_FVF,
} from '../../../src/components/course/panels/waterflood/floodLab.js';

export function compute(tiers) {
  const out = {};
  const b = tiers.beginner.case;
  const fvf = { ...LEDGER_FVF, ...b.fvf };
  const led = ledgerWith({ band: b.band, fvf });
  out.beginner = {
    field_cum_vrr: led.summary.cumulativeVRR,
    produced_voidage_rb: led.summary.totalProducedVoidage,
    injected_voidage_rb: led.summary.totalInjectedVoidage,
    fillup_month_index: led.fillUp.index,
    months_under_target_band: led.monthsUnder,
    month_produced_voidage_rb: periodVoidage(b.month, fvf).producedVoidage,
  };
  const i = tiers.intermediate.case;
  const sw = surveillanceWith({ throughDate: i.hall_through, aboveReference: true, chanSmooth: i.chan_smooth });
  out.intermediate = {
    out_of_zone_bbl: allocationAudit(i.allocation).unallocated.winj_stb,
    north_cum_vrr: patternLedger('North', { allocation: i.allocation }).cumulativeVRR,
    south_cum_vrr: patternLedger('South', { allocation: i.allocation }).cumulativeVRR,
    south_recommended_wi: patternAdvice('South', { targetVRR: i.target_vrr, windowPeriods: i.window, allocation: i.allocation }).recommendedWi,
    hall_ratio_e4: sw.hall.find((h) => h.injector === 'Ekene-4').slope_ratio,
    chan_slope_case: sw.chan.producers.find((c) => c.producer === i.chan_producer).lateSlope,
  };
  const a = tiers.advanced.case;
  const sweep = layerSweep({ M: a.M, perms: a.perms });
  const f = forecast({ iw: a.iw_rb_d, EV: evAtFirstBreakthrough(a.M, a.perms), muO: a.muO_cp });
  out.advanced = {
    dykstra_parsons_v: permeabilityVariation(a.perms).V,
    dp_coverage_first_bt: sweep.dykstraParsons[0].coverage,
    stiles_wc_first_bt: sweep.stiles[0].waterCut,
    eabt_at_case_mu: f.summary.EAbt,
    case_breakthrough_days: f.summary.breakthrough_days,
    implied_swept_fraction: channelBackoutFor({ producer: a.bt_producer, btDate: a.bt_date, muO: a.muO_cp }).fractionOfElement,
  };
  return out;
}
