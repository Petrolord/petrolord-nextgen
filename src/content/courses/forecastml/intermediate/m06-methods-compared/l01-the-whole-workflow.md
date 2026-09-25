# The testing workflow in order

{{panel:pf-backtest-explorer}}

This tier has built its tools one at a time: errors, percentage errors, the scaled error, the rolling origin and its pooling. This lesson runs them in order on EKENE-P1 as one piece of work, with every figure the engine's.

## The six steps

| step | what is run | what it returns on EKENE-P1 |
| --- | --- | --- |
| 1 | read the series | 48 months, no missing month |
| 2 | a hold-out: fit on months 0 to 35, score months 36 to 47 | MASE, m 1: ses 1.842825, holt 0.241874, damped 0.534086 |
| 3 | a rolling-origin backtest of holt, first origin 24, horizon 6, step 6 | MASE 0.374515 refitted, 0.368974 held |
| 4 | the same backtest by step ahead | MAE 10.992423 at step 1, 18.348056 at step 6 |
| 5 | every method and the Arps baseline on the same origins, first origin 30, horizon 6, step 3 | by MASE: arps, damped, holt, ses; arps MASE 0.199862 |
| 6 | write it up | the next lessons |

## Steps 1 and 2: the series, then one honest test

The series is checked before anything is fitted: a missing month is refused by name, and a shut-in or a plateau is noted, because both change what the metrics can say. The hold-out then gives each method one out-of-sample test. On EKENE-P1 holt leads by MASE, and ses, whose flat forecast sits above the decline, is above 1.

## Steps 3 and 4: many origins, then the steps

One hold-out is one origin. The backtest repeats it from origins 24, 30, 36 and 42, pools 24 errors and scales each by its own origin's Q. Refitted and held give nearly the same MASE here, and the note says which was run. The by-step view shows that step 6 misses by more than step 1, with only four errors behind each row.

## Step 5: the same origins for every method

The comparison backtests ses, holt and damped and an Arps decline baseline on the same origins, with the same horizon and the same metrics, and orders them by MASE unless told otherwise. The Arps baseline is imported from the decline curve engine; the decline curve analysis course teaches Arps itself, and the Expert tier takes the ordering rules and the baseline apart.

On EKENE-P1, from first origin 30, horizon 6, step 3, the order by MASE is arps, damped, holt, ses, with arps at 0.199862. EKENE-P1 was drawn from an Arps curve when the synthetic field was built, so the Arps baseline fitting it best is expected. It says a smoothing method has not earned its place on this well against the decline curve.

## Why the order of the steps matters

Each step uses what the one before produced, and each widens the test. A method that looks good in-sample is tested out-of-sample; one that passes one hold-out is tested from many origins; one that passes on pooled figures is checked step by step; and the winner among smoothing methods is set beside a baseline. Stopping early is allowed only if the note says where it stopped.

The steps also keep the future out. At every origin, in every step, the parameters, the state and the scale come from months before the origin only.

## Exercise

Run steps 2 to 4 yourself in the backtest explorer on EKENE-P4, the noisy allocation: the hold-out, the teaching backtest's layout with holt, and the by-step view. For step 5, run a backtest of each of ses, holt and damped from first origin 30, horizon 6, step 3, and order the three by MASE. Write down the figure each step produces, and say whether the order of the smoothing methods on EKENE-P4 matches their order on EKENE-P1.
