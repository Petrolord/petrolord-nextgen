// THE QI CAPSTONE GUARD over everything a learner sees in the app: the
// teaching lab, the teaching pack, the explorer panels, their shared bits and
// the learning page.
//
// No graded answer in any of the four shapes gradedAnswerGuard.js derives (the
// full double, twelve and nine significant digits, the six decimals the course
// prints), no capstone name, no capstone description and no distinctive
// capstone scalar (an uneven stated input). The answers are computed from the
// committed case files through the lab (qiCaseFigures.testkit.js), so this
// suite needs no wave directory and no path under /root.
//
// THE INVENTORY IS DECLARED. A renamed or added source fails the listing test
// instead of quietly dropping out of the sweep. Every shape is PLANTED and
// caught, so a guard that matched nothing could not pass.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { allRenderings, leaksIn, renderingsOf, skippedShapesOf } from './gradedAnswerGuard.js';
import { GRADED_FIELDS, gradedTolerance } from './gradedTolerance.js';
import { associateFigures, professionalFigures, expertFigures, readCaseText } from './qiCaseFigures.testkit.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PAGE = path.resolve(HERE, '../../../../pages/apps/QiLearningPage.jsx');
const EXPECTED_SOURCES = [
  'QiFeasibilityExplorer.jsx', 'QiInversionExplorer.jsx', 'QiPrestackExplorer.jsx', 'QiProspectExplorer.jsx',
  'ekeneQiGrid.json', 'ekeneQiPack.json', 'qiLab.js', 'qiLabExp.js', 'qiLabPro.js', 'qiPanelBits.jsx',
];
const NOT_SWEPT = ['gradedTolerance.js', 'gradedAnswerGuard.js', 'qiCaseFigures.testkit.js'];

const CASES = { TAMBERLO: JSON.parse(readCaseText('tamberlo')), QUARVIN: JSON.parse(readCaseText('quarvin')), DELSHOLM: JSON.parse(readCaseText('delsholm')) };
const FIG = { ...associateFigures(CASES.TAMBERLO), ...professionalFigures(CASES.QUARVIN), ...expertFigures(CASES.DELSHOLM) };
const FIELDS = GRADED_FIELDS.map(([tier, key]) => [tier, key, FIG[key], gradedTolerance(key)]);
const NAMES = /\b(tamberlo|quarvin|delsholm)\b/i;
const STRINGS = Object.values(CASES).map((c) => c.description.toLowerCase());
const SCALARS = [CASES.TAMBERLO, CASES.QUARVIN].flatMap((c) => Object.values(c.stated)
  .filter((v) => typeof v === 'number' && Math.abs(v) >= 100 && !Number.isInteger(v)));
const trimZ = (t) => (t.includes('.') ? t.replace(/0+$/, '').replace(/\.$/, '') : t);
// The prestack case's distinctive stated inputs: its uneven layer times and its
// stated time (whole numbers, so matched as whole tokens). Its offset, 1600 m,
// is a round figure the Ekene pack carries anyway, so it is not distinctive.
const PRO_INPUTS = [CASES.QUARVIN.stated.timeMs, CASES.QUARVIN.stated.dixLayer.fromMs, CASES.QUARVIN.stated.dixLayer.toMs];
const wholeIn = (text) => PRO_INPUTS.filter((h) => new RegExp(`(?<![\\d.])${h}(?![\\d])(?!\\.\\d)`).test(text));

const sources = () => {
  const panelFiles = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs|json)$/.test(f) && !/\.test\./.test(f) && !NOT_SWEPT.includes(f)).sort();
  return { panelFiles, texts: [...panelFiles.map((f) => [f, fs.readFileSync(path.join(HERE, f), 'utf8')]), ['QiLearningPage.jsx', fs.readFileSync(PAGE, 'utf8')]] };
};
const scalarsIn = (text) => SCALARS.filter((h) => new RegExp(`(?<![\\d.])${String(h).replace('.', '\\.')}(?![\\d])(?!\\.\\d)`).test(text));
const stringsIn = (text) => { const low = text.toLowerCase(); return STRINGS.filter((s) => low.includes(s)); };

