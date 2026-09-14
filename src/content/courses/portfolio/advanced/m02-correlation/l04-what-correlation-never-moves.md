# What correlation never moves

Raising rho widens the risk summary and leaves the value alone. The portfolio emv, each project's risked EMV and the funded set are the same at every correlation.

{{panel:ec-governance-explorer}}

## One set, five correlations

OKONO's 600.0000 set, OK-1 + OK-2 + OK-4 + OK-5:

| rho | emv | stdDev | P(loss) | P90 | P10 |
| --- | --- | --- | --- | --- | --- |
| 0.000000 | 402.7500 | 143.8374 | 0.001800 | 200.3575 | 580.5960 |
| 0.300000 | 402.7500 | 178.1753 | 0.008500 | 171.8711 | 610.9466 |
| 0.600000 | 402.7500 | 206.8905 | 0.021900 | 137.2208 | 642.2010 |
| 0.900000 | 402.7500 | 232.0795 | 0.049500 | 99.0437 | 666.8894 |
| 1.000000 | 402.7500 | 239.8888 | 0.059000 | 87.9316 | 674.8353 |

emv reads 402.7500 on every row. Everything else moves: stdDev from 143.8374 to 239.8888, P(loss) from 0.001800 to 0.059000, and both tails outward, P90 falling from 200.3575 to 87.9316 while P10 rises from 580.5960 to 674.8353. The rising P10 is the same widening seen from the other side: a shared driver brings the good iterations together as surely as the bad ones.

## Why the mean holds

z1 = sqrt(rho) F1 + sqrt(1 - rho) e1 is a sum of two independent standard normals whose squared weights add to one, so z1 is itself a standard normal at any rho. normalCDF(z1) is below pos with chance pos, and every project succeeds exactly as often as it did at rho 0. The shared driver only decides which projects succeed in the same iteration. The same holds for z2, so a success stays centred on npv_p50. The average of a sum is the sum of the averages whatever the dependence, so OK-4 still contributes its risked EMV of 160.0000 and the set still sums to 402.7500.

## What else stays

Each project's risked EMV stays with it: OK-1 89.7500, OK-2 115.0000, OK-4 160.0000 and OK-5 38.0000, which sum to 402.7500. independentStdDev stays at 143.8374. The funded set stays too: the optimizer maximises summed risked EMV under the limit and hands rho only to the risk summary, so at 600.0000 it funds OK-1 + OK-2 + OK-4 + OK-5 at every correlation, and the frontier is unchanged.

## The mistake

The mistake is expecting a higher rho to make the optimizer diversify, or to lower the value of the portfolio. At rho 1.000000 a reader sees P90 fall to 87.9316 and P(loss) climb to 0.059000 and assumes the engine will now prefer a safer set. It will not. It never trades a unit of EMV for a narrower spread. If a committee finds the low case at full dependence unacceptable, it has to choose that trade itself, comparing sets by hand.

The opposite mistake is treating the unchanged emv as proof that correlation does not matter. The mean is the one figure correlation cannot touch, and the one a committee least needs protecting from. The emv printed is the closed form, identical at every rho by construction; the engine does not print the simulated mean beside it.

## Exercise

From the correlation table, state emv, P(loss) and P90 at rho 0.000000 and at rho 1.000000. Explain in two sentences why emv does not change, and say whether raising rho can change which projects the optimizer funds at 600.0000.
