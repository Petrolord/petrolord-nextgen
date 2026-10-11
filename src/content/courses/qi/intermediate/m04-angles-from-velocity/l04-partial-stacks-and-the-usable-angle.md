# Partial stacks and the usable angle

AVO on the seismic is read from three partial stacks, near, mid and far. `partialStack` makes one from a range of angle bins, and `usableAngle` says how far out in angle the gather carries enough fold to trust.

## The partial stack

Over a stated range of angle bins, the partial stack at each sample is the fold-weighted mean of the bins: a bin of fold 3 counts for more than a bin of fold 2. Where no bin in the range has data, the stack is empty at that sample. With one bin to a range, as here, the partial stack is that bin's mean.

## Gather 5 against the kit's stacks

The kit built its near, mid and far angle stack traces over 5 to 15, 15 to 25 and 25 to 35 degrees from the same rock. At 1292.000000 ms, the top picked on gather 5, against the kit's stack traces at Ekene-1 at the same time:

| stack | from gather 5 | the kit's stack trace at Ekene-1 |
| --- | --- | --- |
| near | 483.072830 | 456.803711 |
| mid | 410.433207 | 357.560150 |
| far | 320.449005 | 220.203720 |

Both columns fall from near to far, the dimming with angle at the top. The gather's stack is the higher of the two in every range, and the gap widens from near to far, so the gather's partial stacks fall less steeply with angle than the kit's traces do. The kit's seismic README states that stacking its gathers over 5 to 15 degrees with the published velocity gives the near stack back, up to the noise. The table shows how each range compares at this one sample.

The intercept leans on the near stack, where the two sources sit closest. The gradient leans on how far the far stack falls below the near, and that is where they part most. Two angle stacks of the same rock can carry different gradients, which is why a study states which stacks its AVO read.

## The usable angle

`usableAngle` counts outwards from the nearest bin and returns the far edge of the last bin that has at least the stated minimum fold. If even the first bin falls short, it returns none. At the top of gather 5, with bins of fold 2, 3 and 2:

| minimum fold | usable angle, degrees |
| --- | --- |
| 1 | 35.000000 |
| 2 | 35.000000 |
| 3 | none |
| 4 | none |
| 5 | none |

At the stated minimum fold of 2 the usable angle is 35.000000 degrees: all three ranges count. At a minimum of 3 the answer is none, even though the mid bin has fold 3, because the count starts at the near bin and stops at the first bin that falls short.

## What a study states

The minimum fold is a choice, and the table shows how much rests on it: one step moves the answer from the full range to nothing. A study states the minimum fold, the bin edges and the ranges each stack sums, and reads its far stack only out to the usable angle. The next module fits intercept and gradient to these three stacks.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, open the Angles from velocity view on the Ekene pack's gather 5 with the published RMS velocity table and bin edges at 5, 15, 25 and 35 degrees. Set the time to 1292 ms and read the near, mid and far partial stacks against the kit's stack traces at Ekene-1. Then step the minimum fold control from 1 to 5 and record the usable angle at each step.
