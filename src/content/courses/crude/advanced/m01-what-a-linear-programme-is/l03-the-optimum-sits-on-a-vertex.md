# The optimum sits on a vertex

The kernel does not search every feasible point of a linear programme one by one. The course states the fact that makes the method possible: the optimum of a linear programme, when there is one, is found at a vertex of the feasible region, a point where at least as many constraints and bounds hold exactly as there are variables.

## Why a corner

The kernel's method rests on that fact. It is two-phase simplex: phase one finds any point that meets every row, and phase two moves from vertex to vertex to the optimum. So every point phase two reads is a corner of the feasible region, and the optimum it returns is one of them. The textbook case below lists its four corners one by one, each with its objective and the kernel's status, and the kernel's optimum is among them.

In two variables a vertex is where two lines meet: two rows, a row and a bound, or two bounds. In a blend with four components, a vertex is a point where at least four constraints or bounds hold exactly, counting the batch row among them.

## The textbook case, corner by corner

The digest solves the textbook case at every vertex its two rows and two bounds make. Each point is solved by the kernel with both coordinates fixed by bounds, so the kernel itself reports whether the point is feasible:

| point | objective at the point | feasible (the kernel's status) |
| --- | --- | --- |
| x 0.0000, y 0.0000 | 0.0000 | optimal |
| x 4.0000, y 0.0000 | 20.0000 | optimal |
| x 0.0000, y 3.0000 | 12.0000 | optimal |
| x 3.0000, y 1.5000 | 21.0000 | optimal |

The table prints each point, its objective and the kernel's status, and not which constraints hold there. What the digest does say is where the points come from, "the vertices the two rows and the two bounds make", and what a vertex is: a point where at least as many constraints and bounds hold exactly as there are variables. With two variables, x and y, that is at least two.

The kernel's optimum for the full problem, x 3.0000, y 1.5000, objective 21.0000, is the last row of that table. The optimum is one of the corners.

## What this means for a blend

Three consequences follow.

First, at the optimum some constraints hold exactly. In a blend those are the binding specifications and the components at a bound. The digest says it of the Apapa recipe: "A binding specification is met exactly; the optimum is pressed against it."

Second, some constraints hold with room to spare. Those are the specifications with giveaway, and the digest prices them at zero: "relieving a limit the blend does not touch saves nothing."

Third, a limit moved by a whole unit can move the optimum to a different corner. Module four prints both cases: the RVP re-solves change what holds, and the sulfur re-solves keep the same specifications binding.

{{panel:crude-recipe-explorer}}

In the panel, drag the objective line across the textbook region. It leaves the region last at a corner, and as its slope changes the last corner changes with it.

## Exercise

Read the four vertices in the digest's table and their objectives: 0.0000, 20.0000, 12.0000 and 21.0000. Say which one the kernel returns as the optimum of the maximisation. Then quote the digest's definition of a vertex, and say how many constraints and bounds it requires to hold exactly in this two-variable problem.
