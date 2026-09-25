# The damped forecast flattens

{{panel:pf-smoothing-explorer}}

The damped trend's h-step forecast is where phi shows plainly. Each step falls by less than the step before, by the same fraction every time, so the forecast curves toward a level instead of running down a line. This lesson reads that curve step by step on the teaching well.

## The h-step rule

The damped forecast from the final state is l_n + (phi + phi^2 + ... + phi^h) b_n. Step 1 adds phi b_n to the final level. Step 2 adds phi^2 b_n more, step 3 adds phi^3 b_n more, and so on. The change from one step to the next is therefore phi times the change before it.

## EKENE-P1 at phi 0.9

With alpha 0.5, beta 0.2 and phi 0.9, all given, the fit on EKENE-P1 ends at final level l_n 209.755413 and final trend b_n -3.843497. The first six steps:

| step h | damped forecast | change from the step before | change over change before |
| --- | --- | --- | --- |
| 1 | 206.296266 | -3.459147 | none |
| 2 | 203.183033 | -3.113233 | 0.900000 |
| 3 | 200.381124 | -2.801909 | 0.900000 |
| 4 | 197.859406 | -2.521718 | 0.900000 |
| 5 | 195.589859 | -2.269547 | 0.900000 |
| 6 | 193.547267 | -2.042592 | 0.900000 |

The first change is phi b_n, -3.459147, taken from the final level. Every later change is 0.9 times the one before, checked to 1.00e-9 on the steps shown. The ratio column is derived from the forecasts, and it reads phi straight back.

## Set beside Holt

Holt at the same alpha and beta on EKENE-P1 ends at final level 207.198880 and trend -5.798385, and its forecast falls by that trend every step: 201.400495 at step 1 and 137.618258 at step 12. The damped fit's final state differs from Holt's, because phi also shapes the recursion inside the series. Past the last month the difference grows with every step. The damped forecast at step 12 is 184.933594, well above Holt's line.

| step h | Holt, alpha 0.5, beta 0.2 | damped, alpha 0.5, beta 0.2, phi 0.9 |
| --- | --- | --- |
| 1 | 201.400495 | 206.296266 |
| 12 | 137.618258 | 184.933594 |

Neither number is a test of which is right. Both are in-sample fits projected forward, and the months that would settle it have not happened. What the table does show is how much of a twelve-month forecast rests on the choice of phi alone, with alpha and beta held the same.

## Reading the change column

The change column is how to recognise a damped forecast when you meet one. A straight line has a constant change. A flat forecast has a change of 0. A damped forecast has a change that shrinks by the factor phi at every step, and so its steps come ever closer together. If you are handed a forecast and a phi, divide one step's change by the step before and the ratio should be phi. If it is not, the forecast was not made by this method with that phi.

The same arithmetic tells you how fast the damping works. Each change is the first change times phi raised to one less than its step, so a phi near 1 fades slowly and a lower phi fades quickly. At a phi of 0.98 the fade is far slower than at 0.9, and over a year's steps the forecast stays nearer a straight line.

## Exercise

In the smoothing explorer choose "h-step forecasts", load EKENE-P1 and pick damped with alpha 0.5, beta 0.2, phi 0.9 and h 12. Read each step's change and divide it by the one before. Then set phi to 0.98 and to 0.8 and compare how quickly the changes shrink. Finally pick holt with the same alpha and beta and read its change column.