describe('THE QI CAPSTONE GUARD', () => {
  it('derives every graded answer from the case and enough to search for', () => {
    expect(FIELDS).toHaveLength(GRADED_FIELDS.length);
    FIELDS.forEach(([, key, v]) => expect(Number.isFinite(v), key).toBe(true));
    const r = allRenderings(FIELDS);
    FIELDS.forEach(([, k]) => expect(r.filter((x) => x.key === k).length, k).toBeGreaterThanOrEqual(1));
    expect(STRINGS.length).toBe(3);
    expect(SCALARS.length).toBeGreaterThanOrEqual(1);
    const skipped = FIELDS.flatMap(([, k, v]) => skippedShapesOf(k, v));
    console.log(`[qi guard] ${r.length} renderings of ${FIELDS.length} answers searched, ${skipped.length} shapes skipped, ${STRINGS.length} case descriptions, ${SCALARS.length} distinctive scalars`);
  });

  it('the inventory of swept sources is the declared one', () => {
    expect(sources().panelFiles).toEqual(EXPECTED_SOURCES);
  });

  it('no swept source carries a graded answer, a capstone name, description or scalar', () => {
    const r = allRenderings(FIELDS);
    const found = [];
    sources().texts.forEach(([f, text]) => {
      leaksIn(text, r).forEach((l) => found.push(`${f}: ${l.key} as ${l.shape} ${l.text}`));
      const m = text.match(NAMES);
      if (m) found.push(`${f}: names ${m[0]}`);
      stringsIn(text).forEach((s) => found.push(`${f}: a capstone string "${s.slice(0, 40)}"`));
      scalarsIn(text).forEach((h) => found.push(`${f}: a capstone scalar ${h}`));
    });
    expect(found).toEqual([]);
  });

  it('NEGATIVE CONTROL: every shape of an answer, a name, a description and a scalar is caught when planted', () => {
    const [, key, v] = FIELDS[3];
    const shapes = renderingsOf(key, v);
    expect(shapes.map((s) => s.shape)).toContain('full');
    expect(shapes.map((s) => s.shape)).toContain('printed');
    shapes.forEach((s) => {
      expect(leaksIn(`const x = ${s.text};`, allRenderings(FIELDS)).map((l) => l.text)).toContain(s.text);
    });
    expect('<p>Tamberlo-1</p>').toMatch(NAMES);
    expect(stringsIn(`const q = '${CASES.TAMBERLO.description}';`)).toHaveLength(1);
    expect(scalarsIn(`const v = ${SCALARS[0]};`)).toEqual([SCALARS[0]]);
    expect('<p>Quarvin-2</p>').toMatch(NAMES);
    expect(stringsIn(`const q = '${CASES.QUARVIN.description}';`)).toHaveLength(1);
  });

  it('no swept source carries a distinctive prestack case input', () => {
    const found = [];
    sources().texts.forEach(([f, text]) => wholeIn(text).forEach((h) => found.push(`${f}: a prestack case input ${h}`)));
    expect(found).toEqual([]);
  });

  it('NEGATIVE CONTROL: a planted Professional figure and a planted prestack input are caught', () => {
    const k = 'quarvin_shuey_a';
    renderingsOf(k, FIG[k]).forEach((r) => expect(leaksIn(`const z = ${r.text};`, allRenderings(FIELDS)).map((l) => l.text)).toContain(r.text));
    expect(wholeIn(`const t = ${PRO_INPUTS[0]};`)).toEqual([PRO_INPUTS[0]]);
    expect(wholeIn(`const t = ${PRO_INPUTS[0]}.5;`)).toEqual([]);
  });

  it('this suite names no path under /root', () => {
    const me = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
    expect(me.split('\n').filter((l) => /['"`]\/root\//.test(l))).toEqual([]);
  });
});

// The Expert figures are graded (in FIELDS above) and also guarded here in
// their own four shapes, computed from the DELSHOLM case through the Expert
// lab; and the case's distinctive inputs (its trace positions and its two
// stated AIs, whole numbers matched as whole tokens).
const EXP = expertFigures(CASES.DELSHOLM);
const EXP_RENDERINGS = Object.entries(EXP).flatMap(([key, v]) => [String(v), trimZ(v.toPrecision(12)), trimZ(v.toPrecision(9)), v.toFixed(6)]
  .filter((t, k, a) => t.includes('.') && !/e/i.test(t) && t.length >= 6 && a.indexOf(t) === k).map((text) => ({ key, text })));
const DS = CASES.DELSHOLM;
const EXP_INPUTS = [DS.traceA.x, DS.traceA.y, DS.positionB.x, DS.positionB.y, DS.stated.porosity.atAi, DS.stated.facies.atAi];
const wholeExp = (text) => EXP_INPUTS.filter((h) => new RegExp(`(?<![\\d.])${h}(?![\\d])(?!\\.\\d)`).test(text));

describe('THE QI CAPSTONE GUARD, EXPERT', () => {
  it('derives the six Expert figures from the case and enough to search for', () => {
    expect(Object.keys(EXP)).toHaveLength(6);
    expect(Object.values(EXP).every(Number.isFinite)).toBe(true);
    expect(new Set(EXP_RENDERINGS.map((r) => r.key)).size).toBe(6);
    expect(EXP_INPUTS.every(Number.isInteger)).toBe(true);
  });

  it('no swept source carries an Expert case figure or a distinctive Expert case input', () => {
    const found = [];
    sources().texts.forEach(([f, text]) => {
      EXP_RENDERINGS.filter((r) => text.includes(r.text)).forEach((r) => found.push(`${f}: ${r.key} as ${r.text}`));
      wholeExp(text).forEach((h) => found.push(`${f}: an Expert case input ${h}`));
    });
    expect(found).toEqual([]);
  });

  it('NEGATIVE CONTROL: a planted Expert figure, name, description and input are caught', () => {
    const r = EXP_RENDERINGS[EXP_RENDERINGS.length - 1];
    expect(EXP_RENDERINGS.filter((x) => `const z = ${r.text};`.includes(x.text)).length).toBeGreaterThanOrEqual(1);
    expect('<p>Delsholm-2</p>').toMatch(NAMES);
    expect(stringsIn(`const q = '${DS.description}';`)).toHaveLength(1);
    expect(wholeExp(`const p = ${EXP_INPUTS[0]};`)).toEqual([EXP_INPUTS[0]]);
    expect(wholeExp(`const p = ${EXP_INPUTS[0]}.5;`)).toEqual([]);
  });
});
