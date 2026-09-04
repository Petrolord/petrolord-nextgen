# Where a sweep goes dead

A condition that returns no answer has said something important. What it said depends on which of two very different things happened.

{{panel:pd-node-explorer}}

## Two causes, one word

Physically dead: the tubing curve sits above the inflow curve at every rate, the residual is positive everywhere, and its minimum is positive. Instrumentally dead: the residual dips negative over a band narrower than the grid spacing, no sample lands inside it, and the well flows unseen. The status field does not distinguish them. The minimum residual does.

The published `deadWell` case is the honest article, against an open flow of 600.000000 stb/d.

| Rate, stb/d | Inflow, psia | Outflow, psia | Residual, psi |
| --- | --- | --- | --- |
| 30.0000 | 1140.000000 | 2128.172727 | 988.172727 |
| 150.0000 | 900.000000 | 1955.833333 | 1055.833333 |
| 300.0000 | 600.000000 | 1890.000000 | 1290.000000 |
| 570.0000 | 60.000000 | 2000.762069 | 1940.762069 |

The smallest is 988.172727 psi. No grid will find a crossing, because there is none. The case note fixes the vocabulary: the well is dead rather than flowing at zero, which is the absence of a solution and not a rate the well settles at.

Against that, choked FORCADOS-3 flows at 1014.239511 stb/d with a minimum residual of -0.478610 psi, and the engine calls it dead at 50 grid points where the spacing is 84.238322 stb/d against a window of 57.851719 stb/d.

## The pre-check that says which well you have

Compare the dead column at zero rate with the reservoir pressure. Below it, the residual starts negative, there is one crossing, and a dead verdict is impossible. Above it, the residual starts positive and a dead verdict is possible both ways.

BONNY-7's dead column is 2570 psia against 2740 psia, its residual at the lowest sampled rate is -192.336636 psi, and its sweep reads 2430, 2500, 2570 and 2640 psia at 280, 350, 420 and 490 psia, all below the reservoir. Every condition returns flowing. FORCADOS-3's dead column is 4310 psia against 3720 psia, 590 psi above, its residual starts at 575.820837 psi, and its sweep reads 4210, 4310, 4410 and 4510 psia, all above. That is the well whose dead verdicts must be checked.

## A third state, flagged by nothing

The operating point can slide onto the shoulder without any column reporting it. FORCADOS-3 at its stated condition sits 281.389786 stb/d right of a tubing minimum at 1843.619418 stb/d and 18.717814 psi above 2348.191408 psia, with a window still 1890.521117 stb/d wide and a status of flowing. BONNY-7 sits 728.644315 stb/d and 585.899719 psi clear. Clearance to the minimum is a third column, and it does not fall in step with the other two.

## Report the gap, never the missing row

Drop a failing condition and the remaining points join into a smooth line, and a reader interpolates across the exact condition that was warning them. Rate does not fall smoothly to zero: past tangency there is no crossing at all.

The damaging error is quoting the last flowing condition as an operating limit. That limit is a claim about the grid. A sweep of choked FORCADOS-3 run at 50 grid points reports dead at 1469.15 psia, where the well produces 1014.239511 stb/d, while the coarser 40 point run does not make the error.

## Exercise

Record the dead column at each swept wellhead pressure for both wells, against reservoir pressures of 2740 psia and 3720 psia.

Say for each whether a dead verdict is possible at all, and name the one number you would check before believing one.
