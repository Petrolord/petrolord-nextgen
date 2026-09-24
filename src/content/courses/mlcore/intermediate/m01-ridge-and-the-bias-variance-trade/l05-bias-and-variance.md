# Bias and variance as lambda grows

{{panel:ml-validate-explorer}}

A model can miss a new well for two different reasons. It can be too rigid to follow the rock, and then it misses every well in the same way: that is bias. Or it can follow its own training wells so closely that it has learned their accidents, and then its predictions swing with whichever wells it happened to be trained on: that is variance. A penalty trades one for the other, and the Ekene lambda path shows the trade on real numbers.

## The path, read in full

Ridge on the 180 training rows of the teaching split (test fraction 0.3, seed 5), with GR, RHOB, NPHI and the four well-level attributes, scored on the three test wells EKENE-4, EKENE-5 and EKENE-8:

| lambda | effective degrees of freedom | training R-squared, about the training mean | test RMSE (us/ft) | test MAE (us/ft) |
| --- | --- | --- | --- | --- |
| 0 | 7.000000 | 0.861914 | 16.999672 | 15.883282 |
| 0.1 | 6.969214 | 0.861901 | 16.831728 | 15.717127 |
| 1 | 6.724037 | 0.860878 | 15.485689 | 14.382834 |
| 10 | 5.568235 | 0.833394 | 9.418023 | 8.317834 |
| 100 | 3.458214 | 0.688743 | 5.759287 | 4.769725 |
| 1000 | 0.965695 | 0.265317 | 8.607538 | 7.187084 |

## The variance end

At lambda 0 the fit is least squares, and its training R-squared is the highest in the table, 0.861914. Its test RMSE is the worst, 16.999672 us/ft. Each Ekene well carries its own sonic offset, and the four attributes are constant down each well. With seven free coefficients and six training wells, the fit uses the attributes to chase the six training wells' offsets. On three wells it has never seen, those attribute coefficients extrapolate, and the error is large.

The standardised coefficients show where the penalty bites. From lambda 0 to lambda 100, easting falls from 8.680036 to 0.098385 and mudWeight from 8.884278 to 1.045997, while GR falls from 7.109316 to 3.972291. The penalty shrinks the attribute coefficients hardest.

## The bias end

At lambda 1000 the effective degrees of freedom are 0.965695 and the training R-squared, about the training mean, is 0.265317. The penalty has pulled the fit far from the training rows, which is bias, and the test RMSE has risen again to 8.607538 us/ft.

## In between

Of the six lambdas tried, lambda 100 gives the lowest test RMSE on these three wells, 5.759287 us/ft. The training R-squared fell at every step, from 0.861914 to 0.265317; the test RMSE first fell, then rose. That shape, falling then rising, is the trade.

## One split is one draw

Every test figure above comes from one split: three wells chosen by one seed. A different seed holds out different wells, and the lambda that scores best on them may be a different lambda. Choosing lambda from this table alone would tune the model to EKENE-4, EKENE-5 and EKENE-8. The next module scores every well once, and chooses lambda from that.

The attributes also carry a warning of their own. A model that needs a penalty to stop it learning well identities is holding features that name a well. The leakage module shows what those features do under a split that lets rows of one well fall on both sides.

## Exercise

Open the ridge view with the seven default features on the teaching split. Run lambda 0, 10 and 100, and for each one write down the standardised coefficients of easting and GR. Then change the seed to 1, keep the fraction at 0.3, and step lambda through the same six values. Write down which lambda gives the lowest test RMSE at seed 1, and whether it agrees with seed 5.
