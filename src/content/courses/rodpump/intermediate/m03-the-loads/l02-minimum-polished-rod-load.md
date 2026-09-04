# Minimum polished rod load

The smallest load on the returned card, and the harder of the two to compute. Its errors are larger, its datum is different, and a healthy value hides compression further down the string.

{{panel:pd-card-explorer}}

## The datum is the buoyed weight alone

On the upstroke the polished rod carries the rods and the fluid load. On the downstroke the travelling valve opens and the fluid load transfers to the tubing, so what is left is the buoyed rod weight.

At 0.5 spm the published taper reads a minimum of 8586.448887 lb against a buoyed weight of 8673.757962 lb. That is the static limit. At 5 spm the minimum is 7192.002480 lb, standing 1481.755481965 lb below the buoyed weight, and at 9 spm it is 5823.210940 lb, standing 2850.547021552 lb below it.

## It falls with speed as steadily as the peak rises

| Speed, spm | Minimum load, lb |
| --- | --- |
| 0.5 | 8586.448887 |
| 1.0 | 8429.556204 |
| 1.5 | 8275.653089 |
| 2.0 | 8105.952348 |
| 2.5 | 7952.992968 |
| 3.0 | 7817.180698 |

The fall continues without a step back through 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 and 15 spm, reaching 3651.294230 lb at the top of the ladder. On ODUMA-4 at 10 spm the reported minimum is 2625.472705679 lb, at cycle fraction 0.718331 and a polished rod position of -68.394081411 in.

## It is the number the two solvers agree on least

The oracle committed 7116.722143876 lb at 5 spm and 5797.468233684 lb at 9 spm. The engine returns 75.280335942 lb more at the first, 1.057795 percent, and 25.742706548 lb more at the second, 0.444034 percent.

Compare that with the peak, where the two routes sit 0.005023 and 0.332251 percent apart on the same two runs. The published gates say the same thing: 2 percent on plunger stroke and 3 percent on the minimum load. The minimum is given the loosest gate in the suite because it is the hardest extreme to land on.

## A positive minimum is not proof of tension

ODUMA-4 reports a minimum polished rod load of 2625.472705679 lb, comfortably in tension. The section loads from the same design tell a different story further down: the top section runs between 19800.044639 lb and 2331.994757 lb, the middle between 13769.757977 lb and 67.196301 lb, and the bottom section between 9217.461976 lb and -1100.730218 lb, a minimum stress of -2491.543540 psi.

The bottom of the string goes into compression on a design whose surface minimum never approaches zero. And the engine models no rod buckling and no sinker bar, so nothing in the result warns about it.

## Exercise

Write the minimum at 0.5 spm and the buoyed weight it stands against, then the minimum at 9 spm and how far below that weight it sits.

Then write the three section minimum loads for ODUMA-4 and say which one is in compression while the reported minimum is not.
