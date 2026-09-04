# Displacement and not determined

The other two pictures are the ones that say do not spend. Displacement says the water is arriving because the reservoir is swept. Not determined says the history will not settle the question, and both carry treatable = false.

{{panel:pd-diagnostic-explorer}}

## Displacement is a straight proportional climb

The golden displacement history is a t with a = 0.050000000 and m = 1.000000000. Its ratio runs from 0.500000000 to 150.000000000 and its derivative runs from 0.500000000 to 150.000000000, the same two numbers, because on a power law the ratio and its derivative share a log-log slope. Its published lateDerivativeSlope is 1.000000000000.

Fitted over the window the classifier uses at its default, series[20:] starting at t = 186.345364 days, 20 of the 40 samples and 1.206802663 log cycles, the engine returns slope 1.000000000000 and r2 1.000000000000, differing from the published Theil-Sen value by 4.440892e-16.

## The confidence that nobody checked

That history comes back mechanism displacement, treatable false, confidence high, ambiguous false. The ambiguous band runs from 1.050000 to 1.550000 on the derivative slope, so a slope of exactly one falls just outside it and the flag stays down.

The oracle's own docstring calls a slope of exactly one the case that genuinely needs the plot and a person. The golden publishes no expected mechanism, no expected confidence and no expected verdict, so high confidence here is the engine asserting something nothing tested.

## Not determined is a verdict, not a crash

Its label is "Not determined", its treatable flag is false, and its note reads: "The history does not settle the question. That is an answer: it says do not spend money on a treatment chosen by guesswork."

A teaching demonstration lands on it. Take WOR = 2.0 + 0.9 ln t, 20 samples from t = 20 to 2000 days, ratio climbing from 4.696159046 to 8.840812214, and the derivative is exactly 0.900000000 at every sample. The classifier returns mechanism indeterminate at confidence low, with derivativeSlope 0.000000000 and derivativeR2 0.000000000 against a minR2 of 0.5, and prints "The derivative scatters too much to carry a slope: the fit explains only 0.0 percent of it."

There is no scatter in that series at all. The fit quality is a fraction in the return object and a percentage in the sentence, and both are describing a horizontal line rather than noise.

## A constant ratio is filed under displacement

The golden flat history sits at 1.200000000 with every derivative 0.000000000. It comes back mechanism displacement, confidence n/a, worSlope 0.000000000 and worR2 0.000000000, with the note "Nothing is changing, so there is no mechanism to diagnose and nothing on this well for an intervention to fix. That is a finding, not a failure to reach one."

## The mistake

Reading not determined as a failed run and rerunning until something else appears. It is the one label whose note names a decision.

## Exercise

Write the published displacement slope, the window it was taken over, and the confidence the classifier attaches to it.

Then run the constant-derivative demonstration and write its ratio fit quality beside its derivative fit quality, and the sentence the engine printed.
