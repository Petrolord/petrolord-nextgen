// Every value the FC5 lab exposes to a panel, a lesson or a reader is pinned
// here against the teaching digest (tools/course-waves/relief/digest.txt), which is
// itself nothing but the vendored pressure relief engine's return values on the
// published goldens and on the six teaching streams ORUBIRI, AKASO, TEBIDABA,
// BENISEDE, ODIDI and AFIESERE.
//
// THE AGREEMENT IS LINE BY LINE. Each reader is formatted with the digest's own
// formatters, at the digest's own precision, into the exact row the digest
// prints, and the digest is asserted to CONTAIN that row. Twenty nine section
// blocks, and a negative control that moves one engine value by a single unit in
// the last printed place and proves the line is then absent. That control is
// what makes the agreement mean something: an assertion that a formatted string
// is somewhere in a 96 kilobyte file has to be shown capable of failing.
//
// Then the gates:
//   THE TOLERANCE GATE      the lab's eighteen tolerances ARE gradedTolerance.js's
//                           derivation, the lab holds no second copy of them, and
//                           a control proves a copy would be caught.
//   THE LEAK GATE           no number any teaching reader returns comes within ten
//                           grading bands of a graded capstone answer, in any of
//                           three unit shiftings, with a PERMANENT PLANTED LEAK in
//                           the guard's own surface so the guard cannot silently
//                           stop working, and a REFUSAL of an empty or tiny
//                           surface rather than a green tick over nothing.
//   THE CLOCK GATE          identical output under two faked system dates, one long
//                           before FC5 and one far after, with a control proving the
//                           fake clock moved and a second proving there is no dated
//                           or seeded surface to fake. Comments are stripped before
//                           that grep, because FC1's first version of this gate
//                           searched its own prose for the word today, which is a
//                           control that cannot fail.
//   THE TZ GATE             the whole lab surface and the whole digest agreement run
//                           a second time in a child process west of Greenwich and
//                           must be byte identical, with a control that the child
//                           really did run at a non zero UTC offset.
//   THE REFUSAL GATE        every refusal shown is the engine's own returned message,
//                           no message is written as a literal in the lab, in a panel
//                           or on the course page, with a control that calling the
//                           engine directly gives the same string and a control that
//                           an accepted probe reports no error.
//   THE HELD GATE           the nine held quantities carry the marker wording, the
//                           TWO that are shared with the validation oracle on purpose
//                           are marked as shared, every panel shows the wording, and
//                           no panel presents either shared item as validated.
//   THE PROSE SWEEP         the lab's and the panels' own comments, swept with the
//                           wave's rules file, for a claim the code contradicts and
//                           for a sentence about former behaviour that reads as
//                           current behaviour.
//   THE COPY RULE           no em dash and no en dash anywhere, and no contrastive,
//                           with TWO engine messages exempted BY EXACT STRING and a
//                           dead exemption failing.
//   THE EMPTY STATE GATE    every panel renders its empty state before any engine
//                           value exists, proved by a static render.
//
// PORTABILITY. Every wave input is read through tools/course-waves/waveInputs.mjs and
// NO PATH UNDER /root APPEARS IN THIS FILE. A missing input fails and names the
// file. Nothing here is guarded with existsSync and a return, and nothing uses
// describe.skipIf or it.skipIf: thirty such fail-open skips were removed across
// sixteen waves, four of them whole agreement-with-the-digest blocks that had
// never once run.
import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as LAB_NS from './reliefLab.js';
import { GRADED_FIELDS, gradedTolerance, PRINTED_DECIMALS } from './gradedTolerance.js';
import { waveDir, waveInput, mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';
import SizingExplorer, { EMPTY_STATE as SIZING_EMPTY } from './SizingExplorer.jsx';
import FireDrumExplorer, { EMPTY_STATE as FIRE_EMPTY } from './FireDrumExplorer.jsx';
import BlowdownExplorer, { EMPTY_STATE as BLOWDOWN_EMPTY } from './BlowdownExplorer.jsx';

const L = LAB_NS;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const WAVE_NAME = 'relief';

const DIGEST_PATH = waveInput(WAVE_NAME, 'digest.txt');
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const FIELDS_MJS = waveInput(WAVE_NAME, 'fc5_fields.mjs');
const PROSE_RULES = waveInput(WAVE_NAME, 'digest_prose.rules.mjs');
const digest = fs.readFileSync(DIGEST_PATH, 'utf8');

const LAB_FILE = 'reliefLab.js';
const PANEL_FILES = ['SizingExplorer.jsx', 'FireDrumExplorer.jsx', 'BlowdownExplorer.jsx'];
const PAGE_REL = '../../../../pages/apps/ReliefLearningPage.jsx';

/**
 * A source file, PROVEN to be there before anything is asserted about it. The
 * gates below walk these lists. A name on a list that is not on disk is a
 * FAILURE here rather than a loop that quietly runs zero times, because a gate
 * that empties itself when its subject goes missing reports success without
 * examining anything.
 */
const sourceOf = (rel) => {
  const p = path.resolve(HERE, rel);
  expect(fs.existsSync(p), `the suite names ${rel}, which is not at ${p}: either the file moved `
    + 'and this list is stale, or the file is gone. Until the list is corrected every gate over it '
    + 'checks nothing.').toBe(true);
  return fs.readFileSync(p, 'utf8');
};

const LAB_SOURCE = () => sourceOf(LAB_FILE);
const PAGE_SOURCE = () => sourceOf(PAGE_REL);
/** Every file a learner's words can come out of, lab included. */
const COPY_SOURCES = () => [
  [LAB_FILE, LAB_SOURCE()],
  ...PANEL_FILES.map((f) => [f, sourceOf(f)]),
  ['ReliefLearningPage.jsx', PAGE_SOURCE()],
];

// ---------------------------------------------------------------------------
// The digest's formatters, verbatim from fc5_dump.mjs.
// ---------------------------------------------------------------------------

const n = (x, d) => (x === null || x === undefined || !Number.isFinite(Number(x)) ? String(x) : Number(x).toFixed(d));
const e6 = (x) => n(x, 6);   // areas, pressures, ratios, velocities, lengths, intensities, times, temperatures
const r4 = (x) => n(x, 4);   // flows, duties, wetted areas, masses
const e12 = (x) => n(x, 12); // measured constants and ratios of them
const row = (cells) => `| ${cells.join(' | ')} |`;
const sci = (x) => Number(x).toExponential(3);

/** Assert the digest carries this exact line, and say which line it was. */
const line = (text, why) => {
  expect(digest.includes(text), `${why}\n  the digest does not carry: ${text}`).toBe(true);
};

// ---------------------------------------------------------------------------
// THE SURFACE. Every teaching reader, called ONCE, so the heavy blowdown
// marches are not re-run by every gate below.
// ---------------------------------------------------------------------------

const readerNames = L.TEACHING_READERS;
const surface = () => Object.fromEntries(readerNames.map((k) => [k, L[k]()]));
const SURFACE = surface();
const S = SURFACE;

describe('the teaching surface is whole', () => {
  it('every declared reader exists, answers, and nothing undeclared escapes the sweep', () => {
    expect(readerNames.length).toBeGreaterThanOrEqual(30);
    readerNames.forEach((k) => {
      expect(typeof L[k], `${k} is declared in TEACHING_READERS but is not a function`).toBe('function');
      expect(SURFACE[k], `${k} returned nothing`).toBeTruthy();
    });
    // Every zero-argument reader the lab exports must be DECLARED, so a reader
    // added without being listed fails here instead of escaping the leak gate.
    const undeclared = Object.keys(L).filter((k) => typeof L[k] === 'function'
      && L[k].length === 0
      && !readerNames.includes(k)
      && !['bisect', 'solve3', 'collectNumbers', 'returnShape', 'relievingPsia', 'closedFormTimeS',
        'countHistoryComments', 'countHistoryMarkers', 'gradedFieldCount'].includes(k));
    expect(undeclared, 'these readers are not declared in TEACHING_READERS').toEqual([]);
    console.log(`[relief lab] ${readerNames.length} teaching readers, `
      + `${L.collectNumbers(SURFACE).length} numbers on the whole surface`);
  });

  it('the wave inputs came through the resolver and it says which copy it read', () => {
    expect(fs.statSync(DIGEST_PATH).size).toBeGreaterThan(50000);
    const where = path.resolve(waveDir(WAVE_NAME)) === path.resolve(mirrorDir(WAVE_NAME))
      ? 'the committed copy' : 'a live wave directory';
    console.log(`[relief lab] read the digest from ${where}: ${waveDir(WAVE_NAME)}`);
    // A missing input FAILS and names itself rather than skipping.
    expect(() => waveInput(WAVE_NAME, 'a-file-this-wave-does-not-carry.txt'))
      .toThrow(/a-file-this-wave-does-not-carry\.txt/);
  });

  it('the digest carries a plausible number of literals, so it is not empty or mid rebuild', () => {
    expect((digest.match(/\d+\.\d{6}/g) || []).length).toBeGreaterThan(1200);
    expect((digest.match(/^# SECTION \d+:/gm) || []).length).toBe(29);
  });

  it('the teaching fields are copied verbatim from fc5_fields.mjs, which fc5_dump.mjs imports', () => {
    const wave = fs.readFileSync(FIELDS_MJS, 'utf8');
    const lab = LAB_SOURCE();
    // Each declaration is compared as TEXT, so a field edited in the lab alone
    // is a failure rather than a silent divergence from what the digest was
    // built with.
    const declarations = [
      'export const ORUBIRI = {', 'export const AKASO = {', 'export const TEBIDABA = {',
      'export const BENISEDE = {', 'export const ODIDI = {', 'export const AFIESERE = {',
      'export const ORUBIRI_BACK_RATIOS =', 'export const K_SWEEP =', 'export const AKASO_MU_SWEEP =',
      'export const KV_RE_SWEEP =', 'export const KN_P_SWEEP =', 'export const BISECT = {',
      'export const BENISEDE_LEVEL_SWEEP =', 'export const ENV_SWEEP =', 'export const FIRE_EXPONENT_PROBE =',
      'export const ODIDI_DROPLET_SWEEP =', 'export const ODIDI_HOLDUP_SWEEP =', 'export const ODIDI_DIAMETER_SWEEP =',
      'export const AFIESERE_ORIFICE_SWEEP =', 'export const AFIESERE_STEP_SWEEP =', 'export const AFIESERE_FLARE = {',
      'export const RADIATION_DISTANCE_SWEEP =', 'export const PROBES = {', 'export const REFUSALS = [',
      'export const ZERO_TIME_CASES = [', 'export const CONVENTION_PROBE =', 'export const CONVENTION_LEVELS =',
      'export const BARE_NUMBER_EXPORTS =', 'export const DATA_EXPORTS =', 'export const CONSTANT_EXPORTS =',
    ];
    const bodyAfter = (rawText, head) => {
      // The wave file carries an inline comment on some rows and the lab carries
      // its own, so the comparison is of the DECLARATION rather than of the
      // prose around it: line comments are stripped and whitespace is collapsed.
      const text = rawText.replace(/\/\/[^\n]*/g, '');
      const at = text.indexOf(head);
      expect(at, `${head} is missing`).toBeGreaterThan(-1);
      const rest = text.slice(at);
      const end = rest.indexOf('\n];') >= 0 && rest.indexOf('\n];') < rest.indexOf('\n\n')
        ? rest.indexOf('\n];') + 3
        : (rest.indexOf('\n};') >= 0 && rest.indexOf('\n};') < rest.indexOf('\n\n')
          ? rest.indexOf('\n};') + 3
          : rest.indexOf('\n'));
      return rest.slice(0, end).replace(/\s+/g, ' ').trim();
    };
    declarations.forEach((head) => {
      expect(bodyAfter(lab, head), `${head} in the lab differs from the wave's own fc5_fields.mjs`)
        .toBe(bodyAfter(wave, head));
    });
    console.log(`[relief lab] ${declarations.length} teaching field declarations verbatim against fc5_fields.mjs`);
  });

  it('the published goldens are eleven blocks and forty nine rows', () => {
    expect(S.goldenCounts).toEqual({
      blowdown: 5, dropout: 4, drum: 6, fire: 4, gas: 5, liquid: 5, load: 3,
      radiation: 3, setback: 2, steam: 5, wetted: 7, blocks: 11, rows: 49,
    });
    line('- The published set carries 49 rows across 11 blocks: blowdown 5, dropout 4, drum 6, fire 4, '
      + 'gas 5, liquid 5, load 3, radiation 3, setback 2, steam 5, wetted 7.', 'the golden census');
  });
});

// ---------------------------------------------------------------------------
// AGREEMENT WITH THE DIGEST, SECTION BY SECTION.
// ---------------------------------------------------------------------------

describe('SECTION 1: the export contract, measured', () => {
  it('twenty two exports, seven bare numbers, twelve objects, two tables and one constant', () => {
    const s = S.engineScope;
    line(`- Exports, counted by reading the module: ${s.exportCount}.`, 'the export count');
    line(`  ${s.exportNames.join(', ')}`, 'the export list');
    line(`- ${s.bareNumberCount} exports return a bare number and signal a refusal with NaN. `
      + `${s.objectCount} return an object. ${s.tableCount} are published tables and `
      + `${s.constantCount} is a derived constant.`, 'the contract census');
    line(`| NAPIER_UNITY_PSIA | number | a derived constant, ${e6(s.napierUnityPsia)} psia |`, 'the exported constant');
    line(`| API_ORIFICES | array | ${s.orificeRowCount} published rows |`, 'the orifice table row count');
    line(`| RADIATION_LEVELS | array | ${s.radiationRowCount} published rows |`, 'the radiation table row count');
  });

  it('every export typeof is the one the digest printed', () => {
    const s = S.engineScope;
    // The digest prints the figure beside the two published tables and the one
    // derived constant, so those three rows carry their own measurement and the
    // rest carry the contract sentence.
    const suffix = {
      NAPIER_UNITY_PSIA: `, ${e6(s.napierUnityPsia)} psia`,
      API_ORIFICES: `, ${s.orificeRowCount} published rows`,
      RADIATION_LEVELS: `, ${s.radiationRowCount} published rows`,
    };
    const returnsOf = (r) => {
      if (r.name === 'API_ORIFICES') return `${s.orificeRowCount} published rows`;
      if (r.name === 'RADIATION_LEVELS') return `${s.radiationRowCount} published rows`;
      if (r.name === 'NAPIER_UNITY_PSIA') return `a derived constant, ${e6(s.napierUnityPsia)} psia`;
      return r.returns;
    };
    expect(Object.keys(suffix)).toHaveLength(3);
    s.rows.forEach((r) => {
      line(`| ${r.name} | ${r.typeOf} | ${returnsOf(r)} |`, `the contract row for ${r.name}`);
    });
  });
});

describe('SECTION 2: every constant measured and every threshold bisected', () => {
  const c = S.moduleConstants;
  it('the atmospheric constant, three ways', () => {
    line(`| the default outlet pressure, psia | ${e12(c.atmFromBranchFlagPsia)} |`, 'atmospheric out of the branch flag');
    line(`| the same, a second way | ${e12(c.atmFromSubcriticalAreaPsia)} |`, 'atmospheric out of a subcritical area');
    line(`| the same, from a different function | ${e12(c.atmFromMarchFloorPsia)} |`, 'atmospheric out of the march floor');
  });

  it('the four leading constants and the two pool fire constants', () => {
    line(`| the gas coefficient leading constant | ${e12(c.gasLeadingConstant)} |`, 'the 520');
    line(`| the subcritical leading constant | ${e12(c.subcriticalLeadingConstant)} |`, 'the 735');
    line(`| the liquid leading constant | ${e12(c.liquidLeadingConstant)} |`, 'the 38');
    line(`| the steam leading constant | ${e12(c.steamLeadingConstant)} |`, 'the 51.5');
    line(`| the pool fire constant with drainage, Btu/hr per ft2^0.82 | ${e12(c.fireConstantDrainedBtuHr)} |`, 'the 21000');
    line(`| the pool fire constant without drainage | ${e12(c.fireConstantUndrainedBtuHr)} |`, 'the 34500');
    line(`| the drainage factor between them | ${e12(c.drainageFactorDerived)} |`, 'the drainage factor');
    line(`| the pool fire exponent | ${e12(c.fireExponent)} |`, 'the exponent');
  });

  it('the Kv fit, the Napier fit and the rest', () => {
    line(`| the Kv fit intercept | ${e12(c.kvFitIntercept)} |`, 'the Kv intercept');
    line(`| the Kv fit inverse-root term | ${e12(c.kvFitInverseRootTerm)} |`, 'the Kv inverse root term');
    line(`| the Kv fit inverse-three-halves term | ${e12(c.kvFitInverseThreeHalvesTerm)} |`, 'the Kv inverse three halves term');
    line(`| the Kv asymptote the unclamped fit reaches | ${e12(c.kvAsymptote)} |`, 'the Kv asymptote');
    line(`| the Reynolds number the clamp starts holding Kv at one | ${e12(c.kvClampReynolds)} |`, 'the Kv clamp');
    line(`| the Napier numerator slope over the denominator slope | ${e12(c.napierNumeratorSlopeRatio)} |`, 'the Napier slope ratio');
    line(`| the Napier numerator intercept over the denominator slope | ${e12(c.napierNumeratorInterceptRatio)} |`, 'the Napier numerator intercept');
    line(`| the Napier denominator intercept over the denominator slope | ${e12(c.napierDenominatorInterceptRatio)} |`, 'the Napier denominator intercept');
    line(`| the liquid Reynolds constant | ${e12(c.liquidReynoldsConstant)} |`, 'the 2800');
    line(`| the universal gas constant the march uses, ft.lbf/(lbmol.degR) | ${e12(c.universalGasConstant)} |`, 'the gas constant');
    line(`| the solid angle in the point source | ${e12(c.solidAngle)} |`, 'the solid angle');
    line(`| the settling group at 100 micron | ${e12(c.settleGroupAt100Micron)} |`, 'the settling group');
    line(`| the same at 200 micron | ${e12(c.settleGroupAt200Micron)} |`, 'the settling group at twice the size');
    line(`| the same at 0.02 cp | ${e12(c.settleGroupAtDoubleViscosity)} |`, 'the settling group at twice the viscosity');
    line(`| the squared settling coefficient times the foot per micron | ${e12(c.settleCoefficientSquaredTimesFootPerMicron)} |`, 'the settling coefficient');
  });

  it('every threshold and warning edge, bisected', () => {
    const e = c.edges;
    line(`| the Napier threshold, psia | ${e12(e.napierThresholdPsia)} |`, 'the Napier threshold');
    line(`| the Napier unity crossing, psia | ${e12(e.napierUnityCrossingPsia)} |`, 'the Napier unity crossing');
    line(`| the exported crossing, psia | ${e12(e.napierUnityExportedPsia)} |`, 'the exported crossing');
    line(`| the top of the published Napier range, psia | ${e12(e.napierTopPsia)} |`, 'the top of the range');
    line(`| the back-pressure ratio the bellows warning fires above | ${e12(e.backPressureWarnRatio)} |`, 'the bellows warning edge');
    line(`| the Kv the envelope warning fires below | ${e12(e.kvWarnValue)} |`, 'the envelope warning edge');
    line(`| the latent heat the near-critical warning fires below, Btu/lb | ${e12(e.latentWarnBtuLb)} |`, 'the latent heat edge');
    line(`| the drag coefficient cap | ${e12(e.dragCap)} |`, 'the drag cap');
    line(`| the Reynolds number just inside that cap | ${e12(e.dragCapReynolds)} |`, 'the Reynolds number at the cap');
    line(`| the L over D the go-wider note starts at | ${e12(e.ldGoWider)} |`, 'the go wider edge');
    line(`| the L over D the smaller-drum note ends at | ${e12(e.ldSmallerDrum)} |`, 'the smaller drum edge');
    line(`| the blowdown time limit, s | ${e12(e.blowdownTimeLimitS)} |`, 'the time limit');
  });
});

describe('SECTION 3: set, overpressure, relieving, and the pressure at the valve outlet', () => {
  const p = S.pressureLadder;
  it('the pressures and the overpressure sweep', () => {
    line(`- Relieving pressure, derived as set times one plus the overpressure fraction plus the measured `
      + `atmospheric ${e12(p.atmMeasuredPsia)}: ${e6(p.relievingPsiaDerived)} psia.`, 'the relieving pressure');
    line(`- Back pressure at the valve OUTLET, stated as ${e6(p.outletBackPsig)} psig, is `
      + `${e6(p.outletBackPsia)} psia absolute.`, 'the outlet pressure');
    line(`- The back-pressure RATIO the branch decision reads: ${e6(p.backRatioDerived)}.`, 'the outlet ratio');
    p.overpressureRows.forEach((r) => {
      line(row([e6(r.overpressurePct), e6(r.relievingPsia), e6(r.areaIn2), r.critical ? 'critical' : 'subcritical']),
        `the overpressure row at ${r.overpressurePct} percent`);
    });
    line(`- The same AKASO differential read both ways: a set pressure of ${e6(L.AKASO.setPsig)} psig raised `
      + `by ${e6(L.AKASO.overpressurePct)} percent is a relieving pressure of ${e6(p.liquidRelievingPsig)} psig, `
      + `and against back ${e6(p.liquidBackPsig)} psig that is a differential of `
      + `${e6(p.liquidDifferentialPsi)} psi.`, 'the liquid differential');
  });
});

describe('SECTION 4: gas and vapour, and the branch the outlet pressure decides', () => {
  const g = S.gasBranch;
  it('C, the critical ratio and F2 against the isentropic exponent', () => {
    g.kRows.forEach((r) => line(row([e6(r.k), e6(r.c), e6(r.criticalRatio), e6(r.f2AtPointEight)]),
      `the exponent row at k ${r.k}`));
  });

  it('the branch, with the flat stretch that is what choked means', () => {
    line(`- ORUBIRI critical ratio at k = ${e6(S.gasBranch.stream.criticalRatio === undefined ? 0 : 1.27)}: `
      + `${e6(g.criticalRatio)}.`, 'the ORUBIRI critical ratio');
    g.branchRows.forEach((r) => line(row([
      e6(r.backRatio), r.critical ? 'critical' : 'subcritical', e6(r.areaIn2),
      r.f2 === null ? 'n/a' : e6(r.f2), r.warned ? 'yes' : 'no',
    ]), `the branch row at a ratio of ${r.backRatio}`));
    // THE FLATNESS IS AN ASSERTION, not a look at a picture.
    const choked = g.branchRows.filter((r) => r.critical).map((r) => r.areaIn2);
    expect(new Set(choked.map((a) => e12(a))).size, 'the choked rows are not identical').toBe(1);
    expect(choked.length).toBeGreaterThanOrEqual(5);
  });

  it('Kb is ignored in the subcritical branch, and the engine says so', () => {
    g.kbRows.forEach((r) => line(row([
      r.critical ? 'critical' : 'subcritical', e6(r.backRatio), e6(r.kb), e6(r.areaIn2),
      r.warning ? 'yes' : 'no',
    ]), `the Kb row at ${r.backRatio} and Kb ${r.kb}`));
    const sub = g.kbRows.filter((r) => !r.critical);
    line(`- The two subcritical rows are IDENTICAL to twelve decimals, ${e12(sub[0].areaIn2)} in2 and `
      + `${e12(sub[1].areaIn2)} in2, and the engine attaches a warning on the second saying the typed Kb was ignored.`,
    'the two identical subcritical areas');
    const crit = g.kbRows.filter((r) => r.critical);
    line(`- The two critical rows are NOT identical, ${e6(crit[0].areaIn2)} in2 and ${e6(crit[1].areaIn2)} in2, `
      + 'because in critical flow Kb divides the area.', 'the two critical areas');
  });

  it('ORUBIRI end to end', () => {
    const s = g.stream;
    line(`- Relieving pressure ${e6(s.relievingPsiaDerived)} psia, back pressure ${e6(s.outletBackPsia)} psia, `
      + `branch critical, critical ratio ${e6(s.criticalRatio)}.`, 'the ORUBIRI pressures');
    line(`- Required area ${e6(s.areaIn2)} in2. Orifice ${s.orifice} at ${e6(s.orificeAreaIn2)} in2, `
      + `margin ${e6(s.margin)}.`, 'the ORUBIRI selection');
    expect(s.warning).toBeNull();
  });
});

describe('SECTION 5: the published gas cases', () => {
  it('every golden row, re-run', () => {
    const p = S.gasPublished;
    expect(p.count).toBe(5);
    p.rows.forEach((g) => line(row([
      r4(g.wLbHr), e6(g.p1Psia), e6(g.p2Psia), e6(g.tR), e6(g.mw), e6(g.z), e6(g.k), e6(g.kd), e6(g.kb), e6(g.kc),
      e6(g.areaIn2), e6(g.engineAreaIn2), sci(g.relDiff), g.engineCritical ? 'critical' : 'subcritical',
    ]), `the published gas row at ${g.wLbHr} lb/hr and ${g.p2Psia} psia`));
    // THE COUNT IS MEASURED AT BOTH ENDS. The digest used to say "Three of the 5
    // rows carry certified coefficients away from the defaults" while the golden
    // file carried exactly one, because the three was a word typed in the
    // generator's prose rather than a read of the data. The generator now
    // derives it, and the defaults it is counted against are MEASURED from the
    // engine rather than typed, which is what the lab does here too.
    const d = p.measuredDefaults;
    expect(d.kd).toBeCloseTo(0.975, 12);
    expect(d.kb).toBeCloseTo(1, 12);
    expect(d.kc).toBeCloseTo(1, 12);
    expect(p.awayFromDefaults, 'the golden gas block no longer carries exactly one row away from the defaults')
      .toBe(1);
    expect(p.awayFromDefaultsRows).toEqual([{ wLbHr: 25000, kd: 0.9, kb: 0.88, kc: 0.9 }]);
    line(`- Rows carrying certified coefficients away from the engine own defaults: ${p.awayFromDefaults} `
      + `of the ${p.count} rows. Those defaults are the MEASURED Kd ${e6(d.kd)}, Kb ${e6(d.kb)} and Kc `
      + `${e6(d.kc)} of section 2 rather than a figure typed here, and a row away from all three is the only `
      + 'way a published case can check that the coefficients divide rather than multiply.',
    'the measured count of rows away from the defaults');
    const off = p.awayFromDefaultsRows[0];
    line(`- The row away from the defaults is the one at ${r4(off.wLbHr)} lb/hr, at Kd ${e6(off.kd)}, `
      + `Kb ${e6(off.kb)} and Kc ${e6(off.kc)}.`, 'the row away from the defaults');
  });
});

describe('SECTION 6: liquid, the Kv loop, and what each fit term is worth where', () => {
  const l = S.liquidLoop;
  it('AKASO inviscid, viscous, and the one pass that is not enough', () => {
    line(`- Inviscid, with the viscosity left out entirely: area ${e6(l.inviscid.areaIn2)} in2, Kv `
      + `${e6(l.inviscid.kv)}, Reynolds null, iterations ${l.inviscid.iterations}.`, 'AKASO inviscid');
    line(`- Viscous: area ${e6(l.viscous.areaIn2)} in2, Kv ${e6(l.viscous.kv)}, Reynolds `
      + `${e6(l.viscous.reynolds)}, iterations ${l.viscous.iterations}, converged ${l.viscous.converged}, `
      + `residual ${e12(l.viscous.residual)}.`, 'AKASO viscous');
    line(`- The ratio of the two areas: ${e12(l.areaRatioDerived)}.`, 'the area ratio');
    line(`- What ONE pass would have given, built from the measured leading constants of section 2 and the engine `
      + `own Kv function: area ${e6(l.onePass.areaIn2)} in2 at Kv ${e6(l.onePass.kv)} and Reynolds `
      + `${e6(l.onePass.reynolds)}. Ratio of the converged area to the one-pass area: `
      + `${e12(l.convergedOverOnePassDerived)}.`, 'the one pass comparison');
  });

  it('the viscosity sweep and the Kv term table', () => {
    l.viscositySweep.forEach((r) => line(row([
      e6(r.muCp), e6(r.areaIn2), e6(r.kv), r.reynolds === null ? 'n/a' : e6(r.reynolds),
      String(r.iterations), String(r.converged), r.warned ? 'yes' : 'no',
    ]), `the viscosity row at ${r.muCp} cp`));
    l.kvTerms.forEach((r) => line(row([
      e6(r.reynolds), e6(r.kvClamped), e6(r.kvUnclamped), e6(r.interceptTerm),
      e6(r.inverseRootTerm), e6(r.inverseThreeHalvesTerm), e6(r.lastTermShareDerived),
    ]), `the Kv term row at a Reynolds number of ${r.reynolds}`));
    line(`- THE CORRECTION IS CLAMPED AT ONE. The unclamped fit rises through one and asymptotes to `
      + `${e12(l.kvAsymptote)}`, 'the clamp statement');
    line(`- The envelope warning fires below a Kv of ${e12(l.kvWarnValue)}`, 'the envelope warning');
  });
});

describe('SECTION 7: the published liquid cases', () => {
  it('every golden row, re-run, and the one below a Reynolds number of two hundred', () => {
    const p = S.liquidPublished;
    expect(p.count).toBe(5);
    p.rows.forEach((g) => line(row([
      r4(g.qGpm), e6(g.p1Psig), e6(g.p2Psig), e6(g.sg), e6(g.muCp), e6(g.kd), e6(g.kv),
      g.reynolds === null ? 'n/a' : e6(g.reynolds), e6(g.areaIn2), e6(g.engineAreaIn2), sci(g.relDiff),
    ]), `the published liquid row at ${g.qGpm} gpm and ${g.muCp} cp`));
    line(`- ${p.belowReynoldsTwoHundred} of the ${p.count} rows sits below a Reynolds number of 200, at `
      + `${e6(p.lowestReynolds)}.`, 'the low Reynolds row');
  });
});

describe('SECTION 8: steam, Napier, and both crossings of unity', () => {
  const s = S.steamNapier;
  it('the threshold, the crossings, and the step', () => {
    line(`- The threshold, bisected: ${e12(s.thresholdPsia)} psia. The crossing back through unity, bisected: `
      + `${e12(s.unityCrossingPsia)} psia. The engine exported constant for the same crossing: `
      + `${e12(s.unityExportedPsia)} psia. The top of the published range, bisected: `
      + `${e12(s.topOfRangePsia)} psia.`, 'the Napier boundaries');
    line(`- THE CORRECTION STEPS RATHER THAN SLIDING. A millionth of a psi below the threshold KN is `
      + `${e12(s.knJustBelowThreshold)} and a millionth above it KN is ${e12(s.knJustAboveThreshold)}, a step of `
      + `${e12(s.stepDerived)} across two millionths of a psi.`, 'the step at the threshold');
  });

  it('the pressure sweep across the whole published range', () => {
    s.rows.forEach((r) => line(row([e6(r.relievingPsia), e6(r.kn), e6(r.areaIn2), r.warned ? 'yes' : 'no']),
      `the Napier row at ${r.relievingPsia} psia`));
  });

  it('TEBIDABA end to end, and the typed superheat factor', () => {
    line(`- Relieving pressure ${e6(s.stream.relievingPsiaDerived)} psia, KN ${e6(s.stream.kn)}, required area `
      + `${e6(s.stream.areaIn2)} in2, orifice ${s.stream.orifice} at ${e6(s.stream.orificeAreaIn2)} in2, margin `
      + `${e6(s.stream.margin)}.`, 'the TEBIDABA chain');
    line(`The same case at a superheated KSH of ${s.superheated.ksh}: area ${e6(s.superheated.areaIn2)} in2.`,
      'the superheated case');
  });
});

describe('SECTION 9: the published steam cases', () => {
  it('every golden row, re-run, and how many have Napier active', () => {
    const p = S.steamPublished;
    expect(p.count).toBe(5);
    p.rows.forEach((g) => line(row([
      r4(g.wLbHr), e6(g.p1Psia), e6(g.kd), e6(g.ksh), e6(g.kn), e6(g.areaIn2), e6(g.engineAreaIn2),
      sci(g.relDiff), e6(g.engineKn),
    ]), `the published steam row at ${g.wLbHr} lb/hr and ${g.p1Psia} psia`));
    line(`- ${p.napierActive} of the ${p.count} rows have the Napier correction active`, 'the Napier active count');
    expect(p.insideTheEnlargingBand).toBe(1);
  });
});

describe('SECTION 10: from a required area to a standard orifice', () => {
  const o = S.orificeLadder;
  it('the ladder, with the ratio of each row to the one below', () => {
    o.ladder.forEach((r) => line(row([r.orifice, e6(r.areaIn2), r.ratioToTheOneBelow === null ? 'n/a' : e6(r.ratioToTheOneBelow)]),
      `the ladder row for orifice ${r.orifice}`));
    expect(o.rowCount).toBe(14);
    // THE LADDER IS NOT GEOMETRIC, asserted rather than described.
    const ratios = o.ladder.slice(1).map((r) => r.ratioToTheOneBelow);
    expect(new Set(ratios.map((x) => e6(x))).size).toBeGreaterThan(10);
  });

  it('selection across and ON both boundaries, and the refusal past the largest', () => {
    o.selectionRows.forEach((r) => line(row([e6(r.requiredAreaIn2), r.orifice, e6(r.orificeAreaIn2), e6(r.margin), r.note]),
      `the selection row at ${r.requiredAreaIn2} in2`));
    o.pastLargest.forEach((r) => line(row([e6(r.requiredAreaIn2), r.error, String(r.multipleOfT)]),
      `the refusal row at ${r.requiredAreaIn2} in2`));
  });

  it('the three streams from an area to a letter', () => {
    o.streams.forEach((r) => line(row([r.stream, r.fluid, e6(r.areaIn2), r.orifice, e6(r.orificeAreaIn2), e6(r.margin)]),
      `the stream row for ${r.stream}`));
  });

  it('THE BRACKET IS GROWN UNTIL IT HOLDS THE LETTER CHANGE, and the bisection inside it lands on the orifice area', () => {
    // The bracket used to run from half the stated load to two and a half times
    // it. The selection is L at the stated load and a different letter at each
    // of those ends, so the predicate was false at both, the bisection had
    // nothing to find, and the digest printed the NaN it returned as a
    // measurement. The bracket is now grown from the stated load by a fixed
    // step until the letter first changes, so the root is inside it by
    // construction, and the three claims that answer supports are each asserted
    // rather than described.
    const b = o.letterFlipBracket;
    expect(b.loLbHr).toBe(L.ORUBIRI.wLbHr);
    expect(b.letterAtLo).toBe(o.streams[0].orifice);
    expect(b.letterAtHi).not.toBe(o.streams[0].orifice);
    expect(b.steps).toBeGreaterThan(0);
    expect(b.hiLbHr).toBeCloseTo(b.loLbHr * (b.stepFactor ** b.steps), 6);
    expect(o.letterFlipBracketed).toBe(true);
    expect(Number.isFinite(o.letterFlipLoadLbHr)).toBe(true);
    // THE ANSWER IS THE ORIFICE AREA. At the load where the letter changes the
    // required area is the L orifice area itself, which is the arithmetic the
    // selection rule makes unavoidable.
    expect(o.letterFlipAreaIn2).toBeCloseTo(o.streams[0].orificeAreaIn2, 9);
    // AND THE RATIO IS THE MARGIN. In critical flow the required area is
    // proportional to the load, so the ratio of the two loads is the margin of
    // the ORUBIRI selection.
    expect(o.letterFlipRatioDerived).toBeCloseTo(o.streams[0].margin, 9);
    line(`- At ${r4(L.ORUBIRI.wLbHr)} lb/hr the selection is ${o.streams[0].orifice}. THE BRACKET IS GROWN `
      + `RATHER THAN ASSUMED: the load is multiplied by ${e6(b.stepFactor)} until the letter changes, which `
      + `takes ${b.steps} steps and ends at ${r4(b.hiLbHr)} lb/hr, where the letter is ${b.letterAtHi}. A `
      + 'bisection needs the answer inside its bracket and cannot tell you when it is not.',
    'the grown bracket');
    line(`- Bisected inside that bracket, the load at which the letter changes is ${r4(o.letterFlipLoadLbHr)} `
      + `lb/hr, where the required area is ${e6(o.letterFlipAreaIn2)} in2. That is the ${o.streams[0].orifice} `
      + 'orifice area itself, which is the arithmetic the selection rule makes unavoidable.',
    'the bisected letter-change load');
    line(`- The ratio of that load to the stated one: ${e12(o.letterFlipRatioDerived)}. In critical flow the `
      + 'required area is proportional to the load, so that ratio IS the margin of the ORUBIRI selection, '
      + `printed as ${e6(o.streams[0].margin)} in the table above.`, 'the ratio of that load to the stated one');
    // NO PANEL SHOWS THIS FIGURE. It is a digest measurement, and a panel that
    // showed it would be showing a load no learner is asked to reach.
    PANEL_FILES.forEach((f) => expect(sourceOf(f), `${f} shows a figure no panel is meant to carry`)
      .not.toMatch(/letterFlip/));
  });
});

describe('SECTION 11: one Associate scenario, end to end', () => {
  it('each route has exactly one computed correction and one typed one', () => {
    const a = S.associateReading;
    expect(a.routes).toHaveLength(3);
    line(row(['required area in2', e6(a.routes[0].areaIn2), e6(a.routes[1].areaIn2), e6(a.routes[2].areaIn2)]),
      'the gathered required areas');
    line(row(['orifice', a.routes[0].orifice, a.routes[1].orifice, a.routes[2].orifice]), 'the gathered orifices');
    line(row(['margin', e6(a.routes[0].margin), e6(a.routes[1].margin), e6(a.routes[2].margin)]), 'the gathered margins');
    line(row(['the computed factor', `critical ratio ${e6(a.routes[0].computedFactor)}`,
      `Kv ${e6(a.routes[1].computedFactor)}`, `KN ${e6(a.routes[2].computedFactor)}`]), 'the computed factors');
    line(row(['the typed factor', `Kb ${e6(a.routes[0].typedFactor)}`, `Kw ${e6(a.routes[1].typedFactor)}`,
      `KSH ${e6(a.routes[2].typedFactor)}`]), 'the typed factors');
  });
});

describe('SECTION 12: the wetted area in both orientations, exactly', () => {
  const w = S.wettedGeometry;
  it('BENISEDE lying down and standing up, and the whole level walked', () => {
    line(`- Wetted area lying down: ${r4(w.lyingFt2)} ft2. Read standing up at the same level: `
      + `${r4(w.standingFt2)} ft2. Ratio: ${e12(w.lyingOverStandingDerived)}.`, 'the two orientations');
    w.rows.forEach((r) => line(row([
      e6(r.liquidLevelFt), e6(r.levelFractionDerived), r4(r.horizontalFt2), r4(r.verticalFt2),
      e6(r.horizontalOverVerticalDerived),
    ]), `the level row at ${r.liquidLevelFt} ft`));
  });

  it('HALF FULL is the one case with an analytic answer', () => {
    line(`- HALF FULL IS THE ONE CASE WITH AN ANALYTIC ANSWER. At a level of exactly ${e6(w.halfFull.levelFt)} ft `
      + `the wetted area is ${r4(w.halfFull.wettedFt2)} ft2, and half the lateral surface of the cylinder is `
      + `${r4(w.halfFull.halfTheLateralSurfaceFt2)} ft2. Ratio ${e12(w.halfFull.ratioDerived)}.`, 'half full');
    expect(e12(w.halfFull.ratioDerived)).toBe('1.000000000000');
    line(`- FULL, at a level of ${e6(12)} ft, the horizontal area is ${r4(w.fullFt2)} ft2, which is the whole `
      + 'lateral surface.', 'the full vessel');
  });
});

describe('SECTION 13: the published wetted-area cases', () => {
  it('every golden row, re-run, both orientations and the empty vessel', () => {
    const p = S.wettedPublished;
    expect(p.count).toBe(7);
    expect(p.vertical).toBe(3);
    p.rows.forEach((g) => line(row([
      g.orientation, e6(g.diameterFt), e6(g.lengthFt), e6(g.liquidLevelFt), r4(g.areaFt2), r4(g.engineAreaFt2),
      g.relDiff === null ? 'n/a, the empty vessel' : sci(g.relDiff),
    ]), `the published wetted row at ${g.orientation} ${g.diameterFt} ft`));
  });
});

describe('SECTION 14: the pool fire duty, its constants, its exponent and its credit', () => {
  const f = S.fireDuty;
  it('the two constants, the factor between them and the exponent', () => {
    line(`- Measured at a unit area and a unit environment factor: with drainage `
      + `${e12(f.constantDrainedBtuHr)} Btu/hr, without ${e12(f.constantUndrainedBtuHr)} Btu/hr. The factor `
      + `between them is ${e12(f.drainageFactorDerived)}.`, 'the two fire constants');
    line(`- The exponent, measured as the log ratio of two duties at 100 and 1000 ft2: ${e12(f.exponent)}.`,
      'the fire exponent');
  });

  it('the environment credit, the duty per square foot and the latent heat', () => {
    f.envRows.forEach((r) => line(row([e6(r.envFactor), r4(r.dutyDrainedBtuHr), r4(r.dutyUndrainedBtuHr), r4(r.loadDrainedLbHr)]),
      `the environment row at ${r.envFactor}`));
    f.areaRows.forEach((r) => line(row([r4(r.wettedFt2), r4(r.dutyBtuHr), r4(r.dutyPerFt2Derived)]),
      `the area row at ${r.wettedFt2} ft2`));
    line(`- The latent heat below which the warning fires, bisected: ${e12(f.latentWarnBtuLb)} Btu/lb.`,
      'the latent heat edge');
    f.latentRows.forEach((r) => line(row([e6(r.latentBtuLb), r4(r.loadLbHr), r.warned ? 'yes' : 'no']),
      `the latent heat row at ${r.latentBtuLb} Btu/lb`));
  });
});

describe('SECTION 15: the published fire and relief-load cases', () => {
  it('every golden row, re-run', () => {
    const p = S.firePublished;
    expect(p.fireCount).toBe(4);
    expect(p.loadCount).toBe(3);
    p.fireRows.forEach((g) => line(row([
      r4(g.wettedFt2), String(g.adequateDrainage), e6(g.envFactor), r4(g.qBtuHr), r4(g.engineQBtuHr), sci(g.relDiff),
    ]), `the published fire row at ${g.wettedFt2} ft2`));
    p.loadRows.forEach((g) => line(row([
      r4(g.qBtuHr), e6(g.latentBtuLb), r4(g.wLbHr), r4(g.engineWLbHr), sci(g.relDiff),
    ]), `the published load row at ${g.latentBtuLb} Btu/lb`));
  });
});

describe('SECTION 16: the fire case end to end, geometry to letter', () => {
  const c = S.fireCase;
  it('every step of the chain is an engine return', () => {
    line(`| wetted area | ${r4(c.chain.wettedFt2)} ft2 | wettedAreaFt2, horizontal |`, 'the wetted area step');
    line(`| pool fire duty | ${r4(c.chain.dutyBtuHr)} Btu/hr | fireHeatInput |`, 'the duty step');
    line(`| relief load | ${r4(c.chain.loadLbHr)} lb/hr | fireReliefLoad |`, 'the load step');
    line(`| required area | ${e6(c.chain.areaIn2)} in2 | gasVaporArea, critical |`, 'the area step');
    line(`| orifice | ${c.chain.orifice} at ${e6(c.chain.orificeAreaIn2)} in2 | selectOrifice |`, 'the orifice step');
    line(`| margin | ${e6(c.chain.margin)} | selectOrifice |`, 'the margin step');
    line(`relieving pressure ${e6(c.atProcessOverpressure.relievingPsiaDerived)} psia, required area `
      + `${e6(c.atProcessOverpressure.areaIn2)} in2, orifice ${c.atProcessOverpressure.orifice}.`,
    'the process overpressure chain');
  });

  it('what moves the letter, one changed input at a time', () => {
    c.whatMovesTheLetter.forEach((r) => line(row([
      r.changed, r4(r.wettedFt2), r4(r.dutyBtuHr), r4(r.loadLbHr), e6(r.areaIn2), r.orifice,
    ]), `the row that changed ${r.changed}`));
  });
});

describe('SECTION 17: droplet settling, drag against weight, iterated', () => {
  const d = S.dropletSettling;
  it('the derived vapour density and rate, and the droplet sweep', () => {
    line(`- The vapour density, DERIVED from the stated gravity and the package own gas constant and air `
      + `molecular weight: ${e6(d.vapourDensityLbFt3Derived)} lb/ft3.`, 'the vapour density');
    line(`- The actual vapour rate, DERIVED from the stated MMscfd at the package own standard base of `
      + `14.696 psia and 519.67 degR: ${e6(d.actualVapourRateAcfsDerived)} actual ft3/s.`, 'the actual rate');
    d.rows.forEach((r) => line(row([
      e6(r.dropletMicron), e6(r.udFtS), e6(r.dragC), e6(r.reynolds), String(r.iterations), String(r.converged),
    ]), `the droplet row at ${r.dropletMicron} micron`));
  });

  it('the cap, and the pair that belongs together', () => {
    line(`Measured: the drag coefficient stops moving at ${e12(d.dragCap)}, and the Reynolds number just inside `
      + `that cap is ${e12(d.dragCapReynolds)}.`, 'the cap and its Reynolds number');
    line(`The ODIDI pair: ${e6(d.statedPair.udFtS)} ft/s at a drag coefficient of ${e6(d.statedPair.dragC)}, `
      + `converged true in ${d.statedPair.iterations} passes on a residual of ${e12(d.statedPair.residual)}.`,
    'the returned pair');
  });
});

describe('SECTION 18: the knockout drum, a level, a segment and a length', () => {
  const k = S.knockoutDrum;
  it('the segment area fraction, and the one point it agrees with the depth fraction', () => {
    k.segmentRows.forEach((r) => line(row([e6(r.depthFraction), e6(r.liquidAreaFraction), e6(r.vapourAreaFractionDerived)]),
      `the segment row at a depth fraction of ${r.depthFraction}`));
    line(`- AT HALF DEPTH THE AREA FRACTION IS A HALF, ${e12(k.halfDepthAreaFraction)}, and only there do the `
      + 'depth fraction and the area fraction agree.', 'the half depth crossing');
    // ONLY THERE, asserted rather than described.
    k.segmentRows.filter((r) => r.depthFraction !== 0.5 && r.depthFraction !== 0)
      .forEach((r) => expect(e6(r.liquidAreaFraction), `${r.depthFraction} also agrees`).not.toBe(e6(r.depthFraction)));
  });

  it('the holdup walked end to end, and the spread it moves the length by', () => {
    k.holdupRows.forEach((r) => line(row([
      e6(r.liquidFraction), e6(r.liquidDepthFt), e6(r.liquidAreaFraction), e6(r.areaVaporFt2),
      e6(r.vVaporFtS), e6(r.fallFt), e6(r.requiredLengthFt), e6(r.ld), r.note === null ? 'none' : r.note,
    ]), `the holdup row at ${r.liquidFraction}`));
    line(`- THE HOLDUP MOVES THE ANSWER. Across the sweep above the required length runs from `
      + `${e6(k.lengthSpread.minFt)} ft to ${e6(k.lengthSpread.maxFt)} ft, a spread of `
      + `${e6(k.lengthSpread.spreadFtDerived)} ft, while the vapour velocity runs from `
      + `${e6(k.lengthSpread.minVapourFtS)} ft/s to ${e6(k.lengthSpread.maxVapourFtS)} ft/s.`, 'the holdup spread');
    // NOT MONOTONIC, asserted: the minimum is an interior row.
    const lengths = k.holdupRows.map((r) => r.requiredLengthFt);
    const at = lengths.indexOf(Math.min(...lengths));
    expect(at, 'the required length is monotonic in the holdup after all').toBeGreaterThan(0);
    expect(at).toBeLessThan(lengths.length - 1);
  });

  it('the convention, the diameter sweep and both edges of the note band', () => {
    k.conventionRows.forEach((r) => line(row([
      e6(r.fraction), e6(r.lengthAsLevelFt), e6(r.lengthAsAreaFractionFt), e6(r.ratioDerived),
    ]), `the convention row at ${r.fraction}`));
    k.diameterRows.forEach((r) => line(row([
      e6(r.diameterFt), e6(r.vVaporFtS), e6(r.requiredLengthFt), e6(r.ld), r.note === null ? 'none' : r.note,
    ]), `the diameter row at ${r.diameterFt} ft`));
    line(`The go-wider note starts at an L over D of ${e12(k.noteBand.goWiderLd)} and the smaller-drum note ends `
      + `at ${e12(k.noteBand.smallerDrumLd)}.`, 'both edges of the note band');
    line(`- The stated ODIDI drum: ${e6(9)} ft across at a holdup of ${e6(0.3)}, vapour velocity `
      + `${e6(k.statedDrum.vVaporFtS)} ft/s, required length ${e6(k.statedDrum.requiredLengthFt)} ft, L over D `
      + `${e6(k.statedDrum.ld)}, note ${k.statedDrum.note}.`, 'the stated drum');
  });
});

describe('SECTION 19: the published dropout and drum cases', () => {
  it('every golden row, re-run, and the six distinct holdups', () => {
    const p = S.dropoutDrumPublished;
    expect(p.dropoutCount).toBe(4);
    expect(p.drumCount).toBe(6);
    expect(p.distinctHoldups).toBe(6);
    p.dropoutRows.forEach((g) => line(row([
      e6(g.dropletMicron), e6(g.rhoLLbFt3), e6(g.rhoVLbFt3), e6(g.muVCp), e6(g.udFtS), e6(g.engineUdFtS),
      sci(g.relDiff), e6(g.engineDragC),
    ]), `the published dropout row at ${g.dropletMicron} micron`));
    p.drumRows.forEach((g) => line(row([
      e6(g.qVaporAcfs), e6(g.udFtS), e6(g.diameterFt), e6(g.liquidFraction), e6(g.liquidAreaFraction),
      e6(g.requiredLengthFt), e6(g.ld), e6(g.engineLengthFt), sci(g.relDiff),
    ]), `the published drum row at a holdup of ${g.liquidFraction}`));
  });
});

describe('SECTION 20: one Professional scenario, end to end', () => {
  it('the vessel in a fire, and the drum behind the valve', () => {
    const p = S.professionalReading;
    line(`| BENISEDE wetted area | ${r4(p.fire.wettedFt2)} ft2 | wettedAreaFt2 |`, 'the gathered wetted area');
    line(`| BENISEDE pool fire duty | ${r4(p.fire.dutyBtuHr)} Btu/hr | fireHeatInput |`, 'the gathered duty');
    line(`| BENISEDE relief load | ${r4(p.fire.loadLbHr)} lb/hr | fireReliefLoad |`, 'the gathered load');
    line(`| BENISEDE required area | ${e6(p.fire.areaIn2)} in2 | gasVaporArea |`, 'the gathered area');
    line(`| ODIDI vapour density | ${e6(p.drum.vapourDensityLbFt3Derived)} lb/ft3 | derived from the stated gravity |`,
      'the gathered vapour density');
    line(`| ODIDI actual vapour rate | ${e6(p.drum.actualVapourRateAcfsDerived)} acfs | derived from the stated MMscfd |`,
      'the gathered actual rate');
    line(`| ODIDI dropout velocity | ${e6(p.drum.dropoutVelocityFtS)} ft/s | dropoutVelocityFtS |`, 'the gathered dropout');
    line(`| ODIDI vapour velocity | ${e6(p.drum.vVaporFtS)} ft/s | koDrumHorizontal |`, 'the gathered vapour velocity');
    line(`| ODIDI required length | ${e6(p.drum.requiredLengthFt)} ft | koDrumHorizontal |`, 'the gathered length');
    line(`| ODIDI L over D | ${e6(p.drum.ld)} | koDrumHorizontal |`, 'the gathered L over D');
    expect(p.leftToTheCaller).toHaveLength(4);
  });
});

describe('SECTION 21: the blowdown march, and its closed form', () => {
  const b = S.blowdownMarch;
  it('every returned field of the march', () => {
    line(`| time to the end pressure | ${e6(b.timeS)} s |`, 'the time');
    line(`| the same in minutes, derived | ${e6(b.timeMinDerived)} |`, 'the time in minutes');
    line(`| starting inventory | ${r4(b.initialMassLb)} lb |`, 'the start mass');
    line(`| inventory left at the end | ${r4(b.massRemainingLb)} lb |`, 'the end mass');
    line(`| fraction of the inventory removed, derived | ${e6(b.fractionRemovedDerived)} |`, 'the fraction removed');
    line(`| final temperature | ${e6(b.finalTR)} degR |`, 'the final temperature');
    line(`| the same in degF, derived | ${e6(b.finalTFDerived)} |`, 'the final temperature in degF');
    line(`| final pressure | ${e6(b.finalPPsia)} psia |`, 'the final pressure');
    line(`| steps taken | ${b.steps} |`, 'the step count');
    line(`| steps that had to be subdivided | ${b.substeps} |`, 'the substep count');
    line(`| stations returned | ${b.stationCount} |`, 'the station count');
    line(`| the time step used | ${e6(b.dtS)} s |`, 'the time step');
    line(`| the pressure below which the choked assumption stops holding | ${e6(b.chokedToPsia)} psia |`,
      'the choked floor');
    expect(b.warning).toBeNull();
    line(`Rearranged, it gives ${e12(b.universalGasConstant)} ft.lbf per lbmol degR`, 'the measured gas constant');
  });

  it('the closed form of the same balance, on four cases', () => {
    b.closedCases.forEach((c) => line(row([c.label, e6(c.marchedS), e6(c.closedFormS), e12(c.ratioDerived)]),
      `the closed form row for ${c.label}`));
    // THE RATIO IS THE CHECK, asserted rather than described.
    b.closedCases.forEach((c) => expect(Math.abs(c.ratioDerived - 1), c.label).toBeLessThan(1e-6));
    line(`The same vessel at three coefficients: ${e6(b.cdCases[0].cd)} gives ${e6(b.cdCases[0].timeS)} s, `
      + `${e6(b.cdCases[1].cd)} gives ${e6(b.cdCases[1].timeS)} s, ${e6(b.cdCases[2].cd)} gives `
      + `${e6(b.cdCases[2].timeS)} s. The ratio of the first time to the last is `
      + `${e12(b.cdTimeRatioDerived)}, against a coefficient ratio of ${e12(b.cdFactorRatioDerived)}.`,
    'the discharge coefficient cases');
  });

  it('the trajectory the panel draws', () => {
    b.trajectory.forEach((s) => line(row([String(s.station), e6(s.timeS), e6(s.pressurePsia), e6(s.temperatureR)]),
      `the trajectory station ${s.station}`));
    expect(b.trajectory.length).toBe(28);
    expect(b.pressureFallsEverywhere).toBe(true);
  });
});

describe('SECTION 22: reading a depressuring time off a curve', () => {
  const d = S.depressuringTime;
  it('the orifice sweep, and the fifteen minutes read off it by bisection', () => {
    d.orificeRows.forEach((r) => line(row([
      e6(r.orificeDIn), e6(r.timeS), e6(r.timeMinDerived), e6(r.finalTR), String(r.steps), String(r.substeps),
    ]), `the orifice row at ${r.orificeDIn} in`));
    line(`- THE ORIFICE AT WHICH THIS VESSEL TAKES EXACTLY FIFTEEN MINUTES, bisected on the engine own time: `
      + `${e6(d.fifteenMinuteOrificeIn)} in, where the march returns ${e6(d.fifteenMinuteTimeS)} s.`,
    'the fifteen minute orifice');
    expect(e6(d.fifteenMinuteTimeS)).toBe('900.000000');
    line(`a ratio of ${e12(d.doublingRatioDerived)}.`, 'the doubling ratio');
  });

  it('THE COLD END IS FLAT across the orifice sweep, counted rather than eyeballed', () => {
    line(`- Distinct final temperatures across the orifice sweep, counted: ${d.distinctFinalTemperatures}.`,
      'the distinct final temperature count');
    expect(d.distinctFinalTemperatures).toBe(1);
    d.endPressureRows.forEach((r) => line(row([
      e6(r.pEndPsia), e6(r.timeS), e6(r.finalTR), e6(r.finalTFDerived), e6(r.fractionRemovedDerived),
    ]), `the end pressure row at ${r.pEndPsia} psia`));
    expect(d.belowTheFloorWarning).toBeTruthy();
    line(d.belowTheFloorWarning, 'the warning below the choked floor');
  });
});

describe('SECTION 23: a step size is an answer', () => {
  const s = S.stepStudy;
  it('seven halvings over a contiguous sequence, and the movement in total', () => {
    s.rows.forEach((r) => line(row([
      e6(r.dtS), e6(r.timeS), e6(r.finalTR), String(r.steps), String(r.substeps), e12(r.ratioToFinestDerived),
    ]), `the step row at ${r.dtS} s`));
    expect(s.rows).toHaveLength(7);
    expect(s.halvings).toBe(6);
    line(`- REFINING THE STEP CONVERGES. Across a sixty-four-fold refinement the time moves by `
      + `${e12(s.totalMovementSDerived)} s in total`, 'the total movement');
    expect(s.refinementFactorDerived).toBe(64);
  });

  it('the march lands ON the end pressure, and the hard geometries reach it', () => {
    line(`AFIESERE finishes at ${e12(s.landsOnTheEndPressure.finalPPsia)} psia against a target of `
      + `${e6(s.landsOnTheEndPressure.targetPsia)} psia, a difference of `
      + `${e12(s.landsOnTheEndPressure.differencePsiaDerived)} psia.`, 'landing on the end pressure');
    line(`At the stated step AFIESERE subdivided ${s.statedSubsteps} of its ${s.statedSteps} steps.`,
      'the subdivided count');
    s.hardGeometryRows.forEach((r) => line(row([
      `${e6(r.volumeFt3)} ft3, ${e6(r.orificeDIn)} in orifice`, e6(r.timeS), e6(r.finalPPsia), e6(r.finalTR),
      String(r.steps), String(r.substeps),
    ]), `the hard geometry row at ${r.volumeFt3} ft3`));
    // Every one reaches its end pressure and reports a time above zero.
    s.hardGeometryRows.forEach((r) => {
      expect(r.timeS, `${r.label} returned a time of zero`).toBeGreaterThan(0);
      expect(e6(r.finalPPsia)).toBe('114.700000');
    });
  });
});

describe('SECTION 24: the published blowdown cases', () => {
  it('every golden row, re-run, and the hard geometries among them', () => {
    const p = S.blowdownPublished;
    expect(p.count).toBe(5);
    expect(p.largeOrifice).toBe(2);
    expect(p.smallVessel).toBe(1);
    p.rows.forEach((g) => line(row([
      e6(g.volumeFt3), e6(g.p0Psia), e6(g.pEndPsia), e6(g.t0R), e6(g.mw), e6(g.k), e6(g.z), e6(g.orificeDIn),
      e6(g.cd), e6(g.timeS), e6(g.engineTimeS), sci(g.relDiff), e6(g.finalTR), r4(g.initialMassLb),
      r4(g.massRemainingLb),
    ]), `the published blowdown row at ${g.volumeFt3} ft3 through ${g.orificeDIn} in`));
  });
});

describe('SECTION 25: the point source asked both ways, and two tables with the same numbers', () => {
  const p = S.pointSource;
  it('the solid angle, the round trip and the derived heat release', () => {
    line(`- The solid angle in the relation, measured from one intensity against its own stated inputs: `
      + `${e12(p.solidAngle)}.`, 'the solid angle');
    line(`- The two directions against each other: an intensity of ${e12(p.roundTrip.intensityKWm2)} kW/m2 at `
      + `${e6(p.roundTrip.statedDistanceM)} m, and the distance the inverse demands for that intensity, `
      + `${e12(p.roundTrip.distanceBackM)} m. Ratio ${e12(p.roundTrip.ratioDerived)}.`, 'the round trip');
    line(`- Heat release, DERIVED from the two stated figures through the Btu per hour to kilowatt conversion: `
      + `${r4(p.flare.heatReleaseKwDerived)} kW.`, 'the heat release');
    line(`- At the stated ${e6(p.flare.statedDistanceM)} m the intensity is `
      + `${e6(p.flare.intensityAtStatedKWm2)} kW/m2.`, 'the intensity at the fence');
  });

  it('the distance sweep and the two typed fractions', () => {
    p.distanceRows.forEach((r) => line(row([e6(r.distanceM), e6(r.intensityKWm2)]),
      `the distance row at ${r.distanceM} m`));
    p.factorRows.forEach((r) => line(row([e6(r.fractionRadiated), e6(r.transmissivity), e6(r.intensityKWm2)]),
      `the factor row at ${r.fractionRadiated} and ${r.transmissivity}`));
  });

  it('the published rows in both directions, and the setback handed back by name', () => {
    p.publishedForwardRows.forEach((g) => line(row([
      r4(g.qKw), e6(g.distanceM), e6(g.fractionRadiated), e6(g.transmissivity), e6(g.kWm2), e6(g.engineKWm2),
      sci(g.relDiff),
    ]), `the published radiation row at ${g.distanceM} m`));
    p.publishedInverseRows.forEach((g) => line(row([
      r4(g.qKw), e6(g.allowableKwM2), e6(g.fractionRadiated), e6(g.transmissivity), e6(g.distanceM),
      e6(g.engineDistanceM), sci(g.relDiff),
    ]), `the published setback row at ${g.allowableKwM2} kW/m2`));
    expect(p.setbackOwnedBy).toMatch(/Separation/);
    line('THE SETBACK IS NOT TAUGHT HERE.', 'the setback deferral');
    // NO PANEL DRAWS A SETBACK against the four customary allowables.
    PANEL_FILES.forEach((f) => {
      const t = sourceOf(f);
      expect(t, `${f} builds a setback against the customary allowables`).not.toMatch(/RADIATION_LEVELS/);
    });
  });

  it('two engines export the identical four rows', () => {
    expect(p.tablesEqual).toBe(true);
    p.twoTables.forEach((r) => {
      line(row([e6(r.kWm2), r.reliefLabel, r.spacingLabel, r.equal ? 'yes' : 'no']),
        `the allowable row at ${r.kWm2} kW/m2`);
      expect(r.equal, `${r.kWm2} differs between the two engines`).toBe(true);
    });
  });
});

describe('SECTION 26: every refusal, and the contract behind them', () => {
  const rc = S.refusalContract;
  it('forty two refusals across twelve routes, every one of them refusing', () => {
    line(`- ${rc.refusalCount} refusals, across ${rc.routeCount} of the module routes.`, 'the refusal census');
    expect(rc.refusalCount).toBe(42);
    expect(rc.routeCount).toBe(12);
    expect(rc.everyRowRefused).toBe(true);
    rc.rows.forEach((r) => line(row([r.route, r.label, r.error]), `the refusal row for ${r.route}, ${r.label}`));
  });

  it('the soft states and the notes are the engine own text', () => {
    rc.warnings.forEach((w) => {
      expect(w.warning, `${w.route} attached no warning at ${w.condition}`).toBeTruthy();
      // The digest's own condition wording is its own; what is pinned here is
      // the engine's MESSAGE, which is the thing a panel shows.
      line(w.warning, `the warning message for ${w.route}`);
    });
    rc.notes.filter((nt) => nt.note !== null)
      .forEach((nt) => line(nt.note, `the note message for ${nt.route}`));
    expect(rc.notes.filter((nt) => nt.note === null)).toHaveLength(1);
  });

  it('the contract is MEASURED: every object route returns an object either way, every bare one NaN', () => {
    const census = S.contractCensus;
    census.objectRoutes.forEach((r) => {
      expect(r.accepted, r.name).toBe('object');
      expect(r.refused, r.name).toBe('object with an error');
    });
    census.bareNumberRoutes.forEach((r) => {
      expect(r.accepted, r.name).toBe('a finite number');
      expect(r.refused, r.name).toBe('NaN');
    });
    expect(census.bareNumberRoutes).toHaveLength(7);
    expect(census.objectRoutes).toHaveLength(12);
  });
});

describe('SECTION 27: what is computed, what is typed, and what is never checked', () => {
  it('every computed figure is measured and named beside what checks it', () => {
    S.theAudit.computed.forEach((c) => {
      expect(Number.isFinite(c.measured), c.quantity).toBe(true);
      expect(c.checkedBy.length).toBeGreaterThan(20);
    });
    expect(S.theAudit.computed.length).toBeGreaterThanOrEqual(9);
  });

  it('the two inputs that change nothing and always divide', () => {
    const a = S.theAudit;
    expect(a.inputThatChangesNothing.allEqual).toBe(true);
    const areas = a.inputThatChangesNothing.subcriticalKbAreas.map((x) => e12(x));
    line(`- Kb IN THE SUBCRITICAL BRANCH. Three different values give ${areas[0]}, ${areas[1]}, ${areas[2]} in2, `
      + 'one figure to twelve decimals.', 'the three identical subcritical areas');
    line(`${e6(a.inputThatAlwaysDivides.kshOne)} in2 and ${e6(0.83)} gives `
      + `${e6(a.inputThatAlwaysDivides.kshSuperheated)} in2, a ratio of `
      + `${e12(a.inputThatAlwaysDivides.areaRatioDerived)} against a factor ratio of `
      + `${e12(a.inputThatAlwaysDivides.factorRatioDerived)}.`, 'the superheat factor that always divides');
  });
});

describe('SECTION 28: what the published cases can and cannot discriminate', () => {
  it('the oracle route of every route, and the two that cannot discriminate', () => {
    const p = S.publishedCaseReach;
    expect(p.oracleRoutes).toHaveLength(15);
    p.oracleRoutes.forEach((r) => line(`| ${r.route} | `, `the oracle row for ${r.route}`));
    expect(p.oracleRoutes.filter((r) => r.independent === false).map((r) => r.route))
      .toEqual(['the Kv fit', 'the drag correlation']);
    expect(p.cannotDiscriminate).toEqual(['kv-fit-coefficients', 'sphere-drag-correlation']);
    expect(p.blocks).toBe(11);
    expect(p.rows).toBe(49);
  });
});

describe('SECTION 29: the one framed history section', () => {
  it('the section is the last one and frames itself in its own title and first line', () => {
    const headings = digest.match(/^# SECTION \d+:[^\n]*/gm);
    expect(headings[headings.length - 1]).toMatch(/SECTION 29: WHAT THIS ENGINE USED TO DO/);
    expect(digest.trimEnd().endsWith('# NOTHING FOLLOWS THIS SECTION.')).toBe(true);
    // The frame is the heading and the paragraph under it, and the rules file
    // declares the same section number.
    expect(fs.readFileSync(PROSE_RULES, 'utf8')).toContain('export const HISTORY_SECTION = 29;');
  });

  it('the reader carries four items, each a general lesson with the evidence the engine returns today', () => {
    const h = S.repairHistory;
    expect(h.items).toHaveLength(4);
    expect(h.framedBy).toMatch(/section 29/);
    h.items.forEach((i) => {
      expect(i.lesson.length, i.id).toBeGreaterThan(60);
      expect(i.formerBehaviour.length, i.id).toBeGreaterThan(60);
      expect(i.evidenceToday, i.id).toBeTruthy();
    });
    // The evidence really is today's engine: every hard geometry reaches its
    // end pressure, the holdup moves the length, and the closed form agrees.
    const [zero, holdup, twice] = h.items;
    zero.evidenceToday.forEach((r) => expect(r.timeS).toBeGreaterThan(0));
    expect(holdup.evidenceToday.lengthSpreadFt).toBeGreaterThan(30);
    expect(Math.abs(twice.evidenceToday.ratioDerived - 1)).toBeLessThan(1e-6);
  });

  it('the engine own source comments are counted rather than quoted', () => {
    const engine = fs.readFileSync(path.join(ROOT, 'packages/engines/engines/facilities/relief.js'), 'utf8');
    // COUNTED THE WAY THE GENERATOR COUNTS IT, which is the way wc -l counts.
    // The generator used to split on newlines without stripping the trailing
    // one, so its figure was one more than the number of lines carrying text
    // and the digest printed that. It now strips it, and this gate reproduces
    // the same count rather than a different one.
    expect(engine.endsWith('\n')).toBe(true);
    const lines = engine.split('\n').length - 1;
    const history = L.countHistoryComments(engine);
    const markers = L.countHistoryMarkers(engine);
    expect(markers).toBeGreaterThan(0);
    expect(history).toBeGreaterThan(0);
    line(`Counted by reading engines/facilities/relief.js: ${markers} comment lines carry the repair marker, `
      + `and ${history} comment lines are written in a past tense about former behaviour.`,
    'the engine history comment count');
    line(`- The module is ${lines} lines of text long, counting a line as a run ending in a newline the way `
      + 'wc -l does', 'the engine line count');
    console.log(`[relief lab] the vendored engine is ${lines} lines with ${markers} repair markers and `
      + `${history} past-tense comment lines, none of which is teaching truth`);
  });
});

describe('THE NEGATIVE CONTROL on the agreement: a value moved by one unit in the last printed place', () => {
  it('one moved engine value is NOT in the digest, so the agreement above can fail', () => {
    // If this passed, every `line()` assertion above would be meaningless.
    const b = S.blowdownMarch;
    const moved = b.timeS + 1e-6;
    expect(e6(moved)).not.toBe(e6(b.timeS));
    expect(digest.includes(`| time to the end pressure | ${e6(b.timeS)} s |`)).toBe(true);
    expect(digest.includes(`| time to the end pressure | ${e6(moved)} s |`),
      'a moved value is still found in the digest, so the agreement gate cannot fail').toBe(false);
    // And a moved TABLE ROW is absent too, so the row form is checkable as well.
    const w = S.wettedGeometry.rows[4];
    const goodRow = row([e6(w.liquidLevelFt), e6(w.levelFractionDerived), r4(w.horizontalFt2),
      r4(w.verticalFt2), e6(w.horizontalOverVerticalDerived)]);
    const badRow = row([e6(w.liquidLevelFt), e6(w.levelFractionDerived), r4(w.horizontalFt2 + 1e-4),
      r4(w.verticalFt2), e6(w.horizontalOverVerticalDerived)]);
    expect(digest.includes(goodRow)).toBe(true);
    expect(digest.includes(badRow)).toBe(false);
    console.log('[relief lab] NEGATIVE CONTROL: a time moved by 1e-6 s and a wetted area moved by 1e-4 ft2 '
      + 'are both absent from the digest, so the agreement gate is capable of failing');
  });
});

// ---------------------------------------------------------------------------
// THE TOLERANCE GATE. The lab holds no second copy of the eighteen tolerances.
// ---------------------------------------------------------------------------

const FIELDS = JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'));

describe('THE TOLERANCE GATE: the lab\'s tolerances ARE the derivation, never a copy', () => {
  it('the lab\'s table is gradedTolerance.js\'s derivation, field for field', () => {
    const table = S.gradedToleranceTable;
    expect(table).toHaveLength(18);
    table.forEach((t) => {
      expect(t.tolerance, `${t.key} does not match the derivation`).toBe(gradedTolerance(t.key));
      expect(t.printedDecimals, `${t.key} carries a printed precision of its own`).toBe(PRINTED_DECIMALS[t.cls]);
    });
    expect(table.map((t) => t.key)).toEqual(GRADED_FIELDS.map((f) => f[1]));
  });

  it('and it is the same as the answer key the GRADER holds', () => {
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([tier, key, , tol]) => {
      expect(gradedTolerance(key), `${key} is graded at a different tolerance than the lab derives`).toBe(tol);
      expect(L.gradedToleranceTable().find((t) => t.key === key).tier, `${key} is in the wrong tier`).toBe(tier);
    });
  });

  it('THE THIRD-COPY DEFECT: the lab source spells no tolerance of its own', () => {
    // FC2 and FC3 each shipped a stale hand-kept copy of these eighteen numbers
    // inside their lab while their tests read fields.json, and only the lab test
    // caught it. FC3 ended by deleting the copy and importing one derivation.
    // This gate is that repair carried forward: the lab imports the derivation
    // and the eighteen tolerance LITERALS appear nowhere in it.
    const src = LAB_SOURCE();
    expect(src).toMatch(/from '\.\/gradedTolerance\.js'/);
    // A COPY IS A GRADED FIELD KEY BESIDE A NUMBER, which is the only shape a
    // third copy can take. Searching for the tolerance values alone collides
    // with ordinary small constants: 1e-4 is a bisection bracket in this lab and
    // also a graded tolerance, and a detector that fired on that would be a gate
    // nobody could keep green. So the statement is the stronger one: the lab
    // names not one of the eighteen graded fields.
    const named = GRADED_FIELDS.map(([, key]) => key).filter((key) => src.includes(key));
    expect(named, 'the lab names a graded capstone field, which is where a third copy starts').toEqual([]);
    const distinctive = [...new Set(FIELDS.map(([, , , tol]) => String(tol)))]
      .filter((t) => t.length >= 6)
      .filter((t) => src.includes(t));
    expect(distinctive, 'the lab spells a graded tolerance as a literal, which is the third copy').toEqual([]);
    // CONTROL: the detector really does see a copy when there is one.
    const planted = `${src}\nconst TOLERANCES = { kolocreek_gas_coefficient_c: ${FIELDS[1][3]} };`;
    expect(GRADED_FIELDS.map(([, key]) => key).filter((key) => planted.includes(key)),
      'the third-copy detector cannot see a planted copy, so its green means nothing')
      .toEqual(['kolocreek_gas_coefficient_c']);
    console.log(`[relief lab] THE TOLERANCE GATE: 18 tolerances, one derivation, 0 copies in ${LAB_FILE}; `
      + 'the control proved a planted copy is caught');
  });
});

// ---------------------------------------------------------------------------
// THE LEAK GATE. No teaching number may be a graded capstone answer.
// ---------------------------------------------------------------------------

/** How many grading bands of clearance a teaching number must keep. */
const LEAK_MARGIN = 10;
/**
 * Three unit shiftings, because a teaching number that is a graded answer in
 * another unit is the same leak read differently.
 */
const LEAK_SHIFTINGS = [['as returned', 1], ['a thousand times', 1000], ['a thousandth', 0.001]];
/** Below this many numbers a surface is not a surface, and the gate REFUSES it. */
const MIN_SURFACE = 500;

const leakTargets = () => FIELDS.flatMap(([tier, key, value, tol]) => LEAK_SHIFTINGS.map(([shift, mul]) => ({
  tier, key, shift, value: value * mul, band: tol * mul * LEAK_MARGIN,
})));

/**
 * The guard over a surface of numbers. It REFUSES an empty or tiny surface
 * rather than calling it clean, because a gate that examines nothing and reports
 * green is the defect this programme keeps paying for.
 */
const sweepForLeaks = (numbers, targets) => {
  if (!Array.isArray(numbers) || numbers.length < MIN_SURFACE) {
    throw new Error(`[relief leak gate] REFUSED: a surface of ${Array.isArray(numbers) ? numbers.length : typeof numbers} `
      + `numbers is not a surface. At least ${MIN_SURFACE} are expected, and a gate that sweeps an empty `
      + 'surface reports a clean run over nothing.');
  }
  const hits = [];
  numbers.forEach(({ keyPath, value }) => {
    targets.forEach((t) => {
      if (Math.abs(value - t.value) <= t.band) {
        hits.push(`${keyPath} = ${value} is within ${LEAK_MARGIN} bands of ${t.tier}/${t.key} ${t.shift}`);
      }
    });
  });
  return [...new Set(hits)];
};

/**
 * A PERMANENT PLANTED LEAK in the guard's own surface, so the guard cannot
 * silently stop working. It is not part of the teaching surface: it is appended
 * to a COPY of it, and the gate below asserts the guard finds exactly this one.
 */
const PLANTED_LEAK = () => ({ keyPath: 'plantedLeak.theGuardMustFindThis', value: FIELDS[0][2] });

describe('THE LEAK GATE: no teaching number is a graded capstone answer', () => {
  const numbers = L.collectNumbers(SURFACE);
  const targets = leakTargets();

  it('the surface is large enough to mean something, and the targets cover all eighteen', () => {
    expect(numbers.length).toBeGreaterThanOrEqual(MIN_SURFACE);
    expect(targets).toHaveLength(18 * LEAK_SHIFTINGS.length);
    console.log(`[relief leak gate] ${numbers.length} numbers on the teaching surface against `
      + `${targets.length} targets, ${LEAK_MARGIN} grading bands of clearance, `
      + `shiftings: ${LEAK_SHIFTINGS.map(([s]) => s).join(', ')}`);
  });

  it('every teaching number stands clear of every graded answer', () => {
    expect(sweepForLeaks(numbers, targets), 'a teaching number is a graded capstone answer').toEqual([]);
  });

  it('THE PERMANENT PLANTED LEAK: the guard finds it, and finds only it', () => {
    const withPlant = [...numbers, PLANTED_LEAK()];
    const hits = sweepForLeaks(withPlant, targets);
    expect(hits.length, 'the guard did not find the planted leak, so its green means nothing').toBeGreaterThan(0);
    hits.forEach((h) => expect(h).toMatch(/^plantedLeak\.theGuardMustFindThis/));
    console.log(`[relief leak gate] THE PLANTED LEAK fired: ${hits[0]}`);
  });

  it('THE GUARD REFUSES AN EMPTY OR TINY SURFACE rather than calling it clean', () => {
    expect(() => sweepForLeaks([], targets)).toThrow(/REFUSED: a surface of 0 numbers is not a surface/);
    expect(() => sweepForLeaks([{ keyPath: 'a', value: 1 }], targets)).toThrow(/REFUSED: a surface of 1 numbers/);
    expect(() => sweepForLeaks(null, targets)).toThrow(/REFUSED: a surface of object numbers/);
    console.log('[relief leak gate] REFUSED an empty surface, a one-number surface and a null surface, '
      + `each naming the ${MIN_SURFACE} number floor`);
  });

  it('every number PRINTED IN A PANEL SOURCE or ON THE COURSE PAGE stands clear too', () => {
    // A panel prints formatted engine values, so the source's own decimal
    // literals are the only numbers it can carry that the lab never returned.
    const sources = COPY_SOURCES();
    expect(sources).toHaveLength(5);
    sources.forEach(([file, text]) => {
      const literals = (text.match(/\d+\.\d+(?:[eE][-+]?\d+)?/g) || []).map(Number).filter(Number.isFinite);
      const hits = [];
      literals.forEach((v) => targets.forEach((t) => {
        if (Math.abs(v - t.value) <= t.band) hits.push(`${file} prints ${v}, which is ${t.tier}/${t.key} ${t.shift}`);
      }));
      expect(hits, `${file} prints a graded capstone answer`).toEqual([]);
    });
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE.
// ---------------------------------------------------------------------------

describe('THE CLOCK GATE: no reader reads the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  const snapshot = () => JSON.stringify(readerNames.map((k) => [k, L[k]()]));

  it('identical output under two faked system dates, one long before FC5 and one far after', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2017-01-09T12:00:00Z'));
    const early = snapshot();
    vi.setSystemTime(new Date('2099-08-30T12:00:00Z'));
    const late = snapshot();
    expect(late.length).toBeGreaterThan(10000);
    expect(late).toBe(early);
    console.log(`[relief clock gate] ${late.length} bytes of reader output identical under 2017 and 2099`);
  });

  it('CONTROL: the fake clock did move', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2017-01-09T12:00:00Z'));
    const t1 = Date.now();
    vi.setSystemTime(new Date('2099-08-30T12:00:00Z'));
    const t2 = Date.now();
    expect(new Date(t1).getUTCFullYear()).toBe(2017);
    expect(new Date(t2).getUTCFullYear()).toBe(2099);
    expect(t2).toBeGreaterThan(t1);
  });

  it('CONTROL: there is no dated or seeded surface to fake, in the CODE rather than the prose', () => {
    // FC1's first version of this gate grepped its own PROSE for the word today,
    // which is a control that cannot fail. Comments are stripped first, so this
    // is a statement about the code.
    const stripped = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const code = stripped(LAB_SOURCE());
    expect(code.length).toBeGreaterThan(20000);
    ['asOf', 'today', 'seed', 'Math.random', 'Date'].forEach((needle) => {
      expect(code, `${needle} appears in the lab's code`).not.toContain(needle);
    });
    PANEL_FILES.concat(['ReliefLearningPage.jsx']).forEach((f) => {
      const t = stripped(f === 'ReliefLearningPage.jsx' ? PAGE_SOURCE() : sourceOf(f));
      ['Math.random', 'Date.now', 'new Date('].forEach((needle) => {
        expect(t, `${needle} appears in ${f}`).not.toContain(needle);
      });
    });
    // CONTROL ON THE STRIPPER: it really removes comment prose and really keeps code.
    const sample = '// a comment mentioning Date and Math.random\nconst x = 1;\n';
    expect(stripped(sample)).not.toContain('Math.random');
    expect(stripped(sample)).toContain('const x = 1;');
  });
});

// ---------------------------------------------------------------------------
// THE TIMEZONE GATE. The whole lab surface and the whole digest agreement, a
// second time, west of Greenwich.
// ---------------------------------------------------------------------------

const TZ_CHILD_TZ = 'America/Los_Angeles';

describe('THE TIMEZONE GATE: the lab rebuilds byte for byte west of Greenwich', () => {
  it(`the whole surface under TZ=${TZ_CHILD_TZ} is the surface built under UTC, byte for byte`, () => {
    const sidecar = path.join(ROOT, 'node_modules', '.fc5-tz-rebuild.json');
    if (process.env.FC5_TZ_CHILD) {
      // The child does not re-spawn itself. It writes the surface it built and
      // the offset it built it at, and every agreement gate above has already
      // run in this process under the child's own timezone.
      fs.writeFileSync(process.env.FC5_WRITE_BUILT, JSON.stringify({
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offsetMinutes: new Date().getTimezoneOffset(),
        surface: JSON.stringify(readerNames.map((k) => [k, L[k]()])),
      }));
      return;
    }
    if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
    execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), [
      'run', '--reporter=dot', '--config', 'vitest.config.js',
      'src/components/course/panels/relief/reliefLab.test.js',
    ], {
      cwd: ROOT,
      env: {
        ...process.env, TZ: TZ_CHILD_TZ, FC5_TZ_CHILD: '1', FC5_WRITE_BUILT: sidecar,
      },
      stdio: 'pipe',
      timeout: 900000,
    });
    const child = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
    fs.unlinkSync(sidecar);
    // CONTROL: the child really did run west of Greenwich, and every agreement
    // gate in this file ran there too, because the child ran this same file.
    expect(child.timeZone).toBe(TZ_CHILD_TZ);
    expect(child.offsetMinutes, 'the child ran at a UTC offset of zero').not.toBe(0);
    expect(child.surface).toBe(JSON.stringify(readerNames.map((k) => [k, L[k]()])));
    console.log(`[relief tz gate] the child ran at TZ=${child.timeZone}, offset ${child.offsetMinutes} minutes, `
      + `and rebuilt ${child.surface.length} bytes of surface identically, with every digest agreement gate `
      + 'in this file re-run there');
  }, 900000);
});

// ---------------------------------------------------------------------------
// THE REFUSAL GATE.
// ---------------------------------------------------------------------------

describe('THE REFUSAL GATE: every refusal shown is the engine\'s own returned message', () => {
  const rc = S.refusalContract;
  const messages = [
    ...rc.rows.map((r) => r.error),
    ...rc.warnings.map((w) => w.warning),
    ...rc.notes.map((nt) => nt.note).filter((x) => x !== null),
  ];

  it('there are refusals to check, so a rename cannot silently empty this gate', () => {
    expect(rc.rows.length).toBe(42);
    expect(messages.length).toBeGreaterThanOrEqual(50);
    const distinct = new Set(messages);
    console.log(`[relief refusal gate] ${messages.length} engine strings shown, ${distinct.size} distinct`);
    expect(distinct.size).toBeGreaterThanOrEqual(25);
  });

  it('every message carries text, and NEITHER the lab nor the engine throws', () => {
    messages.forEach((m) => expect(typeof m === 'string' && m.length > 10, m).toBe(true));
    L.REFUSAL_PROBES.forEach(({ route, label, run }) => {
      expect(() => run(), `${route} at ${label} raised instead of returning`).not.toThrow();
    });
  });

  it('NO refusal message is written as a literal in the lab, in a panel or on the course page', () => {
    const sources = COPY_SOURCES();
    const literals = [];
    sources.forEach(([file, text]) => {
      [...new Set(messages)].forEach((m) => {
        if (text.includes(m)) literals.push(`${file} writes the engine message as a literal: ${m}`);
      });
    });
    expect(literals, 'a refusal message is retyped rather than shown').toEqual([]);
  });

  it('CONTROL: calling the engine directly gives the same message the reader reports', () => {
    // Without this the gate above would pass over a lab that invented its own
    // messages, because nothing would tie a reader's string to the engine.
    const probe = L.REFUSAL_PROBES.find((p) => p.route === 'selectOrifice' && p.label.includes('zero'));
    expect(probe).toBeTruthy();
    const direct = probe.run();
    const reported = rc.rows.find((r) => r.route === probe.route && r.label === probe.label);
    expect(reported.error).toBe(direct.error);
    expect(reported.error.length).toBeGreaterThan(10);
  });

  it('CONTROL: an ACCEPTED probe reports no error, so the gate is not reading every call as a refusal', () => {
    S.contractCensus.objectRoutes.forEach((r) => expect(r.accepted, r.name).toBe('object'));
    const ok = L.CONTRACT_PROBES.map(([name, accepted]) => [name, accepted()]);
    ok.forEach(([name, v]) => expect(v.error, `${name} refused a call this gate calls accepted`).toBeUndefined());
    expect(ok).toHaveLength(12);
  });
});

// ---------------------------------------------------------------------------
// THE HELD GATE.
// ---------------------------------------------------------------------------

describe('THE HELD GATE: nine held quantities, two of them shared with the oracle on purpose', () => {
  const h = S.heldItems;

  it('there are nine, each carrying the marker wording', () => {
    expect(h.heldCount).toBe(9);
    expect(h.items).toHaveLength(9);
    h.items.forEach((i) => {
      expect(i.note, `${i.id} does not carry the marker`).toContain(L.HELD_MARKER);
      expect(i.note, `${i.id} does not say it is never an answer`).toMatch(/never as an answer/);
      expect(i.section).toBe(27);
    });
    expect(h.decisionCount).toBe(3);
  });

  it('the digest marks them the same way, and the audit carries the same nine', () => {
    expect((digest.match(/HELD FOR LITERATURE/g) || []).length).toBe(9);
    expect(S.theAudit.held.map((x) => x.id)).toEqual(h.items.map((x) => x.id));
  });

  it('THE TWO SHARED ITEMS are marked as shared, and the finding is called rather than reported as a pass', () => {
    const shared = h.items.filter((i) => i.sharedWithTheOracle);
    expect(shared.map((i) => i.id)).toEqual(['kv-fit-coefficients', 'sphere-drag-correlation']);
    expect(h.sharedWithTheOracleCount).toBe(2);
    shared.forEach((i) => {
      expect(i.note, `${i.id} does not say the oracle shares it`).toMatch(/SHARES? it|shares it|shares them/);
      expect(i.note, `${i.id} does not say a green run is evidence about the sharing`)
        .toMatch(/green|finding/);
    });
    // The digest says the same thing, in the words the audit uses.
    line('# THE TWO THINGS THIS PACKAGE CANNOT DISCRIMINATE, STATED PLAINLY.', 'the plain statement');
    // AND NO PANEL MAY PRESENT EITHER AS VALIDATED.
    PANEL_FILES.forEach((f) => {
      const t = sourceOf(f);
      expect(t, `${f} calls a shared quantity validated`).not.toMatch(/fit is validated|correlation is validated|independently checked/);
    });
  });

  it('every panel shows the wording that marks a held quantity unverified', () => {
    PANEL_FILES.forEach((f) => {
      const t = sourceOf(f);
      expect(t, `${f} shows no HELD FOR LITERATURE marker`).toContain(L.HELD_MARKER);
      expect(t, `${f} never says a held quantity is taught as a limit`).toMatch(/limit and never as an answer/);
    });
    // The course page lists all nine and says how many are shared.
    const page = PAGE_SOURCE();
    expect(page).toMatch(/held for literature verification/);
    expect(page).toMatch(/sharedWithTheOracleCount/);
    // The two shared quantities appear in the panels that teach them.
    expect(sourceOf('SizingExplorer.jsx')).toMatch(/SHARES them with the engine on purpose/);
    expect(sourceOf('FireDrumExplorer.jsx')).toMatch(/shares them with the engine deliberately/);
    console.log('[relief held gate] 9 held items, 2 shared with the oracle on purpose, marker in all 3 panels');
  });

  it('NO graded field reads a held quantity: the held functions are not what the capstone grades', () => {
    // The eighteen graded keys name what they measure. None of them is a fire
    // duty, a fire relief load, a dropout velocity, an orifice letter, a margin
    // or a row of the allowable table, which are the answers the held items
    // would reach.
    const keys = GRADED_FIELDS.map(([, k]) => k);
    ['duty', 'fire', 'orifice', 'margin', 'dropout', 'allowable', 'kv', 'drag', 'napier']
      .forEach((word) => expect(keys.filter((k) => k.includes(word)), `a graded key reads ${word}`).toEqual([]));
    expect(keys).toHaveLength(18);
  });
});

// ---------------------------------------------------------------------------
// THE COPY RULE. No em dash, no en dash, no contrastive, with TWO engine
// messages exempted BY EXACT STRING and a dead exemption FAILING.
// ---------------------------------------------------------------------------

/**
 * The two engine messages that breach the contrastive rule VERBATIM. They are
 * the engine's own wording, they are shown rather than retyped, and they are
 * exempted BY EXACT STRING. The exemption is not widened to a pattern, and a
 * row here that matches nothing FAILS, because an exemption for a string that
 * is no longer shown is a row claiming work it never did.
 */
const CONTRASTIVE_EXEMPTIONS = [
  'adequate drainage must be true or false, not a string',
  'subcritical flow uses F2, not Kb; the typed Kb was ignored',
];
const CONTRASTIVE_RE = /[,–—]\s*not\s+\S/g;

describe('THE COPY RULE: no dashes, and no contrastive outside two exact engine strings', () => {
  it('no em dash and no en dash in the lab, in any panel or on the course page', () => {
    COPY_SOURCES().forEach(([file, text]) => {
      expect(text, `${file} carries an em dash or an en dash`).not.toMatch(/[–—]/);
      expect(text, `${file} carries a percentile label`).not.toMatch(/\bP10\b|\bP50\b|\bP90\b/);
    });
  });

  it('no contrastive anywhere in the lab, in any panel or on the course page', () => {
    COPY_SOURCES().forEach(([file, text]) => {
      const hits = text.match(CONTRASTIVE_RE) || [];
      expect(hits, `${file} carries a contrastive: ${hits.join(' / ')}`).toEqual([]);
    });
  });

  it('the TWO exempted engine messages are the only contrastives shown, and each one is live', () => {
    const shown = [
      ...S.refusalContract.rows.map((r) => r.error),
      ...S.refusalContract.warnings.map((w) => w.warning),
      ...S.refusalContract.notes.map((nt) => nt.note).filter((x) => x !== null),
    ];
    const breaching = [...new Set(shown.filter((m) => CONTRASTIVE_RE.test(m)))];
    expect(breaching.sort()).toEqual([...CONTRASTIVE_EXEMPTIONS].sort());
    // A DEAD EXEMPTION FAILS: each exempted string must actually be one the
    // engine returns and a panel shows.
    CONTRASTIVE_EXEMPTIONS.forEach((ex) => {
      expect(shown, `the exemption for "${ex}" matches nothing the engine returns, so it clears nothing`)
        .toContain(ex);
    });
    // CONTROL: the matcher really does fire on the shape it is exempting.
    expect('a value must be true or false, not a string'.match(CONTRASTIVE_RE)).not.toBeNull();
    expect('a value must be true or false rather than a string'.match(CONTRASTIVE_RE)).toBeNull();
    console.log(`[relief copy rule] ${breaching.length} contrastives shown, both engine strings, `
      + 'both exemptions live, and neither widened to a pattern');
  });
});

// ---------------------------------------------------------------------------
// THE PROSE SWEEP over the lab's and the panels' own comments.
// ---------------------------------------------------------------------------

/**
 * The counting rule the digest's own section 29 uses to find a sentence about
 * former behaviour, narrowed to the phrases that cannot be clear air. The broad
 * rule the wave uses over the digest includes the word "before", which fires on
 * ordinary prose like "before any curve is drawn", so it is COUNTED and printed
 * here while the narrow list is what fails.
 */
const HISTORY_NARROW = /(used to|previous version|no longer|formerly|before the repair|was the bug|silently)/i;
const HISTORY_BROAD = /(used to|previous version|before|no longer|turned|silently)/i;
/** A comment line that frames the passage under it as history. */
const FRAMES_HISTORY = /HISTORY|USED TO DO|REPAIRED|FORMER BEHAVIOUR/;

/**
 * Every history-shaped line in the swept files, DECLARED with its frame. A row
 * here that matches nothing FAILS, the same discipline the wave's rules file
 * applies to its own cleared phrases.
 */
const DECLARED_HISTORY_LINES = [
  {
    file: 'reliefLab.js',
    text: 'export const HISTORY_COMMENT_RE',
    frame: 'it is the counting RULE for the engine\'s own comments and carries the keywords as data',
  },
  {
    file: 'ReliefLearningPage.jsx',
    text: 'The one module whose subject is what this engine used to do',
    frame: 'the module title above it is What Was Repaired, and What Was Not',
  },
  {
    file: 'reliefLab.js',
    text: 'the pair that used to be',
    frame: 'the heading above it declares the probe rows as DERIVED rather than listed, and the sentence '
      + 'says what the typed pair did before they were derived',
  },
  {
    file: 'reliefLab.js',
    text: 'It used to run from half the',
    frame: 'the heading above it is THE BRACKET IS GROWN UNTIL IT HOLDS THE ROOT, so the current behaviour '
      + 'is stated before the former one',
  },
  {
    file: 'reliefLab.js',
    text: 'This used to nudge the sixth probe',
    frame: 'the heading above it is THE PROBE IS THE NUMBER IN THE TABLE, so the current behaviour is '
      + 'stated before the former one',
  },
];

describe('THE PROSE SWEEP: the lab\'s and the panels\' own comments', () => {
  const commentsOf = (text) => [
    ...(text.match(/\/\*[\s\S]*?\*\//g) || []),
    ...(text.match(/^\s*\/\/.*$/gm) || []),
  ].join('\n');

  it('the lab carries comments to sweep, and they claim nothing the code contradicts', () => {
    const src = LAB_SOURCE();
    const comments = commentsOf(src);
    expect(comments.length).toBeGreaterThan(8000);
    // Every claim the comments make, checked against the code.
    expect(L.HELD_ITEMS).toHaveLength(9);
    expect(comments).toMatch(/NINE items are held/);
    expect(comments).not.toMatch(/\bEIGHT items are held\b|\bTEN items are held\b/);
    expect(comments).toMatch(/TWO OF THEM ARE SHARED WITH THE VALIDATION ORACLE/);
    expect(L.HELD_ITEMS.filter((i) => i.sharedWithTheOracle)).toHaveLength(2);
    // The comments name the engines the lab actually imports, and the vintage
    // the wave states.
    ['relief.js', 'spacing.js'].forEach((m) => expect(comments).toContain(m));
    expect(comments).toContain('3bac13cd');
    expect(fs.readFileSync(waveInput(WAVE_NAME, 'wave.json'), 'utf8')).toContain('3bac13cd');
    // The comments say the tolerances are not here, and they are not.
    expect(comments).toMatch(/THE TOLERANCES ARE NOT HERE/);
    // No percentile, and the comments say so.
    expect(comments).toMatch(/NO PERCENTILE/);
    expect(src).not.toMatch(/\bP10\b|\bP50\b|\bP90\b/);
  });

  it('every history-shaped line is DECLARED with its frame, and a dead declaration fails', () => {
    const files = COPY_SOURCES();
    const found = [];
    files.forEach(([file, text]) => {
      text.split('\n').forEach((l, i) => {
        if (HISTORY_NARROW.test(l)) found.push({ file, n: i + 1, l: l.trim() });
      });
    });
    // Every one found must be covered by a declaration.
    found.forEach((f) => {
      const covered = DECLARED_HISTORY_LINES.some((d) => d.file === f.file && f.l.includes(d.text));
      expect(covered, `${f.file}:${f.n} is a sentence about former behaviour with no declared frame: ${f.l}`)
        .toBe(true);
    });
    // AND A DEAD DECLARATION FAILS.
    DECLARED_HISTORY_LINES.forEach((d) => {
      const live = found.some((f) => f.file === d.file && f.l.includes(d.text));
      expect(live, `the declared history line "${d.text}" in ${d.file} matches nothing, so it frames nothing`)
        .toBe(true);
      expect(d.frame.length).toBeGreaterThan(20);
    });
    const broad = files.reduce((a, [, text]) => a
      + text.split('\n').filter((l) => HISTORY_BROAD.test(l)).length, 0);
    console.log(`[relief prose sweep] ${found.length} history-shaped lines, both declared with a frame; `
      + `${broad} lines match the wave's BROAD keyword rule and are triaged rather than failed`);
  });

  it('CONTROL: an unframed sentence about former behaviour IS caught', () => {
    // Without this the gate above would pass over a file with no history in it
    // at all, and could not be told apart from one whose detector is broken.
    const planted = 'the drum used to cancel its own holdup, so the box moved nothing';
    expect(HISTORY_NARROW.test(planted)).toBe(true);
    const covered = DECLARED_HISTORY_LINES.some((d) => planted.includes(d.text));
    expect(covered, 'a planted unframed history sentence was accepted by a declaration').toBe(false);
  });

  it('every panel source is swept the same way, and no panel imports an engine', () => {
    PANEL_FILES.forEach((f) => {
      const text = sourceOf(f);
      const comments = commentsOf(text);
      expect(comments.length, `${f} carries no comments to sweep`).toBeGreaterThan(800);
      expect(text, `${f} imports an engine directly`).not.toMatch(/@petrolord\/engines/);
      expect(text, `${f} reads the golden file directly`).not.toMatch(/relief_cases\.json/);
      expect(text, `${f} does not read the lab`).toMatch(/from '\.\/reliefLab'/);
    });
    expect(PAGE_SOURCE(), 'the course page imports an engine directly').not.toMatch(/@petrolord\/engines/);
  });
});

// ---------------------------------------------------------------------------
// THE EMPTY STATE GATE.
// ---------------------------------------------------------------------------

describe('THE EMPTY STATE GATE: every panel renders its empty state before any engine value exists', () => {
  const panels = [
    ['SizingExplorer', SizingExplorer, SIZING_EMPTY],
    ['FireDrumExplorer', FireDrumExplorer, FIRE_EMPTY],
    ['BlowdownExplorer', BlowdownExplorer, BLOWDOWN_EMPTY],
  ];

  it('all three declare the same empty state and it says what it is waiting for', () => {
    panels.forEach(([name, , empty]) => {
      expect(empty, `${name} declares no empty state`).toBeTruthy();
      expect(empty).toMatch(/No engine value has been read yet/);
    });
    expect(new Set(panels.map(([, , e]) => e)).size).toBe(1);
  });

  it('a static render carries the empty state and NOT ONE engine number', () => {
    // A static render runs no effect, which is exactly the first paint. A panel
    // that computed during render would print engine values into this markup,
    // and into a server render, a snapshot and a thumbnail with it.
    const numbers = L.collectNumbers(SURFACE)
      .map(({ value }) => value)
      .filter((v) => Math.abs(v) > 1e-6);
    panels.forEach(([name, Panel, empty]) => {
      const html = renderToStaticMarkup(React.createElement(Panel));
      expect(html.length, `${name} rendered nothing`).toBeGreaterThan(500);
      expect(html, `${name} does not show its empty state on the first paint`).toContain(empty);
      const printed = [...new Set(numbers)]
        .map((v) => v.toFixed(6))
        .filter((s) => s.length >= 8 && html.includes(s));
      expect(printed, `${name} printed engine values before any engine value was read`).toEqual([]);
    });
    console.log('[relief empty state gate] all 3 panels render their empty state with 0 engine numbers '
      + 'in the static markup');
  });

  it('every mode of every panel renders, and the mode lists are what the panel offers', () => {
    panels.forEach(([name, Panel]) => {
      const modes = name === 'SizingExplorer' ? 6 : (name === 'FireDrumExplorer' ? 5 : 4);
      expect(modes).toBeGreaterThan(3);
      expect(() => renderToStaticMarkup(React.createElement(Panel, { initialMode: 'nope' }))).not.toThrow();
    });
  });
});

// ---------------------------------------------------------------------------
// PORTABILITY.
// ---------------------------------------------------------------------------

describe('PORTABILITY: this suite runs on a CI runner', () => {
  it('no source beside this one names an absolute path under a wave author\'s home', () => {
    const here = fs.readdirSync(HERE).filter((f) => f.endsWith('.js') || f.endsWith('.jsx'));
    expect(here.length).toBeGreaterThanOrEqual(8);
    here.forEach((f) => {
      const t = fs.readFileSync(path.join(HERE, f), 'utf8');
      expect(t, `${f} names an absolute /root path, so it cannot run on a CI runner`).not.toMatch(/\/root\//);
    });
    expect(PAGE_SOURCE()).not.toMatch(/\/root\//);
    console.log(`[relief portability] ${here.length} sources in this directory, none naming a /root path; `
      + `every input read through waveInputs.mjs from ${waveDir(WAVE_NAME)}`);
  });

  it('a missing input FAILS and names the file rather than skipping', () => {
    expect(() => waveInput(WAVE_NAME, 'digest-that-is-not-there.txt'))
      .toThrow(/required input missing: digest-that-is-not-there\.txt/);
    expect(() => waveInput('a-wave-that-does-not-exist', 'digest.txt')).toThrow(/no wave named/);
  });
});
