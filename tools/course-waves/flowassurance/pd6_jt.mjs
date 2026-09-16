// PD6 SECTION 27 and 28 generator: the Joule-Thomson term, which the digest
// promised at Section 14 and never delivered. Runs the SHIPPED engine on the
// TEACHING LINE AKASO SPUR defined in Section 13. No capstone condition and no
// capstone value is reachable from this file: it opens neither fields.json nor
// pd6_fields.mjs, and every input below is copied from Section 13 of the digest.
import { steadyStateProfile, uForArrivalTemp, overallU }
  from '/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/packages/engines/engines/production/flowlineThermal.js';

const f = (v, n = 10) => Number(v).toFixed(n);

// AKASO SPUR, exactly as Section 13 defines it.
// The U comes from overallU on the Section 13 stack, NOT from the digest's
// rounded 12 figure printout, so every arrival below agrees with Section 13 to
// the last digit the engine carries rather than to the digit the digest prints.
const STACK = overallU({
  layers: [
    { idIn: 9.562,  odIn: 10.750, k: 26.00, label: 'carbon steel wall' },
    { idIn: 10.750, odIn: 13.750, k: 0.070, label: 'polyurethane foam' },
    { idIn: 13.750, odIn: 16.750, k: 0.90,  label: 'concrete weight coat' },
  ],
  insideFilmH: 200.0, outsideFilmH: 200.0,
  burialFt: 3.00, kSoil: 1.20, referenceIdIn: 9.562,
});
const L = { lengthFt: 60000.0, inletTempF: 195.00, ambientTempF: 45.00,
            massRateLbHr: 90000.0, cpBtuLbF: 0.620,
            uBtuHrFt2F: STACK.uBtuHrFt2F, idIn: 9.562 };
const P = { inletPsia: 2400.0, outletPsia: 1500.0, jtCoeffFPerPsi: 0.0280 };
const BOUND_FLOW = 71.00;

const heat = steadyStateProfile({ ...L });
const eng  = steadyStateProfile({ ...L, ...P });
const ntu  = heat.ntu;
const damping = ntu / (1 - Math.exp(-ntu));
const jtFull   = P.jtCoeffFPerPsi * (P.inletPsia - P.outletPsia);
const jtDamped = jtFull / damping;
const damped   = heat.arrivalTempF - jtDamped;

const verdict = (t) => (t > BOUND_FLOW ? 'OUTSIDE the hydrate region' : 'INSIDE the hydrate region');

