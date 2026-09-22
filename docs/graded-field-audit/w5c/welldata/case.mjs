// W5c (B5 follow-on W5, section 3 pick A): the welldata capstone case.
//
// Writes the six ODUMA capstone LAS files into src/content/capstone-cases/welldata/
// (the learner downloads them from the capstone card and opens them in the
// panels with "Open your own LAS files"; no panel preloads them), then
// regenerates the eighteen graded keys by running those files through the
// SAME lab functions the panels render (src/lib/welldataTeaching.js), which
// call the vendored @petrolord/engines LAS parser and import pipeline. Nothing
// here computes a graded value itself.
//
// build() makes the files (deterministic, seeded); gradedKeys() reads them.
// gen_case.mjs writes them; the course gate (panels/welldata/w5cRecase.test.js)
// imports this module to prove the committed files and keys are what it makes.
import { qcFile, computeImport, computeCampaign, userFile } from '../../../../src/lib/welldataTeaching.js';

export const CASE_FILE_NAMES = ['oduma1_wrapped.las', 'oduma2_main.las', 'oduma3_feet.las',
  'oduma4_irregular.las', 'oduma5_nulls.las', 'oduma6_spliced.las'];

// mulberry32: a small, fixed PRNG so the case is byte-reproducible
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f4 = (v, w = 10) => v.toFixed(4).padStart(w);

// Physical-looking synthetic curves on a sand/shale alternation.
function curves(depths, r, spec) {
  const out = {};
  const n = depths.length;
  const shale = depths.map((d, i) => 0.5 + 0.45 * Math.sin(i / 17 + spec.phase) * Math.cos(i / 41));
  for (const c of spec.curves) {
    out[c.m] = depths.map((d, i) => {
      const s = shale[i];
      const e = (r() - 0.5);
      switch (c.kind) {
        case 'gr': return 28 + 92 * s + 6 * e;
        case 'rhob': return 2.18 + 0.36 * s + 0.03 * e;
        case 'nphi': return 0.12 + 0.24 * s + 0.02 * e;
        case 'dt_us_f': return 72 + 38 * s + 3 * e;
        case 'dt_us_m': return (72 + 38 * s + 3 * e) / 0.3048;
        case 'res': return Math.exp(Math.log(45) - 3.1 * s + 0.2 * e);
        case 'sp': return -68 + 55 * s + 4 * e;
        case 'cali': return 8.5 + 0.9 * s + 0.1 * e;
        case 'pef': return 2.4 + 1.1 * s + 0.1 * e;
        case 'tvd_f': return depths[i] * 0.9871 - 11.25;
        case 'tens': return 5200 + 900 * (i / n) + 60 * e;
        default: throw new Error(c.kind);
      }
    });
  }
  return out;
}

function punchNulls(values, idxs, nullValue) {
  for (const i of idxs) values[i] = nullValue;
}

function pickDistinct(r, n, count, lo = 0) {
  const s = new Set();
  while (s.size < count) s.add(lo + Math.floor(r() * (n - lo)));
  return [...s].sort((a, b) => a - b);
}

function header({ vers, wrap, unit, strt, stop, step, nullValue, well, uwi, fld }) {
  const L = [];
  L.push('~Version ---------------------------------------------------');
  L.push(`VERS.   ${vers} : CWLS LOG ASCII STANDARD - VERSION ${vers}`);
  L.push(`WRAP.   ${wrap}  : ${wrap === 'YES' ? 'MULTIPLE LINES PER DEPTH STEP' : 'ONE LINE PER DEPTH STEP'}`);
  L.push('~Well ------------------------------------------------------');
  L.push(`STRT.${unit}  ${f4(strt, 9)} : START DEPTH`);
  L.push(`STOP.${unit}  ${f4(stop, 9)} : STOP DEPTH`);
  L.push(`STEP.${unit}  ${f4(step, 9)} : STEP`);
  L.push(`NULL.   ${nullValue} : NULL VALUE`);
  if (vers === '1.2') {
    L.push('COMP.   COMPANY : PETROLORD');
    L.push(`WELL.   WELL : ${well}`);
    L.push(`FLD .   FIELD : ${fld}`);
    L.push(`UWI .   UNIQUE WELL ID : ${uwi}`);
  } else {
    L.push('COMP.   PETROLORD : COMPANY');
    L.push(`WELL.   ${well} : WELL`);
    L.push(`FLD .   ${fld} : FIELD`);
    L.push('LOC .   ONSHORE NIGER DELTA : LOCATION');
    L.push('SRVC.   PETROLORD STUDIO : SERVICE COMPANY');
    L.push('DATE.   2026-09-22 : LOG DATE');
    L.push(`UWI .   ${uwi} : UNIQUE WELL ID`);
  }
  return L;
}

