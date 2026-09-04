# Onward

A gas lift design is a small object with a long reach. Be precise about what it earns and where it hands over.

## What it earns

It turns a gas gravity, a temperature profile and a handful of pressures into a string of depths and settings a crew can install and a chart recorder can refute. It says where the gas reaches: 7739.815725361 ft at 1014.7 psia surface pressure on the published traverse, and 8000.000000000 ft at 1064.7 psia, where the limit stops being pressure and becomes the well.

It also prices a decision. Raising the transfer differential from 100.0 to 200.0 psi takes the injection point from 7739.815725361 ft to 6894.703876604 ft, and 26.75 psi per valve of decrement sits 0.124769727 psi from a different unloading behaviour. A design review can argue with numbers like those.

## Where it hands over

There is no inflow relation anywhere in this module and no multiphase outflow. The flowing traverse that locates the injection point is passed in, so a gas lift design is downstream of a nodal model and inherits everything that model got wrong.

The gas column is static, with no friction, no velocity and no injection rate in the annulus, so the casing pressure is a shut in column. The unloading and transfer lines are straight lines on constant gradients, declared rather than solved. Intermittent lift is not modelled. Thornhill and Craver is an orifice equation and knows nothing about a stem throttling before it is fully open, so throughput is an upper bound.

Two results are pinned as known wrong rather than fixed. For a production operated string the closing test is evaluated against the casing when the dome balances against the tubing, a category error and not a design margin. And `deepestInjectionPoint` reports a residual that cannot see its own error.

## The limit worth remembering

None of it improves the design. A string spaced to nine decimal places on a traverse nobody checked is a precise account of a depth the gas will not reach.

## What you have finished

Which numbers in a gas lift design are decisions and which are artefacts. Report the margin under every verdict, state the tabulation the depth came from, and treat any residual a calculation computes about itself as a consistency check and nothing more.

## Exercise

Write three things a gas lift design earns and four it refuses.

Then say which two refusals are pinned known divergences rather than absent physics, and what a report relying on either should state.
