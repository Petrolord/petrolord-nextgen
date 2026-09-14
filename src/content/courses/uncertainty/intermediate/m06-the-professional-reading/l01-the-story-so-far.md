# The story so far

Five modules turned three stated beliefs into a breakeven price with an honest range, one rule and one proving number at a time.

## Percentiles are not endpoints

ISIALA's capex belief of 150 / 180 / 220 million USD is a 10th percentile, a median and a 90th percentile. The engine fits a triangle of 127.2260 / 168.6738 / 252.3607 whose CDF passes back through 150.0000, 180.0000 and 220.0000 exactly. Read as minimum, mode and maximum, the belief gives 164.4914, 182.5834 and 203.2668: the tails vanish. The shape ratio must sit strictly inside 0.381966 to 0.618034. The narrow opex belief 16 / 17 / 26 has a ratio of 0.100000, clamps to the most left-skewed triangle and reports exact false.

## A sample is its seed

mulberry32(20260829) opens with 0.936239, 0.826447 and 0.952306. Iteration 1 spends them on capex, opex and efficiency in that order, each in the upper branch, for 226.5205, 24.4593 and 97.2265. Two runs at one seed are identical, and seed 7 gives a median of 72.8475 against 73.3297 at the default.

## A price found by bisection

NPV rises with price, from -220.0581 at 20 USD per bbl to 311.7558 at 150, so bisection inside the 0 to 500 bracket is safe. ISIALA at its stated medians breaks even at 71.6277. Tax switches on in each year at its own kink, 18.2954 in year 2 climbing to 182.6642 in year 20, while year 1 carries all the capex and switches on at 160.9994. A hurdle raises the price: an NPV of 100 million USD needs 96.5968. A target the bracket cannot reach returns null.

## Reading the sample

Over 5000 iterations the 10th percentile of breakeven price is 62.1713, the median 73.3297 and the 90th percentile 85.5912, read at sorted indices 500, 2500 and 4500 with none excluded. The mean is 73.6242, above the median by 0.2944, and both sit above the base case. Iterations that cannot break even leave, and the percentiles describe the survivors.

## Two sides of a tornado

Swung between stated percentiles from the base of 71.6277, Total CAPEX runs from -7.0202 to 9.4067, a swing of 16.4269. Annual OPEX swings 14.7308 and Prod. Efficiency 8.7867, and efficiency's low side comes from its 90th percentile of 96 percent.

## The sentence the tier ends on

A breakeven price is a sorted sample read in percentile words, drawn from a seed that is written down, out of beliefs that were fitted honestly.

## Exercise

Write the fitted capex triangle and the three quantiles the endpoints reading gives instead. Then write ISIALA's three breakeven percentiles in percentile words beside the base case, and name the one tornado bar whose low side comes from a 90th percentile.
