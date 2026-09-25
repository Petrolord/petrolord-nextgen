# A baseline that wins

{{panel:pf-uncertainty-explorer}}

The Arps baseline is in every comparison for one reason: a smoothing method that cannot beat it on a well has not earned its place on that well. Sometimes the baseline wins. This lesson reads the wells where it does and where it does not, and says what goes in the forecast note either way.

## A clean decline: Arps first

EKENE-P1 compared from first origin 30, horizon 6, step 3, ranked by MASE: arps, damped, holt, ses, with arps at MASE 0.199862. The Arps baseline ranks first.

That result has a plain cause, and the course states it. EKENE-P1 was drawn from an Arps curve: the generator set qi 1200, Di 0.06 per month and b 0.5 and added noise. A least-squares Arps fit is the right shape for a series made that way, and on these held-out months it scores the lowest MASE of the four. A note that leans on this win should say the well was built that way, because a real well is under no obligation to follow a single Arps curve.

## EKENE-P2 before the shut-in

The same comparison on EKENE-P2 months 0 to 21, before the shut-in, from origins 10, 13, 16 and 19 with horizon 3:

| method | MAE | MASE |
| --- | --- | --- |
| ses | 46.858333 | 1.006754 |
| holt | 22.412654 | 0.483573 |
| damped | 23.269948 | 0.504549 |
| arps | 17.012466 | 0.389192 |

The ranking by MASE is arps, holt, damped, ses. Before the shut-in, on these origins, the baseline wins again.

## After the workover: the winner changes

On all 48 months of EKENE-P2, from origins 28, 31, 34, 37 and 40 with horizon 6, the ranking by MASE is holt, damped, arps, ses: holt first at 0.571171 and arps third at 0.605968. The Arps fit is a least-squares fit on every positive month of each training window, the months before the uplift included. Its mean error after the workover is -23.147528 bbl/d, so it forecasts high, while holt's is 20.751043.

The winner also depends on the origins. From four first origins after the restart, horizon 6, step 3:

| first origin | ranking by MASE | best MASE | arps MASE |
| --- | --- | --- | --- |
| 26 | holt, arps, ses, damped | 0.573284 | 0.702535 |
| 28 | holt, damped, arps, ses | 0.571171 | 0.605968 |
| 30 | damped, ses, arps, holt | 0.461235 | 0.646876 |
| 32 | holt, damped, ses, arps | 0.510297 | 0.742389 |

A smoothing method ranks first from every one of the four, and which one it is changes with the origins. So a ranking is always reported with its origins, horizon, step and metric; a single ranking from one set of origins is one test.

## What goes in the note

When Arps wins, say so, with its MASE and the smoothing methods' beside it, on the same origins. Then either use the baseline, or say why a smoothing method is still chosen and what it adds. When a smoothing method wins, give the margin over arps on the same origins, and give the origins, because another set may reorder the table. Never report a smoothing method's metrics on a well without the Arps row beside them.

## Exercise

Open "Methods ranked against Arps" and start from EKENE-P1 with first origin 30, horizon 6 and step 3, ranked by mase; read the ranking and the arps MASE. Then start from EKENE-P2 and run first origins 26, 28, 30 and 32 with horizon 6 and step 3. For each, write the ranking and the arps MASE, and say in two sentences what the four runs together tell you about choosing a method on this well.
