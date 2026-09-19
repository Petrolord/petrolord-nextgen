// THE CRUDE TEACHING DIGEST GENERATOR. Every figure, basis word and refusal in
// digest.txt is printed by this file straight out of the vendored engines
// (engines/downstream/crudeAssay.js, engines/downstream/productBlending.js,
// lib/lp/simplex.js) called on the teaching cases in crude_fields.mjs. Nothing
// is typed: a computed figure is the engine's return formatted to four
// decimals, an input is printed as the case file types it, and a refusal is the
// engine's own sentence.
//
// THREE GUARDS BUILT INTO THE GENERATOR, so a digest that breaks one of them
// cannot be written at all:
//
//   THE VERDICT LABELS. refused() asserts the engine refused (an error string
//   or a non-optimal status) and prints its own sentence; a row cannot be
//   labelled a refusal when the engine answered.
//
//   THE CLAIM ASSERTIONS. Wherever a sentence characterises figures ("binding",
//   "the same", "unstable", "closes"), the generator asserts that the engine
//   says so before it prints the sentence, and throws otherwise. A relationship
//   between two figures is printed only as a third computed figure.
//
//   THE SECTION OWNERS. Each section's owning tier and module comes from ONE
//   table, SECTION_OWNERS, checked against structure.py's module keys at build
//   time, never typed into a heading.
//
// THE CLOCK. None of the three engine files reads a clock (no Date, no
// performance, no random), and gate_clock.sh proves the digest does not move
// when the machine clock does. There is no as-of date in this course.
//
// Usage: node crude_dump.mjs   (build_digest.sh pins TZ)
import fs from 'fs';
import * as F from './crude_fields.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const ROOT = process.env.MD_ENGINES || '/root/wt-md-crude-nextgen/packages/engines';
const C = await import(`${ROOT}/engines/downstream/crudeAssay.js`);
const P = await import(`${ROOT}/engines/downstream/productBlending.js`);
const S = await import(`${ROOT}/lib/lp/simplex.js`);

/* ------------------------------------------------------------------ *
 * Output, verdicts and formatting.
 * ------------------------------------------------------------------ */
const L = [];
const out = (s = '') => L.push(s);
const DEC = 4;
/** A computed figure, to four decimals, with a negative zero printed as zero. */
const fx = (v) => {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`fx: ${v} is not a finite number`);
  const s = v.toFixed(DEC);
  return /^-0\.0+$/.test(s) ? s.slice(1) : s;
};
/**
 * A printed DIFFERENCE is the difference of the two PRINTED figures (each
 * rounded to four decimals first), so a reader subtracting the printed
 * figures gets exactly the printed difference.
 */
const r4 = (v) => Number(fx(v));
const dfx = (a, b) => fx(r4(a) - r4(b));
/** A figure the engine may decline to give: its own absence word, never a number. */
const fxOr = (v, word) => (v === null || v === undefined ? word : fx(v));
/** An input, as the case file types it. */
const inp = (v) => String(v);
let refusedCount = 0;
const refused = (r, where) => {
  const msg = r && (r.error || r.reason);
  if (!r || !msg || (r.status && r.status === 'optimal')) {
    throw new Error(`VERDICT LABEL: ${where} was expected to be REFUSED with a sentence, and the engine said ${JSON.stringify(r)}`);
  }
  refusedCount += 1;
  return `REFUSED: ${msg}`;
};
const verdictWord = (s) => (s === true ? 'true' : s === false ? 'false' : 'no verdict');
const claim = (cond, what) => { if (!cond) throw new Error(`CLAIM: ${what} is false on the engine's own output`); };
const row = (...cells) => out(`| ${cells.join(' | ')} |`);
const head = (...cells) => { row(...cells); row(...cells.map(() => '---')); };

/* ------------------------------------------------------------------ *
 * THE SECTION OWNERS, one table, checked against structure.py.
 * ------------------------------------------------------------------ */
