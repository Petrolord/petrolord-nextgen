# gasvalue PANELS TASK. Three explorer panels over one teaching lab.

Read LESSON_TASK.md first. The digest is the only teaching truth, and a panel is
a lesson a learner can move.

## Shape

One lab, `src/components/course/panels/gasvalue/gasvalueLab.js`, the ONLY file
that imports the vendored `packages/engines/engines/downstream/flareToValue.js`
and `packages/engines/engines/downstream/lpgCng.js` (and `modularRefinery.js`
for SCALING_EXPONENT, if a panel shows it). Every value it exports is pinned by
vitest in `gasvalueLab.test.js` against the figures the digest prints, so a
panel and a lesson can never disagree. The lab reads the teaching cases from
`gasvalue_fields.mjs` as mirrored under `tools/course-waves/gasvalue/`, through
`waveInputs.mjs`, never from `/root`.

Register the three ids in `src/content/courses/panelRegistry.js`:
`gasvalue-flare-explorer`, `gasvalue-route-explorer`,
`gasvalue-rollout-explorer`. The manifests already carry them, so
`src/lib/courseContent.test.js` fails "every panel referenced by a manifest is
registered" until they are registered. That red is expected at the foundation
and is this phase's to clear. The LAB phase also adds 'energy_transition' to
CourseModuleNav MODULE_ORDER after 'supply_chain', on the same line the `carbon`
branch adds it.

## THE BASIS RULE, AND IT IS THE PANEL RULE THAT MATTERS MOST HERE

**Every figure a panel shows is the engine's, on the engine's basis, with the
basis the engine names printed beside it.** A panel that wants to show the
shortcut for contrast (every unburned carbon as methane, the heating value on
mass, the fill limit on the other basis, the latent heat on volume, the gauge
reading typed as absolute, the one-bank cascade) takes it from the lab, which
computes it exactly as `gasvalue_dump.mjs` does, and labels it as the reading
the engine does not use. A panel never does its own arithmetic. Every computed
figure displays at the digest's precision (tonnes a year and cascade kilograms
to three decimals, dollars of revenue, cost, margin and capital to two, the rest
to four), so a learner reading a panel reads what a lesson quotes. Every CNG
pressure is labelled bar(a).

There is no clock in this course's path. The lab test proves it anyway: build
the whole snapshot under two faked system dates and under
`TZ=Pacific/Pago_Pago` and demand the same bytes. (modularRefinery exports a
function that reads the machine year, feasibilityEconomics; the lab must not
import it.)

## THE THREE

**`gasvalue-flare-explorer`** (Associate throughout)

- EGBEMA's analysis as an editable table with the engine's reference figures,
  the sheet sum and the engine's normalisation note when it does not sum to one
  (SECTIONS 3 and 4); the short sheet as a preset;
- the gas by the mole: heating value, inerts, CO2, carbon per mole, hydrocarbon
  carbon per mole, molar mass, kg per Mscf, with OGUTA and the studio's opening
  gas as presets (SECTION 5); the mass-weighted heating value from the lab,
  labelled as the reading the engine does not use;
- the liquids: gpm C2+ and C3+, the richness word against the two edges the
  engine was asked for (SECTION 7), the mass ceiling (SECTION 9); blanking a
  density or a heating value makes the figure missing, shown as its own state
  (SECTION 8); a blank carbon number filled from the reference (SECTION 6);
- the flare: volume, days, destruction and combustion efficiency and GWP as
  inputs with NO defaults (each starts blank and the engine's refusal shows);
  CO2, methane, CO2e and the methane share; the stand-in note when combustion is
  left out; the every-unburned-carbon methane from the lab beside the engine's
  (SECTIONS 10 to 13).

**`gasvalue-route-explorer`** (Professional throughout)

- the four route templates with their requirement envelopes; the learner sets
  limits and each check shows pass, fail or unchecked, and the route's verdict
  (SECTIONS 16 and 17);
- each route's yield against its ceiling on the current gas, refused above it
  (SECTION 18);
- a route's year: Mscf, product, revenue, operating cost, margin, value per
  Mscf; a blank cost named in assumedZero; the capital by the modular power law
  with the six-tenths reading beside it; the cash flow handed on, undiscounted
  (SECTIONS 19 and 20);
- the counterfactual: recovery, product combustion, displaced fuel, the avoided
  share and the net, the net minus the gross flare, and blockedBy while any
  input is missing (SECTION 21);
- credits: prices in the order typed, each point's total margin and whether it
  clears, the breakeven beside the lowest tested price that clears and the first
  price typed that clears; the refusal when the net is not positive (SECTION 22);
- the bid table with its ranking note, best only among routes that pass
  (SECTION 23).

**`gasvalue-rollout-explorer`** (Expert throughout)

- the LPG blend on its three bases with LPG_REFERENCE as presets (SECTION 25);
- the vessel: capacity, fill limit and its basis as a required choice with no
  default, usable stock, vapour space, cover, reorder and ullage, a blank lead
  time shown as missing (SECTION 26);
- the vaporizer's three terms and the design margin, the boiling point at the
  vaporizer's pressure as a required input, the refusal when the inlet sits
  above it (SECTION 27);
- the carousel: effective positions, the positions wholly working, the queue's
  wait and utilisation, and the throughput capacity (SECTION 28); the cylinder
  and trailer floats by Little's law (SECTION 29);
- the CNG bank: Z, ideal against real, the correlation's range, and a gauge
  toggle that adds a stated atmosphere and shows the difference (SECTION 30);
- the cascade: banks and the vehicle as inputs, fills before recharge, the gas
  left in the banks, the ledger that closes, the next vehicle's pressure, and
  the one-bank comparison (SECTION 31); the compressor as a unit bridge showing
  the standard volume, psia and the stage pressures only (SECTION 32); the
  forecourt queue, stable and unstable (SECTION 33);
- the customer's switch: cost per km, saving, payback, the efficiency ratio as
  a required input, and the no-saving case (SECTION 34).

## THE CAPSTONE GUARD

Write `panelCapstoneGuard.test.js` on FC6's pattern: every graded value in
`fields.json`, rendered at its precision.json decimals and to two, signed and
unsigned, must appear in no panel, lab or page source, with a permanent plant
proving the detector fires. The guard must also refuse the names ERIEMU,
ADIBAWA and ASABA anywhere in the panel tree.

## Copy

No em dashes, no en dashes, no "X, not Y" contrastive in any label, tooltip or
caption. A basis is the engine's word; a refusal is the engine's sentence.
