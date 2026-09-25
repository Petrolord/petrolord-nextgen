# Writing up a backtest

{{panel:pf-backtest-explorer}}

Every figure in this tier changed when a setting changed: the months, the origins, the horizon, the step, refit or held, the lag m, the metric. A note that leaves one out cannot be checked.

## What a backtest note names

The note names, in order:

- the well and the months used;
- the methods tested;
- the first origin, the horizon and the step, and so the origins;
- whether the parameters were refitted at every origin or held from the first window;
- each metric, with the reason from `notes` for any metric returned as null;
- MASE with its lag m;
- the order of the methods and the metric it is by.

## A note for the teaching backtest

Holt on EKENE-P1, all 48 months. First origin 24, horizon 6, step 6: origins 24, 30, 36 and 42, 24 errors. Parameters refitted at every origin. Pooled: ME 6.558931, MAE 11.785709, RMSE 14.083697 bbl/d; MAPE 4.002905 and sMAPE 4.065956 percent; MASE 0.374515 at m 1, each origin scaled by its own training window. By step ahead, MAE 10.992423 at step 1 and 18.348056 at step 6, four errors each. With parameters held from the first window instead, MASE is 0.368974.

## A note with a metric returned as null

Damped on EKENE-P3, all 48 months. First origin 6, horizon 6, step 6: origins 6 to 42. Parameters refitted (refit true, the default). MAE 62.892091 bbl/d, sMAPE 11.808809 percent. MASE returned as null, with the reason:

> MASE is undefined: at origin 6 the training window has 6 values and the lag-1 naive forecast has zero in-sample error on them (every y[t] - y[t - 1] is 0), so the scale is 0

From first origin 12, past the plateau, MASE is 2.004154.

The null is reported with its reason, and the second figure is labelled as a different backtest.

## A note for a comparison

EKENE-P2, all 48 months, after the workover. Methods ses, holt, damped and the Arps baseline, on the same origins: first origin 28, horizon 6, step 3, origins 28, 31, 34, 37 and 40. Refit true, the comparison's default. Order by MASE at m 1: holt 0.571171, damped 0.599131, arps 0.605968, ses 0.789324. From first origins 26, 30 and 32 a smoothing method still comes first, but which one changes, so no single best smoothing method is claimed.

## What a note leaves out

A note does not say "holt is accurate" or "the forecast is good". The course's rule is that any statement of how good a forecast is names its metric and its months. It also never mixes figures from different runs without saying so: a hold-out MASE and a backtest MASE of the same method are different tests.

A note also stays inside what was tested. A backtest on months 0 to 47 says how the method would have done on those months, and the note does not stretch it to months 48 on.

## Exercise

In the backtest explorer, run holt on EKENE-P4 from first origin 24, horizon 6, step 6, refitted and then held. Write the note for it in the form above, naming every item on the list. Then ask someone to reproduce one figure from the note alone, and if they cannot, find what it left out.
