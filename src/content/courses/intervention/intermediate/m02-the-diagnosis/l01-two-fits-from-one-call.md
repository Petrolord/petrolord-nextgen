# Two fits from one call

One call to `chanDiagnosis` hands back two slopes side by side. They were measured on different samples, over different spans, and nothing in the returned object says so.

{{panel:pd-channel-explorer}}

## What one call returned

Teaching well ELELENWO-4, a case built for this course rather than a published one, is 38 samples from 15.000 to 3600.000 days. Read at the engine's own default `lateFraction` of 0.5, the call comes back with these fields:

| Field | Value |
| --- | --- |
| worSlope | 1.040602176 |
| worR2, a fraction | 0.921895186 |
| derivativeSlope | 1.442132492 |
| derivativeR2, a fraction | 0.998513658 |
| spanDecades, log cycles | 0.900620470 |
| lateFromT, days | 250.242976 |

The two slopes differ by 0.401530316. The derivative slope clears the `channellingSlope` threshold of 1.3 by 0.142132492, and that margin decides the mechanism.

## They are not the same window

The late window holds 19 samples. Fifteen of them have a positive derivative and four do not. The ratio slope is fitted over every one of the 19. The derivative slope is fitted over the 15 only, because the filter that builds it keeps points whose derivative is above zero.

So the ratio fit used 19 samples over 1.157940604 log cycles, and the derivative fit used 15 samples over 0.900620470 log cycles. The derivative fit is four samples short of the ratio fit and 0.257320134 of a log cycle short of the window it is reported against. The window itself runs 1.157940604 log cycles.

## The field named for the reading describes one fit

`spanDecades` comes back as 0.900620470. That is the span of the derivative fit, not the span of the window and not the span of the ratio fit. It is the only span in the object, and it is named as though it described the reading as a whole.

## What the shortfall costs

The span has a gate of its own. `minSpanDecades` is 0.4, and it is applied to the span the fit reports rather than to the window that was selected. On short windows the drop decides whether there is a reading at all:

| lateFraction | Window, log cycles | Reported span | Clears 0.4 by |
| --- | --- | --- | --- |
| 0.20 | 0.450310235 | n/a | n/a |
| 0.25 | 0.578970302 | n/a | n/a |
| 0.30 | 0.707630369 | 0.450310235 | 0.050310235 |
| 0.35 | 0.836290436 | 0.578970302 | 0.178970302 |

The first two rows are the point. Both windows are longer than 0.4 log cycles, so a reader checking the window against the gate would pass them. After the four falling samples are dropped, no span is reported at all and the mechanism comes back indeterminate.

## The mistake

Quoting `worSlope` and `derivativeSlope` as two measurements of one thing, then reporting `spanDecades` as the length of history the diagnosis rests on. The honest sentence names three numbers: which slope, how many samples, and over what span each one was taken.

## Exercise

Read the teaching well at the default window and record both slopes, both fit qualities and the span.

Then say how many samples went into each slope, and how you would find that out from the returned object alone.
