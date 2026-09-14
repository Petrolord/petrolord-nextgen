# Best value at each budget

The efficient frontier answers the funding question at every budget up to the limit at once: for each level of spend, the largest summed risked EMV that any whole set of projects reaches inside it. On OKONO at a limit of 450.0000 million USD it runs from point 0 to point 11.

{{panel:ec-capital-explorer}}

## One knapsack at every budget

The optimizer funds each project in full or not at all and maximises risked EMV with capex inside the limit. The frontier comes out of the same solve. Every budget on the grid, from 0.0000 to the limit, has its own best value, and the frontier keeps a point wherever that best value rises. Each point is printed at the capex its best set actually costs.

| point | capex | EMV |
| --- | --- | --- |
| 0 | 0.0000 | 0.0000 |
| 1 | 60.0000 | 38.0000 |
| 2 | 90.0000 | 41.2500 |
| 3 | 120.0000 | 89.7500 |
| 4 | 180.0000 | 127.7500 |
| 5 | 210.0000 | 131.0000 |

## Naming the set behind a point

A point is a capex and a value, and nothing more. The set behind it is read from the inventory by hand. At 60.0000 the only project that fits is OK-5, Workovers, with a risked EMV of 38.0000. At 90.0000 OK-3 fits on its own and beats it, 41.2500 against 38.0000. At 120.0000 OK-1 alone gives 89.7500. At 180.0000 OK-1 and OK-5 together cost 120.0000 plus 60.0000 and return 89.7500 plus 38.0000, which is 127.7500. At 210.0000 OK-1 and OK-3 return 89.7500 plus 41.2500, which is 131.0000.
## Sets are solved, never built up

Watch the membership move. OK-3 is the whole set at point 2 and gone at point 3. OK-5 joins at point 4 and leaves again at point 5, where OK-3 comes back in its place. No point inherits the set of the point before it. Each budget is a fresh optimisation over all six projects, and the best set at a larger budget is free to drop anything the smaller one funded.

## The mistake

The common mistake is to read the frontier as a smooth curve and interpolate between its points. A budget anywhere from 120.0000 up to just short of 180.0000 buys exactly 89.7500, the value of the lower point, because no whole set of OKONO projects between those two capexes does better. It never buys a share of the 38.0000 that the next point adds.
The second mistake is to read a point as a recipe to add to what was funded before. Point 5 is not point 4 plus something; it replaces OK-5 with OK-3.

## What it refuses

The frontier ranks on risked EMV alone. It carries no spread and no chance of loss. It funds projects whole, spends each capex in one period without phasing, and adds no time value beyond the NPVs entered. It also stops at the limit it was given, so a frontier run to 450.0000 says nothing about what 480.0000 would buy.

## Exercise

Name the set behind each of points 1 to 5 and prove its capex and its EMV from the inventory. Then say what a budget just short of 90.0000 buys, and which project leaves the set between point 4 and point 5.
