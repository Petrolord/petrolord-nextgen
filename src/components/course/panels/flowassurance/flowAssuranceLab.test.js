// Every value the PD6 lab exposes to a panel or a lesson is pinned here
// against the vendored engines' own goldens and against the wave's teaching
// digest, and so are the teaching CLAIMS. A course that asserts its numbers
// but not its arguments can have its argument quietly inverted by an engine
// change and still pass: `overallU` could start REFUSING a bad trench instead
// of dropping the term, `steadyStateProfile` could start damping the
// Joule-Thomson term, `cooldownTime` could grow the guard it is missing,
// `inhibitionRequirement` could start comparing its own check back against the
// need, and a file that only pinned numbers would fail with no idea which
// sentence in which lesson had just become false. So every one of those
// arguments is a named assertion below, and several of them assert that a
// defect is STILL PRESENT, which is the only honest way to pin a course
// written on it.
//
// The goldens were cut by an independent stdlib oracle
// (tools/validation/production/oracle_flowassurance.py) from the published
// method statements rather than from the JS. It works entirely in SI, watts
// and metres and kelvin and seconds, and converts only at the boundary, and it
// computes both inhibitor relations in CELSIUS with the metric constants 1297
// and 72 and converts the answer, so the field constants the engine carries
// have to fall out of the metric ones. Three overall U values, one burial
// limit, three relaxation lengths, three arrival temperatures with their ntu,
// one cooldown, 24 inhibitor rows and two constants.
//
// TWO ROADS AND ONE NUMBER, several times over, and every one of them is
// pinned as TWO.
//
//   The published insulated U is 1.334879072040 Btu/(hr ft2 degF) from the
//   ORACLE and 1.334879113149 from the ENGINE, 3.0796e-8 apart. Both are
//   correct. `publishedUPairRows()` carries them as `goldenUBtuHrFt2F` and
//   `engineUBtuHrFt2F` and a lesson stays on one.
//
//   The Hammerschmidt constant is NOT two roads to one number. The engine
//   carries 2335, the oracle's metric round trip gives 2334.6, and the value
//   at which the module's own two relations meet in the dilute limit is
//   2334.744. That is three values of one constant, it is a fixed ratio on
//   every Hammerschmidt number the engine has ever returned, and the engine
//   gate absorbs it by comparing Hammerschmidt at 5e-4 relative while
//   comparing its neighbour at 1e-9. It is pinned as a RATIO below, not
//   absorbed, because the gap is the teaching point of an Expert module and a
//   tolerance wide enough to hide it is wide enough to hide a real regression
//   beside it.
//
// AND THE SEVENTY EIGHT SHIPPED LESSONS. They were written from
// /root/pd-wip-flowassurance/digest.txt, so a lab value that disagrees with
// that file breaks a lesson that is already written. The last block below
// reads the shipped digest where it is available and checks the lab against
// the lines the lessons quote, at the digest's own printed precision.

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './flowAssuranceLab.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const G = L.GOLDEN;

const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
const near = (a, b, tol) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
const relNear = (a, b, tol) => expect(rel(a, b)).toBeLessThan(tol);

// ---------------------------------------------------------------------------
// 1. THE PUBLISHED CONSTANTS, AND THREE VALUES OF ONE OF THEM.
// ---------------------------------------------------------------------------

describe('the published constants, each read out of the module rather than typed', () => {
  const c = L.publishedConstants();

  it('the Nielsen-Bucklin constant DOES fall out of the metric one, exactly', () => {
    // 72 in degC times 1.8 is 129.6 in degF, and the oracle reached it that
    // way. This is the check the whole SI oracle exists to make possible.
    expect(c.engineNielsenBucklinConstantF).toBe(129.6);
    expect(c.goldenNielsenBucklinFFromMetric).toBe(129.6);
    near(c.nielsenBucklinRelDiff, 0, 1e-15);
  });

  it('and the Hammerschmidt constant DOES NOT, which is a finding rather than a tolerance', () => {
    expect(c.engineHammerschmidtK).toBe(2335);
    expect(c.goldenHammerschmidtKFromMetric).toBe(2334.6);
    relNear(c.hammerschmidtRelDiff, 1.713356e-4, 1e-5);
    // and it is not zero, which is the whole point
    expect(c.hammerschmidtRelDiff).toBeGreaterThan(1e-5);
  });

  it('the engine constants are the ones the two module headers name', () => {
    expect(c.waterMolecularWeight).toBe(18.015);
    expect(c.hammerschmidtReliableWtPct).toBe(25);
    expect(c.maxPracticalWtPct).toBe(70);
    expect(c.steelDensityLbFt3).toBe(490);
  });

  it('the two SI goldens are LABELLED SI and are not converted anywhere in this lab', () => {
    // A per-length resistance in K m / W and one in hr ft degF/Btu per foot
    // are different units, and the lab carries the SI one under a name that
    // says so rather than quietly restating it.
    relNear(c.goldenTotalResistanceSI, 0.272601445462, 1e-11);
    expect(c.goldenBurialAtHalfDiameterSI).toBeLessThan(1e-6);
    expect(c.goldenBurialAtHalfDiameterSI).toBeGreaterThan(0);
  });
});

describe('THREE VALUES OF ONE CONSTANT, and the dilute limit that adjudicates between them', () => {
  const h = L.hammerschmidtConstants();

  it('carries all three and chooses none', () => {
    expect(h.engineK).toBe(2335);
    expect(h.goldenKFromMetric).toBe(2334.6);
    // the two relations meet in the dilute limit only at 129.6 times 18.015
    relNear(h.diluteMatchK, 129.6 * 18.015, 1e-15);
    expect(h.diluteMatchK).not.toBe(h.engineK);
    expect(h.diluteMatchK).not.toBe(h.goldenKFromMetric);
  });

  it('and the dilute limit shows the gap is a CONSTANT and not a curvature', () => {
    const rows = L.diluteLimitRows();
    expect(rows).toHaveLength(4);
    // the ratio walks DOWN toward the constant ratio as the solution dilutes
    rows.forEach((r, i) => {
      if (i === 0) return;
      expect(r.ratio, `${r.weightPct} weight percent`).toBeLessThan(rows[i - 1].ratio);
      expect(r.ratio).toBeGreaterThan(r.constantRatio);
    });
    // and the leftover, the series correction on the logarithm, shrinks with it
    const last = rows[rows.length - 1];
    expect(last.seriesCorrection).toBeLessThan(3e-5);
    relNear(last.ratio, 1.0001124597, 1e-8);
    relNear(h.ratioAtDiluteLimit, 1.0001124597, 1e-8);
    relNear(h.engineOverDiluteMatch, 1.0001096480, 1e-9);
    relNear(h.engineOverGolden, 1.0001713356, 1e-9);
  });

  it('and the engine gate absorbs it by comparing one relation half a million times looser than the other', () => {
    expect(h.hammerschmidtGateTolerance).toBe(5e-4);
    expect(h.nielsenBucklinGateTolerance).toBe(1e-9);
    expect(h.gateToleranceRatio).toBe(500000);
    // the actual gap sits inside the looser one and would not survive the tighter
    expect(rel(h.engineK, h.goldenKFromMetric)).toBeLessThan(h.hammerschmidtGateTolerance);
    expect(rel(h.engineK, h.goldenKFromMetric)).toBeGreaterThan(h.nielsenBucklinGateTolerance);
  });
});

describe('the catalogues are properties offered as defaults, and they refuse an unknown id', () => {
  it('spans three and a half orders of magnitude from steel to aerogel', () => {
    const rows = L.conductivityRows();
    expect(rows.length).toBe(8);
    const steel = rows.find((r) => r.id === 'steel');
    const aerogel = rows.find((r) => r.id === 'aerogel');
    expect(steel.kBtuHrFtF).toBe(26);
    expect(aerogel.kBtuHrFtF).toBe(0.012);
    relNear(aerogel.steelOverThis, 26 / 0.012, 1e-12);
    expect(aerogel.steelOverThis).toBeGreaterThan(2000);
  });

  it('keeps the inside and outside film catalogues separate and reaches both', () => {
    const rows = L.filmRows();
    expect(rows.filter((r) => r.side === 'outside')).toHaveLength(4);
    expect(rows.filter((r) => r.side === 'inside')).toHaveLength(4);
    const flowing = rows.find((r) => r.id === 'liquidFlowing');
    const stagnant = rows.find((r) => r.id === 'stagnant');
    expect(flowing.hBtuHrFt2F / stagnant.hBtuHrFt2F).toBe(60);
  });

  it('NO SILENT FALLBACK: an unknown id is a not-a-number and it propagates into a refusal', () => {
    const r = L.catalogRefusals();
    expect(r[0].isNaN).toBe(true);
    expect(r[1].isNaN).toBe(true);
    expect(r[2].ok).toBe(false);
    expect(r[2].error).toMatch(/could not be resolved/);
  });
});

// ---------------------------------------------------------------------------
// 2. THE PUBLISHED PIPE IN FIVE BUILDS.
// ---------------------------------------------------------------------------

describe('the published pipe reproduces on both roads, in all three published builds', () => {
  const pairs = L.publishedUPairRows();

  it('is three published builds and each carries BOTH roads under distinct names', () => {
    expect(pairs.map((p) => p.build)).toEqual(['bare', 'insulated', 'buried4ft']);
    pairs.forEach((p) => {
      expect(p.published).toBe(true);
      expect(p.goldenUBtuHrFt2F).not.toBe(p.engineUBtuHrFt2F);
      expect(p.uRelDiff).toBeLessThan(1e-7);
      expect(p.uRelDiff).toBeGreaterThan(0);
      expect(p.referenceIdIn).toBe(6.065);
    });
  });

  it('and both roads agree with the committed golden to the conversion factors', () => {
    relNear(pairs[0].goldenUBtuHrFt2F, G.overallU.bare, 1e-15);
    relNear(pairs[0].engineUBtuHrFt2F, 105.9799311355, 1e-10);
    relNear(pairs[1].goldenUBtuHrFt2F, G.overallU.insulated, 1e-15);
    relNear(pairs[1].engineUBtuHrFt2F, 1.334879113149, 1e-10);
    relNear(pairs[2].goldenUBtuHrFt2F, G.overallU.buried4ft, 1e-15);
    relNear(pairs[2].engineUBtuHrFt2F, 0.713200037662, 1e-10);
  });

  it('insulation is what moves U, and burial on top of it is worth far less', () => {
    const r = L.publishedBuildRatios();
    expect(r.bareOverInsulated).toBeGreaterThan(70);
    relNear(r.bareOverInsulated, 79.39290539, 1e-8);
    relNear(r.insulatedOverBuried, 1.87167561, 1e-8);
    relNear(r.bareOverBuried, 148.59776436, 1e-8);
    // the stack ADDS, so once one term dominates the next has little left to do
    expect(r.insulatedOverBuried).toBeLessThan(2);
  });
});

