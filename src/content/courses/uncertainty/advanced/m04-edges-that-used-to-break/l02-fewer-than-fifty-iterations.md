# Fewer than fifty iterations

A run of forty iterations draws the same S-curve a run of a thousand draws: 51 points read from whatever sample exists. The engine as published returned nothing at all below fifty iterations (finding S5).

{{panel:ec-risk-explorer}}

## What a short run draws

The curve reads the sorted sample at 51 probabilities, 0.0000, 2.0000 and so on to 100.0000 percent, whatever the iteration count. Forty iterations on ISIALA give 51 points, and the last of them is 183.6938 million USD, the highest of those forty. The first and last points always sit on the lowest and the highest value of the run, so the ends of the curve are the ends of the sample.

## Why it used to return nothing

History, before the 2026-09-15 repair: the chart kept sorted index i when i divided by a step left no remainder, and the step was the iteration count divided by 50, rounded down. At forty iterations the step rounded down to zero. The rule then asked for the remainder of a division by zero, which in JavaScript is not a number, the test failed at every index, and the curve came back as an empty array. There was no error and no warning, only a blank chart.

## A silent failure is worse than a throw

Finding S4 threw, so a user knew something had broken. S5 returned the three NPV cases, the emv and the histogram beside an S-curve with nothing in it, and the chart looked like a rendering fault. A curve that always draws carries the opposite hazard: a run of forty and a run of a thousand now look alike on the screen.

## The point count is not the sample size

The 51 points describe forty NPVs as readily as a thousand, and nothing in the output says which. The breakeven engine at the default seed shows how far a short run sits from a long one: its 90th percentile of breakeven price is 86.3529 on 100 iterations and 85.4380 on 20000. Record the iteration count beside every curve, because the picture will not tell anyone.

## What the repair refuses

The repair makes a short run drawable. It does not make one trustworthy, it adds no warning, and it reports the iteration count nowhere on the chart. Forty draws of three factors are forty draws however smooth the curve looks.

## The mistake

The careful mistake is choosing a small iteration count for a quick look and then reading the curve as the distribution. A second mistake belongs to the old curve and is worth knowing when an old chart turns up: its last plotted point sat at probability 98.0000 with the top of the sample left off, so its right end was not the maximum. On the repaired curve it is.

## Exercise

State how many S-curve points ISIALA's forty iteration run returns and what its last value equals. Then say what the published engine returned for that same run, why it did, and which finding records it.
