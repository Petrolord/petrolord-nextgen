# The workflow end to end

The Expert additions assemble into a sequence that extends the two tiers below without modifying them. This lesson writes the whole ladder's workflow once, with the Expert steps in place and the order constraints explicit.

## The sequence

One. Framework (Associate): resample the source surfaces to the frame, clamp, difference into zones, read clamp counts and zone statistics.

Two. Well ties (Professional): trajectories, landings, tie table, control points with weights. Read the table's structure; quarantine contested geometry, here zone B in the east.

Three. Faults: validate the polygon set, label every node, census per block, close against the frame count. Label the control points with the same test; close their count against the well set.

Four. Population: per property, per zone, split control points by block; run the requested method through the fallback ladder per block; record provenance; keep the two means straight.

Five. Volumes: per zone, per block, sum bulk and the property chain as far as the mandate runs; close every link against its total.

Six. Report per block: census, provenance, properties with recipes, volumes with closures, plus the sensitivities that matter, boundary position, weight convention, variogram sweep.

## The order constraints

Labels before population: the split of control points IS the population's data definition. Population before property volumes: pore needs a porosity map. And everything downstream of labels re-runs when a polygon changes, but NOTHING upstream does: trajectories, ties and control point LOCATIONS are fault-blind, which is why the Professional tier could be built before any fault existed. The one subtle coupling runs the other way: control point locations, a Professional product, DETERMINE block membership, an Expert input. The ladder's data flows strictly downward, and W2's crossing is the proof that the flow matters.

## Blast radii

Edit the polygon: labels, census, point splits, per-block maps, per-block volumes all change; field totals, trajectories, ties and the whole-model bulk do not. Edit a survey: that well's ties AND its control point location, hence possibly its block, hence both blocks' populations and the volume SPLIT, while the census and field totals stand. Edit a property value: that block's maps and property volumes only. The narrowest edit with the widest reach is the survey, because it is the only one that can move data ACROSS the fault, the module three story in dependency form.

Re-run whole, never patch: every step is a pure function of its inputs, cheap at this scale, and the closures plus provenance are only trustworthy on a coherent re-run. A patched map with stale provenance is worse than no provenance, because it testifies falsely.

## What the workflow refuses to do

Three refusals define the Expert tier's edges as much as its computations. It refuses to average across labels, however tempting the statistics. It refuses to run a method a block's data cannot support, falling back visibly instead. And it refuses to book barrels, handing per-block containers to the discipline that owns contacts and fluids. Each refusal is a place where a plausible-looking shortcut exists and the engine's design makes taking it a deliberate, visible act rather than a default.

## Worked example

Run the dependency reasoning on a realistic composite change: the mapping team ships a revised BaseB source surface (the tie table demanded it, module four of the Professional tier). What re-runs? Framework: yes, resample and clamp, and the clamp counts likely change. Ties: yes, all BaseB rows, and TopB rows too if the clamp's coupling moved TopB anywhere. Control points: unchanged in both location and weight, since locations come from trajectories and weights from pick MDs, and neither was edited; nothing about control points moves unless picks are re-steered. Labels and census: no. Population: zone A maps unchanged; zone B property volumes change through thickness, not through maps. Volumes: zone B per block changes; zone A untouched; closures re-verified. The edit's reach is wide but exactly enumerable, and enumerability is what the workflow's structure buys.

## Exercise

Write the corresponding enumeration for a re-survey of W2 that shifts its zone A midpoint 60 m shallower in MD: list what re-runs, in order, and name the single most consequential downstream number that changes, with its direction.
