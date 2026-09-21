// THE ONE PLACE AN H5 WAVE SCRIPT LOADS THE VENDORED ENGINE.
// Registers ts_loader.mjs (qra.js imports engines/economics/cashflow.ts) and
// imports engines/hse/qra.js from H5_ENGINES, the NextGen packages/engines by
// default. Every wave script imports Q, ROOT and ENGINE_REL from here, so no
// script can load a second copy of the engine from somewhere else.
import { register } from 'node:module';
import process from 'node:process';

register('./ts_loader.mjs', import.meta.url);
export const ROOT = process.env.H5_ENGINES || '/root/wt-h5-nextgen/packages/engines';
export const ENGINE_REL = 'engines/hse/qra.js';
export const Q = await import(`${ROOT}/${ENGINE_REL}`);
