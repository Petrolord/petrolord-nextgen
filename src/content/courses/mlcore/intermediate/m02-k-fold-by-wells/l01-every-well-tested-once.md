# Every well tested once

{{panel:ml-validate-explorer}}

The teaching split holds out three wells, EKENE-4, EKENE-5 and EKENE-8, chosen by test fraction 0.3 and seed 5. Least squares on GR, RHOB and NPHI scored a test RMSE of 4.282693 us/ft on them. That is a true score on those three wells, and it is one draw. Another seed holds out other wells and gives another score. Cross-validation by wells replaces the single draw with a score on every well.

## The idea

Split the wells into k groups, called folds. Fit on every fold but one, score on the fold left out, and repeat until each fold has been left out once. Every well is then a test well exactly once, and every score comes from a model that never saw that well's rows. The engine's `groupKFold` builds the folds from well names, so a well is never divided between training and test.

## The Ekene folds

With k = 3 and seed 5 on the nine sonic wells:

| fold | test wells | test rows | training rows |
| --- | --- | --- | --- |
| 0 | EKENE-10, EKENE-2, EKENE-8 | 90 | 180 |
| 1 | EKENE-1, EKENE-4, EKENE-9 | 90 | 180 |
| 2 | EKENE-3, EKENE-5, EKENE-7 | 90 | 180 |

The engine numbers folds from 0. Each fold trains on the other six wells and tests on its own three.

## The scores

Least squares (ridge at lambda 0) on GR, RHOB and NPHI, test RMSE in us/ft:

| fold 0 | fold 1 | fold 2 | mean over the three folds |
| --- | --- | --- | --- |
| 6.779400 | 5.779067 | 5.107563 | 5.888677 |

The mean is the arithmetic mean of the three fold scores. It is 5.888677 us/ft, and the fold scores themselves range from 5.107563 to 6.779400. The teaching split's 4.282693 is a score on three particular wells; the fold mean is a score in which all nine wells take a turn.

## What the mean estimates

The mean over the folds is an estimate of the error on a new well like the nine. It still rests on assumptions. The new well must resemble the training wells in its logs and in the kind of offset it carries. The mean is also a number about this seed: another seed deals the wells into other folds and gives another mean. Quote it with k and the seed, as "k-fold by wells, k 3, seed 5".

## Why whole wells

Rows of one Ekene well share that well's sonic offset, so they are not independent test cases. A fold that split a well would score the model on rows whose offset it had already seen. The leakage module shows the size of that effect; here the rule is simply that a fold is a set of whole wells.

## Exercise

Open the validate explorer's cross-validation view with GR, RHOB and NPHI, least squares, k 3 and seed 5. Confirm the three fold test wells and the mean of 5.888677. Change the seed to 1 and read the new folds and the new mean. Write both means down with their seeds, and say in one sentence which of them you would quote for a new well, and what you would add beside it.
