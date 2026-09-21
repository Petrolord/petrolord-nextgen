// H4 Consequence Modelling: the wave's own claims, cleared phrases and engine
// pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/hse-wip-consequence/digest.txt \
//        --rules /root/hse-wip-consequence
//
// THIS WAVE'S HISTORY POSITION. The engine has no repair history: it was
// written, oracle-gated and merged in one pull request. So there is no framed
// history section, and every line of the digest describes current behaviour.
// The errata sections are about PUBLISHED SOURCES (the Yellow Book, OSD/30, a
// conference paper), never the engine.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
//
// Copy rule: no em dashes and no "X, not Y" contrastives in anything a learner
// reads. The messages below obey it too.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.H4_WAVE_DIR || '/root/hse-wip-consequence';
const DIGEST = path.join(WAVE, 'digest.txt');

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (H4): ${msg}`);
  console.log('   A rules file that cannot check its own declarations is a rules file that '
    + 'reports a clean sweep for a check that never ran.');
  process.exit(2);
};

let DIGEST_LINES = [];
try {
  DIGEST_LINES = fs.readFileSync(DIGEST, 'utf8').replace(/\n$/, '').split('\n');
} catch (e) {
  refuse(`${DIGEST} could not be read (${e.code}), so every declaration below is unchecked`);
}
if (DIGEST_LINES.length < 400) refuse(`${DIGEST} has ${DIGEST_LINES.length} lines, which is too few to be the whole digest`);

// NO SECTION MAY FRAME ITSELF AS HISTORY, because there is none.
const historyish = DIGEST_LINES.filter((l) => /^# SECTION \d+:/.test(l) && /USED TO|NO LONGER|REPAIR HISTORY/i.test(l));
if (historyish.length) refuse(`a section heading frames repair history in a wave that has none: ${historyish[0]}`);

/* ---------------------------------------------------------- table helpers */

const tableRows = (body) => body
  .split('\n')
  .filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*---/.test(l))
  .map((l) => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim()));

// Every heading claim below must match a real heading, or it clears nothing.
// Each body() returns TRUE WHEN THE CLAIM FAILS.
const HEADINGS = [
  {
    // Section 6: the pressure ladder must cross from subsonic to choked.
    id: 'h4-subsonic-to-choked',
    heading: /Gas outflow through a hole, choked and subsonic/i,
    body: (b) => { const r = tableRows(b).map((x) => x[2]); return !(r.includes('SUBSONIC') && r.includes('CHOKED')); },
    why: 'the gas section no longer shows the ladder crossing from subsonic to choked',
  },
  {
    // Section 7: a case at or just past the critical ratio reads CHOKED with psi one.
    id: 'h4-exactly-critical-is-choked',
    heading: /Exactly at the critical ratio/i,
    body: (b) => !tableRows(b).some((r) => r[3] === 'CHOKED' && r[4] === '1.000000000000'),
    why: 'the critical section no longer shows a choked boundary case with psi exactly one',
  },
  {
    // Section 18: a tilted flame over a near target is refused, naming tiltDeg.
    id: 'h4-overhang-refused',
    heading: /The view factor of a cylindrical flame/i,
    body: (b) => !tableRows(b).some((r) => r[4] === '`tiltDeg`'),
    why: 'the view factor section no longer shows the overhang refusal',
  },
  {
    // Section 19: Bagster outside its band is refused.
    id: 'h4-bagster-band',
    heading: /Atmospheric transmissivity by the Bagster fit/i,
    body: (b) => !tableRows(b).some((r) => r[2] === '`pathLengthM`'),
    why: 'the Bagster section no longer shows a refusal outside the band',
  },
  {
    // Section 21: every Yellow Book step prints beside its printed value.
    id: 'h4-yellow-book-steps',
    heading: /The Yellow Book pool fire, reproduced step by step/i,
    body: (b) => tableRows(b).filter((r) => r.length === 5 && /e[-+]\d+$|^0$/.test(r[3])).length < 14,
    why: 'the Yellow Book section prints fewer than fourteen reproduced steps',
  },
  {
    // Section 30: the engine inverse departs from the exact probit at one percent.
    id: 'h4-inverse-departs',
    heading: /The inverse probit is approximate/i,
    body: (b) => { const r = tableRows(b).find((x) => x[0] === '0.01'); return !r || !(Math.abs(Number(r[3])) > 1e-7); },
    why: 'the inverse section no longer shows the one percent departure',
  },
];
for (const h of HEADINGS) {
  if (!DIGEST_LINES.some((l) => /^# SECTION \d+:/.test(l) && h.heading.test(l))) {
    refuse(`the heading rule ${h.id} matches no section heading, so it checks nothing`);
  }
}

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
export const CLEARED = [];
for (const re of CLEARED) {
  if (!DIGEST_LINES.some((l) => re.test(l))) {
    refuse(`the cleared phrase ${re} matches no line of the digest, so it clears nothing`);
  }
}

// EVERY ENGINE STRING THIS DIGEST QUOTES, pinned by exact fragment to the
// engine source. If the engine's wording changes, the pin breaks and the quote
// is re-read rather than silently kept. Each pin is also checked to be QUOTED
// in the digest, so a pin that guards nothing refuses.
const PINNED = [
  'Bernoulli liquid outflow through a hole, qS = Cd Ah sqrt(2 (P - Pa) rhoL), P = rhoL g hL + PaL',
  'ideal gas outflow through a hole, choked when Pa/P0 <= (2/(gamma+1))^(gamma/(gamma-1)) (exactly at the ratio counts as choked)',
  'must lie in (0, 1]: the YB recommends 0.62 for a sharp orifice',
  'must be a molar mass above 0 kg/mol (hydrogen is 0.002016)',
  'the spill overtops the bund (depth above the wall height), so the pool is not confined by it',
  'no spreading model is implemented',
  'the correlation gives zero evaporation in calm air, which is its form and not physics',
  'is at or above ambient: the pool is boiling, and this non-boiling evaporation model does not apply',
  'Briggs (1973) rural open country: sigma_y = sy1 x / sqrt(1 + sy2 x); sigma_z = sz1 x (1 + sz2 x)^sz3',
  'treat the result as an extrapolation',
  'continuous point source Gaussian plume, total ground reflection (image source at -h)',
  'the Gaussian plume divides by the wind speed and has no calm-air form',
  'mg/m3 = ppm x M / Vm, Vm = R T / P (ideal gas)',
  'root of the ground-reflected Gaussian plume centreline concentration, Briggs rural sigmas; bisection',
  'Thomas with wind: L/D = 55 (m" / (rho_air sqrt(g D)))^0.67 u*^-0.21, u* = max(1, u10 / uc)',
  'tan(t)/cos(t) = 0.666 Fr10^0.333 Re^0.117; t = asin((sqrt(4c^2 + 1) - 1) / (2c))',
  'Mudan: SEP = 140e3 exp(-0.12 D) + 20e3 (1 - exp(-0.12 D))',
  'the closed form does not apply to a target under the flame',
  'Bagster: tau = 2.02 (pw x)^-0.09, valid 1e4 < pw x < 1e5 N/m',
  'solid flame: q = SEP x F x tau',
  'Q_TNT = alpha_e Qf Emf / Em_TNT',
  'Hopkinson-Cranz cube-root scaling, Z = R / W^(1/3)',
  'Z in [0.05, 40] m/kg^(1/3) (judgement; see findings)',
  'inverse of the Kinney and Graham fit by bisection on Z',
  'P = Phi(Y - 5), standard normal CDF (lib/stats normalCDF, Abramowitz and Stegun 7.1.26, |error| <= 1.5e-7)',
  'Y = a + b ln(V); P = Phi(Y - 5)',
  'D = sum(C^n dt)',
  'Equation 4a (HSC road and rail study)',
].map((frag) => ({ frag, src: 'engines/hse/consequence.js' }));
for (const p of PINNED) {
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
}

export default {
  enginesRoot: process.env.H4_ENGINES || '/root/wt-h4-nextgen/packages/engines',
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
