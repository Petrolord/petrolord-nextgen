# The learning curve counted in wells

{{panel:ml-diagnose-explorer}}

Would more wells help? A learning curve answers that for one model on one field: it fits the model on more and more training data and scores each fit on its own rows and on test wells it never sees. The engine counts the training data in wells.

| training wells m | training rows | wells used | training RMSE (us/ft) | test RMSE (us/ft) |
| --- | --- | --- | --- | --- |
| 1 | 30 | EKENE-2 | 2.749195 | 6.766479 |
| 2 | 60 | EKENE-2, EKENE-1 | 4.351546 | 4.756657 |
| 3 | 90 | EKENE-2, EKENE-1, EKENE-3 | 4.346620 | 4.385966 |
| 4 | 120 | EKENE-2, EKENE-1, EKENE-3, EKENE-10 | 4.482803 | 4.761367 |
| 5 | 150 | EKENE-2, EKENE-1, EKENE-3, EKENE-10, EKENE-9 | 5.696182 | 4.205658 |
| 6 | 180 | EKENE-2, EKENE-1, EKENE-3, EKENE-10, EKENE-9, EKENE-7 | 5.758010 | 4.282693 |

## How the curve is built

`learningCurve` first holds out test wells with one `groupSplit`: fraction 0.3, seed 5, which holds out EKENE-4, EKENE-5 and EKENE-8, the teaching split's test wells. Those three stay fixed for every point on the curve. The remaining six wells are taken in the split's own shuffled order: EKENE-2, EKENE-1, EKENE-3, EKENE-10, EKENE-9, EKENE-7. For each m in the list of counts, the engine fits the model on the first m of those wells and scores it on its own training rows and on the fixed test wells. Here the model is OLS on GR, RHOB and NPHI and the metric is RMSE in us/ft.

Two things follow. The test wells never change, so every point is scored against the same 90 rows. And the training wells are added in one stated order, so the point at m wells is always the point at m - 1 wells with one more well added.

## Why the count is in wells

The engine counts the size in wells because rows of one well are not independent. Each Ekene well sits above or below the fitted plane as a block: the Associate tier found the well means of the residuals spanning 12.562737 us/ft. Thirty more rows from a well already in the training set carry that well's offset again; thirty rows from a new well bring a new offset. Counted in wells, each step on the curve is one more well of the kind the model will be asked about. The common alternative is to count in rows.

## The endpoints

With one training well, EKENE-2, the model scores 2.749195 on its own 30 rows and 6.766479 on the test wells. With all six it scores 5.758010 on its 180 training rows and 4.282693 on the test wells, the Associate tier's test RMSE on the teaching split, reached again as the last point of the curve. The training score is the fit to wells the model has seen; the test score is the error on wells it has not.

## A seeded curve

The curve depends on its seed twice: through which wells are held out for testing, and through the order in which the training wells are added. At another seed either can change, and with them the points. Quote a learning curve with its fraction, its seed, its model and its metric, and list the order of the wells beside it.

## Exercise

Open the panel on the learning view. The defaults are the teaching setting: the sonic rows, GR, RHOB and NPHI, counts 1 to 6, fraction 0.3 and seed 5. Run it and confirm the test wells, the training order and the six points in the table. Then set the counts to 2, 4 and 6 only and confirm that those three points do not change. Last, run it at seed 6 and write down the test wells, the order and the test RMSE at 3 wells.
