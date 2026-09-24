# A rule fitted to data

{{panel:ml-fit-explorer}}

Take the 180 training rows of the Ekene teaching split. Each row carries a gamma ray, a bulk density, a neutron porosity and a compressional sonic. Ask least squares for the plane through those rows that makes the sum of squared misses on the sonic as small as it can be. What comes back is a rule: four numbers that turn any row's three logs into a predicted sonic. That rule is the model. This course calls such a rule machine learning because it was fitted to data, and it always names the method. Here the method is ordinary least squares.

| term | coefficient | unit |
| --- | --- | --- |
| intercept | -0.552686 | us/ft |
| GR | 0.288005 | us/ft per gAPI |
| RHOB | 22.499915 | us/ft per g/cm3 |
| NPHI | 138.783590 | us/ft per v/v |

## The rule and the rows it came from

The four coefficients are the whole model. To predict a sonic for a row, multiply each log by its coefficient, add the three products and add the intercept. Nothing else from the 180 rows travels with the rule, so it can be carried to a row the fit never saw.

The rule is also only as good as the rows it was fitted on. The 180 rows come from six wells, EKENE-1, EKENE-10, EKENE-2, EKENE-3, EKENE-7 and EKENE-9. The plane is the one that suits those six wells best. It has never met any other well.

## Judged on rows it has not seen

On its own training rows the fit has an R-squared of 0.683457, taken about the training mean of the sonic. That figure describes how well the plane sits on the rows it was chosen to suit, and it cannot tell you how the rule will do on a new well.

So the course holds wells back. The teaching split keeps EKENE-4, EKENE-5 and EKENE-8 out of the fit, 90 rows, and scores the rule on them afterwards. On those three wells the RMSE is 4.282693 us/ft. This whole tier builds up to that one number, what it measures, and what it cannot claim.

## Two shapes of answer

Every function in the engine takes plain arrays and objects and returns one of two shapes. A call it can answer returns a result, and the result carries a `basis` block naming the convention it used, so the working can be printed beside the number. A call it cannot answer returns an `error` and a `field`, and the field names the exact input it refused.

## What the engine leaves to you

It fits linear models only. It does not fill a missing value: a null in the logs or in the target is refused by name, and filling or dropping it is your decision, made before the fit. It does not choose the features, and it does not choose the model. The only random draws it makes are seeded shuffles, which the next module opens up.

## Exercise

Open the fit explorer and choose the view for least squares scored on held-out wells. It opens on the Ekene sonic rows with the features GR, RHOB and NPHI, the target DT, the test fraction 0.3 and the seed 5. Check each coefficient in its table against the table above. Read the Training R-squared tile and the Test RMSE tile, and for each write one sentence naming the rows it was measured on. Then remove NPHI from the features and write down what happens to the GR coefficient.
