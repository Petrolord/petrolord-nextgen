// W5a RE-CASE (beginner) and STRIP (intermediate, advanced), seismolord.
//
// Beginner (pick A): the whole basic_20 log at 2000 m/s and 25 Hz is the
// teaching case. The capstone is the UBIMA case below: a depth window of the
// log, an overburden velocity and a wavelet of its own, stated in the brief
// and typed into the synthetic explorer. Its keys are whatever the vendored
// synthetics engine returns through the same teaching function the panel
// calls:
//
//   npx vite-node -c vitest.config.js tools/course-waves/w5/seismolord/fields.mjs --write
//
// Intermediate and advanced (pick B) keep their keys; this file pins them
// too, from the engine, so the guard can prove the stripped lessons and the
// moved panel defaults no longer print them.
//
// HD (held decision, 2026-09-22): two advanced fields did not discriminate.
// tune25_amp (tol 0.002) was wider than the tuning amplitude's whole spread
// over every panel frequency, and tune25_iso_ratio barely moves with the
// frequency, so any wedge run passed both. They are re-keyed onto readings
// at a stated thickness away from tuning (HD_ADVANCED below), taken from the
// same computeWedge the Wedge explorer prints; migration
// 20261030b_hd_seismolord.sql writes them.
//
// src/components/course/panels/seismolord/panelCapstoneGuard.test.jsx
// recomputes everything in CI and fails if fields.json drifts. No panel,
// lesson or learning page may import this file.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeSynthetic, computeIntermediate, computeWedge } from '@/lib/seismolordTeaching';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const BEGINNER = { vOverburden: 2400, topMd: 1560, baseMd: 1640, freqHz: 30 };

// HD re-key: both stated beds sit above the 25 Hz tuning thickness (16 ms),
// on the falling side of the curve, where no other panel frequency and no
// guess (the tuning amplitude, the isolated level, 1) lands within tolerance.
export const HD_ADVANCED = { freqHz: 25, ampBedMs: 24, ratioBedMs: 28 };

const rowAt = (w, ms) => {
  const r = w.rows.find((x) => x.thicknessMs === ms);
  if (!r) throw new Error(`no ${ms} ms trace in the ${w.freqHz} Hz wedge`);
  return r;
};

/** The beginner fields (re-keyed) and the intermediate and advanced fields (kept), from the engine. */
export function capstoneFields() {
  const b = computeSynthetic(BEGINNER.freqHz, BEGINNER).summary;
  const i = computeIntermediate();
  const w25 = computeWedge(25);
  const w40 = computeWedge(40);
  const hd = computeWedge(HD_ADVANCED.freqHz);
  const f = (tier, key, label, unit, expected, tol) => ({ tier, key, label, unit, expected, tol });
  return [
    f('beginner', 'ubima_mean_velocity_ms', 'Mean sonic velocity in the window', 'm/s', b.meanVelocity, 0.05),
    f('beginner', 'ubima_twt_at_window_top_ms', 'TWT at the top of the window', 'ms', b.twtLogTop, 0.05),
    f('beginner', 'ubima_imp_max', 'Maximum impedance in the window', '(m/s)·(g/cc)', b.impMax, 0.05),
    f('beginner', 'ubima_rc_peak_abs', 'Strongest reflection coefficient (abs)', '-', b.rcPeakAbs, 0.00005),
    f('beginner', 'ubima_rc_peak_twt_ms', 'TWT of the strongest reflection', 'ms', b.rcPeakTwt, 0.5),
    f('beginner', 'ubima_syn_peak_twt_ms', 'TWT of the strongest synthetic amplitude (30 Hz)', 'ms', b.synPeakTwt, 0.5),
    f('intermediate', 'bulk_shift_ms', 'Suggested bulk shift', 'ms', i.bulkShiftMs, 0.5),
    f('intermediate', 'corr_zero_lag', 'Correlation at zero lag, before any shift', '-', i.corrZeroLag, 0.0005),
    f('intermediate', 'peak15_abs', 'Strongest synthetic amplitude at 15 Hz', '-', i.peak15.abs, 0.002),
    f('intermediate', 'peak40_abs', 'Strongest synthetic amplitude at 40 Hz', '-', i.peak40.abs, 0.001),
    f('intermediate', 'peak15_twt', 'TWT of the 15 Hz peak', 'ms', i.peak15.twt, 2),
    f('intermediate', 'peak40_twt', 'TWT of the 40 Hz peak', 'ms', i.peak40.twt, 2),
    f('advanced', 'tune25_ms', 'Tuning thickness at 25 Hz', 'ms', w25.tuneMs, 0),
    f('advanced', 'amp25_at_24ms', 'Amplitude of a 24 ms bed at 25 Hz', '-', rowAt(hd, HD_ADVANCED.ampBedMs).amp, 0.0001),
    f('advanced', 'tune40_ms', 'Tuning thickness at 40 Hz', 'ms', w40.tuneMs, 0),
    f('advanced', 'amp40_at_6ms', 'Amplitude of a 6 ms bed at 40 Hz', '-', w40.amplitudes[3], 0.0005),
    f('advanced', 'ratio25_at_28ms', 'Amplitude of a 28 ms bed over the isolated level at 25 Hz', '-', rowAt(hd, HD_ADVANCED.ratioBedMs).amp / hd.isoAmp, 0.0002),
    f('advanced', 'theory25_ms', 'Theoretical tuning thickness at 25 Hz', 'ms', w25.theoryMs, 0.05),
  ];
}

export const FIELDS_PATH = path.join(HERE, 'fields.json');

if (process.argv.includes('--write')) {
  fs.writeFileSync(FIELDS_PATH, `${JSON.stringify(capstoneFields(), null, 1)}\n`);
  console.log(`wrote ${FIELDS_PATH}`);
}
