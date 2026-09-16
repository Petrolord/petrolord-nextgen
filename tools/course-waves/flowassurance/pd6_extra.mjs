// PD6 SECTION 32: three more engine findings, all run on the shipped engine.
// Opens neither fields.json nor pd6_fields.mjs.
import { overallU, uForArrivalTemp }
  from '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines/engines/production/flowlineThermal.js';
import { depression }
  from '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines/engines/production/hydrateInhibition.js';

const f = (v, n = 10) => Number(v).toFixed(n);
const out = [];
const steel = { idIn: 6.065, odIn: 6.625, k: 26 };
const foam  = { idIn: 6.625, odIn: 8.625, k: 0.09 };
const films = { insideFilmH: 250, outsideFilmH: 200 };

out.push('');
out.push('# SECTION 32: THREE MORE THINGS THE ENGINE DOES NOT CHECK');
out.push('# engine, on the published pipe. Expert m02 and m05 may cite any of these.');
out.push('');
out.push('# A. overallU NEVER CHECKS THAT ITS LAYERS ARE A STACK. Neither contiguity');
out.push('# nor order. The outer diameter it uses for BOTH the outside film AND the');
out.push('# burial term is list[list.length - 1].odIn, so passing the same two layers');
out.push('# in the wrong order silently moves both, and on a buried build it moves the');
out.push('# TRENCH. Nothing in the return says the stack was not a stack.');
const A = overallU({ layers: [steel, foam], ...films });
const B = overallU({ layers: [foam, steel], ...films });
const C = overallU({ layers: [steel, { idIn: 20, odIn: 30, k: 0.09 }], ...films });
out.push(`engine, layers in the CORRECT order: ok = ${A.ok}, U = ${f(A.uBtuHrFt2F, 10)} Btu/(hr ft2 degF), total resistance = ${f(A.totalResistance, 12)}`);
out.push(`engine, the SAME two layers REVERSED: ok = ${B.ok}, U = ${f(B.uBtuHrFt2F, 10)} Btu/(hr ft2 degF), total resistance = ${f(B.totalResistance, 12)}, error in U = ${f(100 * (B.uBtuHrFt2F - A.uBtuHrFt2F) / A.uBtuHrFt2F, 6)} percent`);
out.push(`engine, a coat FLOATING IN SPACE, bore 20 in to 30 in outside a 6.625 in pipe: ok = ${C.ok}, U = ${f(C.uBtuHrFt2F, 10)} Btu/(hr ft2 degF), error = none`);
const D = overallU({ layers: [steel, foam], ...films, burialFt: 4.0, kSoil: 1.2 });
const E = overallU({ layers: [foam, steel], ...films, burialFt: 4.0, kSoil: 1.2 });
out.push(`engine, BURIED 4.0 ft correct order: U = ${f(D.uBtuHrFt2F, 10)}, burial resistance = ${f(D.resistances.find((r) => r.id === 'burial').r, 10)}`);
out.push(`engine, BURIED 4.0 ft REVERSED: U = ${f(E.uBtuHrFt2F, 10)}, burial resistance = ${f(E.resistances.find((r) => r.id === 'burial').r, 10)}, error in U = ${f(100 * (E.uBtuHrFt2F - D.uBtuHrFt2F) / D.uBtuHrFt2F, 6)} percent`);
out.push('');
out.push('# B. depression() IS DISCONTINUOUS AT THE RELIABILITY LINE. recommendedF');
out.push('# switches which relation it reports at 25 weight percent. Neither relation');
out.push('# moves across the step; only which one is reported does.');
for (const w of [24.9, 24.999, 25.0, 25.001, 25.1]) {
  const d = depression({ weightPct: w, inhibitorId: 'methanol' });
  out.push(`engine methanol at ${f(w, 3)} weight percent: recommendedF = ${f(d.recommendedF, 10)} degF, basis = ${d.basis}, reliable = ${d.reliable}`);
}
const lo = depression({ weightPct: 24.999, inhibitorId: 'methanol' }).recommendedF;
const hi = depression({ weightPct: 25.001, inhibitorId: 'methanol' }).recommendedF;
out.push(`derived, the JUMP in recommendedF across 0.002 weight percent = ${f(lo - hi, 10)} degF`);
out.push('');
out.push('# C. reliable IS STRANGER FOR A GLYCOL THAN FOR METHANOL, and this is the');
out.push('# unarguable form of the print-switch reading. For methanol a false flag at');
out.push('# least comes with a SWITCH of relation. For a glycol nielsenBucklinF is null,');
out.push('# so the flag flips to false, the basis stays hammerschmidt, spreadF stays');
out.push('# null, and recommendedF stays THE SAME NUMBER the engine just called');
out.push('# unreliable. It declares its own answer unreliable and then reports it, with');
out.push('# nothing to compare it against.');
for (const id of ['methanol', 'meg']) {
  for (const w of [20, 30, 40]) {
    const d = depression({ weightPct: w, inhibitorId: id });
    out.push(`engine ${id} at ${f(w, 1)} weight percent: recommendedF = ${f(d.recommendedF, 10)} degF, basis = ${d.basis}, spreadF = ${d.spreadF === null ? 'null' : f(d.spreadF, 8)}, nielsenBucklinF = ${d.nielsenBucklinF === null ? 'null' : f(d.nielsenBucklinF, 8)}, reliable = ${d.reliable}`);
  }
}
out.push('');
out.push('# D. THE uForArrivalTemp REFUSAL STRING SAYS THE OPPOSITE OF WHAT ITS GUARD');
out.push('# ENFORCES. The guard is !(targetTempF > ambientTempF), so it fires on a');
out.push('# target AT OR BELOW ambient, and the physics is that a line cannot arrive');
out.push('# BELOW ambient by heat loss alone. The string says "above". It also');
out.push('# contradicts its own second clause, which says the target has to be above');
out.push('# ambient. This reaches a USER in the product, not only a learner.');
const ref = uForArrivalTemp({ lengthFt: 60000.0, inletTempF: 195.0, ambientTempF: 45.0,
  targetTempF: 40.0, massRateLbHr: 90000.0, cpBtuLbF: 0.620, idIn: 9.562 });
out.push(`engine, target 40.00 degF against a 45.00 degF ambient: ok = ${ref.ok}, reason = "${ref.reason}"`);
out.push('# The first clause should read BELOW. As written the sentence contradicts');
out.push('# the sentence that follows it.');
console.log(out.join('\n'));
