# A well the model never saw

{{panel:ml-fit-explorer}}

Holding out one well asks the cleanest version of the model's question: here is a well with none of its rows in the fit; how far off is the plane? Change the seed and a different well is held out, and the answer changes with it. Each row below is a separate call, one well held out at a time, least squares on GR, RHOB and NPHI fitted on the other eight sonic wells.

| seed, stated | held-out well | RMSE (us/ft) | MAE (us/ft) | R-squared about the well's own mean |
| --- | --- | --- | --- | --- |
| 1 | EKENE-8 | 3.765285 | 2.958753 | 0.832560 |
| 2 | EKENE-5 | 4.547894 | 3.888222 | 0.782233 |
| 3 | EKENE-2 | 7.260092 | 6.681459 | 0.482707 |
| 4 | EKENE-3 | 3.564857 | 2.756919 | 0.736197 |
| 6 | EKENE-7 | 6.502833 | 5.838771 | 0.502611 |

These are the first seeds that hold out each of five different wells. Seed 5 holds out EKENE-8, as seed 1 does, so it adds no new row.

## Five readings of one question

The same model form, fitted on eight wells each time, meets a new well and misses it by an RMSE between 3.564857 and 7.260092 us/ft across these five wells. Each is how the model did on that one well. A report that quotes one of them alone, without its seed and its well, says more than it knows.

## Two scores for one well

Look at EKENE-2: RMSE 7.260092 us/ft, MAE 6.681459 us/ft, and an R-squared of 0.482707 about its own mean. Set it beside EKENE-8: RMSE 3.765285, R-squared 0.832560. The RMSE and MAE read in us/ft and need no reference; they say directly how far off the plane was. The R-squared compares the same misses with the spread of that one well's measured DT about that well's own average, so it also depends on how much the well's sonic varies down its 30 rows.

Both are useful, and they answer different questions. That is why this course names the rows and the reference of every R-squared it quotes, and prints the RMSE beside it.

## A coefficient moves between draws

The fit with EKENE-8 held out, over eight wells, gives the coefficients 0.320501 per gAPI, 17.445328 per g/cm3 and 139.804854 per v/v. The teaching fit, over six wells with three held out, gives 0.288005, 22.499915 and 138.783590. The standard errors of module four describe that kind of movement under their assumptions. Fitting on different wells shows it directly.

## Why one well at a time is not the end

Every well held out once, with the scores averaged, is a fuller summary than any single draw. That is cross-validation by wells, and the Professional tier builds it with its own function. This tier's lesson comes first: a test score belongs to the well it was measured on, and a different well gives a different number.

## Honest about the field

Each Ekene well carries its own planted sonic offset, and a plane fitted on other wells has no way to know a held-out well's offset. The residual table of module five prints those offsets only because the field is synthetic. Real fields have their own well-to-well differences, with no planted column to check them against.

## Exercise

Open the fit explorer on the least squares view. Clear the test fraction and set the test wells box to 1. Work through seeds 1, 2, 3, 4 and 6, and for each record the held-out well, the Test RMSE, the Test MAE and the Test R-squared, checking them against the table. Then find a seed that holds out EKENE-9, record its three scores, and write one sentence comparing them with EKENE-9's mean residual in module five.
