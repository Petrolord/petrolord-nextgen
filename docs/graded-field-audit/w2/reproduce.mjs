// W2: reproduce every graded value from the inputs a W2 spec publishes, by
// calling the vendored engines. Nothing here restates a graded formula: the
// inputs are only put into the shape each engine function takes. The builder
// (build_specs.mjs) refuses to write a spec these do not reproduce, and the
// gate (src/lib/w2PublishedInputs.test.js) re-runs them on the committed spec.
import * as W from '../../../packages/engines/engines/drilling/wellIntegrity.js';
import * as P from '../../../packages/engines/engines/drilling/plugAbandonment.js';
import * as SM from '../../../packages/engines/engines/drilling/surveyMath.js';
import * as WC from '../../../packages/engines/engines/drilling/wellCost.js';
import * as N from '../../../packages/engines/engines/production/nodal.js';
import * as GL from '../../../packages/engines/engines/production/gasWellLoading.js';
import * as GP from '../../../packages/engines/engines/production/gasProperties.js';
import * as PL from '../../../packages/engines/engines/production/plungerLift.js';
import * as CM from '../../../packages/engines/engines/drilling/cementing.js';
import * as TD from '../../../packages/engines/engines/drilling/torqueDrag.js';
import * as AC from '../../../packages/engines/engines/drilling/acidizing.js';
import * as SP from '../../../packages/engines/engines/facilities/spacing.js';
import * as PW from '../../../packages/engines/engines/facilities/producedWater.js';
import * as LH from '../../../packages/engines/engines/facilities/lineHydraulics.js';
import * as HT from '../../../packages/engines/engines/facilities/heatTransfer.js';

// ---- integrity ---------------------------------------------------------------

// The survey as the prompt states it: vertical to the kickoff, a constant
// build at one azimuth to the hold angle, then a tangent, stationed every
// `stepM` to `endMdM`.
export function integritySurvey(s) {
  const st = [{ md: 0, inc: 0, azi: s.aziDeg }];
  for (let md = s.kickoffMdM; md <= s.endMdM + 1e-9; md += s.stepM) {
    st.push({ md, inc: Math.min(s.holdIncDeg, ((md - s.kickoffMdM) / 30) * s.buildDegPer30m), azi: s.aziDeg });
  }
  if (st[st.length - 1].md !== s.endMdM) st.push({ md: s.endMdM, inc: s.holdIncDeg, azi: s.aziDeg });
  return st;
}

const integrityTvd = (survey) => {
  const stations = integritySurvey(survey);
  const path = SM.computeWellPath(stations);
  return (md) => SM.stationAtMd(stations, path, md).tvd;
};

const limitPa = (row, inp, tvd) => (row.lotKgM3 != null
  ? row.lotKgM3 * inp.g * tvd(row.mdM)
  : row.limitPsi * inp.paPerPsi);

function integrityIntermediate(inp, method) {
  const tvd = integrityTvd({ ...inp.survey, ...method.surveyStations });
  const mawopA = W.mawop({
    annulusFluidDensityKgM3: inp.aAnnulus.fluidKgM3,
    candidates: inp.aAnnulus.rows.map((r) => ({
      name: r.name, role: r.role, limitPa: limitPa(r, inp, tvd), tvdM: tvd(r.mdM), backupDensityKgM3: r.backupKgM3,
    })),
  });
  const rowA = (role) => mawopA.rows.find((r) => r.kind === role);
  const maasp = (ann) => W.maaspRows({
    annulusFluidDensityKgM3: ann.fluidKgM3,
    elements: ann.rows.map((r) => ({
      name: r.name, kind: r.kind, factor: r.factor ?? W.RP90_MAWOP_FACTORS[r.role],
      limitPa: limitPa(r, inp, tvd), tvdM: tvd(r.mdM), backupDensityKgM3: r.backupKgM3,
    })),
  });
  const b = maasp(inp.bAnnulus);
  const d = maasp(inp.displacement);
  return {
    mawop_a_tubing_row_pa: rowA('inner-tubing-collapse').allowSurfacePa,
    mawop_a_shoe_row_pa: rowA('shoe-formation').allowSurfacePa,
    mawop_a_pa: mawopA.mawopPa,
    mawop_a_governing_tvd_m: mawopA.rows.find((r) => r.name === mawopA.governing).tvdM,
    maasp_b_pa: b.maaspPa,
    maasp_gasfilled_tubing_row_pa: d.rows[0].allowSurfacePa,
  };
}

