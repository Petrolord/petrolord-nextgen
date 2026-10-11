// THE PROFESSIONAL SECTIONS OF THE QI TEACHING DIGEST (sections 22 to 41).
// Printed from the Professional teaching lab's return values (qiLabPro.js,
// through qi_engine_p.mjs), on the Ekene teaching pack. Two Suite app files
// are run for the figures they own and labelled as app code wherever they are
// printed: Seismolord's well wavelet (src/pages/apps/Seismolord/lib/
// wellWavelet.js) and QI Studio's AVO at the wells
// (src/pages/apps/QIStudio/services/avoWells.js).
import { LAB as L } from './qi_engine.mjs';
import { LABP as P } from './qi_engine_p.mjs';
import { f6, whole, table, section } from './qi_digest_kit.mjs';
import { extractWellWavelet } from '@suite/pages/apps/Seismolord/lib/wellWavelet.js';
import { compareAtWells } from '@suite/pages/apps/QIStudio/services/avoWells.js';

const E = P.EKENE_PRO;
const WELLS = ['Ekene-1', 'Ekene-2', 'Ekene-3', 'Ekene-4'];
const SUITE = {
  wellWavelet: 'src/pages/apps/Seismolord/lib/wellWavelet.js',
  avoWells: 'src/pages/apps/QIStudio/services/avoWells.js',
  ties: 'src/pages/apps/QIStudio/services/ties.js',
  conditioning: 'engines/qi/conditioning.js',
};
const must = (x, what) => { if (x === null || x === undefined || x.error) throw new Error(`${what}: ${x && x.error}`); return x; };
const msgOf = (fn) => { try { fn(); } catch (e) { return e.message; } throw new Error('expected a refusal'); };

