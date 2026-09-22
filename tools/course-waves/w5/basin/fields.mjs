// W5a RE-CASE, basin: the capstone's own case and its graded keys.
//
// The golden basin fixtures are the teaching case. The panels open on them
// and the lessons work them, so since W5a no capstone grades them. Each
// tier's capstone is the NKPOR case below, stated in full in the brief and
// typed into the tier's panel: a lithology with its depths and a heat column
// of its own (beginner), two heating rates, read temperatures and an
// isothermal clock for all three kerogens (intermediate), and an erosion
// event of its own on the reference basin (advanced). The keys are whatever the vendored basin
// engines return for it through the same teaching functions the panels
// call:
//
//   npx vite-node -c vitest.config.js tools/course-waves/w5/basin/fields.mjs --write
//
// src/components/course/panels/basin/panelCapstoneGuard.test.jsx recomputes
// them in CI and fails if fields.json drifts from the engine. No panel,
// lesson or learning page may import this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  compactionReadings, heatColumn, twoLayerHeat, easyRoRamp, isothermalTr, computeErosionScenario,
} from '@/lib/basinTeaching';
import { KerogenKinetics } from '@petrolord/engines/engines/basin/KerogenLibrary.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const BEGINNER = {
  lithology: 'sandstone',
  depthM: 2600,
  burialM: 1700,
  heat: { surfaceC: 12, basalMwM2: 65, kUpper: 2.0, kLower: 3.2 },
};
export const INTERMEDIATE = {
  rateA: 2, rateB: 5, readA: 145, readB: 165,
  isoC: 135, isoMa: 100,
};
export const ADVANCED = { erosionM: 760, erosionAgeMa: 20 };

const roAt = (rate, tC) => easyRoRamp(rate).find((e) => e.t_c === tC).ro;

/** Every graded field, in capstone order, from the engine. */
export async function capstoneFields() {
  const b = compactionReadings(BEGINNER.lithology, BEGINNER.depthM, BEGINNER.burialM);
  const h = heatColumn(twoLayerHeat(BEGINNER.heat));
  const i = INTERMEDIATE;
  const a = await computeErosionScenario(ADVANCED.erosionM, ADVANCED.erosionAgeMa);
  const peak = Math.max(...a.temperature.map((e) => e.value));
  const f = (tier, key, label, unit, expected, tol) => ({ tier, key, label, unit, expected, tol });
  return [
    f('beginner', 'nkpor_solid_sst_1700', 'Solid thickness in 100 m of sandstone at 1700 m', 'm', b.solidAtB, 0.005),
    f('beginner', 'nkpor_restored_sst_1700', '100 m sandstone from 1700 m, restored to surface', 'm', b.restored, 0.005),
    f('beginner', 'nkpor_phi_sst_2600', 'Sandstone porosity at 2600 m', 'v/v', b.phi, 0.0001),
    f('beginner', 'nkpor_t_first', 'Temperature at the first cell (50 m)', 'degC', h.tFirstNode, 0.005),
    f('beginner', 'nkpor_t_lowk_base', 'Temperature at the low-k base (950 m)', 'degC', h.tLayer1Bottom, 0.005),
    f('beginner', 'nkpor_t_deepest', 'Temperature at the deepest cell (1950 m)', 'degC', h.tDeepest, 0.005),
    f('intermediate', 'nkpor_ro_145_r2', 'Ro at 145 C on the 2 C/Ma ramp', '%Ro', roAt(i.rateA, i.readA), 0.0005),
    f('intermediate', 'nkpor_ro_165_r2', 'Ro at 165 C on the 2 C/Ma ramp', '%Ro', roAt(i.rateA, i.readB), 0.0005),
    f('intermediate', 'nkpor_ro_165_r5', 'Ro at 165 C on the 5 C/Ma ramp', '%Ro', roAt(i.rateB, i.readB), 0.0005),
    f('intermediate', 'nkpor_tr1_135_100', 'Type I TR after 100 Ma at 135 C', 'frac', isothermalTr(i.isoC, i.isoMa, KerogenKinetics.type1.potentials), 0.0001),
    f('intermediate', 'nkpor_tr2_135_100', 'Type II TR after 100 Ma at 135 C', 'frac', isothermalTr(i.isoC, i.isoMa, KerogenKinetics.type2.potentials), 0.0001),
    f('intermediate', 'nkpor_tr3_135_100', 'Type III TR after 100 Ma at 135 C', 'frac', isothermalTr(i.isoC, i.isoMa, KerogenKinetics.type3.potentials), 0.0001),
    f('advanced', 'nkpor_final_ro', 'Source rock final Ro', '%Ro', a.finalRo, 0.0005),
    f('advanced', 'nkpor_peak_temp', 'Source rock peak temperature', 'degC', peak, 0.01),
    f('advanced', 'nkpor_final_tr', 'Final transformation ratio', 'frac', a.finalTr, 0.0005),
    f('advanced', 'nkpor_generated', 'Generated mass at present day', 'kg/m2', a.generated, 0.5),
    f('advanced', 'nkpor_expelled', 'Expelled mass at present day', 'kg/m2', a.expelled, 0.5),
    f('advanced', 'nkpor_ro_delta', 'Erosion signature (delta Ro vs no-erosion run)', '%Ro', a.roDelta, 0.0005),
  ];
}

export const FIELDS_PATH = path.join(HERE, 'fields.json');

if (process.argv.includes('--write')) {
  fs.writeFileSync(FIELDS_PATH, `${JSON.stringify(await capstoneFields(), null, 1)}\n`);
  console.log(`wrote ${FIELDS_PATH}`);
}
