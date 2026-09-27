# The first voyage that holds a unit

{{panel:marine-deck-calculator}}

Sorting decides the order. The second step decides the place: each unit, in its turn, goes on the first voyage that still holds it. The voyages are numbered from 1, and every unit starts its search at voyage 1, however full that voyage already is. It moves to voyage 2 only when voyage 1 lacks the area or the deck load, and so on up to the last voyage stated.

## The first voyage with room

The rule takes the first voyage with room, which is not always the voyage where the unit fits most snugly. A rule that looked for the tightest fit would be a different rule with a different name, and the engine does not compute it. First fit has two plain virtues. It is easy to check by hand, one unit at a time. And it loads the early voyages as fully as it can, which leaves the last voyage light, with room for a late booking.

## The Ekene cargo on two voyages

With 2 voyages stated and first-fit decreasing, every unit finds a place:

| voyage | units | area, m2 |
| --- | --- | --- |
| 1 | 50 | 599.229600 |
| 2 | 11 | 16.500000 |

Voyage 1 takes the casing bundles, the baskets, the containers, the mud tanks, the skips but one, and two chemical IBCs. By then its usable area is almost full: 599.229600 m2 of 600.000000. Every later unit tries voyage 1 first, finds too little area, and goes to voyage 2. The second voyage carries the last skip and ten IBCs, 16.500000 m2 in all. The deck load is never close to binding on either voyage.

The plan matches the lower bound of 2, so no rule could carry this cargo on fewer voyages.

## The same cargo on one voyage

With 1 voyage stated there is nowhere for the leftovers to go. The same packing puts 50 units on the one voyage, carrying 599.229600 m2 and 499.600000 t, and the 11 units that would have gone to voyage 2 are overflow, 16.500000 m2 of footprint left on the quay. The engine plans the voyage it was given and names every unit it could not take; this module's last lesson reads their reasons.

## Stating more voyages than the cargo needs

A stated voyage that nothing reaches stays empty, and the tile "Voyages used" counts only the voyages that carry something. Stating spare voyages costs nothing in the plan, and it shows at a glance how many the cargo really needs.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "Ekene deck cargo, two voyages".

1. Read the voyage table and the list of units carried on each voyage, and confirm the table above.
2. Change "Voyages (stated)" to 3. Before you read the result, predict what voyage 3 carries and what the tile "Voyages used" reads.
3. Restore 2 voyages and switch "Packing rule (stated)" to first fit in the booked order. Predict what voyage 2 carries now, then read it.
4. Start from "Ekene deck cargo, one voyage, first-fit decreasing" and confirm that the overflow table lists 11 units. Add their footprints and confirm 16.500000 m2.
