// THE CRUDE CAPSTONE PROMPT MUST REACH THE LEARNER WHOLE, AND MUST STATE
// EVERY CONDITION ITS GRADED FIELDS DEPEND ON.
//
// CrudeLearningPage renders the prompt through the shared CapstonePrompt
// (whitespace-pre-line). The crude prompts are single paragraphs, so what
// matters here is that each one the course migration ships reaches the learner
// byte for byte, and that each states what its fields need. This file proves:
//   - every prompt the crude course migration ships is capstone.json's and
//     renders byte for byte inside an element that keeps lines;
//   - every number a capstone record carries (barrels, gravities, per-mass
//     properties, SARA, every curve point, the shares, every cut bound and
//     price, the costs and losses, every pool property and availability, the
//     cargo size and every specification limit) is a token of the prompt it
//     belongs to; the record numbers left out (nitrogen, and the OGBELE sulfur)
//     are named here with the reason: no graded field reads them;
//   - the Expert prompt states the alkylate tank typed as 0 bbl, once, and asks
//     for relief at the margin;
//   - each prompt asks for its six answers to four decimals, the precision all
//     eighteen are graded at (5e-5);
//   - every graded field carries a label and a unit, and none names a HELD
//     quantity (the Refutas viscosity C12, Watson K C13);
//   - CrudeLearningPage renders its capstone prompt through CapstonePrompt.
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import CapstonePrompt from '@/components/course/CapstonePrompt';
import * as K from '../../../../../tools/course-waves/crude/crude_fields_capstone.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const COURSE_SQL = 'migrations/20261010_cr_crude_course.sql';
const TIERS = ['beginner', 'intermediate', 'advanced'];
const RECORD = {
  beginner: { IDAMA_CRUDES: K.IDAMA_CRUDES, IDAMA_BARRELS: K.IDAMA_BARRELS, IDAMA_CUT: K.IDAMA_CUT },
  intermediate: {
    OGBELE_CRUDES: K.OGBELE_CRUDES, OGBELE_SHARES: K.OGBELE_SHARES, OGBELE_CUTS: K.OGBELE_CUTS, OGBELE_VALUATION: K.OGBELE_VALUATION,
  },
  advanced: { ONNE_POOL: K.ONNE_POOL, ONNE_TARGET: K.ONNE_TARGET, ONNE_SPECS: K.ONNE_SPECS },
};
// Record numbers a prompt does NOT print, each for a stated reason, matched on
// the path the number sits at.
const NOT_PRINTED = [
  [/^IDAMA_CRUDES\.\d+\.nitrogenWtPct$/, 'the IDAMA streams carry nitrogen, and no graded field reads it'],
  [/^OGBELE_CRUDES\.\d+\.sulfurWtPct$/, 'the OGBELE crudes carry sulfur, and no Professional field reads it'],
];

const rendered = (el) => {
  const html = renderToStaticMarkup(el);
  const m = /^<p([^>]*)>([\s\S]*)<\/p>$/.exec(html);
  expect(m, `expected one <p>, got ${html.slice(0, 120)}`).not.toBeNull();
  const text = m[2].replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return { attrs: m[1], text };
};
const keepsLines = (attrs) => /class="[^"]*\bwhitespace-pre-line\b[^"]*"/.test(attrs);

const sql = fs.readFileSync(path.join(ROOT, COURSE_SQL), 'utf8');
const ROW = /\(\n {2}'crude', '(beginner|intermediate|advanced)', '[a-z]+',\n {2}'(?:[^']|'')*',\n {2}'(?:[^']|'')*',\n {2}'((?:[^']|'')*)',\n {2}jsonb_build_array\(\n([\s\S]*?)\n {2}\)\n\)/g;
const SHIPPED = [...sql.matchAll(ROW)].map((m) => ({ tier: m[1], prompt: m[2].replace(/''/g, "'"), fields: m[3] }));
const capstone = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/crude/capstone.json'), 'utf8'));

const tokens = (text) => new Set((text.match(/(?<![\w.-])-?\d+(?:\.\d+)?(?!\w)/g) || []).map(Number));
/** Every number a record carries, with the path it sits at. */
const numbersOf = (obj, at = []) => Object.entries(obj).flatMap(([k, v]) => {
  if (typeof v === 'number') return [{ path: [...at, k].join('.'), key: k, value: v }];
  if (v && typeof v === 'object') return numbersOf(v, [...at, k]);
  return [];
});

describe('the crude capstone prompt', () => {
  it('ships three prompts, each capstone.json\'s, rendered byte for byte in an element that keeps lines', () => {
    expect(SHIPPED.map((p) => p.tier)).toEqual(TIERS);
    for (const { tier, prompt } of SHIPPED) {
      expect(prompt, `${tier} prompt is capstone.json's`).toBe(capstone.tiers[tier].prompt);
      const { attrs, text } = rendered(<CapstonePrompt prompt={prompt} />);
      expect(keepsLines(attrs)).toBe(true);
      expect(text).toBe(prompt);
    }
  });

  it('states every number its capstone record carries', () => {
    let checked = 0;
    for (const { tier, prompt } of SHIPPED) {
      const have = tokens(prompt);
      for (const n of numbersOf(RECORD[tier])) {
        if (NOT_PRINTED.some(([re]) => re.test(n.path))) continue;
        checked += 1;
        expect(have.has(n.value), `${tier}: ${n.path} = ${n.value} is not stated in the prompt`).toBe(true);
      }
    }
    expect(checked).toBeGreaterThan(150);
  });

  it('states the alkylate tank typed as 0 bbl, once, and asks for relief at the margin', () => {
    const advanced = SHIPPED.find((p) => p.tier === 'advanced').prompt;
    expect(K.ONNE_POOL.find((c) => c.id === 'alk').maxVolume).toBe(0);
    expect(advanced).toMatch(/Alkylate: [^:]*tank typed as 0 bbl available\./);
    expect(advanced.split('typed as 0 bbl').length - 1).toBe(1);
    expect(advanced).toMatch(/\(4\) The value of relief on the sulfur limit[^()]*at the margin/);
  });

  it('asks for all six answers to four decimals, each with a label and a unit, and grades nothing HELD', () => {
    for (const { tier, prompt, fields } of SHIPPED) {
      expect(prompt, `${tier} asks for four decimals`).toContain('Give six numbers, each to four decimals.');
      const fl = [...fields.matchAll(/'key','([a-z0-9_]+)', 'label','((?:[^']|'')+)', 'unit','([^']+)', 'expected',(-?[\d.e-]+), 'tol',([\d.e-]+)\)/g)]
        .map((m) => ({ key: m[1], label: m[2], unit: m[3], tol: Number(m[5]) }));
      expect(fl).toHaveLength(6);
      for (const f of fl) {
        expect(f.tol).toBe(0.00005);
        expect(f.label.length).toBeGreaterThan(5);
        expect(f.unit.length).toBeGreaterThan(0);
        expect(`${f.key} ${f.label} ${f.unit}`).not.toMatch(/visc|refutas|watson|cst\b/i);
      }
    }
  });

  it('is what the crude page renders its capstone prompt through', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/pages/apps/CrudeLearningPage.jsx'), 'utf8');
    expect(page).toMatch(/<CapstonePrompt prompt=\{capstone\?\.prompt\} \/>/);
    expect(page).not.toMatch(/<CardDescription>\{capstone\?\.prompt\}<\/CardDescription>/);
  });
});
