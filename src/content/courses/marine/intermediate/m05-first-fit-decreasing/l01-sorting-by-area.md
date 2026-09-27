# Sorting by area

{{panel:marine-deck-calculator}}

A deck plan needs a rule that decides which unit goes where. The engine offers two, and the call must state one in `rule`. This module works the first, first-fit decreasing by area, and compares it with the second, first fit in the booked order.

## The rule, in two steps

First-fit decreasing is a classic rule for packing items into bins, due to Johnson (1973). The course cites it as the Wikipedia article on first-fit-decreasing bin packing states it (revision 1317275412 of 17 October 2025, CC BY-SA 4.0, read on 2026-09-27); the course cites its sections and examples without pasting its wording. On a deck the bins are voyages and the size of an item is its footprint.

Step one sorts every unit by footprint, largest first. Step two takes the units in that order and puts each on the first voyage that still holds it, by area and by deck load. The engine calls the rule `first-fit-decreasing-area`.

## Why the big units go first

A large unit needs a large empty space, and early in the packing every voyage is empty. Small units are flexible: they fill whatever gaps the large ones leave. Packing the large units first keeps the awkward ones from being stranded at the end, when every voyage has only scraps of area left. The rule is simple, stated and repeatable, and the engine makes no search for a better packing.

For the Ekene voyage of deck cargo the sort puts the two casing bundles first, then the eight baskets, then the 20 ft containers, the mud tanks, the 10 ft containers, the skips and last the chemical IBCs. The packing order the engine returns begins:

| position | unit | footprint, m2 |
| --- | --- | --- |
| 1 | pipe-bundle#1 | 35.100000 |
| 2 | pipe-bundle#2 | 35.100000 |
| 3 | basket-6m#1 | 15.000000 |
| 4 | basket-6m#2 | 15.000000 |

## The rule is always stated

There is no assumed packing rule. A call that leaves it out is refused:

> rule must be one of "first-fit-decreasing-area", "first-fit"; got nothing

And a rule the engine does not compute is refused by name, however well known it is elsewhere:

> rule must be one of "first-fit-decreasing-area", "first-fit"; got "best-fit"

A plan quotes its deck figures with the rule that made them, because the two rules pack the same cargo differently.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "Ekene deck cargo, one voyage, first-fit decreasing".

1. Read the packing order printed under the tiles and confirm the first four units in the table above. Find where the first mud tank sits in the order and explain its position from the footprints.
2. Switch the control "Packing rule (stated)" to first fit in the booked order. Before you read the result, predict the first unit in the packing order.
3. In the box, set the rule to "best-fit" and compare the refusal with the one quoted above.
4. Set the control to "not stated" and read the refusal. Restore first-fit decreasing.
