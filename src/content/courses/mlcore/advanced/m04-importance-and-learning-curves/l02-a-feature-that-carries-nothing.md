# A feature that carries nothing

{{panel:ml-diagnose-explorer}}

Every importance table needs a control: a feature known to carry nothing, to show what nothing looks like. The Ekene wells have one by construction. The caliper, CALI, was drawn independently of every other channel when the synthetic field was built, so it carries no sonic signal. That is a statement about how the field was made, and no real field offers it. This lesson reads CALI's importance and what a drop near zero means.

| CALI, seed 5, 5 repeats | drop in test RMSE (us/ft) |
| --- | --- |
| repeat 1 | -0.029560 |
| repeat 2 | -0.006560 |
| repeat 3 | -0.051118 |
| repeat 4 | -0.000415 |
| repeat 5 | -0.072004 |
| mean | -0.031931 |
| SD over the repeats (population) | 0.026894 |

## CALI ranks last

On the teaching setting, OLS on GR, RHOB, NPHI and CALI fitted on the training wells and scored by RMSE on the 90 test rows, CALI ranks last with a mean drop of -0.031931 us/ft. GR, NPHI and RHOB drop by 4.747694, 3.786311 and 1.754752. The planted structure is found: the feature that was drawn with no link to the sonic is the one whose shuffle costs the model least.

## A drop below zero

All five of CALI's drops are negative, and so is the mean. A negative drop means that on that repeat the shuffled CALI gave a slightly lower test RMSE than the real CALI: a drop near zero can come out slightly negative when a shuffle happens to help. The engine prints the drop as it is and never clips it to zero, because the sign is information: on these test rows, shuffling CALI cost the model nothing.

Read a drop near zero against its spread. CALI's mean of -0.031931 sits beside an SD of 0.026894 over the 5 repeats, and both are small next to RHOB's mean drop of 1.754752. That comparison is what tells you CALI is doing nothing useful in this model; the sign of its mean alone would not.

## What a feature that carries nothing costs

A feature with no signal still gets a coefficient in least squares, and it spends a residual degree of freedom. The larger cost is in the model note: a feature in the model is a feature someone will ask about, and a feature you cannot defend is one you should not carry. The missing-log module scores the logs with and without CALI on whole wells, and at each lambda tried there the mean test RMSE without it is the lower.

## Importance is not the rock

The way the synthetic field was built is the only reason we know CALI carries nothing. On a real field you would not know, and a near-zero importance would be the evidence. Even then, importance describes this fitted model on these rows with this seed: a feature can carry information the model did not use, and a feature can be used by the model for reasons the rock does not share.

## Exercise

Open the panel on the importance view with the teaching defaults. Run it and confirm CALI's mean drop of -0.031931 and its place in the ranking. Then add a column of your own to the table filled with numbers you choose with no relation to DT, include it in the features, and run again. Write down its mean drop and SD, and compare them with CALI's.