describe('the stack of a build, term by term, with the shares the ENGINE returns', () => {
  it('every build sums its own shares to a hundred', () => {
    L.PUBLISHED_BUILDS.forEach((build) => {
      const s = L.publishedBuildSummary(build);
      expect(s.ok, build).toBe(true);
      near(s.sharesSumPct, 100, 1e-9);
      expect(s.referenceIdIn, build).toBe(6.065);
      // U times its reference IN FEET, times the circle constant, is one over
      // the total resistance, always. The diameter has to be in feet: the
      // engine carries diameters in inches and this identity is the check that
      // the lab converted at the door rather than in the middle.
      relNear(s.conductanceFromU, s.conductancePerFootBtuHrFtF, 1e-12);
      relNear(s.uTimesReferenceIdFt * Math.PI, s.conductancePerFootBtuHrFtF, 1e-12);
    });
  });

  it('the bare build has three terms and the insulated has four and the buried has five', () => {
    expect(L.publishedBuildSummary('bare').termCount).toBe(3);
    expect(L.publishedBuildSummary('insulated').termCount).toBe(4);
    expect(L.publishedBuildSummary('buried4ft').termCount).toBe(5);
  });

  it('on a bare pipe the two FILMS carry most of the stack and the steel carries almost none', () => {
    const rows = L.publishedBuildRows('bare');
    const steel = rows.find((r) => r.term === 'layer0');
    const films = rows.filter((r) => r.term.endsWith('Film'));
    expect(films.reduce((a, r) => a + r.sharePct, 0)).toBeGreaterThan(88);
    relNear(steel.sharePct, 9.09721378, 1e-8);
  });

  it('and on an insulated pipe the FOAM carries almost all of it', () => {
    const foam = L.publishedBuildRows('insulated').find((r) => r.term === 'layer1');
    expect(foam.sharePct).toBeGreaterThan(98);
    relNear(foam.sharePct, 98.88212788, 1e-8);
    relNear(foam.resistance, 0.4665266247, 1e-9);
  });

  it('A SHARE IS A PROPERTY OF A BUILD. The foam resistance never moves and its share moves a lot', () => {
    const rows = L.foamShareRows();
    expect(rows).toHaveLength(4);
    const resistances = new Set(rows.map((r) => r.resistance));
    expect(resistances.size, 'the same layer has to give the same resistance').toBe(1);
    const shares = rows.map((r) => r.sharePct);
    expect(Math.max(...shares) - Math.min(...shares)).toBeGreaterThan(40);
    relNear(Math.max(...shares) - Math.min(...shares), 46.05132348, 1e-7);
    // and two of the four builds are NOT published cases
    expect(rows.filter((r) => r.published)).toHaveLength(2);
  });

  it('the steel carries little because it has the thinnest log AND the largest conductivity', () => {
    const t = L.layerLogTerms();
    relNear(t.steelLogTerm, 0.0883158295, 1e-9);
    relNear(t.foamLogTerm, 0.2638145910, 1e-9);
    relNear(t.logRatio, 2.98717220, 1e-8);
    relNear(t.conductivityRatio, 288.88888889, 1e-8);
    // the product of the two ratios IS the resistance ratio, checked between
    // two engine returns rather than asserted
    relNear(t.productOfRatios, t.resistanceRatio, 1e-12);
    relNear(t.resistanceRatio, 862.960859, 1e-8);
  });

  it('and an unresolvable LAYER is refused rather than skipped, which matters later', () => {
    const r = L.stackRefusals();
    expect(r.map((x) => x.ok)).toEqual([false, false, false]);
    expect(r[0].error).toMatch(/at least one layer/);
    expect(r[1].error).toMatch(/could not be resolved/);
    expect(r[2].error).toMatch(/could not be resolved/);
  });
});

// ---------------------------------------------------------------------------
// 3. INSULATION.
// ---------------------------------------------------------------------------

describe('what thicker foam buys, and where it stops buying it', () => {
  const rows = L.foamThicknessRows();

  it('is a contiguous sweep on published inputs with exactly ONE published row in it', () => {
    expect(rows).toHaveLength(9);
    expect(rows.filter((r) => r.published)).toHaveLength(1);
    expect(rows.find((r) => r.published).foamOdIn).toBe(8.625);
    // the first row has no foam at all, so its foam resistance is null and not zero
    expect(rows[0].foamResistance).toBeNull();
    expect(rows[0].uRatioToRowAbove).toBeNull();
  });

  it('U falls monotonically and the marginal return collapses', () => {
    rows.forEach((r, i) => {
      if (i === 0) return;
      expect(r.engineUBtuHrFt2F, `${r.foamOdIn} in`).toBeLessThan(rows[i - 1].engineUBtuHrFt2F);
      expect(r.uRatioToRowAbove).toBeGreaterThan(1);
    });
    // the first quarter inch divides U by more than twenty
    expect(rows[1].uRatioToRowAbove).toBeGreaterThan(20);
    relNear(rows[1].uRatioToRowAbove, 22.61753379, 1e-8);
    // and the last row, two more inches of wall and eight times the material,
    // by less than one and a half
    expect(rows[rows.length - 1].uRatioToRowAbove).toBeLessThan(1.5);
  });

  it('and the reason is in the log, not in the thickness', () => {
    const l = L.foamLogComparison();
    relNear(l.firstQuarterLog, 0.0727593543, 1e-8);
    relNear(l.outerQuarterLog, 0.0305367239, 1e-8);
    relNear(l.logRatio, 2.38268370, 1e-8);
  });

  it('the layer resistance is exactly inverse in k and the U is NOT', () => {
    const c = L.insulationMaterialContrast();
    relNear(c.layerResistanceRatio, c.conductivityRatio, 1e-12);
    relNear(c.conductivityRatio, 7.5, 1e-12);
    relNear(c.uRatio, 7.42733831, 1e-8);
    expect(c.uRatio).toBeLessThan(c.layerResistanceRatio);
    const rows2 = L.insulationMaterialRows();
    expect(rows2.filter((r) => r.published)).toHaveLength(1);
    expect(rows2.find((r) => r.published).materialId).toBe('syntacticPP');
  });
});

// ---------------------------------------------------------------------------
// 4. BURIAL.
// ---------------------------------------------------------------------------

describe('the trench is one more resistance in the same series', () => {
  it('a pipe LYING ON the bottom gets nothing from the ground, on both roads and in two units', () => {
    const f = L.burialFloor();
    expect(f.burialFt).toBe(8.625 / 24);
    near(f.engineBurialAtHalfDiameterField, 0, 1e-12);
    expect(f.goldenBurialAtHalfDiameterSI).toBeLessThan(1e-6);
    // DIFFERENT UNITS ON PURPOSE, and both are residue of an exact zero
    expect(f.bothAreResidueOfAnExactZero).toBe(true);
    expect(f.exactAnswer).toBe(0);
  });

  it('depth is cheap insulation at first and then it is nothing', () => {
    const rows = L.burialDepthRows();
    expect(rows.filter((r) => r.published)).toHaveLength(1);
    expect(rows.find((r) => r.published).burialFt).toBe(4);
    // the ground term rises with depth but its growth collapses, because
    // acosh grows like a logarithm once the depth is past about one diameter
    const at1 = rows.find((r) => r.burialFt === 1);
    const at2 = rows.find((r) => r.burialFt === 2);
    const at10 = rows.find((r) => r.burialFt === 10);
    const at20 = rows.find((r) => r.burialFt === 20);
    relNear(at2.acoshTerm / at1.acoshTerm, 1.42729466, 1e-7);
    relNear(at20.acoshTerm / at10.acoshTerm, 1.17253653, 1e-7);
    expect(at20.acoshTerm / at10.acoshTerm).toBeLessThan(at2.acoshTerm / at1.acoshTerm);
    // and the published row agrees with the published U
    relNear(rows.find((r) => r.published).engineUBtuHrFt2F, 0.713200037662, 1e-10);
    relNear(rows.find((r) => r.published).groundResistance, 0.4112572083, 1e-9);
    relNear(rows.find((r) => r.published).groundSharePct, 46.571938, 1e-6);
  });

  it('the ground term is exactly inverse in the soil conductivity', () => {
    const rows = L.soilRows();
    const wet = rows.find((r) => r.kSoil === 1.2);
    const dry = rows.find((r) => r.kSoil === 0.5);
    relNear(dry.groundResistance / wet.groundResistance, 1.2 / 0.5, 1e-12);
    expect(rows.filter((r) => r.published)).toHaveLength(1);
  });

  it('and the burial is to the CENTRELINE, which is a reading a careful person gets wrong', () => {
    const c = L.burialCentrelineConvention();
    relNear(c.toCentrelineResistance, 0.4112572083, 1e-9);
    relNear(c.readAsTopOfPipeResistance, 0.4227104126, 1e-9);
    relNear(c.relDiffPct, 2.784925, 1e-6);
    expect(c.readAsTopOfPipeFt).toBeGreaterThan(c.burialFt);
  });
});

// ---------------------------------------------------------------------------
// 5. BRIEF DEFECT (iii). THE GROUND TERM CAUGHT AND DROPPED.
// ---------------------------------------------------------------------------

describe('BRIEF defect (iii): a ground resistance that cannot be computed is DROPPED, not refused', () => {
  const d = L.droppedTrench();

  it('the shallow trench really is unresolvable, and the deep one really is fine', () => {
    expect(d.typoResistanceIsNaN).toBe(true);
    expect(d.typoBurialFt).toBeLessThan(d.halfDiameterFt);
    expect(d.intendedBurialFt).toBeGreaterThan(d.halfDiameterFt);
    expect(Number.isFinite(d.intendedResistance)).toBe(true);
  });

  it('AND THE CALL STILL SUCCEEDS, with no note, no error, and one fewer term', () => {
    expect(d.droppedTermOk).toBe(true);
    expect(d.droppedTermError).toBeNull();
    expect(d.droppedTermNote).toBeNull();
    expect(d.droppedTermHasBurial).toBe(false);
    expect(d.withTermCount - d.droppedTermCount).toBe(1);
  });

  it('the two U values have DISTINCT names and the error is most of a factor', () => {
    expect(d.droppedTermUBtuHrFt2F).toBeGreaterThan(d.withTermUBtuHrFt2F);
    relNear(d.withTermUBtuHrFt2F, 0.7455927364, 1e-9);
    relNear(d.droppedTermUBtuHrFt2F, 1.3348791131, 1e-9);
    relNear(d.uErrorPct, 79.035960, 1e-6);
    relNear(d.withTermGroundSharePct, 44.145299, 1e-6);
  });

  it('and the buried answer IS the exposed answer, to the last bit', () => {
    // the whole finding on one line: nothing in the return says a trench was
    // asked for, because the returned object is identical to a build with no
    // trench in it at all
    expect(d.droppedEqualsExposed).toBe(true);
    expect(d.droppedAgainstExposedRelDiff).toBe(0);
  });

  it('TWO FAILURES, ONE INPUT CLASS, OPPOSITE TREATMENT', () => {
    const a = L.refusalAsymmetry();
    expect(a[0].refused, 'a bad layer').toBe(true);
    expect(a[1].refused, 'a bad trench').toBe(false);
    expect(a[1].ok).toBe(true);
    expect(a[1].error).toBeNull();
  });

  it('and the same shape on the TEACHING line, where the coated diameter is larger', () => {
    const t = L.akasoSwallowedTrench();
    expect(t.teaching).toBe(true);
    expect(t.droppedTermOk).toBe(true);
    expect(t.droppedTermHasBurial).toBe(false);
    expect(t.withTermCount - t.droppedTermCount).toBe(1);
    relNear(t.withTermUBtuHrFt2F, 0.4529728566, 1e-9);
    relNear(t.droppedTermUBtuHrFt2F, 0.6675904532, 1e-9);
    relNear(t.uErrorPct, 47.379792, 1e-6);
  });
});

