// THE H3 TEACHING LAB: Process Safety: LOPA & SIL Determination.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/hse/lopa.js, sha-identical with petrolord-engines
// 6703c00) on the teaching streams below, on the published worked SIF read
// from the vendored golden, or on the inputs a learner types into a panel. The
// teaching streams are the same streams the wave's digest generator runs
// (tools/course-waves/lopa/h3_fields.mjs), and lopaLab.test.js asserts they are
// deep-equal and that every number a teaching reader returns is printed in the
// digest.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone facility or input, and panelCapstoneGuard.test.js greps this
// file, the three panels and the learning page for every rendering of all
// eighteen answers and every distinctive capstone input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. A panel that shows a refusal shows the
// engine's own `error` string, so the lesson that quotes it and the panel agree.
//
// FAILURE RATES ARE ILLUSTRATIVE, never data.
//
// Nothing here reads a clock, a random number or a locale.
import * as E from '@petrolord/engines/engines/hse/lopa.js';
import GOLD from '@petrolord/engines/test-data/hse/goldens/lopa_cases.json';

const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

/* ------------------------------------------------------------ the streams */

const EKULAMA_FULL = freeze({
  lambdaDuPerHour: 1.2e-6, lambdaDdPerHour: 2.8e-6, proofTestIntervalHours: 8760,
  mttrHours: 8, mrtHours: 8, beta: 0.05, betaD: 0.02,
});

export const STREAMS = Object.freeze({
  ORONI: freeze({
    initiatingEventFrequencyPerYr: 0.45,
    initiatingEvent: 'level control valve fails open',
    enablingConditions: [{ name: 'separator on the high pressure manifold', probability: 0.3 }],
    conditionalModifiers: [
      { name: 'ignition', probability: 0.5 },
      { name: 'operator in the blast zone', probability: 0.2 },
    ],
    ipls: [
      { name: 'high level alarm with operator response', pfd: 0.1, independent: true },
      { name: 'relief valve sized for the blocked outlet case', pfd: 0.01, independent: true },
      { name: 'BPCS level trip on the initiating controller', pfd: 0.1, independent: false },
      { name: 'operator round on a procedure never audited', pfd: 0.1, independent: true, auditable: false },
    ],
    tmelPerYr: 1e-6,
  }),
  TMEL_LADDER: Object.freeze([1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10]),
  LOOP_TMEL: 1e-7,
  PROPOSED_SIFS: Object.freeze([0.02, 0.009, 0.005, 0.0005]),
  PFD_LADDER: Object.freeze([1, 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 1e-4, 5e-5, 1e-5, 5e-6]),
  RRF_LADDER: Object.freeze([0.5, 1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000]),
  SNAP_PRODUCTS: freeze([
    { factors: [0.1, 0.1, 0.1], tmelPerYr: 1e-5 },
    { factors: [0.3, 0.1], tmelPerYr: 3e-4 },
    { factors: [0.2, 0.5, 0.1], tmelPerYr: 1e-4 },
    { factors: [0.7, 0.1, 0.1], tmelPerYr: 7e-5 },
    { factors: [0.9, 0.1], tmelPerYr: 9e-4 },
  ]),
  SNAP_WIDTH: Object.freeze([100, 100.0000001, 100.000001, 100.00001, 99.9999999]),
  EKULAMA_DU: freeze({ lambdaDuPerHour: 1.2e-6, proofTestIntervalHours: 8760, beta: 0.05 }),
  EKULAMA_FULL,
  MRT_LADDER: Object.freeze([0, 8, 24, 72, 168]),
  BETA_LADDER: Object.freeze([0, 0.02, 0.05, 0.1, 0.2]),
  OBAGI_VALVE: freeze({
    architecture: '1oo1', lambdaDuPerHour: 9e-7, proofTestIntervalHours: 8760, mrtHours: 24, lifetimeHours: 87600,
  }),
  PTC_LADDER: Object.freeze([1, 0.95, 0.9, 0.8, 0.7]),
  OBAGI_TARGET_PFDAVG: 0.02,
  IDU: freeze({
    transmitters: { architecture: '2oo3', ...EKULAMA_FULL },
    logicSolver: {
      architecture: '1oo1', lambdaDuPerHour: 3e-8, lambdaDdPerHour: 6e-7, proofTestIntervalHours: 8760, mttrHours: 8, mrtHours: 8,
    },
    valves: {
      architecture: '1oo2', lambdaDuPerHour: 2.6e-6, proofTestIntervalHours: 8760, mrtHours: 24, beta: 0.1,
    },
  }),
  SENS_INTERVALS: Object.freeze([2190, 4380, 8760, 17520, 35040, 70080]),
  VALVE_TARGETS: Object.freeze([5e-4, 1e-3, 2e-3, 5e-3, 1e-2]),
  STATE_CASES: freeze({
    UNACHIEVABLE: { params: { architecture: '1oo1', lambdaDuPerHour: 1e-6, lambdaDdPerHour: 2e-4, mttrHours: 72 }, target: 0.01 },
    INTERVAL_INDEPENDENT: { params: { architecture: '1oo1', lambdaDuPerHour: 0, lambdaDdPerHour: 1e-6, mttrHours: 8 }, target: 0.01 },
    CAPPED_AT_LIFETIME: { params: { architecture: '1oo1', lambdaDuPerHour: 2e-8, proofTestCoverage: 0.9, lifetimeHours: 87600 }, target: 0.01 },
  }),
  T2_YEARS: Object.freeze([5, 8, 10, 12, 15]),
  STRETCH_YEARS: Object.freeze([1, 2, 3, 3.5, 4]),
});

