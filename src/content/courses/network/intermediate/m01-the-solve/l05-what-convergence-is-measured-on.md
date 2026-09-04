# What convergence is measured on

Two solvers can both say they converged on the same network and mean unrelated things by it, because one is watching mass and the other is watching pressure.

{{panel:pd-network-explorer}}

## Two criteria that do not compare

The engine stops on a nodal mass imbalance, in lb/d. The independent bisection referee stops on how far the pressures moved between one sweep and the next, in psia. Neither criterion is published in the golden files, so a case that both methods agree on tells you nothing about how either of them decided to stop.

The counts are not comparable either. The referee takes 19 sweeps on `linear_star`, 48 on `turbulent_tree` and 42 on `looped`, against a cap of 4000 it never reaches. The engine takes 2, 6 and 6 Newton iterations on the same three.

## What the published agreement is held to

The gate holds `turbulent_tree` pressures to 5 decimals and flows to 4, `looped` pressures to 5 decimals, and the `wells_fight` header and rates to 4 decimals. `linear_star` is held to a relative 1e-12 against the closed form. Anything smaller than those bands is invisible to the published comparison by construction, which is the honest frame for every agreement in this course.

## The residual is not the error

On the teaching network the engine reports converged = true after 11 iterations with a residualLbD of 1.546141e-11 lb/d. `checkConservation`, on that same answer, gives produced = 13300.677150912 lb/d and delivered = 12955.677150912 lb/d, a gap of 345.000000000 lb/d, which is 2.593852900 percent of what the engine says was produced. The gap divided by the reported residual is 2.231362e+13.

The residual is a maximum over the nodes the solver was still moving. The gap is what the wells were credited with, minus what came out. Nothing makes those the same measurement, and on this network they are not.

## The mistake

Reading converged as checked. `checkConservation` sits in the same file, its own header calls it the only check that catches a sign error in the assembly, and `solveNetwork` never calls it. Nothing in that return is a check on the answer that was not computed by the same iteration that produced the answer.

## What it refuses

The module refuses very little here and warns instead. A solve that ran its iteration cap without meeting its tolerance comes back with a warning. So does a solve that stopped making progress. So does a pinned node, which is reported as a fact about the answer. A warning is not a refusal, and the calling code has to read it.

## Exercise

Solve the teaching network in the panel, then run the same case again at a looser tolerance. Record the reported residual and the conservation gap for both runs, and say which of the two numbers moved.