// ---------------------------------------------------------------------------
// 6. WHAT A U IS REFERRED TO, AND BRIEF DEFECT (iv).
// ---------------------------------------------------------------------------

describe('a U travels with its reference or it means nothing', () => {
  const inv = L.referenceInvariant();

  it('the same physics under two references gives two U values and ONE resistance', () => {
    expect(inv.resistancesRelDiff).toBe(0);
    expect(inv.boreUBtuHrFt2F).not.toBe(inv.coatedUBtuHrFt2F);
    relNear(inv.boreUBtuHrFt2F, 0.713200037662, 1e-10);
    relNear(inv.coatedUBtuHrFt2F, 0.501513997498, 1e-10);
  });

  it('and the ratio of the two U values IS the ratio of the two diameters', () => {
    relNear(inv.uRatio, inv.diameterRatio, 1e-14);
    relNear(inv.diameterRatio, 1.4220939819, 1e-9);
    near(inv.ratioDifference, 0, 1e-14);
    // U times its own reference IN FEET is the same number both ways, and
    // that product times the circle constant is the conductance per foot
    relNear(inv.boreUTimesIdFt, inv.coatedUTimesIdFt, 1e-14);
    relNear(inv.boreUTimesIdFt, 0.360463185702, 1e-11);
    relNear(inv.conductanceFromBoreU, inv.conductancePerFootBtuHrFtF, 1e-12);
  });

  it('BRIEF defect (iv): the two CORRECT routes agree and the mixed one does not', () => {
    const rows = L.mixedReferenceRows();
    expect(rows).toHaveLength(9);
    const byLength = {};
    rows.forEach((r) => { (byLength[r.lengthFt] = byLength[r.lengthFt] || []).push(r); });
    Object.values(byLength).forEach((three) => {
      const [bore, coated, mixed] = three;
      expect(bore.correct).toBe(true);
      expect(coated.correct).toBe(true);
      expect(mixed.correct).toBe(false);
      // the two correct routes agree because the reference cancels
      relNear(coated.relaxationLengthFt, bore.relaxationLengthFt, 1e-14);
      near(coated.arrivalErrorF, 0, 1e-12);
      // and the mixed one is wrong by exactly the reference ratio
      expect(Math.abs(mixed.arrivalErrorF)).toBeGreaterThan(3);
    });
  });

  it('and the relaxation error is the reference ratio and NOTHING else', () => {
    const h = L.mixedReferenceHeadline();
    relNear(h.relaxationErrorPct, h.referenceRatioAsPct, 1e-12);
    relNear(h.relaxationErrorPct, 42.209398, 1e-6);
    relNear(h.worstArrivalErrorF, 15.39298092, 1e-8);
    expect(h.worstAtLengthFt).toBe(105600);
    // THE OMISSION, stated as two counts
    expect(h.consumersThatAcceptAReference).toBe(0);
    expect(h.consumersThatTakeABareIdIn).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// 7. BOTH MASSES, AND THE LAYERS THAT CARRY NONE.
// ---------------------------------------------------------------------------

describe('both mass helpers, and the heat capacity split that reverses their ranking', () => {
  const m = L.publishedMasses();

  it('both masses are geometry and nothing else', () => {
    relNear(m.steelMassLbPerFt, 18.9921056882, 1e-10);
    relNear(m.contentsMassLbPerFt, 11.0344753586, 1e-10);
    relNear(m.steelAreaFt2, 0.0387593994, 1e-9);
    relNear(m.boreAreaFt2, 0.2006268247, 1e-9);
    relNear(m.steelMassLbPerFt, m.steelAreaFt2 * 490, 1e-12);
    relNear(m.contentsMassLbPerFt, m.boreAreaFt2 * 55, 1e-12);
  });

  it('BRIEF point (xi): the steel outweighs the contents and carries LESS of the heat', () => {
    const r = L.massAgainstHeatCapacity();
    expect(r.publishedSteelOutweighsContents).toBe(true);
    relNear(r.publishedSteelOverContentsMass, 1.72116073, 1e-8);
    expect(r.publishedContentsCarriesMostOfTheMcp).toBe(true);
    relNear(r.publishedContentsShareOfMcpPct, 72.534444, 1e-6);
    expect(r.rankingReverses).toBe(true);
    // and on the TEACHING gas line it reverses again
    expect(r.teachingContentsShareOfApiMcpPct).toBeLessThan(50);
    relNear(r.teachingContentsShareOfApiMcpPct, 27.263524, 1e-6);
  });

  it('THE LAYERS THAT CARRY NONE: an unbounded layer list against exactly two mass slots', () => {
    const f = L.publishedFoamMass();
    expect(f.teaching).toBe(true);
    expect(f.layersOverallUAccepted).toBe(2);
    expect(f.massSlotsCooldownOffers).toBe(2);
    expect(f.massSlotsTheFoamFitsInto).toBe(0);
    relNear(f.foamMassLbPerFt, 7.3194745506, 1e-9);
    relNear(f.foamMcpBtuFtF, 2.0494528742, 1e-9);
    relNear(f.asFractionOfCooldownMcpPct, 26.943904, 1e-6);
    expect(f.foamShareOfInsulatedResistancePct).toBeGreaterThan(98);
  });

  it('both helpers refuse what they cannot compute, and they refuse as a BARE not-a-number', () => {
    const r = L.massRefusals();
    expect(r).toHaveLength(3);
    r.forEach((x) => expect(x.isNaN, x.label).toBe(true));
  });

  it('BRIEF defect (x): a not-a-number mass becomes a ZERO mass, and ONE bad slot fails open', () => {
    const d = L.nanMassDrop();
    // both bad is refused correctly, because the TOTAL heat capacity is zero
    expect(d.bothNaNOk).toBe(false);
    expect(d.bothNaNError).toMatch(/needs a heat capacity/);
    // one bad returns a full answer with no note and no error
    expect(d.contentsNaNOk).toBe(true);
    expect(d.contentsNaNNote).toBeNull();
    expect(Number.isFinite(d.contentsNaNHours)).toBe(true);
    // short by exactly the dropped slot's share of the heat capacity
    relNear(-d.droppedAgainstCorrectPct, d.contentsShareOfMcpPct, 1e-12);
    relNear(d.contentsNaNHours, 1.2806433, 1e-6);
    relNear(d.bothGoodHours, 4.6627248, 1e-6);
  });
});

// ---------------------------------------------------------------------------
// 8. THE RELAXATION LENGTH.
// ---------------------------------------------------------------------------

describe('the published relaxation lengths, on both roads', () => {
  const rows = L.goldenRelaxationRows();

  it('is three published cases, each on both roads under distinct names', () => {
    expect(rows).toHaveLength(3);
    rows.forEach((r) => {
      expect(r.published).toBe(true);
      expect(r.goldenRelaxationLengthFt).not.toBe(r.engineRelaxationLengthFt);
      relNear(r.relaxationRelDiff, 7.240504e-9, 1e-4);
    });
    relNear(rows[0].engineRelaxationLengthFt, 14154.02305043, 1e-10);
    relNear(rows[1].engineRelaxationLengthFt, 28308.04610085, 1e-10);
    relNear(rows[2].engineRelaxationLengthFt, 33969.65532102, 1e-10);
  });

  it('and it is EXACTLY linear in the mass rate and in the heat capacity', () => {
    const s = L.relaxationScalings();
    relNear(s.lengthRatioAcrossMassRate, s.massRateRatio, 1e-14);
    relNear(s.lengthRatioAcrossCp, s.cpRatio, 1e-14);
    expect(s.massRateRatio).toBe(2);
    relNear(s.cpRatio, 1.2, 1e-14);
  });

  it('and exactly inverse in U, which is why the reference error carries straight through', () => {
    const rows2 = L.relaxationByBuildRows();
    const bare = rows2.find((r) => r.build === 'bare');
    const insulated = rows2.find((r) => r.build === 'insulated');
    relNear(
      bare.engineRelaxationLengthFt / insulated.engineRelaxationLengthFt,
      insulated.engineUBtuHrFt2F / bare.engineUBtuHrFt2F,
      1e-12,
    );
    relNear(bare.engineRelaxationLengthFt, 356.55635841, 1e-9);
    relNear(insulated.engineRelaxationLengthFt, 28308.04522908, 1e-10);
  });

  it('and it REFUSES as a bare not-a-number rather than as an object with a reason', () => {
    const r = L.relaxationRefusals();
    expect(r).toHaveLength(3);
    r.forEach((x) => {
      expect(x.isNaN, x.label).toBe(true);
      expect(x.isAnObject).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// 9. THE ARRIVAL, THE NTU, AND THE STATION TABLE.
// ---------------------------------------------------------------------------

describe('the published arrivals and their ntu, on both roads', () => {
  const rows = L.goldenProfileRows();

  it('is three published points and NO PRESSURES ANYWHERE', () => {
    expect(rows).toHaveLength(3);
    rows.forEach((r) => {
      expect(r.published).toBe(true);
      expect(r.jouleThomsonTermIsZero).toBe(true);
      expect(r.arrivalRelDiff).toBeLessThan(1e-8);
      expect(r.ntuRelDiff).toBeLessThan(1e-8);
    });
    relNear(rows[0].engineArrivalTempF, 156.177943871283, 1e-11);
    relNear(rows[1].engineArrivalTempF, 95.094251524883, 1e-11);
    relNear(rows[2].engineArrivalTempF, 43.357693442744, 1e-11);
  });

  it('and one relaxation length loses 63 percent of the excess, by construction', () => {
    const sweep = L.ntuSweepRows();
    const atOne = sweep.find((r) => Math.abs(r.ntu - 1) < 1e-9);
    relNear(atOne.retainedExcessFraction, Math.exp(-1), 1e-9);
    relNear(atOne.retainedExcessFraction, 0.367879441171, 1e-10);
    // every row is a SWEEP POINT and none of them is a published case
    sweep.forEach((r) => expect(r.published).toBe(false));
    // past ntu 4 there is nothing left to insulate for
    const atFive = sweep.find((r) => Math.abs(r.ntu - 5) < 1e-9);
    expect(atFive.excessOverAmbientF).toBeLessThan(1);
  });

  it('the station table is monotone and the far end is the coldest point', () => {
    const rows2 = L.publishedStationRows();
    expect(rows2).toHaveLength(21);
    rows2.forEach((r, i) => {
      // NO PRESSURES, so the pressure column is a not-a-number in every row
      expect(r.pressureIsNaN, `station ${i}`).toBe(true);
      if (i === 0) return;
      expect(r.tempF).toBeLessThan(rows2[i - 1].tempF);
      expect(r.dropFromStationAboveF).toBeGreaterThan(0);
    });
    relNear(rows2[0].tempF, 180, 1e-12);
    relNear(rows2[20].tempF, 43.3576934427, 1e-10);
  });

  it('and the ratio of the first drop to the last is NOT exp(ntu)', () => {
    const d = L.stationDropRatio();
    relNear(d.firstIntervalDropF, 23.8220561287, 1e-9);
    relNear(d.lastIntervalDropF, 0.6884883567, 1e-9);
    relNear(d.dropRatio, 34.60052142, 1e-8);
    // it is the ratio of the two starting excesses, checked between engine rows
    relNear(d.dropRatio, d.excessRatioAcrossTheInnerSpan, 1e-11);
    // and the whole line excess ratio is a DIFFERENT number
    relNear(d.wholeLineExcessRatio, 41.69528946, 1e-8);
    expect(d.wholeLineExcessRatio).toBeGreaterThan(d.dropRatio);
  });

  it('the station count is a RESOLUTION setting and the arrival does not move', () => {
    const rows2 = L.stationCountRows();
    rows2.forEach((r) => {
      expect(r.stationsReturned).toBe(r.nStations);
      expect(r.differenceFrom21StationArrivalF, `${r.nStations} stations`).toBe(0);
      expect(r.published).toBe(false);
    });
    // the ugly two station row is KEPT, because it is the one that proves it
    expect(rows2[0].nStations).toBe(2);
  });

  it('and the one direction of the balance that needs no special case is not refused', () => {
    const r = L.profileRefusals();
    expect(r[0].ok).toBe(false);
    expect(r[1].ok).toBe(false);
    expect(r[2].ok).toBe(true);
    // a line colder than its surroundings WARMS towards them on the same
    // exponential, and the engine handles it correctly with no branch at all
    expect(r[2].arrivalTempF).toBeGreaterThan(20);
    expect(r[2].arrivalTempF).toBeLessThan(40);
    relNear(r[2].arrivalTempF, 39.5203295082, 1e-9);
    // it WARMS towards ambient, and it never reaches it
    expect(r[2].arrivalTempF).toBeGreaterThan(20);
  });
});

// ---------------------------------------------------------------------------
// 10. THE INVERSE.
// ---------------------------------------------------------------------------

describe('the U a target arrival needs, and the two ways of being impossible', () => {
  it('every target round trips through the FORWARD profile to machine precision', () => {
    L.uForTargetRows().forEach((r) => {
      expect(r.ok, `${r.targetTempF} degF`).toBe(true);
      near(r.roundTripErrorF, 0, 1e-11);
      relNear(r.forwardArrivalTempF, r.targetTempF, 1e-13);
    });
  });

  it('and a colder target costs more, monotonically', () => {
    const rows = L.uForTargetRows();
    rows.forEach((r, i) => {
      if (i === 0) return;
      expect(r.targetTempF).toBeLessThan(rows[i - 1].targetTempF);
      expect(r.uBtuHrFt2F).toBeGreaterThan(rows[i - 1].uBtuHrFt2F);
    });
    relNear(rows[0].uBtuHrFt2F, 0.220644616732, 1e-11);
    relNear(rows[2].uBtuHrFt2F, 0.801009837807, 1e-11);
  });

  it('THE TWO REFUSALS ARE DIFFERENT REFUSALS and the messages say so', () => {
    const r = L.inverseRefusals();
    expect(r).toHaveLength(4);
    r.forEach((x) => {
      expect(x.ok, `${x.targetTempF}`).toBe(false);
      expect(x.uBtuHrFt2F).toBeNull();
    });
    expect(r[0].reason).toMatch(/cannot arrive above ambient/);
    expect(r[1].reason).toMatch(/cannot arrive above ambient/);
    expect(r[2].reason).toMatch(/already enters below the target/);
    expect(r[3].reason).toMatch(/already enters below the target/);
    expect(r[0].reason).not.toBe(r[2].reason);
  });
});

// ---------------------------------------------------------------------------
// 11. THE PUBLISHED COOLDOWN.
// ---------------------------------------------------------------------------

describe('the published cooldown, on both roads', () => {
  const c = L.publishedCooldown();

  it('agrees with the oracle to the round trip, under distinct names', () => {
    expect(c.ok).toBe(true);
    expect(c.goldenHours).not.toBe(c.engineHours);
    // THE ENGINE ROAD RUNS ON THE ENGINE'S OWN U, which is what the wave's
    // digest does, so the U each road used is part of what separates them.
    // The two gaps are the same ORDER and not the same number, because the
    // oracle computed the whole cooldown in SI rather than running the
    // engine's function on its own U.
    expect(c.uRelDiff).toBeGreaterThan(0);
    expect(c.hoursRelDiff / c.uRelDiff).toBeGreaterThan(0.5);
    expect(c.hoursRelDiff / c.uRelDiff).toBeLessThan(2);
    relNear(c.hoursRelDiff, 3.803658e-8, 1e-4);
    relNear(c.timeConstantRelDiff, 3.803658e-8, 1e-4);
    relNear(c.engineHours, 4.662724855250, 1e-11);
    relNear(c.engineTimeConstantHr, 3.588690771912, 1e-11);
    relNear(c.goldenHours, G.cooldown.hours, 1e-15);
  });

  it('and the no touch time IS the time constant times the log term', () => {
    relNear(c.engineHours, c.engineTimeConstantHr * c.logTerm, 1e-12);
    relNear(c.logTerm, 1.299282984130, 1e-11);
    relNear(c.mcpBtuFtF, 7.606369304989, 1e-11);
    relNear(c.uaPerFtBtuHrFtF, 2.119538792399, 1e-11);
    relNear(c.engineTimeConstantHr, c.mcpBtuFtF / c.uaPerFtBtuHrFtF, 1e-12);
  });

  it('the station table runs past the target, so the last station is always below it', () => {
    const rows = L.publishedCooldownStationRows();
    expect(rows).toHaveLength(25);
    expect(rows[0].hours).toBe(0);
    expect(rows[rows.length - 1].pastTheTarget).toBe(true);
    rows.forEach((r, i) => {
      if (i === 0) return;
      expect(r.hours).toBeGreaterThan(rows[i - 1].hours);
      expect(r.tempF).toBeLessThan(rows[i - 1].tempF);
    });
  });

  it('and NOTHING in the cooldown asks whether the U it got was measured on a flowing line', () => {
    const s = L.stagnantBoreCooldown();
    expect(s.nothingInCooldownAsksWhichUItGot).toBe(true);
    expect(s.stagnantUBtuHrFt2F).toBeLessThan(s.flowingUBtuHrFt2F);
    expect(s.stagnantHours).toBeGreaterThan(s.flowingHours);
    relNear(s.hoursRatio, 1.26163631, 1e-7);
    relNear(s.stagnantHours, 5.8826629631, 1e-9);
  });
});

// ---------------------------------------------------------------------------
// 12. THE TEACHING LINE.
// ---------------------------------------------------------------------------

describe('TEACHING LINE AKASO SPUR, which no oracle has ever checked', () => {
  const d = L.akasoDefinition();

  it('says on its own face that it is a teaching construct with a laboratory boundary', () => {
    expect(d.teaching).toBe(true);
    expect(d.name).toBe('AKASO SPUR');
    expect(d.hydrateBoundaryIsAnInput).toBe(true);
    expect(L.HYDRATE_BOUNDARY_IS_AN_INPUT).toBe(true);
    expect(d.hydrateFlowingF).toBe(71);
    expect(d.hydrateShutInF).toBe(78);
  });

  it('its stack has six terms, a coating and a trench, which no published build has', () => {
    const s = L.akasoStackSummary();
    expect(s.termCount).toBe(6);
    near(s.sharesSumPct, 100, 1e-9);
    relNear(s.engineUBtuHrFt2F, 0.452972856617, 1e-11);
    relNear(s.totalResistance, 0.8818819532, 1e-9);
    expect(s.referenceIdIn).toBe(9.562);
    const rows = L.akasoStackRows();
    rows.forEach((r) => expect(r.teaching).toBe(true));
    relNear(rows.find((r) => r.term === 'layer1').sharePct, 63.45730212, 1e-8);
    relNear(rows.find((r) => r.term === 'burial').sharePct, 32.14809253, 1e-8);
  });

  it('and the reference invariant holds on it too', () => {
    const p = L.akasoReferencePair();
    relNear(p.uRatio, p.diameterRatio, 1e-14);
    relNear(p.diameterRatio, 1.7517255804, 1e-9);
    relNear(p.boreUTimesIdFt, p.coatedUTimesIdFt, 1e-14);
    expect(p.resistancesRelDiff).toBe(0);
  });

  it('take the foam out and the TRENCH term does not move while its share nearly triples', () => {
    const f = L.akasoFoamRemoved();
    relNear(f.trenchResistanceWithFoam, f.trenchResistanceWithoutFoam, 1e-15);
    near(f.trenchResistanceMoved, 0, 1e-15);
    relNear(f.trenchSharePctWithFoam, 32.148093, 1e-6);
    relNear(f.trenchSharePctWithoutFoam, 77.505874, 1e-6);
    relNear(f.uRatio, 2.41090118, 1e-8);
  });

  it('the energy balance on it is the pure exponential with a margin against a laboratory number', () => {
    const h = L.akasoHeatLossOnly();
    expect(h.teaching).toBe(true);
    relNear(h.relaxationLengthFt, 49209.01299043, 1e-10);
    relNear(h.ntu, 1.219288832549, 1e-11);
    relNear(h.retainedExcessFraction, 0.295440199685, 1e-11);
    relNear(h.arrivalTempF, 89.316029952695, 1e-11);
    relNear(h.arrivalExcessOverSeabedF, 44.3160299527, 1e-10);
    relNear(h.marginF, 18.3160299527, 1e-10);
    expect(h.outsideTheHydrateRegion).toBe(true);
    expect(h.hydrateBoundaryIsAnInput).toBe(true);
  });

  it('and no station on it falls below the boundary with heat loss alone', () => {
    const rows = L.akasoStationRows();
    expect(rows).toHaveLength(21);
    expect(rows.filter((r) => r.insideTheHydrateRegion)).toHaveLength(0);
    relNear(rows[20].tempF, 89.3160299527, 1e-10);
    relNear(rows[2].tempF, 177.7816979418, 1e-10);
  });

  it('and the U the boundary needs is ABOVE the U the line has, which says the same thing twice', () => {
    const rows = L.akasoTargetRows();
    const atBoundary = rows.find((r) => r.isTheHydrateBoundary);
    expect(atBoundary.ok).toBe(true);
    relNear(atBoundary.uNeededBtuHrFt2F, 0.651078288819, 1e-11);
    relNear(atBoundary.ratioToTheUThisLineHas, 1.43734504, 1e-8);
    expect(atBoundary.reachable).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 13. BRIEF DEFECT (v). THE MASS THE COOLDOWN USES.
// ---------------------------------------------------------------------------

describe('BRIEF defect (v): the cooldown uses a mass that leaves out most of the line', () => {
  const m = L.akasoMasses();
  const p = L.akasoCooldownPair();

  it('the API reading carries less than half the mass and none of the coating', () => {
    relNear(m.contentsMassLbPerFt, 4.2886768072, 1e-9);
    relNear(m.steelMassLbPerFt, 64.4900327983, 1e-9);
    relNear(m.foamMassLbPerFt, 17.6387337530, 1e-9);
    relNear(m.coatMassLbPerFt, 94.8204657685, 1e-9);
    relNear(m.apiMassLbPerFt, 68.7787096055, 1e-9);
    relNear(m.massLeftOutLbPerFt, 112.4591995215, 1e-9);
    expect(m.massLeftOutLbPerFt).toBeGreaterThan(m.apiMassLbPerFt);
  });

  it('and the layers it leaves out carry MOST of the resistance', () => {
    relNear(m.resistanceShareLeftOutPct, 67.414840, 1e-6);
    expect(m.resistanceShareLeftOutPct).toBeGreaterThan(50);
    expect(p.massSlotsCooldownOffers).toBe(2);
    expect(p.layersOverallUAccepted).toBe(3);
  });

  it('BOTH no touch times are named, and the gap is more than a factor of two', () => {
    relNear(p.apiNoTouchHours, 9.1117122206, 1e-9);
    relNear(p.lumpedNoTouchHours, 32.3290993724, 1e-9);
    relNear(p.hoursRatio, 3.5480816986, 1e-9);
    expect(p.hoursRatio).toBeGreaterThan(2);
    relNear(p.hoursGivenAwayByTheApiReading, 23.2173871518, 1e-9);
  });

  it('and the two ratios are the SAME number, because only the heat capacity moved', () => {
    relNear(p.hoursRatio, p.timeConstantRatio, 1e-13);
    relNear(p.hoursRatio, p.mcpRatio, 1e-13);
    relNear(p.sharedLogTerm, 1.0593915755, 1e-9);
    relNear(p.apiMcpBtuFtF, 9.7528832283, 1e-9);
    relNear(p.lumpedMcpBtuFtF, 34.6040264905, 1e-9);
  });
});

// ---------------------------------------------------------------------------
// 14. BRIEF DEFECT (vi). THE COOLDOWN THAT RUNS BACKWARDS.
// ---------------------------------------------------------------------------

describe('BRIEF defect (vi): an inverted start and target gives a NEGATIVE no touch time', () => {
  const b = L.akasoBackwardsCooldown();

  it('the question is the CORRECT one to ask, not a contrived input', () => {
    // the line stops at the engine arrival and its boundary moves UP once it
    // packs in, so the target really is above the start
    expect(b.targetTempF).toBeGreaterThan(b.startTempF);
    relNear(b.startTempF, 64.1160299527, 1e-10);
    expect(b.targetTempF).toBe(78);
    expect(b.hydrateBoundaryIsAnInput).toBe(true);
  });

  it('and it comes back with ok TRUE, negative hours, no note and no error', () => {
    expect(b.ok).toBe(true);
    expect(b.hoursAreNegative).toBe(true);
    expect(b.note).toBeNull();
    expect(b.error).toBeNull();
    relNear(b.hours, -4.6959175559, 1e-9);
    relNear(b.logTerm, -0.5459803139, 1e-9);
    relNear(b.timeConstantHr, 8.6008917110, 1e-9);
  });

  it('with a full station table that runs BACKWARDS in time and WARMS UP', () => {
    expect(b.stationsReturned).toBe(25);
    expect(b.stationsRunBackwards).toBe(true);
    expect(b.lastStationHours).toBeLessThan(0);
    relNear(b.temperatureRiseAcrossTheTableF, 24.2422513458, 1e-9);
    expect(b.temperatureRiseAcrossTheTableF).toBeGreaterThan(0);
  });

  it('while the MIRROR of the same question, in the same file, is refused with a written reason', () => {
    expect(b.mirrorOk).toBe(false);
    expect(b.mirrorReason).toMatch(/already enters below the target/);
    expect(b.theRightAnswerIsThatThereIsNoNoTouchTime).toBe(true);
  });

  it('and the three branches read as a set with one member missing', () => {
    const br = L.akasoCooldownBranches();
    expect(br).toHaveLength(3);
    expect(br[0].handled).toBe(true);
    expect(br[0].ok).toBe(false);
    expect(br[1].handled).toBe(true);
    expect(br[1].hoursAreInfinite).toBe(true);
    expect(br[1].note).toMatch(/never reaches it/);
    expect(br[1].stationsReturned).toBe(0);
    // the branch the module DOES handle is the shape the missing one should
    // have had: an Infinity, a meaningful time constant, an empty table, a note
    expect(Number.isFinite(br[1].timeConstantHr)).toBe(true);
    expect(br[2].handled).toBe(false);
    expect(br[2].ok).toBe(true);
    expect(br[2].note).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 15. BRIEF DEFECT (ii). THE UNDAMPED JOULE-THOMSON TERM.
// ---------------------------------------------------------------------------

describe('BRIEF defect (ii): the Joule-Thomson term is applied UNDAMPED', () => {
  const j = L.akasoJouleThomson();

  it('the whole term lands at the outlet, so the drop IS the coefficient times the pressure drop', () => {
    relNear(j.engineJtDropF, j.jtCoeffFPerPsi * j.pressureDropPsi, 1e-12);
    relNear(j.engineJtDropF, 25.2, 1e-12);
  });

  it('and the damping the balance asks for is built from ENGINE returns, not from an exponential here', () => {
    // the retained fraction is a RATIO of engine returns and the ntu is an
    // engine return, so nothing in this chain re-implements the profile
    relNear(j.dampingFactor, j.ntu / (1 - j.retainedExcessFraction), 1e-15);
    relNear(j.ntu, 1.219288832549, 1e-11);
    relNear(j.retainedExcessFraction, 0.295440199685, 1e-11);
    relNear(j.dampingFactor, 1.730568266886, 1e-11);
    relNear(j.dampedJtDropF, 14.5616907938, 1e-9);
    relNear(j.spuriousCoolingF, 10.6383092062, 1e-9);
    relNear(j.engineJtDropF / j.dampedJtDropF, j.dampingFactor, 1e-13);
  });

  it('THE THREE ARRIVALS, and THE VERDICT FLIPS between two of them', () => {
    relNear(j.heatLossOnlyArrivalTempF, 89.316029952695, 1e-11);
    relNear(j.dampedJtArrivalTempF, 74.754339158867, 1e-11);
    relNear(j.engineJtArrivalTempF, 64.116029952695, 1e-11);
    relNear(j.heatLossOnlyMarginF, 18.3160299527, 1e-10);
    relNear(j.dampedJtMarginF, 3.7543391589, 1e-9);
    relNear(j.engineJtMarginF, -6.8839700473, 1e-9);
    expect(j.engineSaysInsideTheHydrateRegion).toBe(true);
    expect(j.dampedSaysInsideTheHydrateRegion).toBe(false);
    expect(j.verdictFlips).toBe(true);
  });

  it('the damping factor is near one on a short line and grows without bound on a long one', () => {
    const rows = L.akasoJtLengthRows();
    expect(rows.filter((r) => r.isTheTeachingLength)).toHaveLength(1);
    rows.forEach((r, i) => {
      expect(r.published, `${r.lengthFt} ft`).toBe(false);
      expect(r.dampingFactor).toBeGreaterThan(1);
      if (i === 0) return;
      expect(r.dampingFactor).toBeGreaterThan(rows[i - 1].dampingFactor);
      expect(r.spuriousCoolingF).toBeGreaterThan(rows[i - 1].spuriousCoolingF);
    });
    // and past a certain length the ENGINE arrival crosses the seabed
    expect(rows.some((r) => r.arrivalBelowSeabed)).toBe(true);
    expect(rows.find((r) => r.isTheTeachingLength).arrivalBelowSeabed).toBe(false);
    // THE DAMPED READING ALSO DIPS BELOW THE SEABED, and saying otherwise
    // would be a nicer story than the arithmetic supports. A constant cooling
    // sink inside a relaxing line legitimately takes the fluid below ambient
    // for a while: the sink is laid down faster than the sea can give it back.
    // The finding is the SIZE and not the sign. The damped reading is always
    // above the engine's, by exactly the spurious cooling, and where the
    // engine is tens of degF under the seabed the damped reading is a few.
    rows.forEach((r) => {
      expect(r.dampedJtArrivalTempF, `${r.lengthFt} ft`)
        .toBeGreaterThan(r.engineJtArrivalTempF);
      relNear(r.dampedJtArrivalTempF - r.engineJtArrivalTempF, r.spuriousCoolingF, 1e-12);
    });
    const longest = rows[rows.length - 1];
    expect(longest.seabedTempF - longest.engineJtArrivalTempF)
      .toBeGreaterThan(6 * (longest.seabedTempF - longest.dampedJtArrivalTempF));
  });

  it('and TWO FUNCTIONS IN ONE FILE take opposite positions on the same temperature', () => {
    const b = L.akasoBelowSeabed();
    expect(b.profileOk).toBe(true);
    expect(b.engineJtArrivalTempF).toBeLessThan(b.seabedTempF);
    expect(b.belowSeabedByF).toBeGreaterThan(0);
    relNear(b.engineJtArrivalTempF, 23.6681207564, 1e-9);
    expect(b.inverseOk).toBe(false);
    expect(b.inverseReason).toMatch(/cannot arrive above ambient/);
    expect(b.twoFunctionsOppositePositions).toBe(true);
    // and the damped reading is under the seabed too at this length, by a
    // small fraction of the engine's excursion. The seam is that
    // `uForArrivalTemp` carries NO Joule-Thomson term at all, so it refuses a
    // temperature the profile with a term can legitimately reach. Both
    // functions are self-consistent and neither knows the other was asked.
    expect(b.dampedIsAboveSeabed).toBe(false);
    expect(b.dampedBelowSeabedByF).toBeLessThan(b.belowSeabedByF / 6);
  });
});

// ---------------------------------------------------------------------------
// 16. THE PUBLISHED INHIBITOR TABLE.
// ---------------------------------------------------------------------------

describe('the 24 published inhibitor rows, on both roads', () => {
  const rows = L.goldenInhibitionRows();

  it('is four fluids at six concentrations, every row on both roads', () => {
    expect(rows).toHaveLength(24);
    expect(new Set(rows.map((r) => r.inhibitorId)))
      .toEqual(new Set(['methanol', 'meg', 'deg', 'teg']));
    expect(new Set(rows.map((r) => r.weightPct)))
      .toEqual(new Set([5, 10, 20, 30, 40, 50]));
    rows.forEach((r) => expect(r.published).toBe(true));
  });

  it('Nielsen-Bucklin agrees to machine precision and Hammerschmidt does NOT, by one fixed ratio', () => {
    const hamDiffs = new Set(rows.map((r) => Number(r.hammerschmidtRelDiff.toPrecision(8))));
    // every Hammerschmidt relative difference is the SAME number, because it
    // is one constant against another and nothing else
    expect(hamDiffs.size).toBe(1);
    // and it IS the constant ratio, taken against the golden
    relNear([...hamDiffs][0], 2335 / 2334.6 - 1, 1e-6);
    // the wave's own generator divides by the ENGINE value instead, which is a
    // different number in the fifth figure, and the lab carries both
    const overEngine = new Set(rows.map((r) => Number(r.hammerschmidtRelDiffOverEngine.toPrecision(7))));
    expect(overEngine.size).toBe(1);
    relNear([...overEngine][0], 1.713062e-4, 1e-4);
    rows.forEach((r) => {
      expect(r.nielsenBucklinRelDiff, `${r.inhibitorId} ${r.weightPct}`).toBeLessThan(1e-15);
    });
  });

  it('and the spread between the two relations grows with concentration on every fluid', () => {
    ['methanol', 'meg', 'deg', 'teg'].forEach((id) => {
      const f = rows.filter((r) => r.inhibitorId === id).sort((a, b) => a.weightPct - b.weightPct);
      f.forEach((r, i) => {
        if (i === 0) return;
        expect(r.spreadPctOfHammerschmidt, `${id} ${r.weightPct}`)
          .toBeGreaterThan(f[i - 1].spreadPctOfHammerschmidt);
      });
    });
  });

  it('methanol beats the glycols per pound and the molecular weight does the work', () => {
    const at20 = L.inhibitorRows(20);
    expect(at20.map((r) => r.id)).toEqual(['methanol', 'meg', 'deg', 'teg']);
    at20.forEach((r, i) => {
      if (i === 0) return;
      expect(r.molecularWeight).toBeGreaterThan(at20[i - 1].molecularWeight);
      expect(r.hammerschmidtF).toBeLessThan(at20[i - 1].hammerschmidtF);
    });
    // and only methanol carries the second relation at all
    expect(at20.filter((r) => r.nielsenBucklinAvailable)).toHaveLength(1);
    expect(at20.filter((r) => r.nielsenBucklinF !== null)).toHaveLength(1);
  });

  it('an unknown inhibitor id FALLS BACK to methanol, unlike an unknown conductivity id', () => {
    const f = L.unknownInhibitorFallback();
    expect(f.fellBack).toBe(true);
    expect(f.returnedId).toBe('methanol');
  });

  it('THE RELIABLE LINE IS NOT WHERE THE TWO RELATIONS START TO DISAGREE', () => {
    const r = L.reliableLineReading();
    expect(r.reliableWtPct).toBe(25);
    expect(r.reliable).toBe(true);
    expect(r.basis).toBe('hammerschmidt');
    relNear(r.hammerschmidtF, 24.2925509779, 1e-10);
    relNear(r.nielsenBucklinF, 22.2632773467, 1e-10);
    relNear(r.spreadF, 2.0292736312, 1e-9);
    expect(r.spreadF).toBeGreaterThan(2);
    // and a thousandth of a weight percent past it the BASIS moves although
    // neither relation did
    expect(r.justPastReliable).toBe(false);
    expect(r.justPastBasis).toBe('nielsenBucklin');
    expect(r.recommendedJumpF).toBeLessThan(-2);
  });

  it('and the whole depression sweep switches basis at the line and nowhere else', () => {
    const rows2 = L.depressionRows('methanol');
    expect(rows2).toHaveLength(10);
    rows2.forEach((r) => {
      expect(r.reliable, `${r.weightPct}`).toBe(r.weightPct <= 25);
      expect(r.basis).toBe(r.weightPct <= 25 ? 'hammerschmidt' : 'nielsenBucklin');
      expect(r.ratioHammerschmidtOverNielsenBucklin).toBeGreaterThan(1);
    });
    // a glycol has NO second relation, so its basis never moves at all
    const meg = L.depressionRows('meg');
    meg.forEach((r) => {
      expect(r.nielsenBucklinF).toBeNull();
      expect(r.basis).toBe('hammerschmidt');
      expect(r.ratioHammerschmidtOverNielsenBucklin).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// 17. BRIEF RESULT 4 AND DEFECT (i). SIZED ONE WAY, CHECKED ANOTHER.
// ---------------------------------------------------------------------------

describe('BRIEF defect (i): the dose passes its own check while missing its own target', () => {
  const meoh = L.akasoRequirement('methanol');
  const meg = L.akasoRequirement('meg');

  it('the call returns ok TRUE and required TRUE and no error at all', () => {
    expect(meoh.ok).toBe(true);
    expect(meoh.required).toBe(true);
    expect(meoh.neededDepressionF).toBe(41);
    relNear(meoh.designWtPct, 36.0035520084, 1e-10);
  });

  it('and the SIZED depression and the DELIVERED depression are two different numbers', () => {
    // the relation it sized with agrees with itself, exactly, by construction
    relNear(meoh.sizedDepressionF, meoh.neededDepressionF, 1e-13);
    expect(meoh.sizedRelation).toBe('hammerschmidt');
    // the relation it checked with does not
    relNear(meoh.deliveredDepressionF, 35.6195882812, 1e-10);
    expect(meoh.deliveredRelation).toBe('nielsenBucklin');
    relNear(meoh.shortfallF, 5.3804117188, 1e-9);
    expect(meoh.shortfallF).toBeGreaterThan(5);
  });

  it('and the dose is short of the BARE subcooling before any margin at all', () => {
    relNear(meoh.shortfallAgainstBareSubcoolingF, 0.3804117188, 1e-8);
    expect(meoh.shortOfTheBareSubcooling).toBe(true);
    // which means the design the engine passes leaves the line inside the
    // hydrate region, with the evidence in an adjacent field of the same object
    expect(meoh.engineRecommendedF).toBe(meoh.deliveredDepressionF);
    expect(meoh.engineBasis).toBe('nielsenBucklin');
    expect(meoh.engineReliable).toBe(false);
  });

  it('FOR MEG THERE IS NO CHECK AT ALL, and the design reads as delivering what was ordered', () => {
    expect(meg.thereIsNoCheckAtAll).toBe(true);
    expect(meg.engineCheckNielsenBucklinF).toBeNull();
    expect(meg.engineBasis).toBe('hammerschmidt');
    relNear(meg.engineRecommendedF, 41, 1e-13);
    relNear(meg.designWtPct, 52.1503646614, 1e-10);
    relNear(meg.rateBpd, 466.5311621077, 1e-10);
    // and the number the module declines to compute is the one it already has
    relNear(meg.handRunNielsenBucklinF, meoh.deliveredDepressionF, 1e-14);
  });

  it('because the two doses sit at the SAME MOLE FRACTION, to within a bit or two', () => {
    const s = L.akasoMoleFractionSeam();
    near(s.moleFractionDifference, 0, 1e-15);
    relNear(s.methanolMoleFraction, 0.2403082363926517, 1e-14);
    near(s.deliveredDifferenceF, 0, 1e-12);
    expect(s.methanolHasACheck).toBe(true);
    expect(s.megHasACheck).toBe(false);
  });

  it('and it is true of ALL FOUR fluids, which is why the stated reason does not hold', () => {
    const rows = L.oneNeedFourFluidsRows();
    expect(rows).toHaveLength(4);
    const fractions = rows.map((r) => r.moleFraction);
    fractions.forEach((x) => relNear(x, fractions[0], 1e-14));
    // four different concentrations
    expect(new Set(rows.map((r) => r.designWtPct)).size).toBe(4);
    // one identical Nielsen-Bucklin
    rows.forEach((r) => relNear(r.handRunNielsenBucklinF, rows[0].handRunNielsenBucklinF, 1e-13));
    // and three of the four have no check at all
    expect(rows.filter((r) => r.thereIsNoCheckAtAll)).toHaveLength(3);
    relNear(rows[0].handRunNielsenBucklinF, 31.7647816499, 1e-9);
  });

  it('inverting the OTHER relation costs more inhibitor, and it is a BRACKET on the engine', () => {
    const n = L.akasoNielsenSizedDose('methanol');
    relNear(n.nielsenBucklinSizedWtPct, 39.8251780234, 1e-9);
    relNear(n.wtPctDifference, 3.8216260150, 1e-8);
    // the bracket really does land the depression it was asked for
    relNear(n.checkAtTheNielsenDoseF, n.neededDepressionF, 1e-9);
    relNear(n.nielsenBucklinSizedRateBpd, 362.0655724349, 1e-10);
    relNear(n.extraRateBpd, 54.2902473253, 1e-9);
    relNear(n.extraRatePct, 17.639571, 1e-6);
  });

  it('HOW SHORT IS SHORT: zero below the reliable line, and it proves nothing there', () => {
    const rows = L.shortfallSweepRows();
    const below = rows.filter((r) => r.reliable === true);
    const above = rows.filter((r) => r.reliable === false && r.accepted);
    expect(below.length).toBeGreaterThanOrEqual(2);
    below.forEach((r) => {
      // the check reports the relation it SIZED with, so the shortfall reads
      // as exactly zero and nothing has been checked at all
      expect(r.basis).toBe('hammerschmidt');
      near(r.shortfallF, 0, 1e-12);
      expect(r.shortfallAgainstNielsenBucklinF).toBeGreaterThan(0);
    });
    above.forEach((r, i) => {
      expect(r.ok, `${r.neededDepressionF} degF`).toBe(true);
      expect(r.shortfallF).toBeGreaterThan(0);
      if (i === 0) return;
      expect(r.shortfallF).toBeGreaterThan(above[i - 1].shortfallF);
    });
  });

  it('and the ONE refused row is refused on CONCENTRATION and not on being the worst answer', () => {
    const rows = L.shortfallSweepRows();
    const refused = rows.filter((r) => !r.accepted);
    expect(refused).toHaveLength(1);
    expect(refused[0].refusedOnConcentration).toBe(true);
    expect(refused[0].pastTheCeiling).toBe(true);
    expect(refused[0].error).toMatch(/thermal or a dosing-strategy problem/);
    // and the row just before it, which IS accepted, is short by nearly as much
    const accepted = rows.filter((r) => r.accepted);
    const worstAccepted = accepted[accepted.length - 1];
    expect(worstAccepted.shortfallF).toBeGreaterThan(60);
    expect(worstAccepted.ok).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 18. BRIEF DEFECTS (vii) AND (ix). CEILINGS AND CONVENTIONS.
// ---------------------------------------------------------------------------

describe('BRIEF defect (vii): the ceiling is measured in the coordinates of the relation it distrusts', () => {
  const c = L.ceilingCoordinates();

  it('the two relations disagree by a very wide band at the ceiling itself', () => {
    expect(c.maxPracticalWtPct).toBe(70);
    relNear(c.hammerschmidtAtCeilingF, 170.0478568456, 1e-10);
    relNear(c.nielsenBucklinAtCeilingF, 108.6168490752, 1e-10);
    relNear(c.bandF, 61.4310077704, 1e-9);
    expect(c.bandF).toBeGreaterThan(60);
    relNear(c.hammerschmidtAtCeilingF / c.nielsenBucklinAtCeilingF, 1.5655753071, 1e-9);
  });

  it('and the concentration the CHECK would need for the same depression is past the ceiling', () => {
    expect(c.ceilingInNielsenBucklinWtPct).toBeGreaterThan(c.maxPracticalWtPct);
    relNear(c.ceilingInNielsenBucklinWtPct, 82.8379791409, 1e-8);
    expect(c.theCeilingIsMeasuredIn).toBe('hammerschmidt');
    expect(c.theCheckIsMeasuredIn).toBe('nielsenBucklin');
  });

  it('the refusal prints its concentration off its own limit, at one decimal', () => {
    const r = L.ceilingRefusal();
    expect(r.ok).toBe(false);
    expect(r.weightPct).toBeGreaterThan(r.maxPracticalWtPct);
    expect(r.printedToOneDecimal).toBe('70.3');
    // ONE DECIMAL NARROWS THE COLLISION BY TEN RATHER THAN CLOSING IT
    expect(r.printedWhole).toBe(r.maxPracticalWtPct);
    expect(r.printsAsTheCeiling).toBe(false);
    expect(r.error).toMatch(/70\.3 weight percent/);
  });
});

describe('BRIEF defect (ix): leanWtPct is a weight percent and then a volume percent', () => {
  const rows = L.leanBlendRows();

  it('the engine density is ALWAYS high and the rate is ALWAYS low, never the other way', () => {
    rows.forEach((r) => {
      expect(r.engineStreamDensityLbGal >= r.massAdditiveDensityLbGal, `${r.leanWtPct}`).toBe(true);
      expect(r.engineRateBpd <= r.massAdditiveRateBpd).toBe(true);
      expect(r.rateLowByPctOfEngineRate).toBeGreaterThanOrEqual(0);
    });
  });

  it('at a pure lean stream the seam VANISHES, which is what says it is a blend error', () => {
    const pure = rows.find((r) => r.leanWtPct === 100);
    near(pure.densityDifferenceLbGal, 0, 1e-12);
    near(pure.rateLowByPctOfEngineRate, 0, 1e-12);
    relNear(pure.engineStreamDensityLbGal, pure.inhibitorDensityLbGal, 1e-14);
  });

  it('and the error grows as the stream is diluted', () => {
    const sorted = [...rows].sort((a, b) => b.leanWtPct - a.leanWtPct);
    sorted.forEach((r, i) => {
      if (i === 0) return;
      expect(r.rateLowByPctOfEngineRate, `${r.leanWtPct}`)
        .toBeGreaterThan(sorted[i - 1].rateLowByPctOfEngineRate);
    });
    const at50 = rows.find((r) => r.leanWtPct === 50);
    relNear(at50.rateLowByPctOfEngineRate, 1.375082, 1e-5);
    relNear(at50.engineStreamDensityLbGal, 7.47, 1e-12);
    relNear(at50.massAdditiveDensityLbGal, 7.3686746988, 1e-9);
  });

  it('THE RATE ERROR IS THE DENSITY ERROR, because the mass did not move', () => {
    rows.forEach((r) => relNear(r.rateLowByPctOfEngineRate, r.densityHighByPct, 1e-10));
  });

  it('and on the teaching line both doses are low, by a fraction of a percent', () => {
    const a = L.akasoLeanBlend();
    expect(a).toHaveLength(2);
    const meoh = a.find((r) => r.inhibitorId === 'methanol');
    const meg = a.find((r) => r.inhibitorId === 'meg');
    relNear(meoh.engineStreamDensityLbGal, 6.6696, 1e-12);
    relNear(meoh.massAdditiveDensityLbGal, 6.6555426582, 1e-9);
    relNear(meoh.rateLowByPctOfEngineRate, 0.211213, 1e-5);
    relNear(meoh.massAdditiveRateBpd, 308.4253852443, 1e-9);
    relNear(meg.rateLowByPctOfEngineRate, 0.116326, 1e-5);
    relNear(meg.massAdditiveRateBpd, 467.0738583526, 1e-9);
  });

  it('and the injection rate refuses a lean stream that cannot reach its target', () => {
    const r = L.injectionRefusals();
    expect(r[0].ok).toBe(false);
    expect(r[0].error).toMatch(/not stronger than/);
    expect(r[1].ok).toBe(false);
    expect(r[2].ok).toBe(false);
    // and a fluid already outside the hydrate region is a REAL answer, with no
    // rate at all rather than a rate of zero dressed up as a design
    expect(r[3].ok).toBe(true);
    expect(r[3].required).toBe(false);
    expect(r[3].hasARate).toBe(false);
    expect(r[3].note).toMatch(/outside the hydrate region/);
  });

  it('but a subcooling NOBODY SUPPLIED takes the same branch and fails open', () => {
    const m = L.missingSubcoolingFallsOpen();
    expect(m.ok).toBe(true);
    expect(m.required).toBe(false);
    expect(m.neededDepressionIsNaN).toBe(true);
    expect(m.hasARate).toBe(false);
    expect(m.noteMentionsNotANumber).toBe(true);
    // and from ok and required alone it is indistinguishable from the real answer
    expect(m.theTwoAreIndistinguishableFromOkAndRequired).toBe(true);
    expect(m.outsideOk).toBe(true);
    expect(m.outsideRequired).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 19. THE SHAPE OF THE FILE ITSELF.
// ---------------------------------------------------------------------------

describe('the lab is pure, deterministic, and hands out fresh rows', () => {
  it('every accessor returns the same values twice', () => {
    L.teachingAccessors().forEach(([name, fn]) => {
      expect(JSON.stringify(fn()), name).toBe(JSON.stringify(fn()));
    });
  });

  it('and a panel that mutates a row cannot change what another panel sees', () => {
    const first = L.publishedBuildRows('insulated');
    first[0].resistance = -1;
    first[0].sharePct = -1;
    expect(L.publishedBuildRows('insulated')[0].resistance).toBeGreaterThan(0);
    const rows = L.akasoStationRows();
    rows[0].tempF = -1;
    expect(L.akasoStationRows()[0].tempF).toBe(195);
    const g = L.goldenInhibitionRows();
    g[0].engineHammerschmidtF = -1;
    expect(L.goldenInhibitionRows()[0].engineHammerschmidtF).toBeGreaterThan(0);
  });

  it('the three panel views are frozen and every entry on them resolves', () => {
    [L.thermalExplorer, L.lineExplorer, L.hydrateExplorer].forEach((view) => {
      expect(Object.isFrozen(view)).toBe(true);
      Object.entries(view).forEach(([k, v]) => {
        expect(v, k).toBeDefined();
        if (typeof v === 'function') expect(v(), k).toBeDefined();
      });
    });
  });

  it('re-exports the engine functions rather than copying their values', () => {
    expect(L.MAX_PRACTICAL_WT_PCT).toBe(70);
    expect(L.HAMMERSCHMIDT_RELIABLE_WT_PCT).toBe(25);
    expect(L.NIELSEN_BUCKLIN_CONSTANT_F).toBe(129.6);
    expect(L.STEEL_DENSITY_LB_FT3).toBe(490);
    expect(typeof L.overallU).toBe('function');
    expect(typeof L.steadyStateProfile).toBe('function');
    expect(typeof L.inhibitionRequirement).toBe('function');
    expect(L.INHIBITORS).toHaveLength(4);
    expect(L.CONDUCTIVITIES).toHaveLength(8);
  });

  it('states its limits, and the largest of them is the boundary it never draws', () => {
    const r = L.refusals();
    expect(r.length).toBeGreaterThanOrEqual(15);
    expect(r[0]).toMatch(/HYDRATE BOUNDARY IS NOT COMPUTED/);
    expect(r.join(' ')).toMatch(/lumped capacitance/i);
    expect(r.join(' ')).toMatch(/never checks its start against its target/);
    expect(r.join(' ')).toMatch(/DROPS THE TERM/);
  });

  it('carries no em dash and no en dash anywhere, which is an owner rule', () => {
    // escaped rather than literal, so this assertion is not itself a violation
    const DASH = new RegExp('[\\u2013\\u2014]');
    ['flowAssuranceLab.js', 'flowAssuranceLab.test.js', 'panelCapstoneGuard.test.js',
      'panelModes.test.jsx', 'ThermalExplorer.jsx', 'LineExplorer.jsx', 'HydrateExplorer.jsx']
      .forEach((f) => {
        expect(fs.readFileSync(path.join(HERE, f), 'utf8'), f).not.toMatch(DASH);
      });
    expect(L.refusals().join(' ')).not.toMatch(DASH);
  });

  it('exposes every accessor the leak guard walks, and they all return something', () => {
    const named = L.teachingAccessors();
    expect(named.length).toBeGreaterThan(90);
    named.forEach(([name, fn]) => {
      expect(typeof fn, name).toBe('function');
      expect(fn(), name).toBeDefined();
    });
    expect(L.teachingNumbers().length).toBeGreaterThan(2000);
    L.teachingNumbers().forEach((v) => expect(Number.isFinite(v)).toBe(true));
  });
});

// ---------------------------------------------------------------------------
// 20. AGREEMENT WITH THE SHIPPED DIGEST.
// ---------------------------------------------------------------------------

const DIGEST_PATH = '/root/pd-wip-flowassurance/digest.txt';
const digestAvailable = fs.existsSync(DIGEST_PATH);

describe.skipIf(!digestAvailable)('AGREEMENT WITH THE SHIPPED DIGEST that the 78 lessons quote', () => {
  // A lab value that disagrees with /root/pd-wip-flowassurance/digest.txt
  // breaks a lesson that is already written. Each entry pulls ONE line out of
  // the shipped file by an anchor the digest prints, reads the numbers off it,
  // and checks the lab against them at the digest's own printed precision.
  const lines = digestAvailable ? fs.readFileSync(DIGEST_PATH, 'utf8').split('\n') : [];
  const NUM = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  // Read the numbers AFTER the anchor only. Anchors carry digits of their own,
  // a diameter or a length or a fluid name, and a hyphen in a name reads as a
  // minus sign, so scanning the whole line silently compares the wrong column.
  const numbersOn = (anchor) => {
    const line = lines.find((l) => l.includes(anchor));
    expect(line, `digest has no line containing "${anchor}"`).toBeDefined();
    const tail = line.slice(line.indexOf(anchor) + anchor.length);
    const m = tail.match(NUM);
    expect(m, `no numbers after "${anchor}"`).toBeTruthy();
    return m.map(Number);
  };

  it('is the thirty section file the lessons were written from', () => {
    for (let n = 1; n <= 30; n += 1) {
      expect(lines.some((l) => l.startsWith(`# SECTION ${n}:`)), `section ${n}`).toBe(true);
    }
  });

  it('the published U values agree, on both roads', () => {
    const pairs = L.publishedUPairRows();
    relNear(pairs[0].goldenUBtuHrFt2F,
      numbersOn('golden U, published pipe bare (steel wall only) = ')[0], 1e-11);
    relNear(pairs[0].engineUBtuHrFt2F,
      numbersOn('engine U, published pipe bare (steel wall only) = ')[0], 1e-11);
    relNear(pairs[1].engineUBtuHrFt2F,
      numbersOn('engine U, published pipe insulated (steel + 2.0 in foam) = ')[0], 1e-11);
    relNear(pairs[2].engineUBtuHrFt2F,
      numbersOn('engine U, published pipe buried 4.0 ft in wet soil = ')[0], 1e-11);
    relNear(L.publishedBuildSummary('insulated').totalResistance,
      numbersOn('engine, total resistance of the insulated build, in field units = ')[0], 1e-11);
  });

  it('the resistance shares agree, term for term, on the published insulated build', () => {
    const rows = L.publishedBuildRows('insulated');
    const foam = rows.find((r) => r.term === 'layer1');
    const n = numbersOn('derived, foam layer on build PUBLISHED INSULATED: resistance = ');
    relNear(foam.resistance, n[0], 1e-9);
    relNear(foam.sharePct, n[1], 1e-8);
    const steel = L.publishedBuildRows('bare').find((r) => r.term === 'layer0');
    const s = numbersOn('derived, steel wall on build PUBLISHED BARE: resistance = ');
    relNear(steel.resistance, s[0], 1e-9);
    relNear(steel.sharePct, s[1], 1e-8);
  });

  it('the burial sweep and the dropped ground term agree', () => {
    const published = L.burialDepthRows().find((r) => r.published);
    relNear(published.groundResistance,
      numbersOn('engine PUBLISHED DEPTH, burial to centreline 4.000000 ft: 2H/D = 11.13043478, acosh(2H/D) = 3.1008062984, ground resistance = ')[0], 1e-9);
    const d = L.droppedTrench();
    relNear(d.uErrorPct,
      numbersOn('derived, error in U from the dropped ground term = ')[0], 1e-6);
    relNear(d.withTermGroundSharePct,
      numbersOn('derived, ground share of the correct 3.0 ft stack, which is what was silently removed = ')[0], 1e-6);
  });

  it('the reference pair and the mixed route agree', () => {
    const inv = L.referenceInvariant();
    relNear(inv.diameterRatio, numbersOn('derived, ratio of the two U values = ')[0], 1e-9);
    const h = L.mixedReferenceHeadline();
    relNear(h.relaxationErrorPct,
      numbersOn('derived, the mixed route is wrong on relaxation length by ')[0], 1e-6);
    const at26400 = L.mixedReferenceRows().filter((r) => r.lengthFt === 26400);
    const n = numbersOn('derived, at 26400.0 ft on the buried build: correct arrival = ');
    // [correct arrival, mixed arrival, error, correct ntu, mixed ntu]
    relNear(at26400[0].arrivalTempF, n[0], 1e-9);
    relNear(at26400[2].arrivalTempF, n[1], 1e-9);
    relNear(at26400[2].arrivalErrorF, n[2], 1e-8);
    relNear(at26400[0].ntu, n[3], 1e-8);
    relNear(at26400[2].ntu, n[4], 1e-8);
  });

  it('both published masses and the heat capacity split agree', () => {
    const m = L.publishedMasses();
    relNear(m.steelMassLbPerFt,
      numbersOn('engine, published pipe steel mass, 6.065 in to 6.625 in at 490.0 lbm/ft3 = ')[0], 1e-10);
    relNear(m.contentsMassLbPerFt,
      numbersOn('engine, published contents mass, 6.065 in bore at 55.0 lbm/ft3 = ')[0], 1e-10);
    relNear(m.contentsShareOfMcpPct,
      numbersOn('derived, contents share of that M Cp = ')[0], 1e-6);
    relNear(m.totalMcpBtuFtF,
      numbersOn('derived, total M Cp of the published cooldown case = ')[0], 1e-9);
  });

  it('the relaxation lengths, arrivals and cooldown agree', () => {
    const r = L.goldenRelaxationRows();
    relNear(r[0].engineRelaxationLengthFt,
      numbersOn('engine relaxation case 1: same inputs, relaxation length = ')[0], 1e-11);
    relNear(r[2].engineRelaxationLengthFt,
      numbersOn('engine relaxation case 3: same inputs, relaxation length = ')[0], 1e-11);
    const p = L.goldenProfileRows();
    const n = numbersOn('engine profile point 3: length = 105600.0 ft, ntu = ');
    relNear(p[2].engineNtu, n[0], 1e-11);
    relNear(p[2].engineArrivalTempF, n[1], 1e-11);
    const c = L.publishedCooldown();
    relNear(c.engineHours,
      numbersOn('engine, published cooldown no-touch time = ')[0], 1e-11);
    relNear(c.engineTimeConstantHr,
      numbersOn('engine, published cooldown time constant = ')[0], 1e-11);
  });

  it('the teaching line energy balance agrees', () => {
    const h = L.akasoHeatLossOnly();
    relNear(h.engineUBtuHrFt2F,
      numbersOn('teaching, AKASO SPUR overall U referred to the bore = ')[0], 1e-11);
    relNear(h.relaxationLengthFt,
      numbersOn('teaching, AKASO SPUR relaxation length = ')[0], 1e-10);
    relNear(h.ntu,
      numbersOn('teaching, AKASO SPUR ntu over 60000.0 ft = ')[0], 1e-11);
    relNear(h.arrivalTempF,
      numbersOn('teaching, AKASO SPUR arrival with heat loss only = ')[0], 1e-11);
    relNear(h.marginF,
      numbersOn('teaching, AKASO SPUR margin against the 71.00 degF flowing hydrate boundary, heat loss only = ')[0], 1e-10);
  });

  it('the two cooldown readings and the backwards branch agree', () => {
    const p = L.akasoCooldownPair();
    relNear(p.apiNoTouchHours,
      numbersOn('teaching, API READING: no-touch time = ')[0], 1e-9);
    relNear(p.lumpedNoTouchHours,
      numbersOn('teaching, LUMPED READING, insulation and weight coat folded into the shell slot at their own heat capacities: no-touch time = ')[0], 1e-9);
    relNear(p.hoursRatio,
      numbersOn('teaching, ratio of the lumped no-touch time to the API one = ')[0], 1e-9);
    const b = L.akasoBackwardsCooldown();
    const n = numbersOn('degF against a 45.0 degF seabed: ok = true, hours = ');
    relNear(b.hours, n[0], 1e-9);
    relNear(b.timeConstantHr, n[1], 1e-9);
    relNear(b.temperatureRiseAcrossTheTableF,
      numbersOn('teaching, temperature RISE across that station table = ')[0], 1e-9);
  });

  it('THE THREE ARRIVALS AND THE DAMPING FACTOR agree', () => {
    const j = L.akasoJouleThomson();
    relNear(j.dampingFactor,
      numbersOn('derived, the correct damping factor ntu / (1 - exp(-ntu)) = ')[0], 1e-11);
    relNear(j.dampedJtDropF,
      numbersOn('derived, the Joule-Thomson term correctly damped = ')[0], 1e-9);
    relNear(j.spuriousCoolingF,
      numbersOn('derived, the term the engine applies in excess of the damped one = ')[0], 1e-9);
    relNear(j.heatLossOnlyArrivalTempF,
      numbersOn('teaching, ARRIVAL 1 heat loss only, no pressures passed = ')[0], 1e-11);
    relNear(j.dampedJtArrivalTempF,
      numbersOn('derived, ARRIVAL 2 heat loss plus the CORRECTLY DAMPED term = ')[0], 1e-11);
    relNear(j.engineJtArrivalTempF,
      numbersOn('engine, ARRIVAL 3 what steadyStateProfile RETURNS, term undamped = ')[0], 1e-11);
  });

  it('the length sweep that drives the arrival below the seabed agrees, row for row', () => {
    L.akasoJtLengthRows()
      .filter((r) => [60000, 90000, 120000, 150000, 180000, 210000].includes(r.lengthFt))
      .forEach((r) => {
        const n = numbersOn(`derived sweep point, length ${r.lengthFt}.0 ft: ntu = `);
        // [ntu, heat loss arrival, damped arrival, engine arrival]
        relNear(r.ntu, n[0], 1e-9);
        relNear(r.heatLossOnlyArrivalTempF, n[1], 1e-9);
        relNear(r.dampedJtArrivalTempF, n[2], 1e-9);
        relNear(r.engineJtArrivalTempF, n[3], 1e-9);
      });
  });

  it('the requirement chain agrees, for methanol and for MEG', () => {
    const meoh = L.akasoRequirement('methanol');
    relNear(meoh.designWtPct,
      numbersOn('teaching, inhibitionRequirement methanol returns: ok = true, required = true, weightPct = ')[0], 1e-10);
    const sized = numbersOn('teaching, the sized depression against the delivered depression: sized ');
    relNear(meoh.sizedDepressionF, sized[0], 1e-11);
    relNear(meoh.deliveredDepressionF, sized[1], 1e-10);
    relNear(meoh.shortfallF,
      numbersOn('teaching, SHORTFALL against what was asked for = ')[0], 1e-9);
    relNear(meoh.shortfallAgainstBareSubcoolingF,
      numbersOn('teaching, SHORTFALL against the BARE subcooling with no margin at all = ')[0], 1e-8);
    relNear(meoh.rateBpd,
      numbersOn('teaching, injectionRate on that dose: rateBpd = ')[0], 1e-10);
    const meg = L.akasoRequirement('meg');
    relNear(meg.designWtPct,
      numbersOn('teaching, inhibitionRequirement MEG on the same 41.00 degF need returns: ok = true, required = true, weightPct = ')[0], 1e-10);
    relNear(meg.rateBpd,
      numbersOn('teaching, injectionRate on the MEG dose: rateBpd = ')[0], 1e-10);
    relNear(meg.handRunNielsenBucklinF,
      numbersOn('derived, running nielsenBucklinDepression on that MEG concentration by hand gives ')[0], 1e-10);
  });

  it('the Nielsen-Bucklin sized dose and the ceiling agree', () => {
    const n = L.akasoNielsenSizedDose('methanol');
    relNear(n.nielsenBucklinSizedWtPct,
      numbersOn('derived, inverting NIELSEN-BUCKLIN instead for the same 41.00 degF need gives ')[0], 1e-9);
    relNear(n.nielsenBucklinSizedRateBpd,
      numbersOn('derived, the injection rate at that concentration on the teaching line = ')[0], 1e-10);
    const c = L.ceilingCoordinates();
    const k = numbersOn('engine, methanol at the 70.0 weight percent ceiling: hammerschmidtDepression = ');
    relNear(c.hammerschmidtAtCeilingF, k[0], 1e-10);
    relNear(c.nielsenBucklinAtCeilingF, k[1], 1e-10);
    relNear(c.bandF,
      numbersOn('derived, the BAND the engine will design inside and the chemistry it checks against cannot deliver = ')[0], 1e-9);
  });

  it('the lean blend and the four fluid mole fraction agree', () => {
    const a = L.akasoLeanBlend();
    const meoh = a.find((r) => r.inhibitorId === 'methanol');
    const n = numbersOn('teaching, methanol lean 96.0 weight percent: engine streamDensityLbGal = ');
    relNear(meoh.engineStreamDensityLbGal, n[0], 1e-12);
    relNear(meoh.massAdditiveDensityLbGal, n[1], 1e-9);
    relNear(meoh.rateLowByPctOfEngineRate, n[2], 1e-5);
    const rows = L.oneNeedFourFluidsRows();
    rows.forEach((r) => {
      const m = numbersOn(`engine, ${r.inhibitorId}: k = 2335.0, molecular weight = `);
      // [molecularWeight, designWtPct, moleFraction, hammerschmidtBack, nielsenBucklin]
      relNear(r.designWtPct, m[1], 1e-9);
      relNear(r.moleFraction, m[2], 1e-13);
      relNear(r.handRunNielsenBucklinF, m[4], 1e-9);
    });
  });

  it('and the three values of the Hammerschmidt constant agree', () => {
    const h = L.hammerschmidtConstants();
    relNear(h.engineK,
      numbersOn('engine constant, the Hammerschmidt K the module carries = ')[0], 1e-14);
    relNear(h.diluteMatchK,
      numbersOn('derived, the Hammerschmidt K that makes the module own two relations meet in the dilute limit, 129.6 times 18.015 = ')[0], 1e-12);
    relNear(h.goldenKFromMetric,
      numbersOn('golden constant, the Hammerschmidt K the oracle reaches through the metric round trip, 1297 times 1.8 = ')[0], 1e-14);
    relNear(h.engineOverDiluteMatch,
      numbersOn('derived, ratio of the carried K to the meeting K = ')[0], 1e-9);
    relNear(h.engineOverGolden,
      numbersOn('derived, ratio of the carried K to the metric K = ')[0], 1e-9);
  });
});
