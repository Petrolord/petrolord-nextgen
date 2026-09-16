// FC4 Gas Processing: the wave's own claims, cleared phrases and engine pins
// for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs digest.txt --rules /root/fc-wip-gasprocessing
//
// THIS WAVE'S HISTORY POSITION. Framed history is curriculum; unframed
// history is a defect. Section 20 of this digest is the one section whose
// SUBJECT is what the engine used to do, and it says so in its title and in
// its first line, so the kit reports its sentences as framed and warns for a
// human read rather than failing. Nothing above Section 20 is history.
//
// The three warnings that section raises are expected and are re-read by hand
// on every rebuild rather than cleared, because clearing them would make the
// one place in this digest that carries history the one place nobody checks.

export default {
  enginesRoot: process.env.FC4_ENGINES || '/root/wt-fc4-nextgen/packages/engines',

  // Heading claims this digest makes that a block could contradict. Each is
  // a real way one of THESE section titles could go stale, not a generic one.
  //
  // TWO CLASSES ARE DELIBERATELY NOT HERE. A false COUNT ("Two refusals" over
  // three bullets) and a backwards DIRECTION ("costs duty and buys
  // circulation back" over a table where both columns fall) both shipped in
  // one rebuild, and both sat on ORDINARY PROSE LINES introducing a block.
  // The kit surfaces section titles, hash headings and capitalised markers;
  // none of those shapes matches a sentence beginning "Two refusals that look
  // alike", so a rule here would be a dead row reporting a clean sweep. Both
  // are checked in gate_claims.mjs, which reads the digest as text, and both
  // have a negative control there.
  headings: [
    {
      id: 'fc4-withheld',
      heading: /WITHHELD/i,
      body: (b) => b.trim().length > 0 && !/prints NOTHING|prints none/i.test(b),
      why: 'a heading says WITHHELD over a block that prints content. Section 14 carried this for one wave and the words must go when the content arrives',
    },
    {
      // NOTE FOR LESSON SWEEPS. This rule fires on LESSON headings too, and
      // it is meant to.
      //
      // WHAT THE ENGINE ACTUALLY DOES, MEASURED. The error contract belongs
      // to the DOORS: the nine exports called with an object of named
      // arguments all answer with an object and all put a named string on an
      // `error` key when they cannot. The four exports called with one
      // POSITIONAL value are scalar helpers and answer with a bare number, a
      // bare NaN, one row of the amine table or a null. Every count and shape
      // word in that sentence is re-measured by gate_claims.mjs, which also
      // proves each helper's no-answer is turned into a NAMED refusal by the
      // door that consumes it, and runs a negative control on the classifier.
      //
      // WHY THE RULE STAYS. A heading of the shape "the export outside the
      // contract" or "what breaks the contract" reads as a live DEFECT, and
      // the live defect of that shape was repaired by FC4-0: a DOOR that
      // returned a bare number, so `if (r.error)` passed and the Suite
      // rendered an empty dash. No door does that now. A heading asserting
      // otherwise is stale whatever its block says, and the Expert tier
      // retitled its m05 l03 to "The contract read on one door" for exactly
      // that reason, keeping the lesson KEY so banks, capstones and manifests
      // did not have to move with it.
      //
      // A TRIPWIRE, NOT A GUARANTEE. It asks about the HEADING and not about
      // the block, because tested against the stale m05 l03 title as that
      // lesson was actually written it reported nothing: the body used the
      // phrase "bare number" inside a hypothetical, so heading and block
      // agreed and the pair was consistent and wrong together. The wave gate
      // is what checks the substance.
      id: 'fc4-outside-contract',
      heading: /outside the contract|breaks (that|the) contract/i,
      body: () => true,
      why: 'a heading says an export sits outside or breaks the error contract, which reads as a live defect. The contract belongs to the doors and no door sits outside it since FC4-0. The four scalar helpers do answer with a bare number, a bare NaN or a null, and that variation is stated by name in digest Section 1, Section 11 and Section 15 and re-measured by gate_claims.mjs, so a heading is the wrong place to raise it. The Expert tier retitled its m05 l03 to "The contract read on one door" and kept the lesson KEY, so banks, capstones and manifests did not move with it',
    },
    {
      id: 'fc4-does-not-move',
      heading: /does not move|is rate independent/i,
      body: (b) => {
        const rows = b.split('\n').filter((l) => /^\| /.test(l) && !/^\| ---/.test(l));
        return rows.length > 2 && new Set(rows.map((r) => r.split('|').pop())).size > 1;
      },
      why: 'a heading claims a column does not move over a table whose last column does',
    },
    {
      id: 'fc4-no-published-case',
      heading: /no published case|NO published case/i,
      body: (b) => /golden mu|golden cooling/i.test(b),
      why: 'a heading says a routine has no published case over a block printing its published cases. True of the Joule-Thomson chain for one wave and false the moment the repair landed',
    },
    {
      id: 'fc4-one-density',
      heading: /ONE glycol density|one fluid, one density/i,
      body: (b) => /69\.9/.test(b),
      why: 'a heading claims the module has one glycol density over a block still printing the second one',
    },
  ],

  // Phrases that match the keyword family and are NOT history. Each was read
  // by hand and is listed with what it actually says.
  cleared: [
    // A live property of the golden file, not a claim about a past engine.
    /the oracle (now )?carries them through kilograms/i,
    // "used to" inside a VERBATIM ENGINE STRING is the engine's wording.
    /outletSpecBasis/i,
  ],

  // Every engine message family this digest quotes verbatim, pinned to the
  // module it comes from. An upstream engine edit turns the gate RED instead
  // of letting a stale quote pass as current behaviour. Composed messages are
  // pinned by their TEMPLATE and by the call that names them, because the
  // joined sentence exists only at run time.
  pinned: [
    { frag: 'must be a finite number above zero', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'must be a finite temperature above absolute zero', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'must be between ${lo} and ${hi}', src: 'engines/facilities/gasProcessing.js' },
    { frag: "needInRange(btexAbsorbedFrac, 0, 1, 'BTEX absorbed fraction')", src: 'engines/facilities/gasProcessing.js' },
    { frag: "needPositive(duty, 'regenerator duty', 'Btu per gallon circulated')", src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the Magnus water-saturation fit holds from', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'must exceed the water vapour pressure', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'or the gas is not a gas', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the real-gas correction of the McKetta-Wehe chart grows to tens of percent', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the Magnus coefficients were published over', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'leaves nothing for the contactor to do', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'below 90 the loop is not a dehydration loop and 100 is unreachable', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the reboiler must be hotter than the absorber', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'circulation ratio outside the customary 2 to 5 gal per lb', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the loop is carrying more water than a glycol loop is meant to', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the dew point lean glycol can deliver is a chart this module does not carry', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'leaves no swing to circulate on', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'no acid gas to remove at these specs', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'a spec above the inlet is already met', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'amine strength must be above 0 and at or below 100 weight percent', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'corrosion territory', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'this module carries', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the fraction removed must be between 0 and 1, exclusive', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'however many stages are added', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'raise circulation', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the liquid must be denser than the gas for Souders-Brown to mean anything', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the march needs a positive whole number of steps', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'a Joule-Thomson let-down needs the inlet above the outlet', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the march died at step', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'the Sutton pseudo-criticals are not physical at a gas gravity of', src: 'engines/facilities/gasProcessing.js' },
    { frag: "Sutton's pressure correlation turns negative above a gravity of about", src: 'engines/facilities/gasProcessing.js' },
    { frag: 'is above the DAK validity limit of 30', src: 'engines/facilities/gasProcessing.js' },
    { frag: 'is below the DAK validity range of 1.0 to 3.0', src: 'engines/facilities/gasProcessing.js' },
  ],
};
