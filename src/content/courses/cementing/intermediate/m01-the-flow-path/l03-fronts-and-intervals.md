# Fronts and intervals

Where each fluid is, as a function of how much has been pumped.

{{panel:cm-placement-explorer}}

## The front of a fluid

At pumped volume V, the leading face of fluid i sits at

    a_i = clamp(V - (sum of the volumes of the fluids pumped before it), 0, vPath)

So the first fluid's front is at V, the second's at V less the first's volume, and so on. The clamp holds a front at zero before it has entered and at the end of the path once it has left.

## From fronts to intervals

The fronts are in decreasing order, and they partition the path.

Above the first front, from a_0 to the end of the path, is the ORIGINAL MUD, which was in the hole before the job.

Between a_(i+1) and a_i is fluid i.

Below the last front, from 0 to a_last, is whatever entered most recently, which is the displacement.

## Worked, on the slant well's two-slurry programme

The fluids are 4 spacer, 2.6713376091845076 lead, 22.452043333781734 tail and 57.357206 displacement, in that order.

At 20 cubic metres pumped:

    spacer front       at 20
    lead front         at 16
    tail front         at 13.328662390815492
    displacement front at 0, because nothing has been pumped behind the tail yet

So the path holds mud from 20 upward, spacer from 16 to 20, lead from 13.328662390815492 to 16, and tail from 0 to 13.328662390815492.

Four intervals, and their lengths add to the path length.

## The conservation property

    sum of interval lengths = vPath

Always, at every V, by construction. The engine's own test asserts it at several pumped volumes, which is the cheapest possible check that the bookkeeping is right.

If that sum ever failed to close, a fluid would have been created or destroyed and every pressure downstream would be wrong.

## Why the mud interval disappears

Once a_0 reaches vPath, the first pumped fluid has reached the end of the path and there is no original mud left anywhere. On this job that never happens, because the total pumped is less than the path length.

The engine handles it anyway, with `if (fronts[0] < vPath)`.

## Exercise

At 60 cubic metres pumped on the slant well's two-slurry programme, compute all four front positions.

Then say which fluid is at the shoe, whose volume coordinate is 58.13230334930856.
