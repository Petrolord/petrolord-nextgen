// FC5 relief: THE CAPSTONE CONDITIONS. Three plants, eighteen graded fields.
//
// THIS FILE IS THE GRADED HALF AND NOTHING ELSE. Nothing in the digest
// generator imports it, nothing in fc5_fields.mjs imports it, and no lesson
// writer reads it. gate_capstone_leak.py checks both directions.
//
// KOLO CREEK is an Associate gas plant with three relief cases on one train.
// OGBAINBIRI is a Professional flow station: a horizontal vessel in a pool
// fire, a knockout tower standing beside it, and the flare knockout drum at
// the end of the header. GBARAN is an Expert compression station: one vessel
// depressuring through a fixed orifice, and the flare it discharges to.
//
// NOT ONE CONDITION BELOW IS A GOLDEN ROW. Checked mechanically against all
// eleven blocks and fifty-one rows of relief_cases.json, and against the six
// teaching streams in fc5_fields.mjs, by gate_capstone_leak.py.
//
// EVERY HELD-FOR-LITERATURE ITEM IS NEUTRALISED BY CONSTRUCTION, not by a
// lookup. The construction is stated per field in HELD_CLEARANCE below and
// re-asserted by the generator at build time. Do not move a number here
// without re-running fc5_capstone.mjs and reading its assertion block.

/* ------------------------------------------------------------------ *
 * Associate. KOLO CREEK, a gas plant. One vessel, three fluids, and the
 * branch the back pressure decides.
 *
 * Every certified coefficient is STATED as the vendor's own figure, so no
 * graded number here rests on a chart this package cannot derive. The
 * valve is CONVENTIONAL, so Kb is 1.0 by the standard rather than by a
 * chart read, and the critical case's back pressure is far below the
 * ratio at which a balanced-bellows chart would be needed at all.
 * ------------------------------------------------------------------ */

export const KOLO_CREEK_GAS = {
  wLbHr: 37500, setPsig: 385, overpressurePct: 10, backPsia: 55,
  tF: 165, mw: 23.5, z: 0.89, k: 1.31,
  kd: 0.975, kb: 1.0, kc: 1.0,
};

// The SAME relief load and the SAME valve against a header that is already
// pressured. Above the critical ratio the engine uses F2 and IGNORES Kb
// entirely, which is why this field is clear of the bellows chart by
// construction rather than by choice.
export const KOLO_CREEK_GAS_SUBCRITICAL = { ...KOLO_CREEK_GAS, backPsia: 330 };

// INVISCID on purpose: with no viscosity the Kv loop never runs, Kv is
// exactly 1.0, the returned Reynolds number is null, and not one of the
// fit's four constants enters the answer.
export const KOLO_CREEK_LIQUID = {
  qGpm: 640, setPsig: 295, overpressurePct: 10, backPsig: 65,
  sg: 0.79, muCp: 0,
  kd: 0.65, kw: 1.0, kc: 1.0,
};

// SATURATED steam well below the pressure at which the Napier correction
// becomes active, so KN is exactly 1.0 and the graded area is the 51.5
// route at unit correction. KSH is the published superheat TABLE and is
// stated at its saturated value.
export const KOLO_CREEK_STEAM = {
  wLbHr: 78000, setPsig: 585, overpressurePct: 10,
  kd: 0.975, kb: 1.0, kc: 1.0, ksh: 1.0,
};

/* ------------------------------------------------------------------ *
 * Professional. OGBAINBIRI, a flow station.
 *
 * The fire DUTY is never graded here: 21000, 34500 and the 0.82 exponent
 * are held for literature. The GEOMETRY the duty stands on is graded, and
 * both vessels are short enough that the 25 ft wetted-height truncation
 * cannot bite, which is asserted rather than assumed.
 *
 * The drum states its own DESIGN DROPOUT VELOCITY and its own ACTUAL
 * vapour rate, the way the published drum cases do, so no graded drum
 * number reads the sphere-drag correlation or a standard-condition base.
 * ------------------------------------------------------------------ */

export const OGBAINBIRI_VESSEL = {
  orientation: 'horizontal', diameterFt: 9.5, lengthFt: 37, liquidLevelFt: 3.4,
};

export const OGBAINBIRI_TOWER = {
  orientation: 'vertical', diameterFt: 7.2, lengthFt: 32, liquidLevelFt: 14.5,
};

