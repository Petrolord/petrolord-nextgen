// carbon (Carbon & Energy Efficiency): what the lab and the panels may not
// say or do, for /root/dc-wavekit/sourceprose.mjs.
//
//   node /root/dc-wavekit/sourceprose.mjs \
//     /root/et-wip-carbon/carbon_dump.mjs /root/et-wip-carbon/carbon_fields.mjs \
//     /root/et-wip-carbon/carbon_capstone.mjs --rules /root/et-wip-carbon
//
// Nothing here is a lesson or a digest line; those are swept by digestprose and
// gate_copy_rule. Every cleared entry is pinned to wording that appears once.
export default {
  panels: {
    dir: '/root/wt-et-carbon-nextgen/src/components/course/panels/carbon',
    // A panel must go through carbonLab.js, which the lab tests pin value by
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
