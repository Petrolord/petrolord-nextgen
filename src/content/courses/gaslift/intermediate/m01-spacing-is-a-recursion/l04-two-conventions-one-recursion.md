# Two conventions, one recursion

Surface close and constant pressure are the same spacing recursion with the decrement set to a number or set to zero.

{{panel:pd-valve-explorer}}

## The same well, run both ways

westTexasOil on its published surfaceClose setup at 25.00 psi per valve places 8 valves and stops on targetDepth at 7500.000000000 ft. The same well on constantPressure places 6 and stops at the same 7500.000000000 ft.

| Valve | surfaceClose depth, ft | Stage, psia | constantPressure depth, ft | Stage, psia |
| --- | --- | --- | --- | --- |
| 1 | 2119.249955500 | 1014.7000 | 2119.249955500 | 1014.7000 |
| 2 | 3682.716555365 | 989.7000 | 3747.580730281 | 1014.7000 |
| 3 | 4901.841045467 | 964.7000 | 5088.844536812 | 1014.7000 |
| 4 | 5834.735659024 | 939.7000 | 6193.462959646 | 1014.7000 |
| 5 | 6530.440873303 | 914.7000 | 7103.069565100 | 1014.7000 |
| 6 | 7030.205599209 | 889.7000 | 7500.000000000 | 1014.7000 |
| 7 | 7368.625365430 | 864.7000 | no valve | |
| 8 | 7500.000000000 | 839.7000 | no valve | |

Valve 1 is identical in both columns, because it is placed before any decrement has been applied. Every valve under it sits deeper on constant pressure, since the injection line is not being lowered stage by stage and there is more head to spend.

## Wider steps, fewer mandrels, worse unloading

The same run on midDecrementKnifeEdge, published at 26.75 psi per valve, gives 7 valves on surfaceClose and 6 on constantPressure, both reaching 9000.000000000 ft. Both wells tell the same story about the trade. westTexasOil multipoints at stages 2, 3 and 4 on surfaceClose and at 2, 3, 4, 5 and 6 on constant pressure. midDecrementKnifeEdge multipoints at 2, 3, 4 and 5 on surfaceClose and at 2, 3, 4, 5 and 6 on constant pressure.

Holding the surface pressure reaches the target in fewer mandrels and wider steps, and it removes the mechanism that shuts the upper valves. The string that needs fewer mandrels is the string more likely to inject at two depths.

## The mistake

Reading constant pressure as a second algorithm with its own rules, then looking for a separate closing criterion in it. There is one recursion. The engine sets the decrement to zero and runs the identical fixed point, which is why the published constantPressurePPO case carries a decrement input of 0.00 psi per valve rather than a different method flag in its spacing math. The consequence is that everything true of the recursion stays true: the top valve is still the one depth a convention change cannot move, and the increments still shrink downward.

## What it refuses

Neither convention is recommended by the engine and neither is checked for feasibility at surface. Constant pressure asserts a compressor that holds 1114.7 psia through the whole unloading on constantPressurePPO, and surface close asserts one that can bleed by a fixed step and hold each step. The module has no facility model to test either claim against.

## Exercise

Run westTexasOil on both conventions and record the valve count, the deepest mandrel and the multipointing stages for each.

Then state, in one sentence, why fewer valves is not the same as a better design here.
