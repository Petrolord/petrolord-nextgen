# Two capacities, one list

{{panel:marine-deck-calculator}}

A packing rule can be checked against published packings. The source is the Wikipedia article on first-fit-decreasing bin packing, cited at revision 1317275412 of 17 October 2025 (CC BY-SA 4.0, read on 2026-09-27). The article changes over time, so the course cites that revision and the examples as it prints them, by example and without its wording.

## Turning bins into voyages

The article's examples pack numbers into bins of a capacity. The golden cases turn each number into a footprint one metre wide whose length is the number, set the usable fraction to 1 and give every item no weight, so that area alone decides. Ten voyages are stated, more than any packing needs, and the voyages the engine actually uses are the result.

## The example at capacity 60 and 61

The example is due to Coffman, Garey and Johnson (1978): ten items, 44, 24, 24, 22, 21, 17, 8, 8, 6 and 6, packed by first-fit decreasing into bins of capacity 60 and then of capacity 61. The engine returns, voyage by voyage:

| deck area | the engine's voyages, by footprint | voyages used | lower bound |
| --- | --- | --- | --- |
| 60 | {44,8,8}, {24,24,6,6}, {22,21,17} | 3 | 3 |
| 61 | {44,17}, {24,24,8}, {22,21,8,6}, {6} | 4 | 3 |

Both packings are the ones the article prints, set for set. At 60 every voyage is filled exactly, which works because a fit is inclusive: 44 and two 8s make 60 on the nose. The lower bound is 3 in both cases, since the footprints add to exactly three decks of 60.

## Reading the two packings

At capacity 60 the rule packs perfectly: three voyages, the lower bound, no space wasted. At capacity 61 one square metre more on each deck changes the first placement. The 44 now has room for the 17, which it did not at 60, so the 17 leaves the third voyage and the rest of the list falls differently. By the end a single 6 is left with nowhere to go but a fourth voyage. The next lesson looks at why that happens and what a planner should take from it.

## Why published examples matter

The Ekene cargo is synthetic, and a synthetic check only proves that the engine agrees with itself. A packing printed by someone else, matched set for set, shows the rule is the published rule.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "The capacity 60 example".

1. Read the units carried on each voyage and match them to the first row of the table. The units carry ids in the order of the list, so the first is the 44.
2. Read the tiles "Voyages used" and "Lower bound on voyages (units that fit an empty voyage)".
3. Start from "The capacity 61 example" and confirm the second row.
4. On that start, change "Deck area, m2 (stated)" from 61 to 60. Before you read the result, predict the packing, then confirm it against the first row.
