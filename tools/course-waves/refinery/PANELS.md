# refinery PANELS TASK. Three explorer panels over one teaching lab.

Read LESSON_TASK.md first. The digest is the only teaching truth, and a panel is
a lesson a learner can move.

## Shape

One lab, `src/components/course/panels/refinery/refineryLab.js`, the ONLY file
that imports the vendored `packages/engines/engines/downstream/*` modules (and,
through modularRefinery, the screening engine). Every value it exports is pinned
by vitest in `refineryLab.test.js` against the figures the digest prints, so a
panel and a lesson can never disagree. The lab reads the teaching cases from
`refinery_fields.mjs` as mirrored under `tools/course-waves/refinery/`, through
`waveInputs.mjs`, never from `/root`.

Register the three ids in `src/content/courses/panelRegistry.js`:
`refinery-screen-explorer`, `refinery-plan-explorer`,
`refinery-variance-explorer`. The manifests already carry them, so
`src/lib/courseContent.test.js` fails "every panel referenced by a manifest is
registered" until they are registered. That red is expected at the foundation
and is this phase's to clear. The `downstream` academy module is added to
`src/lib/academyModules.js` by the lab agent for all three courses at once.

## THE CLOCK RULE

**cascadeToSchedule reads the machine clock when it is given no period start,
and feasibilityEconomics reads the year when it is given no start year.** The
lab passes `periodStart: '2027-03-01'` (a STRING: a Date built at local midnight
moves the schedule back a day east of Greenwich, digest SECTION 16) and
`startYear: 2027` on every call, and NEVER calls `new Date()` or `Date.now()`.
The lab test proves it by building the whole snapshot under two faked system
dates and under `TZ=Pacific/Pago_Pago` and `TZ=Africa/Lagos` and demanding the
same bytes.

## THE THREE

**`refinery-screen-explorer`** (Associate throughout)

- OKORDIA's reference quotation with a capacity slider: modular and stick-built
  capital and capital per bpd, both curves drawn with the crossover at the
  reference size marked, and each exponent as a control labelled as a default a
  vendor's figures replace (SECTION 3, H1). At the digest's capacities every
  figure must match SECTION 3;
- the configuration picker and the price table: the slate row by row, the gross
  value per barrel of crude, the loss shown as a yield with no value, a blank
  price named as unpriced and yields that do not close reported (SECTION 4);
- on-stream days, the supply scenario and the crude cost: annual throughput,
  gross margin per barrel and the annual streams table (SECTIONS 5, 6), every
  refusal shown in the engine's words when a box is blanked or a utilisation is
  typed as a percentage (SECTION 2);
- the licensing tracker, ticking stages in and out of order (SECTION 7).

**`refinery-plan-explorer`** (Professional throughout)

- the ABUA configuration as editable tables, with each limit able to be typed as
  a number, typed as 0 or left blank, and the plan re-solved live; the three
  hydrotreater rows of SECTION 9 must be reproducible by the learner;
- the crude unit shown carrying every barrel: total crude beside its throughput
  and its utilisation (SECTION 11); units at capacity and crudes at their
  availability highlighted from the plan's own numbers (SECTION 12);
- the stream balance and each stream's marginal value, beside the prices of the
  products it goes into and the unit it feeds (SECTION 14), and the reformer
  debottleneck sweep as a control (SECTION 14);
- the schedule as a calendar for March 2027, with the cargo size as a control,
  and a zone picker that shows the dates do not move (SECTIONS 15, 16);
- infeasible and unbounded plans shown as the engine's sentences, never as an
  empty chart (SECTION 10).

**`refinery-variance-explorer`** (Expert throughout)

- the ODIOMA plan ledger beside the actuals, each actual editable; every line's
  volume, price and unexplained variance, its direction and its margin effect,
  coloured by the margin effect (SECTION 20);
- the unmatched movements listed apart, and the margin total beside the ledger
  margin variance with the gap between them named (SECTION 21);
- units against plan (SECTION 21);
- the expansion's cash flow through the screening engine, with a switch for the
  loss carry-forward: the per-year tax, the loss pool and the first taxable year
  move as SECTION 23 prints them. The NPV may be shown as a reading; **no IRR
  control**, and nothing on the panel invites the learner to optimise the NPV.

## THE CAPSTONE GUARD

Write `panelCapstoneGuard.test.js` on FC6's pattern: every graded value in
`fields.json`, rendered at its class's graded precision and at the digest's
precision, signed and unsigned, must appear in no panel, lab or page source, with
a permanent plant proving the detector fires. The guard must match whole tokens
rather than substrings.

## Copy

No em dashes, no en dashes, no "X, not Y" contrastive in any label, tooltip or
caption. The schedule note may be shown verbatim as the engine's words.
