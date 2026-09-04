# How confidence is assigned

Confidence comes back as high, as low, or as nothing at all, and the number it does not track is the fit quality.

{{panel:pd-channel-explorer}}

## A fit quality of 0.999944740 is low, and 0.948751314445 is high

Teaching well ELELENWO-4, a case built for this course, read at four window fractions. Nothing about the 38 samples changes between the rows:

| lateFraction | Derivative fit quality, fraction | Ambiguous | Confidence |
| --- | --- | --- | --- |
| 0.20 | 0.999944740 | n/a | low |
| 0.30 | 0.999661253 | true | low |
| 0.40 | 0.999101063 | true | low |
| 0.50 | 0.998513658 | true | low |

Every one of those readings is low. The published coning history, read at the same default window, returns a derivative fit quality of 0.948751314445 and comes back at high confidence. The lowest fit quality in the four teaching rows is 0.998513658, which is better than the published one, and it earns the worse label.

That mechanism and that confidence are the engine's assertions. The golden publishes the coning history and its late derivative slope of -0.555098339661 and stops there: no expected mechanism, no expected confidence and no expected verdict, so nothing in the test suite has ever checked either word.

## What it does track

The flag. Rows carrying ambiguous true carry low confidence, and the ambiguous flag is a distance from the 1.3 of `channellingSlope` inside a band of 0.25. So a reading is called low when its slope lands near a threshold, and high when it lands away from one, whatever the scatter.

The row at 0.20 is low for a different reason: no span was reported there and the mechanism came back indeterminate, so no fit survived to be confident about.

## When there is no word at all

The published flat history returns mechanism displacement with confidence n/a. The same happens on the teaching well when the derivative column arrives empty: mechanism displacement, confidence n/a, and a note saying there is nothing on this well for an intervention to fix. A missing confidence reads as an unremarkable well rather than as a warning.

## Where the word is read

In exactly one place. When the water shutoff comes back a candidate on a channelling reading, its third reason says the reading is low confidence and asks for a production log before committing to a squeeze. The verdicts that block a treatment read neither the confidence nor the ambiguous flag. The caveat is attached to the recommendation that spends money and not to the one that refuses to.

## The mistake

Quoting confidence as a summary of how well the line fitted. It is a statement about where the slope landed relative to a threshold, and a reading with a fit quality of 0.999944740 can carry the same word as one with far more scatter.

## Exercise

Record the fit quality and the confidence for the published coning history and for the teaching well at the default window.

Then say which reading fits its data better, and which one the engine calls more trustworthy.
