// riskchange, Risk, Change & Learning: the wave's own heading claims, cleared
// phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs /root/as-wip-riskchange/digest.txt \
//     --rules /root/as-wip-riskchange
//
// THIS WAVE'S HISTORY POSITION. Framed history is curriculum; unframed history
// is a defect. SECTION 20 is the one section whose SUBJECT is what these
// engines used to do, and it says so in its TITLE and its FIRST LINE. Nothing
// above Section 20 is history.
export default {
  enginesRoot: process.env.RC_ENGINES || '/root/wt-as-riskchange-nextgen/packages/engines',

  headings: [
    {
      id: 'rc-six-dispositions',
      heading: /six dispositions/i,
      // The status table under the heading must list exactly six "from" rows.
      body: (b) => b.split('\n').filter((l) => /^\| "(Open|Responded|Verified|Closed|Rejected|Withdrawn)" \|/.test(l)).length !== 6,
      why: 'a heading promises six dispositions over a table that lists a different number',
    },
    {
      id: 'rc-four-bands',
      heading: /the four bands/i,
      body: (b) => b.split('\n').filter((l) => /^\| "(Critical|High|Medium|Low)" \| \d+ \| \d+ \|$/.test(l)).length !== 4,
      why: 'a heading promises four bands over a band table that lists a different number',
    },
    {
      id: 'rc-due-today',
      heading: /a review due today/i,
      // Every row whose days-until is 0 must read "no" in its overdue column.
      body: (b) => b.split('\n').some((l) => /^\| OB-\d+ \| "[^"]+" \| [\d-]+ \| 0 \| yes \|$/.test(l)),
      why: 'a heading says a review due today is not overdue over a row that is due today and reads overdue',
    },
  ],

  // Engine strings this digest quotes verbatim, pinned to the module they come
  // from, so an upstream engine edit turns this gate red.
  pinned: [
    { frag: 'The originator of a change cannot approve it. Choose somebody independent of the change.', src: 'engines/assurance/managementOfChange.js' },
    { frag: 'Only the person this approval is assigned to can decide it. If they are unavailable, reassign it.', src: 'engines/assurance/managementOfChange.js' },
    { frag: 'has not signed yet.', src: 'engines/assurance/managementOfChange.js' },
    { frag: 'A comment cannot be verified before the author has responded to it.', src: 'engines/assurance/peerReview.js' },
    { frag: 'still need resolving. Verify, close out or withdraw them first.', src: 'engines/assurance/peerReview.js' },
    { frag: 'Ask a colleague who was not involved in writing it to validate it.', src: 'engines/assurance/lessonsLearned.js' },
    { frag: 'A lesson that changed nothing has not been learned.', src: 'engines/assurance/lessonsLearned.js' },
  ],

  cleared: [],
};
