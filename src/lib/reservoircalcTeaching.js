// ReservoirCalc teaching workflow — contact-based volumetrics over the
// Ekene teaching field. Both structural surfaces (TOP_SAND, BASE_SAND —
// the same tops the correlation course picks and the mapping course
// grids) are gridded with the central engines, the oil column is
// clipped against the OWC, and the central zoneVolumes engine sums
// GRV → net → pore → HCPV; STOIIP follows with the given Bo. The
// oracle was reproduced by running exactly this pipeline in Node
// before the migration was seeded.
import { topsToPoints, specForPoints } from '@petrolord/engines/engines/mapping/surface.js';
import { gridSurface } from '@petrolord/engines/lib/gridding/gridding.js';
import { isNull } from '@petrolord/engines/lib/gridding/gridmath.js';
import { zoneVolumes } from '@petrolord/engines/engines/earthmodeling/volumes.js';

// The Ekene wells with both SAND surfaces. W1–W4 base picks match the
// correlation course fixture exactly (thickness 32/36/29/25 m).
export const TEACHING_WELLS = [
  { name: 'Ekene-1', surface_x: 1000, surface_y: 1000, tops: [{ name: 'TOP_SAND', md_m: 1548 }, { name: 'BASE_SAND', md_m: 1580 }] },
  { name: 'Ekene-2', surface_x: 2200, surface_y: 1150, tops: [{ name: 'TOP_SAND', md_m: 1565 }, { name: 'BASE_SAND', md_m: 1601 }] },
  { name: 'Ekene-3', surface_x: 1400, surface_y: 2300, tops: [{ name: 'TOP_SAND', md_m: 1541 }, { name: 'BASE_SAND', md_m: 1570 }] },
  { name: 'Ekene-4', surface_x: 2600, surface_y: 2500, tops: [{ name: 'TOP_SAND', md_m: 1590 }, { name: 'BASE_SAND', md_m: 1615 }] },
  { name: 'Ekene-5', surface_x: 600,  surface_y: 1900, tops: [{ name: 'TOP_SAND', md_m: 1552 }, { name: 'BASE_SAND', md_m: 1583 }] },
  { name: 'Ekene-6', surface_x: 1900, surface_y: 1800, tops: [{ name: 'TOP_SAND', md_m: 1546 }, { name: 'BASE_SAND', md_m: 1580 }] },
];

export const CELL_M = 100;
export const MAX_EXTRAP_M = 800;
export const CAPSTONE_OWC_M = 1560;      // the capstone's contact
export const OWC_OPTIONS = [1550, 1560, 1570];
// Given reservoir properties (Beginner tier: constants, as a lab would
// hand them out; per-node property grids arrive at higher tiers).
export const PROPS = { ntg: 0.8, phi: 0.20, sw: 0.35, bo: 1.2 };
export const M3_TO_STB = 6.2898;

// Grid both surfaces once — they do not depend on the OWC.
function buildSurfaces() {
  const topPts = topsToPoints(TEACHING_WELLS, 'TOP_SAND');
  const spec = specForPoints(topPts, CELL_M, 2);
  const top = gridSurface(topPts, spec, { maxExtrapolation: MAX_EXTRAP_M }).z;
  const base = gridSurface(
    topsToPoints(TEACHING_WELLS, 'BASE_SAND'), spec, { maxExtrapolation: MAX_EXTRAP_M },
  ).z;
  return { spec, top, base, topPts };
}
const SURFACES = buildSurfaces();

// Volumetrics above a given contact.
export function computeVolumes(owcM) {
  const { spec, top, base, topPts } = SURFACES;
  const owc = Number(owcM);
  const n = top.length;
  const thick = new Float32Array(n).fill(1e30);
  let maxCol = 0;
  let oilNodes = [];
  for (let j = 0; j < n; j++) {
    if (isNull(top[j]) || isNull(base[j])) continue;
    const t = Math.min(base[j], owc) - top[j];
    if (t <= 0) continue;
    thick[j] = t;
    if (t > maxCol) maxCol = t;
    oilNodes.push({ j, t });
  }
  const mk = (v) => new Float32Array(n).fill(v);
  const vols = zoneVolumes(spec, thick, null, {
    ntg: mk(PROPS.ntg), phi: mk(PROPS.phi), sw: mk(PROPS.sw),
  });
  const tot = vols.total || { bulk_m3: 0, net_m3: 0, pore_m3: 0, hcpv_m3: 0, cells: 0 };
  const stoiipStb = (tot.hcpv_m3 / PROPS.bo) * M3_TO_STB;
  return {
    spec,
    topPts,
    oilNodes,
    maxCol,
    summary: {
      oilCells: tot.cells,
      maxOilColumn: maxCol,
      grvMm3: tot.bulk_m3 / 1e6,
      netMm3: tot.net_m3 / 1e6,
      poreMm3: tot.pore_m3 / 1e6,
      hcpvMm3: tot.hcpv_m3 / 1e6,
      stoiipMmstb: stoiipStb / 1e6,
    },
  };
}
