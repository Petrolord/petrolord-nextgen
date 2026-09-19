// THE CRUDE CAPSTONE GENERATOR. Runs the three capstone records through the
// vendored engines and writes the eighteen graded fields, six a tier, with
// their tolerances, plus the draft capstone prompts.
//
// Nothing here is read by crude_dump.mjs and nothing here is quoted into a
// lesson. The digest and the capstone are two separate roads, and
// gate_capstone_leak.py sweeps both directions to keep it that way.
//
// EVERY GRADED FIELD IS A RETURN VALUE OF THE ENGINE. None is arithmetic
// performed here, with one exception stated where it happens: a mass share is
// the engine's massFraction multiplied by 100 so the learner can type a
// percent. oracle_check.py reproduces all eighteen with the vendored Python
// oracles, called on these same records.
//
// TOLERANCES, ONE RULE. The digest prints every non-integer figure to FOUR
// decimals (its preamble says so), and every graded field is a non-integer
// figure, so every field is graded at half a unit in that fourth place:
// 5e-5. That is the tightest band gradeprecision.py allows for a four-decimal
// class and it accepts a correctly rounded four-decimal reading of the
// engine's value, whatever the magnitude (a total cost near 872,000 dollars is
// read to the hundredth of a cent, a psi to the ten-thousandth). It is wide
// against the engines' own error: the LP's objective and the oracle's exact
// rational optimum agree to about 1e-9 relative, and the envelope-theorem
// relief agrees with the oracle's exact re-solve to about 1e-8. It is narrow
// against every wrong route discriminate.mjs models: the closest miss is
// reported there in multiples of this tolerance.
export const DECIMALS = 4;
// Written as 5 / 10^(DECIMALS + 1): 0.5 * 10 ** -4 is 4.9999999999999996e-5 in
// floating point, a hair tighter than the half-unit it is meant to be.
export const TOLERANCE = 5 / 10 ** (DECIMALS + 1);
//
// Usage: node crude_capstone.mjs [--json]
import fs from 'fs';
import * as K from './crude_fields_capstone.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-md-crude-nextgen/packages/engines';
const C = await import(`${ROOT}/engines/downstream/crudeAssay.js`);
const P = await import(`${ROOT}/engines/downstream/productBlending.js`);

/** Attach the engine's own RVP index conversions to a plain-data index spec. */
export const withIndex = (specs) => specs.map((s) => (s.basis === P.BLEND_BASIS.INDEX && s.id === 'rvp'
  ? { ...s, toIndex: (v) => P.rvpIndex(v), fromIndex: (i) => P.rvpFromIndex(i) } : s));

/* ---------------------------- IDAMA ---------------------------- */
const idama = C.blendCrudes(K.IDAMA_CRUDES.map((c) => ({ ...c, volumeFraction: K.IDAMA_BARRELS[c.id] })));
if (idama.error) throw new Error(`IDAMA blend refused: ${idama.error}`);
const idamaCut = C.cutYields({ curve: K.IDAMA_CRUDES.find((c) => c.id === K.IDAMA_CUT.crude).curve, cuts: [K.IDAMA_CUT.cut] });
const abhMass = idama.fractions.find((f) => f.id === 'abh').massFraction;

/* ---------------------------- OGBELE --------------------------- */
const ogShares = K.OGBELE_CRUDES.map((c) => K.OGBELE_SHARES[c.id]);
const ogBlend = C.blendCrudes(K.OGBELE_CRUDES.map((c, i) => ({ ...c, volumeFraction: ogShares[i] })));
const ogCurve = C.blendDistillationCurves(K.OGBELE_CRUDES, ogBlend.fractions.map((f) => f.volumeFraction));
const ogYields = C.cutYields({ curve: ogCurve, cuts: K.OGBELE_CUTS });
const ogY = (id) => ogYields.cuts.find((c) => c.id === id).yieldVolPercent;
const ogNet = C.netbackValue({ cuts: ogYields.cuts, ...K.OGBELE_VALUATION });
if (!ogYields.closes || !ogNet.complete || ogNet.assumedZero.length) throw new Error('OGBELE valuation is not complete');

/* ----------------------------- ONNE ---------------------------- */
const onne = P.optimiseBlend({ components: K.ONNE_POOL, specs: withIndex(K.ONNE_SPECS), targetVolume: K.ONNE_TARGET });
if (onne.status !== 'optimal') throw new Error(`ONNE is ${onne.status}`);
const vol = (id) => onne.recipe.find((r) => r.id === id).volume;
const relief = (name) => onne.shadowPrices.find((s) => s.name === name).price;

