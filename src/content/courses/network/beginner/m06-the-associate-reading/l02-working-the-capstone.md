# Working the capstone

There is a right order for this work. Most of what goes wrong in a gathering system study comes from doing the steps in the wrong one.

{{panel:pd-trunk-explorer}}

## Settle the line before you touch the network

Take the bore from the schedule row rather than computing it, and check it against the outside diameter less two walls: that redundancy is the table's only self check. A size the table does not carry returns null and never a nearby one, so a null is itself an answer. Get the rating and write the design factor next to it: a rating without one is not one anyone may operate to.

## Sum the fittings before you convert them

Add the resistance coefficients and look at the sum. Name the largest contributor before quoting a total: one fitting can be most of a list. Convert to a length on the bore and friction factor of the line those fittings sit on, never one borrowed from elsewhere. An unknown fitting comes back `ok: false` naming it; an unknown grade or roughness resolves to NaN.

## Build before you solve

Run `buildNetwork` and read what it returns: node count, branch count, unknown pressures, delivery points, and the unknown index checked against your own reading. If it refuses, the drawing is wrong: read the sentence and fix the drawing, not the input.

## Solve each well alone before you solve them together

A solo run gives a wellhead, a rate and a line drop for each well against the boundary. Record all three. They are what a single-well study would have handed you, and the distance to the system answer is what the network did.

## Read every sign before you read anything downstream

A drawn from and to is a labelling convention. Check the sign of each branch flow against the drawing before taking a direction, a split or a downstream reading from it. Which way mass goes is a property of the answer, not of the branch.

## Then run `checkConservation`, because the solve does not

| Step | What passing looks like |
| --- | --- |
| Bore | from the table row, checked against outside diameter less two walls |
| Rating | quoted with its design factor |
| Fittings | K summed, dominant term named, length on this line's friction factor |
| Build | `ok: true`, with node, branch, unknown and delivery point counts |
| Solo | each well's wellhead, rate and line drop |
| Direction | each branch flow sign read against the drawing |
| Answer | converged flag, pinned list and conservation gap together |

Then the units: mass lb/d, absolute pressure psia never psig, a difference and a wall rating in psi, length ft, bore, wall and outside diameter in, yield psi, oil and water stb/d, gas Mscf/d, and a turbulent conductance in lb/d per root psi against a linear one in lb/d per psi, which never compare.

## Exercise

Work a gathering system through this order and write one line per step, from the bore check through each well's solo triple to the conservation gap beside the converged flag.

Then name the single step that, done out of order, leaves every later number defensible on its own and the conclusion wrong.
