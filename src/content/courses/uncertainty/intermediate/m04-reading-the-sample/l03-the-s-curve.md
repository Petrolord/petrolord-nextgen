# The S-curve

The S-curve draws the sorted sample: each breakeven price against the fraction of the sample at or under it.

{{panel:ec-breakeven-explorer}}

## How each point is placed

Sort the 5000 breakeven prices from ISIALA's run at seed 20260829. The point at sorted index i sits at that price with height y = (i + 1) / n. The first point, at the lowest price of 50.7415 USD per bbl, sits one step off zero, and the last, at 107.6755, reaches one. Every point is a real iteration's price, a staircase of 5000 small steps.

At index 2500, the index the engine uses for the median, the price is 73.3297 and the height is 0.500200.

## Reading it both ways

Read from the price axis up: choose an oil price and the height is the fraction of iterations that broke even at or under it.

Read from the probability axis across and the curve passes 62.1713 a tenth of the way up, 73.3297 half way and 85.5912 at nine tenths.

The shape shows what the table cannot. The steep middle between the 10th and 90th percentiles holds most of the sample. The tails flatten out to 50.7415 on the left and 107.6755 on the right, and the right tail is the longer, because the highest price sits further from the median than the lowest. That tail starts in the capex and opex triangles, whose fitted maxima of 252.3607 and 30.8541 reach well past their stated 90th percentiles of 220 and 26.

## Two conventions a step apart

The percentile rule takes index floor(q n), while the curve places index i at (i + 1) / n. That is why the height at index 2500 reads 0.500200 and not a round half, and why reading the curve at exactly half lands one step to the left of the reported median. On 5000 iterations the gap is tiny, and it is a convention rather than an error.

## What the curve refuses

It shows only what was sampled. Under 50.7415 the curve reads zero and past 107.6755 it reads one. Neither says ISIALA's breakeven cannot fall outside that span; these draws simply did not reach further.

It also belongs to this engine alone. The Scenario Builder's NPV S-curve is drawn at 51 points, at probabilities of 0.0000, 2.0000 and so on to 100.0000 percent, so it starts at the sample's lowest NPV and ends at its highest. The curve that shipped before the 2026-09-15 repair kept every twentieth sorted value instead, 50 points ending at 98.0000 percent, short of the highest NPV it had drawn. Two such curves on one chart compare two conventions as well as two quantities.

## The mistake

The careful mistake is reading this S-curve as an exceedance curve. The height is the probability of a breakeven at or under the price. Turn it upside down and 85.5912 becomes a price the breakeven exceeds nine times in ten, the opposite of what the run found.

## Exercise

State the height the S-curve gives at index 2500 and the price there, and explain in one sentence why the height is not exactly a half. Then read the curve's height at ISIALA's quick input oil price of 70 USD per bbl off the panel, and say in words what that fraction means.
