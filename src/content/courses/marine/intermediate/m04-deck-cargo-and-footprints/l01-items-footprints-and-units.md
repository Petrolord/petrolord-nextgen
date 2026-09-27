# Items, footprints and units

{{panel:marine-deck-calculator}}

Fleet sizing treats a week's deck cargo as one number of square metres. The deck of a real voyage carries containers, baskets, skips and tanks, each with its own shape and weight. The second half of this tier's question works at that level: given the items booked for a voyage, which units go on which voyage, and which are left behind? The deck calculator answers it with `deckPlan`.

## An item line

A deck plan states each item line with an id, a length and a width in metres, a weight in tonnes and a whole quantity. The footprint of one unit is its length times its width. A line of one unit is named by its id; a line of several names each unit by the id, a # sign and the unit number, so the two casing bundles are pipe-bundle#1 and pipe-bundle#2.

The Ekene voyage of deck cargo, in the order booked (synthetic):

| id | item | footprint, m2 | weight, t | quantity |
| --- | --- | --- | --- | --- |
| chem-ibc | chemical IBC in a frame | 1.200000 | 1.300000 | 12 |
| skip | waste skip | 4.500000 | 3.000000 | 6 |
| cont-10 | 10 ft offshore container | 7.295600 | 8.000000 | 12 |
| basket-6m | 6 m cargo basket | 15.000000 | 6.000000 | 8 |
| mud-tank | portable mud tank | 12.000000 | 14.000000 | 5 |
| cont-20 | 20 ft offshore container | 14.786400 | 12.000000 | 16 |
| pipe-bundle | casing joints, bundled | 35.100000 | 38.000000 | 2 |

The 61 units have footprints totalling 615.729600 m2 and weights totalling 515.600000 t (engine). The deck is the PSV Ekene Star's clear deck: 800 m2 at a usable fraction of 0.75 and a deck load of 2000 t, so the usable area is 600.000000 m2. The cargo is a little larger than one voyage can hold by area, and far lighter than the deck load.

## The engine checks every line

Every figure in an item line is an input, and each is checked. A quantity is a whole number:

> items[0].quantity must be a whole number from 1 to 1000; got 1.5

A width of zero is no footprint:

> items[0].widthM must be a finite number above 0; got 0

A key the deck plan does not read is refused, however reasonable it looks. Height is the obvious one, since this plan stacks nothing:

> items[0].heightM is not an accepted key; the accepted keys of items[0] are id, name, lengthM, widthM, weightT, quantity

And a plan too large to check is refused as a whole:

> items hold 2001 units in all; the cap is 2000

## What the course leaves to others

Which spares and consumables an installation orders, and how many, is the materials course. This course takes the booked items as stated and puts them on a deck.

## Exercise

Open the deck calculator, choose the view "The deck plan" and start from "Ekene deck cargo, one voyage, first-fit decreasing".

1. Read the tiles "Total area, m2", "Total weight, t" and "Usable area, m2" and confirm the three figures above.
2. For the line cont-20, multiply the controls "item cont-20: length, m (stated)" and "item cont-20: width, m (stated)" and confirm its footprint.
3. Type 1.5 into "item chem-ibc: quantity (stated)" and compare the refusal with the one quoted above. Restore 12.
4. In the box, add `"heightM": 1` to the first item line. Predict the refusal before you read it.
