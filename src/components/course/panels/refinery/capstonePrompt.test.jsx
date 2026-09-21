// THE REFINERY CAPSTONE PROMPT MUST REACH THE LEARNER WHOLE, AND MUST STATE
// EVERY CONDITION ITS GRADED FIELDS DEPEND ON.
//
// RefineryLearningPage renders the prompt through the shared CapstonePrompt
// (whitespace-pre-line), the component the riskchange course introduced. The
// refinery prompts are single paragraphs, so what matters here is that each one
// the course migration ships reaches the learner byte for byte, and that each
// states what its fields need. This file proves:
//   - every prompt the refinery course migration ships is capstone.json's and
//     renders byte for byte inside an element that keeps lines;
//   - every number a capstone record carries (an availability, a yield, a price,
//     a capacity, an operating cost, an actual movement, a tax rate) is a token
//     of the prompt it belongs to, money in millions where the prompt says
//     millions; the only record numbers left out are the engine constants the
//     course teaches (the scaling exponent), and they are listed here by name;
//   - the Expert prompt states its planning period, 2027-03-01 for 31 days;
//   - each prompt asks for each answer at the precision it is graded at;
//   - every graded field carries a label and a unit, and none is an NPV or IRR;
//   - RefineryLearningPage renders its capstone prompt through CapstonePrompt.
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import CapstonePrompt from '@/components/course/CapstonePrompt';
import * as K from '../../../../../tools/course-waves/refinery/refinery_fields_capstone.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const COURSE_SQL = 'migrations/20261011_rf_refinery_course.sql';
const TIERS = ['beginner', 'intermediate', 'advanced'];
const RECORD = { beginner: K.IKARAMA, intermediate: K.AMASSOMA, advanced: K.KOLOAMA };
// Record numbers a prompt does NOT print, each for a stated reason.
const NOT_PRINTED = {
  modularExponent: 'the modular scaling law is named; its exponent is the engine constant the course teaches',
};
const IN_MILLIONS = new Set(['baseCost', 'fixedOpexPerYear']);

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
const ROW = /\(\n {2}'refinery', '(beginner|intermediate|advanced)', '[a-z]+',\n {2}'(?:[^']|'')*',\n {2}'(?:[^']|'')*',\n {2}'((?:[^']|'')*)',\n {2}jsonb_build_array\(\n([\s\S]*?)\n {2}\)\n\)/g;
const SHIPPED = [...sql.matchAll(ROW)].map((m) => ({ tier: m[1], prompt: m[2].replace(/''/g, "'"), fields: m[3] }));
const capstone = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/refinery/capstone.json'), 'utf8'));

const tokens = (text) => new Set(
  (text.replace(/\d{4}-\d{2}-\d{2}/g, ' ').match(/(?<![\w.-])-?\d+(?:\.\d+)?(?!\w)/g) || []).map(Number),
);
/** Every number a record carries, with the path it sits at. */
const numbersOf = (obj, at = []) => Object.entries(obj).flatMap(([k, v]) => {
  if (typeof v === 'number') return [{ path: [...at, k].join('.'), key: k, value: v }];
  if (v && typeof v === 'object') return numbersOf(v, [...at, k]);
  return [];
});

describe('the refinery capstone prompt', () => {
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
        if (NOT_PRINTED[n.key]) continue;
        const want = IN_MILLIONS.has(n.key) ? n.value / 1e6 : n.value;
        checked += 1;
        expect(have.has(want), `${tier}: ${n.path} = ${want} is not stated in the prompt`).toBe(true);
      }
    }
    expect(checked).toBeGreaterThan(120);
  });

  it('states the Expert planning period, the one date a graded field is cascaded over', () => {
    const advanced = SHIPPED.find((p) => p.tier === 'advanced').prompt;
    expect(advanced).toContain(`the ${K.PERIOD_DAYS}-day period starting ${K.PERIOD_START}`);
    expect(K.PERIOD_START).toBe('2027-03-01');
    expect(K.PERIOD_DAYS).toBe(31);
  });

  it('asks for each answer at the precision it is graded at, with a label and a unit, and grades no NPV or IRR', () => {
    const ASK = { 0.5: /to the whole (?:dollar|barrel)/g, 0.005: /to the cent|percent to two decimals/g, 0.00005: /to four decimals/g };
    for (const { tier, prompt, fields } of SHIPPED) {
      const fl = [...fields.matchAll(/'key','([a-z0-9_]+)', 'label','([^']+)', 'unit','([^']+)', 'expected',(-?[\d.]+), 'tol',([\d.]+)\)/g)]
        .map((m) => ({ key: m[1], label: m[2], unit: m[3], tol: Number(m[5]) }));
      expect(fl).toHaveLength(6);
      for (const [tol, re] of Object.entries(ASK)) {
        expect((prompt.match(re) || []).length, `${tier} asks for tolerance ${tol}`).toBe(fl.filter((f) => f.tol === Number(tol)).length);
      }
      for (const f of fl) {
        expect(f.label.length).toBeGreaterThan(5);
        expect(f.unit.length).toBeGreaterThan(3);
        expect(`${f.key} ${f.label} ${f.unit}`).not.toMatch(/npv|irr|net present|internal rate/i);
      }
    }
  });

  it('is what the refinery page renders its capstone prompt through', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/pages/apps/RefineryLearningPage.jsx'), 'utf8');
    expect(page).toMatch(/<CapstonePrompt prompt=\{capstone\?\.prompt\} \/>/);
    expect(page).not.toMatch(/<CardDescription>\{capstone\?\.prompt\}<\/CardDescription>/);
  });
});