const DESCR = {
  GR: 'GAMMA RAY', RHOB: 'BULK DENSITY', NPHI: 'NEUTRON POROSITY', DT: 'SONIC TRANSIT TIME',
  RT: 'TRUE RESISTIVITY', ILD: 'DEEP INDUCTION RESISTIVITY', SP: 'SPONTANEOUS POTENTIAL', CALI: 'CALIPER',
  PEF: 'PHOTOELECTRIC FACTOR', TVD: 'TRUE VERTICAL DEPTH', TENS: 'CABLE TENSION',
};

function lasText(h, depthUnit, spec, depths, vals) {
  const L = header({ ...h, unit: depthUnit });
  L.push('~Curve Information -----------------------------------------');
  L.push(`DEPT.${depthUnit.padEnd(6)}: 1  DEPTH`);
  spec.curves.forEach((c, i) => L.push(`${c.m.padEnd(4)}.${c.unit.padEnd(6)}: ${i + 2}  ${DESCR[c.m]}`));
  L.push('~Params ----------------------------------------------------');
  L.push(`KB  .M  ${f4(h.kb, 8)} : KELLY BUSHING ELEVATION`);
  L.push('~Other -----------------------------------------------------');
  L.push('Petrolord NextGen capstone case - docs/graded-field-audit/w5c/welldata/gen_case.mjs');
  L.push('~ASCII -----------------------------------------------------');
  for (let i = 0; i < depths.length; i++) {
    const row = [depths[i], ...spec.curves.map((c) => vals[c.m][i])];
    if (h.wrap === 'YES') {
      L.push(f4(row[0]));
      const rest = row.slice(1);
      for (let j = 0; j < rest.length; j += 2) L.push(rest.slice(j, j + 2).map((v) => f4(v)).join(' '));
    } else {
      L.push(row.map((v) => f4(v)).join(' '));
    }
  }
  return L.join('\n') + '\n';
}

