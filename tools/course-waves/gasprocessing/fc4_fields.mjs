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

/** Lean glycol strengths across the band the engine accepts. Since FC4-0
 *  this input is not inert: it sets the water a gallon of lean solution
 *  already carries, and therefore the strength the rich glycol returns at.
 *  The outlet spec stays a TYPED design input and the engine says so. */
export const OBIAFU_LEAN_SWEEP = [90.5, 95, 98, 99, 99.2, 99.5, 99.9];
export const LEAN_AT_LOWER_EDGE = 90;
export const LEAN_JUST_INSIDE_LOWER = 90.000001;
export const LEAN_JUST_UNDER_UPPER = 99.999999;
export const LEAN_AT_UPPER_EDGE = 100;
/** A ratio low enough that the rich glycol comes back under 90 weight
 *  percent, which the engine flags because the loop is then carrying more
 *  water than a glycol loop is meant to. */
export const RATIO_THAT_FLOODS_THE_LOOP = 0.25;

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
 *  degF, because that is the door the engine takes. The upper edge is 60
 *  degC, which is where the module's own docstring always said the fit
 *  held; the guard now enforces it. */
export const FIT_LOW_EDGE_F = -49;
export const FIT_BELOW_LOW_EDGE_F = -49.000001;
export const FIT_HIGH_EDGE_F = 140;
export const FIT_ABOVE_HIGH_EDGE_F = 140.000001;

/** The narrower band the Magnus coefficients were PUBLISHED over, -40 to
 *  50 degC, inside which the engine attaches no extrapolation note. Both
 *  edges in degF: -40 degC is -40 degF and 50 degC is 122 degF. */
export const FIT_PUBLISHED_LOW_EDGE_F = -40;
export const FIT_PUBLISHED_HIGH_EDGE_F = 122;
export const FIT_PUBLISHED_JUST_OVER_F = 122.000001;

/** A gas temperature a user would plausibly type into the studio and that
 *  the engine now refuses BY NAME. This is a live behaviour change. */
export const GAS_ABOVE_FIT_F = 200;

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
/** Step counts for the march. Whole and positive since FC4-0, which is
 *  what the engine now requires. The last is the reference the others are
 *  measured against. */
export const AGBADA_STEP_SWEEP = [1, 2, 5, 10, 20, 50, 200];
export const AGBADA_STEP_REFERENCE = 20000;
export const AGBADA_STEPS_REFUSED = [0, -5, 0.4];
/** Gravities and temperatures at which the z-factor itself is refused, so
 *  the march dies and says where. Sutton's pressure correlation turns
 *  negative above a gravity of about 5.08. */
export const SG_SUTTON_BREAKS = 5.08;
export const SG_SUTTON_LAST_PHYSICAL = 5.07;
/** A let-down deep enough to show the arrival flattening out as the
 *  coefficient falls with pressure. It does NOT kill the march. */
export const AGBADA_DEEP_P2_PSIA = 60;
/** A COLD inlet, which is what actually walks the march off the
 *  correlation: the gas cools below the reduced temperature the
 *  compressibility correlation is valid at, part way down. */
export const AGBADA_COLD_INLET_F = 10;
export const AGBADA_COLD_P2_PSIA = 200;

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

/* ------------------------------------------------------------------ *
 * THE CONTRACT PROBES. One answering call and one refusing call for
 * EVERY callable export of the module, so the digest can state the
 * module's return contract by MEASURING it instead of asserting it.
 *
 * WHY THIS EXISTS. The digest used to say that every export answers
 * with an object and that every refusal puts a string on an `error`
 * key. That is true of the exports called with a named-argument object
 * and false of four scalar helpers, and three separate places in the
 * course had three different accounts of which and how many. Nothing
 * here declares the answer: each row names a call, and the SHAPE of
 * what comes back is read off the return value at build time. An
 * upstream engine change therefore moves the digest rather than
 * leaving a stale sentence standing.
 *
 * `arg` is the single argument the export takes, or a function of the
 * engine module where the argument is itself an engine value.
 * `caughtBy` names the export that CONSUMES a helper's no-answer, with
 * a function that builds that consumer's argument from the no-answer
 * value, so the digest can show where a NaN or a null becomes a named
 * refusal. A door has no `caughtBy`: a door's refusal is already named.
 * ------------------------------------------------------------------ */

/** A pressure above the DAK validity limit, so the z-factor door refuses. */
export const P_ABOVE_DAK_PSIA = 30000;

/** A solvent the amine table does not carry. */
export const AMINE_NOT_CARRIED = 'DIPA';

