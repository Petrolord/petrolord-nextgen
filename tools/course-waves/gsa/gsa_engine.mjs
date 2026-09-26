// THE ONE PLACE AN EC8 WAVE SCRIPT LOADS THE VENDORED ENGINE.
// Registers ts_loader.mjs (gasContract.js imports engines/economics/cashflow.ts
// for npv, deriveGasRoyaltyRate and calendarDays) and imports
// engines/economics/gasContract.js from EC8_ENGINES, the NextGen
// packages/engines by default, with cashflow.ts from the same tree. Every wave
// script imports from here, so no script can load a second copy of the engine
// from somewhere else.
//
// variant(name) loads the same source with one named substitution
// (ts_loader.mjs VARIANTS). Only discriminate.mjs, gsa_capstone.mjs's
// reading-invariance proof and the negative controls call it.
import { register } from 'node:module';
import process from 'node:process';

register('./ts_loader.mjs', import.meta.url);
export const ROOT = process.env.EC8_ENGINES || '/root/wt-ec8-nextgen/packages/engines';
export const ENGINE_REL = 'engines/economics/gasContract.js';
export const G = await import(`${ROOT}/${ENGINE_REL}`);
export const CF = await import(`${ROOT}/engines/economics/cashflow.ts`);
const cache = new Map();
export const variant = async (name) => {
  if (!cache.has(name)) cache.set(name, await import(`${ROOT}/${ENGINE_REL}?variant=${encodeURIComponent(name)}`));
  return cache.get(name);
};
export { VARIANTS } from './ts_loader.mjs';
