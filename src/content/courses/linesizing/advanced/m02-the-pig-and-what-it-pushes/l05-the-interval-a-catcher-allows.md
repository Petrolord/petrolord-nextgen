# The interval a catcher allows

How often a line is pigged is not an operating preference. It is arithmetic set by the vessel at the far end, and the engine will tell a designer when there is no answer at all.

{{panel:fc-wall-pig-explorer}}

## Two things fill a catcher

Liquid arrives at the end of a line two ways. It drips in continuously as dropout, and it arrives all at once as the sweep in front of a pig. The catcher has to hold both, so the sweep claims its room first and the dropout fills what is left over.

On OGBIA at a holdup of 0.060000 the sphere pushes 98.0121 bbl into a 250.000000 bbl catcher, leaving 151.9879 bbl of room, and at 40.000000 bpd of dropout that room lasts 3.7997 days.

## The whole column, and where it stops

| holdup | swept bbl | days between runs at the nominal catcher |
| --- | --- | --- |
| 0.000000 | 0.0000 | 6.2500 |
| 0.020000 | 32.6707 | 5.4332 |
| 0.040000 | 65.3414 | 4.6165 |
| 0.060000 | 98.0121 | 3.7997 |
| 0.100000 | 163.3535 | 2.1662 |
| 0.200000 | 326.7070 | the sweep alone already exceeds the slug limit |
| 0.500000 | 816.7674 | the sweep alone already exceeds the slug limit |
| 1.000000 | 1633.5349 | the sweep alone already exceeds the slug limit |

The top row is the pure dropout case. With a sweep of 0.0000 bbl the whole 250.000000 bbl is available and the catcher fills in 6.2500 days, which is the longest interval this line can ever have.

From there the interval shortens as the sweep takes room away, and then it stops existing. The engine refuses rather than returning a negative interval: "the sweep alone already exceeds the slug limit: pig more often or resize the catcher".

## A refusal that names the two fixes

That message is unusual in this engine because it prescribes. Pig more often, so less liquid accumulates between runs, or resize the catcher, so there is room for what does. Those are the only two levers, and the third option a reader might reach for, accepting a smaller margin, is not available when the sweep alone is already over the limit.

The same refusal comes back from a catcher that is simply too small. Put the OGBIA sweep into a 60.000000 bbl vessel and there is no interval to report.

## Where the interval stops being this engine's problem

The slug a catcher has to hold is computed here. The vessel that holds it is sized in the separation work, and the two meet at the swept volume. An interval also needs its own two inputs, and with either missing it refuses: "an interval needs a positive slug limit and dropout rate".

## The mistake

The mistake is pigging on a calendar. A monthly interval on a line whose holdup has risen is a catcher overflow waiting for the run that finds it.

The second mistake is resizing the catcher to rescue an interval when the holdup behind it was assumed. A bigger vessel built on a guessed holdup is an expensive way to keep the guess.

## Exercise

Give the OGBIA interval at a holdup of 0.060000 with the sweep, the catcher size, the room left and the dropout rate behind it. Then explain why the interval is longest at a holdup of zero, give the refusal that replaces the interval at a holdup of 0.200000, and name the two fixes it prescribes.
