// THE ASSOCIATE SECTIONS OF THE QI TEACHING DIGEST (sections 1 to 21).
// Printed from the teaching lab's own return values (qiLab.js, loaded through
// qi_engine.mjs), on the Ekene teaching pack. Nothing here computes a figure
// the lab does not return, apart from unit conversions and the relative
// amplitudes in decibels, whose formula is printed beside them.
import { LAB as L } from './qi_engine.mjs';
import { f6, whole, table, section, refusal } from './qi_digest_kit.mjs';
import * as QC from '@petrolord/engines/engines/qi/seismicQc.js';
import * as ES from '@petrolord/engines/engines/rockphysics/elasticSet.js';
import * as AT from '@petrolord/engines/engines/rockphysics/avoTrend.js';
import * as FL from '@petrolord/engines/engines/rockphysics/fluids.js';
import * as GS from '@petrolord/engines/engines/rockphysics/gassmann.js';
import * as MN from '@petrolord/engines/engines/rockphysics/minerals.js';
import * as AV from '@petrolord/engines/engines/rockphysics/avo.js';
import GOLD_QC from '@petrolord/engines/test-data/qi/goldens.seismicQc.json';
import { usabilityMatrix, suggestedIssues } from '@suite/pages/apps/QIStudio/services/usability.js';
import { isStripe } from '@suite/pages/apps/QIStudio/services/qcRun.js';

const P = L.PACK;
const E = L.EKENE;
const ft = (m) => f6(L.mToFt(m));
const pct = (a, b) => (100 * (b - a)) / a;
const db = (a, ref) => 20 * Math.log10(a / ref);

export const SUITE_FILES = {
  usability: 'src/pages/apps/QIStudio/services/usability.js',
  qcRun: 'src/pages/apps/QIStudio/services/qcRun.js',
};

