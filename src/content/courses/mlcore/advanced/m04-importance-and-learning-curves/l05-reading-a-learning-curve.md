# Reading a learning curve

{{panel:ml-diagnose-explorer}}

{{panel:ml-fit-explorer}}

The previous lesson built the Ekene learning curve. This one reads it: what the gap between the two scores says, what the shape of the test score says about whether more wells would help, and why this curve does not fall at every step.

| training wells m | training RMSE (us/ft) | test RMSE (us/ft) |
| --- | --- | --- |
| 1 | 2.749195 | 6.766479 |
| 2 | 4.351546 | 4.756657 |
| 3 | 4.346620 | 4.385966 |
| 4 | 4.482803 | 4.761367 |
| 5 | 5.696182 | 4.205658 |
| 6 | 5.758010 | 4.282693 |

## Two scores that answer different questions

The training score is the fit to wells the model has seen. The test score is the error on wells it has not, which is the one a new well will meet. At one training well they are far apart: 2.749195 on EKENE-2's own rows against 6.766479 on the test wells. A model fitted to one well is fitted to that well's rows, its own offset included. As wells are added the training score rises, to 5.758010 at six wells: the fit now spans several wells' offsets.

## Test can beat training

At six wells the test RMSE, 4.282693, is below the training RMSE, 5.758010. The Associate tier met this on the teaching split: the three test wells happen to sit close to the fitted plane. It is one draw of wells, and a reason never to read a single test score as the model's error on every new well.

## The shape of the test score

A test score still falling at the last point says more wells would help. A flat one says the features, the model or the well-to-well offsets now set the error.

The Ekene test RMSE does not fall at every added well. It falls from 6.766479 to 4.756657 and then to 4.385966, rises to 4.761367 when EKENE-10 is added, falls to 4.205658 with EKENE-9, and reads 4.282693 with EKENE-7. The order of the wells is the shuffle's, and a well with a large offset added early or late moves the curve. Which well moved it, and why, is a question the curve raises and does not answer.

So this curve is no smooth decline, and it should never be read as one. After the first well, its test RMSE stays between 4.205658 and 4.761367 as wells two to six are added. Whether you call that flat is your reading, and you state it with the six points beside it.

## What to do with the reading

If you read it as flat, the rule above points at the features, the model or the offsets. On the Ekene wells each well's sonic offset is planted, and a prediction from the logs cannot know it. On a real field, what sets each well's offset is a question to take to the geology.

## Exercise

Open the diagnose panel on the learning view with the teaching defaults and confirm the six points. Then run it at seed 1 and at seed 2, and write down each curve's test wells, training order and test RMSE at every count. Mark the step at which each curve's test RMSE rises, if it does, and name the well added at that step. Last, open the fit panel's least squares view at seed 1, fraction 0.3, and compare its test RMSE with the last point of your seed 1 curve.
