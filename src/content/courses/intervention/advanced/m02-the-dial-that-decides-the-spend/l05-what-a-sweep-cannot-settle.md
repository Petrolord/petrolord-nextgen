# What a sweep cannot settle

Sweeping the window fraction prints the sensitivity. It does not say which window was right, and the two fit qualities in one return object rank the windows in opposite orders.

{{panel:pd-candidate-explorer}}

## The two fit qualities, row by row

Derived sweep on teaching well ELELENWO-4, a teaching case and not a published one. `derivativeR2` belongs to the slope fitted on the positive-derivative samples inside the window; `worR2` to the ratio fitted on every late sample in that same window. Both are fractions.

| lateFraction | derivativeR2 | worR2 | Mechanism |
| --- | --- | --- | --- |
| 0.20 | 0.999944740 | 0.063449269 | indeterminate |
| 0.30 | 0.999661253 | 0.692418777 | channelling |
| 0.40 | 0.999101063 | 0.869741844 | channelling |
| 0.50 | 0.998513658 | 0.921895186 | channelling |
| 0.60 | 0.997599130 | 0.955925314 | channelling |
| 0.70 | 0.996676450 | 0.972752511 | channelling |
| 0.80 | 0.995879922 | 0.981897063 | displacement |
| 0.90 | 0.995286721 | 0.987227989 | displacement |
| 1.00 | 0.994988494 | 0.989832434 | displacement |

`derivativeR2` is highest at 0.20 and falls every row to 1.00. `worR2` does the opposite, from 0.063449269 at 0.20 to 0.989832434 at 1.00. Choose the window by the better fit and you get the narrow one, which says channelling and buys a squeeze, or the wide one, which says displacement and refuses it, depending on which of two numbers in one object you read first.

## Why neither ranking is evidence

An r-squared says how well a straight line describes the points it was drawn through, and nothing about whether those were the right points. The narrow window fits beautifully because it holds few samples over a short stretch, and the reading at 0.20 still comes back with no span reported and a mechanism of indeterminate.

## What the sweep does establish

That the answer is not robust. Across the dial the derivative slope travels 0.370920348, from 1.229355999 to 1.600276347, against a `channellingSlope` of 1.3, so the analyst's free choice outweighs the margin the verdict rests on. Every row comes back `ok = true` at confidence low.

## What settles it instead

Not this function. The engine says as much at the default window: "Take this one to the plot, or to a production log, before spending on it." A rate cut followed by a falling water-oil ratio is the coning field test, and this teaching well was beaned back on day 2200, evidence the derivative fit discards on every row.

## The mistake

Averaging the sweep, or reporting its midpoint as the answer. It is a set of readings of one plot, not measurements of a well, and the spread is the finding.

## Exercise

Record `derivativeR2` and `worR2` at `lateFraction` 0.30 and at 1.00.

Then say which window each argues for, and what a reader needs beyond this function to choose.
