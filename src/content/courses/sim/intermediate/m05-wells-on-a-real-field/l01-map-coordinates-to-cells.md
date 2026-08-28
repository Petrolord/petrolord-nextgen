# Map coordinates to cells

A well is at an easting and a northing. A deck wants an I and a J. The conversion is arithmetic, and it is arithmetic worth doing by hand once because it is where a whole class of quiet errors lives.

## The frame

Cells are 100 m square. The deck's origin sits half a cell south-west of the field's map origin, so cell (i, j) has its centre at field coordinates

$$x = (i - 1) \times 100, \qquad y = (j - 1) \times 100$$

Inverting that, a well at (x, y) falls in

$$i = \left\lfloor \frac{x + 50}{100} \right\rfloor + 1, \qquad j = \left\lfloor \frac{y + 50}{100} \right\rfloor + 1$$

## The six wells

| well | map (m) | cell |
|---|---|---|
| Ekene-1 | 1000, 1000 | (11, 11) |
| Ekene-2 | 2200, 1150 | (23, 13) |
| Ekene-3 | 1400, 2300 | (15, 24) |
| Ekene-4 | 2600, 2500 | (27, 26) |
| Ekene-5 | 600, 1900 | (7, 20) |
| Ekene-6 | 1900, 1800 | (20, 19) |

Check one. Ekene-5 at x = 600: add 50, divide by 100, take the floor, add one. That gives 7, and the centre of column 7 is at 600 m, so the well is exactly on it.

{{panel:sim-structure-explorer}}

The wells are posted on the map. Five sit on cell centres and one does not.

## Why the half-cell offset exists

Without it, a well at a round map coordinate would land on a cell BOUNDARY, and a boundary belongs to two cells. Which one gets the well is then a tie-break, and tie-breaks differ between tools.

With the offset, a well on the 100 m lattice lands on a centre, unambiguously. That is a small design decision in the deck's frame that removes a whole category of ambiguity, and it is worth copying.

## What can go wrong

**Off by one.** Cell indices are one-based in a deck and zero-based in most of the code that generates them. A deck whose wells are all one cell south-west of where they should be is the classic symptom, and on a smooth structure it produces depths that are plausible and wrong.

**Origin mismatch.** The map has an origin and so does the grid, and they are rarely the same. Getting the offset wrong shifts every well by the same amount, which is invisible in the well list and obvious on a map.

**Axis convention.** Some frames run J northward and some southward. A deck with J flipped puts the northern wells in the south, and because Ekene's structure is not symmetric, the depths come out wrong in a way that looks like a bad interpolation rather than a flipped axis.

## The check that catches all three

Post the wells on the model's own structure map and look at them. If a well sits on a shoulder where the log says crest, something in the chain is wrong, and it is almost always one of the three above.

That is a two-minute check and it is the only one that catches an axis flip, because every numerical summary of a flipped grid is identical to the correct one.

## The misconception to avoid

"The generator handles the coordinates, so this is not my problem." A generator encodes one set of conventions, and it will apply them confidently to a map that uses different ones. The arithmetic in this lesson is the check on the generator, and it takes one well and thirty seconds.

## Exercise

First, compute the cell for a well at (1750, 2050) using the formula above, and state the map coordinates of that cell's centre and how far the well is from it.

Second, describe the symptom of a J-axis flip on this field, and say why no summary statistic of the TOPS array would reveal it.
