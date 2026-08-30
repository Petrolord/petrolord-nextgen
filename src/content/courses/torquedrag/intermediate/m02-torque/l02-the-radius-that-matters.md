# The radius that matters

Which diameter carries the moment, and the third you lose by choosing wrong.

## The moment arm

Torque is a force times a distance. The tangential friction force acts at the surface that is touching the wall, so the distance is the radius of THAT surface.

For a drill string, that is the tool joint, not the pipe body.

## The numbers

| surface | diameter | radius |
|---|---|---|
| drill pipe body | 0.127 m | 0.0635 m |
| drill pipe tool joint | 0.168275 m | 0.0841375 m |
| heavy weight tool joint | 0.1651 m | 0.08255 m |
| drill collar | 0.17145 m | 0.085725 m |

Tool joint radius over body radius is 0.0841375 / 0.0635 = 1.3250.

So using the pipe body radius understates the torque by 24.52830188679246 percent, which is very nearly a quarter.

## Where it enters twice

The radius appears in the torque recursion as the moment arm:

    M(above) = M(below) + ft mu N r

And it appears in the tangential velocity, which sets the direction cosines:

    vt = 2 pi r rpm / 60

So getting the radius wrong changes both the moment arm AND the split between axial and tangential friction. The two effects are in the same direction for torque and in opposite directions for hookload.

## The engine's choice

    const rTorque = (comp.tooljointOdM ?? comp.odM) / 2;

Tool joint outer diameter if the component declares one, otherwise the body diameter. Drill collars in this fixture declare no tool joint, which is correct: a collar is a single piece of steel with no upset, so its body IS the contact surface.

## Why this is a common error

Because a string description is often entered as a list of pipe sizes, and the tool joint diameter is a separate column that is easy to leave blank.

A blank tool joint column silently drops the torque by about a quarter, and a quarter is exactly the size of error that looks like a friction factor problem. The engineer then fits a higher friction factor to compensate and the hookload prediction, which barely depends on the radius, goes wrong in the other direction.

## The check

Take the surface torque, divide by the tool joint radius, and see whether the implied total tangential friction force is plausible against the total side force in the well.

On the build-and-hold well rotating off bottom, 26357.98350914472 N.m divided by 0.0841375 m is about 313 kN of tangential friction, against a maximum side force of 1167.5116395360324 N per metre over a few hundred metres of build. That is the right order.

## Exercise

Recompute the build-and-hold well's off-bottom torque as if the pipe body radius had been used, by scaling.

Then say why that scaling is only approximate, using the fact that the radius also enters the tangential velocity.
