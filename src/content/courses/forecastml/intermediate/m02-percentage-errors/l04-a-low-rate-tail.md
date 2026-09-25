# A low rate tail

{{panel:pf-backtest-explorer}}

Percentage errors were brought in to put wells of different size on one scale. On a well whose rate has fallen close to zero, that same division turns small misses into large percentages. EKENE-P5, the steep decline to a low tail, shows how large.

## The test

Each method is fitted on EKENE-P5 months 0 to 35 and scored on months 36 to 47, where the rate runs from 24.600000 to 11.100000 bbl/d. For comparison, EKENE-P1 makes 270.100000 bbl/d in month 36 and 211.400000 in month 47.

| method | MAE (bbl/d) | MAPE (percent) | sMAPE (percent) | MASE |
| --- | --- | --- | --- | --- |
| damped | 12.689466 | 84.152526 | 57.006610 | 0.563761 |
| holt | 3.244769 | 24.095758 | 32.408520 | 0.144157 |

## Small in bbl/d, large in percent

Holt misses EKENE-P5 by 3.244769 bbl/d in a typical month here. That is a MAPE of 24.095758 percent. On EKENE-P1's hold-out, holt's miss is larger, 6.783515 bbl/d, and its MAPE is only 2.781120 percent. A miss of a few bbl/d on a rate of a few tens of bbl/d is a large fraction of it.

Neither percentage is wrong: each says how large the miss is beside the rate, and when the rate is small the answer is large. A reader who compares these two MAPEs and concludes holt forecast EKENE-P1 far better has read the percentage correctly and the wells incompletely.

## Two percentages that disagree

On EKENE-P5 the two percentage measures move apart in opposite directions for the two methods. Damped's sMAPE, 57.006610, is below its MAPE, 84.152526. Holt's sMAPE, 32.408520, is above its MAPE, 24.095758. The previous lesson showed why that can happen: sMAPE puts the forecast in the denominator, so a high forecast pulls a term below its MAPE term and a low forecast pushes it above, while MAPE divides by the actual alone. On a low tail, where each actual is small, the forecast can be a large part of each denominator.

Both measures still rank holt ahead of damped here, and so does the MAE. The lesson is in the sizes: on a low tail, percentage measures swing widely, and the gap between MAPE and sMAPE can be large.

## A scale that holds up

The last column is the scaled error, MASE, which the next module builds. It divides the MAE by a scale taken from the training months, in bbl/d, so it has no unit and does not grow as the actuals shrink. Holt's MASE here is 0.144157 and damped's 0.563761. They can stand beside MASEs from wells of any size.

So the percentage errors are useful and limited: good for a sentence a manager reads, unreliable as the one figure that chooses a method on a well near the end of its life.

## What to report on a low tail

Quote the MAE in bbl/d beside any percentage, name the months scored and their range of rates, and say which percentage measure it is. A MAPE of 24.095758 percent on months where the rate was 24.600000 to 11.100000 bbl/d is honest. The same figure with the rates left out invites the wrong comparison.

## Exercise

In the backtest explorer, hold out the last 12 months of EKENE-P5 and score holt and damped. Check the table. Then hold out the last 12 months of EKENE-P1 and score holt. Write one sentence comparing holt on the two wells that uses the MAE, and one that uses the MAPE, and say which of the two sentences a reader could misread and how.