export const FIELDS = [
  ['beginner', 'idama_blend_api', idama.properties.api],
  ['beginner', 'idama_blend_sulfur_wtpct', idama.properties.sulfurWtPct],
  ['beginner', 'idama_blend_vanadium_ppm', idama.properties.vanadiumPpm],
  ['beginner', 'idama_abiteye_mass_share_pct', 100 * abhMass],
  ['beginner', 'idama_blend_cii', idama.stability.cii],
  ['beginner', 'idama_opuama_kerosene_yield_pct', idamaCut.cuts[0].yieldVolPercent],
  ['intermediate', 'ogbele_blend_t50_f', C.temperatureAtVolumePercent(ogCurve, 50)],
  ['intermediate', 'ogbele_blend_kerosene_yield_pct', ogY('kerosene')],
  ['intermediate', 'ogbele_blend_diesel_yield_pct', ogY('diesel')],
  ['intermediate', 'ogbele_gross_value_per_bbl', ogNet.grossValue],
  ['intermediate', 'ogbele_loss_value_per_bbl', ogNet.lossValue],
  ['intermediate', 'ogbele_netback_per_bbl', ogNet.netback],
  ['advanced', 'onne_total_cost_usd', onne.totalCost],
  ['advanced', 'onne_fcc_volume_bbl', vol('fcc')],
  ['advanced', 'onne_butane_volume_bbl', vol('but')],
  ['advanced', 'onne_sulfur_relief_usd_per_ppm', relief('Sulfur maximum')],
  ['advanced', 'onne_rvp_relief_usd_per_psi', relief('RVP maximum')],
  ['advanced', 'onne_ron_relief_usd_per_octane', relief('RON minimum')],
].map(([tier, key, value]) => [tier, key, value, TOLERANCE]);

for (const [tier, key, v] of FIELDS) {
  if (!Number.isFinite(v)) throw new Error(`${tier}.${key} is ${v}, which is not a number the engine returned`);
  if (!K.FIELD_SOURCES[key]) throw new Error(`${key} has no FIELD_SOURCES row`);
}
if (FIELDS.length !== 18 || new Set(FIELDS.map((f) => f[1])).size !== 18) throw new Error('eighteen distinct graded keys expected');
for (const t of ['beginner', 'intermediate', 'advanced']) {
  if (FIELDS.filter((f) => f[0] === t).length !== 6) throw new Error(`${t} does not grade six fields`);
}
// Every relief graded is on a specification the engine calls binding, and
// every volume graded sits strictly inside its bounds or at a stated one.
for (const n of ['Sulfur', 'RVP', 'RON']) {
  if (!onne.bindingSpecs.includes(n)) throw new Error(`ONNE: ${n} is not binding, so its relief is not a graded price`);
}

