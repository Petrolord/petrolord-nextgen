// THE DISCRIMINATE SWEEP over every H2 capstone route.
//
// Per the programme rule that a gate which restates the formula validates
// nothing (dc-wavekit README section 11): for each of the eighteen graded
// fields, does a PLAUSIBLE WRONG METHOD, the kind the lessons name, move the
// answer past its own tolerance? A field no plausible error moves is a field
// that grades nothing, whatever the prompt claims.
//
// Every wrong method is COMPUTED THROUGH THE VENDORED ENGINE wherever the engine
// can express it (a criterion object with the wrong exchange rate, the wrong
// threshold, the wrong coefficient; the wrong protector method; the wrong
// reduction factor), and by stated arithmetic only where the mistake is one the
// engine refuses to make (dividing by the sampled time, averaging decibels).
//
// A route is WEAK if fewer than three of the errors aimed at it move it, or if
// any error aimed at it is BLIND (lands inside the tolerance). The CLOSEST MISS
// is reported in tolerances.
//
//   node discriminate.mjs
//   node discriminate.mjs --slack-tolerances   THE NEGATIVE CONTROL
//
// The control multiplies every tolerance by 1e9 and must report EIGHTEEN WEAK
// ROUTES, which proves the sweep reads the tolerances rather than printing a
// constant. Exit 0 clean, 1 if any route is WEAK, 2 if the sweep could not run.
import fs from 'node:fs';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const HERE = process.env.H2_WAVE_DIR || '/root/hse-wip-hygiene';
const ROOT = process.env.H2_ENGINES || '/root/wt-h2-nextgen/packages/engines';
const E = await import(`${ROOT}/engines/hse/exposure.js`);
const SLACK = process.argv.includes('--slack-tolerances') ? 1e9 : 1;
const fields = Object.fromEntries(
  JSON.parse(fs.readFileSync(`${HERE}/fields.json`, 'utf8')).map((f) => [f[1], { tier: f[0], value: f[2], tol: f[3] * SLACK }]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

/* The scenarios are read out of the capstone generator's own frozen objects by
   IMPORTING NOTHING and parsing nothing: the generator prints them. A second
   typed copy of any condition here is exactly how the two would drift, so the
   generator's --json rows are cross-checked against fields.json first. */
const rows = JSON.parse(execFileSync('node', [`${HERE}/h2_capstone.mjs`, '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
rows.forEach((r) => {
  if (Math.abs(r.value - fields[r.key].value) > 0) { console.log(`REFUSED: fields.json is stale for ${r.key}`); process.exit(2); }
});
const SRC = fs.readFileSync(`${HERE}/h2_capstone.mjs`, 'utf8');
const block = (name) => {
  const m = SRC.match(new RegExp(`const ${name} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
  if (!m) { console.log(`REFUSED: cannot read ${name} out of h2_capstone.mjs`); process.exit(2); }
  return m[1];
};
/** Parse the Object.freeze({ a: 1, b: 2 }) rows inside a named array of a scenario. */
const arr = (name, key) => {
  const b = block(name);
  const m = b.match(new RegExp(`${key}: Object\\.freeze\\(\\[([\\s\\S]*?)\\]\\),`));
  if (!m) { console.log(`REFUSED: cannot read ${name}.${key}`); process.exit(2); }
  return [...m[1].matchAll(/Object\.freeze\(\{([^}]*)\}\)/g)].map((r) => {
    const o = {};
    [...r[1].matchAll(/(\w+):\s*(-?[\d.]+)/g)].forEach(([, k, v]) => { o[k] = Number(v); });
    return o;
  });
};
const num = (name, key) => {
  const m = block(name).match(new RegExp(`\\b${key}: (-?[\\d.]+),`));
  if (!m) { console.log(`REFUSED: cannot read ${name}.${key}`); process.exit(2); }
  return Number(m[1]);
};
const list = (name, key) => {
  const m = block(name).match(new RegExp(`${key}: Object\\.freeze\\(\\[([^\\]]*)\\]\\)`));
  return m[1].split(',').map(Number);
};

const U = { periods: arr('UTOROGU', 'periods'), loud: num('UTOROGU', 'loudestDbA') };
const A = {
  tasks: arr('AMUKPE', 'tasks'), week: list('AMUKPE', 'weekLexDbA'), dose: num('AMUKPE', 'dosimeterPelDosePct'),
  nrr: num('AMUKPE', 'earmuffNrrDb'), benz: arr('AMUKPE', 'benzene'), tol: arr('AMUKPE', 'tolueneShortTerm'), mix: arr('AMUKPE', 'mixture'),
};
const O = {
  h: num('OSIOKA', 'shiftHours'), w: num('OSIOKA', 'weeklyHours'), wbgt: arr('OSIOKA', 'wbgtReadouts'),
  met: arr('OSIOKA', 'metabolic'), dose: arr('OSIOKA', 'dosimeter'), xl: num('OSIOKA', 'xyleneLimitPpm'), solv: arr('OSIOKA', 'solvents'),
};

const EXACT5 = 5 / Math.log10(2);
const EXACT3 = 3 / Math.log10(2);
const crit = (o) => ({ id: 'WRONG', ...o });
const dose = (periods, c) => { const r = E.noiseDose(periods, c); if (r.error) throw new Error(r.error); return r; };
const PEL = { criterionLevelDbA: 90, exchangeRateDb: 5, thresholdDbA: 90, twaCoefficientDb: 16.61 };
const AL = { ...PEL, thresholdDbA: 80, limitDosePct: 50 };
const REL = { criterionLevelDbA: 85, exchangeRateDb: 3, thresholdDbA: 80, twaCoefficientDb: 10.0 };
const tRef = (L, c) => E.noiseReferenceDurationH(L, c).referenceDurationH;
const pelDose = dose(U.periods, 'OSHA_PEL').dosePct;
const minutesLeft = (d, c) => (1 - d / 100) * tRef(U.loud, c) * 60;
const lexSum = (tasks, t0) => 10 * Math.log10(tasks.reduce((s, p) => s + (p.durationH / t0) * 10 ** (p.laeqDbA / 10), 0));
const hours = (ps) => ps.reduce((s, p) => s + p.durationH, 0);
const sumCT = (ps, k) => ps.reduce((s, p) => s + p.concentration * p[k], 0);
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
const bsDaily = (h) => E.briefScalaDailyRf(h).rf;
const bsWeekly = (h) => E.briefScalaWeeklyRf(h).rf;
const idx = (comps) => E.mixtureExposureIndex(comps.map(({ concentration, limit }) => ({ concentration, limit }))).index;

const ROUTES = {
  utorogu_osha_pel_dose_pct: [
    ['a 3 dB exchange rate', dose(U.periods, crit({ ...PEL, exchangeRateDb: 3 })).dosePct],
    ['the action-level threshold of 80', dose(U.periods, crit({ ...PEL, thresholdDbA: 80 })).dosePct],
    ['no threshold at all', dose(U.periods, crit({ ...PEL, thresholdDbA: undefined })).dosePct],
    ['the NIOSH criterion of 85', dose(U.periods, crit({ ...PEL, criterionLevelDbA: 85 })).dosePct],
    ['the NIOSH REL read instead', dose(U.periods, 'NIOSH_REL').dosePct],
    ['the dose rescaled by the loudest period alone', 100 * U.periods.find((p) => p.levelDbA === U.loud).durationH / tRef(U.loud, 'OSHA_PEL')],
  ],
  utorogu_osha_pel_twa_dba: [
    ['the exact 5/log10 2 coefficient', dose(U.periods, crit({ ...PEL, twaCoefficientDb: EXACT5 })).twaDbA],
    ['the NIOSH coefficient of 10', dose(U.periods, crit({ ...PEL, twaCoefficientDb: 10 })).twaDbA],
    ['the action-level dose converted', dose(U.periods, 'OSHA_ACTION_LEVEL').twaDbA],
    ['a 3 dB exchange rate', dose(U.periods, crit({ ...PEL, exchangeRateDb: 3 })).twaDbA],
    ['the time weighted mean of the levels', U.periods.reduce((s, p) => s + p.levelDbA * p.durationH, 0) / hours(U.periods)],
    ['the energy average of all levels (an Leq)', lexSum(U.periods.map((p) => ({ laeqDbA: p.levelDbA, durationH: p.durationH })), 8)],
  ],
  utorogu_action_level_dose_pct: [
    ['the PEL threshold of 90', dose(U.periods, 'OSHA_PEL').dosePct],
    ['a 3 dB exchange rate', dose(U.periods, crit({ ...AL, exchangeRateDb: 3 })).dosePct],
    ['the 85 criterion people expect', dose(U.periods, crit({ ...AL, criterionLevelDbA: 85 })).dosePct],
    ['the NIOSH REL read instead', dose(U.periods, 'NIOSH_REL').dosePct],
    ['the 78.6 dBA period integrated too', dose(U.periods, crit({ ...AL, thresholdDbA: 75 })).dosePct],
    ['the dose doubled for the 50 percent limit', 2 * dose(U.periods, 'OSHA_ACTION_LEVEL').dosePct],
  ],
  utorogu_niosh_rel_dose_pct: [
    ['a 5 dB exchange rate', dose(U.periods, crit({ ...REL, exchangeRateDb: 5 })).dosePct],
    ['the OSHA criterion of 90', dose(U.periods, crit({ ...REL, criterionLevelDbA: 90 })).dosePct],
    ['the OSHA threshold of 90', dose(U.periods, crit({ ...REL, thresholdDbA: 90 })).dosePct],
    ['no threshold, the 78.6 dBA period counted', dose(U.periods, crit({ ...REL, thresholdDbA: undefined })).dosePct],
    ['the OSHA PEL dose read instead', pelDose],
    ['the OSHA action-level dose read instead', dose(U.periods, 'OSHA_ACTION_LEVEL').dosePct],
  ],
  utorogu_niosh_rel_twa_dba: [
    ['the exact 3/log10 2 coefficient', dose(U.periods, crit({ ...REL, twaCoefficientDb: EXACT3 })).twaDbA],
    ['the OSHA coefficient of 16.61', dose(U.periods, crit({ ...REL, twaCoefficientDb: 16.61 })).twaDbA],
    ['a 5 dB exchange rate', dose(U.periods, crit({ ...REL, exchangeRateDb: 5 })).twaDbA],
    ['the OSHA PEL TWA read instead', dose(U.periods, 'OSHA_PEL').twaDbA],
    ['the energy average of the integrated periods only', 10 * Math.log10(U.periods.filter((p) => p.levelDbA >= 80).reduce((s, p) => s + (p.durationH / 8) * 10 ** (p.levelDbA / 10), 0))],
    ['the time weighted mean of the levels', U.periods.reduce((s, p) => s + p.levelDbA * p.durationH, 0) / hours(U.periods)],
  ],
  utorogu_pel_minutes_left_min: [
    ['the NIOSH reference duration at that level', minutesLeft(pelDose, 'NIOSH_REL')],
    ['the action-level dose used', minutesLeft(dose(U.periods, 'OSHA_ACTION_LEVEL').dosePct, 'OSHA_PEL')],
    ['a 3 dB exchange rate for the reference duration', minutesLeft(pelDose, crit({ ...PEL, exchangeRateDb: 3 }))],
    ['the whole reference duration, the dose ignored', tRef(U.loud, 'OSHA_PEL') * 60],
    ['the dose left read as hours at 90 dBA', (1 - pelDose / 100) * 8 * 60],
    ['left in hours, not minutes', (1 - pelDose / 100) * tRef(U.loud, 'OSHA_PEL')],
  ],
  amukpe_lex_8h_dba: [
    ['divided by the 9.2 hour day', lexSum(A.tasks, hours(A.tasks))],
    ['the time weighted mean of the levels', A.tasks.reduce((s, p) => s + p.laeqDbA * p.durationH, 0) / hours(A.tasks)],
    ['the OSHA 5 dB TWA of the same record', dose(A.tasks.map((p) => ({ levelDbA: p.laeqDbA, durationH: p.durationH })), crit({ ...PEL, thresholdDbA: undefined })).twaDbA],
    ['the tasks under 80 dropped as if thresholded', E.lexEightHourDbA(A.tasks.filter((p) => p.laeqDbA >= 80)).lexDbA],
    ['the loudest task alone', A.tasks.reduce((m, p) => Math.max(m, p.laeqDbA), 0)],
    ['the tasks capped at eight hours by dropping the quietest', E.lexEightHourDbA(A.tasks.filter((p) => p.laeqDbA !== 76.4)).lexDbA],
  ],
  amukpe_lex_weekly_dba: [
    ['the arithmetic mean of the daily values', mean(A.week)],
    ['the energy sum without dividing by 5', 10 * Math.log10(A.week.reduce((s, l) => s + 10 ** (0.1 * l), 0))],
    ['divided by 7 for a calendar week', 10 * Math.log10(A.week.reduce((s, l) => s + 10 ** (0.1 * l), 0) / 7)],
    ['the loudest day', Math.max(...A.week)],
    ['the median day', [...A.week].sort((a, b) => a - b)[2]],
    ['a 5 dB energy average', 16.61 * Math.log10(A.week.reduce((s, l) => s + 2 ** ((l - 90) / 5), 0) / 5) + 90],
  ],
  amukpe_field_derated_exposure_dba: (() => {
    const twa = E.noiseTwaFromDoseDbA(A.dose, 'OSHA_PEL').twaDbA;
    const twa10 = E.noiseTwaFromDoseDbA(A.dose, 'NIOSH_REL').twaDbA;
    return [
      ['the Appendix B estimate, no 50 percent', E.hearingProtectorEstimate({ exposureDb: twa, nrrDb: A.nrr, method: 'OSHA_APPENDIX_B' }).protectedDbA],
      ['the NIOSH earmuff derating', E.hearingProtectorEstimate({ exposureDb: twa, nrrDb: A.nrr, method: 'NIOSH_TYPE', protectorType: 'earmuff' }).protectedDbA],
      ['the dual-protection method', E.hearingProtectorEstimate({ exposureDb: twa, nrrDb: A.nrr, method: 'OSHA_DUAL' }).protectedDbA],
      ['the NRR halved before subtracting 7', twa - (A.nrr / 2 - 7)],
      ['the full NRR subtracted', twa - A.nrr],
      ['the TWA taken on the NIOSH scale (criterion 85, coefficient 10)', E.hearingProtectorEstimate({ exposureDb: twa10, nrrDb: A.nrr, method: 'OSHA_FIELD_50' }).protectedDbA],
      ['the noise dose read as a level with no TWA step', E.hearingProtectorEstimate({ exposureDb: 90 + 10 * Math.log10(A.dose / 100), nrrDb: A.nrr, method: 'OSHA_FIELD_50' }).protectedDbA],
    ];
  })(),
  amukpe_benzene_twa8h_ppm: [
    ['divided by the 6.35 sampled hours', sumCT(A.benz, 'durationH') / hours(A.benz)],
    ['the plain mean of the samples', mean(A.benz.map((p) => p.concentration))],
    ['the highest sample', Math.max(...A.benz.map((p) => p.concentration))],
    ['divided by 12 for a 12 hour roster', sumCT(A.benz, 'durationH') / 12],
    ['the sum without dividing', sumCT(A.benz, 'durationH')],
    ['the longest sample alone', A.benz.reduce((m, p) => (p.durationH > m.durationH ? p : m)).concentration],
  ],
  amukpe_toluene_stel_ppm: [
    ['divided by the 11.5 sampled minutes', sumCT(A.tol, 'durationMin') / 11.5],
    ['the plain mean of the samples', mean(A.tol.map((p) => p.concentration))],
    ['the peak sample', Math.max(...A.tol.map((p) => p.concentration))],
    ['divided by 60 as if hourly', sumCT(A.tol, 'durationMin') / 60],
    ['the minutes read as hours over 8', E.chemicalTwa8h(A.tol.map((p) => ({ concentration: p.concentration, durationH: p.durationMin }))).twa8h],
    ['the sum without dividing', sumCT(A.tol, 'durationMin')],
  ],
  amukpe_mixture_index: [
    ['limit over concentration', A.mix.reduce((s, c) => s + c.limit / c.concentration, 0)],
    ['the largest term alone', Math.max(...A.mix.map((c) => c.concentration / c.limit))],
    ['the summed concentrations over the summed limits', A.mix.reduce((s, c) => s + c.concentration, 0) / A.mix.reduce((s, c) => s + c.limit, 0)],
    ['the mean term', mean(A.mix.map((c) => c.concentration / c.limit))],
    ['one component forgotten', idx(A.mix.slice(0, 2))],
    ['the limits adjusted for a 12 hour shift', idx(A.mix.map((c) => ({ concentration: c.concentration, limit: c.limit * bsDaily(12) })))],
  ],
  osioka_wbgt_twa_c: [
    ['the plain mean of the readouts', mean(O.wbgt.map((p) => p.wbgtC))],
    ['the hottest readout', Math.max(...O.wbgt.map((p) => p.wbgtC))],
    ['the work periods only', E.wbgtTwaC(O.wbgt.slice(0, 2)).wbgtTwaC],
    ['divided by the shift minutes', O.wbgt.reduce((s, p) => s + p.wbgtC * p.durationMin, 0) / (O.h * 60)],
    ['weighted by the metabolic rate', O.wbgt.reduce((s, p, i) => s + p.wbgtC * O.met[i].metabolicRateW * p.durationMin, 0) / O.met.reduce((s, p) => s + p.metabolicRateW * p.durationMin, 0)],
    ['the median readout', [...O.wbgt.map((p) => p.wbgtC)].sort((a, b) => a - b)[1]],
  ],
  osioka_metabolic_twa_w: [
    ['the plain mean of the rates', mean(O.met.map((p) => p.metabolicRateW))],
    ['the heaviest rate', Math.max(...O.met.map((p) => p.metabolicRateW))],
    ['the work periods only', E.metabolicRateTwaW(O.met.slice(0, 2)).metabolicRateTwaW],
    ['the mean of the logarithms', 10 ** O.met.reduce((s, p) => s + Math.log10(p.metabolicRateW) * p.durationMin, 0) / 60],
    ['divided by the shift minutes', O.met.reduce((s, p) => s + p.metabolicRateW * p.durationMin, 0) / (O.h * 60)],
    ['the rates converted to kcal/h and left there', E.metabolicRateTwaW(O.met).metabolicRateTwaW / 1.163],
  ],
  osioka_extended_action_level_dba: [
    ['the eight-hour 85 left unchanged', E.oshaActionLevelForShiftDbA(8).actionLevelDbA],
    ['the exact 5/log10 2 coefficient', EXACT5 * Math.log10(50 / (12.5 * O.h)) + 90],
    ['a 3 dB exchange (10 log10)', 10 * Math.log10(50 / (12.5 * O.h)) + 90],
    ['the 12 hour row of Table IV-3', E.oshaActionLevelForShiftDbA(12).actionLevelDbA],
    ['the PEL scaled instead (100 over 12.5 h)', 16.61 * Math.log10(100 / (12.5 * O.h)) + 90],
    ['the NIOSH REL scaled for the shift', E.noiseLevelForReferenceDurationDbA(O.h, 'NIOSH_REL').levelDbA],
  ],
  osioka_extended_action_dose_pct: [
    ['rescaled to eight hours', dose(O.dose, 'OSHA_ACTION_LEVEL').dosePct * 8 / O.h],
    ['only the first eight hours counted', dose((() => { let left = 8; return O.dose.map((p) => { const d = Math.min(p.durationH, left); left -= d; return { levelDbA: p.levelDbA, durationH: d }; }); })(), 'OSHA_ACTION_LEVEL').dosePct],
    ['the PEL threshold of 90', dose(O.dose, 'OSHA_PEL').dosePct],
    ['a 3 dB exchange rate', dose(O.dose, crit({ ...AL, exchangeRateDb: 3 })).dosePct],
    ['the NIOSH REL read instead', dose(O.dose, 'NIOSH_REL').dosePct],
    ['the 77.8 dBA period integrated too', dose(O.dose, crit({ ...AL, thresholdDbA: 75 })).dosePct],
  ],
  osioka_adjusted_limit_ppm: [
    ['the weekly factor used', O.xl * bsWeekly(O.w)],
    ['no adjustment', O.xl],
    ['the linear 8 over h scaling', O.xl * (8 / O.h)],
    ['the daily factor with 15 in place of 16', O.xl * (8 / O.h) * ((24 - O.h) / 15)],
    ['the two factors multiplied', O.xl * bsDaily(O.h) * bsWeekly(O.w)],
    ['a 12 hour shift assumed', O.xl * bsDaily(12)],
  ],
  osioka_adjusted_mixture_index: [
    ['the unadjusted limits', idx(O.solv)],
    ['the weekly factor used', idx(O.solv.map((c) => ({ concentration: c.concentration, limit: c.limit * bsWeekly(O.w) })))],
    ['limit over concentration, adjusted', O.solv.reduce((s, c) => s + (c.limit * bsDaily(O.h)) / c.concentration, 0)],
    ['the largest adjusted term alone', Math.max(...O.solv.map((c) => c.concentration / (c.limit * bsDaily(O.h))))],
    ['the index multiplied by the factor', idx(O.solv) * bsDaily(O.h)],
    ['the linear 8 over h scaling', idx(O.solv.map((c) => ({ concentration: c.concentration, limit: c.limit * (8 / O.h) })))],
  ],
};

let weak = 0;
let closest = { tol: Infinity };
let n = 0;
Object.entries(fields).forEach(([key, f]) => {
  const routes = ROUTES[key];
  if (!routes) { console.log(`REFUSED: no wrong methods written for ${key}`); process.exit(2); }
  let moved = 0;
  const blind = [];
  routes.forEach(([label, v]) => {
    n += 1;
    if (!Number.isFinite(v)) { console.log(`REFUSED: ${key} / ${label} gave ${v}`); process.exit(2); }
    const away = Math.abs(v - f.value) / f.tol;
    if (away > 1) moved += 1; else blind.push(`${label} (${away.toFixed(3)} tol)`);
    if (away < closest.tol) closest = { key, label, tol: away };
  });
  const isWeak = moved < 3 || blind.length > 0;
  if (isWeak) weak += 1;
  console.log(`${isWeak ? 'WEAK ' : 'ok   '} ${key.padEnd(36)} ${moved}/${routes.length} move it${blind.length ? `; BLIND: ${blind.join('; ')}` : ''}`);
});
console.log(`\n${n} plausible wrong methods over ${Object.keys(fields).length} routes, ${weak} WEAK.`);
console.log(`CLOSEST MISS: ${closest.key} via ${closest.label}, ${closest.tol.toFixed(3)} tolerances away.`);
process.exit(weak ? 1 : 0);