function integrityAdvanced(inp) {
  const geom = (p) => (p.geometry ? {
    holeIdM: p.geometry.holeIdM, stingerOdM: inp.stingerOdM, stingerIdM: inp.stingerIdM,
    excessFrac: p.geometry.excessPct / 100, spacerAheadM3: p.geometry.spacerAheadM3,
  } : null);
  const plugs = inp.plugs.map((p) => ({
    name: p.name, topMdM: p.topMdM, bottomMdM: p.bottomMdM, foundation: p.foundation,
    isSurfacePlug: p.isSurfacePlug, geometry: geom(p),
  }));
  const p1 = plugs[0];
  const placed = P.balancedPlug({ ...p1.geometry, plugBaseMdM: p1.bottomMdM, plugTopMdM: p1.topMdM });
  const zone = inp.zones[0];
  const rule = P.plugRuleCheck({ plug: p1, sourceTopMdM: zone.topMdM });
  const above = rule.checks.find((c) => c.id === 'above-source');
  const ann = P.annularBarrierCheck({ topMdM: inp.annularCement.topMdM, bottomMdM: inp.annularCement.bottomMdM, verifiedByLog: inp.annularCement.logged });
  const prog = P.abandonmentProgram({ zones: inp.zones.map((z) => ({ ...z, flowPotential: true })), plugs });
  return {
    plug_slurry_m3: placed.slurryM3,
    plug_spacer_behind_m3: placed.spacerBehindM3,
    plug_top_settle_m: placed.pluggedTopMdM - placed.asPumpedTopMdM,
    above_source_margin_m: above.actualM - above.requiredM,
    annular_cement_margin_m: ann.actualM - ann.requiredM,
    program_slurry_takeoff_m3: prog.takeoff.slurryM3,
  };
}

// ---- wellcost -----------------------------------------------------------------

const wcProgram = (inp) => WC.evaluateProgram({ activities: inp.activities, nptFrac: inp.nptPct / 100 });

function wellcostBeginner(inp, method) {
  const act = (id) => inp.activities.find((a) => a.id === id);
  const prog = wcProgram(inp);
  return {
    drill_reservoir_hr: WC.activityDuration(act(method.graded.reservoirDrill)),
    trip_td_hr: WC.activityDuration(act(method.graded.tdTrip)),
    casing_liner_run_hr: WC.activityDuration(act(method.graded.liner)),
    productive_hr: prog.totals.productiveHr,
    npt_hr: prog.totals.nptHr,
    total_days: prog.totals.totalDays,
  };
}

function wellcostIntermediate(inp) {
  const prog = wcProgram(inp);
  const costs = WC.afeCosts({
    items: inp.items, totalDays: prog.totals.totalDays, drilledM: prog.totals.drilledM,
    contingencyFrac: inp.contingencyPct / 100,
  });
  const act = (id) => inp.activities.find((a) => a.id === id);
  const perDay = inp.cpm.rigRateItems.reduce((s, id) => s + inp.items.find((i) => i.id === id).rate, 0);
  const cpm = (sec) => {
    const drill = act(sec.drill);
    return WC.costPerMeter({
      bitCostUsd: sec.bitCostUsd,
      rigRateUsdPerHr: perDay / 24,
      drillingHr: WC.activityDuration(drill),
      connectionHr: sec.connectionHr,
      tripHr: WC.activityDuration(act(sec.trip)),
      intervalM: drill.toMdM - drill.fromMdM,
    });
  };
  return {
    tangible_usd: costs.tangibleUsd,
    intangible_usd: costs.intangibleUsd,
    contingency_usd: costs.contingencyUsd,
    total_usd: costs.totalUsd,
    cpm_intermediate_usd_m: cpm(inp.cpm.intermediate),
    cpm_reservoir_usd_m: cpm(inp.cpm.reservoir),
  };
}

function wellcostAdvanced(inp, method) {
  const prog = wcProgram(inp);
  const curve = WC.costTimeCurve({ program: prog, items: inp.items });
  const at = (id) => {
    const r = prog.rows.find((x) => x.id === id);
    return curve.find((q) => Math.abs(q.tHr - r.endHr) < 1e-9).usd;
  };
  // The three risked fields are a seeded run of the Suite's canonical
  // sampler, which is not vendored here: W3 (Suite) makes that run readable.
  return {
    curve_at_int_casing_usd: at(method.graded.intCasing),
    curve_at_evaluation_usd: at(method.graded.evaluation),
    curve_final_usd: curve[curve.length - 1].usd,
  };
}

