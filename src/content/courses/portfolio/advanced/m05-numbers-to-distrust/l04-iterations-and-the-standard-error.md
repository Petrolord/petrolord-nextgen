# Iterations and the standard error

The portfolio risk summary counts its loss probability from a seeded simulation. The seed makes the count reproducible, and the iteration count sets how far the count can sit from the model's own answer. Neither says the model is right.

{{panel:ec-governance-explorer}}

## OKONO's 450.0000 set, six runs

The funded set is OK-1 + OK-3 + OK-4, with an emv of 291.0000 and a stdDev of 271.6522.

| seed | iterations | P(loss) | standard error sqrt(p(1 - p) / n) (derived) | P90 |
| --- | --- | --- | --- | --- |
| 20260829 | 1000 | 0.114000 | 0.010050 | -15.1262 |
| 20260829 | 10000 | 0.123600 | 0.003291 | -18.3574 |
| 20260829 | 40000 | 0.125975 | 0.001659 | -18.8524 |
| 1 | 10000 | 0.128500 | 0.003346 | -21.8586 |
| 2 | 10000 | 0.127700 | 0.003338 | -19.9023 |
| 3 | 10000 | 0.119100 | 0.003239 | -15.3254 |

## The standard error

A probability counted from n draws has a standard error of sqrt(p(1 - p) / n). At the default seed it is 0.010050 at 1000 iterations, 0.003291 at 10000 and 0.001659 at 40000. Four times the iterations roughly halves it. At 10000 iterations the fourth decimal of 0.123600 sits well inside its own error.

At 10000 iterations P(loss) runs from 0.119100 at seed 3 to 0.128500 at seed 1, with the default 0.123600 between, and each standard error lies between 0.003239 and 0.003346. The seeds differ by a few standard errors, which is what sampling alone produces. The 1000 iteration run's 0.114000 sits within one of its own standard errors of the 10000 run.

## The P90 moves too

The Low case P90 is the 10th percentile of simulated portfolio NPV, and it wobbles with the sample: -15.1262 at 1000 iterations, -18.3574 at 10000, -18.8524 at 40000, and from -21.8586 to -15.3254 across seeds 1 to 3. The engine prints no standard error for it. Every run puts it below zero, and that much belongs to the set. Its fourth decimal does not.

## What the published cases promise

The published riskMethod cases carry the exact answer, a golden standard error and a z, the engine's distance from exact in standard errors. The single wildcat reads 0.696100 against an exact 0.700000, a standard error of 0.004583 and a z of 0.8510. identical6 reads 0.118100 against 0.117649, a z of 0.1400. No case sits further than 1.4289 standard errors from exact. That is all a seeded simulation promises: agreement with its model's exact answer within sampling error.

## What neither buys

The normal approximation used before EC5-0 would have given this set a P(loss) of 0.142035 and a P90 of -57.1494, a different model of the same projects. The simulation's own model funds projects whole, uses one average correlation and assumes a normal success spread. A seed buys a reproducible number, iterations buy a smaller standard error, and neither buys a correct model of the projects.

## The mistake

The mistake is quoting 0.123600 as if all six decimals carried information, or rerunning seeds until the loss probability looks acceptable. Report P(loss) with its seed, its iterations and its standard error, and compare two sets only when they differ by several standard errors.

## Exercise

Give P(loss) and its standard error at 1000, 10000 and 40000 iterations on the default seed, and say what quadrupling the iterations did to the standard error. Then give the range of P(loss) across seeds 1 to 3 and say whether it is wider than sampling alone would explain.