export const ARCHITECTURES = E.ARCHITECTURES;
export const HOURS_PER_YEAR = E.HOURS_PER_YEAR;
const REDUNDANT = new Set(['1oo2', '2oo3', '1oo3']);

/* ------------------------------------------------ what a learner can type */

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

/** A comma, space or newline separated list of numbers. */
export const parseSeries = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the list is empty' };
  const parts = text.split(/[\s,;]+/).filter((p) => p !== '');
  const values = parts.map(Number);
  const bad = parts.filter((p, i) => !Number.isFinite(values[i]));
  if (bad.length) return { error: `these entries are not numbers: ${bad.join(', ')}` };
  return { values };
};

/**
 * Enabling conditions or conditional modifiers, one per line as
 * "name, probability". The engine checks every probability; this only splits.
 */
export const parseProbabilityRows = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { rows: [] };
  const rows = text.split('\n').map((l) => l.trim()).filter((l) => l !== '').map((l) => {
    const i = l.lastIndexOf(',');
    if (i === -1) return { name: l, probability: undefined };
    return { name: l.slice(0, i).trim(), probability: parseNumber(l.slice(i + 1).trim()) };
  });
  return { rows };
};

/**
 * IPLs, one per line as "name, PFD, independent" with an optional fourth
 * column "auditable". The independence column is passed to the engine as the
 * boolean true only when the learner types true; anything else reaches the
 * engine as typed, and the engine decides the credit.
 */
export const parseIplRows = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { rows: [] };
  const flag = (s) => {
    if (s === undefined) return undefined;
    const t = s.trim();
    if (t === 'true') return true;
    if (t === 'false') return false;
    return t;
  };
  const rows = text.split('\n').map((l) => l.trim()).filter((l) => l !== '').map((l) => {
    const c = l.split(',');
    const row = { name: (c[0] || '').trim(), pfd: parseNumber((c[1] || '').trim()), independent: flag(c[2]) };
    const aud = flag(c[3]);
    if (aud !== undefined) row.auditable = aud;
    return row;
  });
  return { rows };
};

export const rowsText = (rows) => rows.map((r) => `${r.name}, ${r.probability}`).join('\n');
export const iplText = (rows) => rows.map((r) => `${r.name}, ${r.pfd}, ${r.independent}${r.auditable === undefined ? '' : `, ${r.auditable}`}`).join('\n');

