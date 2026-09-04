# Where the two curves meet

A producing well is not a rate. It is an agreement between two curves drawn independently, and the rate falls out of the agreement.

{{panel:pd-node-explorer}}

## Two statements about one point

Cut the well at a node. The reservoir side says what pressure the formation can hold there at a given rate. The tubing side says what pressure it needs there to move that rate to the wellhead. Both are pressures at the same point, functions of the same rate, which is the only reason a crossing means anything.

The inflow falls and never turns back. BONNY-7, from a reservoir pressure of 2740 psia, reads 2632.000000 psia at 216 stb/d and 1442.500000 psia at 2595 stb/d.

The outflow is a J. BONNY-7's tubing needs 2545.501142 psia at 4.324444 stb/d, falls to 1476.243252 psia at 627.069742 stb/d, and reaches 12560.087474 psia at 4324.444444 stb/d.

## The swap

The golden case vogelSingleCrossing prints both curves:

| Rate, stb/d | Inflow, psia | Outflow, psia |
| --- | --- | --- |
| 250.0000 | 2128.203024 | 737.500000 |
| 500.0000 | 1688.476324 | 707.142857 |
| 750.0000 | 1119.554905 | 826.973684 |
| 950.0000 | 386.271243 | 998.021739 |

The columns change places between 750.0000 and 950.0000 stb/d. That is where its crossing at 828.401601 stb/d and 886.778426 psia lives. BONNY-7's own crossing is 1355.714057 stb/d at 2062.142971 psia, a drawdown of 677.857029 psi.

## A crossing is not a maximum

BONNY-7's absolute open flow is 4324.444444 stb/d and it operates at a fraction 0.31350017 of it. FORCADOS-3's open flow is 4135.949669 stb/d and it operates at 2125.009203 stb/d, a fraction 0.51378991. The well with less reservoir capacity produces more, because the tubing side decides.

## When there is no meeting

The golden case deadWell has an open flow of 600.000000 stb/d and reports status dead with 0 crossings. Its residual runs 988.172727 psi at 30.0000 stb/d, 1290.000000 psi at 300.0000 stb/d and 1940.762069 psi at 570.0000 stb/d. The tubing wants more than the reservoir has at every rate, and the gap never threatens to close.

Dead is not flowing at zero. Flowing at zero would be a solution at the origin. Dead says there is no solution at all, and the well stays that way until one of the two curves changes.

## What the crossing does not say

Not that the rate pays, not that the crossing holds, not that the curves are right, and nothing about time.

It is also conditional. Hold BONNY-7's wellhead at 280 psia and it gives 1424.991968 stb/d; at 490 psia, 1319.581001 stb/d. Neither curve changed.

## Exercise

In the panel, read the inflow and the outflow pressure at a rate well below the operating point and again well above it. Write the two pairs side by side.

Then say, without using the word intersection, what changed between the two rates that forced a crossing to exist between them.
