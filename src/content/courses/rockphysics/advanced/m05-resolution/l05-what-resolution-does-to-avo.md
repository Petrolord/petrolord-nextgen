# What resolution does to AVO

Tuning affects the intercept and the gradient differently, which means it can change a class as well as an amplitude. This lesson is the interaction between the tier's two halves.

## Why the two coefficients are affected differently

Tuning is a function of bed thickness in time, and thickness in time depends on the angle at which the wave travels.

A wave arriving at 30 degrees travels a longer path through the bed than one arriving vertically, by a factor of $1/\cos\theta$, which at 30 degrees is 1.155.

So a bed that is at tuning thickness for a vertical ray is 15 percent above tuning for a 30 degree ray. The far offsets see a slightly thicker bed than the near offsets do.

## What that does

If the bed is below the vertical tuning thickness, the far offsets are closer to tuning than the near offsets are, so the far amplitudes are boosted more. That steepens the gradient.

If the bed is above tuning, the far offsets are further above it, so they are boosted less. That flattens the gradient.

Either way the intercept, which is the zero angle value, is affected by tuning but not by this differential, so the two coefficients move by different amounts.

## The consequence

A measured gradient from a thin bed is not the interface gradient. It carries a thickness dependent bias whose sign depends on whether the bed is above or below tuning.

At Ekene the gas case gradient is -0.2566. A bed below tuning would return a steeper apparent gradient and one above tuning a shallower one, and neither would be the rock property the modelling computed.

Since the class of a negative intercept case is decided by the sign of the gradient, and since the previous modules showed how close a class III case can come to class IV, a thickness driven bias in the gradient is capable of changing a class call.

## Why this is not usually corrected

Because doing it properly requires knowing the bed thickness, which requires the isochron, which is least reliable below tuning.

The usual practice is to restrict quantitative AVO work to intervals comfortably above tuning, and to treat AVO on thin beds as qualitative. That is a reasonable compromise and it should be stated rather than assumed.

The Ekene threshold of 23.2 m at 25 Hz is the number that decides which category a given reservoir falls into.

## Bringing the tier together

Four things have to be true for the modelling in this tier to describe a recorded amplitude.

The rock properties must be right, which is the tier below's problem and is dominated by the porosity.

The shear velocity must be right, which is the tier below's problem too and dominates the gradient.

The interface must be isolated, meaning the bed is thicker than tuning, which is this module's condition.

And the approximation used must match what is being compared, which is module four's condition.

Fail any one and the model and the data will disagree for a reason that has nothing to do with fluid.

## Worked example

Work out the angle dependence of the effective thickness for a bed at exactly tuning.

A bed 23.2 m thick in a 2905.7 m/s sand has a vertical two way time of 16.0 ms. At 30 degrees the path length through it increases by $1/\cos 30° = 1.1547$, so the effective two way time is 18.5 ms.

Reading the tuning curve, 16 ms gives 0.1444934457540512 and 18 ms is past the peak on the falling side. So the far offsets sit on a slightly lower part of the curve than the near offsets.

The effect is small here, a few percent, because the curve is flat near its peak. It is much larger for a bed at 8 ms, where the curve is steep: 8 ms vertical becomes 9.2 ms at 30 degrees, and the curve is climbing quickly through that range, so the far offsets are boosted noticeably relative to the near.

Thin beds therefore carry the largest tuning bias on the gradient, which is the opposite of convenient, since thin beds are also where the gradient is most wanted.

## Exercise

State the four conditions that must hold for this tier's modelled reflection coefficients to describe a recorded amplitude, and name which one this module adds.

Self check: the rock properties must be right, the shear velocity must be right, the bed must be thicker than the tuning thickness so the top reflection is isolated, and the approximation used in the model must match the one used to analyse the data. This module adds the third, and at Ekene it sets a threshold of 23.2 m at 25 Hz.
