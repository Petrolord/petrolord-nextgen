# Where this course hands over

Crude Assay & Blending is the first course in the Commercial & Trading module, and Refinery Feasibility & Planning follows it there. Terminals, Depots & Fuel Supply sits in the Supply Chain & Logistics module. This lesson says where those two courses pick up.

## What this course owns

Two things run through all three tiers. The first is that every property of a blend is computed on its own basis: gravity through specific gravity on volume, sulfur and the other per-mass properties on mass, viscosity through an index, yields on volume off the curve. The second is that every least-cost recipe is a linear programme whose binding specifications, value of relief and infeasibility are answers in their own right.

The second belongs to the whole Commercial & Trading module. This tier taught it once, completely:

- a linear programme is an objective, rows and bounds, and its optimum sits on a vertex;
- the kernel's status is optimal, infeasible or unbounded, and each is an answer;
- two phases find a feasible point and then the best one, and Bland's rule keeps a degenerate blend from cycling;
- a limit on a ratio is the linear row sum((w_i - L d_i) v_i) <= 0, on a declared basis of volume, mass or index;
- a binding specification is met exactly, and the others give quality away;
- rowPrice is a row's dual, and the price is the money one whole unit of relief saves, per unit of the property;
- the marginal barrel is the volume row's price, and it can differ from the average barrel;
- a shadow price is a rate, and a whole unit of relief is checked by re-solving;
- infeasible, refused and skipped are three different results, each read in its own way.

## Where refinery picks up

The same kernel plans a refinery, and the `refinery` course (Refinery Feasibility & Planning) owns that work: the refinery plan, the schedule, the variance model and the modular feasibility screen. It leans on the vocabulary above and does not teach it again.

## Where supply picks up

The `supply` course (Terminals, Depots & Fuel Supply) owns what happens to a product once it is in a tank: strapping, the volume correction factor, free water, stock reconciliation, queues, landed cost and pump price. The Apapa cargo in this tier is a recipe: which components, in what volumes, at what cost. What happens to it in a terminal's tanks is that course's material.

## What neither module teaches

Net present value, internal rate of return, Monte Carlo and decision trees belong to the Economics courses.

## Reading any recipe from here on

A learner leaving this course can read any least-cost result, from any app on this kernel, in one order: status, skipped, recipe and bounds, binding, giveaway, prices of relief, the marginal barrel, and a re-solve for any move larger than a small step. None of them is read before the status.

## Exercise

Read the Apapa price table's Total volume row, 87.5108 $/bbl, and the Sulfur maximum row, 551.8026 $ per ppm with rowPrice -0.0914. Say which of the two reads the same in both columns and why, and say what a planner in the `refinery` course would need from this course to read a shadow price there without being taught it again.
