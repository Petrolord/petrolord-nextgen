# The uncertainty it inherits

Three sources of error, compounded in one number.

{{panel:td-buckling-explorer}}

## The chain

Survey to side force to torque, side force to wear volume, wear volume to depth.

Every step has an uncertainty and they multiply.

## Step one: the side force

It comes from the torque and drag model, which rests on a friction factor that was fitted rather than measured and absorbs four different physical effects.

A friction factor 20 percent high gives a side force distribution that is not 20 percent high, because friction and side force are coupled, but it is wrong in a direction and by an amount nobody can bound tightly.

The side force is also computed by a soft-string model that smears contact the real string concentrates. For wear, which is entirely about local contact, that is exactly the wrong simplification.

## Step two: the oracle gap

The wear case in this course's goldens was built on the ORACLE's side forces, not the engine's. The two implementations differ by the amounts the Professional tier measured.

So the wear answers differ too. The engine's worst wear depth on the teaching case is about 0.92 percent away from the published one, entirely inherited from the T&D difference, while the sliding distance agrees exactly because it involves no integration at all.

That is a clean illustration of how uncertainty propagates through a chain: the term with no model in it is exact, and the term downstream of a model carries that model's error.

## Step three: the wear factor

A laboratory constant with a plausible range spanning a factor of twenty, applied at contact pressures, temperatures and mud conditions it was not measured at.

This is much the largest of the three, and it is multiplicative.

## What that adds up to

A wear depth quoted to the micron, from a chain whose weakest link is uncertain by a factor of several.

## The right way to use it

**Relatively.** Which joint is worst, and by how much compared with the others. That comparison is robust: it comes from the side-force SHAPE, which is much better determined than its magnitude.

**As a screening tool.** A prediction of 3 percent wall loss means do not worry. A prediction of 30 percent means run a caliper.

**With a calibration.** If a caliper log exists from an offset well drilled the same way, back out the wear factor from it. That converts a laboratory constant into a field-calibrated one and removes most of the largest uncertainty.

That last one is the same move as fitting a friction factor, with the same benefits and the same danger of absorbing something else.

## The wrong way

Quoting a single number to three decimals as the wall loss, and deriving a burst rating from it, without saying which of the three uncertainties above dominates.

## Exercise

Estimate the total uncertainty in the worst wall loss by combining a 20 percent uncertainty in side force, a 1 percent model gap, and a factor-of-two uncertainty in the wear factor.

Then say which of the three you would spend money reducing, and how.
