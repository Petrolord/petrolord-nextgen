// FC8 METERING: EVERY VALUE THE LAB EXPOSES, PINNED AGAINST THE TEACHING DIGEST.
//
// The digest (tools/course-waves/metering/digest.txt) is nothing but the three
// vendored engines' return values on the teaching facilities ABOH, BELEMA and
// OGBOGENE. This suite READS THE NUMBERS OUT OF THE DIGEST rather than typing
// them, so a digest rebuild that moved a figure fails here instead of drifting
// silently past a hand-kept copy.
//
// THE RULES THIS WAVE IS BUILT ON, AND THE GATE FOR EACH:
//
//   THE DIGEST GATE      every teaching figure the lab returns is the figure
//                        the digest prints for it, at the precision the digest
//                        prints that class to, PARSED FROM THE FILE, with a
//                        negative control proving the parser can fail.
//   THE MEASURED GATE    every constant the lab reports is MEASURED out of the
//                        engine by bisecting a flag or a WORD, every edge
//                        discriminates, and the lab source carries no literal
//                        equal to a measured value except where that literal is
//                        a teaching sweep input copied verbatim from the wave.
//   THE TOLERANCE GATE   the lab exports NOTHING matching /tolerance|tol$/i and
//                        holds no capstone surface at all. The tolerances are
//                        derived once, in gradedTolerance.js.
//   THE RELATION GATE    every relationship the lab states carries both values,
//                        their difference and their ratio, all computed, and
//                        the arithmetic is checked.
//   THE REFUSAL GATE     every refusal the panels display is the engine's own
//                        returned message, and no message is written as a
//                        literal in the lab or in a panel.
//   THE WITHHELD GATE    the two withheld answers come back null with a reason
//                        at every input reachable from a panel, the reason is
//                        the engine's exported constant, and no panel prints a
//                        blank, a zero, a dash or a placeholder for one.
//   THE CLOCK GATE       every reader returns identical output under two faked
//                        system dates, with a control proving the clock moved.
//   THE PURITY GATE      two calls agree, and mutating a result changes neither
//                        the next call nor the frozen teaching fields.
//   THE COST GATE        the measured readers are TIMED, because this lab
//                        measures lazily rather than at import and that choice
//                        is priced rather than argued.
//   THE MIRROR GATE      the committed copy under tools/course-waves is
//                        byte-identical to the live wave directory, when the
//                        machine running this has one.
//
// PORTABILITY. The inputs are read through tools/course-waves/waveInputs.mjs,
// which defaults to the copy committed under tools/course-waves/metering. No
// absolute path into anybody's home directory appears in this file, absence
// FAILS BY NAME rather than skipping, and this suite passes with the live wave
// directory renamed out from under it.
import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
// A NAMESPACE IMPORT, walked by name. The READERS list in the lab is the tree
// these gates sweep, so a reader is reached as LAB[name] rather than by being
// listed a second time here, which is what stops a new reader escaping the
// sweep. eslint's import plugin cannot validate a computed member of a
// namespace and the rule is therefore off for this file; the purity gate below
// proves every declared reader resolves to a function, and proves the converse,
// so nothing hides behind the disabled rule.
/* eslint-disable import/namespace */
import * as LAB from './meteringLab.js';
import {
  waveDir, waveInput, mirrorDir, liveWaveDir,
} from '../../../../../tools/course-waves/waveInputs.mjs';

const WAVE_NAME = 'metering';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const WAVE = waveDir(WAVE_NAME);
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE_WAVE = liveWaveDir(WAVE_NAME);
const DIGEST_PATH = waveInput(WAVE_NAME, 'digest.txt');
const FIELDS_MJS = waveInput(WAVE_NAME, 'fc8_fields.mjs');
const DIGEST = fs.readFileSync(DIGEST_PATH, 'utf8');
const DIGEST_LINES = DIGEST.split('\n');
const LAB_SOURCE = () => fs.readFileSync(path.join(HERE, 'meteringLab.js'), 'utf8');

const PANEL_FILES = [
  'MeterRunExplorer.jsx', 'ChokingExplorer.jsx', 'VentingExplorer.jsx', 'WithheldExplorer.jsx',
];

/** A panel source, PROVEN to be there before anything is asserted about it. A
 *  gate that empties itself when its subject goes missing is the defect these
 *  gates exist to catch, so a name here that is not on disk is a failure. */
const panelSource = (file) => {
  const p = path.join(HERE, file);
  if (!fs.existsSync(p)) throw new Error(`${file} is gated here and is not on disk`);
  return fs.readFileSync(p, 'utf8');
};

const six = (v) => Number(v).toFixed(6);
const four = (v) => Number(v).toFixed(4);

// ---------------------------------------------------------------------------
// THE DIGEST PARSER. Every pin below reads its number out of digest.txt.
// ---------------------------------------------------------------------------

/**
 * The LAST number on the first digest line that contains this exact label.
 * The digest lays a label out and then right-pads a figure after it, so the
 * final numeric token on the line is the figure that label names.
 *
 * It THROWS when the label is absent or carries no number. A parser that
 * returned a sentinel would let a pin pass against nothing, which is the
 * failure mode this whole suite is built to avoid, and the negative control
 * below proves it throws.
 */
const digestFigure = (label, { after = 0 } = {}) => {
  for (let i = after; i < DIGEST_LINES.length; i += 1) {
    const line = DIGEST_LINES[i];
    if (!line.includes(label)) continue;
    const tail = line.slice(line.indexOf(label) + label.length);
    const nums = tail.match(/-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?/g);
    if (nums && nums.length) return { value: Number(nums[nums.length - 1]), line: i };
  }
  throw new Error(`no digest line carries a number after the label "${label}"`);
};

const figure = (label, opts) => digestFigure(label, opts).value;

/** The line index of the first line carrying this label, with no number
 *  required. Throws rather than returning a sentinel, for the same reason
 *  digestFigure does. */
const lineOf = (label, from = 0) => {
  const i = DIGEST_LINES.findIndex((l, j) => j >= from && l.includes(label));
  if (i < 0) throw new Error(`no digest line carries the label "${label}"`);
  return i;
};

/** The line index a section header sits on, so a label can be scoped to the
 *  section that owns it rather than matched anywhere in the file. */
const sectionAt = (n) => {
  const i = DIGEST_LINES.findIndex((l) => l.startsWith(`# SECTION ${n}:`));
  if (i < 0) throw new Error(`the digest has no SECTION ${n}`);
  return i;
};

/** A whitespace-separated row of a digest table, by its first column. */
const digestRow = (firstCell, from) => {
  for (let i = from; i < DIGEST_LINES.length; i += 1) {
    const cells = DIGEST_LINES[i].trim().split(/\s{2,}/);
    if (cells[0] === firstCell) return cells;
  }
  throw new Error(`no digest row starting "${firstCell}" after line ${from}`);
};

// ---------------------------------------------------------------------------

