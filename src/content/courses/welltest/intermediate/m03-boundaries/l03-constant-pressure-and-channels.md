# Constant pressure and channels

The two other boundary shapes, and what they do to a forecast.

## A constant-pressure boundary

An aquifer with strong support, a gas cap, or an injector holding the pressure up nearby: any of these acts as a boundary that supplies fluid rather than refusing to.

When the disturbance reaches it, the pressure stops falling. In the limit the well reaches a steady state where everything it produces is replaced, and the pressure drop stabilises at a constant.

On the derivative that is dramatic. A quantity approaching a constant has a derivative approaching zero, and on a log-log plot the derivative plunges. It is the steepest feature in well testing and it is the one the engine's classifier is looking for with its "at or below minus 0.35" band.

The engine models it as a NEGATIVE image well: an injector mirrored across the boundary, so the two responses cancel on the boundary plane. `makeRadialPwdLaplace({ boundaryType: 'constant-pressure' })` implements exactly that.

## Why the diagnosis matters more than the number

A constant-pressure boundary is the most consequential thing a well test can find, and it is not because of the distance.

A well with pressure support will keep producing at a rate the depletion forecast does not predict. A well without it will decline. Confusing the two is the difference between a field that needs water injection and one that does not.

So when a derivative plunges at late time, the question is not "how far away is it" but "what is it": an aquifer, a gas cap, a nearby injector, or something that is not a boundary at all.

## The thing it is confused with

A derivative can also plunge when the test's late data are bad.

A gauge drifting, a well that starts to unload liquid, a rate that changed and was not recorded, a shut-in that was disturbed by an offset well: all of these bend the late pressure and the derivative registers the bend as a plunge.

Because the diagnosis is so consequential and the artefacts are so common, the practical rule is that a constant-pressure boundary is not accepted from the derivative alone. It needs corroboration: a known aquifer, a mapped gas cap, an injector at the right distance, or a repeat test.

The engine's classifier will label the storage transition of a perfectly ordinary infinite-acting test as "constant-pressure boundary / recharge", which is the same warning from the other direction.

## Channels

Two parallel sealing faults, or a fluvial channel with impermeable margins, or a fault-bounded compartment much longer than it is wide.

Early on the disturbance spreads radially and the well shows a normal plateau. Once it has reached both walls, flow becomes one-dimensional along the channel, which is linear flow, and the derivative rises with a slope of one half.

The engine models it as a well centred between two parallel faults, with the dimensionless group `wd = W / rw` for the channel width.

## The half slope, twice

Now the alphabet's ambiguity bites. Linear flow gives a half slope, and there are two completely different reasons to see one.

A fracture gives linear flow EARLY, before radial flow, because the fracture face is the plane the fluid moves towards and it is right at the well.

A channel gives linear flow LATE, after radial flow, because the channel walls are the planes and they are far away.

Same slope, opposite ends of the test, and the sequence is the only thing that tells them apart. A half slope with a plateau before it is a channel. A half slope with a plateau after it is a fracture. A half slope with no plateau at all is a fractured well in a channel, or a test too short to say.

## What each implies for the well

A channel means the drainage volume is long and thin, so the well drains further than a circular assumption suggests in one direction and much less in the other. Well spacing in a channelised reservoir is a different problem from spacing in a sheet.

A constant-pressure boundary means the drainage volume is effectively unbounded in one direction, and material balance calculations that assume a closed tank will be wrong.

Neither of these is a small correction to a number. They change the model of the field.

## The misconception to avoid

"Late-time derivative behaviour tells you the boundary distance." It tells you first WHAT kind of boundary, and the kind is what changes decisions. The distance is a number that follows from the model once the kind is settled, and a distance computed under the wrong kind is meaningless rather than imprecise.

## Exercise

Sketch, on log-log axes, the derivative of a well with: a sealing fault; a constant-pressure boundary; and a channel. Put the radial plateau at the same height on all three.

Then sketch a fourth: a fractured well in an infinite reservoir. State which pair could be confused if the test were stopped early, and at what point in the test the ambiguity would be resolved.
