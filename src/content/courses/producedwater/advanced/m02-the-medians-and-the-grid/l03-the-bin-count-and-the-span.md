# The bin count and the span, reported back

The grid a distribution is described on is an input like any other, and it moves the answer. This module therefore reports it back on the return rather than treating it as an implementation detail a caller need not see.

{{panel:pw-water-explorer}}

## Two numbers describe the grid

The bin count says how finely the distribution is sliced. The span says how far either side of the median the grid reaches, measured in sigma. The module's own defaults are 60 bins over 4 sigma, and both are DECLARED values rather than derived ones.

Both appear on the return, so a reader can read what a median or a removal was computed on off the same object that carries the answer.

## What the published cases pin

The golden file carries a bin grid group, and it is built to straddle both knobs at once.

| d50 stated | sigma stated | bins stated | span stated | golden median | golden truncated tail |
| --- | --- | --- | --- | --- | --- |
| 30 | 0.7 | 60 | 4 | 30.000000 | 0.000063342484 |
| 30 | 0.7 | 30 | 4 | 30.000000 | 0.000063342484 |
| 12 | 0.9 | 60 | 4 | 12.000000 | 0.000063342484 |
| 30 | 0.7 | 60 | 5 | 30.000000 | 0.000000573303 |
| 30 | 0.7 | 240 | 6 | 30.000000 | 0.000000001973 |

Read the median column first. It reproduces the stated d50 on every row, at 30 bins and at 240, at a span of 4 and at a span of 6. That is the identity a bin set has to satisfy, and holding it across the group is the evidence that the grid describes the distribution rather than distorting it.

Now read the tail column. It does move, and it moves only with the span. Two knobs, and only one of them touches this quantity.

## Why the two knobs do different jobs

The bin count controls RESOLUTION. It decides how finely the volume is apportioned within the range the grid covers, which is what the quadrature over the grade curve integrates against. The span controls REACH. It decides where the grid stops, and therefore how much of the analytic distribution is left outside it altogether.

So a caller wanting a finer answer reaches for the bin count, and one worried about the extremes of the distribution reaches for the span. The golden group above is arranged so a reader can see which column responds to which knob.

## Why the grid is an input and not a setting

A caller who halves the bin count is making a modelling choice. The module holds the count to a minimum of 10 bins and the span to a minimum of 3 sigma, because below those the description stops being one, and it says so by name rather than quietly widening what it was given.

That is the general rule this course keeps returning to. An input that is silently adjusted has been deleted, and a reader looking at the answer has no way of knowing which input produced it. Reporting the grid back and refusing the ones it cannot describe are two halves of the same commitment.

## Exercise

In the water explorer, set a distribution and read the bin count and span off the return. Change the bin count and confirm the median holds.

Then push the span down until the module refuses, and write down what the refusal names. Do the same for the bin count, and say which of the two reported quantities each knob moved.
