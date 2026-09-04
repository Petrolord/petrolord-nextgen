# Choosing a distribution

The triangular distribution is the working default in this course because it asks for exactly the three numbers a planner can actually produce.

{{panel:wc-risk-explorer}}

## Three numbers, no fitting

A triangular distribution is specified by a minimum, a most likely value and a maximum. Every uncertainty in the published risk case is stated that way, and so is every one in the closed form fixture.

That is its whole appeal. Nobody has to estimate a standard deviation, and nobody has to defend a parameter that has no field meaning. Low, likely, high is how drilling engineers already talk.

## What you are assuming when you use it

You are asserting hard bounds. The distribution has zero density outside the two endpoints, so a triangular rate of penetration of 10 to 22 on a4 says that any rate above 22 m per hour is impossible, not merely unlikely. If you cannot defend that, the canonical sampler also carries uniform, normal and lognormal marginals, and a lognormal has no upper bound.

You are asserting that density changes linearly from each endpoint to the mode. That is a modelling convenience with no physical claim behind it.

And you are asserting that the mode is the peak, not the average. This is the assumption people forget.

## The mode is not the mean

The mean of a triangular distribution is the average of its three parameters, so it sits above the mode whenever the right tail is longer.

| Uncertainty | Min | Mode | Max | Mean | Mean less mode |
|---|---|---|---|---|---|
| m2 duration hr | 20 | 30 | 46 | 32 | 2 |
| m3 duration hr | 10 | 20 | 24 | 18 | -2 |
| m4 duration hr | 5 | 10 | 21 | 12 | 2 |
| mc2 lump USD | 100,000 | 200,000 | 360,000 | 220,000 | 20,000 |

Three of those four skew right and one skews left, which is the honest picture: a job can overrun badly more easily than it can finish early, but not always.

Run the fixture deterministically at every mode and it returns 6.666666666666667 days and 1,500,000 USD. Run it properly and the mean is 6.75 days and 1,530,000 USD. The gap is 30,000 USD, a fraction of 0.02 of the modal answer, and it appears purely from the skew of the inputs.

A plan priced at the most likely value of every input is therefore not priced at its own mean, even before any convexity in the model.

## Exercise

Take each of the four uncertainties above and confirm the mean from the three parameters.

Then say which of the three most likely values you would have to move, and in which direction, to make the mean and the mode coincide.
