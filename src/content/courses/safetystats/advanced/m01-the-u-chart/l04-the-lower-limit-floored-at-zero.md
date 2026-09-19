# The lower limit floored at zero

{{panel:ss-uchart-explorer}}

Every one of EGBEMA's twelve lower control limits reads 0.000000, and every one carries `lclFloored` true. On a different chart with far more exposure the lower limits are positive: 5000000 hours give an LCL of 0.936592 and 4800000 hours give 0.920345.

| chart | hours in the point | LCL |
| --- | --- | --- |
| EGBEMA month 1 | 402350 | 0.000000 |
| EGBEMA month 8 | 421090 | 0.000000 |
| large exposure, point 1 | 5000000 | 0.936592 |
| large exposure, point 4 | 4800000 | 0.920345 |

## Why the floor exists

The lower limit is the centre minus 3 times the square root of the centre over the units. On EGBEMA the centre is 2.893273 and a full month carries close to 2 units, 2.011750 in month 1, so the subtraction goes below zero. The engine's chart says so: every lower limit on this chart is floored at 0 and flagged, because the raw lower limit is negative at this exposure.

A negative rate cannot happen. No month can record fewer than zero events. A limit below zero would therefore be a line nothing could ever cross, and drawing it at a negative value would suggest a precision that is not there. The engine sets it to zero and says that it did so, which is the engine's declared choice: a signal lies strictly outside its limits, and the lower limit is floored at zero and flagged.

## What the flag tells a reader

The flag is information, and it has a consequence. With the lower limit at zero, no month on EGBEMA can signal low. A month with no recordables at all would have u of 0.000000, and zero is not strictly below zero. So on this chart a sudden drop cannot be detected as a signal, however suspicious it looks.

That matters because a fall in reported events is exactly the pattern that under-reporting produces. A reader who sees `lclFloored` true on every month should say in the note that the chart could only ever have found high months. The low side was never tested.

## When the floor lifts

The lower limit rises above zero only when the units are large enough for the centre to exceed 3 times the square root of the centre over n. The large exposure golden case shows it. With points of 4700000 to 6100000 hours, every LCL is positive, and the fourth point, 0 events in 4800000 hours, falls below its LCL of 0.920345 and signals below. A later lesson takes that case apart. Here the point is only that the floor is a property of the exposure. Pool enough hours into each point and the chart gains a lower edge.

## Exercise

Take EGBEMA's centre of 2.893273 and month 8's 2.105450 units. Compute the raw lower limit before the floor, and confirm it is negative. Then solve for the number of units at which the raw lower limit would be exactly zero, convert those units to hours on the 200,000 hour base, and write one sentence on whether pooling EGBEMA by quarters would give it a working lower limit.
