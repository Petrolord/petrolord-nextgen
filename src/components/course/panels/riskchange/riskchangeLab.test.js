// Every value the AS-RC teaching lab exposes to a panel or to the course page is
// pinned here against the teaching digest (tools/course-waves/riskchange/
// digest.txt), which is itself nothing but the vendored assurance engines' return
// values on the OBODO, ESANMI, IKANG and ONNE teaching registers, read on the
// wave's as-of date.
//
// THE GATES, and every one of them carries a control that was made to FIRE:
//
//   AGREEMENT WITH THE DIGEST  the digest's own tables are PARSED and every row
//                      the lab returns, printed in the digest's conventions, must
//                      equal the digest's row cell for cell. The interactive
//                      functions a panel calls are driven to the digest's probe
//                      states and must give the digest's answers. A planted wrong
//                      cell is proven to fail the comparison.
//   THE VERDICT GATE   every verdict the lab shows is the engine's own: each one,
//                      printed as the digest prints it (REFUSED with the sentence,
//                      or ALLOWED), is a whole line of the digest, and no refusal
//                      sentence is retyped in any source.
//   THE AS-OF GATE     every call the lab makes to a function that takes a date
//                      hands it T(), the as-of date. The date takers are READ OFF
//                      the digest's Section 1, which read them off the engine
//                      signatures, and a planted call without the date is caught.
//   THE CLOCK GATE     the whole lab AND all three panels in every mode render
//                      byte-identical under two faked system dates. A control
//                      proves the clock moved, and a second proves an engine call
//                      that falls back to its clock DOES differ under the same
//                      two dates, so the gate can fire.
//   THE NON-UTC GATE   the whole lab snapshot is rebuilt in a child process at
//                      Pacific/Pago_Pago, UTC minus eleven, and must be
//                      byte-identical. The child proves its offset and proves the
//                      zone bites by reading a date string as a UTC instant, which
//                      lands on the day before there: the negative control.
//   THE RENDER GATE    every mode of every panel renders with NOTHING, and with a
//                      refusal-shaped object on every prop, and produces markup
//                      either way.
//   THE COPY RULE      no em dash, no en dash, no double hyphen and no "X, not Y"
//                      contrastive, over the sources AND over every string the lab
//                      hands a panel.
//   THE PROSE SWEEP    the lab's and the panels' own comments, swept for repair
//                      history presented as current behaviour.
//
// PORTABILITY. Every wave input is read through tools/course-waves/waveInputs.mjs,
// which THROWS and names the file when an input is missing. There is no /root/
// path in this file, no existsSync guarding a read and no skip of any kind.
// The suite reads the lab's readers by NAME off READERS, so import/namespace
// cannot validate those members statically; it is off for this file only, and
// the purity block below proves every name resolves.
/* eslint-disable import/namespace */
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
import * as L from './riskchangeLab.js';
import {
  waveDir, waveInput, mirrorDir, liveWaveDir, readingMirror, WAVES,
} from '../../../../../tools/course-waves/waveInputs.mjs';
import * as WAVE_FIELDS from '../../../../../tools/course-waves/riskchange/riskchange_fields.mjs';
import * as RS from '@petrolord/engines/engines/assurance/riskScoring.js';
import RiskExplorer, * as RX from './RiskExplorer.jsx';
import ChangeExplorer, * as CX from './ChangeExplorer.jsx';
import ReviewExplorer, * as VX from './ReviewExplorer.jsx';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

const WAVE_NAME = 'riskchange';
const WAVE = waveDir(WAVE_NAME);
const MIRROR = mirrorDir(WAVE_NAME);
const LIVE_WAVE = liveWaveDir(WAVE_NAME);
const DIGEST = fs.readFileSync(waveInput(WAVE_NAME, 'digest.txt'), 'utf8');
const FIELDS = JSON.parse(fs.readFileSync(waveInput(WAVE_NAME, 'fields.json'), 'utf8'));
const FIELDS_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'riskchange_fields.mjs'), 'utf8');
const DUMP_MJS = fs.readFileSync(waveInput(WAVE_NAME, 'riskchange_dump.mjs'), 'utf8');
const LINES = DIGEST.split('\n');

const LAB_FILE = 'riskchangeLab.js';
const PANEL_FILES = ['RiskExplorer.jsx', 'ChangeExplorer.jsx', 'ReviewExplorer.jsx'];
const SHARED_FILES = ['panelBits.jsx'];
const PAGE = 'RiskChangeLearningPage.jsx';
const PAGE_PATH = path.resolve(ROOT, 'src/pages/apps', PAGE);

/** A source file, or a FAILURE NAMING IT: a renamed file fails rather than emptying a gate. */
const sourceOf = (file) => {
  const p = file === PAGE ? PAGE_PATH : path.join(HERE, file);
  if (!fs.existsSync(p)) {
    throw new Error(`source missing: ${file} is named in this suite's file list and is not at ${p}.`);
  }
  return fs.readFileSync(p, 'utf8');
};
const ALL_SOURCES = [LAB_FILE, ...SHARED_FILES, ...PANEL_FILES, PAGE];

// ---------------------------------------------------------------------------
// Reading the digest: its tables, its verdict lines, and its conventions.
// ---------------------------------------------------------------------------

const cellsOf = (line) => line.slice(2, -2).split(' | ');

/** The rows of the nth table in the digest whose header line is exactly `header`. */
const table = (header, nth = 0) => {
  let seen = -1;
  for (let i = 0; i < LINES.length; i += 1) {
    if (LINES[i] === header) {
      seen += 1;
      if (seen === nth) {
        const rows = [];
        for (let j = i + 2; j < LINES.length && LINES[j].startsWith('| '); j += 1) rows.push(cellsOf(LINES[j]));
        return rows;
      }
    }
  }
  throw new Error(`the digest has no table headed "${header}" (occurrence ${nth + 1})`);
};

/** Compare lab rows with digest rows cell for cell; the mismatches, named. */
const diffRows = (labRows, digestRows) => {
  const out = [];
  if (labRows.length !== digestRows.length) out.push(`row count: lab ${labRows.length}, digest ${digestRows.length}`);
  labRows.forEach((r, i) => {
    const d = digestRows[i] || [];
    r.forEach((c, j) => { if (String(c) !== d[j]) out.push(`row ${i + 1} cell ${j + 1}: lab "${c}", digest "${d[j]}"`); });
  });
  return out;
};

const expectTable = (header, labRows, nth = 0) => {
  expect(diffRows(labRows, table(header, nth)), `the lab disagrees with the digest table ${header}`).toEqual([]);
};

const J = (v) => JSON.stringify(v);
const { q, yn, lst } = L;
const nul = (v) => (v === null || v === undefined ? 'null' : String(v));

/** A verdict as the digest prints it, as a whole line. */
const lineOf = (v) => (v.ok ? `- ALLOWED, ${v.label}.` : `- REFUSED, ${v.label}: ${v.reason}`);
const hasLine = (line) => LINES.includes(line);

/** Every reader's return value, in one object. The whole teaching surface. */
const teachingSurface = () => Object.fromEntries(L.READERS.map((name) => {
  if (typeof L[name] !== 'function') throw new Error(`READERS names ${name} and the lab exports no such function`);
  return [name, L[name]()];
}));

/** Every panel in every mode, rendered to markup. */
const panelMarkup = () => [
  ...RX.MODES.map(([m]) => renderToStaticMarkup(React.createElement(RiskExplorer, { initialMode: m }))),
  ...CX.MODES.map(([m]) => renderToStaticMarkup(React.createElement(ChangeExplorer, { initialMode: m }))),
  ...VX.MODES.map(([m]) => renderToStaticMarkup(React.createElement(ReviewExplorer, { initialMode: m }))),
].join('\n');

const snapshot = () => JSON.stringify(teachingSurface());

// ---------------------------------------------------------------------------

