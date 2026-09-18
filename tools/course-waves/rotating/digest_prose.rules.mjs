// FC3 Rotating Equipment: the wave's own claims, cleared phrases and engine
// pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs digest.txt --rules /root/fc-wip-rotating
//
// WHY THIS FILE EXISTS. Without it `pinned` is empty, so the gate's deferral
// for verbatim engine quotes never fires and five true lines of this digest
// read as owner-copy-rule failures. An auditor staring at red on an engine
// message is one step from rewording the engine's own words in the digest,
// which desyncs the quote from the module Section 15 exists to quote EXACTLY.
//
// THE PINS ARE THE STRONGER CHECK, not the deferral. Each fragment is asserted
// to still be present in its module, so an upstream engine edit turns this
// gate RED instead of letting a stale quote sit in the digest looking current.
// The fragments are the interpolation-free runs of each message: the joined
// sentence exists only at run time, so only the literal part can be pinned.
//
// THIS WAVE'S HISTORY POSITION. FC3 has NO history section. Every section
// teaches what engines 4fa37e6 does today, and repair history lives in
// RECON.md and FINDINGS.md, both of which open with a banner saying so. A
// history framing anywhere in this digest is a defect rather than curriculum,
// which is why nothing is cleared below except the two phrases that only look
// like history.

