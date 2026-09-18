// A CAPSTONE PROMPT WRITTEN AS RECORDS MUST KEEP ITS LINES WHEN IT RENDERS.
//
// The riskchange capstones hand the learner registers, one record per line,
// below a paragraph of prose. The page used to render the prompt in a plain
// CardDescription, and HTML collapses a newline into a space, so every
// register reached the learner as one run-on paragraph. This proves three
// things: the component keeps a multi-line prompt's lines (the newlines are in
// the markup and the element carries whitespace-pre-line), every prompt the
// course migration actually ships renders with each record on its own line,
// and the riskchange page renders its prompt through this component.
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import CapstonePrompt from './CapstonePrompt';
import { CardDescription } from '@/components/ui/card';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');

// The element the prompt renders into, and the text inside it with the
// escaped characters restored, exactly as the browser will receive it.
const rendered = (el) => {
  const html = renderToStaticMarkup(el);
  const m = /^<p([^>]*)>([\s\S]*)<\/p>$/.exec(html);
  expect(m, `expected one <p>, got ${html.slice(0, 120)}`).not.toBeNull();
  const text = m[2].replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return { attrs: m[1], text };
};

// white-space: pre-line is the rule that keeps newlines; whitespace-pre-line
// is Tailwind's class for it.
const keepsLines = (attrs) => /class="[^"]*\bwhitespace-pre-line\b[^"]*"/.test(attrs);

describe('CapstonePrompt', () => {
  it('keeps every line of a multi-line prompt', () => {
    const prompt = 'Read the register.\n\nTABLE 1:\nR-01 | status Open.\nR-02 | status Closed.';
    const { attrs, text } = rendered(<CapstonePrompt prompt={prompt} />);
    expect(keepsLines(attrs)).toBe(true);
    expect(text).toBe(prompt);
    expect(text.split('\n')).toEqual(['Read the register.', '', 'TABLE 1:', 'R-01 | status Open.', 'R-02 | status Closed.']);
  });

  it('is the fix: a plain CardDescription does NOT keep the lines', () => {
    // The control. If the plain element also carried the rule, the test above
    // would prove nothing about the component.
    const { attrs } = rendered(<CardDescription>{'a\nb'}</CardDescription>);
    expect(keepsLines(attrs)).toBe(false);
  });

  it('renders nothing but an empty element before the capstone loads', () => {
    const { text } = rendered(<CapstonePrompt prompt={undefined} />);
    expect(text).toBe('');
  });

  it('keeps every record line of every prompt the course migration ships', () => {
    const sql = fs.readFileSync(path.join(ROOT, 'migrations/20261001_asrc_riskchange_course.sql'), 'utf8');
    const ROW = /\(\n {2}'riskchange', '(beginner|intermediate|advanced)', '[a-z]+',\n {2}'(?:[^']|'')*',\n {2}'(?:[^']|'')*',\n {2}'((?:[^']|'')*)',/g;
    const prompts = [...sql.matchAll(ROW)].map((m) => [m[1], m[2].replace(/''/g, "'")]);
    expect(prompts.map((p) => p[0])).toEqual(['beginner', 'intermediate', 'advanced']);
    const RECORD = /^[A-Z]{2}-[A-Z]?\d+ \|/;
    const perTier = {};
    for (const [tier, prompt] of prompts) {
      const { attrs, text } = rendered(<CapstonePrompt prompt={prompt} />);
      expect(keepsLines(attrs)).toBe(true);
      expect(text).toBe(prompt);
      const lines = text.split('\n');
      perTier[tier] = lines.filter((l) => RECORD.test(l)).length;
      // Every record is on a line of its own: no line carries two records.
      for (const l of lines) expect((l.match(/(?:^|\. )[A-Z]{2}-[A-Z]?\d+ \|/g) || []).length).toBeLessThanOrEqual(1);
    }
    // The record counts the generator renders: 12 risks; 23 changes, 14
    // approval rows and 15 actions; 15 comments, 10 applications, 14 lessons.
    expect(perTier).toEqual({ beginner: 12, intermediate: 52, advanced: 39 });
  });

  it('is what the riskchange page renders its capstone prompt through', () => {
    const page = fs.readFileSync(path.join(ROOT, 'src/pages/apps/RiskChangeLearningPage.jsx'), 'utf8');
    expect(page).toMatch(/<CapstonePrompt prompt=\{capstone\?\.prompt\} \/>/);
    expect(page).not.toMatch(/<CardDescription>\{capstone\?\.prompt\}<\/CardDescription>/);
  });
});
