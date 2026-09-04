# Working the capstone

There is a right order for this work, and most of what goes wrong in a network study is a step taken before the one it depends on.

{{panel:pd-network-explorer}}

## Build the topology before you solve anything

Run the build and read what comes back. Every failure is a refusal with a reason and never a repair, because a well that cannot reach a delivery point is a drawing mistake rather than a network with a small problem. Count the nodes, the branches, the unknown pressures and the delivery points, and check them against the drawing before a single pressure is computed. A network needs at least one well and a delivery point with a pressure, or it is not solved at all.

## Solve, then read the flag and the audit together

Never quote a converged flag as a result. Print the flag, the iteration count and the residual, then run `checkConservation` on the same answer, because `solveNetwork` never calls it and nothing else in the return came from anywhere but the iteration. On the teaching network the engine reports converged = true after 11 iterations at 1.546141e-11 lb/d while the audit reports a gap of 345 lb/d, 2.593852900 percent of what the engine says was produced. A gap that size changes what you may claim about the answer.

## Read the signs before you read anything downstream

Take every branch flow with its sign, in the drawn sense, and list the ones that came back negative. Those run against their arrows and their ends swap. Do this before propagating anything, because a junction with two ways out becomes a junction with one if you believe an arrow drawn before the solve.

## Propagate rates, and never a ratio

Add oil, water and gas along the solved directions, split at a junction by mass share, and let every cut fall out at the end. On the teaching network the trunk water cut is 33.262507244 percent while the plain average of the four wells is 42.401682837.

## Diagnose last, and say which question you asked

| Step | What passing looks like |
| --- | --- |
| Topology | Node, branch and unknown counts match the drawing |
| Solve | Flag, iterations and residual, all three written down |
| Audit | Conservation gap quoted beside the flag |
| Signs | Every negative branch listed before propagation |
| Streams | Components added, cuts derived, no ratio averaged |
| Reading | Biggest drop in psi, bottleneck in psi per lb/d, named apart |
| Cost | Each well solved alone and on the system |

To say what the system costs a well, solve it alone against the same boundary and then on the system, and subtract. To price a shut-in, re-solve without that well and use what the survivors gain, never the rate the well was reported to make.

Units throughout: mass rate lb/d, pressure psia, a difference psi, turbulent conductance lb/d per root psi, linear conductance lb/d per psi, oil and water stb/d, gas Mscf/d.

## Exercise

Work a system through this order and write one line for each step.

Then name the step that, taken early, leaves every later number defensible on its own and the conclusion wrong.
