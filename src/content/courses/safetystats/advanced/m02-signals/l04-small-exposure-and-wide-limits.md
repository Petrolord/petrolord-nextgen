# Small exposure and wide limits

{{panel:ss-uchart-explorer}}

In the golden case uchart-small-exposure-wide-limits, the first point recorded 3 events in 2000 hours. Its u is 300.000000 and its upper limit is 44.196051, and it signals above. The third point recorded 1 event in 400000 hours, reads 0.500000 and has an upper limit of 4.965310. The same chart and the same centre carry two very different limits.

| point | count | hours | u | UCL | signal |
| --- | --- | --- | --- | --- | --- |
| 1 | 3 | 2000 | 300.000000 | 44.196051 | above |
| 2 | 0 | 2000 | 0.000000 | 44.196051 | null |
| 3 | 1 | 400000 | 0.500000 | 4.965310 | null |

## The note, and the scaling

The golden's note reads: "two thin periods: limits scale with 1/sqrt(n_i)". Points 1 and 2 have the same hours, so they share an upper limit of 44.196051. Point 3 has two hundred times their hours. The distance from the centre to its limit is therefore smaller by the square root of two hundred, which is why its limit is 4.965310.

A point on 2000 hours is a few people for a week or two. One recordable in that time gives a rate on the 200,000 hour base that looks alarming on any dashboard. The chart knows how little exposure is underneath and draws a limit wide enough to match.

## Point 1 still signals

Wide limits do not mean a thin point can never signal. Point 1 recorded 3 events in 2000 hours, and a u of 300.000000 clears even a limit of 44.196051. When a small crew records several cases in a few days, that is worth investigating whatever the exposure. The chart's job is to separate that from a crew that records one case in the same hours, and point 2 shows the other side: 0 events in 2000 hours, a u of 0.000000 and no signal, because the chart cannot tell a thin quiet period from a lucky one.

## The same thing on EGBEMA

EGBEMA's month 3 is the thin month on a real chart. With 97230 hours it has 0.486150 units, and its upper limit of 10.211920 is the widest on the chart. Its u of 8.227913 is the highest reading of the year and it does not signal.

The Professional tier made the same point with intervals. The IMO ladder held the observed rate at 2.000000 per 200,000 hours: at 1 event on 100000 hours the upper limit of the interval was 220.068159 times the lower, and at 100 events on 10000000 hours it was 1.494848 times. The chart and the interval are two views of one fact. A rate computed on little exposure is a rate known only loosely.

## What to do with thin periods

The engine charts whatever hours it is given, and a thin period is legitimate data. The analyst's choice is whether monthly points are the right grain. A site whose months range from 2000 to 400000 hours may be better charted by quarter, so each point carries enough exposure to see anything. That is a choice to state in the note, made before the chart is read.

## Exercise

Convert the three points' hours to units on the 200,000 hour base. Using the fact that the distance from the centre to the upper limit scales with one over the square root of the units, find the ratio of point 1's distance to point 3's. Then use the two printed upper limits to solve for the centre line of this chart, and confirm it by dividing the total count by the total units.
