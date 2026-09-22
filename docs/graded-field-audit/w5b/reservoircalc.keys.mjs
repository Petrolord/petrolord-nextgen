// W5b re-case, reservoircalc: every graded value is what the course panel
// shows once the learner types the case the brief states. Each key calls the
// same teaching function the panel calls (src/lib/reservoircalcTeaching.js,
// on the vendored engines), with the case read from reservoircalc.json.
import {
  computeVolumes, computeBlockModel, computePropertyModel,
} from '../../../src/lib/reservoircalcTeaching.js';

export function compute(tiers) {
  const out = {};
  const b = tiers.beginner.case;
  const v = computeVolumes(b.owc_m, { ntg: b.ntg, phi: b.phi, sw: b.sw, bo: b.bo }).summary;
  out.beginner = {
    oil_cells: v.oilCells,
    max_oil_column_m: v.maxOilColumn,
    grv_mm3: v.grvMm3,
    pore_mm3: v.poreMm3,
    hcpv_mm3: v.hcpvMm3,
    stoiip_mmstb: v.stoiipMmstb,
  };
  const i = tiers.intermediate.case;
  const m = computeBlockModel(i.fault_x_m, i.owc_west_m, i.owc_east_m);
  out.intermediate = {
    west_cells: m.west.cells,
    east_cells: m.east.cells,
    west_grv_mm3: m.west.grvMm3,
    east_grv_mm3: m.east.grvMm3,
    west_stoiip_mmstb: m.west.stoiipMmstb,
    east_stoiip_mmstb: m.east.stoiipMmstb,
  };
  const a = tiers.advanced.case;
  const p = computePropertyModel('trend', a.owc_m, a.well_phi);
  out.advanced = {
    phi_at_p1: p.phiAtP1,
    phi_mean_oil: p.means.nodeMeanOverOil,
    pore_trend_mm3: p.model.poreMm3,
    hcpv_trend_mm3: p.model.hcpvMm3,
    stoiip_trend_mmstb: p.model.stoiipMmstb,
    stoiip_delta_mmstb: p.deltaMmstb,
  };
  return out;
}
