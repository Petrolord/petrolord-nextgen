// THE ONE PLACE AN EC7 WAVE SCRIPT LOADS THE VENDORED ENGINE.
// Registers ts_loader.mjs and imports engines/economics/cashflow.ts from
// EC7_ENGINES (the NextGen packages/engines by default), with
// fiscalConventions.js for the take wording. Every wave script imports from
// here, so no script can load a second copy of the engine from somewhere else.
//
// variant(name) loads the same source with one named wrong-method
// substitution (ts_loader.mjs VARIANTS). Only discriminate.mjs and the
// negative controls call it.
import { register } from 'node:module';
import process from 'node:process';

register('./ts_loader.mjs', import.meta.url);
export const ROOT = process.env.EC7_ENGINES || '/root/wt-ec7-nextgen/packages/engines';
export const ENGINE_REL = 'engines/economics/cashflow.ts';
export const E = await import(`${ROOT}/${ENGINE_REL}`);
export const CONV = await import(`${ROOT}/engines/economics/fiscalConventions.js`);
const cache = new Map();
export const variant = async (name) => {
  if (!cache.has(name)) cache.set(name, await import(`${ROOT}/${ENGINE_REL}?variant=${encodeURIComponent(name)}`));
  return cache.get(name);
};
export { VARIANTS } from './ts_loader.mjs';
