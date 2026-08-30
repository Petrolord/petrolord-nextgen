# Tensile capacity

What the pipe can be pulled with, and how the number is built.

{{panel:td-buckling-explorer}}

## The expression

    tensile capacity = yield stress x cross-sectional area

For the drill pipe in this course, a yield of 930792195 Pa over the annulus between 0.127 m and 0.1086104 m of diameter gives 3167446.9781754497 N.

That is the load at which the pipe body reaches its yield stress in pure tension. Nothing else.

## What it is not

**It is not a working limit.** Design practice pulls to a fraction of it, typically 85 or 90 percent, and treats anything above that as an emergency.

**It is not the string's capacity.** Tool joints, upsets and connections have their own ratings, and a worn or damaged joint has less. The weakest link is often a connection rather than the pipe body.

**It is not derated for wear.** A pipe whose wall has been reduced by internal or external wear has proportionally less area and proportionally less capacity, and the model here uses the nominal dimensions.

**It is not a combined-loading limit.** A pipe carrying torque at the same time has less tensile capacity, which is the subject of a later lesson in this module.

## Where the load sits

The maximum tension is at the top of the string in every operation in this course, because tension accumulates upward.

So the utilization check is really a check at the surface, and the pipe at surface is the pipe that sees the worst of it. That is why a tapered string puts heavier-walled pipe at the top.

## The numbers

Maximum tension utilization, rotating on bottom:

| well | worst tension utilization |
|---|---|
| vertical | 0.20310094303602616 |
| slant | 0.2307349472932466 |
| build and hold | 0.18186796279416603 |
| three-dimensional turn | 0.11230771953702762 |

All comfortable. The highest is the slant well at 23 percent, which is a 3000 m string with a long hold that carries most of its weight axially.

## The one that is missing from the table

The horizontal well, which is in the next lesson's table instead, because on it tension is not the interesting number.

## The overpull margin

The number a driller actually cares about is not the utilization but the OVERPULL: how much more than the free pick-up hookload can be applied before the pipe yields.

On the build-and-hold well, pick up is 1063113.0483217717 N against a capacity of 3167446.9781754497 N, so about 2.1 MN of overpull is theoretically available before yield, and design practice would use rather less of it.

That margin is what you have if the string sticks, and it is why tensile capacity matters even though it is nowhere near binding in normal operation.

## Exercise

Compute the tensile capacity from the yield stress and the two diameters yourself.

Then compute the overpull margin at 90 percent of yield for the slant well, and say whether it is larger or smaller than the build-and-hold well's.
