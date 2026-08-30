# What the compiler will not let you do

Four refusals, and why each one is a feature.

## It will not turn a vertical hole

A turn segment at zero inclination is rejected with a message saying to build first, because azimuth is undefined at zero inclination.

This is not pedantry. A vertical hole has no compass direction, so "turn 30 degrees right" describes nothing. Software that accepted it would carry a fictional azimuth through the vertical section and produce a station list whose first curved segment starts from a direction the well never had.

## It will not build past the physical range

An inclination outside zero to 180 degrees is rejected by name, with the offending end inclination in the message.

180 degrees is a hole drilled straight back up, which is physically meaningful and occasionally real. Beyond that is a wrap that would make the subsequent trigonometry silently produce a mirror-image well.

## It will not accept a build with the wrong sign

If a build segment is given a target inclination that its rate cannot reach, because the rate builds and the target is below the current inclination or the reverse, it fails rather than returning a negative length.

A negative segment length would compile: the arithmetic does not object. It would produce a station list running backwards in measured depth, and everything downstream would then be wrong in a way that is hard to see.

## It will not silently exceed a dogleg limit

If a maximum dogleg is given, the QA report flags the exceedance and clears the ok flag. It does not modify the design.

That is the important one. A tool that met the limit by smoothing the plan would be substituting a well that does not reach the target, and reporting success.

## The physical bound check

There is a fifth check that is not about the input at all: no interval may gain more TVD than its measured length.

That is impossible geometrically, since the vertical component of a direction cannot exceed its magnitude. If it happens, the mathematics has a sign or a frame error, and the check catches it before the station list leaves the function.

It is a good example of an assertion about an INVARIANT rather than about a value. It does not need a golden case and it cannot become stale.

## Why refusals beat defaults

Every one of these could have had a default: carry an azimuth, clamp the inclination, take the absolute value of a length, smooth to the limit.

Each default would produce a plausible station list that answers a question nobody asked. The refusals produce nothing and say why, which costs the planner thirty seconds and saves the well.

That principle recurs throughout this module. The well control engine refuses to compute a kill sheet without a shoe depth. The error model refuses to run without a magnetic reference. In every case the refusal is the safe behaviour.

## The misconception to avoid

"An error message means the software is limited." Sometimes. Here it usually means the design is not a well. The check to make when a compiler refuses is not how to work around it, but which of the four physical impossibilities the design contains.

## Exercise

For each of the four refusals above, write down the plausible-looking station list a permissive implementation would have produced instead.

Then say, for each, which downstream calculation would have been wrong and whether anybody would have noticed.
