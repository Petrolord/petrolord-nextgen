# Two sign conventions, one word

`flows[b]` is signed from the drawn `from` to the drawn `to`. `branchStreams[b].massLbD` is the mass along the direction the solve found, so it is always positive.

{{panel:pd-fight-explorer}}

## Both conventions are defensible

A signed flow is the only way a reader learns the drawing was wrong. A stream mass is what a pipe carries and what a separator is told, so leaving it unsigned is right too. Carrying both in one object, both in lb/d, both called a mass, is the mistake: the caller picks one by reading a field name.

## Differencing the two on the teaching network

AGBADA WEST, separator at 265 psia, on the answer the solve returned.

| Branch | flows, lb/d | branchStreams mass, lb/d | Difference, lb/d |
| --- | --- | --- | --- |
| e1 AGBADA-2 flowline | 6004.874117054 | 6004.874117054 | 0.000000000 |
| e2 AGBADA-6 flowline | 2318.356346320 | 2318.356346320 | 0.000000000 |
| e3 AGBADA-9 flowline | 3992.446687538 | 3992.446687538 | 0.000000000 |
| e4 AGBADA-12 flowline | 640.000000000 | 985.000000000 | 345.000000000 |
| c1 North bypass | 9553.095088544 | 9898.095088544 | 345.000000000 |
| c2 Crosslink | -589.864625170 | 589.864625170 | 1179.729250341 |
| c3 Loop leg | 3402.582062368 | 3402.582062368 | 0.000000000 |
| tk Trunk | 12955.677150912 | 13300.677150912 | 345.000000000 |

## The row the sign convention actually caused

The crosslink is drawn from the north manifold to the loop tee and the solve returns -589.864625170 lb/d, so it carries that much the other way. The pressure across it in the drawn sense is -1.193210823 psi, so the drawn downstream end is the higher, and `diagnose` names it: backflows, c2 (Crosslink) at -589.864625 lb/d. The difference on that row is 1179.729250341 lb/d, exactly twice the 589.864625170 lb/d the branch carries. That factor of two is the fingerprint of a sign convention. A mass that is simply wrong does not double.

## Two different causes sharing one column

Three rows show 345.000000000 lb/d and one shows 1179.729250341 lb/d, and they have no common cause. The 345.000000000 lb/d rows are a second mass the propagation was handed and never checked, downstream of a well allocated 985 lb/d on a line passing 640 lb/d. The 1179.729250341 lb/d row is one mass written twice under two conventions. A reader who calls the whole column a conservation failure has merged a data defect with a bookkeeping one, and will fix the wrong one.

## What it looks like when nothing is wrong

Four of the eight rows are exactly zero. It is tempting to read the column as zero wherever the network ran as drawn and large where it did not, which would make it a clean test of the convention. It is not: the three rows at 345.000000000 lb/d all ran as drawn. What separates them is the factor of two, since only the reversed branch returns twice the mass it carries. The engine reports this answer as `converged` true after 11 iterations at `residualLbD` 1.546141e-11 lb/d, and `checkConservation` on the same answer reports a gap of 345.000000000 lb/d against 13300.677150912 lb/d produced, 2.593852900 percent.

## Exercise

Write the crosslink's `flows` value, its `branchStreams` mass and their difference, then say what their ratio tells you. Separate the nonzero rows by cause and say which a comparison against `wellRates` would remove.
