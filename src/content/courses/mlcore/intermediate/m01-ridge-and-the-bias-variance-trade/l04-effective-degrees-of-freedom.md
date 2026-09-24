# Effective degrees of freedom

{{panel:ml-validate-explorer}}

A least squares fit with seven features spends seven coefficients on the training rows, one per feature, beside the intercept. Ridge fits the same seven coefficients at every lambda, yet a penalised fit is plainly less free than an unpenalised one: its coefficients are held back. Effective degrees of freedom put a number on how much fitting a penalised model is really doing.

## The formula

The engine computes

sum d_i^2 / (d_i^2 + lambda)

over the singular values d_i of the standardised feature matrix of the training rows. Each term lies between 0 and 1. At lambda 0 every term is exactly 1, so the sum is the number of features. As lambda grows, each term shrinks, and it shrinks first for the directions in the data with small singular values, the directions the training rows pin down least. The intercept is not counted, because it is not penalised.

## The Ekene path

On the 180 training rows of the teaching split (test fraction 0.3, seed 5), with the three logs and the four well-level attributes:

| lambda | effective degrees of freedom | training R-squared, about the training mean |
| --- | --- | --- |
| 0 | 7.000000 | 0.861914 |
| 0.1 | 6.969214 | 0.861901 |
| 1 | 6.724037 | 0.860878 |
| 10 | 5.568235 | 0.833394 |
| 100 | 3.458214 | 0.688743 |
| 1000 | 0.965695 | 0.265317 |

At lambda 0 the fit spends all seven. At lambda 1000 it spends 0.965695, less than one, though seven coefficients are still printed. Ridge shrinks coefficients; it does not remove features. The effective count tells you how much of the seven the fit is using.

## Reading the two columns together

The training R-squared, about the training mean, falls every time the effective degrees of freedom fall. That is expected: a fit with less freedom follows the training rows less closely. It is the bias half of the trade the next lesson takes up. The question the table cannot answer is whether that lost training fit was signal or noise, and only wells the model has not seen can answer it.

## Why the count matters here

The training rows come from six wells. Four of the seven features are well-level attributes, constant down each well, so across the training rows each takes at most six distinct values. A model with seven effective degrees of freedom and six training wells has room to give each well its own level through those attributes. As lambda rises and the effective count falls, that room closes. Watch for this in the leakage module, where the same four attributes name a well.

## A number to report

Effective degrees of freedom belong in any report of a ridge fit beside lambda itself, because lambda alone does not say how strong the penalty was. Lambda is on the sum of squares and is not divided by the number of rows, so the same lambda on a different set of rows is a different penalty. The effective count reads the penalty against the data it was applied to.

## Exercise

Open the ridge view on the teaching split. With the seven default features, step lambda through 0, 1, 10, 100 and 1000 and confirm the effective degrees of freedom in the table. Then keep only GR, RHOB and NPHI and repeat. Write down the effective degrees of freedom at lambda 0 for three features, and at which of your lambdas the count first falls below two.
