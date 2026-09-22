// THE EXPERT TIER'S TUNING LESSONS PRINT WHAT THE ENGINE RETURNS.
//
// The advanced lessons on tuning (m03 l02 and l04, m04 l01 to l04, m06 l01)
// print the Good Oil regression on its 100 psig teaching test: the four knobs,
// the ledger, the residual and the prose read of them. HD 2026-09-22 (engines
// #235) fixed the labTune Bo fallback, whose null Bo had fed the regression a
// penalty at random, and every one of those figures moved. This gate calls the
// vendored engine through the lab the panels call and requires each lesson to
// print exactly what it returns, full precision in the tables and the rounded
// prose figures derived from the same values, so the lessons cannot drift from
// the engine again.
import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { goodOilTuned, tuningLedger } from './fluidLab.js';

const ADV = path.resolve(__dirname, '../../../../content/courses/fluid/advanced');
const read = (rel) => fs.readFileSync(path.join(ADV, rel), 'utf8');

const fit = goodOilTuned();
const t = Object.fromEntries(tuningLedger().map((r) => [r.name, r]));
const k = fit.knobs;
const s = fit.startKnobs;
const signed = (v) => (v > 0 ? `+${v}` : String(v));
const pctOut = (v) => Math.abs(v).toFixed(2);
const WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TENS = { 1: 'ten', 2: 'twenty', 3: 'thirty', 4: 'forty' };
const words = (n) => (n % 10 ? `${TENS[Math.floor(n / 10)]} ${WORDS[n % 10]}` : TENS[n / 10]);
const factorWords = words(Math.round(fit.ssrReduction));
const criticalsPct = WORDS[Math.round(Math.max(Math.abs(k.fTc - 1), Math.abs(k.fPc - 1)) * 100)];
const shiftMovePct = Math.round((Math.abs(k.sPlus / s.sPlus - 1) * 100) / 5) * 5;

const knobTable = ['fTc', 'fPc', 'kC1', 'sPlus'].map((n) => `| ${n} | ${String(k[n])} |`);

describe('the tuning lessons print the vendored engine', () => {
  it('the regression still reads the way the prose says', () => {
    expect(fit.converged).toBe(true);
    expect(fit.boundsHit).toEqual([]);
    expect(t.bo.improved).toBe(false);
    expect(['psat', 'totalGor', 'stoApi'].every((n) => t[n].improved)).toBe(true);
    // "within three percent": both critical multipliers
    expect(criticalsPct).toBe('three');
    // "about a quarter": the volume shift
    expect(Math.abs(k.sPlus / s.sPlus - 1)).toBeGreaterThan(0.2);
    expect(Math.abs(k.sPlus / s.sPlus - 1)).toBeLessThan(0.3);
    // "nearly twice as far out"
    expect(t.bo.tunedErr / t.bo.untunedErr).toBeGreaterThan(1.8);
    expect(t.bo.tunedErr / t.bo.untunedErr).toBeLessThan(2);
    // "under a tenth", "under one", "under two"
    expect(Math.abs(t.psat.tunedErr)).toBeLessThan(0.1);
    expect(Math.abs(t.totalGor.tunedErr)).toBeLessThan(1);
    expect(Math.abs(t.stoApi.tunedErr)).toBeLessThan(2);
  });

  it('m03 l02 the four knobs', () => {
    const md = read('m03-tuning/l02-the-four-knobs.md');
    knobTable.forEach((row) => expect(md).toContain(row));
    expect(md).toContain(`A multiplier of ${k.fTc.toFixed(3)} says the correlation was within ${criticalsPct} percent`);
    expect(md).toContain(`The two multipliers move by about ${criticalsPct} percent`);
    expect(md).toContain(`from ${s.sPlus.toFixed(4)} to ${k.sPlus.toFixed(4)}, about a quarter of its value`);
    expect(md).toContain(`rises from ${s.kC1.toFixed(4)} to ${k.kC1.toFixed(4)}`);
    expect(md).toContain(`within ${criticalsPct} percent of their correlated values`);
    expect(md).toContain(`had to move ${words(shiftMovePct)} percent`);
  });

  it('m03 l04 bounds and the prior', () => {
    const md = read('m03-tuning/l04-bounds-and-the-prior.md');
    expect(md).toContain(`the criticals moved by about ${criticalsPct} percent, the volume shift moved by about a quarter, and the residual fell by a factor of ${factorWords}.`);
  });

  it('m04 l01 the ledger', () => {
    const md = read('m04-what-tuning-costs/l01-the-ledger.md');
    const pct = ['psat', 'totalGor', 'bo'];
    for (const n of ['psat', 'totalGor', 'stoApi', 'bo']) {
      const u = pct.includes(n) ? ' pct' : '';
      expect(md).toContain(`| ${t[n].measured} | ${t[n].untuned} | ${t[n].tuned} | ${signed(t[n].untunedErr)}${u} | ${signed(t[n].tunedErr)}${u} |`);
    }
    expect(md).toContain(`falls from ${fit.ssrBefore} to ${fit.ssrAfter}, a factor of`);
    expect(md).toContain(`$$${fit.ssrReduction}$$`);
    expect(md).toContain(`went from ${pctOut(t.bo.untunedErr)} percent out to ${pctOut(t.bo.tunedErr)} percent out. It got WORSE.`);
    expect(md).toContain(`the sum is ${factorWords} times smaller, and reaching that point required moving Bo from ${pctOut(t.bo.untunedErr)} percent to ${pctOut(t.bo.tunedErr)} percent.`);
    expect(md).toContain(`"A ${factorWords.replace(' ', '-')}-fold reduction`);
  });

  it('m04 l02 the target that got worse', () => {
    const md = read('m04-what-tuning-costs/l02-the-target-that-got-worse.md');
    expect(md).toContain(`Bo went from ${pctOut(t.bo.untunedErr)} percent out to ${pctOut(t.bo.tunedErr)} percent out.`);
    expect(md).toContain(`${t.bo.untuned} against a measured ${t.bo.measured}, an error of ${t.bo.untunedErr} percent`);
    expect(md).toContain(`After tuning it is ${t.bo.tuned}, an error of ${t.bo.tunedErr} percent. Nearly twice as far out.`);
  });

  it('m04 l03 four knobs, four targets', () => {
    const md = read('m04-what-tuning-costs/l03-four-knobs-four-targets.md');
    expect(md).toContain(`fell by a factor of ${fit.ssrReduction}, from ${fit.ssrBefore} to ${fit.ssrAfter}.`);
  });

  it('m04 l04 reporting a tuned model', () => {
    const md = read('m04-what-tuning-costs/l04-reporting-a-tuned-model.md');
    expect(md).toContain(`moved from ${pctOut(t.bo.untunedErr)} percent to ${pctOut(t.bo.tunedErr)} percent,`);
  });

  it('m06 l01 the story so far', () => {
    const md = read('m06-the-expert-reading/l01-the-story-so-far.md');
    knobTable.forEach((row) => expect(md).toContain(row));
    expect(md).toContain(`The criticals move by about ${criticalsPct} percent`);
    expect(md).toContain(`the fit converges in ${fit.iterations} iterations`);
    const units = { psat: ' pct', totalGor: ' pct', stoApi: ' API', bo: ' pct' };
    for (const n of Object.keys(units)) {
      expect(md).toContain(`| ${signed(t[n].untunedErr)}${units[n]} | ${signed(t[n].tunedErr)}${units[n]} |`);
    }
    expect(md).toContain(`Residual down by a factor of ${fit.ssrReduction}.`);
  });
});
