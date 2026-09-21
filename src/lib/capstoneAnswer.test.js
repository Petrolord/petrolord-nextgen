// THE CAPSTONE ANSWER BOX READS A PASTED THOUSANDS COMMA, AND ONLY THAT.
//
// Panels and Suite apps print 1000 and above with a thousands comma
// (welltest, welldesign and others: B5 finding 6). The boxes were
// <input type="number">, which drops "12,345.6" to an empty string, and the
// page then sent Number(''), so a correct pasted figure was graded as
// unanswered. Every capstone page now reads its boxes through
// buildCapstoneAnswers. This file proves:
//   - grouped thousands are read as the number they mean;
//   - an ambiguous comma ("1,5") is refused with a message, never guessed;
//   - every capstone page submits through the shared parser, with a text box
//     that keeps what the learner pasted.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCapstoneAnswer, buildCapstoneAnswers } from '@/lib/capstoneAnswer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PAGES = path.resolve(HERE, '../pages/apps');

const ok = (raw) => {
  const r = parseCapstoneAnswer(raw);
  expect(r.error, `${JSON.stringify(raw)} should parse`).toBeNull();
  return r.value;
};
const refused = (raw) => {
  const r = parseCapstoneAnswer(raw);
  expect(r.error, `${JSON.stringify(raw)} should be refused`).not.toBeNull();
  expect(r.value).toBeNull();
};

describe('parseCapstoneAnswer', () => {
  it('reads plain numbers exactly as Number() did', () => {
    expect(ok('12345.6')).toBe(12345.6);
    expect(ok('-43.2259')).toBe(-43.2259);
    expect(ok('0.000238')).toBe(0.000238);
    expect(ok('.5')).toBe(0.5);
    expect(ok('3.')).toBe(3);
    expect(ok('1e-7')).toBe(1e-7);
    expect(ok('  18  ')).toBe(18);
    expect(ok(42)).toBe(42);
  });

  it('reads a pasted thousands comma as the number it means', () => {
    expect(ok('12,345.6')).toBe(12345.6);
    expect(ok('1,282.248590')).toBe(1282.24859);
    expect(ok('1,000')).toBe(1000);
    expect(ok('-2,250.0000')).toBe(-2250);
    expect(ok('12,266,792.85346564')).toBe(12266792.85346564);
    expect(ok('+4,778,333.99')).toBe(4778333.99);
    expect(ok('−1,440')).toBe(-1440);
  });

  it('refuses a comma that does not group whole digits in threes', () => {
    refused('1,5');
    refused('0,5');
    refused('12,34.5');
    refused('1,2345');
    refused('1,234,5');
    refused(',123');
    refused('1,');
    refused('1.234,5');
  });

  it('refuses text that is not a number', () => {
    refused('abc');
    refused('1.2.3');
    refused('12 345');
    refused('Infinity');
    refused('0x10');
    refused(Number.NaN);
  });

  it('treats an empty box as unanswered', () => {
    expect(parseCapstoneAnswer('')).toEqual({ value: null, error: null });
    expect(parseCapstoneAnswer('   ')).toEqual({ value: null, error: null });
    expect(parseCapstoneAnswer(undefined)).toEqual({ value: null, error: null });
  });
});

describe('buildCapstoneAnswers', () => {
  const fields = [
    { key: 'a', label: 'Stock tank oil' }, { key: 'b', label: 'Skin' }, { key: 'c', label: 'Blank' },
  ];

  it('builds the payload keyed by field, nulls for empty boxes', () => {
    expect(buildCapstoneAnswers(fields, { a: '12,345.6', b: '-1.5' })).toEqual({ a: 12345.6, b: -1.5, c: null });
  });

  it('throws, naming every unreadable box, rather than sending a null', () => {
    expect(() => buildCapstoneAnswers(fields, { a: '1,5', b: 'x' }))
      .toThrow(/Stock tank oil has a comma[\s\S]*Skin is not a number/);
  });
});

describe('every capstone page submits through the shared parser', () => {
  const pages = fs.readdirSync(PAGES)
    .filter((f) => f.endsWith('.jsx'))
    .map((f) => [f, fs.readFileSync(path.join(PAGES, f), 'utf8')])
    .filter(([, src]) => src.includes('submitCapstone('));

  it('finds the capstone pages', () => {
    expect(pages.length).toBeGreaterThanOrEqual(65);
  });

  it.each(pages)('%s reads its boxes with buildCapstoneAnswers and a text input', (_, src) => {
    expect(src).toMatch(/buildCapstoneAnswers\(capstone\?\.fields, answers\)/);
    expect(src).not.toMatch(/Number\(answers\[/);
    // Each capstone box is a text input: type="number" drops a pasted comma.
    const boxes = [...src.matchAll(/<Input\b[^>]*?value=\{answers\[f\.key\] \?\? ''\}/g)].map((m) => m[0]);
    expect(boxes.length).toBeGreaterThan(0);
    boxes.forEach((b) => {
      expect(b).not.toMatch(/type="number"/);
      expect(b).toMatch(/inputMode="decimal"/);
    });
  });
});
