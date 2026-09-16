// The PD2 capstone (Gas Lift Design), and the eighteen graded fields derived
// from it by running the engine. Nothing here is typed from a lesson, a chart
// or a table: every graded number below is a return value of
// engines/production/gasLiftDesign.js, gasLiftValves.js or gasProperties.js.
//
// Every NUMERIC condition below differs from the ones
// production/goldens/gaslift_cases.json publishes, which is the DR2 rule:
// design the capstone's conditions BEFORE writing the lessons, so the tier can
// teach on the published case and grade on this one. The golden's competing
// value is named in a trailing comment on every line of CAP.
//
// Three entries in CAP are MODE selections rather than numbers: valveType,
// method and bottomOrifice. The engine offers exactly two choices for each
// (IPO/PPO, surfaceClose/constantPressure, true/false) and the goldens already
// publish both of each, so "differ from the golden" is not available for them.
// They are labelled where they appear. Nothing follows from a mode alone:
// every number that feeds a graded field differs, and the goldensweep gate
// confirms no graded value lands within its own tolerance of anything the
// goldens print.
//
// UNITS. Field units throughout, as every header in engines/production states:
// pressure psia (never psig), depth ft TVD, temperature degF, gradients
// psi/ft, gas rate Mscf/d, port and bellows dimensions in and in2. The z
// factor is dimensionless. Nothing here is SI and nothing here is gauge.
//
// ---------------------------------------------------------------------------
// THE WELL: OKPARA-9, and why it is uncomfortable
//
// A 9640 ft oil well on continuous gas lift, kicked off at 1268.3 psia on a
// 0.682 gravity injection gas, unloading a 0.468 psi/ft kill fluid against a
// 186.4 psia wellhead, spaced on a 48.9 psi surface decrement per valve into a
// 0.99 in2 bellows family. Five things were tuned into it, and every one of
// them is verified below from a printed value in the _aux block rather than
// asserted. The reader can check each claim against the number named.
//
//   1. THE STRING MULTIPOINTS IN THE MIDDLE, NOT AT THE TOP AND NOT AT THE
//      BOTTOM. The surface-referred spread of each valve, its own opening
//      surface pressure less its own closing surface pressure, runs
//      54.371, 42.341, 49.042, 37.565, 28.171, 20.409 psi
//      (aux.valves: pSurfOpenPsia minus closingSurfacePressurePsia). The
//      design's decrement is 48.9 psi, which beats every one of them except
//      valves 1 and 3. So valve 1 stays open at stage 2, valve 2 closes
//      cleanly at stage 3, and valve 3 stays open again at stage 4:
//      aux.unloading prints upperValvesOpen [], [1], [], [3], [], [], []. A
//      verdict that is not monotone in depth is not what a spacing sheet leads
//      anyone to expect, and the reason is item 3.
//
//   2. STAGE 4 IS FOURTEEN HUNDREDTHS OF A PSI FROM THE OTHER ANSWER. Valve
//      3's closing surface pressure is 1121.4580042974942 psia and the casing
//      sits at 1121.6 psia when the point of injection transfers to valve 4:
//      the margin is 0.14199570250571014 psi (aux.unloading stage 4). The
//      margin moves about 1.14 psi per psi of decrement, so the verdict flips
//      between 49.02 and 49.03 psi per valve: aux.decrementKnifeEdge prints
//      the same design at 46.5, 48.6, 48.9, 49.02, 49.03, 49.2 and 51 psi per
//      valve, and 49.02 still reports multipointing at stage 4 on a margin of
//      0.005421989815886263 psi while 49.03 does not, on minus
//      0.005958572843147607 psi. One hundredth of a psi per valve of design
//      decrement, on a 1268.3 psia system, is the whole of the difference.
//      The engine emits a hard boolean over a margin no gas-lift
//      installation on earth controls to, and nothing independent checks it
//      (defect (a) below).
//
//   3. THE PORT LADDER STEPS IN THE MIDDLE OF THE STRING, AND THAT IS WHAT
//      MAKES THE VERDICT NON-MONOTONE. selectPort takes the smallest catalog
//      port that passes the design rate at the UNLOADING transfer
//      differential. At valve 3's conditions the 9/32 in port passes
//      2029.973885223026 Mscf/d against the 2062 Mscf/d target, short by
//      32.026114776974055 Mscf/d (aux.portLadder), so valve 3 steps up to
//      11/32 in. R goes from 0.06275375950441259 to 0.09374327037078918, the
//      spread goes up by half, and the valve that was going to close no longer
//      does. aux.portLadder.byTarget reruns the whole design at 2029 Mscf/d,
//      one Mscf/d under that port's capacity: valve 3 keeps the 9/32 in port,
//      its spread falls from 57.533 to 38.514 psi, its closing surface
//      pressure rises from 1121.458 to 1137.676 psia, stage 4 goes quiet and
//      the only multipointing left is stage 2. Thirty-three Mscf/d of design
//      rate, 1.6 per cent, decides whether this string injects at two depths.
//      Push the target the other way to 2110 Mscf/d and the ladder steps at
//      valve 1 instead, and three stages multipoint.
//
//   4. THE DEEPEST INJECTION POINT WAS SOLVED ON THE WRONG PRESSURE, AND THE
//      SHORTFALL WARNING IS MEASURED AGAINST IT. Spacing stops on minSpacing
//      with the bottom mandrel at 8730.375110751653 ft while the deepest point
//      at which the KICKOFF pressure beats the flowing traverse is
//      9139.524034378974 ft, a 409.148923627321 ft shortfall
//      (aux.injectionPoint). But the well does not run on the kickoff
//      pressure. Handed the 1178.3 psia operating pressure instead, the same
//      function puts the injection point at 8523.653432621404 ft, which is
//      615.8706017575696 ft SHALLOWER (aux.operatingVsKickoff). So the bottom
//      mandrel at 8730.375 ft is 409.149 ft above the target the design was
//      given and 206.72167813024862 ft BELOW the depth the operating pressure
//      can actually reach, and the engine warns about the first and says
//      nothing about the second. Graded field 18 is the operating injection
//      line read at the kickoff-based injection point: it is
//      1459.3240954891764 psia against a flowing traverse of
//      1514.7805849978597 psia at the same depth, so it sits
//      55.45648950868326 psi BELOW the tubing. At the operating pressure gas
//      could not enter at the design's own target depth at all.
//      deepestInjectionPoint takes whatever pSurfPsia the caller hands it.
//
//   5. THE INSTALLATION CANNOT SIT ON ITS OWN ORIFICE. Two inputs that never
//      speak to each other: pOperatingPsia is 90 psi below kickoff, while the
//      spacing schedule walks the surface pressure down 48.9 psi a valve, so
//      from valve 3 on the operating pressure (1178.3 psia) is ABOVE each
//      valve's own opening surface pressure (1170.5, 1121.6, 1072.7, 1023.8,
//      974.9). valveSetting duly returns closesAtOperating false for five of
//      the six charged valves, valve 2 missing by only 1.40 psi at depth
//      (1315.049 psia operating column against a 1313.645 psia dome) and
//      valve 6 by 217.2 psi (aux.closesAtOperating), and
//      designGasLift raises no warning for any of it, because its warnings
//      come only from the unloading walk. On top of that the bottom orifice,
//      which bypasses selectPort entirely, passes 1983.7456189945779 Mscf/d
//      against the 2062 Mscf/d target: passesTarget is false and again there
//      is no warning (aux.bottomOrificeUnwarned).
//
// ---------------------------------------------------------------------------
// WHERE THIS CAPSTONE STANDS ON WHAT THE ORACLE DOES AND DOES NOT GATE
//
// tools/validation/production/oracle_gaslift.py is an independent stdlib
// oracle: RK4 at 20x the engine's step count for the gas column, bisection
// where the engine iterates a fixed point. It gates gas properties, the
// nitrogen dome charge, the force balance, Thornhill-Craver, the spacing
// recursion, the valve settings and the deepest injection point. Four things
// it does not gate, or gates only in one direction:
//
//   (a) THE UNLOADING VERDICT IS UNGATED. The oracle's unloading() is a stub:
//       it walks the valves and appends upperValvesOpen [] for every stage
//       without ever evaluating the condition, and the result is never written
//       into the goldens (gaslift_cases.json has no unloading key). So the
//       single most consequential thing designGasLift emits, the boolean that
//       says the string will inject at two depths at once, has no independent
//       check behind it. The engine's own jest gate asserts only a direction:
//       10 psi per valve multipoints, 90 psi per valve does not. EXPOSED HERE
//       AS THE CENTRE OF THE CAPSTONE, at a margin of 0.142 psi, on a design
//       whose verdict is non-monotone in depth. Graded fields 13 and 14 are
//       the two closing pressures the verdict turns on.
//
//   (b) FOR A PPO VALVE THE CLOSING TEST IS A CATEGORY ERROR.
//       closingSurfacePressurePsia converts a dome pressure that balances
//       against the TUBING into a CASING surface pressure through the
//       injection gas column, and unloadingSequence then compares it against
//       the casing injection pressure. NOT EXPOSED IN THE GRADED FIELDS: this
//       capstone is IPO, because a PPO capstone has no knife edge at all, the
//       verdict is simply "multipointing at every stage from the second on".
//       It is priced in aux.ppoCategoryError instead, by declaring this same
//       installation PPO and printing what happens, so the lesson can point at
//       it. Note the goldens' own constantPressurePPO case publishes negative
//       spreads for every valve, which is the same force balance seen from the
//       tubing side.
//
//   (c) deepestInjectionPoint READS THE PRODUCTION TRAVERSE BY CHORD. The
//       crossing is found on straight lines drawn between whatever rows the
//       caller happened to tabulate, and the golden's own case is tabulated
//       every 1000 ft. EXPOSED HERE IN THE GRADED FIELDS: field 15 solves this
//       well on a 24.1 ft traverse and field 17 on the 1606.7 ft traverse a
//       designer reading a gradient curve would actually hand it. The two
//       answers are 26.522633829263214 ft apart on the same well and the
//       injection pressure at the crossing moves 0.8588236200664596 psi
//       (aux.injectionPoint). The function cannot detect this itself: because
//       both sides of the crossing are read off the same pair of chords, the
//       residual pInj - dpTransfer - pProd at the reported crossing is
//       0.0512768552439411 psi even on the 1606.7 ft traverse that is 26.5 ft
//       out, well inside the 0.5 psi the engine's own jest gate allows. A
//       consistency check that closes on its own interpolation is not a
//       check on the interpolation.
//
//   (d) THE TARGET-DEPTH MANDREL IS EXEMPT FROM minSpacingFt. In spaceValves
//       the d >= floor branch pushes the floor and returns BEFORE the
//       increment < minSpacingFt check, so a design that reaches its target
//       may land its last mandrel closer to the one above than its own stated
//       minimum, with no warning. The golden's westTexasOil does exactly this,
//       131.4 ft against a 250 ft minimum, so it is not novel. NOT EXPOSED
//       HERE: this capstone stops on minSpacing, the branch that does check.
//       aux.spacingFloorProbe shows why it can never take the other branch on
//       this well: drop the stated minimum to 1 ft and the recursion still
//       stops, on injectionPressure, at 8879.119880191985 ft, 260.40 ft above
//       the target, because the 48.9 psi decrement walks the injection line
//       down faster than the kill gradient lets the next valve go deeper. The
//       minSpacing stop this capstone gets at 335 ft is therefore not the
//       binding constraint it looks like.
//
// ---------------------------------------------------------------------------
// WHY THE FLOWING TRAVERSE IS AN INJECTED TABLE
//
// The module header is explicit that it does not solve the well's inflow or
// its multiphase outflow, and that the flowing traverse used to locate the
// deepest injection point is passed in as a depth-pressure table so the caller
// can build it from a validated nodal model rather than this module inventing
// a gradient. The golden follows the same discipline: its traverse is a
// labelled table of nine rows. This capstone uses its own analytic gradient,
//
//     p(D) = pWhFlow + gTop D + (gBot - gTop) D^2 / (2 Dmax)
//
// a lifted column whose gradient rises linearly from 0.062 psi/ft at surface
// to 0.229 psi/ft at the packer, which is the shape a real gas-lifted traverse
// has, light where the injected gas is and heavy below it. It is sampled at
// two resolutions and BOTH samplings are graded, because the gap between them
// is defect (c).
//
// ---------------------------------------------------------------------------
// WHY THE TIERS SPLIT WHERE THEY DO
//
// The split follows what the engine actually computes, in three layers:
//
//   ASSOCIATE owns the injection gas column and the one valve you can place
//   before there is a design. z, the static gradient, the column at the
//   packer, the inverse column (what surface pressure buys a stated pressure
//   at depth), the top valve depth, and reading the injection line at a stated
//   depth. Every one comes out of gasProperties.js, topValveDepth or
//   injectionPressureCurve, and not one of them needs a valve to exist as a
//   machine. This is the layer everything else stands on: get the gas column
//   wrong and every depth and every dome charge below is wrong with it.
//
//   PROFESSIONAL owns the design itself: where the mandrels go and what the
//   shop dials into the valves. Two spaced depths out of the recursion, then
//   one valve as a machine, its dome charge at valve temperature and its
//   test-rack opening, and another valve's spread and what its port passes.
//   This is spaceValves plus valveSetting, which is what a gas-lift design
//   sheet is and where the tier's own name comes from.
//
//   EXPERT owns what the sheet does not show and what breaks it: the closing
//   pressures that decide whether the string unloads at one depth or two, and
//   the deepest point at which gas can enter at all, including how far that
//   answer moves when the traverse is tabulated the way the field tabulates it
//   and what the OPERATING pressure does to it. A learner can produce a
//   complete, plausible and wrong installation without computing anything in
//   this tier, which is exactly why it is the last one.
const R = '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines';
const D = await import(`${R}/engines/production/gasLiftDesign.js`);
const V = await import(`${R}/engines/production/gasLiftValves.js`);
const P = await import(`${R}/engines/production/gasProperties.js`);
import * as fs from 'fs';

