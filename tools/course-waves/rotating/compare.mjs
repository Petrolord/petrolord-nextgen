// Runs the ENGINE over the oracle's own swept inputs and diffs.
//
// The oracle never imports the engine and the engine never sees the oracle;
// this file is the only place the two meet. It reports the WORST relative gap
// per block, refuses on an empty sweep, and checks a NEGATIVE CONTROL that is
// deliberately 1 percent wrong: if the control is not flagged, the comparison
// is not comparing anything and the run fails.
//
// Usage: node compare.mjs [enginesRoot]
import fs from 'fs';
import path from 'path';

const ROOT = process.env.FC3_ENGINES || '/root/wt-fc3-nextgen/packages/engines';
const GOLD = '/root/fc-wip-rotating/goldens';
const P = await import(`${ROOT}/engines/facilities/pumps.js`);
const C = await import(`${ROOT}/engines/facilities/compression.js`);

const read = (n) => JSON.parse(fs.readFileSync(path.join(GOLD, `rotating_${n}_cases.json`), 'utf8'));
const rel = (a, b) => (Math.abs(b) > 1e-300 ? Math.abs(a - b) / Math.abs(b) : Math.abs(a - b));

let swept = 0;
let failures = 0;
const report = [];
const block = (name, rows, fn) => {
  let worst = 0; let worstAt = null; let n = 0; const notes = [];
  rows.forEach((row, i) => {
    const r = fn(row, i);
    if (!r) return;
    for (const [label, got, want] of r.pairs || []) {
      n += 1; swept += 1;
      const d = rel(got, want);
      if (!Number.isFinite(d)) { notes.push(`${i} ${label}: non-finite gap got=${got} want=${want}`); failures += 1; continue; }
      if (d > worst) { worst = d; worstAt = `case ${i} ${label} (engine ${got}, oracle ${want})`; }
    }
    (r.notes || []).forEach((x) => notes.push(`${i}: ${x}`));
  });
  if (n === 0) { console.log(`REFUSED: block ${name} swept nothing`); failures += 1; return; }
  report.push({ name, n, worst, worstAt, notes });
};

/* ------------------------------------------------------------------ pumps */
block('curves', read('curves'), (row) => {
  const f = P.fitPumpCurve({ points: row.points });
  return {
    pairs: [
      ['c0', f.coefficients.c0, row.c0],
      ['c1', f.coefficients.c1, row.c1],
      ['c2', f.coefficients.c2, row.c2],
      ['shutoff', f.shutoffHeadFt, row.shutoffHeadFt],
      ['rSquared', f.rSquared, row.rSquared],
    ],
    notes: row.orthogonalityResidualExactlyZero ? [] : ['oracle orthogonality residual was NOT exactly zero'],
  };
});

block('duty', read('duty'), (row) => {
  const base = P.fitPumpCurve({ points: row.points });
  const system = P.systemCurve({
    staticHeadFt: row.staticHeadFt, frictionHeadFt: row.frictionHeadFt, atFlowGpm: row.atFlowGpm,
  });
  let pump = base;
  if (row.nSeries > 1) pump = P.combineSeries({ pump, n: row.nSeries });
  if (row.nParallel > 1) pump = P.combineParallel({ pump, n: row.nParallel });
  const d = P.dutyPoint({ pump, system, qMaxGpm: 60000 });
  if (d.error) return { pairs: [], notes: [`engine refused: ${d.error}`] };
  return { pairs: [['qGpm', d.qGpm, row.qGpm], ['headFt', d.headFt, row.headFt]] };
});

block('power', read('power'), (row) => {
  const p = P.pumpPower(row);
  return {
    pairs: [
      ['hydraulicHp', p.hydraulicHp, row.hydraulicHp],
      ['brakeHp', p.brakeHp, row.brakeHp],
      ['motorInputHp', p.motorInputHp, row.motorInputHp],
      ['motorInputKw', p.motorInputKw, row.motorInputKw],
    ],
  };
});

block('headPressure', read('headPressure'), (row) => {
  const psi = P.headFtToPsi({ headFt: row.headFt, sg: row.sg });
  const back = P.psiToHeadFt({ psi, sg: row.sg });
  return { pairs: [['psi', psi, row.psi], ['roundTrip', back, row.roundTripHeadFt]] };
});

block('npsh', read('npsh'), (row) => {
  const r = P.npshAvailable(row);
  const warned = !!r.warning;
  return {
    pairs: [['pressureHeadFt', r.pressureHeadFt, row.pressureHeadFt], ['npshaFt', r.npshaFt, row.npshaFt]],
    notes: warned === row.flashingWarningExpected ? [] : [`flashing warning ${warned} but expected ${row.flashingWarningExpected}`],
  };
});

