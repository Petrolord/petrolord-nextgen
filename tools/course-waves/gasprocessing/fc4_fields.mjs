// THE FC4 TEACHING FIELDS. The OBIAFU dehydration duty, the UBIE sour gas
// train and the AGBADA dew point skid.
//
// These are the streams the LESSONS are written from. The capstone runs
// different streams entirely: see fc4_fields_capstone.mjs, which nothing
// here imports and no lesson writer opens.
//
// Field units throughout: MMscfd of gas, psia, degF, lb per MMscf of water,
// gal of solvent per lb of water, gpm, mol percent, Btu.

/* ------------------------------------------------------------------ *
 * OBIAFU. Lean associated gas off a gathering station, into a TEG
 * dehydration unit that has to make pipeline spec.
 * ------------------------------------------------------------------ */

/** Line conditions at the contactor inlet. Below 1000 psia on purpose, so
 *  the saturation answer sits inside the band the engine does not warn
 *  about and no teaching number leans on the held chart correction. */
export const OBIAFU_LINE = { pPsia: 950, tF: 104 };

/** The dehydration duty. The inlet water content is NOT typed here: it is
 *  whatever the engine says the gas is carrying at OBIAFU_LINE, so the
 *  digest prints one chain rather than two disconnected halves. */
export const OBIAFU = {
  gasMMscfd: 62,
  outletLbMMscf: 7,
  circulationGalPerLb: 3.2,
  leanTegWtPct: 99.2,
  absorberTF: 104,
  reboilerTF: 375,
  refluxRatio: 0.25,
  btexInletPpmv: 180,
  btexAbsorbedFrac: 0.15,
};

/** The contactor OBIAFU's gas goes up. */
export const OBIAFU_CONTACTOR = { gasSg: 0.66, ksFtS: 0.3 };

/** Circulation ratios across and outside the customary band, so a lesson
 *  can show what the ratio buys and where the engine starts objecting. */
export const OBIAFU_RATIO_SWEEP = [1.5, 2, 2.5, 3, 3.2, 4, 5, 6];
export const RATIO_AT_LOWER_CUSTOM = 2;
export const RATIO_JUST_UNDER_LOWER = 1.999999;
export const RATIO_AT_UPPER_CUSTOM = 5;
export const RATIO_JUST_OVER_UPPER = 5.000001;

/** Outlet specs from pipeline custom down to a cryogenic feed. */
export const OBIAFU_SPEC_SWEEP = [7, 4, 2, 1, 0.5];

/** Rates, so a lesson can separate the intensive answer (lb per MMscf)
 *  from the extensive one (lb a day). */
export const OBIAFU_RATE_SWEEP = [10, 30, 62, 120, 250];

/** Line conditions for the saturation surface: four pressures across four
 *  temperatures, spanning the warning threshold in one direction and the
 *  whole field band in the other. */
export const SATURATION_P = [200, 600, 1000, 1500];
export const SATURATION_T = [60, 80, 104, 140];

/** The warning boundary itself, read from both sides. */
export const WARN_AT_THRESHOLD = 1000;
export const WARN_JUST_OVER = 1000.000001;

/** The band the water fit is guarded to, read from both sides at each end.
 *  degF, because that is the door the engine takes. */
export const FIT_LOW_EDGE_F = -49;
export const FIT_BELOW_LOW_EDGE_F = -49.000001;
export const FIT_HIGH_EDGE_F = 212;
export const FIT_ABOVE_HIGH_EDGE_F = 212.000001;
/** 60 degC, the upper edge the module's own docstring claims for the fit. */
export const FIT_DOCSTRING_HIGH_EDGE_F = 140;
/** Freezing, for the measured vapour-pressure coefficient. */
export const WATER_FREEZING_F = 32;

/* ------------------------------------------------------------------ *
 * UBIE. Sour gas from a second field, into an amine unit that has to
 * meet both a CO2 spec and the four ppmv H2S pipeline custom.
 * ------------------------------------------------------------------ */

export const UBIE = {
  gasMMscfd: 88,
  co2MolPct: 5.2,
  h2sMolPct: 1.4,
  co2SpecMolPct: 2,
  h2sSpecMolPct: 0.0004,
  amineId: 'MDEA',
  amineWtPct: 45,
  leanLoading: 0.05,
  richLoading: 0.48,
  dutyBtuPerGal: 800,
};

/** The contactor UBIE's gas goes up. */
export const UBIE_CONTACTOR = { pPsia: 985, tF: 112, gasSg: 0.71, ksFtS: 0.25 };

/** The same duty put through all three amines at each one's own typical
 *  strength, rich limit and duty, so the table's rows do the talking. */
export const UBIE_AMINE_IDS = ['MEA', 'DEA', 'MDEA'];

/** Rich loadings across and past MDEA's customary limit. */
export const UBIE_RICH_SWEEP = [0.30, 0.38, 0.44, 0.48, 0.50, 0.55];
export const RICH_AT_MDEA_LIMIT = 0.5;
export const RICH_JUST_OVER_MDEA_LIMIT = 0.500001;

