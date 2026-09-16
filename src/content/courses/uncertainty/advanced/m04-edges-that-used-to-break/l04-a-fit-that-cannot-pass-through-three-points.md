# A fit that cannot pass through three points

The breakeven engine fits each stated belief to a triangular whose CDF passes through all three percentiles. Some beliefs have no such triangular, and then the engine fits the nearest one there is, marks the fit inexact, and runs everything it reports on that fitted triangle.

{{panel:ec-risk-explorer}}

## The band a belief must sit in

The shape ratio of a belief is (50th - 10th) / (90th - 10th). A triangular with its mode at the minimum gives 0.381966, one with its mode at the maximum gives 0.618034, and every other triangular sits strictly between. ISIALA's opex belief is inside the band and the narrow opex belief is not:

| variable | stated 10th / 50th / 90th | shape ratio | min | mode | max | exact |
| --- | --- | --- | --- | --- | --- | --- |
| opex | 16 / 20 / 26 | 0.400000 | 13.3201 | 17.4160 | 30.8541 | true |
| opex, narrow belief | 16 / 17 / 26 | 0.100000 | 15.1886 | 15.1886 | 31.0000 | false |

At 0.100000 the stated median sits far too near the 10th percentile. The engine takes the most left-skewed triangular there is and says so: "the stated median sits too near the 10th percentile for any triangular to pass through all three points; the fit uses the most left-skewed triangular there is (mode at the minimum)".

## One belief through the whole result

Run ISIALA with the narrow belief and every number in the answer comes from the fitted triangle. The base case and the tornado use its own 10th, 50th and 90th percentiles, opex 16.0000 / 19.8197 / 26.0000, and the sample draws from that same triangle.

| opex belief | 10th percentile of breakeven price | median | 90th percentile of breakeven price | base |
| --- | --- | --- | --- | --- |
| 16 / 20 / 26 | 62.1713 | 73.3297 | 85.5912 | 71.6277 |
| 16 / 17 / 26 | 62.0843 | 73.1740 | 85.4599 | 71.3621 |

The stated median of 17 appears nowhere in the answer. The engine could not honour it, said so, and stopped using it. The tornado follows the same belief: Annual OPEX reads -5.5922 low and 9.1387 high around the base of 71.3621, against -5.8578 and 8.8730 on the belief that fits exactly.

## What it used to do

History, before the 2026-09-15 repair: the sample drew from the clamped triangle while the base case and the tornado read the stated median of 17. The base came out at 67.2301 and Annual OPEX read -1.4602 low and 13.2707 high, a bar far wider on its high side than the sample supports. One result carried two different opex beliefs, and only one of them had been fitted.

## What it refuses

It does not refuse the belief, ask for another, or switch to another family of distribution. It carries on with the clamped triangle, sets `exact` to false, appends the note and prints the beliefs it used. The published `mc_inexact_fit_note` clamps two beliefs at once and reports the percentiles it used for each, capex 800.0000 / 990.9830 / 1300.0000 fitted and opex 50.0000 / 65.4508 / 75.0000 fitted, with a base of 177.6265.

## The mistake

The careful mistake is quoting the stated belief in a report when the fit was inexact. On the narrow belief the answer runs at an opex median of 19.8197 and never at 17. Read `exact` on every fit, then read the beliefs line beside it, because that line names the numbers the base case and the tornado used.

## Exercise

State the shape ratio of the narrow opex belief, the band it must sit in, and its fitted minimum, mode and maximum. Then give the base breakeven under that belief, say which opex median produced it, and say what the retired engine reported instead.