// ---- nodal ------------------------------------------------------------------

// The published tubing relation is the capstone's outflow instrument; it is an
// input handed to the engine (the engine takes the outflow as a function).
const nodalOutflow = (o, pWh = o.pWhPsia) => (q) => pWh + o.gGravPsi / (1 + q / o.qRefStbd) + o.kFricPsiPerStbd2 * q * q;
const nodalIpr = (i, method) => N.computeIpr({
  model: 'composite', pr: i.prPsia, pb: i.pbPsia, testPoint: { q: i.testQStbd, pwf: i.testPwfPsia }, nPoints: method.iprPoints,
});

function nodalIntermediate(inp, method) {
  const ipr = nodalIpr(inp.ipr, method);
  const tub = N.tubingCurve({ bhpAt: nodalOutflow(inp.outflow), qMax: ipr.qmax, nPoints: inp.vlpPoints, qMinFraction: method.qMinFraction });
  return {
    vlp_min_q_stbd: tub.minimum.q,
    vlp_min_bhp_psia: tub.minimum.bhp,
    vlp_loaded_end_bhp_psia: tub.curve[0].bhp,
    vlp_friction_end_bhp_psia: tub.curve[tub.curve.length - 1].bhp,
  };
}

function nodalAdvanced(inp, method) {
  const ipr = nodalIpr(inp.ipr, method);
  const node = N.solveOilNode({ ipr, vlpBhpAt: nodalOutflow(inp.outflow), nGrid: inp.nGrid });
  const sweep = N.operatingPointSweep([{ label: 'sweep', value: inp.sweepPwhPsia,
    solve: () => N.solveOilNode({ ipr, vlpBhpAt: nodalOutflow(inp.outflow, inp.sweepPwhPsia), nGrid: inp.nGrid }) }])[0];
  return {
    node_op_q_stbd: node.op.q,
    node_op_pwf_psia: node.op.pwf,
    node_unstable_q_stbd: node.intersections[0].q,
    node_unstable_pwf_psia: node.intersections[0].pwf,
    sweep_pwh1176_q_stbd: sweep.q,
    sweep_pwh1176_pwf_psia: sweep.pwf,
  };
}

// ---- gaswell -------------------------------------------------------------------

// Beginner: z is field 1, so the prompt states the Sutton pseudo-criticals
// and the Dranchuk and Abou-Kassem equation instead of z; the engine's own
// DAK solve at the published reduced pair is the key.
function gaswellBeginner(inp, method) {
  const tempR = GP.toRankine(inp.wellhead.tF);
  const z = GP.dakZ({ ppr: inp.wellhead.pPsia / inp.ppcPsia, tpr: tempR / inp.tpcR }).z;
  const station = { pPsia: inp.wellhead.pPsia, tempR, z, gasSg: inp.gasSg };
  const rho = GL.gasDensityLbFt3(station);
  const drop = (l) => GL.terminalDropletVelocity({ sigmaDyneCm: l.sigmaDyneCm, rhoLiquidLbFt3: l.rhoLbFt3, rhoGasLbFt3: rho });
  const at = GL.loadingAt({
    correlation: GL.recommendCorrelation(inp.wellhead.pPsia).correlation, sigmaDyneCm: inp.brine.sigmaDyneCm,
    rhoLiquidLbFt3: inp.brine.rhoLbFt3, ...station, idIn: inp.tubingIdIn, qMscfd: inp.qMscfd,
  });
  return {
    wh_z_dak: z,
    wh_gas_density_lbmft3: rho,
    wh_terminal_velocity_brine_fts: drop(inp.brine).velocityFtS,
    wh_terminal_velocity_cond_fts: drop(inp.condensate).velocityFtS,
    wh_critical_rate_mscfd: at.criticalRateMscfd,
    wh_actual_velocity_fts: at.actualVelocityFtS,
  };
}