export function sectionsP(ctx) {
  const out = [];
  const sc = ctx.suiteCommit.slice(0, 9);
  const tab = P.packVelocity();
  const pk = L.PACK;

  /* ------------------------------------------------------------ 22 */
  out.push(section(22, 'What the Professional tier adds', 'Professional m01 l01', `
The Associate tier asked whether the seismic can see the fluid, from logs and one modelled interface. The Professional tier takes the question onto the seismic itself: the well is tied to the trace, one wavelet is chosen for the field, the gathers are checked, every offset is given an angle from the velocity, the angle stacks are fitted for intercept and gradient, and the modelled and seismic AVO are compared at every well.

${table(['engine file', 'functions the tier calls', 'what for'], [
    ['engines/seismolord/synthetics.js', '`computeImpedance`, `resampleToDt`, `reflectivity`, `convolveSame`, `extractStatisticalWavelet`, `suggestBulkShift`', 'the synthetic, the statistical wavelet and the bulk shift'],
    ['engines/seismolord/tieWarp.js', '`estimatePhaseRotation`, `rotateConstantPhase`, `makeTieWarp`', 'phase and anchors'],
    ['engines/qi/wavelets.js', '`compareWavelets`, `resampleWavelet`, `normaliseWavelet`', 'one wavelet for the field'],
    ['engines/qi/prestack.js', '`binOffsets`, `dixInterval`, `velocityOnGrid`, `waldenAngle`, `rayTraceAngle`, `angleGather`, `partialStack`, `usableAngle`', 'gathers, angles and angle stacks'],
    ['engines/qi/prestackQc.js', '`nmoStretch`, `stretchMuteOffset`, `residualMoveout`, `foldSummary`', 'gather QC'],
    ['engines/qi/avo.js', '`fitShuey`, `contrastsFromAB`, `backgroundTrend`, `offTrend`, `chiProjection`, `avoClass`', 'AVO on the seismic'],
  ])}

THE STATED BOOKKEEPING the lab does around the engines, and nothing else: the checkshot time-depth line (two-way time = 2 x the one-way time, linear between checkshot levels); the trace clock (sample i at the first sample's time plus i times the sample interval); and an event's time on a trace, the sample of the largest amplitude within ${whole(E.pickHalfWindowMs)} ms of a stated time.

UNITS. Depth in feet; offsets in metres, as the kit's gathers record them; times in milliseconds two-way; velocities in m/s. Seismic amplitudes are in the kit's own trace units, which carry no physical scale: a reflection coefficient and a seismic amplitude are tied by a scale (section 41).`));

  /* ------------------------------------------------------------ 23 */
  const sw1 = must(P.wellStatWavelet('Ekene-1'), 'wavelet');
  const syn1 = must(P.synthetic('Ekene-1', sw1), 'synthetic');
  const tr1 = must(P.wellTrace('Ekene-1', 'full'), 'trace');
  const bs1 = must(P.bulkShift(syn1.synthetic, tr1.values, tr1.dtMs), 'bulk shift');
  const liveIdx = Array.from(syn1.synthetic).map((v, i) => (Number.isFinite(v) ? i : -1)).filter((i) => i >= 0);
  const rcAbs = liveIdx.map((i) => [i, Math.abs(syn1.rc[i])]).sort((a, b) => b[1] - a[1])[0];
  const lag0 = bs1.series.find((s) => s.lagMs === 0);
  out.push(section(23, 'The synthetic in one lesson', 'Professional m01 l02', `
THE SEISMIC INTERPRETATION COURSE TEACHES THE SYNTHETIC IN FULL. The recap: impedance from the sonic and the density, placed in two-way time by the checkshots, resampled to the seismic sample interval, turned into reflection coefficients rc = (Z2 - Z1) / (Z2 + Z1) between neighbouring samples (SEG normal polarity: an increase in impedance is positive), and convolved with a wavelet.

THE ENGINE'S CONVENTIONS (synthetics.js): impedance in (m/s)(g/cc); a sample is a gap when it is not finite or is a seismic or LAS null; the convolution zero-fills gaps and a convolved value whose own coefficient is a gap is not used.

EKENE-1 on its full-stack trace clock (${f6(tr1.dtMs)} ms, first sample ${whole(tr1.t0Ms)} ms), with the statistical wavelet of section 24: the pack's logs give ${whole(syn1.live)} live synthetic samples (the logs span ${f6(L.mToFt(pk.wells['Ekene-1'].rows[0][0]))} to ${f6(L.mToFt(pk.wells['Ekene-1'].rows[pk.wells['Ekene-1'].rows.length - 1][0]))} ft). The largest reflection coefficient in that span is ${f6(syn1.rc[rcAbs[0]])}, at ${f6(P.sampleTime(tr1, rcAbs[0]))} ms. The normalised correlation of the synthetic with the trace at zero shift is ${f6(lag0.corr)}.`));

  /* ------------------------------------------------------------ 24 */
  const wl = WELLS.map((w) => { const s = must(P.wellStatWavelet(w), w); const sp = P.waveletSpectrum(s, 4); return [w, s, sp]; });
  const rk = must(P.rickerOf(25, 4, 60), 'ricker');
  const rks = P.waveletSpectrum(rk, 4);
  const wwMsg = msgOf(() => extractWellWavelet(syn1.rc, tr1.values));
  if (/[–—]/.test(wwMsg)) throw new Error('well wavelet message carries a dash');
  out.push(section(24, 'Statistical and well wavelets', 'Professional m01 l03 and Professional m02 l03', `
TWO WAVELETS COME FROM THE SEISMIC AT A WELL.
- STATISTICAL (extractStatisticalWavelet): the amplitude spectrum of the traces' autocorrelation, taken to zero phase. Its spectrum is the source wavelet's when the reflectivity is white; its phase is ASSUMED zero. The engine reads the stated window length (${whole(E.waveletLengthMs)} ms here) and smoothing (${whole(E.waveletSmoothHz)} Hz here), Hann-tapers the lags and normalises the peak to 1.
- FROM THE WELL: the least-squares (Wiener) wavelet that best convolves the well's reflectivity into the trace at the well, so its phase is MEASURED. This one is Seismolord app code (${SUITE.wellWavelet}, petrolord-suite ${sc}), and it needs a log long enough for the wavelet it is asked for.

THE STATISTICAL WAVELET AT EACH WELL, full stack, window ${whole(E.waveletWindowMs[0])} to ${whole(E.waveletWindowMs[1])} ms, every ${f6(4)} ms:

${table(['well', 'samples', 'peak Hz', 'centroid Hz', '-6 dB low Hz', '-6 dB high Hz'], wl.map(([w, s, sp]) => [w, whole(s.length), f6(sp.peakHz), f6(sp.centroidHz), f6(sp.low6Hz), f6(sp.high6Hz)]))}

For comparison, a 25 Hz Ricker on the same clock (${whole(rk.length)} samples): peak ${f6(rks.peakHz)} Hz, centroid ${f6(rks.centroidHz)} Hz.

THE WELL WAVELET ON THE PACK. Asked for a wavelet at Ekene-1 with its stated window from the pack's logs, Seismolord refuses: "${wwMsg}" The extraction keeps only trace samples whose whole wavelet window (2 x 15 + 1 = 31 samples at its default half length) sits on live reflectivity, and the pack's logs give ${whole(syn1.live)} live samples (section 23), so no sample qualifies. The course's ties therefore use the statistical wavelet.`));

  /* ------------------------------------------------------------ 25 */
  const ph1 = must(P.phaseMatch(syn1.synthetic, tr1.values), 'phase');
  const rotRows = [30, 60, 90].map((deg) => {
    const r = must(P.rotate(Array.from(syn1.synthetic, (v) => (Number.isFinite(v) ? v : 0)), deg), 'rotate');
    const masked = r.map((v, i) => (Number.isFinite(syn1.synthetic[i]) ? v : NaN));
    const p = must(P.phaseMatch(masked, tr1.values), 'phase');
    return [whole(deg), f6(p.phiDeg), f6(p.corr0), f6(p.corr)];
  });
  out.push(section(25, 'Phase and correlation', 'Professional m01 l04', `
THE ROTATION (rotateConstantPhase): s cos(phi) + H(s) sin(phi), with H the Hilbert transform. THE BEST PHASE (estimatePhaseRotation): phi = atan2(<H(s), r>, <s, r>) over the samples both traces carry, reported with the actual correlation of the rotated synthetic with the trace and the correlation before rotation. The lab runs it on the synthetic's live span, because the Hilbert transform cannot cross a gap.

EKENE-1, the synthetic of section 23 against the full-stack trace: best phase ${f6(ph1.phiDeg)} degrees, correlation before rotation ${f6(ph1.corr0)}, after ${f6(ph1.corr)}.

A DESIGNED TEACHING CASE: the same synthetic rotated by a stated phase first, then matched again:

${table(['phase added, degrees', 'best phase found, degrees', 'correlation before', 'correlation after'], rotRows)}`));

  /* ------------------------------------------------------------ 26 */
  const bsRows = WELLS.map((w) => {
    const s = must(P.wellStatWavelet(w), w); const sy = must(P.synthetic(w, s), w); const t = must(P.wellTrace(w, 'full'), w);
    const b = must(P.bulkShift(sy.synthetic, t.values, t.dtMs), w);
    return [w, f6(b.lagMs), f6(b.corr)];
  });
  const shiftRows = [-8, 8].map((sh) => {
    const sy = must(P.synthetic('Ekene-1', sw1, { shiftMs: sh }), 'shifted');
    const b = must(P.bulkShift(sy.synthetic, tr1.values, tr1.dtMs), 'shift');
    return [f6(sh), f6(b.lagMs), f6(b.corr)];
  });
  const topT = P.checkshotTwt('Ekene-1', L.packWell('Ekene-1').topFt);
  const warp = must(P.tieWarp([{ synTwtMs: 1250, seisTwtMs: 1252 }, { synTwtMs: 1350, seisTwtMs: 1356 }]), 'warp');
  const wRows = [1200, 1250, 1300, 1350, 1400].map((t) => [f6(t), f6(warp.toSeismicMs(t))]);
  out.push(section(26, 'Bulk shift and anchors', 'Professional m02 l01', `
THE BULK SHIFT (suggestBulkShift): the normalised cross-correlation of the synthetic with the trace at every whole-sample lag up to the stated search (${whole(E.bulkMaxLagMs)} ms), on the samples both carry; the lag of the largest correlation. POSITIVE means the seismic event is later, so the synthetic moves down.

EVERY PACK WELL, statistical wavelet of its own trace:

${table(['well', 'bulk shift ms', 'correlation'], bsRows)}

A DESIGNED TEACHING CASE: Ekene-1's checkshot times moved by a stated amount before the synthetic is built; the bulk shift finds the move back:

${table(['checkshot times moved by, ms', 'bulk shift found, ms', 'correlation'], shiftRows)}

ANCHORS (makeTieWarp). Pairs of (synthetic time, seismic time); between two anchors the mapping is linear, beyond the first and the last it continues with slope one (a constant shift, the single-anchor case is a bulk shift). A DESIGNED pair, (1250, 1252) and (1350, 1356) ms:

${table(['synthetic time ms', 'seismic time ms'], wRows)}

Both times must increase from one anchor to the next; makeTieWarp refuses a pair that would fold time (its message carries a punctuation mark the course does not print, so the course names it by what it refuses).`));

  /* ------------------------------------------------------------ 27 */
  const cs = pk.checkshots['Ekene-1'].rows.filter((r) => r[0] > 1300 && r[0] < 1800);
  const topRows = WELLS.map((w) => { const pw = L.packWell(w); return [w, f6(pw.topFt), f6(P.checkshotTwt(w, pw.topFt))]; });
  out.push(section(27, 'The time-depth record every app reads', 'Professional m02 l02', `
THE RECORD. A tie is committed as a time-depth record: the checkshots (depth, one-way time), and, once a tie is accepted, derived rows from its anchors through the same time-depth line (tieWarp warpToCheckshots), kept as a new set beside the imported checkshots, which stay as they were imported. QI Studio reads the tie each well has in Seismolord, with its QC record (${SUITE.ties}).

EKENE-1 CHECKSHOTS round the Ekene Sand:

${table(['depth ft', 'one-way time ms', 'two-way time ms'], cs.map((r) => [f6(L.mToFt(r[0])), f6(r[1]), f6(2 * r[1])]))}

THE TOP OF THE EKENE SAND IN TIME at every pack well, linear between checkshot levels:

${table(['well', 'top ft', 'two-way time ms'], topRows)}

With a bulk shift of zero (section 26) the committed time is the checkshot time; a non-zero shift moves every time below by the same amount.`));
  void topT;

  /* ------------------------------------------------------------ 28, 29, 30 */
  const ws = WELLS.map((w) => ({ name: w, samples: must(P.wellStatWavelet(w), w) }));
  const cmp = must(P.compare(ws), 'compare');
  const avSp = P.waveletSpectrum(Array.from(cmp.average), 4);
  out.push(section(28, 'Comparing wavelets across wells', 'Professional m02 l03', `
THE COMPARISON (compareWavelets): the first wavelet is the reference; every other is aligned to it by the lag (up to ${whole(E.compareMaxLag)} samples) of largest correlation, all are scaled to unit energy, and the zero-lag correlation of every pair is the similarity.

THE FOUR STATISTICAL WAVELETS of section 24:

${table(['well', 'lag to the reference, samples', ...WELLS], cmp.aligned.map((a, i) => [a.name, whole(a.lag), ...cmp.similarity[i].map(f6)]))}`));

  out.push(section(29, 'Aligning and averaging into one field wavelet', 'Professional m02 l04', `
THE FIELD WAVELET (compareWavelets): the mean of the aligned, unit-energy wavelets, scaled to unit energy again. Each well's misfit is its correlation with that average.

${table(['well', 'correlation with the average'], cmp.misfit.map((m) => [m.name, f6(m.corrToAverage)]))}

The average wavelet has ${whole(cmp.average.length)} samples; its peak is ${f6(avSp.peakHz)} Hz and its centroid ${f6(avSp.centroidHz)} Hz.

DIFFERENT SAMPLE INTERVALS are first brought to one (resampleWavelet, linear about the centre sample). The average resampled from 4 ms to 2 ms has ${whole(must(P.resample(Array.from(cmp.average), 4, 2), 'resample').length)} samples.`));

  const bad = ws.map((w) => (w.name === 'Ekene-3' ? { name: w.name, samples: must(P.rotate(w.samples, 90), 'rot') } : w));
  const cmp2 = must(P.compare(bad), 'compare2');
  const cmp3 = must(P.compare(ws.map((w) => (w.name === 'Ekene-3' ? { name: w.name, samples: must(P.rotate(w.samples, 180), 'rot') } : w))), 'compare3');
  out.push(section(30, 'When one well disagrees', 'Professional m02 l05', `
QI STUDIO'S RULES for the issue register (${SUITE.ties}, petrolord-suite ${sc}): a tie whose mean windowed correlation is below 0.5 is poor and one below 0.7 fair; wavelet phases across wells that span more than 30 degrees are flagged; a well whose wavelet correlates with the average below 0.8 is unlike the others, and the remedy is to leave it out of the field wavelet or re-extract it.

A DESIGNED TEACHING CASE: Ekene-3's wavelet rotated by a stated phase before the comparison, the others as they are:

${table(['well', 'rotated by 90 degrees: correlation with the average', 'rotated by 180 degrees (reversed polarity): correlation with the average'], cmp2.misfit.map((m, k) => [m.name, f6(m.corrToAverage), f6(cmp3.misfit[k].corrToAverage)]))}

At 90 degrees Ekene-3 stays above the 0.8 rule; reversed, it falls below it. In both, the average it pulled lowers the other three wells' figures from section 29 as well.`));

  /* ------------------------------------------------------------ 31 */
  const g5 = must(P.packGather(5), 'gather');
  const bins = must(P.offsetBins(g5.offsets, E.binWidthM), 'bins');
  const fs = P.foldOf(bins.fold, bins.centres, 1);
  const top5 = must(P.pickEvent(g5, g5.traces[0], 1289), 'pick');
  const v5 = must(P.velocityAt(tab, top5.tMs), 'velocity');
  out.push(section(31, 'Offset gathers and bin width', 'Professional m03 l01', `
THE PACK'S GATHERS: ${whole(pk.gathers.cdps.length)} NMO-corrected CDP gathers next to Ekene-1 (inlines ${whole(pk.gathers.cdps[0].inline)} to ${whole(pk.gathers.cdps[pk.gathers.cdps.length - 1].inline)}), ${whole(g5.offsets.length)} offsets from ${whole(g5.offsets[0])} to ${whole(g5.offsets[g5.offsets.length - 1])} m, ${f6(g5.dtMs)} ms, ${whole(g5.t0Ms)} to ${whole(pk.gathers.t1_ms)} ms, carrying the kit's stated mute beyond ${whole(pk.gathers.muteAngle_deg)} degrees (by the kit's own angle calculation, which the course does not measure). Gather 5 is at inline ${whole(g5.inline)}, crossline ${whole(g5.crossline)}, the trace of Ekene-1.

OFFSET BINS (binOffsets): bin k holds offsets from k w to (k + 1) w, centred at (k + 0.5) w. At the stated width of ${whole(E.binWidthM)} m the gather fills ${whole(bins.fold.length)} bins with fold ${bins.fold.map(whole).join(', ')}; foldSummary: ${whole(fs.total)} traces, ${whole(fs.liveBins)} live bins, far offset ${f6(fs.farOffset)} m (a bin is reported at its centre).

THE TOP OF THE EKENE SAND ON GATHER 5, picked on the nearest offset about 1289 ms: ${f6(top5.tMs)} ms.`));

  /* ------------------------------------------------------------ 32 */
  const stRows = g5.offsets.filter((_, k) => k % 2 === 0).map((x) => [whole(x), f6(P.stretch(x, top5.tMs, v5.vrms))]);
  out.push(section(32, 'NMO stretch and the stretch mute', 'Professional m03 l02', `
STRETCH (nmoStretch, Yilmaz 2001, section 3.2): an event at offset x and zero-offset time t0 is stretched by t / t0 - 1, t = sqrt(t0^2 + x^2 / v^2), with v the NMO velocity. THE STRETCH MUTE (stretchMuteOffset): the offset at which the stretch reaches a stated limit, v t0 sqrt((1 + limit)^2 - 1).

AT THE TOP ON GATHER 5, t0 ${f6(top5.tMs)} ms, NMO velocity the table's RMS velocity there, ${f6(v5.vrms)} m/s:

${table(['offset m', 'stretch'], stRows)}

Stretch mute offsets at that time: ${f6(P.muteOffset(top5.tMs, v5.vrms, 0.2))} m for a limit of ${f6(0.2)}, ${f6(P.muteOffset(top5.tMs, v5.vrms, E.maxStretch))} m for ${f6(E.maxStretch)}.`));

  /* ------------------------------------------------------------ 33 */
  const r5 = must(P.rmo(g5, top5.tMs), 'rmo');
  const rmoRows = pk.gathers.cdps.map((_, k) => {
    const g = P.packGather(k); const t = must(P.pickEvent(g, g.traces[0], 1289), 'pick'); const r = must(P.rmo(g, t.tMs), 'rmo');
    return [whole(k), whole(g.inline), whole(g.crossline), f6(t.tMs), r.method, whole(r.fitted), f6(r.rmoFarMs)];
  });
  out.push(section(33, 'Residual moveout', 'Professional m03 l03', `
THE MEASURE (residualMoveout): on a gather that should be flat, each offset's shift of the event against a pilot (the stated nearest traces stacked, ${whole(E.rmoNearCount)} here), by the lag of largest absolute correlation in a window (half window ${whole(E.rmoWindowMs)} ms, largest shift ${whole(E.rmoMaxLagMs)} ms); offsets whose correlation is at least 0.7 in size enter a fit dt = a x^2 weighted by the squared correlation, and the residual at the far offset, a x_far^2, is the number a QC map shows. When the fitted lags scatter about the parabola by more than one sample the waveform has changed with offset, and the engine measures instead by AB semblance (method 'ab-semblance').

GATHER 5 about the top: method ${r5.method}, ${whole(r5.used)} offsets used, ${whole(r5.fitted)} fitted, far offset ${f6(r5.farOffset)} m, residual at the far offset ${f6(r5.rmoFarMs)} ms. The last three offsets' lags are ${r5.lagsMs.slice(-3).map(f6).join(', ')} ms, at the search limit, with correlations ${r5.corr.slice(-3).map(f6).join(', ')}; with all ${whole(r5.fitted)} offsets in the fit the lags scatter about the parabola by more than a sample, which is the condition on which the engine measures by AB semblance.

EVERY PACK GATHER:

${table(['gather', 'inline', 'crossline', 'top picked ms', 'method', 'offsets fitted', 'far-offset residual ms'], rmoRows)}`));

  /* ------------------------------------------------------------ 34 */
  const ag5 = must(P.angles(g5, tab, { edges: E.angleEdges }), 'angles');
  const i5 = Math.round((top5.tMs - g5.t0Ms) / g5.dtMs);
  const usRows = [1, 2, 3, 4, 5].map((m) => [whole(m), (() => { const u = P.usable(ag5, E.angleEdges, m)[i5]; return Number.isFinite(u) ? f6(u) : 'none'; })()]);
  out.push(section(34, 'Fold and what it limits', 'Professional m03 l04 and Professional m04 l04', `
FOLD BY ANGLE. Mapped to angle bins (section 37), each bin's fold at a sample is the number of offsets whose angle falls in it. On gather 5 at the top (${f6(top5.tMs)} ms), bins ${E.angleEdges.slice(0, -1).map((e, k) => `${whole(e)} to ${whole(E.angleEdges[k + 1])}`).join(', ')} degrees: fold ${ag5.fold.map((f) => whole(f[i5])).join(', ')}.

THE USABLE ANGLE (usableAngle): counting from the nearest bin, the far edge of the last bin with at least the stated minimum fold; none where even the first bin has too few. At the top of gather 5:

${table(['minimum fold', 'usable angle, degrees'], usRows)}`));

  /* ------------------------------------------------------------ 35 */
  const vint = must(P.dix(tab), 'dix');
  out.push(section(35, 'RMS to interval velocity', 'Professional m04 l01', `
DIX (dixInterval): between two rows of an RMS velocity table, Vint^2 = (Vrms2^2 t2 - Vrms1^2 t1) / (t2 - t1), with t the two-way time; the first row's interval velocity is its RMS velocity. A pair of rows that gives a negative numerator is refused, naming the time.

THE PACK'S RMS VELOCITY TABLE (the kit's published table for the gathers) and its Dix interval velocities:

${table(['two-way time ms', 'RMS velocity m/s', 'interval velocity m/s'], tab.tMs.map((t, i) => [f6(t), f6(tab.vrms[i]), f6(vint[i])]))}

ON A TRACE (velocityOnGrid): the RMS velocity is linear in time between rows and held flat outside the table; the interval velocity is the Dix velocity of the row segment the sample falls in. At ${f6(top5.tMs)} ms: RMS ${f6(v5.vrms)} m/s, interval ${f6(v5.vint)} m/s.

A designed table whose RMS velocity falls too fast is refused: "${P.dix({ tMs: [1000, 1100], vrms: [2500, 2000] }).error}"`));

  /* ------------------------------------------------------------ 36 */
  const earth = [{ thicknessM: 600, v: 1800 }, { thicknessM: 600, v: 2200 }, { thicknessM: 500, v: 2600 }, { thicknessM: 400, v: 3000 }];
  const lr = P.layered(earth);
  const tgt = 2;
  const angRows = [500, 1000, 1500, 2000, 2500, 3000].map((x) => {
    const w = P.walden(x, lr[tgt].t0 * 1000, lr[tgt].vrms, earth[tgt].v);
    const rt = must(P.rayTrace(earth, tgt, x), 'ray');
    return [whole(x), f6(w), f6(rt), f6(w - rt)];
  });
  const ekRows = [500, 1000, 1500, 2000, 2500].map((x) => [whole(x), f6(P.walden(x, top5.tMs, v5.vrms, v5.vint))]);
  out.push(section(36, 'Walden\'s straight-ray angle', 'Professional m04 l02', `
THE ANGLE (waldenAngle, Walden 1991, Geophysical Prospecting 39): sin(theta) = (Vint / Vrms) x / sqrt(x^2 + (Vrms t0)^2), with Vrms and Vint at the zero-offset time t0 and x the offset; past a sine of one it returns 90 degrees.

A DESIGNED FLAT-LAYER TEACHING EARTH, four layers (${earth.map((l) => `${whole(l.thicknessM)} m at ${whole(l.v)} m/s`).join('; ')}), its RMS velocity and time at each layer base by layeredRms. At the base of the third layer (t0 ${f6(lr[tgt].t0 * 1000)} ms, Vrms ${f6(lr[tgt].vrms)} m/s, Vint ${whole(earth[tgt].v)} m/s), Walden's angle against an exact ray trace through the layers (rayTraceAngle, Snell's law with the ray parameter solved for the offset):

${table(['offset m', 'Walden degrees', 'ray trace degrees', 'Walden less ray trace'], angRows)}

ON THE EKENE TABLE at the top of gather 5 (${f6(top5.tMs)} ms):

${table(['offset m', 'Walden degrees'], ekRows)}`));

  /* ------------------------------------------------------------ 37 */
  out.push(section(37, 'Angle gathers and ranges', 'Professional m04 l03', `
THE ANGLE GATHER (angleGather): every live sample of every offset goes to the bin of its Walden angle at that sample's time (the table on the trace clock, section 35); a bin is the mean of what falls in it, and empty where nothing does. A sample that is not finite or is a seismic null is skipped; the mute's exact zeros are live samples, so the mute angle and the bin edges must be read together.

GATHER 5 AT THE TOP (${f6(top5.tMs)} ms), bins ${E.angleEdges.map(whole).join(', ')} degrees:

${table(['bin, degrees', 'fold', 'mean amplitude'], ag5.gather.map((b, k) => [`${whole(E.angleEdges[k])} to ${whole(E.angleEdges[k + 1])}`, whole(ag5.fold[k][i5]), f6(b[i5])]))}`));

  /* ------------------------------------------------------------ 38 */
  const stacks = [[0, 1, 'near'], [1, 2, 'mid'], [2, 3, 'far']];
  const pkRows = stacks.map(([a, b, n]) => {
    const st = P.stackOf(ag5, a, b)[i5];
    const pkTrace = must(P.wellTrace('Ekene-1', n), n);
    const ii = Math.round((top5.tMs - pkTrace.t0Ms) / pkTrace.dtMs);
    return [n, f6(st), f6(pkTrace.values[ii])];
  });
  out.push(section(38, 'Partial stacks and the usable angle', 'Professional m04 l04', `
THE PARTIAL STACK (partialStack): over a range of angle bins, the fold-weighted mean of the bins at each sample, empty where no bin has data.

GATHER 5 AT ${f6(top5.tMs)} ms against the kit's angle stack traces at Ekene-1 at the same time (the kit built its near, mid and far stacks over 5 to 15, 15 to 25 and 25 to 35 degrees from the same rock):

${table(['stack', 'from gather 5', 'the kit\'s stack trace at Ekene-1'], pkRows)}

The kit's seismic README states that stacking its gathers over 5 to 15 degrees with the published velocity gives the near stack back, up to the noise. The table shows how each range compares at this one sample.

THE USABLE ANGLE at that sample, at the stated minimum fold of ${whole(E.minFold)}, is ${f6(P.usable(ag5, E.angleEdges, E.minFold)[i5])} degrees (section 34).`));

  /* ------------------------------------------------------------ 39 */
  const amps5 = ag5.gather.map((b) => b[i5]);
  const f2 = P.shueyFit(E.stackAngles, amps5, { terms: 2 });
  const f3 = P.shueyFit(E.stackAngles, amps5, { terms: 3 });
  const fine = must(P.angles(g5, tab, { edges: E.angleEdgesFine }), 'fine');
  const fineAngles = E.angleEdgesFine.slice(0, -1).map((e, k) => (e + E.angleEdgesFine[k + 1]) / 2);
  const fineAmps = fine.gather.map((b) => b[i5]);
  const f2f = P.shueyFit(fineAngles, fineAmps, { terms: 2 });
  out.push(section(39, 'The Shuey fit from near, mid and far, and intercept and gradient', 'Professional m05 l01 and Professional m05 l02', `
THE FIT (fitShuey): R(theta) = A + B sin^2(theta), or with C (tan^2 - sin^2) as a third term, fitted per sample by least squares over the angles that carry a finite amplitude. A three-term fit on three angles is exactly determined.

GATHER 5 AT THE TOP, the three bins of section 37 at their mean angles ${E.stackAngles.map(whole).join(', ')} degrees:

${table(['fit', 'A', 'B', 'C', 'angles used'], [
    ['two terms', f6(f2.A), f6(f2.B), f6(f2.C), whole(f2.n)],
    ['three terms', f6(f3.A), f6(f3.B), f6(f3.C), whole(f3.n)],
    [`two terms, ${whole(fineAngles.length)} bins of 5 degrees at their centres`, f6(f2f.A), f6(f2f.B), f6(f2f.C), whole(f2f.n)],
  ])}

A and B here are in trace amplitude units; section 41 ties them to the modelled reflection coefficients. INTERCEPT AND GRADIENT VOLUMES are the same fit run at every sample of every trace of the angle stacks; QI Studio runs it on the seismic worker over the survey.`));

  /* ------------------------------------------------------------ 40 */
  const rows41 = WELLS.map((w) => {
    const o = must(P.observedAtWell(w), w); const m = must(P.modelledAtWell(w), w);
    return { name: w, modelled: { A: m.A, B: m.B }, observed: { A: o.A, B: o.B }, layer: m.layer, pickMs: o.pickMs, csMs: o.checkshotTwtMs };
  });
  const cmpW = compareAtWells(rows41);
  const As = []; const Bs = [];
  for (let i = 0; i < g5.traces[0].length; i++) {
    const f = P.shueyFit(E.stackAngles, ag5.gather.map((b) => b[i]), { terms: 2 });
    if (Number.isFinite(f.A) && f.n === 3) { As.push(f.A); Bs.push(f.B); }
  }
  const bt = P.trend(As, Bs);
  const offTop = P.off(f2.A, f2.B, bt.m);
  const vsVp = 0.5;
  const ctr = P.contrasts(f2.A / cmpW.scale, f2.B / cmpW.scale, vsVp);
  const chiDeg = (Math.atan(bt.m) * 180) / Math.PI;
  out.push(section(40, 'The background trend, the off-trend distance, the fluid factor, chi, and conditioning before AVO', 'Professional m05 l03 and Professional m05 l04 and Professional m05 l05', `
THE BACKGROUND TREND (backgroundTrend, Castagna and Swan 1997): the line B = m A through the origin, by orthogonal regression over (A, B) pairs. THE OFF-TREND DISTANCE (offTrend): (B - m A) / sqrt(1 + m^2), negative towards softer, gas-like responses below the line.

GATHER 5: the two-term fit at every sample of the gather window where all three bins carry data gives ${whole(As.length)} (A, B) pairs; their trend slope m is ${f6(bt.m)}. The top's point (section 39) sits ${f6(offTop)} from that line, in trace amplitude units.

THE FLUID FACTOR (contrastsFromAB, Smith and Gidlow 1987): from A and B, a stated Vs/Vp and Gardner's density (drho/rho = dVp/Vp / 4), the relative contrasts and dVp/Vp - 1.16 (Vs/Vp) dVs/Vs, near zero along the mudrock line. It needs A and B as reflection coefficients; the top's two-term A and B divided by the one scale of section 41 (${f6(cmpW.scale)}) at a stated Vs/Vp of ${f6(vsVp)}: dVp/Vp ${f6(ctr.dVpVp)}, dVs/Vs ${f6(ctr.dVsVs)}, drho/rho ${f6(ctr.dRhoRho)}, fluid factor ${f6(ctr.fluidFactor)}.

THE CHI PROJECTION (chiProjection, Whitcombe and others 2002): A cos(chi) + B sin(chi). At the stated chi of ${whole(E.chiDeg)} degrees the top projects to ${f6(P.chi(f2.A, f2.B, E.chiDeg))}; at chi = atan(m) = ${f6(chiDeg)} degrees, the angle along the background trend, it projects to ${f6(P.chi(f2.A, f2.B, chiDeg))}.

CONDITIONING BEFORE AVO. QI Studio conditions angle stacks before the fit: trim statics between the stacks, matching the stacks to each other in shift, phase and scale, and spectral balancing (${SUITE.conditioning} in the engines; the course vendors none of it and grades none of it). Each step changes the amplitudes the fit reads, so a study records which it ran.`));

  /* ------------------------------------------------------------ 41 */
  out.push(section(41, 'AVO at the wells, and the Professional capstone', 'Professional m06', `
THE COMPARISON (QI Studio's \`compareAtWells\`, ${SUITE.avoWells}, petrolord-suite ${sc}, app code): at every well, the intercept and gradient modelled from the logs against those the seismic shows. One least-squares scale ties the seismic amplitudes to reflectivity over every well, A and B together: scale = sum(observed x modelled) / sum(modelled^2). Each well's seismic A and B are divided by the scale; its residual is the distance between the scaled point and the modelled one, and the AVO classes (engines qi/avo avoClass, band 0.02) of the two are compared.

THE INPUTS. MODELLED: the cap rock over the oil leg at each well (Associate section 19), or over its net sand where the well has no oil leg. SEISMIC: the top picked on the near stack trace within ${whole(E.pickHalfWindowMs)} ms of its checkshot time, the near, mid and far stack traces read at that sample and fitted with two Shuey terms at ${E.stackAngles.map(whole).join(', ')} degrees.

${table(['well', 'modelled from', 'checkshot top ms', 'picked ms', 'modelled A', 'modelled B', 'seismic A', 'seismic B'], rows41.map((r) => [r.name, r.layer, f6(r.csMs), f6(r.pickMs), f6(r.modelled.A), f6(r.modelled.B), f6(r.observed.A), f6(r.observed.B)]))}

ONE SCALE over the ${whole(cmpW.n)} wells: ${f6(cmpW.scale)} trace units per unit reflection coefficient.

${table(['well', 'scaled seismic A', 'scaled seismic B', 'residual', 'modelled class', 'seismic class', 'agree'], cmpW.wells.map((w) => [w.name, f6(w.scaled.A), f6(w.scaled.B), f6(w.residual), w.modelledClass, w.observedClass, w.agree ? 'yes' : 'no']))}

${whole(cmpW.agree)} of ${whole(cmpW.n)} wells agree in class. QI Studio raises an issue for a class that differs and a high one for a negative scale (a polarity or wavelet problem).

THE PROFESSIONAL CAPSTONE runs these steps on a held-out synthetic case: one NMO-corrected CDP gather with its RMS velocity table, and modelled and seismic intercepts and gradients at four wells, supplied as a case file the learner pastes into the prestack explorer. It asks for six figures: the Dix interval velocity of a stated layer, Walden's angle at a stated offset and time, the NMO stretch there, the far partial stack amplitude at the target sample, the two-term Shuey intercept at the target sample, and the one scale over the four wells. Every input they depend on is stated in the case file.`));

  return out;
}
