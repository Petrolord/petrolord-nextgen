// FC6 HEAT EXCHANGE & COOLING: what the lab and the panels may not say or do.
//
// Run with:
//   node /root/dc-wavekit/sourceprose.mjs \
//     /root/wt-fc6-nextgen/src/components/course/panels/heattransfer \
//     /root/wt-fc6-nextgen/src/pages/apps/HeatTransferLearningPage.jsx \
//     /root/fc-wip-heattransfer/fc6_dump.mjs /root/fc-wip-heattransfer/fc6_fields.mjs \
//     --rules /root/fc-wip-heattransfer
//
// WHY THERE IS A CLEARED LIST AT ALL. sourceprose has no framing concept: any
// comment carrying a history keyword fails, and a wave clears the ones that are
// not claims about current behaviour. Every entry below is pinned to wording
// that appears once, so the list cannot quietly clear a future comment, and
// each says what frames it. Nothing here is a lesson, a digest line or anything
// a learner reads: those are swept by digestprose and by gate_copy_rule.
export default {
  panels: {
    dir: '/root/wt-fc6-nextgen/src/components/course/panels/heattransfer',
    // A panel must go through heattransferLab.js, which the 53 lab tests pin
    // value by value. Reaching heatTransfer.js directly routes around them.
    noEngineImport: true,
    // Nothing in this domain reads a clock. The clock gate in the lab test
    // proves every reader is identical under two faked system dates.
    noClock: true,
  },
  cleared: [
    // THE LAB, TWICE, AND BOTH ARE FRAMED BY THE BLOCK THEY SIT IN. The first
    // sits under a doc comment whose own first line reads "FRAMED AS REPAIR
    // HISTORY", and names the values FC6-0 replaced; what the engine does with
    // each of them now is refuse it, and those refusals are the readers beside
    // it. The second is inside the doc comment headed "THE REFUSALS WHOSE
    // MESSAGE CARRIES THE ENGINE'S OWN HISTORY", which explains why an engine
    // message quoting its own former behaviour is carried verbatim.
    /Coefficients a studio box can carry that used to be answered/,
    /A refusal quoting what the module used to return is the engine/,
    // THE LAB TEST'S OWN DETECTOR AND ITS TWO PLANTED FIXTURES. The first line
    // describes the trigger the test greps for; the other two are strings the
    // test PLANTS so its own history sweep can be shown to fire. A fixture is
    // not a claim about the engine, and clearing them leaves every real comment
    // in the file swept.
    /"used to" is both the commonest trigger and a frame marker/,
    /this once returned a different count/,
    /the engine used to floor this at one tube per pass/,
    // THE DUMP, TWICE, AND BOTH ARE THE RULE ITSELF RATHER THAN A HISTORY
    // SENTENCE. The first states that nothing in the generator describes former
    // behaviour except the last section, which says so in its own title. The
    // second explains why a refusal message quoting the engine's former return
    // is printed verbatim with a frame on the line immediately before it.
    /NOTHING IN THIS FILE DESCRIBES WHAT THE ENGINE USED TO DO except the last/,
    /the engine used to return is quoting the engine verbatim, which is right/,
  ],
};
