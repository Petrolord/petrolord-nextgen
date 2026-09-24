# Equidistant neighbours

{{panel:ef-classify-explorer}}

The last lesson settled a tie in the votes. This one settles a tie one step earlier, in the neighbours. When k cuts between two training rows that are equally far from the new row, one of them becomes a neighbour and the other is left out.

## A golden built so the tie is certain

The engine's golden `knn-equidistant-lower-row` uses one log and no scaling. Four training rows, counted from 0, sit at 0, 2, 4 and 9, labelled a, b, c, c. A new row sits at 2, and k is 2.

| training row | sits at | label | distance from the new row |
| --- | --- | --- | --- |
| 1 | 2 | b | on it |
| 0 | 0 | a | 2.000000 |
| 2 | 4 | c | 2.000000 |
| 3 | 9 | c | farther |

Row 1 sits on the new row, so it is the first neighbour. Rows 0 and 2 are both 2.000000 away, and only one more neighbour is wanted. The engine takes the lower row, row 0, so the neighbours are rows 1 and 0 and the prediction is b. The basis states the rule:

> the k nearest training rows, taken one at a time: the lowest row among those whose squared distance is within 1e-12 (relative) of the smallest remaining

## Why a band

Logs are written in decimals, and most decimals are not exact in binary. Two distances that are equal on paper can differ in their last bits once computed, and the order of two such figures would then be decided by rounding. The engine therefore judges "equally far" inside a band: a squared distance within 1e-12 of the smallest remaining one, relative to it, counts as tied, and a tie goes to the lower row. The band is inclusive, so a squared distance exactly at its edge is tied; beyond the edge, rows are ordered by size.

Two figures that print alike at six decimals are tied only where the engine says so. A table showing 2.000000 twice says they agree to six decimals; the engine's comparison inside its band decides the order.

## Where this rule belongs

The same band governs k-means, where a row equally near two centres goes to the lower centre, and agglomerative clustering, where tied merge heights go to the lowest cluster ids. Each function has its own tie-break, and a later module lays them side by side. For kNN the rule is the lower row, and it fixes which rows are neighbours before any vote is taken.

## Exercise

Open the view "Ties: a tied vote, equidistant rows, a tied root" and read the equidistant row: the neighbours, the votes and the prediction. Then work out, from the table above, which neighbours and votes the new row would have if the engine had taken row 2 in place of row 0, and apply the vote rule of the last lesson to them. Write down whether the prediction would change, and which part of the printed result would.
