# What the network costs each well

Solve each well alone on its own flowline, then solve all of them together, and the difference between the two columns is the entire reason this module exists.

{{panel:pd-network-explorer}}

## Two columns that no single method produces

On the teaching network AGBADA WEST, four wells against a separator at 265 psia, each well is first solved alone on its own flowline and then on the system.

| Well | Alone, lb/d | On the system, lb/d | Lost, lb/d | Lost, percent | Wellhead rose, psi |
| --- | --- | --- | --- | --- | --- |
| AGBADA-2 | 6890.874160167 | 6004.874117054 | 886.000043113 | 12.857585591 | 364.386971 |
| AGBADA-6 | 3057.021085629 | 2318.356346320 | 738.664739309 | 24.162893177 | 485.665999 |
| AGBADA-9 | 4750.157046765 | 3992.446687538 | 757.710359227 | 15.951269648 | 347.691369 |
| AGBADA-12 | 985.000000000 | 985.000000000 | 0.000000000 | 0.000000000 | 527.461813 |

The four solo rates add to 15683.052292561 lb/d and the system produces 13300.677150912 lb/d, so the network costs 2382.375141650 lb/d, which is 15.190761959 percent.

## Neither column can be reached from the other

The left column is what a single-well studio gives you: one well, one line, one boundary at 265 psia. The right column needs the other three wells present, because every wellhead in it was raised by them. AGBADA-2's wellhead moved from 892.889543 psia alone to 1257.276514 psia on the system, and nothing in AGBADA-2 asked for that.

Run the same comparison the other way and it fails too. You cannot recover a solo rate from a system rate without knowing what the system was doing, and the system was doing all of it at once.

## The row that behaves differently

AGBADA-12 loses 0.000000000 lb/d, and that zero is not a well that escaped the fight. It is held to an allocation of 985 lb/d on a flowline that cannot pass more than 640 lb/d, so its reported rate is a cap rather than a response. Its wellhead rose 527.461813 psi, more than any other well on the list, and its rate did not move at all because nothing about its reported rate depends on pressure once the allocation binds. Keep the row and read it as what it is.

## What was checked on this answer

The engine returns converged = true after 11 iterations at a reported residual of 1.546141e-11 lb/d, with pinned = t4. `checkConservation`, which `solveNetwork` never calls, reports produced = 13300.677150912 lb/d against delivered = 12955.677150912 lb/d, a gap of 345.000000000 lb/d, 2.593852900 percent of what the engine says was produced.

The solo runs are clean by the same measure: gaps of 9.094947e-13, -4.547474e-13 and 0.000000e+0 lb/d on the first three wells. The fourth reports a gap of 3.450000e+2 lb/d on its own line, relative 3.502538e-1, before it ever meets a network.

## The mistake

Quoting the 15.190761959 percent as a property of the field. It is a property of this solve, at this separator pressure, with these conductances, and any of the three moving moves it.

## Exercise

Record all four solo rates and all four system rates in the panel. Then say which well you would test first if somebody handed you only the right column.
