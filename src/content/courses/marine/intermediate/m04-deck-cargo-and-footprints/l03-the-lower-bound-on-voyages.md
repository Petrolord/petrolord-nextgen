# The lower bound on voyages

{{panel:marine-deck-calculator}}

Before any packing rule is run, the deck cargo already says something firm: the fewest voyages that could possibly carry it. The engine calls that the lower bound, and it prints it beside every deck plan so that a packing can be judged against it.

## Two quotients, rounded up

The lower bound counts the units that fit an empty voyage. It takes their total footprint over the usable area and their total weight over the deck load, rounds each up to a whole number at twelve significant digits, and keeps the larger. No packing, by any rule, can carry the carriable cargo on fewer voyages: if the footprints add to more than one deck, at least two voyages are needed however cleverly the units are placed. A rule may need more.

For the Ekene voyage of deck cargo:

| measure | total | one voyage holds | rounded up |
| --- | --- | --- | --- |
| area, m2 | 615.729600 | 600.000000 | 2 |
| weight, t | 515.600000 | 2000 | 1 |

The bound is 2 voyages (engine). The cargo is only a few square metres larger than one usable deck, and that is enough to need a second voyage.

## The voyages are stated

A deck plan is packed onto a stated number of voyages, `voyages`, from 1 to 500. The engine never adds a voyage of its own accord: a unit no stated voyage can take is overflow, named with its reason. Zero voyages is refused:

> voyages must be a whole number from 1 to 500; got 0

So the planner reads the plan in two directions. Voyages used against the lower bound says how good the packing is. Overflow against the voyages stated says whether the stated voyages are enough.

| start | rule | voyages stated | voyages used | lower bound | overflow units |
| --- | --- | --- | --- | --- | --- |
| Ekene deck cargo, one voyage, first-fit decreasing | first-fit-decreasing-area | 1 | 1 | 2 | 11 |
| Ekene deck cargo, two voyages | first-fit-decreasing-area | 2 | 2 | 2 | 0 |

With one voyage stated, 11 units stay on the quay, and the bound says why: the cargo needs 2. With two stated, first-fit decreasing carries all 61 units on 2 voyages, which matches the bound, so for this cargo no rule could do better.

## Units that never fit

A unit larger than the usable area, or heavier than the deck load, can never go on any voyage of this deck. The engine lists it under the units no voyage can ever carry and leaves it out of the bound, so a single oversized unit does not inflate the count for everything else. The next lesson shows both cases.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "Ekene deck cargo, one voyage, first-fit decreasing".

1. Read the tiles "Voyages used", "Lower bound on voyages (units that fit an empty voyage)" and "Overflow units", and confirm the first row of the second table.
2. Change "Voyages (stated)" to 2. Before you read the result, predict the voyages used and the overflow units.
3. Restore 1 voyage and change "Usable deck fraction (stated)" from 0.75 to 1. Work out the new usable area by hand and predict the lower bound and the overflow before you read them.
4. Type 0 into "Voyages (stated)" and compare the refusal with the one quoted above.
