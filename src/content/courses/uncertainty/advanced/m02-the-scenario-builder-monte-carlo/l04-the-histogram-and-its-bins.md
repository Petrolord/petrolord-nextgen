# The histogram and its bins

The Scenario Builder sorts its NPVs into 20 equal bins that run from the lowest sampled value to the highest. The bins belong to one sample and move with every seed.

{{panel:ec-risk-explorer}}

## How the bins are set

The bin width is the sample's range divided by 20. On ISIALA at seed 20260829 the lowest NPV is -46.1564 and the highest is 208.9685, so each bin is 12.7562 million USD wide (derived). To place a value, the engine takes its distance above the lowest, divides by the width and rounds down. The highest value is kept inside the last bin.

## ISIALA's counts

| bins | counts, lowest bin first |
| --- | --- |
| lower ten | 1, 7, 22, 33, 48, 67, 72, 90, 88, 99 |
| upper ten | 79, 86, 69, 59, 48, 49, 33, 26, 21, 3 |

The counts add to 1000. The tallest bin is the tenth, with 99, and it is the bin holding the Best case P50 of 78.5315. The Low case P90 of 15.6063 falls in the fifth bin, which holds 48, and the High case P10 of 152.0653 in the sixteenth, which holds 49. The last bin holds three iterations, among them the highest NPV of 208.9685, which sets the right edge by itself.

## What the shape does not say

Read across the middle: the eighth bin holds 90, the ninth 88, the tenth 99, the eleventh 79 and the twelfth 86. Those dips between tall bins do not mean two populations. They are what 1000 values sorted into bins 12.7562 wide look like near the middle. The model has one field, three uniform ranges and no switch between regimes. Nothing in it could produce two peaks.

## The mistake

The careful mistake is reading the tallest bin as the most likely NPV. The tenth bin holds 99 of the 1000 iterations and the eighth holds 90, a gap that a slightly different bin width would close or reverse.

The second mistake is comparing histograms from two seeds bin by bin. Seed 43's sample has its own lowest and highest values, so its first bin starts somewhere else. Every one of its counts describes a different interval. The same is true after any change to a range.

## What it refuses

A histogram of counts does not give percentiles. No bin edge is the Low case P90, and the cases come from the sorted sample. It has no fixed axis across runs and no density scale.

When every range is zero, every NPV is equal and the width is zero. Every value then goes into the first bin: 30 of 30 on a 30 iteration run. The old code divided by that zero width and threw (FINDINGS S4).

## Exercise

Give ISIALA's bin width with the two values it is derived from. Name the bins holding the Low case P90, the Best case P50 and the High case P10, with their counts. Then say why a histogram at seed 43 cannot be compared with this one bin by bin.
