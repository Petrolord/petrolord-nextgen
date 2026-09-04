# Working the capstone

There is a right order for reading a network answer. Most of what goes wrong comes from reading the fields in the order they appear.

{{panel:pd-fight-explorer}}

## Build before you solve, and read the refusal

`buildNetwork` either returns an indexed network or refuses, naming the node or branch at fault. Eleven malformed networks come back `ok` false, and each message names a drawing mistake rather than a small problem to work around. Take the node, branch, unknown and delivery point counts off the build, because every later index is in that order.

## Solve, then audit before you look at converged

`solveNetwork` never calls `checkConservation`, so run it yourself and write produced, delivered, gap and relative before you quote a single pressure. Nothing in the solve return is a check that was not computed by the iteration it is checking. On the teaching network that turns a reported residual of 1.546141e-11 lb/d into a gap of 345.000000000 lb/d, 2.593852900 percent of what the engine says was produced.

## Read `pinned` next, and treat it as a verdict

Any node named in `pinned` is not a solved pressure. Ask what its own nodal imbalance is, because the engine carries that number where nothing consults it, and ask where its starting pressure was, because that is what decided it. The warning tells one story, a shut-in well on a dead line, and a producing well on a live line gets the same sentence.

## Convert the tolerance before you trust it

The target is the tolerance you asked for times a scale: the largest single well inflow at the sink pressure. Compute that scale from the wells and the delivery pressure, multiply, and quote the target in lb/d. Then set the reported residual against it. A cap that was hit, a line search that stalled and a cusp that would not resolve all return `ok` true, so `converged` and the iteration count are the only fields that separate them.

## Directions before streams, ranking last

`flows` is signed along the drawn sense and `branchStreams` mass runs along the solved sense and is always positive, so take the sign of every branch flow before you propagate anything or read a split. Then take each branch's pressure difference in Jacobian steps to see which one cost the solve its iterations. Rank the bottleneck last, against the biggest drop, because they are different questions.

| Step | What passing looks like |
| --- | --- |
| Build | `ok` true, index counts written down |
| Audit | Produced, delivered, gap and relative, computed by you |
| Pinned | Empty, or each node named with its imbalance |
| Tolerance | Target in lb/d against the reported residual |
| Directions | Signs taken from the solve, not the drawing |
| Reading | Bottleneck and biggest drop reported separately |

Then the units: mass rate lb/d, absolute pressure psia, a difference in psi, turbulent conductance in lb/d per root psi, oil and water stb/d, gas Mscf/d.

## Exercise

Work one network through this order, writing a line for each step: build counts, conservation gap, pinned list, target in lb/d, branch signs and the two readings.

Then name the step that, done out of order, leaves every later number defensible on its own and the conclusion wrong.
