# Two phases

The kernel's method is two-phase simplex. The name describes the order of work: first find any point that meets every row, then improve it to the best one. Each phase answers a different question, and one of the three statuses belongs to each.

## Phase one: is there any recipe at all

A simplex method walks from vertex to vertex, so it needs a vertex to start from. For a problem with only <= rows, right-hand sides of zero or more and zero lower bounds, the origin is one. A blend is never that simple. The batch row is an equation, sum(v_i) = target, and the origin does not satisfy it.

Phase one solves this by adding an artificial variable to each row that the starting point cannot satisfy, and then driving those artificial variables to zero. If it succeeds, the point it ends on meets every real row, and phase two can begin from it. If it cannot, the rows contradict, and the answer is infeasible. So infeasible is not a guess or a timeout. It is what phase one proves when the artificial variables cannot all be removed.

## Phase two: from vertex to vertex

From a feasible vertex, phase two looks for a neighbouring vertex with a better objective. It moves one variable into the set that defines the corner and moves another out, a step called a pivot. Each pivot either improves the objective or leaves it unchanged, and when no neighbour is better the current vertex is the optimum. If some direction improves the objective forever without meeting a constraint, the status is unbounded.

In the textbook case the kernel reports 2 iterations to reach x 3.0000, y 1.5000, objective 21.0000.

## Why degeneracy matters in blending

A vertex is degenerate when more constraints hold exactly than are needed to pin it. Blending problems are degenerate constantly, because specifications bind exactly at the optimum. Module three reads the Apapa optimum, where Sulfur and RVP are both met exactly.

At a degenerate vertex a pivot can change which constraints define the corner without moving the point at all. A careless rule for choosing pivots can then cycle through the same set of corners forever. The kernel uses Bland's rule to pick the entering variable, which cannot cycle. The rule is a small detail with a large consequence for exactly the problems this tier cares about.

## What the two phases give the reader

Every result is the product of both phases. An optimal status says phase one found a feasible corner and phase two found the best one. An infeasible status says phase one could not begin. An unbounded status says phase two found a direction with no end.

The kernel works with absolute tolerances on its pivots and on phase one, and module six states them as a limit: the digest calls them right for the barrel-scale problems the two apps pose.

{{panel:crude-recipe-explorer}}

In the panel, step the textbook case one pivot at a time and watch the point move from corner to corner.

## Exercise

Read the textbook result: status optimal, objective 21.0000, iterations 2. Then read the digest's statement that phase one drives artificial variables to zero and, if it cannot, the rows contradict. Say which phase decides the infeasible verdict in the digest's problem with x + y <= 2 and x + y >= 3, and say which phase's work the textbook result's optimal status reports.