export const OGBAINBIRI_DRUM = {
  qVaporAcfs: 168.0, udFtS: 2.05, diameterFt: 8.5, liquidFraction: 0.35,
};

// The design move when the first diameter runs long: go wider at the same
// duty and the same droplet.
export const OGBAINBIRI_DRUM_WIDER = { ...OGBAINBIRI_DRUM, diameterFt: 10.5 };

/* ------------------------------------------------------------------ *
 * Expert. GBARAN, a compression station.
 *
 * The blowdown march is solved IN CLOSED FORM by the validation oracle, so
 * the time, the isentropic exponent and the absence of any hidden
 * coefficient are all checked. The end pressure sits far above the
 * pressure at which the march's choked assumption stops holding, and the
 * generator asserts the warning is null, so no graded number here is
 * qualified by a model caveat.
 *
 * The flare states its heat release in kW directly, so no graded radiation
 * number carries a lower heating value or a unit conversion, and it states
 * its own PROJECT ALLOWABLE, which is deliberately not one of the four
 * customary API 521 levels: those four values travel with wording this
 * package holds for literature and a merged sibling course already teaches.
 * ------------------------------------------------------------------ */

export const GBARAN_BLOWDOWN = {
  volumeFt3: 640, p0Psia: 1185, t0R: 555, pEndPsia: 165,
  mw: 21.5, k: 1.26, z: 0.87,
  orificeDIn: 1.375, cd: 0.84, dtS: 0.1, pBackPsia: 16.5,
};

export const GBARAN_FLARE = {
  qKw: 742000, distanceM: 118, fractionRadiated: 0.27, transmissivity: 0.91,
  projectAllowableKwM2: 5.25,
};

/* ------------------------------------------------------------------ *
 * WHICH HELD ITEM EACH GRADED FIELD IS CLEAR OF, AND HOW.
 *
 * The nine held items, from the FC5-0 findings record's own table of what
 * the validation oracle does NOT cover:
 *
 *   H1  the Kv fit's 0.9935, 2.878, 342.75 and its 1.5 exponent
 *   H2  the sphere-drag correlation 24/Re + 3/sqrt(Re) + 0.34, and its 240
 *       low-Reynolds cap
 *   H3  the API 526 orifice table, checked as behaviour and never derived
 *   H4  the Kb, Kw and KSH charts and tables
 *   H5  the RADIATION_LEVELS labels and their four customary values
 *   H6  the pool-fire 21000, 34500 and the 0.82 exponent
 *   H7  the 1500 psia Napier threshold and the 3200 psia published limit
 *   H8  z held constant through a blowdown, and choked flow throughout
 *   H9  the 25 ft wetted-height limit, which is the caller's truncation
 *
 * Every entry below is an ASSERTION the generator runs, not a claim.
 * ------------------------------------------------------------------ */

