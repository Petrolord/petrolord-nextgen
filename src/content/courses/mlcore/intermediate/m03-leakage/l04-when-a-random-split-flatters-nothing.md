# When a random split flatters nothing

{{panel:ml-validate-explorer}}

The last two lessons could leave a simple rule in mind: a random-row split always makes a model look better. On the Ekene wells that rule is false, and the reason matters.

## The same demonstration, on the logs alone

Least squares on GR, RHOB and NPHI only, the nine sonic wells, test fraction 0.3, seeds 1 to 12, RMSE in us/ft. Optimism is group test RMSE less random-row test RMSE, as before:

| seed | random-row test RMSE | group test RMSE | optimism |
| --- | --- | --- | --- |
| 1 | 5.702123 | 5.654181 | -0.047942 |
| 2 | 5.004763 | 5.765483 | 0.760720 |
| 3 | 5.342215 | 6.424610 | 1.082396 |
| 4 | 5.426921 | 4.422634 | -1.004287 |
| 5 | 6.030242 | 4.282693 | -1.747549 |
| 6 | 5.918072 | 5.107563 | -0.810509 |
| 7 | 5.451041 | 3.939971 | -1.511070 |
| 8 | 5.528424 | 3.689898 | -1.838526 |
| 9 | 4.883177 | 6.103383 | 1.220206 |
| 10 | 4.997075 | 3.906451 | -1.090624 |
| 11 | 5.334782 | 5.895284 | 0.560501 |
| 12 | 4.998096 | 6.254313 | 1.256217 |

The optimism is negative on 7 of the 12 seeds and positive on the other 5. At seed 5 the random-row split reads 6.030242 and the group split 4.282693: the random split made the model look worse.

## Why there is no leak here

Rows of one well still fall on both sides of the random split; at seed 5 all nine wells do. What is missing is a path. Every Ekene well carries its own sonic offset, and no log in GR, RHOB and NPHI names the well it came from. The model cannot learn a well's offset from its training rows, because nothing in the features tells it which well a test row belongs to. With no way to use the shared wells, sharing them does nothing, and the random-row score is neither systematically better nor worse than the group score. Its sign follows the draw of test wells.

Leakage needs a path from the test rows' identity to the prediction. Rows of one well on both sides are the opportunity; a feature that names the well is the path.

## Teach both cases, and keep the rule

Put the two tables side by side. With the attributes the optimism is positive on 12 of 12 seeds; with the logs alone it is negative on 7. The split was the same in both. The features decided whether it leaked.

This does not make random-row splits safe for the logs. On a real field you do not know in advance that no feature carries a well's identity: a log can carry a tool calibration, a borehole effect or a mud system that is constant down one well. The honest way to score a model for a new well is the one the engine names in its own words: "groupSplit(testFraction, seed): whole wells held out; the honest estimate for a new well". A random split that happens to flatter nothing is not evidence that it is safe; it only failed to find a path this time.

## What the swings do tell you

On the logs alone the group test RMSE runs from 3.689898 at seed 8 to 6.424610 at seed 3, depending on which three wells are held out. That spread is the reason the previous module averaged over folds. A single group split is honest about the wells it holds out, and it is still one draw.

## Exercise

Open the random-row against well split view, remove the four attributes so the features are GR, RHOB and NPHI, and keep fraction 0.3. Run seeds 5, 8, 9 and 12 and confirm the optimism for each. Then add back only mudWeight and run the same four seeds. Write down, for each seed, the sign of the optimism with and without mudWeight, and say in one sentence what that one feature changed.
