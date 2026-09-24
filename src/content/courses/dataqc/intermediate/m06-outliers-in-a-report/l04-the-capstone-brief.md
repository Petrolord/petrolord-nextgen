# The capstone brief

{{panel:dq-outliers-explorer}}

The capstone for this tier grades six figures, and every one answers the Professional question: which values stand apart, and by which measure?

| graded quantity | the module it rests on |
| --- | --- |
| the largest absolute z-score on a set of core plugs | the z-score and its ceiling |
| the largest absolute modified z-score on the same plugs | the median and the MAD |
| an upper Tukey fence on a density interval | quartiles and Tukey fences |
| a Hampel threshold at one entry of a density log | a moving window |
| a Grubbs critical value | formal tests and many variables |
| the largest squared Mahalanobis distance on a density and neutron cloud | formal tests and many variables |

## What it grades and why

It grades plausibility quantities only. It grades no completeness, range or index check, because those are the Associate question and the Associate capstone asks them. It grades no chart and no scorecard, because whether a process has changed is the Expert question. Each tier's capstone grades its own question, so no lesson in one tier hands out another tier's answer.

## The data are new

The capstone runs its own well and its own data. None of its values appears in any lesson, and none of the figures in this tier's lessons is a capstone answer. The EKENE-3 gauge, the EKENE-7 core plugs, the water sand gamma ray and the oil sand density and neutron are worked examples. Use them to check that you are driving the explorer correctly, then work the capstone's own figures from its brief.

## How to work it

Take each field in turn, decide which view it needs, and set that view exactly as the brief states before reading anything.

For the two plug figures, type the plugs into the z view and the modified z view. The z view defaults to the sample standard deviation; if the brief says otherwise, switch it, and remember that the ceiling moves with the choice. The modified z uses 0.6745 as printed, and the engine's figure is the one graded.

For the fence, check the quartile rule and k. R7 and 1.5 are the defaults, and a fence built on R6 or R8 is a different number.

For the Hampel threshold, check halfWindow and nSigma, find the entry the brief names, and read the threshold the engine returns for that entry's window. Count entries from 0, as the engine does, and remember that missing values never enter a window.

For Grubbs, check alpha and the side. The critical value depends on n, alpha and the side only.

For the Mahalanobis distance, enter the two channels as the brief gives them. Rows with a missing value are skipped, and the largest squared distance is read from the rows used.

## Before you submit

Keep every figure at full precision until the end, and quote the numeric field the engine returns, never a figure lifted from a reason sentence. If a view refuses, read the refusal: it names the field it could not work with, and the fix is in the input.

## Exercise

Before you open the capstone, rerun two worked examples through the explorer. Confirm the core plugs' largest absolute z of 2.985356 and modified z of 5.890633, and the oil sand's squared distance of 22.397696 at entry 60 with the cutoff of 7.377759. For each of the six graded fields, state which view and which setting you will check first.