// Intermediate and advanced: z is stated at every station below the
// wellhead and at the plunger's average conditions.
function gaswellDesign(inp, method) {
  const stations = inp.stations.map((s) => ({ depthFt: s.depthFt, pPsia: s.pPsia, tempR: GP.toRankine(s.tF), z: s.z, idIn: inp.tubingIdIn }));
  const brine = { sigmaDyneCm: inp.brine.sigmaDyneCm, rhoLiquidLbFt3: inp.brine.rhoLbFt3 };
  const corr = GL.recommendCorrelation(inp.wellheadPsia).correlation;
  const prof = GL.loadingProfile({ stations, qMscfd: inp.qMscfd, correlation: corr, ...brine, gasSg: inp.gasSg });
  const shoe = prof.controlling;
  const shoeArgs = { qMscfd: inp.qMscfd, ...brine, gasSg: inp.gasSg, pPsia: shoe.pPsia, tempR: shoe.tempR, z: shoe.z };
  const sized = GL.sizeTubingForRate({ candidatesIdIn: inp.candidatesIdIn, correlation: corr, ...shoeArgs });
  const pl = inp.plunger;
  const base = {
    depthFt: pl.depthFt, idIn: pl.idIn, linePressurePsia: pl.linePressurePsia, casingPressurePsia: pl.casingPressurePsia,
    slugLengthFt: pl.slugLengthFt, liquidSg: pl.liquidSg, plungerWeightLb: pl.plungerWeightLb, gasSg: inp.gasSg,
    avgTempR: GP.toRankine(pl.avgTF), z: pl.z, wellGlrScfBbl: pl.wellGlrScfBbl, ...(pl.cycle || {}),
  };
  const screen = PL.screenPlungerLift(base);
  const other = corr === 'coleman' ? 'turner' : 'coleman';
  return {
    mid_critical_rate_mscfd: prof.points.find((p) => p.depthFt === method.midDepthFt).criticalRateMscfd,
    shoe_critical_rate_mscfd: shoe.criticalRateMscfd,
    shoe_actual_velocity_fts: shoe.actualVelocityFtS,
    sized_tubing_critical_rate_mscfd: sized.largestUnloaded.criticalRateMscfd,
    plunger_required_lift_psia: screen.design.lift.requiredPsia,
    plunger_required_glr_scfbbl: screen.design.requiredGlrScfBbl,
    shoe_critical_velocity_turner_fts: GL.criticalVelocity({ correlation: other, ...brine, gasSg: inp.gasSg, pPsia: shoe.pPsia, tempR: shoe.tempR, z: shoe.z }).velocityFtS,
    rejected_tubing_critical_rate_mscfd: sized.rows[0].criticalRateMscfd,
    plunger_slug_hydrostatic_psi: screen.design.lift.terms.slugPsi,
    plunger_max_slug_ft: PL.maxSlugLengthFt(base),
    plunger_gas_per_cycle_scf: screen.design.gasPerCycleScf,
    plunger_liquid_per_day_bbl: screen.design.liquidPerDayBbl,
  };
}

const pick = (keys, fn) => (inp, method) => {
  const all = fn(inp, method);
  return Object.fromEntries(keys.map((k) => [k, all[k]]));
};

// ---- cementing (advanced) ----------------------------------------------------

function cementingAdvanced(inp, method) {
  const casing = { odM: inp.casing.odM, idM: inp.casing.idM, weightKgM: inp.casing.weightKgM, ...method.casingDepths };
  const holeSections = [
    { cased: true, from_md_m: 0, to_md_m: inp.casedToMdM, casing_id_m: inp.casedIdM, hole_id_m: method.casedHoleIdM },
    { cased: false, from_md_m: inp.casedToMdM, to_md_m: inp.openToMdM, hole_id_m: inp.openHoleIdM },
  ];
  const cz = { type: 'bow', spacingM: inp.spacingM, restoringForceN: inp.restoringForceN, standoffAtRestoringForce: inp.standoffAtForce };
  const args = { stations: method.stations, holeSections, casing, mudDensityKgM3: inp.mudKgM3 };
  const so = CM.standoffProfile({ ...args, centralizer: cz });
  let minRow = so.rows[0];
  for (const r of so.rows) if (r.standoff < minRow.standoff) minRow = r;
  return {
    bending_stiffness_nm2: TD.stringProperties({ odM: inp.casing.odM, idM: inp.casing.idM }).eiNm2,
    min_standoff: so.minStandoff,
    standoff_at_centralizer_at_min: minRow.standoffAtCentralizer,
    required_spacing_m: CM.requiredSpacing({ ...args, centralizer: cz }),
    min_standoff_rigid: CM.standoffProfile({ ...args, centralizer: { ...cz, type: 'rigid', bladeOdM: inp.rigidBladeOdM } }).minStandoff,
  };
}

// ---- stimulation (beginner) --------------------------------------------------