// The interactive routes are the engine's own functions, unchanged: a panel
// passes what the learner typed and shows what the engine returned, refusals
// included.
export const scenario = (args) => E.lopaScenario(args);
export const outcomeOf = (rrf) => E.outcomeFromRequiredRrf(rrf);
export const bandOf = (pfdAvg) => E.silFromPfdAvg(pfdAvg);
export const subsystem = (params) => E.pfdAvgSubsystem(params);
export const sifOf = (subsystems) => E.pfdAvgSif(subsystems);
export const sensitivity = (params, intervals) => E.proofTestSensitivity(params, intervals);
export const longest = (params, target) => E.maxProofTestInterval(params, target);
export const decadeOf = (x) => E.decadeOf(x);

/* ------------------------------------------------- the teaching readers */

const S = STREAMS;
const lopaOf = (s, extra = {}) => E.lopaScenario({
  initiatingEventFrequencyPerYr: s.initiatingEventFrequencyPerYr,
  enablingConditions: s.enablingConditions,
  conditionalModifiers: s.conditionalModifiers,
  ipls: s.ipls,
  tmelPerYr: s.tmelPerYr,
  ...extra,
});

/** Associate: the ORONI row, its credit and its TMEL ladder. */
export const worksheet = () => {
  const r = lopaOf(S.ORONI);
  return {
    enablingProduct: r.enablingProduct,
    modifierProduct: r.modifierProduct,
    unmitigatedFrequencyPerYr: r.unmitigatedFrequencyPerYr,
    iplProduct: r.iplProduct,
    mitigatedFrequencyWithoutSifPerYr: r.mitigatedFrequencyWithoutSifPerYr,
    tmelPerYr: r.tmelPerYr,
    requiredRrf: r.requiredRrf,
    requiredSifPfdAvg: r.requiredSifPfdAvg,
    outcome: r.outcome,
    requiredSil: r.requiredSil,
    credited: r.credited.map((c) => c.name),
    notCredited: r.notCredited.map((c) => ({ name: c.name, reason: c.reason })),
    creditRule: r.basis.creditRule,
    ladder: S.TMEL_LADDER.map((t) => {
      const x = lopaOf({ ...S.ORONI, tmelPerYr: t });
      return { tmelPerYr: t, requiredRrf: x.requiredRrf, outcome: x.outcome, requiredSil: x.requiredSil, requiredSifPfdAvg: x.requiredSifPfdAvg };
    }),
  };
};

/** Associate: ORONI with one term left out at a time. */
export const forgotten = () => {
  const full = lopaOf(S.ORONI).unmitigatedFrequencyPerYr;
  const O = S.ORONI;
  return [
    ['nothing left out', O],
    ['the enabling condition left out', { ...O, enablingConditions: [] }],
    ['ignition left out', { ...O, conditionalModifiers: O.conditionalModifiers.filter((m) => m.name !== 'ignition') }],
    ['the blast zone modifier left out', { ...O, conditionalModifiers: O.conditionalModifiers.filter((m) => m.name === 'ignition') }],
    ['every modifier left out', { ...O, conditionalModifiers: [] }],
  ].map(([what, s]) => {
    const f = lopaOf(s).unmitigatedFrequencyPerYr;
    return { what, unmitigatedFrequencyPerYr: f, overFull: f / full };
  });
};

/** Associate: ORONI at the loop TMEL closed with four proposed SIFs. */
export const loop = () => {
  const base = lopaOf({ ...S.ORONI, tmelPerYr: S.LOOP_TMEL });
  return {
    requiredSifPfdAvg: base.requiredSifPfdAvg,
    outcome: base.outcome,
    rows: S.PROPOSED_SIFS.map((p) => {
      const r = lopaOf({ ...S.ORONI, tmelPerYr: S.LOOP_TMEL }, { sifPfdAvg: p });
      return { sifPfdAvg: p, sifSil: r.sifBand.sil, mitigatedFrequencyPerYr: r.mitigatedFrequencyPerYr, meetsTmel: r.meetsTmel };
    }),
  };
};

