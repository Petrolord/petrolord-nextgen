# Tension along the string

The profile, and what each part of it means.

{{panel:td-string-explorer}}

## What the model returns

One row per grid point, from the bit to surface. Each row carries the measured depth, the inclination, the tension, the torque, the side force per metre, the buckling state and the utilization.

The summary numbers, hookload and surface torque, are just the top row of that profile. Everything interesting is in between.

## The shape in a vertical hole

A straight line. Tension rises from the bit-end value at a constant rate, w times the buoyed weight per metre, all the way up.

The slope changes twice, where the string composition changes: collars are 1288.2065631957541 N per metre buoyed, heavy weight is 587.4984603658712 N per metre and drill pipe is 265.26806749988424 N per metre. So the profile is three straight segments with the steepest at the bottom.

## The shape in a deviated hole

Still piecewise, but the slope in each section is w cos(theta) rather than w, and friction adds or subtracts on top.

In a horizontal section cos(theta) is zero, so the weight contributes nothing to the tension, and the only thing changing the tension is friction. Tripping out that means the tension RISES through a lateral with no weight being added at all. Tripping in it falls.

That is the single most useful thing to see on the profile: in a lateral, the tension gradient IS the drag.

## Where to look first

**The bit end.** It should be zero for a tripping operation and minus the weight on bit for an on-bottom one. If it is not, the case was set up wrong.

**Every composition change.** The slope should change there and nowhere else in a straight section.

**Every curvature change.** The fan between the pick-up and slack-off curves should open there.

**The zero crossing.** Where the tension changes sign, if it does.

## What the profile is not

It is not a stress profile. Tension is a force, and the stress in the pipe is that force divided by the cross-sectional area, plus a bending stress the soft-string model does not compute, plus the torsional stress from the torque.

The utilization ratio is the closest the model gets to a stress statement, and even that is a simple ratio against a rating rather than a combined-loading check.

## Exercise

Open the panel on the build-and-hold well and read the tension at the top of the collars for pick up, rotating, and slack off.

All three should be close together. Explain why, using the fact that most of the collars sit in the low-curvature section near total depth.
