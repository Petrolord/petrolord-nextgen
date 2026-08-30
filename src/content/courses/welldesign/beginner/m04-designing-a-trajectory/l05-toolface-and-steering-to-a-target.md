# Toolface, and steering to a target

The control input, and the closed form that produces it.

## What toolface is

A steerable assembly has a fixed curvature and a controllable DIRECTION for that curvature. Toolface is that direction: the angle, measured around the hole from the high side, in which the bend is pointed.

- toolface 0 degrees: the bend points up, the well builds;
- toolface 180 degrees: the bend points down, the well drops;
- toolface 90 degrees: the bend points right, the well turns right at constant inclination;
- anything between: a mixture, in proportion to the sine and cosine.

Toolface is what the driller sets. Build rate and turn rate are what results.

## The question the solver answers

Given the attitude the well has now, and the attitude it should have, what toolface gets from one to the other, and how much total angle change is required?

That is a question about two unit vectors on a sphere, and it has a closed form.

## The construction

Take the current tangent direction and the desired one. The angle between them is the dogleg, from the same formula as module 2.

The direction of the required turn, in the plane perpendicular to the current tangent, is the component of the desired direction that is perpendicular to the current one, normalised. Expressing that direction in the high-side and right-side frame gives the toolface directly:

    toolface = atan2( component along right, component along high side )

The high-side direction is the projection of vertical into the plane perpendicular to the hole, which is why toolface is undefined in a perfectly vertical hole: there is no high side.

## The precision

The engine's toolface solver is checked against forty-three spherical test cases covering the whole range of attitudes, including high inclinations and course changes across north.

It reproduces the published toolface to within two hundredths of a microdegree, and the dogleg to within a hundredth of that. This is a closed-form geometric identity, so exact agreement is the expected result and its absence would mean a frame or sign error.

## Steering in practice

A directional driller does not compute a toolface for the whole remaining well. They compute one for the next stand, drill it, take a survey, and recompute.

That loop is why the projection ahead from the last survey to the bit matters, why survey quality matters, and why the difference between the plan and the actual is monitored continuously rather than at the end.

## The reactive torque problem

Setting a toolface is harder than it sounds. The bit reacts against the motor, which twists the whole string, so the toolface at the bit is not the toolface at surface. The offset depends on the string, the weight on bit and the friction, and it is learned empirically on the first few stands of every well.

That is a mechanics problem, it belongs to the torque and drag course, and it is the largest single reason a well does not follow its plan.

## The misconception to avoid

"Toolface is the azimuth you want to go." It is the direction the curvature is applied in, measured around the hole from high side, not a compass bearing. At high inclination a toolface of 90 degrees turns the well right; near vertical the same toolface produces almost nothing, because there is very little curvature to project and the high side is barely defined.

## Exercise

A well is at 40 degrees inclination on a 120 degree azimuth, and the next station should be at 43 degrees on 126 degrees.

Say qualitatively whether the toolface should be nearer 0, 90, 180 or 270 degrees, and why. Then compute the dogleg between the two attitudes and state whether it is larger or smaller than the inclination change alone.