/** Associate: the outcome states and the low demand bands. */
export const bands = () => ({
  outcomes: S.RRF_LADDER.map((rrf) => {
    const r = E.outcomeFromRequiredRrf(rrf);
    return { rrf, outcome: r.outcome, requiredSil: r.requiredSil, requiredSifPfdAvg: r.requiredSifPfdAvg };
  }),
  pfds: S.PFD_LADDER.map((p) => {
    const r = E.silFromPfdAvg(p);
    return { pfdAvg: p, sil: r.sil, state: r.state };
  }),
  convention: E.silFromPfdAvg(0.01).basis,
});

/** Associate: the decade snap on products whose exact value is a decade. */
export const snap = () => ({
  snap: E.DECADE_SNAP,
  products: S.SNAP_PRODUCTS.map((p) => {
    const x = p.factors.reduce((a, b) => a * b, 1) / p.tmelPerYr;
    return { factors: p.factors.join(' x '), double: x.toPrecision(17), decade: E.decadeOf(x), outcome: E.outcomeFromRequiredRrf(x).outcome };
  }),
  width: S.SNAP_WIDTH.map((x) => ({ rrf: String(x), decade: E.decadeOf(x), outcome: E.outcomeFromRequiredRrf(x).outcome })),
});

/** Professional: the simplified forms on the EKULAMA DU-only channel. */
export const simplified = () => ARCHITECTURES.map((architecture) => {
  const p = {
    architecture,
    lambdaDuPerHour: S.EKULAMA_DU.lambdaDuPerHour,
    proofTestIntervalHours: S.EKULAMA_DU.proofTestIntervalHours,
    ...(REDUNDANT.has(architecture) ? { beta: S.EKULAMA_DU.beta } : {}),
  };
  const r = E.pfdAvgSubsystem(p);
  return { architecture, pfdAvg: r.pfdAvg, rrf: r.rrf, sil: r.sil };
});

/** Professional: the full Annex B form on the EKULAMA channel, every architecture. */
export const annexB = () => ARCHITECTURES.map((architecture) => {
  const r = E.pfdAvgSubsystem({ architecture, ...S.EKULAMA_FULL });
  return {
    architecture, tCE: r.tCE, tGE: r.tGE, tG2E: r.tG2E, independent: r.terms.independent,
    ccfDU: r.terms.ccfDU, ccfDD: r.terms.ccfDD, pfdAvg: r.pfdAvg, rrf: r.rrf, sil: r.sil, dominant: r.dominant,
    formula: r.basis.formula,
  };
});

/** Professional: the MRT swept on the EKULAMA 1oo2. */
export const mrtSweep = () => S.MRT_LADDER.map((mrtHours) => {
  const r = E.pfdAvgSubsystem({ architecture: '1oo2', ...S.EKULAMA_FULL, mrtHours });
  return { mrtHours, tCE: r.tCE, tGE: r.tGE, pfdAvg: r.pfdAvg };
});

/** Professional: proof test coverage swept on the OBAGI valve. */
export const coverageSweep = () => S.PTC_LADDER.map((proofTestCoverage) => {
  const r = E.pfdAvgSubsystem({ ...S.OBAGI_VALVE, proofTestCoverage });
  return { proofTestCoverage, tCE: r.tCE, pfdAvg: r.pfdAvg, rrf: r.rrf, sil: r.sil };
});

/** Professional: the beta factor swept on the EKULAMA 1oo2 and 2oo3, betaD half of it. */
export const betaSweep = () => S.BETA_LADDER.flatMap((beta) => ['1oo2', '2oo3'].map((architecture) => {
  const r = E.pfdAvgSubsystem({ architecture, ...S.EKULAMA_FULL, beta, betaD: beta / 2 });
  return {
    architecture, beta, independent: r.terms.independent, commonCause: r.terms.ccfDU + r.terms.ccfDD, pfdAvg: r.pfdAvg, dominant: r.dominant,
  };
}));

