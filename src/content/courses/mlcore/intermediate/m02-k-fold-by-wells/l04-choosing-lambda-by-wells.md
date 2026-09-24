# Choosing lambda by wells

{{panel:ml-validate-explorer}}

The first module tuned lambda on one split and found the lowest test RMSE at lambda 100 on three wells. That choice was a fact about EKENE-4, EKENE-5 and EKENE-8. The engine does not choose lambda, the features or the model: its own list of what it does not do says a course or an app makes that choice with the folds `groupKFold` returns, and prints the scores it compared. This lesson makes the choice that way.

## The comparison

Ridge on the nine sonic wells, k = 3, seed 5, test RMSE in us/ft for every fold and the arithmetic mean of the three:

| features | lambda | fold 0 | fold 1 | fold 2 | mean |
| --- | --- | --- | --- | --- | --- |
| GR, RHOB, NPHI | 0 | 6.779400 | 5.779067 | 5.107563 | 5.888677 |
| GR, RHOB, NPHI | 0.1 | 6.777391 | 5.778080 | 5.104793 | 5.886755 |
| GR, RHOB, NPHI | 1 | 6.762005 | 5.771086 | 5.082945 | 5.872012 |
| GR, RHOB, NPHI | 10 | 6.715438 | 5.776388 | 4.988542 | 5.826789 |
| GR, RHOB, NPHI | 100 | 7.268822 | 6.623012 | 5.511564 | 6.467800 |
| GR, RHOB, NPHI | 1000 | 9.780071 | 9.281985 | 8.071123 | 9.044393 |
| the logs and the four attributes | 0 | 8.257700 | 6.219752 | 8.466595 | 7.648016 |
| the logs and the four attributes | 0.1 | 8.253205 | 6.214259 | 8.457932 | 7.641799 |
| the logs and the four attributes | 1 | 8.214786 | 6.168122 | 8.382606 | 7.588505 |
| the logs and the four attributes | 10 | 7.954222 | 5.899421 | 7.789807 | 7.214483 |
| the logs and the four attributes | 100 | 7.818369 | 6.285660 | 6.215129 | 6.773053 |
| the logs and the four attributes | 1000 | 9.842359 | 9.144579 | 7.960841 | 8.982593 |

## Reading it

For the logs alone the lowest mean is 5.826789 us/ft, at lambda 10. For the logs with the attributes it is 6.773053, at lambda 100. No lambda tried brings the attribute set down to the logs alone at lambda 10: every attribute mean in the table is above 5.826789. Scored on wells the model has not seen, the four attributes never reach the best the logs do alone.

The one split pointed at lambda 100 for the attribute set, where it scored 5.759287 on three wells. Averaged over every well, the attribute set at lambda 100 reads 6.773053, above five of the six log rows.

## The one row where the attributes read lower

At lambda 1000 the attribute set reads 8.982593 against 9.044393 for the logs. That is no evidence for the attributes. A penalty that strong has shrunk every coefficient toward zero and every prediction toward the training mean. Both figures read higher than the logs at any lower lambda. Compare settings where the models are doing work.

## What a choice made this way means

The chosen setting, GR, RHOB and NPHI at lambda 10, is the lowest mean of twelve tried, on one set of folds. The gap between lambda 10 and lambda 0 for the logs, 5.826789 against 5.888677, is small, and the previous lesson showed that leave one well out reverses those two. The gap between the logs and the attribute set holds under both schemes. Report the grid you searched, k and the seed, and the mean you chose, so a reader can see how close the runner-up was.

The grid itself is part of the choice. Twelve settings were compared here, six lambdas on each of two feature sets, and every one of them was scored on the same three folds. A setting that was never tried cannot win, and a grid searched until something scores well has used the folds to choose, and the winning mean can then flatter the choice. Decide the grid before you look at the scores, and print all of it.

The fold mean of the chosen setting is also the expected error you carry forward: an estimate for a new well like the nine, quoted as "k-fold by wells, k 3, seed 5".

## Exercise

Open the cross-validation view, k 3, seed 5, model ridge. With GR, RHOB and NPHI, run lambda 0, 10 and 100 and confirm the three means. Add the four attributes and run lambda 100. Then change the seed to 2 and run the same four settings again. Write down the setting with the lowest mean at each seed, and say whether the attribute set ever beats the logs alone.
