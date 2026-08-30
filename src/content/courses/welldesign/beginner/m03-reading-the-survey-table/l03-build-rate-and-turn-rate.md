# Build rate and turn rate

The two rates a directional driller actually steers with.

## What they are

**Build rate** is inclination change per unit measured depth. It answers: how fast is the well standing up, or lying down?

**Turn rate** is azimuth change per unit measured depth. It answers: how fast is the well swinging left or right?

Both are signed. A negative build rate is a drop. A negative turn rate is a left turn.

## Why the driller works in these

Because they map onto the tool. A steerable motor with a bent housing produces a curvature whose direction is set by the TOOLFACE: point the bend up and you build, point it right and you turn, point it at 45 degrees and you do both.

So a directional driller's instruction is a toolface and a footage, and the resulting build and turn rates are the projection of the tool's curvature onto the vertical and horizontal.

That is why module 4 ends with toolface: it is the control input, and build and turn are what comes out.

## The relation to dogleg

For a small interval, with inclination i:

    dogleg rate is approximately sqrt( build rate^2 + (turn rate x sin(i))^2 )

The sine is the whole story. At low inclination the turn contributes almost nothing to the dogleg; at high inclination it contributes fully.

Which gives the practical rule: **make azimuth corrections while the inclination is low.** A 20 degree azimuth change costs a modest dogleg at 15 degrees of inclination and an unrunnable one at 85.

## The turn rate wrap

Azimuth is a compass bearing, so it wraps at 360. The change from 355 degrees to 5 degrees is a turn of plus 10, not minus 350.

Every implementation has to handle this, and the engine has a dedicated function for the shortest signed difference between two azimuths, in the range from minus 180 to plus 180.

It is worth knowing that this function exists, because a home-made turn-rate column that subtracts azimuths directly produces a spike of several hundred degrees per 30 m every time a well crosses north. Those spikes then propagate into anything that uses turn rate.

## The vertical singularity

At exactly zero inclination the azimuth is undefined: a vertical hole has no compass direction. Software has to pick something, usually carrying the previous azimuth forward or using the plan's azimuth.

That means turn rate is meaningless in the vertical section, and any large turn rate reported at inclinations under a degree or so is an artefact of the convention rather than a property of the hole.

The engine's error model has an explicit vertical inclination limit in its header for the same reason: near vertical, azimuth-dependent error terms would blow up, and the model switches to a different formulation below the limit.

## Reading them together

The useful pattern on a listing is to read build rate, turn rate and dogleg severity as a group.

Build with no turn is a planar build, and dogleg equals build rate. Turn with no build at high inclination is a large dogleg from a small number. Both together at high inclination is the most expensive combination there is, and it is where well plans get sent back.

## The misconception to avoid

"A 3 degree per 30 m build rate is a 3 degree per 30 m dogleg." Only if the azimuth is not changing. Any turn adds in quadrature, weighted by the sine of the inclination, and a plan can meet its build-rate limit and violate its dogleg limit at the same time.

## Exercise

A well at 60 degrees inclination is building at 2 degrees per 30 m and turning at 3 degrees per 30 m.

Compute the approximate dogleg severity from the relation above. Then repeat at 20 degrees inclination with the same two rates, and state the ratio between the two doglegs.
