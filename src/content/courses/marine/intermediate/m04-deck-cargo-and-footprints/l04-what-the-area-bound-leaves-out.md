# What the area bound leaves out

{{panel:marine-deck-calculator}}

An area bound says that the footprints fit inside the usable area and the weights inside the deck load. It says nothing about whether the units fit the deck as shapes.

## What the bound does not check

The engine does not compare a basket's length with the deck's width, so a long casing bundle counts only by its square metres. It stacks nothing, keeps no lane clear for the crane beyond what the usable fraction sets aside, and neither balances the load nor checks the vessel's stability. Those belong to the deck foreman and the master, and a plan that passes the area bound can still fail on the deck. The usable fraction is where a planner builds in that experience: a deck known to lose space to awkward cargo gets a lower fraction, stated.

No hidden allowance sits behind the fraction. A stowage factor is a key the deck plan does not read, and the engine refuses it by name:

> deck.stowageFactor is not an accepted key; the accepted keys of deck are name, areaM2, usableFraction, loadT

## Units no voyage can carry

Two things put a unit beyond any voyage of a given deck: a footprint larger than the usable area, or a weight above the deck load. The engine names each in an overflow reason and lists the unit among those no voyage can ever carry. The two golden cases, verbatim:

| case | the engine's overflow reason | never fit | lower bound |
| --- | --- | --- | --- |
| a unit larger than the deck | big is overflow: its footprint 12.5 m2 is larger than the usable deck area 10 m2 | big | 1 |
| a unit heavier than the deck load | heavy is overflow: its weight 10.5 t is above the deck load 10 t | heavy | 0 |

No voyage count cures either one. More voyages of the same deck leave the unit where it was; only a larger deck, a higher usable fraction or a stronger deck carries it. That is why the engine keeps these units out of the lower bound: in the first case the two small units that do fit need 1 voyage, and the bound says 1. In the second no unit fits an empty voyage, so the bound is 0.

## Reading the two kinds of overflow

An overflow reason that names a footprint larger than the usable area, or a weight above the deck load, calls for a different deck. Any other overflow reason, which the next module reads in full, calls for another voyage. The engine writes the two differently so that a reader cannot mistake one for the other.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "A unit larger than the deck".

1. Read the tile "Units no voyage can ever carry", the overflow reason and the lower bound, and confirm the first row of the table.
2. Change "Usable deck fraction (stated)" to 1. Before you read the result, predict whether big still appears among the units no voyage can carry, and what the lower bound becomes.
3. Start from "A unit heavier than the deck load" and set "Deck load, t (stated)" to 10.5. Predict whether heavy now fits, remembering that a fit is inclusive.
4. In the box, add `"stowageFactor": 1` to the deck and compare the refusal with the one quoted above.
