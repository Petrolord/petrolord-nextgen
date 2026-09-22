// W5a RE-CASE, earthmodel: the capstone's own case and its graded keys.
//
// The golden three-surface model is the teaching case. The panels open on it
// and the lessons work it, so since W5a no capstone grades it. Each tier's
// capstone is the ORUMA case below: a model frame of its own over the same
// three source surfaces (beginner), a well of its own tied to the golden
// framework (intermediate), and a fault polygon, variogram, probe point and
// profile row of their own (advanced). Every input is stated in the brief and
// typed into the tier's panel. The keys are whatever the vendored engine
// returns for it through the same teaching functions the panels call:
//
//   npx vite-node -c vitest.config.js tools/course-waves/w5/earthmodel/fields.mjs --write
//
// src/components/course/panels/earthmodel/panelCapstoneGuard.test.jsx
// recomputes them in CI and fails if fields.json drifts from the engine.
// No panel, lesson or learning page may import this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  computeFramework, computeTieDetail, typedWell, computePopulation,
} from '@/lib/earthmodelTeaching';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** Beginner: the golden source surfaces on the ORUMA frame. */
export const BEGINNER = { spec: { x0: 1020, y0: 2040, dx: 45, dy: 45, nx: 28, ny: 22 } };

/** Intermediate: the ORUMA-1 well, tied to the golden framework. */
export const INTERMEDIATE = {
  well: { x: 1750, y: 2550, kb: 28, kopMd: 1300, eobMd: 1500, tdMd: 1900, inc: 30, azi: 240, topA: 1585, topB: 1630, baseB: 1650 },
};

/** Advanced: the ORUMA fault polygon, variogram, probe point and profile row. */
export const ADVANCED = {
  polygon: [[975, 1975], [2225, 1975], [2225, 2180], [1325, 2180], [1325, 2975], [975, 2975]],
  nugget: 0.0005,
  range: 700,
  probe: { x: 1700, y: 2400 },
  rowY: 2300,
};

/** Every graded field, in capstone order, from the engine. */
export function capstoneFields() {
  const b = computeFramework(BEGINNER.spec);
  const t = computeTieDetail(typedWell({ ...INTERMEDIATE.well, name: 'ORUMA-1' }));
  const at = (top) => t.rows.find((r) => r.top === top);
  const a = computePopulation('krige', ADVANCED.nugget, ADVANCED.range, ADVANCED.polygon, ADVANCED.rowY);
  const f = (tier, key, label, unit, expected, tol) => ({ tier, key, label, unit, expected, tol });
  return [
    f('beginner', 'oruma_s2_mean', 'Mean TopB depth on the ORUMA frame', 'm', b.s2Stats.mean, 0.005),
    f('beginner', 'oruma_clamp_s3', 'BaseB nodes fixed by the clamp', 'count', b.clampCounts[2], 0),
    f('beginner', 'oruma_tka_mean', 'Zone A mean thickness', 'm', b.tkA.mean, 0.005),
    f('beginner', 'oruma_tka_max', 'Zone A maximum thickness', 'm', b.tkA.max, 0.001),
    f('beginner', 'oruma_tkb_mean', 'Zone B mean thickness over the frame', 'm', b.tkB.mean, 0.005),
    f('beginner', 'oruma_bulk_a_mm3', 'Zone A bulk rock volume', '10^6 m3', b.bulkA / 1e6, 0.001),
    f('intermediate', 'oruma1_topa_tvdss', 'ORUMA-1 TVDSS at the TopA pick', 'm', at('TopA').tvdss, 0.01),
    f('intermediate', 'oruma1_topa_res', 'ORUMA-1 TopA tie residual', 'm', at('TopA').residualM, 0.005),
    f('intermediate', 'oruma1_topb_res', 'ORUMA-1 TopB tie residual', 'm', at('TopB').residualM, 0.005),
    f('intermediate', 'oruma1_baseb_res', 'ORUMA-1 BaseB tie residual', 'm', at('BaseB').residualM, 0.005),
    f('intermediate', 'oruma1_cpa_x', 'ORUMA-1 zone-A control point x', 'm', t.cp.x, 0.01),
    f('intermediate', 'oruma1_cpa_y', 'ORUMA-1 zone-A control point y', 'm', t.cp.y, 0.01),
    f('advanced', 'oruma_block1_cells', 'Block 1 node count', 'count', a.census['1'], 0),
    f('advanced', 'oruma_trend_probe', 'Trend porosity at (1700, 2400)', 'v/v', a.trend.at(ADVANCED.probe.x, ADVANCED.probe.y), 0.0001),
    f('advanced', 'oruma_krige_probe', 'Kriged porosity at (1700, 2400)', 'v/v', a.krigeAt(ADVANCED.probe.x, ADVANCED.probe.y), 0.00005),
    f('advanced', 'oruma_fault_jump_y2300', 'Porosity jump across the fault on the y = 2300 row', 'v/v', a.jump.value, 0.00005),
    f('advanced', 'oruma_phi_block0', 'Zone A weighted porosity, block 0', 'v/v', a.phiBlock0, 0.00002),
    f('advanced', 'oruma_bulk_a_block1', 'Zone A bulk volume in block 1', '10^6 m3', a.volsA['1'].bulk_m3 / 1e6, 0.001),
  ];
}

export const FIELDS_PATH = path.join(HERE, 'fields.json');

if (process.argv.includes('--write')) {
  fs.writeFileSync(FIELDS_PATH, `${JSON.stringify(capstoneFields(), null, 1)}\n`);
  console.log(`wrote ${FIELDS_PATH}`);
}
