// W5 (part c), section 3 pick A on all three welldata tiers: the capstone moves
// to the ODUMA case, which no panel preloads. This gate proves the move holds.
//
//   KEYS. The committed case files are exactly what the seeded case module
//   builds, and the eighteen graded values are regenerated here by running
//   those files through the panel lab functions, which call the vendored LAS
//   parser and import pipeline. They must equal the spec and the committed
//   migrations field for field.
//   LEAKS. No panel source, the learning page or any welldata lesson carries a
//   graded value in any string shape; no panel imports the case; the panels'
//   default states (every teaching file) land on no graded value.
//   LABEL. The W1 open-book label and its lesson note are gone.
//   CONTROLS. Every check goes red on a planted leak.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  REPO, renderingsOf, leaksIn, integerLeaksIn, lessonsOf, sourcesOf, migrationFields, W1_LABEL, W1_LESSON_NOTE, TIERS,
} from '@/lib/w5cGuardKit';
import { TEACHING_FILES, qcFile, computeImport, computeCampaign } from '@/lib/welldataTeaching';
import { build, gradedKeys, CASE_FILE_NAMES } from '../../../../../docs/graded-field-audit/w5c/welldata/case.mjs';

const SPEC = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/graded-field-audit/w5c/welldata.json'), 'utf8'));
const FIELDS = JSON.parse(fs.readFileSync(path.join(REPO, 'docs/graded-field-audit/w5c/welldata/fields.json'), 'utf8'));
const CASE_DIR = path.join(REPO, 'src/content/capstone-cases/welldata');
const MIGRATION = { beginner: '20261028c_w5_welldata_beginner.sql', intermediate: '20261028c_w5_welldata.sql', advanced: '20261028c_w5_welldata.sql' };
const ALL = TIERS.flatMap((t) => FIELDS[t].map((f) => ({ ...f, tier: t })));

const PANEL_DIR = 'src/components/course/panels/welldata';
const PAGE = 'src/pages/apps/WellDataLearningPage.jsx';
const SOURCES = sourcesOf(PANEL_DIR, [PAGE, 'src/lib/welldataTeaching.js', 'src/components/course/CapstoneCaseFiles.jsx']);
const LESSONS = lessonsOf('welldata');

// every searchable shape of every non-integer graded value
const RENDER = ALL.filter((f) => !Number.isInteger(f.expected)).flatMap((f) => renderingsOf(f.key, f.expected));

describe('W5c welldata: the ODUMA case and its keys', () => {
  it('commits exactly the case files the seeded case module builds', () => {
    const built = build();
    expect(Object.keys(built).sort()).toEqual([...CASE_FILE_NAMES].sort());
    const onDisk = fs.readdirSync(CASE_DIR).filter((f) => f.endsWith('.las')).sort();
    expect(onDisk).toEqual([...CASE_FILE_NAMES].sort());
    for (const name of CASE_FILE_NAMES) expect(fs.readFileSync(path.join(CASE_DIR, name), 'utf8'), name).toBe(built[name]);
  });

  it('regenerates all eighteen keys through the engine and they equal the spec and both migrations', () => {
    const files = Object.fromEntries(CASE_FILE_NAMES.map((n) => [n, fs.readFileSync(path.join(CASE_DIR, n), 'utf8')]));
    const keys = gradedKeys(files);
    expect(ALL).toHaveLength(18);
    for (const tier of TIERS) {
      expect(keys[tier], tier).toEqual(FIELDS[tier]);
      const m = migrationFields(MIGRATION[tier], 'welldata', tier);
      expect(m.fields.map((f) => [f.key, f.expected, f.tol]), tier)
        .toEqual(FIELDS[tier].map((f) => [f.key, f.expected, f.tol]));
      expect(m.prompt, tier).toBe(SPEC.tiers[tier].prompt);
      expect(m.prompt, `${tier}: W1 open-book label still on the brief`).not.toMatch(W1_LABEL);
    }
  });

  it('reads the same values straight off the engine for the parser-level counts', async () => {
    const { parseLas } = await import('@petrolord/engines/engines/welldata/lasParse.js');
    const t = (n) => parseLas(fs.readFileSync(path.join(CASE_DIR, n), 'utf8'));
    const val = (tier, key) => FIELDS[tier].find((f) => f.key === key).expected;
    expect(t('oduma2_main.las').curves[0].data.length).toBe(val('beginner', 'oduma2_n_samples'));
    expect(t('oduma1_wrapped.las').curves[0].data.length).toBe(val('advanced', 'oduma1_wrapped_samples'));
    expect(t('oduma4_irregular.las').curves[0].data.length).toBe(val('intermediate', 'oduma4_n_samples'));
    const nulls = t('oduma5_nulls.las').curves.slice(1).reduce((s, c) => s + c.data.filter((v) => !Number.isFinite(v)).length, 0);
    expect(nulls).toBe(val('advanced', 'oduma5_flagged_nulls'));
  });
});