block('npshCheck', read('npshCheck'), (row) => {
  const r = P.npshCheck({ npshaFt: row.npshaFt, npshrFt: row.npshrFt });
  const notes = [];
  if (r.pass !== row.pass) notes.push(`pass ${r.pass} vs oracle ${row.pass}`);
  if (r.severity !== row.severity) notes.push(`severity ${r.severity} vs oracle ${row.severity}`);
  return {
    pairs: [['marginFt', r.marginFt, row.marginFt], ['requiredMarginFt', r.requiredMarginFt, row.requiredMarginFt], ['ratio', r.ratio, row.ratio]],
    notes,
  };
});

block('viscosity', read('viscosity'), (row) => {
  const r = P.viscosityCorrection({
    qBepGpm: row.qBepGpm, headBepFt: row.headBepFt,
    viscosityCSt: row.viscosityCSt, speedRpm: row.speedRpm,
  });
  const notes = [];
  if (row.viscosityCSt <= 1) {
    // The engine's water branch returns B: 0, which is not the value of B at
    // water viscosity. Recorded as a shape finding, not a numeric gap.
    notes.push(`engine reports B = ${r.B} at ${row.viscosityCSt} cSt; the correlating parameter there is ${row.B}`);
    return { pairs: [['cQ', r.cQ, row.cQ], ['cEta', r.cEta, row.cEta]], notes };
  }
  const pairs = [['B', r.B, row.B], ['cQ', r.cQ, row.cQ], ['cH', r.cH, row.cH], ['cEta', r.cEta, row.cEta]];
  if (row.branch === 'corrected' && r.correctedQGpm === undefined) notes.push('engine omitted correctedQGpm on a corrected row');
  if (row.branch !== 'corrected' && r.correctedQGpm !== undefined) notes.push('engine returned correctedQGpm on an uncorrected row');
  if (row.inverseRoundTripRelative !== undefined && row.inverseRoundTripRelative > 1e-20) {
    notes.push(`oracle inverse round trip ${row.inverseRoundTripRelative}`);
  }
  return { pairs, notes };
});

block('speed', read('speed'), (row) => {
  const r = P.speedChange(row);
  return { pairs: [['qGpm', r.qGpm, row.outQGpm], ['headFt', r.headFt, row.outHeadFt], ['brakeHp', r.brakeHp, row.outBrakeHp]] };
});

block('trim', read('trim'), (row) => {
  // Only the four INPUTS are handed to the engine. The oracle's answers are
  // out-prefixed precisely so they cannot be fed back in as arguments.
  const r = P.impellerTrim({
    qGpm: row.qGpm, headFt: row.headFt, brakeHp: row.brakeHp, diameterRatio: row.diameterRatio,
  });
  const notes = [];
  if (!!r.warning !== row.warningExpected) notes.push(`warning ${!!r.warning} expected ${row.warningExpected}`);
  return {
    pairs: [
      ['trimPercent', r.trimPercent, row.outTrimPercent],
      ['idealHeadFt', r.idealHeadFt, row.outIdealHeadFt],
      ['headFt', r.headFt, row.outHeadFt],
      ['qGpm', r.qGpm, row.outQGpm],
      ['brakeHp', r.brakeHp, row.outBrakeHp],
      ['shortfallPct', r.shortfallPct, row.outShortfallPct],
    ],
    notes,
  };
});

block('region', read('region'), (row) => {
  const r = P.operatingRegion({ qGpm: row.qGpm, qBepGpm: row.qBepGpm });
  const notes = r.region === row.region ? [] : [`region "${r.region}" vs oracle "${row.region}"`];
  return { pairs: [['percentOfBep', r.percentOfBep, row.percentOfBep]], notes };
});

/* ------------------------------------------------------------ compression */
block('staging', read('staging'), (row) => {
  const r = C.stageCount(row);
  if (row.refused) {
    return { pairs: [], notes: r.error ? [] : [`oracle says no stage count exists; engine returned ${JSON.stringify(r)}`] };
  }
  const notes = [];
  if (r.error) return { pairs: [], notes: [`engine refused a case the oracle solved: ${r.error}`] };
  if (r.stages !== row.stages) notes.push(`stages ${r.stages} vs oracle ${row.stages}`);
  if (r.byRatio !== row.byRatio) notes.push(`byRatio ${r.byRatio} vs oracle ${row.byRatio}`);
  if (r.byTemp !== row.byTemp) notes.push(`byTemp ${r.byTemp} vs oracle ${row.byTemp}`);
  if (r.governedBy !== row.governedBy) notes.push(`governedBy ${r.governedBy} vs oracle ${row.governedBy}`);
  return { pairs: [['overallRatio', r.overallRatio, row.overallRatio], ['ratioPerStage', r.ratioPerStage, row.ratioPerStage]], notes };
});