export const HELD_CLEARANCE = {
  kolocreek_critical_pressure_ratio:
    'H1 H2 H3 H4 H5 H6 H7 H8 H9 all clear: the ratio is a function of k alone and the oracle finds it as the ARGMAX of the nozzle flux by golden-section search, so no table, chart, fit or model decision enters it.',
  kolocreek_gas_coefficient_c:
    'H1 H2 H3 H4 H5 H6 H7 H8 H9 all clear: C is a function of k alone and the oracle derives the 520 from the isentropic nozzle mass flux in absolute SI.',
  kolocreek_gas_critical_area_in2:
    'H4 clear because the valve is CONVENTIONAL and Kb is 1.0 by the standard, with the back pressure asserted below the ratio at which a bellows chart would be needed; Kd and Kc are stated vendor figures. H3 clear because the graded value is the required AREA and no orifice letter or margin is graded anywhere in this wave. H1 H2 H5 H6 H7 H9 are not on this route at all. H8 is a blowdown decision.',
  kolocreek_gas_subcritical_area_in2:
    'H4 clear BY CONSTRUCTION: above the critical ratio the engine uses F2 and ignores Kb, and the generator asserts the engine says so. The 735 and F2 itself are both derived by the oracle from the subcritical nozzle flux. H1 H2 H3 H5 H6 H7 H9 are not on this route; H8 is a blowdown decision.',
  kolocreek_liquid_area_in2:
    'H1 clear BY CONSTRUCTION: the viscosity is zero, so liquidKv is never called, Kv is exactly 1.0 and the returned Reynolds number is null, all three asserted. H4 clear because Kw is 1.0 for a conventional valve and Kd and Kc are stated vendor figures. The 38 is derived against the published SI 11.78. H2 H3 H5 H6 H7 H8 H9 are not on this route.',
  kolocreek_steam_area_in2:
    'H7 clear in the arithmetic: the relieving pressure is far below the threshold, KN is exactly 1.0 (asserted), and the graded value contains no Napier coefficient. H4 clear because KSH is stated at its saturated 1.0 and Kb is 1.0 for a conventional valve. The 51.5 is derived against the published SI 190.4. H1 H2 H3 H5 H6 H8 H9 are not on this route.',
  ogbainbiri_wetted_area_ft2:
    'H6 clear because no fire DUTY is graded in this wave: this is the geometry the duty stands on. H9 clear because the wetted height cannot exceed the diameter, which is under 25 ft, asserted. The exact circular segment is derived by the oracle by polyline summation round the real circle with Richardson extrapolation. H1 H2 H3 H4 H5 H7 H8 not on this route.',
  ogbainbiri_tower_wetted_area_ft2:
    'H6 and H9 clear as above, with the wetted height asserted under 25 ft directly. The VERTICAL branch has its own derived oracle route. H1 H2 H3 H4 H5 H7 H8 not on this route.',
  ogbainbiri_liquid_area_fraction:
    'H1 H2 H3 H4 H5 H6 H7 H8 H9 all clear: the liquid area fraction of a circle filled to a depth fraction is pure geometry, and the oracle derives it by Simpson quadrature of the segment area integral.',
  ogbainbiri_vapor_velocity_fts:
    'H2 clear BY CONSTRUCTION: the drum states its design dropout velocity, so the sphere-drag correlation and its 240 cap never run. The vapour rate is stated in actual cubic feet a second, so no standard-condition base and no gas density enter it. H1 H3 H4 H5 H6 H7 H8 H9 not on this route.',
  ogbainbiri_drum_length_ft:
    'H2 clear by the same construction as the vapour velocity. The length is a transit time against a fall time and the oracle derives both in SI. H1 H3 H4 H5 H6 H7 H8 H9 not on this route.',
  ogbainbiri_drum_length_wider_ft:
    'H2 clear by the same construction. Same stated rate and stated dropout velocity at a larger diameter. H1 H3 H4 H5 H6 H7 H8 H9 not on this route.',
  gbaran_initial_mass_lb:
    'H8 clear for the inventory specifically: the start state is the stated pressure, temperature, volume and compressibility, and holding z constant along the PATH cannot reach a quantity evaluated at the start. H1 H2 H3 H4 H5 H6 H7 H9 not on this route.',
  gbaran_blowdown_time_s:
    'H8 clear on the choked half: the end pressure is asserted far above the pressure below which the march stops being choked, and the engine own warning is asserted null. z constant is the model this route IS, and the oracle solves that same march in CLOSED FORM in SI, so the time, the isentropic exponent and the absence of a hidden discharge coefficient are all checked rather than restated. H1 H2 H3 H4 H5 H6 H7 H9 not on this route.',
  gbaran_final_temperature_degr:
    'H8 clear on the same two grounds, with the isentropic exponent checked by the closed form. H1 H2 H3 H4 H5 H6 H7 H9 not on this route.',
  gbaran_choked_floor_psia:
    'H8 clear because this IS the model limit stated as a number: the back pressure over the critical ratio, and the critical ratio is derived by the oracle as the argmax of the nozzle flux. H1 H2 H3 H4 H5 H6 H7 H9 not on this route.',
  gbaran_radiant_intensity_kwm2:
    'H5 clear BY CONSTRUCTION: no allowable is read, the heat release is stated in kW and the radiated fraction and transmissivity are stated project figures. The 4 pi is derived by the oracle as the sphere area by quadrature of R^2 sin(theta). H1 H2 H3 H4 H6 H7 H8 H9 not on this route.',
  gbaran_setback_distance_m:
    'H5 clear BY CONSTRUCTION: the allowable is a STATED PROJECT DESIGN BASIS and the generator asserts it is not any of the four customary RADIATION_LEVELS values, so no held label and no held value enters the answer. The inverse is derived by the oracle by bisection on the same quadrature, rather than against the engine own forward call. H1 H2 H3 H4 H6 H7 H8 H9 not on this route.',
};
