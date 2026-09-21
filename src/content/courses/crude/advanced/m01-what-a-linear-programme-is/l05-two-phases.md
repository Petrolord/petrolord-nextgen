# Two phases

The kernel's method is two-phase simplex. The name describes the order of work: first find any point that meets every row, then improve it to the best one. Each phase answers a different question, and one of the three statuses belongs to each.

## Phase one: is there any recipe at all

Phase two moves from vertex to vertex, and phase one finds the point it starts from: any point that meets every row. The batch row is an equation, sum(v_i) = target, and the origin does not satisfy it.

Phase one drives artificial variables to zero. If it succeeds, the point it ends on meets every real row, and phase two can begin from it. If it cannot, the rows contradict, and the answer is infeasible. In the digest's words, if phase one cannot, "the rows contradict and the answer is infeasible."

## Phase two: from vertex to vertex

From a feasible vertex, phase two looks for a neighbouring vertex with a better objective. It moves one variable into the set that defines the corner and moves another out, a step called a pivot. Phase two ends at the optimum, or with the status unbounded.

In the textbook case the kernel reports 2 iterations to reach x 3.0000, y 1.5000, objective 21.0000. iterations counts the pivots of both phases together.

## Why degeneracy matters in blending

A vertex is degenerate when more constraints hold exactly than are needed to pin it. Blending problems are degenerate constantly, because specifications bind exactly at the optimum. Module three reads the Apapa optimum, where Sulfur and RVP are both met exactly.

The kernel uses Bland's rule to pick the entering variable, which cannot cycle.

## What the two phases give the reader

Every result is the product of both phases. An optimal status says phase one found a feasible corner and phase two found the best one. An infeasible status says phase one could not begin. An unbounded status says phase two found a direction with no end.

The kernel works with absolute tolerances on its pivots and on phase one, and module six states them as a limit: the digest calls them right for the barrel-scale problems the two apps pose.

{{panel:crude-recipe-explorer}}

In the panel, step the textbook case one pivot at a time and watch the point move from corner to corner.

## Exercise

Read the textbook result: status optimal, objective 21.0000, iterations 2. Then read the digest's statement that phase one drives artificial variables to zero and, if it cannot, the rows contradict. Say which phase decides the infeasible verdict in the digest's problem with x + y <= 2 and x + y >= 3, and say which phase's work the textbook result's optimal status reports.
