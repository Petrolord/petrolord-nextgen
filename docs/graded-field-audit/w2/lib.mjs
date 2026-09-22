// Shared helpers for the W2 spec builder (build_specs.mjs) and the W2 gate
// (src/lib/w2PublishedInputs.test.js). No graded formula lives here: every
// graded value is a return value of a vendored engine function.
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, '..', '..', '..');
export const ENGINES = path.join(REPO, 'packages', 'engines');

// A capstone fixture (the dr-wip or course-wave generator that keyed the
// capstone) imports its engines from an absolute checkout and ends by writing
// its fields file. Load only its conditions: point it at THIS repo's vendored
// engines and cut it before it runs, so nothing outside the scratchpad is
// written. Used by the builder only; the gate reads the committed spec.
export async function loadFixture(file, scratch, { cutAt = 'const V = capstoneValues();' } = {}) {
  let src = fs.readFileSync(file, 'utf8');
  const i = src.indexOf(cutAt);
  if (i < 0) throw new Error(`fixture ${file}: cut marker not found`);
  src = src.slice(0, i);
  src = src.replace(/const R = '[^']*packages\/engines';/, `const R = ${JSON.stringify(ENGINES)};`);
  if (!src.includes(JSON.stringify(ENGINES))) throw new Error(`fixture ${file}: engine path not rewritten`);
  fs.mkdirSync(scratch, { recursive: true });
  const out = path.join(scratch, path.basename(file).replace(/\.mjs$/, '.w2load.mjs'));
  fs.writeFileSync(out, src + '\nexport const __W2_SOURCE = ' + JSON.stringify(file) + ';\n');
  return import(pathToFileURL(out).href + `?t=${Date.now()}`);
}

// A number as the prompt prints it. Exact inputs print as JavaScript writes
// them (no thousands separator: the answer box rejects one, and a pasted
// input must round-trip). `dp` fixes the decimals of a computed quantity.
export const num = (x, dp = null) => {
  if (!Number.isFinite(x)) throw new Error(`not a finite number: ${x}`);
  return dp == null ? String(x) : x.toFixed(dp);
};

export const readSpec = (course) => JSON.parse(fs.readFileSync(path.join(HERE, `${course}.json`), 'utf8'));
export const specCourses = () => fs.readdirSync(HERE).filter((f) => /^[a-z]+\.json$/.test(f)).map((f) => f.slice(0, -5)).sort();
