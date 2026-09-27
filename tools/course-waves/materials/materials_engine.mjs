// THE ONE PLACE AN SC3 WAVE SCRIPT LOADS THE VENDORED ENGINE.
// Registers materials_loader.mjs (the named variants; inventory.js and its
// three imports are plain JavaScript) and imports
// engines/supplychain/inventory.js from SC3_ENGINES, the NextGen canonical
// packages/engines root by default, where the whole closure is vendored
// sha-identical with petrolord-engines 110f0a0. Every wave script imports
// from here, so no script can load a second copy of the engine from somewhere
// else.
//
// variant(name) loads the same source with its named substitutions
// (materials_loader.mjs VARIANTS). Only discriminate.mjs, the capstone's
// reading-invariance proof and the negative controls call it.
import { register } from 'node:module';
import process from 'node:process';

register('./materials_loader.mjs', import.meta.url);
export const ROOT = process.env.SC3_ENGINES || '/root/wt-sc3-nextgen/packages/engines';
export const ENGINE_REL = 'engines/supplychain/inventory.js';
export const I = await import(`${ROOT}/${ENGINE_REL}`);
export const PCT = await import(`${ROOT}/lib/conventions/percentile.js`);
export const STATS = await import(`${ROOT}/lib/stats/stats.js`);
const cache = new Map();
export const variant = async (name) => {
  if (!cache.has(name)) cache.set(name, await import(`${ROOT}/${ENGINE_REL}?variant=${encodeURIComponent(name)}`));
  return cache.get(name);
};
export { VARIANTS } from './materials_loader.mjs';