describe('W5c welldata: nothing prints the ODUMA answers before the learner works', () => {
  it('sweeps real sources and lessons (a gate that sweeps nothing is not a gate)', () => {
    expect(SOURCES.map((s) => s.file)).toEqual([
      `${PANEL_DIR}/CampaignExplorer.jsx`, `${PANEL_DIR}/ImportExplorer.jsx`, `${PANEL_DIR}/LasInspector.jsx`,
      `${PANEL_DIR}/UserLasPicker.jsx`, PAGE, 'src/lib/welldataTeaching.js', 'src/components/course/CapstoneCaseFiles.jsx',
    ]);
    expect(LESSONS.length).toBeGreaterThan(60);
    expect(RENDER.length).toBeGreaterThan(10);
  });

  it('no source or lesson carries a graded decimal in any shape, or a graded integer of three or more digits', () => {
    const hits = [];
    for (const s of [...SOURCES, ...LESSONS]) {
      for (const h of leaksIn(s.text, RENDER)) hits.push(`${s.file}: ${h.key} as ${h.text} (${h.shape})`);
      for (const h of integerLeaksIn(s.text, ALL)) hits.push(`${s.file}: ${h.key} as ${h.text}`);
    }
    expect(hits).toEqual([]);
  });

  it('no panel imports the case; only the learning page does, to offer the downloads', () => {
    const importers = SOURCES.filter((s) => /capstone-cases\/welldata/.test(s.text)).map((s) => s.file);
    expect(importers).toEqual([PAGE]);
    const page = SOURCES.find((s) => s.file === PAGE).text;
    // the page hands the files to the download card and to nothing else
    expect(page.match(/WELLDATA_CASE_FILES/g)).toHaveLength(2);
  });

  it('the default state of every panel, over every teaching file, lands on no graded value', () => {
    const seen = defaultStateNumbers();
    expect(seen.length).toBeGreaterThan(200);
    const hits = [];
    for (const f of ALL) {
      if (Number.isInteger(f.expected) && f.expected < 100) continue; // like-for-like below
      for (const x of seen) if (Math.abs(x.v - f.expected) <= f.tol) hits.push(`${f.tier}/${f.key} ${f.expected} ~ ${x.what} ${x.v}`);
    }
    expect(hits).toEqual([]);
    // small counts: the same quantity on the teaching set must differ
    const c = computeCampaign(TEACHING_FILES);
    const imp = computeImport(TEACHING_FILES.find((f) => f.id === 'feet_20'), TEACHING_FILES.find((f) => f.id === 'irregular_20'));
    const v = (tier, key) => FIELDS[tier].find((f) => f.key === key).expected;
    const same = [
      ['campaign curves', c.campaignCurves, v('advanced', 'oduma_campaign_curves')],
      ['converted files', c.convertedFiles, v('advanced', 'oduma_converted_files')],
      ['dead curves', c.deadCurves, v('advanced', 'oduma_dead_curves')],
      ['uniform files', c.uniformFiles, v('advanced', 'oduma_uniform_files')],
      ['converted curves', imp.convertedCurves, v('intermediate', 'oduma3_converted_curves')],
      ['recognised kinds', imp.recognizedKinds, v('intermediate', 'oduma3_recognized_kinds')],
      ['GR nulls', qcFile(TEACHING_FILES[0]).curves.find((x) => x.mnemonic === 'GR').nullCount, v('beginner', 'oduma2_gr_nulls')],
    ].filter(([, a, b]) => a === b);
    expect(same).toEqual([]);
  });

  it('the W1 open-book lesson note is gone from every welldata tier', () => {
    expect(LESSONS.filter((l) => W1_LESSON_NOTE.test(l.text)).map((l) => l.file)).toEqual([]);
  });
});

