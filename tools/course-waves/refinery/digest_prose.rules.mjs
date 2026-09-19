// refinery (Refinery Feasibility & Planning): the wave's own heading claims,
// cleared phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs \
//     /root/md-wip-refinery/digest.txt --rules /root/md-wip-refinery
//
// THIS WAVE'S HISTORY POSITION. The digest teaches the engines as they are at
// 60ee266 (the MD2-0 repairs in). It names the owner decisions of 2026-09-19 in
// SECTION 24 as rules currently IN FORCE, each in the present tense. Nothing in
// the digest describes what an engine used to return; the one configuration
// that reproduces a former behaviour (a crude unit given a feed, SECTION 11) is
// printed as what the engine does today with that configuration.
export default {
  enginesRoot: process.env.MD_ENGINES || '/root/wt-md-refinery-nextgen/packages/engines',

  headings: [
    {
      id: 'rf-blank-refused',
      heading: /A BLANK BOX IS REFUSED/i,
      // Every feasibilityStreams row labelled blank must read REFUSED.
      body: (b) => b.split('\n').filter((l) => /^\| [^|]*left blank \|/.test(l)).some((l) => !/REFUSED: "/.test(l)),
      why: 'a heading says a blank box is refused over a row where a blank box was answered',
    },
    {
      id: 'rf-crude-unit-every-barrel',
      heading: /THE CRUDE UNIT CARRIES EVERY BARREL/i,
      body: (b) => !/the two agree to the barrel: true/.test(b),
      why: 'a heading says the crude unit carries every barrel over a block that does not show the crude run and the crude unit throughput agreeing',
    },
    {
      id: 'rf-totals-on-margin',
      heading: /TOTALS ON MARGIN/i,
      body: (b) => !/\| on margin \(the headline\) \|/.test(b),
      why: 'a heading says the totals are on margin over a block with no margin row',
    },
    {
      id: 'rf-seven-zones',
      heading: /THE SCHEDULE IN SEVEN TIME ZONES/i,
      // The first table (the string period start) must read true in all seven rows.
      body: (b) => {
        const lines = b.split('\n');
        const at = lines.findIndex((l) => /^\| time zone \| first date \| last date \|/.test(l));
        if (at === -1) return true;
        const rows = [];
        for (let i = at + 2; i < lines.length && lines[i].startsWith('|'); i += 1) rows.push(lines[i]);
        return rows.length !== 7 || rows.some((r) => !/\| true \|$/.test(r));
      },
      why: 'a heading promises the schedule in seven zones over a table that is not seven identical rows',
    },
    {
      id: 'rf-five-changes',
      heading: /UNDER FIVE CHANGES/i,
      body: (b) => {
        const lines = b.split('\n');
        const at = lines.findIndex((l) => /^\| change \| status \|/.test(l));
        if (at === -1) return true;
        let n = 0;
        for (let i = at + 2; i < lines.length && lines[i].startsWith('|'); i += 1) n += 1;
        return n !== 6; // the plan as typed plus five changes
      },
      why: 'a heading says five changes over a table that does not carry the plan and five changes',
    },
  ],

  // Phrases that match the history keyword family and are NOT history.
  cleared: [
    // "before the streams are built" is the order of an operation today.
    /The premium is added to the crude cost before the streams are built/,
    // "before the plant earns" describes the construction years of a plant.
    /The capital is expensed in the years it is spent, before the plant earns/,
  ],

  // Every engine message family this digest quotes verbatim, pinned to the
  // module it comes from, so an upstream engine edit turns this gate RED.
  pinned: [
    { frag: 'Enter 0 where the value really is zero.', src: 'engines/downstream/modularRefinery.js' },
    { frag: 'Utilisation is a fraction between 0 and 1 (0.9 for 90 percent).', src: 'engines/downstream/modularRefinery.js' },
    { frag: 'On-stream days must be between 1 and 366.', src: 'engines/downstream/modularRefinery.js' },
    { frag: 'A discount rate and a tax rate are needed to value the project.', src: 'engines/downstream/modularRefinery.js' },
    { frag: 'A term contract that is honoured, at the market price.', src: 'engines/downstream/modularRefinery.js' },
    { frag: 'Cargoes are available but contested: the plant runs below nameplate and pays up for barrels.', src: 'engines/downstream/modularRefinery.js' },
    { frag: 'Interruptions are routine. Half the nameplate and a hard premium, which is where most of these projects are actually decided.', src: 'engines/downstream/modularRefinery.js' },
    { frag: 'Enter 0 where the value really is zero.', src: 'engines/downstream/refineryPlanning.js' },
    { frag: 'must be zero or more; leave it blank for no limit.', src: 'engines/downstream/refineryPlanning.js' },
    { frag: 'has a minimum demand above its maximum.', src: 'engines/downstream/refineryPlanning.js' },
    { frag: 'No plan satisfies these constraints. A product floor is probably beyond what the crudes and units can make.', src: 'engines/downstream/refineryPlanning.js' },
    { frag: 'The plan is unbounded: a product has a price and no demand ceiling, or a crude has no availability limit and no cost.', src: 'engines/downstream/refineryPlanning.js' },
    { frag: 'The plan needs at least one crude.', src: 'engines/downstream/refineryPlanning.js' },
    { frag: 'The plan needs at least one product to sell.', src: 'engines/downstream/refineryPlanning.js' },
    { frag: 'this is the shape of the month to read actuals against, not a berth-level schedule.', src: 'engines/downstream/refineryPlanning.js' },
    { frag: 'No optimal plan to cascade.', src: 'engines/downstream/refineryPlanning.js' },
    { frag: 'Event quantity is unsigned; direction comes from the event type', src: 'engines/downstream/streamModel.js' },
    { frag: 'Unknown ledger', src: 'engines/downstream/streamModel.js' },
    { frag: 'Unknown event type', src: 'engines/downstream/streamModel.js' },
    { frag: 'margin: a revenue gap counts as it is, a cost gap with its sign reversed', src: 'engines/downstream/streamModel.js' },
  ],
};
