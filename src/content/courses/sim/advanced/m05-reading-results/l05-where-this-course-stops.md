# Where this course stops

The boundary was stated in the first module and this lesson returns to it, because you now know enough to see exactly where it falls.

## What you can do now

Read a deck and say what every block does. Say where every number came from and whether the chain survives inspection. Build one: turn a trajectory into completions, a production database into a schedule, a mapped surface into a grid. Calibrate the free parameter, report the calibration honestly, and know what the validator will and will not catch.

That is deck literacy, and it is a complete skill. It does not depend on running anything.

## What comes next and is not here

**Running the deck.** Petrolord's Reservoir Simulation Studio is where a Petrolord deck goes to be run.

**History matching as a practice.** This course taught what a history match tests and how to read it. Doing one is a discipline of its own: choosing parameters, bounding them, avoiding compensating errors, and knowing when to stop.

**Forecasting and uncertainty.** Multiple realisations, sensitivity design, and how to present a range rather than a number.

**Everything the grid cannot represent.** Corner-point geometry, faults, local grid refinement, dual porosity, compositional fluids.

## Why the boundary is where it is

Because the engines this course rests on emit decks and do geometry. They do not solve flow equations.

A course built on them can teach and grade deck construction to full precision, and it can teach results literacy without grading it. Extending the graded scope to simulated results would mean grading against numbers this course cannot compute, which is exactly the failure the whole reservoir module has been careful to avoid: teaching values nobody has checked.

Saying so plainly is better than a course that gestures at a competence it cannot assess.

## What to do with the results module

Treat it as reading practice rather than as a qualification. When a results file arrives, you know what its vectors mean, which ones carry information, and which plot is the one that proves nothing.

That is enough to be a useful reader of somebody else's study, which is most of what an engineer does with simulation output.

## The one habit to carry

Ask where each number came from.

That is the thread through all three tiers. The Associate tier asked what a block does; the Professional tier asked what produced it; the Expert tier asked what was decided and by whom. In every case the interesting answer was upstream of the file.

A deck is the most auditable artifact in reservoir engineering, because everything is in it and it is plain text. The skill is not reading it. The skill is knowing which of its numbers are measurements, which are correlations, which are conventions and which are decisions, and being able to say so about each one.

## The misconception to avoid

"Deck literacy is preliminary and the real work is running cases." The proportion of studies that go wrong in the solver is small. The proportion that go wrong because the deck described something other than the field is large, and the reason is that a solver error is loud while a deck error is silent.

## Exercise

First, list the four things this course does not cover and say which one you would learn next, with a reason.

Second, for each of these, say whether it is a measurement, a correlation, a convention or a decision: the contact depth, the gas viscosity table, the net-versus-gross treatment, and the kriging regional mean.
