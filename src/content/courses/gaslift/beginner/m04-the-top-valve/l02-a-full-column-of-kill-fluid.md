# A full column of kill fluid

A dead well stands full of kill fluid, and the top valve is the depth where the gas outside the tubing finally weighs more than the liquid inside it.

{{panel:pd-column-explorer}}

## The condition, written as two pressures at one depth

At valve 1 the injection pressure at depth equals the unloading wellhead pressure plus the kill fluid gradient over that depth. Both sides are pressures at the same point, and the depth is whatever makes them equal.

| Case | Wellhead, psia | Kill fluid, psi/ft | Valve 1, ft | Injection pressure there, psia |
| --- | --- | --- | --- | --- |
| westTexasOil | 114.7 | 0.45 | 2119.249994721 | 1068.362497529 |
| deepHighPressure | 214.7 | 0.5 | 2606.192995401 | 1517.796497793 |
| constantPressurePPO | 164.7 | 0.42 | 2410.595757101 | 1177.150217878 |
| midDecrementKnifeEdge | 154.7 | 0.46 | 2354.019705701 | 1237.549064732 |

deepHighPressure carries the highest kickoff of the four and the heaviest kill fluid at 0.5 psi/ft, and lands deepest at 2606.192995401 ft. constantPressurePPO carries the lightest kill fluid at 0.42 psi/ft and reaches 2410.595757101 ft off a lower kickoff. The two inputs pull against each other at every depth.

## The kill fluid is the strongest lever on the string

Walk the kill fluid gradient on westTexasOil and hold everything else at its published value.

| Kill fluid, psi/ft | Top valve, ft |
| --- | --- |
| 0.35 | 2771.766518393 |
| 0.4 | 2401.991474732 |
| 0.45 | 2119.249955500 |
| 0.5 | 1896.053564327 |
| 0.55 | 1715.385652669 |
| 0.6 | 1566.149985252 |

From 0.35 to 0.6 psi/ft the first mandrel travels from 2771.766518393 ft to 1566.149985252 ft. No other single input on this well moves it that far.

## Kill fluid is not the same fluid as the unloading column

westTexasOil declares kill fluid at 0.45 psi/ft and an unloading gradient of 0.1 psi/ft. The first is the dead well before any gas has been put into it, the second is the aerated column left behind once a valve is passing gas. At valve 1 they read 1068.362497529 psia and 326.624999472 psia at the very same depth.

## The mistake

Carrying one gradient into both roles. Use 0.1 psi/ft for the kill column and the top valve runs away deeper than the well; use 0.45 psi/ft for the unloading column and every transfer pressure below valve 1 is far too high, which pulls the whole string shallow.

## What the model refuses

Both lines are straight lines on constant gradients. A real unloading column is neither straight nor constant, and the engine does not pretend otherwise, it simply declares the gradient as an input and stands by it. Nothing here measures a fluid or checks that 0.45 psi/ft was ever true of this well.

## Exercise

Set the kill fluid gradient to 0.35 psi/ft and then to 0.6 psi/ft, and record the top valve at each.

Then say which of the two is the conservative error in a design, and give the reason in terms of what sits below valve 1.
