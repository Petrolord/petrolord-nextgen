# The check in the same file

`checkConservation` compares what the wells put in against what the delivery points took out. `solveNetwork` never calls it.

{{panel:pd-fight-explorer}}

## What it is for

Its own header calls it the only check that catches a sign error in the assembly, and says that a solver which converged on a wrong residual function converges just as smugly as one that did not. It is the audit: an independent statement about the answer rather than a restatement of the stopping test. Nothing in the return of `solveNetwork` is a check on the answer that was not computed by the same iteration that produced the answer.

## What it says across the cases

The engine's own `checkConservation`, run on the engine's own solutions. The first two are published golden cases, the middle four are the teaching wells on their own flowlines, and the last two are the teaching network and the gate's pinning fixture.

| Case | Gap, lb/d | Relative |
| --- | --- | --- |
| linear_star | 7.275958e-12 | 1.779446e-16 |
| turbulent_tree | 9.890573e-8 | 1.149253e-11 |
| AGBADA-2 alone | 9.094947e-13 | 1.319854e-16 |
| AGBADA-6 alone | -4.547474e-13 | 1.487551e-16 |
| AGBADA-9 alone | 0.000000e+0 | 0.000000e+0 |
| AGBADA-12 alone | 3.450000e+2 | 3.502538e-1 |
| AGBADA WEST | 345.000000000 | 0.025938529000 |
| the gate fixture | 1000.000000 | 0.500000000 |

Six rows are at machine noise. The two that are not are the two with a pinned node, and both of those report `converged = true` with a residual no larger than 1.546141e-11 lb/d. Reading down the gap column separates the answers; reading down the residual column does not. On `linear_star` the engine produced 40888.888888889 lb/d and delivered 40888.888888889 lb/d; on AGBADA WEST it produced 13300.677150912 lb/d and delivered 12955.677150912 lb/d.

## The two fixes, both cheap

Report a pinned imbalance alongside the residual, or refuse to set `converged` while any pinned node's net is non-zero. The second is the honest one, because a pinned node with a non-zero net is not a solved network. On AGBADA WEST the first fix would print 345.000000000 lb/d at node t4, which is a number the engine already computed and already carries.

## What the audit refuses to do

It returns one gap for the whole system. It does not say which node lost the mass, it does not repair anything, and it cannot distinguish a pinned node from a genuine sign error in the assembly, because both look like production that went in and did not come out. It also cannot be read as a tolerance: a gap of 9.890573e-8 lb/d on `turbulent_tree` is noise, and the same gap on a network moving a few hundred pounds a day would not be.

## Exercise

Solve AGBADA WEST, then call `checkConservation` on the result and write down produced, delivered and the gap.

Then say why the engine's own `converged` flag could not have told you the same thing.
