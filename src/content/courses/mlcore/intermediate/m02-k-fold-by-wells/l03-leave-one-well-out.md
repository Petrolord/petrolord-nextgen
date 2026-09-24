# Leave one well out

{{panel:ml-validate-explorer}}

The largest k the engine accepts is the number of distinct wells. With the nine sonic wells that is k = 9: every fold holds exactly one well, every model trains on the other eight, and there are nine fits. This is leave one well out, and it is ordinary k-fold at its limit. The engine treats it as such: k equal to the number of wells is fitted, and k one larger is refused.

## One well at a time

The Associate tier held out single wells with `groupSplit` and saw how much the score depends on which well is out. Least squares on GR, RHOB and NPHI, trained on eight wells, scored 3.564857 us/ft on EKENE-3 and 7.260092 on EKENE-2. Leave one well out makes that spread systematic: every well takes its turn, and the scores are averaged.

## The Ekene means

Mean test RMSE over the nine single-well folds, in us/ft, beside the mean over three folds at k 3, seed 5:

| features | lambda | k 3, seed 5 | leave one well out |
| --- | --- | --- | --- |
| GR, RHOB, NPHI | 0 | 5.888677 | 5.495600 |
| GR, RHOB, NPHI | 10 | 5.826789 | 5.501614 |
| the logs and the four attributes | 100 | 6.773053 | 6.288507 |

Each mean is the arithmetic mean of the fold scores. Read the rows against each other. Under three folds the logs score 5.826789 at lambda 10 and 5.888677 at lambda 0, so lambda 10 is lower. Under leave one well out the order of those two is reversed: 5.495600 at lambda 0 and 5.501614 at lambda 10. Under both schemes the logs with the attributes at lambda 100 read higher than either row of the logs alone.

## What changes between the two schemes

Two things change at once. Each model in leave one well out trains on eight wells; each model at k 3 trains on six. And leave one well out has no seed: with one well per fold, every order of the shuffle gives the same folds. At k 3 the seed decides which wells share a fold, and another seed gives another mean.

The cost is nine fits where three folds need three. On nine wells that is nothing. On a field of hundreds of wells, and a model that is slow to fit, the count matters, and a smaller k is the usual answer.

## Two estimates, one question

Neither mean is the true error on a new well. Both are estimates, made on different folds, and small differences between two settings can reverse when the folds change, as the lambda 0 and lambda 10 rows show here. When two settings sit this close, the difference between them is not a reason to prefer one; a difference that holds under both schemes, like the attribute row sitting above both log rows, is firmer ground.

Quote the scheme with the number every time: "leave one well out over nine wells" or "k-fold by wells, k 3, seed 5".

## Exercise

Open the cross-validation view with GR, RHOB and NPHI and least squares. Set k to 9 and read the nine fold scores and their mean, 5.495600. Find the fold that tests EKENE-2 and the fold that tests EKENE-3 and compare them with the single-well scores above. Then switch the model to ridge, set lambda to 10, and confirm the mean of 5.501614. Write one sentence saying which lambda you would choose on these two runs, and why the choice is close.
