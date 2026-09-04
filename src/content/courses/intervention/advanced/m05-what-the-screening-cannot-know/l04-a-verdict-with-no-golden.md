# A verdict with no golden

Two functions in this module are checked by an independent route to machine precision. None of the functions that return a verdict is checked against anything at all.

{{panel:pd-candidate-explorer}}

## What the oracle does, and it is good

It checks the log-log slope by Theil-Sen, the median of every pairwise slope, which shares no mean, no square and no covariance with the engine's ordinary least squares. On the published power law the true slope is 1.350000000000 and the engine reproduces it with a difference of 0.0000e+0, at a fit quality of 1.000000000000 as a fraction over all 11 points.

It checks the skin uplift by building a full radial Darcy rate in SI, permeability in square metres and pressures in pascals, and dividing two real flow rates against the engine's ratio of two dimensionless groups. On the five published pairs the largest disagreement is -8.8818e-16, on a published multiplier of 4.060771880315. The geometry floor comes back at the published -7.900724584041 exactly.

Two independent routes onto two pure arithmetic functions. Then it stops.

## What it never asserts

The golden publishes four labelled histories with a late derivative slope for each, five skin pairs, one geometry floor and one power law. It publishes no expected mechanism, no expected confidence, no expected verdict, no expected refusal and no expected block reason. `chanDiagnosis`, `screenTreatments`, `rankTreatments` and `skinFromPiRatio` are asserted against nothing.

The only part of this module that returns a verdict is the part with no golden.

## The four assertions nobody wrote

Run the classifier over the published histories at the default window, which opens at t = 186.345364 days on all four, and it says channelling at confidence high, coning at confidence high, displacement at confidence high, and displacement at confidence n/a on the flat series whose published late derivative slope is null. Four verdicts, none checked. Two are worth a second look.

On the coning history the two estimators visibly separate. The published Theil-Sen slope is -0.555098339661 and the engine returns -0.539955222223 over the 20 late samples, a difference of 1.514312e-2 and a relative -2.728006e-2, at a fit quality of 0.948751314445 as a fraction, on data with no noise in it. The shape is not a power law and the two estimators weight a curved log-log trend differently. Both are right about their own question.

On the displacement history the engine returns a slope of exactly 1.000000000000 over that same window and calls it displacement at confidence high with ambiguous false, which the oracle's own docstring names as the case that genuinely needs the plot and a person.

## The habit

Ask of any verdict which assertion would have caught it wrong. Here there is none, so the answer is the plot.

## Exercise

List the four mechanisms and confidences the published histories return, then name, for each, what the golden would have had to publish to make it a checked result.
