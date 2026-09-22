// W5b re-case, sim: every graded value is what the course panels show once
// the learner types the setting the brief states. Each key calls the same lab
// function the panels call (src/components/course/panels/sim/simLab.js, which
// rebuilds the deck through the central engines), with the setting read from
// sim.json. At the teaching setting simLab reproduces the committed fixture.
import {
  structureAt, correlatedOil, deviatedPath, calibrateRegionalMean, historyOilBetween,
  validationCasesAt,
} from '../../../src/components/course/panels/sim/simLab.js';

export function compute(tiers) {
  const out = {};
  const b = tiers.beginner.case;
  const sb = structureAt({ regionalMean: b.regional_mean_m, owcM: b.owc_m });
  out.beginner = {
    col_top_c_ft: sb.topAt(b.col_c[0], b.col_c[1]),
    ekene2_top_ft: ((w) => sb.topAt(w.i, w.j))(sb.wellTops.find((x) => x.well === 'Ekene-2')),
    equil_datum_ft: sb.datumFt,
    col_top_a_ft: sb.topAt(b.col_a[0], b.col_a[1]),
    col_top_b_ft: sb.topAt(b.col_b[0], b.col_b[1]),
    columns_above_owc: sb.columnsAboveOwc,
  };
  const i = tiers.intermediate.case;
  const si = structureAt({ regionalMean: i.regional_mean_m, owcM: i.owc_m });
  const oil = correlatedOil(i.fluid);
  out.intermediate = {
    deck_stoiip_stb: si.stoiipStb,
    stoiip_vs_booking_pct: si.gapPct,
    oil_cells_centre_rule: si.oilCells,
    ekene2_deck_top_m: si.wellTops.find((w) => w.well === 'Ekene-2').deck_top_m,
    correlated_bo_at_pi: oil.boAtPi,
    correlated_rs_gap_pct: oil.rsGapPct,
  };
  const a = tiers.advanced.case;
  const path = deviatedPath({ to: a.toe });
  const mean = calibrateRegionalMean(a.booking_target_stb);
  out.advanced = {
    deviated_connection_count: path.connections.length,
    deviated_distinct_columns: path.distinctColumns,
    calibration_regional_mean_m: mean,
    history_oil_stb: historyOilBetween(a.history_from, a.history_to),
    validator_error_messages: validationCasesAt({ regionalMean: mean }).reduce((s, c) => s + c.errors.length, 0),
    equil_datum_depth_ft: structureAt({ regionalMean: mean }).datumFt,
  };
  return out;
}
