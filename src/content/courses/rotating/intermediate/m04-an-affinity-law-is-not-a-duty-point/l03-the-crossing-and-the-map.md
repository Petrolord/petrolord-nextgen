# The crossing and the map, side by side

Both answers are right. They answer different questions, and the only way to keep them straight is to compute both and label both, which is what the engine and the studio do.

{{panel:fc-suction-explorer}}

## A trim, both ways

| trim ratio | re-solved flow gpm | re-solved head ft | one-point flow gpm | one-point head ft | flow quotient | head quotient |
| --- | --- | --- | --- | --- | --- | --- |
| 1.000000 | 1234.452969 | 417.801018 | 1234.452969 | 417.801018 | 1.000000000 | 1.000000000 |
| 0.950000 | 1131.756344 | 384.664421 | 1172.730321 | 377.065419 | 1.036203885 | 0.980245113 |
| 0.900000 | 994.911823 | 344.979482 | 1094.342557 | 328.266260 | 1.099939243 | 0.951552997 |
| 0.850000 | 851.147837 | 308.788996 | 1017.806473 | 283.749561 | 1.195804570 | 0.918910857 |
| 0.800000 | 695.297235 | 275.923397 | 943.122068 | 243.327313 | 1.356430057 | 0.881865458 |
| 0.750000 | 515.331652 | 246.213642 | 870.289343 | 206.811504 | 1.688794663 | 0.839967688 |

## A speed change, both ways

| speed ratio | re-solved flow gpm | re-solved head ft | one-point flow gpm | one-point head ft | flow quotient | head quotient |
| --- | --- | --- | --- | --- | --- | --- |
| 0.700000 | 502.692592 | 244.459069 | 864.117078 | 204.722499 | 1.718977148 | 0.837451028 |
| 0.800000 | 791.589335 | 295.447319 | 987.562375 | 267.392652 | 1.247569076 | 0.905043418 |
| 0.900000 | 1024.855758 | 353.226726 | 1111.007672 | 338.418825 | 1.084062477 | 0.958078196 |
| 1.000000 | 1234.452969 | 417.801018 | 1234.452969 | 417.801018 | 1.000000000 | 1.000000000 |
| 1.100000 | 1430.823522 | 489.171266 | 1357.898266 | 505.539232 | 0.949032669 | 1.033460604 |

The quotient columns are the one-point answer over the re-solved answer. Both tables hold the same system and start from the same base duty of 1234.452969 gpm at 417.801018 ft, and both carry a row where the ratio is 1.000000 and every quotient is 1.000000000, because on that row the machine was not changed and the two questions collapse into one.

## The map is a real point on the new curve

It would be easy to read the one-point answer as an approximation that the re-solve corrects. It is not an approximation of anything.

At a trim ratio of 0.950000 the one-point answer is 1172.730321 gpm at 377.065419 ft, and the scaled curve read at that flow gives 377.065419 ft, a difference of 0 ft. The point sits on the new machine's curve exactly. It is a point on the machine you now have, and it is simply not where that machine will run.

What makes it not the operating point is the system. The new curve has a head for every flow, and only one of those flows is the one where the piping demands exactly the head the machine makes.

## Which one answers which question

The re-solved figures answer "where will this pump run after the change". That is the duty, and everything downstream hangs off it: the power, the region, the suction margin. A power figure built on a one-point flow is a power figure for a flow the pump will not deliver, and it is wrong in a way no unit check and no order-of-magnitude check will catch.

The one-point figures answer "where does my current operating point go when the machine is scaled". That is a question about the machine, and it is the right question when the subject is the change itself. It is also the honest way to show a reader what a proposed trim or speed change does to the duty they know, before showing them the duty they will get.

Computing both costs one extra call and removes the whole class of confusion. Computing one and labelling it generically is what creates the confusion.

## The mistake

The mistake is taking a quotient column as an error. At a speed ratio of 0.700000 the flow quotient is 1.718977148, and nothing there is wrong by that factor. It is the distance between two correct answers to two questions.

The second mistake is reading the two tables as though the direction were fixed. At a speed ratio of 1.100000 the flow quotient is 0.949032669 and the head quotient is 1.033460604, which is the opposite arrangement to the row at 0.700000.

## Exercise

At a trim ratio of 0.800000 and at a speed ratio of 0.800000, give both flows and both heads with their quotients. Then state the evidence that the one-point answer lies on the scaled curve, and say which of the two answers a power calculation should be built on.
