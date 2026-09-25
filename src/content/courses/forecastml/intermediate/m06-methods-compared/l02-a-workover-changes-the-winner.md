# A workover changes the winner

{{panel:pf-backtest-explorer}}

EKENE-P2 was shut in for months 22 to 24, counted from 0, and a workover lifted its rate by 45 percent from month 25 on. The same four methods, tested the same way before and after, finish in a different order. This lesson reads both comparisons and what changed.

## Before the shut-in

The comparison runs on months 0 to 21 only, with origins 10, 13, 16 and 19 and horizon 3. Every method is backtested on those origins with the same horizon and metrics:

| method | MAE | MAPE | sMAPE | MASE |
| --- | --- | --- | --- | --- |
| ses | 46.858333 | 9.796323 | 9.211623 | 1.006754 |
| holt | 22.412654 | 4.616605 | 4.703456 | 0.483573 |
| damped | 23.269948 | 4.897800 | 4.747889 | 0.504549 |
| arps | 17.012466 | 3.702719 | 3.768663 | 0.389192 |

By MASE the order is arps, holt, damped, ses. Before the shut-in EKENE-P2 is a plain decline, and the Arps baseline follows it best.

## After the workover

The comparison runs on all 48 months, with origins 28, 31, 34, 37 and 40 and horizon 6, all after the restart:

| method | MAE | MAPE | sMAPE | MASE |
| --- | --- | --- | --- | --- |
| ses | 43.530000 | 13.898626 | 12.619697 | 0.789324 |
| holt | 31.606865 | 9.773629 | 10.338085 | 0.571171 |
| damped | 32.820015 | 10.567776 | 9.770766 | 0.599131 |
| arps | 32.176780 | 10.882779 | 10.094073 | 0.605968 |

By MASE the order is now holt, damped, arps, ses, with arps third. The holt row's MASE, 0.571171, is exactly what a `backtest` of holt on the same origins returns, because the comparison backtests each smoothing method exactly as `backtest` does.

## Why Arps fell back

The Arps baseline is a least-squares fit over every positive month of each training window, the months before the uplift included, so every Arps fit here mixes the old decline with the new level. The shut-in months at rate 0 are dropped from the fit by the decline curve engine. After the workover the Arps mean error is -23.147528 bbl/d, so it forecast high on average. Holt's is 20.751043, so holt forecast low. Both lean, in opposite directions, and holt's misses were the smaller when scaled.

The smoothing methods weight the recent months most, and each forecast starts from a state built on them. That is what a workover rewards.

## The winner depends on the origins

The same after-workover comparison from four first origins, horizon 6, step 3:

| first origin | origins | order by MASE | best MASE | arps MASE |
| --- | --- | --- | --- | --- |
| 26 | 26, 29, 32, 35, 38, 41 | holt, arps, ses, damped | 0.573284 | 0.702535 |
| 28 | 28, 31, 34, 37, 40 | holt, damped, arps, ses | 0.571171 | 0.605968 |
| 30 | 30, 33, 36, 39, 42 | damped, ses, arps, holt | 0.461235 | 0.646876 |
| 32 | 32, 35, 38, 41 | holt, damped, ses, arps | 0.510297 | 0.742389 |

A smoothing method comes first from every one of the four, and which smoothing method changes with the origins: holt from three of them, damped from first origin 30, where holt drops to last. With four to six origins each, no order is settled.

The metric matters too. In the after-workover table, damped has the lowest sMAPE while holt has the lowest MASE. An order is always an order by one named metric.

## Reading this honestly

The finding is robust across these origins: after the workover, a smoothing method beats the Arps baseline on EKENE-P2. Which smoothing method is not robust. The evidence is one well after one workover, and it says nothing yet about the next well that is worked over. Report the order with its origins, horizon, step and metric, and do not name a single best method from one run.

## Exercise

In the backtest explorer, run holt, damped and ses on EKENE-P2 from first origin 28, horizon 6, step 3, and check each MASE against the after-workover table. Then change the first origin to 30 and order the three by MASE again. Write one sentence on what stayed the same and one on what changed.