/** Lean loadings, so a lesson can show the swing rather than the rich end. */
export const UBIE_LEAN_SWEEP = [0.01, 0.03, 0.05, 0.08, 0.12];

/** A spec pair that asks for no removal at all, and one that asks for a
 *  spec above the inlet. Both are refusals, and they are different ones. */
export const UBIE_SPEC_ALREADY_MET = { co2SpecMolPct: 5.2, h2sSpecMolPct: 1.4 };
export const UBIE_SPEC_ABOVE_INLET = { co2SpecMolPct: 7.5, h2sSpecMolPct: 0 };

/* ------------------------------------------------------------------ *
 * The absorber as a staged device. Kremser is generic, so these are
 * absorption factors and stage counts rather than a named stream.
 * ------------------------------------------------------------------ */

export const KREMSER_FACTORS = [0.6, 0.8, 1.0, 1.2, 1.5, 2.0, 3.0];
export const KREMSER_STAGES = [1, 2, 3, 4, 6, 8, 12];
/** The OBIAFU absorber's own working point. */
export const OBIAFU_ABSORPTION_FACTOR = 1.6;
export const OBIAFU_STAGES = 6;
/** Unity, either side, because the relation changes shape there. */
export const A_AT_UNITY = 1;
export const A_JUST_UNDER_UNITY = 1 - 1e-9;
export const A_JUST_OVER_UNITY = 1 + 1e-9;
export const A_WELL_UNDER_UNITY = 0.8;
/** A spec a starved absorber cannot reach at any stage count. */
export const UNREACHABLE_SPEC = 0.9;

/* ------------------------------------------------------------------ *
 * AGBADA. A dew point skid: gas let down across a choke into a cold
 * separator. Sections that read the Joule-Thomson chain are WITHHELD
 * from this digest pending FC4-0; these conditions stay here so the
 * fields file does not have to change when they are restored.
 * ------------------------------------------------------------------ */

export const AGBADA = { p1Psia: 1180, p2Psia: 640, tF: 96, gasSg: 0.68, cpBtuLbmolF: 9.8 };
export const AGBADA_P_SWEEP = [50, 200, 600, 1000, 1500, 2200];
export const AGBADA_CP_SWEEP = [8.5, 9.5, 10.5, 12];
export const AGBADA_STEP_SWEEP = [1, 2, 5, 10, 20, 50, 200];

/* ------------------------------------------------------------------ *
 * Probes that measure the module's own unexported constants. Every one
 * of these is a set of arguments chosen so that one constant is the only
 * thing left in the answer; the digest does the division, never a typist.
 * ------------------------------------------------------------------ */

/** btexLbDay = gas*1e6*(ppmv/1e6)/LBMOL_SCF * frac * mw. At one MMscfd,
 *  a million ppmv, a unit absorbed fraction and a unit molecular weight
 *  the answer is 1e6 over the scf in a lbmol and nothing else. */
export const LBMOL_PROBE = {
  gasMMscfd: 1, inletLbMMscf: 2, outletLbMMscf: 1,
  btexInletPpmv: 1e6, btexAbsorbedFrac: 1, btexMw: 1,
};

/** vaporPerGal = (1/ratio)*OVERHEAD*(1+reflux). At a ratio of one gallon
 *  per pound and no reflux the answer IS the overhead. */
export const OVERHEAD_PROBE = {
  gasMMscfd: 1, inletLbMMscf: 2, outletLbMMscf: 1,
  circulationGalPerLb: 1, refluxRatio: 0,
};

/** circGpd over circGpm is the minutes in a day, and the engine returns
 *  both, so the digest divides one of its own answers by another. */
export const MINUTES_PROBE = { gasMMscfd: 10, inletLbMMscf: 50, outletLbMMscf: 7 };

/** btexTonsYear over btexLbDay is the days in a year over the pounds in a
 *  short ton, as one measured group. */
export const TONS_PROBE = {
  gasMMscfd: 10, inletLbMMscf: 50, outletLbMMscf: 7,
  btexInletPpmv: 500, btexAbsorbedFrac: 0.15, btexMw: 92,
};

/** The contactor returns both the gas density it used and the velocity it
 *  allowed, and the velocity is the K value times the root of the density
 *  ratio, so the liquid density falls straight out of the two. */
export const RHO_L_PROBE = { gasMMscfd: 40, pPsia: 800, tF: 100, gasSg: 0.65, ksFtS: 0.5 };

/** The amine solution density basis: everything else in the gallons chain
 *  is either returned by the engine or exported by the amine table. */
export const AMINE_DENSITY_PROBE = {
  gasMMscfd: 50, co2MolPct: 3, amineId: 'MDEA', amineWtPct: 50,
  leanLoading: 0, richLoading: 0.5, dutyBtuPerGal: 1000,
};

/** The reboiler group: circGpd times the duty per gallon over the answer
 *  in MMBtu an hour is the hours in a day times the Btu in a MMBtu. */
export const REBOILER_GROUP_PROBE = { gasMMscfd: 25, inletLbMMscf: 60, outletLbMMscf: 5 };
