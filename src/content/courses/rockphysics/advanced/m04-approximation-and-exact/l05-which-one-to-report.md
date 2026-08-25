# Which one to report

Three methods, three answers, and a report has to contain one of them. This lesson is the decision.

## The rule

Report the exact solution for any quantity you are stating as a value.

Report the Shuey coefficients as coefficients, because that is what they are and what a gather can measure.

Never report a Shuey evaluation at a specific angle as though it were the reflection coefficient at that angle, without saying which form produced it.

## Why the coefficients are still worth reporting

Because they are the interface between the model and the data.

An interpreter fitting a gather extracts an intercept and a gradient. A model that reports an intercept and a gradient can be compared with that directly. A model that reports only a curve of exact reflection coefficients cannot, without the same fit being applied to it.

So the coefficients are the common currency, and their approximate nature is not a defect in that role. It is what makes them comparable.

## Where the trouble starts

When a coefficient is used as a value.

The gas intercept of -0.06282494068620303 is not the reflection coefficient at zero degrees. That is -0.0629911815139045. The two differ by 0.00016624.

That gap is small and it is not zero, and a study that quotes the intercept as the normal incidence reflection has introduced a systematic error of a quarter of a percent for no reason, since the exact value costs nothing to compute.

The same applies more strongly at angle. Quoting the Shuey value at 30 degrees as the reflection at 30 degrees carries an error of 0.0021746462042847164, which this tier has already shown is more than twice the tolerance the capstone applies elsewhere.

## The reporting pattern that works

For a forward model of a prospect, report four things.

The intercept and gradient for each fluid case, stated as Shuey coefficients, so they can be compared against an inversion.

The exact reflection coefficient at one or two representative angles, typically zero and thirty degrees, stated as exact.

The class for each case, with the threshold used.

And the largest approximation error over the modelled angle range, which is one number per case and tells the reader how far the two descriptions can drift apart.

That last item is rarely included and it is cheap. At Ekene it would read 0.006 for the brine case and 0.002 for the gas case, and it would prevent a reader from over-interpreting a small mismatch between a Shuey model and an exact one.

## Worked example

Write the reflectivity paragraph for the Ekene prospect.

The Ekene shale over the logged brine sand gives a Shuey intercept of 0.034344 and gradient of -0.167662, class I at a threshold of 0.02, with an exact normal incidence coefficient of 0.034457 and an exact value at 30 degrees of -0.000190. The reflection changes polarity at 29.87 degrees on the exact solution.

The same shale over the gas substituted sand gives an intercept of -0.062825 and a gradient of -0.256563, class III at any threshold between 0.01 and 0.05, with an exact normal incidence coefficient of -0.062991 and an exact value at 30 degrees of -0.122391. The reflection does not change polarity within the recorded range.

Shuey's three term form departs from the exact solution by at most 0.006 for the brine case and 0.002 for the gas case over 0 to 40 degrees.

## Exercise

A colleague's model reports a reflection coefficient of -0.1246 at 30 degrees for a gas sand. State the question you would ask and why it matters.

Self check: ask whether that is a Shuey evaluation or the exact Zoeppritz value. At Ekene the two are -0.124566 and -0.122391, differing by 0.002175, which is more than twice the tolerance applied to the graded coefficients, so the distinction matters at the precision the number is quoted to.