export function sectionsA(ctx) {
  const out = [];
  const E1 = L.packWell('Ekene-1');
  const fluids = L.fluidsAt(P.conditions.ekene);
  if (fluids.error) throw new Error(fluids.error);

  /* ------------------------------------------------------------ 1 */
  out.push(section(1, 'What the engines compute, and what they decline to compute', 'Associate m01 and Professional m01 and Expert m01 and Expert m06', `
The course runs on the vendored Petrolord engines, the same files QI Studio and Rock Physics Studio run. Each engine function takes plain numbers and arrays and returns numbers; a function that cannot answer refuses by throwing an error whose message says why (section 5). No engine reads a file, a clock or a random number of its own.

${table(['engine file', 'functions the course calls', 'tier that teaches it'], [
    ['engines/qi/seismicQc.js', '`amplitudeSpectrum`, `averageSpectrum`, `spectrumStats`, `snrFromCoherency`, `footprint`', 'Associate'],
    ['engines/rockphysics/elasticSet.js', '`elasticPoint`, `fitVsRegression`, `predictVs`', 'Associate'],
    ['engines/rockphysics/vsEstimate.js', '`gcSandShaleVs`', 'Associate'],
    ['engines/rockphysics/fluids.js', '`brine`, `liveOil`, `apiToRho0`, `woodMix`', 'Associate'],
    ['engines/rockphysics/minerals.js', '`mixMinerals`', 'Associate'],
    ['engines/rockphysics/gassmann.js', '`substituteVels`', 'Associate'],
    ['engines/rockphysics/avoTrend.js', '`blockLogs`, `interfacePoints`, `fitFluidLine`, `distanceFromLine`, `backgroundSlope`', 'Associate'],
    ['engines/rockphysics/avo.js', '`zoeppritzRpp`, `shuey`, `avoClass`', 'Associate'],
    ['engines/qi/wavelets.js, engines/qi/prestack.js, engines/qi/prestackQc.js, engines/qi/avo.js', 'the wavelet, gather, angle and AVO functions', 'Professional'],
    ['engines/qi/lfm.js, engines/qi/inversion.js, engines/qi/inversionSpread.js, engines/qi/prestackInversion.js, engines/qi/propertyPrediction.js, engines/qi/prospectAssessment.js, lib/gridding/closure.js', 'the forward model, the inversions, the property transforms and the prospect functions', 'Expert'],
  ])}

WHAT THE ENGINES DO NOT DO, checked here against the functions above:
- They hold no Ekene figure. Every temperature, pressure, salinity, oil gravity, gas-oil ratio, gas gravity, porosity, shale volume, saturation, mineral, taper, window, block length, angle and cut-off is an input the caller states; the course states each one where it uses it.
- They do not decide whether a QI study should go ahead. The engines return spectra, trends, moduli and reflection coefficients; the verdict is written by the interpreter from those numbers (section 21).
- They do not pick the samples. Which samples are net sand, which are the water leg and which are the cap rock is a selection the course states (section 3) before a function is called.`));

  /* ------------------------------------------------------------ 2 */
  out.push(section(2, 'The references behind the engines, and how the course uses them', 'Associate m01 l01 and Professional m01 and Expert m01 and Expert m06 l03', `
THE RULE THIS COURSE FOLLOWS. Every method is named with its authors and year, the way the engines' own source headers and validation records name it. The course quotes none of their prose: each is a publisher's text, so the course teaches it by concept and equation and writes every explanation in its own words.

${table(['method', 'reference', 'engine', 'how the course uses it'], [
    ['brine and live oil properties', 'Batzle and Wang (1992), Geophysics 57', 'fluids.js', 'by equation, at stated conditions'],
    ['the fluid mix', 'Wood (1955), the uniform (Reuss) mix', 'fluids.js', 'by concept'],
    ['the mineral mix', 'Voigt, Reuss and Hill (Hill 1952)', 'minerals.js', 'by concept'],
    ['fluid substitution', 'Gassmann (1951)', 'gassmann.js', 'by equation'],
    ['shear from compressional velocity', 'Greenberg and Castagna (1992), Geophysical Prospecting 40', 'vsEstimate.js', 'by equation and its published coefficients'],
    ['the wet background trend', 'Castagna, Swan and Foster (1998), Geophysics 63', 'avoTrend.js', 'by equation'],
    ['intercept and gradient', 'Shuey (1985), Geophysics 50', 'avo.js', 'by equation'],
    ['AVO classes', 'Rutherford and Williams (1989), Geophysics 54, with class IV', 'avo.js', 'by concept'],
    ['exact reflection coefficients', 'Zoeppritz, in the form of Dvorkin and others (2014)', 'avo.js', 'by concept'],
    ['signal to noise from coherency', 'Hatton, Worthington and Makin (1986), Seismic Data Processing, section 4.4', 'seismicQc.js', 'by equation'],
    ['lambda-rho and mu-rho', 'Goodway, Chen and Downton (1997)', 'elasticSet.js', 'by equation'],
  ])}

The Rock Physics course teaches Batzle-Wang, Gassmann, Greenberg-Castagna, Shuey, the classes and exact Zoeppritz in full. This course recaps each in one lesson and applies it to the QI questions.`));

  /* ------------------------------------------------------------ 3 */
  const wellRows = L.PACK_WELLS.map((w) => {
    const W = P.wells[w];
    return [w, f6(W.x), f6(W.y), ft(W.kb_m), ft(W.tops_m.ogbiaShale), ft(W.tops_m.ekeneTop), ft(W.tops_m.ekeneBase), whole(W.rows.length), ft(W.rows[0][0]), ft(W.rows[W.rows.length - 1][0])];
  });
  const counts = {
    oil: L.zoneSamples(E1, 'oil').length,
    water: L.zoneSamples(E1, 'water').length,
    shale: L.zoneSamples(E1, 'shale').length,
  };
  out.push(section(3, 'The Ekene field and the teaching pack', 'Associate m01 l02 and Associate m02 l01 and Professional m01 and Expert m01', `
THE DATA IS SYNTHETIC. The Ekene field is the Petrolord demonstration field: one earth model, from which every log and every seismic trace was generated by a stated script, so every answer can be checked against the model. No real well, company or survey appears. The teaching pack is cut from release ekene-demo-v3 of the Ekene demonstration kit, the release the QI with Petrolord videos were recorded on, by the course's cut script; its petrophysical curves (PHIT, VSH, SW) are the interpretation the kit was built from, sampled at the log depths.

Depths are measured depth below the kelly bushing in feet; the kit writes metres and the course converts (feet = metres / 0.3048). The wells in the pack are vertical.

${table(['well', 'easting m', 'northing m', 'KB elevation ft', 'top Ogbia Shale ft', 'top Ekene Sand ft', 'base Ekene Sand ft', 'log samples', 'first sample ft', 'last sample ft'], wellRows)}

The Ekene Sand oil-water contact is at ${ft(P.contacts_m.ekeneOwc)} ft (${f6(P.contacts_m.ekeneOwc)} m in the kit), the same depth in every well. The log step is ${f6(L.mToFt(P.wells['Ekene-1'].rows[1][0] - P.wells['Ekene-1'].rows[0][0]))} ft.

THE SELECTIONS THE COURSE STATES (lab \`zoneSamples\`):

${table(['selection', 'rule', 'samples at Ekene-1'], [
    ['net sand', `Vsh at or below ${f6(E.netSandVshCut)}`, whole(L.zoneSamples(E1, 'sand').length)],
    ['oil leg', 'net sand inside the Ekene Sand, above the oil-water contact', whole(counts.oil)],
    ['water leg', 'net sand inside the Ekene Sand, at or below the contact', whole(counts.water)],
    ['cap rock', `the ${whole(E.shaleAboveFt)} ft of log above the top of the Ekene Sand`, whole(counts.shale)],
  ])}

WHAT THE PACK HOLDS:

${table(['part', 'what it is', 'size'], [
    ['logs', 'Vp, Vs and density from the DT, DTS and RHOB logs (Vp = 304800 / DT, Vs = 304800 / DTS, density = RHOB x 1000), GR, and the kit\'s PHIT, VSH and SW, for Ekene-1 to Ekene-4 over the Ekene Sand and the shale above it', `${whole(L.PACK_WELLS.length)} wells`],
    ['headers', 'every well\'s curve list, checkshot count and survey station count', `${whole(Object.keys(P.headers).length)} wells`],
    ['spread traces', 'full-stack traces spread over the survey', `${whole(P.qcSpread.inlines.length)} inlines by ${whole(P.qcSpread.crosslines.length)} crosslines, ${whole(P.qcSpread.t0_ms)} to ${whole(P.qcSpread.t1_ms)} ms every ${f6(P.qcSpread.dt_ms)} ms`],
    ['neighbour traces', 'neighbouring full-stack traces along the inline through Ekene-1', `${whole(P.qcNeighbours.traces.length)} traces, inline ${whole(P.qcNeighbours.inline)}`],
    ['RMS slice', 'the RMS amplitude of the full stack on every trace', `${whole(P.slice.values.length)} inlines by ${whole(P.slice.values[0].length)} crosslines, ${whole(P.slice.t0_ms)} to ${whole(P.slice.t1_ms)} ms`],
    ['traces at the wells', 'full, near, mid and far stack traces at Ekene-1 to Ekene-4', `${whole(P.wellTraces.t0_ms)} to ${whole(P.wellTraces.t1_ms)} ms`],
    ['gathers', 'NMO-corrected CDP gathers next to Ekene-1', `${whole(P.gathers.cdps.length)} CDPs, ${whole(P.gathers.offsets_m.length)} offsets`],
  ])}

THE CONDITIONS AT THE EKENE SAND, stated with the kit: ${P.conditions.ekene.tF} degF, ${P.conditions.ekene.pPsia} psia, brine salinity ${f6(P.conditions.ekene.salinity)} (weight fraction of NaCl), oil ${P.conditions.ekene.api} API, gas-oil ratio ${P.conditions.ekene.gorScfStb} scf/stb, gas gravity ${f6(P.conditions.ekene.gasSg)}.`));

  /* ------------------------------------------------------------ 4 */
  const oilM = L.layerMeans(L.zoneSamples(E1, 'oil'));
  const eOil = L.elastic(oilM.vp, oilM.vs, oilM.rho);
  const cs1 = P.checkshots['Ekene-1'].rows;
  const topM = P.wells['Ekene-1'].tops_m.ekeneTop;
  let owtTop = null;
  for (let i = 1; i < cs1.length; i++) {
    if (cs1[i][0] >= topM) {
      const [m0, t0] = cs1[i - 1]; const [m1, t1] = cs1[i];
      owtTop = t0 + ((topM - m0) / (m1 - m0)) * (t1 - t0);
      const below = cs1[i]; const above = cs1[i - 1];
      ctx.csBracket = [above, below];
      break;
    }
  }
  out.push(section(4, 'Units, times and polarity', 'Associate m01 l04', `
DEPTH. Feet throughout: 1 ft = 0.3048 m. The top of the Ekene Sand at Ekene-1 is ${ft(topM)} ft (${f6(topM)} m in the kit).

VELOCITY AND DENSITY. Velocities in metres per second, density in kilograms per cubic metre (a density log in g/cc times 1000). The engines work in SI throughout.

IMPEDANCE. Acoustic impedance AI = Vp x density, in kg/(m2 s). The same number appears in three ways, and a study states which:

${table(['quantity', 'Ekene-1 oil-leg mean'], [
    ['Vp, m/s', f6(oilM.vp)],
    ['density, kg/m3', f6(oilM.rho)],
    ['AI of the means, kg/(m2 s) (elasticPoint)', f6(eOil.ai)],
    ['the same in units of 10^6 kg/(m2 s)', f6(eOil.ai / 1e6)],
    ['the same as (m/s)(g/cc), that is AI / 1000', f6(eOil.ai / 1000)],
  ])}

TIME. Seismic time is two-way time (TWT) in milliseconds; a checkshot records one-way time (OWT) from the reference. At Ekene-1 the checkshots bracketing the top of the Ekene Sand are at ${ft(ctx.csBracket[0][0])} ft (OWT ${f6(ctx.csBracket[0][1])} ms) and ${ft(ctx.csBracket[1][0])} ft (OWT ${f6(ctx.csBracket[1][1])} ms); linear between them the top is at OWT ${f6(owtTop)} ms, TWT ${f6(2 * owtTop)} ms.

POLARITY. The kit's seismic is SEG normal polarity: an increase in acoustic impedance downwards is a peak, a positive number. The Ekene Sand is harder than the Ogbia Shale above it at Ekene-1 (section 15), so its top is a peak.`));

  /* ------------------------------------------------------------ 5 */
  const msgs = [
    ['amplitudeSpectrum', 'a sample interval of 0 ms', refusal(() => QC.amplitudeSpectrum(new Array(16).fill(1), 0))],
    ['amplitudeSpectrum', 'a trace of 5 samples', refusal(() => QC.amplitudeSpectrum([1, 2, 3, 4, 5], 4))],
    ['averageSpectrum', 'no traces', refusal(() => QC.averageSpectrum([], 4))],
    ['averageSpectrum', 'traces of 16 and 20 samples', refusal(() => QC.averageSpectrum([new Array(16).fill(1), new Array(20).fill(1)], 4))],
    ['snrFromCoherency', 'one trace', refusal(() => QC.snrFromCoherency([new Array(16).fill(1)]))],
    ['snrFromCoherency', 'two traces of nulls', refusal(() => QC.snrFromCoherency([new Array(16).fill(null), new Array(16).fill(null)]))],
    ['footprint', 'a slice of 3 by 3', refusal(() => QC.footprint([[1, 2, 3], [1, 2, 3], [1, 2, 3]]))],
    ['fitVsRegression', 'three measured pairs, linear', refusal(() => ES.fitVsRegression([{ vp: 3000, vs: 1600 }, { vp: 3100, vs: 1650 }, { vp: 3200, vs: 1700 }]))],
    ['fitVsRegression', "the form 'cubic'", refusal(() => ES.fitVsRegression([], { form: 'cubic' }))],
    ['fitVsRegression', 'six pairs all at Vp 3000 m/s', refusal(() => ES.fitVsRegression(Array.from({ length: 6 }, (_, i) => ({ vp: 3000, vs: 1600 + i }))))],
    ['predictVs', 'an interval level of 1.2', refusal(() => ES.predictVs({ form: 'linear', coef: [0, 1], xtxInv: [[1, 0], [0, 1]], s: 1, dof: 5, vpRange: [0, 1] }, 3000, { level: 1.2 }))],
    ['brine', 'a pressure of 0 MPa', refusal(() => FL.brine(80, 0, 0.035))],
    ['brine', 'a salinity of 0.6', refusal(() => FL.brine(80, 20, 0.6))],
    ['apiToRho0', 'an oil gravity of 0 API', refusal(() => FL.apiToRho0(0))],
    ['woodMix', 'saturations of 0.6 and 0.6', refusal(() => FL.woodMix([{ k: 2e9, rho: 1000, sat: 0.6 }, { k: 1e9, rho: 800, sat: 0.6 }]))],
    ['mixMinerals', 'quartz 0.7 and clay 0.2', refusal(() => MN.mixMinerals([{ name: 'quartz', frac: 0.7 }, { name: 'clay', frac: 0.2 }]))],
    ['substituteVels', 'a negative Vp', refusal(() => GS.substituteVels(-3000, 1600, 2300, 36e9, 0.2, { k: 1e9, rho: 800 }, { k: 2.6e9, rho: 1000 }))],
    ['substituteVels', 'a porosity of 0', refusal(() => GS.substituteVels(3000, 1600, 2300, 36e9, 0, { k: 1e9, rho: 800 }, { k: 2.6e9, rho: 1000 }))],
    ['fitFluidLine', 'two interfaces', refusal(() => AT.fitFluidLine([{ a: 0.1, b: -0.2 }, { a: -0.1, b: 0.2 }]))],
    ['backgroundSlope', 'a Vs/Vp of 1.2', refusal(() => AT.backgroundSlope(1.2))],
    ['zoeppritzRpp', 'an upper layer with Vs above Vp', refusal(() => AV.zoeppritzRpp(2000, 2100, 2300, 3000, 1600, 2300, 10))],
  ];
  for (const m of msgs) if (/[–—]/.test(m[2])) throw new Error(`refusal table: a message carries a dash: ${m[2]}`);
  const shown = msgs.map(([fn, input, msg]) => [`\`${fn}\``, input, `"${msg}"`]);
  const nanPoint = L.elastic(2000, 2100, 2300);
  out.push(section(5, 'The panels, and every refusal the Associate engines make', 'Associate m01 l05 and Associate m03 and Associate m04 and Associate m05', `
The feasibility explorer runs the Associate engines on the Ekene pack or on a case a learner pastes. When an engine cannot answer it throws, and the panel prints the engine's own message unchanged. Each row below was produced by calling the function with the input shown:

${table(['function', 'input', 'the engine\'s message'], shown)}

${whole(msgs.length)} refusals across ${whole(new Set(msgs.map((m) => m[0])).size)} functions. Two more messages exist in gassmann.js (an implied saturated modulus that is not positive, and an inverse Gassmann dry modulus that is not positive); each carries a punctuation mark this course does not print, so the course names them by what they refuse and does not quote them.

A RESULT IS NO REFUSAL. \`elasticPoint\` with Vs above Vp does not throw: it returns every field as NaN (AI ${String(nanPoint.ai)}, Vp/Vs ${String(nanPoint.vpvs)}), and a panel shows the gap.`));

  /* ------------------------------------------------------------ 6 */
  out.push(section(6, 'What is graded, where the practicals run, the Suite app, and what is never graded', 'Associate m01 l05 and Associate m06 l04 and Professional m06 l04 and Expert m06', `
THE SUITE APP for this course is QI Studio, in the Suite's Geoscience module, with Rock Physics Studio beside it; both run the same engine files the course vendors. Every practical in this course also runs in the course's own four explorer panels (feasibility, prestack, inversion and prospect), which call the vendored engines on the Ekene pack or on a learner's own case, so a learner without a Suite seat can work every exercise.

WHAT IS GRADED. Each tier ends on a capstone of six numeric fields. Every field is a return value of an engine on a held-out synthetic case the capstone supplies as a case file; the learner pastes the case into the tier's panel and reads the six figures. The capstone cases are never the Ekene field: the members-only videos speak the Ekene answers aloud, so a graded figure on Ekene could be answered by watching a video.

WHAT IS NEVER GRADED. Any figure in the videos; any Ekene figure; any verdict, class name or category (section 8, the usability grades); and any figure that depends on a choice the case does not state.`));

  /* ------------------------------------------------------------ 7 */
  const inv = L.inventory();
  const invRows = inv.map((r) => [r.well, r.kind, r.logs ? 'yes' : 'no', r.logs ? whole(r.curves.length) : 'none', r.logs ? (r.sonic ? 'yes' : 'no') : 'none', r.logs ? (r.shear ? 'yes' : 'no') : 'none', r.logs ? (r.density ? 'yes' : 'no') : 'none', whole(r.checkshots), r.ekeneTop_ft == null ? 'none' : f6(r.ekeneTop_ft)]);
  const logged = inv.filter((r) => r.logs);
  out.push(section(7, 'The data inventory', 'Associate m02 l01 and Associate m02 l03', `
WHAT A QI STUDY NEEDS FROM EACH WELL. Rock physics needs Vp (a sonic) and density; a measured shear log means the shear-dependent results rest on a measurement, where without one they rest on an estimate; porosity, shale volume and saturation feed the substitution; checkshots tie the well to the seismic; the elevation and the deviation survey place it in depth.

${table(['well', 'kind', 'logs', 'curves', 'sonic DT', 'shear DTS', 'density RHOB', 'checkshot levels', 'top Ekene Sand ft (kit tops)'], invRows)}

${whole(logged.length)} of ${whole(inv.length)} wells have logs. Of those, ${whole(logged.filter((r) => r.shear).length)} carry a shear sonic, ${whole(logged.filter((r) => r.density).length)} a density log and ${whole(logged.filter((r) => r.checkshots >= 2).length)} two or more checkshot levels. Ekene-9 is the well without density: its curves are ${P.headers['Ekene-9'].curves.join(', ')}.`));

  /* ------------------------------------------------------------ 8 */
  const regWells = Object.entries(P.headers).filter(([, h]) => h.logs).map(([name, h]) => ({
    well: {
      id: name, name, kb_m: h.kb_m,
      checkshots: Array.from({ length: h.checkshots }, (_, i) => ({ i })),
      deviation: Array.from({ length: h.surveyStations }, (_, i) => ({ i })),
    },
    logs: h.curves.map((c) => ({ mnemonic: c, start_md_m: h.start_m, stop_md_m: h.stop_m })),
    zones: h.ekeneTop_m != null ? [{ name: 'Ekene Sand', top_md_m: h.ekeneTop_m, base_md_m: h.ekeneBase_m }] : [],
  }));
  const matrix = usabilityMatrix(regWells, ['Ekene Sand']);
  const items = ['sonic', 'density', 'shear', 'porosity', 'vsh', 'sw', 'checkshots', 'datum', 'survey'];
  const mRows = matrix.rows.map((r) => {
    const c = r.cells[0];
    const g = Object.fromEntries(c.items.map((it) => [it.key, it.grade]));
    return [r.wellName, c.grade, ...items.map((k) => g[k] || 'none')];
  });
  const issues = suggestedIssues(matrix);
  const e9 = matrix.rows.find((r) => r.wellName === 'Ekene-9').cells[0].items;
  ctx.suiteFiles = SUITE_FILES;
  out.push(section(8, 'The usability matrix and the issue register', 'Associate m02 l02 and Associate m02 l03 and Associate m02 l04', `
QI Studio grades every well against every target interval, item by item, as good, limited or missing, and a cell takes the worst of its items. Sonic and density are required (missing when absent); shear, porosity, shale volume and saturation are limited when absent, because the study can go on with an estimate; fewer than two checkshot levels is limited; an unset elevation is missing; no deviation survey is limited. The table is QI Studio's own function (\`usabilityMatrix\` in ${SUITE_FILES.usability}, petrolord-suite ${ctx.suiteCommit.slice(0, 9)}) run on the pack's headers for the target Ekene Sand, with the porosity, shale volume and saturation curves the logs carry (the LAS files carry none of the three, so each reads as absent):

${table(['well', 'cell', ...items], mRows)}

Counts over the ${whole(matrix.rows.length)} cells: good ${whole(matrix.count.good)}, limited ${whole(matrix.count.limited)}, missing ${whole(matrix.count.missing)}.

Ekene-9's density item reads: "${e9.find((i) => i.key === 'density').text}"

THE ISSUE REGISTER. QI Studio suggests one issue per well and item kind that is not good (\`suggestedIssues\`): ${whole(issues.length)} issues on this matrix, ${whole(issues.filter((i) => i.severity === 'high').length)} high and ${whole(issues.filter((i) => i.severity === 'medium').length)} medium. A missing item is high, a limited one medium. The suggested remedy for a missing density log is "${issues.find((i) => i.wellName === 'Ekene-9' && i.area === 'Density').remedy}" The user keeps, edits or dismisses each one.

IN PRACTICE the porosity, shale volume and saturation curves come from Petrophysics Studio before a QI study starts; the pack carries the kit's own PHIT, VSH and SW for Ekene-1 to Ekene-4 for that reason.`));

  /* ------------------------------------------------------------ 9 */
  const W1 = L.timeWindow(L.qcTraces('spread'), { t0Ms: E.qcWindowsMs[0][0], t1Ms: E.qcWindowsMs[0][1] });
  const S1 = L.spectrum(W1, L.QC_CLOCK.dtMs, { taper: E.qcTaper });
  const freqs = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 80];
  const ampRows = freqs.map((fz) => {
    const k = Math.round(fz / S1.df);
    return [f6(S1.freqHz[k]), f6(S1.amp[k]), f6(db(S1.amp[k], S1.peakAmp))];
  });
  const rk = L.ricker(30, L.QC_CLOCK.dtMs, 60);
  const rs = L.traceSpectrum(rk, L.QC_CLOCK.dtMs, { taper: 0 });
  const g30 = GOLD_QC.ricker.find((g) => g.fp === 30);
  out.push(section(9, 'The amplitude spectrum', 'Associate m03 l01', `
HOW THE ENGINE MEASURES IT (seismicQc.js). Each trace is tapered at both ends by a Tukey window (the stated taper fraction), padded with zeros to twice the next power of two samples, and transformed; the one-sided amplitude is the modulus at each frequency. \`averageSpectrum\` averages the POWER of many traces and takes the root. The frequency step is 1000 / (padded length x sample interval in ms).

THE EKENE SPECTRUM. The ${whole(S1.traces)} spread traces of the full stack, window ${whole(E.qcWindowsMs[0][0])} to ${whole(E.qcWindowsMs[0][1])} ms (it holds the Ekene Sand), sample interval ${f6(L.QC_CLOCK.dtMs)} ms, taper ${f6(E.qcTaper)}: frequency step ${f6(S1.df)} Hz, peak ${f6(S1.peakHz)} Hz. The amplitude at a few frequencies, and relative to the peak in decibels (20 log10 of amplitude over peak amplitude):

${table(['frequency Hz', 'amplitude', 'relative to the peak, dB'], ampRows)}

The peak amplitude is ${f6(S1.peakAmp)} (the peak is refined between frequency steps by a parabola through the three highest values, so it can sit above every tabled amplitude).

A CHECK AGAINST A KNOWN ANSWER. A Ricker wavelet of 30 Hz has an amplitude spectrum known in closed form (the engine's oracle, goldens.seismicQc.json): peak ${f6(g30.peakHz)} Hz, -6 dB edges ${f6(g30.band6[0])} and ${f6(g30.band6[1])} Hz, centroid ${f6(g30.centroidHz)} Hz. The engine on that wavelet sampled every ${f6(L.QC_CLOCK.dtMs)} ms (${whole(rk.length)} samples, no taper) reads peak ${f6(rs.peakHz)} Hz, edges ${f6(rs.low6Hz)} and ${f6(rs.high6Hz)} Hz, centroid ${f6(rs.centroidHz)} Hz. The small differences are the sampling and the finite length.`));

  /* ------------------------------------------------------------ 10 */
  const winRows = [];
  for (const [a, b] of [...E.qcWindowsMs, [E.qcWindowsMs[0][0], E.qcWindowsMs[1][1]]]) {
    const s = L.spectrum(L.timeWindow(L.qcTraces('spread'), { t0Ms: a, t1Ms: b }), L.QC_CLOCK.dtMs, { taper: E.qcTaper });
    winRows.push([`${whole(a)} to ${whole(b)}`, f6(s.peakHz), f6(s.centroidHz), f6(s.low6Hz), f6(s.high6Hz), f6(s.bandwidth6Hz), f6(s.low20Hz), f6(s.high20Hz)]);
  }
  const taperRows = [0, 0.1, 0.25, 0.5].map((tp) => {
    const s = L.spectrum(W1, L.QC_CLOCK.dtMs, { taper: tp });
    return [f6(tp), f6(s.peakHz), f6(s.centroidHz), f6(s.low6Hz), f6(s.high6Hz)];
  });
  const one = L.spectrum(L.timeWindow(L.qcTraces('ekene1'), { t0Ms: E.qcWindowsMs[0][0], t1Ms: E.qcWindowsMs[0][1] }), L.QC_CLOCK.dtMs, { taper: E.qcTaper });
  ctx.S1 = S1;
  out.push(section(10, 'Band edges and the centroid', 'Associate m03 l02 and Associate m06 l03', `
DEFINITIONS (spectrumStats). The -6 dB edges are where the amplitude falls to 10^(-6/20) of the peak amplitude, either side of the peak, interpolated linearly between frequency steps; the -20 dB edges the same at 10^(-20/20). The -6 dB bandwidth is the high edge less the low edge. The centroid is the power-weighted mean frequency, the sum of f A(f)^2 over the sum of A(f)^2.

THE EKENE FULL STACK BY WINDOW, the ${whole(S1.traces)} spread traces, taper ${f6(E.qcTaper)}:

${table(['window ms', 'peak Hz', 'centroid Hz', '-6 dB low Hz', '-6 dB high Hz', '-6 dB bandwidth Hz', '-20 dB low Hz', '-20 dB high Hz'], winRows)}

The peak falls with depth, from the shallow window to the deep one, as the earth absorbs the higher frequencies; the -6 dB edges move less.

THE TAPER IS A STATED CHOICE. The same traces and window at four taper fractions:

${table(['taper', 'peak Hz', 'centroid Hz', '-6 dB low Hz', '-6 dB high Hz'], taperRows)}

ONE TRACE IS NOT A SPECTRUM OF THE VOLUME. The single trace at Ekene-1, same window and taper: peak ${f6(one.peakHz)} Hz, centroid ${f6(one.centroidHz)} Hz, -6 dB ${f6(one.low6Hz)} to ${f6(one.high6Hz)} Hz. A few reflectors make a single trace's spectrum spiky; averaging many traces over the survey smooths it.`));

  /* ------------------------------------------------------------ 11 */
  const N1 = L.timeWindow(L.qcTraces('neighbours'), { t0Ms: E.qcWindowsMs[0][0], t1Ms: E.qcWindowsMs[0][1] });
  const N2 = L.timeWindow(L.qcTraces('neighbours'), { t0Ms: E.qcWindowsMs[1][0], t1Ms: E.qcWindowsMs[1][1] });
  const sn1 = L.snr(N1, { maxLag: E.snrMaxLag });
  const sn2 = L.snr(N2, { maxLag: E.snrMaxLag });
  const lagRows = [0, 1, 3, 6].map((lg) => { const s = L.snr(N1, { maxLag: lg }); return [whole(lg), f6(s.snr), f6(s.snrDb)]; });
  out.push(section(11, 'Signal to noise from trace coherency', 'Associate m03 l03 and Associate m06 l03', `
THE METHOD (Hatton, Worthington and Makin, section 4.4). Two neighbouring traces carrying the same signal and independent noise of equal power have a normalised cross-correlation c at their best alignment, and the signal to noise POWER ratio is c / (1 - c). The engine searches the stated number of samples either side for the best alignment (for dip), clamps c at 0.999999 at most, takes every neighbouring pair, and reports the median ratio and the same in decibels (10 log10 of the ratio).

THE EKENE NEIGHBOURS. ${whole(P.qcNeighbours.traces.length)} neighbouring traces along inline ${whole(P.qcNeighbours.inline)} through Ekene-1, maximum lag ${whole(E.snrMaxLag)} samples:

${table(['window ms', 'pairs', 'median signal to noise (power)', 'in dB'], [
    [`${whole(E.qcWindowsMs[0][0])} to ${whole(E.qcWindowsMs[0][1])}`, whole(sn1.pairs), f6(sn1.snr), f6(sn1.snrDb)],
    [`${whole(E.qcWindowsMs[1][0])} to ${whole(E.qcWindowsMs[1][1])}`, whole(sn2.pairs), f6(sn2.snr), f6(sn2.snrDb)],
  ])}

The first five pairs of the shallow window, in order: ${sn1.perPair.slice(0, 5).map(f6).join(', ')}.

THE LAG, A STATED CHOICE, ON FLAT EVENTS. The shallow window at four maximum lags returns the same median at every lag, because the best alignment of every neighbouring pair here is at zero lag:

${table(['maximum lag, samples', 'median signal to noise', 'in dB'], lagRows)}

A RATIO NEAR THE CLAMP IS A CEILING. When neighbouring traces are almost identical, c is close to 1 and c / (1 - c) grows without bound; at the clamp 0.999999 the ratio is ${f6(0.999999 / (1 - 0.999999))}. QI Studio prints any ratio of 10,000 or more as "over 10,000 (over 40 dB)" for that reason (${SUITE_FILES.qcRun}).`));

  /* ------------------------------------------------------------ 12 */
  const slice = L.packSlice();
  const fpE = L.stripe(slice, { minPeriod: E.footprintPeriods[0], maxPeriod: E.footprintPeriods[1] });
  const planted = L.withStripe(slice, { period: 6, gain: 1.2 });
  const fpP = L.stripe(planted, { minPeriod: E.footprintPeriods[0], maxPeriod: E.footprintPeriods[1] });
  const nIl = slice.length; const nXl = slice[0].length;
  const cyc = (v, n) => n / v.period;
  const fpRow = (label, v, n) => [label, f6(v.period), f6(v.share), f6(v.prominence), f6(cyc(v, n)), isStripe({ ...v, cycles: cyc(v, n) }) ? 'yes' : 'no'];
  out.push(section(12, 'Acquisition footprint and where to measure it', 'Associate m03 l04', `
THE METHOD (footprint). On a time slice (inlines by crosslines) of RMS or absolute amplitudes, the engine averages the slice along one axis to a profile, removes its straight-line trend, and finds the strongest periodic stripe in the stated band of periods: the period in lines, its share of the profile's variance (with its harmonics), and its prominence over the median power of the band. Measure it on RMS amplitude: on signed seismic a stripe of gain averages away.

QI STUDIO'S RULE for calling a stripe a footprint (\`isStripe\`, ${SUITE_FILES.qcRun}): a share above 0.3, a prominence of 10 or more, and at least five repeats of the period across the slice (cycles = lines in the slice / period).

THE EKENE SLICE: RMS amplitude of the full stack, ${whole(P.slice.t0_ms)} to ${whole(P.slice.t1_ms)} ms, ${whole(nIl)} inlines by ${whole(nXl)} crosslines, periods searched ${whole(E.footprintPeriods[0])} to ${whole(E.footprintPeriods[1])} lines. And a DESIGNED TEACHING CASE: the same slice with every sixth crossline multiplied by 1.2 (a stated stripe added by the course, labelled as such):

${table(['slice and axis', 'period, lines', 'share', 'prominence', 'cycles', 'a footprint by the rule'], [
    fpRow('Ekene, along the crosslines', fpE.alongCrossline, nXl),
    fpRow('Ekene, along the inlines', fpE.alongInline, nIl),
    fpRow('designed stripe, along the crosslines', fpP.alongCrossline, nXl),
    fpRow('designed stripe, along the inlines', fpP.alongInline, nIl),
  ])}

The Ekene slice carries no footprint: a prominence of tens with a share of a few hundredths is the random variation of a slice. The designed stripe is found at its period with about half the variance, and the inline axis it was not added to does not move.`));

  /* ------------------------------------------------------------ 13 */
  const wet = L.zoneSamples(E1, 'water');
  const gc = L.shearAgainstGc(wet);
  const pickRows = (rows, k) => { const step = Math.floor(rows.length / k); return Array.from({ length: k }, (_, i) => rows[i * step]); };
  const gcRows = pickRows(gc.rows, 6).map((r) => [f6(r.md_ft), f6(r.vp), f6(r.vs), f6(r.vsh), f6(r.gc), f6(r.ratio)]);
  const gcOil = L.shearAgainstGc(L.zoneSamples(E1, 'oil'));
  out.push(section(13, 'What Rock Physics hands to QI, and measured shear against Greenberg-Castagna', 'Associate m04 l01 and Associate m04 l02', `
WHAT ROCK PHYSICS HANDS TO QI. Elastic logs at the wells (Vp, Vs, density), the fluids at reservoir conditions, the substitution of one fluid for another, and the reflection coefficients they imply. QI takes these to the seismic. The Rock Physics course teaches each method in full; this course states the inputs and reads the outputs.

GREENBERG-CASTAGNA (gcSandShaleVs). Shear from Vp by a published regression per lithology, Vs = a2 Vp^2 + a1 Vp + a0 in km/s; sandstone a2 ${f6(L.GC_COEFF.sandstone[0])}, a1 ${f6(L.GC_COEFF.sandstone[1])}, a0 ${f6(L.GC_COEFF.sandstone[2])}; shale a2 ${f6(L.GC_COEFF.shale[0])}, a1 ${f6(L.GC_COEFF.shale[1])}, a0 ${f6(L.GC_COEFF.shale[2])}; mixed on Vsh as the average of the arithmetic and harmonic means of the two.

AGAINST THE MEASURED SHEAR, the ${whole(gc.n)} water-leg net sand samples of Ekene-1:

${table(['depth ft', 'Vp m/s', 'measured Vs m/s', 'Vsh', 'Greenberg-Castagna Vs m/s', 'measured / GC'], gcRows)}

The mean of measured / Greenberg-Castagna over the ${whole(gc.n)} samples is ${f6(gc.meanRatio)}; over the ${whole(gcOil.n)} oil-leg samples, where the oil softens Vp and leaves the shear modulus alone, it is ${f6(gcOil.meanRatio)}. A published regression is somebody else's rock; a measured shear log calibrates the field's own.`));

  /* ------------------------------------------------------------ 14 */
  const vpAt = [2900, 3100, 3300, 3700];
  const trend = L.shearTrend(wet, { form: 'linear', level: E.shearLevel, at: vpAt });
  const t80 = L.shearTrend(wet, { form: 'linear', level: 0.8, at: [3100] });
  const quad = L.shearTrend(wet, { form: 'quadratic', level: E.shearLevel, at: [3100] });
  const all4 = L.PACK_WELLS.flatMap((w) => L.zoneSamples(L.packWell(w), 'water'));
  const t4 = L.shearTrend(all4, { form: 'linear', level: E.shearLevel, at: [3100] });
  ctx.trend = trend;
  out.push(section(14, 'The local shear trend and its prediction interval', 'Associate m04 l03', `
THE FIT (fitVsRegression). Ordinary least squares of measured Vs (m/s) on Vp in km/s: linear Vs = c0 + c1 Vp, or quadratic with a c2 Vp^2 term. The slope c1 is in m/s of Vs per km/s of Vp. It returns the coefficients, the sample count n, the degrees of freedom (n less the coefficients), the residual standard error s, R squared and the Vp range of the calibration.

THE PREDICTION (predictVs). At a new Vp the predicted Vs carries a prediction interval Vs +/- t s sqrt(1 + leverage), with t Student's quantile at (1 + level) / 2 on the degrees of freedom; sigma is s sqrt(1 + leverage). A Vp outside the calibration range is flagged as extrapolated.

EKENE-1, the ${whole(trend.n)} water-leg net sand samples, linear:

${table(['quantity', 'value'], [
    ['c0, m/s', f6(trend.coef[0])], ['c1 (the slope), m/s per km/s', f6(trend.coef[1])], ['n', whole(trend.n)], ['degrees of freedom', whole(trend.dof)],
    ['residual standard error s, m/s', f6(trend.s)], ['R squared', f6(trend.r2)], ['lowest Vp, m/s', f6(trend.vpRange[0])], ['highest Vp, m/s', f6(trend.vpRange[1])],
  ])}

Predictions at the ${f6(E.shearLevel)} level:

${table(['Vp m/s', 'predicted Vs m/s', 'sigma m/s', 'low m/s', 'high m/s', 'extrapolated'], trend.predictions.map((p) => [f6(p.vp), f6(p.vs), f6(p.sigma), f6(p.lo), f6(p.hi), p.extrapolated ? 'yes' : 'no']))}

THE LEVEL IS A STATED CHOICE. At Vp 3100 m/s and the 0.8 level the interval is ${f6(t80.predictions[0].lo)} to ${f6(t80.predictions[0].hi)} m/s, narrower than at ${f6(E.shearLevel)}.

THE FORM IS A STATED CHOICE. Quadratic on the same samples: c0 ${f6(quad.coef[0])}, c1 ${f6(quad.coef[1])}, c2 ${f6(quad.coef[2])}, s ${f6(quad.s)} m/s, predicted Vs at 3100 m/s ${f6(quad.predictions[0].vs)}.

MORE WELLS. The water-leg net sand of all four pack wells together (${whole(t4.n)} samples): c0 ${f6(t4.coef[0])}, c1 ${f6(t4.coef[1])}, s ${f6(t4.s)} m/s; predicted Vs at 3100 m/s ${f6(t4.predictions[0].vs)}, interval ${f6(t4.predictions[0].lo)} to ${f6(t4.predictions[0].hi)} m/s.`));

  /* ------------------------------------------------------------ 15 */
  const shaleM = L.layerMeans(L.zoneSamples(E1, 'shale'));
  const waterM = L.layerMeans(wet);
  const layers = [['cap rock (Ogbia Shale)', shaleM], ['oil leg', oilM], ['water leg', waterM]];
  const elRows = layers.map(([n, m]) => { const e = L.elastic(m.vp, m.vs, m.rho); return [n, whole(m.n), f6(m.vp), f6(m.vs), f6(m.rho), f6(e.ai), f6(e.si), f6(e.vpvs), f6(e.pr), f6(e.lambdaRho / 1e12), f6(e.muRho / 1e12)]; });
  ctx.layers = { shaleM, oilM, waterM };
  out.push(section(15, 'The elastic set', 'Associate m04 l04 and Associate m01 l04', `
THE SET (elasticPoint), from Vp, Vs and density in SI: AI = Vp rho; SI = Vs rho; Vp/Vs; Poisson's ratio (Vp^2 - 2 Vs^2) / (2 (Vp^2 - Vs^2)); K = rho (Vp^2 - 4/3 Vs^2); mu = rho Vs^2; lambda-rho = AI^2 - 2 SI^2 and mu-rho = SI^2 (Goodway, Chen and Downton). The course prints lambda-rho and mu-rho in units of 10^12 kg^2/(m4 s2), which is (GPa)(g/cc).

EKENE-1, the means of each selection:

${table(['layer', 'samples', 'Vp m/s', 'Vs m/s', 'density kg/m3', 'AI kg/(m2 s)', 'SI kg/(m2 s)', 'Vp/Vs', 'Poisson\'s ratio', 'lambda-rho', 'mu-rho'], elRows)}

The oil leg is softer than the water leg in AI and in Vp/Vs; part of that gap is fluid and part is rock (porosity and shale volume differ between the legs: oil leg mean porosity ${f6(oilM.phit)}, Vsh ${f6(oilM.vsh)}; water leg ${f6(waterM.phit)}, ${f6(waterM.vsh)}). Section 17 separates the two by substituting the same rock.`));

  /* ------------------------------------------------------------ 16 */
  const mixRows = [0.2, 0.5, 0.8, 1].map((sw) => { const m = L.poreFluid(fluids, sw); return [f6(sw), f6(m.k / 1e9), f6(m.rho)]; });
  const fM = L.poreFluid(fluids, oilM.sw);
  out.push(section(16, 'The fluids at Ekene conditions', 'Associate m05 l01', `
THE CONVERSIONS the lab makes before calling Batzle-Wang: temperature ${P.conditions.ekene.tF} degF = ${f6(fluids.tC)} degC; pressure ${P.conditions.ekene.pPsia} psia = ${f6(fluids.pMPa)} MPa (1 MPa = ${f6(L.PSI_PER_MPA)} psi); gas-oil ratio ${P.conditions.ekene.gorScfStb} scf/stb = ${f6(fluids.gorLL)} L/L; ${P.conditions.ekene.api} API = a reference density of ${f6(fluids.rho0)} g/cc (apiToRho0).

${table(['fluid', 'density kg/m3', 'Vp m/s', 'bulk modulus GPa'], [
    ['brine (brine)', f6(fluids.brine.rho), f6(fluids.brine.vp), f6(fluids.brine.k / 1e9)],
    ['live oil (liveOil)', f6(fluids.oil.rho), f6(fluids.oil.vp), f6(fluids.oil.k / 1e9)],
  ])}

THE PORE FLUID at a water saturation Sw is brine and oil mixed by Wood's average (woodMix), the uniform mix:

${table(['Sw', 'bulk modulus GPa', 'density kg/m3'], mixRows)}

At the oil-leg mean Sw ${f6(oilM.sw)} the pore fluid's modulus is ${f6(fM.k / 1e9)} GPa: the Wood average sits close to the softer phase until the brine fraction is high.`));

  /* ------------------------------------------------------------ 17 */
  const oilS = L.zoneSamples(E1, 'oil');
  const sub = L.substituteZone(oilS, fluids);
  const subRows = pickRows(sub.rows, 8).map((r) => {
    const s = oilS.find((x) => x.md_ft === r.md_ft);
    return [f6(r.md_ft), f6(s.phit), f6(s.vsh), f6(s.sw), f6(s.vp), f6(r.vp), f6(s.vs), f6(r.vs), f6(s.rho), f6(r.rho)];
  });
  const subRows2 = pickRows(sub.rows, 8).map((r) => [f6(r.md_ft), f6(r.kmin / 1e9), f6(r.kflA / 1e9), f6(r.aiBefore), f6(r.aiAfter), f6(r.vpvsBefore), f6(r.vpvsAfter)]);
  const eW = L.elastic(waterM.vp, waterM.vs, waterM.rho);
  ctx.sub = sub;
  out.push(section(17, 'Oil-to-brine substitution on a log, and how far impedance and Vp/Vs move', 'Associate m05 l02 and Associate m05 l03 and Associate m06 l02', `
THE METHOD, sample by sample (lab \`substituteSample\`): the mineral modulus from quartz and clay by Voigt-Reuss-Hill on the sample's Vsh (mixMinerals; quartz K ${f6(L.MINERALS.quartz.k / 1e9)} GPa, clay K ${f6(L.MINERALS.clay.k / 1e9)} GPa); the in situ pore fluid from brine and oil by Wood at the sample's Sw; the new fluid brine (Sw 1); then Gassmann through the dry rock (substituteVels) with the sample's PHIT. The shear modulus does not change; the density swaps the pore fluid, rho_new = rho + phi (rho_brine - rho_fluid).

EKENE-1 OIL LEG, ${whole(sub.n)} net sand samples. Eight of them, before and after:

${table(['depth ft', 'PHIT', 'Vsh', 'Sw', 'Vp in situ', 'Vp brine', 'Vs in situ', 'Vs brine', 'density in situ', 'density brine'], subRows)}

${table(['depth ft', 'mineral K GPa', 'in situ fluid K GPa', 'AI in situ', 'AI brine', 'Vp/Vs in situ', 'Vp/Vs brine'], subRows2)}

THE MEANS over the ${whole(sub.n)} samples (each the mean of the sample values):

${table(['quantity', 'in situ (oil)', 'substituted to brine', 'change, percent'], [
    ['AI kg/(m2 s)', f6(sub.aiBefore), f6(sub.aiAfter), f6(pct(sub.aiBefore, sub.aiAfter))],
    ['Vp/Vs', f6(sub.vpvsBefore), f6(sub.vpvsAfter), f6(pct(sub.vpvsBefore, sub.vpvsAfter))],
  ])}

AGAINST THE WATER LEG. The measured water leg's mean-of-layer AI is ${f6(eW.ai)} kg/(m2 s) and its Vp/Vs ${f6(eW.vpvs)}. The substituted oil leg and the water leg are different rock, so the substituted figures are the fluid effect alone and the water-leg figures add the difference in porosity and clay.`));

  /* ------------------------------------------------------------ 18 */
  const wt = L.wetTrend(E1, fluids, { blockFt: E.trendBlockFt });
  const ptRows = wt.points.slice(0, 8).map((p) => [f6(p.md_ft), f6(p.a), f6(p.b)]);
  const wtAlt = [8, 24].map((b) => { const w = L.wetTrend(E1, fluids, { blockFt: b }); return [whole(b), whole(w.blockSamples), whole(w.points.length), f6(w.line.slope), f6(w.line.rmsDistance)]; });
  ctx.wt = wt;
  out.push(section(18, 'The wet trend on a crossplot', 'Associate m05 l04', `
THE METHOD, as QI Studio and Rock Physics Studio draw it (lab \`wetTrend\`). Every sample of the window with oil in it (Sw below 1) is taken to brine by the substitution of section 17; the logs are blocked into blocks of the stated length (blockLogs, a block's mean Vp, Vs and density); every boundary between two blocks gives an intercept A and a gradient B by Shuey (interfacePoints); and the fluid line through the origin is fitted to the points by total least squares, the principal axis of the points about the origin (fitFluidLine), so neither A nor B is treated as free of error.

EKENE-1, the whole pack window, block length ${whole(E.trendBlockFt)} ft (${whole(wt.blockSamples)} samples of ${f6(wt.stepFt)} ft): ${whole(wt.samples)} samples, ${whole(wt.substituted)} of them substituted, ${whole(wt.blocks)} blocks, ${whole(wt.points.length)} interfaces. The fitted line: slope B / A ${f6(wt.line.slope)}, angle ${f6(wt.line.angleDeg)} degrees, root mean square distance of the points from it ${f6(wt.line.rmsDistance)}.

The first eight points:

${table(['depth of the lower block ft', 'A', 'B'], ptRows)}

THE PUBLISHED LINE FOR COMPARISON (backgroundSlope, Castagna, Swan and Foster): for a constant Vs/Vp and a Gardner density exponent of 0.25, B / A = (1 - 4 (Vs/Vp)^2 (g + 2)) / (1 + g). At the blocks' mean Vs/Vp of ${f6(wt.vsVp)} it is ${f6(wt.castagnaSlope)}.

THE BLOCK LENGTH IS A STATED CHOICE:

${table(['block length ft', 'samples a block', 'interfaces', 'fitted slope', 'rms distance'], wtAlt)}`));

  /* ------------------------------------------------------------ 19 */
  const brineL = { vp: sub.vpAfter, vs: sub.vsAfter, rho: sub.rhoAfter };
  const abIn = L.interfaceAB(shaleM, oilM);
  const abBr = L.interfaceAB(shaleM, brineL);
  const dIn = L.distance(abIn.a, abIn.b, wt.line.slope);
  const dBr = L.distance(abBr.a, abBr.b, wt.line.slope);
  const dInC = L.distance(abIn.a, abIn.b, wt.castagnaSlope);
  const dBrC = L.distance(abBr.a, abBr.b, wt.castagnaSlope);
  ctx.ab = { abIn, abBr, dIn, dBr };
  out.push(section(19, 'Distance from the wet trend', 'Associate m05 l05 and Associate m06 l02', `
THE DISTANCE (distanceFromLine). The signed perpendicular distance of a point (A, B) from the line B = m A is (B - m A) / sqrt(1 + m^2). Negative is below and to the left of a falling line, the side a hydrocarbon sand moves to.

THE TOP OF THE EKENE SAND AT EKENE-1, as an interface between the mean cap rock and the mean oil leg (in situ), and between the mean cap rock and the oil leg's substituted means (brine: Vp ${f6(brineL.vp)} m/s, Vs ${f6(brineL.vs)} m/s, density ${f6(brineL.rho)} kg/m3):

${table(['interface', 'A', 'B', 'distance from the fitted line', 'distance from the published line'], [
    ['cap rock over the oil leg (in situ)', f6(abIn.a), f6(abIn.b), f6(dIn), f6(dInC)],
    ['cap rock over the oil leg taken to brine', f6(abBr.a), f6(abBr.b), f6(dBr), f6(dBrC)],
  ])}

Against the fitted line the in situ interface lies ${f6(dBr - dIn)} further to the hydrocarbon (negative) side than the same rock with brine, so the oil moves the point off the trend. Which line the distance is measured from is a stated choice, and the two lines give different distances.`));

  /* ------------------------------------------------------------ 20 */
  const avoIn = L.modelledAvo(shaleM, oilM);
  const avoBr = L.modelledAvo(shaleM, brineL);
  const avRows = avoIn.exact.map((x, i) => [whole(x.angle), f6(x.r), f6(avoBr.exact[i].r)]);
  ctx.avo = { avoIn, avoBr };
  out.push(section(20, 'Modelled AVO at the zone top', 'Associate m06 l01 and Associate m06 l02', `
THE MODEL. Two half-spaces, the mean cap rock over the mean oil leg (in situ) and over the oil leg taken to brine (section 19). The exact plane-wave reflection coefficient (zoeppritzRpp) at each angle; Shuey's intercept A, gradient B and curvature C (shuey); the class from A and B (avoClass: A above 0.02 is class I, A within 0.02 of zero class II, otherwise class III with B at or below zero and class IV with B above it); and the mean exact coefficient over each angle range at every whole degree, ends included, the way the kit built its angle stacks.

${table(['angle degrees', 'exact R in situ', 'exact R brine'], avRows)}

${table(['quantity', 'in situ (oil)', 'brine'], [
    ['A', f6(avoIn.a), f6(avoBr.a)], ['B', f6(avoIn.b), f6(avoBr.b)], ['C', f6(avoIn.c), f6(avoBr.c)],
    ['class', avoIn.avoClass, avoBr.avoClass],
    ['near mean, 5 to 15 degrees', f6(avoIn.stackMeans.near), f6(avoBr.stackMeans.near)],
    ['mid mean, 15 to 25 degrees', f6(avoIn.stackMeans.mid), f6(avoBr.stackMeans.mid)],
    ['far mean, 25 to 35 degrees', f6(avoIn.stackMeans.far), f6(avoBr.stackMeans.far)],
  ])}

The oil dims the top of the Ekene Sand at every angle: the in situ coefficient is below the brine one throughout, by ${f6(avoBr.exact[0].r - avoIn.exact[0].r)} at normal incidence and ${f6(avoBr.exact[6].r - avoIn.exact[6].r)} at ${whole(avoIn.exact[6].angle)} degrees. Both stay in the same class, so the class alone does not separate oil from brine here.`));

  /* ------------------------------------------------------------ 21 */
  out.push(section(21, 'Writing the verdict, and the Associate capstone', 'Associate m06 l03 and Associate m06 l04', `
THE ENGINES RETURN NUMBERS; THE VERDICT IS WRITTEN. A feasibility verdict answers the two questions with the numbers above and says what each rests on.

${table(['question', 'the Ekene figure', 'section'], [
    ['is the band wide enough at the target', `-6 dB ${f6(ctx.S1.low6Hz)} to ${f6(ctx.S1.high6Hz)} Hz, peak ${f6(ctx.S1.peakHz)} Hz (${whole(E.qcWindowsMs[0][0])} to ${whole(E.qcWindowsMs[0][1])} ms)`, '10'],
    ['is the signal clean enough', `median ${f6(sn1.snr)} (${f6(sn1.snrDb)} dB)`, '11'],
    ['is there a footprint', `share ${f6(fpE.alongCrossline.share)} along the crosslines, no stripe by the rule`, '12'],
    ['how far does the fluid move AI', `${f6(pct(sub.aiBefore, sub.aiAfter))} percent, oil to brine`, '17'],
    ['how far does it move Vp/Vs', `${f6(pct(sub.vpvsBefore, sub.vpvsAfter))} percent`, '17'],
    ['does the top sit off the wet trend', `${f6(dIn)} in situ against ${f6(dBr)} with brine`, '19'],
    ['what the seismic should show', `top Ekene class ${avoIn.avoClass} in situ and with brine; normal-incidence R ${f6(avoIn.exact[0].r)} against ${f6(avoBr.exact[0].r)}`, '20'],
  ])}

WHAT A VERDICT STATES ALONGSIDE ITS NUMBERS: the selections (net sand, legs, cap rock), the fluids and conditions, the taper, the windows, the block length and the line the distance is read from, because each one moves a figure.

THE ASSOCIATE CAPSTONE runs the same steps on a held-out synthetic case: a trace patch and one well with its own layers, fluids and conditions, supplied as a case file the learner pastes into the feasibility explorer. It grades six figures, each read from the panel: the -6 dB low edge and the centroid of the case traces' mean spectrum, the slope of the local shear trend on the case's water-leg net sand, the AI and the Vp/Vs of the stated sample after substitution to brine, and the distance of the case's top interface from its own fitted wet trend. Every input those figures depend on is stated in the case file.`));

  return out;
}