/* ------------------------- the prompts ------------------------- */
// DRAFT PROMPTS. They state every condition a field needs and nothing that
// hands over an answer: gate_promptleak.py refuses any prompt that carries a
// graded value, or any intermediate the engine derives on the way to one.
const f = (v) => String(v);
const curveText = (c) => c.curve.map((p) => `${f(p.volumePercent)} percent at ${f(p.temperatureF)} F`).join(', ');
const idamaText = K.IDAMA_CRUDES.map((c) => `${c.name}: ${f(K.IDAMA_BARRELS[c.id])} bbl, API ${f(c.api)}, sulfur ${f(c.sulfurWtPct)} wt%, vanadium ${f(c.vanadiumPpm)} ppm, nickel ${f(c.nickelPpm)} ppm, TAN ${f(c.tanMgKohG)} mg KOH/g, viscosity ${f(c.viscosityCSt)} cSt, SARA saturates ${f(c.sara.saturates)}, aromatics ${f(c.sara.aromatics)}, resins ${f(c.sara.resins)}, asphaltenes ${f(c.sara.asphaltenes)} wt%, TBP curve ${curveText(c)}.`).join(' ');
const ogText = K.OGBELE_CRUDES.map((c) => `${c.name}: ${f(K.OGBELE_SHARES[c.id])} percent of the blend by volume, API ${f(c.api)}, TBP curve ${curveText(c)}.`).join(' ');
const cutText = K.OGBELE_CUTS.map((c) => `${c.name} ${c.fromF === null ? 'up to' : `${f(c.fromF)} F to`} ${c.toF === null ? 'the end of the curve' : `${f(c.toF)} F`}, priced at ${f(K.OGBELE_VALUATION.prices[c.id])} dollars per bbl`).join('; ');
const poolText = K.ONNE_POOL.map((c) => `${c.name}: ${f(c.cost)} dollars per bbl, SG ${f(c.sg)} (density ${f(c.density)} kg/l), RON ${f(c.ron)}, MON ${f(c.mon)}, sulfur ${f(c.sulfurPpm)} ppm by mass, RVP ${f(c.rvp)} psi, ${c.maxVolume === 0 ? 'tank typed as 0 bbl available' : `up to ${f(c.maxVolume)} bbl available`}.`).join(' ');
const specText = K.ONNE_SPECS.map((s) => `${s.name} ${s.min !== undefined && s.max !== undefined ? `between ${f(s.min)} and ${f(s.max)}` : s.min !== undefined ? `at least ${f(s.min)}` : `at most ${f(s.max)}`}${s.unit ? ` ${s.unit}` : ''} (${s.basis === 'mass' ? 'blends on mass' : s.basis === 'index' ? 'blends through the RVP index' : 'blends on volume'})`).join('; ');
export const PROMPTS = {
  beginner: `IDAMA EXPORT TERMINAL. Three field streams are commingled into one cargo. Every figure is invented and illustrative. ${idamaText} Give six numbers, each to four decimals. (1) The API gravity of the cargo. (2) Its sulfur content in wt%. (3) Its vanadium content in ppm. (4) Abiteye Heavy's share of the cargo by mass, in percent. (5) The cargo's colloidal instability index. (6) The yield of the Kerosene / Jet cut, 350 F to 500 F, from Opuama Medium alone, in volume percent of that crude.`,
  intermediate: `OGBELE MODULAR REFINERY. The refinery is offered a blend of two crudes. Every figure is invented and illustrative. ${ogText} The refinery's cut set and product prices: ${cutText}. Processing costs ${f(K.OGBELE_VALUATION.processingCostPerBbl)} dollars per bbl of crude, freight to the refinery ${f(K.OGBELE_VALUATION.freightPerBbl)} dollars per bbl, and losses are ${f(K.OGBELE_VALUATION.lossPercent)} percent, taken on the product side. Give six numbers, each to four decimals. (1) The temperature at which the blend's own TBP curve reaches 50 percent, in F. (2) The blend's Kerosene / DPK yield, in volume percent. (3) The blend's Diesel / AGO yield, in volume percent. (4) The gross product value per bbl of blend. (5) The value lost to losses per bbl of blend. (6) The netback per bbl of blend.`,
  advanced: `ONNE BLENDING TERMINAL. A ${f(K.ONNE_TARGET)} bbl PMS cargo is to be blended at least cost. Every figure is invented and illustrative. The components: ${poolText} The buyer's specification: ${specText}. Give six numbers, each to four decimals. (1) The least total cost of the cargo, in dollars. (2) The barrels of FCC gasoline in the least-cost recipe. (3) The barrels of butane in it. (4) The value of relief on the sulfur limit at the least-cost recipe, as a shadow price: the cost saved per ppm the limit is relaxed, at the margin, in dollars per ppm. (5) The same for the RVP limit, in dollars per psi. (6) The same for the RON minimum, in dollars per octane number.`,
};

/* --------------------------- write ----------------------------- */
const fieldsOut = process.env.MD_FIELDS_OUT || `${HERE}fields.json`;
const precOut = process.env.MD_PRECISION_OUT || `${HERE}precision.json`;
const capOut = process.env.MD_CAPSTONE_OUT || `${HERE}capstone.json`;
const isMain = process.argv[1] && new URL(import.meta.url).pathname === fs.realpathSync(process.argv[1]);
if (isMain && process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(FIELDS.map(([tier, key, value, tol]) => ({ tier, key, value, tol })))}\n`);
} else if (isMain) {
  fs.writeFileSync(fieldsOut, `${JSON.stringify(FIELDS, null, 1)}\n`);
  const cls = (re) => `^(?:${FIELDS.map((x) => x[1]).filter((k) => re.test(k)).join('|')})$`;
  const classes = {
    api: /_api$/, wtpct: /_wtpct$/, ppm: /_vanadium_ppm$/, pct: /_pct$/, cii: /_cii$/, degF: /_f$/,
    usdPerBbl: /_per_bbl$/, usd: /_usd$/, bbl: /_volume_bbl$/, usdPerUnit: /_usd_per_(ppm|psi|octane)$/,
  };
  const prec = Object.fromEntries(Object.entries(classes).map(([k, re]) => [k, { decimals: DECIMALS, match: cls(re) }]));
  const covered = FIELDS.filter(([, key]) => Object.values(classes).filter((re) => re.test(key)).length === 1).length;
  if (covered !== 18) throw new Error(`precision classes cover ${covered} of 18 keys exactly once`);
  fs.writeFileSync(precOut, `${JSON.stringify(prec, null, 1)}\n`);
  fs.writeFileSync(capOut, `${JSON.stringify({
    tiers: Object.fromEntries(['beginner', 'intermediate', 'advanced'].map((t) => [t, {
      record: { beginner: 'IDAMA', intermediate: 'OGBELE', advanced: 'ONNE' }[t],
      prompt: PROMPTS[t],
      fields: FIELDS.filter((x) => x[0] === t).map(([, key, , tol]) => ({ key, source: K.FIELD_SOURCES[key], tol })),
    }])),
  }, null, 1)}\n`);
  for (const [t, k, v] of FIELDS) process.stdout.write(`${t.padEnd(13)} ${k.padEnd(36)} ${v.toFixed(DECIMALS).padStart(16)}   (${v})\n`);
}
