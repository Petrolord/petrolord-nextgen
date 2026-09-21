# An objective, rows and bounds

Before any blending, the course poses the textbook case, because a problem in two variables can be drawn and every part of it can be seen. Two products, x and y, share two units of plant. Each unit of x earns 5 and each unit of y earns 4. The first unit has 24 hours and x takes 6 of them while y takes 4. The second unit has 6 hours and x takes 1 while y takes 2.

## The three parts

**The objective** is what the kernel improves: maximise 5x + 4y. A blend minimises cost; this textbook case maximises earnings. The kernel minimises, or maximises when asked.

**The rows** are the shared constraints: 6x + 4y <= 24 and 1x + 2y <= 6. Each row is a linear expression, a sense (<=, = or >=) and a right-hand side. A row ties the variables together, because it limits what they do jointly.

**The bounds** belong to one variable each: here x and y are at least 0. The course says how the kernel takes them: "The bounds are passed apart from the rows: the kernel shifts every lower bound to the origin, and it gives a bound no shadow price." In a blend every component has a floor and a tank limit, and a component held at its limit reports as a component at its availability, which module three reads at Apapa.

## The answer and how it is reported

solveLP returns a status and, when the status is optimal, the point and its value:

| status | x | y | objective | shadow price, row 1 | shadow price, row 2 | iterations |
| --- | --- | --- | --- | --- | --- | --- |
| optimal | 3.0000 | 1.5000 | 21.0000 | 0.7500 | 0.5000 | 2 |

Read it in order. The status is optimal, so a best point exists and was found. The point is x 3.0000 and y 1.5000, and there the objective is 21.0000. Each row carries a shadow price, 0.7500 on row 1 and 0.5000 on row 2, which module four makes the centre of the tier. The kernel reached the answer in 2 iterations: iterations counts the pivots the kernel made, phase one and phase two together.

## Mapping the parts onto a blend

The same three parts build every recipe. The variables are the component volumes. The objective is cost, the sum of each volume times its price, minimised. The rows are the batch, where the volumes sum to the target, and one row for each limit of each specification. The bounds are each component's minimum and its availability in tank.

The kernel prices each row and gives a bound no shadow price, so which part a fact goes in decides whether it comes back with a price. A specification limits a blended property of several volumes at once, so it is written as a row. A tank limit belongs to one volume, so it is passed as a bound.

{{panel:crude-recipe-explorer}}

In the panel, the textbook case is drawn with its two rows as lines and its bounds as the axes. Move a right-hand side and watch the region change shape, and watch which corner the objective line touches last.

## Exercise

Read the textbook result: x 3.0000, y 1.5000, objective 21.0000. Put those two values into row 1, 6x + 4y <= 24, and into row 2, 1x + 2y <= 6. Say whether each row holds with room to spare or holds exactly at the optimum, and say what that shows about the rows that carry the shadow prices 0.7500 and 0.5000.