function stimulationBeginner(inp, method) {
  const rwM = inp.rwIn * method.mPerIn;
  const s = AC.hawkinsSkin({ kOverKs: inp.kOverKs, rsM: inp.rsM, rwM });
  return {
    q_max_matrix_m3s: AC.maxMatrixRate({
      kM2: inp.kMd * inp.m2PerMd, hM: inp.hM, pFracPa: inp.pFracPa, pResPa: inp.pResPa,
      muPaS: inp.acidMuPaS, reM: inp.reM, rwM, sSkin: s,
    }).qM3s,
  };
}

// ---- separation (advanced): the ADANGA yard ---------------------------------

// The yard as the prompt states it: north and east offsets in metres from a
// datum, turned into latitude and longitude by the two stated scale factors.
export const adangaItems = (inp) => {
  const mLat = inp.mPerDegLat;
  const mLon = inp.mPerDegLonAtEquator * Math.cos((inp.datum.lat * Math.PI) / 180);
  return inp.items.map((it) => (it.northM == null
    ? { id: it.id, name: it.name, type: it.type, lat: null, lon: null }
    : { id: it.id, name: it.name, type: it.type, lat: inp.datum.lat + it.northM / mLat, lon: inp.datum.lon + it.eastM / mLon }));
};

function separationAdvanced(inp, method) {
  const r = SP.checkLayout({ items: adangaItems(inp), radiationSources: [...inp.sources, ...(method.unplacedSources || [])] });
  return {
    adanga_worst_absolute_shortfall_m: r.worstAbsolute.shortfallM,
    adanga_worst_relative_fraction: r.worstRelative.shortfallFraction,
  };
}

// ---- producedwater (beginner) --------------------------------------------------

function producedwaterBeginner(inp) {
  return { ogulagha_oil_density_kgm3: PW.oilDensityKgM3({ apiGravity: inp.api, tC: inp.tC }).rhoKgM3 };
}

// ---- linesizing (intermediate): lessons print the forms ----------------------

function linesizingIntermediate(inp) {
  const line = {
    p1Psia: inp.p1Psia, p2Psia: inp.p2Psia, idIn: inp.idIn, lengthMi: inp.lengthMi, sg: inp.sg,
    tAvgR: inp.tAvgR, zAvg: inp.zAvg, efficiency: inp.efficiency, elevChangeFt: inp.elevChangeFt,
  };
  const g = LH.generalFlowQ({ ...line, muCp: inp.muCp, roughnessIn: inp.roughnessIn });
  const { p2Psia, ...noP2 } = line;
  return {
    brass_weymouth_scfd: LH.weymouthQ(line).qScfd,
    brass_panhandleb_scfd: LH.panhandleBQ(line).qScfd,
    brass_general_scfd: g.qScfd,
    brass_general_friction_factor: g.fDarcy,
    brass_outlet_pressure_psia: LH.gasOutletPressure({ equation: 'weymouth', qScfd: inp.contractScfd, ...noP2 }).p2Psia,
  };
}

// ---- heattransfer (intermediate): the lesson prints the conversion ---------------

function heattransferIntermediate(inp) {
  const pr = HT.lmtdGroups({ thIn: inp.hotInF, thOut: inp.hotOutF, tcIn: inp.coldInF, tcOut: inp.coldOutF });
  return { ubit_p1_two_shells: HT.lmtdCorrectionF({ p: pr.p, r: pr.r, shellPasses: inp.shells }).p1 };
}

export const REPRODUCE = {
  integrity: { intermediate: integrityIntermediate, advanced: integrityAdvanced },
  gaswell: {
    beginner: gaswellBeginner,
    intermediate: pick(['mid_critical_rate_mscfd', 'shoe_critical_rate_mscfd', 'shoe_actual_velocity_fts',
      'sized_tubing_critical_rate_mscfd', 'plunger_required_lift_psia', 'plunger_required_glr_scfbbl'], gaswellDesign),
    advanced: pick(['shoe_critical_velocity_turner_fts', 'rejected_tubing_critical_rate_mscfd', 'plunger_slug_hydrostatic_psi',
      'plunger_max_slug_ft', 'plunger_gas_per_cycle_scf', 'plunger_liquid_per_day_bbl'], gaswellDesign),
  },
  nodal: { intermediate: nodalIntermediate, advanced: nodalAdvanced },
  cementing: { advanced: cementingAdvanced },
  stimulation: { beginner: stimulationBeginner },
  separation: { advanced: separationAdvanced },
  producedwater: { beginner: producedwaterBeginner },
  linesizing: { intermediate: linesizingIntermediate },
  heattransfer: { intermediate: heattransferIntermediate },
  wellcost: { beginner: wellcostBeginner, intermediate: wellcostIntermediate, advanced: wellcostAdvanced },
};
