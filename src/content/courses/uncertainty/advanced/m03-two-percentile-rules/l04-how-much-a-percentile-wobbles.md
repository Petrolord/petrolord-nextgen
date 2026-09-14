# How much a percentile wobbles

A percentile read from a sample moves when the seed or the iteration count changes. The engine reports the percentile without saying how far it can move.

{{panel:ec-risk-explorer}}

## Ten seeds

Here is ISIALA's breakeven run at 5000 iterations for seeds 1 to 10, with everything else held fixed:

| seed | 10th percentile of breakeven price | median breakeven price |
| --- | --- | --- |
| 1 | 62.0081 | 72.8047 |
| 2 | 62.0849 | 72.8951 |
| 3 | 62.4650 | 72.8255 |
| 4 | 62.1070 | 72.9631 |
| 5 | 62.0258 | 72.6338 |
| 6 | 62.3276 | 72.9061 |
| 7 | 62.0800 | 72.8475 |
| 8 | 62.3661 | 72.9739 |
| 9 | 62.3871 | 73.1287 |
| 10 | 62.2711 | 73.0649 |

Across the ten seeds, the 10th percentile covers a range of 0.4569 and the median a range of 0.4949 (derived), both in USD per bbl. The two do not move together. Seed 3 has the highest 10th percentile, 62.4650, and one of the lower medians, 72.8255.

## The default seed sits outside

At the default seed 20260829, the same run gives a median of 73.3297. That is higher than all ten medians, the highest of which is 73.1287. Its 10th percentile, 62.1713, sits inside the ten seeds' span from 62.0081 to 62.4650. Being the default makes a seed reproducible and nothing more. It does not make the seed typical, and ten seeds are not the whole range either: an eleventh could land outside both ends.

## More iterations

At the default seed, here is how the result changes with the iteration count:

| iterations | 10th percentile | median | 90th percentile |
| --- | --- | --- | --- |
| 100 | 61.1861 | 72.7058 | 86.3529 |
| 500 | 61.5530 | 72.9806 | 86.4976 |
| 1000 | 62.1241 | 72.9245 | 86.2728 |
| 5000 | 62.1713 | 73.3297 | 85.5912 |
| 20000 | 62.2724 | 73.0302 | 85.4380 |

The median does not settle in one direction. It rises from 72.7058 to 72.9806, falls to 72.9245, rises to 73.3297 and falls again to 73.0302. The 90th percentile climbs from 86.3529 to 86.4976 before it falls. At 100 iterations the 10th percentile, 61.1861, sits below every one of the ten seeds' values at 5000. The 5000 iteration median sits further from the 20000 iteration value than the 1000 iteration median does. More iterations shrink the typical wobble. They do not promise that any one bigger run lands closer.

## The same wobble on an NPV

The Scenario Builder shows the same effect on an outcome. At 1000 iterations, the Best case P50 is 81.1835 at seed 20260829 and 79.0624 at seed 43. On one sample, the two percentile rules differ by only -0.0116 at that median (derived). The seed moves the answer far more than the rule does. Arguing over which rule to use settles nothing while the seed is uncontrolled.

## The mistake

The careful mistake is taking the printed precision for real precision. The engine prints 73.3297 to four decimals because prices are always printed to four. The ten seeds already disagree in the first decimal place. A report that sets a median breakeven of 73.3297 against a hurdle a few cents away is comparing noise with a hurdle.
## What the engine refuses

The engine gives no confidence interval, no standard error and no convergence check. It gives no warning when a percentile moves by more than its rounding. The 20000 iteration run is not the truth either: it is one more sample from one seed. The only way to see the wobble is to run it yourself. Use several seeds at the iteration count you mean to report, and quote the spread beside the number.

## Exercise

Give the range of ISIALA's median breakeven price across seeds 1 to 10, and say where the default seed's median sits against it. Then use the iteration table to show that the median does not approach one value steadily. Say what a report should print beside 73.3297 before anyone compares it with a hurdle.
