# Residuals, well by well

{{panel:ml-fit-explorer}}

A residual is y - yhat for one row: the measured sonic less the predicted one. A score such as RMSE rolls every residual into one number. Grouping the residuals by well before rolling them up shows something the score hides. Here least squares of DT on GR, RHOB and NPHI is fitted on all 270 sonic rows, and each well's 30 residuals are averaged.

| well | mean residual (us/ft) | planted offset less the nine-well mean (us/ft) | difference (us/ft) |
| --- | --- | --- | --- |
| EKENE-1 | 0.265727 | 0.244483 | 0.021244 |
| EKENE-10 | -5.343678 | -5.187561 | -0.156117 |
| EKENE-2 | -5.829469 | -6.188718 | 0.359250 |
| EKENE-3 | 0.592822 | 0.903752 | -0.310930 |
| EKENE-4 | -1.782004 | -1.345958 | -0.436046 |
| EKENE-5 | -1.698368 | -1.808898 | 0.110529 |
| EKENE-7 | 5.120888 | 4.483635 | 0.637253 |
| EKENE-8 | 1.940815 | 2.145710 | -0.204896 |
| EKENE-9 | 6.733268 | 6.753554 | -0.020286 |

## Wells sit above or below the plane as blocks

With an intercept the residuals of the fitted rows sum to zero overall: -1.99e-12 us/ft over the 270 rows, which is rounding. They do not sum to zero well by well. EKENE-9's rows sit on average 6.733268 us/ft above the plane; EKENE-2's sit 5.829469 below it. The well means span 12.562737 us/ft from the lowest to the highest. Each well sits above or below the plane as a block.

The fit itself looks ordinary. Its R-squared on these 270 rows, about their own mean, is 0.728027, and its residual standard error is 5.333216 us/ft. Nothing in those two figures says the misses are organised by well. Only grouping the residuals shows it.

## Where the blocks come from

The Ekene field is synthetic, and each well was given its own sonic offset, added to every DT sample. The middle column prints each well's planted offset, less the mean offset of the nine wells, because the intercept absorbs that mean. No real field comes with such a column. It is printed here only because this field was drawn on purpose, and it lets you check the method.

The check passes. The largest gap between a well's mean residual and its planted offset is 0.637253 us/ft, for EKENE-7. The mean residual per well recovers the planted structure closely. The method that found it is the one you would use on a real field: fit, group the residuals by well, and look at the means.

## Why this matters for testing

The blocks are the reason this course holds out whole wells. A row of EKENE-9 carries EKENE-9's offset. If other EKENE-9 rows are in the training set, a model has had the chance to meet that offset. If EKENE-9 is held out whole, it has not, and the test score reflects what happens on a well with an unknown offset, which is every new well.

They are also why the standard errors of module four assume something these data do not give: residuals from one well are not independent of each other.

## What a residual table does not say

It does not say why a well sits high or low. In the Ekene field the cause is known because it was planted. In a real field, a block of residuals might be a calibration difference, a tool change, a geological difference the logs do not capture, or a data problem. Finding the cause takes the logs, the geology and the well history.

## Exercise

Open the fit explorer on the least squares view. Clear the test fraction and set the test wells box to 1, then try seeds 1, 2, 3, 4 and 6: each holds out a different single well. For each, write down the held-out well and its Test RMSE. Set them beside the mean residuals above, and write two sentences on what you see, naming the wells.
