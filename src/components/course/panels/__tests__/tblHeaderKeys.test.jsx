// @vitest-environment jsdom
//
// Wave 7: the panel tables keyed their header cells by the header text, so a
// table with two columns of the same name (QRA ALARP, the gas value blend)
// raised React's duplicate-key warning. The header key is now qualified by
// the column index in every panel table that maps `head`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Tbl as QraTbl } from '@/components/course/panels/qra/panelBits';
import { Tbl as GasvalueTbl } from '@/components/course/panels/gasvalue/panelBits';

const PANELS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' ? [] : walk(p);
  return /\.jsx$/.test(e.name) && !/\.test\./.test(e.name) ? [p] : [];
});
const keyedByText = (src) => /head\.map\(\(h(?:, i)?\) => (?:\(\s*)?<th key=\{h\}/.test(src);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('panel table header keys', () => {
  for (const [name, Tbl] of [['QRA', QraTbl], ['gas value', GasvalueTbl]]) {
    it(`${name}: two columns with the same heading raise no duplicate-key warning`, () => {
      const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { container } = render(<Tbl head={['Case', 'Risk', 'Risk', 'Band']} rows={[['A', '1e-4', '1e-5', 'ALARP']]} />);
      expect([...container.querySelectorAll('th')].map((th) => th.textContent)).toEqual(['Case', 'Risk', 'Risk', 'Band']);
      const keyWarnings = errors.mock.calls.filter((c) => /same key|unique "key"/.test(String(c[0])));
      expect(keyWarnings).toEqual([]);
    });
  }

  it('negative control: a header keyed by its text does raise the warning', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const Old = ({ head }) => <table><thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead></table>;
    render(<Old head={['Risk', 'Risk']} />);
    expect(errors.mock.calls.some((c) => /same key/.test(String(c[0])))).toBe(true);
  });

  it('no panel table that maps `head` keys its header cells by the text alone', () => {
    const files = walk(PANELS);
    expect(files.length).toBeGreaterThan(200);
    const bad = files.filter((f) => keyedByText(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(PANELS, f));
    expect(bad).toEqual([]);
    // the detector sees both spellings of the old code
    expect(keyedByText("<tr>{head.map((h, i) => <th key={h} className={`text-left`}>{h}</th>)}</tr>")).toBe(true);
    expect(keyedByText('{head.map((h, i) => (\n            <th key={h} className="x">{h}</th>')).toBe(true);
    expect(keyedByText("<tr>{head.map((h, i) => <th key={`${i}-${h}`}>{h}</th>)}</tr>")).toBe(false);
  });
});
