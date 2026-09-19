// THE GASVALUE CAPSTONE PROMPT MUST REACH THE LEARNER WHOLE, AND MUST STATE
// EVERY CONDITION ITS GRADED FIELDS DEPEND ON.
//
// GasvalueLearningPage renders the prompt through the shared CapstonePrompt
// (whitespace-pre-line). The gasvalue prompts are single paragraphs, so what
// matters here is that each one the course migration ships reaches the learner
// byte for byte, and that each states what its fields need. This file proves:
//   - every prompt the gasvalue course migration ships is capstone.json's and
//     renders byte for byte inside an element that keeps lines;
//   - every number a capstone record carries (every mole fraction, the flare
//     volume, days, both efficiencies and the GWP, the route's yield, recovery,
//     price, reference plant and costs, the counterfactual's two tonnages, the
//     credit prices and hurdle, the LPG blend, the vessel and its limit, the
//     vaporizer, the carousel, the CNG gas and every gauge reading, and the
//     taxi) is a token of the prompt it belongs to; the record numbers left out
//     (the vessel's demand, delivery, lead time and safety days) are named here
//     with the reason: no graded field reads them;
//   - the engine figures the prompts are worked with (each component's carbon
//     number, molar mass, heating value and liquid density, the scf a lb-mol,
//     the pound a kg, the two flare molar masses, the modular exponent and the
//     water density) are stated in the prompt that needs them;
//   - the Expert prompt says every CNG pressure is read on a gauge and states
//     the site's atmosphere, the step its bank mass and cascade are graded on;
//   - each prompt asks for each answer at the decimals precision.json gives it;
//   - every graded field carries a label and a unit, and none is an NPV, an IRR
//     or a count;
//   - GasvalueLearningPage renders its capstone prompt through CapstonePrompt.
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import CapstonePrompt from '@/components/course/CapstonePrompt';
import * as FV from '@petrolord/engines/engines/downstream/flareToValue.js';
import * as LC from '@petrolord/engines/engines/downstream/lpgCng.js';
import * as MR from '@petrolord/engines/engines/downstream/modularRefinery.js';
import * as KNS from '../../../../../tools/course-waves/gasvalue/gasvalue_fields_capstone.mjs';
// A plain object copy, so computed lookups do not trip import/namespace.
const K = { ...KNS };

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const COURSE_SQL = 'migrations/20261013_gv_gasvalue_course.sql';
const TIERS = ['beginner', 'intermediate', 'advanced'];
// The records a tier's prompt is rendered from are the exports whose name
// starts with that tier's record (capstone.json names it), so this file names
// no capstone record: panelCapstoneGuard.test.js sweeps the panel tree, tests
// included, for them.
const recordOf = (tier) => capstone.tiers[tier].record;
const exportsOf = (tier) => Object.keys(K).filter((k) => k.startsWith(`${recordOf(tier)}_`));
// Record numbers a prompt does NOT print, each for a stated reason, keyed by
// the path after the record's name.
const NOT_PRINTED = {
  'VESSEL.demandTonnesPerDay': 'the cover and reorder point are not graded; usable LPG does not read it',
  'VESSEL.deliveryTonnes': 'the delivery fit is not graded',
  'VESSEL.leadTimeDays': 'the reorder point is not graded',
  'VESSEL.safetyDays': 'the reorder point is not graded',
};

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
const ROW = /\(\n {2}'gasvalue', '(beginner|intermediate|advanced)', '[a-z]+',\n {2}'(?:[^']|'')*',\n {2}'(?:[^']|'')*',\n {2}'((?:[^']|'')*)',\n {2}jsonb_build_array\(\n([\s\S]*?)\n {2}\)\n\)/g;
const SHIPPED = [...sql.matchAll(ROW)].map((m) => ({ tier: m[1], prompt: m[2].replace(/''/g, "'"), fields: m[3] }));
const capstone = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/gasvalue/capstone.json'), 'utf8'));
const precision = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/gasvalue/precision.json'), 'utf8'));
const decimalsOf = (key) => {
  const hit = Object.values(precision).filter((c) => new RegExp(c.match).test(key));
  expect(hit, `${key} matches one precision class`).toHaveLength(1);
  return hit[0].decimals;
};

const tokens = (text) => new Set((text.match(/(?<![\w.-])-?\d+(?:\.\d+)?(?!\w)/g) || []).map(Number));
/** Every number a record carries, with the path it sits at. */
const numbersOf = (obj, at = []) => Object.entries(obj).flatMap(([k, v]) => {
  if (typeof v === 'number') return [{ path: [...at, k].join('.'), value: v }];
  if (v && typeof v === 'object') return numbersOf(v, [...at, k]);
  return [];
});

