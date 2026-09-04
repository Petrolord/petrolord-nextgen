# The story so far

A network answer is one object holding three kinds of number, and nothing in it says which is which.

## The determined ones

Give the solver linear resistances and the system collapses to a Laplacian with a closed form. On the published `linear_star` the Newton solve and the matrix inverse agree at 546.666666667 psia exactly, and at the other nodes to -5.6843e-14 and -2.8422e-14 psia, relatives of 1.4330e-16 and 1.1269e-16. Newton needed 2 iterations, what an exact method on a linear system needs. The two routes share no code, so the agreement is evidence about the assembly and the signs rather than about either method. Reorder the nodes array on the teaching network, which changes no physics, and the solved nodes move by at most 1.1369e-13 psia.

## The last iterate

Everything after a turbulent branch is an iterate reporting on itself. AGBADA WEST comes back `converged` true after 11 iterations with a residual of 1.546141e-11 lb/d. `checkConservation`, on that same answer, reports 13300.677150912 lb/d produced against 12955.677150912 lb/d delivered: a gap of 345.000000000 lb/d, 2.593852900 percent, and 2.231362e+13 times the residual. `normOf` is the maximum over the unknowns filtered to exclude the pinned ones, so a pinned node leaves the measurement by construction. `checkConservation` sits in the same file, its header calls it the only check that catches a sign error in the assembly, and `solveNetwork` never calls it.

## The ones that are neither

A pinned pressure is where the last accepted step left it. Change the starting guess and it comes back at 400.000000, 600.000000, 831.000000, 1182.577035 and 2000.000000 psia, with gaps of 1625.000000, 1625.000000, 345.000000, 0.000000 and -640.000000 lb/d, the last a network delivering more than it says was produced. Every one reports converged. Two agree on the manifold to the last bit while disagreeing about what the system made, so agreement between runs is not evidence. A reordering moves that same node by 5.4710e-9 psia.

## What the flags are worth

The constant is `DEFAULT_TOLERANCE_LB_D`, and the solver stops at that tolerance times a scale: the largest single well inflow at the sink pressure, 7883.717950413 lb/d here, making the documented default of 0.000001 a target of 7.883718e-3 lb/d. And `ok` comes back true at the iteration cap, at a stalled line search and at an unresolved cusp. Only a singular Jacobian returns false.

## Where the referee stops

The independent bisection oracle publishes 4 cases and records no defects, taking 19, 42 and 48 sweeps on three of them against a cap of 4000 it never reaches. It has no concept of a pinned node, it converges on how far pressures moved rather than on a mass residual, and it never calls `checkConservation`, `diagnose` or `propagateStreams`. Every finding here lives where it never looks.

## Exercise

Sort the fields of one network result into determined, last iterate and neither, and write the number that puts each where you put it.
