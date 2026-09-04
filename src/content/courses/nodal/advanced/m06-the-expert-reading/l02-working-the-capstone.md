# Working the capstone

There is a right order for this work, and most of what goes wrong comes from doing the steps in the wrong one.

{{panel:pd-node-explorer}}

## Choose the inflow family the test justifies

A node problem hands you a reservoir pressure, a bubble point and a production test. Where the test sits decides the family, and both crossings then sit on the curve you built.

A test above the bubble point is where a straight line is honest: BONNY-7's, 720 stb/d at 2380 psia against 1300 psia, gives a productivity index error of 0.00000000 stb/d/psi. A test below it is not: FORCADOS-3's, 2400 stb/d at 2180 psia against 2450 psia, backs out 1.55844156 stb/d/psi where the composite reads 1.57194033, and an open flow of 5797.402597 stb/d against 4135.949669 stb/d.

Write the open flow down: it is the top of the rate range the solver scans.

## Locate the shoulder before you solve

Find the tubing minimum in rate and pressure; both crossings are judged against it. BONNY-7's is 627.069742 stb/d at 1476.243252 psia, FORCADOS-3's 1843.619418 stb/d at 2348.191408 psia.

Read it off a sampled curve and the pressure is nearly right while the rate is not: a sampled minus true minimum rate of -22.728631 stb/d for 0.76036884 psi on BONNY-7's 37 point curve, -31.814966 stb/d for 0.25586360 psi on FORCADOS-3's. Rate is what you compare crossings against.

## Predict the crossing count, then solve

Compare the dead column at zero rate with the reservoir pressure. Below it, one crossing: BONNY-7, 2570 psia against 2740 psia. Above it, two crossings or none: FORCADOS-3, 4310 psia against 3720 psia.

Now solve, and record the grid: a node result is a claim about the well and the solver together.

Read the residual before the crossings. Its value at the lowest sampled rate confirms the prediction; its minimum says whether the well flows and by how much: -989.578610 psi for BONNY-7, -0.478610 psi for FORCADOS-3 choked to 1469.15 psia, nothing below 988.172727 psi on the published dead case. Never accept a dead verdict without it.

## Identify which crossing is which

This is where the marks go. Of two crossings the lower is the heading branch and the upper is the operating point, and the residual passes upward through zero at the one that holds. Reporting the first intersection a solver hands back is one mistake that contaminates everything downstream.

Confirm it with something that did not come from the solver: a stable crossing sits right of the tubing minimum, on the rising friction limb.

## Before you submit

| Check | What passing looks like |
| --- | --- |
| Crossing count | Matches the dead column comparison |
| Operating point | Right of the tubing minimum |
| Minimum residual | Negative, and written down |
| Grid | Stated, and the verdict backed by the residual rather than by refining |

Then the units: stb/d for oil and Mscf/d for gas, psia for pressure, ft for depth, degF for temperature.

## Exercise

Work FORCADOS-3 through the order, one line each: the family and why, the tubing minimum, the dead column comparison, the grid and two residual readings, both crossings labelled, the geometric check.

Then name the single error that would make every field of a graded answer wrong, and the comparison that catches it.
