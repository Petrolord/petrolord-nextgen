# Residual moveout

An NMO-corrected gather should be flat at its target. Residual moveout measures how far each offset's event sits from flat, fits one curve through those shifts, and reports one number per gather: the residual at the far offset, the figure a QC map shows.

## The measure

`residualMoveout` builds a pilot by stacking a stated number of the nearest traces, three here. For each offset it finds the shift of the event against the pilot, as the lag of largest absolute correlation within a window: a half window of 40 ms about the event and a largest shift of 24 ms, both stated. Offsets whose correlation is at least 0.7 in size enter a fit dt = a x^2, weighted by the squared correlation, and the residual at the far offset is a x_far^2.

When the fitted lags scatter about the parabola by more than one sample, the waveform itself has changed with offset. The engine then measures by AB semblance and reports the method as ab-semblance.

## Gather 5 about the top

| quantity | value |
| --- | --- |
| method | ab-semblance |
| offsets used | 13 |
| offsets fitted | 13 |
| far offset, m | 2500.000000 |
| residual at the far offset, ms | 2.795940 |
| lags of the last three offsets, ms | -24.000000, -24.000000, -24.000000 |
| their correlations | -0.776230, -0.728225, -0.786646 |

## Reading gather 5

The last three offsets sit at the search limit of 24 ms, and their best match to the pilot is a negative correlation, each above 0.7 in size. The engine counts the size of the correlation, so a reversed match qualifies. With all 13 offsets in the fit the lags scatter about the parabola by more than a sample, so the engine changes to AB semblance. The lag measure has found the far traces unlike the near ones; the semblance measure then gives a residual of 2.795940 ms.

## Every pack gather

| gather | inline | crossline | top picked ms | method | offsets fitted | far-offset residual ms |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 1026 | 2050 | 1292.000000 | ab-semblance | 13 | 2.939718 |
| 1 | 1026 | 2051 | 1292.000000 | ab-semblance | 13 | 2.819016 |
| 2 | 1026 | 2052 | 1292.000000 | ab-semblance | 13 | 2.894457 |
| 3 | 1026 | 2053 | 1292.000000 | ab-semblance | 13 | 3.002917 |
| 4 | 1027 | 2050 | 1292.000000 | ab-semblance | 13 | 2.844287 |
| 5 | 1027 | 2051 | 1292.000000 | ab-semblance | 13 | 2.795940 |
| 6 | 1027 | 2052 | 1292.000000 | ab-semblance | 13 | 2.950494 |
| 7 | 1027 | 2053 | 1292.000000 | ab-semblance | 13 | 2.949581 |
| 8 | 1028 | 2050 | 1292.000000 | ab-semblance | 13 | 2.824094 |
| 9 | 1028 | 2051 | 1292.000000 | ab-semblance | 13 | 2.862656 |
| 10 | 1028 | 2052 | 1292.000000 | ab-semblance | 13 | 2.953658 |
| 11 | 1028 | 2053 | 1292.000000 | ab-semblance | 13 | 2.931752 |

## Reading the map

Every gather picks its top at 1292.000000 ms, every one changes to AB semblance, and every one fits all 13 offsets. The residuals run from 2.795940 ms at gather 5, the gather at Ekene-1, to 3.002917 ms at gather 3, and every one is below the 4.000000 ms sample interval.

## What it means for the two questions

For data quality, a far-offset residual under one sample on every gather says the top lies within a sample of flat out to the far offset. That every gather needed AB semblance says something else: the waveform changes with offset at the top, and a study reading AVO here records it.

For the fluid question, a change of waveform with offset is what AVO measures. The QC does not decide whether that change is the rock or the processing; the comparison at the wells takes that up.

{{panel:qi-prestack-explorer}}

## Exercise

In the prestack explorer, set Data to "Ekene teaching pack" and View to "Gathers and their QC", with Gather at gather 5 and Event near at 1289 ms. Set Pilot traces, nearest to 3, Moveout half window to 40 ms and Moveout largest shift to 24 ms; the explorer holds the 0.7 correlation floor fixed. Read the four moveout tiles and every offset's lag and correlation. Raise the largest shift and see whether the last three lags leave the limit. Then step Gather through all 12 gathers and sketch the residual on a map of inline against crossline.