/** Professional: 2oo2 with and without a typed beta factor. */
export const twoOfTwo = () => {
  const without = E.pfdAvgSubsystem({ architecture: '2oo2', ...S.EKULAMA_FULL, beta: undefined, betaD: undefined });
  const typed = E.pfdAvgSubsystem({ architecture: '2oo2', ...S.EKULAMA_FULL });
  return { without: without.pfdAvg, typed: typed.pfdAvg, warnings: typed.warnings, formula: typed.basis.formula };
};

/** Professional: the IDU teaching SIF and the ORONI row it answers. */
export const iduSif = () => {
  const I = S.IDU;
  const r = E.pfdAvgSif([{ name: 'transmitters', ...I.transmitters }, { name: 'logic solver', ...I.logicSolver }, { name: 'valves', ...I.valves }]);
  const l = lopaOf({ ...S.ORONI, tmelPerYr: S.LOOP_TMEL }, { sifPfdAvg: r.pfdAvg });
  return {
    parts: r.parts.map((p) => ({ name: p.name, architecture: p.architecture, pfdAvg: p.pfdAvg })),
    pfdAvg: r.pfdAvg, rrf: r.rrf, sil: r.sil,
    mitigatedFrequencyPerYr: l.mitigatedFrequencyPerYr, meetsTmel: l.meetsTmel, requiredSifPfdAvg: l.requiredSifPfdAvg,
  };
};

const PUBLISHED_IDS = ['dolan-pt-2oo3', 'dolan-ai-2oo3', 'dolan-cpu-1oo2', 'dolan-do-1oo2', 'dolan-valve-1oo2'];
const sig3 = (x) => Number(x).toExponential(2).toUpperCase().replace('E-0', 'E-').replace(/E-(\d)$/, 'E-0$1');

/** Professional: the published worked SIF from the vendored golden, through the engine. */
export const publishedSif = () => {
  const rows = PUBLISHED_IDS.map((id) => {
    const c = GOLD.pfdPublished.find((x) => x.id === id);
    const r = E.pfdAvgSubsystem(c.params);
    return { id, params: c.params, pfdAvg: r.pfdAvg, threeFigures: sig3(r.pfdAvg), printed: c.printed };
  });
  const total = E.pfdAvgSif(GOLD.sifPublished.subsystems);
  return {
    source: GOLD.sifPublished.source,
    rows,
    pfdAvg: total.pfdAvg,
    rrf: total.rrf,
    sil: total.sil,
    printed: GOLD.sifPublished.printed,
  };
};

const SENS_SETS = () => [
  ['EKULAMA 1oo1, DU only', { architecture: '1oo1', lambdaDuPerHour: S.EKULAMA_DU.lambdaDuPerHour, proofTestIntervalHours: 8760 }],
  ['EKULAMA full 1oo2', { architecture: '1oo2', ...S.EKULAMA_FULL }],
  ['EKULAMA full 2oo3', { architecture: '2oo3', ...S.EKULAMA_FULL }],
  ['IDU valves 1oo2', S.IDU.valves],
];

/** Expert: PFDavg against the proof test interval, four subsystems. */
export const sensitivityTable = () => SENS_SETS().map(([label, p]) => {
  const r = E.proofTestSensitivity(p, S.SENS_INTERVALS);
  return { label, rows: r.rows.map((x) => ({ proofTestIntervalHours: x.proofTestIntervalHours, pfdAvg: x.pfdAvg, sil: x.sil })) };
});

