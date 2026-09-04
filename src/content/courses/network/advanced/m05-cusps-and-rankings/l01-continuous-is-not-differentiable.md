# Continuous is not differentiable

The contract on a branch relation asks for two properties. The solver quietly needs a third.

{{panel:pd-fight-explorer}}

## What the contract asks for

The module header says a branch relation "Must be continuous and monotone decreasing in pTo", and adds that a pipe relation built from a characteristic curve satisfies this by construction. The turbulent law the whole course is written on is q = k sign(dp) sqrt(|dp|). It is continuous everywhere and it is monotone everywhere, so it satisfies the contract as written. Its slope at zero pressure difference is infinite.

## The step nobody chose

`solveNetwork` does not differentiate that relation. It differences it, with a step of max(1e-3, |p| * 1e-5), which at the junction pressures of the teaching network AGBADA WEST is about 0.007805 psi. Every Jacobian entry the solver uses is a chord over that width. On a smooth branch the chord is a derivative to many figures. On a branch sitting closer to zero difference than the step, the two evaluations straddle the cusp, and what comes out is a chord across a square root: roughly the conductance over the square root of the step. That number is a function of the node's own pressure and not of the flow through the branch, which is the wrong thing entirely to put in a Jacobian.

## Where the eight branches sit

| Branch | dp, psi | Jacobian steps from zero |
| --- | --- | --- |
| e1 AGBADA-2 flowline | 476.806785609 | 37923.780524 |
| e2 AGBADA-6 flowline | 40.343600289 | 4915.076169 |
| e3 AGBADA-9 flowline | 406.581740456 | 34217.004927 |
| e4 AGBADA-12 flowline | 50.706533886 | 6100.575318 |
| c1 North bypass | 191.685834427 | 24560.316377 |
| c2 Crosslink | -1.193210823 | 152.883678 |
| c3 Loop leg | 192.879045250 | 24675.475280 |
| tk Trunk | 323.783893593 | 54991.975344 |

Seven branches sit thousands or tens of thousands of steps from the cusp. The crosslink sits at 152.883678 steps, which is still perfectly safe, and which is also two orders of magnitude closer than anything else on the system. It is the only branch here whose Jacobian entry is worth a second look, and it earns that on geometry rather than on anything the solve reported.

## The distinction worth carrying

Continuity is a statement about the function's values. Differentiability is a statement about its slope, and a differenced Jacobian is an approximation to a slope. A contract that asks only for continuity has not asked for the thing the method consumes. Nothing in the return names a branch's distance from its own cusp, so the reader has to compute the step, take the branch pressure differences, and divide.

## What this solve reports about itself

This network converges in 11 iterations with a reported residual of 1.546141e-11 lb/d and returns `ok` true. `checkConservation` on the same answer reports 13300.677150912 lb/d produced against 12955.677150912 lb/d delivered, a gap of 345 lb/d, 2.593852900 percent. Neither number says anything about how close a branch is to a cusp.

## Exercise

Take the Jacobian step on this network and the crosslink's pressure difference, and write the ratio. Then say what a header would have to add to the branch contract for this case to be excluded rather than invited.
