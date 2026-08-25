# The question a map cannot answer

This lesson is about why validation needs data to be withheld, and about the three false comforts that get offered instead.

## The false comforts

**"The map honours every well."** It does, and so does every other map made with an exact interpolator through the same six points. A spline, a different spline, a triangulated surface and a hand-drawn contour set can all honour the same control and disagree by tens of metres between the wells. Honouring is a property they share, so it cannot distinguish them.

**"The contours look geological."** Smooth, roughly parallel, gently curving contours are what a minimum-bending surface produces from any six numbers. The Associate tier's crest, 1.28 m shallower than the shallowest pick and 300 m from it, looks entirely geological and is an artefact of the fit. Plausibility is produced by the method, not by the data.

**"The residuals at the wells are zero."** They are zero by construction. An exact interpolator has zero residuals at its own control, always, on any dataset, including one made of random numbers. A report quoting a zero mean residual at the wells has quoted the definition of exact interpolation.

Each of those is true and none of them is evidence.

## Why withholding is the only test

A prediction can only be tested where two things are both available: a value the map produced without knowing the answer, and the answer.

At the six wells the map knew the answer, so there is no test. Between the wells there is no answer, so there is no test. The only way to create a testable location is to **remove** a well from the control, which turns a known point into an unknown one, and then to ask the map about it.

That is the entire idea behind cross validation and it is why the technique is worth the trouble: it manufactures test cases out of a dataset too small to spare any.

## The cost of withholding

The manufactured test is not free and the cost is specific.

A map built from five wells is a **different and worse map** than one built from six. Its residual at the withheld well measures the predictive skill of the five-well map, not of the six-well map that will actually be used.

On sparse control that difference is not negligible. Going from six wells to five is a 17 percent loss of control, and the Professional tier's evidence that one well can dominate a third of a map suggests the loss is not evenly spread.

So a leave-one-out residual is a **pessimistic** estimate of the six-well map's error at that location. It measures a map with less data than the one you have. That is the right direction for an error estimate to be biased, and it is worth stating rather than leaving for a reviewer to point out.

## What the blind test does differently

The blind test has none of that ambiguity. The six-well map made a prediction at (1500, 1500), and the six-well map is the map actually in use. When Ekene-7 was drilled, the prediction and the truth existed side by side with nothing manufactured.

Its weakness is the opposite one. There is exactly one of it, it cost a well, and it is available only after the fact. You cannot plan around a blind test you have not run.

## The pairing

The two instruments are therefore complementary in a precise way.

**Leave-one-out** is repeatable, available now, biased pessimistic, and limited by geometry.

**The blind test** is unbiased, unambiguous, unrepeatable and retrospective.

Running both, when both are available, gives two independent readings of the same question, and on this field they turn out to disagree in sign, which is itself informative.

## Worked example

A colleague reports that their map has a root-mean-square error of zero at all nine control wells and concludes it is highly accurate. What is wrong with the claim?

Nothing about the arithmetic and everything about the inference. An exact interpolator reproduces its control by construction, so a zero residual set is a confirmation that the software works rather than a measurement of accuracy. The number would be identical if the nine picks were wrong, or random.

The reply is to ask for a cross-validation residual at any well the geometry allows, and if none is available, to say that the map's predictive accuracy is unmeasured.

## Exercise

Name the three false comforts and say in one sentence why each fails as evidence. Then explain why a leave-one-out residual is a pessimistic estimate of the error of the map you will actually use.

As a self-check: honouring every well fails because exact interpolation guarantees it regardless of the data; geological-looking contours fail because a minimum-bending surface produces plausible shapes from any values; and zero residuals at the control fail because they are the definition of exact interpolation rather than a measurement. A leave-one-out residual is pessimistic because it is produced by a map built from one fewer well than the map in use, so it measures a less constrained surface than the one whose error is actually in question.
