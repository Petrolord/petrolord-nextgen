# Writing a prediction back honestly

{{panel:ml-diagnose-explorer}}

The last step of a missing-log prediction is the one that outlives the analysis. The predicted sonic goes into a database or a project file, and from then on it will be read by people who never saw the fit. A prediction written back without its method, its training wells, its expected error and its out-of-range flags will be read later as a measurement. This lesson writes EKENE-6's predicted sonic back by the course's rule, every item taken from the steps before it.

| item | what is written |
| --- | --- |
| channel name | a new channel, DT_PRED, beside the measured DT; the measured DT stays null |
| method | ridge, lambda 10, features GR, RHOB, NPHI, fitted on 270 rows of 9 wells |
| wells trained on | EKENE-1, EKENE-10, EKENE-2, EKENE-3, EKENE-4, EKENE-5, EKENE-7, EKENE-8, EKENE-9 |
| expected error | k-fold by wells, k 3, seed 5: mean test RMSE 5.826789 us/ft |
| rows outside the training range | 4 of 30, GR above the nine-well maximum 120.870000 gAPI; flagged row by row |
| what is not claimed | no error for rows outside the range, and no measurement |

## A new channel

The prediction goes into its own channel, DT_PRED, and the measured DT stays null. Writing predicted values into the DT channel would erase the one fact everyone needs: that EKENE-6 has no sonic. A later user filtering for wells with a measured sonic, or fitting a new model on every well with a DT, would pick up EKENE-6's predictions and treat a model's output as data. Keeping the two channels apart means that mistake has to be made on purpose.

## The method and the wells

The method line says what was fitted, with every setting a reader would need to repeat it: ridge at lambda 10, on GR, RHOB and NPHI, fitted on 270 rows of 9 wells. The wells are listed by name, in the engine's sorted order, so EKENE-10 comes after EKENE-1. Anyone refitting later on a field with more wells can see exactly which wells this prediction knew.

## The expected error, with its basis

The expected error is the k-fold mean test RMSE of 5.826789 us/ft, stated with its folds and seed: k 3, seed 5. It is the error expected for a new well like the nine. It is not stated as EKENE-6's error, and on this synthetic field the withheld sonic showed why: EKENE-6's RMSE against the withheld values was 13.176539. A real field offers no such check, so the write-back states what the k-fold measured and what it measured it on, and no more.

## The flags

The 4 rows whose GR is above the nine-well maximum of 120.870000 gAPI are flagged row by row, in the channel or beside it. On those rows the model extrapolates, and the write-back claims no error for them at all. The expected error of 5.826789 applies to rows inside the range of a well like the nine.

The flags do not make the other 26 rows safe. The hot shale shifted all 30 rows, and the range check caught 4. The write-back says what was checked; it cannot say what was not found.

## What is not claimed

The last line of the rule says, in writing, that the values are no measurement and that no error is claimed for the flagged rows. It is there because the absence of a caveat is read as the absence of a problem.

## Exercise

Open the panel on the missing log view with the defaults and run it. Using only what the panel shows and the values in this module, write the six-line record for DT_PRED in your own words, keeping every figure exactly as printed. Then write one more line of your own that a reader of EKENE-6 would need and the rule above does not yet carry.
