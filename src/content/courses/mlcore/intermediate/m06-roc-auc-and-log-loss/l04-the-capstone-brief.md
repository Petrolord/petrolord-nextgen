# The capstone brief

{{panel:ml-validate-explorer}}

The capstone for this tier grades six figures, and every one answers the Professional question: is this model validated, and how do you know?

| graded quantity | the module it rests on |
| --- | --- |
| a ridge coefficient of gamma ray, in original units | ridge and the bias-variance trade |
| the test RMSE of one fold of a k-fold by wells | cross-validation by wells |
| the optimism of a random-row split, in RMSE | leakage |
| a logistic coefficient of resistivity, per ohm.m | logistic regression |
| the F1 of pay | the confusion matrix and its ratios |
| a test log loss | ROC, AUC and log loss |

## What it grades and why

It grades validation quantities only. It grades no scaler parameter, least squares standard error or single-split R-squared, because those are the Associate question and the Associate capstone asks them. It grades no condition number, separation test, Newton trace, importance or learning curve, because those are the Expert question.

## The data are new

The capstone runs its own field, its own wells and its own stated settings. None of its values appears in any lesson, and none of the figures in this tier's lessons is a capstone answer. The Ekene wells, the teaching split, the pay split and the engine's small cases are worked examples. Use them to check your driving of the explorer.

## How to work it

Take each field in turn, decide which view it needs, and set that view exactly as the brief states before reading anything.

For the ridge coefficient, check lambda and the features. Lambda is on the sum of squares. The graded figure is in the feature's own unit, us/ft per gAPI, so read the original-unit column and leave the standardised one alone.

For the fold score, check k, the seed, the model and lambda. The engine numbers folds from 0 and deals the shuffled wells round robin, so read the fold the brief names by the engine's number.

For the optimism, check the features, the fraction and the seed. The engine's sign is group test RMSE less random-row test RMSE, so a positive figure means the random split flattered the model.

For the logistic coefficient, check the features, the penalty and which wells the split is drawn from. The graded figure is in log odds per ohm.m on the features as given.

For the F1, read the row of label 1, pay. The macro and weighted figures are different numbers.

For the log loss, check which rows are scored. It is the mean of natural-log charges on the test wells.

## Before you submit

Keep every figure at full precision until the end, and quote the numeric field the engine returns, never a figure lifted from a message. If a view refuses, read the refusal: it names the field it could not work with, and the fix is in the input.

## Exercise

Before you open the capstone, rerun the worked examples. In the ridge view confirm the test RMSE of 5.759287 at lambda 100 on the teaching split. In the cross-validation view confirm the fold 2 score of 5.107563 for GR, RHOB and NPHI by least squares, k 3, seed 5. Confirm the optimism of 11.687949 at seed 5 with the attributes, the RT coefficient of 0.241141, the F1 of pay of 0.923077 and the test log loss of 0.115676. For each of the six graded fields, write down which view and which setting you will check first.
