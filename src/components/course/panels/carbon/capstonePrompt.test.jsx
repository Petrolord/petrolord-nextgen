// THE CARBON CAPSTONE PROMPT MUST REACH THE LEARNER WHOLE, AND MUST STATE
// EVERY CONDITION ITS GRADED FIELDS DEPEND ON.
//
// CarbonLearningPage renders the prompt through the shared CapstonePrompt
// (whitespace-pre-line). The carbon prompts are single paragraphs, so what
// matters here is that each one the course migration ships reaches the learner
// byte for byte, and that each states what its fields need. This file proves:
//   - every prompt the carbon course migration ships is capstone.json's and
//     renders byte for byte inside an element that keeps lines;
//   - every number a capstone record carries (the fuel and carbon per
//     kilomole, the destruction efficiencies, the vented methane, the power and
//     its factor, the fuel analysis, the heater's temperatures and oxygens, the
//     trap, every stream, every measure and the plan, and the saving) is a
//     token of the prompt it belongs to; the record numbers left out are named
//     here with the reason, and no graded field reads one;
//   - the Associate and Expert prompts name the declared GWP set, its report,
//     its horizon and its methane value, and the Associate prompt states H3,
//     the rule its methane fields are graded on;
//   - each prompt asks for its six answers at the precision they are graded at:
//     two decimals, four decimals, and the nearest whole GJ for the one field
//     graded at 1 GJ;
//   - every graded field carries a label and a unit, and none names a HELD
//     quantity (H1 the report to file on, H2 the heating value pair, H4
//     combustion N2O);
//   - CarbonLearningPage renders its capstone prompt through CapstonePrompt.
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import CapstonePrompt from '@/components/course/CapstonePrompt';
// A namespace import read by computed key is import/namespace's own rule, so
// the records are copied into a plain object first (gasvalue PR #170's lint).
import * as KNS from '../../../../../tools/course-waves/carbon/carbon_fields_capstone.mjs';

const K = { ...KNS };
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const COURSE_SQL = 'migrations/20261014_cef_carbon_course.sql';
const TIERS = ['beginner', 'intermediate', 'advanced'];
const RECORD = {
  beginner: {
    CAP_GWP: K.CAP_GWP, OWAZA_HEATERS: K.OWAZA_HEATERS, OWAZA_FLARE: K.OWAZA_FLARE,
    OWAZA_VENT: K.OWAZA_VENT, OWAZA_POWER: K.OWAZA_POWER,
  },
  intermediate: {
    IGRITA_FUEL: K.IGRITA_FUEL, IGRITA_HEATER: K.IGRITA_HEATER, IGRITA_TRAP: K.IGRITA_TRAP,
    IGRITA_STREAMS: K.IGRITA_STREAMS, IGRITA_DTMIN: K.IGRITA_DTMIN,
  },
  advanced: {
    CAP_GWP: K.CAP_GWP, IKORODU_DISCOUNT_RATE: K.IKORODU_DISCOUNT_RATE, IKORODU_MEASURES: K.IKORODU_MEASURES,
    IKORODU_LINES: K.IKORODU_LINES, IKORODU_PLAN: K.IKORODU_PLAN, IKORODU_SAVING: K.IKORODU_SAVING,
  },
};
// Record numbers a prompt does NOT print, each for a stated reason, matched on
// the path the number sits at.
const NOT_PRINTED = [
  [/^OWAZA_VENT\.factor\.value$/, 'the measured methane mass passes through a factor of one, which the prompt states in words'],
  [/^OWAZA_VENT\.(?:scope|factor\.vintage)$/, 'the scope rule is stated in words, and the vintage repeats the version'],
  [/^OWAZA_POWER\.(?:scope|factor\.vintage)$/, 'Scope 2 is stated in words, and the vintage repeats the version'],
  [/^IGRITA_HEATER\.unburnedLossPercent$/, 'the prompt states "no unburned loss" in words rather than a zero'],
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
const ROW = /\(\n {2}'carbon', '(beginner|intermediate|advanced)', '[a-z]+',\n {2}'(?:[^']|'')*',\n {2}'(?:[^']|'')*',\n {2}'((?:[^']|'')*)',\n {2}jsonb_build_array\(\n([\s\S]*?)\n {2}\)\n\)/g;
const SHIPPED = [...sql.matchAll(ROW)].map((m) => ({ tier: m[1], prompt: m[2].replace(/''/g, "'"), fields: m[3] }));
const capstone = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/carbon/capstone.json'), 'utf8'));
const precision = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/carbon/precision.json'), 'utf8'));

