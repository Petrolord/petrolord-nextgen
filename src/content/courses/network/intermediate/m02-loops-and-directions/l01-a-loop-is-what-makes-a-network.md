# A loop is what makes a network

Two paths from one header to one separator, and no branch flow is fixed by anything downstream of it any more. That is the difference between a tree and a network.

{{panel:pd-network-explorer}}

## The published loop

The golden case `looped` is two Vogel wells on one header with two parallel routes to a separator at 200 psia: conductances b1 = 150, b2 = 130, b3 = 300, b4 = 180 and b5 = 220 lb/d per root psi, wells w1 at 6000 lb/d at 2800 psia and w2 at 4500 lb/d at 2400 psia. The direct leg b4 carries 3693.942751108 lb/d and the midpoint leg b5 carries 3640.772530876 lb/d. Neither path is dead.

## What a tree hands you for free

On the golden tree `turbulent_tree`, the trunk flow b5 = 8606.086171631 lb/d is exactly what its three wells make: 2853.835862210, 1770.680431186 and 3981.569878232 lb/d. Every branch flow in a tree is settled by the well rates downstream of it, so flows come first and pressures follow.

In `looped` that ordering has nowhere to start. The leg flows are set by the header and midpoint pressures h = 621.148550879 psia and m = 473.868277305 psia, and those pressures are set by how the flow split. No branch can be computed first.

## The share is not a ratio of conductances

The direct leg carries 50.362456 percent of what reaches the separator and the midpoint leg 49.637544 percent, so the leg quoted at 180 lb/d per root psi carries more than the leg quoted at 220. The midpoint route is b3 at 300 and then b5 at 220 in series, two pressure drops against the direct leg's one, and turbulent conductance has no reciprocal rule that would collapse those two into one number worth comparing with 180.

## Touch one leg and the other moves

A derived sweep on the same published inputs, not a published case: set the midpoint leg to 60 lb/d per root psi and the direct leg goes to 4926.564514 lb/d, against 3693.942751 lb/d at the published 220. Nothing was done to the direct leg. Two parallel paths are one decision, not two pipes.

## What the flag says and what it does not

The engine returns converged = true in 6 iterations at a reported residual of 3.6364e-7 lb/d. `solveNetwork` never calls its own conservation check, so that residual came out of the same iteration that produced the answer. What stands behind the case is the independent bisection referee: 42 sweeps, a conservation gap of 2.5057e-9 lb/d on its own solve, landing 1.4308e-8 psia from the engine at the header.

## What it refuses

`buildNetwork` refuses eleven malformed shapes and a loop in the drawing is not one of them. The only loop the module refuses is a loop in the SOLVED directions, from `propagateStreams`: "The solved flow directions form a loop, so the network is recirculating. A gathering system does not do that; check for a branch connected backwards."

## Exercise

Solve `looped` in the panel and record both leg flows. Say in one sentence why the leg with the larger conductance carries less.
