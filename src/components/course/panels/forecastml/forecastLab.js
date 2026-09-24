// THE D4 TEACHING LAB: Data-Driven Production Forecasting.
//
// Every number this lab returns is a return value of the vendored engine
// (packages/engines/engines/dataai/forecast.js, sha-identical with
// petrolord-engines ec89b6b, which imports engines/dca/arps.js for the Arps
// baseline and lib/stats for the seeded bootstrap) on the Ekene production
// wells, or on the series a learner types into a panel. The dataset is
// ekeneProduction.json beside this file, the committed output of the wave's
// generator (tools/course-waves/forecastml/d4_fields.mjs, seeded through the
// canonical mulberry32), and forecastLab.test.js asserts the copy is
// byte-identical to what the generator produces and that every number a
// teaching reader returns is printed in the teaching digest.
//
// THE LAB NEVER READS THE CAPSTONE. It holds no graded answer, no tolerance and
// no capstone dataset, and panelCapstoneGuard.test.js greps this file, the
// three panels and the learning page for every rendering of all eighteen
// answers and every capstone name and input.
//
// NO REFUSAL MESSAGE IS WRITTEN HERE. A panel that shows a refusal shows the
// engine's own `error` string, so the lesson that quotes it and the panel agree.
//
// Nothing here reads a clock, a random number or a locale. The only random
// draws are the engine's own seeded bootstrap paths.
import * as FC from '@petrolord/engines/engines/dataai/forecast.js';
import DATA from './ekeneProduction.json';

export const DATASET = DATA;
export const DEFAULTS = FC.DEFAULTS;

/* ------------------------------------------------ what a learner can type */

/** A single number from a text box; a blank box is undefined, never zero. */
export const parseNumber = (text) => {
  if (text === '' || text === null || text === undefined) return undefined;
  const v = Number(text);
  return Number.isFinite(v) ? v : NaN;
};

/**
 * A rate series as a learner types or pastes it: numbers separated by commas,
 * spaces, semicolons or new lines, oldest first. null or a dash is a missing
 * month, passed through for the engine to refuse by name. Returns
 * { values } or { error }.
 */
export const parseSeries = (text) => {
  if (typeof text !== 'string' || text.trim() === '') return { error: 'the series is empty' };
  const parts = text.split(/[\s,;]+/).filter((p) => p !== '');
  const values = [];
  for (let i = 0; i < parts.length; i += 1) {
    const p = parts[i];
    if (/^(null|nan|-)$/i.test(p)) { values.push(null); continue; }
    const v = Number(p);
    if (!Number.isFinite(v)) return { error: `entry ${i} (counted from 0), ${p}, is not a number` };
    values.push(v);
  }
  return { values };
};

/** A list of method names, separated by commas or spaces. */
export const parseNames = (text) => (typeof text === 'string' ? text.split(/[\s,]+/).map((s) => s.trim()).filter((s) => s !== '') : []);

/** A well's rates as the text a panel starts from. */
export const seriesText = (well) => {
  const w = DATA.wells.find((x) => x.well === well);
  return w ? w.rate.map(String).join(', ') : '';
};
export const WELL_IDS = DATA.wells.map((w) => w.well);

// The interactive routes are the engine's own functions, unchanged: a panel
// passes what the learner typed and shows what the engine returned, refusals
// included.
export const fitOf = (args) => FC.fitSmoothing(args);
export const accuracyOf = (args) => FC.accuracy(args);
export const intervalsOf = (args) => FC.forecastIntervals(args);
export const backtestOf = (args) => FC.backtest(args);
export const arpsOf = (args) => FC.arpsForecast(args);
export const compareOf = (args) => FC.compareWithArps(args);

/**
 * A hold-out, every step an engine call: the method fitted on the first
 * `train` values, `h` steps forecast, and scored by accuracy() against the
 * next `h` values with the training values as insample. Returns each result
 * or the first refusal.
 */
export const holdOut = ({ y, method, train, h, m = 1, alpha, beta, phi }) => {
  const fit = FC.fitSmoothing({ y: y.slice(0, train), method, h, alpha, beta, phi });
  if (fit.error) return { refusal: fit };
  const acc = FC.accuracy({ actual: y.slice(train, train + h), forecast: fit.forecast, insample: y.slice(0, train), m });
  if (acc.error) return { fit, refusal: acc };
  return { fit, accuracy: acc };
};

