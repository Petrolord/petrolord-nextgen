// A NODE 18 LOADER HOOK FOR ONE TYPESCRIPT FILE, AND WHY IT EXISTS.
//
// engines/hse/qra.js imports the canonical year-end `npv` from
// engines/economics/cashflow.ts (FINDINGS-qra.md doubt 3: restating npv is
// forbidden by the conventions). Jest and Vite compile .ts; plain node 18 does
// not, so every H5 wave script that runs the engine registers this hook first
// (through qra_engine.mjs). It strips the types with the esbuild the NextGen
// repository already installs, changes no behaviour, and touches no other
// extension.
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// esbuild comes from the NextGen repository the engine is vendored in, found
// from EC2_ENGINES (<repo>/packages/engines) so the committed mirror runs on a
// CI runner; EC2_REPO overrides it.
const ENG = process.env.EC2_ENGINES || '/root/wt-ec7-recut/packages/engines';
const REPO = process.env.EC2_REPO || path.resolve(ENG, '..', '..');
const esbuild = createRequire(`${REPO}/package.json`)('esbuild');

export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && url.endsWith('.ts')) {
    const src = fs.readFileSync(fileURLToPath(url), 'utf8');
    const out = esbuild.transformSync(src, { loader: 'ts', format: 'esm', target: 'node18' });
    return { format: 'module', source: out.code, shortCircuit: true };
  }
  return nextLoad(url, context);
}
