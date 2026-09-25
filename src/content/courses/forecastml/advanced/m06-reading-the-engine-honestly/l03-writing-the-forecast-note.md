# Writing the forecast note

{{panel:pf-uncertainty-explorer}}

{{panel:pf-backtest-explorer}}

Every figure in this tier arrives with conditions: a method and parameters, origins and a horizon, a seed and a number of paths, a metric and its lag. A forecast note is where those conditions are written down, so that someone else can reproduce every number in it and knows what it claims.

## What the note names

A forecast note from this engine names, in order:

- the well and the months fitted;
- the method and each parameter, fitted or given, with any bound it sits on;
- the backtest that tested it: its origins, horizon and step, and whether the parameters were refitted;
- its MASE with the lag m, beside the Arps baseline's on the same origins, and the ranking with the metric it is by;
- the intervals, with method, nSims, seed and nonNegative, and the P90 read as the low case;
- every metric the engine could not give, with its reason from `notes`.

Leave one out and a figure in the note cannot be checked.

## A note on EKENE-P1, from the course's figures

- Well: EKENE-P1, months 0 to 47, monthly oil rate in bbl/d. The field is synthetic, and this well was drawn from an Arps curve.
- Method: damped, alpha 0.657029, beta 0.353869 and phi 0.960949, all fitted, none on a bound, the search converged.
- Test: compared with ses, holt and the Arps baseline from first origin 30, horizon 6, step 3, refit and m left at their defaults, ranked by MASE: arps, damped, holt, ses. Arps MASE 0.199862. Damped ranks second, behind the baseline.
- Intervals: damped, seed 11, 1000 paths, nonNegative true. Step 1: P90 (low) 174.139087, P50 206.724356, P10 (high) 225.708211 bbl/d. Step 12: P90 (low) reported as 0, P50 137.469798, P10 (high) 324.803671. The damped point forecast at step 12 is 169.556510.
- Finding: the Arps baseline ranks first on this well. The damped method has not earned its place on EKENE-P1.

Every figure above is one the course prints, with its conditions. The note also shows what it does not have: damped's own MASE in that comparison is not among the course's figures, so the note gives the ranking and the Arps figure alone. From the panels you will have every row's figure; give them all.

## What the note never does

It never gives a figure without its conditions. It names every method by what it is: exponential smoothing, the residual bootstrap, the least-squares Arps fit. It never writes P90 without the case beside it. It never reports a smoothing method's metrics without the Arps row. And it never leaves out a null metric: MAPE through a shut-in month is written as null, with the engine's reason.

## Exercise

Write a full forecast note for EKENE-P4. In the backtest explorer, run "A rolling-origin backtest" with damped from first origin 24, horizon 6 and step 6, refitted, and record its origins and MASE with m. In the uncertainty explorer, run "Methods ranked against Arps" on the same origins, and "Bootstrap intervals" with damped, h 12, a seed of your choice and 1000 paths. Assemble the note item by item, and end it with one sentence on whether damped earned its place on this well.
