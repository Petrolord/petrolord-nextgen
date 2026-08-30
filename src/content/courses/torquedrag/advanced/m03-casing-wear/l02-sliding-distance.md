# Sliding distance

How far the steel actually travels, and why the number is so large.

{{panel:td-buckling-explorer}}

## The expression

    sliding distance = 2 pi r x rpm x 60 x hours

with r the tool joint radius. The 60 converts hours to minutes so that rpm can be used directly.

## The number

At 120 rpm for 50 hours with a tool joint radius of 0.0841375 m:

    190314.54136181608 m

One hundred and ninety kilometres of steel-on-steel sliding, from a string that never moved axially at all.

## Why it is so large

Because rotation is relentless. 120 revolutions per minute is 7200 per hour and 360000 in 50 hours, and each one carries the tool joint 0.5286515037828225 m around its own circumference.

The axial distance in the same period is zero. The whole of it is rotation.

## The scaling

| hours at 120 rpm | sliding distance |
|---|---|
| 10 | 38062.90827236322 m |
| 25 | 95157.27068090804 m |
| 50 | 190314.54136181608 m |
| 100 | 380629.08272363216 m |
| 200 | 761258.1654472643 m |

| rpm for 50 hours | sliding distance |
|---|---|
| 60 | 95157.27068090804 m |
| 90 | 142735.90602136205 m |
| 120 | 190314.54136181608 m |
| 150 | 237893.1767022701 m |
| 180 | 285471.8120427241 m |

Both are exactly linear, and 50 hours at 60 rpm gives the same distance as 25 hours at 120. Only the PRODUCT of rpm and hours matters.

## The consequence for planning

Reducing rpm and extending the time by the same factor changes nothing at all in this model.

That is a real prediction and it is worth testing against experience, because it says the only ways to reduce wear are to reduce the side force, reduce the total revolutions, or change the wear factor.

Total revolutions is set by the footage to be drilled and the rate of penetration, so it is not very controllable. Side force is set by the trajectory. The wear factor is set by the mud and the hardbanding.

## What the model leaves out of the distance

The tool joints are not continuous: they are at every 9 or 10 m of pipe. So the wear is concentrated where a joint happens to sit, and the joint moves as the string is tripped.

This model smears the side force over the whole interval and applies the full sliding distance to it. That is a deliberate simplification and it produces a smooth wear profile where a real one is scalloped.

## Exercise

Verify the 50 hour, 120 rpm figure by hand from the tool joint radius.

Then compute how many hours at 90 rpm would produce the same sliding distance, and say whether the model predicts the same wear from it.
