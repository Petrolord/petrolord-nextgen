# A specification not applied

Some specifications cannot be imposed on the pool as typed. The engine does not drop them silently, and it does not refuse the whole cargo either. It solves without them and lists each one as skipped, with the reason in its own words.

## Two skipped sulfur specifications

| asked | status | total cost $ | skipped | reason (the engine) |
| --- | --- | --- | --- | --- |
| Isomerate with no sulfur figure | optimal | 695245.0644 | Sulfur | Not every component carries this property, so the specification was not applied. |
| FCC gasoline with no SG and no API | optimal | 695245.0644 | Sulfur | This property blends on mass and not every component has a density (sg or API), so the specification was not applied. |

Both are the Apapa pool with one figure removed, and both come back optimal with Sulfur listed as skipped. The reasons differ.

## When a component lacks the property

A sulfur row needs a sulfur figure on every component, because every component's coefficient in the row is built from it. If Isomerate carries no sulfur figure, the row cannot be built. The engine will not fill the gap with zero, which would make Isomerate look sulfur-free and let the recipe lean on it for a reason nobody typed. So the sulfur specification is not applied, and the result says so.

## When a mass basis lacks a density

Sulfur blends on mass. On the mass basis both weights carry the specific gravity: w_i is SG x sulfur and d_i is SG. If FCC gasoline has no SG and no API, its mass weight is unknown and the row cannot be built, even though every component still has a sulfur figure. This is the Associate tier's rule carried into the optimizer: every mass property is weighted by density, and without a density there is no mass.

## Why the engine skips

A missing sulfur figure is a gap in the data for one specification. The other specifications can still be met, and a recipe that meets them is information a planner can use, provided the planner knows sulfur was not imposed. So the engine solves and lists the specification as skipped, with the reason. A reader who sees the skipped list knows at once that this recipe is not certified on sulfur.

Contrast the blank cost of the previous lesson. A cost is part of the objective, so without it there is no least-cost question at all, and the engine refuses. A specification is one row among several, so without it there is still a question, only a smaller one.

## Reading a skipped result

Read the skipped list before the recipe. The total cost of 695245.0644 $ is the cost of meeting every specification except sulfur. It is not the cost of the Apapa cargo on the 50 ppm template, which is 698701.5605 $ with sulfur applied. A skipped specification also has no achieved value to read here, because the digest prints none for these two cases, and no price of relief, because there is no row to price.

The skipped list is part of the answer. A recipe with a skipped sulfur row is a recipe for a different question, and it needs the missing figure before it can be offered as a cargo to the template.

{{panel:crude-recipe-explorer}}

In the panel, clear Isomerate's sulfur figure and read the skipped list. Restore it, clear FCC gasoline's SG, and read the reason the engine gives.

## Exercise

Read the two skipped rows: both optimal at 695245.0644 $, both skipping Sulfur, with two different reasons. Read also the Apapa total of 698701.5605 $ with sulfur applied. Say what the shared total of the two skipped rows shows about the problem the kernel solved in each, and say why the second reason arises although every component still carries a sulfur figure.
