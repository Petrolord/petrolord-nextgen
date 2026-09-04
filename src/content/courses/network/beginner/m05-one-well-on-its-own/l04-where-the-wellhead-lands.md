# Where the wellhead lands

The wellhead pressure is the answer, not the input. It is the one place where the rate the reservoir will give and the rate the line will take are the same number.

{{panel:pd-trunk-explorer}}

## The ladder from the reservoir to the separator

Every solo run spends the reservoir pressure twice: once getting fluid to the wellhead and once getting it down the line to the boundary at 265 psia.

| Well | Reservoir, psia | Drawdown, psi | Wellhead, psia | Line drop, psi | Rate, lb/d |
| --- | --- | --- | --- | --- | --- |
| t1, AGBADA-2 | 2750 | 1857.110457 | 892.889543025 | 627.889543025 | 6890.874160167 |
| t2, AGBADA-6 | 1650 | 1314.852671 | 335.147329090 | 70.147329090 | 3057.021085629 |
| t3, AGBADA-9 | 2350 | 1509.446690 | 840.553310094 | 575.553310094 | 4750.157046765 |
| t4, AGBADA-12 | 1450 | 1146.285551 | 303.714448989 | 38.714448989 | 985.000000000 |

AGBADA-6 lands at 335.147329090 psia because its line is slack enough to reach the separator for 70.147329090 psi. AGBADA-9 lands at 840.553310094 psia because its line takes 575.553310094 psi to do the same job.

## Why there is exactly one landing point

Raise the wellhead pressure and the inflow falls, because the module requires it to be monotone decreasing. Raise it and the line carries more, because a bigger difference across the branch means more mass. One curve falls and one rises, so they cross once, and the crossing is the wellhead.

Newton finds it in 7 iterations on AGBADA-2, AGBADA-6 and AGBADA-9, and in 4 on AGBADA-12. A handful of steps is what a two node problem should cost.

## What converged means on each row

| Well | Reported residual, lb/d | Pinned | Conservation gap, lb/d |
| --- | --- | --- | --- |
| t1 | 9.0949e-13 | none | 9.094947e-13 |
| t2 | 4.5475e-13 | none | -4.547474e-13 |
| t3 | 0.0000e+0 | none | 0.000000e+0 |
| t4 | 0.0000e+0 | t4 | 3.450000e+2 |

Three ladders close. The fourth reports `converged: true` with a residual of 0.0000e+0 lb/d and a conservation gap of 3.450000e+2 lb/d, relative 3.502538e-1, and its warning says the node "carried nothing and nothing depended on its pressure". A flag and a check are not the same statement, and only one of them was computed by something other than the iteration.

## What the landing point does not say

It does not say where the pressure is measured. The node is whatever pressure the inflow callback and the branch callback both take, and this module supplies neither, so a wellhead here means whatever the two functions handed in agree it means. Nothing below `MIN_PRESSURE_PSIA = 14.7 psia` is allowed, and that is the only opinion the module has about the number.

## The mistake

Reading the wellhead off a gauge and running the inflow at it. That answers a different question: what the well would make if the wellhead sat there, rather than where the wellhead sits.

## Exercise

For each well, add the drawdown and the line drop to the separator pressure and confirm that the reservoir pressure comes back.

Then say why AGBADA-12 lands at the lowest wellhead of the four while making the least.
