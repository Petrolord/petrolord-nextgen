# The S-curve downsample

The Scenario Builder's S-curve is 51 quantile points read from the sorted sample. The downsample it is named for, one sorted value in every twenty, was retired with the EC3-6 repair.

{{panel:ec-risk-explorer}}

## How the points are chosen

The curve reads the sample at 51 evenly spaced probabilities: 0.0000, 2.0000, 4.0000 and so on to 100.0000 percent. Each height uses the same quantile rule the three result cards use, so the curve and the cards are one reading of one sample. On ISIALA at 1000 iterations and seed 20260829 the first value is -46.1564 million USD, equal to the lowest sampled NPV, and the last is 208.9685, equal to the highest. The point count never changes with the iteration count.

## What the downsample used to drop

History, before the 2026-09-15 repair: the chart kept every sorted value whose index was a multiple of a step, and the step was the iteration count divided by 50, rounded down. At 1000 iterations that gave one point every twenty sorted values, 50 points in all, and the last of them sat at probability 98.0000 on a value of 125.8619. The highest NPV of the run was never drawn, so a reader who took the curve's right end for the sample's maximum was quoting a number that part of the sample exceeded.

## The axis counts from below

The y axis is the share of the sample below a value. The value at 90 on that axis is one that 90 percent of the sample falls below. Under the exceedance meaning, that is the High case P10. The value at 10 is the Low case P90. A reader who takes the P-label straight off the axis swaps the cases, in the same way the old results cards did.

## The curve and the cards agree

Read ISIALA's curve at 10, 50 and 90 percent and it gives 15.6063, 78.5315 and 152.0653, the three card values to the fourth decimal. That agreement is the repair: one rule reads both. The other rule in this module belongs to the Breakeven Analyzer, and on the same 1000 NPVs it reads 15.6619, 78.5836 and 152.1794 at those positions. A number lifted off a chart still needs the rule that drew it.

## Another engine, another axis

The Breakeven Analyzer's S-curve plots y as (i + 1) / n, a fraction, over every sorted iteration. At index 2500 of 5000, y is 0.500200. The Scenario Builder would put that position at 50 on its axis. The two curves in one module differ in scale and in how many points they draw.

## What it refuses

The curve shows no exceedance, and its 51 points are a summary of a sample rather than the sample. The count says nothing about how long a run was: forty iterations on ISIALA give 51 points too, the last of them 183.6938, the highest of those forty. Below fifty iterations the chart used to draw nothing at all (FINDINGS S5).

## Exercise

Say how many points ISIALA's S-curve has at 1000 iterations, the probability of its first and last point and the value at each. Then give the curve's heights at 10, 50 and 90 percent beside the three card values, and say why they agree.
