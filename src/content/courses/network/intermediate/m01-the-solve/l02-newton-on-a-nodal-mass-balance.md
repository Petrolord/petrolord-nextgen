# Newton on a nodal mass balance

One unknown per node whose pressure nobody fixed, one equation per unknown, and the equation is that mass arriving equals mass leaving. Everything else in the solver is machinery for driving those equations to zero.

{{panel:pd-network-explorer}}

## The unknowns are pressures and the equations are masses

On the teaching network AGBADA WEST, `buildNetwork` returns ok = true with 8 nodes, 8 branches, 7 unknown pressures and 1 delivery point, and it indexes the unknowns in the order t1, t2, t3, t4, ha, hb, hc. The separator is not among them: a sink has a fixed pressure and takes whatever arrives, so it is the boundary rather than an unknown.

At each unknown node the residual is what the well injects plus what the branches bring in, minus what the branches take out, in lb/d. Mass is the currency because surface volumes do not add across pressures, and mixing two of them is a mistake that hides for a long time. Newton assembles those residuals into a vector, solves for a pressure correction and repeats.

## What zero actually looks like

Solved at a tolerance of 1e-12 with the iteration cap left at the module default of 200, the network converges in 11 iterations with a reported residualLbD of 1.546141e-11 lb/d and one node pinned.

| Node | Nodal imbalance, lb/d |
| --- | --- |
| t1 | 0.000000e+0 |
| t2 | 0.000000e+0 |
| t3 | 9.094947e-13 |
| t4 | 3.450000e+2 |
| ha | -1.546141e-11 |
| hb | 1.364242e-11 |
| hc | 1.818989e-12 |

## The number the flag is built from

The reported residual is a maximum over imbalances, and 1.546141e-11 lb/d is the size of the worst one at ha. It is not the worst imbalance in the network. That is 345.000000000 lb/d at t4, and it is not in the maximum the flag was tested against.

`checkConservation`, run on the same answer, says produced = 13300.677150912 lb/d and delivered = 12955.677150912 lb/d, a gap of 345.000000000 lb/d, which is 2.593852900 percent of what the engine says was produced. Two numbers, one answer, and `solveNetwork` never calls the second. Print both, every time.

## The mistake

Reading the residual as the error in the answer. It is the size of the equations the solver was still working on, in lb/d of mass per node, and nothing forces that set to be every node. A residual near machine precision proves the iteration stopped moving. It proves nothing about whether the mass the wells were credited with came out at the separator.

## What it refuses

A node with no route to a delivery point is refused rather than guessed at: "This node has no route to a delivery point: Manifold B. Nothing sets its pressure, so the network cannot be solved. Connect it or take it out." A network with no delivery point at all, or one whose delivery point has no pressure, is refused for the same reason. Every unknown has to be anchored to something the caller fixed, or the mass balance has no solution to find.

## Exercise

Solve the teaching network in the panel, write the reported residual and the conservation gap side by side, and say which node the reported residual came from.
