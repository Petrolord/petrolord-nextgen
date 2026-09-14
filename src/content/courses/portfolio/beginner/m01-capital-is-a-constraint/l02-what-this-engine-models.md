# What this engine models

The Capital Portfolio engine does three things with an inventory: it risks each project into one value, chooses the set of whole projects worth the most under a capex limit, and summarises how that set could turn out.

{{panel:ec-capital-explorer}}

## What goes in

Each project carries a capex, a success-case NPV `npv_p50`, the entered NPV percentiles `npv_p10` and `npv_p90`, a chance of success `pos` and a `fail_cost`. OKONO's exploration well is a full example:

| project | capex | npv_p50 | npv_p10 | npv_p90 | pos | fail_cost |
| --- | --- | --- | --- | --- | --- | --- |
| OK-3 | 90.0000 | 420.0000 | 700.0000 | 210.0000 | 0.250000 | 85.0000 |

`pos` runs from 0 to 1 and defaults to 1. `fail_cost` is 0 or more and defaults to 0. Every amount is million USD.

## Step one, a risked value

Risked EMV = pos x npv_p50 - (1 - pos) x fail_cost. For OK-3 by hand, 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500. The percentiles play no part in this number. They set the success spread, (npv_p10 - npv_p90) / 2.5631, which is 191.1747 for OK-3 and is used only when the engine describes risk.

## Step two, a set under a limit

The optimizer is a 0/1 knapsack. It funds each project in full or not at all and maximises the summed risked EMV with total capex inside the limit on its grid. For OKONO every capex and limit is a whole number of at most 5000, so the grid is 1 million USD per cell and the resolution reads 1.0000. At a limit of 450.0000 it funds OK-1 + OK-3 + OK-4 for 291.0000. It also returns the efficient frontier, the best risked EMV reachable at each spending level up to the limit.

## Step three, a risk summary

For the funded set the engine reports `emv` and `stdDev` in closed form, and reads `probLoss`, `p90` and `p10` from a seeded Monte Carlo, default seed 20260829 and default iterations 10000. Each iteration draws every project's success or failure and, on success, its NPV from the success spread, under one average correlation. For the 450.0000 set:

| emv | stdDev | P(loss) | P90 | P10 | seed | iterations |
| --- | --- | --- | --- | --- | --- | --- |
| 291.0000 | 271.6522 | 0.123600 | -18.3574 | 738.1043 | 20260829 | 10000 |

P90 is the low case, the 10th percentile of simulated portfolio NPV, and P10 the high case. Before EC5-0 the engine read the loss probability and these percentiles from a normal approximation of the summed NPV. The repaired engine simulates, and shows the seed so anyone can reproduce the run.

## What it does not model

Projects are funded whole. Capex is spent in one period and never phased. There is no time value beyond the NPVs entered. Correlation is one average number for every pair, and the success spread is assumed normal.

## The mistake

The mistake is believing the risk summary helped choose the set. The optimizer maximises risked EMV and nothing else. The 450.0000 set carries a P(loss) of 0.123600 and the 600.0000 set, OK-1 + OK-2 + OK-4 + OK-5, carries 0.001800. Neither probability took any part in choosing its set. The summary is computed afterwards, for the set already chosen, and a lower-risk set of nearly equal value is never offered.

## Exercise

Write OK-3's risked EMV by hand from its row, and state what `npv_p10` and `npv_p90` are used for. Then give the seed, iterations, P(loss) and P90 of the 450.0000 set, and explain why a P(loss) of 0.123600 did not stop the optimizer choosing that set.
