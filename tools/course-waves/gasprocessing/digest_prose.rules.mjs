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
  headings: [
    {
      id: 'fc4-withheld',
      heading: /WITHHELD/i,
      body: (b) => b.trim().length > 0 && !/prints NOTHING|prints none/i.test(b),
      why: 'a heading says WITHHELD over a block that prints content. Section 14 carried this for one wave and the words must go when the content arrives',
    },
    {
      id: 'fc4-outside-contract',
      heading: /outside the contract/i,
      body: (b) => !/BARE NUMBER|bare number/i.test(b),
      why: 'a heading claims an export sits outside the error contract and the block shows none. This exact title went stale on the FC4-0 rebuild, because the one export that was outside the contract was brought inside it',
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
