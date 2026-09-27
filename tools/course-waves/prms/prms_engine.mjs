// THE ONE PLACE AN EC11 WAVE SCRIPT LOADS THE VENDORED ENGINE.
// Registers ts_loader.mjs (prms.js imports engines/economics/cashflow.ts for
// computeCashFlow and applyJV; lib/stats/stats.js and
// lib/conventions/percentile.js are plain JavaScript) and imports
// engines/economics/prms.js from EC11_ENGINES, the NextGen canonical
// packages/engines root by default, where the whole closure is vendored
// sha-identical with petrolord-engines bb8ef5f. Every wave script imports from
// here, so no script can load a second copy of the engine from somewhere
// else.
//
// variant(name) loads the same source with its named substitutions
// (ts_loader.mjs VARIANTS). Only discriminate.mjs, prms_capstone.mjs's
// reading-invariance proof and the negative controls call it.
import { register } from 'node:module';
import process from 'node:process';

register('./ts_loader.mjs', import.meta.url);
export const ROOT = process.env.EC11_ENGINES || '/root/wt-ec11-nextgen/packages/engines';
export const ENGINE_REL = 'engines/economics/prms.js';
export const P = await import(`${ROOT}/${ENGINE_REL}`);
export const CF = await import(`${ROOT}/engines/economics/cashflow.ts`);
export const PCT = await import(`${ROOT}/lib/conventions/percentile.js`);
const cache = new Map();
export const variant = async (name) => {
  if (!cache.has(name)) cache.set(name, await import(`${ROOT}/${ENGINE_REL}?variant=${encodeURIComponent(name)}`));
  return cache.get(name);
};
export { VARIANTS } from './ts_loader.mjs';
