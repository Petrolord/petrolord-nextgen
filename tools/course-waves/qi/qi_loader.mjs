// A NODE LOADER HOOK FOR THE QI WAVE SCRIPTS.
//
// The QI teaching lab (src/components/course/panels/qi/qiLab.js in the NextGen
// repository) imports the vendored engines as '@petrolord/engines/...', the
// alias vitest and Vite resolve, and several engine files import their
// neighbours without a file extension ('./avo'), which Vite resolves and plain
// Node does not. This hook does both, so a wave script imports THE SAME LAB
// FILE the panels run and never a copy:
//   '@petrolord/engines/<p>'  ->  $QI_ENGINES/<p>   (default: the NextGen worktree's packages/engines)
//   '@suite/<p>'              ->  $QI_SUITE_SRC/<p> (the Suite's src, for the one Suite file the
//                                 digest runs: QI Studio's usability matrix), and inside that tree
//                                 '@/<p>' resolves to the same src
//   a relative specifier with no extension -> the same path with '.js'
// Nothing else is rewritten.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ENGINES = process.env.QI_ENGINES || '/root/wt-qi-nextgen/packages/engines';
const SUITE_SRC = process.env.QI_SUITE_SRC || '/root/wt-qi-suitekit/src';

const withExt = (p) => {
  if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  for (const e of ['.js', '.mjs', '.jsx', '/index.js']) if (fs.existsSync(p + e)) return p + e;
  return p;
};

export async function resolve(specifier, context, next) {
  if (specifier.startsWith('@petrolord/engines/')) {
    return { url: pathToFileURL(withExt(path.join(ENGINES, specifier.slice('@petrolord/engines/'.length)))).href, shortCircuit: true };
  }
  if (specifier.startsWith('@suite/')) {
    return { url: pathToFileURL(withExt(path.join(SUITE_SRC, specifier.slice('@suite/'.length)))).href, shortCircuit: true };
  }
  if (specifier.startsWith('@/') && context.parentURL && fileURLToPath(context.parentURL).startsWith(SUITE_SRC)) {
    return { url: pathToFileURL(withExt(path.join(SUITE_SRC, specifier.slice(2)))).href, shortCircuit: true };
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:')) {
    const base = path.dirname(fileURLToPath(context.parentURL));
    const p = path.resolve(base, specifier.split('?')[0]);
    if (!path.extname(p) || !fs.existsSync(p)) {
      const q = withExt(p);
      if (q !== p) return { url: pathToFileURL(q).href + (specifier.includes('?') ? `?${specifier.split('?')[1]}` : ''), shortCircuit: true };
    }
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (url.endsWith('.json')) {
    const src = fs.readFileSync(fileURLToPath(url), 'utf8');
    return { format: 'module', source: `export default ${src};`, shortCircuit: true };
  }
  return next(url, context);
}
