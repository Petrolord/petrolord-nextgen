# Hand counting 174

The capstone grades the block 1 node count with tolerance zero: 174, exactly, or nothing. A count graded exactly deserves a derivation you can run without a computer, and the golden geometry was built to allow one.

{{panel:em-population-explorer}}

## The two rectangles of the L

Block 1 is the inside of the L-shaped polygon, and the L is two axis-aligned rectangles, so the count is two products and a sum.

Southern panel: x from 975 to 1575, y from 1975 to 2430. The node columns inside are those with x strictly between the bounds: columns at x 1000, 1050, ..., 1550, which is columns 0 through 11, twelve columns. The node rows inside: y 2000 through 2400, rows 0 through 8, nine rows. Twelve times nine is 108 nodes.

Northern arm: x from 975 to 1275, y from 2430 to 2975. Columns at x 1000 through 1250: columns 0 through 5, six columns. Rows at y 2450 through 2950: rows 9 through 19, eleven rows. Six times eleven is 66 nodes.

Total: 108 plus 66 equals 174. Block 0 is the complement: 500 minus 174 equals 326.

## Why the hand count is possible at all

Three fixture properties make the count clean, and each is worth naming because its absence is what makes real censuses computer work. The polygon is axis-aligned, so "inside" separates into an x condition and a y condition per rectangle. The edges sit 25 m off the node lattice, so no boundary case needs adjudicating. And the polygon is one simple L, so it decomposes into two disjoint rectangles by inspection. A real fault trace with diagonal segments has none of these; the even-odd test handles it identically, but no human checks it by multiplication.

The panel's census tile confirms 326 and 174, and the profile's colouring shows the twelve-column width of the southern panel directly: on the y 2200 row, the blue segment runs from column 0 through column 11.

## Counting is the model's first per-block statistic

The census looks administrative, but it is the denominator of everything downstream. Block porosity means, per-block volumes, per-block anything: each divides by or sums over exactly these node sets. An off-by-one in the census is not one wrong number; it is a node's thickness and cell area booked to the wrong side of a sealing fault, and the block volumes shift in opposite directions by that node's contribution. The Associate tier's lesson that a mean is meaningless without its denominator returns here with the denominator now being a COUNT YOU CAN DEFEND.

## Worked example

Rerun the southern panel's row count the way the polygon actually forces it, as an inequality check rather than a picture. A node row at y is inside the southern panel when $1975 < y < 2430$. Node rows sit at y equals 2000 plus 50r. The inequality gives $0.5 < r < 9.1$, so r from 1 to 9... and that is WRONG, catching a classic slip: r starts at 0, and y 2000 satisfies $1975 < 2000$, so the first inside row is r equals 0. Solve properly: $2000 + 50r > 1975$ holds for all r from 0; $2000 + 50r < 2430$ holds for r up to 8.6, so r from 0 through 8, nine rows. The deliberate near-miss is the point of the example: translate boundaries into node indices by solving the inequality at both ends, never by assuming the first row is row 1.

## Exercise

A proposed edit moves the polygon's northern arm boundary from x 1275 to x 1325. Recompute the census by hand: how many nodes does block 1 gain, from which rows and columns, and what is the new pair of block counts? Confirm the two still sum to 500.
