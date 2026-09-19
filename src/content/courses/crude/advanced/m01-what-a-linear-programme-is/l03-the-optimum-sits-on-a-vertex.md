# The optimum sits on a vertex

A linear programme has infinitely many feasible points whenever it has more than one. The kernel does not search them all, and it does not need to. The digest states the fact that makes the method possible: the optimum of a linear programme, when there is one, is found at a vertex of the feasible region, a point where at least as many constraints and bounds hold exactly as there are variables.

## Why a corner

The feasible region of a linear programme is bounded by flat faces, because every row and every bound is linear. The objective is linear too, so it rises steadily in one direction and has no hump or dip inside the region. Walking in the direction the objective improves, a point can keep moving until it meets a face. Along that face it can often keep moving until it meets another. Where it can move no further is a corner, and a corner is a place where enough constraints hold exactly to pin every variable.

In two variables a vertex is where two lines meet: two rows, a row and a bound, or two bounds. In a blend with four components, a vertex is a point where at least four constraints or bounds hold exactly, counting the batch row among them.

## The textbook case, corner by corner

The digest solves the textbook case at every vertex its two rows and two bounds make. Each point is solved by the kernel with both coordinates fixed by bounds, so the kernel itself reports whether the point is feasible:

| point | objective at the point | feasible (the kernel's status) |
| --- | --- | --- |
| x 0.0000, y 0.0000 | 0.0000 | optimal |
| x 4.0000, y 0.0000 | 20.0000 | optimal |
| x 0.0000, y 3.0000 | 12.0000 | optimal |
| x 3.0000, y 1.5000 | 21.0000 | optimal |

Each row names which constraints hold exactly. At x 0.0000, y 0.0000 both bounds hold. At x 4.0000, y 0.0000, row 1 holds with y on its bound. At x 0.0000, y 3.0000, row 2 holds with x on its bound. At x 3.0000, y 1.5000 both rows hold exactly and neither bound does.

The kernel's optimum for the full problem, x 3.0000, y 1.5000, objective 21.0000, is the last row of that table. The optimum is one of the corners.

## What this means for a blend

Three consequences follow, and every later module leans on them.

First, at the optimum some constraints hold exactly. In a blend those are the binding specifications and the components at a bound. A binding specification is not a coincidence; it is what an optimum looks like.

Second, some constraints hold with room to spare. Those are the specifications with giveaway, and a small change to them does not move the corner at all.

Third, when a limit is moved far enough, the optimum jumps to a different corner. Module four meets this when a shadow price, which is a rate at one corner, is checked against a whole unit of relief.

{{panel:crude-recipe-explorer}}

In the panel, drag the objective line across the textbook region. It leaves the region last at a corner, and as its slope changes the last corner changes with it.

## Exercise

Read the four vertices in the digest's table and their objectives: 0.0000, 20.0000, 12.0000 and 21.0000. Say which one the kernel returns as the optimum of the maximisation. Then name, for that point, which of the two rows and two bounds hold exactly, and say what the count of them shows against the digest's definition of a vertex.
