# A low point that signals

{{panel:ss-uchart-explorer}}

In the golden case uchart-positive-lcl-with-a-low-point, the fourth point recorded 0 events in 4800000 hours. Its lower limit is 0.920345, its u is 0.000000, and the engine returns `below`. The six other points, each on 4700000 to 6100000 hours, sit inside their limits and signal nothing.

| point | count | hours | u | LCL | UCL | signal |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 48 | 5000000 | 1.920000 | 0.936592 | 2.512443 | null |
| 3 | 61 | 6100000 | 2.000000 | 1.011164 | 2.437872 | null |
| 4 | 0 | 4800000 | 0.000000 | 0.920345 | 2.528691 | below |
| 6 | 47 | 4700000 | 2.000000 | 0.911835 | 2.537201 | null |

## Why this chart has a lower edge

EGBEMA could never signal low, because every lower limit was floored at zero. This chart can, and the reason is exposure. Each point carries millions of hours, so the units are large and the square root term is small. The lower limit is the centre minus 3 times that term, and here the subtraction stays above zero at every point. Point 3, with the most hours, has the highest lower limit, 1.011164, and the lowest upper limit, 2.437872. Point 4 has 4800000 hours, fewer than point 1's 5000000, so its lower limit of 0.920345 sits a little below point 1's 0.936592.

## What the golden says the signal means

The golden's note reads: "large exposure gives positive lower limits; a month with 0 events in 4.8 million hours falls below its lower limit (a signal worth investigating as under-reporting)".

A month with no recordables in 4800000 hours on a workforce whose other points read 1.920000 and 2.000000 per 200,000 hours is improbable if nothing changed. The chart says so. What it cannot say is whether the workforce became safer overnight or the reporting stopped. A reporting system that went down, a contractor whose cases never reached the register, a new supervisor who discouraged reporting: each produces exactly this point.

## A low signal is investigated like a high one

The instinct with a zero month is to celebrate it. The chart's rule is symmetric. A point strictly below its lower limit is a signal in the same sense as a point strictly above its upper limit, and it asks the same question: what was different about this period? For a low point, the first place to look is the counting, because a fall in the rate with no change in the work is the signature of a change in counting.

This connects to a lesson later in the tier on reclassification, where a rate falls while the harm does not. The u-chart is one of the few tools that can catch that pattern, and only when the exposure per point is large enough to lift the lower limit off zero.

## Exercise

Point 4 has 4800000 hours. Convert them to units on the 200,000 hour base, then multiply its lower limit of 0.920345 by those units to find the count that would sit exactly on that printed limit. Then state the smallest whole number of events that would not signal against it, remembering that a signal lies strictly outside the limit. Now type that count, and the next ones up, into the panel. Point 4's count feeds the pooled centre, so raising it lifts the centre and every limit with it, point 4's lower limit included, and the panel redraws the chart for each count. Expect the redrawn chart to keep signalling for a couple of counts past your answer, and write down the first count the panel shows as quiet.
