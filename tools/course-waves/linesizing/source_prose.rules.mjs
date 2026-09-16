// FC2 LINE SIZING: what the lab and the panels may not say or do.
//
// Run with:
//   node /root/dc-wavekit/sourceprose.mjs \
//     /root/wt-fc2-nextgen/src/components/course/panels/linesizing \
//     /root/fc-wip-linesizing/fc2_dump.mjs /root/fc-wip-linesizing/fc2_fields.mjs \
//     --rules /root/fc-wip-linesizing
export default {
  panels: {
    dir: '/root/wt-fc2-nextgen/src/components/course/panels/linesizing',
    // A panel must go through linesizingLab.js, which the 86 panel tests pin
    // value by value. Reaching lineHydraulics directly routes around all of
    // them.
    noEngineImport: true,
    // Nothing in this wave reads a clock: the clock gate in the lab test
    // proves every reader is identical under two faked system dates.
    noClock: true,
  },
  // Phrases that read as history and are not. "used to" here is "employed to".
  cleared: [
    /never used to refuse/i,
    /is used to|are used to|be used to/i,
  ],
  comments: [
    {
      id: 'fc2-efficiency-linear',
      re: /multiplies every form linearly|linear on every form/i,
      why: 'a comment calls the efficiency linear on every form, which the efficiency table refutes for General Flow',
    },
    {
      id: 'fc2-one-pipe',
      re: /one pipe, three questions|three questions about one pipe/i,
      why: 'a comment frames the Expert reading as one pipe, which its own body refutes',
    },
  ],
  source: [
    {
      id: 'fc2-typed-refusal-message',
      files: /linesizingLab\.js$/,
      // The refusal gate greps the lab for every engine message; a literal
      // here would pass that grep for the wrong reason.
      re: /elevation change cannot exceed line length/,
      why: 'an engine refusal message is typed as a literal in the lab rather than asked of the engine',
    },
  ],
};
