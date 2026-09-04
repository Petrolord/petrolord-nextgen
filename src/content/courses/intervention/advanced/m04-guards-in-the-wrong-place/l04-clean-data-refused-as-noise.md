# Clean data refused as noise

A ratio rising exactly logarithmically is a real signature, it has no scatter in it at all, and the classifier refuses it for scattering too much.

{{panel:pd-candidate-explorer}}

## The series

The teaching demonstration, built for this result and not a published case, is WOR = 2.0 + 0.9 ln t over 20 samples from t = 20 to 2000 days. The first sample is 4.696159046 and the last is 8.840812214, and because the derivative is taken against ln t it comes back as 0.900000000 at every sample. Nothing in the series is noisy. Nothing in it is even uncertain.

## What comes back

`chanDiagnosis` returns ok = true, mechanism indeterminate, treatable = false, confidence low, with the note "The derivative scatters too much to carry a slope: the fit explains only 0.0 percent of it. Reading a mechanism off this would be reading noise."

The object carries worSlope 0.114949989 at a fit quality of 0.998756100, derivativeSlope 0.000000000 at a fit quality of 0.000000000, and spanDecades not available. The window is the default `lateFraction` of 0.5, starting at 225.767578 days.

## Two slopes, two windows, one series

The ratio fitted over the whole 20 samples, from 20 to 2000 days, gives a slope of 0.135843859 at a fit quality of 0.992767316. The ratio fitted over the late window alone, from 225.767578 days, gives 0.114949989 at 0.998756100. Same data, same function, two windows, and the slope moves. Neither number means anything without the window beside it, and the return object names the window for the second one only.

## Where the refusal comes from

`minR2` is 0.5 as a fraction. The derivative fit lands under it because the constant derivative gives the fit nothing to explain and the arithmetic hands back a fit quality of the order of rounding error. The gate then does what a gate does. The refusal is not wrong about its own test: the fit really does explain none of the variance, because there is no variance. It is wrong about the well, and the sentence it prints is a sentence about the well.

## The mistake

Reading "the fit explains only 0.0 percent of it" as a statement about the data. It is a statement about a fit. A fit quality measures how much of the spread in y a straight line accounts for, so a series with no spread scores zero on a test it was never a candidate for. The reader who takes that number as evidence of a noisy well has swapped a property of the model for a property of the reservoir, and the module's own vocabulary invites the swap by calling the result noise.

The check that catches it costs one line: before believing a low fit quality, print the y values and look at their spread. If they are identical the fit quality says nothing at all.

## Exercise

Write the mechanism, the confidence and the derivative fit quality this demonstration returns, and the ratio slope it returns over the late window from 225.767578 days. Then write one sentence saying what the low fit quality is a statement about, and one naming the property of the series that produced it.
