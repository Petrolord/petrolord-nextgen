// W5a RE-CASE, mapping: the capstone's own case and its graded keys.
//
// The Ekene wells are the teaching case. The panels open on them and the
// lessons work them, so since W5a no capstone grades them. Each tier's
// capstone is the ADIM well set below (seven wells, a prospect, and for the
// advanced tier an appraisal well), stated in full in the brief and typed
// into the tier's panel ("Type a well set"). The keys are whatever the
// vendored engine returns for it through the same teaching functions the
// panels call:
//
//   npx vite-node -c vitest.config.js tools/course-waves/w5/mapping/fields.mjs --write
//
// src/components/course/panels/mapping/panelCapstoneGuard.test.jsx
// recomputes them in CI and fails if fields.json drifts from the engine.
// No panel, lesson or learning page may import this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  computeMap, computeIsochoreMap, computeValidationMap, parseWellTable, ALL_SIX, PLUS_SEVEN,
} from '@/lib/mappingTeaching';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** The ADIM wells: name, x, y, TOP_SAND MD, BASE_SAND MD (one per line, as the panel takes them). */
export const WELL_TABLE = [
  'Adim-1, 800, 900, 1612, 1641',
  'Adim-2, 2100, 1000, 1630, 1666',
  'Adim-3, 1300, 1850, 1605, 1638',
  'Adim-4, 2500, 2300, 1648, 1676',
  'Adim-5, 500, 1700, 1618, 1650',
  'Adim-6, 1700, 1600, 1603, 1640',
  'Adim-7, 1150, 1400, 1609, 1642',
].join('\n');

export const PROSPECT = { x: 1500, y: 1900 };
export const APPRAISAL = { name: 'Adim-8', x: 1900, y: 2000, actual: 1611 };
export const CELL_M = { beginner: 75, intermediate: 75, advanced: 100 };
export const LOO_WELL = 'Adim-7';

export function adimCase() {
  return {
    wells: parseWellTable(WELL_TABLE),
    target: { ...PROSPECT, label: 'the prospect' },
    e7: { ...APPRAISAL },
  };
}

/** Every graded field, in capstone order, from the engine. */
export function capstoneFields() {
  const k = adimCase();
  const b = computeMap(CELL_M.beginner, k).summary;
  const i = computeIsochoreMap(CELL_M.intermediate, 'ISOCHORE', k).summary;
  const all = computeValidationMap(ALL_SIX, k, CELL_M.advanced).summary;
  const loo = computeValidationMap(`drop:${LOO_WELL}`, k, CELL_M.advanced).summary;
  const blind = computeValidationMap(PLUS_SEVEN, k, CELL_M.advanced).summary;
  const f = (tier, key, label, unit, expected, tol) => ({ tier, key, label, unit, expected, tol });
  return [
    f('beginner', 'adim_grid_nx', 'Grid width', 'nodes', b.nx, 0),
    f('beginner', 'adim_grid_ny', 'Grid height', 'nodes', b.ny, 0),
    f('beginner', 'adim_live_nodes', 'Mapped (live) grid nodes', 'count', b.liveNodes, 0),
    f('beginner', 'adim_crest_depth_m', 'Crest (shallowest) depth', 'm', b.zMin, 0.005),
    f('beginner', 'adim_depth_at_prospect_m', 'Depth at the prospect', 'm', b.depthAtTarget, 0.005),
    f('beginner', 'adim_mean_depth_m', 'Mean mapped depth', 'm', b.zMean, 0.005),
    f('intermediate', 'adim_iso_min_m', 'Isochore minimum thickness', 'm', i.min, 0.005),
    f('intermediate', 'adim_iso_max_m', 'Isochore maximum thickness', 'm', i.max, 0.005),
    f('intermediate', 'adim_iso_mean_m', 'Isochore mean thickness', 'm', i.mapMean, 0.005),
    f('intermediate', 'adim_iso_at_prospect_m', 'Thickness at the prospect', 'm', i.atTarget, 0.005),
    f('intermediate', 'adim_iso_nodes_above_well_mean', 'Live isochore nodes above the well mean', 'count', i.nodesAboveWellMean, 0),
    f('intermediate', 'adim_mean_well_thickness_m', 'Mean of the seven well thicknesses', 'm', i.wellMean, 0.005),
    f('advanced', 'adim_cross_validatable_wells', 'Wells that can be cross-validated', 'count', all.crossValidatable, 0),
    f('advanced', 'adim_loo_resid_adim7', 'Leave-one-out residual at Adim-7', 'm', loo.resid, 0.005),
    f('advanced', 'adim_pred_at_adim8', 'Seven-well grid prediction at Adim-8', 'm', blind.pred, 0.005),
    f('advanced', 'adim_blind_residual_adim8', 'Blind-test residual at Adim-8', 'm', blind.resid, 0.005),
    f('advanced', 'adim_crest_with_adim8', 'Crest depth with Adim-8 included', 'm', blind.crest, 0.005),
    f('advanced', 'adim_depth_at_prospect_with_adim8_m', 'Depth at the prospect with Adim-8 included', 'm', blind.atTarget, 0.005),
  ];
}

export const FIELDS_PATH = path.join(HERE, 'fields.json');

if (process.argv.includes('--write')) {
  fs.writeFileSync(FIELDS_PATH, `${JSON.stringify(capstoneFields(), null, 1)}\n`);
  console.log(`wrote ${FIELDS_PATH}`);
}