export default {
  enginesRoot: process.env.FC3_ENGINES || '/root/wt-fc3-nextgen/packages/engines',

  // Heading claims THIS digest makes that its own block could contradict.
  // Each one is a way a title here has actually gone stale, not a generic one.
  headings: [
    {
      id: 'fc3-limit-it-can-break',
      heading: /limit it can break|can break the .*limit/i,
      body: (b) => /stages over the limit/.test(b) || / 0 \| 0 \|/.test(b),
      why: 'a heading says a limit can be broken over a block recording none broken. Section 13 carried this after the repair removed the behaviour, and the table beneath it prints 0 stages over the limit on every row',
    },
    {
      id: 'fc3-does-not-check',
      heading: /does not check|accepts? and should not/i,
      body: (b) => /is refused rather than classified|there is no verdict to give|\{ error: "/.test(b),
      why: 'a heading names a missing guard over a block in which the engine refuses. Section 7 carried this once the unreadable-NPSH verdict became a refusal',
    },
    {
      id: 'fc3-names-none-internally',
      heading: /names none internally|every packaging is written inline at its point of use\./i,
      body: () => true,
      why: 'a claim that pumps.js names no internal constants, which was true at 709172f and false at 4fa37e6, where it names PCT_SLACK and the two ends of the speed band and imports KW_PER_HP',
    },
    {
      id: 'fc3-four-branches',
      heading: /all four of its branches/i,
      body: (b) => new Set([...b.matchAll(/gives "([a-z]+)"/g)].map((m) => m[1])).size < 3,
      why: 'a heading claims four screening branches over a block reaching fewer than three recommendations. The fixture reached two for one wave while the sentence claimed four',
    },
    {
      id: 'fc3-shared-section-owner',
      heading: /^# SECTION (16|17):/,
      body: () => false,
      claimOnHeading: /\(owned by/,
      why: 'Sections 16 and 17 are read by all three tiers and owned by none, so an owner clause on either puts a published golden or a held item inside one tier range and makes every lower tier quoting it read as a forward reach',
    },
  ],

  // Phrases that match the keyword family and are NOT history. Each was read
  // by hand and is listed with what it actually says.
  cleared: [
    // Present tense: "is never EMPLOYED to refuse". The speed band warns and
    // never refuses, which is a statement about what the engine does today.
    /never used to refuse/i,
    // The duty point BEFORE the change, which is a live concept in Section 9
    // and not a claim about a past engine.
    /the old duty point/i,
    // The provenance of the golden FILE, a live property of that file.
    /was written through SI watts|was written by an oracle/i,
    // A live sweep: the stage count rises once a fixed count stops being
    // affordable.
    /no longer affordable/i,
  ],

  // Every engine message family this digest quotes verbatim, pinned to the
  // module it comes from, by the interpolation-free run of each message.
  pinned: [
    { frag: 'Btu that one horsepower-hour is: that driver would be more than', src: 'engines/facilities/compression.js' },
    { frag: 'F: compression raises the temperature of a gas, so no stage count can meet this limit', src: 'engines/facilities/compression.js' },
    { frag: 'F: at this temperature the valves and the lube oil set the limit, ahead of the thermodynamics', src: 'engines/facilities/compression.js' },
    { frag: 'a stage needs a compression ratio above', src: 'engines/facilities/compression.js' },
    { frag: 'a stage needs a positive gas gravity', src: 'engines/facilities/compression.js' },
    { frag: 'a stage needs a positive rate', src: 'engines/facilities/compression.js' },
    { frag: 'adds no pressure, so no number of them reaches the discharge', src: 'engines/facilities/compression.js' },
    { frag: 'discharge pressure must exceed suction pressure', src: 'engines/facilities/compression.js' },
    { frag: 'fuel needs a positive power, heat rate and heating value', src: 'engines/facilities/compression.js' },
    { frag: 'is above the DAK validity limit of', src: 'engines/facilities/compression.js' },
    { frag: 'mechanical efficiency must be greater than', src: 'engines/facilities/compression.js' },
    { frag: 'no practical stage count keeps the discharge temperature under the limit:', src: 'engines/facilities/compression.js' },
    { frag: 'polytropic efficiency must be greater than', src: 'engines/facilities/compression.js' },
    { frag: 'screening needs a rate and suction conditions that give a positive inlet volume', src: 'engines/facilities/compression.js' },
    { frag: 'the heat capacity ratio must exceed', src: 'engines/facilities/compression.js' },
    { frag: 'the interstage cooling needs a non-negative specific heat in Btu per lb per degF', src: 'engines/facilities/compression.js' },
    { frag: 'where the DAK fit data start; the z-factor here runs toward the ideal-gas limit', src: 'engines/facilities/compression.js' },
    { frag: '(you cannot trim an impeller larger)', src: 'engines/facilities/pumps.js' },
    { frag: 'NPSH available is below required: this pump will cavitate at this duty', src: 'engines/facilities/pumps.js' },
    { frag: 'NPSH needs a positive specific gravity', src: 'engines/facilities/pumps.js' },
    { frag: 'NPSH needs a suction pressure and a vapour pressure', src: 'engines/facilities/pumps.js' },
    { frag: 'a BEP flow is needed to judge the operating region', src: 'engines/facilities/pumps.js' },
    { frag: 'a pump curve needs at least three flow and head points', src: 'engines/facilities/pumps.js' },
    { frag: 'a required NPSH is needed for the check', src: 'engines/facilities/pumps.js' },
    { frag: 'a speed change needs a duty to change: give the flow, the head and the brake power at the present speed', src: 'engines/facilities/pumps.js' },
    { frag: 'a system curve needs a friction head at a stated positive flow', src: 'engines/facilities/pumps.js' },
    { frag: 'a system curve needs a static head: it may be negative, but it cannot be missing', src: 'engines/facilities/pumps.js' },
    { frag: 'a trim needs a duty to trim: give the flow, the head and the brake power at the full diameter', src: 'engines/facilities/pumps.js' },
    { frag: 'both a pump curve and a system curve are needed', src: 'engines/facilities/pumps.js' },
    { frag: 'ft: acceptable only with vendor agreement and a stable suction', src: 'engines/facilities/pumps.js' },
    { frag: 'gpm: raise the search limit or check the system curve', src: 'engines/facilities/pumps.js' },
    { frag: 'is outside the published correlation, so a corrected centrifugal curve cannot be used here: this service needs a positive-displacement pump or vendor viscous test data', src: 'engines/facilities/pumps.js' },
    { frag: 'motor efficiency must be greater than', src: 'engines/facilities/pumps.js' },
    { frag: 'parallel operation needs a pump curve and a whole number of machines, at least one', src: 'engines/facilities/pumps.js' },
    { frag: 'power needs a positive flow, head and specific gravity', src: 'engines/facilities/pumps.js' },
    { frag: 'pump curve points need non-negative flow and head', src: 'engines/facilities/pumps.js' },
    { frag: 'pump efficiency must be between', src: 'engines/facilities/pumps.js' },
    { frag: 'series operation needs a pump curve and a whole number of machines, at least one', src: 'engines/facilities/pumps.js' },
    { frag: 'the fitted curve does not fall with flow: check the points, because a centrifugal head curve must droop', src: 'engines/facilities/pumps.js' },
    { frag: 'the margin check needs a finite available NPSH: there is no verdict to give on a suction head that cannot be read', src: 'engines/facilities/pumps.js' },
    { frag: 'the pump curve points are degenerate: give three distinct flows', src: 'engines/facilities/pumps.js' },
    { frag: 'the speed ratio must be positive', src: 'engines/facilities/pumps.js' },
    { frag: 'the static suction head and the suction friction must both be numbers: they may be negative, but they cannot be missing', src: 'engines/facilities/pumps.js' },
    { frag: 'the system needs more head at zero flow than the pump makes at shutoff: this pump cannot start this system', src: 'engines/facilities/pumps.js' },
    { frag: 'the viscosity correction needs a BEP flow, head and a kinematic viscosity', src: 'engines/facilities/pumps.js' },
    { frag: 'the viscosity correction needs a positive pump speed in rpm', src: 'engines/facilities/pumps.js' },
    { frag: 'this curve does not fall with flow, so it is not a centrifugal head curve and its crossing with a system curve is not a duty point: check the catalogue points', src: 'engines/facilities/pumps.js' },
  ],
};
