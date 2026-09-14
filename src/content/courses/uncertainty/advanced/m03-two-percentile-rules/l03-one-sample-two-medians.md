# One sample, two medians

ISIALA's 1000 Scenario Builder NPVs have a median of 81.1835 under one rule and 81.1952 under the other. Both are correct.

{{panel:ec-risk-explorer}}

## The two readings

The sample is sorted once. n x 0.5 = 500 is whole on an even length, so the averaging rule takes the mean of the two middle values and returns 81.1835. That is the Best case P50. The floor rule takes the single value at index 500 and returns 81.1952. The difference is -0.0116 (derived).

| quantity | NPV, million USD |
| --- | --- |
| Best case P50, averaging rule | 81.1835 |
| median by the floor rule | 81.1952 |
| deterministic case | 81.0464 |
| emv, the sample mean | 80.1707 |
| Best case P50 at seed 43 | 79.0624 |

## Sizing the gap

Set -0.0116 beside ISIALA's other middle numbers. The deterministic case sits below both medians. The EMV sits further below, under the deterministic case. Seed 43 moves the Best case P50 down to 79.0624. Of all these gaps, the choice of rule is by far the smallest. It is the only one that changes nothing about the sample.

## The gap is half a spacing

On a whole n x q, the averaging rule's answer is the midpoint of two neighbouring sorted values, and the floor rule's answer is the upper neighbour. The gap between the rules is therefore exactly half the space between those neighbours. That space is as random as the sample. At the Low case the difference is -0.0896, at the median -0.0116 and at the High case -0.0056 (all derived). No rule of thumb says the gap is largest in the tails. Here the High case has the smallest gap of the three.

## A different pair of medians

A second pair of numbers often gets mixed up with the first. The Breakeven Analyzer's median breakeven price for ISIALA is 73.3297 USD per bbl, and its base case at the stated medians is 71.6277. That gap has a different cause: a different quantity, a different sample of 5000, triangular draws and a different engine. It says nothing about the NPV median. And a price takes percentile words, so neither number in that pair ever takes a P-label.

## The mistake

The careful mistake is reconciling to the fourth decimal. An analyst exports the NPVs, recomputes the median by picking a single value and gets 81.1952. The card says 81.1835, so they open a defect. There is none.

The opposite mistake is quoting the fourth decimal as though it carried information. The two rules already disagree in the second decimal place. A change of seed moves the whole-number part.

## What it refuses

Neither rule reports how uncertain its median is. Neither marks which rule produced it. Neither tells the reader the sample mean sits elsewhere.

## Exercise

Give ISIALA's median NPV under each rule and the derived difference, and say which one the Best case card shows. Then explain why the gap between the rules is half a spacing between two sorted values. Rank the rule difference, the deterministic case gap and the seed 43 change from smallest to largest.
