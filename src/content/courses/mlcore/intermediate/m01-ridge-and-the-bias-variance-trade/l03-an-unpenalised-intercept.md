# An unpenalised intercept

{{panel:ml-validate-explorer}}

Read the ridge objective again: sum (y - b0 - z'b)^2 + lambda x sum b_j^2. The penalty sums over the feature coefficients b_j. The intercept b0 is outside it. The engine's basis says so in its own words: "sum (y - b0 - z'b)^2 + lambda x sum b_j^2, the intercept b0 not penalised".

## What the intercept is in standardised space

After standardising, every feature has a training mean of zero. A row with every feature at its training mean therefore has z = 0, and the fitted value there is b0 alone. With the features centred, the least squares value of b0 is the training mean of the target, and because the penalty never touches b0, that stays true at every lambda.

The Ekene fit shows it. On the 180 training rows of the teaching split (test fraction 0.3, seed 5), with the three logs and the four attributes:

| lambda | intercept in standardised space (us/ft) |
| --- | --- |
| 0 | 105.883333 |
| 10 | 105.883333 |
| 100 | 105.883333 |

The training mean of DT on those rows is 105.883333 us/ft, the same figure the Associate tier met as the reference mean of the training R-squared. The feature coefficients shrink as lambda grows; the intercept does not move.

## Why leave it out of the penalty

Suppose the intercept were penalised. A large lambda would pull b0 toward zero, and every prediction would be dragged toward a DT of zero us/ft, a slowness no rock has. The penalty exists to restrain the coefficients that respond to the features, where a fit can chase noise in the training wells. The level of the target is information about the field, and ridge keeps it.

It also makes the penalty independent of where the target's zero sits. Add a constant to every DT value and the unpenalised intercept absorbs it, leaving every feature coefficient as it was. A penalised intercept would change the fit, which would make the answer depend on a choice of origin.

## What happens at a very large lambda

With the intercept free and the feature coefficients charged, the intercept is the one term a very strong penalty leaves alone. At lambda 1000 the effective degrees of freedom are 0.965695 and the training R-squared, about the training mean, is 0.265317: a penalty that strong has shrunk every coefficient toward zero and every prediction toward the training mean.

## In original units

The original-unit intercept is rebuilt as mean y - sum b_j mean_j / sd_j. It can change with lambda, because the b_j change. Only the standardised intercept is fixed at the training mean. When you quote a ridge intercept, say which one.

## Exercise

Open the ridge view on the teaching split with the seven default features. Set lambda to 0, then 10, then 1000, and read the standardised intercept each time; confirm it stays at 105.883333. Read the original-unit intercept at the same three lambdas and write down how it moves. Then explain, in two sentences, why a penalised intercept would pull the predictions toward zero.
