// gasvalue (Flare Gas to Value & LPG/CNG): what the lab and the panels may not
// say or do, for /root/dc-wavekit/sourceprose.mjs.
//
//   node /root/dc-wavekit/sourceprose.mjs \
//     /root/et-wip-gasvalue/gasvalue_dump.mjs /root/et-wip-gasvalue/gasvalue_fields.mjs \
//     /root/et-wip-gasvalue/gasvalue_capstone.mjs /root/et-wip-gasvalue/gasvalue_fields_capstone.mjs \
//     --rules /root/et-wip-gasvalue
//
// Nothing here is a lesson or a digest line; those are swept by digestprose and
// gate_copy_rule. Every cleared entry is pinned to wording that appears once.
export default {
  panels: {
    dir: '/root/wt-et-gasvalue-nextgen/src/components/course/panels/gasvalue',
    // A panel must go through gasvalueLab.js, which the lab tests pin value by
    // value. Reaching engines/downstream directly routes around them.
    noEngineImport: true,
    // There is no clock in this course, and a panel that reads one has
    // invented a dependency the engines do not have.
    noClock: true,
  },
  // Nothing is cleared: a cleared entry nothing needs is a blind spot waiting
  // for a sentence to fall into it.
  cleared: [],
};
