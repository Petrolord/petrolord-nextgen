// THE METRIC NAME GATE (naming wave, owner decision 2026-09-14).
//
// Petrolord's headline fiscal metric is GOVERNMENT TAKE, government cash flow
// over revenue less opex less capex; the capex added back version is
// GOVERNMENT SHARE OF NET REVENUE. Both used to be called "effective tax
// rate" on one screen, and neither is a tax rate. This file fails if that
// phrase comes back unqualified anywhere in the fiscal course's text or panel
// sources, or if "government share" is used as a bare metric name.
//
// What counts as QUALIFIED:
//   - "minimum effective tax rate", a different, statutory quantity;
//   - the phrase inside double quotes with "labelled", "labeled", "called" or
//     "formerly" within the 40 characters before it, which is how a lesson
//     reports what an earlier build printed.
// "government share" is allowed only as "government share of net revenue" or
// "government share of profit oil". Text inside backticks is code and exempt.

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../../../../..');
const CONTENT = path.join(ROOT, 'src/content/courses/fiscal');
const PANELS = path.join(ROOT, 'src/components/course/panels/fiscal');
const PAGE = path.join(ROOT, 'src/pages/apps/FiscalLearningPage.jsx');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});

const stripCode = (text) => text.replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length));

export const unqualifiedEtr = (text) => {
  const prose = stripCode(text);
  const hits = [];
  const re = /effective\s+tax\s+rate/gi;
  let m;
  while ((m = re.exec(prose))) {
    const before = prose.slice(Math.max(0, m.index - 40), m.index);
    const minimum = /minimum\s+$/i.test(prose.slice(Math.max(0, m.index - 40), m.index));
    const quoted = prose[m.index - 1] === '"' && /(labelled|labeled|called|formerly)/i.test(before);
    if (!minimum && !quoted) hits.push(prose.slice(Math.max(0, m.index - 50), m.index + 40).replace(/\s+/g, ' '));
  }
  return hits;
};

export const bareGovernmentShare = (text) => {
  const prose = stripCode(text);
  const hits = [];
  const re = /government\s+share(?!\s+of\s+(net\s+revenue|profit\s+oil|the\s+profit\s+oil))/gi;
  let m;
  while ((m = re.exec(prose))) hits.push(prose.slice(Math.max(0, m.index - 50), m.index + 40).replace(/\s+/g, ' '));
  return hits;
};

const TEXT_FILES = [
  ...walk(CONTENT).filter((p) => /\.(md|json)$/.test(p)),
  ...walk(PANELS).filter((p) => /\.(js|jsx)$/.test(p) && !/\.test\.js$/.test(p)),
  PAGE,
];

describe('the fiscal course never names a take metric "effective tax rate" unqualified', () => {
  it('walks a real set of files', () => {
    expect(TEXT_FILES.filter((p) => p.endsWith('.md')).length).toBeGreaterThanOrEqual(78);
    expect(TEXT_FILES).toContain(PAGE);
  });

  it.each(TEXT_FILES.map((p) => [path.relative(ROOT, p), p]))('%s', (_rel, p) => {
    const text = fs.readFileSync(p, 'utf8');
    expect(unqualifiedEtr(text)).toEqual([]);
    expect(bareGovernmentShare(text)).toEqual([]);
  });
});

describe('NEGATIVE CONTROL: the gate fires on the sentences it exists to stop', () => {
  it('flags an unqualified effective tax rate, in any case', () => {
    expect(unqualifiedEtr('The summary shows the effective tax rate for each regime.')).toHaveLength(1);
    expect(unqualifiedEtr('Effective tax rate, summary')).toHaveLength(1);
    expect(unqualifiedEtr('both effective tax rates and which adds capex back')).toHaveLength(1);
    // Quoted but with no reporting verb near it is still a use of the name.
    expect(unqualifiedEtr('The column reads "effective tax rate" in bold.')).toHaveLength(1);
  });

  it('passes the two qualified forms and code', () => {
    expect(unqualifiedEtr('the PIA minimum effective tax rate top-up')).toEqual([]);
    expect(unqualifiedEtr('an earlier build labelled both "effective tax rate"')).toEqual([]);
    expect(unqualifiedEtr('the engine key `effectiveTaxRate` and the old column `effective tax rate`')).toEqual([]);
  });

  it('flags a bare government share and passes the two named ones', () => {
    expect(bareGovernmentShare('a government share that barely moves')).toHaveLength(1);
    expect(bareGovernmentShare('government share of net revenue, undiscounted')).toEqual([]);
    expect(bareGovernmentShare('the government share of profit oil')).toEqual([]);
    // JSX wraps prose, so a named metric broken across a line is still named.
    expect(bareGovernmentShare('shows government share of\n                    net revenue beside it')).toEqual([]);
    expect(bareGovernmentShare('a government\n   share that falls')).toHaveLength(1);
    expect(unqualifiedEtr('both call it the effective\n    tax rate')).toHaveLength(1);
  });
});
