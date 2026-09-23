// THE D1 CAPSTONE CASE FILES are the data the three capstones are set on, and
// they ship in the zip (src/content/capstone-cases/dataqc). This suite proves
// that every committed case file, and the index that serves them, is
// byte-identical to what the committed course generator renders from the
// engine's own inputs (tools/course-waves/dataqc/gen_course.py running
// d1_capstone.mjs through THIS repository's vendored engine), so a case file
// cannot drift from the numbers the capstone grades. It also proves the files
// reach the capstone card and only the card: no panel and no lab imports them.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mirrorDir } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const CASES = path.join(ROOT, 'src/content/capstone-cases/dataqc');
const WAVE = mirrorDir('dataqc');

describe('THE D1 CAPSTONE CASE FILES', () => {
  it('are byte-identical to the committed generator run through this repository\'s vendored engine', () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'd1cases-'));
    const course = path.join(out, 'course.sql');
    execFileSync('python3', [path.join(WAVE, 'gen_course.py')], {
      encoding: 'utf8',
      env: {
        ...process.env,
        D1_WAVE: WAVE,
        D1_REPO: ROOT,
        D1_ENGINES: path.join(ROOT, 'packages/engines'),
        D1_TOLERANCE: path.join(HERE, 'gradedTolerance.js'),
        D1_COURSE_OUT: course,
        D1_CASES_OUT: out,
      },
    });
    const committed = fs.readdirSync(CASES).sort();
    const generated = fs.readdirSync(out).filter((f) => f !== 'course.sql').sort();
    expect(committed).toEqual(generated);
    expect(committed.filter((f) => f.endsWith('.csv'))).toHaveLength(8);
    committed.forEach((f) => expect(fs.readFileSync(path.join(CASES, f), 'utf8'), f).toBe(fs.readFileSync(path.join(out, f), 'utf8')));
    const mig = fs.readdirSync(path.join(ROOT, 'migrations')).find((f) => /_d1_dataqc_course\.sql$/.test(f));
    expect(fs.readFileSync(path.join(ROOT, 'migrations', mig), 'utf8')).toBe(fs.readFileSync(course, 'utf8'));
    fs.rmSync(out, { recursive: true, force: true });
    console.log(`[dataqc cases] ${committed.length} case files and the course migration regenerate byte for byte`);
  }, 120000);

  it('reach the capstone card only: no panel and no lab imports them', () => {
    const importers = fs.readdirSync(HERE).filter((f) => /\.(jsx?|mjs)$/.test(f) && !/\.test\./.test(f))
      .filter((f) => /capstone-cases/.test(fs.readFileSync(path.join(HERE, f), 'utf8')));
    expect(importers).toEqual([]);
    const page = fs.readFileSync(path.join(ROOT, 'src/pages/apps/DataQcLearningPage.jsx'), 'utf8');
    expect(page).toMatch(/@\/content\/capstone-cases\/dataqc/);
    expect(page).toMatch(/<CapstoneCaseFiles files=\{DATAQC_CASE_FILES\[tier\]\}/);
  });
});
