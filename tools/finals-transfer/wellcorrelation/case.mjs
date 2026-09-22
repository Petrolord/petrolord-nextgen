// W6 transfer case for the wellcorrelation finals: the IKPOKI section.
//
// Five wells, four markers the course never uses (TOP_M, TOP_RES, BASE_RES,
// TOP_L), two gaps of different kinds: Ikpoki-3 reached total depth above
// TOP_L, and TOP_M is faulted out of Ikpoki-5. Every figure a W6 item prints
// is computed here through the vendored section engine (computeFlattening,
// displayedDepth, correlationPolyline, zoneSpan, displayedRange, topMd,
// allTopNames). Wrong-method distractors are the same engine calls with the
// wrong input, or engine outputs combined the wrong way (each commented).
import {
  computeFlattening, correlationPolyline, zoneSpan, displayedRange,
  allTopNames, topMd, displayedDepth,
} from '@petrolord/engines/engines/wellcorrelation/section.js';

const W = [
  { id: 'I1', name: 'Ikpoki-1', tops: [
    { name: 'TOP_M', md_m: 2104 }, { name: 'TOP_RES', md_m: 2161 },
    { name: 'BASE_RES', md_m: 2188 }, { name: 'TOP_L', md_m: 2257 }] },
  { id: 'I2', name: 'Ikpoki-2', tops: [
    { name: 'TOP_M', md_m: 2090 }, { name: 'TOP_RES', md_m: 2143 },
    { name: 'BASE_RES', md_m: 2175 }, { name: 'TOP_L', md_m: 2245 }] },
  { id: 'I3', name: 'Ikpoki-3', tops: [
    { name: 'TOP_M', md_m: 2121 }, { name: 'TOP_RES', md_m: 2187 },
    { name: 'BASE_RES', md_m: 2212 }] },
  { id: 'I4', name: 'Ikpoki-4', tops: [
    { name: 'TOP_M', md_m: 2112 }, { name: 'TOP_RES', md_m: 2170 },
    { name: 'BASE_RES', md_m: 2201 }, { name: 'TOP_L', md_m: 2263 }] },
  { id: 'I5', name: 'Ikpoki-5', tops: [
    { name: 'TOP_RES', md_m: 2133 },
    { name: 'BASE_RES', md_m: 2161 }, { name: 'TOP_L', md_m: 2227 }] },
];
const NAMES = allTopNames(W);
const DATUM_B = { mode: 'flatten', topName: 'TOP_RES', datumM: 2100 };  // beginner view
const DATUM_I = { mode: 'flatten', topName: 'TOP_M', datumM: 2050 };    // intermediate view
const DATUM_MIX = { mode: 'flatten', topName: 'TOP_RES', datumM: 2160 }; // a datum inside the picks

const values = {};
const print = {};
// integers print bare; anything else to at most 2 decimals (every value here is a whole or quarter metre)
const fmt = (v) => {
  if (!Number.isFinite(v)) throw new Error(`non-finite value ${v}`);
  return String(Math.round(v * 100) / 100);
};
const put = (k, v) => { values[k] = v; print[k] = fmt(v); };
const byId = (fl) => new Map(fl.map((f) => [f.id, f.shift]));
const well = (id) => W.find((w) => w.id === id);
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const carriers = (name) => W.filter((w) => topMd(w, name) !== null);
const relief = (name) => { const m = carriers(name).map((w) => topMd(w, name)); return Math.max(...m) - Math.min(...m); };

// ---- structure (all tiers)
put('n_wells', W.length);
put('n_names', NAMES.length);
for (const t of NAMES) {
  put(`relief_${t}`, relief(t));
  put(`carriers_${t}`, carriers(t).length);
  put(`line_${t}`, correlationPolyline(W, computeFlattening(W, { mode: 'structural' }), t).length);
}
// relief of TOP_RES over the four wells that also carry TOP_M
{
  const m = W.filter((w) => topMd(w, 'TOP_M') !== null).map((w) => topMd(w, 'TOP_RES'));
  put('relief_TOP_RES_4', Math.max(...m) - Math.min(...m));
}
// wrong: TOP_L relief with the missing Ikpoki-3 read as depth zero (missing is not zero)
put('wrong_reliefL_zero', Math.max(...W.map((w) => topMd(w, 'TOP_L') ?? 0)) - Math.min(...W.map((w) => topMd(w, 'TOP_L') ?? 0)));

