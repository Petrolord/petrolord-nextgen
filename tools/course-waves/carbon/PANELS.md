# carbon PANELS TASK. Three explorer panels over one teaching lab.

Read LESSON_TASK.md first. The digest is the only teaching truth, and a panel
is a lesson a learner can move.

## Shape

One lab, `src/components/course/panels/carbon/carbonLab.js`, the ONLY file that
imports the vendored `packages/engines/engines/downstream/carbonAbatement.js`
and `energyEfficiency.js`. Every value it exports is pinned by vitest in
`carbonLab.test.js` against the figures the digest prints, so a panel and a
lesson can never disagree. The lab reads the teaching cases from
`carbon_fields.mjs` as mirrored under `tools/course-waves/carbon/`, through
`waveInputs.mjs`, never from `/root`. The NextGen test runner is VITEST
(`npx vitest run <files> --maxWorkers=2`).

Register the three ids in `src/content/courses/panelRegistry.js`:
`carbon-inventory-explorer`, `carbon-efficiency-explorer`,
`carbon-abatement-explorer`. The manifests already carry them, so
`src/lib/courseContent.test.js` fails "every panel referenced by a manifest is
registered" until they are registered. That red is expected at the foundation
and is this phase's to clear.

The lab phase also adds `'energy_transition'` to CourseModuleNav's
MODULE_ORDER after `'supply_chain'`, on the SAME line the sibling `gasvalue`
branch writes, so the two merge cleanly. Nothing is added to
`academyModules.js`: the label is already there.

## THE RULES THAT MATTER MOST HERE

- **A missing input is missing.** A blank control goes to the engine as
  missing (an empty string or null), never as 0 or 1, and the panel shows the
  engine's refusal. Never default a destruction efficiency, a GWP, a factor, a
  safe oxygen floor, a radiation loss, a discharge coefficient, an exponent, a
  boiler efficiency, hours a year, a capital cost or a discount rate.
- **The GWP set is a choice among the four the digest prints**, each shown with
  its report, its horizon and its source line, and the course set selected at
  load. No control recommends one (held item H1). No other GWP is offered.
- **Nothing published is shipped.** Every factor and price control starts at
  the digest's invented value and is labelled invented; the electricity and
  fuel factors are labelled SYNTHETIC.
- **A computed figure is never shown as reportable.** The inventory panel shows
  `reportable` and `notReportableBecause` beside every total, and an intensity
  carries its inventory's status.
- Neither engine reads a clock, so the lab needs no date; the lab test still
  builds the snapshot under `TZ=Pacific/Pago_Pago` and `TZ=Pacific/Kiritimati`
  and demands the same bytes.

## THE ONE TEACHING LAB

`carbonLab.js` builds the three teaching records (IGBOGENE, ISIOKPO, AGBOR)
exactly as `carbon_dump.mjs` does, with the same helper that turns an
atom-balance result into lines through a factor of one, so every panel's
opening state is a digest row.

## THE THREE

**`carbon-inventory-explorer`** (Associate throughout)

- the IGBOGENE heaters and flare as atom-balance results (SECTIONS 3 and 4),
  the fuel, the carbon per kilomole and the destruction efficiency as
  controls; the flare's efficiency box starts at the digest's invented 0.98,
  and emptying it shows the engine's refusal and removes the flare's lines
  (SECTIONS 2 and 5);
- the flare at the five efficiencies of SECTION 5, CO2 and methane stacked, the
  methane line in CO2e on the chosen set;
- the GWP set selector over the four sets of SECTION 6, with the engine's note
  and methane note shown verbatim, and the inventory rebuilt on each (SECTION
  8);
- the inventory table with provenance per line (SECTION 7), the five steps of
  SECTION 9 as a stepper from first pass to reportable, and the intensity over
  both boundaries with its comparability note (SECTION 10).

**`carbon-efficiency-explorer`** (Professional throughout)

- the ISIOKPO fuel gas analysis as editable mole fractions, the stoichiometry
  and the mass balance line of SECTION 11;
- the dry stack oxygen as a slider over the SECTION 12 sweep, excess air and
  the flue gas, the refusal at and above the oxygen in air;
- the stack losses as a stacked bar on LHV and on HHV side by side, never on
  one axis, with the radiation loss a required box (SECTION 13);
- the tuning saving: current and target oxygen, the declared floor as a
  required box, the ratio saving beside the percentage-point shortcut labelled
  as the digest's contrast figure, and the refusal below the floor (SECTION
  14);
- the failed trap with the exponent as a choice of 1.135 and 1.3 and every
  required box refusing when blank; condensate return with the treatment cost
  optional and the floor note when it is blank (SECTIONS 15 and 16);
- the four streams with the minimum approach as a control over 10, 15 and 20
  C, the problem table and grand composite at the chosen approach, the pinch
  marked, and the threshold case of SECTION 17 as a second preset.

**`carbon-abatement-explorer`** (Expert throughout)

- the six AGBOR measures, each with capital, savings, running cost, tonnes,
  life and start year, the discount rate as a fraction control, and the
  engine's refusals for a blank capital, a blank rate and a rate typed as a
  percentage (SECTIONS 18 and 19);
- the marginal abatement cost curve as a step chart, cheapest first, widths in
  tonnes, the weighted average drawn, interacting measures flagged (SECTION
  20);
- the target and its verdict with `targetBasis` shown verbatim, and the
  over-claim preset of SECTION 21 (flare gas recovery claiming more than the
  flare emits); a source whose emission is not passed is labelled unchecked;
- the path as years against emissions and the straight-line target, the
  unabated gap shaded and named, the partial-inventory preset and the
  unscheduled-measure preset of SECTION 22;
- one saving priced in money and carbon with the three bases declared, the
  basis mismatch refusal, and energy intensity against the peer with a stream
  blanked (SECTIONS 23 and 24).

## THE CAPSTONE GUARD

Write `panelCapstoneGuard.test.js` on FC6's pattern: every graded value in
`fields.json`, rendered at the decimals `precision.json` declares and signed,
must appear in no panel, lab or page source, with a permanent plant proving
the detector fires. Match whole tokens, never substrings.

## Copy

No em dashes, no en dashes, no "X, not Y" contrastive in any label, tooltip or
caption. Since MD45-1 no engine string needs an exemption: the engine's
sentences carry no contrastive and are shown verbatim.
