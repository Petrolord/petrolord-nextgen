# The margin against the threshold

The whole spend turns on one subtraction: the fitted derivative slope less 1.3. The dial that sets the window moves that subtraction further than the subtraction itself is worth.

{{panel:pd-candidate-explorer}}

## The thresholds, and why they are round

`channellingSlope` is 1.3, `ambiguousBand` is 0.25, `coningSlope` is -0.1, `minR2` is 0.5 and `minSpanDecades` is 0.4. All are named defaults, all are overridable, and all are round because they are boundaries between pictures rather than measurements of anything. The band puts the ambiguous zone on the derivative slope at 1.050000 to 1.550000, a width of 0.500000.

The module's own comment concedes why the boundary carries so much weight: for any power-law history the ratio and its derivative have the same log-log slope, so nothing separates ordinary displacement from channelling except how steep the climb is.

## The sweep as a margin

Each row is the derived derivative slope on teaching well ELELENWO-4, fitted on the positive-derivative samples in the window that fraction opens, less `channellingSlope`. ELELENWO-4 is a teaching case, not a published one.

| lateFraction | Derivative slope less 1.3 |
| --- | --- |
| 0.20 | 0.300276347 |
| 0.30 | 0.244046342 |
| 0.40 | 0.185563987 |
| 0.50 | 0.142132492 |
| 0.60 | 0.087035000 |
| 0.70 | 0.036892539 |
| 0.80 | -0.007367476 |
| 0.90 | -0.045639905 |
| 1.00 | -0.070644001 |

At the default the margin is 0.142132492. Across the whole range of the dial the slope travels 0.370920348, from 1.229355999 to 1.600276347, so the analyst's free choice is worth about two and a half times the margin the verdict rests on. The narrowest row is 0.80, where 0.007367476 of slope stands between a block and a candidate.

## What the ambiguous flag catches, and what it does not

At the default the reading is 0.142132492 from the boundary, inside the band of 0.25, so `ambiguous` comes back true and the engine appends its own warning to take the reading to the plot or a production log. That flag is doing its job here.

It is not a safety net in general. The published `displacement` history returns a derivative slope of exactly 1.000000000 at an r-squared of 1.000000000 over a window opening at t = 186.345364 days, and comes back at confidence high with `ambiguous` false, because 1.000000000 sits outside the band. A slope of one is the case that most needs a plot and a person, and the flag says nothing about it.

## The mistake

Quoting a margin without the window. The number 0.142132492 is a property of the window opening at t = 250.242976 days, not of the well.

## What it refuses

The engine never refuses on a small margin. It flags the band, then returns the verdict anyway, and the screening acts on the verdict.

## Exercise

Record the derivative slope at `lateFraction` 0.70 and 0.80 and subtract 1.3 from each.

Then say what the sign change between them buys and what it costs.