// ---- gross reservoir thickness per well (zoneSpan, structural)
const thick = W.map((w) => { const s = zoneSpan(w, 0, 'TOP_RES', 'BASE_RES'); return s.base - s.top; });
W.forEach((w, i) => put(`res_thick_${w.id}`, thick[i]));
put('res_thick_spread', Math.max(...thick) - Math.min(...thick));
put('res_thick_mean', mean(thick));
// the same span read on the beginner flattened view (must equal the structural one)
{
  const fl = byId(computeFlattening(W, DATUM_B));
  const s = zoneSpan(well('I3'), fl.get('I3'), 'TOP_RES', 'BASE_RES');
  put('I3_res_top_disp_B', s.top); put('I3_res_base_disp_B', s.base);
}
// wrong: a cross-well "thickness", BASE_RES in Ikpoki-3 minus TOP_RES in Ikpoki-2
put('wrong_crosswell_thick', topMd(well('I3'), 'BASE_RES') - topMd(well('I2'), 'TOP_RES'));

// ---- beginner view: flatten on TOP_RES at 2100 m
{
  const flat = computeFlattening(W, DATUM_B);
  const s = byId(flat);
  for (const w of W) put(`shiftB_${w.id}`, s.get(w.id));
  // wrong sign: pick minus datum
  for (const w of W) put(`wrong_shiftB_${w.id}`, topMd(w, 'TOP_RES') - DATUM_B.datumM);
  put('I3_base_disp_B', displayedDepth(topMd(well('I3'), 'BASE_RES'), s.get('I3')));
  put('I3_M_disp_B', displayedDepth(topMd(well('I3'), 'TOP_M'), s.get('I3')));
  // wrong: the shift applied with the wrong sign
  put('wrong_I3_base_disp_B', displayedDepth(topMd(well('I3'), 'BASE_RES'), -s.get('I3')));
  // wrong: Ikpoki-1's shift used on Ikpoki-3's pick
  put('wrong_I3_base_disp_B_w1', displayedDepth(topMd(well('I3'), 'BASE_RES'), s.get('I1')));
  const pl = correlationPolyline(W, flat, 'TOP_L');
  pl.forEach((p) => put(`L_disp_B_${p.wellId}`, p.displayed));
  const d = pl.map((p) => p.displayed);
  put('L_disp_B_spread', Math.max(...d) - Math.min(...d));
  const r = displayedRange(W, flat);
  put('rangeB_min', r[0]); put('rangeB_max', r[1]); put('spanB', r[1] - r[0]);
  // datum pick error: Ikpoki-2 TOP_RES really 9 m deeper than picked
  const W2 = W.map((w) => (w.id === 'I2' ? { ...w, tops: w.tops.map((t) => (t.name === 'TOP_RES' ? { ...t, md_m: t.md_m + 9 } : t)) } : w));
  const s2 = byId(computeFlattening(W2, DATUM_B));
  put('mispick_I2_res', topMd(well('I2'), 'TOP_RES') + 9);
  put('mispick_shift_I2', s2.get('I2'));
  put('mispick_L_disp_I2', displayedDepth(topMd(well('I2'), 'TOP_L'), s2.get('I2')));
  put('mispick_move', displayedDepth(topMd(well('I2'), 'TOP_L'), s2.get('I2')) - displayedDepth(topMd(well('I2'), 'TOP_L'), s.get('I2')));
  put('true_res_L_I2', topMd(well('I2'), 'TOP_L') - topMd(well('I2'), 'BASE_RES'));
  // flatten on TOP_M instead: Ikpoki-5 has no pick, so the engine flags it
  const fM = computeFlattening(W, { mode: 'flatten', topName: 'TOP_M', datumM: 2100 });
  put('flagged_on_M', fM.filter((f) => !f.hasDatumTop).length);
  // where Ikpoki-5's TOP_RES displays: the engine draws the unflagged-shift well at measured depth
  put('I5_res_disp_onM', displayedDepth(topMd(well('I5'), 'TOP_RES'), byId(fM).get('I5')));
  // wrong: hang Ikpoki-5 with the mean shift of the four wells that carry TOP_M
  { const sh = fM.filter((f) => f.hasDatumTop).map((f) => f.shift); put('wrong_I5_res_meanshift', topMd(well('I5'), 'TOP_RES') + mean(sh)); }
}

