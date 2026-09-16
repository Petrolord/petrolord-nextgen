// WHERE A COURSE SUITE READS ITS WAVE INPUTS FROM.
//
// Every lab and capstone guard under src/components/course/panels pins its
// numbers against two files a wave produced: the teaching digest the lessons
// were written from, and fields.json, the graded capstone answers. Until
// 2026-09-16 each suite read those files from an absolute path under /root,
// the directory its author happened to build the wave in.
//
// That is why the course gates had never once run in CI. A GitHub runner has
// no /root/fc-wip-rotating, so a suite that reads one either dies on a missing
// file or, worse, skips itself and reports success. The repository's CI job
// ran lint, the vendored engine suites and the build, and nothing else, so
// neither outcome was ever visible: "CI green" on a course pull request never
// meant a single course gate had run.
//
// THE IN-REPO COPY IS THE DEFAULT. Each wave's inputs are committed under
// tools/course-waves/<wave>/ and that is what a suite reads unless it is told
// otherwise. A wave author mid-build can still point a suite at the live wave
// directory, which is the only place the generators actually run:
//
//   NEXTGEN_WAVE_DIR=/root/fc-wip-rotating npx vitest run src/components/course/panels/rotating
//   NEXTGEN_WAVE_DIR_ROTATING=/root/fc-wip-rotating npx vitest run src/components/course/panels
//
// NEXTGEN_WAVE_DIR applies to whichever wave asks, which suits running one
// suite. NEXTGEN_WAVE_DIR_<WAVE> names its wave and is the one to use when
// several suites run together.
//
// ABSENCE IS A FAILURE, NEVER A SKIP. waveInput() throws, and the message
// names the file it wanted and the wave it belongs to. A suite that quietly
// passes because its inputs were not there is the defect this file exists to
// remove, so nothing here returns a sentinel a caller could test and skip on.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/** The manifest: every wave with a committed copy, and where its live directory is. */
export const WAVES = JSON.parse(fs.readFileSync(path.join(HERE, 'waves.json'), 'utf8'));

const envKey = (wave) => `NEXTGEN_WAVE_DIR_${wave.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;

function manifest(wave) {
  const entry = WAVES[wave];
  if (!entry) {
    throw new Error(
      `[course-waves] no wave named "${wave}" in ${path.join(HERE, 'waves.json')}. `
      + `Known waves: ${Object.keys(WAVES).join(', ')}.`,
    );
  }
  return entry;
}

/** The committed copy, which is always where the default read comes from. */
export function mirrorDir(wave) {
  manifest(wave);
  return path.join(HERE, wave);
}

/**
 * The directory a suite reads. The override first, the committed copy second.
 * Never a guess and never silently empty: a directory that is not there throws.
 */
export function waveDir(wave) {
  manifest(wave);
  const override = process.env[envKey(wave)] || process.env.NEXTGEN_WAVE_DIR;
  const dir = override ? path.resolve(override) : mirrorDir(wave);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    throw new Error(
      `[course-waves:${wave}] no directory at ${dir}. `
      + (override
        ? `${envKey(wave)} or NEXTGEN_WAVE_DIR points at it. Unset it to read the committed copy at ${mirrorDir(wave)}.`
        : 'The committed copy is missing from the repository, so this suite has nothing to check against.'),
    );
  }
  return dir;
}

/**
 * The LIVE wave directory if there is one to compare against, else null.
 *
 * This is for a mirror gate and for nothing else. A CI runner has no live wave
 * directory, so a gate that used this must say in its own output which of the
 * two things it did, and must still assert something true when there is none.
 */
export function liveWaveDir(wave) {
  const entry = manifest(wave);
  const override = process.env[envKey(wave)] || process.env.NEXTGEN_WAVE_DIR;
  const dir = override ? path.resolve(override) : entry.live;
  if (!dir || path.resolve(dir) === path.resolve(mirrorDir(wave))) return null;
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;
  return dir;
}

/** True when the suite is reading the committed copy rather than a live wave directory. */
export function readingMirror(wave) {
  return path.resolve(waveDir(wave)) === path.resolve(mirrorDir(wave));
}

/**
 * An input file's path, PROVEN to be there. A missing or empty file throws and
 * names itself. Empty counts as missing: a zero byte digest passes every
 * "exists" test ever written and pins nothing.
 */
export function waveInput(wave, file) {
  const dir = waveDir(wave);
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) {
    throw new Error(
      `[course-waves:${wave}] required input missing: ${file}\n`
      + `  looked in: ${dir}\n`
      + `  committed copy: ${mirrorDir(wave)}\n`
      + '  This suite pins its numbers against that file. It fails rather than skips, '
      + 'because a course gate that passes without reading its inputs has checked nothing.',
    );
  }
  if (fs.statSync(p).size === 0) {
    throw new Error(
      `[course-waves:${wave}] required input is empty: ${p}\n`
      + '  A zero byte input is a missing input that survives an existence check.',
    );
  }
  return p;
}

/** The same file, read. */
export function readWaveInput(wave, file, encoding = 'utf8') {
  return fs.readFileSync(waveInput(wave, file), encoding);
}

/** Every input the manifest says this wave must carry, proven present in one call. */
export function requireWaveInputs(wave) {
  const entry = manifest(wave);
  return Object.fromEntries((entry.inputs || []).map((f) => [f, waveInput(wave, f)]));
}
