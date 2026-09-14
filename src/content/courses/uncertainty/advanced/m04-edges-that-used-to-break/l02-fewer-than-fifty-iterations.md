# Fewer than fifty iterations

The Scenario Builder thins its S-curve before drawing it, keeping one sorted value in every so many. The engine as published kept nothing when a run had fewer than fifty iterations (finding S5); as repaired in EC3-0 a short run keeps every point.

{{panel:ec-risk-explorer}}

## The downsample rule

The S-curve keeps sorted index i when i divided by a step leaves no remainder, and the step is the iteration count divided by 50, rounded down. ISIALA's Scenario Builder run has 1000 iterations, so the step is 20:

| iterations | S-curve points | kept | first probability | last probability |
| --- | --- | --- | --- | --- |
| 1000 | 50 | one every 20 sorted values | 0.0000 | 98.0000 |

At 40 iterations the step rounds down to zero. The published rule then asked for the remainder of a division by zero, which in JavaScript is not a number, the test failed at every index, and the curve came back as an empty array. There was no error and no warning, only a blank chart. The repair floors the step at 1, and forty iterations on ISIALA now give 40 S-curve points.

## A silent failure is worse than a throw

Finding S4 threw, so a user knew something had broken. S5 returned the three NPV cases, the emv and the histogram beside an S-curve with nothing in it, and the chart looked like a rendering fault.

## The top of the curve is not the top of the sample

At 1000 iterations the first point sits at probability 0.0000 and the last at 98.0000, because the kept indices climb in steps of 20 and stop short of the end. ISIALA's highest NPV, 149.3540 million USD, is in the sample and in the histogram, and it is not on the S-curve. Read the extremes from the lowest and highest values, 16.3054 and 149.3540, never off the ends of the plotted curve.

## What the repair refuses

The repair makes a short run drawable. It does not make one trustworthy. Forty NPVs give a curve of forty steps, and nothing in the output says the run was short. The breakeven engine at the default seed shows how far a short run can sit from a long one: its 90th percentile of breakeven price is 86.3529 on 100 iterations and 85.4380 on 20000.

## The mistake

The careful mistake is choosing a small iteration count for a quick look and then reading the curve as the distribution. The second is reading the last plotted point as the maximum outcome. At 1000 iterations the curve ends at 98.0000, and the top of the sample is left off.

## Exercise

State the S-curve step and point count for ISIALA's 1000 iteration run, and the probability of its first and last point. Then say what the published engine returned for the S-curve at 40 iterations, why it did, and how many points the repaired engine returns.
