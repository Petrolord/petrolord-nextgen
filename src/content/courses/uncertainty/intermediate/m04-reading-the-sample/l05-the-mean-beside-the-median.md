# The mean beside the median

ISIALA's breakeven run prints two central numbers, a mean of 73.6242 and a median of 73.3297 USD per bbl, and the base case at the stated medians gives a third, 71.6277. They answer three different questions.

{{panel:ec-breakeven-explorer}}

## Three centres

| statistic | breakeven price |
| --- | --- |
| mean | 73.6242 |
| 50th percentile of breakeven price | 73.3297 |
| base case at the stated medians | 71.6277 |

The median is the price at sorted index 2500: half the iterations broke even at or under it. The mean averages all 5000 prices. The base case is no statistic of the sample: it is one solve with capex at 180 million USD, opex at 20 million USD a year and efficiency at 0.91, and it prints the same number whatever the seed or the iteration count.

## Why the mean sits higher than the median

Mean minus median is 0.2944. A mean past the median says the longer tail is on the right, and ISIALA's is: the lowest price is 50.7415 and the highest 107.6755, much further from the median on the high side. Capex fits a triangle of 127.2260 / 168.6738 / 252.3607 and opex one of 13.3201 / 17.4160 / 30.8541, both with the mode low in the range and a long upper reach, so the dearest draws pull a few breakevens far up.

The skew can run the other way. The published mc_with_unreachable run reports a mean of 446.8432 under its median of 449.5729, because its expensive tail was cut off at the 500 USD per bbl bracket.

## Why the base case sits lowest

Plugging the medians in does not give the median answer. The breakeven is no straight line in its inputs: efficiency scales the barrels, and tax switches on year by year at its own kink. Push skewed triangles through that and the centre of the output drifts from the output at the centre. The published mc_default_seed_300 run shows the same order: base 175.1500, median 178.1754, mean 180.0854.

## What the mean refuses

The mean carries no probability. No share of the iterations is promised to break even under 73.6242, and the engine's own insight quotes the median and the 90th percentile and leaves the mean out. It is also the centre most moved by a few dear iterations.

## The mistake

The careful mistake is running the deterministic case at the stated medians and calling the result the median breakeven. It is a single solve, and on ISIALA it sits under the median of the sample. The second is quoting whichever centre suits the decision without naming it.

## Exercise

Write ISIALA's mean, median and base case breakeven, and the difference between the mean and the median. Say why the mean is higher than the median on ISIALA and lower on mc_with_unreachable, and why the base case at the stated medians is not the median of the run.