/** Expert: the longest interval of the IDU valves, and one case for each state. */
export const longestIntervals = () => ({
  valves: S.VALVE_TARGETS.map((target) => {
    const r = E.maxProofTestInterval(S.IDU.valves, target);
    return { target, state: r.state, proofTestIntervalHours: r.proofTestIntervalHours, proofTestIntervalYears: r.proofTestIntervalYears, pfdAvg: r.pfdAvg };
  }),
  states: Object.entries(S.STATE_CASES).map(([name, c]) => {
    const r = E.maxProofTestInterval(c.params, c.target);
    return { name, state: r.state, proofTestIntervalHours: r.proofTestIntervalHours, floorPfdAvg: r.floorPfdAvg ?? null, pfdAvg: r.pfdAvg ?? null };
  }),
  method: E.maxProofTestInterval(S.IDU.valves, S.VALVE_TARGETS[0]).basis.method,
});

/** Expert: the OBAGI valve's coverage floor and longest interval at its target. */
export const coverageFloor = () => S.PTC_LADDER.map((proofTestCoverage) => {
  const p = { ...S.OBAGI_VALVE, proofTestCoverage };
  const m = E.maxProofTestInterval(p, S.OBAGI_TARGET_PFDAVG);
  const f = E.maxProofTestInterval(p, 1e-9);
  return { proofTestCoverage, floorPfdAvg: f.floorPfdAvg, proofTestIntervalHours: m.proofTestIntervalHours, proofTestIntervalYears: m.proofTestIntervalYears };
});

/** Expert: the IDU SIF re-verified at stretched intervals, and the valve budget. */
export const judgement = () => {
  const I = S.IDU;
  const base = iduSif();
  const budget = base.requiredSifPfdAvg - base.parts[0].pfdAvg - base.parts[1].pfdAvg;
  const vb = E.maxProofTestInterval(I.valves, budget);
  return {
    requiredSifPfdAvg: base.requiredSifPfdAvg,
    valveBudgetPfdAvg: budget,
    valveIntervalHours: vb.proofTestIntervalHours,
    valveIntervalYears: vb.proofTestIntervalYears,
    stretched: S.STRETCH_YEARS.map((years) => {
      const f = (p) => ({ ...p, proofTestIntervalHours: years * E.HOURS_PER_YEAR });
      const s = E.pfdAvgSif([f(I.transmitters), f(I.logicSolver), f(I.valves)]);
      const l = lopaOf({ ...S.ORONI, tmelPerYr: S.LOOP_TMEL }, { sifPfdAvg: s.pfdAvg });
      return { years, pfdAvg: s.pfdAvg, rrf: s.rrf, sil: s.sil, meetsTmel: l.meetsTmel };
    }),
  };
};

/** Every refusal a panel can show, with the engine's own words. */
export const refusalSamples = () => [
  ['lopaScenario', 'no TMEL', E.lopaScenario({ initiatingEventFrequencyPerYr: 0.1 })],
  ['lopaScenario', 'one IPL named twice, in different case', E.lopaScenario({ initiatingEventFrequencyPerYr: 0.1, tmelPerYr: 1e-5, ipls: [{ name: 'Relief valve', pfd: 0.01, independent: true }, { name: 'relief valve', pfd: 0.1, independent: true }] })],
  ['pfdAvgSubsystem', 'a 1oo2 with no beta factor', E.pfdAvgSubsystem({ architecture: '1oo2', lambdaDuPerHour: 1e-6, proofTestIntervalHours: 8760, beta: undefined })],
  ['pfdAvgSubsystem', 'detected failures with no MTTR', E.pfdAvgSubsystem({ architecture: '1oo1', lambdaDuPerHour: 1e-6, proofTestIntervalHours: 8760, lambdaDdPerHour: 1e-6 })],
  ['pfdAvgSubsystem', 'coverage below one and no lifetime', E.pfdAvgSubsystem({ architecture: '1oo1', lambdaDuPerHour: 1e-6, proofTestIntervalHours: 8760, proofTestCoverage: 0.9 })],
  ['maxProofTestInterval', 'a target of one', E.maxProofTestInterval({ architecture: '1oo1', lambdaDuPerHour: 1e-6, proofTestIntervalHours: 8760 }, 1)],
].map(([fn, what, r]) => ({ fn, what, field: r.field, error: r.error }));
