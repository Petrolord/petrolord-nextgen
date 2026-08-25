# Estimate first, substitute after

The order of the two operations is not free. Estimating shear from a hydrocarbon bearing rock's compressional velocity applies a brine relation to a rock that is not brine saturated, and the error has a predictable direction.

## The rule

Estimate the shear velocity on the brine case, then substitute the fluid.

Never estimate shear from a compressional velocity that already has hydrocarbon in it.

## Why the relations require it

Both estimators in this module were fitted to brine saturated rocks. That is stated in their original papers and it is not incidental: the relations work because in a brine saturated clastic, compressional and shear velocity both track the same underlying frame properties, so one predicts the other.

Fluid substitution breaks that link. It moves the compressional velocity a long way and the shear velocity a little, and in opposite directions. A rock whose compressional velocity has been dragged down by gas no longer sits on the brine trend at all.

## What happens if you do it backwards

Take the Ekene gas case, at 2905.6972280296195 m/s, and feed it to Greenberg-Castagna as though it were a brine rock.

The composite at 2905.6972280296195 m/s is 1446.343832922053 m/s, a little below the 1521.20 it gives at 3000, because the estimator is nearly linear in this range.

The true shear velocity of that gas rock is 1890.9758806113214 m/s.

The estimate is out by 444.63204768926835 m/s, which is 23.5 percent of the true value. Nothing has gone wrong with the estimator: it has been asked what a brine rock with a compressional velocity of 2906 m/s would have for a shear velocity, and it has answered correctly. The rock in question is not a brine rock.

## The direction of the error

The estimate is far too low, because the gas has lowered the compressional velocity while raising the shear velocity, so the rock sits well above the brine trend.

Carry that into a substitution and it compounds. A shear velocity 23.5 percent low gives a shear modulus 41.5 percent low, an inflated bulk modulus, a stiffer dry frame, and a fluid response that is far too small.

That is the same direction as the previous lesson's smaller error, and much larger: the modelled gas anomaly would be a fraction of what it should be.

## Where this bites in practice

Not usually as an outright mistake, but in a workflow that has lost track of what its inputs are.

A common shape is that shear is estimated across a whole well, including the pay interval, and then a substitution is run on the pay interval to model an alternative fluid case. If the pay interval already holds hydrocarbon, its estimated shear was wrong before the substitution started.

The fix is to identify the fluid state of every interval before estimating, and to treat hydrocarbon bearing intervals differently: substitute them to brine first, using the fluid they actually contain, and then estimate. That requires knowing the in situ saturation, which is a petrophysical question rather than a rock physics one.

## Worked example

State the correct sequence for a well whose pay interval logs gas and has no shear log, and which is to be modelled for a brine case.

The rock is gas bearing, so the estimator cannot be applied to it directly. There is also no shear log, so the substitution cannot be run to get to brine.

That is a genuine deadlock and it is worth recognising rather than working around. Breaking it needs an external input: a shear estimate from an offset well in the same rock at brine conditions, a lithology and porosity based frame model, or a measured shear log from anywhere in the same unit.

The wrong answer is to estimate shear from the gas sand's compressional velocity and proceed, because that produces numbers with no error message attached, which the rest of the study will then trust.

## Exercise

State the order of operations for estimating shear and substituting fluid, and give the one sentence reason.

Self check: estimate the shear velocity first, on the brine saturated case, and substitute the fluid afterwards. The reason is that the empirical shear estimators were fitted to brine saturated rocks, and a rock that already holds hydrocarbon does not lie on that trend, so applying the relation to it gives a shear velocity that is far too low.
