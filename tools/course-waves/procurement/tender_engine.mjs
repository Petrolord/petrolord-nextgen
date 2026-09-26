// THE ONE PLACE AN SC2 WAVE SCRIPT LOADS THE VENDORED ENGINE.
// Registers ts_loader.mjs (tender.js imports engines/economics/cashflow.ts for
// the canonical npv) and imports engines/supplychain/tender.js from
// SC2_ENGINES, the NextGen packages/engines by default, with lib/stats and
// lib/conventions/percentile.js from the same tree. Every wave script imports
// from here, so no script can load a second copy of the engine from somewhere
// else.
import { register } from 'node:module';
import process from 'node:process';

register('./ts_loader.mjs', import.meta.url);
export const ROOT = process.env.SC2_ENGINES || '/root/wt-sc2-nextgen/packages/engines';
export const ENGINE_REL = 'engines/supplychain/tender.js';
export const T = await import(`${ROOT}/${ENGINE_REL}`);
export const STATS = await import(`${ROOT}/lib/stats/stats.js`);
export const PCT = await import(`${ROOT}/lib/conventions/percentile.js`);
export const WELLCOST = await import(`${ROOT}/engines/drilling/wellCost.js`);