export const CAP = {
  // ---- the injection gas and the hole ------------------------------------
  gasSg: 0.682,             // golden columns/designs: 0.65, 0.7, 0.6 (0.75, 0.8 in gasProperties)
  whtF: 103.5,              // golden designs: 100, 110, 95
  bhtF: 236.5,              // golden designs: 190, 240, 175
  refDepthFt: 10250,        // golden designs: 8000, 11000, 9000
  maxDepthFt: 9640,         // golden designs maxDepthFt: 7500, 10500, 8500

  // ---- the injection system ----------------------------------------------
  pKickoffPsia: 1268.3,     // golden designs: 1014.7, 1414.7, 1114.7
  pOperatingPsia: 1178.3,   // golden designs: 914.7, 1314.7, 1114.7
  dpPerValvePsi: 48.9,      // golden designs: 25, 40, 0
  dpTransferPsi: 58.5,      // golden designs: 50, 75, 100
  killGradPsiPerFt: 0.468,  // golden designs: 0.45, 0.5, 0.42
  unloadGradPsiPerFt: 0.094,// golden designs: 0.10, 0.12, 0.08
  pWhUnloadPsia: 186.4,     // golden designs: 114.7, 214.7, 164.7
  minSpacingFt: 335,        // golden designs: 250, 300, 200
  maxValves: 11,            // golden designs: 12, 14, 10

  // ---- the valves ---------------------------------------------------------
  bellowsAreaIn2: 0.99,     // golden designs: 0.77 and 0.31, the two catalog families
  portsIn: [0.28125, 0.34375, 0.40625, 0.46875, 0.5625],
                            // golden port ladders: [0.25 0.3125 0.375 0.4375 0.5 0.625 0.75]
                            // and [0.125 0.15625 0.1875 0.21875 0.25 0.3125]. No overlap.
  orificeIdIn: 0.34375,     // golden designs orificeIdIn: 0.25, 0.1875 (and null)
  qgiTargetMscfd: 2062,     // golden designs: 500, 250, 800

  // MODE SELECTIONS, not numbers. The engine offers two of each and the
  // goldens publish both, so these cannot differ from the golden. No graded
  // value follows from a mode: every number above differs.
  valveType: 'IPO',         // golden designs: IPO, IPO, PPO
  method: 'surfaceClose',   // golden designs: surfaceClose, surfaceClose, constantPressure
  bottomOrifice: true,      // golden designs: true, true, false

  // ---- the gas column reads ----------------------------------------------
  colSteps: 96,             // golden columns are cut on gasColumnPressure's default 40,
                            // and spaceValves/valveSetting hardcode steps 20 internally
  curveSteps: 64,           // golden injection curve is cut on the default 40
  injCurveReadFt: 5375,     // golden reads its traverse at 0/1000/.../8000 ft
  packerTargetPsia: 1585,   // no golden inverts a column at a stated pressure; its column
                            // cases invert 1215.716705, 1841.239804, 668.597603

  // ---- the flowing traverse of the lifted well ---------------------------
  pwhFlowPsia: 224.6,       // golden injectionPoint traverse starts at 164.7 psia
  gTopPsiPerFt: 0.062,      // golden traverse's shallowest chord is 0.100 psi/ft
  gBotPsiPerFt: 0.229,      // golden traverse's deepest chord is 0.144 psi/ft
  travRowsFine: 401,        // golden injectionPoint traverse: 9 rows, 1000 ft apart
  travRowsCoarse: 7,        // golden injectionPoint traverse: 9 rows, 1000 ft apart
};

