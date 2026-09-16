// FC2 LINE SIZING: the heading claims this wave has to keep honest.
//
// The kit's general rules in digestheadings.mjs catch repair-history framing,
// a title naming a missing guard over a block where the engine refuses, and a
// cardinal that disagrees with its own numbered list. These are the claims
// SPECIFIC to this digest, and the first of them is here because it was a LIVE
// DEFECT: Section 18's title read "a line from bore to wall to pig" while the
// body beneath it had just been corrected to say the three readings are asked
// of TWO DIFFERENT PIPES. The body was repaired and the heading above it was
// left standing, which is the defect class this gate exists for, in the same
// pass that repaired the body.
//
// Run with: node /root/dc-wavekit/digestheadings.mjs \
//             /root/fc-wip-linesizing/digest.txt --rules /root/fc-wip-linesizing
export default [
  {
    id: 'fc2-one-pipe',
    // A heading may not frame the Expert reading as one pipe, because the
    // hydraulic and volume readings are the OGBIA line at 7.981000 in of bore
    // and the wall reading is the SOKU pipe at a bore of 12.000000 in.
    heading: /a line from bore to wall to pig|one pipe, three|three questions about one pipe/i,
    body: () => true,
    why: 'a heading frames the Expert reading as one pipe, which its own body refutes',
  },
  {
    id: 'fc2-efficiency-linear',
    // A heading may not call the efficiency a linear multiplier of every form.
    // General Flow re-solves its friction factor at the rate it settles on.
    heading: /multiplies every form linearly|linear on every form|every form linearly/i,
    body: () => true,
    why: 'a heading calls the efficiency linear on every form, which the efficiency table refutes for General Flow',
  },
  {
    id: 'fc2-held-count',
    // "HELD FOR LITERATURE" marks a figure with no publication behind it.
    // The goldens being synthetic is not a held figure, so a heading may not
    // count it among them.
    heading: /five (?:things|items) held|five held/i,
    body: () => true,
    why: 'a heading counts five held items where four are held and the fifth is what the goldens are',
  },
  {
    id: 'fc2-form-beats-bore',
    heading: /bigger decision than the bore|the form matters more than the bore/i,
    body: () => true,
    why: 'a heading says the form moves the answer further than the bore, which Section 12 computes the other way',
  },
];
