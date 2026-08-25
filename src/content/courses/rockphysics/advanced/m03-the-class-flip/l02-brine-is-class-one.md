# Brine is class one

The wet case at Ekene is class I. This lesson works through why, and how comfortably.

## The numbers

$$A = 0.03434399848203321, \qquad B = -0.16766246414664518$$

A positive intercept above the 0.02 threshold, so class I, and the gradient plays no part in the call.

## What class I means on a gather

The near offsets show a positive reflection, a peak on standard polarity. The reflection weakens steadily with offset and, at Ekene, changes sign at about 29 degrees.

A stack over the full offset range therefore averages a positive near contribution against a negative far one, which reduces the stacked amplitude below what the near offsets alone would give. A class I interface can look weak on a stack while being perfectly visible on a gather.

## Why this sand is class I

Because the brine sand is harder than the shale. Its impedance is 7,200,000 against the shale's 6,720,350, so the reflection starts positive.

That in turn is because the sand is faster, by 457 m/s, and that beats its being lighter, by 200 kg/m3. The velocity contrast wins in the wet case, which is exactly what the gas case reverses.

Consolidated sands are commonly class I for this reason: cementation raises their velocity above the shales around them, and the density difference is not large enough to compensate.

## The gradient still matters, even though the call ignored it

The class call used only $A$. The behaviour on a gather is set by both.

At $B = -0.1677$ the reflection falls from 0.0343 at zero degrees to about -0.0126 at 40 degrees. So the amplitude changes sign and its magnitude at the far offsets is about a third of what it was at the near.

Had the gradient been half as steep the polarity flip would have happened outside the recorded range, and the interface would have looked like a simple weakening positive reflection. Same class, different gather.

That is the limitation of the scheme in one example: the class is set by one coefficient and the appearance is set by two.

## Reading it off the panel

The brine curve is the blue one.

{{panel:rp-avo-explorer}}

Follow it from left to right. It starts just above the zero line, falls through it near 30 degrees, and continues down. The red vertical line marks the crossing.

Compare the height at which it starts, 0.0343, against the depth it reaches by 40 degrees, about -0.0126. The far offset amplitude is smaller in magnitude than the near, which is worth noticing because class I responses are sometimes described as brightening with offset after the polarity change. At Ekene it does not: it crosses and then grows slowly.

## Worked example

Work out where the polarity change happens from the two coefficients alone, using the two term form.

$$R(\theta) = A + B\sin^2\theta = 0 \quad \Rightarrow \quad \sin^2\theta = -\frac{A}{B} = \frac{0.03434399848203321}{0.16766246414664518} = 0.204838$$

$$\theta = \arcsin\sqrt{0.204838} = \arcsin(0.452590) = 26.92 \ \text{degrees}$$

The full three term Shuey form crosses at 29.29 degrees and the exact Zoeppritz solution at 29.87 degrees.

So the two term estimate is nearly three degrees early, which is a large error in a quantity an interpreter might use to decide which offsets to include in a stack. The curvature term matters more than its small coefficient suggests, because near the crossing the reflection is small and any absolute error is a large relative one.

## Exercise

State what would happen to the class call if the brine sand's impedance were slightly lower, say 6,900,000 rather than 7,200,000.

Self check: the intercept would fall to roughly 0.0129, which is below the 0.02 threshold, so the case would be called class II rather than class I. Nothing about the rock would have changed qualitatively, and the gather would look almost identical near the zero offset, but the label would change because the intercept crossed a threshold somebody chose.
