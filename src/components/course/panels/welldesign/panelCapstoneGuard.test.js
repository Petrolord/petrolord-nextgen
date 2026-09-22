// THE WELL DESIGN UNCERTAINTY PANEL GUARD, under the D2 policy (typedCaseGuard.js).
//
// The Professional capstone grades six numbers at the deepest station of the
// ISCWSA MWD Rev4 validation well. The uncertainty explorer is how they are
// read: select the total depth station and read the tiles. W4 added the
// north-north variance tile (the one field no view printed) and moved the
// view's opening station off total depth, so selecting the station the prompt
// names is the work and the view no longer opens on the answers.
//
// Scope: this file guards the uncertainty explorer only. The survey and
// clearance explorers' opening views still print beginner and advanced
// answers; that is section 3 (W5, strip B) and the open-book label covers it.
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './welldesignLab.js';
import * as G from '../typedCaseGuard.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIELDS = path.resolve(HERE, '../../../../../docs/graded-field-audit/fields.json');

const live = JSON.parse(fs.readFileSync(FIELDS, 'utf8')).filter((f) => f.course === 'welldesign');
const engine = L.capstoneValues();
const graded = live.map((f) => ({ tier: f.tier, key: f.key, value: engine[f.tier][f.key], tol: f.tol }));
const intermediate = graded.filter((f) => f.tier === 'intermediate');
const targets = G.leakTargets(intermediate);

const SRC = fs.readFileSync(path.join(HERE, 'UncertaintyExplorer.jsx'), 'utf8');
const DEFAULT_STATION = 180;
const TD_STATION = 267;
// Everything the view renders: the whole model state at the station (tiles and
// ellipse), the source table with its shares in percent, and the three numbers
// of the closing note.
const view = ({ idx }) => {
  const u = L.uncertaintyAt(idx);
  const check = L.workbookCheck();
  return {
    u,
    table: u.contributions.slice(0, 8).map((c) => ({ sharePct: 100 * c.shareOfTrace, trace: c.trace })),
    note: { rows: check.rows, worstRel: check.worst.rel, totalsMaxRel: check.totals.maxRel },
  };
};

describe('the guard is built from the live graded fields', () => {
  it('six intermediate fields, each computed by the engine within its own tolerance', () => {
    expect(intermediate).toHaveLength(6);
    live.forEach((f) => {
      expect(Math.abs(engine[f.tier][f.key] - f.expected), `${f.tier}/${f.key}`).toBeLessThanOrEqual(f.tol);
    });
  });
});

describe('RULE 1: the uncertainty explorer does not open on a graded answer', () => {
  it('the source opens on the station this guard sweeps, and that station is not total depth', () => {
    expect(SRC).toMatch(new RegExp(`useState\\('${DEFAULT_STATION}'\\)`));
    expect(DEFAULT_STATION).not.toBe(TD_STATION);
    expect(L.uncertaintyAt(TD_STATION).index).toBe(L.uncertaintyAt().index);
  });

  it('its default state is silent on all six Professional answers', () => {
    expect(G.defaultStateHits({ targets, modes: [{ name: 'uncertainty', defaults: { idx: DEFAULT_STATION }, run: view }] })).toEqual([]);
  });

  it('NEGATIVE CONTROL: the old opening station (total depth) prints every one of them', () => {
    const hits = G.defaultStateHits({ targets, modes: [{ name: 'uncertainty', defaults: { idx: TD_STATION }, run: view }] });
    intermediate.forEach((f) => expect(hits.some((h) => h.includes(`/${f.key} `)), f.key).toBe(true));
  });
});

describe('THE ROUTE: selecting total depth reads all six at the printed precision', () => {
  const u = L.uncertaintyAt(TD_STATION);
  const amil = u.contributions.find((c) => c.code === 'AMIL');
  const byKey = Object.fromEntries(live.map((f) => [f.key, f]));
  const shown = [
    ['well1_cov_nn', u.cov[0][0], 4],
    ['well1_sigma_lateral', u.sigmaL, 4],
    ['well1_sigma_highside', u.sigmaH, 4],
    ['well1_ellipse95_semimajor', u.ellipse95.semiMajor, 4],
    ['well1_ellipse_azimuth_deg', u.ellipse1.azimuthDeg, 4],
    ['well1_amil_share_pct', 100 * amil.shareOfTrace, 3],
  ];
  shown.forEach(([key, v, dp]) => {
    it(`${key} at ${dp} dp`, () => {
      const f = byKey[key];
      expect(G.typedRouteMiss({ run: () => v, typed: null, read: (x) => x, dp, expected: f.expected, tol: f.tol, key })).toBeNull();
    });
  });

  it('the station selector offers total depth and the view prints the north-north variance', () => {
    expect(SRC).toMatch(new RegExp(`value: '${TD_STATION}'`));
    expect(SRC).toMatch(/label="North-north variance" value=\{fmt\(u\.cov\[0\]\[0\], 4\)\}/);
  });
});

describe('RULE 3: the uncertainty explorer names no capstone reader and prints no graded answer', () => {
  it('names nothing', () => {
    expect(G.capstoneNamesIn(SRC)).toEqual([]);
  });
  it('prints no graded answer as a literal', () => {
    expect(G.gradedLiteralsIn(SRC, graded)).toEqual([]);
  });
  it('carries no em dash and no en dash', () => {
    expect(SRC).not.toMatch(/[–—]/);
  });
});
