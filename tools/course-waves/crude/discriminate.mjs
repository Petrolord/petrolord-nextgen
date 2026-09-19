// THE DISCRIMINATE SWEEP, per gate-must-call-the-engine: for each of the
// eighteen graded fields, does a plausible WRONG ROUTE actually move it past its
// own tolerance? A field no error moves grades nothing, whatever the prompt
// claims it tests.
//
// Every wrong route is the ENGINE asked the wrong question (a specification on
// the wrong basis, a typed zero read as unlimited, the wrong curve, the row dual
// read as a price) or the one piece of arithmetic a learner most plausibly does
// instead, done with the engine's own helpers (blendOnVolume, blendOnMass,
// sgFromApi) where one exists. The MD1-0 defects are modelled by name:
// averaging API directly, blending sulfur on volume, T50 at a grid point, a row
// dual read as a price, a typed zero read as unlimited, losses taken off the
// wrong term. A route is BLIND when it lands inside the tolerance, and a field
// is WEAK when any route aimed at it is blind or fewer than three routes are
// aimed at it. The CLOSEST MISS is printed in multiples of the field's
// tolerance, so "it moved" arrives with its margin.
//
// Run at the final tolerances (fields.json).
//
//   node discriminate.mjs            exit 0 clean, 1 any WEAK field, 2 refused
//   node discriminate.mjs --plant    THE NEGATIVE CONTROL: adds one identity
//                                    route (the truth itself, renamed) to one
//                                    field, and the sweep must report exactly
//                                    one WEAK field
import fs from 'fs';
import * as K from './crude_fields_capstone.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-md-crude-nextgen/packages/engines';
const C = await import(`${ROOT}/engines/downstream/crudeAssay.js`);
const P = await import(`${ROOT}/engines/downstream/productBlending.js`);
const fields = Object.fromEntries(JSON.parse(fs.readFileSync(`${HERE}fields.json`, 'utf8')).map((f) => [f[1], f]));
if (Object.keys(fields).length !== 18) { console.log('REFUSED: fields.json does not carry eighteen fields'); process.exit(2); }

const withIndex = (specs) => specs.map((s) => (s.basis === 'index' && s.id === 'rvp'
  ? { ...s, toIndex: (v) => P.rvpIndex(v), fromIndex: (i) => P.rvpFromIndex(i) } : s));

/* ------------------------------ IDAMA ------------------------------ */
const idc = K.IDAMA_CRUDES;
const bbl = idc.map((c) => K.IDAMA_BARRELS[c.id]);
const idama = C.blendCrudes(idc.map((c, i) => ({ ...c, volumeFraction: bbl[i] })));
const vf = idama.fractions.map((f) => f.volumeFraction);
const mf = idama.fractions.map((f) => f.massFraction);
const eq = idc.map(() => 1 / idc.length);
const sgs = idc.map((c) => C.sgFromApi(c.api));
const apiWeights = (() => { const w = bbl.map((b, i) => b * idc[i].api); const t = w.reduce((s, x) => s + x, 0); return w.map((x) => x / t); })();
const sgOnMassApi = C.apiFromSg(C.blendOnMass(sgs, mf));
const abh = idc.findIndex((c) => c.id === 'abh');
const saraOn = (w) => Object.fromEntries(['saturates', 'aromatics', 'resins', 'asphaltenes'].map((k) => [k, C.blendOnMass(idc.map((c) => c.sara[k]), w)]));
const ownCii = idc.map((c) => C.colloidalInstabilityIndex(c.sara));
const inverted = (s) => (s.aromatics + s.resins) / (s.saturates + s.asphaltenes);
const opm = idc.find((c) => c.id === K.IDAMA_CUT.crude);
const cut = K.IDAMA_CUT.cut;
const gridAtOrPast = (curve, t) => curve.find((p) => p.temperatureF >= t).volumePercent;
const idCurve = C.blendDistillationCurves(idc, vf);

