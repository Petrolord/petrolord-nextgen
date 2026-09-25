# One origin can leave a metric undefined

{{panel:pf-backtest-explorer}}

Each origin brings its own scale to the pooled MASE. So if one origin's scale cannot be formed, the pooled MASE cannot be formed either. EKENE-P3's plateau shows it at the first origin of a backtest.

## A backtest that starts on the plateau

EKENE-P3 was held at exactly 1500.000000 bbl/d for months 0 to 8. The backtest is damped, first origin 6, horizon 6, step 6. Its origins are 6, 12, 18, 24, 30, 36 and 42.

Origin 6 trains on months 0 to 5, all inside the plateau. Every month-to-month difference in that window is 0, so its Q is 0 and its `maseScale` is null. The other six origins have scales:

| origin | Q (bbl/d) |
| --- | --- |
| 6 | null |
| 12 | 18.163636 |
| 18 | 37.629412 |
| 24 | 38.791304 |
| 30 | 36.041379 |
| 36 | 35.505714 |
| 42 | 33.797561 |

## The pooled MASE is returned as null

With one origin unscaled, the overall MASE and every by-horizon MASE are returned as null, each with the reason:

> MASE is undefined: at origin 6 the training window has 6 values and the lag-1 naive forecast has zero in-sample error on them (every y[t] - y[t - 1] is 0), so the scale is 0

The reason names the origin. Every other metric of the backtest is a number: MAE 62.892091 and sMAPE 11.808809 among them. Nothing was refused.

## Why the origin is not skipped

Pooling the six scaled origins and quietly dropping origin 6 would describe a different backtest from the one asked for, and a reader would not know. The engine reports null with the origin named, and leaves the choice to the analyst.

## Choosing the origins

The analyst has two honest options. Report the backtest as run, with MASE null and its reason. Or start past the plateau and say so. From first origin 12 instead, every origin has a scale, and the overall MASE is 2.004154.

The second option is a new backtest with different origins, and it is described as one. Choosing the origins is part of the test, and a MASE is quoted with the first origin it came from.

## Not only plateaus

The same thing happens with any training window too short for the lag. With m 12, the first window needs more than 12 months, and a backtest whose first origin is 12 leaves that origin with no scale; the reason names the origin and the lag. The fix is the same: an earlier first origin cannot help, so start later, or use m 1.

## Exercise

In the backtest explorer's rolling-origin view, run damped on EKENE-P3 from first origin 6, horizon 6, step 6. Read the null MASE, its reason and the scale at each origin. Then move the first origin to 12 and check the pooled MASE. Finally, try first origin 9 and predict, before you run it, whether the pooled MASE will be a number.