// The lifted flowing traverse, as an analytic gradient sampled into the table
// the engine asks for. The gradient rises linearly from gTop at surface to
// gBot at the packer.
const pProdAt = (d) => CAP.pwhFlowPsia + CAP.gTopPsiPerFt * d
  + ((CAP.gBotPsiPerFt - CAP.gTopPsiPerFt) * d * d) / (2 * CAP.maxDepthFt);
const traverse = (rows) => Array.from({ length: rows }, (_, i) => {
  const tvdFt = (CAP.maxDepthFt * i) / (rows - 1);
  return { tvdFt, pPsia: pProdAt(tvdFt) };
});

export function capstoneValues() {
  const tempAtDepthF = D.linearTemperature({
    whtF: CAP.whtF, bhtF: CAP.bhtF, refDepthFt: CAP.refDepthFt,
  });

  // --- the injection gas column -------------------------------------------
  const zKickoff = P.naturalGasZ({ pPsia: CAP.pKickoffPsia, tF: CAP.whtF, gasSg: CAP.gasSg });
  const gradKickoff = P.gasGradient({
    pPsia: CAP.pKickoffPsia, tF: CAP.whtF, gasSg: CAP.gasSg, z: zKickoff,
  });
  const colArgs = { gasSg: CAP.gasSg, tempAtDepthF, steps: CAP.colSteps };
  const colAtPacker = P.gasColumnPressure({
    pSurfPsia: CAP.pKickoffPsia, tvdFt: CAP.maxDepthFt, ...colArgs,
  });
  const surfForPacker = P.gasColumnSurfacePressure({
    pAtDepthPsia: CAP.packerTargetPsia, tvdFt: CAP.maxDepthFt, ...colArgs,
  });
  const injCurve = D.injectionPressureCurve({
    pSurfPsia: CAP.pKickoffPsia, gasSg: CAP.gasSg, tempAtDepthF,
    maxDepthFt: CAP.maxDepthFt, steps: CAP.curveSteps,
  });
  const injCurveDefault = D.injectionPressureCurve({          // aux only, the default 40
    pSurfPsia: CAP.pKickoffPsia, gasSg: CAP.gasSg, tempAtDepthF, maxDepthFt: CAP.maxDepthFt,
  });
  const exactAtRead = P.gasColumnPressure({
    pSurfPsia: CAP.pKickoffPsia, tvdFt: CAP.injCurveReadFt,
    gasSg: CAP.gasSg, tempAtDepthF, steps: 2000,
  }).pBottomPsia;

  // --- the deepest point of gas injection ---------------------------------
  const dip = (rows, pSurfPsia = CAP.pKickoffPsia) => D.deepestInjectionPoint({
    prodTraverse: traverse(rows), pSurfPsia, gasSg: CAP.gasSg, tempAtDepthF,
    dpTransferPsi: CAP.dpTransferPsi, maxDepthFt: CAP.maxDepthFt, steps: CAP.curveSteps,
  });
  const ipFine = dip(CAP.travRowsFine);
  const ipCoarse = dip(CAP.travRowsCoarse);
  const ipOperating = dip(CAP.travRowsFine, CAP.pOperatingPsia);

  // --- the installation ----------------------------------------------------
  const cfg = {
    pKickoffPsia: CAP.pKickoffPsia, pOperatingPsia: CAP.pOperatingPsia, method: CAP.method,
    dpPerValvePsi: CAP.dpPerValvePsi, dpTransferPsi: CAP.dpTransferPsi,
    killGradPsiPerFt: CAP.killGradPsiPerFt, unloadGradPsiPerFt: CAP.unloadGradPsiPerFt,
    pWhUnloadPsia: CAP.pWhUnloadPsia, gasSg: CAP.gasSg, tempAtDepthF,
    maxDepthFt: CAP.maxDepthFt, targetDepthFt: ipFine.depthFt,
    minSpacingFt: CAP.minSpacingFt, maxValves: CAP.maxValves,
    valveType: CAP.valveType, bellowsAreaIn2: CAP.bellowsAreaIn2,
    ports: CAP.portsIn.map((idIn) => ({ idIn, label: `${idIn} in` })),
    qgiTargetMscfd: CAP.qgiTargetMscfd,
    bottomOrifice: CAP.bottomOrifice, orificeIdIn: CAP.orificeIdIn,
  };
  const design = D.designGasLift(cfg);
  const v = design.valves;
  const deepestMandrelFt = design.depths[design.depths.length - 1];

  // --- aux helpers ---------------------------------------------------------
  const margins = (dz) => dz.unloading.map((s, i) => ({
    stage: s.stage,
    surfaceInjectionPsia: s.surfaceInjectionPsia,
    upperValvesOpen: s.upperValvesOpen,
    marginPsi: dz.valves.slice(0, i)
      .map((u, j) => (u.closingSurfacePressurePsia === null ? null
        : { valve: j + 1, psi: s.surfaceInjectionPsia - u.closingSurfacePressurePsia }))
      .filter(Boolean),
  }));
  const variant = (over) => {
    const dz = D.designGasLift({ ...cfg, ...over });
    return {
      stopReason: dz.stopReason,
      nValves: dz.depths.length,
      deepestFt: dz.depths[dz.depths.length - 1],
      ports: dz.valves.map((x) => x.portIdIn),
      valve3SpreadPsi: dz.valves[2] ? dz.valves[2].spreadPsi : null,
      valve3ClosingSurfacePsia: dz.valves[2] ? dz.valves[2].closingSurfacePressurePsia : null,
      openByStage: dz.unloading.map((s) => s.upperValvesOpen),
      multipointingStages: dz.unloading.filter((s) => s.multipointing).map((s) => s.stage),
      tightestMarginPsi: margins(dz).flatMap((m) => m.marginPsi.map((x) => x.psi))
        .reduce((a, b) => (Math.abs(b) < Math.abs(a) ? b : a), Infinity),
      warnings: dz.warnings.map((w) => w.code),
    };
  };

  const v3 = v[2];
  const v3Pick = V.selectPort({
    ports: cfg.ports, targetMscfd: CAP.qgiTargetMscfd,
    pUpPsia: v3.pInjAtDepthPsia, pDnPsia: v3.pProdAtDepthPsia,
    gasSg: CAP.gasSg, tF: v3.tempF,
  });
  const vBot = v[v.length - 1];
  const botPick = V.selectPort({
    ports: cfg.ports, targetMscfd: CAP.qgiTargetMscfd,
    pUpPsia: vBot.pInjAtDepthPsia, pDnPsia: vBot.pProdAtDepthPsia,
    gasSg: CAP.gasSg, tF: vBot.tempF,
  });

  return {
    // Associate: the injection gas column, and the one valve you can place
    // before there is a design.
    gas_z_at_kickoff:                    zKickoff,
    gas_gradient_at_kickoff_psi_per_ft:  gradKickoff,
    inj_column_at_packer_psia:           colAtPacker.pBottomPsia,
    inj_surface_for_1585psia_psia:       surfForPacker,
    top_valve_depth_ft:                  design.depths[0],
    inj_curve_at_5375ft_psia:            injCurve.at(CAP.injCurveReadFt),
    // Professional: the installation. Where the mandrels go and what the shop
    // dials into the valves.
    valve2_depth_ft:                     design.depths[1],
    valve4_depth_ft:                     design.depths[3],
    valve2_dome_at_temp_psia:            v[1].domeAtTempPsia,
    valve2_test_rack_opening_psia:       v[1].testRackOpeningPsia,
    valve4_spread_psi:                   v[3].spreadPsi,
    valve4_throughput_mscfd:             v[3].throughputMscfd,
    // Expert: what the sheet does not show. Whether the string unloads at one
    // depth or two, and where gas can actually enter.
    valve1_closing_surface_psia:         v[0].closingSurfacePressurePsia,
    valve3_closing_surface_psia:         v[2].closingSurfacePressurePsia,
    injection_point_depth_ft:            ipFine.depthFt,
    injection_point_pinj_psia:           ipFine.pInjPsia,
    injection_point_depth_coarse_ft:     ipCoarse.depthFt,
    operating_inj_at_injection_pt_psia:  design.injectionCurve.at(ipFine.depthFt),
    _aux: {
      column: {
        // The engine hardcodes steps 20 inside spaceValves and valveSetting and
        // defaults to 40 in injectionPressureCurve. This is what that costs on
        // a 9640 ft column: nothing worth a warning, which is the honest
        // finding and the opposite of PD1's Cullender and Smith result.
        atPackerBySteps: Object.fromEntries([2, 20, 40, 96, 400, 2000].map((s) => [s,
          P.gasColumnPressure({
            pSurfPsia: CAP.pKickoffPsia, tvdFt: CAP.maxDepthFt,
            gasSg: CAP.gasSg, tempAtDepthF, steps: s,
          }).pBottomPsia])),
        gradedMinusConvergedPsi: colAtPacker.pBottomPsia - P.gasColumnPressure({
          pSurfPsia: CAP.pKickoffPsia, tvdFt: CAP.maxDepthFt,
          gasSg: CAP.gasSg, tempAtDepthF, steps: 2000,
        }).pBottomPsia,
        inverseRoundTripPsia: P.gasColumnPressure({
          pSurfPsia: surfForPacker, tvdFt: CAP.maxDepthFt, ...colArgs,
        }).pBottomPsia,
        zAtPacker: P.naturalGasZ({
          pPsia: colAtPacker.pBottomPsia,
          tF: tempAtDepthF(CAP.maxDepthFt), gasSg: CAP.gasSg,
        }),
        tempAtPackerF: tempAtDepthF(CAP.maxDepthFt),
      },
      injectionCurveChord: {
        // injectionPressureCurve.at() is a straight line between its own
        // samples. Read at 5375 ft, between samples on a 150.625 ft grid.
        gradedSteps: CAP.curveSteps,
        gradedReadPsia: injCurve.at(CAP.injCurveReadFt),
        defaultSteps40ReadPsia: injCurveDefault.at(CAP.injCurveReadFt),
        exactColumnPsia: exactAtRead,
        chordBiasPsi: injCurve.at(CAP.injCurveReadFt) - exactAtRead,
        chordBiasAtDefault40Psi: injCurveDefault.at(CAP.injCurveReadFt) - exactAtRead,
        sampleIntervalFt: CAP.maxDepthFt / CAP.curveSteps,
      },
      injectionPoint: {
        // Defect (c): the crossing is found on chords drawn between the rows
        // the caller tabulated. Same well, same function, seven resolutions.
        byTraverseRows: Object.fromEntries([7, 13, 25, 41, 97, 401, 2001].map((n) => {
          const h = dip(n);
          return [n, {
            rowSpacingFt: CAP.maxDepthFt / (n - 1),
            depthFt: h.depthFt, pInjPsia: h.pInjPsia, pProdPsia: h.pProdPsia,
            limitedBy: h.limitedBy,
            residualPsi: h.pInjPsia - CAP.dpTransferPsi - h.pProdPsia,
          }];
        })),
        coarseMinusFineFt: ipCoarse.depthFt - ipFine.depthFt,
        coarseMinusFinePInjPsi: ipCoarse.pInjPsia - ipFine.pInjPsia,
        // Item 4: how far the design actually gets, and what the shortfall
        // costs on the flowing traverse. pProdAt is the capstone's own
        // traverse function, printed here so the claim is checkable.
        deepestMandrelFt,
        shortfallFt: ipFine.depthFt - deepestMandrelFt,
        traverseAtInjectionPointPsia: pProdAt(ipFine.depthFt),
        traverseAtDeepestMandrelPsia: pProdAt(deepestMandrelFt),
        shortfallCostPsi: pProdAt(ipFine.depthFt) - pProdAt(deepestMandrelFt),
      },
      operatingVsKickoff: {
        // Item 4 again, and the trap: the injection point above was solved on
        // the KICKOFF pressure. The well runs on the operating pressure.
        kickoffPsia: CAP.pKickoffPsia,
        operatingPsia: CAP.pOperatingPsia,
        kickoffInjectionPoint: ipFine,
        operatingInjectionPoint: ipOperating,
        operatingMinusKickoffDepthFt: ipOperating.depthFt - ipFine.depthFt,
        deepestMandrelFt,
        mandrelBelowOperatingPointFt: deepestMandrelFt - ipOperating.depthFt,
        operatingLineAtKickoffPointPsia: design.injectionCurve.at(ipFine.depthFt),
        traverseAtKickoffPointPsia: pProdAt(ipFine.depthFt),
        operatingMinusTraverseAtKickoffPointPsi:
          design.injectionCurve.at(ipFine.depthFt) - pProdAt(ipFine.depthFt),
        // designGasLift builds this curve on its own default sample count,
        // which is not settable through the API and so is NOT a capstone
        // condition. The value is a return of injectionPressureCurve.at all
        // the same.
        designCurveSamples: design.injectionCurve.depths.length,
      },
      spacing: {
        stopReason: design.stopReason,
        depths: design.depths,
        increments: design.depths.slice(1).map((d, i) => d - design.depths[i]),
        surfacePressures: design.surfacePressures,
        minSpacingFt: CAP.minSpacingFt,
        lastIncrementFt: deepestMandrelFt - design.depths[design.depths.length - 2],
        pOperatingPsia: design.pOperatingPsia,
        warnings: design.warnings,
      },
      valves: design.valves.map((x, i) => ({
        valve: i + 1, depthFt: x.depthFt, tempF: x.tempF, valveType: x.valveType,
        portIdIn: x.portIdIn, r: x.r, pSurfOpenPsia: x.pSurfOpenPsia,
        pInjAtDepthPsia: x.pInjAtDepthPsia, pProdAtDepthPsia: x.pProdAtDepthPsia,
        domeAtTempPsia: x.domeAtTempPsia, dome60Psia: x.dome60Psia,
        testRackOpeningPsia: x.testRackOpeningPsia, spreadPsi: x.spreadPsi,
        closingSurfacePressurePsia: x.closingSurfacePressurePsia,
        // Item 1: the decrement is compared against THIS, not against spreadPsi.
        surfaceReferredSpreadPsi: x.closingSurfacePressurePsia === null ? null
          : x.pSurfOpenPsia - x.closingSurfacePressurePsia,
        closesAtOperating: x.closesAtOperating,
        throughputMscfd: x.throughputMscfd, throughputRegime: x.throughputRegime,
        passesTarget: x.passesTarget,
      })),
      unloading: margins(design),
      // Defect (a): the verdict above is ungated by the oracle, and on this
      // well it is 0.142 psi from the other answer.
      decrementKnifeEdge: Object.fromEntries([46.5, 48.6, 48.9, 49.02, 49.03, 49.2, 51].map(
        (dp) => [dp, variant({ dpPerValvePsi: dp })],
      )),
      // Item 3: the port ladder decides the verdict, on 32 Mscf/d of target.
      portLadder: {
        valve: 3,
        depthFt: v3.depthFt, tempF: v3.tempF,
        pInjAtDepthPsia: v3.pInjAtDepthPsia, pProdAtDepthPsia: v3.pProdAtDepthPsia,
        targetMscfd: CAP.qgiTargetMscfd,
        chosenPortIdIn: v3Pick.port ? v3Pick.port.idIn : null,
        candidates: v3Pick.candidates.map((c) => ({
          idIn: c.port.idIn, qMscfd: c.qMscfd, regime: c.regime,
        })),
        smallestPortShortfallMscfd: CAP.qgiTargetMscfd - v3Pick.candidates[0].qMscfd,
        byTarget: Object.fromEntries([2000, 2029, 2030, 2062, 2110].map(
          (q) => [q, variant({ qgiTargetMscfd: q })],
        )),
      },
      // Item 5, first half: two inputs that never speak to each other.
      closesAtOperating: design.valves.map((x, i) => ({
        valve: i + 1,
        depthFt: x.depthFt,
        pSurfOpenPsia: x.pSurfOpenPsia,
        pOperatingSurfPsia: design.pOperatingPsia,
        operatingAtDepthPsia: P.gasColumnPressure({
          pSurfPsia: design.pOperatingPsia, tvdFt: x.depthFt,
          gasSg: CAP.gasSg, tempAtDepthF, steps: 20,
        }).pBottomPsia,
        domeAtTempPsia: x.domeAtTempPsia,
        closesAtOperating: x.closesAtOperating,
      })),
      // Item 5, second half: the bottom orifice bypasses selectPort, comes up
      // short, and no warning is raised.
      bottomOrificeUnwarned: {
        depthFt: vBot.depthFt,
        orificeIdIn: vBot.portIdIn,
        throughputMscfd: vBot.throughputMscfd,
        targetMscfd: CAP.qgiTargetMscfd,
        shortfallMscfd: CAP.qgiTargetMscfd - vBot.throughputMscfd,
        passesTarget: vBot.passesTarget,
        portSelectWouldHaveChosenIdIn: botPick.port ? botPick.port.idIn : null,
        portSelectWouldHavePassedMscfd: botPick.qMscfd,
        warningCodesRaised: design.warnings.map((w) => w.code),
      },
      // Defect (b): the same installation declared PPO. The dome now balances
      // against the tubing, so the closing surface pressure is a casing column
      // drawn through a tubing-side pressure, and every upper valve reads open
      // at every later stage.
      ppoCategoryError: (() => {
        const ppo = D.designGasLift({ ...cfg, valveType: 'PPO' });
        return {
          spreads: ppo.valves.map((x) => x.spreadPsi),
          closingSurfacePressures: ppo.valves.map((x) => x.closingSurfacePressurePsia),
          surfacePressures: ppo.surfacePressures,
          openByStage: ppo.unloading.map((s) => s.upperValvesOpen),
          multipointingStages: ppo.unloading.filter((s) => s.multipointing).map((s) => s.stage),
        };
      })(),
      // Defect (d): why this well can never take the exempt branch.
      spacingFloorProbe: Object.fromEntries([1, 120, 250, 335, 600].map(
        (m) => [m, variant({ minSpacingFt: m })],
      )),
    },
  };
}

