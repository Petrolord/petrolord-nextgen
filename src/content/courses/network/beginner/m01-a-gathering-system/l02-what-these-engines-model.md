# What these engines model

Two files, six functions, and exactly one of the six iterates. Naming which function owns a number is most of what this tier is for.

## The line and the system

`pipeSchedule.js` is a published table and two closed forms. Nothing in it iterates and nothing in it knows there is a network. `networkSolve.js` carries the other five: `buildNetwork` validates a drawing and indexes it without ever computing a pressure, `solveNetwork` runs Newton on the nodal mass balance with a numerically differenced Jacobian and a backtracking line search, `propagateStreams` adds component rates along the solved flow directions, `checkConservation` sets what the wells put in against what the delivery points took out, and `diagnose` reads the answer for a bottleneck, a biggest drop, a backflow or a dead leg.

## Three node kinds and two callbacks

The whole vocabulary is well, junction and sink. A well injects and its pressure is unknown. A junction injects nothing and everything that arrives leaves. A sink holds a fixed pressure and takes whatever arrives. The pipe hydraulics along a branch are a callback the consumer supplies, and the well inflow is another callback. This module owns neither one, so it can be wrong about a line only by being handed a relation that is wrong.

## One well, one line, one boundary

AGBADA-2 on the teaching network is a Vogel well with a qmax of 8100 lb/d at a reservoir pressure of 2750 psia, on a flowline of conductance 275 lb/d per root psi, against the separator at 265 psia. Solved on its own with nothing else on the system, it sits at a wellhead of 892.889543025 psia and makes 6890.874160167 lb/d, a line drop of 627.889543025 psi and a drawdown of 1857.110457 psi. That is the whole two node problem: one curve falling, one line rising, one crossing.

## What that answer was checked against

The solve reports `converged: true` in 7 iterations with a residual of 9.0949e-13 lb/d, nothing pinned and no warnings. `checkConservation` run on the same answer gives a gap of 9.094947e-13 lb/d, relative 1.319854e-16. Those are two different statements and only the second is a check, because the residual and the flag are both produced by the iteration that produced the answer. `solveNetwork` never calls `checkConservation`, so a caller who does not call it has nothing but the iteration's report on itself.

The iteration settings are `DEFAULT_MAX_ITER` at 200 and `DEFAULT_TOLERANCE_LB_D` at 0.000001, whose own comment says Newton stops when the worst nodal imbalance is below it, in lb/d. What the solver actually stops at is that constant multiplied by a scale it computes for itself, which is a different number and one the caller never sees.

## Exercise

Name which of the six functions produced each of these: the index of unknown nodes, the wellhead 892.889543025 psia, the gap 9.094947e-13 lb/d, and a bore in inches.

Then say why the reported residual and the conservation gap are not two measurements of the same thing.
