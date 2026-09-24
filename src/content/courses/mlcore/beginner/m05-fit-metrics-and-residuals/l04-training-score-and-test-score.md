# Training score and test score

{{panel:ml-fit-explorer}}

Every fit in this tier has two scores, and they answer two questions. The training score is how closely the plane sits on the rows that chose it. The test score is how far off it is on wells it never met. On the teaching split the test score is the better of the two, and that surprises people.

| scored on | rows | RMSE (us/ft) | MAE (us/ft) | R-squared, named |
| --- | --- | --- | --- | --- |
| training rows (fitted values) | 180 | 5.758010 | 4.810983 | 0.683457 about the training mean |
| test wells EKENE-4, EKENE-5, EKENE-8 | 90 | 4.282693 | 3.526103 | 0.815322 about the test mean |

## Test can beat training

On this split the test RMSE is 4.282693 us/ft against a training RMSE of 5.758010. The three held-out wells happen to sit close to the fitted plane: their own RMSEs are 4.620664, 4.627312 and 3.501687. The six training wells include EKENE-9 and EKENE-2, whose mean residuals in the previous lesson's fit of all nine wells are the largest on either side of the plane, and least squares has to fit them all.

That is no contradiction. A training score is not a ceiling on a test score. Least squares makes the training misses as small as a plane can make them, but the training wells may simply be harder to fit than the test wells. Which wells land on which side is the draw.

## One split is one draw of wells

Hold out a single well at a time and the test score moves with the well:

| seed, stated | held-out well | test RMSE (us/ft) | test MAE (us/ft) |
| --- | --- | --- | --- |
| 1 | EKENE-8 | 3.765285 | 2.958753 |
| 2 | EKENE-5 | 4.547894 | 3.888222 |
| 3 | EKENE-2 | 7.260092 | 6.681459 |
| 4 | EKENE-3 | 3.564857 | 2.756919 |
| 6 | EKENE-7 | 6.502833 | 5.838771 |

The same model form, fitted on eight wells each time, scores from 3.564857 to 7.260092 us/ft across these five held-out wells. None of these is the model's true error. Each is one reading of how it does on one new well. With EKENE-8 held out, the training RMSE over the other eight wells is 5.462405, above that well's test RMSE of 3.765285. Whether test beats training depends on the well.

## What to report

Report both scores, each with its rows, and report the split that produced them: the fraction or the number of test wells, the seed, and the wells held out. A test score quoted alone, from one draw, invites the reader to treat it as the model's error. The Professional tier tests every well once and averages, which is a better reading than any single draw. At this tier, the habit is to say plainly that one split gave one number.

## What neither score says

Neither score says why a well is easy or hard. In the Ekene field the residual table of the previous lesson shows each well's mean position against the plane tracking its planted sonic offset, a cause that is known only because the field is synthetic.

## Exercise

Open the fit explorer on the least squares view. Clear the test fraction and set the test wells box to 1. For seeds 1, 2, 3, 4 and 6, write down the held-out well, the Test RMSE and the Training RMSE. Check the test figures against the table above. For each seed, mark whether the test RMSE is above or below the training RMSE, and write one sentence on why a single split should always be quoted with its seed.