const tokens = (text) => new Set((text.match(/(?<![\w.-])-?\d+(?:\.\d+)?(?!\w)/g) || []).map(Number));
/** Every number a record carries, with the path it sits at. */
const numbersOf = (obj, at = []) => Object.entries(obj).flatMap(([k, v]) => {
  if (typeof v === 'number') return [{ path: [...at, k].join('.'), key: k, value: v }];
  if (v && typeof v === 'object') return numbersOf(v, [...at, k]);
  return [];
});
const decimalsOf = (key) => {
  const hit = Object.values(precision).filter((c) => new RegExp(c.match).test(key));
  expect(hit, `${key} matches one precision class`).toHaveLength(1);
  return hit[0].decimals;
};

describe('the carbon capstone prompt', () => {
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
    expect(checked).toBeGreaterThan(80);
  });

  it('names the declared GWP set wherever the set moves a graded figure, and states H3', () => {
    for (const tier of ['beginner', 'advanced']) {
      const prompt = SHIPPED.find((p) => p.tier === tier).prompt;
      expect(prompt).toContain(K.CAP_GWP.label);
      expect(prompt).toContain('IPCC Sixth Assessment Report, 100-year horizon');
      expect(prompt).toContain(`methane ${K.CAP_GWP.values.CH4}`);
      expect(prompt).toContain(`nitrous oxide ${K.CAP_GWP.values.N2O}`);
      // No other report's methane potential is offered beside it.
      for (const alt of Object.values(K.ALT_GWP)) expect(tokens(prompt).has(alt.CH4)).toBe(false);
    }
    const beginner = SHIPPED.find((p) => p.tier === 'beginner').prompt;
    expect(beginner).toContain('Carbon that escapes a burner or the flare is counted as methane');
  });

  it('asks for every answer at the precision it is graded at, each with a label and a unit, and grades nothing HELD', () => {
    const PHRASE = { 0: 'to the nearest whole GJ', 2: 'to two decimals', 4: 'to four decimals' };
    let graded = 0;
    for (const { tier, prompt, fields } of SHIPPED) {
      const fl = [...fields.matchAll(/'key','([a-z0-9_]+)', 'label','((?:[^']|'')+)', 'unit','([^']+)', 'expected',(-?[\d.e-]+), 'tol',([\d.e-]+)\)/g)]
        .map((m) => ({ key: m[1], label: m[2], unit: m[3], tol: Number(m[5]) }));
      expect(fl, `${tier} grades six fields`).toHaveLength(6);
      for (const f of fl) {
        graded += 1;
        const dec = decimalsOf(f.key);
        expect(f.tol, `${f.key} is graded at one unit in its last place`).toBe(dec === 0 ? 1 : Number(`1e-${dec}`));
        expect(prompt, `${tier} asks for ${f.key} ${PHRASE[dec]}`).toContain(PHRASE[dec]);
        expect(f.label.length).toBeGreaterThan(5);
        expect(f.unit.length).toBeGreaterThan(0);
        expect(`${f.key} ${f.label} ${f.unit}`).not.toMatch(/n2o|nitrous|non.?fossil|\bar5\b|heating value pair/i);
      }
      expect(prompt).toContain('Give six numbers');
      expect(prompt).toContain('an invented record');
    }
    expect(graded).toBe(18);
  });

  it('is what the carbon page renders its capstone prompt through', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/pages/apps/CarbonLearningPage.jsx'), 'utf8');
    expect(page).toMatch(/<CapstonePrompt prompt=\{capstone\?\.prompt\} \/>/);
    expect(page).not.toMatch(/<CardDescription>\{capstone\?\.prompt\}<\/CardDescription>/);
  });
});
