# supply PANELS TASK. Three explorer panels over one teaching lab.

Read LESSON_TASK.md first. The digest is the only teaching truth, and a panel
is a lesson a learner can move.

## Shape

One lab, `src/components/course/panels/supply/supplyLab.js`, the ONLY file that
imports the vendored `packages/engines/engines/downstream/terminalDepot.js` and
`fuelPricing.js`. Every value it exports is pinned by vitest in
`supplyLab.test.js` against the figures the digest prints, so a panel and a
lesson can never disagree. The lab reads the teaching cases from
`supply_fields.mjs` as mirrored under `tools/course-waves/supply/`, through
`waveInputs.mjs`, never from `/root`.

Register the three ids in `src/content/courses/panelRegistry.js`:
`supply-tank-explorer`, `supply-depot-explorer`, `supply-price-explorer`. The
manifests already carry them, so `src/lib/courseContent.test.js` fails "every
panel referenced by a manifest is registered" until they are registered. That
red is expected at the foundation and is this phase's to clear.

## THE RULES THAT MATTER MOST HERE

- **A missing input is missing.** A blank control goes to the engine as
  missing, never as 0, and the panel shows the engine's refusal. Never default
  a density, a bay count, a coefficient or an opening stock.
- **The opening stock is an input the learner types.** The tank explorer never
  derives it from the closing dip. It may offer a button that does so, labelled
  as the demonstration of SECTION 7, and the result must show unaccounted 0 for
  every dip.
- **No rate and no coefficient is shipped.** Every rate control starts at the
  digest's invented value and is labelled invented; the VCF coefficient row is
  labelled SYNTHETIC. No control offers a list of real rates or commodity
  groups.
- Neither engine reads a clock, so the lab needs no date; the lab test still
  builds the snapshot under `TZ=Pacific/Pago_Pago` and `TZ=Pacific/Kiritimati`
  and demands the same bytes.

## THE THREE

**`supply-tank-explorer`** (Associate throughout)

- the AKODO strapping tables, each drawn as height against volume with the
  entries marked; a dip slider per tank, showing the bracketing entries and the
  interpolated volume (SECTION 3), and the refusals at both ends and on a
  partial table (SECTION 4). At the digest's dips every volume must match
  SECTION 3;
- the water cut as a second slider, the water volume read through the same
  table and taken off, with the volume at the dip less the water HEIGHT drawn
  beside it on AK-03 and labelled as the reading the engine does not use
  (SECTION 5);
- the VCF: a typed VCF per tank (the digest's invented figures) and, in a
  separate box labelled SYNTHETIC, the ASTM D1250 form on the synthetic row
  with temperature and density sliders (SECTION 6);
- the day: opening stock, receipts, deliveries and known losses as inputs, the
  closing stock from the tanks, the unaccounted figure and the tolerance band
  on throughput (SECTION 7), and the nine-day trend with its run (SECTION 8).

**`supply-depot-explorer`** (Professional throughout)

- the IBAFO rack with arrivals, load minutes and bays as controls: offered
  load, utilisation, the probability of waiting, the mean wait and the queue,
  and the engine's refusal once utilisation reaches one (SECTIONS 9 to 11).
  Bays are a whole-number stepper; a fractional or zero entry shows the
  refusal;
- the tank farm tank by tank, each tank's heel drawn, pumpable stock summed
  tank by tank, days of cover and turns (SECTION 12). Show the farm's stock
  less its heel beside the pumpable stock, labelled as the figure the engine
  does not use;
- throughput economics with the carbon ledger beside the money one, the
  synthetic factor labelled (SECTION 13);
- the lane: every cost box, with a blank box named as missing (SECTION 14);
  the fleet from the lane's own trips (SECTION 15); and the forecourt with its
  nozzle stepper and the ullage check at the reorder level (SECTION 16).

**`supply-price-explorer`** (Expert throughout)

- the BADAGRY cargo in every unit (SECTION 17);
- the landed cost walk as a staircase from FOB to landed, each line with its
  base, the insurance basis switchable between C&F and CIF, and the refusals
  for a forward reference and an unknown stage (SECTION 18);
- the ocean loss as a slider, the landed total fixed and the cost of a litre
  sold rising as the outturn falls (SECTION 19), with the H1 note on the jetty
  and storage lines;
- the pump price waterfall and the recipient grouping, the cap as a control
  with the shortfall shown (SECTIONS 20 and 21);
- the exchange rate sensitivity, the bracket as two controls, the breakeven
  drawn where the price meets the cap, and "No crossing in the range searched"
  when the bracket misses it (SECTION 22).

## THE CAPSTONE GUARD

Write `panelCapstoneGuard.test.js` on FC6's pattern: every graded value in
`fields.json`, rendered at the decimals `precision.json` declares and signed,
must appear in no panel, lab or page source, with a permanent plant proving
the detector fires. Match whole tokens, never substrings.

## Copy

No em dashes, no en dashes, no "X, not Y" contrastive in any label, tooltip or
caption. The engine's "A FLOOR" sentence may be shown verbatim as the engine's
words.
