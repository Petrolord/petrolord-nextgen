// A PANEL MAY NOT REACH INTO THE CAPSTONE.
//
// The lab's leak gate in portfolioLab.test.js walks the TEACHING exports'
// return values. It says nothing about the PANELS, and the panels import the
// lab directly. The lab exports its whole capstone surface (IDOHO,
// IDOHO_LIMITS, IDOHO_AFE, idohoRuns, idohoCapstoneFields and friends) beside
// its teaching surface, with nothing between them but a comment.
//
// A panel built on any of those would print graded answers to the learner
// sitting the assessment, and every other gate would stay green. So the guard
// is on the panel SOURCES, and on the course page, which imports the lab too.
// It is a grep, deliberately: a runtime check would only catch the modes
// somebody thought to render.
//
// The teaching equivalents exist and are what a panel must use:
//   IDOHO, IDOHO_LIMITS, IDOHO_EXCLUDED, IDOHO_RHO  ->  OKONO, OKONO_LIMITS, RHO_SWEEP
//   IDOHO_AFE, IDOHO_ITEMS, IDOHO_AS_OF             ->  OFON_AFE, OFON_ITEMS, OFON_AS_OF
//   IDOHO_PARTNERS                                  ->  OFON_PARTNERS
//   idohoRuns                                       ->  okonoBudgets / earnedValue / correlation / partnerShares
//   idohoCapstone*                                  ->  nothing; a panel never needs a graded answer
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './portfolioLab.js';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// THE WAVE INPUTS. Read from the committed copy under tools/course-waves by
// default, which is what lets this suite run anywhere, CI included. Point it
// at a live wave directory mid-build with NEXTGEN_WAVE_DIR. A missing input
// throws and names itself rather than skipping: see tools/course-waves/waveInputs.mjs.
const WAVE_NAME = 'portfolio';
const FIELDS_JSON = waveInput(WAVE_NAME, 'fields.json');
const LEARNING_PAGE = path.resolve(HERE, '../../../../pages/apps/PortfolioLearningPage.jsx');

const panelSources = fs
  .readdirSync(HERE)
  .filter((f) => f.endsWith('.jsx') && !f.endsWith('.test.jsx'))
  .map((f) => ({ file: f, text: fs.readFileSync(path.join(HERE, f), 'utf8') }))
  .concat([{ file: 'PortfolioLearningPage.jsx', text: fs.readFileSync(LEARNING_PAGE, 'utf8') }]);

const gradedStrings = () => JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))
  .map((f) => f[2])
  .filter((v) => typeof v === 'number' && Number.isFinite(v))
  .map((v) => v.toPrecision(6).replace(/\.?0+$/, ''))
  .filter((s) => !s.includes('e'));

describe('THE PANEL GUARD: no panel may read the capstone', () => {
  it('there are panels to check, so a rename cannot silently empty this gate', () => {
    expect(panelSources.map((s) => s.file).sort()).toEqual([
      'CapitalExplorer.jsx', 'CostExplorer.jsx', 'GovernanceExplorer.jsx', 'PortfolioLearningPage.jsx',
    ]);
    panelSources.forEach((s) => expect(s.text.length, s.file).toBeGreaterThan(2000));
  });

  it('the lab names every capstone export in CAPSTONE_ONLY_EXPORTS, so the grep list cannot go stale', () => {
    const named = Object.keys(L).filter((k) => /idoho/i.test(k));
    expect(named.length).toBeGreaterThanOrEqual(12);
    named.forEach((k) => expect(L.CAPSTONE_ONLY_EXPORTS, `${k} is not listed as capstone-only`).toContain(k));
    const exported = Object.keys(L);
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => expect(exported, `${k} is listed but not exported`).toContain(k));
    L.CAPSTONE_ONLY_EXPORTS.forEach((k) => {
      if (k === 'CAPSTONE_ONLY_EXPORTS') return;
      expect(k, `${k} does not carry the capstone name`).toMatch(/idoho/i);
    });
  });

  it('NEGATIVE CONTROL: the grep finds a capstone name and a graded answer when one is planted', () => {
    const graded = gradedStrings();
    const planted = `import { idohoCapstoneValues } from './portfolioLab';\nconst x = ${graded[0]};`;
    expect(L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(planted))).toEqual(['idohoCapstoneValues']);
    expect(graded.filter((s) => planted.includes(s))).toHaveLength(1);
  });

  panelSources.forEach(({ file, text }) => {
    it(`${file} names no capstone-only export`, () => {
      const hits = L.CAPSTONE_ONLY_EXPORTS.filter((name) => new RegExp(`\\b${name}\\b`).test(text));
      expect(hits, `${file} reaches into the capstone: ${hits.join(', ')}`).toEqual([]);
    });

    it(`${file} names no idoho reader and never says the field's name`, () => {
      const hits = [...text.matchAll(/idoho\w*/gi)].map((x) => x[0]);
      expect([...new Set(hits)], `${file} reaches into the capstone`).toEqual([]);
    });

    it(`${file} prints none of the eighteen graded answers`, () => {
      // Read from fields.json rather than from the lab, so a panel is checked
      // against what the GRADER holds.
      expect(JSON.parse(fs.readFileSync(FIELDS_JSON, 'utf8'))).toHaveLength(18);
      const printed = gradedStrings().filter((s) => text.includes(s));
      expect(printed, `${file} prints a graded capstone answer`).toEqual([]);
    });

    it(`${file} carries no em dash, no en dash and no dollar sign`, () => {
      expect(text).not.toMatch(/[–—]/);
      expect(text).not.toMatch(/\$(?!\{)/);
    });
  });
});
