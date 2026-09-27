# A tight worst case

{{panel:marine-deck-calculator}}

How far from the best packing can first-fit decreasing land? The Wikipedia article on first-fit-decreasing bin packing (revision 1317275412, CC BY-SA 4.0, read on 2026-09-27) cites the tight worst case of Dosa (2007): a list on which the rule uses exactly 11/9 of the optimum number of bins plus 6/9. The course reads the example as the article prints it, scaled to a capacity of 400, and runs it through the engine.

## The list and the engine's packing

At capacity 400 the text states that the best packing uses 6 bins and first-fit decreasing uses 8, which is 11/9 of 6 plus 6/9. The engine packs the golden input into 8 voyages:

| voyage | footprints |
| --- | --- |
| 1 | {204,108} |
| 2 | {204,108} |
| 3 | {204,108} |
| 4 | {204,108} |
| 5 | {104,104,104} |
| 6 | {104,92,92,92} |
| 7 | {92,92,92,92} |
| 8 | {92} |

Its lower bound is 6 voyages (engine), the area bound: the footprints add to six decks' worth. The optimum of 6 is the text's; the engine does not search for an optimum and does not construct one. Here the lower bound and the text's optimum agree.

## What goes wrong

Every large unit goes first, and each 204 takes a 108 beside it, the largest unit that still fits. That leaves a gap on each of the first four voyages smaller than any unit still waiting, so none of the 104s or 92s can use it. The rule has spent its best partners early and pays for it at the end, where a single 92 sails alone on voyage 8. The best packing pairs the units differently, and no greedy pass in decreasing order finds it.

## How to read a worst case

A worst case is a bound on the rule, a promise about how bad it can get. It does not say the rule is usually this far off: the Ekene cargo packed onto 2 voyages, which is its lower bound. It does say that a planner who sees voyages used well above the lower bound should look again, because the gap may be the rule and the cargo may fit in fewer. The engine shows both figures on every deck plan for exactly that reason.

The engine offers two rules and computes each as stated. It makes no claim that either is the best packing, and any plan that quotes a voyage count quotes the rule beside it.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "The tight worst case".

1. Read the voyage table and confirm the eight voyages above, and the tiles "Voyages used" and "Lower bound on voyages (units that fit an empty voyage)".
2. Read the area of voyage 1 and work out the area left empty on it. Say why no later unit can use that space.
3. Switch "Packing rule (stated)" to first fit in the booked order. Look at the order the items are booked in the box, predict whether first fit does better or worse than 8 voyages, and then read the voyages used. Compare the result with the lower bound.
4. In one sentence, say what the comparison in step 3 shows about choosing a packing rule for a list you have not seen.
