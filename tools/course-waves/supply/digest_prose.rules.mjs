// supply (Terminals, Depots & Fuel Supply): the wave's own heading claims,
// cleared phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs \
//     /root/md-wip-supply/digest.txt --rules /root/md-wip-supply
//
// THIS WAVE'S HISTORY POSITION. The digest teaches the engines as they are at
// e4d3b10 (MD3-0 and MD3-1). SECTION 23 names the rules MD3-0 and MD3-1 put in force as rules in
// force, each in the present tense with a measured figure. Nothing in the
// digest describes what an engine or a page used to return.
export default {
  enginesRoot: process.env.MD_ENGINES || '/root/wt-md-supply-nextgen/packages/engines',

  // Heading claims this digest makes that a block could contradict.
  headings: [
    {
      id: 'sp-cannot-fail',
      heading: /A RECONCILIATION THAT CANNOT FAIL/,
      // Every row of the derived-opening table must read balanced with a zero
      // gap; a row that shows a gap makes the heading false.
      body: (b) => b.split('\n').filter((l) => /^\| \d+\.\d{3} \| \d+\.\d{3} \| \d+\.\d{3} \|/.test(l))
        .some((l) => !/\| 0\.000 \| true \| balanced \|$/.test(l)),
      why: 'a heading says the derived-opening reconciliation cannot fail over a row that shows a gap',
    },
    {
      id: 'sp-tank-by-tank',
      heading: /TANK BY TANK/,
      // No per-tank pumpable figure may be negative, and a tank below its heel
      // must read 0.000.
      body: (b) => b.split('\n').filter((l) => /^\| IB-T\d/.test(l)).some((l) => {
        const c = l.split('|').map((x) => x.trim());
        const heel = Number(c[3]); const stock = Number(c[4]); const pumpable = Number(c[5]);
        return pumpable < 0 || (stock < heel && pumpable !== 0) || (stock >= heel && Math.abs(pumpable - (stock - heel)) > 0.0015);
      }),
      why: 'a heading says pumpable stock is counted tank by tank over a row that nets or goes negative',
    },
    {
      id: 'sp-cannot-keep-up',
      heading: /A RACK THAT CANNOT KEEP UP/,
      body: (b) => !b.split('\n').some((l) => /\| 1\.000000 \|/.test(l) && /REFUSED: The rack cannot keep up/.test(l)),
      why: 'a heading says the rack cannot keep up over a sweep that never reaches a utilisation of one',
    },
    {
      id: 'sp-invented-rates',
      heading: /THE BADAGRY LANDED COST WALK/,
      body: (b) => !/Every rate below is INVENTED for this course/.test(b),
      why: 'the landed cost walk prints rates without saying they are invented',
    },
  ],

  // Phrases that match the history keyword family and are NOT history. Each
  // was read by hand and is listed with what it actually says.
  cleared: [
    // "yesterday's closing dip" is the definition of the opening stock, not history.
    /yesterday's closing dip/,
    // The oracle provenance sentence names what the oracle does, in the present.
    /the oracle builds a strapping table from tank geometry/,
  ],

  // Every engine message this digest quotes verbatim, pinned to the module it
  // comes from, so an upstream engine edit turns this gate RED instead of
  // letting a stale quote pass as current behaviour.
  pinned: [
    { frag: 'rate(s) not supplied, so the full landed cost is at least this.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'rate(s) not supplied, so the full price is at least this.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'A dip cannot be negative.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'A landed cost per litre is required.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'A water cut cannot be negative.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'An FOB price and its basis are required.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'Arrival rate and load time are both needed.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'Cargo quantity is required.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'has an unknown stage', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'Demand, payload and trips per truck per day are required and must be positive.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'Density at 15 C and observed temperature are both needed.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'Density is required to convert between mass and volume; it is not assumed.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'Distance, payload and average speed are required and must be positive.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'No crossing in the range searched. The outcome has the same sign at both ends.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'No dip reading.', src: 'engines/downstream/terminalDepot.js' },
    { frag: "No opening stock, so the day cannot be closed. The opening stock is yesterday\\'s closing dip.", src: 'engines/downstream/terminalDepot.js' },
    { frag: 'No strapping table for this tank.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'is a percentage of a value that is not formed until after freight', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'The dip is above the last strapping entry. The table does not cover this height, and extrapolating one invents capacity the tank does not have.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'The dip is below the first strapping entry. The table does not cover this height; extend it down to the tank floor.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'The insurance rates on CIF add up to 100 percent or more', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'The number of bays must be a whole number, one or more.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'The rack cannot keep up with arrivals. The queue grows without limit, so no average waiting time exists. Add a bay, load faster, or spread the arrivals.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'The search bracket must be a valid interval.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'The volume correction factor needs the API MPMS Chapter 11.1 coefficients for your commodity group, which are a published table this package does not ship.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'The water cut cannot be converted: ', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'The water cut is above the product dip. Check both readings.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'Throughput, litres per transaction, dispense rate and nozzle count are required.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'Unknown quantity unit', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'No closing dip, so the day cannot be closed.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'No emission factor supplied, so the carbon side is not computed. Factors are published, versioned data; an invented one would be worse than none.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'No product density supplied, so the loss has no weight and the carbon side is not computed.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'No volume correction factor supplied, so only the gross observed volume is reported.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'No diesel emission factor supplied, so the carbon figure is left blank.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'One day is noise; a run in one direction is worth investigating: a drifting meter, a passing valve, or a temperature effect not being corrected.', src: 'engines/downstream/terminalDepot.js' },
    { frag: 'litres of ullage at the reorder level. Order earlier or order a part load.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'Line items only. Every rate is a required input: duties, levies and regulated margins are set by regulation, differ by market and change. Confirm each against the regulation in force.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'All supplied rates applied.', src: 'engines/downstream/fuelPricing.js' },
    { frag: 'Throughput and the throughput fee are both needed for the money answer.', src: 'engines/downstream/terminalDepot.js' },
  ],
};
