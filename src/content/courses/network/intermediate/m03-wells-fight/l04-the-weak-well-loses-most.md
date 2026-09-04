# The weak well loses most

Rank the wells on the teaching network by what the network costs them and the order is not the order they appear in on a production report. The strongest well loses the smallest share of itself.

{{panel:pd-network-explorer}}

## Two rankings that disagree

Ranked by percentage lost: AGBADA-6 at 24.1629, AGBADA-9 at 15.9513, AGBADA-2 at 12.8576 and AGBADA-12 at 0.0000 percent.

Ranked by rate on the system: AGBADA-2 at 6004.8741, AGBADA-9 at 3992.4467, AGBADA-6 at 2318.3563 and AGBADA-12 at 985.0000 lb/d.

The well at the top of the first list is third on the second. The allocation meeting uses the second list.

## Why margin decides it

AGBADA-6 has a Vogel qmax of 3300 lb/d at a reservoir pressure of 1650 psia, the lowest reservoir pressure of the three responding wells. Alone it flows at a wellhead of 335.147329 psia against the separator at 265 psia, a line drop of only 70.147329090 psi, and it makes 3057.021085629 lb/d.

Put it on the system and its wellhead is 820.813328 psia. The header came up under it by 485.665999 psi, and a well with 1650 psia of reservoir behind it has very little left to give before it stops flowing at all. It ends at 2318.356346320 lb/d.

AGBADA-2 has 8100 lb/d of qmax at 2750 psia. Its wellhead rose 364.386971 psi, less than AGBADA-6 saw, and against far more reservoir pressure. It gives up 12.857585591 percent.

A rise in the header is not a fixed tax. It is a fixed number of psi taken out of whatever margin a well had, and the weak well had the least.

## The row that is zero and is not fine

AGBADA-12 shows 0.000000000 percent lost, and its wellhead rose 527.461813 psi, the largest rise on the network. Both are true and neither is good news. The well is held to an allocation of 985 lb/d on a flowline capped at 640 lb/d, so its reported rate stopped depending on pressure before the network ever squeezed it. A zero in this column means the reported number cannot move, not that the well did not suffer.

## What was checked on this answer

Converged = true after 11 iterations at a reported residual of 1.546141e-11 lb/d, with pinned = t4. `checkConservation`, never called by the solver, reports a gap of 345.000000000 lb/d between produced = 13300.677150912 lb/d and delivered = 12955.677150912 lb/d, which is 2.593852900 percent. The percentages in both rankings are computed from rates the engine reported, and one of those rates is 345 lb/d larger than what its flowline passes.

## The mistake

Choosing which well to work over from the rate column. The rate column says AGBADA-12 is the small one. The loss column says AGBADA-6 is giving up nearly a quarter of itself to a header it shares, which is a compression or a looping decision rather than a well decision, and no amount of downhole work on AGBADA-6 recovers it.

## Exercise

Build both rankings from a single solve in the panel. Then name the one action that would move every well in the loss column at once.
