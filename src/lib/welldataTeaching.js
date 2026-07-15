// Well Data Manager teaching workflow — drives the central
// @petrolord/engines LAS parser over the six golden teaching files
// (test-data/wells/las). The engine is consumed as-is; this module only
// orchestrates it for Learning Mode. The QC numbers it surfaces are the
// lasio goldens the parser validates against, so the capstone answers a
// careful learner reads off the QC panel are exactly the oracle.
import { parseLas } from '@petrolord/engines/engines/welldata/lasParse.js';
import { depthUnitToMetres, prepareLogs, uniformStepM } from '@petrolord/engines/engines/welldata/lasImport.js';

import basicLas from '@petrolord/engines/test-data/wells/las/basic_20.las?raw';
import feetLas from '@petrolord/engines/test-data/wells/las/feet_20.las?raw';
import irregularLas from '@petrolord/engines/test-data/wells/las/irregular_20.las?raw';
import nullheavyLas from '@petrolord/engines/test-data/wells/las/nullheavy_20.las?raw';
import quirksLas from '@petrolord/engines/test-data/wells/las/quirks_20.las?raw';
import wrappedLas from '@petrolord/engines/test-data/wells/las/wrapped_12.las?raw';

export const TEACHING_FILES = [
  { id: 'basic_20', label: 'basic_20.las', text: basicLas,
    hint: 'A clean LAS 2.0 export. Start here: sections, curves, the NULL value.' },
  { id: 'feet_20', label: 'feet_20.las', text: feetLas,
    hint: 'Depth in feet. Everything downstream works in metres, so watch the unit.' },
  { id: 'irregular_20', label: 'irregular_20.las', text: irregularLas,
    hint: 'An irregular depth column: the step is not constant everywhere.' },
  { id: 'nullheavy_20', label: 'nullheavy_20.las', text: nullheavyLas,
    hint: 'Heavy null flagging, including one completely dead curve.' },
  { id: 'quirks_20', label: 'quirks_20.las', text: quirksLas,
    hint: 'Real-world header quirks: odd spacing, colons in values.' },
  { id: 'wrapped_12', label: 'wrapped_12.las', text: wrappedLas,
    hint: 'A LAS 1.2 wrapped file: each depth step spans several data lines.' },
];

// Parse one teaching file and build the QC summary the page renders.
// Means are accumulated in f64 over the finite samples, matching how the
// validation goldens were produced (sum_finite_f64 / finite count).
export function qcFile(file) {
  const parsed = parseLas(file.text);
  const curves = parsed.curves.map((c) => {
    let sum = 0;
    let finite = 0;
    for (const v of c.data) {
      if (Number.isFinite(v)) { sum += v; finite += 1; }
    }
    return {
      mnemonic: c.mnemonic,
      unit: c.unit,
      descr: c.descr,
      nSamples: c.data.length,
      nullCount: c.data.length - finite,
      firstFinite: c.firstFinite,
      lastFinite: c.lastFinite,
      mean: finite ? sum / finite : null,
    };
  });

  const dept = parsed.curves[0];
  const deptVals = Array.from(dept.data).filter(Number.isFinite);
  const stepNative = deptVals.length > 1
    ? (deptVals[deptVals.length - 1] - deptVals[0]) / (deptVals.length - 1)
    : null;
  const toM = depthUnitToMetres(dept.unit);

  return {
    version: parsed.version,
    wrap: parsed.wrap,
    nullValue: parsed.nullValue,
    well: parsed.well,
    depth: {
      unit: dept.unit,
      first: deptVals[0],
      last: deptVals[deptVals.length - 1],
      stepNative,
      stepM: stepNative != null && toM != null ? stepNative * toM : null,
      nSamples: dept.data.length,
    },
    curves,
  };
}

// Well-header rows worth showing (skip parser bookkeeping entries).
export function headerRows(well) {
  const keys = ['WELL', 'COMP', 'FLD', 'LOC', 'SRVC', 'DATE', 'STRT', 'STOP', 'STEP', 'NULL'];
  return keys
    .filter((k) => well[k] !== undefined)
    .map((k) => ({ key: k, ...well[k] }));
}

// ---- Advanced tier (NG7): the six-file import campaign. Every
// teaching file through the full pipeline, aggregated into one panel.
// Oracle-reproduced in Node before the NG7 migration was seeded.
export function computeAdvanced() {
  const perFile = [];
  let campaignCurves = 0;
  let convertedFiles = 0;
  let deadCurves = 0;
  let uniformFiles = 0;
  let wrappedSamples = 0;
  let nullheavyNulls = 0;
  for (const f of TEACHING_FILES) {
    const parsed = parseLas(f.text);
    const prep = prepareLogs(parsed, { sourceFile: f.label });
    const nCurves = prep.logs.length - 1; // logs[0] is depth
    campaignCurves += nCurves;
    const converted = prep.logs.some((l) => l.converted);
    if (converted) convertedFiles += 1;
    const toM = depthUnitToMetres(parsed.curves[0].unit) ?? 1;
    const deptM = Array.from(parsed.curves[0].data, (v) => v * toM);
    const uniform = uniformStepM(deptM) !== null;
    if (uniform) uniformFiles += 1;
    let dead = 0;
    let nulls = 0;
    for (let ci = 1; ci < parsed.curves.length; ci++) {
      let finite = 0;
      for (const v of parsed.curves[ci].data) {
        if (Number.isFinite(v)) finite += 1; else nulls += 1;
      }
      if (finite === 0) dead += 1;
    }
    deadCurves += dead;
    if (f.id === 'nullheavy_20') nullheavyNulls = nulls;
    if (f.id === 'wrapped_12') wrappedSamples = parsed.curves[0].data.length;
    perFile.push({
      id: f.id, label: f.label, curves: nCurves, converted, uniform,
      dead, nulls, samples: parsed.curves[0].data.length,
    });
  }
  return {
    perFile,
    campaignCurves,
    convertedFiles,
    deadCurves,
    uniformFiles,
    wrappedSamples,
    nullheavyNulls,
  };
}

// ---- Intermediate tier: SI import (the full prepareLogs pipeline).
// Oracle-reproduced in Node before the NG6 migration was seeded.
export function computeIntermediate() {
  const feetFile = TEACHING_FILES.find((f) => f.id === 'feet_20');
  const irrFile = TEACHING_FILES.find((f) => f.id === 'irregular_20');
  const feet = prepareLogs(parseLas(feetFile.text), { sourceFile: feetFile.label });
  const irr = parseLas(irrFile.text);
  return {
    startMdM: feet.startMdM,
    stopMdM: feet.stopMdM,
    stepM: feet.stepM,
    convertedCurves: feet.logs.filter((l) => l.converted).length,
    recognizedKinds: feet.logs.filter((l, i) => i > 0 && l.kind).length,
    irregularUniform: uniformStepM(irr.curves[0].data) === null ? 0 : 1,
    logs: feet.logs.map((l) => ({
      mnemonic: l.mnemonic, kind: l.kind, unit: l.unit,
      sourceUnit: l.sourceUnit, converted: l.converted,
    })),
  };
}
