// FC7 Produced Water Treatment: the wave's own heading claims, cleared phrases
// and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs digest.txt --rules /root/fc-wip-producedwater
//
// THIS WAVE'S HISTORY POSITION. Framed history is curriculum; unframed history
// is a defect. SECTION 22 is the one section of this digest whose SUBJECT is
// what the engine used to do, and it says so in its title and in its first
// line, so the kit reports its sentences as framed. Nothing above Section 22 is
// history, and every warning that section raises is re-read by hand on every
// rebuild rather than cleared, because clearing them would make the one place in
// this digest that carries history the one place nobody checks.
export default {
  enginesRoot: process.env.FC7_ENGINES || '/root/wt-fc7-nextgen/packages/engines',

  // Heading claims a block of THIS digest could contradict. Each is a real way
  // one of these titles could go stale rather than a generic shape.
  //
  // ONE CLASS IS DELIBERATELY NOT HERE. A claim about the DIRECTION of a swept
  // column ("fewer liners are always worse"), a claim that a column is CONSTANT,
  // and a claim that a spread is machine noise all sit on ordinary prose lines
  // under a table, which is not a shape the kit surfaces. All of them are in
  // gate_claims.mjs instead, recomputed from the engine, with negative controls
  // that are proved to fire. The first draft of this digest carried a heading
  // reading THE ORDER OF THE STAGES MATTERS over a pair of identical numbers,
  // and that is the gate which caught it.
  headings: [
    {
      id: 'fc7-withheld',
      // CASE SENSITIVE, and deliberately so: the first draft used /WITHHELD/i
      // and fired on Section 16's own title, "A refusal, a withheld verdict,
      // and the difference", which is the subject of that section rather than a
      // stale banner. A banner is shouted; a subject is not.
      heading: /WITHHELD/,
      body: (b) => b.trim().length > 0 && !/prints NOTHING|prints none/i.test(b),
      why: 'a heading says WITHHELD over a block that prints content. No section of this digest is withheld, and if one ever is, the words must go when the content arrives',
    },
    {
      id: 'fc7-does-not-move',
      heading: /does not move|cannot change|by nothing at all/i,
      body: (b) => {
        const rows = b.split('\n').filter((l) => /^\| /.test(l) && !/^\| ---/.test(l));
        return rows.length > 2 && new Set(rows.map((r) => r.split('|').pop())).size > 1;
      },
      why: 'a heading claims an input cannot change a column over a table whose last column moves. Three inputs of this module used to move the answer by nothing at all and all three bite now, so a heading of this shape is stale by construction',
    },
    {
      id: 'fc7-no-limit',
      heading: /discharge limit|the limit this module/i,
      body: (b) => /\b29 ppm\b/.test(b) && !/states no limit|not a limit|the caller/i.test(b),
      why: 'a heading about a discharge limit over a block naming 29 ppm without saying the module states no limit. The figure has no source in this repository and the engine states none: a test asserts its declared constants carry no specification-like key',
    },
    {
      id: 'fc7-two-opinions',
      heading: /removalFraction|two routes|second opinion/i,
      body: (b) => /removalFraction/.test(b) && !/is gone|no removalFraction|reports none/i.test(b),
      why: 'a heading about the filter naming removalFraction as a live return. It was DELETED in FC7-0 and a jest test asserts it is gone, so a block presenting it as something the module returns is teaching a shape the engine cannot produce',
    },
    {
      id: 'fc7-verdict',
      heading: /MEETS|meets spec|the verdict/i,
      body: (b) => /meetsSpec (true|false)/.test(b) && !/withheld|withhold|complete/i.test(b),
      why: 'a heading about a verdict over a block printing a pass or fail with no mention of completeness. This engine withholds the verdict when any stage did not run, and the whole point of the section is that a verdict on a train that did not run is a verdict on equipment that is not there',
    },
  ],

  // Phrases that match the history keyword family and are NOT history. Each was
  // read by hand and is listed with what it actually says.
  cleared: [
    // A live property of the module, in its own words, on every return.
    /cutBasis|medianBasis|concentrationBasis|overallRemovalBasis/i,
    // The engine's own note about the dissolved oil floor, quoted verbatim.
    /DISSOLVED_OIL_NOTE|dissolvedOilNote/i,
    // "used to" inside the framed history section is the subject of that section.
    /SECTION 22/i,
  ],

  // Every engine message family this digest quotes verbatim, pinned to the
  // module it comes from, so an upstream engine edit turns the gate RED instead
  // of letting a stale quote pass as current behaviour.
  pinned: [
    { frag: 'the oil must be lighter than the water for it to rise', src: 'engines/facilities/producedWater.js' },
    { frag: 'the short-circuit factor F must be positive', src: 'engines/facilities/producedWater.js' },
    { frag: 'is not a perfect separator, it is an undefined one', src: 'engines/facilities/producedWater.js' },
    { frag: 'a turbulence allowance customarily between', src: 'engines/facilities/producedWater.js' },
    { frag: 'the salinity correction in this module is stated to', src: 'engines/facilities/producedWater.js' },
    { frag: 'total dissolved solids cannot be negative', src: 'engines/facilities/producedWater.js' },
    { frag: 'the fresh-water density fit is stated from', src: 'engines/facilities/producedWater.js' },
    { frag: 'this module holds API gravity to', src: 'engines/facilities/producedWater.js' },
    { frag: 'the water viscosity fit holds from', src: 'engines/facilities/producedWater.js' },
    { frag: 'this module holds a liner bank to', src: 'engines/facilities/producedWater.js' },
    { frag: 'liners would run this flow at its design point', src: 'engines/facilities/producedWater.js' },
    { frag: 'the oil core must sit inside the half-area radius', src: 'engines/facilities/producedWater.js' },
    { frag: 'the centrifugal field collapses with the square of the flow', src: 'engines/facilities/producedWater.js' },
    { frag: 'the inlet slot chokes, so the field stops rising with the flow', src: 'engines/facilities/producedWater.js' },
    { frag: 'with no gas there is nothing for the droplets to attach to', src: 'engines/facilities/producedWater.js' },
    { frag: 'the bubble diameter must lie between', src: 'engines/facilities/producedWater.js' },
    { frag: 'the attachment efficiency is the probability that a collision sticks', src: 'engines/facilities/producedWater.js' },
    { frag: 'past about', src: 'engines/facilities/producedWater.js' },
    { frag: 'media filters lose depth capture at this rate and break through early', src: 'engines/facilities/producedWater.js' },
    { frag: 'a device cannot be applied without a positive cut size', src: 'engines/facilities/producedWater.js' },
    { frag: 'what is left is numerical dust and no outlet droplet median is reported for it', src: 'engines/facilities/producedWater.js' },
    { frag: 'Stokes law is creeping flow and is stated here to Re', src: 'engines/facilities/producedWater.js' },
    { frag: 'outside the creeping flow Stokes is stated for, so this cut size is optimistic', src: 'engines/facilities/producedWater.js' },
    { frag: 'the train needs an array of devices', src: 'engines/facilities/producedWater.js' },
    { frag: 'so there is no train here to give a verdict on', src: 'engines/facilities/producedWater.js' },
    { frag: 'no discharge specification was given', src: 'engines/facilities/producedWater.js' },
    { frag: 'a discharge specification must be a positive concentration', src: 'engines/facilities/producedWater.js' },
    { frag: 'this device reports no cut size', src: 'engines/facilities/producedWater.js' },
    { frag: 'below the', src: 'engines/facilities/producedWater.js' },
    { frag: 'an ideal capture: the median droplet crossing from the half-area radius to the oil core', src: 'engines/facilities/producedWater.js' },
    { frag: 'interception of droplets on a rising bubble swarm', src: 'engines/facilities/producedWater.js' },
    { frag: 'depth filtration, inverted', src: 'engines/facilities/producedWater.js' },
    { frag: 'both medians are the volume median of the same bin set', src: 'engines/facilities/producedWater.js' },
    { frag: 'the removal is a fraction of the OIL, so it is dimensionless', src: 'engines/facilities/producedWater.js' },
    { frag: 'there is a floor under any outlet this train can reach', src: 'engines/facilities/producedWater.js' },
    { frag: 'only the fixed-velocity half of the API 421 horizontal velocity rule is applied here', src: 'engines/facilities/producedWater.js' },
    { frag: 'a log-standard-deviation of', src: 'engines/facilities/producedWater.js' },
    { frag: 'sigma either side of the median and this spans', src: 'engines/facilities/producedWater.js' },
    { frag: 'the distribution needs a whole number of bins', src: 'engines/facilities/producedWater.js' },
  ],
};
