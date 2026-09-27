# When a larger deck needs more voyages

{{panel:marine-deck-calculator}}

The capacity 60 and 61 example in the Wikipedia article on first-fit-decreasing bin packing (revision 1317275412, CC BY-SA 4.0, read on 2026-09-27) carries a lesson that surprises most planners. The same ten footprints take 3 voyages on a deck of 60 and 4 voyages on a deck of 61. A larger deck needed more voyages. First-fit decreasing is not monotone in the capacity: making every bin bigger can make the packing worse.

## Following the placements

At 60 the 44 goes on voyage 1, and the 17 cannot join it (61 is over 60), so the 17 ends up with the 22 and the 21 on voyage 3, which fills exactly. The small units top up voyages 1 and 2, and every voyage is full.

At 61 the 44 and the 17 fit together on voyage 1 exactly. That looks like a better start, and it is the cause of the trouble. The 17 that filled voyage 3 beside the 22 and the 21 at capacity 60 is now spoken for, so the 8s and 6s go there and to voyage 2 in a different pattern, and one 6 is left over with nowhere to go but a fourth voyage. A single early choice, made greedily and left in place, sets the rest of the list on a worse path.

| deck area | voyages used | lower bound |
| --- | --- | --- |
| 60 | 3 | 3 |
| 61 | 4 | 3 |

The lower bound does not move: the footprints still fit three decks by area. The gap between voyages used and the bound is the rule's cost on this list.

## What a planner takes from it

A bigger vessel, or a higher usable fraction, does not guarantee fewer voyages under a stated rule. When the voyages used sit above the lower bound, a better packing may exist, and the deck foreman may find it by hand. When they sit at the bound, no packing can do better. So a deck plan is read with its lower bound every time, and a change of deck is tried in the calculator before it is promised.

## A second printed packing

The same article prints Example 5.1 of Huang and Lu (2021), a list packed at capacity 75 into {51,12,12}, {28,28,10}, {28,27,10,10}, {25,10,10,10,10,10}. The engine packs the golden input into exactly those four sets, 4 voyages (engine). A second list, a second capacity and the same agreement set for set: the rule the engine computes is the rule the article describes.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "The capacity 61 example".

1. Read the units on each voyage and follow the placements above one unit at a time, using the packing order printed under the tiles.
2. Change "Deck area, m2 (stated)" from 61 to 62. Before you read the result, say whether you expect 3 or 4 voyages, and why. Then read the voyages used and compare them with the lower bound.
3. Start from "Huang and Lu at capacity 75" and confirm the four sets above.
4. On that start, switch "Packing rule (stated)" to first fit in the booked order. Predict whether the packing changes, from the order the list is booked in, then read it.