// ---- intermediate view: flatten on TOP_M at 2050 m
{
  const flat = computeFlattening(W, DATUM_I);
  const s = byId(flat);
  for (const w of W.filter((x) => s.get(x.id) !== null)) put(`shiftI_${w.id}`, s.get(w.id));
  put('flaggedI', flat.filter((f) => !f.hasDatumTop).length);
  // displayed TOP_RES
  const pr = correlationPolyline(W, flat, 'TOP_RES');
  pr.forEach((p) => put(`RES_disp_I_${p.wellId}`, p.displayed));
  // M to RES interval (growth) over the wells carrying both
  const both = W.filter((w) => topMd(w, 'TOP_M') !== null);
  const g = both.map((w) => topMd(w, 'TOP_RES') - topMd(w, 'TOP_M'));
  both.forEach((w, i) => put(`MtoRES_${w.id}`, g[i]));
  put('growth_MtoRES', Math.max(...g) - Math.min(...g));
  put('mean_MtoRES_all4', mean(g));
  const dres = both.map((w) => displayedDepth(topMd(w, 'TOP_RES'), s.get(w.id)));
  put('RES_disp_I_spread4', Math.max(...dres) - Math.min(...dres));
  // growth of M to BASE_RES too
  const gb = both.map((w) => topMd(w, 'BASE_RES') - topMd(w, 'TOP_M'));
  put('growth_MtoBASE', Math.max(...gb) - Math.min(...gb));
  // displayed span as the engine reports it, Ikpoki-5 drawn at true depth
  const r = displayedRange(W, flat);
  put('rangeI_min', r[0]); put('rangeI_max', r[1]); put('spanI', r[1] - r[0]);
  // the span over the four hung wells only
  const hung = W.filter((w) => s.get(w.id) !== null);
  const r4 = displayedRange(hung, flat);
  put('rangeI4_max', r4[1]); put('spanI4', r4[1] - r4[0]);
  put('spanI_excess', (r[1] - r[0]) - (r4[1] - r4[0]));
  // wrong: displayed TOP_RES of Ikpoki-2 with the shift subtracted instead of added
  put('wrong_RES_disp_I_I2', displayedDepth(topMd(well('I2'), 'TOP_RES'), -s.get('I2')));
  // wrong: growth read as the spread of the whole displayed TOP_RES line, flagged Ikpoki-5 included
  { const all = correlationPolyline(W, flat, 'TOP_RES').map((p) => p.displayed); put('wrong_growth_with_I5', Math.max(...all) - Math.min(...all)); }
  // deepest distance below own TOP_M per hung well
  for (const w of hung) { const mds = w.tops.map((t) => t.md_m); put(`below_M_${w.id}`, Math.max(...mds) - topMd(w, 'TOP_M')); }
  // the same view with the datum moved 30 m deeper: shifts move, intervals and spans do not
  const flat2 = computeFlattening(W, { ...DATUM_I, datumM: DATUM_I.datumM + 30 });
  const s2 = byId(flat2);
  put('datum_I_deeper', DATUM_I.datumM + 30);
  put('datum_move', 30);
  put('shiftI2_I3', s2.get('I3'));
  const r2 = displayedRange(hung, flat2);
  put('spanI4_deeper', r2[1] - r2[0]);
  // counts
  put('wells_all_four', W.filter((w) => NAMES.every((n) => topMd(w, n) !== null)).length);
  put('picks_present', W.reduce((a, w) => a + w.tops.length, 0));
  put('pick_slots', W.length * NAMES.length);
  put('wells_missing_one', W.filter((w) => !NAMES.every((n) => topMd(w, n) !== null)).length);
}
// a datum inside the TOP_RES picks: mixed signs
{
  const s = byId(computeFlattening(W, DATUM_MIX));
  for (const w of W) put(`shiftMix_${w.id}`, s.get(w.id));
  put('mix_positive', W.filter((w) => s.get(w.id) > 0).length);
  put('mix_negative', W.filter((w) => s.get(w.id) < 0).length);
}

