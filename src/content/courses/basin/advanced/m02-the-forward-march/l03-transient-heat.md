# Transient heat

The Associate tier's column was steady state, and its final module warned that a real basin is usually not settled. This tier's heat is transient: each step solves a time-dependent equation whose starting point is the previous step's answer. This lesson explains the scheme and reads its behaviour at the two deposition events.

## The scheme

Each step builds a thermal grid on the current geometry: a surface node fixed at 15 degC, then cell-centred nodes, cells at most 100 m tall per layer. Each node carries an effective conductivity, its lithology's matrix value blended with pore water by the cell's porosity, a volumetric heat capacity blended the same way, and radiogenic heat scaled by the solid fraction. Porosity feeding conductivity is why depth changes thermal structure even without lithology changes: compacted rock conducts better.

The very first step, with no history behind it, solves steady state, exactly the Associate tier's arithmetic generalised to many cells. Every later step solves backward Euler over 1 Ma: find the new temperatures such that stored heat change balances conduction with the new boundary conditions, starting from the old profile interpolated onto the new grid. Below the old grid's reach, the old profile is extended along its basal gradient, which is how newly deepened rock gets its first temperature estimate.

## Lag, read at the events

Transient means the column approaches its steady answer rather than jumping to it, and the two arrivals show the approach from opposite sides.

At 80 Ma the Upper Shale lands and the source drops to 3000 m centre depth. Its temperature reads 153.07156059972218 that step, then 161.37883914853222, then 164.37908675503644: rising toward a steady value it approaches over tens of steps. The new deep position is under a thick, freshly porous, poorly conducting shale, and the extrapolated first estimate undershot the insulation effect.

At 120 Ma the Mid Sand's arrival ran the other way: 96.99499328861161 at the step, relaxing down through 94.67786299953347 to 94.04446278867474. There the basal-gradient extrapolation overshot, because the sand conducts well and the true new steady profile is cooler at the source than the old gradient predicted.

Neither direction is an artefact to fix; both are the honest physics of a column digesting a geometry change, resolved at 1 Ma. The Associate tier's fourth omission, remember, was precisely that a steady solver has nothing to say during these episodes.

## Why it matters for maturity

The kinetics consume these temperatures step by step, so the lag shapes the reaction. After 80 Ma the source spends its first several steps cooler than steady state, collecting less reaction than a steady-jump model would claim; module 3's hot decade runs the same physics during and after the phantom's arrival and removal. The differences are small against the basin's 150 Ma but they are systematic, and they are exactly what distinguishes this tier's temperatures from applying the Associate tier's formula to each step's geometry.

The present-day check closes the loop: by age zero the basin has been geometrically quiet for 10 Ma and the heat flow nearly constant, so the transient answer has settled onto the steady one, and the graded 149.76037539670858 degC at the source centre is a number a steady solve of today's column would essentially reproduce. Quiet endings converge; busy middles do not.

## Worked example

Predict the sign of the transient adjustment for an erosion event, before module 3 shows it. Erosion removes insulating cover: the steady profile for the new geometry is cooler at depth than the old one, and the old profile extended to the new grid starts too hot, so temperatures should relax downward over the steps after removal. The engine agrees: at 10 Ma, the step the phantom vanishes, the source reads 153.84048634909556, down from 167.24573484238402 at 11, and it keeps easing toward 149.76 across the remaining steps.

## Exercise

State what backward Euler needs from the previous step, and what supplies a temperature below the old grid's deepest node. Then answer in one sentence: why does the graded final temperature not depend much on the transient machinery?

As a self check: each step starts from the previous profile interpolated onto the new grid, with depths below the old bottom filled by extending the basal gradient. The final temperature is transient-insensitive because the last ten million years are geometrically quiet with near-constant heat flow, so the column has fully relaxed and the transient and steady answers coincide at the 0.1 tolerance.