/* ------------------------------ OGBELE ----------------------------- */
const og = K.OGBELE_CRUDES;
const ogB = C.blendCrudes(og.map((c) => ({ ...c, volumeFraction: K.OGBELE_SHARES[c.id] })));
const ogV = ogB.fractions.map((f) => f.volumeFraction);
const ogM = ogB.fractions.map((f) => f.massFraction);
const ogCurve = C.blendDistillationCurves(og, ogV);
const eachT50 = og.map((c) => C.temperatureAtVolumePercent(c.curve, 50));
const yieldsOf = (curve, cuts = K.OGBELE_CUTS) => C.cutYields({ curve, cuts }).cuts;
const eachY = og.map((c) => yieldsOf(c.curve));
const mixY = (w) => eachY[0].map((r, i) => ({ ...r, yieldVolPercent: C.blendOnVolume(eachY.map((y) => y[i].yieldVolPercent), w) }));
const ogY = yieldsOf(ogCurve);
const yId = (rows, id) => rows.find((r) => r.id === id).yieldVolPercent;
const STUDIO_KERO = { id: 'kerosene', name: 'Kerosene / Jet', fromF: 350, toF: 500 };
const STUDIO_DIESEL = { id: 'diesel', name: 'Diesel / Gasoil', fromF: 500, toF: 650 };
const ov = K.OGBELE_VALUATION;
const net = (cuts, over = {}) => C.netbackValue({ cuts, ...ov, ...over });
const ogNet = net(ogY);
const costs = ov.processingCostPerBbl + ov.freightPerBbl;
const { residue: _r, ...noResidue } = ov.prices;

/* ------------------------------- ONNE ------------------------------ */
const solve = (pool = K.ONNE_POOL, specs = K.ONNE_SPECS) => P.optimiseBlend({ components: pool, specs: withIndex(specs), targetVolume: K.ONNE_TARGET });
const onne = solve();
const unlimited = solve(K.ONNE_POOL.map((c) => (c.maxVolume === 0 ? { ...c, maxVolume: '' } : c)));
const sulfurOnVolume = solve(K.ONNE_POOL, K.ONNE_SPECS.map((s) => (s.id === 'sulfurPpm' ? { ...s, basis: 'volume' } : s)));
const rvpLinear = solve(K.ONNE_POOL, K.ONNE_SPECS.map((s) => (s.id === 'rvp' ? { ...s, basis: 'volume' } : s)));
const rvpIndexOnMass = solve(K.ONNE_POOL, K.ONNE_SPECS.map((s) => (s.id === 'rvp' ? { ...s, indexOnMass: true } : s)));
// A route with no recipe is a miss a learner cannot even type: it is printed
// as NO RECIPE and never counted toward the three numeric routes a field needs.
const NO_RECIPE = (r) => (r.status === 'optimal' ? null : r.status);
const vol = (r, id) => r.recipe.find((x) => x.id === id).volume;
const sp = (r, name) => r.shadowPrices.find((s) => s.name === name);
const moved = (id, key, delta) => solve(K.ONNE_POOL, K.ONNE_SPECS.map((s) => (s.id === id ? { ...s, [key]: s[key] + delta } : s)));
const wholeUnit = (id, key, delta) => onne.totalCost - moved(id, key, delta).totalCost;
for (const r of [onne, unlimited, rvpLinear, rvpIndexOnMass]) {
  if (r.status !== 'optimal') { console.log(`REFUSED: a wrong route is ${r.status}, so it cannot be compared`); process.exit(2); }
}

