# Build and hold

The simplest deviated well, and the exact construction behind it.

{{panel:wd-survey-explorer}}

## Two ways to specify it

**As a design.** Kick off at a depth, build at a rate to an inclination, hold for a length. Everything is given and the endpoint is computed.

**As a target.** Here is a displacement from the tie-on, north, east and down; here is the build rate I can achieve; find me the profile that gets there.

The first is a compilation, the second is a solve. Both are in the engine and both appear in the panel.

## The design case

The panel's build and hold compiles a published case: a vertical section to a kickoff, a build at a fixed rate to a target inclination, then a hold.

The compiled station list, run through the same minimum-curvature mathematics as a real survey, reproduces the published endpoint to about four parts in ten billion. That agreement is not a coincidence and it is not luck: the design is arcs and lines, and minimum curvature is exact on arcs and lines.

It is worth pausing on. Everywhere else in this course a number agrees to a few decimal places because two approximations happened to be close. Here it agrees to ten because the geometry is the same geometry.

## The solve

Given a displacement target and a build rate, there is a closed-form construction. The build arc has a radius set by the rate:

    R = (180 / pi) x (interval length) / (build rate)

so 3 degrees per 30 m is a radius of about 573 m. The problem is then to find the arc of that radius, starting tangent to the tie-on direction, whose tangent line passes through the target: a circle-tangent construction with an exact solution.

The engine solves it and reports the tangent inclination, the build length and the hold length.

## When it has no solution

Two cases, both physical.

**The target is inside the build circle.** If the target is closer to the well than the build radius allows, no arc of that curvature can reach it tangentially. The fix is a higher build rate or a shallower kickoff.

**The target is above the tie-on.** A build-and-hold goes down. The solver refuses rather than returning a negative length.

The engine returns a feasibility flag and a message rather than a number in both cases, which is the right behaviour: a profile solver that always returns something is a profile solver whose output cannot be trusted.

## The radius intuition

Build radius is the single most useful number in trajectory design.

    2 degrees per 30 m -> about 859 m radius
    3 degrees per 30 m -> about 573 m
    6 degrees per 30 m -> about 286 m
    10 degrees per 100 ft -> about 573 ft

A well cannot turn tighter than its radius, and the radius tells you immediately whether a target is reachable from a given kickoff. It is the mental arithmetic a directional driller does before opening any software.

## What the design does not include

Torque and drag. Hole cleaning. Casing wear. Whether the completion will pass the dogleg.

A geometrically feasible profile can be undrillable, and the rest of the Drilling and Completions module is largely about the checks that come after this one.

## The misconception to avoid

"A higher build rate is always better because it gets there in less hole." It is also a tighter radius, a larger dogleg, more casing wear, more drill string fatigue and a harder completion run. The build rate that reaches the target in the least hole is very often not the one that gets drilled.

## Exercise

Compute the build radius for 2, 3 and 5 degrees per 30 m.

Then, for a target 800 m horizontally out and 1500 m below a kickoff, say which of the three build rates could reach it as a build-and-hold, using only the radius. Check your answer in the panel's design view.
