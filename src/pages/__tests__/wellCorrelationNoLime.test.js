// Well Correlation learning page: the unused COLORS constant (with the
// retired lime #BFFF00) is gone. Nothing referenced it.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

describe('WellCorrelationLearningPage', () => {
  it('has no COLORS constant and no lime', () => {
    const src = readFileSync(resolve(ROOT, 'src/pages/apps/WellCorrelationLearningPage.jsx'), 'utf8');
    expect(src).not.toMatch(/\bCOLORS\b/);
    expect(src).not.toMatch(/BFFF00|A8E600/i);
  });
});