const WRONG = {
  idama_blend_api: {
    truth: idama.properties.api,
    routes: {
      api_numbers_averaged_on_volume: C.blendOnVolume(idc.map((c) => c.api), vf),
      specific_gravity_averaged_on_mass: sgOnMassApi,
      api_numbers_averaged_equally: C.blendOnVolume(idc.map((c) => c.api), eq),
      api_numbers_weighted_by_barrels_times_api: C.blendOnVolume(idc.map((c) => c.api), apiWeights),
    },
  },
  idama_blend_sulfur_wtpct: {
    truth: idama.properties.sulfurWtPct,
    routes: {
      sulfur_blended_on_volume: C.blendOnVolume(idc.map((c) => c.sulfurWtPct), vf),
      sulfur_averaged_equally: C.blendOnVolume(idc.map((c) => c.sulfurWtPct), eq),
      mass_shares_taken_from_api_not_sg: C.blendOnVolume(idc.map((c) => c.sulfurWtPct), apiWeights),
    },
  },
  idama_blend_vanadium_ppm: {
    truth: idama.properties.vanadiumPpm,
    routes: {
      vanadium_blended_on_volume: C.blendOnVolume(idc.map((c) => c.vanadiumPpm), vf),
      vanadium_averaged_equally: C.blendOnVolume(idc.map((c) => c.vanadiumPpm), eq),
      mass_shares_taken_from_api_not_sg: C.blendOnVolume(idc.map((c) => c.vanadiumPpm), apiWeights),
      nickel_read_for_vanadium: idama.properties.nickelPpm,
    },
  },
  idama_abiteye_mass_share_pct: {
    truth: 100 * mf[abh],
    routes: {
      volume_share_given_as_mass_share: 100 * vf[abh],
      weighted_by_api_not_sg: 100 * apiWeights[abh],
      weighted_by_one_over_sg: (() => { const w = bbl.map((b, i) => b / sgs[i]); return (100 * w[abh]) / w.reduce((s, x) => s + x, 0); })(),
    },
  },
  idama_blend_cii: {
    truth: idama.stability.cii,
    routes: {
      sara_blended_on_volume: C.colloidalInstabilityIndex(saraOn(vf)),
      each_crudes_cii_averaged_on_mass: C.blendOnMass(ownCii, mf),
      each_crudes_cii_averaged_on_volume: C.blendOnVolume(ownCii, vf),
      ratio_inverted: inverted(idama.stability.blendedSara),
    },
  },
  idama_opuama_kerosene_yield_pct: {
    truth: C.cutYields({ curve: opm.curve, cuts: [cut] }).cuts[0].yieldVolPercent,
    routes: {
      bounds_read_at_the_next_measured_point: gridAtOrPast(opm.curve, cut.toF) - gridAtOrPast(opm.curve, cut.fromF),
      upper_bound_read_without_subtracting_the_lower: C.volumePercentAt(opm.curve, cut.toF),
      the_cargos_blended_kerosene_instead: C.cutYields({ curve: idCurve, cuts: [cut] }).cuts[0].yieldVolPercent,
      idama_lights_kerosene_instead: C.cutYields({ curve: idc[0].curve, cuts: [cut] }).cuts[0].yieldVolPercent,
    },
  },
  ogbele_blend_t50_f: {
    truth: C.temperatureAtVolumePercent(ogCurve, 50),
    routes: {
      t50_at_the_first_grid_point_past_50: ogCurve.find((p) => p.volumePercent >= 50).temperatureF,
      crudes_t50s_averaged_on_volume: C.blendOnVolume(eachT50, ogV),
      crudes_t50s_averaged_on_mass: C.blendOnMass(eachT50, ogM),
      lighter_crudes_t50_alone: eachT50[0],
    },
  },
  ogbele_blend_kerosene_yield_pct: {
    truth: yId(ogY, 'kerosene'),
    routes: {
      crudes_yields_averaged_on_mass: yId(mixY(ogM), 'kerosene'),
      studio_default_cut_points_350_to_500: C.cutYields({ curve: ogCurve, cuts: [STUDIO_KERO] }).cuts[0].yieldVolPercent,
      crudes_yields_averaged_equally: yId(mixY([0.5, 0.5]), 'kerosene'),
      lighter_crude_alone: yId(eachY[0], 'kerosene'),
    },
  },
  ogbele_blend_diesel_yield_pct: {
    truth: yId(ogY, 'diesel'),
    routes: {
      crudes_yields_averaged_on_mass: yId(mixY(ogM), 'diesel'),
      studio_default_cut_points_500_to_650: C.cutYields({ curve: ogCurve, cuts: [STUDIO_DIESEL] }).cuts[0].yieldVolPercent,
      crudes_yields_averaged_equally: yId(mixY([0.5, 0.5]), 'diesel'),
      lighter_crude_alone: yId(eachY[0], 'diesel'),
    },
  },
  ogbele_gross_value_per_bbl: {
    truth: ogNet.grossValue,
    routes: {
      yields_averaged_on_mass: net(mixY(ogM)).grossValue,
      value_after_losses_read_as_gross: ogNet.grossValue - ogNet.lossValue,
      residue_left_unpriced: C.netbackValue({ cuts: ogY, ...ov, prices: noResidue }).grossValue,
      crudes_mixed_half_and_half: net(mixY([0.5, 0.5])).grossValue,
    },
  },
  ogbele_loss_value_per_bbl: {
    truth: ogNet.lossValue,
    routes: {
      losses_taken_on_the_netback_after_costs: (ogNet.grossValue - costs) * (ov.lossPercent / 100),
      losses_taken_on_value_plus_costs: (ogNet.grossValue + costs) * (ov.lossPercent / 100),
      yields_averaged_on_mass: net(mixY(ogM)).lossValue,
      residue_left_unpriced: C.netbackValue({ cuts: ogY, ...ov, prices: noResidue }).lossValue,
    },
  },
  ogbele_netback_per_bbl: {
    truth: ogNet.netback,
    routes: {
      losses_taken_after_the_costs: (ogNet.grossValue - costs) * (1 - ov.lossPercent / 100),
      losses_left_out: net(ogY, { lossPercent: 0 }).netback,
      freight_left_out: net(ogY, { freightPerBbl: 0 }).netback,
      yields_averaged_on_mass: net(mixY(ogM)).netback,
    },
  },
  onne_total_cost_usd: {
    truth: onne.totalCost,
    routes: {
      typed_zero_tank_read_as_unlimited: unlimited.totalCost,
      sulfur_blended_on_volume: NO_RECIPE(sulfurOnVolume) || sulfurOnVolume.totalCost,
      rvp_blended_linearly_on_volume: rvpLinear.totalCost,
      rvp_index_blended_on_mass: rvpIndexOnMass.totalCost,
    },
  },
  onne_fcc_volume_bbl: {
    truth: vol(onne, 'fcc'),
    routes: {
      typed_zero_tank_read_as_unlimited: vol(unlimited, 'fcc'),
      sulfur_blended_on_volume: NO_RECIPE(sulfurOnVolume) || vol(sulfurOnVolume, 'fcc'),
      rvp_blended_linearly_on_volume: vol(rvpLinear, 'fcc'),
      rvp_index_blended_on_mass: vol(rvpIndexOnMass, 'fcc'),
    },
  },
  onne_butane_volume_bbl: {
    truth: vol(onne, 'but'),
    routes: {
      typed_zero_tank_read_as_unlimited: vol(unlimited, 'but'),
      sulfur_blended_on_volume: NO_RECIPE(sulfurOnVolume) || vol(sulfurOnVolume, 'but'),
      rvp_blended_linearly_on_volume: vol(rvpLinear, 'but'),
      rvp_index_blended_on_mass: vol(rvpIndexOnMass, 'but'),
    },
  },
  onne_sulfur_relief_usd_per_ppm: {
    truth: sp(onne, 'Sulfur maximum').price,
    routes: {
      row_dual_read_as_a_price: sp(onne, 'Sulfur maximum').rowPrice,
      row_dual_scaled_by_barrels_not_by_mass: -sp(onne, 'Sulfur maximum').rowPrice * K.ONNE_TARGET,
      one_whole_ppm_re_solved: wholeUnit('sulfurPpm', 'max', 1),
      typed_zero_tank_read_as_unlimited: sp(unlimited, 'Sulfur maximum').price,
      sulfur_blended_on_volume: NO_RECIPE(sulfurOnVolume) || sp(sulfurOnVolume, 'Sulfur maximum').price,
    },
  },
  onne_rvp_relief_usd_per_psi: {
    truth: sp(onne, 'RVP maximum').price,
    routes: {
      row_dual_read_as_a_price: sp(onne, 'RVP maximum').rowPrice,
      per_index_point_with_the_slope_left_out: -sp(onne, 'RVP maximum').rowPrice * K.ONNE_TARGET,
      one_whole_psi_re_solved: wholeUnit('rvp', 'max', 1),
      typed_zero_tank_read_as_unlimited: sp(unlimited, 'RVP maximum').price,
      rvp_index_blended_on_mass: sp(rvpIndexOnMass, 'RVP maximum').price,
    },
  },
  onne_ron_relief_usd_per_octane: {
    truth: sp(onne, 'RON minimum').price,
    routes: {
      row_dual_read_as_a_price: sp(onne, 'RON minimum').rowPrice,
      typed_zero_tank_read_as_unlimited: sp(unlimited, 'RON minimum').price,
      rvp_blended_linearly_on_volume: sp(rvpLinear, 'RON minimum').price,
      sulfur_blended_on_volume: NO_RECIPE(sulfurOnVolume) || sp(sulfurOnVolume, 'RON minimum').price,
    },
  },
};

