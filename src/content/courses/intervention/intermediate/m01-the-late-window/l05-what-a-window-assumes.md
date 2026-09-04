# What a window assumes

`lateFraction` has a default of 0.5. There is no guidance anywhere in the module for choosing a different one, no helper that sweeps it, and no field in the returned object that names what it did.

{{panel:pd-channel-explorer}}

## Assumption one: that somebody chose it

A reading taken at 0.5 and a reading taken at a fraction an analyst thought about look identical coming out. Both carry a mechanism, a note and a start time. `lateFromT` is the only trace of the choice, and it is a timestamp, so two analysts comparing verdicts on the same well have nothing in front of them that says they read different halves of it.

## Assumption two: that the answer does not depend on it

On teaching well ELELENWO-4, a case built for this course rather than a published one, the dial swept from 0.20 to 1.00 moves the derivative slope by 0.370920348, from 1.229355999 to 1.600276347. Not one of the 38 samples changes across that sweep. The threshold that decides the mechanism, `channellingSlope`, is 1.3, and the sweep crosses it: the water shutoff squeeze comes back a candidate on some windows and blocked on others, from one history read two ways.

At the default window the reading clears 1.3 by a margin of 0.142132492, and the dial moves the slope by 0.370920348.

## Assumption three: that a fraction picks a time

It picks a count. The fraction is applied to the number of samples, so the window opens at whichever sample the count lands on. Two wells with the same producing life and different reporting schedules get different windows from the same number, and the object says nothing about it.

## Assumption four: that the window is the window that was measured

At the default fraction the late window on that teaching well holds 19 samples spanning 1.157940604 log cycles, and the derivative fit that decides the mechanism sits on 15 of them spanning 0.900620470 log cycles. The reported span describes the second of those.

## What the module refuses to do about any of it

Nothing tests that the window sits late in the well's life, that the rate was steady across it, or that the verdict is stable against the fraction. There is no warning when a small change in the dial changes the mechanism. The one span test, `minSpanDecades` at 0.4, is applied to the fit rather than to the window.

## The mistake

Reporting a mechanism without reporting the window it was read on. A verdict quoted alone is not reproducible, because the number that produced it is a default nobody was asked to confirm.

## Exercise

Read the teaching well at the two ends of the sweep and record the derivative slope, the mechanism and the water shutoff verdict for each.

Then write the one sentence you would put in a report so that a colleague could reproduce your reading exactly.
