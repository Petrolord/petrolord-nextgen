# Working the capstone

There is a right order for this work. Most of what goes wrong in an intervention screening comes from asking for the verdict before establishing what it was read on.

{{panel:pd-candidate-explorer}}

## Read the column before you read the history

Look at the derivative column first, and at its spelling. `Number(null)` is 0, only `Number(undefined)` is NaN, and the filter requires a finite time and a finite ratio, never a finite derivative. A column of nulls reaches the flat branch and comes back reassuring. Then look at the last sample, because `minWor` is 0.1 and is compared against that one reading alone, whatever ratio column arrived. Then count: fewer than six samples is refused outright, and the refusal says six producing samples is the bare minimum and a useful reading wants far more.

## Fit the whole history before you window anything

Run the measurement on the raw series with no window and no classifier. Record the slope, the intercept, the fit quality as a fraction, the point count and the span in log cycles, and set that count against the rows you handed in, because the fit drops what it cannot take a logarithm of and says nothing.

## Then diagnose, and write the window down beside the slope

The default `lateFraction` is 0.5 and it is clamped to 0.1 through 1.0 in silence. A slope without its window is not a reading, so record the fraction, the window start in days, both slopes and both fit qualities together. The two slopes in that object were measured on different data: the ratio slope over every late sample, the derivative slope over only the positive ones.

## Sweep before you decide anything

Move the fraction across its range and put each derivative slope against `channellingSlope` 1.3. Inside the ambiguous band of 0.25, running from 1.050000 to 1.550000, the threshold decides the mechanism rather than the physics, because on a power law the ratio and its derivative have the same log-log slope. Record the positive and negative counts in each window: the negatives are the coning argument, and the fit never sees them.

## Then the skin, and check its plausibility yourself

`skinPiMultiplier` returns an ok flag. `pssDenominator`, `minimumSkin` and `skinFromPiRatio` return a bare NaN, so run `Number.isFinite` at every call site. The guard fires only at the pole, so set the after-skin against the range its refusal text names, about -3 to -5 on acid and -5 to -6 on a fracture.

| Check | What passing looks like |
| --- | --- |
| Derivative column | Finite, spelling recorded |
| Last sample | Above the gate, right fluid |
| Window | Fraction and start in days written down |
| Two fits | Point counts and spans kept separate |
| Span | Above `minSpanDecades` 0.4, fit quality above `minR2` 0.5 |
| Skin | ok flag read, after-skin inside the achievable range |
| Screening | The fluid the diagnosis read is named |

Units: days, ft, a bare ratio for water-oil, scf/stb for gas-oil, percent for water cut, dimensionless for skin and every log-log slope, log cycles for spans.

## Exercise

Work a screening through this order, one line per step, then name the step that, done out of order, leaves every later number defensible and the conclusion wrong.
