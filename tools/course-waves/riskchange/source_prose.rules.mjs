// riskchange, Risk, Change & Learning: what the lab and the panels may not say or do.
//
// Run with:
//   node /root/dc-wavekit/sourceprose.mjs \
//     /root/wt-as-riskchange-nextgen/src/components/course/panels/riskchange \
//     /root/as-wip-riskchange/riskchange_dump.mjs /root/as-wip-riskchange/riskchange_fields.mjs \
//     --rules /root/as-wip-riskchange
//
// The panels directory does not exist at the foundation; the panel wave creates
// it. Nothing here is a lesson or a digest line: those are swept by digestprose.
export default {
  panels: {
    dir: '/root/wt-as-riskchange-nextgen/src/components/course/panels/riskchange',
    // A panel must go through riskchangeLab.js, which the lab tests pin value by
    // value. Reaching an engine directly routes around them.
    noEngineImport: true,
    // Every engine here defaults its date to the clock. The lab hands them the
    // wave's as-of date, and the clock gate in the lab test proves every reader is
    // identical under two faked system dates.
    noClock: true,
  },
  cleared: [],
};