const SECTION_OWNERS = {
  1: [['beginner', 'm01']], 2: [['beginner', 'm01']], 3: [['beginner', 'm01'], ['beginner', 'm06']],
  4: [['beginner', 'm02']], 5: [['beginner', 'm02']], 6: [['beginner', 'm02']], 7: [['beginner', 'm02']],
  8: [['beginner', 'm03']], 9: [['beginner', 'm04']], 10: [['beginner', 'm04']], 11: [['beginner', 'm05']],
  12: [['beginner', 'm06']],
  13: [['intermediate', 'm01']], 14: [['intermediate', 'm02']], 15: [['intermediate', 'm03']],
  16: [['intermediate', 'm04']], 17: [['intermediate', 'm05']], 18: [['intermediate', 'm06']],
  19: [['advanced', 'm01']], 20: [['advanced', 'm02']], 21: [['advanced', 'm03']], 22: [['advanced', 'm03']],
  23: [['advanced', 'm04']], 24: [['advanced', 'm02'], ['advanced', 'm04']], 25: [['advanced', 'm05']],
  26: [['advanced', 'm06']], 27: [['advanced', 'm06']],
};
const TIER_WORD = { beginner: 'Associate', intermediate: 'Professional', advanced: 'Expert' };
const structureKeys = (() => {
  const src = fs.readFileSync(`${HERE}structure.py`, 'utf8');
  const keys = new Set(); let tier = null;
  for (const line of src.split('\n')) {
    const t = /^ '(beginner|intermediate|advanced)': \[/.exec(line);
    if (t) tier = t[1];
    const m = /^  \('(m\d\d)-/.exec(line);
    if (m && tier) keys.add(`${tier}:${m[1]}`);
  }
  return keys;
})();
if (structureKeys.size !== 18) throw new Error(`SECTION OWNERS: structure.py yielded ${structureKeys.size} module keys, expected 18`);
let sectionNo = 0;
const section = (title) => {
  sectionNo += 1;
  const own = SECTION_OWNERS[sectionNo];
  if (!own) throw new Error(`SECTION OWNERS: section ${sectionNo} has no owner row`);
  for (const [t, m] of own) {
    if (!structureKeys.has(`${t}:${m}`)) throw new Error(`SECTION OWNERS: section ${sectionNo} names ${t} ${m}, which structure.py does not declare`);
  }
  const tiers = [...new Set(own.map(([t]) => t))];
  const owners = tiers.map((t) => `${TIER_WORD[t]} ${own.filter(([x]) => x === t).map(([, m]) => m).join(' and ')}`).join(' and ');
  out('');
  out(`# SECTION ${sectionNo}: ${title} (owned by ${owners})`);
  out('');
};

const byId = (rows) => Object.fromEntries(rows.map((r) => [r.id, r]));
const withIndex = (specs) => specs.map((s) => (s.basis === P.BLEND_BASIS.INDEX && s.id === 'rvp' && !s.toIndex
  ? { ...s, toIndex: (v) => P.rvpIndex(v), fromIndex: (i) => P.rvpFromIndex(i) } : s));
const lib = byId([...F.OBIGBO_LIBRARY, F.EBOCHA_PARTIAL]);

/* ================================================================== */
out('# crude: Crude Assay & Blending. Teaching digest.');
out('# PRECISION: every computed figure prints to four decimals (API, specific gravity, wt%, ppm, cSt, index values, volume percent, degrees F, Watson K, CII, dollars, dollars per bbl, barrels, dollars per unit of a property, row prices). Every input prints exactly as it is typed, in crude_fields.mjs for a case or beside the question in crude_dump.mjs for a probe. Counts print as whole numbers.');
out('# ENGINES: engines/downstream/crudeAssay.js, engines/downstream/productBlending.js and lib/lp/simplex.js at petrolord-engines 60ee266, vendored in NextGen under packages/engines.');
out('# CASES: OBIGBO (a crude library at a Rivers State export terminal and its export blend), KWALE (a Delta State modular refinery valuing a blend on its own cut set), APAPA (a Lagos blending terminal making a PMS cargo and an AGO cargo), and beside them the two live apps\' own opening examples. EVERY CRUDE, STREAM, PRICE AND SPECIFICATION IN THIS DIGEST IS INVENTED AND ILLUSTRATIVE: no figure is a published assay, a market price or a regulation for any real grade or product. Place names are real places; the records are not.');
out('# NO CLOCK: nothing in scope reads a date or a clock, and the digest is the same bytes in every time zone and at every machine date.');
out('# Built by build_digest.sh from crude_dump.mjs and crude_fields.mjs. Never edited by hand.');

/* ------------------------------------------------------------------ */
section('WHAT THE TWO MODULES AND THE KERNEL EXPORT');
out('The Crude Assay & Blending Studio calls crudeAssay. The Product Blending Optimizer calls productBlending, which calls the LP kernel solveLP in lib/lp/simplex and imports the gravity and viscosity rules from crudeAssay rather than restating them. The counts below are measured from the modules themselves.');
out('');
head('module', 'exported functions', 'exported constants and tables');
for (const [name, mod] of [['crudeAssay', C], ['productBlending', P], ['lib/lp/simplex', S]]) {
  const fns = Object.entries(mod).filter(([, v]) => typeof v === 'function').map(([k]) => k);
  const other = Object.entries(mod).filter(([, v]) => typeof v !== 'function').map(([k]) => k);
  row(name, `${fns.length} (${fns.join(', ')})`, `${other.length} (${other.join(', ')})`);
}
out('');
out('Four questions the studio answers, each with the function that answers it:');
head('question', 'function');
row('what does this barrel turn into', 'cutYields, on a crude\'s curve or on blendDistillationCurves');
row('what happens to the properties when two crudes mix', 'blendCrudes');
row('will the mixture drop asphaltenes in the tank', 'screenBlendStability (inside blendCrudes)');
row('what is it worth against the crude already bought', 'netbackValue, with its marker differential');
out('');
out('One question the optimizer answers: the least-cost recipe that meets every specification (optimiseBlend), with which specifications bind, what each binding one is costing, and the quality handed over on the rest.');

/* ------------------------------------------------------------------ */
section('GRAVITY: API AND SPECIFIC GRAVITY');
out('sgFromApi is the definition SG = A / (API + B); apiFromSg is its inverse, API = A / SG - B. API is a hyperbola in specific gravity: equal steps of specific gravity are unequal steps of API. The two constants, read back from apiFromSg itself rather than typed:');
out('');
const apiA = C.apiFromSg(0.5) - C.apiFromSg(1);
const apiB = apiA - C.apiFromSg(1);
head('constant', 'how the engine gives it', 'value');
row('A', 'apiFromSg(0.5) minus apiFromSg(1)', fx(apiA));
row('B', 'A minus apiFromSg(1)', fx(apiB));
out('');
head('API (input)', 'sgFromApi', 'apiFromSg(sgFromApi) round trip');
for (const api of [10, 17.2, 20, 25.9, 30, 36.8, 40, 54.6]) row(inp(api), fx(C.sgFromApi(api)), fx(C.apiFromSg(C.sgFromApi(api))));
out('');
out('Equal steps of specific gravity, and the API each one is:');
head('SG (input)', 'apiFromSg', 'API step from the row above');
let prevApi = null;
for (const sg of [0.75, 0.8, 0.85, 0.9, 0.95, 1.0]) {
  const a = C.apiFromSg(sg);
  row(inp(sg), fx(a), prevApi === null ? 'first row' : dfx(a, prevApi));
  prevApi = a;
}
claim(C.apiFromSg(1.0) === 10, 'water is 10 API');
out('');
out(`Water (SG 1) is ${fx(C.apiFromSg(1))} API by the definition.`);

/* ------------------------------------------------------------------ */
section('THE OBIGBO LIBRARY');
out('Four invented field streams at an invented Rivers State export terminal, and one partial assay. Every figure is illustrative. Specific gravity is computed from API by sgFromApi.');
out('');
head('crude', 'API', 'SG (computed)', 'sulfur wt%', 'TAN mg KOH/g', 'nitrogen wt%', 'nickel ppm', 'vanadium ppm', 'viscosity cSt');
for (const c of F.OBIGBO_LIBRARY) {
  row(c.name, inp(c.api), fx(C.sgFromApi(c.api)), inp(c.sulfurWtPct), inp(c.tanMgKohG), inp(c.nitrogenWtPct), inp(c.nickelPpm), inp(c.vanadiumPpm), inp(c.viscosityCSt));
}
row(F.EBOCHA_PARTIAL.name, inp(F.EBOCHA_PARTIAL.api), fx(C.sgFromApi(F.EBOCHA_PARTIAL.api)), inp(F.EBOCHA_PARTIAL.sulfurWtPct), 'not given', 'not given', 'not given', 'not given', 'not given');
out('');
out('SARA analyses, wt%:');
head('crude', 'saturates', 'aromatics', 'resins', 'asphaltenes');
for (const c of F.OBIGBO_LIBRARY) row(c.name, inp(c.sara.saturates), inp(c.sara.aromatics), inp(c.sara.resins), inp(c.sara.asphaltenes));
out('');
out('TBP distillation curves, volume percent distilled at each temperature (F):');
head('crude', 'points (volume percent at F)');
for (const c of [...F.OBIGBO_LIBRARY, F.EBOCHA_PARTIAL]) row(c.name, c.curve.map((p) => `${inp(p.volumePercent)} at ${inp(p.temperatureF)}`).join('; '));

/* ------------------------------------------------------------------ */
section('DENSITY BLENDS ON VOLUME, AND API GOES THROUGH SPECIFIC GRAVITY');
out('blendCrudes blends specific gravity on volume (mass is conserved and volume is taken as conserved) and converts the blended specific gravity back to API. API itself is never averaged. The column "volume-weighted mean of the API numbers" is the shortcut the engine refuses to take, computed here with the engine\'s own blendOnVolume so it can be read beside the right answer.');
out('');
const apiRow = (label, comps) => {
  const b = C.blendCrudes(comps);
  const naive = C.blendOnVolume(comps.map((c) => c.api), b.fractions.map((f) => f.volumeFraction));
  const onMass = C.blendOnMass(comps.map((c) => c.api), b.fractions.map((f) => f.massFraction));
  claim(Math.abs(b.properties.api - onMass) < 1e-9 && Math.abs(b.properties.api - naive) > 1e-6, `${label}: API equals its mass-weighted mean and differs from its volume-weighted mean`);
  row(label, fx(b.properties.sg), fx(b.properties.api), fx(naive), dfx(b.properties.api, naive), fx(onMass), dfx(b.properties.api, onMass));
  return b;
};
head('blend (by volume)', 'blend SG', 'blend API', 'volume-weighted mean of the API numbers', 'blend API minus that mean', 'mass-weighted mean of the API numbers', 'blend API minus the mass-weighted mean');
apiRow('A 20 API crude and a 40 API crude, 50 and 50', F.API_PAIR.map((c) => ({ ...c, volumeFraction: 50 })));
apiRow('Obigbo Light and Egbema Medium, 65 and 35', [{ ...lib.obl, volumeFraction: 65 }, { ...lib.egm, volumeFraction: 35 }]);
apiRow('Asarama Heavy and Ubie Condensate, 50 and 50', [{ ...lib.ash, volumeFraction: 50 }, { ...lib.ubc, volumeFraction: 50 }]);
apiRow('Obigbo Light, Egbema Medium and Asarama Heavy, 50, 30 and 20', [{ ...lib.obl, volumeFraction: 50 }, { ...lib.egm, volumeFraction: 30 }, { ...lib.ash, volumeFraction: 20 }]);
out('');
out('API = A / SG - B, and 1 / SG is proportional to the volume one unit of mass takes up, which is what blends linearly on MASS. So the mass-weighted mean of the API numbers is the blend API (the last column prints the difference), and the volume-weighted mean is not.');
out('');
out(`The engine names its basis for API: "${C.blendCrudes([{ ...lib.obl, volumeFraction: 1 }]).bases.api}".`);

/* ------------------------------------------------------------------ */
section('VOLUME SHARES BECOME MASS SHARES');
out('A cargo is measured in barrels and half the properties blend on mass, so blendCrudes converts once (resolveFractions): each crude\'s mass share is its volume share times its specific gravity, over the sum of those products. A crude denser than the blend carries more of the mass than of the volume, and a crude lighter than the blend carries less.');
out('');
const obShares = F.OBIGBO_BLEND_SHARES;
const obComps = F.OBIGBO_LIBRARY.filter((c) => obShares[c.id] !== undefined).map((c) => ({ ...c, volumeFraction: obShares[c.id] }));
const obBlend = C.blendCrudes(obComps);
head('blend', 'crude', 'share typed', 'volume fraction', 'SG', 'mass fraction', 'mass fraction minus volume fraction');
for (const f of obBlend.fractions) {
  const c = lib[f.id];
  row('Obigbo export blend', c.name, inp(obShares[c.id]), fx(f.volumeFraction), fx(C.sgFromApi(c.api)), fx(f.massFraction), dfx(f.massFraction, f.volumeFraction));
}
const threeComps = [{ ...lib.obl, volumeFraction: 50 }, { ...lib.egm, volumeFraction: 30 }, { ...lib.ash, volumeFraction: 20 }];
const three = C.blendCrudes(threeComps);
for (const [bl, cs] of [[obBlend, obComps], [three, threeComps]]) {
  bl.fractions.forEach((f, i) => claim(Math.sign(f.massFraction - f.volumeFraction) === Math.sign(C.sgFromApi(cs[i].api) - bl.properties.sg), `${f.name}: denser than the blend gains mass share`));
}
for (const f of three.fractions) {
  const c = lib[f.id];
  row('three crudes, 50, 30 and 20 by volume', c.name, inp(threeComps.find((x) => x.id === c.id).volumeFraction), fx(f.volumeFraction), fx(C.sgFromApi(c.api)), fx(f.massFraction), dfx(f.massFraction, f.volumeFraction));
}
out('');
out('The same three crudes given BY MASS instead (every crude a massFraction, none a volumeFraction), 50, 30 and 20 by mass:');
const byMass = C.blendCrudes([{ ...lib.obl, massFraction: 50 }, { ...lib.egm, massFraction: 30 }, { ...lib.ash, massFraction: 20 }]);
head('crude', 'mass share typed', 'volume fraction', 'mass fraction');
[50, 30, 20].forEach((m, i) => row(byMass.fractions[i].name, inp(m), fx(byMass.fractions[i].volumeFraction), fx(byMass.fractions[i].massFraction)));
out(`Blend API given by mass: ${fx(byMass.properties.api)}. Blend API given by volume at 50, 30 and 20: ${fx(three.properties.api)}.`);
out('');
out('The same two blends side by side, the blend SG and sulfur beside the API:');
head('three crudes, 50, 30 and 20', 'blend SG', 'blend API', 'blend sulfur wt%');
row('by volume', fx(three.properties.sg), fx(three.properties.api), fx(three.properties.sulfurWtPct));
row('by mass', fx(byMass.properties.sg), fx(byMass.properties.api), fx(byMass.properties.sulfurWtPct));

/* ------------------------------------------------------------------ */
section('SULFUR AND THE OTHER PER-MASS PROPERTIES BLEND ON MASS');
out('Sulfur, TAN, nitrogen, nickel and vanadium are per unit mass, so blendCrudes weights them by mass fraction. The column "on volume" is the same property weighted by volume fraction with the engine\'s own blendOnVolume, printed only to be read against the right answer; the engine never reports it.');
out('');
const massKeys = [['sulfurWtPct', 'sulfur wt%'], ['tanMgKohG', 'TAN mg KOH/g'], ['nitrogenWtPct', 'nitrogen wt%'], ['nickelPpm', 'nickel ppm'], ['vanadiumPpm', 'vanadium ppm']];
const massTable = (label, comps, b) => {
  for (const [k, name] of massKeys) {
    const onVol = C.blendOnVolume(comps.map((c) => c[k]), b.fractions.map((f) => f.volumeFraction));
    row(label, name, fx(b.properties[k]), fx(onVol), dfx(b.properties[k], onVol), b.bases[k]);
  }
};
head('blend', 'property', 'on mass (the engine)', 'on volume (the shortcut)', 'mass minus volume', 'basis the engine names');
massTable('Obigbo export blend', obComps, obBlend);
massTable('three crudes, 50, 30 and 20 by volume', threeComps, three);

/* ------------------------------------------------------------------ */
section('A BLANK IS NOT A ZERO, AND WHAT THE BLEND REFUSES');
out('A property blends only when every crude in the blend carries it. A blank is absent, never a zero: the property comes back as no value, and the crude without it is named.');
out('');
const noSulfur = C.blendCrudes([{ ...lib.obl, volumeFraction: 65 }, { ...lib.egm, sulfurWtPct: '', volumeFraction: 35 }]);
claim(noSulfur.properties.sulfurWtPct === null, 'a blank sulfur is not blended');
head('blend', 'sulfur wt% returned', 'missing (named by the engine)', 'basis the engine names');
row('Obigbo export blend, both sulfurs given', fx(obBlend.properties.sulfurWtPct), 'nothing', obBlend.bases.sulfurWtPct);
row('Obigbo export blend, Egbema Medium\'s sulfur left blank', 'not blended', noSulfur.missing.sulfurWtPct.join(', '), noSulfur.bases.sulfurWtPct);
out('');
out('');
out('Only the blank property is not blended. Every other property of the same blend is formed as usual, and a sulfur TYPED as 0 is a real zero, blended like any other figure:');
const zeroSulfur = C.blendCrudes([{ ...lib.obl, volumeFraction: 65 }, { ...lib.egm, sulfurWtPct: 0, volumeFraction: 35 }]);
head('blend', 'SG', 'API', 'sulfur wt%', 'TAN mg KOH/g', 'vanadium ppm', 'viscosity cSt');
row('Obigbo export blend, both sulfurs given', fx(obBlend.properties.sg), fx(obBlend.properties.api), fx(obBlend.properties.sulfurWtPct), fx(obBlend.properties.tanMgKohG), fx(obBlend.properties.vanadiumPpm), fx(obBlend.properties.viscosityCSt));
row('Egbema Medium\'s sulfur left blank', fx(noSulfur.properties.sg), fx(noSulfur.properties.api), 'not blended', fx(noSulfur.properties.tanMgKohG), fx(noSulfur.properties.vanadiumPpm), fx(noSulfur.properties.viscosityCSt));
row('Egbema Medium\'s sulfur typed as 0', fx(zeroSulfur.properties.sg), fx(zeroSulfur.properties.api), fx(zeroSulfur.properties.sulfurWtPct), fx(zeroSulfur.properties.tanMgKohG), fx(zeroSulfur.properties.vanadiumPpm), fx(zeroSulfur.properties.viscosityCSt));
out(`The typed 0 is blended on ${zeroSulfur.bases.sulfurWtPct}, and nothing is named missing (${Object.keys(zeroSulfur.missing).length} properties listed).`);
out('');
out('Viscosity is the same: a blank viscosity leaves the blend without one.');
const noVisc = C.blendCrudes([{ ...lib.obl, volumeFraction: 65 }, { ...lib.egm, viscosityCSt: undefined, volumeFraction: 35 }]);
claim(noVisc.properties.viscosityCSt === null, 'a blank viscosity is not blended');
out(`With Egbema Medium's viscosity blank: viscosity not blended; basis "${noVisc.bases.viscosityCSt}".`);
out('');
out('What blendCrudes refuses, each in its own words:');
head('what was asked', 'what the engine returned');
row('an empty list', refused(C.blendCrudes([]), 'empty blend'));
row('Egbema Medium with no API and no specific gravity', refused(C.blendCrudes([{ ...lib.obl, volumeFraction: 65 }, { ...lib.egm, api: undefined, volumeFraction: 35 }]), 'no gravity'));
row('one crude by volume, the other by mass', refused(C.blendCrudes([{ ...lib.obl, volumeFraction: 65 }, { ...lib.egm, massFraction: 35 }]), 'mixed basis'));
row('one crude with a share, the other with none', refused(C.blendCrudes([{ ...lib.obl, massFraction: 65 }, { ...lib.egm }]), 'no share'));
row('a share of -10', refused(C.blendCrudes([{ ...lib.obl, volumeFraction: 110 }, { ...lib.egm, volumeFraction: -10 }]), 'negative share'));
row('shares of 0 and 0', refused(C.blendCrudes([{ ...lib.obl, volumeFraction: 0 }, { ...lib.egm, volumeFraction: 0 }]), 'zero shares'));
out('');
out('The shares need not add to 100: they are normalised. 65 and 35, 13 and 7, and 650000 and 350000 barrels are the same blend:');
head('shares typed', 'blend API', 'blend sulfur wt%');
for (const [a, b] of [[65, 35], [13, 7], [650000, 350000]]) {
  const r = C.blendCrudes([{ ...lib.obl, volumeFraction: a }, { ...lib.egm, volumeFraction: b }]);
  row(`${inp(a)} and ${inp(b)}`, fx(r.properties.api), fx(r.properties.sulfurWtPct));
}

/* ------------------------------------------------------------------ */
section('VISCOSITY THROUGH THE REFUTAS INDEX');
const refB = C.viscosityBlendIndex(Math.E - 0.8);
const refA = C.viscosityBlendIndex(Math.exp(Math.E) - 0.8) - refB;
out('Viscosity mixes nowhere near linearly, so it is blended through an index: VBI = A x ln(ln(nu + 0.8)) + B, nu in cSt (viscosityBlendIndex). The index is blended by the engine on MASS fraction, the classic Refutas form, and inverted (viscosityFromBlendIndex). ASTM D7152 blends the same family of index on VOLUME; the two disagree, and which basis to use is a HELD decision (FINDINGS C12). The engine names its basis in the result.');
out('');
head('crude', 'viscosity cSt', 'Refutas index (viscosityBlendIndex)', 'viscosityFromBlendIndex of that index');
for (const c of F.OBIGBO_LIBRARY) {
  const i = C.viscosityBlendIndex(c.viscosityCSt);
  row(c.name, inp(c.viscosityCSt), fx(i), fx(C.viscosityFromBlendIndex(i)));
}
out('');
const viscRow = (label, comps) => {
  const b = C.blendCrudes(comps);
  const vol = b.fractions.map((f) => f.volumeFraction);
  const mass = b.fractions.map((f) => f.massFraction);
  const onVolIndex = C.blendViscosity(comps.map((c) => c.viscosityCSt), vol);
  const linear = C.blendOnMass(comps.map((c) => c.viscosityCSt), mass);
  row(label, fx(b.properties.viscosityCSt), fx(onVolIndex), dfx(b.properties.viscosityCSt, onVolIndex), fx(linear));
  return b;
};
head('blend (by volume)', 'blend viscosity cSt, index on mass (the engine)', 'index on volume fractions instead', 'mass basis minus volume basis', 'cSt averaged linearly on mass (no index)');
viscRow('Obigbo export blend, 65 and 35', obComps);
viscRow('Asarama Heavy and Ubie Condensate, 50 and 50', [{ ...lib.ash, volumeFraction: 50 }, { ...lib.ubc, volumeFraction: 50 }]);
viscRow('Egbema Medium and Asarama Heavy, 50 and 50', [{ ...lib.egm, volumeFraction: 50 }, { ...lib.ash, volumeFraction: 50 }]);
out('');
out('The engine\'s blend viscosity against the linear average of the cSt figures, the difference printed:');
head('blend (by volume)', 'blend viscosity cSt (the engine)', 'cSt averaged linearly on mass', 'linear average minus the engine');
for (const [label, comps] of [['Obigbo export blend, 65 and 35', obComps], ['Asarama Heavy and Ubie Condensate, 50 and 50', [{ ...lib.ash, volumeFraction: 50 }, { ...lib.ubc, volumeFraction: 50 }]], ['Egbema Medium and Asarama Heavy, 50 and 50', [{ ...lib.egm, volumeFraction: 50 }, { ...lib.ash, volumeFraction: 50 }]]]) {
  const b = C.blendCrudes(comps);
  const linear = C.blendOnMass(comps.map((c) => c.viscosityCSt), b.fractions.map((f) => f.massFraction));
  row(label, fx(b.properties.viscosityCSt), fx(linear), dfx(linear, b.properties.viscosityCSt));
}
out('');
out(`The engine names its basis: "${obBlend.bases.viscosityCSt}".`);
out('');
out('The two constants, read back from viscosityBlendIndex itself: where ln(nu + 0.8) is e the double log is 1, and where ln(nu + 0.8) is 1 the double log is 0.');
head('constant', 'how the engine gives it', 'value');
row('B', 'viscosityBlendIndex(e - 0.8)', fx(refB));
row('A', 'viscosityBlendIndex(e^e - 0.8) minus B', fx(refA));
const floorNu = C.viscosityFromBlendIndex(-1e6);
row('the offset inside the double log', '1 minus viscosityFromBlendIndex of a very negative index', fx(1 - floorNu));
row('the lowest viscosity the index reaches', 'viscosityFromBlendIndex of a very negative index', fx(floorNu));
out('');
out('The index has a domain. ln(ln(nu + 0.8)) is undefined where ln(nu + 0.8) is zero or less, and the engine returns no index there rather than a number. Probed:');
head('viscosity cSt', 'viscosityBlendIndex returns');
for (const v of [0.1, 0.2, 0.2001, 1, 10, 100, 1000]) { const i = C.viscosityBlendIndex(v); row(inp(v), i === null ? 'no index (outside the domain)' : fx(i)); }
const bad = C.blendCrudes([{ ...lib.obl, volumeFraction: 65 }, { ...lib.egm, viscosityCSt: 0.15, volumeFraction: 35 }]);
claim(bad.properties.viscosityCSt === null, 'a viscosity outside the domain is not blended');
out(`A blend with one viscosity outside the domain is not blended; basis "${bad.bases.viscosityCSt}".`);

/* ------------------------------------------------------------------ */
section('THE TBP CURVE BETWEEN AND OUTSIDE ITS MEASURED POINTS');
out('volumePercentAt reads a TBP curve: the volume percent distilled at a temperature, linear between measured points. Outside the measured range the curve answers only where it says so itself: below a first point at 0 percent nothing has distilled, and above a last point at 100 percent everything has. Anywhere else outside the range the value is unknown. temperatureAtVolumePercent is the inverse: the temperature at which the curve reaches a volume percent, linear between points, unknown outside them.');
out('');
head('crude', 'temperature F', 'volumePercentAt');
for (const [id, temps] of [['obl', [60, 85, 300, 548, 600, 1380, 1500]], ['ebp', [60, 110, 240, 590, 920, 1000]]]) {
  for (const t of temps) row(lib[id].name, inp(t), fxOr(C.volumePercentAt(lib[id].curve, t), 'unknown'));
}
out('');
head('crude', 'volume percent', 'temperatureAtVolumePercent F');
for (const [id, vs] of [['obl', [0, 10, 25, 50, 95, 100]], ['ebp', [2, 4, 50, 80, 88, 95]]]) {
  for (const v of vs) row(lib[id].name, inp(v), fxOr(C.temperatureAtVolumePercent(lib[id].curve, v), 'unknown'));
}

/* ------------------------------------------------------------------ */
section('CUT YIELDS OF ONE CRUDE');
out('cutYields returns each cut\'s yield in volume percent of the whole crude: the curve at the cut\'s upper bound minus the curve at its lower bound. A first cut with no lower bound starts at 0 percent, nothing distilled, and a last cut with no upper bound runs to 100 percent: it takes everything not yet distilled at its lower bound. The total is reported as it computes, never normalised, and the set closes only when every cut has a yield and the total is within the engine\'s closing tolerance of 100 percent. The cut set here is the studio\'s default:');
out('');
head('cut', 'from F', 'to F');
for (const c of F.STUDIO_CUTS) row(c.name, c.fromF === null ? 'no lower bound (from 0 percent)' : inp(c.fromF), c.toF === null ? 'no upper bound (to 100 percent)' : inp(c.toF));
out('');
const yieldTable = (crudes, cuts) => {
  head('crude', ...cuts.map((c) => c.name), 'total', 'closes', 'cuts with no yield');
  for (const c of crudes) {
    const y = C.cutYields({ curve: c.curve, cuts });
    row(c.name, ...y.cuts.map((r) => fxOr(r.yieldVolPercent, 'unknown')), fx(y.totalVolPercent), String(y.closes), y.unknownCuts.length ? y.unknownCuts.join(', ') : 'nothing');
  }
};
yieldTable([...F.OBIGBO_LIBRARY, F.EBOCHA_PARTIAL], F.STUDIO_CUTS);
out('');
const ebY = C.cutYields({ curve: F.EBOCHA_PARTIAL.curve, cuts: F.STUDIO_CUTS });
claim(!ebY.closes && ebY.unknownCuts.length > 0, 'the partial assay does not close');
out(`The Ebocha partial assay starts at 4 percent and stops at 88, so ${ebY.unknownCuts.length} of its ${ebY.cuts.length} studio cuts have no yield, and its set does not close. Its known cuts total ${fx(ebY.totalVolPercent)} percent.`);
out('');
out('A cut set drawn inside the partial curve has every yield:');
const inside = [{ id: 'a', name: '110 to 370 F', fromF: 110, toF: 370 }, { id: 'b', name: '370 to 760 F', fromF: 370, toF: 760 }, { id: 'c', name: '760 to 920 F', fromF: 760, toF: 920 }];
yieldTable([F.EBOCHA_PARTIAL], inside);
out('');
const inv = C.cutYields({ curve: lib.obl.curve, cuts: [{ id: 'x', name: 'inverted, 500 to 350 F', fromF: 500, toF: 350 }] });
claim(inv.cuts[0].yieldVolPercent === null, 'an inverted cut has no yield');
out(`An inverted cut (from 500 F to 350 F) on Obigbo Light has no yield: the engine names it in unknownCuts (${inv.unknownCuts.join(', ')}).`);

/* ------------------------------------------------------------------ */
section('WILL THE BLEND STAY STABLE: THE COLLOIDAL INSTABILITY INDEX AND THE GRAVITY SCREEN');
out(`With a SARA analysis on every crude, screenBlendStability blends each SARA fraction on mass and forms CII = (saturates + asphaltenes) / (aromatics + resins). Saturates precipitate asphaltenes; aromatics and resins hold them. Three bands, three answers: below ${inp(C.CII_BANDS.STABLE)} stable (stable true), from ${inp(C.CII_BANDS.STABLE)} to below ${inp(C.CII_BANDS.UNSTABLE)} uncertain (the engine returns stable null and says spot test), at or above ${inp(C.CII_BANDS.UNSTABLE)} unstable (stable false). The bands are screening bands and are not a phase boundary.`);
out('');
head('crude alone', 'CII (colloidalInstabilityIndex)');
for (const c of F.OBIGBO_LIBRARY) row(c.name, fx(C.colloidalInstabilityIndex(c.sara)));
out('');
head('pair (by volume)', 'blended saturates', 'blended aromatics', 'blended resins', 'blended asphaltenes', 'CII', 'band', 'stable', 'CII from SARA blended on volume instead');
const pairRows = [];
for (const p of F.OBIGBO_STABILITY_PAIRS) {
  const comps = p.ids.map((id, i) => ({ ...lib[id], volumeFraction: p.shares[i] }));
  const b = C.blendCrudes(comps);
  const st = b.stability;
  claim(st.basis === 'cii', `${p.label} screens on the CII`);
  const vol = b.fractions.map((f) => f.volumeFraction);
  const saraVol = Object.fromEntries(['saturates', 'aromatics', 'resins', 'asphaltenes'].map((k) => [k, C.blendOnVolume(comps.map((c) => c.sara[k]), vol)]));
  row(`${p.label}, ${p.shares.join(' and ')}`, fx(st.blendedSara.saturates), fx(st.blendedSara.aromatics), fx(st.blendedSara.resins), fx(st.blendedSara.asphaltenes), fx(st.cii), st.band, verdictWord(st.stable), fx(C.colloidalInstabilityIndex(saraVol)));
  pairRows.push([p.label, st]);
}
claim(new Set(pairRows.map(([, s]) => s.band)).size === 3, 'the three pairs land in three bands');
out('');
out('The CII against the CII from SARA blended on volume, the difference printed:');
head('pair (by volume)', 'CII (SARA on mass, the engine)', 'CII from SARA on volume', 'volume reading minus the engine');
for (const p of F.OBIGBO_STABILITY_PAIRS) {
  const comps = p.ids.map((id, i) => ({ ...lib[id], volumeFraction: p.shares[i] }));
  const b = C.blendCrudes(comps);
  const vol = b.fractions.map((f) => f.volumeFraction);
  const cv = C.colloidalInstabilityIndex(Object.fromEntries(['saturates', 'aromatics', 'resins', 'asphaltenes'].map((k) => [k, C.blendOnVolume(comps.map((c) => c.sara[k]), vol)])));
  row(`${p.label}, ${p.shares.join(' and ')}`, fx(b.stability.cii), fx(cv), dfx(cv, b.stability.cii));
}
out('');
out('The engine\'s message for each band:');
head('pair', 'message');
for (const [label, st] of pairRows) row(label, st.message);
out('');
out('With no SARA, the screen falls back to a gravity-contrast rule of thumb: a wide spread of API with a light paraffinic crude in the blend is the combination that classically drops asphaltenes. The rule can raise a flag and it cannot clear one: when it does not flag, the engine returns stable null, never true. Its two thresholds are not exported, so the engine is asked about them directly, with two crudes of no SARA:');
out('');
head('probe', 'lighter crude API', 'heavier crude API', 'API contrast (the engine)', 'stable');
for (const [what, hi, lo] of [['contrast at its threshold', 40, 25], ['contrast just past it', 40, 24.99], ['contrast well past it', 40, 24],
  ['lighter crude at its threshold', 35, 19], ['lighter crude just past it', 35.01, 19], ['lighter crude well past it', 36, 19]]) {
  const st = C.screenBlendStability({ components: [{ name: 'light', api: hi }, { name: 'heavy', api: lo }], massFractions: [0.5, 0.5] });
  row(what, inp(hi), inp(lo), fx(st.contrast), verdictWord(st.stable));
}
out('A flag needs a contrast above the one threshold and a lighter crude above the other, both at once.');
const bisectFlag = (make) => { let lo = 0; let hi = 60; for (let i = 0; i < 200; i += 1) { const m = (lo + hi) / 2; if (make(m).stable === false) hi = m; else lo = m; } return hi; };
const contrastAt = bisectFlag((d) => C.screenBlendStability({ components: [{ name: 'light', api: 45 }, { name: 'heavy', api: 45 - d }], massFractions: [0.5, 0.5] }));
const lightAt = bisectFlag((a) => C.screenBlendStability({ components: [{ name: 'light', api: a }, { name: 'heavy', api: a - 25 }], massFractions: [0.5, 0.5] }));
out('The two thresholds, found by bisection on the engine itself (the smallest value that raises the flag, the other condition held well past its own threshold):');
head('threshold', 'value');
row('API contrast, lighter crude at 45 API', fx(contrastAt));
row('lighter crude API, contrast held at 25', fx(lightAt));
out('');
const noSara = (comps) => C.blendCrudes(comps.map(({ sara, ...rest }) => rest)).stability;
const flagged = noSara([{ ...lib.ash, volumeFraction: 50 }, { ...lib.ubc, volumeFraction: 50 }]);
const quiet = noSara([{ ...lib.obl, volumeFraction: 65 }, { ...lib.egm, volumeFraction: 35 }]);
const blind = C.screenBlendStability({ components: [{ name: 'x' }, { name: 'y', api: 30 }], massFractions: [0.5, 0.5] });
claim(flagged.stable === false && quiet.stable === null && blind.basis === 'none', 'the gravity screen flags, stays silent, or declines');
head('pair, no SARA supplied', 'basis', 'API contrast', 'stable', 'message');
row('Asarama Heavy and Ubie Condensate, 50 and 50', flagged.basis, fx(flagged.contrast), verdictWord(flagged.stable), flagged.message);
row('Obigbo export blend, 65 and 35', quiet.basis, fx(quiet.contrast), verdictWord(quiet.stable), quiet.message);
row('a crude with no API and no SG beside one of 30 API (screenBlendStability called on its own)', blind.basis, 'not formed', verdictWord(blind.stable), blind.message);
out('The last row calls screenBlendStability on its own, outside blendCrudes: blendCrudes refuses a crude with no gravity before any screen is made (SECTION 7).');
out('');
const partialSara = C.blendCrudes([{ ...lib.obl, volumeFraction: 65 }, { ...lib.egm, sara: undefined, volumeFraction: 35 }]).stability;
claim(partialSara.basis === 'api-contrast', 'partial SARA falls back to the gravity screen');
out('SARA on only some of the crudes is not enough for the index: the screen falls back to gravity, and its message says so.');
head('pair', 'basis', 'stable', 'message');
row('Obigbo export blend, SARA on Obigbo Light only', partialSara.basis, verdictWord(partialSara.stable), partialSara.message);

/* ------------------------------------------------------------------ */
section('THE OBIGBO EXPORT BLEND END TO END');
out('Obigbo Light and Egbema Medium, 65 and 35 by volume, as blendCrudes returns it, each property beside the basis the engine names:');
out('');
head('property', 'value', 'basis');
row('specific gravity', fx(obBlend.properties.sg), 'volume');
row('API', fx(obBlend.properties.api), obBlend.bases.api);
for (const [k, name] of massKeys) row(name, fx(obBlend.properties[k]), obBlend.bases[k]);
row('viscosity cSt', fx(obBlend.properties.viscosityCSt), obBlend.bases.viscosityCSt);
row('CII', fx(obBlend.stability.cii), `${obBlend.stability.basis}, band ${obBlend.stability.band}, stable ${verdictWord(obBlend.stability.stable)}`);
out('');
out(`With every SARA supplied, the export blend screens ${obBlend.stability.band} on the CII. With the SARA taken away, the gravity screen gives ${verdictWord(quiet.stable)} (SECTION 11): the rule of thumb did not raise its flag, and the index says ${obBlend.stability.band}.`);
out('');
const obCurve = C.blendDistillationCurves(obComps, obBlend.fractions.map((f) => f.volumeFraction));
const obYields = C.cutYields({ curve: obCurve, cuts: F.STUDIO_CUTS });
out('Its cut yields on the studio\'s default cuts, from the blend\'s own curve (the Professional tier explains that curve):');
head('cut', 'yield volume percent');
for (const r of obYields.cuts) row(r.name, fx(r.yieldVolPercent));
row('total', fx(obYields.totalVolPercent));
out(`Closes: ${obYields.closes}. Cuts with no yield: ${obYields.unknownCuts.length ? obYields.unknownCuts.join(', ') : 'nothing'}.`);

/* ------------------------------------------------------------------ */
section('THE BLEND\'S OWN CURVE');
out('Yields are additive on volume: at any temperature the blend has distilled the volume-weighted sum of what each crude has distilled. So blendDistillationCurves forms the blend\'s curve at every temperature any component measured, and never averages temperatures. A temperature at which some crude\'s curve says nothing is left out, because the blend\'s value there is not known either.');
out('');
out('KWALE: an invented modular (topping) refinery in Delta State is offered Kwale Light and Ughelli Medium, 55 and 45 by volume. Every figure is illustrative.');
out('');
head('crude', 'API', 'SG (computed)', 'sulfur wt%', 'TBP points (volume percent at F)');
for (const c of F.KWALE_CRUDES) row(c.name, inp(c.api), fx(C.sgFromApi(c.api)), inp(c.sulfurWtPct), c.curve.map((p) => `${inp(p.volumePercent)} at ${inp(p.temperatureF)}`).join('; '));
out('');
const kwComps = F.KWALE_CRUDES.map((c) => ({ ...c, volumeFraction: F.KWALE_SHARES[c.id] }));
const kwBlend = C.blendCrudes(kwComps);
const kwVol = kwBlend.fractions.map((f) => f.volumeFraction);
const kwCurve = C.blendDistillationCurves(kwComps, kwVol);
out(`Blend API ${fx(kwBlend.properties.api)}, SG ${fx(kwBlend.properties.sg)}, sulfur ${fx(kwBlend.properties.sulfurWtPct)} wt% (mass basis).`);
out('');
head('temperature F', 'Kwale Light volume percent', 'Ughelli Medium volume percent', 'blend volume percent (blendDistillationCurves)');
for (const p of kwCurve) row(inp(p.temperatureF), fx(C.volumePercentAt(F.KWALE_LIGHT.curve, p.temperatureF)), fx(C.volumePercentAt(F.UGHELLI_MEDIUM.curve, p.temperatureF)), fx(p.volumePercent));
out('');
const kwTemps = new Set(F.KWALE_CRUDES.flatMap((c) => c.curve.map((p) => p.temperatureF)));
claim(kwTemps.size === kwCurve.length, 'the Kwale blend curve carries every measured temperature');
out(`The blend's curve has ${kwCurve.length} points: every temperature either crude measured.`);
out('');
out('A partial assay in a blend: Kwale Light with the Ebocha partial assay, 50 and 50. The partial curve says nothing below 110 F or above 920 F, so the blend\'s curve keeps only the temperatures where both crudes are known:');
const kpComps = [{ ...F.KWALE_LIGHT, volumeFraction: 50 }, { ...F.EBOCHA_PARTIAL, volumeFraction: 50 }];
const kpBlend = C.blendCrudes(kpComps);
const kpCurve = C.blendDistillationCurves(kpComps, kpBlend.fractions.map((f) => f.volumeFraction));
const allTemps = new Set([...F.KWALE_LIGHT.curve, ...F.EBOCHA_PARTIAL.curve].map((p) => p.temperatureF));
head('temperature F', 'blend volume percent');
for (const p of kpCurve) row(inp(p.temperatureF), fx(p.volumePercent));
out(`Of ${allTemps.size} temperatures the two crudes measured between them, the blend's curve keeps ${kpCurve.length}.`);

/* ------------------------------------------------------------------ */
section('THE FIFTY PERCENT POINT AND THE WATSON FACTOR');
out('temperatureAtVolumePercent(curve, 50) reads the temperature at which the blend\'s own curve reaches 50 percent, interpolated between the curve\'s points. Three other readings are printed beside it to be read against it: the first point of the blend\'s curve at or past 50 percent (a grid reading), the volume-weighted mean of the crudes\' own 50 percent temperatures, and the mass-weighted mean of the same.');
out('');
const t50Rows = (label, comps, blend, crv) => {
  const t50 = C.temperatureAtVolumePercent(crv, 50);
  const grid = crv.find((p) => p.volumePercent >= 50).temperatureF;
  const each = comps.map((c) => C.temperatureAtVolumePercent(c.curve, 50));
  const volMean = C.blendOnVolume(each, blend.fractions.map((f) => f.volumeFraction));
  const massMean = C.blendOnMass(each, blend.fractions.map((f) => f.massFraction));
  row(label, fx(t50), inp(grid), fx(volMean), fx(massMean));
  return { t50, grid, volMean };
};
head('blend', 'T50 interpolated (the engine) F', 'first curve point at or past 50 percent F', 'volume-weighted mean of the crudes\' T50 F', 'mass-weighted mean of the crudes\' T50 F');
const kwT = t50Rows('Kwale Light and Ughelli Medium, 55 and 45', kwComps, kwBlend, kwCurve);
const stComps = F.STUDIO_PAIR;
const stBlend = C.blendCrudes(stComps);
const stCurve = C.blendDistillationCurves(stComps, stBlend.fractions.map((f) => f.volumeFraction));
const stT = t50Rows('the studio\'s default pair, 60 and 40 (what the app opens on)', stComps, stBlend, stCurve);
out('');
out('Each shortcut against the engine, the difference printed:');
head('blend', 'grid reading minus the engine F', 'volume-weighted mean minus the engine F', 'mass-weighted mean minus the engine F');
for (const [label, comps, blend, t] of [['Kwale Light and Ughelli Medium, 55 and 45', kwComps, kwBlend, kwT], ['the studio\'s default pair, 60 and 40', stComps, stBlend, stT]]) {
  const each = comps.map((c) => C.temperatureAtVolumePercent(c.curve, 50));
  const massMean = C.blendOnMass(each, blend.fractions.map((f) => f.massFraction));
  row(label, dfx(t.grid, t.t50), dfx(t.volMean, t.t50), dfx(massMean, t.t50));
}
out('');
out('Other points off the Kwale blend\'s curve:');
head('volume percent', 'temperature F');
for (const v of [10, 30, 50, 70, 90]) row(inp(v), fx(C.temperatureAtVolumePercent(kwCurve, v)));
out('');
const rankine = C.watsonK({ meanBoilingPointF: 0, sg: 1 }) ** 3;
out(`watsonK = Tb^(1/3) / SG with Tb in degrees Rankine, F plus an offset the engine gives itself: watsonK at 0 F and SG 1, cubed, is ${fx(rankine)}. The studio takes Tb as the blend\'s T50, a SCREENING basis: the strict basis is the mean average boiling point, which the studio does not compute, and the page labels K as the screening figure. That choice is a HELD item (FINDINGS C13), taught here as a stated limit.`);
out('');
head('blend', 'SG', 'Watson K at T50 interpolated', 'Watson K at the grid reading');
row('Kwale blend', fx(kwBlend.properties.sg), fx(C.watsonK({ meanBoilingPointF: kwT.t50, sg: kwBlend.properties.sg })), fx(C.watsonK({ meanBoilingPointF: kwT.grid, sg: kwBlend.properties.sg })));
row('the studio\'s default pair', fx(stBlend.properties.sg), fx(C.watsonK({ meanBoilingPointF: stT.t50, sg: stBlend.properties.sg })), fx(C.watsonK({ meanBoilingPointF: stT.grid, sg: stBlend.properties.sg })));
out('');
out(`watsonK declines a non-physical input: at -500 F it returns ${C.watsonK({ meanBoilingPointF: -500, sg: 0.85 }) === null ? 'no value' : 'a value'}, and at SG 0 it returns ${C.watsonK({ meanBoilingPointF: 600, sg: 0 }) === null ? 'no value' : 'a value'}.`);

/* ------------------------------------------------------------------ */
section('CUT YIELDS OF THE BLEND');
out('The Kwale refinery has no vacuum unit, so its cut set ends at atmospheric residue. It draws its own cut points:');
out('');
head('cut', 'from F', 'to F');
for (const c of F.KWALE_CUTS) row(c.name, c.fromF === null ? 'no lower bound (from 0 percent)' : inp(c.fromF), c.toF === null ? 'no upper bound (to 100 percent)' : inp(c.toF));
out('');
const kwY = C.cutYields({ curve: kwCurve, cuts: F.KWALE_CUTS });
const kwLightY = C.cutYields({ curve: F.KWALE_LIGHT.curve, cuts: F.KWALE_CUTS });
const kwMedY = C.cutYields({ curve: F.UGHELLI_MEDIUM.curve, cuts: F.KWALE_CUTS });
head('cut', 'Kwale Light', 'Ughelli Medium', 'the blend (cutYields on the blend\'s curve)', 'volume-weighted from the two crudes (blendOnVolume)', 'the two ways differ by', 'mass-weighted from the two crudes (blendOnMass)');
kwY.cuts.forEach((r, i) => {
  const each = [kwLightY.cuts[i].yieldVolPercent, kwMedY.cuts[i].yieldVolPercent];
  const v = C.blendOnVolume(each, kwVol);
  claim(Math.abs(r.yieldVolPercent - v) < 1e-9, `${r.name}: the blend yield equals the volume-weighted crude yields`);
  const m = C.blendOnMass(each, kwBlend.fractions.map((f) => f.massFraction));
  row(r.name, fx(each[0]), fx(each[1]), fx(r.yieldVolPercent), fx(v), dfx(r.yieldVolPercent, v), fx(m));
});
row('total', fx(kwLightY.totalVolPercent), fx(kwMedY.totalVolPercent), fx(kwY.totalVolPercent), 'not formed', 'not formed', 'not formed');
out(`Closes: ${kwY.closes}.`);
out('');
const kwY2 = C.cutYields({ curve: kwCurve, cuts: F.KWALE_CUTS_DEEPER_DIESEL });
claim(kwY.cuts.filter((r, i) => Math.abs(kwY2.cuts[i].yieldVolPercent - r.yieldVolPercent) > 1e-9).length === 2, 'moving one cut point changes exactly two cuts');
out('Moving a cut point moves barrels between two cuts and nowhere else. The diesel end point moved from 650 F to 700 F:');
head('cut', 'yield, diesel to 650 F', 'yield, diesel to 700 F', 'change');
kwY.cuts.forEach((r, i) => row(r.name, fx(r.yieldVolPercent), fx(kwY2.cuts[i].yieldVolPercent), dfx(kwY2.cuts[i].yieldVolPercent, r.yieldVolPercent)));
row('total', fx(kwY.totalVolPercent), fx(kwY2.totalVolPercent), dfx(kwY2.totalVolPercent, kwY.totalVolPercent));
out('');
out('The studio\'s default cuts on the same Kwale blend, for contrast (a vacuum refinery\'s cut set):');
const kwStudio = C.cutYields({ curve: kwCurve, cuts: F.STUDIO_CUTS });
head('cut', 'yield volume percent');
for (const r of kwStudio.cuts) row(r.name, fx(r.yieldVolPercent));
out('');
out('A cut the curve cannot answer. Kwale Light with the Ebocha partial assay, 50 and 50, on Kwale\'s cuts: the blend\'s curve starts at 110 F and stops at 920 F, so a cut with a bound below 110 F has no yield. The open-ended residue cut still has one: it runs from its lower bound to 100 percent, and its lower bound lies inside the curve.');
const kpY = C.cutYields({ curve: kpCurve, cuts: F.KWALE_CUTS });
head('cut', 'yield volume percent');
for (const r of kpY.cuts) row(r.name, fxOr(r.yieldVolPercent, 'unknown'));
out(`unknownCuts: ${kpY.unknownCuts.join(', ')}. Closes: ${kpY.closes}. The cuts with a yield total ${fx(kpY.totalVolPercent)} percent.`);
const kpNet = C.netbackValue({ cuts: kpY.cuts, prices: F.KWALE_VALUATION.prices, processingCostPerBbl: F.KWALE_VALUATION.processingCostPerBbl, freightPerBbl: F.KWALE_VALUATION.freightPerBbl, lossPercent: F.KWALE_VALUATION.lossPercent });
claim(kpNet.complete === false && kpNet.unyieldedCuts.length === kpY.unknownCuts.length, 'the partial blend netback is not complete');
out(`Valued on Kwale's prices, costs and losses, netbackValue names the cuts with no yield (unyieldedCuts: ${kpNet.unyieldedCuts.join(', ')}), keeps their yield and value empty, and reports the valuation complete: ${kpNet.complete}. Its netback over the cuts it can value is ${fx(kpNet.netback)} $/bbl.`);

/* ------------------------------------------------------------------ */
section('NETBACK: WHAT A BARREL OF CRUDE IS WORTH AT THE REFINERY');
out('netbackValue: netback = sum(cut yield fraction x cut product price) x (1 - loss percent / 100) - processing cost - freight, all per barrel of crude. Losses are a volume shrinkage on the product side, so they come off the product value before the costs. Every term is reported, never only the total.');
out('');
const kv = F.KWALE_VALUATION;
const kwNet = C.netbackValue({ cuts: kwY.cuts, prices: kv.prices, processingCostPerBbl: kv.processingCostPerBbl, freightPerBbl: kv.freightPerBbl, lossPercent: kv.lossPercent, marker: kv.marker });
head('cut', 'yield volume percent', 'price $/bbl of product', 'value $/bbl of crude');
for (const r of kwNet.rows) row(r.name, fx(r.yieldVolPercent), inp(r.pricePerBbl), fx(r.valuePerBblCrude));
out('');
head('term', '$/bbl of crude');
row('gross product value', fx(kwNet.grossValue));
row(`value lost to losses at ${inp(kv.lossPercent)} percent`, fx(kwNet.lossValue));
row('processing cost', fx(kwNet.processingCostPerBbl));
row('freight', fx(kwNet.freightPerBbl));
row('netback', fx(kwNet.netback));
out(`Complete: ${kwNet.complete}. Costs taken as zero because they were blank: ${kwNet.assumedZero.length ? kwNet.assumedZero.join(', ') : 'nothing'}.`);
out('');
out('Losses applied the wrong way, computed from the same terms for contrast:');
const lossAfter = (kwNet.grossValue - kv.processingCostPerBbl - kv.freightPerBbl) * (1 - kv.lossPercent / 100);
head('reading', 'netback $/bbl', 'minus the engine\'s netback');
row('losses on the product side, before the costs (the engine)', fx(kwNet.netback), fx(0));
row('losses taken off the netback after the costs', fx(lossAfter), dfx(lossAfter, kwNet.netback));
row('losses left out', fx(kwNet.grossValue - kv.processingCostPerBbl - kv.freightPerBbl), dfx(kwNet.grossValue - kv.processingCostPerBbl - kv.freightPerBbl, kwNet.netback));
out('');
out('A blank cost is taken as zero, because a netback with no freight is a legitimate question, and it is NAMED:');
const blankNet = C.netbackValue({ cuts: kwY.cuts, prices: kv.prices, processingCostPerBbl: kv.processingCostPerBbl, freightPerBbl: '', lossPercent: undefined });
head('asked', 'netback $/bbl', 'assumedZero (named by the engine)');
row('Kwale, freight and losses left blank', fx(blankNet.netback), blankNet.assumedZero.join(', '));
out(`Complete: ${blankNet.complete}. A blank cost is named and does not make the valuation incomplete; a missing price or a missing yield does.`);
out('');
out('A cut with no price contributes nothing and is named, and the valuation reports itself incomplete:');
const { residue, ...noResiduePrice } = kv.prices;
const unpriced = C.netbackValue({ cuts: kwY.cuts, prices: noResiduePrice, processingCostPerBbl: kv.processingCostPerBbl, freightPerBbl: kv.freightPerBbl, lossPercent: kv.lossPercent });
head('asked', 'gross $/bbl', 'netback $/bbl', 'unpricedCuts', 'complete');
row('Kwale with the residue price left blank', fx(unpriced.grossValue), fx(unpriced.netback), unpriced.unpricedCuts.join(', '), String(unpriced.complete));

/* ------------------------------------------------------------------ */
section('AGAINST THE MARKER');
out(`netbackValue takes a marker netback and reports the differential: this crude's netback minus the marker's. Kwale's marker is ${inp(kv.marker)} $/bbl.`);
out('');
out('Each crude alone is valued on the same Kwale cut set, product prices, processing cost, freight and losses as the blend.');
head('crude or blend', 'gross $/bbl', 'netback $/bbl', 'differential against the marker $/bbl');
const nb = (curveOf) => C.netbackValue({ cuts: C.cutYields({ curve: curveOf, cuts: F.KWALE_CUTS }).cuts, prices: kv.prices, processingCostPerBbl: kv.processingCostPerBbl, freightPerBbl: kv.freightPerBbl, lossPercent: kv.lossPercent, marker: kv.marker });
const nbL = nb(F.KWALE_LIGHT.curve); const nbM = nb(F.UGHELLI_MEDIUM.curve);
row('Kwale Light alone', fx(nbL.grossValue), fx(nbL.netback), fx(nbL.marker.differential));
row('Ughelli Medium alone', fx(nbM.grossValue), fx(nbM.netback), fx(nbM.marker.differential));
row('the blend, 55 and 45', fx(kwNet.grossValue), fx(kwNet.netback), fx(kwNet.marker.differential));
const volNet = C.blendOnVolume([nbL.netback, nbM.netback], kwVol);
claim(Math.abs(kwNet.netback - volNet) < 1e-9, 'the blend netback equals the volume-weighted netbacks');
out('');
out(`The volume-weighted mean of the two crudes' own netbacks is ${fx(volNet)} $/bbl; the blend's netback minus that mean is ${dfx(kwNet.netback, volNet)}. Yields add on volume and every other term is per barrel, so the blend is worth what its barrels are worth.`);
out('');
out('What netbackValue refuses:');
head('asked', 'what the engine returned');
for (const loss of [101, -1]) row(`losses of ${inp(loss)} percent`, refused(C.netbackValue({ cuts: kwY.cuts, prices: kv.prices, lossPercent: loss }), `loss ${loss}`));
out('');
out('D86 is a product test; a crude assay is reported as a TBP distillation. d86ToTbp has the structure of the cut-point-difference conversion (API Technical Data Book Procedure 3A1.1) and ships no coefficient table, because reproducing a published table from memory is what the engines refuse. Called without the table it refuses:');
head('asked', 'what the engine returned');
const d86 = [[10, 250], [30, 320], [50, 380], [70, 450], [90, 560]].map(([volumePercent, temperatureF]) => ({ volumePercent, temperatureF }));
row('a D86 curve and no coefficients', refused(d86ToTbpSafe(null), 'd86 none'));
row('a D86 curve with no 50 percent point, and a table', refused(d86ToTbpSafe({ fifty: { a: 1, b: 1 }, differences: [] }, d86.filter((p) => p.volumePercent !== 50)), 'd86 no 50'));
function d86ToTbpSafe(coef, curve = d86) { return C.d86ToTbp(curve, coef); }

/* ------------------------------------------------------------------ */
section('THE KWALE VALUATION END TO END, AND THE STUDIO\'S DEFAULTS');
out('The Kwale valuation in one place:');
head('figure', 'value');
row('blend API', fx(kwBlend.properties.api));
row('blend T50 F (interpolated)', fx(kwT.t50));
row('Watson K at T50 (screening)', fx(C.watsonK({ meanBoilingPointF: kwT.t50, sg: kwBlend.properties.sg })));
for (const r of kwY.cuts) row(`${r.name} yield volume percent`, fx(r.yieldVolPercent));
row('gross product value $/bbl', fx(kwNet.grossValue));
row('loss value $/bbl', fx(kwNet.lossValue));
row('netback $/bbl', fx(kwNet.netback));
row('differential against the marker $/bbl', fx(kwNet.marker.differential));
out('');
out('What the Crude Assay & Blending Studio shows with nothing typed: its default pair, 60 and 40, on its default cuts and default valuation.');
const sv = F.STUDIO_VALUATION;
const stY = C.cutYields({ curve: stCurve, cuts: F.STUDIO_CUTS });
const stNet = C.netbackValue({ cuts: stY.cuts, ...sv });
head('figure', 'value');
row('blend API', fx(stBlend.properties.api));
row('blend sulfur wt%', fx(stBlend.properties.sulfurWtPct));
row('blend T50 F (interpolated)', fx(stT.t50));
row('Watson K at T50 (screening)', fx(C.watsonK({ meanBoilingPointF: stT.t50, sg: stBlend.properties.sg })));
for (const r of stY.cuts) row(`${r.name} yield volume percent`, fx(r.yieldVolPercent));
row('gross product value $/bbl', fx(stNet.grossValue));
row('netback $/bbl', fx(stNet.netback));
row('stability screen basis', stBlend.stability.basis);
out('');
out('WHAT THE ORACLE CHECKS ON A CARGO. The crude assay engine is held to an independent Python oracle, tools/validation/downstream/oracle_crudeassay.py, written from the rules and not from the JavaScript. It loads a cargo in barrels and pounds, inverts the Refutas index by bisection, takes yields by segment overlap, finds T50 by bisection and keeps the netback as a 100,000 bbl account. Its golden cases, counted from the vendored file:');
{
  const ca0 = JSON.parse(fs.readFileSync(`${ROOT}/test-data/downstream/goldens/crudeassay_cases.json`, 'utf8'));
  head('golden set', 'cases');
  row('blends', String(ca0.blends.length));
  row('curve cases', String(ca0.curves.length));
  row('blended default curve', String(ca0.blendedDefault ? 1 : 0));
}

/* ------------------------------------------------------------------ */
section('WHAT A LINEAR PROGRAMME IS');
out('solveLP minimises c\'x subject to rows A x (<=, =, >=) b and bounds lo <= x <= hi (bounds kept as bounds, never as extra rows), or maximises when asked. Its status is always one of optimal, infeasible or unbounded, and the caller is told which. The optimum of a linear programme, when there is one, is found at a vertex of the feasible region: a point where at least as many constraints and bounds hold exactly as there are variables.');
out('');
const tb = F.TEXTBOOK_LP;
out(`THE TEXTBOOK CASE, before any blending: ${tb.label}. Maximise ${tb.c[0]}x + ${tb.c[1]}y subject to ${tb.A[0][0]}x + ${tb.A[0][1]}y <= ${tb.b[0]} and ${tb.A[1][0]}x + ${tb.A[1][1]}y <= ${tb.b[1]}, with x and y at least 0.`);
const tbR = S.solveLP(tb);
claim(tbR.status === 'optimal', 'the textbook LP is optimal');
head('status', 'x', 'y', 'objective', 'shadow price, row 1', 'shadow price, row 2', 'iterations');
row(tbR.status, fx(tbR.x[0]), fx(tbR.x[1]), fx(tbR.objective), fx(tbR.shadowPrices[0]), fx(tbR.shadowPrices[1]), String(tbR.iterations));
out('');
out('A shadow price is the change in the optimum per unit of a row\'s right-hand side. Re-solved with each right-hand side raised by one unit, by the same kernel:');
head('row raised by one', 'objective', 'change from the optimum');
for (const k of [0, 1]) {
  const b2 = tb.b.map((v, i) => (i === k ? v + 1 : v));
  const r2 = S.solveLP({ ...tb, b: b2 });
  row(`row ${k + 1}, rhs ${b2[k]}`, fx(r2.objective), dfx(r2.objective, tbR.objective));
}
out('');
out('The same problem at the vertices the two rows and the two bounds make, each point solved by the kernel with both coordinates fixed by bounds:');
head('point', 'objective at the point', 'feasible (the kernel\'s status)');
for (const [x, y] of [[0, 0], [4, 0], [0, 3], [tbR.x[0], tbR.x[1]]]) {
  const r = S.solveLP({ ...tb, lo: [x, y], hi: [x, y] });
  row(`x ${fx(x)}, y ${fx(y)}`, r.status === 'optimal' ? fx(r.objective) : 'not feasible', r.status);
}
out('');
out('Infeasible and unbounded are answers:');
head('problem', 'status');
row('minimise x + y with x + y <= 2 and x + y >= 3', S.solveLP({ c: [1, 1], A: [[1, 1], [1, 1]], b: [2, 3], ops: ['<=', '>='] }).status);
row('maximise x with x - y <= 1 (y unbounded above)', S.solveLP({ c: [1, 0], A: [[1, -1]], b: [1], ops: ['<='], maximize: true }).status);
row('minimise x with a lower bound of 5 above an upper bound of 3', S.solveLP({ c: [1], A: [[1]], b: [10], ops: ['<='], lo: [5], hi: [3] }).status);
row('maximise 3x + 2y with x + y <= 2 and y >= 2', `${S.solveLP({ c: [3, 2], A: [[1, 1], [0, 1]], b: [2, 2], ops: ['<=', '>='], maximize: true }).status}, objective ${fx(S.solveLP({ c: [3, 2], A: [[1, 1], [0, 1]], b: [2, 2], ops: ['<=', '>='], maximize: true }).objective)}`);
out('');
out('The method is two-phase simplex. Phase one finds any point that meets every row (it drives artificial variables to zero); if it cannot, the rows contradict and the answer is infeasible. Phase two moves from vertex to vertex to the optimum. Bland\'s rule picks the entering variable, which cannot cycle: blending problems are degenerate constantly, because specifications bind exactly at the optimum.');
let shapeErr = null;
try { S.solveLP({ c: [1, 1], A: [[1]], b: [1] }); } catch (e) { shapeErr = e.message; }
claim(shapeErr !== null, 'a malformed problem throws');
out(`A malformed problem is not an answer: the kernel throws ("${shapeErr}").`);
out(`iterations counts the pivots the kernel made, phase one and phase two together: the textbook case took ${tbR.iterations}.`);

/* ------------------------------------------------------------------ */
section('BLENDING RULES AS ROWS');
out('optimiseBlend turns every specification into a linear row. A limit on a ratio, sum(w_i v_i) / sum(d_i v_i) <= L, is the row sum((w_i - L d_i) v_i) <= 0, linear in the volumes v_i. The volume row sum(v_i) = target makes the batch. Each specification declares how its property blends:');
out('');
head('basis', 'w_i (numerator weight)', 'd_i (denominator weight)');
row('volume', 'the property', '1');
row('mass', 'SG x the property', 'SG');
row('index, on volume (RVP)', 'the property\'s index', '1');
row('index, on mass (viscosity)', 'SG x the property\'s index', 'SG');
out('');
out(`RVP blends through an index: RVPI = RVP^n, blended on volume and inverted. RVP_INDEX_EXPONENT is ${inp(P.RVP_INDEX_EXPONENT)}, a named and overridable parameter. A specification counts as binding when the achieved value is within BINDING_TOLERANCE (${inp(P.BINDING_TOLERANCE)}) times the limit (or 1, if larger) of it.`);
out('');
head('RVP psi', 'rvpIndex', 'rvpFromIndex of that index');
for (const v of [3.2, 6.2, 9, 12.9, 52.8]) row(inp(v), fx(P.rvpIndex(v)), fx(P.rvpFromIndex(P.rvpIndex(v))));
out('');
out('SPEC_TEMPLATES, the optimizer\'s starting shapes. They are starting points and never a compliance source: the regulation in force governs, and every limit is editable.');
head('template', 'specification', 'basis', 'min', 'max', 'unit');
for (const t of Object.values(P.SPEC_TEMPLATES)) {
  for (const s of t.specs) row(t.name, s.name, s.basis + (s.basis === 'index' ? (s.indexOnMass ? ', on mass' : ', on volume') : ''), s.min === undefined ? 'no minimum' : inp(s.min), s.max === undefined ? 'no maximum' : inp(s.max), s.unit || 'no unit');
}
out('');
out('propertyOfBlend recomputes a property from a finished recipe by the specification\'s own rule, separately from the LP rows, so agreement is a check. The Apapa PMS recipe (SECTION 21), each achieved property by both routes:');

/* ------------------------------------------------------------------ */
const pmsSpecs = P.SPEC_TEMPLATES.gasoline_50ppm.specs;
const pms = P.optimiseBlend({ components: F.APAPA_PMS_POOL, specs: pmsSpecs, targetVolume: F.APAPA_PMS_TARGET });
claim(pms.status === 'optimal', 'Apapa PMS is optimal');
const pmsVols = pms.recipe.map((r) => r.volume);
head('specification', 'achieved (optimiseBlend)', 'propertyOfBlend on the recipe', 'difference');
for (const a of pms.achieved) {
  const again = P.propertyOfBlend({ components: F.APAPA_PMS_POOL, volumes: pmsVols, spec: pmsSpecs.find((s) => s.id === a.id) });
  row(a.name, fx(a.value), fx(again), dfx(again, a.value));
}

section('THE APAPA PMS RECIPE: BINDING SPECIFICATIONS');
out(`APAPA: an invented Lagos import and blending terminal makes an ${inp(F.APAPA_PMS_TARGET)} bbl PMS cargo to the 50 ppm gasoline template from four bought-in components. Every figure is illustrative.`);
out('');
head('component', 'cost $/bbl', 'SG', 'RON', 'MON', 'sulfur ppm', 'RVP psi', 'available bbl');
for (const c of F.APAPA_PMS_POOL) row(c.name, inp(c.cost), inp(c.sg), inp(c.ron), inp(c.mon), inp(c.sulfurPpm), inp(c.rvp), inp(c.maxVolume));
out('');
head('component', 'volume bbl', 'volume fraction', 'cost $');
for (const r of pms.recipe) row(r.name, fx(r.volume), fx(r.volumeFraction), fx(r.cost));
row('total', fx(pms.totalVolume), fx(1), fx(pms.totalCost));
out(`Unit cost ${fx(pms.unitCost)} $/bbl. Status ${pms.status}.`);
out('');
head('specification', 'min', 'max', 'achieved', 'giveaway', 'binding', 'basis');
for (const a of pms.achieved) row(a.name, a.min === null ? 'no minimum' : inp(a.min), a.max === null ? 'no maximum' : inp(a.max), fx(a.value), fx(a.giveaway), String(a.binding), a.basis);
claim(pms.bindingSpecs.length === 2, 'two specifications bind at Apapa');
claim(pms.shadowPrices.filter((x) => pms.bindingSpecs.some((n) => x.name.startsWith(n))).every((x) => x.price > 0), 'every binding Apapa specification prices relief above zero');
out(`Binding: ${pms.bindingSpecs.join(' and ')}. A binding specification is met exactly; the optimum is pressed against it, and relaxing it lowers the cost (SECTION 23 prices by how much).`);
const atCap = pms.recipe.filter((r) => Math.abs(r.volume - F.APAPA_PMS_POOL.find((c) => c.id === r.id).maxVolume) < 1e-6).map((r) => r.name);
out(`Components at their availability: ${atCap.length ? atCap.join(', ') : 'nothing'}.`);

/* ------------------------------------------------------------------ */
section('GIVEAWAY AND ITS PRICE');
out('Giveaway is how far inside its limit the blend sits: the limit minus the achieved value for a maximum, the achieved value minus the limit for a minimum, the smaller of the two for a range. Positive giveaway is quality handed over for nothing. It is only worth money where a unit of the property has a price, so valueGiveaway takes a value per unit from the user and values the gap over the volume blended; where no unit value is given the gap is reported without a price.');
out('');
const unitValues = { ron: 0.6, mon: 0.4 };
const gv = P.valueGiveaway({ achieved: pms.achieved, totalVolume: pms.totalVolume, unitValues });
head('specification', 'giveaway', 'unit value $ per unit per bbl (typed)', 'value $ over the batch');
for (const g of gv) row(g.name, fx(g.giveaway), g.unitValue === null ? 'not given' : inp(g.unitValue), g.value === null ? 'not priced' : fx(g.value));
out(`Specifications with no giveaway (binding) are not listed: ${pms.achieved.filter((a) => !gv.some((g) => g.id === a.id)).map((a) => a.name).join(', ')}.`);

/* ------------------------------------------------------------------ */
section('SHADOW PRICES AS THE VALUE OF RELIEF');
out('The LP prices each ROW: the change in cost per unit of the row\'s right-hand side (rowPrice). For the volume row that is already the cost of one more barrel of product. For a specification row it is not a price per ppm or per psi: the row is sum((w_i - L d_i) v_i) <= 0, so moving the limit L by one unit moves the row by sum(d_i v_i), in index units where the property blends through an index. optimiseBlend therefore reports price = rowPrice x sum(d_i v_i) x dIndex/dL, turned into money SAVED by one unit of relief (raising a maximum, lowering a minimum), positive when relief saves money, per unit of the property. rowPrice is kept beside it.');
out('');
head('row', 'price (value of one unit of relief)', 'per', 'rowPrice');
for (const s of pms.shadowPrices) row(s.name, fx(s.price), s.per, fx(s.rowPrice));
out('');
const pmsSp = (n) => pms.shadowPrices.find((s) => s.name === n);
const sulfurSp = pmsSp('Sulfur maximum');
const rvpSp = pmsSp('RVP maximum');
const mass = F.APAPA_PMS_POOL.reduce((s, c, i) => s + c.sg * pmsVols[i], 0);
out(`The sulfur row's scale: sum(SG x volume) over the recipe is ${fx(mass)}. rowPrice x that sum is ${fx(sulfurSp.rowPrice * mass)}; the reported value of relief is ${fx(sulfurSp.price)} $ per ppm (relief on a maximum is the negative of dCost/dL).`);
const rvpLimit = pmsSpecs.find((s) => s.id === 'rvp').max;
const perIndex = rvpSp.rowPrice * pms.totalVolume;
out(`The RVP row is in index units. rowPrice x ${fx(pms.totalVolume)} bbl is ${fx(perIndex)} $ per index point. The reported value of relief is ${fx(rvpSp.price)} $ per psi; divided by the negative of the per-index figure, that is ${fx(rvpSp.price / -perIndex)} index points per psi, the slope of the index at the ${inp(rvpLimit)} psi limit. The same slope from the exported exponent, RVP_INDEX_EXPONENT x ${inp(rvpLimit)}^(RVP_INDEX_EXPONENT - 1), is ${fx(P.RVP_INDEX_EXPONENT * rvpLimit ** (P.RVP_INDEX_EXPONENT - 1))}.`);
out('');
out('CHECKING A PRICE BY RE-SOLVING. The engine re-solved with the limit moved one whole unit each way. A shadow price is a derivative at the optimum; one whole unit of relief can differ from it, because the rows move non-linearly in the limit and the optimal vertex can change.');
const resolveWith = (id, key, value) => P.optimiseBlend({ components: F.APAPA_PMS_POOL, specs: pmsSpecs.map((s) => (s.id === id ? { ...s, [key]: value } : s)), targetVolume: F.APAPA_PMS_TARGET });
head('re-solve', 'total cost $', 'saving against the optimum $', 'shadow price $ per unit');
for (const [id, key, lim, sp] of [['sulfurPpm', 'max', 51, sulfurSp], ['sulfurPpm', 'max', 49, sulfurSp], ['rvp', 'max', 10, rvpSp], ['rvp', 'max', 8, rvpSp]]) {
  const r = resolveWith(id, key, lim);
  row(`${sp.name.replace(' maximum', '')} limit ${inp(lim)}`, fx(r.totalCost), dfx(pms.totalCost, r.totalCost), fx(sp.price));
}
out('');
out('THE MARGINAL BARREL. The volume row\'s price is the cost of one more barrel of product at the margin. It is not the unit cost (the average): the component at its availability cannot supply the next barrel, so the next barrel is made from the others.');
const plus = P.optimiseBlend({ components: F.APAPA_PMS_POOL, specs: pmsSpecs, targetVolume: F.APAPA_PMS_TARGET + 1 });
head('figure', '$/bbl');
row('volume row price (the marginal barrel)', fx(pmsSp('Total volume').price));
row('unit cost (the average barrel)', fx(pms.unitCost));
row('marginal minus average', dfx(pmsSp('Total volume').price, pms.unitCost));
row(`re-solved at ${inp(F.APAPA_PMS_TARGET + 1)} bbl, cost minus the optimum`, dfx(plus.totalCost, pms.totalCost));
out('');
out('A non-binding specification has a price of zero: relieving a limit the blend does not touch saves nothing.');
const nonBinding = pms.achieved.filter((a) => !a.binding).map((a) => a.name);
claim(pms.shadowPrices.filter((s) => s.kind === 'spec' && nonBinding.some((n) => s.name.startsWith(n))).every((s) => Math.abs(s.price) < 1e-9), 'non-binding specifications price at zero');
out(`Non-binding at Apapa: ${nonBinding.join(', ')}.`);

/* ------------------------------------------------------------------ */
section('AN INDEX ON MASS: THE APAPA AGO POOL');
out(`The same terminal makes a ${inp(F.APAPA_AGO_TARGET)} bbl AGO cargo to the 50 ppm diesel template. Viscosity at 40 C blends through the Refutas index on MASS (indexOnMass), the same index as the assay studio; cetane and flash point are treated linearly on volume, which the template notes is a screening approximation.`);
out('');
head('component', 'cost $/bbl', 'SG', 'cetane', 'sulfur ppm', 'viscosity cSt', 'flash point C', 'available bbl');
for (const c of F.APAPA_AGO_POOL) row(c.name, inp(c.cost), inp(c.sg), inp(c.cetane), inp(c.sulfurPpm), inp(c.viscosityCSt), inp(c.flashPointC), inp(c.maxVolume));
const agoSpecs = P.SPEC_TEMPLATES.diesel_50ppm.specs;
const ago = P.optimiseBlend({ components: F.APAPA_AGO_POOL, specs: agoSpecs, targetVolume: F.APAPA_AGO_TARGET });
claim(ago.status === 'optimal', 'Apapa AGO is optimal');
out('');
head('component', 'volume bbl', 'cost $');
for (const r of ago.recipe) row(r.name, fx(r.volume), fx(r.cost));
row('total', fx(ago.totalVolume), fx(ago.totalCost));
out(`Unit cost ${fx(ago.unitCost)} $/bbl.`);
out('');
head('specification', 'achieved', 'giveaway', 'binding', 'value of one unit of relief $', 'per');
for (const a of ago.achieved) {
  const sps = ago.shadowPrices.filter((s) => s.specId === a.id);
  const bindingSp = sps.find((s) => Math.abs(s.price) > 1e-9) || sps[0];
  row(a.name, fx(a.value), fx(a.giveaway), String(a.binding), fx(bindingSp.price), bindingSp.per);
}
out(`Binding: ${ago.bindingSpecs.join(' and ')}. A price per unit of the property is per whole unit of it, so the density relief is dollars per kg/l.`);
out('');
const agoVol = ago.recipe.map((r) => r.volume);
const viscOnVolume = P.propertyOfBlend({ components: F.APAPA_AGO_POOL, volumes: agoVol, spec: { ...agoSpecs.find((s) => s.id === 'viscosityCSt'), indexOnMass: false } });
out(`The recipe's viscosity with the index on mass (the engine): ${fx(ago.achieved.find((a) => a.id === 'viscosityCSt').value)} cSt. With the same index on volume instead: ${fx(viscOnVolume)} cSt.`);
out('');
const agoMass = F.APAPA_AGO_POOL.reduce((acc, c, i) => acc + c.sg * agoVol[i], 0);
out(`The rows behind the AGO prices. Cetane and density blend on volume, so each row's scale sum(d_i v_i) is the recipe's ${fx(ago.totalVolume)} bbl; the mass rows (sulfur, viscosity) scale by sum(SG x volume), ${fx(agoMass)}.`);
head('row', 'rowPrice', 'scale', 'rowPrice x scale', 'price (value of one unit of relief)', 'per');
for (const x of ago.shadowPrices.filter((r) => r.kind === 'spec' && /Cetane|Density maximum/.test(r.name))) row(x.name, fx(x.rowPrice), fx(ago.totalVolume), fx(x.rowPrice * ago.totalVolume), fx(x.price), x.per);
out('A maximum\'s relief is the negative of dCost/dL and a minimum\'s is dCost/dL, which is why the density row prints rowPrice x scale with the opposite sign to its price.');
out('');
const agoVolIdx = P.optimiseBlend({ components: F.APAPA_AGO_POOL, specs: agoSpecs.map((x) => (x.id === 'viscosityCSt' ? { ...x, indexOnMass: false } : x)), targetVolume: F.APAPA_AGO_TARGET });
out('The AGO recipe re-solved with the viscosity index blended on volume instead of mass:');
head('component', 'volume bbl, index on mass (the engine)', 'volume bbl, index on volume');
ago.recipe.forEach((r, i) => row(r.name, fx(r.volume), fx(agoVolIdx.recipe[i].volume)));
row('total cost $', fx(ago.totalCost), fx(agoVolIdx.totalCost));
out(`Binding with the index on volume: ${agoVolIdx.bindingSpecs.join(' and ')}.`);

/* ------------------------------------------------------------------ */
section('INFEASIBLE, REFUSED AND SKIPPED');
out('An infeasible blend is a real answer, and the useful one: the specifications cannot be met by the components available.');
out('');
const tight = P.optimiseBlend({ components: F.APAPA_PMS_POOL, specs: P.SPEC_TEMPLATES.gasoline_10ppm.specs, targetVolume: F.APAPA_PMS_TARGET });
head('asked', 'status', 'what the engine returned');
row('Apapa PMS pool to the 10 ppm gasoline template', tight.status, refused(tight, '10 ppm'));
const hiRon = P.optimiseBlend({ components: F.APAPA_PMS_POOL, specs: pmsSpecs.map((s) => (s.id === 'ron' ? { ...s, min: 99 } : s)), targetVolume: F.APAPA_PMS_TARGET });
row('Apapa PMS pool with a RON minimum of 99', hiRon.status, refused(hiRon, 'ron 99'));
out('');
out('Which limit of the 10 ppm template makes the Apapa pool infeasible: each limit in turn moved back to its 50 ppm template value, the rest kept at 10 ppm:');
{
  const t10 = P.SPEC_TEMPLATES.gasoline_10ppm.specs; const t50 = P.SPEC_TEMPLATES.gasoline_50ppm.specs;
  const moves = [];
  for (const x of t10) {
    const y = t50.find((z) => z.id === x.id);
    for (const key of ['min', 'max']) if (x[key] !== undefined && x[key] !== y[key]) moves.push([x, y, key]);
  }
  head('limit moved back', '10 ppm value', '50 ppm value', 'status');
  for (const [x, y, key] of moves) {
    const r = P.optimiseBlend({ components: F.APAPA_PMS_POOL, specs: t10.map((z) => (z.id === x.id ? { ...z, [key]: y[key] } : z)), targetVolume: F.APAPA_PMS_TARGET });
    claim(r.status === 'infeasible', 'no single limit moved back rescues the pool');
    row(`${x.name} ${key === 'min' ? 'minimum' : 'maximum'}`, inp(x[key]), inp(y[key]), r.status);
  }
  out('No single limit moved back rescues the pool. The other way round: the 50 ppm template with ONE limit tightened to its 10 ppm value, the rest kept at 50 ppm:');
  head('limit tightened', '50 ppm value', '10 ppm value', 'status');
  for (const [x, y, key] of moves) {
    const r = P.optimiseBlend({ components: F.APAPA_PMS_POOL, specs: t50.map((z) => (z.id === y.id ? { ...z, [key]: x[key] } : z)), targetVolume: F.APAPA_PMS_TARGET });
    row(`${x.name} ${key === 'min' ? 'minimum' : 'maximum'}`, inp(y[key]), inp(x[key]), r.status);
  }
}
out('');
out('AVAILABILITY. A maximum left blank is no limit. A typed number is exactly that number, and a typed 0 is none:');
const setBut = (v) => F.APAPA_PMS_POOL.map((c) => (c.id === 'but' ? { ...c, maxVolume: v } : c));
head('butane maximum', 'status', 'butane volume bbl', 'total cost $', 'binding');
for (const [label, v] of [['400 (as typed)', 400], ['0 (tank empty)', 0], ['left blank (no limit)', '']]) {
  const r = P.optimiseBlend({ components: setBut(v), specs: pmsSpecs, targetVolume: F.APAPA_PMS_TARGET });
  row(label, r.status, fx(r.recipe.find((x) => x.id === 'but').volume), fx(r.totalCost), r.bindingSpecs.join(', '));
}
out('');
out('What optimiseBlend refuses, each in its own words:');
head('asked', 'what the engine returned');
row('no components', refused(P.optimiseBlend({ components: [], specs: pmsSpecs, targetVolume: 8000 }), 'no comps'));
row('a target volume of 0', refused(P.optimiseBlend({ components: F.APAPA_PMS_POOL, specs: pmsSpecs, targetVolume: 0 }), 'target 0'));
row('Isomerate with its cost left blank', refused(P.optimiseBlend({ components: F.APAPA_PMS_POOL.map((c) => (c.id === 'iso' ? { ...c, cost: '' } : c)), specs: pmsSpecs, targetVolume: 8000 }), 'blank cost'));
row('Butane with a maximum of -50', refused(P.optimiseBlend({ components: setBut(-50), specs: pmsSpecs, targetVolume: 8000 }), 'negative max'));
row('Reformate with a minimum of 3000 and a maximum of 2000', refused(P.optimiseBlend({ components: F.APAPA_PMS_POOL.map((c) => (c.id === 'ref' ? { ...c, minVolume: 3000, maxVolume: 2000 } : c)), specs: pmsSpecs, targetVolume: 8000 }), 'crossed'));
out('');
out('A SPECIFICATION NOT APPLIED. A specification cannot be imposed on components that do not carry the property, and a mass-basis specification needs every density. Neither is dropped silently: the recipe comes back with the specification listed as skipped, with the reason.');
const noSulfurIso = P.optimiseBlend({ components: F.APAPA_PMS_POOL.map((c) => (c.id === 'iso' ? { ...c, sulfurPpm: undefined } : c)), specs: pmsSpecs, targetVolume: 8000 });
const noDensity = P.optimiseBlend({ components: F.APAPA_PMS_POOL.map((c) => (c.id === 'fcc' ? { ...c, sg: undefined, api: undefined } : c)), specs: pmsSpecs, targetVolume: 8000 });
claim(noSulfurIso.skippedSpecs.length === 1 && noDensity.skippedSpecs.length === 1, 'one specification skipped in each');
head('asked', 'status', 'total cost $', 'skipped', 'reason (the engine)');
row('Isomerate with no sulfur figure', noSulfurIso.status, fx(noSulfurIso.totalCost), noSulfurIso.skippedSpecs[0].name, noSulfurIso.skippedSpecs[0].reason);
row('FCC gasoline with no SG and no API', noDensity.status, fx(noDensity.totalCost), noDensity.skippedSpecs[0].name, noDensity.skippedSpecs[0].reason);
out('');
out('What each recipe reports as achieved for the skipped specification, and for Density, which blends on volume and needs no SG:');
head('asked', 'skipped specification achieved', 'Density applied', 'Density achieved kg/l');
for (const [label, r] of [['Isomerate with no sulfur figure', noSulfurIso], ['FCC gasoline with no SG and no API', noDensity]]) {
  const sk = r.achieved.find((a) => a.id === r.skippedSpecs[0].id);
  const dn = r.achieved.find((a) => a.id === 'density');
  claim(sk.value === null && dn.applied, `${label}: the skipped property is not formed and density is applied`);
  row(label, 'not formed (the engine returns no value)', String(dn.applied), fx(dn.value));
}
out('');
out('A component floor. A minimum forces barrels into the recipe; every specification row then sits off zero after the kernel shifts the floor to the origin.');
const floor = P.optimiseBlend({ components: F.APAPA_PMS_POOL.map((c) => (c.id === 'iso' ? { ...c, minVolume: 1200 } : c)), specs: pmsSpecs, targetVolume: F.APAPA_PMS_TARGET });
head('asked', 'status', 'Isomerate bbl', 'total cost $', 'binding', 'sulfur relief $ per ppm');
row('Isomerate at least 1200 bbl', floor.status, fx(floor.recipe.find((x) => x.id === 'iso').volume), fx(floor.totalCost), floor.bindingSpecs.join(', '), fx(floor.shadowPrices.find((s) => s.name === 'Sulfur maximum').price));
{
  const bt = floor.recipe.find((x) => x.id === 'but');
  const cap = F.APAPA_PMS_POOL.find((c) => c.id === 'but').maxVolume;
  out(`At that optimum butane is ${fx(bt.volume)} bbl against its availability of ${inp(cap)}: ${Math.abs(bt.volume - cap) < 1e-6 ? 'at its availability' : 'inside its availability'}.`);
}

/* ------------------------------------------------------------------ */
section('THE OPTIMIZER\'S DEFAULT POOL');
out(`What the Product Blending Optimizer shows with nothing typed: its default gasoline pool, ${inp(F.OPTIMIZER_DEFAULT_TARGET)} bbl, the 50 ppm template.`);
const def = P.optimiseBlend({ components: F.OPTIMIZER_DEFAULT_POOL, specs: pmsSpecs, targetVolume: F.OPTIMIZER_DEFAULT_TARGET });
out('');
head('component', 'volume bbl');
for (const r of def.recipe) row(r.name, fx(r.volume));
out(`Total cost ${fx(def.totalCost)} $, unit cost ${fx(def.unitCost)} $/bbl, binding ${def.bindingSpecs.join(' and ')}.`);
{
  const atCapD = def.recipe.filter((r) => Math.abs(r.volume - F.OPTIMIZER_DEFAULT_POOL.find((c) => c.id === r.id).maxVolume) < 1e-6).map((r) => r.name);
  const atZero = def.recipe.filter((r) => Math.abs(r.volume) < 1e-9).map((r) => r.name);
  out(`Components at their availability: ${atCapD.length ? atCapD.join(', ') : 'nothing'}. At zero: ${atZero.length ? atZero.join(', ') : 'nothing'}. Marginal barrel minus unit cost: ${dfx(def.shadowPrices[0].price, def.unitCost)} $/bbl. With no availability limit pressing, every row but the volume row has a zero right-hand side, so the cost scales with the batch and the marginal barrel costs what the average one does.`);
}
head('row', 'price (value of one unit of relief)', 'per', 'rowPrice');
for (const s of def.shadowPrices) row(s.name, fx(s.price), s.per, fx(s.rowPrice));

/* ------------------------------------------------------------------ */
section('HELD LIMITS, CONSTANTS, AND WHAT THE ORACLES CHECK');
out('THREE HELD ITEMS (FINDINGS-crude.md), each taught as a stated limit and never graded:');
head('item', 'what the engine does', 'the limit');
row('L4', 'the LP kernel uses absolute tolerances on its pivots and on phase one', 'right for the barrel-scale problems the two apps pose; a problem scaled in millions is outside what it is shown to handle');
row('C12', `the Refutas index blends on mass fraction ("${obBlend.bases.viscosityCSt}")`, `ASTM D7152 blends on volume; the two disagree (the Obigbo export blend reads ${fx(obBlend.properties.viscosityCSt)} cSt on mass and ${fx(C.blendViscosity(obComps.map((c) => c.viscosityCSt), obBlend.fractions.map((f) => f.volumeFraction)))} cSt on volume), and the basis is a course and owner decision`);
row('C13', 'Watson K is taken at the blend\'s T50', 'a screening basis; the strict basis is the mean average boiling point');
out('');
out('CONSTANTS THE ENGINES STATE, read from the modules:');
head('constant', 'value');
row('CII_BANDS.STABLE', inp(C.CII_BANDS.STABLE));
row('CII_BANDS.UNSTABLE', inp(C.CII_BANDS.UNSTABLE));
row('RVP_INDEX_EXPONENT', inp(P.RVP_INDEX_EXPONENT));
row('BINDING_TOLERANCE', inp(P.BINDING_TOLERANCE));
row('viscosityBlendIndex(1), the Refutas index of 1 cSt', fx(C.viscosityBlendIndex(1)));
row('sgFromApi(10), water', fx(C.sgFromApi(10)));
out('');
out('WHAT THE ORACLES CHECK. Each engine is held to an independent Python oracle in tools/validation/downstream, written from the rules and not from the JavaScript, and its golden cases are counted here from the vendored golden files:');
const gold = (f) => JSON.parse(fs.readFileSync(`${ROOT}/test-data/downstream/goldens/${f}`, 'utf8'));
const ca = gold('crudeassay_cases.json'); const pb = gold('productblending_cases.json'); const lp = gold('lp_cases.json');
const lpCases = Array.isArray(lp.cases) ? lp.cases : [];
head('oracle', 'how it computes', 'golden cases');
row('oracle_crudeassay.py', 'loads a cargo in barrels and pounds; Refutas inverted by bisection; yields by segment overlap; T50 by bisection; netback as a 100,000 bbl account', `${ca.blends.length} blends, ${ca.curves.length} curve cases, ${ca.blendedDefault ? 1 : 0} blended default curve`);
row('oracle_productblending.py', 'rows built from physical mass balances, solved by exact rational vertex enumeration; properties from physical inventories; relief by exact re-solve with the limit moved', `${pb.cases.length} pools`);
row('oracle_lp.py', 'exact rational vertex enumeration with no simplex at all; shadow prices as exact one-sided derivatives by re-solve', `${lpCases.length} problems (${['optimal', 'infeasible', 'unbounded'].map((s) => `${lpCases.filter((c) => c.status === s).length} ${s}`).join(', ')})`);
out('');
out(`Refusals printed in this digest, each asserted against the engine before it was printed: ${refusedCount}.`);

/* ------------------------------------------------------------------ */
// gate_repro.sh's negative control, never set in a build: one line that reads
// the local zone, so the four-zone sweep is shown able to see a zone read.
if (process.env.MD_PLANT_TZ) out(`planted zone read: ${-new Intl.DateTimeFormat('en', { timeZoneName: 'shortOffset' }).formatToParts(0).find((p) => p.type === 'timeZoneName').value.length}`);
if (sectionNo !== Object.keys(SECTION_OWNERS).length) throw new Error(`SECTION OWNERS: ${sectionNo} sections printed, ${Object.keys(SECTION_OWNERS).length} owned`);
process.stdout.write(`${L.join('\n')}\n`);