describe('FC8 metering: the wave inputs, portably', () => {
  it('reads its inputs from the committed copy, and neither this file nor a panel spells a home directory path', () => {
    expect(fs.existsSync(MIRROR)).toBe(true);
    const sources = [LAB_SOURCE(), fs.readFileSync(path.join(HERE, 'meteringLab.test.js'), 'utf8')]
      .concat(PANEL_FILES.map(panelSource));
    // A path of the shape this wave removed from every course suite. Written as
    // a built pattern so this assertion does not itself spell one.
    const homeish = new RegExp(`${'/'}root${'/'}`);
    sources.forEach((text, i) => {
      expect(homeish.test(text), `source ${i} spells an absolute home directory path`).toBe(false);
    });
  });

  it('ABSENCE FAILS BY NAME: an input that is not there throws and says which', () => {
    expect(() => waveInput(WAVE_NAME, 'a-file-this-wave-does-not-ship.json')).toThrow(/metering/);
  });

  it('the digest is whole: thirty two sections, numbered without a gap', () => {
    const headers = DIGEST_LINES.filter((l) => l.startsWith('# SECTION'));
    expect(headers).toHaveLength(32);
    headers.forEach((l, i) => expect(Number(/^# SECTION (\d+):/.exec(l)[1])).toBe(i + 1));
  });

  it('NEGATIVE CONTROL: the digest parser throws rather than returning a sentinel', () => {
    expect(() => figure('a label the digest has never carried')).toThrow(/no digest line/);
    expect(() => sectionAt(99)).toThrow(/no SECTION 99/);
    expect(() => digestRow('a row the digest has never carried', 0)).toThrow(/no digest row/);
  });

  it('THE MIRROR GATE: the committed copy is byte-identical to the live wave, where there is one', () => {
    if (!LIVE_WAVE) {
      expect(WAVE).toBe(MIRROR);
      return;
    }
    const names = fs.readdirSync(MIRROR).filter((n) => fs.statSync(path.join(MIRROR, n)).isFile());
    expect(names.length).toBeGreaterThan(10);
    names.forEach((n) => {
      const a = fs.readFileSync(path.join(MIRROR, n));
      const live = path.join(LIVE_WAVE, n);
      if (!fs.existsSync(live)) return;
      expect(a.equals(fs.readFileSync(live)), `${n} differs between the mirror and the live wave`).toBe(true);
    });
  });

  it('the teaching facilities are copied verbatim from the wave, which the digest generator imports', () => {
    const src = fs.readFileSync(FIELDS_MJS, 'utf8');
    const block = (name) => {
      const m = new RegExp(`export const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\}\\);`).exec(src);
      if (!m) throw new Error(`the wave's fields file declares no ${name}`);
      return Object.fromEntries([...m[1].matchAll(/(\w+):\s*([\d_.]+)/g)]
        .map(([, k, v]) => [k, Number(v.replace(/_/g, ''))]));
    };
    ['ABOH', 'BELEMA', 'BELEMA_GAS', 'OGBOGENE'].forEach((name) => {
      const declared = block(name);
      Object.entries(declared).forEach(([k, v]) => {
        expect(LAB[name][k], `${name}.${k} differs from the wave`).toBe(v);
      });
    });
  });
});

describe('THE TOLERANCE GATE: the lab holds no second copy of anything graded', () => {
  it('the lab exports nothing whose name suggests a tolerance', () => {
    const named = Object.keys(LAB).filter((k) => /tolerance|tol$/i.test(k));
    expect(named, `the lab exports ${named.join(', ')}`).toEqual([]);
  });

  it('the lab exports no capstone surface at all: no plant, no condition, no graded answer', () => {
    const named = Object.keys(LAB).filter((k) => /capstone|graded|krakama|utonana|saghara/i.test(k));
    expect(named, `the lab exports ${named.join(', ')}`).toEqual([]);
  });

  it('the lab CODE never imports the tolerance derivation, the capstone or a capstone plant', () => {
    // Comments are stripped first. The header comment POINTS AT the single
    // derivation on purpose, so a reader of the lab knows where the tolerances
    // live, and a gate that failed on that sentence would push the pointer out
    // of the file it belongs in. What may not be here is the CODE.
    const code = LAB_SOURCE().replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toMatch(/gradedTolerance/);
    expect(code).not.toMatch(/krakama|utonana|saghara/i);
    expect(code).not.toMatch(/GRADED_FIELDS|printedFloor|precisionDeclaration/);
    expect(code).not.toMatch(/from '\.\/gradedTolerance/);
    // And the whole file, comments included, never spells a capstone plant.
    expect(LAB_SOURCE()).not.toMatch(/krakama|utonana|saghara/i);
  });

  it('THE SINGLE DERIVATION IS STILL THERE, so this gate is an absence with a subject', () => {
    // A gate that only asserts something is missing says nothing unless the
    // thing it was moved to is present.
    expect(fs.existsSync(path.join(HERE, 'gradedTolerance.js'))).toBe(true);
    const tol = fs.readFileSync(path.join(HERE, 'gradedTolerance.js'), 'utf8');
    expect(tol).toMatch(/export const gradedTolerance/);
    expect(tol).toMatch(/export const GRADED_FIELDS/);
  });
});

describe('THE DIGEST GATE: SECTIONS 2, 3 and 13, the meter run and its budget', () => {
  const r = LAB.meterRun();

  it('SECTION 2: every field of the one orifice run is the digest figure', () => {
    expect(r.refused).toBe(false);
    expect(six(r.beta)).toBe(six(figure('beta ', { after: sectionAt(2) })));
    expect(six(r.cd)).toBe(six(figure('discharge coefficient', { after: sectionAt(2) })));
    expect(six(r.expansibility)).toBe(six(figure('expansibility', { after: sectionAt(2) })));
    expect(four(r.reynolds)).toBe(four(figure('pipe Reynolds number', { after: sectionAt(2) })));
    expect(four(r.massLbHr)).toBe(four(figure('mass flow, lb/hr', { after: sectionAt(2) })));
    expect(four(r.volumetricFt3HrAtFlowing)).toBe(four(figure('volume at flowing density, ft3/hr', { after: sectionAt(2) })));
    expect(six(r.dpPsi)).toBe(six(figure('differential, psi', { after: sectionAt(2) })));
    expect(r.betaInPublishedRange).toBe(true);
    expect(r.warning).toBeNull();
  });

  it('SECTION 3: the inch of water is MEASURED, and the two runs agree to the last bit', () => {
    const w = LAB.inchOfWater();
    expect(w.agreeToTheLastBit).toBe(true);
    expect(w.sharedInputs, 'the two probe runs share an input').toEqual([]);
    expect(w.factorDerived).toBe(figure('so the factor is', { after: sectionAt(3) }));
    // The psi each run returned, pinned against SECTION 2's own differential
    // line, because SECTION 3's prose lines end with the factor rather than
    // with the psi and the parser takes the last number on a line.
    expect(six(w.runs[0].dpPsi)).toBe(six(figure('differential, psi', { after: sectionAt(2) })));
    // The factor is the QUOTIENT of two returned figures, never a literal.
    expect(LAB_SOURCE()).not.toMatch(/0\.0361273/);
  });

  it('SECTION 13: all six budget terms, the total, the dominance and both routes', () => {
    const from = sectionAt(13);
    const b = r.budget;
    expect(b.contributions).toHaveLength(6);
    b.contributions.forEach((c) => {
      const row = digestRow(c.name, from);
      expect(six(c.sensitivity), `${c.name} sensitivity`).toBe(six(Number(row[1])));
      expect(six(c.uncertaintyPct), `${c.name} uncertainty`).toBe(six(Number(row[2])));
      expect(six(c.contributionPct), `${c.name} contribution`).toBe(six(Number(row[3])));
      expect(six(c.shareOfVariancePct), `${c.name} share`).toBe(six(Number(row[4])));
    });
    expect(six(b.totalUncertaintyPct)).toBe(six(figure('total uncertainty, percent of flow', { after: from })));
    expect(b.dominant).toBe('discharge coefficient');
    expect(b.runnerUp).toBe('expansibility');
    expect(b.dominanceIsClear).toBe(true);
    // The lead, as a RELATION the digest itself printed. Anchored to the
    // relation's own first line, because a section carries several relations
    // and every one of them prints a line called difference.
    const leadAt = digestFigure('discharge coefficient, share of variance in percent', { after: from }).line;
    expect(six(b.leadRelation.first)).toBe(six(figure('discharge coefficient, share of variance in percent', { after: from })));
    expect(six(b.leadRelation.second)).toBe(six(figure('expansibility, share of variance in percent', { after: leadAt })));
    expect(six(b.leadRelation.differenceDerived)).toBe(six(figure('difference (first less second)', { after: leadAt })));
    expect(six(b.leadRelation.ratioDerived)).toBe(six(figure('ratio (first over second)', { after: leadAt })));
    // And the two routes, the same way.
    const routeAt = digestFigure('with the differential term from the transmitter, percent', { after: from }).line;
    expect(six(r.routeRelation.first)).toBe(six(figure('with the differential term from the transmitter, percent', { after: from })));
    expect(six(r.routeRelation.second)).toBe(six(figure("with the engine's typed default differential term, percent", { after: routeAt })));
    expect(six(r.routeRelation.differenceDerived)).toBe(six(figure('difference (first less second)', { after: routeAt })));
    expect(six(r.routeRelation.ratioDerived)).toBe(six(figure('ratio (first over second)', { after: routeAt })));
  });

  it('SECTION 4: the coefficient surface, its count and its span', () => {
    const from = sectionAt(4);
    const s = LAB.coefficientSurface();
    expect(s.inPublishedRangeCount).toBe(figure('cells in the table above that sit inside the published beta range:', { after: from }));
    s.rows.forEach((row) => {
      const cells = digestRow(six(row.beta), from);
      row.cells.forEach((c, i) => expect(six(c.cd), `beta ${row.beta} cell ${i}`).toBe(six(Number(cells[i + 1]))));
    });
    const spanAt = digestFigure('largest, at beta 0.750000 and Reynolds 5e+3', { after: from }).line;
    expect(six(s.spanRelation.first)).toBe(six(figure('largest, at beta 0.750000 and Reynolds 5e+3', { after: from })));
    expect(six(s.spanRelation.second)).toBe(six(figure('smallest, at beta 0.750000 and Reynolds 5e+7', { after: spanAt })));
    expect(six(s.spanRelation.differenceDerived)).toBe(six(figure('difference (first less second)', { after: spanAt })));
    expect(six(s.spanRelation.ratioDerived)).toBe(six(figure('ratio (first over second)', { after: spanAt })));
  });

  it('SECTIONS 11, 12 and 14: the span march, and the three readings the engine turns over at', () => {
    const d = LAB.downTheSpan();
    const s11 = sectionAt(11);
    const s12 = sectionAt(12);
    const s14 = sectionAt(14);
    d.rows.forEach((row) => {
      const cells = digestRow(six(row.dpInH2O), s11);
      expect(six(row.uncertaintyPctOfReading), `${row.dpInH2O} pct`).toBe(six(Number(cells[1])));
      expect(six(row.differentialTurndown)).toBe(six(Number(cells[2])));
      expect(six(row.flowTurndown)).toBe(six(Number(cells[3])));
      expect(row.warningFires ? 'fires' : 'silent').toBe(cells[4]);
      const cells14 = digestRow(six(row.dpInH2O), s14);
      expect(six(row.totalUncertaintyPct), `${row.dpInH2O} total`).toBe(six(Number(cells14[1])));
      expect(row.dominant).toBe(cells14[2]);
      expect(six(row.dominantShareOfVariancePct)).toBe(six(Number(cells14[3])));
      expect(String(row.dominanceIsClear)).toBe(cells14[4]);
    });
    expect(six(d.warningEdge.at)).toBe(six(figure('the warning starts below a reading of, in H2O', { after: s12 })));
    expect(six(d.flowTurndownLimit)).toBe(six(figure('flow turndown limit the engine holds', { after: s12 })));
    expect(six(d.differentialTurndownLimit)).toBe(six(figure('differential turndown limit the engine holds', { after: s12 })));
    expect(six(d.dominanceEdge.at)).toBe(six(figure('the dominant term changes name at a reading of, in H2O', { after: s14 })));
    expect(six(d.flowTurndownAtChange)).toBe(six(figure('the flow turndown there', { after: s14 })));
    expect(six(d.totalAtChangePct)).toBe(six(figure('the total uncertainty there, percent', { after: s14 })));
    expect(six(d.clearEdge.at)).toBe(six(figure('the lead stops being clear at a reading of, in H2O', { after: s14 })));
    expect(d.dominantAbove).toBe('discharge coefficient');
    expect(d.dominantBelow).toBe('differential pressure');
  });
});

describe('THE DIGEST GATE: SECTIONS 17, 18, 19 and 20, the valve', () => {
  const m = LAB.chokingMarch();

  it('SECTION 17: the march, the count and the boundary', () => {
    const from = sectionAt(17);
    m.rows.forEach((row) => {
      const cells = digestRow(six(row.p2Psia), from);
      expect(six(row.dpStatedPsi), `${row.p2Psia} stated`).toBe(six(Number(cells[1])));
      expect(six(row.dpAllowablePsi)).toBe(six(Number(cells[2])));
      expect(six(row.dpUsedPsi)).toBe(six(Number(cells[3])));
      expect(six(row.cv)).toBe(six(Number(cells[4])));
      expect(six(row.sigma)).toBe(six(Number(cells[5])));
      expect(row.regime).toBe(cells[6]);
    });
    expect(m.chokedRowCount).toBe(figure('rows of the march above on which the engine reports choked flow:', { after: from }));
    expect(six(m.chokeEdge.at)).toBe(six(figure('the valve begins to choke at an outlet pressure of, psia', { after: from })));
    expect(six(m.atChoke.dpAllowablePsi)).toBe(six(figure('the allowable drop there, psi', { after: from })));
    expect(six(m.atChoke.cv)).toBe(six(figure('the coefficient there', { after: from })));
  });

  it('SECTION 17: what sizing on the stated drop would cost, as a computed RELATION', () => {
    const from = sectionAt(17);
    const rel = LAB.liquidAt(40).sizingRelation;
    const at = digestFigure('the engine, sizing on the drop the valve can use', { after: from }).line;
    expect(six(rel.first)).toBe(six(figure('the engine, sizing on the drop the valve can use', { after: from })));
    expect(six(rel.second)).toBe(six(figure('a sizing on the full stated drop', { after: at })));
    expect(six(rel.differenceDerived)).toBe(six(figure('difference (first less second)', { after: at })));
    expect(six(rel.ratioDerived)).toBe(six(figure('ratio (first over second)', { after: at })));
  });

  it('SECTION 18: the regime ladder, each rung found by bisecting the WORD', () => {
    const from = sectionAt(18);
    const named = [
      ['stable gives way to incipient cavitation', 'stable', 'incipient cavitation'],
      ['incipient gives way to cavitating', 'incipient cavitation', 'cavitating'],
      ['the flow chokes', 'cavitating', 'choked, cavitating'],
    ];
    named.forEach(([label, fromWord, toWord], i) => {
      const cells = digestRow(label, from);
      expect(six(m.ladder[i].outletPsia), label).toBe(six(Number(cells[1])));
      expect(six(m.ladder[i].sigmaThere), label).toBe(six(Number(cells[2])));
      expect(m.ladder[i].from).toBe(fromWord);
      expect(m.ladder[i].to).toBe(toWord);
    });
    expect(six(m.cavitatingThreshold)).toBe(six(figure('the cavitating threshold the engine exports', { after: from })));
    expect(six(m.incipientThreshold)).toBe(six(figure('the incipient threshold the engine exports', { after: from })));
  });

  it('SECTION 19: flashing starts exactly at the vapour pressure, as a computed RELATION', () => {
    const from = sectionAt(19);
    const rel = m.flashing.onsetRelation;
    const at = digestFigure('the outlet pressure where the engine turns the flashing flag on, psia', { after: from }).line;
    expect(six(rel.first)).toBe(six(figure('the outlet pressure where the engine turns the flashing flag on, psia', { after: from })));
    expect(six(rel.second)).toBe(six(figure('the stated vapour pressure, psia', { after: at })));
    // The onset is BISECTED out of the engine's own flag and the vapour
    // pressure is the stated input, so the two are equal at every precision
    // this course prints and differ in the last bits of a double. The
    // difference is compared as printed rather than asserted to be zero,
    // because a bisected value that landed exactly on a stated input would be
    // a coincidence of the bracket rather than a property of the engine.
    expect(six(rel.differenceDerived)).toBe(six(figure('difference (first less second)', { after: at })));
    expect(six(rel.ratioDerived)).toBe(six(figure('ratio (first over second)', { after: at })));
    expect(Math.abs(rel.differenceDerived)).toBeLessThan(1e-12);
    expect(six(m.criticalRatio.atThisService)).toBe(six(figure('FF at the BELEMA vapour and critical pressures', { after: from })));
    expect(six(m.criticalRatio.approachingZero)).toBe(six(figure('FF as the vapour pressure approaches zero', { after: from })));
    expect(six(m.criticalRatio.atTheCriticalPoint)).toBe(six(figure('FF at the critical point', { after: from })));
  });

  it('SECTION 20: the gas march, the count, the boundary and the floor', () => {
    const from = sectionAt(20);
    const g = LAB.gasMarch();
    g.rows.forEach((row) => {
      const cells = digestRow(six(row.p2Psia), from);
      expect(six(row.x), `${row.p2Psia} x`).toBe(six(Number(cells[1])));
      expect(six(row.xChoked)).toBe(six(Number(cells[2])));
      expect(six(row.xUsed)).toBe(six(Number(cells[3])));
      expect(six(row.y)).toBe(six(Number(cells[4])));
      expect(six(row.cv)).toBe(six(Number(cells[5])));
      expect(String(row.choked)).toBe(cells[6]);
    });
    expect(g.chokedRowCount).toBe(figure('rows of the gas march above on which the engine reports choked flow:', { after: from }));
    expect(six(g.edge.at)).toBe(six(figure('the gas valve begins to choke at an outlet of, psia', { after: from })));
    expect(six(g.atEdge.xChoked)).toBe(six(figure('the terminal pressure drop ratio there', { after: from })));
    expect(six(g.atEdge.fk)).toBe(six(figure('the specific heat ratio factor there', { after: from })));
    expect(six(g.atEdge.cv)).toBe(six(figure('the coefficient there', { after: from })));
    expect(six(g.expansionFloor)).toBe(six(figure('the expansion factor on every choked row', { after: from })));
  });

  it('THE FLOOR IS MEASURED RATHER THAN CLAIMED: it is the same double on every choked row, one unit in the last place above two thirds', () => {
    // A FINDING AGAINST THE DIGEST'S PROSE. SECTION 20 says the floor is "two
    // thirds to the last bit a double carries". It is not: the engine forms it
    // as one less a quotient, and one less a third is one unit in the last
    // place ABOVE two thirds in a double. The generator's own assertion allowed
    // a difference below 1e-15, which is not bit equality, so the sentence
    // claims more than the check behind it establishes. The lab therefore
    // reports the difference rather than the claim, and this gate pins the
    // measurement in both directions so neither can be quietly reversed.
    const g = LAB.gasMarch();
    expect(g.floorIsTheSameOnEveryChokedRow).toBe(true);
    expect(g.floorIsTwoThirdsExactly).toBe(false);
    expect(g.floorIsOneUlpFromTwoThirds).toBe(true);
    expect(g.floorLessTwoThirdsDerived).toBeGreaterThan(0);
    expect(g.floorLessTwoThirdsDerived).toBeLessThanOrEqual(Number.EPSILON / 2);
  });
});

describe('THE DIGEST GATE: SECTIONS 25, 26 and 27, the tank', () => {
  it('SECTION 25: capacity, working capacity and the exact barrel', () => {
    const from = sectionAt(25);
    const t = LAB.tank();
    expect(four(t.crossSectionFt2)).toBe(four(figure('cross section, ft2', { after: from })));
    expect(four(t.nominalBbl)).toBe(four(figure('nominal capacity, bbl', { after: from })));
    expect(four(t.nominalFt3)).toBe(four(figure('nominal capacity, ft3', { after: from })));
    expect(four(t.workingBbl)).toBe(four(figure('working capacity to the design level, bbl', { after: from })));
    expect(four(t.bblPerFt)).toBe(four(figure('barrels per foot of shell', { after: from })));
    expect(t.ft3PerBbl).toBe(figure('cubic feet in a barrel', { after: from }));
    expect(four(t.capacityRelation.differenceDerived)).toBe(four(figure('difference (first less second)', { after: from })));
    expect(six(t.capacityRelation.ratioDerived)).toBe(six(figure('ratio (first over second)', { after: from })));
  });

  it('SECTION 26: every course, every count, and the gravity the water test stops governing at', () => {
    const from = sectionAt(26);
    const s = LAB.shell();
    s.courses.forEach((c) => {
      const cells = digestRow(String(c.course), from);
      expect(six(c.bottomFt), `course ${c.course}`).toBe(six(Number(cells[1])));
      expect(six(c.headFt)).toBe(six(Number(cells[3])));
      expect(six(c.tDesignIn)).toBe(six(Number(cells[4])));
      expect(six(c.tTestIn)).toBe(six(Number(cells[5])));
      expect(six(c.requiredIn)).toBe(six(Number(cells[6])));
      expect(c.governing).toBe(cells[7]);
    });
    expect(s.count).toBe(figure('courses on this tank:', { after: from }));
    expect(s.testGovernedCount).toBe(figure('courses on this tank the water test governs:', { after: from }));
    expect(s.minimumGovernedCount).toBe(figure('courses on this tank the stated minimum plate governs:', { after: from }));
    expect(six(s.thickestRequiredIn)).toBe(six(figure('its required thickness, in', { after: from })));
    expect(six(s.minimumThicknessIn)).toBe(six(figure('the stated minimum plate thickness, in', { after: from })));
    expect(six(s.waterTestEdge.at)).toBe(six(figure('the water test takes the bottom course below a gravity of', { after: from })));
    s.gravityRows.forEach((row) => {
      const cells = digestRow(six(row.sg), from);
      expect(six(row.requiredIn), `sg ${row.sg}`).toBe(six(Number(cells[3])));
      expect(row.governing).toBe(cells[4]);
    });
  });

  it('SECTION 27: venting in each direction, the governing word, and every RELATION', () => {
    const from = sectionAt(27);
    const v = LAB.venting();
    expect(four(v.thermalInbreathingScfh)).toBe(four(figure('thermal inbreathing, scfh', { after: from })));
    expect(four(v.thermalOutbreathingLowScfh)).toBe(four(figure('thermal outbreathing low volatility, scfh', { after: from })));
    expect(four(v.thermalOutbreathingHighScfh)).toBe(four(figure('thermal outbreathing high volatility, scfh', { after: from })));
    expect(four(v.movementOutbreathingScfh)).toBe(four(figure('movement outbreathing, scfh', { after: from })));
    expect(four(v.movementInbreathingScfh)).toBe(four(figure('movement inbreathing, scfh', { after: from })));
    expect(four(v.outbreathingScfh)).toBe(four(figure('total outbreathing, scfh', { after: from })));
    expect(four(v.inbreathingScfh)).toBe(four(figure('total inbreathing, scfh', { after: from })));
    expect(v.governing).toBe('pressure (outbreathing)');
    const governingLine = DIGEST_LINES.slice(from).find((l) => l.trim().startsWith('governing case'));
    expect(governingLine, 'SECTION 27 prints no governing case line').toBeTruthy();
    expect(governingLine).toContain(v.governing);
    const dirAt = lineOf('RELATION  the two directions on this tank', from);
    expect(four(v.directionRelation.differenceDerived)).toBe(four(figure('difference (first less second)', { after: dirAt })));
    expect(six(v.directionRelation.ratioDerived)).toBe(six(figure('ratio (first over second)', { after: dirAt })));
    const insAt = digestFigure('uninsulated, scfh', { after: from }).line;
    expect(four(v.insulationRelation.first)).toBe(four(figure('uninsulated, scfh', { after: from })));
    expect(four(v.insulationRelation.second)).toBe(four(figure("insulated at the engine's stated credit, scfh", { after: insAt })));
    expect(six(v.insulationRelation.ratioDerived)).toBe(six(figure('ratio (first over second)', { after: insAt })));
    // Anchored to the RELATION's own heading, because SECTION 27 also prints a
    // line called "thermal outbreathing high volatility, scfh" earlier on, and
    // an unanchored label match would read that one instead.
    const volAt = lineOf('RELATION  the movement outbreathing at the same fill rate', from);
    expect(four(v.volatilityRelation.first)).toBe(four(figure('high volatility, scfh', { after: volAt })));
    expect(four(v.volatilityRelation.second)).toBe(four(figure('low volatility, scfh', { after: volAt })));
    expect(six(v.volatilityRelation.ratioDerived)).toBe(six(figure('ratio (first over second)', { after: volAt })));
  });

  it('SECTION 27: the draw rate vacuum takes the case above, found by bisecting the word', () => {
    const from = sectionAt(27);
    const o = LAB.vacuumOnset();
    expect(four(o.edge.at)).toBe(four(figure('vacuum takes the case above a draw rate of, bbl/hr', { after: from })));
    expect(o.edge.discriminates).toBe(true);
    expect(o.edge.readingFrom).toBe('pressure (outbreathing)');
    expect(o.edge.readingTo).toBe('vacuum (inbreathing)');
    o.rows.forEach((row) => {
      const cells = digestRow(four(row.drawBblPerHr), from);
      expect(four(row.inbreathingScfh), `draw ${row.drawBblPerHr}`).toBe(four(Number(cells[1])));
      // This table right-aligns its columns, so on some rows the outbreathing
      // figure and the governing word are separated by a single space and on
      // others by several. Both shapes are handled rather than one assumed.
      const tail = cells.length > 3 ? [cells[2], cells[3]] : /^(\S+)\s+(.+)$/.exec(cells[2]).slice(1);
      expect(four(row.outbreathingScfh), `draw ${row.drawBblPerHr} out`).toBe(four(Number(tail[0])));
      expect(row.governing, `draw ${row.drawBblPerHr} word`).toBe(tail[1]);
    });
  });
});

describe('THE WITHHELD GATE: the two answers this course teaches and never grades', () => {
  it('SECTION 28: the duty is computed and the vent is null, with the exported reason', () => {
    const from = sectionAt(28);
    const f = LAB.fireCase();
    expect(four(f.areaFt2)).toBe(four(figure('wetted area, ft2', { after: from })));
    expect(six(f.effectiveHeightFt)).toBe(six(figure('effective wetted height, ft', { after: from })));
    expect(f.band).toBe('above 2800 ft2');
    expect(four(f.qBtuHr)).toBe(four(figure('fire duty, Btu/hr', { after: from })));
    expect(f.ventScfhAir).toBeNull();
    expect(f.ventWithheld).toBe(true);
    expect(f.reasonIsTheExportedConstant).toBe(true);
    expect(f.ventWithheldReason).toMatch(/factor of about 24/);
  });

  it('THE VENT IS NULL AT EVERY INPUT A PANEL CAN REACH, not only at the teaching tank', () => {
    // A refusal shown at one condition could be a coincidence of that
    // condition. The panel lets a learner drive the diameter and the level
    // anywhere, so the refusal is checked over the whole reachable grid.
    const levels = [1, 4.5, 12, 29.9, 30, 30.1, 48, 140];
    const diameters = [6, 20, 62.4, 130, 400];
    let checked = 0;
    levels.forEach((liquidLevelFt) => diameters.forEach((diameterFt) => {
      const f = LAB.fireCase({ diameterFt, liquidLevelFt });
      expect(f.refused, `${diameterFt} by ${liquidLevelFt}`).toBe(false);
      expect(f.qBtuHr, `${diameterFt} by ${liquidLevelFt} duty`).toBeGreaterThan(0);
      expect(f.ventScfhAir, `${diameterFt} by ${liquidLevelFt} vent`).toBeNull();
      expect(f.ventWithheld).toBe(true);
      expect(f.ventWithheldReason).toBe(LAB.fireBands().withheldReason);
      checked += 1;
    }));
    expect(checked).toBe(levels.length * diameters.length);
  });

  it('SECTION 28: the four bands, and every edge found by bisecting the band NAME', () => {
    const from = sectionAt(28);
    const b = LAB.fireBands();
    expect(b.bands).toHaveLength(figure('fire heat input bands this engine carries:', { after: from }));
    expect(b.everyVentIsNull).toBe(true);
    b.rows.forEach((row) => {
      const cells = digestRow(four(row.wettedFt2), from);
      expect(cells[1], `${row.wettedFt2} band`).toBe(row.band);
      expect(four(row.qBtuHr)).toBe(four(Number(cells[2])));
      expect(cells[3]).toBe('null');
    });
    b.edges.forEach((e) => {
      const cells = digestRow(`${e.from} gives way to ${e.to}`, from);
      expect(four(e.edge.at), `${e.from} to ${e.to}`).toBe(four(Number(cells[1])));
      expect(e.edge.discriminates).toBe(true);
    });
  });

  it('SECTION 16: the withheld straight-run column, at every beta, with its reason', () => {
    const from = sectionAt(16);
    const s = LAB.straightRun();
    expect(s.refusedFittings).toEqual(['twoElbowsDifferentPlanes']);
    expect(s.withheldReasonIsTheEngineConstant).toBe(true);
    const withheldRow = s.rows.find((r) => r.fitting === 'twoElbowsDifferentPlanes');
    withheldRow.cells.forEach((c) => {
      expect(c.withheld).toBe(true);
      expect(c.upstreamDiameters).toBeNull();
      expect(c.downstreamDiameters).toBeNull();
      expect(c.reason).toBe(s.withheldReason);
    });
    // And the answered columns, against the digest's own table.
    s.rows.filter((r) => r.fitting !== 'twoElbowsDifferentPlanes').forEach((r) => {
      const cells = digestRow(r.fitting, from);
      r.cells.forEach((c, i) => expect(c.upstreamDiameters, `${r.fitting} at beta ${c.beta}`).toBe(Number(cells[i + 1])));
    });
    expect(s.ceilingRefusal).toMatch(/is above 0.75/);
    expect(six(s.downstreamEdge.at)).toBe(six(figure('the downstream requirement steps up above a beta of', { after: from })));
  });

  it('SECTION 31: the register is fifteen engine sentences, two of them refusals', () => {
    const from = sectionAt(31);
    const h = LAB.heldRegister();
    expect(h.count).toBe(figure('items in the register above:', { after: from }));
    expect(h.refusalCount).toBe(figure('items in the register that are outright refusals to answer:', { after: from }));
    expect(h.bothRefusalsProved.every((x) => x.holds)).toBe(true);
    h.bothRefusalsProved.forEach((x) => expect(DIGEST, x.claim).toContain(x.claim));
    h.rows.forEach((row) => {
      expect(typeof row.words, `${row.id} carries no engine sentence`).toBe('string');
      expect(row.words.length, `${row.id} carries an empty sentence`).toBeGreaterThan(40);
    });
    expect(new Set(h.rows.map((r) => r.id)).size).toBe(h.count);
  });

  it('NO PANEL PRINTS A BLANK, A ZERO, A DASH OR A PLACEHOLDER FOR A WITHHELD ANSWER', () => {
    const text = panelSource('WithheldExplorer.jsx');
    // The panel names the state, so a reader sees a refusal rather than a
    // failed computation. The word is required to be on the page.
    expect(text).toMatch(/>withheld</);
    expect((text.match(/'withheld'/g) || []).length).toBeGreaterThanOrEqual(2);
    // And the three shapes that would read as a failed computation are absent
    // from the cells that carry a withheld answer.
    expect(text).not.toMatch(/ventScfhAir \|\| 0/);
    expect(text).not.toMatch(/ventScfhAir \?\? 0/);
    expect(text).not.toMatch(/'--'|'-'|'n\/a'/i);
  });
});

describe('THE MEASURED GATE: every constant is read off the engine, never typed', () => {
  const edges = () => {
    const d = LAB.downTheSpan();
    const m = LAB.chokingMarch();
    return [
      ['the small bore boundary', LAB.smallBoreBoundary().edge],
      ['the lower published beta edge', LAB.publishedBetaRange().lower],
      ['the upper published beta edge', LAB.publishedBetaRange().upper],
      ['the trade warning beta', LAB.publishedBetaRange().trade],
      ['the turndown warning reading', d.warningEdge],
      ['the dominance change reading', d.dominanceEdge],
      ['the clear lead reading', d.clearEdge],
      ['the downstream straight-run step', LAB.straightRun().downstreamEdge],
      ['the liquid choking onset', m.chokeEdge],
      ...m.ladder.map((r, i) => [`the regime ladder rung ${i + 1}`, r.edge]),
      ['the gas choking onset', LAB.gasMarch().edge],
      ['the water test gravity', LAB.shell().waterTestEdge],
      ['the vacuum onset draw rate', LAB.vacuumOnset().edge],
      ...LAB.fireBands().edges.map((e) => [`the fire band edge to ${e.to}`, e.edge]),
    ];
  };

  it('EVERY EDGE DISCRIMINATES: the engine gives a different answer either side of it', () => {
    const list = edges();
    expect(list.length).toBeGreaterThanOrEqual(16);
    list.forEach(([label, e]) => {
      expect(e.discriminates, `${label} does not discriminate, so it is not an edge`).toBe(true);
      expect(e.readingAt, `${label} reads the same on both sides of itself`).not.toEqual(e.readingJustPast);
      expect(Number.isFinite(e.at), `${label} is not a finite value`).toBe(true);
      expect(e.halvings).toBe(200);
    });
    // AND NOT ONE OF THEM IS MONOTONE BY ASSUMPTION. At least one predicate in
    // this course reads the same at BOTH ends of its sweep and differs in a
    // band between them, which is why discrimination is measured across the
    // final bracket rather than across the starting one. That case is named
    // here so a change to measuredEdge that reverted to the weaker check
    // fails with a reason rather than silently.
    const nonMonotone = list.filter(([, e]) => e.readingFrom === e.readingTo);
    expect(nonMonotone.map(([label]) => label)).toContain('the clear lead reading');
  });

  it('NEGATIVE CONTROL: a predicate that never flips is reported as not discriminating', () => {
    const blind = LAB.measuredEdge(1, 100, () => 'always the same word');
    expect(blind.discriminates).toBe(false);
    expect(blind.readingFrom).toBe(blind.readingTo);
    // And a bisection on a constant predicate walks to the top of its bracket,
    // which is exactly how a measured constant turns back into a typed one.
    expect(blind.at).toBeCloseTo(100, 6);
  });

  it('NO MEASURED VALUE IS A LITERAL IN THE LAB, except a teaching sweep input the wave declares', () => {
    const src = LAB_SOURCE();
    const waveSrc = fs.readFileSync(FIELDS_MJS, 'utf8');
    const literals = new Set((src.match(/(?<![\w.])\d+(?:\.\d+)?(?![\w.])/g) || []).map(Number));
    const excused = [];
    edges().forEach(([label, e]) => {
      if (!literals.has(e.at)) return;
      // The value IS in the lab source. That is only acceptable when it is one
      // of the wave's own teaching sweep values, copied verbatim, because those
      // are inputs the engine is asked AT rather than answers read off it.
      const inWave = new RegExp(`(?<![\\w.])${String(e.at).replace('.', '\\.')}(?![\\w.])`).test(waveSrc);
      expect(inWave, `${label} is typed into the lab as ${e.at} and the wave does not declare it`).toBe(true);
      excused.push(`${label} at ${e.at}`);
    });
    // RECORDED RATHER THAN HIDDEN, and pinned as an exact set so a new one is
    // a failure here instead of an allowance. Every entry is a sweep value the
    // wave declares, which the engine is asked AT, and which turns out to sit
    // exactly on a band edge. That coincidence is why those sweeps were chosen:
    // a sweep that stepped over an edge would let a table claim a crossing it
    // never showed.
    // eslint-disable-next-line no-console
    console.log('  FC8 measured values that are also declared sweep inputs:', excused.join(' | '));
    expect(excused.sort()).toEqual([
      'the downstream straight-run step at 0.5',
      'the fire band edge to 1000 to 2800 ft2 at 1000',
      'the fire band edge to 200 to 1000 ft2 at 200',
      'the fire band edge to above 2800 ft2 at 2800',
      'the lower published beta edge at 0.1',
      'the small bore boundary at 2.8',
      'the trade warning beta at 0.6',
      'the upper published beta edge at 0.75',
    ].filter((x) => excused.includes(x)));
    expect(excused.length).toBeLessThanOrEqual(8);
  });

  it('THE COST GATE: the measured readers are timed, because this lab measures lazily rather than at import', () => {
    const timings = LAB.MEASURING_READERS.map((name) => {
      const t0 = performance.now();
      LAB[name]();
      return { name, ms: performance.now() - t0 };
    });
    const total = timings.reduce((s, t) => s + t.ms, 0);
    // eslint-disable-next-line no-console
    console.log('  FC8 measured readers, ms:', timings.map((t) => `${t.name} ${t.ms.toFixed(1)}`).join(', '), `| total ${total.toFixed(1)}`);
    expect(timings.every((t) => Number.isFinite(t.ms))).toBe(true);
    expect(total, 'the whole measured surface is slower than a panel render can afford').toBeLessThan(4000);
    // AND NOTHING RUNS AT IMPORT. Every reader is a function and the module
    // body does no engine work, so opening the course page costs nothing.
    expect(LAB.READERS.every((n) => typeof LAB[n] === 'function')).toBe(true);
    expect(LAB.MEASURING_READERS.every((n) => LAB.READERS.includes(n))).toBe(true);
  });
});

describe('THE RELATION GATE: no comparison is made any other way', () => {
  const allRelations = () => {
    const out = [];
    const walk = (v, trail) => {
      if (!v || typeof v !== 'object') return;
      if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${trail}[${i}]`)); return; }
      if ('differenceDerived' in v && 'ratioDerived' in v) out.push([trail, v]);
      Object.entries(v).forEach(([k, x]) => walk(x, `${trail}.${k}`));
    };
    [
      ['meterRun', LAB.meterRun()], ['coefficientSurface', LAB.coefficientSurface()],
      ['smallBoreBoundary', LAB.smallBoreBoundary()], ['downTheSpan', LAB.downTheSpan()],
      ['chokingMarch', LAB.chokingMarch()], ['liquidAt', LAB.liquidAt(40)],
      ['tank', LAB.tank()], ['venting', LAB.venting()],
      ['fireCase', LAB.fireCase({ environmentFactor: 0.3 })],
    ].forEach(([name, r]) => walk(r, name));
    return out;
  };

  it('every relation carries both values, and its difference and ratio are the arithmetic of them', () => {
    const rels = allRelations();
    expect(rels.length, 'the lab states no relations at all').toBeGreaterThanOrEqual(10);
    rels.forEach(([trail, r]) => {
      expect(typeof r.label, `${trail} has no label`).toBe('string');
      expect(typeof r.firstLabel, `${trail} does not name its first value`).toBe('string');
      expect(typeof r.secondLabel, `${trail} does not name its second value`).toBe('string');
      expect(Number.isFinite(r.first), `${trail} first`).toBe(true);
      expect(Number.isFinite(r.second), `${trail} second`).toBe(true);
      expect(r.differenceDerived, `${trail} difference`).toBe(r.first - r.second);
      expect(r.ratioDerived, `${trail} ratio`).toBe(r.first / r.second);
    });
  });

  it('every panel that shows a relation shows all four parts of it', () => {
    const shell = panelSource('MeterRunExplorer.jsx');
    expect(shell).toMatch(/differenceDerived/);
    expect(shell).toMatch(/ratioDerived/);
    expect(shell).toMatch(/firstLabel/);
    expect(shell).toMatch(/secondLabel/);
    // The other three panels import that one component rather than writing a
    // second rendering of a relation, so there is one shape on the screen.
    ['ChokingExplorer.jsx', 'VentingExplorer.jsx', 'WithheldExplorer.jsx'].forEach((f) => {
      expect(panelSource(f), `${f} does not use the shared relation renderer`).toMatch(/Relation/);
    });
  });
});

describe('THE REFUSAL GATE: every refusal is the engine\'s own returned message', () => {
  const scope = LAB.engineScope();
  const all = [...scope.meteringSoftStates, ...scope.valveSoftStates, ...scope.tankSoftStates];

  it('there are refusals to check, so a rename cannot silently empty this gate', () => {
    expect(all.length).toBeGreaterThanOrEqual(50);
    expect(scope.meteringSoftStates.length).toBeGreaterThanOrEqual(18);
    expect(scope.valveSoftStates.length).toBeGreaterThanOrEqual(17);
    expect(scope.tankSoftStates.length).toBeGreaterThanOrEqual(14);
  });

  it('EVERY probe is refused, and each carries a message of its own', () => {
    const silent = all.filter((s) => !s.error).map((s) => s.label);
    expect(silent, `these probes were answered rather than refused: ${silent.join(', ')}`).toEqual([]);
    all.forEach((s) => expect(s.error.length, s.label).toBeGreaterThan(10));
    const distinct = new Set(all.map((s) => s.error));
    expect(distinct.size).toBeGreaterThanOrEqual(30);
  });

  it('NO ENGINE THROWS: every probe returns rather than raising', () => {
    LAB.METERING_SOFT_PROBES.concat(LAB.VALVE_SOFT_PROBES, LAB.TANK_SOFT_PROBES)
      .forEach(([label, fn]) => expect(() => fn(), label).not.toThrow());
  });

  it('NO refusal message is written as a literal in the lab', () => {
    const src = LAB_SOURCE();
    all.forEach((s) => {
      const fragment = s.error.slice(0, 44);
      expect(src.includes(fragment), `the lab types the message "${fragment}"`).toBe(false);
    });
  });

  it('NO refusal message is written as a literal in a panel either', () => {
    PANEL_FILES.forEach((file) => {
      const text = panelSource(file);
      all.forEach((s) => {
        const fragment = s.error.slice(0, 44);
        expect(text.includes(fragment), `${file} types the message "${fragment}"`).toBe(false);
      });
      expect(text.includes(LAB.fireBands().withheldReason.slice(0, 44)), `${file} types the withheld reason`).toBe(false);
    });
  });

  it('CONTROL: a state the engine CAN answer reports no error, so this gate is not reading every call as a refusal', () => {
    expect(LAB.meterRun().refused).toBe(false);
    expect(LAB.liquidAt(171.3).refused).toBe(false);
    expect(LAB.tank().refused).toBe(false);
    expect(LAB.fireCase().refused).toBe(false);
  });

  it('the scope report counts the exports the digest counts', () => {
    const from = sectionAt(1);
    scope.modules.forEach((m) => {
      expect(m.exports, `${m.name} export count`).toBe(figure(`${m.name} exported names:`, { after: from }));
      expect(m.functions.length + m.data.length).toBe(m.exports);
    });
  });
});

describe('THE COPY RULE, over everything a learner reads on a panel', () => {
  // The wave's gate_copy_rule.py sweeps the digest and the lesson bodies. It
  // does not sweep panel sources, so the same rule is enforced here. The five
  // engine strings the gate exempts BY EXACT FRAGMENT are exempted the same way
  // and for the same reason: a paraphrase would teach a sentence the learner
  // will never see on the screen. A panel may not write a contrastive of its
  // own, and none of these fragments is typed into a panel anyway, because
  // every engine sentence on the screen arrives at run time through the lab.
  const ENGINE_TEXT = [
    'these are table values, not a calculation',
    'stated screen, not a value read from a',
    'whether to ask the question, not to',
    'the water test governs this course, not the product',
    'this service is FLASHING, not cavitating',
  ];

  PANEL_FILES.concat(['meteringLab.js']).forEach((file) => {
    it(`${file} carries no em dash and no en dash`, () => {
      expect(panelSource(file)).not.toMatch(/[–—]/);
    });

    it(`${file} writes no contrastive of its own`, () => {
      const text = panelSource(file);
      const hits = [...text.matchAll(/,\s+not\s+\w+/g)]
        .map((m) => ({ hit: m[0], line: text.slice(0, m.index).split('\n').length }))
        .filter(({ line }) => {
          const l = text.split('\n')[line - 1];
          return !ENGINE_TEXT.some((f) => l.includes(f));
        });
      expect(hits.map((h) => `${h.line}: ${h.hit}`), `${file} writes a contrastive`).toEqual([]);
    });

    it(`${file} reads no clock and draws no random number`, () => {
      expect(panelSource(file)).not.toMatch(/new Date\(|Date\.now|Math\.random/);
    });
  });

  PANEL_FILES.forEach((file) => {
    it(`${file} imports no engine directly`, () => {
      // A panel that imported an engine could print a number no gate in this
      // course has ever seen.
      expect(panelSource(file)).not.toMatch(/@petrolord\/engines/);
    });
  });

  it('the panel that shows an engine table value states whose figure it is', () => {
    expect(panelSource('ChokingExplorer.jsx')).toMatch(/styleProvenance/);
    expect(panelSource('VentingExplorer.jsx')).toMatch(/minimumThicknessBasis/);
    expect(panelSource('MeterRunExplorer.jsx')).toMatch(/reynoldsBasis/);
  });
});

describe('THE PURITY GATE: every reader is a pure function of its arguments', () => {
  it('two calls agree, and mutating a result changes neither the next call nor the teaching fields', () => {
    LAB.READERS.forEach((name) => {
      const fn = LAB[name];
      const a = name === 'liquidAt' ? fn(140) : fn();
      const b = name === 'liquidAt' ? fn(140) : fn();
      expect(JSON.stringify(a), `${name} is not deterministic`).toBe(JSON.stringify(b));
      if (a && typeof a === 'object' && !Array.isArray(a)) {
        a.__poison = 'a mutation';
        const c = name === 'liquidAt' ? fn(140) : fn();
        expect(c.__poison, `${name} handed back a shared object`).toBeUndefined();
      }
    });
    expect(Object.isFrozen(LAB.ABOH)).toBe(true);
    expect(Object.isFrozen(LAB.BELEMA)).toBe(true);
    expect(Object.isFrozen(LAB.OGBOGENE)).toBe(true);
    expect(LAB.ABOH.dpInH2O).toBe(63.8);
  });

  it('nothing is memoised: a reader called at two inputs answers for each of them', () => {
    const a = LAB.liquidAt(200);
    const b = LAB.liquidAt(40);
    expect(a.p2Psia).toBe(200);
    expect(b.p2Psia).toBe(40);
    expect(a.choked).toBe(false);
    expect(b.choked).toBe(true);
    expect(LAB.liquidAt(200).cv).toBe(a.cv);
  });

  it('every declared reader exists and every exported function is declared', () => {
    LAB.READERS.forEach((n) => expect(typeof LAB[n], `${n} is declared and missing`).toBe('function'));
    const exportedFns = Object.keys(LAB).filter((k) => typeof LAB[k] === 'function');
    const machinery = ['relation', 'measuredEdge'];
    exportedFns.forEach((n) => {
      if (machinery.includes(n)) return;
      expect(LAB.READERS, `${n} is exported and not declared a reader`).toContain(n);
    });
  });
});

describe('THE CLOCK GATE: no reader reads the system date', () => {
  afterEach(() => vi.useRealTimers());

  const snapshot = () => JSON.stringify(LAB.READERS.map((n) => (n === 'liquidAt' ? LAB[n](140) : LAB[n]())));

  it('identical output under two faked system dates', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('1998-04-11T03:00:00Z'));
    const a = snapshot();
    vi.setSystemTime(new Date('2098-12-25T21:45:00Z'));
    const b = snapshot();
    expect(a).toBe(b);
  });

  it('CONTROL: the fake clock did move, so the gate above was not faking nothing', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('1998-04-11T03:00:00Z'));
    const a = Date.now();
    vi.setSystemTime(new Date('2098-12-25T21:45:00Z'));
    expect(Date.now()).toBeGreaterThan(a);
  });

  it('CONTROL: there is no dated or seeded surface to fake, in the lab or in a panel', () => {
    const strip = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    [LAB_SOURCE(), ...PANEL_FILES.map(panelSource)].forEach((text) => {
      const code = strip(text);
      expect(code).not.toMatch(/new Date\(|Date\.now|Math\.random|performance\.now/);
    });
  });
});