/* ------------------------------------------------- the teaching readers */

const RATE = Object.fromEntries(DATA.wells.map((w) => [w.well, w.rate]));
const Y1 = RATE['EKENE-P1'];
const Y2 = RATE['EKENE-P2'];
const Y5 = RATE['EKENE-P5'];
const LONG = DATA.wells.filter((w) => w.rate.length === Y1.length).map((w) => w.well);
const METHODS = ['ses', 'holt', 'damped'];

/** The digest's stated teaching inputs, the same numbers the panels start from. */
export const TEACHING = Object.freeze({
  well: 'EKENE-P1', alpha: 0.3, holtAlpha: 0.5, holtBeta: 0.2, phi: 0.9, h: 12, train: 36,
  backtest: Object.freeze({ firstOrigin: 24, horizon: 6, step: 6 }), seed: 11,
  compare: Object.freeze({ well: 'EKENE-P2', firstOrigin: 28, horizon: 6, step: 3 }),
});
const T = TEACHING;

/** Associate: simple smoothing at the teaching alpha, the first six months, and its flat forecast. */
export const seriesReader = () => {
  const r = FC.fitSmoothing({ y: Y1, method: 'ses', alpha: T.alpha, h: T.h });
  return {
    rows: [1, 2, 3, 4, 5].map((t) => ({ t, rate: Y1[t], fitted: r.fitted[t], residual: r.residuals[t], level: r.level[t] })),
    forecast: r.forecast[0], sse: r.sse, scoredFrom: r.scoredFrom, nScored: r.nScored,
  };
};

/** Associate: simple smoothing across alpha on EKENE-P1, and alpha fitted on every long well. */
export const sesReader = () => ({
  byAlpha: [0.1, 0.3, 0.5, 0.9, 1].map((a) => { const r = FC.fitSmoothing({ y: Y1, method: 'ses', alpha: a, h: 1 }); return { alpha: String(a), sse: r.sse, mse: r.mse, forecast: r.forecast[0] }; }),
  fitted: LONG.map((well) => { const r = FC.fitSmoothing({ y: RATE[well], method: 'ses' }); return { well, alpha: r.params.alpha, sse: r.sse, mse: r.mse }; }),
});

/** Associate: Holt at the teaching alpha and beta, its first months and its line; and the low tail crossing zero. */
export const holtReader = () => {
  const r = FC.fitSmoothing({ y: Y1, method: 'holt', alpha: T.holtAlpha, beta: T.holtBeta, h: T.h });
  const r5 = FC.fitSmoothing({ y: Y5, method: 'holt', h: 24 });
  const neg = r5.forecast.findIndex((v) => v < 0);
  return {
    rows: [2, 3, 4, 5].map((t) => ({ t, fitted: r.fitted[t], residual: r.residuals[t], level: r.level[t], trend: r.trend[t] })),
    scoredFrom: r.scoredFrom, nScored: r.nScored, sse: r.sse, mse: r.mse,
    steps: [0, 1, 2, T.h - 1].map((j) => ({ step: j + 1, forecast: r.forecast[j] })),
    lowTail: { alpha: r5.params.alpha, beta: r5.params.beta, lastStepAbove: neg, before: r5.forecast[neg - 1], after: r5.forecast[neg] },
  };
};

/** Associate: the damped trend at the teaching parameters, its flattening steps, and phi fitted on every long well. */
export const dampedReader = () => {
  const r = FC.fitSmoothing({ y: Y1, method: 'damped', alpha: T.holtAlpha, beta: T.holtBeta, phi: T.phi, h: T.h });
  return {
    steps: r.forecast.slice(0, 6).map((v, j) => ({ step: j + 1, forecast: v })),
    atStepH: r.forecast[T.h - 1],
    fitted: LONG.map((well) => { const f = FC.fitSmoothing({ y: RATE[well], method: 'damped', h: T.h }); return { well, alpha: f.params.alpha, beta: f.params.beta, phi: f.params.phi, sse: f.sse, forecast: f.forecast[T.h - 1] }; }),
  };
};

