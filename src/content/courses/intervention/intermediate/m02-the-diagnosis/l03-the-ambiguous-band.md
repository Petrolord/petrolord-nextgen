# The ambiguous band

`ambiguousBand` is 0.25, and it is a distance from a threshold rather than a statement about the data. A slope that lands near 1.3 is flagged. A slope that lands far from it is not, however little the history supports it.

{{panel:pd-channel-explorer}}

## Where the band sits

The band is measured around `channellingSlope`, which is 1.3, so on the derivative slope it runs from 1.050000 to 1.550000, a width of 0.500000. Anything inside is returned with the ambiguous flag true and the confidence dropped, anything outside clean.

## Two perfect fits, two different flags

Both are read at the default `lateFraction` of 0.5. The first row is a demonstration series built for this course, the second a published history, and no golden asserts either flag.

| Case | Derivative slope | Fit quality, fraction | Ambiguous |
| --- | --- | --- | --- |
| A climbing ratio with one sample restored | 1.150000000 | 1.000000000 | true |
| Published displacement history | 1.000000000 | 1.000000000 | false |

The first sits inside the band and is flagged. The published displacement history sits below the lower edge of 1.050000 and is not, and it comes back at high confidence on a slope of exactly one, which is the reading the oracle's own docstring calls the case that genuinely needs the plot and a person. Neither fit has any scatter in it whatever. The flag moved because 1.150000000 is closer to 1.3 than 1.000000000 is.

## What the flag actually says when it fires

Teaching well ELELENWO-4 at the default window returns a derivative slope of 1.442132492, which clears 1.3 by 0.142132492 and is therefore 0.142132492 from the boundary, inside 0.25. It is flagged, and the note it carries names the reason: for any power-law history the ratio and its derivative have the same log-log slope, so nothing separates the two pictures except how steep the climb is, and the note ends by asking for the plot or a production log before any spend.

That is the module telling you its own separation is weak, and it says it only when the arithmetic falls inside a fixed strip 0.500000 wide.

## The mistake

Reading an unflagged verdict as a confident one. The flag is a distance, not a quality. A slope of exactly 1.000000000, a slope whose fit quality was never compared against anything but the 0.5 of `minR2`, and a slope taken over a window the analyst chose can all come back unflagged.

## What the band refuses to do

It is never applied to the coning threshold of -0.1. A derivative slope just below -0.1 is called coning, the water shutoff is blocked, and no ambiguity is reported at all. The band exists on the boundary that recommends the spend and not on the boundary that refuses it.

## Exercise

Record the derivative slope, the fit quality and the ambiguous flag for the published displacement history and for the teaching well at the default window.

Then say which of the two you would take to a production log first, and why the flag disagrees with you.
