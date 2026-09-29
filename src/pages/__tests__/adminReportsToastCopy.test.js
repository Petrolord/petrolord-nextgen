// The toasts on the admin report screens follow the copy rule: no em dashes,
// no emoji, and none of the contrastive phrasings ("X, not Y", "rather than",
// ", never", "instead of"). The old placeholder toasts had an em dash and a
// construction emoji ("isn't implemented yet—but ...").
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FILES = [
  'src/pages/AdminComplianceReportsPage.jsx',
  'src/pages/AdminReportAnalyticsPage.jsx',
  'src/components/reports/ScheduleReportModal.jsx',
];

const BANNED = [
  [/—/, 'em dash'],
  [/\p{Extended_Pictographic}/u, 'emoji'],
  [/, not /i, '"X, not Y"'],
  [/rather than/i, '"rather than"'],
  [/, never/i, '", never"'],
  [/instead of/i, '"instead of"'],
];

// Every toast({ ... }) call in a source file, with its text.
const toastsIn = (src) => src.match(/toast\(\s*\{[\s\S]*?\}\s*\)/g) || [];

describe('admin report toasts follow the copy rule', () => {
  for (const file of FILES) {
    it(file, () => {
      const src = readFileSync(resolve(process.cwd(), file), 'utf8');
      const toasts = toastsIn(src);
      expect(toasts.length).toBeGreaterThan(0);
      for (const t of toasts) {
        for (const [re, label] of BANNED) {
          expect(re.test(t), `${label} in ${t}`).toBe(false);
        }
      }
      // No emoji or em dash anywhere else in the file either.
      expect(/—|\p{Extended_Pictographic}/u.test(src)).toBe(false);
    });
  }
});
