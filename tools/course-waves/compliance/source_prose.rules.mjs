// compliance (Compliance, Audit & Quality): what the lab and the panels may not
// say or do, for /root/dc-wavekit/sourceprose.mjs.
//
//   node /root/dc-wavekit/sourceprose.mjs \
//     /root/wt-as-compliance-nextgen/src/components/course/panels/compliance \
//     /root/as-wip-compliance/compliance_dump.mjs /root/as-wip-compliance/compliance_fields.mjs \
//     /root/as-wip-compliance/clockguard.mjs --rules /root/as-wip-compliance
//
// Nothing here is a lesson or a digest line; those are swept by digestprose and
// gate_copy_rule. Every cleared entry is pinned to wording that appears once.
export default {
  panels: {
    dir: '/root/wt-as-compliance-nextgen/src/components/course/panels/compliance',
    // A panel must go through complianceLab.js, which the lab tests pin value by
    // value. Reaching engines/assurance directly routes around them.
    noEngineImport: true,
    // THE RULE THAT MATTERS MOST ON THIS WAVE. Every assurance rule defaults its
    // today to the machine clock; a panel that reads a clock shows a different
    // register tomorrow. The lab passes an explicit as-of date to every call.
    noClock: true,
  },
  // Nothing is cleared: the four generator sources sweep clean (0 warned, 0
  // failing at the foundation), and a cleared entry nothing needs is a blind
  // spot waiting for a sentence to fall into it.
  cleared: [],
};
