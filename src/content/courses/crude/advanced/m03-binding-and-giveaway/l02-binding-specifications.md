# Binding specifications

A recipe answers what to blend. The specification table answers why, because it shows which limits the least-cost recipe is pressed against. Those are the binding specifications, and they are the most useful line in any blending result.

## The Apapa specifications

| specification | min | max | achieved | giveaway | binding | basis |
| --- | --- | --- | --- | --- | --- | --- |
| RON | 91 | no maximum | 94.5010 | 3.5010 | false | volume |
| MON | 81 | no maximum | 84.4928 | 3.4928 | false | volume |
| Sulfur | no minimum | 50 | 50.0000 | 0.0000 | true | mass |
| RVP | no minimum | 9 | 9.0000 | 0.0000 | true | index |
| Density | 0.72 | 0.775 | 0.7547 | 0.0203 | false | volume |

Binding: Sulfur and RVP.

## What binding means

A binding specification is met exactly. Sulfur comes out at 50.0000 against a maximum of 50, and RVP at 9.0000 against a maximum of 9. The optimum is pressed against each of them, and relaxing either one lowers the cost. That is the definition that matters to a planner: a binding limit is a limit that is costing money.

The engine decides binding by a stated test. A specification counts as binding when the achieved value is within BINDING_TOLERANCE, 1e-7, times the limit (or 1, if larger) of it. So binding is a property the engine computes and reports, and a reader never has to judge by eye whether 50.0000 is close enough to 50.

The other three are not binding. RON, MON and Density each sit inside their limits, and each carries a giveaway that the next lesson reads.

## Why the optimum presses against limits

Module one showed that the optimum of a linear programme sits at a vertex, where enough constraints hold exactly to pin every variable. At Apapa there are four variables. Four things hold exactly: the batch row, Butane's upper bound, the sulfur row and the RVP row. That is the count a vertex needs, and it is why a least-cost blend so often has binding specifications. The recipe moves toward lower cost until some limit stops it, and the limits that stop it are the ones that bind.

Read the component table beside the binding list. FCC gasoline costs 84.9 $/bbl and carries 110 ppm of sulfur against a limit of 50. Butane costs 54.1 $/bbl and carries an RVP of 52.8 psi against a limit of 9. The exercise asks what those pairs show.

## Binding is a verdict about this pool

A specification binds in a particular recipe for a particular pool and a particular set of prices. The AGO cargo at the same terminal binds on Cetane number and Density, and there sulfur carries a giveaway of 21.8467. Binding is never a property of the specification alone.

Nor is it a warning. A binding specification is met, exactly and on the engine's own basis. The check in module two confirms it at Apapa: propertyOfBlend recomputes Sulfur as 50.0000 and RVP as 9.0000 from the finished barrels.

## What comes next

Every binding specification has a price, which module four reads: the money one unit of relief saves. Every non-binding one has a giveaway, which the next lesson reads, and a price of zero.

{{panel:crude-recipe-explorer}}

In the panel, tighten the RON minimum step by step and watch for the moment RON joins the binding list.

## Exercise

Read the Apapa specification table: Sulfur achieved 50.0000 with giveaway 0.0000 and binding true, RON achieved 94.5010 with giveaway 3.5010 and binding false. Say what the pairing of a zero giveaway with binding true shows in every row of the table, and name the four things that hold exactly at the Apapa optimum. Then read FCC gasoline's sulfur of 110 ppm against the limit of 50 ppm, and Butane's RVP of 52.8 psi against the limit of 9 psi, and say what those two pairs show about why these two rows are the binding ones.
