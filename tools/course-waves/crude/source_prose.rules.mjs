// crude (Crude Assay & Blending): what the lab and the panels may not say or
// do, for /root/dc-wavekit/sourceprose.mjs.
//
//   node /root/dc-wavekit/sourceprose.mjs \
//     /root/md-wip-crude/crude_dump.mjs /root/md-wip-crude/crude_fields.mjs \
//     /root/md-wip-crude/crude_capstone.mjs --rules /root/md-wip-crude
//
// Nothing here is a lesson or a digest line; those are swept by digestprose and
// gate_copy_rule. Every cleared entry is pinned to wording that appears once.
export default {
  panels: {
    dir: '/root/wt-md-crude-nextgen/src/components/course/panels/crude',
    // A panel must go through crudeLab.js, which the lab tests pin value by
    // value. Reaching engines/downstream or lib/lp directly routes around them.
    noEngineImport: true,
    // There is no clock in this course, and a panel that reads one has
    // invented a dependency the engines do not have.
    noClock: true,
  },
  // Nothing is cleared: a cleared entry nothing needs is a blind spot waiting
  // for a sentence to fall into it.
  cleared: [],
};
