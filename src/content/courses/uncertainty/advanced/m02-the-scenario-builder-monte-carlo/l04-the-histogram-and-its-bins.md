# The histogram and its bins

The Scenario Builder sorts its NPVs into 20 equal bins that run from the lowest sampled value to the highest. The bins belong to one sample and move with every seed.

{{panel:ec-risk-explorer}}

## How the bins are set

The bin width is the sample's range divided by 20. On ISIALA at seed 20260829 the lowest NPV is 16.3054 and the highest is 149.3540, so each bin is 6.6524 million USD wide (derived). To place a value, the engine takes its distance above the lowest, divides by the width and rounds down. The highest value is kept inside the last bin.

## ISIALA's counts

| bins | counts, lowest bin first |
| --- | --- |
| lower ten | 7, 9, 15, 30, 45, 60, 73, 84, 114, 94 |
| upper ten | 96, 111, 92, 65, 52, 28, 12, 7, 5, 1 |

The counts add to 1000. The tallest bin is the ninth, with 114. The Best case P50 of 81.1835 falls in the tenth, which holds 94. The Low case P90 of 48.7439 falls in the fifth bin, and the High case P10 of 109.8980 in the fifteenth. The last bin holds one iteration, the highest NPV of 149.3540, which sets the right edge by itself.

## What the shape does not say

Read across the middle: the ninth bin holds 114, the tenth 94, the eleventh 96 and the twelfth 111. That is a dip between two tall bins, and it does not mean two populations. It is what 1000 values sorted into bins 6.6524 wide look like near the middle. The model has one field, three uniform ranges and no switch between regimes. Nothing in it could produce two peaks.

## The mistake

The careful mistake is reading the tallest bin as the most likely NPV. The ninth bin sits one bin below the bin that holds the median, and a slightly different width would merge or split the two peaks.

The second mistake is comparing histograms from two seeds bin by bin. Seed 43's sample has its own lowest and highest values, so its first bin starts somewhere else. Every one of its counts describes a different interval. The same is true after any change to a range.

## What it refuses

A histogram of counts does not give percentiles. No bin edge is the Low case P90, and the cases come from the sorted sample. It has no fixed axis across runs and no density scale.

When every range is zero, every NPV is equal and the width is zero. Every value then goes into the first bin: 30 of 30 on a 30 iteration run. The old code divided by that zero width and threw (FINDINGS S4).

## Exercise

Give ISIALA's bin width with the two values it is derived from. Name the bins holding the Low case P90, the Best case P50 and the High case P10, with their counts. Then say why a histogram at seed 43 cannot be compared with this one bin by bin.
