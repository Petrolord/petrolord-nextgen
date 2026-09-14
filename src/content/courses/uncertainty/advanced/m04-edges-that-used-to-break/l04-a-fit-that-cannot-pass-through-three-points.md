# A fit that cannot pass through three points

The breakeven engine fits each stated belief to a triangular whose CDF passes through all three percentiles. Some beliefs have no such triangular, and then the engine fits the nearest one there is, marks the fit inexact and writes a note into its insight.

{{panel:ec-risk-explorer}}

## The band a belief must sit in

The shape ratio of a belief is (50th - 10th) / (90th - 10th). A triangular with its mode at the minimum gives 0.381966, one with its mode at the maximum gives 0.618034, and every other triangular sits strictly between. ISIALA's opex belief is inside the band and the narrow opex belief is not:

| variable | stated 10th / 50th / 90th | shape ratio | min | mode | max | exact |
| --- | --- | --- | --- | --- | --- | --- |
| opex | 16 / 20 / 26 | 0.400000 | 13.3201 | 17.4160 | 30.8541 | true |
| opex, narrow belief | 16 / 17 / 26 | 0.100000 | 15.1886 | 15.1886 | 31.0000 | false |

At 0.100000 the stated median sits far too near the 10th percentile. The engine takes the most left-skewed triangular, with the mode at the minimum, and says so in words: "the stated median sits too near the 10th percentile for any triangular to pass through all three points; the fit uses the most left-skewed triangular there is (mode at the minimum)".

## Two beliefs in one result

Run ISIALA with the narrow belief and one result carries two opex beliefs at once. The base case and the tornado use the stated numbers; the sample uses the clamped triangle.

| opex belief | 10th percentile of breakeven price | median | 90th percentile of breakeven price | base |
| --- | --- | --- | --- | --- |
| 16 / 20 / 26 | 62.1713 | 73.3297 | 85.5912 | 71.6277 |
| 16 / 17 / 26 | 62.0843 | 73.1740 | 85.4599 | 67.2301 |

The base case at the stated median of 17 falls to 67.2301 USD per bbl. The sample barely moves, because the clamped triangle cannot put its median at 17. The tornado follows the stated numbers: Annual OPEX reads -1.4602 low and 13.2707 high around the base of 67.2301, against -5.8578 and 8.8730 on the belief that fits. The insight carries the fit note.

## What used to happen

Before the repair this engine read three stated percentiles as a minimum, a mode and a maximum, and 16 / 17 / 26 makes a perfectly good triangle on that reading. The old error never failed on this belief. It quietly cut the tails off every belief instead: capex stated as 150 / 180 / 220 came back as 164.4914, 182.5834 and 203.2668 at the three percentiles. A fit that admits it is inexact is the repair working.

## What it refuses

It does not refuse the belief, ask for another, or switch to another distribution family. It carries on with the clamped triangle, sets `exact` to false and appends the note. The published `mc_inexact_fit_note` clamps two beliefs at once, capex with its mode at the minimum and opex with its mode at the maximum, and its insight carries both notes.

## The mistake

The careful mistake is quoting the base case beside the sample median as if both described one belief. On the narrow belief 67.2301 describes opex with a median of 17, and 73.1740 describes a triangle whose median is not 17. Read `exact` on every fit before quoting either.

## Exercise

State the shape ratio of the narrow opex belief, the band it must sit in, and its fitted minimum, mode and maximum. Then give the base breakeven and the median breakeven price under the narrow belief, and say which of the two uses the stated median.
