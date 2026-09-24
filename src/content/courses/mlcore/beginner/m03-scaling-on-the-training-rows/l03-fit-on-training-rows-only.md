# Fit on the training rows only

{{panel:ml-fit-explorer}}

The engine fits a scaler's centre and scale on the training rows only, the rows passed or the rows `trainIndices` lists, and applies those parameters unchanged to every other row. Here is what that means on the teaching split. The table sets the scaler fitted on the 180 training rows beside one fitted on all 270 sonic rows, which include the three test wells.

| feature | centre, training rows | centre, all rows | scale, training rows (population SD) | scale, all rows (population SD) |
| --- | --- | --- | --- | --- |
| GR | 59.844500 | 60.250741 | 22.375203 | 21.363430 |
| RHOB | 2.391150 | 2.397719 | 0.142322 | 0.136737 |
| NPHI | 0.255072 | 0.253533 | 0.033503 | 0.033238 |

## A scaler fitted on every row has seen the test wells

Every number in the "all rows" columns was computed partly from EKENE-4, EKENE-5 and EKENE-8, the three wells this split promised to keep unseen. A model trained through that transform has, through the scaler, been shaped by the test wells. The procedure is the defect, whatever its size, because the test score is supposed to report on wells that influenced nothing.

The rule is simple to state and easy to break: split first, then fit anything with parameters, the scaler included, on the training rows alone.

## Applied unchanged

Once fitted, the scaler travels. Applied to the first test row, sonic row 90, EKENE-4 at 7966 ft, it gives z = -0.520420, -0.303186 and -0.360332, using the training centres and scales and nothing from the test well. The basis records what happened:

> standard scaler fitted on 180 training rows; parameters unchanged

The test rows do not come out with centre 0 and scale 1. They come out wherever the training parameters put them, and that is informative: it says where the test well sits relative to the rows the model learned from.

The scaler also checks the shape of what it is handed. Rows with a different number of columns from the fit are refused:

> X must have 2 columns, as the scaler was fitted on

## Constant on these rows

The rows a scaler is fitted on decide more than its numbers. A well-level attribute such as mud weight is constant down a well. Fitted on the rows of one well, it has zero variance and the engine refuses it, as the previous lesson showed with one well's 30 rows. Fitted on the nine sonic wells, the same column varies and the scaler accepts it. So a refusal about a constant feature is a statement about the training rows, and the fix is either a different feature or training rows on which it varies.

## Why this matters even when predictions do not move

For least squares with an intercept, scaling leaves the predictions unchanged, as the first lesson of this module showed. So the leaked scaler above would move this tier's test RMSE only by rounding. That makes it a good place to learn the habit, where it costs nothing. The Professional tier fits models whose answers do depend on the scale, and there a scaler that has seen the test wells does change the test score.

## Exercise

Open the fit explorer on the scaling view with the test fraction 0.3 and the seed 5, and check the training centres and scales against the table above. Now set the seed to 3 and read the centres again. Write down which wells the scaler was fitted on at each seed. Then say in two sentences why a report that quotes a centre must also quote the split it was fitted on.
