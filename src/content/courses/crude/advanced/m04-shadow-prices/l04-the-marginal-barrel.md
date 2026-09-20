# The marginal barrel

Two numbers describe what a barrel of the Apapa cargo costs, and they answer different questions. The unit cost is the average: total cost over total volume. The volume row's price is the margin: what one more barrel of product would add. A trader quoting a cargo extension needs the second.

## The volume row's price

The batch row is sum(v_i) = target, with the target in barrels. Its right-hand side is already barrels of product, so its dual needs no scaling: rowPrice and the price are the same figure, 87.5108 $/bbl, in the Total volume row of the price table. It is the change in the optimal cost when the batch grows by one barrel, with every specification still met and every bound still respected.

## Average against margin

Side by side, with the difference printed:

| figure | $/bbl |
| --- | --- |
| volume row price (the marginal barrel) | 87.5108 |
| unit cost (the average barrel) | 87.3377 |
| marginal minus average | 0.1731 |
| re-solved at 8001 bbl, cost minus the optimum | 87.5108 |

The last row is the check: solved again at 8001 bbl, the cost rises by 87.5108 $, the price the volume row reported. The marginal barrel is a real cost the kernel reproduces by solving.

## Why the next barrel is not an average barrel

The component at its availability cannot supply the next barrel, so the next barrel is made from the others. At Apapa that component is Butane, at 400.0000 bbl against 400 bbl available, and it costs 54.1 $/bbl. The first 8000 barrels include all 400 of those. Barrel 8001 cannot include any more butane, so it is made from Reformate, FCC gasoline and Isomerate, in whatever proportion still meets sulfur and RVP at the margin.

The average spreads the cost of every barrel already blended, butane included, across the cargo. The margin prices only the next barrel, made without it. The difference is a fact about the recipe's bounds.

## When the two agree

The optimizer's default pool is a gasoline cargo of 1000 bbl on the same 50 ppm template. Its unit cost is 86.1228 $/bbl, and its Total volume row prices at 86.1228 as well. Components at their availability: nothing. At zero: Isomerate. Marginal barrel minus unit cost: 0.0000 $/bbl. With no availability limit pressing, every row but the volume row has a zero right-hand side, so the cost scales with the batch and the marginal barrel costs what the average one does. At Apapa the gap appears because Butane sits at a limit the next barrel cannot move.

## What the trader does with it

A buyer who asks for more cargo is asking for marginal barrels. Quoting them at the unit cost would give away 0.1731 $/bbl on every added barrel at Apapa, at least for as long as the vertex holds. And the vertex will not hold forever: the price of the next barrel is a rate at the current optimum, and a large enough extension changes which constraints bind. Lesson five shows how far a whole unit of relief can stray from a rate.

A refinery's stream values are marginal values of the same kind, from the same kernel, and the `refinery` course reads them.

{{panel:crude-recipe-explorer}}

In the panel, raise Butane's availability until its bound stops binding, and watch the marginal and average barrels move.

## Exercise

Read the Apapa table: marginal 87.5108 $/bbl, average 87.3377 $/bbl, marginal minus average 0.1731, and the 8001 bbl re-solve at 87.5108. Then read the default pool's unit cost, 86.1228, its Total volume price, 86.1228, and its marginal barrel minus unit cost, 0.0000. Say what the Apapa difference shows about Butane's bound, and what the default pool's two figures show about its margin.
