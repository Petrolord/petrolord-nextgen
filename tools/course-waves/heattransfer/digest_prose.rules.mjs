// FC6 Heat Exchange & Cooling: the wave's own claims, cleared phrases and
// engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs \
//     /root/fc-wip-heattransfer/digest.txt --rules /root/fc-wip-heattransfer
//
// THIS WAVE'S HISTORY POSITION. Framed history is curriculum; unframed history
// is a defect. SECTION 21 of this digest is the one section whose SUBJECT is
// what the engine used to do, and it says so in its TITLE and in its FIRST
// LINE, so the kit reports its sentences as framed. Nothing above Section 21 is
// history. Warnings that section raises are re-read by hand on every rebuild
// rather than cleared, because clearing them would make the one place in this
// digest that carries history the one place nobody checks.
export default {
  enginesRoot: process.env.FC6_ENGINES || '/root/wt-fc6-nextgen/packages/engines',

  // Heading claims this digest makes that a block could contradict. Each is a
  // real way one of THESE section titles could go stale.
  //
  // TWO CLASSES ARE DELIBERATELY NOT HERE, because they sit on ordinary prose
  // lines that no heading shape matches: a COUNTED claim over a block with a
  // different count, and a DIRECTION claim over a table whose columns move the
  // other way. Both are checked in gate_claims.mjs, which reads the digest as
  // text, and both have a negative control there.
  headings: [
    {
      id: 'fc6-no-ceiling',
      heading: /has NO ceiling|no ceiling below one|with none/i,
      // The counter-current column of the ceiling table must read `none`. A
      // block that prints a number there has made the claim false.
      // THE CLAIM IS "no ceiling BELOW ONE", so the block contradicts it only
      // when THE CEILING TABLE'S counter-current column carries a number
      // strictly below one. Two earlier drafts of this rule were wrong in two
      // different ways and both were caught by running it: the first read the
      // capacity-ratio-of-zero row, where every arrangement reaches one and the
      // claim is holding, and the second read EVERY table in the section,
      // because a section heading owns everything down to the next section and
      // this one carries an effectiveness grid whose cells are all below one.
      // The table is found by its own header row and read to the blank line.
      body: (b) => {
        const lines = b.split('\n');
        const at = lines.findIndex((l) => /\| counter-current ceiling \|/.test(l));
        if (at === -1) return false;
        for (let i = at + 1; i < lines.length && lines[i].trim() !== ''; i += 1) {
          if (!/^\| \d/.test(lines[i])) continue;
          const cell = lines[i].split('|').map((c) => c.trim()).filter(Boolean).pop();
          if (/^\d/.test(cell) && Number(cell) < 1) return true;
        }
        return false;
      },
      why: 'a heading says counter-current flow has no ceiling over a table printing a number in its counter-current ceiling column. The help text this course corrects made exactly that claim the other way round',
    },
    {
      id: 'fc6-collapse',
      heading: /collapse onto one curve|all three arrangements collapse/i,
      body: (b) => b.split('\n').filter((l) => /^\| \d/.test(l)).some((l) => /\| no \|\s*$/.test(l)),
      why: 'a heading says three arrangements collapse onto one curve over a table whose own equality column says they do not',
    },
    {
      id: 'fc6-rated-not-scaled',
      heading: /rated at fixed UA|rated rather than scaled/i,
      body: (b) => /scaled by the ratio of (the )?two log means/i.test(b) && !/used to|HISTORY/i.test(b),
      why: 'a heading says the hot day is rated at fixed UA over a block describing it being scaled, with no frame saying that is history',
    },
    {
      id: 'fc6-nothing-graded-held',
      heading: /NOTHING IN THIS COURSE GRADES ONE|nothing here grades/i,
      body: (b) => /graded at|fields\.json/i.test(b),
      why: 'a heading says no held item is graded over a block that reaches into the answer key. The two roads are separate and the digest is the one that carries no graded value at all',
    },
    {
      id: 'fc6-declared-not-published',
      heading: /DECLARED BY THIS MODULE|declared rather than published/i,
      body: (b) => /published (limit|bound|source) for (this|that)/i.test(b),
      why: 'a heading says a bound is declared by the module over a block claiming a publication for it. Two bounds in this engine are declared and the refusals say so; a course that upgrades one to a citation has invented the citation',
    },
    {
      id: 'fc6-withheld',
      heading: /WITHHELD/i,
      body: (b) => b.trim().length > 0 && !/prints NOTHING|prints none/i.test(b),
      why: 'a heading says WITHHELD over a block that prints content. Nothing in this wave is withheld, and this rule is here so that if a later phase holds a section the words have to go when the content arrives',
    },
  ],

  // Phrases that match the history keyword family and are NOT history. Each
  // was read by hand and is listed with what it actually says.
  cleared: [
    // A live property of the oracle and of the golden file, present tense.
    /the oracle (now )?(reaches|bisects|marches|goes through)/i,
    // The engine's own verbatim register text, quoted as current behaviour.
    /HELD_FOR_LITERATURE|held for literature/i,
    // The refusal the engine returns TODAY when a count cannot divide.
    /the engine used to floor this at one tube per pass/i,
  ],

  // Every engine message family this digest quotes verbatim, pinned to the
  // module it comes from, so an upstream engine edit turns this gate RED
  // instead of letting a stale quote pass as current behaviour.
  pinned: [
    { frag: 'the arrangement must be one of', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'will not fall back to one of them', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'An exchanger takes heat out of this stream.', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'An exchanger puts heat into this stream.', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'A zero or negative duty is not an exchanger', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'State one of them.', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'so they must have crossed inside', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'No exchanger of any size does that.', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'the log mean needs all four terminal temperatures', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'one of them is not positive', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'a 1-2 shell exchanger is rated on the counter-current log mean multiplied by F', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'so R is undefined and no number of shell passes changes that', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'shells come in whole numbers', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'The engine will not round for you', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'is a design limit declared by this module, not a published one', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'F needs 0 <= P < 1', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'F needs R > 0', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'A negative fouling allowance is surface that cleans itself', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'the wall conductivity must be positive', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'the tube outside diameter must exceed the inside diameter', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'jointly controlling rather than acting on the word', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'outside tube surface (do)', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'this module carries only the HEATING form of Dittus-Boelter', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'Type the tube-side film instead of computing it.', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'is in the transition band', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'no film correlation is trustworthy here', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'cannot be divided equally into', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'does NOT move with the flow rate', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'the F correction must be greater than 0 and at most 1', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'bundle constants for 30, 45 and 90 degree layouts only', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'bundle constants for 1, 2, 4 and 6 tube passes only', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'the 45 and 90 degree constants carried here are identical', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'Cr is Cmin over Cmax by definition', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'whatever its area', src: 'engines/facilities/heatTransfer.js' },
    { frag: "the draft type must be 'forced' or 'induced'", src: 'engines/facilities/heatTransfer.js' },
    { frag: 'the fan efficiency must be greater than 0 and at most 1', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'a motor drawing less than the shaft it turns', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'the fan static pressure must be positive inches of water', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'a cooler takes the process DOWN', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'effectiveness-NTU at fixed UA and fixed air mass', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'this cooler has no driving force at all', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'This is a capability, not a delivered duty', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'is no longer reachable at', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'counter-current-basis area', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'Nothing here grades them.', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'the 45 and 90 degree rows', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'They are pinned in DECLARED_CONSTANTS so that moving one is a', src: 'engines/facilities/heatTransfer.js' },
    { frag: 'which is water at roughly 80 F', src: 'engines/facilities/heatTransfer.js' },
  ],
};
