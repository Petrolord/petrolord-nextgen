# First fit in the booked order

{{panel:marine-deck-calculator}}

The second rule the engine offers, `first-fit`, skips the sort. It takes the units in the order the items were booked and puts each on the first voyage that still holds it. The placing step is the same as in first-fit decreasing; only the order differs, and the order turns out to matter a great deal.

## The Ekene cargo, both rules, one voyage

The Ekene fixture books its items smallest first: chemical IBCs, skips, 10 ft containers, baskets, mud tanks, 20 ft containers and the casing bundles last. On one voyage:

| rule | first units packed | area carried, m2 | weight carried, t | units carried | overflow units |
| --- | --- | --- | --- | --- | --- |
| first-fit decreasing | pipe-bundle#1, pipe-bundle#2, basket-6m#1, basket-6m#2 | 599.229600 | 499.600000 | 50 | 11 |
| first fit, booked order | chem-ibc#1, chem-ibc#2, chem-ibc#3, chem-ibc#4 | 580.629600 | 477.600000 | 60 | 1 |

First fit carries more units and less area. The small units go on first and fill the deck; by the time the second casing bundle's turn comes, the most usable area left on the voyage is under twenty square metres, and a bundle needs 35.100000. The engine's reason, verbatim:

> pipe-bundle#2 is overflow: it needs 35.1 m2 of usable area and 38 t of deck load; at its turn the most left on any voyage was 19.3704 m2 (short) and 1522.4 t (enough); usable area stops it

First-fit decreasing leaves 11 small units behind, 16.500000 m2 that could ride on any later voyage. First fit strands one casing bundle, which needs a large clear space on whatever voyage takes it. Which outcome is worse depends on the cargo: a stranded casing bundle may hold up a well.

## The same effect on a textbook list

The capacity 60 example of Coffman, Garey and Johnson (1978), as the Wikipedia article on first-fit-decreasing bin packing prints it (revision 1317275412, CC BY-SA 4.0, read on 2026-09-27), packs ten footprints of 44, 24, 24, 22, 21, 17, 8, 8, 6 and 6 into 3 voyages by first-fit decreasing. Booked in that decreasing order, first fit gives the same 3 voyages, because the booked order already is the sorted order. Booked smallest first, the same list packed by first fit (a stated probe) needs 4 voyages: {6,6,8,8,17}, {21,22}, {24,24}, {44}. The small items fill the first voyage and the large ones end up alone.

## When the booked order is the point

First fit is the rule to state when the booking order carries meaning: priority cargo booked first, or a loading sequence the base must keep. The engine computes it without judgement and prints the cost beside it, so a planner can weigh the order against the voyages it takes.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "Ekene deck cargo, one voyage, first fit".

1. Confirm the second row of the table and read the overflow reason for pipe-bundle#2.
2. Change "Voyages (stated)" to 2. Before you read the result, predict what the second voyage carries and whether anything overflows.
3. Start from "The capacity 60 list by first fit" and confirm 3 voyages. In the box, reverse the order of the item lines, then predict the number of voyages before you read it.
4. Put the list back in its order and switch "Packing rule (stated)" to first-fit decreasing. Predict whether anything changes.
