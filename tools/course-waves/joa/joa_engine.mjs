// THE ONE PLACE AN EC9 WAVE SCRIPT LOADS THE VENDORED ENGINE.
// Registers ts_loader.mjs (jointVenture.js imports engines/economics/cashflow.ts
// for applyPSC and npv, and engines/economics/afe.js for calculatePartnerCosts)
// and imports engines/economics/jointVenture.js from EC9_ENGINES, the NextGen
// packages/engines by default, with cashflow.ts from the same tree. Every wave
// script imports from here, so no script can load a second copy of the engine
// from somewhere else.
//
// variant(name) loads the same source with its named substitutions
// (ts_loader.mjs VARIANTS). Only discriminate.mjs, joa_capstone.mjs's
// reading-invariance proof and the negative controls call it.
import { register } from 'node:module';
import process from 'node:process';

register('./ts_loader.mjs', import.meta.url);
export const ROOT = process.env.EC9_ENGINES || '/root/wt-ec9-nextgen/packages/engines';
export const ENGINE_REL = 'engines/economics/jointVenture.js';
export const J = await import(`${ROOT}/${ENGINE_REL}`);
export const CF = await import(`${ROOT}/engines/economics/cashflow.ts`);
const cache = new Map();
export const variant = async (name) => {
  if (!cache.has(name)) cache.set(name, await import(`${ROOT}/${ENGINE_REL}?variant=${encodeURIComponent(name)}`));
  return cache.get(name);
};
export { VARIANTS } from './ts_loader.mjs';
