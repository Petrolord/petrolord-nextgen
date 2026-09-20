# A signal lies strictly outside its limits

{{panel:ss-uchart-explorer}}

In the golden case uchart-points-on-the-limits, point 1 recorded 18 events, its u is 2.000000 and its upper limit is 2.000000. Point 2 recorded 0 events, its u is 0.000000 and its lower limit is 0.000000. Neither signals. On EGBEMA, month 8's u of 7.599326 sits above its limit of 6.410039, and it is the one month that does.

| point | count | u | LCL | UCL | signal |
| --- | --- | --- | --- | --- | --- |
| golden point 1 | 18 | 2.000000 | 0.000000 | 2.000000 | null |
| golden point 2 | 0 | 0.000000 | 0.000000 | 2.000000 | null |
| EGBEMA month 8 | 16 | 7.599326 | 0.000000 | 6.410039 | above |

## The rule, in the golden's words

The golden case was built to sit exactly on the boundary. Its note reads: "ubar = 1 and n = 9 per point, so the limits are exactly 0 and 2 and the points sit exactly on them: under the strict rule (Montgomery: a point OUTSIDE the limits) neither signals".

A point on the line is inside the band. The engine returns `signal` null for both points, and only a u strictly greater than the upper limit, or strictly less than the lower one, earns `above` or `below`. This is one of the engine's declared choices, and it follows the textbook the method line names.

## Why the boundary matters

A tie on a limit sounds like an edge case nobody meets. It is met more often than it sounds, because counts are whole numbers. A point sits on its limit whenever the count happens to equal the limit times the units, and small charts with round exposures produce that. Point 2 of the golden case shows a lower limit that is zero on its own arithmetic: 0 events against an LCL of 0.000000 cannot signal, because it sits on the limit. Nothing was floored there, and the engine reports lclFloored as false, since the raw lower limit is already exactly zero.

The rule also has to be the same everywhere the chart is read. A note that calls a point on the line a signal, while the engine calls it quiet, disagrees with the tool the rest of the team is using.

## Reading the engine's answer

The engine reports signals twice. Each point carries its own `signal`, `above`, `below` or null. The chart as a whole carries `outOfControl`, a list of zero-based indices. On EGBEMA that list is [7], and index 7 is the eighth month. Month numbering in a note starts at 1, so the note says month 8 and the engine says 7, and both are right.

Month 8's margin is not small. Its u of 7.599326 clears its limit of 6.410039 by more than a whole unit of rate, and that is why the next lessons can ask what the signal means. Where a point lands close to the line, the strict rule is what decides it, and the note should say so.

## Exercise

Month 8 has 2.105450 units and an upper limit of 6.410039. Multiply the two to find the count that would put month 8 exactly on its limit. Then find the largest whole number of events month 8 could have recorded without signalling, and the smallest that would signal. Check both in the panel by editing month 8's count. Each edit redraws the chart: the pooled centre and every limit move a little, so read month 8's new limit in the panel. Here your answers still hold.