if (process.argv.includes('--plant')) WRONG.ogbele_netback_per_bbl.routes.planted_identity = ogNet.netback;
// --json: every NUMERIC wrong route's value and nothing else, for the go-live's
// traps (gen_golive.py takes the closest miss per field from here, so a trap in
// the go-live is a route this sweep already ran through the engine). A NO
// RECIPE route is not a number a learner can type and is left out. No verdict.
if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(Object.fromEntries(Object.entries(WRONG).map(([k, w]) => [k, {
    truth: w.truth, routes: Object.fromEntries(Object.entries(w.routes).filter(([, v]) => typeof v === 'number')),
  }])))}\n`);
  process.exit(0);
}

let weak = 0;
let closest = { key: null, route: null, tols: Infinity };
const pad = (s, n) => String(s).padEnd(n);
for (const [key, spec] of Object.entries(WRONG)) {
  const f = fields[key];
  if (!f) { console.log(`REFUSED: ${key} is not a graded field`); process.exit(2); }
  const [, , value, tol] = f;
  if (Math.abs(spec.truth - value) > 1e-9 * Math.max(1, Math.abs(value))) {
    console.log(`REFUSED: ${key} truth ${spec.truth} here disagrees with fields.json ${value}`); process.exit(2);
  }
  const noRecipe = Object.entries(spec.routes).filter(([, v]) => typeof v === 'string');
  const rows = Object.entries(spec.routes).filter(([, v]) => typeof v !== 'string').map(([name, v]) => {
    if (!Number.isFinite(v)) { console.log(`REFUSED: ${key} route ${name} is ${v}`); process.exit(2); }
    return [name, v, Math.abs(v - value) / tol];
  });
  const blind = rows.filter((r) => r[2] <= 1);
  const isWeak = rows.length < 3 || blind.length > 0;
  if (isWeak) weak += 1;
  const miss = rows.reduce((m, r) => (r[2] < m[2] ? r : m), rows[0]);
  if (miss[2] < closest.tols) closest = { key, route: miss[0], tols: miss[2] };
  console.log(`${isWeak ? 'WEAK' : 'ok  '} ${pad(key, 34)} ${rows.length} routes, closest miss ${miss[2].toExponential(2)} tolerances (${miss[0]})`);
  for (const [name, v, t] of rows) console.log(`       ${pad(name, 50)} ${v.toFixed(6).padStart(18)}  ${t <= 1 ? 'BLIND' : `${t.toExponential(2)} tol`}`);
  for (const [name, st] of noRecipe) console.log(`       ${pad(name, 50)} ${'NO RECIPE'.padStart(18)}  (${st}: a miss, not counted toward the three)`);
}
console.log(`fields swept: ${Object.keys(WRONG).length}; routes: ${Object.values(WRONG).reduce((s, w) => s + Object.keys(w.routes).length, 0)} (of which NO RECIPE: ${Object.values(WRONG).reduce((s, w) => s + Object.values(w.routes).filter((v) => typeof v === 'string').length, 0)})`);
console.log(`closest miss overall: ${closest.key} by ${closest.route}, ${closest.tols.toExponential(2)} tolerances`);
console.log(`WEAK fields: ${weak}`);
if (Object.keys(WRONG).length !== 18) { console.log('REFUSED: the sweep does not cover eighteen fields'); process.exit(2); }
process.exit(weak ? 1 : 0);
