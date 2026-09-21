// refinery (Refinery Feasibility & Planning): what the lab and the panels may
// not say or do, for /root/dc-wavekit/sourceprose.mjs.
//
//   node /root/dc-wavekit/sourceprose.mjs \
//     /root/wt-md-refinery-nextgen/src/components/course/panels/refinery \
//     /root/md-wip-refinery/refinery_dump.mjs /root/md-wip-refinery/refinery_fields.mjs \
//     /root/md-wip-refinery/clockguard.mjs --rules /root/md-wip-refinery
//
// Nothing here is a lesson or a digest line; those are swept by digestprose and
// gate_copy_rule. Every cleared entry is pinned to wording that appears once.
export default {
  panels: {
    dir: '/root/wt-md-refinery-nextgen/src/components/course/panels/refinery',
    // A panel must go through refineryLab.js, which the lab tests pin value by
    // value. Reaching engines/downstream directly routes around them.
    noEngineImport: true,
    // cascadeToSchedule reads the machine clock when it is given no period
    // start, and feasibilityEconomics reads the year when it is given no start
    // year. The lab passes both, every call.
    noClock: true,
  },
  cleared: [],
};
