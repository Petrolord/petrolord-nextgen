# The Jacobian and the line search

The solver never differentiates anything symbolically. It nudges a pressure, re-evaluates the whole residual and calls the ratio a derivative, then refuses to take the step that suggests until the residual actually improves.

{{panel:pd-network-explorer}}

## A derivative made by nudging

The Jacobian step is max(1e-3, |p| * 1e-5), which at the teaching network junction pressures works out at about 0.007805 psi. Each column is one node's pressure moved by that step, with every well inflow and every branch relation re-evaluated. Nothing about the branch law is assumed beyond the contract: continuous and monotone decreasing in the downstream pressure.

That is expensive per step and cheap in steps. The published `linear_star` takes 2 Newton iterations, `turbulent_tree` takes 6 against 48 sweeps for the bisection referee, `looped` takes 6 against 42, and the teaching network takes 11.

## Why a full step is not taken

A full Newton correction on a network with a nearly dead leg will happily drive a node below atmospheric. The module halves the step until the residual improves and tries thirty halvings before it gives up, and it holds every pressure at or above MIN_PRESSURE_PSIA = 14.7 psia. A published fixture runs a weak well against a 20 psia separator through a very slack line: it converges with a wellhead of 20.003996803 psia and a rate of 19.984012790 lb/d and nothing pinned.

## What a low iteration count is worth

| Solo well | Iterations | Reported residual, lb/d | Conservation gap, lb/d |
| --- | --- | --- | --- |
| t1 | 7 | 9.0949e-13 | 9.094947e-13 |
| t2 | 7 | 4.5475e-13 | -4.547474e-13 |
| t3 | 7 | 0.0000e+0 | 0.000000e+0 |
| t4 | 4 | 0.0000e+0 | 3.450000e+2 |

Every one of those four says converged = true. The fastest of them, at 4 iterations and a reported residual of exactly zero, is the one whose conservation gap is 3.450000e+2 lb/d, relative 3.502538e-1. Fewer steps meant fewer equations, not a better answer.

## The mistake

Treating iteration count and reported residual as a quality score. They describe the path the iteration took. The only number in the module that describes the answer is the one `solveNetwork` does not compute, and the header of `checkConservation` says why: a solver that converged on a wrong residual function converges just as smugly as one that did not.

## What it refuses

A singular Jacobian is the one thing `solveNetwork` returns ok = false for: "The system is singular: two or more nodes move together, so their pressures are not separately determined. That is usually a branch connected differently from the way the drawing suggests." Underneath, `solveLinear` returns null on a singular two by two rather than an array of infinities, and it pivots: a well posed pair comes back 1.000000000, 3.000000000, and a pivoted one 3.000000000, 2.000000000.

## Exercise

Solve each teaching well on its own line in the panel and record iterations, reported residual and conservation gap. Then say what the 4 iteration run has that the others do not.
