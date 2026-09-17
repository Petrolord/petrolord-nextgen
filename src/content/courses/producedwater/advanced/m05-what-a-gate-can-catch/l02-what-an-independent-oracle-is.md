# What an independent oracle is

A gate that restates the formula the engine uses validates nothing. It confirms a formula was typed twice, which is a claim about typing. The golden file this course prints from is written by an oracle that reaches every answer BY A DIFFERENT METHOD, and the difference is the whole value of it.

## The routes

Each of these is a separate argument for a number the engine also computes.

- the creeping flow rise velocity: the FORCE BALANCE solved numerically, with the drag coefficient as 24 over the Reynolds number and the two force expressions typed out.
- the terminal rise velocity: bisection on the drag residual, against the engine's damped iteration.
- the basin and plate cut sizes: a droplet TRAJECTORY marched through the geometry and bisected on the size that just clears, so the surface loading result is a consequence of the march.
- the hydrocyclone cut: the radial migration marched, with the field re-derived through the TANGENTIAL VELOCITY rather than the flow ratio, plus a Monte Carlo over starting radii uniform by area.
- the flotation cut: the kinetics assembled from its PARTS in a different order, bubble number then swept area then rise velocity then interception, with the attachment marched by Euler.
- the filter cut: the bed marched layer by layer, and the droplet whose marched removal is exactly one half bisected out.
- the whole train: PARTICLE TRACKING, 400,000 droplets each carrying a surviving weight through every stage, with no binning anywhere.
- the error function series: against the C library's own erf.

## What makes a route independent

Look for the shared quantity in each pair. There usually is not one. The engine inverts a balance to get a cut size. The oracle marches a droplet and asks when it arrives. The two share the geometry and the fluid properties and nothing else, so an error in the inversion has nowhere to hide.

The strongest example is the 18 in the Stokes group. The oracle solves the force balance with the forces written out, so THERE IS NO PLACE IN IT FOR AN 18 TO BE TYPED. Bending the engine from 18 to 20 is caught even when the same bend is attempted in the oracle.

## The train route, which checks the most at once

Particle tracking over 400,000 droplets is the broadest route. It has no bins in it at all, so it validates the quadrature, the coupling, the outlet concentration, every stage and both medians at once, by a method sharing no data structure with the engine.

That is also why the train comparison carries the largest gaps in the file. A Monte Carlo brings its own noise, and a check with no noise would be one that had stopped being independent.

## The question to ask of any oracle

Not whether it agrees. Whether it COULD have disagreed. An oracle sharing the engine's formula, constants and structure will agree with a broken engine as readily as with a working one.

## Exercise

Pick three routes above and write down, for each, the quantity the engine and the oracle share and the one thing each derives alone. Then describe a change to the engine that all three would catch, and one that none of them would.