// The head, the temperature and the power, with z taken from the engine (as
// the oracle declares) and everything else independent.
const oracleStage = JSON.parse(fs.readFileSync('/root/fc-wip-rotating/goldens/rotating_stages_cases.json', 'utf8'));
{
  const rows = [];
  for (const row of oracleStage) {
    const r = C.compressionStage(row);
    rows.push({ row, r });
  }
  fs.writeFileSync('/root/fc-wip-rotating/scratch/stage_z.json', JSON.stringify(
    rows.map(({ row, r }) => ({ ...row, zAvg: r.zAvg, engine: {
      headPolyFtLbfLbm: r.headPolyFtLbfLbm, tDischargeF: r.tDischargeF,
      gasHp: r.gasHp, massLbHr: r.massLbHr, brakeHp: r.brakeHp,
      isentropicEfficiency: r.isentropicEfficiency,
      headIsenFtLbfLbm: r.headIsenFtLbfLbm,
    } })), null, 1));
  console.log(`wrote scratch/stage_z.json for the second oracle pass (${rows.length} stages)`);
}

// acfm: the oracle derives the ideal-gas volume from the SAME z the engine
// computed (z is DAK, declared an input by the oracle), so what is actually
// compared here is the standard-base packaging and the arithmetic.
block('acfm', read('acfm'), (row) => {
  const probe = C.compressionStage({
    qMMscfd: Math.max(row.qMMscfd, 1e-6), pSuctionPsia: row.pPsia,
    tSuctionF: row.tF, ratio: 1.5, gasSg: row.gasSg, k: 1.28,
  });
  const z = probe.z1;
  const want = (row.qMMscfd * 1e6 / 1440) * (14.7 / row.pPsia) * ((row.tF + 459.67) / 520) * z;
  const got = C.actualInletCfm(row);
  return { pairs: [['acfm', got, want]] };
});

block('fuel', read('fuel'), (row) => {
  const r = C.driverFuel(row);
  return {
    pairs: [
      ['fuelBtuHr', r.fuelBtuHr, row.fuelBtuHr],
      ['fuelMMscfd', r.fuelMMscfd, row.fuelMMscfd],
      ['thermalEfficiencyPct', r.thermalEfficiencyPct, row.thermalEfficiencyPct],
    ],
  };
});

/* --------------------------------------------------------------- refusals */
{
  const rows = read('refusals');
  let ok = 0; const bad = [];
  for (const row of rows) {
    const mod = row.module === 'pumps' ? P : C;
    const r = mod[row.fn](row.input);
    const hasErr = !!(r && r.error);
    // EVERY numeric field, not the first one: an earlier draft read only the
    // first and called pumpPower finite because hydraulicHp is, while
    // motorInputHp was Infinity. A curve object is probed by calling it.
    const nums = [];
    if (typeof r === 'number') nums.push(r);
    else if (r && typeof r === 'object') {
      for (const v of Object.values(r)) if (typeof v === 'number') nums.push(v);
      if (typeof r.headAt === 'function') nums.push(r.headAt(1000));
    }
    const nonFinite = nums.some((v) => !Number.isFinite(v));
    const cls = hasErr ? 'refusal' : (nonFinite ? 'silent' : 'answered');
    if (cls === row.expect) ok += 1; else bad.push(`${row.module}.${row.fn} ${JSON.stringify(row.input)} -> ${cls}, expected ${row.expect}`);
    swept += 1;
  }
  report.push({ name: 'refusals', n: rows.length, worst: 0, worstAt: `${ok}/${rows.length} classified as expected`, notes: bad });
  if (rows.length === 0) failures += 1;
}

/* ------------------------------------------------------- negative control */
{
  const nc = read('negativeControl');
  const f = P.fitPumpCurve({ points: nc.points });
  const s = P.systemCurve({ staticHeadFt: nc.staticHeadFt, frictionHeadFt: nc.frictionHeadFt, atFlowGpm: nc.atFlowGpm });
  const d = P.dutyPoint({ pump: f, system: s, qMaxGpm: 60000 });
  const gap = rel(d.qGpm, nc.qGpm);
  const caught = gap > 1e-6;
  console.log(`\nNEGATIVE CONTROL: deliberately wrong duty, relative gap ${gap.toExponential(3)} -> ${caught ? 'CAUGHT' : 'NOT CAUGHT'}`);
  if (!caught) { console.log('  THE COMPARISON IS NOT COMPARING ANYTHING.'); failures += 1; }
}

/* ----------------------------------------------------------------- report */
console.log(`\n${'block'.padEnd(16)} ${'n'.padStart(5)}  worst relative gap`);
for (const b of report) {
  console.log(`${b.name.padEnd(16)} ${String(b.n).padStart(5)}  ${b.worst === 0 ? 'exact' : b.worst.toExponential(3)}${b.worstAt ? '   ' + b.worstAt : ''}`);
  for (const n of b.notes) console.log(`      NOTE ${n}`);
}
console.log(`\nswept ${swept} comparisons across ${report.length} blocks`);
if (swept === 0) { console.log('REFUSED: swept nothing.'); process.exit(2); }
process.exit(failures > 0 ? 1 : 0);
