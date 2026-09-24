# Writing the model note

{{panel:ml-diagnose-explorer}}

{{panel:ml-validate-explorer}}

A model note is the page that travels with a fitted model. It lets someone who was not there repeat the fit, read its numbers correctly and know where it stops being trustworthy. This course has built every piece of one. This lesson puts them together for the Ekene sonic model, in the order a reader needs them.

| note item | the Ekene sonic model |
| --- | --- |
| target and features | DT in us/ft from GR, RHOB and NPHI |
| method | ridge, lambda 10, intercept unpenalised, lambda on the sum of squares |
| training data | 270 rows of 9 wells, every sonic well |
| how the model was chosen | k-fold by wells, k 3, seed 5, five candidates compared |
| expected error | mean test RMSE 5.826789 us/ft over the three folds |
| importance | OLS on the logs and CALI, teaching split, RMSE, 5 repeats, seed 5: GR, NPHI, RHOB, CALI |
| learning curve | OLS on the logs, fraction 0.3, seed 5: test RMSE 6.766479 at one well, 4.282693 at six |
| range check | min-max on the nine wells; EKENE-6 has 4 of 30 rows above the GR range |
| refusals and warnings | none on the fitted model |

## Say what was fitted, exactly

The method line names the method by its name: ridge regression, lambda 10, with the intercept unpenalised and lambda on the sum of squares, which equals scikit-learn's alpha on the same standardised features. The features are scaled with the population SD of the rows passed. A reader who fits the same data in another tool needs every one of those words to get the same coefficients. In this course machine learning always means a fitted statistical model named by its method, and a note that says only "a machine learning model" has said nothing a reader can check.

## Say how it was chosen and what it is expected to do

The note records the whole comparison: the five candidates of the missing-log module, each with its mean test RMSE. It gives the expected error with its basis: 5.826789 us/ft, mean test RMSE over three folds, k 3, seed 5, whole wells held out. It says that this is the error expected for a new well like the nine, and it says nothing more about any particular well.

## Say what was measured, with its seed

Importance is quoted with its model, its rows, its metric, its repeats and its seed; here it was measured on OLS with CALI on the teaching split, a different model from the one written back, and the note says so. The learning curve is quoted with its fraction, seed and training order. The test R-squared, if quoted, names its rows and its reference mean. Every seeded number carries its seed.

## Say where it stops

The note lists every refusal and warning the fit met, even when the list is empty, so that a reader knows it was checked. It gives the range check and its flags, and it states plainly that the range check sees only the rows that leave the range. It names the conventions a comparison would trip on: the population SD, the sorted names, the test mean for R-squared. And it says what was not claimed: no prediction interval, no error for rows outside the range, no measurement.

## A note is for the reader

Every line exists because a reader later will need it and cannot ask. A note that leaves out the seed makes the figure impossible to repeat. A note that leaves out the reference mean makes an R-squared impossible to compare. A note that leaves out the flags makes a prediction look like a measurement.

## Exercise

Open the validate panel on the cross-validation view and the diagnose panel on the importance and learning views, and run each with the teaching defaults. From what they print, write a model note of your own for ridge at lambda 0, which is least squares, on GR, RHOB and NPHI, using the table above as the template. Mark each line with the panel view it came from, and leave no seed, fraction or reference unstated.
