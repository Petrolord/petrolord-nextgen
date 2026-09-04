# What a label is not

A mechanism label is a reading of one fitted slope against one constant somebody chose. It is not a measurement of what the water is doing in the rock, and nothing in this module ever checked one.

{{panel:pd-diagnostic-explorer}}

## What is checked, and what is not

The independent oracle checks two things. The log-log slope, by Theil-Sen, the median of every pairwise slope, which shares no mean, no square and no covariance with the engine's ordinary least squares. And the skin uplift, by a full radial Darcy rate in SI, divided as two real flow rates. On the published power law of eleven points the engine returns slope 1.350000000000 against a published 1.350000000000, a difference of 0.0000e+0.

The golden then publishes four labelled histories and a late derivative slope for each, and stops. There is no expected mechanism, no expected confidence, no expected verdict, no expected refusal and no expected block reason anywhere in it. `chanDiagnosis` is not asserted against anything at all.

## The four assertions nobody wrote

Run the classifier over the four published histories at its default window, series[20:] starting at t = 186.345364 days, and these are derived values, and no line in the golden agrees or disagrees with them.

| Published history | Published lateDerivativeSlope | Mechanism returned | Confidence | Ambiguous |
| --- | --- | --- | --- | --- |
| channelling | 1.600000000000 | channelling | high | false |
| coning | -0.555098339661 | coning | high | false |
| displacement | 1.000000000000 | displacement | high | false |
| flat | null | displacement | n/a | n/a |

## Where high confidence comes from

Not from agreement between two methods. On the coning history the engine's least squares returns -0.539955222223 and the published Theil-Sen value is -0.555098339661, a difference of 1.514312e-2 on data with no noise in it. Both routes answer their own question honestly. The confidence field knows nothing about that gap.

The flat row is the plainest case. A ratio that never moves carries no derivative slope, and the label that comes back is displacement.

## Three choices under every label

The window the fit was taken over. The constant the slope was compared against. The fit quality floor of 0.5 that let the slope carry a mechanism. Change any one and the label can change with no datum touched.

## The mistake

Writing the mechanism into a report on its own. A defensible line names the slope, the window in samples and log cycles, the threshold it was compared against and the margin. The word channelling by itself carries none of that.

## Exercise

Write the four mechanisms the classifier returns on the published histories and, beside each, what the golden says the mechanism should have been.

Then take the coning row and write its two independent slope estimates and the difference between them.
