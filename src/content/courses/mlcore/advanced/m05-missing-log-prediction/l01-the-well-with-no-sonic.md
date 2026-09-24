# The well with no sonic

{{panel:ml-diagnose-explorer}}

A missing log is a reason to fit a model to well data. A well was drilled without a sonic, or the sonic failed over an interval, and a sonic is needed for a synthetic seismogram, a pore pressure estimate or a rock physics model. This module takes one such well from start to finish: choose the features by whole wells, fit, check the new well against the training range, predict, and write the prediction back so that no one mistakes it for a measurement.

| Ekene sonic | wells | rows |
| --- | --- | --- |
| wells with a DT | 9 | 270 |
| the well with no DT, EKENE-6 | 1 | 30 |
| the whole field | 10 | 300 |

## EKENE-6

EKENE-6 has no sonic log: every one of its 30 DT samples is null. It carries GR, RHOB, NPHI, RT and CALI like every other well, so a model that predicts DT from those logs can be applied to it. The other nine wells carry a DT on all 270 rows.

The engine will not fit through the nulls. EKENE-6's first sample is row 150 of the 300 rows, counted from 0. Pass the forty rows from 130 to 169, the last twenty of EKENE-5 and the first twenty of EKENE-6, and least squares is refused at the twenty-first row passed, in the engine's own words:

> y[20] must be a finite number

The engine does not fill a missing value, and it does not drop one. Filling or dropping is the caller's decision, and here the decision is clear: EKENE-6 is the well to be predicted, so its rows never enter a fit.

## What this well is for, and what it cannot tell you

A real field offers no way to check a predicted log. If the sonic had been run, no one would need to predict it. The Ekene field is synthetic, and when it was built, the sonic drawn for EKENE-6 was kept apart from the rows, as `withheld`. This module reads it once, in its third lesson, to check the prediction. That is something no real field allows, and every place it is used says so.

EKENE-6 was also built with a stated hot shale: its GR reads 30 gAPI above what the rock alone gives, on every row. The third lesson shows what that does to a prediction, and why a range check catches only part of it.

## The steps, in order

1. Choose the features and lambda by whole wells, with the k-fold of the Professional tier.
2. Fit on every well that has the log.
3. Check the new well against the training range, row by row.
4. Predict.
5. On this synthetic field only, check against the withheld sonic.
6. Write the prediction back as a new channel with its method, its training wells, its expected error and its out-of-range rows.

Every step is a call to the engine, and the expected error of step 1 is the number the write-back carries.

## Exercise

Open the panel on the missing log view. The training table holds the nine sonic wells and the prediction table holds EKENE-6's GR, RHOB and NPHI. Before running anything, list which of the six steps the panel performs for you and which you must still do yourself. Then paste EKENE-6's rows with a DT column of nulls into the training table, run it, and copy the field the refusal names.
