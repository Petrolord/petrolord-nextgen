# Writing up a fit

{{panel:ml-fit-explorer}}

A fit that cannot be reproduced from its write-up cannot be checked, and a score without its rows cannot be compared. The write-up is where every choice this tier has taught gets named. Here is the teaching fit, written up the way this course asks, every value taken from the engine's results.

| item | what is written |
| --- | --- |
| target | DT, us/ft |
| features | GR (gAPI), RHOB (g/cm3), NPHI (v/v) |
| method | ordinary least squares with an intercept |
| split | `groupSplit`, test fraction 0.3, seed 5 |
| test wells | EKENE-4, EKENE-5, EKENE-8, 90 rows |
| training wells | EKENE-1, EKENE-10, EKENE-2, EKENE-3, EKENE-7, EKENE-9, 180 rows |
| coefficients | intercept -0.552686 us/ft; GR 0.288005 us/ft per gAPI; RHOB 22.499915 us/ft per g/cm3; NPHI 138.783590 us/ft per v/v |
| standard errors | 30.261214; 0.066103; 12.289493; 21.960664 |
| fit | n 180, p 4 with the intercept, n - p 176, residual standard error 5.823075 us/ft |
| training R-squared | 0.683457, training rows about the training mean |
| test scores | RMSE 4.282693 us/ft, MAE 3.526103 us/ft |
| test R-squared | 0.815322 about the test mean; 0.816151 about the training mean |

## Say what was fitted

Name the target and every feature with its unit. A coefficient without its unit is a number without a meaning, and one quoted without its feature list is a number without a context. The method is named by what it is, ordinary least squares with an intercept.

## Say what it was fitted on

Name the split function, the fraction or the number of test wells, and the seed. Then name the wells on each side, because the seed alone does not tell a reader which wells those were without rerunning the call. Give row counts beside well counts. 180 rows from six wells is a different amount of evidence from 180 rows spread over many more wells.

If features were scaled, say how: standard or min-max, fitted on the training rows only, and for a standard scaler the divisor, the population standard deviation, n.

## Say what it scored, and against what

Every score gets its rows. Training scores describe the fit; test scores describe the held-out wells. Every R-squared gets its reference mean. When both references are cheap to print, print both, as the table does.

## Say what the numbers do not claim

Three sentences belong in every write-up of a fit like this one.

The test score is one draw of wells. A different seed holds out different wells and gives a different score, and the next tier averages over every well.

The standard errors assume independent residuals. Rows of one well share its offset, so the printed standard errors are exact only under an assumption these data do not meet.

The field is synthetic. The Ekene wells were drawn with planted structure, and any check against a planted value is one no real field allows.

## Keep the refusals in the record

If the engine refused a call on the way, write down the refusal and what you did about it: a missing value dropped, a feature removed because it was constant on the training rows, a split changed because it left too few rows. A reader who reruns the work will meet the same refusal, and your note tells them what you decided.

## Exercise

Open the fit explorer on the least squares view. Clear the test fraction, set the test wells box to 1 and the seed to 4. Write up that fit in the shape of the table above: target, features, method, split, test well, training wells with their row count, coefficients with units, standard errors, fit statistics, training R-squared with its reference, and test RMSE, MAE and R-squared with its reference. Finish with the three sentences on what the numbers do not claim.