const out = [];
out.push('');
out.push('# SECTION 27: THE JOULE-THOMSON TERM, THREE WAYS, ON THE TEACHING LINE');
out.push('# TEACHING LINE. Section 14 promised this row and the generator that wrote');
out.push('# it never emitted the section, so the largest finding in the course had no');
out.push('# numbers behind it. This section supplies them. NO PUBLISHED CASE SETS ANY');
out.push('# PRESSURE, so the Joule-Thomson term cannot be shown on a golden at all and');
out.push('# the oracle, which sets no pressures either, never sees any of this.');
out.push('# The engine applies the term as jtDrop = jtCoeff * dp * frac, so at the');
out.push('# outlet frac is 1 and THE WHOLE TERM LANDS UNDAMPED. The cooling is in fact');
out.push('# laid down ALONG the line, and each increment of it then decays toward');
out.push('# ambient over the length that remains, which damps the delivered term by');
out.push('# (1 - exp(-ntu)) / ntu. Expert m01 owns this section.');
out.push(`teaching, AKASO SPUR overall U from overallU on the Section 13 stack = ${f(STACK.uBtuHrFt2F, 12)} Btu/(hr ft2 degF), referred to ${f(STACK.referenceIdIn, 3)} in, ok = ${STACK.ok}`);
out.push(`teaching, AKASO SPUR ntu = ${f(ntu, 12)}, exp(-ntu) = ${f(Math.exp(-ntu), 12)}`);
out.push(`teaching, AKASO SPUR full Joule-Thomson term, jtCoeff times the 900.0 psi drop = ${f(jtFull, 10)} degF`);
out.push(`derived, the correct damping factor ntu / (1 - exp(-ntu)) = ${f(damping, 12)}`);
out.push(`derived, the Joule-Thomson term the engine applies = ${f(jtFull, 10)} degF`);
out.push(`derived, the Joule-Thomson term correctly damped = ${f(jtDamped, 10)} degF`);
out.push(`derived, the term the engine applies in excess of the damped one = ${f(jtFull - jtDamped, 10)} degF`);
out.push(`derived, the engine term as a multiple of the damped term = ${f(jtFull / jtDamped, 12)}`);
out.push('');
out.push('# THE THREE ARRIVALS, against the 71.00 degF FLOWING hydrate boundary, which');
out.push('# is a laboratory input and not an engine output.');
out.push(`teaching, ARRIVAL 1 heat loss only, no pressures passed = ${f(heat.arrivalTempF, 12)} degF, margin = ${f(heat.arrivalTempF - BOUND_FLOW, 10)} degF, ${verdict(heat.arrivalTempF)}`);
out.push(`derived, ARRIVAL 2 heat loss plus the CORRECTLY DAMPED term = ${f(damped, 12)} degF, margin = ${f(damped - BOUND_FLOW, 10)} degF, ${verdict(damped)}`);
out.push(`engine, ARRIVAL 3 what steadyStateProfile RETURNS, term undamped = ${f(eng.arrivalTempF, 12)} degF, margin = ${f(eng.arrivalTempF - BOUND_FLOW, 10)} degF, ${verdict(eng.arrivalTempF)}`);
out.push(`derived, the engine arrival below the correctly damped one = ${f(damped - eng.arrivalTempF, 10)} degF`);
out.push(`derived, ok on all three profiles = ${heat.ok} and ${eng.ok}, note = none, error = none`);
out.push('# THE VERDICT FLIPS. Arrivals 1 and 2 sit above the boundary and arrival 3,');
out.push('# which is the one the shipped engine returns, sits below it. The whole');
out.push('# difference between a line that is safe and a line that is hydrating is one');
out.push('# damping factor that is not applied.');
out.push('');
out.push('# SECTION 28: PUSH THE LINE LONGER, AND THE SIZE OF THE EXCURSION');
out.push('# TEACHING LINE, derived sweep on teaching inputs. Every row is a sweep point');
out.push('# and not a published case.');
out.push('# READ THE SIGN CAREFULLY, BECAUSE THE OBVIOUS READING OF THIS TABLE IS');
out.push('# WRONG. As the line lengthens the heat loss arrival approaches the 45.00');
out.push('# degF seabed from above, which is correct, and the undamped Joule-Thomson');
out.push('# term does not shrink with it, so the returned arrival crosses the seabed.');
out.push('# BUT A BELOW-AMBIENT ARRIVAL IS NOT BY ITSELF IMPOSSIBLE. A Joule-Thomson');
out.push('# term is a genuine heat SINK inside the line, not a modelling artefact, and');
out.push('# a real sink can hold fluid below the temperature of what surrounds it. The');
out.push('# CORRECTLY DAMPED column below goes under the seabed too, from 150000.0 ft');
out.push('# onward. So the defect is NOT that the engine returns a sub-seabed arrival.');
out.push('# THE DEFECT IS THE SIZE OF THE EXCURSION, and the excursion rows price it.');
out.push('# A SECOND THING THIS TABLE DOES NOT SHOW. uForArrivalTemp carries NO');
out.push('# Joule-Thomson term at all, so when it refuses one of these temperatures it');
out.push('# is refusing a target unreachable BY HEAT LOSS ALONE, which is a different');
out.push('# question from the one steadyStateProfile answered. The two functions are');
out.push('# each self-consistent and neither knows the other was asked. That is a SEAM');
out.push('# between two APIs, not one function contradicting another about physics,');
out.push('# and a lesson that calls it a contradiction is overclaiming.');
out.push('# Expert m01 owns this too.');
for (const lengthFt of [60000.0, 90000.0, 120000.0, 150000.0, 180000.0, 210000.0]) {
  const h = steadyStateProfile({ ...L, lengthFt });
  const e = steadyStateProfile({ ...L, lengthFt, ...P });
  const d = h.ntu / (1 - Math.exp(-h.ntu));
  const dampedArr = h.arrivalTempF - jtFull / d;
  const engBelow = L.ambientTempF - e.arrivalTempF;
  const dampBelow = L.ambientTempF - dampedArr;
  const tag = (v) => (v > 0 ? `${f(v, 10)} degF BELOW the seabed` : `${f(-v, 10)} degF above the seabed`);
  out.push(`derived sweep point, length ${f(lengthFt, 1)} ft: ntu = ${f(h.ntu, 10)}, heat loss arrival = ${f(h.arrivalTempF, 10)} degF, damped arrival = ${f(dampedArr, 10)} degF, engine arrival = ${f(e.arrivalTempF, 10)} degF`);
  out.push(`derived excursion at ${f(lengthFt, 1)} ft: the CORRECT reading is ${tag(dampBelow)}, the ENGINE is ${tag(engBelow)}, and the engine excursion exceeds the correct one by ${f(engBelow - dampBelow, 10)} degF`);
}
out.push('');
out.push('# WHAT THE INVERSE SAYS ABOUT THE SAME TEMPERATURE.');
for (const lengthFt of [180000.0, 210000.0]) {
  const e = steadyStateProfile({ ...L, lengthFt, ...P });
  const inv = uForArrivalTemp({ lengthFt, inletTempF: L.inletTempF, ambientTempF: L.ambientTempF,
                                targetTempF: e.arrivalTempF, massRateLbHr: L.massRateLbHr,
                                cpBtuLbF: L.cpBtuLbF, idIn: L.idIn });
  out.push(`derived, at ${f(lengthFt, 1)} ft steadyStateProfile RETURNS ${f(e.arrivalTempF, 10)} degF with ok = ${e.ok}, and uForArrivalTemp asked for that same temperature returns ok = ${inv.ok}, reason = "${inv.reason ?? 'none'}"`);
}
out.push('# ONE FUNCTION RETURNS THE TEMPERATURE AND THE OTHER REFUSES IT, AND THE');
out.push('# REASON IS THAT THEY ARE ANSWERING DIFFERENT QUESTIONS. uForArrivalTemp has');
out.push('# no pressure argument and no Joule-Thomson term, so it prices heat loss');
out.push('# alone and is right to refuse a sub-ambient target on that basis. The seam');
out.push('# is that nothing in either signature tells a caller the two are not');
out.push('# comparable, and the refusal text names ambient as the reason without');
out.push('# saying which mechanisms were considered.');
console.log(out.join('\n'));
