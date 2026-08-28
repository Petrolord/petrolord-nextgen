# What validation cannot catch

Seven rules and a grammar check. This lesson is about the far larger set of things that pass every check and are still wrong.

## The categories

**Right structure, wrong field.** A grid, a fluid and a history that are each internally consistent and describe a different reservoir. Nothing in a deck says which field it is.

**Right shape, wrong place.** A structure with the correct relief and the crest in the wrong corner. Every summary statistic matches and the map is transposed. The Professional tier named this as the failure mode that survives every numerical check.

**Right numbers, wrong units.** A depth in metres in a field-unit deck. It validates, because a positive number is a positive number, and it puts the reservoir at a third of its depth.

**Right units, wrong convention.** Net thickness where gross was intended, or the reverse. Same keyword, same magnitude, different meaning, and the pore volume is out by the net-to-gross.

**Right convention, wrong provenance.** A PVT table from a correlation where the study used a designed fluid. The Professional tier measured that at several percent on this field.

**Internally consistent, externally wrong.** A history that reproduces a production database exactly, where the database's allocation was wrong.

## What they have in common

Every one is a statement about the world, and the validator has no access to the world. It has a specification and a set of rules about specifications.

That is not a deficiency to be fixed by a better validator. It is a boundary. No amount of checking inside a file establishes a relationship between the file and a reservoir.

## What does catch them

Comparison against something outside the deck.

**The wells.** Post them on the model's structure and check against the logs. Catches transposition, offsets and unit errors in one look.

**The booking.** Compare the model's oil in place against the volumetric estimate, with conventions stated. Catches net-gross confusion, contact errors and gross unit errors.

**The history.** Multiply the schedule's rates back by the period lengths and compare against the production database. Catches divisor errors and misallocated months.

**The earlier analysis.** Compare the model's fluid against the tank model, its layer column against the sweep analysis, its rock curves against the SCAL fit. Catches provenance drift.

Four comparisons, each against a source outside the file. Together they catch most of the list above, and no one of them catches all of it.

## The one that nothing catches

Right in every respect and built on a field that does not behave the way the model assumes: no crossflow where there is crossflow, one saturation region where there are three, a single tank where there are two compartments.

That is a modelling error rather than a deck error, and the only thing that surfaces it is a prediction that fails. Which is an argument for making predictions that can fail, and for making them early.

## The habit

Before running a new deck, run the four comparisons above and write down the result of each. It takes an hour and it catches the errors that would otherwise be found after a month of history matching, by someone who is by then invested in the model.

## The misconception to avoid

"A more thorough validator would catch these." A validator can only check a file against rules about files. The errors in this lesson are mismatches between a file and a reservoir, and closing that gap requires data from outside the file. The check is a comparison, not a rule.

## Exercise

First, list the six categories above and, for each, name which of the four comparisons would catch it.

Second, name the one category no comparison catches and say what would eventually surface it.
