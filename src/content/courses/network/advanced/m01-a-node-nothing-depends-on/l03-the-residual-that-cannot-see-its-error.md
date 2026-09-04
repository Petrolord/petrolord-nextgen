# The residual that cannot see its error

`normOf` takes the maximum over the unknown nodes filtered to exclude the pinned ones, and `converged` is tested against that norm.

{{panel:pd-fight-explorer}}

## One line of code decides it

A pinned node is removed from the measurement by construction. Not by an approximation, not by a tolerance choice: the node is filtered out of the array the maximum runs over, so whatever imbalance sits on it cannot appear in the number the solver stops on. The solver is then asked whether that number is small enough, and it is, because the one node that is not converged was excluded before the question was put.

## The answer the teaching network returns

Asked for a tolerance of 1e-12 with the iteration cap left at the module default of 200, AGBADA WEST returns `converged = true`, `ok = true`, 11 iterations, `residualLbD = 1.546141e-11` lb/d and `pinned = t4`.

`checkConservation` on that same answer: produced 13300.677150912 lb/d, delivered 12955.677150912 lb/d, gap 345.000000000 lb/d, relative 0.025938529000. That is 2.593852900 percent of what the engine says was produced, and it is 2.231362e+13 times the residual the solve reports.

## Where the error actually sits

Every unknown node's imbalance, on the answer the engine calls converged.

| Node | Imbalance, lb/d |
| --- | --- |
| t1 | 0.000000e+0 |
| t2 | 0.000000e+0 |
| t3 | 9.094947e-13 |
| t4 | 3.450000e+2 |
| ha | -1.546141e-11 |
| hb | 1.364242e-11 |
| hc | 1.818989e-12 |

Six of the seven are at machine noise. The seventh is 345.000000000 lb/d, and it is the pinned one. The worst imbalance over all unknown nodes is 345.000000000 lb/d; the worst over the unpinned nodes only, which is what the engine reports, is 1.546141e-11 lb/d.

## Why the residual is not an error bar

`residualLbD` measures how well the system the solver chose to solve was solved. It is not a measure of how well the network was solved, and the two are the same object only when nothing was pinned. On the published `linear_star` case, where `pinned` is none, the engine stops at a reported residual of 7.2760e-12 lb/d and `checkConservation` reports a gap of 7.275958e-12 lb/d, relative 1.779446e-16. The two numbers agree there because the filter removed nothing.

## The mistake

Sizing the uncertainty in a network answer from the residual. A reader who takes 1.546141e-11 lb/d as the accuracy of the trunk mass has adopted a number the conservation gap on the same answer exceeds by a factor of 2.231362e+13, on a system where 345.000000000 lb/d of production goes in and does not come out. The residual is honest about the subsystem the solver kept and silent about the rest, and nothing in the return says which of the two you are holding.

The second habit worth keeping is to read `pinned` before `converged`. A non-empty `pinned` list means the number `converged` was tested against is not a measurement of the whole network, and that is true whatever the residual says.

## Exercise

Solve AGBADA WEST at a tolerance of 1e-12 and write down `converged`, `residualLbD`, `pinned` and the `checkConservation` gap.

Then say what the reported residual would have been if the filter had kept every unknown node.