export function build() {
  const files = {};

  // 1. oduma2_main: clean LAS 2.0 metric export, scattered GR and RHOB nulls
  {
    const r = rng(20260922);
    const n = 437; const step = 0.1524; const strt = 2140;
    const depths = Array.from({ length: n }, (_, i) => Math.round((strt + i * step) * 1e4) / 1e4);
    const spec = { phase: 0.3, curves: [
      { m: 'GR', unit: 'GAPI', kind: 'gr' }, { m: 'RHOB', unit: 'G/C3', kind: 'rhob' },
      { m: 'NPHI', unit: 'V/V', kind: 'nphi' }, { m: 'RT', unit: 'OHMM', kind: 'res' },
      { m: 'CALI', unit: 'IN', kind: 'cali' }] };
    const v = curves(depths, r, spec);
    punchNulls(v.GR, pickDistinct(r, n, 13), -999.25);
    punchNulls(v.RHOB, pickDistinct(r, n, 5), -999.25);
    files['oduma2_main.las'] = lasText({ vers: '2.0', wrap: 'NO', strt, stop: depths[n - 1], step, nullValue: '-999.25',
      well: 'ODUMA 2', uwi: 'ODUMA-2-MAIN', fld: 'ODUMA', kb: 18.4 }, 'M', spec, depths, v);
  }
  // 2. oduma3_feet: depth in feet, sonic in us/ft, a TVD curve in feet, one unrecognised curve
  {
    const r = rng(20260923);
    const n = 389; const step = 0.25; const strt = 7020;
    const depths = Array.from({ length: n }, (_, i) => strt + i * step);
    const spec = { phase: 1.1, curves: [
      { m: 'GR', unit: 'GAPI', kind: 'gr' }, { m: 'RHOB', unit: 'G/C3', kind: 'rhob' },
      { m: 'NPHI', unit: 'V/V', kind: 'nphi' }, { m: 'DT', unit: 'US/F', kind: 'dt_us_f' },
      { m: 'ILD', unit: 'OHMM', kind: 'res' }, { m: 'SP', unit: 'MV', kind: 'sp' },
      { m: 'TVD', unit: 'F', kind: 'tvd_f' }, { m: 'TENS', unit: 'LBF', kind: 'tens' }] };
    const v = curves(depths, r, spec);
    punchNulls(v.GR, pickDistinct(r, n, 4), -999.25);
    files['oduma3_feet.las'] = lasText({ vers: '2.0', wrap: 'NO', strt, stop: depths[n - 1], step, nullValue: '-999.25',
      well: 'ODUMA 3', uwi: 'ODUMA-3-FEET', fld: 'ODUMA', kb: 21.7 }, 'F', spec, depths, v);
  }
  // 3. oduma4_irregular: metric, the depth step changes size down the log
  {
    const r = rng(20260924);
    const depths = [1810];
    const pattern = [0.5, 0.5, 0.5, 0.25, 0.5, 0.75, 0.5, 0.5];
    for (let i = 1; i < 173; i++) depths.push(Math.round((depths[i - 1] + pattern[i % pattern.length]) * 1e4) / 1e4);
    const spec = { phase: 2.2, curves: [
      { m: 'GR', unit: 'GAPI', kind: 'gr' }, { m: 'RHOB', unit: 'G/C3', kind: 'rhob' },
      { m: 'NPHI', unit: 'V/V', kind: 'nphi' }, { m: 'DT', unit: 'US/M', kind: 'dt_us_m' }] };
    const v = curves(depths, r, spec);
    files['oduma4_irregular.las'] = lasText({ vers: '2.0', wrap: 'NO', strt: depths[0], stop: depths[depths.length - 1], step: 0,
      nullValue: '-999.25', well: 'ODUMA 4', uwi: 'ODUMA-4-IRREG', fld: 'ODUMA', kb: 19.9 }, 'M', spec, depths, v);
  }
  // 4. oduma5_nulls: a -9999 null flag, two dead curves, scattered GR and RHOB nulls
  {
    const r = rng(20260925);
    const n = 241; const step = 0.25; const strt = 1955;
    const depths = Array.from({ length: n }, (_, i) => strt + i * step);
    const spec = { phase: 0.7, curves: [
      { m: 'GR', unit: 'GAPI', kind: 'gr' }, { m: 'RHOB', unit: 'G/C3', kind: 'rhob' },
      { m: 'NPHI', unit: 'V/V', kind: 'nphi' }, { m: 'PEF', unit: 'B/E', kind: 'pef' },
      { m: 'DT', unit: 'US/M', kind: 'dt_us_m' }] };
    const v = curves(depths, r, spec);
    punchNulls(v.GR, pickDistinct(r, n, 37), -9999);
    punchNulls(v.RHOB, pickDistinct(r, n, 6), -9999);
    punchNulls(v.NPHI, depths.map((_, i) => i), -9999);
    punchNulls(v.PEF, depths.map((_, i) => i), -9999);
    files['oduma5_nulls.las'] = lasText({ vers: '2.0', wrap: 'NO', strt, stop: depths[n - 1], step, nullValue: '-9999',
      well: 'ODUMA 5', uwi: 'ODUMA-5-NULLS', fld: 'ODUMA', kb: 20.3 }, 'M', spec, depths, v);
  }
  // 5. oduma1_wrapped: LAS 1.2 wrapped, depth in feet
  {
    const r = rng(20260926);
    const n = 207; const step = 1; const strt = 6480;
    const depths = Array.from({ length: n }, (_, i) => strt + i * step);
    const spec = { phase: 1.9, curves: [
      { m: 'GR', unit: 'GAPI', kind: 'gr' }, { m: 'RHOB', unit: 'G/C3', kind: 'rhob' },
      { m: 'NPHI', unit: 'V/V', kind: 'nphi' }, { m: 'RT', unit: 'OHMM', kind: 'res' },
      { m: 'SP', unit: 'MV', kind: 'sp' }] };
    const v = curves(depths, r, spec);
    punchNulls(v.GR, pickDistinct(r, n, 3), -999.25);
    files['oduma1_wrapped.las'] = lasText({ vers: '1.2', wrap: 'YES', strt, stop: depths[n - 1], step, nullValue: '-999.25',
      well: 'ODUMA 1', uwi: 'ODUMA-1-WRAPPED', fld: 'ODUMA', kb: 17.2 }, 'F', spec, depths, v);
  }
  // 6. oduma6_spliced: feet, two logging runs spliced at different sample rates
  {
    const r = rng(20260927);
    const depths = [];
    for (let i = 0; i < 120; i++) depths.push(6900 + 0.5 * i);
    for (let i = 1; i <= 96; i++) depths.push(depths[119] + 0.25 * i);
    const spec = { phase: 0.1, curves: [
      { m: 'GR', unit: 'GAPI', kind: 'gr' }, { m: 'RHOB', unit: 'G/C3', kind: 'rhob' },
      { m: 'NPHI', unit: 'V/V', kind: 'nphi' }, { m: 'DT', unit: 'US/F', kind: 'dt_us_f' }] };
    const v = curves(depths, r, spec);
    files['oduma6_spliced.las'] = lasText({ vers: '2.0', wrap: 'NO', strt: depths[0], stop: depths[depths.length - 1], step: 0,
      nullValue: '-999.25', well: 'ODUMA 6', uwi: 'ODUMA-6-SPLICED', fld: 'ODUMA', kb: 18.9 }, 'F', spec, depths, v);
  }
  return files;
}

