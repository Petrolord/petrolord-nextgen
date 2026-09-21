// crude (Crude Assay & Blending): the wave's own heading claims, cleared phrases
// and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs \
//     /root/md-wip-crude/digest.txt --rules /root/md-wip-crude
//
// THIS WAVE'S HISTORY POSITION. The digest teaches the engines as they are at
// 60ee266, after MD1-0. It never narrates what an engine used to return: the
// nineteen MD1-0 repairs are taught as how the engines work, and the three
// FINDINGS HELD items (L4, C12, C13) are stated as limits in the present tense
// in SECTION 27.
const cells = (l) => l.split('|').slice(1, -1).map((c) => c.trim());
const tableRows = (b, headRe) => {
  const lines = b.split('\n');
  const at = lines.findIndex((l) => headRe.test(l));
  if (at === -1) return null;
  const out = [];
  for (let i = at + 2; i < lines.length && lines[i].startsWith('|'); i += 1) out.push(cells(lines[i]));
  return out;
};

export default {
  enginesRoot: process.env.MD_ENGINES || '/root/wt-md-crude-nextgen/packages/engines',

  // Heading claims this digest makes that a block could contradict.
  headings: [
    {
      id: 'md-api-through-sg',
      heading: /API GOES THROUGH SPECIFIC GRAVITY/i,
      // Every row: blend API minus the mass-weighted mean is 0.0000, and minus
      // the volume-weighted mean is not.
      body: (b) => {
        const rows = tableRows(b, /^\| blend \(by volume\) \| blend SG \| blend API/);
        if (!rows) return true;
        return rows.some((r) => r[6] !== '0.0000' || r[4] === '0.0000');
      },
      why: 'a heading says API goes through specific gravity over a table where the blend API equals the volume average, or differs from the mass-weighted mean',
    },
    {
      id: 'md-sulfur-on-mass',
      heading: /PER-MASS PROPERTIES BLEND ON MASS/i,
      body: (b) => (tableRows(b, /^\| blend \| property \| on mass/) || []).some((r) => r[5] !== 'mass'),
      why: 'a heading says per-mass properties blend on mass over a row whose engine basis is not mass',
    },
    {
      id: 'md-yields-add',
      heading: /CUT YIELDS OF THE BLEND/i,
      // The blend's own yields equal the volume-weighted component yields.
      body: (b) => {
        const rows = tableRows(b, /^\| cut \| Kwale Light \| Ughelli Medium \| the blend/);
        if (!rows) return true;
        return rows.filter((r) => r[0] !== 'total').some((r) => r[5] !== '0.0000');
      },
      why: 'a heading teaches the blend\'s cut yields over a table where the blend and the volume-weighted component yields disagree',
    },
    {
      id: 'md-binding',
      heading: /BINDING SPECIFICATIONS/i,
      // A row marked binding has zero giveaway, and a row with giveaway is not binding.
      body: (b) => (tableRows(b, /^\| specification \| min \| max \| achieved \| giveaway \| binding/) || [['x', '', '', '', '1', 'true']])
        .some((r) => (r[5] === 'true') !== (r[4] === '0.0000')),
      why: 'a heading teaches binding specifications over a table where a binding row gives quality away or a slack row is marked binding',
    },
    {
      id: 'md-relief',
      heading: /SHADOW PRICES AS THE VALUE OF RELIEF/i,
      // A binding specification row prices relief above zero.
      body: (b) => (tableRows(b, /^\| row \| price \(value of one unit of relief\)/) || [])
        .filter((r) => /^(Sulfur|RVP) maximum$/.test(r[0])).some((r) => !(Number(r[1]) > 0)),
      why: 'a heading says shadow prices are the value of relief over a binding row whose relief is not positive',
    },
    {
      id: 'md-infeasible',
      heading: /INFEASIBLE, REFUSED AND SKIPPED/i,
      body: (b) => !/\| infeasible \| REFUSED: /.test(b),
      why: 'a heading teaches infeasible as an answer over a block with no infeasible row',
    },
    {
      id: 'md-held-not-graded',
      heading: /HELD LIMITS/i,
      body: (b) => /graded at|fields\.json|expected value|capstone/i.test(b),
      why: 'a heading states the held limits over a block that reaches into the answer key',
    },
  ],

  // Phrases that match the history keyword family and are NOT history. Each
  // was read by hand and is listed with what it actually says.
  cleared: [
    // The count of refusals this build asserted: a property of the build, present tense.
    /Refusals printed in this digest, each asserted against the engine before it was printed/,
  ],

  // Every engine message this digest quotes verbatim, pinned to the module it
  // comes from, so an upstream engine edit turns this gate RED instead of
  // letting a stale quote pass as current behaviour.
  pinned: [
    { frag: 'No components to blend.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'Every property here is weighted by density.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'Give every crude a volume share, or give every crude a mass share. The two cannot be mixed.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'Give every crude a volume share or a mass share.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'A blend share must be a number of zero or more.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'The blend shares add up to zero.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'computed from the volume-blended specific gravity, never averaged directly', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'not blended: a component viscosity is missing or outside the index domain', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'Refutas index on mass fraction', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'not blended: no value for ', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'Screens stable on the colloidal instability index.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'spot test to ASTM D7112 or D7157 before commingling.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'Do not commingle without a lab test.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'this is the combination that classically drops asphaltenes.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'and that alone says nothing about whether the blend is stable. Supply SARA for a real index.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'No SARA analysis and not every crude has a gravity, so no stability screen was made.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'Losses must be between 0 and 100 percent.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'D86 to TBP conversion needs the API Technical Data Book Procedure 3A1.1 coefficient table', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'The D86 curve needs a 50 percent point to anchor the conversion.', src: 'engines/downstream/crudeAssay.js' },
    { frag: 'No recipe from these components can meet every specification. Relax a limit, or bring in a component that can.', src: 'engines/downstream/productBlending.js' },
    { frag: 'The target volume must be greater than zero.', src: 'engines/downstream/productBlending.js' },
    { frag: 'A least-cost recipe needs a price on every component; remove the component or give it one.', src: 'engines/downstream/productBlending.js' },
    { frag: 'must be a number of zero or more. Leave a maximum blank for no limit.', src: 'engines/downstream/productBlending.js' },
    { frag: 'has a minimum above its maximum.', src: 'engines/downstream/productBlending.js' },
    { frag: 'Not every component carries this property, so the specification was not applied.', src: 'engines/downstream/productBlending.js' },
    { frag: 'This property blends on mass and not every component has a density (sg or API), so the specification was not applied.', src: 'engines/downstream/productBlending.js' },
    { frag: 'has ${row.length} coefficients, expected ${n}', src: 'lib/lp/simplex.js' },
  ],
};
