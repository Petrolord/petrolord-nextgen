# The shapes, and when to use them

Four standard profiles, and the reason each exists.

## Build and hold, the slant or J profile

Vertical to a kickoff point, build at a constant rate to a target inclination, then hold that inclination in a straight tangent to the target.

The simplest deviated well there is. Two parameters after the kickoff: the build rate and the tangent inclination, and the target fixes their combination.

Used whenever the target can be reached at a reasonable inclination and nothing needs the well to come back to vertical.

## The S profile

Vertical, build to a hold inclination, hold, then DROP back towards vertical to arrive at the target at a lower inclination, often zero.

Used when the target has to be entered vertically or near-vertically: a reservoir to be completed with a vertical string, a target under a surface obstruction that must be approached from directly above, or a well that must land in a narrow window with the hole standing up.

Costs more hole and more dogleg, because you build and then drop the same angle back. Its drop section is where torque and drag and cuttings transport get difficult.

## The horizontal landing

Build all the way to 90 degrees, land at a target depth and inclination, then drill a lateral.

Everything about a horizontal well is in the landing: the depth window is usually a few metres, and the well arrives at it at 85 to 90 degrees where a small depth error is a large measured-depth error.

The engine has a dedicated solver for it that takes the landing point and attitude and works backwards.

## The nudge

A short deviation near surface, then back to near vertical, used to move the bottom of a well laterally away from the surface location without ever building much angle.

Common on platforms, where slots are metres apart and the wells must separate immediately below the mudline. The Expert tier's anti-collision material is largely about this situation.

## What all four have in common

They are built from two primitives: **holds**, which are straight, and **arcs**, which are constant-curvature turns. Every profile in this module is a sequence of those, and the compiler in module 5 turns any such sequence into a station list.

That is why minimum curvature is exact on a designed path: the design IS arcs and lines, and minimum curvature is the arc solution.

## The parameters you actually choose

**Kickoff depth.** Deeper is a shorter, steeper well; shallower spreads the angle over more hole. Constrained by hole size, by casing points, and by shallow hazards.

**Build rate.** Higher is cheaper in hole and more expensive in dogleg. Constrained by the assembly's capability and by what the casing and completion will pass through.

**Tangent inclination.** Falls out of the geometry once the other two are chosen, and is constrained by hole cleaning, by tool conveyance and by how much torque the string will see.

There is no optimum. There is a feasible region and a preference, and a plan is a defensible point inside it.

## The misconception to avoid

"The profile is chosen to minimise measured depth." Sometimes, and often not. Landing attitude, dogleg limits, casing points, anti-collision at shallow depth, hole cleaning at 60 degrees, and the completion that has to be run all constrain the choice, and the shortest path fails several of them regularly.

## Exercise

For each of the four profiles above, write down one situation in which it is clearly the right choice and one in which it is clearly wrong.

Then say which of the four you would expect to have the highest total dogleg for the same target, and why.
