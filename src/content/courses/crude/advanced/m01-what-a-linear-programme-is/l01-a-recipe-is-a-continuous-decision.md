# A recipe is a continuous decision

The Associate and Professional tiers took a blend as given and asked what it is: its gravity, its sulfur, its viscosity, its yields and its worth. This tier turns the question round. A blending terminal holds a set of components, each with a cost, a quality and a volume in tank, and a buyer names a cargo size and a specification. The question is which recipe meets every limit at the least cost. That question has a precise mathematical shape, and this tier teaches the shape first.

## Why the decision is continuous

A recipe is a list of volumes, one per component. Nothing forces a volume to be a whole number of barrels or a round share of the tank. The optimizer's Apapa recipe, which module three reads line by line, puts 3284.6899 bbl of Reformate and 784.1881 bbl of Isomerate into an 8000 bbl cargo. Those are ordinary answers. The decision variables are real numbers, and each one can move by any amount inside its bounds.

## Why the decision is linear

Three facts make the problem linear in those volumes.

First, cost. Each component has a price per barrel, so the cost of the recipe is each volume times its price, summed. Doubling every volume doubles the cost. That is a linear objective.

Second, the batch. The volumes must add up to the cargo. That is one linear equation.

Third, the specifications. A blended property is a weighted average, a sum over components divided by another sum over components. A ratio looks nonlinear, yet a limit on a ratio rearranges into a linear row once both sides are multiplied through by the denominator. Module two shows the step exactly; for now it is enough that it works.

An objective that is linear, and limits that are linear, over variables that are continuous: that is a linear programme.

## What the kernel solves

The Product Blending Optimizer calls optimiseBlend, and optimiseBlend calls one kernel, solveLP in lib/lp/simplex. The kernel's contract is stated plainly: it minimises c'x subject to rows A x (<=, =, >=) b and bounds lo <= x <= hi, or maximises when asked. Its status is always one of optimal, infeasible or unbounded, and the caller is told which.

Every word of that contract will matter. The vector x is the recipe. The vector c is the cost per barrel of each component. The rows are the batch and the specifications. The bounds are what the tanks hold. The status is the first thing to read, because an infeasible answer is still an answer, and the most useful one a trader can get when a cargo cannot be made.

## Why this course owns the method

The same kernel sits under more than one app in the Midstream & Downstream module. This course teaches the method for all of them: rows and bounds, the vertex, binding, the shadow price and infeasible. Later courses lean on this teaching and do not repeat it.

## Exercise

Read the Apapa recipe in the digest: Reformate 3284.6899 bbl, FCC gasoline 3531.1221 bbl, Isomerate 784.1881 bbl and Butane 400.0000 bbl, total 8000.0000 bbl. Say which of the kernel's ingredients (the objective, a row, a bound) each of these facts belongs to: the total of 8000.0000 bbl, the cost of 93.8 $/bbl on Reformate, and the 400 bbl of Butane available. Then say what the fractional volumes show about the kind of decision a recipe is.
