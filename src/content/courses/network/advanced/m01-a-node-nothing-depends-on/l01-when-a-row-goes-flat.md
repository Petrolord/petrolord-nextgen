# When a row goes flat

A node whose pressure changes nothing that flows has an entirely zero Jacobian row. The solver cannot move it, so it stops trying.

{{panel:pd-fight-explorer}}

## What the module does with it

It pins the node where it sits, drops it out of the linear system, and names it in `pinned`. That is a warning and not a refusal. `buildNetwork` refuses a stranded node, a missing delivery point, a duplicate id and an unknown kind outright, each with a reason. `solveNetwork` reports the pin and carries on.

## The gate's own fixture

A well whose inflow is a constant 2000.000000 lb/d on a branch whose flow is a constant 1000.000000 lb/d. The engine returns `ok = true`, `converged = true`, `pinned = w` and `residualLbD = 0.000000e+0` after 1 iteration.

`checkConservation` on that same answer says produced 2000.000000 lb/d, delivered 1000.000000 lb/d, gap 1000.000000 lb/d, relative 0.500000000. Half the production enters and never leaves, under a reported residual of exactly zero. The gate asserts `ok`, `pinned` and the warning text here and never looks at the hole it made.

The same topology with a real branch and a real inflow returns `pinned` none, wellhead 153.846153846 psia, rate 16153.846153843 lb/d. A live network does not raise the flag, which is what makes it readable.

## The contract gap behind it

The module header requires `wellInflow` to be monotone DECREASING in pressure. A well held to a facility allocation, a choke limit or a compressor slot is monotone NON-increasing, with a flat top, and the flat top is what makes its node pinnable. Nothing refuses that well.

## Where a live node crosses over

AGBADA-12 is allocated 985 lb/d on a flowline capped at 640 lb/d. Walk the allocation and the node changes kind.

| Allocation, lb/d | pinned | Flowline, lb/d | Gap, lb/d |
| --- | --- | --- | --- |
| 300 | none | 300.000000 | 0.000000 |
| 500 | none | 500.000000 | 0.000000 |
| 620 | none | 620.000000 | 0.000000 |
| 640 | none | 640.000000 | 0.000000 |
| 660 | t4 | 640.000000 | 20.000000 |
| 800 | t4 | 640.000000 | 160.000000 |
| 985 | t4 | 640.000000 | 345.000000 |
| 1300 | t4 | 640.000000 | 660.000000 |

Every row reports `converged = true`, and the reported well rate on every row is the allocation. The residuals run 1.2164e-11, 7.0031e-11, 1.4688e-10, 1.9133e-10, 6.5211e-10, 7.2305e-11, 1.5461e-11 and 1.5007e-11 lb/d in that order. They do not grow when the gap does.

## The mistake

Reading the crossing as a change in difficulty. Nothing in the return changes at 660 lb/d except the word `pinned` and a gap nobody is shown. The relative gap is 0.001541345 there and 0.048473535 at 1300 lb/d, and the reported residual is smaller at the second.

## Exercise

Solve the teaching network at allocations of 640 and 660 lb/d and record `converged`, `pinned` and the reported residual.

Then say which field told you the network changed kind, and what `checkConservation` reports at each.
