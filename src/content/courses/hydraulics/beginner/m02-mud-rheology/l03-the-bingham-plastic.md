# The Bingham plastic

A yield stress and a slope, fitted to the same two readings.

{{panel:hy-rheology-explorer}}

## The model

    tau = tau_y + mu_p gamma

A straight line with an intercept. Below the yield stress the fluid does not flow at all; above it, it behaves like a Newtonian fluid with a plastic viscosity mu_p.

## The fit

    plastic viscosity PV = (theta600 - theta300) in centipoise
    yield point YP = theta300 - PV, in lbf per 100 ft2

Which in SI, for kcl_polymer: PV = 0.025984959015858657 Pa.s and YP = 6.124842731279998 Pa.
For light_wbm: PV = 0.016990165510369123 Pa.s and YP = 5.614439170339999 Pa.

Those two numbers, PV and YP, are what a mud engineer reports and what a mud programme specifies. They are the most widely used pair of rheology numbers in drilling.

## What the model gets right

It has a yield stress, which the power law does not. That is a genuine improvement for the annulus.

And it is simple: two numbers with an obvious physical meaning, both computed by subtraction from readings a mud engineer takes anyway.

## What it gets wrong

The yield stress it reports is an EXTRAPOLATION from the 600 and 300 rpm readings back to zero shear rate, and the real curve is not straight over that range.

For kcl_polymer the fitted YP is 6.124842731279998 Pa. The measured 3 rpm reading is 3.0624 Pa. The model predicts 6.257547657124397 Pa there, which is twice the measurement.

So the Bingham model overstates the low-rate stress by about as much as the power law understates it, and for the same reason: both are extrapolating a two-point fit into a range they were not fitted in.

## Which error is worse

The Bingham error is the safer one, because it OVERSTATES the annular pressure loss and therefore the equivalent circulating density.

That is not a reason to prefer it. It is a reason to know which way each model is wrong when a report quotes one of them.

## The one thing PV and YP are genuinely good for

Tracking a mud over time. PV rises when solids build up; YP rises when the mud is treated for viscosity or when it is contaminated. The two move independently and their movements are diagnostic.

That use does not depend on the model being right about the annulus.

## Exercise

Compute PV and YP for both muds from the dial readings, in the field units of centipoise and pounds force per hundred square feet.

Then convert them to SI and check against the numbers above.
