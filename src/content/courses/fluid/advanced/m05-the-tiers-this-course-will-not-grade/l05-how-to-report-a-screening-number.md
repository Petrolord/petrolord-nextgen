# How to report a screening number

The whole module, reduced to what goes in the document.

## The three parts

**The number.** Rounded to the precision it deserves, which for a screening quantity is one or two significant figures.

**The method.** Named, so somebody can reproduce it.

**The status.** Said in words, not implied by formatting.

> Oil viscosity at reservoir conditions approximately 0.9 cp, from an untuned Lohrenz-Bray-Clark calculation on the compositional model. Screening estimate: the critical volume of the C7+ pseudo-component is correlated rather than measured, and untuned LBC viscosities on liquids can be out by a factor of two. Not suitable for flood design without a measurement.

Three sentences. A reader now knows what they have, where it came from, and what they must not do with it.

## Precision as a signal

Quoting a screening number to sixteen digits is a claim about it, whether or not one is intended.

A reader who sees 0.7559673199800581 next to a tuned saturation pressure assumes both are known to the digits shown. Rounding the screening number to 0.8 says more about its status than a footnote does, because it is visible at the point of use.

That is worth doing even when a table's other columns carry more digits. Inconsistent precision within a table is a feature when the underlying confidence is inconsistent.

## Where a screening number must not go

**Into a booking.** Reserves are audited and a screening input will not survive.

**Into a decision whose outcome turns on it.** If the answer changes when the number moves by a factor of two, the number is not good enough for the decision.

**Into a downstream calculation without the label travelling with it.** This is the commonest failure. A screening viscosity enters a mobility ratio, the mobility ratio enters a sweep efficiency, the sweep efficiency enters a recovery factor, and by the third step nobody remembers.

## Making the label travel

Two mechanisms, and both are worth using.

**In the software**, return the tier with the value, which is what the engine does and what made this course possible to build.

**In the document**, put the status in the same sentence as the number rather than in a footnote or a legend. Footnotes do not survive copying into a slide.

## The habit

When you write down a number, write down what kind of number it is.

That is the last statement of the question this whole series has been asking. The decline curve course asked which points a fit used. The material balance course asked which implementation a value came from. The SCAL course asked what an average had averaged. The simulation course asked which convention a volume was clipped under. This course asked which tier a quantity sits on.

Every one of them is the same discipline: a number without its provenance is an assertion, and a number with it is evidence.

## The misconception to avoid

"Labelling a number as screening makes it useless, so it is better to present it plainly." A labelled screening number is usable for ranking, for scoping and for deciding what to measure. An unlabelled one is usable for all of that AND for things it cannot support, and somebody will eventually use it for one of those. The label does not reduce what the number can do; it prevents what it cannot.

## Exercise

First, write the three-part report line for a screening quantity from your own work, with the number, the method and the status.

Second, describe the two mechanisms for making a status label travel with a number, and say which failure each one prevents.
