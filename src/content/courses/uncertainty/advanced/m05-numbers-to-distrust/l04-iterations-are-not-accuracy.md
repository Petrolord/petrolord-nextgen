# Iterations are not accuracy

More iterations make a sample larger. They do not walk a percentile steadily toward a true value, and a run at any count prints its answer to four decimals with no measure of how far another seed would move it.

{{panel:ec-risk-explorer}}

## One seed, five counts

ISIALA's breakeven run at the default seed 20260829:

| iterations | 10th percentile of breakeven price | median | 90th percentile of breakeven price |
| --- | --- | --- | --- |
| 100 | 61.1861 | 72.7058 | 86.3529 |
| 500 | 61.5530 | 72.9806 | 86.4976 |
| 1000 | 62.1241 | 72.9245 | 86.2728 |
| 5000 | 62.1713 | 73.3297 | 85.5912 |
| 20000 | 62.2724 | 73.0302 | 85.4380 |

The median does not settle in one direction. It rises from 72.7058 to 72.9806, dips to 72.9245, jumps to 73.3297 at 5000 and comes back to 73.0302 at 20000. The 5000 run, the one the course quotes as ISIALA's headline, sits further from the 20000 run than the 1000 run does.

## Ten seeds, one count

At 5000 iterations the medians of seeds 1 to 10 run from 72.6338 to 73.1287, a range of 0.4949, and their 10th percentiles run from 62.0081 to 62.4650, a range of 0.4569. The default seed's median, 73.3297, sits outside all ten. Nothing is wrong with seed 20260829. It drew a sample whose median lands high, and any seed can.

## What the seed buys

The seed buys reproducibility. Seed 20260829 at 5000 iterations returns 73.3297 every time, and a reviewer can reproduce it exactly. It buys nothing about accuracy: seed 7 at the same count returns 72.8475. The Scenario Builder behaves the same way on NPV, where the Best case P50 at 1000 iterations is 78.5315 at the default seed and 80.2233 at seed 43.

## What the engines refuse

Neither engine reports a standard error, a confidence band on a percentile or a warning that a run was short, and neither stops when an answer settles. A run of 100 iterations and a run of 20000 print their percentiles to the same four decimals, so the output gives no hint which one to believe more. No iteration count changes the belief either: the triangles decide where the 10th and 90th percentiles of breakeven price sit, and a longer run only samples those triangles more often.

## The mistake

The careful mistake is quoting 73.3297 to four decimals as if the fourth decimal carried information. At seed 7 the same median would have read 72.8475. Across ten seeds the median moves in its first decimal. The honest statement is the number with its seed and its iteration count, and the seed-to-seed range beside it whenever a difference that small could change the decision.

## Exercise

From the iteration table, state the median at 1000, 5000 and 20000 iterations, and say which of the first two sits closer to the third. Then give the range of the ten seed medians at 5000 iterations and say where the default seed's median sits against it.
