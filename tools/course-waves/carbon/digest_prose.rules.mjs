// carbon (Carbon & Energy Efficiency): the wave's own heading claims,
// cleared phrases and engine pins for /root/dc-wavekit/digestprose.mjs.
//
//   node /root/dc-wavekit/digestprose.mjs \
//     /root/et-wip-carbon/digest.txt --rules /root/et-wip-carbon
//
// THIS WAVE'S HISTORY POSITION. The digest teaches the engines as they are at
// df31f53 (MD5-0 and MD45-1). SECTION 25 names the rules MD5-0 and MD45-1 put in force as rules in
// force, each in the present tense with the section that prints it. Nothing in
// the digest describes what an engine or a page used to return.
//
// THE PINS are every engine sentence the digest quotes after REFUSED: or as
// verbatim, split at sentence ends, each pinned to the module it comes from,
// so an upstream engine edit turns this gate RED instead of letting a stale
// quote pass as current behaviour. Apostrophes are pinned as the source
// escapes them.
export default {
  enginesRoot: process.env.MD_ENGINES || '/root/wt-et-carbon-nextgen/packages/engines',

  headings: [
    {
      id: 'cb-read-as-100',
      heading: /THE IGBOGENE FLARE AS AN INVENTORY LINE/,
      // The blank row must be a refusal; a flare figure printed for a blank
      // destruction efficiency makes the section's teaching false.
      body: (b) => !/Blank: REFUSED: A destruction efficiency is required\./.test(b),
      why: 'the flare section prints a figure for a blank destruction efficiency',
    },
    {
      id: 'cb-reportable',
      heading: /COMPUTED AND REPORTABLE/,
      // Every step but the last must be not reportable, and the last reportable.
      body: (b) => {
        const rows = b.split('\n').filter((l) => /^\| (as a first pass|the GWP set declared|the flare efficiency entered|the electricity factor entered|the survey referenced)/.test(l));
        if (rows.length !== 5) return true;
        return rows.slice(0, 4).some((l) => !/\| true \| false \|/.test(l)) || !/\| true \| true \| none \|$/.test(rows[4]);
      },
      why: 'the computed-and-reportable steps do not end reportable, or an earlier step reads reportable',
    },
    {
      id: 'cb-ratio-not-difference',
      heading: /WHAT TUNING THE EXCESS AIR IS WORTH/,
      body: (b) => !/below the engine's saving/.test(b),
      why: 'the tuning section does not print the shortcut against the engine saving',
    },
    {
      id: 'cb-threshold',
      heading: /THE PINCH: MINIMUM UTILITIES BY THE PROBLEM TABLE/,
      body: (b) => !/\| 0\.000 \| 1470\.000 \| none \| true \|/.test(b),
      why: 'the threshold problem row does not read zero hot utility, no pinch, threshold true',
    },
    {
      id: 'cb-over-claim',
      heading: /SOURCES, INTERACTIONS AND OVER-CLAIMS/,
      body: (b) => !/\| none \| not assessed: claims exceed what a source emits \|/.test(b),
      why: 'the over-claim row does not read meetsTarget none, not assessed',
    },
    {
      id: 'cb-invented',
      heading: /THE COST OF A TONNE ABATED/,
      body: (b) => !/every figure invented/.test(b),
      why: 'the measures are printed without saying they are invented',
    },
  ],

  // Phrases that match the history keyword family and are NOT history. Each
  // was read by hand and is listed with what it actually says.
  cleared: [
    // The count of assertions the generator made before printing, present tense.
    /asserted before printing/,
  ],

  pinned: [
    { frag: "A baseline and a valid year range are required.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A blank is not read as 0, which would annualise straight-line and move the measure down the curve.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A blank is not read as a full year.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A boiler efficiency in (0, 1] is required:", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A boundary must be named.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A cost per tonne needs the measure life and a discount rate, to annualise the implementation cost against a yearly saving.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A destruction efficiency is required.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A discharge coefficient in (0, 1] is required and is not defaulted:", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A downstream pressure is required when the box is there.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A floor on the value:", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A flue gas specific heat is required.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A fuel quantity and a carbon content cannot be negative.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A fuel quantity and the carbon per kilomole of fuel are required.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A gigajoule on one heating value basis is a different amount of fuel on the other, so they cannot be multiplied together.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A global warming potential must be positive.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A heat capacity flowrate cannot be negative.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A measure that adds emissions has no place on an abatement curve, and its cost per tonne would change sign.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A measured dry stack oxygen is required.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A minimum approach temperature is required and must not be negative.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A minimum safe stack oxygen is required and is not defaulted.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A positive denominator is required.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A radiation and convection loss is required and is not defaulted.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A refused measure is off the curve and out of every total until it is costed.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A registered emission factor is required.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "A stack temperature and a combustion air temperature are required.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A throughput is required.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "AR6 gives methane two 100-year values:", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "An efficiency on the other basis is a different number for the same heater and the two must not be compared.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "An energy saving is required.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "An inventory on one report is not comparable with one on another, so the set is stated on every result.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "An inventory that computed nothing leaves the baseline unknown.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "An isentropic exponent above 1 is required:", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "An orifice diameter, an upstream pressure and a steam density are required.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "An oxygen reading alone cannot see carbon monoxide, so a stack making CO will read as if it had more excess air than it has.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Any peer figure compared here is one you supplied and have the right to use.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Below some excess air a burner makes carbon monoxide, and where that point sits depends on the burner, the fuel and the draught control.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Carbon needs the steam energy content, the boiler efficiency and an emission factor.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Carbon that escaped combustion is counted as methane, which is the usual and conservative assumption.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Comparable only with an intensity on the same boundary (", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Complete combustion.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Emissions cannot fall below zero, so check the measures for double counting or a source outside the baseline.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Enter 0 if it needs none:", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Fuel needs a boiler efficiency in (0, 1].", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Fuel scales inversely with efficiency at the same duty, so the saving is (target - current) / target.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Global warming potentials differ between IPCC assessment reports.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Heat carried across the pinch costs twice:", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Hours in service a year are required, between 0 and 8784.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "It comes off a published chart against surface area and firing rate, which this module does not reproduce.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "It is independent of the Solomon Energy Intensity Index, a proprietary benchmark with its own standard-energy methodology.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "A wedge is drawn only for an identified measure, because a plan needs a named measure behind every wedge.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "This is a quantitative inventory of tonnes.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "It is not assumed to be 1.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "It is not read as 100 percent:", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Measures listed here act on the same source, so their abatements overlap and the cumulative curve is an upper bound.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "No downstream pressure was given, so the trap is taken to vent to atmosphere (", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "No emission factor supplied, so the carbon figure is left blank.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "No heating value basis declared.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "No stream changes temperature, so there is nothing to target.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Not compared with the peer:", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "On HHV the latent heat of the water made from hydrogen is a loss, because HHV counted it as available.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "On LHV only the sensible heat of the water vapour is a loss, because LHV never counted the latent heat as available.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "On a higher-heating-value basis the moisture loss needs both the latent heat of water and the vapour specific heat.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Override it if you have measured otherwise.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Raise the target or re-declare the floor after a combustion test.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Resolving the overlap needs an engineering judgement about sequencing, so the overlap is flagged here and the sequencing is left to that judgement.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Return fractions must lie between 0 and 1.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Returning less condensate is a cost, so there is nothing to value.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Set against one year's saving, a one-off capital cost overstates the cost per tonne of a capital measure.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Stack oxygen must be 0 percent or more and below ", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "The divisor is the target efficiency. Subtracting the efficiency percentages divides by a hundred and understates the saving.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "That double cost is what makes the pinch the constraint on the design.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "The atom balance here counts carbon that escapes a burner or a flare as methane, so the oxidation CO2 is counted nowhere else and the fossil value is the consistent one for vented, fugitive and unburned fossil methane alike.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "The baseline must be a positive tonnage.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "The destruction efficiency must lie in (0, 1].", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "The discount rate is a fraction greater than -1 and below 1 (0.1 for ten percent).", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "The downstream pressure must be an absolute pressure of zero or more, in bar a.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "The gap is reported as unabated with no measure identified.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "The heating value basis must be LHV or HHV.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "The radiation and convection loss cannot be negative:", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "The saving, the fuel price and the emission factor must all be on the same one (IPCC default factors are on net calorific value, which is LHV).", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "The target stack oxygen is required, so that it can be checked against the declared safe floor.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "The treatment cost is the one usually left out.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "The two efficiencies are on different bases (", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "The unburned and other loss cannot be negative:", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "This is a quantitative inventory.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "This is conservation of mass, so it needs no source document.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "This is the plant\\'s own energy per tonne of throughput.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "This set holds one.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Tonnes per tonne charged and tonnes per tonne of saleable product are different numbers for the same plant, and an intensity without its boundary cannot be compared with anything.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Use the fossil methane potential for it.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Valid stoichiometry is required.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Whether a stream is hot or cold is set by its supply and target temperatures.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "Without them the carbon figure is left blank.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "a blank is not read as free.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "a loss below zero would add to the efficiency.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "a stream is missing, so the intensity is a floor and would flatter the plant.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "about 1.3 for superheated steam and about 1.135 for dry saturated steam.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "carbon in equals CO2 out.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "for a flare it is the answer, and it is contested.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "fossil (29.8) and non-fossil (27.0).", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "is at or below the critical ", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "it depends on the orifice and on how the trap failed.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "needs an annual abatement.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "Obligations, evidence and deadlines belong in the compliance register, which keeps the one record of them; a second copy here would create two records that could disagree.", src: 'engines/downstream/carbonAbatement.js' },
    { frag: "one unit more hot utility and one unit more cold utility.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "percent is air with no fuel burned.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "so no steam flows through the trap.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "so the loss depends on the upstream pressure alone.", src: 'engines/downstream/energyEfficiency.js' },
    { frag: "the fuel saved depends on it and it is not assumed.", src: 'engines/downstream/energyEfficiency.js' },
  ],
};