describe('W5c welldata: negative controls (each check must go red on a plant)', () => {
  it('a graded decimal planted at full float, at nine digits and at four decimals is caught', () => {
    const missed = [];
    for (const f of ALL.filter((x) => !Number.isInteger(x.expected))) {
      for (const text of [`x = ${f.expected}`, `x = ${f.expected.toPrecision(9)}`, `reads ${f.expected.toFixed(4)} m`]) {
        const r = RENDER.filter((x) => x.key === f.key);
        if (!r.length) continue; // too short to search (e.g. 0.1524): covered by the numeric sweep
        if (!leaksIn(text, r).length) missed.push(`${f.key}: ${text}`);
      }
    }
    expect(missed).toEqual([]);
  });

  it('a graded integer planted in a lesson is caught; a longer number that contains it is not a hit', () => {
    const big = ALL.filter((f) => Number.isInteger(f.expected) && f.expected >= 100);
    expect(big.length).toBeGreaterThan(3);
    for (const f of big) {
      expect(integerLeaksIn(`the file holds ${f.expected} samples`, [f]), f.key).toHaveLength(1);
      expect(integerLeaksIn(`depth ${f.expected}1.5 m`, [f]), f.key).toHaveLength(0);
    }
  });

  it('a panel that imports the case is caught', () => {
    const planted = [...SOURCES, { file: `${PANEL_DIR}/Planted.jsx`, text: "import { WELLDATA_CASE_FILES } from '@/content/capstone-cases/welldata';" }];
    expect(planted.filter((s) => /capstone-cases\/welldata/.test(s.text)).map((s) => s.file)).not.toEqual([PAGE]);
  });

  it('a default state landing on a graded value is caught', () => {
    const f = ALL.find((x) => x.key === 'oduma2_gr_mean');
    const seen = [...defaultStateNumbers(), { what: 'planted', v: f.expected + f.tol / 2 }];
    expect(seen.some((x) => Math.abs(x.v - f.expected) <= f.tol)).toBe(true);
  });

  it('the W1 lesson note is recognised when present', () => {
    expect(W1_LESSON_NOTE.test('# T\n\n> **Open book.** The figures this capstone grades')).toBe(true);
    expect(W1_LABEL.test("Open book: the figures this capstone grades can be read in this tier's lessons")).toBe(true);
  });
});

// Every number the panels can show on the teaching files: the inspector over
// every teaching file (tiles and every curve row), the import explorer over
// every teaching file, and the campaign explorer's teaching campaign.
function defaultStateNumbers() {
  const out = [];
  const add = (what, v) => { if (Number.isFinite(v)) out.push({ what, v }); };
  const irr = TEACHING_FILES.find((f) => f.id === 'irregular_20');
  for (const f of TEACHING_FILES) {
    const qc = qcFile(f);
    add(`${f.id} first`, qc.depth.first); add(`${f.id} last`, qc.depth.last);
    add(`${f.id} stepNative`, qc.depth.stepNative); add(`${f.id} stepM`, qc.depth.stepM);
    add(`${f.id} samples`, qc.depth.nSamples);
    for (const c of qc.curves) {
      add(`${f.id} ${c.mnemonic} n`, c.nSamples); add(`${f.id} ${c.mnemonic} nulls`, c.nullCount);
      add(`${f.id} ${c.mnemonic} first`, c.firstFinite); add(`${f.id} ${c.mnemonic} last`, c.lastFinite);
      add(`${f.id} ${c.mnemonic} mean`, c.mean);
    }
    try {
      const imp = computeImport(f, irr);
      add(`${f.id} import start`, imp.startMdM); add(`${f.id} import stop`, imp.stopMdM); add(`${f.id} import step`, imp.stepM);
      add(`${f.id} import converted`, imp.convertedCurves); add(`${f.id} import kinds`, imp.recognizedKinds);
    } catch { /* a teaching file the import refuses shows no import numbers */ }
  }
  const c = computeCampaign(TEACHING_FILES);
  for (const p of c.perFile) { add(`${p.id} curves`, p.curves); add(`${p.id} nulls`, p.nulls); add(`${p.id} samples`, p.samples); }
  add('campaign curves', c.campaignCurves);
  return out;
}
