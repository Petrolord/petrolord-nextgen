# A well outside the training range

{{panel:ml-diagnose-explorer}}

{{panel:ml-fit-explorer}}

With the features and lambda chosen, the prediction for EKENE-6 takes three steps: fit on every well that has the log, check the new well against the training range, and predict. Then, only because this field is synthetic, it is checked against the withheld sonic.

| rows of EKENE-6 | rows | RMSE against the withheld DT (us/ft) | MAE (us/ft) |
| --- | --- | --- | --- |
| all | 30 | 13.176539 | 12.708542 |
| GR inside the training range | 26 | 12.887017 | 12.483374 |
| GR above the training range | 4 | 14.922136 | 14.172130 |

## Fit, check, predict

Step 2 fits ridge at lambda 10 on all 270 sonic rows of the nine wells. In original units the coefficients are 2.521897 for the intercept, 0.292658 us/ft per gAPI for GR, 21.134015 per g/cm3 for RHOB and 137.387028 per v/v for NPHI.

Step 3 fits a min-max scaler on the same nine wells and applies it to EKENE-6. It does not clip a new row. On GR, 4 of EKENE-6's 30 rows map above 1, the highest to 1.219324: their GR is above the nine-well maximum of 120.870000 gAPI. On those rows the model extrapolates. RHOB and NPHI stay inside the range on every row.

Step 4 predicts 30 DT values, from 100.024605 to 136.515569 us/ft.

## The check no real well allows

A real well gives no such check. This field is synthetic, and EKENE-6's drawn sonic was kept apart when it was built. Over all 30 rows the RMSE is 13.176539 us/ft. The k-fold estimate that chose the model was 5.826789.

The mean of predicted less withheld is 12.708542 us/ft: the predictions sit high on every row, inside the range as well as above it. Two stated causes account for it. The hot shale adds 30 gAPI to every EKENE-6 sample, and the GR coefficient of 0.292658 us/ft per gAPI turns that into 8.779741 us/ft on every row. The well's own planted sonic offset, less the nine-well mean the intercept absorbed, is -5.138713 us/ft, and a prediction cannot know it. 8.779741 less -5.138713 is 13.918453, within 1.209912 of the mean error.

## What the range check saw

The range check flagged 4 rows, and on those rows the RMSE is 14.922136 against 12.887017 on the 26 rows inside the range. The flagged rows are worse. But the 26 unflagged rows are shifted by the same hot shale, and they pass the check. A range check sees only the rows that leave the range.

The whole-well RMSE, 13.176539, is above the k-fold estimate of 5.826789, and the estimate was never wrong about what it describes: a well like the nine. EKENE-6 is unlike the nine in a way that mostly keeps it inside their range. A shift of that kind is found by comparing a well's logs with its neighbours', which is the work of the data quality course, and by the geology. It is never found by the scaler.

## Exercise

Open the diagnose panel on the missing log view with the defaults: the nine sonic wells as training rows, EKENE-6 as the rows to predict, GR, RHOB and NPHI, lambda 10. Confirm the 4 rows flagged above the GR range. Then subtract 30 from every GR value in the prediction table, run it again, and write down how many rows are flagged and the lowest and highest prediction. Last, open the fit panel's scaling view on the teaching split and read how many rows of its test wells map above 1, a range check on wells like the nine.
