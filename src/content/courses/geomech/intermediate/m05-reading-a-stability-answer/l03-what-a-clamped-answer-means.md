# What a clamped answer means

Three ways this engine returns a boundary instead of a solution.

{{panel:gm-stability-explorer}}

## The first: a clamped stress

From the Associate tier. The horizontal stress estimate exceeded a frictional bound and was pulled back to it.

The reported stress is the edge of the possible range, not the model's prediction.

## The second: collapse at zero

If the Mohr-Coulomb criterion is satisfied with an empty hole, the engine reports a collapse pressure of zero.

That is a genuine answer, and it means the collapse criterion is not binding at all at that depth. Both wells' shallowest checkpoints report a collapse equivalent mud weight of 11.678923272 kg/m3, which is the numerical residue of a zero.

Reading that as "this rock is very strong" is right. Reading it as a mud weight to use is not: the pore pressure sets the floor there, and the well control course sets the rest.

## The third: collapse at the top of the range

If no pressure in the search range stabilises the hole, the engine returns the top of the range.

That is not a pressure. It is a flag meaning the window has closed at that depth: there is no mud weight that both holds the hole up and keeps it from splitting.

## Recognising each

**A clamped stress**: two stresses exactly equal, or a stress sitting exactly on a computed bound.

**A zero collapse**: an equivalent mud weight near 11.68 kg/m3, or any value implausibly below the density of water.

**A range-top collapse**: a collapse pressure above the fracture initiation pressure at the same depth, and a negative window width.

## The fracture side

The same two edges exist. If the least wall stress is already below minus the tensile strength at zero pressure, the fracture initiation pressure is reported as zero. That means the wall would be in tension even with an empty hole, which needs an explanation before anything else.

At the other end, a fracture pressure at the top of the range means the rock will not split at any pressure the search considered, which is possible in a strongly compressive field.

## What the mud window walk does with them

It flags an inversion. If the lower bound exceeds the upper bound at any depth, the walk records the shallowest such depth and returns a warning naming it.

Neither well in this course triggers it at either parameter set, which is worth knowing: every result in this course comes from an open window.

## Why this lesson exists

Because a number returned from a solver looks the same whether it is a solution or a boundary, and acting on a boundary as though it were a solution is how a model produces a confident wrong answer.

## Exercise

Name the three flags above and, for each, one number you would check to detect it.

Then say which of the three is hardest to notice in a table of results.
