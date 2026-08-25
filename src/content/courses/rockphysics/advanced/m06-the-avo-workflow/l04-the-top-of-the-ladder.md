# The top of the ladder

This is the last lesson of the last tier of the Rock Physics course. It is worth saying what the three tiers together built and where the limits now sit.

## The three tiers

The Associate tier computed ingredients: a brine, a gas and a live oil at 60 degC and 25 MPa, a Voigt Reuss Hill mineral frame at 30.879401 GPa, and a Wood mixture of the pore fluid.

The Professional tier put those into a rock: a dry frame of 7.350343 GPa recovered from a logged point, and a gas substituted twin at 2905.6972 m/s and 2038.7105 kg/m3, with a shear velocity that rose rather than fell.

The Expert tier put that rock under a shale and predicted what a survey would record: class I under brine and class III under gas, an exact reflection of -0.122391 at 30 degrees, and a tuning thickness of 16 ms.

Each tier is a thin layer of new arithmetic on a thick stack of inherited assumptions.

## What you can now do

Take a logged brine point and a proposed overburden and predict the full angle dependent seismic response for any pore fluid, with the approximation error quantified and the resolution limit stated.

More usefully, say which part of that prediction is robust and which is not. At Ekene the sign of the gas reflection is robust to any porosity the calculation accepts; its magnitude runs over a factor of 1.6 across a plausible porosity range; and its gradient can change class on an uncalibrated shear estimate.

## The three limits

**The overburden is assumed.** Every number here is a property of a pair of rocks. A different shale gives different coefficients, a different class and a different crossing angle, and nothing in the tier tests whether the assumed shale is the one actually above the reservoir.

**The model is deterministic.** One porosity, one shear velocity, one shale. Every one of those has an uncertainty and this course has priced several of them individually, and none of them has been propagated jointly. That is what a probabilistic rock physics study does, and the sensitivities computed here are its inputs.

**Everything is a plane wave at a plane interface.** Real reflections come from surfaces with curvature and roughness, in media that are anisotropic and attenuating, recorded through a processing sequence that changes amplitudes. The step from a modelled reflection coefficient to a recorded amplitude involves all of that and none of it is here.

## What the downstream inherits

Seismolord is where the predicted response meets the recorded one. It inherits every assumption in this course, and the assumptions do not travel with the number.

A fluid computed at the wrong conditions becomes a substitution that is wrong by a few percent. A porosity assumed too high becomes a predicted velocity 130 m/s out. An uncalibrated shear estimate becomes a class that is wrong. And an amplitude compared against a model without a tuning check becomes a fluid interpretation of a thickness effect.

Each of those produces a confident number, and none of them produces an error.

## The habit worth keeping

Attach the provenance to the number. Every prediction in this course can be written with its assumptions in the same sentence, and doing so costs a clause.

The gas case velocity is 2905.7 m/s at an assumed porosity of 0.25, and 2710 to 3034 across a plausible porosity range. The gradient is -0.2566 with a measured shear velocity, and would be positive with an uncalibrated Greenberg-Castagna estimate. The class is III at a threshold of 0.02, and the brine case is class I at that threshold and class II at 0.04.

Three sentences, and a reader now knows what to argue with.

## Worked example

Write the rock physics summary for the Ekene prospect as it would appear in a report.

The Ekene sand is modelled from a logged brine point at 3200 m/s, 1800 m/s and 2250 kg/m3, porosity 0.25, mineral modulus 37 GPa, under a shale logged at 2743 m/s, 1394 m/s and 2450 kg/m3. Gassmann substitution to gas gives 2905.7 m/s, 1891.0 m/s and 2038.7 kg/m3, an impedance fall of 17.7 percent against the logged case.

Under the shale, the brine case is class I with an intercept of 0.0343 and a gradient of -0.1677, changing polarity at 29.9 degrees. The gas case is class III with an intercept of -0.0628 and a gradient of -0.2566, negative at all recorded offsets. The exact reflection at 30 degrees for the gas case is -0.1224.

The intercept flips sign on the density contrast rather than the velocity contrast: the gas sand remains 162.7 m/s faster than the shale. The gradient is dominated by the shear contrast, so it is the coefficient most sensitive to the shear velocity, and an uncalibrated shear estimate would move it to positive and the class to IV.

Tuning at 25 Hz is 16 ms, which is 23.2 m at the gas sand velocity, so any part of the prospect thinner than that carries a thickness dependent amplitude.

## Exercise

Name the one input you would most want to improve before this model were used to support a drilling decision, and say why.

Self check: the shear velocity, if it is estimated rather than measured, because it dominates the gradient and an uncalibrated estimate can change the predicted AVO class from III to IV, which reverses the qualitative conclusion. If the shear velocity is measured, then the porosity, because it moves the predicted gas velocity by more than 300 m/s across a plausible range and therefore moves both coefficients.