// The graded keys, read through the panel lab functions (the engine underneath).
export function gradedKeys(files) {
  const uf = (name) => userFile(name, files[name]);
  const main = qcFile(uf('oduma2_main.las'));
  const feetQc = qcFile(uf('oduma3_feet.las'));
  const nulls = qcFile(uf('oduma5_nulls.las'));
  const wrapped = qcFile(uf('oduma1_wrapped.las'));
  const gr = main.curves.find((c) => c.mnemonic === 'GR');
  const pef = nulls.curves.find((c) => c.mnemonic === 'PEF');
  const imp = computeImport(uf('oduma3_feet.las'), uf('oduma4_irregular.las'));
  const camp = computeCampaign(Object.keys(files).sort().map(uf));
  const of = (id) => camp.perFile.find((f) => f.label === id);
  return {
    beginner: [
      { key: 'oduma2_n_samples', tol: 0, unit: 'count', label: 'oduma2_main: depth samples', expected: main.depth.nSamples },
      { key: 'oduma2_gr_nulls', tol: 0, unit: 'count', label: 'oduma2_main: GR null samples', expected: gr.nullCount },
      { key: 'oduma2_gr_mean', tol: 0.05, unit: 'GAPI', label: 'oduma2_main: mean GR (finite samples)', expected: gr.mean },
      { key: 'oduma3_step_m', tol: 0.001, unit: 'm', label: 'oduma3_feet: depth step, converted', expected: feetQc.depth.stepM },
      { key: 'oduma5_pef_nulls', tol: 0, unit: 'count', label: 'oduma5_nulls: PEF null samples', expected: pef.nullCount },
      { key: 'oduma1_n_samples', tol: 0, unit: 'count', label: 'oduma1_wrapped: depth samples', expected: wrapped.depth.nSamples },
    ],
    intermediate: [
      { key: 'oduma3_start_md_m', tol: 0.01, unit: 'm', label: 'oduma3_feet: start depth (converted)', expected: imp.startMdM },
      { key: 'oduma3_stop_md_m', tol: 0.01, unit: 'm', label: 'oduma3_feet: stop depth (converted)', expected: imp.stopMdM },
      { key: 'oduma3_import_step_m', tol: 0.001, unit: 'm', label: 'oduma3_feet: depth step (converted)', expected: imp.stepM },
      { key: 'oduma3_converted_curves', tol: 0, unit: 'count', label: 'oduma3_feet: curves unit-converted', expected: imp.convertedCurves },
      { key: 'oduma3_recognized_kinds', tol: 0, unit: 'count', label: 'oduma3_feet: curve kinds recognised', expected: imp.recognizedKinds },
      { key: 'oduma4_n_samples', tol: 0, unit: 'count', label: 'oduma4_irregular: depth samples', expected: imp.irregularSamples },
    ],
    advanced: [
      { key: 'oduma_campaign_curves', tol: 0, unit: 'count', label: 'Curves imported across the ODUMA campaign', expected: camp.campaignCurves },
      { key: 'oduma_converted_files', tol: 0, unit: 'count', label: 'Files needing depth unit conversion', expected: camp.convertedFiles },
      { key: 'oduma_dead_curves', tol: 0, unit: 'count', label: 'Dead curves detected', expected: camp.deadCurves },
      { key: 'oduma_uniform_files', tol: 0, unit: 'count', label: 'Files with a uniform depth step', expected: camp.uniformFiles },
      { key: 'oduma1_wrapped_samples', tol: 0, unit: 'count', label: 'Depth samples in oduma1_wrapped', expected: of('oduma1_wrapped.las').samples },
      { key: 'oduma5_flagged_nulls', tol: 0, unit: 'count', label: 'Flagged nulls in oduma5_nulls', expected: of('oduma5_nulls.las').nulls },
    ],
  };
}

