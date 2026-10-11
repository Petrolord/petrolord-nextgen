// QI Quantitative Interpretation: the wave's own claims, cleared phrases and
// engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/qi-wip-qi/digest.txt --rules /root/qi-wip-qi
//
// THIS WAVE'S HISTORY POSITION. The course teaches no repair history.
//
// THIS FILE REFUSES RATHER THAN PASSING. Everything it declares about the
// digest is checked against digest.txt when the module loads, and a claim it
// cannot check makes it print REFUSED and exit 2.
import fs from 'node:fs';
import path from 'node:path';

const WAVE = process.env.QI_WAVE_DIR || '/root/qi-wip-qi';
const DIGEST = path.join(WAVE, 'digest.txt');
const ENGINES = process.env.QI_ENGINES || '/root/wt-qi-nextgen/packages/engines';

const refuse = (msg) => {
  console.log(`REFUSED by digest_prose.rules.mjs (QI): ${msg}`);
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
// 450 while the digest holds the Associate sections alone (523 lines at the foundation).
if (DIGEST_LINES.length < 450) refuse(`${DIGEST} has ${DIGEST_LINES.length} lines, which is too few to be the whole digest`);

const historyish = DIGEST_LINES.filter((l) => /^# SECTION \d+:/.test(l) && /USED TO|NO LONGER|REPAIR HISTORY|LEGACY/i.test(l));
if (historyish.length) refuse(`a section heading frames repair history in a wave that teaches none: ${historyish[0]}`);

// Every heading claim below must match a real heading, or it clears nothing.
// Each `body` returns TRUE WHEN THE HEADING IS FALSE over its block.
const HEADINGS = [
  {
    id: 'qi-refusals',
    heading: /every refusal the Associate engines make/i,
    body: (b) => (b.match(/^\| `[A-Za-z0-9]+` \|/gm) || []).length < 15 || !/A RESULT IS NO REFUSAL/.test(b),
    why: 'the refusals section no longer tables the engine messages and the NaN result',
  },
  {
    id: 'qi-spectrum',
    heading: /The amplitude spectrum/i,
    body: (b) => !/A CHECK AGAINST A KNOWN ANSWER/.test(b) || !/goldens\.seismicQc\.json/.test(b),
    why: 'the spectrum section no longer checks the engine against the analytic Ricker golden',
  },
  {
    id: 'qi-band',
    heading: /Band edges and the centroid/i,
    body: (b) => !/THE TAPER IS A STATED CHOICE/.test(b) || !/ONE TRACE IS NOT A SPECTRUM OF THE VOLUME/.test(b),
    why: 'the band section no longer shows the taper rows and the single trace',
  },
  {
    id: 'qi-footprint',
    heading: /Acquisition footprint/i,
    body: (b) => !/\| designed stripe, along the crosslines \|/.test(b) || !/\| Ekene, along the crosslines \|/.test(b),
    why: 'the footprint section no longer shows both the Ekene slice and the designed stripe',
  },
  {
    id: 'qi-trend',
    heading: /The local shear trend and its prediction interval/i,
    body: (b) => !/THE LEVEL IS A STATED CHOICE/.test(b) || !/THE FORM IS A STATED CHOICE/.test(b) || !/\| yes \|/.test(b),
    why: 'the shear trend section no longer shows the level, the form and an extrapolated prediction',
  },
  {
    id: 'qi-substitution',
    heading: /Oil-to-brine substitution on a log/i,
    body: (b) => !/THE MEANS over the/.test(b) || !/AGAINST THE WATER LEG/.test(b),
    why: 'the substitution section no longer shows the zone means and the water-leg comparison',
  },
  {
    id: 'qi-wet',
    heading: /The wet trend on a crossplot/i,
    body: (b) => !/THE PUBLISHED LINE FOR COMPARISON/.test(b) || !/THE BLOCK LENGTH IS A STATED CHOICE/.test(b),
    why: 'the wet trend section no longer shows the published line and the block lengths',
  },
  {
    id: 'qi-avo',
    heading: /Modelled AVO at the zone top/i,
    body: (b) => !/\| class \|/.test(b) || !/far mean/.test(b),
    why: 'the AVO section no longer shows the class and the stack means',
  },
];
for (const h of HEADINGS) {
  if (!DIGEST_LINES.some((l) => /^# SECTION \d+:/.test(l) && h.heading.test(l))) {
    refuse(`the heading rule ${h.id} matches no section heading, so it checks nothing`);
  }
}

// A CLEARED PHRASE THAT MATCHES NOTHING IS A ROW CLAIMING WORK IT NEVER DID.
// This wave clears no phrase. The list is empty by decision and checked as empty.
export const CLEARED = [];
for (const re of CLEARED) {
  if (!DIGEST_LINES.some((l) => re.test(l))) {
    refuse(`the cleared phrase ${re} matches no line of the digest, so it clears nothing`);
  }
}

// EVERY ENGINE STRING THIS DIGEST QUOTES, pinned by exact fragment to the
// engine source that writes it. If the engine's wording changes, the pin breaks
// and the quote is re-read rather than silently kept. Each pin is also checked
// to be QUOTED in the digest, so a pin that guards nothing refuses.
const PINNED = [
  ['The sample interval must be positive.', 'engines/qi/seismicQc.js'],
  ['A spectrum needs at least 8 samples.', 'engines/qi/seismicQc.js'],
  ['Give at least one trace.', 'engines/qi/seismicQc.js'],
  ['Every trace must have the same length.', 'engines/qi/seismicQc.js'],
  ['Signal-to-noise needs at least two neighbouring traces.', 'engines/qi/seismicQc.js'],
  ['No neighbouring pair had samples to correlate.', 'engines/qi/seismicQc.js'],
  ['A footprint needs a slice of at least 4 by 4.', 'engines/qi/seismicQc.js'],
  ['The regression is singular (Vp has no spread).', 'engines/rockphysics/elasticSet.js'],
  ['The interval level must be between 0 and 1.', 'engines/rockphysics/elasticSet.js'],
  ['Temperature (degC) and positive pressure (MPa) required.', 'engines/rockphysics/fluids.js'],
  ['Salinity must be a weight fraction in [0, 0.5).', 'engines/rockphysics/fluids.js'],
  ['API gravity must be in (0, 100).', 'engines/rockphysics/fluids.js'],
  ['Saturations must sum to 1.', 'engines/rockphysics/fluids.js'],
  ['Fractions must sum to 1.', 'engines/rockphysics/minerals.js'],
  ['vp, vs and rho must be positive.', 'engines/rockphysics/gassmann.js'],
  ['Porosity must be in (0, 1).', 'engines/rockphysics/gassmann.js'],
  ['A fluid line needs at least three interfaces.', 'engines/rockphysics/avoTrend.js'],
  ['Vs/Vp must be between 0 and 1.', 'engines/rockphysics/avoTrend.js'],
].map(([frag, src]) => ({ frag, src }));
const SRCS = {};
for (const p of PINNED) {
  if (!SRCS[p.src]) SRCS[p.src] = fs.readFileSync(path.join(ENGINES, p.src), 'utf8');
  if (!DIGEST_LINES.some((l) => l.includes(p.frag))) refuse(`the pinned engine fragment "${p.frag}" is not quoted in the digest, so the pin guards nothing`);
  if (!SRCS[p.src].includes(p.frag)) refuse(`the pinned engine fragment "${p.frag}" is not in ${p.src}, so the quote is stale`);
}

export default {
  enginesRoot: ENGINES,
  pinned: PINNED,
  cleared: CLEARED,
  headings: HEADINGS,
};
