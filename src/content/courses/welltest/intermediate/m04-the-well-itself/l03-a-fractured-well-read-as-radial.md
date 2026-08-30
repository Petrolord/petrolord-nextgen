# A fractured well read as radial

The most expensive mistake in this tier, in one number.

## The experiment

Take the fracture fixture: 5 mD rock, a 250 ft fracture, zero skin.

Ignore the derivative. Fit a semilog straight line to the pressure between 0.1 and 10 hours, exactly as the Associate tier would.

The fit reports a permeability of 26.266915078269914 mD and a skin of minus 4.3726416175327625.

## What that says

The rock is 5 mD. The analysis reports over five times that.

The well has no skin at all. The analysis reports a strongly stimulated well.

And the r squared of that fit is 0.9397580663293224, which is low enough to be a warning if anybody looked at it and high enough that plenty of reports would carry it.

## Why both numbers move together

Linear flow's pressure change goes as the square root of time. On a semilog plot that is a curve which rises more and more steeply per cycle, but over a limited window it is flatter than radial flow would be for the same rock, because the fracture is doing a large part of the work.

A flatter semilog line means a larger permeability. And the extra pressure the fracture SAVES, relative to an unfractured well, shows up in the skin as a negative number.

So the analysis has taken a real physical effect, the fracture, and distributed it between two parameters that cannot represent it: some of it into an inflated permeability and some into a negative skin.

## The equivalent-skin idea, and its limit

There is a legitimate version of this. At LATE time, once the disturbance is far enough from the fracture that the whole fractured region looks like a point, a fractured well does behave like an unfractured well with a negative skin. The effective wellbore radius is about half the fracture half-length, which for a 250 ft fracture gives a skin around minus 6.

That description is valid, and it is useful for inflow performance calculations.

What is not valid is applying it to the EARLY data, which is what the fit above did. The early data are in linear flow, where the fractured well and the equivalent-skin well behave completely differently. And the permeability, which in the legitimate late-time description would come out at the true 5 mD, comes out five times too high when the window is early.

## The consequence

A well in tight rock, fractured, is reported as being in five times better rock than it is, with a stimulation it does not have.

Downstream: the field's mapped permeability is revised upward, the well count in the development plan comes down, and the forecast production per well goes up. The fracture, which is the thing actually making the well produce, is not in the model at all, so future wells may not be fractured, or the fracture design is not optimised because its contribution was never measured.

All of that from one semilog line on the wrong regime.

## The check that catches it

The derivative. On this fixture it shows a half slope over three and a quarter decades, which is not radial flow and could not be mistaken for it on the plot.

Without the derivative, the check is the sequence-and-level test from module 2. A permeability five times the mapped value in a field where nobody has explained why, together with a negative skin on a well whose completion record you have not checked, is two implausible results from one fit. Either alone is worth a second look.

## The misconception to avoid

"An unusual answer is a discovery." An analysis that reports much better rock and much better stimulation than expected has, far more often, been run on the wrong flow regime. The improbable result is evidence about the analysis before it is evidence about the reservoir, and the burden is on the interpretation to show which.

## Exercise

The semilog fit above gives 26.266915078269914 mD on rock that is 5 mD.

Compute the ratio, and then compute the ratio of the SLOPE the fit found to the slope 5 mD rock would give. Confirm the two ratios are consistent, and state in one sentence what physical feature of the response made the line flatter than radial flow.
