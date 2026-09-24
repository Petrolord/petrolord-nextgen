# The capstone brief

{{panel:ml-fit-explorer}}

The Associate capstone hands you a field of wells and asks for six numbers. Every one of them answers this tier's question, a model and its test, and every one is a value the engine returns. Each has a worked twin in this tier, computed on the Ekene sonic wells at the teaching split with the same rule.

| the kind of field | the rule it tests | a worked twin in this tier |
| --- | --- | --- |
| a feature's training centre | the mean of the training rows of a whole-well split | RHOB, 2.391150 g/cm3 |
| a feature's training scale | the population standard deviation, n, of those rows | GR, 22.375203 gAPI |
| a least squares coefficient | fitted with an intercept on the training rows, per whole unit of its feature | NPHI, 138.783590 us/ft per v/v |
| the residual standard error | the root of RSS / (n - p), p counting the intercept | 5.823075 us/ft |
| the test RMSE | on the held-out wells only | 4.282693 us/ft |
| the test R-squared | on the held-out wells, about the mean of the test targets | 0.815322 |

## What each field asks of you

The two scaling fields ask for a scaler fitted on the training rows alone. A centre or a scale fitted on every row includes the test wells, and a different split gives different training rows. The scale uses the population standard deviation; the sample version is a different number.

The coefficient field asks for the rate per whole unit of its feature, fitted with an intercept beside the other features the brief names. A rate per hundredth, a fit without an intercept, a coefficient on standardised features or a fit on one feature alone are each a different number.

The residual standard error divides the residual sum of squares by n - p before the root. RSS over n is the training RMSE, a different number again.

The test RMSE is measured on the held-out wells. The training RMSE and the test MAE are different quantities.

The test R-squared is taken about the mean of the test targets, the engine's default. The same predictions about the training mean give a different figure.

## How to work it

Read the brief for its split: the fraction or the number of test wells, and the seed. Split first, by whole wells, with exactly those settings; a random-row split, the next seed or a rounded-down test size each holds out the wrong rows. Write down the test wells before you fit anything. Then fit the scaler and the model on the training rows only, predict the held-out wells, and score them.

Before you open the capstone, reproduce every twin in the table in the fit explorer and check each against the figure here to the last printed digit. The rule you apply to the twins is the rule the capstone grades. The likeliest wrong answers come from the wrong convention.

## What the capstone will not ask

It asks for no penalty, no cross-validation and no classifier. Those are the Professional tier's. It asks nothing about when the engine stops or how it treats a badly conditioned design. That is the Expert tier's. An answer that brings any of them in has answered a question nobody asked.

## Exercise

Reproduce all six worked twins from the table without reading the answers first. Use the fit explorer's scaling view for the RHOB centre and the GR scale, and its least squares view for the NPHI coefficient, the residual standard error, the test RMSE and the test R-squared, all at the test fraction 0.3 and the seed 5. For each, write down the rule, the rows and the setting you used.
