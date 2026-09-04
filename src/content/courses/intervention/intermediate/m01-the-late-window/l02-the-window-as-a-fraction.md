# The window as a fraction

`lateFraction` is a number between 0.10 and 1.00 with a default of 0.5, no guidance anywhere in the module, and no helper that sweeps it. It is also the largest single influence on the answer.

{{panel:pd-channel-explorer}}

## Nine readings of one series

Every row is teaching well ELELENWO-4, 38 samples, read through a different window with not one datum changed. It is a teaching case built for this course, not a published one.

| lateFraction | Window starts, days | Late samples | Derivative slope | Mechanism | Water shutoff |
| --- | --- | --- | --- | --- | --- |
| 0.20 | 1276.416078 | 8 | 1.600276347 | indeterminate | blocked |
| 0.30 | 705.784525 | 12 | 1.544046342 | channelling | candidate |
| 0.40 | 390.258164 | 16 | 1.485563987 | channelling | candidate |
| 0.50 | 250.242976 | 19 | 1.442132492 | channelling | candidate |
| 0.60 | 138.369943 | 23 | 1.387035000 | channelling | candidate |
| 0.70 | 76.510604 | 27 | 1.336892539 | channelling | candidate |
| 0.80 | 42.305954 | 31 | 1.292632524 | displacement | blocked |
| 0.90 | 23.392754 | 35 | 1.254360095 | displacement | blocked |
| 1.00 | 15.000000 | 38 | 1.229355999 | displacement | blocked |

Across the whole range of the dial the derivative slope moves by 0.370920348, from 1.229355999 to 1.600276347.

## The dial is worth more than the margin

At the default window the derivative slope is 1.442132492322 against a `channellingSlope` of 1.3, so the margin that carries the whole recommendation is 0.142132492322. The dial moves the same slope by 0.370920348. The analyst's untyped choice is worth more than twice the margin the spend is decided on.

The verdict column follows exactly. The water shutoff comes back a candidate on the narrow windows and blocked on the wide ones, from one history and one panel.

## Why the slope falls as the window widens

Widening the window adds older samples, and on this series the early derivative climbs less steeply than the late one. Least squares averages the two stretches. The wide window is not wrong, it is a different question answered honestly.

## The mistake

Sweeping the dial until the mechanism agrees with the plan, then reporting the reading and not the sweep. Every row is available in seconds, none is refused, and nothing in the return object records which one produced the number handed on.

## What it refuses

Nothing. No warning, no flag, and no field in the result names the fraction used. The only trace is the window start in days.

At the narrow end the reading does stop short of a verdict: at 0.20 the mechanism is indeterminate, whose note reads "The history does not settle the question. That is an answer: it says do not spend money on a treatment chosen by guesswork."

## Exercise

Run the teaching well at 0.40, 0.50 and 0.80 and record the derivative slope and the water shutoff verdict at each.

Then write the sentence you would put in a recommendation so a reader can tell which window produced your number.