/** Associate: the fit record of the three methods on EKENE-P1. */
export const fitReader = () => METHODS.map((method) => {
  const r = FC.fitSmoothing({ y: Y1, method });
  const o = r.optimiser;
  return { method, gridSse: o.gridSse, sse: r.sse, params: r.params, moves: o.moves, halvings: o.halvings, evaluations: o.evaluations };
});

/** Professional: the teaching hold-out of EKENE-P1, every method scored on months it never saw. */
export const holdOutReader = () => METHODS.map((method) => {
  const { accuracy: a } = holdOut({ y: Y1, method, train: T.train, h: T.h });
  return { method, me: a.me, mae: a.mae, rmse: a.rmse, mape: a.mape, smape: a.smape, mase: a.mase, scale: a.maseScale };
});

/** Professional: the teaching backtest, refitted and held. */
export const backtestReader = () => {
  const b = FC.backtest({ y: Y1, method: 'holt', ...T.backtest });
  const bh = FC.backtest({ y: Y1, method: 'holt', ...T.backtest, refit: false });
  const pick = (x) => ({ me: x.me, mae: x.mae, rmse: x.rmse, mase: x.mase });
  return {
    origins: b.origins,
    perOrigin: b.perOrigin.map((r) => ({ origin: r.origin, alpha: r.params.alpha, beta: r.params.beta, errors: r.errors, scale: r.maseScale })),
    overall: { ...pick(b.overall), mape: b.overall.mape, smape: b.overall.smape },
    byHorizon: b.byHorizon.map((h) => ({ step: h.step, ...pick(h) })),
    held: pick(bh.overall),
  };
};

/** Professional: EKENE-P2 compared before its shut-in and after its workover. */
export const compareReader = () => {
  const pre = FC.compareWithArps({ y: Y2.slice(0, 22), firstOrigin: 10, horizon: 3, step: 3 });
  const post = FC.compareWithArps({ y: Y2, firstOrigin: T.compare.firstOrigin, horizon: T.compare.horizon, step: T.compare.step });
  const rows = (c) => c.rows.map((r) => ({ method: r.method, mae: r.mae, rmse: r.rmse, mape: r.mape, smape: r.smape, mase: r.mase }));
  return { pre: { ranking: pre.ranking, rows: rows(pre) }, post: { ranking: post.ranking, rows: rows(post) } };
};

/** Expert: the damped bootstrap intervals of EKENE-P1 at the teaching seed. */
export const intervalsReader = () => {
  const r = FC.forecastIntervals({ y: Y1, method: 'damped', h: T.h, seed: T.seed });
  return {
    poolSize: r.poolSize, nSims: r.nSims, seed: r.seed,
    steps: r.forecast.map((f, j) => ({ step: j + 1, forecast: f, P90: r.P90[j], P50: r.P50[j], P10: r.P10[j] })),
  };
};

/** Expert: the Arps baseline on every long well, from engines/dca/arps.js. */
export const arpsReader = () => LONG.map((well) => {
  const a = FC.arpsForecast({ y: RATE[well], h: T.h });
  return { well, model: a.modelType, qi: a.qi, Di: a.Di, b: a.b, R2: a.R2, RMSE: a.RMSE, used: a.nUsed, dropped: a.dropped, atStepH: a.forecast[T.h - 1] };
});

/** A few refusals the panels show on the Ekene data, each the engine's own words. */
export const refusalSamples = () => [
  { fn: 'fitSmoothing', what: 'a missing month', r: FC.fitSmoothing({ y: Y1.map((v, i) => (i === 5 ? null : v)), method: 'ses' }) },
  { fn: 'fitSmoothing', what: 'a phi on holt', r: FC.fitSmoothing({ y: Y1, method: 'holt', phi: 0.9 }) },
  { fn: 'forecastIntervals', what: 'no seed', r: FC.forecastIntervals({ y: Y1, method: 'holt', h: T.h }) },
  { fn: 'backtest', what: 'holt from origin 2', r: FC.backtest({ y: Y1, method: 'holt', firstOrigin: 2, horizon: 6 }) },
  { fn: 'arpsForecast', what: 'two positive months', r: FC.arpsForecast({ y: [0, 0, 0, 410.5, 398.2] }) },
].map(({ fn, what, r }) => ({ fn, what, error: r.error, field: r.field }));
