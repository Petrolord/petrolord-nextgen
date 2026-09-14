# Sorting the sample

A Monte Carlo breakeven run produces one price per iteration, in the order the draws came out. Nothing can be read from that list until it is sorted, and the sorting rule decides which price each percentile is.

{{panel:ec-breakeven-explorer}}

## What the run returns

ISIALA's breakeven run takes 5000 iterations at seed 20260829. Each iteration draws capex, opex and efficiency, in that order, from their fitted triangles, builds a case and bisects for the oil price that sets NPV to zero. Iteration 1 draws capex of 226.5205 million USD, opex of 24.4593 million USD a year and efficiency of 97.2265 percent, and its breakeven is one entry among 5000. Excluded reads 0, so every iteration found a price under the 500 USD per bbl bracket top.

Sorted, it runs from 50.7415 to 107.6755 USD per bbl, and every statistic the engine reports is read off that list.

## The index rule

The breakeven engine takes a percentile as one sorted value, sorted[min(n - 1, floor(q n))], counting from index zero.

| statistic | sorted index | breakeven price |
| --- | --- | --- |
| 10th percentile of breakeven price | 500 | 62.1713 |
| 50th percentile of breakeven price | 2500 | 73.3297 |
| 90th percentile of breakeven price | 4500 | 85.5912 |

Floor means no averaging and no interpolation: the reported median is a price one iteration actually produced. The min(n - 1, ...) guard protects the top end, where a q of one would ask for index n, one step past the last value.

## What sorting throws away

Sorting keeps the prices and discards which draws made them. The sorted list cannot tell you whether the price at index 4500 came from high capex, high opex or low efficiency. That question belongs to the tornado, a separate calculation at the stated percentiles that never looks at the sample.

The three draws in each iteration are independent, so a capex overrun in the sample says nothing about opex.

## The mistake

The careful mistake is reading the two ends of the sorted list as the range of the answer. The lowest price, 50.7415, and the highest, 107.6755, are each a single iteration, one lucky or unlucky combination of three draws, and nothing else in the sample supports either. The 10th and 90th percentiles each have hundreds of prices on their outer side, which is why they are the numbers to quote.

The second mistake is reading one iteration as a scenario. Iteration 1 drew capex of 226.5205 million USD, past the stated 90th percentile of 220. It is still one price in the list.

## Exercise

Write the sorted index the engine uses for the 10th percentile, the median and the 90th percentile on ISIALA's 5000 iteration run, and the price at each. Then say why the lowest price in the sample, 50.7415 USD per bbl, is no statement of how low ISIALA's breakeven can go, and name the calculation that says which input drives the price.
