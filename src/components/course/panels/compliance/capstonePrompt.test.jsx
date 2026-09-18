// THE COMPLIANCE CAPSTONE PROMPT MUST REACH THE LEARNER WITH ITS LINES INTACT.
//
// The page used to render the prompt in a plain CardDescription, and HTML
// collapses a newline into a space, so any prompt written as lines would reach
// the learner as one run-on paragraph. The page now renders it through the
// shared CapstonePrompt (whitespace-pre-line), the component the riskchange
// course introduced; this file is compliance's own proof and leaves
// riskchange's CapstonePrompt.test.jsx to riskchange. It proves:
//   - a multi-line prompt keeps every line, and a plain CardDescription does
//     not (the control, so the first test can fail);
//   - every prompt the compliance course migration ships renders byte for byte
//     inside an element that keeps lines;
//   - ComplianceLearningPage renders its capstone prompt through CapstonePrompt.
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import CapstonePrompt from '@/components/course/CapstonePrompt';
import { CardDescription } from '@/components/ui/card';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');

const rendered = (el) => {
  const html = renderToStaticMarkup(el);
  const m = /^<p([^>]*)>([\s\S]*)<\/p>$/.exec(html);
  expect(m, `expected one <p>, got ${html.slice(0, 120)}`).not.toBeNull();
  const text = m[2].replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return { attrs: m[1], text };
};
const keepsLines = (attrs) => /class="[^"]*\bwhitespace-pre-line\b[^"]*"/.test(attrs);

describe('the compliance capstone prompt', () => {
  it('keeps every line of a multi-line prompt', () => {
    const prompt = 'EKPE GAS PLANT. The as-of date is 2026-10-15.\n\nThe obligation register:\n'
      + 'REG-2026-041 Annual, due 2027-02-28.\nREG-2026-042 Semi-annual, due 2026-10-31.';
    const { attrs, text } = rendered(<CapstonePrompt prompt={prompt} />);
    expect(keepsLines(attrs)).toBe(true);
    expect(text).toBe(prompt);
    expect(text.split('\n')).toEqual([
      'EKPE GAS PLANT. The as-of date is 2026-10-15.', '', 'The obligation register:',
      'REG-2026-041 Annual, due 2027-02-28.', 'REG-2026-042 Semi-annual, due 2026-10-31.',
    ]);
  });

  it('is the fix: a plain CardDescription does NOT keep the lines', () => {
    const { attrs } = rendered(<CardDescription>{'a\nb'}</CardDescription>);
    expect(keepsLines(attrs)).toBe(false);
  });

  it('renders every prompt the course migration ships, byte for byte, in an element that keeps lines', () => {
    const sql = fs.readFileSync(path.join(ROOT, 'migrations/20261002_cq_compliance_course.sql'), 'utf8');
    const ROW = /\(\n {2}'compliance', '(beginner|intermediate|advanced)', '[a-z]+',\n {2}'(?:[^']|'')*',\n {2}'(?:[^']|'')*',\n {2}'((?:[^']|'')*)',/g;
    const prompts = [...sql.matchAll(ROW)].map((m) => [m[1], m[2].replace(/''/g, "'")]);
    expect(prompts.map((p) => p[0])).toEqual(['beginner', 'intermediate', 'advanced']);
    const capstone = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/course-waves/compliance/capstone.json'), 'utf8'));
    for (const [tier, prompt] of prompts) {
      expect(prompt, `${tier} prompt is capstone.json's`).toBe(capstone.tiers[tier].prompt);
      const { attrs, text } = rendered(<CapstonePrompt prompt={prompt} />);
      expect(keepsLines(attrs)).toBe(true);
      expect(text).toBe(prompt);
      expect(text).toContain('The as-of date is 2026-10-15.');
    }
  });

  it('is what the compliance page renders its capstone prompt through', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/pages/apps/ComplianceLearningPage.jsx'), 'utf8');
    expect(page).toMatch(/<CapstonePrompt prompt=\{capstone\?\.prompt\} \/>/);
    expect(page).not.toMatch(/<CardDescription>\{capstone\?\.prompt\}<\/CardDescription>/);
  });
});