// ---- advanced: predict Ikpoki-3 TOP_L
{
  const A = W.filter((w) => topMd(w, 'TOP_M') !== null && topMd(w, 'TOP_L') !== null);   // I1, I2, I4
  const S4 = W.filter((w) => topMd(w, 'TOP_RES') !== null && topMd(w, 'TOP_L') !== null); // I1, I2, I4, I5
  put('n_carriers_ML', A.length);
  put('n_carriers_RL', S4.length);
  const aL = A.map((w) => topMd(w, 'TOP_L') - topMd(w, 'TOP_M'));
  A.forEach((w, i) => put(`MtoL_${w.id}`, aL[i]));
  put('MtoL_sum', aL.reduce((a, b) => a + b, 0));
  put('MtoL_mean', mean(aL));
  put('MtoL_spread', Math.max(...aL) - Math.min(...aL));
  put('MtoL_median', [...aL].sort((a, b) => a - b)[1]);
  const rL3 = A.map((w) => topMd(w, 'TOP_L') - topMd(w, 'TOP_RES'));
  A.forEach((w, i) => put(`RtoL_${w.id}`, rL3[i]));
  put('RtoL_I5', topMd(well('I5'), 'TOP_L') - topMd(well('I5'), 'TOP_RES'));
  put('RtoL_mean3', mean(rL3));
  put('RtoL_spread3', Math.max(...rL3) - Math.min(...rL3));
  const rL4 = S4.map((w) => topMd(w, 'TOP_L') - topMd(w, 'TOP_RES'));
  put('RtoL_mean4', mean(rL4));
  const t = well('I3');
  put('pred_layercake', topMd(t, 'TOP_M') + mean(aL));
  put('pred_fromRES3', topMd(t, 'TOP_RES') + mean(rL3));
  put('pred_fromRES4', topMd(t, 'TOP_RES') + mean(rL4));
  put('spread3', Math.abs(values.pred_fromRES3 - values.pred_layercake));
  put('spread4', Math.abs(values.pred_fromRES4 - values.pred_layercake));
  put('pred_mid', (values.pred_fromRES3 + values.pred_layercake) / 2);
  // wrong: layer-cake built from Ikpoki-3's own TOP_RES instead of its TOP_M
  put('wrong_pred_anchor', topMd(t, 'TOP_RES') + mean(aL));
  // the identity: target's own M->RES minus the carriers' mean M->RES
  put('I3_MtoRES', topMd(t, 'TOP_RES') - topMd(t, 'TOP_M'));
  const mres = A.map((w) => topMd(w, 'TOP_RES') - topMd(w, 'TOP_M'));
  put('carriers_MtoRES_mean', mean(mres));
  put('identity', values.I3_MtoRES - mean(mres));
  put('means_diff', mean(aL) - mean(rL3));
  // relief of TOP_L now, and what it becomes if Ikpoki-3 is deepened into the range
  const lm = carriers('TOP_L').map((w) => topMd(w, 'TOP_L'));
  put('L_shallowest', Math.min(...lm)); put('L_deepest', Math.max(...lm));
  put('reliefL_after_lo', values.pred_layercake - Math.min(...lm));
  put('reliefL_after_hi', values.pred_fromRES3 - Math.min(...lm));
  // what if Ikpoki-3 TOP_RES were picked 8 m shallower: the spread follows the identity
  put('alt_move', 8);
  put('alt_I3_res', topMd(t, 'TOP_RES') - 8);
  put('alt_upper', topMd(t, 'TOP_RES') - 8 - topMd(t, 'TOP_M'));
  put('alt_spread', Math.abs((topMd(t, 'TOP_RES') - 8 + mean(rL3)) - values.pred_layercake));
  // a seismic tie at a stated depth
  put('seis_tie', 2296);
  put('seis_outside_by', 2296 - values.pred_fromRES3);
  // one well changes its TOP_L pick by 6 m: each mean moves by a third
  put('pick_revision', 6);
  put('mean_move_one_third', 6 / A.length);
}

console.log(JSON.stringify({
  inputs: {
    wells: W.map((w) => ({ name: w.name, tops: Object.fromEntries(w.tops.map((x) => [x.name, x.md_m])) })),
    datums: { beginner: DATUM_B, intermediate: DATUM_I, mixed: DATUM_MIX },
    mispick_m: 9,
  },
  values,
  print,
}));
