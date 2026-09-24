# Min-max scaling and rows outside the range

{{panel:ml-fit-explorer}}

Min-max scaling maps the training minimum of a feature to 0 and its training maximum to 1, with every training row landing in between. A new row is mapped with the same two numbers, and the engine does not clip it. A new row below the training minimum maps below 0; one above the training maximum maps above 1. Fitted on all nine sonic wells and applied to EKENE-6, the well with no sonic, it gives this.

| feature | training minimum | training maximum | EKENE-6 scaled minimum | EKENE-6 scaled maximum | EKENE-6 rows above 1 |
| --- | --- | --- | --- | --- | --- |
| GR | 21.200000 | 120.870000 | 0.320959 | 1.219324 | 4 |
| RHOB | 2.107000 | 2.734000 | 0.181818 | 0.925040 | 0 |
| NPHI | 0.183000 | 0.358000 | 0.057143 | 0.600000 | 0 |

## No clipping, on purpose

The engine's basis for min-max scaling states the rule as its clipping setting:

> none: a new row outside the training range maps outside [0, 1]

Clipping would pull those rows back to 1 and hide them. Left unclipped, a scaled value above 1 is the scaler telling you something useful: this row lies outside the range the model was fitted on.

## EKENE-6's gamma ray

EKENE-6 was drilled through a hot shale. Its gamma ray reads 30 gAPI higher on every sample than it would otherwise. On 4 of its 30 rows that lifts the gamma ray above the nine-well training maximum of 120.870000 gAPI, and min-max maps those rows above 1, the highest to 1.219324. Its density and neutron porosity stay inside the training range on every row.

A model applied to those 4 rows is being asked about gamma ray values it never saw. A least squares plane will return a prediction there without hesitation, because a plane has no edge. The scaled value above 1 is the flag that the prediction is an extrapolation.

## What the range check does not see

The hot shale raises the gamma ray on all 30 EKENE-6 rows. Only 4 of them leave the training range. The rest are raised by the same amount and still fall inside it, so min-max maps them between 0 and 1 and raises no flag. A range check can only see rows that leave the range. Whether a well inside the range is shifted is a question for other tools, and the Expert tier takes it up.

## A feature with no range

Min-max divides by the training range, maximum less minimum. If every training value is the same, the range is zero and the engine refuses the feature by name:

> X.CALI has zero range on the 2 training rows (every value is 3): min-max scaling would divide by zero, so drop the feature or fit on rows where it varies

As with the standard scaler, the refusal is about the rows it was fitted on.

## Choosing between the two scalers

A standard scaler reads in training standard deviations from the training centre, and it has no natural bounds. Min-max reads as a position inside the training range, which makes out-of-range rows easy to count. Both are fitted on the training rows only, and both are applied unchanged.

## Exercise

Open the fit explorer on the scaling view at the test fraction 0.3 and the seed 5. For each feature read the training minimum and maximum, and the counts of test rows above 1 and below 0. Change the seed to 1, 2 and 4 in turn and write down those counts for GR each time, with the test wells. Say which test wells, if any, carry rows outside the training range.
