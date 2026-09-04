# What a diagnosis does not decide

`diagnose` returns four things: a bottleneck, a biggest drop, a list of backflows and a list of dead legs. All four are rankings and labels over one solved answer, and a ranking is a claim that must be quoted with its basis.

{{panel:pd-network-explorer}}

## State the basis or do not state the rank

A biggest drop is in psi. A bottleneck is in psi per lb/d, its units are arbitrary and only the order is used. On AGBADA WEST the biggest drop is the AGBADA-2 flowline at 476.806786 psi and the bottleneck is the AGBADA-9 flowline at 1.018377e-1, so a report naming "the worst branch" without saying which question it asked has said nothing.

Two intensities do not subtract, do not add and do not scale into a saving.

## It does not nominate the best lever

A ranking only ever names a branch, and the boundary is not a branch. A derived sweep on the published three well ladder walks the separator pressure instead.

| Separator, psia | Header, psia | Total, lb/d |
| --- | --- | --- |
| 120 | 624.301508 | 9207.229955 |
| 150 | 647.220534 | 9142.361389 |
| 180 | 670.128002 | 9076.922229 |
| 220 | 700.654704 | 8988.773875 |
| 300 | 761.658338 | 8809.356763 |
| 400 | 837.839001 | 8579.087131 |

No diagnosis would ever propose that, because there is no branch to point at.

## It does not say what the network costs a well

That needs two solves and a subtraction, and it is the one number no single-well method can produce. On the teaching network AGBADA-6 makes 3057.021085629 lb/d alone and 2318.356346320 lb/d on the system, losing 24.162893177 percent of itself, while AGBADA-2 loses 12.857585591 percent. Ranking by loss is not ranking by rate.

Deferment is the same shape. Take AGBADA-9 off that system and the survivors gain 767.079317902 lb/d between them, against the 3992.446687538 lb/d it was reported to be making.

## It does not check the answer

The diagnosis comes out of the iteration that produced the pressures. The engine reports converged = true after 11 iterations at a residual of 1.546141e-11 lb/d, and `checkConservation`, which sits in the same file and which `solveNetwork` never calls, reports produced = 13300.677150912 lb/d against delivered = 12955.677150912 lb/d, a gap of 345 lb/d, 2.593852900 percent.

## What it will not model

No pipe hydraulics and no inflow, because both are callbacks the consumer supplies. No temperature, slugging, holdup or transient, since every equation here is steady state. No pump, compressor or choke, because a node is a well, a junction or a sink and nothing else.

## Exercise

Write the four things a diagnosis returns and the unit of each ranking.

Then name three questions a meeting will ask that no diagnosis of one solve can answer, and say what you would run instead.
