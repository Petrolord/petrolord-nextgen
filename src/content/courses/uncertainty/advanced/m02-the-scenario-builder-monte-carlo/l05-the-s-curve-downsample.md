# The S-curve downsample

The Scenario Builder's S-curve plots one sorted NPV in every 20, against the percentage of the sample below it. It starts at 0 and never reaches the top.

{{panel:ec-risk-explorer}}

## How the points are chosen

The sorted value at index i gets a probability of i divided by n, times 100. The chart keeps every point whose index is a multiple of a step. The step is the iteration count divided by 50, rounded down, and never less than 1. At 1000 iterations that makes one point every 20 sorted values, and 50 points in all. The first point sits at probability 0.0000, on the lowest NPV of 16.3054. The last sits at 98.0000.

## What the downsample drops

The top of the curve is never drawn. The last point plotted is the sorted value at probability 98.0000. Every value above it is left off, including the highest NPV of 149.3540. A reader who takes the curve's right end as the sample's maximum is quoting a number that part of the sample exceeds.

## The axis counts from below

The y axis is the share of the sample below a value. The value at 90 on that axis is one that 90 percent of the sample falls below. Under the exceedance meaning, that is the High case P10. The value at 10 is the Low case P90. A reader who takes the P-label straight off the axis swaps the cases, in the same way the old results cards did.

## The curve and the card disagree slightly

The point plotted at height 10 is the sorted value at index 100, 48.8335. The Low case card shows 48.7439, because its `p10` key averages the two values on either side of that position. The middle point shows 81.1952 against 81.1835 on the Best case card, and the point at 90 shows 109.9036 against 109.8980 on the High case card. Both are correct. They come from two different percentile rules, and the curve uses the one the cards do not.

## Another engine, another axis

The Breakeven Analyzer's S-curve plots y as (i + 1) / n, a fraction. At index 2500 of 5000, y is 0.500200. The Scenario Builder would put that same index at 50. The two curves in one module differ in scale, and they are offset by one position.

## What it refuses

The curve does not show exceedance, and it does not show the top of the sample. Below 50 iterations it used to show nothing: the step was zero and the curve came back empty. Forty iterations on ISIALA now give 40 points (FINDINGS S5).

## Exercise

Say how many points ISIALA's S-curve has at 1000 iterations and the probability of the first and last. Explain why 149.3540 is not on the curve. Then give the curve's value at height 10 and the Low case card's value, and say why they differ.
