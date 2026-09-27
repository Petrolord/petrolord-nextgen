# Proved, probable and possible

{{panel:prms-classification-calculator}}

Reserves have two ways of naming the same range. The cumulative names, 1P, 2P and 3P, each count everything up to that estimate. The incremental names, Proved (P1), Probable (P2) and Possible (P3), are the slices between them. Both describe one set of estimates, and the engine returns both (PRMS 2.2.2.2, 2.2.1.2, 2.2.2.8).

## The Ekene Main Reserves both ways

| cumulative | value (engine) | increment | value (engine) |
| --- | --- | --- | --- |
| 1P | 8.890000 | Proved (P1) | 8.890000 |
| 2P | 16.650000 | Probable (P2) | 7.760000 |
| 3P | 24.990000 | Possible (P3) | 8.340000 |

All figures are MMbbl. The Proved slice is the whole 1P. The Probable slice is what the 2P adds to the 1P: 16.650000 less 8.890000 is 7.760000. The Possible slice is what the 3P adds to the 2P: 24.990000 less 16.650000 is 8.340000.

## The engine's working

The engine prints the incremental form as a reason, with the two rules that tie the forms together:

> incremental: Proved (P1) 8.89, Probable (P2) 7.76, Possible (P3) 8.34 MMbbl; 1P = P1, 2P = P1 + P2, 3P = P1 + P2 + P3

Inside a reason the engine drops trailing zeros, so 8.890000 prints as 8.89. When you reason with a figure, take it from the table at six decimals.

## The words, used strictly

This course keeps the three words apart. "Proved" on its own means the cumulative 1P, the low estimate of Reserves. The slice is always written with its label, Proved (P1). "Probable" alone means 2P and its slice is Probable (P2); "possible" alone means 3P and its slice is Possible (P3). A report that says "the probable reserves are 7.76" leaves the reader guessing which is meant, so write the label every time.

## Why keep both forms

Different readers want different forms. A reader who wants the total at each level of confidence reads the cumulative form. An engineer looking at a new well may think in increments: how much this well adds to the probable slice. The engine accepts the estimates in either form and returns both, so nothing is lost in the change. At this tier you read the two forms side by side; the Professional tier builds one from the other and works through a zero slice.

## Only Reserves use these names

Proved, probable and possible belong to Reserves. Contingent Resources have their own slices, C1, C2 and C3, and Prospective Resources have none. The next lesson reads both.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The categories of a set of estimates", and start from "Ekene Main Reserves, stated cumulatively". Read the increments table below the cumulative one and check that each slice is the difference of two cumulative figures. Then change the "best estimate (stated)" control to a figure of your own between the low and the high, run it, and predict, before you look, which two increments change and which stays the same.
