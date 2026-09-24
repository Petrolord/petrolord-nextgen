// THE D3 PANEL VIEW GATES: what the touch-up added to the explorers is on the
// page, and every figure on it is the engine's own.
//
//   FITTED ROWS     the cluster explorer lists the fitted cluster of each row
//                   (k-means view) and the fitted component scores of each row
//                   (PCA view) for the rows a learner asks for; both are the
//                   engine's own arrays, and row 0 and the first row of each
//                   cored well are pinned to the digest rows that print them.
//   maxIter         the k-means view takes maxIter, so the engine's
//                   non-convergence warning is reachable from the panel.
//   kMin            the judge explorer's elbow view takes the smallest k, so
//                   the kMin and kMax refusals are reachable from the panel.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as CL from '@petrolord/engines/engines/dataai/cluster.js';
import * as L from './faciesLab.js';
import { KmeansMode, PcaMode } from './ClusterExplorer.jsx';
import { ElbowMode } from './JudgeExplorer.jsx';
import { waveInput } from '../../../../../tools/course-waves/waveInputs.mjs';

const DIGEST = fs.readFileSync(waveInput('facies', 'digest.txt'), 'utf8');
const CORED = L.DATASET.rows.filter((r) => r.FACIES !== null);
const XC = CORED.map((r) => L.TEACHING.logs.map((f) => r[f]));
const html = (el) => renderToStaticMarkup(el);
const cells = (...c) => c.map((x) => `<td[^>]*>${x}</td>`).join('\\s*');

describe('FITTED ROWS: the lab helper returns the engine arrays, windowed', () => {
  const KM = CL.kmeans({ X: XC, k: L.TEACHING.k, seed: L.TEACHING.seed, names: L.TEACHING.logs });
  const PC = CL.pca({ X: XC, names: L.TEACHING.logs });
  it('labels and scores are the engine\'s own, row for row', () => {
    const f = L.fittedRows({ wells: CORED.map((r) => r.well), labels: KM.labels, scores: PC.scores, from: 25, count: 10 });
    expect(f.map((x) => x.row)).toEqual([25, 26, 27, 28, 29, 30, 31, 32, 33, 34]);
    f.forEach((x) => {
      expect(x.label).toBe(KM.labels[x.row]);
      expect(x.scores).toBe(PC.scores[x.row]);
      expect(x.well).toBe(CORED[x.row].well);
    });
  });
  it('clamps the window into range and never runs past the last row', () => {
    expect(L.fittedRows({ labels: KM.labels, from: -4 })[0].row).toBe(0);
    const tail = L.fittedRows({ labels: KM.labels, from: 175 });
    expect(tail.map((x) => x.row)).toEqual([175, 176, 177, 178, 179]);
    expect(L.fittedRows({ labels: KM.labels, from: 900 })).toHaveLength(1);
    expect(L.fittedRows({ labels: [] })).toEqual([]);
  });
  it('the first row of each cored well carries the cluster the digest prints', () => {
    const wells = [...new Set(CORED.map((r) => r.well))];
    wells.forEach((wid) => {
      const i = CORED.findIndex((r) => r.well === wid);
      const [x] = L.fittedRows({ wells: CORED.map((r) => r.well), labels: KM.labels, from: i, count: 1 });
      expect(DIGEST).toContain(`| ${i} | ${wid} | ${CORED[i].depth} | ${CORED[i].FACIES} | ${x.label} |`);
    });
  });
});

describe('THE CLUSTER EXPLORER lists fitted rows', () => {
  it('the k-means view lists each fitted row\'s cluster from the row asked for', () => {
    const KM = CL.kmeans({ X: XC, k: L.TEACHING.k, seed: L.TEACHING.seed, names: L.TEACHING.logs });
    const page = html(<KmeansMode from0="150" />);
    expect(page).toContain('fitted row');
    expect(page).toMatch(new RegExp(cells('150', 'EKENE-6', String(KM.labels[150]))));
    expect(page).toMatch(new RegExp(cells('159', 'EKENE-6', String(KM.labels[159]))));
    expect(page).not.toMatch(new RegExp(cells('160', 'EKENE-6', '\\d')));
  });
  it('the PCA view lists each fitted row\'s scores, row 0 as the digest prints them', () => {
    const PC = CL.pca({ X: XC, names: L.TEACHING.logs });
    const s0 = PC.scores[0].map((v) => v.toFixed(6));
    expect(DIGEST).toContain(`| 0 | sandstone | ${s0.join(' | ')} |`);
    const page = html(<PcaMode />);
    expect(page).toMatch(new RegExp(cells('0', 'EKENE-1', ...s0.map((v) => v.replace('.', '\\.')))));
  });
  it('the k-means view takes maxIter, and a stop at maxIter shows the engine\'s warning', () => {
    const r = CL.kmeans({ X: XC, k: L.TEACHING.k, seed: L.TEACHING.seed, maxIter: 2, names: L.TEACHING.logs });
    expect(r.converged).toBe(false);
    const page = html(<KmeansMode maxIter0="2" />);
    expect(page).toContain(r.warning);
    expect(html(<KmeansMode />)).not.toContain('did not converge');
    expect(html(<KmeansMode maxIter0="0" />)).toContain(CL.kmeans({ X: XC, k: 4, seed: 3, maxIter: 0 }).error);
  });
});

describe('THE JUDGE EXPLORER elbow view takes the smallest k', () => {
  it('kMin above kMax shows the engine\'s kMax refusal, and kMin 0 its kMin refusal', () => {
    const r1 = CL.elbow({ X: XC, kMin: 4, kMax: 3, seed: L.TEACHING.seed });
    const r0 = CL.elbow({ X: XC, kMin: 0, kMax: 3, seed: L.TEACHING.seed });
    expect(r1.field).toBe('kMax');
    expect(r0.field).toBe('kMin');
    expect(html(<ElbowMode kMin0="4" kMax0="3" />)).toContain(r1.error);
    expect(html(<ElbowMode kMin0="0" kMax0="3" />)).toContain(r0.error);
    expect(DIGEST).toContain(r1.error);
    expect(DIGEST).toContain(r0.error);
  });
  it('a smallest k of 2 starts the table at k 2', () => {
    const page = html(<ElbowMode kMin0="2" kMax0="4" />);
    const r = CL.elbow({ X: XC, kMin: 2, kMax: 4, seed: L.TEACHING.seed, names: L.TEACHING.logs, withSilhouette: true });
    expect(r.table.map((x) => x.k)).toEqual([2, 3, 4]);
    expect(page).toContain(r.table[0].inertia.toFixed(6));
  });
});
