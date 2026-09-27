// THE ONE PLACE AN EC10 WAVE SCRIPT LOADS THE VENDORED ENGINE.
// Registers ts_loader.mjs (farmout.js imports engines/economics/cashflow.ts
// for applyJV and npv, decisionTree.js for rollback, evpi and evii,
// portfolio.js for portfolioRiskMetrics, afe.js for calculatePartnerCosts and
// jointVenture.js for carryRecovery and backIn) and imports
// engines/economics/farmout.js from EC10_ENGINES, the NextGen
// canonical packages/engines root by default (the course's own engine root collapsed into it in the EC4/EC5 recut), where the whole closure is
// vendored sha-identical with petrolord-engines 6626465. Every wave script
// imports from here, so no script can load a second copy of the engine from
// somewhere else.
//
// variant(name) loads the same source with its named substitutions
// (ts_loader.mjs VARIANTS). Only discriminate.mjs, farmout_capstone.mjs's
// reading-invariance proof and the negative controls call it.
import { register } from 'node:module';
import process from 'node:process';

register('./ts_loader.mjs', import.meta.url);
export const ROOT = process.env.EC10_ENGINES || '/root/wt-ec10-nextgen/packages/engines';
export const ENGINE_REL = 'engines/economics/farmout.js';
export const F = await import(`${ROOT}/${ENGINE_REL}`);
export const JV = await import(`${ROOT}/engines/economics/jointVenture.js`);
const cache = new Map();
export const variant = async (name) => {
  if (!cache.has(name)) cache.set(name, await import(`${ROOT}/${ENGINE_REL}?variant=${encodeURIComponent(name)}`));
  return cache.get(name);
};
export { VARIANTS } from './ts_loader.mjs';
