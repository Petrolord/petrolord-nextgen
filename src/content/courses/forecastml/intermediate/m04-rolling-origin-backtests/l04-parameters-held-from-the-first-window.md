# Parameters held from the first window

{{panel:pf-backtest-explorer}}

The other setting of `refit` is false. The parameters are estimated once, on the first origin's window, and held at every later origin. It is cheaper and it asks a narrower question. This lesson runs it on the teaching backtest and sets the two side by side.

## One fit, held

The basis reads: "free parameters estimated on the first window and held at every later origin". Holt on EKENE-P1, first origin 24, horizon 6, step 6: the fit on months 0 to 23 gives alpha 0.684236 and beta 0.379743, and every origin carries those two values.

The state still moves. At each origin the level and the trend state b are run forward through every month of that origin's window, with the held alpha and beta, before the forecast is made. Only the parameters are frozen. So origin 42's forecast starts from where months 0 to 41 left the state, using weights chosen on months 0 to 23.

## Refitted and held, side by side

| refit | ME | MAE | RMSE | MASE, m 1 |
| --- | --- | --- | --- | --- |
| true | 6.558931 | 11.785709 | 14.083697 | 0.374515 |
| false | 6.596911 | 11.639525 | 13.997928 | 0.368974 |

The first origin's errors are identical in both runs, because at origin 24 both fit on months 0 to 23. The later origins differ, because their parameters differ. The difference in the pooled figures is small here, and the refitted parameters moved only a little from origin to origin.

On this well the held run scores slightly better by MAE, RMSE and MASE. That is one backtest on one well, and it is no evidence that holding is better in general. It is also no reason to prefer one; the two runs answer different questions.

## What each tests

Held parameters test one parameter set on later data. The question is: had these weights been chosen at month 23 and never touched, how would they have forecast the months after? That is useful when an analyst plans to fix the parameters and reuse them, or wants to see whether weights chosen early go stale.

Refitting tests the whole procedure, run as it would be each month. Both are honest, because at every origin only months before the origin were used, for the parameters and for the state. Neither is leakage. What must never happen is a parameter set chosen on months after the first origin and then held from it; the next lesson shows that route and what it does.

## Say which was run

A MASE of 0.374515 and one of 0.368974 are the same method on the same well and the same origins. Without the word refit beside them, a reader cannot tell which is which. The course's rule for a backtest note: name the first origin, the horizon, the step, and whether the parameters were refitted or held.

The setting takes true or false and nothing else. Anything else is refused:

> refit must be true or false

## Exercise

In the backtest explorer's rolling-origin view, run the teaching backtest with refit on and then off. Check that the origin 24 errors match and that later origins differ. Read the pooled metrics of both and write a one-line note for each that a reader could reproduce. Then repeat both runs on EKENE-P4, the noisy allocation, and say whether the gap between refitted and held grows or shrinks there.
