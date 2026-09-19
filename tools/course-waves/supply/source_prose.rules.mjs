// supply (Terminals, Depots & Fuel Supply): what the lab and the panels may not
// say or do, for /root/dc-wavekit/sourceprose.mjs.
//
//   node /root/dc-wavekit/sourceprose.mjs \
//     /root/md-wip-supply/supply_dump.mjs /root/md-wip-supply/supply_fields.mjs \
//     /root/md-wip-supply/supply_capstone.mjs --rules /root/md-wip-supply
//
// Nothing here is a lesson or a digest line; those are swept by digestprose and
// gate_copy_rule. Every cleared entry is pinned to wording that appears once.
export default {
  panels: {
    dir: '/root/wt-md-supply-nextgen/src/components/course/panels/supply',
    // A panel must go through supplyLab.js, which the lab tests pin value by
    // value. Reaching engines/downstream directly routes around them.
    noEngineImport: true,
    // Neither engine reads a clock, and a panel that reads one has invented a
    // dependency the course does not have.
    noClock: true,
  },
  // Nothing is cleared: a cleared entry nothing needs is a blind spot waiting
  // for a sentence to fall into it.
  cleared: [],
};
