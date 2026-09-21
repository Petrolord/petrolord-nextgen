# The pinch and the threshold

Lesson five found the heat flow of the Isiokpo cascade reaching 0.000 at shifted 110.500 C. This lesson reads why the engine names that zero a pinch, and why it refuses to name a different zero one.

{{panel:carbon-efficiency-explorer}}

## A zero inside the range

The lab prints the reading of the Isiokpo cascade at a minimum approach of 15 C: the heat flow is zero at shifted 110.500 C, inside the range, and that is the pinch, 118.000 C on the hot side and 103.000 C on the cold side. The four streams are invented for this course.

The words inside the range carry the rule. The cascade runs from 155.500 shifted at the top to 33.500 at the bottom, and 110.500 is between them. The course lists the rule among those in force: only an interior zero of the cascade is a pinch.

The engine's note on the pinch, verbatim: "Heat carried across the pinch costs twice: one unit more hot utility and one unit more cold utility. That is what makes the pinch the constraint rather than a curiosity."

In practice, the part of the plant above the pinch is short of heat and the part below it has heat to reject, which is how one unit carried across becomes one unit more of each utility. The note's own word for the pinch is the constraint.

## The pinch against the approach

The lab prints the Isiokpo pinch at all three approaches:

| minimum approach C | hot utility kW | cold utility kW | pinch hot C | pinch cold C |
| --- | --- | --- | --- | --- |
| 10 | 1.800 | 216.000 | 118.000 | 108.000 |
| 15 | 25.950 | 240.150 | 118.000 | 103.000 |
| 20 | 59.700 | 273.900 | 118.000 | 98.000 |

The pinch on the hot side prints 118.000 C at every approach. The cold side prints 108.000, 103.000 and 98.000 C. The hot utility prints 1.800, 25.950 and 59.700 kW at approaches of 10, 15 and 20 C.

## A zero at the end is a threshold

The lab prints a second case to show the other kind of zero: one hot stream from 200 C to 50 C at 10 kW/K and one cold stream from 30 C to 60 C at 1 kW/K, at a minimum approach of 10 C.

| hot utility kW | cold utility kW | pinch hot C | threshold problem |
| --- | --- | --- | --- |
| 0.000 | 1470.000 | none | true |

Its heat flow down the shifted temperatures:

| shifted C | heat flow kW |
| --- | --- |
| 195.000 | 0.000 |
| 65.000 | 1300.000 |
| 45.000 | 1480.000 |
| 35.000 | 1470.000 |

The heat flow is zero only at the top of the cascade, where the hot utility is zero. The course states the reading: the engine reports no pinch there, because a zero at either end of the cascade is a threshold, and naming it a pinch would invent a constraint.

The threshold case prints a hot utility of 0.000 kW and a cold utility of 1470.000 kW, and pinch hot none. The engine reports a threshold problem of true beside it, where every Isiokpo row reports false.

## What the engine refuses

The lab prints three refusals for the pinch targets:

| the call | the engine says |
| --- | --- |
| a stream with CP -2 | REFUSED: A heat capacity flowrate cannot be negative. Whether a stream is hot or cold is set by its supply and target temperatures. |
| minimum approach blank | REFUSED: A minimum approach temperature is required and must not be negative. |
| no stream changes temperature | REFUSED: No stream changes temperature, so there is nothing to target. |

The first refusal repeats the rule of lesson five from the other side: a stream is hot or cold by its temperatures, and its CP is never negative.

## Exercise

Read the Isiokpo cascade's zero at shifted 110.500 C and the threshold case's heat flow table. Say where in each cascade the heat flow reaches zero, which one the engine names a pinch and which a threshold, and what the engine's pinch note says a unit of heat carried across the Isiokpo pinch costs.
