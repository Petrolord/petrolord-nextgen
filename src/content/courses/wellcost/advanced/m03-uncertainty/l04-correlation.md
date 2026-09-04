# Correlation

Hole sections do not have bad days independently of each other, and a model that pretends they do will report a spread that is too narrow.

{{panel:wc-risk-explorer}}

## Why the sections move together

The intermediate hole and the production hole on the golden programme are drilled by the same rig, the same crew, on the same mud system, through formations that belong to the same sequence.

If the rate of penetration in a4 comes in at the low end of 10 to 22, something caused it. Bit selection, a harder than expected section, a directional problem, a crew still finding its rhythm. Most of those causes are still present when a7 is drilled.

That is what correlation means here. It is not a statistical decoration. It is the statement that the two draws share a cause.

## What independence costs you

Sample the two rates independently and the good and bad draws cancel. A slow a4 is just as likely to be paired with a fast a7 as with a slow one, so the extreme joint outcomes almost never appear.

Sample them with positive correlation and the slow draws arrive together. The mean of the cost distribution barely moves, because each rate still has the same marginal distribution. What moves is the tails. The low case gets lower and the high case gets higher, and the spread the model reports gets wider.

Understating spread is the dangerous direction of error, because the whole point of running the model is to size a provision against the bad tail.

## How the sampler does it

The canonical module samples correlated inputs with a Gaussian copula. It takes the Cholesky factor of the correlation matrix, applies it to independent standard normals, and pushes each resulting value through the inverse cumulative distribution of its own marginal.

Two things follow. Each input keeps exactly the distribution you specified, triangular or otherwise, so nothing you defended in the last lesson is disturbed. And the correlation is imposed on the joint pattern only.

The Cholesky routine clamps its diagonal at zero, so a correlation matrix that is slightly not positive definite degrades gracefully instead of returning NaN across the run.

## What the published case does

The golden risk case declares four uncertainties and no correlations at all, so it samples them independently.

That is a choice, and you should be able to say so out loud. An uncorrelated run of two rates drilled by one rig is a lower bound on the spread, not a neutral position.

## Exercise

Write down which pairs among the four published uncertainties you would correlate, and name the shared cause for each pair you choose.

Then say what you expect to happen to the mean and to the tails when you turn a positive correlation on between the two rates.