describe('the gasvalue capstone prompt', () => {
  it('ships three prompts, each capstone.json\'s, rendered byte for byte in an element that keeps lines', () => {
    expect(SHIPPED.map((p) => p.tier)).toEqual(TIERS);
    for (const { tier, prompt } of SHIPPED) {
      expect(prompt, `${tier} prompt is capstone.json's`).toBe(capstone.tiers[tier].prompt);
      expect(prompt).not.toContain('\n');
      const { attrs, text } = rendered(<CapstonePrompt prompt={prompt} />);
      expect(keepsLines(attrs)).toBe(true);
      expect(text).toBe(prompt);
    }
  });

  it('states every number its capstone records carry', () => {
    let checked = 0;
    const skipped = new Set();
    for (const { tier, prompt } of SHIPPED) {
      const have = tokens(prompt);
      expect(exportsOf(tier).length, `${tier} has capstone records`).toBeGreaterThan(1);
      for (const name of exportsOf(tier)) {
        for (const n of numbersOf(K[name], [name.slice(recordOf(tier).length + 1)])) {
          if (NOT_PRINTED[n.path]) { skipped.add(n.path); continue; }
          checked += 1;
          expect(have.has(n.value), `${tier}: ${n.path} = ${n.value} is not stated in the prompt`).toBe(true);
        }
      }
    }
    expect([...skipped].sort()).toEqual(Object.keys(NOT_PRINTED).sort());
    expect(checked).toBeGreaterThan(80);
  });

  it('states the engine figures each prompt is worked with', () => {
    const byTier = Object.fromEntries(SHIPPED.map((p) => [p.tier, p.prompt]));
    for (const tier of ['beginner', 'intermediate']) {
      const p = byTier[tier];
      const have = tokens(p);
      const gas = K[`${recordOf(tier)}_GAS`];
      expect(gas.length).toBe(8);
      for (const [code, y] of gas) {
        const r = FV.GAS_COMPONENT_REFERENCE.find((x) => x.code === code);
        expect(p, `${tier}: ${code} is named with its fraction`).toContain(`(${code}) ${y}:`);
        for (const v of [r.c, r.molarMassLbLbmol, r.typicalGhvBtuScf]) expect(have.has(v), `${tier}: ${code} ${v}`).toBe(true);
        if (r.liquidDensityLbGal !== null) expect(have.has(r.liquidDensityLbGal), `${tier}: ${code} density`).toBe(true);
      }
      for (const v of [FV.SCF_PER_LBMOL, FV.LB_PER_KG, FV.FLARE_MOLAR_MASS.CO2, FV.FLARE_MOLAR_MASS.CH4]) {
        expect(have.has(v), `${tier}: engine constant ${v}`).toBe(true);
      }
      expect(p).toContain('40 CFR 98.233(n)');
    }
    expect(tokens(byTier.intermediate).has(MR.SCALING_EXPONENT.MODULAR)).toBe(true);
    expect(tokens(byTier.advanced).has(LC.WATER_KG_M3)).toBe(true);
    expect(byTier.beginner).toContain('scale it to one before using it');
  });

  it('says the Expert CNG pressures are gauge readings and states the atmosphere', () => {
    const advanced = SHIPPED.find((p) => p.tier === 'advanced').prompt;
    expect(advanced).toContain('every pressure below is read on a gauge');
    expect(advanced).toContain(`the site's atmosphere is ${K[`${recordOf('advanced')}_CNG`].atmosphereBar} bar`);
    expect(advanced).toContain('run the queue on the positions wholly working');
    expect(advanced).toContain('by weight');
  });

  it('asks for each answer at the decimals precision.json gives it, with a label and a unit, and grades no NPV, IRR or count', () => {
    for (const { tier, prompt, fields } of SHIPPED) {
      const fl = [...fields.matchAll(/'key','([a-z0-9_]+)', 'label','([^']+)', 'unit','([^']+)', 'expected',(-?[\d.e-]+), 'tol',([\d.e-]+)\)/g)]
        .map((m) => ({ key: m[1], label: m[2], unit: m[3], tol: Number(m[5]) }));
      expect(fl).toHaveLength(6);
      const tail = prompt.split('Give six numbers.')[1];
      const [body, quote = ''] = tail.split(' Quote ');
      const items = Object.fromEntries([...body.matchAll(/\((\d)\) ([^()]*?)(?= \(\d\)|$)/g)].map((m) => [m[1], m[2]]));
      const ranges = [...quote.matchAll(/\((\d)\) to \((\d)\) to (\d+)/g)].map((m) => [Number(m[1]), Number(m[2]), Number(m[3])]);
      fl.forEach((f, i) => {
        const n = i + 1;
        const stated = new Set([...(items[n] || '').matchAll(/to (\d+) decimals/g)].map((m) => Number(m[1])));
        ranges.filter(([a, b]) => a <= n && n <= b).forEach(([, , d]) => stated.add(d));
        expect([...stated], `${tier} item ${n} (${f.key})`).toEqual([decimalsOf(f.key)]);
        expect(f.label.length).toBeGreaterThan(5);
        expect(f.unit.length).toBeGreaterThan(1);
        expect(`${f.key} ${f.label} ${f.unit}`).not.toMatch(/npv|irr|net present|internal rate|fills before|positions wholly/i);
      });
    }
  });

  it('is what the gasvalue page renders its capstone prompt through', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/pages/apps/GasvalueLearningPage.jsx'), 'utf8');
    expect(page).toMatch(/<CapstonePrompt prompt=\{capstone\?\.prompt\} \/>/);
    expect(page).not.toMatch(/<CardDescription>\{capstone\?\.prompt\}<\/CardDescription>/);
  });
});
