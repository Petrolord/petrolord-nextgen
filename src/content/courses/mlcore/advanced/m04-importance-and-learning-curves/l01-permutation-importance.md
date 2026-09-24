# Permutation importance

{{panel:ml-diagnose-explorer}}

A coefficient has a unit, and its size says nothing about how much a feature matters until the feature's spread is known. Permutation importance measures that directly, on a fitted model. It asks how much worse the model scores when one feature's values are shuffled across the rows, which breaks that feature's link to the target and keeps its distribution. In this course importance always means that loss of score, for this fitted model, on these rows, with this seed and these repeats.

| feature | mean drop in test RMSE (us/ft), seed 5, 5 repeats | SD over the repeats (population) |
| --- | --- | --- |
| GR | 4.747694 | 0.315115 |
| NPHI | 3.786311 | 0.323271 |
| RHOB | 1.754752 | 0.112173 |
| CALI | -0.031931 | 0.026894 |

## The setting, stated in full

The model is OLS on GR, RHOB, NPHI and CALI, fitted on the training wells of the teaching split: test fraction 0.3, seed 5, test wells EKENE-4, EKENE-5 and EKENE-8. It is scored on the 90 test rows by RMSE. Unshuffled, the baseline test RMSE is 4.309962 us/ft. Then each feature in turn is shuffled across those 90 rows, the model predicts again without being refitted, and the RMSE is read. That is done 5 times per feature, with seed 5 for the permutation stream.

## The drop and its sign

For RMSE the drop is the permuted RMSE less the baseline RMSE, so it is positive when the feature matters: shuffling it makes the predictions worse. The engine's basis states it: "permuted rmse - baseline rmse (positive when the feature matters)". For a metric where higher is better, such as AUC, the drop is the baseline less the permuted score, which is again positive when the feature matters. One sign for every metric is a choice the engine states; the common alternative is to report the raw permuted score and leave the sign to the reader.

Shuffling GR raises the test RMSE by 4.747694 us/ft on average over the 5 repeats. NPHI raises it by 3.786311 and RHOB by 1.754752. The ranking, largest mean drop first, is GR, NPHI, RHOB, CALI.

## Importance on a classifier

The same call works on the Professional tier's pay model, scored by AUC on its test wells, baseline 0.997475. The mean drops read RT 0.398232 (SD 0.015727), RHOB 0.019823 (SD 0.009850) and NPHI 0.001263 (SD 0.001056), ranking RT, RHOB, NPHI. Quote each with its metric: an AUC drop and an RMSE drop are in different units and never compared.

## What importance describes

Importance is measured on the rows scored, here the test wells, and it describes the fitted model: a feature the model leans on, whether or not the rock does. If a feature is shuffled and the model's predictions barely change, the model was not using it much. That says nothing about whether the feature carries information a different model might use, and nothing about cause.

The model is not refitted when a feature is shuffled. Permutation importance asks what this model does without this feature's information, and it answers that question only.

## Exercise

Open the panel on the importance view. The defaults are the teaching setting: the sonic rows, GR, RHOB, NPHI and CALI, test fraction 0.3, split seed 5, 5 repeats and permutation seed 5. Run it and confirm the baseline test RMSE of 4.309962 and GR's mean drop of 4.747694. Then remove CALI from the features, run it again, and write down the new baseline and the ranking.
