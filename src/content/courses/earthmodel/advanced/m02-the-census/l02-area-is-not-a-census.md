# Area is not a census

The polygon's area is 436,500 m2. The census says 174 nodes, which at 2500 m2 per cell books 435,000 m2 of block 1. The 1,500 m2 gap is not an error on either side; it is the difference between two questions, and confusing them is a real failure mode in volume audits.

## The two questions

The shoelace area answers: how much map area does the polygon enclose? It is a property of the polygon alone, exact for the vertex list, independent of any grid.

The census times cell area answers: how much area do the model's block 1 CELLS represent? It is a property of the polygon AND the frame: which node centres the polygon happens to capture, each carrying its full 2500 m2 regardless of where the boundary slices its cell.

The second number is the one every downstream volume uses, because volumes are node sums. The first number is the one a GIS measurement of the fault polygon would report. They agree only in the limit of a fine grid, and on a 50 m frame they differ here by 0.34 percent.

## Where the gap lives

The gap is entirely boundary bookkeeping. Along the polygon's western edge at x 975, the frame's first column sits at x 1000: the 25 m strip between edge and first column belongs to the polygon's area but no node's cell extends past x 975 anyway; meanwhile each column 0 cell spans x 975 to 1025, so its western half-strip is actually covered. Walk the whole boundary this way, strip by strip, and the covered and uncovered slivers ALMOST cancel: 435,000 against 436,500. On this fixture the census under-books the polygon by 1,500 m2, three fifths of one cell. A different polygon offset could flip the sign. There is no theorem about the direction, only about the size: the discrepancy is bounded by boundary length times half the cell size, and shrinks linearly with the cell.

## Why the census wins anyway

Given the mismatch, why do volumes use the census rather than the exact polygon area? Because volume is not area: it is thickness TIMES area, and thickness lives at nodes. An exact-area accounting would need thickness integrated over each boundary-clipped cell fragment, which needs thickness values where none are stored. The node convention keeps one consistent rule from labelling through volume: a node speaks for its whole cell, in block membership, in thickness, in everything. Consistency is what buys module six's exact closure, and closure catches real errors; a mixed convention would trade an exact audit tool for a 0.34 percent cosmetic improvement.

The honest statement for a report is therefore two numbers with their meanings: the fault block encloses 436,500 m2 of map area; the model books it as 174 cells totalling 435,000 m2, and every block statistic refers to the booked set.

## Worked example

Bound the discrepancy before computing it, using the rule of thumb above. The polygon's perimeter: southern panel contributes 600 wide by 455 tall, the arm 300 by 545; walking the L's outline gives a perimeter of 600 + 455 + 300 + 545 + 300 + 1000, which is 3,200 m. Half the cell size is 25 m. Bound: some fraction of $3200 \times 25 = 80,000$ m2 in the worst case of systematically one-sided boundaries; the realised 1,500 m2 is about 2 percent of that worst case, because the 25 m offsets make most strips cancel. The bound is loose exactly when the fixture is kind, and the value of computing it is knowing how bad an UNKIND polygon could be on this frame: up to about 18 percent of the block's area, which is why fine frames exist.

## Exercise

A colleague reports block 1's "area" as 174.6 cells, dividing the shoelace area by 2500. Explain in two sentences what is wrong with publishing a fractional cell count, and which of the two legitimate numbers their 174.6 is a disguised version of.
