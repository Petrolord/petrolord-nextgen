# The area bound with no stacking

{{panel:marine-deck-calculator}}

Deck cargo on a supply vessel is measured in square metres. Containers and baskets are set down side by side on the open deck and are not stacked, because they must be lifted off one at a time at an installation, often in a swell. Aas, Halskau and Wallace describe offshore deck cargo in exactly these terms (The role of supply vessels in offshore logistics, Maritime Economics & Logistics 11(3), 302-325, 2009, read as the accepted manuscript on 2026-09-27; publisher copyright, so the course teaches the idea by concept and quotes none of it). The engine builds its deck plan on that idea.

## When a unit fits

A unit fits a voyage when two things hold at once: the footprints already on that voyage plus its own stay at or below the usable area, and the weights already on it plus its own stay at or below the deck load. Both checks are inclusive and both are made at twelve significant digits. Nothing is stacked, and no footprint is checked against the deck's shape: the plan is an area bound.

The usable area is the deck area times the stated usable fraction, the same fraction the voyage plan uses. It stands for the deck a planner cannot fill: the space round the cargo rail, the crane's landing area, the lanes the crew walk.

## When the deck load binds

On the Ekene PSV the deck load of 2000 t is far above the 515.600000 t of cargo, so area decides. Rate the same deck at 300 t and pack the same cargo on 2 voyages, and the first voyage stops on weight:

| voyage | units | area, m2 | weight, t | area utilisation | load utilisation |
| --- | --- | --- | --- | --- | --- |
| 1 | 25 | 404.505200 | 300.000000 | 0.674175 | 1.000000 |
| 2 | 36 | 211.224400 | 215.600000 | 0.352041 | 0.718667 |

The first voyage's deck load is full at 1.000000 with a third of its usable area still empty. The packing rule loads the largest units first, and they carry most of the weight, so the load limit is reached long before the footprints fill the deck.

## An exact fit

Two units of 2.500000 m2 and 1.5 t on a usable area of 5.000000 m2 and a deck load of 3 t fill the deck exactly. The engine puts both on, at an area utilisation of 1.000000. That a unit which fills the deck exactly still fits is a reading the engine states; the alternative would read an exact fill as overflow. The twelve-digit comparison matters here too: footprints of 0.1 and 0.2 m2 fill a 0.3 m2 deck, and the engine carries both units although the binary sum lands a hair above 0.3.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "Ekene deck cargo on a light deck".

1. Confirm both rows of the table above.
2. Change "Deck load, t (stated)" from 300 to 2000. Before you read the result, predict how much area the first voyage now carries and how many units move to the second. Compare with the start "Ekene deck cargo, two voyages".
3. Start from "An exact fit" and confirm 2 units carried with nothing left over.
4. Raise "item a: weight, t (stated)" from 1.5 to 1.6. Predict how many units now go on, and which limit the overflow reason will name. Read the reason.
