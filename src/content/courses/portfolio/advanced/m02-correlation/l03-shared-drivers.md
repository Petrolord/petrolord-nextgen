# Shared drivers

Correlation in the risk simulation is a shared draw. Each iteration deals two normals, F1 and F2, that every funded project hears, and rho sets how much of each project's driver comes from them rather than from its own draws.

{{panel:ec-governance-explorer}}

## The weights

A project's success driver is z1 = sqrt(rho) F1 + sqrt(1 - rho) e1, and its success spread driver is z2 = sqrt(rho) F2 + sqrt(1 - rho) e2. At rho 0 every project listens only to its own e1 and e2. At rho 1 every project hears only F1 and F2, and they move as one.

F1 stands for what makes projects succeed or fail together: one basin model, one rig contract, one operator. A project succeeds when normalCDF(z1) is below pos, so an iteration that draws F1 far above zero pushes every project's z1 up at once, toward failure together. F2 stands for what makes successes large or small together, such as one price deck: a high F2 lifts every success above its npv_p50 in the same iteration.

## Three wildcats, three dependencies

| case | kind | exact P(loss) | engine P(loss) | exact P90 outcome | normal P90 |
| --- | --- | --- | --- | --- | --- |
| identical3 | independent-binary | 0.343000 | 0.343100 | -150.0000 | -191.0335 |
| copulaIdentical3 | copula-binary | 0.469561 | 0.473300 | -150.0000 | -338.5074 |
| comonotoneIdentical3 | comonotone | 0.700000 | 0.704800 | -150.0000 | -451.6680 |

The three wells are the same on every row; only the shared driver changes. Independent, all three fail together with chance 0.343000. Fully shared, they fail together whenever one does, 0.700000. The copula case, with a partial correlation, sits between at 0.469561. The low case is -150.0000 on every row, all three failing; what the shared driver changes is how often that happens.

The normal approximation the engine used before EC5-0 got worse as dependence rose, putting P90 at -191.0335, -338.5074 and -451.6680, each beneath the -150.0000 the three wells can lose. The closed-form stdDev grows with rho, and a bell curve stretched that wide runs past the floor.

The three mixed projects tell the same story: exact P(loss) 0.315000 independent, 0.401631 under the copula and 0.600000 comonotone.

## OKONO's funded set

At the 600.0000 limit, OK-1 + OK-2 + OK-4 + OK-5 reads P(loss) 0.001800 and P90 200.3575 at rho 0.000000, and P(loss) 0.059000 and P90 87.9316 at rho 1.000000. Nothing about the projects changed. The shared draw decides whether their bad iterations coincide.

## The mistake

The mistake is leaving rho at its default of 0 for projects that plainly share drivers. rho 0 says OKONO's infill drilling, gas compression, waterflood and workovers share no reservoir, no gas price and no operator. It is the most optimistic spread the engine can give, and at the 600.0000 set it reports P(loss) 0.001800 where full dependence reports 0.059000. Choosing rho is choosing the answer, so the value typed in deserves the same defence as a chance of success.

## What it refuses

There is one shared driver for success and one for size, and both take the same rho. The engine cannot say OK-1 and OK-4 share a reservoir while OK-5 stands apart, and it cannot let success correlate strongly while sizes correlate weakly.

## Exercise

Write the success driver z1 for one project and say what happens to it at rho 0 and at rho 1. Then, for the three identical wildcats, state the exact P(loss) independent, under the copula and comonotone, and explain why the P90 outcome of -150.0000 is the same on all three rows.
