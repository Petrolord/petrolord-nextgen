# Errors by horizon

{{panel:pf-backtest-explorer}}

A forecast used six months ahead should be judged six months ahead. The pooled row mixes one-step errors with six-step errors. The engine's `byHorizon` view separates them: it scores step 1 of every origin together, step 2 together, and so on, so each step ahead gets its own metrics.

## The teaching backtest by step ahead

Holt on EKENE-P1, first origin 24, horizon 6, step 6, refitted:

| step ahead | errors | ME | MAE | RMSE | MASE, m 1 |
| --- | --- | --- | --- | --- | --- |
| 1 | 4 | 4.776441 | 10.992423 | 11.060437 | 0.365737 |
| 2 | 4 | -0.602230 | 8.726945 | 9.247845 | 0.295972 |
| 3 | 4 | 9.044099 | 9.044099 | 12.325549 | 0.268086 |
| 4 | 4 | 0.790428 | 7.135803 | 8.307686 | 0.231002 |
| 5 | 4 | 9.511758 | 16.466929 | 17.941767 | 0.515369 |
| 6 | 4 | 15.833087 | 18.348056 | 20.961951 | 0.570926 |

Each row is the four errors of one step, one per origin. Step 1 is the four one-step forecasts made at origins 24, 30, 36 and 42; step 6 is the four six-step forecasts, for months 29, 35, 41 and 47.

## What the rows show

The step 6 MAE, 18.348056, is above the step 1 MAE, 10.992423. That fits the usual expectation that forecasts further ahead miss by more, and it is the one comparison here worth stating. The steps between do not rise in order: step 4 has the lowest MAE of all, 7.135803, below step 1.

Step 3 has an ME equal to its MAE, 9.044099: all four of its errors are positive, so holt forecast low at step 3 from every origin. Step 2's ME is close to 0 while its MAE is not, so its four errors point both ways.

## Four errors are a small sample

Each figure in that table rests on four numbers. One large miss at one origin moves a row a long way. The step 5 and step 6 rows are high partly because origin 24's errors at those steps are large, 26.355665 and 31.937659. Remove origin 24 and those two rows would move; add more origins and the zigzag between steps might smooth out, or might not.

So a by-horizon table with few origins is read for its broad shape, and no single row is quoted as the method's skill at that step. To say something firm about step 6, the backtest needs more origins: a smaller step, or an earlier first origin where the method allows it, adds forecasts to every row.

## Why read it at all

The pooled MAE of the teaching backtest is 11.785709. If the forecast will be used for next month's nomination, the step 1 row is the relevant one. If it will be used for a six-month plan, step 6 is. The by-horizon view lets the test match the use.

It also exposes a method whose pooled figure hides a problem far out. Two methods with the same pooled MAE can have very different step 6 rows, and the one that holds up further ahead is the one to trust for a long forecast.

## MASE by step

Each row's MASE scales every error by its own origin's Q, the same rule as the pooled MASE. So a by-horizon MASE compares across steps on a consistent footing, and it can be null for the same reason as the pooled one, which the last lesson of this module shows.

## Exercise

In the backtest explorer's errors-by-step view, run the teaching backtest and check the six rows. Then rerun it with step 3 in place of step 6 from the same first origin, and count the errors in each row. Say which rows changed most and whether the step 6 MAE is still above the step 1 MAE.