export const CONTRACT_PROBES = [
  {
    name: 'waterSatPsia',
    answer: OBIAFU_LINE.tF,
    refuse: GAS_ABOVE_FIT_F,
    caughtBy: 'saturatedWaterContent',
    caughtArgs: () => ({ pPsia: OBIAFU_LINE.pPsia, tF: GAS_ABOVE_FIT_F }),
  },
  {
    name: 'saturatedWaterContent',
    answer: OBIAFU_LINE,
    refuse: { pPsia: OBIAFU_LINE.pPsia, tF: GAS_ABOVE_FIT_F },
  },
  {
    name: 'kremserFractionRemoved',
    answer: { absorptionFactor: OBIAFU_ABSORPTION_FACTOR, stages: OBIAFU_STAGES },
    refuse: { absorptionFactor: 0, stages: OBIAFU_STAGES },
  },
  {
    name: 'kremserStagesFor',
    answer: { absorptionFactor: OBIAFU_ABSORPTION_FACTOR, fractionRemoved: UNREACHABLE_SPEC },
    refuse: { absorptionFactor: A_WELL_UNDER_UNITY, fractionRemoved: UNREACHABLE_SPEC },
  },
  {
    name: 'tegPackage',
    answer: { ...OBIAFU, inletLbMMscf: SATURATION_T[3] },
    refuse: { ...OBIAFU, inletLbMMscf: SATURATION_T[3], circulationGalPerLb: -RATIO_AT_LOWER_CUSTOM },
  },
  {
    name: 'amineOf',
    answer: UBIE.amineId,
    refuse: AMINE_NOT_CARRIED,
    caughtBy: 'aminePackage',
    caughtArgs: () => ({ ...UBIE, amineId: AMINE_NOT_CARRIED }),
  },
  {
    name: 'solutionLbPerFt3',
    answer: (G) => G.amineOf(UBIE.amineId).sgSolution,
    refuse: undefined,
    caughtBy: 'contactorDiameter',
    caughtArgs: (noAnswer) => ({
      gasMMscfd: UBIE.gasMMscfd, ...UBIE_CONTACTOR, rhoLLbFt3: noAnswer,
    }),
  },
  {
    name: 'amineSolutionLbPerFt3',
    answer: UBIE.amineId,
    refuse: AMINE_NOT_CARRIED,
    caughtBy: 'contactorDiameter',
    caughtArgs: (noAnswer) => ({
      gasMMscfd: UBIE.gasMMscfd, ...UBIE_CONTACTOR, rhoLLbFt3: noAnswer,
    }),
  },
  {
    name: 'aminePackage',
    answer: UBIE,
    refuse: { ...UBIE, amineId: AMINE_NOT_CARRIED },
  },
  {
    name: 'zAtState',
    answer: { pPsia: OBIAFU_LINE.pPsia, tF: OBIAFU_LINE.tF, gasSg: OBIAFU_CONTACTOR.gasSg },
    refuse: { pPsia: P_ABOVE_DAK_PSIA, tF: OBIAFU_LINE.tF, gasSg: OBIAFU_CONTACTOR.gasSg },
  },
  {
    name: 'contactorDiameter',
    answer: { gasMMscfd: UBIE.gasMMscfd, ...UBIE_CONTACTOR },
    refuse: { gasMMscfd: UBIE.gasMMscfd, ...UBIE_CONTACTOR, ksFtS: 0 },
  },
  {
    name: 'jouleThomsonFPerPsi',
    answer: {
      pPsia: AGBADA.p1Psia, tF: AGBADA.tF, gasSg: AGBADA.gasSg,
      cpBtuLbmolF: AGBADA.cpBtuLbmolF,
    },
    refuse: {
      pPsia: 0, tF: AGBADA.tF, gasSg: AGBADA.gasSg,
      cpBtuLbmolF: AGBADA.cpBtuLbmolF,
    },
  },
  {
    name: 'jtDrop',
    answer: AGBADA,
    refuse: { ...AGBADA, steps: AGBADA_STEPS_REFUSED[0] },
  },
];

/**
 * Is this export called with a NAMED-ARGUMENT OBJECT? Read off the
 * function's OWN SOURCE rather than declared in a list here, so a
 * signature change upstream moves the census instead of leaving a stale
 * count standing. gate_claims.mjs runs a negative control on it and
 * fails if it ever puts every callable export in one bucket.
 */
export const takesNamedArguments = (fn) => /^\(?\s*\{/.test(String(fn).trim());

/** What a return value IS, read off the value. No probe knows in advance. */
export const returnShape = (v) => {
  if (v === null) return 'null';
  if (typeof v === 'number') return Number.isNaN(v) ? 'a bare NaN' : 'a bare number';
  if (Array.isArray(v)) return 'an array';
  if (typeof v === 'object') {
    return (typeof v.error === 'string')
      ? 'an object with a named string on an `error` key'
      : 'an object of named results';
  }
  return typeof v;
};

/**
 * THE CONTRACT CENSUS. Enumerates every export of the module, splits the
 * callable ones by how they are called, runs both probes against each and
 * reads the shape off what came back. Every count and every shape word in
 * the digest's contract block comes from here.
 */
export const contractCensus = (G) => {
  const names = Object.keys(G).sort();
  const callable = names.filter((n) => typeof G[n] === 'function');
  const values = names.filter((n) => typeof G[n] !== 'function');
  const rows = CONTRACT_PROBES.map((p) => {
    const fn = G[p.name];
    const arg = (a) => (typeof a === 'function' ? a(G) : a);
    const answered = fn(arg(p.answer));
    const refused = fn(arg(p.refuse));
    const row = {
      name: p.name,
      door: takesNamedArguments(fn),
      answers: returnShape(answered),
      refuses: returnShape(refused),
      caughtBy: p.caughtBy || null,
      caughtShape: null,
      caughtMessage: null,
    };
    if (p.caughtBy) {
      const caught = G[p.caughtBy](p.caughtArgs(refused));
      row.caughtShape = returnShape(caught);
      row.caughtMessage = caught && caught.error ? caught.error : null;
    }
    return row;
  });
  return {
    names, callable, values, rows,
    doors: rows.filter((r) => r.door),
    helpers: rows.filter((r) => !r.door),
  };
};
