// A PANEL MAY NOT REACH INTO THE CAPSTONE.
//
// gasLiftLab.js exports its whole capstone surface (CAP, capstoneValues, every
// okpara* reader, the leak guard) beside its teaching surface, in one module,
// because the grader, the lab's own tests and the migration headers all have to
// read ONE derivation of OKPARA-9. A panel imports that same module.
//
// The readers a panel author reaches for first are exactly the capstone-only
// ones, because they are the functions that do the whole job in one call:
// okparaKnifeEdge() is the knife edge, okparaInjectionPointStudy() is the
// injection point study, okparaColumnStudy() is the column refinement, and
// every one of them runs the GRADED well. A panel built on any of them would
// print graded answers to the learner sitting the assessment, and every other
// gate in this suite would stay green, because no lesson and no bank would have
// changed.
//
// So the guard is on the panel SOURCES. It is a grep, deliberately: a runtime
// check would only catch the modes somebody thought to render.
//
// The teaching equivalents exist and are what a panel must use:
//   okparaTraverse              ->  teachingTraverseRows
//   okparaCase                  ->  publishedDesign
//   okparaColumnStudy           ->  stepRefinementRows
//   okparaInjectionPointStudy   ->  injectionPointTabulationRows
//   okparaKnifeEdge             ->  knifeEdgeDecrementRows
//   okparaPortLadder            ->  knifeEdgeGasRateRows
//   okparaPpoStudy              ->  ppoDivergence
//
// gasLiftLab.test.js carries the same grep as part of the lab's own gate. This
// file exists so the guard travels with the PANELS: it is the file a panel
// author opens, it fails on its own if a panel reaches over the line, and it
// survives any future split of the lab test.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// Every export of gasLiftLab.js that is built on the OKPARA-9 capstone's own
// conditions. Anything here is for the grader, the lab's own tests and the
// migration headers, and for nothing that a learner can see.
const CAPSTONE_ONLY = [
  'CAP',
  'OKPARA_LABEL',
  'CAPSTONE_TIERS',
  'CAPSTONE_TOLERANCES',
  'CAPSTONE_FIELD_UNITS',
  'capstoneValues',
  'okparaTraverse',
  'okparaCase',
  'okparaColumnStudy',
  'okparaInjectionPointStudy',
  'okparaKnifeEdge',
  'okparaPortLadder',
  'okparaPpoStudy',
  'LEAK_GUARD_MARGIN',
  'LEAK_GUARD_SCALINGS',
  'leakGuardTargets',
  'leakGuardHit',
];

/** The teaching function a panel must use instead of each capstone reader. */
const CAPSTONE_MIRRORS = {
  okparaTraverse: 'teachingTraverseRows',
  okparaCase: 'publishedDesign',
  okparaColumnStudy: 'stepRefinementRows',
  okparaInjectionPointStudy: 'injectionPointTabulationRows',
  okparaKnifeEdge: 'knifeEdgeDecrementRows',
  okparaPortLadder: 'knifeEdgeGasRateRows',
  okparaPpoStudy: 'ppoDivergence',
};

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }));

const capstoneNamesIn = (text) => [...new Set([
  ...CAPSTONE_ONLY.filter((name) => new RegExp(`\\b${name}\\b`).test(text)),
  // the naming rule is the guard, so anything called okpara* is caught even if
  // it was added to the lab after this list was written
  ...[...text.matchAll(/\bokpara[A-Z]\w*/g)].map((m) => m[0]),
  ...[...text.matchAll(/\bleakGuard[A-Z]\w*/g)].map((m) => m[0]),
])];

describe('THE PANEL GUARD: no gas lift panel may read the capstone', () => {
  it('there are panels to check, so a rename cannot silently empty this gate', () => {
    expect(panelSources.length).toBeGreaterThanOrEqual(3);
  });

  it('every capstone-only export still exists under the name the grep looks for', async () => {
    const L = await import('./gasLiftLab.js');
    CAPSTONE_ONLY.forEach((name) => {
      expect(L[name], `${name} is missing from the lab, so the grep guards nothing`).toBeDefined();
    });
  });

  it('every capstone reader a panel would want has a TEACHING mirror that exists', async () => {
    const L = await import('./gasLiftLab.js');
    Object.entries(CAPSTONE_MIRRORS).forEach(([capstone, mirror]) => {
      expect(CAPSTONE_ONLY).toContain(capstone);
      expect(typeof L[mirror], `${mirror} must be a teaching function`).toBe('function');
    });
    // and every okpara reader on the lab is covered by one, so a new capstone
    // reader cannot be added without a mirror to point an author at
    Object.keys(L).filter((n) => n.startsWith('okpara')).forEach((n) => {
      expect(Object.keys(CAPSTONE_MIRRORS), `${n} has no teaching mirror`).toContain(n);
    });
  });

  it('THE GREP IS LIVE: it catches a source that reaches into the capstone', () => {
    const bad = "import { okparaKnifeEdge, CAP } from './gasLiftLab.js';";
    expect(capstoneNamesIn(bad).sort()).toEqual(['CAP', 'okparaKnifeEdge']);
    // and it does not fire on the teaching mirrors
    const good = "import { knifeEdgeDecrementRows, publishedDesign } from './gasLiftLab.js';";
    expect(capstoneNamesIn(good)).toEqual([]);
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone-only export`, () => {
      const hits = capstoneNamesIn(text);
      expect(hits, `${file} reaches into the capstone: ${hits.join(', ')}`).toEqual([]);
    });

    it(`${file} prints none of the eighteen graded answers`, async () => {
      const L = await import('./gasLiftLab.js');
      const graded = Object.values(L.capstoneValues())
        .filter((v) => typeof v === 'number' && Number.isFinite(v));
      // Six significant figures of a graded answer is a leak at any rounding a
      // panel would plausibly print.
      const printed = graded
        .map((v) => v.toPrecision(6).replace(/0+$/, ''))
        .filter((s) => !s.includes('e'))
        .filter((s) => text.includes(s));
      expect(printed, `${file} prints a graded capstone answer`).toEqual([]);
    });
  });

  it('the KNIFE EDGE mode is built on the PUBLISHED case and not on the graded one', () => {
    // This is the mode a panel author is most tempted to build on the capstone,
    // because the capstone IS a knife edge and its margin is smaller. The
    // published case is midDecrementKnifeEdge and the panel must name it
    // through the lab's own constant rather than reproducing its conditions.
    const src = panelSources.find((p) => p.file === 'UnloadingExplorer.jsx');
    expect(src, 'UnloadingExplorer.jsx is missing').toBeTruthy();
    expect(src.text).toMatch(/KNIFE_EDGE_ID/);
    expect(src.text).toMatch(/unloadingExplorer\.knifeedge\(/);
  });
});
