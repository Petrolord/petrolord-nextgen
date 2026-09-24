# Scaling can leak too

{{panel:ml-validate-explorer}}

Leakage does not need a feature. A preparation step fitted on every row has already seen the test rows, and whatever it learned from them travels into the model. The commonest case is a scaler. This lesson shows why its effect can be small and the procedure still wrong.

## When scaling changes nothing

For least squares with an intercept, rescaling a feature changes the coefficients and leaves the fitted plane where it was. The Associate tier checked this on a held-out well: the predictions from standardised and unscaled features differed by at most 1.42e-14 us/ft, which is rounding. So a scaler fitted on all rows cannot move a least squares prediction. Ridge in this engine re-standardises on the rows it is given, so it too is protected from a scaler fitted outside it.

A penalty on standardised features is different. The penalty is charged per standardised unit, so the scale decides how hard each coefficient is pulled, and the scale was set by the rows the scaler saw.

## The Ekene case

The label is PAY from the stated rule, and the model is logistic regression with an L2 penalty of 1 on RHOB, NPHI and RT, which the next module fits and reads in full. The pay teaching split holds out EKENE-3, EKENE-5 and EKENE-7 from all ten wells. The features are standardised twice, once with a scaler fitted on the training wells and once with a scaler fitted on all ten, and each version is scored by log loss on the three test wells:

| scaler fitted on | RT centre | RT scale | RT coefficient (per scaled unit) | test log loss |
| --- | --- | --- | --- | --- |
| the training wells only | 14.045286 | 16.599700 | 3.129011 | 0.126480 |
| all ten wells | 13.691967 | 16.255862 | 3.083215 | 0.126152 |

The scaler fitted on all ten wells moved the RT centre and scale, the penalised coefficient changed with them, and the test log loss moved by -3.28e-4, all wells less training wells. Lower log loss is better.

## Small, and still a defect

A difference of -3.28e-4 is small on these data, and it happens to favour the leaked version. Neither fact makes the procedure acceptable. The test wells shaped the transform the model was trained through, so the test rows had already reached the model in one form before it was scored.

## The rule

Fit every preparation step on the training rows only, and apply it unchanged to the test rows: scalers, fills, feature choices, and lambda itself. Inside cross-validation that means inside each fold, refitted on that fold's training wells. The engine's scalers make the right way the default: they fit on the rows passed or the rows `trainIndices` lists, and apply those parameters unchanged.

## Exercise

Open the ridge view on the teaching split with the seven default features and lambda 10. Divide the standardised GR coefficient by the original-unit one: the result is the scale the ridge fit used for GR. Compare it with the training-row population standard deviation of GR, 22.375203, and with the all-row figure the Associate tier printed, 21.363430. Write one sentence saying which rows the ridge fit standardised on.
