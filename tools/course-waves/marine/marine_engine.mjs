// THE ONE PLACE AN SC4 WAVE SCRIPT LOADS THE VENDORED ENGINE.
// Imports engines/supplychain/marineLogistics.js from SC4_ENGINES, the NextGen
// canonical packages/engines root by default, where the whole closure is
// vendored sha-identical with petrolord-engines 110f0a0 (the engine imports
// only lib/stats/stats.js and lib/conventions/percentile.js, both plain
// JavaScript). Every wave script imports from here, so no script can load a
// second copy of the engine from somewhere else.
//
// variant(name) loads the same source with its named substitutions
// (variant_loader.mjs VARIANTS). Only discriminate.mjs, marine_capstone.mjs's
// reading-invariance proof and the negative controls call it.
import { register } from 'node:module';
import process from 'node:process';

register('./variant_loader.mjs', import.meta.url);
export const ROOT = process.env.SC4_ENGINES || '/root/wt-sc4-nextgen/packages/engines';
export const ENGINE_REL = 'engines/supplychain/marineLogistics.js';
export const M = await import(`${ROOT}/${ENGINE_REL}`);
export const PCT = await import(`${ROOT}/lib/conventions/percentile.js`);
const cache = new Map();
export const variant = async (name) => {
  if (!cache.has(name)) cache.set(name, await import(`${ROOT}/${ENGINE_REL}?variant=${encodeURIComponent(name)}`));
  return cache.get(name);
};
export { VARIANTS } from './variant_loader.mjs';