// Tolerances, set the way PD1 set them: half an ulp of a seven significant
// figure rounding, |value| * 5e-7, carried to two significant figures. Tight
// enough that a value read off the wrong curve or the wrong valve fails,
// loose enough that an honest seven-figure transcription passes.
const TOL = {
  gas_z_at_kickoff: 4.2e-7,
  gas_gradient_at_kickoff_psi_per_ft: 1.7e-8,
  inj_column_at_packer_psia: 7.9e-4,
  inj_surface_for_1585psia_psia: 6.3e-4,
  top_valve_depth_ft: 1.2e-3,
  inj_curve_at_5375ft_psia: 7.3e-4,
  valve2_depth_ft: 2.2e-3,
  valve4_depth_ft: 3.5e-3,
  valve2_dome_at_temp_psia: 6.6e-4,
  valve2_test_rack_opening_psia: 5.7e-4,
  valve4_spread_psi: 2.3e-5,
  valve4_throughput_mscfd: 1.4e-3,
  valve1_closing_surface_psia: 6.1e-4,
  valve3_closing_surface_psia: 5.6e-4,
  injection_point_depth_ft: 4.6e-3,
  injection_point_pinj_psia: 7.9e-4,
  injection_point_depth_coarse_ft: 4.6e-3,
  operating_inj_at_injection_pt_psia: 7.3e-4,
};
const TIER = {
  gas_z_at_kickoff: 'beginner',
  gas_gradient_at_kickoff_psi_per_ft: 'beginner',
  inj_column_at_packer_psia: 'beginner',
  inj_surface_for_1585psia_psia: 'beginner',
  top_valve_depth_ft: 'beginner',
  inj_curve_at_5375ft_psia: 'beginner',
  valve2_depth_ft: 'intermediate',
  valve4_depth_ft: 'intermediate',
  valve2_dome_at_temp_psia: 'intermediate',
  valve2_test_rack_opening_psia: 'intermediate',
  valve4_spread_psi: 'intermediate',
  valve4_throughput_mscfd: 'intermediate',
  valve1_closing_surface_psia: 'advanced',
  valve3_closing_surface_psia: 'advanced',
  injection_point_depth_ft: 'advanced',
  injection_point_pinj_psia: 'advanced',
  injection_point_depth_coarse_ft: 'advanced',
  operating_inj_at_injection_pt_psia: 'advanced',
};
export const UNIT = {
  gas_z_at_kickoff: 'dimensionless',
  gas_gradient_at_kickoff_psi_per_ft: 'psi/ft',
  inj_column_at_packer_psia: 'psia',
  inj_surface_for_1585psia_psia: 'psia',
  top_valve_depth_ft: 'ft TVD',
  inj_curve_at_5375ft_psia: 'psia',
  valve2_depth_ft: 'ft TVD',
  valve4_depth_ft: 'ft TVD',
  valve2_dome_at_temp_psia: 'psia',
  valve2_test_rack_opening_psia: 'psia',
  valve4_spread_psi: 'psi',
  valve4_throughput_mscfd: 'Mscf/d',
  valve1_closing_surface_psia: 'psia',
  valve3_closing_surface_psia: 'psia',
  injection_point_depth_ft: 'ft TVD',
  injection_point_pinj_psia: 'psia',
  injection_point_depth_coarse_ft: 'ft TVD',
  operating_inj_at_injection_pt_psia: 'psia',
};

const X = capstoneValues();
const fields = Object.keys(TIER).map((k) => [TIER[k], k, X[k], TOL[k]]);
fs.writeFileSync('/root/pd-wip-gaslift/fields.json', JSON.stringify(fields, null, 1));
for (const [t, k, val, tol] of fields) {
  console.log(`${t.padEnd(13)} ${k.padEnd(35)} ${String(val).padEnd(22)} ${UNIT[k].padEnd(13)} (tol ${tol}, ratio ${(tol / Math.abs(val)).toExponential(2)})`);
}
console.log('\naux:', JSON.stringify(X._aux, null, 1));
