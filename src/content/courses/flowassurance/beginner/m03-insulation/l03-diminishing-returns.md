# Diminishing returns

The first quarter inch of foam wall on the published pipe divides U by 22.61753379. Two inches added at the outside divides it by 1.42480183.

{{panel:pd-thermal-explorer}}

## One pipe, one foam, one thing moved

The published pipe, the published films and syntactic polypropylene at k 0.0900, with only the foam outside diameter moved. The 8.625 in row is the published build and every other row is a sweep point, not a published case. The last column is each row divided by the row before it.

| Foam OD, in | Wall, in | U, Btu/(hr ft2 degF) | U ratio to the row before |
| --- | --- | --- | --- |
| 6.625 | 0.0000 | 105.9799311355 | n/a |
| 7.125 | 0.2500 | 4.6857421371 | 22.61753379 |
| 7.625 | 0.5000 | 2.4778766919 | 1.89103120 |
| 8.125 | 0.7500 | 1.7192055844 | 1.44129167 |
| 8.625 | 1.0000 | 1.3348791131 | 1.28791107 |
| 9.625 | 1.5000 | 0.9462648797 | 1.41068230 |
| 10.625 | 2.0000 | 0.7496047834 | 1.26235171 |
| 12.625 | 3.0000 | 0.5500987291 | 1.36267318 |
| 16.625 | 5.0000 | 0.3860878878 | 1.42480183 |

## The ratio column is per row, not per inch

The rows are not evenly spaced. The first four steps add 0.2500 in of wall each, then the steps widen to 0.5000 in, then 0.5000, then 1.0000, then 2.0000. That is why the column stops falling: 1.28791107 at the published build is followed by 1.41068230, which looks better only because it was bought with twice the wall. Read the wall column alongside it and the pattern is intact.

## The log is the reason

A layer resistance goes as ln(Do/Di), and a logarithm cares about the ratio of the diameters, not the thickness. The first quarter inch of wall, ln(7.125 / 6.625), is 0.0727593543. A quarter inch added out at the surface, ln(16.625 / 16.125), is 0.0305367239. The inner one is worth 2.38268370 of the outer one.

## The mistake

Reading the ratio column as a return per inch and concluding there is a thickness at which foam starts paying again. There is not. The rows widened. The other half of the mistake is chasing the foam's share, which climbs from 95.729166 percent at a quarter inch of wall to 99.741999 percent at five inches. That says the rest of the stack has already been made irrelevant, and there is nothing left for more foam to remove.

## What the sweep will not do for you

It contains no optimum and the engine offers none. `overallU` prices no material and returns a U for a foam wall of any size you type. Where a coating stops being worth its cost is a question about money and installation, and nothing in this module has an opinion on it.

## Exercise

Take the foam outside diameter from 6.625 in to 7.125 in and record U, then from 12.625 in to 16.625 in and record it again.

State how much wall each step added, and which of the two ratios you would quote to somebody asking what another inch of foam is worth.
