// W5a RE-CASE, wellcorrelation: the capstone's own case and its graded keys.
//
// The four Ekene wells are the teaching case. The panels open on them and the
// lessons work them, so since W5a no capstone grades them. Each tier's
// capstone is the UMUDI section below (four wells, picks to 0.1 m, the last
// well stopping above TOP_B), stated in full in the brief and typed into the
// panels' "Type a section" mode, with datums of its own. The keys are
// whatever the vendored section engine returns through the same teaching
// functions the panels call:
//
//   npx vite-node -c vitest.config.js tools/course-waves/w5/wellcorrelation/fields.mjs --write
//
// src/components/course/panels/wellcorrelation/panelCapstoneGuard.test.jsx
// recomputes them in CI and fails if fields.json drifts from the engine.
// No panel, lesson or learning page may import this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  computeSection, structuralRelief, computeIntermediate, computeAdvanced, parseSectionTable,
} from '@/lib/correlationTeaching';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** name, TOP_A, TOP_SAND, BASE_SAND, TOP_B (MD, m), one per line as the panels take them. */
export const SECTION_TABLE = [
  'Umudi-1, 1487.4, 1531.8, 1566.3, 1623.4',
  'Umudi-2, 1502.6, 1553.1, 1587.9, 1650.2',
  'Umudi-3, 1479.9, 1522.4, 1552.0, 1611.6',
  'Umudi-4, 1520.3, 1579.7, 1606.2, -',
].join('\n');

export const DATUMS = {
  beginner: { topName: 'TOP_SAND', datumM: 1520 },
  beginnerSecond: { topName: 'BASE_SAND', datumM: 1575 },
  intermediate: { topName: 'TOP_A', datumM: 1460 },
  intermediateSecond: { topName: 'TOP_SAND', datumM: 1495 },
};

export const umudiWells = () => parseSectionTable(SECTION_TABLE);

const displayedOf = (section, well, top) => section.rows.find((r) => r.name === well).tops.find((t) => t.name === top).displayed;

/** Every graded field, in capstone order, from the engine. */
export function capstoneFields() {
  const w = umudiWells();
  const b = computeSection({ mode: 'flatten', ...DATUMS.beginner }, w);
  const b2 = computeSection({ mode: 'flatten', ...DATUMS.beginnerSecond }, w);
  const row = (s, name) => s.rows.find((r) => r.name === name);
  const i = computeIntermediate(w, DATUMS.intermediate);
  const i2 = computeSection({ mode: 'flatten', ...DATUMS.intermediateSecond }, w);
  const a = computeAdvanced(w);
  const f = (tier, key, label, unit, expected, tol) => ({ tier, key, label, unit, expected, tol });
  return [
    f('beginner', 'umudi2_shift_m', 'Umudi-2: flattening shift', 'm', row(b, 'Umudi-2').shift, 0.005),
    f('beginner', 'umudi3_sand_thickness_m', 'Umudi-3: SAND zone thickness', 'm', row(b, 'Umudi-3').thickness, 0.005),
    f('beginner', 'umudi4_base_sand_displayed_m', 'Umudi-4: BASE_SAND displayed depth (flattened)', 'm', displayedOf(b, 'Umudi-4', 'BASE_SAND'), 0.005),
    f('beginner', 'umudi_sand_relief_m', 'TOP_SAND structural relief across the section', 'm', structuralRelief('TOP_SAND', w), 0.005),
    f('beginner', 'umudi3_top_b_displayed_base_1575_m', 'Umudi-3: TOP_B displayed depth, flattened on BASE_SAND at 1575 m', 'm', displayedOf(b2, 'Umudi-3', 'TOP_B'), 0.005),
    f('beginner', 'umudi1_top_b_displayed_m', 'Umudi-1: TOP_B displayed depth (flattened)', 'm', displayedOf(b, 'Umudi-1', 'TOP_B'), 0.005),
    f('intermediate', 'umudi4_shift_m', 'Umudi-4: flattening shift', 'm', i.rows.find((r) => r.name === 'Umudi-4').shift, 0.005),
    f('intermediate', 'umudi2_topsand_displayed_m', 'Umudi-2: TOP_SAND displayed depth', 'm', i.rows.find((r) => r.name === 'Umudi-2').sandDisplayed, 0.005),
    f('intermediate', 'umudi4_a_to_sand_m', 'Umudi-4: TOP_A to TOP_SAND interval', 'm', i.rows.find((r) => r.name === 'Umudi-4').aToSand, 0.005),
    f('intermediate', 'umudi_growth_range_m', 'A-to-SAND growth range (max minus min)', 'm', i.growthRange, 0.005),
    f('intermediate', 'umudi_shallowest_displayed_sand_1495_m', 'Shallowest displayed depth, flattened on TOP_SAND at 1495 m', 'm', i2.range[0], 0.005),
    f('intermediate', 'umudi_displayed_span_m', 'Displayed depth span of the section', 'm', i.displayedSpan, 0.005),
    f('advanced', 'umudi_a_to_b_mean', 'Mean TOP_A to TOP_B interval', 'm', a.aToBMean, 0.005),
    f('advanced', 'umudi_sand_to_b_mean', 'Mean TOP_SAND to TOP_B interval', 'm', a.sandToBMean, 0.005),
    f('advanced', 'umudi4_topb_layercake', 'Umudi-4 TOP_B, layer-cake estimate', 'm', a.w4TopBLayercake, 0.005),
    f('advanced', 'umudi4_topb_from_sand', 'Umudi-4 TOP_B, from TOP_SAND', 'm', a.w4TopBFromSand, 0.005),
    f('advanced', 'umudi_prediction_spread', 'Spread between the two estimates', 'm', a.predictionSpread, 0.005),
    f('advanced', 'umudi_topb_relief', 'TOP_B structural relief where it is drilled', 'm', a.topBRelief, 0.005),
  ];
}

export const FIELDS_PATH = path.join(HERE, 'fields.json');

if (process.argv.includes('--write')) {
  fs.writeFileSync(FIELDS_PATH, `${JSON.stringify(capstoneFields(), null, 1)}\n`);
  console.log(`wrote ${FIELDS_PATH}`);
}
