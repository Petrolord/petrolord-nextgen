# Bounds that cross

Every component carries two bounds: a minimum, which forces barrels in, and a maximum, which is the tank. Each bound is a number the user types, and the engine checks each before it builds a single row.

## What the optimizer refuses

| asked | what the engine returned |
| --- | --- |
| Butane with a maximum of -50 | REFUSED: Butane maximum must be a number of zero or more. Leave a maximum blank for no limit. |
| Reformate with a minimum of 3000 and a maximum of 2000 | REFUSED: Reformate has a minimum above its maximum. |

A negative maximum describes no tank. The message says what a maximum must be, and it reminds the user of the blank rule from lesson two: a blank means no limit, so there is never a reason to type a negative number to mean one.

A minimum above a maximum describes no volume. No quantity of Reformate is both at least 3000 and at most 2000 bbl. The engine names the component and the fault.

## The same fault, one level down

Module one met this fault inside the kernel. The digest's problem "minimise x with a lower bound of 5 above an upper bound of 3" returns the status infeasible from solveLP. The kernel is right: a variable with crossed bounds has no feasible value, so the problem has no feasible point.

optimiseBlend catches the same fault earlier and says it in plainer words. The two layers divide the work. The kernel answers mathematical questions with a status. The optimizer knows which component the user typed wrongly and can name it. A trader reading "infeasible" would search the specifications for a conflict that is not there. A trader reading "Reformate has a minimum above its maximum" goes straight to the field.

## A floor that holds

A minimum that sits below its maximum is a legitimate instruction: blend at least this much. The digest solves the Apapa cargo with an Isomerate floor:

| asked | status | Isomerate bbl | total cost $ | binding | sulfur relief $ per ppm |
| --- | --- | --- | --- | --- | --- |
| Isomerate at least 1200 bbl | optimal | 1200.0000 | 698909.5490 | Sulfur, RVP | 537.5403 |

The recipe takes exactly the floor, 1200.0000 bbl, so the floor itself holds exactly. Sulfur and RVP still bind. The total cost is 698909.5490 $, against the Apapa optimum of 698701.5605 $ with no floor, and the sulfur relief is 537.5403 $ per ppm, against 551.8026 at the Apapa optimum without the floor. The digest prints no difference column for either pair.

## How the kernel carries a floor

A minimum forces barrels into the recipe. Every specification row then sits off zero after the kernel shifts the floor to the origin. The kernel works with variables that start at zero, so it measures Isomerate from its floor of 1200 bbl, and every row picks up the contribution of those fixed barrels on its right-hand side. That is why phase one matters for floors: the shifted rows do not pass through the origin.

A floor also changes the vertex. With Isomerate held exactly at its minimum, a bound holds that did not hold at the Apapa optimum, so the optimum sits on a different set of constraints, and the shadow prices are read at that new vertex. That is why the sulfur relief is a different figure here.

{{panel:crude-recipe-explorer}}

In the panel, type a Reformate minimum above its maximum and read the refusal. Then set an Isomerate floor of 1200 bbl and read the recipe, the binding list and the sulfur relief.

## Exercise

Read the Isomerate floor row: 1200.0000 bbl, total cost 698909.5490 $, sulfur relief 537.5403 $ per ppm. Read beside it the Apapa optimum of 698701.5605 $ and sulfur relief of 551.8026 $ per ppm. Say what the Isomerate volume shows about the floor, and what the different sulfur relief shows about where the shadow price is read.
