// gasvalue (Flare Gas to Value & LPG/CNG): the wave's own heading claims,
// cleared phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs \
//     /root/et-wip-gasvalue/digest.txt --rules /root/et-wip-gasvalue
//
// THIS WAVE'S HISTORY POSITION. The digest teaches the engines as they are at
// df31f53 (MD45-1, after MD4-0). It never narrates what an engine used to return: the
// eighteen MD4-0 repairs are taught as how the engines work, and the four
// FINDINGS HELD items (H1 to H4) are stated as limits in the present tense in
// SECTIONS 14 and 35.
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
  enginesRoot: process.env.ET_ENGINES || '/root/wt-et-gasvalue-nextgen/packages/engines',

  // Heading claims this digest makes that a block could contradict.
  headings: [
    {
      id: 'gv-co2-passes-through',
      heading: /THE FLARE BY 40 CFR 98\.233\(n\)/i,
      // The all-CO2 probe gives the same CO2 at both efficiencies and no methane.
      body: (b) => {
        const rows = tableRows(b, /^\| probe \| flareCo2Tonnes \| flareCh4Tonnes/);
        if (!rows) return true;
        const co2 = rows.filter((r) => /^all CO2/.test(r[0]));
        return co2.length !== 2 || co2[0][1] !== co2[1][1] || co2.some((r) => r[2] !== '0.000');
      },
      why: 'the flare section says the CO2 in the gas passes through over a probe table where it does not',
    },
    {
      id: 'gv-stand-in',
      heading: /DESTRUCTION AND COMBUSTION EFFICIENCY/i,
      // The stand-in row leaves the methane unchanged.
      body: (b) => {
        const rows = tableRows(b, /^\| EGBEMA \| combustion efficiency used/);
        if (!rows) return true;
        const diff = rows.find((r) => r[0] === 'left out minus given');
        return !diff || diff[3] !== '0.000';
      },
      why: 'a heading teaches the two efficiencies over a table where the stand-in moves the methane',
    },
    {
      id: 'gv-three-verdicts',
      heading: /PASS, FAIL AND NOT FULLY SCREENED/i,
      body: (b) => !(/\| passes \|/.test(b) && /\| fails \|/.test(b) && /\| not fully screened \|/.test(b)),
      why: 'a heading names three screening verdicts over a block that does not show all three',
    },
    {
      id: 'gv-recovered-share',
      heading: /ONLY THE RECOVERED SHARE IS AVOIDED/i,
      // avoided = flare x recovery on every row, to the printed place.
      body: (b) => (tableRows(b, /^\| counterfactual \| flareCo2eTonnes \| recoveryFraction/) || [['x', '1', '1', '0']])
        .some((r) => Math.abs(Number(r[1]) * Number(r[2]) - Number(r[3])) > 0.002),
      why: 'a heading says only the recovered share is avoided over a row where avoided is not the flare times the recovery',
    },
    {
      id: 'gv-cascade-conserves',
      heading: /THE CASCADE: EQUALISING BANK BY BANK/i,
      body: (b) => !/\| storedKg minus deliveredKg minus leftInBanksKg \| -?0\.00[0-2] \|/.test(b),
      why: 'the cascade section teaches conservation over a table whose ledger does not close',
    },
    {
      id: 'gv-held-not-graded',
      heading: /HELD LIMITS|WHAT THE FLARE MODEL LEAVES OUT/i,
      body: (b) => /graded at|fields\.json|expected value|capstone/i.test(b),
      why: 'a heading states the held limits over a block that reaches into the answer key',
    },
  ],

  // Phrases that match the history keyword family and are NOT history.
  cleared: [
    /Refusals printed in this digest, each asserted against the engine before it was printed/,
  ],

  // Every engine message this digest quotes verbatim, pinned to the module it
  // comes from, so an upstream engine edit turns this gate RED instead of
  // letting a stale quote pass as current behaviour.
  pinned: [
    { frag: 'Molar masses and carbon numbers are definitional. Heating values and liquid densities are typical', src: 'engines/downstream/flareToValue.js' },
    { frag: 'were scaled to one. Check the analysis if that was not intended.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'The flare\'s CO2 is counted atom by atom, so it is not assumed.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'A mole fraction cannot be negative.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'Every component needs a mole fraction.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'The gas composition sums to nothing.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'Derived from the composition and the component liquid densities', src: 'engines/downstream/flareToValue.js' },
    { frag: 'A heating value missing on any component leaves the mixture value missing too. No partial average is reported.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'It is a floor: the full duty is at least this.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'reported as missing for the blend. It is never averaged over the components that have it.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'CO2 = the CO2 in the gas plus the combustion efficiency times the hydrocarbon carbon', src: 'engines/downstream/flareToValue.js' },
    { frag: 'No combustion efficiency was given, so the destruction efficiency stands in for it.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'no methane global warming potential supplied', src: 'engines/downstream/flareToValue.js' },
    { frag: 'A flare destruction efficiency in (0, 1] is required.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'A flare combustion efficiency must lie in (0, 1] and cannot exceed the destruction efficiency.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'A gas volume is required.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'On-stream days are required, more than 0 and no more than 366.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'A characterised gas is required.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'Requirement limits are yours to set.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'CO2 freezes in a liquefaction train and must be removed first.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'Below this the liquids do not pay for the plant, whatever the gas is worth.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'A yield above what the gas contains is refused.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'needs a positive product yield per Mscf.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'needs a recovery fraction in (0, 1]. A recovery assumed at 100 percent is the quiet optimism that sinks these cases.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'handed to the sanctioned economics engine. A second discounted cash flow in this module would be a second answer.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'No capital cost: a reference plant cost and capacity are required to scale from.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'no recovery fraction in (0, 1]: gas the plant does not recover is still flared', src: 'engines/downstream/flareToValue.js' },
    { frag: 'the counterfactual is not declared: what the product displaces, and what burning it emits', src: 'engines/downstream/flareToValue.js' },
    { frag: 'No abatement is reported. The flare\\\'s gross emission is the starting point, and the abatement depends on what the recovered product displaces', src: 'engines/downstream/flareToValue.js' },
    { frag: 'This is a bet on the credit price.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'Clears the hurdle on its own. Credits are upside; the case stands without them.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'the project does not abate, so there are no credits to sell.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'No net abatement to sell. Declare the counterfactual first', src: 'engines/downstream/flareToValue.js' },
    { frag: 'The hurdle margin must be a number.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'No margin for this route, so whether it needs credits cannot be said.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'No hurdle margin, so whether it needs credits cannot be said.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'Ranked on gross margin per Mscf, which ignores the capital.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'No route passes screening yet, so none is ranked best.', src: 'engines/downstream/flareToValue.js' },
    { frag: 'Typical values only, offered as a starting point.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Every component needs a volume fraction.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A liquid density is required for every component; it is not assumed.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A volume fraction cannot be negative.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A maximum fill ratio is required and is not defaulted.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'The maximum fill ratio must lie between 0 and 1.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Unknown fill ratio basis', src: 'engines/downstream/lpgCng.js' },
    { frag: 'At this density the filling density fills the vessel liquid-full. Check the limit and its basis.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A liquid density is required; it is not assumed.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Duty covers only the terms supplied. Missing: ', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A liquid above its boiling point is not liquid: give the boiling point at the vaporizer\'s operating pressure.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'so it would condense. Give an outlet above the boiling point at the vaporizer\'s pressure.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A latent heat of vaporisation is required; it is a property of the product and is not assumed.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'The design margin cannot be negative.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'because a queue has a whole number of servers. The throughput capacity below uses the unrounded figure.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Availability reduces the positions that are working; utilisation is how busy the working ones are.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'positions are working on average: fewer than one.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Shift hours must be positive and availability must lie in (0, 1].', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Demand, fill time and a position count are required and must be positive.', src: 'engines/downstream/lpgCng.js' },
    { frag: "Little's Law: assets in the system = throughput x time in the system.", src: 'engines/downstream/lpgCng.js' },
    { frag: 'A stage left out shrinks the fleet by the assets in it, so the fleet is not sized without it.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'At least one cycle stage with a duration is required.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'The spares allowance cannot be negative.', src: 'engines/downstream/lpgCng.js' },
    { frag: "export const PRESSURE_BASIS = 'absolute (bar(a))';", src: 'engines/downstream/lpgCng.js' },
    { frag: 'Outside the range the Dranchuk-Abou-Kassem correlation was fitted over.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A pressure is required.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A gas specific gravity is required.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A temperature is required.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Each vehicle equalises with the lowest bank above it, then the next bank up, until it reaches its target.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A start and a higher target pressure are required.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'At least one bank is required.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Every bank needs a volume and a pressure.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Staging, polytropic head and real-gas Z from the Facilities compression engine', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A suction pressure and a higher discharge pressure are required.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A throughput is required.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'The dispensers cannot keep up with arriving vehicles. The forecourt queue grows without limit', src: 'engines/downstream/lpgCng.js' },
    { frag: 'The number of dispensers must be a whole number, one or more.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Arrivals, fill time and a dispenser count are required and must be positive.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'A CNG fill takes minutes, so a forecourt queues at traffic a liquid-fuel operator would think of as quiet.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Simple payback is undiscounted. Anything needing a discount rate belongs in the sanctioned economics engine.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'The conversion does not save money at these prices, so there is no payback to report.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'or both fuels\\\' energy content and an efficiency ratio, are required. Neither is assumed.', src: 'engines/downstream/lpgCng.js' },
    { frag: 'Annual distance, base consumption and both fuel prices are required.', src: 'engines/downstream/lpgCng.js' },
  ],
};
