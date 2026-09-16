// THE FC4 CAPSTONE CONDITIONS. The IKOT ABASI dehydration train, the
// OTUMARA sour gas train and the ESCRAVOS dew point skid.
//
// Nothing here is imported by fc4_dump.mjs, and no rate, pressure,
// temperature, gravity, spec, ratio, strength, loading or duty is shared
// with the teaching fields in fc4_fields.mjs. Only the migration headers
// and the go-live may read the values this produces.
//
// NO GRADED FIELD DEPENDS ON A HELD-FOR-LITERATURE ITEM, and each held item
// is neutralised by construction rather than by looking anything up:
//   * the McKetta-Wehe real-gas correction is held, so IKOT ABASI sits BELOW
//     the pressure at which the engine warns, and its saturation answer is
//     inside the band the module stands behind;
//   * the water overhead the reboiler pays for is a typed constant with no
//     source, so NO graded field reads a reboiler duty on the Associate
//     capstone: the duty is taught and the SENSIBLE half, which is built
//     entirely from stated inputs, is what is graded;
//   * the amine contactor's liquid density is a typed constant that is the
//     wrong fluid for an amine, so NO graded field on the Professional
//     capstone reads a contactor diameter;
//   * the amine duty per gallon is a customary value, so OTUMARA STATES its
//     own 920 Btu per gallon rather than taking any table default;
//   * the BTEX absorbed fraction and molecular weight are operating values,
//     so both are STATED on every capstone that grades a BTEX figure;
//   * ESCRAVOS lets down from BELOW the pressure the engine warns at, so
//     neither of its two graded water contents leans on the held chart
//     correction either.

/* ------------------------------------------------------------------ *
 * Associate. IKOT ABASI, a TEG dehydration train on a gas gathering
 * station making pipeline spec.
 * ------------------------------------------------------------------ */

/** Contactor inlet conditions. Below the pressure the engine warns at, so
 *  the graded saturation figure is inside the stated band. */
export const IKOT_ABASI_LINE = { pPsia: 880, tF: 109 };

export const IKOT_ABASI = {
  gasMMscfd: 47,
  outletLbMMscf: 5,
  circulationGalPerLb: 3.6,
  leanTegWtPct: 99.4,
  absorberTF: 109,
  reboilerTF: 368,
  refluxRatio: 0.22,
  /** Stated operating values, so neither is a lookup. */
  btexInletPpmv: 155,
  btexAbsorbedFrac: 0.12,
  btexMw: 92,
  /** Stated, so the glycol's own properties are conditions of the problem. */
  cpTegBtuLbF: 0.55,
  tegLbPerGal: 9.3,
};

/* ------------------------------------------------------------------ *
 * Professional. OTUMARA, a sour gas train: an absorber that has to be
 * read as a staged device, and an amine unit that has to be read as a
 * mole balance.
 * ------------------------------------------------------------------ */

/** The absorber's own working point, stated from equilibrium data. */
export const OTUMARA_ABSORBER = { absorptionFactor: 1.85, stages: 5 };
/** The removal the contract spec demands of that absorber. */
export const OTUMARA_REQUIRED_REMOVAL = 0.94;

export const OTUMARA = {
  gasMMscfd: 71,
  co2MolPct: 6.4,
  h2sMolPct: 0.85,
  co2SpecMolPct: 2.5,
  h2sSpecMolPct: 0.0004,
  amineId: 'DEA',
  /** Every design choice stated, so no table default is graded. */
  amineWtPct: 33,
  leanLoading: 0.07,
  richLoading: 0.38,
  dutyBtuPerGal: 920,
};

/** The same train after the regenerator is retuned to a leaner lean, which
 *  widens the swing. The second circulation is the field that teaches what
 *  the swing is worth. */
export const OTUMARA_RETUNED_LEAN_LOADING = 0.03;

/* ------------------------------------------------------------------ *
 * Expert. ESCRAVOS, a dew point skid: gas let down across a choke into a
 * low temperature separator.
 *
 * FOUR OF THE SIX GRADED FIELDS READ THE JOULE-THOMSON CHAIN and will move
 * when FC4-0 lands. The generator is written; the Expert answer file is
 * NOT cut until the repair is vendored.
 * ------------------------------------------------------------------ */

export const ESCRAVOS = {
  p1Psia: 980, p2Psia: 430, tF: 91, gasSg: 0.69, cpBtuLbmolF: 10.4,
};
