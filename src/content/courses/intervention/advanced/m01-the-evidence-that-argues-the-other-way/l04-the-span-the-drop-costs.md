# The span the drop costs

Dropping the falling samples does not only change the slope. It shortens the stretch of the plot the slope was measured over, and the span has a gate of its own.

{{panel:pd-candidate-explorer}}

## Two fits, two windows, one object

At the engine default `lateFraction` of 0.5 on teaching well ELELENWO-4, `chanDiagnosis` returns two fits side by side. The ratio fit uses `n` of 19 over 1.157940604 log cycles for a slope of 1.040602176348 at an r-squared of 0.921895186494. The derivative fit uses `n` of 15 over 0.900620470 log cycles for a slope of 1.442132492322 at an r-squared of 0.998513658433. ELELENWO-4 is a teaching case, not a published one.

The derivative fit is 4 samples short of the ratio fit and 0.257320134 of a log cycle short of the window it is reported beside. The window itself runs 1.157940604 log cycles. The two slopes come back as 1.040602176 and 1.442132492, a gap of 0.401530316, and nothing in the object says they were measured on different data.

`spanDecades` describes the derivative fit alone, while its name reads as though it described the reading.

## Where the loss meets the gate

`minSpanDecades` is 0.4. A derived sweep on the teaching well shows what the drop costs against it.

| lateFraction | Window runs, log cycles | Reported spanDecades | Loss | Clears 0.4 by |
| --- | --- | --- | --- | --- |
| 0.20 | 0.450310235 | n/a | n/a | n/a |
| 0.25 | 0.578970302 | n/a | n/a | n/a |
| 0.30 | 0.707630369 | 0.450310235 | 0.257320134 | 0.050310235 |
| 0.35 | 0.836290436 | 0.578970302 | 0.257320134 | 0.178970302 |

The loss is 0.257320134 of a log cycle at every fraction where a span is reported, because the same four samples leave every time. At `lateFraction` 0.30 the reported span clears the gate by 0.050310235, roughly a fifth of what the drop took. Move the dial a little shorter and no span is reported at all.

## The mistake

Reading `spanDecades` as the length of the window and using it to argue that the reading rested on enough of the plot. It is the length of what survived the filter. On this well the window and the reported span differ by 0.257320134 of a log cycle, which is more than half the whole `minSpanDecades` gate.

## What it refuses

The module reports the surviving span and never the window span, offers no field for the difference, and gives no warning when the two diverge. When the reported span falls under 0.4 the reading is withheld, and the reason given is the span, never the filter that shortened it.

## Exercise

Record `spanDecades` at `lateFraction` 0.30 and 0.35 on ELELENWO-4 and subtract each from the window length.

Then say what a reader gains from knowing the loss is 0.257320134 at both.