describe('the lab, the digest and the committed wave inputs', () => {
  it('the digest is whole: every section, and the as-of date in its header', () => {
    expect(LINES.length).toBeGreaterThan(600);
    for (let s = 1; s <= 20; s += 1) expect(DIGEST, `SECTION ${s} is missing`).toContain(`# SECTION ${s}:`);
    expect(DIGEST).toContain(`THE AS-OF DATE FOR EVERY LINE BELOW IS ${L.AS_OF_ISO}`);
  });

  it('THE MIRROR GATE: the committed copy is the wave, and this gate says which it compared', () => {
    const named = WAVES[WAVE_NAME].inputs;
    expect(named.length).toBeGreaterThanOrEqual(20);
    named.forEach((f) => expect(fs.existsSync(path.join(WAVE, f)), `${f} is missing from ${WAVE}`).toBe(true));
    if (LIVE_WAVE) {
      const differing = named.filter((f) => {
        const live = path.join(LIVE_WAVE, f);
        return !fs.existsSync(live) || !fs.readFileSync(path.join(MIRROR, f)).equals(fs.readFileSync(live));
      });
      // eslint-disable-next-line no-console
      console.log(`[mirror gate] byte-compared ${named.length} inputs against the LIVE wave directory ${LIVE_WAVE}`);
      expect(differing, `the committed copy has drifted from ${LIVE_WAVE}`).toEqual([]);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[mirror gate] there is NO live wave directory on this machine, so the committed copy at ${MIRROR} was checked for completeness instead`);
      expect(readingMirror(WAVE_NAME)).toBe(true);
    }
  });

  it('the teaching fields are the wave file\'s, byte for byte, and riskchange_dump.mjs reads that file', () => {
    const block = FIELDS_MJS.slice(FIELDS_MJS.indexOf('export const AS_OF_PARTS'));
    expect(block.length, 'the wave fields block is almost empty').toBeGreaterThan(10000);
    expect(sourceOf(LAB_FILE).includes(block), 'the lab no longer carries the wave fields block verbatim').toBe(true);
    expect(DUMP_MJS).toContain('riskchange_fields.mjs');
  });

  it('and they AGREE AS VALUES when both are imported and run', () => {
    const names = Object.keys(WAVE_FIELDS).filter((k) => k !== 'default');
    expect(names.length).toBe(23);
    const differing = names.filter((k) => JSON.stringify(typeof L[k] === 'function' ? L[k]() : L[k])
      !== JSON.stringify(typeof WAVE_FIELDS[k] === 'function' ? WAVE_FIELDS[k]() : WAVE_FIELDS[k]));
    expect(differing).toEqual([]);
  });

  it('the lab names no graded field and no capstone register', () => {
    const lab = sourceOf(LAB_FILE);
    expect(FIELDS).toHaveLength(18);
    FIELDS.forEach(([, key]) => expect(lab).not.toContain(key));
    ['IGBARA', 'OKOMU', 'ETIM'].forEach((n) => expect(lab.toUpperCase()).not.toContain(n));
    expect(lab).not.toContain('riskchange_fields_capstone');
  });
});

// ---------------------------------------------------------------------------
// AGREEMENT WITH THE DIGEST, table by table.
// ---------------------------------------------------------------------------

describe('AGREEMENT WITH THE DIGEST: the Associate readers (Sections 1 to 6)', () => {
  it('Section 1: the export census of the five modules', () => {
    const rows = table('| module | exports | functions | frozen tables and constants | functions that take a date |');
    expect(L.engineCensus().map((c) => [c.module, c.exports, c.functions, c.constants]))
      .toEqual(rows.map((r) => [r[0], Number(r[1]), Number(r[2]), Number(r[3])]));
  });

  it('Section 2: the bands, the twenty five cells, the counts and the scores no cell holds', () => {
    const s = L.riskScale();
    expectTable('| band | lower edge | upper edge as written |', s.bands.map((b) => [q(b.band), b.lowerEdge, b.upperAsWritten]));
    const m = L.riskMatrix();
    expectTable('| likelihood \\ impact | 1 | 2 | 3 | 4 | 5 |', m.rows.map((r) => [r.likelihood, ...r.cells.map((c) => `${c.score} ${c.band}`)]));
    expect(hasLine(`- Cells in each band, counted from the grid above: ${s.bandNames.map((b) => `${q(b)} ${m.bandCellCounts[b]}`).join(', ')}.`)).toBe(true);
    expect(DIGEST).toContain(`The grid holds ${m.distinctScores.length} distinct scores. Of the whole numbers from ${s.scaleMin} to ${m.top}, ${m.unreachable.length} are in no cell, because no two whole levels on this scale multiply to them: ${m.unreachable.join(', ')}.`);
    expect(m.strip.filter((x) => x.lowerEdge).map((x) => x.score)).toEqual(s.bands.map((b) => b.lowerEdge).sort((a, b) => a - b));
    expect(m.strip.filter((x) => x.unreachable).map((x) => x.score)).toEqual(m.unreachable);
    expectTable('| score | band |', L.bandProbes().map((p) => [p.score, q(p.band)]));
    expectTable('| the likelihood given | as | impact | score | band |',
      L.levelProbes().map((p) => [p.what, J(p.likelihood), J(p.impact), p.score, q(p.band)]));
  });

  it('Section 3: the residual probes and the appetite probes', () => {
    expectTable('| residual probe (inherent likelihood 4, impact 5) | residual likelihood given | residual impact given | residual score | residual band |',
      L.residualProbes().map((p) => [p.label, J(p.residualLikelihood), J(p.residualImpact), p.score, q(p.band)]));
    expectTable('| appetite probe | residual score | target | appetite |',
      L.appetiteProbes().map((p) => [p.label, p.residual, J(p.target), q(p.appetite)]));
  });

  it('Section 3, INTERACTIVE: residualAt driven to every residual probe gives the digest\'s answer', () => {
    const toChoice = (v) => (v === null || v === '' ? '' : String(v));
    const digest = table('| residual probe (inherent likelihood 4, impact 5) | residual likelihood given | residual impact given | residual score | residual band |');
    L.RESIDUAL_PROBES.forEach(([, r], i) => {
      const at = L.residualAt(toChoice(r.residual_likelihood), toChoice(r.residual_impact), '');
      expect([String(at.residualScore), q(at.residualBand)]).toEqual([digest[i][3], digest[i][4]]);
    });
    // THE BLANK AND THE OFF-SCALE VALUE DO DIFFERENT THINGS, visibly.
    const blank = L.residualAt('2', '', '');
    const off = L.residualAt('2.5', '3', '');
    expect(blank.axes[1]).toMatchObject({ kind: 'blank', fallsBack: true });
    expect(blank.residualScore).toBe(10);
    expect(off.axes[0]).toMatchObject({ kind: 'off the scale', fallsBack: false });
    expect(off.unscored).toBe(true);
    // Every choice the panel offers is one the engine classifies, and the two
    // off-scale values are the digest's own.
    const kinds = L.residualInputChoices().map((c) => L.residualAt(c.value, c.value, '').axes[0].kind);
    expect([...new Set(kinds)].sort()).toEqual(['blank', 'level', 'off the scale']);
    expect(L.residualInputChoices().filter((c) => c.label.includes('off the scale')).map((c) => c.value)).toEqual(['2.5', '7']);
  });

  it('Section 3, INTERACTIVE: appetite against a target, "Not set" included', () => {
    const digest = table('| appetite probe | residual score | target | appetite |');
    const cases = [['2', '3', '8'], ['2', '4', '8'], ['3', '3', '8'], ['2', '3', ''], ['2', '3', '0'], ['2.5', '3', '8']];
    cases.forEach(([l, i, t], k) => {
      const at = L.residualAt(l, i, t);
      expect([String(at.residualScore), q(at.appetite)], `appetite case ${k + 1}`).toEqual([digest[k][1], digest[k][3]]);
    });
    expect(L.residualAt('2', '3', '').appetiteNotSet).toBe(true);
    expect(L.targetChoices()[0]).toEqual({ value: '', label: 'no target' });
  });

  it('Section 4: whole days from the as-of date, and the OBODO review table', () => {
    expectTable('| date given | as | parsed | days until |',
      L.calendarProbes().map((c) => [c.label, J(c.given), nul(c.parsed), nul(c.days)]));
    expectTable('| risk | status | next review | days until | review overdue |',
      L.obodoRegister().map((r) => [r.id, q(r.status), nul(r.nextReview), nul(r.daysUntil), yn(r.reviewOverdue)]));
  });

  it('Section 5: the register derived once, and its four populations', () => {
    expectTable('| risk | status | L | I | inherent | inherent band | residual L | residual I | residual | residual band | target | appetite |',
      L.obodoRegister().map((r) => [r.id, q(r.status), r.likelihood, r.impact, r.inherentScore, q(r.inherentBand),
        J(r.residualLikelihood), J(r.residualImpact), r.residualScore, q(r.residualBand), J(r.target), q(r.appetite)]));
    const pops = L.registerPopulations();
    expectTable('| population | "Critical" | "High" | "Medium" | "Low" | "None" |',
      pops.rows.map((p) => [p.label, ...p.counts.map((c) => c.count)]));
    expect(DIGEST).toContain(`- The register holds ${pops.risks} risks and ${pops.live} of them are live.`);
    expect(DIGEST).toContain(`Critical counts of ${pops.criticalCounts.join(', ')} across those four rows, ${pops.distinctCritical} different values`);
    // THE TWO SWITCHES: each combination is one click, and the four Critical
    // counts are the digest's.
    const four = L.POPULATION_CHOICES.flatMap(([p]) => L.SCORE_CHOICES.map(([s]) => L.registerCount(p, s).critical));
    expect(four).toEqual(pops.criticalCounts);
  });

  it('Section 6: the Associate reading, read back line by line', () => {
    const a = L.associateReading();
    expect(hasLine(`- Live risks above appetite: ${a.above.length} (${lst(a.above)}). Within: ${a.within.length} (${lst(a.within)}). Not set: ${a.notSet.length} (${lst(a.notSet)}).`)).toBe(true);
    expect(hasLine(`- Live risks whose review is overdue on ${L.AS_OF_ISO}: ${a.reviewOverdue.length} (${lst(a.reviewOverdue)}). OB-01 is due on the as-of date itself and is not among them.`)).toBe(true);
    const red = L.obodoRegister().filter((r) => r.live).map((r) => `${r.id} ${r.reductionDerived}`).join(', ');
    expect(DIGEST).toContain(`(derived, the two engine scores subtracted): ${red}.`);
  });
});

describe('AGREEMENT WITH THE DIGEST: the Professional readers (Sections 7 to 12)', () => {
  it('Section 7: the stage table, and every stage move the engine allows or refuses', () => {
    const t = L.stageTable();
    expectTable('| from | legal next stages |', t.transitions.map((x) => [q(x.from), lst(x.next.map(q))]));
    // INTERACTIVE: from every stage, the moves the panel shows as allowed are
    // exactly the digest's legal next stages, and every refusal from a stage is
    // one sentence the digest prints for a move from that stage.
    const legal = Object.fromEntries(table('| from | legal next stages |').map((r) => [r[0], r[1]]));
    t.stages.forEach((st) => {
      const moves = L.stageMovesFrom(st);
      expect(lst(moves.filter((m) => m.ok).map((m) => q(m.to)))).toBe(legal[q(st)]);
    });
    const refusedLines = LINES.filter((l) => l.startsWith('- REFUSED, ') && / change (?:in \w+ can only move to|is final)/.test(l));
    expect(refusedLines.length).toBe(5);
    expect(L.stageMovesFrom('Review').find((m) => m.to === 'Closed').reason).toBe(refusedLines[0].split(': ').slice(1).join(': '));
    expect(L.stageMovesFrom('Closed').every((m) => !m.ok && DIGEST.includes(m.reason))).toBe(true);
  });

  it('Section 8: the approval sets', () => {
    expectTable('| approval set | levels | outstanding | rejected rows | complete |',
      L.approvalSets().map((s) => [s.label, lst(s.levels.map(String)), lst(s.outstanding.map(String)), s.rejectedRows, yn(s.complete)]));
  });

  it('Sections 8 and 9, INTERACTIVE: the approval workbench follows the engine, and refuses the wrong person', () => {
    let rows = L.approvalStart();
    let v = L.approvalView(rows);
    expect([v.levels, v.outstanding, v.complete]).toEqual([[1, 2, 3], [2, 3], false]);
    // The gate on ES-01 as it stands is the digest's sentence.
    expect(hasLine(lineOf({ ...v.gate, label: 'ES-01 into Implementation as it stands, levels 2 and 3 unsigned' }))).toBe(true);
    // u-halima deciding the level 2 row assigned to u-emeka: refused, nothing changes.
    let r = L.decideApproval(rows, 1, 'sign', 'u-halima');
    expect(r.ok).toBe(false);
    expect(DIGEST).toContain(`u-halima deciding an approval assigned to u-emeka: ${r.reason}`);
    expect(r.rows).toEqual(rows);
    r = L.decideApproval(rows, 1, 'sign', '');
    expect(DIGEST).toContain(`- REFUSED, nobody signed in: ${r.reason}`);
    // u-emeka signs; the levels follow.
    r = L.decideApproval(rows, 1, 'sign', 'u-emeka');
    expect(r.ok).toBe(true);
    rows = r.rows;
    v = L.approvalView(rows);
    expect([v.outstanding, v.complete]).toEqual([[3], false]);
    // Deciding it again is refused in the engine's words.
    r = L.decideApproval(rows, 1, 'reject', 'u-emeka');
    expect(DIGEST).toContain(`deciding an approval that is already Approved: ${r.reason}`);
    // The originator cannot be given a level.
    r = L.addApprovalLevel(rows, 'u-chika');
    expect(DIGEST).toContain(`assigning the originator as an approver: ${r.reason}`);
    r = L.addApprovalLevel(rows, '');
    expect(DIGEST).toContain(`- REFUSED, assigning nobody: ${r.reason}`);
    // A new level, then a delegation that leaves it outstanding, then a rejection.
    r = L.addApprovalLevel(rows, 'u-ngozi');
    expect(r.ok).toBe(true);
    rows = r.rows;
    expect(L.approvalView(rows).outstanding).toEqual([3, 4]);
    rows = L.decideApproval(rows, 3, 'delegate', 'u-ngozi').rows;
    expect(L.approvalView(rows).outstanding).toEqual([3, 4]);
    rows = L.decideApproval(rows, 2, 'sign', 'u-halima').rows;
    expect(L.approvalView(rows).outstanding).toEqual([4]);
    const rej = L.decideApproval(L.approvalStart(), 2, 'reject', 'u-halima');
    expect(L.approvalView(rej.rows).rejectedRows).toBe(1);
    expect(DIGEST).toContain(L.approvalView(rej.rows).gate.reason);
  });

  it('Sections 9, 10 and 11: every verdict line the lab carries is a whole digest line', () => {
    [...L.segregationProbes(), ...L.gateProbes(), ...L.ratificationCases().probes, ...L.stageProbes()]
      .forEach((v) => expect(hasLine(lineOf(v)), `not in the digest: ${lineOf(v)}`).toBe(true));
  });

  it('Section 10: the actions that block each gate, asked of the engine', () => {
    const b = L.gateBlockers();
    expect(b.map((g) => [g.gate, g.rows.filter((r) => r.blocks).map((r) => r.actionType)])).toEqual([
      ['Implementation', ['Pre-implementation']],
      ['Closed', ['Implementation', 'Post-implementation']],
    ]);
    // The blocking sentences are the digest's shapes.
    expect(DIGEST).toContain(b[0].rows[0].reason);
  });

  it('Section 11: the expiry sweep, the lead drawn inclusively, and the types table', () => {
    expectTable('| expiry date | days until | expiry state |', L.expirySweep().map((e) => [e.expiryDate, e.days, q(e.state)]));
    const lead = L.expiryLead();
    expect([lead.leadDays, lead.first, lead.last, lead.days]).toEqual([14, 0, 14, 15]);
    expect(DIGEST).toContain(`EXPIRY_LEAD_DAYS, ${lead.leadDays} days, counted inclusively`);
    const t = L.expiryAcrossTypes();
    expectTable('| type | stage | expiry state | counted expired |', t.rows.map((r) => [q(r.type), q(r.stage), q(r.state), yn(r.countedExpired)]));
    expect(DIGEST).toContain(`- An expiry that cannot be read is no expiry: ${q(t.unreadable)} for a Temporary change`);
    expect(hasLine(`- Expiry states: ${L.expiryRules().states.map(q).join(', ')}. The lead before an expiry starts reading "Expiring soon" is EXPIRY_LEAD_DAYS, 14 days, counted inclusively.`)).toBe(true);
    // Every one of the six states is reachable from this panel or its types table.
    const seen = new Set([...L.expiryTimeline().map((e) => e.state), ...t.rows.map((r) => r.state)]);
    expect(seen.size).toBe(6);
  });

  it('Section 11: ratification, day seven inside the window and day eight outside it', () => {
    expectTable('| implemented on | days since | ratification due | state |',
      L.ratificationSweep().map((r) => [r.implementedOn, r.daysSince, r.dueDate, q(r.state)]));
    expect(L.ratificationWindow()).toEqual({ ratifyDays: 7, lastInside: 7, firstOutside: 8 });
    const c = L.ratificationCases();
    expect(hasLine(`- With no implementation date recorded: due ${nul(c.noDate.dueDate)}, ${q(c.noDate.state)}. The window cannot be shown to be open, so it fails closed.`)).toBe(true);
    expect(hasLine(`- Every level signed: ${q(c.allSigned)}, however long ago it went in.`)).toBe(true);
    expect(hasLine(`- A Temporary change: ${q(c.temporary)}. Ratification belongs to the emergency route alone.`)).toBe(true);
  });

  it('Section 12: the ESANMI register, the action log, the summary and the urgency order', () => {
    expectTable('| change | type | stage | target | expiry | expiry state | overdue | ratification | due |',
      L.esanmiRegister().map((r) => [r.id, q(r.type), q(r.stage), r.target, nul(r.expiry), q(r.expiryState), yn(r.overdue), q(r.ratification), nul(r.due)]));
    expectTable('| action | change | type | status | due |', L.esanmiActions().map((a) => [a.id, a.change, q(a.type), q(a.status), a.due]));
    const s = L.esanmiSummary();
    expectTable('| count | value |', s.counts.map((c) => [c.key, c.value]), 0);
    expect(hasLine(`- By stage: ${s.byStage.map((x) => `${q(x.stage)} ${x.count}`).join(', ')}.`)).toBe(true);
    expect(hasLine(`- By risk level: ${s.byRisk.map((x) => `${q(x.level)} ${x.count}`).join(', ')}.`)).toBe(true);
    expect(hasLine(`- ${s.urgency.join(', ')}`)).toBe(true);
  });
});

describe('AGREEMENT WITH THE DIGEST: the Expert readers (Sections 13 to 17)', () => {
  it('Section 13: the transitions, every refused move, and the count of legal pairs', () => {
    const r = L.commentRules();
    expectTable('| from | legal next statuses | who makes each move |',
      r.transitions.map((t) => [q(t.from), lst(t.moves.map((m) => q(m.to))), lst(t.moves.map((m) => `${m.to} by the ${m.actor}`))]));
    const grid = L.commentMoveGrid();
    const refused = grid.filter((g) => !g.ok);
    refused.forEach((g) => expect(hasLine(lineOf(g)), `not in the digest: ${lineOf(g)}`).toBe(true));
    expect(refused.length).toBe(LINES.filter((l) => /^- REFUSED, (?:\w+ to \w+|Responded to Verified with|a comment with no status)/.test(l)).length);
    expect(hasLine(`- Of the ${r.pairs} ordered pairs of statuses, ${r.legalPairs} are legal moves.`)).toBe(true);
  });

  it('Section 14: IK-01\'s log, its closure, its counts and its order', () => {
    const v = L.commentLogView(L.commentLogStart());
    expectTable('| comment | severity | status | resolved | blocking |',
      v.rows.map((c) => [c.id, c.severity === null ? 'none' : q(c.severity), q(c.status), yn(c.resolved), yn(c.blocking)]));
    expect(hasLine(lineOf(v.closure))).toBe(true);
    expect(hasLine(`- The blocking comments are ${lst(v.blocking)}: ${v.blocking.length} in all.`)).toBe(true);
    expect(DIGEST).toContain(`totalComments ${v.totalComments}, openComments ${v.openComments}, blockingComments ${v.blockingComments}. By status: ${v.byStatus.map((x) => `${q(x.status)} ${x.count}`).join(', ')}. By severity: ${v.bySeverity.map((x) => `${q(x.severity)} ${x.count}`).join(', ')}.`);
    expect(DIGEST).toContain(`(bySeverityThenAge): ${v.order.join(', ')}.`);
    [...L.closureProbes(), ...L.actOnCommentProbes(), ...L.participantProbes()]
      .forEach((p) => expect(hasLine(lineOf(p)), `not in the digest: ${lineOf(p)}`).toBe(true));
  });

  it('Section 14, INTERACTIVE: the ACTING-AS switch puts the segregation refusal one click away', () => {
    const [author, independent, nobody] = L.reviewActors();
    const start = L.commentLogStart();
    let r = L.moveComment(start, 'C-03', 'Verified', author.id);
    expect(r.ok).toBe(false);
    expect(DIGEST).toContain(`the author verifying C-03, a Responded comment on their own work: ${r.reason}`);
    expect(r.comments).toEqual(start);
    r = L.moveComment(start, 'C-03', 'Verified', nobody.id);
    expect(DIGEST).toContain(`nobody signed in, verifying C-03: ${r.reason}`);
    r = L.moveComment(start, 'C-01', 'Closed', independent.id);
    expect(hasLine(`- REFUSED, Open to Closed: ${r.reason}`)).toBe(true);
    // The independent reviewer verifies C-03, and the blocking list follows.
    r = L.moveComment(start, 'C-03', 'Verified', independent.id);
    expect(r.ok).toBe(true);
    expect(L.commentLogView(r.comments).blocking).toEqual(['C-01', 'C-04']);
    // The author responds to C-01, which then carries a response and can be verified.
    let log = L.moveComment(r.comments, 'C-01', 'Responded', author.id).comments;
    log = L.moveComment(log, 'C-01', 'Verified', independent.id).comments;
    log = L.moveComment(log, 'C-04', 'Withdrawn', independent.id).comments;
    const after = L.commentLogView(log);
    expect(after.blocking).toEqual([]);
    expect(after.closure.ok).toBe(true);
  });

  it('Section 14, INTERACTIVE: the reviewer panel refuses the author as Reviewer or Lead Reviewer', () => {
    const digestReason = (label) => LINES.find((l) => l.startsWith(`- REFUSED, ${label}: `)).split(': ').slice(1).join(': ');
    expect(L.assignReviewer('author', 'Reviewer').reason).toBe(digestReason('the author of the work, as a Reviewer'));
    expect(L.assignReviewer('author', 'Lead Reviewer').reason).toBe(digestReason('the author of the work, as the Lead Reviewer'));
    expect(L.assignReviewer('author', '').reason).toBe(digestReason('the author of the work, with no role given'));
    expect(L.assignReviewer('author', 'Observer').ok).toBe(true);
    expect(L.assignReviewer('independent', 'Lead Reviewer').ok).toBe(true);
    expect(L.assignReviewer('external', 'Reviewer').ok).toBe(true);
    expect(L.assignReviewer('nobody', 'Reviewer').reason).toBe(digestReason('nobody named at all'));
    expect(L.reviewerRoles().map((r) => r.value)).toEqual(['Lead Reviewer', 'Reviewer', 'Observer', '']);
  });

  it('Section 14: the IKANG register, and a Cancelled review\'s comments in the totals only', () => {
    const k = L.ikangReviews();
    expectTable('| review | stage | due | overdue |', k.rows.map((r) => [r.id, q(r.stage), r.due, yn(r.overdue)]));
    expect(DIGEST).toContain(`- Reviews ${k.total}, active ${k.active}, overdue ${k.overdue}.`);
    expect(hasLine(`- byUrgency: ${k.urgency.join(', ')}.`)).toBe(true);
    const s = L.registerSummary();
    expectTable('| comment | review | review stage | severity | status | blocking on its own |',
      s.others.map((c) => [c.id, c.review, q(c.reviewStage), q(c.severity), q(c.status), yn(c.blockingOnItsOwn)]));
    expect(hasLine(`- summarise over all five reviews and all ${s.comments} comments: totalComments ${s.totalComments}, open ${s.openComments}, blocking ${s.blockingComments}.`)).toBe(true);
    // INTERACTIVE: IK-04 moved to a live stage, and its two comments count again,
    // while the total does not move.
    const live = L.registerSummaryAt('In Review');
    expect(live.totalComments).toBe(s.totalComments);
    expect(live.openComments).toBe(s.openComments + 2);
    expect(live.blockingComments).toBe(s.blockingComments + 2);
  });

  it('Section 15: the lesson table and validation', () => {
    expectTable('| lesson | status | substance | missing | accepted | visible |',
      L.lessonTable().map((l) => [l.id, q(l.status), yn(l.substance), lst(l.missing), yn(l.accepted), yn(l.visible)]));
    L.validationProbes().forEach((v) => expect(hasLine(lineOf(v)), `not in the digest: ${lineOf(v)}`).toBe(true));
  });

  it('Section 16: the application log, the reuse records, embedding, transitions and what an application carries', () => {
    expectTable('| application | lesson | target | outcome | applied on |',
      L.applicationLog().map((a) => [a.id, a.lesson, q(a.target), q(a.outcome), a.appliedOn]));
    expectTable('| lesson | total | applied | adopted | adapted | rejected | last applied on | targets changed |',
      L.reuseRecords().map((r) => [r.id, r.total, r.applied, r.adopted, r.adapted, r.rejected, nul(r.lastAppliedOn), lst(r.targets.map(q))]));
    expectTable('| from | legal next statuses |', L.lessonRules().transitions.map((t) => [q(t.from), lst(t.next.map(q))]));
    [...L.embeddingProbes(), ...L.applicationProbes()]
      .forEach((v) => expect(hasLine(lineOf(v)), `not in the digest: ${lineOf(v)}`).toBe(true));
  });

  it('Section 16, INTERACTIVE: an application follows into the reuse record, and a rejection applies nothing', () => {
    // ON-04, applied nowhere: the embedding refusal is the digest's.
    let use = L.lessonUse('ON-04', []);
    expect(DIGEST).toContain(`ON-04 marked Embedded, with no application at all: ${use.embed.reason}`);
    expect(use.unapplied).toBe(true);
    // A rejection is recorded, counted, and applies nothing.
    let r = L.recordApplication('ON-04', [], 'Training', 'Rejected');
    expect(r.ok).toBe(true);
    use = L.lessonUse('ON-04', r.added);
    expect([use.reuse.total, use.reuse.applied, use.reuse.rejected, use.reuse.lastAppliedOn]).toEqual([1, 0, 1, null]);
    expect(use.unapplied).toBe(true);
    expect(DIGEST).toContain(use.embed.reason);
    // An adoption changes something: applied, the last applied date and embedding follow.
    r = L.recordApplication('ON-04', r.added, 'Procedure', 'Adopted');
    use = L.lessonUse('ON-04', r.added);
    expect([use.reuse.applied, use.reuse.lastAppliedOn, use.embed.ok, use.unapplied]).toEqual([1, L.AS_OF_ISO, true, false]);
    // On ON-01, a later rejection leaves the last applied date where the digest has it.
    const on01 = L.lessonUse('ON-01', L.recordApplication('ON-01', [], 'Procedure', 'Rejected').added);
    expect(on01.reuse.lastAppliedOn).toBe(L.reuseRecords().find((x) => x.id === 'ON-01').lastAppliedOn);
    expect(on01.reuse.applied).toBe(L.reuseRecords().find((x) => x.id === 'ON-01').applied);
    // Every target the panel offers records, because the lab carries the key or
    // reference and the reason the engine asks for.
    L.lessonRules().targets.forEach((t) => L.lessonRules().outcomes.forEach((o) => {
      expect(L.recordApplication('ON-03', [], t, o).ok, `${t}, ${o}`).toBe(true);
    }));
  });

  it('Section 17: the review sweep, the lead, the ONNE register, its summary and its attention order', () => {
    expectTable('| review due | days until | overdue | due soon |',
      L.lessonReviewSweep().map((r) => [r.reviewDue, r.days, yn(r.overdue), yn(r.dueSoon)]));
    expect(L.lessonReviewLead()).toEqual({ leadDays: 30, first: 0, last: 30, days: 31 });
    // A lesson that is not visible has no review status, wherever its date is.
    expect(L.lessonReviewAt(-1, 'Validated')).toMatchObject({ overdue: false, dueSoon: false, visible: false });
    expectTable('| lesson | status | event date | age in days | review due | overdue | due soon | applied nowhere |',
      L.onneRegister().map((l) => [l.id, q(l.status), l.eventDate, nul(l.ageDays), nul(l.reviewDue), yn(l.overdue), yn(l.dueSoon), yn(l.appliedNowhere)]));
    const s = L.onneSummary();
    expectTable('| count | value |', s.counts.map((c) => [c.key, c.value]), 1);
    expect(DIGEST).toContain(`newest event first within a rank: ${s.attention.join(', ')}.`);
  });

  it('NEGATIVE CONTROL: one wrong cell and the comparison fails, naming it', () => {
    const rows = L.obodoRegister().map((r) => [r.id, q(r.status), nul(r.nextReview), nul(r.daysUntil), yn(r.reviewOverdue)]);
    const header = '| risk | status | next review | days until | review overdue |';
    expect(diffRows(rows, table(header))).toEqual([]);
    const planted = rows.map((r) => [...r]);
    planted[0][4] = 'yes';
    expect(diffRows(planted, table(header))).toEqual(['row 1 cell 5: lab "yes", digest "no"']);
    expect(() => table('| a header the digest has never carried |')).toThrow();
    expect(hasLine('- ALLOWED, a verdict the digest has never printed.')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// THE VERDICT GATE.
// ---------------------------------------------------------------------------

describe('THE VERDICT GATE: every verdict is the engine\'s, and none is retyped', () => {
  const census = L.verdictCensus();

  it('the census is large, every refusal carries a sentence, and no probe changed its answer', () => {
    expect(census.probes.length).toBe(71);
    expect([census.refused, census.allowed]).toEqual([49, 22]);
    expect(census.everyRefusalCarriesAReason).toBe(true);
    census.probes.forEach((v) => expect(hasLine(lineOf(v)), `not in the digest: ${lineOf(v)}`).toBe(true));
  });

  it('NO refusal sentence is written as a literal in the lab, a panel or the page', () => {
    const sentences = [...new Set([...census.probes, ...L.commentMoveGrid()].map((p) => p.reason).filter(Boolean))];
    expect(sentences.length).toBeGreaterThanOrEqual(40);
    const fragments = sentences.map((m) => m.split(' ').slice(0, 7).join(' ')).filter((f) => f.length > 24);
    expect(fragments.length).toBeGreaterThanOrEqual(25);
    const leaks = [];
    ALL_SOURCES.forEach((file) => {
      const text = sourceOf(file);
      fragments.forEach((f) => { if (text.includes(f)) leaks.push(`${file}: ${f}`); });
    });
    expect(leaks, 'a refusal sentence is retyped in a source file').toEqual([]);
    // CONTROL: the detector fires on a planted retype.
    expect(`const s = '${sentences[0]}';`.includes(sentences[0].split(' ').slice(0, 7).join(' '))).toBe(true);
  });

  it('CONTROL: an ALLOWED verdict carries no sentence, so the gate is not reading every call as a refusal', () => {
    const allowed = census.probes.filter((p) => p.ok);
    expect(allowed.every((p) => p.reason === null)).toBe(true);
    expect(allowed.length).toBeGreaterThan(10);
  });
});

// ---------------------------------------------------------------------------
// THE AS-OF GATE: every date-taking call is handed T().
// ---------------------------------------------------------------------------

const NS_OF = {
  calendar: 'CAL', riskScoring: 'RS', managementOfChange: 'MOC', peerReview: 'PR', lessonsLearned: 'LL',
};

/** The date takers, read off the digest's Section 1: { 'RS.isReviewOverdue': 1 } (zero-based). */
const dateTakers = () => {
  const out = {};
  Object.entries(NS_OF).forEach(([module, ns]) => {
    const line = LINES.find((l) => l.startsWith(`- ${module}: `));
    if (!line) throw new Error(`the digest names no date takers for ${module}`);
    [...line.matchAll(/(\w+) \(argument (\d+)\)/g)].forEach((m) => { out[`${ns}.${m[1]}`] = Number(m[2]) - 1; });
  });
  return out;
};

/** Every call to a date taker in a source, with its top-level arguments. */
const callsIn = (code, takers) => {
  const calls = [];
  const re = /\b(CAL|RS|MOC|PR|LL)\.(\w+)\(/g;
  let m = re.exec(code);
  while (m) {
    const key = `${m[1]}.${m[2]}`;
    if (key in takers) {
      let depth = 1;
      let i = re.lastIndex;
      let cur = '';
      const args = [];
      for (; i < code.length && depth > 0; i += 1) {
        const ch = code[i];
        if ('([{'.includes(ch)) depth += 1;
        if (')]}'.includes(ch)) depth -= 1;
        if (depth === 0) break;
        if (ch === ',' && depth === 1) { args.push(cur.trim()); cur = ''; } else cur += ch;
      }
      if (cur.trim()) args.push(cur.trim());
      calls.push({ key, args });
    }
    m = re.exec(code);
  }
  return calls;
};

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

describe('THE AS-OF GATE: every engine call that takes a date is handed the as-of date', () => {
  it('the date takers are read off the digest, and the lab hands every one of them T()', () => {
    const takers = dateTakers();
    expect(Object.keys(takers).length).toBe(19);
    const calls = callsIn(stripComments(sourceOf(LAB_FILE)), takers);
    expect(calls.length, 'the lab makes almost no date-taking calls, so this gate is vacuous').toBeGreaterThanOrEqual(30);
    const bad = calls.filter((c) => c.args[takers[c.key]] !== 'T()').map((c) => `${c.key}(${c.args.join(', ')})`);
    expect(bad, 'these calls would read the machine clock').toEqual([]);
    // And T() is the as-of date built from its three parts, never the clock.
    expect(sourceOf(LAB_FILE)).toContain('const T = () => AS_OF();');
    expect(L.AS_OF().getHours()).toBe(0);
    expect([L.AS_OF().getFullYear(), L.AS_OF().getMonth() + 1, L.AS_OF().getDate()]).toEqual([...L.AS_OF_PARTS]);
  });

  it('NEGATIVE CONTROL: a planted call without its date is caught, and so is one handed something else', () => {
    const takers = dateTakers();
    const planted = 'const a = RS.isReviewOverdue(r);\nconst b = MOC.expiryState(m, new Date());\nconst c = MOC.byUrgency(T());\n';
    const bad = callsIn(planted, takers).filter((c) => c.args[takers[c.key]] !== 'T()');
    expect(bad.map((c) => c.key)).toEqual(['RS.isReviewOverdue', 'MOC.expiryState']);
  });
});

// ---------------------------------------------------------------------------
// THE CLOCK GATE.
// ---------------------------------------------------------------------------

describe('THE CLOCK GATE: nothing the lab or a panel shows depends on the system date', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('the whole lab and every panel in every mode are byte-identical under two faked system dates', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const early = snapshot();
    const earlyPanels = panelMarkup();
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    const late = snapshot();
    const latePanels = panelMarkup();
    expect(late.length).toBeGreaterThan(50000);
    expect(latePanels.length).toBeGreaterThan(50000);
    expect(late).toBe(early);
    expect(latePanels).toBe(earlyPanels);
  });

  it('CONTROL: the fake clock moved, and an engine call left to its clock DOES differ', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2011-02-07T12:00:00Z'));
    const risk = { status: 'Open', next_review_date: L.AS_OF_ISO };
    const early = [new Date().getUTCFullYear(), RS.isReviewOverdue(risk)];
    vi.setSystemTime(new Date('2099-12-30T12:00:00Z'));
    const late = [new Date().getUTCFullYear(), RS.isReviewOverdue(risk)];
    expect(early).toEqual([2011, false]);
    expect(late).toEqual([2099, true]);
  });

  it('no source reads the clock or draws a random number, and the stripper carries its own control', () => {
    [LAB_FILE, ...SHARED_FILES, ...PANEL_FILES, PAGE].forEach((file) => {
      const code = stripComments(sourceOf(file));
      expect(code.length).toBeGreaterThan(400);
      expect(code, `${file} reads the clock`).not.toMatch(/new Date\(\s*\)|Date\.now|Math\.random|performance\.now/);
      if (file !== LAB_FILE) expect(code, `${file} builds a date of its own`).not.toMatch(/\bDate\b/);
    });
    const sample = '// a comment about Date.now and Math.random\nconst x = 1;\n';
    expect(stripComments(sample)).not.toContain('Math.random');
    expect(stripComments(sample)).toContain('const x = 1;');
    expect(/new Date\(\s*\)/.test(stripComments('const now = new Date();'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// THE NON-UTC GATE.
// ---------------------------------------------------------------------------

const TZ_CHILD_TZ = 'Pacific/Pago_Pago';
const TZ_CHILD = process.env.RC_TZ_CHILD === '1';
const TZ_SIDECAR = process.env.RC_TZ_SIDECAR;

describe('THE NON-UTC GATE: the lab reproduces byte for byte at UTC minus eleven', () => {
  it(`the whole riskchange snapshot under TZ=${TZ_CHILD_TZ} is byte-identical`, () => {
    if (TZ_CHILD) {
      expect(TZ_SIDECAR, 'the child was spawned with no sidecar path').toBeTruthy();
      fs.writeFileSync(TZ_SIDECAR, JSON.stringify({
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offsetMinutes: -new Date('2026-07-01T12:00:00Z').getTimezoneOffset(),
        // THE NEGATIVE CONTROL: a date string read as a UTC instant, the shape the
        // engines' calendar exists to refuse. West of Greenwich it lands on the
        // day before, so the zone really bites in this process.
        utcReadDay: new Date(L.AS_OF_ISO).getDate(),
        snapshot: snapshot(),
      }));
    } else {
      const sidecar = path.join(ROOT, 'node_modules', '.rc-tz-snapshot.json');
      if (fs.existsSync(sidecar)) fs.unlinkSync(sidecar);
      execFileSync(path.join(ROOT, 'node_modules/.bin/vitest'), [
        'run', '--reporter=dot', '--config', 'vitest.config.js',
        'src/components/course/panels/riskchange/riskchangeLab.test.js',
        '-t', 'riskchange snapshot under',
      ], {
        cwd: ROOT,
        env: {
          ...process.env, TZ: TZ_CHILD_TZ, RC_TZ_CHILD: '1', RC_TZ_SIDECAR: sidecar,
        },
        stdio: 'pipe',
        timeout: 600000,
      });
      expect(fs.existsSync(sidecar), 'the child wrote no snapshot').toBe(true);
      const child = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
      fs.unlinkSync(sidecar);
      expect(child.timeZone).toBe(TZ_CHILD_TZ);
      expect(child.offsetMinutes).toBe(-660);
      expect(child.utcReadDay, 'the negative control did not fire: the zone does not bite').toBe(30);
      expect(child.snapshot.length).toBeGreaterThan(50000);
      expect(child.snapshot).toBe(snapshot());
    }
  }, 600000);
});

// ---------------------------------------------------------------------------
// THE RENDER GATE.
// ---------------------------------------------------------------------------

const MODE_COMPONENTS = [
  ['RiskExplorer', RX, ['MatrixMode', 'ResidualMode', 'RegisterMode', 'CalendarMode']],
  ['ChangeExplorer', CX, ['StagesMode', 'ApprovalsMode', 'GatesMode', 'TimelineMode', 'RegisterMode']],
  ['ReviewExplorer', VX, ['CommentsMode', 'ReviewersMode', 'RegisterMode', 'LessonsMode', 'DatesMode']],
];

const PROPS = ['m', 'scale', 'probes', 'r', 'choices', 'targets', 'appetite', 'c', 'pops', 'rows', 'cal', 'table', 'moves',
  'view', 'people', 'last', 'sets', 'segregation', 'blockers', 'rules', 'exp', 'expRows', 'lead', 'rat', 'ratRows', 'win',
  'cases', 'types', 'reg', 'sum', 'actions', 'actors', 'roles', 'v', 's', 'reviews', 'stages', 'lessons', 'use', 'reuse',
  'at', 'statuses'];

const realArgs = () => {
  const noop = () => {};
  return {
    RiskExplorer: {
      MatrixMode: { m: L.riskMatrix(), scale: L.riskScale(), probes: L.bandProbes() },
      ResidualMode: {
        r: L.residualAt('2', '', ''), choices: L.residualInputChoices(), targets: L.targetChoices(), l: '2', i: '', t: '', onL: noop, onI: noop, onT: noop, probes: L.residualProbes(), appetite: L.appetiteProbes(),
      },
      RegisterMode: {
        c: L.registerCount('all', 'inherent'), pops: L.registerPopulations(), rows: L.obodoRegister(), population: 'all', score: 'inherent',
      },
      CalendarMode: { cal: L.calendarProbes(), rows: L.obodoRegister() },
    },
    ChangeExplorer: {
      StagesMode: { table: L.stageTable(), moves: L.stageMovesFrom('Review'), stage: 'Review' },
      ApprovalsMode: {
        view: L.approvalView(L.approvalStart()), people: L.approvalPeople(), actingAs: 'u-emeka', last: L.decideApproval(L.approvalStart(), 1, 'sign', 'u-halima'), sets: L.approvalSets(), segregation: L.segregationProbes(), addAs: 'u-ngozi',
      },
      GatesMode: { probes: L.gateProbes(), blockers: L.gateBlockers() },
      TimelineMode: {
        rules: L.expiryRules(), exp: L.expiryAt(0), expRows: L.expiryTimeline(), lead: L.expiryLead(), rat: L.ratificationAt(7), ratRows: L.ratificationTimeline(), win: L.ratificationWindow(), cases: L.ratificationCases(), types: L.expiryAcrossTypes(),
      },
      RegisterMode: { reg: L.esanmiRegister(), sum: L.esanmiSummary(), actions: L.esanmiActions() },
    },
    ReviewExplorer: {
      CommentsMode: {
        view: L.commentLogView(L.commentLogStart()), rules: L.commentRules(), actors: L.reviewActors(), actingAs: 'u-efe', last: L.moveComment(L.commentLogStart(), 'C-03', 'Verified', 'u-efe'), probes: L.actOnCommentProbes(),
      },
      ReviewersMode: {
        people: L.reviewerPeople(), roles: L.reviewerRoles(), person: 'author', role: 'Reviewer', v: L.assignReviewer('author', 'Reviewer'), probes: L.participantProbes(),
      },
      RegisterMode: {
        s: L.registerSummary(), reviews: L.ikangReviews(), stages: L.commentRules().stages, stage: 'Cancelled',
      },
      LessonsMode: {
        lessons: L.visibleLessons(), use: L.lessonUse('ON-04', []), lessonId: 'ON-04', rules: L.lessonRules(), target: 'Training', outcome: 'Rejected', reuse: L.reuseRecords(), probes: L.embeddingProbes(),
      },
      DatesMode: {
        at: L.lessonReviewAt(0, 'Published'), rows: L.lessonReviewTimeline(), lead: L.lessonReviewLead(), offset: 0, statuses: L.lessonRules().statuses, status: 'Published', reg: L.onneRegister(), sum: L.onneSummary(),
      },
    },
  };
};

describe('THE RENDER GATE: every mode renders its empty state before any engine value exists', () => {
  it('every mode named in a panel\'s MODES list has a component', () => {
    MODE_COMPONENTS.forEach(([name, ns, components]) => {
      expect(ns.MODES.length, `${name} has a mode without a component or a component without a mode`).toBe(components.length);
      components.forEach((c) => expect(typeof ns[c], `${name} does not export ${c}`).toBe('function'));
      expect(typeof ns.default).toBe('function');
    });
  });

  it('EVERY mode renders with NOTHING at all, and shows its empty state', () => {
    MODE_COMPONENTS.forEach(([name, ns, components]) => components.forEach((c) => {
      const markup = renderToStaticMarkup(React.createElement(ns[c], {}));
      expect(markup, `${name}/${c} has no empty state`).toMatch(/has returned nothing/);
    }));
  });

  it('EVERY mode survives a REFUSAL-SHAPED object on every prop, so nothing indexes into a refusal', () => {
    const refusal = { ok: false, reason: 'the engine refused this state' };
    MODE_COMPONENTS.forEach(([name, ns, components]) => components.forEach((c) => {
      PROPS.forEach((prop) => {
        const markup = renderToStaticMarkup(React.createElement(ns[c], { [prop]: refusal }));
        expect(markup.length, `${name}/${c} rendered nothing from a refusal on ${prop}`).toBeGreaterThan(10);
      });
      // And on every real prop at once but one, in turn.
      const args = realArgs()[name][c];
      Object.keys(args).forEach((prop) => {
        const markup = renderToStaticMarkup(React.createElement(ns[c], { ...args, [prop]: refusal }));
        expect(markup.length, `${name}/${c} with a refusal on ${prop}`).toBeGreaterThan(10);
      });
    }));
  });

  it('and every mode renders the REAL reader output, so the empty state is not all it can do', () => {
    const args = realArgs();
    MODE_COMPONENTS.forEach(([name, ns, components]) => components.forEach((c) => {
      const markup = renderToStaticMarkup(React.createElement(ns[c], args[name][c]));
      expect(markup.length, `${name}/${c} rendered almost nothing`).toBeGreaterThan(400);
      expect(markup, `${name}/${c} fell back to its empty state on real output`).not.toMatch(/has returned nothing/);
    }));
    // The refusals a reader triggers are on the page in the engine's words.
    const approvals = renderToStaticMarkup(React.createElement(CX.ApprovalsMode, args.ChangeExplorer.ApprovalsMode));
    expect(approvals).toContain('REFUSED');
    const comments = renderToStaticMarkup(React.createElement(VX.CommentsMode, args.ReviewExplorer.CommentsMode));
    expect(comments).toContain(args.ReviewExplorer.CommentsMode.last.reason);
  });

  it('the three panel shells render, and every ResponsiveContainer states its width and height', () => {
    [RiskExplorer, ChangeExplorer, ReviewExplorer].forEach((P) => {
      expect(renderToStaticMarkup(React.createElement(P, {})).length).toBeGreaterThan(400);
    });
    PANEL_FILES.forEach((f) => {
      const opens = [...sourceOf(f).matchAll(/<ResponsiveContainer([^>]*)>/g)];
      expect(opens.length, `${f} draws no chart`).toBeGreaterThanOrEqual(1);
      opens.forEach((m) => {
        expect(m[1]).toContain('width=');
        expect(m[1]).toContain('height=');
      });
    });
  });
});

// ---------------------------------------------------------------------------
// THE COPY RULE.
// ---------------------------------------------------------------------------

const EM = '—';
const EN = '–';
const CONTRASTIVE = /,\s+not\s+\w/;
const breaches = (s) => CONTRASTIVE.test(s) || s.includes(EM) || s.includes(EN) || / -- /.test(s);

const stringsIn = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => stringsIn(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => stringsIn(v, out));
  return out;
};

describe('THE OWNER COPY RULE: no em dash, no en dash and no contrastive', () => {
  it('no source file breaches it', () => {
    ALL_SOURCES.forEach((file) => {
      const bad = sourceOf(file).split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => breaches(l));
      expect(bad.map(([n, l]) => `${file}:${n}: ${l.trim()}`)).toEqual([]);
    });
  });

  it('every string the lab hands a panel obeys it, and so does every rendered panel', () => {
    const strings = stringsIn(teachingSurface());
    expect(strings.length).toBeGreaterThanOrEqual(500);
    expect(strings.filter(breaches)).toEqual([]);
    expect(breaches(panelMarkup().replace(/<[^>]+>/g, ' '))).toBe(false);
  });

  it('CONTROL: the detector fires on all four shapes', () => {
    expect(breaches(`a dash ${EM} here`)).toBe(true);
    expect(breaches(`a range 1${EN}2`)).toBe(true);
    expect(breaches('a double -- hyphen')).toBe(true);
    expect(breaches('this thing, not that thing')).toBe(true);
    expect(breaches('a clean sentence that says what it means')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// THE PROSE SWEEP.
// ---------------------------------------------------------------------------

const HISTORY_KEYWORDS = [
  /\bused to\b/i, /\bno longer\b/i, /\bwas the bug\b/i, /\bnow correctly\b/i,
  /\bonce (?:returned|said|read|claimed|gave)\b/i, /\bhad been the\b/i, /\bregression\b/i,
  /\bbefore the repair\b/i, /\bformerly\b/i, /\bprior to\b/i, /\bwas repaired\b/i,
];
const FRAME_MARKERS = [/\bREPAIR HISTORY\b/i, /\bhistory\b/i, /\bDEFECT THIS CATCHES\b/i, /\bMEASURED\b/];

const isComment = (line) => {
  const t = line.trim();
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*');
};

/** The frame window: the contiguous comment run above the hit plus the line before it. Never the hit itself. */
const sweepComments = (text) => {
  const lines = text.split('\n');
  const hits = [];
  lines.forEach((line, n) => {
    if (!isComment(line) || !HISTORY_KEYWORDS.some((re) => re.test(line))) return;
    const win = [];
    let i = n - 1;
    while (i >= 0 && isComment(lines[i])) { win.push(lines[i]); i -= 1; }
    if (i >= 0) win.push(lines[i]);
    if (FRAME_MARKERS.some((re) => re.test(win.join('\n')))) return;
    hits.push(`${n + 1}: ${line.trim()}`);
  });
  return hits;
};

describe('THE PROSE SWEEP: the lab\'s, the panels\' and the page\'s own comments', () => {
  it('no comment states former behaviour as current behaviour', () => {
    const unframed = ALL_SOURCES.flatMap((f) => sweepComments(sourceOf(f)).map((h) => `${f}:${h}`));
    expect(unframed).toEqual([]);
    const total = ALL_SOURCES.reduce((a, f) => a + sourceOf(f).split('\n').filter(isComment).length, 0);
    expect(total, 'almost no comments to sweep').toBeGreaterThanOrEqual(150);
  });

  it('CONTROL: an unframed history comment IS caught, a framed one is not, and an inline frame is no frame', () => {
    // The planted comments are assembled at run time, so this file's own lines
    // carry no history phrase for the wave kit's source sweep to read.
    const slash = '/'.repeat(2);
    const noLonger = ['no', 'longer'].join(' ');
    const usedTo = ['used', 'to'].join(' ');
    expect(sweepComments(`const a = 1;\n${slash} the review ${noLonger} reads overdue\n`).length).toBe(1);
    expect(sweepComments(`${slash} REPAIR HISTORY, labelled as history.\n${slash} the review ${noLonger} read overdue\n`).length).toBe(0);
    expect(sweepComments(`const a = 1;\n${slash} this ${usedTo} be history\n`).length).toBe(1);
  });

  it('no panel or page reaches an engine directly, and each reads the lab', () => {
    [...PANEL_FILES, PAGE].forEach((file) => {
      const text = sourceOf(file);
      expect(text, `${file} imports an engine`).not.toMatch(/@petrolord\/engines/);
      expect(text, `${file} does not read the lab`).toMatch(/riskchangeLab/);
    });
    expect(sourceOf(LAB_FILE)).toMatch(/@petrolord\/engines/);
  });
});

// ---------------------------------------------------------------------------
// Purity, and the registration.
// ---------------------------------------------------------------------------

describe('every reader is pure and deterministic', () => {
  it('every zero-argument export is named in READERS, and two calls agree', () => {
    const zeroArg = Object.keys(L).filter((k) => typeof L[k] === 'function' && L[k].length === 0);
    const unnamed = zeroArg.filter((k) => !L.READERS.includes(k) && !['AS_OF'].includes(k));
    expect(unnamed).toEqual([]);
    expect(snapshot()).toBe(snapshot());
  });

  it('mutating a result or an input changes neither the next call nor the teaching fields', () => {
    const first = snapshot();
    const reg = L.obodoRegister();
    reg[0].residualScore = 999;
    const rows = L.approvalStart();
    rows[0].status = 'Rejected';
    L.decideApproval(rows, 1, 'sign', 'u-emeka');
    expect(L.approvalStart()[0].status).toBe('Approved');
    const log = L.commentLogStart();
    L.moveComment(log, 'C-01', 'Responded', 'u-efe');
    expect(log.find((c) => c.id === 'C-01').status).toBe('Open');
    expect(snapshot()).toBe(first);
  });
});

describe('the three panel ids, the route and the page are registered', () => {
  const IDS = [
    ['rc-risk-explorer', 'riskchange/RiskExplorer'],
    ['rc-change-explorer', 'riskchange/ChangeExplorer'],
    ['rc-review-explorer', 'riskchange/ReviewExplorer'],
  ];

  it('the three ids resolve in panelRegistry.js to these three files, and the wave\'s structure asks for them', () => {
    const registry = fs.readFileSync(path.join(ROOT, 'src/content/courses/panelRegistry.js'), 'utf8');
    const structure = fs.readFileSync(waveInput(WAVE_NAME, 'structure.py'), 'utf8');
    IDS.forEach(([id, target]) => {
      expect(registry).toContain(`'${id}': React.lazy(() => import('@/components/course/panels/${target}'))`);
      expect(structure).toContain(`'${id}'`);
    });
  });

  it('the route is /dashboard/apps/riskchange and it renders the learning page behind the Learning Mode gate', () => {
    const dash = fs.readFileSync(path.join(ROOT, 'src/pages/DashboardPage.jsx'), 'utf8');
    expect(dash).toContain('<Route path="apps/riskchange" element={<RiskChangeLearningPage />} />');
    expect(dash).toContain("import RiskChangeLearningPage from '@/pages/apps/RiskChangeLearningPage'");
    const page = sourceOf(PAGE);
    expect(page).toContain('LearningModeGate');
    expect(page).toContain("const APP = 'riskchange'");
    ['associateReading', 'professionalReading', 'expertReading', 'RiskExplorer', 'ChangeExplorer', 'ReviewExplorer']
      .forEach((s) => expect(page).toContain(s));
  });
});
