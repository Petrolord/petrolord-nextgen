# Choosing the node

The node is a cut. Everything upstream becomes the inflow, everything downstream the outflow, and what you can see depends on where you cut.

{{panel:pd-node-explorer}}

## Where the engine cuts

At the bottom of the tubing. The inflow is the inflow performance relationship at rate; the outflow is a tubing traverse computed downwards from a fixed wellhead pressure.

So the wellhead pressure sits outside the node. It is a boundary condition, not a variable. BONNY-7 is solved with 420 psia held at the wellhead, FORCADOS-3 with 960 psia.

## The number that tells you the answer's shape first

The outflow at zero rate is the dead column, and it only means something set against the reservoir pressure.

BONNY-7's dead column is 2570 psia against a reservoir pressure of 2740 psia, so it sits 170 psi below, and the flag the column outweighs the reservoir at low rate reads no.

FORCADOS-3's is 4310 psia against 3720 psia, so it stands 590 psi above, and the same flag reads yes.

## Sweeping what sits outside the cut

| Well | Wellhead, psia | Dead column, psia | Rate, stb/d | Pressure, psia |
| --- | --- | --- | --- | --- |
| BONNY-7 | 280 | 2430 | 1424.991968 | 2027.504016 |
| BONNY-7 | 420 | 2570 | 1355.714057 | 2062.142971 |
| BONNY-7 | 490 | 2640 | 1319.581001 | 2080.209500 |
| FORCADOS-3 | 860 | 4210 | 2246.821833 | 2285.777425 |
| FORCADOS-3 | 960 | 4310 | 2125.009203 | 2366.909222 |
| FORCADOS-3 | 1160 | 4510 | 1842.012114 | 2548.192089 |

The dead column moves one for one with the wellhead pressure, which is what a column with no flow in it must do. Rate falls, flowing pressure rises: the well is pushed back up its own inflow curve.

## The curve you solve on is sampled

BONNY-7's tubing curve is built from 37 points, FORCADOS-3's from 65.

BONNY-7's sampled minimum is 604.341111 stb/d and 1477.003621 psia against a true minimum at 20001 points of 627.069742 stb/d and 1476.243252 psia: off by -22.728631 stb/d and 0.76036884 psi. FORCADOS-3's sampled minimum is 1811.804452 stb/d and 2348.447272 psia against 1843.619418 stb/d and 2348.191408 psia: off by -31.814966 stb/d and 0.25586360 psi.

Near a minimum the pressure is flat, so a large error in rate costs almost nothing in pressure. The rate at which the minimum sits is the least reliable feature of the curve. Do not build a rule on it.

## Choosing badly

Put the node in the middle of what you want to study and it becomes invisible: cut downstream of a choke and every choke sweep moves both curves at once.

Report a bottomhole pressure when you computed a wellhead node and you are wrong by the whole column. The rate should survive a change of node. The pressure will not.

## Exercise

Record the dead column at zero rate and the reservoir pressure for each teaching well, and write the signed difference.

Then state what that sign predicts about how many crossings each well can have, before looking at either answer.
