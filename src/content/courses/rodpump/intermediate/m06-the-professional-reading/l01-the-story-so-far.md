# The story so far

Five modules, and one object underneath all of them.

## The claim

The design is the card. A beam pump carries the surface motion down a rod string as a travelling wave, and what the plunger does, what the polished rod carries and what the well makes are properties of the loop that wave draws.

## What each module established

**Module 1.** A card is a closed loop of load against position over one settled cycle, produced by marching the damped wave equation. The published case at 9 spm takes 6516 steps and comes back on 181 card points. Against an independent oracle on a different grid with a different integrator, the engine's plunger stroke is 49.670227367 in against 49.864170826 in, 0.388944 percent low, its peak 16490.601223060 lb against 16545.574080121 lb and its minimum 5823.210940232 lb against 5797.468233684 lb. Two routes, one physics, inside the gates.

**Module 2.** The spring rule subtracts a static stretch from the surface stroke: 64.000000 in less 18.720185299 in gives 45.279814701 in on the published taper, and it does not depend on speed. The march gives 45.286791250 in at 0.5 spm, 0.015408 percent above it, and 53.042713176 in at 15.0 spm, 17.144281 percent above it. The difference is inertial overtravel, and the ladder between those ends steps backwards in places, so three rising rows are never a trend.

**Module 3.** At 9 spm the same string peaks at 16490.601223 lb and bottoms at 5823.210940 lb, a range of 10667.390282828 lb, against a buoyed rod weight of 8673.757961783 lb: 7816.843261277 lb above it and 2850.547021552 lb below. Both loads are movable. Walking the damping ratio alone across nine rows moves the peak 2223.684206 lb and the minimum 2115.653830 lb.

**Module 4.** Card area times speed over 396000. The teaching design returns 750654.615621 in-lb per cycle and 18.955924637 hp at 10 spm, measured at the polished rod, with no gearbox, belt, motor or counterbalance work in it.

**Module 5.** Three rates: 380.874258458 bbl/d rated on the surface stroke, 351.739329047 swept on the plunger stroke, 316.565396142 produced, a ratio of 0.831154611. Fillage is typed rather than computed, it changes the plunger stroke as well as scaling the answer, and the warning that flags it is a hard threshold: 301.389964 bbl/d silent against 301.354487 bbl/d warned.

## The one sentence

Every number a rod pump design reports is read off a card, and reading it means naming the stroke it stands on, the speed it was marched at and the two numbers the caller typed.

## What this tier does not settle

Which of those numbers is a measurement and which is an artefact of how the card was sampled.

## Exercise

Write the five module claims in one sentence each, and beside each the number you would use to defend it.

Then say which of the five could be checked without running a march.
